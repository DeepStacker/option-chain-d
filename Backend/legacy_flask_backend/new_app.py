# 📌 Must be first line
import eventlet

eventlet.monkey_patch()

# ✅ All imports after monkey-patch
from flask import Flask, jsonify, request, send_from_directory
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from routes.auth import auth_bp
from utils.auth_middleware import firebase_token_required as token_required
from models.user import db
from APIs import App
import msgpack
import os
from dotenv import load_dotenv
import logging

# ————————————————————————
# Environment & Logging Setup
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ————————————————————————
# Flask App Setup
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your-secret-key")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///app.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "uploads")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# ————————————————————————
# CORS & Rate Limiting
CORS(
    app,
    origins=[
        "https://main.dtruazmd8dsaa.amplifyapp.com",
        "https://stockify-oc.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    supports_credentials=True,
)

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["60 per minute"],
    storage_uri="memory://",
)

# ————————————————————————
# Database Initialization
db.init_app(app)
with app.app_context():
    db.create_all()

# ————————————————————————
# SocketIO Setup (Eventlet)
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=True,
    ping_timeout=500,
    ping_interval=1000,
    async_mode="eventlet",
)


# ————————————————————————
# Health & Static Uploads Endpoints
@app.route("/health", methods=["GET"])
def healthcheck():
    return {"status": "ok", "message": "API is running"}, 200


@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# ————————————————————————
# WebSocket Stream Management
client_streams = {}


def broadcast_live_data(client_id, sid, exp_sid):
    logger.info(f"[{client_id}] Stream started: SID={sid}, EXP_SID={exp_sid}")
    while client_streams.get(client_id, {}).get("active", False):
        try:
            params = client_streams[client_id]
            if params["sid"] != sid or params["exp_sid"] != exp_sid:
                logger.info(f"[{client_id}] Params changed; stopping stream")
                break

            data = App.get_live_data(sid, exp_sid)
            packed = msgpack.packb(data)
            socketio.emit("live_data", packed, room=client_id)

            eventlet.sleep(1)
        except Exception as e:
            logger.error(f"[{client_id}] Stream error: {e}")
            break
    logger.info(f"[{client_id}] Stream stopped")


@socketio.on("connect")
def on_connect():
    sid = request.sid
    client_streams[sid] = {"active": False}
    logger.info(f"Client connected: {sid}")
    socketio.emit("connection_established", {"sid": sid}, room=sid)


@socketio.on("disconnect")
def on_disconnect():
    sid = request.sid
    client_streams.pop(sid, None)
    logger.info(f"Client disconnected: {sid}")


@socketio.on("start_stream")
def on_start_stream(data):
    sid = request.sid
    sym = data.get("sid", "NIFTY")
    exp = data.get("exp_sid", "1419013800")
    logger.info(f"[{sid}] start_stream: {sym}, exp={exp}")

    # Stop old if exists
    client_streams[sid]["active"] = False
    eventlet.sleep(0.1)

    client_streams[sid] = {"active": True, "sid": sym, "exp_sid": exp}
    socketio.start_background_task(broadcast_live_data, sid, sym, exp)
    socketio.emit(
        "stream_started", {"status": "Streaming started", "client_id": sid}, room=sid
    )


@socketio.on("stop_stream")
def on_stop_stream():
    sid = request.sid
    if sid in client_streams:
        client_streams[sid]["active"] = False
        eventlet.sleep(0.1)
        client_streams.pop(sid, None)
        socketio.emit("stream_stopped", {"status": "Streaming stopped"}, room=sid)


# ————————————————————————
# Auth Routes & APIs (unchanged)
app.register_blueprint(auth_bp, url_prefix="/api/auth")


@app.route("/api/percentage-data/", methods=["POST", "OPTIONS"])
@token_required
def get_percentage_data(current_user):
    if request.method == "OPTIONS":
        return "", 200
    data = request.get_json() or {}
    missing = [f for f in ["sid", "exp_sid", "strike", "option_type"] if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400
    return jsonify(App.get_percentage_data(**data)), 200


# — repeat similar patterns for /iv-data/, /delta-data/, /fut-data/ …


# ————————————————————————
# CORS Headers (optional fine-tuning)
@app.after_request
def after_request(res):
    allow = [
        "https://stockify-oc.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    if request.origin in allow:
        res.headers["Access-Control-Allow-Origin"] = request.origin
    res.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,OPTIONS"
    res.headers["Access-Control-Max-Age"] = "3600"
    return res


# ————————————————————————
# Root Route
@limiter.limit("200 per day")
@app.route("/")
def home():
    return {"message": "Authentication API is running"}


# ————————————————————————
# Error Handling
@app.errorhandler(Exception)
def handle_error(e):
    logger.error(f"Internal Error: {e}")
    return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


# ————————————————————————
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=False)
