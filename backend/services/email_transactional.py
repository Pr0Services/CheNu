"""
CHE·NU Unified - Email Transactional Integrations
═══════════════════════════════════════════════════════════════════════════════
Clients pour SendGrid, Postmark, AWS SES, SparkPost.

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import logging
import aiohttp
import base64

logger = logging.getLogger("CHE·NU.Integrations.Email")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class EmailStatus(str, Enum):
    QUEUED = "queued"
    SENT = "sent"
    DELIVERED = "delivered"
    OPENED = "opened"
    CLICKED = "clicked"
    BOUNCED = "bounced"
    SPAM = "spam"
    UNSUBSCRIBED = "unsubscribed"
    FAILED = "failed"


class EmailType(str, Enum):
    TRANSACTIONAL = "transactional"
    MARKETING = "marketing"
    NOTIFICATION = "notification"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class EmailAddress:
    """Adresse email."""
    email: str
    name: Optional[str] = None


@dataclass
class EmailAttachment:
    """Pièce jointe."""
    filename: str
    content: str  # Base64 encoded
    content_type: str = "application/octet-stream"


@dataclass
class Email:
    """Email à envoyer."""
    to: List[EmailAddress]
    subject: str
    
    # Content
    html: Optional[str] = None
    text: Optional[str] = None
    
    # From
    from_email: Optional[EmailAddress] = None
    reply_to: Optional[EmailAddress] = None
    
    # CC/BCC
    cc: List[EmailAddress] = field(default_factory=list)
    bcc: List[EmailAddress] = field(default_factory=list)
    
    # Template
    template_id: Optional[str] = None
    template_data: Dict[str, Any] = field(default_factory=dict)
    
    # Attachments
    attachments: List[EmailAttachment] = field(default_factory=list)
    
    # Metadata
    tags: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    # Tracking
    track_opens: bool = True
    track_clicks: bool = True


@dataclass
class EmailResult:
    """Résultat d'envoi d'email."""
    message_id: str
    status: EmailStatus
    
    to: str
    subject: str
    
    # Timing
    sent_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    opened_at: Optional[datetime] = None
    
    # Stats
    opens: int = 0
    clicks: int = 0
    
    # Error
    error: Optional[str] = None


@dataclass
class EmailStats:
    """Statistiques d'emails."""
    sent: int = 0
    delivered: int = 0
    opened: int = 0
    clicked: int = 0
    bounced: int = 0
    spam_reports: int = 0
    unsubscribes: int = 0
    
    # Rates
    delivery_rate: float = 0.0
    open_rate: float = 0.0
    click_rate: float = 0.0
    bounce_rate: float = 0.0
    
    # Period
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


@dataclass
class EmailTemplate:
    """Template d'email."""
    id: str
    name: str
    
    subject: Optional[str] = None
    html: Optional[str] = None
    text: Optional[str] = None
    
    # Variables
    variables: List[str] = field(default_factory=list)
    
    # Metadata
    active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# ═══════════════════════════════════════════════════════════════════════════════
# SENDGRID CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class SendGridClient:
    """
    🔵 Client SendGrid
    
    Fonctionnalités:
    - Envoi d'emails (single & batch)
    - Templates dynamiques
    - Stats & tracking
    - Suppressions management
    - Webhooks
    """
    
    BASE_URL = "https://api.sendgrid.com/v3"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    # --- Send Email ---
    async def send_email(self, email: Email) -> EmailResult:
        """Envoie un email."""
        payload = self._build_send_payload(email)
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/mail/send",
                headers=self._get_headers(),
                json=payload
            ) as resp:
                # SendGrid returns 202 on success with no body
                if resp.status == 202:
                    message_id = resp.headers.get("X-Message-Id", "")
                    return EmailResult(
                        message_id=message_id,
                        status=EmailStatus.QUEUED,
                        to=email.to[0].email,
                        subject=email.subject,
                        sent_at=datetime.now()
                    )
                else:
                    error = await resp.json()
                    return EmailResult(
                        message_id="",
                        status=EmailStatus.FAILED,
                        to=email.to[0].email,
                        subject=email.subject,
                        error=str(error)
                    )
    
    async def send_batch(self, emails: List[Email]) -> List[EmailResult]:
        """Envoie plusieurs emails."""
        results = []
        for email in emails:
            result = await self.send_email(email)
            results.append(result)
        return results
    
    def _build_send_payload(self, email: Email) -> Dict[str, Any]:
        """Construit le payload pour l'API."""
        payload = {
            "personalizations": [{
                "to": [{"email": addr.email, "name": addr.name} for addr in email.to]
            }],
            "subject": email.subject,
            "tracking_settings": {
                "open_tracking": {"enable": email.track_opens},
                "click_tracking": {"enable": email.track_clicks}
            }
        }
        
        # Content
        content = []
        if email.text:
            content.append({"type": "text/plain", "value": email.text})
        if email.html:
            content.append({"type": "text/html", "value": email.html})
        
        if content:
            payload["content"] = content
        
        # From
        if email.from_email:
            payload["from"] = {"email": email.from_email.email, "name": email.from_email.name}
        
        # Reply-to
        if email.reply_to:
            payload["reply_to"] = {"email": email.reply_to.email, "name": email.reply_to.name}
        
        # CC/BCC
        if email.cc:
            payload["personalizations"][0]["cc"] = [{"email": a.email} for a in email.cc]
        if email.bcc:
            payload["personalizations"][0]["bcc"] = [{"email": a.email} for a in email.bcc]
        
        # Template
        if email.template_id:
            payload["template_id"] = email.template_id
            if email.template_data:
                payload["personalizations"][0]["dynamic_template_data"] = email.template_data
        
        # Attachments
        if email.attachments:
            payload["attachments"] = [
                {
                    "content": att.content,
                    "filename": att.filename,
                    "type": att.content_type
                }
                for att in email.attachments
            ]
        
        # Categories/Tags
        if email.tags:
            payload["categories"] = email.tags
        
        # Custom args
        if email.metadata:
            payload["personalizations"][0]["custom_args"] = email.metadata
        
        return payload
    
    # --- Templates ---
    async def list_templates(self, generations: str = "dynamic") -> List[EmailTemplate]:
        """Liste les templates."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/templates",
                headers=self._get_headers(),
                params={"generations": generations, "page_size": 100}
            ) as resp:
                data = await resp.json()
                return [self._parse_template(t) for t in data.get("templates", [])]
    
    async def get_template(self, template_id: str) -> EmailTemplate:
        """Récupère un template."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/templates/{template_id}",
                headers=self._get_headers()
            ) as resp:
                data = await resp.json()
                return self._parse_template(data)
    
    async def create_template(
        self,
        name: str,
        generation: str = "dynamic"
    ) -> EmailTemplate:
        """Crée un template."""
        payload = {"name": name, "generation": generation}
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/templates",
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                return self._parse_template(data)
    
    # --- Stats ---
    async def get_stats(
        self,
        start_date: str,
        end_date: Optional[str] = None,
        aggregated_by: str = "day"
    ) -> EmailStats:
        """Récupère les statistiques."""
        params = {
            "start_date": start_date,
            "aggregated_by": aggregated_by
        }
        if end_date:
            params["end_date"] = end_date
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/stats",
                headers=self._get_headers(),
                params=params
            ) as resp:
                data = await resp.json()
                return self._parse_stats(data)
    
    async def get_global_stats(self) -> Dict[str, Any]:
        """Stats globales."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/stats/global",
                headers=self._get_headers()
            ) as resp:
                return await resp.json()
    
    # --- Suppressions ---
    async def list_bounces(self) -> List[Dict[str, Any]]:
        """Liste les bounces."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/suppression/bounces",
                headers=self._get_headers()
            ) as resp:
                return await resp.json()
    
    async def list_spam_reports(self) -> List[Dict[str, Any]]:
        """Liste les spam reports."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/suppression/spam_reports",
                headers=self._get_headers()
            ) as resp:
                return await resp.json()
    
    async def list_unsubscribes(self) -> List[Dict[str, Any]]:
        """Liste les unsubscribes."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/suppression/unsubscribes",
                headers=self._get_headers()
            ) as resp:
                return await resp.json()
    
    # --- Parse helpers ---
    def _parse_template(self, data: Dict) -> EmailTemplate:
        versions = data.get("versions", [])
        active_version = next((v for v in versions if v.get("active")), versions[0] if versions else {})
        
        return EmailTemplate(
            id=data.get("id", ""),
            name=data.get("name", ""),
            subject=active_version.get("subject"),
            html=active_version.get("html_content"),
            text=active_version.get("plain_content"),
            active=bool(active_version.get("active")),
            updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")) if data.get("updated_at") else None
        )
    
    def _parse_stats(self, data: List[Dict]) -> EmailStats:
        totals = {"requests": 0, "delivered": 0, "opens": 0, "clicks": 0, "bounces": 0, "spam_reports": 0}
        
        for day in data:
            metrics = day.get("stats", [{}])[0].get("metrics", {})
            for key in totals:
                totals[key] += metrics.get(key, 0)
        
        sent = totals["requests"]
        
        return EmailStats(
            sent=sent,
            delivered=totals["delivered"],
            opened=totals["opens"],
            clicked=totals["clicks"],
            bounced=totals["bounces"],
            spam_reports=totals["spam_reports"],
            delivery_rate=totals["delivered"] / sent * 100 if sent else 0,
            open_rate=totals["opens"] / totals["delivered"] * 100 if totals["delivered"] else 0,
            click_rate=totals["clicks"] / totals["opens"] * 100 if totals["opens"] else 0,
            bounce_rate=totals["bounces"] / sent * 100 if sent else 0
        )


# ═══════════════════════════════════════════════════════════════════════════════
# POSTMARK CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class PostmarkClient:
    """
    🟡 Client Postmark
    
    Fonctionnalités:
    - Envoi d'emails
    - Templates
    - Message streams
    - Stats & delivery
    - Inbound processing
    """
    
    BASE_URL = "https://api.postmarkapp.com"
    
    def __init__(self, server_token: str):
        self.server_token = server_token
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "X-Postmark-Server-Token": self.server_token,
            "Content-Type": "application/json"
        }
    
    # --- Send Email ---
    async def send_email(self, email: Email) -> EmailResult:
        """Envoie un email."""
        payload = {
            "From": f"{email.from_email.name} <{email.from_email.email}>" if email.from_email else None,
            "To": ", ".join(f"{a.name} <{a.email}>" if a.name else a.email for a in email.to),
            "Subject": email.subject,
            "HtmlBody": email.html,
            "TextBody": email.text,
            "TrackOpens": email.track_opens,
            "TrackLinks": "HtmlAndText" if email.track_clicks else "None"
        }
        
        # Reply-to
        if email.reply_to:
            payload["ReplyTo"] = email.reply_to.email
        
        # CC/BCC
        if email.cc:
            payload["Cc"] = ", ".join(a.email for a in email.cc)
        if email.bcc:
            payload["Bcc"] = ", ".join(a.email for a in email.bcc)
        
        # Tags
        if email.tags:
            payload["Tag"] = email.tags[0]  # Postmark supports single tag
        
        # Metadata
        if email.metadata:
            payload["Metadata"] = email.metadata
        
        # Attachments
        if email.attachments:
            payload["Attachments"] = [
                {
                    "Name": att.filename,
                    "Content": att.content,
                    "ContentType": att.content_type
                }
                for att in email.attachments
            ]
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/email",
                headers=self._get_headers(),
                json={k: v for k, v in payload.items() if v}
            ) as resp:
                data = await resp.json()
                
                if resp.status == 200:
                    return EmailResult(
                        message_id=data.get("MessageID", ""),
                        status=EmailStatus.SENT,
                        to=email.to[0].email,
                        subject=email.subject,
                        sent_at=datetime.now()
                    )
                else:
                    return EmailResult(
                        message_id="",
                        status=EmailStatus.FAILED,
                        to=email.to[0].email,
                        subject=email.subject,
                        error=data.get("Message", str(data))
                    )
    
    async def send_with_template(
        self,
        template_id: str,
        to: str,
        template_model: Dict[str, Any],
        from_email: Optional[str] = None,
        **kwargs
    ) -> EmailResult:
        """Envoie avec un template."""
        payload = {
            "TemplateId": int(template_id),
            "To": to,
            "TemplateModel": template_model,
            "From": from_email
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/email/withTemplate",
                headers=self._get_headers(),
                json={k: v for k, v in payload.items() if v}
            ) as resp:
                data = await resp.json()
                
                return EmailResult(
                    message_id=data.get("MessageID", ""),
                    status=EmailStatus.SENT if resp.status == 200 else EmailStatus.FAILED,
                    to=to,
                    subject="Template email",
                    error=data.get("Message") if resp.status != 200 else None
                )
    
    async def send_batch(self, emails: List[Dict[str, Any]]) -> List[EmailResult]:
        """Envoie un batch d'emails."""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/email/batch",
                headers=self._get_headers(),
                json=emails
            ) as resp:
                data = await resp.json()
                return [
                    EmailResult(
                        message_id=r.get("MessageID", ""),
                        status=EmailStatus.SENT if r.get("ErrorCode") == 0 else EmailStatus.FAILED,
                        to=r.get("To", ""),
                        subject="",
                        error=r.get("Message") if r.get("ErrorCode") != 0 else None
                    )
                    for r in data
                ]
    
    # --- Templates ---
    async def list_templates(self, count: int = 100, offset: int = 0) -> List[EmailTemplate]:
        """Liste les templates."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/templates",
                headers=self._get_headers(),
                params={"count": count, "offset": offset}
            ) as resp:
                data = await resp.json()
                return [self._parse_template(t) for t in data.get("Templates", [])]
    
    async def get_template(self, template_id: str) -> EmailTemplate:
        """Récupère un template."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/templates/{template_id}",
                headers=self._get_headers()
            ) as resp:
                data = await resp.json()
                return self._parse_template(data)
    
    async def create_template(
        self,
        name: str,
        subject: str,
        html_body: str,
        text_body: Optional[str] = None
    ) -> EmailTemplate:
        """Crée un template."""
        payload = {
            "Name": name,
            "Subject": subject,
            "HtmlBody": html_body,
            "TextBody": text_body
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/templates",
                headers=self._get_headers(),
                json={k: v for k, v in payload.items() if v}
            ) as resp:
                data = await resp.json()
                return self._parse_template(data)
    
    # --- Stats ---
    async def get_outbound_stats(
        self,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        tag: Optional[str] = None
    ) -> EmailStats:
        """Statistiques des emails sortants."""
        params = {}
        if from_date:
            params["fromdate"] = from_date
        if to_date:
            params["todate"] = to_date
        if tag:
            params["tag"] = tag
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/stats/outbound",
                headers=self._get_headers(),
                params=params
            ) as resp:
                data = await resp.json()
                return self._parse_stats(data)
    
    async def get_delivery_stats(self) -> Dict[str, Any]:
        """Stats de délivraison."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/deliverystats",
                headers=self._get_headers()
            ) as resp:
                return await resp.json()
    
    # --- Message Details ---
    async def get_message(self, message_id: str) -> Dict[str, Any]:
        """Détails d'un message."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/messages/outbound/{message_id}/details",
                headers=self._get_headers()
            ) as resp:
                return await resp.json()
    
    # --- Parse helpers ---
    def _parse_template(self, data: Dict) -> EmailTemplate:
        return EmailTemplate(
            id=str(data.get("TemplateId", "")),
            name=data.get("Name", ""),
            subject=data.get("Subject"),
            html=data.get("HtmlBody"),
            text=data.get("TextBody"),
            active=data.get("Active", True)
        )
    
    def _parse_stats(self, data: Dict) -> EmailStats:
        sent = data.get("Sent", 0)
        
        return EmailStats(
            sent=sent,
            bounced=data.get("Bounced", 0),
            spam_reports=data.get("SpamComplaints", 0),
            opened=data.get("Opens", 0),
            clicked=data.get("Clicks", 0) if isinstance(data.get("Clicks"), int) else 0,
            open_rate=data.get("Opens", 0) / sent * 100 if sent else 0,
            bounce_rate=data.get("Bounced", 0) / sent * 100 if sent else 0
        )


# ═══════════════════════════════════════════════════════════════════════════════
# AWS SES CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class AWSSESClient:
    """
    🟠 Client AWS SES (Simple Email Service)
    
    Fonctionnalités:
    - Envoi d'emails
    - Templates
    - Configuration sets
    - Sending quotas
    """
    
    def __init__(
        self,
        access_key: str,
        secret_key: str,
        region: str = "us-east-1"
    ):
        self.access_key = access_key
        self.secret_key = secret_key
        self.region = region
        # Note: In production, use boto3
    
    async def send_email(
        self,
        to: List[str],
        subject: str,
        html_body: Optional[str] = None,
        text_body: Optional[str] = None,
        from_email: str = "",
        **kwargs
    ) -> EmailResult:
        """
        Envoie un email via SES.
        Note: Simplified version - use boto3 in production.
        """
        try:
            import boto3
            
            client = boto3.client(
                'ses',
                region_name=self.region,
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret_key
            )
            
            body = {}
            if html_body:
                body["Html"] = {"Charset": "UTF-8", "Data": html_body}
            if text_body:
                body["Text"] = {"Charset": "UTF-8", "Data": text_body}
            
            response = client.send_email(
                Source=from_email,
                Destination={"ToAddresses": to},
                Message={
                    "Subject": {"Charset": "UTF-8", "Data": subject},
                    "Body": body
                }
            )
            
            return EmailResult(
                message_id=response.get("MessageId", ""),
                status=EmailStatus.SENT,
                to=to[0],
                subject=subject,
                sent_at=datetime.now()
            )
            
        except ImportError:
            logger.warning("boto3 not installed, AWS SES unavailable")
            return EmailResult(
                message_id="",
                status=EmailStatus.FAILED,
                to=to[0] if to else "",
                subject=subject,
                error="boto3 not installed"
            )
        except Exception as e:
            return EmailResult(
                message_id="",
                status=EmailStatus.FAILED,
                to=to[0] if to else "",
                subject=subject,
                error=str(e)
            )
    
    async def get_send_quota(self) -> Dict[str, Any]:
        """Récupère le quota d'envoi."""
        try:
            import boto3
            
            client = boto3.client(
                'ses',
                region_name=self.region,
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret_key
            )
            
            response = client.get_send_quota()
            
            return {
                "max_24_hour_send": response.get("Max24HourSend", 0),
                "max_send_rate": response.get("MaxSendRate", 0),
                "sent_last_24_hours": response.get("SentLast24Hours", 0)
            }
        except:
            return {}


# ═══════════════════════════════════════════════════════════════════════════════
# EMAIL SERVICE UNIFIÉ
# ═══════════════════════════════════════════════════════════════════════════════

class EmailService:
    """
    🎯 Service Email Unifié
    
    Gère tous les providers d'email avec une interface commune.
    """
    
    def __init__(self):
        self._sendgrid_clients: Dict[str, SendGridClient] = {}
        self._postmark_clients: Dict[str, PostmarkClient] = {}
        self._ses_clients: Dict[str, AWSSESClient] = {}
        
        # Default provider
        self._default_provider: Optional[str] = None
    
    # --- Registration ---
    def register_sendgrid(self, account_id: str, api_key: str) -> None:
        self._sendgrid_clients[account_id] = SendGridClient(api_key)
        if not self._default_provider:
            self._default_provider = f"sendgrid:{account_id}"
        logger.info(f"✅ SendGrid registered: {account_id}")
    
    def register_postmark(self, account_id: str, server_token: str) -> None:
        self._postmark_clients[account_id] = PostmarkClient(server_token)
        if not self._default_provider:
            self._default_provider = f"postmark:{account_id}"
        logger.info(f"✅ Postmark registered: {account_id}")
    
    def register_ses(
        self,
        account_id: str,
        access_key: str,
        secret_key: str,
        region: str = "us-east-1"
    ) -> None:
        self._ses_clients[account_id] = AWSSESClient(access_key, secret_key, region)
        if not self._default_provider:
            self._default_provider = f"ses:{account_id}"
        logger.info(f"✅ AWS SES registered: {account_id}")
    
    # --- Unified Send ---
    async def send_email(
        self,
        email: Email,
        provider: Optional[str] = None
    ) -> EmailResult:
        """Envoie un email via le provider spécifié ou par défaut."""
        if not provider:
            provider = self._default_provider
        
        if not provider:
            raise ValueError("No email provider configured")
        
        provider_type, account_id = provider.split(":", 1)
        
        if provider_type == "sendgrid" and account_id in self._sendgrid_clients:
            return await self._sendgrid_clients[account_id].send_email(email)
        elif provider_type == "postmark" and account_id in self._postmark_clients:
            return await self._postmark_clients[account_id].send_email(email)
        elif provider_type == "ses" and account_id in self._ses_clients:
            return await self._ses_clients[account_id].send_email(
                to=[a.email for a in email.to],
                subject=email.subject,
                html_body=email.html,
                text_body=email.text,
                from_email=email.from_email.email if email.from_email else ""
            )
        
        raise ValueError(f"Provider not found: {provider}")
    
    async def send_simple(
        self,
        to: str,
        subject: str,
        html: Optional[str] = None,
        text: Optional[str] = None,
        from_email: Optional[str] = None,
        from_name: Optional[str] = None
    ) -> EmailResult:
        """Envoi simplifié."""
        email = Email(
            to=[EmailAddress(email=to)],
            subject=subject,
            html=html,
            text=text,
            from_email=EmailAddress(email=from_email, name=from_name) if from_email else None
        )
        return await self.send_email(email)
    
    async def get_stats(
        self,
        provider: Optional[str] = None,
        start_date: Optional[str] = None
    ) -> EmailStats:
        """Stats du provider."""
        if not provider:
            provider = self._default_provider
        
        if not provider:
            return EmailStats()
        
        provider_type, account_id = provider.split(":", 1)
        
        if provider_type == "sendgrid" and account_id in self._sendgrid_clients:
            return await self._sendgrid_clients[account_id].get_stats(
                start_date=start_date or "2024-01-01"
            )
        elif provider_type == "postmark" and account_id in self._postmark_clients:
            return await self._postmark_clients[account_id].get_outbound_stats()
        
        return EmailStats()


def create_email_service() -> EmailService:
    """Factory pour créer le service Email."""
    return EmailService()


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    "EmailStatus",
    "EmailType",
    
    # Data Classes
    "EmailAddress",
    "EmailAttachment",
    "Email",
    "EmailResult",
    "EmailStats",
    "EmailTemplate",
    
    # Clients
    "SendGridClient",
    "PostmarkClient",
    "AWSSESClient",
    
    # Service
    "EmailService",
    "create_email_service"
]
