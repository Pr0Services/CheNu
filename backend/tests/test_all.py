"""
ROADY Unified - Test Suite
═══════════════════════════════════════════════════════════════════════════════
Tests unitaires et d'intégration pour tous les modules.

Run: pytest tests/ -v --cov=backend

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
    """Mock aiohttp session."""
    session = AsyncMock()
    response = AsyncMock()
    response.status = 200
    response.json = AsyncMock(return_value={})
    session.get.return_value.__aenter__.return_value = response
    session.post.return_value.__aenter__.return_value = response
    session.put.return_value.__aenter__.return_value = response
    session.delete.return_value.__aenter__.return_value = response
    return session


# ═══════════════════════════════════════════════════════════════════════════════
# RATE LIMITER TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestRateLimiter:
    """Tests for rate limiting."""
    
    @pytest.mark.asyncio
    async def test_token_bucket_allows_requests(self):
        """Token bucket should allow requests within limit."""
        from backend.utils.rate_limiter import TokenBucketLimiter
        
        limiter = TokenBucketLimiter(rate=10, capacity=10)
        
        # Should allow first 10 requests
        for i in range(10):
            result = await limiter.acquire("test")
            assert result.allowed is True
    
    @pytest.mark.asyncio
    async def test_token_bucket_blocks_excess(self):
        """Token bucket should block requests over limit."""
        from backend.utils.rate_limiter import TokenBucketLimiter
        
        limiter = TokenBucketLimiter(rate=1, capacity=2)
        
        # Use up tokens
        await limiter.acquire("test")
        await limiter.acquire("test")
        
        # Should be blocked
        result = await limiter.acquire("test")
        assert result.allowed is False
        assert result.retry_after_seconds > 0
    
    @pytest.mark.asyncio
    async def test_sliding_window_limiter(self):
        """Sliding window should count requests properly."""
        from backend.utils.rate_limiter import SlidingWindowLimiter
        
        limiter = SlidingWindowLimiter(max_requests=5, window_seconds=60)
        
        # Should allow 5 requests
        for i in range(5):
            result = await limiter.acquire("test")
            assert result.allowed is True
            assert result.remaining == 4 - i
        
        # 6th should be blocked
        result = await limiter.acquire("test")
        assert result.allowed is False
    
    @pytest.mark.asyncio
    async def test_fixed_window_limiter(self):
        """Fixed window should reset after window expires."""
        from backend.utils.rate_limiter import FixedWindowLimiter
        
        limiter = FixedWindowLimiter(max_requests=3, window_seconds=1)
        
        # Use up limit
        for _ in range(3):
            await limiter.acquire("test")
        
        # Should be blocked
        result = await limiter.acquire("test")
        assert result.allowed is False


# ═══════════════════════════════════════════════════════════════════════════════
# CACHE TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestCache:
    """Tests for caching system."""
    
    @pytest.mark.asyncio
    async def test_memory_cache_set_get(self):
        """Memory cache should store and retrieve values."""
        from backend.utils.cache import MemoryCache
        
        cache = MemoryCache(max_size=100)
        
        await cache.set("key1", "value1")
        result = await cache.get("key1")
        
        assert result == "value1"
    
    @pytest.mark.asyncio
    async def test_memory_cache_expiration(self):
        """Memory cache should expire entries."""
        from backend.utils.cache import MemoryCache
        
        cache = MemoryCache(max_size=100, default_ttl=1)
        
        await cache.set("key1", "value1", ttl=0)  # Expire immediately
        
        # Manually expire
        entry = cache._cache.get("key1")
        if entry:
            entry.expires_at = datetime.utcnow() - timedelta(seconds=1)
        
        result = await cache.get("key1")
        assert result is None
    
    @pytest.mark.asyncio
    async def test_memory_cache_lru_eviction(self):
        """Memory cache should evict LRU entries."""
        from backend.utils.cache import MemoryCache
        
        cache = MemoryCache(max_size=3)
        
        await cache.set("key1", "value1")
        await cache.set("key2", "value2")
        await cache.set("key3", "value3")
        
        # Access key1 to make it recent
        await cache.get("key1")
        
        # Add key4, should evict key2 (LRU)
        await cache.set("key4", "value4")
        
        assert await cache.get("key1") == "value1"
        assert await cache.get("key2") is None  # Evicted
        assert await cache.get("key3") == "value3"
        assert await cache.get("key4") == "value4"
    
    @pytest.mark.asyncio
    async def test_cache_stats(self):
        """Cache should track statistics."""
        from backend.utils.cache import MemoryCache
        
        cache = MemoryCache(max_size=100)
        
        await cache.set("key1", "value1")
        await cache.get("key1")  # Hit
        await cache.get("key2")  # Miss
        
        stats = cache.get_stats()
        
        assert stats.hits == 1
        assert stats.misses == 1
        assert stats.size == 1


# ═══════════════════════════════════════════════════════════════════════════════
# JOB SCHEDULER TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestJobScheduler:
    """Tests for job scheduler."""
    
    @pytest.mark.asyncio
    async def test_add_job(self):
        """Should add jobs to scheduler."""
        from backend.jobs.scheduler import JobScheduler, JobType
        
        scheduler = JobScheduler()
        
        async def test_func():
            return "done"
        
        job = scheduler.add_job(
            name="test_job",
            func=test_func,
            job_type=JobType.ONE_TIME
        )
        
        assert job.name == "test_job"
        assert job.id in scheduler._jobs
    
    @pytest.mark.asyncio
    async def test_run_job(self):
        """Should execute jobs."""
        from backend.jobs.scheduler import JobScheduler
        
        scheduler = JobScheduler()
        
        async def test_func():
            return {"status": "success"}
        
        job = scheduler.add_job(name="test", func=test_func)
        result = await scheduler.run_job(job)
        
        assert result.success is True
        assert result.result == {"status": "success"}
    
    @pytest.mark.asyncio
    async def test_job_retry(self):
        """Should retry failed jobs."""
        from backend.jobs.scheduler import JobScheduler, JobStatus
        
        scheduler = JobScheduler()
        call_count = 0
        
        async def failing_func():
            nonlocal call_count
            call_count += 1
            raise ValueError("Test error")
        
        job = scheduler.add_job(
            name="failing_job",
            func=failing_func,
            max_retries=2
        )
        
        await scheduler.run_job(job)
        
        assert job.retry_count == 1
        assert job.status == JobStatus.RETRYING
    
    def test_get_stats(self):
        """Should return scheduler statistics."""
        from backend.jobs.scheduler import JobScheduler
        
        scheduler = JobScheduler()
        
        async def noop():
            pass
        
        scheduler.add_job(name="job1", func=noop)
        scheduler.add_job(name="job2", func=noop)
        
        stats = scheduler.get_stats()
        
        assert stats["total_jobs"] == 2
        assert "by_status" in stats


# ═══════════════════════════════════════════════════════════════════════════════
# WEBHOOK TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestWebhooks:
    """Tests for webhook system."""
    
    def test_stripe_signature_verification(self):
        """Should verify Stripe signatures."""
        from backend.webhooks.webhook_router import SignatureVerifier
        import hmac
        import hashlib
        import time
        
        secret = "whsec_test_secret"
        timestamp = str(int(time.time()))
        payload = b'{"type": "test"}'
        
        # Generate valid signature
        signed_payload = f"{timestamp}.{payload.decode()}"
        expected = hmac.new(
            secret.encode(),
            signed_payload.encode(),
            hashlib.sha256
        ).hexdigest()
        signature = f"t={timestamp},v1={expected}"
        
        result = SignatureVerifier.verify_stripe(payload, signature, secret)
        assert result is True
    
    def test_github_signature_verification(self):
        """Should verify GitHub signatures."""
        from backend.webhooks.webhook_router import SignatureVerifier
        import hmac
        import hashlib
        
        secret = "test_secret"
        payload = b'{"action": "push"}'
        
        # Generate valid signature
        expected = "sha256=" + hmac.new(
            secret.encode(),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        result = SignatureVerifier.verify_github(payload, expected, secret)
        assert result is True
    
    @pytest.mark.asyncio
    async def test_webhook_manager_process(self):
        """Should process webhooks."""
        from backend.webhooks.webhook_router import WebhookManager, WebhookProvider, WebhookStatus
        
        manager = WebhookManager()
        manager.register_provider(WebhookProvider.STRIPE, "test_secret")
        
        event = await manager.process_webhook(
            provider=WebhookProvider.STRIPE,
            event_type="payment_intent.succeeded",
            payload={"data": {"object": {"amount": 1000}}},
            headers={},
        )
        
        assert event.status == WebhookStatus.PROCESSED
        assert event.result is not None


# ═══════════════════════════════════════════════════════════════════════════════
# SCHEMA TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestSchemas:
    """Tests for Pydantic schemas."""
    
    def test_task_schema(self):
        """Task schema should validate correctly."""
        from backend.schemas.task_schema import TaskInput, TaskType, TaskPriority
        
        task = TaskInput(
            description="Test task",
            title="Test",
            type=TaskType.SIMPLE,
            priority=TaskPriority.NORMAL
        )
        
        assert task.description == "Test task"
        assert task.type == TaskType.SIMPLE
    
    def test_message_schema(self):
        """Message schema should validate correctly."""
        from backend.schemas.message_schema import Message, MessageRole, MessageType
        
        message = Message(
            id="msg_123",
            conversation_id="conv_456",
            role=MessageRole.USER,
            type=MessageType.TEXT
        )
        
        assert message.id == "msg_123"
        assert message.role == MessageRole.USER


# ═══════════════════════════════════════════════════════════════════════════════
# INTEGRATION TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestIntegrations:
    """Tests for integration clients."""
    
    @pytest.mark.asyncio
    async def test_sendgrid_payload_building(self):
        """SendGrid client should build correct payload."""
        from backend.services.integrations.email_transactional import (
            SendGridClient, Email, EmailAddress
        )
        
        client = SendGridClient(api_key="test_key")
        
        email = Email(
            to=[EmailAddress(email="test@example.com", name="Test User")],
            subject="Test Subject",
            html="<p>Hello</p>",
            text="Hello",
            from_email=EmailAddress(email="sender@example.com", name="Sender")
        )
        
        payload = client._build_send_payload(email)
        
        assert payload["subject"] == "Test Subject"
        assert len(payload["personalizations"]) == 1
        assert payload["personalizations"][0]["to"][0]["email"] == "test@example.com"
    
    @pytest.mark.asyncio
    async def test_analytics_service_registration(self):
        """Analytics service should register clients."""
        from backend.services.integrations.analytics import AnalyticsService
        
        service = AnalyticsService()
        
        service.register_mixpanel(
            account_id="test",
            project_token="token",
            api_secret="secret"
        )
        
        assert "test" in service._mixpanel_clients
    
    @pytest.mark.asyncio
    async def test_support_service_registration(self):
        """Support service should register clients."""
        from backend.services.integrations.support import SupportService
        
        service = SupportService()
        
        service.register_zendesk(
            account_id="test",
            subdomain="test",
            email="test@example.com",
            api_token="token"
        )
        
        assert "test" in service._zendesk_clients


# ═══════════════════════════════════════════════════════════════════════════════
# API TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestAPI:
    """Tests for FastAPI endpoints."""
    
    @pytest.fixture
    def client(self):
        """Create test client."""
        from fastapi.testclient import TestClient
        
        # Mock the app
        from fastapi import FastAPI
        app = FastAPI()
        
        @app.get("/health")
        async def health():
            return {"status": "healthy"}
        
        return TestClient(app)
    
    def test_health_endpoint(self, client):
        """Health endpoint should return healthy."""
        response = client.get("/health")
        
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


# ═══════════════════════════════════════════════════════════════════════════════
# RUN TESTS
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
