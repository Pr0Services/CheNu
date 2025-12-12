"""
CHE·NU Unified - WebSocket Notifications
═══════════════════════════════════════════════════════════════════════════════
Système de notifications temps réel via WebSocket.

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Set
from datetime import datetime
from enum import Enum
import asyncio
import json
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel, Field

logger = logging.getLogger("CHE·NU.WebSocket")

router = APIRouter(tags=["WebSocket"])


# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class NotificationType(str, Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"
    SYNC = "sync"
    AGENT = "agent"
    TASK = "task"


class Notification(BaseModel):
    """Notification temps réel."""
    id: str = Field(default_factory=lambda: f"notif-{datetime.utcnow().timestamp()}")
    type: NotificationType = NotificationType.INFO
    title: str
    message: Optional[str] = None
    source: Optional[str] = None
    data: Dict[str, Any] = {}
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    def to_json(self) -> str:
        return json.dumps({
            "id": self.id,
            "type": self.type.value,
            "title": self.title,
            "message": self.message,
            "source": self.source,
            "data": self.data,
            "timestamp": self.timestamp.isoformat(),
        })


# ═══════════════════════════════════════════════════════════════════════════════
# CONNECTION MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class ConnectionManager:
    """Gestionnaire de connexions WebSocket."""
    
    def __init__(self):
        # Connexions actives par user_id
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # Connexions globales (broadcast)
        self.global_connections: Set[WebSocket] = set()
        # File d'attente des notifications
        self.notification_queue: asyncio.Queue = asyncio.Queue()
        # Task de broadcast
        self._broadcast_task: Optional[asyncio.Task] = None
    
    async def connect(self, websocket: WebSocket, user_id: str = "global"):
        """Accepte une nouvelle connexion."""
        await websocket.accept()
        
        if user_id == "global":
            self.global_connections.add(websocket)
        else:
            if user_id not in self.active_connections:
                self.active_connections[user_id] = set()
            self.active_connections[user_id].add(websocket)
        
        logger.info(f"🔌 WebSocket connected: {user_id} (total: {self.count()})")
        
        # Démarre le broadcast si pas déjà actif
        if self._broadcast_task is None or self._broadcast_task.done():
            self._broadcast_task = asyncio.create_task(self._broadcast_loop())
    
    def disconnect(self, websocket: WebSocket, user_id: str = "global"):
        """Ferme une connexion."""
        if user_id == "global":
            self.global_connections.discard(websocket)
        else:
            if user_id in self.active_connections:
                self.active_connections[user_id].discard(websocket)
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
        
        logger.info(f"🔌 WebSocket disconnected: {user_id} (total: {self.count()})")
    
    def count(self) -> int:
        """Nombre total de connexions."""
        return len(self.global_connections) + sum(
            len(conns) for conns in self.active_connections.values()
        )
    
    async def send_to_user(self, user_id: str, notification: Notification):
        """Envoie une notification à un utilisateur spécifique."""
        connections = self.active_connections.get(user_id, set())
        message = notification.to_json()
        
        disconnected = set()
        for websocket in connections:
            try:
                await websocket.send_text(message)
            except Exception:
                disconnected.add(websocket)
        
        # Nettoie les connexions mortes
        for ws in disconnected:
            self.disconnect(ws, user_id)
    
    async def broadcast(self, notification: Notification):
        """Envoie une notification à tous les clients."""
        message = notification.to_json()
        
        # Broadcast aux connexions globales
        disconnected = set()
        for websocket in self.global_connections:
            try:
                await websocket.send_text(message)
            except Exception:
                disconnected.add(websocket)
        
        for ws in disconnected:
            self.global_connections.discard(ws)
        
        # Broadcast à tous les utilisateurs
        for user_id, connections in list(self.active_connections.items()):
            disconnected = set()
            for websocket in connections:
                try:
                    await websocket.send_text(message)
                except Exception:
                    disconnected.add(websocket)
            
            for ws in disconnected:
                self.disconnect(ws, user_id)
    
    async def queue_notification(self, notification: Notification):
        """Ajoute une notification à la file d'attente."""
        await self.notification_queue.put(notification)
    
    async def _broadcast_loop(self):
        """Boucle de broadcast des notifications."""
        while True:
            try:
                notification = await self.notification_queue.get()
                await self.broadcast(notification)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Broadcast error: {e}")


# Instance globale
manager = ConnectionManager()


# ═══════════════════════════════════════════════════════════════════════════════
# WEBSOCKET ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket):
    """
    WebSocket pour les notifications temps réel.
    
    Se connecte et reçoit les notifications push.
    """
    user_id = websocket.query_params.get("user_id", "global")
    
    await manager.connect(websocket, user_id)
    
    # Envoie un message de bienvenue
    welcome = Notification(
        type=NotificationType.INFO,
        title="Connecté",
        message="Vous recevrez les notifications en temps réel",
        source="system",
    )
    await websocket.send_text(welcome.to_json())
    
    try:
        while True:
            # Attend les messages du client (ping/pong, etc.)
            data = await websocket.receive_text()
            
            # Traite les commandes du client
            try:
                message = json.loads(data)
                if message.get("type") == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
                elif message.get("type") == "subscribe":
                    # Abonnement à des topics spécifiques
                    pass
            except json.JSONDecodeError:
                pass
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)


@router.websocket("/ws/live-data")
async def websocket_live_data(websocket: WebSocket):
    """
    WebSocket pour les données en temps réel (métriques, stats).
    
    Envoie des mises à jour périodiques des KPIs.
    """
    await websocket.accept()
    
    try:
        while True:
            # Simule des données en temps réel
            data = {
                "type": "live_data",
                "timestamp": datetime.utcnow().isoformat(),
                "metrics": {
                    "orders_today": 12 + int(datetime.utcnow().second % 5),
                    "revenue_today": 2345.67 + float(datetime.utcnow().second * 10),
                    "active_users": 45 + int(datetime.utcnow().second % 10),
                    "tasks_completed": 8 + int(datetime.utcnow().minute % 3),
                },
                "alerts": generate_random_alerts(),
            }
            
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(5)  # Update toutes les 5 secondes
            
    except WebSocketDisconnect:
        pass


def generate_random_alerts() -> List[Dict[str, Any]]:
    """Génère des alertes aléatoires pour la démo."""
    import random
    
    alerts = [
        {"type": "success", "message": "Commande #1234 livrée", "source": "Shopify"},
        {"type": "warning", "message": "Stock faible: Casque Pro", "source": "Inventory"},
        {"type": "info", "message": "Nouveau lead: Marie G.", "source": "HubSpot"},
        {"type": "success", "message": "Paiement reçu: $450", "source": "Stripe"},
        {"type": "warning", "message": "Facture en retard: INV-003", "source": "QuickBooks"},
    ]
    
    # Retourne 0-2 alertes aléatoires
    return random.sample(alerts, k=random.randint(0, 2))


# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS POUR ENVOYER DES NOTIFICATIONS
# ═══════════════════════════════════════════════════════════════════════════════

http_router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


class SendNotificationRequest(BaseModel):
    type: NotificationType = NotificationType.INFO
    title: str
    message: Optional[str] = None
    source: Optional[str] = None
    user_id: Optional[str] = None  # None = broadcast


@http_router.post("/send")
async def send_notification(request: SendNotificationRequest) -> Dict[str, Any]:
    """Envoie une notification via WebSocket."""
    notification = Notification(
        type=request.type,
        title=request.title,
        message=request.message,
        source=request.source,
    )
    
    if request.user_id:
        await manager.send_to_user(request.user_id, notification)
    else:
        await manager.queue_notification(notification)
    
    return {
        "success": True,
        "notification_id": notification.id,
        "broadcast": request.user_id is None,
    }


@http_router.get("/stats")
async def get_notification_stats() -> Dict[str, Any]:
    """Statistiques des connexions WebSocket."""
    return {
        "total_connections": manager.count(),
        "global_connections": len(manager.global_connections),
        "user_connections": {
            user_id: len(conns) 
            for user_id, conns in manager.active_connections.items()
        },
    }


# ═══════════════════════════════════════════════════════════════════════════════
# NOTIFICATION HELPERS
# ═══════════════════════════════════════════════════════════════════════════════

async def notify_sync_complete(provider: str, records_synced: int):
    """Notifie la fin d'une synchronisation."""
    notification = Notification(
        type=NotificationType.SYNC,
        title=f"Sync {provider} terminée",
        message=f"{records_synced} enregistrements synchronisés",
        source=provider,
        data={"records": records_synced},
    )
    await manager.queue_notification(notification)


async def notify_agent_task(agent: str, task: str, status: str):
    """Notifie une action d'agent."""
    notification = Notification(
        type=NotificationType.AGENT,
        title=f"Agent {agent}",
        message=f"Tâche: {task} - {status}",
        source=agent,
        data={"task": task, "status": status},
    )
    await manager.queue_notification(notification)


async def notify_error(source: str, error: str):
    """Notifie une erreur."""
    notification = Notification(
        type=NotificationType.ERROR,
        title=f"Erreur {source}",
        message=error,
        source=source,
    )
    await manager.queue_notification(notification)


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    "router",
    "http_router",
    "manager",
    "Notification",
    "NotificationType",
    "notify_sync_complete",
    "notify_agent_task",
    "notify_error",
]
