"""
CHE·NU - My Team Service
========================
Service backend pour la gestion de la hiérarchie des agents IA.

Fonctionnalités:
- Arbre hiérarchique des agents
- Assignation d'agents aux espaces/tâches
- Communication inter-agents
- Monitoring des performances
- Délégation de tâches

Version: 1.0
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID, uuid4
from enum import Enum
from dataclasses import dataclass, field
from pydantic import BaseModel, Field
import json
import asyncpg
from fastapi import HTTPException


# ============================================================================
# ENUMS & CONSTANTS
# ============================================================================

class AgentRole(str, Enum):
    """Rôles des agents dans la hiérarchie"""
    MASTER = "master"           # Nova - Agent principal
    DIRECTOR = "director"       # Directeurs de département
    SPECIALIST = "specialist"   # Spécialistes (comptable, RH, etc.)
    ASSISTANT = "assistant"     # Assistants de tâches
    WORKER = "worker"          # Agents d'exécution


class AgentStatus(str, Enum):
    """États des agents"""
    ACTIVE = "active"
    IDLE = "idle"
    BUSY = "busy"
    OFFLINE = "offline"
    LEARNING = "learning"


class AgentDepartment(str, Enum):
    """Départements des agents"""
    GENERAL = "general"
    FINANCE = "finance"
    HR = "hr"
    MARKETING = "marketing"
    SALES = "sales"
    OPERATIONS = "operations"
    IT = "it"
    CREATIVE = "creative"
    LEGAL = "legal"
    RESEARCH = "research"


# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class AgentCapability(BaseModel):
    """Capacité d'un agent"""
    key: str
    label: str
    proficiency: float = Field(ge=0, le=1, default=0.8)  # 0-1
    description: Optional[str] = None


class AgentCreate(BaseModel):
    """Schéma pour créer un agent"""
    name: str = Field(..., min_length=2, max_length=100)
    role: AgentRole
    department: AgentDepartment
    description: Optional[str] = None
    avatar_url: Optional[str] = None
    personality: Optional[str] = None  # Prompt de personnalité
    capabilities: List[AgentCapability] = []
    parent_agent_id: Optional[UUID] = None  # Agent supérieur
    scopes: List[str] = []  # Espaces assignés


class AgentUpdate(BaseModel):
    """Schéma pour mettre à jour un agent"""
    name: Optional[str] = None
    description: Optional[str] = None
    avatar_url: Optional[str] = None
    personality: Optional[str] = None
    capabilities: Optional[List[AgentCapability]] = None
    status: Optional[AgentStatus] = None


class AgentResponse(BaseModel):
    """Réponse agent"""
    id: UUID
    name: str
    role: str
    department: str
    description: Optional[str]
    avatar_url: Optional[str]
    personality: Optional[str]
    capabilities: List[Dict[str, Any]]
    status: str
    parent_agent_id: Optional[UUID]
    scopes: List[str]
    tasks_completed: int
    current_task: Optional[str]
    performance_score: float
    created_at: datetime
    children: List['AgentResponse'] = []


class TaskAssignment(BaseModel):
    """Assignation de tâche à un agent"""
    agent_id: UUID
    task_type: str
    task_data: Dict[str, Any]
    priority: int = Field(ge=1, le=5, default=3)
    deadline: Optional[datetime] = None


class AgentMessage(BaseModel):
    """Message inter-agents"""
    from_agent_id: UUID
    to_agent_id: UUID
    message_type: str  # 'task', 'report', 'question', 'update'
    content: Dict[str, Any]
    requires_response: bool = False


# ============================================================================
# SERVICE PRINCIPAL
# ============================================================================

class MyTeamService:
    """
    Service de gestion de l'équipe d'agents IA
    
    Responsabilités:
    - CRUD des agents
    - Gestion de la hiérarchie
    - Assignation de tâches
    - Communication inter-agents
    - Monitoring des performances
    """
    
    def __init__(self, db_pool: asyncpg.Pool):
        self.db = db_pool
        self._agents_cache: Dict[UUID, AgentResponse] = {}
    
    # ========================================================================
    # CRUD AGENTS
    # ========================================================================
    
    async def create_agent(
        self,
        data: AgentCreate,
        owner_id: UUID
    ) -> AgentResponse:
        """Crée un nouvel agent dans l'équipe"""
        
        # Vérifier que le parent existe si spécifié
        if data.parent_agent_id:
            parent = await self.get_agent(data.parent_agent_id)
            if not parent:
                raise HTTPException(status_code=404, detail="Agent parent non trouvé")
        
        query = """
            INSERT INTO agents (
                name, role, department, description, avatar_url,
                personality, capabilities, status, parent_agent_id,
                scopes, owner_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query,
            data.name,
            data.role.value,
            data.department.value,
            data.description,
            data.avatar_url,
            data.personality,
            json.dumps([c.dict() for c in data.capabilities]),
            AgentStatus.IDLE.value,
            data.parent_agent_id,
            data.scopes,
            owner_id
        )
        
        return self._row_to_response(row)
    
    async def get_agent(self, agent_id: UUID) -> Optional[AgentResponse]:
        """Récupère un agent par son ID"""
        query = "SELECT * FROM agents WHERE id = $1"
        row = await self.db.fetchrow(query, agent_id)
        return self._row_to_response(row) if row else None
    
    async def update_agent(
        self,
        agent_id: UUID,
        data: AgentUpdate
    ) -> Optional[AgentResponse]:
        """Met à jour un agent"""
        updates = []
        params = []
        param_idx = 1
        
        if data.name is not None:
            updates.append(f"name = ${param_idx}")
            params.append(data.name)
            param_idx += 1
        
        if data.description is not None:
            updates.append(f"description = ${param_idx}")
            params.append(data.description)
            param_idx += 1
        
        if data.avatar_url is not None:
            updates.append(f"avatar_url = ${param_idx}")
            params.append(data.avatar_url)
            param_idx += 1
        
        if data.personality is not None:
            updates.append(f"personality = ${param_idx}")
            params.append(data.personality)
            param_idx += 1
        
        if data.capabilities is not None:
            updates.append(f"capabilities = ${param_idx}")
            params.append(json.dumps([c.dict() for c in data.capabilities]))
            param_idx += 1
        
        if data.status is not None:
            updates.append(f"status = ${param_idx}")
            params.append(data.status.value)
            param_idx += 1
        
        if not updates:
            return await self.get_agent(agent_id)
        
        updates.append("updated_at = NOW()")
        params.append(agent_id)
        
        query = f"""
            UPDATE agents
            SET {', '.join(updates)}
            WHERE id = ${param_idx}
            RETURNING *
        """
        
        row = await self.db.fetchrow(query, *params)
        return self._row_to_response(row) if row else None
    
    async def delete_agent(self, agent_id: UUID) -> bool:
        """Supprime un agent (et réassigne ses enfants)"""
        # Récupérer l'agent
        agent = await self.get_agent(agent_id)
        if not agent:
            return False
        
        # Réassigner les enfants au parent de l'agent supprimé
        await self.db.execute("""
            UPDATE agents
            SET parent_agent_id = $2
            WHERE parent_agent_id = $1
        """, agent_id, agent.parent_agent_id)
        
        # Supprimer l'agent
        await self.db.execute("DELETE FROM agents WHERE id = $1", agent_id)
        return True
    
    # ========================================================================
    # HIÉRARCHIE
    # ========================================================================
    
    async def get_team_hierarchy(
        self,
        owner_id: UUID,
        root_agent_id: Optional[UUID] = None
    ) -> List[AgentResponse]:
        """
        Retourne l'arbre hiérarchique des agents.
        Si root_agent_id est None, retourne depuis Nova (master).
        """
        # Récupérer tous les agents de l'utilisateur
        query = """
            SELECT * FROM agents
            WHERE owner_id = $1
            ORDER BY 
                CASE role 
                    WHEN 'master' THEN 1 
                    WHEN 'director' THEN 2 
                    WHEN 'specialist' THEN 3 
                    WHEN 'assistant' THEN 4 
                    WHEN 'worker' THEN 5 
                END,
                name
        """
        rows = await self.db.fetch(query, owner_id)
        agents = {row['id']: self._row_to_response(row) for row in rows}
        
        # Construire l'arbre
        root_agents = []
        for agent in agents.values():
            if agent.parent_agent_id and agent.parent_agent_id in agents:
                parent = agents[agent.parent_agent_id]
                parent.children.append(agent)
            elif root_agent_id is None or agent.id == root_agent_id:
                if agent.role == AgentRole.MASTER.value or agent.id == root_agent_id:
                    root_agents.append(agent)
        
        return root_agents
    
    async def get_agents_by_department(
        self,
        owner_id: UUID,
        department: AgentDepartment
    ) -> List[AgentResponse]:
        """Récupère tous les agents d'un département"""
        query = """
            SELECT * FROM agents
            WHERE owner_id = $1 AND department = $2
            ORDER BY role, name
        """
        rows = await self.db.fetch(query, owner_id, department.value)
        return [self._row_to_response(row) for row in rows]
    
    async def get_agents_by_scope(
        self,
        owner_id: UUID,
        scope: str
    ) -> List[AgentResponse]:
        """Récupère tous les agents assignés à un scope"""
        query = """
            SELECT * FROM agents
            WHERE owner_id = $1 AND $2 = ANY(scopes)
            ORDER BY role, name
        """
        rows = await self.db.fetch(query, owner_id, scope)
        return [self._row_to_response(row) for row in rows]
    
    async def assign_to_scope(
        self,
        agent_id: UUID,
        scope: str
    ) -> bool:
        """Assigne un agent à un scope"""
        result = await self.db.execute("""
            UPDATE agents
            SET scopes = array_append(scopes, $2)
            WHERE id = $1 AND NOT ($2 = ANY(scopes))
        """, agent_id, scope)
        return "UPDATE 1" in result
    
    async def remove_from_scope(
        self,
        agent_id: UUID,
        scope: str
    ) -> bool:
        """Retire un agent d'un scope"""
        result = await self.db.execute("""
            UPDATE agents
            SET scopes = array_remove(scopes, $2)
            WHERE id = $1
        """, agent_id, scope)
        return "UPDATE 1" in result
    
    # ========================================================================
    # TÂCHES
    # ========================================================================
    
    async def assign_task(
        self,
        assignment: TaskAssignment
    ) -> Dict[str, Any]:
        """Assigne une tâche à un agent"""
        # Vérifier que l'agent existe et est disponible
        agent = await self.get_agent(assignment.agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent non trouvé")
        
        if agent.status == AgentStatus.OFFLINE.value:
            raise HTTPException(status_code=400, detail="Agent hors ligne")
        
        # Créer la tâche
        query = """
            INSERT INTO agent_tasks (
                agent_id, task_type, task_data, priority, deadline, status
            ) VALUES ($1, $2, $3, $4, $5, 'pending')
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query,
            assignment.agent_id,
            assignment.task_type,
            json.dumps(assignment.task_data),
            assignment.priority,
            assignment.deadline
        )
        
        # Mettre à jour le statut de l'agent
        await self.db.execute("""
            UPDATE agents
            SET status = 'busy', current_task = $2
            WHERE id = $1
        """, assignment.agent_id, row['id'])
        
        return dict(row)
    
    async def get_agent_tasks(
        self,
        agent_id: UUID,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Récupère les tâches d'un agent"""
        if status:
            query = """
                SELECT * FROM agent_tasks
                WHERE agent_id = $1 AND status = $2
                ORDER BY priority DESC, created_at DESC
            """
            rows = await self.db.fetch(query, agent_id, status)
        else:
            query = """
                SELECT * FROM agent_tasks
                WHERE agent_id = $1
                ORDER BY priority DESC, created_at DESC
            """
            rows = await self.db.fetch(query, agent_id)
        
        return [dict(row) for row in rows]
    
    async def complete_task(
        self,
        task_id: UUID,
        result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Marque une tâche comme complétée"""
        query = """
            UPDATE agent_tasks
            SET status = 'completed', result = $2, completed_at = NOW()
            WHERE id = $1
            RETURNING *
        """
        row = await self.db.fetchrow(query, task_id, json.dumps(result))
        
        if row:
            # Mettre à jour les stats de l'agent
            await self.db.execute("""
                UPDATE agents
                SET tasks_completed = tasks_completed + 1,
                    status = 'idle',
                    current_task = NULL
                WHERE id = $1
            """, row['agent_id'])
        
        return dict(row) if row else {}
    
    # ========================================================================
    # COMMUNICATION
    # ========================================================================
    
    async def send_message(
        self,
        message: AgentMessage
    ) -> Dict[str, Any]:
        """Envoie un message entre agents"""
        query = """
            INSERT INTO agent_messages (
                from_agent_id, to_agent_id, message_type,
                content, requires_response
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query,
            message.from_agent_id,
            message.to_agent_id,
            message.message_type,
            json.dumps(message.content),
            message.requires_response
        )
        
        return dict(row)
    
    async def get_messages(
        self,
        agent_id: UUID,
        unread_only: bool = False
    ) -> List[Dict[str, Any]]:
        """Récupère les messages d'un agent"""
        if unread_only:
            query = """
                SELECT * FROM agent_messages
                WHERE to_agent_id = $1 AND read_at IS NULL
                ORDER BY created_at DESC
            """
        else:
            query = """
                SELECT * FROM agent_messages
                WHERE to_agent_id = $1 OR from_agent_id = $1
                ORDER BY created_at DESC
                LIMIT 100
            """
        
        rows = await self.db.fetch(query, agent_id)
        return [dict(row) for row in rows]
    
    # ========================================================================
    # PERFORMANCE
    # ========================================================================
    
    async def get_agent_stats(
        self,
        agent_id: UUID
    ) -> Dict[str, Any]:
        """Retourne les statistiques d'un agent"""
        query = """
            SELECT 
                a.*,
                COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'completed') as completed_tasks,
                COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'pending') as pending_tasks,
                AVG(EXTRACT(EPOCH FROM (t.completed_at - t.created_at))) as avg_task_duration
            FROM agents a
            LEFT JOIN agent_tasks t ON t.agent_id = a.id
            WHERE a.id = $1
            GROUP BY a.id
        """
        row = await self.db.fetchrow(query, agent_id)
        
        if not row:
            return {}
        
        return {
            'agent': self._row_to_response(row).dict(),
            'stats': {
                'completed_tasks': row['completed_tasks'] or 0,
                'pending_tasks': row['pending_tasks'] or 0,
                'avg_task_duration_seconds': row['avg_task_duration'] or 0,
                'performance_score': row['performance_score']
            }
        }
    
    async def get_team_overview(
        self,
        owner_id: UUID
    ) -> Dict[str, Any]:
        """Vue d'ensemble de toute l'équipe"""
        query = """
            SELECT 
                COUNT(*) as total_agents,
                COUNT(*) FILTER (WHERE status = 'active') as active_agents,
                COUNT(*) FILTER (WHERE status = 'busy') as busy_agents,
                COUNT(*) FILTER (WHERE status = 'idle') as idle_agents,
                SUM(tasks_completed) as total_tasks_completed,
                AVG(performance_score) as avg_performance
            FROM agents
            WHERE owner_id = $1
        """
        row = await self.db.fetchrow(query, owner_id)
        
        # Agents par département
        dept_query = """
            SELECT department, COUNT(*) as count
            FROM agents
            WHERE owner_id = $1
            GROUP BY department
        """
        dept_rows = await self.db.fetch(dept_query, owner_id)
        
        return {
            'overview': {
                'total_agents': row['total_agents'] or 0,
                'active_agents': row['active_agents'] or 0,
                'busy_agents': row['busy_agents'] or 0,
                'idle_agents': row['idle_agents'] or 0,
                'total_tasks_completed': row['total_tasks_completed'] or 0,
                'avg_performance': float(row['avg_performance'] or 0)
            },
            'by_department': {r['department']: r['count'] for r in dept_rows}
        }
    
    # ========================================================================
    # HELPERS
    # ========================================================================
    
    def _row_to_response(self, row: asyncpg.Record) -> AgentResponse:
        """Convertit un row DB en response"""
        capabilities = row['capabilities']
        if isinstance(capabilities, str):
            capabilities = json.loads(capabilities)
        
        return AgentResponse(
            id=row['id'],
            name=row['name'],
            role=row['role'],
            department=row['department'],
            description=row['description'],
            avatar_url=row['avatar_url'],
            personality=row['personality'],
            capabilities=capabilities or [],
            status=row['status'],
            parent_agent_id=row['parent_agent_id'],
            scopes=row['scopes'] or [],
            tasks_completed=row['tasks_completed'] or 0,
            current_task=str(row['current_task']) if row['current_task'] else None,
            performance_score=float(row['performance_score'] or 0.8),
            created_at=row['created_at'],
            children=[]
        )


# ============================================================================
# FACTORY
# ============================================================================

_service_instance: Optional[MyTeamService] = None

async def get_my_team_service(db_pool: asyncpg.Pool) -> MyTeamService:
    """Factory pour obtenir le service"""
    global _service_instance
    if _service_instance is None:
        _service_instance = MyTeamService(db_pool)
    return _service_instance
