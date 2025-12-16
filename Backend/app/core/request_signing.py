"""
Request Signing and Security Utilities

Provides HMAC-based request signing for external API calls.
Ensures request integrity and prevents replay attacks.
"""
import hmac
import hashlib
import time
import json
from typing import Optional, Dict, Any
from urllib.parse import urlencode
import logging

logger = logging.getLogger(__name__)


class RequestSigner:
    """
    HMAC-SHA256 request signer for API security.
    
    Usage:
        signer = RequestSigner(secret_key="your-secret")
        signature = signer.sign_request(
            method="POST",
            path="/api/v1/orders",
            body={"symbol": "NIFTY"},
            timestamp=int(time.time())
        )
    """
    
    def __init__(self, secret_key: str, algorithm: str = "sha256"):
        self.secret_key = secret_key.encode('utf-8')
        self.algorithm = algorithm
    
    def sign_request(
        self,
        method: str,
        path: str,
        query_params: Optional[Dict[str, str]] = None,
        body: Optional[Dict[str, Any]] = None,
        timestamp: Optional[int] = None
    ) -> str:
        """
        Generate HMAC signature for a request.
        
        Args:
            method: HTTP method (GET, POST, etc.)
            path: Request path
            query_params: URL query parameters
            body: Request body (for POST/PUT)
            timestamp: Unix timestamp (uses current if not provided)
            
        Returns:
            Hex-encoded HMAC signature
        """
        timestamp = timestamp or int(time.time())
        
        # Build canonical string
        parts = [
            method.upper(),
            path,
            str(timestamp),
        ]
        
        # Add sorted query params
        if query_params:
            sorted_params = urlencode(sorted(query_params.items()))
            parts.append(sorted_params)
        
        # Add body hash if present
        if body:
            body_str = json.dumps(body, sort_keys=True, separators=(',', ':'))
            body_hash = hashlib.sha256(body_str.encode()).hexdigest()
            parts.append(body_hash)
        
        # Create canonical string
        canonical = '\n'.join(parts)
        
        # Generate HMAC
        signature = hmac.new(
            self.secret_key,
            canonical.encode('utf-8'),
            getattr(hashlib, self.algorithm)
        ).hexdigest()
        
        return signature
    
    def verify_signature(
        self,
        signature: str,
        method: str,
        path: str,
        query_params: Optional[Dict[str, str]] = None,
        body: Optional[Dict[str, Any]] = None,
        timestamp: int = None,
        max_age: int = 300  # 5 minutes
    ) -> bool:
        """
        Verify a request signature.
        
        Args:
            signature: The signature to verify
            max_age: Maximum age of the request in seconds
            
        Returns:
            True if valid, False otherwise
        """
        if not timestamp:
            return False
        
        # Check timestamp freshness (anti-replay)
        current_time = int(time.time())
        if abs(current_time - timestamp) > max_age:
            logger.warning(f"Signature expired: age={current_time - timestamp}s")
            return False
        
        # Compute expected signature
        expected = self.sign_request(method, path, query_params, body, timestamp)
        
        # Constant-time comparison
        return hmac.compare_digest(signature, expected)
    
    def get_auth_headers(
        self,
        method: str,
        path: str,
        query_params: Optional[Dict[str, str]] = None,
        body: Optional[Dict[str, Any]] = None,
        api_key: str = ""
    ) -> Dict[str, str]:
        """
        Generate authentication headers for a request.
        
        Returns dict with:
        - X-API-Key: API key identifier
        - X-Timestamp: Request timestamp
        - X-Signature: HMAC signature
        """
        timestamp = int(time.time())
        signature = self.sign_request(method, path, query_params, body, timestamp)
        
        return {
            'X-API-Key': api_key,
            'X-Timestamp': str(timestamp),
            'X-Signature': signature,
        }


class NonceGenerator:
    """
    Thread-safe nonce generator for preventing replay attacks.
    Uses timestamp + counter for uniqueness.
    """
    
    def __init__(self):
        self._counter = 0
        self._last_ts = 0
        import asyncio
        self._lock = asyncio.Lock()
    
    async def generate(self) -> str:
        """Generate a unique nonce."""
        async with self._lock:
            ts = int(time.time() * 1000)  # Milliseconds
            if ts == self._last_ts:
                self._counter += 1
            else:
                self._counter = 0
                self._last_ts = ts
            
            return f"{ts}-{self._counter:04d}"


# Convenience functions

def create_signed_headers(
    secret_key: str,
    method: str,
    path: str,
    api_key: str = "",
    body: Dict = None
) -> Dict[str, str]:
    """
    Create signed headers for an API request.
    
    Quick helper for common use case.
    """
    signer = RequestSigner(secret_key)
    return signer.get_auth_headers(method, path, body=body, api_key=api_key)
