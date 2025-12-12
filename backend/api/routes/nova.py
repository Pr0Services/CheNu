"""
CHE·NU Backend - Nova AI Routes
===============================
Nova AI assistant endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from uuid import uuid4

router = APIRouter()


# ─────────────────────────────────────────────────────
# SCHEMAS
# ─────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: datetime
    agents_used: List[str] = []


class AgentInfo(BaseModel):
    id: str
    name: str
    role: str
    level: str  # L0, L1, L2, L3
    department: str
    status: str
    capabilities: List[str]


# ─────────────────────────────────────────────────────
# MOCK DATA - Nova Agents
# ─────────────────────────────────────────────────────

NOVA_AGENTS = [
    {"id": "nova_master", "name": "Nova", "role": "Orchestrateur Principal", "level": "L0", "department": "Core", "status": "active", "capabilities": ["coordination", "routing", "synthesis"]},
    {"id": "agent_estimator", "name": "Évaluateur", "role": "Estimation de coûts", "level": "L1", "department": "Finance", "status": "active", "capabilities": ["cost_estimation", "budgeting", "forecasting"]},
    {"id": "agent_planner", "name": "Planificateur", "role": "Gestion de projet", "level": "L1", "department": "Operations", "status": "active", "capabilities": ["scheduling", "resource_allocation", "timeline"]},
    {"id": "agent_safety", "name": "Inspecteur Sécurité", "role": "Conformité CNESST", "level": "L2", "department": "Compliance", "status": "active", "capabilities": ["safety_check", "cnesst_compliance", "risk_assessment"]},
    {"id": "agent_rbq", "name": "Agent RBQ", "role": "Conformité RBQ", "level": "L2", "department": "Compliance", "status": "active", "capabilities": ["license_verification", "permit_check", "regulation_compliance"]},
    {"id": "agent_ccq", "name": "Agent CCQ", "role": "Conformité CCQ", "level": "L2", "department": "Compliance", "status": "active", "capabilities": ["card_verification", "jurisdiction_check", "labor_compliance"]},
    {"id": "agent_documents", "name": "Archiviste", "role": "Gestion documentaire", "level": "L2", "department": "Operations", "status": "active", "capabilities": ["document_management", "search", "indexing"]},
    {"id": "agent_analytics", "name": "Analyste", "role": "Analyse de données", "level": "L2", "department": "Intelligence", "status": "active", "capabilities": ["data_analysis", "reporting", "insights"]},
]

_conversations: dict = {}


# ─────────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def chat_with_nova(request: ChatRequest):
    """Chat with Nova AI assistant."""
    conversation_id = request.conversation_id or f"conv_{uuid4().hex[:8]}"
    
    # Store conversation
    if conversation_id not in _conversations:
        _conversations[conversation_id] = []
    
    _conversations[conversation_id].append({
        "role": "user",
        "content": request.message,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    # Generate response (mock - in production, call LLM)
    response_text = _generate_nova_response(request.message, request.context)
    
    _conversations[conversation_id].append({
        "role": "nova",
        "content": response_text,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    return ChatResponse(
        response=response_text,
        conversation_id=conversation_id,
        timestamp=datetime.utcnow(),
        agents_used=["nova_master"]
    )


@router.get("/agents", response_model=List[AgentInfo])
async def get_agents():
    """Get all available Nova agents."""
    return NOVA_AGENTS


@router.get("/agents/{agent_id}", response_model=AgentInfo)
async def get_agent(agent_id: str):
    """Get a specific agent."""
    for agent in NOVA_AGENTS:
        if agent["id"] == agent_id:
            return agent
    raise HTTPException(status_code=404, detail="Agent not found")


@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get conversation history."""
    if conversation_id not in _conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"conversation_id": conversation_id, "messages": _conversations[conversation_id]}


def _generate_nova_response(message: str, context: Optional[dict]) -> str:
    """Generate Nova response (mock implementation)."""
    message_lower = message.lower()
    
    if "bonjour" in message_lower or "salut" in message_lower:
        return "Bonjour! Je suis Nova, votre assistante IA pour CHE·NU. Comment puis-je vous aider aujourd'hui?"
    
    if "projet" in message_lower:
        return "Je peux vous aider avec la gestion de projets. Voulez-vous créer un nouveau projet, voir vos projets existants, ou obtenir un rapport de progression?"
    
    if "devis" in message_lower or "estimation" in message_lower:
        return "Je peux générer une estimation pour vous. Pourriez-vous me donner plus de détails sur le projet: type de travaux, superficie, et localisation?"
    
    if "sécurité" in message_lower or "cnesst" in message_lower:
        return "Je peux vous aider avec les questions de sécurité et conformité CNESST. Avez-vous besoin de vérifier une fiche de sécurité, signaler un incident, ou consulter les réglementations?"
    
    if "rbq" in message_lower or "licence" in message_lower:
        return "Je peux vérifier les licences RBQ. Voulez-vous valider une licence d'entrepreneur ou consulter les exigences pour un type de travaux spécifique?"
    
    return f"J'ai bien reçu votre message. Comment puis-je vous aider concernant: '{message[:50]}...'?"
