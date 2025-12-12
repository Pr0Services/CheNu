"""
CHE·NU Unified - Main API
═══════════════════════════════════════════════════════════════════════════════
API FastAPI principale combinant v6 (Integrations) + v7 (Agents) + v8 (Multi-LLM).

Endpoints:
- /api/v1/chat - Interface de chat avec Nova
- /api/v1/tasks - Gestion des tâches
- /api/v1/agents - Liste et infos des agents
- /api/v1/routing - Analyse de routage
- /api/v1/integrations - Intégrations tierces
- /api/v1/workspaces - Workspaces virtuels

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from datetime import datetime
import os
import logging
import asyncio

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Schemas
from .schemas.task_schema import (
    Task, TaskInput, TaskContext, TaskResult, TaskStatus,
    CreateTaskRequest, TaskResponse, Department
)
from .schemas.message_schema import (
    MessageInput, ChatRequest, ChatResponse, Conversation
)

# Core
from .core.llm_router import LLMRouter, get_llm_router
from .core.master_mind import MasterMind, create_master_mind, MasterMindConfig
from .core.routing_engine import RoutingEngine, DEPARTMENT_KEYWORDS, AGENT_HIERARCHY

# Agents
from .agents.registry import AgentRegistry, get_registry, initialize_chenu_agents
from .agents.nova import Nova, create_nova

# Integration endpoints
from .integration_endpoints import router as integrations_router

# OAuth endpoints
try:
    from .oauth_endpoints import router as oauth_router
except ImportError:
    oauth_router = None

# WebSocket notifications
try:
    from .websocket_notifications import router as ws_router
except ImportError:
    ws_router = None
    ws_router = None
    notifications_router = None

logger = logging.getLogger("CHE·NU.API")


# ═══════════════════════════════════════════════════════════════════════════════
# APP CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="CHE·NU API",
    description="Plateforme de gestion de construction avec agents IA",
    version="8.0.0",
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
# APP STATE
# ═══════════════════════════════════════════════════════════════════════════════

class AppState:
    """État global de l'application."""
    llm_router: Optional[LLMRouter] = None
    agent_registry: Optional[AgentRegistry] = None
    master_mind: Optional[MasterMind] = None
    nova: Optional[Nova] = None
    initialized: bool = False
    
    @classmethod
    def initialize(cls) -> None:
        """Initialise tous les composants."""
        if cls.initialized:
            return
        
        logger.info("🚀 Initializing CHE·NU v8.0...")
        
        # 1. LLM Router
        cls.llm_router = get_llm_router()
        logger.info("✅ LLM Router initialized")
        
        # 2. Agent Registry
        cls.agent_registry = get_registry()
        initialize_chenu_agents(cls.agent_registry, cls.llm_router)
        logger.info(f"✅ Agent Registry initialized ({cls.agent_registry.count()} agents)")
        
        # 3. Master Mind
        cls.master_mind = create_master_mind(
            llm_client=cls.llm_router,
            agent_registry=cls.agent_registry
        )
        logger.info("✅ Master Mind initialized")
        
        # 4. Nova
        cls.nova = create_nova(
            llm_client=cls.llm_router,
            master_mind=cls.master_mind
        )
        logger.info("✅ Nova initialized")
        
        cls.initialized = True
        logger.info("🎉 CHE·NU v8.0 ready!")
    
    @classmethod
    def shutdown(cls) -> None:
        """Arrête proprement les composants."""
        if cls.master_mind:
            cls.master_mind.shutdown()
        if cls.agent_registry:
            cls.agent_registry.shutdown()
        cls.initialized = False


# Dependency
def get_app_state() -> AppState:
    if not AppState.initialized:
        AppState.initialize()
    return AppState


def get_master_mind() -> MasterMind:
    state = get_app_state()
    return state.master_mind


def get_nova() -> Nova:
    state = get_app_state()
    return state.nova


# ═══════════════════════════════════════════════════════════════════════════════
# LIFECYCLE
# ═══════════════════════════════════════════════════════════════════════════════

@app.on_event("startup")
async def startup_event():
    """Initialisation au démarrage."""
    AppState.initialize()


@app.on_event("shutdown")
async def shutdown_event():
    """Nettoyage à l'arrêt."""
    AppState.shutdown()


# Include integration data endpoints (for frontend live data)
app.include_router(integrations_router)

# Include OAuth endpoints
if oauth_router:
    app.include_router(oauth_router)

# Include WebSocket endpoints
if ws_router:
    app.include_router(ws_router)


# ═══════════════════════════════════════════════════════════════════════════════
# HEALTH & INFO
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint."""
    return {
        "name": "CHE·NU API",
        "version": "8.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    state = get_app_state()
    return {
        "status": "healthy" if state.initialized else "initializing",
        "timestamp": datetime.utcnow().isoformat(),
        "components": {
            "llm_router": state.llm_router is not None,
            "agent_registry": state.agent_registry is not None,
            "master_mind": state.master_mind is not None,
            "nova": state.nova is not None
        }
    }


@app.get("/api/v1/info", tags=["Info"])
async def get_info():
    """Informations sur l'API."""
    state = get_app_state()
    
    return {
        "version": "8.0.0",
        "name": "CHE·NU Unified",
        "features": [
            "Multi-LLM (Claude, GPT-4, Gemini, etc.)",
            "Agents hiérarchiques (Nova → MasterMind → Directors → Specialists)",
            "60+ intégrations tierces",
            "Workspaces virtuels"
        ],
        "llm": {
            "providers": state.llm_router.get_available_models() if state.llm_router else {},
            "stats": state.llm_router.get_statistics() if state.llm_router else {}
        },
        "agents": {
            "total": state.agent_registry.count() if state.agent_registry else 0,
            "departments": list(DEPARTMENT_KEYWORDS.keys())
        }
    }


# ═══════════════════════════════════════════════════════════════════════════════
# CHAT ENDPOINTS (Nova)
# ═══════════════════════════════════════════════════════════════════════════════

class ChatInput(BaseModel):
    """Input pour le chat."""
    message: str = Field(..., min_length=1, max_length=100000)
    user_id: str = Field(default="user_default")
    conversation_id: Optional[str] = None
    workspace: str = "bureau"
    stream: bool = False


@app.post("/api/v1/chat", response_model=ChatResponse, tags=["Chat"])
async def chat_with_nova(
    request: ChatInput,
    nova: Nova = Depends(get_nova)
):
    """
    💬 Chat avec Nova - Agent Personnel Universel
    
    Nova comprend le contexte et délègue au MasterMind si nécessaire.
    """
    try:
        result = await nova.process_message(
            message=request.message,
            user_id=request.user_id,
            conversation_id=request.conversation_id,
            workspace=request.workspace
        )
        
        return ChatResponse(
            message_id=result.get("message_id", ""),
            conversation_id=result.get("conversation_id", request.conversation_id or "new"),
            content=result.get("response", ""),
            type="text",
            agent_id="NOVA_001",
            agent_name="Nova",
            tokens_used=result.get("tokens_used", 0),
            duration_ms=result.get("duration_ms", 0)
        )
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# TASK ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/api/v1/tasks", response_model=TaskResponse, tags=["Tasks"])
async def create_task(
    request: CreateTaskRequest,
    background_tasks: BackgroundTasks,
    master_mind: MasterMind = Depends(get_master_mind)
):
    """
    📋 Créer et exécuter une tâche
    
    La tâche est routée automatiquement vers le bon département/agent.
    """
    try:
        result = await master_mind.process_request(
            request=request.description,
            user_id=request.user_id,
            project_id=request.project_id,
            company_id=request.company_id,
            options=request.options
        )
        
        return TaskResponse(
            task_id=result.get("task_id", ""),
            trace_id=result.get("trace_id", ""),
            status=TaskStatus.COMPLETED if result.get("success") else TaskStatus.FAILED,
            result=TaskResult(
                task_id=result.get("task_id", ""),
                trace_id=result.get("trace_id", ""),
                success=result.get("success", False),
                output={"content": result.get("output")},
                summary=result.get("output", "")[:200] if result.get("output") else None,
                department=result.get("department"),
                agents_used=result.get("agents_used", [])
            ),
            department=result.get("department"),
            agents_used=result.get("agents_used", []),
            created_at=datetime.utcnow(),
            completed_at=datetime.utcnow(),
            duration_ms=result.get("metrics", {}).get("duration_seconds", 0) * 1000
        )
        
    except Exception as e:
        logger.error(f"Task error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/tasks/sync", tags=["Tasks"])
async def create_task_sync(
    request: CreateTaskRequest,
    master_mind: MasterMind = Depends(get_master_mind)
):
    """
    📋 Exécution synchrone d'une tâche (attend le résultat complet)
    """
    return await create_task(request, BackgroundTasks(), master_mind)


@app.get("/api/v1/tasks/active", tags=["Tasks"])
async def get_active_tasks(
    master_mind: MasterMind = Depends(get_master_mind)
):
    """Liste les tâches actives."""
    return {
        "tasks": master_mind.get_active_tasks(),
        "count": len(master_mind.get_active_tasks())
    }


@app.get("/api/v1/tasks/stats", tags=["Tasks"])
async def get_task_stats(
    master_mind: MasterMind = Depends(get_master_mind)
):
    """Statistiques des tâches."""
    return master_mind.get_statistics()


# ═══════════════════════════════════════════════════════════════════════════════
# AGENT ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/v1/agents", tags=["Agents"])
async def list_agents():
    """
    🤖 Liste tous les agents disponibles
    """
    state = get_app_state()
    if not state.agent_registry:
        return {"agents": [], "total": 0}
    
    stats = state.agent_registry.get_statistics()
    return {
        "agents": stats.get("agent_details", []),
        "total": stats.get("total_agents", 0),
        "by_level": stats.get("by_level", {}),
        "by_department": stats.get("by_department", {})
    }


@app.get("/api/v1/agents/departments", tags=["Agents"])
async def list_departments():
    """Liste les départements et leurs agents."""
    return {
        "departments": AGENT_HIERARCHY
    }


@app.get("/api/v1/agents/{agent_id}", tags=["Agents"])
async def get_agent(agent_id: str):
    """Récupère les détails d'un agent."""
    state = get_app_state()
    if not state.agent_registry:
        raise HTTPException(status_code=404, detail="Registry not initialized")
    
    agent = state.agent_registry.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
    
    return agent.to_dict()


@app.get("/api/v1/agents/map", tags=["Agents"])
async def get_agents_map():
    """
    🗺️ Carte complète des agents avec hiérarchie
    """
    state = get_app_state()
    if not state.agent_registry:
        return {"stats": {}, "hierarchy": {}, "agents": []}
    
    stats = state.agent_registry.get_statistics()
    
    return {
        "stats": stats,
        "hierarchy": AGENT_HIERARCHY,
        "agents": stats.get("agent_details", [])
    }


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTING ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

class RoutingAnalysisRequest(BaseModel):
    """Requête d'analyse de routage."""
    description: str = Field(..., min_length=1)
    use_llm: bool = False


@app.post("/api/v1/routing/analyze", tags=["Routing"])
async def analyze_routing(
    request: RoutingAnalysisRequest,
    master_mind: MasterMind = Depends(get_master_mind)
):
    """
    🔀 Analyse le routage pour une requête
    
    Détermine le meilleur département et agent pour traiter la requête.
    """
    try:
        result = master_mind.routing_engine.route(request.description)
        
        return {
            "department": result.department,
            "agent_id": result.agent_id,
            "agent_name": result.agent_name,
            "confidence": result.confidence,
            "matched_keywords": result.matched_keywords,
            "is_multi_department": result.is_multi_department,
            "secondary_departments": result.secondary_departments,
            "reasoning": result.reasoning,
            "method": result.method
        }
        
    except Exception as e:
        logger.error(f"Routing analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# LLM ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/v1/llm/providers", tags=["LLM"])
async def get_llm_providers():
    """Liste les providers LLM disponibles."""
    state = get_app_state()
    if not state.llm_router:
        return {"providers": {}}
    
    return {
        "providers": state.llm_router.get_available_models(),
        "stats": state.llm_router.get_statistics()
    }


@app.get("/api/v1/llm/stats", tags=["LLM"])
async def get_llm_stats():
    """Statistiques d'utilisation des LLM."""
    state = get_app_state()
    if not state.llm_router:
        return {}
    
    return state.llm_router.get_statistics()


# ═══════════════════════════════════════════════════════════════════════════════
# INTEGRATIONS ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/v1/integrations", tags=["Integrations"])
async def list_integrations():
    """
    🔌 Liste toutes les intégrations disponibles
    """
    from .services.integrations import PROVIDER_REGISTRY
    
    providers = []
    for provider, info in PROVIDER_REGISTRY.items():
        providers.append({
            "id": provider.value,
            "name": info.name,
            "category": info.category.value,
            "icon": info.icon,
            "description": info.description,
            "features": info.features,
            "auth_type": info.auth_type
        })
    
    return {
        "providers": providers,
        "total": len(providers),
        "categories": list(set(p["category"] for p in providers))
    }


@app.get("/api/v1/integrations/{category}", tags=["Integrations"])
async def list_integrations_by_category(category: str):
    """Liste les intégrations d'une catégorie."""
    from .services.integrations import PROVIDER_REGISTRY, IntegrationCategory
    
    try:
        cat = IntegrationCategory(category)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid category: {category}")
    
    providers = [
        {
            "id": p.value,
            "name": info.name,
            "icon": info.icon,
            "description": info.description,
            "features": info.features
        }
        for p, info in PROVIDER_REGISTRY.items()
        if info.category == cat
    ]
    
    return {"category": category, "providers": providers, "total": len(providers)}


# ═══════════════════════════════════════════════════════════════════════════════
# PROJECT PLANNING ENDPOINT (v8)
# ═══════════════════════════════════════════════════════════════════════════════

class ProjectPlanRequest(BaseModel):
    """Requête de planification de projet."""
    description: str = Field(..., min_length=5, max_length=20000)
    project_id: Optional[str] = None
    company_id: Optional[str] = None
    options: Dict[str, Any] = Field(default_factory=dict)


@app.post("/api/v1/projects/plan", tags=["Projects"])
async def plan_project_workflow(
    request: ProjectPlanRequest,
    user_id: str = Query(...),
    master_mind: MasterMind = Depends(get_master_mind)
):
    """
    📊 Planifie un workflow complet pour un projet
    
    Utilise MasterMind + RoutingEngine + TaskDecomposer + ExecutionPlanner.
    """
    try:
        # 1) Routage
        routing_result = master_mind.routing_engine.route(request.description)
        
        # 2) Décomposition
        decomposition = await master_mind.task_decomposer.decompose(
            request={"description": request.description},
            routing_result=routing_result.to_dict()
        )
        
        # 3) Plan d'exécution
        plan = master_mind.execution_planner.create_plan(
            task_id=decomposition.task_id,
            trace_id=f"trace_{decomposition.task_id}",
            subtasks=decomposition.subtasks,
            options={"project_id": request.project_id}
        )
        
        # 4) Visualisation
        visualization = master_mind.execution_planner.visualize_plan(plan)
        
        return {
            "task_id": decomposition.task_id,
            "routing": routing_result.to_dict(),
            "decomposition": decomposition.to_dict(),
            "execution_plan": plan.to_dict(),
            "visualization": visualization
        }
        
    except Exception as e:
        logger.error(f"Project planning error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# ERROR HANDLERS
# ═══════════════════════════════════════════════════════════════════════════════

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "timestamp": datetime.utcnow().isoformat()
        }
    )


# ═══════════════════════════════════════════════════════════════════════════════
# RUN
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.api.main_api:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
