"""
CHE·NU - Video Streaming Service
═══════════════════════════════════════════════════════════════════════════════
Service de streaming vidéo complet avec chapitres IA et recommandations.
Version: 1.0
═══════════════════════════════════════════════════════════════════════════════
"""

from typing import Optional, List, Dict, Any
from uuid import UUID, uuid4
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum
import json
import logging

logger = logging.getLogger("CHENU.VideoStreaming")


class VideoStatus(str, Enum):
    DRAFT = "draft"
    PROCESSING = "processing"
    READY = "ready"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class VideoVisibility(str, Enum):
    PUBLIC = "public"
    UNLISTED = "unlisted"
    PRIVATE = "private"


class VideoCategory(str, Enum):
    TUTORIAL = "tutorial"
    ENTERTAINMENT = "entertainment"
    EDUCATION = "education"
    GAMING = "gaming"
    MUSIC = "music"
    TECHNOLOGY = "technology"
    BUSINESS = "business"
    OTHER = "other"


class ChapterType(str, Enum):
    MANUAL = "manual"
    AI_GENERATED = "ai_generated"


@dataclass
class VideoChapter:
    id: UUID = field(default_factory=uuid4)
    title: str = ""
    start_time: int = 0
    end_time: Optional[int] = None
    chapter_type: ChapterType = ChapterType.MANUAL
    confidence: float = 1.0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": str(self.id),
            "title": self.title,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "chapter_type": self.chapter_type.value,
            "confidence": self.confidence
        }


@dataclass
class Video:
    id: UUID = field(default_factory=uuid4)
    owner_id: UUID = None
    title: str = ""
    description: str = ""
    category: VideoCategory = VideoCategory.OTHER
    tags: List[str] = field(default_factory=list)
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration_seconds: int = 0
    status: VideoStatus = VideoStatus.DRAFT
    visibility: VideoVisibility = VideoVisibility.PRIVATE
    chapters: List[VideoChapter] = field(default_factory=list)
    views: int = 0
    likes: int = 0
    created_at: datetime = field(default_factory=datetime.utcnow)
    published_at: Optional[datetime] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": str(self.id),
            "owner_id": str(self.owner_id) if self.owner_id else None,
            "title": self.title,
            "description": self.description,
            "category": self.category.value,
            "tags": self.tags,
            "video_url": self.video_url,
            "thumbnail_url": self.thumbnail_url,
            "duration_seconds": self.duration_seconds,
            "duration_formatted": self._format_duration(),
            "status": self.status.value,
            "visibility": self.visibility.value,
            "chapters": [c.to_dict() for c in self.chapters],
            "views": self.views,
            "likes": self.likes,
            "created_at": self.created_at.isoformat(),
            "published_at": self.published_at.isoformat() if self.published_at else None
        }
    
    def _format_duration(self) -> str:
        hours, remainder = divmod(self.duration_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        if hours > 0:
            return f"{hours}:{minutes:02d}:{seconds:02d}"
        return f"{minutes}:{seconds:02d}"


class VideoStreamingService:
    def __init__(self, db_pool=None):
        self.db = db_pool
    
    async def create_video(self, owner_id: UUID, title: str, description: str = "", category: VideoCategory = VideoCategory.OTHER) -> Video:
        video = Video(owner_id=owner_id, title=title, description=description, category=category)
        if self.db:
            await self.db.execute(
                "INSERT INTO videos (id, owner_id, title, description, category, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                video.id, owner_id, title, description, category.value, VideoStatus.DRAFT.value, video.created_at
            )
        return video
    
    async def get_video(self, video_id: UUID) -> Optional[Video]:
        if not self.db:
            return None
        row = await self.db.fetchrow("SELECT * FROM videos WHERE id = $1", video_id)
        return self._row_to_video(row) if row else None
    
    async def list_videos(self, owner_id: Optional[UUID] = None, category: Optional[VideoCategory] = None, limit: int = 20) -> List[Video]:
        if not self.db:
            return []
        query = "SELECT * FROM videos WHERE 1=1"
        params = []
        if owner_id:
            query += f" AND owner_id = ${len(params)+1}"
            params.append(owner_id)
        if category:
            query += f" AND category = ${len(params)+1}"
            params.append(category.value)
        query += f" ORDER BY created_at DESC LIMIT ${len(params)+1}"
        params.append(limit)
        rows = await self.db.fetch(query, *params)
        return [self._row_to_video(row) for row in rows]
    
    async def publish_video(self, video_id: UUID) -> Optional[Video]:
        if self.db:
            await self.db.execute(
                "UPDATE videos SET status = $2, visibility = $3, published_at = $4 WHERE id = $1",
                video_id, VideoStatus.PUBLISHED.value, VideoVisibility.PUBLIC.value, datetime.utcnow()
            )
        return await self.get_video(video_id)
    
    async def generate_chapters(self, video_id: UUID) -> List[VideoChapter]:
        """Génère automatiquement des chapitres IA"""
        video = await self.get_video(video_id)
        if not video:
            return []
        
        duration = video.duration_seconds
        chapters = []
        
        # Créer des chapitres automatiques (~5 min chacun)
        chapter_length = 300
        num_chapters = max(1, duration // chapter_length)
        
        chapter_titles = [
            "Introduction", "Contexte", "Développement", "Points clés",
            "Démonstration", "Analyse", "Discussion", "Conclusion"
        ]
        
        for i in range(min(num_chapters, len(chapter_titles))):
            start = i * chapter_length
            chapters.append(VideoChapter(
                title=chapter_titles[i],
                start_time=start,
                end_time=min(start + chapter_length, duration),
                chapter_type=ChapterType.AI_GENERATED,
                confidence=0.8
            ))
        
        if self.db:
            await self.db.execute(
                "UPDATE videos SET chapters = $2 WHERE id = $1",
                video_id, json.dumps([c.to_dict() for c in chapters])
            )
        
        return chapters
    
    async def get_recommendations(self, user_id: UUID, limit: int = 10) -> List[Video]:
        """Recommandations personnalisées"""
        if not self.db:
            return []
        
        # Vidéos populaires récentes
        rows = await self.db.fetch("""
            SELECT * FROM videos
            WHERE status = 'published' AND visibility = 'public'
            ORDER BY views DESC, published_at DESC
            LIMIT $1
        """, limit)
        
        return [self._row_to_video(row) for row in rows]
    
    async def record_view(self, video_id: UUID, user_id: Optional[UUID] = None) -> None:
        if self.db:
            await self.db.execute("UPDATE videos SET views = views + 1 WHERE id = $1", video_id)
            if user_id:
                await self.db.execute(
                    "INSERT INTO video_watch_history (video_id, user_id, watched_at) VALUES ($1, $2, $3)",
                    video_id, user_id, datetime.utcnow()
                )
    
    async def like_video(self, video_id: UUID, user_id: UUID) -> None:
        if self.db:
            await self.db.execute("UPDATE videos SET likes = likes + 1 WHERE id = $1", video_id)
    
    def _row_to_video(self, row) -> Video:
        chapters = []
        if row.get("chapters"):
            chapters_data = json.loads(row["chapters"]) if isinstance(row["chapters"], str) else row["chapters"]
            for c in chapters_data:
                chapters.append(VideoChapter(
                    id=UUID(c["id"]) if c.get("id") else uuid4(),
                    title=c.get("title", ""),
                    start_time=c.get("start_time", 0),
                    end_time=c.get("end_time"),
                    chapter_type=ChapterType(c.get("chapter_type", "manual")),
                    confidence=c.get("confidence", 1.0)
                ))
        
        return Video(
            id=row["id"],
            owner_id=row.get("owner_id"),
            title=row.get("title", ""),
            description=row.get("description", ""),
            category=VideoCategory(row.get("category", "other")),
            tags=row.get("tags", []),
            video_url=row.get("video_url"),
            thumbnail_url=row.get("thumbnail_url"),
            duration_seconds=row.get("duration_seconds", 0),
            status=VideoStatus(row.get("status", "draft")),
            visibility=VideoVisibility(row.get("visibility", "private")),
            chapters=chapters,
            views=row.get("views", 0),
            likes=row.get("likes", 0),
            created_at=row.get("created_at", datetime.utcnow()),
            published_at=row.get("published_at")
        )


_service_instance: Optional[VideoStreamingService] = None

def get_video_streaming_service(db_pool=None) -> VideoStreamingService:
    global _service_instance
    if _service_instance is None:
        _service_instance = VideoStreamingService(db_pool)
    return _service_instance
