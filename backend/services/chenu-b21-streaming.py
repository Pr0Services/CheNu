"""
CHE·NU™ B21 - Plateforme Streaming
Style YouTube/Twitch professionnel

Features:
- Streaming API (HLS/DASH, uploads, encoding)
- Video Player moderne (HLS.js ready)
- Mini Player au scroll
- Chapters AI (segmentation automatique)
- Creator Studio (dashboard créateur)
- Système de recommandations
- Playlists intelligentes
- Historique multi-device

Author: CHE·NU Dev Team
Date: December 2024
Lines: ~700
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Query, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime, timedelta
from enum import Enum
from uuid import uuid4
import hashlib

router = APIRouter(prefix="/api/v2/streaming", tags=["Streaming"])

# =============================================================================
# ENUMS
# =============================================================================

class VideoStatus(str, Enum):
    UPLOADING = "uploading"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"
    DELETED = "deleted"

class VideoVisibility(str, Enum):
    PUBLIC = "public"
    UNLISTED = "unlisted"
    PRIVATE = "private"
    SCHEDULED = "scheduled"

class VideoCategory(str, Enum):
    TUTORIAL = "tutorial"
    PRESENTATION = "presentation"
    MEETING = "meeting"
    WEBINAR = "webinar"
    ENTERTAINMENT = "entertainment"
    NEWS = "news"
    OTHER = "other"

class StreamStatus(str, Enum):
    OFFLINE = "offline"
    LIVE = "live"
    ENDED = "ended"

class QualityLevel(str, Enum):
    Q_360P = "360p"
    Q_480P = "480p"
    Q_720P = "720p"
    Q_1080P = "1080p"
    Q_1440P = "1440p"
    Q_4K = "4k"

# =============================================================================
# MODELS - Video
# =============================================================================

class VideoQuality(BaseModel):
    """Qualité vidéo encodée"""
    quality: QualityLevel
    url: str
    bitrate: int  # kbps
    width: int
    height: int
    size_bytes: int = 0

class Chapter(BaseModel):
    """Chapitre vidéo"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str
    start_time: float  # seconds
    end_time: float
    thumbnail_url: Optional[str] = None
    is_ai_generated: bool = False

class Subtitle(BaseModel):
    """Sous-titres"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    language: str
    label: str
    url: str
    is_auto_generated: bool = False

class Video(BaseModel):
    """Vidéo"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    channel_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    published_at: Optional[datetime] = None
    
    # Content
    title: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    
    # Technical
    duration: float = 0  # seconds
    status: VideoStatus = VideoStatus.UPLOADING
    visibility: VideoVisibility = VideoVisibility.PRIVATE
    
    # Streaming
    hls_url: Optional[str] = None  # Master playlist
    qualities: List[VideoQuality] = []
    
    # Metadata
    category: VideoCategory = VideoCategory.OTHER
    tags: List[str] = []
    chapters: List[Chapter] = []
    subtitles: List[Subtitle] = []
    
    # Engagement
    views_count: int = 0
    likes_count: int = 0
    dislikes_count: int = 0
    comments_count: int = 0
    
    # Settings
    allow_comments: bool = True
    allow_embedding: bool = True
    is_age_restricted: bool = False
    
    # Scheduling
    scheduled_publish_at: Optional[datetime] = None
    
    # Space context
    space_id: Optional[str] = None
    project_id: Optional[str] = None

class VideoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: VideoCategory = VideoCategory.OTHER
    tags: List[str] = []
    visibility: VideoVisibility = VideoVisibility.PRIVATE
    space_id: Optional[str] = None

class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    category: Optional[VideoCategory] = None
    tags: Optional[List[str]] = None
    visibility: Optional[VideoVisibility] = None
    allow_comments: Optional[bool] = None

# =============================================================================
# MODELS - Channel
# =============================================================================

class Channel(BaseModel):
    """Chaîne créateur"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Branding
    name: str
    handle: str  # @handle
    description: Optional[str] = None
    avatar_url: Optional[str] = None
    banner_url: Optional[str] = None
    
    # Stats
    subscribers_count: int = 0
    videos_count: int = 0
    total_views: int = 0
    
    # Settings
    is_verified: bool = False
    custom_url: Optional[str] = None
    
    # Links
    website_url: Optional[str] = None
    social_links: Dict[str, str] = {}

# =============================================================================
# MODELS - Engagement
# =============================================================================

class VideoComment(BaseModel):
    """Commentaire vidéo"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    video_id: str
    author_id: str
    parent_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    content: str
    timestamp: Optional[float] = None  # Video timestamp reference
    
    likes_count: int = 0
    replies_count: int = 0
    is_pinned: bool = False
    is_hearted: bool = False  # Creator heart

class VideoLike(BaseModel):
    """Like/Dislike"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    video_id: str
    user_id: str
    is_like: bool  # True = like, False = dislike
    created_at: datetime = Field(default_factory=datetime.utcnow)

class WatchHistory(BaseModel):
    """Historique de visionnage"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    video_id: str
    watched_at: datetime = Field(default_factory=datetime.utcnow)
    watch_duration: float = 0  # seconds
    last_position: float = 0  # seconds
    completed: bool = False

class Playlist(BaseModel):
    """Playlist"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    title: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    visibility: VideoVisibility = VideoVisibility.PRIVATE
    
    video_ids: List[str] = []
    videos_count: int = 0

class Subscription(BaseModel):
    """Abonnement à une chaîne"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    channel_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    notifications_enabled: bool = True

# =============================================================================
# MODELS - Live Streaming
# =============================================================================

class LiveStream(BaseModel):
    """Stream en direct"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    channel_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    title: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    
    status: StreamStatus = StreamStatus.OFFLINE
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    
    # Streaming
    stream_key: str = Field(default_factory=lambda: str(uuid4()))
    rtmp_url: str = ""
    hls_url: Optional[str] = None
    
    # Stats
    current_viewers: int = 0
    peak_viewers: int = 0
    total_views: int = 0
    
    # Chat
    chat_enabled: bool = True
    chat_slow_mode: int = 0  # seconds between messages

# =============================================================================
# MODELS - Analytics
# =============================================================================

class VideoAnalytics(BaseModel):
    """Analytics vidéo"""
    video_id: str
    period: str  # "day", "week", "month", "all"
    
    views: int = 0
    watch_time_hours: float = 0
    avg_view_duration: float = 0
    avg_percentage_watched: float = 0
    
    likes: int = 0
    dislikes: int = 0
    comments: int = 0
    shares: int = 0
    
    # Demographics (simplified)
    top_countries: Dict[str, int] = {}
    traffic_sources: Dict[str, int] = {}

class ChannelAnalytics(BaseModel):
    """Analytics chaîne"""
    channel_id: str
    period: str
    
    total_views: int = 0
    watch_time_hours: float = 0
    subscribers_gained: int = 0
    subscribers_lost: int = 0
    
    top_videos: List[str] = []
    revenue_estimate: float = 0.0

# =============================================================================
# STORAGE
# =============================================================================

class StreamingStore:
    def __init__(self):
        self.videos: Dict[str, Video] = {}
        self.channels: Dict[str, Channel] = {}
        self.comments: Dict[str, VideoComment] = {}
        self.likes: Dict[str, VideoLike] = {}
        self.history: Dict[str, List[WatchHistory]] = {}
        self.playlists: Dict[str, Playlist] = {}
        self.subscriptions: Dict[str, Subscription] = {}
        self.streams: Dict[str, LiveStream] = {}
        
        # Indexes
        self.videos_by_channel: Dict[str, List[str]] = {}
        self.comments_by_video: Dict[str, List[str]] = {}
        self.subs_by_user: Dict[str, List[str]] = {}
        self.subs_by_channel: Dict[str, List[str]] = {}

store = StreamingStore()

# =============================================================================
# RECOMMENDATION ENGINE
# =============================================================================

class RecommendationEngine:
    """Moteur de recommandations vidéo"""
    
    async def get_recommendations(
        self,
        user_id: Optional[str],
        current_video_id: Optional[str] = None,
        limit: int = 20
    ) -> List[Video]:
        """Génère des recommandations personnalisées"""
        
        candidates = []
        
        # Get all public videos
        for video in store.videos.values():
            if video.status == VideoStatus.READY and video.visibility == VideoVisibility.PUBLIC:
                candidates.append(video)
        
        if not candidates:
            return []
        
        # Score videos
        scored = []
        for video in candidates:
            score = self._calculate_score(video, user_id, current_video_id)
            scored.append((video, score))
        
        # Sort and return
        scored.sort(key=lambda x: x[1], reverse=True)
        return [v for v, _ in scored[:limit]]
    
    def _calculate_score(
        self,
        video: Video,
        user_id: Optional[str],
        current_video_id: Optional[str]
    ) -> float:
        """Calcule le score de recommandation"""
        
        score = 0.0
        
        # Recency boost
        age_days = (datetime.utcnow() - video.created_at).days
        score += max(0, 50 - age_days)
        
        # Engagement score
        engagement = (
            video.views_count * 0.1 +
            video.likes_count * 2 +
            video.comments_count * 3
        )
        score += min(engagement, 100)
        
        # Same category boost
        if current_video_id and current_video_id in store.videos:
            current = store.videos[current_video_id]
            if video.category == current.category:
                score += 30
            # Same tags
            common_tags = set(video.tags) & set(current.tags)
            score += len(common_tags) * 10
        
        # Watch history influence
        if user_id and user_id in store.history:
            watched_ids = [h.video_id for h in store.history[user_id]]
            if video.id in watched_ids:
                score -= 50  # Already watched
            
            # Boost same channel if user watched before
            watched_channels = set()
            for h in store.history[user_id]:
                if h.video_id in store.videos:
                    watched_channels.add(store.videos[h.video_id].channel_id)
            if video.channel_id in watched_channels:
                score += 20
        
        return score
    
    async def get_trending(self, limit: int = 20, period_hours: int = 24) -> List[Video]:
        """Récupère les vidéos trending"""
        
        cutoff = datetime.utcnow() - timedelta(hours=period_hours)
        
        candidates = []
        for video in store.videos.values():
            if video.status == VideoStatus.READY and video.visibility == VideoVisibility.PUBLIC:
                if video.published_at and video.published_at >= cutoff:
                    candidates.append(video)
        
        # Sort by velocity (engagement / age)
        def velocity(v):
            age_hours = max(1, (datetime.utcnow() - v.published_at).total_seconds() / 3600)
            engagement = v.views_count + v.likes_count * 5 + v.comments_count * 10
            return engagement / age_hours
        
        candidates.sort(key=velocity, reverse=True)
        return candidates[:limit]

recommendation_engine = RecommendationEngine()

# =============================================================================
# CHAPTER AI ENGINE
# =============================================================================

class ChapterAIEngine:
    """Moteur de génération de chapitres IA"""
    
    async def generate_chapters(self, video_id: str) -> List[Chapter]:
        """Génère des chapitres automatiques basés sur le contenu"""
        
        if video_id not in store.videos:
            return []
        
        video = store.videos[video_id]
        duration = video.duration
        
        if duration < 60:  # Less than 1 minute
            return []
        
        # Simplified chapter generation (in production: use AI/ML)
        chapters = []
        
        # Introduction
        chapters.append(Chapter(
            title="Introduction",
            start_time=0,
            end_time=min(30, duration * 0.1),
            is_ai_generated=True
        ))
        
        # Main content sections
        main_duration = duration - 60  # Excluding intro/outro
        num_sections = min(5, int(main_duration / 120))  # ~2 min sections
        
        if num_sections > 0:
            section_length = main_duration / num_sections
            for i in range(num_sections):
                start = 30 + (i * section_length)
                end = start + section_length
                chapters.append(Chapter(
                    title=f"Section {i + 1}",
                    start_time=start,
                    end_time=end,
                    is_ai_generated=True
                ))
        
        # Conclusion
        if duration > 60:
            chapters.append(Chapter(
                title="Conclusion",
                start_time=duration - 30,
                end_time=duration,
                is_ai_generated=True
            ))
        
        return chapters

chapter_engine = ChapterAIEngine()

# =============================================================================
# API - CHANNELS
# =============================================================================

@router.post("/channels", response_model=Channel)
async def create_channel(name: str, handle: str, owner_id: str, description: Optional[str] = None):
    """Crée une nouvelle chaîne"""
    
    # Check handle uniqueness
    for ch in store.channels.values():
        if ch.handle == handle:
            raise HTTPException(400, "Handle already taken")
    
    channel = Channel(
        owner_id=owner_id,
        name=name,
        handle=handle,
        description=description
    )
    
    store.channels[channel.id] = channel
    store.videos_by_channel[channel.id] = []
    store.subs_by_channel[channel.id] = []
    
    return channel

@router.get("/channels/{channel_id}", response_model=Channel)
async def get_channel(channel_id: str):
    """Récupère une chaîne"""
    if channel_id not in store.channels:
        raise HTTPException(404, "Channel not found")
    return store.channels[channel_id]

@router.get("/channels/handle/{handle}", response_model=Channel)
async def get_channel_by_handle(handle: str):
    """Récupère une chaîne par handle"""
    for ch in store.channels.values():
        if ch.handle == handle:
            return ch
    raise HTTPException(404, "Channel not found")

@router.put("/channels/{channel_id}", response_model=Channel)
async def update_channel(channel_id: str, updates: Dict[str, Any], owner_id: str):
    """Met à jour une chaîne"""
    if channel_id not in store.channels:
        raise HTTPException(404, "Channel not found")
    
    channel = store.channels[channel_id]
    if channel.owner_id != owner_id:
        raise HTTPException(403, "Not authorized")
    
    for key, value in updates.items():
        if hasattr(channel, key) and key not in ['id', 'owner_id', 'created_at']:
            setattr(channel, key, value)
    
    return channel

# =============================================================================
# API - VIDEOS
# =============================================================================

@router.post("/videos", response_model=Video)
async def create_video(data: VideoCreate, user_id: str):
    """Crée une nouvelle vidéo (initialise l'upload)"""
    
    # Find user's channel
    channel = None
    for ch in store.channels.values():
        if ch.owner_id == user_id:
            channel = ch
            break
    
    if not channel:
        raise HTTPException(400, "Create a channel first")
    
    video = Video(
        channel_id=channel.id,
        title=data.title,
        description=data.description,
        category=data.category,
        tags=data.tags,
        visibility=data.visibility,
        space_id=data.space_id
    )
    
    store.videos[video.id] = video
    store.videos_by_channel[channel.id].append(video.id)
    store.comments_by_video[video.id] = []
    
    channel.videos_count += 1
    
    return video

@router.get("/videos/{video_id}", response_model=Video)
async def get_video(video_id: str, user_id: Optional[str] = None):
    """Récupère une vidéo"""
    if video_id not in store.videos:
        raise HTTPException(404, "Video not found")
    
    video = store.videos[video_id]
    
    # Check visibility
    if video.visibility == VideoVisibility.PRIVATE:
        channel = store.channels.get(video.channel_id)
        if not channel or channel.owner_id != user_id:
            raise HTTPException(403, "Video is private")
    
    # Increment views
    video.views_count += 1
    
    # Update channel stats
    if video.channel_id in store.channels:
        store.channels[video.channel_id].total_views += 1
    
    return video

@router.put("/videos/{video_id}", response_model=Video)
async def update_video(video_id: str, data: VideoUpdate, user_id: str):
    """Met à jour une vidéo"""
    if video_id not in store.videos:
        raise HTTPException(404, "Video not found")
    
    video = store.videos[video_id]
    channel = store.channels.get(video.channel_id)
    
    if not channel or channel.owner_id != user_id:
        raise HTTPException(403, "Not authorized")
    
    update_dict = data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(video, key, value)
    
    return video

@router.delete("/videos/{video_id}")
async def delete_video(video_id: str, user_id: str):
    """Supprime une vidéo"""
    if video_id not in store.videos:
        raise HTTPException(404, "Video not found")
    
    video = store.videos[video_id]
    channel = store.channels.get(video.channel_id)
    
    if not channel or channel.owner_id != user_id:
        raise HTTPException(403, "Not authorized")
    
    video.status = VideoStatus.DELETED
    channel.videos_count -= 1
    
    return {"status": "deleted"}

@router.post("/videos/{video_id}/publish")
async def publish_video(video_id: str, user_id: str):
    """Publie une vidéo"""
    if video_id not in store.videos:
        raise HTTPException(404, "Video not found")
    
    video = store.videos[video_id]
    channel = store.channels.get(video.channel_id)
    
    if not channel or channel.owner_id != user_id:
        raise HTTPException(403, "Not authorized")
    
    if video.status != VideoStatus.READY:
        raise HTTPException(400, "Video not ready")
    
    video.visibility = VideoVisibility.PUBLIC
    video.published_at = datetime.utcnow()
    
    return {"status": "published"}

# =============================================================================
# API - VIDEO PROCESSING (Simulated)
# =============================================================================

@router.post("/videos/{video_id}/process")
async def process_video(video_id: str, background_tasks: BackgroundTasks):
    """Lance le traitement d'une vidéo uploadée"""
    if video_id not in store.videos:
        raise HTTPException(404, "Video not found")
    
    video = store.videos[video_id]
    video.status = VideoStatus.PROCESSING
    
    # Simulate processing
    background_tasks.add_task(simulate_video_processing, video_id)
    
    return {"status": "processing"}

async def simulate_video_processing(video_id: str):
    """Simule le traitement vidéo"""
    import asyncio
    await asyncio.sleep(2)  # Simulate processing
    
    if video_id in store.videos:
        video = store.videos[video_id]
        video.status = VideoStatus.READY
        video.duration = 300  # 5 minutes
        video.hls_url = f"/streams/{video_id}/master.m3u8"
        
        # Generate qualities
        video.qualities = [
            VideoQuality(quality=QualityLevel.Q_360P, url=f"/streams/{video_id}/360p.m3u8", bitrate=800, width=640, height=360),
            VideoQuality(quality=QualityLevel.Q_720P, url=f"/streams/{video_id}/720p.m3u8", bitrate=2500, width=1280, height=720),
            VideoQuality(quality=QualityLevel.Q_1080P, url=f"/streams/{video_id}/1080p.m3u8", bitrate=5000, width=1920, height=1080),
        ]
        
        # Generate AI chapters
        video.chapters = await chapter_engine.generate_chapters(video_id)

# =============================================================================
# API - CHAPTERS
# =============================================================================

@router.post("/videos/{video_id}/chapters/generate")
async def generate_chapters(video_id: str, user_id: str):
    """Génère des chapitres IA"""
    if video_id not in store.videos:
        raise HTTPException(404, "Video not found")
    
    video = store.videos[video_id]
    channel = store.channels.get(video.channel_id)
    
    if not channel or channel.owner_id != user_id:
        raise HTTPException(403, "Not authorized")
    
    chapters = await chapter_engine.generate_chapters(video_id)
    video.chapters = chapters
    
    return {"chapters": chapters}

@router.put("/videos/{video_id}/chapters")
async def update_chapters(video_id: str, chapters: List[Chapter], user_id: str):
    """Met à jour les chapitres manuellement"""
    if video_id not in store.videos:
        raise HTTPException(404, "Video not found")
    
    video = store.videos[video_id]
    channel = store.channels.get(video.channel_id)
    
    if not channel or channel.owner_id != user_id:
        raise HTTPException(403, "Not authorized")
    
    video.chapters = chapters
    return {"status": "updated"}

# =============================================================================
# API - ENGAGEMENT
# =============================================================================

@router.post("/videos/{video_id}/like")
async def like_video(video_id: str, user_id: str, is_like: bool = True):
    """Like ou dislike une vidéo"""
    if video_id not in store.videos:
        raise HTTPException(404, "Video not found")
    
    video = store.videos[video_id]
    key = f"{user_id}_{video_id}"
    
    # Check existing
    existing = store.likes.get(key)
    
    if existing:
        if existing.is_like == is_like:
            # Remove like
            del store.likes[key]
            if is_like:
                video.likes_count -= 1
            else:
                video.dislikes_count -= 1
            return {"status": "removed"}
        else:
            # Switch like/dislike
            existing.is_like = is_like
            if is_like:
                video.likes_count += 1
                video.dislikes_count -= 1
            else:
                video.likes_count -= 1
                video.dislikes_count += 1
            return {"status": "switched"}
    
    # New like
    like = VideoLike(video_id=video_id, user_id=user_id, is_like=is_like)
    store.likes[key] = like
    
    if is_like:
        video.likes_count += 1
    else:
        video.dislikes_count += 1
    
    return {"status": "added"}

@router.post("/videos/{video_id}/comments", response_model=VideoComment)
async def add_comment(video_id: str, content: str, user_id: str, parent_id: Optional[str] = None, timestamp: Optional[float] = None):
    """Ajoute un commentaire"""
    if video_id not in store.videos:
        raise HTTPException(404, "Video not found")
    
    video = store.videos[video_id]
    if not video.allow_comments:
        raise HTTPException(403, "Comments disabled")
    
    comment = VideoComment(
        video_id=video_id,
        author_id=user_id,
        parent_id=parent_id,
        content=content,
        timestamp=timestamp
    )
    
    store.comments[comment.id] = comment
    store.comments_by_video[video_id].append(comment.id)
    video.comments_count += 1
    
    if parent_id and parent_id in store.comments:
        store.comments[parent_id].replies_count += 1
    
    return comment

@router.get("/videos/{video_id}/comments", response_model=List[VideoComment])
async def get_comments(video_id: str, sort: str = "top", limit: int = 50):
    """Récupère les commentaires"""
    comment_ids = store.comments_by_video.get(video_id, [])
    comments = [store.comments[cid] for cid in comment_ids if cid in store.comments]
    
    # Top-level only
    comments = [c for c in comments if not c.parent_id]
    
    if sort == "top":
        comments.sort(key=lambda x: x.likes_count, reverse=True)
    else:  # newest
        comments.sort(key=lambda x: x.created_at, reverse=True)
    
    return comments[:limit]

# =============================================================================
# API - SUBSCRIPTIONS
# =============================================================================

@router.post("/channels/{channel_id}/subscribe")
async def subscribe(channel_id: str, user_id: str):
    """S'abonne à une chaîne"""
    if channel_id not in store.channels:
        raise HTTPException(404, "Channel not found")
    
    key = f"{user_id}_{channel_id}"
    if key in store.subscriptions:
        raise HTTPException(400, "Already subscribed")
    
    sub = Subscription(user_id=user_id, channel_id=channel_id)
    store.subscriptions[key] = sub
    
    if user_id not in store.subs_by_user:
        store.subs_by_user[user_id] = []
    store.subs_by_user[user_id].append(channel_id)
    store.subs_by_channel[channel_id].append(user_id)
    
    store.channels[channel_id].subscribers_count += 1
    
    return {"status": "subscribed"}

@router.delete("/channels/{channel_id}/subscribe")
async def unsubscribe(channel_id: str, user_id: str):
    """Se désabonne"""
    key = f"{user_id}_{channel_id}"
    if key not in store.subscriptions:
        raise HTTPException(400, "Not subscribed")
    
    del store.subscriptions[key]
    store.subs_by_user[user_id].remove(channel_id)
    store.subs_by_channel[channel_id].remove(user_id)
    store.channels[channel_id].subscribers_count -= 1
    
    return {"status": "unsubscribed"}

@router.get("/subscriptions", response_model=List[Channel])
async def get_subscriptions(user_id: str):
    """Récupère les abonnements"""
    channel_ids = store.subs_by_user.get(user_id, [])
    return [store.channels[cid] for cid in channel_ids if cid in store.channels]

# =============================================================================
# API - WATCH HISTORY
# =============================================================================

@router.post("/history")
async def update_history(video_id: str, user_id: str, position: float, duration: float):
    """Met à jour l'historique de visionnage"""
    if video_id not in store.videos:
        raise HTTPException(404, "Video not found")
    
    if user_id not in store.history:
        store.history[user_id] = []
    
    # Find existing
    existing = None
    for h in store.history[user_id]:
        if h.video_id == video_id:
            existing = h
            break
    
    if existing:
        existing.last_position = position
        existing.watch_duration = max(existing.watch_duration, duration)
        existing.watched_at = datetime.utcnow()
        existing.completed = position >= store.videos[video_id].duration * 0.9
    else:
        history = WatchHistory(
            user_id=user_id,
            video_id=video_id,
            last_position=position,
            watch_duration=duration
        )
        store.history[user_id].insert(0, history)
        store.history[user_id] = store.history[user_id][:100]
    
    return {"status": "updated"}

@router.get("/history", response_model=List[WatchHistory])
async def get_history(user_id: str, limit: int = 50):
    """Récupère l'historique"""
    return store.history.get(user_id, [])[:limit]

# =============================================================================
# API - PLAYLISTS
# =============================================================================

@router.post("/playlists", response_model=Playlist)
async def create_playlist(title: str, user_id: str, description: Optional[str] = None):
    """Crée une playlist"""
    playlist = Playlist(owner_id=user_id, title=title, description=description)
    store.playlists[playlist.id] = playlist
    return playlist

@router.post("/playlists/{playlist_id}/videos")
async def add_to_playlist(playlist_id: str, video_id: str, user_id: str):
    """Ajoute une vidéo à une playlist"""
    if playlist_id not in store.playlists:
        raise HTTPException(404, "Playlist not found")
    if video_id not in store.videos:
        raise HTTPException(404, "Video not found")
    
    playlist = store.playlists[playlist_id]
    if playlist.owner_id != user_id:
        raise HTTPException(403, "Not authorized")
    
    if video_id not in playlist.video_ids:
        playlist.video_ids.append(video_id)
        playlist.videos_count += 1
    
    return {"status": "added"}

@router.get("/playlists/{playlist_id}", response_model=Playlist)
async def get_playlist(playlist_id: str):
    """Récupère une playlist"""
    if playlist_id not in store.playlists:
        raise HTTPException(404, "Playlist not found")
    return store.playlists[playlist_id]

# =============================================================================
# API - RECOMMENDATIONS & FEED
# =============================================================================

@router.get("/feed", response_model=List[Video])
async def get_feed(user_id: Optional[str] = None, limit: int = 20):
    """Feed personnalisé"""
    return await recommendation_engine.get_recommendations(user_id, limit=limit)

@router.get("/videos/{video_id}/related", response_model=List[Video])
async def get_related(video_id: str, user_id: Optional[str] = None, limit: int = 20):
    """Vidéos similaires"""
    return await recommendation_engine.get_recommendations(user_id, current_video_id=video_id, limit=limit)

@router.get("/trending", response_model=List[Video])
async def get_trending(limit: int = 20, period_hours: int = 24):
    """Vidéos trending"""
    return await recommendation_engine.get_trending(limit, period_hours)

@router.get("/channels/{channel_id}/videos", response_model=List[Video])
async def get_channel_videos(channel_id: str, limit: int = 50):
    """Vidéos d'une chaîne"""
    video_ids = store.videos_by_channel.get(channel_id, [])
    videos = [store.videos[vid] for vid in video_ids if vid in store.videos and store.videos[vid].status == VideoStatus.READY]
    return sorted(videos, key=lambda x: x.published_at or x.created_at, reverse=True)[:limit]

# =============================================================================
# API - CREATOR STUDIO ANALYTICS
# =============================================================================

@router.get("/studio/analytics", response_model=ChannelAnalytics)
async def get_channel_analytics(user_id: str, period: str = "week"):
    """Analytics créateur"""
    channel = None
    for ch in store.channels.values():
        if ch.owner_id == user_id:
            channel = ch
            break
    
    if not channel:
        raise HTTPException(404, "Channel not found")
    
    video_ids = store.videos_by_channel.get(channel.id, [])
    videos = [store.videos[vid] for vid in video_ids if vid in store.videos]
    
    total_views = sum(v.views_count for v in videos)
    
    return ChannelAnalytics(
        channel_id=channel.id,
        period=period,
        total_views=total_views,
        watch_time_hours=total_views * 0.1,  # Simplified
        subscribers_gained=channel.subscribers_count,
        top_videos=[v.id for v in sorted(videos, key=lambda x: x.views_count, reverse=True)[:5]]
    )

@router.get("/studio/videos/{video_id}/analytics", response_model=VideoAnalytics)
async def get_video_analytics(video_id: str, user_id: str, period: str = "week"):
    """Analytics vidéo"""
    if video_id not in store.videos:
        raise HTTPException(404, "Video not found")
    
    video = store.videos[video_id]
    
    return VideoAnalytics(
        video_id=video_id,
        period=period,
        views=video.views_count,
        watch_time_hours=video.views_count * 0.08,
        avg_view_duration=video.duration * 0.6,
        likes=video.likes_count,
        dislikes=video.dislikes_count,
        comments=video.comments_count
    )

# =============================================================================
# HEALTH
# =============================================================================

@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "channels": len(store.channels),
        "videos": len(store.videos),
        "streams": len(store.streams)
    }
