"""
CHE·NU™ — B15-1: CLIENT PORTAL
- Magic link auth
- Project dashboard
- Progress photos gallery
- Document approval
- Change orders
- Messaging
- Satisfaction surveys
"""

from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass
import uuid
import secrets

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/api/v1/portal", tags=["Client Portal"])

class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class ChangeOrderStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    IN_PROGRESS = "in_progress"

class MessageType(str, Enum):
    GENERAL = "general"
    QUESTION = "question"
    URGENT = "urgent"

@dataclass
class ClientAccess:
    id: str
    email: str
    project_ids: List[str]
    permissions: List[str]
    last_login: Optional[datetime]

@dataclass
class MagicLink:
    token: str
    client_id: str
    expires_at: datetime
    used: bool

@dataclass
class SharedDocument:
    id: str
    project_id: str
    name: str
    url: str
    requires_approval: bool
    status: ApprovalStatus

@dataclass
class ChangeOrder:
    id: str
    project_id: str
    number: str
    title: str
    description: str
    amount: float
    status: ChangeOrderStatus
    created_at: datetime

@dataclass
class PortalMessage:
    id: str
    project_id: str
    subject: str
    content: str
    sender_type: str
    sender_name: str
    read: bool
    created_at: datetime

class ClientAuthManager:
    _clients: Dict[str, ClientAccess] = {
        "client_1": ClientAccess("client_1", "jean@example.com", ["proj_1"], ["view", "approve", "message"], None)
    }
    _magic_links: Dict[str, MagicLink] = {}
    _sessions: Dict[str, Dict] = {}
    
    @classmethod
    async def request_magic_link(cls, email: str) -> str:
        client = next((c for c in cls._clients.values() if c.email == email), None)
        if not client:
            return "sent"
        token = secrets.token_urlsafe(32)
        cls._magic_links[token] = MagicLink(token, client.id, datetime.utcnow() + timedelta(hours=24), False)
        return token
    
    @classmethod
    async def verify(cls, token: str) -> Dict:
        link = cls._magic_links.get(token)
        if not link or link.used or link.expires_at < datetime.utcnow():
            raise HTTPException(401, "Invalid link")
        link.used = True
        session = secrets.token_urlsafe(32)
        cls._sessions[session] = {"client_id": link.client_id}
        return {"session": session, "client_id": link.client_id}

class ClientProjectView:
    @classmethod
    async def get_dashboard(cls, project_id: str) -> Dict:
        return {
            "project": {"id": project_id, "name": "Maison Dupont", "progress": 65, "status": "En cours"},
            "milestones": [
                {"name": "Fondation", "status": "completed"},
                {"name": "Charpente", "status": "completed"},
                {"name": "Finition", "status": "in_progress"},
            ],
            "financials": {"contract": 450000, "invoiced": 302250, "paid": 280000},
            "team": {"pm": "Marie Lavoie", "phone": "450-555-1234"},
            "pending_approvals": 2,
            "unread_messages": 3,
        }

class ProgressPhotoManager:
    _photos = [
        {"id": f"p{i}", "project_id": "proj_1", "url": f"/photos/{i}.jpg", "caption": c, "phase": p}
        for i, (p, c) in enumerate([
            ("Fondation", "Coffrage complété"), ("Charpente", "Structure montée"),
            ("Toiture", "Bardeaux posés"), ("Finition", "Gypse installé")
        ])
    ]
    
    @classmethod
    async def get_photos(cls, project_id: str, phase: Optional[str] = None) -> List[Dict]:
        photos = [p for p in cls._photos if p["project_id"] == project_id]
        if phase:
            photos = [p for p in photos if p["phase"] == phase]
        return photos

class DocumentManager:
    _docs: Dict[str, SharedDocument] = {
        "d1": SharedDocument("d1", "proj_1", "Contrat", "/docs/contrat.pdf", True, ApprovalStatus.APPROVED),
        "d2": SharedDocument("d2", "proj_1", "Plans v2", "/docs/plans.pdf", True, ApprovalStatus.PENDING),
        "d3": SharedDocument("d3", "proj_1", "Devis électrique", "/docs/devis.pdf", True, ApprovalStatus.PENDING),
    }
    
    @classmethod
    async def get_docs(cls, project_id: str, pending: bool = False) -> List[Dict]:
        docs = [d for d in cls._docs.values() if d.project_id == project_id]
        if pending:
            docs = [d for d in docs if d.status == ApprovalStatus.PENDING]
        return [{"id": d.id, "name": d.name, "status": d.status.value} for d in docs]
    
    @classmethod
    async def approve(cls, doc_id: str, approved: bool) -> Dict:
        doc = cls._docs.get(doc_id)
        if not doc:
            raise HTTPException(404, "Not found")
        doc.status = ApprovalStatus.APPROVED if approved else ApprovalStatus.REJECTED
        return {"id": doc.id, "status": doc.status.value}

class ChangeOrderManager:
    _orders: Dict[str, ChangeOrder] = {}
    _counter = 0
    
    @classmethod
    async def create(cls, project_id: str, title: str, desc: str, amount: float) -> ChangeOrder:
        cls._counter += 1
        order = ChangeOrder(
            f"co_{uuid.uuid4().hex[:8]}", project_id, f"CO-{cls._counter:03d}",
            title, desc, amount, ChangeOrderStatus.SUBMITTED, datetime.utcnow()
        )
        cls._orders[order.id] = order
        return order
    
    @classmethod
    async def get_orders(cls, project_id: str) -> List[Dict]:
        return [{"id": o.id, "number": o.number, "title": o.title, "amount": o.amount, "status": o.status.value}
                for o in cls._orders.values() if o.project_id == project_id]

class MessagingManager:
    _messages: List[PortalMessage] = []
    
    @classmethod
    async def send(cls, project_id: str, subject: str, content: str, sender: str) -> PortalMessage:
        msg = PortalMessage(f"msg_{uuid.uuid4().hex[:8]}", project_id, subject, content, "client", sender, False, datetime.utcnow())
        cls._messages.append(msg)
        return msg
    
    @classmethod
    async def get_messages(cls, project_id: str) -> List[Dict]:
        return [{"id": m.id, "subject": m.subject, "sender": m.sender_name, "read": m.read}
                for m in cls._messages if m.project_id == project_id]

class SurveyManager:
    _surveys = []
    
    @classmethod
    async def submit(cls, project_id: str, rating: int, comments: str) -> Dict:
        survey = {"id": f"s_{uuid.uuid4().hex[:8]}", "project_id": project_id, "rating": rating, "comments": comments}
        cls._surveys.append(survey)
        return survey

# API Endpoints
@router.post("/auth/magic-link")
async def request_link(email: str):
    await ClientAuthManager.request_magic_link(email)
    return {"message": "Lien envoyé si le courriel existe"}

@router.post("/auth/verify")
async def verify_link(token: str):
    return await ClientAuthManager.verify(token)

@router.get("/dashboard/{project_id}")
async def dashboard(project_id: str):
    return await ClientProjectView.get_dashboard(project_id)

@router.get("/photos/{project_id}")
async def photos(project_id: str, phase: Optional[str] = None):
    return await ProgressPhotoManager.get_photos(project_id, phase)

@router.get("/documents/{project_id}")
async def documents(project_id: str, pending: bool = False):
    return await DocumentManager.get_docs(project_id, pending)

@router.post("/documents/{doc_id}/approve")
async def approve_doc(doc_id: str, approved: bool = True):
    return await DocumentManager.approve(doc_id, approved)

@router.get("/change-orders/{project_id}")
async def change_orders(project_id: str):
    return await ChangeOrderManager.get_orders(project_id)

@router.post("/change-orders")
async def create_co(project_id: str, title: str, description: str, amount: float):
    order = await ChangeOrderManager.create(project_id, title, description, amount)
    return {"id": order.id, "number": order.number}

@router.get("/messages/{project_id}")
async def messages(project_id: str):
    return await MessagingManager.get_messages(project_id)

@router.post("/messages")
async def send_msg(project_id: str, subject: str, content: str):
    msg = await MessagingManager.send(project_id, subject, content, "Client")
    return {"id": msg.id}

@router.post("/surveys")
async def submit_survey(project_id: str, rating: int, comments: str = ""):
    return await SurveyManager.submit(project_id, rating, comments)
