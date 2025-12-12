"""
CHE·NU™ — B15-3: ADVANCED REPORTING
- Custom report builder
- Report templates
- Scheduled reports
- Export formats (PDF, Excel, CSV)
- Dashboard widgets
- KPI tracking
"""

from typing import Any, Dict, List, Optional
from datetime import datetime, date, timedelta
from enum import Enum
from dataclasses import dataclass
import uuid
import json

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/reports", tags=["Reporting"])

class ReportType(str, Enum):
    PROJECT_STATUS = "project_status"
    FINANCIAL = "financial"
    TASK_PROGRESS = "task_progress"
    TIME_TRACKING = "time_tracking"
    SAFETY = "safety"
    CUSTOM = "custom"

class ExportFormat(str, Enum):
    PDF = "pdf"
    EXCEL = "xlsx"
    CSV = "csv"
    JSON = "json"

class ScheduleFrequency(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"

class AggregationType(str, Enum):
    SUM = "sum"
    AVG = "avg"
    COUNT = "count"
    MIN = "min"
    MAX = "max"

class ChartType(str, Enum):
    BAR = "bar"
    LINE = "line"
    PIE = "pie"
    DONUT = "donut"
    AREA = "area"
    TABLE = "table"

@dataclass
class ReportColumn:
    id: str
    field: str
    label: str
    type: str  # string, number, date, currency, percentage
    aggregation: Optional[AggregationType]
    format: Optional[str]

@dataclass
class ReportFilter:
    field: str
    operator: str  # eq, neq, gt, lt, gte, lte, contains, in
    value: Any

@dataclass
class ReportDefinition:
    id: str
    name: str
    description: str
    type: ReportType
    data_source: str
    columns: List[ReportColumn]
    filters: List[ReportFilter]
    group_by: List[str]
    sort_by: List[Dict]
    charts: List[Dict]
    created_by: str
    created_at: datetime
    is_template: bool

@dataclass
class ScheduledReport:
    id: str
    report_id: str
    frequency: ScheduleFrequency
    day_of_week: Optional[int]  # 0=Monday for weekly
    day_of_month: Optional[int]  # for monthly
    time: str  # HH:MM
    recipients: List[str]
    format: ExportFormat
    active: bool
    last_run: Optional[datetime]
    next_run: datetime

@dataclass
class ReportExecution:
    id: str
    report_id: str
    started_at: datetime
    completed_at: Optional[datetime]
    status: str  # running, completed, failed
    format: ExportFormat
    file_url: Optional[str]
    row_count: int
    error: Optional[str]

class ReportTemplates:
    """Predefined report templates."""
    
    TEMPLATES = {
        "project_overview": {
            "name": "Vue d'ensemble projet",
            "type": ReportType.PROJECT_STATUS,
            "data_source": "projects",
            "columns": [
                {"field": "name", "label": "Projet", "type": "string"},
                {"field": "client_name", "label": "Client", "type": "string"},
                {"field": "status", "label": "Statut", "type": "string"},
                {"field": "progress", "label": "Avancement", "type": "percentage"},
                {"field": "budget", "label": "Budget", "type": "currency"},
                {"field": "spent", "label": "Dépensé", "type": "currency"},
                {"field": "end_date", "label": "Date fin", "type": "date"},
            ],
            "charts": [
                {"type": "pie", "field": "status", "title": "Répartition par statut"},
                {"type": "bar", "field": "progress", "title": "Avancement par projet"},
            ],
        },
        "financial_summary": {
            "name": "Sommaire financier",
            "type": ReportType.FINANCIAL,
            "data_source": "invoices",
            "columns": [
                {"field": "project_name", "label": "Projet", "type": "string"},
                {"field": "invoiced", "label": "Facturé", "type": "currency", "aggregation": "sum"},
                {"field": "paid", "label": "Payé", "type": "currency", "aggregation": "sum"},
                {"field": "outstanding", "label": "En souffrance", "type": "currency", "aggregation": "sum"},
                {"field": "retainage", "label": "Retenues", "type": "currency", "aggregation": "sum"},
            ],
            "charts": [
                {"type": "bar", "fields": ["invoiced", "paid"], "title": "Facturé vs Payé"},
                {"type": "line", "field": "invoiced", "group_by": "month", "title": "Revenus mensuels"},
            ],
        },
        "task_productivity": {
            "name": "Productivité des tâches",
            "type": ReportType.TASK_PROGRESS,
            "data_source": "tasks",
            "columns": [
                {"field": "assignee", "label": "Assigné à", "type": "string"},
                {"field": "total", "label": "Total tâches", "type": "number", "aggregation": "count"},
                {"field": "completed", "label": "Complétées", "type": "number", "aggregation": "count"},
                {"field": "on_time", "label": "À temps", "type": "percentage"},
                {"field": "avg_duration", "label": "Durée moy.", "type": "number", "aggregation": "avg"},
            ],
            "group_by": ["assignee"],
        },
        "time_tracking": {
            "name": "Suivi du temps",
            "type": ReportType.TIME_TRACKING,
            "data_source": "time_entries",
            "columns": [
                {"field": "employee", "label": "Employé", "type": "string"},
                {"field": "project", "label": "Projet", "type": "string"},
                {"field": "hours", "label": "Heures", "type": "number", "aggregation": "sum"},
                {"field": "billable_hours", "label": "Facturable", "type": "number", "aggregation": "sum"},
                {"field": "rate", "label": "Taux", "type": "currency"},
                {"field": "amount", "label": "Montant", "type": "currency", "aggregation": "sum"},
            ],
        },
        "safety_compliance": {
            "name": "Conformité sécurité",
            "type": ReportType.SAFETY,
            "data_source": "safety_checklists",
            "columns": [
                {"field": "project", "label": "Projet", "type": "string"},
                {"field": "checklist_type", "label": "Type", "type": "string"},
                {"field": "completion_rate", "label": "Taux complétion", "type": "percentage"},
                {"field": "incidents", "label": "Incidents", "type": "number"},
                {"field": "last_inspection", "label": "Dernière inspection", "type": "date"},
            ],
        },
    }
    
    @classmethod
    def get_template(cls, template_id: str) -> Optional[Dict]:
        return cls.TEMPLATES.get(template_id)
    
    @classmethod
    def list_templates(cls) -> List[Dict]:
        return [{"id": k, "name": v["name"], "type": v["type"].value} for k, v in cls.TEMPLATES.items()]

class ReportBuilder:
    """Custom report builder."""
    
    _reports: Dict[str, ReportDefinition] = {}
    _schedules: Dict[str, ScheduledReport] = {}
    _executions: List[ReportExecution] = []
    
    @classmethod
    async def create_report(cls, name: str, report_type: ReportType, config: Dict, user_id: str) -> ReportDefinition:
        """Create a custom report definition."""
        
        columns = [ReportColumn(f"col_{i}", c["field"], c.get("label", c["field"]), 
                                c.get("type", "string"), c.get("aggregation"), c.get("format"))
                   for i, c in enumerate(config.get("columns", []))]
        
        filters = [ReportFilter(f["field"], f["operator"], f["value"]) 
                   for f in config.get("filters", [])]
        
        report = ReportDefinition(
            id=f"rpt_{uuid.uuid4().hex[:8]}",
            name=name,
            description=config.get("description", ""),
            type=report_type,
            data_source=config.get("data_source", "projects"),
            columns=columns,
            filters=filters,
            group_by=config.get("group_by", []),
            sort_by=config.get("sort_by", []),
            charts=config.get("charts", []),
            created_by=user_id,
            created_at=datetime.utcnow(),
            is_template=config.get("is_template", False),
        )
        
        cls._reports[report.id] = report
        return report
    
    @classmethod
    async def create_from_template(cls, template_id: str, name: str, user_id: str) -> ReportDefinition:
        """Create report from template."""
        template = ReportTemplates.get_template(template_id)
        if not template:
            raise HTTPException(404, "Template not found")
        
        return await cls.create_report(name, template["type"], template, user_id)
    
    @classmethod
    async def run_report(cls, report_id: str, filters: Dict = None, format: ExportFormat = ExportFormat.JSON) -> ReportExecution:
        """Execute a report."""
        report = cls._reports.get(report_id)
        if not report:
            raise HTTPException(404, "Report not found")
        
        execution = ReportExecution(
            id=f"exec_{uuid.uuid4().hex[:8]}",
            report_id=report_id,
            started_at=datetime.utcnow(),
            completed_at=None,
            status="running",
            format=format,
            file_url=None,
            row_count=0,
            error=None,
        )
        cls._executions.append(execution)
        
        # Simulate report generation
        data = await cls._generate_report_data(report, filters)
        
        execution.completed_at = datetime.utcnow()
        execution.status = "completed"
        execution.row_count = len(data.get("rows", []))
        execution.file_url = f"/reports/downloads/{execution.id}.{format.value}"
        
        return execution
    
    @classmethod
    async def _generate_report_data(cls, report: ReportDefinition, filters: Dict = None) -> Dict:
        """Generate report data (mock)."""
        
        # Mock data based on report type
        mock_data = {
            ReportType.PROJECT_STATUS: [
                {"name": "Maison Dupont", "client_name": "Jean Dupont", "status": "En cours", "progress": 65, "budget": 450000, "spent": 292500},
                {"name": "Condo Laval", "client_name": "Marie Martin", "status": "Planification", "progress": 10, "budget": 1200000, "spent": 50000},
                {"name": "Réno Tremblay", "client_name": "Pierre Tremblay", "status": "Complété", "progress": 100, "budget": 85000, "spent": 82000},
            ],
            ReportType.FINANCIAL: [
                {"project_name": "Maison Dupont", "invoiced": 302250, "paid": 280000, "outstanding": 22250, "retainage": 30225},
                {"project_name": "Condo Laval", "invoiced": 120000, "paid": 120000, "outstanding": 0, "retainage": 12000},
            ],
            ReportType.TASK_PROGRESS: [
                {"assignee": "Pierre Gagnon", "total": 45, "completed": 38, "on_time": 89, "avg_duration": 4.2},
                {"assignee": "Marie Lavoie", "total": 32, "completed": 30, "on_time": 94, "avg_duration": 3.8},
            ],
        }
        
        rows = mock_data.get(report.type, [])
        
        # Calculate totals if aggregations
        totals = {}
        for col in report.columns:
            if col.aggregation:
                values = [r.get(col.field, 0) for r in rows]
                if col.aggregation == AggregationType.SUM:
                    totals[col.field] = sum(values)
                elif col.aggregation == AggregationType.AVG:
                    totals[col.field] = sum(values) / len(values) if values else 0
                elif col.aggregation == AggregationType.COUNT:
                    totals[col.field] = len(values)
        
        return {"rows": rows, "totals": totals, "generated_at": datetime.utcnow().isoformat()}
    
    @classmethod
    async def schedule_report(cls, report_id: str, frequency: ScheduleFrequency, 
                             time: str, recipients: List[str], format: ExportFormat) -> ScheduledReport:
        """Schedule a recurring report."""
        
        now = datetime.utcnow()
        
        # Calculate next run
        if frequency == ScheduleFrequency.DAILY:
            next_run = now.replace(hour=int(time.split(":")[0]), minute=int(time.split(":")[1])) + timedelta(days=1)
        elif frequency == ScheduleFrequency.WEEKLY:
            next_run = now + timedelta(days=(7 - now.weekday()))
        else:
            next_run = now + timedelta(days=30)
        
        schedule = ScheduledReport(
            id=f"sched_{uuid.uuid4().hex[:8]}",
            report_id=report_id,
            frequency=frequency,
            day_of_week=0 if frequency == ScheduleFrequency.WEEKLY else None,
            day_of_month=1 if frequency == ScheduleFrequency.MONTHLY else None,
            time=time,
            recipients=recipients,
            format=format,
            active=True,
            last_run=None,
            next_run=next_run,
        )
        
        cls._schedules[schedule.id] = schedule
        return schedule

class DashboardWidgets:
    """Dashboard widget data."""
    
    @classmethod
    async def get_kpis(cls, project_id: Optional[str] = None) -> Dict:
        """Get KPI summary."""
        return {
            "revenue_mtd": 125000,
            "revenue_ytd": 1450000,
            "projects_active": 5,
            "tasks_completed_this_week": 23,
            "invoices_outstanding": 45000,
            "avg_project_margin": 18.5,
            "safety_score": 96,
            "client_satisfaction": 4.7,
        }
    
    @classmethod
    async def get_chart_data(cls, chart_type: str, period: str = "month") -> Dict:
        """Get chart data for dashboard."""
        
        charts = {
            "revenue_trend": {
                "type": "line",
                "labels": ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
                "datasets": [
                    {"label": "Revenus", "data": [95000, 120000, 135000, 110000, 145000, 125000]},
                    {"label": "Coûts", "data": [75000, 95000, 105000, 88000, 115000, 100000]},
                ],
            },
            "project_status": {
                "type": "pie",
                "labels": ["En cours", "Planification", "Complété", "En pause"],
                "data": [5, 3, 12, 1],
            },
            "task_completion": {
                "type": "bar",
                "labels": ["Lun", "Mar", "Mer", "Jeu", "Ven"],
                "data": [8, 12, 6, 15, 9],
            },
        }
        
        return charts.get(chart_type, {"error": "Unknown chart"})

# API Endpoints
@router.get("/templates")
async def list_templates():
    """List report templates."""
    return {"templates": ReportTemplates.list_templates()}

@router.get("/templates/{template_id}")
async def get_template(template_id: str):
    """Get template details."""
    template = ReportTemplates.get_template(template_id)
    if not template:
        raise HTTPException(404, "Template not found")
    return template

@router.post("/")
async def create_report(name: str, report_type: ReportType, config: Dict[str, Any]):
    """Create custom report."""
    report = await ReportBuilder.create_report(name, report_type, config, "user_1")
    return {"id": report.id, "name": report.name}

@router.post("/from-template/{template_id}")
async def create_from_template(template_id: str, name: str):
    """Create report from template."""
    report = await ReportBuilder.create_from_template(template_id, name, "user_1")
    return {"id": report.id, "name": report.name}

@router.post("/{report_id}/run")
async def run_report(report_id: str, format: ExportFormat = ExportFormat.JSON, filters: Dict = None):
    """Run a report."""
    execution = await ReportBuilder.run_report(report_id, filters, format)
    return {"execution_id": execution.id, "status": execution.status, "file_url": execution.file_url}

@router.post("/{report_id}/schedule")
async def schedule_report(report_id: str, frequency: ScheduleFrequency, time: str, 
                         recipients: List[str], format: ExportFormat = ExportFormat.PDF):
    """Schedule recurring report."""
    schedule = await ReportBuilder.schedule_report(report_id, frequency, time, recipients, format)
    return {"schedule_id": schedule.id, "next_run": schedule.next_run.isoformat()}

@router.get("/dashboard/kpis")
async def get_dashboard_kpis(project_id: Optional[str] = None):
    """Get dashboard KPIs."""
    return await DashboardWidgets.get_kpis(project_id)

@router.get("/dashboard/charts/{chart_type}")
async def get_chart_data(chart_type: str, period: str = "month"):
    """Get chart data."""
    return await DashboardWidgets.get_chart_data(chart_type, period)
