from flask import Blueprint, request, jsonify, current_app, send_from_directory
from models.user import User, db, UserRole
from datetime import datetime, timedelta
import jwt
from functools import wraps
import os
from werkzeug.utils import secure_filename
from pillow import Image
import uuid
from utils.email_service import EmailService
import secrets
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from utils.token_manager import token_manager

# Create blueprint
auth_bp = Blueprint("auth", __name__)

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address, default_limits=["200 per day", "50 per hour"]
)

# Add these configurations
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def optimize_image(image_path, max_size=(800, 800)):
    """Optimize the image size while maintaining aspect ratio"""
    try:
        with Image.open(image_path) as img:
            # Convert RGBA to RGB if necessary
            if img.mode == "RGBA":
                img = img.convert("RGB")

            # Calculate new size maintaining aspect ratio
            width, height = img.size
            if width > max_size[0] or height > max_size[1]:
                ratio = min(max_size[0] / width, max_size[1] / height)
                new_size = (int(width * ratio), int(height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)

            # Save optimized image
            img.save(image_path, "JPEG", quality=85, optimize=True)
            return True
    except Exception as e:
        print(f"Image optimization error: {str(e)}")
        return False


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({"message": "Token is missing"}), 401

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            # Verify token using token manager
            payload = token_manager.verify_token(token)
            current_user = User.query.get(payload["user_id"])
            if not current_user:
                return jsonify({"message": "User not found"}), 401
        except ValueError as e:
            return jsonify({"message": str(e)}), 401

        return f(current_user, *args, **kwargs)

    return decorated


def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            if "Authorization" in request.headers:
                token = request.headers["Authorization"].split(" ")[1]

            if not token:
                return jsonify({"message": "Token is missing"}), 401

            try:
                data = token_manager.verify_token(token)
                current_user = User.query.get(data["user_id"])

                if not current_user.has_permission(required_role):
                    return jsonify({"message": "Insufficient permissions"}), 403

            except:
                return jsonify({"message": "Token is invalid"}), 401

            return f(current_user, *args, **kwargs)

        return decorated

    return decorator


@auth_bp.route("/register", methods=["POST"])
@limiter.limit("5 per hour")
def register():
    data = request.get_json()

    required_fields = ["username", "email", "password"]
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "Username already exists"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already exists"}), 400

    new_user = User(
        username=data["username"],
        email=data["email"],
        email_verified=True,  # Set to True by default for now
    )
    new_user.set_password(data["password"])

    try:
        db.session.add(new_user)
        db.session.commit()

        # Skip email verification for now
        # Create and return token immediately
        tokens = token_manager.generate_tokens(new_user)

        return (
            jsonify(
                {
                    "message": "User created successfully",
                    "user": new_user.to_dict(),
                    **tokens,
                }
            ),
            201,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating user", "error": str(e)}), 500


@auth_bp.route("/verify-email/<token>", methods=["GET"])
def verify_email(token):
    user = User.query.filter_by(email_verification_token=token).first()

    if not user:
        return jsonify({"message": "Invalid verification token"}), 400

    user.email_verified = True
    user.email_verification_token = None
    db.session.commit()

    return jsonify({"message": "Email verified successfully"})


@auth_bp.route("/login", methods=["POST"])
@limiter.limit("5 per minute")
def login():
    try:
        data = request.get_json()

        if not data or not data.get("email") or not data.get("password"):
            return jsonify({"message": "Missing email or password"}), 400

        user = User.query.filter_by(email=data["email"]).first()

        if not user:
            return jsonify({"message": "User not found"}), 401

        if user.is_account_locked():
            return jsonify({"message": "Account is locked. Try again later"}), 403

        if not user.check_password(data["password"]):
            user.increment_failed_login()
            db.session.commit()
            return jsonify({"message": "Invalid password"}), 401

        # Reset failed login attempts on successful login
        user.reset_failed_login()
        user.last_login = datetime.utcnow()
        db.session.commit()

        # Generate tokens
        tokens = token_manager.generate_tokens(user)

        return (
            jsonify({"message": "Login successful", "user": user.to_dict(), **tokens}),
            200,
        )

    except Exception as e:
        return jsonify({"message": str(e)}), 500


@auth_bp.route("/refresh-token", methods=["POST"])
def refresh_token():
    try:
        refresh_token = request.json.get("refresh_token")
        if not refresh_token:
            return jsonify({"message": "Refresh token is required"}), 400

        # Get new access token
        new_tokens = token_manager.refresh_access_token(refresh_token)
        return jsonify(new_tokens), 200

    except ValueError as e:
        return jsonify({"message": str(e)}), 401
    except Exception as e:
        return jsonify({"message": "Failed to refresh token"}), 500


@auth_bp.route("/logout", methods=["POST"])
@token_required
def logout(current_user):
    try:
        # Get tokens from request
        auth_header = request.headers.get("Authorization", "")
        access_token = auth_header.split(" ")[1] if auth_header else None
        refresh_token = current_user.refresh_token

        # Revoke both tokens
        if access_token:
            token_manager.revoke_token(access_token)
        if refresh_token:
            token_manager.revoke_token(refresh_token)
            current_user.refresh_token = None
            db.session.commit()

        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@auth_bp.route("/forgot-password", methods=["POST"])
@limiter.limit("3 per hour")
def forgot_password():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()

    if not user:
        return (
            jsonify({"message": "If the email exists, a reset link will be sent"}),
            200,
        )

    token = secrets.token_urlsafe(32)
    user.reset_password_token = token
    user.reset_password_expires = datetime.utcnow() + timedelta(hours=1)
    db.session.commit()

    EmailService.send_password_reset_email(user, token)

    return jsonify({"message": "If the email exists, a reset link will be sent"}), 200


@auth_bp.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    user = User.query.filter_by(reset_password_token=token).first()

    if (
        not user
        or not user.reset_password_expires
        or user.reset_password_expires < datetime.utcnow()
    ):
        return jsonify({"message": "Invalid or expired reset token"}), 400

    data = request.get_json()
    if not data or not data.get("password"):
        return jsonify({"message": "New password is required"}), 400

    user.set_password(data["password"])
    user.reset_password_token = None
    user.reset_password_expires = None
    db.session.commit()

    return jsonify({"message": "Password has been reset successfully"})


@auth_bp.route("/profile", methods=["GET"])
@token_required
def get_profile(current_user):
    return jsonify(current_user.to_dict())


@auth_bp.route("/profile", methods=["PUT"])
@token_required
def update_profile(current_user):
    data = request.get_json()

    allowed_fields = [
        "phone_number",
        "address",
        "city",
        "country",
        "bio",
        "trading_experience",
        "preferences",
    ]

    for field in allowed_fields:
        if field in data:
            setattr(current_user, field, data[field])

    try:
        db.session.commit()
        return jsonify(
            {"message": "Profile updated successfully", "user": current_user.to_dict()}
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating profile", "error": str(e)}), 500


@auth_bp.route("/profile/password", methods=["PUT"])
@token_required
def change_password(current_user):
    data = request.get_json()

    if not data.get("current_password") or not data.get("new_password"):
        return jsonify({"message": "Missing current or new password"}), 400

    if not current_user.check_password(data["current_password"]):
        return jsonify({"message": "Current password is incorrect"}), 401

    current_user.set_password(data["new_password"])
    db.session.commit()

    return jsonify({"message": "Password updated successfully"})


@auth_bp.route("/profile/upload-image", methods=["POST", "OPTIONS"])
@token_required
def upload_profile_image(current_user):
    # Handle preflight request
    if request.method == "OPTIONS":
        return "", 200

    try:
        if "profile_image" not in request.files:
            return jsonify({"message": "No file provided"}), 400

        file = request.files["profile_image"]
        if file.filename == "":
            return jsonify({"message": "No file selected"}), 400

        if not allowed_file(file.filename):
            return (
                jsonify(
                    {"message": "Invalid file type. Allowed types: jpg, jpeg, png, gif"}
                ),
                400,
            )

        # Check file size
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)

        if size > MAX_FILE_SIZE:
            return jsonify({"message": "File size exceeds 5MB limit"}), 400

        # Generate unique filename
        ext = file.filename.rsplit(".", 1)[1].lower()
        new_filename = f"{uuid.uuid4()}.{ext}"
        filepath = os.path.join(UPLOAD_FOLDER, new_filename)

        # Save the file
        file.save(filepath)

        # Optimize the image
        if not optimize_image(filepath):
            os.remove(filepath)  # Clean up if optimization fails
            return jsonify({"message": "Failed to process image"}), 500

        # Update user's profile image URL
        image_url = f"/uploads/{new_filename}"

        # Delete old profile image if it exists
        if current_user.profile_image:
            old_image_path = os.path.join(
                UPLOAD_FOLDER, os.path.basename(current_user.profile_image)
            )
            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        current_user.profile_image = image_url
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Profile image uploaded successfully",
                    "image_url": image_url,
                }
            ),
            200,
        )

    except Exception as e:
        print(f"Upload error: {str(e)}")  # Log the error
        # Clean up file if it was saved
        if "filepath" in locals() and os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"message": f"Upload failed: {str(e)}"}), 500


# Serve uploaded files
@auth_bp.route("/uploads/<filename>")
def serve_upload(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=False)
    except Exception as e:
        print(f"File serving error: {str(e)}")
        return jsonify({"message": "File not found"}), 404


@auth_bp.route("/subscription/upgrade", methods=["POST"])
@token_required
def upgrade_subscription(current_user):
    # Here you would typically integrate with a payment processor
    # For now, we'll just upgrade the user's role
    current_user.role = UserRole.PREMIUM
    current_user.subscription_status = "premium"
    current_user.subscription_expiry = datetime.utcnow() + timedelta(days=30)
    db.session.commit()

    return jsonify(
        {
            "message": "Subscription upgraded successfully",
            "user": current_user.to_dict(),
        }
    )


__all__ = ["auth_bp", "token_required", "role_required"]
