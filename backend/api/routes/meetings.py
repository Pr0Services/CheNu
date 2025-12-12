"""
CHE·NU Backend - Meetings Routes
================================

Meeting room management endpoints.
"""

from typing import List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.database.connection import get_session
from core.security import get_current_user, TokenData
from models import Meeting, meeting_participant


router = APIRouter()


# ─────────────────────────────────────────────────────
# SCHEMAS
# ─────────────────────────────────────────────────────

class MeetingCreate(BaseModel):
    """Meeting create request."""
    project_id: UUID
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    meeting_type: str = "decision"
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    decision_context: Optional[str] = None
    decision_options: List[dict] = []
    agent_ids: List[str] = []


class MeetingUpdate(BaseModel):
    """Meeting update request."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    decision_context: Optional[str] = None
    decision_options: Optional[List[dict]] = None
    decision_outcome: Optional[dict] = None


class MeetingResponse(BaseModel):
    """Meeting response."""
    id: UUID
    project_id: UUID
    title: str
    description: Optional[str]
    meeting_type: str
    status: str
    scheduled_start: Optional[datetime]
    scheduled_end: Optional[datetime]
    actual_start: Optional[datetime]
    actual_end: Optional[datetime]
    decision_context: Optional[str]
    decision_options: List[dict]
    decision_outcome: Optional[dict]
    agent_ids: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


# ─────────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────────

@router.post("", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
async def create_meeting(
    request: MeetingCreate,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Create a new meeting."""
    meeting = Meeting(
        project_id=request.project_id,
        title=request.title,
        description=request.description,
        meeting_type=request.meeting_type,
        scheduled_start=request.scheduled_start,
        scheduled_end=request.scheduled_end,
        decision_context=request.decision_context,
        decision_options=request.decision_options,
        agent_ids=request.agent_ids,
    )
    
    session.add(meeting)
    await session.flush()
    
    # Add creator as organizer
    await session.execute(
        meeting_participant.insert().values(
            user_id=current_user.user_id,
            meeting_id=meeting.id,
            role="organizer",
        )
    )
    
    return MeetingResponse.model_validate(meeting)


@router.get("", response_model=List[MeetingResponse])
async def list_meetings(
    project_id: Optional[UUID] = None,
    status: Optional[str] = None,
    meeting_type: Optional[str] = None,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """List meetings."""
    query = (
        select(Meeting)
        .join(meeting_participant)
        .where(
            meeting_participant.c.user_id == current_user.user_id,
            Meeting.is_deleted == False,
        )
    )
    
    if project_id:
        query = query.where(Meeting.project_id == project_id)
    if status:
        query = query.where(Meeting.status == status)
    if meeting_type:
        query = query.where(Meeting.meeting_type == meeting_type)
    
    result = await session.execute(query.order_by(Meeting.scheduled_start.desc()))
    meetings = result.scalars().all()
    
    return [MeetingResponse.model_validate(m) for m in meetings]


@router.get("/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(
    meeting_id: UUID,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get meeting by ID."""
    result = await session.execute(
        select(Meeting).where(Meeting.id == meeting_id, Meeting.is_deleted == False)
    )
    meeting = result.scalar_one_or_none()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    return MeetingResponse.model_validate(meeting)


@router.patch("/{meeting_id}", response_model=MeetingResponse)
async def update_meeting(
    meeting_id: UUID,
    request: MeetingUpdate,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Update meeting."""
    result = await session.execute(
        select(Meeting).where(Meeting.id == meeting_id)
    )
    meeting = result.scalar_one_or_none()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(meeting, field, value)
    
    return MeetingResponse.model_validate(meeting)


@router.post("/{meeting_id}/start")
async def start_meeting(
    meeting_id: UUID,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Start a meeting."""
    result = await session.execute(select(Meeting).where(Meeting.id == meeting_id))
    meeting = result.scalar_one_or_none()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    meeting.status = "active"
    meeting.actual_start = datetime.utcnow()
    
    return {"status": "active", "started_at": meeting.actual_start}


@router.post("/{meeting_id}/end")
async def end_meeting(
    meeting_id: UUID,
    decision_outcome: Optional[dict] = None,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """End a meeting."""
    result = await session.execute(select(Meeting).where(Meeting.id == meeting_id))
    meeting = result.scalar_one_or_none()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    meeting.status = "completed"
    meeting.actual_end = datetime.utcnow()
    if decision_outcome:
        meeting.decision_outcome = decision_outcome
    
    return {"status": "completed", "ended_at": meeting.actual_end}


@router.post("/{meeting_id}/join")
async def join_meeting(
    meeting_id: UUID,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Join a meeting."""
    await session.execute(
        meeting_participant.insert().values(
            user_id=current_user.user_id,
            meeting_id=meeting_id,
            role="participant",
            joined_at=datetime.utcnow(),
        )
    )
    return {"message": "Joined meeting"}


__all__ = ["router"]
