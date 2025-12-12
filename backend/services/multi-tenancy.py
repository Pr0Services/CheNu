# ═══════════════════════════════════════════════════════════════════════════════
# CHE·NU V20 - Multi-Tenancy System
# Isolation par entreprise, White-label, Custom domains
# ═══════════════════════════════════════════════════════════════════════════════

from __future__ import annotations
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import asyncio
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.base import BaseHTTPMiddleware
from sqlalchemy import Column, String, Boolean, JSON, ForeignKey, create_engine
from sqlalchemy.orm import relationship, Session
from pydantic import BaseModel

# ─────────────────────────────────────────────────────────────────────────────
# ENUMS
# ─────────────────────────────────────────────────────────────────────────────

class TenantPlan(Enum):
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

class TenantStatus(Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    TRIAL = "trial"
    CANCELLED = "cancelled"

# ─────────────────────────────────────────────────────────────────────────────
# MODELS
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class Tenant:
    """Tenant/Organization model"""
    id: str
    name: str
    slug: str
    domain: Optional[str] = None
    custom_domain: Optional[str] = None
    plan: TenantPlan = TenantPlan.FREE
    status: TenantStatus = TenantStatus.ACTIVE
    
    # Branding
    logo_url: Optional[str] = None
    primary_color: str = "#4ade80"
    secondary_color: str = "#22d3ee"
    
    # Limits
    max_users: int = 5
    max_projects: int = 10
    max_storage_gb: int = 5
    
    # Features
    features: Dict[str, bool] = field(default_factory=lambda: {
        "ai_assistant": True,
        "custom_branding": False,
        "api_access": False,
        "sso": False,
        "advanced_analytics": False,
        "priority_support": False,
    })
    
    # Settings
    settings: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class TenantBranding:
    """White-label branding configuration"""
    tenant_id: str
    
    # Visual
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    primary_color: str = "#4ade80"
    secondary_color: str = "#22d3ee"
    background_color: str = "#0a0d0b"
    
    # Text
    app_name: str = "CHE·NU"
    tagline: str = "Construction Management Platform"
    
    # Custom CSS
    custom_css: Optional[str] = None
    
    # Email templates
    email_logo_url: Optional[str] = None
    email_footer_text: str = "Powered by CHE·NU"
    
    # Login page
    login_background_url: Optional[str] = None
    login_welcome_text: str = "Welcome back"


# ─────────────────────────────────────────────────────────────────────────────
# PLAN LIMITS
# ─────────────────────────────────────────────────────────────────────────────

PLAN_LIMITS = {
    TenantPlan.FREE: {
        "max_users": 5,
        "max_projects": 10,
        "max_storage_gb": 5,
        "features": {
            "ai_assistant": True,
            "custom_branding": False,
            "api_access": False,
            "sso": False,
            "advanced_analytics": False,
            "priority_support": False,
        }
    },
    TenantPlan.STARTER: {
        "max_users": 25,
        "max_projects": 50,
        "max_storage_gb": 50,
        "features": {
            "ai_assistant": True,
            "custom_branding": True,
            "api_access": True,
            "sso": False,
            "advanced_analytics": False,
            "priority_support": False,
        }
    },
    TenantPlan.PROFESSIONAL: {
        "max_users": 100,
        "max_projects": 200,
        "max_storage_gb": 200,
        "features": {
            "ai_assistant": True,
            "custom_branding": True,
            "api_access": True,
            "sso": True,
            "advanced_analytics": True,
            "priority_support": False,
        }
    },
    TenantPlan.ENTERPRISE: {
        "max_users": -1,  # Unlimited
        "max_projects": -1,
        "max_storage_gb": -1,
        "features": {
            "ai_assistant": True,
            "custom_branding": True,
            "api_access": True,
            "sso": True,
            "advanced_analytics": True,
            "priority_support": True,
        }
    }
}


# ─────────────────────────────────────────────────────────────────────────────
# TENANT CONTEXT
# ─────────────────────────────────────────────────────────────────────────────

class TenantContext:
    """Thread-local tenant context"""
    _current_tenant: Optional[Tenant] = None
    
    @classmethod
    def set(cls, tenant: Tenant):
        cls._current_tenant = tenant
    
    @classmethod
    def get(cls) -> Optional[Tenant]:
        return cls._current_tenant
    
    @classmethod
    def clear(cls):
        cls._current_tenant = None


# ─────────────────────────────────────────────────────────────────────────────
# TENANT MIDDLEWARE
# ─────────────────────────────────────────────────────────────────────────────

class TenantMiddleware(BaseHTTPMiddleware):
    """Middleware to resolve tenant from request"""
    
    def __init__(self, app: FastAPI, tenant_service: "TenantService"):
        super().__init__(app)
        self.tenant_service = tenant_service
    
    async def dispatch(self, request: Request, call_next):
        tenant = await self._resolve_tenant(request)
        
        if tenant:
            TenantContext.set(tenant)
            request.state.tenant = tenant
        
        try:
            response = await call_next(request)
            return response
        finally:
            TenantContext.clear()
    
    async def _resolve_tenant(self, request: Request) -> Optional[Tenant]:
        # 1. Try custom domain
        host = request.headers.get("host", "").split(":")[0]
        tenant = await self.tenant_service.get_by_custom_domain(host)
        if tenant:
            return tenant
        
        # 2. Try subdomain
        if "." in host:
            subdomain = host.split(".")[0]
            if subdomain not in ["www", "api", "app"]:
                tenant = await self.tenant_service.get_by_slug(subdomain)
                if tenant:
                    return tenant
        
        # 3. Try header
        tenant_id = request.headers.get("X-Tenant-ID")
        if tenant_id:
            return await self.tenant_service.get_by_id(tenant_id)
        
        # 4. Try JWT token claim
        # (would extract from auth token)
        
        return None


# ─────────────────────────────────────────────────────────────────────────────
# TENANT SERVICE
# ─────────────────────────────────────────────────────────────────────────────

class TenantService:
    """Service for tenant management"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self._cache: Dict[str, Tenant] = {}
    
    async def create(self, name: str, slug: str, plan: TenantPlan = TenantPlan.FREE) -> Tenant:
        """Create new tenant"""
        import uuid
        
        # Check slug availability
        if await self.get_by_slug(slug):
            raise ValueError(f"Slug '{slug}' already taken")
        
        limits = PLAN_LIMITS[plan]
        tenant = Tenant(
            id=str(uuid.uuid4()),
            name=name,
            slug=slug,
            plan=plan,
            max_users=limits["max_users"],
            max_projects=limits["max_projects"],
            max_storage_gb=limits["max_storage_gb"],
            features=limits["features"],
        )
        
        # Save to DB
        # self.db.add(tenant)
        # self.db.commit()
        
        self._cache[tenant.id] = tenant
        return tenant
    
    async def get_by_id(self, tenant_id: str) -> Optional[Tenant]:
        if tenant_id in self._cache:
            return self._cache[tenant_id]
        # return self.db.query(Tenant).filter(Tenant.id == tenant_id).first()
        return None
    
    async def get_by_slug(self, slug: str) -> Optional[Tenant]:
        for tenant in self._cache.values():
            if tenant.slug == slug:
                return tenant
        return None
    
    async def get_by_custom_domain(self, domain: str) -> Optional[Tenant]:
        for tenant in self._cache.values():
            if tenant.custom_domain == domain:
                return tenant
        return None
    
    async def update_plan(self, tenant_id: str, new_plan: TenantPlan) -> Tenant:
        """Upgrade/downgrade tenant plan"""
        tenant = await self.get_by_id(tenant_id)
        if not tenant:
            raise ValueError("Tenant not found")
        
        limits = PLAN_LIMITS[new_plan]
        tenant.plan = new_plan
        tenant.max_users = limits["max_users"]
        tenant.max_projects = limits["max_projects"]
        tenant.max_storage_gb = limits["max_storage_gb"]
        tenant.features = limits["features"]
        
        return tenant
    
    async def set_custom_domain(self, tenant_id: str, domain: str) -> Tenant:
        """Set custom domain for tenant"""
        tenant = await self.get_by_id(tenant_id)
        if not tenant:
            raise ValueError("Tenant not found")
        
        if not tenant.features.get("custom_branding"):
            raise ValueError("Custom domain not available on current plan")
        
        # Verify domain ownership (DNS TXT record check)
        # await self._verify_domain_ownership(domain, tenant_id)
        
        tenant.custom_domain = domain
        return tenant
    
    async def update_branding(self, tenant_id: str, branding: TenantBranding) -> Tenant:
        """Update tenant branding"""
        tenant = await self.get_by_id(tenant_id)
        if not tenant:
            raise ValueError("Tenant not found")
        
        if not tenant.features.get("custom_branding"):
            raise ValueError("Custom branding not available on current plan")
        
        tenant.logo_url = branding.logo_url
        tenant.primary_color = branding.primary_color
        tenant.secondary_color = branding.secondary_color
        
        return tenant
    
    def check_limit(self, tenant: Tenant, resource: str, current: int) -> bool:
        """Check if tenant is within limits"""
        limit = getattr(tenant, f"max_{resource}", -1)
        if limit == -1:  # Unlimited
            return True
        return current < limit
    
    def has_feature(self, tenant: Tenant, feature: str) -> bool:
        """Check if tenant has feature enabled"""
        return tenant.features.get(feature, False)


# ─────────────────────────────────────────────────────────────────────────────
# DATA ISOLATION
# ─────────────────────────────────────────────────────────────────────────────

class TenantIsolatedQuery:
    """Mixin for tenant-isolated database queries"""
    
    @staticmethod
    def filter_by_tenant(query, tenant_id: str):
        """Add tenant filter to query"""
        return query.filter_by(tenant_id=tenant_id)
    
    @staticmethod
    def get_current_tenant_id() -> str:
        tenant = TenantContext.get()
        if not tenant:
            raise HTTPException(status_code=401, detail="Tenant context not set")
        return tenant.id


# ─────────────────────────────────────────────────────────────────────────────
# DATABASE SCHEMA ISOLATION (PostgreSQL Row Level Security)
# ─────────────────────────────────────────────────────────────────────────────

RLS_SETUP_SQL = """
-- Enable RLS on tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY tenant_isolation_projects ON projects
    USING (tenant_id = current_setting('app.current_tenant')::uuid);

CREATE POLICY tenant_isolation_tasks ON tasks
    USING (tenant_id = current_setting('app.current_tenant')::uuid);

CREATE POLICY tenant_isolation_users ON users
    USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- Function to set current tenant
CREATE OR REPLACE FUNCTION set_current_tenant(tenant_uuid uuid)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_tenant', tenant_uuid::text, true);
END;
$$ LANGUAGE plpgsql;
"""


# ─────────────────────────────────────────────────────────────────────────────
# API ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import APIRouter

tenant_router = APIRouter(prefix="/tenants", tags=["Tenants"])

@tenant_router.post("/")
async def create_tenant(name: str, slug: str, plan: str = "free"):
    """Create new tenant"""
    pass

@tenant_router.get("/current")
async def get_current_tenant(request: Request):
    """Get current tenant info"""
    tenant = getattr(request.state, "tenant", None)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant

@tenant_router.patch("/branding")
async def update_branding(branding: dict, request: Request):
    """Update tenant branding"""
    pass

@tenant_router.post("/domain")
async def set_custom_domain(domain: str, request: Request):
    """Set custom domain"""
    pass

@tenant_router.get("/usage")
async def get_usage(request: Request):
    """Get tenant usage stats"""
    pass
