"""
CHE·NU - IA Labs Service
========================
Service pour les expérimentations et outils IA avancés.

Fonctionnalités:
- Playground de prompts
- Test de différents modèles LLM
- Analyse et optimisation de prompts
- Historique des expérimentations
- Benchmark et comparaisons
- Fine-tuning helpers

Version: 1.0
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID, uuid4
from enum import Enum
from pydantic import BaseModel, Field
import json
import asyncio
import asyncpg
from fastapi import HTTPException


# ============================================================================
# ENUMS
# ============================================================================

class LLMProvider(str, Enum):
    """Providers LLM disponibles"""
    ANTHROPIC = "anthropic"
    OPENAI = "openai"
    GOOGLE = "google"
    MISTRAL = "mistral"
    LOCAL = "local"


class ExperimentStatus(str, Enum):
    """États des expérimentations"""
    DRAFT = "draft"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


# ============================================================================
# MODELS
# ============================================================================

class PromptTemplate(BaseModel):
    """Template de prompt"""
    name: str
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    user_prompt: str
    variables: List[str] = []  # Variables à remplacer {{variable}}
    tags: List[str] = []
    

class LLMConfig(BaseModel):
    """Configuration d'un modèle LLM"""
    provider: LLMProvider
    model: str
    temperature: float = Field(ge=0, le=2, default=0.7)
    max_tokens: int = Field(ge=1, le=100000, default=4096)
    top_p: float = Field(ge=0, le=1, default=1.0)
    stop_sequences: List[str] = []


class ExperimentCreate(BaseModel):
    """Création d'une expérimentation"""
    name: str
    description: Optional[str] = None
    prompt_template_id: Optional[UUID] = None
    system_prompt: Optional[str] = None
    user_prompt: str
    variables: Dict[str, str] = {}
    llm_configs: List[LLMConfig]  # Plusieurs modèles pour comparaison
    iterations: int = Field(ge=1, le=10, default=1)


class ExperimentResult(BaseModel):
    """Résultat d'une expérimentation"""
    llm_config: LLMConfig
    iteration: int
    response: str
    tokens_input: int
    tokens_output: int
    latency_ms: int
    cost_estimate: float
    error: Optional[str] = None


class PromptAnalysis(BaseModel):
    """Analyse d'un prompt"""
    original_prompt: str
    token_count: int
    estimated_cost: float
    clarity_score: float  # 0-1
    specificity_score: float  # 0-1
    suggestions: List[str]
    optimized_prompt: Optional[str] = None


# ============================================================================
# SERVICE
# ============================================================================

class IALabsService:
    """
    Service IA Labs pour les expérimentations
    """
    
    def __init__(self, db_pool: asyncpg.Pool):
        self.db = db_pool
        
        # Configurations des modèles disponibles
        self.available_models = {
            LLMProvider.ANTHROPIC: [
                "claude-3-opus-20240229",
                "claude-3-sonnet-20240229",
                "claude-3-haiku-20240307",
                "claude-3-5-sonnet-20241022"
            ],
            LLMProvider.OPENAI: [
                "gpt-4-turbo-preview",
                "gpt-4",
                "gpt-3.5-turbo"
            ],
            LLMProvider.GOOGLE: [
                "gemini-pro",
                "gemini-pro-vision"
            ],
            LLMProvider.MISTRAL: [
                "mistral-large",
                "mistral-medium",
                "mistral-small"
            ]
        }
        
        # Coûts estimés par 1K tokens (input/output)
        self.model_costs = {
            "claude-3-opus-20240229": (0.015, 0.075),
            "claude-3-sonnet-20240229": (0.003, 0.015),
            "claude-3-haiku-20240307": (0.00025, 0.00125),
            "claude-3-5-sonnet-20241022": (0.003, 0.015),
            "gpt-4-turbo-preview": (0.01, 0.03),
            "gpt-4": (0.03, 0.06),
            "gpt-3.5-turbo": (0.0005, 0.0015),
        }
    
    # ========================================================================
    # PROMPT TEMPLATES
    # ========================================================================
    
    async def create_prompt_template(
        self,
        template: PromptTemplate,
        owner_id: UUID
    ) -> Dict[str, Any]:
        """Crée un nouveau template de prompt"""
        # Extraire les variables du prompt
        import re
        variables = re.findall(r'\{\{(\w+)\}\}', template.user_prompt)
        if template.system_prompt:
            variables.extend(re.findall(r'\{\{(\w+)\}\}', template.system_prompt))
        variables = list(set(variables))
        
        query = """
            INSERT INTO prompt_templates (
                name, description, system_prompt, user_prompt,
                variables, tags, owner_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query,
            template.name,
            template.description,
            template.system_prompt,
            template.user_prompt,
            variables,
            template.tags,
            owner_id
        )
        
        return dict(row)
    
    async def list_prompt_templates(
        self,
        owner_id: UUID,
        tags: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Liste les templates de prompts"""
        if tags:
            query = """
                SELECT * FROM prompt_templates
                WHERE owner_id = $1 AND tags && $2
                ORDER BY updated_at DESC
            """
            rows = await self.db.fetch(query, owner_id, tags)
        else:
            query = """
                SELECT * FROM prompt_templates
                WHERE owner_id = $1
                ORDER BY updated_at DESC
            """
            rows = await self.db.fetch(query, owner_id)
        
        return [dict(row) for row in rows]
    
    async def get_prompt_template(self, template_id: UUID) -> Optional[Dict[str, Any]]:
        """Récupère un template"""
        query = "SELECT * FROM prompt_templates WHERE id = $1"
        row = await self.db.fetchrow(query, template_id)
        return dict(row) if row else None
    
    # ========================================================================
    # EXPÉRIMENTATIONS
    # ========================================================================
    
    async def create_experiment(
        self,
        data: ExperimentCreate,
        owner_id: UUID
    ) -> Dict[str, Any]:
        """Crée une nouvelle expérimentation"""
        
        # Créer l'expérimentation
        query = """
            INSERT INTO ia_experiments (
                name, description, system_prompt, user_prompt,
                variables, llm_configs, iterations, status, owner_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query,
            data.name,
            data.description,
            data.system_prompt,
            data.user_prompt,
            json.dumps(data.variables),
            json.dumps([c.dict() for c in data.llm_configs]),
            data.iterations,
            ExperimentStatus.DRAFT.value,
            owner_id
        )
        
        return dict(row)
    
    async def run_experiment(
        self,
        experiment_id: UUID
    ) -> Dict[str, Any]:
        """
        Lance une expérimentation.
        Compare les réponses de plusieurs modèles.
        """
        # Récupérer l'expérimentation
        experiment = await self.db.fetchrow(
            "SELECT * FROM ia_experiments WHERE id = $1",
            experiment_id
        )
        
        if not experiment:
            raise HTTPException(status_code=404, detail="Expérimentation non trouvée")
        
        # Mettre à jour le statut
        await self.db.execute(
            "UPDATE ia_experiments SET status = $2, started_at = NOW() WHERE id = $1",
            experiment_id, ExperimentStatus.RUNNING.value
        )
        
        llm_configs = json.loads(experiment['llm_configs'])
        variables = json.loads(experiment['variables'])
        results = []
        
        # Remplacer les variables dans les prompts
        user_prompt = experiment['user_prompt']
        system_prompt = experiment['system_prompt']
        
        for var_name, var_value in variables.items():
            user_prompt = user_prompt.replace(f"{{{{{var_name}}}}}", var_value)
            if system_prompt:
                system_prompt = system_prompt.replace(f"{{{{{var_name}}}}}", var_value)
        
        # Exécuter pour chaque config LLM
        for config in llm_configs:
            for iteration in range(experiment['iterations']):
                try:
                    result = await self._call_llm(
                        config=LLMConfig(**config),
                        system_prompt=system_prompt,
                        user_prompt=user_prompt
                    )
                    result['iteration'] = iteration + 1
                    results.append(result)
                except Exception as e:
                    results.append({
                        'llm_config': config,
                        'iteration': iteration + 1,
                        'error': str(e)
                    })
        
        # Sauvegarder les résultats
        await self.db.execute("""
            UPDATE ia_experiments
            SET status = $2, results = $3, completed_at = NOW()
            WHERE id = $1
        """, experiment_id, ExperimentStatus.COMPLETED.value, json.dumps(results))
        
        return {
            'experiment_id': str(experiment_id),
            'status': 'completed',
            'results': results
        }
    
    async def _call_llm(
        self,
        config: LLMConfig,
        system_prompt: Optional[str],
        user_prompt: str
    ) -> Dict[str, Any]:
        """Appelle un LLM (mock pour l'instant)"""
        import time
        import random
        
        start = time.time()
        
        # TODO: Implémenter les vrais appels API
        # Pour l'instant, simulation
        await asyncio.sleep(random.uniform(0.5, 2.0))
        
        latency = int((time.time() - start) * 1000)
        tokens_input = len(user_prompt.split()) * 1.3
        tokens_output = random.randint(100, 500)
        
        # Calculer le coût
        costs = self.model_costs.get(config.model, (0.001, 0.002))
        cost = (tokens_input / 1000 * costs[0]) + (tokens_output / 1000 * costs[1])
        
        return {
            'llm_config': config.dict(),
            'response': f"[Simulated response from {config.model}] Lorem ipsum...",
            'tokens_input': int(tokens_input),
            'tokens_output': tokens_output,
            'latency_ms': latency,
            'cost_estimate': round(cost, 6)
        }
    
    async def list_experiments(
        self,
        owner_id: UUID,
        status: Optional[ExperimentStatus] = None
    ) -> List[Dict[str, Any]]:
        """Liste les expérimentations"""
        if status:
            query = """
                SELECT * FROM ia_experiments
                WHERE owner_id = $1 AND status = $2
                ORDER BY created_at DESC
            """
            rows = await self.db.fetch(query, owner_id, status.value)
        else:
            query = """
                SELECT * FROM ia_experiments
                WHERE owner_id = $1
                ORDER BY created_at DESC
            """
            rows = await self.db.fetch(query, owner_id)
        
        return [dict(row) for row in rows]
    
    # ========================================================================
    # ANALYSE DE PROMPTS
    # ========================================================================
    
    async def analyze_prompt(
        self,
        prompt: str,
        context: Optional[str] = None
    ) -> PromptAnalysis:
        """Analyse un prompt et suggère des améliorations"""
        
        # Analyse basique
        words = prompt.split()
        token_count = int(len(words) * 1.3)
        
        # Score de clarté (basé sur la structure)
        clarity_score = min(1.0, 0.5 + (0.1 if '?' in prompt else 0) + 
                          (0.2 if len(words) > 10 else 0) +
                          (0.2 if any(w in prompt.lower() for w in ['please', 'help', 'explain']) else 0))
        
        # Score de spécificité
        specific_words = ['specific', 'exactly', 'precisely', 'format', 'step', 'example']
        specificity_score = min(1.0, 0.3 + 0.1 * sum(1 for w in specific_words if w in prompt.lower()))
        
        # Suggestions
        suggestions = []
        if len(words) < 10:
            suggestions.append("Ajoutez plus de contexte pour obtenir de meilleurs résultats")
        if '?' not in prompt:
            suggestions.append("Formulez votre demande sous forme de question pour plus de clarté")
        if not any(w in prompt.lower() for w in ['format', 'structure', 'json', 'list']):
            suggestions.append("Précisez le format de sortie souhaité")
        if clarity_score < 0.7:
            suggestions.append("Soyez plus explicite sur vos attentes")
        
        # Coût estimé (Claude Sonnet)
        cost = (token_count / 1000) * 0.003
        
        return PromptAnalysis(
            original_prompt=prompt,
            token_count=token_count,
            estimated_cost=cost,
            clarity_score=clarity_score,
            specificity_score=specificity_score,
            suggestions=suggestions
        )
    
    # ========================================================================
    # MODÈLES DISPONIBLES
    # ========================================================================
    
    async def get_available_models(self) -> Dict[str, List[Dict[str, Any]]]:
        """Retourne les modèles disponibles avec leurs caractéristiques"""
        result = {}
        
        for provider, models in self.available_models.items():
            result[provider.value] = []
            for model in models:
                costs = self.model_costs.get(model, (0.001, 0.002))
                result[provider.value].append({
                    'model': model,
                    'cost_per_1k_input': costs[0],
                    'cost_per_1k_output': costs[1],
                    'max_tokens': 100000 if 'claude' in model else 128000
                })
        
        return result


# ============================================================================
# FACTORY
# ============================================================================

_service_instance: Optional[IALabsService] = None

async def get_ia_labs_service(db_pool: asyncpg.Pool) -> IALabsService:
    global _service_instance
    if _service_instance is None:
        _service_instance = IALabsService(db_pool)
    return _service_instance
