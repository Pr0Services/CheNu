"""
═══════════════════════════════════════════════════════════════════════════════
CHE·NU™ — BATCH 7: API PROJECTS TEMPLATES
═══════════════════════════════════════════════════════════════════════════════

Features:
- PT-01: CRUD complet projets
- PT-02: Templates projets intelligents
- PT-03: Phases et jalons
- PT-04: Budget tracking
- PT-05: Logs d'activité
- PT-06: Analytics projets
- PT-07: Documents attachés
- PT-08: Équipe projet
- PT-09: Tâches projet
- PT-10: Export CSV/PDF

═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
from enum import Enum
import uuid
import json
import logging

from fastapi import APIRouter, HTTPException, Depends, Query, Path, Body, BackgroundTasks
from pydantic import BaseModel, Field

logger = logging.getLogger("CHENU.Projects")

router = APIRouter(prefix="/api/v1/projects", tags=["Projects"])

# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS & CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

class ProjectStatus(str, Enum):
    DRAFT = "draft"
    PLANNING = "planning"
    IN_PROGRESS = "in_progress"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class ProjectType(str, Enum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    INDUSTRIAL = "industrial"
    RENOVATION = "renovation"
    NEW_CONSTRUCTION = "new_construction"
    MAINTENANCE = "maintenance"

class PhaseStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    BLOCKED = "blocked"

# ═══════════════════════════════════════════════════════════════════════════════
# PYDANTIC MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class ProjectPhase(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    order: int
    status: PhaseStatus = PhaseStatus.NOT_STARTED
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    progress: float = 0.0
    budget: Optional[float] = None
    actual_cost: float = 0.0
    tasks_count: int = 0
    tasks_completed: int = 0

class ProjectMilestone(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    due_date: datetime
    completed: bool = False
    completed_at: Optional[datetime] = None
    phase_id: Optional[str] = None

class ProjectBudget(BaseModel):
    total: float = 0.0
    spent: float = 0.0
    remaining: float = 0.0
    categories: Dict[str, float] = Field(default_factory=dict)
    expenses: List[Dict[str, Any]] = Field(default_factory=list)
    contingency: float = 0.0
    contingency_used: float = 0.0

class ProjectTeamMember(BaseModel):
    id: str
    name: str
    role: str
    email: Optional[str] = None
    phone: Optional[str] = None
    hours_allocated: float = 0.0
    hourly_rate: Optional[float] = None

class ProjectDocument(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # contract, permit, plan, photo, invoice, other
    url: str
    size: int = 0
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    uploaded_by: str

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    type: ProjectType = ProjectType.RESIDENTIAL
    client_id: Optional[str] = None
    client_name: Optional[str] = None
    address: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: float = 0.0
    template_id: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    type: Optional[ProjectType] = None
    client_name: Optional[str] = None
    address: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = None

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    type: ProjectType = ProjectType.RESIDENTIAL
    status: ProjectStatus = ProjectStatus.DRAFT
    client_id: Optional[str] = None
    client_name: Optional[str] = None
    address: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    progress: float = 0.0
    budget: ProjectBudget = Field(default_factory=ProjectBudget)
    phases: List[ProjectPhase] = Field(default_factory=list)
    milestones: List[ProjectMilestone] = Field(default_factory=list)
    team: List[ProjectTeamMember] = Field(default_factory=list)
    documents: List[ProjectDocument] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ActivityLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    action: str
    description: str
    user_id: str
    user_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)

# ═══════════════════════════════════════════════════════════════════════════════
# PROJECT TEMPLATES
# ═══════════════════════════════════════════════════════════════════════════════

class ProjectTemplate(BaseModel):
    id: str
    name: str
    description: str
    type: ProjectType
    default_phases: List[Dict[str, Any]]
    default_milestones: List[Dict[str, Any]]
    budget_categories: List[str]
    estimated_duration_days: int
    checklist: List[str]
    tags: List[str]

PROJECT_TEMPLATES: Dict[str, ProjectTemplate] = {
    "residential_renovation": ProjectTemplate(
        id="residential_renovation",
        name="Rénovation Résidentielle",
        description="Template pour projets de rénovation de maisons et condos",
        type=ProjectType.RENOVATION,
        default_phases=[
            {"name": "Planification", "order": 1, "description": "Conception et permis"},
            {"name": "Démolition", "order": 2, "description": "Démolition et préparation"},
            {"name": "Structure", "order": 3, "description": "Travaux structuraux"},
            {"name": "Mécanique", "order": 4, "description": "Plomberie, électricité, ventilation"},
            {"name": "Finition", "order": 5, "description": "Gypse, peinture, planchers"},
            {"name": "Livraison", "order": 6, "description": "Inspection finale et remise des clés"},
        ],
        default_milestones=[
            {"name": "Permis obtenu", "offset_days": 14},
            {"name": "Démolition complétée", "offset_days": 21},
            {"name": "Inspection plomberie", "offset_days": 35},
            {"name": "Inspection électrique", "offset_days": 42},
            {"name": "Livraison finale", "offset_days": 60},
        ],
        budget_categories=["Main d'œuvre", "Matériaux", "Sous-traitants", "Permis", "Contingence"],
        estimated_duration_days=60,
        checklist=[
            "Contrat signé",
            "Dépôt reçu",
            "Permis demandé",
            "Plans approuvés",
            "Assurances vérifiées",
            "Équipe assignée",
        ],
        tags=["résidentiel", "rénovation"],
    ),
    "new_construction": ProjectTemplate(
        id="new_construction",
        name="Construction Neuve",
        description="Template pour nouvelles constructions résidentielles",
        type=ProjectType.NEW_CONSTRUCTION,
        default_phases=[
            {"name": "Pré-construction", "order": 1, "description": "Plans, permis, financement"},
            {"name": "Fondations", "order": 2, "description": "Excavation et fondations"},
            {"name": "Charpente", "order": 3, "description": "Structure et toiture"},
            {"name": "Enveloppe", "order": 4, "description": "Fenêtres, portes, revêtement"},
            {"name": "Mécanique", "order": 5, "description": "Systèmes mécaniques"},
            {"name": "Isolation", "order": 6, "description": "Isolation et pare-vapeur"},
            {"name": "Finition intérieure", "order": 7, "description": "Gypse, peinture, planchers"},
            {"name": "Aménagement extérieur", "order": 8, "description": "Terrassement et entrée"},
            {"name": "Livraison", "order": 9, "description": "Inspections et remise des clés"},
        ],
        default_milestones=[
            {"name": "Permis construction", "offset_days": 30},
            {"name": "Fondations complétées", "offset_days": 60},
            {"name": "Hors d'eau", "offset_days": 90},
            {"name": "Inspection pré-gypse", "offset_days": 120},
            {"name": "Certificat d'occupation", "offset_days": 180},
        ],
        budget_categories=[
            "Terrain", "Fondations", "Charpente", "Toiture", 
            "Plomberie", "Électricité", "CVAC", "Isolation",
            "Finitions", "Aménagement", "Permis", "Contingence"
        ],
        estimated_duration_days=180,
        checklist=[
            "Terrain acquis",
            "Financement approuvé",
            "Plans architecturaux",
            "Plans d'ingénierie",
            "Permis de construction",
            "Assurance chantier",
            "Contrat entrepreneur",
        ],
        tags=["construction neuve", "résidentiel"],
    ),
    "commercial_fitout": ProjectTemplate(
        id="commercial_fitout",
        name="Aménagement Commercial",
        description="Template pour aménagement de locaux commerciaux",
        type=ProjectType.COMMERCIAL,
        default_phases=[
            {"name": "Design", "order": 1, "description": "Conception et plans"},
            {"name": "Permis", "order": 2, "description": "Permis municipaux"},
            {"name": "Démolition", "order": 3, "description": "Préparation du local"},
            {"name": "Construction", "order": 4, "description": "Travaux principaux"},
            {"name": "Finitions", "order": 5, "description": "Finitions et mobilier"},
            {"name": "Ouverture", "order": 6, "description": "Inspection et ouverture"},
        ],
        default_milestones=[
            {"name": "Design approuvé", "offset_days": 14},
            {"name": "Permis obtenu", "offset_days": 28},
            {"name": "Construction terminée", "offset_days": 56},
            {"name": "Inspection finale", "offset_days": 63},
        ],
        budget_categories=["Design", "Permis", "Construction", "Mobilier", "Signalisation", "Contingence"],
        estimated_duration_days=70,
        checklist=[
            "Bail signé",
            "Budget approuvé",
            "Designer engagé",
            "Entrepreneur sélectionné",
        ],
        tags=["commercial", "aménagement"],
    ),
}

# ═══════════════════════════════════════════════════════════════════════════════
# IN-MEMORY STORAGE (Replace with DB in production)
# ═══════════════════════════════════════════════════════════════════════════════

projects_db: Dict[str, Project] = {}
activity_logs_db: List[ActivityLog] = []

# ═══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def log_activity(project_id: str, action: str, description: str, user_id: str = "system", user_name: str = "Système", metadata: Dict = None):
    """Log project activity."""
    log = ActivityLog(
        project_id=project_id,
        action=action,
        description=description,
        user_id=user_id,
        user_name=user_name,
        metadata=metadata or {}
    )
    activity_logs_db.append(log)
    return log

def calculate_project_progress(project: Project) -> float:
    """Calculate overall project progress from phases."""
    if not project.phases:
        return 0.0
    total_weight = len(project.phases)
    completed_weight = sum(
        1.0 if p.status == PhaseStatus.COMPLETED else p.progress / 100
        for p in project.phases
    )
    return round((completed_weight / total_weight) * 100, 1)

def apply_template(project: Project, template: ProjectTemplate, start_date: datetime = None) -> Project:
    """Apply template to project."""
    start = start_date or datetime.utcnow()
    
    # Create phases
    project.phases = [
        ProjectPhase(
            name=p["name"],
            description=p.get("description"),
            order=p["order"],
        )
        for p in template.default_phases
    ]
    
    # Create milestones
    project.milestones = [
        ProjectMilestone(
            name=m["name"],
            due_date=start + timedelta(days=m["offset_days"]),
        )
        for m in template.default_milestones
    ]
    
    # Set budget categories
    project.budget.categories = {cat: 0.0 for cat in template.budget_categories}
    
    # Set tags
    project.tags = template.tags.copy()
    
    # Set estimated end date
    if not project.end_date:
        project.end_date = start + timedelta(days=template.estimated_duration_days)
    
    project.metadata["template_id"] = template.id
    project.metadata["checklist"] = [{"item": c, "completed": False} for c in template.checklist]
    
    return project

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS - CRUD
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/templates")
async def list_templates():
    """List all available project templates."""
    return {
        "templates": [
            {
                "id": t.id,
                "name": t.name,
                "description": t.description,
                "type": t.type,
                "phases_count": len(t.default_phases),
                "estimated_duration_days": t.estimated_duration_days,
                "tags": t.tags,
            }
            for t in PROJECT_TEMPLATES.values()
        ]
    }

@router.get("/templates/{template_id}")
async def get_template(template_id: str):
    """Get template details."""
    if template_id not in PROJECT_TEMPLATES:
        raise HTTPException(status_code=404, detail="Template not found")
    return PROJECT_TEMPLATES[template_id]

@router.post("", response_model=Project)
async def create_project(data: ProjectCreate, background_tasks: BackgroundTasks):
    """Create a new project, optionally from template."""
    project = Project(
        name=data.name,
        description=data.description,
        type=data.type,
        client_id=data.client_id,
        client_name=data.client_name,
        address=data.address,
        start_date=data.start_date or datetime.utcnow(),
        end_date=data.end_date,
        budget=ProjectBudget(total=data.budget),
    )
    
    # Apply template if specified
    if data.template_id and data.template_id in PROJECT_TEMPLATES:
        project = apply_template(project, PROJECT_TEMPLATES[data.template_id], data.start_date)
    
    projects_db[project.id] = project
    
    # Log activity
    background_tasks.add_task(
        log_activity, project.id, "create", f"Projet '{project.name}' créé"
    )
    
    logger.info(f"Project created: {project.id}")
    return project

@router.get("")
async def list_projects(
    status: Optional[ProjectStatus] = None,
    type: Optional[ProjectType] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    """List projects with filtering and pagination."""
    projects = list(projects_db.values())
    
    # Filters
    if status:
        projects = [p for p in projects if p.status == status]
    if type:
        projects = [p for p in projects if p.type == type]
    if search:
        search_lower = search.lower()
        projects = [p for p in projects if 
                   search_lower in p.name.lower() or 
                   (p.client_name and search_lower in p.client_name.lower())]
    
    # Sort by updated_at desc
    projects.sort(key=lambda x: x.updated_at, reverse=True)
    
    # Pagination
    total = len(projects)
    start = (page - 1) * limit
    end = start + limit
    
    return {
        "projects": projects[start:end],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str = Path(...)):
    """Get project by ID."""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    return projects_db[project_id]

@router.patch("/{project_id}", response_model=Project)
async def update_project(
    project_id: str = Path(...),
    data: ProjectUpdate = Body(...),
    background_tasks: BackgroundTasks = None,
):
    """Update project."""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    update_data = data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        if field == "budget" and value is not None:
            project.budget.total = value
        else:
            setattr(project, field, value)
    
    project.updated_at = datetime.utcnow()
    projects_db[project_id] = project
    
    if background_tasks:
        background_tasks.add_task(
            log_activity, project_id, "update", f"Projet mis à jour: {list(update_data.keys())}"
        )
    
    return project

@router.delete("/{project_id}")
async def delete_project(project_id: str = Path(...)):
    """Delete project."""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    del projects_db[project_id]
    return {"message": "Project deleted", "id": project_id}

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS - PHASES
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/{project_id}/phases")
async def add_phase(
    project_id: str,
    phase: ProjectPhase,
    background_tasks: BackgroundTasks,
):
    """Add phase to project."""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    project.phases.append(phase)
    project.phases.sort(key=lambda x: x.order)
    project.updated_at = datetime.utcnow()
    
    background_tasks.add_task(
        log_activity, project_id, "phase_add", f"Phase '{phase.name}' ajoutée"
    )
    
    return phase

@router.patch("/{project_id}/phases/{phase_id}")
async def update_phase(
    project_id: str,
    phase_id: str,
    updates: Dict[str, Any] = Body(...),
    background_tasks: BackgroundTasks = None,
):
    """Update phase."""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    phase = next((p for p in project.phases if p.id == phase_id), None)
    
    if not phase:
        raise HTTPException(status_code=404, detail="Phase not found")
    
    for field, value in updates.items():
        if hasattr(phase, field):
            setattr(phase, field, value)
    
    # Recalculate project progress
    project.progress = calculate_project_progress(project)
    project.updated_at = datetime.utcnow()
    
    if background_tasks:
        background_tasks.add_task(
            log_activity, project_id, "phase_update", f"Phase '{phase.name}' mise à jour"
        )
    
    return phase

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS - MILESTONES
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/{project_id}/milestones")
async def add_milestone(
    project_id: str,
    milestone: ProjectMilestone,
):
    """Add milestone to project."""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    project.milestones.append(milestone)
    project.milestones.sort(key=lambda x: x.due_date)
    project.updated_at = datetime.utcnow()
    
    return milestone

@router.patch("/{project_id}/milestones/{milestone_id}/complete")
async def complete_milestone(
    project_id: str,
    milestone_id: str,
    background_tasks: BackgroundTasks,
):
    """Mark milestone as complete."""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    milestone = next((m for m in project.milestones if m.id == milestone_id), None)
    
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    milestone.completed = True
    milestone.completed_at = datetime.utcnow()
    project.updated_at = datetime.utcnow()
    
    background_tasks.add_task(
        log_activity, project_id, "milestone_complete", f"Jalon '{milestone.name}' complété"
    )
    
    return milestone

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS - BUDGET
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/{project_id}/budget/expense")
async def add_expense(
    project_id: str,
    expense: Dict[str, Any] = Body(...),
    background_tasks: BackgroundTasks = None,
):
    """Add expense to project budget."""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    
    expense_record = {
        "id": str(uuid.uuid4()),
        "description": expense.get("description", ""),
        "amount": expense.get("amount", 0),
        "category": expense.get("category", "Autre"),
        "date": expense.get("date", datetime.utcnow().isoformat()),
        "vendor": expense.get("vendor"),
        "invoice_number": expense.get("invoice_number"),
    }
    
    project.budget.expenses.append(expense_record)
    project.budget.spent += expense_record["amount"]
    project.budget.remaining = project.budget.total - project.budget.spent
    
    # Update category spending
    category = expense_record["category"]
    if category in project.budget.categories:
        project.budget.categories[category] += expense_record["amount"]
    
    project.updated_at = datetime.utcnow()
    
    if background_tasks:
        background_tasks.add_task(
            log_activity, project_id, "expense_add", 
            f"Dépense ajoutée: {expense_record['amount']}$ - {expense_record['description']}"
        )
    
    return {"expense": expense_record, "budget": project.budget}

@router.get("/{project_id}/budget")
async def get_budget(project_id: str):
    """Get project budget details."""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    
    return {
        "budget": project.budget,
        "health": "good" if project.budget.spent <= project.budget.total * 0.9 else 
                 "warning" if project.budget.spent <= project.budget.total else "critical",
        "percent_used": round((project.budget.spent / project.budget.total * 100) if project.budget.total > 0 else 0, 1),
    }

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS - TEAM
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/{project_id}/team")
async def add_team_member(
    project_id: str,
    member: ProjectTeamMember,
):
    """Add team member to project."""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    project.team.append(member)
    project.updated_at = datetime.utcnow()
    
    return member

@router.delete("/{project_id}/team/{member_id}")
async def remove_team_member(project_id: str, member_id: str):
    """Remove team member from project."""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    project.team = [m for m in project.team if m.id != member_id]
    project.updated_at = datetime.utcnow()
    
    return {"message": "Team member removed"}

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS - ACTIVITY LOGS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/{project_id}/activity")
async def get_activity_logs(
    project_id: str,
    limit: int = Query(50, ge=1, le=200),
):
    """Get project activity logs."""
    logs = [l for l in activity_logs_db if l.project_id == project_id]
    logs.sort(key=lambda x: x.timestamp, reverse=True)
    
    return {"logs": logs[:limit]}

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS - ANALYTICS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/{project_id}/analytics")
async def get_project_analytics(project_id: str):
    """Get project analytics and insights."""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    
    # Calculate metrics
    phases_completed = sum(1 for p in project.phases if p.status == PhaseStatus.COMPLETED)
    milestones_completed = sum(1 for m in project.milestones if m.completed)
    overdue_milestones = sum(1 for m in project.milestones if not m.completed and m.due_date < datetime.utcnow())
    
    # Budget health
    budget_percent = (project.budget.spent / project.budget.total * 100) if project.budget.total > 0 else 0
    
    # Time analysis
    days_elapsed = (datetime.utcnow() - project.start_date).days if project.start_date else 0
    days_remaining = (project.end_date - datetime.utcnow()).days if project.end_date else None
    
    return {
        "project_id": project_id,
        "progress": project.progress,
        "phases": {
            "total": len(project.phases),
            "completed": phases_completed,
            "in_progress": sum(1 for p in project.phases if p.status == PhaseStatus.IN_PROGRESS),
        },
        "milestones": {
            "total": len(project.milestones),
            "completed": milestones_completed,
            "overdue": overdue_milestones,
        },
        "budget": {
            "total": project.budget.total,
            "spent": project.budget.spent,
            "remaining": project.budget.remaining,
            "percent_used": round(budget_percent, 1),
            "health": "good" if budget_percent < 80 else "warning" if budget_percent < 100 else "critical",
        },
        "timeline": {
            "days_elapsed": days_elapsed,
            "days_remaining": days_remaining,
            "on_track": project.progress >= (days_elapsed / (days_elapsed + (days_remaining or 1)) * 100) if days_remaining else None,
        },
        "team_size": len(project.team),
        "documents_count": len(project.documents),
    }

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS - EXPORT
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/{project_id}/export")
async def export_project(
    project_id: str,
    format: str = Query("json", regex="^(json|csv)$"),
):
    """Export project data."""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    
    if format == "json":
        return project.dict()
    
    # CSV format - basic implementation
    csv_lines = [
        "Field,Value",
        f"Name,{project.name}",
        f"Status,{project.status}",
        f"Progress,{project.progress}%",
        f"Budget Total,{project.budget.total}",
        f"Budget Spent,{project.budget.spent}",
        f"Phases,{len(project.phases)}",
        f"Team Size,{len(project.team)}",
    ]
    
    return {"csv": "\n".join(csv_lines)}

# ═══════════════════════════════════════════════════════════════════════════════
# INITIALIZATION - Sample Data
# ═══════════════════════════════════════════════════════════════════════════════

def init_sample_data():
    """Initialize with sample projects."""
    sample_project = ProjectCreate(
        name="Rénovation Cuisine Dupont",
        description="Rénovation complète de la cuisine avec ajout d'un îlot",
        type=ProjectType.RENOVATION,
        client_name="Marie Dupont",
        address="123 rue Principale, Montréal",
        budget=45000,
        template_id="residential_renovation",
    )
    
    # Create project with template
    project = Project(
        id="proj_sample_1",
        name=sample_project.name,
        description=sample_project.description,
        type=sample_project.type,
        status=ProjectStatus.IN_PROGRESS,
        client_name=sample_project.client_name,
        address=sample_project.address,
        start_date=datetime.utcnow() - timedelta(days=14),
        budget=ProjectBudget(total=sample_project.budget, spent=12500, remaining=32500),
        progress=25.0,
    )
    
    project = apply_template(project, PROJECT_TEMPLATES["residential_renovation"], project.start_date)
    project.phases[0].status = PhaseStatus.COMPLETED
    project.phases[0].progress = 100
    project.phases[1].status = PhaseStatus.IN_PROGRESS
    project.phases[1].progress = 50
    
    projects_db[project.id] = project
    
    logger.info("Sample projects initialized")

# Initialize on module load
init_sample_data()
