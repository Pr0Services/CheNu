"""
CHE·NU Backend Services
=======================
Complete service layer for CHE·NU platform.
"""

# Core Agent System
from .base_agent import (
    BaseAgent,
    AgentMessage,
    AgentResponse,
    AgentState,
    AgentLevel,
)

# Directors (L1)
from .directors import (
    Director,
    DirectorDepartment,
    DIRECTORS,
    get_director,
    get_all_directors,
    get_directors_by_department,
)

# Specialists (L2/L3)
from .specialists import (
    Specialist,
    SpecialistLevel,
    SpecialistDomain,
    SPECIALISTS,
    get_specialist,
    get_all_specialists,
    get_specialists_by_domain,
    get_specialists_by_level,
    get_team_for_director,
)

# Smart Orchestrator
from .smart_orchestrator import (
    SmartOrchestrator,
    RoutingDecision,
    IntentCategory,
    orchestrator,
    route_request,
)

# Nova Intelligence
from .nova import *
from .nova_intelligence import *

# Core Services
from .master_mind import *
from .cache import *
from .scheduler import *
from .webhook_router import *
from .oauth_manager import *
from .rate_limiter import *
from .workspace_service import *
from .hub import *

# Agent Templates
from .agents_templates import *
from .agent_template_loader import *

# Administration
from .administration import *

__all__ = [
    # Base Agent
    "BaseAgent",
    "AgentMessage",
    "AgentResponse",
    "AgentState",
    "AgentLevel",
    # Directors
    "Director",
    "DirectorDepartment",
    "DIRECTORS",
    "get_director",
    "get_all_directors",
    "get_directors_by_department",
    # Specialists
    "Specialist",
    "SpecialistLevel",
    "SpecialistDomain",
    "SPECIALISTS",
    "get_specialist",
    "get_all_specialists",
    "get_specialists_by_domain",
    "get_specialists_by_level",
    "get_team_for_director",
    # Orchestrator
    "SmartOrchestrator",
    "RoutingDecision",
    "IntentCategory",
    "orchestrator",
    "route_request",
]
