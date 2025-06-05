from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models.user import User
from extensions import db
import firebase_admin
from firebase_admin import auth as firebase_auth
from werkzeug.utils import secure_filename
import os

user_bp = Blueprint('user', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = 'uploads/profile_photos'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        return jsonify({
            'user': {
                'uid': user.firebase_uid,
                'email': user.email,
                'displayName': user.display_name,
                'photoURL': user.photo_url,
                'emailVerified': user.email_verified,
                'phoneNumber': user.phone_number,
                'createdAt': user.created_at.isoformat(),
                'lastLoginAt': user.last_login_at.isoformat(),
                'provider': user.provider,
                'preferences': user.preferences
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        data = request.get_json()
        
        # Verify Firebase token
        firebase_token = data.get('credential')
        if firebase_token:
            try:
                firebase_user = firebase_auth.verify_id_token(firebase_token)
                if firebase_user['uid'] != user.firebase_uid:
                    return jsonify({'message': 'Unauthorized'}), 401
            except Exception as e:
                return jsonify({'message': 'Invalid Firebase token'}), 401
        
        # Update user fields
        if 'displayName' in data:
            user.display_name = data['displayName']
        if 'phoneNumber' in data:
            user.phone_number = data['phoneNumber']
        if 'photoURL' in data:
            user.photo_url = data['photoURL']
        if 'emailVerified' in data:
            user.email_verified = data['emailVerified']
        if 'preferences' in data:
            user.preferences = data['preferences']
            
        user.last_login_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'uid': user.firebase_uid,
                'email': user.email,
                'displayName': user.display_name,
                'photoURL': user.photo_url,
                'emailVerified': user.email_verified,
                'phoneNumber': user.phone_number,
                'createdAt': user.created_at.isoformat(),
                'lastLoginAt': user.last_login_at.isoformat(),
                'provider': user.provider,
                'preferences': user.preferences
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@user_bp.route('/profile/photo', methods=['POST'])
@jwt_required()
def upload_profile_photo():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        if 'photo' not in request.files:
            return jsonify({'message': 'No photo provided'}), 400
            
        photo = request.files['photo']
        
        if photo.filename == '':
            return jsonify({'message': 'No selected file'}), 400
            
        if photo and allowed_file(photo.filename):
            # Create upload folder if it doesn't exist
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            
            # Generate unique filename
            filename = secure_filename(f"{user.firebase_uid}_{datetime.utcnow().timestamp()}{os.path.splitext(photo.filename)[1]}")
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            
            # Save file
            photo.save(filepath)
            
            # Update user photo URL
            photo_url = f"/uploads/profile_photos/{filename}"  # Adjust based on your server setup
            user.photo_url = photo_url
            db.session.commit()
            
            return jsonify({
                'message': 'Photo uploaded successfully',
                'photoURL': photo_url
            }), 200
        else:
            return jsonify({'message': 'Invalid file type'}), 400
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@user_bp.route('/profile/preferences', methods=['PUT'])
@jwt_required()
def update_preferences():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        data = request.get_json()
        preferences = data.get('preferences', {})
        
        # Update user preferences
        user.preferences = {**user.preferences, **preferences}
        db.session.commit()
        
        return jsonify({
            'message': 'Preferences updated successfully',
            'preferences': user.preferences
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
