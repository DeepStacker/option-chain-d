"""
Stockify Trading Platform - FastAPI Application
Main entry point for the application
"""
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from app.config.settings import settings
from app.config.database import init_db, close_db
from app.cache.redis import init_redis, close_redis
from app.core.security import init_firebase
from app.core.middleware import (
    RequestLoggingMiddleware,
    SecurityHeadersMiddleware,
    RateLimitMiddleware,
)
from app.core.exceptions import AppException
from app.api.v1.router import api_router
from app.api.websocket.handlers import websocket_endpoint
# Import models to ensure they are registered with Base.metadata
from app.models.user import User

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format=settings.LOG_FORMAT
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """
    Application lifespan handler.
    Manages startup and shutdown events.
    """
    # Startup
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    
    # Initialize Firebase
    try:
        init_firebase()
        logger.info("Firebase initialized")
    except Exception as e:
        logger.warning(f"Firebase initialization failed: {e}")
    
    # Initialize Redis
    try:
        await init_redis()
        logger.info("Redis connected")
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}")
    
    # Initialize database
    try:
        await init_db()
        logger.info("Database initialized")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise
    
    logger.info(f"{settings.APP_NAME} started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")
    
    await close_redis()
    await close_db()
    
    logger.info("Shutdown complete")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="Real-time options trading platform with advanced analytics",
    version=settings.APP_VERSION,
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    openapi_url="/openapi.json" if settings.is_development else None,
    lifespan=lifespan,
)

# CORS configuration - explicit origins for WebSocket support
# Note: CORSMiddleware should NOT block WebSocket upgrades, but we add common origins
development_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
cors_origins = list(set(development_origins + settings.CORS_ORIGINS)) if settings.is_development else settings.CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add custom middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestLoggingMiddleware)

# Add GZip compression for responses > 500 bytes (reduces bandwidth by 60-80%)
app.add_middleware(GZipMiddleware, minimum_size=500)

# Add rate limiting (100 requests/minute per IP - protects from abuse)
app.add_middleware(RateLimitMiddleware, requests_per_minute=settings.RATE_LIMIT_PER_MINUTE)


# Global exception handler
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """Handle application exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error_code": exc.error_code,
            "message": exc.detail,
        }
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error_code": "INTERNAL_ERROR",
            "message": "An unexpected error occurred",
        }
    )


# Include API router
app.include_router(api_router, prefix="/api/v1")


# WebSocket endpoint - defined directly without CORSMiddleware involvement
@app.websocket("/ws/options")
async def options_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for live options data.
    WebSocket connections don't go through CORSMiddleware.
    Origin validation is done in the handler if needed.
    """
    await websocket_endpoint(websocket)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint - API info"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "api": "/api/v1"
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.is_development,
        workers=1 if settings.is_development else settings.WORKERS,
        log_level=settings.LOG_LEVEL.lower(),
    )
