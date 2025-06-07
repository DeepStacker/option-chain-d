from functools import wraps
from flask import request, jsonify
from .firebase_admin import firebase_admin
from models.user import User, db

def firebase_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        id_token = None

        # Allow OPTIONS requests to pass through without authentication
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)

        # Get token from header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                id_token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({"error": "Invalid token format"}), 401
        
        if not id_token:
            return jsonify({"error": "No token provided"}), 401
        
        try:
            # Verify Firebase token
            user_info = firebase_admin.verify_id_token(id_token)
            
            # Check if user exists in our database
            user = User.query.filter_by(firebase_uid=user_info['user_id']).first()
            
            if not user:
                # Create user in our database if they don't exist
                user = User(
                    firebase_uid=user_info['user_id'],
                    email=user_info['email'],
                    username=user_info.get('name', user_info['email'].split('@')[0]),
                    is_email_verified=user_info.get('email_verified', False)
                )
                db.session.add(user)
                db.session.commit()
            
            # Update email verification status if changed
            if user.is_email_verified != user_info.get('email_verified', False):
                user.is_email_verified = user_info.get('email_verified', False)
                db.session.commit()
            
            return f(user, *args, **kwargs)
            
        except ValueError as e:
            return jsonify({"error": str(e)}), 401
        except Exception as e:
            return jsonify({"error": "Failed to authenticate token"}), 401
    
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = kwargs.get('current_user') or args[0]
        if not user or not user.is_admin:
            return jsonify({"error": "Admin privileges required"}), 403
        return f(*args, **kwargs)
    return decorated
