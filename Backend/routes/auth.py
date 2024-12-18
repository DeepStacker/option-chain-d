from flask import Blueprint, request, jsonify, current_app
from models.user import User, db, UserRole
from datetime import datetime, timedelta
import jwt
from functools import wraps
import os
from werkzeug.utils import secure_filename
from utils.email_service import EmailService
import secrets
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Create blueprint
auth_bp = Blueprint('auth', __name__)

# Rate limiter setup
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# JWT Configuration
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
JWT_EXPIRATION_HOURS = 24

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                token = request.headers['Authorization'].split(" ")[1]
            
            if not token:
                return jsonify({'message': 'Token is missing'}), 401
            
            try:
                data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
                current_user = User.query.get(data['user_id'])
                
                if not current_user.has_permission(required_role):
                    return jsonify({'message': 'Insufficient permissions'}), 403
                
            except:
                return jsonify({'message': 'Token is invalid'}), 401
            
            return f(current_user, *args, **kwargs)
        
        return decorated
    return decorator

@auth_bp.route('/register', methods=['POST'])
@limiter.limit("5 per hour")
def register():
    data = request.get_json()
    
    required_fields = ['username', 'email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    new_user = User(
        username=data['username'],
        email=data['email'],
        email_verified=True  # Set to True by default for now
    )
    new_user.set_password(data['password'])
    
    try:
        db.session.add(new_user)
        db.session.commit()
        
        # Skip email verification for now
        # Create and return token immediately
        token = jwt.encode(
            {
                'user_id': new_user.id,
                'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
            },
            JWT_SECRET_KEY,
            algorithm="HS256"
        )
        
        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': new_user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating user', 'error': str(e)}), 500

@auth_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    user = User.query.filter_by(email_verification_token=token).first()
    
    if not user:
        return jsonify({'message': 'Invalid verification token'}), 400
    
    user.email_verified = True
    user.email_verification_token = None
    db.session.commit()
    
    return jsonify({'message': 'Email verified successfully'})

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Check if account is locked
    if user.is_account_locked():
        return jsonify({
            'message': 'Account is temporarily locked. Please try again later.',
            'locked_until': user.account_locked_until
        }), 403
    
    if not user.check_password(data['password']):
        # Increment failed login attempts
        user.failed_login_attempts += 1
        
        # Lock account if too many failed attempts
        if user.failed_login_attempts >= 5:
            user.account_locked_until = datetime.utcnow() + timedelta(minutes=15)
            db.session.commit()
            return jsonify({
                'message': 'Account locked due to too many failed attempts. Please try again later.',
                'locked_until': user.account_locked_until
            }), 403
        
        db.session.commit()
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Reset failed login attempts on successful login
    user.failed_login_attempts = 0
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    # Generate token
    token = jwt.encode(
        {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
        },
        JWT_SECRET_KEY,
        algorithm="HS256"
    )
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    })

@auth_bp.route('/forgot-password', methods=['POST'])
@limiter.limit("3 per hour")
def forgot_password():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user:
        return jsonify({'message': 'If the email exists, a reset link will be sent'}), 200
    
    token = secrets.token_urlsafe(32)
    user.reset_password_token = token
    user.reset_password_expires = datetime.utcnow() + timedelta(hours=1)
    db.session.commit()
    
    EmailService.send_password_reset_email(user, token)
    
    return jsonify({'message': 'If the email exists, a reset link will be sent'}), 200

@auth_bp.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    user = User.query.filter_by(reset_password_token=token).first()
    
    if not user or not user.reset_password_expires or user.reset_password_expires < datetime.utcnow():
        return jsonify({'message': 'Invalid or expired reset token'}), 400
    
    data = request.get_json()
    if not data or not data.get('password'):
        return jsonify({'message': 'New password is required'}), 400
    
    user.set_password(data['password'])
    user.reset_password_token = None
    user.reset_password_expires = None
    db.session.commit()
    
    return jsonify({'message': 'Password has been reset successfully'})

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify(current_user.to_dict())

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    
    allowed_fields = [
        'phone_number', 'address', 'city', 'country',
        'bio', 'trading_experience', 'preferences'
    ]
    
    for field in allowed_fields:
        if field in data:
            setattr(current_user, field, data[field])
    
    try:
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully', 'user': current_user.to_dict()})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating profile', 'error': str(e)}), 500

@auth_bp.route('/profile/password', methods=['PUT'])
@token_required
def change_password(current_user):
    data = request.get_json()
    
    if not data.get('current_password') or not data.get('new_password'):
        return jsonify({'message': 'Missing current or new password'}), 400
    
    if not current_user.check_password(data['current_password']):
        return jsonify({'message': 'Current password is incorrect'}), 401
    
    current_user.set_password(data['new_password'])
    db.session.commit()
    
    return jsonify({'message': 'Password updated successfully'})

@auth_bp.route('/profile/image', methods=['POST'])
@token_required
def upload_profile_image(current_user):
    if 'image' not in request.files:
        return jsonify({'message': 'No image file provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{current_user.id}_{file.filename}")
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        current_user.profile_image = f'/uploads/{filename}'
        db.session.commit()
        
        return jsonify({
            'message': 'Profile image updated successfully',
            'profile_image': current_user.profile_image
        })
    
    return jsonify({'message': 'Invalid file type'}), 400

@auth_bp.route('/subscription/upgrade', methods=['POST'])
@token_required
def upgrade_subscription(current_user):
    # Here you would typically integrate with a payment processor
    # For now, we'll just upgrade the user's role
    current_user.role = UserRole.PREMIUM
    current_user.subscription_status = 'premium'
    current_user.subscription_expiry = datetime.utcnow() + timedelta(days=30)
    db.session.commit()
    
    return jsonify({
        'message': 'Subscription upgraded successfully',
        'user': current_user.to_dict()
    })

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

__all__ = ['auth_bp', 'token_required', 'role_required']
