"""
CHE·NU Construction - Structure Organisationnelle
================================================
Modèle de données pour Entreprise → Département → Projet → Tâche
Avec intégration des Agents, Outils et Templates
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any
from enum import Enum
from datetime import datetime, date
from uuid import uuid4

# ============================================
# ENUMS
# ============================================

class ProjectPhase(Enum):
    PRE_CONSTRUCTION = "pre_construction"
    ESTIMATION = "estimation"
    DESIGN = "design"
    PERMITTING = "permitting"
    PROCUREMENT = "procurement"
    CONSTRUCTION = "construction"
    COMMISSIONING = "commissioning"
    CLOSEOUT = "closeout"

class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class TaskPriority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4

class DocumentType(Enum):
    CONTRACT = "contract"
    REPORT = "report"
    DRAWING = "drawing"
    SPECIFICATION = "specification"
    PERMIT = "permit"
    CORRESPONDENCE = "correspondence"
    PHOTO = "photo"

# ============================================
# STRUCTURE ORGANISATIONNELLE
# ============================================

@dataclass
class Enterprise:
    """Entreprise de construction - Niveau le plus haut."""
    id: str = field(default_factory=lambda: str(uuid4()))
    name: str = ""
    legal_name: str = ""
    license_number: str = ""  # RBQ au Québec
    address: str = ""
    
    # Relations
    departments: List['Department'] = field(default_factory=list)
    projects: List['Project'] = field(default_factory=list)
    employees: List['Employee'] = field(default_factory=list)
    
    # Ressources globales
    tool_library: List[str] = field(default_factory=list)  # IDs des outils
    template_library: List[str] = field(default_factory=list)  # IDs des templates
    agent_configs: Dict[str, Any] = field(default_factory=dict)  # Configs des agents CHE·NU
    
    # Intégrations
    integrations: Dict[str, Dict] = field(default_factory=dict)  # github, drive, etc.
    
    # Métadonnées
    created_at: datetime = field(default_factory=datetime.now)
    settings: Dict[str, Any] = field(default_factory=dict)

@dataclass
class Department:
    """Département de l'entreprise."""
    id: str = field(default_factory=lambda: str(uuid4()))
    enterprise_id: str = ""
    
    name: str = ""
    code: str = ""  # Ex: "EST" pour Estimation
    description: str = ""
    head_employee_id: Optional[str] = None
    
    # Agents CHE·NU assignés à ce département
    assigned_agents: List[str] = field(default_factory=list)  # IDs des agents
    
    # Outils disponibles pour ce département
    available_tools: List[str] = field(default_factory=list)
    
    # Templates associés
    templates: List[str] = field(default_factory=list)
    
    # Projets où ce département est impliqué
    active_projects: List[str] = field(default_factory=list)
    
    # Métriques
    kpis: Dict[str, Any] = field(default_factory=dict)

@dataclass
class Employee:
    """Employé de l'entreprise."""
    id: str = field(default_factory=lambda: str(uuid4()))
    enterprise_id: str = ""
    department_id: str = ""
    
    name: str = ""
    email: str = ""
    role: str = ""
    title: str = ""
    
    # Projets assignés
    assigned_projects: List[str] = field(default_factory=list)
    
    # Permissions
    permissions: List[str] = field(default_factory=list)

# ============================================
# PROJETS
# ============================================

@dataclass
class Project:
    """Projet de construction."""
    id: str = field(default_factory=lambda: str(uuid4()))
    enterprise_id: str = ""
    
    # Identification
    number: str = ""  # Ex: "PRJ-2024-001"
    name: str = ""
    description: str = ""
    client_name: str = ""
    address: str = ""
    
    # État
    phase: ProjectPhase = ProjectPhase.PRE_CONSTRUCTION
    status: str = "active"  # active, on_hold, completed, cancelled
    
    # Dates
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    substantial_completion_date: Optional[date] = None
    
    # Budget
    contract_value: float = 0.0
    budget: float = 0.0
    spent: float = 0.0
    committed: float = 0.0
    
    # Équipe
    project_manager_id: Optional[str] = None
    superintendent_id: Optional[str] = None
    involved_departments: List[str] = field(default_factory=list)
    team_members: List[str] = field(default_factory=list)
    
    # Tâches et livrables
    tasks: List['Task'] = field(default_factory=list)
    milestones: List['Milestone'] = field(default_factory=list)
    documents: List['Document'] = field(default_factory=list)
    
    # Agents CHE·NU actifs sur ce projet
    active_agents: List[str] = field(default_factory=list)
    
    # Outils disponibles selon la phase
    available_tools: List[str] = field(default_factory=list)
    
    # Intégrations projet (dossier Drive, repo GitHub, etc.)
    integrations: Dict[str, str] = field(default_factory=dict)
    
    # Métriques
    kpis: Dict[str, Any] = field(default_factory=dict)
    
    def get_tools_for_phase(self) -> List[str]:
        """Retourne les outils recommandés pour la phase actuelle."""
        phase_tools = {
            ProjectPhase.ESTIMATION: [
                "takeoff_calculator", "pricing_engine", "bid_analyzer",
                "margin_calculator", "cost_database"
            ],
            ProjectPhase.DESIGN: [
                "space_planner", "code_checker", "material_selector",
                "rendering_engine", "clash_detector", "bim_coordinator"
            ],
            ProjectPhase.PERMITTING: [
                "permit_generator", "code_checker", "compliance_auditor"
            ],
            ProjectPhase.CONSTRUCTION: [
                "daily_log", "photo_documenter", "crew_manager",
                "delivery_tracker", "progress_reporter", "budget_tracker",
                "rfi_manager", "change_order"
            ],
            ProjectPhase.CLOSEOUT: [
                "deficiency_tracker", "inspection_checklist",
                "asbuilt_generator", "closeout_checklist"
            ]
        }
        return phase_tools.get(self.phase, [])

@dataclass
class Milestone:
    """Jalon de projet."""
    id: str = field(default_factory=lambda: str(uuid4()))
    project_id: str = ""
    
    name: str = ""
    description: str = ""
    target_date: Optional[date] = None
    actual_date: Optional[date] = None
    status: str = "pending"
    
    # Tâches associées
    task_ids: List[str] = field(default_factory=list)

# ============================================
# TÂCHES
# ============================================

@dataclass
class Task:
    """Tâche de projet."""
    id: str = field(default_factory=lambda: str(uuid4()))
    project_id: str = ""
    parent_task_id: Optional[str] = None  # Pour les sous-tâches
    
    # Identification
    number: str = ""
    title: str = ""
    description: str = ""
    
    # Contexte
    phase: ProjectPhase = ProjectPhase.CONSTRUCTION
    department_id: Optional[str] = None
    
    # État
    status: TaskStatus = TaskStatus.PENDING
    priority: TaskPriority = TaskPriority.MEDIUM
    progress: int = 0  # 0-100
    
    # Dates
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    completed_date: Optional[date] = None
    
    # Assignation
    assigned_to: List[str] = field(default_factory=list)  # Employee IDs
    assigned_agent: Optional[str] = None  # Agent CHE·NU ID
    
    # Outils requis pour cette tâche
    required_tools: List[str] = field(default_factory=list)
    
    # Templates associés à cette tâche
    associated_templates: List[str] = field(default_factory=list)
    
    # Sous-tâches
    subtasks: List['Task'] = field(default_factory=list)
    
    # Documents produits
    output_documents: List[str] = field(default_factory=list)
    
    # Dépendances
    dependencies: List[str] = field(default_factory=list)  # Task IDs
    
    # Heures et coûts
    estimated_hours: float = 0.0
    actual_hours: float = 0.0
    estimated_cost: float = 0.0
    actual_cost: float = 0.0
    
    # Notes et commentaires
    notes: List['TaskNote'] = field(default_factory=list)

@dataclass
class TaskNote:
    """Note/commentaire sur une tâche."""
    id: str = field(default_factory=lambda: str(uuid4()))
    task_id: str = ""
    author_id: str = ""
    content: str = ""
    created_at: datetime = field(default_factory=datetime.now)

# ============================================
# DOCUMENTS
# ============================================

@dataclass
class Document:
    """Document de projet."""
    id: str = field(default_factory=lambda: str(uuid4()))
    project_id: str = ""
    task_id: Optional[str] = None
    
    # Identification
    name: str = ""
    description: str = ""
    document_type: DocumentType = DocumentType.REPORT
    
    # Fichier
    file_name: str = ""
    file_path: str = ""  # Local ou cloud
    file_size: int = 0
    mime_type: str = ""
    
    # Version
    version: str = "1.0"
    revision: int = 0
    
    # Métadonnées
    created_by: str = ""
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    
    # Template utilisé
    template_id: Optional[str] = None
    
    # Stockage externe
    drive_id: Optional[str] = None
    github_path: Optional[str] = None

# ============================================
# MAPPING AGENTS-OUTILS-TEMPLATES PAR CONTEXTE
# ============================================

@dataclass
class ContextMapping:
    """
    Mapping des agents, outils et templates selon le contexte.
    Permet de savoir quoi utiliser à chaque niveau.
    """
    
    # Outils par département
    DEPARTMENT_TOOLS: Dict[str, List[str]] = field(default_factory=lambda: {
        "Estimation": [
            "takeoff_calculator", "pricing_engine", "bid_analyzer",
            "margin_calculator", "cost_database", "comparison_tool"
        ],
        "Architecture": [
            "space_planner", "code_checker", "material_selector",
            "rendering_engine", "area_calculator", "bim_coordinator"
        ],
        "Ingénierie": [
            "structural_calc", "mep_sizer", "load_calculator",
            "clash_detector", "energy_modeler"
        ],
        "Gestion de Projet": [
            "schedule_builder", "budget_tracker", "rfi_manager",
            "change_order", "progress_reporter"
        ],
        "Conformité": [
            "permit_generator", "inspection_checklist", "safety_planner",
            "contract_analyzer", "compliance_auditor"
        ],
        "Chantier": [
            "daily_log", "photo_documenter", "crew_manager",
            "delivery_tracker", "deficiency_tracker"
        ]
    })
    
    # Agents par département
    DEPARTMENT_AGENTS: Dict[str, List[str]] = field(default_factory=lambda: {
        "Estimation": [
            "estimation_lead", "quantity_surveyor", "cost_estimator",
            "bid_specialist", "value_engineer"
        ],
        "Architecture": [
            "architecture_lead", "architect", "interior_designer",
            "bim_specialist", "drafter"
        ],
        "Ingénierie": [
            "engineering_lead", "structural_engineer", "mep_engineer",
            "civil_engineer", "geotechnical_engineer"
        ],
        "Gestion de Projet": [
            "project_manager", "scheduler", "procurement_manager"
        ],
        "Conformité": [
            "compliance_lead", "permit_specialist", "code_analyst",
            "safety_officer", "contract_manager"
        ],
        "Chantier": [
            "site_supervisor", "quality_controller", "commissioning_agent"
        ]
    })
    
    # Templates par département
    DEPARTMENT_TEMPLATES: Dict[str, List[str]] = field(default_factory=lambda: {
        "Estimation": [
            "bid_form", "cost_estimate", "quantity_takeoff",
            "subcontractor_comparison"
        ],
        "Architecture": [
            "drawing_index", "specification_template", "material_schedule"
        ],
        "Gestion de Projet": [
            "meeting_minutes", "weekly_report", "change_order",
            "progress_report"
        ],
        "Conformité": [
            "permit_application", "safety_plan", "incident_report",
            "jsa", "contract"
        ],
        "Chantier": [
            "daily_report", "site_inspection", "delivery_receipt",
            "deficiency_list"
        ],
        "Qualité": [
            "qc_checklist", "test_report", "ncr"
        ]
    })
    
    # Outils par type de tâche
    TASK_TYPE_TOOLS: Dict[str, List[str]] = field(default_factory=lambda: {
        "relevé_quantités": ["takeoff_calculator", "area_calculator"],
        "estimation_coûts": ["pricing_engine", "cost_database", "margin_calculator"],
        "préparation_soumission": ["bid_analyzer", "margin_calculator"],
        "revue_design": ["code_checker", "clash_detector"],
        "coordination_bim": ["clash_detector", "bim_coordinator"],
        "demande_permis": ["permit_generator", "compliance_auditor"],
        "rapport_quotidien": ["daily_log", "photo_documenter"],
        "suivi_avancement": ["progress_reporter", "budget_tracker"],
        "inspection_qualité": ["inspection_checklist", "deficiency_tracker"],
        "gestion_rfi": ["rfi_manager"],
        "gestion_changements": ["change_order", "budget_tracker"]
    })

# ============================================
# GESTIONNAIRE DE CONTEXTE
# ============================================

class ContextManager:
    """
    Gère le contexte organisationnel et fournit
    les agents, outils et templates appropriés.
    """
    
    def __init__(self, enterprise: Enterprise):
        self.enterprise = enterprise
        self.mapping = ContextMapping()
    
    def get_tools_for_department(self, department_code: str) -> List[str]:
        """Retourne les outils disponibles pour un département."""
        return self.mapping.DEPARTMENT_TOOLS.get(department_code, [])
    
    def get_agents_for_department(self, department_code: str) -> List[str]:
        """Retourne les agents assignés à un département."""
        return self.mapping.DEPARTMENT_AGENTS.get(department_code, [])
    
    def get_templates_for_department(self, department_code: str) -> List[str]:
        """Retourne les templates associés à un département."""
        return self.mapping.DEPARTMENT_TEMPLATES.get(department_code, [])
    
    def get_tools_for_project_phase(self, project: Project) -> List[str]:
        """Retourne les outils pour la phase actuelle d'un projet."""
        return project.get_tools_for_phase()
    
    def get_tools_for_task(self, task: Task) -> List[str]:
        """Retourne les outils requis pour une tâche spécifique."""
        tools = list(task.required_tools)
        
        # Ajouter les outils du département si applicable
        if task.department_id:
            dept = self._get_department(task.department_id)
            if dept:
                tools.extend(self.get_tools_for_department(dept.name))
        
        return list(set(tools))
    
    def get_context_info(
        self, 
        project_id: str = None, 
        task_id: str = None,
        department_id: str = None
    ) -> Dict[str, Any]:
        """
        Retourne toutes les informations de contexte
        pour un niveau donné de la hiérarchie.
        """
        context = {
            "enterprise": {
                "id": self.enterprise.id,
                "name": self.enterprise.name
            },
            "available_tools": list(self.enterprise.tool_library),
            "available_templates": list(self.enterprise.template_library),
            "available_agents": list(self.enterprise.agent_configs.keys())
        }
        
        if department_id:
            dept = self._get_department(department_id)
            if dept:
                context["department"] = {
                    "id": dept.id,
                    "name": dept.name
                }
                context["available_tools"] = self.get_tools_for_department(dept.name)
                context["available_agents"] = self.get_agents_for_department(dept.name)
                context["available_templates"] = self.get_templates_for_department(dept.name)
        
        if project_id:
            project = self._get_project(project_id)
            if project:
                context["project"] = {
                    "id": project.id,
                    "number": project.number,
                    "name": project.name,
                    "phase": project.phase.value
                }
                context["phase_tools"] = project.get_tools_for_phase()
        
        if task_id:
            task = self._get_task(task_id)
            if task:
                context["task"] = {
                    "id": task.id,
                    "title": task.title,
                    "status": task.status.value
                }
                context["task_tools"] = self.get_tools_for_task(task)
                context["task_templates"] = task.associated_templates
        
        return context
    
    def _get_department(self, dept_id: str) -> Optional[Department]:
        for dept in self.enterprise.departments:
            if dept.id == dept_id:
                return dept
        return None
    
    def _get_project(self, project_id: str) -> Optional[Project]:
        for project in self.enterprise.projects:
            if project.id == project_id:
                return project
        return None
    
    def _get_task(self, task_id: str) -> Optional[Task]:
        for project in self.enterprise.projects:
            for task in project.tasks:
                if task.id == task_id:
                    return task
                for subtask in task.subtasks:
                    if subtask.id == task_id:
                        return subtask
        return None

# ============================================
# EXEMPLE D'UTILISATION
# ============================================

def create_sample_structure() -> Enterprise:
    """Crée une structure exemple."""
    
    # Entreprise
    enterprise = Enterprise(
        name="Construction ABC Inc.",
        legal_name="Construction ABC Inc.",
        license_number="RBQ-1234-5678-90"
    )
    
    # Départements
    departments = [
        Department(name="Estimation", code="EST"),
        Department(name="Architecture", code="ARCH"),
        Department(name="Ingénierie", code="ING"),
        Department(name="Gestion de Projet", code="PM"),
        Department(name="Conformité", code="CONF"),
        Department(name="Chantier", code="SITE"),
    ]
    enterprise.departments = departments
    
    # Projet exemple
    project = Project(
        number="PRJ-2024-001",
        name="Centre Commercial Phase 2",
        client_name="Groupe Immobilier XYZ",
        phase=ProjectPhase.CONSTRUCTION,
        contract_value=15000000,
        budget=15000000,
        spent=9800000
    )
    
    # Tâches
    task1 = Task(
        number="T001",
        title="Coordination MEP",
        phase=ProjectPhase.CONSTRUCTION,
        required_tools=["clash_detector", "rfi_manager"],
        associated_templates=["meeting_minutes"]
    )
    
    subtask1 = Task(
        number="T001.1",
        title="Revue modèles BIM",
        parent_task_id=task1.id,
        required_tools=["clash_detector"]
    )
    
    subtask2 = Task(
        number="T001.2",
        title="Résolution conflits",
        parent_task_id=task1.id,
        required_tools=["clash_detector", "rfi_manager"]
    )
    
    task1.subtasks = [subtask1, subtask2]
    project.tasks = [task1]
    
    enterprise.projects = [project]
    
    return enterprise

# Main
if __name__ == "__main__":
    enterprise = create_sample_structure()
    manager = ContextManager(enterprise)
    
    # Obtenir le contexte pour une tâche
    project = enterprise.projects[0]
    task = project.tasks[0]
    
    context = manager.get_context_info(
        project_id=project.id,
        task_id=task.id
    )
    
    print("=== Contexte ===")
    print(f"Entreprise: {context['enterprise']['name']}")
    print(f"Projet: {context['project']['name']} ({context['project']['phase']})")
    print(f"Tâche: {context['task']['title']}")
    print(f"Outils phase: {context['phase_tools']}")
    print(f"Outils tâche: {context['task_tools']}")
