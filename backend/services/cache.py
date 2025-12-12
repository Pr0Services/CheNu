"""
CHE·NU Unified - Cache System
═══════════════════════════════════════════════════════════════════════════════
Système de cache multi-niveaux avec support:
- Redis (distributed)
- In-Memory (local)
- TTL & invalidation
- Cache-aside pattern

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Callable, Dict, List, Optional, TypeVar, Generic
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from collections import OrderedDict
from enum import Enum
import asyncio
import hashlib
import json
import pickle
import logging
import functools

logger = logging.getLogger("CHE·NU.Utils.Cache")

T = TypeVar('T')


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class CacheBackend(str, Enum):
    MEMORY = "memory"
    REDIS = "redis"
    HYBRID = "hybrid"  # Memory L1 + Redis L2


class SerializationType(str, Enum):
    JSON = "json"
    PICKLE = "pickle"
    STRING = "string"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class CacheEntry:
    """Entrée de cache."""
    key: str
    value: Any
    created_at: datetime = field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    ttl_seconds: Optional[int] = None
    
    # Metadata
    hits: int = 0
    last_accessed: datetime = field(default_factory=datetime.utcnow)
    tags: List[str] = field(default_factory=list)
    
    @property
    def is_expired(self) -> bool:
        if self.expires_at is None:
            return False
        return datetime.utcnow() > self.expires_at
    
    def touch(self) -> None:
        self.hits += 1
        self.last_accessed = datetime.utcnow()


@dataclass
class CacheStats:
    """Statistiques du cache."""
    hits: int = 0
    misses: int = 0
    sets: int = 0
    deletes: int = 0
    
    size: int = 0
    max_size: int = 0
    
    @property
    def hit_rate(self) -> float:
        total = self.hits + self.misses
        return self.hits / total * 100 if total > 0 else 0


# ═══════════════════════════════════════════════════════════════════════════════
# IN-MEMORY CACHE (LRU)
# ═══════════════════════════════════════════════════════════════════════════════

class MemoryCache:
    """
    Cache en mémoire avec LRU eviction.
    
    Features:
    - TTL support
    - LRU eviction
    - Tag-based invalidation
    - Thread-safe (async)
    """
    
    def __init__(self, max_size: int = 1000, default_ttl: int = 300):
        self.max_size = max_size
        self.default_ttl = default_ttl
        self._cache: OrderedDict[str, CacheEntry] = OrderedDict()
        self._tags: Dict[str, set] = {}  # tag -> set of keys
        self._lock = asyncio.Lock()
        self._stats = CacheStats(max_size=max_size)
    
    async def get(self, key: str) -> Optional[Any]:
        """Get a value from cache."""
        async with self._lock:
            entry = self._cache.get(key)
            
            if entry is None:
                self._stats.misses += 1
                return None
            
            if entry.is_expired:
                await self._delete_entry(key)
                self._stats.misses += 1
                return None
            
            # Move to end (most recently used)
            self._cache.move_to_end(key)
            entry.touch()
            
            self._stats.hits += 1
            return entry.value
    
    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        tags: Optional[List[str]] = None
    ) -> None:
        """Set a value in cache."""
        async with self._lock:
            ttl = ttl or self.default_ttl
            expires_at = datetime.utcnow() + timedelta(seconds=ttl) if ttl else None
            
            entry = CacheEntry(
                key=key,
                value=value,
                ttl_seconds=ttl,
                expires_at=expires_at,
                tags=tags or []
            )
            
            # Remove old entry if exists
            if key in self._cache:
                await self._delete_entry(key)
            
            # Evict if at capacity
            while len(self._cache) >= self.max_size:
                await self._evict_lru()
            
            # Add entry
            self._cache[key] = entry
            
            # Index tags
            for tag in entry.tags:
                if tag not in self._tags:
                    self._tags[tag] = set()
                self._tags[tag].add(key)
            
            self._stats.sets += 1
            self._stats.size = len(self._cache)
    
    async def delete(self, key: str) -> bool:
        """Delete a key from cache."""
        async with self._lock:
            if key in self._cache:
                await self._delete_entry(key)
                self._stats.deletes += 1
                return True
            return False
    
    async def delete_by_tag(self, tag: str) -> int:
        """Delete all entries with a specific tag."""
        async with self._lock:
            keys = self._tags.get(tag, set()).copy()
            count = 0
            
            for key in keys:
                if key in self._cache:
                    await self._delete_entry(key)
                    count += 1
            
            self._stats.deletes += count
            return count
    
    async def clear(self) -> None:
        """Clear all cache entries."""
        async with self._lock:
            self._cache.clear()
            self._tags.clear()
            self._stats.size = 0
    
    async def _delete_entry(self, key: str) -> None:
        """Delete entry and clean up tags."""
        entry = self._cache.pop(key, None)
        if entry:
            for tag in entry.tags:
                if tag in self._tags:
                    self._tags[tag].discard(key)
            self._stats.size = len(self._cache)
    
    async def _evict_lru(self) -> None:
        """Evict least recently used entry."""
        if self._cache:
            oldest_key = next(iter(self._cache))
            await self._delete_entry(oldest_key)
            logger.debug(f"Evicted LRU key: {oldest_key}")
    
    async def cleanup_expired(self) -> int:
        """Remove all expired entries."""
        async with self._lock:
            expired_keys = [
                key for key, entry in self._cache.items()
                if entry.is_expired
            ]
            
            for key in expired_keys:
                await self._delete_entry(key)
            
            return len(expired_keys)
    
    def get_stats(self) -> CacheStats:
        """Get cache statistics."""
        self._stats.size = len(self._cache)
        return self._stats


# ═══════════════════════════════════════════════════════════════════════════════
# REDIS CACHE
# ═══════════════════════════════════════════════════════════════════════════════

class RedisCache:
    """
    Cache Redis distribué.
    
    Features:
    - Distributed caching
    - TTL support
    - Tag-based invalidation via sets
    - JSON/Pickle serialization
    """
    
    def __init__(
        self,
        redis_url: str = "redis://localhost:6379",
        prefix: str = "chenu:",
        default_ttl: int = 300,
        serialization: SerializationType = SerializationType.JSON
    ):
        self.redis_url = redis_url
        self.prefix = prefix
        self.default_ttl = default_ttl
        self.serialization = serialization
        self._redis = None
        self._stats = CacheStats()
    
    async def _get_redis(self):
        """Get Redis connection."""
        if self._redis is None:
            try:
                import redis.asyncio as redis
                self._redis = redis.from_url(self.redis_url, decode_responses=False)
            except ImportError:
                logger.warning("redis package not installed")
                return None
        return self._redis
    
    def _make_key(self, key: str) -> str:
        return f"{self.prefix}{key}"
    
    def _serialize(self, value: Any) -> bytes:
        if self.serialization == SerializationType.JSON:
            return json.dumps(value).encode()
        elif self.serialization == SerializationType.PICKLE:
            return pickle.dumps(value)
        else:
            return str(value).encode()
    
    def _deserialize(self, data: bytes) -> Any:
        if self.serialization == SerializationType.JSON:
            return json.loads(data.decode())
        elif self.serialization == SerializationType.PICKLE:
            return pickle.loads(data)
        else:
            return data.decode()
    
    async def get(self, key: str) -> Optional[Any]:
        """Get a value from Redis."""
        redis = await self._get_redis()
        if not redis:
            return None
        
        try:
            data = await redis.get(self._make_key(key))
            
            if data is None:
                self._stats.misses += 1
                return None
            
            self._stats.hits += 1
            return self._deserialize(data)
        except Exception as e:
            logger.error(f"Redis get error: {e}")
            self._stats.misses += 1
            return None
    
    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        tags: Optional[List[str]] = None
    ) -> bool:
        """Set a value in Redis."""
        redis = await self._get_redis()
        if not redis:
            return False
        
        try:
            ttl = ttl or self.default_ttl
            full_key = self._make_key(key)
            data = self._serialize(value)
            
            # Set value with TTL
            await redis.setex(full_key, ttl, data)
            
            # Add to tag sets
            if tags:
                for tag in tags:
                    tag_key = f"{self.prefix}tag:{tag}"
                    await redis.sadd(tag_key, key)
                    await redis.expire(tag_key, ttl + 60)  # Tag lives slightly longer
            
            self._stats.sets += 1
            return True
        except Exception as e:
            logger.error(f"Redis set error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete a key from Redis."""
        redis = await self._get_redis()
        if not redis:
            return False
        
        try:
            result = await redis.delete(self._make_key(key))
            if result:
                self._stats.deletes += 1
            return bool(result)
        except Exception as e:
            logger.error(f"Redis delete error: {e}")
            return False
    
    async def delete_by_tag(self, tag: str) -> int:
        """Delete all entries with a specific tag."""
        redis = await self._get_redis()
        if not redis:
            return 0
        
        try:
            tag_key = f"{self.prefix}tag:{tag}"
            keys = await redis.smembers(tag_key)
            
            count = 0
            for key in keys:
                key_str = key.decode() if isinstance(key, bytes) else key
                if await self.delete(key_str):
                    count += 1
            
            await redis.delete(tag_key)
            return count
        except Exception as e:
            logger.error(f"Redis delete_by_tag error: {e}")
            return 0
    
    async def clear(self, pattern: str = "*") -> int:
        """Clear cache entries matching pattern."""
        redis = await self._get_redis()
        if not redis:
            return 0
        
        try:
            full_pattern = f"{self.prefix}{pattern}"
            keys = []
            
            async for key in redis.scan_iter(match=full_pattern):
                keys.append(key)
            
            if keys:
                return await redis.delete(*keys)
            return 0
        except Exception as e:
            logger.error(f"Redis clear error: {e}")
            return 0
    
    async def exists(self, key: str) -> bool:
        """Check if key exists."""
        redis = await self._get_redis()
        if not redis:
            return False
        
        try:
            return bool(await redis.exists(self._make_key(key)))
        except:
            return False
    
    async def ttl(self, key: str) -> int:
        """Get TTL of a key in seconds."""
        redis = await self._get_redis()
        if not redis:
            return -1
        
        try:
            return await redis.ttl(self._make_key(key))
        except:
            return -1
    
    def get_stats(self) -> CacheStats:
        return self._stats


# ═══════════════════════════════════════════════════════════════════════════════
# HYBRID CACHE (L1 Memory + L2 Redis)
# ═══════════════════════════════════════════════════════════════════════════════

class HybridCache:
    """
    Cache hybride à deux niveaux.
    
    L1: In-memory (fast, limited size)
    L2: Redis (slower, unlimited)
    
    Read: L1 -> L2 -> miss
    Write: L1 + L2
    """
    
    def __init__(
        self,
        redis_url: str = "redis://localhost:6379",
        l1_max_size: int = 500,
        l1_ttl: int = 60,
        l2_ttl: int = 300
    ):
        self.l1 = MemoryCache(max_size=l1_max_size, default_ttl=l1_ttl)
        self.l2 = RedisCache(redis_url=redis_url, default_ttl=l2_ttl)
        self.l1_ttl = l1_ttl
        self.l2_ttl = l2_ttl
    
    async def get(self, key: str) -> Optional[Any]:
        """Get from L1, fallback to L2."""
        # Try L1
        value = await self.l1.get(key)
        if value is not None:
            return value
        
        # Try L2
        value = await self.l2.get(key)
        if value is not None:
            # Populate L1
            await self.l1.set(key, value, ttl=self.l1_ttl)
            return value
        
        return None
    
    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        tags: Optional[List[str]] = None
    ) -> None:
        """Set in both L1 and L2."""
        l1_ttl = min(ttl or self.l1_ttl, self.l1_ttl)
        l2_ttl = ttl or self.l2_ttl
        
        await asyncio.gather(
            self.l1.set(key, value, ttl=l1_ttl, tags=tags),
            self.l2.set(key, value, ttl=l2_ttl, tags=tags)
        )
    
    async def delete(self, key: str) -> bool:
        """Delete from both levels."""
        results = await asyncio.gather(
            self.l1.delete(key),
            self.l2.delete(key)
        )
        return any(results)
    
    async def delete_by_tag(self, tag: str) -> int:
        """Delete by tag from both levels."""
        results = await asyncio.gather(
            self.l1.delete_by_tag(tag),
            self.l2.delete_by_tag(tag)
        )
        return sum(results)
    
    async def clear(self) -> None:
        """Clear both levels."""
        await asyncio.gather(
            self.l1.clear(),
            self.l2.clear()
        )
    
    def get_stats(self) -> Dict[str, CacheStats]:
        return {
            "l1": self.l1.get_stats(),
            "l2": self.l2.get_stats()
        }


# ═══════════════════════════════════════════════════════════════════════════════
# CACHE MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class CacheManager:
    """
    Gestionnaire de cache unifié.
    
    Provides a simple interface for caching with
    configurable backend.
    """
    
    def __init__(
        self,
        backend: CacheBackend = CacheBackend.MEMORY,
        redis_url: Optional[str] = None,
        **kwargs
    ):
        self.backend_type = backend
        
        if backend == CacheBackend.MEMORY:
            self._cache = MemoryCache(**kwargs)
        elif backend == CacheBackend.REDIS:
            self._cache = RedisCache(redis_url=redis_url or "redis://localhost:6379", **kwargs)
        else:  # HYBRID
            self._cache = HybridCache(redis_url=redis_url or "redis://localhost:6379", **kwargs)
        
        logger.info(f"✅ Cache initialized: {backend.value}")
    
    async def get(self, key: str) -> Optional[Any]:
        return await self._cache.get(key)
    
    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        tags: Optional[List[str]] = None
    ) -> None:
        await self._cache.set(key, value, ttl, tags)
    
    async def delete(self, key: str) -> bool:
        return await self._cache.delete(key)
    
    async def delete_by_tag(self, tag: str) -> int:
        return await self._cache.delete_by_tag(tag)
    
    async def clear(self) -> None:
        await self._cache.clear()
    
    async def get_or_set(
        self,
        key: str,
        factory: Callable,
        ttl: Optional[int] = None,
        tags: Optional[List[str]] = None
    ) -> Any:
        """Get from cache or compute and cache."""
        value = await self.get(key)
        if value is not None:
            return value
        
        # Compute value
        if asyncio.iscoroutinefunction(factory):
            value = await factory()
        else:
            value = factory()
        
        await self.set(key, value, ttl, tags)
        return value
    
    def get_stats(self) -> Any:
        return self._cache.get_stats()


# Singleton
_cache_manager: Optional[CacheManager] = None


def get_cache_manager() -> CacheManager:
    global _cache_manager
    if _cache_manager is None:
        _cache_manager = CacheManager()
    return _cache_manager


def init_cache(
    backend: CacheBackend = CacheBackend.MEMORY,
    redis_url: Optional[str] = None,
    **kwargs
) -> CacheManager:
    global _cache_manager
    _cache_manager = CacheManager(backend, redis_url, **kwargs)
    return _cache_manager


# ═══════════════════════════════════════════════════════════════════════════════
# DECORATORS
# ═══════════════════════════════════════════════════════════════════════════════

def cached(
    ttl: int = 300,
    key_prefix: str = "",
    tags: Optional[List[str]] = None,
    key_builder: Optional[Callable] = None
):
    """
    Decorator to cache function results.
    
    Usage:
        @cached(ttl=60, key_prefix="user")
        async def get_user(user_id: str):
            ...
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            cache = get_cache_manager()
            
            # Build cache key
            if key_builder:
                key = key_builder(*args, **kwargs)
            else:
                # Default: function name + args hash
                args_str = f"{args}:{kwargs}"
                args_hash = hashlib.md5(args_str.encode()).hexdigest()[:8]
                key = f"{key_prefix}:{func.__name__}:{args_hash}"
            
            # Try cache
            cached_value = await cache.get(key)
            if cached_value is not None:
                return cached_value
            
            # Call function
            result = await func(*args, **kwargs)
            
            # Cache result
            await cache.set(key, result, ttl=ttl, tags=tags)
            
            return result
        
        # Add cache control methods
        wrapper.cache_clear = lambda: get_cache_manager().delete_by_tag(key_prefix)
        
        return wrapper
    return decorator


def invalidate_cache(*tags: str):
    """
    Decorator to invalidate cache tags after function execution.
    
    Usage:
        @invalidate_cache("users", "profiles")
        async def update_user(user_id: str, data: dict):
            ...
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            result = await func(*args, **kwargs)
            
            # Invalidate tags
            cache = get_cache_manager()
            for tag in tags:
                await cache.delete_by_tag(tag)
            
            return result
        return wrapper
    return decorator


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    "CacheBackend",
    "SerializationType",
    
    # Data Classes
    "CacheEntry",
    "CacheStats",
    
    # Caches
    "MemoryCache",
    "RedisCache",
    "HybridCache",
    "CacheManager",
    
    # Functions
    "get_cache_manager",
    "init_cache",
    
    # Decorators
    "cached",
    "invalidate_cache"
]
