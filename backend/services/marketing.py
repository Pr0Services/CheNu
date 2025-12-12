"""
CHE·NU v6.0 - Marketing Integrations
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
IntÃ©grations marketing et publicitÃ©:
- HubSpot CRM
- Mailchimp
- Google Ads
- Facebook/Meta Ads
- LinkedIn Ads
- Sendinblue
- ActiveCampaign

Author: CHE·NU Team
Version: 6.0
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, AsyncIterator
from dataclasses import dataclass, field
from datetime import datetime, date, timedelta
from decimal import Decimal
from enum import Enum
import logging
import aiohttp
import json

logger = logging.getLogger("CHE·NU.Integrations.Marketing")


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# ENUMS & TYPES
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class ContactStatus(Enum):
    SUBSCRIBED = "subscribed"
    UNSUBSCRIBED = "unsubscribed"
    PENDING = "pending"
    CLEANED = "cleaned"
    BOUNCED = "bounced"


class CampaignStatus(Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    SENDING = "sending"
    SENT = "sent"
    PAUSED = "paused"
    CANCELLED = "cancelled"


class CampaignType(Enum):
    EMAIL = "email"
    SMS = "sms"
    SOCIAL = "social"
    ADS = "ads"
    AUTOMATION = "automation"


class LeadStatus(Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    WON = "won"
    LOST = "lost"


class AdStatus(Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    DELETED = "deleted"
    PENDING = "pending"
    DISAPPROVED = "disapproved"


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# DATA CLASSES
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

@dataclass
class MarketingContact:
    """Contact marketing."""
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    status: ContactStatus = ContactStatus.SUBSCRIBED
    tags: List[str] = field(default_factory=list)
    custom_fields: Dict[str, Any] = field(default_factory=dict)
    source: Optional[str] = None
    created_at: Optional[datetime] = None
    last_activity: Optional[datetime] = None
    
    @property
    def full_name(self) -> str:
        parts = [self.first_name, self.last_name]
        return " ".join(p for p in parts if p) or self.email


@dataclass
class Lead:
    """Lead/Prospect."""
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    status: LeadStatus = LeadStatus.NEW
    source: Optional[str] = None
    score: int = 0
    owner_id: Optional[str] = None
    deal_value: Decimal = Decimal("0")
    notes: Optional[str] = None
    custom_fields: Dict[str, Any] = field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


@dataclass
class EmailCampaign:
    """Campagne email."""
    id: str
    name: str
    subject: str
    status: CampaignStatus
    from_name: str
    from_email: str
    list_ids: List[str] = field(default_factory=list)
    content_html: Optional[str] = None
    content_text: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    stats: Dict[str, int] = field(default_factory=dict)


@dataclass
class CampaignStats:
    """Statistiques de campagne."""
    campaign_id: str
    sent: int = 0
    delivered: int = 0
    opened: int = 0
    clicked: int = 0
    bounced: int = 0
    unsubscribed: int = 0
    spam_reports: int = 0
    
    @property
    def open_rate(self) -> float:
        return (self.opened / self.delivered * 100) if self.delivered > 0 else 0
    
    @property
    def click_rate(self) -> float:
        return (self.clicked / self.delivered * 100) if self.delivered > 0 else 0
    
    @property
    def bounce_rate(self) -> float:
        return (self.bounced / self.sent * 100) if self.sent > 0 else 0


@dataclass
class AdCampaign:
    """Campagne publicitaire."""
    id: str
    name: str
    platform: str  # google, facebook, linkedin
    status: AdStatus
    budget_daily: Decimal
    budget_total: Optional[Decimal] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    targeting: Dict[str, Any] = field(default_factory=dict)
    stats: Dict[str, Any] = field(default_factory=dict)


@dataclass
class AdMetrics:
    """MÃ©triques publicitaires."""
    impressions: int = 0
    clicks: int = 0
    conversions: int = 0
    spend: Decimal = Decimal("0")
    ctr: float = 0.0  # Click-through rate
    cpc: Decimal = Decimal("0")  # Cost per click
    cpm: Decimal = Decimal("0")  # Cost per mille
    cpa: Decimal = Decimal("0")  # Cost per acquisition
    roas: float = 0.0  # Return on ad spend


@dataclass
class EmailList:
    """Liste de diffusion."""
    id: str
    name: str
    member_count: int = 0
    unsubscribe_count: int = 0
    created_at: Optional[datetime] = None


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# BASE CLIENT
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class BaseMarketingClient:
    """Classe de base pour les clients marketing."""
    
    def __init__(self, access_token: str, **kwargs):
        self.access_token = access_token
        self.session: Optional[aiohttp.ClientSession] = None
        self.extra_config = kwargs
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(headers=self._get_headers())
        return self
    
    async def __aexit__(self, *args):
        if self.session:
            await self.session.close()
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# HUBSPOT INTEGRATION
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class HubSpotClient(BaseMarketingClient):
    """
    ðŸŸ  Client HubSpot CRM
    
    FonctionnalitÃ©s:
    - Contacts et companies
    - Deals (opportunitÃ©s)
    - Email marketing
    - Formulaires et landing pages
    - Analytics
    """
    
    BASE_URL = "https://api.hubapi.com"
    
    # --- Contacts ---
    async def list_contacts(
        self,
        limit: int = 100,
        after: str = None
    ) -> Dict[str, Any]:
        """Liste les contacts."""
        params = {"limit": limit}
        if after:
            params["after"] = after
        
        async with self.session.get(
            f"{self.BASE_URL}/crm/v3/objects/contacts",
            params=params
        ) as resp:
            return await resp.json()
    
    async def get_contact(self, contact_id: str) -> MarketingContact:
        """RÃ©cupÃ¨re un contact."""
        async with self.session.get(
            f"{self.BASE_URL}/crm/v3/objects/contacts/{contact_id}",
            params={"properties": "email,firstname,lastname,phone,company,jobtitle,lifecyclestage"}
        ) as resp:
            data = await resp.json()
            props = data.get("properties", {})
            
            return MarketingContact(
                id=data.get("id"),
                email=props.get("email", ""),
                first_name=props.get("firstname"),
                last_name=props.get("lastname"),
                phone=props.get("phone"),
                company=props.get("company"),
                job_title=props.get("jobtitle"),
                created_at=datetime.fromisoformat(data.get("createdAt").replace("Z", "+00:00")) if data.get("createdAt") else None
            )
    
    async def create_contact(self, contact: MarketingContact) -> MarketingContact:
        """CrÃ©e un contact."""
        payload = {
            "properties": {
                "email": contact.email,
                "firstname": contact.first_name,
                "lastname": contact.last_name,
                "phone": contact.phone,
                "company": contact.company,
                "jobtitle": contact.job_title
            }
        }
        
        async with self.session.post(
            f"{self.BASE_URL}/crm/v3/objects/contacts",
            json=payload
        ) as resp:
            data = await resp.json()
            contact.id = data.get("id")
            return contact
    
    async def update_contact(self, contact_id: str, properties: Dict[str, Any]) -> Dict:
        """Met Ã  jour un contact."""
        async with self.session.patch(
            f"{self.BASE_URL}/crm/v3/objects/contacts/{contact_id}",
            json={"properties": properties}
        ) as resp:
            return await resp.json()
    
    async def search_contacts(self, query: str, limit: int = 10) -> List[MarketingContact]:
        """Recherche des contacts."""
        payload = {
            "query": query,
            "limit": limit
        }
        
        async with self.session.post(
            f"{self.BASE_URL}/crm/v3/objects/contacts/search",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return [
                MarketingContact(
                    id=r.get("id"),
                    email=r.get("properties", {}).get("email", ""),
                    first_name=r.get("properties", {}).get("firstname"),
                    last_name=r.get("properties", {}).get("lastname")
                )
                for r in data.get("results", [])
            ]
    
    # --- Companies ---
    async def list_companies(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Liste les entreprises."""
        async with self.session.get(
            f"{self.BASE_URL}/crm/v3/objects/companies",
            params={"limit": limit}
        ) as resp:
            data = await resp.json()
            return data.get("results", [])
    
    async def create_company(
        self,
        name: str,
        domain: str = None,
        industry: str = None
    ) -> Dict[str, Any]:
        """CrÃ©e une entreprise."""
        properties = {"name": name}
        if domain:
            properties["domain"] = domain
        if industry:
            properties["industry"] = industry
        
        async with self.session.post(
            f"{self.BASE_URL}/crm/v3/objects/companies",
            json={"properties": properties}
        ) as resp:
            return await resp.json()
    
    # --- Deals ---
    async def list_deals(self, limit: int = 100) -> List[Lead]:
        """Liste les deals/opportunitÃ©s."""
        async with self.session.get(
            f"{self.BASE_URL}/crm/v3/objects/deals",
            params={
                "limit": limit,
                "properties": "dealname,amount,dealstage,closedate,pipeline"
            }
        ) as resp:
            data = await resp.json()
            
            return [
                Lead(
                    id=d.get("id"),
                    email="",  # Deals don't have email directly
                    company=d.get("properties", {}).get("dealname"),
                    deal_value=Decimal(str(d.get("properties", {}).get("amount", 0) or 0)),
                    status=LeadStatus.NEW  # Map from dealstage
                )
                for d in data.get("results", [])
            ]
    
    async def create_deal(
        self,
        name: str,
        amount: Decimal,
        stage: str,
        contact_id: str = None,
        company_id: str = None
    ) -> Dict[str, Any]:
        """CrÃ©e un deal."""
        payload = {
            "properties": {
                "dealname": name,
                "amount": str(amount),
                "dealstage": stage
            }
        }
        
        associations = []
        if contact_id:
            associations.append({
                "to": {"id": contact_id},
                "types": [{"associationCategory": "HUBSPOT_DEFINED", "associationTypeId": 3}]
            })
        if company_id:
            associations.append({
                "to": {"id": company_id},
                "types": [{"associationCategory": "HUBSPOT_DEFINED", "associationTypeId": 5}]
            })
        
        if associations:
            payload["associations"] = associations
        
        async with self.session.post(
            f"{self.BASE_URL}/crm/v3/objects/deals",
            json=payload
        ) as resp:
            return await resp.json()
    
    # --- Email Marketing ---
    async def list_marketing_emails(self) -> List[Dict[str, Any]]:
        """Liste les emails marketing."""
        async with self.session.get(
            f"{self.BASE_URL}/marketing/v3/emails"
        ) as resp:
            data = await resp.json()
            return data.get("results", [])
    
    async def get_email_stats(self, email_id: str) -> CampaignStats:
        """RÃ©cupÃ¨re les stats d'un email."""
        async with self.session.get(
            f"{self.BASE_URL}/marketing/v3/emails/{email_id}/statistics"
        ) as resp:
            data = await resp.json()
            
            return CampaignStats(
                campaign_id=email_id,
                sent=data.get("counters", {}).get("sent", 0),
                delivered=data.get("counters", {}).get("delivered", 0),
                opened=data.get("counters", {}).get("open", 0),
                clicked=data.get("counters", {}).get("click", 0),
                bounced=data.get("counters", {}).get("bounce", 0),
                unsubscribed=data.get("counters", {}).get("unsubscribed", 0)
            )
    
    # --- Forms ---
    async def list_forms(self) -> List[Dict[str, Any]]:
        """Liste les formulaires."""
        async with self.session.get(f"{self.BASE_URL}/marketing/v3/forms") as resp:
            data = await resp.json()
            return data.get("results", [])
    
    async def get_form_submissions(self, form_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """RÃ©cupÃ¨re les soumissions d'un formulaire."""
        async with self.session.get(
            f"{self.BASE_URL}/form-integrations/v1/submissions/forms/{form_id}",
            params={"limit": limit}
        ) as resp:
            data = await resp.json()
            return data.get("results", [])
    
    # --- Analytics ---
    async def get_analytics_views(
        self,
        start_date: date,
        end_date: date
    ) -> Dict[str, Any]:
        """RÃ©cupÃ¨re les analytics de pages vues."""
        async with self.session.get(
            f"{self.BASE_URL}/analytics/v2/reports/totals/summarize/daily",
            params={
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            }
        ) as resp:
            return await resp.json()


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# MAILCHIMP INTEGRATION
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class MailchimpClient(BaseMarketingClient):
    """
    ðŸ’ Client Mailchimp
    
    FonctionnalitÃ©s:
    - Listes et audiences
    - Campagnes email
    - Automations
    - Templates
    - Reports
    """
    
    def __init__(self, api_key: str, server: str = None):
        # Mailchimp API key format: xxx-us1 (server is after the dash)
        if "-" in api_key and not server:
            server = api_key.split("-")[-1]
        
        self.api_key = api_key
        self.server = server or "us1"
        self.base_url = f"https://{self.server}.api.mailchimp.com/3.0"
        super().__init__(api_key)
    
    def _get_headers(self) -> Dict[str, str]:
        import base64
        auth = base64.b64encode(f"anystring:{self.api_key}".encode()).decode()
        return {
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/json"
        }
    
    # --- Lists/Audiences ---
    async def list_audiences(self) -> List[EmailList]:
        """Liste les audiences."""
        async with self.session.get(f"{self.base_url}/lists") as resp:
            data = await resp.json()
            
            return [
                EmailList(
                    id=lst.get("id"),
                    name=lst.get("name"),
                    member_count=lst.get("stats", {}).get("member_count", 0),
                    unsubscribe_count=lst.get("stats", {}).get("unsubscribe_count", 0)
                )
                for lst in data.get("lists", [])
            ]
    
    async def get_audience(self, list_id: str) -> Dict[str, Any]:
        """RÃ©cupÃ¨re une audience."""
        async with self.session.get(f"{self.base_url}/lists/{list_id}") as resp:
            return await resp.json()
    
    # --- Members ---
    async def list_members(
        self,
        list_id: str,
        status: ContactStatus = None,
        count: int = 100
    ) -> List[MarketingContact]:
        """Liste les membres d'une audience."""
        params = {"count": count}
        if status:
            params["status"] = status.value
        
        async with self.session.get(
            f"{self.base_url}/lists/{list_id}/members",
            params=params
        ) as resp:
            data = await resp.json()
            
            return [
                MarketingContact(
                    id=m.get("id"),
                    email=m.get("email_address", ""),
                    first_name=m.get("merge_fields", {}).get("FNAME"),
                    last_name=m.get("merge_fields", {}).get("LNAME"),
                    status=ContactStatus(m.get("status", "subscribed")),
                    tags=[t.get("name") for t in m.get("tags", [])],
                    source=m.get("source")
                )
                for m in data.get("members", [])
            ]
    
    async def add_member(
        self,
        list_id: str,
        contact: MarketingContact
    ) -> MarketingContact:
        """Ajoute un membre Ã  une audience."""
        payload = {
            "email_address": contact.email,
            "status": contact.status.value,
            "merge_fields": {
                "FNAME": contact.first_name or "",
                "LNAME": contact.last_name or ""
            }
        }
        
        if contact.tags:
            payload["tags"] = contact.tags
        
        async with self.session.post(
            f"{self.base_url}/lists/{list_id}/members",
            json=payload
        ) as resp:
            data = await resp.json()
            contact.id = data.get("id")
            return contact
    
    async def update_member(
        self,
        list_id: str,
        email: str,
        updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Met Ã  jour un membre."""
        import hashlib
        subscriber_hash = hashlib.md5(email.lower().encode()).hexdigest()
        
        async with self.session.patch(
            f"{self.base_url}/lists/{list_id}/members/{subscriber_hash}",
            json=updates
        ) as resp:
            return await resp.json()
    
    async def add_tags(self, list_id: str, email: str, tags: List[str]):
        """Ajoute des tags Ã  un membre."""
        import hashlib
        subscriber_hash = hashlib.md5(email.lower().encode()).hexdigest()
        
        payload = {
            "tags": [{"name": tag, "status": "active"} for tag in tags]
        }
        
        async with self.session.post(
            f"{self.base_url}/lists/{list_id}/members/{subscriber_hash}/tags",
            json=payload
        ) as resp:
            return resp.status == 204
    
    # --- Campaigns ---
    async def list_campaigns(
        self,
        status: CampaignStatus = None,
        count: int = 100
    ) -> List[EmailCampaign]:
        """Liste les campagnes."""
        params = {"count": count}
        if status:
            params["status"] = status.value
        
        async with self.session.get(
            f"{self.base_url}/campaigns",
            params=params
        ) as resp:
            data = await resp.json()
            
            return [
                EmailCampaign(
                    id=c.get("id"),
                    name=c.get("settings", {}).get("title", ""),
                    subject=c.get("settings", {}).get("subject_line", ""),
                    status=CampaignStatus(c.get("status", "draft")),
                    from_name=c.get("settings", {}).get("from_name", ""),
                    from_email=c.get("settings", {}).get("reply_to", ""),
                    list_ids=[c.get("recipients", {}).get("list_id")] if c.get("recipients", {}).get("list_id") else []
                )
                for c in data.get("campaigns", [])
            ]
    
    async def create_campaign(
        self,
        list_id: str,
        subject: str,
        from_name: str,
        reply_to: str,
        title: str = None
    ) -> EmailCampaign:
        """CrÃ©e une campagne."""
        payload = {
            "type": "regular",
            "recipients": {"list_id": list_id},
            "settings": {
                "subject_line": subject,
                "title": title or subject,
                "from_name": from_name,
                "reply_to": reply_to
            }
        }
        
        async with self.session.post(
            f"{self.base_url}/campaigns",
            json=payload
        ) as resp:
            data = await resp.json()
            
            return EmailCampaign(
                id=data.get("id"),
                name=title or subject,
                subject=subject,
                status=CampaignStatus.DRAFT,
                from_name=from_name,
                from_email=reply_to,
                list_ids=[list_id]
            )
    
    async def set_campaign_content(
        self,
        campaign_id: str,
        html: str,
        plain_text: str = None
    ):
        """DÃ©finit le contenu d'une campagne."""
        payload = {"html": html}
        if plain_text:
            payload["plain_text"] = plain_text
        
        async with self.session.put(
            f"{self.base_url}/campaigns/{campaign_id}/content",
            json=payload
        ) as resp:
            return await resp.json()
    
    async def send_campaign(self, campaign_id: str) -> bool:
        """Envoie une campagne."""
        async with self.session.post(
            f"{self.base_url}/campaigns/{campaign_id}/actions/send"
        ) as resp:
            return resp.status == 204
    
    async def schedule_campaign(
        self,
        campaign_id: str,
        schedule_time: datetime
    ) -> bool:
        """Planifie une campagne."""
        payload = {
            "schedule_time": schedule_time.isoformat()
        }
        
        async with self.session.post(
            f"{self.base_url}/campaigns/{campaign_id}/actions/schedule",
            json=payload
        ) as resp:
            return resp.status == 204
    
    # --- Reports ---
    async def get_campaign_report(self, campaign_id: str) -> CampaignStats:
        """RÃ©cupÃ¨re le rapport d'une campagne."""
        async with self.session.get(
            f"{self.base_url}/reports/{campaign_id}"
        ) as resp:
            data = await resp.json()
            
            return CampaignStats(
                campaign_id=campaign_id,
                sent=data.get("emails_sent", 0),
                delivered=data.get("emails_sent", 0) - data.get("bounces", {}).get("hard_bounces", 0),
                opened=data.get("opens", {}).get("unique_opens", 0),
                clicked=data.get("clicks", {}).get("unique_clicks", 0),
                bounced=data.get("bounces", {}).get("hard_bounces", 0) + data.get("bounces", {}).get("soft_bounces", 0),
                unsubscribed=data.get("unsubscribed", 0)
            )
    
    # --- Templates ---
    async def list_templates(self) -> List[Dict[str, Any]]:
        """Liste les templates."""
        async with self.session.get(f"{self.base_url}/templates") as resp:
            data = await resp.json()
            return data.get("templates", [])


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# GOOGLE ADS INTEGRATION
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class GoogleAdsClient(BaseMarketingClient):
    """
    ðŸ”´ Client Google Ads
    
    FonctionnalitÃ©s:
    - Campagnes et groupes d'annonces
    - Keywords
    - Rapports de performance
    - Budget et enchÃ¨res
    """
    
    BASE_URL = "https://googleads.googleapis.com/v14"
    
    def __init__(self, access_token: str, customer_id: str, developer_token: str):
        super().__init__(access_token)
        self.customer_id = customer_id.replace("-", "")
        self.developer_token = developer_token
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "developer-token": self.developer_token,
            "Content-Type": "application/json"
        }
    
    async def _search(self, query: str) -> List[Dict[str, Any]]:
        """ExÃ©cute une requÃªte GAQL."""
        async with self.session.post(
            f"{self.BASE_URL}/customers/{self.customer_id}/googleAds:searchStream",
            json={"query": query}
        ) as resp:
            data = await resp.json()
            results = []
            for batch in data:
                results.extend(batch.get("results", []))
            return results
    
    # --- Campaigns ---
    async def list_campaigns(self) -> List[AdCampaign]:
        """Liste les campagnes."""
        query = """
            SELECT 
                campaign.id,
                campaign.name,
                campaign.status,
                campaign_budget.amount_micros
            FROM campaign
            WHERE campaign.status != 'REMOVED'
        """
        
        results = await self._search(query)
        
        return [
            AdCampaign(
                id=str(r.get("campaign", {}).get("id")),
                name=r.get("campaign", {}).get("name", ""),
                platform="google",
                status=AdStatus(r.get("campaign", {}).get("status", "").lower()),
                budget_daily=Decimal(str(r.get("campaignBudget", {}).get("amountMicros", 0))) / 1000000
            )
            for r in results
        ]
    
    async def get_campaign_performance(
        self,
        campaign_id: str,
        start_date: date,
        end_date: date
    ) -> AdMetrics:
        """RÃ©cupÃ¨re les performances d'une campagne."""
        query = f"""
            SELECT 
                metrics.impressions,
                metrics.clicks,
                metrics.conversions,
                metrics.cost_micros,
                metrics.ctr,
                metrics.average_cpc
            FROM campaign
            WHERE campaign.id = {campaign_id}
            AND segments.date BETWEEN '{start_date.isoformat()}' AND '{end_date.isoformat()}'
        """
        
        results = await self._search(query)
        
        if not results:
            return AdMetrics()
        
        metrics = results[0].get("metrics", {})
        
        return AdMetrics(
            impressions=metrics.get("impressions", 0),
            clicks=metrics.get("clicks", 0),
            conversions=int(metrics.get("conversions", 0)),
            spend=Decimal(str(metrics.get("costMicros", 0))) / 1000000,
            ctr=metrics.get("ctr", 0) * 100,
            cpc=Decimal(str(metrics.get("averageCpc", 0))) / 1000000
        )
    
    # --- Keywords ---
    async def list_keywords(self, ad_group_id: str = None) -> List[Dict[str, Any]]:
        """Liste les mots-clÃ©s."""
        where_clause = ""
        if ad_group_id:
            where_clause = f"AND ad_group.id = {ad_group_id}"
        
        query = f"""
            SELECT 
                ad_group_criterion.keyword.text,
                ad_group_criterion.keyword.match_type,
                ad_group_criterion.status,
                metrics.impressions,
                metrics.clicks,
                metrics.cost_micros
            FROM keyword_view
            WHERE ad_group_criterion.status != 'REMOVED'
            {where_clause}
        """
        
        return await self._search(query)
    
    async def add_keyword(
        self,
        ad_group_id: str,
        keyword: str,
        match_type: str = "BROAD"
    ) -> Dict[str, Any]:
        """Ajoute un mot-clÃ©."""
        # Simplified - real implementation would use mutate
        return {"keyword": keyword, "match_type": match_type, "status": "pending"}
    
    # --- Account Summary ---
    async def get_account_summary(
        self,
        start_date: date,
        end_date: date
    ) -> Dict[str, Any]:
        """RÃ©cupÃ¨re un rÃ©sumÃ© du compte."""
        query = f"""
            SELECT 
                metrics.impressions,
                metrics.clicks,
                metrics.conversions,
                metrics.cost_micros,
                metrics.ctr,
                metrics.average_cpc
            FROM customer
            WHERE segments.date BETWEEN '{start_date.isoformat()}' AND '{end_date.isoformat()}'
        """
        
        results = await self._search(query)
        
        total = AdMetrics()
        for r in results:
            m = r.get("metrics", {})
            total.impressions += m.get("impressions", 0)
            total.clicks += m.get("clicks", 0)
            total.conversions += int(m.get("conversions", 0))
            total.spend += Decimal(str(m.get("costMicros", 0))) / 1000000
        
        if total.impressions > 0:
            total.ctr = total.clicks / total.impressions * 100
        if total.clicks > 0:
            total.cpc = total.spend / total.clicks
        
        return {
            "period": {"start": start_date.isoformat(), "end": end_date.isoformat()},
            "metrics": total.__dict__
        }


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# FACEBOOK/META ADS INTEGRATION
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class MetaAdsClient(BaseMarketingClient):
    """
    ðŸ”µ Client Meta (Facebook/Instagram) Ads
    
    FonctionnalitÃ©s:
    - Campagnes et ad sets
    - Audiences personnalisÃ©es
    - CrÃ©atifs publicitaires
    - Rapports de performance
    """
    
    BASE_URL = "https://graph.facebook.com/v18.0"
    
    def __init__(self, access_token: str, ad_account_id: str):
        super().__init__(access_token)
        self.ad_account_id = ad_account_id.replace("act_", "")
    
    @property
    def account_url(self) -> str:
        return f"{self.BASE_URL}/act_{self.ad_account_id}"
    
    # --- Campaigns ---
    async def list_campaigns(self) -> List[AdCampaign]:
        """Liste les campagnes."""
        async with self.session.get(
            f"{self.account_url}/campaigns",
            params={
                "fields": "id,name,status,daily_budget,lifetime_budget,start_time,stop_time"
            }
        ) as resp:
            data = await resp.json()
            
            return [
                AdCampaign(
                    id=c.get("id"),
                    name=c.get("name", ""),
                    platform="facebook",
                    status=AdStatus(c.get("status", "").lower()),
                    budget_daily=Decimal(str(c.get("daily_budget", 0))) / 100 if c.get("daily_budget") else Decimal("0"),
                    budget_total=Decimal(str(c.get("lifetime_budget", 0))) / 100 if c.get("lifetime_budget") else None
                )
                for c in data.get("data", [])
            ]
    
    async def create_campaign(
        self,
        name: str,
        objective: str,  # AWARENESS, TRAFFIC, ENGAGEMENT, LEADS, SALES, etc.
        daily_budget: Decimal = None,
        lifetime_budget: Decimal = None
    ) -> Dict[str, Any]:
        """CrÃ©e une campagne."""
        payload = {
            "name": name,
            "objective": objective,
            "status": "PAUSED",
            "special_ad_categories": []
        }
        
        if daily_budget:
            payload["daily_budget"] = int(daily_budget * 100)
        if lifetime_budget:
            payload["lifetime_budget"] = int(lifetime_budget * 100)
        
        async with self.session.post(
            f"{self.account_url}/campaigns",
            json=payload
        ) as resp:
            return await resp.json()
    
    # --- Ad Sets ---
    async def list_ad_sets(self, campaign_id: str = None) -> List[Dict[str, Any]]:
        """Liste les ad sets."""
        params = {
            "fields": "id,name,status,daily_budget,targeting,optimization_goal"
        }
        
        if campaign_id:
            url = f"{self.BASE_URL}/{campaign_id}/adsets"
        else:
            url = f"{self.account_url}/adsets"
        
        async with self.session.get(url, params=params) as resp:
            data = await resp.json()
            return data.get("data", [])
    
    async def create_ad_set(
        self,
        campaign_id: str,
        name: str,
        daily_budget: Decimal,
        targeting: Dict[str, Any],
        optimization_goal: str = "REACH"
    ) -> Dict[str, Any]:
        """CrÃ©e un ad set."""
        payload = {
            "campaign_id": campaign_id,
            "name": name,
            "daily_budget": int(daily_budget * 100),
            "billing_event": "IMPRESSIONS",
            "optimization_goal": optimization_goal,
            "targeting": targeting,
            "status": "PAUSED"
        }
        
        async with self.session.post(
            f"{self.account_url}/adsets",
            json=payload
        ) as resp:
            return await resp.json()
    
    # --- Insights ---
    async def get_insights(
        self,
        object_id: str,
        start_date: date,
        end_date: date,
        level: str = "campaign"
    ) -> AdMetrics:
        """RÃ©cupÃ¨re les insights."""
        async with self.session.get(
            f"{self.BASE_URL}/{object_id}/insights",
            params={
                "fields": "impressions,clicks,spend,ctr,cpc,cpm,actions",
                "time_range": json.dumps({
                    "since": start_date.isoformat(),
                    "until": end_date.isoformat()
                }),
                "level": level
            }
        ) as resp:
            data = await resp.json()
            
            if not data.get("data"):
                return AdMetrics()
            
            insights = data["data"][0]
            
            # Trouver les conversions dans actions
            conversions = 0
            for action in insights.get("actions", []):
                if action.get("action_type") in ["purchase", "lead", "complete_registration"]:
                    conversions += int(action.get("value", 0))
            
            return AdMetrics(
                impressions=int(insights.get("impressions", 0)),
                clicks=int(insights.get("clicks", 0)),
                conversions=conversions,
                spend=Decimal(str(insights.get("spend", 0))),
                ctr=float(insights.get("ctr", 0)),
                cpc=Decimal(str(insights.get("cpc", 0))),
                cpm=Decimal(str(insights.get("cpm", 0)))
            )
    
    async def get_account_insights(
        self,
        start_date: date,
        end_date: date
    ) -> Dict[str, Any]:
        """RÃ©cupÃ¨re les insights du compte."""
        metrics = await self.get_insights(
            f"act_{self.ad_account_id}",
            start_date,
            end_date,
            level="account"
        )
        
        return {
            "period": {"start": start_date.isoformat(), "end": end_date.isoformat()},
            "metrics": metrics.__dict__
        }
    
    # --- Custom Audiences ---
    async def list_custom_audiences(self) -> List[Dict[str, Any]]:
        """Liste les audiences personnalisÃ©es."""
        async with self.session.get(
            f"{self.account_url}/customaudiences",
            params={"fields": "id,name,subtype,approximate_count"}
        ) as resp:
            data = await resp.json()
            return data.get("data", [])
    
    async def create_custom_audience(
        self,
        name: str,
        description: str = None,
        subtype: str = "CUSTOM"
    ) -> Dict[str, Any]:
        """CrÃ©e une audience personnalisÃ©e."""
        payload = {
            "name": name,
            "subtype": subtype,
            "customer_file_source": "USER_PROVIDED_ONLY"
        }
        if description:
            payload["description"] = description
        
        async with self.session.post(
            f"{self.account_url}/customaudiences",
            json=payload
        ) as resp:
            return await resp.json()


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# SENDINBLUE/BREVO INTEGRATION
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class SendinblueClient(BaseMarketingClient):
    """
    ðŸ’™ Client Sendinblue/Brevo
    
    FonctionnalitÃ©s:
    - Email transactionnel
    - Email marketing
    - SMS
    - Automation
    """
    
    BASE_URL = "https://api.sendinblue.com/v3"
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "api-key": self.access_token,
            "Content-Type": "application/json"
        }
    
    # --- Contacts ---
    async def list_contacts(self, limit: int = 50, offset: int = 0) -> List[MarketingContact]:
        """Liste les contacts."""
        async with self.session.get(
            f"{self.BASE_URL}/contacts",
            params={"limit": limit, "offset": offset}
        ) as resp:
            data = await resp.json()
            
            return [
                MarketingContact(
                    id=str(c.get("id")),
                    email=c.get("email", ""),
                    first_name=c.get("attributes", {}).get("FIRSTNAME"),
                    last_name=c.get("attributes", {}).get("LASTNAME"),
                    phone=c.get("attributes", {}).get("SMS")
                )
                for c in data.get("contacts", [])
            ]
    
    async def create_contact(self, contact: MarketingContact, list_ids: List[int] = None) -> Dict:
        """CrÃ©e un contact."""
        payload = {
            "email": contact.email,
            "attributes": {
                "FIRSTNAME": contact.first_name,
                "LASTNAME": contact.last_name,
                "SMS": contact.phone
            }
        }
        
        if list_ids:
            payload["listIds"] = list_ids
        
        async with self.session.post(
            f"{self.BASE_URL}/contacts",
            json=payload
        ) as resp:
            return await resp.json()
    
    # --- Email Campaigns ---
    async def list_campaigns(self, status: str = None) -> List[EmailCampaign]:
        """Liste les campagnes."""
        params = {"type": "classic"}
        if status:
            params["status"] = status
        
        async with self.session.get(
            f"{self.BASE_URL}/emailCampaigns",
            params=params
        ) as resp:
            data = await resp.json()
            
            return [
                EmailCampaign(
                    id=str(c.get("id")),
                    name=c.get("name", ""),
                    subject=c.get("subject", ""),
                    status=CampaignStatus(c.get("status", "draft")),
                    from_name=c.get("sender", {}).get("name", ""),
                    from_email=c.get("sender", {}).get("email", "")
                )
                for c in data.get("campaigns", [])
            ]
    
    async def send_transactional_email(
        self,
        to_email: str,
        to_name: str,
        subject: str,
        html_content: str,
        sender_email: str,
        sender_name: str
    ) -> Dict[str, Any]:
        """Envoie un email transactionnel."""
        payload = {
            "sender": {"email": sender_email, "name": sender_name},
            "to": [{"email": to_email, "name": to_name}],
            "subject": subject,
            "htmlContent": html_content
        }
        
        async with self.session.post(
            f"{self.BASE_URL}/smtp/email",
            json=payload
        ) as resp:
            return await resp.json()
    
    # --- SMS ---
    async def send_sms(
        self,
        recipient: str,
        content: str,
        sender: str = "CHE·NU"
    ) -> Dict[str, Any]:
        """Envoie un SMS."""
        payload = {
            "sender": sender,
            "recipient": recipient,
            "content": content
        }
        
        async with self.session.post(
            f"{self.BASE_URL}/transactionalSMS/sms",
            json=payload
        ) as resp:
            return await resp.json()


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# MARKETING SERVICE (Unified Interface)
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class MarketingService:
    """
    ðŸ“¢ Service Marketing UnifiÃ©
    
    Interface unifiÃ©e pour tous les providers marketing.
    """
    
    def __init__(self):
        self._clients: Dict[str, BaseMarketingClient] = {}
    
    def register_hubspot(self, account_id: str, access_token: str):
        self._clients[account_id] = HubSpotClient(access_token)
    
    def register_mailchimp(self, account_id: str, api_key: str):
        self._clients[account_id] = MailchimpClient(api_key)
    
    def register_google_ads(
        self,
        account_id: str,
        access_token: str,
        customer_id: str,
        developer_token: str
    ):
        self._clients[account_id] = GoogleAdsClient(access_token, customer_id, developer_token)
    
    def register_meta_ads(self, account_id: str, access_token: str, ad_account_id: str):
        self._clients[account_id] = MetaAdsClient(access_token, ad_account_id)
    
    def register_sendinblue(self, account_id: str, api_key: str):
        self._clients[account_id] = SendinblueClient(api_key)
    
    def get_client(self, account_id: str) -> BaseMarketingClient:
        if account_id not in self._clients:
            raise ValueError(f"Account {account_id} not registered")
        return self._clients[account_id]
    
    async def get_marketing_dashboard(
        self,
        account_ids: List[str],
        start_date: date,
        end_date: date
    ) -> Dict[str, Any]:
        """
        RÃ©cupÃ¨re un dashboard marketing agrÃ©gÃ©.
        """
        dashboard = {
            "period": {"start": start_date.isoformat(), "end": end_date.isoformat()},
            "email": {"sent": 0, "opened": 0, "clicked": 0},
            "ads": {"spend": Decimal("0"), "impressions": 0, "clicks": 0, "conversions": 0},
            "contacts": {"total": 0, "new": 0}
        }
        
        for account_id in account_ids:
            client = self.get_client(account_id)
            
            async with client:
                if isinstance(client, (MailchimpClient, SendinblueClient)):
                    # Email stats
                    campaigns = await client.list_campaigns()
                    for campaign in campaigns[:10]:
                        if hasattr(client, "get_campaign_report"):
                            stats = await client.get_campaign_report(campaign.id)
                            dashboard["email"]["sent"] += stats.sent
                            dashboard["email"]["opened"] += stats.opened
                            dashboard["email"]["clicked"] += stats.clicked
                
                elif isinstance(client, (GoogleAdsClient, MetaAdsClient)):
                    # Ads stats
                    if isinstance(client, GoogleAdsClient):
                        summary = await client.get_account_summary(start_date, end_date)
                    else:
                        summary = await client.get_account_insights(start_date, end_date)
                    
                    metrics = summary.get("metrics", {})
                    dashboard["ads"]["spend"] += Decimal(str(metrics.get("spend", 0)))
                    dashboard["ads"]["impressions"] += metrics.get("impressions", 0)
                    dashboard["ads"]["clicks"] += metrics.get("clicks", 0)
                    dashboard["ads"]["conversions"] += metrics.get("conversions", 0)
        
        # Calculate rates
        if dashboard["email"]["sent"] > 0:
            dashboard["email"]["open_rate"] = round(
                dashboard["email"]["opened"] / dashboard["email"]["sent"] * 100, 2
            )
            dashboard["email"]["click_rate"] = round(
                dashboard["email"]["clicked"] / dashboard["email"]["sent"] * 100, 2
            )
        
        if dashboard["ads"]["impressions"] > 0:
            dashboard["ads"]["ctr"] = round(
                dashboard["ads"]["clicks"] / dashboard["ads"]["impressions"] * 100, 2
            )
        
        if dashboard["ads"]["clicks"] > 0:
            dashboard["ads"]["cpc"] = round(
                float(dashboard["ads"]["spend"]) / dashboard["ads"]["clicks"], 2
            )
        
        return dashboard


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# FACTORY
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

def create_marketing_service() -> MarketingService:
    """Factory pour le service marketing."""
    return MarketingService()
