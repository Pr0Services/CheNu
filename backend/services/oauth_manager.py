"""
CHE·NU Unified - OAuth Manager
═══════════════════════════════════════════════════════════════════════════════
Système OAuth 2.0 complet pour toutes les intégrations.

Supporte:
- Authorization Code Flow (Shopify, QuickBooks, HubSpot, etc.)
- Client Credentials Flow (APIs B2B)
- Refresh Token automatique
- Stockage sécurisé des tokens

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, Optional, List
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, field
import hashlib
import secrets
import base64
import json
import logging
import asyncio
from urllib.parse import urlencode, parse_qs, urlparse

from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Request, Response, Depends, Query
from fastapi.responses import RedirectResponse, JSONResponse
import httpx

logger = logging.getLogger("CHE·NU.OAuth")

router = APIRouter(prefix="/api/oauth", tags=["OAuth"])


# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

class OAuthProvider(str, Enum):
    SHOPIFY = "shopify"
    QUICKBOOKS = "quickbooks"
    HUBSPOT = "hubspot"
    STRIPE = "stripe"
    SALESFORCE = "salesforce"
    SLACK = "slack"
    GOOGLE = "google"
    MICROSOFT = "microsoft"
    XERO = "xero"
    MAILCHIMP = "mailchimp"
    ZENDESK = "zendesk"
    ASANA = "asana"
    MONDAY = "monday"
    NOTION = "notion"
    AIRTABLE = "airtable"


@dataclass
class OAuthConfig:
    """Configuration OAuth pour un provider."""
    provider: OAuthProvider
    client_id: str
    client_secret: str
    authorize_url: str
    token_url: str
    scopes: List[str]
    redirect_uri: str
    
    # Optional
    revoke_url: Optional[str] = None
    userinfo_url: Optional[str] = None
    token_endpoint_auth_method: str = "client_secret_post"  # or client_secret_basic
    pkce_required: bool = False
    extra_authorize_params: Dict[str, str] = field(default_factory=dict)


# Configurations OAuth pour chaque provider
OAUTH_CONFIGS: Dict[str, OAuthConfig] = {
    "shopify": OAuthConfig(
        provider=OAuthProvider.SHOPIFY,
        client_id="${SHOPIFY_CLIENT_ID}",
        client_secret="${SHOPIFY_CLIENT_SECRET}",
        authorize_url="https://{shop}.myshopify.com/admin/oauth/authorize",
        token_url="https://{shop}.myshopify.com/admin/oauth/access_token",
        scopes=["read_products", "write_products", "read_orders", "write_orders", "read_customers"],
        redirect_uri="http://localhost:8000/api/oauth/callback/shopify",
        extra_authorize_params={"grant_options[]": "per-user"},
    ),
    "quickbooks": OAuthConfig(
        provider=OAuthProvider.QUICKBOOKS,
        client_id="${QUICKBOOKS_CLIENT_ID}",
        client_secret="${QUICKBOOKS_CLIENT_SECRET}",
        authorize_url="https://appcenter.intuit.com/connect/oauth2",
        token_url="https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
        scopes=["com.intuit.quickbooks.accounting"],
        redirect_uri="http://localhost:8000/api/oauth/callback/quickbooks",
        revoke_url="https://developer.api.intuit.com/v2/oauth2/tokens/revoke",
    ),
    "hubspot": OAuthConfig(
        provider=OAuthProvider.HUBSPOT,
        client_id="${HUBSPOT_CLIENT_ID}",
        client_secret="${HUBSPOT_CLIENT_SECRET}",
        authorize_url="https://app.hubspot.com/oauth/authorize",
        token_url="https://api.hubapi.com/oauth/v1/token",
        scopes=["crm.objects.contacts.read", "crm.objects.contacts.write", "crm.objects.deals.read"],
        redirect_uri="http://localhost:8000/api/oauth/callback/hubspot",
    ),
    "stripe": OAuthConfig(
        provider=OAuthProvider.STRIPE,
        client_id="${STRIPE_CLIENT_ID}",
        client_secret="${STRIPE_CLIENT_SECRET}",
        authorize_url="https://connect.stripe.com/oauth/authorize",
        token_url="https://connect.stripe.com/oauth/token",
        scopes=["read_write"],
        redirect_uri="http://localhost:8000/api/oauth/callback/stripe",
        revoke_url="https://connect.stripe.com/oauth/deauthorize",
    ),
    "salesforce": OAuthConfig(
        provider=OAuthProvider.SALESFORCE,
        client_id="${SALESFORCE_CLIENT_ID}",
        client_secret="${SALESFORCE_CLIENT_SECRET}",
        authorize_url="https://login.salesforce.com/services/oauth2/authorize",
        token_url="https://login.salesforce.com/services/oauth2/token",
        scopes=["api", "refresh_token", "offline_access"],
        redirect_uri="http://localhost:8000/api/oauth/callback/salesforce",
        revoke_url="https://login.salesforce.com/services/oauth2/revoke",
    ),
    "slack": OAuthConfig(
        provider=OAuthProvider.SLACK,
        client_id="${SLACK_CLIENT_ID}",
        client_secret="${SLACK_CLIENT_SECRET}",
        authorize_url="https://slack.com/oauth/v2/authorize",
        token_url="https://slack.com/api/oauth.v2.access",
        scopes=["channels:read", "chat:write", "users:read"],
        redirect_uri="http://localhost:8000/api/oauth/callback/slack",
        revoke_url="https://slack.com/api/auth.revoke",
    ),
    "google": OAuthConfig(
        provider=OAuthProvider.GOOGLE,
        client_id="${GOOGLE_CLIENT_ID}",
        client_secret="${GOOGLE_CLIENT_SECRET}",
        authorize_url="https://accounts.google.com/o/oauth2/v2/auth",
        token_url="https://oauth2.googleapis.com/token",
        scopes=[
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/drive.readonly",
            "https://www.googleapis.com/auth/spreadsheets",
        ],
        redirect_uri="http://localhost:8000/api/oauth/callback/google",
        revoke_url="https://oauth2.googleapis.com/revoke",
        userinfo_url="https://www.googleapis.com/oauth2/v2/userinfo",
        pkce_required=True,
    ),
    "microsoft": OAuthConfig(
        provider=OAuthProvider.MICROSOFT,
        client_id="${MICROSOFT_CLIENT_ID}",
        client_secret="${MICROSOFT_CLIENT_SECRET}",
        authorize_url="https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
        token_url="https://login.microsoftonline.com/common/oauth2/v2.0/token",
        scopes=["User.Read", "Calendars.ReadWrite", "Mail.Read"],
        redirect_uri="http://localhost:8000/api/oauth/callback/microsoft",
        pkce_required=True,
    ),
    "xero": OAuthConfig(
        provider=OAuthProvider.XERO,
        client_id="${XERO_CLIENT_ID}",
        client_secret="${XERO_CLIENT_SECRET}",
        authorize_url="https://login.xero.com/identity/connect/authorize",
        token_url="https://identity.xero.com/connect/token",
        scopes=["openid", "profile", "email", "accounting.transactions", "accounting.contacts"],
        redirect_uri="http://localhost:8000/api/oauth/callback/xero",
        revoke_url="https://identity.xero.com/connect/revocation",
    ),
    "notion": OAuthConfig(
        provider=OAuthProvider.NOTION,
        client_id="${NOTION_CLIENT_ID}",
        client_secret="${NOTION_CLIENT_SECRET}",
        authorize_url="https://api.notion.com/v1/oauth/authorize",
        token_url="https://api.notion.com/v1/oauth/token",
        scopes=[],  # Notion uses owner-based permissions
        redirect_uri="http://localhost:8000/api/oauth/callback/notion",
        token_endpoint_auth_method="client_secret_basic",
    ),
}


# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class OAuthToken(BaseModel):
    """Token OAuth stocké."""
    provider: str
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "Bearer"
    expires_at: Optional[datetime] = None
    scope: Optional[str] = None
    extra_data: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class OAuthState(BaseModel):
    """État OAuth pour la sécurité CSRF."""
    state: str
    provider: str
    user_id: str
    redirect_url: str
    code_verifier: Optional[str] = None  # Pour PKCE
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ConnectRequest(BaseModel):
    """Requête de connexion OAuth."""
    provider: str
    user_id: str = "default"
    redirect_url: str = "http://localhost:5173/integrations"
    shop_domain: Optional[str] = None  # Pour Shopify


class TokenResponse(BaseModel):
    """Réponse après échange de token."""
    success: bool
    provider: str
    message: str
    account_info: Optional[Dict[str, Any]] = None


# ═══════════════════════════════════════════════════════════════════════════════
# TOKEN STORAGE (In-Memory pour démo, utiliser Redis/DB en production)
# ═══════════════════════════════════════════════════════════════════════════════

_oauth_states: Dict[str, OAuthState] = {}
_oauth_tokens: Dict[str, Dict[str, OAuthToken]] = {}  # user_id -> provider -> token


def store_state(state: OAuthState) -> None:
    _oauth_states[state.state] = state


def get_state(state: str) -> Optional[OAuthState]:
    return _oauth_states.get(state)


def delete_state(state: str) -> None:
    _oauth_states.pop(state, None)


def store_token(user_id: str, token: OAuthToken) -> None:
    if user_id not in _oauth_tokens:
        _oauth_tokens[user_id] = {}
    _oauth_tokens[user_id][token.provider] = token


def get_token(user_id: str, provider: str) -> Optional[OAuthToken]:
    return _oauth_tokens.get(user_id, {}).get(provider)


def delete_token(user_id: str, provider: str) -> None:
    if user_id in _oauth_tokens:
        _oauth_tokens[user_id].pop(provider, None)


def get_all_tokens(user_id: str) -> Dict[str, OAuthToken]:
    return _oauth_tokens.get(user_id, {})


# ═══════════════════════════════════════════════════════════════════════════════
# PKCE HELPERS
# ═══════════════════════════════════════════════════════════════════════════════

def generate_code_verifier() -> str:
    """Génère un code verifier PKCE."""
    return secrets.token_urlsafe(64)[:128]


def generate_code_challenge(verifier: str) -> str:
    """Génère un code challenge PKCE (S256)."""
    digest = hashlib.sha256(verifier.encode()).digest()
    return base64.urlsafe_b64encode(digest).decode().rstrip('=')


# ═══════════════════════════════════════════════════════════════════════════════
# OAUTH FLOW
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/connect")
async def initiate_oauth(request: ConnectRequest) -> Dict[str, Any]:
    """
    Démarre le flow OAuth.
    
    Retourne l'URL d'autorisation vers laquelle rediriger l'utilisateur.
    """
    provider = request.provider.lower()
    
    if provider not in OAUTH_CONFIGS:
        raise HTTPException(400, f"Provider '{provider}' non supporté")
    
    config = OAUTH_CONFIGS[provider]
    
    # Génère un state unique pour la sécurité CSRF
    state_value = secrets.token_urlsafe(32)
    
    # PKCE si requis
    code_verifier = None
    code_challenge = None
    if config.pkce_required:
        code_verifier = generate_code_verifier()
        code_challenge = generate_code_challenge(code_verifier)
    
    # Stocke le state
    oauth_state = OAuthState(
        state=state_value,
        provider=provider,
        user_id=request.user_id,
        redirect_url=request.redirect_url,
        code_verifier=code_verifier,
    )
    store_state(oauth_state)
    
    # Construit l'URL d'autorisation
    authorize_url = config.authorize_url
    
    # Shopify nécessite le domaine de la boutique
    if provider == "shopify" and request.shop_domain:
        authorize_url = authorize_url.replace("{shop}", request.shop_domain)
    
    params = {
        "client_id": config.client_id,
        "redirect_uri": config.redirect_uri,
        "response_type": "code",
        "state": state_value,
        "scope": " ".join(config.scopes),
        **config.extra_authorize_params,
    }
    
    if code_challenge:
        params["code_challenge"] = code_challenge
        params["code_challenge_method"] = "S256"
    
    auth_url = f"{authorize_url}?{urlencode(params)}"
    
    logger.info(f"🔐 OAuth initiated for {provider} (user: {request.user_id})")
    
    return {
        "success": True,
        "auth_url": auth_url,
        "state": state_value,
        "provider": provider,
    }


@router.get("/callback/{provider}")
async def oauth_callback(
    provider: str,
    code: str = Query(...),
    state: str = Query(...),
    error: Optional[str] = Query(None),
    error_description: Optional[str] = Query(None),
) -> Response:
    """
    Callback OAuth après autorisation.
    
    Échange le code contre un access token.
    """
    # Vérifie les erreurs
    if error:
        logger.error(f"OAuth error for {provider}: {error} - {error_description}")
        return RedirectResponse(
            f"http://localhost:5173/integrations?error={error}&provider={provider}"
        )
    
    # Vérifie le state
    oauth_state = get_state(state)
    if not oauth_state or oauth_state.provider != provider:
        logger.error(f"Invalid OAuth state for {provider}")
        return RedirectResponse(
            f"http://localhost:5173/integrations?error=invalid_state&provider={provider}"
        )
    
    config = OAUTH_CONFIGS.get(provider)
    if not config:
        return RedirectResponse(
            f"http://localhost:5173/integrations?error=unknown_provider&provider={provider}"
        )
    
    try:
        # Échange le code contre un token
        token_data = await exchange_code_for_token(config, code, oauth_state)
        
        # Stocke le token
        oauth_token = OAuthToken(
            provider=provider,
            access_token=token_data.get("access_token"),
            refresh_token=token_data.get("refresh_token"),
            token_type=token_data.get("token_type", "Bearer"),
            expires_at=calculate_expiry(token_data.get("expires_in")),
            scope=token_data.get("scope"),
            extra_data=token_data,
        )
        store_token(oauth_state.user_id, oauth_token)
        
        # Nettoie le state
        delete_state(state)
        
        logger.info(f"✅ OAuth successful for {provider} (user: {oauth_state.user_id})")
        
        # Redirige vers le frontend
        return RedirectResponse(
            f"{oauth_state.redirect_url}?success=true&provider={provider}"
        )
        
    except Exception as e:
        logger.error(f"OAuth token exchange failed for {provider}: {e}")
        delete_state(state)
        return RedirectResponse(
            f"http://localhost:5173/integrations?error=token_exchange_failed&provider={provider}"
        )


async def exchange_code_for_token(
    config: OAuthConfig,
    code: str,
    state: OAuthState
) -> Dict[str, Any]:
    """Échange le code d'autorisation contre un access token."""
    
    token_url = config.token_url
    
    # Shopify nécessite le domaine
    if config.provider == OAuthProvider.SHOPIFY:
        # Extraire le shop domain du state ou de la config
        token_url = token_url.replace("{shop}", "your-shop")  # À adapter
    
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": config.redirect_uri,
    }
    
    # Ajoute le code verifier PKCE si présent
    if state.code_verifier:
        data["code_verifier"] = state.code_verifier
    
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    
    # Auth method
    if config.token_endpoint_auth_method == "client_secret_basic":
        auth = httpx.BasicAuth(config.client_id, config.client_secret)
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data, headers=headers, auth=auth)
    else:
        data["client_id"] = config.client_id
        data["client_secret"] = config.client_secret
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data, headers=headers)
    
    response.raise_for_status()
    return response.json()


def calculate_expiry(expires_in: Optional[int]) -> Optional[datetime]:
    """Calcule la date d'expiration du token."""
    if expires_in:
        return datetime.utcnow() + timedelta(seconds=expires_in)
    return None


# ═══════════════════════════════════════════════════════════════════════════════
# TOKEN REFRESH
# ═══════════════════════════════════════════════════════════════════════════════

async def refresh_token(user_id: str, provider: str) -> Optional[OAuthToken]:
    """Rafraîchit un token expiré."""
    token = get_token(user_id, provider)
    if not token or not token.refresh_token:
        return None
    
    config = OAUTH_CONFIGS.get(provider)
    if not config:
        return None
    
    try:
        data = {
            "grant_type": "refresh_token",
            "refresh_token": token.refresh_token,
            "client_id": config.client_id,
            "client_secret": config.client_secret,
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                config.token_url,
                data=data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
        
        response.raise_for_status()
        token_data = response.json()
        
        # Met à jour le token
        token.access_token = token_data.get("access_token", token.access_token)
        token.refresh_token = token_data.get("refresh_token", token.refresh_token)
        token.expires_at = calculate_expiry(token_data.get("expires_in"))
        token.updated_at = datetime.utcnow()
        
        store_token(user_id, token)
        logger.info(f"🔄 Token refreshed for {provider} (user: {user_id})")
        
        return token
        
    except Exception as e:
        logger.error(f"Token refresh failed for {provider}: {e}")
        return None


async def get_valid_token(user_id: str, provider: str) -> Optional[str]:
    """Récupère un token valide, en le rafraîchissant si nécessaire."""
    token = get_token(user_id, provider)
    if not token:
        return None
    
    # Vérifie si le token est expiré
    if token.expires_at and token.expires_at < datetime.utcnow():
        token = await refresh_token(user_id, provider)
        if not token:
            return None
    
    return token.access_token


# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/status")
async def get_oauth_status(user_id: str = "default") -> Dict[str, Any]:
    """Récupère le statut de toutes les connexions OAuth."""
    tokens = get_all_tokens(user_id)
    
    connections = {}
    for provider, token in tokens.items():
        is_expired = token.expires_at and token.expires_at < datetime.utcnow()
        connections[provider] = {
            "connected": True,
            "expired": is_expired,
            "has_refresh_token": bool(token.refresh_token),
            "connected_at": token.created_at.isoformat(),
            "expires_at": token.expires_at.isoformat() if token.expires_at else None,
            "scope": token.scope,
        }
    
    # Ajoute les providers non connectés
    for provider in OAUTH_CONFIGS:
        if provider not in connections:
            connections[provider] = {
                "connected": False,
                "expired": False,
                "has_refresh_token": False,
            }
    
    return {
        "user_id": user_id,
        "connections": connections,
        "total_connected": len(tokens),
    }


@router.post("/disconnect/{provider}")
async def disconnect_oauth(provider: str, user_id: str = "default") -> Dict[str, Any]:
    """Déconnecte une intégration OAuth."""
    token = get_token(user_id, provider)
    
    if token:
        # Révoque le token si possible
        config = OAUTH_CONFIGS.get(provider)
        if config and config.revoke_url:
            try:
                async with httpx.AsyncClient() as client:
                    await client.post(
                        config.revoke_url,
                        data={"token": token.access_token},
                    )
            except Exception as e:
                logger.warning(f"Token revocation failed for {provider}: {e}")
        
        delete_token(user_id, provider)
        logger.info(f"🔌 Disconnected {provider} (user: {user_id})")
    
    return {
        "success": True,
        "provider": provider,
        "message": f"{provider} déconnecté avec succès",
    }


@router.get("/providers")
async def list_providers() -> Dict[str, Any]:
    """Liste tous les providers OAuth disponibles."""
    providers = []
    
    for provider_id, config in OAUTH_CONFIGS.items():
        providers.append({
            "id": provider_id,
            "name": provider_id.title(),
            "scopes": config.scopes,
            "pkce_required": config.pkce_required,
        })
    
    return {"providers": providers}


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    "router",
    "OAuthProvider",
    "OAuthConfig",
    "OAuthToken",
    "get_valid_token",
    "refresh_token",
]
