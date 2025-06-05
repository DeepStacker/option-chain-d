from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from APIs import App
import logging
from datetime import datetime, timedelta
import time
from flask_socketio import SocketIO
import threading
from models.user import db, User, UserRole
from routes.auth import auth_bp
from utils.auth_middleware import firebase_token_required as token_required, admin_required as role_required
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from dotenv import load_dotenv
from utils.email_service import mail
from flask_cors import cross_origin

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configure CORS with more robust settings
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://main.dtruazmd8dsaa.amplifyapp.com",  
            "https://stockify-oc.vercel.app",
            "http://localhost:3000",  
            "http://localhost:5173",  
            "http://127.0.0.1:3000",  
            "http://127.0.0.1:5173",  
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": [
            "Content-Type", 
            "Authorization", 
            "Access-Control-Allow-Credentials"
        ],
        "supports_credentials": True
    }
})

# Configure headers for enhanced security
@app.after_request
def add_security_headers(response):
    """Add security headers to all responses"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    response.headers['Cross-Origin-Resource-Policy'] = 'cross-origin'
    
    return response

# Configure CORS
# Configure Flask app
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
app.config["FRONTEND_URL"] = os.environ.get(
    "FRONTEND_URL", ["https://stockify-oc.vercel.app", "https://main.dtruazmd8dsaa.amplifyapp.com"]
)

# Upload folder configuration
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "uploads")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# Configure static file serving for uploads
app.config["UPLOADED_FILES_DEST"] = app.config["UPLOAD_FOLDER"]
app.config["UPLOADED_FILES_URL"] = "/uploads/"

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
mail.init_app(app)

# Initialize SocketIO with CORS settings
socketio = SocketIO(
    app,
    cors_allowed_origins=["https://main.dtruazmd8dsaa.amplifyapp.com","http://localhost:5173", "https://stockify-oc.vercel.app", "http://16.16.204.22:10001"],
    async_mode="threading",
    ping_timeout=10,
    ping_interval=5,
    always_connect=True,
    logger=True,
    engineio_logger=True
)

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    storage_uri="memory://",
    strategy="fixed-window",
    default_limits=["200 per day"],
)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")

# Create database tables
with app.app_context():
    db.create_all()


# WebSocket events
@socketio.on("connect")
@token_required
def handle_connect(current_user):
    print(f"Client connected: {current_user.username}")


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")

@app.route('/api/health', methods=['GET'])
def healthcheck():
    return {
        "status": "ok",
        "message": "API is running"
    }, 200


# Option Chain Routes
@app.route('/api/exp-date', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_expiry_dates():
    try:
        # Get symbol from either 'symbol' or 'sid' parameter
        symbol = request.args.get('symbol') or request.args.get('sid')
        if not symbol:
            return jsonify({"error": "Symbol parameter is required (use 'symbol' or 'sid')"}), 400

        # app.logger.info(f"Fetching expiry dates for symbol: {symbol}")
        app_instance = App()
        response = app_instance.get_exp_date(symbol)
        
        # If response is a tuple, it means it's an error response
        if isinstance(response, tuple):
            return response
            
        # If we got a valid response
        if response and isinstance(response, dict):
            app.logger.info(f"Found expiry dates for {symbol}")
            return jsonify(response), 200
        else:
            app.logger.warning(f"No expiry dates found for {symbol}")
            return jsonify({"error": "No expiry dates found"}), 404

    except Exception as e:
        app.logger.error(f"Error fetching expiry dates: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/option-chain', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_option_chain():
    try:
        # Get parameters with fallbacks
        symbol = request.args.get('symbol') or request.args.get('sid')
        exp_date = request.args.get('expiry') or request.args.get('exp')
        
        if not symbol or not exp_date:
            return jsonify({"error": "Both symbol and expiry parameters are required"}), 400

        app.logger.info(f"Fetching option chain for {symbol} expiry {exp_date}")
        app_instance = App()
        option_chain_data = app_instance.get_live_data(symbol, exp_date)
        
        if option_chain_data:
            return jsonify(option_chain_data), 200
        else:
            app.logger.warning(f"No data found for {symbol} expiry {exp_date}")
            return jsonify({"error": "No data found"}), 404

    except Exception as e:
        app.logger.error(f"Error fetching option chain: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/percentage', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_percentage():
    try:
        # Get parameters with fallbacks
        symbol = request.args.get('symbol') or request.args.get('sid')
        exp_date = request.args.get('expiry') or request.args.get('exp')
        strike = request.args.get('strike')
        option_type = request.args.get('type')  # 'CE' or 'PE'
        
        if not all([symbol, exp_date, strike, option_type]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        app.logger.info(f"Fetching percentage for {symbol} {exp_date} {strike} {option_type}")
        app_instance = App()
        percentage_data = app_instance.get_percentage_data(symbol, exp_date, option_type == 'CE', float(strike))
        
        if percentage_data is not None:
            return jsonify({"percentage": percentage_data}), 200
        else:
            app.logger.warning(f"No percentage data found for {symbol} {exp_date} {strike} {option_type}")
            return jsonify({"error": "No data found"}), 404

    except Exception as e:
        app.logger.error(f"Error fetching percentage: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/iv', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_iv():
    try:
        symbol = request.args.get('symbol') or request.args.get('sid')
        exp_date = request.args.get('expiry') or request.args.get('exp')
        strike = request.args.get('strike')
        option_type = request.args.get('type')  # 'CE' or 'PE'
        
        if not all([symbol, exp_date, strike, option_type]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        app_instance = App()
        iv_data = app_instance.get_iv_data(symbol, exp_date, option_type == 'CE', float(strike))
        
        if iv_data is not None:
            return jsonify({"iv": iv_data}), 200
        else:
            return jsonify({"error": "No data found"}), 404

    except Exception as e:
        app.logger.error(f"Error fetching IV: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/delta', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_delta():
    try:
        symbol = request.args.get('symbol') or request.args.get('sid')
        exp_date = request.args.get('expiry') or request.args.get('exp')
        strike = request.args.get('strike')
        
        if not all([symbol, exp_date, strike]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        app_instance = App()
        delta_data = app_instance.get_delta_data(symbol, exp_date, float(strike))
        
        if delta_data is not None:
            return jsonify({"delta": delta_data}), 200
        else:
            return jsonify({"error": "No data found"}), 404

    except Exception as e:
        app.logger.error(f"Error fetching delta: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/future', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_future():
    try:
        symbol = request.args.get('symbol') or request.args.get('sid')
        exp_date = request.args.get('expiry') or request.args.get('exp')
        
        if not all([symbol, exp_date]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        app_instance = App()
        future_data = app_instance.get_fut_data(symbol, exp_date)
        
        if future_data is not None:
            return jsonify({"future": future_data}), 200
        else:
            return jsonify({"error": "No data found"}), 404

    except Exception as e:
        app.logger.error(f"Error fetching future data: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Protected API endpoints
@app.route("/api/live-data/", methods=["GET"])
@token_required
@limiter.limit("100 per minute")
def live_data(current_user):
    symbol = request.args.get("sid") or request.args.get("symbol")
    exp = request.args.get("exp_sid") or request.args.get("expiry")
    return App.get_live_data(symbol, exp)


@app.route("/api/exp-date/", methods=["GET"])
@cross_origin(supports_credentials=True)
def exp_date():
    try:
        sid = request.args.get("sid") or request.args.get("symbol")
        if not sid:
            return jsonify({"error": "Symbol parameter is required (use 'sid' or 'symbol')"}), 400
            
        # app.logger.info(f"Fetching expiry dates for symbol: {sid}")
        response = App.get_exp_date(sid)
        
        # If response is a tuple, it means it's an error response
        if isinstance(response, tuple):
            return response
            
        # If we got a valid response
        if response and isinstance(response, dict):
            app.logger.info(f"Found expiry dates for {sid}")
            return jsonify(response), 200
        else:
            app.logger.warning(f"No expiry dates found for {sid}")
            return jsonify({"error": "No expiry dates found"}), 404

    except Exception as e:
        app.logger.error(f"Error fetching expiry dates: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route("/api/percentage-data/", methods=["POST"])
@token_required
@limiter.limit("100 per minute")
def percentage_data(current_user):
    """Endpoint to get percentage data based on strike price."""
    data = request.json
    symbol = data.get("sid") or data.get("symbol")
    exp = data.get("exp_sid") or data.get("expiry")
    isCe = data.get("option_type")
    strike = data.get("strike")

    response, status_code = App.get_percentage_data(symbol, exp, isCe, strike)
    return response, status_code


@app.route("/api/iv-data/", methods=["POST"])
@token_required
@limiter.limit("100 per minute")
def iv_data(current_user):
    """Endpoint to get iv data based on strike price."""
    data = request.json
    symbol = data.get("sid") or data.get("symbol")
    exp = data.get("exp_sid") or data.get("expiry")
    isCe = data.get("option_type")
    strike = data.get("strike")

    response, status_code = App.get_iv_data(symbol, exp, isCe, strike)
    return response, status_code


@app.route("/api/delta-data/", methods=["POST"])
@token_required
@limiter.limit("100 per minute")
def delta_data(current_user):
    """Endpoint to get delta data based on strike price."""
    data = request.json
    symbol = data.get("sid") or data.get("symbol")
    exp = data.get("exp_sid") or data.get("expiry")
    strike = data.get("strike")

    response, status_code = App.get_delta_data(symbol, exp, strike)
    return response, status_code


@app.route("/api/fut-data/", methods=["POST"])
@token_required
@limiter.limit("100 per minute")
def fut_data(current_user):
    """Endpoint to get fut data based on strike price."""
    data = request.json
    symbol = data.get("sid") or data.get("symbol")
    exp = data.get("exp_sid") or data.get("expiry")
    # strike = data.get('strike')

    response, status_code = App.get_fut_data(symbol, exp)
    return response, status_code


@app.route("/api/*", methods=["OPTIONS"])
def handle_options():
    return "", 200  # Respond with status 200 for OPTIONS requests


# Serve static files from uploads directory
@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# Error handlers
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Rate limit exceeded. Please try again later."}), 429


@app.errorhandler(401)
def unauthorized_handler(e):
    return jsonify({"error": "Unauthorized. Please login."}), 401


@app.errorhandler(403)
def forbidden_handler(e):
    return jsonify({"error": "Forbidden. Insufficient permissions."}), 403


@app.errorhandler(500)
def internal_error_handler(e):
    return jsonify({"error": "Internal server error. Please try again later."}), 500


if __name__ == "__main__":
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        
        # Check and create admin user, handling potential migration issues
        try:
            admin_user = User.query.filter_by(email="admin@admin.com").first()
            if not admin_user:
                admin_user = User(
                    firebase_uid="admin_firebase_uid",
                    username="admin",
                    email="admin@admin.com",
                    role=UserRole.ADMIN,
                    is_email_verified=True,
                    login_provider='email'  # Explicitly set login provider
                )
                db.session.add(admin_user)
                db.session.commit()
        except Exception as e:
            print(f"Error creating admin user: {e}")
            db.session.rollback()

    socketio.run(app, host='0.0.0.0', port=10001, debug=True)
