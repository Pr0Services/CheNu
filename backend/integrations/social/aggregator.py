"""
CHE·NU - Social Platforms Aggregator
====================================
Service d'agrégation pour les plateformes sociales externes.

Plateformes supportées:
- YouTube
- Twitch
- TikTok
- Facebook
- Instagram
- LinkedIn
- Twitter/X
- Notion
- Google Scholar

Version: 1.0
"""

from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from uuid import UUID
from enum import Enum
from dataclasses import dataclass
from abc import ABC, abstractmethod
import asyncio
import aiohttp
from pydantic import BaseModel


# ============================================================================
# ENUMS & TYPES
# ============================================================================

class Platform(str, Enum):
    YOUTUBE = "youtube"
    TWITCH = "twitch"
    TIKTOK = "tiktok"
    FACEBOOK = "facebook"
    INSTAGRAM = "instagram"
    LINKEDIN = "linkedin"
    TWITTER = "twitter"
    NOTION = "notion"
    GOOGLE_SCHOLAR = "google_scholar"


class ContentType(str, Enum):
    POST = "post"
    VIDEO = "video"
    STREAM = "stream"
    ARTICLE = "article"
    PAPER = "paper"
    STORY = "story"
    REEL = "reel"
    THREAD = "thread"


@dataclass
class SocialContent:
    """Contenu unifié provenant d'une plateforme"""
    platform: Platform
    content_type: ContentType
    id: str
    title: Optional[str]
    description: Optional[str]
    url: str
    thumbnail_url: Optional[str]
    author: Dict[str, Any]
    metrics: Dict[str, int]  # views, likes, comments, shares
    published_at: datetime
    raw_data: Dict[str, Any]


@dataclass
class SocialProfile:
    """Profil unifié d'une plateforme"""
    platform: Platform
    id: str
    username: str
    display_name: str
    avatar_url: Optional[str]
    bio: Optional[str]
    followers: int
    following: int
    url: str
    verified: bool
    raw_data: Dict[str, Any]


# ============================================================================
# BASE ADAPTER
# ============================================================================

class SocialPlatformAdapter(ABC):
    """Adaptateur de base pour les plateformes sociales"""
    
    platform: Platform
    
    def __init__(self, api_key: Optional[str] = None, access_token: Optional[str] = None):
        self.api_key = api_key
        self.access_token = access_token
        self._session: Optional[aiohttp.ClientSession] = None
    
    async def _get_session(self) -> aiohttp.ClientSession:
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession()
        return self._session
    
    async def close(self):
        if self._session and not self._session.closed:
            await self._session.close()
    
    @abstractmethod
    async def get_profile(self, user_id: str) -> SocialProfile:
        """Récupère le profil d'un utilisateur"""
        pass
    
    @abstractmethod
    async def get_content(self, content_id: str) -> SocialContent:
        """Récupère un contenu spécifique"""
        pass
    
    @abstractmethod
    async def search_content(self, query: str, limit: int = 20) -> List[SocialContent]:
        """Recherche du contenu"""
        pass
    
    @abstractmethod
    async def get_user_content(self, user_id: str, limit: int = 20) -> List[SocialContent]:
        """Récupère le contenu d'un utilisateur"""
        pass


# ============================================================================
# YOUTUBE ADAPTER
# ============================================================================

class YouTubeAdapter(SocialPlatformAdapter):
    """Adaptateur YouTube via YouTube Data API v3"""
    
    platform = Platform.YOUTUBE
    BASE_URL = "https://www.googleapis.com/youtube/v3"
    
    async def get_profile(self, channel_id: str) -> SocialProfile:
        session = await self._get_session()
        params = {
            "part": "snippet,statistics",
            "id": channel_id,
            "key": self.api_key
        }
        
        async with session.get(f"{self.BASE_URL}/channels", params=params) as resp:
            data = await resp.json()
            
        if not data.get("items"):
            raise ValueError(f"Channel not found: {channel_id}")
        
        item = data["items"][0]
        snippet = item["snippet"]
        stats = item["statistics"]
        
        return SocialProfile(
            platform=self.platform,
            id=channel_id,
            username=snippet.get("customUrl", "").replace("@", ""),
            display_name=snippet["title"],
            avatar_url=snippet.get("thumbnails", {}).get("high", {}).get("url"),
            bio=snippet.get("description"),
            followers=int(stats.get("subscriberCount", 0)),
            following=0,
            url=f"https://youtube.com/channel/{channel_id}",
            verified=False,  # Pas dispo dans l'API de base
            raw_data=item
        )
    
    async def get_content(self, video_id: str) -> SocialContent:
        session = await self._get_session()
        params = {
            "part": "snippet,statistics",
            "id": video_id,
            "key": self.api_key
        }
        
        async with session.get(f"{self.BASE_URL}/videos", params=params) as resp:
            data = await resp.json()
        
        if not data.get("items"):
            raise ValueError(f"Video not found: {video_id}")
        
        item = data["items"][0]
        snippet = item["snippet"]
        stats = item["statistics"]
        
        return SocialContent(
            platform=self.platform,
            content_type=ContentType.VIDEO,
            id=video_id,
            title=snippet["title"],
            description=snippet.get("description"),
            url=f"https://youtube.com/watch?v={video_id}",
            thumbnail_url=snippet.get("thumbnails", {}).get("high", {}).get("url"),
            author={
                "id": snippet["channelId"],
                "name": snippet["channelTitle"]
            },
            metrics={
                "views": int(stats.get("viewCount", 0)),
                "likes": int(stats.get("likeCount", 0)),
                "comments": int(stats.get("commentCount", 0))
            },
            published_at=datetime.fromisoformat(snippet["publishedAt"].replace("Z", "+00:00")),
            raw_data=item
        )
    
    async def search_content(self, query: str, limit: int = 20) -> List[SocialContent]:
        session = await self._get_session()
        params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": min(limit, 50),
            "key": self.api_key
        }
        
        async with session.get(f"{self.BASE_URL}/search", params=params) as resp:
            data = await resp.json()
        
        results = []
        for item in data.get("items", []):
            snippet = item["snippet"]
            video_id = item["id"]["videoId"]
            
            results.append(SocialContent(
                platform=self.platform,
                content_type=ContentType.VIDEO,
                id=video_id,
                title=snippet["title"],
                description=snippet.get("description"),
                url=f"https://youtube.com/watch?v={video_id}",
                thumbnail_url=snippet.get("thumbnails", {}).get("high", {}).get("url"),
                author={
                    "id": snippet["channelId"],
                    "name": snippet["channelTitle"]
                },
                metrics={},  # Pas dispo dans search
                published_at=datetime.fromisoformat(snippet["publishedAt"].replace("Z", "+00:00")),
                raw_data=item
            ))
        
        return results
    
    async def get_user_content(self, channel_id: str, limit: int = 20) -> List[SocialContent]:
        session = await self._get_session()
        
        # D'abord, obtenir l'upload playlist
        params = {
            "part": "contentDetails",
            "id": channel_id,
            "key": self.api_key
        }
        
        async with session.get(f"{self.BASE_URL}/channels", params=params) as resp:
            data = await resp.json()
        
        if not data.get("items"):
            return []
        
        uploads_playlist = data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
        
        # Récupérer les vidéos
        params = {
            "part": "snippet",
            "playlistId": uploads_playlist,
            "maxResults": min(limit, 50),
            "key": self.api_key
        }
        
        async with session.get(f"{self.BASE_URL}/playlistItems", params=params) as resp:
            data = await resp.json()
        
        results = []
        for item in data.get("items", []):
            snippet = item["snippet"]
            video_id = snippet["resourceId"]["videoId"]
            
            results.append(SocialContent(
                platform=self.platform,
                content_type=ContentType.VIDEO,
                id=video_id,
                title=snippet["title"],
                description=snippet.get("description"),
                url=f"https://youtube.com/watch?v={video_id}",
                thumbnail_url=snippet.get("thumbnails", {}).get("high", {}).get("url"),
                author={
                    "id": snippet["channelId"],
                    "name": snippet["channelTitle"]
                },
                metrics={},
                published_at=datetime.fromisoformat(snippet["publishedAt"].replace("Z", "+00:00")),
                raw_data=item
            ))
        
        return results


# ============================================================================
# TWITCH ADAPTER
# ============================================================================

class TwitchAdapter(SocialPlatformAdapter):
    """Adaptateur Twitch via Helix API"""
    
    platform = Platform.TWITCH
    BASE_URL = "https://api.twitch.tv/helix"
    
    async def _get_headers(self) -> Dict[str, str]:
        return {
            "Client-ID": self.api_key,
            "Authorization": f"Bearer {self.access_token}"
        }
    
    async def get_profile(self, user_login: str) -> SocialProfile:
        session = await self._get_session()
        headers = await self._get_headers()
        
        async with session.get(
            f"{self.BASE_URL}/users",
            params={"login": user_login},
            headers=headers
        ) as resp:
            data = await resp.json()
        
        if not data.get("data"):
            raise ValueError(f"User not found: {user_login}")
        
        user = data["data"][0]
        
        # Récupérer followers
        async with session.get(
            f"{self.BASE_URL}/channels/followers",
            params={"broadcaster_id": user["id"]},
            headers=headers
        ) as resp:
            followers_data = await resp.json()
        
        return SocialProfile(
            platform=self.platform,
            id=user["id"],
            username=user["login"],
            display_name=user["display_name"],
            avatar_url=user["profile_image_url"],
            bio=user.get("description"),
            followers=followers_data.get("total", 0),
            following=0,
            url=f"https://twitch.tv/{user['login']}",
            verified=user.get("broadcaster_type") == "partner",
            raw_data=user
        )
    
    async def get_content(self, video_id: str) -> SocialContent:
        session = await self._get_session()
        headers = await self._get_headers()
        
        async with session.get(
            f"{self.BASE_URL}/videos",
            params={"id": video_id},
            headers=headers
        ) as resp:
            data = await resp.json()
        
        if not data.get("data"):
            raise ValueError(f"Video not found: {video_id}")
        
        video = data["data"][0]
        
        return SocialContent(
            platform=self.platform,
            content_type=ContentType.VIDEO,
            id=video_id,
            title=video["title"],
            description=video.get("description"),
            url=video["url"],
            thumbnail_url=video["thumbnail_url"].replace("%{width}", "320").replace("%{height}", "180"),
            author={
                "id": video["user_id"],
                "name": video["user_name"]
            },
            metrics={
                "views": video.get("view_count", 0)
            },
            published_at=datetime.fromisoformat(video["created_at"].replace("Z", "+00:00")),
            raw_data=video
        )
    
    async def search_content(self, query: str, limit: int = 20) -> List[SocialContent]:
        # Twitch n'a pas de search vidéo direct, on search les streams/channels
        session = await self._get_session()
        headers = await self._get_headers()
        
        async with session.get(
            f"{self.BASE_URL}/search/channels",
            params={"query": query, "first": min(limit, 100)},
            headers=headers
        ) as resp:
            data = await resp.json()
        
        results = []
        for channel in data.get("data", []):
            results.append(SocialContent(
                platform=self.platform,
                content_type=ContentType.STREAM if channel["is_live"] else ContentType.VIDEO,
                id=channel["id"],
                title=channel["title"],
                description=None,
                url=f"https://twitch.tv/{channel['broadcaster_login']}",
                thumbnail_url=channel["thumbnail_url"],
                author={
                    "id": channel["id"],
                    "name": channel["display_name"]
                },
                metrics={},
                published_at=datetime.now(),
                raw_data=channel
            ))
        
        return results
    
    async def get_user_content(self, user_id: str, limit: int = 20) -> List[SocialContent]:
        session = await self._get_session()
        headers = await self._get_headers()
        
        async with session.get(
            f"{self.BASE_URL}/videos",
            params={"user_id": user_id, "first": min(limit, 100)},
            headers=headers
        ) as resp:
            data = await resp.json()
        
        results = []
        for video in data.get("data", []):
            results.append(SocialContent(
                platform=self.platform,
                content_type=ContentType.VIDEO,
                id=video["id"],
                title=video["title"],
                description=video.get("description"),
                url=video["url"],
                thumbnail_url=video["thumbnail_url"].replace("%{width}", "320").replace("%{height}", "180"),
                author={
                    "id": video["user_id"],
                    "name": video["user_name"]
                },
                metrics={
                    "views": video.get("view_count", 0)
                },
                published_at=datetime.fromisoformat(video["created_at"].replace("Z", "+00:00")),
                raw_data=video
            ))
        
        return results


# ============================================================================
# AGGREGATOR SERVICE
# ============================================================================

class SocialAggregator:
    """
    Service d'agrégation multi-plateformes
    
    Permet de:
    - Récupérer du contenu de plusieurs plateformes en parallèle
    - Normaliser les données dans un format unifié
    - Agréger les métriques
    """
    
    def __init__(self):
        self.adapters: Dict[Platform, SocialPlatformAdapter] = {}
    
    def register_adapter(self, adapter: SocialPlatformAdapter):
        """Enregistre un adaptateur pour une plateforme"""
        self.adapters[adapter.platform] = adapter
    
    async def close_all(self):
        """Ferme toutes les connexions"""
        for adapter in self.adapters.values():
            await adapter.close()
    
    async def search_all(
        self,
        query: str,
        platforms: Optional[List[Platform]] = None,
        limit_per_platform: int = 10
    ) -> Dict[Platform, List[SocialContent]]:
        """Recherche sur plusieurs plateformes en parallèle"""
        target_platforms = platforms or list(self.adapters.keys())
        
        tasks = []
        for platform in target_platforms:
            if platform in self.adapters:
                tasks.append(
                    self._search_platform(platform, query, limit_per_platform)
                )
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        output = {}
        for platform, result in zip(target_platforms, results):
            if isinstance(result, Exception):
                output[platform] = []  # Ou logger l'erreur
            else:
                output[platform] = result
        
        return output
    
    async def _search_platform(
        self,
        platform: Platform,
        query: str,
        limit: int
    ) -> List[SocialContent]:
        """Recherche sur une plateforme"""
        adapter = self.adapters.get(platform)
        if not adapter:
            return []
        
        try:
            return await adapter.search_content(query, limit)
        except Exception as e:
            print(f"Error searching {platform}: {e}")
            return []
    
    async def get_unified_feed(
        self,
        user_configs: Dict[Platform, str],  # Platform -> user_id
        limit_per_platform: int = 10
    ) -> List[SocialContent]:
        """
        Récupère un feed unifié de plusieurs plateformes.
        
        Args:
            user_configs: Mapping plateforme -> ID utilisateur à suivre
            limit_per_platform: Limite par plateforme
        
        Returns:
            Liste de contenus triée par date
        """
        tasks = []
        
        for platform, user_id in user_configs.items():
            if platform in self.adapters:
                tasks.append(
                    self._get_user_content(platform, user_id, limit_per_platform)
                )
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        all_content = []
        for result in results:
            if not isinstance(result, Exception):
                all_content.extend(result)
        
        # Trier par date
        all_content.sort(key=lambda x: x.published_at, reverse=True)
        
        return all_content
    
    async def _get_user_content(
        self,
        platform: Platform,
        user_id: str,
        limit: int
    ) -> List[SocialContent]:
        """Récupère le contenu d'un utilisateur"""
        adapter = self.adapters.get(platform)
        if not adapter:
            return []
        
        try:
            return await adapter.get_user_content(user_id, limit)
        except Exception as e:
            print(f"Error getting content from {platform}/{user_id}: {e}")
            return []
    
    async def get_metrics_summary(
        self,
        contents: List[SocialContent]
    ) -> Dict[str, Any]:
        """Calcule un résumé des métriques"""
        total_views = sum(c.metrics.get("views", 0) for c in contents)
        total_likes = sum(c.metrics.get("likes", 0) for c in contents)
        total_comments = sum(c.metrics.get("comments", 0) for c in contents)
        
        by_platform = {}
        for content in contents:
            platform = content.platform.value
            if platform not in by_platform:
                by_platform[platform] = {"count": 0, "views": 0, "likes": 0}
            by_platform[platform]["count"] += 1
            by_platform[platform]["views"] += content.metrics.get("views", 0)
            by_platform[platform]["likes"] += content.metrics.get("likes", 0)
        
        return {
            "total_content": len(contents),
            "total_views": total_views,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "by_platform": by_platform,
            "avg_engagement": (total_likes + total_comments) / max(len(contents), 1)
        }


# ============================================================================
# FACTORY
# ============================================================================

def create_aggregator(config: Dict[str, Dict[str, str]]) -> SocialAggregator:
    """
    Crée un aggregator configuré.
    
    Args:
        config: {
            "youtube": {"api_key": "..."},
            "twitch": {"api_key": "...", "access_token": "..."},
            ...
        }
    """
    aggregator = SocialAggregator()
    
    if "youtube" in config:
        aggregator.register_adapter(YouTubeAdapter(
            api_key=config["youtube"].get("api_key")
        ))
    
    if "twitch" in config:
        aggregator.register_adapter(TwitchAdapter(
            api_key=config["twitch"].get("api_key"),
            access_token=config["twitch"].get("access_token")
        ))
    
    # Ajouter d'autres adaptateurs ici...
    
    return aggregator
