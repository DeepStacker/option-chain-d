from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token
from models.user import User
from extensions import db
import firebase_admin
from firebase_admin import auth as firebase_auth
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/firebase-login', methods=['POST'])
def firebase_login():
    try:
        data = request.get_json()
        firebase_token = data.get('credential')
        
        if not firebase_token:
            return jsonify({'message': 'No token provided'}), 400
            
        # Verify Firebase token
        try:
            decoded_token = firebase_auth.verify_id_token(firebase_token)
        except Exception as e:
            return jsonify({'message': 'Invalid Firebase token'}), 401
            
        # Get or create user
        user = User.query.filter_by(firebase_uid=decoded_token['uid']).first()
        
        if not user:
            user = User(
                firebase_uid=decoded_token['uid'],
                email=data.get('email'),
                display_name=data.get('displayName'),
                photo_url=data.get('photoURL'),
                email_verified=data.get('emailVerified', False),
                phone_number=data.get('phoneNumber'),
                created_at=datetime.utcnow(),
                last_login_at=datetime.utcnow(),
                provider=data.get('provider', 'firebase'),
                preferences={}
            )
            db.session.add(user)
        else:
            user.last_login_at = datetime.utcnow()
            user.display_name = data.get('displayName', user.display_name)
            user.photo_url = data.get('photoURL', user.photo_url)
            user.email_verified = data.get('emailVerified', user.email_verified)
            user.phone_number = data.get('phoneNumber', user.phone_number)
            
        db.session.commit()
        
        # Create JWT tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    try:
        refresh_token = request.json.get('refresh_token')
        if not refresh_token:
            return jsonify({'message': 'Refresh token required'}), 400
            
        # Verify refresh token and create new access token
        user_id = get_jwt_identity()
        access_token = create_access_token(identity=user_id)
        
        return jsonify({
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500
