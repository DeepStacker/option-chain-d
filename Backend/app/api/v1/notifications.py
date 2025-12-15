"""
Notifications API Endpoints
Provides endpoints for user notifications management.
"""
import logging
from typing import Optional, List
from datetime import datetime
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import CurrentUser, OptionalUser
from app.cache.redis import RedisCache, get_redis

logger = logging.getLogger(__name__)
router = APIRouter()


# ============== Models ==============

class NotificationCreate(BaseModel):
    """Create a notification"""
    title: str = Field(..., max_length=100)
    message: str = Field(..., max_length=500)
    type: str = Field("info", pattern="^(info|success|warning|error|trade|price)$")
    link: Optional[str] = None


class NotificationResponse(BaseModel):
    """Notification response"""
    id: str
    title: str
    message: str
    type: str
    is_read: bool = False
    created_at: str
    link: Optional[str] = None


class NotificationListResponse(BaseModel):
    """List of notifications"""
    success: bool = True
    total: int
    unread_count: int
    notifications: List[NotificationResponse]


# ============== In-Memory Store (for demo purposes) ==============
# In production, this would be stored in database

_demo_notifications = {
    "default": [
        {
            "id": str(uuid4()),
            "title": "Welcome to DeepStrike!",
            "message": "Start exploring real-time option chain data and analytics.",
            "type": "success",
            "is_read": False,
            "created_at": datetime.now().isoformat(),
            "link": "/dashboard"
        },
        {
            "id": str(uuid4()),
            "title": "Market Alert",
            "message": "NIFTY crossed 24,500 level. Consider reviewing your positions.",
            "type": "price",
            "is_read": False,
            "created_at": datetime.now().isoformat(),
            "link": "/option-chain"
        },
        {
            "id": str(uuid4()),
            "title": "New Feature: Screeners",
            "message": "Check out our new Scalp and Positional screeners for trading opportunities.",
            "type": "info",
            "is_read": False,
            "created_at": datetime.now().isoformat(),
            "link": "/screeners"
        },
    ]
}


# ============== Endpoints ==============

@router.get("", response_model=NotificationListResponse)
async def get_notifications(
    current_user: OptionalUser = None,
    limit: int = Query(20, ge=1, le=50),
    redis: RedisCache = Depends(get_redis),
):
    """
    Get user notifications.
    """
    user_id = str(current_user.id) if current_user else "default"
    
    # Try to get from cache first
    cache_key = f"notifications:{user_id}"
    cached = await redis.get_json(cache_key)
    
    if cached:
        notifications = cached
    else:
        # Use demo notifications
        notifications = _demo_notifications.get(user_id, _demo_notifications.get("default", []))
    
    # Calculate unread count
    unread_count = sum(1 for n in notifications if not n.get("is_read", False))
    
    return NotificationListResponse(
        success=True,
        total=len(notifications),
        unread_count=unread_count,
        notifications=[NotificationResponse(**n) for n in notifications[:limit]]
    )


@router.post("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    current_user: OptionalUser = None,
    redis: RedisCache = Depends(get_redis),
):
    """
    Mark a notification as read.
    """
    user_id = str(current_user.id) if current_user else "default"
    cache_key = f"notifications:{user_id}"
    
    # Get notifications
    notifications = await redis.get_json(cache_key)
    if not notifications:
        notifications = _demo_notifications.get(user_id, _demo_notifications.get("default", []))
    
    # Mark as read
    for n in notifications:
        if n["id"] == notification_id:
            n["is_read"] = True
            break
    
    # Save back to cache
    await redis.set_json(cache_key, notifications, ttl=86400)
    
    return {"success": True, "message": "Notification marked as read"}


@router.post("/read-all")
async def mark_all_as_read(
    current_user: OptionalUser = None,
    redis: RedisCache = Depends(get_redis),
):
    """
    Mark all notifications as read.
    """
    user_id = str(current_user.id) if current_user else "default"
    cache_key = f"notifications:{user_id}"
    
    # Get notifications
    notifications = await redis.get_json(cache_key)
    if not notifications:
        notifications = _demo_notifications.get(user_id, _demo_notifications.get("default", []))
    
    # Mark all as read
    for n in notifications:
        n["is_read"] = True
    
    # Save back to cache
    await redis.set_json(cache_key, notifications, ttl=86400)
    
    return {"success": True, "message": "All notifications marked as read"}


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: OptionalUser = None,
    redis: RedisCache = Depends(get_redis),
):
    """
    Delete a notification.
    """
    user_id = str(current_user.id) if current_user else "default"
    cache_key = f"notifications:{user_id}"
    
    # Get notifications
    notifications = await redis.get_json(cache_key)
    if not notifications:
        notifications = _demo_notifications.get(user_id, _demo_notifications.get("default", []))
    
    # Remove notification
    notifications = [n for n in notifications if n["id"] != notification_id]
    
    # Save back to cache
    await redis.set_json(cache_key, notifications, ttl=86400)
    
    return {"success": True, "message": "Notification deleted"}


@router.post("")
async def create_notification(
    notification: NotificationCreate,
    current_user: CurrentUser = None,
    redis: RedisCache = Depends(get_redis),
):
    """
    Create a new notification (for testing/admin).
    """
    user_id = str(current_user.id) if current_user else "default"
    cache_key = f"notifications:{user_id}"
    
    # Get existing notifications
    notifications = await redis.get_json(cache_key)
    if not notifications:
        notifications = []
    
    # Create new notification
    new_notif = {
        "id": str(uuid4()),
        "title": notification.title,
        "message": notification.message,
        "type": notification.type,
        "is_read": False,
        "created_at": datetime.now().isoformat(),
        "link": notification.link
    }
    
    # Add to beginning
    notifications.insert(0, new_notif)
    
    # Keep only last 50
    notifications = notifications[:50]
    
    # Save to cache
    await redis.set_json(cache_key, notifications, ttl=86400)
    
    return {"success": True, "notification": NotificationResponse(**new_notif)}
