from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import enum
from datetime import timedelta

db = SQLAlchemy()

class UserRole(enum.Enum):
    USER = "user"
    PREMIUM = "premium"
    ADMIN = "admin"

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    role = db.Column(db.Enum(UserRole), default=UserRole.USER)
    subscription_status = db.Column(db.String(20), default='free')
    subscription_expiry = db.Column(db.DateTime)
    last_login = db.Column(db.DateTime)
    profile_image = db.Column(db.String(200))
    phone_number = db.Column(db.String(20))
    address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    bio = db.Column(db.Text)
    trading_experience = db.Column(db.String(50))
    reset_password_token = db.Column(db.String(100), unique=True)
    reset_password_expires = db.Column(db.DateTime)
    email_verified = db.Column(db.Boolean, default=False)
    email_verification_token = db.Column(db.String(100), unique=True)
    failed_login_attempts = db.Column(db.Integer, default=0)
    account_locked_until = db.Column(db.DateTime)
    preferences = db.Column(db.JSON)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def is_account_locked(self):
        if self.account_locked_until and self.account_locked_until > datetime.utcnow():
            return True
        return False
    
    def increment_failed_login(self):
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= 5:  # Lock account after 5 failed attempts
            self.account_locked_until = datetime.utcnow() + timedelta(minutes=30)
    
    def reset_failed_login(self):
        self.failed_login_attempts = 0
        self.account_locked_until = None
    
    def has_permission(self, required_role):
        role_hierarchy = {
            UserRole.ADMIN: 3,
            UserRole.PREMIUM: 2,
            UserRole.USER: 1
        }
        return role_hierarchy[self.role] >= role_hierarchy[required_role]
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active,
            'role': self.role.value,
            'subscription_status': self.subscription_status,
            'subscription_expiry': self.subscription_expiry.isoformat() if self.subscription_expiry else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'profile_image': self.profile_image,
            'phone_number': self.phone_number,
            'address': self.address,
            'city': self.city,
            'country': self.country,
            'bio': self.bio,
            'trading_experience': self.trading_experience,
            'email_verified': self.email_verified,
            'preferences': self.preferences
        }
