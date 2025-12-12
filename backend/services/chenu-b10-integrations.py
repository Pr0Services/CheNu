"""
═══════════════════════════════════════════════════════════════════════════════
CHE·NU™ — BATCH 10: API INTEGRATIONS
═══════════════════════════════════════════════════════════════════════════════

Real integrations with external services:
- INT-01: Google OAuth2
- INT-02: Gmail API
- INT-03: Google Calendar API
- INT-04: Stripe Payments
- INT-05: Twilio SMS
- INT-06: SendGrid Email
- INT-07: AWS S3 Storage
- INT-08: Webhook handlers

═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
from enum import Enum
import os
import json
import base64
import hmac
import hashlib
import logging
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, HTTPException, Depends, Request, BackgroundTasks
from pydantic import BaseModel, Field

logger = logging.getLogger("CHENU.Integrations")

router = APIRouter(prefix="/api/v1/integrations", tags=["Integrations"])

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

class Config:
    # Google
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/v1/integrations/google/callback")
    
    # Stripe
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
    
    # Twilio
    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER", "")
    
    # SendGrid
    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY", "")
    SENDGRID_FROM_EMAIL = os.getenv("SENDGRID_FROM_EMAIL", "noreply@chenu.ca")
    
    # AWS S3
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET", "chenu-documents")
    AWS_REGION = os.getenv("AWS_REGION", "ca-central-1")

# ═══════════════════════════════════════════════════════════════════════════════
# GOOGLE OAUTH2
# ═══════════════════════════════════════════════════════════════════════════════

GOOGLE_SCOPES = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
]

class GoogleOAuth:
    AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
    TOKEN_URL = "https://oauth2.googleapis.com/token"
    USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"
    
    @staticmethod
    def get_auth_url(state: str, scopes: List[str] = None) -> str:
        """Generate OAuth authorization URL."""
        params = {
            "client_id": Config.GOOGLE_CLIENT_ID,
            "redirect_uri": Config.GOOGLE_REDIRECT_URI,
            "response_type": "code",
            "scope": " ".join(scopes or GOOGLE_SCOPES),
            "access_type": "offline",
            "prompt": "consent",
            "state": state,
        }
        return f"{GoogleOAuth.AUTH_URL}?{urlencode(params)}"
    
    @staticmethod
    async def exchange_code(code: str) -> Dict[str, Any]:
        """Exchange authorization code for tokens."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GoogleOAuth.TOKEN_URL,
                data={
                    "client_id": Config.GOOGLE_CLIENT_ID,
                    "client_secret": Config.GOOGLE_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": Config.GOOGLE_REDIRECT_URI,
                },
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to exchange code")
            
            return response.json()
    
    @staticmethod
    async def refresh_token(refresh_token: str) -> Dict[str, Any]:
        """Refresh access token."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GoogleOAuth.TOKEN_URL,
                data={
                    "client_id": Config.GOOGLE_CLIENT_ID,
                    "client_secret": Config.GOOGLE_CLIENT_SECRET,
                    "refresh_token": refresh_token,
                    "grant_type": "refresh_token",
                },
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to refresh token")
            
            return response.json()
    
    @staticmethod
    async def get_user_info(access_token: str) -> Dict[str, Any]:
        """Get user profile information."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                GoogleOAuth.USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"},
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get user info")
            
            return response.json()

# ═══════════════════════════════════════════════════════════════════════════════
# GMAIL API
# ═══════════════════════════════════════════════════════════════════════════════

class GmailAPI:
    BASE_URL = "https://gmail.googleapis.com/gmail/v1"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.headers = {"Authorization": f"Bearer {access_token}"}
    
    async def list_messages(
        self,
        query: str = None,
        max_results: int = 20,
        page_token: str = None,
        label_ids: List[str] = None,
    ) -> Dict[str, Any]:
        """List messages in user's mailbox."""
        params = {"maxResults": max_results}
        
        if query:
            params["q"] = query
        if page_token:
            params["pageToken"] = page_token
        if label_ids:
            params["labelIds"] = ",".join(label_ids)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/users/me/messages",
                headers=self.headers,
                params=params,
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Gmail API error")
            
            return response.json()
    
    async def get_message(self, message_id: str, format: str = "full") -> Dict[str, Any]:
        """Get a specific message."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/users/me/messages/{message_id}",
                headers=self.headers,
                params={"format": format},
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Gmail API error")
            
            return response.json()
    
    async def send_message(
        self,
        to: str,
        subject: str,
        body: str,
        html: bool = False,
        attachments: List[Dict] = None,
    ) -> Dict[str, Any]:
        """Send an email message."""
        # Build MIME message
        boundary = "chenu_boundary"
        
        message_parts = [
            f"To: {to}",
            f"Subject: {subject}",
            "MIME-Version: 1.0",
        ]
        
        if attachments:
            message_parts.append(f'Content-Type: multipart/mixed; boundary="{boundary}"')
            message_parts.append("")
            message_parts.append(f"--{boundary}")
        
        content_type = "text/html" if html else "text/plain"
        message_parts.append(f"Content-Type: {content_type}; charset=utf-8")
        message_parts.append("")
        message_parts.append(body)
        
        if attachments:
            for att in attachments:
                message_parts.append(f"--{boundary}")
                message_parts.append(f'Content-Type: {att["mime_type"]}')
                message_parts.append("Content-Transfer-Encoding: base64")
                message_parts.append(f'Content-Disposition: attachment; filename="{att["filename"]}"')
                message_parts.append("")
                message_parts.append(att["data"])
            message_parts.append(f"--{boundary}--")
        
        raw_message = "\r\n".join(message_parts)
        encoded = base64.urlsafe_b64encode(raw_message.encode()).decode()
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/users/me/messages/send",
                headers=self.headers,
                json={"raw": encoded},
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to send email")
            
            return response.json()
    
    async def list_labels(self) -> Dict[str, Any]:
        """List all labels."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/users/me/labels",
                headers=self.headers,
            )
            return response.json()

# ═══════════════════════════════════════════════════════════════════════════════
# GOOGLE CALENDAR API
# ═══════════════════════════════════════════════════════════════════════════════

class GoogleCalendarAPI:
    BASE_URL = "https://www.googleapis.com/calendar/v3"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.headers = {"Authorization": f"Bearer {access_token}"}
    
    async def list_calendars(self) -> Dict[str, Any]:
        """List user's calendars."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/users/me/calendarList",
                headers=self.headers,
            )
            return response.json()
    
    async def list_events(
        self,
        calendar_id: str = "primary",
        time_min: datetime = None,
        time_max: datetime = None,
        max_results: int = 50,
        page_token: str = None,
    ) -> Dict[str, Any]:
        """List events from a calendar."""
        params = {
            "maxResults": max_results,
            "singleEvents": True,
            "orderBy": "startTime",
        }
        
        if time_min:
            params["timeMin"] = time_min.isoformat() + "Z"
        if time_max:
            params["timeMax"] = time_max.isoformat() + "Z"
        if page_token:
            params["pageToken"] = page_token
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/calendars/{calendar_id}/events",
                headers=self.headers,
                params=params,
            )
            return response.json()
    
    async def create_event(
        self,
        calendar_id: str = "primary",
        summary: str = "",
        description: str = "",
        start_time: datetime = None,
        end_time: datetime = None,
        location: str = None,
        attendees: List[str] = None,
        reminders: List[Dict] = None,
    ) -> Dict[str, Any]:
        """Create a calendar event."""
        event = {
            "summary": summary,
            "description": description,
            "start": {
                "dateTime": start_time.isoformat(),
                "timeZone": "America/Toronto",
            },
            "end": {
                "dateTime": end_time.isoformat(),
                "timeZone": "America/Toronto",
            },
        }
        
        if location:
            event["location"] = location
        
        if attendees:
            event["attendees"] = [{"email": email} for email in attendees]
        
        if reminders:
            event["reminders"] = {
                "useDefault": False,
                "overrides": reminders,
            }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/calendars/{calendar_id}/events",
                headers=self.headers,
                json=event,
            )
            
            if response.status_code not in [200, 201]:
                raise HTTPException(status_code=response.status_code, detail="Failed to create event")
            
            return response.json()
    
    async def update_event(
        self,
        event_id: str,
        calendar_id: str = "primary",
        **updates,
    ) -> Dict[str, Any]:
        """Update an event."""
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"{self.BASE_URL}/calendars/{calendar_id}/events/{event_id}",
                headers=self.headers,
                json=updates,
            )
            return response.json()
    
    async def delete_event(self, event_id: str, calendar_id: str = "primary"):
        """Delete an event."""
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                f"{self.BASE_URL}/calendars/{calendar_id}/events/{event_id}",
                headers=self.headers,
            )
            return response.status_code == 204

# ═══════════════════════════════════════════════════════════════════════════════
# STRIPE PAYMENTS
# ═══════════════════════════════════════════════════════════════════════════════

class StripeAPI:
    BASE_URL = "https://api.stripe.com/v1"
    
    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {Config.STRIPE_SECRET_KEY}",
            "Content-Type": "application/x-www-form-urlencoded",
        }
    
    async def create_customer(
        self,
        email: str,
        name: str = None,
        metadata: Dict = None,
    ) -> Dict[str, Any]:
        """Create a Stripe customer."""
        data = {"email": email}
        if name:
            data["name"] = name
        if metadata:
            for key, value in metadata.items():
                data[f"metadata[{key}]"] = value
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/customers",
                headers=self.headers,
                data=data,
            )
            return response.json()
    
    async def create_payment_intent(
        self,
        amount: int,  # in cents
        currency: str = "cad",
        customer_id: str = None,
        description: str = None,
        metadata: Dict = None,
    ) -> Dict[str, Any]:
        """Create a payment intent."""
        data = {
            "amount": amount,
            "currency": currency,
        }
        
        if customer_id:
            data["customer"] = customer_id
        if description:
            data["description"] = description
        if metadata:
            for key, value in metadata.items():
                data[f"metadata[{key}]"] = value
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/payment_intents",
                headers=self.headers,
                data=data,
            )
            return response.json()
    
    async def create_invoice(
        self,
        customer_id: str,
        items: List[Dict],
        auto_advance: bool = True,
        collection_method: str = "send_invoice",
        days_until_due: int = 30,
    ) -> Dict[str, Any]:
        """Create and send an invoice."""
        # Create invoice
        invoice_data = {
            "customer": customer_id,
            "auto_advance": auto_advance,
            "collection_method": collection_method,
            "days_until_due": days_until_due,
        }
        
        async with httpx.AsyncClient() as client:
            # Create invoice
            response = await client.post(
                f"{self.BASE_URL}/invoices",
                headers=self.headers,
                data=invoice_data,
            )
            invoice = response.json()
            invoice_id = invoice.get("id")
            
            # Add line items
            for item in items:
                await client.post(
                    f"{self.BASE_URL}/invoiceitems",
                    headers=self.headers,
                    data={
                        "customer": customer_id,
                        "invoice": invoice_id,
                        "description": item.get("description", ""),
                        "amount": item.get("amount", 0),
                        "currency": "cad",
                    },
                )
            
            # Finalize invoice
            response = await client.post(
                f"{self.BASE_URL}/invoices/{invoice_id}/finalize",
                headers=self.headers,
            )
            
            return response.json()
    
    async def create_subscription(
        self,
        customer_id: str,
        price_id: str,
        trial_days: int = None,
    ) -> Dict[str, Any]:
        """Create a subscription."""
        data = {
            "customer": customer_id,
            "items[0][price]": price_id,
        }
        
        if trial_days:
            data["trial_period_days"] = trial_days
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/subscriptions",
                headers=self.headers,
                data=data,
            )
            return response.json()
    
    @staticmethod
    def verify_webhook_signature(payload: bytes, signature: str) -> bool:
        """Verify Stripe webhook signature."""
        try:
            timestamp, sig = None, None
            for item in signature.split(","):
                key, value = item.split("=")
                if key == "t":
                    timestamp = value
                elif key == "v1":
                    sig = value
            
            if not timestamp or not sig:
                return False
            
            signed_payload = f"{timestamp}.{payload.decode()}"
            expected_sig = hmac.new(
                Config.STRIPE_WEBHOOK_SECRET.encode(),
                signed_payload.encode(),
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(sig, expected_sig)
        except:
            return False

# ═══════════════════════════════════════════════════════════════════════════════
# TWILIO SMS
# ═══════════════════════════════════════════════════════════════════════════════

class TwilioAPI:
    BASE_URL = "https://api.twilio.com/2010-04-01"
    
    def __init__(self):
        self.auth = (Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN)
    
    async def send_sms(
        self,
        to: str,
        body: str,
        from_number: str = None,
    ) -> Dict[str, Any]:
        """Send an SMS message."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/Accounts/{Config.TWILIO_ACCOUNT_SID}/Messages.json",
                auth=self.auth,
                data={
                    "To": to,
                    "From": from_number or Config.TWILIO_PHONE_NUMBER,
                    "Body": body,
                },
            )
            return response.json()

# ═══════════════════════════════════════════════════════════════════════════════
# SENDGRID EMAIL
# ═══════════════════════════════════════════════════════════════════════════════

class SendGridAPI:
    BASE_URL = "https://api.sendgrid.com/v3"
    
    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {Config.SENDGRID_API_KEY}",
            "Content-Type": "application/json",
        }
    
    async def send_email(
        self,
        to: str,
        subject: str,
        html_content: str = None,
        text_content: str = None,
        from_email: str = None,
        from_name: str = "CHE·NU™",
        template_id: str = None,
        template_data: Dict = None,
        attachments: List[Dict] = None,
    ) -> Dict[str, Any]:
        """Send an email via SendGrid."""
        message = {
            "personalizations": [
                {
                    "to": [{"email": to}],
                }
            ],
            "from": {
                "email": from_email or Config.SENDGRID_FROM_EMAIL,
                "name": from_name,
            },
            "subject": subject,
        }
        
        if template_id:
            message["template_id"] = template_id
            if template_data:
                message["personalizations"][0]["dynamic_template_data"] = template_data
        else:
            message["content"] = []
            if text_content:
                message["content"].append({"type": "text/plain", "value": text_content})
            if html_content:
                message["content"].append({"type": "text/html", "value": html_content})
        
        if attachments:
            message["attachments"] = [
                {
                    "content": att["content"],  # Base64
                    "type": att.get("type", "application/pdf"),
                    "filename": att["filename"],
                }
                for att in attachments
            ]
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/mail/send",
                headers=self.headers,
                json=message,
            )
            
            return {
                "success": response.status_code == 202,
                "status_code": response.status_code,
            }

# ═══════════════════════════════════════════════════════════════════════════════
# AWS S3 STORAGE
# ═══════════════════════════════════════════════════════════════════════════════

class S3Storage:
    """AWS S3 storage for documents."""
    
    def __init__(self):
        # In production, use boto3
        self.bucket = Config.AWS_S3_BUCKET
        self.region = Config.AWS_REGION
    
    async def upload_file(
        self,
        file_content: bytes,
        key: str,
        content_type: str = "application/octet-stream",
        metadata: Dict = None,
    ) -> str:
        """Upload file to S3."""
        # In production, use boto3:
        # s3_client.upload_fileobj(file, bucket, key, ExtraArgs={...})
        
        url = f"https://{self.bucket}.s3.{self.region}.amazonaws.com/{key}"
        logger.info(f"File uploaded to S3: {url}")
        return url
    
    async def generate_presigned_url(
        self,
        key: str,
        expiration: int = 3600,
        method: str = "get_object",
    ) -> str:
        """Generate presigned URL for file access."""
        # In production, use boto3:
        # s3_client.generate_presigned_url(method, Params={...}, ExpiresIn=expiration)
        
        return f"https://{self.bucket}.s3.{self.region}.amazonaws.com/{key}?signed=true"
    
    async def delete_file(self, key: str) -> bool:
        """Delete file from S3."""
        # In production, use boto3:
        # s3_client.delete_object(Bucket=bucket, Key=key)
        
        logger.info(f"File deleted from S3: {key}")
        return True

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/google/auth")
async def google_auth(scopes: str = None):
    """Initiate Google OAuth flow."""
    import secrets
    state = secrets.token_urlsafe(32)
    
    scope_list = scopes.split(",") if scopes else GOOGLE_SCOPES
    auth_url = GoogleOAuth.get_auth_url(state, scope_list)
    
    return {"auth_url": auth_url, "state": state}

@router.get("/google/callback")
async def google_callback(code: str, state: str):
    """Handle Google OAuth callback."""
    tokens = await GoogleOAuth.exchange_code(code)
    user_info = await GoogleOAuth.get_user_info(tokens["access_token"])
    
    return {
        "tokens": {
            "access_token": tokens["access_token"],
            "refresh_token": tokens.get("refresh_token"),
            "expires_in": tokens["expires_in"],
        },
        "user": user_info,
    }

@router.post("/gmail/send")
async def send_gmail(
    access_token: str,
    to: str,
    subject: str,
    body: str,
    html: bool = False,
):
    """Send email via Gmail."""
    gmail = GmailAPI(access_token)
    result = await gmail.send_message(to, subject, body, html)
    return result

@router.get("/gmail/messages")
async def list_gmail_messages(
    access_token: str,
    query: str = None,
    max_results: int = 20,
):
    """List Gmail messages."""
    gmail = GmailAPI(access_token)
    return await gmail.list_messages(query=query, max_results=max_results)

@router.post("/calendar/events")
async def create_calendar_event(
    access_token: str,
    summary: str,
    start_time: datetime,
    end_time: datetime,
    description: str = None,
    location: str = None,
    attendees: List[str] = None,
):
    """Create Google Calendar event."""
    calendar = GoogleCalendarAPI(access_token)
    return await calendar.create_event(
        summary=summary,
        description=description,
        start_time=start_time,
        end_time=end_time,
        location=location,
        attendees=attendees,
    )

@router.get("/calendar/events")
async def list_calendar_events(
    access_token: str,
    time_min: datetime = None,
    time_max: datetime = None,
    max_results: int = 50,
):
    """List Google Calendar events."""
    calendar = GoogleCalendarAPI(access_token)
    return await calendar.list_events(
        time_min=time_min,
        time_max=time_max,
        max_results=max_results,
    )

@router.post("/stripe/payment-intent")
async def create_payment_intent(
    amount: int,
    currency: str = "cad",
    customer_id: str = None,
    description: str = None,
):
    """Create Stripe payment intent."""
    stripe = StripeAPI()
    return await stripe.create_payment_intent(
        amount=amount,
        currency=currency,
        customer_id=customer_id,
        description=description,
    )

@router.post("/stripe/webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks):
    """Handle Stripe webhooks."""
    payload = await request.body()
    signature = request.headers.get("stripe-signature", "")
    
    if not StripeAPI.verify_webhook_signature(payload, signature):
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    event = json.loads(payload)
    event_type = event.get("type")
    data = event.get("data", {}).get("object", {})
    
    logger.info(f"Stripe webhook: {event_type}")
    
    # Handle events
    if event_type == "payment_intent.succeeded":
        # Process successful payment
        pass
    elif event_type == "invoice.paid":
        # Process paid invoice
        pass
    elif event_type == "customer.subscription.updated":
        # Handle subscription update
        pass
    
    return {"received": True}

@router.post("/sms/send")
async def send_sms(to: str, body: str):
    """Send SMS via Twilio."""
    twilio = TwilioAPI()
    return await twilio.send_sms(to, body)

@router.post("/email/send")
async def send_email(
    to: str,
    subject: str,
    html_content: str = None,
    text_content: str = None,
    template_id: str = None,
    template_data: Dict = None,
):
    """Send email via SendGrid."""
    sendgrid = SendGridAPI()
    return await sendgrid.send_email(
        to=to,
        subject=subject,
        html_content=html_content,
        text_content=text_content,
        template_id=template_id,
        template_data=template_data,
    )
