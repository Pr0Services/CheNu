"""
CHE·NU v6.0 - Virtual Workspace Service
═══════════════════════════════════════════════════════════════════════════════
Environnement de travail virtuel intégré pour les utilisateurs.
Accès centralisé à toutes les données et outils.

Author: CHE·NU Team
Version: 6.0
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Callable, Union
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
import uuid
import json
import logging
import asyncio

logger = logging.getLogger("CHE·NU.Workspace")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS & TYPES
# ═══════════════════════════════════════════════════════════════════════════════

class WorkspaceType(Enum):
    """Types de workspace."""
    PERSONAL = "personal"      # Espace personnel
    PROJECT = "project"        # Lié à un projet
    TEAM = "team"              # Partagé avec une équipe
    FOCUS = "focus"            # Mode concentration


class PanelType(Enum):
    """Types de panneaux."""
    CHAT = "chat"                    # Chat avec AI
    FILE_BROWSER = "file_browser"    # Navigateur de fichiers
    CALENDAR = "calendar"            # Calendrier
    TASKS = "tasks"                  # Liste de tâches
    NOTES = "notes"                  # Notes
    ANALYTICS = "analytics"          # Tableaux de bord
    TOOL_PANEL = "tool_panel"        # Panneau d'outils
    BROWSER = "browser"              # Mini navigateur
    CODE_EDITOR = "code_editor"      # Éditeur de code
    DOCUMENTS = "documents"          # Documents récents
    NOTIFICATIONS = "notifications"  # Notifications
    QUICK_ACTIONS = "quick_actions"  # Actions rapides


class WidgetType(Enum):
    """Types de widgets."""
    WEATHER = "weather"
    CLOCK = "clock"
    CALENDAR_MINI = "calendar_mini"
    TASK_SUMMARY = "task_summary"
    RECENT_FILES = "recent_files"
    QUICK_NOTE = "quick_note"
    POMODORO = "pomodoro"
    MUSIC_PLAYER = "music_player"
    SHORTCUTS = "shortcuts"
    KPI_CARD = "kpi_card"
    CHART = "chart"
    CUSTOM = "custom"


class FocusMode(Enum):
    """Modes de concentration."""
    OFF = "off"
    LIGHT = "light"        # Notifications réduites
    DEEP = "deep"          # Pas de notifications
    ZEN = "zen"            # Interface minimale


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class ThemeConfig:
    """Configuration du thème."""
    mode: str = "dark"  # dark, light, system
    primary_color: str = "#6366f1"
    accent_color: str = "#22c55e"
    background_image: Optional[str] = None
    font_family: str = "Inter"
    font_size: str = "medium"  # small, medium, large
    blur_effects: bool = True
    animations: bool = True
    custom_css: Optional[str] = None


@dataclass
class PanelConfig:
    """Configuration d'un panneau."""
    id: str
    type: PanelType
    position: str  # left, right, center, top, bottom, floating
    size: str = "auto"  # auto, 20%, 300px, etc.
    visible: bool = True
    minimized: bool = False
    pinned: bool = False
    order: int = 0
    settings: Dict[str, Any] = field(default_factory=dict)


@dataclass
class WidgetConfig:
    """Configuration d'un widget."""
    id: str
    type: WidgetType
    position: Dict[str, int]  # {x, y, width, height}
    settings: Dict[str, Any] = field(default_factory=dict)
    visible: bool = True


@dataclass
class FocusSettings:
    """Paramètres du mode focus."""
    enabled: bool = False
    mode: FocusMode = FocusMode.OFF
    blocked_notifications: List[str] = field(default_factory=list)
    allowed_contacts: List[str] = field(default_factory=list)
    break_reminder_minutes: int = 25
    ambient_sound: Optional[str] = None  # rain, forest, cafe, etc.
    auto_dnd: bool = True
    scheduled_start: Optional[str] = None  # "09:00"
    scheduled_end: Optional[str] = None    # "17:00"


@dataclass
class AIAssistantSettings:
    """Paramètres de l'assistant AI."""
    preferred_agent: str = "nova"
    auto_suggest: bool = True
    voice_enabled: bool = False
    language: str = "fr-CA"
    personality: str = "friendly"
    context_awareness: bool = True
    proactive_help: bool = True
    remember_preferences: bool = True


@dataclass
class WorkspaceLayout:
    """Layout complet du workspace."""
    panels: List[PanelConfig] = field(default_factory=list)
    widgets: List[WidgetConfig] = field(default_factory=list)
    quick_access: List[str] = field(default_factory=list)  # IDs des éléments en accès rapide
    pinned_items: List[str] = field(default_factory=list)  # IDs des éléments épinglés
    default_panel: str = "chat"


@dataclass
class WorkspaceState:
    """État actuel du workspace."""
    workspace_id: str
    user_id: str
    active_panel: str = "chat"
    open_tabs: List[Dict[str, Any]] = field(default_factory=list)
    recent_items: List[str] = field(default_factory=list)
    clipboard: List[Dict[str, Any]] = field(default_factory=list)
    notifications: List[Dict[str, Any]] = field(default_factory=list)
    current_task: Optional[str] = None
    focus_started_at: Optional[datetime] = None
    session_started_at: datetime = field(default_factory=datetime.utcnow)


# ═══════════════════════════════════════════════════════════════════════════════
# WORKSPACE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class WorkspaceConfig:
    """Configuration complète d'un workspace."""
    workspace_id: str
    workspace_name: str
    workspace_type: WorkspaceType
    
    # Apparence
    theme: ThemeConfig = field(default_factory=ThemeConfig)
    
    # Layout
    layout: WorkspaceLayout = field(default_factory=WorkspaceLayout)
    
    # Ressources connectées
    connected_accounts: List[str] = field(default_factory=list)
    connected_projects: List[str] = field(default_factory=list)
    
    # Mode focus
    focus: FocusSettings = field(default_factory=FocusSettings)
    
    # Assistant AI
    ai: AIAssistantSettings = field(default_factory=AIAssistantSettings)
    
    # Métadonnées
    is_default: bool = False
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)


# ═══════════════════════════════════════════════════════════════════════════════
# DEFAULT LAYOUTS
# ═══════════════════════════════════════════════════════════════════════════════

class DefaultLayouts:
    """Layouts prédéfinis."""
    
    @staticmethod
    def personal() -> WorkspaceLayout:
        """Layout personnel par défaut."""
        return WorkspaceLayout(
            panels=[
                PanelConfig(
                    id="sidebar",
                    type=PanelType.FILE_BROWSER,
                    position="left",
                    size="250px",
                    settings={"show_favorites": True}
                ),
                PanelConfig(
                    id="main",
                    type=PanelType.CHAT,
                    position="center",
                    size="auto",
                    settings={"agent": "nova"}
                ),
                PanelConfig(
                    id="tools",
                    type=PanelType.TOOL_PANEL,
                    position="right",
                    size="300px",
                    settings={"show_recent": True}
                ),
            ],
            widgets=[
                WidgetConfig(
                    id="clock",
                    type=WidgetType.CLOCK,
                    position={"x": 0, "y": 0, "width": 2, "height": 1}
                ),
                WidgetConfig(
                    id="tasks",
                    type=WidgetType.TASK_SUMMARY,
                    position={"x": 0, "y": 1, "width": 2, "height": 2}
                ),
            ],
            default_panel="main"
        )
    
    @staticmethod
    def project() -> WorkspaceLayout:
        """Layout projet."""
        return WorkspaceLayout(
            panels=[
                PanelConfig(
                    id="project_files",
                    type=PanelType.FILE_BROWSER,
                    position="left",
                    size="280px",
                    settings={"filter_by_project": True}
                ),
                PanelConfig(
                    id="main",
                    type=PanelType.DOCUMENTS,
                    position="center",
                    size="auto"
                ),
                PanelConfig(
                    id="chat",
                    type=PanelType.CHAT,
                    position="right",
                    size="350px",
                    settings={"context": "project"}
                ),
                PanelConfig(
                    id="tasks",
                    type=PanelType.TASKS,
                    position="bottom",
                    size="200px"
                ),
            ],
            default_panel="main"
        )
    
    @staticmethod
    def focus() -> WorkspaceLayout:
        """Layout focus (minimal)."""
        return WorkspaceLayout(
            panels=[
                PanelConfig(
                    id="main",
                    type=PanelType.CHAT,
                    position="center",
                    size="100%",
                    settings={"minimal_ui": True}
                ),
            ],
            widgets=[
                WidgetConfig(
                    id="pomodoro",
                    type=WidgetType.POMODORO,
                    position={"x": 0, "y": 0, "width": 1, "height": 1}
                ),
            ],
            default_panel="main"
        )
    
    @staticmethod
    def analytics() -> WorkspaceLayout:
        """Layout analytics/dashboard."""
        return WorkspaceLayout(
            panels=[
                PanelConfig(
                    id="sidebar",
                    type=PanelType.QUICK_ACTIONS,
                    position="left",
                    size="200px"
                ),
                PanelConfig(
                    id="main",
                    type=PanelType.ANALYTICS,
                    position="center",
                    size="auto"
                ),
                PanelConfig(
                    id="chat",
                    type=PanelType.CHAT,
                    position="right",
                    size="300px",
                    minimized=True
                ),
            ],
            widgets=[
                WidgetConfig(
                    id="kpi_revenue",
                    type=WidgetType.KPI_CARD,
                    position={"x": 0, "y": 0, "width": 2, "height": 1},
                    settings={"metric": "revenue", "period": "month"}
                ),
                WidgetConfig(
                    id="kpi_orders",
                    type=WidgetType.KPI_CARD,
                    position={"x": 2, "y": 0, "width": 2, "height": 1},
                    settings={"metric": "orders", "period": "month"}
                ),
                WidgetConfig(
                    id="chart_sales",
                    type=WidgetType.CHART,
                    position={"x": 0, "y": 1, "width": 4, "height": 2},
                    settings={"type": "line", "data_source": "sales"}
                ),
            ],
            default_panel="main"
        )


# ═══════════════════════════════════════════════════════════════════════════════
# WORKSPACE SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

class VirtualWorkspaceService:
    """
    🖥️ Service de Workspace Virtuel
    
    Gère l'environnement de travail virtuel de l'utilisateur:
    - Création et configuration des workspaces
    - Gestion des panneaux et widgets
    - Mode focus
    - Intégration avec les comptes connectés
    """
    
    def __init__(
        self,
        database_agent=None,
        integration_manager=None
    ):
        """
        Initialise le service.
        
        Args:
            database_agent: Agent de base de données
            integration_manager: Gestionnaire d'intégrations
        """
        self.db = database_agent
        self.integrations = integration_manager
        
        # Cache des états de workspace actifs
        self._active_states: Dict[str, WorkspaceState] = {}
        
        # Gestionnaires d'événements
        self._event_handlers: Dict[str, List[Callable]] = {}
        
        logger.info("🖥️ Virtual Workspace Service initialized")
    
    # ═══════════════════════════════════════════════════════════════════════════
    # WORKSPACE CRUD
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def create_workspace(
        self,
        user_id: str,
        name: str,
        workspace_type: WorkspaceType = WorkspaceType.PERSONAL,
        company_id: str = None,
        template: str = None
    ) -> WorkspaceConfig:
        """
        Crée un nouveau workspace.
        
        Args:
            user_id: ID de l'utilisateur
            name: Nom du workspace
            workspace_type: Type de workspace
            company_id: ID de l'entreprise (optionnel)
            template: Template de layout à utiliser
            
        Returns:
            WorkspaceConfig créé
        """
        workspace_id = f"ws_{uuid.uuid4().hex[:12]}"
        
        # Sélectionner le layout par défaut
        layout = self._get_template_layout(template or workspace_type.value)
        
        config = WorkspaceConfig(
            workspace_id=workspace_id,
            workspace_name=name,
            workspace_type=workspace_type,
            layout=layout
        )
        
        # Sauvegarder en base de données
        if self.db:
            await self.db.create(
                entity_type="workspace",
                data={
                    "workspace_id": workspace_id,
                    "user_id": user_id,
                    "company_id": company_id,
                    "workspace_name": name,
                    "workspace_type": workspace_type.value,
                    "theme": json.dumps(config.theme.__dict__),
                    "layout": json.dumps({
                        "panels": [p.__dict__ for p in config.layout.panels],
                        "widgets": [w.__dict__ for w in config.layout.widgets],
                        "quick_access": config.layout.quick_access,
                        "pinned_items": config.layout.pinned_items,
                        "default_panel": config.layout.default_panel
                    }),
                    "focus_settings": json.dumps(config.focus.__dict__),
                    "ai_settings": json.dumps(config.ai.__dict__),
                    "is_default": False
                }
            )
        
        logger.info(f"✅ Created workspace: {workspace_id} for user {user_id}")
        
        return config
    
    async def get_workspace(self, workspace_id: str) -> Optional[WorkspaceConfig]:
        """Récupère un workspace par son ID."""
        if self.db:
            result = await self.db.read("workspace", workspace_id)
            if result.success:
                return self._parse_workspace_config(result.data)
        return None
    
    async def update_workspace(
        self,
        workspace_id: str,
        updates: Dict[str, Any]
    ) -> bool:
        """Met à jour un workspace."""
        if self.db:
            result = await self.db.update("workspace", workspace_id, updates)
            return result.success
        return False
    
    async def delete_workspace(self, workspace_id: str) -> bool:
        """Supprime un workspace."""
        if self.db:
            result = await self.db.delete("workspace", workspace_id)
            return result.success
        return False
    
    async def list_user_workspaces(self, user_id: str) -> List[WorkspaceConfig]:
        """Liste les workspaces d'un utilisateur."""
        if self.db:
            from ..agents.database.database_agent import QueryFilter, QueryOptions
            result = await self.db.list(
                "workspace",
                QueryOptions(filters=[QueryFilter("user_id", "eq", user_id)])
            )
            if result.success:
                return [self._parse_workspace_config(ws) for ws in result.data.get("items", [])]
        return []
    
    # ═══════════════════════════════════════════════════════════════════════════
    # WORKSPACE STATE
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def open_workspace(
        self,
        workspace_id: str,
        user_id: str
    ) -> WorkspaceState:
        """
        Ouvre un workspace et initialise son état.
        
        Args:
            workspace_id: ID du workspace
            user_id: ID de l'utilisateur
            
        Returns:
            État du workspace
        """
        state = WorkspaceState(
            workspace_id=workspace_id,
            user_id=user_id
        )
        
        self._active_states[workspace_id] = state
        
        # Charger les données récentes
        if self.db:
            # Récupérer les éléments récents
            recent = await self.db.list(
                "data_item",
                QueryOptions(
                    filters=[QueryFilter("user_id", "eq", user_id)],
                    sort_by="last_accessed_at",
                    limit=10
                )
            )
            if recent.success:
                state.recent_items = [item["item_id"] for item in recent.data.get("items", [])]
        
        await self._emit_event("workspace_opened", {
            "workspace_id": workspace_id,
            "user_id": user_id
        })
        
        logger.info(f"📂 Opened workspace: {workspace_id}")
        
        return state
    
    async def close_workspace(self, workspace_id: str):
        """Ferme un workspace."""
        if workspace_id in self._active_states:
            state = self._active_states.pop(workspace_id)
            
            await self._emit_event("workspace_closed", {
                "workspace_id": workspace_id,
                "session_duration": (datetime.utcnow() - state.session_started_at).total_seconds()
            })
            
            logger.info(f"📁 Closed workspace: {workspace_id}")
    
    async def get_workspace_state(self, workspace_id: str) -> Optional[WorkspaceState]:
        """Récupère l'état actuel d'un workspace."""
        return self._active_states.get(workspace_id)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # PANEL MANAGEMENT
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def update_panel(
        self,
        workspace_id: str,
        panel_id: str,
        updates: Dict[str, Any]
    ) -> bool:
        """Met à jour la configuration d'un panneau."""
        config = await self.get_workspace(workspace_id)
        if not config:
            return False
        
        for panel in config.layout.panels:
            if panel.id == panel_id:
                for key, value in updates.items():
                    if hasattr(panel, key):
                        setattr(panel, key, value)
                break
        
        # Sauvegarder
        return await self.update_workspace(workspace_id, {
            "layout": json.dumps({
                "panels": [p.__dict__ for p in config.layout.panels],
                "widgets": [w.__dict__ for w in config.layout.widgets],
                "quick_access": config.layout.quick_access,
                "pinned_items": config.layout.pinned_items,
                "default_panel": config.layout.default_panel
            })
        })
    
    async def add_panel(
        self,
        workspace_id: str,
        panel_type: PanelType,
        position: str,
        settings: Dict = None
    ) -> Optional[PanelConfig]:
        """Ajoute un nouveau panneau."""
        config = await self.get_workspace(workspace_id)
        if not config:
            return None
        
        panel = PanelConfig(
            id=f"panel_{uuid.uuid4().hex[:8]}",
            type=panel_type,
            position=position,
            settings=settings or {}
        )
        
        config.layout.panels.append(panel)
        
        await self.update_workspace(workspace_id, {
            "layout": json.dumps({
                "panels": [p.__dict__ for p in config.layout.panels],
                "widgets": [w.__dict__ for w in config.layout.widgets],
                "quick_access": config.layout.quick_access,
                "pinned_items": config.layout.pinned_items,
                "default_panel": config.layout.default_panel
            })
        })
        
        return panel
    
    async def remove_panel(self, workspace_id: str, panel_id: str) -> bool:
        """Supprime un panneau."""
        config = await self.get_workspace(workspace_id)
        if not config:
            return False
        
        config.layout.panels = [p for p in config.layout.panels if p.id != panel_id]
        
        return await self.update_workspace(workspace_id, {
            "layout": json.dumps({
                "panels": [p.__dict__ for p in config.layout.panels],
                "widgets": [w.__dict__ for w in config.layout.widgets],
                "quick_access": config.layout.quick_access,
                "pinned_items": config.layout.pinned_items,
                "default_panel": config.layout.default_panel
            })
        })
    
    # ═══════════════════════════════════════════════════════════════════════════
    # FOCUS MODE
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def enable_focus_mode(
        self,
        workspace_id: str,
        mode: FocusMode = FocusMode.DEEP,
        duration_minutes: int = None
    ) -> Dict[str, Any]:
        """
        Active le mode focus.
        
        Args:
            workspace_id: ID du workspace
            mode: Type de focus
            duration_minutes: Durée en minutes
            
        Returns:
            Informations sur la session focus
        """
        state = await self.get_workspace_state(workspace_id)
        if not state:
            return {"error": "Workspace not open"}
        
        state.focus_started_at = datetime.utcnow()
        
        # Mettre à jour la configuration
        config = await self.get_workspace(workspace_id)
        if config:
            config.focus.enabled = True
            config.focus.mode = mode
            
            await self.update_workspace(workspace_id, {
                "focus_settings": json.dumps(config.focus.__dict__)
            })
        
        await self._emit_event("focus_started", {
            "workspace_id": workspace_id,
            "mode": mode.value,
            "duration_minutes": duration_minutes
        })
        
        focus_info = {
            "enabled": True,
            "mode": mode.value,
            "started_at": state.focus_started_at.isoformat(),
            "scheduled_end": None
        }
        
        if duration_minutes:
            focus_info["scheduled_end"] = (
                state.focus_started_at + timedelta(minutes=duration_minutes)
            ).isoformat()
        
        logger.info(f"🎯 Focus mode enabled: {mode.value} in workspace {workspace_id}")
        
        return focus_info
    
    async def disable_focus_mode(self, workspace_id: str) -> Dict[str, Any]:
        """Désactive le mode focus."""
        state = await self.get_workspace_state(workspace_id)
        if not state:
            return {"error": "Workspace not open"}
        
        duration = None
        if state.focus_started_at:
            duration = (datetime.utcnow() - state.focus_started_at).total_seconds()
        
        state.focus_started_at = None
        
        config = await self.get_workspace(workspace_id)
        if config:
            config.focus.enabled = False
            config.focus.mode = FocusMode.OFF
            
            await self.update_workspace(workspace_id, {
                "focus_settings": json.dumps(config.focus.__dict__)
            })
        
        await self._emit_event("focus_ended", {
            "workspace_id": workspace_id,
            "duration_seconds": duration
        })
        
        logger.info(f"🎯 Focus mode disabled in workspace {workspace_id}")
        
        return {
            "enabled": False,
            "duration_seconds": duration
        }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # QUICK ACCESS & PINNED ITEMS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def add_to_quick_access(self, workspace_id: str, item_id: str) -> bool:
        """Ajoute un élément en accès rapide."""
        config = await self.get_workspace(workspace_id)
        if not config:
            return False
        
        if item_id not in config.layout.quick_access:
            config.layout.quick_access.append(item_id)
            
            return await self.update_workspace(workspace_id, {
                "layout": json.dumps({
                    "panels": [p.__dict__ for p in config.layout.panels],
                    "widgets": [w.__dict__ for w in config.layout.widgets],
                    "quick_access": config.layout.quick_access,
                    "pinned_items": config.layout.pinned_items,
                    "default_panel": config.layout.default_panel
                })
            })
        
        return True
    
    async def remove_from_quick_access(self, workspace_id: str, item_id: str) -> bool:
        """Retire un élément de l'accès rapide."""
        config = await self.get_workspace(workspace_id)
        if not config:
            return False
        
        if item_id in config.layout.quick_access:
            config.layout.quick_access.remove(item_id)
            
            return await self.update_workspace(workspace_id, {
                "layout": json.dumps({
                    "panels": [p.__dict__ for p in config.layout.panels],
                    "widgets": [w.__dict__ for w in config.layout.widgets],
                    "quick_access": config.layout.quick_access,
                    "pinned_items": config.layout.pinned_items,
                    "default_panel": config.layout.default_panel
                })
            })
        
        return True
    
    async def pin_item(self, workspace_id: str, item_id: str) -> bool:
        """Épingle un élément."""
        config = await self.get_workspace(workspace_id)
        if not config:
            return False
        
        if item_id not in config.layout.pinned_items:
            config.layout.pinned_items.append(item_id)
            
            return await self.update_workspace(workspace_id, {
                "layout": json.dumps({
                    "panels": [p.__dict__ for p in config.layout.panels],
                    "widgets": [w.__dict__ for w in config.layout.widgets],
                    "quick_access": config.layout.quick_access,
                    "pinned_items": config.layout.pinned_items,
                    "default_panel": config.layout.default_panel
                })
            })
        
        return True
    
    async def unpin_item(self, workspace_id: str, item_id: str) -> bool:
        """Désépingle un élément."""
        config = await self.get_workspace(workspace_id)
        if not config:
            return False
        
        if item_id in config.layout.pinned_items:
            config.layout.pinned_items.remove(item_id)
            
            return await self.update_workspace(workspace_id, {
                "layout": json.dumps({
                    "panels": [p.__dict__ for p in config.layout.panels],
                    "widgets": [w.__dict__ for w in config.layout.widgets],
                    "quick_access": config.layout.quick_access,
                    "pinned_items": config.layout.pinned_items,
                    "default_panel": config.layout.default_panel
                })
            })
        
        return True
    
    # ═══════════════════════════════════════════════════════════════════════════
    # CONNECTED RESOURCES
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def connect_account(self, workspace_id: str, account_id: str) -> bool:
        """Connecte un compte au workspace."""
        config = await self.get_workspace(workspace_id)
        if not config:
            return False
        
        if account_id not in config.connected_accounts:
            config.connected_accounts.append(account_id)
            
            return await self.update_workspace(workspace_id, {
                "connected_accounts": config.connected_accounts
            })
        
        return True
    
    async def disconnect_account(self, workspace_id: str, account_id: str) -> bool:
        """Déconnecte un compte du workspace."""
        config = await self.get_workspace(workspace_id)
        if not config:
            return False
        
        if account_id in config.connected_accounts:
            config.connected_accounts.remove(account_id)
            
            return await self.update_workspace(workspace_id, {
                "connected_accounts": config.connected_accounts
            })
        
        return True
    
    async def get_workspace_data(self, workspace_id: str) -> Dict[str, Any]:
        """
        Récupère toutes les données accessibles depuis le workspace.
        
        Returns:
            Données agrégées de toutes les sources connectées
        """
        config = await self.get_workspace(workspace_id)
        if not config:
            return {"error": "Workspace not found"}
        
        data = {
            "workspace": config.__dict__,
            "connected_data": {}
        }
        
        # Récupérer les données de chaque compte connecté
        if self.integrations:
            for account_id in config.connected_accounts:
                # Récupérer le compte
                if self.db:
                    account = await self.db.read("connected_account", account_id)
                    if account.success:
                        account_data = account.data
                        provider = account_data.get("provider")
                        
                        # Récupérer un résumé des données
                        summary = await self.integrations.get_account_summary(
                            provider=provider,
                            access_token=account_data.get("access_token"),
                            shop_name=account_data.get("provider_data", {}).get("shop_name")
                        )
                        
                        data["connected_data"][account_id] = {
                            "provider": provider,
                            "account_name": account_data.get("provider_account_name"),
                            "summary": summary
                        }
        
        return data
    
    # ═══════════════════════════════════════════════════════════════════════════
    # HELPERS
    # ═══════════════════════════════════════════════════════════════════════════
    
    def _get_template_layout(self, template_name: str) -> WorkspaceLayout:
        """Récupère un layout template."""
        templates = {
            "personal": DefaultLayouts.personal,
            "project": DefaultLayouts.project,
            "focus": DefaultLayouts.focus,
            "analytics": DefaultLayouts.analytics,
            "team": DefaultLayouts.personal,  # Default to personal for now
        }
        
        template_func = templates.get(template_name, DefaultLayouts.personal)
        return template_func()
    
    def _parse_workspace_config(self, data: Dict) -> WorkspaceConfig:
        """Parse les données de la DB en WorkspaceConfig."""
        # Parsing simplifié
        return WorkspaceConfig(
            workspace_id=data.get("workspace_id"),
            workspace_name=data.get("workspace_name"),
            workspace_type=WorkspaceType(data.get("workspace_type", "personal")),
            is_default=data.get("is_default", False)
        )
    
    async def _emit_event(self, event_name: str, data: Dict):
        """Émet un événement aux handlers enregistrés."""
        if event_name in self._event_handlers:
            for handler in self._event_handlers[event_name]:
                try:
                    await handler(data)
                except Exception as e:
                    logger.error(f"Event handler error: {e}")
    
    def on_event(self, event_name: str, handler: Callable):
        """Enregistre un handler d'événement."""
        if event_name not in self._event_handlers:
            self._event_handlers[event_name] = []
        self._event_handlers[event_name].append(handler)


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

def create_workspace_service(
    database_agent=None,
    integration_manager=None
) -> VirtualWorkspaceService:
    """
    Factory pour créer le service de workspace.
    
    Args:
        database_agent: Agent de base de données
        integration_manager: Gestionnaire d'intégrations
        
    Returns:
        Instance de VirtualWorkspaceService
    """
    return VirtualWorkspaceService(database_agent, integration_manager)
