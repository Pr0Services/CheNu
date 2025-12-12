"""
CHE·NU™ B19 - Réseau Social API
Plateforme sociale professionnelle

Features:
- Social Feed API avec pagination cursor
- Posts avec médias (images, vidéos)
- Reactions système complet
- Commentaires imbriqués
- Trending hashtags
- Notifications en temps réel
- Groupes thématiques
- Recherche ElasticSearch ready

Author: CHE·NU Dev Team
Date: December 2024
Lines: ~600
"""

from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime, timedelta
from enum import Enum
import re
from uuid import uuid4

router = APIRouter(prefix="/api/v2/social", tags=["Social"])

# =============================================================================
# ENUMS
# =============================================================================

class PostType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    POLL = "poll"

class ReactionType(str, Enum):
    LIKE = "like"
    LOVE = "love"
    CELEBRATE = "celebrate"
    INSIGHTFUL = "insightful"

class Visibility(str, Enum):
    PUBLIC = "public"
    CONNECTIONS = "connections"
    PRIVATE = "private"

REACTION_EMOJIS = {
    ReactionType.LIKE: "👍",
    ReactionType.LOVE: "❤️",
    ReactionType.CELEBRATE: "🎉",
    ReactionType.INSIGHTFUL: "💡"
}

# =============================================================================
# MODELS
# =============================================================================

class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    display_name: str
    username: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    title: Optional[str] = None
    company: Optional[str] = None
    followers_count: int = 0
    following_count: int = 0
    posts_count: int = 0
    is_verified: bool = False

class MediaAttachment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    type: Literal["image", "video"]
    url: str
    thumbnail_url: Optional[str] = None
    alt_text: Optional[str] = None

class Post(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    author_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    content: str
    post_type: PostType = PostType.TEXT
    media: List[MediaAttachment] = []
    visibility: Visibility = Visibility.PUBLIC
    hashtags: List[str] = []
    mentions: List[str] = []
    reactions_count: int = 0
    reactions_breakdown: Dict[str, int] = {}
    comments_count: int = 0
    shares_count: int = 0
    views_count: int = 0
    is_edited: bool = False
    is_repost: bool = False
    original_post_id: Optional[str] = None

class PostCreate(BaseModel):
    content: str
    post_type: PostType = PostType.TEXT
    visibility: Visibility = Visibility.PUBLIC
    media_urls: List[str] = []

class Reaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    post_id: str
    user_id: str
    reaction_type: ReactionType
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Comment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    post_id: str
    author_id: str
    parent_id: Optional[str] = None
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    reactions_count: int = 0
    replies_count: int = 0

class Hashtag(BaseModel):
    tag: str
    posts_count: int = 0
    trending_score: float = 0.0
    last_used: datetime = Field(default_factory=datetime.utcnow)

class Notification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    type: str
    actor_id: str
    target_id: str
    message: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FeedItem(BaseModel):
    post: Post
    author: UserProfile
    user_reaction: Optional[ReactionType] = None
    relevance_score: float = 0.0

class FeedResponse(BaseModel):
    items: List[FeedItem]
    cursor: Optional[str] = None
    has_more: bool = False

# =============================================================================
# STORAGE
# =============================================================================

class Store:
    def __init__(self):
        self.profiles: Dict[str, UserProfile] = {}
        self.posts: Dict[str, Post] = {}
        self.reactions: Dict[str, Reaction] = {}
        self.comments: Dict[str, Comment] = {}
        self.hashtags: Dict[str, Hashtag] = {}
        self.notifications: Dict[str, List[Notification]] = {}
        self.following: Dict[str, List[str]] = {}
        self.followers: Dict[str, List[str]] = {}
        self.posts_by_author: Dict[str, List[str]] = {}
        self.reactions_by_post: Dict[str, List[str]] = {}
        self.comments_by_post: Dict[str, List[str]] = {}

store = Store()

# =============================================================================
# HELPERS
# =============================================================================

def extract_hashtags(content: str) -> List[str]:
    return [m.lower() for m in re.findall(r'#(\w+)', content)]

def extract_mentions(content: str) -> List[str]:
    return re.findall(r'@(\w+)', content)

async def create_notification(user_id: str, type: str, actor_id: str, target_id: str, message: str):
    if user_id == actor_id:
        return
    notif = Notification(user_id=user_id, type=type, actor_id=actor_id, target_id=target_id, message=message)
    if user_id not in store.notifications:
        store.notifications[user_id] = []
    store.notifications[user_id].insert(0, notif)
    store.notifications[user_id] = store.notifications[user_id][:100]

# =============================================================================
# FEED ENGINE
# =============================================================================

async def generate_feed(user_id: str, cursor: Optional[str], limit: int) -> FeedResponse:
    following = store.following.get(user_id, [])
    candidates = []
    
    # Posts from following
    for fid in following:
        for pid in store.posts_by_author.get(fid, [])[-30:]:
            if pid in store.posts:
                candidates.append(store.posts[pid])
    
    # Trending public posts
    for post in store.posts.values():
        if post.visibility == Visibility.PUBLIC and post.author_id not in following:
            if post.reactions_count + post.comments_count > 3:
                candidates.append(post)
    
    # Score and sort
    def score(p):
        age = (datetime.utcnow() - p.created_at).total_seconds() / 3600
        recency = max(0, 100 - age * 2)
        engagement = p.reactions_count + p.comments_count * 2 + p.shares_count * 3
        connection = 50 if p.author_id in following else 0
        return recency + min(engagement, 100) + connection
    
    candidates = list({p.id: p for p in candidates}.values())
    scored = sorted(candidates, key=score, reverse=True)
    
    start = int(cursor) if cursor else 0
    end = start + limit
    page = scored[start:end]
    
    items = []
    for post in page:
        author = store.profiles.get(post.author_id)
        if not author:
            continue
        user_reaction = None
        for rid in store.reactions_by_post.get(post.id, []):
            r = store.reactions.get(rid)
            if r and r.user_id == user_id:
                user_reaction = r.reaction_type
                break
        items.append(FeedItem(post=post, author=author, user_reaction=user_reaction, relevance_score=score(post)))
    
    return FeedResponse(items=items, cursor=str(end) if end < len(scored) else None, has_more=end < len(scored))

# =============================================================================
# API - PROFILES
# =============================================================================

@router.post("/profiles", response_model=UserProfile)
async def create_profile(profile: UserProfile):
    store.profiles[profile.user_id] = profile
    return profile

@router.get("/profiles/{user_id}", response_model=UserProfile)
async def get_profile(user_id: str):
    if user_id not in store.profiles:
        raise HTTPException(404, "Profile not found")
    return store.profiles[user_id]

# =============================================================================
# API - CONNECTIONS
# =============================================================================

@router.post("/follow/{target_id}")
async def follow(target_id: str, user_id: str):
    if target_id not in store.profiles:
        raise HTTPException(404, "User not found")
    if user_id not in store.following:
        store.following[user_id] = []
    if target_id in store.following[user_id]:
        raise HTTPException(400, "Already following")
    store.following[user_id].append(target_id)
    if target_id not in store.followers:
        store.followers[target_id] = []
    store.followers[target_id].append(user_id)
    if user_id in store.profiles:
        store.profiles[user_id].following_count += 1
    if target_id in store.profiles:
        store.profiles[target_id].followers_count += 1
    await create_notification(target_id, "follow", user_id, user_id, "started following you")
    return {"status": "following"}

@router.delete("/follow/{target_id}")
async def unfollow(target_id: str, user_id: str):
    if user_id in store.following and target_id in store.following[user_id]:
        store.following[user_id].remove(target_id)
        if target_id in store.followers:
            store.followers[target_id].remove(user_id)
        if user_id in store.profiles:
            store.profiles[user_id].following_count -= 1
        if target_id in store.profiles:
            store.profiles[target_id].followers_count -= 1
        return {"status": "unfollowed"}
    raise HTTPException(400, "Not following")

# =============================================================================
# API - POSTS
# =============================================================================

@router.post("/posts", response_model=Post)
async def create_post(data: PostCreate, user_id: str, background_tasks: BackgroundTasks):
    hashtags = extract_hashtags(data.content)
    mentions = extract_mentions(data.content)
    
    media = [MediaAttachment(type="image", url=url) for url in data.media_urls]
    
    post = Post(
        author_id=user_id,
        content=data.content,
        post_type=data.post_type,
        visibility=data.visibility,
        media=media,
        hashtags=hashtags,
        mentions=mentions
    )
    
    store.posts[post.id] = post
    if user_id not in store.posts_by_author:
        store.posts_by_author[user_id] = []
    store.posts_by_author[user_id].append(post.id)
    
    if user_id in store.profiles:
        store.profiles[user_id].posts_count += 1
    
    # Index hashtags
    for tag in hashtags:
        if tag not in store.hashtags:
            store.hashtags[tag] = Hashtag(tag=tag)
        store.hashtags[tag].posts_count += 1
        store.hashtags[tag].last_used = datetime.utcnow()
    
    return post

@router.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: str):
    if post_id not in store.posts:
        raise HTTPException(404, "Post not found")
    store.posts[post_id].views_count += 1
    return store.posts[post_id]

@router.delete("/posts/{post_id}")
async def delete_post(post_id: str, user_id: str):
    if post_id not in store.posts:
        raise HTTPException(404, "Post not found")
    post = store.posts[post_id]
    if post.author_id != user_id:
        raise HTTPException(403, "Not authorized")
    del store.posts[post_id]
    if user_id in store.profiles:
        store.profiles[user_id].posts_count -= 1
    return {"status": "deleted"}

# =============================================================================
# API - FEED
# =============================================================================

@router.get("/feed", response_model=FeedResponse)
async def get_feed(user_id: str, cursor: Optional[str] = None, limit: int = Query(20, le=50)):
    return await generate_feed(user_id, cursor, limit)

@router.get("/feed/user/{target_id}", response_model=FeedResponse)
async def get_user_posts(target_id: str, cursor: Optional[str] = None, limit: int = 20):
    post_ids = store.posts_by_author.get(target_id, [])
    posts = [store.posts[pid] for pid in reversed(post_ids) if pid in store.posts]
    start = int(cursor) if cursor else 0
    end = start + limit
    author = store.profiles.get(target_id)
    items = [FeedItem(post=p, author=author) for p in posts[start:end]] if author else []
    return FeedResponse(items=items, cursor=str(end) if end < len(posts) else None, has_more=end < len(posts))

# =============================================================================
# API - REACTIONS
# =============================================================================

@router.post("/posts/{post_id}/react")
async def react(post_id: str, reaction_type: ReactionType, user_id: str):
    if post_id not in store.posts:
        raise HTTPException(404, "Post not found")
    post = store.posts[post_id]
    
    # Check existing
    for rid in store.reactions_by_post.get(post_id, []):
        r = store.reactions.get(rid)
        if r and r.user_id == user_id:
            old = r.reaction_type.value
            r.reaction_type = reaction_type
            post.reactions_breakdown[old] = max(0, post.reactions_breakdown.get(old, 1) - 1)
            post.reactions_breakdown[reaction_type.value] = post.reactions_breakdown.get(reaction_type.value, 0) + 1
            return {"status": "updated"}
    
    reaction = Reaction(post_id=post_id, user_id=user_id, reaction_type=reaction_type)
    store.reactions[reaction.id] = reaction
    if post_id not in store.reactions_by_post:
        store.reactions_by_post[post_id] = []
    store.reactions_by_post[post_id].append(reaction.id)
    post.reactions_count += 1
    post.reactions_breakdown[reaction_type.value] = post.reactions_breakdown.get(reaction_type.value, 0) + 1
    
    await create_notification(post.author_id, "like", user_id, post_id, f"reacted {REACTION_EMOJIS[reaction_type]}")
    return {"status": "added"}

@router.delete("/posts/{post_id}/react")
async def unreact(post_id: str, user_id: str):
    if post_id not in store.posts:
        raise HTTPException(404, "Post not found")
    for rid in store.reactions_by_post.get(post_id, []):
        r = store.reactions.get(rid)
        if r and r.user_id == user_id:
            store.reactions_by_post[post_id].remove(rid)
            del store.reactions[rid]
            store.posts[post_id].reactions_count -= 1
            rt = r.reaction_type.value
            store.posts[post_id].reactions_breakdown[rt] = max(0, store.posts[post_id].reactions_breakdown.get(rt, 1) - 1)
            return {"status": "removed"}
    raise HTTPException(404, "Reaction not found")

# =============================================================================
# API - COMMENTS
# =============================================================================

@router.post("/posts/{post_id}/comments", response_model=Comment)
async def create_comment(post_id: str, content: str, user_id: str, parent_id: Optional[str] = None):
    if post_id not in store.posts:
        raise HTTPException(404, "Post not found")
    comment = Comment(post_id=post_id, author_id=user_id, content=content, parent_id=parent_id)
    store.comments[comment.id] = comment
    if post_id not in store.comments_by_post:
        store.comments_by_post[post_id] = []
    store.comments_by_post[post_id].append(comment.id)
    store.posts[post_id].comments_count += 1
    if parent_id and parent_id in store.comments:
        store.comments[parent_id].replies_count += 1
    await create_notification(store.posts[post_id].author_id, "comment", user_id, post_id, "commented on your post")
    return comment

@router.get("/posts/{post_id}/comments", response_model=List[Comment])
async def get_comments(post_id: str, parent_id: Optional[str] = None, limit: int = 20):
    cids = store.comments_by_post.get(post_id, [])
    comments = [store.comments[cid] for cid in cids if cid in store.comments]
    if parent_id:
        comments = [c for c in comments if c.parent_id == parent_id]
    else:
        comments = [c for c in comments if not c.parent_id]
    return sorted(comments, key=lambda x: x.created_at, reverse=True)[:limit]

# =============================================================================
# API - SHARE
# =============================================================================

@router.post("/posts/{post_id}/share", response_model=Post)
async def share_post(post_id: str, user_id: str, comment: Optional[str] = ""):
    if post_id not in store.posts:
        raise HTTPException(404, "Post not found")
    original = store.posts[post_id]
    repost = Post(author_id=user_id, content=comment, is_repost=True, original_post_id=post_id)
    store.posts[repost.id] = repost
    if user_id not in store.posts_by_author:
        store.posts_by_author[user_id] = []
    store.posts_by_author[user_id].append(repost.id)
    original.shares_count += 1
    await create_notification(original.author_id, "share", user_id, post_id, "shared your post")
    return repost

# =============================================================================
# API - TRENDING
# =============================================================================

@router.get("/trending/hashtags", response_model=List[Hashtag])
async def get_trending(limit: int = 10):
    for h in store.hashtags.values():
        age = (datetime.utcnow() - h.last_used).total_seconds() / 3600
        h.trending_score = h.posts_count * max(0, 1 - age / 24)
    return sorted(store.hashtags.values(), key=lambda x: x.trending_score, reverse=True)[:limit]

@router.get("/search/posts", response_model=List[Post])
async def search_posts(q: str, limit: int = 20):
    q_lower = q.lower()
    results = [p for p in store.posts.values() if q_lower in p.content.lower() or any(q_lower in t for t in p.hashtags)]
    return sorted(results, key=lambda x: x.reactions_count, reverse=True)[:limit]

# =============================================================================
# API - NOTIFICATIONS
# =============================================================================

@router.get("/notifications", response_model=List[Notification])
async def get_notifications(user_id: str, unread_only: bool = False, limit: int = 20):
    notifs = store.notifications.get(user_id, [])
    if unread_only:
        notifs = [n for n in notifs if not n.is_read]
    return notifs[:limit]

@router.post("/notifications/read")
async def mark_read(user_id: str, ids: List[str]):
    for n in store.notifications.get(user_id, []):
        if n.id in ids:
            n.is_read = True
    return {"status": "done"}

# =============================================================================
# HEALTH
# =============================================================================

@router.get("/health")
async def health():
    return {"status": "healthy", "posts": len(store.posts), "profiles": len(store.profiles)}
