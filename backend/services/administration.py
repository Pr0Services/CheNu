"""
CHE·NU v6.0 - Administration Integrations
═══════════════════════════════════════════════════════════════════════════════
Intégrations administration et productivité:
- DocuSign (signatures électroniques)
- Calendly (prise de rendez-vous)
- Notion (wiki/documentation)
- Airtable (base de données)
- Trello/Monday (gestion de projets)
- Twilio (SMS/Appels)

Author: CHE·NU Team
Version: 6.0
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime, date, time, timedelta
from enum import Enum
import logging
import aiohttp
import json

logger = logging.getLogger("CHE·NU.Integrations.Admin")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS & TYPES
# ═══════════════════════════════════════════════════════════════════════════════

class DocumentStatus(Enum):
    DRAFT = "draft"
    SENT = "sent"
    DELIVERED = "delivered"
    SIGNED = "signed"
    COMPLETED = "completed"
    DECLINED = "declined"
    VOIDED = "voided"
    EXPIRED = "expired"


class MeetingStatus(Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
    NO_SHOW = "no_show"


class TaskStatus(Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"
    BLOCKED = "blocked"


class TaskPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class Signer:
    """Signataire d'un document."""
    email: str
    name: str
    role: str = "signer"
    order: int = 1
    signed_at: Optional[datetime] = None


@dataclass
class SignatureDocument:
    """Document à signer."""
    id: str
    name: str
    status: DocumentStatus
    signers: List[Signer] = field(default_factory=list)
    created_at: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    download_url: Optional[str] = None


@dataclass
class Meeting:
    """Rendez-vous/Réunion."""
    id: str
    title: str
    start_time: datetime
    end_time: datetime
    status: MeetingStatus = MeetingStatus.SCHEDULED
    location: Optional[str] = None
    meeting_url: Optional[str] = None
    organizer_email: Optional[str] = None
    attendees: List[str] = field(default_factory=list)
    description: Optional[str] = None
    reminder_minutes: int = 30


@dataclass
class CalendarSlot:
    """Créneau disponible."""
    start_time: datetime
    end_time: datetime
    available: bool = True


@dataclass
class AdminTask:
    """Tâche administrative."""
    id: str
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    assignee_id: Optional[str] = None
    assignee_email: Optional[str] = None
    due_date: Optional[date] = None
    project_id: Optional[str] = None
    board_id: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    checklist: List[Dict[str, Any]] = field(default_factory=list)
    attachments: List[str] = field(default_factory=list)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


@dataclass
class NotionPage:
    """Page Notion."""
    id: str
    title: str
    parent_id: Optional[str] = None
    parent_type: str = "workspace"  # workspace, page, database
    icon: Optional[str] = None
    cover: Optional[str] = None
    properties: Dict[str, Any] = field(default_factory=dict)
    content_blocks: List[Dict[str, Any]] = field(default_factory=list)
    created_at: Optional[datetime] = None
    last_edited_at: Optional[datetime] = None


@dataclass
class AirtableRecord:
    """Enregistrement Airtable."""
    id: str
    fields: Dict[str, Any]
    created_at: Optional[datetime] = None


# ═══════════════════════════════════════════════════════════════════════════════
# BASE CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class BaseAdminClient:
    """Classe de base pour les clients administration."""
    
    def __init__(self, access_token: str, **kwargs):
        self.access_token = access_token
        self.session: Optional[aiohttp.ClientSession] = None
        self.extra_config = kwargs
    
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
# DOCUSIGN INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class DocuSignClient(BaseAdminClient):
    """
    ✍️ Client DocuSign
    
    Fonctionnalités:
    - Créer et envoyer des enveloppes
    - Gérer les signataires
    - Suivre le statut des signatures
    - Télécharger les documents signés
    """
    
    BASE_URL = "https://na4.docusign.net/restapi/v2.1"  # Change based on account
    
    def __init__(self, access_token: str, account_id: str, base_uri: str = None):
        super().__init__(access_token)
        self.account_id = account_id
        if base_uri:
            self.BASE_URL = f"{base_uri}/restapi/v2.1"
    
    @property
    def account_url(self) -> str:
        return f"{self.BASE_URL}/accounts/{self.account_id}"
    
    # --- Envelopes ---
    async def list_envelopes(
        self,
        from_date: datetime = None,
        status: DocumentStatus = None,
        count: int = 100
    ) -> List[SignatureDocument]:
        """Liste les enveloppes."""
        params = {"count": count}
        if from_date:
            params["from_date"] = from_date.isoformat()
        if status:
            params["status"] = status.value
        
        async with self.session.get(
            f"{self.account_url}/envelopes",
            params=params
        ) as resp:
            data = await resp.json()
            
            return [
                SignatureDocument(
                    id=e.get("envelopeId"),
                    name=e.get("emailSubject", ""),
                    status=DocumentStatus(e.get("status", "sent")),
                    created_at=datetime.fromisoformat(e["createdDateTime"].replace("Z", "+00:00")) if e.get("createdDateTime") else None,
                    sent_at=datetime.fromisoformat(e["sentDateTime"].replace("Z", "+00:00")) if e.get("sentDateTime") else None,
                    completed_at=datetime.fromisoformat(e["completedDateTime"].replace("Z", "+00:00")) if e.get("completedDateTime") else None
                )
                for e in data.get("envelopes", [])
            ]
    
    async def get_envelope(self, envelope_id: str) -> SignatureDocument:
        """Récupère une enveloppe."""
        async with self.session.get(
            f"{self.account_url}/envelopes/{envelope_id}"
        ) as resp:
            data = await resp.json()
            
            # Get signers
            signers_resp = await self.session.get(
                f"{self.account_url}/envelopes/{envelope_id}/recipients"
            )
            signers_data = await signers_resp.json()
            
            signers = [
                Signer(
                    email=s.get("email", ""),
                    name=s.get("name", ""),
                    role=s.get("roleName", "signer"),
                    order=int(s.get("routingOrder", 1)),
                    signed_at=datetime.fromisoformat(s["signedDateTime"].replace("Z", "+00:00")) if s.get("signedDateTime") else None
                )
                for s in signers_data.get("signers", [])
            ]
            
            return SignatureDocument(
                id=data.get("envelopeId"),
                name=data.get("emailSubject", ""),
                status=DocumentStatus(data.get("status", "sent")),
                signers=signers,
                created_at=datetime.fromisoformat(data["createdDateTime"].replace("Z", "+00:00")) if data.get("createdDateTime") else None
            )
    
    async def create_envelope(
        self,
        subject: str,
        signers: List[Signer],
        documents: List[Dict[str, Any]],  # [{"name": "...", "content_base64": "..."}]
        message: str = None,
        send_immediately: bool = True
    ) -> SignatureDocument:
        """Crée une enveloppe avec documents."""
        # Build signers with tabs
        signer_list = []
        for i, signer in enumerate(signers):
            signer_list.append({
                "email": signer.email,
                "name": signer.name,
                "recipientId": str(i + 1),
                "routingOrder": str(signer.order),
                "tabs": {
                    "signHereTabs": [{
                        "documentId": "1",
                        "pageNumber": "1",
                        "xPosition": "100",
                        "yPosition": "700"
                    }],
                    "dateSignedTabs": [{
                        "documentId": "1",
                        "pageNumber": "1",
                        "xPosition": "100",
                        "yPosition": "750"
                    }]
                }
            })
        
        # Build documents
        doc_list = []
        for i, doc in enumerate(documents):
            doc_list.append({
                "documentId": str(i + 1),
                "name": doc.get("name", f"Document {i + 1}"),
                "fileExtension": doc.get("extension", "pdf"),
                "documentBase64": doc.get("content_base64")
            })
        
        payload = {
            "emailSubject": subject,
            "documents": doc_list,
            "recipients": {"signers": signer_list},
            "status": "sent" if send_immediately else "created"
        }
        
        if message:
            payload["emailBlurb"] = message
        
        async with self.session.post(
            f"{self.account_url}/envelopes",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return SignatureDocument(
                id=data.get("envelopeId"),
                name=subject,
                status=DocumentStatus.SENT if send_immediately else DocumentStatus.DRAFT,
                signers=signers
            )
    
    async def send_envelope(self, envelope_id: str) -> bool:
        """Envoie une enveloppe en draft."""
        payload = {"status": "sent"}
        
        async with self.session.put(
            f"{self.account_url}/envelopes/{envelope_id}",
            json=payload
        ) as resp:
            return resp.status == 200
    
    async def void_envelope(self, envelope_id: str, reason: str) -> bool:
        """Annule une enveloppe."""
        payload = {
            "status": "voided",
            "voidedReason": reason
        }
        
        async with self.session.put(
            f"{self.account_url}/envelopes/{envelope_id}",
            json=payload
        ) as resp:
            return resp.status == 200
    
    async def download_documents(self, envelope_id: str) -> bytes:
        """Télécharge les documents signés."""
        async with self.session.get(
            f"{self.account_url}/envelopes/{envelope_id}/documents/combined"
        ) as resp:
            return await resp.read()
    
    async def resend_envelope(self, envelope_id: str) -> bool:
        """Renvoie les notifications."""
        async with self.session.put(
            f"{self.account_url}/envelopes/{envelope_id}?resend_envelope=true",
            json={}
        ) as resp:
            return resp.status == 200


# ═══════════════════════════════════════════════════════════════════════════════
# CALENDLY INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class CalendlyClient(BaseAdminClient):
    """
    📅 Client Calendly
    
    Fonctionnalités:
    - Types d'événements
    - Disponibilités
    - Rendez-vous planifiés
    - Webhooks
    """
    
    BASE_URL = "https://api.calendly.com"
    
    async def get_current_user(self) -> Dict[str, Any]:
        """Récupère l'utilisateur courant."""
        async with self.session.get(f"{self.BASE_URL}/users/me") as resp:
            data = await resp.json()
            return data.get("resource", {})
    
    # --- Event Types ---
    async def list_event_types(self, user_uri: str = None) -> List[Dict[str, Any]]:
        """Liste les types d'événements."""
        if not user_uri:
            user = await self.get_current_user()
            user_uri = user.get("uri")
        
        async with self.session.get(
            f"{self.BASE_URL}/event_types",
            params={"user": user_uri, "active": True}
        ) as resp:
            data = await resp.json()
            return data.get("collection", [])
    
    async def get_event_type(self, event_type_uuid: str) -> Dict[str, Any]:
        """Récupère un type d'événement."""
        async with self.session.get(
            f"{self.BASE_URL}/event_types/{event_type_uuid}"
        ) as resp:
            data = await resp.json()
            return data.get("resource", {})
    
    # --- Scheduled Events ---
    async def list_scheduled_events(
        self,
        user_uri: str = None,
        min_start_time: datetime = None,
        max_start_time: datetime = None,
        status: str = "active",
        count: int = 100
    ) -> List[Meeting]:
        """Liste les événements planifiés."""
        if not user_uri:
            user = await self.get_current_user()
            user_uri = user.get("uri")
        
        params = {
            "user": user_uri,
            "status": status,
            "count": count
        }
        
        if min_start_time:
            params["min_start_time"] = min_start_time.isoformat()
        if max_start_time:
            params["max_start_time"] = max_start_time.isoformat()
        
        async with self.session.get(
            f"{self.BASE_URL}/scheduled_events",
            params=params
        ) as resp:
            data = await resp.json()
            
            meetings = []
            for event in data.get("collection", []):
                status_map = {
                    "active": MeetingStatus.SCHEDULED,
                    "canceled": MeetingStatus.CANCELLED
                }
                
                meetings.append(Meeting(
                    id=event.get("uri", "").split("/")[-1],
                    title=event.get("name", ""),
                    start_time=datetime.fromisoformat(event["start_time"].replace("Z", "+00:00")) if event.get("start_time") else datetime.now(),
                    end_time=datetime.fromisoformat(event["end_time"].replace("Z", "+00:00")) if event.get("end_time") else datetime.now(),
                    status=status_map.get(event.get("status"), MeetingStatus.SCHEDULED),
                    location=event.get("location", {}).get("location"),
                    meeting_url=event.get("location", {}).get("join_url")
                ))
            
            return meetings
    
    async def get_event_invitees(self, event_uuid: str) -> List[Dict[str, Any]]:
        """Récupère les invités d'un événement."""
        async with self.session.get(
            f"{self.BASE_URL}/scheduled_events/{event_uuid}/invitees"
        ) as resp:
            data = await resp.json()
            return data.get("collection", [])
    
    async def cancel_event(self, event_uuid: str, reason: str = None) -> bool:
        """Annule un événement."""
        payload = {}
        if reason:
            payload["reason"] = reason
        
        async with self.session.post(
            f"{self.BASE_URL}/scheduled_events/{event_uuid}/cancellation",
            json=payload
        ) as resp:
            return resp.status in [200, 201]
    
    # --- Availability ---
    async def get_user_availability(
        self,
        user_uri: str,
        start_time: datetime,
        end_time: datetime
    ) -> List[CalendarSlot]:
        """Récupère les disponibilités."""
        async with self.session.get(
            f"{self.BASE_URL}/user_availability_schedules",
            params={"user": user_uri}
        ) as resp:
            data = await resp.json()
            
            slots = []
            for schedule in data.get("collection", []):
                for rule in schedule.get("rules", []):
                    if rule.get("type") == "wday":
                        # Parse weekly rules
                        pass
            
            return slots


# ═══════════════════════════════════════════════════════════════════════════════
# NOTION INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class NotionClient(BaseAdminClient):
    """
    📝 Client Notion
    
    Fonctionnalités:
    - Pages et bases de données
    - Blocs de contenu
    - Recherche
    - Commentaires
    """
    
    BASE_URL = "https://api.notion.com/v1"
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28"
        }
    
    # --- Search ---
    async def search(
        self,
        query: str = None,
        filter_type: str = None,  # "page" or "database"
        sort_direction: str = "descending"
    ) -> List[Dict[str, Any]]:
        """Recherche dans Notion."""
        payload = {
            "sort": {
                "direction": sort_direction,
                "timestamp": "last_edited_time"
            }
        }
        
        if query:
            payload["query"] = query
        if filter_type:
            payload["filter"] = {"property": "object", "value": filter_type}
        
        async with self.session.post(
            f"{self.BASE_URL}/search",
            json=payload
        ) as resp:
            data = await resp.json()
            return data.get("results", [])
    
    # --- Pages ---
    async def get_page(self, page_id: str) -> NotionPage:
        """Récupère une page."""
        async with self.session.get(f"{self.BASE_URL}/pages/{page_id}") as resp:
            data = await resp.json()
            
            # Get title from properties
            title = ""
            for prop in data.get("properties", {}).values():
                if prop.get("type") == "title":
                    title = "".join([t.get("plain_text", "") for t in prop.get("title", [])])
                    break
            
            return NotionPage(
                id=data.get("id"),
                title=title,
                parent_id=data.get("parent", {}).get("page_id") or data.get("parent", {}).get("database_id"),
                parent_type=data.get("parent", {}).get("type", "workspace"),
                icon=data.get("icon", {}).get("emoji"),
                cover=data.get("cover", {}).get("external", {}).get("url"),
                properties=data.get("properties", {}),
                created_at=datetime.fromisoformat(data["created_time"].replace("Z", "+00:00")) if data.get("created_time") else None,
                last_edited_at=datetime.fromisoformat(data["last_edited_time"].replace("Z", "+00:00")) if data.get("last_edited_time") else None
            )
    
    async def create_page(
        self,
        parent_id: str,
        parent_type: str,  # "page_id" or "database_id"
        title: str,
        properties: Dict[str, Any] = None,
        content: List[Dict[str, Any]] = None,
        icon: str = None
    ) -> NotionPage:
        """Crée une page."""
        payload = {
            "parent": {parent_type: parent_id}
        }
        
        if parent_type == "database_id":
            payload["properties"] = properties or {"Name": {"title": [{"text": {"content": title}}]}}
        else:
            payload["properties"] = {"title": {"title": [{"text": {"content": title}}]}}
        
        if content:
            payload["children"] = content
        
        if icon:
            payload["icon"] = {"type": "emoji", "emoji": icon}
        
        async with self.session.post(
            f"{self.BASE_URL}/pages",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return NotionPage(
                id=data.get("id"),
                title=title,
                parent_id=parent_id,
                parent_type=parent_type.replace("_id", "")
            )
    
    async def update_page(
        self,
        page_id: str,
        properties: Dict[str, Any] = None,
        archived: bool = None
    ) -> Dict[str, Any]:
        """Met à jour une page."""
        payload = {}
        if properties:
            payload["properties"] = properties
        if archived is not None:
            payload["archived"] = archived
        
        async with self.session.patch(
            f"{self.BASE_URL}/pages/{page_id}",
            json=payload
        ) as resp:
            return await resp.json()
    
    # --- Blocks ---
    async def get_block_children(self, block_id: str) -> List[Dict[str, Any]]:
        """Récupère les blocs enfants."""
        async with self.session.get(
            f"{self.BASE_URL}/blocks/{block_id}/children"
        ) as resp:
            data = await resp.json()
            return data.get("results", [])
    
    async def append_blocks(
        self,
        page_id: str,
        blocks: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Ajoute des blocs à une page."""
        async with self.session.patch(
            f"{self.BASE_URL}/blocks/{page_id}/children",
            json={"children": blocks}
        ) as resp:
            data = await resp.json()
            return data.get("results", [])
    
    # --- Databases ---
    async def query_database(
        self,
        database_id: str,
        filter_conditions: Dict[str, Any] = None,
        sorts: List[Dict[str, Any]] = None,
        page_size: int = 100
    ) -> List[Dict[str, Any]]:
        """Interroge une base de données."""
        payload = {"page_size": page_size}
        if filter_conditions:
            payload["filter"] = filter_conditions
        if sorts:
            payload["sorts"] = sorts
        
        async with self.session.post(
            f"{self.BASE_URL}/databases/{database_id}/query",
            json=payload
        ) as resp:
            data = await resp.json()
            return data.get("results", [])
    
    # --- Helper: Create blocks ---
    @staticmethod
    def create_paragraph_block(text: str) -> Dict[str, Any]:
        return {
            "object": "block",
            "type": "paragraph",
            "paragraph": {
                "rich_text": [{"type": "text", "text": {"content": text}}]
            }
        }
    
    @staticmethod
    def create_heading_block(text: str, level: int = 1) -> Dict[str, Any]:
        heading_type = f"heading_{level}"
        return {
            "object": "block",
            "type": heading_type,
            heading_type: {
                "rich_text": [{"type": "text", "text": {"content": text}}]
            }
        }
    
    @staticmethod
    def create_todo_block(text: str, checked: bool = False) -> Dict[str, Any]:
        return {
            "object": "block",
            "type": "to_do",
            "to_do": {
                "rich_text": [{"type": "text", "text": {"content": text}}],
                "checked": checked
            }
        }


# ═══════════════════════════════════════════════════════════════════════════════
# AIRTABLE INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class AirtableClient(BaseAdminClient):
    """
    📊 Client Airtable
    
    Fonctionnalités:
    - Bases et tables
    - Records CRUD
    - Vues et filtres
    - Formules
    """
    
    BASE_URL = "https://api.airtable.com/v0"
    
    def __init__(self, access_token: str, base_id: str):
        super().__init__(access_token)
        self.base_id = base_id
    
    @property
    def base_url(self) -> str:
        return f"{self.BASE_URL}/{self.base_id}"
    
    # --- Records ---
    async def list_records(
        self,
        table_name: str,
        view: str = None,
        filter_formula: str = None,
        sort: List[Dict[str, str]] = None,
        max_records: int = 100
    ) -> List[AirtableRecord]:
        """Liste les enregistrements."""
        params = {"maxRecords": max_records}
        if view:
            params["view"] = view
        if filter_formula:
            params["filterByFormula"] = filter_formula
        if sort:
            for i, s in enumerate(sort):
                params[f"sort[{i}][field]"] = s["field"]
                params[f"sort[{i}][direction]"] = s.get("direction", "asc")
        
        async with self.session.get(
            f"{self.base_url}/{table_name}",
            params=params
        ) as resp:
            data = await resp.json()
            
            return [
                AirtableRecord(
                    id=r.get("id"),
                    fields=r.get("fields", {}),
                    created_at=datetime.fromisoformat(r["createdTime"].replace("Z", "+00:00")) if r.get("createdTime") else None
                )
                for r in data.get("records", [])
            ]
    
    async def get_record(self, table_name: str, record_id: str) -> AirtableRecord:
        """Récupère un enregistrement."""
        async with self.session.get(
            f"{self.base_url}/{table_name}/{record_id}"
        ) as resp:
            data = await resp.json()
            
            return AirtableRecord(
                id=data.get("id"),
                fields=data.get("fields", {}),
                created_at=datetime.fromisoformat(data["createdTime"].replace("Z", "+00:00")) if data.get("createdTime") else None
            )
    
    async def create_record(
        self,
        table_name: str,
        fields: Dict[str, Any]
    ) -> AirtableRecord:
        """Crée un enregistrement."""
        async with self.session.post(
            f"{self.base_url}/{table_name}",
            json={"fields": fields}
        ) as resp:
            data = await resp.json()
            
            return AirtableRecord(
                id=data.get("id"),
                fields=data.get("fields", {})
            )
    
    async def create_records(
        self,
        table_name: str,
        records: List[Dict[str, Any]]
    ) -> List[AirtableRecord]:
        """Crée plusieurs enregistrements."""
        payload = {
            "records": [{"fields": r} for r in records]
        }
        
        async with self.session.post(
            f"{self.base_url}/{table_name}",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return [
                AirtableRecord(id=r.get("id"), fields=r.get("fields", {}))
                for r in data.get("records", [])
            ]
    
    async def update_record(
        self,
        table_name: str,
        record_id: str,
        fields: Dict[str, Any]
    ) -> AirtableRecord:
        """Met à jour un enregistrement."""
        async with self.session.patch(
            f"{self.base_url}/{table_name}/{record_id}",
            json={"fields": fields}
        ) as resp:
            data = await resp.json()
            
            return AirtableRecord(
                id=data.get("id"),
                fields=data.get("fields", {})
            )
    
    async def delete_record(self, table_name: str, record_id: str) -> bool:
        """Supprime un enregistrement."""
        async with self.session.delete(
            f"{self.base_url}/{table_name}/{record_id}"
        ) as resp:
            data = await resp.json()
            return data.get("deleted", False)


# ═══════════════════════════════════════════════════════════════════════════════
# TRELLO INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class TrelloClient(BaseAdminClient):
    """
    📋 Client Trello
    
    Fonctionnalités:
    - Boards, listes et cartes
    - Labels et membres
    - Checklists
    - Attachments
    """
    
    BASE_URL = "https://api.trello.com/1"
    
    def __init__(self, api_key: str, token: str):
        super().__init__(token)
        self.api_key = api_key
        self.token = token
    
    def _get_params(self, extra: Dict = None) -> Dict[str, str]:
        params = {"key": self.api_key, "token": self.token}
        if extra:
            params.update(extra)
        return params
    
    def _get_headers(self) -> Dict[str, str]:
        return {"Accept": "application/json"}
    
    # --- Boards ---
    async def list_boards(self) -> List[Dict[str, Any]]:
        """Liste les boards."""
        async with self.session.get(
            f"{self.BASE_URL}/members/me/boards",
            params=self._get_params()
        ) as resp:
            return await resp.json()
    
    async def get_board(self, board_id: str) -> Dict[str, Any]:
        """Récupère un board."""
        async with self.session.get(
            f"{self.BASE_URL}/boards/{board_id}",
            params=self._get_params({"lists": "all", "cards": "all"})
        ) as resp:
            return await resp.json()
    
    # --- Lists ---
    async def get_lists(self, board_id: str) -> List[Dict[str, Any]]:
        """Récupère les listes d'un board."""
        async with self.session.get(
            f"{self.BASE_URL}/boards/{board_id}/lists",
            params=self._get_params()
        ) as resp:
            return await resp.json()
    
    async def create_list(self, board_id: str, name: str) -> Dict[str, Any]:
        """Crée une liste."""
        async with self.session.post(
            f"{self.BASE_URL}/lists",
            params=self._get_params({"name": name, "idBoard": board_id})
        ) as resp:
            return await resp.json()
    
    # --- Cards ---
    async def get_cards(self, list_id: str) -> List[AdminTask]:
        """Récupère les cartes d'une liste."""
        async with self.session.get(
            f"{self.BASE_URL}/lists/{list_id}/cards",
            params=self._get_params()
        ) as resp:
            data = await resp.json()
            
            return [
                AdminTask(
                    id=c.get("id"),
                    title=c.get("name", ""),
                    description=c.get("desc"),
                    due_date=datetime.fromisoformat(c["due"].replace("Z", "+00:00")).date() if c.get("due") else None,
                    board_id=c.get("idBoard"),
                    tags=[l.get("name") for l in c.get("labels", [])]
                )
                for c in data
            ]
    
    async def create_card(
        self,
        list_id: str,
        name: str,
        description: str = None,
        due_date: datetime = None,
        labels: List[str] = None
    ) -> AdminTask:
        """Crée une carte."""
        params = self._get_params({
            "idList": list_id,
            "name": name
        })
        
        if description:
            params["desc"] = description
        if due_date:
            params["due"] = due_date.isoformat()
        if labels:
            params["idLabels"] = ",".join(labels)
        
        async with self.session.post(
            f"{self.BASE_URL}/cards",
            params=params
        ) as resp:
            data = await resp.json()
            
            return AdminTask(
                id=data.get("id"),
                title=name,
                description=description,
                due_date=due_date.date() if due_date else None
            )
    
    async def update_card(
        self,
        card_id: str,
        updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Met à jour une carte."""
        async with self.session.put(
            f"{self.BASE_URL}/cards/{card_id}",
            params=self._get_params(updates)
        ) as resp:
            return await resp.json()
    
    async def move_card(self, card_id: str, list_id: str) -> Dict[str, Any]:
        """Déplace une carte vers une autre liste."""
        return await self.update_card(card_id, {"idList": list_id})
    
    async def add_checklist(
        self,
        card_id: str,
        name: str,
        items: List[str]
    ) -> Dict[str, Any]:
        """Ajoute une checklist à une carte."""
        # Create checklist
        async with self.session.post(
            f"{self.BASE_URL}/cards/{card_id}/checklists",
            params=self._get_params({"name": name})
        ) as resp:
            checklist = await resp.json()
        
        # Add items
        for item in items:
            await self.session.post(
                f"{self.BASE_URL}/checklists/{checklist['id']}/checkItems",
                params=self._get_params({"name": item})
            )
        
        return checklist


# ═══════════════════════════════════════════════════════════════════════════════
# TWILIO INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class TwilioClient(BaseAdminClient):
    """
    📱 Client Twilio
    
    Fonctionnalités:
    - SMS
    - Appels vocaux
    - WhatsApp
    - Vérification
    """
    
    BASE_URL = "https://api.twilio.com/2010-04-01"
    
    def __init__(self, account_sid: str, auth_token: str, from_number: str):
        super().__init__(auth_token)
        self.account_sid = account_sid
        self.auth_token = auth_token
        self.from_number = from_number
    
    def _get_headers(self) -> Dict[str, str]:
        import base64
        auth = base64.b64encode(f"{self.account_sid}:{self.auth_token}".encode()).decode()
        return {
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    
    @property
    def account_url(self) -> str:
        return f"{self.BASE_URL}/Accounts/{self.account_sid}"
    
    async def send_sms(
        self,
        to: str,
        body: str,
        from_number: str = None
    ) -> Dict[str, Any]:
        """Envoie un SMS."""
        payload = {
            "To": to,
            "From": from_number or self.from_number,
            "Body": body
        }
        
        async with self.session.post(
            f"{self.account_url}/Messages.json",
            data=payload
        ) as resp:
            return await resp.json()
    
    async def send_whatsapp(
        self,
        to: str,
        body: str
    ) -> Dict[str, Any]:
        """Envoie un message WhatsApp."""
        payload = {
            "To": f"whatsapp:{to}",
            "From": f"whatsapp:{self.from_number}",
            "Body": body
        }
        
        async with self.session.post(
            f"{self.account_url}/Messages.json",
            data=payload
        ) as resp:
            return await resp.json()
    
    async def make_call(
        self,
        to: str,
        twiml_url: str,
        from_number: str = None
    ) -> Dict[str, Any]:
        """Initie un appel."""
        payload = {
            "To": to,
            "From": from_number or self.from_number,
            "Url": twiml_url
        }
        
        async with self.session.post(
            f"{self.account_url}/Calls.json",
            data=payload
        ) as resp:
            return await resp.json()
    
    async def get_messages(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Récupère les messages récents."""
        async with self.session.get(
            f"{self.account_url}/Messages.json",
            params={"PageSize": limit}
        ) as resp:
            data = await resp.json()
            return data.get("messages", [])


# ═══════════════════════════════════════════════════════════════════════════════
# ADMIN SERVICE (Unified Interface)
# ═══════════════════════════════════════════════════════════════════════════════

class AdminService:
    """
    🏢 Service Administration Unifié
    """
    
    def __init__(self):
        self._clients: Dict[str, BaseAdminClient] = {}
    
    def register_docusign(self, account_id: str, access_token: str, ds_account_id: str, base_uri: str = None):
        self._clients[account_id] = DocuSignClient(access_token, ds_account_id, base_uri)
    
    def register_calendly(self, account_id: str, access_token: str):
        self._clients[account_id] = CalendlyClient(access_token)
    
    def register_notion(self, account_id: str, access_token: str):
        self._clients[account_id] = NotionClient(access_token)
    
    def register_airtable(self, account_id: str, access_token: str, base_id: str):
        self._clients[account_id] = AirtableClient(access_token, base_id)
    
    def register_trello(self, account_id: str, api_key: str, token: str):
        self._clients[account_id] = TrelloClient(api_key, token)
    
    def register_twilio(self, account_id: str, account_sid: str, auth_token: str, from_number: str):
        self._clients[account_id] = TwilioClient(account_sid, auth_token, from_number)
    
    def get_client(self, account_id: str) -> BaseAdminClient:
        if account_id not in self._clients:
            raise ValueError(f"Account {account_id} not registered")
        return self._clients[account_id]


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

def create_admin_service() -> AdminService:
    """Factory pour le service d'administration."""
    return AdminService()
