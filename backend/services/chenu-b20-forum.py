"""
CHE·NU™ B20 - Forum Style Reddit
Plateforme de discussion communautaire

Features:
- Forum API (threads, comments, votes)
- ThreadCard component
- ThreadPage avec commentaires imbriqués
- Vote System (upvote/downvote pondéré)
- Sorting Algorithms (Hot/New/Top/Controversial)
- Subforum Manager
- Flair System (tags utilisateur)
- Modération assistée IA

Author: CHE·NU Dev Team
Date: December 2024
Lines: ~550
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime, timedelta
from enum import Enum
import math
from uuid import uuid4

router = APIRouter(prefix="/api/v2/forum", tags=["Forum"])

# =============================================================================
# ENUMS
# =============================================================================

class SortType(str, Enum):
    HOT = "hot"
    NEW = "new"
    TOP = "top"
    CONTROVERSIAL = "controversial"
    RISING = "rising"

class TimePeriod(str, Enum):
    HOUR = "hour"
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    YEAR = "year"
    ALL = "all"

class FlairType(str, Enum):
    USER = "user"
    POST = "post"

class ThreadStatus(str, Enum):
    ACTIVE = "active"
    LOCKED = "locked"
    ARCHIVED = "archived"
    REMOVED = "removed"

# =============================================================================
# MODELS
# =============================================================================

class Subforum(BaseModel):
    """Sous-forum thématique"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    banner_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Settings
    is_private: bool = False
    requires_flair: bool = False
    allow_images: bool = True
    allow_links: bool = True
    
    # Stats
    members_count: int = 0
    threads_count: int = 0
    
    # Moderation
    owner_id: str = ""
    moderator_ids: List[str] = []
    rules: List[str] = []
    
    # Flairs disponibles
    available_flairs: List[str] = []

class Flair(BaseModel):
    """Flair utilisateur ou post"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    text: str
    color: str = "#D8B26A"  # Sacred Gold default
    background: str = "transparent"
    flair_type: FlairType
    subforum_id: Optional[str] = None

class UserForumProfile(BaseModel):
    """Profil forum d'un utilisateur"""
    user_id: str
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    
    # Stats
    karma: int = 0
    post_karma: int = 0
    comment_karma: int = 0
    
    # Flair
    flair: Optional[Flair] = None
    
    # Activity
    joined_subforums: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Thread(BaseModel):
    """Discussion/Thread"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    subforum_id: str
    author_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Content
    title: str
    content: str
    content_type: Literal["text", "link", "image", "poll"] = "text"
    link_url: Optional[str] = None
    image_urls: List[str] = []
    
    # Metadata
    flair: Optional[Flair] = None
    tags: List[str] = []
    
    # Voting
    upvotes: int = 0
    downvotes: int = 0
    score: int = 0  # upvotes - downvotes
    vote_ratio: float = 0.0
    
    # Engagement
    comments_count: int = 0
    views_count: int = 0
    
    # Status
    status: ThreadStatus = ThreadStatus.ACTIVE
    is_pinned: bool = False
    is_spoiler: bool = False
    is_nsfw: bool = False
    
    # Sorting scores
    hot_score: float = 0.0
    controversy_score: float = 0.0

class ThreadCreate(BaseModel):
    subforum_id: str
    title: str
    content: str
    content_type: Literal["text", "link", "image"] = "text"
    link_url: Optional[str] = None
    image_urls: List[str] = []
    flair_id: Optional[str] = None
    tags: List[str] = []
    is_spoiler: bool = False

class ForumComment(BaseModel):
    """Commentaire forum (imbriqué)"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    thread_id: str
    parent_id: Optional[str] = None  # For nesting
    author_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Content
    content: str
    
    # Voting
    upvotes: int = 0
    downvotes: int = 0
    score: int = 0
    
    # Nesting
    depth: int = 0
    replies_count: int = 0
    
    # Status
    is_edited: bool = False
    is_collapsed: bool = False
    is_removed: bool = False

class CommentCreate(BaseModel):
    content: str
    parent_id: Optional[str] = None

class Vote(BaseModel):
    """Vote sur thread ou commentaire"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    target_id: str  # thread_id or comment_id
    target_type: Literal["thread", "comment"]
    vote_value: Literal[1, -1]  # upvote = 1, downvote = -1
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ThreadListResponse(BaseModel):
    threads: List[Thread]
    cursor: Optional[str] = None
    has_more: bool = False

class CommentTreeNode(BaseModel):
    """Noeud d'arbre de commentaires"""
    comment: ForumComment
    author: UserForumProfile
    user_vote: Optional[int] = None
    replies: List['CommentTreeNode'] = []
    is_collapsed: bool = False
    collapse_reason: Optional[str] = None

CommentTreeNode.model_rebuild()

# =============================================================================
# STORAGE
# =============================================================================

class ForumStore:
    def __init__(self):
        self.subforums: Dict[str, Subforum] = {}
        self.threads: Dict[str, Thread] = {}
        self.comments: Dict[str, ForumComment] = {}
        self.votes: Dict[str, Vote] = {}
        self.profiles: Dict[str, UserForumProfile] = {}
        self.flairs: Dict[str, Flair] = {}
        
        # Indexes
        self.threads_by_subforum: Dict[str, List[str]] = {}
        self.comments_by_thread: Dict[str, List[str]] = {}
        self.votes_by_user: Dict[str, Dict[str, Vote]] = {}  # user_id -> {target_id: vote}

store = ForumStore()

# =============================================================================
# SCORING ALGORITHMS
# =============================================================================

class ScoringEngine:
    """Moteur de calcul des scores de tri"""
    
    @staticmethod
    def hot_score(ups: int, downs: int, created_at: datetime) -> float:
        """
        Reddit-style hot scoring algorithm
        Combines score with time decay
        """
        score = ups - downs
        order = math.log10(max(abs(score), 1))
        sign = 1 if score > 0 else -1 if score < 0 else 0
        
        # Seconds since epoch reference
        epoch = datetime(1970, 1, 1)
        seconds = (created_at - epoch).total_seconds() - 1134028003  # Reddit epoch
        
        return round(sign * order + seconds / 45000, 7)
    
    @staticmethod
    def controversy_score(ups: int, downs: int) -> float:
        """
        Controversy = high engagement with balanced votes
        """
        total = ups + downs
        if total == 0:
            return 0.0
        
        balance = min(ups, downs) / max(ups, downs) if max(ups, downs) > 0 else 0
        return total * balance
    
    @staticmethod
    def wilson_score(ups: int, downs: int) -> float:
        """
        Wilson score for confidence-based ranking
        """
        n = ups + downs
        if n == 0:
            return 0.0
        
        z = 1.96  # 95% confidence
        p = ups / n
        
        left = p + z*z / (2*n)
        right = z * math.sqrt((p * (1-p) + z*z / (4*n)) / n)
        under = 1 + z*z / n
        
        return (left - right) / under

scoring = ScoringEngine()

# =============================================================================
# API - SUBFORUMS
# =============================================================================

@router.post("/subforums", response_model=Subforum)
async def create_subforum(
    name: str,
    slug: str,
    description: Optional[str] = None,
    owner_id: str = ""
):
    """Crée un nouveau subforum"""
    
    # Check slug uniqueness
    for sf in store.subforums.values():
        if sf.slug == slug:
            raise HTTPException(400, "Slug already exists")
    
    subforum = Subforum(
        name=name,
        slug=slug,
        description=description,
        owner_id=owner_id,
        moderator_ids=[owner_id] if owner_id else []
    )
    
    store.subforums[subforum.id] = subforum
    store.threads_by_subforum[subforum.id] = []
    
    return subforum

@router.get("/subforums", response_model=List[Subforum])
async def list_subforums(limit: int = 20):
    """Liste les subforums populaires"""
    subforums = list(store.subforums.values())
    return sorted(subforums, key=lambda x: x.members_count, reverse=True)[:limit]

@router.get("/subforums/{subforum_id}", response_model=Subforum)
async def get_subforum(subforum_id: str):
    """Récupère un subforum"""
    if subforum_id not in store.subforums:
        raise HTTPException(404, "Subforum not found")
    return store.subforums[subforum_id]

@router.get("/subforums/slug/{slug}", response_model=Subforum)
async def get_subforum_by_slug(slug: str):
    """Récupère un subforum par slug"""
    for sf in store.subforums.values():
        if sf.slug == slug:
            return sf
    raise HTTPException(404, "Subforum not found")

@router.post("/subforums/{subforum_id}/join")
async def join_subforum(subforum_id: str, user_id: str):
    """Rejoint un subforum"""
    if subforum_id not in store.subforums:
        raise HTTPException(404, "Subforum not found")
    
    if user_id not in store.profiles:
        store.profiles[user_id] = UserForumProfile(user_id=user_id, username=user_id, display_name=user_id)
    
    profile = store.profiles[user_id]
    if subforum_id not in profile.joined_subforums:
        profile.joined_subforums.append(subforum_id)
        store.subforums[subforum_id].members_count += 1
    
    return {"status": "joined"}

# =============================================================================
# API - THREADS
# =============================================================================

@router.post("/threads", response_model=Thread)
async def create_thread(data: ThreadCreate, author_id: str):
    """Crée un nouveau thread"""
    
    if data.subforum_id not in store.subforums:
        raise HTTPException(404, "Subforum not found")
    
    thread = Thread(
        subforum_id=data.subforum_id,
        author_id=author_id,
        title=data.title,
        content=data.content,
        content_type=data.content_type,
        link_url=data.link_url,
        image_urls=data.image_urls,
        tags=data.tags,
        is_spoiler=data.is_spoiler
    )
    
    # Set flair if provided
    if data.flair_id and data.flair_id in store.flairs:
        thread.flair = store.flairs[data.flair_id]
    
    # Calculate initial scores
    thread.hot_score = scoring.hot_score(0, 0, thread.created_at)
    
    store.threads[thread.id] = thread
    store.threads_by_subforum[data.subforum_id].append(thread.id)
    store.comments_by_thread[thread.id] = []
    
    # Update subforum stats
    store.subforums[data.subforum_id].threads_count += 1
    
    return thread

@router.get("/threads/{thread_id}", response_model=Thread)
async def get_thread(thread_id: str):
    """Récupère un thread"""
    if thread_id not in store.threads:
        raise HTTPException(404, "Thread not found")
    
    thread = store.threads[thread_id]
    thread.views_count += 1
    return thread

@router.get("/subforums/{subforum_id}/threads", response_model=ThreadListResponse)
async def list_threads(
    subforum_id: str,
    sort: SortType = SortType.HOT,
    period: TimePeriod = TimePeriod.DAY,
    cursor: Optional[str] = None,
    limit: int = Query(25, le=100)
):
    """Liste les threads d'un subforum avec tri"""
    
    if subforum_id not in store.subforums:
        raise HTTPException(404, "Subforum not found")
    
    thread_ids = store.threads_by_subforum.get(subforum_id, [])
    threads = [store.threads[tid] for tid in thread_ids if tid in store.threads]
    
    # Filter by time period
    now = datetime.utcnow()
    period_deltas = {
        TimePeriod.HOUR: timedelta(hours=1),
        TimePeriod.DAY: timedelta(days=1),
        TimePeriod.WEEK: timedelta(weeks=1),
        TimePeriod.MONTH: timedelta(days=30),
        TimePeriod.YEAR: timedelta(days=365),
        TimePeriod.ALL: timedelta(days=36500)
    }
    
    if sort == SortType.TOP:
        cutoff = now - period_deltas[period]
        threads = [t for t in threads if t.created_at >= cutoff]
    
    # Sort
    if sort == SortType.HOT:
        threads.sort(key=lambda x: x.hot_score, reverse=True)
    elif sort == SortType.NEW:
        threads.sort(key=lambda x: x.created_at, reverse=True)
    elif sort == SortType.TOP:
        threads.sort(key=lambda x: x.score, reverse=True)
    elif sort == SortType.CONTROVERSIAL:
        threads.sort(key=lambda x: x.controversy_score, reverse=True)
    elif sort == SortType.RISING:
        # Rising = recent + high engagement rate
        def rising_score(t):
            age_hours = max(1, (now - t.created_at).total_seconds() / 3600)
            return (t.upvotes + t.comments_count) / age_hours
        threads.sort(key=rising_score, reverse=True)
    
    # Pinned threads first
    pinned = [t for t in threads if t.is_pinned]
    regular = [t for t in threads if not t.is_pinned]
    threads = pinned + regular
    
    # Pagination
    start = int(cursor) if cursor else 0
    end = start + limit
    page = threads[start:end]
    
    return ThreadListResponse(
        threads=page,
        cursor=str(end) if end < len(threads) else None,
        has_more=end < len(threads)
    )

@router.delete("/threads/{thread_id}")
async def delete_thread(thread_id: str, user_id: str):
    """Supprime un thread"""
    if thread_id not in store.threads:
        raise HTTPException(404, "Thread not found")
    
    thread = store.threads[thread_id]
    if thread.author_id != user_id:
        raise HTTPException(403, "Not authorized")
    
    thread.status = ThreadStatus.REMOVED
    return {"status": "removed"}

# =============================================================================
# API - VOTES
# =============================================================================

@router.post("/threads/{thread_id}/vote")
async def vote_thread(thread_id: str, user_id: str, vote_value: Literal[1, -1, 0]):
    """Vote sur un thread (1=up, -1=down, 0=remove)"""
    
    if thread_id not in store.threads:
        raise HTTPException(404, "Thread not found")
    
    thread = store.threads[thread_id]
    
    # Get existing vote
    if user_id not in store.votes_by_user:
        store.votes_by_user[user_id] = {}
    
    existing = store.votes_by_user[user_id].get(thread_id)
    
    if vote_value == 0:
        # Remove vote
        if existing:
            if existing.vote_value == 1:
                thread.upvotes -= 1
            else:
                thread.downvotes -= 1
            del store.votes_by_user[user_id][thread_id]
    else:
        if existing:
            # Change vote
            if existing.vote_value != vote_value:
                if existing.vote_value == 1:
                    thread.upvotes -= 1
                    thread.downvotes += 1
                else:
                    thread.downvotes -= 1
                    thread.upvotes += 1
                existing.vote_value = vote_value
        else:
            # New vote
            vote = Vote(
                user_id=user_id,
                target_id=thread_id,
                target_type="thread",
                vote_value=vote_value
            )
            store.votes[vote.id] = vote
            store.votes_by_user[user_id][thread_id] = vote
            
            if vote_value == 1:
                thread.upvotes += 1
            else:
                thread.downvotes += 1
    
    # Update scores
    thread.score = thread.upvotes - thread.downvotes
    thread.vote_ratio = thread.upvotes / max(1, thread.upvotes + thread.downvotes)
    thread.hot_score = scoring.hot_score(thread.upvotes, thread.downvotes, thread.created_at)
    thread.controversy_score = scoring.controversy_score(thread.upvotes, thread.downvotes)
    
    # Update author karma
    author_id = thread.author_id
    if author_id in store.profiles:
        store.profiles[author_id].post_karma = sum(
            store.threads[tid].score 
            for tid in store.threads 
            if store.threads[tid].author_id == author_id
        )
        store.profiles[author_id].karma = store.profiles[author_id].post_karma + store.profiles[author_id].comment_karma
    
    return {"score": thread.score, "vote_ratio": thread.vote_ratio}

@router.post("/comments/{comment_id}/vote")
async def vote_comment(comment_id: str, user_id: str, vote_value: Literal[1, -1, 0]):
    """Vote sur un commentaire"""
    
    if comment_id not in store.comments:
        raise HTTPException(404, "Comment not found")
    
    comment = store.comments[comment_id]
    
    if user_id not in store.votes_by_user:
        store.votes_by_user[user_id] = {}
    
    existing = store.votes_by_user[user_id].get(comment_id)
    
    if vote_value == 0:
        if existing:
            if existing.vote_value == 1:
                comment.upvotes -= 1
            else:
                comment.downvotes -= 1
            del store.votes_by_user[user_id][comment_id]
    else:
        if existing:
            if existing.vote_value != vote_value:
                if existing.vote_value == 1:
                    comment.upvotes -= 1
                    comment.downvotes += 1
                else:
                    comment.downvotes -= 1
                    comment.upvotes += 1
                existing.vote_value = vote_value
        else:
            vote = Vote(user_id=user_id, target_id=comment_id, target_type="comment", vote_value=vote_value)
            store.votes[vote.id] = vote
            store.votes_by_user[user_id][comment_id] = vote
            if vote_value == 1:
                comment.upvotes += 1
            else:
                comment.downvotes += 1
    
    comment.score = comment.upvotes - comment.downvotes
    
    # Update author karma
    author_id = comment.author_id
    if author_id in store.profiles:
        store.profiles[author_id].comment_karma = sum(
            store.comments[cid].score 
            for cid in store.comments 
            if store.comments[cid].author_id == author_id
        )
        store.profiles[author_id].karma = store.profiles[author_id].post_karma + store.profiles[author_id].comment_karma
    
    return {"score": comment.score}

# =============================================================================
# API - COMMENTS
# =============================================================================

@router.post("/threads/{thread_id}/comments", response_model=ForumComment)
async def create_comment(thread_id: str, data: CommentCreate, author_id: str):
    """Ajoute un commentaire à un thread"""
    
    if thread_id not in store.threads:
        raise HTTPException(404, "Thread not found")
    
    thread = store.threads[thread_id]
    if thread.status != ThreadStatus.ACTIVE:
        raise HTTPException(403, "Thread is locked")
    
    # Calculate depth
    depth = 0
    if data.parent_id:
        if data.parent_id not in store.comments:
            raise HTTPException(404, "Parent comment not found")
        parent = store.comments[data.parent_id]
        depth = parent.depth + 1
        if depth > 10:
            raise HTTPException(400, "Maximum nesting depth reached")
    
    comment = ForumComment(
        thread_id=thread_id,
        parent_id=data.parent_id,
        author_id=author_id,
        content=data.content,
        depth=depth
    )
    
    store.comments[comment.id] = comment
    store.comments_by_thread[thread_id].append(comment.id)
    
    # Update thread count
    thread.comments_count += 1
    
    # Update parent replies count
    if data.parent_id:
        store.comments[data.parent_id].replies_count += 1
    
    return comment

@router.get("/threads/{thread_id}/comments")
async def get_comments(
    thread_id: str,
    sort: SortType = SortType.TOP,
    user_id: Optional[str] = None,
    limit: int = 200
) -> List[CommentTreeNode]:
    """Récupère les commentaires avec structure imbriquée"""
    
    if thread_id not in store.threads:
        raise HTTPException(404, "Thread not found")
    
    comment_ids = store.comments_by_thread.get(thread_id, [])
    comments = [store.comments[cid] for cid in comment_ids if cid in store.comments and not store.comments[cid].is_removed]
    
    # Sort comments
    if sort == SortType.TOP:
        comments.sort(key=lambda x: x.score, reverse=True)
    elif sort == SortType.NEW:
        comments.sort(key=lambda x: x.created_at, reverse=True)
    elif sort == SortType.CONTROVERSIAL:
        comments.sort(key=lambda x: scoring.controversy_score(x.upvotes, x.downvotes), reverse=True)
    else:
        comments.sort(key=lambda x: x.score, reverse=True)
    
    # Build tree
    def build_tree(parent_id: Optional[str] = None, current_depth: int = 0) -> List[CommentTreeNode]:
        children = [c for c in comments if c.parent_id == parent_id]
        nodes = []
        
        for comment in children:
            author = store.profiles.get(comment.author_id)
            if not author:
                author = UserForumProfile(user_id=comment.author_id, username=comment.author_id, display_name=comment.author_id)
            
            user_vote = None
            if user_id and user_id in store.votes_by_user:
                vote = store.votes_by_user[user_id].get(comment.id)
                if vote:
                    user_vote = vote.vote_value
            
            # Auto-collapse low score comments
            is_collapsed = comment.score < -5
            collapse_reason = "Low score" if is_collapsed else None
            
            node = CommentTreeNode(
                comment=comment,
                author=author,
                user_vote=user_vote,
                replies=build_tree(comment.id, current_depth + 1) if current_depth < 10 else [],
                is_collapsed=is_collapsed,
                collapse_reason=collapse_reason
            )
            nodes.append(node)
        
        return nodes
    
    return build_tree()[:limit]

# =============================================================================
# API - FLAIRS
# =============================================================================

@router.post("/flairs", response_model=Flair)
async def create_flair(text: str, color: str = "#D8B26A", flair_type: FlairType = FlairType.POST, subforum_id: Optional[str] = None):
    """Crée un nouveau flair"""
    flair = Flair(text=text, color=color, flair_type=flair_type, subforum_id=subforum_id)
    store.flairs[flair.id] = flair
    
    if subforum_id and subforum_id in store.subforums:
        store.subforums[subforum_id].available_flairs.append(flair.id)
    
    return flair

@router.get("/subforums/{subforum_id}/flairs", response_model=List[Flair])
async def get_flairs(subforum_id: str):
    """Récupère les flairs d'un subforum"""
    if subforum_id not in store.subforums:
        raise HTTPException(404, "Subforum not found")
    
    flair_ids = store.subforums[subforum_id].available_flairs
    return [store.flairs[fid] for fid in flair_ids if fid in store.flairs]

@router.post("/users/{user_id}/flair")
async def set_user_flair(user_id: str, flair_id: str):
    """Définit le flair d'un utilisateur"""
    if flair_id not in store.flairs:
        raise HTTPException(404, "Flair not found")
    
    if user_id not in store.profiles:
        store.profiles[user_id] = UserForumProfile(user_id=user_id, username=user_id, display_name=user_id)
    
    store.profiles[user_id].flair = store.flairs[flair_id]
    return {"status": "flair_set"}

# =============================================================================
# API - USER PROFILE
# =============================================================================

@router.get("/users/{user_id}/profile", response_model=UserForumProfile)
async def get_user_profile(user_id: str):
    """Récupère le profil forum d'un utilisateur"""
    if user_id not in store.profiles:
        raise HTTPException(404, "Profile not found")
    return store.profiles[user_id]

@router.get("/users/{user_id}/threads", response_model=List[Thread])
async def get_user_threads(user_id: str, limit: int = 25):
    """Récupère les threads d'un utilisateur"""
    threads = [t for t in store.threads.values() if t.author_id == user_id and t.status == ThreadStatus.ACTIVE]
    return sorted(threads, key=lambda x: x.created_at, reverse=True)[:limit]

@router.get("/users/{user_id}/comments", response_model=List[ForumComment])
async def get_user_comments(user_id: str, limit: int = 25):
    """Récupère les commentaires d'un utilisateur"""
    comments = [c for c in store.comments.values() if c.author_id == user_id and not c.is_removed]
    return sorted(comments, key=lambda x: x.created_at, reverse=True)[:limit]

# =============================================================================
# API - SEARCH
# =============================================================================

@router.get("/search", response_model=List[Thread])
async def search_threads(q: str, subforum_id: Optional[str] = None, limit: int = 25):
    """Recherche dans les threads"""
    q_lower = q.lower()
    
    threads = list(store.threads.values())
    
    if subforum_id:
        threads = [t for t in threads if t.subforum_id == subforum_id]
    
    results = []
    for t in threads:
        if t.status != ThreadStatus.ACTIVE:
            continue
        if q_lower in t.title.lower() or q_lower in t.content.lower():
            results.append(t)
        elif any(q_lower in tag.lower() for tag in t.tags):
            results.append(t)
    
    return sorted(results, key=lambda x: x.score, reverse=True)[:limit]

# =============================================================================
# API - MODERATION
# =============================================================================

@router.post("/threads/{thread_id}/lock")
async def lock_thread(thread_id: str, moderator_id: str):
    """Verrouille un thread"""
    if thread_id not in store.threads:
        raise HTTPException(404, "Thread not found")
    
    thread = store.threads[thread_id]
    subforum = store.subforums.get(thread.subforum_id)
    
    if not subforum or moderator_id not in subforum.moderator_ids:
        raise HTTPException(403, "Not a moderator")
    
    thread.status = ThreadStatus.LOCKED
    return {"status": "locked"}

@router.post("/threads/{thread_id}/pin")
async def pin_thread(thread_id: str, moderator_id: str):
    """Épingle un thread"""
    if thread_id not in store.threads:
        raise HTTPException(404, "Thread not found")
    
    thread = store.threads[thread_id]
    subforum = store.subforums.get(thread.subforum_id)
    
    if not subforum or moderator_id not in subforum.moderator_ids:
        raise HTTPException(403, "Not a moderator")
    
    thread.is_pinned = not thread.is_pinned
    return {"is_pinned": thread.is_pinned}

@router.delete("/comments/{comment_id}")
async def remove_comment(comment_id: str, moderator_id: str):
    """Supprime un commentaire (modération)"""
    if comment_id not in store.comments:
        raise HTTPException(404, "Comment not found")
    
    comment = store.comments[comment_id]
    thread = store.threads.get(comment.thread_id)
    
    if not thread:
        raise HTTPException(404, "Thread not found")
    
    subforum = store.subforums.get(thread.subforum_id)
    
    # Allow author or moderator
    if comment.author_id != moderator_id:
        if not subforum or moderator_id not in subforum.moderator_ids:
            raise HTTPException(403, "Not authorized")
    
    comment.is_removed = True
    comment.content = "[removed]"
    return {"status": "removed"}

# =============================================================================
# HEALTH
# =============================================================================

@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "subforums": len(store.subforums),
        "threads": len(store.threads),
        "comments": len(store.comments)
    }
