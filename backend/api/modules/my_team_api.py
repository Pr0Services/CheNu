"""
CHE·NU - My Team API Endpoints
==============================
Routes REST pour la gestion de l'équipe d'agents IA

Version: 1.0
"""

from typing import Optional, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Body

from ..services.my_team_service import (
    MyTeamService,
    AgentCreate,
    AgentUpdate,
    AgentResponse,
    TaskAssignment,
    AgentMessage,
    AgentRole,
    AgentDepartment,
    get_my_team_service
)
from ..auth import get_current_user, User
from ..database import get_db_pool


router = APIRouter(prefix="/api/v1/team", tags=["My Team"])


# ============================================================================
# DEPENDENCIES
# ============================================================================

async def get_service() -> MyTeamService:
    pool = await get_db_pool()
    return await get_my_team_service(pool)


# ============================================================================
# AGENTS CRUD
# ============================================================================

@router.get("/agents", response_model=List[AgentResponse])
async def list_agents(
    department: Optional[AgentDepartment] = None,
    scope: Optional[str] = None,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les agents de l'utilisateur"""
    if department:
        return await service.get_agents_by_department(current_user.id, department)
    if scope:
        return await service.get_agents_by_scope(current_user.id, scope)
    
    # Retourner tous les agents (flat)
    hierarchy = await service.get_team_hierarchy(current_user.id)
    
    def flatten(agents: List[AgentResponse]) -> List[AgentResponse]:
        result = []
        for agent in agents:
            result.append(agent)
            if agent.children:
                result.extend(flatten(agent.children))
        return result
    
    return flatten(hierarchy)


@router.get("/hierarchy", response_model=List[AgentResponse])
async def get_hierarchy(
    root_agent_id: Optional[UUID] = None,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Retourne l'arbre hiérarchique des agents"""
    return await service.get_team_hierarchy(current_user.id, root_agent_id)


@router.get("/overview")
async def get_overview(
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Vue d'ensemble de l'équipe"""
    return await service.get_team_overview(current_user.id)


@router.post("/agents", response_model=AgentResponse, status_code=201)
async def create_agent(
    data: AgentCreate,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Crée un nouvel agent"""
    return await service.create_agent(data, current_user.id)


@router.get("/agents/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: UUID,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Récupère un agent par son ID"""
    agent = await service.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent non trouvé")
    return agent


@router.patch("/agents/{agent_id}", response_model=AgentResponse)
async def update_agent(
    agent_id: UUID,
    data: AgentUpdate,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Met à jour un agent"""
    agent = await service.update_agent(agent_id, data)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent non trouvé")
    return agent


@router.delete("/agents/{agent_id}", status_code=204)
async def delete_agent(
    agent_id: UUID,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Supprime un agent"""
    success = await service.delete_agent(agent_id)
    if not success:
        raise HTTPException(status_code=404, detail="Agent non trouvé")


@router.get("/agents/{agent_id}/stats")
async def get_agent_stats(
    agent_id: UUID,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Statistiques d'un agent"""
    stats = await service.get_agent_stats(agent_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Agent non trouvé")
    return stats


# ============================================================================
# SCOPES
# ============================================================================

@router.post("/agents/{agent_id}/scopes/{scope}")
async def assign_agent_to_scope(
    agent_id: UUID,
    scope: str,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Assigne un agent à un scope"""
    success = await service.assign_to_scope(agent_id, scope)
    return {"assigned": success}


@router.delete("/agents/{agent_id}/scopes/{scope}")
async def remove_agent_from_scope(
    agent_id: UUID,
    scope: str,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Retire un agent d'un scope"""
    success = await service.remove_from_scope(agent_id, scope)
    return {"removed": success}


# ============================================================================
# TÂCHES
# ============================================================================

@router.post("/tasks")
async def assign_task(
    assignment: TaskAssignment,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Assigne une tâche à un agent"""
    return await service.assign_task(assignment)


@router.get("/agents/{agent_id}/tasks")
async def get_agent_tasks(
    agent_id: UUID,
    status: Optional[str] = None,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Liste les tâches d'un agent"""
    return await service.get_agent_tasks(agent_id, status)


@router.post("/tasks/{task_id}/complete")
async def complete_task(
    task_id: UUID,
    result: dict = Body(...),
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Marque une tâche comme complétée"""
    return await service.complete_task(task_id, result)


# ============================================================================
# MESSAGES
# ============================================================================

@router.post("/messages")
async def send_message(
    message: AgentMessage,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Envoie un message entre agents"""
    return await service.send_message(message)


@router.get("/agents/{agent_id}/messages")
async def get_agent_messages(
    agent_id: UUID,
    unread_only: bool = False,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Liste les messages d'un agent"""
    return await service.get_messages(agent_id, unread_only)


# ============================================================================
# TEMPLATES
# ============================================================================

@router.get("/templates")
async def get_agent_templates(
    service: MyTeamService = Depends(get_service)
):
    """Liste les templates d'agents disponibles"""
    query = "SELECT * FROM agent_templates ORDER BY role, name"
    rows = await service.db.fetch(query)
    return [dict(row) for row in rows]


@router.post("/agents/from-template/{template_id}", response_model=AgentResponse)
async def create_agent_from_template(
    template_id: UUID,
    parent_agent_id: Optional[UUID] = None,
    service: MyTeamService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """Crée un agent à partir d'un template"""
    # Récupérer le template
    query = "SELECT * FROM agent_templates WHERE id = $1"
    template = await service.db.fetchrow(query, template_id)
    
    if not template:
        raise HTTPException(status_code=404, detail="Template non trouvé")
    
    # Créer l'agent
    agent_data = AgentCreate(
        name=template['name'],
        role=AgentRole(template['role']),
        department=AgentDepartment(template['department']),
        description=template['description'],
        avatar_url=template['avatar_url'],
        personality=template['personality'],
        capabilities=[],  # Sera rempli depuis le template
        parent_agent_id=parent_agent_id
    )
    
    return await service.create_agent(agent_data, current_user.id)
