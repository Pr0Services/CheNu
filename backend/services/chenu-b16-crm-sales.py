"""
CHE·NU™ — B16-2: CRM - LEADS & SALES PIPELINE
- Lead capture
- Pipeline stages
- Lead scoring
- Follow-up tasks
- Proposal generation
- Win/loss tracking
- Sales forecasting
"""

from typing import Any, Dict, List, Optional
from datetime import datetime, date, timedelta
from enum import Enum
from dataclasses import dataclass
from decimal import Decimal
import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/crm", tags=["CRM & Sales"])

class LeadSource(str, Enum):
    WEBSITE = "website"
    REFERRAL = "referral"
    SOCIAL = "social"
    AD = "advertising"
    COLD_CALL = "cold_call"
    TRADE_SHOW = "trade_show"
    OTHER = "other"

class LeadStatus(str, Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    WON = "won"
    LOST = "lost"

class ProjectType(str, Enum):
    RESIDENTIAL_NEW = "residential_new"
    RESIDENTIAL_RENO = "residential_reno"
    COMMERCIAL = "commercial"
    INDUSTRIAL = "industrial"
    INSTITUTIONAL = "institutional"

class ActivityType(str, Enum):
    CALL = "call"
    EMAIL = "email"
    MEETING = "meeting"
    SITE_VISIT = "site_visit"
    PROPOSAL_SENT = "proposal_sent"
    NOTE = "note"

@dataclass
class Lead:
    id: str
    name: str
    email: str
    phone: str
    company: Optional[str]
    source: LeadSource
    status: LeadStatus
    project_type: ProjectType
    project_address: str
    estimated_value: Decimal
    estimated_sqft: int
    score: int  # 0-100
    assigned_to: str
    notes: str
    tags: List[str]
    created_at: datetime
    updated_at: datetime
    expected_close: Optional[date]
    lost_reason: Optional[str]

@dataclass
class Activity:
    id: str
    lead_id: str
    type: ActivityType
    subject: str
    description: str
    outcome: Optional[str]
    scheduled_at: Optional[datetime]
    completed_at: Optional[datetime]
    created_by: str
    created_at: datetime

@dataclass
class Proposal:
    id: str
    lead_id: str
    number: str
    version: int
    total_amount: Decimal
    valid_until: date
    sent_at: Optional[datetime]
    viewed_at: Optional[datetime]
    status: str  # draft, sent, viewed, accepted, rejected
    pdf_url: str

class LeadScoring:
    CRITERIA = {
        "budget_match": 25,      # Budget dans notre range
        "timeline_urgent": 20,   # Veut commencer bientôt
        "decision_maker": 15,    # Contact = décideur
        "project_fit": 15,       # Type de projet qu'on fait
        "location": 10,          # Dans notre zone
        "referral": 10,          # Source = référence
        "engaged": 5,            # Répond aux communications
    }
    
    @classmethod
    def calculate(cls, lead: Lead, factors: Dict[str, bool]) -> int:
        score = 0
        for factor, has_factor in factors.items():
            if has_factor and factor in cls.CRITERIA:
                score += cls.CRITERIA[factor]
        return min(score, 100)

class CRMManager:
    _leads: Dict[str, Lead] = {}
    _activities: List[Activity] = []
    _proposals: Dict[str, Proposal] = {}
    _counter = 1000
    
    # Sample leads
    _samples = [
        ("Marie Lavoie", "marie@email.com", LeadStatus.PROPOSAL, ProjectType.RESIDENTIAL_NEW, 450000, 85),
        ("Pierre Gagnon", "pierre@email.com", LeadStatus.QUALIFIED, ProjectType.RESIDENTIAL_RENO, 85000, 70),
        ("Jean Tremblay", "jean@corp.com", LeadStatus.NEW, ProjectType.COMMERCIAL, 1200000, 45),
        ("Sophie Martin", "sophie@email.com", LeadStatus.NEGOTIATION, ProjectType.RESIDENTIAL_NEW, 380000, 90),
        ("Luc Dubois", "luc@email.com", LeadStatus.CONTACTED, ProjectType.RESIDENTIAL_RENO, 65000, 55),
    ]
    
    for name, email, status, ptype, value, score in _samples:
        lead = Lead(
            f"lead_{uuid.uuid4().hex[:8]}", name, email, "450-555-0000", None,
            LeadSource.REFERRAL, status, ptype, "123 Rue Test, Granby",
            Decimal(str(value)), 2500, score, "sales_rep", "", ["granby"],
            datetime.utcnow(), datetime.utcnow(),
            date.today() + timedelta(days=30), None
        )
        _leads[lead.id] = lead
    
    @classmethod
    async def create_lead(cls, name: str, email: str, phone: str, source: LeadSource,
                         project_type: ProjectType, address: str, value: float) -> Lead:
        lead = Lead(
            f"lead_{uuid.uuid4().hex[:8]}", name, email, phone, None,
            source, LeadStatus.NEW, project_type, address,
            Decimal(str(value)), 0, 0, "sales_rep", "", [],
            datetime.utcnow(), datetime.utcnow(), None, None
        )
        cls._leads[lead.id] = lead
        return lead
    
    @classmethod
    async def update_status(cls, lead_id: str, status: LeadStatus, reason: str = None) -> Lead:
        lead = cls._leads.get(lead_id)
        if not lead:
            raise HTTPException(404, "Lead not found")
        lead.status = status
        lead.updated_at = datetime.utcnow()
        if status == LeadStatus.LOST:
            lead.lost_reason = reason
        return lead
    
    @classmethod
    async def get_pipeline(cls) -> Dict:
        pipeline = {status.value: [] for status in LeadStatus}
        for lead in cls._leads.values():
            pipeline[lead.status.value].append({
                "id": lead.id, "name": lead.name, "value": float(lead.estimated_value),
                "score": lead.score, "expected_close": lead.expected_close.isoformat() if lead.expected_close else None
            })
        
        totals = {status: sum(l["value"] for l in leads) for status, leads in pipeline.items()}
        return {"pipeline": pipeline, "totals": totals}
    
    @classmethod
    async def add_activity(cls, lead_id: str, act_type: ActivityType, subject: str,
                          description: str, scheduled: datetime = None) -> Activity:
        activity = Activity(
            f"act_{uuid.uuid4().hex[:8]}", lead_id, act_type, subject, description,
            None, scheduled, None, "user", datetime.utcnow()
        )
        cls._activities.append(activity)
        return activity
    
    @classmethod
    async def get_activities(cls, lead_id: str) -> List[Dict]:
        acts = [a for a in cls._activities if a.lead_id == lead_id]
        return [{"id": a.id, "type": a.type.value, "subject": a.subject,
                 "scheduled": a.scheduled_at.isoformat() if a.scheduled_at else None} for a in acts]
    
    @classmethod
    async def create_proposal(cls, lead_id: str, amount: float, valid_days: int = 30) -> Proposal:
        lead = cls._leads.get(lead_id)
        if not lead:
            raise HTTPException(404, "Lead not found")
        
        cls._counter += 1
        existing = [p for p in cls._proposals.values() if p.lead_id == lead_id]
        version = len(existing) + 1
        
        proposal = Proposal(
            f"prop_{uuid.uuid4().hex[:8]}", lead_id, f"PROP-{cls._counter}",
            version, Decimal(str(amount)), date.today() + timedelta(days=valid_days),
            None, None, "draft", f"/proposals/PROP-{cls._counter}.pdf"
        )
        cls._proposals[proposal.id] = proposal
        
        lead.status = LeadStatus.PROPOSAL
        lead.updated_at = datetime.utcnow()
        
        return proposal
    
    @classmethod
    async def get_forecast(cls, months: int = 3) -> Dict:
        today = date.today()
        forecast = {}
        
        for i in range(months):
            month_start = date(today.year, today.month + i, 1) if today.month + i <= 12 else date(today.year + 1, (today.month + i) % 12, 1)
            month_name = month_start.strftime("%B %Y")
            
            leads_closing = [l for l in cls._leads.values() 
                           if l.expected_close and l.expected_close.month == month_start.month
                           and l.status not in [LeadStatus.LOST, LeadStatus.WON]]
            
            forecast[month_name] = {
                "weighted": sum(float(l.estimated_value) * l.score / 100 for l in leads_closing),
                "best_case": sum(float(l.estimated_value) for l in leads_closing),
                "deals": len(leads_closing)
            }
        
        return {"forecast": forecast}
    
    @classmethod
    async def get_stats(cls) -> Dict:
        leads = list(cls._leads.values())
        won = [l for l in leads if l.status == LeadStatus.WON]
        lost = [l for l in leads if l.status == LeadStatus.LOST]
        
        return {
            "total_leads": len(leads),
            "won": len(won),
            "lost": len(lost),
            "win_rate": round(len(won) / max(len(won) + len(lost), 1) * 100, 1),
            "total_pipeline_value": float(sum(l.estimated_value for l in leads if l.status not in [LeadStatus.WON, LeadStatus.LOST])),
            "avg_deal_size": float(sum(l.estimated_value for l in won) / max(len(won), 1)),
            "by_source": {s.value: len([l for l in leads if l.source == s]) for s in LeadSource},
        }

# API Endpoints
@router.get("/leads")
async def list_leads(status: Optional[LeadStatus] = None):
    leads = list(CRMManager._leads.values())
    if status:
        leads = [l for l in leads if l.status == status]
    return {"leads": [{"id": l.id, "name": l.name, "status": l.status.value, 
                       "value": float(l.estimated_value), "score": l.score} for l in leads]}

@router.post("/leads")
async def create_lead(name: str, email: str, phone: str, source: LeadSource,
                     project_type: ProjectType, address: str, value: float):
    lead = await CRMManager.create_lead(name, email, phone, source, project_type, address, value)
    return {"id": lead.id}

@router.patch("/leads/{lead_id}/status")
async def update_lead_status(lead_id: str, status: LeadStatus, reason: str = None):
    lead = await CRMManager.update_status(lead_id, status, reason)
    return {"id": lead.id, "status": lead.status.value}

@router.get("/pipeline")
async def get_pipeline():
    return await CRMManager.get_pipeline()

@router.post("/leads/{lead_id}/activities")
async def add_activity(lead_id: str, type: ActivityType, subject: str, description: str):
    activity = await CRMManager.add_activity(lead_id, type, subject, description)
    return {"id": activity.id}

@router.get("/leads/{lead_id}/activities")
async def get_activities(lead_id: str):
    return {"activities": await CRMManager.get_activities(lead_id)}

@router.post("/leads/{lead_id}/proposals")
async def create_proposal(lead_id: str, amount: float, valid_days: int = 30):
    proposal = await CRMManager.create_proposal(lead_id, amount, valid_days)
    return {"id": proposal.id, "number": proposal.number}

@router.get("/forecast")
async def get_forecast(months: int = 3):
    return await CRMManager.get_forecast(months)

@router.get("/stats")
async def get_stats():
    return await CRMManager.get_stats()
