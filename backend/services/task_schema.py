"""
CHE·NU Unified - Task Schemas
═══════════════════════════════════════════════════════════════════════════════
Schémas Pydantic pour les tâches et leur exécution.

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

class TaskType(str, Enum):
    """Types de tâches."""
    SIMPLE = "simple"
    COMPLEX = "complex"
    MULTI_STEP = "multi_step"
    PARALLEL = "parallel"
    SEQUENTIAL = "sequential"
    DELEGATED = "delegated"
    SCHEDULED = "scheduled"


class TaskPriority(str, Enum):
    """Priorités des tâches."""
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"
    CRITICAL = "critical"


class TaskStatus(str, Enum):
    """Statuts des tâches."""
    PENDING = "pending"
    QUEUED = "queued"
    ROUTING = "routing"
    DECOMPOSING = "decomposing"
    PLANNING = "planning"
    EXECUTING = "executing"
    ASSEMBLING = "assembling"
    VALIDATING = "validating"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    TIMEOUT = "timeout"


class Department(str, Enum):
    """Départements disponibles."""
    CONSTRUCTION = "construction"
    FINANCE = "finance"
    HR = "hr"
    MARKETING = "marketing"
    CREATIVE = "creative"
    SALES = "sales"
    OPERATIONS = "operations"
    ADMIN = "admin"
    TECHNOLOGY = "technology"
    COMMUNICATION = "communication"
    LEGAL = "legal"
    SUPPORT = "support"


class AgentLevel(str, Enum):
    """Niveaux hiérarchiques des agents."""
    L_MINUS_1 = "L-1"  # Nova
    L0 = "L0"          # MasterMind
    L1 = "L1"          # Directors
    L2 = "L2"          # Specialists
    L3 = "L3"          # Tools/Actions


# ═══════════════════════════════════════════════════════════════════════════════
# CONTEXT MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class TaskContext(BaseModel):
    """Contexte d'exécution d'une tâche."""
    user_id: str
    project_id: Optional[str] = None
    company_id: Optional[str] = None
    workspace: str = "bureau"
    locale: str = "fr-CA"
    timezone: str = "America/Toronto"
    preferences: Dict[str, Any] = Field(default_factory=dict)
    
    # Historique
    conversation_id: Optional[str] = None
    parent_task_id: Optional[str] = None
    
    # Metadata
    source: str = "api"  # api, chat, webhook, scheduled
    client_info: Dict[str, Any] = Field(default_factory=dict)


class TaskInput(BaseModel):
    """Entrée d'une tâche."""
    description: str = Field(..., min_length=1, max_length=50000)
    title: Optional[str] = Field(None, max_length=200)
    type: TaskType = TaskType.SIMPLE
    priority: TaskPriority = TaskPriority.NORMAL
    
    # Contexte
    context: TaskContext
    
    # Options
    options: Dict[str, Any] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    # Contraintes
    deadline: Optional[datetime] = None
    max_cost_usd: Optional[float] = None
    max_duration_seconds: Optional[int] = None
    
    # Attachments
    attachments: List[Dict[str, Any]] = Field(default_factory=list)


# ═══════════════════════════════════════════════════════════════════════════════
# TASK MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class Task(BaseModel):
    """Tâche principale."""
    id: str = Field(default_factory=lambda: f"task_{uuid.uuid4().hex[:12]}")
    trace_id: str = Field(default_factory=lambda: f"trace_{uuid.uuid4().hex[:8]}")
    
    input: TaskInput
    
    # Status
    status: TaskStatus = TaskStatus.PENDING
    department: Optional[Department] = None
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    # Routing
    assigned_agent: Optional[str] = None
    routing_confidence: float = 0.0
    
    class Config:
        use_enum_values = True


class SubTask(BaseModel):
    """Sous-tâche décomposée."""
    id: str = Field(default_factory=lambda: f"subtask_{uuid.uuid4().hex[:8]}")
    parent_task_id: str
    
    description: str
    department: Optional[Department] = None
    agent_id: Optional[str] = None
    
    # Ordre d'exécution
    order: int = 0
    depends_on: List[str] = Field(default_factory=list)
    
    # Status
    status: TaskStatus = TaskStatus.PENDING
    
    # Résultat
    output: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    
    # Métriques
    duration_ms: Optional[int] = None
    tokens_used: int = 0
    cost_usd: float = 0.0


# ═══════════════════════════════════════════════════════════════════════════════
# RESULT MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class TaskMetrics(BaseModel):
    """Métriques d'exécution."""
    total_duration_ms: int = 0
    routing_ms: int = 0
    decomposition_ms: int = 0
    execution_ms: int = 0
    assembly_ms: int = 0
    
    total_llm_calls: int = 0
    total_tokens_input: int = 0
    total_tokens_output: int = 0
    total_cost_usd: float = 0.0
    
    agents_used: List[str] = Field(default_factory=list)
    departments_involved: List[str] = Field(default_factory=list)
    
    cache_hits: int = 0
    retries: int = 0


class SubTaskResult(BaseModel):
    """Résultat d'une sous-tâche."""
    subtask_id: str
    success: bool
    output: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None
    
    agent_id: str
    department: Optional[str] = None
    
    duration_ms: int = 0
    tokens_used: int = 0
    cost_usd: float = 0.0


class TaskResult(BaseModel):
    """Résultat final d'une tâche."""
    task_id: str
    trace_id: str
    success: bool
    
    # Output
    output: Dict[str, Any] = Field(default_factory=dict)
    summary: Optional[str] = None
    format: str = "text"  # text, json, markdown, html
    
    # Routing info
    department: Optional[Department] = None
    agents_used: List[str] = Field(default_factory=list)
    
    # Subtasks
    subtask_results: List[SubTaskResult] = Field(default_factory=list)
    
    # Métriques
    metrics: Optional[TaskMetrics] = None
    
    # Errors/Warnings
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: datetime = Field(default_factory=datetime.utcnow)


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTING MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class RoutingDecision(BaseModel):
    """Décision de routage."""
    department: Department
    agent_id: str
    agent_name: str
    confidence: float = Field(ge=0.0, le=1.0)
    
    # Multi-département
    is_multi_department: bool = False
    secondary_departments: List[Department] = Field(default_factory=list)
    
    # Spécialiste
    specialist_id: Optional[str] = None
    specialist_name: Optional[str] = None
    
    # Metadata
    matched_keywords: List[str] = Field(default_factory=list)
    reasoning: str = ""
    method: str = "keywords"  # keywords, llm, forced


class DecompositionPlan(BaseModel):
    """Plan de décomposition."""
    task_id: str
    complexity_score: float = Field(ge=0.0, le=1.0)
    complexity_level: str = "simple"  # simple, moderate, complex
    
    subtasks: List[SubTask] = Field(default_factory=list)
    
    # Execution order
    parallel_groups: List[List[str]] = Field(default_factory=list)
    sequential_order: List[str] = Field(default_factory=list)
    
    # Estimations
    estimated_duration_seconds: int = 0
    estimated_cost_usd: float = 0.0


class ExecutionPlan(BaseModel):
    """Plan d'exécution."""
    task_id: str
    trace_id: str
    
    steps: List[Dict[str, Any]] = Field(default_factory=list)
    total_steps: int = 0
    
    # Options
    parallel_execution: bool = True
    max_parallel: int = 5
    timeout_seconds: int = 300
    
    # Status
    current_step: int = 0
    completed_steps: int = 0


# ═══════════════════════════════════════════════════════════════════════════════
# API REQUEST/RESPONSE MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class CreateTaskRequest(BaseModel):
    """Requête de création de tâche via API."""
    description: str = Field(..., min_length=1, max_length=50000)
    title: Optional[str] = None
    type: TaskType = TaskType.SIMPLE
    priority: TaskPriority = TaskPriority.NORMAL
    
    # IDs
    user_id: str
    project_id: Optional[str] = None
    company_id: Optional[str] = None
    
    # Options
    options: Dict[str, Any] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    # Contraintes
    max_cost_usd: Optional[float] = None
    timeout_seconds: int = 300


class TaskResponse(BaseModel):
    """Réponse standard pour une tâche."""
    task_id: str
    trace_id: str
    status: TaskStatus
    
    # Résultat (si complété)
    result: Optional[TaskResult] = None
    
    # Infos
    department: Optional[str] = None
    agents_used: List[str] = Field(default_factory=list)
    
    # Timing
    created_at: datetime
    completed_at: Optional[datetime] = None
    duration_ms: Optional[int] = None


class TaskListResponse(BaseModel):
    """Liste de tâches."""
    tasks: List[TaskResponse]
    total: int
    page: int = 1
    page_size: int = 20


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    "TaskType",
    "TaskPriority",
    "TaskStatus",
    "Department",
    "AgentLevel",
    
    # Context
    "TaskContext",
    "TaskInput",
    
    # Tasks
    "Task",
    "SubTask",
    
    # Results
    "TaskMetrics",
    "SubTaskResult",
    "TaskResult",
    
    # Routing
    "RoutingDecision",
    "DecompositionPlan",
    "ExecutionPlan",
    
    # API
    "CreateTaskRequest",
    "TaskResponse",
    "TaskListResponse"
]
