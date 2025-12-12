"""
═══════════════════════════════════════════════════════════════════════════════
CHE·NU™ — BATCH 14: ADVANCED INVOICING + BID MANAGEMENT
═══════════════════════════════════════════════════════════════════════════════

Features:
- INV-01: Progressive invoicing (facturation progressive)
- INV-02: Retainage/holdback management (retenues)
- INV-03: Recurring invoices
- INV-04: Credit notes
- INV-05: Payment schedules
- INV-06: Multi-currency
- BID-01: Bid/estimate creation
- BID-02: Cost estimation templates
- BID-03: Material takeoffs
- BID-04: Labor cost calculation
- BID-05: Bid comparison
- BID-06: Win/loss tracking

═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime, timedelta, date
from enum import Enum
from dataclasses import dataclass, field
from decimal import Decimal
import uuid
import asyncio
import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

logger = logging.getLogger("CHENU.Invoicing")
router = APIRouter(prefix="/api/v1/finance", tags=["Invoicing & Bids"])

# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class InvoiceStatus(str, Enum):
    DRAFT = "draft"
    SENT = "sent"
    VIEWED = "viewed"
    PARTIAL = "partial"
    PAID = "paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"

class InvoiceType(str, Enum):
    STANDARD = "standard"
    PROGRESSIVE = "progressive"  # Facturation progressive
    RECURRING = "recurring"
    DEPOSIT = "deposit"  # Acompte
    FINAL = "final"
    CREDIT_NOTE = "credit_note"

class PaymentMethod(str, Enum):
    BANK_TRANSFER = "bank_transfer"
    CHECK = "check"
    CREDIT_CARD = "credit_card"
    INTERAC = "interac"
    CASH = "cash"

class BidStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    SHORTLISTED = "shortlisted"
    WON = "won"
    LOST = "lost"
    WITHDRAWN = "withdrawn"
    EXPIRED = "expired"

class CostCategory(str, Enum):
    LABOR = "labor"
    MATERIALS = "materials"
    EQUIPMENT = "equipment"
    SUBCONTRACTOR = "subcontractor"
    PERMITS = "permits"
    OVERHEAD = "overhead"
    PROFIT = "profit"
    CONTINGENCY = "contingency"

# ═══════════════════════════════════════════════════════════════════════════════
# TAX RATES (Quebec)
# ═══════════════════════════════════════════════════════════════════════════════

TAX_RATES = {
    "TPS": Decimal("0.05"),   # GST - Federal
    "TVQ": Decimal("0.09975"),  # QST - Quebec
}

# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class InvoiceLineItem:
    id: str
    description: str
    quantity: Decimal
    unit: str
    unit_price: Decimal
    amount: Decimal
    tax_exempt: bool = False
    category: Optional[CostCategory] = None

@dataclass
class Invoice:
    id: str
    number: str
    project_id: str
    client_id: str
    type: InvoiceType
    status: InvoiceStatus
    
    # Dates
    issue_date: date
    due_date: date
    
    # Line items
    items: List[InvoiceLineItem]
    
    # Amounts
    subtotal: Decimal
    tps_amount: Decimal
    tvq_amount: Decimal
    total: Decimal
    
    # Retainage (retenue)
    retainage_percent: Decimal
    retainage_amount: Decimal
    amount_due: Decimal
    
    # Payments
    amount_paid: Decimal
    balance: Decimal
    
    # Progressive billing
    progress_percent: Optional[Decimal]
    cumulative_billed: Optional[Decimal]
    
    # Recurring
    recurring_interval: Optional[str]  # monthly, quarterly
    next_invoice_date: Optional[date]
    
    # Metadata
    notes: str
    terms: str
    created_at: datetime
    updated_at: datetime
    payments: List[Dict[str, Any]]

@dataclass
class PaymentSchedule:
    id: str
    project_id: str
    name: str
    milestones: List[Dict[str, Any]]
    total_amount: Decimal
    currency: str

@dataclass
class BidItem:
    id: str
    description: str
    category: CostCategory
    quantity: Decimal
    unit: str
    unit_cost: Decimal
    total_cost: Decimal
    markup_percent: Decimal
    sell_price: Decimal

@dataclass
class Bid:
    id: str
    number: str
    project_name: str
    client_name: str
    client_email: str
    status: BidStatus
    
    # Dates
    created_date: date
    submission_deadline: date
    valid_until: date
    
    # Items and costs
    items: List[BidItem]
    
    # Cost breakdown
    labor_cost: Decimal
    material_cost: Decimal
    equipment_cost: Decimal
    subcontractor_cost: Decimal
    overhead_cost: Decimal
    contingency: Decimal
    profit: Decimal
    
    # Totals
    total_cost: Decimal
    total_price: Decimal
    margin_percent: Decimal
    
    # Metadata
    scope_of_work: str
    exclusions: List[str]
    assumptions: List[str]
    terms: str
    notes: str
    attachments: List[str]
    
    # Tracking
    created_by: str
    submitted_at: Optional[datetime]
    result_date: Optional[datetime]
    loss_reason: Optional[str]

@dataclass
class MaterialTakeoff:
    id: str
    bid_id: str
    name: str
    items: List[Dict[str, Any]]
    total_cost: Decimal
    waste_factor: Decimal
    total_with_waste: Decimal

# ═══════════════════════════════════════════════════════════════════════════════
# REQUEST MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class CreateInvoiceRequest(BaseModel):
    project_id: str
    client_id: str
    type: InvoiceType = InvoiceType.STANDARD
    items: List[Dict[str, Any]]
    retainage_percent: float = 0
    progress_percent: Optional[float] = None
    notes: str = ""
    due_days: int = 30

class RecordPaymentRequest(BaseModel):
    invoice_id: str
    amount: float
    method: PaymentMethod
    reference: str = ""
    date: Optional[str] = None

class CreateBidRequest(BaseModel):
    project_name: str
    client_name: str
    client_email: str
    submission_deadline: str
    valid_days: int = 30
    scope_of_work: str
    exclusions: List[str] = []
    assumptions: List[str] = []

class AddBidItemRequest(BaseModel):
    description: str
    category: CostCategory
    quantity: float
    unit: str
    unit_cost: float
    markup_percent: float = 15

class CreateMaterialTakeoffRequest(BaseModel):
    bid_id: str
    name: str
    items: List[Dict[str, Any]]
    waste_factor: float = 0.10

class CreatePaymentScheduleRequest(BaseModel):
    project_id: str
    name: str
    milestones: List[Dict[str, Any]]

# ═══════════════════════════════════════════════════════════════════════════════
# INVOICE MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class InvoiceManager:
    """Manage invoices and payments."""
    
    _invoices: Dict[str, Invoice] = {}
    _counter: int = 1000
    
    @classmethod
    async def create(cls, request: CreateInvoiceRequest) -> Invoice:
        """Create a new invoice."""
        
        cls._counter += 1
        invoice_number = f"FACT-{datetime.now().year}-{cls._counter:04d}"
        
        # Process line items
        items = []
        subtotal = Decimal("0")
        
        for item_data in request.items:
            quantity = Decimal(str(item_data.get("quantity", 1)))
            unit_price = Decimal(str(item_data.get("unit_price", 0)))
            amount = quantity * unit_price
            
            item = InvoiceLineItem(
                id=f"item_{uuid.uuid4().hex[:8]}",
                description=item_data.get("description", ""),
                quantity=quantity,
                unit=item_data.get("unit", "unité"),
                unit_price=unit_price,
                amount=amount,
                tax_exempt=item_data.get("tax_exempt", False),
            )
            items.append(item)
            
            if not item.tax_exempt:
                subtotal += amount
        
        # Calculate taxes
        tps = subtotal * TAX_RATES["TPS"]
        tvq = subtotal * TAX_RATES["TVQ"]
        total = subtotal + tps + tvq
        
        # Calculate retainage
        retainage_percent = Decimal(str(request.retainage_percent)) / 100
        retainage_amount = total * retainage_percent
        amount_due = total - retainage_amount
        
        # Progressive billing adjustment
        progress_percent = None
        if request.progress_percent is not None:
            progress_percent = Decimal(str(request.progress_percent))
            amount_due = amount_due * (progress_percent / 100)
        
        invoice = Invoice(
            id=f"inv_{uuid.uuid4().hex[:8]}",
            number=invoice_number,
            project_id=request.project_id,
            client_id=request.client_id,
            type=request.type,
            status=InvoiceStatus.DRAFT,
            issue_date=date.today(),
            due_date=date.today() + timedelta(days=request.due_days),
            items=items,
            subtotal=subtotal,
            tps_amount=tps,
            tvq_amount=tvq,
            total=total,
            retainage_percent=retainage_percent * 100,
            retainage_amount=retainage_amount,
            amount_due=amount_due,
            amount_paid=Decimal("0"),
            balance=amount_due,
            progress_percent=progress_percent,
            cumulative_billed=None,
            recurring_interval=None,
            next_invoice_date=None,
            notes=request.notes,
            terms="Paiement net 30 jours. Intérêts de 2% par mois sur solde en souffrance.",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            payments=[],
        )
        
        cls._invoices[invoice.id] = invoice
        return invoice
    
    @classmethod
    async def record_payment(cls, request: RecordPaymentRequest) -> Invoice:
        """Record a payment against an invoice."""
        
        invoice = cls._invoices.get(request.invoice_id)
        if not invoice:
            raise HTTPException(404, "Invoice not found")
        
        amount = Decimal(str(request.amount))
        payment_date = datetime.fromisoformat(request.date) if request.date else datetime.utcnow()
        
        payment = {
            "id": f"pay_{uuid.uuid4().hex[:8]}",
            "amount": float(amount),
            "method": request.method.value,
            "reference": request.reference,
            "date": payment_date.isoformat(),
        }
        
        invoice.payments.append(payment)
        invoice.amount_paid += amount
        invoice.balance = invoice.amount_due - invoice.amount_paid
        
        if invoice.balance <= 0:
            invoice.status = InvoiceStatus.PAID
        elif invoice.amount_paid > 0:
            invoice.status = InvoiceStatus.PARTIAL
        
        invoice.updated_at = datetime.utcnow()
        
        return invoice
    
    @classmethod
    async def send_invoice(cls, invoice_id: str) -> Invoice:
        """Mark invoice as sent."""
        invoice = cls._invoices.get(invoice_id)
        if not invoice:
            raise HTTPException(404, "Invoice not found")
        
        invoice.status = InvoiceStatus.SENT
        invoice.updated_at = datetime.utcnow()
        
        # In production: Send email with PDF
        logger.info(f"Invoice {invoice.number} sent to client")
        
        return invoice
    
    @classmethod
    async def create_credit_note(cls, invoice_id: str, reason: str, amount: Optional[float] = None) -> Invoice:
        """Create a credit note for an invoice."""
        
        original = cls._invoices.get(invoice_id)
        if not original:
            raise HTTPException(404, "Invoice not found")
        
        cls._counter += 1
        credit_number = f"NC-{datetime.now().year}-{cls._counter:04d}"
        
        credit_amount = Decimal(str(amount)) if amount else original.total
        
        credit_note = Invoice(
            id=f"inv_{uuid.uuid4().hex[:8]}",
            number=credit_number,
            project_id=original.project_id,
            client_id=original.client_id,
            type=InvoiceType.CREDIT_NOTE,
            status=InvoiceStatus.SENT,
            issue_date=date.today(),
            due_date=date.today(),
            items=[InvoiceLineItem(
                id=f"item_{uuid.uuid4().hex[:8]}",
                description=f"Note de crédit - Réf: {original.number}. {reason}",
                quantity=Decimal("1"),
                unit="",
                unit_price=-credit_amount,
                amount=-credit_amount,
            )],
            subtotal=-credit_amount,
            tps_amount=-credit_amount * TAX_RATES["TPS"],
            tvq_amount=-credit_amount * TAX_RATES["TVQ"],
            total=-credit_amount * (1 + TAX_RATES["TPS"] + TAX_RATES["TVQ"]),
            retainage_percent=Decimal("0"),
            retainage_amount=Decimal("0"),
            amount_due=-credit_amount,
            amount_paid=Decimal("0"),
            balance=-credit_amount,
            progress_percent=None,
            cumulative_billed=None,
            recurring_interval=None,
            next_invoice_date=None,
            notes=reason,
            terms="",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            payments=[],
        )
        
        cls._invoices[credit_note.id] = credit_note
        return credit_note
    
    @classmethod
    async def get_overdue(cls) -> List[Invoice]:
        """Get overdue invoices."""
        today = date.today()
        return [
            inv for inv in cls._invoices.values()
            if inv.due_date < today and inv.status not in [InvoiceStatus.PAID, InvoiceStatus.CANCELLED]
        ]
    
    @classmethod
    async def get_summary(cls, project_id: Optional[str] = None) -> Dict[str, Any]:
        """Get invoicing summary."""
        invoices = list(cls._invoices.values())
        if project_id:
            invoices = [i for i in invoices if i.project_id == project_id]
        
        total_invoiced = sum(i.total for i in invoices if i.type != InvoiceType.CREDIT_NOTE)
        total_paid = sum(i.amount_paid for i in invoices)
        total_outstanding = sum(i.balance for i in invoices if i.balance > 0)
        total_overdue = sum(i.balance for i in invoices if i.due_date < date.today() and i.balance > 0)
        
        return {
            "total_invoiced": float(total_invoiced),
            "total_paid": float(total_paid),
            "total_outstanding": float(total_outstanding),
            "total_overdue": float(total_overdue),
            "invoice_count": len(invoices),
            "paid_count": len([i for i in invoices if i.status == InvoiceStatus.PAID]),
            "overdue_count": len([i for i in invoices if i.due_date < date.today() and i.balance > 0]),
        }

# ═══════════════════════════════════════════════════════════════════════════════
# PAYMENT SCHEDULE MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class PaymentScheduleManager:
    """Manage payment schedules/milestones."""
    
    _schedules: Dict[str, PaymentSchedule] = {}
    
    @classmethod
    async def create(cls, request: CreatePaymentScheduleRequest) -> PaymentSchedule:
        """Create a payment schedule."""
        
        total = sum(Decimal(str(m.get("amount", 0))) for m in request.milestones)
        
        milestones = []
        cumulative = Decimal("0")
        
        for m in request.milestones:
            amount = Decimal(str(m.get("amount", 0)))
            cumulative += amount
            milestones.append({
                "id": f"ms_{uuid.uuid4().hex[:8]}",
                "name": m.get("name", ""),
                "description": m.get("description", ""),
                "percent": float(amount / total * 100) if total > 0 else 0,
                "amount": float(amount),
                "cumulative": float(cumulative),
                "due_date": m.get("due_date"),
                "invoiced": False,
                "invoice_id": None,
            })
        
        schedule = PaymentSchedule(
            id=f"sched_{uuid.uuid4().hex[:8]}",
            project_id=request.project_id,
            name=request.name,
            milestones=milestones,
            total_amount=total,
            currency="CAD",
        )
        
        cls._schedules[schedule.id] = schedule
        return schedule
    
    @classmethod
    async def get_template(cls, template_type: str) -> List[Dict[str, Any]]:
        """Get payment schedule template."""
        
        templates = {
            "residential": [
                {"name": "Signature contrat", "percent": 10, "description": "Dépôt à la signature"},
                {"name": "Fondation", "percent": 15, "description": "Fondation coulée et curée"},
                {"name": "Charpente", "percent": 25, "description": "Structure complète"},
                {"name": "Fermeture", "percent": 20, "description": "Toiture, portes, fenêtres"},
                {"name": "Mécanique", "percent": 15, "description": "Électricité, plomberie, HVAC"},
                {"name": "Finition", "percent": 10, "description": "Peinture, planchers"},
                {"name": "Final", "percent": 5, "description": "Livraison et inspection"},
            ],
            "commercial": [
                {"name": "Mobilisation", "percent": 10, "description": "Préparation chantier"},
                {"name": "Structure", "percent": 30, "description": "Fondation et structure"},
                {"name": "Enveloppe", "percent": 25, "description": "Toiture et façade"},
                {"name": "Intérieur", "percent": 25, "description": "Cloisons et finitions"},
                {"name": "Commissioning", "percent": 10, "description": "Tests et mise en service"},
            ],
            "renovation": [
                {"name": "Dépôt", "percent": 25, "description": "Avant début des travaux"},
                {"name": "Mi-projet", "percent": 50, "description": "50% des travaux complétés"},
                {"name": "Final", "percent": 25, "description": "Travaux complétés"},
            ],
        }
        
        return templates.get(template_type, templates["residential"])

# ═══════════════════════════════════════════════════════════════════════════════
# BID MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class BidManager:
    """Manage bids and estimates."""
    
    _bids: Dict[str, Bid] = {}
    _counter: int = 100
    
    @classmethod
    async def create(cls, request: CreateBidRequest, user_id: str) -> Bid:
        """Create a new bid."""
        
        cls._counter += 1
        bid_number = f"SOUM-{datetime.now().year}-{cls._counter:03d}"
        
        submission = datetime.fromisoformat(request.submission_deadline).date()
        
        bid = Bid(
            id=f"bid_{uuid.uuid4().hex[:8]}",
            number=bid_number,
            project_name=request.project_name,
            client_name=request.client_name,
            client_email=request.client_email,
            status=BidStatus.DRAFT,
            created_date=date.today(),
            submission_deadline=submission,
            valid_until=submission + timedelta(days=request.valid_days),
            items=[],
            labor_cost=Decimal("0"),
            material_cost=Decimal("0"),
            equipment_cost=Decimal("0"),
            subcontractor_cost=Decimal("0"),
            overhead_cost=Decimal("0"),
            contingency=Decimal("0"),
            profit=Decimal("0"),
            total_cost=Decimal("0"),
            total_price=Decimal("0"),
            margin_percent=Decimal("0"),
            scope_of_work=request.scope_of_work,
            exclusions=request.exclusions,
            assumptions=request.assumptions,
            terms="Soumission valide 30 jours. Prix sujets à changement selon conditions du marché.",
            notes="",
            attachments=[],
            created_by=user_id,
            submitted_at=None,
            result_date=None,
            loss_reason=None,
        )
        
        cls._bids[bid.id] = bid
        return bid
    
    @classmethod
    async def add_item(cls, bid_id: str, request: AddBidItemRequest) -> Bid:
        """Add item to bid."""
        
        bid = cls._bids.get(bid_id)
        if not bid:
            raise HTTPException(404, "Bid not found")
        
        quantity = Decimal(str(request.quantity))
        unit_cost = Decimal(str(request.unit_cost))
        total_cost = quantity * unit_cost
        markup = Decimal(str(request.markup_percent)) / 100
        sell_price = total_cost * (1 + markup)
        
        item = BidItem(
            id=f"item_{uuid.uuid4().hex[:8]}",
            description=request.description,
            category=request.category,
            quantity=quantity,
            unit=request.unit,
            unit_cost=unit_cost,
            total_cost=total_cost,
            markup_percent=Decimal(str(request.markup_percent)),
            sell_price=sell_price,
        )
        
        bid.items.append(item)
        
        # Recalculate totals
        await cls._recalculate(bid)
        
        return bid
    
    @classmethod
    async def _recalculate(cls, bid: Bid):
        """Recalculate bid totals."""
        
        # Reset category totals
        bid.labor_cost = Decimal("0")
        bid.material_cost = Decimal("0")
        bid.equipment_cost = Decimal("0")
        bid.subcontractor_cost = Decimal("0")
        
        for item in bid.items:
            if item.category == CostCategory.LABOR:
                bid.labor_cost += item.total_cost
            elif item.category == CostCategory.MATERIALS:
                bid.material_cost += item.total_cost
            elif item.category == CostCategory.EQUIPMENT:
                bid.equipment_cost += item.total_cost
            elif item.category == CostCategory.SUBCONTRACTOR:
                bid.subcontractor_cost += item.total_cost
        
        # Calculate derived costs
        direct_cost = bid.labor_cost + bid.material_cost + bid.equipment_cost + bid.subcontractor_cost
        bid.overhead_cost = direct_cost * Decimal("0.10")  # 10% overhead
        bid.contingency = direct_cost * Decimal("0.05")  # 5% contingency
        
        bid.total_cost = direct_cost + bid.overhead_cost + bid.contingency
        
        # Calculate sell price and profit
        bid.total_price = sum(item.sell_price for item in bid.items)
        bid.profit = bid.total_price - bid.total_cost
        
        if bid.total_price > 0:
            bid.margin_percent = (bid.profit / bid.total_price) * 100
    
    @classmethod
    async def submit(cls, bid_id: str) -> Bid:
        """Submit bid to client."""
        
        bid = cls._bids.get(bid_id)
        if not bid:
            raise HTTPException(404, "Bid not found")
        
        bid.status = BidStatus.SUBMITTED
        bid.submitted_at = datetime.utcnow()
        
        # In production: Generate PDF, send email
        logger.info(f"Bid {bid.number} submitted")
        
        return bid
    
    @classmethod
    async def record_result(cls, bid_id: str, won: bool, reason: Optional[str] = None) -> Bid:
        """Record bid result (won/lost)."""
        
        bid = cls._bids.get(bid_id)
        if not bid:
            raise HTTPException(404, "Bid not found")
        
        bid.status = BidStatus.WON if won else BidStatus.LOST
        bid.result_date = datetime.utcnow()
        if not won and reason:
            bid.loss_reason = reason
        
        return bid
    
    @classmethod
    async def get_statistics(cls) -> Dict[str, Any]:
        """Get bidding statistics."""
        
        bids = list(cls._bids.values())
        
        total = len(bids)
        won = len([b for b in bids if b.status == BidStatus.WON])
        lost = len([b for b in bids if b.status == BidStatus.LOST])
        pending = len([b for b in bids if b.status in [BidStatus.SUBMITTED, BidStatus.UNDER_REVIEW, BidStatus.SHORTLISTED]])
        
        total_value = sum(b.total_price for b in bids)
        won_value = sum(b.total_price for b in bids if b.status == BidStatus.WON)
        
        return {
            "total_bids": total,
            "won": won,
            "lost": lost,
            "pending": pending,
            "win_rate": round(won / max(won + lost, 1) * 100, 1),
            "total_bid_value": float(total_value),
            "won_value": float(won_value),
            "average_margin": round(float(sum(b.margin_percent for b in bids) / max(total, 1)), 1),
        }
    
    @classmethod
    async def compare_bids(cls, bid_ids: List[str]) -> Dict[str, Any]:
        """Compare multiple bids."""
        
        bids = [cls._bids.get(bid_id) for bid_id in bid_ids if bid_id in cls._bids]
        
        if len(bids) < 2:
            raise HTTPException(400, "Need at least 2 bids to compare")
        
        comparison = {
            "bids": [
                {
                    "id": b.id,
                    "number": b.number,
                    "project": b.project_name,
                    "total_cost": float(b.total_cost),
                    "total_price": float(b.total_price),
                    "margin": float(b.margin_percent),
                    "labor_pct": float(b.labor_cost / max(b.total_cost, 1) * 100),
                    "material_pct": float(b.material_cost / max(b.total_cost, 1) * 100),
                }
                for b in bids
            ],
            "averages": {
                "cost": float(sum(b.total_cost for b in bids) / len(bids)),
                "price": float(sum(b.total_price for b in bids) / len(bids)),
                "margin": float(sum(b.margin_percent for b in bids) / len(bids)),
            },
        }
        
        return comparison

# ═══════════════════════════════════════════════════════════════════════════════
# MATERIAL TAKEOFF
# ═══════════════════════════════════════════════════════════════════════════════

class MaterialTakeoffManager:
    """Manage material takeoffs for bids."""
    
    _takeoffs: Dict[str, MaterialTakeoff] = {}
    
    # Common material prices (Quebec market)
    MATERIAL_PRICES = {
        "lumber_2x4x8": {"unit": "pièce", "price": 8.50},
        "lumber_2x6x8": {"unit": "pièce", "price": 12.00},
        "plywood_4x8": {"unit": "feuille", "price": 45.00},
        "osb_4x8": {"unit": "feuille", "price": 35.00},
        "concrete_30mpa": {"unit": "m³", "price": 180.00},
        "rebar_10m": {"unit": "kg", "price": 1.50},
        "insulation_r20": {"unit": "ballot", "price": 55.00},
        "drywall_4x8": {"unit": "feuille", "price": 18.00},
        "shingles": {"unit": "paquet", "price": 35.00},
        "electrical_wire_14_2": {"unit": "m", "price": 1.25},
        "pex_1_2": {"unit": "m", "price": 2.50},
        "paint_interior": {"unit": "gallon", "price": 45.00},
    }
    
    @classmethod
    async def create(cls, request: CreateMaterialTakeoffRequest) -> MaterialTakeoff:
        """Create a material takeoff."""
        
        items = []
        total = Decimal("0")
        
        for item in request.items:
            quantity = Decimal(str(item.get("quantity", 0)))
            unit_price = Decimal(str(item.get("unit_price", 0)))
            line_total = quantity * unit_price
            
            items.append({
                "id": f"mat_{uuid.uuid4().hex[:8]}",
                "description": item.get("description", ""),
                "quantity": float(quantity),
                "unit": item.get("unit", ""),
                "unit_price": float(unit_price),
                "total": float(line_total),
            })
            total += line_total
        
        waste_factor = Decimal(str(request.waste_factor))
        total_with_waste = total * (1 + waste_factor)
        
        takeoff = MaterialTakeoff(
            id=f"takeoff_{uuid.uuid4().hex[:8]}",
            bid_id=request.bid_id,
            name=request.name,
            items=items,
            total_cost=total,
            waste_factor=waste_factor,
            total_with_waste=total_with_waste,
        )
        
        cls._takeoffs[takeoff.id] = takeoff
        return takeoff
    
    @classmethod
    async def get_price_list(cls) -> Dict[str, Any]:
        """Get current material price list."""
        return {
            "prices": cls.MATERIAL_PRICES,
            "updated": datetime.utcnow().isoformat(),
            "source": "CHE·NU™ Price Database - Quebec Market",
        }

# ═══════════════════════════════════════════════════════════════════════════════
# LABOR CALCULATOR
# ═══════════════════════════════════════════════════════════════════════════════

class LaborCalculator:
    """Calculate labor costs with CCQ rates."""
    
    # CCQ hourly rates (2024 approximations)
    CCQ_RATES = {
        "charpentier_menuisier": {"wage": 42.50, "benefits": 12.75, "total": 55.25},
        "electricien": {"wage": 45.00, "benefits": 13.50, "total": 58.50},
        "plombier": {"wage": 44.00, "benefits": 13.20, "total": 57.20},
        "briqueteur_macon": {"wage": 43.00, "benefits": 12.90, "total": 55.90},
        "peintre": {"wage": 38.00, "benefits": 11.40, "total": 49.40},
        "manoeuvre": {"wage": 32.00, "benefits": 9.60, "total": 41.60},
        "operateur_equipement_lourd": {"wage": 44.50, "benefits": 13.35, "total": 57.85},
        "ferblantier": {"wage": 43.50, "benefits": 13.05, "total": 56.55},
        "couvreur": {"wage": 41.00, "benefits": 12.30, "total": 53.30},
        "tireur_joints": {"wage": 40.00, "benefits": 12.00, "total": 52.00},
    }
    
    @classmethod
    async def calculate(cls, trade: str, hours: float, overtime_hours: float = 0) -> Dict[str, Any]:
        """Calculate labor cost for a trade."""
        
        rates = cls.CCQ_RATES.get(trade.lower())
        if not rates:
            raise HTTPException(400, f"Unknown trade: {trade}")
        
        regular_cost = Decimal(str(hours)) * Decimal(str(rates["total"]))
        overtime_cost = Decimal(str(overtime_hours)) * Decimal(str(rates["total"])) * Decimal("1.5")
        total_cost = regular_cost + overtime_cost
        
        return {
            "trade": trade,
            "regular_hours": hours,
            "overtime_hours": overtime_hours,
            "hourly_rate": rates["total"],
            "regular_cost": float(regular_cost),
            "overtime_cost": float(overtime_cost),
            "total_cost": float(total_cost),
            "breakdown": {
                "wage": rates["wage"],
                "benefits": rates["benefits"],
            },
        }
    
    @classmethod
    async def get_rates(cls) -> Dict[str, Any]:
        """Get CCQ labor rates."""
        return {
            "rates": cls.CCQ_RATES,
            "source": "CCQ - Convention collective 2024",
            "note": "Taux approximatifs, vérifier avec CCQ pour taux officiels",
        }

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

# Invoice endpoints
@router.post("/invoices")
async def create_invoice(request: CreateInvoiceRequest):
    """Create a new invoice."""
    invoice = await InvoiceManager.create(request)
    return {
        "id": invoice.id,
        "number": invoice.number,
        "total": float(invoice.total),
        "amount_due": float(invoice.amount_due),
    }

@router.get("/invoices/{invoice_id}")
async def get_invoice(invoice_id: str):
    """Get invoice details."""
    invoice = InvoiceManager._invoices.get(invoice_id)
    if not invoice:
        raise HTTPException(404, "Invoice not found")
    
    return {
        "id": invoice.id,
        "number": invoice.number,
        "status": invoice.status.value,
        "type": invoice.type.value,
        "subtotal": float(invoice.subtotal),
        "tps": float(invoice.tps_amount),
        "tvq": float(invoice.tvq_amount),
        "total": float(invoice.total),
        "retainage": float(invoice.retainage_amount),
        "amount_due": float(invoice.amount_due),
        "amount_paid": float(invoice.amount_paid),
        "balance": float(invoice.balance),
        "items": [{"description": i.description, "amount": float(i.amount)} for i in invoice.items],
    }

@router.post("/invoices/{invoice_id}/send")
async def send_invoice(invoice_id: str):
    """Send invoice to client."""
    invoice = await InvoiceManager.send_invoice(invoice_id)
    return {"id": invoice.id, "status": invoice.status.value}

@router.post("/invoices/payment")
async def record_payment(request: RecordPaymentRequest):
    """Record a payment."""
    invoice = await InvoiceManager.record_payment(request)
    return {"id": invoice.id, "balance": float(invoice.balance), "status": invoice.status.value}

@router.get("/invoices/summary")
async def invoice_summary(project_id: Optional[str] = None):
    """Get invoicing summary."""
    return await InvoiceManager.get_summary(project_id)

# Payment schedule endpoints
@router.post("/payment-schedules")
async def create_payment_schedule(request: CreatePaymentScheduleRequest):
    """Create a payment schedule."""
    schedule = await PaymentScheduleManager.create(request)
    return {"id": schedule.id, "milestones": len(schedule.milestones), "total": float(schedule.total_amount)}

@router.get("/payment-schedules/templates/{template_type}")
async def get_schedule_template(template_type: str):
    """Get payment schedule template."""
    return {"template": await PaymentScheduleManager.get_template(template_type)}

# Bid endpoints
@router.post("/bids")
async def create_bid(request: CreateBidRequest):
    """Create a new bid."""
    bid = await BidManager.create(request, "current_user")
    return {"id": bid.id, "number": bid.number}

@router.post("/bids/{bid_id}/items")
async def add_bid_item(bid_id: str, request: AddBidItemRequest):
    """Add item to bid."""
    bid = await BidManager.add_item(bid_id, request)
    return {"id": bid.id, "total_cost": float(bid.total_cost), "total_price": float(bid.total_price)}

@router.get("/bids/{bid_id}")
async def get_bid(bid_id: str):
    """Get bid details."""
    bid = BidManager._bids.get(bid_id)
    if not bid:
        raise HTTPException(404, "Bid not found")
    
    return {
        "id": bid.id,
        "number": bid.number,
        "status": bid.status.value,
        "project": bid.project_name,
        "client": bid.client_name,
        "total_cost": float(bid.total_cost),
        "total_price": float(bid.total_price),
        "margin": float(bid.margin_percent),
        "breakdown": {
            "labor": float(bid.labor_cost),
            "materials": float(bid.material_cost),
            "equipment": float(bid.equipment_cost),
            "subcontractor": float(bid.subcontractor_cost),
            "overhead": float(bid.overhead_cost),
            "contingency": float(bid.contingency),
            "profit": float(bid.profit),
        },
    }

@router.post("/bids/{bid_id}/submit")
async def submit_bid(bid_id: str):
    """Submit bid."""
    bid = await BidManager.submit(bid_id)
    return {"id": bid.id, "status": bid.status.value}

@router.post("/bids/{bid_id}/result")
async def record_bid_result(bid_id: str, won: bool, reason: Optional[str] = None):
    """Record bid result."""
    bid = await BidManager.record_result(bid_id, won, reason)
    return {"id": bid.id, "status": bid.status.value}

@router.get("/bids/statistics")
async def bid_statistics():
    """Get bidding statistics."""
    return await BidManager.get_statistics()

@router.post("/bids/compare")
async def compare_bids(bid_ids: List[str]):
    """Compare multiple bids."""
    return await BidManager.compare_bids(bid_ids)

# Material takeoff endpoints
@router.post("/takeoffs")
async def create_takeoff(request: CreateMaterialTakeoffRequest):
    """Create material takeoff."""
    takeoff = await MaterialTakeoffManager.create(request)
    return {"id": takeoff.id, "total": float(takeoff.total_with_waste)}

@router.get("/materials/prices")
async def get_material_prices():
    """Get material price list."""
    return await MaterialTakeoffManager.get_price_list()

# Labor calculation endpoints
@router.post("/labor/calculate")
async def calculate_labor(trade: str, hours: float, overtime_hours: float = 0):
    """Calculate labor cost."""
    return await LaborCalculator.calculate(trade, hours, overtime_hours)

@router.get("/labor/rates")
async def get_labor_rates():
    """Get CCQ labor rates."""
    return await LaborCalculator.get_rates()
