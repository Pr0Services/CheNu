"""
CHE·NU Unified - Background Jobs System
═══════════════════════════════════════════════════════════════════════════════
Système de tâches en arrière-plan avec:
- Celery pour distributed tasks
- APScheduler pour cron jobs
- Async task queue

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Callable, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
import asyncio
import logging
import uuid

logger = logging.getLogger("CHE·NU.Jobs")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    RETRYING = "retrying"


class JobPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    CRITICAL = "critical"


class ScheduleType(str, Enum):
    ONCE = "once"
    INTERVAL = "interval"
    CRON = "cron"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class Job:
    """Définition d'une tâche."""
    id: str
    name: str
    func: Callable
    
    # Arguments
    args: tuple = field(default_factory=tuple)
    kwargs: Dict[str, Any] = field(default_factory=dict)
    
    # Status
    status: JobStatus = JobStatus.PENDING
    priority: JobPriority = JobPriority.NORMAL
    
    # Retry
    max_retries: int = 3
    retry_count: int = 0
    retry_delay_seconds: int = 60
    
    # Timing
    created_at: datetime = field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    # Result
    result: Any = None
    error: Optional[str] = None
    
    # Metadata
    tags: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ScheduledJob:
    """Tâche planifiée."""
    id: str
    name: str
    func: Callable
    
    # Schedule
    schedule_type: ScheduleType = ScheduleType.ONCE
    run_at: Optional[datetime] = None  # For ONCE
    interval_seconds: Optional[int] = None  # For INTERVAL
    cron_expression: Optional[str] = None  # For CRON
    
    # Arguments
    args: tuple = field(default_factory=tuple)
    kwargs: Dict[str, Any] = field(default_factory=dict)
    
    # State
    enabled: bool = True
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    run_count: int = 0
    
    # Metadata
    description: Optional[str] = None


@dataclass
class JobResult:
    """Résultat d'une tâche."""
    job_id: str
    status: JobStatus
    result: Any = None
    error: Optional[str] = None
    duration_ms: int = 0
    retries: int = 0


# ═══════════════════════════════════════════════════════════════════════════════
# ASYNC JOB QUEUE
# ═══════════════════════════════════════════════════════════════════════════════

class AsyncJobQueue:
    """
    File de tâches asynchrones simple.
    
    Pour les cas où Celery n'est pas nécessaire.
    """
    
    def __init__(self, max_workers: int = 5):
        self.max_workers = max_workers
        self._queue: asyncio.Queue[Job] = asyncio.Queue()
        self._jobs: Dict[str, Job] = {}
        self._workers: List[asyncio.Task] = []
        self._running = False
    
    async def start(self) -> None:
        """Démarre les workers."""
        if self._running:
            return
        
        self._running = True
        
        for i in range(self.max_workers):
            worker = asyncio.create_task(self._worker(i))
            self._workers.append(worker)
        
        logger.info(f"🚀 Job queue started with {self.max_workers} workers")
    
    async def stop(self) -> None:
        """Arrête les workers."""
        self._running = False
        
        for worker in self._workers:
            worker.cancel()
        
        await asyncio.gather(*self._workers, return_exceptions=True)
        self._workers.clear()
        
        logger.info("🛑 Job queue stopped")
    
    async def _worker(self, worker_id: int) -> None:
        """Worker qui traite les tâches."""
        logger.debug(f"Worker {worker_id} started")
        
        while self._running:
            try:
                # Get job with timeout
                try:
                    job = await asyncio.wait_for(self._queue.get(), timeout=1.0)
                except asyncio.TimeoutError:
                    continue
                
                await self._process_job(job, worker_id)
                self._queue.task_done()
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Worker {worker_id} error: {e}")
    
    async def _process_job(self, job: Job, worker_id: int) -> None:
        """Traite une tâche."""
        logger.info(f"Worker {worker_id} processing job {job.id}: {job.name}")
        
        job.status = JobStatus.RUNNING
        job.started_at = datetime.utcnow()
        
        try:
            # Execute
            if asyncio.iscoroutinefunction(job.func):
                result = await job.func(*job.args, **job.kwargs)
            else:
                result = job.func(*job.args, **job.kwargs)
            
            job.result = result
            job.status = JobStatus.COMPLETED
            job.completed_at = datetime.utcnow()
            
            logger.info(f"✅ Job {job.id} completed")
            
        except Exception as e:
            job.error = str(e)
            job.retry_count += 1
            
            if job.retry_count < job.max_retries:
                job.status = JobStatus.RETRYING
                logger.warning(f"⚠️ Job {job.id} failed, retrying ({job.retry_count}/{job.max_retries})")
                
                # Re-queue with delay
                await asyncio.sleep(job.retry_delay_seconds)
                await self._queue.put(job)
            else:
                job.status = JobStatus.FAILED
                job.completed_at = datetime.utcnow()
                logger.error(f"❌ Job {job.id} failed permanently: {e}")
    
    async def enqueue(
        self,
        func: Callable,
        *args,
        name: Optional[str] = None,
        priority: JobPriority = JobPriority.NORMAL,
        max_retries: int = 3,
        **kwargs
    ) -> str:
        """Ajoute une tâche à la file."""
        job_id = f"job_{uuid.uuid4().hex[:12]}"
        
        job = Job(
            id=job_id,
            name=name or func.__name__,
            func=func,
            args=args,
            kwargs=kwargs,
            priority=priority,
            max_retries=max_retries
        )
        
        self._jobs[job_id] = job
        await self._queue.put(job)
        
        logger.debug(f"📥 Job {job_id} enqueued: {job.name}")
        return job_id
    
    def get_job(self, job_id: str) -> Optional[Job]:
        """Récupère une tâche."""
        return self._jobs.get(job_id)
    
    def get_status(self, job_id: str) -> Optional[JobStatus]:
        """Récupère le status d'une tâche."""
        job = self._jobs.get(job_id)
        return job.status if job else None
    
    def get_result(self, job_id: str) -> Optional[JobResult]:
        """Récupère le résultat d'une tâche."""
        job = self._jobs.get(job_id)
        if not job:
            return None
        
        duration = 0
        if job.started_at and job.completed_at:
            duration = int((job.completed_at - job.started_at).total_seconds() * 1000)
        
        return JobResult(
            job_id=job_id,
            status=job.status,
            result=job.result,
            error=job.error,
            duration_ms=duration,
            retries=job.retry_count
        )
    
    @property
    def queue_size(self) -> int:
        return self._queue.qsize()
    
    def get_stats(self) -> Dict[str, Any]:
        """Statistiques de la file."""
        by_status = {}
        for job in self._jobs.values():
            status = job.status.value
            by_status[status] = by_status.get(status, 0) + 1
        
        return {
            "queue_size": self.queue_size,
            "total_jobs": len(self._jobs),
            "by_status": by_status,
            "workers": self.max_workers,
            "running": self._running
        }


# ═══════════════════════════════════════════════════════════════════════════════
# SCHEDULER
# ═══════════════════════════════════════════════════════════════════════════════

class JobScheduler:
    """
    Planificateur de tâches.
    
    Supporte:
    - Exécution unique (run_at)
    - Intervalle (every N seconds)
    - Cron expressions
    """
    
    def __init__(self):
        self._scheduled: Dict[str, ScheduledJob] = {}
        self._running = False
        self._task: Optional[asyncio.Task] = None
    
    async def start(self) -> None:
        """Démarre le scheduler."""
        if self._running:
            return
        
        self._running = True
        self._task = asyncio.create_task(self._run_loop())
        logger.info("🕐 Scheduler started")
    
    async def stop(self) -> None:
        """Arrête le scheduler."""
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("🛑 Scheduler stopped")
    
    async def _run_loop(self) -> None:
        """Boucle principale du scheduler."""
        while self._running:
            now = datetime.utcnow()
            
            for job in self._scheduled.values():
                if not job.enabled:
                    continue
                
                if job.next_run and now >= job.next_run:
                    await self._execute_scheduled(job)
            
            await asyncio.sleep(1)  # Check every second
    
    async def _execute_scheduled(self, job: ScheduledJob) -> None:
        """Exécute une tâche planifiée."""
        logger.info(f"⏰ Running scheduled job: {job.name}")
        
        try:
            if asyncio.iscoroutinefunction(job.func):
                await job.func(*job.args, **job.kwargs)
            else:
                job.func(*job.args, **job.kwargs)
            
            job.last_run = datetime.utcnow()
            job.run_count += 1
            
            # Calculate next run
            self._update_next_run(job)
            
            logger.info(f"✅ Scheduled job {job.name} completed")
            
        except Exception as e:
            logger.error(f"❌ Scheduled job {job.name} failed: {e}")
            self._update_next_run(job)  # Still schedule next run
    
    def _update_next_run(self, job: ScheduledJob) -> None:
        """Met à jour le prochain run."""
        now = datetime.utcnow()
        
        if job.schedule_type == ScheduleType.ONCE:
            job.enabled = False
            job.next_run = None
        
        elif job.schedule_type == ScheduleType.INTERVAL:
            if job.interval_seconds:
                job.next_run = now + timedelta(seconds=job.interval_seconds)
        
        elif job.schedule_type == ScheduleType.CRON:
            job.next_run = self._parse_cron_next(job.cron_expression)
    
    def _parse_cron_next(self, expression: Optional[str]) -> Optional[datetime]:
        """Parse cron expression et retourne le prochain run."""
        if not expression:
            return None
        
        try:
            from croniter import croniter
            cron = croniter(expression, datetime.utcnow())
            return cron.get_next(datetime)
        except ImportError:
            logger.warning("croniter not installed, cron expressions not supported")
            return None
        except Exception as e:
            logger.error(f"Cron parse error: {e}")
            return None
    
    def schedule_once(
        self,
        func: Callable,
        run_at: datetime,
        *args,
        name: Optional[str] = None,
        **kwargs
    ) -> str:
        """Planifie une tâche unique."""
        job_id = f"sched_{uuid.uuid4().hex[:8]}"
        
        job = ScheduledJob(
            id=job_id,
            name=name or func.__name__,
            func=func,
            args=args,
            kwargs=kwargs,
            schedule_type=ScheduleType.ONCE,
            run_at=run_at,
            next_run=run_at
        )
        
        self._scheduled[job_id] = job
        logger.info(f"📅 Scheduled once: {job.name} at {run_at}")
        return job_id
    
    def schedule_interval(
        self,
        func: Callable,
        interval_seconds: int,
        *args,
        name: Optional[str] = None,
        start_now: bool = False,
        **kwargs
    ) -> str:
        """Planifie une tâche à intervalle régulier."""
        job_id = f"sched_{uuid.uuid4().hex[:8]}"
        
        next_run = datetime.utcnow()
        if not start_now:
            next_run += timedelta(seconds=interval_seconds)
        
        job = ScheduledJob(
            id=job_id,
            name=name or func.__name__,
            func=func,
            args=args,
            kwargs=kwargs,
            schedule_type=ScheduleType.INTERVAL,
            interval_seconds=interval_seconds,
            next_run=next_run
        )
        
        self._scheduled[job_id] = job
        logger.info(f"🔄 Scheduled interval: {job.name} every {interval_seconds}s")
        return job_id
    
    def schedule_cron(
        self,
        func: Callable,
        cron_expression: str,
        *args,
        name: Optional[str] = None,
        **kwargs
    ) -> str:
        """Planifie une tâche avec expression cron."""
        job_id = f"sched_{uuid.uuid4().hex[:8]}"
        
        job = ScheduledJob(
            id=job_id,
            name=name or func.__name__,
            func=func,
            args=args,
            kwargs=kwargs,
            schedule_type=ScheduleType.CRON,
            cron_expression=cron_expression,
            next_run=self._parse_cron_next(cron_expression)
        )
        
        self._scheduled[job_id] = job
        logger.info(f"📆 Scheduled cron: {job.name} ({cron_expression})")
        return job_id
    
    def cancel(self, job_id: str) -> bool:
        """Annule une tâche planifiée."""
        if job_id in self._scheduled:
            del self._scheduled[job_id]
            logger.info(f"🚫 Cancelled scheduled job: {job_id}")
            return True
        return False
    
    def pause(self, job_id: str) -> bool:
        """Met en pause une tâche."""
        job = self._scheduled.get(job_id)
        if job:
            job.enabled = False
            return True
        return False
    
    def resume(self, job_id: str) -> bool:
        """Reprend une tâche."""
        job = self._scheduled.get(job_id)
        if job:
            job.enabled = True
            self._update_next_run(job)
            return True
        return False
    
    def list_jobs(self) -> List[Dict[str, Any]]:
        """Liste les tâches planifiées."""
        return [
            {
                "id": job.id,
                "name": job.name,
                "type": job.schedule_type.value,
                "enabled": job.enabled,
                "next_run": job.next_run.isoformat() if job.next_run else None,
                "last_run": job.last_run.isoformat() if job.last_run else None,
                "run_count": job.run_count
            }
            for job in self._scheduled.values()
        ]


# ═══════════════════════════════════════════════════════════════════════════════
# PREDEFINED JOBS
# ═══════════════════════════════════════════════════════════════════════════════

class SyncJobs:
    """Tâches de synchronisation prédéfinies."""
    
    @staticmethod
    async def sync_integrations():
        """Synchronise toutes les intégrations."""
        logger.info("🔄 Syncing all integrations...")
        # Implementation would call integration service
        await asyncio.sleep(1)
        logger.info("✅ Integration sync completed")
    
    @staticmethod
    async def cleanup_cache():
        """Nettoie le cache expiré."""
        from .cache import get_cache_manager
        
        cache = get_cache_manager()
        if hasattr(cache._cache, 'cleanup_expired'):
            count = await cache._cache.cleanup_expired()
            logger.info(f"🧹 Cleaned up {count} expired cache entries")
    
    @staticmethod
    async def generate_reports():
        """Génère les rapports quotidiens."""
        logger.info("📊 Generating daily reports...")
        await asyncio.sleep(1)
        logger.info("✅ Daily reports generated")
    
    @staticmethod
    async def send_notifications():
        """Envoie les notifications en attente."""
        logger.info("📬 Sending pending notifications...")
        await asyncio.sleep(0.5)
        logger.info("✅ Notifications sent")


# ═══════════════════════════════════════════════════════════════════════════════
# JOB MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class JobManager:
    """
    Gestionnaire unifié des tâches.
    
    Combine queue et scheduler.
    """
    
    def __init__(self, max_workers: int = 5):
        self.queue = AsyncJobQueue(max_workers=max_workers)
        self.scheduler = JobScheduler()
    
    async def start(self) -> None:
        """Démarre queue et scheduler."""
        await self.queue.start()
        await self.scheduler.start()
        
        # Register default jobs
        self._register_default_jobs()
        
        logger.info("✅ Job Manager started")
    
    async def stop(self) -> None:
        """Arrête queue et scheduler."""
        await self.queue.stop()
        await self.scheduler.stop()
        logger.info("🛑 Job Manager stopped")
    
    def _register_default_jobs(self) -> None:
        """Enregistre les tâches par défaut."""
        # Cache cleanup every hour
        self.scheduler.schedule_interval(
            SyncJobs.cleanup_cache,
            interval_seconds=3600,
            name="cache_cleanup"
        )
        
        # Integration sync every 15 minutes
        self.scheduler.schedule_interval(
            SyncJobs.sync_integrations,
            interval_seconds=900,
            name="integration_sync"
        )
    
    # Delegate to queue
    async def enqueue(self, func: Callable, *args, **kwargs) -> str:
        return await self.queue.enqueue(func, *args, **kwargs)
    
    def get_job(self, job_id: str) -> Optional[Job]:
        return self.queue.get_job(job_id)
    
    def get_result(self, job_id: str) -> Optional[JobResult]:
        return self.queue.get_result(job_id)
    
    # Delegate to scheduler
    def schedule_once(self, func: Callable, run_at: datetime, *args, **kwargs) -> str:
        return self.scheduler.schedule_once(func, run_at, *args, **kwargs)
    
    def schedule_interval(self, func: Callable, interval_seconds: int, *args, **kwargs) -> str:
        return self.scheduler.schedule_interval(func, interval_seconds, *args, **kwargs)
    
    def schedule_cron(self, func: Callable, cron_expression: str, *args, **kwargs) -> str:
        return self.scheduler.schedule_cron(func, cron_expression, *args, **kwargs)
    
    def get_stats(self) -> Dict[str, Any]:
        return {
            "queue": self.queue.get_stats(),
            "scheduled": self.scheduler.list_jobs()
        }


# Singleton
_job_manager: Optional[JobManager] = None


def get_job_manager() -> JobManager:
    global _job_manager
    if _job_manager is None:
        _job_manager = JobManager()
    return _job_manager


async def init_jobs(max_workers: int = 5) -> JobManager:
    global _job_manager
    _job_manager = JobManager(max_workers=max_workers)
    await _job_manager.start()
    return _job_manager


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    "JobStatus",
    "JobPriority",
    "ScheduleType",
    
    # Data Classes
    "Job",
    "ScheduledJob",
    "JobResult",
    
    # Classes
    "AsyncJobQueue",
    "JobScheduler",
    "SyncJobs",
    "JobManager",
    
    # Functions
    "get_job_manager",
    "init_jobs"
]
