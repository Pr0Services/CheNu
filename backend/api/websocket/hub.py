"""
CHE·NU Backend - WebSocket Hub
==============================

Real-time communication for meetings, agents, and sync.
"""

from typing import Dict, Set, Optional, Any
from uuid import UUID
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum
import json
import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from pydantic import BaseModel

from core.security import decode_token, TokenData


router = APIRouter()


# ─────────────────────────────────────────────────────
# TYPES
# ─────────────────────────────────────────────────────

class MessageType(str, Enum):
    # Connection
    CONNECT = "connect"
    DISCONNECT = "disconnect"
    PING = "ping"
    PONG = "pong"
    
    # Room
    JOIN_ROOM = "join_room"
    LEAVE_ROOM = "leave_room"
    ROOM_STATE = "room_state"
    
    # Meeting
    MEETING_START = "meeting_start"
    MEETING_END = "meeting_end"
    PARTICIPANT_JOIN = "participant_join"
    PARTICIPANT_LEAVE = "participant_leave"
    
    # Agent
    AGENT_INVOKE = "agent_invoke"
    AGENT_RESPONSE = "agent_response"
    AGENT_STREAM = "agent_stream"
    
    # Timeline
    TIMELINE_EVENT = "timeline_event"
    
    # Sync
    STATE_SYNC = "state_sync"
    CURSOR_MOVE = "cursor_move"
    
    # Chat
    CHAT_MESSAGE = "chat_message"
    
    # Error
    ERROR = "error"


@dataclass
class WebSocketMessage:
    """WebSocket message structure."""
    type: MessageType
    payload: dict = field(default_factory=dict)
    room_id: Optional[str] = None
    sender_id: Optional[str] = None
    timestamp: datetime = field(default_factory=datetime.utcnow)
    
    def to_json(self) -> str:
        return json.dumps({
            "type": self.type.value,
            "payload": self.payload,
            "room_id": self.room_id,
            "sender_id": self.sender_id,
            "timestamp": self.timestamp.isoformat(),
        })
    
    @classmethod
    def from_json(cls, data: str) -> "WebSocketMessage":
        parsed = json.loads(data)
        return cls(
            type=MessageType(parsed["type"]),
            payload=parsed.get("payload", {}),
            room_id=parsed.get("room_id"),
            sender_id=parsed.get("sender_id"),
        )


@dataclass
class Connection:
    """WebSocket connection."""
    websocket: WebSocket
    user_id: str
    user_name: str
    rooms: Set[str] = field(default_factory=set)
    connected_at: datetime = field(default_factory=datetime.utcnow)
    
    async def send(self, message: WebSocketMessage):
        """Send message to this connection."""
        await self.websocket.send_text(message.to_json())


# ─────────────────────────────────────────────────────
# CONNECTION MANAGER
# ─────────────────────────────────────────────────────

class ConnectionManager:
    """Manages WebSocket connections and rooms."""
    
    def __init__(self):
        self.connections: Dict[str, Connection] = {}  # user_id -> Connection
        self.rooms: Dict[str, Set[str]] = {}  # room_id -> Set[user_id]
    
    async def connect(self, websocket: WebSocket, user: TokenData) -> Connection:
        """Accept and register a new connection."""
        await websocket.accept()
        
        conn = Connection(
            websocket=websocket,
            user_id=user.user_id,
            user_name=user.email,
        )
        self.connections[user.user_id] = conn
        
        # Notify about connection
        await conn.send(WebSocketMessage(
            type=MessageType.CONNECT,
            payload={
                "user_id": user.user_id,
                "message": "Connected to CHE·NU Hub",
            },
        ))
        
        return conn
    
    def disconnect(self, user_id: str):
        """Disconnect and cleanup."""
        if user_id in self.connections:
            conn = self.connections[user_id]
            
            # Remove from all rooms
            for room_id in conn.rooms.copy():
                self.leave_room(user_id, room_id)
            
            del self.connections[user_id]
    
    def join_room(self, user_id: str, room_id: str):
        """Join a room."""
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        
        self.rooms[room_id].add(user_id)
        
        if user_id in self.connections:
            self.connections[user_id].rooms.add(room_id)
    
    def leave_room(self, user_id: str, room_id: str):
        """Leave a room."""
        if room_id in self.rooms:
            self.rooms[room_id].discard(user_id)
            if not self.rooms[room_id]:
                del self.rooms[room_id]
        
        if user_id in self.connections:
            self.connections[user_id].rooms.discard(room_id)
    
    async def send_to_user(self, user_id: str, message: WebSocketMessage):
        """Send message to specific user."""
        if user_id in self.connections:
            await self.connections[user_id].send(message)
    
    async def broadcast_to_room(
        self,
        room_id: str,
        message: WebSocketMessage,
        exclude: Optional[str] = None,
    ):
        """Broadcast message to all users in a room."""
        if room_id not in self.rooms:
            return
        
        message.room_id = room_id
        
        for user_id in self.rooms[room_id]:
            if user_id != exclude and user_id in self.connections:
                await self.connections[user_id].send(message)
    
    async def broadcast_all(
        self,
        message: WebSocketMessage,
        exclude: Optional[str] = None,
    ):
        """Broadcast to all connected users."""
        for user_id, conn in self.connections.items():
            if user_id != exclude:
                await conn.send(message)
    
    def get_room_users(self, room_id: str) -> list[str]:
        """Get users in a room."""
        return list(self.rooms.get(room_id, set()))
    
    def get_user_rooms(self, user_id: str) -> list[str]:
        """Get rooms a user is in."""
        if user_id in self.connections:
            return list(self.connections[user_id].rooms)
        return []


# Global manager
manager = ConnectionManager()


# ─────────────────────────────────────────────────────
# WEBSOCKET ENDPOINTS
# ─────────────────────────────────────────────────────

@router.websocket("/hub")
async def websocket_hub(
    websocket: WebSocket,
    token: str = Query(...),
):
    """Main WebSocket hub endpoint."""
    # Authenticate
    try:
        user = decode_token(token)
    except Exception:
        await websocket.close(code=4001, reason="Invalid token")
        return
    
    # Connect
    conn = await manager.connect(websocket, user)
    
    try:
        while True:
            # Receive message
            data = await websocket.receive_text()
            
            try:
                message = WebSocketMessage.from_json(data)
                message.sender_id = user.user_id
                
                # Handle message types
                await handle_message(conn, message)
                
            except json.JSONDecodeError:
                await conn.send(WebSocketMessage(
                    type=MessageType.ERROR,
                    payload={"error": "Invalid JSON"},
                ))
            except Exception as e:
                await conn.send(WebSocketMessage(
                    type=MessageType.ERROR,
                    payload={"error": str(e)},
                ))
    
    except WebSocketDisconnect:
        manager.disconnect(user.user_id)
        
        # Notify rooms about disconnect
        for room_id in conn.rooms:
            await manager.broadcast_to_room(
                room_id,
                WebSocketMessage(
                    type=MessageType.PARTICIPANT_LEAVE,
                    payload={
                        "user_id": user.user_id,
                        "user_name": user.email,
                    },
                ),
            )


async def handle_message(conn: Connection, message: WebSocketMessage):
    """Handle incoming WebSocket message."""
    
    if message.type == MessageType.PING:
        await conn.send(WebSocketMessage(type=MessageType.PONG))
    
    elif message.type == MessageType.JOIN_ROOM:
        room_id = message.payload.get("room_id")
        if room_id:
            manager.join_room(conn.user_id, room_id)
            
            # Send room state
            await conn.send(WebSocketMessage(
                type=MessageType.ROOM_STATE,
                room_id=room_id,
                payload={
                    "users": manager.get_room_users(room_id),
                },
            ))
            
            # Notify others
            await manager.broadcast_to_room(
                room_id,
                WebSocketMessage(
                    type=MessageType.PARTICIPANT_JOIN,
                    payload={
                        "user_id": conn.user_id,
                        "user_name": conn.user_name,
                    },
                ),
                exclude=conn.user_id,
            )
    
    elif message.type == MessageType.LEAVE_ROOM:
        room_id = message.payload.get("room_id")
        if room_id:
            manager.leave_room(conn.user_id, room_id)
            
            await manager.broadcast_to_room(
                room_id,
                WebSocketMessage(
                    type=MessageType.PARTICIPANT_LEAVE,
                    payload={
                        "user_id": conn.user_id,
                        "user_name": conn.user_name,
                    },
                ),
            )
    
    elif message.type == MessageType.CHAT_MESSAGE:
        room_id = message.room_id or message.payload.get("room_id")
        if room_id:
            await manager.broadcast_to_room(
                room_id,
                WebSocketMessage(
                    type=MessageType.CHAT_MESSAGE,
                    payload={
                        "sender_id": conn.user_id,
                        "sender_name": conn.user_name,
                        "content": message.payload.get("content"),
                        "timestamp": datetime.utcnow().isoformat(),
                    },
                ),
            )
    
    elif message.type == MessageType.CURSOR_MOVE:
        room_id = message.room_id
        if room_id:
            await manager.broadcast_to_room(
                room_id,
                WebSocketMessage(
                    type=MessageType.CURSOR_MOVE,
                    payload={
                        "user_id": conn.user_id,
                        "position": message.payload.get("position"),
                    },
                ),
                exclude=conn.user_id,
            )
    
    elif message.type == MessageType.AGENT_INVOKE:
        # Forward to agent service (would integrate with agents route)
        # For now, acknowledge receipt
        await conn.send(WebSocketMessage(
            type=MessageType.AGENT_RESPONSE,
            payload={
                "status": "received",
                "agent_id": message.payload.get("agent_id"),
            },
        ))


# ─────────────────────────────────────────────────────
# MEETING ROOM WEBSOCKET
# ─────────────────────────────────────────────────────

@router.websocket("/meeting/{meeting_id}")
async def websocket_meeting(
    websocket: WebSocket,
    meeting_id: str,
    token: str = Query(...),
):
    """WebSocket for specific meeting room."""
    try:
        user = decode_token(token)
    except Exception:
        await websocket.close(code=4001, reason="Invalid token")
        return
    
    conn = await manager.connect(websocket, user)
    room_id = f"meeting:{meeting_id}"
    manager.join_room(user.user_id, room_id)
    
    # Notify join
    await manager.broadcast_to_room(
        room_id,
        WebSocketMessage(
            type=MessageType.PARTICIPANT_JOIN,
            payload={
                "user_id": user.user_id,
                "user_name": user.email,
                "meeting_id": meeting_id,
            },
        ),
    )
    
    try:
        while True:
            data = await websocket.receive_text()
            message = WebSocketMessage.from_json(data)
            message.sender_id = user.user_id
            message.room_id = room_id
            
            # Broadcast to meeting room
            await manager.broadcast_to_room(room_id, message)
    
    except WebSocketDisconnect:
        manager.leave_room(user.user_id, room_id)
        manager.disconnect(user.user_id)
        
        await manager.broadcast_to_room(
            room_id,
            WebSocketMessage(
                type=MessageType.PARTICIPANT_LEAVE,
                payload={
                    "user_id": user.user_id,
                    "meeting_id": meeting_id,
                },
            ),
        )


# ─────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ─────────────────────────────────────────────────────

async def emit_timeline_event(project_id: str, event: dict):
    """Emit timeline event to project subscribers."""
    room_id = f"project:{project_id}"
    await manager.broadcast_to_room(
        room_id,
        WebSocketMessage(
            type=MessageType.TIMELINE_EVENT,
            payload=event,
        ),
    )


async def emit_agent_response(user_id: str, response: dict):
    """Send agent response to specific user."""
    await manager.send_to_user(
        user_id,
        WebSocketMessage(
            type=MessageType.AGENT_RESPONSE,
            payload=response,
        ),
    )


# ─────────────────────────────────────────────────────
# ROUTER ALIAS
# ─────────────────────────────────────────────────────

websocket_router = router


# ─────────────────────────────────────────────────────
# EXPORTS
# ─────────────────────────────────────────────────────

__all__ = [
    "websocket_router",
    "router",
    "manager",
    "ConnectionManager",
    "WebSocketMessage",
    "MessageType",
    "emit_timeline_event",
    "emit_agent_response",
]
