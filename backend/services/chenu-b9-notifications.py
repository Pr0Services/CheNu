"""
═══════════════════════════════════════════════════════════════════════════════
CHE·NU™ — BATCH 9: REAL-TIME NOTIFICATIONS SYSTEM
═══════════════════════════════════════════════════════════════════════════════

Features:
- N1: WebSocket real-time connection
- N2: Push notifications (web push)
- N3: In-app notification center
- N4: Email notifications
- N5: SMS notifications (Twilio)
- N6: Notification preferences
- N7: Notification templates
- N8: Smart delivery (do not disturb)
- N9: Notification grouping
- N10: Read/unread tracking

═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Set
from datetime import datetime, timedelta
from enum import Enum
import uuid
import json
import asyncio
import logging

from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect, Query
from pydantic import BaseModel, Field

logger = logging.getLogger("CHENU.Notifications")

router = APIRouter(prefix="/api/v1/notifications", tags=["Notifications"])

# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS & CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

class NotificationType(str, Enum):
    # Project related
    PROJECT_CREATED = "project.created"
    PROJECT_UPDATED = "project.updated"
    PROJECT_COMPLETED = "project.completed"
    PROJECT_DEADLINE = "project.deadline"
    
    # Task related
    TASK_ASSIGNED = "task.assigned"
    TASK_COMPLETED = "task.completed"
    TASK_COMMENT = "task.comment"
    TASK_DUE_SOON = "task.due_soon"
    TASK_OVERDUE = "task.overdue"
    
    # Calendar
    EVENT_REMINDER = "event.reminder"
    EVENT_INVITATION = "event.invitation"
    EVENT_UPDATED = "event.updated"
    
    # Team
    TEAM_INVITATION = "team.invitation"
    TEAM_JOINED = "team.joined"
    MENTION = "mention"
    
    # Documents
    DOCUMENT_SHARED = "document.shared"
    SIGNATURE_REQUESTED = "signature.requested"
    SIGNATURE_COMPLETED = "signature.completed"
    
    # Finance
    INVOICE_RECEIVED = "invoice.received"
    PAYMENT_RECEIVED = "payment.received"
    BUDGET_ALERT = "budget.alert"
    
    # System
    SYSTEM_UPDATE = "system.update"
    SYSTEM_MAINTENANCE = "system.maintenance"

class NotificationPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"

class DeliveryChannel(str, Enum):
    IN_APP = "in_app"
    PUSH = "push"
    EMAIL = "email"
    SMS = "sms"

# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class Notification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: NotificationType
    title: str
    body: str
    priority: NotificationPriority = NotificationPriority.NORMAL
    icon: Optional[str] = None
    image: Optional[str] = None
    action_url: Optional[str] = None
    data: Dict[str, Any] = Field(default_factory=dict)
    channels: List[DeliveryChannel] = Field(default_factory=lambda: [DeliveryChannel.IN_APP])
    is_read: bool = False
    read_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    group_id: Optional[str] = None

class NotificationPreferences(BaseModel):
    user_id: str
    enabled: bool = True
    channels: Dict[DeliveryChannel, bool] = Field(default_factory=lambda: {
        DeliveryChannel.IN_APP: True,
        DeliveryChannel.PUSH: True,
        DeliveryChannel.EMAIL: True,
        DeliveryChannel.SMS: False,
    })
    type_settings: Dict[str, Dict[str, Any]] = Field(default_factory=dict)
    quiet_hours: Optional[Dict[str, Any]] = None  # {"start": "22:00", "end": "07:00"}
    email_digest: str = "instant"  # instant, hourly, daily, weekly
    push_subscription: Optional[Dict[str, Any]] = None

class NotificationTemplate(BaseModel):
    type: NotificationType
    title_template: str
    body_template: str
    icon: str
    default_priority: NotificationPriority
    default_channels: List[DeliveryChannel]

# ═══════════════════════════════════════════════════════════════════════════════
# TEMPLATES
# ═══════════════════════════════════════════════════════════════════════════════

NOTIFICATION_TEMPLATES: Dict[NotificationType, NotificationTemplate] = {
    NotificationType.TASK_ASSIGNED: NotificationTemplate(
        type=NotificationType.TASK_ASSIGNED,
        title_template="Nouvelle tâche assignée",
        body_template="{assigner} vous a assigné la tâche: {task_name}",
        icon="📋",
        default_priority=NotificationPriority.NORMAL,
        default_channels=[DeliveryChannel.IN_APP, DeliveryChannel.PUSH],
    ),
    NotificationType.TASK_COMPLETED: NotificationTemplate(
        type=NotificationType.TASK_COMPLETED,
        title_template="Tâche complétée",
        body_template="{user} a terminé la tâche: {task_name}",
        icon="✅",
        default_priority=NotificationPriority.LOW,
        default_channels=[DeliveryChannel.IN_APP],
    ),
    NotificationType.TASK_COMMENT: NotificationTemplate(
        type=NotificationType.TASK_COMMENT,
        title_template="Nouveau commentaire",
        body_template="{user} a commenté sur: {task_name}",
        icon="💬",
        default_priority=NotificationPriority.NORMAL,
        default_channels=[DeliveryChannel.IN_APP, DeliveryChannel.PUSH],
    ),
    NotificationType.TASK_OVERDUE: NotificationTemplate(
        type=NotificationType.TASK_OVERDUE,
        title_template="⚠️ Tâche en retard",
        body_template="La tâche '{task_name}' est en retard de {days} jour(s)",
        icon="⚠️",
        default_priority=NotificationPriority.HIGH,
        default_channels=[DeliveryChannel.IN_APP, DeliveryChannel.PUSH, DeliveryChannel.EMAIL],
    ),
    NotificationType.EVENT_REMINDER: NotificationTemplate(
        type=NotificationType.EVENT_REMINDER,
        title_template="Rappel: {event_name}",
        body_template="Dans {time_until}",
        icon="⏰",
        default_priority=NotificationPriority.HIGH,
        default_channels=[DeliveryChannel.IN_APP, DeliveryChannel.PUSH],
    ),
    NotificationType.SIGNATURE_REQUESTED: NotificationTemplate(
        type=NotificationType.SIGNATURE_REQUESTED,
        title_template="Signature requise",
        body_template="{sender} vous demande de signer: {document_name}",
        icon="✍️",
        default_priority=NotificationPriority.HIGH,
        default_channels=[DeliveryChannel.IN_APP, DeliveryChannel.PUSH, DeliveryChannel.EMAIL],
    ),
    NotificationType.PAYMENT_RECEIVED: NotificationTemplate(
        type=NotificationType.PAYMENT_RECEIVED,
        title_template="💰 Paiement reçu",
        body_template="Paiement de {amount}$ reçu de {client}",
        icon="💰",
        default_priority=NotificationPriority.NORMAL,
        default_channels=[DeliveryChannel.IN_APP, DeliveryChannel.EMAIL],
    ),
    NotificationType.BUDGET_ALERT: NotificationTemplate(
        type=NotificationType.BUDGET_ALERT,
        title_template="⚠️ Alerte budget",
        body_template="Le projet {project} a atteint {percent}% du budget",
        icon="⚠️",
        default_priority=NotificationPriority.URGENT,
        default_channels=[DeliveryChannel.IN_APP, DeliveryChannel.PUSH, DeliveryChannel.EMAIL],
    ),
}

# ═══════════════════════════════════════════════════════════════════════════════
# STORAGE
# ═══════════════════════════════════════════════════════════════════════════════

notifications_db: Dict[str, List[Notification]] = {}  # user_id -> notifications
preferences_db: Dict[str, NotificationPreferences] = {}

# ═══════════════════════════════════════════════════════════════════════════════
# WEBSOCKET CONNECTION MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        self.user_websockets: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        
        if user_id not in self.user_websockets:
            self.user_websockets[user_id] = set()
        
        self.user_websockets[user_id].add(websocket)
        logger.info(f"WebSocket connected for user: {user_id}")
    
    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.user_websockets:
            self.user_websockets[user_id].discard(websocket)
            
            if not self.user_websockets[user_id]:
                del self.user_websockets[user_id]
        
        logger.info(f"WebSocket disconnected for user: {user_id}")
    
    async def send_to_user(self, user_id: str, message: dict):
        if user_id in self.user_websockets:
            disconnected = set()
            
            for websocket in self.user_websockets[user_id]:
                try:
                    await websocket.send_json(message)
                except:
                    disconnected.add(websocket)
            
            # Clean up disconnected sockets
            for ws in disconnected:
                self.user_websockets[user_id].discard(ws)
    
    async def broadcast(self, message: dict):
        for user_id in self.user_websockets:
            await self.send_to_user(user_id, message)
    
    def get_online_users(self) -> List[str]:
        return list(self.user_websockets.keys())

manager = ConnectionManager()

# ═══════════════════════════════════════════════════════════════════════════════
# NOTIFICATION SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

class NotificationService:
    @staticmethod
    async def create(
        user_id: str,
        type: NotificationType,
        data: Dict[str, Any],
        priority: NotificationPriority = None,
        channels: List[DeliveryChannel] = None,
    ) -> Notification:
        """Create and deliver notification."""
        
        # Get template
        template = NOTIFICATION_TEMPLATES.get(type)
        if not template:
            template = NotificationTemplate(
                type=type,
                title_template=type.value,
                body_template=str(data),
                icon="🔔",
                default_priority=NotificationPriority.NORMAL,
                default_channels=[DeliveryChannel.IN_APP],
            )
        
        # Get user preferences
        prefs = preferences_db.get(user_id, NotificationPreferences(user_id=user_id))
        
        # Check if notifications enabled
        if not prefs.enabled:
            logger.info(f"Notifications disabled for user {user_id}")
            return None
        
        # Check quiet hours
        if prefs.quiet_hours and NotificationService._is_quiet_hours(prefs.quiet_hours):
            if (priority or template.default_priority) not in [NotificationPriority.HIGH, NotificationPriority.URGENT]:
                logger.info(f"Notification delayed due to quiet hours for user {user_id}")
                # Could queue for later delivery
                pass
        
        # Format message
        title = template.title_template.format(**data)
        body = template.body_template.format(**data)
        
        # Determine channels
        effective_channels = channels or template.default_channels
        effective_channels = [c for c in effective_channels if prefs.channels.get(c, True)]
        
        # Create notification
        notification = Notification(
            user_id=user_id,
            type=type,
            title=title,
            body=body,
            priority=priority or template.default_priority,
            icon=template.icon,
            data=data,
            channels=effective_channels,
            action_url=data.get("action_url"),
        )
        
        # Store notification
        if user_id not in notifications_db:
            notifications_db[user_id] = []
        
        notifications_db[user_id].insert(0, notification)
        
        # Limit stored notifications
        if len(notifications_db[user_id]) > 100:
            notifications_db[user_id] = notifications_db[user_id][:100]
        
        # Deliver via channels
        await NotificationService._deliver(notification, prefs)
        
        return notification
    
    @staticmethod
    async def _deliver(notification: Notification, prefs: NotificationPreferences):
        """Deliver notification through configured channels."""
        
        for channel in notification.channels:
            try:
                if channel == DeliveryChannel.IN_APP:
                    await NotificationService._deliver_in_app(notification)
                elif channel == DeliveryChannel.PUSH:
                    await NotificationService._deliver_push(notification, prefs)
                elif channel == DeliveryChannel.EMAIL:
                    await NotificationService._deliver_email(notification)
                elif channel == DeliveryChannel.SMS:
                    await NotificationService._deliver_sms(notification)
            except Exception as e:
                logger.error(f"Failed to deliver via {channel}: {e}")
    
    @staticmethod
    async def _deliver_in_app(notification: Notification):
        """Send via WebSocket."""
        await manager.send_to_user(notification.user_id, {
            "type": "notification",
            "data": {
                "id": notification.id,
                "type": notification.type,
                "title": notification.title,
                "body": notification.body,
                "icon": notification.icon,
                "priority": notification.priority,
                "action_url": notification.action_url,
                "created_at": notification.created_at.isoformat(),
            }
        })
    
    @staticmethod
    async def _deliver_push(notification: Notification, prefs: NotificationPreferences):
        """Send web push notification."""
        if not prefs.push_subscription:
            return
        
        # In production, use webpush library
        logger.info(f"Push notification sent: {notification.title}")
    
    @staticmethod
    async def _deliver_email(notification: Notification):
        """Send email notification."""
        # In production, use SendGrid, AWS SES, etc.
        logger.info(f"Email notification sent: {notification.title}")
    
    @staticmethod
    async def _deliver_sms(notification: Notification):
        """Send SMS notification."""
        # In production, use Twilio
        logger.info(f"SMS notification sent: {notification.title}")
    
    @staticmethod
    def _is_quiet_hours(quiet_hours: Dict[str, Any]) -> bool:
        """Check if current time is within quiet hours."""
        now = datetime.now()
        start = datetime.strptime(quiet_hours.get("start", "22:00"), "%H:%M").time()
        end = datetime.strptime(quiet_hours.get("end", "07:00"), "%H:%M").time()
        
        current_time = now.time()
        
        if start <= end:
            return start <= current_time <= end
        else:  # Overnight (e.g., 22:00 - 07:00)
            return current_time >= start or current_time <= end

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """WebSocket connection for real-time notifications."""
    await manager.connect(websocket, user_id)
    
    try:
        # Send initial unread count
        unread = len([n for n in notifications_db.get(user_id, []) if not n.is_read])
        await websocket.send_json({
            "type": "connected",
            "unread_count": unread,
        })
        
        # Keep connection alive
        while True:
            data = await websocket.receive_text()
            
            # Handle ping/pong
            if data == "ping":
                await websocket.send_text("pong")
            
            # Handle mark as read
            elif data.startswith("read:"):
                notif_id = data.split(":")[1]
                for n in notifications_db.get(user_id, []):
                    if n.id == notif_id:
                        n.is_read = True
                        n.read_at = datetime.utcnow()
                        break
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)

@router.get("")
async def list_notifications(
    user_id: str,
    unread_only: bool = False,
    type: Optional[NotificationType] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """List user notifications."""
    notifications = notifications_db.get(user_id, [])
    
    if unread_only:
        notifications = [n for n in notifications if not n.is_read]
    
    if type:
        notifications = [n for n in notifications if n.type == type]
    
    total = len(notifications)
    notifications = notifications[offset:offset + limit]
    
    return {
        "notifications": [n.dict() for n in notifications],
        "total": total,
        "unread_count": len([n for n in notifications_db.get(user_id, []) if not n.is_read]),
    }

@router.get("/unread-count")
async def get_unread_count(user_id: str):
    """Get unread notification count."""
    count = len([n for n in notifications_db.get(user_id, []) if not n.is_read])
    return {"count": count}

@router.post("/{notification_id}/read")
async def mark_as_read(user_id: str, notification_id: str):
    """Mark notification as read."""
    for n in notifications_db.get(user_id, []):
        if n.id == notification_id:
            n.is_read = True
            n.read_at = datetime.utcnow()
            return {"success": True}
    
    raise HTTPException(status_code=404, detail="Notification not found")

@router.post("/mark-all-read")
async def mark_all_read(user_id: str):
    """Mark all notifications as read."""
    count = 0
    for n in notifications_db.get(user_id, []):
        if not n.is_read:
            n.is_read = True
            n.read_at = datetime.utcnow()
            count += 1
    
    return {"marked_count": count}

@router.delete("/{notification_id}")
async def delete_notification(user_id: str, notification_id: str):
    """Delete notification."""
    notifications = notifications_db.get(user_id, [])
    notifications_db[user_id] = [n for n in notifications if n.id != notification_id]
    return {"success": True}

@router.delete("")
async def clear_notifications(user_id: str, read_only: bool = True):
    """Clear notifications."""
    if read_only:
        notifications_db[user_id] = [n for n in notifications_db.get(user_id, []) if not n.is_read]
    else:
        notifications_db[user_id] = []
    
    return {"success": True}

# ═══════════════════════════════════════════════════════════════════════════════
# PREFERENCES ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/preferences")
async def get_preferences(user_id: str):
    """Get notification preferences."""
    prefs = preferences_db.get(user_id, NotificationPreferences(user_id=user_id))
    return prefs.dict()

@router.put("/preferences")
async def update_preferences(user_id: str, prefs: NotificationPreferences):
    """Update notification preferences."""
    prefs.user_id = user_id
    preferences_db[user_id] = prefs
    return prefs.dict()

@router.post("/preferences/push-subscription")
async def save_push_subscription(user_id: str, subscription: Dict[str, Any]):
    """Save push notification subscription."""
    prefs = preferences_db.get(user_id, NotificationPreferences(user_id=user_id))
    prefs.push_subscription = subscription
    preferences_db[user_id] = prefs
    return {"success": True}

# ═══════════════════════════════════════════════════════════════════════════════
# SEND NOTIFICATION ENDPOINT (for testing/internal use)
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/send")
async def send_notification(
    user_id: str,
    type: NotificationType,
    data: Dict[str, Any],
    priority: Optional[NotificationPriority] = None,
):
    """Send notification (for testing)."""
    notification = await NotificationService.create(
        user_id=user_id,
        type=type,
        data=data,
        priority=priority,
    )
    
    if notification:
        return {"success": True, "notification_id": notification.id}
    
    return {"success": False, "message": "Notification not sent"}

@router.post("/broadcast")
async def broadcast_notification(
    type: NotificationType,
    data: Dict[str, Any],
    user_ids: Optional[List[str]] = None,
):
    """Broadcast notification to multiple users."""
    sent = 0
    
    target_users = user_ids or list(preferences_db.keys())
    
    for user_id in target_users:
        notification = await NotificationService.create(
            user_id=user_id,
            type=type,
            data=data,
        )
        if notification:
            sent += 1
    
    return {"sent": sent, "total": len(target_users)}

# ═══════════════════════════════════════════════════════════════════════════════
# ONLINE STATUS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/online-users")
async def get_online_users():
    """Get list of online users."""
    return {"users": manager.get_online_users()}
