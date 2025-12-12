"""
CHE·NU - WebSocket Handler
═══════════════════════════════════════════════════════════════════════════════
Gestion des connexions WebSocket pour les notifications temps réel.

Fonctionnalités:
- Connexions persistantes par utilisateur
- Broadcast d'événements
- Rooms/Channels par scope
- Heartbeat et reconnexion
- Authentification WebSocket

Version: 1.0
═══════════════════════════════════════════════════════════════════════════════
"""

from typing import Optional, Dict, Any, Set, List
from uuid import UUID, uuid4
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum
import asyncio
import json
import logging

from fastapi import WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState

logger = logging.getLogger("CHENU.WebSocket")


# ═══════════════════════════════════════════════════════════════════════════════
# TYPES
# ═══════════════════════════════════════════════════════════════════════════════

class MessageType(str, Enum):
    """Types de messages WebSocket"""
    # Client -> Server
    AUTH = "auth"
    SUBSCRIBE = "subscribe"
    UNSUBSCRIBE = "unsubscribe"
    PING = "ping"
    MESSAGE = "message"
    
    # Server -> Client
    AUTH_SUCCESS = "auth_success"
    AUTH_FAILED = "auth_failed"
    SUBSCRIBED = "subscribed"
    UNSUBSCRIBED = "unsubscribed"
    PONG = "pong"
    EVENT = "event"
    NOTIFICATION = "notification"
    ERROR = "error"


@dataclass
class WSConnection:
    """Représente une connexion WebSocket"""
    id: UUID = field(default_factory=uuid4)
    websocket: WebSocket = None
    user_id: Optional[UUID] = None
    authenticated: bool = False
    subscriptions: Set[str] = field(default_factory=set)
    metadata: Dict[str, Any] = field(default_factory=dict)
    connected_at: datetime = field(default_factory=datetime.utcnow)
    last_activity: datetime = field(default_factory=datetime.utcnow)
    
    async def send(self, message: Dict[str, Any]) -> bool:
        """Envoie un message au client"""
        try:
            if self.websocket.client_state == WebSocketState.CONNECTED:
                await self.websocket.send_json(message)
                return True
        except Exception as e:
            logger.warning(f"Failed to send to {self.id}: {e}")
        return False
    
    async def close(self, code: int = 1000, reason: str = "Normal closure"):
        """Ferme la connexion"""
        try:
            await self.websocket.close(code=code, reason=reason)
        except Exception:
            pass


# ═══════════════════════════════════════════════════════════════════════════════
# WEBSOCKET MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class WebSocketManager:
    """
    Gestionnaire central des connexions WebSocket.
    
    Usage:
        manager = WebSocketManager()
        
        # Dans un endpoint FastAPI
        @app.websocket("/ws")
        async def websocket_endpoint(websocket: WebSocket):
            await manager.connect(websocket)
    """
    
    def __init__(self, auth_service=None, event_bus=None):
        self.auth_service = auth_service
        self.event_bus = event_bus
        
        # Connexions actives
        self._connections: Dict[UUID, WSConnection] = {}
        self._user_connections: Dict[UUID, Set[UUID]] = {}  # user_id -> connection_ids
        
        # Channels/Rooms
        self._channels: Dict[str, Set[UUID]] = {}  # channel_name -> connection_ids
        
        # Heartbeat
        self._heartbeat_task: Optional[asyncio.Task] = None
        self._heartbeat_interval = 30  # secondes
        self._connection_timeout = 90  # secondes
    
    # ═══════════════════════════════════════════════════════════════════════════
    # CONNEXION
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def connect(self, websocket: WebSocket) -> WSConnection:
        """
        Accepte une nouvelle connexion WebSocket.
        
        Flow:
        1. Accepter la connexion
        2. Créer l'objet connection
        3. Attendre l'authentification
        4. Démarrer l'écoute des messages
        """
        await websocket.accept()
        
        connection = WSConnection(websocket=websocket)
        self._connections[connection.id] = connection
        
        logger.info(f"New WebSocket connection: {connection.id}")
        
        # Envoyer un message de bienvenue
        await connection.send({
            "type": "welcome",
            "connection_id": str(connection.id),
            "message": "Connected to CHE·NU. Please authenticate."
        })
        
        # Démarrer l'écoute des messages
        try:
            await self._listen(connection)
        except WebSocketDisconnect:
            await self.disconnect(connection.id)
        except Exception as e:
            logger.error(f"WebSocket error: {e}")
            await self.disconnect(connection.id)
        
        return connection
    
    async def disconnect(self, connection_id: UUID) -> None:
        """Déconnecte et nettoie une connexion"""
        connection = self._connections.get(connection_id)
        if not connection:
            return
        
        # Retirer des user_connections
        if connection.user_id:
            user_conns = self._user_connections.get(connection.user_id)
            if user_conns:
                user_conns.discard(connection_id)
                if not user_conns:
                    del self._user_connections[connection.user_id]
        
        # Retirer des channels
        for channel in list(connection.subscriptions):
            await self._leave_channel(connection, channel)
        
        # Fermer et supprimer
        await connection.close()
        del self._connections[connection_id]
        
        logger.info(f"WebSocket disconnected: {connection_id}")
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MESSAGE HANDLING
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def _listen(self, connection: WSConnection) -> None:
        """Écoute les messages d'une connexion"""
        while True:
            try:
                data = await connection.websocket.receive_json()
                connection.last_activity = datetime.utcnow()
                await self._handle_message(connection, data)
            except WebSocketDisconnect:
                raise
            except json.JSONDecodeError:
                await connection.send({
                    "type": MessageType.ERROR,
                    "error": "Invalid JSON"
                })
            except Exception as e:
                logger.error(f"Message handling error: {e}")
    
    async def _handle_message(
        self,
        connection: WSConnection,
        data: Dict[str, Any]
    ) -> None:
        """Traite un message reçu"""
        msg_type = data.get("type", "")
        
        # PING - toujours disponible
        if msg_type == MessageType.PING:
            await connection.send({"type": MessageType.PONG})
            return
        
        # AUTH - doit être fait en premier
        if msg_type == MessageType.AUTH:
            await self._handle_auth(connection, data)
            return
        
        # Autres messages nécessitent authentification
        if not connection.authenticated:
            await connection.send({
                "type": MessageType.ERROR,
                "error": "Not authenticated"
            })
            return
        
        # SUBSCRIBE
        if msg_type == MessageType.SUBSCRIBE:
            channel = data.get("channel")
            if channel:
                await self._join_channel(connection, channel)
                await connection.send({
                    "type": MessageType.SUBSCRIBED,
                    "channel": channel
                })
            return
        
        # UNSUBSCRIBE
        if msg_type == MessageType.UNSUBSCRIBE:
            channel = data.get("channel")
            if channel:
                await self._leave_channel(connection, channel)
                await connection.send({
                    "type": MessageType.UNSUBSCRIBED,
                    "channel": channel
                })
            return
        
        # MESSAGE - pour les messages custom
        if msg_type == MessageType.MESSAGE:
            await self._handle_user_message(connection, data)
            return
        
        await connection.send({
            "type": MessageType.ERROR,
            "error": f"Unknown message type: {msg_type}"
        })
    
    async def _handle_auth(
        self,
        connection: WSConnection,
        data: Dict[str, Any]
    ) -> None:
        """Gère l'authentification WebSocket"""
        token = data.get("token")
        
        if not token:
            await connection.send({
                "type": MessageType.AUTH_FAILED,
                "error": "No token provided"
            })
            return
        
        # Valider le token
        try:
            if self.auth_service:
                user = await self.auth_service.validate_token(token)
                user_id = user.id
            else:
                # Mode développement - accepter n'importe quel token
                user_id = UUID(token) if len(token) == 36 else uuid4()
            
            connection.user_id = user_id
            connection.authenticated = True
            
            # Ajouter aux user_connections
            if user_id not in self._user_connections:
                self._user_connections[user_id] = set()
            self._user_connections[user_id].add(connection.id)
            
            # Auto-subscribe aux channels personnels
            personal_channel = f"user:{user_id}"
            await self._join_channel(connection, personal_channel)
            
            await connection.send({
                "type": MessageType.AUTH_SUCCESS,
                "user_id": str(user_id),
                "subscriptions": list(connection.subscriptions)
            })
            
            logger.info(f"WebSocket authenticated: {connection.id} -> user {user_id}")
            
        except Exception as e:
            await connection.send({
                "type": MessageType.AUTH_FAILED,
                "error": str(e)
            })
    
    async def _handle_user_message(
        self,
        connection: WSConnection,
        data: Dict[str, Any]
    ) -> None:
        """Traite un message utilisateur"""
        target = data.get("target")  # Channel ou user_id
        content = data.get("content")
        
        if not target or not content:
            return
        
        # Construire le message
        message = {
            "type": MessageType.MESSAGE,
            "from": str(connection.user_id),
            "target": target,
            "content": content,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Envoyer au channel ou à l'utilisateur
        if target.startswith("channel:"):
            await self.broadcast_to_channel(target, message)
        elif target.startswith("user:"):
            target_user_id = UUID(target.replace("user:", ""))
            await self.send_to_user(target_user_id, message)
        else:
            # Traiter comme channel par défaut
            await self.broadcast_to_channel(target, message)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # CHANNELS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def _join_channel(self, connection: WSConnection, channel: str) -> None:
        """Ajoute une connexion à un channel"""
        if channel not in self._channels:
            self._channels[channel] = set()
        
        self._channels[channel].add(connection.id)
        connection.subscriptions.add(channel)
    
    async def _leave_channel(self, connection: WSConnection, channel: str) -> None:
        """Retire une connexion d'un channel"""
        if channel in self._channels:
            self._channels[channel].discard(connection.id)
            if not self._channels[channel]:
                del self._channels[channel]
        
        connection.subscriptions.discard(channel)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # BROADCASTING
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def send_to_user(
        self,
        user_id: UUID,
        message: Dict[str, Any]
    ) -> int:
        """
        Envoie un message à toutes les connexions d'un utilisateur.
        
        Returns:
            Nombre de connexions auxquelles le message a été envoyé
        """
        connection_ids = self._user_connections.get(user_id, set())
        sent = 0
        
        for conn_id in connection_ids:
            connection = self._connections.get(conn_id)
            if connection and await connection.send(message):
                sent += 1
        
        return sent
    
    async def broadcast_to_channel(
        self,
        channel: str,
        message: Dict[str, Any],
        exclude: Optional[Set[UUID]] = None
    ) -> int:
        """
        Broadcast un message à tous les membres d'un channel.
        
        Args:
            channel: Nom du channel
            message: Message à envoyer
            exclude: IDs de connexion à exclure
        
        Returns:
            Nombre de connexions auxquelles le message a été envoyé
        """
        connection_ids = self._channels.get(channel, set())
        exclude = exclude or set()
        sent = 0
        
        for conn_id in connection_ids:
            if conn_id in exclude:
                continue
            
            connection = self._connections.get(conn_id)
            if connection and await connection.send(message):
                sent += 1
        
        return sent
    
    async def broadcast_all(
        self,
        message: Dict[str, Any],
        authenticated_only: bool = True
    ) -> int:
        """Broadcast à toutes les connexions"""
        sent = 0
        
        for connection in self._connections.values():
            if authenticated_only and not connection.authenticated:
                continue
            if await connection.send(message):
                sent += 1
        
        return sent
    
    async def send_notification(
        self,
        user_id: UUID,
        notification: Dict[str, Any]
    ) -> int:
        """Envoie une notification à un utilisateur"""
        return await self.send_to_user(user_id, {
            "type": MessageType.NOTIFICATION,
            "notification": notification,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def send_event(
        self,
        event_name: str,
        data: Dict[str, Any],
        channel: Optional[str] = None,
        user_id: Optional[UUID] = None
    ) -> int:
        """
        Envoie un événement via WebSocket.
        
        Peut être utilisé par l'Event Bus pour propager les événements.
        """
        message = {
            "type": MessageType.EVENT,
            "event": event_name,
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        if user_id:
            return await self.send_to_user(user_id, message)
        elif channel:
            return await self.broadcast_to_channel(channel, message)
        else:
            return await self.broadcast_all(message)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # HEARTBEAT
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def start_heartbeat(self) -> None:
        """Démarre le heartbeat pour détecter les connexions mortes"""
        self._heartbeat_task = asyncio.create_task(self._heartbeat_loop())
    
    async def stop_heartbeat(self) -> None:
        """Arrête le heartbeat"""
        if self._heartbeat_task:
            self._heartbeat_task.cancel()
            try:
                await self._heartbeat_task
            except asyncio.CancelledError:
                pass
    
    async def _heartbeat_loop(self) -> None:
        """Boucle de heartbeat"""
        while True:
            try:
                now = datetime.utcnow()
                dead_connections = []
                
                for conn_id, connection in self._connections.items():
                    # Vérifier le timeout
                    inactive_time = (now - connection.last_activity).total_seconds()
                    
                    if inactive_time > self._connection_timeout:
                        dead_connections.append(conn_id)
                        continue
                    
                    # Envoyer un ping
                    await connection.send({"type": "ping", "timestamp": now.isoformat()})
                
                # Nettoyer les connexions mortes
                for conn_id in dead_connections:
                    logger.info(f"Closing inactive connection: {conn_id}")
                    await self.disconnect(conn_id)
                
                await asyncio.sleep(self._heartbeat_interval)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Heartbeat error: {e}")
                await asyncio.sleep(self._heartbeat_interval)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # STATS
    # ═══════════════════════════════════════════════════════════════════════════
    
    def get_stats(self) -> Dict[str, Any]:
        """Retourne les statistiques WebSocket"""
        authenticated = sum(1 for c in self._connections.values() if c.authenticated)
        
        return {
            "total_connections": len(self._connections),
            "authenticated_connections": authenticated,
            "unique_users": len(self._user_connections),
            "channels": len(self._channels),
            "subscriptions": sum(len(c.subscriptions) for c in self._connections.values())
        }
    
    def get_channel_members(self, channel: str) -> List[Dict[str, Any]]:
        """Liste les membres d'un channel"""
        connection_ids = self._channels.get(channel, set())
        members = []
        
        for conn_id in connection_ids:
            connection = self._connections.get(conn_id)
            if connection:
                members.append({
                    "connection_id": str(conn_id),
                    "user_id": str(connection.user_id) if connection.user_id else None,
                    "connected_at": connection.connected_at.isoformat()
                })
        
        return members


# ═══════════════════════════════════════════════════════════════════════════════
# FASTAPI INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

def create_websocket_routes(app, manager: WebSocketManager):
    """
    Ajoute les routes WebSocket à l'application FastAPI.
    
    Usage:
        manager = WebSocketManager()
        create_websocket_routes(app, manager)
    """
    from fastapi import Depends
    
    @app.websocket("/ws")
    async def websocket_endpoint(websocket: WebSocket):
        """Point d'entrée WebSocket principal"""
        await manager.connect(websocket)
    
    @app.websocket("/ws/{channel}")
    async def websocket_channel(websocket: WebSocket, channel: str):
        """Point d'entrée pour un channel spécifique"""
        connection = await manager.connect(websocket)
        if connection.authenticated:
            await manager._join_channel(connection, channel)
    
    @app.get("/ws/stats")
    async def websocket_stats():
        """Stats des connexions WebSocket"""
        return manager.get_stats()
    
    @app.get("/ws/channels/{channel}/members")
    async def channel_members(channel: str):
        """Liste les membres d'un channel"""
        return manager.get_channel_members(channel)


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

_manager_instance: Optional[WebSocketManager] = None

def get_websocket_manager(
    auth_service=None,
    event_bus=None
) -> WebSocketManager:
    """Factory pour le WebSocket Manager"""
    global _manager_instance
    if _manager_instance is None:
        _manager_instance = WebSocketManager(auth_service, event_bus)
    return _manager_instance
