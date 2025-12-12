"""
CHE·NU Backend - Notifications Routes
=====================================
Notification management endpoints.
"""

from typing import List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from datetime import datetime
from uuid import uuid4

router = APIRouter()


class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    type: str  # info, success, warning, error
    is_read: bool
    created_at: datetime


class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str = "info"
    user_id: str


_notifications_db: dict = {}


@router.get("", response_model=List[NotificationResponse])
async def get_notifications(user_id: str = None, unread_only: bool = False):
    """Get all notifications for a user."""
    notifs = list(_notifications_db.values())
    if user_id:
        notifs = [n for n in notifs if n.get("user_id") == user_id]
    if unread_only:
        notifs = [n for n in notifs if not n.get("is_read")]
    return sorted(notifs, key=lambda x: x["created_at"], reverse=True)


@router.post("", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def create_notification(notification: NotificationCreate):
    """Create a notification."""
    notif_id = f"notif_{uuid4().hex[:8]}"
    
    notif_data = {
        **notification.model_dump(),
        "id": notif_id,
        "is_read": False,
        "created_at": datetime.utcnow(),
    }
    
    _notifications_db[notif_id] = notif_data
    return notif_data


@router.patch("/{notif_id}/read")
async def mark_as_read(notif_id: str):
    """Mark a notification as read."""
    if notif_id not in _notifications_db:
        raise HTTPException(status_code=404, detail="Notification not found")
    _notifications_db[notif_id]["is_read"] = True
    return {"status": "ok"}


@router.post("/read-all")
async def mark_all_as_read(user_id: str = None):
    """Mark all notifications as read."""
    for notif in _notifications_db.values():
        if user_id is None or notif.get("user_id") == user_id:
            notif["is_read"] = True
    return {"status": "ok"}


@router.delete("/{notif_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(notif_id: str):
    """Delete a notification."""
    if notif_id not in _notifications_db:
        raise HTTPException(status_code=404, detail="Notification not found")
    del _notifications_db[notif_id]
