"""
CHE·NU v6.0 - Communication Integrations
═══════════════════════════════════════════════════════════════════════════════
Intégrations communication et collaboration:
- Slack
- Microsoft Teams
- Zoom
- Discord
- Google Meet

Author: CHE·NU Team
Version: 6.0
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, AsyncIterator
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
import logging
import aiohttp
import json

logger = logging.getLogger("CHE·NU.Integrations.Communication")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class MessageType(Enum):
    TEXT = "text"
    FILE = "file"
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    LINK = "link"
    CARD = "card"
    REACTION = "reaction"


class ChannelType(Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    DIRECT = "direct"
    GROUP = "group"


class MeetingStatus(Enum):
    SCHEDULED = "scheduled"
    WAITING = "waiting"
    STARTED = "started"
    ENDED = "ended"
    CANCELLED = "cancelled"


class UserPresence(Enum):
    ONLINE = "online"
    AWAY = "away"
    DND = "dnd"  # Do not disturb
    OFFLINE = "offline"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class ChatUser:
    """Utilisateur de chat."""
    id: str
    name: str
    display_name: Optional[str] = None
    email: Optional[str] = None
    avatar_url: Optional[str] = None
    presence: UserPresence = UserPresence.OFFLINE
    is_bot: bool = False
    timezone: Optional[str] = None


@dataclass
class Channel:
    """Canal de discussion."""
    id: str
    name: str
    type: ChannelType = ChannelType.PUBLIC
    description: Optional[str] = None
    topic: Optional[str] = None
    member_count: int = 0
    is_archived: bool = False
    created_at: Optional[datetime] = None
    creator_id: Optional[str] = None


@dataclass
class Message:
    """Message."""
    id: str
    channel_id: str
    user_id: str
    user_name: Optional[str] = None
    content: str = ""
    type: MessageType = MessageType.TEXT
    thread_id: Optional[str] = None
    attachments: List[Dict[str, Any]] = field(default_factory=list)
    reactions: List[Dict[str, Any]] = field(default_factory=list)
    is_edited: bool = False
    created_at: Optional[datetime] = None
    edited_at: Optional[datetime] = None


@dataclass
class VideoMeeting:
    """Réunion vidéo."""
    id: str
    title: str
    host_id: str
    host_email: Optional[str] = None
    status: MeetingStatus = MeetingStatus.SCHEDULED
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_minutes: int = 60
    join_url: Optional[str] = None
    password: Optional[str] = None
    participants: List[str] = field(default_factory=list)
    recording_url: Optional[str] = None
    settings: Dict[str, Any] = field(default_factory=dict)


@dataclass
class SlackBlock:
    """Bloc Slack pour messages riches."""
    type: str
    text: Optional[Dict[str, str]] = None
    elements: Optional[List[Dict]] = None
    accessory: Optional[Dict] = None
    
    def to_dict(self) -> Dict[str, Any]:
        result = {"type": self.type}
        if self.text:
            result["text"] = self.text
        if self.elements:
            result["elements"] = self.elements
        if self.accessory:
            result["accessory"] = self.accessory
        return result


# ═══════════════════════════════════════════════════════════════════════════════
# BASE CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class BaseCommunicationClient:
    def __init__(self, access_token: str, **kwargs):
        self.access_token = access_token
        self.session: Optional[aiohttp.ClientSession] = None
        self.config = kwargs
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(headers=self._get_headers())
        return self
    
    async def __aexit__(self, *args):
        if self.session:
            await self.session.close()
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }


# ═══════════════════════════════════════════════════════════════════════════════
# SLACK INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class SlackClient(BaseCommunicationClient):
    """
    💬 Client Slack
    
    Fonctionnalités:
    - Canaux et messages
    - Fichiers et partage
    - Réactions et threads
    - Utilisateurs et présence
    - Webhooks et apps
    - Blocks et messages riches
    """
    
    BASE_URL = "https://slack.com/api"
    
    # --- Auth & Info ---
    async def test_auth(self) -> Dict[str, Any]:
        """Vérifie l'authentification."""
        async with self.session.post(f"{self.BASE_URL}/auth.test") as resp:
            return await resp.json()
    
    async def get_team_info(self) -> Dict[str, Any]:
        """Récupère les infos de l'équipe."""
        async with self.session.get(f"{self.BASE_URL}/team.info") as resp:
            data = await resp.json()
            return data.get("team", {})
    
    # --- Users ---
    async def list_users(self, limit: int = 200) -> List[ChatUser]:
        """Liste les utilisateurs."""
        async with self.session.get(
            f"{self.BASE_URL}/users.list",
            params={"limit": limit}
        ) as resp:
            data = await resp.json()
            
            return [
                ChatUser(
                    id=u.get("id"),
                    name=u.get("name", ""),
                    display_name=u.get("profile", {}).get("display_name"),
                    email=u.get("profile", {}).get("email"),
                    avatar_url=u.get("profile", {}).get("image_192"),
                    is_bot=u.get("is_bot", False),
                    timezone=u.get("tz")
                )
                for u in data.get("members", [])
                if not u.get("deleted")
            ]
    
    async def get_user(self, user_id: str) -> ChatUser:
        """Récupère un utilisateur."""
        async with self.session.get(
            f"{self.BASE_URL}/users.info",
            params={"user": user_id}
        ) as resp:
            data = await resp.json()
            u = data.get("user", {})
            
            return ChatUser(
                id=u.get("id"),
                name=u.get("name", ""),
                display_name=u.get("profile", {}).get("display_name"),
                email=u.get("profile", {}).get("email"),
                avatar_url=u.get("profile", {}).get("image_192"),
                is_bot=u.get("is_bot", False),
                timezone=u.get("tz")
            )
    
    async def get_user_presence(self, user_id: str) -> UserPresence:
        """Récupère la présence d'un utilisateur."""
        async with self.session.get(
            f"{self.BASE_URL}/users.getPresence",
            params={"user": user_id}
        ) as resp:
            data = await resp.json()
            presence = data.get("presence", "offline")
            
            presence_map = {
                "active": UserPresence.ONLINE,
                "away": UserPresence.AWAY
            }
            return presence_map.get(presence, UserPresence.OFFLINE)
    
    # --- Channels ---
    async def list_channels(
        self,
        types: str = "public_channel,private_channel",
        limit: int = 200
    ) -> List[Channel]:
        """Liste les canaux."""
        async with self.session.get(
            f"{self.BASE_URL}/conversations.list",
            params={"types": types, "limit": limit}
        ) as resp:
            data = await resp.json()
            
            return [
                Channel(
                    id=c.get("id"),
                    name=c.get("name", ""),
                    type=ChannelType.PRIVATE if c.get("is_private") else ChannelType.PUBLIC,
                    description=c.get("purpose", {}).get("value"),
                    topic=c.get("topic", {}).get("value"),
                    member_count=c.get("num_members", 0),
                    is_archived=c.get("is_archived", False),
                    creator_id=c.get("creator")
                )
                for c in data.get("channels", [])
            ]
    
    async def create_channel(
        self,
        name: str,
        is_private: bool = False,
        description: str = None
    ) -> Channel:
        """Crée un canal."""
        payload = {"name": name, "is_private": is_private}
        
        async with self.session.post(
            f"{self.BASE_URL}/conversations.create",
            json=payload
        ) as resp:
            data = await resp.json()
            c = data.get("channel", {})
            
            channel = Channel(
                id=c.get("id"),
                name=name,
                type=ChannelType.PRIVATE if is_private else ChannelType.PUBLIC
            )
            
            if description:
                await self.set_channel_purpose(c.get("id"), description)
            
            return channel
    
    async def set_channel_purpose(self, channel_id: str, purpose: str) -> bool:
        """Définit la description d'un canal."""
        async with self.session.post(
            f"{self.BASE_URL}/conversations.setPurpose",
            json={"channel": channel_id, "purpose": purpose}
        ) as resp:
            data = await resp.json()
            return data.get("ok", False)
    
    async def invite_to_channel(self, channel_id: str, user_ids: List[str]) -> bool:
        """Invite des utilisateurs à un canal."""
        async with self.session.post(
            f"{self.BASE_URL}/conversations.invite",
            json={"channel": channel_id, "users": ",".join(user_ids)}
        ) as resp:
            data = await resp.json()
            return data.get("ok", False)
    
    # --- Messages ---
    async def get_messages(
        self,
        channel_id: str,
        limit: int = 100,
        oldest: str = None,
        latest: str = None
    ) -> List[Message]:
        """Récupère les messages d'un canal."""
        params = {"channel": channel_id, "limit": limit}
        if oldest:
            params["oldest"] = oldest
        if latest:
            params["latest"] = latest
        
        async with self.session.get(
            f"{self.BASE_URL}/conversations.history",
            params=params
        ) as resp:
            data = await resp.json()
            
            return [
                Message(
                    id=m.get("ts"),
                    channel_id=channel_id,
                    user_id=m.get("user", ""),
                    content=m.get("text", ""),
                    type=MessageType.TEXT,
                    thread_id=m.get("thread_ts"),
                    attachments=m.get("attachments", []),
                    reactions=m.get("reactions", []),
                    is_edited=bool(m.get("edited")),
                    created_at=datetime.fromtimestamp(float(m.get("ts", 0)))
                )
                for m in data.get("messages", [])
            ]
    
    async def post_message(
        self,
        channel_id: str,
        text: str,
        blocks: List[SlackBlock] = None,
        thread_ts: str = None,
        attachments: List[Dict] = None
    ) -> Message:
        """Envoie un message."""
        payload = {
            "channel": channel_id,
            "text": text
        }
        
        if blocks:
            payload["blocks"] = [b.to_dict() for b in blocks]
        if thread_ts:
            payload["thread_ts"] = thread_ts
        if attachments:
            payload["attachments"] = attachments
        
        async with self.session.post(
            f"{self.BASE_URL}/chat.postMessage",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return Message(
                id=data.get("ts"),
                channel_id=channel_id,
                user_id=data.get("message", {}).get("user", ""),
                content=text,
                created_at=datetime.now()
            )
    
    async def update_message(
        self,
        channel_id: str,
        message_ts: str,
        text: str,
        blocks: List[SlackBlock] = None
    ) -> bool:
        """Met à jour un message."""
        payload = {
            "channel": channel_id,
            "ts": message_ts,
            "text": text
        }
        
        if blocks:
            payload["blocks"] = [b.to_dict() for b in blocks]
        
        async with self.session.post(
            f"{self.BASE_URL}/chat.update",
            json=payload
        ) as resp:
            data = await resp.json()
            return data.get("ok", False)
    
    async def delete_message(self, channel_id: str, message_ts: str) -> bool:
        """Supprime un message."""
        async with self.session.post(
            f"{self.BASE_URL}/chat.delete",
            json={"channel": channel_id, "ts": message_ts}
        ) as resp:
            data = await resp.json()
            return data.get("ok", False)
    
    async def add_reaction(self, channel_id: str, message_ts: str, emoji: str) -> bool:
        """Ajoute une réaction."""
        async with self.session.post(
            f"{self.BASE_URL}/reactions.add",
            json={"channel": channel_id, "timestamp": message_ts, "name": emoji}
        ) as resp:
            data = await resp.json()
            return data.get("ok", False)
    
    # --- Files ---
    async def upload_file(
        self,
        channels: List[str],
        content: bytes,
        filename: str,
        title: str = None,
        initial_comment: str = None
    ) -> Dict[str, Any]:
        """Upload un fichier."""
        data = aiohttp.FormData()
        data.add_field("channels", ",".join(channels))
        data.add_field("filename", filename)
        data.add_field("file", content, filename=filename)
        
        if title:
            data.add_field("title", title)
        if initial_comment:
            data.add_field("initial_comment", initial_comment)
        
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/files.upload",
                headers=headers,
                data=data
            ) as resp:
                return await resp.json()
    
    # --- Webhooks (pour notifications) ---
    @staticmethod
    async def send_webhook(
        webhook_url: str,
        text: str,
        blocks: List[Dict] = None,
        attachments: List[Dict] = None
    ) -> bool:
        """Envoie via webhook."""
        payload = {"text": text}
        if blocks:
            payload["blocks"] = blocks
        if attachments:
            payload["attachments"] = attachments
        
        async with aiohttp.ClientSession() as session:
            async with session.post(webhook_url, json=payload) as resp:
                return resp.status == 200
    
    # --- Block Builders ---
    @staticmethod
    def create_section_block(text: str, accessory: Dict = None) -> SlackBlock:
        """Crée un bloc section."""
        return SlackBlock(
            type="section",
            text={"type": "mrkdwn", "text": text},
            accessory=accessory
        )
    
    @staticmethod
    def create_button_block(text: str, action_id: str, value: str = None) -> Dict:
        """Crée un bouton."""
        return {
            "type": "button",
            "text": {"type": "plain_text", "text": text},
            "action_id": action_id,
            "value": value or action_id
        }
    
    @staticmethod
    def create_divider_block() -> SlackBlock:
        """Crée un diviseur."""
        return SlackBlock(type="divider")


# ═══════════════════════════════════════════════════════════════════════════════
# MICROSOFT TEAMS INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class TeamsClient(BaseCommunicationClient):
    """
    🟦 Client Microsoft Teams
    
    Fonctionnalités:
    - Teams et canaux
    - Messages et chat
    - Réunions
    - Fichiers
    - Apps et bots
    """
    
    BASE_URL = "https://graph.microsoft.com/v1.0"
    
    # --- Teams ---
    async def list_teams(self) -> List[Dict[str, Any]]:
        """Liste les équipes."""
        async with self.session.get(f"{self.BASE_URL}/me/joinedTeams") as resp:
            data = await resp.json()
            return data.get("value", [])
    
    async def get_team(self, team_id: str) -> Dict[str, Any]:
        """Récupère une équipe."""
        async with self.session.get(f"{self.BASE_URL}/teams/{team_id}") as resp:
            return await resp.json()
    
    async def create_team(
        self,
        display_name: str,
        description: str = None,
        visibility: str = "private"
    ) -> Dict[str, Any]:
        """Crée une équipe."""
        payload = {
            "displayName": display_name,
            "description": description,
            "visibility": visibility,
            "template@odata.bind": "https://graph.microsoft.com/v1.0/teamsTemplates('standard')"
        }
        
        async with self.session.post(
            f"{self.BASE_URL}/teams",
            json=payload
        ) as resp:
            # Teams creation is async, returns location header
            return {"status": "creating", "location": resp.headers.get("Location")}
    
    # --- Channels ---
    async def list_channels(self, team_id: str) -> List[Channel]:
        """Liste les canaux d'une équipe."""
        async with self.session.get(
            f"{self.BASE_URL}/teams/{team_id}/channels"
        ) as resp:
            data = await resp.json()
            
            return [
                Channel(
                    id=c.get("id"),
                    name=c.get("displayName", ""),
                    type=ChannelType.PRIVATE if c.get("membershipType") == "private" else ChannelType.PUBLIC,
                    description=c.get("description")
                )
                for c in data.get("value", [])
            ]
    
    async def create_channel(
        self,
        team_id: str,
        display_name: str,
        description: str = None,
        membership_type: str = "standard"
    ) -> Channel:
        """Crée un canal."""
        payload = {
            "displayName": display_name,
            "description": description,
            "membershipType": membership_type
        }
        
        async with self.session.post(
            f"{self.BASE_URL}/teams/{team_id}/channels",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return Channel(
                id=data.get("id"),
                name=display_name,
                description=description
            )
    
    # --- Messages ---
    async def get_channel_messages(
        self,
        team_id: str,
        channel_id: str,
        top: int = 50
    ) -> List[Message]:
        """Récupère les messages d'un canal."""
        async with self.session.get(
            f"{self.BASE_URL}/teams/{team_id}/channels/{channel_id}/messages",
            params={"$top": top}
        ) as resp:
            data = await resp.json()
            
            return [
                Message(
                    id=m.get("id"),
                    channel_id=channel_id,
                    user_id=m.get("from", {}).get("user", {}).get("id", ""),
                    user_name=m.get("from", {}).get("user", {}).get("displayName"),
                    content=m.get("body", {}).get("content", ""),
                    type=MessageType.TEXT,
                    created_at=datetime.fromisoformat(m["createdDateTime"].replace("Z", "+00:00")) if m.get("createdDateTime") else None
                )
                for m in data.get("value", [])
            ]
    
    async def send_channel_message(
        self,
        team_id: str,
        channel_id: str,
        content: str,
        content_type: str = "html"
    ) -> Message:
        """Envoie un message dans un canal."""
        payload = {
            "body": {
                "contentType": content_type,
                "content": content
            }
        }
        
        async with self.session.post(
            f"{self.BASE_URL}/teams/{team_id}/channels/{channel_id}/messages",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return Message(
                id=data.get("id"),
                channel_id=channel_id,
                user_id="",
                content=content,
                created_at=datetime.now()
            )
    
    # --- Chats (1:1 et groupe) ---
    async def list_chats(self) -> List[Dict[str, Any]]:
        """Liste les conversations."""
        async with self.session.get(f"{self.BASE_URL}/me/chats") as resp:
            data = await resp.json()
            return data.get("value", [])
    
    async def send_chat_message(
        self,
        chat_id: str,
        content: str,
        content_type: str = "html"
    ) -> Message:
        """Envoie un message dans un chat."""
        payload = {
            "body": {
                "contentType": content_type,
                "content": content
            }
        }
        
        async with self.session.post(
            f"{self.BASE_URL}/chats/{chat_id}/messages",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return Message(
                id=data.get("id"),
                channel_id=chat_id,
                user_id="",
                content=content
            )
    
    # --- Meetings ---
    async def create_online_meeting(
        self,
        subject: str,
        start_time: datetime,
        end_time: datetime,
        participants: List[str] = None
    ) -> VideoMeeting:
        """Crée une réunion en ligne."""
        payload = {
            "subject": subject,
            "startDateTime": start_time.isoformat(),
            "endDateTime": end_time.isoformat()
        }
        
        if participants:
            payload["participants"] = {
                "attendees": [
                    {"upn": p, "role": "attendee"} for p in participants
                ]
            }
        
        async with self.session.post(
            f"{self.BASE_URL}/me/onlineMeetings",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return VideoMeeting(
                id=data.get("id"),
                title=subject,
                host_id="",
                status=MeetingStatus.SCHEDULED,
                start_time=start_time,
                end_time=end_time,
                join_url=data.get("joinWebUrl")
            )
    
    # --- Users ---
    async def get_me(self) -> ChatUser:
        """Récupère l'utilisateur courant."""
        async with self.session.get(f"{self.BASE_URL}/me") as resp:
            data = await resp.json()
            
            return ChatUser(
                id=data.get("id"),
                name=data.get("userPrincipalName", ""),
                display_name=data.get("displayName"),
                email=data.get("mail")
            )
    
    async def get_user_presence(self, user_id: str) -> UserPresence:
        """Récupère la présence d'un utilisateur."""
        async with self.session.get(
            f"{self.BASE_URL}/users/{user_id}/presence"
        ) as resp:
            data = await resp.json()
            availability = data.get("availability", "Offline")
            
            presence_map = {
                "Available": UserPresence.ONLINE,
                "Away": UserPresence.AWAY,
                "BeRightBack": UserPresence.AWAY,
                "Busy": UserPresence.DND,
                "DoNotDisturb": UserPresence.DND,
                "Offline": UserPresence.OFFLINE
            }
            return presence_map.get(availability, UserPresence.OFFLINE)


# ═══════════════════════════════════════════════════════════════════════════════
# ZOOM INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class ZoomClient(BaseCommunicationClient):
    """
    📹 Client Zoom
    
    Fonctionnalités:
    - Réunions instantanées et planifiées
    - Webinaires
    - Enregistrements
    - Participants
    - Rapports
    """
    
    BASE_URL = "https://api.zoom.us/v2"
    
    # --- User ---
    async def get_me(self) -> Dict[str, Any]:
        """Récupère l'utilisateur courant."""
        async with self.session.get(f"{self.BASE_URL}/users/me") as resp:
            return await resp.json()
    
    async def list_users(self, status: str = "active") -> List[ChatUser]:
        """Liste les utilisateurs."""
        async with self.session.get(
            f"{self.BASE_URL}/users",
            params={"status": status}
        ) as resp:
            data = await resp.json()
            
            return [
                ChatUser(
                    id=u.get("id"),
                    name=f"{u.get('first_name', '')} {u.get('last_name', '')}".strip(),
                    email=u.get("email"),
                    avatar_url=u.get("pic_url")
                )
                for u in data.get("users", [])
            ]
    
    # --- Meetings ---
    async def list_meetings(
        self,
        user_id: str = "me",
        type: str = "scheduled"
    ) -> List[VideoMeeting]:
        """Liste les réunions."""
        async with self.session.get(
            f"{self.BASE_URL}/users/{user_id}/meetings",
            params={"type": type}
        ) as resp:
            data = await resp.json()
            
            return [
                VideoMeeting(
                    id=str(m.get("id")),
                    title=m.get("topic", ""),
                    host_id=m.get("host_id", ""),
                    status=MeetingStatus.SCHEDULED,
                    start_time=datetime.fromisoformat(m["start_time"].replace("Z", "+00:00")) if m.get("start_time") else None,
                    duration_minutes=m.get("duration", 60),
                    join_url=m.get("join_url")
                )
                for m in data.get("meetings", [])
            ]
    
    async def get_meeting(self, meeting_id: str) -> VideoMeeting:
        """Récupère une réunion."""
        async with self.session.get(
            f"{self.BASE_URL}/meetings/{meeting_id}"
        ) as resp:
            m = await resp.json()
            
            status_map = {
                "waiting": MeetingStatus.WAITING,
                "started": MeetingStatus.STARTED,
                "finished": MeetingStatus.ENDED
            }
            
            return VideoMeeting(
                id=str(m.get("id")),
                title=m.get("topic", ""),
                host_id=m.get("host_id", ""),
                host_email=m.get("host_email"),
                status=status_map.get(m.get("status"), MeetingStatus.SCHEDULED),
                start_time=datetime.fromisoformat(m["start_time"].replace("Z", "+00:00")) if m.get("start_time") else None,
                duration_minutes=m.get("duration", 60),
                join_url=m.get("join_url"),
                password=m.get("password"),
                settings=m.get("settings", {})
            )
    
    async def create_meeting(
        self,
        topic: str,
        start_time: datetime = None,
        duration: int = 60,
        password: str = None,
        waiting_room: bool = True,
        join_before_host: bool = False,
        mute_upon_entry: bool = True,
        user_id: str = "me"
    ) -> VideoMeeting:
        """Crée une réunion."""
        payload = {
            "topic": topic,
            "type": 2 if start_time else 1,  # 1=instant, 2=scheduled
            "duration": duration,
            "settings": {
                "waiting_room": waiting_room,
                "join_before_host": join_before_host,
                "mute_upon_entry": mute_upon_entry,
                "auto_recording": "none"
            }
        }
        
        if start_time:
            payload["start_time"] = start_time.strftime("%Y-%m-%dT%H:%M:%S")
            payload["timezone"] = "America/Montreal"
        
        if password:
            payload["password"] = password
        
        async with self.session.post(
            f"{self.BASE_URL}/users/{user_id}/meetings",
            json=payload
        ) as resp:
            m = await resp.json()
            
            return VideoMeeting(
                id=str(m.get("id")),
                title=topic,
                host_id=user_id,
                status=MeetingStatus.SCHEDULED,
                start_time=start_time,
                duration_minutes=duration,
                join_url=m.get("join_url"),
                password=m.get("password")
            )
    
    async def update_meeting(
        self,
        meeting_id: str,
        updates: Dict[str, Any]
    ) -> bool:
        """Met à jour une réunion."""
        async with self.session.patch(
            f"{self.BASE_URL}/meetings/{meeting_id}",
            json=updates
        ) as resp:
            return resp.status == 204
    
    async def delete_meeting(self, meeting_id: str) -> bool:
        """Supprime une réunion."""
        async with self.session.delete(
            f"{self.BASE_URL}/meetings/{meeting_id}"
        ) as resp:
            return resp.status == 204
    
    async def end_meeting(self, meeting_id: str) -> bool:
        """Termine une réunion en cours."""
        async with self.session.put(
            f"{self.BASE_URL}/meetings/{meeting_id}/status",
            json={"action": "end"}
        ) as resp:
            return resp.status == 204
    
    # --- Participants ---
    async def get_meeting_participants(
        self,
        meeting_id: str
    ) -> List[Dict[str, Any]]:
        """Récupère les participants d'une réunion."""
        async with self.session.get(
            f"{self.BASE_URL}/meetings/{meeting_id}/participants"
        ) as resp:
            data = await resp.json()
            return data.get("participants", [])
    
    # --- Recordings ---
    async def list_recordings(
        self,
        user_id: str = "me",
        from_date: str = None,
        to_date: str = None
    ) -> List[Dict[str, Any]]:
        """Liste les enregistrements."""
        params = {}
        if from_date:
            params["from"] = from_date
        if to_date:
            params["to"] = to_date
        
        async with self.session.get(
            f"{self.BASE_URL}/users/{user_id}/recordings",
            params=params
        ) as resp:
            data = await resp.json()
            return data.get("meetings", [])
    
    async def get_meeting_recordings(self, meeting_id: str) -> Dict[str, Any]:
        """Récupère les enregistrements d'une réunion."""
        async with self.session.get(
            f"{self.BASE_URL}/meetings/{meeting_id}/recordings"
        ) as resp:
            return await resp.json()


# ═══════════════════════════════════════════════════════════════════════════════
# DISCORD INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class DiscordClient(BaseCommunicationClient):
    """
    🎮 Client Discord
    
    Fonctionnalités:
    - Serveurs (Guilds)
    - Canaux texte et vocaux
    - Messages
    - Webhooks
    - Rôles et permissions
    """
    
    BASE_URL = "https://discord.com/api/v10"
    
    # --- User ---
    async def get_me(self) -> ChatUser:
        """Récupère l'utilisateur courant."""
        async with self.session.get(f"{self.BASE_URL}/users/@me") as resp:
            data = await resp.json()
            
            avatar_url = None
            if data.get("avatar"):
                avatar_url = f"https://cdn.discordapp.com/avatars/{data['id']}/{data['avatar']}.png"
            
            return ChatUser(
                id=data.get("id"),
                name=data.get("username", ""),
                display_name=data.get("global_name"),
                email=data.get("email"),
                avatar_url=avatar_url,
                is_bot=data.get("bot", False)
            )
    
    # --- Guilds (Servers) ---
    async def list_guilds(self) -> List[Dict[str, Any]]:
        """Liste les serveurs."""
        async with self.session.get(f"{self.BASE_URL}/users/@me/guilds") as resp:
            return await resp.json()
    
    async def get_guild(self, guild_id: str) -> Dict[str, Any]:
        """Récupère un serveur."""
        async with self.session.get(f"{self.BASE_URL}/guilds/{guild_id}") as resp:
            return await resp.json()
    
    # --- Channels ---
    async def get_guild_channels(self, guild_id: str) -> List[Channel]:
        """Récupère les canaux d'un serveur."""
        async with self.session.get(
            f"{self.BASE_URL}/guilds/{guild_id}/channels"
        ) as resp:
            data = await resp.json()
            
            type_map = {
                0: ChannelType.PUBLIC,   # GUILD_TEXT
                2: ChannelType.PUBLIC,   # GUILD_VOICE
                4: ChannelType.PUBLIC,   # GUILD_CATEGORY
                5: ChannelType.PUBLIC,   # GUILD_ANNOUNCEMENT
                13: ChannelType.PUBLIC,  # GUILD_STAGE_VOICE
                15: ChannelType.PUBLIC,  # GUILD_FORUM
            }
            
            return [
                Channel(
                    id=c.get("id"),
                    name=c.get("name", ""),
                    type=type_map.get(c.get("type"), ChannelType.PUBLIC),
                    description=c.get("topic")
                )
                for c in data
                if c.get("type") in [0, 5, 15]  # Text channels only
            ]
    
    async def create_channel(
        self,
        guild_id: str,
        name: str,
        channel_type: int = 0,  # 0=text, 2=voice
        topic: str = None,
        parent_id: str = None
    ) -> Channel:
        """Crée un canal."""
        payload = {
            "name": name,
            "type": channel_type
        }
        
        if topic:
            payload["topic"] = topic
        if parent_id:
            payload["parent_id"] = parent_id
        
        async with self.session.post(
            f"{self.BASE_URL}/guilds/{guild_id}/channels",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return Channel(
                id=data.get("id"),
                name=name,
                description=topic
            )
    
    # --- Messages ---
    async def get_messages(
        self,
        channel_id: str,
        limit: int = 50,
        before: str = None,
        after: str = None
    ) -> List[Message]:
        """Récupère les messages d'un canal."""
        params = {"limit": limit}
        if before:
            params["before"] = before
        if after:
            params["after"] = after
        
        async with self.session.get(
            f"{self.BASE_URL}/channels/{channel_id}/messages",
            params=params
        ) as resp:
            data = await resp.json()
            
            return [
                Message(
                    id=m.get("id"),
                    channel_id=channel_id,
                    user_id=m.get("author", {}).get("id", ""),
                    user_name=m.get("author", {}).get("username"),
                    content=m.get("content", ""),
                    type=MessageType.TEXT,
                    attachments=m.get("attachments", []),
                    reactions=[
                        {"emoji": r.get("emoji", {}).get("name"), "count": r.get("count")}
                        for r in m.get("reactions", [])
                    ],
                    created_at=datetime.fromisoformat(m["timestamp"].replace("Z", "+00:00")) if m.get("timestamp") else None
                )
                for m in data
            ]
    
    async def send_message(
        self,
        channel_id: str,
        content: str,
        embeds: List[Dict] = None,
        components: List[Dict] = None
    ) -> Message:
        """Envoie un message."""
        payload = {"content": content}
        
        if embeds:
            payload["embeds"] = embeds
        if components:
            payload["components"] = components
        
        async with self.session.post(
            f"{self.BASE_URL}/channels/{channel_id}/messages",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return Message(
                id=data.get("id"),
                channel_id=channel_id,
                user_id=data.get("author", {}).get("id", ""),
                content=content,
                created_at=datetime.now()
            )
    
    async def add_reaction(
        self,
        channel_id: str,
        message_id: str,
        emoji: str
    ) -> bool:
        """Ajoute une réaction."""
        # URL encode emoji
        import urllib.parse
        encoded_emoji = urllib.parse.quote(emoji)
        
        async with self.session.put(
            f"{self.BASE_URL}/channels/{channel_id}/messages/{message_id}/reactions/{encoded_emoji}/@me"
        ) as resp:
            return resp.status == 204
    
    # --- Webhooks ---
    async def execute_webhook(
        self,
        webhook_id: str,
        webhook_token: str,
        content: str,
        username: str = None,
        avatar_url: str = None,
        embeds: List[Dict] = None
    ) -> bool:
        """Exécute un webhook."""
        payload = {"content": content}
        
        if username:
            payload["username"] = username
        if avatar_url:
            payload["avatar_url"] = avatar_url
        if embeds:
            payload["embeds"] = embeds
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/webhooks/{webhook_id}/{webhook_token}",
                json=payload
            ) as resp:
                return resp.status in [200, 204]
    
    # --- Embed Builder ---
    @staticmethod
    def create_embed(
        title: str,
        description: str = None,
        color: int = 0x5865F2,
        fields: List[Dict] = None,
        footer: str = None,
        image_url: str = None,
        thumbnail_url: str = None
    ) -> Dict[str, Any]:
        """Crée un embed Discord."""
        embed = {
            "title": title,
            "color": color
        }
        
        if description:
            embed["description"] = description
        if fields:
            embed["fields"] = fields
        if footer:
            embed["footer"] = {"text": footer}
        if image_url:
            embed["image"] = {"url": image_url}
        if thumbnail_url:
            embed["thumbnail"] = {"url": thumbnail_url}
        
        return embed


# ═══════════════════════════════════════════════════════════════════════════════
# COMMUNICATION SERVICE (Unified)
# ═══════════════════════════════════════════════════════════════════════════════

class CommunicationService:
    """
    📡 Service Communication Unifié
    """
    
    def __init__(self):
        self._clients: Dict[str, BaseCommunicationClient] = {}
    
    def register_slack(self, account_id: str, access_token: str):
        self._clients[account_id] = SlackClient(access_token)
    
    def register_teams(self, account_id: str, access_token: str):
        self._clients[account_id] = TeamsClient(access_token)
    
    def register_zoom(self, account_id: str, access_token: str):
        self._clients[account_id] = ZoomClient(access_token)
    
    def register_discord(self, account_id: str, access_token: str):
        self._clients[account_id] = DiscordClient(access_token)
    
    def get_client(self, account_id: str) -> BaseCommunicationClient:
        if account_id not in self._clients:
            raise ValueError(f"Account {account_id} not registered")
        return self._clients[account_id]
    
    async def send_to_all(
        self,
        account_ids: List[str],
        message: str,
        channel_ids: Dict[str, str] = None
    ) -> Dict[str, bool]:
        """Envoie un message à tous les canaux configurés."""
        results = {}
        
        for account_id in account_ids:
            client = self.get_client(account_id)
            channel_id = channel_ids.get(account_id) if channel_ids else None
            
            if not channel_id:
                results[account_id] = False
                continue
            
            try:
                async with client:
                    if isinstance(client, SlackClient):
                        await client.post_message(channel_id, message)
                    elif isinstance(client, TeamsClient):
                        # Teams needs team_id and channel_id
                        pass
                    elif isinstance(client, DiscordClient):
                        await client.send_message(channel_id, message)
                    
                    results[account_id] = True
            except Exception as e:
                logger.error(f"Failed to send to {account_id}: {e}")
                results[account_id] = False
        
        return results


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

def create_communication_service() -> CommunicationService:
    return CommunicationService()
