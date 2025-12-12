"""
CHE·NU Backend - IA Laboratory Routes
=====================================

API endpoints for the AI Laboratory.
- Model configuration
- Agent testing
- Prompt management
- Metrics and monitoring
"""

from typing import List, Dict, Optional, Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from datetime import datetime
from uuid import uuid4
import time

router = APIRouter()


# ═══════════════════════════════════════════════════════════════════════════════
# SCHEMAS
# ═══════════════════════════════════════════════════════════════════════════════

class LLMModel(BaseModel):
    id: str
    name: str
    provider: str
    context_window: int
    max_tokens: int
    cost_per_1k_input: float
    cost_per_1k_output: float
    capabilities: List[str]
    enabled: bool = True


class LLMProvider(BaseModel):
    id: str
    name: str
    icon: str
    enabled: bool
    api_key_configured: bool
    models: List[LLMModel]


class LabSettings(BaseModel):
    temperature: float = 0.7
    max_tokens: int = 2048
    top_p: float = 0.9
    frequency_penalty: float = 0
    presence_penalty: float = 0
    stop_sequences: List[str] = []
    stream_response: bool = True


class ChatRequest(BaseModel):
    message: str
    model: str = "claude-3-sonnet"
    agent_id: Optional[str] = None
    system_prompt: Optional[str] = None
    settings: Optional[LabSettings] = None
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    id: str
    role: str
    content: str
    model: str
    agent_id: Optional[str]
    tokens: Dict[str, int]
    latency_ms: int
    timestamp: datetime


class PromptTemplate(BaseModel):
    id: str
    name: str
    description: str
    prompt: str
    category: str
    tags: List[str] = []
    created_at: datetime
    usage_count: int = 0


class AgentTestResult(BaseModel):
    agent_id: str
    test_input: str
    response: str
    success: bool
    latency_ms: int
    tokens_used: int
    timestamp: datetime


class LabMetrics(BaseModel):
    total_requests: int
    total_tokens: Dict[str, int]
    total_cost: float
    avg_latency_ms: float
    requests_by_model: Dict[str, int]
    requests_by_agent: Dict[str, int]


# ═══════════════════════════════════════════════════════════════════════════════
# IN-MEMORY STORAGE
# ═══════════════════════════════════════════════════════════════════════════════

_conversations: Dict[str, List[Dict]] = {}
_prompt_templates: Dict[str, PromptTemplate] = {}
_metrics: LabMetrics = LabMetrics(
    total_requests=0,
    total_tokens={"input": 0, "output": 0},
    total_cost=0.0,
    avg_latency_ms=0.0,
    requests_by_model={},
    requests_by_agent={},
)

# Pre-populate prompt templates
DEFAULT_TEMPLATES = [
    PromptTemplate(
        id="devis",
        name="📊 Générateur de Devis",
        description="Génère un devis détaillé pour un projet de construction",
        prompt="Génère un devis détaillé pour un projet de rénovation incluant: matériaux, main d'œuvre, et délais estimés.",
        category="finance",
        tags=["devis", "estimation", "coûts"],
        created_at=datetime.utcnow(),
        usage_count=42,
    ),
    PromptTemplate(
        id="compliance",
        name="✅ Vérification Conformité",
        description="Vérifie la conformité RBQ et CNESST",
        prompt="Vérifie la conformité RBQ et CNESST pour un projet de construction résidentielle au Québec.",
        category="compliance",
        tags=["rbq", "cnesst", "conformité"],
        created_at=datetime.utcnow(),
        usage_count=38,
    ),
    PromptTemplate(
        id="planning",
        name="📅 Planification Projet",
        description="Crée un planning de projet détaillé",
        prompt="Crée un planning de projet détaillé sur 12 semaines pour une construction résidentielle.",
        category="operations",
        tags=["planning", "calendrier", "projet"],
        created_at=datetime.utcnow(),
        usage_count=27,
    ),
    PromptTemplate(
        id="analyse",
        name="📈 Analyse de Coûts",
        description="Analyse les coûts et identifie les économies",
        prompt="Analyse les coûts d'un projet et identifie les opportunités d'économies potentielles.",
        category="finance",
        tags=["analyse", "coûts", "optimisation"],
        created_at=datetime.utcnow(),
        usage_count=19,
    ),
    PromptTemplate(
        id="rapport",
        name="📝 Rapport de Chantier",
        description="Rédige un rapport de chantier professionnel",
        prompt="Rédige un rapport de chantier hebdomadaire professionnel incluant: avancement, problèmes, et prochaines étapes.",
        category="documentation",
        tags=["rapport", "chantier", "documentation"],
        created_at=datetime.utcnow(),
        usage_count=55,
    ),
]

for template in DEFAULT_TEMPLATES:
    _prompt_templates[template.id] = template


# ═══════════════════════════════════════════════════════════════════════════════
# PROVIDERS ENDPOINT
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/providers", response_model=List[LLMProvider])
async def get_providers():
    """Get all configured LLM providers."""
    return [
        LLMProvider(
            id="anthropic",
            name="Anthropic",
            icon="🟣",
            enabled=True,
            api_key_configured=True,
            models=[
                LLMModel(id="claude-3-opus", name="Claude 3 Opus", provider="anthropic", context_window=200000, max_tokens=4096, cost_per_1k_input=0.015, cost_per_1k_output=0.075, capabilities=["vision", "code", "analysis"]),
                LLMModel(id="claude-3-sonnet", name="Claude 3 Sonnet", provider="anthropic", context_window=200000, max_tokens=4096, cost_per_1k_input=0.003, cost_per_1k_output=0.015, capabilities=["vision", "code", "analysis"]),
                LLMModel(id="claude-3-haiku", name="Claude 3 Haiku", provider="anthropic", context_window=200000, max_tokens=4096, cost_per_1k_input=0.00025, cost_per_1k_output=0.00125, capabilities=["code", "fast"]),
            ],
        ),
        LLMProvider(
            id="openai",
            name="OpenAI",
            icon="🟢",
            enabled=True,
            api_key_configured=False,
            models=[
                LLMModel(id="gpt-4-turbo", name="GPT-4 Turbo", provider="openai", context_window=128000, max_tokens=4096, cost_per_1k_input=0.01, cost_per_1k_output=0.03, capabilities=["vision", "code", "functions"]),
                LLMModel(id="gpt-4", name="GPT-4", provider="openai", context_window=8192, max_tokens=4096, cost_per_1k_input=0.03, cost_per_1k_output=0.06, capabilities=["code", "analysis"]),
                LLMModel(id="gpt-3.5-turbo", name="GPT-3.5 Turbo", provider="openai", context_window=16385, max_tokens=4096, cost_per_1k_input=0.0005, cost_per_1k_output=0.0015, capabilities=["fast", "code"]),
            ],
        ),
        LLMProvider(
            id="google",
            name="Google",
            icon="🔵",
            enabled=True,
            api_key_configured=False,
            models=[
                LLMModel(id="gemini-pro", name="Gemini Pro", provider="google", context_window=32000, max_tokens=8192, cost_per_1k_input=0.00025, cost_per_1k_output=0.0005, capabilities=["vision", "code"]),
                LLMModel(id="gemini-ultra", name="Gemini Ultra", provider="google", context_window=32000, max_tokens=8192, cost_per_1k_input=0.001, cost_per_1k_output=0.002, capabilities=["vision", "code", "analysis"]),
            ],
        ),
        LLMProvider(
            id="ollama",
            name="Ollama (Local)",
            icon="🦙",
            enabled=True,
            api_key_configured=True,
            models=[
                LLMModel(id="llama3", name="Llama 3 70B", provider="ollama", context_window=8192, max_tokens=4096, cost_per_1k_input=0, cost_per_1k_output=0, capabilities=["code", "local"]),
                LLMModel(id="mixtral", name="Mixtral 8x7B", provider="ollama", context_window=32000, max_tokens=4096, cost_per_1k_input=0, cost_per_1k_output=0, capabilities=["code", "local"]),
                LLMModel(id="codellama", name="Code Llama", provider="ollama", context_window=16000, max_tokens=4096, cost_per_1k_input=0, cost_per_1k_output=0, capabilities=["code", "local"]),
            ],
        ),
    ]


# ═══════════════════════════════════════════════════════════════════════════════
# CHAT ENDPOINT
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/chat", response_model=ChatResponse)
async def lab_chat(request: ChatRequest):
    """
    Send a message to the lab playground.
    
    Supports multiple models and optional agent context.
    """
    global _metrics
    
    start_time = time.time()
    
    # Simulate processing
    import asyncio
    await asyncio.sleep(0.5 + (0.5 * (request.settings.temperature if request.settings else 0.7)))
    
    latency_ms = int((time.time() - start_time) * 1000)
    input_tokens = len(request.message.split()) * 2
    output_tokens = 150 + (50 if request.agent_id else 0)
    
    # Generate response based on context
    if request.agent_id:
        response_content = f"[Agent {request.agent_id}]\n\nJe comprends votre demande. Voici mon analyse basée sur mon expertise..."
    else:
        response_content = "Voici ma réponse à votre requête. Je peux vous aider avec des aspects spécifiques si nécessaire."
    
    # Update metrics
    _metrics.total_requests += 1
    _metrics.total_tokens["input"] += input_tokens
    _metrics.total_tokens["output"] += output_tokens
    _metrics.avg_latency_ms = (_metrics.avg_latency_ms + latency_ms) / 2
    _metrics.requests_by_model[request.model] = _metrics.requests_by_model.get(request.model, 0) + 1
    if request.agent_id:
        _metrics.requests_by_agent[request.agent_id] = _metrics.requests_by_agent.get(request.agent_id, 0) + 1
    
    # Store in conversation
    conv_id = request.conversation_id or str(uuid4())
    if conv_id not in _conversations:
        _conversations[conv_id] = []
    
    response = ChatResponse(
        id=f"msg_{uuid4().hex[:8]}",
        role="assistant",
        content=response_content,
        model=request.model,
        agent_id=request.agent_id,
        tokens={"input": input_tokens, "output": output_tokens},
        latency_ms=latency_ms,
        timestamp=datetime.utcnow(),
    )
    
    _conversations[conv_id].append(response.model_dump())
    
    return response


# ═══════════════════════════════════════════════════════════════════════════════
# PROMPT TEMPLATES
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/prompts", response_model=List[PromptTemplate])
async def get_prompt_templates(category: Optional[str] = None):
    """Get all prompt templates, optionally filtered by category."""
    templates = list(_prompt_templates.values())
    if category:
        templates = [t for t in templates if t.category == category]
    return sorted(templates, key=lambda x: x.usage_count, reverse=True)


@router.post("/prompts", response_model=PromptTemplate)
async def create_prompt_template(
    name: str,
    prompt: str,
    description: str = "",
    category: str = "general",
    tags: List[str] = [],
):
    """Create a new prompt template."""
    template_id = f"custom_{uuid4().hex[:8]}"
    template = PromptTemplate(
        id=template_id,
        name=name,
        description=description,
        prompt=prompt,
        category=category,
        tags=tags,
        created_at=datetime.utcnow(),
        usage_count=0,
    )
    _prompt_templates[template_id] = template
    return template


@router.post("/prompts/{template_id}/use")
async def use_prompt_template(template_id: str):
    """Increment usage count for a template."""
    if template_id not in _prompt_templates:
        raise HTTPException(status_code=404, detail="Template not found")
    
    _prompt_templates[template_id].usage_count += 1
    return {"success": True}


@router.delete("/prompts/{template_id}")
async def delete_prompt_template(template_id: str):
    """Delete a custom prompt template."""
    if template_id not in _prompt_templates:
        raise HTTPException(status_code=404, detail="Template not found")
    
    if not template_id.startswith("custom_"):
        raise HTTPException(status_code=400, detail="Cannot delete default templates")
    
    del _prompt_templates[template_id]
    return {"success": True}


# ═══════════════════════════════════════════════════════════════════════════════
# AGENT TESTING
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/agents/{agent_id}/test", response_model=AgentTestResult)
async def test_agent(agent_id: str, test_input: str):
    """Test an agent with a specific input."""
    start_time = time.time()
    
    # Simulate agent processing
    import asyncio
    await asyncio.sleep(0.8)
    
    latency_ms = int((time.time() - start_time) * 1000)
    
    return AgentTestResult(
        agent_id=agent_id,
        test_input=test_input,
        response=f"Agent {agent_id} response to: {test_input[:50]}...",
        success=True,
        latency_ms=latency_ms,
        tokens_used=len(test_input.split()) * 3,
        timestamp=datetime.utcnow(),
    )


# ═══════════════════════════════════════════════════════════════════════════════
# METRICS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/metrics", response_model=LabMetrics)
async def get_lab_metrics():
    """Get laboratory usage metrics."""
    return _metrics


@router.post("/metrics/reset")
async def reset_metrics():
    """Reset all metrics."""
    global _metrics
    _metrics = LabMetrics(
        total_requests=0,
        total_tokens={"input": 0, "output": 0},
        total_cost=0.0,
        avg_latency_ms=0.0,
        requests_by_model={},
        requests_by_agent={},
    )
    return {"success": True}


# ═══════════════════════════════════════════════════════════════════════════════
# CONVERSATIONS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get a conversation by ID."""
    if conversation_id not in _conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return _conversations[conversation_id]


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """Delete a conversation."""
    if conversation_id in _conversations:
        del _conversations[conversation_id]
    return {"success": True}
