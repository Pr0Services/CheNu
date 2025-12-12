"""
CHE·NU Unified - CRM Integrations
═══════════════════════════════════════════════════════════════════════════════
Clients CRM pour Salesforce, Pipedrive, Zoho CRM, Freshsales.

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime, date
from decimal import Decimal
from enum import Enum
import logging
import aiohttp

logger = logging.getLogger("CHE·NU.Integrations.CRM")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class LeadStatus(str, Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    UNQUALIFIED = "unqualified"
    CONVERTED = "converted"


class DealStage(str, Enum):
    PROSPECTING = "prospecting"
    QUALIFICATION = "qualification"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"


class ActivityType(str, Enum):
    CALL = "call"
    EMAIL = "email"
    MEETING = "meeting"
    TASK = "task"
    NOTE = "note"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class CRMContact:
    """Contact CRM unifié."""
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    title: Optional[str] = None
    
    # Address
    address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "CA"
    
    # CRM data
    owner_id: Optional[str] = None
    lead_source: Optional[str] = None
    status: LeadStatus = LeadStatus.NEW
    
    # Metadata
    tags: List[str] = field(default_factory=list)
    custom_fields: Dict[str, Any] = field(default_factory=dict)
    
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @property
    def full_name(self) -> str:
        parts = [self.first_name, self.last_name]
        return " ".join(p for p in parts if p) or self.email


@dataclass
class CRMDeal:
    """Opportunité/Deal CRM unifié."""
    id: str
    name: str
    amount: Decimal
    currency: str = "CAD"
    
    # Stage
    stage: DealStage = DealStage.PROSPECTING
    probability: int = 0  # 0-100
    
    # Relations
    contact_id: Optional[str] = None
    company_id: Optional[str] = None
    owner_id: Optional[str] = None
    
    # Dates
    close_date: Optional[date] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    # Metadata
    description: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    custom_fields: Dict[str, Any] = field(default_factory=dict)


@dataclass
class CRMActivity:
    """Activité CRM (call, email, meeting, etc.)."""
    id: str
    type: ActivityType
    subject: str
    
    # Relations
    contact_id: Optional[str] = None
    deal_id: Optional[str] = None
    owner_id: Optional[str] = None
    
    # Content
    description: Optional[str] = None
    outcome: Optional[str] = None
    
    # Timing
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    
    # Status
    is_completed: bool = False
    
    created_at: Optional[datetime] = None


@dataclass
class CRMCompany:
    """Compte/Entreprise CRM."""
    id: str
    name: str
    
    # Details
    website: Optional[str] = None
    industry: Optional[str] = None
    employees: Optional[int] = None
    revenue: Optional[Decimal] = None
    
    # Address
    address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    country: str = "CA"
    
    # Relations
    owner_id: Optional[str] = None
    
    # Metadata
    phone: Optional[str] = None
    description: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    
    created_at: Optional[datetime] = None


# ═══════════════════════════════════════════════════════════════════════════════
# SALESFORCE CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class SalesforceClient:
    """
    🔵 Client Salesforce
    
    Fonctionnalités:
    - Leads, Contacts, Accounts
    - Opportunities
    - Activities (Tasks, Events)
    - Reports
    """
    
    BASE_URL = "https://{instance}.salesforce.com/services/data/v59.0"
    
    def __init__(
        self,
        access_token: str,
        instance_url: str,
        refresh_token: Optional[str] = None
    ):
        self.access_token = access_token
        self.instance_url = instance_url
        self.refresh_token = refresh_token
        self._session: Optional[aiohttp.ClientSession] = None
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
    
    @property
    def base_url(self) -> str:
        return f"{self.instance_url}/services/data/v59.0"
    
    # --- Leads ---
    async def list_leads(
        self,
        status: Optional[str] = None,
        limit: int = 100
    ) -> List[CRMContact]:
        """Liste les leads."""
        query = "SELECT Id, Email, FirstName, LastName, Phone, Company, Status, LeadSource, CreatedDate FROM Lead"
        if status:
            query += f" WHERE Status = '{status}'"
        query += f" LIMIT {limit}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/query",
                headers=self._get_headers(),
                params={"q": query}
            ) as resp:
                data = await resp.json()
                return [self._parse_lead(r) for r in data.get("records", [])]
    
    async def create_lead(
        self,
        email: str,
        last_name: str,
        company: str,
        **kwargs
    ) -> CRMContact:
        """Crée un nouveau lead."""
        payload = {
            "Email": email,
            "LastName": last_name,
            "Company": company,
            "FirstName": kwargs.get("first_name"),
            "Phone": kwargs.get("phone"),
            "LeadSource": kwargs.get("lead_source"),
            "Status": kwargs.get("status", "New")
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/sobjects/Lead",
                headers=self._get_headers(),
                json={k: v for k, v in payload.items() if v}
            ) as resp:
                data = await resp.json()
                return CRMContact(
                    id=data.get("id", ""),
                    email=email,
                    last_name=last_name,
                    company=company
                )
    
    # --- Opportunities ---
    async def list_opportunities(
        self,
        stage: Optional[str] = None,
        limit: int = 100
    ) -> List[CRMDeal]:
        """Liste les opportunités."""
        query = """
            SELECT Id, Name, Amount, StageName, Probability, CloseDate, 
                   AccountId, OwnerId, CreatedDate
            FROM Opportunity
        """
        if stage:
            query += f" WHERE StageName = '{stage}'"
        query += f" LIMIT {limit}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/query",
                headers=self._get_headers(),
                params={"q": query}
            ) as resp:
                data = await resp.json()
                return [self._parse_opportunity(r) for r in data.get("records", [])]
    
    async def create_opportunity(
        self,
        name: str,
        amount: Decimal,
        stage: str,
        close_date: date,
        **kwargs
    ) -> CRMDeal:
        """Crée une nouvelle opportunité."""
        payload = {
            "Name": name,
            "Amount": float(amount),
            "StageName": stage,
            "CloseDate": close_date.isoformat(),
            "AccountId": kwargs.get("account_id"),
            "Probability": kwargs.get("probability", 50)
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/sobjects/Opportunity",
                headers=self._get_headers(),
                json={k: v for k, v in payload.items() if v}
            ) as resp:
                data = await resp.json()
                return CRMDeal(
                    id=data.get("id", ""),
                    name=name,
                    amount=amount,
                    stage=DealStage.PROSPECTING
                )
    
    # --- Accounts ---
    async def list_accounts(self, limit: int = 100) -> List[CRMCompany]:
        """Liste les comptes."""
        query = f"""
            SELECT Id, Name, Website, Industry, NumberOfEmployees, 
                   BillingCity, BillingState, BillingCountry, Phone
            FROM Account LIMIT {limit}
        """
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/query",
                headers=self._get_headers(),
                params={"q": query}
            ) as resp:
                data = await resp.json()
                return [self._parse_account(r) for r in data.get("records", [])]
    
    # --- Parse helpers ---
    def _parse_lead(self, data: Dict) -> CRMContact:
        return CRMContact(
            id=data.get("Id", ""),
            email=data.get("Email", ""),
            first_name=data.get("FirstName"),
            last_name=data.get("LastName"),
            phone=data.get("Phone"),
            company=data.get("Company"),
            lead_source=data.get("LeadSource"),
            status=LeadStatus.NEW,
            created_at=datetime.fromisoformat(data["CreatedDate"].replace("Z", "+00:00")) if data.get("CreatedDate") else None
        )
    
    def _parse_opportunity(self, data: Dict) -> CRMDeal:
        stage_map = {
            "Prospecting": DealStage.PROSPECTING,
            "Qualification": DealStage.QUALIFICATION,
            "Proposal/Price Quote": DealStage.PROPOSAL,
            "Negotiation/Review": DealStage.NEGOTIATION,
            "Closed Won": DealStage.CLOSED_WON,
            "Closed Lost": DealStage.CLOSED_LOST
        }
        
        return CRMDeal(
            id=data.get("Id", ""),
            name=data.get("Name", ""),
            amount=Decimal(str(data.get("Amount", 0))),
            stage=stage_map.get(data.get("StageName"), DealStage.PROSPECTING),
            probability=data.get("Probability", 0),
            company_id=data.get("AccountId"),
            owner_id=data.get("OwnerId"),
            close_date=date.fromisoformat(data["CloseDate"]) if data.get("CloseDate") else None
        )
    
    def _parse_account(self, data: Dict) -> CRMCompany:
        return CRMCompany(
            id=data.get("Id", ""),
            name=data.get("Name", ""),
            website=data.get("Website"),
            industry=data.get("Industry"),
            employees=data.get("NumberOfEmployees"),
            city=data.get("BillingCity"),
            province=data.get("BillingState"),
            country=data.get("BillingCountry", "CA"),
            phone=data.get("Phone")
        )


# ═══════════════════════════════════════════════════════════════════════════════
# PIPEDRIVE CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class PipedriveClient:
    """
    🟢 Client Pipedrive
    
    Fonctionnalités:
    - Persons (Contacts)
    - Organizations
    - Deals
    - Activities
    - Pipelines
    """
    
    BASE_URL = "https://api.pipedrive.com/v1"
    
    def __init__(self, api_token: str):
        self.api_token = api_token
    
    def _get_params(self, **extra) -> Dict[str, Any]:
        return {"api_token": self.api_token, **extra}
    
    # --- Persons ---
    async def list_persons(
        self,
        limit: int = 100,
        start: int = 0
    ) -> List[CRMContact]:
        """Liste les personnes (contacts)."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/persons",
                params=self._get_params(limit=limit, start=start)
            ) as resp:
                data = await resp.json()
                return [self._parse_person(p) for p in data.get("data", []) or []]
    
    async def create_person(
        self,
        name: str,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        org_id: Optional[int] = None
    ) -> CRMContact:
        """Crée une nouvelle personne."""
        payload = {
            "name": name,
            "email": [{"value": email, "primary": True}] if email else None,
            "phone": [{"value": phone, "primary": True}] if phone else None,
            "org_id": org_id
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/persons",
                params=self._get_params(),
                json={k: v for k, v in payload.items() if v}
            ) as resp:
                data = await resp.json()
                return self._parse_person(data.get("data", {}))
    
    # --- Deals ---
    async def list_deals(
        self,
        status: str = "open",
        limit: int = 100
    ) -> List[CRMDeal]:
        """Liste les deals."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/deals",
                params=self._get_params(status=status, limit=limit)
            ) as resp:
                data = await resp.json()
                return [self._parse_deal(d) for d in data.get("data", []) or []]
    
    async def create_deal(
        self,
        title: str,
        value: Decimal,
        currency: str = "CAD",
        person_id: Optional[int] = None,
        org_id: Optional[int] = None,
        stage_id: Optional[int] = None
    ) -> CRMDeal:
        """Crée un nouveau deal."""
        payload = {
            "title": title,
            "value": float(value),
            "currency": currency,
            "person_id": person_id,
            "org_id": org_id,
            "stage_id": stage_id
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/deals",
                params=self._get_params(),
                json={k: v for k, v in payload.items() if v}
            ) as resp:
                data = await resp.json()
                return self._parse_deal(data.get("data", {}))
    
    # --- Organizations ---
    async def list_organizations(self, limit: int = 100) -> List[CRMCompany]:
        """Liste les organisations."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/organizations",
                params=self._get_params(limit=limit)
            ) as resp:
                data = await resp.json()
                return [self._parse_org(o) for o in data.get("data", []) or []]
    
    # --- Activities ---
    async def list_activities(
        self,
        type: Optional[str] = None,
        done: Optional[bool] = None,
        limit: int = 100
    ) -> List[CRMActivity]:
        """Liste les activités."""
        params = self._get_params(limit=limit)
        if type:
            params["type"] = type
        if done is not None:
            params["done"] = 1 if done else 0
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/activities",
                params=params
            ) as resp:
                data = await resp.json()
                return [self._parse_activity(a) for a in data.get("data", []) or []]
    
    async def create_activity(
        self,
        subject: str,
        type: str,
        due_date: Optional[date] = None,
        deal_id: Optional[int] = None,
        person_id: Optional[int] = None
    ) -> CRMActivity:
        """Crée une nouvelle activité."""
        payload = {
            "subject": subject,
            "type": type,
            "due_date": due_date.isoformat() if due_date else None,
            "deal_id": deal_id,
            "person_id": person_id
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/activities",
                params=self._get_params(),
                json={k: v for k, v in payload.items() if v}
            ) as resp:
                data = await resp.json()
                return self._parse_activity(data.get("data", {}))
    
    # --- Pipeline ---
    async def get_pipeline_summary(self) -> Dict[str, Any]:
        """Résumé du pipeline de ventes."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/deals/summary",
                params=self._get_params()
            ) as resp:
                data = await resp.json()
                summary = data.get("data", {})
                return {
                    "total_count": summary.get("total_count", 0),
                    "total_value": summary.get("total_currency_converted_value", 0),
                    "weighted_value": summary.get("weighted_currency_converted_value", 0),
                    "by_stage": summary.get("values_total", {})
                }
    
    # --- Parse helpers ---
    def _parse_person(self, data: Dict) -> CRMContact:
        emails = data.get("email", [])
        phones = data.get("phone", [])
        
        return CRMContact(
            id=str(data.get("id", "")),
            email=emails[0].get("value", "") if emails else "",
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            phone=phones[0].get("value") if phones else None,
            company=data.get("org_name"),
            owner_id=str(data.get("owner_id", "")) if data.get("owner_id") else None,
            created_at=datetime.fromisoformat(data["add_time"]) if data.get("add_time") else None
        )
    
    def _parse_deal(self, data: Dict) -> CRMDeal:
        return CRMDeal(
            id=str(data.get("id", "")),
            name=data.get("title", ""),
            amount=Decimal(str(data.get("value", 0))),
            currency=data.get("currency", "CAD"),
            contact_id=str(data.get("person_id")) if data.get("person_id") else None,
            company_id=str(data.get("org_id")) if data.get("org_id") else None,
            owner_id=str(data.get("owner_id")) if data.get("owner_id") else None,
            probability=data.get("probability", 0),
            close_date=date.fromisoformat(data["expected_close_date"]) if data.get("expected_close_date") else None,
            created_at=datetime.fromisoformat(data["add_time"]) if data.get("add_time") else None
        )
    
    def _parse_org(self, data: Dict) -> CRMCompany:
        return CRMCompany(
            id=str(data.get("id", "")),
            name=data.get("name", ""),
            address=data.get("address"),
            owner_id=str(data.get("owner_id")) if data.get("owner_id") else None,
            created_at=datetime.fromisoformat(data["add_time"]) if data.get("add_time") else None
        )
    
    def _parse_activity(self, data: Dict) -> CRMActivity:
        type_map = {
            "call": ActivityType.CALL,
            "email": ActivityType.EMAIL,
            "meeting": ActivityType.MEETING,
            "task": ActivityType.TASK
        }
        
        return CRMActivity(
            id=str(data.get("id", "")),
            type=type_map.get(data.get("type", ""), ActivityType.TASK),
            subject=data.get("subject", ""),
            contact_id=str(data.get("person_id")) if data.get("person_id") else None,
            deal_id=str(data.get("deal_id")) if data.get("deal_id") else None,
            owner_id=str(data.get("user_id")) if data.get("user_id") else None,
            description=data.get("note"),
            is_completed=data.get("done", False),
            due_date=datetime.fromisoformat(data["due_date"]) if data.get("due_date") else None
        )


# ═══════════════════════════════════════════════════════════════════════════════
# ZOHO CRM CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class ZohoCRMClient:
    """
    🔴 Client Zoho CRM
    
    Fonctionnalités:
    - Leads, Contacts, Accounts
    - Deals
    - Tasks, Events
    - Campaigns
    """
    
    BASE_URL = "https://www.zohoapis.com/crm/v3"
    
    def __init__(self, access_token: str, refresh_token: Optional[str] = None):
        self.access_token = access_token
        self.refresh_token = refresh_token
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Zoho-oauthtoken {self.access_token}",
            "Content-Type": "application/json"
        }
    
    async def list_leads(self, limit: int = 100) -> List[CRMContact]:
        """Liste les leads Zoho."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/Leads",
                headers=self._get_headers(),
                params={"per_page": limit}
            ) as resp:
                data = await resp.json()
                return [self._parse_lead(l) for l in data.get("data", []) or []]
    
    async def list_deals(self, limit: int = 100) -> List[CRMDeal]:
        """Liste les deals Zoho."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/Deals",
                headers=self._get_headers(),
                params={"per_page": limit}
            ) as resp:
                data = await resp.json()
                return [self._parse_deal(d) for d in data.get("data", []) or []]
    
    async def list_accounts(self, limit: int = 100) -> List[CRMCompany]:
        """Liste les comptes Zoho."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/Accounts",
                headers=self._get_headers(),
                params={"per_page": limit}
            ) as resp:
                data = await resp.json()
                return [self._parse_account(a) for a in data.get("data", []) or []]
    
    def _parse_lead(self, data: Dict) -> CRMContact:
        return CRMContact(
            id=data.get("id", ""),
            email=data.get("Email", ""),
            first_name=data.get("First_Name"),
            last_name=data.get("Last_Name"),
            phone=data.get("Phone"),
            company=data.get("Company"),
            lead_source=data.get("Lead_Source")
        )
    
    def _parse_deal(self, data: Dict) -> CRMDeal:
        return CRMDeal(
            id=data.get("id", ""),
            name=data.get("Deal_Name", ""),
            amount=Decimal(str(data.get("Amount", 0))),
            company_id=data.get("Account_Name", {}).get("id") if isinstance(data.get("Account_Name"), dict) else None,
            close_date=date.fromisoformat(data["Closing_Date"]) if data.get("Closing_Date") else None
        )
    
    def _parse_account(self, data: Dict) -> CRMCompany:
        return CRMCompany(
            id=data.get("id", ""),
            name=data.get("Account_Name", ""),
            website=data.get("Website"),
            industry=data.get("Industry"),
            phone=data.get("Phone")
        )


# ═══════════════════════════════════════════════════════════════════════════════
# CRM SERVICE UNIFIÉ
# ═══════════════════════════════════════════════════════════════════════════════

class CRMService:
    """
    🎯 Service CRM Unifié
    
    Gère tous les clients CRM avec une interface commune.
    """
    
    def __init__(self):
        self._salesforce_clients: Dict[str, SalesforceClient] = {}
        self._pipedrive_clients: Dict[str, PipedriveClient] = {}
        self._zoho_clients: Dict[str, ZohoCRMClient] = {}
    
    # --- Registration ---
    def register_salesforce(
        self,
        account_id: str,
        access_token: str,
        instance_url: str,
        refresh_token: Optional[str] = None
    ) -> None:
        self._salesforce_clients[account_id] = SalesforceClient(
            access_token, instance_url, refresh_token
        )
        logger.info(f"✅ Salesforce registered: {account_id}")
    
    def register_pipedrive(self, account_id: str, api_token: str) -> None:
        self._pipedrive_clients[account_id] = PipedriveClient(api_token)
        logger.info(f"✅ Pipedrive registered: {account_id}")
    
    def register_zoho(
        self,
        account_id: str,
        access_token: str,
        refresh_token: Optional[str] = None
    ) -> None:
        self._zoho_clients[account_id] = ZohoCRMClient(access_token, refresh_token)
        logger.info(f"✅ Zoho CRM registered: {account_id}")
    
    # --- Unified Methods ---
    async def get_all_contacts(
        self,
        account_ids: List[str],
        limit_per_account: int = 50
    ) -> List[CRMContact]:
        """Récupère les contacts de tous les CRM configurés."""
        all_contacts = []
        
        for account_id in account_ids:
            if account_id in self._salesforce_clients:
                contacts = await self._salesforce_clients[account_id].list_leads(limit_per_account)
                all_contacts.extend(contacts)
            
            if account_id in self._pipedrive_clients:
                contacts = await self._pipedrive_clients[account_id].list_persons(limit_per_account)
                all_contacts.extend(contacts)
            
            if account_id in self._zoho_clients:
                contacts = await self._zoho_clients[account_id].list_leads(limit_per_account)
                all_contacts.extend(contacts)
        
        return all_contacts
    
    async def get_all_deals(
        self,
        account_ids: List[str],
        limit_per_account: int = 50
    ) -> List[CRMDeal]:
        """Récupère les deals de tous les CRM configurés."""
        all_deals = []
        
        for account_id in account_ids:
            if account_id in self._salesforce_clients:
                deals = await self._salesforce_clients[account_id].list_opportunities(limit=limit_per_account)
                all_deals.extend(deals)
            
            if account_id in self._pipedrive_clients:
                deals = await self._pipedrive_clients[account_id].list_deals(limit=limit_per_account)
                all_deals.extend(deals)
            
            if account_id in self._zoho_clients:
                deals = await self._zoho_clients[account_id].list_deals(limit=limit_per_account)
                all_deals.extend(deals)
        
        return all_deals
    
    async def get_pipeline_dashboard(
        self,
        account_ids: List[str]
    ) -> Dict[str, Any]:
        """Dashboard unifié du pipeline de ventes."""
        total_deals = 0
        total_value = Decimal("0")
        by_stage: Dict[str, Dict[str, Any]] = {}
        
        all_deals = await self.get_all_deals(account_ids)
        
        for deal in all_deals:
            total_deals += 1
            total_value += deal.amount
            
            stage = deal.stage.value
            if stage not in by_stage:
                by_stage[stage] = {"count": 0, "value": Decimal("0")}
            by_stage[stage]["count"] += 1
            by_stage[stage]["value"] += deal.amount
        
        return {
            "total_deals": total_deals,
            "total_value": float(total_value),
            "by_stage": {k: {"count": v["count"], "value": float(v["value"])} for k, v in by_stage.items()},
            "sources": list(account_ids)
        }


def create_crm_service() -> CRMService:
    """Factory pour créer le service CRM."""
    return CRMService()


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    "LeadStatus",
    "DealStage",
    "ActivityType",
    
    # Data Classes
    "CRMContact",
    "CRMDeal",
    "CRMActivity",
    "CRMCompany",
    
    # Clients
    "SalesforceClient",
    "PipedriveClient",
    "ZohoCRMClient",
    
    # Service
    "CRMService",
    "create_crm_service"
]
