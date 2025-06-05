from flask import Blueprint, request, jsonify
from models.user import User, db, UserRole
from datetime import datetime
from utils.firebase_admin import firebase_admin
from utils.auth_middleware import firebase_token_required, admin_required
from flask_cors import cross_origin
import logging
from flask import current_app as app

# Create blueprint
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/verify-token", methods=["POST"])
@cross_origin(supports_credentials=True)
def verify_token():
    """Verify Firebase ID token and return user info"""
    try:
        data = request.get_json()
        if not data or 'idToken' not in data:
            return jsonify({"error": "ID token is required"}), 400
            
        try:
            # Verify Firebase token
            user_info = firebase_admin.verify_id_token(data['idToken'])
        except Exception as e:
            # More specific error handling for Firebase token verification
            app.logger.error(f"Token verification error: {str(e)}")
            return jsonify({"error": f"Invalid token: {str(e)}"}), 401
        
        # Check if user exists in our database
        user = User.query.filter_by(firebase_uid=user_info['user_id']).first()
        
        if not user:
            # Create user in our database
            user = User(
                firebase_uid=user_info['user_id'],
                email=user_info.get('email', ''),
                username=user_info.get('name', user_info.get('email', '').split('@')[0]),
                is_email_verified=user_info.get('email_verified', False),
                role=UserRole.USER,
                # Add additional fields for social login
                login_provider=user_info.get('firebase', {}).get('sign_in_provider', 'unknown')
            )
            db.session.add(user)
            db.session.commit()
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Return detailed user data
        return jsonify({
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'firebase_uid': user.firebase_uid,
            'role': user.role.value,
            'is_email_verified': user.is_email_verified,
            'is_active': user.is_active,
            'login_provider': user.login_provider,
            'last_login': user.last_login.isoformat() if user.last_login else None,
        }), 200
    
    except Exception as e:
        # Catch-all for any unexpected errors
        app.logger.error(f"Unexpected token verification error: {str(e)}")
        return jsonify({"error": "Authentication failed", "details": str(e)}), 401

@auth_bp.route("/register", methods=["POST"])
@cross_origin(supports_credentials=True)
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'username' not in data or 'idToken' not in data:
            return jsonify({"error": "Missing required registration fields"}), 400
        
        try:
            # Verify Firebase token
            user_info = firebase_admin.verify_id_token(data['idToken'])
        except Exception as e:
            app.logger.error(f"Token verification error: {str(e)}")
            return jsonify({"error": f"Invalid token: {str(e)}"}), 401
        
        # Check if user already exists
        existing_user = User.query.filter(
            (User.email == data['email']) | (User.username == data['username'])
        ).first()
        
        if existing_user:
            if existing_user.email == data['email']:
                return jsonify({"error": "Email already registered"}), 409
            else:
                return jsonify({"error": "Username already taken"}), 409
        
        # Create user in our database
        new_user = User(
            firebase_uid=user_info['user_id'],
            email=data['email'],
            username=data['username'],
            is_email_verified=user_info.get('email_verified', False),
            role=UserRole.USER,
            login_provider=user_info.get('firebase', {}).get('sign_in_provider', 'email')
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Return user data
        return jsonify({
            'id': new_user.id,
            'email': new_user.email,
            'username': new_user.username,
            'role': new_user.role.value,
            'is_email_verified': new_user.is_email_verified,
            'login_provider': new_user.login_provider
        }), 201
    
    except Exception as e:
        # Catch-all for any unexpected errors
        app.logger.error(f"Unexpected registration error: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Registration failed", "details": str(e)}), 500

@auth_bp.route("/user/profile", methods=["GET"])
@cross_origin(supports_credentials=True)
@firebase_token_required
def get_profile(current_user):
    """Get user profile"""
    return jsonify(current_user.to_dict()), 200

@auth_bp.route("/user/profile", methods=["PUT"])
@cross_origin(supports_credentials=True)
@firebase_token_required
def update_profile(current_user):
    """Update user profile"""
    try:
        data = request.get_json()
        
        # Update allowed fields
        if 'username' in data:
            current_user.username = data['username']
        
        # Update Firebase display name if username is changed
        if 'username' in data:
            firebase_admin.update_user(
                current_user.firebase_uid,
                display_name=current_user.username
            )
        
        db.session.commit()
        return jsonify(current_user.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@auth_bp.route("/user/upgrade", methods=["POST"])
@cross_origin(supports_credentials=True)
@firebase_token_required
def upgrade_subscription(current_user):
    """Upgrade user to premium"""
    try:
        # Here you would typically process payment
        # For now, we'll just upgrade the user
        current_user.role = UserRole.PREMIUM
        current_user.subscription_expires = datetime.utcnow() + datetime.timedelta(days=30)
        db.session.commit()
        
        return jsonify(current_user.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@auth_bp.route("/admin/users", methods=["GET"])
@cross_origin(supports_credentials=True)
@firebase_token_required
@admin_required
def get_users(current_user):
    """Get all users (admin only)"""
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route("/admin/user/<int:user_id>", methods=["PUT"])
@cross_origin(supports_credentials=True)
@firebase_token_required
@admin_required
def update_user(current_user, user_id):
    """Update user (admin only)"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        data = request.get_json()
        
        # Update allowed fields
        if 'role' in data:
            user.role = UserRole(data['role'])
        if 'is_active' in data:
            user.is_active = data['is_active']
            
        db.session.commit()
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@auth_bp.route("/logout", methods=["POST"])
@cross_origin(supports_credentials=True)
@firebase_token_required
def logout(current_user):
    """Logout endpoint to invalidate user session"""
    try:
        # Update last logout time
        current_user.last_logout = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "message": "Logged out successfully",
            "last_logout": current_user.last_logout.isoformat()
        }), 200
    except Exception as e:
        app.logger.error(f"Logout error: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Logout failed", "details": str(e)}), 500

# Export blueprint
__all__ = ["auth_bp"]
