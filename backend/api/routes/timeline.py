"""
CHE·NU Backend - Timeline Routes
================================

Immutable event timeline (audit log) endpoints.
"""

from typing import List, Optional
from uuid import UUID
from datetime import datetime
import hashlib
import json

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from core.database.connection import get_session
from core.security import get_current_user, TokenData
from models import TimelineEvent


router = APIRouter()


# ─────────────────────────────────────────────────────
# SCHEMAS
# ─────────────────────────────────────────────────────

class TimelineEventCreate(BaseModel):
    """Create timeline event."""
    event_type: str
    event_category: str
    actor_type: str  # user, agent, system
    actor_id: str
    actor_name: str
    payload: dict = Field(default_factory=dict)
    meeting_id: Optional[UUID] = None
    project_id: Optional[UUID] = None


class TimelineEventResponse(BaseModel):
    """Timeline event response."""
    id: UUID
    event_type: str
    event_category: str
    actor_type: str
    actor_id: str
    actor_name: str
    payload: dict
    timestamp: datetime
    event_hash: str
    user_id: Optional[UUID]
    meeting_id: Optional[UUID]
    project_id: Optional[UUID]
    
    class Config:
        from_attributes = True


class TimelineQuery(BaseModel):
    """Timeline query parameters."""
    project_id: Optional[UUID] = None
    meeting_id: Optional[UUID] = None
    event_type: Optional[str] = None
    event_category: Optional[str] = None
    actor_type: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None


class PaginatedTimeline(BaseModel):
    """Paginated timeline response."""
    items: List[TimelineEventResponse]
    total: int
    page: int
    page_size: int
    has_more: bool


class IntegrityReport(BaseModel):
    """Timeline integrity verification report."""
    verified: bool
    total_events: int
    valid_events: int
    invalid_events: int
    first_event: Optional[datetime]
    last_event: Optional[datetime]
    errors: List[str]


# ─────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────

def compute_event_hash(
    event_type: str,
    actor_id: str,
    payload: dict,
    timestamp: datetime,
    previous_hash: Optional[str],
) -> str:
    """Compute SHA-256 hash for event integrity."""
    data = {
        "event_type": event_type,
        "actor_id": actor_id,
        "payload": payload,
        "timestamp": timestamp.isoformat(),
        "previous_hash": previous_hash or "",
    }
    content = json.dumps(data, sort_keys=True)
    return hashlib.sha256(content.encode()).hexdigest()


# ─────────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────────

@router.post("", response_model=TimelineEventResponse, status_code=201)
async def create_event(
    request: TimelineEventCreate,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Record a new timeline event (immutable)."""
    # Get previous hash for chain integrity
    result = await session.execute(
        select(TimelineEvent)
        .order_by(TimelineEvent.timestamp.desc())
        .limit(1)
    )
    last_event = result.scalar_one_or_none()
    previous_hash = last_event.event_hash if last_event else None
    
    timestamp = datetime.utcnow()
    event_hash = compute_event_hash(
        request.event_type,
        request.actor_id,
        request.payload,
        timestamp,
        previous_hash,
    )
    
    event = TimelineEvent(
        event_type=request.event_type,
        event_category=request.event_category,
        actor_type=request.actor_type,
        actor_id=request.actor_id,
        actor_name=request.actor_name,
        payload=request.payload,
        timestamp=timestamp,
        event_hash=event_hash,
        previous_hash=previous_hash,
        user_id=current_user.user_id if request.actor_type == "user" else None,
        meeting_id=request.meeting_id,
        project_id=request.project_id,
    )
    
    session.add(event)
    return TimelineEventResponse.model_validate(event)


@router.get("", response_model=PaginatedTimeline)
async def query_timeline(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    project_id: Optional[UUID] = None,
    meeting_id: Optional[UUID] = None,
    event_type: Optional[str] = None,
    event_category: Optional[str] = None,
    actor_type: Optional[str] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Query timeline events."""
    query = select(TimelineEvent)
    
    # Filters
    if project_id:
        query = query.where(TimelineEvent.project_id == project_id)
    if meeting_id:
        query = query.where(TimelineEvent.meeting_id == meeting_id)
    if event_type:
        query = query.where(TimelineEvent.event_type == event_type)
    if event_category:
        query = query.where(TimelineEvent.event_category == event_category)
    if actor_type:
        query = query.where(TimelineEvent.actor_type == actor_type)
    if start_time:
        query = query.where(TimelineEvent.timestamp >= start_time)
    if end_time:
        query = query.where(TimelineEvent.timestamp <= end_time)
    
    # Count
    count_query = select(func.count()).select_from(query.subquery())
    total = (await session.execute(count_query)).scalar() or 0
    
    # Paginate (newest first)
    query = (
        query.order_by(TimelineEvent.timestamp.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await session.execute(query)
    events = result.scalars().all()
    
    return PaginatedTimeline(
        items=[TimelineEventResponse.model_validate(e) for e in events],
        total=total,
        page=page,
        page_size=page_size,
        has_more=page * page_size < total,
    )


@router.get("/{event_id}", response_model=TimelineEventResponse)
async def get_event(
    event_id: UUID,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get timeline event by ID."""
    result = await session.execute(
        select(TimelineEvent).where(TimelineEvent.id == event_id)
    )
    event = result.scalar_one_or_none()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return TimelineEventResponse.model_validate(event)


@router.get("/verify/integrity", response_model=IntegrityReport)
async def verify_integrity(
    project_id: Optional[UUID] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Verify timeline integrity (hash chain)."""
    query = select(TimelineEvent).order_by(TimelineEvent.timestamp.asc())
    
    if project_id:
        query = query.where(TimelineEvent.project_id == project_id)
    if start_time:
        query = query.where(TimelineEvent.timestamp >= start_time)
    if end_time:
        query = query.where(TimelineEvent.timestamp <= end_time)
    
    result = await session.execute(query)
    events = result.scalars().all()
    
    errors = []
    valid_count = 0
    previous_hash = None
    
    for event in events:
        expected_hash = compute_event_hash(
            event.event_type,
            event.actor_id,
            event.payload,
            event.timestamp,
            previous_hash,
        )
        
        if event.event_hash != expected_hash:
            errors.append(f"Invalid hash at event {event.id}")
        elif event.previous_hash != previous_hash:
            errors.append(f"Broken chain at event {event.id}")
        else:
            valid_count += 1
        
        previous_hash = event.event_hash
    
    return IntegrityReport(
        verified=len(errors) == 0,
        total_events=len(events),
        valid_events=valid_count,
        invalid_events=len(events) - valid_count,
        first_event=events[0].timestamp if events else None,
        last_event=events[-1].timestamp if events else None,
        errors=errors[:10],  # Limit errors returned
    )


@router.get("/export/{project_id}")
async def export_timeline(
    project_id: UUID,
    format: str = Query("json", regex="^(json|csv)$"),
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Export timeline for a project."""
    result = await session.execute(
        select(TimelineEvent)
        .where(TimelineEvent.project_id == project_id)
        .order_by(TimelineEvent.timestamp.asc())
    )
    events = result.scalars().all()
    
    if format == "json":
        return [TimelineEventResponse.model_validate(e).model_dump() for e in events]
    else:
        # CSV format
        import io
        import csv
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "id", "timestamp", "event_type", "event_category",
            "actor_type", "actor_name", "event_hash",
        ])
        
        for e in events:
            writer.writerow([
                str(e.id), e.timestamp.isoformat(), e.event_type,
                e.event_category, e.actor_type, e.actor_name, e.event_hash,
            ])
        
        return {"csv": output.getvalue()}


__all__ = ["router"]
