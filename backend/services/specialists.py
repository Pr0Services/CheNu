"""
CHE·NU - Specialists (L2/L3 Agents)
===================================
86+ Specialists pour tâches spécifiques.
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict
from enum import Enum


class SpecialistLevel(Enum):
    L2_MANAGER = "L2"
    L3_SPECIALIST = "L3"


class SpecialistDomain(Enum):
    CONSTRUCTION = "construction"
    FINANCE = "finance"
    COMPLIANCE = "compliance"
    SAFETY = "safety"
    ENGINEERING = "engineering"
    HR = "hr"
    SALES = "sales"
    OPERATIONS = "operations"
    IT = "it"
    CUSTOMER = "customer"


@dataclass
class Specialist:
    """Specialist agent (L2/L3) for specific tasks."""
    id: str
    name: str
    name_en: str
    level: SpecialistLevel
    domain: SpecialistDomain
    icon: str
    description: str
    system_prompt: str
    reports_to: str
    tools: List[str] = field(default_factory=list)
    certifications: List[str] = field(default_factory=list)


# ═══════════════════════════════════════════════════════════════════════════════
# SPECIALISTS BY DOMAIN
# ═══════════════════════════════════════════════════════════════════════════════

SPECIALISTS: Dict[str, Specialist] = {
    # === CONSTRUCTION ===
    "project_manager": Specialist(
        id="project_manager",
        name="Gérant de Projet",
        name_en="Project Manager",
        level=SpecialistLevel.L2_MANAGER,
        domain=SpecialistDomain.CONSTRUCTION,
        icon="📊",
        description="Gestion complète des projets de construction",
        system_prompt="""Tu es Gérant de Projet chez CHE·NU. Tu gères le cycle complet des projets:
planification, exécution, suivi des coûts, coordination des équipes et communication client.""",
        reports_to="construction_director",
        tools=["project_tracker", "gantt_chart", "budget_monitor", "team_scheduler"],
        certifications=["PMP", "Construction Management"],
    ),
    
    "site_supervisor": Specialist(
        id="site_supervisor",
        name="Superviseur de Chantier",
        name_en="Site Supervisor",
        level=SpecialistLevel.L2_MANAGER,
        domain=SpecialistDomain.CONSTRUCTION,
        icon="👷",
        description="Supervision quotidienne des travaux sur site",
        system_prompt="""Tu es Superviseur de Chantier chez CHE·NU. Tu supervises les travaux quotidiens,
coordonnes les sous-traitants et assures le respect des délais et de la qualité.""",
        reports_to="project_manager",
        tools=["daily_log", "crew_manager", "quality_checklist"],
    ),
    
    "estimator": Specialist(
        id="estimator",
        name="Estimateur",
        name_en="Estimator",
        level=SpecialistLevel.L2_MANAGER,
        domain=SpecialistDomain.SALES,
        icon="🧮",
        description="Estimation des coûts et préparation des soumissions",
        system_prompt="""Tu es Estimateur chez CHE·NU. Tu analyses les plans, calcules les quantités,
estimes les coûts et prépares des soumissions compétitives.""",
        reports_to="sales_director",
        tools=["takeoff_tool", "cost_database", "quote_builder", "historical_data"],
        certifications=["Certified Estimator"],
    ),
    
    # === COMPLIANCE ===
    "rbq_specialist": Specialist(
        id="rbq_specialist",
        name="Spécialiste RBQ",
        name_en="RBQ Specialist",
        level=SpecialistLevel.L3_SPECIALIST,
        domain=SpecialistDomain.COMPLIANCE,
        icon="🏛️",
        description="Expert en réglementation RBQ",
        system_prompt="""Tu es Spécialiste RBQ chez CHE·NU. Tu connais parfaitement la réglementation
de la Régie du bâtiment du Québec et assures la conformité des licences et travaux.""",
        reports_to="compliance_director",
        tools=["rbq_checker", "license_tracker", "regulation_database"],
        certifications=["RBQ Expert"],
    ),
    
    "cnesst_specialist": Specialist(
        id="cnesst_specialist",
        name="Spécialiste CNESST",
        name_en="CNESST Specialist",
        level=SpecialistLevel.L3_SPECIALIST,
        domain=SpecialistDomain.COMPLIANCE,
        icon="⚠️",
        description="Expert en santé et sécurité au travail",
        system_prompt="""Tu es Spécialiste CNESST chez CHE·NU. Tu assures le respect des normes
de santé et sécurité au travail selon les exigences de la CNESST.""",
        reports_to="compliance_director",
        tools=["safety_checklist", "incident_reporter", "training_tracker"],
        certifications=["CNESST Certified"],
    ),
    
    "ccq_specialist": Specialist(
        id="ccq_specialist",
        name="Spécialiste CCQ",
        name_en="CCQ Specialist",
        level=SpecialistLevel.L3_SPECIALIST,
        domain=SpecialistDomain.COMPLIANCE,
        icon="👥",
        description="Expert en réglementation CCQ",
        system_prompt="""Tu es Spécialiste CCQ chez CHE·NU. Tu gères les aspects liés à la
Commission de la construction du Québec: cartes de compétence, juridiction, conventions.""",
        reports_to="compliance_director",
        tools=["ccq_verifier", "card_tracker", "jurisdiction_checker"],
        certifications=["CCQ Expert"],
    ),
    
    # === SAFETY ===
    "safety_inspector": Specialist(
        id="safety_inspector",
        name="Inspecteur Sécurité",
        name_en="Safety Inspector",
        level=SpecialistLevel.L3_SPECIALIST,
        domain=SpecialistDomain.SAFETY,
        icon="🔍",
        description="Inspections de sécurité sur les chantiers",
        system_prompt="""Tu es Inspecteur Sécurité chez CHE·NU. Tu effectues des inspections régulières,
identifies les risques et recommandes des mesures correctives.""",
        reports_to="safety_director",
        tools=["inspection_app", "risk_assessor", "photo_documenter"],
    ),
    
    # === FINANCE ===
    "accountant": Specialist(
        id="accountant",
        name="Comptable",
        name_en="Accountant",
        level=SpecialistLevel.L2_MANAGER,
        domain=SpecialistDomain.FINANCE,
        icon="📚",
        description="Comptabilité et états financiers",
        system_prompt="""Tu es Comptable chez CHE·NU. Tu gères la comptabilité générale,
prépares les états financiers et assures la conformité fiscale.""",
        reports_to="finance_director",
        tools=["accounting_software", "tax_calculator", "report_generator"],
        certifications=["CPA"],
    ),
    
    "billing_specialist": Specialist(
        id="billing_specialist",
        name="Spécialiste Facturation",
        name_en="Billing Specialist",
        level=SpecialistLevel.L3_SPECIALIST,
        domain=SpecialistDomain.FINANCE,
        icon="💵",
        description="Facturation et comptes clients",
        system_prompt="""Tu es Spécialiste Facturation chez CHE·NU. Tu prépares les factures,
gères les comptes clients et assures le suivi des paiements.""",
        reports_to="accountant",
        tools=["invoice_generator", "ar_tracker", "payment_processor"],
    ),
    
    # === ENGINEERING ===
    "structural_engineer": Specialist(
        id="structural_engineer",
        name="Ingénieur Structure",
        name_en="Structural Engineer",
        level=SpecialistLevel.L2_MANAGER,
        domain=SpecialistDomain.ENGINEERING,
        icon="🏗️",
        description="Calculs et conception structurale",
        system_prompt="""Tu es Ingénieur Structure chez CHE·NU. Tu conçois et vérifies
les structures, effectues les calculs de charge et assures la sécurité structurale.""",
        reports_to="engineering_director",
        tools=["structural_calculator", "cad_tool", "load_analyzer"],
        certifications=["P.Eng", "Structural Engineering"],
    ),
    
    "mep_engineer": Specialist(
        id="mep_engineer",
        name="Ingénieur MEP",
        name_en="MEP Engineer",
        level=SpecialistLevel.L2_MANAGER,
        domain=SpecialistDomain.ENGINEERING,
        icon="⚡",
        description="Mécanique, Électrique, Plomberie",
        system_prompt="""Tu es Ingénieur MEP chez CHE·NU. Tu conçois les systèmes mécaniques,
électriques et de plomberie pour les bâtiments.""",
        reports_to="engineering_director",
        tools=["hvac_calculator", "electrical_designer", "plumbing_tool"],
        certifications=["P.Eng", "MEP Specialist"],
    ),
    
    # === HR ===
    "recruiter": Specialist(
        id="recruiter",
        name="Recruteur",
        name_en="Recruiter",
        level=SpecialistLevel.L3_SPECIALIST,
        domain=SpecialistDomain.HR,
        icon="🔍",
        description="Recrutement et acquisition de talents",
        system_prompt="""Tu es Recruteur chez CHE·NU. Tu identifies, évalues et recrutes
les meilleurs talents pour l'entreprise.""",
        reports_to="hr_director",
        tools=["ats_system", "job_board", "interview_scheduler"],
    ),
    
    # === OPERATIONS ===
    "scheduler": Specialist(
        id="scheduler",
        name="Planificateur",
        name_en="Scheduler",
        level=SpecialistLevel.L3_SPECIALIST,
        domain=SpecialistDomain.OPERATIONS,
        icon="📅",
        description="Planification des ressources et équipes",
        system_prompt="""Tu es Planificateur chez CHE·NU. Tu coordonnes les horaires,
assigns les équipes et optimises l'utilisation des ressources.""",
        reports_to="operations_director",
        tools=["scheduling_tool", "resource_optimizer", "calendar_sync"],
    ),
    
    # === CUSTOMER ===
    "account_manager": Specialist(
        id="account_manager",
        name="Gestionnaire de Compte",
        name_en="Account Manager",
        level=SpecialistLevel.L2_MANAGER,
        domain=SpecialistDomain.CUSTOMER,
        icon="🤝",
        description="Gestion des relations clients",
        system_prompt="""Tu es Gestionnaire de Compte chez CHE·NU. Tu maintiens
d'excellentes relations avec les clients et assures leur satisfaction.""",
        reports_to="customer_success_director",
        tools=["crm_tool", "client_portal", "feedback_collector"],
    ),
}


def get_specialist(specialist_id: str) -> Optional[Specialist]:
    """Get a specialist by ID."""
    return SPECIALISTS.get(specialist_id)


def get_all_specialists() -> List[Specialist]:
    """Get all specialists."""
    return list(SPECIALISTS.values())


def get_specialists_by_domain(domain: SpecialistDomain) -> List[Specialist]:
    """Get specialists by domain."""
    return [s for s in SPECIALISTS.values() if s.domain == domain]


def get_specialists_by_level(level: SpecialistLevel) -> List[Specialist]:
    """Get specialists by level."""
    return [s for s in SPECIALISTS.values() if s.level == level]


def get_team_for_director(director_id: str) -> List[Specialist]:
    """Get all specialists reporting to a director."""
    return [s for s in SPECIALISTS.values() if s.reports_to == director_id]
