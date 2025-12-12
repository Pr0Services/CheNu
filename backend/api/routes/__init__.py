"""CHE·NU API Routes"""
from fastapi import APIRouter

from api.routes.auth import router as auth_router
from api.routes.nova import router as nova_router
from api.routes.users import router as users_router
from api.routes.tokens import router as tokens_router
from api.routes.agents import router as agents_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(nova_router, prefix="/nova", tags=["Nova AI"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(tokens_router, prefix="/tokens", tags=["Token System"])
api_router.include_router(agents_router, prefix="/agents", tags=["AI Agents"])
