"""
CHE·NU — Governed Intelligence Operating System
"L'IA assiste. L'humain décide. Toujours."
Foundation Freeze v1.0.0 — ACTIF
"""
import os
import sys
from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core.config.settings import settings
from core.database.connection import init_db
from core.laws.foundation import FoundationFreeze
from api.routes import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n" + "="*70)
    print("       CHE·NU — Governed Intelligence Operating System")
    print("="*70 + "\n")
    
    if not FoundationFreeze().verify():
        print("❌ FOUNDATION FREEZE VALIDATION FAILED")
        sys.exit(1)
    
    print("✅ Foundation Freeze v1.0.0 — ACTIF")
    print("   ├── Law 1: Souveraineté des données ✓")
    print("   ├── Law 2: Pas d'évaluation implicite ✓")
    print("   ├── Law 3: Pas de manipulation ✓")
    print("   ├── Law 4: Consentement explicite ✓")
    print("   ├── Law 5: Clarté et calme ✓")
    print("   └── Law 6: Réversibilité ✓\n")
    
    await init_db()
    print("✅ Database initialized\n")
    
    print("🌐 8 Canonical Spheres loaded:")
    print("   🔒 Personnel | 📐 Methodology | 💼 Business | 📚 Scholar")
    print("   🎨 Creative  | 🥽 XR/Meeting  | 📱 Social   | 🏛️ Institutions\n")
    
    print(f"🚀 Backend: http://{settings.HOST}:{settings.PORT}")
    print(f"📚 API Docs: http://{settings.HOST}:{settings.PORT}/api/docs")
    print(f"🌌 Frontend: http://localhost:3000\n")
    print("="*70)
    print("   \"L'IA assiste. L'humain décide. Toujours.\"")
    print("="*70 + "\n")
    
    yield
    print("\n👋 CHE·NU Shutting down...\n")

app = FastAPI(
    title="CHE·NU API",
    description="Governed Intelligence Operating System",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "name": "CHE·NU",
        "type": "Governed Intelligence Operating System",
        "version": "1.0.0",
        "foundation_freeze": "ACTIF",
        "philosophy": "L'IA assiste. L'humain décide. Toujours.",
        "docs": "/api/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "chenu-gios"}

@app.get("/foundation")
async def foundation():
    return {
        "version": "1.0.0",
        "status": "ACTIF",
        "laws": [
            {"id": 1, "name": "Souveraineté des données", "status": "FROZEN"},
            {"id": 2, "name": "Pas d'évaluation implicite", "status": "FROZEN"},
            {"id": 3, "name": "Pas de manipulation", "status": "FROZEN"},
            {"id": 4, "name": "Consentement explicite", "status": "FROZEN"},
            {"id": 5, "name": "Clarté et calme", "status": "FROZEN"},
            {"id": 6, "name": "Réversibilité", "status": "FROZEN"}
        ],
        "spheres": [
            {"id": "personnel", "emoji": "🔒", "status": "FROZEN"},
            {"id": "methodology", "emoji": "📐", "status": "FROZEN"},
            {"id": "business", "emoji": "💼", "status": "FROZEN"},
            {"id": "scholar", "emoji": "📚", "status": "FROZEN"},
            {"id": "creative_studio", "emoji": "🎨", "status": "FROZEN"},
            {"id": "xr_meeting", "emoji": "🥽", "status": "FROZEN"},
            {"id": "social_media", "emoji": "📱", "status": "FROZEN"},
            {"id": "institutions", "emoji": "🏛️", "status": "FROZEN"}
        ]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
