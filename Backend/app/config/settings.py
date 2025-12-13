"""
Application Settings - Centralized configuration management using Pydantic Settings
All environment variables and configuration are managed here.
"""
from functools import lru_cache
from typing import List, Optional, Any
from pydantic import Field, field_validator, PostgresDsn, RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    # ═══════════════════════════════════════════════════════════════════
    # Application Settings
    # ═══════════════════════════════════════════════════════════════════
    APP_NAME: str = "Stockify Trading Platform"
    APP_VERSION: str = "2.0.0"
    APP_ENV: str = Field(default="development", description="development, staging, production")
    DEBUG: bool = Field(default=True, description="Debug mode")
    
    # ═══════════════════════════════════════════════════════════════════
    # Server Settings
    # ═══════════════════════════════════════════════════════════════════
    HOST: str = Field(default="0.0.0.0")
    PORT: int = Field(default=8000)
    WORKERS: int = Field(default=1)
    
    # ═══════════════════════════════════════════════════════════════════
    # Security Settings
    # ═══════════════════════════════════════════════════════════════════
    SECRET_KEY: str = Field(default="your-super-secret-key-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=1440)  # 24 hours
    ALGORITHM: str = Field(default="HS256")
    
    # ═══════════════════════════════════════════════════════════════════
    # CORS Settings
    # ═══════════════════════════════════════════════════════════════════
    CORS_ORIGINS: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            "https://stockify-oc.vercel.app",
            "https://main.dtruazmd8dsaa.amplifyapp.com",
        ]
    )
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # ═══════════════════════════════════════════════════════════════════
    # Database Settings (PostgreSQL)
    # ═══════════════════════════════════════════════════════════════════
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/stockify",
        description="PostgreSQL connection URL"
    )
    DATABASE_POOL_SIZE: int = Field(default=10)
    DATABASE_MAX_OVERFLOW: int = Field(default=20)
    DATABASE_POOL_TIMEOUT: int = Field(default=30)
    DATABASE_ECHO: bool = Field(default=False, description="Log SQL queries")
    
    # ═══════════════════════════════════════════════════════════════════
    # Redis Settings
    # ═══════════════════════════════════════════════════════════════════
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection URL"
    )
    REDIS_CACHE_TTL: int = Field(default=300, description="Default cache TTL in seconds")
    REDIS_OPTIONS_CACHE_TTL: int = Field(default=5, description="Options data cache TTL")
    REDIS_EXPIRY_CACHE_TTL: int = Field(default=3600, description="Expiry dates cache TTL")
    REDIS_CONFIG_CACHE_TTL: int = Field(default=3600, description="Config cache TTL")
    
    # ═══════════════════════════════════════════════════════════════════
    # Firebase Settings
    # ═══════════════════════════════════════════════════════════════════
    FIREBASE_CREDENTIALS_PATH: str = Field(
        default="credentials/firebase_credentials.json",
        description="Path to Firebase service account credentials"
    )
    FIREBASE_PROJECT_ID: Optional[str] = None
    
    # ═══════════════════════════════════════════════════════════════════
    # Dhan API Settings (Defaults - can be overridden from Admin UI)
    # ═══════════════════════════════════════════════════════════════════
    DHAN_API_BASE_URL: str = Field(default="https://scanx.dhan.co/scanx")
    DHAN_OPTIONS_CHAIN_ENDPOINT: str = Field(default="/optchain")
    DHAN_SPOT_ENDPOINT: str = Field(default="/rtscrdt")
    DHAN_FUTURES_ENDPOINT: str = Field(default="/futoptsum")
    DHAN_API_TIMEOUT: int = Field(default=30, description="API timeout in seconds")
    DHAN_API_RETRY_COUNT: int = Field(default=3)
    DHAN_API_RETRY_DELAY: float = Field(default=1.0, description="Retry delay in seconds")
    DHAN_AUTH_TOKEN: Optional[str] = Field(default=None, description="Dhan API Auth Token")
    
    # ═══════════════════════════════════════════════════════════════════
    # Rate Limiting
    # ═══════════════════════════════════════════════════════════════════
    RATE_LIMIT_PER_MINUTE: int = Field(default=100)
    RATE_LIMIT_BURST: int = Field(default=20)
    
    # ═══════════════════════════════════════════════════════════════════
    # WebSocket Settings
    # ═══════════════════════════════════════════════════════════════════
    WS_HEARTBEAT_INTERVAL: int = Field(default=30)
    WS_MAX_CONNECTIONS: int = Field(default=1000)
    WS_BROADCAST_INTERVAL: float = Field(default=1.0, description="Live data broadcast interval")
    
    # ═══════════════════════════════════════════════════════════════════
    # Trading Defaults
    # ═══════════════════════════════════════════════════════════════════
    DEFAULT_RISK_FREE_RATE: float = Field(default=0.10, description="Risk-free rate for BSM")
    DEFAULT_SYMBOL: str = Field(default="NIFTY")
    
    # ═══════════════════════════════════════════════════════════════════
    # Logging
    # ═══════════════════════════════════════════════════════════════════
    LOG_LEVEL: str = Field(default="INFO")
    LOG_FORMAT: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    # ═══════════════════════════════════════════════════════════════════
    # File Upload
    # ═══════════════════════════════════════════════════════════════════
    UPLOAD_DIR: str = Field(default="uploads")
    MAX_UPLOAD_SIZE: int = Field(default=16 * 1024 * 1024, description="16MB")
    
    # ═══════════════════════════════════════════════════════════════════
    # Fallback Configuration Values
    # ═══════════════════════════════════════════════════════════════════
    _fallbacks: dict = {
        "DHAN_API_BASE_URL": "https://scanx.dhan.co/scanx",
        "CACHE_TTL": "300",
        "RATE_LIMIT": "100",
        "WS_INTERVAL": "1.0",
    }
    
    def get_fallback(self, key: str) -> Optional[str]:
        """Get fallback value for a configuration key"""
        return self._fallbacks.get(key)
    
    @field_validator("APP_ENV")
    @classmethod
    def validate_env(cls, v: str) -> str:
        allowed = ["development", "staging", "production"]
        if v not in allowed:
            raise ValueError(f"APP_ENV must be one of {allowed}")
        return v
    
    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"
    
    @property
    def is_development(self) -> bool:
        return self.APP_ENV == "development"


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance"""
    return Settings()


# Global settings instance
settings = get_settings()
