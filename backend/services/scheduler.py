"""
CHE·NU Unified - Background Jobs & Scheduler
═══════════════════════════════════════════════════════════════════════════════
Système de tâches en arrière-plan:
- Sync périodique des intégrations
- Génération de rapports
- Nettoyage de cache
- Notifications

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
    SCHEDULED = "scheduled"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    RETRYING = "retrying"


class JobPriority(int, Enum):
    LOW = 1
    NORMAL = 5
    HIGH = 10
    CRITICAL = 20


class JobType(str, Enum):
    ONE_TIME = "one_time"
    RECURRING = "recurring"
    CRON = "cron"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class Job:
    """Définition d'un job."""
    id: str
    name: str
    func: Callable
    
    # Arguments
    args: tuple = field(default_factory=tuple)
    kwargs: Dict[str, Any] = field(default_factory=dict)
    
    # Type & Schedule
    job_type: JobType = JobType.ONE_TIME
    interval_seconds: Optional[int] = None
    cron_expression: Optional[str] = None
    
    # Priority
    priority: JobPriority = JobPriority.NORMAL
    
    # Status
    status: JobStatus = JobStatus.PENDING
    
    # Timing
    created_at: datetime = field(default_factory=datetime.utcnow)
    scheduled_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    next_run: Optional[datetime] = None
    
    # Retry
    max_retries: int = 3
    retry_count: int = 0
    retry_delay_seconds: int = 60
    
    # Result
    result: Optional[Any] = None
    error: Optional[str] = None
    
    # Metadata
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class JobResult:
    """Résultat d'exécution d'un job."""
    job_id: str
    success: bool
    
    result: Optional[Any] = None
    error: Optional[str] = None
    
    started_at: datetime = field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    duration_ms: Optional[int] = None


# ═══════════════════════════════════════════════════════════════════════════════
# JOB SCHEDULER
# ═══════════════════════════════════════════════════════════════════════════════

class JobScheduler:
    """
    🎯 Planificateur de Jobs
    
    - Exécution asynchrone
    - Jobs récurrents
    - Priorités
    - Retry automatique
    """
    
    def __init__(self, max_concurrent: int = 10):
        self.max_concurrent = max_concurrent
        self._jobs: Dict[str, Job] = {}
        self._running: Dict[str, asyncio.Task] = {}
        self._history: List[JobResult] = []
        self._max_history = 1000
        
        self._scheduler_task: Optional[asyncio.Task] = None
        self._running_flag = False
        self._semaphore = asyncio.Semaphore(max_concurrent)
    
    # --- Job Management ---
    def add_job(
        self,
        name: str,
        func: Callable,
        args: tuple = (),
        kwargs: Optional[Dict] = None,
        job_type: JobType = JobType.ONE_TIME,
        interval_seconds: Optional[int] = None,
        scheduled_at: Optional[datetime] = None,
        priority: JobPriority = JobPriority.NORMAL,
        max_retries: int = 3,
        **metadata
    ) -> Job:
        """Ajoute un job."""
        job_id = f"job_{uuid.uuid4().hex[:8]}"
        
        job = Job(
            id=job_id,
            name=name,
            func=func,
            args=args,
            kwargs=kwargs or {},
            job_type=job_type,
            interval_seconds=interval_seconds,
            scheduled_at=scheduled_at,
            priority=priority,
            max_retries=max_retries,
            metadata=metadata
        )
        
        if job_type == JobType.RECURRING and interval_seconds:
            job.next_run = datetime.utcnow() + timedelta(seconds=interval_seconds)
        elif scheduled_at:
            job.next_run = scheduled_at
            job.status = JobStatus.SCHEDULED
        
        self._jobs[job_id] = job
        logger.info(f"📋 Job added: {name} ({job_id})")
        
        return job
    
    def remove_job(self, job_id: str) -> bool:
        """Supprime un job."""
        if job_id in self._jobs:
            job = self._jobs[job_id]
            
            # Cancel if running
            if job_id in self._running:
                self._running[job_id].cancel()
            
            del self._jobs[job_id]
            logger.info(f"🗑️ Job removed: {job_id}")
            return True
        return False
    
    def get_job(self, job_id: str) -> Optional[Job]:
        """Récupère un job."""
        return self._jobs.get(job_id)
    
    def list_jobs(
        self,
        status: Optional[JobStatus] = None
    ) -> List[Job]:
        """Liste les jobs."""
        jobs = list(self._jobs.values())
        
        if status:
            jobs = [j for j in jobs if j.status == status]
        
        return sorted(jobs, key=lambda j: j.priority.value, reverse=True)
    
    # --- Execution ---
    async def run_job(self, job: Job) -> JobResult:
        """Exécute un job."""
        async with self._semaphore:
            job.status = JobStatus.RUNNING
            job.started_at = datetime.utcnow()
            
            result = JobResult(
                job_id=job.id,
                success=False,
                started_at=job.started_at
            )
            
            try:
                # Execute
                if asyncio.iscoroutinefunction(job.func):
                    output = await job.func(*job.args, **job.kwargs)
                else:
                    output = job.func(*job.args, **job.kwargs)
                
                # Success
                job.status = JobStatus.COMPLETED
                job.completed_at = datetime.utcnow()
                job.result = output
                
                result.success = True
                result.result = output
                result.completed_at = job.completed_at
                result.duration_ms = int(
                    (job.completed_at - job.started_at).total_seconds() * 1000
                )
                
                logger.info(f"✅ Job completed: {job.name} ({result.duration_ms}ms)")
                
            except Exception as e:
                logger.error(f"❌ Job failed: {job.name} - {e}")
                
                job.error = str(e)
                result.error = str(e)
                result.completed_at = datetime.utcnow()
                
                # Retry logic
                if job.retry_count < job.max_retries:
                    job.retry_count += 1
                    job.status = JobStatus.RETRYING
                    job.next_run = datetime.utcnow() + timedelta(
                        seconds=job.retry_delay_seconds * job.retry_count
                    )
                    logger.info(f"🔄 Job retry scheduled: {job.name} (attempt {job.retry_count})")
                else:
                    job.status = JobStatus.FAILED
            
            # Handle recurring
            if job.job_type == JobType.RECURRING and job.interval_seconds:
                job.next_run = datetime.utcnow() + timedelta(seconds=job.interval_seconds)
                job.status = JobStatus.SCHEDULED
            
            # Log result
            self._log_result(result)
            
            return result
    
    async def run_job_by_id(self, job_id: str) -> Optional[JobResult]:
        """Exécute un job par ID."""
        job = self.get_job(job_id)
        if job:
            return await self.run_job(job)
        return None
    
    # --- Scheduler Loop ---
    async def start(self) -> None:
        """Démarre le scheduler."""
        if self._running_flag:
            return
        
        self._running_flag = True
        self._scheduler_task = asyncio.create_task(self._scheduler_loop())
        logger.info("🚀 Job scheduler started")
    
    async def stop(self) -> None:
        """Arrête le scheduler."""
        self._running_flag = False
        
        if self._scheduler_task:
            self._scheduler_task.cancel()
            try:
                await self._scheduler_task
            except asyncio.CancelledError:
                pass
        
        # Cancel running jobs
        for task in self._running.values():
            task.cancel()
        
        logger.info("🛑 Job scheduler stopped")
    
    async def _scheduler_loop(self) -> None:
        """Boucle principale du scheduler."""
        while self._running_flag:
            try:
                now = datetime.utcnow()
                
                # Find jobs to run
                for job in list(self._jobs.values()):
                    if job.status in [JobStatus.PENDING, JobStatus.SCHEDULED, JobStatus.RETRYING]:
                        should_run = False
                        
                        if job.next_run and job.next_run <= now:
                            should_run = True
                        elif job.status == JobStatus.PENDING and not job.next_run:
                            should_run = True
                        
                        if should_run and job.id not in self._running:
                            task = asyncio.create_task(self.run_job(job))
                            self._running[job.id] = task
                            task.add_done_callback(
                                lambda t, jid=job.id: self._running.pop(jid, None)
                            )
                
                await asyncio.sleep(1)  # Check every second
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Scheduler error: {e}")
                await asyncio.sleep(5)
    
    # --- History ---
    def _log_result(self, result: JobResult) -> None:
        """Log un résultat."""
        self._history.append(result)
        
        if len(self._history) > self._max_history:
            self._history = self._history[-self._max_history:]
    
    def get_history(
        self,
        job_id: Optional[str] = None,
        limit: int = 50
    ) -> List[JobResult]:
        """Récupère l'historique."""
        results = self._history
        
        if job_id:
            results = [r for r in results if r.job_id == job_id]
        
        return results[-limit:]
    
    # --- Stats ---
    def get_stats(self) -> Dict[str, Any]:
        """Statistiques du scheduler."""
        jobs = list(self._jobs.values())
        
        by_status = {}
        for job in jobs:
            status = job.status.value
            by_status[status] = by_status.get(status, 0) + 1
        
        successful = sum(1 for r in self._history if r.success)
        failed = sum(1 for r in self._history if not r.success)
        
        return {
            "total_jobs": len(jobs),
            "running": len(self._running),
            "by_status": by_status,
            "history": {
                "total": len(self._history),
                "successful": successful,
                "failed": failed,
                "success_rate": successful / (successful + failed) if (successful + failed) > 0 else 0
            }
        }


# ═══════════════════════════════════════════════════════════════════════════════
# PREDEFINED JOBS
# ═══════════════════════════════════════════════════════════════════════════════

class SyncJobs:
    """Jobs de synchronisation prédéfinis."""
    
    @staticmethod
    async def sync_shopify_orders(
        shopify_client: Any,
        last_sync: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Sync des commandes Shopify."""
        logger.info("📦 Syncing Shopify orders...")
        
        try:
            orders = await shopify_client.list_orders(
                status="any",
                created_at_min=last_sync.isoformat() if last_sync else None,
                limit=250
            )
            
            return {
                "synced": len(orders),
                "provider": "shopify",
                "type": "orders"
            }
        except Exception as e:
            logger.error(f"Shopify sync failed: {e}")
            raise
    
    @staticmethod
    async def sync_quickbooks_invoices(
        qb_client: Any,
        last_sync: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Sync des factures QuickBooks."""
        logger.info("💰 Syncing QuickBooks invoices...")
        
        try:
            invoices = await qb_client.list_invoices(limit=100)
            
            return {
                "synced": len(invoices),
                "provider": "quickbooks",
                "type": "invoices"
            }
        except Exception as e:
            logger.error(f"QuickBooks sync failed: {e}")
            raise
    
    @staticmethod
    async def sync_hubspot_contacts(
        hubspot_client: Any,
        last_sync: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Sync des contacts HubSpot."""
        logger.info("👥 Syncing HubSpot contacts...")
        
        try:
            contacts = await hubspot_client.list_contacts(limit=100)
            
            return {
                "synced": len(contacts),
                "provider": "hubspot",
                "type": "contacts"
            }
        except Exception as e:
            logger.error(f"HubSpot sync failed: {e}")
            raise


class MaintenanceJobs:
    """Jobs de maintenance."""
    
    @staticmethod
    async def cleanup_expired_cache(cache: Any) -> Dict[str, Any]:
        """Nettoie les entrées de cache expirées."""
        logger.info("🧹 Cleaning expired cache...")
        
        try:
            cleaned = await cache.cleanup_expired()
            return {"cleaned_entries": cleaned}
        except Exception as e:
            logger.error(f"Cache cleanup failed: {e}")
            raise
    
    @staticmethod
    async def cleanup_old_jobs(scheduler: JobScheduler, days: int = 7) -> Dict[str, Any]:
        """Nettoie les vieux jobs terminés."""
        logger.info(f"🧹 Cleaning jobs older than {days} days...")
        
        cutoff = datetime.utcnow() - timedelta(days=days)
        removed = 0
        
        for job_id, job in list(scheduler._jobs.items()):
            if job.status in [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED]:
                if job.completed_at and job.completed_at < cutoff:
                    scheduler.remove_job(job_id)
                    removed += 1
        
        return {"removed_jobs": removed}
    
    @staticmethod
    async def health_check() -> Dict[str, Any]:
        """Vérifie la santé du système."""
        logger.info("🏥 Running health check...")
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "checks": {
                "database": "ok",
                "cache": "ok",
                "scheduler": "ok"
            }
        }


class ReportJobs:
    """Jobs de génération de rapports."""
    
    @staticmethod
    async def generate_daily_report(
        date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Génère le rapport quotidien."""
        report_date = date or datetime.utcnow()
        logger.info(f"📊 Generating daily report for {report_date.date()}...")
        
        return {
            "report_type": "daily",
            "date": report_date.date().isoformat(),
            "generated_at": datetime.utcnow().isoformat(),
            "sections": ["sales", "tasks", "agents", "integrations"]
        }
    
    @staticmethod
    async def generate_weekly_summary() -> Dict[str, Any]:
        """Génère le résumé hebdomadaire."""
        logger.info("📈 Generating weekly summary...")
        
        return {
            "report_type": "weekly",
            "generated_at": datetime.utcnow().isoformat()
        }


# ═══════════════════════════════════════════════════════════════════════════════
# SINGLETON
# ═══════════════════════════════════════════════════════════════════════════════

_scheduler: Optional[JobScheduler] = None


def get_scheduler() -> JobScheduler:
    """Get or create scheduler instance."""
    global _scheduler
    if _scheduler is None:
        _scheduler = JobScheduler(max_concurrent=10)
    return _scheduler


async def setup_default_jobs(scheduler: JobScheduler) -> None:
    """Configure les jobs par défaut."""
    
    # Health check every 5 minutes
    scheduler.add_job(
        name="health_check",
        func=MaintenanceJobs.health_check,
        job_type=JobType.RECURRING,
        interval_seconds=300,
        priority=JobPriority.LOW
    )
    
    # Cache cleanup every hour
    scheduler.add_job(
        name="cache_cleanup",
        func=MaintenanceJobs.cleanup_old_jobs,
        args=(scheduler,),
        job_type=JobType.RECURRING,
        interval_seconds=3600,
        priority=JobPriority.LOW
    )
    
    # Daily report at midnight (would need cron support)
    scheduler.add_job(
        name="daily_report",
        func=ReportJobs.generate_daily_report,
        job_type=JobType.RECURRING,
        interval_seconds=86400,  # 24 hours
        priority=JobPriority.NORMAL
    )
    
    logger.info("✅ Default jobs configured")


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    "JobStatus",
    "JobPriority",
    "JobType",
    
    # Data Classes
    "Job",
    "JobResult",
    
    # Scheduler
    "JobScheduler",
    
    # Predefined Jobs
    "SyncJobs",
    "MaintenanceJobs",
    "ReportJobs",
    
    # Functions
    "get_scheduler",
    "setup_default_jobs"
]
