import firebase_admin
from firebase_admin import credentials, auth
import os

# Get the absolute path to the credentials file
cred_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'credentials', 'firebase-credentials.json')

# Initialize Firebase Admin
try:
    cred = credentials.Certificate(cred_path)
    firebase_app = firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
    raise

class FirebaseAdmin:
    @staticmethod
    def verify_id_token(id_token):
        """Verify Firebase ID token and return user info"""
        try:
            decoded_token = auth.verify_id_token(id_token)
            return {
                'user_id': decoded_token['uid'],
                'email': decoded_token.get('email'),
                'email_verified': decoded_token.get('email_verified', False),
                'name': decoded_token.get('name'),
                'picture': decoded_token.get('picture')
            }
        except Exception as e:
            raise ValueError(f'Invalid token: {str(e)}')
    
    @staticmethod
    def get_user(uid):
        """Get user info by UID"""
        try:
            user = auth.get_user(uid)
            return {
                'user_id': user.uid,
                'email': user.email,
                'email_verified': user.email_verified,
                'name': user.display_name,
                'picture': user.photo_url,
                'disabled': user.disabled
            }
        except auth.UserNotFoundError:
            raise ValueError('User not found')
        except Exception as e:
            raise ValueError(f'Error getting user: {str(e)}')
    
    @staticmethod
    def create_user(email, password, display_name=None):
        """Create a new Firebase user"""
        try:
            user = auth.create_user(
                email=email,
                password=password,
                display_name=display_name,
                email_verified=False
            )
            return {
                'user_id': user.uid,
                'email': user.email,
                'name': user.display_name
            }
        except auth.EmailAlreadyExistsError:
            raise ValueError('Email already exists')
        except Exception as e:
            raise ValueError(f'Error creating user: {str(e)}')
    
    @staticmethod
    def update_user(uid, **kwargs):
        """Update user properties"""
        try:
            user = auth.update_user(
                uid,
                **kwargs
            )
            return {
                'user_id': user.uid,
                'email': user.email,
                'email_verified': user.email_verified,
                'name': user.display_name,
                'picture': user.photo_url
            }
        except auth.UserNotFoundError:
            raise ValueError('User not found')
        except Exception as e:
            raise ValueError(f'Error updating user: {str(e)}')
    
    @staticmethod
    def delete_user(uid):
        """Delete a user"""
        try:
            auth.delete_user(uid)
            return True
        except auth.UserNotFoundError:
            raise ValueError('User not found')
        except Exception as e:
            raise ValueError(f'Error deleting user: {str(e)}')
    
    @staticmethod
    def verify_email(uid):
        """Set email as verified"""
        try:
            user = auth.update_user(
                uid,
                email_verified=True
            )
            return {
                'user_id': user.uid,
                'email': user.email,
                'email_verified': user.email_verified
            }
        except auth.UserNotFoundError:
            raise ValueError('User not found')
        except Exception as e:
            raise ValueError(f'Error verifying email: {str(e)}')

# Create singleton instance
firebase_admin = FirebaseAdmin()
