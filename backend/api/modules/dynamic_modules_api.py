"""
CHE·NU - Dynamic Modules API Endpoints
======================================
Endpoints REST pour la gestion des modules dynamiques.

Routes:
- GET    /api/v1/modules/dynamic                    - Lister tous les modules
- GET    /api/v1/modules/dynamic/{scope}            - Modules par scope
- POST   /api/v1/modules/dynamic                    - Créer un module
- DELETE /api/v1/modules/dynamic/{id}               - Désactiver un module
- POST   /api/v1/modules/proposals                  - Proposer un module (IA)
- GET    /api/v1/modules/proposals                  - Lister mes propositions
- POST   /api/v1/modules/proposals/{id}/approve     - Approuver une proposition
- POST   /api/v1/modules/proposals/{id}/reject      - Rejeter une proposition
- GET    /api/v1/modules/merged/{scope}             - Modules noyau + dynamiques
- POST   /api/v1/modules/route                      - Router une action

Version: 1.0
"""

from typing import Optional, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from pydantic import BaseModel, Field

from ..services.dynamic_modules_service import (
    DynamicModulesService,
    DynamicModuleCreate,
    ModuleProposalCreate,
    DynamicModuleResponse,
    Scope,
    get_dynamic_modules_service
)
from ..auth import get_current_user, get_current_agent, User, Agent
from ..database import get_db_pool


router = APIRouter(prefix="/api/v1/modules", tags=["Dynamic Modules"])


# ============================================================================
# DEPENDENCIES
# ============================================================================

async def get_service() -> DynamicModulesService:
    """Injection du service"""
    pool = await get_db_pool()
    return await get_dynamic_modules_service(pool)


# ============================================================================
# SCHEMAS ADDITIONNELS
# ============================================================================

class RouteActionRequest(BaseModel):
    """Requête pour router une action"""
    scope: str
    module_key: str
    action_key: str
    params: dict = {}


class RejectProposalRequest(BaseModel):
    """Requête pour rejeter une proposition"""
    reason: Optional[str] = None


class CategoryResponse(BaseModel):
    """Réponse catégorie"""
    category: str
    label: str
    description: Optional[str]
    is_core: bool


class MergedModulesResponse(BaseModel):
    """Réponse avec modules fusionnés"""
    scope: str
    core: List[dict]
    dynamic: List[dict]
    total_count: int


# ============================================================================
# ENDPOINTS - MODULES DYNAMIQUES
# ============================================================================

@router.get("/dynamic", response_model=List[DynamicModuleResponse])
async def list_all_dynamic_modules(
    scope: Optional[Scope] = Query(None, description="Filtrer par espace"),
    category: Optional[str] = Query(None, description="Filtrer par catégorie"),
    include_disabled: bool = Query(False, description="Inclure les désactivés"),
    service: DynamicModulesService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """
    Liste tous les modules dynamiques de l'utilisateur.
    
    - **scope**: Filtrer par espace CHE·NU (personal, enterprise, etc.)
    - **category**: Filtrer par catégorie dans l'espace
    - **include_disabled**: Inclure les modules désactivés
    """
    return await service.list_dynamic_modules(
        scope=scope.value if scope else None,
        category=category,
        include_disabled=include_disabled,
        user_id=current_user.id
    )


@router.get("/dynamic/{scope}", response_model=List[DynamicModuleResponse])
async def list_modules_by_scope(
    scope: Scope,
    category: Optional[str] = None,
    service: DynamicModulesService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """
    Liste les modules dynamiques pour un espace spécifique.
    """
    return await service.list_dynamic_modules(
        scope=scope.value,
        category=category,
        user_id=current_user.id
    )


@router.post("/dynamic", response_model=DynamicModuleResponse, status_code=201)
async def create_dynamic_module(
    data: DynamicModuleCreate,
    auto_approve: bool = Query(False, description="Approuver automatiquement"),
    service: DynamicModulesService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """
    Crée un nouveau module dynamique.
    
    **Règles:**
    - Le scope doit être valide (un des 10 espaces CHE·NU)
    - La catégorie doit exister dans le scope
    - La clé (key) doit être unique dans le scope
    - La clé doit être en snake_case
    """
    return await service.create_dynamic_module(
        data=data,
        created_by_user=current_user.id,
        auto_approve=auto_approve or current_user.is_admin
    )


@router.get("/dynamic/key/{scope}/{key}", response_model=DynamicModuleResponse)
async def get_module_by_key(
    scope: Scope,
    key: str,
    service: DynamicModulesService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère un module par sa clé unique.
    """
    module = await service.get_module_by_key(scope.value, key)
    if not module:
        raise HTTPException(status_code=404, detail="Module non trouvé")
    return module


@router.delete("/dynamic/{module_id}", status_code=204)
async def disable_module(
    module_id: UUID,
    service: DynamicModulesService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """
    Désactive un module dynamique (soft delete).
    Le module peut être réactivé ultérieurement.
    """
    success = await service.disable_dynamic_module(
        module_id=module_id,
        disabled_by_user=current_user.id
    )
    if not success:
        raise HTTPException(status_code=404, detail="Module non trouvé")


@router.post("/dynamic/{module_id}/enable", status_code=200)
async def enable_module(
    module_id: UUID,
    service: DynamicModulesService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """
    Réactive un module dynamique désactivé.
    """
    success = await service.enable_dynamic_module(module_id)
    if not success:
        raise HTTPException(status_code=404, detail="Module non trouvé")
    return {"status": "enabled", "module_id": str(module_id)}


# ============================================================================
# ENDPOINTS - PROPOSITIONS (IA)
# ============================================================================

@router.post("/proposals", status_code=201)
async def propose_module(
    data: ModuleProposalCreate,
    service: DynamicModulesService = Depends(get_service),
    current_agent: Agent = Depends(get_current_agent),
    target_user_id: UUID = Query(..., description="ID de l'utilisateur cible")
):
    """
    **Endpoint pour agents IA uniquement.**
    
    Permet à un agent de proposer un nouveau module à un utilisateur.
    Le module ne sera créé qu'après approbation de l'utilisateur.
    
    **Règles pour l'IA:**
    - L'IA ne peut PAS modifier les modules noyau
    - La proposition doit inclure une raison valide
    - La catégorie doit être valide pour le scope
    """
    proposal = await service.propose_module(
        data=data,
        proposed_by_agent=current_agent.id,
        proposed_for_user=target_user_id
    )
    return {
        "status": "pending",
        "message": "Proposition créée. En attente d'approbation de l'utilisateur.",
        "proposal": proposal
    }


@router.get("/proposals")
async def list_my_proposals(
    status: Optional[str] = Query(None, description="Filtrer par statut"),
    service: DynamicModulesService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """
    Liste les propositions de modules en attente pour l'utilisateur.
    """
    proposals = await service.list_pending_proposals(current_user.id)
    return {
        "count": len(proposals),
        "proposals": proposals
    }


@router.post("/proposals/{proposal_id}/approve", response_model=DynamicModuleResponse)
async def approve_proposal(
    proposal_id: UUID,
    service: DynamicModulesService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """
    Approuve une proposition de module et crée le module.
    """
    return await service.approve_proposal(
        proposal_id=proposal_id,
        approved_by=current_user.id
    )


@router.post("/proposals/{proposal_id}/reject", status_code=200)
async def reject_proposal(
    proposal_id: UUID,
    body: RejectProposalRequest = Body(default=RejectProposalRequest()),
    service: DynamicModulesService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """
    Rejette une proposition de module.
    """
    success = await service.reject_proposal(
        proposal_id=proposal_id,
        rejected_by=current_user.id,
        reason=body.reason
    )
    if not success:
        raise HTTPException(status_code=404, detail="Proposition non trouvée")
    return {"status": "rejected", "proposal_id": str(proposal_id)}


# ============================================================================
# ENDPOINTS - FUSION & ROUTING
# ============================================================================

@router.get("/merged/{scope}", response_model=MergedModulesResponse)
async def get_merged_modules(
    scope: Scope,
    service: DynamicModulesService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """
    Retourne tous les modules (noyau + dynamiques) pour un espace.
    
    Utile pour le frontend pour afficher la liste complète des modules
    disponibles dans un espace.
    """
    modules = await service.get_all_modules_for_scope(
        scope=scope.value,
        user_id=current_user.id
    )
    return MergedModulesResponse(
        scope=scope.value,
        core=modules['core'],
        dynamic=modules['dynamic'],
        total_count=len(modules['core']) + len(modules['dynamic'])
    )


@router.post("/route")
async def route_action(
    request: RouteActionRequest,
    service: DynamicModulesService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """
    Route une action vers le module approprié (noyau ou dynamique).
    
    Le contrôleur central utilise cet endpoint pour déterminer
    si une action doit être traitée par un module noyau ou dynamique.
    """
    return await service.route_action(
        scope=request.scope,
        module_key=request.module_key,
        action_key=request.action_key,
        params=request.params
    )


# ============================================================================
# ENDPOINTS - CATÉGORIES
# ============================================================================

@router.get("/categories/{scope}", response_model=List[CategoryResponse])
async def get_scope_categories(
    scope: Scope,
    service: DynamicModulesService = Depends(get_service)
):
    """
    Retourne les catégories valides pour un espace.
    
    Utilisé pour la validation et l'affichage dans le frontend.
    """
    categories = await service.get_valid_categories(scope.value)
    return [CategoryResponse(**cat) for cat in categories]


# ============================================================================
# ENDPOINTS POUR LE CONTRÔLEUR CENTRAL
# ============================================================================

@router.post("/central/execute")
async def central_controller_execute(
    scope: str = Body(...),
    module: str = Body(...),
    action: str = Body(...),
    params: dict = Body(default={}),
    service: DynamicModulesService = Depends(get_service),
    current_user: User = Depends(get_current_user)
):
    """
    **Endpoint interne pour le contrôleur central.**
    
    Exécute une action en vérifiant d'abord si le module est dynamique,
    puis route vers le handler approprié.
    """
    routing = await service.route_action(scope, module, action, params)
    
    if routing['type'] == 'dynamic':
        # Module dynamique - exécuter l'action définie
        return {
            "executed": True,
            "type": "dynamic",
            "module": routing['module'],
            "action": routing['action'],
            "result": None  # TODO: Implémenter l'exécution réelle
        }
    else:
        # Module noyau - retourner les infos pour que le contrôleur central gère
        return {
            "executed": False,
            "type": "core",
            "forward_to": f"/api/v1/{routing['module_key']}/{routing['action_key']}",
            "params": routing['params']
        }
