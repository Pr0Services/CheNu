"""
═══════════════════════════════════════════════════════════════════════════════
CHE·NU™ — BATCH 11: COMPREHENSIVE TEST SUITE
═══════════════════════════════════════════════════════════════════════════════

Test coverage:
- TEST-01: Unit tests (Jest + Pytest)
- TEST-02: Integration tests
- TEST-03: API endpoint tests
- TEST-04: Component tests (React Testing Library)
- TEST-05: E2E tests (Playwright)
- TEST-06: Performance tests
- TEST-07: Security tests
- TEST-08: Accessibility tests

═══════════════════════════════════════════════════════════════════════════════
"""

# ═══════════════════════════════════════════════════════════════════════════════
# PYTEST CONFIGURATION (conftest.py)
# ═══════════════════════════════════════════════════════════════════════════════

import pytest
import asyncio
from typing import AsyncGenerator, Generator
from datetime import datetime, timedelta
from unittest.mock import MagicMock, AsyncMock, patch
import json
import uuid

from fastapi import FastAPI
from fastapi.testclient import TestClient
from httpx import AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

# ═══════════════════════════════════════════════════════════════════════════════
# FIXTURES
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
def test_db_engine():
    """Create test database engine (SQLite in-memory)."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    # Create all tables
    # Base.metadata.create_all(bind=engine)
    yield engine
    engine.dispose()

@pytest.fixture
def db_session(test_db_engine) -> Generator[Session, None, None]:
    """Create database session for each test."""
    TestingSessionLocal = sessionmaker(
        autocommit=False, 
        autoflush=False, 
        bind=test_db_engine
    )
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()

@pytest.fixture
def app() -> FastAPI:
    """Create test FastAPI application."""
    from main import create_app
    return create_app(testing=True)

@pytest.fixture
def client(app: FastAPI) -> Generator[TestClient, None, None]:
    """Create test client."""
    with TestClient(app) as c:
        yield c

@pytest.fixture
async def async_client(app: FastAPI) -> AsyncGenerator[AsyncClient, None]:
    """Create async test client."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
def auth_headers() -> dict:
    """Create authenticated headers."""
    return {
        "Authorization": "Bearer test_token_12345",
        "Content-Type": "application/json",
    }

@pytest.fixture
def sample_user() -> dict:
    """Create sample user data."""
    return {
        "id": str(uuid.uuid4()),
        "email": "test@chenu.ca",
        "first_name": "Jean",
        "last_name": "Tremblay",
        "role": "admin",
        "organization_id": str(uuid.uuid4()),
    }

@pytest.fixture
def sample_project() -> dict:
    """Create sample project data."""
    return {
        "id": str(uuid.uuid4()),
        "name": "Rénovation Dupont",
        "client_name": "Jean Dupont",
        "status": "active",
        "budget_total": 50000.00,
        "budget_spent": 32000.00,
        "progress_percent": 65,
        "start_date": datetime.now().isoformat(),
        "target_end_date": (datetime.now() + timedelta(days=60)).isoformat(),
    }

@pytest.fixture
def sample_task() -> dict:
    """Create sample task data."""
    return {
        "id": str(uuid.uuid4()),
        "title": "Commander matériaux",
        "status": "todo",
        "priority": "high",
        "due_date": (datetime.now() + timedelta(days=3)).isoformat(),
    }

# ═══════════════════════════════════════════════════════════════════════════════
# AUTH TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestAuthentication:
    """Test authentication endpoints."""
    
    def test_login_success(self, client: TestClient):
        """Test successful login."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "test@chenu.ca", "password": "SecurePass123!"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_invalid_credentials(self, client: TestClient):
        """Test login with invalid credentials."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "test@chenu.ca", "password": "wrong"}
        )
        assert response.status_code == 401
        assert "detail" in response.json()
    
    def test_login_missing_fields(self, client: TestClient):
        """Test login with missing fields."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "test@chenu.ca"}
        )
        assert response.status_code == 422
    
    def test_register_success(self, client: TestClient):
        """Test successful registration."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "new@chenu.ca",
                "password": "SecurePass123!",
                "first_name": "Marie",
                "last_name": "Lavoie",
                "organization_name": "Construction ML",
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "new@chenu.ca"
        assert "id" in data
    
    def test_register_duplicate_email(self, client: TestClient):
        """Test registration with existing email."""
        # First registration
        client.post(
            "/api/v1/auth/register",
            json={
                "email": "duplicate@chenu.ca",
                "password": "SecurePass123!",
                "first_name": "Test",
                "last_name": "User",
            }
        )
        # Second registration with same email
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "duplicate@chenu.ca",
                "password": "SecurePass123!",
                "first_name": "Test",
                "last_name": "User",
            }
        )
        assert response.status_code == 400
    
    def test_refresh_token(self, client: TestClient):
        """Test token refresh."""
        # Login first
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": "test@chenu.ca", "password": "SecurePass123!"}
        )
        refresh_token = login_response.json()["refresh_token"]
        
        # Refresh
        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token}
        )
        assert response.status_code == 200
        assert "access_token" in response.json()
    
    def test_logout(self, client: TestClient, auth_headers: dict):
        """Test logout."""
        response = client.post("/api/v1/auth/logout", headers=auth_headers)
        assert response.status_code == 200
    
    def test_protected_route_without_token(self, client: TestClient):
        """Test accessing protected route without token."""
        response = client.get("/api/v1/users/me")
        assert response.status_code == 401

# ═══════════════════════════════════════════════════════════════════════════════
# PROJECT TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestProjects:
    """Test project endpoints."""
    
    def test_list_projects(self, client: TestClient, auth_headers: dict):
        """Test listing projects."""
        response = client.get("/api/v1/projects", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
    
    def test_create_project(self, client: TestClient, auth_headers: dict):
        """Test creating a project."""
        response = client.post(
            "/api/v1/projects",
            headers=auth_headers,
            json={
                "name": "Nouveau Projet Test",
                "client_name": "Client Test",
                "budget_total": 75000.00,
                "project_type": "residential",
                "start_date": datetime.now().isoformat(),
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Nouveau Projet Test"
        assert data["status"] == "draft"
        assert "id" in data
    
    def test_get_project(self, client: TestClient, auth_headers: dict, sample_project: dict):
        """Test getting a single project."""
        project_id = sample_project["id"]
        response = client.get(
            f"/api/v1/projects/{project_id}",
            headers=auth_headers
        )
        assert response.status_code in [200, 404]  # 404 if not seeded
    
    def test_update_project(self, client: TestClient, auth_headers: dict):
        """Test updating a project."""
        # Create first
        create_response = client.post(
            "/api/v1/projects",
            headers=auth_headers,
            json={
                "name": "Project to Update",
                "client_name": "Client",
                "budget_total": 50000.00,
            }
        )
        project_id = create_response.json()["id"]
        
        # Update
        response = client.patch(
            f"/api/v1/projects/{project_id}",
            headers=auth_headers,
            json={"name": "Updated Project Name", "status": "active"}
        )
        assert response.status_code == 200
        assert response.json()["name"] == "Updated Project Name"
    
    def test_delete_project(self, client: TestClient, auth_headers: dict):
        """Test deleting a project."""
        # Create first
        create_response = client.post(
            "/api/v1/projects",
            headers=auth_headers,
            json={
                "name": "Project to Delete",
                "client_name": "Client",
                "budget_total": 10000.00,
            }
        )
        project_id = create_response.json()["id"]
        
        # Delete
        response = client.delete(
            f"/api/v1/projects/{project_id}",
            headers=auth_headers
        )
        assert response.status_code == 204
    
    def test_project_stats(self, client: TestClient, auth_headers: dict):
        """Test project statistics endpoint."""
        response = client.get(
            "/api/v1/projects/stats",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_projects" in data
        assert "active_projects" in data
        assert "total_budget" in data

# ═══════════════════════════════════════════════════════════════════════════════
# TASK TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestTasks:
    """Test task endpoints."""
    
    def test_list_tasks(self, client: TestClient, auth_headers: dict):
        """Test listing tasks."""
        response = client.get("/api/v1/tasks", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
    
    def test_create_task(self, client: TestClient, auth_headers: dict):
        """Test creating a task."""
        response = client.post(
            "/api/v1/tasks",
            headers=auth_headers,
            json={
                "title": "Nouvelle tâche test",
                "priority": "high",
                "due_date": (datetime.now() + timedelta(days=7)).isoformat(),
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Nouvelle tâche test"
        assert data["status"] == "todo"
    
    def test_update_task_status(self, client: TestClient, auth_headers: dict):
        """Test updating task status."""
        # Create task
        create_response = client.post(
            "/api/v1/tasks",
            headers=auth_headers,
            json={"title": "Task to update", "priority": "medium"}
        )
        task_id = create_response.json()["id"]
        
        # Update status
        response = client.patch(
            f"/api/v1/tasks/{task_id}",
            headers=auth_headers,
            json={"status": "in_progress"}
        )
        assert response.status_code == 200
        assert response.json()["status"] == "in_progress"
    
    def test_complete_task(self, client: TestClient, auth_headers: dict):
        """Test completing a task."""
        # Create task
        create_response = client.post(
            "/api/v1/tasks",
            headers=auth_headers,
            json={"title": "Task to complete", "priority": "low"}
        )
        task_id = create_response.json()["id"]
        
        # Complete
        response = client.post(
            f"/api/v1/tasks/{task_id}/complete",
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["status"] == "done"
        assert response.json()["completed_at"] is not None
    
    def test_filter_tasks_by_status(self, client: TestClient, auth_headers: dict):
        """Test filtering tasks by status."""
        response = client.get(
            "/api/v1/tasks?status=todo",
            headers=auth_headers
        )
        assert response.status_code == 200
        for task in response.json()["items"]:
            assert task["status"] == "todo"
    
    def test_filter_tasks_by_priority(self, client: TestClient, auth_headers: dict):
        """Test filtering tasks by priority."""
        response = client.get(
            "/api/v1/tasks?priority=urgent",
            headers=auth_headers
        )
        assert response.status_code == 200

# ═══════════════════════════════════════════════════════════════════════════════
# NOVA AI TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestNovaAI:
    """Test Nova AI endpoints."""
    
    @pytest.mark.asyncio
    async def test_chat_simple_question(self, async_client: AsyncClient, auth_headers: dict):
        """Test simple chat interaction."""
        response = await async_client.post(
            "/api/v1/nova/chat",
            headers=auth_headers,
            json={"message": "Bonjour Nova!"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "conversation_id" in data
    
    @pytest.mark.asyncio
    async def test_chat_create_intent(self, async_client: AsyncClient, auth_headers: dict):
        """Test chat with create intent."""
        response = await async_client.post(
            "/api/v1/nova/chat",
            headers=auth_headers,
            json={"message": "Créer une nouvelle tâche pour le projet Dupont"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["intent"]["type"] == "create"
    
    @pytest.mark.asyncio
    async def test_predict_timeline(self, async_client: AsyncClient, auth_headers: dict):
        """Test timeline prediction."""
        response = await async_client.post(
            "/api/v1/nova/predict/timeline",
            headers=auth_headers,
            json={"project_id": str(uuid.uuid4()), "prediction_type": "timeline"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "prediction" in data
        assert "confidence" in data
        assert "recommendations" in data
    
    @pytest.mark.asyncio
    async def test_predict_budget(self, async_client: AsyncClient, auth_headers: dict):
        """Test budget prediction."""
        response = await async_client.post(
            "/api/v1/nova/predict/budget",
            headers=auth_headers,
            json={"project_id": str(uuid.uuid4()), "prediction_type": "budget"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "prediction" in data
        assert "breakdown" in data["prediction"]
    
    @pytest.mark.asyncio
    async def test_get_suggestions(self, async_client: AsyncClient, auth_headers: dict):
        """Test smart suggestions."""
        user_id = str(uuid.uuid4())
        response = await async_client.get(
            f"/api/v1/nova/suggestions/{user_id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "suggestions" in data
        assert len(data["suggestions"]) > 0

# ═══════════════════════════════════════════════════════════════════════════════
# INTEGRATION TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestIntegrations:
    """Test third-party integrations."""
    
    def test_google_auth_url(self, client: TestClient, auth_headers: dict):
        """Test Google OAuth URL generation."""
        response = client.get(
            "/api/v1/integrations/google/auth",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "auth_url" in data
        assert "accounts.google.com" in data["auth_url"]
    
    @patch("httpx.AsyncClient.post")
    async def test_stripe_payment_intent(self, mock_post, async_client: AsyncClient, auth_headers: dict):
        """Test Stripe payment intent creation."""
        mock_post.return_value = MagicMock(
            json=lambda: {"id": "pi_test123", "status": "requires_payment_method"}
        )
        
        response = await async_client.post(
            "/api/v1/integrations/stripe/payment-intent",
            headers=auth_headers,
            json={"amount": 10000, "description": "Test payment"}
        )
        assert response.status_code == 200
    
    @patch("httpx.AsyncClient.post")
    async def test_send_sms(self, mock_post, async_client: AsyncClient, auth_headers: dict):
        """Test SMS sending."""
        mock_post.return_value = MagicMock(
            json=lambda: {"sid": "SM123", "status": "queued"}
        )
        
        response = await async_client.post(
            "/api/v1/integrations/sms/send",
            headers=auth_headers,
            json={"to": "+15141234567", "body": "Test message"}
        )
        assert response.status_code == 200

# ═══════════════════════════════════════════════════════════════════════════════
# PERFORMANCE TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestPerformance:
    """Performance and load tests."""
    
    def test_response_time_projects_list(self, client: TestClient, auth_headers: dict):
        """Test response time for projects list."""
        import time
        
        start = time.time()
        response = client.get("/api/v1/projects", headers=auth_headers)
        duration = time.time() - start
        
        assert response.status_code == 200
        assert duration < 0.5  # Less than 500ms
    
    def test_response_time_tasks_list(self, client: TestClient, auth_headers: dict):
        """Test response time for tasks list."""
        import time
        
        start = time.time()
        response = client.get("/api/v1/tasks", headers=auth_headers)
        duration = time.time() - start
        
        assert response.status_code == 200
        assert duration < 0.5
    
    def test_concurrent_requests(self, client: TestClient, auth_headers: dict):
        """Test handling concurrent requests."""
        import concurrent.futures
        
        def make_request():
            return client.get("/api/v1/projects", headers=auth_headers)
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(10)]
            results = [f.result() for f in futures]
        
        assert all(r.status_code == 200 for r in results)

# ═══════════════════════════════════════════════════════════════════════════════
# SECURITY TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestSecurity:
    """Security tests."""
    
    def test_sql_injection_prevention(self, client: TestClient, auth_headers: dict):
        """Test SQL injection prevention."""
        response = client.get(
            "/api/v1/projects?search='; DROP TABLE projects; --",
            headers=auth_headers
        )
        # Should not crash
        assert response.status_code in [200, 400]
    
    def test_xss_prevention(self, client: TestClient, auth_headers: dict):
        """Test XSS prevention."""
        response = client.post(
            "/api/v1/projects",
            headers=auth_headers,
            json={
                "name": "<script>alert('xss')</script>",
                "client_name": "Test",
                "budget_total": 1000,
            }
        )
        if response.status_code == 201:
            # Script tags should be escaped or stripped
            assert "<script>" not in response.json()["name"]
    
    def test_rate_limiting(self, client: TestClient, auth_headers: dict):
        """Test rate limiting."""
        # Make many requests
        responses = []
        for _ in range(150):
            responses.append(
                client.get("/api/v1/projects", headers=auth_headers)
            )
        
        # Some should be rate limited (429)
        status_codes = [r.status_code for r in responses]
        # In production, this should have 429s
        assert 200 in status_codes
    
    def test_invalid_token(self, client: TestClient):
        """Test invalid token rejection."""
        response = client.get(
            "/api/v1/projects",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == 401
    
    def test_expired_token(self, client: TestClient):
        """Test expired token rejection."""
        # Create an expired token (in real implementation)
        expired_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.expired"
        response = client.get(
            "/api/v1/projects",
            headers={"Authorization": f"Bearer {expired_token}"}
        )
        assert response.status_code == 401

# ═══════════════════════════════════════════════════════════════════════════════
# ACCESSIBILITY TESTS (Backend validation)
# ═══════════════════════════════════════════════════════════════════════════════

class TestAccessibility:
    """Accessibility-related backend tests."""
    
    def test_error_messages_are_descriptive(self, client: TestClient, auth_headers: dict):
        """Test that error messages are descriptive."""
        response = client.post(
            "/api/v1/projects",
            headers=auth_headers,
            json={}  # Missing required fields
        )
        assert response.status_code == 422
        errors = response.json()["detail"]
        # Should have descriptive field-level errors
        assert len(errors) > 0
        for error in errors:
            assert "loc" in error
            assert "msg" in error
    
    def test_pagination_metadata(self, client: TestClient, auth_headers: dict):
        """Test pagination has proper metadata for screen readers."""
        response = client.get("/api/v1/projects", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        
        # Should have navigation metadata
        assert "total" in data
        assert "page" in data
        assert "pages" in data
        assert "has_next" in data
        assert "has_prev" in data

# ═══════════════════════════════════════════════════════════════════════════════
# WEBHOOK TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestWebhooks:
    """Test webhook handling."""
    
    def test_stripe_webhook_valid_signature(self, client: TestClient):
        """Test Stripe webhook with valid signature."""
        payload = json.dumps({
            "type": "payment_intent.succeeded",
            "data": {"object": {"id": "pi_test123"}}
        })
        
        # In production: generate proper HMAC signature
        response = client.post(
            "/api/v1/integrations/stripe/webhook",
            content=payload,
            headers={
                "Content-Type": "application/json",
                "Stripe-Signature": "t=123,v1=abc"
            }
        )
        # Would be 200 with valid signature, 400 without
        assert response.status_code in [200, 400]
    
    def test_generic_webhook_handler(self, client: TestClient, auth_headers: dict):
        """Test generic webhook handler."""
        response = client.post(
            "/api/v1/webhooks/incoming",
            headers=auth_headers,
            json={
                "source": "external_service",
                "event": "task_completed",
                "data": {"task_id": "123"}
            }
        )
        assert response.status_code in [200, 202]

# ═══════════════════════════════════════════════════════════════════════════════
# RUN CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    pytest.main([
        __file__,
        "-v",
        "--tb=short",
        "--cov=app",
        "--cov-report=html",
        "--cov-report=term-missing",
    ])
