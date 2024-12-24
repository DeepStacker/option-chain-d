from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from APIs import App
import logging
from datetime import datetime, timedelta
import time
from flask_socketio import SocketIO
import threading
from models.user import db, User, UserRole
from routes.auth import auth_bp, token_required, role_required
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from dotenv import load_dotenv
from utils.email_service import mail

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure Flask app
app.config["SECRET_KEY"] = os.environ.get('SECRET_KEY', 'your-secret-key')
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Email configuration
app.config["MAIL_SERVER"] = os.environ.get('MAIL_SERVER')
app.config["MAIL_PORT"] = int(os.environ.get('MAIL_PORT', 587))
app.config["MAIL_USE_TLS"] = os.environ.get('MAIL_USE_TLS', 'True') == 'True'
app.config["MAIL_USERNAME"] = os.environ.get('MAIL_USERNAME')
app.config["MAIL_PASSWORD"] = os.environ.get('MAIL_PASSWORD')
app.config["MAIL_DEFAULT_SENDER"] = os.environ.get('MAIL_USERNAME')
app.config["FRONTEND_URL"] = os.environ.get('FRONTEND_URL', 'https://stockify-oc.vercel.app')

# Upload folder configuration
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Configure static file serving for uploads
app.config['UPLOADED_FILES_DEST'] = app.config['UPLOAD_FOLDER']
app.config['UPLOADED_FILES_URL'] = '/uploads/'

# Initialize CORS with a more permissive configuration
CORS(app, 
    resources={
        r"/*": {
            "origins": ["https://stockify-oc.vercel.app"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Range", "X-Content-Range"],
            "supports_credentials": True,
            "max_age": 3600
        }
    })

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'https://stockify-oc.vercel.app')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Max-Age', '3600')
    return response

# Initialize extensions
db.init_app(app)
mail.init_app(app)

# Initialize SocketIO with CORS settings
socketio = SocketIO(app, 
    cors_allowed_origins=["https://stockify-oc.vercel.app"],
    async_mode='threading',
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
    default_limits=["200 per day"]
)

# Register auth blueprint
app.register_blueprint(auth_bp, url_prefix='/api/auth')

# Create database tables
with app.app_context():
    db.create_all()

# WebSocket events
@socketio.on('connect')
@token_required
def handle_connect(current_user):
    print(f'Client connected: {current_user.username}')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# Protected API endpoints
@app.route("/api/live-data/", methods=["GET"])
@token_required
@limiter.limit("100 per minute")
def live_data(current_user):
    symbol = request.args.get("sid")
    exp = request.args.get("exp_sid")
    return App.get_live_data(symbol, exp)

@app.route("/api/exp-date/", methods=["GET"])
@token_required
@limiter.limit("100 per minute")
def exp_date(current_user):
    sid = request.args.get("sid")
    exp_sid = request.args.get("exp_sid")
    return App.get_exp_date(sid)

@app.route("/api/percentage-data/", methods=["POST"])
@token_required
@limiter.limit("100 per minute")
def percentage_data(current_user):
    """Endpoint to get percentage data based on strike price."""
    data = request.json
    symbol = data.get("sid")
    exp = data.get("exp_sid")
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
    symbol = data.get("sid")
    exp = data.get("exp_sid")
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
    symbol = data.get("sid")
    exp = data.get("exp_sid")
    strike = data.get("strike")

    response, status_code = App.get_delta_data(symbol, exp, strike)
    return response, status_code

@app.route("/api/fut-data/", methods=["POST"])
@token_required
@limiter.limit("100 per minute")
def fut_data(current_user):
    """Endpoint to get fut data based on strike price."""
    data = request.json
    symbol = data.get("sid")
    exp = data.get("exp_sid")
    # strike = data.get('strike')

    response, status_code = App.get_fut_data(symbol, exp)
    return response, status_code

@app.route("/api/*", methods=["OPTIONS"])
def handle_options():
    return "", 200  # Respond with status 200 for OPTIONS requests

# Serve static files from uploads directory
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

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
        db.create_all()
        
        # Create default admin user if it doesn't exist
        admin_user = User.query.filter_by(email='admin@admin.com').first()
        if not admin_user:
            admin_user = User(
                username='admin',
                email='admin@admin.com',
                role=UserRole.ADMIN,
                email_verified=True
            )
            admin_user.set_password('admin@123')
            db.session.add(admin_user)
            db.session.commit()
            print("Created default admin user")
            
    socketio.run(app, host='127.0.0.1', port=10001, debug=True)
