from flask_mail import Mail, Message
from flask import current_app, render_template_string
import os

mail = Mail()

class EmailService:
    @staticmethod
    def send_verification_email(user, token):
        verification_url = f"{current_app.config['FRONTEND_URL']}/verify-email/{token}"
        
        html_content = '''
        <h2>Welcome to Stockify  Trading Platform!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <p><a href="{{ verification_url }}">Verify Email Address</a></p>
        <p>If you did not create an account, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        '''
        
        msg = Message(
            'Verify Your Email Address',
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            recipients=[user.email],
            html=render_template_string(html_content, verification_url=verification_url)
        )
        mail.send(msg)

    @staticmethod
    def send_password_reset_email(user, token):
        reset_url = f"{current_app.config['FRONTEND_URL']}/reset-password/{token}"
        
        html_content = '''
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <p><a href="{{ reset_url }}">Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        '''
        
        msg = Message(
            'Password Reset Request',
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            recipients=[user.email],
            html=render_template_string(html_content, reset_url=reset_url)
        )
        mail.send(msg)

    @staticmethod
    def send_subscription_expiry_notification(user):
        html_content = '''
        <h2>Subscription Expiring Soon</h2>
        <p>Dear {{ username }},</p>
        <p>Your premium subscription will expire on {{ expiry_date }}.</p>
        <p>To continue enjoying premium features, please renew your subscription.</p>
        <p><a href="{{ renewal_url }}">Renew Subscription</a></p>
        '''
        
        msg = Message(
            'Subscription Expiring Soon',
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            recipients=[user.email],
            html=render_template_string(
                html_content,
                username=user.username,
                expiry_date=user.subscription_expiry.strftime('%Y-%m-%d'),
                renewal_url=f"{current_app.config['FRONTEND_URL']}/subscription/renew"
            )
        )
        mail.send(msg)

    @staticmethod
    def send_account_locked_notification(user):
        html_content = '''
        <h2>Account Security Alert</h2>
        <p>Dear {{ username }},</p>
        <p>Your account has been temporarily locked due to multiple failed login attempts.</p>
        <p>The account will be automatically unlocked after 30 minutes.</p>
        <p>If you did not attempt to log in, please reset your password immediately.</p>
        <p><a href="{{ reset_url }}">Reset Password</a></p>
        '''
        
        msg = Message(
            'Account Security Alert',
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            recipients=[user.email],
            html=render_template_string(
                html_content,
                username=user.username,
                reset_url=f"{current_app.config['FRONTEND_URL']}/forgot-password"
            )
        )
        mail.send(msg)
