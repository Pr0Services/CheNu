"""
═══════════════════════════════════════════════════════════════════════════════
CHE·NU™ — NOVA 2.0 INTELLIGENCE ENGINE
═══════════════════════════════════════════════════════════════════════════════
Moteur d'intelligence avancée pour CHE·NU™:

ANALYSE PRÉDICTIVE:
- Prédiction de retards de projets
- Estimation de dépassement budget
- Détection de risques
- Scoring de santé projet

SUGGESTIONS PROACTIVES:
- Actions recommandées
- Alertes intelligentes
- Optimisation ressources
- Prévisions trésorerie

RAPPORTS IA:
- Génération automatique
- Résumés exécutifs
- Insights hebdomadaires
- Analyse de tendances
═══════════════════════════════════════════════════════════════════════════════
"""

from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime, date, timedelta
from enum import Enum
from uuid import uuid4
import random
import math

router = APIRouter(prefix="/api/v2/nova", tags=["Nova 2.0 AI"])

# ─────────────────────────────────────────────────────────────────────────────
# ENUMS & TYPES
# ─────────────────────────────────────────────────────────────────────────────

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class InsightType(str, Enum):
    WARNING = "warning"
    OPPORTUNITY = "opportunity"
    RECOMMENDATION = "recommendation"
    ALERT = "alert"
    ACHIEVEMENT = "achievement"

class PredictionConfidence(str, Enum):
    LOW = "low"        # < 60%
    MEDIUM = "medium"  # 60-80%
    HIGH = "high"      # > 80%

class ReportType(str, Enum):
    DAILY_SUMMARY = "daily_summary"
    WEEKLY_DIGEST = "weekly_digest"
    PROJECT_HEALTH = "project_health"
    FINANCIAL_OVERVIEW = "financial_overview"
    TEAM_PERFORMANCE = "team_performance"
    RISK_ASSESSMENT = "risk_assessment"

# ─────────────────────────────────────────────────────────────────────────────
# SCHEMAS
# ─────────────────────────────────────────────────────────────────────────────

class ProjectPrediction(BaseModel):
    """Prédiction pour un projet"""
    project_id: str
    project_name: str
    
    # Délai
    predicted_completion: date
    original_deadline: date
    delay_days: int
    delay_probability: float  # 0-100
    
    # Budget
    predicted_final_cost: float
    original_budget: float
    cost_variance: float
    cost_variance_percent: float
    overrun_probability: float
    
    # Santé globale
    health_score: float  # 0-100
    risk_level: RiskLevel
    
    # Facteurs
    risk_factors: List[Dict[str, Any]]
    positive_factors: List[Dict[str, Any]]
    
    # Confiance
    confidence: PredictionConfidence
    confidence_score: float
    
    # Recommandations
    recommendations: List[str]
    
    generated_at: datetime = Field(default_factory=datetime.utcnow)

class Insight(BaseModel):
    """Insight généré par Nova"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    type: InsightType
    title: str
    description: str
    priority: int = Field(ge=1, le=5)  # 1=highest
    
    # Contexte
    related_entity_type: Optional[str] = None  # project, task, invoice, etc.
    related_entity_id: Optional[str] = None
    
    # Actions
    suggested_actions: List[Dict[str, str]] = []
    
    # Metadata
    confidence: float
    expires_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_read: bool = False
    is_dismissed: bool = False

class AIReport(BaseModel):
    """Rapport généré par l'IA"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    type: ReportType
    title: str
    
    # Contenu
    executive_summary: str
    sections: List[Dict[str, Any]]
    key_metrics: Dict[str, Any]
    charts_data: List[Dict[str, Any]]
    
    # Insights
    insights: List[Insight]
    recommendations: List[str]
    
    # Metadata
    period_start: date
    period_end: date
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    generation_time_ms: int

class CashflowForecast(BaseModel):
    """Prévision de trésorerie"""
    forecast_date: date
    opening_balance: float
    
    # Entrées prévues
    expected_receivables: List[Dict[str, Any]]
    total_inflows: float
    
    # Sorties prévues
    expected_payables: List[Dict[str, Any]]
    total_outflows: float
    
    # Solde
    closing_balance: float
    
    # Alertes
    alerts: List[str]
    confidence: float

class ResourceOptimization(BaseModel):
    """Suggestion d'optimisation ressources"""
    resource_type: str  # employee, equipment, material
    current_allocation: Dict[str, Any]
    suggested_allocation: Dict[str, Any]
    potential_savings: float
    efficiency_gain_percent: float
    implementation_steps: List[str]

# ─────────────────────────────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

def calculate_health_score(
    progress: float,
    budget_used_percent: float,
    days_elapsed_percent: float,
    open_issues: int,
    team_utilization: float
) -> float:
    """Calculate project health score (0-100)"""
    
    # Progress vs time alignment (40% weight)
    progress_score = 100 - abs(progress - days_elapsed_percent)
    
    # Budget health (30% weight)
    budget_score = max(0, 100 - max(0, budget_used_percent - days_elapsed_percent))
    
    # Issues impact (15% weight)
    issues_score = max(0, 100 - (open_issues * 5))
    
    # Team efficiency (15% weight)
    team_score = team_utilization
    
    health = (
        progress_score * 0.4 +
        budget_score * 0.3 +
        issues_score * 0.15 +
        team_score * 0.15
    )
    
    return round(max(0, min(100, health)), 1)

def determine_risk_level(health_score: float, delay_probability: float) -> RiskLevel:
    """Determine risk level from health and delay probability"""
    
    combined_risk = (100 - health_score) * 0.6 + delay_probability * 0.4
    
    if combined_risk < 25:
        return RiskLevel.LOW
    elif combined_risk < 50:
        return RiskLevel.MEDIUM
    elif combined_risk < 75:
        return RiskLevel.HIGH
    else:
        return RiskLevel.CRITICAL

def generate_recommendations(
    health_score: float,
    delay_days: int,
    budget_variance_percent: float,
    risk_factors: List[Dict]
) -> List[str]:
    """Generate actionable recommendations"""
    
    recommendations = []
    
    if delay_days > 0:
        recommendations.append(
            f"⏰ Retard prévu de {delay_days} jours. Considérez d'ajouter des ressources "
            "ou de revoir les priorités des tâches critiques."
        )
    
    if budget_variance_percent > 10:
        recommendations.append(
            f"💰 Dépassement budgétaire de {budget_variance_percent:.1f}% anticipé. "
            "Analysez les postes de dépenses et négociez avec les fournisseurs."
        )
    
    if health_score < 60:
        recommendations.append(
            "📊 Score de santé faible. Planifiez une réunion d'équipe pour identifier "
            "les blocages et définir un plan de redressement."
        )
    
    for factor in risk_factors[:3]:
        if factor.get("severity") == "high":
            recommendations.append(f"⚠️ {factor.get('recommendation', 'Action requise')}")
    
    if not recommendations:
        recommendations.append(
            "✅ Projet en bonne voie. Continuez à monitorer les indicateurs clés."
        )
    
    return recommendations

# ─────────────────────────────────────────────────────────────────────────────
# ENDPOINTS - PREDICTIONS
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/predict/project/{project_id}", response_model=ProjectPrediction)
async def predict_project_outcome(project_id: str):
    """Prédire l'issue d'un projet"""
    
    # Mock project data (would come from database)
    project = {
        "id": project_id,
        "name": "Rénovation Tremblay",
        "progress": 72,
        "budget_estimated": 85000,
        "budget_actual": 68000,
        "start_date": date(2024, 10, 1),
        "end_date": date(2025, 2, 28),
        "team_size": 5,
        "open_issues": 3
    }
    
    # Calculate predictions
    today = date.today()
    total_days = (project["end_date"] - project["start_date"]).days
    days_elapsed = (today - project["start_date"]).days
    days_elapsed_percent = (days_elapsed / total_days) * 100 if total_days > 0 else 0
    
    # Progress vs time analysis
    expected_progress = days_elapsed_percent
    progress_gap = project["progress"] - expected_progress
    
    # Predict delay
    if progress_gap < -10:
        # Behind schedule
        rate = project["progress"] / max(1, days_elapsed)
        remaining_work = 100 - project["progress"]
        days_needed = remaining_work / rate if rate > 0 else 999
        predicted_completion = today + timedelta(days=int(days_needed))
        delay_days = max(0, (predicted_completion - project["end_date"]).days)
        delay_probability = min(95, 50 + abs(progress_gap) * 2)
    else:
        # On or ahead of schedule
        predicted_completion = project["end_date"]
        delay_days = 0
        delay_probability = max(5, 30 - progress_gap)
    
    # Budget prediction
    budget_used_percent = (project["budget_actual"] / project["budget_estimated"]) * 100
    remaining_work_percent = 100 - project["progress"]
    
    # Estimate final cost based on burn rate
    burn_rate = project["budget_actual"] / max(1, project["progress"]) if project["progress"] > 0 else 1
    predicted_final_cost = burn_rate * 100
    cost_variance = predicted_final_cost - project["budget_estimated"]
    cost_variance_percent = (cost_variance / project["budget_estimated"]) * 100
    overrun_probability = min(95, max(5, 30 + cost_variance_percent * 2))
    
    # Health score
    health_score = calculate_health_score(
        project["progress"],
        budget_used_percent,
        days_elapsed_percent,
        project["open_issues"],
        85  # Mock team utilization
    )
    
    # Risk level
    risk_level = determine_risk_level(health_score, delay_probability)
    
    # Risk factors
    risk_factors = []
    if delay_days > 0:
        risk_factors.append({
            "factor": "Retard de planning",
            "impact": f"{delay_days} jours",
            "severity": "high" if delay_days > 14 else "medium",
            "recommendation": "Accélérer les tâches critiques"
        })
    if cost_variance_percent > 10:
        risk_factors.append({
            "factor": "Dépassement budget",
            "impact": f"+{cost_variance_percent:.1f}%",
            "severity": "high" if cost_variance_percent > 20 else "medium",
            "recommendation": "Revoir les postes de dépenses"
        })
    if project["open_issues"] > 2:
        risk_factors.append({
            "factor": "Issues non résolues",
            "impact": f"{project['open_issues']} issues",
            "severity": "medium",
            "recommendation": "Prioriser la résolution des blocages"
        })
    
    # Positive factors
    positive_factors = []
    if progress_gap > 5:
        positive_factors.append({
            "factor": "Avance sur planning",
            "impact": f"+{progress_gap:.1f}%",
            "contribution": "high"
        })
    if cost_variance_percent < 0:
        positive_factors.append({
            "factor": "Sous budget",
            "impact": f"{abs(cost_variance_percent):.1f}% d'économie",
            "contribution": "medium"
        })
    
    # Confidence
    data_quality = 0.85  # Mock
    confidence_score = data_quality * 100 * (1 - (project["open_issues"] * 0.05))
    confidence = (
        PredictionConfidence.HIGH if confidence_score > 80 else
        PredictionConfidence.MEDIUM if confidence_score > 60 else
        PredictionConfidence.LOW
    )
    
    # Recommendations
    recommendations = generate_recommendations(
        health_score, delay_days, cost_variance_percent, risk_factors
    )
    
    return ProjectPrediction(
        project_id=project_id,
        project_name=project["name"],
        predicted_completion=predicted_completion,
        original_deadline=project["end_date"],
        delay_days=delay_days,
        delay_probability=round(delay_probability, 1),
        predicted_final_cost=round(predicted_final_cost, 2),
        original_budget=project["budget_estimated"],
        cost_variance=round(cost_variance, 2),
        cost_variance_percent=round(cost_variance_percent, 1),
        overrun_probability=round(overrun_probability, 1),
        health_score=health_score,
        risk_level=risk_level,
        risk_factors=risk_factors,
        positive_factors=positive_factors,
        confidence=confidence,
        confidence_score=round(confidence_score, 1),
        recommendations=recommendations
    )

@router.get("/predict/cashflow", response_model=List[CashflowForecast])
async def predict_cashflow(
    days: int = Query(30, ge=7, le=90),
    organization_id: Optional[str] = None
):
    """Prévision de trésorerie sur X jours"""
    
    forecasts = []
    current_balance = 45000.0  # Mock starting balance
    
    for i in range(days):
        forecast_date = date.today() + timedelta(days=i)
        
        # Mock receivables (invoices due)
        receivables = []
        if i % 7 == 0:  # Weekly client payments
            receivables.append({
                "source": "Facture #1234 - Client Tremblay",
                "amount": random.uniform(5000, 15000),
                "probability": 0.85
            })
        if i % 14 == 0:  # Bi-weekly
            receivables.append({
                "source": "Facture #1235 - Client Bergeron",
                "amount": random.uniform(8000, 25000),
                "probability": 0.75
            })
        
        total_inflows = sum(r["amount"] * r["probability"] for r in receivables)
        
        # Mock payables
        payables = []
        if i % 7 == 5:  # Friday payroll
            payables.append({
                "destination": "Paie employés",
                "amount": 12000,
                "certainty": 1.0
            })
        if i % 15 == 0:  # Bi-monthly suppliers
            payables.append({
                "destination": "Fournisseur Matériaux XYZ",
                "amount": random.uniform(3000, 8000),
                "certainty": 0.95
            })
        if i == 14:  # TPS/TVQ
            payables.append({
                "destination": "Remise TPS/TVQ",
                "amount": 8500,
                "certainty": 1.0
            })
        
        total_outflows = sum(p["amount"] * p["certainty"] for p in payables)
        
        closing_balance = current_balance + total_inflows - total_outflows
        
        # Alerts
        alerts = []
        if closing_balance < 10000:
            alerts.append("⚠️ Solde bas prévu - considérez le financement")
        if closing_balance < 0:
            alerts.append("🚨 DÉCOUVERT PRÉVU - Action urgente requise")
        
        forecasts.append(CashflowForecast(
            forecast_date=forecast_date,
            opening_balance=round(current_balance, 2),
            expected_receivables=receivables,
            total_inflows=round(total_inflows, 2),
            expected_payables=payables,
            total_outflows=round(total_outflows, 2),
            closing_balance=round(closing_balance, 2),
            alerts=alerts,
            confidence=0.85 - (i * 0.005)  # Confidence decreases over time
        ))
        
        current_balance = closing_balance
    
    return forecasts

# ─────────────────────────────────────────────────────────────────────────────
# ENDPOINTS - INSIGHTS
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/insights", response_model=List[Insight])
async def get_insights(
    type: Optional[InsightType] = None,
    priority: Optional[int] = None,
    limit: int = Query(20, ge=1, le=100)
):
    """Obtenir les insights générés par Nova"""
    
    # Generate mock insights
    insights = [
        Insight(
            type=InsightType.ALERT,
            title="Retard potentiel détecté",
            description="Le projet 'Rénovation Tremblay' risque un retard de 5 jours "
                       "basé sur le rythme actuel de progression.",
            priority=1,
            related_entity_type="project",
            related_entity_id="proj-123",
            suggested_actions=[
                {"action": "view_project", "label": "Voir le projet"},
                {"action": "schedule_meeting", "label": "Planifier réunion"},
            ],
            confidence=0.82
        ),
        Insight(
            type=InsightType.WARNING,
            title="Facture en retard",
            description="La facture #1234 de 15,000$ est impayée depuis 45 jours. "
                       "Relance recommandée.",
            priority=2,
            related_entity_type="invoice",
            related_entity_id="inv-1234",
            suggested_actions=[
                {"action": "send_reminder", "label": "Envoyer rappel"},
                {"action": "view_invoice", "label": "Voir facture"},
            ],
            confidence=0.95
        ),
        Insight(
            type=InsightType.OPPORTUNITY,
            title="Économie potentielle identifiée",
            description="En regroupant les commandes de matériaux des projets actifs, "
                       "vous pourriez économiser ~12% soit environ 4,500$.",
            priority=3,
            suggested_actions=[
                {"action": "view_analysis", "label": "Voir l'analyse"},
                {"action": "create_order", "label": "Créer commande groupée"},
            ],
            confidence=0.75
        ),
        Insight(
            type=InsightType.RECOMMENDATION,
            title="Formation SST à renouveler",
            description="2 employés ont leur formation SST qui expire dans 30 jours. "
                       "Planifiez le renouvellement pour rester conforme CNESST.",
            priority=2,
            related_entity_type="compliance",
            suggested_actions=[
                {"action": "schedule_training", "label": "Planifier formation"},
                {"action": "view_employees", "label": "Voir employés concernés"},
            ],
            confidence=1.0
        ),
        Insight(
            type=InsightType.ACHIEVEMENT,
            title="Objectif atteint! 🎉",
            description="Le projet 'Agrandissement Bergeron' a atteint 50% d'avancement "
                       "avec 2 jours d'avance sur le planning.",
            priority=4,
            related_entity_type="project",
            related_entity_id="proj-456",
            suggested_actions=[
                {"action": "share_update", "label": "Partager avec le client"},
            ],
            confidence=1.0
        ),
    ]
    
    # Filter
    if type:
        insights = [i for i in insights if i.type == type]
    if priority:
        insights = [i for i in insights if i.priority == priority]
    
    # Sort by priority
    insights.sort(key=lambda x: x.priority)
    
    return insights[:limit]

@router.post("/insights/{insight_id}/dismiss", status_code=204)
async def dismiss_insight(insight_id: str):
    """Ignorer un insight"""
    # Would update in database
    return None

@router.post("/insights/{insight_id}/action", response_model=Dict)
async def execute_insight_action(insight_id: str, action: str):
    """Exécuter une action suggérée"""
    return {
        "status": "executed",
        "insight_id": insight_id,
        "action": action,
        "result": "Action exécutée avec succès",
        "next_steps": ["Vérifier le résultat", "Suivre l'évolution"]
    }

# ─────────────────────────────────────────────────────────────────────────────
# ENDPOINTS - REPORTS
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/reports/generate", response_model=AIReport)
async def generate_report(
    report_type: ReportType,
    period_days: int = Query(7, ge=1, le=90)
):
    """Générer un rapport IA"""
    
    start_time = datetime.utcnow()
    period_start = date.today() - timedelta(days=period_days)
    period_end = date.today()
    
    # Generate report based on type
    if report_type == ReportType.WEEKLY_DIGEST:
        title = f"Résumé Hebdomadaire - Semaine du {period_start.strftime('%d/%m')}"
        executive_summary = """
Cette semaine a été marquée par une progression solide sur les projets actifs. 
Le projet Tremblay a atteint 72% d'avancement, légèrement en retard sur le planning.
Le budget global reste maîtrisé avec 94% du budget utilisé pour 72% d'avancement.
3 nouvelles opportunités commerciales ont été identifiées.
        """.strip()
        
        sections = [
            {
                "title": "Projets Actifs",
                "content": "3 projets en cours avec une progression moyenne de 65%",
                "data": [
                    {"project": "Rénovation Tremblay", "progress": 72, "status": "on_track"},
                    {"project": "Agrandissement Bergeron", "progress": 45, "status": "ahead"},
                    {"project": "Entrepôt ABC", "progress": 15, "status": "planning"}
                ]
            },
            {
                "title": "Finances",
                "content": "Revenus: 47,500$ | Dépenses: 32,800$ | Marge: 31%",
                "data": {
                    "revenue": 47500,
                    "expenses": 32800,
                    "margin_percent": 31,
                    "outstanding_invoices": 34500
                }
            },
            {
                "title": "Équipe",
                "content": "12 employés actifs, 2 formations complétées",
                "data": {
                    "active_employees": 12,
                    "hours_logged": 480,
                    "trainings_completed": 2
                }
            }
        ]
        
        key_metrics = {
            "projects_on_track": 2,
            "projects_at_risk": 1,
            "revenue_this_week": 47500,
            "tasks_completed": 24,
            "client_satisfaction": 4.5
        }
        
    elif report_type == ReportType.PROJECT_HEALTH:
        title = "Rapport de Santé des Projets"
        executive_summary = """
Analyse complète de la santé de vos projets actifs. 2 projets sur 3 sont en bonne santé.
Le projet Tremblay nécessite une attention particulière en raison d'un léger retard.
Recommandation: Réaffecter des ressources pour accélérer les finitions.
        """.strip()
        
        sections = [
            {
                "title": "Vue d'ensemble",
                "content": "Score de santé moyen: 78/100",
                "projects": [
                    {"name": "Tremblay", "health": 72, "risk": "medium"},
                    {"name": "Bergeron", "health": 85, "risk": "low"},
                    {"name": "ABC", "health": 90, "risk": "low"}
                ]
            }
        ]
        
        key_metrics = {
            "avg_health_score": 78,
            "projects_healthy": 2,
            "projects_at_risk": 1,
            "total_budget": 2765000,
            "budget_used": 175000
        }
    else:
        title = f"Rapport {report_type.value}"
        executive_summary = "Rapport généré automatiquement par Nova 2.0"
        sections = []
        key_metrics = {}
    
    # Common insights
    insights = [
        Insight(
            type=InsightType.RECOMMENDATION,
            title="Optimisation suggérée",
            description="Regrouper les achats de matériaux pourrait économiser 8%",
            priority=3,
            confidence=0.8
        )
    ]
    
    recommendations = [
        "📋 Planifier une revue de projet pour Tremblay",
        "💰 Relancer les factures impayées > 30 jours",
        "👥 Compléter les formations SST en attente"
    ]
    
    charts_data = [
        {
            "type": "line",
            "title": "Progression des projets",
            "data": [
                {"date": "2024-11-25", "value": 65},
                {"date": "2024-12-01", "value": 68},
                {"date": "2024-12-04", "value": 72}
            ]
        },
        {
            "type": "pie",
            "title": "Répartition budget",
            "data": [
                {"label": "Main d'œuvre", "value": 45},
                {"label": "Matériaux", "value": 35},
                {"label": "Équipements", "value": 15},
                {"label": "Autres", "value": 5}
            ]
        }
    ]
    
    generation_time = int((datetime.utcnow() - start_time).total_seconds() * 1000)
    
    return AIReport(
        type=report_type,
        title=title,
        executive_summary=executive_summary,
        sections=sections,
        key_metrics=key_metrics,
        charts_data=charts_data,
        insights=insights,
        recommendations=recommendations,
        period_start=period_start,
        period_end=period_end,
        generation_time_ms=generation_time
    )

# ─────────────────────────────────────────────────────────────────────────────
# ENDPOINTS - OPTIMIZATION
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/optimize/resources", response_model=List[ResourceOptimization])
async def get_resource_optimizations():
    """Suggestions d'optimisation des ressources"""
    
    return [
        ResourceOptimization(
            resource_type="employee",
            current_allocation={
                "project_tremblay": ["Jean", "Marie", "Pierre"],
                "project_bergeron": ["Paul", "Sophie"]
            },
            suggested_allocation={
                "project_tremblay": ["Jean", "Marie", "Paul"],  # Paul moved
                "project_bergeron": ["Pierre", "Sophie"]
            },
            potential_savings=2500,
            efficiency_gain_percent=12,
            implementation_steps=[
                "Transférer Paul au projet Tremblay (expertise électricité)",
                "Transférer Pierre au projet Bergeron (finitions)",
                "Ajuster les plannings avant lundi"
            ]
        ),
        ResourceOptimization(
            resource_type="equipment",
            current_allocation={
                "excavator": "project_tremblay",
                "crane": "idle"
            },
            suggested_allocation={
                "excavator": "project_bergeron",
                "crane": "project_abc"
            },
            potential_savings=1800,
            efficiency_gain_percent=8,
            implementation_steps=[
                "Relocaliser l'excavatrice après les fondations (Tremblay)",
                "Réserver la grue pour phase structure (ABC)"
            ]
        )
    ]

@router.post("/ask", response_model=Dict)
async def ask_nova(question: str, context: Dict[str, Any] = {}):
    """Poser une question à Nova"""
    
    # Mock intelligent response
    responses = {
        "default": {
            "answer": "Je comprends votre question. Basé sur les données disponibles, "
                     "voici ce que je peux vous dire...",
            "confidence": 0.75,
            "sources": ["Données projets", "Historique"]
        }
    }
    
    # Simple keyword matching for demo
    question_lower = question.lower()
    
    if "retard" in question_lower or "délai" in question_lower:
        response = {
            "answer": "📊 Basé sur mon analyse, le projet Tremblay présente un risque de "
                     "retard de 5 jours. Les principales causes sont les délais de livraison "
                     "des matériaux et 3 tâches critiques non terminées. Je recommande "
                     "d'ajouter des ressources cette semaine.",
            "confidence": 0.85,
            "sources": ["Analyse prédictive", "Historique tâches"],
            "suggested_actions": ["Voir le projet", "Réaffecter ressources"]
        }
    elif "budget" in question_lower or "coût" in question_lower:
        response = {
            "answer": "💰 Le budget global des projets actifs est de 2,765,000$. "
                     "Actuellement, 175,000$ ont été dépensés (6.3%). Le projet Tremblay "
                     "utilise 80% de son budget pour 72% d'avancement, ce qui est acceptable "
                     "mais à surveiller.",
            "confidence": 0.92,
            "sources": ["Données financières", "Projets"],
            "suggested_actions": ["Voir rapport financier", "Analyser dépenses"]
        }
    elif "équipe" in question_lower or "employé" in question_lower:
        response = {
            "answer": "👥 Vous avez 12 employés actifs répartis sur 3 projets. "
                     "Le taux d'utilisation moyen est de 85%. 2 employés ont des formations "
                     "à renouveler dans les 30 prochains jours.",
            "confidence": 0.88,
            "sources": ["RH", "Formations"],
            "suggested_actions": ["Voir l'équipe", "Planifier formations"]
        }
    else:
        response = responses["default"]
    
    return {
        "question": question,
        "response": response,
        "timestamp": datetime.utcnow().isoformat()
    }
