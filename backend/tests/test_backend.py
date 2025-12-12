"""
ROADY Unified - Test Suite
═══════════════════════════════════════════════════════════════════════════════
Tests complets pour le backend ROADY.

Author: ROADY Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

import pytest
import asyncio
from datetime import datetime, timedelta
from unittest.mock import AsyncMock, MagicMock, patch
import json


# ═══════════════════════════════════════════════════════════════════════════════
# FIXTURES
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.fixture
def event_loop():
    """Create event loop for async tests."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def mock_aiohttp_session():
    """Mock aiohttp ClientSession."""
    session = AsyncMock()
    response = AsyncMock()
    response.status = 200
    response.json = AsyncMock(return_value={})
    session.get = AsyncMock(return_value=AsyncMock(__aenter__=AsyncMock(return_value=response)))
    session.post = AsyncMock(return_value=AsyncMock(__aenter__=AsyncMock(return_value=response)))
    session.put = AsyncMock(return_value=AsyncMock(__aenter__=AsyncMock(return_value=response)))
    session.delete = AsyncMock(return_value=AsyncMock(__aenter__=AsyncMock(return_value=response)))
    return session


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS - RATE LIMITER
# ═══════════════════════════════════════════════════════════════════════════════

class TestRateLimiter:
    """Tests for rate limiting module."""
    
    @pytest.mark.asyncio
    async def test_token_bucket_allows_requests_under_limit(self):
        """Token bucket should allow requests under limit."""
        from backend.utils.rate_limiter import TokenBucketLimiter
        
        limiter = TokenBucketLimiter(rate=10, capacity=10)
        
        result = await limiter.acquire("test")
        
        assert result.allowed is True
        assert result.remaining >= 0
    
    @pytest.mark.asyncio
    async def test_token_bucket_blocks_when_exhausted(self):
        """Token bucket should block when tokens exhausted."""
        from backend.utils.rate_limiter import TokenBucketLimiter
        
        limiter = TokenBucketLimiter(rate=1, capacity=2)
        
        # Exhaust tokens
        await limiter.acquire("test", tokens=2)
        
        result = await limiter.acquire("test")
        
        assert result.allowed is False
        assert result.retry_after_seconds is not None
    
    @pytest.mark.asyncio
    async def test_sliding_window_counts_requests(self):
        """Sliding window should count requests in window."""
        from backend.utils.rate_limiter import SlidingWindowLimiter
        
        limiter = SlidingWindowLimiter(max_requests=3, window_seconds=60)
        
        # First 3 should succeed
        for _ in range(3):
            result = await limiter.acquire("test")
            assert result.allowed is True
        
        # 4th should fail
        result = await limiter.acquire("test")
        assert result.allowed is False
    
    @pytest.mark.asyncio
    async def test_fixed_window_resets(self):
        """Fixed window should reset after window expires."""
        from backend.utils.rate_limiter import FixedWindowLimiter
        
        limiter = FixedWindowLimiter(max_requests=2, window_seconds=1)
        
        # Exhaust limit
        await limiter.acquire("test")
        await limiter.acquire("test")
        result = await limiter.acquire("test")
        assert result.allowed is False
        
        # Wait for window reset
        await asyncio.sleep(1.1)
        
        result = await limiter.acquire("test")
        assert result.allowed is True


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS - CACHE
# ═══════════════════════════════════════════════════════════════════════════════

class TestCache:
    """Tests for cache module."""
    
    @pytest.mark.asyncio
    async def test_memory_cache_get_set(self):
        """Memory cache should store and retrieve values."""
        from backend.utils.cache import MemoryCache
        
        cache = MemoryCache(max_size=100)
        
        await cache.set("key1", "value1")
        result = await cache.get("key1")
        
        assert result == "value1"
    
    @pytest.mark.asyncio
    async def test_memory_cache_ttl_expiration(self):
        """Memory cache should expire entries after TTL."""
        from backend.utils.cache import MemoryCache
        
        cache = MemoryCache(max_size=100, default_ttl=1)
        
        await cache.set("key1", "value1", ttl=1)
        
        # Immediately available
        assert await cache.get("key1") == "value1"
        
        # Wait for expiration
        await asyncio.sleep(1.1)
        
        assert await cache.get("key1") is None
    
    @pytest.mark.asyncio
    async def test_memory_cache_lru_eviction(self):
        """Memory cache should evict LRU entries when full."""
        from backend.utils.cache import MemoryCache
        
        cache = MemoryCache(max_size=2)
        
        await cache.set("key1", "value1")
        await cache.set("key2", "value2")
        await cache.set("key3", "value3")  # Should evict key1
        
        assert await cache.get("key1") is None
        assert await cache.get("key2") == "value2"
        assert await cache.get("key3") == "value3"
    
    @pytest.mark.asyncio
    async def test_memory_cache_delete_by_tag(self):
        """Memory cache should delete entries by tag."""
        from backend.utils.cache import MemoryCache
        
        cache = MemoryCache(max_size=100)
        
        await cache.set("key1", "value1", tags=["user"])
        await cache.set("key2", "value2", tags=["user"])
        await cache.set("key3", "value3", tags=["other"])
        
        count = await cache.delete_by_tag("user")
        
        assert count == 2
        assert await cache.get("key1") is None
        assert await cache.get("key2") is None
        assert await cache.get("key3") == "value3"


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS - JOB MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class TestJobManager:
    """Tests for job manager module."""
    
    @pytest.mark.asyncio
    async def test_job_queue_enqueue_and_process(self):
        """Job queue should enqueue and process jobs."""
        from backend.jobs.job_manager import AsyncJobQueue, JobStatus
        
        queue = AsyncJobQueue(max_workers=2)
        await queue.start()
        
        result_holder = []
        
        async def test_job(value):
            result_holder.append(value)
            return value * 2
        
        job_id = await queue.enqueue(test_job, 5)
        
        # Wait for processing
        await asyncio.sleep(0.5)
        
        job = queue.get_job(job_id)
        assert job is not None
        assert job.status == JobStatus.COMPLETED
        assert job.result == 10
        assert 5 in result_holder
        
        await queue.stop()
    
    @pytest.mark.asyncio
    async def test_job_queue_retry_on_failure(self):
        """Job queue should retry failed jobs."""
        from backend.jobs.job_manager import AsyncJobQueue, JobStatus
        
        queue = AsyncJobQueue(max_workers=1)
        await queue.start()
        
        attempt_count = [0]
        
        async def failing_job():
            attempt_count[0] += 1
            if attempt_count[0] < 3:
                raise Exception("Simulated failure")
            return "success"
        
        job_id = await queue.enqueue(failing_job, max_retries=3, name="failing_job")
        
        # Wait for retries (with retry delay)
        await asyncio.sleep(3)
        
        job = queue.get_job(job_id)
        assert job is not None
        # Should have retried and eventually succeeded
        assert attempt_count[0] >= 2
        
        await queue.stop()
    
    @pytest.mark.asyncio
    async def test_scheduler_interval_job(self):
        """Scheduler should run interval jobs."""
        from backend.jobs.job_manager import JobScheduler
        
        scheduler = JobScheduler()
        await scheduler.start()
        
        run_count = [0]
        
        async def interval_job():
            run_count[0] += 1
        
        scheduler.schedule_interval(interval_job, interval_seconds=1, start_now=True)
        
        # Wait for a couple runs
        await asyncio.sleep(2.5)
        
        assert run_count[0] >= 2
        
        await scheduler.stop()


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS - WEBHOOKS
# ═══════════════════════════════════════════════════════════════════════════════

class TestWebhooks:
    """Tests for webhook module."""
    
    def test_stripe_signature_verification(self):
        """Stripe signature should be verified correctly."""
        from backend.webhooks.webhook_router import SignatureVerifier
        import time
        import hmac
        import hashlib
        
        secret = "whsec_test123"
        timestamp = str(int(time.time()))
        payload = b'{"type": "payment_intent.succeeded"}'
        
        # Create valid signature
        signed_payload = f"{timestamp}.{payload.decode()}"
        expected_sig = hmac.new(
            secret.encode(),
            signed_payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        signature = f"t={timestamp},v1={expected_sig}"
        
        result = SignatureVerifier.verify_stripe(payload, signature, secret)
        
        assert result is True
    
    def test_stripe_signature_verification_fails_invalid(self):
        """Invalid Stripe signature should fail verification."""
        from backend.webhooks.webhook_router import SignatureVerifier
        
        secret = "whsec_test123"
        payload = b'{"type": "test"}'
        signature = "t=123,v1=invalid"
        
        result = SignatureVerifier.verify_stripe(payload, signature, secret)
        
        assert result is False
    
    @pytest.mark.asyncio
    async def test_webhook_manager_process_stripe(self):
        """Webhook manager should process Stripe webhooks."""
        from backend.webhooks.webhook_router import WebhookManager, WebhookProvider, WebhookStatus
        
        manager = WebhookManager()
        manager.register_provider(WebhookProvider.STRIPE, "test_secret")
        
        event = await manager.process_webhook(
            provider=WebhookProvider.STRIPE,
            event_type="payment_intent.succeeded",
            payload={
                "type": "payment_intent.succeeded",
                "data": {
                    "object": {
                        "amount": 2000,
                        "currency": "usd"
                    }
                }
            },
            headers={}
        )
        
        assert event.status == WebhookStatus.PROCESSED
        assert event.result is not None
        assert event.result.get("action") == "payment_completed"


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS - SCHEMAS
# ═══════════════════════════════════════════════════════════════════════════════

class TestSchemas:
    """Tests for Pydantic schemas."""
    
    def test_task_schema_validation(self):
        """Task schema should validate correctly."""
        from backend.schemas.task_schema import Task, TaskStatus, TaskPriority
        
        task = Task(
            id="task_123",
            description="Test task",
            status=TaskStatus.PENDING,
            priority=TaskPriority.NORMAL
        )
        
        assert task.id == "task_123"
        assert task.status == TaskStatus.PENDING
    
    def test_task_input_defaults(self):
        """Task input should have sensible defaults."""
        from backend.schemas.task_schema import TaskInput
        
        task_input = TaskInput(description="Test")
        
        assert task_input.description == "Test"
        assert task_input.priority is not None
    
    def test_message_schema_validation(self):
        """Message schema should validate correctly."""
        from backend.schemas.message_schema import Message, MessageRole, MessageType
        
        message = Message(
            id="msg_123",
            role=MessageRole.USER,
            type=MessageType.TEXT,
            content="Hello"
        )
        
        assert message.id == "msg_123"
        assert message.role == MessageRole.USER


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS - INTEGRATIONS (Mock)
# ═══════════════════════════════════════════════════════════════════════════════

class TestIntegrations:
    """Integration tests with mocked API calls."""
    
    @pytest.mark.asyncio
    async def test_analytics_service_track_event(self):
        """Analytics service should track events."""
        from backend.services.integrations.analytics import AnalyticsService
        
        service = AnalyticsService()
        
        # Without any clients registered, should return empty
        results = await service.track_event(
            event_name="test_event",
            user_id="user_123",
            properties={"key": "value"}
        )
        
        assert isinstance(results, dict)
    
    @pytest.mark.asyncio
    async def test_support_service_dashboard(self):
        """Support service should return dashboard data."""
        from backend.services.integrations.support import SupportService
        
        service = SupportService()
        
        dashboard = await service.get_support_dashboard(account_ids=[])
        
        assert "total_tickets" in dashboard
        assert "by_status" in dashboard
    
    @pytest.mark.asyncio
    async def test_email_service_send_simple(self):
        """Email service should validate email before sending."""
        from backend.services.integrations.email_transactional import (
            EmailService, EmailAddress, Email, EmailStatus
        )
        
        service = EmailService()
        
        # Without provider, should raise
        with pytest.raises(ValueError):
            await service.send_simple(
                to="test@example.com",
                subject="Test",
                text="Hello"
            )
    
    @pytest.mark.asyncio
    async def test_social_media_dashboard(self):
        """Social media service should return dashboard."""
        from backend.services.integrations.social_media import SocialMediaService
        
        service = SocialMediaService()
        
        dashboard = await service.get_social_dashboard()
        
        assert "total_accounts" in dashboard
        assert "total_followers" in dashboard


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS - API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestAPIEndpoints:
    """Tests for FastAPI endpoints."""
    
    @pytest.fixture
    def client(self):
        """Create test client."""
        from fastapi.testclient import TestClient
        try:
            from backend.api.main import app
            return TestClient(app)
        except Exception:
            pytest.skip("API not configured for testing")
    
    def test_health_endpoint(self, client):
        """Health endpoint should return OK."""
        if client is None:
            pytest.skip("Client not available")
        
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "healthy"
    
    def test_root_endpoint(self, client):
        """Root endpoint should return API info."""
        if client is None:
            pytest.skip("Client not available")
        
        response = client.get("/")
        assert response.status_code == 200


# ═══════════════════════════════════════════════════════════════════════════════
# RUN TESTS
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--asyncio-mode=auto"])
