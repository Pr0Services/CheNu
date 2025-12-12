"""
CHE·NU Unified - OAuth Endpoints
═══════════════════════════════════════════════════════════════════════════════
Endpoints FastAPI pour le flux OAuth.

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from fastapi import APIRouter, HTTPException, Query, Request, Response
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging

logger = logging.getLogger("CHE·NU.OAuth.API")

router = APIRouter(prefix="/oauth", tags=["OAuth"])


# ═══════════════════════════════════════════════════════════════════════════════
# SCHEMAS
# ═══════════════════════════════════════════════════════════════════════════════

class OAuthInitRequest(BaseModel):
    """Requête pour initier OAuth."""
    provider: str
    user_id: str
    redirect_after: str = "/dashboard"
    extra_params: Optional[Dict[str, str]] = None


class OAuthStatusResponse(BaseModel):
    """Réponse de statut OAuth."""
    provider: str
    connected: bool
    account_name: Optional[str] = None
    account_id: Optional[str] = None
    connected_at: Optional[str] = None
    expires_at: Optional[str] = None


class ConnectedProvidersResponse(BaseModel):
    """Liste des providers connectés."""
    user_id: str
    providers: List[OAuthStatusResponse]
    total: int


# ═══════════════════════════════════════════════════════════════════════════════
# IN-MEMORY STORAGE (for demo - use DB in production)
# ═══════════════════════════════════════════════════════════════════════════════

# Simulated OAuth states and tokens
_oauth_states: Dict[str, Dict[str, Any]] = {}
_oauth_tokens: Dict[str, Dict[str, Any]] = {}

# Provider configs (in production, load from env/secrets)
PROVIDER_CONFIGS = {
    "shopify": {
        "name": "Shopify",
        "icon": "🛒",
        "scopes": ["read_products", "read_orders", "read_customers"],
        "authorize_url": "https://{shop}.myshopify.com/admin/oauth/authorize",
    },
    "quickbooks": {
        "name": "QuickBooks",
        "icon": "💰",
        "scopes": ["com.intuit.quickbooks.accounting"],
        "authorize_url": "https://appcenter.intuit.com/connect/oauth2",
    },
    "hubspot": {
        "name": "HubSpot",
        "icon": "🧡",
        "scopes": ["crm.objects.contacts.read", "crm.objects.deals.read"],
        "authorize_url": "https://app.hubspot.com/oauth/authorize",
    },
    "stripe": {
        "name": "Stripe",
        "icon": "💳",
        "scopes": ["read_write"],
        "authorize_url": "https://connect.stripe.com/oauth/authorize",
    },
    "slack": {
        "name": "Slack",
        "icon": "💬",
        "scopes": ["chat:write", "channels:read"],
        "authorize_url": "https://slack.com/oauth/v2/authorize",
    },
    "salesforce": {
        "name": "Salesforce",
        "icon": "☁️",
        "scopes": ["api", "refresh_token"],
        "authorize_url": "https://login.salesforce.com/services/oauth2/authorize",
    },
    "xero": {
        "name": "Xero",
        "icon": "📊",
        "scopes": ["accounting.transactions", "accounting.contacts"],
        "authorize_url": "https://login.xero.com/identity/connect/authorize",
    },
    "google": {
        "name": "Google",
        "icon": "🔵",
        "scopes": ["openid", "email", "profile"],
        "authorize_url": "https://accounts.google.com/o/oauth2/v2/auth",
    },
    "microsoft": {
        "name": "Microsoft",
        "icon": "🟦",
        "scopes": ["openid", "profile", "User.Read"],
        "authorize_url": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    },
    "asana": {
        "name": "Asana",
        "icon": "📋",
        "scopes": ["default"],
        "authorize_url": "https://app.asana.com/-/oauth_authorize",
    },
    "zendesk": {
        "name": "Zendesk",
        "icon": "🎫",
        "scopes": ["read", "write"],
        "authorize_url": "https://{subdomain}.zendesk.com/oauth/authorizations/new",
    },
    "mailchimp": {
        "name": "Mailchimp",
        "icon": "📧",
        "scopes": [],
        "authorize_url": "https://login.mailchimp.com/oauth2/authorize",
    },
}

# Pre-populate some "connected" providers for demo
_oauth_tokens = {
    "shopify:demo_user": {
        "provider": "shopify",
        "account_name": "CHE·NU Store",
        "account_id": "chenu-store",
        "connected_at": "2024-11-15T10:30:00Z",
        "expires_at": "2025-11-15T10:30:00Z",
    },
    "quickbooks:demo_user": {
        "provider": "quickbooks",
        "account_name": "CHE·NU Construction Inc",
        "account_id": "123456789",
        "connected_at": "2024-10-01T09:00:00Z",
        "expires_at": "2025-10-01T09:00:00Z",
    },
    "hubspot:demo_user": {
        "provider": "hubspot",
        "account_name": "CHE·NU CRM",
        "account_id": "hub_987654",
        "connected_at": "2024-09-15T11:00:00Z",
        "expires_at": "2025-09-15T11:00:00Z",
    },
    "stripe:demo_user": {
        "provider": "stripe",
        "account_name": "CHE·NU Payments",
        "account_id": "acct_chenu",
        "connected_at": "2024-08-01T08:00:00Z",
        "expires_at": None,
    },
    "slack:demo_user": {
        "provider": "slack",
        "account_name": "CHE·NU Workspace",
        "account_id": "T0CHE·NUWS",
        "connected_at": "2024-07-01T12:00:00Z",
        "expires_at": None,
    },
}


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/providers")
async def list_providers() -> Dict[str, Any]:
    """Liste tous les providers OAuth disponibles."""
    providers = []
    for key, config in PROVIDER_CONFIGS.items():
        providers.append({
            "id": key,
            "name": config["name"],
            "icon": config["icon"],
            "scopes": config["scopes"],
        })
    
    return {
        "providers": providers,
        "total": len(providers)
    }


@router.get("/status/{provider}")
async def get_provider_status(
    provider: str,
    user_id: str = Query("demo_user")
) -> OAuthStatusResponse:
    """Vérifie le statut de connexion d'un provider."""
    key = f"{provider}:{user_id}"
    token = _oauth_tokens.get(key)
    
    if token:
        return OAuthStatusResponse(
            provider=provider,
            connected=True,
            account_name=token.get("account_name"),
            account_id=token.get("account_id"),
            connected_at=token.get("connected_at"),
            expires_at=token.get("expires_at"),
        )
    
    return OAuthStatusResponse(
        provider=provider,
        connected=False
    )


@router.get("/connected")
async def get_connected_providers(
    user_id: str = Query("demo_user")
) -> ConnectedProvidersResponse:
    """Liste tous les providers connectés pour un utilisateur."""
    connected = []
    
    for key, token in _oauth_tokens.items():
        if key.endswith(f":{user_id}"):
            provider = key.split(":")[0]
            config = PROVIDER_CONFIGS.get(provider, {})
            connected.append(OAuthStatusResponse(
                provider=provider,
                connected=True,
                account_name=token.get("account_name"),
                account_id=token.get("account_id"),
                connected_at=token.get("connected_at"),
                expires_at=token.get("expires_at"),
            ))
    
    # Add disconnected providers
    for provider_id in PROVIDER_CONFIGS.keys():
        if not any(p.provider == provider_id for p in connected):
            connected.append(OAuthStatusResponse(
                provider=provider_id,
                connected=False
            ))
    
    return ConnectedProvidersResponse(
        user_id=user_id,
        providers=connected,
        total=len([p for p in connected if p.connected])
    )


@router.post("/initiate")
async def initiate_oauth(request: OAuthInitRequest) -> Dict[str, Any]:
    """
    Initie le flux OAuth pour un provider.
    
    Retourne l'URL d'autorisation vers laquelle rediriger l'utilisateur.
    """
    provider = request.provider
    
    if provider not in PROVIDER_CONFIGS:
        raise HTTPException(404, f"Provider {provider} not found")
    
    config = PROVIDER_CONFIGS[provider]
    
    # Generate state token
    import secrets
    state = secrets.token_urlsafe(32)
    
    # Store state
    _oauth_states[state] = {
        "provider": provider,
        "user_id": request.user_id,
        "redirect_after": request.redirect_after,
        "extra_params": request.extra_params,
    }
    
    # Build authorization URL (simplified for demo)
    # In production, use the full OAuth manager
    base_url = config["authorize_url"]
    
    # Handle dynamic URLs
    if request.extra_params:
        for key, value in request.extra_params.items():
            base_url = base_url.replace(f"{{{key}}}", value)
    
    params = {
        "client_id": f"chenu_{provider}_client",  # Demo client ID
        "redirect_uri": f"http://localhost:8000/oauth/callback/{provider}",
        "response_type": "code",
        "state": state,
        "scope": " ".join(config["scopes"]),
    }
    
    from urllib.parse import urlencode
    auth_url = f"{base_url}?{urlencode(params)}"
    
    logger.info(f"🔐 OAuth initiated: {provider} for user {request.user_id}")
    
    return {
        "authorization_url": auth_url,
        "state": state,
        "provider": provider,
        "message": f"Redirect user to authorization_url to connect {config['name']}"
    }


@router.get("/callback/{provider}")
async def oauth_callback(
    provider: str,
    code: str = Query(...),
    state: str = Query(...),
    error: Optional[str] = Query(None),
    error_description: Optional[str] = Query(None)
) -> RedirectResponse:
    """
    Callback OAuth - traite la réponse du provider.
    """
    # Check for errors
    if error:
        logger.error(f"OAuth error: {error} - {error_description}")
        return RedirectResponse(
            url=f"/oauth/error?error={error}&description={error_description}"
        )
    
    # Validate state
    if state not in _oauth_states:
        raise HTTPException(400, "Invalid or expired state token")
    
    oauth_state = _oauth_states.pop(state)
    
    if oauth_state["provider"] != provider:
        raise HTTPException(400, "Provider mismatch")
    
    # In production, exchange code for token here
    # For demo, simulate successful connection
    user_id = oauth_state["user_id"]
    key = f"{provider}:{user_id}"
    
    from datetime import datetime, timedelta
    
    _oauth_tokens[key] = {
        "provider": provider,
        "account_name": f"CHE·NU {PROVIDER_CONFIGS[provider]['name']}",
        "account_id": f"{provider}_account_{user_id}",
        "connected_at": datetime.utcnow().isoformat() + "Z",
        "expires_at": (datetime.utcnow() + timedelta(days=365)).isoformat() + "Z",
    }
    
    logger.info(f"✅ OAuth callback success: {provider} for user {user_id}")
    
    # Redirect to success page or dashboard
    redirect_url = oauth_state.get("redirect_after", "/dashboard")
    return RedirectResponse(url=f"{redirect_url}?connected={provider}")


@router.delete("/disconnect/{provider}")
async def disconnect_provider(
    provider: str,
    user_id: str = Query("demo_user")
) -> Dict[str, Any]:
    """Déconnecte un provider OAuth."""
    key = f"{provider}:{user_id}"
    
    if key in _oauth_tokens:
        del _oauth_tokens[key]
        logger.info(f"🔌 Disconnected: {provider} for user {user_id}")
        return {
            "success": True,
            "provider": provider,
            "message": f"{PROVIDER_CONFIGS.get(provider, {}).get('name', provider)} disconnected"
        }
    
    raise HTTPException(404, f"Provider {provider} not connected")


@router.post("/refresh/{provider}")
async def refresh_token(
    provider: str,
    user_id: str = Query("demo_user")
) -> Dict[str, Any]:
    """Rafraîchit le token d'un provider."""
    key = f"{provider}:{user_id}"
    
    if key not in _oauth_tokens:
        raise HTTPException(404, f"Provider {provider} not connected")
    
    # In production, actually refresh the token
    # For demo, just update the expiry
    from datetime import datetime, timedelta
    
    _oauth_tokens[key]["expires_at"] = (datetime.utcnow() + timedelta(days=365)).isoformat() + "Z"
    
    logger.info(f"🔄 Token refreshed: {provider} for user {user_id}")
    
    return {
        "success": True,
        "provider": provider,
        "message": "Token refreshed successfully",
        "expires_at": _oauth_tokens[key]["expires_at"]
    }


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORT
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = ["router"]
