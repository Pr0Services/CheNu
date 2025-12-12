"""
CHE·NU Unified - Message Schemas
═══════════════════════════════════════════════════════════════════════════════
Schémas Pydantic pour les messages, conversations et communications inter-agents.

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from enum import Enum
import uuid


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class MessageRole(str, Enum):
    """Rôles dans une conversation."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    AGENT = "agent"
    TOOL = "tool"


class MessageType(str, Enum):
    """Types de messages."""
    TEXT = "text"
    IMAGE = "image"
    FILE = "file"
    AUDIO = "audio"
    VIDEO = "video"
    CODE = "code"
    CARD = "card"
    ACTION = "action"
    ERROR = "error"
    STATUS = "status"


class ConversationStatus(str, Enum):
    """Statuts de conversation."""
    ACTIVE = "active"
    WAITING = "waiting"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class NotificationType(str, Enum):
    """Types de notifications."""
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"
    ALERT = "alert"
    TASK_UPDATE = "task_update"
    MENTION = "mention"


# ═══════════════════════════════════════════════════════════════════════════════
# MESSAGE MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class MessageAttachment(BaseModel):
    """Pièce jointe d'un message."""
    id: str = Field(default_factory=lambda: f"attach_{uuid.uuid4().hex[:8]}")
    type: str  # image, file, audio, video
    name: str
    url: Optional[str] = None
    size_bytes: Optional[int] = None
    mime_type: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class MessageAction(BaseModel):
    """Action interactive dans un message."""
    id: str
    type: str  # button, link, form, select
    label: str
    value: Optional[str] = None
    url: Optional[str] = None
    style: str = "default"  # default, primary, danger
    disabled: bool = False


class MessageContent(BaseModel):
    """Contenu structuré d'un message."""
    text: Optional[str] = None
    html: Optional[str] = None
    markdown: Optional[str] = None
    
    # Rich content
    code: Optional[Dict[str, str]] = None  # {language, content}
    table: Optional[Dict[str, Any]] = None
    chart: Optional[Dict[str, Any]] = None
    
    # Attachments
    attachments: List[MessageAttachment] = Field(default_factory=list)
    
    # Interactive
    actions: List[MessageAction] = Field(default_factory=list)


class Message(BaseModel):
    """Message dans une conversation."""
    id: str = Field(default_factory=lambda: f"msg_{uuid.uuid4().hex[:12]}")
    conversation_id: str
    
    # Contenu
    role: MessageRole
    type: MessageType = MessageType.TEXT
    content: Union[str, MessageContent]
    
    # Metadata
    agent_id: Optional[str] = None
    agent_name: Optional[str] = None
    user_id: Optional[str] = None
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow)
    edited_at: Optional[datetime] = None
    
    # Status
    is_streaming: bool = False
    is_error: bool = False
    
    # Reactions/Feedback
    reactions: Dict[str, int] = Field(default_factory=dict)
    feedback: Optional[str] = None  # positive, negative, null
    
    # References
    reply_to: Optional[str] = None
    thread_id: Optional[str] = None
    
    # Metadata
    metadata: Dict[str, Any] = Field(default_factory=dict)


# ═══════════════════════════════════════════════════════════════════════════════
# CONVERSATION MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class Conversation(BaseModel):
    """Conversation entre user et agents."""
    id: str = Field(default_factory=lambda: f"conv_{uuid.uuid4().hex[:12]}")
    
    # Participants
    user_id: str
    agent_ids: List[str] = Field(default_factory=list)
    
    # Context
    project_id: Optional[str] = None
    company_id: Optional[str] = None
    workspace: str = "bureau"
    
    # Messages
    messages: List[Message] = Field(default_factory=list)
    message_count: int = 0
    
    # Status
    status: ConversationStatus = ConversationStatus.ACTIVE
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_message_at: Optional[datetime] = None
    
    # Metadata
    title: Optional[str] = None
    summary: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    # Settings
    settings: Dict[str, Any] = Field(default_factory=dict)


class ConversationSummary(BaseModel):
    """Résumé d'une conversation."""
    id: str
    title: Optional[str] = None
    status: ConversationStatus
    message_count: int
    last_message_at: Optional[datetime] = None
    last_message_preview: Optional[str] = None
    participants: List[str] = Field(default_factory=list)


# ═══════════════════════════════════════════════════════════════════════════════
# INTER-AGENT COMMUNICATION
# ═══════════════════════════════════════════════════════════════════════════════

class DelegationRequest(BaseModel):
    """Requête de délégation entre agents."""
    id: str = Field(default_factory=lambda: f"deleg_{uuid.uuid4().hex[:8]}")
    
    # Source
    from_agent_id: str
    from_agent_name: str
    from_level: str  # L0, L1, L2
    
    # Target
    to_agent_id: str
    to_department: Optional[str] = None
    
    # Task
    task_id: str
    task_description: str
    task_context: Dict[str, Any] = Field(default_factory=dict)
    
    # Options
    priority: str = "normal"
    deadline: Optional[datetime] = None
    requires_approval: bool = False
    
    # Status
    status: str = "pending"  # pending, accepted, rejected, completed
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AgentReport(BaseModel):
    """Rapport d'un agent à son supérieur."""
    id: str = Field(default_factory=lambda: f"report_{uuid.uuid4().hex[:8]}")
    
    # Source
    agent_id: str
    agent_name: str
    department: str
    
    # Target
    to_agent_id: str  # Usually L1 director or L0 MasterMind
    
    # Content
    report_type: str  # status, completion, error, escalation
    task_id: Optional[str] = None
    
    summary: str
    details: Dict[str, Any] = Field(default_factory=dict)
    
    # Results
    success: Optional[bool] = None
    output: Optional[Dict[str, Any]] = None
    errors: List[str] = Field(default_factory=list)
    
    # Métriques
    duration_ms: Optional[int] = None
    tokens_used: int = 0
    cost_usd: float = 0.0
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow)


class EscalationRequest(BaseModel):
    """Requête d'escalade vers un niveau supérieur."""
    id: str = Field(default_factory=lambda: f"esc_{uuid.uuid4().hex[:8]}")
    
    # Source
    from_agent_id: str
    from_level: str
    
    # Reason
    reason: str  # complexity, permission, error, timeout, unknown
    description: str
    
    # Context
    task_id: str
    original_request: Dict[str, Any] = Field(default_factory=dict)
    attempted_actions: List[str] = Field(default_factory=list)
    
    # Severity
    severity: str = "normal"  # low, normal, high, critical
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ═══════════════════════════════════════════════════════════════════════════════
# NOTIFICATIONS
# ═══════════════════════════════════════════════════════════════════════════════

class Notification(BaseModel):
    """Notification pour l'utilisateur."""
    id: str = Field(default_factory=lambda: f"notif_{uuid.uuid4().hex[:8]}")
    
    # Target
    user_id: str
    
    # Content
    type: NotificationType
    title: str
    message: str
    
    # Source
    source_type: str = "system"  # system, agent, task, integration
    source_id: Optional[str] = None
    
    # Actions
    action_url: Optional[str] = None
    action_label: Optional[str] = None
    
    # Status
    read: bool = False
    dismissed: bool = False
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    
    # Metadata
    metadata: Dict[str, Any] = Field(default_factory=dict)


# ═══════════════════════════════════════════════════════════════════════════════
# API REQUEST/RESPONSE MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class MessageInput(BaseModel):
    """Input pour envoyer un message."""
    content: str = Field(..., min_length=1, max_length=100000)
    user_id: str
    
    # Optional context
    conversation_id: Optional[str] = None
    project_id: Optional[str] = None
    company_id: Optional[str] = None
    
    # Options
    type: MessageType = MessageType.TEXT
    attachments: List[Dict[str, Any]] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    # Streaming
    stream: bool = False


class ChatRequest(BaseModel):
    """Requête de chat avec Nova."""
    message: str = Field(..., min_length=1, max_length=100000)
    user_id: str
    
    # Context
    conversation_id: Optional[str] = None
    workspace: str = "bureau"
    
    # Options
    stream: bool = False
    include_sources: bool = False
    max_tokens: int = 4096


class ChatResponse(BaseModel):
    """Réponse de chat."""
    message_id: str
    conversation_id: str
    
    # Content
    content: str
    type: MessageType = MessageType.TEXT
    
    # Agent info
    agent_id: str
    agent_name: str
    
    # Sources (if requested)
    sources: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Métriques
    tokens_used: int = 0
    duration_ms: int = 0
    
    # Actions suggérées
    suggested_actions: List[MessageAction] = Field(default_factory=list)


class ConversationListResponse(BaseModel):
    """Liste des conversations."""
    conversations: List[ConversationSummary]
    total: int
    page: int = 1
    page_size: int = 20


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    "MessageRole",
    "MessageType",
    "ConversationStatus",
    "NotificationType",
    
    # Message
    "MessageAttachment",
    "MessageAction",
    "MessageContent",
    "Message",
    
    # Conversation
    "Conversation",
    "ConversationSummary",
    
    # Inter-Agent
    "DelegationRequest",
    "AgentReport",
    "EscalationRequest",
    
    # Notifications
    "Notification",
    
    # API
    "MessageInput",
    "ChatRequest",
    "ChatResponse",
    "ConversationListResponse"
]
