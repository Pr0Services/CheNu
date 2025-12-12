"""
╔══════════════════════════════════════════════════════════════════════════════╗
║              CHE·NU V25 - SOCIAL PLATFORM INTEGRATIONS                       ║
║              Unified API for Multi-Platform Data Extraction                  ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional
from enum import Enum
import asyncio
import aiohttp

class PlatformType(Enum):
    YOUTUBE = "youtube"
    TWITCH = "twitch"
    TIKTOK = "tiktok"
    FACEBOOK = "facebook"
    INSTAGRAM = "instagram"
    LINKEDIN = "linkedin"
    TWITTER = "twitter"

@dataclass
class SocialProfile:
    platform: PlatformType
    user_id: str
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    followers_count: int = 0
    verified: bool = False

@dataclass
class SocialPost:
    platform: PlatformType
    post_id: str
    content: str
    author: SocialProfile
    created_at: datetime
    likes: int = 0
    comments: int = 0
    shares: int = 0
    media_urls: List[str] = field(default_factory=list)

@dataclass 
class VideoContent:
    platform: PlatformType
    video_id: str
    title: str
    description: str
    thumbnail_url: str
    duration: int
    views: int
    likes: int
    channel: SocialProfile
    published_at: datetime
    is_live: bool = False

# ═══════════════════════════════════════════════════════════════════════════════
# YOUTUBE INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class YouTubeAPI:
    """YouTube Data API v3 Integration"""
    BASE_URL = "https://www.googleapis.com/youtube/v3"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def get_channel(self, channel_id: str) -> SocialProfile:
        params = {"part": "snippet,statistics", "id": channel_id, "key": self.api_key}
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/channels", params=params) as resp:
                data = await resp.json()
                item = data["items"][0]
                return SocialProfile(
                    platform=PlatformType.YOUTUBE,
                    user_id=channel_id,
                    username=item["snippet"]["customUrl"],
                    display_name=item["snippet"]["title"],
                    avatar_url=item["snippet"]["thumbnails"]["default"]["url"],
                    followers_count=int(item["statistics"]["subscriberCount"]),
                    verified=False
                )
    
    async def get_videos(self, channel_id: str, max_results: int = 10) -> List[VideoContent]:
        params = {"part": "snippet", "channelId": channel_id, "maxResults": max_results, 
                  "order": "date", "type": "video", "key": self.api_key}
        videos = []
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/search", params=params) as resp:
                data = await resp.json()
                for item in data.get("items", []):
                    videos.append(VideoContent(
                        platform=PlatformType.YOUTUBE,
                        video_id=item["id"]["videoId"],
                        title=item["snippet"]["title"],
                        description=item["snippet"]["description"],
                        thumbnail_url=item["snippet"]["thumbnails"]["high"]["url"],
                        duration=0, views=0, likes=0,
                        channel=SocialProfile(PlatformType.YOUTUBE, channel_id, "", item["snippet"]["channelTitle"]),
                        published_at=datetime.fromisoformat(item["snippet"]["publishedAt"].replace("Z", "+00:00")),
                        is_live=item["snippet"]["liveBroadcastContent"] == "live"
                    ))
        return videos

    async def get_live_streams(self, channel_id: str) -> List[VideoContent]:
        params = {"part": "snippet", "channelId": channel_id, "eventType": "live", 
                  "type": "video", "key": self.api_key}
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/search", params=params) as resp:
                data = await resp.json()
                return [VideoContent(
                    platform=PlatformType.YOUTUBE, video_id=item["id"]["videoId"],
                    title=item["snippet"]["title"], description=item["snippet"]["description"],
                    thumbnail_url=item["snippet"]["thumbnails"]["high"]["url"],
                    duration=0, views=0, likes=0, is_live=True,
                    channel=SocialProfile(PlatformType.YOUTUBE, channel_id, "", item["snippet"]["channelTitle"]),
                    published_at=datetime.now()
                ) for item in data.get("items", [])]

# ═══════════════════════════════════════════════════════════════════════════════
# TWITCH INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class TwitchAPI:
    """Twitch Helix API Integration"""
    BASE_URL = "https://api.twitch.tv/helix"
    
    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.access_token: Optional[str] = None
    
    async def authenticate(self):
        async with aiohttp.ClientSession() as session:
            async with session.post("https://id.twitch.tv/oauth2/token", data={
                "client_id": self.client_id, "client_secret": self.client_secret,
                "grant_type": "client_credentials"
            }) as resp:
                data = await resp.json()
                self.access_token = data["access_token"]
    
    def _headers(self) -> Dict[str, str]:
        return {"Client-ID": self.client_id, "Authorization": f"Bearer {self.access_token}"}
    
    async def get_user(self, username: str) -> SocialProfile:
        if not self.access_token: await self.authenticate()
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/users", params={"login": username}, headers=self._headers()) as resp:
                data = await resp.json()
                user = data["data"][0]
                return SocialProfile(
                    platform=PlatformType.TWITCH, user_id=user["id"], username=user["login"],
                    display_name=user["display_name"], avatar_url=user["profile_image_url"],
                    followers_count=0, verified=user["broadcaster_type"] == "partner"
                )
    
    async def get_streams(self, user_ids: List[str] = None, game_id: str = None) -> List[VideoContent]:
        if not self.access_token: await self.authenticate()
        params = {}
        if user_ids: params["user_id"] = user_ids
        if game_id: params["game_id"] = game_id
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/streams", params=params, headers=self._headers()) as resp:
                data = await resp.json()
                return [VideoContent(
                    platform=PlatformType.TWITCH, video_id=s["id"], title=s["title"],
                    description="", thumbnail_url=s["thumbnail_url"].replace("{width}", "320").replace("{height}", "180"),
                    duration=0, views=s["viewer_count"], likes=0, is_live=True,
                    channel=SocialProfile(PlatformType.TWITCH, s["user_id"], s["user_login"], s["user_name"]),
                    published_at=datetime.fromisoformat(s["started_at"].replace("Z", "+00:00"))
                ) for s in data.get("data", [])]

# ═══════════════════════════════════════════════════════════════════════════════
# FACEBOOK/META INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class FacebookAPI:
    """Meta Graph API Integration"""
    BASE_URL = "https://graph.facebook.com/v18.0"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
    
    async def get_page(self, page_id: str) -> SocialProfile:
        fields = "id,name,username,picture,fan_count,verification_status"
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/{page_id}", params={"fields": fields, "access_token": self.access_token}) as resp:
                data = await resp.json()
                return SocialProfile(
                    platform=PlatformType.FACEBOOK, user_id=data["id"],
                    username=data.get("username", ""), display_name=data["name"],
                    avatar_url=data.get("picture", {}).get("data", {}).get("url"),
                    followers_count=data.get("fan_count", 0),
                    verified=data.get("verification_status") == "blue_verified"
                )
    
    async def get_posts(self, page_id: str, limit: int = 10) -> List[SocialPost]:
        fields = "id,message,created_time,likes.summary(true),comments.summary(true),shares"
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/{page_id}/posts", 
                params={"fields": fields, "limit": limit, "access_token": self.access_token}) as resp:
                data = await resp.json()
                return [SocialPost(
                    platform=PlatformType.FACEBOOK, post_id=p["id"],
                    content=p.get("message", ""), author=SocialProfile(PlatformType.FACEBOOK, page_id, "", ""),
                    created_at=datetime.fromisoformat(p["created_time"].replace("+0000", "+00:00")),
                    likes=p.get("likes", {}).get("summary", {}).get("total_count", 0),
                    comments=p.get("comments", {}).get("summary", {}).get("total_count", 0),
                    shares=p.get("shares", {}).get("count", 0)
                ) for p in data.get("data", [])]

# ═══════════════════════════════════════════════════════════════════════════════
# INSTAGRAM INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class InstagramAPI:
    """Instagram Graph API Integration"""
    BASE_URL = "https://graph.instagram.com/v18.0"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
    
    async def get_profile(self, user_id: str = "me") -> SocialProfile:
        fields = "id,username,name,profile_picture_url,followers_count,media_count"
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/{user_id}", 
                params={"fields": fields, "access_token": self.access_token}) as resp:
                data = await resp.json()
                return SocialProfile(
                    platform=PlatformType.INSTAGRAM, user_id=data["id"],
                    username=data["username"], display_name=data.get("name", data["username"]),
                    avatar_url=data.get("profile_picture_url"),
                    followers_count=data.get("followers_count", 0)
                )
    
    async def get_media(self, user_id: str = "me", limit: int = 10) -> List[SocialPost]:
        fields = "id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count"
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/{user_id}/media",
                params={"fields": fields, "limit": limit, "access_token": self.access_token}) as resp:
                data = await resp.json()
                return [SocialPost(
                    platform=PlatformType.INSTAGRAM, post_id=m["id"],
                    content=m.get("caption", ""), author=SocialProfile(PlatformType.INSTAGRAM, user_id, "", ""),
                    created_at=datetime.fromisoformat(m["timestamp"].replace("+0000", "+00:00")),
                    likes=m.get("like_count", 0), comments=m.get("comments_count", 0),
                    media_urls=[m.get("media_url") or m.get("thumbnail_url")]
                ) for m in data.get("data", [])]

# ═══════════════════════════════════════════════════════════════════════════════
# LINKEDIN INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class LinkedInAPI:
    """LinkedIn API Integration"""
    BASE_URL = "https://api.linkedin.com/v2"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
    
    def _headers(self) -> Dict[str, str]:
        return {"Authorization": f"Bearer {self.access_token}", "X-Restli-Protocol-Version": "2.0.0"}
    
    async def get_profile(self) -> SocialProfile:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/me", headers=self._headers()) as resp:
                data = await resp.json()
                return SocialProfile(
                    platform=PlatformType.LINKEDIN,
                    user_id=data["id"],
                    username=data["id"],
                    display_name=f"{data['localizedFirstName']} {data['localizedLastName']}"
                )

# ═══════════════════════════════════════════════════════════════════════════════
# TWITTER/X INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class TwitterAPI:
    """Twitter/X API v2 Integration"""
    BASE_URL = "https://api.twitter.com/2"
    
    def __init__(self, bearer_token: str):
        self.bearer_token = bearer_token
    
    def _headers(self) -> Dict[str, str]:
        return {"Authorization": f"Bearer {self.bearer_token}"}
    
    async def get_user(self, username: str) -> SocialProfile:
        params = {"user.fields": "id,name,username,profile_image_url,public_metrics,verified"}
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/users/by/username/{username}", 
                params=params, headers=self._headers()) as resp:
                data = await resp.json()
                user = data["data"]
                return SocialProfile(
                    platform=PlatformType.TWITTER, user_id=user["id"],
                    username=user["username"], display_name=user["name"],
                    avatar_url=user.get("profile_image_url"),
                    followers_count=user.get("public_metrics", {}).get("followers_count", 0),
                    verified=user.get("verified", False)
                )
    
    async def get_tweets(self, user_id: str, max_results: int = 10) -> List[SocialPost]:
        params = {"max_results": max_results, "tweet.fields": "created_at,public_metrics"}
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/users/{user_id}/tweets",
                params=params, headers=self._headers()) as resp:
                data = await resp.json()
                return [SocialPost(
                    platform=PlatformType.TWITTER, post_id=t["id"], content=t["text"],
                    author=SocialProfile(PlatformType.TWITTER, user_id, "", ""),
                    created_at=datetime.fromisoformat(t["created_at"].replace("Z", "+00:00")),
                    likes=t.get("public_metrics", {}).get("like_count", 0),
                    comments=t.get("public_metrics", {}).get("reply_count", 0),
                    shares=t.get("public_metrics", {}).get("retweet_count", 0)
                ) for t in data.get("data", [])]

# ═══════════════════════════════════════════════════════════════════════════════
# UNIFIED AGGREGATOR
# ═══════════════════════════════════════════════════════════════════════════════

class SocialAggregator:
    """Unified aggregator for all social platforms"""
    
    def __init__(self):
        self.platforms: Dict[PlatformType, Any] = {}
    
    def register(self, platform: PlatformType, api: Any):
        self.platforms[platform] = api
    
    async def get_all_profiles(self) -> List[SocialProfile]:
        profiles = []
        for platform, api in self.platforms.items():
            try:
                if hasattr(api, 'get_profile'):
                    profiles.append(await api.get_profile())
            except Exception as e:
                print(f"Error fetching {platform}: {e}")
        return profiles
    
    async def get_unified_feed(self, limit_per_platform: int = 5) -> List[SocialPost]:
        all_posts = []
        tasks = []
        for platform, api in self.platforms.items():
            if hasattr(api, 'get_posts'):
                tasks.append(api.get_posts(limit=limit_per_platform))
            elif hasattr(api, 'get_media'):
                tasks.append(api.get_media(limit=limit_per_platform))
            elif hasattr(api, 'get_tweets'):
                tasks.append(api.get_tweets(max_results=limit_per_platform))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        for result in results:
            if isinstance(result, list):
                all_posts.extend(result)
        
        return sorted(all_posts, key=lambda p: p.created_at, reverse=True)
    
    async def get_all_videos(self, limit_per_platform: int = 5) -> List[VideoContent]:
        all_videos = []
        for platform, api in self.platforms.items():
            if hasattr(api, 'get_videos'):
                try:
                    videos = await api.get_videos(limit=limit_per_platform)
                    all_videos.extend(videos)
                except: pass
            if hasattr(api, 'get_streams'):
                try:
                    streams = await api.get_streams()
                    all_videos.extend(streams)
                except: pass
        return all_videos

# ═══════════════════════════════════════════════════════════════════════════════
# FASTAPI ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="CHE·NU Social Integrations API")

@app.get("/api/social/profiles")
async def get_profiles():
    aggregator = SocialAggregator()
    # Register APIs with tokens from config
    return await aggregator.get_all_profiles()

@app.get("/api/social/feed")
async def get_feed(limit: int = 20):
    aggregator = SocialAggregator()
    return await aggregator.get_unified_feed(limit_per_platform=limit // 4)

@app.get("/api/social/videos")
async def get_videos(limit: int = 20):
    aggregator = SocialAggregator()
    return await aggregator.get_all_videos(limit_per_platform=limit // 2)

@app.get("/api/youtube/channel/{channel_id}")
async def get_youtube_channel(channel_id: str):
    api = YouTubeAPI(api_key="YOUR_API_KEY")
    return await api.get_channel(channel_id)

@app.get("/api/twitch/streams")
async def get_twitch_streams(game_id: str = None):
    api = TwitchAPI(client_id="YOUR_CLIENT_ID", client_secret="YOUR_SECRET")
    return await api.get_streams(game_id=game_id)
"""
