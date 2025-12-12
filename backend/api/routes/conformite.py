"""
CHE·NU Backend - Conformité Quebec Routes
=========================================
Quebec compliance endpoints (RBQ, CNESST, CCQ).
"""

from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, date
from uuid import uuid4

router = APIRouter()


# ─────────────────────────────────────────────────────
# RBQ (Régie du bâtiment du Québec)
# ─────────────────────────────────────────────────────

class RBQLicenseInfo(BaseModel):
    license_number: str
    holder_name: str
    company_name: Optional[str]
    status: str  # active, suspended, revoked, expired
    categories: list[str]
    valid_until: date
    restrictions: Optional[list[str]] = None


@router.get("/rbq/verify/{license_number}", response_model=RBQLicenseInfo)
async def verify_rbq_license(license_number: str):
    """Verify an RBQ contractor license."""
    # Mock verification - in production, call RBQ API
    if not license_number.startswith("RBQ"):
        # Simulate found license
        return RBQLicenseInfo(
            license_number=license_number,
            holder_name="Jean Tremblay",
            company_name="Construction Tremblay Inc.",
            status="active",
            categories=["1.1.1 - Bâtiments résidentiels neufs", "1.2 - Rénovation résidentielle"],
            valid_until=date(2025, 12, 31),
            restrictions=None
        )
    raise HTTPException(status_code=404, detail="Licence non trouvée")


# ─────────────────────────────────────────────────────
# CNESST (Santé et sécurité au travail)
# ─────────────────────────────────────────────────────

class CnessstIncident(BaseModel):
    incident_type: str
    description: str
    date: datetime
    location: str
    severity: str  # minor, moderate, serious, critical
    injured_workers: int = 0
    witnesses: Optional[list[str]] = None


class CnessstIncidentResponse(BaseModel):
    id: str
    status: str
    reference_number: str
    submitted_at: datetime


@router.post("/cnesst/incident", response_model=CnessstIncidentResponse)
async def submit_cnesst_incident(incident: CnessstIncident):
    """Submit a workplace incident to CNESST."""
    incident_id = f"INC_{uuid4().hex[:8].upper()}"
    
    return CnessstIncidentResponse(
        id=incident_id,
        status="submitted",
        reference_number=f"CNESST-2025-{uuid4().hex[:6].upper()}",
        submitted_at=datetime.utcnow()
    )


@router.get("/cnesst/requirements/{project_type}")
async def get_cnesst_requirements(project_type: str):
    """Get CNESST safety requirements for a project type."""
    requirements = {
        "residential": {
            "required_documents": ["Plan de prévention", "Registre des accidents"],
            "ppe_required": ["Casque", "Bottes de sécurité", "Lunettes de protection"],
            "training_required": ["Santé et sécurité générale", "Travail en hauteur si applicable"],
            "inspections": ["Hebdomadaire par le maître d'oeuvre"]
        },
        "commercial": {
            "required_documents": ["Plan de prévention", "Programme de santé", "Registre des accidents"],
            "ppe_required": ["Casque", "Bottes de sécurité", "Lunettes de protection", "Gilet haute visibilité"],
            "training_required": ["Santé et sécurité générale", "Travail en hauteur", "Espaces clos si applicable"],
            "inspections": ["Quotidienne pour chantiers majeurs"]
        }
    }
    
    if project_type.lower() not in requirements:
        return requirements["residential"]  # Default
    
    return requirements[project_type.lower()]


# ─────────────────────────────────────────────────────
# CCQ (Commission de la construction du Québec)
# ─────────────────────────────────────────────────────

class CCQCardInfo(BaseModel):
    card_number: str
    holder_name: str
    trade: str
    status: str  # valid, expired, suspended
    valid_until: date
    region: str
    apprentice: bool = False


@router.get("/ccq/verify/{card_number}", response_model=CCQCardInfo)
async def verify_ccq_card(card_number: str):
    """Verify a CCQ competency card."""
    # Mock verification
    return CCQCardInfo(
        card_number=card_number,
        holder_name="Pierre Gagnon",
        trade="Charpentier-menuisier",
        status="valid",
        valid_until=date(2026, 3, 31),
        region="Montréal",
        apprentice=False
    )


@router.get("/ccq/trades")
async def get_ccq_trades():
    """Get list of CCQ-recognized trades."""
    return {
        "trades": [
            {"code": "01", "name": "Charpentier-menuisier"},
            {"code": "02", "name": "Électricien"},
            {"code": "03", "name": "Plombier"},
            {"code": "04", "name": "Ferblantier"},
            {"code": "05", "name": "Frigoriste"},
            {"code": "06", "name": "Peintre"},
            {"code": "07", "name": "Poseur de systèmes intérieurs"},
            {"code": "08", "name": "Calorifugeur"},
            {"code": "09", "name": "Briqueteur-maçon"},
            {"code": "10", "name": "Carreleur"},
            {"code": "11", "name": "Cimentier-applicateur"},
            {"code": "12", "name": "Couvreur"},
            {"code": "13", "name": "Grutier"},
            {"code": "14", "name": "Mécanicien d'ascenseur"},
            {"code": "15", "name": "Mécanicien de machines lourdes"},
            {"code": "16", "name": "Monteur-mécanicien (vitrier)"},
            {"code": "17", "name": "Opérateur d'équipement lourd"},
            {"code": "18", "name": "Soudeur"},
            {"code": "19", "name": "Tuyauteur"},
        ]
    }


@router.get("/ccq/jurisdiction/{postal_code}")
async def check_ccq_jurisdiction(postal_code: str):
    """Check if a location is under CCQ jurisdiction."""
    # In Quebec, most construction is under CCQ
    if postal_code.upper().startswith(("G", "H", "J")):
        return {
            "under_ccq": True,
            "region": "Québec" if postal_code.startswith("G") else "Montréal" if postal_code.startswith("H") else "Autres régions",
            "notes": "Travaux de construction assujettis à la Loi R-20"
        }
    return {
        "under_ccq": False,
        "notes": "Code postal hors Québec"
    }
