"""
API v1 Router - Aggregates all API endpoints
"""
from fastapi import APIRouter

from app.api.v1 import auth, users, options, admin, health, analytics

api_router = APIRouter()

# Include all route modules
api_router.include_router(
    health.router,
    tags=["Health"]
)

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["Users"]
)

api_router.include_router(
    options.router,
    prefix="/options",
    tags=["Options"]
)

api_router.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"]
)

api_router.include_router(
    admin.router,
    prefix="/admin",
    tags=["Admin"]
)

