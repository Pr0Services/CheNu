"""
CHE·NU Unified - LLM Router Multi-Provider
═══════════════════════════════════════════════════════════════════════════════
Router intelligent pour gérer plusieurs providers LLM avec fallback automatique.

Providers supportés:
- Anthropic (Claude)
- OpenAI (GPT-4)
- Google (Gemini)
- Cohere
- DeepSeek
- Ollama (Local)
- Mistral

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Tuple, Union
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import logging
import os
import asyncio
import time

logger = logging.getLogger("CHE·NU.Core.LLMRouter")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS & CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

class LLMProvider(str, Enum):
    """Providers LLM supportés."""
    ANTHROPIC = "anthropic"
    OPENAI = "openai"
    GOOGLE = "google"
    COHERE = "cohere"
    DEEPSEEK = "deepseek"
    MISTRAL = "mistral"
    OLLAMA = "ollama"


# Modèles par provider avec leurs caractéristiques
MODEL_REGISTRY: Dict[LLMProvider, Dict[str, Dict[str, Any]]] = {
    LLMProvider.ANTHROPIC: {
        "claude-sonnet-4-20250514": {
            "context_window": 200000,
            "max_output": 8192,
            "cost_input": 0.003,
            "cost_output": 0.015,
            "capabilities": ["code", "analysis", "creative", "vision"],
            "speed": "fast"
        },
        "claude-opus-4-20250514": {
            "context_window": 200000,
            "max_output": 8192,
            "cost_input": 0.015,
            "cost_output": 0.075,
            "capabilities": ["code", "analysis", "creative", "vision", "complex_reasoning"],
            "speed": "medium"
        },
        "claude-haiku-4-20250514": {
            "context_window": 200000,
            "max_output": 8192,
            "cost_input": 0.00025,
            "cost_output": 0.00125,
            "capabilities": ["code", "analysis"],
            "speed": "very_fast"
        }
    },
    LLMProvider.OPENAI: {
        "gpt-4o": {
            "context_window": 128000,
            "max_output": 4096,
            "cost_input": 0.005,
            "cost_output": 0.015,
            "capabilities": ["code", "analysis", "creative", "vision"],
            "speed": "fast"
        },
        "gpt-4o-mini": {
            "context_window": 128000,
            "max_output": 4096,
            "cost_input": 0.00015,
            "cost_output": 0.0006,
            "capabilities": ["code", "analysis"],
            "speed": "very_fast"
        },
        "o1": {
            "context_window": 200000,
            "max_output": 100000,
            "cost_input": 0.015,
            "cost_output": 0.060,
            "capabilities": ["code", "analysis", "complex_reasoning", "math"],
            "speed": "slow"
        },
        "o1-mini": {
            "context_window": 128000,
            "max_output": 65536,
            "cost_input": 0.003,
            "cost_output": 0.012,
            "capabilities": ["code", "math", "reasoning"],
            "speed": "medium"
        }
    },
    LLMProvider.GOOGLE: {
        "gemini-1.5-pro": {
            "context_window": 2000000,
            "max_output": 8192,
            "cost_input": 0.00125,
            "cost_output": 0.005,
            "capabilities": ["code", "analysis", "creative", "vision", "long_context"],
            "speed": "fast"
        },
        "gemini-1.5-flash": {
            "context_window": 1000000,
            "max_output": 8192,
            "cost_input": 0.000075,
            "cost_output": 0.0003,
            "capabilities": ["code", "analysis"],
            "speed": "very_fast"
        },
        "gemini-2.0-flash": {
            "context_window": 1000000,
            "max_output": 8192,
            "cost_input": 0.0001,
            "cost_output": 0.0004,
            "capabilities": ["code", "analysis", "vision", "realtime"],
            "speed": "very_fast"
        }
    },
    LLMProvider.DEEPSEEK: {
        "deepseek-chat": {
            "context_window": 64000,
            "max_output": 4096,
            "cost_input": 0.00014,
            "cost_output": 0.00028,
            "capabilities": ["code", "analysis"],
            "speed": "fast"
        },
        "deepseek-coder": {
            "context_window": 64000,
            "max_output": 4096,
            "cost_input": 0.00014,
            "cost_output": 0.00028,
            "capabilities": ["code"],
            "speed": "fast"
        }
    },
    LLMProvider.MISTRAL: {
        "mistral-large": {
            "context_window": 128000,
            "max_output": 4096,
            "cost_input": 0.002,
            "cost_output": 0.006,
            "capabilities": ["code", "analysis", "creative"],
            "speed": "fast"
        },
        "codestral": {
            "context_window": 32000,
            "max_output": 4096,
            "cost_input": 0.001,
            "cost_output": 0.003,
            "capabilities": ["code"],
            "speed": "fast"
        }
    },
    LLMProvider.OLLAMA: {
        "llama3.1:70b": {
            "context_window": 128000,
            "max_output": 4096,
            "cost_input": 0.0,
            "cost_output": 0.0,
            "capabilities": ["code", "analysis"],
            "speed": "medium"
        },
        "qwen2.5:72b": {
            "context_window": 32000,
            "max_output": 4096,
            "cost_input": 0.0,
            "cost_output": 0.0,
            "capabilities": ["code", "analysis"],
            "speed": "medium"
        }
    }
}

# Mapping tâches -> meilleurs modèles
TASK_MODEL_MAPPING: Dict[str, List[Tuple[LLMProvider, str]]] = {
    "code": [
        (LLMProvider.ANTHROPIC, "claude-sonnet-4-20250514"),
        (LLMProvider.DEEPSEEK, "deepseek-coder"),
        (LLMProvider.OPENAI, "gpt-4o"),
    ],
    "math": [
        (LLMProvider.OPENAI, "o1"),
        (LLMProvider.OPENAI, "o1-mini"),
        (LLMProvider.ANTHROPIC, "claude-opus-4-20250514"),
    ],
    "vision": [
        (LLMProvider.ANTHROPIC, "claude-sonnet-4-20250514"),
        (LLMProvider.OPENAI, "gpt-4o"),
        (LLMProvider.GOOGLE, "gemini-1.5-pro"),
    ],
    "long_context": [
        (LLMProvider.GOOGLE, "gemini-1.5-pro"),
        (LLMProvider.ANTHROPIC, "claude-sonnet-4-20250514"),
    ],
    "fast": [
        (LLMProvider.ANTHROPIC, "claude-haiku-4-20250514"),
        (LLMProvider.GOOGLE, "gemini-1.5-flash"),
        (LLMProvider.OPENAI, "gpt-4o-mini"),
    ],
    "cheap": [
        (LLMProvider.GOOGLE, "gemini-1.5-flash"),
        (LLMProvider.DEEPSEEK, "deepseek-chat"),
        (LLMProvider.OLLAMA, "llama3.1:70b"),
    ],
    "complex_reasoning": [
        (LLMProvider.OPENAI, "o1"),
        (LLMProvider.ANTHROPIC, "claude-opus-4-20250514"),
    ],
    "default": [
        (LLMProvider.ANTHROPIC, "claude-sonnet-4-20250514"),
        (LLMProvider.OPENAI, "gpt-4o"),
        (LLMProvider.GOOGLE, "gemini-1.5-pro"),
    ]
}


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class LLMRequest:
    """Requête vers un LLM."""
    prompt: str
    agent_id: Optional[str] = None
    task_id: Optional[str] = None
    task_type: Optional[str] = None
    
    # Options
    model: Optional[str] = None
    provider: Optional[LLMProvider] = None
    max_tokens: int = 4096
    temperature: float = 0.7
    system_prompt: Optional[str] = None
    
    # Contraintes
    max_cost: Optional[float] = None
    max_latency_ms: Optional[int] = None
    required_capabilities: List[str] = field(default_factory=list)


@dataclass
class LLMResponse:
    """Réponse d'un LLM."""
    content: str
    provider: LLMProvider
    model: str
    
    # Métriques
    input_tokens: int = 0
    output_tokens: int = 0
    latency_ms: int = 0
    cost_usd: float = 0.0
    
    # Metadata
    finish_reason: str = "stop"
    request_id: Optional[str] = None
    cached: bool = False


@dataclass
class ProviderStatus:
    """Status d'un provider."""
    provider: LLMProvider
    available: bool
    models_available: List[str]
    last_check: datetime
    error_count: int = 0
    avg_latency_ms: float = 0.0


# ═══════════════════════════════════════════════════════════════════════════════
# LLM CLIENTS
# ═══════════════════════════════════════════════════════════════════════════════

class BaseLLMClient:
    """Client de base pour les LLM."""
    
    provider: LLMProvider
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self._client = None
    
    async def generate(self, request: LLMRequest) -> LLMResponse:
        raise NotImplementedError


class AnthropicClient(BaseLLMClient):
    """Client Anthropic (Claude)."""
    
    provider = LLMProvider.ANTHROPIC
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        try:
            import anthropic
            self._client = anthropic.Anthropic(api_key=api_key)
            self._async_client = anthropic.AsyncAnthropic(api_key=api_key)
        except ImportError:
            logger.warning("anthropic package not installed")
    
    async def generate(self, request: LLMRequest) -> LLMResponse:
        model = request.model or "claude-sonnet-4-20250514"
        start = time.time()
        
        messages = [{"role": "user", "content": request.prompt}]
        
        response = await self._async_client.messages.create(
            model=model,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            system=request.system_prompt or "",
            messages=messages
        )
        
        latency = int((time.time() - start) * 1000)
        
        # Calculer le coût
        model_info = MODEL_REGISTRY[self.provider].get(model, {})
        cost = (
            response.usage.input_tokens * model_info.get("cost_input", 0) / 1000 +
            response.usage.output_tokens * model_info.get("cost_output", 0) / 1000
        )
        
        return LLMResponse(
            content=response.content[0].text,
            provider=self.provider,
            model=model,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
            latency_ms=latency,
            cost_usd=cost,
            finish_reason=response.stop_reason or "stop",
            request_id=response.id
        )


class OpenAIClient(BaseLLMClient):
    """Client OpenAI (GPT)."""
    
    provider = LLMProvider.OPENAI
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        try:
            import openai
            self._client = openai.AsyncOpenAI(api_key=api_key)
        except ImportError:
            logger.warning("openai package not installed")
    
    async def generate(self, request: LLMRequest) -> LLMResponse:
        model = request.model or "gpt-4o"
        start = time.time()
        
        messages = []
        if request.system_prompt:
            messages.append({"role": "system", "content": request.system_prompt})
        messages.append({"role": "user", "content": request.prompt})
        
        response = await self._client.chat.completions.create(
            model=model,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            messages=messages
        )
        
        latency = int((time.time() - start) * 1000)
        
        model_info = MODEL_REGISTRY[self.provider].get(model, {})
        cost = (
            response.usage.prompt_tokens * model_info.get("cost_input", 0) / 1000 +
            response.usage.completion_tokens * model_info.get("cost_output", 0) / 1000
        )
        
        return LLMResponse(
            content=response.choices[0].message.content,
            provider=self.provider,
            model=model,
            input_tokens=response.usage.prompt_tokens,
            output_tokens=response.usage.completion_tokens,
            latency_ms=latency,
            cost_usd=cost,
            finish_reason=response.choices[0].finish_reason,
            request_id=response.id
        )


class GoogleClient(BaseLLMClient):
    """Client Google (Gemini)."""
    
    provider = LLMProvider.GOOGLE
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            self._genai = genai
        except ImportError:
            logger.warning("google-generativeai package not installed")
    
    async def generate(self, request: LLMRequest) -> LLMResponse:
        model_name = request.model or "gemini-1.5-pro"
        start = time.time()
        
        model = self._genai.GenerativeModel(model_name)
        
        # Sync call wrapped in executor for async
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: model.generate_content(
                request.prompt,
                generation_config={
                    "max_output_tokens": request.max_tokens,
                    "temperature": request.temperature
                }
            )
        )
        
        latency = int((time.time() - start) * 1000)
        
        # Estimate tokens (Gemini doesn't always return this)
        input_tokens = len(request.prompt.split()) * 1.3
        output_tokens = len(response.text.split()) * 1.3
        
        model_info = MODEL_REGISTRY[self.provider].get(model_name, {})
        cost = (
            input_tokens * model_info.get("cost_input", 0) / 1000 +
            output_tokens * model_info.get("cost_output", 0) / 1000
        )
        
        return LLMResponse(
            content=response.text,
            provider=self.provider,
            model=model_name,
            input_tokens=int(input_tokens),
            output_tokens=int(output_tokens),
            latency_ms=latency,
            cost_usd=cost
        )


# ═══════════════════════════════════════════════════════════════════════════════
# LLM ROUTER
# ═══════════════════════════════════════════════════════════════════════════════

class LLMRouter:
    """
    🧠 Router Multi-LLM Intelligent
    
    Fonctionnalités:
    - Sélection automatique du meilleur modèle selon la tâche
    - Fallback automatique si un provider échoue
    - Tracking des coûts et latences
    - Cache des réponses (optionnel)
    """
    
    def __init__(self, database_session: Any = None):
        self.database_session = database_session
        
        # Clients par provider
        self._clients: Dict[LLMProvider, BaseLLMClient] = {}
        self._api_keys: Dict[LLMProvider, Optional[str]] = {}
        
        # Fallback chain par défaut
        self._default_fallback_chain: List[Tuple[str, str]] = [
            ("anthropic", "claude-sonnet-4-20250514"),
            ("openai", "gpt-4o"),
            ("google", "gemini-1.5-pro"),
        ]
        
        # Status des providers
        self._provider_status: Dict[LLMProvider, ProviderStatus] = {}
        
        # Métriques
        self._total_requests = 0
        self._total_tokens = 0
        self._total_cost = 0.0
        
        # Cache simple
        self._cache: Dict[str, LLMResponse] = {}
        self._cache_enabled = True
    
    @classmethod
    def from_env(cls) -> "LLMRouter":
        """
        Factory: initialise un LLMRouter basé sur les variables d'environnement.
        """
        from sqlalchemy import create_engine
        from sqlalchemy.orm import sessionmaker
        
        db_url = os.getenv("CHE·NU_DB_URL")
        
        if db_url:
            engine = create_engine(db_url, pool_pre_ping=True)
            SessionLocal = sessionmaker(bind=engine)
            session = SessionLocal()
        else:
            session = None
        
        router = cls(database_session=session)
        
        # Charger les clés API
        router._api_keys = {
            LLMProvider.ANTHROPIC: os.getenv("ANTHROPIC_API_KEY"),
            LLMProvider.OPENAI: os.getenv("OPENAI_API_KEY"),
            LLMProvider.GOOGLE: os.getenv("GOOGLE_API_KEY"),
            LLMProvider.COHERE: os.getenv("COHERE_API_KEY"),
            LLMProvider.DEEPSEEK: os.getenv("DEEPSEEK_API_KEY"),
            LLMProvider.MISTRAL: os.getenv("MISTRAL_API_KEY"),
        }
        
        # Initialiser les clients disponibles
        router._init_clients()
        
        logger.info(f"🧠 LLMRouter initialized with {len(router._clients)} providers")
        return router
    
    def _init_clients(self) -> None:
        """Initialise les clients pour les providers avec clé API."""
        if self._api_keys.get(LLMProvider.ANTHROPIC):
            self._clients[LLMProvider.ANTHROPIC] = AnthropicClient(
                self._api_keys[LLMProvider.ANTHROPIC]
            )
        
        if self._api_keys.get(LLMProvider.OPENAI):
            self._clients[LLMProvider.OPENAI] = OpenAIClient(
                self._api_keys[LLMProvider.OPENAI]
            )
        
        if self._api_keys.get(LLMProvider.GOOGLE):
            self._clients[LLMProvider.GOOGLE] = GoogleClient(
                self._api_keys[LLMProvider.GOOGLE]
            )
    
    def select_model(
        self,
        task_type: Optional[str] = None,
        required_capabilities: Optional[List[str]] = None,
        max_cost: Optional[float] = None,
        prefer_speed: bool = False
    ) -> Tuple[LLMProvider, str]:
        """
        Sélectionne le meilleur modèle pour une tâche.
        
        Args:
            task_type: Type de tâche (code, math, vision, etc.)
            required_capabilities: Capacités requises
            max_cost: Coût maximum par 1K tokens
            prefer_speed: Privilégier la vitesse
        
        Returns:
            (provider, model_name)
        """
        # Si tâche spécifique, utiliser le mapping
        if task_type and task_type in TASK_MODEL_MAPPING:
            candidates = TASK_MODEL_MAPPING[task_type]
        elif prefer_speed:
            candidates = TASK_MODEL_MAPPING["fast"]
        elif max_cost and max_cost < 0.001:
            candidates = TASK_MODEL_MAPPING["cheap"]
        else:
            candidates = TASK_MODEL_MAPPING["default"]
        
        # Filtrer par providers disponibles
        for provider, model in candidates:
            if provider in self._clients:
                # Vérifier les capacités requises
                if required_capabilities:
                    model_info = MODEL_REGISTRY.get(provider, {}).get(model, {})
                    caps = model_info.get("capabilities", [])
                    if not all(c in caps for c in required_capabilities):
                        continue
                
                return (provider, model)
        
        # Fallback: premier client disponible
        if self._clients:
            provider = list(self._clients.keys())[0]
            models = list(MODEL_REGISTRY.get(provider, {}).keys())
            return (provider, models[0] if models else "default")
        
        raise ValueError("No LLM provider available")
    
    async def generate(self, request: LLMRequest) -> LLMResponse:
        """
        Génère une réponse avec fallback automatique.
        """
        # Sélectionner le modèle si non spécifié
        if not request.provider or not request.model:
            provider, model = self.select_model(
                task_type=request.task_type,
                required_capabilities=request.required_capabilities,
                max_cost=request.max_cost
            )
            request.provider = provider
            request.model = model
        
        # Vérifier le cache
        cache_key = f"{request.model}:{hash(request.prompt)}"
        if self._cache_enabled and cache_key in self._cache:
            cached = self._cache[cache_key]
            cached.cached = True
            return cached
        
        # Essayer avec fallback
        errors = []
        fallback_chain = self._get_fallback_chain(request.provider, request.model)
        
        for provider, model in fallback_chain:
            if provider not in self._clients:
                continue
            
            try:
                request.provider = provider
                request.model = model
                
                client = self._clients[provider]
                response = await client.generate(request)
                
                # Update metrics
                self._total_requests += 1
                self._total_tokens += response.input_tokens + response.output_tokens
                self._total_cost += response.cost_usd
                
                # Cache
                if self._cache_enabled:
                    self._cache[cache_key] = response
                
                return response
                
            except Exception as e:
                logger.warning(f"LLM call failed for {provider.value}/{model}: {e}")
                errors.append(f"{provider.value}: {str(e)}")
                continue
        
        raise RuntimeError(f"All LLM providers failed: {errors}")
    
    def _get_fallback_chain(
        self,
        primary_provider: LLMProvider,
        primary_model: str
    ) -> List[Tuple[LLMProvider, str]]:
        """Construit la chaîne de fallback."""
        chain = [(primary_provider, primary_model)]
        
        for provider_str, model in self._default_fallback_chain:
            provider = LLMProvider(provider_str)
            if (provider, model) != (primary_provider, primary_model):
                chain.append((provider, model))
        
        return chain
    
    async def chat(
        self,
        messages: List[Dict[str, str]],
        agent_id: Optional[str] = None,
        department: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Interface de chat simple.
        """
        # Construire le prompt
        prompt_parts = []
        system = None
        
        for msg in messages:
            if msg["role"] == "system":
                system = msg["content"]
            elif msg["role"] == "user":
                prompt_parts.append(msg["content"])
            elif msg["role"] == "assistant":
                prompt_parts.append(f"[Assistant]: {msg['content']}")
        
        request = LLMRequest(
            prompt="\n".join(prompt_parts),
            system_prompt=system,
            agent_id=agent_id,
            **kwargs
        )
        
        response = await self.generate(request)
        
        return {
            "content": response.content,
            "provider": response.provider.value,
            "model": response.model,
            "tokens": response.input_tokens + response.output_tokens,
            "cost": response.cost_usd
        }
    
    def get_statistics(self) -> Dict[str, Any]:
        """Retourne les statistiques du router."""
        return {
            "total_requests": self._total_requests,
            "total_tokens": self._total_tokens,
            "total_cost_usd": round(self._total_cost, 4),
            "providers_available": [p.value for p in self._clients.keys()],
            "cache_size": len(self._cache),
            "cache_enabled": self._cache_enabled
        }
    
    def get_available_models(self) -> Dict[str, List[str]]:
        """Retourne les modèles disponibles par provider."""
        result = {}
        for provider in self._clients:
            result[provider.value] = list(MODEL_REGISTRY.get(provider, {}).keys())
        return result


# ═══════════════════════════════════════════════════════════════════════════════
# SINGLETON & FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

_llm_router_instance: Optional[LLMRouter] = None


def get_llm_router() -> LLMRouter:
    """Obtient l'instance singleton du LLM Router."""
    global _llm_router_instance
    if _llm_router_instance is None:
        _llm_router_instance = LLMRouter.from_env()
    return _llm_router_instance


def create_llm_router(**kwargs) -> LLMRouter:
    """Factory pour créer un nouveau router."""
    return LLMRouter(**kwargs)


# Alias pour compatibilité v8
llm_client = get_llm_router


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    "LLMRouter",
    "LLMProvider",
    "LLMRequest",
    "LLMResponse",
    "MODEL_REGISTRY",
    "TASK_MODEL_MAPPING",
    "get_llm_router",
    "create_llm_router",
    "llm_client"
]
