"""
Security utilities - Firebase token verification and authentication
"""
import logging
from typing import Optional, Dict, Any
from datetime import datetime

import firebase_admin
from firebase_admin import credentials, auth
from firebase_admin.auth import InvalidIdTokenError, ExpiredIdTokenError

from app.config.settings import settings

logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
_firebase_app: Optional[firebase_admin.App] = None


def init_firebase() -> None:
    """Initialize Firebase Admin SDK"""
    global _firebase_app
    
    if _firebase_app is not None:
        return
    
    try:
        cred_path = settings.FIREBASE_CREDENTIALS_PATH
        cred = credentials.Certificate(cred_path)
        _firebase_app = firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Firebase Admin SDK: {e}")
        # Allow app to run without Firebase in development
        if settings.is_production:
            raise


def verify_firebase_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify Firebase ID token and return decoded token data.
    
    Args:
        token: Firebase ID token string
        
    Returns:
        Decoded token dictionary if valid, None otherwise
    """
    if _firebase_app is None:
        init_firebase()
    
    if _firebase_app is None:
        logger.warning("Firebase not initialized, skipping token verification")
        # In development, allow bypass with mock data
        if settings.is_development:
            return {
                "uid": "dev-user-uid",
                "email": "dev@example.com",
                "email_verified": True,
            }
        return None
    
    try:
        decoded_token = auth.verify_id_token(token, check_revoked=True)
        return {
            "uid": decoded_token.get("uid"),
            "email": decoded_token.get("email"),
            "email_verified": decoded_token.get("email_verified", False),
            "name": decoded_token.get("name"),
            "picture": decoded_token.get("picture"),
            "sign_in_provider": decoded_token.get("firebase", {}).get("sign_in_provider"),
            "auth_time": decoded_token.get("auth_time"),
        }
    except ExpiredIdTokenError:
        logger.warning(f"Firebase token expired for token: {token[:10]}...")
        return None
    except InvalidIdTokenError as e:
        logger.warning(f"Invalid Firebase token: {e}. Token: {token[:10]}...")
        return None
    except Exception as e:
        print(f"DEBUG: Error verifying Firebase token: {e}", flush=True)
        print(f"DEBUG: is_development={settings.is_development}", flush=True)
        # In development, fallback to mock user on failure
        if settings.is_development:
            logger.warning("DEV MODE: Bypassing token verification failure")
            return {
                "uid": "dev-user-uid",
                "email": "dev@example.com",
                "email_verified": True,
                "name": "Dev User",
                "picture": None,
            }
            
        import traceback
        traceback.print_exc()
        logger.error(f"Error verifying Firebase token: {e}. Token: {token[:10]}...", exc_info=True)
        return None


def revoke_user_tokens(uid: str) -> bool:
    """
    Revoke all refresh tokens for a user.
    
    Args:
        uid: Firebase user UID
        
    Returns:
        True if successful, False otherwise
    """
    if _firebase_app is None:
        init_firebase()
    
    try:
        auth.revoke_refresh_tokens(uid)
        logger.info(f"Revoked tokens for user: {uid}")
        return True
    except Exception as e:
        logger.error(f"Failed to revoke tokens for user {uid}: {e}")
        return False


def get_firebase_user(uid: str) -> Optional[Dict[str, Any]]:
    """
    Get Firebase user by UID.
    
    Args:
        uid: Firebase user UID
        
    Returns:
        User data dictionary if found, None otherwise
    """
    if _firebase_app is None:
        init_firebase()
    
    try:
        user = auth.get_user(uid)
        return {
            "uid": user.uid,
            "email": user.email,
            "email_verified": user.email_verified,
            "display_name": user.display_name,
            "photo_url": user.photo_url,
            "disabled": user.disabled,
            "provider_data": [
                {"provider_id": p.provider_id, "email": p.email}
                for p in user.provider_data
            ],
        }
    except Exception as e:
        logger.error(f"Failed to get Firebase user {uid}: {e}")
        return None
