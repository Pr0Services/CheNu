"""
CHE·NU v6.0 - Extended API
═══════════════════════════════════════════════════════════════════════════════
API FastAPI pour les nouvelles fonctionnalités:
- Gestion des entreprises et comptes connectés
- OAuth et intégrations
- Workspaces virtuels
- Agent de base de données

Author: CHE·NU Team
Version: 6.0
═══════════════════════════════════════════════════════════════════════════════
"""

from fastapi import FastAPI, HTTPException, Depends, Query, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
from datetime import datetime
from enum import Enum
import logging
import os

# Services imports
from .services.oauth.oauth_manager import (
    OAuthManager, OAuthProvider, OAuthCredentials,
    create_oauth_manager, PROVIDER_CONFIGS
)
from .services.integrations.integration_service import (
    IntegrationManager, SyncDirection, DataType,
    create_integration_manager
)
from .services.workspace.workspace_service import (
    VirtualWorkspaceService, WorkspaceType, FocusMode, PanelType,
    create_workspace_service
)
from .agents.database.database_agent import (
    DatabaseAgent, EntityType, QueryFilter, QueryOptions, SortOrder,
    create_database_agent
)

logger = logging.getLogger("CHE·NU.API.v6")

# ═══════════════════════════════════════════════════════════════════════════════
# PYDANTIC MODELS
# ═══════════════════════════════════════════════════════════════════════════════

# --- Companies ---
class CompanyCreate(BaseModel):
    company_name: str
    legal_name: Optional[str] = None
    industry: Optional[str] = None
    company_type: Optional[str] = "contractor"
    email: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = "Québec"

class CompanyUpdate(BaseModel):
    company_name: Optional[str] = None
    legal_name: Optional[str] = None
    industry: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class CompanyMemberAdd(BaseModel):
    user_id: str
    role: str = "member"
    job_title: Optional[str] = None
    department: Optional[str] = None

# --- Connected Accounts ---
class ConnectAccountRequest(BaseModel):
    provider: str
    scopes: Optional[List[str]] = None
    redirect_url: Optional[str] = None
    extra_params: Optional[Dict[str, str]] = None

class SyncAccountRequest(BaseModel):
    data_types: Optional[List[str]] = None
    full_sync: bool = False

# --- Workspaces ---
class WorkspaceCreate(BaseModel):
    workspace_name: str
    workspace_type: str = "personal"
    company_id: Optional[str] = None
    template: Optional[str] = None

class WorkspaceUpdate(BaseModel):
    workspace_name: Optional[str] = None
    theme: Optional[Dict[str, Any]] = None
    layout: Optional[Dict[str, Any]] = None
    ai_settings: Optional[Dict[str, Any]] = None

class FocusModeRequest(BaseModel):
    mode: str = "deep"
    duration_minutes: Optional[int] = None

class PanelAddRequest(BaseModel):
    panel_type: str
    position: str
    settings: Optional[Dict[str, Any]] = None

# --- Data Items ---
class DataItemCreate(BaseModel):
    item_type: str
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[str] = None
    tags: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None

class DataItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[str] = None
    tags: Optional[List[str]] = None
    is_starred: Optional[bool] = None
    is_pinned: Optional[bool] = None

class DataSearchRequest(BaseModel):
    query: str
    item_types: Optional[List[str]] = None
    category_id: Optional[str] = None
    tags: Optional[List[str]] = None
    limit: int = 50

# --- Categories ---
class CategoryCreate(BaseModel):
    category_name: str
    category_slug: str
    parent_category_id: Optional[str] = None
    description: Optional[str] = None
    icon: str = "📁"
    color: str = "#6366f1"


# ═══════════════════════════════════════════════════════════════════════════════
# APP INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="CHE·NU v6.0 - Extended API",
    description="""
    🏗️ CHE·NU Construction Platform - Extended Features
    
    ## Nouvelles fonctionnalités v6.0:
    
    - 🏢 **Entreprises** - Gestion multi-tenant
    - 🔗 **Comptes Connectés** - OAuth pour 30+ providers
    - 🖥️ **Workspaces Virtuels** - Environnement de travail concentré
    - 🗄️ **Data Management** - Organisation centralisée des données
    - 🔄 **Synchronisation** - Sync bidirectionnelle avec sources externes
    """,
    version="6.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═══════════════════════════════════════════════════════════════════════════════
# DEPENDENCY INJECTION
# ═══════════════════════════════════════════════════════════════════════════════

# Global instances (initialized on startup)
db_agent: DatabaseAgent = None
oauth_manager: OAuthManager = None
integration_manager: IntegrationManager = None
workspace_service: VirtualWorkspaceService = None


@app.on_event("startup")
async def startup():
    """Initialize services on startup."""
    global db_agent, oauth_manager, integration_manager, workspace_service
    
    # Database Agent
    db_agent = create_database_agent(
        database_url=os.getenv("DATABASE_URL", "postgresql+asyncpg://localhost/chenu")
    )
    
    # OAuth Manager
    oauth_credentials = {}
    
    # Google
    if os.getenv("GOOGLE_CLIENT_ID"):
        for provider in [OAuthProvider.GOOGLE, OAuthProvider.GOOGLE_DRIVE, 
                        OAuthProvider.YOUTUBE, OAuthProvider.GOOGLE_CALENDAR]:
            oauth_credentials[provider] = OAuthCredentials(
                client_id=os.getenv("GOOGLE_CLIENT_ID"),
                client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
                redirect_uri=os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/oauth/callback/google")
            )
    
    # Facebook
    if os.getenv("FACEBOOK_CLIENT_ID"):
        for provider in [OAuthProvider.FACEBOOK, OAuthProvider.INSTAGRAM]:
            oauth_credentials[provider] = OAuthCredentials(
                client_id=os.getenv("FACEBOOK_CLIENT_ID"),
                client_secret=os.getenv("FACEBOOK_CLIENT_SECRET"),
                redirect_uri=os.getenv("FACEBOOK_REDIRECT_URI", "http://localhost:8000/oauth/callback/facebook")
            )
    
    # Shopify
    if os.getenv("SHOPIFY_CLIENT_ID"):
        oauth_credentials[OAuthProvider.SHOPIFY] = OAuthCredentials(
            client_id=os.getenv("SHOPIFY_CLIENT_ID"),
            client_secret=os.getenv("SHOPIFY_CLIENT_SECRET"),
            redirect_uri=os.getenv("SHOPIFY_REDIRECT_URI", "http://localhost:8000/oauth/callback/shopify")
        )
    
    oauth_manager = OAuthManager(oauth_credentials) if oauth_credentials else None
    
    # Integration Manager
    if oauth_manager:
        integration_manager = create_integration_manager(oauth_manager, db_agent)
    
    # Workspace Service
    workspace_service = create_workspace_service(db_agent, integration_manager)
    
    logger.info("🚀 CHE·NU v6.0 API started")


def get_db() -> DatabaseAgent:
    if not db_agent:
        raise HTTPException(500, "Database not initialized")
    return db_agent


def get_oauth() -> OAuthManager:
    if not oauth_manager:
        raise HTTPException(500, "OAuth not configured")
    return oauth_manager


def get_integrations() -> IntegrationManager:
    if not integration_manager:
        raise HTTPException(500, "Integrations not configured")
    return integration_manager


def get_workspace_svc() -> VirtualWorkspaceService:
    if not workspace_service:
        raise HTTPException(500, "Workspace service not initialized")
    return workspace_service


# ═══════════════════════════════════════════════════════════════════════════════
# HEALTH & INFO
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/", tags=["Info"])
async def root():
    return {
        "name": "CHE·NU v6.0",
        "status": "running",
        "features": [
            "companies",
            "connected_accounts", 
            "workspaces",
            "data_management",
            "integrations"
        ]
    }


@app.get("/health", tags=["Info"])
async def health(db: DatabaseAgent = Depends(get_db)):
    db_health = await db.health_check()
    return {
        "status": "healthy" if db_health["status"] == "healthy" else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "6.0.0",
        "services": {
            "database": db_health["status"],
            "oauth": "configured" if oauth_manager else "not_configured",
            "integrations": "ready" if integration_manager else "not_ready",
            "workspaces": "ready" if workspace_service else "not_ready"
        }
    }


@app.get("/stats", tags=["Info"])
async def stats(db: DatabaseAgent = Depends(get_db)):
    return await db.get_statistics()


# ═══════════════════════════════════════════════════════════════════════════════
# COMPANIES
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/companies", tags=["Companies"])
async def create_company(
    data: CompanyCreate,
    user_id: str = Query(..., description="User creating the company"),
    db: DatabaseAgent = Depends(get_db)
):
    """🏢 Créer une nouvelle entreprise."""
    result = await db.create(
        EntityType.COMPANY,
        data.model_dump(),
        user_id=user_id
    )
    
    if not result.success:
        raise HTTPException(400, result.error)
    
    # Add creator as owner
    await db.create(
        EntityType.USER,  # company_members table
        {
            "company_id": result.entity_id,
            "user_id": user_id,
            "role": "owner",
            "is_active": True,
            "accepted_at": datetime.utcnow()
        }
    )
    
    return {"company_id": result.entity_id, "data": result.data}


@app.get("/companies", tags=["Companies"])
async def list_companies(
    user_id: str = Query(...),
    db: DatabaseAgent = Depends(get_db)
):
    """🏢 Liste les entreprises de l'utilisateur."""
    companies = await db.get_user_companies(user_id)
    return {"companies": companies}


@app.get("/companies/{company_id}", tags=["Companies"])
async def get_company(
    company_id: str,
    db: DatabaseAgent = Depends(get_db)
):
    """🏢 Détails d'une entreprise."""
    result = await db.read(
        EntityType.COMPANY,
        company_id,
        include_relations=["members", "accounts", "projects"]
    )
    
    if not result.success:
        raise HTTPException(404, "Company not found")
    
    return result.data


@app.put("/companies/{company_id}", tags=["Companies"])
async def update_company(
    company_id: str,
    data: CompanyUpdate,
    db: DatabaseAgent = Depends(get_db)
):
    """🏢 Mettre à jour une entreprise."""
    result = await db.update(
        EntityType.COMPANY,
        company_id,
        {k: v for k, v in data.model_dump().items() if v is not None}
    )
    
    if not result.success:
        raise HTTPException(400, result.error)
    
    return result.data


@app.post("/companies/{company_id}/members", tags=["Companies"])
async def add_company_member(
    company_id: str,
    member: CompanyMemberAdd,
    db: DatabaseAgent = Depends(get_db)
):
    """👥 Ajouter un membre à l'entreprise."""
    result = await db.create(
        EntityType.USER,
        {
            "company_id": company_id,
            "user_id": member.user_id,
            "role": member.role,
            "job_title": member.job_title,
            "department": member.department,
            "invited_at": datetime.utcnow()
        }
    )
    
    if not result.success:
        raise HTTPException(400, result.error)
    
    return {"member_id": result.entity_id}


# ═══════════════════════════════════════════════════════════════════════════════
# CONNECTED ACCOUNTS (OAuth)
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/oauth/providers", tags=["OAuth"])
async def list_oauth_providers(oauth: OAuthManager = Depends(get_oauth)):
    """🔗 Liste les providers OAuth disponibles."""
    return {"providers": oauth.get_supported_providers()}


@app.post("/oauth/connect", tags=["OAuth"])
async def initiate_oauth(
    request: ConnectAccountRequest,
    user_id: str = Query(...),
    company_id: Optional[str] = Query(None),
    oauth: OAuthManager = Depends(get_oauth)
):
    """🔗 Initie une connexion OAuth."""
    try:
        provider = OAuthProvider(request.provider)
    except ValueError:
        raise HTTPException(400, f"Unknown provider: {request.provider}")
    
    auth_url = await oauth.get_authorization_url(
        provider=provider,
        user_id=user_id,
        company_id=company_id,
        scopes=request.scopes,
        redirect_url=request.redirect_url,
        extra_params=request.extra_params
    )
    
    return {"authorization_url": auth_url}


@app.get("/oauth/callback/{provider}", tags=["OAuth"])
async def oauth_callback(
    provider: str,
    code: str = Query(...),
    state: str = Query(...),
    error: Optional[str] = Query(None),
    oauth: OAuthManager = Depends(get_oauth),
    db: DatabaseAgent = Depends(get_db)
):
    """🔗 Callback OAuth après autorisation."""
    if error:
        raise HTTPException(400, f"OAuth error: {error}")
    
    try:
        provider_enum = OAuthProvider(provider)
    except ValueError:
        raise HTTPException(400, f"Unknown provider: {provider}")
    
    # Exchange code for tokens
    token_info = await oauth.exchange_code(provider_enum, code, state)
    
    # Get state data
    state_data = token_info.provider_data.get("state_data", {})
    user_id = state_data.get("user_id")
    company_id = state_data.get("company_id")
    
    # Save to database
    account_data = {
        "provider": provider,
        "company_id": company_id,
        "user_id": user_id if not company_id else None,
        "provider_account_id": token_info.provider_data.get("user_info", {}).get("id"),
        "provider_account_name": token_info.provider_data.get("user_info", {}).get("name"),
        "provider_email": token_info.provider_data.get("user_info", {}).get("email"),
        "access_token": token_info.access_token,
        "refresh_token": token_info.refresh_token,
        "token_expires_at": token_info.expires_at,
        "scopes": token_info.scopes,
        "status": "connected",
        "connected_by_user_id": user_id
    }
    
    result = await db.create(EntityType.CONNECTED_ACCOUNT, account_data)
    
    # Redirect to success page
    redirect_url = state_data.get("redirect_url", "/accounts")
    return RedirectResponse(f"{redirect_url}?success=true&account_id={result.entity_id}")


@app.get("/accounts", tags=["Connected Accounts"])
async def list_connected_accounts(
    user_id: Optional[str] = Query(None),
    company_id: Optional[str] = Query(None),
    provider: Optional[str] = Query(None),
    db: DatabaseAgent = Depends(get_db)
):
    """🔗 Liste les comptes connectés."""
    accounts = await db.get_connected_accounts(
        company_id=company_id,
        user_id=user_id,
        provider=provider
    )
    return {"accounts": accounts}


@app.delete("/accounts/{account_id}", tags=["Connected Accounts"])
async def disconnect_account(
    account_id: str,
    revoke_token: bool = Query(True),
    db: DatabaseAgent = Depends(get_db),
    oauth: OAuthManager = Depends(get_oauth)
):
    """🔗 Déconnecter un compte."""
    # Get account
    result = await db.read(EntityType.CONNECTED_ACCOUNT, account_id)
    if not result.success:
        raise HTTPException(404, "Account not found")
    
    account = result.data
    
    # Revoke token if requested
    if revoke_token and account.get("access_token"):
        try:
            provider = OAuthProvider(account["provider"])
            await oauth.revoke_token(provider, account["access_token"])
        except:
            pass  # Continue even if revocation fails
    
    # Delete from database
    await db.delete(EntityType.CONNECTED_ACCOUNT, account_id, soft_delete=False)
    
    return {"status": "disconnected"}


@app.post("/accounts/{account_id}/sync", tags=["Connected Accounts"])
async def sync_account(
    account_id: str,
    request: SyncAccountRequest,
    background_tasks: BackgroundTasks,
    db: DatabaseAgent = Depends(get_db),
    integrations: IntegrationManager = Depends(get_integrations)
):
    """🔄 Synchroniser les données d'un compte."""
    # Get account
    result = await db.read(EntityType.CONNECTED_ACCOUNT, account_id)
    if not result.success:
        raise HTTPException(404, "Account not found")
    
    account = result.data
    provider = OAuthProvider(account["provider"])
    
    # Parse data types
    data_types = None
    if request.data_types:
        data_types = [DataType(dt) for dt in request.data_types]
    
    # Start sync in background
    background_tasks.add_task(
        integrations.sync_account,
        account_id=account_id,
        provider=provider,
        access_token=account["access_token"],
        data_types=data_types,
        shop_name=account.get("provider_data", {}).get("shop_name")
    )
    
    return {"status": "sync_started", "account_id": account_id}


@app.get("/accounts/{account_id}/summary", tags=["Connected Accounts"])
async def get_account_summary(
    account_id: str,
    db: DatabaseAgent = Depends(get_db),
    integrations: IntegrationManager = Depends(get_integrations)
):
    """📊 Résumé des données d'un compte."""
    result = await db.read(EntityType.CONNECTED_ACCOUNT, account_id)
    if not result.success:
        raise HTTPException(404, "Account not found")
    
    account = result.data
    provider = OAuthProvider(account["provider"])
    
    summary = await integrations.get_account_summary(
        provider=provider,
        access_token=account["access_token"],
        shop_name=account.get("provider_data", {}).get("shop_name")
    )
    
    return {"account_id": account_id, "summary": summary}


# ═══════════════════════════════════════════════════════════════════════════════
# VIRTUAL WORKSPACES
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/workspaces", tags=["Workspaces"])
async def create_workspace(
    data: WorkspaceCreate,
    user_id: str = Query(...),
    ws_svc: VirtualWorkspaceService = Depends(get_workspace_svc)
):
    """🖥️ Créer un nouveau workspace."""
    workspace = await ws_svc.create_workspace(
        user_id=user_id,
        name=data.workspace_name,
        workspace_type=WorkspaceType(data.workspace_type),
        company_id=data.company_id,
        template=data.template
    )
    
    return {"workspace_id": workspace.workspace_id, "workspace": workspace.__dict__}


@app.get("/workspaces", tags=["Workspaces"])
async def list_workspaces(
    user_id: str = Query(...),
    ws_svc: VirtualWorkspaceService = Depends(get_workspace_svc)
):
    """🖥️ Liste les workspaces de l'utilisateur."""
    workspaces = await ws_svc.list_user_workspaces(user_id)
    return {"workspaces": [ws.__dict__ for ws in workspaces]}


@app.get("/workspaces/{workspace_id}", tags=["Workspaces"])
async def get_workspace(
    workspace_id: str,
    ws_svc: VirtualWorkspaceService = Depends(get_workspace_svc)
):
    """🖥️ Détails d'un workspace."""
    workspace = await ws_svc.get_workspace(workspace_id)
    if not workspace:
        raise HTTPException(404, "Workspace not found")
    
    return workspace.__dict__


@app.post("/workspaces/{workspace_id}/open", tags=["Workspaces"])
async def open_workspace(
    workspace_id: str,
    user_id: str = Query(...),
    ws_svc: VirtualWorkspaceService = Depends(get_workspace_svc)
):
    """🖥️ Ouvrir un workspace (initialise l'état)."""
    state = await ws_svc.open_workspace(workspace_id, user_id)
    return {"state": state.__dict__}


@app.post("/workspaces/{workspace_id}/close", tags=["Workspaces"])
async def close_workspace(
    workspace_id: str,
    ws_svc: VirtualWorkspaceService = Depends(get_workspace_svc)
):
    """🖥️ Fermer un workspace."""
    await ws_svc.close_workspace(workspace_id)
    return {"status": "closed"}


@app.post("/workspaces/{workspace_id}/focus", tags=["Workspaces"])
async def enable_focus(
    workspace_id: str,
    request: FocusModeRequest,
    ws_svc: VirtualWorkspaceService = Depends(get_workspace_svc)
):
    """🎯 Activer le mode focus."""
    result = await ws_svc.enable_focus_mode(
        workspace_id,
        mode=FocusMode(request.mode),
        duration_minutes=request.duration_minutes
    )
    return result


@app.delete("/workspaces/{workspace_id}/focus", tags=["Workspaces"])
async def disable_focus(
    workspace_id: str,
    ws_svc: VirtualWorkspaceService = Depends(get_workspace_svc)
):
    """🎯 Désactiver le mode focus."""
    result = await ws_svc.disable_focus_mode(workspace_id)
    return result


@app.post("/workspaces/{workspace_id}/panels", tags=["Workspaces"])
async def add_panel(
    workspace_id: str,
    request: PanelAddRequest,
    ws_svc: VirtualWorkspaceService = Depends(get_workspace_svc)
):
    """📐 Ajouter un panneau au workspace."""
    panel = await ws_svc.add_panel(
        workspace_id,
        panel_type=PanelType(request.panel_type),
        position=request.position,
        settings=request.settings
    )
    
    if not panel:
        raise HTTPException(400, "Failed to add panel")
    
    return {"panel": panel.__dict__}


@app.post("/workspaces/{workspace_id}/connect-account", tags=["Workspaces"])
async def connect_account_to_workspace(
    workspace_id: str,
    account_id: str = Query(...),
    ws_svc: VirtualWorkspaceService = Depends(get_workspace_svc)
):
    """🔗 Connecter un compte au workspace."""
    success = await ws_svc.connect_account(workspace_id, account_id)
    return {"success": success}


@app.get("/workspaces/{workspace_id}/data", tags=["Workspaces"])
async def get_workspace_data(
    workspace_id: str,
    ws_svc: VirtualWorkspaceService = Depends(get_workspace_svc)
):
    """📊 Récupérer toutes les données du workspace."""
    data = await ws_svc.get_workspace_data(workspace_id)
    return data


# ═══════════════════════════════════════════════════════════════════════════════
# DATA ITEMS
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/data", tags=["Data"])
async def create_data_item(
    data: DataItemCreate,
    user_id: str = Query(...),
    company_id: Optional[str] = Query(None),
    db: DatabaseAgent = Depends(get_db)
):
    """📄 Créer un élément de données."""
    item_data = data.model_dump()
    item_data["user_id"] = user_id if not company_id else None
    item_data["company_id"] = company_id
    
    result = await db.create(EntityType.DATA_ITEM, item_data, user_id=user_id)
    
    if not result.success:
        raise HTTPException(400, result.error)
    
    return {"item_id": result.entity_id, "data": result.data}


@app.get("/data", tags=["Data"])
async def list_data_items(
    user_id: Optional[str] = Query(None),
    company_id: Optional[str] = Query(None),
    item_type: Optional[str] = Query(None),
    category_id: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0),
    db: DatabaseAgent = Depends(get_db)
):
    """📄 Liste les éléments de données."""
    filters = []
    
    if user_id:
        filters.append(QueryFilter("user_id", "eq", user_id))
    if company_id:
        filters.append(QueryFilter("company_id", "eq", company_id))
    if item_type:
        filters.append(QueryFilter("item_type", "eq", item_type))
    if category_id:
        filters.append(QueryFilter("category_id", "eq", category_id))
    
    result = await db.list(
        EntityType.DATA_ITEM,
        QueryOptions(filters=filters, limit=limit, offset=offset)
    )
    
    return result.data


@app.get("/data/{item_id}", tags=["Data"])
async def get_data_item(
    item_id: str,
    db: DatabaseAgent = Depends(get_db)
):
    """📄 Détails d'un élément."""
    result = await db.read(EntityType.DATA_ITEM, item_id)
    
    if not result.success:
        raise HTTPException(404, "Item not found")
    
    return result.data


@app.put("/data/{item_id}", tags=["Data"])
async def update_data_item(
    item_id: str,
    data: DataItemUpdate,
    db: DatabaseAgent = Depends(get_db)
):
    """📄 Mettre à jour un élément."""
    result = await db.update(
        EntityType.DATA_ITEM,
        item_id,
        {k: v for k, v in data.model_dump().items() if v is not None}
    )
    
    if not result.success:
        raise HTTPException(400, result.error)
    
    return result.data


@app.delete("/data/{item_id}", tags=["Data"])
async def delete_data_item(
    item_id: str,
    permanent: bool = Query(False),
    db: DatabaseAgent = Depends(get_db)
):
    """📄 Supprimer un élément."""
    result = await db.delete(EntityType.DATA_ITEM, item_id, soft_delete=not permanent)
    
    if not result.success:
        raise HTTPException(400, result.error)
    
    return {"status": "deleted" if permanent else "archived"}


@app.post("/data/search", tags=["Data"])
async def search_data(
    request: DataSearchRequest,
    user_id: Optional[str] = Query(None),
    company_id: Optional[str] = Query(None),
    db: DatabaseAgent = Depends(get_db)
):
    """🔍 Rechercher dans les données."""
    result = await db.search(
        EntityType.DATA_ITEM,
        query=request.query,
        options=QueryOptions(limit=request.limit)
    )
    
    return result.data


# ═══════════════════════════════════════════════════════════════════════════════
# CATEGORIES
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/categories", tags=["Categories"])
async def create_category(
    data: CategoryCreate,
    user_id: Optional[str] = Query(None),
    company_id: Optional[str] = Query(None),
    db: DatabaseAgent = Depends(get_db)
):
    """📁 Créer une catégorie."""
    cat_data = data.model_dump()
    cat_data["user_id"] = user_id if not company_id else None
    cat_data["company_id"] = company_id
    
    result = await db.create(EntityType.CATEGORY, cat_data)
    
    if not result.success:
        raise HTTPException(400, result.error)
    
    return {"category_id": result.entity_id}


@app.get("/categories", tags=["Categories"])
async def list_categories(
    user_id: Optional[str] = Query(None),
    company_id: Optional[str] = Query(None),
    db: DatabaseAgent = Depends(get_db)
):
    """📁 Liste les catégories."""
    filters = []
    if user_id:
        filters.append(QueryFilter("user_id", "eq", user_id))
    if company_id:
        filters.append(QueryFilter("company_id", "eq", company_id))
    
    result = await db.list(EntityType.CATEGORY, QueryOptions(filters=filters))
    return result.data


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
