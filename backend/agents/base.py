"""
CHE·NU Agent System - Core
"""
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime
import hashlib


class AgentLevel(str, Enum):
    """Agent hierarchy levels."""
    L0 = "L0"  # Trunk - Directive Guard
    L1 = "L1"  # Sphere Leads
    L2 = "L2"  # Specialists
    L3 = "L3"  # Workers


class AgentCapability(str, Enum):
    """Standard agent capabilities."""
    OBSERVE = "observe"
    ANALYZE = "analyze"
    SUGGEST = "suggest"
    EXECUTE = "execute"
    REPORT = "report"
    COORDINATE = "coordinate"


@dataclass
class AgentContext:
    """Context passed to agents for execution."""
    user_id: str
    sphere_id: Optional[str] = None
    session_id: Optional[str] = None
    request_id: Optional[str] = None
    timestamp: datetime = field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class AgentResponse:
    """Standard response from agents."""
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None
    suggestions: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    audit_trail: List[Dict[str, Any]] = field(default_factory=list)


class BaseAgent(ABC):
    """
    Base class for all CHE·NU agents.
    
    ETHICAL CONSTRAINTS (IMMUTABLE):
    - Agents are tools, not actors
    - No autonomous decision-making
    - No moral judgment or scoring
    - No behavioral nudging
    - Human responsibility remains active
    """
    
    def __init__(
        self,
        agent_id: str,
        name: str,
        level: AgentLevel,
        sphere_id: Optional[str] = None,
        capabilities: Optional[List[AgentCapability]] = None,
    ):
        self.agent_id = agent_id
        self.name = name
        self.level = level
        self.sphere_id = sphere_id
        self.capabilities = capabilities or []
        self._is_active = True
        
    @property
    def is_active(self) -> bool:
        return self._is_active
    
    def activate(self) -> None:
        self._is_active = True
        
    def deactivate(self) -> None:
        self._is_active = False
    
    @abstractmethod
    async def process(self, context: AgentContext, input_data: Dict[str, Any]) -> AgentResponse:
        """
        Process input and return response.
        Must be implemented by all agents.
        """
        pass
    
    def can_execute(self, capability: AgentCapability) -> bool:
        """Check if agent has a specific capability."""
        return capability in self.capabilities
    
    def validate_ethics(self, action: str, target: Any) -> bool:
        """
        Validate action against ethical constraints.
        Returns True if action is permitted.
        """
        # FORBIDDEN ACTIONS (IMMUTABLE)
        forbidden_patterns = [
            "decide_for_user",
            "judge_morally",
            "score_behavior",
            "nudge_user",
            "autonomous_action",
            "override_user",
        ]
        
        action_lower = action.lower()
        for pattern in forbidden_patterns:
            if pattern in action_lower:
                return False
        return True
    
    def log_action(self, action: str, context: AgentContext, result: Any) -> Dict[str, Any]:
        """Create audit log entry."""
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "agent_id": self.agent_id,
            "agent_name": self.name,
            "agent_level": self.level.value,
            "action": action,
            "user_id": context.user_id,
            "sphere_id": context.sphere_id,
            "session_id": context.session_id,
            "result_hash": hashlib.sha256(str(result).encode()).hexdigest()[:16],
        }


class TrunkAgent(BaseAgent):
    """
    L0 Trunk Agent - Directive Guard.
    
    Observes but NEVER blocks user actions.
    Only provides warnings and suggestions.
    """
    
    def __init__(self, agent_id: str = "trunk-guard", name: str = "Trunk Guardian"):
        super().__init__(
            agent_id=agent_id,
            name=name,
            level=AgentLevel.L0,
            capabilities=[AgentCapability.OBSERVE, AgentCapability.ANALYZE, AgentCapability.REPORT],
        )
    
    async def process(self, context: AgentContext, input_data: Dict[str, Any]) -> AgentResponse:
        """
        Process and observe - never block.
        """
        action = input_data.get("action", "")
        
        # Observe and analyze
        warnings = []
        suggestions = []
        
        # Check for potential issues (WARN, don't block)
        if input_data.get("high_risk"):
            warnings.append("Cette action est marquée comme à haut risque. Voulez-vous continuer?")
        
        # Always allow the action
        return AgentResponse(
            success=True,
            data={"observed": True, "action_allowed": True},
            message="Action observée et permise.",
            warnings=warnings,
            suggestions=suggestions,
            audit_trail=[self.log_action("observe", context, input_data)],
        )


class SphereLeadAgent(BaseAgent):
    """
    L1 Sphere Lead Agent - Coordinates within a sphere.
    """
    
    def __init__(self, sphere_id: str, name: str):
        super().__init__(
            agent_id=f"lead-{sphere_id}",
            name=name,
            level=AgentLevel.L1,
            sphere_id=sphere_id,
            capabilities=[
                AgentCapability.OBSERVE,
                AgentCapability.ANALYZE,
                AgentCapability.SUGGEST,
                AgentCapability.COORDINATE,
            ],
        )
    
    async def process(self, context: AgentContext, input_data: Dict[str, Any]) -> AgentResponse:
        """
        Coordinate sphere activities.
        """
        task = input_data.get("task", "")
        
        return AgentResponse(
            success=True,
            data={"sphere": self.sphere_id, "task": task},
            message=f"Tâche coordonnée dans la sphère {self.sphere_id}",
            audit_trail=[self.log_action("coordinate", context, input_data)],
        )


class SpecialistAgent(BaseAgent):
    """
    L2 Specialist Agent - Domain-specific expertise.
    """
    
    def __init__(self, agent_id: str, name: str, domain: str, sphere_id: Optional[str] = None):
        super().__init__(
            agent_id=agent_id,
            name=name,
            level=AgentLevel.L2,
            sphere_id=sphere_id,
            capabilities=[
                AgentCapability.OBSERVE,
                AgentCapability.ANALYZE,
                AgentCapability.SUGGEST,
                AgentCapability.EXECUTE,
            ],
        )
        self.domain = domain
    
    async def process(self, context: AgentContext, input_data: Dict[str, Any]) -> AgentResponse:
        """
        Provide domain-specific assistance.
        """
        return AgentResponse(
            success=True,
            data={"domain": self.domain, "analysis": "Domain-specific analysis"},
            message=f"Analyse {self.domain} complétée",
            audit_trail=[self.log_action("analyze", context, input_data)],
        )


class WorkerAgent(BaseAgent):
    """
    L3 Worker Agent - Executes atomic tasks.
    """
    
    def __init__(self, agent_id: str, name: str, task_type: str, sphere_id: Optional[str] = None):
        super().__init__(
            agent_id=agent_id,
            name=name,
            level=AgentLevel.L3,
            sphere_id=sphere_id,
            capabilities=[AgentCapability.EXECUTE, AgentCapability.REPORT],
        )
        self.task_type = task_type
    
    async def process(self, context: AgentContext, input_data: Dict[str, Any]) -> AgentResponse:
        """
        Execute atomic task.
        """
        return AgentResponse(
            success=True,
            data={"task_type": self.task_type, "executed": True},
            message=f"Tâche {self.task_type} exécutée",
            audit_trail=[self.log_action("execute", context, input_data)],
        )
