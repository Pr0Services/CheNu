"""
CHE·NU v7.0 - Master Mind (L0 Orchestrator)
═══════════════════════════════════════════════════════════════════════════════
Le cerveau central de CHE·NU. Reçoit toutes les requêtes, les analyse,
les décompose, les route et assemble les résultats.

Architecture:
    Nova (L-1) → MasterMind (L0) → Directors (L1) → Specialists (L2)

Author: CHE·NU Team
Version: 7.0
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Union, Callable, TYPE_CHECKING
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import uuid
import logging
import time
import asyncio
from concurrent.futures import ThreadPoolExecutor

from .routing_engine import RoutingEngine, RoutingResult
from .task_decomposer import TaskDecomposer, ComplexityAnalysis, DecompositionResult
from .result_assembler import ResultAssembler, AssemblyResult, AssemblyStrategy
from .execution_planner import ExecutionPlanner, ExecutionPlan

if TYPE_CHECKING:
    from ..schemas.task_schema import Task, TaskResult, TaskInput

logger = logging.getLogger("CHE·NU.Core.MasterMind")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class ExecutionPhase(str, Enum):
    """Phases du pipeline d'exécution."""
    INIT = "init"
    ROUTING = "routing"
    ANALYSIS = "analysis"
    DECOMPOSITION = "decomposition"
    PLANNING = "planning"
    EXECUTION = "execution"
    ASSEMBLY = "assembly"
    VALIDATION = "validation"
    COMPLETE = "complete"
    ERROR = "error"


class LLMProvider(str, Enum):
    """Providers LLM supportés."""
    ANTHROPIC = "anthropic"
    OPENAI = "openai"
    GOOGLE = "google"
    MISTRAL = "mistral"
    LOCAL = "local"


# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class MasterMindConfig:
    """Configuration du Master Mind."""
    agent_id: str = "MASTER_MIND_001"
    name: str = "Master Mind"
    level: str = "L0"
    
    # LLM
    preferred_llm: str = "claude-sonnet-4-20250514"
    fallback_llms: List[str] = field(default_factory=lambda: ["gpt-4-turbo-preview"])
    llm_provider: LLMProvider = LLMProvider.ANTHROPIC
    
    # Exécution
    max_parallel_tasks: int = 10
    default_timeout_seconds: int = 300
    enable_streaming: bool = True
    
    # Décomposition
    auto_decompose_threshold: float = 0.5
    use_llm_for_routing: bool = True
    use_llm_for_decomposition: bool = True
    max_subtasks: int = 10
    
    # Assemblage
    default_assembly_strategy: AssemblyStrategy = AssemblyStrategy.MERGE
    validate_results: bool = True
    
    # Cache
    enable_cache: bool = True
    cache_ttl_seconds: int = 3600
    
    # Logging
    log_level: str = "INFO"
    trace_enabled: bool = True


# ═══════════════════════════════════════════════════════════════════════════════
# EXECUTION CONTEXT
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class ExecutionContext:
    """Contexte d'exécution pour une requête."""
    task_id: str
    trace_id: str
    user_id: str
    project_id: Optional[str] = None
    company_id: Optional[str] = None
    
    # État
    phase: ExecutionPhase = ExecutionPhase.INIT
    started_at: datetime = field(default_factory=datetime.utcnow)
    
    # Routing
    routing_result: Optional[RoutingResult] = None
    department: Optional[str] = None
    target_agents: List[str] = field(default_factory=list)
    
    # Décomposition
    complexity: Optional[ComplexityAnalysis] = None
    decomposition: Optional[DecompositionResult] = None
    
    # Plan
    execution_plan: Optional[ExecutionPlan] = None
    
    # Résultats
    subtask_results: List[Dict[str, Any]] = field(default_factory=list)
    assembly_result: Optional[AssemblyResult] = None
    
    # Métriques
    phase_timings: Dict[str, float] = field(default_factory=dict)
    total_llm_calls: int = 0
    total_tokens_used: int = 0
    total_cost_usd: float = 0.0
    
    # Erreurs
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    
    def record_phase_time(self, phase: str, duration_ms: float) -> None:
        """Enregistre le temps d'une phase."""
        self.phase_timings[phase] = duration_ms
    
    def add_llm_usage(self, tokens: int, cost: float) -> None:
        """Ajoute les métriques LLM."""
        self.total_llm_calls += 1
        self.total_tokens_used += tokens
        self.total_cost_usd += cost


# ═══════════════════════════════════════════════════════════════════════════════
# MASTER MIND
# ═══════════════════════════════════════════════════════════════════════════════

class MasterMind:
    """
    🧠 MASTER MIND - L'Orchestrateur Central de CHE·NU (Niveau L0)
    
    Responsabilités:
    1. Recevoir toutes les requêtes entrantes (de Nova ou directement)
    2. Analyser la complexité et router vers les bons départements
    3. Décomposer les tâches complexes en sous-tâches
    4. Planifier et orchestrer l'exécution
    5. Assembler les résultats en réponse cohérente
    6. Valider la qualité globale
    
    Hiérarchie:
        Nova (L-1) → MasterMind (L0) → Directors (L1) → Specialists (L2)
    """
    
    def __init__(
        self,
        config: Optional[MasterMindConfig] = None,
        llm_client: Any = None,
        agent_registry: Any = None,
        database: Any = None
    ):
        """
        Initialise le Master Mind.
        
        Args:
            config: Configuration
            llm_client: Client LLM (Anthropic, OpenAI, etc.)
            agent_registry: Registre des agents
            database: Connexion base de données
        """
        self.config = config or MasterMindConfig()
        self.llm_client = llm_client
        self.agent_registry = agent_registry
        self.database = database
        
        # Composants core
        self.routing_engine = RoutingEngine(
            default_department="construction",
            use_llm_for_low_confidence=self.config.use_llm_for_routing
        )
        
        self.task_decomposer = TaskDecomposer(
            llm_client=llm_client,
            auto_decompose_threshold=self.config.auto_decompose_threshold,
            max_subtasks=self.config.max_subtasks
        )
        
        self.execution_planner = ExecutionPlanner(
            max_parallel_tasks=self.config.max_parallel_tasks,
            default_timeout_seconds=self.config.default_timeout_seconds,
            agent_registry=agent_registry
        )
        
        self.result_assembler = ResultAssembler(
            llm_client=llm_client,
            default_strategy=self.config.default_assembly_strategy
        )
        
        # État interne
        self._active_tasks: Dict[str, ExecutionContext] = {}
        self._task_history: List[Dict[str, Any]] = []
        self._executor = ThreadPoolExecutor(max_workers=self.config.max_parallel_tasks)
        
        # Callbacks
        self._on_phase_change: Optional[Callable] = None
        self._on_task_complete: Optional[Callable] = None
        
        logger.info(f"🧠 Master Mind initialized: {self.config.agent_id}")
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MAIN ENTRY POINTS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def process_request(
        self,
        request: Union[str, Dict[str, Any]],
        user_id: str,
        project_id: Optional[str] = None,
        company_id: Optional[str] = None,
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Point d'entrée principal pour traiter une requête.
        
        Args:
            request: Requête (texte ou dict)
            user_id: ID de l'utilisateur
            project_id: ID du projet
            company_id: ID de l'entreprise
            options: Options supplémentaires
            
        Returns:
            Résultat de l'exécution
        """
        start_time = time.time()
        options = options or {}
        
        # Créer le contexte
        context = self._create_context(request, user_id, project_id, company_id)
        self._active_tasks[context.task_id] = context
        
        try:
            # Normaliser la requête
            request_data = self._normalize_request(request)
            
            # Phase 1: Routing
            await self._phase_routing(context, request_data, options)
            
            # Phase 2: Analyse de complexité
            await self._phase_analysis(context, request_data)
            
            # Phase 3: Décomposition (si nécessaire)
            await self._phase_decomposition(context, request_data, options)
            
            # Phase 4: Planification
            await self._phase_planning(context, options)
            
            # Phase 5: Exécution
            await self._phase_execution(context, options)
            
            # Phase 6: Assemblage
            await self._phase_assembly(context, request_data, options)
            
            # Phase 7: Validation
            await self._phase_validation(context)
            
            # Finaliser
            context.phase = ExecutionPhase.COMPLETE
            total_time = time.time() - start_time
            
            result = self._build_result(context, total_time)
            self._record_task(context, result)
            
            return result
            
        except Exception as e:
            logger.error(f"Task {context.task_id} failed: {e}")
            context.phase = ExecutionPhase.ERROR
            context.errors.append(str(e))
            
            return {
                "task_id": context.task_id,
                "trace_id": context.trace_id,
                "success": False,
                "error": str(e),
                "phase": context.phase.value,
                "duration_seconds": time.time() - start_time
            }
            
        finally:
            del self._active_tasks[context.task_id]
    
    def process_request_sync(
        self,
        request: Union[str, Dict[str, Any]],
        user_id: str,
        project_id: Optional[str] = None,
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Version synchrone du traitement."""
        start_time = time.time()
        options = options or {}
        
        context = self._create_context(request, user_id, project_id, None)
        request_data = self._normalize_request(request)
        
        try:
            # Routing synchrone
            routing = self.routing_engine.route_sync(request_data, options.get("force_department"))
            context.routing_result = routing
            context.department = routing.department
            
            # Analyse
            complexity = self.task_decomposer.analyze_complexity(request_data)
            context.complexity = complexity
            
            # Décomposition synchrone
            decomposition = self.task_decomposer.decompose_sync(
                request_data, routing.to_dict()
            )
            context.decomposition = decomposition
            
            # Planification
            plan = self.execution_planner.create_plan(
                context.task_id,
                context.trace_id,
                decomposition.subtasks,
                options
            )
            context.execution_plan = plan
            
            # Exécution simulée (sync ne peut pas appeler les agents async)
            results = []
            for subtask in decomposition.subtasks:
                results.append({
                    "subtask_id": subtask["id"],
                    "success": True,
                    "output": f"[Sync] Processed: {subtask.get('description', '')[:100]}",
                    "department": subtask.get("department"),
                    "simulated": True
                })
            
            context.subtask_results = results
            
            # Assemblage synchrone
            assembly = self.result_assembler.assemble_sync(
                context.task_id,
                results,
                options.get("assembly_strategy")
            )
            context.assembly_result = assembly
            
            context.phase = ExecutionPhase.COMPLETE
            
            return {
                "task_id": context.task_id,
                "trace_id": context.trace_id,
                "success": True,
                "output": assembly.content,
                "department": context.department,
                "complexity": complexity.level,
                "subtasks_count": len(decomposition.subtasks),
                "duration_seconds": time.time() - start_time
            }
            
        except Exception as e:
            return {
                "task_id": context.task_id,
                "success": False,
                "error": str(e)
            }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # EXECUTION PHASES
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def _phase_routing(
        self,
        context: ExecutionContext,
        request: Dict[str, Any],
        options: Dict[str, Any]
    ) -> None:
        """Phase de routage."""
        start = time.time()
        context.phase = ExecutionPhase.ROUTING
        self._notify_phase_change(context)
        
        routing = await self.routing_engine.route(
            request,
            force_department=options.get("force_department")
        )
        
        context.routing_result = routing
        context.department = routing.department
        context.target_agents.append(routing.agent_id)
        
        context.record_phase_time("routing", (time.time() - start) * 1000)
        
        logger.info(
            f"Routed to {routing.department} "
            f"(confidence={routing.confidence:.2f}, method={routing.method})"
        )
    
    async def _phase_analysis(
        self,
        context: ExecutionContext,
        request: Dict[str, Any]
    ) -> None:
        """Phase d'analyse de complexité."""
        start = time.time()
        context.phase = ExecutionPhase.ANALYSIS
        self._notify_phase_change(context)
        
        complexity = self.task_decomposer.analyze_complexity(request)
        context.complexity = complexity
        
        context.record_phase_time("analysis", (time.time() - start) * 1000)
        
        logger.info(
            f"Complexity: {complexity.level} (score={complexity.score:.2f}, "
            f"should_decompose={complexity.should_decompose})"
        )
    
    async def _phase_decomposition(
        self,
        context: ExecutionContext,
        request: Dict[str, Any],
        options: Dict[str, Any]
    ) -> None:
        """Phase de décomposition."""
        start = time.time()
        context.phase = ExecutionPhase.DECOMPOSITION
        self._notify_phase_change(context)
        
        decomposition = await self.task_decomposer.decompose(
            request,
            context.routing_result.to_dict() if context.routing_result else {},
            task_id=context.task_id,
            force_decompose=options.get("force_decompose", False)
        )
        
        context.decomposition = decomposition
        
        context.record_phase_time("decomposition", (time.time() - start) * 1000)
        
        logger.info(
            f"Decomposed into {len(decomposition.subtasks)} subtasks "
            f"(pattern={decomposition.pattern_used})"
        )
    
    async def _phase_planning(
        self,
        context: ExecutionContext,
        options: Dict[str, Any]
    ) -> None:
        """Phase de planification."""
        start = time.time()
        context.phase = ExecutionPhase.PLANNING
        self._notify_phase_change(context)
        
        plan = self.execution_planner.create_plan(
            context.task_id,
            context.trace_id,
            context.decomposition.subtasks if context.decomposition else [],
            options
        )
        
        context.execution_plan = plan
        
        context.record_phase_time("planning", (time.time() - start) * 1000)
        
        logger.info(
            f"Plan created: {len(plan.steps)} steps, "
            f"order={plan.execution_order.value}, "
            f"estimated={plan.estimated_duration_seconds}s"
        )
    
    async def _phase_execution(
        self,
        context: ExecutionContext,
        options: Dict[str, Any]
    ) -> None:
        """Phase d'exécution."""
        start = time.time()
        context.phase = ExecutionPhase.EXECUTION
        self._notify_phase_change(context)
        
        results = []
        
        if context.execution_plan:
            # Exécuter chaque étape
            for step in context.execution_plan.steps:
                subtask = self._find_subtask(
                    context.decomposition.subtasks if context.decomposition else [],
                    step.subtask_id
                )
                
                result = await self._execute_subtask(
                    step,
                    subtask,
                    context,
                    options
                )
                
                results.append(result)
                context.target_agents.append(step.agent_id)
        
        context.subtask_results = results
        context.record_phase_time("execution", (time.time() - start) * 1000)
        
        successful = sum(1 for r in results if r.get("success"))
        logger.info(f"Executed {successful}/{len(results)} subtasks successfully")
    
    async def _phase_assembly(
        self,
        context: ExecutionContext,
        request: Dict[str, Any],
        options: Dict[str, Any]
    ) -> None:
        """Phase d'assemblage."""
        start = time.time()
        context.phase = ExecutionPhase.ASSEMBLY
        self._notify_phase_change(context)
        
        strategy = options.get("assembly_strategy", self.config.default_assembly_strategy)
        
        assembly = await self.result_assembler.assemble(
            context.task_id,
            context.subtask_results,
            request,
            strategy=strategy
        )
        
        context.assembly_result = assembly
        context.record_phase_time("assembly", (time.time() - start) * 1000)
        
        logger.info(
            f"Assembled {assembly.successful_sources}/{assembly.sources_count} sources "
            f"(strategy={assembly.strategy_used.value})"
        )
    
    async def _phase_validation(self, context: ExecutionContext) -> None:
        """Phase de validation."""
        start = time.time()
        context.phase = ExecutionPhase.VALIDATION
        self._notify_phase_change(context)
        
        if self.config.validate_results and context.subtask_results:
            validation = self.result_assembler.validate_coherence(context.subtask_results)
            
            if not validation["is_coherent"]:
                context.warnings.append("Résultats potentiellement incohérents")
                for issue in validation["issues"]:
                    context.warnings.append(issue)
        
        context.record_phase_time("validation", (time.time() - start) * 1000)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # SUBTASK EXECUTION
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def _execute_subtask(
        self,
        step: Any,
        subtask: Optional[Dict[str, Any]],
        context: ExecutionContext,
        options: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Exécute une sous-tâche."""
        if not subtask:
            return {
                "subtask_id": step.subtask_id,
                "success": False,
                "error": "Subtask not found"
            }
        
        try:
            # Obtenir l'agent approprié
            agent = None
            if self.agent_registry:
                agent = self.agent_registry.get_agent(step.agent_id)
            
            if agent:
                # Exécuter via l'agent réel
                response = await agent.execute(
                    task_id=f"{context.task_id}-{step.subtask_id}",
                    input_data=subtask,
                    user_id=context.user_id,
                    project_id=context.project_id,
                    trace_id=context.trace_id
                )
                
                context.add_llm_usage(
                    response.get("tokens_used", 0),
                    response.get("cost_usd", 0)
                )
                
                return {
                    "subtask_id": step.subtask_id,
                    "department": step.department,
                    "agent_id": step.agent_id,
                    "success": response.get("success", True),
                    "output": response.get("output", ""),
                    "confidence": response.get("confidence", 1.0)
                }
            else:
                # Mode simulation
                return await self._simulate_execution(step, subtask, context)
                
        except Exception as e:
            logger.error(f"Subtask {step.subtask_id} failed: {e}")
            return {
                "subtask_id": step.subtask_id,
                "department": step.department,
                "agent_id": step.agent_id,
                "success": False,
                "error": str(e)
            }
    
    async def _simulate_execution(
        self,
        step: Any,
        subtask: Dict[str, Any],
        context: ExecutionContext
    ) -> Dict[str, Any]:
        """Simule l'exécution (pour tests/démo)."""
        # Si on a un LLM, on peut générer une réponse
        if self.llm_client and hasattr(self.llm_client, 'messages'):
            try:
                prompt = f"""Tu es un agent {step.agent_type} du département {step.department}.
                
Tâche: {subtask.get('description', 'Pas de description')}

Réponds de manière concise et professionnelle en français."""

                response = await self.llm_client.messages.create(
                    model=self.config.preferred_llm,
                    max_tokens=500,
                    messages=[{"role": "user", "content": prompt}]
                )
                
                output = response.content[0].text
                
                context.add_llm_usage(
                    response.usage.input_tokens + response.usage.output_tokens,
                    0.003  # Estimation
                )
                
                return {
                    "subtask_id": step.subtask_id,
                    "department": step.department,
                    "agent_id": step.agent_id,
                    "success": True,
                    "output": output,
                    "confidence": 0.85,
                    "simulated": True
                }
                
            except Exception as e:
                logger.warning(f"LLM simulation failed: {e}")
        
        # Simulation basique
        return {
            "subtask_id": step.subtask_id,
            "department": step.department,
            "agent_id": step.agent_id,
            "success": True,
            "output": f"[Simulated] {subtask.get('description', 'Task completed')}",
            "confidence": 0.7,
            "simulated": True
        }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # UTILITIES
    # ═══════════════════════════════════════════════════════════════════════════
    
    def _create_context(
        self,
        request: Any,
        user_id: str,
        project_id: Optional[str],
        company_id: Optional[str]
    ) -> ExecutionContext:
        """Crée un contexte d'exécution."""
        return ExecutionContext(
            task_id=f"task_{uuid.uuid4().hex[:12]}",
            trace_id=f"trace_{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            project_id=project_id,
            company_id=company_id
        )
    
    def _normalize_request(self, request: Any) -> Dict[str, Any]:
        """Normalise la requête en dict."""
        if isinstance(request, str):
            return {"description": request}
        elif isinstance(request, dict):
            return request
        else:
            return {"description": str(request)}
    
    def _find_subtask(
        self,
        subtasks: List[Dict[str, Any]],
        subtask_id: str
    ) -> Optional[Dict[str, Any]]:
        """Trouve une sous-tâche par ID."""
        for st in subtasks:
            if st.get("id") == subtask_id:
                return st
        return None
    
    def _build_result(
        self,
        context: ExecutionContext,
        total_time: float
    ) -> Dict[str, Any]:
        """Construit le résultat final."""
        return {
            "task_id": context.task_id,
            "trace_id": context.trace_id,
            "success": len(context.errors) == 0,
            
            # Output
            "output": context.assembly_result.content if context.assembly_result else None,
            "format": context.assembly_result.format.value if context.assembly_result else "text",
            
            # Metadata
            "department": context.department,
            "agents_used": list(set(context.target_agents)),
            "complexity": context.complexity.level if context.complexity else "unknown",
            
            # Subtasks
            "subtasks_count": len(context.subtask_results),
            "subtasks_successful": sum(1 for r in context.subtask_results if r.get("success")),
            
            # Métriques
            "metrics": {
                "duration_seconds": round(total_time, 3),
                "phase_timings_ms": context.phase_timings,
                "llm_calls": context.total_llm_calls,
                "tokens_used": context.total_tokens_used,
                "cost_usd": round(context.total_cost_usd, 4)
            },
            
            # Erreurs/Warnings
            "errors": context.errors,
            "warnings": context.warnings
        }
    
    def _record_task(self, context: ExecutionContext, result: Dict[str, Any]) -> None:
        """Enregistre une tâche dans l'historique."""
        record = {
            "task_id": context.task_id,
            "trace_id": context.trace_id,
            "user_id": context.user_id,
            "department": context.department,
            "phase": context.phase.value,
            "success": result.get("success", False),
            "completed_at": datetime.utcnow().isoformat(),
            "duration_seconds": result.get("metrics", {}).get("duration_seconds", 0),
            "llm_calls": context.total_llm_calls,
            "cost_usd": context.total_cost_usd
        }
        
        self._task_history.append(record)
        
        # Garder les 1000 dernières
        if len(self._task_history) > 1000:
            self._task_history = self._task_history[-1000:]
        
        if self._on_task_complete:
            self._on_task_complete(record)
    
    def _notify_phase_change(self, context: ExecutionContext) -> None:
        """Notifie un changement de phase."""
        if self._on_phase_change:
            self._on_phase_change(context.task_id, context.phase)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # PUBLIC METHODS
    # ═══════════════════════════════════════════════════════════════════════════
    
    def get_statistics(self) -> Dict[str, Any]:
        """Retourne les statistiques globales."""
        if not self._task_history:
            return {"total_tasks": 0}
        
        successful = sum(1 for t in self._task_history if t.get("success"))
        total_cost = sum(t.get("cost_usd", 0) for t in self._task_history)
        total_duration = sum(t.get("duration_seconds", 0) for t in self._task_history)
        
        # Par département
        by_dept = {}
        for t in self._task_history:
            dept = t.get("department", "unknown")
            by_dept[dept] = by_dept.get(dept, 0) + 1
        
        return {
            "total_tasks": len(self._task_history),
            "successful_tasks": successful,
            "success_rate": successful / len(self._task_history) if self._task_history else 0,
            "total_cost_usd": round(total_cost, 4),
            "avg_duration_seconds": round(total_duration / len(self._task_history), 2),
            "tasks_by_department": by_dept,
            "active_tasks": len(self._active_tasks)
        }
    
    def get_active_tasks(self) -> List[Dict[str, Any]]:
        """Retourne les tâches actives."""
        return [
            {
                "task_id": ctx.task_id,
                "phase": ctx.phase.value,
                "department": ctx.department,
                "started_at": ctx.started_at.isoformat()
            }
            for ctx in self._active_tasks.values()
        ]
    
    def on_phase_change(self, callback: Callable) -> None:
        """Définit le callback de changement de phase."""
        self._on_phase_change = callback
    
    def on_task_complete(self, callback: Callable) -> None:
        """Définit le callback de fin de tâche."""
        self._on_task_complete = callback
    
    def shutdown(self) -> None:
        """Arrête proprement le Master Mind."""
        logger.info("🛑 Shutting down Master Mind...")
        self._executor.shutdown(wait=True)
        self._active_tasks.clear()
        logger.info("✅ Master Mind shutdown complete")


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

def create_master_mind(
    llm_client: Any = None,
    agent_registry: Any = None,
    database: Any = None,
    **config_overrides
) -> MasterMind:
    """
    Factory pour créer un Master Mind.
    
    Args:
        llm_client: Client LLM
        agent_registry: Registre d'agents
        database: Base de données
        **config_overrides: Surcharges de configuration
        
    Returns:
        Instance de MasterMind
    """
    config = MasterMindConfig(**config_overrides)
    
    return MasterMind(
        config=config,
        llm_client=llm_client,
        agent_registry=agent_registry,
        database=database
    )


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    "MasterMind",
    "MasterMindConfig",
    "ExecutionContext",
    "ExecutionPhase",
    "LLMProvider",
    "create_master_mind"
]
