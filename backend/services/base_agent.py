"""
CHE·NU - Base Agent Class
=========================
Foundation class for all CHE·NU agents.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Callable
from datetime import datetime
from enum import Enum
import uuid
import json


class AgentState(Enum):
    IDLE = "idle"
    PROCESSING = "processing"
    WAITING = "waiting"
    ERROR = "error"
    DELEGATING = "delegating"


class AgentLevel(Enum):
    L0_MASTER = "L0"  # Master Mind / Nova
    L1_DIRECTOR = "L1"  # Department Directors
    L2_MANAGER = "L2"  # Managers
    L3_SPECIALIST = "L3"  # Specialists
    L4_ASSISTANT = "L4"  # Assistants


@dataclass
class AgentMessage:
    """Message structure for agent communication."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    sender: str = ""
    receiver: str = ""
    content: Any = None
    message_type: str = "request"  # request, response, broadcast, error
    timestamp: datetime = field(default_factory=datetime.utcnow)
    context: Dict[str, Any] = field(default_factory=dict)
    priority: int = 5  # 1-10, 1 = highest
    
    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "sender": self.sender,
            "receiver": self.receiver,
            "content": self.content,
            "message_type": self.message_type,
            "timestamp": self.timestamp.isoformat(),
            "context": self.context,
            "priority": self.priority,
        }


@dataclass
class AgentResponse:
    """Standard response from an agent."""
    success: bool
    data: Any = None
    message: str = ""
    agent_id: str = ""
    processing_time_ms: float = 0
    delegated_to: Optional[str] = None
    
    def to_dict(self) -> Dict:
        return {
            "success": self.success,
            "data": self.data,
            "message": self.message,
            "agent_id": self.agent_id,
            "processing_time_ms": self.processing_time_ms,
            "delegated_to": self.delegated_to,
        }


class BaseAgent(ABC):
    """
    Base class for all CHE·NU agents.
    
    Implements the core functionality that all agents share:
    - Message handling
    - State management
    - Delegation
    - Logging
    - Tool execution
    """
    
    def __init__(
        self,
        agent_id: str,
        name: str,
        level: AgentLevel,
        description: str = "",
        system_prompt: str = "",
        tools: List[str] = None,
        reports_to: Optional[str] = None,
        delegates_to: List[str] = None,
    ):
        self.agent_id = agent_id
        self.name = name
        self.level = level
        self.description = description
        self.system_prompt = system_prompt
        self.tools = tools or []
        self.reports_to = reports_to
        self.delegates_to = delegates_to or []
        
        self.state = AgentState.IDLE
        self.message_queue: List[AgentMessage] = []
        self.history: List[Dict] = []
        self._tool_registry: Dict[str, Callable] = {}
        
    @abstractmethod
    async def process(self, message: AgentMessage) -> AgentResponse:
        """
        Process an incoming message.
        Must be implemented by subclasses.
        """
        pass
    
    async def receive(self, message: AgentMessage) -> AgentResponse:
        """Receive and process a message."""
        start_time = datetime.utcnow()
        
        try:
            self.state = AgentState.PROCESSING
            self.message_queue.append(message)
            
            # Log incoming message
            self._log("Received message", message.to_dict())
            
            # Check if we should delegate
            if self._should_delegate(message):
                return await self._delegate(message)
            
            # Process the message
            response = await self.process(message)
            response.agent_id = self.agent_id
            response.processing_time_ms = (datetime.utcnow() - start_time).total_seconds() * 1000
            
            # Log response
            self._log("Sent response", response.to_dict())
            
            return response
            
        except Exception as e:
            self.state = AgentState.ERROR
            return AgentResponse(
                success=False,
                message=f"Error processing message: {str(e)}",
                agent_id=self.agent_id,
            )
        finally:
            self.state = AgentState.IDLE
    
    def _should_delegate(self, message: AgentMessage) -> bool:
        """Determine if this message should be delegated."""
        # Override in subclasses for custom delegation logic
        return False
    
    async def _delegate(self, message: AgentMessage) -> AgentResponse:
        """Delegate message to another agent."""
        self.state = AgentState.DELEGATING
        # Implementation would route to appropriate agent
        return AgentResponse(
            success=True,
            message="Delegated to appropriate agent",
            delegated_to=self.delegates_to[0] if self.delegates_to else None,
        )
    
    def register_tool(self, name: str, func: Callable):
        """Register a tool for this agent to use."""
        self._tool_registry[name] = func
    
    async def execute_tool(self, tool_name: str, **kwargs) -> Any:
        """Execute a registered tool."""
        if tool_name not in self._tool_registry:
            raise ValueError(f"Tool '{tool_name}' not registered")
        
        tool = self._tool_registry[tool_name]
        return await tool(**kwargs) if callable(tool) else tool
    
    def _log(self, action: str, data: Dict):
        """Log agent activity."""
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "agent_id": self.agent_id,
            "action": action,
            "data": data,
        }
        self.history.append(entry)
        # Keep only last 100 entries
        if len(self.history) > 100:
            self.history = self.history[-100:]
    
    def get_status(self) -> Dict:
        """Get current agent status."""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "level": self.level.value,
            "state": self.state.value,
            "queue_size": len(self.message_queue),
            "tools_available": self.tools,
            "reports_to": self.reports_to,
            "delegates_to": self.delegates_to,
        }
    
    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} id={self.agent_id} name={self.name} level={self.level.value}>"
