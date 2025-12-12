"""
CHE·NU™ B25 - Espaces Gouvernement & Immobilier
Modules spécialisés sectoriels

Features:
- Espace Gouvernement (impôts, taxes, permis, documents officiels)
- Espace Immobilier (propriétés, baux, évaluations, documents)
- Formulaires intelligents
- Calendrier échéances fiscales
- Alertes réglementaires

Author: CHE·NU Dev Team
Date: December 2024
Lines: ~700
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date, timedelta
from enum import Enum
from uuid import uuid4
from decimal import Decimal

router = APIRouter(prefix="/api/v2/spaces", tags=["Specialized Spaces"])

# =============================================================================
# ENUMS - GOUVERNEMENT
# =============================================================================

class TaxType(str, Enum):
    INCOME = "income"  # Impôt sur le revenu
    PROPERTY = "property"  # Taxe foncière
    SALES = "sales"  # TPS/TVQ
    BUSINESS = "business"  # Impôt entreprise
    CAPITAL_GAINS = "capital_gains"
    PAYROLL = "payroll"  # Charges sociales

class PermitType(str, Enum):
    CONSTRUCTION = "construction"
    RENOVATION = "renovation"
    DEMOLITION = "demolition"
    OCCUPANCY = "occupancy"
    BUSINESS = "business"
    ENVIRONMENTAL = "environmental"
    SIGNAGE = "signage"

class PermitStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"

class DocumentCategory(str, Enum):
    TAX_RETURN = "tax_return"
    TAX_RECEIPT = "tax_receipt"
    PERMIT = "permit"
    CERTIFICATE = "certificate"
    CORRESPONDENCE = "correspondence"
    LEGAL = "legal"
    INSURANCE = "insurance"

# =============================================================================
# ENUMS - IMMOBILIER
# =============================================================================

class PropertyType(str, Enum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    INDUSTRIAL = "industrial"
    LAND = "land"
    MIXED = "mixed"

class PropertyStatus(str, Enum):
    OWNED = "owned"
    RENTED = "rented"
    FOR_SALE = "for_sale"
    FOR_RENT = "for_rent"
    UNDER_CONSTRUCTION = "under_construction"

class LeaseType(str, Enum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    MONTH_TO_MONTH = "month_to_month"
    FIXED_TERM = "fixed_term"

class LeaseStatus(str, Enum):
    ACTIVE = "active"
    PENDING = "pending"
    EXPIRED = "expired"
    TERMINATED = "terminated"

# =============================================================================
# MODELS - GOUVERNEMENT
# =============================================================================

class TaxDeadline(BaseModel):
    """Échéance fiscale"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    tax_type: TaxType
    name: str
    description: Optional[str] = None
    
    due_date: date
    reminder_days: int = 14
    
    # Status
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    
    # Amount
    estimated_amount: Optional[float] = None
    actual_amount: Optional[float] = None
    
    # Related
    related_document_ids: List[str] = []

class TaxRecord(BaseModel):
    """Enregistrement fiscal"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    tax_type: TaxType
    tax_year: int
    
    # Amounts
    gross_income: float = 0
    deductions: float = 0
    taxable_income: float = 0
    tax_owing: float = 0
    tax_paid: float = 0
    
    # Status
    is_filed: bool = False
    filed_at: Optional[datetime] = None
    
    # Documents
    document_ids: List[str] = []
    
    # Notes
    notes: Optional[str] = None

class TaxDeduction(BaseModel):
    """Déduction fiscale"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    tax_record_id: str
    
    category: str  # business_expense, medical, donation, etc.
    description: str
    amount: float
    
    # Receipt
    receipt_id: Optional[str] = None
    receipt_date: Optional[date] = None
    
    # Status
    is_verified: bool = False

class Permit(BaseModel):
    """Permis gouvernemental"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    permit_type: PermitType
    reference_number: Optional[str] = None
    
    # Details
    title: str
    description: Optional[str] = None
    
    # Location
    property_id: Optional[str] = None
    address: Optional[str] = None
    municipality: Optional[str] = None
    
    # Dates
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    
    # Status
    status: PermitStatus = PermitStatus.DRAFT
    
    # Fees
    application_fee: float = 0
    permit_fee: float = 0
    fees_paid: bool = False
    
    # Documents
    document_ids: List[str] = []
    
    # Conditions
    conditions: List[str] = []
    
    # Inspector
    inspector_name: Optional[str] = None
    inspection_dates: List[date] = []

class GovDocument(BaseModel):
    """Document gouvernemental"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    
    category: DocumentCategory
    title: str
    description: Optional[str] = None
    
    # File
    file_url: str = ""
    file_type: str = "pdf"
    file_size: int = 0
    
    # Metadata
    document_date: Optional[date] = None
    reference_number: Optional[str] = None
    issuing_authority: Optional[str] = None
    
    # Expiry
    expires_at: Optional[date] = None
    
    # Tags
    tags: List[str] = []
    
    # Related
    tax_record_id: Optional[str] = None
    permit_id: Optional[str] = None
    property_id: Optional[str] = None

class GovAlert(BaseModel):
    """Alerte gouvernementale"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    alert_type: str  # deadline, expiry, regulation_change, reminder
    title: str
    message: str
    
    # Urgency
    priority: str = "medium"  # low, medium, high, urgent
    
    # Dates
    due_date: Optional[date] = None
    
    # Status
    is_read: bool = False
    is_dismissed: bool = False
    
    # Related
    related_entity_type: Optional[str] = None
    related_entity_id: Optional[str] = None

# =============================================================================
# MODELS - IMMOBILIER
# =============================================================================

class PropertyAddress(BaseModel):
    """Adresse de propriété"""
    street_number: str
    street_name: str
    unit: Optional[str] = None
    city: str
    province: str = "QC"
    postal_code: str
    country: str = "Canada"
    
    @property
    def full_address(self) -> str:
        unit_str = f" #{self.unit}" if self.unit else ""
        return f"{self.street_number} {self.street_name}{unit_str}, {self.city}, {self.province} {self.postal_code}"

class PropertyFinancials(BaseModel):
    """Finances d'une propriété"""
    purchase_price: float = 0
    purchase_date: Optional[date] = None
    
    current_value: float = 0
    last_valuation_date: Optional[date] = None
    
    mortgage_balance: float = 0
    mortgage_rate: float = 0
    mortgage_payment: float = 0
    
    property_tax_annual: float = 0
    insurance_annual: float = 0
    
    # Revenue (if rental)
    monthly_rent: float = 0
    vacancy_rate: float = 0
    
    # Expenses
    maintenance_annual: float = 0
    utilities_annual: float = 0
    management_fee_percent: float = 0

class Property(BaseModel):
    """Propriété immobilière"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Basic
    name: str
    property_type: PropertyType
    status: PropertyStatus = PropertyStatus.OWNED
    
    # Address
    address: PropertyAddress
    
    # Details
    lot_size_sqft: Optional[float] = None
    building_size_sqft: Optional[float] = None
    year_built: Optional[int] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    parking_spaces: Optional[int] = None
    
    # Financials
    financials: PropertyFinancials = PropertyFinancials()
    
    # Legal
    cadastral_number: Optional[str] = None
    zoning: Optional[str] = None
    
    # Documents
    document_ids: List[str] = []
    
    # Images
    image_urls: List[str] = []
    
    # Notes
    notes: Optional[str] = None

class Tenant(BaseModel):
    """Locataire"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Contact
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    
    # Employment
    employer: Optional[str] = None
    income_annual: Optional[float] = None
    
    # Emergency contact
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    
    # History
    previous_address: Optional[str] = None
    references: List[Dict] = []
    
    # Credit
    credit_score: Optional[int] = None
    credit_check_date: Optional[date] = None
    
    # Status
    is_active: bool = True

class Lease(BaseModel):
    """Bail"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Parties
    property_id: str
    tenant_ids: List[str] = []
    
    # Type
    lease_type: LeaseType
    status: LeaseStatus = LeaseStatus.PENDING
    
    # Dates
    start_date: date
    end_date: Optional[date] = None
    signed_at: Optional[datetime] = None
    
    # Rent
    monthly_rent: float
    security_deposit: float = 0
    deposit_held: float = 0
    
    # Payment
    payment_due_day: int = 1  # Day of month
    payment_method: str = "bank_transfer"
    
    # Utilities
    utilities_included: List[str] = []  # electricity, gas, water, internet
    
    # Terms
    pets_allowed: bool = False
    smoking_allowed: bool = False
    subletting_allowed: bool = False
    
    # Documents
    document_ids: List[str] = []
    
    # Renewal
    auto_renew: bool = False
    renewal_notice_days: int = 60

class RentPayment(BaseModel):
    """Paiement de loyer"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    lease_id: str
    tenant_id: str
    
    # Payment
    amount: float
    due_date: date
    paid_date: Optional[date] = None
    
    # Status
    status: str = "pending"  # pending, paid, late, partial
    
    # Details
    payment_method: Optional[str] = None
    reference_number: Optional[str] = None
    
    # Late fee
    late_fee: float = 0
    late_fee_applied: bool = False

class PropertyValuation(BaseModel):
    """Évaluation immobilière"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    property_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Valuation
    valuation_date: date
    valuation_type: str  # market, tax, insurance, appraisal
    
    estimated_value: float
    
    # Breakdown
    land_value: Optional[float] = None
    building_value: Optional[float] = None
    
    # Comparables
    comparable_properties: List[Dict] = []
    
    # Source
    source: str  # self, appraiser, municipality, algorithm
    appraiser_name: Optional[str] = None
    
    # Notes
    notes: Optional[str] = None

class MaintenanceRequest(BaseModel):
    """Demande de maintenance"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    property_id: str
    tenant_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Request
    title: str
    description: str
    category: str  # plumbing, electrical, hvac, appliance, structural, other
    priority: str = "medium"
    
    # Status
    status: str = "open"  # open, in_progress, completed, cancelled
    
    # Assignment
    assigned_to: Optional[str] = None
    scheduled_date: Optional[date] = None
    
    # Completion
    completed_at: Optional[datetime] = None
    resolution_notes: Optional[str] = None
    
    # Cost
    estimated_cost: float = 0
    actual_cost: float = 0
    
    # Images
    image_urls: List[str] = []

# =============================================================================
# STORAGE
# =============================================================================

class SpacesStore:
    def __init__(self):
        # Gouvernement
        self.tax_records: Dict[str, TaxRecord] = {}
        self.tax_deadlines: Dict[str, TaxDeadline] = {}
        self.deductions: Dict[str, TaxDeduction] = {}
        self.permits: Dict[str, Permit] = {}
        self.gov_documents: Dict[str, GovDocument] = {}
        self.gov_alerts: Dict[str, GovAlert] = {}
        
        # Immobilier
        self.properties: Dict[str, Property] = {}
        self.tenants: Dict[str, Tenant] = {}
        self.leases: Dict[str, Lease] = {}
        self.rent_payments: Dict[str, RentPayment] = {}
        self.valuations: Dict[str, PropertyValuation] = {}
        self.maintenance: Dict[str, MaintenanceRequest] = {}
        
        # Indexes
        self.by_owner: Dict[str, Dict[str, List[str]]] = {}

store = SpacesStore()

# =============================================================================
# HELPERS
# =============================================================================

def index_by_owner(owner_id: str, entity_type: str, entity_id: str):
    """Index entity by owner"""
    if owner_id not in store.by_owner:
        store.by_owner[owner_id] = {}
    if entity_type not in store.by_owner[owner_id]:
        store.by_owner[owner_id][entity_type] = []
    store.by_owner[owner_id][entity_type].append(entity_id)

def get_by_owner(owner_id: str, entity_type: str) -> List[str]:
    """Get entities by owner"""
    return store.by_owner.get(owner_id, {}).get(entity_type, [])

# =============================================================================
# API - GOUVERNEMENT - TAXES
# =============================================================================

@router.post("/gouvernement/taxes", response_model=TaxRecord)
async def create_tax_record(owner_id: str, tax_type: TaxType, tax_year: int):
    """Crée un enregistrement fiscal"""
    record = TaxRecord(owner_id=owner_id, tax_type=tax_type, tax_year=tax_year)
    store.tax_records[record.id] = record
    index_by_owner(owner_id, "tax_records", record.id)
    return record

@router.get("/gouvernement/taxes", response_model=List[TaxRecord])
async def list_tax_records(owner_id: str, tax_year: Optional[int] = None):
    """Liste les enregistrements fiscaux"""
    record_ids = get_by_owner(owner_id, "tax_records")
    records = [store.tax_records[rid] for rid in record_ids if rid in store.tax_records]
    
    if tax_year:
        records = [r for r in records if r.tax_year == tax_year]
    
    return sorted(records, key=lambda x: (x.tax_year, x.tax_type.value), reverse=True)

@router.put("/gouvernement/taxes/{record_id}", response_model=TaxRecord)
async def update_tax_record(record_id: str, updates: Dict[str, Any]):
    """Met à jour un enregistrement fiscal"""
    if record_id not in store.tax_records:
        raise HTTPException(404, "Tax record not found")
    
    record = store.tax_records[record_id]
    for key, value in updates.items():
        if hasattr(record, key) and key not in ['id', 'owner_id', 'created_at']:
            setattr(record, key, value)
    
    # Calculate taxable income
    record.taxable_income = max(0, record.gross_income - record.deductions)
    
    return record

@router.post("/gouvernement/taxes/{record_id}/deductions", response_model=TaxDeduction)
async def add_deduction(record_id: str, category: str, description: str, amount: float):
    """Ajoute une déduction"""
    if record_id not in store.tax_records:
        raise HTTPException(404, "Tax record not found")
    
    deduction = TaxDeduction(
        tax_record_id=record_id,
        category=category,
        description=description,
        amount=amount
    )
    store.deductions[deduction.id] = deduction
    
    # Update total deductions
    record = store.tax_records[record_id]
    record.deductions += amount
    record.taxable_income = max(0, record.gross_income - record.deductions)
    
    return deduction

@router.post("/gouvernement/taxes/{record_id}/file")
async def file_tax_return(record_id: str):
    """Marque la déclaration comme soumise"""
    if record_id not in store.tax_records:
        raise HTTPException(404, "Tax record not found")
    
    record = store.tax_records[record_id]
    record.is_filed = True
    record.filed_at = datetime.utcnow()
    
    return {"status": "filed", "filed_at": record.filed_at}

# =============================================================================
# API - GOUVERNEMENT - DEADLINES
# =============================================================================

@router.post("/gouvernement/deadlines", response_model=TaxDeadline)
async def create_deadline(owner_id: str, tax_type: TaxType, name: str, due_date: date):
    """Crée une échéance fiscale"""
    deadline = TaxDeadline(tax_type=tax_type, name=name, due_date=due_date)
    store.tax_deadlines[deadline.id] = deadline
    index_by_owner(owner_id, "deadlines", deadline.id)
    return deadline

@router.get("/gouvernement/deadlines", response_model=List[TaxDeadline])
async def list_deadlines(owner_id: str, upcoming_only: bool = True):
    """Liste les échéances"""
    deadline_ids = get_by_owner(owner_id, "deadlines")
    deadlines = [store.tax_deadlines[did] for did in deadline_ids if did in store.tax_deadlines]
    
    if upcoming_only:
        today = date.today()
        deadlines = [d for d in deadlines if d.due_date >= today and not d.is_completed]
    
    return sorted(deadlines, key=lambda x: x.due_date)

# =============================================================================
# API - GOUVERNEMENT - PERMITS
# =============================================================================

@router.post("/gouvernement/permits", response_model=Permit)
async def create_permit(owner_id: str, permit_type: PermitType, title: str, address: Optional[str] = None):
    """Crée une demande de permis"""
    permit = Permit(
        owner_id=owner_id,
        permit_type=permit_type,
        title=title,
        address=address
    )
    store.permits[permit.id] = permit
    index_by_owner(owner_id, "permits", permit.id)
    return permit

@router.get("/gouvernement/permits", response_model=List[Permit])
async def list_permits(owner_id: str, status: Optional[PermitStatus] = None):
    """Liste les permis"""
    permit_ids = get_by_owner(owner_id, "permits")
    permits = [store.permits[pid] for pid in permit_ids if pid in store.permits]
    
    if status:
        permits = [p for p in permits if p.status == status]
    
    return permits

@router.put("/gouvernement/permits/{permit_id}", response_model=Permit)
async def update_permit(permit_id: str, updates: Dict[str, Any]):
    """Met à jour un permis"""
    if permit_id not in store.permits:
        raise HTTPException(404, "Permit not found")
    
    permit = store.permits[permit_id]
    for key, value in updates.items():
        if hasattr(permit, key) and key not in ['id', 'owner_id', 'created_at']:
            setattr(permit, key, value)
    
    return permit

@router.post("/gouvernement/permits/{permit_id}/submit")
async def submit_permit(permit_id: str):
    """Soumet un permis"""
    if permit_id not in store.permits:
        raise HTTPException(404, "Permit not found")
    
    permit = store.permits[permit_id]
    permit.status = PermitStatus.SUBMITTED
    permit.submitted_at = datetime.utcnow()
    
    return {"status": "submitted"}

# =============================================================================
# API - GOUVERNEMENT - DOCUMENTS
# =============================================================================

@router.post("/gouvernement/documents", response_model=GovDocument)
async def upload_gov_document(owner_id: str, category: DocumentCategory, title: str, file_url: str):
    """Upload un document gouvernemental"""
    doc = GovDocument(
        owner_id=owner_id,
        category=category,
        title=title,
        file_url=file_url
    )
    store.gov_documents[doc.id] = doc
    index_by_owner(owner_id, "gov_documents", doc.id)
    return doc

@router.get("/gouvernement/documents", response_model=List[GovDocument])
async def list_gov_documents(owner_id: str, category: Optional[DocumentCategory] = None):
    """Liste les documents"""
    doc_ids = get_by_owner(owner_id, "gov_documents")
    docs = [store.gov_documents[did] for did in doc_ids if did in store.gov_documents]
    
    if category:
        docs = [d for d in docs if d.category == category]
    
    return sorted(docs, key=lambda x: x.uploaded_at, reverse=True)

# =============================================================================
# API - GOUVERNEMENT - ALERTS
# =============================================================================

@router.get("/gouvernement/alerts", response_model=List[GovAlert])
async def list_gov_alerts(owner_id: str, unread_only: bool = False):
    """Liste les alertes"""
    alert_ids = get_by_owner(owner_id, "gov_alerts")
    alerts = [store.gov_alerts[aid] for aid in alert_ids if aid in store.gov_alerts]
    
    if unread_only:
        alerts = [a for a in alerts if not a.is_read]
    
    alerts = [a for a in alerts if not a.is_dismissed]
    
    return sorted(alerts, key=lambda x: (x.priority == "urgent", x.due_date or date.max), reverse=True)

# =============================================================================
# API - IMMOBILIER - PROPERTIES
# =============================================================================

@router.post("/immobilier/properties", response_model=Property)
async def create_property(owner_id: str, name: str, property_type: PropertyType, address: Dict[str, str]):
    """Crée une propriété"""
    prop = Property(
        owner_id=owner_id,
        name=name,
        property_type=property_type,
        address=PropertyAddress(**address)
    )
    store.properties[prop.id] = prop
    index_by_owner(owner_id, "properties", prop.id)
    return prop

@router.get("/immobilier/properties", response_model=List[Property])
async def list_properties(owner_id: str, status: Optional[PropertyStatus] = None):
    """Liste les propriétés"""
    prop_ids = get_by_owner(owner_id, "properties")
    properties = [store.properties[pid] for pid in prop_ids if pid in store.properties]
    
    if status:
        properties = [p for p in properties if p.status == status]
    
    return properties

@router.get("/immobilier/properties/{property_id}", response_model=Property)
async def get_property(property_id: str):
    """Récupère une propriété"""
    if property_id not in store.properties:
        raise HTTPException(404, "Property not found")
    return store.properties[property_id]

@router.put("/immobilier/properties/{property_id}", response_model=Property)
async def update_property(property_id: str, updates: Dict[str, Any]):
    """Met à jour une propriété"""
    if property_id not in store.properties:
        raise HTTPException(404, "Property not found")
    
    prop = store.properties[property_id]
    for key, value in updates.items():
        if hasattr(prop, key) and key not in ['id', 'owner_id', 'created_at']:
            if key == 'address' and isinstance(value, dict):
                prop.address = PropertyAddress(**value)
            elif key == 'financials' and isinstance(value, dict):
                for fk, fv in value.items():
                    if hasattr(prop.financials, fk):
                        setattr(prop.financials, fk, fv)
            else:
                setattr(prop, key, value)
    
    prop.updated_at = datetime.utcnow()
    return prop

# =============================================================================
# API - IMMOBILIER - TENANTS
# =============================================================================

@router.post("/immobilier/tenants", response_model=Tenant)
async def create_tenant(owner_id: str, first_name: str, last_name: str, email: Optional[str] = None):
    """Crée un locataire"""
    tenant = Tenant(
        owner_id=owner_id,
        first_name=first_name,
        last_name=last_name,
        email=email
    )
    store.tenants[tenant.id] = tenant
    index_by_owner(owner_id, "tenants", tenant.id)
    return tenant

@router.get("/immobilier/tenants", response_model=List[Tenant])
async def list_tenants(owner_id: str, active_only: bool = True):
    """Liste les locataires"""
    tenant_ids = get_by_owner(owner_id, "tenants")
    tenants = [store.tenants[tid] for tid in tenant_ids if tid in store.tenants]
    
    if active_only:
        tenants = [t for t in tenants if t.is_active]
    
    return tenants

# =============================================================================
# API - IMMOBILIER - LEASES
# =============================================================================

@router.post("/immobilier/leases", response_model=Lease)
async def create_lease(
    owner_id: str,
    property_id: str,
    tenant_ids: List[str],
    lease_type: LeaseType,
    start_date: date,
    monthly_rent: float,
    end_date: Optional[date] = None
):
    """Crée un bail"""
    if property_id not in store.properties:
        raise HTTPException(404, "Property not found")
    
    lease = Lease(
        owner_id=owner_id,
        property_id=property_id,
        tenant_ids=tenant_ids,
        lease_type=lease_type,
        start_date=start_date,
        end_date=end_date,
        monthly_rent=monthly_rent
    )
    store.leases[lease.id] = lease
    index_by_owner(owner_id, "leases", lease.id)
    
    # Update property status
    store.properties[property_id].status = PropertyStatus.RENTED
    store.properties[property_id].financials.monthly_rent = monthly_rent
    
    return lease

@router.get("/immobilier/leases", response_model=List[Lease])
async def list_leases(owner_id: str, status: Optional[LeaseStatus] = None):
    """Liste les baux"""
    lease_ids = get_by_owner(owner_id, "leases")
    leases = [store.leases[lid] for lid in lease_ids if lid in store.leases]
    
    if status:
        leases = [l for l in leases if l.status == status]
    
    return leases

@router.post("/immobilier/leases/{lease_id}/sign")
async def sign_lease(lease_id: str):
    """Signe un bail"""
    if lease_id not in store.leases:
        raise HTTPException(404, "Lease not found")
    
    lease = store.leases[lease_id]
    lease.status = LeaseStatus.ACTIVE
    lease.signed_at = datetime.utcnow()
    
    return {"status": "signed"}

# =============================================================================
# API - IMMOBILIER - RENT PAYMENTS
# =============================================================================

@router.post("/immobilier/payments", response_model=RentPayment)
async def record_rent_payment(lease_id: str, tenant_id: str, amount: float, due_date: date, paid_date: Optional[date] = None):
    """Enregistre un paiement de loyer"""
    if lease_id not in store.leases:
        raise HTTPException(404, "Lease not found")
    
    payment = RentPayment(
        lease_id=lease_id,
        tenant_id=tenant_id,
        amount=amount,
        due_date=due_date,
        paid_date=paid_date,
        status="paid" if paid_date else "pending"
    )
    store.rent_payments[payment.id] = payment
    return payment

@router.get("/immobilier/payments", response_model=List[RentPayment])
async def list_rent_payments(lease_id: str, status: Optional[str] = None):
    """Liste les paiements"""
    payments = [p for p in store.rent_payments.values() if p.lease_id == lease_id]
    
    if status:
        payments = [p for p in payments if p.status == status]
    
    return sorted(payments, key=lambda x: x.due_date, reverse=True)

# =============================================================================
# API - IMMOBILIER - VALUATIONS
# =============================================================================

@router.post("/immobilier/valuations", response_model=PropertyValuation)
async def create_valuation(property_id: str, valuation_type: str, estimated_value: float, valuation_date: Optional[date] = None):
    """Crée une évaluation"""
    if property_id not in store.properties:
        raise HTTPException(404, "Property not found")
    
    valuation = PropertyValuation(
        property_id=property_id,
        valuation_type=valuation_type,
        estimated_value=estimated_value,
        valuation_date=valuation_date or date.today()
    )
    store.valuations[valuation.id] = valuation
    
    # Update property current value
    store.properties[property_id].financials.current_value = estimated_value
    store.properties[property_id].financials.last_valuation_date = valuation.valuation_date
    
    return valuation

@router.get("/immobilier/properties/{property_id}/valuations", response_model=List[PropertyValuation])
async def list_valuations(property_id: str):
    """Liste les évaluations"""
    valuations = [v for v in store.valuations.values() if v.property_id == property_id]
    return sorted(valuations, key=lambda x: x.valuation_date, reverse=True)

# =============================================================================
# API - IMMOBILIER - MAINTENANCE
# =============================================================================

@router.post("/immobilier/maintenance", response_model=MaintenanceRequest)
async def create_maintenance_request(property_id: str, title: str, description: str, category: str, tenant_id: Optional[str] = None):
    """Crée une demande de maintenance"""
    if property_id not in store.properties:
        raise HTTPException(404, "Property not found")
    
    request = MaintenanceRequest(
        property_id=property_id,
        tenant_id=tenant_id,
        title=title,
        description=description,
        category=category
    )
    store.maintenance[request.id] = request
    return request

@router.get("/immobilier/maintenance", response_model=List[MaintenanceRequest])
async def list_maintenance_requests(property_id: Optional[str] = None, status: Optional[str] = None):
    """Liste les demandes de maintenance"""
    requests = list(store.maintenance.values())
    
    if property_id:
        requests = [r for r in requests if r.property_id == property_id]
    
    if status:
        requests = [r for r in requests if r.status == status]
    
    return sorted(requests, key=lambda x: x.created_at, reverse=True)

@router.put("/immobilier/maintenance/{request_id}", response_model=MaintenanceRequest)
async def update_maintenance_request(request_id: str, updates: Dict[str, Any]):
    """Met à jour une demande"""
    if request_id not in store.maintenance:
        raise HTTPException(404, "Maintenance request not found")
    
    request = store.maintenance[request_id]
    for key, value in updates.items():
        if hasattr(request, key):
            setattr(request, key, value)
    
    if updates.get("status") == "completed":
        request.completed_at = datetime.utcnow()
    
    return request

# =============================================================================
# HEALTH
# =============================================================================

@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "gouvernement": {
            "tax_records": len(store.tax_records),
            "permits": len(store.permits),
            "documents": len(store.gov_documents)
        },
        "immobilier": {
            "properties": len(store.properties),
            "leases": len(store.leases),
            "tenants": len(store.tenants)
        }
    }
