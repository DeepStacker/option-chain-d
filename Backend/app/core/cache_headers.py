"""
Response Caching Headers Middleware

Adds appropriate Cache-Control headers to API responses based on endpoint type.
Improves performance by enabling CDN and browser caching.
"""
import logging
from typing import Callable, Set
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)

# Endpoints that should be cached (static or semi-static data)
CACHEABLE_ENDPOINTS = {
    "/api/v1/options/expiries": 3600,      # 1 hour - expiry dates don't change often
    "/api/v1/options/symbols": 86400,       # 24 hours - symbol list is very stable
    "/api/v1/health": 0,                    # No cache for health checks
    "/api/v1/config": 300,                  # 5 min - app config
}

# Pattern-based caching rules
CACHE_PATTERNS = [
    ("/api/v1/historical", 60),   # Historical data - 1 min cache
    ("/api/v1/charts", 30),       # Chart data - 30 sec cache
    ("/api/v1/screener", 60),     # Screener results - 1 min cache
]


class CacheHeadersMiddleware(BaseHTTPMiddleware):
    """
    Adds appropriate Cache-Control headers to responses.
    
    Caching strategy:
    - Static endpoints: Long cache with revalidation
    - Dynamic data: Short or no cache
    - User-specific data: private, no-cache
    - Error responses: no-cache
    """
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        
        # Skip for non-GET requests
        if request.method != "GET":
            response.headers["Cache-Control"] = "no-store"
            return response
        
        # Skip for error responses
        if response.status_code >= 400:
            response.headers["Cache-Control"] = "no-cache, no-store"
            return response
        
        # Skip for authenticated endpoints (user-specific data)
        if "authorization" in request.headers:
            response.headers["Cache-Control"] = "private, no-cache"
            return response
        
        path = request.url.path
        
        # Check exact match first
        if path in CACHEABLE_ENDPOINTS:
            max_age = CACHEABLE_ENDPOINTS[path]
            if max_age > 0:
                response.headers["Cache-Control"] = f"public, max-age={max_age}, stale-while-revalidate={max_age // 2}"
            else:
                response.headers["Cache-Control"] = "no-cache"
            return response
        
        # Check pattern matches
        for pattern, max_age in CACHE_PATTERNS:
            if path.startswith(pattern):
                response.headers["Cache-Control"] = f"public, max-age={max_age}, stale-while-revalidate={max_age}"
                return response
        
        # Default: short cache for API responses
        response.headers["Cache-Control"] = "public, max-age=10, stale-while-revalidate=30"
        
        return response
