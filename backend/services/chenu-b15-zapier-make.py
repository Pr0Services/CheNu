"""
CHE·NU™ — B15-2: ZAPIER/MAKE INTEGRATION
- Webhook triggers
- Action endpoints
- OAuth for Zapier
- Trigger subscriptions
- Sample Zaps
"""

from typing import Any, Dict, List, Optional
from datetime import datetime
from enum import Enum
from dataclasses import dataclass
import uuid
import hmac
import hashlib
import json

from fastapi import APIRouter, HTTPException, Request, Header
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/automation", tags=["Automation"])

class TriggerType(str, Enum):
    PROJECT_CREATED = "project.created"
    PROJECT_UPDATED = "project.updated"
    PROJECT_COMPLETED = "project.completed"
    TASK_CREATED = "task.created"
    TASK_COMPLETED = "task.completed"
    TASK_OVERDUE = "task.overdue"
    INVOICE_SENT = "invoice.sent"
    INVOICE_PAID = "invoice.paid"
    DOCUMENT_UPLOADED = "document.uploaded"
    MESSAGE_RECEIVED = "message.received"
    MILESTONE_REACHED = "milestone.reached"

class ActionType(str, Enum):
    CREATE_PROJECT = "create_project"
    CREATE_TASK = "create_task"
    UPDATE_TASK = "update_task"
    SEND_MESSAGE = "send_message"
    CREATE_INVOICE = "create_invoice"
    ADD_NOTE = "add_note"

@dataclass
class WebhookSubscription:
    id: str
    trigger: TriggerType
    target_url: str
    secret: str
    active: bool
    created_at: datetime
    last_triggered: Optional[datetime]

@dataclass
class AutomationLog:
    id: str
    subscription_id: str
    trigger: TriggerType
    payload: Dict
    status: str
    response_code: Optional[int]
    timestamp: datetime

class WebhookManager:
    _subscriptions: Dict[str, WebhookSubscription] = {}
    _logs: List[AutomationLog] = []
    
    @classmethod
    async def subscribe(cls, trigger: TriggerType, target_url: str) -> WebhookSubscription:
        sub = WebhookSubscription(
            id=f"hook_{uuid.uuid4().hex[:8]}",
            trigger=trigger,
            target_url=target_url,
            secret=uuid.uuid4().hex,
            active=True,
            created_at=datetime.utcnow(),
            last_triggered=None
        )
        cls._subscriptions[sub.id] = sub
        return sub
    
    @classmethod
    async def unsubscribe(cls, sub_id: str) -> bool:
        if sub_id in cls._subscriptions:
            del cls._subscriptions[sub_id]
            return True
        return False
    
    @classmethod
    async def list_subscriptions(cls) -> List[Dict]:
        return [{"id": s.id, "trigger": s.trigger.value, "url": s.target_url, "active": s.active}
                for s in cls._subscriptions.values()]
    
    @classmethod
    async def trigger(cls, trigger_type: TriggerType, payload: Dict) -> int:
        """Trigger all subscriptions for this event type."""
        triggered = 0
        for sub in cls._subscriptions.values():
            if sub.trigger == trigger_type and sub.active:
                # Sign payload
                signature = hmac.new(sub.secret.encode(), json.dumps(payload).encode(), hashlib.sha256).hexdigest()
                
                # In production: async HTTP POST to target_url with signature header
                log = AutomationLog(
                    f"log_{uuid.uuid4().hex[:8]}", sub.id, trigger_type,
                    payload, "sent", 200, datetime.utcnow()
                )
                cls._logs.append(log)
                sub.last_triggered = datetime.utcnow()
                triggered += 1
        return triggered

class ActionExecutor:
    """Execute actions from Zapier/Make."""
    
    @classmethod
    async def execute(cls, action: ActionType, params: Dict) -> Dict:
        handlers = {
            ActionType.CREATE_PROJECT: cls._create_project,
            ActionType.CREATE_TASK: cls._create_task,
            ActionType.UPDATE_TASK: cls._update_task,
            ActionType.SEND_MESSAGE: cls._send_message,
            ActionType.CREATE_INVOICE: cls._create_invoice,
            ActionType.ADD_NOTE: cls._add_note,
        }
        handler = handlers.get(action)
        if not handler:
            raise HTTPException(400, f"Unknown action: {action}")
        return await handler(params)
    
    @classmethod
    async def _create_project(cls, params: Dict) -> Dict:
        return {"id": f"proj_{uuid.uuid4().hex[:8]}", "name": params.get("name"), "status": "created"}
    
    @classmethod
    async def _create_task(cls, params: Dict) -> Dict:
        return {"id": f"task_{uuid.uuid4().hex[:8]}", "title": params.get("title"), "project_id": params.get("project_id")}
    
    @classmethod
    async def _update_task(cls, params: Dict) -> Dict:
        return {"id": params.get("task_id"), "updated": True, "fields": list(params.keys())}
    
    @classmethod
    async def _send_message(cls, params: Dict) -> Dict:
        return {"id": f"msg_{uuid.uuid4().hex[:8]}", "sent": True, "to": params.get("to")}
    
    @classmethod
    async def _create_invoice(cls, params: Dict) -> Dict:
        return {"id": f"inv_{uuid.uuid4().hex[:8]}", "number": f"FACT-{uuid.uuid4().hex[:4].upper()}"}
    
    @classmethod
    async def _add_note(cls, params: Dict) -> Dict:
        return {"id": f"note_{uuid.uuid4().hex[:8]}", "added": True, "entity": params.get("entity_type")}

# Zapier-specific endpoints
class ZapierAuth:
    """Zapier OAuth2 flow helpers."""
    
    @classmethod
    async def get_auth_url(cls, client_id: str, redirect_uri: str) -> str:
        return f"https://chenu.ca/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
    
    @classmethod
    async def exchange_code(cls, code: str) -> Dict:
        # In production: validate code and return tokens
        return {
            "access_token": f"zap_token_{uuid.uuid4().hex}",
            "refresh_token": f"zap_refresh_{uuid.uuid4().hex}",
            "expires_in": 3600,
            "token_type": "Bearer"
        }
    
    @classmethod
    async def test_auth(cls, token: str) -> Dict:
        # Zapier calls this to verify auth works
        return {"id": "user_123", "email": "user@chenu.ca", "name": "Test User"}

# Sample trigger data for Zapier
SAMPLE_TRIGGER_DATA = {
    TriggerType.PROJECT_CREATED: {
        "id": "proj_sample", "name": "Nouveau Projet", "client": "Client Test",
        "created_at": "2024-12-04T12:00:00Z"
    },
    TriggerType.TASK_COMPLETED: {
        "id": "task_sample", "title": "Tâche complétée", "project_id": "proj_1",
        "completed_by": "Marie", "completed_at": "2024-12-04T12:00:00Z"
    },
    TriggerType.INVOICE_PAID: {
        "id": "inv_sample", "number": "FACT-001", "amount": 5000.00,
        "paid_at": "2024-12-04T12:00:00Z", "method": "virement"
    },
}

# API Endpoints
@router.get("/triggers")
async def list_triggers():
    """List available triggers for Zapier."""
    return {
        "triggers": [
            {"key": t.value, "name": t.value.replace(".", " ").replace("_", " ").title(),
             "sample": SAMPLE_TRIGGER_DATA.get(t, {})}
            for t in TriggerType
        ]
    }

@router.get("/actions")
async def list_actions():
    """List available actions for Zapier."""
    return {
        "actions": [
            {"key": a.value, "name": a.value.replace("_", " ").title()}
            for a in ActionType
        ]
    }

@router.post("/hooks/subscribe")
async def subscribe_webhook(trigger: TriggerType, target_url: str):
    """Subscribe to a webhook trigger."""
    sub = await WebhookManager.subscribe(trigger, target_url)
    return {"id": sub.id, "secret": sub.secret}

@router.delete("/hooks/{sub_id}")
async def unsubscribe_webhook(sub_id: str):
    """Unsubscribe from webhook."""
    success = await WebhookManager.unsubscribe(sub_id)
    return {"unsubscribed": success}

@router.get("/hooks")
async def list_webhooks():
    """List webhook subscriptions."""
    return {"subscriptions": await WebhookManager.list_subscriptions()}

@router.post("/actions/execute")
async def execute_action(action: ActionType, params: Dict[str, Any]):
    """Execute an action from Zapier/Make."""
    return await ActionExecutor.execute(action, params)

@router.get("/triggers/{trigger}/sample")
async def get_trigger_sample(trigger: TriggerType):
    """Get sample data for trigger (Zapier uses this)."""
    return SAMPLE_TRIGGER_DATA.get(trigger, {"message": "No sample available"})

@router.post("/triggers/{trigger}/poll")
async def poll_trigger(trigger: TriggerType, since: Optional[str] = None):
    """Poll for new trigger events (Zapier polling triggers)."""
    # Return recent events of this type
    return {"items": [SAMPLE_TRIGGER_DATA.get(trigger, {})]}

# Zapier OAuth endpoints
@router.get("/oauth/authorize")
async def oauth_authorize(client_id: str, redirect_uri: str):
    """Start OAuth flow."""
    return {"auth_url": await ZapierAuth.get_auth_url(client_id, redirect_uri)}

@router.post("/oauth/token")
async def oauth_token(code: str):
    """Exchange code for tokens."""
    return await ZapierAuth.exchange_code(code)

@router.get("/oauth/test")
async def oauth_test(authorization: str = Header(None)):
    """Test authentication (Zapier calls this)."""
    return await ZapierAuth.test_auth(authorization or "")

# Internal trigger function (called by other parts of the app)
async def fire_trigger(trigger: TriggerType, data: Dict):
    """Fire a trigger event to all subscribers."""
    count = await WebhookManager.trigger(trigger, data)
    return {"triggered": count}
