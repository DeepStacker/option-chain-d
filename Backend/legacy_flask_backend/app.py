from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS, cross_origin
from flask_migrate import Migrate
from APIs import App
import logging
from datetime import datetime, timedelta
import time
from flask_socketio import SocketIO
import threading
from models.user import db, User, UserRole
from routes.auth import auth_bp
from utils.auth_middleware import (
    firebase_token_required as token_required,
    admin_required as role_required,
)
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from dotenv import load_dotenv
from utils.email_service import mail
import msgpack

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Set logging level for engineio, werkzeug, and socketio to WARNING
logging.getLogger('engineio.server').setLevel(logging.WARNING)
logging.getLogger('werkzeug').setLevel(logging.WARNING)
logging.getLogger('socketio.server').setLevel(logging.WARNING)

# **FIXED CORS CONFIGURATION - NO WILDCARDS WITH CREDENTIALS**
ALLOWED_ORIGINS = [
    "https://main.dtruazmd8dsaa.amplifyapp.com",
    "https://stockify-oc.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ALLOWED_ORIGINS,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": [
                "Content-Type",
                "Authorization",
                "Access-Control-Allow-Credentials",
            ],
            "supports_credentials": True,
        }
    },
)


# **FIXED SECURITY HEADERS - DYNAMIC ORIGIN HANDLING**
@app.after_request
def add_security_headers(response):
    """Add security headers with proper CORS origin handling"""
    # Get the origin from the request
    origin = request.headers.get("Origin")

    # Only set CORS headers if origin is in allowed list
    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"

    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Strict-Transport-Security"] = (
        "max-age=31536000; includeSubDomains"
    )
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
    response.headers["Access-Control-Allow-Headers"] = (
        "Content-Type, Authorization, Accept"
    )
    response.headers["Access-Control-Allow-Methods"] = "GET, PUT, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Max-Age"] = "3600"

    return response


# Flask configuration
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "your-secret-key")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL", "sqlite:///app.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Email configuration
app.config["MAIL_SERVER"] = os.environ.get("MAIL_SERVER")
app.config["MAIL_PORT"] = int(os.environ.get("MAIL_PORT", 587))
app.config["MAIL_USE_TLS"] = os.environ.get("MAIL_USE_TLS", "True") == "True"
app.config["MAIL_USERNAME"] = os.environ.get("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.environ.get("MAIL_PASSWORD")
app.config["MAIL_DEFAULT_SENDER"] = os.environ.get("MAIL_USERNAME")
app.config["FRONTEND_URL"] = os.environ.get("FRONTEND_URL", ALLOWED_ORIGINS)

# Upload folder configuration
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "uploads")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max file size
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
mail.init_app(app)

# **FIXED SOCKETIO CONFIGURATION - EXPLICIT ORIGINS**
socketio = SocketIO(
    app,
    cors_allowed_origins=ALLOWED_ORIGINS,  # No wildcards
    async_mode="threading",
    ping_timeout=500,
    ping_interval=1000,
    always_connect=True,
    logger=True,
    engineio_logger=True,
    cors_credentials=True,  # Enable credentials
)

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    storage_uri="memory://",
    strategy="fixed-window",
    default_limits=["100 per minute"],
)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")

# Create database tables
with app.app_context():
    db.create_all()

# Global client streams for WebSocket management
client_streams = {}


# **ERROR HANDLERS**
@app.errorhandler(404)
def not_found_error(error):
    logger.error(f"404 error - Route not found: {request.url}")
    return (
        jsonify(
            {
                "error": "Not Found",
                "message": "The requested URL was not found on the server.",
                "url": request.url,
            }
        ),
        404,
    )


@app.errorhandler(Exception)
def handle_error(error):
    logger.error(f"Unhandled exception: {str(error)}", exc_info=True)
    return (
        jsonify(
            {
                "error": "Internal Server Error",
                "message": "An unexpected error occurred. Please try again later.",
            }
        ),
        500,
    )


# **UNIFIED EXPIRY DATE ENDPOINT**
@app.route("/api/exp-date", methods=["GET", "OPTIONS"], strict_slashes=False)
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def get_expiry_dates():
    if request.method == "OPTIONS":
        return "", 200

    try:
        symbol = request.args.get("symbol") or request.args.get("sid")
        if not symbol:
            logger.warning("Missing symbol parameter in exp-date request")
            return (
                jsonify(
                    {"error": "Symbol parameter is required (use 'symbol' or 'sid')"}
                ),
                400,
            )

        logger.info(f"Fetching expiry dates for symbol: {symbol}")

        app_instance = App()
        response = app_instance.get_exp_date(symbol)

        if isinstance(response, tuple):
            logger.info(f"Tuple response received for {symbol}")
            return response

        if response and isinstance(response, dict):
            logger.info(f"Successfully found expiry dates for {symbol}")
            return jsonify(response), 200
        elif response and isinstance(response, list):
            logger.info(f"Successfully found expiry dates list for {symbol}")
            return jsonify({"expiry_dates": response}), 200
        else:
            logger.warning(f"No expiry dates found for {symbol}")
            return jsonify({"error": "No expiry dates found", "symbol": symbol}), 404

    except Exception as e:
        logger.error(
            f"Error fetching expiry dates for {symbol}: {str(e)}", exc_info=True
        )
        return jsonify({"error": f"Server error: {str(e)}", "symbol": symbol}), 500


# **WEBSOCKET EVENTS**
@socketio.on("connect")
def handle_connect():
    try:
        client_id = request.sid
        client_streams[client_id] = {"active": False}
        logger.info(f"WebSocket client connected - ID: {client_id}")
        socketio.emit("connection_established", {"sid": client_id}, room=client_id)
        return True
    except Exception as e:
        logger.error(f"Error in handle_connect: {str(e)}")
        return False


@socketio.on("disconnect")
def handle_disconnect():
    client_id = request.sid
    if client_id in client_streams:
        client_streams[client_id]["active"] = False
        del client_streams[client_id]
    logger.info(f"WebSocket client disconnected - ID: {client_id}")


def broadcast_live_data(client_id, sid, exp_sid):
    """Background function to broadcast live data to specific client"""
    logger.info(
        f"Starting live data broadcast - Client ID: {client_id}, SID: {sid}, EXP_SID: {exp_sid}"
    )

    while client_streams.get(client_id, {}).get("active", False):
        try:
            current_params = client_streams[client_id]
            if current_params["sid"] != sid or current_params["exp_sid"] != exp_sid:
                logger.info(
                    f"Stream parameters changed for client {client_id}, stopping current stream. Old parameters: SID={current_params['sid']}, EXP_SID={current_params['exp_sid']}. New parameters: SID={sid}, EXP_SID={exp_sid}"
                )
                break

            live_data = App.get_live_data(sid, exp_sid)
            binary_data = msgpack.packb(live_data)
            socketio.emit("live_data", binary_data, room=client_id)

            time.sleep(1)
        except Exception as e:
            logger.error(
                f"Error in live data broadcast - Client ID: {client_id}: {str(e)}"
            )
            break

    logger.info(f"Stopped live data broadcast - Client ID: {client_id}")


@socketio.on("start_stream")
def start_streaming(data):
    try:
        client_id = request.sid
        sid = data.get("sid", "NIFTY")
        exp_sid = data.get("exp_sid", "1419013800")

        logger.info(f"Received start_stream request - Client ID: {client_id}")
        # logger.info(f"Received start_stream request - Client ID: {client_id}, SID: {sid}, EXP_SID: {exp_sid}")

        if client_id in client_streams:
            logger.info(f"Stopping existing stream for client {client_id} before starting a new one.")
            client_streams[client_id]["active"] = False
            time.sleep(0.1)

        client_streams[client_id] = {"active": True, "sid": sid, "exp_sid": exp_sid}

        thread = threading.Thread(
            target=broadcast_live_data, args=(client_id, sid, exp_sid)
        )
        thread.daemon = True
        thread.start()

        socketio.emit(
            "stream_started",
            {"status": "Streaming started", "client_id": client_id},
            room=client_id,
        )
        # logger.info(f"Started streaming thread - Client ID: {client_id}")
    except Exception as e:
        logger.error(f"Error in start_streaming: {str(e)}")
        socketio.emit("stream_error", {"error": str(e)}, room=client_id)


@socketio.on("stop_stream")
def stop_streaming():
    client_id = request.sid

    if client_id not in client_streams:
        logger.warning(f"No active stream found - Client ID: {client_id}")
        socketio.emit("stream_stopped", {"status": "No active stream"}, room=client_id)
        return

    client_streams[client_id]["active"] = False
    time.sleep(0.1)
    if client_id in client_streams:
        del client_streams[client_id]

    logger.info(f"Stopped streaming for client {client_id}")
    # logger.info(f"Stopped streaming for client {client_id}")
    socketio.emit("stream_stopped", {"status": "Streaming stopped"}, room=client_id)


# **OTHER API ENDPOINTS**
@app.route("/api/health", methods=["GET"])
def healthcheck():
    return {"status": "ok", "message": "API is running", "websocket": "enabled"}, 200


@app.route("/api/option-chain", methods=["GET", "OPTIONS"], strict_slashes=False)
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def get_option_chain():
    if request.method == "OPTIONS":
        return "", 200

    try:
        symbol = request.args.get("symbol") or request.args.get("sid")
        exp_date = request.args.get("expiry") or request.args.get("exp")

        if not symbol or not exp_date:
            return (
                jsonify({"error": "Both symbol and expiry parameters are required"}),
                400,
            )

        logger.info(f"Fetching option chain for {symbol} expiry {exp_date}")
        app_instance = App()
        option_chain_data = app_instance.get_live_data(symbol, exp_date)

        if option_chain_data:
            return jsonify(option_chain_data), 200
        else:
            logger.warning(f"No data found for {symbol} expiry {exp_date}")
            return jsonify({"error": "No data found"}), 404

    except Exception as e:
        logger.error(f"Error fetching option chain: {str(e)}")
        return jsonify({"error": str(e)}), 500


# **PROTECTED ENDPOINTS**
@app.route("/api/live-data", methods=["GET"], strict_slashes=False)
@token_required
@limiter.limit("500 per minute")
def live_data(current_user):
    symbol = request.args.get("sid") or request.args.get("symbol")
    exp = request.args.get("exp_sid") or request.args.get("expiry")
    return App.get_live_data(symbol, exp)


@app.route("/api/percentage-data", methods=["POST"], strict_slashes=False)
@token_required
@limiter.limit("100 per minute")
def percentage_data(current_user):
    data = request.json
    symbol = data.get("sid") or data.get("symbol")
    exp = data.get("exp_sid") or data.get("expiry")
    isCe = data.get("option_type")
    strike = data.get("strike")

    response, status_code = App.get_percentage_data(symbol, exp, isCe, strike)
    return response, status_code


# **OPTIONS HANDLER**
@app.route("/api/<path:path>", methods=["OPTIONS"])
def handle_options(path):
    return "", 200


# **STATIC FILE SERVING**
@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@limiter.limit("200 per day")
@app.route("/")
def home():
    return {"message": "Trading API with WebSocket support is running"}


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

        try:
            admin_user = User.query.filter_by(email="admin@admin.com").first()
            if not admin_user:
                admin_user = User(
                    firebase_uid="admin_firebase_uid",
                    username="admin",
                    email="admin@admin.com",
                    role=UserRole.ADMIN,
                    is_email_verified=True,
                    login_provider="email",
                )
                db.session.add(admin_user)
                db.session.commit()
        except Exception as e:
            print(f"Error creating admin user: {e}")
            db.session.rollback()

    try:
        socketio.run(app, host="0.0.0.0", port=10001, debug=True)
    except Exception as e:
        logger.error(f"Error during socketio.run: {str(e)}", exc_info=True)
