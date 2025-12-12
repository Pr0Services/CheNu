"""
CHE·NU - Social Platform Integrations
═══════════════════════════════════════════════════════════════════════════════
Intégrations individuelles pour chaque plateforme sociale/streaming.

Plateformes supportées:
- YouTube
- Twitch  
- TikTok
- Facebook/Instagram (Meta)
- LinkedIn
- Twitter/X
- Google Scholar
- Notion

Version: 1.0
═══════════════════════════════════════════════════════════════════════════════
"""

from typing import Optional, List, Dict, Any
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import logging
import aiohttp

logger = logging.getLogger("CHENU.Integrations")


# ═══════════════════════════════════════════════════════════════════════════════
# BASE CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

class PlatformType(str, Enum):
    YOUTUBE = "youtube"
    TWITCH = "twitch"
    TIKTOK = "tiktok"
    FACEBOOK = "facebook"
    INSTAGRAM = "instagram"
    LINKEDIN = "linkedin"
    TWITTER = "twitter"
    GOOGLE_SCHOLAR = "google_scholar"
    NOTION = "notion"
    TRELLO = "trello"
    ASANA = "asana"


@dataclass
class PlatformCredentials:
    platform: PlatformType
    access_token: str
    refresh_token: Optional[str] = None
    expires_at: Optional[datetime] = None
    user_id: Optional[str] = None
    extra: Dict[str, Any] = field(default_factory=dict)


@dataclass
class SocialPost:
    """Post unifié depuis n'importe quelle plateforme"""
    id: str
    platform: PlatformType
    content: str
    author_name: str
    author_id: str
    author_avatar: Optional[str] = None
    media_urls: List[str] = field(default_factory=list)
    likes: int = 0
    comments: int = 0
    shares: int = 0
    views: int = 0
    created_at: datetime = field(default_factory=datetime.utcnow)
    url: Optional[str] = None
    extra: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "platform": self.platform.value,
            "content": self.content,
            "author_name": self.author_name,
            "author_id": self.author_id,
            "author_avatar": self.author_avatar,
            "media_urls": self.media_urls,
            "likes": self.likes,
            "comments": self.comments,
            "shares": self.shares,
            "views": self.views,
            "created_at": self.created_at.isoformat(),
            "url": self.url
        }


@dataclass  
class SocialVideo:
    """Vidéo unifiée depuis YouTube/Twitch/TikTok"""
    id: str
    platform: PlatformType
    title: str
    description: str
    thumbnail_url: Optional[str] = None
    video_url: Optional[str] = None
    duration_seconds: int = 0
    views: int = 0
    likes: int = 0
    comments: int = 0
    channel_name: str = ""
    channel_id: str = ""
    published_at: datetime = field(default_factory=datetime.utcnow)
    tags: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "platform": self.platform.value,
            "title": self.title,
            "description": self.description[:200] if self.description else "",
            "thumbnail_url": self.thumbnail_url,
            "video_url": self.video_url,
            "duration_seconds": self.duration_seconds,
            "views": self.views,
            "likes": self.likes,
            "comments": self.comments,
            "channel_name": self.channel_name,
            "published_at": self.published_at.isoformat(),
            "tags": self.tags
        }


class PlatformIntegration(ABC):
    """Classe de base pour les intégrations"""
    
    def __init__(self, credentials: PlatformCredentials):
        self.credentials = credentials
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, *args):
        if self.session:
            await self.session.close()
    
    @property
    @abstractmethod
    def platform(self) -> PlatformType:
        pass
    
    @abstractmethod
    async def get_profile(self) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    async def get_posts(self, limit: int = 20) -> List[SocialPost]:
        pass
    
    async def refresh_token(self) -> bool:
        """Rafraîchit le token d'accès si nécessaire"""
        return True


# ═══════════════════════════════════════════════════════════════════════════════
# YOUTUBE INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class YouTubeIntegration(PlatformIntegration):
    """
    Intégration YouTube Data API v3
    
    Fonctionnalités:
    - Récupérer les vidéos d'une chaîne
    - Stats de chaîne
    - Commentaires
    - Playlists
    """
    
    BASE_URL = "https://www.googleapis.com/youtube/v3"
    
    @property
    def platform(self) -> PlatformType:
        return PlatformType.YOUTUBE
    
    async def get_profile(self) -> Dict[str, Any]:
        """Récupère les infos de la chaîne"""
        url = f"{self.BASE_URL}/channels"
        params = {
            "part": "snippet,statistics,contentDetails",
            "mine": "true"
        }
        headers = {"Authorization": f"Bearer {self.credentials.access_token}"}
        
        async with self.session.get(url, params=params, headers=headers) as resp:
            data = await resp.json()
            
            if "items" not in data or not data["items"]:
                return {}
            
            channel = data["items"][0]
            return {
                "id": channel["id"],
                "title": channel["snippet"]["title"],
                "description": channel["snippet"]["description"],
                "thumbnail": channel["snippet"]["thumbnails"]["default"]["url"],
                "subscribers": int(channel["statistics"].get("subscriberCount", 0)),
                "videos": int(channel["statistics"].get("videoCount", 0)),
                "views": int(channel["statistics"].get("viewCount", 0))
            }
    
    async def get_posts(self, limit: int = 20) -> List[SocialPost]:
        """Pour YouTube, retourne les posts de la communauté (si dispo)"""
        # YouTube Community posts nécessitent un scraping ou API non officielle
        return []
    
    async def get_videos(self, limit: int = 20) -> List[SocialVideo]:
        """Récupère les vidéos de la chaîne"""
        # D'abord, récupérer l'upload playlist
        profile = await self.get_profile()
        if not profile:
            return []
        
        url = f"{self.BASE_URL}/search"
        params = {
            "part": "snippet",
            "channelId": profile["id"],
            "maxResults": limit,
            "order": "date",
            "type": "video"
        }
        headers = {"Authorization": f"Bearer {self.credentials.access_token}"}
        
        async with self.session.get(url, params=params, headers=headers) as resp:
            data = await resp.json()
            
            videos = []
            for item in data.get("items", []):
                videos.append(SocialVideo(
                    id=item["id"]["videoId"],
                    platform=PlatformType.YOUTUBE,
                    title=item["snippet"]["title"],
                    description=item["snippet"]["description"],
                    thumbnail_url=item["snippet"]["thumbnails"]["high"]["url"],
                    video_url=f"https://youtube.com/watch?v={item['id']['videoId']}",
                    channel_name=item["snippet"]["channelTitle"],
                    channel_id=item["snippet"]["channelId"],
                    published_at=datetime.fromisoformat(item["snippet"]["publishedAt"].replace("Z", "+00:00"))
                ))
            
            return videos
    
    async def get_video_stats(self, video_ids: List[str]) -> Dict[str, Dict]:
        """Récupère les stats détaillées des vidéos"""
        url = f"{self.BASE_URL}/videos"
        params = {
            "part": "statistics,contentDetails",
            "id": ",".join(video_ids)
        }
        headers = {"Authorization": f"Bearer {self.credentials.access_token}"}
        
        async with self.session.get(url, params=params, headers=headers) as resp:
            data = await resp.json()
            
            stats = {}
            for item in data.get("items", []):
                stats[item["id"]] = {
                    "views": int(item["statistics"].get("viewCount", 0)),
                    "likes": int(item["statistics"].get("likeCount", 0)),
                    "comments": int(item["statistics"].get("commentCount", 0)),
                    "duration": item["contentDetails"]["duration"]
                }
            
            return stats


# ═══════════════════════════════════════════════════════════════════════════════
# TWITCH INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class TwitchIntegration(PlatformIntegration):
    """
    Intégration Twitch Helix API
    
    Fonctionnalités:
    - Infos de chaîne
    - Streams en cours
    - VODs/Clips
    - Followers
    """
    
    BASE_URL = "https://api.twitch.tv/helix"
    
    @property
    def platform(self) -> PlatformType:
        return PlatformType.TWITCH
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.credentials.access_token}",
            "Client-Id": self.credentials.extra.get("client_id", "")
        }
    
    async def get_profile(self) -> Dict[str, Any]:
        """Récupère les infos de l'utilisateur"""
        url = f"{self.BASE_URL}/users"
        
        async with self.session.get(url, headers=self._get_headers()) as resp:
            data = await resp.json()
            
            if "data" not in data or not data["data"]:
                return {}
            
            user = data["data"][0]
            
            # Récupérer les followers
            followers = await self._get_follower_count(user["id"])
            
            return {
                "id": user["id"],
                "login": user["login"],
                "display_name": user["display_name"],
                "description": user.get("description", ""),
                "profile_image": user["profile_image_url"],
                "followers": followers,
                "view_count": user.get("view_count", 0)
            }
    
    async def _get_follower_count(self, user_id: str) -> int:
        """Récupère le nombre de followers"""
        url = f"{self.BASE_URL}/channels/followers"
        params = {"broadcaster_id": user_id}
        
        async with self.session.get(url, params=params, headers=self._get_headers()) as resp:
            data = await resp.json()
            return data.get("total", 0)
    
    async def get_posts(self, limit: int = 20) -> List[SocialPost]:
        """Twitch n'a pas de posts traditionnels"""
        return []
    
    async def get_videos(self, limit: int = 20) -> List[SocialVideo]:
        """Récupère les VODs"""
        profile = await self.get_profile()
        if not profile:
            return []
        
        url = f"{self.BASE_URL}/videos"
        params = {
            "user_id": profile["id"],
            "first": limit,
            "type": "archive"  # VODs
        }
        
        async with self.session.get(url, params=params, headers=self._get_headers()) as resp:
            data = await resp.json()
            
            videos = []
            for item in data.get("data", []):
                # Parser la durée (format: 1h2m3s)
                duration = self._parse_duration(item.get("duration", "0s"))
                
                videos.append(SocialVideo(
                    id=item["id"],
                    platform=PlatformType.TWITCH,
                    title=item["title"],
                    description=item.get("description", ""),
                    thumbnail_url=item["thumbnail_url"].replace("%{width}", "320").replace("%{height}", "180"),
                    video_url=item["url"],
                    duration_seconds=duration,
                    views=item.get("view_count", 0),
                    channel_name=item["user_name"],
                    channel_id=item["user_id"],
                    published_at=datetime.fromisoformat(item["created_at"].replace("Z", "+00:00"))
                ))
            
            return videos
    
    async def get_stream(self) -> Optional[Dict[str, Any]]:
        """Vérifie si la chaîne est en live"""
        profile = await self.get_profile()
        if not profile:
            return None
        
        url = f"{self.BASE_URL}/streams"
        params = {"user_id": profile["id"]}
        
        async with self.session.get(url, params=params, headers=self._get_headers()) as resp:
            data = await resp.json()
            
            if data.get("data"):
                stream = data["data"][0]
                return {
                    "id": stream["id"],
                    "title": stream["title"],
                    "game": stream["game_name"],
                    "viewers": stream["viewer_count"],
                    "started_at": stream["started_at"],
                    "thumbnail": stream["thumbnail_url"]
                }
            
            return None
    
    def _parse_duration(self, duration_str: str) -> int:
        """Parse la durée Twitch (1h2m3s) en secondes"""
        import re
        total = 0
        hours = re.search(r"(\d+)h", duration_str)
        mins = re.search(r"(\d+)m", duration_str)
        secs = re.search(r"(\d+)s", duration_str)
        
        if hours:
            total += int(hours.group(1)) * 3600
        if mins:
            total += int(mins.group(1)) * 60
        if secs:
            total += int(secs.group(1))
        
        return total


# ═══════════════════════════════════════════════════════════════════════════════
# TIKTOK INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class TikTokIntegration(PlatformIntegration):
    """
    Intégration TikTok for Developers API
    """
    
    BASE_URL = "https://open.tiktokapis.com/v2"
    
    @property
    def platform(self) -> PlatformType:
        return PlatformType.TIKTOK
    
    async def get_profile(self) -> Dict[str, Any]:
        """Récupère les infos utilisateur"""
        url = f"{self.BASE_URL}/user/info/"
        params = {"fields": "open_id,union_id,avatar_url,display_name,follower_count,following_count,likes_count,video_count"}
        headers = {"Authorization": f"Bearer {self.credentials.access_token}"}
        
        async with self.session.get(url, params=params, headers=headers) as resp:
            data = await resp.json()
            
            if data.get("error", {}).get("code") != "ok":
                return {}
            
            user = data.get("data", {}).get("user", {})
            return {
                "id": user.get("open_id"),
                "display_name": user.get("display_name"),
                "avatar": user.get("avatar_url"),
                "followers": user.get("follower_count", 0),
                "following": user.get("following_count", 0),
                "likes": user.get("likes_count", 0),
                "videos": user.get("video_count", 0)
            }
    
    async def get_posts(self, limit: int = 20) -> List[SocialPost]:
        """Récupère les vidéos comme posts"""
        videos = await self.get_videos(limit)
        return [
            SocialPost(
                id=v.id,
                platform=PlatformType.TIKTOK,
                content=v.title,
                author_name=v.channel_name,
                author_id=v.channel_id,
                media_urls=[v.video_url] if v.video_url else [],
                likes=v.likes,
                views=v.views,
                comments=v.comments,
                created_at=v.published_at,
                url=v.video_url
            )
            for v in videos
        ]
    
    async def get_videos(self, limit: int = 20) -> List[SocialVideo]:
        """Récupère les vidéos"""
        url = f"{self.BASE_URL}/video/list/"
        params = {
            "fields": "id,title,cover_image_url,share_url,duration,create_time,like_count,comment_count,share_count,view_count",
            "max_count": limit
        }
        headers = {"Authorization": f"Bearer {self.credentials.access_token}"}
        
        async with self.session.post(url, json=params, headers=headers) as resp:
            data = await resp.json()
            
            videos = []
            for item in data.get("data", {}).get("videos", []):
                videos.append(SocialVideo(
                    id=item["id"],
                    platform=PlatformType.TIKTOK,
                    title=item.get("title", ""),
                    description="",
                    thumbnail_url=item.get("cover_image_url"),
                    video_url=item.get("share_url"),
                    duration_seconds=item.get("duration", 0),
                    views=item.get("view_count", 0),
                    likes=item.get("like_count", 0),
                    comments=item.get("comment_count", 0),
                    published_at=datetime.fromtimestamp(item.get("create_time", 0))
                ))
            
            return videos


# ═══════════════════════════════════════════════════════════════════════════════
# LINKEDIN INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class LinkedInIntegration(PlatformIntegration):
    """Intégration LinkedIn API"""
    
    BASE_URL = "https://api.linkedin.com/v2"
    
    @property
    def platform(self) -> PlatformType:
        return PlatformType.LINKEDIN
    
    async def get_profile(self) -> Dict[str, Any]:
        url = f"{self.BASE_URL}/me"
        headers = {"Authorization": f"Bearer {self.credentials.access_token}"}
        
        async with self.session.get(url, headers=headers) as resp:
            data = await resp.json()
            return {
                "id": data.get("id"),
                "first_name": data.get("localizedFirstName"),
                "last_name": data.get("localizedLastName"),
                "headline": data.get("headline", "")
            }
    
    async def get_posts(self, limit: int = 20) -> List[SocialPost]:
        # LinkedIn API pour les posts est plus complexe
        return []


# ═══════════════════════════════════════════════════════════════════════════════
# TWITTER/X INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class TwitterIntegration(PlatformIntegration):
    """Intégration Twitter/X API v2"""
    
    BASE_URL = "https://api.twitter.com/2"
    
    @property
    def platform(self) -> PlatformType:
        return PlatformType.TWITTER
    
    async def get_profile(self) -> Dict[str, Any]:
        url = f"{self.BASE_URL}/users/me"
        params = {"user.fields": "public_metrics,profile_image_url,description"}
        headers = {"Authorization": f"Bearer {self.credentials.access_token}"}
        
        async with self.session.get(url, params=params, headers=headers) as resp:
            data = await resp.json()
            user = data.get("data", {})
            metrics = user.get("public_metrics", {})
            
            return {
                "id": user.get("id"),
                "username": user.get("username"),
                "name": user.get("name"),
                "description": user.get("description"),
                "avatar": user.get("profile_image_url"),
                "followers": metrics.get("followers_count", 0),
                "following": metrics.get("following_count", 0),
                "tweets": metrics.get("tweet_count", 0)
            }
    
    async def get_posts(self, limit: int = 20) -> List[SocialPost]:
        profile = await self.get_profile()
        if not profile:
            return []
        
        url = f"{self.BASE_URL}/users/{profile['id']}/tweets"
        params = {
            "max_results": limit,
            "tweet.fields": "created_at,public_metrics,attachments"
        }
        headers = {"Authorization": f"Bearer {self.credentials.access_token}"}
        
        async with self.session.get(url, params=params, headers=headers) as resp:
            data = await resp.json()
            
            posts = []
            for tweet in data.get("data", []):
                metrics = tweet.get("public_metrics", {})
                posts.append(SocialPost(
                    id=tweet["id"],
                    platform=PlatformType.TWITTER,
                    content=tweet["text"],
                    author_name=profile["name"],
                    author_id=profile["id"],
                    author_avatar=profile.get("avatar"),
                    likes=metrics.get("like_count", 0),
                    comments=metrics.get("reply_count", 0),
                    shares=metrics.get("retweet_count", 0),
                    views=metrics.get("impression_count", 0),
                    created_at=datetime.fromisoformat(tweet["created_at"].replace("Z", "+00:00")),
                    url=f"https://twitter.com/{profile['username']}/status/{tweet['id']}"
                ))
            
            return posts


# ═══════════════════════════════════════════════════════════════════════════════
# NOTION INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class NotionIntegration(PlatformIntegration):
    """Intégration Notion API"""
    
    BASE_URL = "https://api.notion.com/v1"
    
    @property
    def platform(self) -> PlatformType:
        return PlatformType.NOTION
    
    async def get_profile(self) -> Dict[str, Any]:
        url = f"{self.BASE_URL}/users/me"
        headers = {
            "Authorization": f"Bearer {self.credentials.access_token}",
            "Notion-Version": "2022-06-28"
        }
        
        async with self.session.get(url, headers=headers) as resp:
            data = await resp.json()
            return {
                "id": data.get("id"),
                "name": data.get("name"),
                "avatar": data.get("avatar_url"),
                "type": data.get("type")
            }
    
    async def get_posts(self, limit: int = 20) -> List[SocialPost]:
        """Notion n'a pas de posts traditionnels"""
        return []
    
    async def get_databases(self) -> List[Dict[str, Any]]:
        """Liste les bases de données accessibles"""
        url = f"{self.BASE_URL}/search"
        headers = {
            "Authorization": f"Bearer {self.credentials.access_token}",
            "Notion-Version": "2022-06-28"
        }
        data = {"filter": {"property": "object", "value": "database"}}
        
        async with self.session.post(url, json=data, headers=headers) as resp:
            result = await resp.json()
            return result.get("results", [])
    
    async def get_pages(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Liste les pages accessibles"""
        url = f"{self.BASE_URL}/search"
        headers = {
            "Authorization": f"Bearer {self.credentials.access_token}",
            "Notion-Version": "2022-06-28"
        }
        data = {
            "filter": {"property": "object", "value": "page"},
            "page_size": limit
        }
        
        async with self.session.post(url, json=data, headers=headers) as resp:
            result = await resp.json()
            return result.get("results", [])


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

def get_integration(credentials: PlatformCredentials) -> PlatformIntegration:
    """Factory pour créer l'intégration appropriée"""
    integrations = {
        PlatformType.YOUTUBE: YouTubeIntegration,
        PlatformType.TWITCH: TwitchIntegration,
        PlatformType.TIKTOK: TikTokIntegration,
        PlatformType.LINKEDIN: LinkedInIntegration,
        PlatformType.TWITTER: TwitterIntegration,
        PlatformType.NOTION: NotionIntegration,
    }
    
    integration_class = integrations.get(credentials.platform)
    if not integration_class:
        raise ValueError(f"Unsupported platform: {credentials.platform}")
    
    return integration_class(credentials)
