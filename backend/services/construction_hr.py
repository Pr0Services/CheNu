"""
CHE·NU v6.0 - Construction & HR Integrations
═══════════════════════════════════════════════════════════════════════════════
Intégrations spécialisées:

CONSTRUCTION:
- Procore (gestion de projets)
- Autodesk (BIM/CAD)
- PlanGrid (plans)
- BuilderTrend
- CoConstruct

RESSOURCES HUMAINES:
- BambooHR
- Gusto (paie US/CA)
- ADP
- Deputy (planification)
- Homebase

Author: CHE·NU Team
Version: 6.0
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime, date, time, timedelta
from decimal import Decimal
from enum import Enum
import logging
import aiohttp
import json

logger = logging.getLogger("CHE·NU.Integrations.ConstructionHR")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS - CONSTRUCTION
# ═══════════════════════════════════════════════════════════════════════════════

class ProjectStatus(Enum):
    PLANNING = "planning"
    APPROVED = "approved"
    IN_PROGRESS = "in_progress"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class RFIStatus(Enum):
    DRAFT = "draft"
    OPEN = "open"
    PENDING = "pending"
    ANSWERED = "answered"
    CLOSED = "closed"


class SubmittalStatus(Enum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    APPROVED_AS_NOTED = "approved_as_noted"
    REVISE_RESUBMIT = "revise_resubmit"
    REJECTED = "rejected"


class DailyLogType(Enum):
    GENERAL = "general"
    SAFETY = "safety"
    WEATHER = "weather"
    MANPOWER = "manpower"
    EQUIPMENT = "equipment"
    DELIVERY = "delivery"
    VISITOR = "visitor"


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS - HR
# ═══════════════════════════════════════════════════════════════════════════════

class EmployeeStatus(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TERMINATED = "terminated"
    ON_LEAVE = "on_leave"
    PROBATION = "probation"


class EmploymentType(Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    TEMPORARY = "temporary"
    INTERN = "intern"


class TimeOffType(Enum):
    VACATION = "vacation"
    SICK = "sick"
    PERSONAL = "personal"
    BEREAVEMENT = "bereavement"
    JURY_DUTY = "jury_duty"
    PARENTAL = "parental"
    UNPAID = "unpaid"


class PayrollStatus(Enum):
    DRAFT = "draft"
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES - CONSTRUCTION
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class ConstructionProject:
    """Projet de construction."""
    id: str
    name: str
    code: Optional[str] = None
    status: ProjectStatus = ProjectStatus.PLANNING
    address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    start_date: Optional[date] = None
    estimated_end_date: Optional[date] = None
    actual_end_date: Optional[date] = None
    budget: Decimal = Decimal("0")
    spent: Decimal = Decimal("0")
    progress_percent: float = 0.0
    project_manager: Optional[str] = None
    client_name: Optional[str] = None


@dataclass
class RFI:
    """Request for Information."""
    id: str
    number: str
    project_id: str
    subject: str
    question: str
    status: RFIStatus = RFIStatus.OPEN
    priority: str = "normal"
    due_date: Optional[date] = None
    assignee_id: Optional[str] = None
    assignee_name: Optional[str] = None
    response: Optional[str] = None
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    responded_at: Optional[datetime] = None


@dataclass
class Submittal:
    """Soumission (matériaux, équipements)."""
    id: str
    number: str
    project_id: str
    title: str
    description: Optional[str] = None
    status: SubmittalStatus = SubmittalStatus.DRAFT
    spec_section: Optional[str] = None
    due_date: Optional[date] = None
    submitted_by: Optional[str] = None
    reviewer_id: Optional[str] = None
    attachments: List[str] = field(default_factory=list)
    created_at: Optional[datetime] = None


@dataclass
class DailyLog:
    """Journal de chantier."""
    id: str
    project_id: str
    log_date: date
    log_type: DailyLogType = DailyLogType.GENERAL
    weather: Optional[Dict[str, Any]] = None
    temperature_high: Optional[float] = None
    temperature_low: Optional[float] = None
    notes: Optional[str] = None
    manpower: List[Dict[str, Any]] = field(default_factory=list)
    equipment: List[Dict[str, Any]] = field(default_factory=list)
    deliveries: List[Dict[str, Any]] = field(default_factory=list)
    safety_issues: List[str] = field(default_factory=list)
    photos: List[str] = field(default_factory=list)
    created_by: Optional[str] = None


@dataclass
class ChangeOrder:
    """Ordre de changement."""
    id: str
    number: str
    project_id: str
    title: str
    description: Optional[str] = None
    amount: Decimal = Decimal("0")
    status: str = "pending"
    requested_by: Optional[str] = None
    approved_by: Optional[str] = None
    created_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES - HR
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class Employee:
    """Employé."""
    id: str
    employee_number: Optional[str] = None
    first_name: str = ""
    last_name: str = ""
    email: Optional[str] = None
    phone: Optional[str] = None
    status: EmployeeStatus = EmployeeStatus.ACTIVE
    employment_type: EmploymentType = EmploymentType.FULL_TIME
    department: Optional[str] = None
    job_title: Optional[str] = None
    manager_id: Optional[str] = None
    hire_date: Optional[date] = None
    termination_date: Optional[date] = None
    salary: Decimal = Decimal("0")
    hourly_rate: Decimal = Decimal("0")
    address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    sin: Optional[str] = None  # Social Insurance Number (encrypted)
    emergency_contact: Optional[Dict[str, str]] = None
    
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()


@dataclass
class TimeEntry:
    """Entrée de temps."""
    id: str
    employee_id: str
    date: date
    hours_worked: Decimal
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    break_minutes: int = 0
    project_id: Optional[str] = None
    task_description: Optional[str] = None
    is_overtime: bool = False
    is_approved: bool = False
    approved_by: Optional[str] = None


@dataclass
class TimeOffRequest:
    """Demande de congé."""
    id: str
    employee_id: str
    employee_name: Optional[str] = None
    type: TimeOffType
    start_date: date
    end_date: date
    hours: Decimal = Decimal("0")
    status: str = "pending"  # pending, approved, denied, cancelled
    reason: Optional[str] = None
    approved_by: Optional[str] = None
    created_at: Optional[datetime] = None


@dataclass
class PayrollRun:
    """Exécution de paie."""
    id: str
    pay_period_start: date
    pay_period_end: date
    pay_date: date
    status: PayrollStatus = PayrollStatus.DRAFT
    total_gross: Decimal = Decimal("0")
    total_deductions: Decimal = Decimal("0")
    total_net: Decimal = Decimal("0")
    employee_count: int = 0
    created_at: Optional[datetime] = None
    processed_at: Optional[datetime] = None


@dataclass
class Paycheck:
    """Chèque de paie."""
    id: str
    payroll_run_id: str
    employee_id: str
    employee_name: str
    gross_pay: Decimal
    deductions: Dict[str, Decimal] = field(default_factory=dict)
    net_pay: Decimal = Decimal("0")
    hours_worked: Decimal = Decimal("0")
    overtime_hours: Decimal = Decimal("0")


# ═══════════════════════════════════════════════════════════════════════════════
# BASE CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class BaseClient:
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
# PROCORE INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class ProcoreClient(BaseClient):
    """
    🏗️ Client Procore
    
    Fonctionnalités:
    - Projets et entreprises
    - RFIs et Submittals
    - Daily Logs
    - Budget et Change Orders
    - Documents et Photos
    """
    
    BASE_URL = "https://api.procore.com/rest/v1.0"
    
    def __init__(self, access_token: str, company_id: int):
        super().__init__(access_token)
        self.company_id = company_id
    
    # --- Projects ---
    async def list_projects(self) -> List[ConstructionProject]:
        """Liste les projets."""
        async with self.session.get(
            f"{self.BASE_URL}/projects",
            params={"company_id": self.company_id}
        ) as resp:
            data = await resp.json()
            
            return [
                ConstructionProject(
                    id=str(p.get("id")),
                    name=p.get("name", ""),
                    code=p.get("project_number"),
                    status=ProjectStatus(p.get("stage", "planning").lower().replace(" ", "_")),
                    address=p.get("address"),
                    city=p.get("city"),
                    province=p.get("state_code"),
                    start_date=datetime.strptime(p["start_date"], "%Y-%m-%d").date() if p.get("start_date") else None,
                    estimated_end_date=datetime.strptime(p["finish_date"], "%Y-%m-%d").date() if p.get("finish_date") else None
                )
                for p in data
            ]
    
    async def get_project(self, project_id: int) -> ConstructionProject:
        """Récupère un projet."""
        async with self.session.get(
            f"{self.BASE_URL}/projects/{project_id}",
            params={"company_id": self.company_id}
        ) as resp:
            p = await resp.json()
            
            return ConstructionProject(
                id=str(p.get("id")),
                name=p.get("name", ""),
                code=p.get("project_number"),
                status=ProjectStatus(p.get("stage", "planning").lower().replace(" ", "_")),
                address=p.get("address"),
                city=p.get("city"),
                province=p.get("state_code")
            )
    
    # --- RFIs ---
    async def list_rfis(self, project_id: int) -> List[RFI]:
        """Liste les RFIs."""
        async with self.session.get(
            f"{self.BASE_URL}/projects/{project_id}/rfis"
        ) as resp:
            data = await resp.json()
            
            return [
                RFI(
                    id=str(r.get("id")),
                    number=r.get("number", ""),
                    project_id=str(project_id),
                    subject=r.get("subject", ""),
                    question=r.get("question", ""),
                    status=RFIStatus(r.get("status", "open").lower()),
                    priority=r.get("priority", "normal"),
                    due_date=datetime.strptime(r["due_date"], "%Y-%m-%d").date() if r.get("due_date") else None,
                    assignee_id=str(r.get("assignee", {}).get("id")) if r.get("assignee") else None,
                    assignee_name=r.get("assignee", {}).get("name"),
                    response=r.get("official_response")
                )
                for r in data
            ]
    
    async def create_rfi(
        self,
        project_id: int,
        subject: str,
        question: str,
        assignee_id: int = None,
        due_date: date = None
    ) -> RFI:
        """Crée un RFI."""
        payload = {
            "rfi": {
                "subject": subject,
                "question": question
            }
        }
        
        if assignee_id:
            payload["rfi"]["assignee_id"] = assignee_id
        if due_date:
            payload["rfi"]["due_date"] = due_date.isoformat()
        
        async with self.session.post(
            f"{self.BASE_URL}/projects/{project_id}/rfis",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return RFI(
                id=str(data.get("id")),
                number=data.get("number", ""),
                project_id=str(project_id),
                subject=subject,
                question=question,
                status=RFIStatus.OPEN
            )
    
    # --- Daily Logs ---
    async def list_daily_logs(
        self,
        project_id: int,
        start_date: date = None,
        end_date: date = None
    ) -> List[DailyLog]:
        """Liste les daily logs."""
        params = {}
        if start_date:
            params["filters[start_date]"] = start_date.isoformat()
        if end_date:
            params["filters[end_date]"] = end_date.isoformat()
        
        async with self.session.get(
            f"{self.BASE_URL}/projects/{project_id}/daily_logs",
            params=params
        ) as resp:
            data = await resp.json()
            
            return [
                DailyLog(
                    id=str(d.get("id")),
                    project_id=str(project_id),
                    log_date=datetime.strptime(d["log_date"], "%Y-%m-%d").date() if d.get("log_date") else date.today(),
                    notes=d.get("notes")
                )
                for d in data
            ]
    
    async def create_daily_log(
        self,
        project_id: int,
        log_date: date,
        notes: str = None,
        weather: Dict = None,
        manpower: List[Dict] = None
    ) -> DailyLog:
        """Crée un daily log."""
        payload = {
            "daily_log": {
                "log_date": log_date.isoformat(),
                "notes": notes
            }
        }
        
        async with self.session.post(
            f"{self.BASE_URL}/projects/{project_id}/daily_logs",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return DailyLog(
                id=str(data.get("id")),
                project_id=str(project_id),
                log_date=log_date,
                notes=notes
            )
    
    # --- Change Orders ---
    async def list_change_orders(self, project_id: int) -> List[ChangeOrder]:
        """Liste les change orders."""
        async with self.session.get(
            f"{self.BASE_URL}/projects/{project_id}/change_order_requests"
        ) as resp:
            data = await resp.json()
            
            return [
                ChangeOrder(
                    id=str(c.get("id")),
                    number=c.get("number", ""),
                    project_id=str(project_id),
                    title=c.get("title", ""),
                    description=c.get("description"),
                    amount=Decimal(str(c.get("amount", 0))),
                    status=c.get("status", "pending")
                )
                for c in data
            ]
    
    # --- Budget ---
    async def get_budget(self, project_id: int) -> Dict[str, Any]:
        """Récupère le budget du projet."""
        async with self.session.get(
            f"{self.BASE_URL}/projects/{project_id}/budget_views"
        ) as resp:
            return await resp.json()


# ═══════════════════════════════════════════════════════════════════════════════
# AUTODESK INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class AutodeskClient(BaseClient):
    """
    📐 Client Autodesk (BIM 360 / ACC)
    
    Fonctionnalités:
    - Projets et dossiers
    - Modèles BIM
    - Issues
    - Documents
    """
    
    BASE_URL = "https://developer.api.autodesk.com"
    
    # --- Hubs & Projects ---
    async def list_hubs(self) -> List[Dict[str, Any]]:
        """Liste les hubs (comptes)."""
        async with self.session.get(
            f"{self.BASE_URL}/project/v1/hubs"
        ) as resp:
            data = await resp.json()
            return data.get("data", [])
    
    async def list_projects(self, hub_id: str) -> List[Dict[str, Any]]:
        """Liste les projets d'un hub."""
        async with self.session.get(
            f"{self.BASE_URL}/project/v1/hubs/{hub_id}/projects"
        ) as resp:
            data = await resp.json()
            return data.get("data", [])
    
    # --- Folders & Items ---
    async def get_project_folders(
        self,
        hub_id: str,
        project_id: str
    ) -> List[Dict[str, Any]]:
        """Liste les dossiers racine d'un projet."""
        async with self.session.get(
            f"{self.BASE_URL}/project/v1/hubs/{hub_id}/projects/{project_id}/topFolders"
        ) as resp:
            data = await resp.json()
            return data.get("data", [])
    
    async def get_folder_contents(
        self,
        project_id: str,
        folder_id: str
    ) -> List[Dict[str, Any]]:
        """Liste le contenu d'un dossier."""
        async with self.session.get(
            f"{self.BASE_URL}/data/v1/projects/{project_id}/folders/{folder_id}/contents"
        ) as resp:
            data = await resp.json()
            return data.get("data", [])
    
    # --- Issues ---
    async def list_issues(
        self,
        project_id: str,
        container_id: str
    ) -> List[Dict[str, Any]]:
        """Liste les issues."""
        async with self.session.get(
            f"{self.BASE_URL}/issues/v1/containers/{container_id}/quality-issues",
            params={"filter[project_id]": project_id}
        ) as resp:
            data = await resp.json()
            return data.get("data", [])
    
    async def create_issue(
        self,
        container_id: str,
        title: str,
        description: str = None,
        status: str = "open",
        assignee_id: str = None
    ) -> Dict[str, Any]:
        """Crée une issue."""
        payload = {
            "data": {
                "type": "quality-issues",
                "attributes": {
                    "title": title,
                    "description": description,
                    "status": status
                }
            }
        }
        
        if assignee_id:
            payload["data"]["attributes"]["assigned_to"] = assignee_id
        
        async with self.session.post(
            f"{self.BASE_URL}/issues/v1/containers/{container_id}/quality-issues",
            json=payload
        ) as resp:
            return await resp.json()
    
    # --- Model Derivative (pour extraire les métadonnées BIM) ---
    async def get_model_metadata(self, urn: str) -> Dict[str, Any]:
        """Récupère les métadonnées d'un modèle."""
        import base64
        encoded_urn = base64.urlsafe_b64encode(urn.encode()).decode().rstrip("=")
        
        async with self.session.get(
            f"{self.BASE_URL}/modelderivative/v2/designdata/{encoded_urn}/metadata"
        ) as resp:
            return await resp.json()


# ═══════════════════════════════════════════════════════════════════════════════
# BAMBOOHR INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class BambooHRClient(BaseClient):
    """
    🎋 Client BambooHR
    
    Fonctionnalités:
    - Employés
    - Time Off
    - Reports
    - Custom Fields
    """
    
    def __init__(self, api_key: str, company_domain: str):
        super().__init__(api_key)
        self.company_domain = company_domain
        self.base_url = f"https://api.bamboohr.com/api/gateway.php/{company_domain}/v1"
    
    def _get_headers(self) -> Dict[str, str]:
        import base64
        auth = base64.b64encode(f"{self.access_token}:x".encode()).decode()
        return {
            "Authorization": f"Basic {auth}",
            "Accept": "application/json"
        }
    
    # --- Employees ---
    async def list_employees(self) -> List[Employee]:
        """Liste les employés."""
        async with self.session.get(
            f"{self.base_url}/employees/directory"
        ) as resp:
            data = await resp.json()
            
            return [
                Employee(
                    id=str(e.get("id")),
                    first_name=e.get("firstName", ""),
                    last_name=e.get("lastName", ""),
                    email=e.get("workEmail"),
                    phone=e.get("workPhone"),
                    department=e.get("department"),
                    job_title=e.get("jobTitle"),
                    status=EmployeeStatus.ACTIVE if e.get("status") == "Active" else EmployeeStatus.INACTIVE
                )
                for e in data.get("employees", [])
            ]
    
    async def get_employee(self, employee_id: str, fields: List[str] = None) -> Employee:
        """Récupère un employé."""
        default_fields = [
            "firstName", "lastName", "workEmail", "workPhone",
            "department", "jobTitle", "hireDate", "status",
            "employeeNumber", "supervisor", "address1", "city",
            "state", "zipCode"
        ]
        
        fields_str = ",".join(fields or default_fields)
        
        async with self.session.get(
            f"{self.base_url}/employees/{employee_id}",
            params={"fields": fields_str}
        ) as resp:
            e = await resp.json()
            
            return Employee(
                id=employee_id,
                employee_number=e.get("employeeNumber"),
                first_name=e.get("firstName", ""),
                last_name=e.get("lastName", ""),
                email=e.get("workEmail"),
                phone=e.get("workPhone"),
                department=e.get("department"),
                job_title=e.get("jobTitle"),
                hire_date=datetime.strptime(e["hireDate"], "%Y-%m-%d").date() if e.get("hireDate") else None,
                address=e.get("address1"),
                city=e.get("city"),
                province=e.get("state"),
                postal_code=e.get("zipCode")
            )
    
    async def create_employee(self, employee: Employee) -> Employee:
        """Crée un employé."""
        payload = {
            "firstName": employee.first_name,
            "lastName": employee.last_name,
            "workEmail": employee.email,
            "department": employee.department,
            "jobTitle": employee.job_title,
            "hireDate": employee.hire_date.isoformat() if employee.hire_date else None
        }
        
        async with self.session.post(
            f"{self.base_url}/employees",
            json=payload
        ) as resp:
            # BambooHR returns location header with new ID
            location = resp.headers.get("Location", "")
            employee.id = location.split("/")[-1] if location else ""
            return employee
    
    # --- Time Off ---
    async def list_time_off_requests(
        self,
        start_date: date,
        end_date: date,
        employee_id: str = None,
        status: str = None
    ) -> List[TimeOffRequest]:
        """Liste les demandes de congé."""
        params = {
            "start": start_date.isoformat(),
            "end": end_date.isoformat()
        }
        
        if employee_id:
            params["employeeId"] = employee_id
        if status:
            params["status"] = status
        
        async with self.session.get(
            f"{self.base_url}/time_off/requests",
            params=params
        ) as resp:
            data = await resp.json()
            
            type_map = {
                "vacation": TimeOffType.VACATION,
                "sick": TimeOffType.SICK,
                "personal": TimeOffType.PERSONAL
            }
            
            return [
                TimeOffRequest(
                    id=str(r.get("id")),
                    employee_id=str(r.get("employeeId")),
                    employee_name=r.get("name"),
                    type=type_map.get(r.get("type", {}).get("name", "").lower(), TimeOffType.VACATION),
                    start_date=datetime.strptime(r["start"], "%Y-%m-%d").date(),
                    end_date=datetime.strptime(r["end"], "%Y-%m-%d").date(),
                    hours=Decimal(str(r.get("amount", {}).get("amount", 0))),
                    status=r.get("status", {}).get("status", "pending")
                )
                for r in data
            ]
    
    async def approve_time_off(self, request_id: str, note: str = None) -> bool:
        """Approuve une demande de congé."""
        payload = {"status": "approved"}
        if note:
            payload["note"] = note
        
        async with self.session.put(
            f"{self.base_url}/time_off/requests/{request_id}/status",
            json=payload
        ) as resp:
            return resp.status == 200
    
    # --- Reports ---
    async def get_report(self, report_id: str, format: str = "JSON") -> Dict[str, Any]:
        """Récupère un rapport."""
        async with self.session.get(
            f"{self.base_url}/reports/{report_id}",
            params={"format": format}
        ) as resp:
            return await resp.json()


# ═══════════════════════════════════════════════════════════════════════════════
# GUSTO INTEGRATION (Paie Canada/US)
# ═══════════════════════════════════════════════════════════════════════════════

class GustoClient(BaseClient):
    """
    💵 Client Gusto
    
    Fonctionnalités:
    - Employés
    - Paie
    - Benefits
    - Tax documents
    """
    
    BASE_URL = "https://api.gusto.com/v1"
    
    def __init__(self, access_token: str, company_id: str):
        super().__init__(access_token)
        self.company_id = company_id
    
    # --- Company ---
    async def get_company(self) -> Dict[str, Any]:
        """Récupère les infos de l'entreprise."""
        async with self.session.get(
            f"{self.BASE_URL}/companies/{self.company_id}"
        ) as resp:
            return await resp.json()
    
    # --- Employees ---
    async def list_employees(self) -> List[Employee]:
        """Liste les employés."""
        async with self.session.get(
            f"{self.BASE_URL}/companies/{self.company_id}/employees"
        ) as resp:
            data = await resp.json()
            
            return [
                Employee(
                    id=str(e.get("uuid")),
                    first_name=e.get("first_name", ""),
                    last_name=e.get("last_name", ""),
                    email=e.get("email"),
                    status=EmployeeStatus.ACTIVE if not e.get("terminated") else EmployeeStatus.TERMINATED,
                    department=e.get("department"),
                    job_title=e.get("jobs", [{}])[0].get("title") if e.get("jobs") else None
                )
                for e in data
            ]
    
    async def get_employee(self, employee_id: str) -> Employee:
        """Récupère un employé."""
        async with self.session.get(
            f"{self.BASE_URL}/employees/{employee_id}"
        ) as resp:
            e = await resp.json()
            
            return Employee(
                id=employee_id,
                first_name=e.get("first_name", ""),
                last_name=e.get("last_name", ""),
                email=e.get("email"),
                phone=e.get("home_address", {}).get("phone"),
                status=EmployeeStatus.ACTIVE if not e.get("terminated") else EmployeeStatus.TERMINATED,
                hire_date=datetime.strptime(e["date_of_birth"], "%Y-%m-%d").date() if e.get("date_of_birth") else None
            )
    
    # --- Payrolls ---
    async def list_payrolls(
        self,
        start_date: date = None,
        end_date: date = None,
        processed: bool = None
    ) -> List[PayrollRun]:
        """Liste les paies."""
        params = {}
        if start_date:
            params["start_date"] = start_date.isoformat()
        if end_date:
            params["end_date"] = end_date.isoformat()
        if processed is not None:
            params["processed"] = str(processed).lower()
        
        async with self.session.get(
            f"{self.BASE_URL}/companies/{self.company_id}/payrolls",
            params=params
        ) as resp:
            data = await resp.json()
            
            return [
                PayrollRun(
                    id=str(p.get("uuid")),
                    pay_period_start=datetime.strptime(p["pay_period"]["start_date"], "%Y-%m-%d").date(),
                    pay_period_end=datetime.strptime(p["pay_period"]["end_date"], "%Y-%m-%d").date(),
                    pay_date=datetime.strptime(p["check_date"], "%Y-%m-%d").date(),
                    status=PayrollStatus.COMPLETED if p.get("processed") else PayrollStatus.DRAFT,
                    total_gross=Decimal(str(p.get("totals", {}).get("gross_pay", 0))),
                    total_deductions=Decimal(str(p.get("totals", {}).get("employee_taxes", 0))) + Decimal(str(p.get("totals", {}).get("employee_benefits_deductions", 0))),
                    total_net=Decimal(str(p.get("totals", {}).get("net_pay", 0))),
                    employee_count=len(p.get("employee_compensations", []))
                )
                for p in data
            ]
    
    async def get_payroll(self, payroll_id: str) -> Dict[str, Any]:
        """Récupère une paie avec détails."""
        async with self.session.get(
            f"{self.BASE_URL}/companies/{self.company_id}/payrolls/{payroll_id}"
        ) as resp:
            return await resp.json()
    
    async def run_payroll(self, payroll_id: str) -> bool:
        """Exécute une paie."""
        async with self.session.put(
            f"{self.BASE_URL}/companies/{self.company_id}/payrolls/{payroll_id}/submit"
        ) as resp:
            return resp.status == 200
    
    # --- Time Off ---
    async def list_time_off_policies(self) -> List[Dict[str, Any]]:
        """Liste les politiques de congé."""
        async with self.session.get(
            f"{self.BASE_URL}/companies/{self.company_id}/time_off_policies"
        ) as resp:
            return await resp.json()


# ═══════════════════════════════════════════════════════════════════════════════
# DEPUTY INTEGRATION (Planification)
# ═══════════════════════════════════════════════════════════════════════════════

class DeputyClient(BaseClient):
    """
    📅 Client Deputy
    
    Fonctionnalités:
    - Horaires et shifts
    - Pointage
    - Employés
    - Locations
    """
    
    def __init__(self, access_token: str, domain: str):
        super().__init__(access_token)
        self.base_url = f"https://{domain}.na.deputy.com/api/v1"
    
    # --- Employees ---
    async def list_employees(self) -> List[Employee]:
        """Liste les employés."""
        async with self.session.get(
            f"{self.base_url}/resource/Employee"
        ) as resp:
            data = await resp.json()
            
            return [
                Employee(
                    id=str(e.get("Id")),
                    first_name=e.get("FirstName", ""),
                    last_name=e.get("LastName", ""),
                    email=e.get("Email"),
                    phone=e.get("Mobile"),
                    status=EmployeeStatus.ACTIVE if e.get("Active") else EmployeeStatus.INACTIVE
                )
                for e in data
            ]
    
    # --- Shifts/Rosters ---
    async def list_shifts(
        self,
        start_date: date,
        end_date: date,
        employee_id: str = None
    ) -> List[Dict[str, Any]]:
        """Liste les shifts."""
        params = {
            "start": f"{start_date.isoformat()}T00:00:00",
            "end": f"{end_date.isoformat()}T23:59:59"
        }
        
        if employee_id:
            params["employee"] = employee_id
        
        async with self.session.get(
            f"{self.base_url}/resource/Roster",
            params=params
        ) as resp:
            return await resp.json()
    
    async def create_shift(
        self,
        employee_id: str,
        start_time: datetime,
        end_time: datetime,
        area_id: str = None
    ) -> Dict[str, Any]:
        """Crée un shift."""
        payload = {
            "Employee": int(employee_id),
            "StartTime": start_time.timestamp(),
            "EndTime": end_time.timestamp()
        }
        
        if area_id:
            payload["OperationalUnit"] = int(area_id)
        
        async with self.session.post(
            f"{self.base_url}/resource/Roster",
            json=payload
        ) as resp:
            return await resp.json()
    
    # --- Timesheets ---
    async def list_timesheets(
        self,
        start_date: date,
        end_date: date
    ) -> List[TimeEntry]:
        """Liste les feuilles de temps."""
        async with self.session.get(
            f"{self.base_url}/resource/Timesheet",
            params={
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            }
        ) as resp:
            data = await resp.json()
            
            return [
                TimeEntry(
                    id=str(t.get("Id")),
                    employee_id=str(t.get("Employee")),
                    date=datetime.fromtimestamp(t.get("StartTime", 0)).date(),
                    hours_worked=Decimal(str(t.get("TotalTime", 0) / 3600)),
                    start_time=datetime.fromtimestamp(t.get("StartTime", 0)).time() if t.get("StartTime") else None,
                    end_time=datetime.fromtimestamp(t.get("EndTime", 0)).time() if t.get("EndTime") else None,
                    is_approved=t.get("Approved", False)
                )
                for t in data
            ]
    
    async def approve_timesheet(self, timesheet_id: str) -> bool:
        """Approuve une feuille de temps."""
        async with self.session.post(
            f"{self.base_url}/resource/Timesheet/{timesheet_id}/Approve"
        ) as resp:
            return resp.status == 200


# ═══════════════════════════════════════════════════════════════════════════════
# UNIFIED SERVICES
# ═══════════════════════════════════════════════════════════════════════════════

class ConstructionService:
    """🏗️ Service Construction Unifié."""
    
    def __init__(self):
        self._clients: Dict[str, BaseClient] = {}
    
    def register_procore(self, account_id: str, access_token: str, company_id: int):
        self._clients[account_id] = ProcoreClient(access_token, company_id)
    
    def register_autodesk(self, account_id: str, access_token: str):
        self._clients[account_id] = AutodeskClient(access_token)
    
    def get_client(self, account_id: str) -> BaseClient:
        if account_id not in self._clients:
            raise ValueError(f"Account {account_id} not registered")
        return self._clients[account_id]


class HRService:
    """👥 Service RH Unifié."""
    
    def __init__(self):
        self._clients: Dict[str, BaseClient] = {}
    
    def register_bamboohr(self, account_id: str, api_key: str, company_domain: str):
        self._clients[account_id] = BambooHRClient(api_key, company_domain)
    
    def register_gusto(self, account_id: str, access_token: str, company_id: str):
        self._clients[account_id] = GustoClient(access_token, company_id)
    
    def register_deputy(self, account_id: str, access_token: str, domain: str):
        self._clients[account_id] = DeputyClient(access_token, domain)
    
    def get_client(self, account_id: str) -> BaseClient:
        if account_id not in self._clients:
            raise ValueError(f"Account {account_id} not registered")
        return self._clients[account_id]
    
    async def get_workforce_summary(self, account_ids: List[str]) -> Dict[str, Any]:
        """Résumé de la main d'oeuvre."""
        summary = {
            "total_employees": 0,
            "active_employees": 0,
            "by_department": {},
            "by_status": {}
        }
        
        for account_id in account_ids:
            client = self.get_client(account_id)
            async with client:
                employees = await client.list_employees()
                
                for emp in employees:
                    summary["total_employees"] += 1
                    if emp.status == EmployeeStatus.ACTIVE:
                        summary["active_employees"] += 1
                    
                    dept = emp.department or "Non assigné"
                    summary["by_department"][dept] = summary["by_department"].get(dept, 0) + 1
                    
                    status = emp.status.value
                    summary["by_status"][status] = summary["by_status"].get(status, 0) + 1
        
        return summary


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORIES
# ═══════════════════════════════════════════════════════════════════════════════

def create_construction_service() -> ConstructionService:
    return ConstructionService()

def create_hr_service() -> HRService:
    return HRService()
