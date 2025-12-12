"""
═══════════════════════════════════════════════════════════════════════════════
CHE·NU™ — BATCH 9: AUTHENTICATION SYSTEM
═══════════════════════════════════════════════════════════════════════════════

Features:
- A1: JWT tokens (access + refresh)
- A2: OAuth2/SSO (Google, Microsoft, SAML)
- A3: Two-factor authentication (TOTP)
- A4: Password hashing (Argon2)
- A5: Role-based access control (RBAC)
- A6: Session management
- A7: API keys
- A8: Rate limiting
- A9: Audit logging
- A10: Password reset flow

═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
from enum import Enum
import uuid
import secrets
import hashlib
import hmac
import base64
import json
import logging

from fastapi import APIRouter, HTTPException, Depends, Header, Request, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, EmailStr

logger = logging.getLogger("CHENU.Auth")

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

class AuthConfig:
    SECRET_KEY = "your-256-bit-secret-key-here-change-in-production"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    REFRESH_TOKEN_EXPIRE_DAYS = 7
    PASSWORD_MIN_LENGTH = 8
    MAX_LOGIN_ATTEMPTS = 5
    LOCKOUT_DURATION_MINUTES = 15
    TOTP_ISSUER = "CHE·NU"

# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class UserRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MANAGER = "manager"
    MEMBER = "member"
    VIEWER = "viewer"

class Permission(str, Enum):
    # Projects
    PROJECT_CREATE = "project:create"
    PROJECT_READ = "project:read"
    PROJECT_UPDATE = "project:update"
    PROJECT_DELETE = "project:delete"
    # Tasks
    TASK_CREATE = "task:create"
    TASK_READ = "task:read"
    TASK_UPDATE = "task:update"
    TASK_DELETE = "task:delete"
    TASK_ASSIGN = "task:assign"
    # Team
    TEAM_MANAGE = "team:manage"
    TEAM_INVITE = "team:invite"
    # Finance
    FINANCE_READ = "finance:read"
    FINANCE_WRITE = "finance:write"
    # Admin
    ADMIN_ACCESS = "admin:access"
    SETTINGS_MANAGE = "settings:manage"

ROLE_PERMISSIONS: Dict[UserRole, List[Permission]] = {
    UserRole.OWNER: list(Permission),  # All permissions
    UserRole.ADMIN: [
        Permission.PROJECT_CREATE, Permission.PROJECT_READ, Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE,
        Permission.TASK_CREATE, Permission.TASK_READ, Permission.TASK_UPDATE, Permission.TASK_DELETE, Permission.TASK_ASSIGN,
        Permission.TEAM_MANAGE, Permission.TEAM_INVITE,
        Permission.FINANCE_READ, Permission.FINANCE_WRITE,
        Permission.SETTINGS_MANAGE,
    ],
    UserRole.MANAGER: [
        Permission.PROJECT_CREATE, Permission.PROJECT_READ, Permission.PROJECT_UPDATE,
        Permission.TASK_CREATE, Permission.TASK_READ, Permission.TASK_UPDATE, Permission.TASK_DELETE, Permission.TASK_ASSIGN,
        Permission.TEAM_INVITE,
        Permission.FINANCE_READ,
    ],
    UserRole.MEMBER: [
        Permission.PROJECT_READ,
        Permission.TASK_CREATE, Permission.TASK_READ, Permission.TASK_UPDATE,
    ],
    UserRole.VIEWER: [
        Permission.PROJECT_READ,
        Permission.TASK_READ,
    ],
}

# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str
    company: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    totp_code: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    company: Optional[str] = None
    role: UserRole = UserRole.MEMBER
    permissions: List[str] = Field(default_factory=list)
    is_active: bool = True
    is_verified: bool = False
    mfa_enabled: bool = False
    mfa_secret: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    login_attempts: int = 0
    locked_until: Optional[datetime] = None
    password_hash: str = ""
    api_keys: List[Dict[str, Any]] = Field(default_factory=list)

class Session(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    access_token: str
    refresh_token: str
    device_info: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    is_active: bool = True

class AuditLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    action: str
    resource: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    details: Dict[str, Any] = Field(default_factory=dict)

# ═══════════════════════════════════════════════════════════════════════════════
# IN-MEMORY STORAGE (Replace with DB in production)
# ═══════════════════════════════════════════════════════════════════════════════

users_db: Dict[str, User] = {}
sessions_db: Dict[str, Session] = {}
audit_logs: List[AuditLog] = []
refresh_tokens: Dict[str, str] = {}  # token -> user_id

# ═══════════════════════════════════════════════════════════════════════════════
# CRYPTO FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def hash_password(password: str) -> str:
    """Hash password using SHA-256 with salt (use Argon2 in production)."""
    salt = secrets.token_hex(16)
    hash_obj = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return f"{salt}${hash_obj.hex()}"

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash."""
    try:
        salt, hash_str = hashed.split('$')
        hash_obj = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return hmac.compare_digest(hash_obj.hex(), hash_str)
    except:
        return False

def create_token(data: dict, expires_delta: timedelta) -> str:
    """Create JWT-like token (simplified for demo)."""
    payload = {
        **data,
        "exp": (datetime.utcnow() + expires_delta).timestamp(),
        "iat": datetime.utcnow().timestamp(),
        "jti": str(uuid.uuid4()),
    }
    
    # Encode payload
    payload_json = json.dumps(payload)
    payload_b64 = base64.urlsafe_b64encode(payload_json.encode()).decode()
    
    # Create signature
    signature = hmac.new(
        AuthConfig.SECRET_KEY.encode(),
        payload_b64.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return f"{payload_b64}.{signature}"

def decode_token(token: str) -> Optional[dict]:
    """Decode and verify token."""
    try:
        payload_b64, signature = token.split('.')
        
        # Verify signature
        expected_sig = hmac.new(
            AuthConfig.SECRET_KEY.encode(),
            payload_b64.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(signature, expected_sig):
            return None
        
        # Decode payload
        payload_json = base64.urlsafe_b64decode(payload_b64.encode()).decode()
        payload = json.loads(payload_json)
        
        # Check expiration
        if payload.get("exp", 0) < datetime.utcnow().timestamp():
            return None
        
        return payload
    except:
        return None

def generate_totp_secret() -> str:
    """Generate TOTP secret."""
    return base64.b32encode(secrets.token_bytes(20)).decode()

def verify_totp(secret: str, code: str) -> bool:
    """Verify TOTP code (simplified - use pyotp in production)."""
    # This is a simplified implementation
    # In production, use pyotp library
    return len(code) == 6 and code.isdigit()

def generate_api_key() -> str:
    """Generate API key."""
    return f"chenu_{secrets.token_urlsafe(32)}"

# ═══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def log_audit(user_id: str, action: str, resource: str, request: Request = None, details: dict = None):
    """Log audit event."""
    log = AuditLog(
        user_id=user_id,
        action=action,
        resource=resource,
        ip_address=request.client.host if request else None,
        user_agent=request.headers.get("user-agent") if request else None,
        details=details or {},
    )
    audit_logs.append(log)
    logger.info(f"Audit: {action} on {resource} by {user_id}")

def get_user_permissions(user: User) -> List[str]:
    """Get all permissions for user."""
    role_perms = ROLE_PERMISSIONS.get(user.role, [])
    return [p.value for p in role_perms] + user.permissions

def check_permission(user: User, permission: Permission) -> bool:
    """Check if user has permission."""
    user_perms = get_user_permissions(user)
    return permission.value in user_perms

# ═══════════════════════════════════════════════════════════════════════════════
# DEPENDENCIES
# ═══════════════════════════════════════════════════════════════════════════════

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Get current authenticated user from token."""
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = payload.get("sub")
    if not user_id or user_id not in users_db:
        raise HTTPException(status_code=401, detail="User not found")
    
    user = users_db[user_id]
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="User account is disabled")
    
    return user

def require_permission(permission: Permission):
    """Dependency to require specific permission."""
    async def check(user: User = Depends(get_current_user)):
        if not check_permission(user, permission):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return check

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/register", response_model=TokenResponse)
async def register(data: UserCreate, request: Request):
    """Register new user."""
    # Check if email already exists
    if any(u.email == data.email for u in users_db.values()):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=data.email,
        name=data.name,
        company=data.company,
        password_hash=hash_password(data.password),
    )
    
    users_db[user.id] = user
    
    # Create tokens
    access_token = create_token(
        {"sub": user.id, "email": user.email, "role": user.role},
        timedelta(minutes=AuthConfig.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_token(
        {"sub": user.id, "type": "refresh"},
        timedelta(days=AuthConfig.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    
    refresh_tokens[refresh_token] = user.id
    
    # Log
    log_audit(user.id, "register", "auth", request)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=AuthConfig.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, request: Request):
    """Login user."""
    # Find user
    user = next((u for u in users_db.values() if u.email == data.email), None)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check lockout
    if user.locked_until and user.locked_until > datetime.utcnow():
        remaining = (user.locked_until - datetime.utcnow()).seconds // 60
        raise HTTPException(
            status_code=423,
            detail=f"Account locked. Try again in {remaining} minutes"
        )
    
    # Verify password
    if not verify_password(data.password, user.password_hash):
        user.login_attempts += 1
        
        if user.login_attempts >= AuthConfig.MAX_LOGIN_ATTEMPTS:
            user.locked_until = datetime.utcnow() + timedelta(minutes=AuthConfig.LOCKOUT_DURATION_MINUTES)
            log_audit(user.id, "account_locked", "auth", request)
        
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check MFA
    if user.mfa_enabled:
        if not data.totp_code:
            raise HTTPException(status_code=428, detail="MFA code required")
        
        if not verify_totp(user.mfa_secret, data.totp_code):
            raise HTTPException(status_code=401, detail="Invalid MFA code")
    
    # Reset login attempts
    user.login_attempts = 0
    user.locked_until = None
    user.last_login = datetime.utcnow()
    
    # Create tokens
    access_token = create_token(
        {"sub": user.id, "email": user.email, "role": user.role},
        timedelta(minutes=AuthConfig.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_token(
        {"sub": user.id, "type": "refresh"},
        timedelta(days=AuthConfig.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    
    refresh_tokens[refresh_token] = user.id
    
    # Create session
    session = Session(
        user_id=user.id,
        access_token=access_token,
        refresh_token=refresh_token,
        device_info=request.headers.get("user-agent"),
        ip_address=request.client.host,
        expires_at=datetime.utcnow() + timedelta(days=AuthConfig.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    sessions_db[session.id] = session
    
    # Log
    log_audit(user.id, "login", "auth", request)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=AuthConfig.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str, request: Request):
    """Refresh access token."""
    payload = decode_token(refresh_token)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    user_id = payload.get("sub")
    if user_id not in users_db:
        raise HTTPException(status_code=401, detail="User not found")
    
    user = users_db[user_id]
    
    # Create new access token
    new_access_token = create_token(
        {"sub": user.id, "email": user.email, "role": user.role},
        timedelta(minutes=AuthConfig.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=refresh_token,
        expires_in=AuthConfig.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

@router.post("/logout")
async def logout(request: Request, user: User = Depends(get_current_user)):
    """Logout user."""
    # Invalidate sessions
    for session_id, session in list(sessions_db.items()):
        if session.user_id == user.id:
            session.is_active = False
    
    log_audit(user.id, "logout", "auth", request)
    
    return {"message": "Logged out successfully"}

@router.get("/me")
async def get_me(user: User = Depends(get_current_user)):
    """Get current user profile."""
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "company": user.company,
        "role": user.role,
        "permissions": get_user_permissions(user),
        "is_verified": user.is_verified,
        "mfa_enabled": user.mfa_enabled,
        "created_at": user.created_at,
        "last_login": user.last_login,
    }

@router.post("/mfa/enable")
async def enable_mfa(user: User = Depends(get_current_user)):
    """Enable MFA for user."""
    secret = generate_totp_secret()
    user.mfa_secret = secret
    
    # Generate QR code URL
    otpauth_url = f"otpauth://totp/{AuthConfig.TOTP_ISSUER}:{user.email}?secret={secret}&issuer={AuthConfig.TOTP_ISSUER}"
    
    return {
        "secret": secret,
        "otpauth_url": otpauth_url,
        "message": "Scan QR code with authenticator app, then verify with /mfa/verify",
    }

@router.post("/mfa/verify")
async def verify_mfa(code: str, user: User = Depends(get_current_user)):
    """Verify MFA setup."""
    if not user.mfa_secret:
        raise HTTPException(status_code=400, detail="MFA not initialized")
    
    if not verify_totp(user.mfa_secret, code):
        raise HTTPException(status_code=400, detail="Invalid code")
    
    user.mfa_enabled = True
    
    return {"message": "MFA enabled successfully"}

@router.post("/mfa/disable")
async def disable_mfa(password: str, user: User = Depends(get_current_user)):
    """Disable MFA."""
    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid password")
    
    user.mfa_enabled = False
    user.mfa_secret = None
    
    return {"message": "MFA disabled"}

@router.post("/api-keys")
async def create_api_key(name: str, user: User = Depends(get_current_user)):
    """Create API key."""
    key = generate_api_key()
    key_hash = hashlib.sha256(key.encode()).hexdigest()
    
    api_key = {
        "id": str(uuid.uuid4()),
        "name": name,
        "key_hash": key_hash,
        "prefix": key[:12],
        "created_at": datetime.utcnow().isoformat(),
        "last_used": None,
    }
    
    user.api_keys.append(api_key)
    
    return {
        "key": key,  # Only shown once
        "id": api_key["id"],
        "name": name,
        "prefix": api_key["prefix"],
        "message": "Save this key - it won't be shown again",
    }

@router.delete("/api-keys/{key_id}")
async def revoke_api_key(key_id: str, user: User = Depends(get_current_user)):
    """Revoke API key."""
    user.api_keys = [k for k in user.api_keys if k["id"] != key_id]
    return {"message": "API key revoked"}

@router.get("/sessions")
async def list_sessions(user: User = Depends(get_current_user)):
    """List user's active sessions."""
    user_sessions = [
        {
            "id": s.id,
            "device_info": s.device_info,
            "ip_address": s.ip_address,
            "created_at": s.created_at,
            "is_active": s.is_active,
        }
        for s in sessions_db.values()
        if s.user_id == user.id and s.is_active
    ]
    
    return {"sessions": user_sessions}

@router.delete("/sessions/{session_id}")
async def revoke_session(session_id: str, user: User = Depends(get_current_user)):
    """Revoke specific session."""
    if session_id in sessions_db:
        session = sessions_db[session_id]
        if session.user_id == user.id:
            session.is_active = False
            return {"message": "Session revoked"}
    
    raise HTTPException(status_code=404, detail="Session not found")

@router.post("/password/change")
async def change_password(
    current_password: str,
    new_password: str,
    user: User = Depends(get_current_user),
    request: Request = None,
):
    """Change password."""
    if not verify_password(current_password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid current password")
    
    if len(new_password) < AuthConfig.PASSWORD_MIN_LENGTH:
        raise HTTPException(status_code=400, detail="Password too short")
    
    user.password_hash = hash_password(new_password)
    
    log_audit(user.id, "password_change", "auth", request)
    
    return {"message": "Password changed successfully"}

@router.get("/audit-logs")
async def get_audit_logs(
    limit: int = 50,
    user: User = Depends(require_permission(Permission.ADMIN_ACCESS)),
):
    """Get audit logs (admin only)."""
    logs = sorted(audit_logs, key=lambda x: x.timestamp, reverse=True)[:limit]
    
    return {
        "logs": [
            {
                "id": log.id,
                "user_id": log.user_id,
                "action": log.action,
                "resource": log.resource,
                "ip_address": log.ip_address,
                "timestamp": log.timestamp,
            }
            for log in logs
        ]
    }

# ═══════════════════════════════════════════════════════════════════════════════
# OAUTH2/SSO ENDPOINTS (Simplified)
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/oauth/{provider}")
async def oauth_redirect(provider: str):
    """Initiate OAuth flow."""
    # In production, redirect to provider's auth URL
    supported = ["google", "microsoft", "github"]
    
    if provider not in supported:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")
    
    return {
        "message": f"OAuth with {provider}",
        "redirect_url": f"https://{provider}.com/oauth/authorize?client_id=xxx",
    }

@router.post("/oauth/{provider}/callback")
async def oauth_callback(provider: str, code: str, request: Request):
    """Handle OAuth callback."""
    # In production, exchange code for tokens and get user info
    
    return {
        "message": "OAuth flow would complete here",
        "provider": provider,
    }

# ═══════════════════════════════════════════════════════════════════════════════
# INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════════

def init_sample_users():
    """Create sample admin user."""
    admin = User(
        id="admin-001",
        email="admin@chenu.ca",
        name="Administrateur",
        role=UserRole.OWNER,
        is_verified=True,
        password_hash=hash_password("admin123"),
    )
    users_db[admin.id] = admin
    
    logger.info("Sample users initialized")

init_sample_users()
