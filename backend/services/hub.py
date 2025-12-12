"""
CHE·NU v6.0 - Unified Integration Hub
═══════════════════════════════════════════════════════════════════════════════
Point d'entrée centralisé pour toutes les intégrations.

Author: CHE·NU Team
Version: 6.0
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from enum import Enum
import logging

logger = logging.getLogger("CHE·NU.Integrations.Hub")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class IntegrationCategory(Enum):
    """Catégories d'intégration."""
    ACCOUNTING = "accounting"
    MARKETING = "marketing"
    ADMIN = "admin"
    CONSTRUCTION = "construction"
    HR = "hr"
    ECOMMERCE = "ecommerce"


class IntegrationProvider(Enum):
    """Tous les providers supportés."""
    # Comptabilité
    QUICKBOOKS = "quickbooks"
    XERO = "xero"
    STRIPE = "stripe"
    WAVE = "wave"
    
    # Marketing
    HUBSPOT = "hubspot"
    MAILCHIMP = "mailchimp"
    GOOGLE_ADS = "google_ads"
    META_ADS = "meta_ads"
    SENDINBLUE = "sendinblue"
    
    # Administration
    DOCUSIGN = "docusign"
    CALENDLY = "calendly"
    NOTION = "notion"
    AIRTABLE = "airtable"
    TRELLO = "trello"
    TWILIO = "twilio"
    
    # Construction
    PROCORE = "procore"
    AUTODESK = "autodesk"
    
    # RH
    BAMBOOHR = "bamboohr"
    GUSTO = "gusto"
    DEPUTY = "deputy"
    
    # E-Commerce
    SHOPIFY = "shopify"
    WOOCOMMERCE = "woocommerce"
    SQUARE = "square"


@dataclass
class ProviderInfo:
    """Informations sur un provider."""
    provider: IntegrationProvider
    category: IntegrationCategory
    name: str
    icon: str
    description: str
    features: List[str]
    auth_type: str
    docs_url: str
    requires_config: List[str]


# Registry complet des providers
PROVIDER_REGISTRY: Dict[IntegrationProvider, ProviderInfo] = {
    IntegrationProvider.QUICKBOOKS: ProviderInfo(
        provider=IntegrationProvider.QUICKBOOKS,
        category=IntegrationCategory.ACCOUNTING,
        name="QuickBooks Online",
        icon="🟢",
        description="Comptabilité et facturation pour PME",
        features=["factures", "dépenses", "clients", "rapports", "taxes"],
        auth_type="oauth2",
        docs_url="https://developer.intuit.com/app/developer/qbo/docs/api",
        requires_config=["access_token", "realm_id"]
    ),
    IntegrationProvider.XERO: ProviderInfo(
        provider=IntegrationProvider.XERO,
        category=IntegrationCategory.ACCOUNTING,
        name="Xero",
        icon="🔵",
        description="Comptabilité cloud pour entreprises",
        features=["factures", "paiements", "comptes", "rapports"],
        auth_type="oauth2",
        docs_url="https://developer.xero.com/documentation/api",
        requires_config=["access_token", "tenant_id"]
    ),
    IntegrationProvider.STRIPE: ProviderInfo(
        provider=IntegrationProvider.STRIPE,
        category=IntegrationCategory.ACCOUNTING,
        name="Stripe",
        icon="💳",
        description="Paiements en ligne",
        features=["paiements", "abonnements", "factures", "remboursements"],
        auth_type="api_key",
        docs_url="https://stripe.com/docs/api",
        requires_config=["access_token"]
    ),
    IntegrationProvider.HUBSPOT: ProviderInfo(
        provider=IntegrationProvider.HUBSPOT,
        category=IntegrationCategory.MARKETING,
        name="HubSpot",
        icon="🟠",
        description="CRM et marketing automation",
        features=["contacts", "deals", "emails", "formulaires"],
        auth_type="oauth2",
        docs_url="https://developers.hubspot.com/docs/api",
        requires_config=["access_token"]
    ),
    IntegrationProvider.MAILCHIMP: ProviderInfo(
        provider=IntegrationProvider.MAILCHIMP,
        category=IntegrationCategory.MARKETING,
        name="Mailchimp",
        icon="🐒",
        description="Email marketing",
        features=["audiences", "campagnes", "automations", "rapports"],
        auth_type="api_key",
        docs_url="https://mailchimp.com/developer/marketing/api/",
        requires_config=["api_key"]
    ),
    IntegrationProvider.SHOPIFY: ProviderInfo(
        provider=IntegrationProvider.SHOPIFY,
        category=IntegrationCategory.ECOMMERCE,
        name="Shopify",
        icon="🛍️",
        description="Plateforme e-commerce",
        features=["produits", "commandes", "clients", "inventaire", "analytics"],
        auth_type="oauth2",
        docs_url="https://shopify.dev/docs/api",
        requires_config=["access_token", "shop_name"]
    ),
    IntegrationProvider.PROCORE: ProviderInfo(
        provider=IntegrationProvider.PROCORE,
        category=IntegrationCategory.CONSTRUCTION,
        name="Procore",
        icon="🏗️",
        description="Gestion de projets de construction",
        features=["projets", "rfis", "daily logs", "budget"],
        auth_type="oauth2",
        docs_url="https://developers.procore.com/documentation",
        requires_config=["access_token", "company_id"]
    ),
    IntegrationProvider.BAMBOOHR: ProviderInfo(
        provider=IntegrationProvider.BAMBOOHR,
        category=IntegrationCategory.HR,
        name="BambooHR",
        icon="🎋",
        description="Gestion RH",
        features=["employés", "congés", "rapports", "onboarding"],
        auth_type="api_key",
        docs_url="https://documentation.bamboohr.com/reference",
        requires_config=["api_key", "company_domain"]
    ),
}


# ═══════════════════════════════════════════════════════════════════════════════
# INTEGRATION HUB
# ═══════════════════════════════════════════════════════════════════════════════

class IntegrationHub:
    """
    🔌 Hub Central d'Intégrations
    
    Point d'entrée unique pour accéder à toutes les intégrations.
    """
    
    def __init__(self):
        """Initialise le hub avec tous les services."""
        # Import lazy pour éviter les imports circulaires
        from .accounting import create_accounting_service
        from .marketing import create_marketing_service
        from .administration import create_admin_service
        from .construction_hr import create_construction_service, create_hr_service
        from .ecommerce import create_ecommerce_service
        
        self.accounting = create_accounting_service()
        self.marketing = create_marketing_service()
        self.admin = create_admin_service()
        self.construction = create_construction_service()
        self.hr = create_hr_service()
        self.ecommerce = create_ecommerce_service()
        
        # Tax calculator
        from .accounting import CanadianTaxCalculator
        self.tax_calculator = CanadianTaxCalculator()
        
        logger.info("🔌 IntegrationHub initialized")
    
    def get_all_providers(self) -> List[ProviderInfo]:
        """Retourne tous les providers supportés."""
        return list(PROVIDER_REGISTRY.values())
    
    def get_providers_by_category(
        self,
        category: IntegrationCategory
    ) -> List[ProviderInfo]:
        """Retourne les providers d'une catégorie."""
        return [
            p for p in PROVIDER_REGISTRY.values()
            if p.category == category
        ]
    
    def get_provider_info(
        self,
        provider: IntegrationProvider
    ) -> Optional[ProviderInfo]:
        """Retourne les infos d'un provider."""
        return PROVIDER_REGISTRY.get(provider)
    
    def register_client(
        self,
        account_id: str,
        provider: IntegrationProvider,
        **credentials
    ) -> bool:
        """
        Enregistre un client pour un provider donné.
        """
        try:
            info = PROVIDER_REGISTRY.get(provider)
            if not info:
                raise ValueError(f"Unknown provider: {provider}")
            
            # Vérifier les paramètres requis
            missing = [p for p in info.requires_config if p not in credentials]
            if missing:
                raise ValueError(f"Missing config for {provider.value}: {missing}")
            
            # Enregistrer selon la catégorie
            if info.category == IntegrationCategory.ACCOUNTING:
                if provider == IntegrationProvider.QUICKBOOKS:
                    self.accounting.register_quickbooks(
                        account_id,
                        credentials["access_token"],
                        credentials["realm_id"],
                        credentials.get("refresh_token")
                    )
                elif provider == IntegrationProvider.XERO:
                    self.accounting.register_xero(
                        account_id,
                        credentials["access_token"],
                        credentials["tenant_id"],
                        credentials.get("refresh_token")
                    )
                elif provider == IntegrationProvider.STRIPE:
                    self.accounting.register_stripe(
                        account_id,
                        credentials["access_token"]
                    )
            
            elif info.category == IntegrationCategory.MARKETING:
                if provider == IntegrationProvider.HUBSPOT:
                    self.marketing.register_hubspot(
                        account_id,
                        credentials["access_token"]
                    )
                elif provider == IntegrationProvider.MAILCHIMP:
                    self.marketing.register_mailchimp(
                        account_id,
                        credentials["api_key"]
                    )
            
            elif info.category == IntegrationCategory.ECOMMERCE:
                if provider == IntegrationProvider.SHOPIFY:
                    self.ecommerce.register_shopify(
                        account_id,
                        credentials["access_token"],
                        credentials["shop_name"]
                    )
            
            elif info.category == IntegrationCategory.CONSTRUCTION:
                if provider == IntegrationProvider.PROCORE:
                    self.construction.register_procore(
                        account_id,
                        credentials["access_token"],
                        int(credentials["company_id"])
                    )
            
            elif info.category == IntegrationCategory.HR:
                if provider == IntegrationProvider.BAMBOOHR:
                    self.hr.register_bamboohr(
                        account_id,
                        credentials["api_key"],
                        credentials["company_domain"]
                    )
            
            logger.info(f"✅ Registered {provider.value} for account {account_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to register {provider.value}: {e}")
            return False
    
    def calculate_taxes(
        self,
        amount: Decimal,
        province: str = "QC"
    ) -> Dict[str, Decimal]:
        """Calcule les taxes canadiennes."""
        return self.tax_calculator.calculate_taxes(amount, province)
    
    async def get_business_dashboard(
        self,
        account_ids: Dict[IntegrationCategory, List[str]],
        start_date: date,
        end_date: date
    ) -> Dict[str, Any]:
        """Génère un dashboard business unifié."""
        dashboard = {
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "summary": {
                "revenue": 0.0,
                "expenses": 0.0,
                "profit": 0.0,
                "orders": 0,
                "employees": 0
            },
            "sections": {}
        }
        
        # E-Commerce
        if IntegrationCategory.ECOMMERCE in account_ids:
            ecom_data = await self.ecommerce.get_unified_dashboard(
                account_ids[IntegrationCategory.ECOMMERCE],
                start_date,
                end_date
            )
            dashboard["sections"]["ecommerce"] = ecom_data
            dashboard["summary"]["revenue"] = ecom_data["totals"]["sales"]
            dashboard["summary"]["orders"] = ecom_data["totals"]["orders"]
        
        # Marketing
        if IntegrationCategory.MARKETING in account_ids:
            marketing_data = await self.marketing.get_marketing_dashboard(
                account_ids[IntegrationCategory.MARKETING],
                start_date,
                end_date
            )
            dashboard["sections"]["marketing"] = marketing_data
        
        # RH
        if IntegrationCategory.HR in account_ids:
            hr_data = await self.hr.get_workforce_summary(
                account_ids[IntegrationCategory.HR]
            )
            dashboard["sections"]["hr"] = hr_data
            dashboard["summary"]["employees"] = hr_data.get("active_employees", 0)
        
        dashboard["summary"]["profit"] = (
            dashboard["summary"]["revenue"] - dashboard["summary"]["expenses"]
        )
        
        return dashboard


def create_integration_hub() -> IntegrationHub:
    """Factory pour créer le hub d'intégrations."""
    return IntegrationHub()
