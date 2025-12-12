"""
CHE·NU Unified - Customer Support Integrations
═══════════════════════════════════════════════════════════════════════════════
Clients pour Zendesk, Intercom, Freshdesk, HelpScout.

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import logging
import aiohttp

logger = logging.getLogger("CHE·NU.Integrations.Support")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class TicketStatus(str, Enum):
    NEW = "new"
    OPEN = "open"
    PENDING = "pending"
    ON_HOLD = "on_hold"
    SOLVED = "solved"
    CLOSED = "closed"


class TicketPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class TicketChannel(str, Enum):
    EMAIL = "email"
    CHAT = "chat"
    PHONE = "phone"
    WEB = "web"
    API = "api"
    SOCIAL = "social"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class SupportCustomer:
    """Client du support."""
    id: str
    email: str
    name: Optional[str] = None
    phone: Optional[str] = None
    
    # Profile
    company: Optional[str] = None
    role: Optional[str] = None
    
    # Support data
    tickets_count: int = 0
    last_contact: Optional[datetime] = None
    
    # Custom
    tags: List[str] = field(default_factory=list)
    custom_fields: Dict[str, Any] = field(default_factory=dict)
    
    created_at: Optional[datetime] = None


@dataclass
class Ticket:
    """Ticket de support unifié."""
    id: str
    subject: str
    
    # Status
    status: TicketStatus = TicketStatus.NEW
    priority: TicketPriority = TicketPriority.NORMAL
    
    # Content
    description: Optional[str] = None
    
    # Relations
    customer_id: Optional[str] = None
    customer_email: Optional[str] = None
    assignee_id: Optional[str] = None
    group_id: Optional[str] = None
    
    # Channel
    channel: TicketChannel = TicketChannel.WEB
    
    # Tags
    tags: List[str] = field(default_factory=list)
    
    # Timing
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    solved_at: Optional[datetime] = None
    
    # Metrics
    first_response_time_minutes: Optional[int] = None
    resolution_time_minutes: Optional[int] = None
    
    # Custom
    custom_fields: Dict[str, Any] = field(default_factory=dict)


@dataclass
class TicketComment:
    """Commentaire sur un ticket."""
    id: str
    ticket_id: str
    body: str
    
    author_id: str
    author_name: Optional[str] = None
    is_public: bool = True
    
    # Attachments
    attachments: List[Dict[str, Any]] = field(default_factory=list)
    
    created_at: Optional[datetime] = None


@dataclass
class Conversation:
    """Conversation (Intercom style)."""
    id: str
    
    # State
    state: str = "open"  # open, closed, snoozed
    
    # Participants
    user_id: Optional[str] = None
    assignee_id: Optional[str] = None
    
    # Content
    subject: Optional[str] = None
    messages_count: int = 0
    
    # Source
    source_type: str = "user"  # user, admin, bot
    
    # Timing
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    # Tags
    tags: List[str] = field(default_factory=list)


@dataclass 
class Article:
    """Article de base de connaissances."""
    id: str
    title: str
    
    # Content
    body: Optional[str] = None
    summary: Optional[str] = None
    
    # Organization
    category_id: Optional[str] = None
    section_id: Optional[str] = None
    
    # Status
    status: str = "draft"  # draft, published
    
    # Stats
    views_count: int = 0
    helpful_count: int = 0
    not_helpful_count: int = 0
    
    # SEO
    keywords: List[str] = field(default_factory=list)
    
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# ═══════════════════════════════════════════════════════════════════════════════
# ZENDESK CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class ZendeskClient:
    """
    🟢 Client Zendesk
    
    Fonctionnalités:
    - Tickets (CRUD, assignation, tags)
    - Users & Organizations
    - Help Center (articles)
    - Views & Automations
    """
    
    def __init__(self, subdomain: str, email: str, api_token: str):
        self.subdomain = subdomain
        self.email = email
        self.api_token = api_token
        self.base_url = f"https://{subdomain}.zendesk.com/api/v2"
    
    def _get_auth(self) -> aiohttp.BasicAuth:
        return aiohttp.BasicAuth(f"{self.email}/token", self.api_token)
    
    def _get_headers(self) -> Dict[str, str]:
        return {"Content-Type": "application/json"}
    
    # --- Tickets ---
    async def list_tickets(
        self,
        status: Optional[str] = None,
        assignee_id: Optional[int] = None,
        page: int = 1,
        per_page: int = 100
    ) -> List[Ticket]:
        """Liste les tickets."""
        params = {"page": page, "per_page": per_page}
        
        endpoint = f"{self.base_url}/tickets.json"
        if status:
            endpoint = f"{self.base_url}/search.json"
            params["query"] = f"type:ticket status:{status}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                endpoint,
                auth=self._get_auth(),
                params=params
            ) as resp:
                data = await resp.json()
                tickets = data.get("tickets", data.get("results", []))
                return [self._parse_ticket(t) for t in tickets]
    
    async def get_ticket(self, ticket_id: int) -> Ticket:
        """Récupère un ticket."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/tickets/{ticket_id}.json",
                auth=self._get_auth()
            ) as resp:
                data = await resp.json()
                return self._parse_ticket(data.get("ticket", {}))
    
    async def create_ticket(
        self,
        subject: str,
        description: str,
        requester_email: str,
        priority: str = "normal",
        **kwargs
    ) -> Ticket:
        """Crée un ticket."""
        payload = {
            "ticket": {
                "subject": subject,
                "comment": {"body": description},
                "requester": {"email": requester_email},
                "priority": priority,
                "tags": kwargs.get("tags", []),
                "assignee_id": kwargs.get("assignee_id"),
                "group_id": kwargs.get("group_id")
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/tickets.json",
                auth=self._get_auth(),
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                return self._parse_ticket(data.get("ticket", {}))
    
    async def update_ticket(
        self,
        ticket_id: int,
        **updates
    ) -> Ticket:
        """Met à jour un ticket."""
        payload = {"ticket": {}}
        
        if "status" in updates:
            payload["ticket"]["status"] = updates["status"]
        if "priority" in updates:
            payload["ticket"]["priority"] = updates["priority"]
        if "assignee_id" in updates:
            payload["ticket"]["assignee_id"] = updates["assignee_id"]
        if "tags" in updates:
            payload["ticket"]["tags"] = updates["tags"]
        if "comment" in updates:
            payload["ticket"]["comment"] = {"body": updates["comment"]}
        
        async with aiohttp.ClientSession() as session:
            async with session.put(
                f"{self.base_url}/tickets/{ticket_id}.json",
                auth=self._get_auth(),
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                return self._parse_ticket(data.get("ticket", {}))
    
    async def add_comment(
        self,
        ticket_id: int,
        body: str,
        public: bool = True
    ) -> TicketComment:
        """Ajoute un commentaire."""
        payload = {
            "ticket": {
                "comment": {
                    "body": body,
                    "public": public
                }
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.put(
                f"{self.base_url}/tickets/{ticket_id}.json",
                auth=self._get_auth(),
                headers=self._get_headers(),
                json=payload
            ) as resp:
                return TicketComment(
                    id="new",
                    ticket_id=str(ticket_id),
                    body=body,
                    author_id="current",
                    is_public=public,
                    created_at=datetime.now()
                )
    
    # --- Users ---
    async def list_users(self, role: Optional[str] = None) -> List[SupportCustomer]:
        """Liste les utilisateurs."""
        params = {}
        if role:
            params["role"] = role
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/users.json",
                auth=self._get_auth(),
                params=params
            ) as resp:
                data = await resp.json()
                return [self._parse_user(u) for u in data.get("users", [])]
    
    async def search_users(self, query: str) -> List[SupportCustomer]:
        """Recherche des utilisateurs."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/users/search.json",
                auth=self._get_auth(),
                params={"query": query}
            ) as resp:
                data = await resp.json()
                return [self._parse_user(u) for u in data.get("users", [])]
    
    # --- Help Center ---
    async def list_articles(
        self,
        section_id: Optional[int] = None
    ) -> List[Article]:
        """Liste les articles."""
        endpoint = f"https://{self.subdomain}.zendesk.com/api/v2/help_center/articles.json"
        if section_id:
            endpoint = f"https://{self.subdomain}.zendesk.com/api/v2/help_center/sections/{section_id}/articles.json"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                endpoint,
                auth=self._get_auth()
            ) as resp:
                data = await resp.json()
                return [self._parse_article(a) for a in data.get("articles", [])]
    
    async def create_article(
        self,
        section_id: int,
        title: str,
        body: str,
        **kwargs
    ) -> Article:
        """Crée un article."""
        payload = {
            "article": {
                "title": title,
                "body": body,
                "locale": kwargs.get("locale", "en-us"),
                "draft": kwargs.get("draft", True)
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"https://{self.subdomain}.zendesk.com/api/v2/help_center/sections/{section_id}/articles.json",
                auth=self._get_auth(),
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                return self._parse_article(data.get("article", {}))
    
    # --- Stats ---
    async def get_ticket_stats(self) -> Dict[str, Any]:
        """Statistiques des tickets."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/tickets/count.json",
                auth=self._get_auth()
            ) as resp:
                data = await resp.json()
                return {"total": data.get("count", {}).get("value", 0)}
    
    # --- Parse helpers ---
    def _parse_ticket(self, data: Dict) -> Ticket:
        status_map = {
            "new": TicketStatus.NEW,
            "open": TicketStatus.OPEN,
            "pending": TicketStatus.PENDING,
            "hold": TicketStatus.ON_HOLD,
            "solved": TicketStatus.SOLVED,
            "closed": TicketStatus.CLOSED
        }
        
        priority_map = {
            "low": TicketPriority.LOW,
            "normal": TicketPriority.NORMAL,
            "high": TicketPriority.HIGH,
            "urgent": TicketPriority.URGENT
        }
        
        return Ticket(
            id=str(data.get("id", "")),
            subject=data.get("subject", ""),
            description=data.get("description"),
            status=status_map.get(data.get("status", "new"), TicketStatus.NEW),
            priority=priority_map.get(data.get("priority", "normal"), TicketPriority.NORMAL),
            customer_id=str(data.get("requester_id", "")) if data.get("requester_id") else None,
            assignee_id=str(data.get("assignee_id", "")) if data.get("assignee_id") else None,
            group_id=str(data.get("group_id", "")) if data.get("group_id") else None,
            tags=data.get("tags", []),
            created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")) if data.get("created_at") else None,
            updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")) if data.get("updated_at") else None
        )
    
    def _parse_user(self, data: Dict) -> SupportCustomer:
        return SupportCustomer(
            id=str(data.get("id", "")),
            email=data.get("email", ""),
            name=data.get("name"),
            phone=data.get("phone"),
            tags=data.get("tags", []),
            created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")) if data.get("created_at") else None
        )
    
    def _parse_article(self, data: Dict) -> Article:
        return Article(
            id=str(data.get("id", "")),
            title=data.get("title", ""),
            body=data.get("body"),
            section_id=str(data.get("section_id", "")) if data.get("section_id") else None,
            status="published" if not data.get("draft") else "draft",
            views_count=data.get("vote_count", 0),
            created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")) if data.get("created_at") else None
        )


# ═══════════════════════════════════════════════════════════════════════════════
# INTERCOM CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class IntercomClient:
    """
    🔵 Client Intercom
    
    Fonctionnalités:
    - Conversations
    - Contacts (Users, Leads)
    - Companies
    - Messages
    - Help Center
    """
    
    BASE_URL = "https://api.intercom.io"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "Intercom-Version": "2.10"
        }
    
    # --- Conversations ---
    async def list_conversations(
        self,
        state: Optional[str] = None
    ) -> List[Conversation]:
        """Liste les conversations."""
        params = {}
        if state:
            params["state"] = state
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/conversations",
                headers=self._get_headers(),
                params=params
            ) as resp:
                data = await resp.json()
                return [self._parse_conversation(c) for c in data.get("conversations", [])]
    
    async def get_conversation(self, conversation_id: str) -> Conversation:
        """Récupère une conversation."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/conversations/{conversation_id}",
                headers=self._get_headers()
            ) as resp:
                data = await resp.json()
                return self._parse_conversation(data)
    
    async def reply_to_conversation(
        self,
        conversation_id: str,
        body: str,
        message_type: str = "comment",
        admin_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Répond à une conversation."""
        payload = {
            "message_type": message_type,
            "type": "admin",
            "admin_id": admin_id,
            "body": body
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/conversations/{conversation_id}/reply",
                headers=self._get_headers(),
                json=payload
            ) as resp:
                return await resp.json()
    
    async def close_conversation(self, conversation_id: str, admin_id: str) -> Dict[str, Any]:
        """Ferme une conversation."""
        payload = {
            "message_type": "close",
            "type": "admin",
            "admin_id": admin_id
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/conversations/{conversation_id}/reply",
                headers=self._get_headers(),
                json=payload
            ) as resp:
                return await resp.json()
    
    # --- Contacts ---
    async def list_contacts(self, email: Optional[str] = None) -> List[SupportCustomer]:
        """Liste les contacts."""
        params = {}
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/contacts",
                headers=self._get_headers(),
                params=params
            ) as resp:
                data = await resp.json()
                return [self._parse_contact(c) for c in data.get("data", [])]
    
    async def get_contact(self, contact_id: str) -> SupportCustomer:
        """Récupère un contact."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/contacts/{contact_id}",
                headers=self._get_headers()
            ) as resp:
                data = await resp.json()
                return self._parse_contact(data)
    
    async def create_contact(
        self,
        email: str,
        name: Optional[str] = None,
        **kwargs
    ) -> SupportCustomer:
        """Crée un contact."""
        payload = {
            "role": "user",
            "email": email,
            "name": name,
            "phone": kwargs.get("phone"),
            "custom_attributes": kwargs.get("custom_attributes", {})
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/contacts",
                headers=self._get_headers(),
                json={k: v for k, v in payload.items() if v}
            ) as resp:
                data = await resp.json()
                return self._parse_contact(data)
    
    async def update_contact(
        self,
        contact_id: str,
        **updates
    ) -> SupportCustomer:
        """Met à jour un contact."""
        async with aiohttp.ClientSession() as session:
            async with session.put(
                f"{self.BASE_URL}/contacts/{contact_id}",
                headers=self._get_headers(),
                json=updates
            ) as resp:
                data = await resp.json()
                return self._parse_contact(data)
    
    # --- Messages ---
    async def send_message(
        self,
        from_admin_id: str,
        to_user_id: str,
        body: str,
        message_type: str = "inapp"
    ) -> Dict[str, Any]:
        """Envoie un message."""
        payload = {
            "message_type": message_type,
            "body": body,
            "from": {
                "type": "admin",
                "id": from_admin_id
            },
            "to": {
                "type": "user",
                "id": to_user_id
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/messages",
                headers=self._get_headers(),
                json=payload
            ) as resp:
                return await resp.json()
    
    # --- Companies ---
    async def list_companies(self) -> List[Dict[str, Any]]:
        """Liste les companies."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/companies",
                headers=self._get_headers()
            ) as resp:
                data = await resp.json()
                return data.get("data", [])
    
    # --- Admins ---
    async def list_admins(self) -> List[Dict[str, Any]]:
        """Liste les admins."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/admins",
                headers=self._get_headers()
            ) as resp:
                data = await resp.json()
                return data.get("admins", [])
    
    # --- Parse helpers ---
    def _parse_conversation(self, data: Dict) -> Conversation:
        source = data.get("source", {})
        
        return Conversation(
            id=data.get("id", ""),
            state=data.get("state", "open"),
            user_id=data.get("contacts", {}).get("contacts", [{}])[0].get("id") if data.get("contacts") else None,
            assignee_id=data.get("admin_assignee_id"),
            subject=source.get("subject"),
            source_type=source.get("type", "user"),
            created_at=datetime.fromtimestamp(data["created_at"]) if data.get("created_at") else None,
            updated_at=datetime.fromtimestamp(data["updated_at"]) if data.get("updated_at") else None,
            tags=[t.get("name", "") for t in data.get("tags", {}).get("tags", [])]
        )
    
    def _parse_contact(self, data: Dict) -> SupportCustomer:
        return SupportCustomer(
            id=data.get("id", ""),
            email=data.get("email", ""),
            name=data.get("name"),
            phone=data.get("phone"),
            company=data.get("companies", {}).get("data", [{}])[0].get("name") if data.get("companies") else None,
            custom_fields=data.get("custom_attributes", {}),
            created_at=datetime.fromtimestamp(data["created_at"]) if data.get("created_at") else None
        )


# ═══════════════════════════════════════════════════════════════════════════════
# FRESHDESK CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class FreshdeskClient:
    """
    🟣 Client Freshdesk
    
    Fonctionnalités:
    - Tickets
    - Contacts
    - Companies
    - Agents & Groups
    - Solutions (KB)
    """
    
    def __init__(self, domain: str, api_key: str):
        self.domain = domain
        self.api_key = api_key
        self.base_url = f"https://{domain}.freshdesk.com/api/v2"
    
    def _get_auth(self) -> aiohttp.BasicAuth:
        return aiohttp.BasicAuth(self.api_key, "X")
    
    def _get_headers(self) -> Dict[str, str]:
        return {"Content-Type": "application/json"}
    
    # --- Tickets ---
    async def list_tickets(
        self,
        filter: Optional[str] = None,
        page: int = 1,
        per_page: int = 30
    ) -> List[Ticket]:
        """Liste les tickets."""
        params = {"page": page, "per_page": per_page}
        if filter:
            params["filter"] = filter
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/tickets",
                auth=self._get_auth(),
                params=params
            ) as resp:
                data = await resp.json()
                return [self._parse_ticket(t) for t in data]
    
    async def get_ticket(self, ticket_id: int) -> Ticket:
        """Récupère un ticket."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/tickets/{ticket_id}",
                auth=self._get_auth()
            ) as resp:
                data = await resp.json()
                return self._parse_ticket(data)
    
    async def create_ticket(
        self,
        subject: str,
        description: str,
        email: str,
        priority: int = 1,
        status: int = 2,
        **kwargs
    ) -> Ticket:
        """Crée un ticket."""
        payload = {
            "subject": subject,
            "description": description,
            "email": email,
            "priority": priority,
            "status": status,
            "tags": kwargs.get("tags", []),
            "responder_id": kwargs.get("responder_id"),
            "group_id": kwargs.get("group_id")
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/tickets",
                auth=self._get_auth(),
                headers=self._get_headers(),
                json={k: v for k, v in payload.items() if v is not None}
            ) as resp:
                data = await resp.json()
                return self._parse_ticket(data)
    
    async def update_ticket(self, ticket_id: int, **updates) -> Ticket:
        """Met à jour un ticket."""
        async with aiohttp.ClientSession() as session:
            async with session.put(
                f"{self.base_url}/tickets/{ticket_id}",
                auth=self._get_auth(),
                headers=self._get_headers(),
                json=updates
            ) as resp:
                data = await resp.json()
                return self._parse_ticket(data)
    
    async def reply_to_ticket(
        self,
        ticket_id: int,
        body: str
    ) -> Dict[str, Any]:
        """Répond à un ticket."""
        payload = {"body": body}
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/tickets/{ticket_id}/reply",
                auth=self._get_auth(),
                headers=self._get_headers(),
                json=payload
            ) as resp:
                return await resp.json()
    
    # --- Contacts ---
    async def list_contacts(self) -> List[SupportCustomer]:
        """Liste les contacts."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/contacts",
                auth=self._get_auth()
            ) as resp:
                data = await resp.json()
                return [self._parse_contact(c) for c in data]
    
    async def create_contact(
        self,
        email: str,
        name: Optional[str] = None,
        **kwargs
    ) -> SupportCustomer:
        """Crée un contact."""
        payload = {
            "email": email,
            "name": name,
            "phone": kwargs.get("phone"),
            "company_id": kwargs.get("company_id")
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/contacts",
                auth=self._get_auth(),
                headers=self._get_headers(),
                json={k: v for k, v in payload.items() if v}
            ) as resp:
                data = await resp.json()
                return self._parse_contact(data)
    
    # --- Parse helpers ---
    def _parse_ticket(self, data: Dict) -> Ticket:
        status_map = {
            2: TicketStatus.OPEN,
            3: TicketStatus.PENDING,
            4: TicketStatus.SOLVED,
            5: TicketStatus.CLOSED
        }
        
        priority_map = {
            1: TicketPriority.LOW,
            2: TicketPriority.NORMAL,
            3: TicketPriority.HIGH,
            4: TicketPriority.URGENT
        }
        
        return Ticket(
            id=str(data.get("id", "")),
            subject=data.get("subject", ""),
            description=data.get("description_text"),
            status=status_map.get(data.get("status", 2), TicketStatus.OPEN),
            priority=priority_map.get(data.get("priority", 1), TicketPriority.LOW),
            customer_id=str(data.get("requester_id", "")) if data.get("requester_id") else None,
            customer_email=data.get("email"),
            assignee_id=str(data.get("responder_id", "")) if data.get("responder_id") else None,
            group_id=str(data.get("group_id", "")) if data.get("group_id") else None,
            tags=data.get("tags", []),
            created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")) if data.get("created_at") else None,
            updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")) if data.get("updated_at") else None
        )
    
    def _parse_contact(self, data: Dict) -> SupportCustomer:
        return SupportCustomer(
            id=str(data.get("id", "")),
            email=data.get("email", ""),
            name=data.get("name"),
            phone=data.get("phone"),
            company=data.get("company_name"),
            created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")) if data.get("created_at") else None
        )


# ═══════════════════════════════════════════════════════════════════════════════
# SUPPORT SERVICE UNIFIÉ
# ═══════════════════════════════════════════════════════════════════════════════

class SupportService:
    """
    🎯 Service Support Unifié
    
    Agrège les données de tous les outils de support.
    """
    
    def __init__(self):
        self._zendesk_clients: Dict[str, ZendeskClient] = {}
        self._intercom_clients: Dict[str, IntercomClient] = {}
        self._freshdesk_clients: Dict[str, FreshdeskClient] = {}
    
    # --- Registration ---
    def register_zendesk(
        self,
        account_id: str,
        subdomain: str,
        email: str,
        api_token: str
    ) -> None:
        self._zendesk_clients[account_id] = ZendeskClient(subdomain, email, api_token)
        logger.info(f"✅ Zendesk registered: {account_id}")
    
    def register_intercom(
        self,
        account_id: str,
        access_token: str
    ) -> None:
        self._intercom_clients[account_id] = IntercomClient(access_token)
        logger.info(f"✅ Intercom registered: {account_id}")
    
    def register_freshdesk(
        self,
        account_id: str,
        domain: str,
        api_key: str
    ) -> None:
        self._freshdesk_clients[account_id] = FreshdeskClient(domain, api_key)
        logger.info(f"✅ Freshdesk registered: {account_id}")
    
    # --- Unified Methods ---
    async def get_all_tickets(
        self,
        account_ids: List[str],
        status: Optional[str] = None
    ) -> List[Ticket]:
        """Récupère tous les tickets."""
        all_tickets = []
        
        for account_id in account_ids:
            if account_id in self._zendesk_clients:
                tickets = await self._zendesk_clients[account_id].list_tickets(status=status)
                all_tickets.extend(tickets)
            
            if account_id in self._freshdesk_clients:
                tickets = await self._freshdesk_clients[account_id].list_tickets()
                all_tickets.extend(tickets)
        
        return all_tickets
    
    async def get_support_dashboard(
        self,
        account_ids: List[str]
    ) -> Dict[str, Any]:
        """Dashboard support unifié."""
        all_tickets = await self.get_all_tickets(account_ids)
        
        by_status = {}
        by_priority = {}
        
        for ticket in all_tickets:
            status = ticket.status.value
            priority = ticket.priority.value
            
            by_status[status] = by_status.get(status, 0) + 1
            by_priority[priority] = by_priority.get(priority, 0) + 1
        
        return {
            "total_tickets": len(all_tickets),
            "by_status": by_status,
            "by_priority": by_priority,
            "sources": list(account_ids)
        }


def create_support_service() -> SupportService:
    """Factory pour créer le service Support."""
    return SupportService()


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    "TicketStatus",
    "TicketPriority",
    "TicketChannel",
    
    # Data Classes
    "SupportCustomer",
    "Ticket",
    "TicketComment",
    "Conversation",
    "Article",
    
    # Clients
    "ZendeskClient",
    "IntercomClient",
    "FreshdeskClient",
    
    # Service
    "SupportService",
    "create_support_service"
]
