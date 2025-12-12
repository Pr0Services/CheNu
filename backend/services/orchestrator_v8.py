# core/orchestrator_v8.py

from __future__ import annotations
from typing import Any, Dict, Optional

import logging
import os

from . import (
    MasterMind,
    MasterMindConfig,
    create_master_mind,
    ExecutionPhase,
    AssemblyStrategy,
)
from .routing_engine import RoutingEngine, AGENT_HIERARCHY  # si besoin de stats 
from ..registry import create_agent_registry, AgentRegistry  
from ..router import LLMRouter
from ..models import Database  
from ..schemas.message_schema import Conversation  # pour historique, si utile 
from ..schemas.task_schema import TaskInput, TaskContext, TaskType, TaskPriority  
from ..agent_personalities import AGENT_TEMPLATES  
from ..templates_bridge import build_template_agents  # (C - fichier ci-dessous)


logger = logging.getLogger("CHE·NU.OrchestratorV8")


class CheNuOrchestratorV8:
    """
    ðŸŽ›ï¸ CheNuOrchestratorV8
    - Point d'entrÃ©e unique pour CHE·NU
    - Initialise MasterMind + AgentRegistry + Multi-LLM + Database
    - Fournit des mÃ©thodes simples pour l'API (chat, tÃ¢ches, stats)
    """

    def __init__(
        self,
        db: Optional[Database],
        llm_router: LLMRouter,
        master_mind: MasterMind,
        agent_registry: AgentRegistry,
    ):
        self.db = db
        self.llm_router = llm_router
        self.master_mind = master_mind
        self.agent_registry = agent_registry

        self.started = False
        self.request_counter = 0

    # ------------------------------------------------------------------
    # FACTORY
    # ------------------------------------------------------------------
    @classmethod
    def from_env(cls) -> "CheNuOrchestratorV8":
        """
        Initialise l'orchestrateur en lisant les variables d'environnement.
        Ex:
          CHE·NU_DB_URL
        """
        logger.info("ðŸš€ Initializing CheNuOrchestratorV8.from_env()")

        # 1) Database
        db_url = os.getenv("CHE·NU_DB_URL")
        db = Database(db_url) if db_url else None
        if db:
            logger.info(f"ðŸ“¦ Database initialized: {db_url}")
        else:
            logger.warning("âš ï¸ No CHE·NU_DB_URL set - running without DB")

        # 2) Multi-LLM Router
        llm_router = LLMRouter.from_env()  # Ã  implÃ©menter si pas dÃ©jÃ  fait

        # 3) Agent Registry + Templates
        #    a) Registry de base (directors + specialists)
        agent_registry = create_agent_registry(llm_client=llm_router)

        #    b) Agents template (AGENT_TEMPLATES â†’ BaseAgent)
        build_template_agents(agent_registry, llm_router, AGENT_TEMPLATES)

        # 4) MasterMind config
        mm_config = MasterMindConfig(
            default_execution_phase=ExecutionPhase.FULL,
            default_assembly_strategy=AssemblyStrategy.SMART,
            max_parallel_tasks=10,
            enable_streaming=True,
            enable_caching=True,
        )

        master_mind = create_master_mind(
            llm_client=llm_router,
            agent_registry=agent_registry,
            routing_engine=None,  # laisser la factory interne gÃ©rer si besoin
            config=mm_config,
        )

        orch = cls(
            db=db,
            llm_router=llm_router,
            master_mind=master_mind,
            agent_registry=agent_registry,
        )
        orch.started = True
        logger.info("âœ… CheNuOrchestratorV8 ready")
        return orch

    # ------------------------------------------------------------------
    # FONCTIONS PRINCIPALES
    # ------------------------------------------------------------------
    async def chat_with_nova(
        self,
        user_id: str,
        message: str,
        conversation_id: Optional[str] = None,
        options: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Route une requÃªte de chat via MasterMind (Nova + dÃ©lÃ©gation).
        """
        self.request_counter += 1

        result = await self.master_mind.process_request(
            request=message,
            user_id=user_id,
            options={
                "conversation_id": conversation_id,
                **(options or {}),
            },
        )

        return {
            "response": result.get("output", "Je n'ai pas pu traiter votre demande."),
            "conversation_id": conversation_id or result.get("task_id"),
            "department": result.get("department"),
            "agents_involved": result.get("agents_used", []),
            "meta": {
                "tokens_used": result.get("tokens_used"),
                "cost_usd": result.get("cost_usd"),
            },
        }

    async def run_task(
        self,
        task: TaskInput,
        context: Optional[TaskContext] = None,
    ) -> Dict[str, Any]:
        """
        ExÃ©cute une tÃ¢che structurÃ©e (TaskInput) via MasterMind.
        """
        self.request_counter += 1

        payload = {
            "description": task.description,
            "type": task.type.value if hasattr(task.type, "value") else str(task.type),
            "priority": task.priority.value if hasattr(task.priority, "value") else str(task.priority),
            "metadata": task.metadata or {},
        }

        result = await self.master_mind.process_structured_task(
            task_input=payload,
            context=context.model_dump() if context else {},
        )

        return result

    def get_dashboard(self, user_id: str) -> Dict[str, Any]:
        """
        Petit dashboard utilisateur (statique ou connectÃ© au DB).
        """
        # Si tu veux, tu peux brancher ici les stats SQL (tokens, coÃ»ts, etc.)
        return {
            "user": {"id": user_id},
            "budget": {
                "tokens": {"daily_used": 0, "daily_limit": 100000},
                "cost": {"daily_spent": 0.0, "daily_limit": 10.0},
            },
            "agents": {
                "total_types": len(self.agent_registry.get_statistics().get("agent_details", [])),
            },
            "execution": {
                "max_parallel_tasks": 10,
            },
        }

    def get_stats(self) -> Dict[str, Any]:
        """
        Stats globales (pour /health ou /info).
        """
        return {
            "orchestrator": {"state": "ready" if self.started else "stopped",
                             "requests_processed": self.request_counter},
            "master_mind": self.master_mind.get_statistics(),
            "agents": self.agent_registry.get_statistics(),
        }

    async def shutdown(self) -> None:
        logger.info("ðŸ›‘ Shutting down CheNuOrchestratorV8...")
        self.agent_registry.shutdown()
        self.master_mind.shutdown()
        self.started = False
        logger.info("âœ… CheNuOrchestratorV8 stopped")
# core/orchestrator_v8.py (ajout dans la classe CheNuOrchestratorV8)

    def get_agents_map(self) -> Dict[str, Any]:
        """
        Retourne une carte complÃ¨te des agents:
        - stats (par niveau, par dÃ©partement)
        - liste des agents
        - hiÃ©rarchie (qui reporte Ã  qui)
        """
        reg = self.agent_registry
        stats = reg.get_statistics()

        nodes = []
        for agent_id, agent in reg._agents.items():  # accÃ¨s interne OK ici
            cfg = agent.config
            nodes.append({
                "id": agent_id,
                "name": agent.name,
                "level": agent.level.value if agent.level else None,
                "department": agent.department.value if agent.department else None,
                "reports_to": cfg.report_to,
                "status": agent.status.value,
                "capabilities": [str(c) for c in agent.capabilities] if agent.capabilities else [],
                "tasks_completed": agent.metrics.tasks_completed,
                "total_cost_usd": agent.metrics.total_cost_usd,
            })

        return {
            "stats": stats,
            "hierarchy": reg._hierarchy,  # {supervisor_id: [subordinates]}
            "agents": nodes,
        }
# core/orchestrator_v8.py (ajout dans la classe CheNuOrchestratorV8)

    async def plan_project_workflow(
        self,
        user_id: str,
        project_description: str,
        project_id: Optional[str] = None,
        company_id: Optional[str] = None,
        options: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Utilise MasterMind + RoutingEngine + TaskDecomposer + ExecutionPlanner
        pour produire un workflow complet Ã  partir d'une description de projet.
        """
        options = options or {}

        # 1) Construire la "request" pour le routage
        request = {
            "description": project_description,
            "project_id": project_id,
            "company_id": company_id,
            "user_id": user_id,
            "options": options,
        }

        # 2) Routage (quel dÃ©partement / agent est le mieux placÃ©)
        routing_result = self.master_mind.routing_engine.route(request)
        routing_dict = routing_result.to_dict()

        # 3) DÃ©composition en sous-tÃ¢ches
        decomposition = await self.master_mind.task_decomposer.decompose(
            request=request,
            routing_result=routing_dict,
        )
        decomposition_dict = decomposition.to_dict()

        # 4) Plan d'exÃ©cution (ExecutionPlanner)
        task_id = decomposition.task_id
        trace_id = options.get("trace_id") or f"trace_{task_id}"

        plan = self.master_mind.execution_planner.create_plan(
            task_id=task_id,
            trace_id=trace_id,
            subtasks=decomposition.subtasks,
            options={"project_id": project_id, "company_id": company_id},
        )
        plan_dict = plan.to_dict()

        # 5) Visualisation lisible
        visualization = self.master_mind.execution_planner.visualize_plan(plan)

        # 6) Sortie complÃ¨te
        return {
            "task_id": task_id,
            "trace_id": trace_id,
            "routing": routing_dict,
            "decomposition": decomposition_dict,
            "execution_plan": plan_dict,
            "visualization": visualization,
        }

