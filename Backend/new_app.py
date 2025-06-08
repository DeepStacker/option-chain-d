from flask import Flask, jsonify, request, send_from_directory
from flask_socketio import SocketIO
from flask_cors import CORS
from routes.auth import auth_bp
from utils.auth_middleware import firebase_token_required as token_required
from models.user import db
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from APIs import App
import msgpack
import os
import logging
from dotenv import load_dotenv
import eventlet

eventlet.monkey_patch()  # Monkey patch everything

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flask app setup
app = Flask(__name__)

# Configure Flask app
app.config["SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "your-secret-key")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL", "sqlite:///app.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "uploads")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max file size
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# CORS
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

# DB
db.init_app(app)
with app.app_context():
    db.create_all()

# Limiter
limiter = Limiter(
    app=app, key_func=get_remote_address, default_limits=["60 per minute"]
)

# SocketIO
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=True,
    ping_timeout=500,
    ping_interval=1000,
    async_mode="eventlet",
)

client_streams = {}


@app.route("/health", methods=["GET"])
def healthcheck():
    return {"status": "ok", "message": "API is running"}, 200


@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


def broadcast_live_data(client_id, sid, exp_sid):
    logger.info(
        f"Starting live data broadcast - Client ID: {client_id}, SID: {sid}, EXP_SID: {exp_sid}"
    )
    while client_streams.get(client_id, {}).get("active", False):
        try:
            current_params = client_streams[client_id]
            if current_params["sid"] != sid or current_params["exp_sid"] != exp_sid:
                logger.info(
                    f"Stream parameters changed for client {client_id}, stopping current stream"
                )
                break

            live_data = App.get_live_data(sid, exp_sid)
            binary_data = msgpack.packb(live_data)
            socketio.emit("live_data", binary_data, room=client_id)

            eventlet.sleep(1)
        except Exception as e:
            logger.error(
                f"Error in live data broadcast - Client ID: {client_id}: {str(e)}"
            )
            break
    logger.info(f"Stopped live data broadcast - Client ID: {client_id}")


@socketio.on("connect")
def handle_connect():
    try:
        client_id = request.sid
        client_streams[client_id] = {"active": False}
        logger.info(f"WebSocket client connected - ID: {client_id}")
        socketio.emit("connection_established", {"sid": client_id}, room=client_id)
    except Exception as e:
        logger.error(f"Error in handle_connect: {str(e)}")


@socketio.on("disconnect")
def handle_disconnect():
    client_id = request.sid
    if client_id in client_streams:
        client_streams[client_id]["active"] = False
        del client_streams[client_id]
    logger.info(f"WebSocket client disconnected - ID: {client_id}")


@socketio.on("start_stream")
def start_streaming(data):
    try:
        client_id = request.sid
        sid = data.get("sid", "NIFTY")
        exp_sid = data.get("exp_sid", "1419013800")

        logger.info(
            f"Received start_stream request - Client ID: {client_id}, SID: {sid}, EXP_SID: {exp_sid}"
        )

        if client_id in client_streams:
            client_streams[client_id]["active"] = False
            eventlet.sleep(0.1)

        client_streams[client_id] = {"active": True, "sid": sid, "exp_sid": exp_sid}
        socketio.start_background_task(
            target=broadcast_live_data, client_id=client_id, sid=sid, exp_sid=exp_sid
        )

        socketio.emit(
            "stream_started",
            {"status": "Streaming started", "client_id": client_id},
            room=client_id,
        )
    except Exception as e:
        logger.error(f"Error in start_streaming: {str(e)}")
        socketio.emit("stream_error", {"error": str(e)}, room=client_id)


@socketio.on("stop_stream")
def stop_streaming():
    client_id = request.sid
    if client_id not in client_streams:
        socketio.emit("stream_stopped", {"status": "No active stream"}, room=client_id)
        return

    client_streams[client_id]["active"] = False
    eventlet.sleep(0.1)
    del client_streams[client_id]
    socketio.emit("stream_stopped", {"status": "Streaming stopped"}, room=client_id)


# Auth Blueprint
app.register_blueprint(auth_bp, url_prefix="/api/auth")


# Sample protected route
@limiter.limit("200 per day")
@app.route("/")
def home():
    return {"message": "Authentication API is running"}


# CORS Headers
@app.after_request
def after_request(response):
    if request.origin in [
        "https://stockify-oc.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]:
        response.headers.add("Access-Control-Allow-Origin", request.origin)
    response.headers.add(
        "Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS"
    )
    response.headers.add("Access-Control-Max-Age", "3600")
    return response


# Error Handler
@app.errorhandler(Exception)
def handle_error(error):
    logger.error(f"An error occurred: {str(error)}")
    return jsonify({"error": "Internal Server Error", "message": str(error)}), 500


# Your other routes (iv-data, delta-data, fut-data, etc.) stay unchanged...

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=False)
