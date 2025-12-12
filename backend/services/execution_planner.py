"""
CHE·NU v7.0 - Execution Planner
═══════════════════════════════════════════════════════════════════════════════
Planifie et optimise l'exécution des tâches et sous-tâches.
Gère les dépendances, la parallélisation et l'allocation des ressources.

Author: CHE·NU Team
Version: 7.0
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Set, Tuple, TYPE_CHECKING
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import logging
from enum import Enum
from collections import defaultdict
import asyncio

if TYPE_CHECKING:
    from ..schemas.task_schema import Task, SubTask

logger = logging.getLogger("CHE·NU.Core.ExecutionPlanner")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class ExecutionOrder(str, Enum):
    """Ordre d'exécution."""
    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    MIXED = "mixed"


class ResourceType(str, Enum):
    """Types de ressources."""
    AGENT = "agent"
    LLM_TOKEN = "llm_token"
    API_CALL = "api_call"
    DATABASE = "database"


class StepStatus(str, Enum):
    """Statut d'une étape."""
    PENDING = "pending"
    READY = "ready"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"


# ═══════════════════════════════════════════════════════════════════════════════
# EXECUTION STEP
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class ExecutionStep:
    """Étape d'exécution."""
    id: str
    subtask_id: str
    sequence: int
    
    # Agent
    agent_id: str
    agent_type: str
    department: str
    
    # Dépendances
    dependencies: List[str] = field(default_factory=list)
    dependents: List[str] = field(default_factory=list)
    
    # Exécution
    can_parallelize: bool = False
    parallel_group: Optional[int] = None
    priority: int = 1
    
    # Ressources
    estimated_duration_seconds: int = 60
    estimated_llm_tokens: int = 1000
    estimated_cost_usd: float = 0.01
    
    # État
    status: StepStatus = StepStatus.PENDING
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    
    # Timestamps
    scheduled_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    def is_ready(self, completed_steps: Set[str]) -> bool:
        """Vérifie si l'étape est prête à s'exécuter."""
        return all(dep in completed_steps for dep in self.dependencies)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "subtask_id": self.subtask_id,
            "sequence": self.sequence,
            "agent_id": self.agent_id,
            "agent_type": self.agent_type,
            "department": self.department,
            "dependencies": self.dependencies,
            "can_parallelize": self.can_parallelize,
            "parallel_group": self.parallel_group,
            "priority": self.priority,
            "estimated_duration_seconds": self.estimated_duration_seconds,
            "status": self.status.value
        }


# ═══════════════════════════════════════════════════════════════════════════════
# EXECUTION PLAN
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class ExecutionPlan:
    """Plan d'exécution complet."""
    task_id: str
    trace_id: str
    
    # Étapes
    steps: List[ExecutionStep] = field(default_factory=list)
    
    # Groupes parallèles
    parallel_groups: List[List[str]] = field(default_factory=list)
    
    # Ordre d'exécution
    execution_order: ExecutionOrder = ExecutionOrder.SEQUENTIAL
    
    # Ressources
    agents_required: List[str] = field(default_factory=list)
    departments_involved: List[str] = field(default_factory=list)
    
    # Estimations
    estimated_duration_seconds: int = 0
    estimated_total_tokens: int = 0
    estimated_cost_usd: float = 0.0
    
    # Optimisations
    optimizations_applied: List[str] = field(default_factory=list)
    
    # Métriques
    planning_time_ms: int = 0
    
    def get_step(self, step_id: str) -> Optional[ExecutionStep]:
        """Récupère une étape par ID."""
        for step in self.steps:
            if step.id == step_id:
                return step
        return None
    
    def get_ready_steps(self, completed: Set[str]) -> List[ExecutionStep]:
        """Récupère les étapes prêtes à s'exécuter."""
        ready = []
        for step in self.steps:
            if step.status == StepStatus.PENDING and step.is_ready(completed):
                ready.append(step)
        return ready
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "task_id": self.task_id,
            "trace_id": self.trace_id,
            "steps": [s.to_dict() for s in self.steps],
            "parallel_groups": self.parallel_groups,
            "execution_order": self.execution_order.value,
            "agents_required": self.agents_required,
            "departments_involved": self.departments_involved,
            "estimated_duration_seconds": self.estimated_duration_seconds,
            "estimated_cost_usd": self.estimated_cost_usd,
            "optimizations_applied": self.optimizations_applied
        }


# ═══════════════════════════════════════════════════════════════════════════════
# EXECUTION PLANNER
# ═══════════════════════════════════════════════════════════════════════════════

class ExecutionPlanner:
    """
    📋 Planificateur d'Exécution
    
    Crée des plans d'exécution optimisés:
    - Analyse des dépendances (graphe DAG)
    - Détection des opportunités de parallélisation
    - Estimation des ressources et coûts
    - Optimisation de l'ordre d'exécution
    """
    
    def __init__(
        self,
        max_parallel_tasks: int = 5,
        default_timeout_seconds: int = 300,
        enable_caching: bool = True,
        agent_registry: Any = None
    ):
        """
        Initialise le planificateur.
        
        Args:
            max_parallel_tasks: Max tâches parallèles
            default_timeout_seconds: Timeout par défaut
            enable_caching: Activer le cache
            agent_registry: Registre des agents
        """
        self.max_parallel = max_parallel_tasks
        self.default_timeout = default_timeout_seconds
        self.enable_caching = enable_caching
        self.agent_registry = agent_registry
        
        logger.info("📋 Execution Planner initialized")
    
    def create_plan(
        self,
        task_id: str,
        trace_id: str,
        subtasks: List[Dict[str, Any]],
        options: Dict[str, Any] = None
    ) -> ExecutionPlan:
        """
        Crée un plan d'exécution.
        
        Args:
            task_id: ID de la tâche
            trace_id: ID de trace
            subtasks: Sous-tâches à planifier
            options: Options de planification
            
        Returns:
            Plan d'exécution
        """
        import time
        start_time = time.time()
        
        options = options or {}
        
        # Créer les étapes
        steps = self._create_steps(subtasks)
        
        # Construire le graphe de dépendances
        self._build_dependency_graph(steps)
        
        # Détecter les opportunités de parallélisation
        parallel_groups = self._detect_parallel_groups(steps)
        
        # Déterminer l'ordre d'exécution
        execution_order = self._determine_execution_order(steps, parallel_groups)
        
        # Optimiser le plan
        optimizations = self._optimize_plan(steps, options)
        
        # Calculer les estimations
        total_duration, total_tokens, total_cost = self._calculate_estimates(steps)
        
        # Collecter les ressources
        agents = list(set(s.agent_id for s in steps))
        departments = list(set(s.department for s in steps))
        
        planning_time = int((time.time() - start_time) * 1000)
        
        plan = ExecutionPlan(
            task_id=task_id,
            trace_id=trace_id,
            steps=steps,
            parallel_groups=parallel_groups,
            execution_order=execution_order,
            agents_required=agents,
            departments_involved=departments,
            estimated_duration_seconds=total_duration,
            estimated_total_tokens=total_tokens,
            estimated_cost_usd=total_cost,
            optimizations_applied=optimizations,
            planning_time_ms=planning_time
        )
        
        logger.info(
            f"Created execution plan: {len(steps)} steps, "
            f"order={execution_order.value}, "
            f"estimated_duration={total_duration}s"
        )
        
        return plan
    
    def _create_steps(self, subtasks: List[Dict[str, Any]]) -> List[ExecutionStep]:
        """Crée les étapes à partir des sous-tâches."""
        steps = []
        
        for i, subtask in enumerate(subtasks):
            step = ExecutionStep(
                id=f"step_{subtask.get('id', i)}",
                subtask_id=subtask.get('id', f'subtask_{i}'),
                sequence=subtask.get('sequence', i + 1),
                agent_id=subtask.get('agent_id', f"{subtask.get('department', 'admin').upper()}_DIR_001"),
                agent_type=subtask.get('agent_type', 'director'),
                department=subtask.get('department', 'admin'),
                dependencies=subtask.get('dependencies', []),
                priority=subtask.get('priority', 1),
                estimated_duration_seconds=subtask.get('estimated_duration_seconds', 60),
                estimated_llm_tokens=subtask.get('estimated_tokens', 1000),
                estimated_cost_usd=subtask.get('estimated_cost', 0.01)
            )
            steps.append(step)
        
        return steps
    
    def _build_dependency_graph(self, steps: List[ExecutionStep]) -> None:
        """Construit le graphe de dépendances."""
        step_map = {s.subtask_id: s for s in steps}
        
        for step in steps:
            # Convertir les noms de dépendances en IDs de step
            resolved_deps = []
            for dep in step.dependencies:
                if dep in step_map:
                    resolved_deps.append(step_map[dep].id)
                    # Ajouter ce step comme dépendant
                    step_map[dep].dependents.append(step.id)
            step.dependencies = resolved_deps
    
    def _detect_parallel_groups(self, steps: List[ExecutionStep]) -> List[List[str]]:
        """Détecte les groupes de tâches parallélisables."""
        groups = []
        step_ids = set(s.id for s in steps)
        completed = set()
        group_num = 0
        
        while len(completed) < len(steps):
            # Trouver les étapes prêtes
            ready = []
            for step in steps:
                if step.id not in completed and step.is_ready(completed):
                    ready.append(step)
            
            if not ready:
                # Deadlock ou erreur
                logger.warning("Possible deadlock in dependency graph")
                break
            
            # Créer un groupe
            group_ids = [s.id for s in ready[:self.max_parallel]]
            groups.append(group_ids)
            
            # Marquer comme parallélisables
            for step in ready[:self.max_parallel]:
                step.can_parallelize = len(group_ids) > 1
                step.parallel_group = group_num
            
            completed.update(group_ids)
            group_num += 1
        
        return groups
    
    def _determine_execution_order(
        self,
        steps: List[ExecutionStep],
        parallel_groups: List[List[str]]
    ) -> ExecutionOrder:
        """Détermine l'ordre d'exécution global."""
        if len(steps) == 1:
            return ExecutionOrder.SEQUENTIAL
        
        # Compter les groupes avec plusieurs tâches
        multi_task_groups = sum(1 for g in parallel_groups if len(g) > 1)
        
        if multi_task_groups == 0:
            return ExecutionOrder.SEQUENTIAL
        elif multi_task_groups == len(parallel_groups):
            return ExecutionOrder.PARALLEL
        else:
            return ExecutionOrder.MIXED
    
    def _optimize_plan(
        self,
        steps: List[ExecutionStep],
        options: Dict[str, Any]
    ) -> List[str]:
        """Applique des optimisations au plan."""
        optimizations = []
        
        # Optimisation 1: Réordonner par priorité
        if options.get("optimize_priority", True):
            steps.sort(key=lambda s: (-s.priority, s.sequence))
            optimizations.append("priority_reordering")
        
        # Optimisation 2: Regrouper par département
        if options.get("optimize_department", False):
            steps.sort(key=lambda s: (s.department, s.sequence))
            optimizations.append("department_grouping")
        
        # Optimisation 3: Équilibrer les charges
        if options.get("balance_load", True):
            self._balance_load(steps)
            optimizations.append("load_balancing")
        
        # Optimisation 4: Cache des résultats similaires
        if self.enable_caching and options.get("use_cache", True):
            optimizations.append("result_caching")
        
        return optimizations
    
    def _balance_load(self, steps: List[ExecutionStep]) -> None:
        """Équilibre la charge entre les agents."""
        # Grouper par agent
        by_agent: Dict[str, List[ExecutionStep]] = defaultdict(list)
        for step in steps:
            by_agent[step.agent_id].append(step)
        
        # Si un agent a trop de tâches, redistribuer si possible
        max_per_agent = len(steps) // max(len(by_agent), 1) + 1
        
        for agent_id, agent_steps in by_agent.items():
            if len(agent_steps) > max_per_agent * 2:
                logger.info(f"Agent {agent_id} overloaded with {len(agent_steps)} tasks")
    
    def _calculate_estimates(
        self,
        steps: List[ExecutionStep]
    ) -> Tuple[int, int, float]:
        """Calcule les estimations totales."""
        # Durée: somme des durées pour séquentiel, max par groupe pour parallèle
        total_duration = 0
        current_group = None
        group_max_duration = 0
        
        for step in steps:
            if step.parallel_group != current_group:
                total_duration += group_max_duration
                current_group = step.parallel_group
                group_max_duration = step.estimated_duration_seconds
            else:
                group_max_duration = max(group_max_duration, step.estimated_duration_seconds)
        
        total_duration += group_max_duration
        
        # Tokens et coûts: somme simple
        total_tokens = sum(s.estimated_llm_tokens for s in steps)
        total_cost = sum(s.estimated_cost_usd for s in steps)
        
        return total_duration, total_tokens, round(total_cost, 4)
    
    async def execute_plan(
        self,
        plan: ExecutionPlan,
        executor: Any,
        on_step_complete: Optional[callable] = None
    ) -> Dict[str, Any]:
        """
        Exécute un plan.
        
        Args:
            plan: Plan à exécuter
            executor: Exécuteur des étapes
            on_step_complete: Callback à chaque étape complétée
            
        Returns:
            Résultats de l'exécution
        """
        completed: Set[str] = set()
        results: Dict[str, Any] = {}
        errors: List[str] = []
        
        while len(completed) < len(plan.steps):
            # Obtenir les étapes prêtes
            ready_steps = plan.get_ready_steps(completed)
            
            if not ready_steps:
                if len(completed) < len(plan.steps):
                    errors.append("Deadlock detected in execution")
                break
            
            # Exécuter en parallèle si possible
            if plan.execution_order in [ExecutionOrder.PARALLEL, ExecutionOrder.MIXED]:
                # Exécuter en parallèle (jusqu'à max_parallel)
                batch = ready_steps[:self.max_parallel]
                tasks = [
                    self._execute_step(step, executor, results)
                    for step in batch
                ]
                step_results = await asyncio.gather(*tasks, return_exceptions=True)
                
                for step, result in zip(batch, step_results):
                    if isinstance(result, Exception):
                        step.status = StepStatus.FAILED
                        step.error = str(result)
                        errors.append(f"Step {step.id}: {result}")
                    else:
                        step.status = StepStatus.COMPLETED
                        step.result = result
                        results[step.subtask_id] = result
                    
                    completed.add(step.id)
                    
                    if on_step_complete:
                        on_step_complete(step)
            else:
                # Exécuter séquentiellement
                for step in ready_steps:
                    try:
                        result = await self._execute_step(step, executor, results)
                        step.status = StepStatus.COMPLETED
                        step.result = result
                        results[step.subtask_id] = result
                    except Exception as e:
                        step.status = StepStatus.FAILED
                        step.error = str(e)
                        errors.append(f"Step {step.id}: {e}")
                    
                    completed.add(step.id)
                    
                    if on_step_complete:
                        on_step_complete(step)
        
        return {
            "success": len(errors) == 0,
            "completed_steps": len(completed),
            "total_steps": len(plan.steps),
            "results": results,
            "errors": errors
        }
    
    async def _execute_step(
        self,
        step: ExecutionStep,
        executor: Any,
        previous_results: Dict[str, Any]
    ) -> Any:
        """Exécute une étape."""
        step.status = StepStatus.RUNNING
        step.started_at = datetime.utcnow()
        
        try:
            # Préparer le contexte avec les résultats précédents
            context = {
                "previous_results": {
                    dep: previous_results.get(dep)
                    for dep in step.dependencies
                    if dep in previous_results
                }
            }
            
            # Exécuter via l'executor
            if hasattr(executor, 'execute_step'):
                result = await executor.execute_step(step, context)
            elif callable(executor):
                result = await executor(step, context)
            else:
                result = {"status": "simulated", "step_id": step.id}
            
            step.completed_at = datetime.utcnow()
            return result
            
        except Exception as e:
            step.completed_at = datetime.utcnow()
            raise
    
    def visualize_plan(self, plan: ExecutionPlan) -> str:
        """Génère une visualisation textuelle du plan."""
        lines = [
            f"═══ Execution Plan: {plan.task_id} ═══",
            f"Order: {plan.execution_order.value}",
            f"Steps: {len(plan.steps)}",
            f"Estimated duration: {plan.estimated_duration_seconds}s",
            f"Estimated cost: ${plan.estimated_cost_usd:.4f}",
            "",
            "Steps:"
        ]
        
        current_group = None
        for step in plan.steps:
            if step.parallel_group != current_group:
                current_group = step.parallel_group
                if step.can_parallelize:
                    lines.append(f"\n  [Parallel Group {current_group}]")
                else:
                    lines.append(f"\n  [Sequential]")
            
            deps = f" (depends: {step.dependencies})" if step.dependencies else ""
            lines.append(f"    • {step.id}: {step.agent_type}@{step.department}{deps}")
        
        lines.append(f"\nOptimizations: {', '.join(plan.optimizations_applied)}")
        
        return "\n".join(lines)


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    "ExecutionPlanner",
    "ExecutionPlan",
    "ExecutionStep",
    "ExecutionOrder",
    "StepStatus"
]
