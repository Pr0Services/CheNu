"""
═══════════════════════════════════════════════════════════════════════════════
CHE·NU™ — BATCH 14: WEATHER + SAFETY COMPLIANCE
═══════════════════════════════════════════════════════════════════════════════

Features:
- WEATHER-01: Real-time weather data
- WEATHER-02: 14-day forecasts
- WEATHER-03: Construction-specific alerts
- WEATHER-04: Work condition scoring
- SAFETY-01: CCQ compliance checklists
- SAFETY-02: CNESST regulations
- SAFETY-03: Incident reporting
- SAFETY-04: Safety training tracking
- SAFETY-05: Equipment inspection logs
- SAFETY-06: Site safety audits

═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta, date
from enum import Enum
from dataclasses import dataclass, field
import uuid
import random
import asyncio
import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

logger = logging.getLogger("CHENU.Safety")
router = APIRouter(prefix="/api/v1/safety", tags=["Weather & Safety"])

# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class WeatherCondition(str, Enum):
    SUNNY = "sunny"
    PARTLY_CLOUDY = "partly_cloudy"
    CLOUDY = "cloudy"
    RAIN = "rain"
    HEAVY_RAIN = "heavy_rain"
    THUNDERSTORM = "thunderstorm"
    SNOW = "snow"
    HEAVY_SNOW = "heavy_snow"
    FREEZING_RAIN = "freezing_rain"
    FOG = "fog"
    WIND = "high_wind"

class AlertSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    WATCH = "watch"
    ADVISORY = "advisory"
    CRITICAL = "critical"

class WorkCondition(str, Enum):
    EXCELLENT = "excellent"
    GOOD = "good"
    FAIR = "fair"
    POOR = "poor"
    UNSAFE = "unsafe"

class ComplianceType(str, Enum):
    CCQ = "ccq"  # Commission de la construction du Québec
    CNESST = "cnesst"  # Commission des normes, de l'équité, de la santé et de la sécurité du travail
    RBQ = "rbq"  # Régie du bâtiment du Québec
    MUNICIPAL = "municipal"
    FEDERAL = "federal"

class ChecklistStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    NEEDS_REVIEW = "needs_review"

class IncidentSeverity(str, Enum):
    NEAR_MISS = "near_miss"
    MINOR = "minor"
    MODERATE = "moderate"
    SERIOUS = "serious"
    CRITICAL = "critical"
    FATAL = "fatal"

class TrainingStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    EXPIRED = "expired"
    RENEWAL_REQUIRED = "renewal_required"

# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class WeatherData:
    timestamp: datetime
    location: str
    temperature_c: float
    feels_like_c: float
    humidity_percent: int
    wind_speed_kmh: float
    wind_direction: str
    condition: WeatherCondition
    precipitation_mm: float
    uv_index: int
    visibility_km: float

@dataclass
class WeatherForecast:
    date: date
    high_c: float
    low_c: float
    condition: WeatherCondition
    precipitation_chance: int
    precipitation_mm: float
    wind_speed_kmh: float
    work_condition: WorkCondition
    work_score: int  # 0-100

@dataclass
class WeatherAlert:
    id: str
    type: str
    severity: AlertSeverity
    title: str
    description: str
    affected_areas: List[str]
    start_time: datetime
    end_time: datetime
    recommendations: List[str]

@dataclass
class SafetyChecklist:
    id: str
    name: str
    compliance_type: ComplianceType
    project_id: str
    items: List[Dict[str, Any]]
    status: ChecklistStatus
    completed_items: int
    total_items: int
    completed_by: Optional[str]
    completed_at: Optional[datetime]
    next_due: Optional[datetime]
    notes: str

@dataclass
class SafetyIncident:
    id: str
    project_id: str
    date: datetime
    severity: IncidentSeverity
    type: str
    description: str
    location: str
    injured_persons: List[Dict[str, Any]]
    witnesses: List[str]
    root_cause: Optional[str]
    corrective_actions: List[str]
    reported_by: str
    reported_to_cnesst: bool
    cnesst_reference: Optional[str]
    status: str
    attachments: List[str]

@dataclass
class SafetyTraining:
    id: str
    employee_id: str
    employee_name: str
    training_type: str
    provider: str
    completion_date: Optional[datetime]
    expiry_date: Optional[datetime]
    certificate_number: Optional[str]
    status: TrainingStatus
    score: Optional[float]

@dataclass
class EquipmentInspection:
    id: str
    equipment_id: str
    equipment_name: str
    inspection_type: str
    inspector: str
    date: datetime
    passed: bool
    findings: List[Dict[str, Any]]
    next_inspection: datetime
    attachments: List[str]

# ═══════════════════════════════════════════════════════════════════════════════
# REQUEST MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class GetWeatherRequest(BaseModel):
    location: str = "Granby, QC"
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class CreateChecklistRequest(BaseModel):
    name: str
    compliance_type: ComplianceType
    project_id: str
    template_id: Optional[str] = None

class UpdateChecklistRequest(BaseModel):
    item_id: str
    completed: bool
    notes: str = ""
    photos: List[str] = []

class ReportIncidentRequest(BaseModel):
    project_id: str
    severity: IncidentSeverity
    type: str
    description: str
    location: str
    injured_persons: List[Dict[str, Any]] = []
    witnesses: List[str] = []

class AddTrainingRequest(BaseModel):
    employee_id: str
    employee_name: str
    training_type: str
    provider: str
    completion_date: Optional[str] = None
    expiry_date: Optional[str] = None
    certificate_number: Optional[str] = None

class InspectEquipmentRequest(BaseModel):
    equipment_id: str
    equipment_name: str
    inspection_type: str
    findings: List[Dict[str, Any]] = []
    passed: bool = True

# ═══════════════════════════════════════════════════════════════════════════════
# WEATHER SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

class WeatherService:
    """Weather data and forecasting for construction sites."""
    
    # Quebec cities coordinates
    LOCATIONS = {
        "granby": (45.4000, -72.7333),
        "montreal": (45.5017, -73.5673),
        "quebec": (46.8139, -71.2080),
        "laval": (45.6066, -73.7124),
        "sherbrooke": (45.4042, -71.8929),
        "trois-rivieres": (46.3432, -72.5477),
    }
    
    @classmethod
    async def get_current(cls, location: str) -> WeatherData:
        """Get current weather conditions."""
        # In production: Call Environment Canada API or OpenWeatherMap
        
        # Mock weather data for Quebec winter/construction context
        conditions = [
            WeatherCondition.SUNNY, WeatherCondition.PARTLY_CLOUDY,
            WeatherCondition.CLOUDY, WeatherCondition.SNOW,
        ]
        
        temp = random.uniform(-15, 25)  # Quebec temperature range
        
        return WeatherData(
            timestamp=datetime.utcnow(),
            location=location,
            temperature_c=round(temp, 1),
            feels_like_c=round(temp - random.uniform(2, 8), 1),
            humidity_percent=random.randint(40, 85),
            wind_speed_kmh=round(random.uniform(5, 40), 1),
            wind_direction=random.choice(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]),
            condition=random.choice(conditions),
            precipitation_mm=round(random.uniform(0, 15), 1),
            uv_index=random.randint(1, 8),
            visibility_km=round(random.uniform(5, 20), 1),
        )
    
    @classmethod
    async def get_forecast(cls, location: str, days: int = 14) -> List[WeatherForecast]:
        """Get weather forecast."""
        forecasts = []
        base_temp = random.uniform(-10, 20)
        
        for i in range(days):
            forecast_date = date.today() + timedelta(days=i)
            
            # Simulate temperature variation
            high = base_temp + random.uniform(3, 8)
            low = base_temp - random.uniform(3, 8)
            
            # Determine conditions and work score
            precip_chance = random.randint(0, 100)
            wind = random.uniform(5, 50)
            
            if precip_chance > 70 or wind > 40 or high < -20:
                condition = random.choice([WeatherCondition.SNOW, WeatherCondition.RAIN, WeatherCondition.WIND])
                work_condition = WorkCondition.POOR if precip_chance > 80 else WorkCondition.FAIR
                work_score = random.randint(20, 50)
            elif precip_chance > 40 or wind > 25:
                condition = WeatherCondition.CLOUDY
                work_condition = WorkCondition.FAIR
                work_score = random.randint(50, 70)
            else:
                condition = random.choice([WeatherCondition.SUNNY, WeatherCondition.PARTLY_CLOUDY])
                work_condition = WorkCondition.EXCELLENT if high > 10 else WorkCondition.GOOD
                work_score = random.randint(70, 100)
            
            forecasts.append(WeatherForecast(
                date=forecast_date,
                high_c=round(high, 1),
                low_c=round(low, 1),
                condition=condition,
                precipitation_chance=precip_chance,
                precipitation_mm=round(precip_chance / 10, 1) if precip_chance > 30 else 0,
                wind_speed_kmh=round(wind, 1),
                work_condition=work_condition,
                work_score=work_score,
            ))
            
            base_temp += random.uniform(-3, 3)
        
        return forecasts
    
    @classmethod
    async def get_alerts(cls, location: str) -> List[WeatherAlert]:
        """Get active weather alerts."""
        # Mock alerts
        alerts = []
        
        if random.random() > 0.7:
            alerts.append(WeatherAlert(
                id=f"alert_{uuid.uuid4().hex[:8]}",
                type="winter_storm",
                severity=AlertSeverity.WARNING,
                title="Avertissement de tempête hivernale",
                description="15-25 cm de neige attendus. Vents forts possibles.",
                affected_areas=[location, "Région environnante"],
                start_time=datetime.utcnow() + timedelta(hours=12),
                end_time=datetime.utcnow() + timedelta(hours=36),
                recommendations=[
                    "Reporter les travaux en hauteur",
                    "Sécuriser les matériaux sur le chantier",
                    "Prévoir équipement de déneigement",
                ],
            ))
        
        if random.random() > 0.8:
            alerts.append(WeatherAlert(
                id=f"alert_{uuid.uuid4().hex[:8]}",
                type="extreme_cold",
                severity=AlertSeverity.ADVISORY,
                title="Avertissement de froid extrême",
                description="Températures ressenties de -30°C ou moins.",
                affected_areas=[location],
                start_time=datetime.utcnow(),
                end_time=datetime.utcnow() + timedelta(hours=24),
                recommendations=[
                    "Limiter l'exposition au froid",
                    "Pauses fréquentes dans un endroit chauffé",
                    "Surveiller les signes d'engelure",
                    "Vérifier équipement hivernal des travailleurs",
                ],
            ))
        
        return alerts
    
    @classmethod
    def calculate_work_score(cls, weather: WeatherData) -> Tuple[WorkCondition, int, List[str]]:
        """Calculate work condition score for construction."""
        score = 100
        issues = []
        
        # Temperature factors
        if weather.temperature_c < -25:
            score -= 50
            issues.append("Froid extrême - travail extérieur limité")
        elif weather.temperature_c < -15:
            score -= 30
            issues.append("Froid intense - pauses fréquentes requises")
        elif weather.temperature_c < -5:
            score -= 15
            issues.append("Temps froid - équipement hivernal requis")
        elif weather.temperature_c > 35:
            score -= 40
            issues.append("Chaleur extrême - risque coup de chaleur")
        elif weather.temperature_c > 30:
            score -= 20
            issues.append("Forte chaleur - hydratation importante")
        
        # Wind factors
        if weather.wind_speed_kmh > 50:
            score -= 40
            issues.append("Vents violents - travaux en hauteur interdits")
        elif weather.wind_speed_kmh > 35:
            score -= 25
            issues.append("Vents forts - prudence pour grues et échafaudages")
        elif weather.wind_speed_kmh > 25:
            score -= 10
            issues.append("Vents modérés")
        
        # Precipitation factors
        if weather.condition in [WeatherCondition.HEAVY_RAIN, WeatherCondition.THUNDERSTORM]:
            score -= 50
            issues.append("Fortes précipitations - arrêt recommandé")
        elif weather.condition == WeatherCondition.FREEZING_RAIN:
            score -= 60
            issues.append("Verglas - conditions dangereuses")
        elif weather.condition in [WeatherCondition.RAIN, WeatherCondition.SNOW]:
            score -= 25
            issues.append("Précipitations - surfaces glissantes")
        
        # Visibility
        if weather.visibility_km < 1:
            score -= 30
            issues.append("Visibilité très réduite")
        elif weather.visibility_km < 5:
            score -= 15
            issues.append("Visibilité réduite")
        
        score = max(0, score)
        
        if score >= 80:
            condition = WorkCondition.EXCELLENT
        elif score >= 60:
            condition = WorkCondition.GOOD
        elif score >= 40:
            condition = WorkCondition.FAIR
        elif score >= 20:
            condition = WorkCondition.POOR
        else:
            condition = WorkCondition.UNSAFE
        
        return condition, score, issues

# ═══════════════════════════════════════════════════════════════════════════════
# SAFETY COMPLIANCE
# ═══════════════════════════════════════════════════════════════════════════════

class SafetyCompliance:
    """CCQ, CNESST, and RBQ compliance management."""
    
    _checklists: Dict[str, SafetyChecklist] = {}
    _incidents: List[SafetyIncident] = []
    _trainings: Dict[str, SafetyTraining] = {}
    _inspections: List[EquipmentInspection] = []
    
    # Standard checklist templates
    TEMPLATES = {
        "ccq_daily": {
            "name": "Inspection quotidienne CCQ",
            "type": ComplianceType.CCQ,
            "items": [
                {"id": "ccq_1", "text": "Carte de compétence CCQ valide pour tous les travailleurs", "required": True},
                {"id": "ccq_2", "text": "Registre des présences à jour", "required": True},
                {"id": "ccq_3", "text": "Ratio apprenti/compagnon respecté", "required": True},
                {"id": "ccq_4", "text": "Affichage des permis visible", "required": True},
                {"id": "ccq_5", "text": "Heures de travail conformes à la convention", "required": True},
            ],
        },
        "cnesst_daily": {
            "name": "Inspection quotidienne CNESST",
            "type": ComplianceType.CNESST,
            "items": [
                {"id": "cnesst_1", "text": "Programme de prévention disponible sur le chantier", "required": True},
                {"id": "cnesst_2", "text": "Équipements de protection individuelle (EPI) portés", "required": True},
                {"id": "cnesst_3", "text": "Casques de sécurité conformes", "required": True},
                {"id": "cnesst_4", "text": "Bottes de sécurité à embout d'acier", "required": True},
                {"id": "cnesst_5", "text": "Lunettes de protection disponibles", "required": True},
                {"id": "cnesst_6", "text": "Gilets haute visibilité portés", "required": True},
                {"id": "cnesst_7", "text": "Trousse de premiers soins accessible et complète", "required": True},
                {"id": "cnesst_8", "text": "Extincteurs en place et inspectés", "required": True},
                {"id": "cnesst_9", "text": "Signalisation de chantier adéquate", "required": True},
                {"id": "cnesst_10", "text": "Échafaudages conformes et inspectés", "required": True},
                {"id": "cnesst_11", "text": "Garde-corps installés aux ouvertures", "required": True},
                {"id": "cnesst_12", "text": "Excavations sécurisées (étançonnement)", "required": True},
            ],
        },
        "cnesst_weekly": {
            "name": "Inspection hebdomadaire CNESST",
            "type": ComplianceType.CNESST,
            "items": [
                {"id": "cnesst_w1", "text": "Réunion de sécurité tenue", "required": True},
                {"id": "cnesst_w2", "text": "Registre des accidents à jour", "required": True},
                {"id": "cnesst_w3", "text": "Formation SIMDUT complétée", "required": True},
                {"id": "cnesst_w4", "text": "Fiches signalétiques disponibles", "required": True},
                {"id": "cnesst_w5", "text": "Équipements électriques inspectés", "required": True},
                {"id": "cnesst_w6", "text": "Machines-outils avec gardes de sécurité", "required": True},
                {"id": "cnesst_w7", "text": "Plan d'urgence affiché et connu", "required": True},
                {"id": "cnesst_w8", "text": "Numéros d'urgence affichés", "required": True},
            ],
        },
        "rbq_permit": {
            "name": "Conformité permis RBQ",
            "type": ComplianceType.RBQ,
            "items": [
                {"id": "rbq_1", "text": "Permis de construction affiché", "required": True},
                {"id": "rbq_2", "text": "Plans approuvés sur le chantier", "required": True},
                {"id": "rbq_3", "text": "Licence d'entrepreneur valide", "required": True},
                {"id": "rbq_4", "text": "Assurance responsabilité à jour", "required": True},
                {"id": "rbq_5", "text": "Conformité au Code de construction", "required": True},
            ],
        },
        "scaffold_inspection": {
            "name": "Inspection échafaudage",
            "type": ComplianceType.CNESST,
            "items": [
                {"id": "scaf_1", "text": "Base stable et de niveau", "required": True},
                {"id": "scaf_2", "text": "Montants verticaux sécurisés", "required": True},
                {"id": "scaf_3", "text": "Planchers complets sans ouverture", "required": True},
                {"id": "scaf_4", "text": "Garde-corps sur tous les côtés ouverts", "required": True},
                {"id": "scaf_5", "text": "Échelle d'accès sécuritaire", "required": True},
                {"id": "scaf_6", "text": "Contreventement adéquat", "required": True},
                {"id": "scaf_7", "text": "Charge maximale affichée et respectée", "required": True},
                {"id": "scaf_8", "text": "Distance sécuritaire des lignes électriques", "required": True},
            ],
        },
    }
    
    # Required trainings by role
    REQUIRED_TRAININGS = {
        "all": ["sst_general", "simdut", "secourisme"],
        "electrician": ["habilitation_electrique", "cadenassage"],
        "operator": ["chariot_elevateur", "nacelle", "excavatrice"],
        "supervisor": ["supervision_sst", "enquete_accident"],
        "height_work": ["travail_hauteur", "protection_chutes"],
    }
    
    @classmethod
    async def create_checklist(cls, request: CreateChecklistRequest) -> SafetyChecklist:
        """Create a new safety checklist."""
        
        template = cls.TEMPLATES.get(request.template_id, cls.TEMPLATES["cnesst_daily"])
        
        checklist = SafetyChecklist(
            id=f"check_{uuid.uuid4().hex[:8]}",
            name=request.name or template["name"],
            compliance_type=request.compliance_type,
            project_id=request.project_id,
            items=[{**item, "completed": False, "notes": "", "photos": []} for item in template["items"]],
            status=ChecklistStatus.NOT_STARTED,
            completed_items=0,
            total_items=len(template["items"]),
            completed_by=None,
            completed_at=None,
            next_due=datetime.utcnow() + timedelta(days=1),
            notes="",
        )
        
        cls._checklists[checklist.id] = checklist
        return checklist
    
    @classmethod
    async def update_checklist_item(cls, checklist_id: str, request: UpdateChecklistRequest, user_id: str) -> SafetyChecklist:
        """Update a checklist item."""
        
        checklist = cls._checklists.get(checklist_id)
        if not checklist:
            raise HTTPException(404, "Checklist not found")
        
        for item in checklist.items:
            if item["id"] == request.item_id:
                item["completed"] = request.completed
                item["notes"] = request.notes
                item["photos"] = request.photos
                item["completed_by"] = user_id
                item["completed_at"] = datetime.utcnow().isoformat()
                break
        
        checklist.completed_items = sum(1 for i in checklist.items if i.get("completed"))
        
        if checklist.completed_items == checklist.total_items:
            checklist.status = ChecklistStatus.COMPLETED
            checklist.completed_by = user_id
            checklist.completed_at = datetime.utcnow()
        elif checklist.completed_items > 0:
            checklist.status = ChecklistStatus.IN_PROGRESS
        
        return checklist
    
    @classmethod
    async def report_incident(cls, request: ReportIncidentRequest, user_id: str) -> SafetyIncident:
        """Report a safety incident."""
        
        # Determine if CNESST reporting is required
        requires_cnesst = request.severity in [IncidentSeverity.SERIOUS, IncidentSeverity.CRITICAL, IncidentSeverity.FATAL]
        
        incident = SafetyIncident(
            id=f"inc_{uuid.uuid4().hex[:8]}",
            project_id=request.project_id,
            date=datetime.utcnow(),
            severity=request.severity,
            type=request.type,
            description=request.description,
            location=request.location,
            injured_persons=request.injured_persons,
            witnesses=request.witnesses,
            root_cause=None,
            corrective_actions=[],
            reported_by=user_id,
            reported_to_cnesst=requires_cnesst,
            cnesst_reference=f"CNESST-{datetime.utcnow().year}-{uuid.uuid4().hex[:6].upper()}" if requires_cnesst else None,
            status="open",
            attachments=[],
        )
        
        cls._incidents.append(incident)
        
        if requires_cnesst:
            logger.warning(f"CNESST notification required for incident {incident.id}")
        
        return incident
    
    @classmethod
    async def add_training(cls, request: AddTrainingRequest) -> SafetyTraining:
        """Add or update employee training record."""
        
        completion = datetime.fromisoformat(request.completion_date) if request.completion_date else None
        expiry = datetime.fromisoformat(request.expiry_date) if request.expiry_date else None
        
        status = TrainingStatus.NOT_STARTED
        if completion:
            if expiry and expiry < datetime.utcnow():
                status = TrainingStatus.EXPIRED
            elif expiry and expiry < datetime.utcnow() + timedelta(days=30):
                status = TrainingStatus.RENEWAL_REQUIRED
            else:
                status = TrainingStatus.COMPLETED
        
        training = SafetyTraining(
            id=f"train_{uuid.uuid4().hex[:8]}",
            employee_id=request.employee_id,
            employee_name=request.employee_name,
            training_type=request.training_type,
            provider=request.provider,
            completion_date=completion,
            expiry_date=expiry,
            certificate_number=request.certificate_number,
            status=status,
            score=None,
        )
        
        cls._trainings[training.id] = training
        return training
    
    @classmethod
    async def inspect_equipment(cls, request: InspectEquipmentRequest, user_id: str) -> EquipmentInspection:
        """Record equipment inspection."""
        
        inspection = EquipmentInspection(
            id=f"insp_{uuid.uuid4().hex[:8]}",
            equipment_id=request.equipment_id,
            equipment_name=request.equipment_name,
            inspection_type=request.inspection_type,
            inspector=user_id,
            date=datetime.utcnow(),
            passed=request.passed,
            findings=request.findings,
            next_inspection=datetime.utcnow() + timedelta(days=30),
            attachments=[],
        )
        
        cls._inspections.append(inspection)
        return inspection
    
    @classmethod
    async def get_compliance_summary(cls, project_id: str) -> Dict[str, Any]:
        """Get compliance summary for a project."""
        
        checklists = [c for c in cls._checklists.values() if c.project_id == project_id]
        incidents = [i for i in cls._incidents if i.project_id == project_id]
        
        completed = sum(1 for c in checklists if c.status == ChecklistStatus.COMPLETED)
        pending = sum(1 for c in checklists if c.status in [ChecklistStatus.NOT_STARTED, ChecklistStatus.IN_PROGRESS])
        
        open_incidents = sum(1 for i in incidents if i.status == "open")
        
        return {
            "project_id": project_id,
            "checklists": {
                "completed": completed,
                "pending": pending,
                "total": len(checklists),
            },
            "incidents": {
                "open": open_incidents,
                "total": len(incidents),
                "by_severity": {
                    s.value: sum(1 for i in incidents if i.severity == s)
                    for s in IncidentSeverity
                },
            },
            "compliance_score": round((completed / max(len(checklists), 1)) * 100, 1),
            "last_inspection": checklists[-1].completed_at.isoformat() if checklists and checklists[-1].completed_at else None,
        }
    
    @classmethod
    async def get_expiring_trainings(cls, days: int = 30) -> List[SafetyTraining]:
        """Get trainings expiring soon."""
        cutoff = datetime.utcnow() + timedelta(days=days)
        return [
            t for t in cls._trainings.values()
            if t.expiry_date and t.expiry_date < cutoff
        ]

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/weather/current")
async def get_current_weather(location: str = "Granby, QC"):
    """Get current weather conditions."""
    weather = await WeatherService.get_current(location)
    condition, score, issues = WeatherService.calculate_work_score(weather)
    
    return {
        "location": weather.location,
        "temperature": weather.temperature_c,
        "feels_like": weather.feels_like_c,
        "humidity": weather.humidity_percent,
        "wind": {"speed": weather.wind_speed_kmh, "direction": weather.wind_direction},
        "condition": weather.condition.value,
        "work_condition": condition.value,
        "work_score": score,
        "issues": issues,
    }

@router.get("/weather/forecast")
async def get_forecast(location: str = "Granby, QC", days: int = 14):
    """Get weather forecast."""
    forecasts = await WeatherService.get_forecast(location, days)
    return {
        "location": location,
        "forecasts": [
            {
                "date": f.date.isoformat(),
                "high": f.high_c,
                "low": f.low_c,
                "condition": f.condition.value,
                "precipitation_chance": f.precipitation_chance,
                "work_condition": f.work_condition.value,
                "work_score": f.work_score,
            }
            for f in forecasts
        ],
    }

@router.get("/weather/alerts")
async def get_weather_alerts(location: str = "Granby, QC"):
    """Get active weather alerts."""
    alerts = await WeatherService.get_alerts(location)
    return {
        "location": location,
        "alerts": [
            {
                "id": a.id,
                "type": a.type,
                "severity": a.severity.value,
                "title": a.title,
                "description": a.description,
                "recommendations": a.recommendations,
            }
            for a in alerts
        ],
    }

@router.get("/checklists/templates")
async def list_checklist_templates():
    """List available checklist templates."""
    return {
        "templates": [
            {"id": k, "name": v["name"], "type": v["type"].value, "items_count": len(v["items"])}
            for k, v in SafetyCompliance.TEMPLATES.items()
        ]
    }

@router.post("/checklists")
async def create_checklist(request: CreateChecklistRequest):
    """Create a new safety checklist."""
    checklist = await SafetyCompliance.create_checklist(request)
    return {"id": checklist.id, "name": checklist.name, "items_count": checklist.total_items}

@router.get("/checklists/{checklist_id}")
async def get_checklist(checklist_id: str):
    """Get checklist details."""
    checklist = SafetyCompliance._checklists.get(checklist_id)
    if not checklist:
        raise HTTPException(404, "Checklist not found")
    
    return {
        "id": checklist.id,
        "name": checklist.name,
        "type": checklist.compliance_type.value,
        "status": checklist.status.value,
        "progress": f"{checklist.completed_items}/{checklist.total_items}",
        "items": checklist.items,
    }

@router.patch("/checklists/{checklist_id}/items")
async def update_checklist_item(checklist_id: str, request: UpdateChecklistRequest):
    """Update a checklist item."""
    checklist = await SafetyCompliance.update_checklist_item(checklist_id, request, "current_user")
    return {"id": checklist.id, "status": checklist.status.value, "progress": f"{checklist.completed_items}/{checklist.total_items}"}

@router.post("/incidents")
async def report_incident(request: ReportIncidentRequest):
    """Report a safety incident."""
    incident = await SafetyCompliance.report_incident(request, "current_user")
    return {
        "id": incident.id,
        "severity": incident.severity.value,
        "cnesst_required": incident.reported_to_cnesst,
        "cnesst_reference": incident.cnesst_reference,
    }

@router.get("/incidents/{project_id}")
async def list_incidents(project_id: str):
    """List incidents for a project."""
    incidents = [i for i in SafetyCompliance._incidents if i.project_id == project_id]
    return {
        "incidents": [
            {"id": i.id, "date": i.date.isoformat(), "severity": i.severity.value, "type": i.type, "status": i.status}
            for i in incidents
        ]
    }

@router.post("/trainings")
async def add_training(request: AddTrainingRequest):
    """Add employee training record."""
    training = await SafetyCompliance.add_training(request)
    return {"id": training.id, "status": training.status.value}

@router.get("/trainings/expiring")
async def get_expiring_trainings(days: int = 30):
    """Get trainings expiring soon."""
    trainings = await SafetyCompliance.get_expiring_trainings(days)
    return {
        "expiring": [
            {"id": t.id, "employee": t.employee_name, "training": t.training_type, "expiry": t.expiry_date.isoformat() if t.expiry_date else None}
            for t in trainings
        ]
    }

@router.post("/equipment/inspect")
async def inspect_equipment(request: InspectEquipmentRequest):
    """Record equipment inspection."""
    inspection = await SafetyCompliance.inspect_equipment(request, "current_user")
    return {"id": inspection.id, "passed": inspection.passed, "next_inspection": inspection.next_inspection.isoformat()}

@router.get("/compliance/{project_id}")
async def get_compliance_summary(project_id: str):
    """Get compliance summary for a project."""
    return await SafetyCompliance.get_compliance_summary(project_id)
