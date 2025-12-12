"""
CHE·NU - Central Controller
===========================
Contrôleur central qui gère le routage des actions vers les modules
(noyau et dynamiques) et orchestre les opérations cross-modules.

Architecture:
- Charge les modules noyau depuis chenu_config.json
- Fusionne avec les modules dynamiques de la DB
- Route les actions vers le bon handler
- Gère les permissions et validations

Version: 2.0 (avec support modules dynamiques)
"""

from typing import Optional, Dict, Any, List, Callable
from uuid import UUID
from dataclasses import dataclass, field
from enum import Enum
import json
import asyncio
from pathlib import Path

from fastapi import HTTPException
import asyncpg

from .services.dynamic_modules_service import (
    DynamicModulesService,
    Scope,
    get_dynamic_modules_service
)


# ============================================================================
# CONFIGURATION
# ============================================================================

CONFIG_PATH = Path(__file__).parent / "config" / "chenu_config.json"


@dataclass
class CoreModule:
    """Définition d'un module noyau"""
    key: str
    scope: str
    category: str
    label: str
    description: str
    icon: str
    actions: List[Dict[str, Any]]
    handler: Optional[str] = None  # Chemin vers le handler
    is_core: bool = True


@dataclass
class ActionContext:
    """Contexte d'exécution d'une action"""
    user_id: UUID
    scope: str
    module_key: str
    action_key: str
    params: Dict[str, Any]
    is_dynamic: bool = False
    agent_id: Optional[str] = None


# ============================================================================
# CENTRAL CONTROLLER
# ============================================================================

class CentralController:
    """
    Contrôleur central de CHE·NU
    
    Responsabilités:
    1. Charger et maintenir le registre des modules noyau
    2. Fusionner avec les modules dynamiques
    3. Router les actions vers le bon handler
    4. Valider les permissions
    5. Logger les opérations
    """
    
    def __init__(self, db_pool: asyncpg.Pool):
        self.db = db_pool
        self._core_modules: Dict[str, Dict[str, CoreModule]] = {}  # scope -> key -> module
        self._action_handlers: Dict[str, Callable] = {}
        self._dynamic_service: Optional[DynamicModulesService] = None
        self._initialized = False
    
    async def initialize(self) -> None:
        """Initialise le contrôleur"""
        if self._initialized:
            return
        
        # Charger les modules noyau
        await self._load_core_modules()
        
        # Initialiser le service des modules dynamiques
        self._dynamic_service = await get_dynamic_modules_service(self.db)
        
        # Enregistrer les handlers par défaut
        self._register_default_handlers()
        
        self._initialized = True
    
    # ========================================================================
    # CHARGEMENT DES MODULES
    # ========================================================================
    
    async def _load_core_modules(self) -> None:
        """Charge les modules noyau depuis la configuration"""
        if not CONFIG_PATH.exists():
            # Créer une config par défaut si elle n'existe pas
            await self._create_default_config()
        
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        for scope_config in config.get('scopes', []):
            scope = scope_config['key']
            self._core_modules[scope] = {}
            
            for module_config in scope_config.get('modules', []):
                module = CoreModule(
                    key=module_config['key'],
                    scope=scope,
                    category=module_config.get('category', 'default'),
                    label=module_config['label'],
                    description=module_config.get('description', ''),
                    icon=module_config.get('icon', 'box'),
                    actions=module_config.get('actions', []),
                    handler=module_config.get('handler')
                )
                self._core_modules[scope][module.key] = module
    
    async def _create_default_config(self) -> None:
        """Crée une configuration par défaut"""
        default_config = {
            "version": "1.0",
            "scopes": [
                {
                    "key": "personal",
                    "label": "Personnel",
                    "modules": [
                        {
                            "key": "assistant",
                            "category": "assistant",
                            "label": "Assistant Nova",
                            "description": "Votre assistant personnel IA",
                            "icon": "bot",
                            "actions": [
                                {"key": "chat", "label": "Discuter"},
                                {"key": "task", "label": "Créer une tâche"},
                                {"key": "remind", "label": "Me rappeler"}
                            ]
                        },
                        {
                            "key": "notes",
                            "category": "notes",
                            "label": "Notes",
                            "description": "Gérez vos notes et documents",
                            "icon": "file-text",
                            "actions": [
                                {"key": "create", "label": "Nouvelle note"},
                                {"key": "list", "label": "Mes notes"},
                                {"key": "search", "label": "Rechercher"}
                            ]
                        }
                    ]
                },
                {
                    "key": "enterprise",
                    "label": "Entreprise",
                    "modules": [
                        {
                            "key": "dashboard",
                            "category": "dashboard",
                            "label": "Tableau de bord",
                            "icon": "layout-dashboard",
                            "actions": [
                                {"key": "view", "label": "Vue d'ensemble"},
                                {"key": "analytics", "label": "Analytiques"}
                            ]
                        }
                    ]
                }
            ]
        }
        
        CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
            json.dump(default_config, f, indent=2, ensure_ascii=False)
    
    # ========================================================================
    # FUSION DES MODULES
    # ========================================================================
    
    async def get_all_modules(
        self,
        scope: str,
        user_id: Optional[UUID] = None,
        category: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Retourne tous les modules (noyau + dynamiques) pour un scope.
        
        Returns:
            {
                'core': [...],
                'dynamic': [...],
                'merged': [...]  # Liste fusionnée triée
            }
        """
        await self.initialize()
        
        # Modules noyau
        core_modules = []
        if scope in self._core_modules:
            for key, module in self._core_modules[scope].items():
                if category is None or module.category == category:
                    core_modules.append({
                        'key': module.key,
                        'scope': module.scope,
                        'category': module.category,
                        'label': module.label,
                        'description': module.description,
                        'icon': module.icon,
                        'actions': module.actions,
                        'is_core': True,
                        'is_dynamic': False
                    })
        
        # Modules dynamiques
        dynamic_modules = await self._dynamic_service.list_dynamic_modules(
            scope=scope,
            category=category,
            user_id=user_id
        )
        
        dynamic_list = []
        for dm in dynamic_modules:
            dynamic_list.append({
                'key': dm.key,
                'scope': dm.scope,
                'category': dm.category,
                'label': dm.label,
                'description': dm.description,
                'icon': dm.icon,
                'actions': dm.actions,
                'is_core': False,
                'is_dynamic': True,
                'id': str(dm.id),
                'usage_count': dm.usage_count
            })
        
        # Fusionner et trier
        merged = core_modules + dynamic_list
        merged.sort(key=lambda x: (x['category'], not x['is_core'], x['label']))
        
        return {
            'core': core_modules,
            'dynamic': dynamic_list,
            'merged': merged,
            'counts': {
                'core': len(core_modules),
                'dynamic': len(dynamic_list),
                'total': len(merged)
            }
        }
    
    # ========================================================================
    # ROUTING DES ACTIONS
    # ========================================================================
    
    async def execute_action(
        self,
        context: ActionContext
    ) -> Dict[str, Any]:
        """
        Exécute une action sur un module.
        
        Le contrôleur:
        1. Vérifie si le module est dynamique ou noyau
        2. Valide les permissions
        3. Route vers le handler approprié
        4. Retourne le résultat
        """
        await self.initialize()
        
        # Vérifier si c'est un module dynamique
        dynamic_module = await self._dynamic_service.get_module_by_key(
            context.scope, context.module_key
        )
        
        if dynamic_module:
            context.is_dynamic = True
            return await self._execute_dynamic_action(context, dynamic_module)
        
        # Sinon, module noyau
        if context.scope not in self._core_modules:
            raise HTTPException(status_code=404, detail=f"Scope '{context.scope}' non trouvé")
        
        if context.module_key not in self._core_modules[context.scope]:
            raise HTTPException(
                status_code=404,
                detail=f"Module '{context.module_key}' non trouvé dans '{context.scope}'"
            )
        
        return await self._execute_core_action(context)
    
    async def _execute_core_action(self, context: ActionContext) -> Dict[str, Any]:
        """Exécute une action sur un module noyau"""
        module = self._core_modules[context.scope][context.module_key]
        
        # Vérifier que l'action existe
        action = next(
            (a for a in module.actions if a['key'] == context.action_key),
            None
        )
        if not action:
            raise HTTPException(
                status_code=404,
                detail=f"Action '{context.action_key}' non trouvée"
            )
        
        # Chercher un handler enregistré
        handler_key = f"{context.scope}.{context.module_key}.{context.action_key}"
        
        if handler_key in self._action_handlers:
            handler = self._action_handlers[handler_key]
            result = await handler(context)
            return {
                'success': True,
                'type': 'core',
                'module': context.module_key,
                'action': context.action_key,
                'result': result
            }
        
        # Pas de handler - retourner info pour traitement externe
        return {
            'success': True,
            'type': 'core',
            'module': context.module_key,
            'action': context.action_key,
            'handler': module.handler,
            'requires_external': True,
            'params': context.params
        }
    
    async def _execute_dynamic_action(
        self,
        context: ActionContext,
        module
    ) -> Dict[str, Any]:
        """Exécute une action sur un module dynamique"""
        # Incrémenter l'usage
        await self._dynamic_service.increment_usage(module.id)
        
        # Trouver l'action
        action = next(
            (a for a in module.actions if a.get('key') == context.action_key),
            None
        )
        
        if not action:
            raise HTTPException(
                status_code=404,
                detail=f"Action '{context.action_key}' non trouvée dans le module dynamique"
            )
        
        # Les modules dynamiques peuvent avoir des handlers personnalisés
        # Pour l'instant, on retourne les infos pour traitement par le frontend
        return {
            'success': True,
            'type': 'dynamic',
            'module': {
                'key': module.key,
                'label': module.label,
                'id': str(module.id)
            },
            'action': action,
            'config': module.config,
            'params': context.params
        }
    
    # ========================================================================
    # REGISTRATION DES HANDLERS
    # ========================================================================
    
    def register_handler(
        self,
        scope: str,
        module: str,
        action: str,
        handler: Callable
    ) -> None:
        """Enregistre un handler pour une action spécifique"""
        key = f"{scope}.{module}.{action}"
        self._action_handlers[key] = handler
    
    def _register_default_handlers(self) -> None:
        """Enregistre les handlers par défaut"""
        # Les handlers par défaut peuvent être ajoutés ici
        pass
    
    # ========================================================================
    # UTILITAIRES
    # ========================================================================
    
    async def search_modules(
        self,
        query: str,
        user_id: Optional[UUID] = None
    ) -> List[Dict[str, Any]]:
        """Recherche dans tous les modules (noyau + dynamiques)"""
        await self.initialize()
        
        results = []
        query_lower = query.lower()
        
        # Recherche dans les modules noyau
        for scope, modules in self._core_modules.items():
            for key, module in modules.items():
                if (query_lower in module.label.lower() or
                    query_lower in module.description.lower() or
                    query_lower in key.lower()):
                    results.append({
                        'key': key,
                        'scope': scope,
                        'label': module.label,
                        'type': 'core'
                    })
        
        # Recherche dans les modules dynamiques
        all_dynamic = await self._dynamic_service.list_dynamic_modules(user_id=user_id)
        for dm in all_dynamic:
            if (query_lower in dm.label.lower() or
                (dm.description and query_lower in dm.description.lower()) or
                query_lower in dm.key.lower()):
                results.append({
                    'key': dm.key,
                    'scope': dm.scope,
                    'label': dm.label,
                    'type': 'dynamic',
                    'id': str(dm.id)
                })
        
        return results
    
    def get_scope_info(self, scope: str) -> Optional[Dict[str, Any]]:
        """Retourne les infos d'un scope"""
        scope_labels = {
            'personal': {'label': 'Personnel', 'icon': 'user', 'color': '#D8B26A'},
            'social': {'label': 'Social & Divertissement', 'icon': 'users', 'color': '#3EB4A2'},
            'scholar': {'label': 'Scholar', 'icon': 'graduation-cap', 'color': '#3F7249'},
            'home': {'label': 'Maison', 'icon': 'home', 'color': '#8D8371'},
            'enterprise': {'label': 'Entreprise', 'icon': 'building', 'color': '#7A593A'},
            'projects': {'label': 'Projets', 'icon': 'folder-kanban', 'color': '#2F4C39'},
            'creative_studio': {'label': 'Creative Studio', 'icon': 'palette', 'color': '#D8B26A'},
            'government': {'label': 'Gouvernement', 'icon': 'landmark', 'color': '#8D8371'},
            'immobilier': {'label': 'Immobilier', 'icon': 'building-2', 'color': '#3F7249'},
            'associations': {'label': 'Associations', 'icon': 'heart-handshake', 'color': '#3EB4A2'}
        }
        return scope_labels.get(scope)


# ============================================================================
# FACTORY & SINGLETON
# ============================================================================

_controller_instance: Optional[CentralController] = None


async def get_central_controller(db_pool: asyncpg.Pool) -> CentralController:
    """Factory pour obtenir le contrôleur central"""
    global _controller_instance
    if _controller_instance is None:
        _controller_instance = CentralController(db_pool)
        await _controller_instance.initialize()
    return _controller_instance
