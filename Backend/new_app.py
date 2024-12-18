from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
from routes.auth import auth_bp, token_required
from models.user import db
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from dotenv import load_dotenv
import logging
from logging.handlers import RotatingFileHandler
import time
from APIs import App

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flask app setup
app = Flask(__name__)

# Configure Flask app
app.config["SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize extensions with specific CORS configuration
CORS(app, resources={
    r"/*": {
        "origins": [
            os.environ.get('FRONTEND_URL', 'http://localhost:5173'),
            "http://127.0.0.1:5173",
            "http://192.168.56.1:5173",
            "https://stockify-oc.vercel.app",
            "https://stockify-oc.onrender.com",
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
        "supports_credentials": True
    }
})

db.init_app(app)
socketio = SocketIO(app, 
    cors_allowed_origins=[
        os.environ.get('FRONTEND_URL', 'http://localhost:5173'),
        "http://127.0.0.1:5173",
        "http://192.168.56.1:5173",
        "https://stockify-oc.vercel.app",
        "https://stockify-oc.onrender.com",
    ],
    logger=True,
    engineio_logger=True,
    ping_timeout=5000,
    ping_interval=25000,
    async_mode='threading',
    always_connect=True,
    cors_credentials=True
)

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    storage_uri="memory://",
    strategy="fixed-window",
    default_limits=["200 per day"]
)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')

# Create database tables
with app.app_context():
    db.create_all()

# Event to control the live data stream
client_streams = {}  # Dictionary to track active streams per client

def broadcast_live_data(client_id, sid, exp_sid):
    """Send live data to specific client every 5 seconds."""
    logger.info(f"Starting live data broadcast - Client ID: {client_id}, SID: {sid}, EXP_SID: {exp_sid}")
    
    while client_streams.get(client_id, {}).get("active", False):
        try:
            # Check if the stream parameters have changed
            current_params = client_streams[client_id]
            if current_params["sid"] != sid or current_params["exp_sid"] != exp_sid:
                logger.info(f"Stream parameters changed for client {client_id}, stopping current stream")
                break
            
            # Here you would typically fetch live data
            live_data = App.get_live_data(sid, exp_sid)
            socketio.emit("live_data", live_data, room=client_id)
            time.sleep(10)  # No delay for real-time data
            
        except Exception as e:
            logger.error(f"Error in live data broadcast - Client ID: {client_id}: {str(e)}")
            break

    logger.info(f"Stopped live data broadcast - Client ID: {client_id}")

@socketio.on("connect")
def handle_connect():
    try:
        client_id = request.sid
        client_streams[client_id] = {"active": False}
        logger.info(f"WebSocket client connected - ID: {client_id}")
        socketio.emit('connection_established', {'sid': client_id}, room=client_id)
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

@socketio.on("start_stream")
def start_streaming(data):
    try:
        client_id = request.sid
        sid = data.get("sid", "NIFTY")
        exp_sid = data.get("exp_sid", "1419013800")
        
        logger.info(f"Received start_stream request - Client ID: {client_id}, SID: {sid}, EXP_SID: {exp_sid}")
        
        # Stop any existing stream for this client
        if client_id in client_streams:
            client_streams[client_id]["active"] = False
            time.sleep(0.1)  # Small delay to ensure the previous stream stops
        
        # Start new stream with updated parameters
        client_streams[client_id] = {
            "active": True,
            "sid": sid,
            "exp_sid": exp_sid
        }
        
        # Start the broadcast in a background thread
        from threading import Thread
        thread = Thread(target=broadcast_live_data, args=(client_id, sid, exp_sid))
        thread.daemon = True
        thread.start()
        
        logger.info(f"Started streaming thread - Client ID: {client_id}")
        socketio.emit("stream_started", {"status": "Streaming started", "client_id": client_id}, room=client_id)
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
    time.sleep(0.1)  # Small delay to ensure the stream stops
    del client_streams[client_id]
    
    logger.info(f"Stopped streaming - Client ID: {client_id}")
    socketio.emit("stream_stopped", {"status": "Streaming stopped"}, room=client_id)

@limiter.limit("200 per day")
@app.route('/')
def home():
    return {"message": "Authentication API is running"}

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True)
