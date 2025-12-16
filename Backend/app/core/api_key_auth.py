"""
API Key Authentication

Provides API key-based authentication for programmatic access.
Complements Firebase authentication for server-to-server communication.
"""
import logging
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from fastapi import Header, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.cache.redis import get_redis, RedisCache

logger = logging.getLogger(__name__)

# API Key prefix for identification
API_KEY_PREFIX = "sk_live_"
API_KEY_LENGTH = 32


def generate_api_key() -> tuple[str, str]:
    """
    Generate a new API key.
    
    Returns:
        Tuple of (full_key, key_hash) - store only the hash
    """
    raw_key = secrets.token_urlsafe(API_KEY_LENGTH)
    full_key = f"{API_KEY_PREFIX}{raw_key}"
    key_hash = hashlib.sha256(full_key.encode()).hexdigest()
    return full_key, key_hash


def hash_api_key(key: str) -> str:
    """Hash an API key for comparison."""
    return hashlib.sha256(key.encode()).hexdigest()


class APIKeyAuth:
    """
    API Key authentication handler.
    
    Validates API keys from X-API-Key header and enforces rate limits.
    """
    
    def __init__(
        self,
        cache: RedisCache,
        rate_limit_per_minute: int = 60,
        rate_limit_per_day: int = 10000
    ):
        self.cache = cache
        self.rate_limit_per_minute = rate_limit_per_minute
        self.rate_limit_per_day = rate_limit_per_day
    
    async def validate_key(self, api_key: str) -> Optional[dict]:
        """
        Validate an API key and return associated metadata.
        
        Returns:
            dict with user_id, tier, created_at if valid, None otherwise
        """
        if not api_key or not api_key.startswith(API_KEY_PREFIX):
            return None
        
        key_hash = hash_api_key(api_key)
        
        # Check cache first
        cached = await self.cache.get_json(f"apikey:{key_hash}")
        if cached:
            if cached.get("revoked"):
                return None
            return cached
        
        # TODO: Check database for key metadata
        # For now, return None if not in cache
        return None
    
    async def check_rate_limit(self, key_hash: str) -> tuple[bool, dict]:
        """
        Check rate limits for an API key.
        
        Returns:
            Tuple of (allowed, headers) where headers contains rate limit info
        """
        minute_key = f"ratelimit:apikey:{key_hash}:minute"
        day_key = f"ratelimit:apikey:{key_hash}:day"
        
        try:
            # Get current counts
            minute_count = await self.cache.incr(minute_key)
            if minute_count == 1:
                await self.cache.expire(minute_key, 60)
            
            day_count = await self.cache.incr(day_key)
            if day_count == 1:
                await self.cache.expire(day_key, 86400)
            
            headers = {
                "X-RateLimit-Limit": str(self.rate_limit_per_minute),
                "X-RateLimit-Remaining": str(max(0, self.rate_limit_per_minute - minute_count)),
                "X-RateLimit-Reset": "60"
            }
            
            if minute_count > self.rate_limit_per_minute:
                return False, headers
            
            if day_count > self.rate_limit_per_day:
                headers["X-RateLimit-Daily-Remaining"] = "0"
                return False, headers
            
            return True, headers
            
        except Exception as e:
            logger.error(f"Rate limit check failed: {e}")
            # Allow on error to prevent blocking legitimate requests
            return True, {}


async def verify_api_key(
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    cache: RedisCache = Depends(get_redis)
) -> Optional[dict]:
    """
    FastAPI dependency to verify API key authentication.
    
    Usage:
        @app.get("/api/v1/data")
        async def get_data(api_key_data: dict = Depends(verify_api_key)):
            if api_key_data:
                # API key authenticated
                pass
    
    Returns:
        API key metadata dict if valid, None if no key provided
    
    Raises:
        HTTPException if key is invalid or rate limited
    """
    if not x_api_key:
        return None
    
    auth = APIKeyAuth(cache)
    key_data = await auth.validate_key(x_api_key)
    
    if not key_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
            headers={"WWW-Authenticate": "ApiKey"}
        )
    
    # Check rate limits
    key_hash = hash_api_key(x_api_key)
    allowed, headers = await auth.check_rate_limit(key_hash)
    
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded",
            headers=headers
        )
    
    return key_data


async def require_api_key(
    api_key_data: Optional[dict] = Depends(verify_api_key)
) -> dict:
    """
    FastAPI dependency that REQUIRES API key authentication.
    
    Raises HTTPException if no valid API key provided.
    """
    if not api_key_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key required",
            headers={"WWW-Authenticate": "ApiKey"}
        )
    return api_key_data
