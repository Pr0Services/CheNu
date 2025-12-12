"""
ROADY Unified - Pytest Configuration
═══════════════════════════════════════════════════════════════════════════════
Fixtures et configuration partagées pour tous les tests.

Author: ROADY Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

import pytest
import asyncio
import sys
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))


# ═══════════════════════════════════════════════════════════════════════════════
# ASYNC SUPPORT
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


# ═══════════════════════════════════════════════════════════════════════════════
# HTTP MOCKS
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.fixture
def mock_response():
    """Mock HTTP response."""
    response = AsyncMock()
    response.status = 200
    response.json = AsyncMock(return_value={})
    response.text = AsyncMock(return_value="")
    return response


@pytest.fixture
def mock_session(mock_response):
    """Mock aiohttp session."""
    session = MagicMock()
    
    # Configure context managers
    for method in ['get', 'post', 'put', 'delete', 'patch']:
        mock_method = AsyncMock()
        mock_method.return_value.__aenter__ = AsyncMock(return_value=mock_response)
        mock_method.return_value.__aexit__ = AsyncMock(return_value=None)
        setattr(session, method, mock_method)
    
    session.__aenter__ = AsyncMock(return_value=session)
    session.__aexit__ = AsyncMock(return_value=None)
    
    return session


# ═══════════════════════════════════════════════════════════════════════════════
# DATABASE MOCKS
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.fixture
def mock_db_session():
    """Mock database session."""
    session = MagicMock()
    session.execute = AsyncMock()
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    session.close = AsyncMock()
    return session


# ═══════════════════════════════════════════════════════════════════════════════
# CACHE FIXTURES
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.fixture
def memory_cache():
    """Create memory cache instance."""
    from backend.utils.cache import MemoryCache
    return MemoryCache(max_size=100, default_ttl=300)


# ═══════════════════════════════════════════════════════════════════════════════
# SCHEDULER FIXTURES
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.fixture
def job_scheduler():
    """Create job scheduler instance."""
    from backend.jobs.scheduler import JobScheduler
    return JobScheduler(max_concurrent=5)


# ═══════════════════════════════════════════════════════════════════════════════
# API CLIENT FIXTURES
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.fixture
def test_client():
    """Create FastAPI test client."""
    from fastapi.testclient import TestClient
    from fastapi import FastAPI
    
    app = FastAPI()
    
    @app.get("/")
    async def root():
        return {"status": "ok"}
    
    @app.get("/health")
    async def health():
        return {"status": "healthy", "version": "8.0.0"}
    
    return TestClient(app)


# ═══════════════════════════════════════════════════════════════════════════════
# SAMPLE DATA
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.fixture
def sample_task_data():
    """Sample task data."""
    return {
        "description": "Test task description",
        "title": "Test Task",
        "priority": "normal",
        "user_id": "user_123"
    }


@pytest.fixture
def sample_message_data():
    """Sample message data."""
    return {
        "content": "Hello, Nova!",
        "user_id": "user_123",
        "conversation_id": "conv_456"
    }


@pytest.fixture
def sample_webhook_payload():
    """Sample webhook payload."""
    return {
        "stripe": {
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_123",
                    "amount": 5000,
                    "currency": "usd"
                }
            }
        },
        "shopify": {
            "id": 12345,
            "order_number": 1001,
            "total_price": "99.99",
            "line_items": []
        }
    }


# ═══════════════════════════════════════════════════════════════════════════════
# INTEGRATION FIXTURES
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.fixture
def mock_shopify_client(mock_session):
    """Mock Shopify client."""
    client = MagicMock()
    client.list_products = AsyncMock(return_value=[])
    client.list_orders = AsyncMock(return_value=[])
    return client


@pytest.fixture
def mock_stripe_client(mock_session):
    """Mock Stripe client."""
    client = MagicMock()
    client.list_payments = AsyncMock(return_value=[])
    client.create_payment_intent = AsyncMock(return_value={"id": "pi_123"})
    return client


# ═══════════════════════════════════════════════════════════════════════════════
# MARKERS
# ═══════════════════════════════════════════════════════════════════════════════

def pytest_configure(config):
    """Configure custom markers."""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
    config.addinivalue_line(
        "markers", "unit: marks tests as unit tests"
    )
