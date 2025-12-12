"""
CHE·NU v6.0 - Integration Service
═══════════════════════════════════════════════════════════════════════════════
Service centralisé pour gérer toutes les intégrations externes.
Synchronisation bidirectionnelle avec les sources connectées.

Author: CHE·NU Team
Version: 6.0
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Callable, AsyncIterator
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
import uuid
import json
import logging
import asyncio
from abc import ABC, abstractmethod

import aiohttp

from ..oauth.oauth_manager import (
    OAuthProvider,
    OAuthManager,
    GoogleDriveClient,
    ShopifyClient,
    YouTubeClient,
    FacebookClient,
    get_provider_client
)

logger = logging.getLogger("CHE·NU.Integrations")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS & TYPES
# ═══════════════════════════════════════════════════════════════════════════════

class SyncDirection(Enum):
    """Direction de synchronisation."""
    PULL = "pull"      # Depuis la source vers CHE·NU
    PUSH = "push"      # Depuis CHE·NU vers la source
    BIDIRECTIONAL = "bidirectional"


class SyncStatus(Enum):
    """Statut de synchronisation."""
    IDLE = "idle"
    SYNCING = "syncing"
    COMPLETED = "completed"
    FAILED = "failed"
    PAUSED = "paused"


class DataType(Enum):
    """Types de données synchronisables."""
    FILES = "files"
    CONTACTS = "contacts"
    EVENTS = "events"
    PRODUCTS = "products"
    ORDERS = "orders"
    CUSTOMERS = "customers"
    INVOICES = "invoices"
    POSTS = "posts"
    VIDEOS = "videos"
    ANALYTICS = "analytics"
    MESSAGES = "messages"
    PROJECTS = "projects"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class SyncConfig:
    """Configuration de synchronisation."""
    direction: SyncDirection = SyncDirection.PULL
    data_types: List[DataType] = field(default_factory=list)
    auto_sync: bool = True
    sync_interval_minutes: int = 60
    max_items_per_sync: int = 1000
    conflict_resolution: str = "source_wins"  # source_wins, local_wins, newest_wins


@dataclass
class SyncResult:
    """Résultat d'une synchronisation."""
    sync_id: str
    account_id: str
    provider: str
    status: SyncStatus
    started_at: datetime
    completed_at: Optional[datetime] = None
    items_fetched: int = 0
    items_created: int = 0
    items_updated: int = 0
    items_deleted: int = 0
    items_failed: int = 0
    errors: List[str] = field(default_factory=list)
    
    @property
    def duration_seconds(self) -> Optional[float]:
        if self.completed_at and self.started_at:
            return (self.completed_at - self.started_at).total_seconds()
        return None


@dataclass
class IntegrationData:
    """Données d'une intégration."""
    source_id: str
    source_type: str
    data_type: DataType
    title: str
    content: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    raw_data: Dict[str, Any] = field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# ═══════════════════════════════════════════════════════════════════════════════
# BASE INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class BaseIntegration(ABC):
    """Classe de base pour les intégrations."""
    
    def __init__(
        self,
        account_id: str,
        access_token: str,
        refresh_token: str = None,
        config: SyncConfig = None
    ):
        self.account_id = account_id
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.config = config or SyncConfig()
        self.last_sync: Optional[datetime] = None
    
    @property
    @abstractmethod
    def provider(self) -> OAuthProvider:
        """Retourne le provider OAuth."""
        pass
    
    @property
    @abstractmethod
    def supported_data_types(self) -> List[DataType]:
        """Retourne les types de données supportés."""
        pass
    
    @abstractmethod
    async def fetch_data(
        self,
        data_type: DataType,
        since: datetime = None,
        limit: int = 100
    ) -> AsyncIterator[IntegrationData]:
        """Récupère les données depuis la source."""
        pass
    
    @abstractmethod
    async def push_data(
        self,
        data: IntegrationData
    ) -> bool:
        """Pousse des données vers la source."""
        pass
    
    async def sync(
        self,
        data_types: List[DataType] = None,
        since: datetime = None
    ) -> SyncResult:
        """
        Effectue une synchronisation.
        
        Args:
            data_types: Types de données à synchroniser
            since: Synchroniser depuis cette date
            
        Returns:
            SyncResult avec les statistiques
        """
        sync_id = f"sync_{uuid.uuid4().hex[:12]}"
        result = SyncResult(
            sync_id=sync_id,
            account_id=self.account_id,
            provider=self.provider.value,
            status=SyncStatus.SYNCING,
            started_at=datetime.utcnow()
        )
        
        try:
            types_to_sync = data_types or self.config.data_types or self.supported_data_types
            
            for data_type in types_to_sync:
                if data_type not in self.supported_data_types:
                    continue
                
                async for item in self.fetch_data(data_type, since, self.config.max_items_per_sync):
                    result.items_fetched += 1
                    # Ici, on sauvegarderait dans la base de données
                    result.items_created += 1
            
            result.status = SyncStatus.COMPLETED
            
        except Exception as e:
            result.status = SyncStatus.FAILED
            result.errors.append(str(e))
            logger.error(f"Sync failed for {self.account_id}: {e}")
        
        result.completed_at = datetime.utcnow()
        self.last_sync = result.completed_at
        
        return result


# ═══════════════════════════════════════════════════════════════════════════════
# GOOGLE DRIVE INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class GoogleDriveIntegration(BaseIntegration):
    """Intégration Google Drive."""
    
    @property
    def provider(self) -> OAuthProvider:
        return OAuthProvider.GOOGLE_DRIVE
    
    @property
    def supported_data_types(self) -> List[DataType]:
        return [DataType.FILES]
    
    async def fetch_data(
        self,
        data_type: DataType,
        since: datetime = None,
        limit: int = 100
    ) -> AsyncIterator[IntegrationData]:
        """Récupère les fichiers depuis Google Drive."""
        async with GoogleDriveClient(self.access_token, self.refresh_token) as client:
            result = await client.list_files(page_size=limit)
            
            for file in result.get("files", []):
                yield IntegrationData(
                    source_id=file["id"],
                    source_type="google_drive",
                    data_type=DataType.FILES,
                    title=file["name"],
                    metadata={
                        "mime_type": file.get("mimeType"),
                        "size": file.get("size"),
                        "parents": file.get("parents", [])
                    },
                    raw_data=file,
                    created_at=datetime.fromisoformat(file["createdTime"].replace("Z", "+00:00")) if file.get("createdTime") else None,
                    updated_at=datetime.fromisoformat(file["modifiedTime"].replace("Z", "+00:00")) if file.get("modifiedTime") else None
                )
    
    async def push_data(self, data: IntegrationData) -> bool:
        """Upload un fichier vers Google Drive."""
        # Implémentation simplifiée
        return True
    
    async def create_folder(self, name: str, parent_id: str = None) -> Dict:
        """Crée un dossier dans Google Drive."""
        async with GoogleDriveClient(self.access_token) as client:
            # Implémentation
            pass
    
    async def organize_file(self, file_id: str, folder_id: str) -> bool:
        """Déplace un fichier dans un dossier."""
        # Implémentation
        return True


# ═══════════════════════════════════════════════════════════════════════════════
# SHOPIFY INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class ShopifyIntegration(BaseIntegration):
    """Intégration Shopify."""
    
    def __init__(self, account_id: str, access_token: str, shop_name: str, **kwargs):
        super().__init__(account_id, access_token, **kwargs)
        self.shop_name = shop_name
    
    @property
    def provider(self) -> OAuthProvider:
        return OAuthProvider.SHOPIFY
    
    @property
    def supported_data_types(self) -> List[DataType]:
        return [DataType.PRODUCTS, DataType.ORDERS, DataType.CUSTOMERS, DataType.ANALYTICS]
    
    async def fetch_data(
        self,
        data_type: DataType,
        since: datetime = None,
        limit: int = 100
    ) -> AsyncIterator[IntegrationData]:
        """Récupère les données depuis Shopify."""
        async with ShopifyClient(self.access_token, self.shop_name) as client:
            if data_type == DataType.PRODUCTS:
                result = await client.list_products(limit=limit)
                for product in result.get("products", []):
                    yield IntegrationData(
                        source_id=str(product["id"]),
                        source_type="shopify",
                        data_type=DataType.PRODUCTS,
                        title=product["title"],
                        content=product.get("body_html"),
                        metadata={
                            "vendor": product.get("vendor"),
                            "product_type": product.get("product_type"),
                            "tags": product.get("tags"),
                            "variants": len(product.get("variants", [])),
                            "images": len(product.get("images", []))
                        },
                        raw_data=product,
                        created_at=datetime.fromisoformat(product["created_at"].replace("Z", "+00:00")) if product.get("created_at") else None,
                        updated_at=datetime.fromisoformat(product["updated_at"].replace("Z", "+00:00")) if product.get("updated_at") else None
                    )
            
            elif data_type == DataType.ORDERS:
                result = await client.list_orders(limit=limit)
                for order in result.get("orders", []):
                    yield IntegrationData(
                        source_id=str(order["id"]),
                        source_type="shopify",
                        data_type=DataType.ORDERS,
                        title=f"Order #{order['order_number']}",
                        metadata={
                            "order_number": order["order_number"],
                            "total_price": order.get("total_price"),
                            "currency": order.get("currency"),
                            "financial_status": order.get("financial_status"),
                            "fulfillment_status": order.get("fulfillment_status"),
                            "customer_email": order.get("email")
                        },
                        raw_data=order,
                        created_at=datetime.fromisoformat(order["created_at"].replace("Z", "+00:00")) if order.get("created_at") else None
                    )
    
    async def push_data(self, data: IntegrationData) -> bool:
        """Pousse des données vers Shopify."""
        return True
    
    async def get_sales_summary(self, days: int = 30) -> Dict[str, Any]:
        """Récupère un résumé des ventes."""
        async with ShopifyClient(self.access_token, self.shop_name) as client:
            orders = await client.list_orders(limit=250)
            
            total_sales = 0
            order_count = 0
            
            for order in orders.get("orders", []):
                total_sales += float(order.get("total_price", 0))
                order_count += 1
            
            return {
                "total_sales": total_sales,
                "order_count": order_count,
                "average_order_value": total_sales / order_count if order_count > 0 else 0,
                "period_days": days
            }


# ═══════════════════════════════════════════════════════════════════════════════
# YOUTUBE INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class YouTubeIntegration(BaseIntegration):
    """Intégration YouTube."""
    
    @property
    def provider(self) -> OAuthProvider:
        return OAuthProvider.YOUTUBE
    
    @property
    def supported_data_types(self) -> List[DataType]:
        return [DataType.VIDEOS, DataType.ANALYTICS]
    
    async def fetch_data(
        self,
        data_type: DataType,
        since: datetime = None,
        limit: int = 100
    ) -> AsyncIterator[IntegrationData]:
        """Récupère les données depuis YouTube."""
        async with YouTubeClient(self.access_token, self.refresh_token) as client:
            if data_type == DataType.VIDEOS:
                result = await client.list_videos(max_results=limit)
                
                for item in result.get("items", []):
                    snippet = item.get("snippet", {})
                    yield IntegrationData(
                        source_id=item["id"]["videoId"] if isinstance(item.get("id"), dict) else item["id"],
                        source_type="youtube",
                        data_type=DataType.VIDEOS,
                        title=snippet.get("title", ""),
                        content=snippet.get("description", ""),
                        metadata={
                            "channel_id": snippet.get("channelId"),
                            "channel_title": snippet.get("channelTitle"),
                            "thumbnails": snippet.get("thumbnails"),
                            "published_at": snippet.get("publishedAt")
                        },
                        raw_data=item,
                        created_at=datetime.fromisoformat(snippet["publishedAt"].replace("Z", "+00:00")) if snippet.get("publishedAt") else None
                    )
    
    async def push_data(self, data: IntegrationData) -> bool:
        """YouTube est read-only pour les vidéos."""
        return False
    
    async def get_channel_stats(self) -> Dict[str, Any]:
        """Récupère les statistiques de la chaîne."""
        async with YouTubeClient(self.access_token) as client:
            info = await client.get_account_info()
            
            if not info.get("items"):
                return {}
            
            channel = info["items"][0]
            stats = channel.get("statistics", {})
            
            return {
                "channel_id": channel.get("id"),
                "title": channel.get("snippet", {}).get("title"),
                "subscriber_count": int(stats.get("subscriberCount", 0)),
                "video_count": int(stats.get("videoCount", 0)),
                "view_count": int(stats.get("viewCount", 0))
            }


# ═══════════════════════════════════════════════════════════════════════════════
# FACEBOOK/INSTAGRAM INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class FacebookIntegration(BaseIntegration):
    """Intégration Facebook/Instagram."""
    
    @property
    def provider(self) -> OAuthProvider:
        return OAuthProvider.FACEBOOK
    
    @property
    def supported_data_types(self) -> List[DataType]:
        return [DataType.POSTS, DataType.ANALYTICS]
    
    async def fetch_data(
        self,
        data_type: DataType,
        since: datetime = None,
        limit: int = 100
    ) -> AsyncIterator[IntegrationData]:
        """Récupère les données depuis Facebook."""
        async with FacebookClient(self.access_token, self.refresh_token) as client:
            if data_type == DataType.POSTS:
                # Récupérer les pages d'abord
                pages = await client.list_pages()
                
                for page in pages.get("data", []):
                    # Pour chaque page, récupérer les posts
                    # (implémentation simplifiée)
                    yield IntegrationData(
                        source_id=page["id"],
                        source_type="facebook_page",
                        data_type=DataType.POSTS,
                        title=page["name"],
                        metadata={
                            "category": page.get("category"),
                            "has_access_token": "access_token" in page
                        },
                        raw_data=page
                    )
    
    async def push_data(self, data: IntegrationData) -> bool:
        """Publie un post sur Facebook."""
        async with FacebookClient(self.access_token) as client:
            if data.data_type == DataType.POSTS:
                page_id = data.metadata.get("page_id")
                page_token = data.metadata.get("page_token")
                
                if page_id and page_token:
                    result = await client.publish_post(
                        page_id=page_id,
                        page_token=page_token,
                        message=data.content or data.title,
                        link=data.metadata.get("link")
                    )
                    return "id" in result
        
        return False
    
    async def get_page_insights(self, page_id: str, page_token: str) -> Dict[str, Any]:
        """Récupère les insights d'une page."""
        async with FacebookClient(self.access_token) as client:
            return await client.get_page_insights(page_id, page_token)


# ═══════════════════════════════════════════════════════════════════════════════
# INTEGRATION MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class IntegrationManager:
    """
    🔄 Gestionnaire Central des Intégrations
    
    Coordonne toutes les intégrations et synchronisations.
    """
    
    def __init__(
        self,
        oauth_manager: OAuthManager,
        database_agent=None
    ):
        """
        Initialise le gestionnaire.
        
        Args:
            oauth_manager: Gestionnaire OAuth
            database_agent: Agent de base de données
        """
        self.oauth = oauth_manager
        self.db = database_agent
        self._active_syncs: Dict[str, SyncResult] = {}
        self._sync_tasks: Dict[str, asyncio.Task] = {}
        
        logger.info("🔄 Integration Manager initialized")
    
    def get_integration(
        self,
        provider: OAuthProvider,
        account_id: str,
        access_token: str,
        **kwargs
    ) -> BaseIntegration:
        """
        Crée une instance d'intégration.
        
        Args:
            provider: Fournisseur OAuth
            account_id: ID du compte
            access_token: Token d'accès
            **kwargs: Arguments supplémentaires
            
        Returns:
            Instance d'intégration appropriée
        """
        integrations = {
            OAuthProvider.GOOGLE_DRIVE: GoogleDriveIntegration,
            OAuthProvider.SHOPIFY: ShopifyIntegration,
            OAuthProvider.YOUTUBE: YouTubeIntegration,
            OAuthProvider.FACEBOOK: FacebookIntegration,
            OAuthProvider.INSTAGRAM: FacebookIntegration,
        }
        
        integration_class = integrations.get(provider)
        if not integration_class:
            raise ValueError(f"No integration for provider: {provider.value}")
        
        return integration_class(account_id, access_token, **kwargs)
    
    async def sync_account(
        self,
        account_id: str,
        provider: OAuthProvider,
        access_token: str,
        data_types: List[DataType] = None,
        **kwargs
    ) -> SyncResult:
        """
        Synchronise un compte.
        
        Args:
            account_id: ID du compte
            provider: Fournisseur
            access_token: Token d'accès
            data_types: Types de données à synchroniser
            **kwargs: Arguments supplémentaires
            
        Returns:
            SyncResult avec les statistiques
        """
        integration = self.get_integration(provider, account_id, access_token, **kwargs)
        
        result = await integration.sync(data_types)
        
        # Sauvegarder le résultat dans la base de données
        if self.db:
            await self.db.create(
                entity_type="sync_history",
                data={
                    "sync_id": result.sync_id,
                    "account_id": result.account_id,
                    "sync_type": "manual",
                    "status": result.status.value,
                    "items_fetched": result.items_fetched,
                    "items_created": result.items_created,
                    "items_updated": result.items_updated,
                    "items_deleted": result.items_deleted,
                    "items_failed": result.items_failed,
                    "started_at": result.started_at,
                    "completed_at": result.completed_at,
                    "duration_seconds": result.duration_seconds,
                    "error_message": "; ".join(result.errors) if result.errors else None
                }
            )
        
        return result
    
    async def schedule_sync(
        self,
        account_id: str,
        provider: OAuthProvider,
        access_token: str,
        interval_minutes: int = 60,
        **kwargs
    ):
        """
        Planifie une synchronisation récurrente.
        
        Args:
            account_id: ID du compte
            provider: Fournisseur
            access_token: Token d'accès
            interval_minutes: Intervalle en minutes
            **kwargs: Arguments supplémentaires
        """
        async def sync_loop():
            while True:
                try:
                    await self.sync_account(account_id, provider, access_token, **kwargs)
                except Exception as e:
                    logger.error(f"Scheduled sync failed: {e}")
                
                await asyncio.sleep(interval_minutes * 60)
        
        # Annuler la tâche existante si présente
        if account_id in self._sync_tasks:
            self._sync_tasks[account_id].cancel()
        
        # Créer la nouvelle tâche
        task = asyncio.create_task(sync_loop())
        self._sync_tasks[account_id] = task
        
        logger.info(f"📅 Scheduled sync for {account_id} every {interval_minutes} minutes")
    
    def cancel_scheduled_sync(self, account_id: str):
        """Annule une synchronisation planifiée."""
        if account_id in self._sync_tasks:
            self._sync_tasks[account_id].cancel()
            del self._sync_tasks[account_id]
            logger.info(f"🚫 Cancelled scheduled sync for {account_id}")
    
    async def get_sync_status(self, account_id: str) -> Optional[SyncResult]:
        """Récupère le statut de synchronisation d'un compte."""
        return self._active_syncs.get(account_id)
    
    async def get_account_summary(
        self,
        provider: OAuthProvider,
        access_token: str,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Récupère un résumé des données d'un compte.
        
        Args:
            provider: Fournisseur
            access_token: Token d'accès
            **kwargs: Arguments supplémentaires
            
        Returns:
            Résumé des données
        """
        summaries = {
            OAuthProvider.SHOPIFY: self._get_shopify_summary,
            OAuthProvider.YOUTUBE: self._get_youtube_summary,
            OAuthProvider.GOOGLE_DRIVE: self._get_drive_summary,
            OAuthProvider.FACEBOOK: self._get_facebook_summary,
        }
        
        summary_func = summaries.get(provider)
        if summary_func:
            return await summary_func(access_token, **kwargs)
        
        return {"provider": provider.value, "message": "No summary available"}
    
    async def _get_shopify_summary(self, access_token: str, shop_name: str = None, **kwargs) -> Dict:
        """Résumé Shopify."""
        if not shop_name:
            return {"error": "shop_name required"}
        
        integration = ShopifyIntegration("temp", access_token, shop_name)
        return await integration.get_sales_summary()
    
    async def _get_youtube_summary(self, access_token: str, **kwargs) -> Dict:
        """Résumé YouTube."""
        integration = YouTubeIntegration("temp", access_token)
        return await integration.get_channel_stats()
    
    async def _get_drive_summary(self, access_token: str, **kwargs) -> Dict:
        """Résumé Google Drive."""
        async with GoogleDriveClient(access_token) as client:
            info = await client.get_account_info()
            quota = info.get("storageQuota", {})
            
            return {
                "user_email": info.get("user", {}).get("emailAddress"),
                "storage_used_gb": int(quota.get("usage", 0)) / (1024**3),
                "storage_limit_gb": int(quota.get("limit", 0)) / (1024**3) if quota.get("limit") else "Unlimited"
            }
    
    async def _get_facebook_summary(self, access_token: str, **kwargs) -> Dict:
        """Résumé Facebook."""
        async with FacebookClient(access_token) as client:
            user = await client.get_account_info()
            pages = await client.list_pages()
            
            return {
                "user_name": user.get("name"),
                "user_id": user.get("id"),
                "pages_count": len(pages.get("data", []))
            }


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

def create_integration_manager(
    oauth_manager: OAuthManager,
    database_agent=None
) -> IntegrationManager:
    """
    Factory pour créer un Integration Manager.
    
    Args:
        oauth_manager: Gestionnaire OAuth
        database_agent: Agent de base de données
        
    Returns:
        Instance de IntegrationManager
    """
    return IntegrationManager(oauth_manager, database_agent)
