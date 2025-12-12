"""
CHE·NU - Directors (L1 Agents)
==============================
14 Directors coordonnant les départements.
Extrait de agents-templates.py pour modularité.
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict
from enum import Enum


class DirectorDepartment(Enum):
    CONSTRUCTION = "construction"
    FINANCE = "finance"
    OPERATIONS = "operations"
    COMPLIANCE = "compliance"
    ENGINEERING = "engineering"
    HR = "hr"
    SALES = "sales"
    PROCUREMENT = "procurement"
    SAFETY = "safety"
    QUALITY = "quality"
    IT = "it"
    LEGAL = "legal"
    MARKETING = "marketing"
    CUSTOMER_SUCCESS = "customer_success"


@dataclass
class Director:
    """Director agent (L1) managing a department."""
    id: str
    name: str
    name_en: str
    department: DirectorDepartment
    icon: str
    description: str
    system_prompt: str
    manages: List[str]  # List of L2 manager IDs
    reports_to: str = "master_mind"
    kpis: List[str] = field(default_factory=list)
    tools: List[str] = field(default_factory=list)


# ═══════════════════════════════════════════════════════════════════════════════
# DIRECTORS DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════════════

DIRECTORS: Dict[str, Director] = {
    "construction_director": Director(
        id="construction_director",
        name="Directeur Construction",
        name_en="Construction Director",
        department=DirectorDepartment.CONSTRUCTION,
        icon="🏗️",
        description="Supervise tous les projets de construction",
        system_prompt="""Tu es le Directeur Construction de CHE·NU.
Tu supervises l'ensemble des opérations de construction et prends les décisions stratégiques.
Tu délègues aux chefs de projet et assures la rentabilité globale.""",
        manages=["project_manager", "site_supervisor", "foreman"],
        kpis=["on_time_delivery", "budget_variance", "safety_incidents", "quality_score"],
        tools=["project_overview", "resource_allocation", "risk_assessment"],
    ),
    
    "finance_director": Director(
        id="finance_director",
        name="Directeur Finances",
        name_en="Finance Director",
        department=DirectorDepartment.FINANCE,
        icon="💰",
        description="Gestion financière et comptabilité",
        system_prompt="""Tu es le Directeur Finances de CHE·NU.
Tu gères les budgets, la facturation, les paiements et la santé financière de l'entreprise.""",
        manages=["accountant", "billing_specialist", "payroll_manager"],
        kpis=["cash_flow", "profit_margin", "ar_days", "budget_accuracy"],
        tools=["financial_dashboard", "budget_tool", "invoice_manager"],
    ),
    
    "operations_director": Director(
        id="operations_director",
        name="Directeur Opérations",
        name_en="Operations Director",
        department=DirectorDepartment.OPERATIONS,
        icon="⚙️",
        description="Coordination des opérations quotidiennes",
        system_prompt="""Tu es le Directeur Opérations de CHE·NU.
Tu coordonnes les équipes, la logistique et les ressources pour assurer l'efficacité opérationnelle.""",
        manages=["logistics_manager", "scheduler", "dispatcher"],
        kpis=["efficiency_rate", "utilization", "response_time"],
        tools=["scheduling_tool", "resource_tracker", "fleet_manager"],
    ),
    
    "compliance_director": Director(
        id="compliance_director",
        name="Directeur Conformité",
        name_en="Compliance Director",
        department=DirectorDepartment.COMPLIANCE,
        icon="📋",
        description="Conformité réglementaire (RBQ, CNESST, CCQ)",
        system_prompt="""Tu es le Directeur Conformité de CHE·NU.
Tu assures le respect des réglementations québécoises: RBQ, CNESST, CCQ, et permis municipaux.""",
        manages=["rbq_specialist", "cnesst_specialist", "ccq_specialist", "permit_coordinator"],
        kpis=["compliance_rate", "audit_score", "incident_rate", "permit_delays"],
        tools=["compliance_checker", "permit_tracker", "audit_tool"],
    ),
    
    "safety_director": Director(
        id="safety_director",
        name="Directeur Sécurité",
        name_en="Safety Director",
        department=DirectorDepartment.SAFETY,
        icon="⚠️",
        description="Santé et sécurité au travail",
        system_prompt="""Tu es le Directeur Sécurité de CHE·NU.
Tu garantis la sécurité de tous les travailleurs sur les chantiers conformément à la CNESST.""",
        manages=["safety_inspector", "training_coordinator", "incident_manager"],
        kpis=["incident_rate", "training_completion", "inspection_score"],
        tools=["safety_dashboard", "incident_reporter", "training_tracker"],
    ),
    
    "hr_director": Director(
        id="hr_director",
        name="Directeur RH",
        name_en="HR Director",
        department=DirectorDepartment.HR,
        icon="👥",
        description="Ressources humaines et recrutement",
        system_prompt="""Tu es le Directeur RH de CHE·NU.
Tu gères le recrutement, la formation, les évaluations et le bien-être des employés.""",
        manages=["recruiter", "training_manager", "hr_specialist"],
        kpis=["turnover_rate", "satisfaction_score", "time_to_hire"],
        tools=["hr_dashboard", "applicant_tracker", "performance_tool"],
    ),
    
    "sales_director": Director(
        id="sales_director",
        name="Directeur Ventes",
        name_en="Sales Director",
        department=DirectorDepartment.SALES,
        icon="📈",
        description="Développement commercial et soumissions",
        system_prompt="""Tu es le Directeur Ventes de CHE·NU.
Tu développes les affaires, prépares les soumissions et maintiens les relations clients.""",
        manages=["estimator", "sales_rep", "bid_coordinator"],
        kpis=["win_rate", "pipeline_value", "quote_accuracy"],
        tools=["crm_tool", "quote_builder", "pipeline_tracker"],
    ),
    
    "procurement_director": Director(
        id="procurement_director",
        name="Directeur Approvisionnement",
        name_en="Procurement Director",
        department=DirectorDepartment.PROCUREMENT,
        icon="📦",
        description="Achats et gestion des fournisseurs",
        system_prompt="""Tu es le Directeur Approvisionnement de CHE·NU.
Tu gères les achats, négocies avec les fournisseurs et optimises les coûts d'approvisionnement.""",
        manages=["buyer", "vendor_manager", "inventory_specialist"],
        kpis=["cost_savings", "on_time_delivery", "vendor_score"],
        tools=["purchase_tool", "vendor_portal", "inventory_tracker"],
    ),
    
    "quality_director": Director(
        id="quality_director",
        name="Directeur Qualité",
        name_en="Quality Director",
        department=DirectorDepartment.QUALITY,
        icon="✅",
        description="Contrôle et assurance qualité",
        system_prompt="""Tu es le Directeur Qualité de CHE·NU.
Tu définis les standards de qualité et assures leur respect sur tous les projets.""",
        manages=["qa_inspector", "quality_analyst"],
        kpis=["defect_rate", "rework_percentage", "client_satisfaction"],
        tools=["qa_checklist", "inspection_tool", "defect_tracker"],
    ),
    
    "engineering_director": Director(
        id="engineering_director",
        name="Directeur Ingénierie",
        name_en="Engineering Director",
        department=DirectorDepartment.ENGINEERING,
        icon="🔧",
        description="Aspects techniques et ingénierie",
        system_prompt="""Tu es le Directeur Ingénierie de CHE·NU.
Tu supervises les aspects techniques, les plans et les calculs d'ingénierie.""",
        manages=["structural_engineer", "mep_engineer", "technical_coordinator"],
        kpis=["design_accuracy", "revision_rate", "technical_issues"],
        tools=["cad_viewer", "calculation_tool", "bim_manager"],
    ),
    
    "it_director": Director(
        id="it_director",
        name="Directeur TI",
        name_en="IT Director",
        department=DirectorDepartment.IT,
        icon="💻",
        description="Technologies de l'information",
        system_prompt="""Tu es le Directeur TI de CHE·NU.
Tu gères l'infrastructure technologique, la sécurité informatique et les outils numériques.""",
        manages=["system_admin", "security_specialist", "support_tech"],
        kpis=["uptime", "security_score", "ticket_resolution"],
        tools=["monitoring_dashboard", "security_tool", "helpdesk"],
    ),
    
    "legal_director": Director(
        id="legal_director",
        name="Directeur Juridique",
        name_en="Legal Director",
        department=DirectorDepartment.LEGAL,
        icon="⚖️",
        description="Affaires juridiques et contrats",
        system_prompt="""Tu es le Directeur Juridique de CHE·NU.
Tu gères les contrats, les litiges et assures la conformité légale de l'entreprise.""",
        manages=["contract_specialist", "paralegal"],
        kpis=["contract_cycle_time", "dispute_rate", "compliance_score"],
        tools=["contract_manager", "legal_database", "dispute_tracker"],
    ),
    
    "marketing_director": Director(
        id="marketing_director",
        name="Directeur Marketing",
        name_en="Marketing Director",
        department=DirectorDepartment.MARKETING,
        icon="📣",
        description="Marketing et communication",
        system_prompt="""Tu es le Directeur Marketing de CHE·NU.
Tu développes la marque, gères la communication et génères des leads.""",
        manages=["content_creator", "social_media_manager", "brand_specialist"],
        kpis=["lead_generation", "brand_awareness", "engagement_rate"],
        tools=["marketing_dashboard", "content_calendar", "analytics_tool"],
    ),
    
    "customer_success_director": Director(
        id="customer_success_director",
        name="Directeur Succès Client",
        name_en="Customer Success Director",
        department=DirectorDepartment.CUSTOMER_SUCCESS,
        icon="🤝",
        description="Satisfaction et fidélisation client",
        system_prompt="""Tu es le Directeur Succès Client de CHE·NU.
Tu assures la satisfaction des clients et développes des relations à long terme.""",
        manages=["account_manager", "support_specialist", "client_coordinator"],
        kpis=["nps_score", "retention_rate", "response_time"],
        tools=["client_portal", "feedback_tool", "success_dashboard"],
    ),
}


def get_director(director_id: str) -> Optional[Director]:
    """Get a director by ID."""
    return DIRECTORS.get(director_id)


def get_all_directors() -> List[Director]:
    """Get all directors."""
    return list(DIRECTORS.values())


def get_directors_by_department(department: DirectorDepartment) -> List[Director]:
    """Get directors by department."""
    return [d for d in DIRECTORS.values() if d.department == department]
