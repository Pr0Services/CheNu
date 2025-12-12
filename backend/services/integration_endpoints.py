"""
CHE·NU Unified - Integration API Endpoints
═══════════════════════════════════════════════════════════════════════════════
Endpoints REST pour connecter le frontend aux intégrations.

Ces endpoints permettent au frontend de:
- Lister les intégrations connectées
- Récupérer les données en temps réel (orders, invoices, contacts, etc.)
- Déclencher des syncs
- Gérer les connexions OAuth

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from fastapi import APIRouter, HTTPException, Depends, Query, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
from datetime import datetime, date, timedelta
from enum import Enum
import logging

logger = logging.getLogger("CHE·NU.API.Integrations")

router = APIRouter(prefix="/api/integrations", tags=["Integrations"])


# ═══════════════════════════════════════════════════════════════════════════════
# SCHEMAS
# ═══════════════════════════════════════════════════════════════════════════════

class IntegrationStatus(str, Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"
    SYNCING = "syncing"


class IntegrationProvider(str, Enum):
    SHOPIFY = "shopify"
    QUICKBOOKS = "quickbooks"
    STRIPE = "stripe"
    HUBSPOT = "hubspot"
    SALESFORCE = "salesforce"
    SLACK = "slack"
    XERO = "xero"
    MAILCHIMP = "mailchimp"
    ZENDESK = "zendesk"
    ASANA = "asana"


class ConnectionConfig(BaseModel):
    """Configuration pour connecter une intégration."""
    provider: IntegrationProvider
    credentials: Dict[str, str]  # api_key, access_token, etc.
    settings: Optional[Dict[str, Any]] = None


class SyncRequest(BaseModel):
    """Requête de synchronisation."""
    provider: IntegrationProvider
    data_types: List[str] = ["all"]  # orders, products, customers, etc.
    since: Optional[datetime] = None


class IntegrationInfo(BaseModel):
    """Informations sur une intégration."""
    provider: str
    status: IntegrationStatus
    connected_at: Optional[datetime] = None
    last_sync: Optional[datetime] = None
    account_name: Optional[str] = None
    data_counts: Dict[str, int] = {}


# ═══════════════════════════════════════════════════════════════════════════════
# IN-MEMORY STORAGE (à remplacer par DB en production)
# ═══════════════════════════════════════════════════════════════════════════════

# Stockage des connexions actives
_connections: Dict[str, Dict[str, Any]] = {}

# Cache des données
_data_cache: Dict[str, Dict[str, Any]] = {}


# ═══════════════════════════════════════════════════════════════════════════════
# MOCK DATA GENERATORS (pour démo sans vraies credentials)
# ═══════════════════════════════════════════════════════════════════════════════

def generate_mock_shopify_data() -> Dict[str, Any]:
    """Génère des données Shopify de démonstration."""
    return {
        "orders": [
            {"id": "ORD-1001", "customer": "Jean Tremblay", "total": 299.99, "status": "fulfilled", "date": "2024-12-01"},
            {"id": "ORD-1002", "customer": "Marie Gagnon", "total": 149.50, "status": "processing", "date": "2024-12-01"},
            {"id": "ORD-1003", "customer": "Pierre Roy", "total": 524.00, "status": "pending", "date": "2024-11-30"},
            {"id": "ORD-1004", "customer": "Sophie Martin", "total": 89.99, "status": "fulfilled", "date": "2024-11-30"},
            {"id": "ORD-1005", "customer": "Luc Dubois", "total": 1250.00, "status": "shipped", "date": "2024-11-29"},
        ],
        "products": [
            {"id": "PROD-001", "name": "Casque de sécurité Pro", "price": 89.99, "inventory": 150, "status": "active"},
            {"id": "PROD-002", "name": "Bottes de travail", "price": 149.99, "inventory": 75, "status": "active"},
            {"id": "PROD-003", "name": "Gants renforcés", "price": 34.99, "inventory": 200, "status": "active"},
            {"id": "PROD-004", "name": "Lunettes de protection", "price": 24.99, "inventory": 300, "status": "active"},
            {"id": "PROD-005", "name": "Ceinture à outils", "price": 79.99, "inventory": 45, "status": "low_stock"},
        ],
        "customers": [
            {"id": "CUST-001", "name": "Jean Tremblay", "email": "jean@example.com", "orders": 12, "total_spent": 2450.00},
            {"id": "CUST-002", "name": "Marie Gagnon", "email": "marie@example.com", "orders": 8, "total_spent": 1890.00},
            {"id": "CUST-003", "name": "Pierre Roy", "email": "pierre@example.com", "orders": 5, "total_spent": 980.00},
        ],
        "stats": {
            "total_orders": 156,
            "total_revenue": 45678.90,
            "orders_today": 12,
            "revenue_today": 2345.67,
            "avg_order_value": 292.81,
        }
    }


def generate_mock_quickbooks_data() -> Dict[str, Any]:
    """Génère des données QuickBooks de démonstration."""
    return {
        "invoices": [
            {"id": "INV-001", "customer": "Groupe ABC", "amount": 45000.00, "status": "paid", "date": "2024-11-15", "due": "2024-12-15"},
            {"id": "INV-002", "customer": "Immo Plus", "amount": 28500.00, "status": "pending", "date": "2024-11-20", "due": "2024-12-20"},
            {"id": "INV-003", "customer": "Tech Corp", "amount": 12000.00, "status": "overdue", "date": "2024-10-15", "due": "2024-11-15"},
            {"id": "INV-004", "customer": "Retail Inc", "amount": 85000.00, "status": "draft", "date": "2024-12-01", "due": "2024-12-31"},
        ],
        "expenses": [
            {"id": "EXP-001", "vendor": "Fournisseur A", "amount": 5600.00, "category": "Matériaux", "date": "2024-11-28"},
            {"id": "EXP-002", "vendor": "Location XYZ", "amount": 3500.00, "category": "Équipement", "date": "2024-11-25"},
            {"id": "EXP-003", "vendor": "Assurance Pro", "amount": 1200.00, "category": "Assurance", "date": "2024-11-20"},
        ],
        "accounts": [
            {"name": "Compte courant", "type": "bank", "balance": 125000.00},
            {"name": "Compte épargne", "type": "bank", "balance": 50000.00},
            {"name": "Comptes clients", "type": "receivable", "balance": 170500.00},
            {"name": "Comptes fournisseurs", "type": "payable", "balance": 45600.00},
        ],
        "stats": {
            "total_revenue_ytd": 890000.00,
            "total_expenses_ytd": 650000.00,
            "net_income_ytd": 240000.00,
            "accounts_receivable": 170500.00,
            "accounts_payable": 45600.00,
        }
    }


def generate_mock_hubspot_data() -> Dict[str, Any]:
    """Génère des données HubSpot de démonstration."""
    return {
        "contacts": [
            {"id": "C-001", "name": "Marc Leblanc", "email": "marc@acme.com", "company": "Acme Inc", "status": "lead"},
            {"id": "C-002", "name": "Julie Bouchard", "email": "julie@xyz.com", "company": "XYZ Corp", "status": "customer"},
            {"id": "C-003", "name": "François Côté", "email": "francois@abc.com", "company": "ABC Ltd", "status": "opportunity"},
        ],
        "deals": [
            {"id": "D-001", "name": "Projet Tour Montréal", "value": 250000, "stage": "proposal", "probability": 60},
            {"id": "D-002", "name": "Rénovation Bureau", "value": 85000, "stage": "negotiation", "probability": 80},
            {"id": "D-003", "name": "Construction Entrepôt", "value": 450000, "stage": "qualified", "probability": 40},
        ],
        "campaigns": [
            {"id": "CAM-001", "name": "Newsletter Décembre", "sent": 5000, "opened": 1250, "clicked": 320},
            {"id": "CAM-002", "name": "Promo Black Friday", "sent": 8000, "opened": 2400, "clicked": 890},
        ],
        "stats": {
            "total_contacts": 1250,
            "new_leads_month": 45,
            "deals_pipeline": 785000,
            "deals_won_month": 125000,
            "conversion_rate": 12.5,
        }
    }


def generate_mock_stripe_data() -> Dict[str, Any]:
    """Génère des données Stripe de démonstration."""
    return {
        "payments": [
            {"id": "PAY-001", "amount": 299.99, "status": "succeeded", "customer": "cust_ABC", "date": "2024-12-01"},
            {"id": "PAY-002", "amount": 149.50, "status": "succeeded", "customer": "cust_DEF", "date": "2024-12-01"},
            {"id": "PAY-003", "amount": 524.00, "status": "pending", "customer": "cust_GHI", "date": "2024-11-30"},
        ],
        "subscriptions": [
            {"id": "SUB-001", "customer": "Client Pro A", "plan": "Enterprise", "amount": 499, "status": "active"},
            {"id": "SUB-002", "customer": "Client Pro B", "plan": "Pro", "amount": 199, "status": "active"},
            {"id": "SUB-003", "customer": "Client C", "plan": "Basic", "amount": 49, "status": "trialing"},
        ],
        "stats": {
            "mrr": 12500,
            "arr": 150000,
            "total_customers": 156,
            "churn_rate": 2.5,
            "ltv": 2400,
        }
    }


MOCK_DATA_GENERATORS = {
    "shopify": generate_mock_shopify_data,
    "quickbooks": generate_mock_quickbooks_data,
    "hubspot": generate_mock_hubspot_data,
    "stripe": generate_mock_stripe_data,
}


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS - CONNEXIONS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/status")
async def get_all_integrations_status() -> Dict[str, Any]:
    """
    Récupère le statut de toutes les intégrations.
    
    Returns:
        Liste des intégrations avec leur statut
    """
    # Pour la démo, retourne des intégrations mock
    integrations = [
        {
            "provider": "shopify",
            "name": "Shopify",
            "icon": "🛒",
            "status": "connected",
            "connected_at": "2024-11-15T10:30:00Z",
            "last_sync": "2024-12-01T14:25:00Z",
            "account_name": "CHE·NU Store",
            "data_counts": {"orders": 156, "products": 45, "customers": 89}
        },
        {
            "provider": "quickbooks",
            "name": "QuickBooks",
            "icon": "💰",
            "status": "connected",
            "connected_at": "2024-10-01T09:00:00Z",
            "last_sync": "2024-12-01T14:20:00Z",
            "account_name": "CHE·NU Construction Inc",
            "data_counts": {"invoices": 234, "expenses": 567, "customers": 123}
        },
        {
            "provider": "hubspot",
            "name": "HubSpot",
            "icon": "🧡",
            "status": "connected",
            "connected_at": "2024-09-15T11:00:00Z",
            "last_sync": "2024-12-01T14:15:00Z",
            "account_name": "CHE·NU CRM",
            "data_counts": {"contacts": 1250, "deals": 45, "campaigns": 12}
        },
        {
            "provider": "stripe",
            "name": "Stripe",
            "icon": "💳",
            "status": "connected",
            "connected_at": "2024-08-01T08:00:00Z",
            "last_sync": "2024-12-01T14:30:00Z",
            "account_name": "CHE·NU Payments",
            "data_counts": {"payments": 890, "subscriptions": 45, "customers": 156}
        },
        {
            "provider": "slack",
            "name": "Slack",
            "icon": "💬",
            "status": "connected",
            "connected_at": "2024-07-01T12:00:00Z",
            "last_sync": "2024-12-01T14:00:00Z",
            "account_name": "CHE·NU Workspace",
            "data_counts": {"channels": 25, "members": 34}
        },
        {
            "provider": "salesforce",
            "name": "Salesforce",
            "icon": "☁️",
            "status": "disconnected",
            "connected_at": None,
            "last_sync": None,
            "account_name": None,
            "data_counts": {}
        },
        {
            "provider": "zendesk",
            "name": "Zendesk",
            "icon": "🎫",
            "status": "error",
            "connected_at": "2024-06-01T10:00:00Z",
            "last_sync": "2024-11-28T09:00:00Z",
            "account_name": "CHE·NU Support",
            "error": "Token expiré - reconnexion nécessaire",
            "data_counts": {}
        },
    ]
    
    return {
        "integrations": integrations,
        "summary": {
            "total": len(integrations),
            "connected": sum(1 for i in integrations if i["status"] == "connected"),
            "disconnected": sum(1 for i in integrations if i["status"] == "disconnected"),
            "error": sum(1 for i in integrations if i["status"] == "error"),
        }
    }


@router.post("/connect")
async def connect_integration(config: ConnectionConfig) -> Dict[str, Any]:
    """
    Connecte une nouvelle intégration.
    
    Args:
        config: Configuration avec credentials
        
    Returns:
        Statut de la connexion
    """
    provider = config.provider.value
    
    # En production, on initialiserait le vrai client ici
    # client = create_client(provider, config.credentials)
    # await client.test_connection()
    
    _connections[provider] = {
        "connected_at": datetime.utcnow().isoformat(),
        "credentials": config.credentials,  # À crypter en production!
        "settings": config.settings,
    }
    
    logger.info(f"✅ Integration connected: {provider}")
    
    return {
        "success": True,
        "provider": provider,
        "message": f"{provider.title()} connecté avec succès",
        "connected_at": _connections[provider]["connected_at"]
    }


@router.delete("/disconnect/{provider}")
async def disconnect_integration(provider: IntegrationProvider) -> Dict[str, Any]:
    """
    Déconnecte une intégration.
    """
    provider_name = provider.value
    
    if provider_name in _connections:
        del _connections[provider_name]
    
    if provider_name in _data_cache:
        del _data_cache[provider_name]
    
    logger.info(f"🔌 Integration disconnected: {provider_name}")
    
    return {
        "success": True,
        "provider": provider_name,
        "message": f"{provider_name.title()} déconnecté"
    }


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS - DONNÉES
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/data/{provider}")
async def get_integration_data(
    provider: IntegrationProvider,
    data_type: Optional[str] = Query(None, description="Type de données: orders, products, customers, etc."),
    limit: int = Query(50, le=200),
    use_cache: bool = Query(True)
) -> Dict[str, Any]:
    """
    Récupère les données d'une intégration.
    
    Args:
        provider: Le fournisseur (shopify, quickbooks, etc.)
        data_type: Type de données spécifique (optionnel)
        limit: Nombre max de résultats
        use_cache: Utiliser le cache
        
    Returns:
        Données de l'intégration
    """
    provider_name = provider.value
    
    # Vérifie le cache
    if use_cache and provider_name in _data_cache:
        data = _data_cache[provider_name]
    else:
        # Génère des données mock (en prod, appel API réel)
        if provider_name in MOCK_DATA_GENERATORS:
            data = MOCK_DATA_GENERATORS[provider_name]()
            _data_cache[provider_name] = data
        else:
            raise HTTPException(404, f"Provider {provider_name} non supporté")
    
    # Filtre par type si spécifié
    if data_type:
        if data_type in data:
            result_data = data[data_type]
            if isinstance(result_data, list):
                result_data = result_data[:limit]
            return {
                "provider": provider_name,
                "data_type": data_type,
                "data": result_data,
                "count": len(result_data) if isinstance(result_data, list) else 1,
                "fetched_at": datetime.utcnow().isoformat()
            }
        else:
            raise HTTPException(404, f"Type de données '{data_type}' non trouvé pour {provider_name}")
    
    return {
        "provider": provider_name,
        "data": data,
        "fetched_at": datetime.utcnow().isoformat()
    }


@router.get("/data/{provider}/stats")
async def get_integration_stats(provider: IntegrationProvider) -> Dict[str, Any]:
    """
    Récupère les statistiques d'une intégration.
    """
    provider_name = provider.value
    
    if provider_name in MOCK_DATA_GENERATORS:
        data = MOCK_DATA_GENERATORS[provider_name]()
        return {
            "provider": provider_name,
            "stats": data.get("stats", {}),
            "fetched_at": datetime.utcnow().isoformat()
        }
    
    raise HTTPException(404, f"Provider {provider_name} non supporté")


@router.post("/sync")
async def trigger_sync(
    request: SyncRequest,
    background_tasks: BackgroundTasks
) -> Dict[str, Any]:
    """
    Déclenche une synchronisation des données.
    """
    provider_name = request.provider.value
    
    # En production, on lancerait une tâche async
    # background_tasks.add_task(sync_provider_data, provider_name, request.data_types)
    
    # Pour la démo, on rafraîchit le cache
    if provider_name in MOCK_DATA_GENERATORS:
        _data_cache[provider_name] = MOCK_DATA_GENERATORS[provider_name]()
    
    logger.info(f"🔄 Sync triggered: {provider_name}")
    
    return {
        "success": True,
        "provider": provider_name,
        "message": f"Synchronisation {provider_name} démarrée",
        "data_types": request.data_types,
        "started_at": datetime.utcnow().isoformat()
    }


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS - DASHBOARD UNIFIÉ
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/dashboard")
async def get_unified_dashboard() -> Dict[str, Any]:
    """
    Récupère un dashboard unifié avec les données de toutes les intégrations.
    
    Parfait pour afficher une vue d'ensemble dans le frontend!
    """
    dashboard = {
        "fetched_at": datetime.utcnow().isoformat(),
        
        # E-Commerce (Shopify)
        "ecommerce": {
            "source": "shopify",
            "orders_today": 12,
            "revenue_today": 2345.67,
            "total_orders": 156,
            "total_revenue": 45678.90,
            "recent_orders": [
                {"id": "ORD-1001", "customer": "Jean T.", "total": 299.99, "status": "fulfilled"},
                {"id": "ORD-1002", "customer": "Marie G.", "total": 149.50, "status": "processing"},
                {"id": "ORD-1003", "customer": "Pierre R.", "total": 524.00, "status": "pending"},
            ],
            "low_stock_products": [
                {"name": "Ceinture à outils", "inventory": 5},
                {"name": "Casque Pro XL", "inventory": 8},
            ]
        },
        
        # Finances (QuickBooks)
        "finances": {
            "source": "quickbooks",
            "revenue_ytd": 890000.00,
            "expenses_ytd": 650000.00,
            "net_income": 240000.00,
            "accounts_receivable": 170500.00,
            "accounts_payable": 45600.00,
            "pending_invoices": [
                {"id": "INV-002", "customer": "Immo Plus", "amount": 28500.00, "due": "2024-12-20"},
                {"id": "INV-003", "customer": "Tech Corp", "amount": 12000.00, "due": "2024-11-15", "overdue": True},
            ],
            "cash_flow": {
                "current_month": 45000,
                "previous_month": 38000,
                "change_percent": 18.4
            }
        },
        
        # CRM (HubSpot)
        "crm": {
            "source": "hubspot",
            "total_contacts": 1250,
            "new_leads_month": 45,
            "deals_pipeline": 785000,
            "deals_won_month": 125000,
            "conversion_rate": 12.5,
            "hot_deals": [
                {"name": "Projet Tour Montréal", "value": 250000, "stage": "proposal", "probability": 60},
                {"name": "Rénovation Bureau", "value": 85000, "stage": "negotiation", "probability": 80},
            ],
            "recent_activities": [
                {"type": "email", "contact": "Marc L.", "date": "2024-12-01"},
                {"type": "call", "contact": "Julie B.", "date": "2024-12-01"},
                {"type": "meeting", "contact": "François C.", "date": "2024-11-30"},
            ]
        },
        
        # Paiements (Stripe)
        "payments": {
            "source": "stripe",
            "mrr": 12500,
            "arr": 150000,
            "active_subscriptions": 45,
            "churn_rate": 2.5,
            "recent_payments": [
                {"amount": 299.99, "customer": "Client A", "status": "succeeded"},
                {"amount": 149.50, "customer": "Client B", "status": "succeeded"},
            ]
        },
        
        # Alertes
        "alerts": [
            {"type": "warning", "message": "3 factures en retard", "source": "quickbooks"},
            {"type": "info", "message": "5 produits en stock faible", "source": "shopify"},
            {"type": "success", "message": "2 deals gagnés cette semaine", "source": "hubspot"},
            {"type": "error", "message": "Zendesk: reconnexion nécessaire", "source": "zendesk"},
        ]
    }
    
    return dashboard


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS - ACTIONS RAPIDES
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/actions/create-invoice")
async def create_invoice_action(
    customer: str,
    amount: float,
    description: str = "Facture CHE·NU"
) -> Dict[str, Any]:
    """Créer une facture via QuickBooks."""
    # En production: quickbooks_client.create_invoice(...)
    return {
        "success": True,
        "invoice_id": f"INV-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "customer": customer,
        "amount": amount,
        "message": "Facture créée avec succès"
    }


@router.post("/actions/send-notification")
async def send_notification_action(
    channel: str,
    message: str
) -> Dict[str, Any]:
    """Envoyer une notification via Slack."""
    # En production: slack_client.send_message(...)
    return {
        "success": True,
        "channel": channel,
        "message": "Notification envoyée"
    }


@router.post("/actions/create-deal")
async def create_deal_action(
    name: str,
    value: float,
    contact_id: str
) -> Dict[str, Any]:
    """Créer un deal via HubSpot."""
    # En production: hubspot_client.create_deal(...)
    return {
        "success": True,
        "deal_id": f"D-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "name": name,
        "value": value,
        "message": "Deal créé avec succès"
    }


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORT
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = ["router"]
