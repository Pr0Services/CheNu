"""
CHE·NU - Dynamic Modules Service
================================
Service backend pour la gestion des modules dynamiques créés par les agents IA.

Règles fondamentales:
- L'IA ne modifie JAMAIS les modules noyau
- L'IA ne crée un module que dans un scope+category valide
- Chaque module dynamique a toujours un nom machine (key) + label humain

Version: 1.0
"""

from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from uuid import UUID, uuid4
from enum import Enum
from dataclasses import dataclass, field
from pydantic import BaseModel, Field, validator
import json
import asyncpg
from fastapi import HTTPException


# ============================================================================
# ENUMS & CONSTANTS
# ============================================================================

class Scope(str, Enum):
    """Les 10 espaces fondamentaux de CHE·NU"""
    PERSONAL = "personal"
    SOCIAL = "social"
    SCHOLAR = "scholar"
    HOME = "home"
    ENTERPRISE = "enterprise"
    PROJECTS = "projects"
    CREATIVE_STUDIO = "creative_studio"
    GOVERNMENT = "government"
    IMMOBILIER = "immobilier"
    ASSOCIATIONS = "associations"


class ApprovalMode(str, Enum):
    """Modes d'approbation des modules"""
    MANUAL = "manual"       # Nécessite confirmation utilisateur
    AUTO = "auto"           # Création automatique
    ADMIN_ONLY = "admin_only"  # Seul l'admin peut approuver


class ProposalStatus(str, Enum):
    """États des propositions de modules"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"


# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class ModuleAction(BaseModel):
    """Action disponible dans un module"""
    key: str = Field(..., regex=r'^[a-z][a-z0-9_]*$')
    label: str
    description: Optional[str] = None
    icon: str = "play"
    requires_confirmation: bool = False


class DynamicModuleCreate(BaseModel):
    """Schéma pour créer un module dynamique"""
    scope: Scope
    category: str = Field(..., min_length=2, max_length=100)
    key: str = Field(..., regex=r'^[a-z][a-z0-9_]*$', min_length=2, max_length=100)
    label: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    icon: str = "puzzle"
    color: str = Field(default="#3EB4A2", regex=r'^#[0-9A-Fa-f]{6}$')
    config: Dict[str, Any] = {}
    actions: List[ModuleAction] = []
    
    @validator('key')
    def key_must_be_snake_case(cls, v):
        if not v.replace('_', '').isalnum():
            raise ValueError('key doit être en snake_case')
        return v.lower()


class ModuleProposalCreate(BaseModel):
    """Schéma pour proposer un module (par un agent IA)"""
    scope: Scope
    category: str
    key: str
    label: str
    description: Optional[str] = None
    icon: str = "puzzle"
    color: str = "#3EB4A2"
    reason: str  # Pourquoi l'IA propose ce module
    conversation_context: Optional[Dict[str, Any]] = None


class DynamicModuleResponse(BaseModel):
    """Réponse avec les données d'un module"""
    id: UUID
    scope: str
    category: str
    key: str
    label: str
    description: Optional[str]
    icon: str
    color: str
    config: Dict[str, Any]
    actions: List[Dict[str, Any]]
    is_enabled: bool
    is_approved: bool
    created_by_agent: Optional[str]
    created_at: datetime
    usage_count: int


# ============================================================================
# SERVICE PRINCIPAL
# ============================================================================

class DynamicModulesService:
    """
    Service de gestion des modules dynamiques CHE·NU
    
    Responsabilités:
    - Création/listing/désactivation des modules
    - Validation des scopes et catégories
    - Gestion des propositions IA
    - Fusion avec les modules noyau
    """
    
    def __init__(self, db_pool: asyncpg.Pool):
        self.db = db_pool
        self._core_modules_cache: Dict[str, List[Dict]] = {}
        self._categories_cache: Dict[str, List[str]] = {}
    
    # ========================================================================
    # VALIDATION
    # ========================================================================
    
    async def validate_scope_category(self, scope: str, category: str) -> bool:
        """
        Vérifie qu'une combinaison scope+category est valide.
        
        Returns:
            True si valide, False sinon
        """
        query = """
            SELECT EXISTS(
                SELECT 1 FROM scope_categories 
                WHERE scope = $1 AND category = $2
            )
        """
        return await self.db.fetchval(query, scope, category)
    
    async def get_valid_categories(self, scope: str) -> List[Dict[str, Any]]:
        """Retourne les catégories valides pour un scope"""
        query = """
            SELECT category, label, description, is_core, sort_order
            FROM scope_categories
            WHERE scope = $1
            ORDER BY sort_order, label
        """
        rows = await self.db.fetch(query, scope)
        return [dict(row) for row in rows]
    
    async def is_key_available(self, scope: str, key: str) -> bool:
        """Vérifie si une clé de module est disponible dans un scope"""
        query = """
            SELECT NOT EXISTS(
                SELECT 1 FROM dynamic_modules 
                WHERE scope = $1 AND key = $2
            )
        """
        return await self.db.fetchval(query, scope, key)
    
    # ========================================================================
    # CRUD MODULES DYNAMIQUES
    # ========================================================================
    
    async def create_dynamic_module(
        self,
        data: DynamicModuleCreate,
        created_by_agent: Optional[str] = None,
        created_by_user: Optional[UUID] = None,
        auto_approve: bool = False
    ) -> DynamicModuleResponse:
        """
        Crée un nouveau module dynamique.
        
        Args:
            data: Données du module
            created_by_agent: ID de l'agent IA créateur
            created_by_user: UUID de l'utilisateur
            auto_approve: Si True, le module est approuvé immédiatement
        
        Returns:
            Le module créé
        
        Raises:
            HTTPException: Si validation échoue
        """
        # Validation scope+category
        if not await self.validate_scope_category(data.scope.value, data.category):
            raise HTTPException(
                status_code=400,
                detail=f"Catégorie '{data.category}' invalide pour le scope '{data.scope.value}'"
            )
        
        # Vérifier disponibilité de la clé
        if not await self.is_key_available(data.scope.value, data.key):
            raise HTTPException(
                status_code=409,
                detail=f"Un module avec la clé '{data.key}' existe déjà dans '{data.scope.value}'"
            )
        
        # Insertion
        query = """
            INSERT INTO dynamic_modules (
                scope, category, key, label, description, icon, color,
                config, actions, created_by_agent, created_by_user,
                is_enabled, is_approved, approval_mode
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query,
            data.scope.value,
            data.category,
            data.key,
            data.label,
            data.description,
            data.icon,
            data.color,
            json.dumps(data.config),
            json.dumps([a.dict() for a in data.actions]),
            created_by_agent,
            created_by_user,
            True,  # is_enabled
            auto_approve,  # is_approved
            ApprovalMode.AUTO.value if auto_approve else ApprovalMode.MANUAL.value
        )
        
        # Log de l'action
        await self._log_action(row['id'], 'created', {
            'agent': created_by_agent,
            'user': str(created_by_user) if created_by_user else None,
            'auto_approved': auto_approve
        })
        
        return self._row_to_response(row)
    
    async def list_dynamic_modules(
        self,
        scope: Optional[str] = None,
        category: Optional[str] = None,
        include_disabled: bool = False,
        include_unapproved: bool = False,
        user_id: Optional[UUID] = None
    ) -> List[DynamicModuleResponse]:
        """
        Liste les modules dynamiques avec filtres.
        
        Args:
            scope: Filtrer par espace
            category: Filtrer par catégorie
            include_disabled: Inclure les modules désactivés
            include_unapproved: Inclure les modules non approuvés
            user_id: Filtrer par créateur
        
        Returns:
            Liste des modules
        """
        conditions = []
        params = []
        param_idx = 1
        
        if scope:
            conditions.append(f"scope = ${param_idx}")
            params.append(scope)
            param_idx += 1
        
        if category:
            conditions.append(f"category = ${param_idx}")
            params.append(category)
            param_idx += 1
        
        if not include_disabled:
            conditions.append("is_enabled = true")
        
        if not include_unapproved:
            conditions.append("is_approved = true")
        
        if user_id:
            conditions.append(f"created_by_user = ${param_idx}")
            params.append(user_id)
            param_idx += 1
        
        where_clause = " AND ".join(conditions) if conditions else "1=1"
        
        query = f"""
            SELECT * FROM dynamic_modules
            WHERE {where_clause}
            ORDER BY scope, category, label
        """
        
        rows = await self.db.fetch(query, *params)
        return [self._row_to_response(row) for row in rows]
    
    async def get_module_by_key(self, scope: str, key: str) -> Optional[DynamicModuleResponse]:
        """Récupère un module par sa clé"""
        query = """
            SELECT * FROM dynamic_modules
            WHERE scope = $1 AND key = $2
        """
        row = await self.db.fetchrow(query, scope, key)
        return self._row_to_response(row) if row else None
    
    async def disable_dynamic_module(
        self,
        module_id: UUID,
        disabled_by_user: Optional[UUID] = None,
        disabled_by_agent: Optional[str] = None
    ) -> bool:
        """
        Désactive un module dynamique (soft delete).
        
        Returns:
            True si désactivé, False si non trouvé
        """
        query = """
            UPDATE dynamic_modules
            SET is_enabled = false, updated_at = NOW()
            WHERE id = $1
            RETURNING id
        """
        result = await self.db.fetchval(query, module_id)
        
        if result:
            await self._log_action(module_id, 'disabled', {
                'user': str(disabled_by_user) if disabled_by_user else None,
                'agent': disabled_by_agent
            })
            return True
        return False
    
    async def enable_dynamic_module(self, module_id: UUID) -> bool:
        """Réactive un module désactivé"""
        query = """
            UPDATE dynamic_modules
            SET is_enabled = true, updated_at = NOW()
            WHERE id = $1
            RETURNING id
        """
        result = await self.db.fetchval(query, module_id)
        
        if result:
            await self._log_action(module_id, 'enabled', {})
            return True
        return False
    
    async def increment_usage(self, module_id: UUID) -> None:
        """Incrémente le compteur d'utilisation"""
        query = """
            UPDATE dynamic_modules
            SET usage_count = usage_count + 1,
                last_used_at = NOW()
            WHERE id = $1
        """
        await self.db.execute(query, module_id)
    
    # ========================================================================
    # PROPOSITIONS DE MODULES (IA)
    # ========================================================================
    
    async def propose_module(
        self,
        data: ModuleProposalCreate,
        proposed_by_agent: str,
        proposed_for_user: UUID
    ) -> Dict[str, Any]:
        """
        Permet à un agent IA de proposer un nouveau module.
        Le module ne sera créé qu'après approbation de l'utilisateur.
        
        Args:
            data: Données de la proposition
            proposed_by_agent: ID de l'agent proposant
            proposed_for_user: UUID de l'utilisateur cible
        
        Returns:
            La proposition créée
        """
        # Validation scope+category
        if not await self.validate_scope_category(data.scope.value, data.category):
            raise HTTPException(
                status_code=400,
                detail=f"Catégorie '{data.category}' invalide pour le scope '{data.scope.value}'"
            )
        
        # Vérifier qu'une proposition similaire n'existe pas déjà
        existing = await self.db.fetchval("""
            SELECT id FROM dynamic_module_proposals
            WHERE proposed_for_user = $1 AND scope = $2 AND key = $3 AND status = 'pending'
        """, proposed_for_user, data.scope.value, data.key)
        
        if existing:
            raise HTTPException(
                status_code=409,
                detail="Une proposition similaire est déjà en attente"
            )
        
        query = """
            INSERT INTO dynamic_module_proposals (
                scope, category, key, label, description, icon, color,
                proposed_by_agent, proposed_for_user, reason, conversation_context
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query,
            data.scope.value,
            data.category,
            data.key,
            data.label,
            data.description,
            data.icon,
            data.color,
            proposed_by_agent,
            proposed_for_user,
            data.reason,
            json.dumps(data.conversation_context) if data.conversation_context else None
        )
        
        return dict(row)
    
    async def list_pending_proposals(self, user_id: UUID) -> List[Dict[str, Any]]:
        """Liste les propositions en attente pour un utilisateur"""
        query = """
            SELECT * FROM dynamic_module_proposals
            WHERE proposed_for_user = $1 AND status = 'pending' AND expires_at > NOW()
            ORDER BY created_at DESC
        """
        rows = await self.db.fetch(query, user_id)
        return [dict(row) for row in rows]
    
    async def approve_proposal(
        self,
        proposal_id: UUID,
        approved_by: UUID
    ) -> DynamicModuleResponse:
        """
        Approuve une proposition et crée le module.
        
        Returns:
            Le module créé
        """
        # Récupérer la proposition
        proposal = await self.db.fetchrow("""
            SELECT * FROM dynamic_module_proposals
            WHERE id = $1 AND status = 'pending'
        """, proposal_id)
        
        if not proposal:
            raise HTTPException(status_code=404, detail="Proposition non trouvée ou déjà traitée")
        
        # Créer le module
        module_data = DynamicModuleCreate(
            scope=Scope(proposal['scope']),
            category=proposal['category'],
            key=proposal['key'],
            label=proposal['label'],
            description=proposal['description'],
            icon=proposal['icon'],
            color=proposal['color']
        )
        
        module = await self.create_dynamic_module(
            data=module_data,
            created_by_agent=proposal['proposed_by_agent'],
            created_by_user=proposal['proposed_for_user'],
            auto_approve=True
        )
        
        # Mettre à jour la proposition
        await self.db.execute("""
            UPDATE dynamic_module_proposals
            SET status = 'approved', reviewed_at = NOW(), reviewed_by = $2
            WHERE id = $1
        """, proposal_id, approved_by)
        
        return module
    
    async def reject_proposal(
        self,
        proposal_id: UUID,
        rejected_by: UUID,
        reason: Optional[str] = None
    ) -> bool:
        """Rejette une proposition de module"""
        result = await self.db.execute("""
            UPDATE dynamic_module_proposals
            SET status = 'rejected', reviewed_at = NOW(), reviewed_by = $2, rejection_reason = $3
            WHERE id = $1 AND status = 'pending'
        """, proposal_id, rejected_by, reason)
        
        return "UPDATE 1" in result
    
    # ========================================================================
    # FUSION AVEC MODULES NOYAU
    # ========================================================================
    
    async def get_all_modules_for_scope(
        self,
        scope: str,
        user_id: Optional[UUID] = None,
        include_core: bool = True
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Retourne tous les modules (noyau + dynamiques) pour un scope.
        
        Returns:
            Dict avec 'core' et 'dynamic' comme clés
        """
        result = {
            'core': [],
            'dynamic': []
        }
        
        # Modules noyau (depuis la config)
        if include_core:
            result['core'] = await self._get_core_modules(scope)
        
        # Modules dynamiques
        dynamic_modules = await self.list_dynamic_modules(
            scope=scope,
            user_id=user_id
        )
        result['dynamic'] = [m.dict() for m in dynamic_modules]
        
        return result
    
    async def route_action(
        self,
        scope: str,
        module_key: str,
        action_key: str,
        params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Route une action vers le bon module (noyau ou dynamique).
        
        Returns:
            Résultat de l'action ou info de routage
        """
        # Vérifier d'abord les modules dynamiques
        dynamic_module = await self.get_module_by_key(scope, module_key)
        
        if dynamic_module:
            # Incrémenter l'usage
            await self.increment_usage(dynamic_module.id)
            
            # Trouver l'action
            actions = dynamic_module.actions
            action = next((a for a in actions if a.get('key') == action_key), None)
            
            if not action:
                raise HTTPException(
                    status_code=404,
                    detail=f"Action '{action_key}' non trouvée dans le module '{module_key}'"
                )
            
            return {
                'type': 'dynamic',
                'module': dynamic_module.dict(),
                'action': action,
                'params': params
            }
        
        # Sinon, c'est un module noyau
        return {
            'type': 'core',
            'module_key': module_key,
            'action_key': action_key,
            'params': params
        }
    
    # ========================================================================
    # HELPERS PRIVÉS
    # ========================================================================
    
    async def _get_core_modules(self, scope: str) -> List[Dict[str, Any]]:
        """Charge les modules noyau depuis la config"""
        # TODO: Charger depuis chenu_config.json
        # Pour l'instant, retourne une liste vide
        return self._core_modules_cache.get(scope, [])
    
    async def _log_action(
        self,
        module_id: UUID,
        action_type: str,
        action_data: Dict[str, Any]
    ) -> None:
        """Enregistre une action dans le log"""
        await self.db.execute("""
            INSERT INTO dynamic_module_actions_log (module_id, action_type, action_data)
            VALUES ($1, $2, $3)
        """, module_id, action_type, json.dumps(action_data))
    
    def _row_to_response(self, row: asyncpg.Record) -> DynamicModuleResponse:
        """Convertit un row DB en response Pydantic"""
        return DynamicModuleResponse(
            id=row['id'],
            scope=row['scope'],
            category=row['category'],
            key=row['key'],
            label=row['label'],
            description=row['description'],
            icon=row['icon'],
            color=row['color'],
            config=json.loads(row['config']) if isinstance(row['config'], str) else row['config'],
            actions=json.loads(row['actions']) if isinstance(row['actions'], str) else row['actions'],
            is_enabled=row['is_enabled'],
            is_approved=row['is_approved'],
            created_by_agent=row['created_by_agent'],
            created_at=row['created_at'],
            usage_count=row['usage_count']
        )


# ============================================================================
# FACTORY
# ============================================================================

_service_instance: Optional[DynamicModulesService] = None

async def get_dynamic_modules_service(db_pool: asyncpg.Pool) -> DynamicModulesService:
    """Factory pour obtenir le service"""
    global _service_instance
    if _service_instance is None:
        _service_instance = DynamicModulesService(db_pool)
    return _service_instance
