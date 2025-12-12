# ═══════════════════════════════════════════════════════════════════════════════
# CHE·NU V20 - Security Module
# Rate Limiting, 2FA, SSO, Audit Logging, Encryption
# ═══════════════════════════════════════════════════════════════════════════════

from __future__ import annotations
from typing import Any, Dict, List, Optional, Callable
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
import hashlib
import hmac
import secrets
import base64
import json
import asyncio
from functools import wraps

# ─────────────────────────────────────────────────────────────────────────────
# RATE LIMITING
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class RateLimitConfig:
    """Rate limit configuration"""
    requests: int
    window_seconds: int
    burst: int = 0

class RateLimitTier(Enum):
    FREE = "free"
    STANDARD = "standard"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"

RATE_LIMITS = {
    RateLimitTier.FREE: {
        "api": RateLimitConfig(60, 60),       # 60/min
        "auth": RateLimitConfig(5, 60),        # 5/min
        "nova": RateLimitConfig(20, 60),       # 20/min
        "upload": RateLimitConfig(10, 3600),   # 10/hour
    },
    RateLimitTier.STANDARD: {
        "api": RateLimitConfig(300, 60),
        "auth": RateLimitConfig(10, 60),
        "nova": RateLimitConfig(100, 60),
        "upload": RateLimitConfig(50, 3600),
    },
    RateLimitTier.PREMIUM: {
        "api": RateLimitConfig(1000, 60),
        "auth": RateLimitConfig(20, 60),
        "nova": RateLimitConfig(500, 60),
        "upload": RateLimitConfig(200, 3600),
    },
    RateLimitTier.ENTERPRISE: {
        "api": RateLimitConfig(10000, 60, burst=1000),
        "auth": RateLimitConfig(100, 60),
        "nova": RateLimitConfig(2000, 60),
        "upload": RateLimitConfig(1000, 3600),
    },
}

class RateLimiter:
    """Redis-based rate limiter with sliding window"""
    
    def __init__(self, redis_client):
        self.redis = redis_client
    
    async def is_allowed(
        self,
        key: str,
        tier: RateLimitTier,
        endpoint_type: str = "api"
    ) -> tuple[bool, dict]:
        """Check if request is allowed"""
        config = RATE_LIMITS[tier][endpoint_type]
        
        now = datetime.utcnow().timestamp()
        window_start = now - config.window_seconds
        redis_key = f"ratelimit:{key}:{endpoint_type}"
        
        pipe = self.redis.pipeline()
        pipe.zremrangebyscore(redis_key, 0, window_start)
        pipe.zadd(redis_key, {str(now): now})
        pipe.zcard(redis_key)
        pipe.expire(redis_key, config.window_seconds)
        results = await pipe.execute()
        
        current_count = results[2]
        allowed = current_count <= config.requests + config.burst
        
        return allowed, {
            "limit": config.requests,
            "remaining": max(0, config.requests - current_count),
            "reset": int(now + config.window_seconds),
            "retry_after": config.window_seconds if not allowed else 0
        }

def rate_limit(endpoint_type: str = "api"):
    """Decorator for rate limiting"""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request = kwargs.get("request") or args[0]
            limiter = request.app.state.rate_limiter
            user_id = getattr(request.state, "user_id", request.client.host)
            tier = getattr(request.state, "rate_tier", RateLimitTier.FREE)
            
            allowed, info = await limiter.is_allowed(user_id, tier, endpoint_type)
            
            if not allowed:
                from fastapi import HTTPException
                raise HTTPException(
                    status_code=429,
                    detail="Rate limit exceeded",
                    headers={
                        "X-RateLimit-Limit": str(info["limit"]),
                        "X-RateLimit-Remaining": str(info["remaining"]),
                        "X-RateLimit-Reset": str(info["reset"]),
                        "Retry-After": str(info["retry_after"])
                    }
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


# ─────────────────────────────────────────────────────────────────────────────
# TWO-FACTOR AUTHENTICATION (2FA)
# ─────────────────────────────────────────────────────────────────────────────

import pyotp
import qrcode
from io import BytesIO

@dataclass
class TwoFactorAuth:
    """2FA configuration for user"""
    user_id: str
    secret: str
    enabled: bool = False
    backup_codes: List[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)

class TwoFactorService:
    """Service for 2FA operations"""
    
    def __init__(self, app_name: str = "CHE·NU"):
        self.app_name = app_name
    
    def generate_secret(self) -> str:
        """Generate new TOTP secret"""
        return pyotp.random_base32()
    
    def generate_backup_codes(self, count: int = 10) -> List[str]:
        """Generate backup codes"""
        return [secrets.token_hex(4).upper() for _ in range(count)]
    
    def get_provisioning_uri(self, email: str, secret: str) -> str:
        """Get URI for authenticator apps"""
        totp = pyotp.TOTP(secret)
        return totp.provisioning_uri(name=email, issuer_name=self.app_name)
    
    def generate_qr_code(self, email: str, secret: str) -> bytes:
        """Generate QR code image"""
        uri = self.get_provisioning_uri(email, secret)
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(uri)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        return buffer.getvalue()
    
    def verify_code(self, secret: str, code: str) -> bool:
        """Verify TOTP code"""
        totp = pyotp.TOTP(secret)
        return totp.verify(code, valid_window=1)
    
    def verify_backup_code(self, backup_codes: List[str], code: str) -> tuple[bool, List[str]]:
        """Verify and consume backup code"""
        code_upper = code.upper().replace("-", "")
        if code_upper in backup_codes:
            remaining = [c for c in backup_codes if c != code_upper]
            return True, remaining
        return False, backup_codes


# ─────────────────────────────────────────────────────────────────────────────
# SINGLE SIGN-ON (SSO) - SAML & OIDC
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class SSOConfig:
    """SSO configuration for tenant"""
    tenant_id: str
    provider: str  # "saml", "oidc", "google", "microsoft", "okta"
    enabled: bool = False
    
    # SAML
    idp_entity_id: Optional[str] = None
    idp_sso_url: Optional[str] = None
    idp_certificate: Optional[str] = None
    
    # OIDC
    client_id: Optional[str] = None
    client_secret: Optional[str] = None
    discovery_url: Optional[str] = None
    
    # Mapping
    attribute_mapping: Dict[str, str] = field(default_factory=lambda: {
        "email": "email",
        "name": "name",
        "groups": "groups"
    })

class SSOService:
    """Service for SSO authentication"""
    
    async def initiate_saml_login(self, config: SSOConfig, relay_state: str) -> str:
        """Generate SAML AuthnRequest and return redirect URL"""
        # Implementation would use python3-saml
        return f"{config.idp_sso_url}?SAMLRequest=..."
    
    async def process_saml_response(self, config: SSOConfig, saml_response: str) -> dict:
        """Process SAML response and extract user info"""
        # Validate signature, decrypt assertions, extract attributes
        return {
            "email": "user@company.com",
            "name": "User Name",
            "groups": ["admin"]
        }
    
    async def initiate_oidc_login(self, config: SSOConfig, redirect_uri: str) -> str:
        """Generate OIDC authorization URL"""
        state = secrets.token_urlsafe(32)
        nonce = secrets.token_urlsafe(32)
        
        params = {
            "client_id": config.client_id,
            "response_type": "code",
            "scope": "openid email profile",
            "redirect_uri": redirect_uri,
            "state": state,
            "nonce": nonce
        }
        
        # Get authorization endpoint from discovery
        return f"https://login.provider.com/authorize?..." 
    
    async def exchange_oidc_code(self, config: SSOConfig, code: str, redirect_uri: str) -> dict:
        """Exchange authorization code for tokens and user info"""
        # Implementation would make token request and userinfo request
        return {
            "access_token": "...",
            "id_token": "...",
            "user_info": {"email": "user@company.com", "name": "User"}
        }


# ─────────────────────────────────────────────────────────────────────────────
# AUDIT LOGGING
# ─────────────────────────────────────────────────────────────────────────────

class AuditAction(Enum):
    # Auth
    LOGIN = "auth.login"
    LOGOUT = "auth.logout"
    LOGIN_FAILED = "auth.login_failed"
    PASSWORD_CHANGE = "auth.password_change"
    MFA_ENABLED = "auth.mfa_enabled"
    MFA_DISABLED = "auth.mfa_disabled"
    
    # Data
    CREATE = "data.create"
    READ = "data.read"
    UPDATE = "data.update"
    DELETE = "data.delete"
    EXPORT = "data.export"
    
    # Admin
    USER_INVITE = "admin.user_invite"
    USER_REMOVE = "admin.user_remove"
    ROLE_CHANGE = "admin.role_change"
    SETTINGS_CHANGE = "admin.settings_change"
    
    # Security
    API_KEY_CREATE = "security.api_key_create"
    API_KEY_REVOKE = "security.api_key_revoke"
    PERMISSION_CHANGE = "security.permission_change"

@dataclass
class AuditLog:
    """Audit log entry"""
    id: str
    timestamp: datetime
    tenant_id: str
    user_id: str
    action: AuditAction
    resource_type: str
    resource_id: Optional[str]
    ip_address: str
    user_agent: str
    details: Dict[str, Any]
    status: str  # "success", "failure"

class AuditLogger:
    """Service for audit logging"""
    
    def __init__(self, storage):
        self.storage = storage
    
    async def log(
        self,
        action: AuditAction,
        user_id: str,
        tenant_id: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        details: Dict[str, Any] = None,
        request = None,
        status: str = "success"
    ):
        """Create audit log entry"""
        import uuid
        
        entry = AuditLog(
            id=str(uuid.uuid4()),
            timestamp=datetime.utcnow(),
            tenant_id=tenant_id,
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            ip_address=request.client.host if request else "unknown",
            user_agent=request.headers.get("user-agent", "unknown") if request else "unknown",
            details=details or {},
            status=status
        )
        
        await self.storage.save(entry)
        return entry
    
    async def query(
        self,
        tenant_id: str,
        user_id: Optional[str] = None,
        action: Optional[AuditAction] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100
    ) -> List[AuditLog]:
        """Query audit logs"""
        return await self.storage.query(
            tenant_id=tenant_id,
            user_id=user_id,
            action=action,
            start_date=start_date,
            end_date=end_date,
            limit=limit
        )


# ─────────────────────────────────────────────────────────────────────────────
# ENCRYPTION
# ─────────────────────────────────────────────────────────────────────────────

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

class EncryptionService:
    """Service for data encryption at rest"""
    
    def __init__(self, master_key: bytes):
        self.master_key = master_key
        self._fernet_cache: Dict[str, Fernet] = {}
    
    def _derive_key(self, tenant_id: str) -> bytes:
        """Derive tenant-specific key from master key"""
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=tenant_id.encode(),
            iterations=100000,
        )
        return base64.urlsafe_b64encode(kdf.derive(self.master_key))
    
    def _get_fernet(self, tenant_id: str) -> Fernet:
        """Get or create Fernet instance for tenant"""
        if tenant_id not in self._fernet_cache:
            key = self._derive_key(tenant_id)
            self._fernet_cache[tenant_id] = Fernet(key)
        return self._fernet_cache[tenant_id]
    
    def encrypt(self, tenant_id: str, data: str) -> str:
        """Encrypt string data"""
        fernet = self._get_fernet(tenant_id)
        encrypted = fernet.encrypt(data.encode())
        return base64.urlsafe_b64encode(encrypted).decode()
    
    def decrypt(self, tenant_id: str, encrypted_data: str) -> str:
        """Decrypt string data"""
        fernet = self._get_fernet(tenant_id)
        decoded = base64.urlsafe_b64decode(encrypted_data.encode())
        return fernet.decrypt(decoded).decode()
    
    def encrypt_dict(self, tenant_id: str, data: dict) -> str:
        """Encrypt dictionary as JSON"""
        return self.encrypt(tenant_id, json.dumps(data))
    
    def decrypt_dict(self, tenant_id: str, encrypted_data: str) -> dict:
        """Decrypt JSON to dictionary"""
        return json.loads(self.decrypt(tenant_id, encrypted_data))


# ─────────────────────────────────────────────────────────────────────────────
# API KEY MANAGEMENT
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class APIKey:
    """API Key model"""
    id: str
    tenant_id: str
    user_id: str
    name: str
    key_hash: str
    prefix: str  # First 8 chars for identification
    scopes: List[str]
    expires_at: Optional[datetime]
    last_used_at: Optional[datetime]
    created_at: datetime
    revoked: bool = False

class APIKeyService:
    """Service for API key management"""
    
    def __init__(self, storage):
        self.storage = storage
    
    def generate_key(self) -> tuple[str, str]:
        """Generate new API key and its hash"""
        key = f"chenu_{secrets.token_urlsafe(32)}"
        key_hash = hashlib.sha256(key.encode()).hexdigest()
        return key, key_hash
    
    async def create(
        self,
        tenant_id: str,
        user_id: str,
        name: str,
        scopes: List[str],
        expires_in_days: Optional[int] = None
    ) -> tuple[APIKey, str]:
        """Create new API key"""
        import uuid
        
        key, key_hash = self.generate_key()
        
        api_key = APIKey(
            id=str(uuid.uuid4()),
            tenant_id=tenant_id,
            user_id=user_id,
            name=name,
            key_hash=key_hash,
            prefix=key[:12],
            scopes=scopes,
            expires_at=datetime.utcnow() + timedelta(days=expires_in_days) if expires_in_days else None,
            last_used_at=None,
            created_at=datetime.utcnow()
        )
        
        await self.storage.save(api_key)
        return api_key, key  # Return full key only once
    
    async def verify(self, key: str) -> Optional[APIKey]:
        """Verify API key and return if valid"""
        key_hash = hashlib.sha256(key.encode()).hexdigest()
        api_key = await self.storage.find_by_hash(key_hash)
        
        if not api_key:
            return None
        
        if api_key.revoked:
            return None
        
        if api_key.expires_at and api_key.expires_at < datetime.utcnow():
            return None
        
        # Update last used
        api_key.last_used_at = datetime.utcnow()
        await self.storage.save(api_key)
        
        return api_key
    
    async def revoke(self, key_id: str, user_id: str) -> bool:
        """Revoke API key"""
        api_key = await self.storage.find_by_id(key_id)
        if api_key and api_key.user_id == user_id:
            api_key.revoked = True
            await self.storage.save(api_key)
            return True
        return False


# ─────────────────────────────────────────────────────────────────────────────
# SECURITY HEADERS MIDDLEWARE
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' wss: https:;"
        )
        
        return response


# ─────────────────────────────────────────────────────────────────────────────
# INPUT VALIDATION & SANITIZATION
# ─────────────────────────────────────────────────────────────────────────────

import re
import html

class InputSanitizer:
    """Sanitize user inputs"""
    
    @staticmethod
    def sanitize_html(text: str) -> str:
        """Escape HTML entities"""
        return html.escape(text)
    
    @staticmethod
    def sanitize_sql(text: str) -> str:
        """Basic SQL injection prevention (use parameterized queries!)"""
        dangerous = ["'", '"', ";", "--", "/*", "*/", "xp_", "DROP", "DELETE", "UPDATE", "INSERT"]
        result = text
        for pattern in dangerous:
            result = result.replace(pattern, "")
        return result
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def validate_password(password: str) -> tuple[bool, List[str]]:
        """Validate password strength"""
        errors = []
        
        if len(password) < 8:
            errors.append("Password must be at least 8 characters")
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain uppercase letter")
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain lowercase letter")
        if not re.search(r'\d', password):
            errors.append("Password must contain digit")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            errors.append("Password must contain special character")
        
        return len(errors) == 0, errors
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename for safe storage"""
        # Remove path separators
        filename = filename.replace("/", "_").replace("\\", "_")
        # Remove null bytes
        filename = filename.replace("\x00", "")
        # Keep only safe characters
        filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
        # Limit length
        return filename[:255]


print("Security module loaded")
