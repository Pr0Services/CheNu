"""
CHE·NU - Scholars Service
=========================
Service pour l'espace éducation et recherche.

Fonctionnalités:
- Gestion des cours et parcours d'apprentissage
- Recherche académique intégrée
- Bibliothèque personnelle
- Certifications et badges
- Notes et annotations
- Flashcards et quiz
- Collaboration de recherche

Version: 1.0
"""

from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from uuid import UUID, uuid4
from enum import Enum
from pydantic import BaseModel, Field
import json
import asyncpg
from fastapi import HTTPException


# ============================================================================
# ENUMS
# ============================================================================

class CourseStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    PAUSED = "paused"


class ContentType(str, Enum):
    VIDEO = "video"
    ARTICLE = "article"
    BOOK = "book"
    PAPER = "paper"
    PODCAST = "podcast"
    COURSE = "course"


class ResearchStatus(str, Enum):
    PLANNING = "planning"
    COLLECTING = "collecting"
    ANALYZING = "analyzing"
    WRITING = "writing"
    REVIEW = "review"
    PUBLISHED = "published"


# ============================================================================
# MODELS
# ============================================================================

class Course(BaseModel):
    """Cours ou parcours d'apprentissage"""
    title: str
    description: Optional[str] = None
    source: Optional[str] = None  # URL ou provider
    provider: Optional[str] = None  # Coursera, Udemy, etc.
    duration_hours: Optional[float] = None
    topics: List[str] = []
    difficulty: str = "intermediate"  # beginner, intermediate, advanced


class LibraryItem(BaseModel):
    """Élément de la bibliothèque"""
    title: str
    content_type: ContentType
    authors: List[str] = []
    source_url: Optional[str] = None
    publication_date: Optional[datetime] = None
    abstract: Optional[str] = None
    tags: List[str] = []
    notes: Optional[str] = None


class ResearchProject(BaseModel):
    """Projet de recherche"""
    title: str
    description: Optional[str] = None
    hypothesis: Optional[str] = None
    methodology: Optional[str] = None
    keywords: List[str] = []
    collaborators: List[UUID] = []
    deadline: Optional[datetime] = None


class Flashcard(BaseModel):
    """Carte mémoire"""
    question: str
    answer: str
    tags: List[str] = []
    difficulty: int = Field(ge=1, le=5, default=3)


class StudySession(BaseModel):
    """Session d'étude"""
    course_id: Optional[UUID] = None
    topic: str
    duration_minutes: int
    notes: Optional[str] = None
    progress_percent: float = Field(ge=0, le=100, default=0)


# ============================================================================
# SERVICE
# ============================================================================

class ScholarsService:
    """
    Service Scholars pour l'éducation et la recherche
    """
    
    def __init__(self, db_pool: asyncpg.Pool):
        self.db = db_pool
    
    # ========================================================================
    # COURS
    # ========================================================================
    
    async def add_course(
        self,
        course: Course,
        owner_id: UUID
    ) -> Dict[str, Any]:
        """Ajoute un cours à suivre"""
        query = """
            INSERT INTO scholar_courses (
                title, description, source, provider,
                duration_hours, topics, difficulty, status, owner_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query,
            course.title,
            course.description,
            course.source,
            course.provider,
            course.duration_hours,
            course.topics,
            course.difficulty,
            CourseStatus.NOT_STARTED.value,
            owner_id
        )
        
        return dict(row)
    
    async def list_courses(
        self,
        owner_id: UUID,
        status: Optional[CourseStatus] = None
    ) -> List[Dict[str, Any]]:
        """Liste les cours"""
        if status:
            query = """
                SELECT * FROM scholar_courses
                WHERE owner_id = $1 AND status = $2
                ORDER BY updated_at DESC
            """
            rows = await self.db.fetch(query, owner_id, status.value)
        else:
            query = """
                SELECT * FROM scholar_courses
                WHERE owner_id = $1
                ORDER BY 
                    CASE status 
                        WHEN 'in_progress' THEN 1 
                        WHEN 'not_started' THEN 2 
                        WHEN 'paused' THEN 3 
                        WHEN 'completed' THEN 4 
                    END,
                    updated_at DESC
            """
            rows = await self.db.fetch(query, owner_id)
        
        return [dict(row) for row in rows]
    
    async def update_course_progress(
        self,
        course_id: UUID,
        progress_percent: float,
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """Met à jour la progression d'un cours"""
        status = CourseStatus.IN_PROGRESS.value
        if progress_percent >= 100:
            status = CourseStatus.COMPLETED.value
        
        query = """
            UPDATE scholar_courses
            SET progress_percent = $2, status = $3, notes = COALESCE($4, notes), updated_at = NOW()
            WHERE id = $1
            RETURNING *
        """
        
        row = await self.db.fetchrow(query, course_id, progress_percent, status, notes)
        return dict(row) if row else {}
    
    # ========================================================================
    # BIBLIOTHÈQUE
    # ========================================================================
    
    async def add_to_library(
        self,
        item: LibraryItem,
        owner_id: UUID
    ) -> Dict[str, Any]:
        """Ajoute un élément à la bibliothèque"""
        query = """
            INSERT INTO scholar_library (
                title, content_type, authors, source_url,
                publication_date, abstract, tags, notes, owner_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query,
            item.title,
            item.content_type.value,
            item.authors,
            item.source_url,
            item.publication_date,
            item.abstract,
            item.tags,
            item.notes,
            owner_id
        )
        
        return dict(row)
    
    async def search_library(
        self,
        owner_id: UUID,
        query_text: Optional[str] = None,
        content_type: Optional[ContentType] = None,
        tags: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Recherche dans la bibliothèque"""
        conditions = ["owner_id = $1"]
        params = [owner_id]
        param_idx = 2
        
        if query_text:
            conditions.append(f"(title ILIKE ${param_idx} OR abstract ILIKE ${param_idx})")
            params.append(f"%{query_text}%")
            param_idx += 1
        
        if content_type:
            conditions.append(f"content_type = ${param_idx}")
            params.append(content_type.value)
            param_idx += 1
        
        if tags:
            conditions.append(f"tags && ${param_idx}")
            params.append(tags)
            param_idx += 1
        
        query = f"""
            SELECT * FROM scholar_library
            WHERE {' AND '.join(conditions)}
            ORDER BY created_at DESC
        """
        
        rows = await self.db.fetch(query, *params)
        return [dict(row) for row in rows]
    
    async def add_annotation(
        self,
        library_item_id: UUID,
        highlight: str,
        note: Optional[str] = None,
        page: Optional[int] = None,
        owner_id: UUID = None
    ) -> Dict[str, Any]:
        """Ajoute une annotation à un élément"""
        query = """
            INSERT INTO scholar_annotations (
                library_item_id, highlight, note, page_number, owner_id
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query, library_item_id, highlight, note, page, owner_id
        )
        
        return dict(row)
    
    # ========================================================================
    # RECHERCHE
    # ========================================================================
    
    async def create_research_project(
        self,
        project: ResearchProject,
        owner_id: UUID
    ) -> Dict[str, Any]:
        """Crée un projet de recherche"""
        query = """
            INSERT INTO scholar_research (
                title, description, hypothesis, methodology,
                keywords, collaborators, deadline, status, owner_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query,
            project.title,
            project.description,
            project.hypothesis,
            project.methodology,
            project.keywords,
            [str(c) for c in project.collaborators],
            project.deadline,
            ResearchStatus.PLANNING.value,
            owner_id
        )
        
        return dict(row)
    
    async def list_research_projects(
        self,
        owner_id: UUID,
        status: Optional[ResearchStatus] = None
    ) -> List[Dict[str, Any]]:
        """Liste les projets de recherche"""
        if status:
            query = """
                SELECT * FROM scholar_research
                WHERE owner_id = $1 AND status = $2
                ORDER BY updated_at DESC
            """
            rows = await self.db.fetch(query, owner_id, status.value)
        else:
            query = """
                SELECT * FROM scholar_research
                WHERE owner_id = $1
                ORDER BY updated_at DESC
            """
            rows = await self.db.fetch(query, owner_id)
        
        return [dict(row) for row in rows]
    
    async def update_research_status(
        self,
        project_id: UUID,
        status: ResearchStatus
    ) -> Dict[str, Any]:
        """Met à jour le statut d'un projet de recherche"""
        query = """
            UPDATE scholar_research
            SET status = $2, updated_at = NOW()
            WHERE id = $1
            RETURNING *
        """
        
        row = await self.db.fetchrow(query, project_id, status.value)
        return dict(row) if row else {}
    
    # ========================================================================
    # FLASHCARDS
    # ========================================================================
    
    async def create_flashcard(
        self,
        card: Flashcard,
        deck_id: Optional[UUID] = None,
        owner_id: UUID = None
    ) -> Dict[str, Any]:
        """Crée une flashcard"""
        query = """
            INSERT INTO scholar_flashcards (
                question, answer, tags, difficulty, deck_id, owner_id
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query,
            card.question,
            card.answer,
            card.tags,
            card.difficulty,
            deck_id,
            owner_id
        )
        
        return dict(row)
    
    async def get_study_cards(
        self,
        owner_id: UUID,
        deck_id: Optional[UUID] = None,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Récupère des cartes pour révision (spaced repetition)"""
        # Algorithme simplifié de répétition espacée
        query = """
            SELECT * FROM scholar_flashcards
            WHERE owner_id = $1
            AND (deck_id = $2 OR $2 IS NULL)
            AND (next_review IS NULL OR next_review <= NOW())
            ORDER BY 
                CASE WHEN next_review IS NULL THEN 0 ELSE 1 END,
                next_review,
                RANDOM()
            LIMIT $3
        """
        
        rows = await self.db.fetch(query, owner_id, deck_id, limit)
        return [dict(row) for row in rows]
    
    async def review_card(
        self,
        card_id: UUID,
        quality: int  # 0-5 (0=oublié complètement, 5=parfait)
    ) -> Dict[str, Any]:
        """Enregistre une révision de carte (spaced repetition)"""
        # Récupérer la carte
        card = await self.db.fetchrow(
            "SELECT * FROM scholar_flashcards WHERE id = $1", card_id
        )
        
        if not card:
            raise HTTPException(status_code=404, detail="Carte non trouvée")
        
        # Calculer le prochain intervalle (algorithme SM-2 simplifié)
        current_interval = card['interval_days'] or 1
        current_easiness = card['easiness_factor'] or 2.5
        
        if quality < 3:
            # Mauvaise réponse - reset
            new_interval = 1
            new_easiness = max(1.3, current_easiness - 0.2)
        else:
            # Bonne réponse
            new_easiness = current_easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
            new_easiness = max(1.3, new_easiness)
            
            if card['review_count'] == 0:
                new_interval = 1
            elif card['review_count'] == 1:
                new_interval = 6
            else:
                new_interval = int(current_interval * new_easiness)
        
        next_review = datetime.now() + timedelta(days=new_interval)
        
        query = """
            UPDATE scholar_flashcards
            SET review_count = review_count + 1,
                last_reviewed = NOW(),
                next_review = $2,
                interval_days = $3,
                easiness_factor = $4
            WHERE id = $1
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query, card_id, next_review, new_interval, new_easiness
        )
        
        return dict(row) if row else {}
    
    # ========================================================================
    # SESSIONS D'ÉTUDE
    # ========================================================================
    
    async def log_study_session(
        self,
        session: StudySession,
        owner_id: UUID
    ) -> Dict[str, Any]:
        """Enregistre une session d'étude"""
        query = """
            INSERT INTO scholar_study_sessions (
                course_id, topic, duration_minutes, notes, progress_percent, owner_id
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        """
        
        row = await self.db.fetchrow(
            query,
            session.course_id,
            session.topic,
            session.duration_minutes,
            session.notes,
            session.progress_percent,
            owner_id
        )
        
        # Mettre à jour les stats
        await self._update_study_stats(owner_id, session.duration_minutes)
        
        return dict(row)
    
    async def get_study_stats(
        self,
        owner_id: UUID,
        period_days: int = 30
    ) -> Dict[str, Any]:
        """Récupère les statistiques d'étude"""
        query = """
            SELECT 
                COUNT(*) as total_sessions,
                SUM(duration_minutes) as total_minutes,
                AVG(duration_minutes) as avg_session_minutes,
                COUNT(DISTINCT DATE(created_at)) as study_days
            FROM scholar_study_sessions
            WHERE owner_id = $1 AND created_at > NOW() - INTERVAL '%s days'
        """ % period_days
        
        row = await self.db.fetchrow(query, owner_id)
        
        # Stats des cours
        courses_query = """
            SELECT 
                COUNT(*) FILTER (WHERE status = 'completed') as completed_courses,
                COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_courses,
                AVG(progress_percent) as avg_progress
            FROM scholar_courses
            WHERE owner_id = $1
        """
        courses_row = await self.db.fetchrow(courses_query, owner_id)
        
        return {
            'study_sessions': {
                'total_sessions': row['total_sessions'] or 0,
                'total_hours': round((row['total_minutes'] or 0) / 60, 1),
                'avg_session_minutes': round(row['avg_session_minutes'] or 0, 1),
                'study_days': row['study_days'] or 0
            },
            'courses': {
                'completed': courses_row['completed_courses'] or 0,
                'in_progress': courses_row['in_progress_courses'] or 0,
                'avg_progress': round(courses_row['avg_progress'] or 0, 1)
            },
            'period_days': period_days
        }
    
    async def _update_study_stats(self, owner_id: UUID, minutes: int) -> None:
        """Met à jour les stats globales"""
        await self.db.execute("""
            INSERT INTO scholar_stats (owner_id, total_study_minutes, last_study_date)
            VALUES ($1, $2, NOW())
            ON CONFLICT (owner_id) DO UPDATE
            SET total_study_minutes = scholar_stats.total_study_minutes + $2,
                last_study_date = NOW()
        """, owner_id, minutes)


# ============================================================================
# FACTORY
# ============================================================================

_service_instance: Optional[ScholarsService] = None

async def get_scholars_service(db_pool: asyncpg.Pool) -> ScholarsService:
    global _service_instance
    if _service_instance is None:
        _service_instance = ScholarsService(db_pool)
    return _service_instance
