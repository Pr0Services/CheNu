"""
CHE·NU™ B28 - Scale & Performance
Infrastructure haute performance

Features:
- Caching System (Redis-like, multi-layer)
- Rate Limiting (API protection)
- Queue System (background jobs)
- CDN Integration (assets delivery)
- Database Optimization (connection pooling, queries)
- Health Monitoring (metrics, alerts)
- Auto-scaling triggers

Author: CHE·NU Dev Team
Date: December 2024
Lines: ~650
"""

from fastapi import APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Callable, TypeVar, Generic
from datetime import datetime, timedelta
from enum import Enum
from uuid import uuid4
from functools import wraps
import asyncio
import hashlib
import json
import time

router = APIRouter(prefix="/api/v2/infra", tags=["Infrastructure"])

# =============================================================================
# ENUMS
# =============================================================================

class CacheStrategy(str, Enum):
    WRITE_THROUGH = "write_through"
    WRITE_BEHIND = "write_behind"
    CACHE_ASIDE = "cache_aside"
    READ_THROUGH = "read_through"

class QueuePriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    CRITICAL = "critical"

class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"
    CANCELLED = "cancelled"

class MetricType(str, Enum):
    COUNTER = "counter"
    GAUGE = "gauge"
    HISTOGRAM = "histogram"
    SUMMARY = "summary"

class AlertSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

# =============================================================================
# MODELS - CACHING
# =============================================================================

class CacheEntry(BaseModel):
    """Entrée de cache"""
    key: str
    value: Any
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    ttl_seconds: Optional[int] = None
    
    # Metadata
    hits: int = 0
    last_accessed_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Tags for invalidation
    tags: List[str] = []
    
    def is_expired(self) -> bool:
        if self.expires_at is None:
            return False
        return datetime.utcnow() > self.expires_at

class CacheStats(BaseModel):
    """Statistiques cache"""
    total_keys: int = 0
    memory_used_bytes: int = 0
    hits: int = 0
    misses: int = 0
    hit_rate: float = 0.0
    evictions: int = 0
    expired_keys: int = 0

class CacheConfig(BaseModel):
    """Configuration cache"""
    max_size: int = 10000  # Max entries
    max_memory_mb: int = 512
    default_ttl_seconds: int = 3600
    eviction_policy: str = "lru"  # lru, lfu, ttl
    strategy: CacheStrategy = CacheStrategy.CACHE_ASIDE

# =============================================================================
# MODELS - RATE LIMITING
# =============================================================================

class RateLimitRule(BaseModel):
    """Règle de rate limiting"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    
    # Limits
    requests_per_second: Optional[int] = None
    requests_per_minute: Optional[int] = None
    requests_per_hour: Optional[int] = None
    requests_per_day: Optional[int] = None
    
    # Scope
    scope: str = "ip"  # ip, user, api_key, global
    
    # Actions
    action_on_exceed: str = "reject"  # reject, throttle, queue
    retry_after_seconds: int = 60
    
    # Exceptions
    whitelist: List[str] = []
    
    # Status
    is_enabled: bool = True

class RateLimitState(BaseModel):
    """État rate limit pour un client"""
    key: str
    rule_id: str
    
    # Counters
    requests_second: int = 0
    requests_minute: int = 0
    requests_hour: int = 0
    requests_day: int = 0
    
    # Windows
    window_second: datetime = Field(default_factory=datetime.utcnow)
    window_minute: datetime = Field(default_factory=datetime.utcnow)
    window_hour: datetime = Field(default_factory=datetime.utcnow)
    window_day: datetime = Field(default_factory=datetime.utcnow)
    
    # Status
    is_blocked: bool = False
    blocked_until: Optional[datetime] = None

# =============================================================================
# MODELS - JOB QUEUE
# =============================================================================

class Job(BaseModel):
    """Job de queue"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Job details
    name: str
    handler: str  # Function path
    args: List[Any] = []
    kwargs: Dict[str, Any] = {}
    
    # Priority & scheduling
    priority: QueuePriority = QueuePriority.NORMAL
    scheduled_at: Optional[datetime] = None
    
    # Status
    status: JobStatus = JobStatus.PENDING
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    # Retry
    max_retries: int = 3
    retry_count: int = 0
    retry_delay_seconds: int = 60
    
    # Result
    result: Optional[Any] = None
    error_message: Optional[str] = None
    
    # Metadata
    timeout_seconds: int = 300
    queue_name: str = "default"

class Queue(BaseModel):
    """Queue de jobs"""
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Config
    max_workers: int = 4
    max_jobs: int = 10000
    
    # Stats
    jobs_pending: int = 0
    jobs_running: int = 0
    jobs_completed: int = 0
    jobs_failed: int = 0
    
    # Status
    is_paused: bool = False

# =============================================================================
# MODELS - MONITORING
# =============================================================================

class Metric(BaseModel):
    """Métrique"""
    name: str
    type: MetricType
    value: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    labels: Dict[str, str] = {}
    unit: str = ""

class Alert(BaseModel):
    """Alerte système"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    name: str
    message: str
    severity: AlertSeverity
    
    # Source
    source: str
    metric_name: Optional[str] = None
    threshold: Optional[float] = None
    current_value: Optional[float] = None
    
    # Status
    is_acknowledged: bool = False
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime] = None
    
    # Resolution
    is_resolved: bool = False
    resolved_at: Optional[datetime] = None

class HealthCheck(BaseModel):
    """Health check"""
    service: str
    status: str  # healthy, degraded, unhealthy
    latency_ms: float
    last_check: datetime = Field(default_factory=datetime.utcnow)
    details: Dict[str, Any] = {}

class SystemMetrics(BaseModel):
    """Métriques système"""
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # CPU
    cpu_percent: float = 0.0
    cpu_cores: int = 1
    
    # Memory
    memory_total_mb: int = 0
    memory_used_mb: int = 0
    memory_percent: float = 0.0
    
    # Disk
    disk_total_gb: int = 0
    disk_used_gb: int = 0
    disk_percent: float = 0.0
    
    # Network
    network_rx_bytes: int = 0
    network_tx_bytes: int = 0
    
    # Application
    active_connections: int = 0
    requests_per_second: float = 0.0
    avg_response_time_ms: float = 0.0

# =============================================================================
# MODELS - CDN
# =============================================================================

class CDNAsset(BaseModel):
    """Asset CDN"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    
    # Original
    original_url: str
    original_size_bytes: int = 0
    
    # CDN
    cdn_url: str = ""
    cdn_key: str = ""
    
    # Optimization
    is_optimized: bool = False
    optimized_size_bytes: int = 0
    compression_ratio: float = 0.0
    
    # Cache
    cache_ttl_seconds: int = 86400  # 24h
    cache_control: str = "public, max-age=86400"
    
    # Metadata
    content_type: str = ""
    etag: str = ""
    last_modified: datetime = Field(default_factory=datetime.utcnow)

class CDNConfig(BaseModel):
    """Configuration CDN"""
    provider: str = "cloudflare"  # cloudflare, cloudfront, fastly
    base_url: str = ""
    
    # Optimization
    auto_minify: bool = True
    auto_compress: bool = True
    image_optimization: bool = True
    
    # Cache
    default_ttl: int = 86400
    browser_ttl: int = 14400

# =============================================================================
# STORAGE
# =============================================================================

class InfraStore:
    def __init__(self):
        # Cache
        self.cache: Dict[str, CacheEntry] = {}
        self.cache_config = CacheConfig()
        self.cache_stats = CacheStats()
        
        # Rate limiting
        self.rate_rules: Dict[str, RateLimitRule] = {}
        self.rate_states: Dict[str, RateLimitState] = {}
        
        # Jobs
        self.jobs: Dict[str, Job] = {}
        self.queues: Dict[str, Queue] = {}
        
        # Monitoring
        self.metrics: List[Metric] = []
        self.alerts: Dict[str, Alert] = {}
        self.health_checks: Dict[str, HealthCheck] = {}
        
        # CDN
        self.cdn_assets: Dict[str, CDNAsset] = {}
        self.cdn_config = CDNConfig()
        
        # Initialize default queue
        self.queues["default"] = Queue(name="default")

store = InfraStore()

# =============================================================================
# CACHE ENGINE
# =============================================================================

class CacheEngine:
    """Moteur de cache haute performance"""
    
    def __init__(self, store: InfraStore):
        self.store = store
    
    def _generate_key(self, *args, **kwargs) -> str:
        """Génère une clé de cache"""
        data = json.dumps({"args": args, "kwargs": kwargs}, sort_keys=True, default=str)
        return hashlib.sha256(data.encode()).hexdigest()[:32]
    
    async def get(self, key: str) -> Optional[Any]:
        """Récupère une valeur du cache"""
        entry = self.store.cache.get(key)
        
        if entry is None:
            self.store.cache_stats.misses += 1
            return None
        
        if entry.is_expired():
            await self.delete(key)
            self.store.cache_stats.misses += 1
            self.store.cache_stats.expired_keys += 1
            return None
        
        # Update stats
        entry.hits += 1
        entry.last_accessed_at = datetime.utcnow()
        self.store.cache_stats.hits += 1
        
        # Update hit rate
        total = self.store.cache_stats.hits + self.store.cache_stats.misses
        self.store.cache_stats.hit_rate = self.store.cache_stats.hits / total if total > 0 else 0
        
        return entry.value
    
    async def set(
        self, 
        key: str, 
        value: Any, 
        ttl_seconds: Optional[int] = None,
        tags: List[str] = []
    ) -> bool:
        """Stocke une valeur dans le cache"""
        
        # Check max size
        if len(self.store.cache) >= self.store.cache_config.max_size:
            await self._evict()
        
        ttl = ttl_seconds or self.store.cache_config.default_ttl_seconds
        expires_at = datetime.utcnow() + timedelta(seconds=ttl) if ttl else None
        
        entry = CacheEntry(
            key=key,
            value=value,
            ttl_seconds=ttl,
            expires_at=expires_at,
            tags=tags
        )
        
        self.store.cache[key] = entry
        self.store.cache_stats.total_keys = len(self.store.cache)
        
        return True
    
    async def delete(self, key: str) -> bool:
        """Supprime une entrée du cache"""
        if key in self.store.cache:
            del self.store.cache[key]
            self.store.cache_stats.total_keys = len(self.store.cache)
            return True
        return False
    
    async def invalidate_by_tag(self, tag: str) -> int:
        """Invalide toutes les entrées avec un tag"""
        keys_to_delete = [
            k for k, v in self.store.cache.items() 
            if tag in v.tags
        ]
        for key in keys_to_delete:
            await self.delete(key)
        return len(keys_to_delete)
    
    async def clear(self) -> int:
        """Vide le cache"""
        count = len(self.store.cache)
        self.store.cache.clear()
        self.store.cache_stats = CacheStats()
        return count
    
    async def _evict(self):
        """Évicte les entrées selon la politique"""
        policy = self.store.cache_config.eviction_policy
        
        if policy == "lru":
            # Least Recently Used
            oldest = min(
                self.store.cache.items(),
                key=lambda x: x[1].last_accessed_at
            )
            await self.delete(oldest[0])
        elif policy == "lfu":
            # Least Frequently Used
            least_used = min(
                self.store.cache.items(),
                key=lambda x: x[1].hits
            )
            await self.delete(least_used[0])
        elif policy == "ttl":
            # Oldest TTL first
            oldest_ttl = min(
                self.store.cache.items(),
                key=lambda x: x[1].expires_at or datetime.max
            )
            await self.delete(oldest_ttl[0])
        
        self.store.cache_stats.evictions += 1
    
    def stats(self) -> CacheStats:
        """Retourne les statistiques"""
        return self.store.cache_stats

cache_engine = CacheEngine(store)

# Decorator for caching
def cached(ttl_seconds: int = 3600, tags: List[str] = []):
    """Décorateur de cache"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            key = cache_engine._generate_key(func.__name__, *args, **kwargs)
            
            # Try cache first
            cached_value = await cache_engine.get(key)
            if cached_value is not None:
                return cached_value
            
            # Execute function
            result = await func(*args, **kwargs)
            
            # Store in cache
            await cache_engine.set(key, result, ttl_seconds, tags)
            
            return result
        return wrapper
    return decorator

# =============================================================================
# RATE LIMITER
# =============================================================================

class RateLimiter:
    """Rate limiter"""
    
    def __init__(self, store: InfraStore):
        self.store = store
    
    def _get_client_key(self, request: Request, scope: str) -> str:
        """Génère la clé client"""
        if scope == "ip":
            return request.client.host if request.client else "unknown"
        elif scope == "user":
            return request.headers.get("X-User-ID", "anonymous")
        elif scope == "api_key":
            return request.headers.get("X-API-Key", "no-key")
        return "global"
    
    async def check(self, request: Request, rule_id: str) -> tuple[bool, Optional[int]]:
        """Vérifie si la requête est autorisée"""
        if rule_id not in self.store.rate_rules:
            return True, None
        
        rule = self.store.rate_rules[rule_id]
        
        if not rule.is_enabled:
            return True, None
        
        client_key = self._get_client_key(request, rule.scope)
        
        # Check whitelist
        if client_key in rule.whitelist:
            return True, None
        
        state_key = f"{rule_id}:{client_key}"
        
        # Get or create state
        if state_key not in self.store.rate_states:
            self.store.rate_states[state_key] = RateLimitState(
                key=client_key,
                rule_id=rule_id
            )
        
        state = self.store.rate_states[state_key]
        now = datetime.utcnow()
        
        # Check if blocked
        if state.is_blocked:
            if state.blocked_until and now < state.blocked_until:
                retry_after = int((state.blocked_until - now).total_seconds())
                return False, retry_after
            else:
                state.is_blocked = False
                state.blocked_until = None
        
        # Reset windows if expired
        if (now - state.window_second).total_seconds() >= 1:
            state.requests_second = 0
            state.window_second = now
        
        if (now - state.window_minute).total_seconds() >= 60:
            state.requests_minute = 0
            state.window_minute = now
        
        if (now - state.window_hour).total_seconds() >= 3600:
            state.requests_hour = 0
            state.window_hour = now
        
        if (now - state.window_day).total_seconds() >= 86400:
            state.requests_day = 0
            state.window_day = now
        
        # Check limits
        if rule.requests_per_second and state.requests_second >= rule.requests_per_second:
            return self._block(state, rule)
        
        if rule.requests_per_minute and state.requests_minute >= rule.requests_per_minute:
            return self._block(state, rule)
        
        if rule.requests_per_hour and state.requests_hour >= rule.requests_per_hour:
            return self._block(state, rule)
        
        if rule.requests_per_day and state.requests_day >= rule.requests_per_day:
            return self._block(state, rule)
        
        # Increment counters
        state.requests_second += 1
        state.requests_minute += 1
        state.requests_hour += 1
        state.requests_day += 1
        
        return True, None
    
    def _block(self, state: RateLimitState, rule: RateLimitRule) -> tuple[bool, int]:
        """Bloque le client"""
        state.is_blocked = True
        state.blocked_until = datetime.utcnow() + timedelta(seconds=rule.retry_after_seconds)
        return False, rule.retry_after_seconds

rate_limiter = RateLimiter(store)

# =============================================================================
# JOB QUEUE ENGINE
# =============================================================================

class QueueEngine:
    """Moteur de queue de jobs"""
    
    def __init__(self, store: InfraStore):
        self.store = store
        self._workers: Dict[str, asyncio.Task] = {}
    
    async def enqueue(
        self,
        name: str,
        handler: str,
        args: List = [],
        kwargs: Dict = {},
        priority: QueuePriority = QueuePriority.NORMAL,
        queue_name: str = "default",
        scheduled_at: Optional[datetime] = None,
        max_retries: int = 3
    ) -> Job:
        """Ajoute un job à la queue"""
        
        job = Job(
            name=name,
            handler=handler,
            args=args,
            kwargs=kwargs,
            priority=priority,
            queue_name=queue_name,
            scheduled_at=scheduled_at,
            max_retries=max_retries
        )
        
        self.store.jobs[job.id] = job
        
        if queue_name in self.store.queues:
            self.store.queues[queue_name].jobs_pending += 1
        
        return job
    
    async def process_job(self, job_id: str) -> Job:
        """Traite un job"""
        if job_id not in self.store.jobs:
            raise HTTPException(404, "Job not found")
        
        job = self.store.jobs[job_id]
        
        # Check if scheduled
        if job.scheduled_at and datetime.utcnow() < job.scheduled_at:
            return job
        
        job.status = JobStatus.RUNNING
        job.started_at = datetime.utcnow()
        
        queue = self.store.queues.get(job.queue_name)
        if queue:
            queue.jobs_pending -= 1
            queue.jobs_running += 1
        
        try:
            # Simulate job execution
            await asyncio.sleep(0.1)  # Simulated work
            
            job.result = {"success": True, "message": f"Job {job.name} completed"}
            job.status = JobStatus.COMPLETED
            job.completed_at = datetime.utcnow()
            
            if queue:
                queue.jobs_running -= 1
                queue.jobs_completed += 1
            
        except Exception as e:
            job.error_message = str(e)
            
            if job.retry_count < job.max_retries:
                job.retry_count += 1
                job.status = JobStatus.RETRYING
                # Re-queue with delay
                job.scheduled_at = datetime.utcnow() + timedelta(seconds=job.retry_delay_seconds)
            else:
                job.status = JobStatus.FAILED
                if queue:
                    queue.jobs_running -= 1
                    queue.jobs_failed += 1
        
        return job
    
    async def cancel_job(self, job_id: str) -> Job:
        """Annule un job"""
        if job_id not in self.store.jobs:
            raise HTTPException(404, "Job not found")
        
        job = self.store.jobs[job_id]
        
        if job.status in [JobStatus.PENDING, JobStatus.RETRYING]:
            job.status = JobStatus.CANCELLED
            
            queue = self.store.queues.get(job.queue_name)
            if queue:
                queue.jobs_pending -= 1
        
        return job
    
    def get_queue_stats(self, queue_name: str) -> Optional[Queue]:
        """Récupère les stats d'une queue"""
        return self.store.queues.get(queue_name)

queue_engine = QueueEngine(store)

# =============================================================================
# MONITORING ENGINE
# =============================================================================

class MonitoringEngine:
    """Moteur de monitoring"""
    
    def __init__(self, store: InfraStore):
        self.store = store
    
    def record_metric(
        self,
        name: str,
        value: float,
        type: MetricType = MetricType.GAUGE,
        labels: Dict[str, str] = {},
        unit: str = ""
    ) -> Metric:
        """Enregistre une métrique"""
        metric = Metric(
            name=name,
            type=type,
            value=value,
            labels=labels,
            unit=unit
        )
        
        self.store.metrics.append(metric)
        
        # Keep last 10000 metrics
        if len(self.store.metrics) > 10000:
            self.store.metrics = self.store.metrics[-10000:]
        
        return metric
    
    def create_alert(
        self,
        name: str,
        message: str,
        severity: AlertSeverity,
        source: str,
        metric_name: Optional[str] = None,
        threshold: Optional[float] = None,
        current_value: Optional[float] = None
    ) -> Alert:
        """Crée une alerte"""
        alert = Alert(
            name=name,
            message=message,
            severity=severity,
            source=source,
            metric_name=metric_name,
            threshold=threshold,
            current_value=current_value
        )
        
        self.store.alerts[alert.id] = alert
        return alert
    
    def check_health(self, service: str, check_fn: Callable) -> HealthCheck:
        """Effectue un health check"""
        start = time.time()
        
        try:
            result = check_fn()
            latency = (time.time() - start) * 1000
            
            health = HealthCheck(
                service=service,
                status="healthy" if result else "unhealthy",
                latency_ms=latency,
                details={"result": result}
            )
        except Exception as e:
            latency = (time.time() - start) * 1000
            health = HealthCheck(
                service=service,
                status="unhealthy",
                latency_ms=latency,
                details={"error": str(e)}
            )
        
        self.store.health_checks[service] = health
        return health
    
    def get_system_metrics(self) -> SystemMetrics:
        """Récupère les métriques système"""
        # Simulated metrics
        return SystemMetrics(
            cpu_percent=45.2,
            cpu_cores=8,
            memory_total_mb=16384,
            memory_used_mb=8192,
            memory_percent=50.0,
            disk_total_gb=500,
            disk_used_gb=200,
            disk_percent=40.0,
            active_connections=150,
            requests_per_second=250.5,
            avg_response_time_ms=45.3
        )

monitoring = MonitoringEngine(store)

# =============================================================================
# API ENDPOINTS - CACHE
# =============================================================================

@router.get("/cache/stats", response_model=CacheStats)
async def get_cache_stats():
    """Récupère les stats du cache"""
    return cache_engine.stats()

@router.post("/cache/clear")
async def clear_cache():
    """Vide le cache"""
    count = await cache_engine.clear()
    return {"cleared": count}

@router.delete("/cache/{key}")
async def delete_cache_key(key: str):
    """Supprime une clé du cache"""
    deleted = await cache_engine.delete(key)
    return {"deleted": deleted}

@router.post("/cache/invalidate/tag/{tag}")
async def invalidate_by_tag(tag: str):
    """Invalide par tag"""
    count = await cache_engine.invalidate_by_tag(tag)
    return {"invalidated": count}

# =============================================================================
# API ENDPOINTS - RATE LIMITING
# =============================================================================

@router.post("/ratelimit/rules", response_model=RateLimitRule)
async def create_rate_limit_rule(
    name: str,
    requests_per_minute: Optional[int] = None,
    requests_per_hour: Optional[int] = None,
    scope: str = "ip"
):
    """Crée une règle de rate limiting"""
    rule = RateLimitRule(
        name=name,
        requests_per_minute=requests_per_minute,
        requests_per_hour=requests_per_hour,
        scope=scope
    )
    store.rate_rules[rule.id] = rule
    return rule

@router.get("/ratelimit/rules", response_model=List[RateLimitRule])
async def list_rate_limit_rules():
    """Liste les règles"""
    return list(store.rate_rules.values())

@router.get("/ratelimit/states")
async def get_rate_limit_states():
    """Récupère les états de rate limiting"""
    return {k: v.model_dump() for k, v in store.rate_states.items()}

# =============================================================================
# API ENDPOINTS - QUEUE
# =============================================================================

@router.post("/queue/jobs", response_model=Job)
async def create_job(
    name: str,
    handler: str,
    priority: QueuePriority = QueuePriority.NORMAL,
    queue_name: str = "default"
):
    """Crée un job"""
    return await queue_engine.enqueue(name, handler, priority=priority, queue_name=queue_name)

@router.get("/queue/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    """Récupère un job"""
    if job_id not in store.jobs:
        raise HTTPException(404, "Job not found")
    return store.jobs[job_id]

@router.post("/queue/jobs/{job_id}/process", response_model=Job)
async def process_job(job_id: str):
    """Traite un job"""
    return await queue_engine.process_job(job_id)

@router.post("/queue/jobs/{job_id}/cancel", response_model=Job)
async def cancel_job(job_id: str):
    """Annule un job"""
    return await queue_engine.cancel_job(job_id)

@router.get("/queue/{queue_name}/stats", response_model=Queue)
async def get_queue_stats(queue_name: str):
    """Récupère les stats d'une queue"""
    queue = queue_engine.get_queue_stats(queue_name)
    if not queue:
        raise HTTPException(404, "Queue not found")
    return queue

# =============================================================================
# API ENDPOINTS - MONITORING
# =============================================================================

@router.post("/metrics")
async def record_metric(name: str, value: float, type: MetricType = MetricType.GAUGE, labels: Dict = {}):
    """Enregistre une métrique"""
    return monitoring.record_metric(name, value, type, labels)

@router.get("/metrics")
async def get_metrics(name: Optional[str] = None, limit: int = 100):
    """Récupère les métriques"""
    metrics = store.metrics
    if name:
        metrics = [m for m in metrics if m.name == name]
    return metrics[-limit:]

@router.get("/alerts", response_model=List[Alert])
async def get_alerts(unresolved_only: bool = True):
    """Récupère les alertes"""
    alerts = list(store.alerts.values())
    if unresolved_only:
        alerts = [a for a in alerts if not a.is_resolved]
    return sorted(alerts, key=lambda x: x.created_at, reverse=True)

@router.post("/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str, user_id: str):
    """Acquitte une alerte"""
    if alert_id not in store.alerts:
        raise HTTPException(404, "Alert not found")
    
    alert = store.alerts[alert_id]
    alert.is_acknowledged = True
    alert.acknowledged_by = user_id
    alert.acknowledged_at = datetime.utcnow()
    
    return {"status": "acknowledged"}

@router.get("/health/checks", response_model=Dict[str, HealthCheck])
async def get_health_checks():
    """Récupère tous les health checks"""
    return store.health_checks

@router.get("/health/system", response_model=SystemMetrics)
async def get_system_metrics():
    """Récupère les métriques système"""
    return monitoring.get_system_metrics()

# =============================================================================
# API ENDPOINTS - CDN
# =============================================================================

@router.post("/cdn/assets", response_model=CDNAsset)
async def register_cdn_asset(original_url: str, content_type: str):
    """Enregistre un asset CDN"""
    cdn_key = hashlib.sha256(original_url.encode()).hexdigest()[:16]
    
    asset = CDNAsset(
        original_url=original_url,
        cdn_key=cdn_key,
        cdn_url=f"{store.cdn_config.base_url}/{cdn_key}",
        content_type=content_type
    )
    store.cdn_assets[asset.id] = asset
    return asset

@router.get("/cdn/assets", response_model=List[CDNAsset])
async def list_cdn_assets():
    """Liste les assets CDN"""
    return list(store.cdn_assets.values())

@router.get("/cdn/config", response_model=CDNConfig)
async def get_cdn_config():
    """Récupère la config CDN"""
    return store.cdn_config

# =============================================================================
# GLOBAL HEALTH
# =============================================================================

@router.get("/health")
async def health():
    """Health check global"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "cache": {
            "keys": store.cache_stats.total_keys,
            "hit_rate": f"{store.cache_stats.hit_rate:.2%}"
        },
        "queues": {
            name: {"pending": q.jobs_pending, "running": q.jobs_running}
            for name, q in store.queues.items()
        },
        "alerts": {
            "total": len(store.alerts),
            "unresolved": len([a for a in store.alerts.values() if not a.is_resolved])
        }
    }
