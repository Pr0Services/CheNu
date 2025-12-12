"""
CHE·NU™ — B16-3: MATERIAL CALCULATOR + SUBCONTRACTORS
- Material estimator (concrete, lumber, drywall, etc.)
- Waste factors
- Quebec supplier prices (BMR, RONA)
- Subcontractor database
- RFQ management
- Performance tracking
"""

from typing import Any, Dict, List, Optional
from datetime import datetime, date
from enum import Enum
from dataclasses import dataclass
from decimal import Decimal
import uuid
import math

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/materials", tags=["Materials & Subcontractors"])

class MaterialCategory(str, Enum):
    CONCRETE = "concrete"
    LUMBER = "lumber"
    DRYWALL = "drywall"
    INSULATION = "insulation"
    ROOFING = "roofing"
    FLOORING = "flooring"
    PLUMBING = "plumbing"
    ELECTRICAL = "electrical"
    PAINT = "paint"

class SubcontractorTrade(str, Enum):
    ELECTRICAL = "electrical"
    PLUMBING = "plumbing"
    HVAC = "hvac"
    ROOFING = "roofing"
    CONCRETE = "concrete"
    FRAMING = "framing"
    DRYWALL = "drywall"
    PAINTING = "painting"
    FLOORING = "flooring"
    EXCAVATION = "excavation"
    LANDSCAPING = "landscaping"

class RFQStatus(str, Enum):
    DRAFT = "draft"
    SENT = "sent"
    RECEIVED = "received"
    AWARDED = "awarded"
    DECLINED = "declined"

@dataclass
class MaterialItem:
    id: str
    category: MaterialCategory
    name: str
    unit: str
    unit_price: Decimal
    supplier: str
    sku: str

@dataclass
class Subcontractor:
    id: str
    company_name: str
    contact_name: str
    email: str
    phone: str
    trades: List[SubcontractorTrade]
    license_rbq: str
    insurance_expiry: date
    wcb_number: str
    rating: float  # 1-5
    completed_projects: int
    avg_bid_accuracy: float
    on_time_percent: float
    notes: str
    active: bool

@dataclass
class RFQ:
    id: str
    project_id: str
    trade: SubcontractorTrade
    scope: str
    specs: str
    due_date: date
    subcontractors: List[str]  # IDs
    quotes: List[Dict]
    status: RFQStatus
    awarded_to: Optional[str]
    created_at: datetime

# Material calculation formulas
class MaterialCalculator:
    # Prices in CAD (Quebec market approximations)
    MATERIALS = {
        MaterialCategory.CONCRETE: [
            {"name": "Béton 30MPa", "unit": "m³", "price": 180.00, "sku": "CONC-30MPA"},
            {"name": "Béton 25MPa", "unit": "m³", "price": 165.00, "sku": "CONC-25MPA"},
            {"name": "Armature #10", "unit": "kg", "price": 1.50, "sku": "REBAR-10"},
            {"name": "Armature #15", "unit": "kg", "price": 1.60, "sku": "REBAR-15"},
            {"name": "Coffrage", "unit": "m²", "price": 25.00, "sku": "FORM-STD"},
        ],
        MaterialCategory.LUMBER: [
            {"name": "2x4x8 SPF", "unit": "pce", "price": 8.50, "sku": "LUM-2x4x8"},
            {"name": "2x6x8 SPF", "unit": "pce", "price": 12.00, "sku": "LUM-2x6x8"},
            {"name": "2x10x12 SPF", "unit": "pce", "price": 28.00, "sku": "LUM-2x10x12"},
            {"name": "Contreplaqué 4x8 1/2", "unit": "feuille", "price": 45.00, "sku": "PLY-12"},
            {"name": "OSB 4x8 7/16", "unit": "feuille", "price": 32.00, "sku": "OSB-716"},
        ],
        MaterialCategory.DRYWALL: [
            {"name": "Gypse 4x8 1/2", "unit": "feuille", "price": 18.00, "sku": "GYP-12"},
            {"name": "Gypse 4x8 5/8 Type X", "unit": "feuille", "price": 24.00, "sku": "GYP-58X"},
            {"name": "Composé à joints", "unit": "seau", "price": 22.00, "sku": "COMP-20L"},
            {"name": "Ruban papier", "unit": "rouleau", "price": 8.00, "sku": "TAPE-150"},
            {"name": "Vis gypse 1-1/4", "unit": "boîte", "price": 12.00, "sku": "SCREW-GYP"},
        ],
        MaterialCategory.INSULATION: [
            {"name": "Isolant R-20 (ballot)", "unit": "ballot", "price": 55.00, "sku": "INS-R20"},
            {"name": "Isolant R-24 (ballot)", "unit": "ballot", "price": 65.00, "sku": "INS-R24"},
            {"name": "Isolant R-40 (ballot)", "unit": "ballot", "price": 85.00, "sku": "INS-R40"},
            {"name": "Pare-vapeur 6mil", "unit": "rouleau", "price": 45.00, "sku": "VAP-6MIL"},
            {"name": "Mousse giclée", "unit": "pi²", "price": 2.50, "sku": "FOAM-SPRAY"},
        ],
        MaterialCategory.ROOFING: [
            {"name": "Bardeaux (paquet)", "unit": "paquet", "price": 35.00, "sku": "SHING-STD"},
            {"name": "Membrane élastomère", "unit": "rouleau", "price": 180.00, "sku": "MEMB-ELAST"},
            {"name": "Papier feutre #30", "unit": "rouleau", "price": 45.00, "sku": "FELT-30"},
            {"name": "Solin aluminium", "unit": "pce", "price": 12.00, "sku": "FLASH-ALU"},
            {"name": "Clous toiture", "unit": "boîte", "price": 35.00, "sku": "NAIL-ROOF"},
        ],
    }
    
    WASTE_FACTORS = {
        MaterialCategory.CONCRETE: 0.05,
        MaterialCategory.LUMBER: 0.10,
        MaterialCategory.DRYWALL: 0.12,
        MaterialCategory.INSULATION: 0.08,
        MaterialCategory.ROOFING: 0.15,
        MaterialCategory.FLOORING: 0.10,
        MaterialCategory.PAINT: 0.10,
    }
    
    @classmethod
    async def calculate_concrete(cls, length_m: float, width_m: float, depth_m: float) -> Dict:
        volume = length_m * width_m * depth_m
        waste = cls.WASTE_FACTORS[MaterialCategory.CONCRETE]
        volume_with_waste = volume * (1 + waste)
        
        # Rebar estimation (approx 80kg per m³)
        rebar_kg = volume * 80
        
        return {
            "volume_m3": round(volume, 2),
            "volume_with_waste": round(volume_with_waste, 2),
            "waste_percent": waste * 100,
            "rebar_kg": round(rebar_kg, 1),
            "materials": [
                {"name": "Béton 30MPa", "qty": math.ceil(volume_with_waste), "unit": "m³", "price": 180 * math.ceil(volume_with_waste)},
                {"name": "Armature", "qty": round(rebar_kg, 0), "unit": "kg", "price": round(rebar_kg * 1.5, 2)},
            ],
            "total_cost": round(180 * volume_with_waste + rebar_kg * 1.5, 2)
        }
    
    @classmethod
    async def calculate_framing(cls, wall_length_m: float, wall_height_m: float, stud_spacing_cm: int = 40) -> Dict:
        # Studs
        num_studs = math.ceil(wall_length_m * 100 / stud_spacing_cm) + 1
        # Plates (top and bottom, doubled top)
        plates = math.ceil(wall_length_m / 2.44) * 3  # 2.44m = 8ft
        # Headers (assume 10% of wall is openings)
        headers = math.ceil(wall_length_m * 0.1 / 2.44) * 2
        
        waste = cls.WASTE_FACTORS[MaterialCategory.LUMBER]
        
        return {
            "studs_2x4": math.ceil(num_studs * (1 + waste)),
            "plates_2x4": math.ceil(plates * (1 + waste)),
            "headers_2x10": math.ceil(headers * (1 + waste)),
            "waste_percent": waste * 100,
            "materials": [
                {"name": "2x4x8 SPF", "qty": math.ceil((num_studs + plates) * (1 + waste)), "unit": "pce", "price": round(8.5 * (num_studs + plates) * (1 + waste), 2)},
                {"name": "2x10x12 SPF", "qty": math.ceil(headers * (1 + waste)), "unit": "pce", "price": round(28 * headers * (1 + waste), 2)},
            ],
        }
    
    @classmethod
    async def calculate_drywall(cls, area_sqm: float) -> Dict:
        sqft = area_sqm * 10.764
        sheets = math.ceil(sqft / 32)  # 4x8 = 32 sqft
        waste = cls.WASTE_FACTORS[MaterialCategory.DRYWALL]
        sheets_with_waste = math.ceil(sheets * (1 + waste))
        
        # Mud: 1 bucket per 40 sheets
        mud_buckets = math.ceil(sheets_with_waste / 40)
        # Tape: 1 roll per 20 sheets
        tape_rolls = math.ceil(sheets_with_waste / 20)
        # Screws: 1 box per 15 sheets
        screw_boxes = math.ceil(sheets_with_waste / 15)
        
        return {
            "area_sqm": area_sqm,
            "area_sqft": round(sqft, 1),
            "sheets_4x8": sheets_with_waste,
            "waste_percent": waste * 100,
            "materials": [
                {"name": "Gypse 4x8 1/2", "qty": sheets_with_waste, "unit": "feuille", "price": 18 * sheets_with_waste},
                {"name": "Composé à joints", "qty": mud_buckets, "unit": "seau", "price": 22 * mud_buckets},
                {"name": "Ruban papier", "qty": tape_rolls, "unit": "rouleau", "price": 8 * tape_rolls},
                {"name": "Vis gypse", "qty": screw_boxes, "unit": "boîte", "price": 12 * screw_boxes},
            ],
        }
    
    @classmethod
    async def get_price_list(cls, category: Optional[MaterialCategory] = None) -> Dict:
        if category:
            return {"materials": cls.MATERIALS.get(category, [])}
        return {"materials": cls.MATERIALS}

class SubcontractorManager:
    _subs: Dict[str, Subcontractor] = {}
    _rfqs: Dict[str, RFQ] = {}
    
    # Sample subcontractors
    _samples = [
        ("Électricité Granby Inc.", "Marc Leblanc", SubcontractorTrade.ELECTRICAL, "5678-1234-01", 4.8),
        ("Plomberie Pro", "Julie Roy", SubcontractorTrade.PLUMBING, "5678-2345-01", 4.5),
        ("Toiture Expert", "Pierre Morin", SubcontractorTrade.ROOFING, "5678-3456-01", 4.2),
        ("Excavation XYZ", "Luc Gagnon", SubcontractorTrade.EXCAVATION, "5678-4567-01", 4.6),
        ("Béton Estrie", "Marie Côté", SubcontractorTrade.CONCRETE, "5678-5678-01", 4.9),
    ]
    
    for company, contact, trade, rbq, rating in _samples:
        sub = Subcontractor(
            f"sub_{uuid.uuid4().hex[:8]}", company, contact, f"{contact.lower().replace(' ', '.')}@email.com",
            "450-555-0000", [trade], rbq, date.today() + timedelta(days=365),
            "QC12345", rating, 25, 95.0, 92.0, "", True
        )
        _subs[sub.id] = sub
    
    @classmethod
    async def get_subcontractors(cls, trade: Optional[SubcontractorTrade] = None) -> List[Dict]:
        subs = list(cls._subs.values())
        if trade:
            subs = [s for s in subs if trade in s.trades]
        return [{"id": s.id, "company": s.company_name, "contact": s.contact_name,
                 "trades": [t.value for t in s.trades], "rating": s.rating,
                 "rbq": s.license_rbq} for s in subs if s.active]
    
    @classmethod
    async def add_subcontractor(cls, company: str, contact: str, email: str, phone: str,
                               trades: List[SubcontractorTrade], rbq: str) -> Subcontractor:
        sub = Subcontractor(
            f"sub_{uuid.uuid4().hex[:8]}", company, contact, email, phone,
            trades, rbq, date.today() + timedelta(days=365), "", 0.0, 0, 0.0, 0.0, "", True
        )
        cls._subs[sub.id] = sub
        return sub
    
    @classmethod
    async def create_rfq(cls, project_id: str, trade: SubcontractorTrade, scope: str,
                        specs: str, due_date: date, sub_ids: List[str]) -> RFQ:
        rfq = RFQ(
            f"rfq_{uuid.uuid4().hex[:8]}", project_id, trade, scope, specs,
            due_date, sub_ids, [], RFQStatus.DRAFT, None, datetime.utcnow()
        )
        cls._rfqs[rfq.id] = rfq
        return rfq
    
    @classmethod
    async def send_rfq(cls, rfq_id: str) -> RFQ:
        rfq = cls._rfqs.get(rfq_id)
        if not rfq:
            raise HTTPException(404, "RFQ not found")
        rfq.status = RFQStatus.SENT
        # In production: send emails to subcontractors
        return rfq
    
    @classmethod
    async def submit_quote(cls, rfq_id: str, sub_id: str, amount: float, notes: str) -> Dict:
        rfq = cls._rfqs.get(rfq_id)
        if not rfq:
            raise HTTPException(404, "RFQ not found")
        
        quote = {"sub_id": sub_id, "amount": amount, "notes": notes, "submitted_at": datetime.utcnow().isoformat()}
        rfq.quotes.append(quote)
        rfq.status = RFQStatus.RECEIVED
        return quote
    
    @classmethod
    async def award_rfq(cls, rfq_id: str, sub_id: str) -> RFQ:
        rfq = cls._rfqs.get(rfq_id)
        if not rfq:
            raise HTTPException(404, "RFQ not found")
        rfq.awarded_to = sub_id
        rfq.status = RFQStatus.AWARDED
        return rfq

# API Endpoints
@router.get("/prices")
async def get_prices(category: Optional[MaterialCategory] = None):
    return await MaterialCalculator.get_price_list(category)

@router.post("/calculate/concrete")
async def calc_concrete(length: float, width: float, depth: float):
    return await MaterialCalculator.calculate_concrete(length, width, depth)

@router.post("/calculate/framing")
async def calc_framing(length: float, height: float, spacing: int = 40):
    return await MaterialCalculator.calculate_framing(length, height, spacing)

@router.post("/calculate/drywall")
async def calc_drywall(area_sqm: float):
    return await MaterialCalculator.calculate_drywall(area_sqm)

@router.get("/subcontractors")
async def list_subs(trade: Optional[SubcontractorTrade] = None):
    return {"subcontractors": await SubcontractorManager.get_subcontractors(trade)}

@router.post("/subcontractors")
async def add_sub(company: str, contact: str, email: str, phone: str,
                 trades: List[SubcontractorTrade], rbq: str):
    sub = await SubcontractorManager.add_subcontractor(company, contact, email, phone, trades, rbq)
    return {"id": sub.id}

@router.post("/rfq")
async def create_rfq(project_id: str, trade: SubcontractorTrade, scope: str,
                    specs: str, due_date: str, sub_ids: List[str]):
    rfq = await SubcontractorManager.create_rfq(project_id, trade, scope, specs, date.fromisoformat(due_date), sub_ids)
    return {"id": rfq.id}

@router.post("/rfq/{rfq_id}/send")
async def send_rfq(rfq_id: str):
    rfq = await SubcontractorManager.send_rfq(rfq_id)
    return {"id": rfq.id, "status": rfq.status.value}

@router.post("/rfq/{rfq_id}/quote")
async def submit_quote(rfq_id: str, sub_id: str, amount: float, notes: str = ""):
    return await SubcontractorManager.submit_quote(rfq_id, sub_id, amount, notes)

@router.post("/rfq/{rfq_id}/award")
async def award_rfq(rfq_id: str, sub_id: str):
    rfq = await SubcontractorManager.award_rfq(rfq_id, sub_id)
    return {"id": rfq.id, "awarded_to": rfq.awarded_to}
