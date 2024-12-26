from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import enum

db = SQLAlchemy()

class UserRole(enum.Enum):
    USER = "user"
    PREMIUM = "premium"
    ADMIN = "admin"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firebase_uid = db.Column(db.String(128), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.Enum(UserRole), default=UserRole.USER)
    is_email_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # New field for tracking last logout
    last_logout = db.Column(db.DateTime, nullable=True)
    
    profile_image = db.Column(db.String(200))
    subscription_expires = db.Column(db.DateTime)
    
    # New field for login provider
    login_provider = db.Column(db.String(50), nullable=True, default='email')
    
    @property
    def is_admin(self):
        return self.role == UserRole.ADMIN
    
    @property
    def is_premium(self):
        if self.role == UserRole.PREMIUM and self.subscription_expires:
            return self.subscription_expires > datetime.utcnow()
        return False
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role.value,
            'is_email_verified': self.is_email_verified,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'last_logout': self.last_logout.isoformat() if self.last_logout else None,
            'profile_image': self.profile_image,
            'is_premium': self.is_premium,
            'subscription_expires': self.subscription_expires.isoformat() if self.subscription_expires else None,
            'login_provider': self.login_provider
        }
