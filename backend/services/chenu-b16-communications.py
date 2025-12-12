"""
CHE·NU™ — B16-4: COMMUNICATIONS HUB
- SMS notifications (Twilio)
- WhatsApp Business
- Video meetings (Daily.co)
- Team chat
- Broadcast messages
- Read receipts
"""

from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass
import uuid

from fastapi import APIRouter, HTTPException, WebSocket
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/comms", tags=["Communications"])

class MessageChannel(str, Enum):
    SMS = "sms"
    WHATSAPP = "whatsapp"
    EMAIL = "email"
    PUSH = "push"
    IN_APP = "in_app"

class MessageStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
    FAILED = "failed"

class MeetingStatus(str, Enum):
    SCHEDULED = "scheduled"
    LIVE = "live"
    ENDED = "ended"
    CANCELLED = "cancelled"

class ChatType(str, Enum):
    DIRECT = "direct"
    GROUP = "group"
    PROJECT = "project"

@dataclass
class SMSMessage:
    id: str
    to: str
    from_number: str
    body: str
    status: MessageStatus
    sent_at: datetime
    delivered_at: Optional[datetime]
    error: Optional[str]

@dataclass
class WhatsAppMessage:
    id: str
    to: str
    template: Optional[str]
    body: str
    media_url: Optional[str]
    status: MessageStatus
    sent_at: datetime

@dataclass
class VideoMeeting:
    id: str
    name: str
    room_url: str
    host_id: str
    project_id: Optional[str]
    scheduled_at: datetime
    duration_minutes: int
    participants: List[str]
    status: MeetingStatus
    recording_url: Optional[str]
    created_at: datetime

@dataclass
class ChatRoom:
    id: str
    type: ChatType
    name: str
    participants: List[str]
    project_id: Optional[str]
    created_at: datetime
    last_message_at: Optional[datetime]

@dataclass
class ChatMessage:
    id: str
    room_id: str
    sender_id: str
    sender_name: str
    content: str
    attachments: List[str]
    read_by: List[str]
    created_at: datetime

class TwilioSMS:
    """SMS via Twilio."""
    _messages: List[SMSMessage] = []
    FROM_NUMBER = "+15145550123"  # Twilio number
    
    @classmethod
    async def send(cls, to: str, body: str) -> SMSMessage:
        # In production: Use Twilio API
        msg = SMSMessage(
            f"sms_{uuid.uuid4().hex[:8]}", to, cls.FROM_NUMBER, body,
            MessageStatus.SENT, datetime.utcnow(), None, None
        )
        cls._messages.append(msg)
        
        # Simulate delivery
        msg.status = MessageStatus.DELIVERED
        msg.delivered_at = datetime.utcnow()
        return msg
    
    @classmethod
    async def send_bulk(cls, recipients: List[str], body: str) -> List[SMSMessage]:
        return [await cls.send(to, body) for to in recipients]
    
    @classmethod
    async def get_status(cls, msg_id: str) -> Optional[SMSMessage]:
        return next((m for m in cls._messages if m.id == msg_id), None)

class WhatsAppBusiness:
    """WhatsApp Business API."""
    _messages: List[WhatsAppMessage] = []
    
    TEMPLATES = {
        "project_update": "Bonjour! Mise à jour sur votre projet {{project}}: {{message}}",
        "appointment_reminder": "Rappel: Rendez-vous le {{date}} à {{time}} pour {{subject}}",
        "invoice_sent": "Votre facture #{{invoice}} de {{amount}}$ est disponible.",
        "document_ready": "Le document {{document}} est prêt pour votre approbation.",
    }
    
    @classmethod
    async def send(cls, to: str, body: str, media_url: str = None) -> WhatsAppMessage:
        msg = WhatsAppMessage(
            f"wa_{uuid.uuid4().hex[:8]}", to, None, body, media_url,
            MessageStatus.SENT, datetime.utcnow()
        )
        cls._messages.append(msg)
        return msg
    
    @classmethod
    async def send_template(cls, to: str, template: str, params: Dict) -> WhatsAppMessage:
        template_body = cls.TEMPLATES.get(template, "")
        for key, value in params.items():
            template_body = template_body.replace(f"{{{{{key}}}}}", str(value))
        
        msg = WhatsAppMessage(
            f"wa_{uuid.uuid4().hex[:8]}", to, template, template_body, None,
            MessageStatus.SENT, datetime.utcnow()
        )
        cls._messages.append(msg)
        return msg
    
    @classmethod
    async def get_templates(cls) -> Dict:
        return {"templates": list(cls.TEMPLATES.keys())}

class VideoMeetingService:
    """Video meetings via Daily.co."""
    _meetings: Dict[str, VideoMeeting] = {}
    DAILY_DOMAIN = "chenu.daily.co"
    
    @classmethod
    async def create(cls, name: str, host_id: str, scheduled_at: datetime,
                    duration: int = 60, project_id: str = None) -> VideoMeeting:
        room_name = f"room-{uuid.uuid4().hex[:8]}"
        
        meeting = VideoMeeting(
            f"meet_{uuid.uuid4().hex[:8]}", name,
            f"https://{cls.DAILY_DOMAIN}/{room_name}",
            host_id, project_id, scheduled_at, duration,
            [host_id], MeetingStatus.SCHEDULED, None, datetime.utcnow()
        )
        cls._meetings[meeting.id] = meeting
        return meeting
    
    @classmethod
    async def add_participant(cls, meeting_id: str, user_id: str) -> VideoMeeting:
        meeting = cls._meetings.get(meeting_id)
        if not meeting:
            raise HTTPException(404, "Meeting not found")
        if user_id not in meeting.participants:
            meeting.participants.append(user_id)
        return meeting
    
    @classmethod
    async def start(cls, meeting_id: str) -> VideoMeeting:
        meeting = cls._meetings.get(meeting_id)
        if not meeting:
            raise HTTPException(404, "Meeting not found")
        meeting.status = MeetingStatus.LIVE
        return meeting
    
    @classmethod
    async def end(cls, meeting_id: str, recording_url: str = None) -> VideoMeeting:
        meeting = cls._meetings.get(meeting_id)
        if not meeting:
            raise HTTPException(404, "Meeting not found")
        meeting.status = MeetingStatus.ENDED
        meeting.recording_url = recording_url
        return meeting
    
    @classmethod
    async def get_upcoming(cls, user_id: str) -> List[Dict]:
        now = datetime.utcnow()
        meetings = [m for m in cls._meetings.values() 
                   if user_id in m.participants and m.scheduled_at > now
                   and m.status == MeetingStatus.SCHEDULED]
        return [{"id": m.id, "name": m.name, "url": m.room_url,
                 "scheduled": m.scheduled_at.isoformat()} for m in meetings]

class TeamChat:
    """Team chat system."""
    _rooms: Dict[str, ChatRoom] = {}
    _messages: List[ChatMessage] = []
    _connections: Dict[str, List[WebSocket]] = {}  # room_id -> websockets
    
    @classmethod
    async def create_room(cls, room_type: ChatType, name: str, 
                         participants: List[str], project_id: str = None) -> ChatRoom:
        room = ChatRoom(
            f"room_{uuid.uuid4().hex[:8]}", room_type, name,
            participants, project_id, datetime.utcnow(), None
        )
        cls._rooms[room.id] = room
        return room
    
    @classmethod
    async def send_message(cls, room_id: str, sender_id: str, 
                          sender_name: str, content: str, attachments: List[str] = []) -> ChatMessage:
        room = cls._rooms.get(room_id)
        if not room:
            raise HTTPException(404, "Room not found")
        
        msg = ChatMessage(
            f"msg_{uuid.uuid4().hex[:8]}", room_id, sender_id, sender_name,
            content, attachments, [sender_id], datetime.utcnow()
        )
        cls._messages.append(msg)
        room.last_message_at = msg.created_at
        
        # Broadcast to connected clients
        await cls._broadcast(room_id, msg)
        return msg
    
    @classmethod
    async def _broadcast(cls, room_id: str, msg: ChatMessage):
        connections = cls._connections.get(room_id, [])
        for ws in connections:
            try:
                await ws.send_json({
                    "type": "message",
                    "data": {"id": msg.id, "sender": msg.sender_name, 
                            "content": msg.content, "time": msg.created_at.isoformat()}
                })
            except:
                pass
    
    @classmethod
    async def get_messages(cls, room_id: str, limit: int = 50) -> List[Dict]:
        msgs = [m for m in cls._messages if m.room_id == room_id]
        msgs = sorted(msgs, key=lambda x: x.created_at, reverse=True)[:limit]
        return [{"id": m.id, "sender": m.sender_name, "content": m.content,
                 "time": m.created_at.isoformat()} for m in reversed(msgs)]
    
    @classmethod
    async def mark_read(cls, room_id: str, user_id: str):
        for msg in cls._messages:
            if msg.room_id == room_id and user_id not in msg.read_by:
                msg.read_by.append(user_id)
    
    @classmethod
    async def get_rooms(cls, user_id: str) -> List[Dict]:
        rooms = [r for r in cls._rooms.values() if user_id in r.participants]
        return [{"id": r.id, "type": r.type.value, "name": r.name,
                 "last_message": r.last_message_at.isoformat() if r.last_message_at else None} for r in rooms]

class BroadcastService:
    """Broadcast messages to multiple channels."""
    
    @classmethod
    async def send(cls, recipients: List[Dict], message: str, channels: List[MessageChannel]) -> Dict:
        results = {"sent": 0, "failed": 0, "details": []}
        
        for recipient in recipients:
            for channel in channels:
                try:
                    if channel == MessageChannel.SMS and recipient.get("phone"):
                        await TwilioSMS.send(recipient["phone"], message)
                        results["sent"] += 1
                    elif channel == MessageChannel.WHATSAPP and recipient.get("phone"):
                        await WhatsAppBusiness.send(recipient["phone"], message)
                        results["sent"] += 1
                    results["details"].append({"recipient": recipient.get("name"), "channel": channel.value, "status": "sent"})
                except Exception as e:
                    results["failed"] += 1
                    results["details"].append({"recipient": recipient.get("name"), "channel": channel.value, "status": "failed", "error": str(e)})
        
        return results

# API Endpoints
@router.post("/sms/send")
async def send_sms(to: str, body: str):
    msg = await TwilioSMS.send(to, body)
    return {"id": msg.id, "status": msg.status.value}

@router.post("/sms/bulk")
async def send_bulk_sms(recipients: List[str], body: str):
    msgs = await TwilioSMS.send_bulk(recipients, body)
    return {"sent": len(msgs), "ids": [m.id for m in msgs]}

@router.get("/whatsapp/templates")
async def get_wa_templates():
    return await WhatsAppBusiness.get_templates()

@router.post("/whatsapp/send")
async def send_whatsapp(to: str, body: str, media_url: str = None):
    msg = await WhatsAppBusiness.send(to, body, media_url)
    return {"id": msg.id, "status": msg.status.value}

@router.post("/whatsapp/template")
async def send_wa_template(to: str, template: str, params: Dict[str, Any]):
    msg = await WhatsAppBusiness.send_template(to, template, params)
    return {"id": msg.id, "body": msg.body}

@router.post("/meetings")
async def create_meeting(name: str, host_id: str, scheduled_at: str, duration: int = 60):
    meeting = await VideoMeetingService.create(name, host_id, datetime.fromisoformat(scheduled_at), duration)
    return {"id": meeting.id, "url": meeting.room_url}

@router.post("/meetings/{meeting_id}/participants")
async def add_participant(meeting_id: str, user_id: str):
    meeting = await VideoMeetingService.add_participant(meeting_id, user_id)
    return {"id": meeting.id, "participants": meeting.participants}

@router.post("/meetings/{meeting_id}/start")
async def start_meeting(meeting_id: str):
    meeting = await VideoMeetingService.start(meeting_id)
    return {"id": meeting.id, "status": meeting.status.value, "url": meeting.room_url}

@router.post("/meetings/{meeting_id}/end")
async def end_meeting(meeting_id: str):
    meeting = await VideoMeetingService.end(meeting_id)
    return {"id": meeting.id, "status": meeting.status.value}

@router.get("/meetings/upcoming")
async def upcoming_meetings(user_id: str):
    return {"meetings": await VideoMeetingService.get_upcoming(user_id)}

@router.post("/chat/rooms")
async def create_chat_room(type: ChatType, name: str, participants: List[str]):
    room = await TeamChat.create_room(type, name, participants)
    return {"id": room.id}

@router.get("/chat/rooms")
async def get_chat_rooms(user_id: str):
    return {"rooms": await TeamChat.get_rooms(user_id)}

@router.post("/chat/rooms/{room_id}/messages")
async def send_chat_message(room_id: str, sender_id: str, sender_name: str, content: str):
    msg = await TeamChat.send_message(room_id, sender_id, sender_name, content)
    return {"id": msg.id}

@router.get("/chat/rooms/{room_id}/messages")
async def get_chat_messages(room_id: str, limit: int = 50):
    return {"messages": await TeamChat.get_messages(room_id, limit)}

@router.post("/chat/rooms/{room_id}/read")
async def mark_room_read(room_id: str, user_id: str):
    await TeamChat.mark_read(room_id, user_id)
    return {"marked": True}

@router.post("/broadcast")
async def broadcast(recipients: List[Dict], message: str, channels: List[MessageChannel]):
    return await BroadcastService.send(recipients, message, channels)

# WebSocket for real-time chat
@router.websocket("/chat/ws/{room_id}")
async def chat_websocket(websocket: WebSocket, room_id: str):
    await websocket.accept()
    if room_id not in TeamChat._connections:
        TeamChat._connections[room_id] = []
    TeamChat._connections[room_id].append(websocket)
    
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "message":
                await TeamChat.send_message(
                    room_id, data["sender_id"], data["sender_name"], data["content"]
                )
    except:
        TeamChat._connections[room_id].remove(websocket)
