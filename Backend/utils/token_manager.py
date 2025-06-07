from datetime import datetime, timedelta
import jwt
from models.user import db, User
import redis
import os

# Redis setup for token blacklist
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    db=0,
    decode_responses=True
)

class TokenManager:
    def __init__(self):
        self.access_token_expiry = timedelta(seconds=60)  # Short-lived access token
        self.refresh_token_expiry = timedelta(days=7)  # Long-lived refresh token
        self.secret_key = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
    
    def generate_tokens(self, user):
        """Generate both access and refresh tokens"""
        access_token = self._generate_access_token(user)
        refresh_token = self._generate_refresh_token(user)
        
        # Store refresh token in database
        user.refresh_token = refresh_token
        db.session.commit()
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'bearer',
            'expires_in': int(self.access_token_expiry.total_seconds())
        }
    
    def _generate_access_token(self, user):
        """Generate a short-lived access token"""
        payload = {
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role.value,
            'exp': datetime.utcnow() + self.access_token_expiry,
            'iat': datetime.utcnow(),
            'token_type': 'access'
        }
        return jwt.encode(payload, self.secret_key, algorithm='HS256')
    
    def _generate_refresh_token(self, user):
        """Generate a long-lived refresh token"""
        payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + self.refresh_token_expiry,
            'iat': datetime.utcnow(),
            'token_type': 'refresh'
        }
        return jwt.encode(payload, self.secret_key, algorithm='HS256')
    
    def refresh_access_token(self, refresh_token):
        """Generate new access token using refresh token"""
        try:
            # Verify refresh token
            payload = jwt.decode(refresh_token, self.secret_key, algorithms=['HS256'])
            if payload.get('token_type') != 'refresh':
                raise jwt.InvalidTokenError('Invalid token type')
            
            # Get user and verify refresh token matches
            user = User.query.get(payload['user_id'])
            if not user or user.refresh_token != refresh_token:
                raise jwt.InvalidTokenError('Invalid refresh token')
            
            # Generate new access token
            return {
                'access_token': self._generate_access_token(user),
                'token_type': 'bearer',
                'expires_in': int(self.access_token_expiry.total_seconds())
            }
        except jwt.ExpiredSignatureError:
            raise ValueError('Refresh token has expired')
        except jwt.InvalidTokenError as e:
            raise ValueError(str(e))
    
    def revoke_token(self, token):
        """Add token to blacklist"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            exp = payload.get('exp', 0)
            token_type = payload.get('token_type', '')
            
            # Calculate TTL for Redis
            ttl = exp - datetime.utcnow().timestamp()
            if ttl > 0:
                try:
                    # Store in Redis with expiration
                    redis_client.setex(
                        f"blacklist_token:{token}",
                        int(ttl),
                        token_type
                    )
                except redis.exceptions.ConnectionError:
                    print("Warning: Redis connection failed, token not blacklisted")
                except Exception as e:
                    print(f"Warning: Redis error during token blacklisting: {str(e)}")
        except jwt.InvalidTokenError:
            pass  # Invalid tokens don't need to be blacklisted
    
    def is_token_blacklisted(self, token):
        """Check if token is blacklisted"""
        try:
            return redis_client.exists(f"blacklist_token:{token}")
        except redis.exceptions.ConnectionError:
            # If Redis is not available, assume token is not blacklisted
            print("Warning: Redis connection failed, token blacklist check skipped")
            return False
        except Exception as e:
            print(f"Warning: Redis error during blacklist check: {str(e)}")
            return False

    def verify_token(self, token):
        """Verify token and return payload"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            
            try:
                # Check if token is blacklisted
                if self.is_token_blacklisted(token):
                    raise jwt.InvalidTokenError('Token is blacklisted')
            except Exception as e:
                # Log the error but continue if Redis check fails
                print(f"Warning: Token blacklist check failed: {str(e)}")
            
            return payload
        except jwt.ExpiredSignatureError:
            raise jwt.InvalidTokenError('Token has expired')
        except jwt.InvalidTokenError as e:
            raise jwt.InvalidTokenError(f'Invalid token: {str(e)}')

# Create singleton instance
token_manager = TokenManager()
