"""
Request Deduplication

Prevents processing duplicate requests within a time window.
Uses Redis for distributed deduplication across instances.
"""
import hashlib
import logging
import time
from typing import Optional, Callable, Any
from functools import wraps

from app.cache.redis import get_redis_connection

logger = logging.getLogger(__name__)


class RequestDeduplicator:
    """
    Hash-based request deduplication using Redis.
    
    Prevents duplicate processing of same requests within a time window.
    Useful for:
    - Preventing double-submits from UI
    - Handling retry storms from clients
    - Idempotent operation enforcement
    """
    
    def __init__(
        self,
        prefix: str = "dedup:",
        window_seconds: int = 5,
        include_body: bool = False
    ):
        self.prefix = prefix
        self.window_seconds = window_seconds
        self.include_body = include_body
    
    def _generate_hash(
        self,
        method: str,
        path: str,
        user_id: Optional[str] = None,
        body_hash: Optional[str] = None
    ) -> str:
        """Generate deterministic hash for request"""
        parts = [method.upper(), path]
        
        if user_id:
            parts.append(user_id)
        
        if self.include_body and body_hash:
            parts.append(body_hash)
        
        content = "|".join(parts)
        return hashlib.sha256(content.encode()).hexdigest()[:16]
    
    async def is_duplicate(
        self,
        method: str,
        path: str,
        user_id: Optional[str] = None,
        body_hash: Optional[str] = None
    ) -> bool:
        """
        Check if request is a duplicate.
        
        Returns True if same request was processed within window.
        """
        req_hash = self._generate_hash(method, path, user_id, body_hash)
        key = f"{self.prefix}{req_hash}"
        
        try:
            redis = await get_redis_connection()
            exists = await redis.set(
                key,
                str(time.time()),
                ex=self.window_seconds,
                nx=True  # Only set if doesn't exist
            )
            
            # If SET succeeded (nx=True), this is NOT a duplicate
            # If SET failed (key exists), this IS a duplicate
            is_dup = not exists
            
            if is_dup:
                logger.debug(f"Duplicate request detected: {path}")
            
            return is_dup
            
        except Exception as e:
            logger.error(f"Deduplication check failed: {e}")
            return False  # Fail open - allow request
    
    async def mark_processing(
        self,
        method: str,
        path: str,
        user_id: Optional[str] = None,
        processing_id: Optional[str] = None
    ) -> Optional[str]:
        """
        Mark request as being processed.
        
        Returns processing_id if successfully marked, None if already being processed.
        """
        req_hash = self._generate_hash(method, path, user_id)
        key = f"{self.prefix}proc:{req_hash}"
        
        processing_id = processing_id or f"{time.time()}"
        
        try:
            redis = await get_redis_connection()
            success = await redis.set(
                key,
                processing_id,
                ex=60,  # 1 minute max processing time
                nx=True
            )
            
            return processing_id if success else None
            
        except Exception as e:
            logger.error(f"Mark processing failed: {e}")
            return processing_id  # Fail open
    
    async def clear_processing(
        self,
        method: str,
        path: str,
        user_id: Optional[str] = None
    ):
        """Clear processing marker when done"""
        req_hash = self._generate_hash(method, path, user_id)
        key = f"{self.prefix}proc:{req_hash}"
        
        try:
            redis = await get_redis_connection()
            await redis.delete(key)
        except Exception as e:
            logger.error(f"Clear processing failed: {e}")


def deduplicate(
    window_seconds: int = 5,
    include_body: bool = False,
    user_id_getter: Optional[Callable] = None
):
    """
    Decorator for request deduplication.
    
    Usage:
        @app.post("/orders")
        @deduplicate(window_seconds=10)
        async def create_order(request: Request):
            ...
    """
    dedup = RequestDeduplicator(
        window_seconds=window_seconds,
        include_body=include_body
    )
    
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Try to extract request from args/kwargs
            request = kwargs.get('request') or (args[0] if args else None)
            
            if request and hasattr(request, 'method') and hasattr(request, 'url'):
                user_id = None
                if user_id_getter:
                    try:
                        user_id = user_id_getter(request)
                    except:
                        pass
                
                body_hash = None
                if include_body and hasattr(request, 'body'):
                    try:
                        body = await request.body()
                        body_hash = hashlib.sha256(body).hexdigest()[:16]
                    except:
                        pass
                
                if await dedup.is_duplicate(
                    request.method,
                    str(request.url.path),
                    user_id,
                    body_hash
                ):
                    from fastapi.responses import JSONResponse
                    return JSONResponse(
                        status_code=429,
                        content={
                            "success": False,
                            "error": "DUPLICATE_REQUEST",
                            "message": "Request already processing"
                        }
                    )
            
            return await func(*args, **kwargs)
        
        return wrapper
    return decorator


# Global deduplicator instance
request_deduplicator = RequestDeduplicator()
