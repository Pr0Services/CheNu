"""
CHE·NU - Event Bus
═══════════════════════════════════════════════════════════════════════════════
Système central de communication par événements pour CHE·NU.

L'Event Bus est le cœur de la réactivité du système:
- Tous les composants émettent des événements
- Les composants intéressés s'abonnent aux événements
- Permet le découplage total entre modules
- Support temps réel via WebSocket

Version: 1.0
═══════════════════════════════════════════════════════════════════════════════
"""

from typing import Optional, List, Dict, Any, Callable, Awaitable, Set
from uuid import UUID, uuid4
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum
import asyncio
import json
import logging
import weakref

logger = logging.getLogger("CHENU.EventBus")


# ═══════════════════════════════════════════════════════════════════════════════
# TYPES
# ═══════════════════════════════════════════════════════════════════════════════

# Handler type: async function (event_data) -> None
EventHandler = Callable[[Dict[str, Any]], Awaitable[None]]


class EventPriority(int, Enum):
    """Priorité des handlers"""
    HIGHEST = 0
    HIGH = 25
    NORMAL = 50
    LOW = 75
    LOWEST = 100


@dataclass
class Event:
    """Représentation d'un événement"""
    id: UUID = field(default_factory=uuid4)
    name: str = ""
    data: Dict[str, Any] = field(default_factory=dict)
    
    # Métadonnées
    source: str = "system"  # Qui a émis l'événement
    user_id: Optional[UUID] = None
    scope: Optional[str] = None
    
    # Timing
    timestamp: datetime = field(default_factory=datetime.utcnow)
    
    # Propagation
    propagation_stopped: bool = False
    
    def stop_propagation(self) -> None:
        """Arrête la propagation aux handlers suivants"""
        self.propagation_stopped = True
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": str(self.id),
            "name": self.name,
            "data": self.data,
            "source": self.source,
            "user_id": str(self.user_id) if self.user_id else None,
            "scope": self.scope,
            "timestamp": self.timestamp.isoformat()
        }


@dataclass
class Subscription:
    """Abonnement à un événement"""
    id: UUID = field(default_factory=uuid4)
    event_pattern: str = ""  # Pattern (ex: "task.*", "*.created")
    handler: EventHandler = None
    priority: EventPriority = EventPriority.NORMAL
    
    # Filtres optionnels
    scope_filter: Optional[str] = None
    user_filter: Optional[UUID] = None
    
    # Options
    once: bool = False  # Se désabonne après le premier appel
    active: bool = True
    
    def matches(self, event: Event) -> bool:
        """Vérifie si l'événement correspond au pattern"""
        if not self.active:
            return False
        
        # Vérifier le pattern
        if not self._match_pattern(event.name):
            return False
        
        # Vérifier les filtres
        if self.scope_filter and event.scope != self.scope_filter:
            return False
        
        if self.user_filter and event.user_id != self.user_filter:
            return False
        
        return True
    
    def _match_pattern(self, event_name: str) -> bool:
        """Match un pattern avec wildcards"""
        pattern_parts = self.event_pattern.split('.')
        name_parts = event_name.split('.')
        
        if len(pattern_parts) != len(name_parts):
            # Exception pour le wildcard final
            if pattern_parts[-1] == '*' and len(pattern_parts) <= len(name_parts):
                pattern_parts = pattern_parts[:-1]
                name_parts = name_parts[:len(pattern_parts)]
            else:
                return False
        
        for pattern_part, name_part in zip(pattern_parts, name_parts):
            if pattern_part != '*' and pattern_part != name_part:
                return False
        
        return True


# ═══════════════════════════════════════════════════════════════════════════════
# ÉVÉNEMENTS STANDARD CHE·NU
# ═══════════════════════════════════════════════════════════════════════════════

class CheNuEvents:
    """Catalogue des événements standard CHE·NU"""
    
    # ═══════════════════════════════════════════════════════════════════════════
    # SYSTÈME
    # ═══════════════════════════════════════════════════════════════════════════
    SYSTEM_STARTUP = "system.startup"
    SYSTEM_SHUTDOWN = "system.shutdown"
    SYSTEM_ERROR = "system.error"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # UTILISATEUR
    # ═══════════════════════════════════════════════════════════════════════════
    USER_LOGIN = "user.login"
    USER_LOGOUT = "user.logout"
    USER_REGISTERED = "user.registered"
    USER_PROFILE_UPDATED = "user.profile.updated"
    USER_PREFERENCES_CHANGED = "user.preferences.changed"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MODULES
    # ═══════════════════════════════════════════════════════════════════════════
    MODULE_CREATED = "module.created"
    MODULE_UPDATED = "module.updated"
    MODULE_DELETED = "module.deleted"
    MODULE_ENABLED = "module.enabled"
    MODULE_DISABLED = "module.disabled"
    MODULE_PROPOSAL_CREATED = "module.proposal.created"
    MODULE_PROPOSAL_APPROVED = "module.proposal.approved"
    MODULE_PROPOSAL_REJECTED = "module.proposal.rejected"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TÂCHES
    # ═══════════════════════════════════════════════════════════════════════════
    TASK_CREATED = "task.created"
    TASK_UPDATED = "task.updated"
    TASK_COMPLETED = "task.completed"
    TASK_DELETED = "task.deleted"
    TASK_ASSIGNED = "task.assigned"
    TASK_DEADLINE_APPROACHING = "task.deadline.approaching"
    TASK_OVERDUE = "task.overdue"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # AGENTS
    # ═══════════════════════════════════════════════════════════════════════════
    AGENT_CREATED = "agent.created"
    AGENT_ACTIVATED = "agent.activated"
    AGENT_DEACTIVATED = "agent.deactivated"
    AGENT_TASK_ASSIGNED = "agent.task.assigned"
    AGENT_TASK_COMPLETED = "agent.task.completed"
    AGENT_MESSAGE_SENT = "agent.message.sent"
    AGENT_MESSAGE_RECEIVED = "agent.message.received"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # PROJETS
    # ═══════════════════════════════════════════════════════════════════════════
    PROJECT_CREATED = "project.created"
    PROJECT_UPDATED = "project.updated"
    PROJECT_COMPLETED = "project.completed"
    PROJECT_ARCHIVED = "project.archived"
    PROJECT_MEMBER_ADDED = "project.member.added"
    PROJECT_MEMBER_REMOVED = "project.member.removed"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # FINANCE
    # ═══════════════════════════════════════════════════════════════════════════
    EXPENSE_CREATED = "expense.created"
    EXPENSE_SUBMITTED = "expense.submitted"
    EXPENSE_APPROVED = "expense.approved"
    EXPENSE_REJECTED = "expense.rejected"
    INVOICE_CREATED = "invoice.created"
    INVOICE_SENT = "invoice.sent"
    INVOICE_PAID = "invoice.paid"
    BUDGET_THRESHOLD_REACHED = "budget.threshold.reached"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # ÉQUIPE
    # ═══════════════════════════════════════════════════════════════════════════
    TEAM_CREATED = "team.created"
    TEAM_MEMBER_JOINED = "team.member.joined"
    TEAM_MEMBER_LEFT = "team.member.left"
    TEAM_ROLE_CHANGED = "team.role.changed"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # SCHOLAR
    # ═══════════════════════════════════════════════════════════════════════════
    COURSE_STARTED = "course.started"
    COURSE_COMPLETED = "course.completed"
    COURSE_PROGRESS = "course.progress"
    STUDY_SESSION_STARTED = "study.session.started"
    STUDY_SESSION_COMPLETED = "study.session.completed"
    FLASHCARD_REVIEWED = "flashcard.reviewed"
    STREAK_UPDATED = "streak.updated"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # SOCIAL
    # ═══════════════════════════════════════════════════════════════════════════
    POST_CREATED = "post.created"
    POST_LIKED = "post.liked"
    POST_COMMENTED = "post.commented"
    POST_SHARED = "post.shared"
    FOLLOW_CREATED = "follow.created"
    MESSAGE_RECEIVED = "message.received"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # AUTOMATISATION
    # ═══════════════════════════════════════════════════════════════════════════
    AUTOMATION_TRIGGERED = "automation.triggered"
    AUTOMATION_COMPLETED = "automation.completed"
    AUTOMATION_FAILED = "automation.failed"
    WORKFLOW_STARTED = "workflow.started"
    WORKFLOW_COMPLETED = "workflow.completed"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # NOTIFICATIONS
    # ═══════════════════════════════════════════════════════════════════════════
    NOTIFICATION_CREATED = "notification.created"
    NOTIFICATION_READ = "notification.read"
    NOTIFICATION_DISMISSED = "notification.dismissed"


# ═══════════════════════════════════════════════════════════════════════════════
# EVENT BUS
# ═══════════════════════════════════════════════════════════════════════════════

class EventBus:
    """
    Bus central d'événements CHE·NU.
    
    Usage:
        bus = EventBus()
        
        # S'abonner
        await bus.subscribe("task.created", my_handler)
        await bus.subscribe("task.*", all_task_handler)
        
        # Émettre
        await bus.emit("task.created", {"id": "123", "title": "Ma tâche"})
    """
    
    def __init__(self, db_pool=None):
        self.db = db_pool
        self._subscriptions: Dict[UUID, Subscription] = {}
        self._pattern_index: Dict[str, Set[UUID]] = {}  # pattern -> subscription_ids
        self._middleware: List[Callable] = []
        self._lock = asyncio.Lock()
        
        # Stats
        self._events_emitted = 0
        self._events_handled = 0
        
        # WebSocket connections pour le temps réel
        self._ws_connections: Dict[UUID, Any] = {}
    
    # ═══════════════════════════════════════════════════════════════════════════
    # ABONNEMENTS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def subscribe(
        self,
        event_pattern: str,
        handler: EventHandler,
        priority: EventPriority = EventPriority.NORMAL,
        scope_filter: Optional[str] = None,
        user_filter: Optional[UUID] = None,
        once: bool = False
    ) -> UUID:
        """
        S'abonne à un pattern d'événements.
        
        Args:
            event_pattern: Pattern (ex: "task.created", "task.*", "*.completed")
            handler: Fonction async à appeler
            priority: Priorité d'exécution
            scope_filter: Filtrer par scope
            user_filter: Filtrer par utilisateur
            once: Se désabonner après le premier appel
        
        Returns:
            ID de l'abonnement (pour se désabonner)
        """
        subscription = Subscription(
            event_pattern=event_pattern,
            handler=handler,
            priority=priority,
            scope_filter=scope_filter,
            user_filter=user_filter,
            once=once
        )
        
        async with self._lock:
            self._subscriptions[subscription.id] = subscription
            
            # Indexer par pattern pour lookup rapide
            if event_pattern not in self._pattern_index:
                self._pattern_index[event_pattern] = set()
            self._pattern_index[event_pattern].add(subscription.id)
        
        logger.debug(f"Subscribed to '{event_pattern}' with id {subscription.id}")
        return subscription.id
    
    async def unsubscribe(self, subscription_id: UUID) -> bool:
        """Se désabonne d'un événement"""
        async with self._lock:
            if subscription_id not in self._subscriptions:
                return False
            
            subscription = self._subscriptions[subscription_id]
            pattern = subscription.event_pattern
            
            del self._subscriptions[subscription_id]
            
            if pattern in self._pattern_index:
                self._pattern_index[pattern].discard(subscription_id)
                if not self._pattern_index[pattern]:
                    del self._pattern_index[pattern]
        
        logger.debug(f"Unsubscribed {subscription_id}")
        return True
    
    # ═══════════════════════════════════════════════════════════════════════════
    # ÉMISSION
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def emit(
        self,
        event_name: str,
        data: Dict[str, Any] = None,
        source: str = "system",
        user_id: Optional[UUID] = None,
        scope: Optional[str] = None
    ) -> Event:
        """
        Émet un événement.
        
        Args:
            event_name: Nom de l'événement (ex: "task.created")
            data: Données de l'événement
            source: Source de l'événement
            user_id: Utilisateur concerné
            scope: Espace concerné
        
        Returns:
            L'événement créé
        """
        event = Event(
            name=event_name,
            data=data or {},
            source=source,
            user_id=user_id,
            scope=scope
        )
        
        # Appliquer les middlewares
        for middleware in self._middleware:
            event = await middleware(event)
            if event is None:
                return None  # Middleware a annulé l'événement
        
        self._events_emitted += 1
        
        # Logger l'événement
        await self._log_event(event)
        
        # Trouver les handlers correspondants
        handlers = await self._find_matching_handlers(event)
        
        # Exécuter les handlers par priorité
        to_unsubscribe = []
        
        for subscription in sorted(handlers, key=lambda s: s.priority.value):
            if event.propagation_stopped:
                break
            
            try:
                await subscription.handler(event.to_dict())
                self._events_handled += 1
                
                if subscription.once:
                    to_unsubscribe.append(subscription.id)
                    
            except Exception as e:
                logger.error(f"Handler error for '{event_name}': {e}")
        
        # Désabonner les handlers "once"
        for sub_id in to_unsubscribe:
            await self.unsubscribe(sub_id)
        
        # Envoyer via WebSocket aux clients connectés
        await self._broadcast_to_websocket(event)
        
        return event
    
    async def emit_batch(
        self,
        events: List[Dict[str, Any]]
    ) -> List[Event]:
        """Émet plusieurs événements en batch"""
        results = []
        for event_data in events:
            event = await self.emit(**event_data)
            if event:
                results.append(event)
        return results
    
    # ═══════════════════════════════════════════════════════════════════════════
    # HELPERS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def _find_matching_handlers(self, event: Event) -> List[Subscription]:
        """Trouve tous les handlers qui correspondent à l'événement"""
        matching = []
        
        for subscription in self._subscriptions.values():
            if subscription.matches(event):
                matching.append(subscription)
        
        return matching
    
    async def _log_event(self, event: Event) -> None:
        """Log l'événement en base de données"""
        if not self.db:
            return
        
        try:
            await self.db.execute("""
                INSERT INTO event_log (
                    id, event_name, event_data, source_type, source_id,
                    user_id, scope, emitted_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            """,
                event.id,
                event.name,
                json.dumps(event.data),
                event.source,
                None,  # source_id
                event.user_id,
                event.scope,
                event.timestamp
            )
        except Exception as e:
            logger.warning(f"Failed to log event: {e}")
    
    async def _broadcast_to_websocket(self, event: Event) -> None:
        """Envoie l'événement aux clients WebSocket"""
        if not self._ws_connections:
            return
        
        message = json.dumps({
            "type": "event",
            "event": event.to_dict()
        })
        
        for user_id, ws in list(self._ws_connections.items()):
            # Vérifier si l'événement est pour cet utilisateur
            if event.user_id and event.user_id != user_id:
                continue
            
            try:
                await ws.send_text(message)
            except Exception:
                # Connection fermée, la retirer
                del self._ws_connections[user_id]
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MIDDLEWARE
    # ═══════════════════════════════════════════════════════════════════════════
    
    def add_middleware(
        self,
        middleware: Callable[[Event], Awaitable[Optional[Event]]]
    ) -> None:
        """
        Ajoute un middleware qui intercepte tous les événements.
        
        Le middleware peut:
        - Modifier l'événement
        - Retourner None pour annuler l'événement
        """
        self._middleware.append(middleware)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # WEBSOCKET
    # ═══════════════════════════════════════════════════════════════════════════
    
    def register_websocket(self, user_id: UUID, websocket: Any) -> None:
        """Enregistre une connexion WebSocket pour recevoir les événements"""
        self._ws_connections[user_id] = websocket
    
    def unregister_websocket(self, user_id: UUID) -> None:
        """Retire une connexion WebSocket"""
        if user_id in self._ws_connections:
            del self._ws_connections[user_id]
    
    # ═══════════════════════════════════════════════════════════════════════════
    # STATS
    # ═══════════════════════════════════════════════════════════════════════════
    
    def get_stats(self) -> Dict[str, Any]:
        """Retourne les statistiques du bus"""
        return {
            "subscriptions_count": len(self._subscriptions),
            "patterns_count": len(self._pattern_index),
            "events_emitted": self._events_emitted,
            "events_handled": self._events_handled,
            "ws_connections": len(self._ws_connections)
        }
    
    def get_subscriptions(self, pattern: Optional[str] = None) -> List[Dict[str, Any]]:
        """Liste les abonnements"""
        subs = []
        for sub in self._subscriptions.values():
            if pattern and sub.event_pattern != pattern:
                continue
            subs.append({
                "id": str(sub.id),
                "pattern": sub.event_pattern,
                "priority": sub.priority.name,
                "scope_filter": sub.scope_filter,
                "active": sub.active
            })
        return subs


# ═══════════════════════════════════════════════════════════════════════════════
# DECORATORS
# ═══════════════════════════════════════════════════════════════════════════════

def on_event(
    event_pattern: str,
    priority: EventPriority = EventPriority.NORMAL,
    scope: Optional[str] = None
):
    """
    Décorateur pour marquer une fonction comme handler d'événement.
    
    Usage:
        @on_event("task.created")
        async def handle_task_created(event):
            print(f"Task created: {event['data']}")
    """
    def decorator(func: EventHandler):
        func._event_pattern = event_pattern
        func._event_priority = priority
        func._event_scope = scope
        return func
    return decorator


def register_handlers(bus: EventBus, obj: Any) -> None:
    """
    Enregistre automatiquement tous les handlers décorés d'un objet.
    
    Usage:
        class MyService:
            @on_event("task.created")
            async def handle_task(self, event):
                pass
        
        service = MyService()
        register_handlers(bus, service)
    """
    import inspect
    
    for name, method in inspect.getmembers(obj, predicate=inspect.ismethod):
        if hasattr(method, '_event_pattern'):
            asyncio.create_task(bus.subscribe(
                event_pattern=method._event_pattern,
                handler=method,
                priority=method._event_priority,
                scope_filter=method._event_scope
            ))


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

_bus_instance: Optional[EventBus] = None

async def get_event_bus(db_pool=None) -> EventBus:
    """Factory pour le bus d'événements"""
    global _bus_instance
    if _bus_instance is None:
        _bus_instance = EventBus(db_pool)
    return _bus_instance
