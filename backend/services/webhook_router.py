"""
CHE·NU Unified - Webhook Router & Handlers
═══════════════════════════════════════════════════════════════════════════════
Système de webhooks entrants pour sync temps réel.

Providers supportés:
- Stripe (paiements, subscriptions)
- Shopify (orders, products, inventory)
- HubSpot (contacts, deals)
- Slack (events, interactions)
- GitHub (push, PR, issues)
- Twilio (SMS status)

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Callable, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import logging
import hashlib
import hmac
import json
import asyncio

from fastapi import APIRouter, Request, HTTPException, Header, BackgroundTasks
from fastapi.responses import JSONResponse

logger = logging.getLogger("CHE·NU.Webhooks")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS & TYPES
# ═══════════════════════════════════════════════════════════════════════════════

class WebhookProvider(str, Enum):
    STRIPE = "stripe"
    SHOPIFY = "shopify"
    HUBSPOT = "hubspot"
    SLACK = "slack"
    GITHUB = "github"
    TWILIO = "twilio"
    QUICKBOOKS = "quickbooks"
    XERO = "xero"
    DOCUSIGN = "docusign"
    CALENDLY = "calendly"


class WebhookStatus(str, Enum):
    RECEIVED = "received"
    PROCESSING = "processing"
    PROCESSED = "processed"
    FAILED = "failed"
    IGNORED = "ignored"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class WebhookEvent:
    """Événement webhook reçu."""
    id: str
    provider: WebhookProvider
    event_type: str
    
    # Payload
    payload: Dict[str, Any]
    raw_body: bytes = b""
    
    # Headers
    headers: Dict[str, str] = field(default_factory=dict)
    
    # Status
    status: WebhookStatus = WebhookStatus.RECEIVED
    
    # Timing
    received_at: datetime = field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None
    
    # Result
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    
    # Retry
    retry_count: int = 0
    max_retries: int = 3


@dataclass
class WebhookConfig:
    """Configuration d'un webhook provider."""
    provider: WebhookProvider
    secret: str
    enabled: bool = True
    
    # Events to listen
    events: List[str] = field(default_factory=list)
    
    # Handler
    handler: Optional[Callable] = None


# ═══════════════════════════════════════════════════════════════════════════════
# SIGNATURE VERIFICATION
# ═══════════════════════════════════════════════════════════════════════════════

class SignatureVerifier:
    """Vérificateur de signatures webhooks."""
    
    @staticmethod
    def verify_stripe(
        payload: bytes,
        signature: str,
        secret: str
    ) -> bool:
        """Vérifie signature Stripe."""
        try:
            # Parse signature header
            elements = dict(item.split("=", 1) for item in signature.split(","))
            timestamp = elements.get("t", "")
            v1_signature = elements.get("v1", "")
            
            # Compute expected signature
            signed_payload = f"{timestamp}.{payload.decode()}"
            expected = hmac.new(
                secret.encode(),
                signed_payload.encode(),
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(v1_signature, expected)
        except Exception as e:
            logger.error(f"Stripe signature verification failed: {e}")
            return False
    
    @staticmethod
    def verify_shopify(
        payload: bytes,
        signature: str,
        secret: str
    ) -> bool:
        """Vérifie signature Shopify."""
        try:
            import base64
            computed = base64.b64encode(
                hmac.new(secret.encode(), payload, hashlib.sha256).digest()
            ).decode()
            return hmac.compare_digest(signature, computed)
        except Exception as e:
            logger.error(f"Shopify signature verification failed: {e}")
            return False
    
    @staticmethod
    def verify_hubspot(
        payload: bytes,
        signature: str,
        secret: str,
        request_uri: str,
        method: str = "POST"
    ) -> bool:
        """Vérifie signature HubSpot v3."""
        try:
            source_string = f"{method}{request_uri}{payload.decode()}"
            computed = hmac.new(
                secret.encode(),
                source_string.encode(),
                hashlib.sha256
            ).hexdigest()
            return hmac.compare_digest(signature, computed)
        except Exception as e:
            logger.error(f"HubSpot signature verification failed: {e}")
            return False
    
    @staticmethod
    def verify_slack(
        payload: bytes,
        signature: str,
        timestamp: str,
        secret: str
    ) -> bool:
        """Vérifie signature Slack."""
        try:
            sig_basestring = f"v0:{timestamp}:{payload.decode()}"
            computed = "v0=" + hmac.new(
                secret.encode(),
                sig_basestring.encode(),
                hashlib.sha256
            ).hexdigest()
            return hmac.compare_digest(signature, computed)
        except Exception as e:
            logger.error(f"Slack signature verification failed: {e}")
            return False
    
    @staticmethod
    def verify_github(
        payload: bytes,
        signature: str,
        secret: str
    ) -> bool:
        """Vérifie signature GitHub."""
        try:
            computed = "sha256=" + hmac.new(
                secret.encode(),
                payload,
                hashlib.sha256
            ).hexdigest()
            return hmac.compare_digest(signature, computed)
        except Exception as e:
            logger.error(f"GitHub signature verification failed: {e}")
            return False


# ═══════════════════════════════════════════════════════════════════════════════
# WEBHOOK HANDLERS
# ═══════════════════════════════════════════════════════════════════════════════

class WebhookHandlers:
    """Handlers par défaut pour les webhooks."""
    
    @staticmethod
    async def handle_stripe(event: WebhookEvent) -> Dict[str, Any]:
        """Handler Stripe."""
        event_type = event.event_type
        data = event.payload.get("data", {}).get("object", {})
        
        result = {"handled": True, "event_type": event_type}
        
        if event_type == "payment_intent.succeeded":
            result["action"] = "payment_completed"
            result["amount"] = data.get("amount", 0) / 100
            result["currency"] = data.get("currency", "").upper()
            logger.info(f"💰 Payment succeeded: {result['amount']} {result['currency']}")
        
        elif event_type == "customer.subscription.created":
            result["action"] = "subscription_created"
            result["customer_id"] = data.get("customer")
            logger.info(f"📦 Subscription created for {result['customer_id']}")
        
        elif event_type == "invoice.paid":
            result["action"] = "invoice_paid"
            result["invoice_id"] = data.get("id")
            logger.info(f"✅ Invoice paid: {result['invoice_id']}")
        
        elif event_type == "charge.refunded":
            result["action"] = "refund_processed"
            result["charge_id"] = data.get("id")
            logger.info(f"↩️ Refund processed: {result['charge_id']}")
        
        return result
    
    @staticmethod
    async def handle_shopify(event: WebhookEvent) -> Dict[str, Any]:
        """Handler Shopify."""
        event_type = event.event_type
        data = event.payload
        
        result = {"handled": True, "event_type": event_type}
        
        if event_type == "orders/create":
            result["action"] = "new_order"
            result["order_id"] = data.get("id")
            result["total"] = data.get("total_price")
            logger.info(f"🛒 New order: #{data.get('order_number')} - ${result['total']}")
        
        elif event_type == "orders/paid":
            result["action"] = "order_paid"
            result["order_id"] = data.get("id")
            logger.info(f"💵 Order paid: #{data.get('order_number')}")
        
        elif event_type == "orders/fulfilled":
            result["action"] = "order_fulfilled"
            result["order_id"] = data.get("id")
            logger.info(f"📦 Order fulfilled: #{data.get('order_number')}")
        
        elif event_type == "products/update":
            result["action"] = "product_updated"
            result["product_id"] = data.get("id")
            logger.info(f"📝 Product updated: {data.get('title')}")
        
        elif event_type == "inventory_levels/update":
            result["action"] = "inventory_updated"
            result["inventory_item_id"] = data.get("inventory_item_id")
            result["available"] = data.get("available")
            logger.info(f"📊 Inventory updated: {result['available']} available")
        
        return result
    
    @staticmethod
    async def handle_hubspot(event: WebhookEvent) -> Dict[str, Any]:
        """Handler HubSpot."""
        events = event.payload if isinstance(event.payload, list) else [event.payload]
        results = []
        
        for evt in events:
            event_type = evt.get("subscriptionType", "")
            object_id = evt.get("objectId")
            
            result = {"event_type": event_type, "object_id": object_id}
            
            if "contact" in event_type.lower():
                result["object_type"] = "contact"
                logger.info(f"👤 HubSpot contact event: {event_type}")
            
            elif "deal" in event_type.lower():
                result["object_type"] = "deal"
                logger.info(f"💼 HubSpot deal event: {event_type}")
            
            results.append(result)
        
        return {"handled": True, "events": results}
    
    @staticmethod
    async def handle_slack(event: WebhookEvent) -> Dict[str, Any]:
        """Handler Slack."""
        data = event.payload
        event_type = data.get("type", "")
        
        # URL verification challenge
        if event_type == "url_verification":
            return {"challenge": data.get("challenge")}
        
        result = {"handled": True, "event_type": event_type}
        
        if event_type == "event_callback":
            inner_event = data.get("event", {})
            inner_type = inner_event.get("type", "")
            
            if inner_type == "message":
                result["action"] = "message_received"
                result["channel"] = inner_event.get("channel")
                result["user"] = inner_event.get("user")
                logger.info(f"💬 Slack message in {result['channel']}")
            
            elif inner_type == "app_mention":
                result["action"] = "app_mentioned"
                result["channel"] = inner_event.get("channel")
                logger.info(f"🔔 App mentioned in {result['channel']}")
        
        return result
    
    @staticmethod
    async def handle_github(event: WebhookEvent) -> Dict[str, Any]:
        """Handler GitHub."""
        event_type = event.event_type
        data = event.payload
        
        result = {"handled": True, "event_type": event_type}
        
        if event_type == "push":
            result["action"] = "push"
            result["ref"] = data.get("ref")
            result["commits"] = len(data.get("commits", []))
            logger.info(f"📤 Push to {result['ref']}: {result['commits']} commits")
        
        elif event_type == "pull_request":
            action = data.get("action")
            pr = data.get("pull_request", {})
            result["action"] = f"pr_{action}"
            result["pr_number"] = pr.get("number")
            result["title"] = pr.get("title")
            logger.info(f"🔀 PR #{result['pr_number']}: {action}")
        
        elif event_type == "issues":
            action = data.get("action")
            issue = data.get("issue", {})
            result["action"] = f"issue_{action}"
            result["issue_number"] = issue.get("number")
            logger.info(f"🎫 Issue #{result['issue_number']}: {action}")
        
        return result


# ═══════════════════════════════════════════════════════════════════════════════
# WEBHOOK MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class WebhookManager:
    """
    🎯 Gestionnaire de Webhooks
    
    Gère l'enregistrement, la vérification et le dispatch des webhooks.
    """
    
    def __init__(self):
        self._configs: Dict[WebhookProvider, WebhookConfig] = {}
        self._handlers: Dict[WebhookProvider, Callable] = {
            WebhookProvider.STRIPE: WebhookHandlers.handle_stripe,
            WebhookProvider.SHOPIFY: WebhookHandlers.handle_shopify,
            WebhookProvider.HUBSPOT: WebhookHandlers.handle_hubspot,
            WebhookProvider.SLACK: WebhookHandlers.handle_slack,
            WebhookProvider.GITHUB: WebhookHandlers.handle_github,
        }
        self._event_log: List[WebhookEvent] = []
        self._max_log_size = 1000
    
    def register_provider(
        self,
        provider: WebhookProvider,
        secret: str,
        events: Optional[List[str]] = None,
        handler: Optional[Callable] = None
    ) -> None:
        """Enregistre un provider webhook."""
        self._configs[provider] = WebhookConfig(
            provider=provider,
            secret=secret,
            events=events or [],
            handler=handler
        )
        
        if handler:
            self._handlers[provider] = handler
        
        logger.info(f"✅ Webhook registered: {provider.value}")
    
    def verify_signature(
        self,
        provider: WebhookProvider,
        payload: bytes,
        headers: Dict[str, str],
        **kwargs
    ) -> bool:
        """Vérifie la signature d'un webhook."""
        config = self._configs.get(provider)
        if not config:
            logger.warning(f"No config for provider: {provider}")
            return False
        
        secret = config.secret
        
        if provider == WebhookProvider.STRIPE:
            signature = headers.get("stripe-signature", "")
            return SignatureVerifier.verify_stripe(payload, signature, secret)
        
        elif provider == WebhookProvider.SHOPIFY:
            signature = headers.get("x-shopify-hmac-sha256", "")
            return SignatureVerifier.verify_shopify(payload, signature, secret)
        
        elif provider == WebhookProvider.HUBSPOT:
            signature = headers.get("x-hubspot-signature-v3", "")
            request_uri = kwargs.get("request_uri", "")
            return SignatureVerifier.verify_hubspot(payload, signature, secret, request_uri)
        
        elif provider == WebhookProvider.SLACK:
            signature = headers.get("x-slack-signature", "")
            timestamp = headers.get("x-slack-request-timestamp", "")
            return SignatureVerifier.verify_slack(payload, signature, timestamp, secret)
        
        elif provider == WebhookProvider.GITHUB:
            signature = headers.get("x-hub-signature-256", "")
            return SignatureVerifier.verify_github(payload, signature, secret)
        
        # Default: skip verification
        return True
    
    async def process_webhook(
        self,
        provider: WebhookProvider,
        event_type: str,
        payload: Dict[str, Any],
        headers: Dict[str, str],
        raw_body: bytes = b""
    ) -> WebhookEvent:
        """Traite un webhook."""
        import uuid
        
        event = WebhookEvent(
            id=f"wh_{uuid.uuid4().hex[:12]}",
            provider=provider,
            event_type=event_type,
            payload=payload,
            raw_body=raw_body,
            headers=headers
        )
        
        # Get handler
        handler = self._handlers.get(provider)
        
        if handler:
            try:
                event.status = WebhookStatus.PROCESSING
                result = await handler(event)
                event.result = result
                event.status = WebhookStatus.PROCESSED
                event.processed_at = datetime.utcnow()
            except Exception as e:
                logger.error(f"Webhook handler error: {e}")
                event.status = WebhookStatus.FAILED
                event.error = str(e)
        else:
            event.status = WebhookStatus.IGNORED
        
        # Log event
        self._log_event(event)
        
        return event
    
    def _log_event(self, event: WebhookEvent) -> None:
        """Log un événement."""
        self._event_log.append(event)
        
        # Trim if too large
        if len(self._event_log) > self._max_log_size:
            self._event_log = self._event_log[-self._max_log_size:]
    
    def get_recent_events(
        self,
        provider: Optional[WebhookProvider] = None,
        limit: int = 50
    ) -> List[WebhookEvent]:
        """Récupère les événements récents."""
        events = self._event_log
        
        if provider:
            events = [e for e in events if e.provider == provider]
        
        return events[-limit:]
    
    def get_stats(self) -> Dict[str, Any]:
        """Statistiques des webhooks."""
        total = len(self._event_log)
        by_provider = {}
        by_status = {}
        
        for event in self._event_log:
            provider = event.provider.value
            status = event.status.value
            
            by_provider[provider] = by_provider.get(provider, 0) + 1
            by_status[status] = by_status.get(status, 0) + 1
        
        return {
            "total_events": total,
            "by_provider": by_provider,
            "by_status": by_status,
            "providers_configured": [p.value for p in self._configs.keys()]
        }


# Singleton
_webhook_manager: Optional[WebhookManager] = None


def get_webhook_manager() -> WebhookManager:
    global _webhook_manager
    if _webhook_manager is None:
        _webhook_manager = WebhookManager()
    return _webhook_manager


# ═══════════════════════════════════════════════════════════════════════════════
# FASTAPI ROUTER
# ═══════════════════════════════════════════════════════════════════════════════

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.post("/stripe")
async def handle_stripe_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    stripe_signature: str = Header(None, alias="stripe-signature")
):
    """Endpoint webhook Stripe."""
    manager = get_webhook_manager()
    
    body = await request.body()
    headers = dict(request.headers)
    
    # Verify signature
    if not manager.verify_signature(WebhookProvider.STRIPE, body, headers):
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    payload = json.loads(body)
    event_type = payload.get("type", "unknown")
    
    # Process
    event = await manager.process_webhook(
        WebhookProvider.STRIPE,
        event_type,
        payload,
        headers,
        body
    )
    
    return {"received": True, "event_id": event.id}


@router.post("/shopify")
async def handle_shopify_webhook(
    request: Request,
    x_shopify_topic: str = Header(None, alias="x-shopify-topic"),
    x_shopify_hmac_sha256: str = Header(None, alias="x-shopify-hmac-sha256")
):
    """Endpoint webhook Shopify."""
    manager = get_webhook_manager()
    
    body = await request.body()
    headers = dict(request.headers)
    
    # Verify signature
    if not manager.verify_signature(WebhookProvider.SHOPIFY, body, headers):
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    payload = json.loads(body)
    
    event = await manager.process_webhook(
        WebhookProvider.SHOPIFY,
        x_shopify_topic or "unknown",
        payload,
        headers,
        body
    )
    
    return {"received": True, "event_id": event.id}


@router.post("/hubspot")
async def handle_hubspot_webhook(request: Request):
    """Endpoint webhook HubSpot."""
    manager = get_webhook_manager()
    
    body = await request.body()
    headers = dict(request.headers)
    payload = json.loads(body)
    
    event = await manager.process_webhook(
        WebhookProvider.HUBSPOT,
        "batch",
        payload,
        headers,
        body
    )
    
    return {"received": True, "event_id": event.id}


@router.post("/slack")
async def handle_slack_webhook(request: Request):
    """Endpoint webhook Slack."""
    manager = get_webhook_manager()
    
    body = await request.body()
    headers = dict(request.headers)
    payload = json.loads(body)
    
    # URL verification
    if payload.get("type") == "url_verification":
        return {"challenge": payload.get("challenge")}
    
    event = await manager.process_webhook(
        WebhookProvider.SLACK,
        payload.get("type", "unknown"),
        payload,
        headers,
        body
    )
    
    return {"received": True, "event_id": event.id}


@router.post("/github")
async def handle_github_webhook(
    request: Request,
    x_github_event: str = Header(None, alias="x-github-event")
):
    """Endpoint webhook GitHub."""
    manager = get_webhook_manager()
    
    body = await request.body()
    headers = dict(request.headers)
    
    # Verify signature
    if not manager.verify_signature(WebhookProvider.GITHUB, body, headers):
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    payload = json.loads(body)
    
    event = await manager.process_webhook(
        WebhookProvider.GITHUB,
        x_github_event or "unknown",
        payload,
        headers,
        body
    )
    
    return {"received": True, "event_id": event.id}


@router.get("/stats")
async def get_webhook_stats():
    """Statistiques des webhooks."""
    manager = get_webhook_manager()
    return manager.get_stats()


@router.get("/events")
async def get_webhook_events(
    provider: Optional[str] = None,
    limit: int = 50
):
    """Liste les événements récents."""
    manager = get_webhook_manager()
    
    provider_enum = WebhookProvider(provider) if provider else None
    events = manager.get_recent_events(provider_enum, limit)
    
    return {
        "events": [
            {
                "id": e.id,
                "provider": e.provider.value,
                "event_type": e.event_type,
                "status": e.status.value,
                "received_at": e.received_at.isoformat(),
                "result": e.result
            }
            for e in events
        ],
        "total": len(events)
    }


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    "WebhookProvider",
    "WebhookStatus",
    
    # Data Classes
    "WebhookEvent",
    "WebhookConfig",
    
    # Classes
    "SignatureVerifier",
    "WebhookHandlers",
    "WebhookManager",
    
    # Functions
    "get_webhook_manager",
    
    # Router
    "router"
]
