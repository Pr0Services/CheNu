"""
CHE·NU™ B24 - APIs V2
APIs puissantes et extensibles

Features:
- Projects API V2 (stats, logs, analytics)
- Automation Engine (actions automatiques)
- Webhooks System (sync externe)
- Templates Intelligents (projets pré-configurés)
- Analytics Avancés (BI, prédictions)
- API Marketplace (extensions tierces)

Author: CHE·NU Dev Team
Date: December 2024
Lines: ~750
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Callable, Union
from datetime import datetime, timedelta
from enum import Enum
from uuid import uuid4
import hashlib
import hmac
import json

router = APIRouter(prefix="/api/v2", tags=["APIs V2"])

# =============================================================================
# ENUMS
# =============================================================================

class ProjectStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class AutomationTrigger(str, Enum):
    EVENT = "event"  # On specific event
    SCHEDULE = "schedule"  # Cron-like
    WEBHOOK = "webhook"  # External trigger
    CONDITION = "condition"  # When condition met
    MANUAL = "manual"  # User triggered

class AutomationAction(str, Enum):
    SEND_NOTIFICATION = "send_notification"
    CREATE_TASK = "create_task"
    UPDATE_STATUS = "update_status"
    SEND_EMAIL = "send_email"
    CALL_WEBHOOK = "call_webhook"
    RUN_AGENT = "run_agent"
    EXPORT_DATA = "export_data"
    GENERATE_REPORT = "generate_report"

class WebhookEvent(str, Enum):
    PROJECT_CREATED = "project.created"
    PROJECT_UPDATED = "project.updated"
    PROJECT_COMPLETED = "project.completed"
    TASK_CREATED = "task.created"
    TASK_COMPLETED = "task.completed"
    USER_ACTION = "user.action"
    AGENT_RESPONSE = "agent.response"
    EXPORT_READY = "export.ready"

class AnalyticsPeriod(str, Enum):
    HOUR = "hour"
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    QUARTER = "quarter"
    YEAR = "year"

# =============================================================================
# MODELS - Projects V2
# =============================================================================

class ProjectMember(BaseModel):
    """Membre d'un projet"""
    user_id: str
    role: str = "member"  # owner, admin, member, viewer
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    permissions: List[str] = []

class ProjectTask(BaseModel):
    """Tâche de projet"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    project_id: str
    title: str
    description: Optional[str] = None
    
    status: str = "todo"  # todo, in_progress, review, done
    priority: str = "medium"
    
    assignee_id: Optional[str] = None
    due_date: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    tags: List[str] = []
    estimated_hours: float = 0
    actual_hours: float = 0

class ProjectLog(BaseModel):
    """Log d'activité projet"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    project_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    user_id: str
    action: str
    entity_type: str
    entity_id: str
    
    old_value: Optional[Dict] = None
    new_value: Optional[Dict] = None
    
    metadata: Dict[str, Any] = {}

class ProjectStats(BaseModel):
    """Statistiques projet"""
    project_id: str
    calculated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Tasks
    total_tasks: int = 0
    completed_tasks: int = 0
    in_progress_tasks: int = 0
    overdue_tasks: int = 0
    
    # Time
    total_estimated_hours: float = 0
    total_actual_hours: float = 0
    
    # Progress
    completion_percent: float = 0
    on_track: bool = True
    
    # Team
    active_members: int = 0
    
    # Activity
    commits_this_week: int = 0
    updates_this_week: int = 0

class ProjectV2(BaseModel):
    """Projet V2 avec features avancées"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Basic
    name: str
    description: Optional[str] = None
    status: ProjectStatus = ProjectStatus.DRAFT
    
    # Context
    space_id: str = "entreprise"
    
    # Team
    members: List[ProjectMember] = []
    
    # Dates
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    # Config
    template_id: Optional[str] = None
    brand_kit_id: Optional[str] = None
    
    # Settings
    settings: Dict[str, Any] = {}
    
    # Tags
    tags: List[str] = []
    
    # Integration
    external_id: Optional[str] = None
    integrations: Dict[str, str] = {}

# =============================================================================
# MODELS - Automation
# =============================================================================

class AutomationCondition(BaseModel):
    """Condition d'automation"""
    field: str
    operator: str  # eq, ne, gt, lt, contains, exists
    value: Any

class AutomationStep(BaseModel):
    """Étape d'automation"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    order: int
    action: AutomationAction
    config: Dict[str, Any] = {}
    
    # Conditional
    conditions: List[AutomationCondition] = []
    
    # Error handling
    on_error: str = "stop"  # stop, continue, retry

class Automation(BaseModel):
    """Automation complète"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    name: str
    description: Optional[str] = None
    
    # Trigger
    trigger: AutomationTrigger
    trigger_config: Dict[str, Any] = {}
    
    # Steps
    steps: List[AutomationStep] = []
    
    # Status
    is_enabled: bool = True
    last_run_at: Optional[datetime] = None
    run_count: int = 0
    error_count: int = 0
    
    # Scope
    space_id: Optional[str] = None
    project_id: Optional[str] = None

class AutomationRun(BaseModel):
    """Exécution d'une automation"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    automation_id: str
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    status: str = "running"  # running, completed, failed
    
    # Results
    steps_completed: int = 0
    steps_total: int = 0
    results: List[Dict] = []
    error_message: Optional[str] = None

# =============================================================================
# MODELS - Webhooks
# =============================================================================

class WebhookEndpoint(BaseModel):
    """Endpoint webhook"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    name: str
    url: str
    secret: str = Field(default_factory=lambda: str(uuid4()))
    
    # Events
    events: List[WebhookEvent] = []
    
    # Status
    is_enabled: bool = True
    last_triggered_at: Optional[datetime] = None
    
    # Stats
    success_count: int = 0
    failure_count: int = 0
    
    # Retry config
    retry_count: int = 3
    retry_delay_seconds: int = 60

class WebhookDelivery(BaseModel):
    """Livraison webhook"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    webhook_id: str
    event: WebhookEvent
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Request
    payload: Dict[str, Any]
    
    # Response
    status_code: Optional[int] = None
    response_body: Optional[str] = None
    response_time_ms: Optional[int] = None
    
    # Status
    status: str = "pending"  # pending, success, failed
    attempts: int = 0
    next_retry_at: Optional[datetime] = None

# =============================================================================
# MODELS - Templates
# =============================================================================

class TemplateTask(BaseModel):
    """Tâche de template"""
    title: str
    description: Optional[str] = None
    relative_due_days: Optional[int] = None
    priority: str = "medium"
    tags: List[str] = []

class TemplatePhase(BaseModel):
    """Phase de template"""
    name: str
    description: Optional[str] = None
    order: int
    duration_days: int = 7
    tasks: List[TemplateTask] = []

class ProjectTemplate(BaseModel):
    """Template de projet intelligent"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    name: str
    description: Optional[str] = None
    category: str = "general"
    
    # Content
    phases: List[TemplatePhase] = []
    default_settings: Dict[str, Any] = {}
    
    # Brand
    brand_kit_id: Optional[str] = None
    
    # Automations to apply
    automation_ids: List[str] = []
    
    # Stats
    usage_count: int = 0
    
    # Sharing
    is_public: bool = False
    is_premium: bool = False

# =============================================================================
# MODELS - Analytics
# =============================================================================

class MetricPoint(BaseModel):
    """Point de métrique"""
    timestamp: datetime
    value: float
    label: Optional[str] = None

class AnalyticsMetric(BaseModel):
    """Métrique analytics"""
    name: str
    description: Optional[str] = None
    unit: str = "count"
    
    current_value: float = 0
    previous_value: float = 0
    change_percent: float = 0
    
    trend: str = "stable"  # up, down, stable
    
    data_points: List[MetricPoint] = []

class AnalyticsDashboard(BaseModel):
    """Dashboard analytics"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    period: AnalyticsPeriod
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Overview
    total_projects: int = 0
    active_projects: int = 0
    completed_projects: int = 0
    
    # Tasks
    tasks_completed: int = 0
    tasks_created: int = 0
    avg_completion_time_hours: float = 0
    
    # Team
    active_users: int = 0
    top_contributors: List[Dict] = []
    
    # Metrics
    metrics: List[AnalyticsMetric] = []
    
    # Predictions
    predicted_completions: int = 0
    risk_projects: List[str] = []

class AnalyticsQuery(BaseModel):
    """Requête analytics"""
    metrics: List[str]
    period: AnalyticsPeriod = AnalyticsPeriod.WEEK
    group_by: Optional[str] = None
    filters: Dict[str, Any] = {}

# =============================================================================
# MODELS - API Marketplace
# =============================================================================

class APIExtension(BaseModel):
    """Extension API tierce"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    developer_id: str
    
    name: str
    description: str
    version: str = "1.0.0"
    
    # Endpoints
    base_url: str
    endpoints: List[Dict[str, Any]] = []
    
    # Auth
    auth_type: str = "api_key"  # api_key, oauth2, none
    
    # Status
    is_verified: bool = False
    is_published: bool = False
    
    # Stats
    installs: int = 0
    rating: float = 0.0

class InstalledExtension(BaseModel):
    """Extension installée"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    extension_id: str
    user_id: str
    installed_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Config
    config: Dict[str, Any] = {}
    
    # Status
    is_enabled: bool = True

# =============================================================================
# STORAGE
# =============================================================================

class APIStore:
    def __init__(self):
        # Projects
        self.projects: Dict[str, ProjectV2] = {}
        self.tasks: Dict[str, ProjectTask] = {}
        self.logs: Dict[str, List[ProjectLog]] = {}
        
        # Automations
        self.automations: Dict[str, Automation] = {}
        self.automation_runs: Dict[str, AutomationRun] = {}
        
        # Webhooks
        self.webhooks: Dict[str, WebhookEndpoint] = {}
        self.deliveries: Dict[str, WebhookDelivery] = {}
        
        # Templates
        self.templates: Dict[str, ProjectTemplate] = {}
        
        # Extensions
        self.extensions: Dict[str, APIExtension] = {}
        self.installed: Dict[str, InstalledExtension] = {}
        
        # Indexes
        self.projects_by_owner: Dict[str, List[str]] = {}
        self.tasks_by_project: Dict[str, List[str]] = {}

store = APIStore()

# =============================================================================
# AUTOMATION ENGINE
# =============================================================================

class AutomationEngine:
    """Moteur d'exécution des automations"""
    
    async def run_automation(self, automation_id: str, trigger_data: Dict = {}) -> AutomationRun:
        """Exécute une automation"""
        if automation_id not in store.automations:
            raise HTTPException(404, "Automation not found")
        
        automation = store.automations[automation_id]
        
        if not automation.is_enabled:
            raise HTTPException(400, "Automation is disabled")
        
        run = AutomationRun(
            automation_id=automation_id,
            steps_total=len(automation.steps)
        )
        store.automation_runs[run.id] = run
        
        # Execute steps
        context = {"trigger_data": trigger_data}
        
        for step in sorted(automation.steps, key=lambda s: s.order):
            try:
                # Check conditions
                if step.conditions:
                    if not self._check_conditions(step.conditions, context):
                        continue
                
                # Execute action
                result = await self._execute_action(step, context)
                run.results.append({"step_id": step.id, "success": True, "result": result})
                run.steps_completed += 1
                context[f"step_{step.id}"] = result
                
            except Exception as e:
                run.results.append({"step_id": step.id, "success": False, "error": str(e)})
                if step.on_error == "stop":
                    run.status = "failed"
                    run.error_message = str(e)
                    break
        
        if run.status != "failed":
            run.status = "completed"
        
        run.completed_at = datetime.utcnow()
        
        # Update automation stats
        automation.last_run_at = datetime.utcnow()
        automation.run_count += 1
        if run.status == "failed":
            automation.error_count += 1
        
        return run
    
    def _check_conditions(self, conditions: List[AutomationCondition], context: Dict) -> bool:
        """Vérifie les conditions"""
        for cond in conditions:
            value = context.get(cond.field)
            
            if cond.operator == "eq" and value != cond.value:
                return False
            elif cond.operator == "ne" and value == cond.value:
                return False
            elif cond.operator == "gt" and not (value and value > cond.value):
                return False
            elif cond.operator == "lt" and not (value and value < cond.value):
                return False
            elif cond.operator == "contains" and cond.value not in str(value):
                return False
            elif cond.operator == "exists" and value is None:
                return False
        
        return True
    
    async def _execute_action(self, step: AutomationStep, context: Dict) -> Dict:
        """Exécute une action"""
        action = step.action
        config = step.config
        
        if action == AutomationAction.SEND_NOTIFICATION:
            return {"notification_sent": True, "to": config.get("user_id")}
        
        elif action == AutomationAction.CREATE_TASK:
            task = ProjectTask(
                project_id=config.get("project_id", ""),
                title=config.get("title", "Auto-created task"),
                description=config.get("description")
            )
            store.tasks[task.id] = task
            return {"task_id": task.id}
        
        elif action == AutomationAction.UPDATE_STATUS:
            entity_id = config.get("entity_id")
            new_status = config.get("status")
            if entity_id in store.projects:
                store.projects[entity_id].status = ProjectStatus(new_status)
            return {"updated": True}
        
        elif action == AutomationAction.CALL_WEBHOOK:
            # Simulate webhook call
            return {"webhook_called": config.get("url"), "status": 200}
        
        elif action == AutomationAction.RUN_AGENT:
            return {"agent_run": config.get("agent_id"), "status": "completed"}
        
        elif action == AutomationAction.GENERATE_REPORT:
            return {"report_id": str(uuid4()), "type": config.get("report_type")}
        
        return {"action": action.value, "executed": True}

automation_engine = AutomationEngine()

# =============================================================================
# WEBHOOK ENGINE
# =============================================================================

class WebhookEngine:
    """Moteur de webhooks"""
    
    async def trigger_event(self, event: WebhookEvent, payload: Dict):
        """Déclenche un événement webhook"""
        
        # Find subscribed webhooks
        for webhook in store.webhooks.values():
            if webhook.is_enabled and event in webhook.events:
                await self._deliver(webhook, event, payload)
    
    async def _deliver(self, webhook: WebhookEndpoint, event: WebhookEvent, payload: Dict):
        """Livre un webhook"""
        
        delivery = WebhookDelivery(
            webhook_id=webhook.id,
            event=event,
            payload=payload
        )
        store.deliveries[delivery.id] = delivery
        
        # Simulate delivery
        try:
            # Sign payload
            signature = self._sign_payload(payload, webhook.secret)
            
            # Simulate HTTP request
            delivery.status_code = 200
            delivery.response_time_ms = 150
            delivery.status = "success"
            delivery.attempts = 1
            
            webhook.success_count += 1
            webhook.last_triggered_at = datetime.utcnow()
            
        except Exception as e:
            delivery.status = "failed"
            delivery.attempts = 1
            delivery.next_retry_at = datetime.utcnow() + timedelta(seconds=webhook.retry_delay_seconds)
            webhook.failure_count += 1
        
        return delivery
    
    def _sign_payload(self, payload: Dict, secret: str) -> str:
        """Signe le payload"""
        payload_str = json.dumps(payload, sort_keys=True)
        return hmac.new(
            secret.encode(),
            payload_str.encode(),
            hashlib.sha256
        ).hexdigest()

webhook_engine = WebhookEngine()

# =============================================================================
# ANALYTICS ENGINE
# =============================================================================

class AnalyticsEngine:
    """Moteur d'analytics"""
    
    async def generate_dashboard(self, owner_id: str, period: AnalyticsPeriod) -> AnalyticsDashboard:
        """Génère un dashboard analytics"""
        
        projects = [p for p in store.projects.values() if p.owner_id == owner_id]
        
        dashboard = AnalyticsDashboard(
            owner_id=owner_id,
            period=period,
            total_projects=len(projects),
            active_projects=len([p for p in projects if p.status == ProjectStatus.ACTIVE]),
            completed_projects=len([p for p in projects if p.status == ProjectStatus.COMPLETED])
        )
        
        # Tasks stats
        all_tasks = []
        for p in projects:
            task_ids = store.tasks_by_project.get(p.id, [])
            all_tasks.extend([store.tasks[tid] for tid in task_ids if tid in store.tasks])
        
        dashboard.tasks_completed = len([t for t in all_tasks if t.status == "done"])
        dashboard.tasks_created = len(all_tasks)
        
        # Metrics
        dashboard.metrics = [
            AnalyticsMetric(
                name="productivity_score",
                description="Score de productivité",
                current_value=85.5,
                previous_value=82.0,
                change_percent=4.3,
                trend="up"
            ),
            AnalyticsMetric(
                name="completion_rate",
                description="Taux de complétion",
                unit="percent",
                current_value=78.0,
                previous_value=75.0,
                change_percent=4.0,
                trend="up"
            ),
            AnalyticsMetric(
                name="avg_task_time",
                description="Temps moyen par tâche",
                unit="hours",
                current_value=4.2,
                previous_value=4.8,
                change_percent=-12.5,
                trend="down"
            )
        ]
        
        # Predictions
        dashboard.predicted_completions = int(dashboard.completed_projects * 1.2)
        dashboard.risk_projects = [p.id for p in projects if p.status == ProjectStatus.ACTIVE and p.due_date and p.due_date < datetime.utcnow()]
        
        return dashboard
    
    async def query(self, owner_id: str, query: AnalyticsQuery) -> Dict:
        """Exécute une requête analytics"""
        
        results = {}
        
        for metric in query.metrics:
            if metric == "projects_count":
                results[metric] = len([p for p in store.projects.values() if p.owner_id == owner_id])
            elif metric == "tasks_count":
                results[metric] = len(store.tasks)
            elif metric == "completion_rate":
                tasks = list(store.tasks.values())
                if tasks:
                    results[metric] = len([t for t in tasks if t.status == "done"]) / len(tasks) * 100
                else:
                    results[metric] = 0
        
        return {
            "query": query.model_dump(),
            "results": results,
            "generated_at": datetime.utcnow().isoformat()
        }

analytics_engine = AnalyticsEngine()

# =============================================================================
# API ENDPOINTS - Projects V2
# =============================================================================

@router.post("/projects", response_model=ProjectV2)
async def create_project(name: str, owner_id: str, description: Optional[str] = None, template_id: Optional[str] = None):
    """Crée un projet V2"""
    
    project = ProjectV2(
        owner_id=owner_id,
        name=name,
        description=description,
        template_id=template_id,
        members=[ProjectMember(user_id=owner_id, role="owner")]
    )
    
    # Apply template if specified
    if template_id and template_id in store.templates:
        template = store.templates[template_id]
        project.settings = template.default_settings.copy()
        project.brand_kit_id = template.brand_kit_id
        
        # Create tasks from template phases
        for phase in template.phases:
            for task_template in phase.tasks:
                task = ProjectTask(
                    project_id=project.id,
                    title=task_template.title,
                    description=task_template.description,
                    priority=task_template.priority,
                    tags=task_template.tags
                )
                if task_template.relative_due_days and project.start_date:
                    task.due_date = project.start_date + timedelta(days=task_template.relative_due_days)
                
                store.tasks[task.id] = task
                if project.id not in store.tasks_by_project:
                    store.tasks_by_project[project.id] = []
                store.tasks_by_project[project.id].append(task.id)
        
        template.usage_count += 1
    
    store.projects[project.id] = project
    if owner_id not in store.projects_by_owner:
        store.projects_by_owner[owner_id] = []
    store.projects_by_owner[owner_id].append(project.id)
    
    # Init logs
    store.logs[project.id] = []
    
    # Trigger webhook
    await webhook_engine.trigger_event(WebhookEvent.PROJECT_CREATED, {
        "project_id": project.id,
        "name": project.name,
        "owner_id": owner_id
    })
    
    return project

@router.get("/projects/{project_id}", response_model=ProjectV2)
async def get_project(project_id: str):
    if project_id not in store.projects:
        raise HTTPException(404, "Project not found")
    return store.projects[project_id]

@router.get("/projects", response_model=List[ProjectV2])
async def list_projects(owner_id: str, status: Optional[ProjectStatus] = None, limit: int = 50):
    project_ids = store.projects_by_owner.get(owner_id, [])
    projects = [store.projects[pid] for pid in project_ids if pid in store.projects]
    
    if status:
        projects = [p for p in projects if p.status == status]
    
    return sorted(projects, key=lambda x: x.updated_at, reverse=True)[:limit]

@router.get("/projects/{project_id}/stats", response_model=ProjectStats)
async def get_project_stats(project_id: str):
    if project_id not in store.projects:
        raise HTTPException(404, "Project not found")
    
    project = store.projects[project_id]
    task_ids = store.tasks_by_project.get(project_id, [])
    tasks = [store.tasks[tid] for tid in task_ids if tid in store.tasks]
    
    now = datetime.utcnow()
    
    stats = ProjectStats(
        project_id=project_id,
        total_tasks=len(tasks),
        completed_tasks=len([t for t in tasks if t.status == "done"]),
        in_progress_tasks=len([t for t in tasks if t.status == "in_progress"]),
        overdue_tasks=len([t for t in tasks if t.due_date and t.due_date < now and t.status != "done"]),
        total_estimated_hours=sum(t.estimated_hours for t in tasks),
        total_actual_hours=sum(t.actual_hours for t in tasks),
        active_members=len(project.members)
    )
    
    if stats.total_tasks > 0:
        stats.completion_percent = (stats.completed_tasks / stats.total_tasks) * 100
    
    stats.on_track = stats.overdue_tasks == 0
    
    return stats

@router.get("/projects/{project_id}/logs", response_model=List[ProjectLog])
async def get_project_logs(project_id: str, limit: int = 50):
    return store.logs.get(project_id, [])[:limit]

# =============================================================================
# API ENDPOINTS - Tasks
# =============================================================================

@router.post("/projects/{project_id}/tasks", response_model=ProjectTask)
async def create_task(project_id: str, title: str, user_id: str, description: Optional[str] = None):
    if project_id not in store.projects:
        raise HTTPException(404, "Project not found")
    
    task = ProjectTask(project_id=project_id, title=title, description=description)
    store.tasks[task.id] = task
    
    if project_id not in store.tasks_by_project:
        store.tasks_by_project[project_id] = []
    store.tasks_by_project[project_id].append(task.id)
    
    # Log
    log = ProjectLog(
        project_id=project_id,
        user_id=user_id,
        action="created",
        entity_type="task",
        entity_id=task.id
    )
    store.logs[project_id].insert(0, log)
    
    # Webhook
    await webhook_engine.trigger_event(WebhookEvent.TASK_CREATED, {
        "task_id": task.id,
        "project_id": project_id,
        "title": title
    })
    
    return task

@router.put("/tasks/{task_id}", response_model=ProjectTask)
async def update_task(task_id: str, updates: Dict[str, Any], user_id: str):
    if task_id not in store.tasks:
        raise HTTPException(404, "Task not found")
    
    task = store.tasks[task_id]
    old_status = task.status
    
    for key, value in updates.items():
        if hasattr(task, key) and key not in ['id', 'project_id', 'created_at']:
            setattr(task, key, value)
    
    # Check completion
    if updates.get("status") == "done" and old_status != "done":
        task.completed_at = datetime.utcnow()
        
        await webhook_engine.trigger_event(WebhookEvent.TASK_COMPLETED, {
            "task_id": task.id,
            "project_id": task.project_id
        })
    
    return task

@router.get("/projects/{project_id}/tasks", response_model=List[ProjectTask])
async def list_tasks(project_id: str, status: Optional[str] = None):
    task_ids = store.tasks_by_project.get(project_id, [])
    tasks = [store.tasks[tid] for tid in task_ids if tid in store.tasks]
    
    if status:
        tasks = [t for t in tasks if t.status == status]
    
    return tasks

# =============================================================================
# API ENDPOINTS - Automations
# =============================================================================

@router.post("/automations", response_model=Automation)
async def create_automation(
    name: str,
    owner_id: str,
    trigger: AutomationTrigger,
    steps: List[Dict],
    trigger_config: Dict = {}
):
    automation = Automation(
        owner_id=owner_id,
        name=name,
        trigger=trigger,
        trigger_config=trigger_config,
        steps=[AutomationStep(**s) for s in steps]
    )
    store.automations[automation.id] = automation
    return automation

@router.get("/automations", response_model=List[Automation])
async def list_automations(owner_id: str):
    return [a for a in store.automations.values() if a.owner_id == owner_id]

@router.post("/automations/{automation_id}/run", response_model=AutomationRun)
async def run_automation(automation_id: str, trigger_data: Dict = {}):
    return await automation_engine.run_automation(automation_id, trigger_data)

@router.get("/automations/{automation_id}/runs", response_model=List[AutomationRun])
async def list_automation_runs(automation_id: str, limit: int = 20):
    runs = [r for r in store.automation_runs.values() if r.automation_id == automation_id]
    return sorted(runs, key=lambda x: x.started_at, reverse=True)[:limit]

# =============================================================================
# API ENDPOINTS - Webhooks
# =============================================================================

@router.post("/webhooks", response_model=WebhookEndpoint)
async def create_webhook(name: str, url: str, owner_id: str, events: List[WebhookEvent]):
    webhook = WebhookEndpoint(owner_id=owner_id, name=name, url=url, events=events)
    store.webhooks[webhook.id] = webhook
    return webhook

@router.get("/webhooks", response_model=List[WebhookEndpoint])
async def list_webhooks(owner_id: str):
    return [w for w in store.webhooks.values() if w.owner_id == owner_id]

@router.get("/webhooks/{webhook_id}/deliveries", response_model=List[WebhookDelivery])
async def list_webhook_deliveries(webhook_id: str, limit: int = 50):
    deliveries = [d for d in store.deliveries.values() if d.webhook_id == webhook_id]
    return sorted(deliveries, key=lambda x: x.timestamp, reverse=True)[:limit]

@router.post("/webhooks/{webhook_id}/test")
async def test_webhook(webhook_id: str):
    if webhook_id not in store.webhooks:
        raise HTTPException(404, "Webhook not found")
    
    webhook = store.webhooks[webhook_id]
    delivery = await webhook_engine._deliver(webhook, WebhookEvent.USER_ACTION, {"test": True})
    return {"delivery_id": delivery.id, "status": delivery.status}

# =============================================================================
# API ENDPOINTS - Templates
# =============================================================================

@router.post("/templates", response_model=ProjectTemplate)
async def create_template(name: str, owner_id: str, category: str = "general", phases: List[Dict] = []):
    template = ProjectTemplate(
        owner_id=owner_id,
        name=name,
        category=category,
        phases=[TemplatePhase(**p) for p in phases]
    )
    store.templates[template.id] = template
    return template

@router.get("/templates", response_model=List[ProjectTemplate])
async def list_templates(category: Optional[str] = None, public_only: bool = False, limit: int = 50):
    templates = list(store.templates.values())
    
    if category:
        templates = [t for t in templates if t.category == category]
    
    if public_only:
        templates = [t for t in templates if t.is_public]
    
    return sorted(templates, key=lambda x: x.usage_count, reverse=True)[:limit]

@router.get("/templates/{template_id}", response_model=ProjectTemplate)
async def get_template(template_id: str):
    if template_id not in store.templates:
        raise HTTPException(404, "Template not found")
    return store.templates[template_id]

# =============================================================================
# API ENDPOINTS - Analytics
# =============================================================================

@router.get("/analytics/dashboard", response_model=AnalyticsDashboard)
async def get_analytics_dashboard(owner_id: str, period: AnalyticsPeriod = AnalyticsPeriod.WEEK):
    return await analytics_engine.generate_dashboard(owner_id, period)

@router.post("/analytics/query")
async def query_analytics(owner_id: str, query: AnalyticsQuery):
    return await analytics_engine.query(owner_id, query)

# =============================================================================
# API ENDPOINTS - Extensions Marketplace
# =============================================================================

@router.get("/marketplace/extensions", response_model=List[APIExtension])
async def list_extensions(verified_only: bool = False):
    extensions = list(store.extensions.values())
    if verified_only:
        extensions = [e for e in extensions if e.is_verified]
    return extensions

@router.post("/marketplace/extensions/{extension_id}/install")
async def install_extension(extension_id: str, user_id: str, config: Dict = {}):
    if extension_id not in store.extensions:
        raise HTTPException(404, "Extension not found")
    
    installed = InstalledExtension(
        extension_id=extension_id,
        user_id=user_id,
        config=config
    )
    store.installed[installed.id] = installed
    store.extensions[extension_id].installs += 1
    
    return {"installed_id": installed.id, "status": "installed"}

@router.get("/marketplace/installed", response_model=List[InstalledExtension])
async def list_installed_extensions(user_id: str):
    return [i for i in store.installed.values() if i.user_id == user_id]

# =============================================================================
# HEALTH
# =============================================================================

@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "projects": len(store.projects),
        "automations": len(store.automations),
        "webhooks": len(store.webhooks),
        "templates": len(store.templates)
    }
