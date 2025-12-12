"""
CHE·NU Unified - Social Media Integrations
═══════════════════════════════════════════════════════════════════════════════
Clients pour Twitter/X, LinkedIn, TikTok, Instagram.

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import logging
import aiohttp

logger = logging.getLogger("CHE·NU.Integrations.Social")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class Platform(str, Enum):
    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    TIKTOK = "tiktok"
    INSTAGRAM = "instagram"
    FACEBOOK = "facebook"


class PostStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    FAILED = "failed"


class MediaType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"
    CAROUSEL = "carousel"
    TEXT = "text"
    LINK = "link"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class SocialProfile:
    """Profil social unifié."""
    id: str
    platform: Platform
    username: str
    
    name: Optional[str] = None
    bio: Optional[str] = None
    profile_url: Optional[str] = None
    avatar_url: Optional[str] = None
    
    # Stats
    followers_count: int = 0
    following_count: int = 0
    posts_count: int = 0
    
    # Verified
    verified: bool = False
    
    created_at: Optional[datetime] = None


@dataclass
class SocialPost:
    """Post social unifié."""
    id: str
    platform: Platform
    
    # Content
    text: Optional[str] = None
    media_urls: List[str] = field(default_factory=list)
    media_type: MediaType = MediaType.TEXT
    
    # Link
    link_url: Optional[str] = None
    
    # Status
    status: PostStatus = PostStatus.DRAFT
    
    # Engagement
    likes_count: int = 0
    comments_count: int = 0
    shares_count: int = 0
    views_count: int = 0
    
    # Timing
    created_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    scheduled_at: Optional[datetime] = None
    
    # Author
    author_id: Optional[str] = None
    author_username: Optional[str] = None
    
    # Platform specific
    platform_id: Optional[str] = None
    permalink: Optional[str] = None


@dataclass
class SocialAnalytics:
    """Analytics social."""
    platform: Platform
    profile_id: str
    
    # Period
    start_date: datetime
    end_date: datetime
    
    # Engagement
    total_impressions: int = 0
    total_reach: int = 0
    total_engagements: int = 0
    engagement_rate: float = 0.0
    
    # Growth
    followers_gained: int = 0
    followers_lost: int = 0
    net_followers: int = 0
    
    # Content
    posts_published: int = 0
    top_posts: List[SocialPost] = field(default_factory=list)
    
    # Demographics
    audience_demographics: Dict[str, Any] = field(default_factory=dict)


# ═══════════════════════════════════════════════════════════════════════════════
# TWITTER/X CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class TwitterClient:
    """
    🐦 Client Twitter/X API v2
    
    Fonctionnalités:
    - Tweets (create, delete, reply)
    - Timeline & search
    - User lookup
    - Direct messages
    - Analytics
    """
    
    BASE_URL = "https://api.twitter.com/2"
    
    def __init__(
        self,
        bearer_token: str,
        api_key: Optional[str] = None,
        api_secret: Optional[str] = None,
        access_token: Optional[str] = None,
        access_secret: Optional[str] = None
    ):
        self.bearer_token = bearer_token
        self.api_key = api_key
        self.api_secret = api_secret
        self.access_token = access_token
        self.access_secret = access_secret
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.bearer_token}",
            "Content-Type": "application/json"
        }
    
    # --- Tweets ---
    async def create_tweet(
        self,
        text: str,
        reply_to_id: Optional[str] = None,
        media_ids: Optional[List[str]] = None,
        poll_options: Optional[List[str]] = None
    ) -> SocialPost:
        """Crée un tweet."""
        payload = {"text": text}
        
        if reply_to_id:
            payload["reply"] = {"in_reply_to_tweet_id": reply_to_id}
        
        if media_ids:
            payload["media"] = {"media_ids": media_ids}
        
        if poll_options:
            payload["poll"] = {
                "options": poll_options,
                "duration_minutes": 1440  # 24 hours
            }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/tweets",
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                tweet_data = data.get("data", {})
                
                return SocialPost(
                    id=tweet_data.get("id", ""),
                    platform=Platform.TWITTER,
                    text=tweet_data.get("text"),
                    platform_id=tweet_data.get("id"),
                    status=PostStatus.PUBLISHED,
                    created_at=datetime.utcnow()
                )
    
    async def delete_tweet(self, tweet_id: str) -> bool:
        """Supprime un tweet."""
        async with aiohttp.ClientSession() as session:
            async with session.delete(
                f"{self.BASE_URL}/tweets/{tweet_id}",
                headers=self._get_headers()
            ) as resp:
                return resp.status == 200
    
    async def get_tweet(self, tweet_id: str) -> SocialPost:
        """Récupère un tweet."""
        params = {
            "expansions": "author_id,attachments.media_keys",
            "tweet.fields": "created_at,public_metrics,entities",
            "user.fields": "username"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/tweets/{tweet_id}",
                headers=self._get_headers(),
                params=params
            ) as resp:
                data = await resp.json()
                return self._parse_tweet(data.get("data", {}), data.get("includes", {}))
    
    async def search_tweets(
        self,
        query: str,
        max_results: int = 10
    ) -> List[SocialPost]:
        """Recherche de tweets."""
        params = {
            "query": query,
            "max_results": min(max_results, 100),
            "tweet.fields": "created_at,public_metrics,author_id",
            "expansions": "author_id"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/tweets/search/recent",
                headers=self._get_headers(),
                params=params
            ) as resp:
                data = await resp.json()
                includes = data.get("includes", {})
                return [
                    self._parse_tweet(t, includes)
                    for t in data.get("data", [])
                ]
    
    # --- Users ---
    async def get_user(self, username: str) -> SocialProfile:
        """Récupère un profil utilisateur."""
        params = {
            "user.fields": "created_at,description,public_metrics,profile_image_url,verified"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/users/by/username/{username}",
                headers=self._get_headers(),
                params=params
            ) as resp:
                data = await resp.json()
                return self._parse_user(data.get("data", {}))
    
    async def get_user_tweets(
        self,
        user_id: str,
        max_results: int = 10
    ) -> List[SocialPost]:
        """Récupère les tweets d'un utilisateur."""
        params = {
            "max_results": min(max_results, 100),
            "tweet.fields": "created_at,public_metrics"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/users/{user_id}/tweets",
                headers=self._get_headers(),
                params=params
            ) as resp:
                data = await resp.json()
                return [self._parse_tweet(t, {}) for t in data.get("data", [])]
    
    # --- Parse helpers ---
    def _parse_tweet(self, data: Dict, includes: Dict) -> SocialPost:
        metrics = data.get("public_metrics", {})
        
        # Find author
        author_username = None
        users = includes.get("users", [])
        for user in users:
            if user.get("id") == data.get("author_id"):
                author_username = user.get("username")
                break
        
        return SocialPost(
            id=data.get("id", ""),
            platform=Platform.TWITTER,
            text=data.get("text"),
            platform_id=data.get("id"),
            likes_count=metrics.get("like_count", 0),
            comments_count=metrics.get("reply_count", 0),
            shares_count=metrics.get("retweet_count", 0),
            views_count=metrics.get("impression_count", 0),
            author_id=data.get("author_id"),
            author_username=author_username,
            status=PostStatus.PUBLISHED,
            created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")) if data.get("created_at") else None
        )
    
    def _parse_user(self, data: Dict) -> SocialProfile:
        metrics = data.get("public_metrics", {})
        
        return SocialProfile(
            id=data.get("id", ""),
            platform=Platform.TWITTER,
            username=data.get("username", ""),
            name=data.get("name"),
            bio=data.get("description"),
            avatar_url=data.get("profile_image_url"),
            followers_count=metrics.get("followers_count", 0),
            following_count=metrics.get("following_count", 0),
            posts_count=metrics.get("tweet_count", 0),
            verified=data.get("verified", False),
            created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")) if data.get("created_at") else None
        )


# ═══════════════════════════════════════════════════════════════════════════════
# LINKEDIN CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class LinkedInClient:
    """
    💼 Client LinkedIn API
    
    Fonctionnalités:
    - Posts (text, image, article)
    - Profile
    - Company pages
    - Analytics
    """
    
    BASE_URL = "https://api.linkedin.com/v2"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0"
        }
    
    # --- Profile ---
    async def get_profile(self) -> SocialProfile:
        """Récupère le profil de l'utilisateur connecté."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/me",
                headers=self._get_headers(),
                params={"projection": "(id,firstName,lastName,profilePicture)"}
            ) as resp:
                data = await resp.json()
                
                first_name = data.get("firstName", {}).get("localized", {}).get("en_US", "")
                last_name = data.get("lastName", {}).get("localized", {}).get("en_US", "")
                
                return SocialProfile(
                    id=data.get("id", ""),
                    platform=Platform.LINKEDIN,
                    username=data.get("id", ""),
                    name=f"{first_name} {last_name}".strip()
                )
    
    # --- Posts ---
    async def create_post(
        self,
        text: str,
        author_urn: str,
        visibility: str = "PUBLIC"
    ) -> SocialPost:
        """Crée un post LinkedIn."""
        payload = {
            "author": author_urn,
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": text
                    },
                    "shareMediaCategory": "NONE"
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": visibility
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/ugcPosts",
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                
                return SocialPost(
                    id=data.get("id", ""),
                    platform=Platform.LINKEDIN,
                    text=text,
                    platform_id=data.get("id"),
                    status=PostStatus.PUBLISHED,
                    created_at=datetime.utcnow()
                )
    
    async def create_article_post(
        self,
        text: str,
        article_url: str,
        article_title: str,
        author_urn: str
    ) -> SocialPost:
        """Crée un post avec article."""
        payload = {
            "author": author_urn,
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": text
                    },
                    "shareMediaCategory": "ARTICLE",
                    "media": [{
                        "status": "READY",
                        "originalUrl": article_url,
                        "title": {"text": article_title}
                    }]
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/ugcPosts",
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                
                return SocialPost(
                    id=data.get("id", ""),
                    platform=Platform.LINKEDIN,
                    text=text,
                    link_url=article_url,
                    media_type=MediaType.LINK,
                    platform_id=data.get("id"),
                    status=PostStatus.PUBLISHED,
                    created_at=datetime.utcnow()
                )
    
    async def delete_post(self, post_urn: str) -> bool:
        """Supprime un post."""
        async with aiohttp.ClientSession() as session:
            async with session.delete(
                f"{self.BASE_URL}/ugcPosts/{post_urn}",
                headers=self._get_headers()
            ) as resp:
                return resp.status == 204
    
    # --- Company ---
    async def get_company(self, company_id: str) -> Dict[str, Any]:
        """Récupère les infos d'une company page."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/organizations/{company_id}",
                headers=self._get_headers()
            ) as resp:
                return await resp.json()
    
    async def get_company_followers(self, company_id: str) -> int:
        """Récupère le nombre de followers d'une company."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/organizationalEntityFollowerStatistics",
                headers=self._get_headers(),
                params={"q": "organizationalEntity", "organizationalEntity": f"urn:li:organization:{company_id}"}
            ) as resp:
                data = await resp.json()
                elements = data.get("elements", [])
                if elements:
                    return elements[0].get("followerCounts", {}).get("organicFollowerCount", 0)
                return 0


# ═══════════════════════════════════════════════════════════════════════════════
# TIKTOK CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class TikTokClient:
    """
    🎵 Client TikTok API
    
    Fonctionnalités:
    - Video info
    - User info
    - Analytics (business accounts)
    """
    
    BASE_URL = "https://open.tiktokapis.com/v2"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
    
    async def get_user_info(self) -> SocialProfile:
        """Récupère les infos de l'utilisateur."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/user/info/",
                headers=self._get_headers(),
                params={"fields": "open_id,union_id,avatar_url,display_name,bio_description,follower_count,following_count,video_count"}
            ) as resp:
                data = await resp.json()
                user = data.get("data", {}).get("user", {})
                
                return SocialProfile(
                    id=user.get("open_id", ""),
                    platform=Platform.TIKTOK,
                    username=user.get("display_name", ""),
                    name=user.get("display_name"),
                    bio=user.get("bio_description"),
                    avatar_url=user.get("avatar_url"),
                    followers_count=user.get("follower_count", 0),
                    following_count=user.get("following_count", 0),
                    posts_count=user.get("video_count", 0)
                )
    
    async def list_videos(
        self,
        max_count: int = 20
    ) -> List[SocialPost]:
        """Liste les vidéos de l'utilisateur."""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/video/list/",
                headers=self._get_headers(),
                json={
                    "max_count": max_count,
                    "fields": "id,title,create_time,cover_image_url,share_url,like_count,comment_count,share_count,view_count"
                }
            ) as resp:
                data = await resp.json()
                videos = data.get("data", {}).get("videos", [])
                
                return [self._parse_video(v) for v in videos]
    
    async def get_video(self, video_id: str) -> SocialPost:
        """Récupère une vidéo."""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/video/query/",
                headers=self._get_headers(),
                json={
                    "filters": {"video_ids": [video_id]},
                    "fields": "id,title,create_time,cover_image_url,share_url,like_count,comment_count,share_count,view_count"
                }
            ) as resp:
                data = await resp.json()
                videos = data.get("data", {}).get("videos", [])
                
                if videos:
                    return self._parse_video(videos[0])
                return SocialPost(id="", platform=Platform.TIKTOK)
    
    def _parse_video(self, data: Dict) -> SocialPost:
        return SocialPost(
            id=data.get("id", ""),
            platform=Platform.TIKTOK,
            text=data.get("title"),
            media_urls=[data.get("cover_image_url", "")],
            media_type=MediaType.VIDEO,
            permalink=data.get("share_url"),
            platform_id=data.get("id"),
            likes_count=data.get("like_count", 0),
            comments_count=data.get("comment_count", 0),
            shares_count=data.get("share_count", 0),
            views_count=data.get("view_count", 0),
            status=PostStatus.PUBLISHED,
            created_at=datetime.fromtimestamp(data["create_time"]) if data.get("create_time") else None
        )


# ═══════════════════════════════════════════════════════════════════════════════
# SOCIAL MEDIA SERVICE UNIFIÉ
# ═══════════════════════════════════════════════════════════════════════════════

class SocialMediaService:
    """
    🎯 Service Social Media Unifié
    
    Gère tous les comptes social media avec une interface commune.
    """
    
    def __init__(self):
        self._twitter_clients: Dict[str, TwitterClient] = {}
        self._linkedin_clients: Dict[str, LinkedInClient] = {}
        self._tiktok_clients: Dict[str, TikTokClient] = {}
    
    # --- Registration ---
    def register_twitter(
        self,
        account_id: str,
        bearer_token: str,
        **kwargs
    ) -> None:
        self._twitter_clients[account_id] = TwitterClient(bearer_token, **kwargs)
        logger.info(f"✅ Twitter registered: {account_id}")
    
    def register_linkedin(
        self,
        account_id: str,
        access_token: str
    ) -> None:
        self._linkedin_clients[account_id] = LinkedInClient(access_token)
        logger.info(f"✅ LinkedIn registered: {account_id}")
    
    def register_tiktok(
        self,
        account_id: str,
        access_token: str
    ) -> None:
        self._tiktok_clients[account_id] = TikTokClient(access_token)
        logger.info(f"✅ TikTok registered: {account_id}")
    
    # --- Unified Methods ---
    async def post_to_all(
        self,
        text: str,
        platforms: Optional[List[str]] = None
    ) -> Dict[str, SocialPost]:
        """Publie sur toutes les plateformes configurées."""
        results = {}
        
        # Twitter
        for account_id, client in self._twitter_clients.items():
            if platforms and "twitter" not in platforms:
                continue
            try:
                post = await client.create_tweet(text)
                results[f"twitter:{account_id}"] = post
            except Exception as e:
                logger.error(f"Twitter post failed: {e}")
        
        return results
    
    async def get_all_profiles(self) -> Dict[str, SocialProfile]:
        """Récupère tous les profils."""
        profiles = {}
        
        for account_id, client in self._linkedin_clients.items():
            try:
                profile = await client.get_profile()
                profiles[f"linkedin:{account_id}"] = profile
            except Exception as e:
                logger.error(f"LinkedIn profile error: {e}")
        
        for account_id, client in self._tiktok_clients.items():
            try:
                profile = await client.get_user_info()
                profiles[f"tiktok:{account_id}"] = profile
            except Exception as e:
                logger.error(f"TikTok profile error: {e}")
        
        return profiles
    
    async def get_social_dashboard(self) -> Dict[str, Any]:
        """Dashboard social media unifié."""
        profiles = await self.get_all_profiles()
        
        total_followers = sum(p.followers_count for p in profiles.values())
        by_platform = {}
        
        for key, profile in profiles.items():
            platform = key.split(":")[0]
            if platform not in by_platform:
                by_platform[platform] = {
                    "accounts": 0,
                    "followers": 0,
                    "posts": 0
                }
            by_platform[platform]["accounts"] += 1
            by_platform[platform]["followers"] += profile.followers_count
            by_platform[platform]["posts"] += profile.posts_count
        
        return {
            "total_accounts": len(profiles),
            "total_followers": total_followers,
            "by_platform": by_platform,
            "profiles": {k: {"name": v.name, "followers": v.followers_count} for k, v in profiles.items()}
        }


def create_social_service() -> SocialMediaService:
    """Factory pour créer le service Social Media."""
    return SocialMediaService()


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    "Platform",
    "PostStatus",
    "MediaType",
    
    # Data Classes
    "SocialProfile",
    "SocialPost",
    "SocialAnalytics",
    
    # Clients
    "TwitterClient",
    "LinkedInClient",
    "TikTokClient",
    
    # Service
    "SocialMediaService",
    "create_social_service"
]
