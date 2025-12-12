"""CHE·NU Authentication Routes"""
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from passlib.context import CryptContext

from core.config.settings import settings

router = APIRouter()
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

# Demo user
DEMO_USER = {
    "id": "1",
    "email": "demo@chenu.app",
    "name": "Demo User",
    "password_hash": pwd_context.hash("demo123"),
    "tier": "pro",
    "nova_tokens": 50000
}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        if email == DEMO_USER["email"]:
            return DEMO_USER
        raise credentials_exception
    except JWTError:
        raise credentials_exception

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    if credentials.email == DEMO_USER["email"] and pwd_context.verify(credentials.password, DEMO_USER["password_hash"]):
        access_token = create_access_token({"sub": DEMO_USER["email"], "tier": DEMO_USER["tier"]})
        refresh_token = create_refresh_token({"sub": DEMO_USER["email"]})
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            user={
                "id": DEMO_USER["id"],
                "email": DEMO_USER["email"],
                "name": DEMO_USER["name"],
                "tier": DEMO_USER["tier"],
                "nova_tokens": DEMO_USER["nova_tokens"]
            }
        )
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": current_user["name"],
        "tier": current_user["tier"],
        "nova_tokens": current_user["nova_tokens"]
    }
