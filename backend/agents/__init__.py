"""
CHE·NU Agent System

168 Agents organized in 4 levels:
- L0: Trunk (Directive Guard) - Observes, never blocks
- L1: Sphere Leads (10 agents) - One per sphere
- L2: Specialists (50+ agents) - Domain-specific
- L3: Workers (100+ agents) - Atomic tasks

ETHICAL CONSTRAINTS (IMMUTABLE):
- Agents are tools, not actors
- No agent calls another automatically
- No recommendations of decisions
- All delegation passes through user
"""
from .base import (
    AgentLevel,
    AgentCapability,
    AgentContext,
    AgentResponse,
    BaseAgent,
    TrunkAgent,
    SphereLeadAgent,
    SpecialistAgent,
    WorkerAgent,
)
from .orchestrator import AgentOrchestrator, get_orchestrator

__all__ = [
    # Enums
    "AgentLevel",
    "AgentCapability",
    # Data classes
    "AgentContext",
    "AgentResponse",
    # Base classes
    "BaseAgent",
    "TrunkAgent",
    "SphereLeadAgent",
    "SpecialistAgent",
    "WorkerAgent",
    # Orchestrator
    "AgentOrchestrator",
    "get_orchestrator",
]
