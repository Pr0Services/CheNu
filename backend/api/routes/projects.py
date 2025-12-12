"""
CHE·NU Backend - Projects Routes
================================

Construction project management endpoints.
"""

from typing import List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from core.database.connection import get_session
from core.security import get_current_user, TokenData
from models import Project, project_member


router = APIRouter()


# ─────────────────────────────────────────────────────
# SCHEMAS
# ─────────────────────────────────────────────────────

class ProjectCreate(BaseModel):
    """Project create request."""
    organization_id: UUID
    name: str = Field(..., min_length=1, max_length=255)
    code: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    project_type: str = "residential"
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = None


class ProjectUpdate(BaseModel):
    """Project update request."""
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = None
    actual_cost: Optional[float] = None
    metadata: Optional[dict] = None


class ProjectResponse(BaseModel):
    """Project response."""
    id: UUID
    organization_id: UUID
    name: str
    code: str
    description: Optional[str]
    status: str
    project_type: str
    address: Optional[str]
    city: Optional[str]
    postal_code: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    budget: Optional[float]
    actual_cost: Optional[float]
    permit_numbers: List[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PaginatedProjects(BaseModel):
    """Paginated projects response."""
    items: List[ProjectResponse]
    total: int
    page: int
    page_size: int


# ─────────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────────

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    request: ProjectCreate,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Create a new project."""
    project = Project(
        organization_id=request.organization_id,
        name=request.name,
        code=request.code,
        description=request.description,
        project_type=request.project_type,
        address=request.address,
        city=request.city,
        postal_code=request.postal_code,
        start_date=request.start_date,
        end_date=request.end_date,
        budget=request.budget,
    )
    
    session.add(project)
    await session.flush()
    
    # Add creator as project admin
    await session.execute(
        project_member.insert().values(
            user_id=current_user.user_id,
            project_id=project.id,
            role="admin",
        )
    )
    
    return ProjectResponse.model_validate(project)


@router.get("", response_model=PaginatedProjects)
async def list_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    organization_id: Optional[UUID] = None,
    status: Optional[str] = None,
    project_type: Optional[str] = None,
    search: Optional[str] = None,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """List projects accessible to current user."""
    query = (
        select(Project)
        .join(project_member)
        .where(
            project_member.c.user_id == current_user.user_id,
            Project.is_deleted == False,
        )
    )
    
    # Filters
    if organization_id:
        query = query.where(Project.organization_id == organization_id)
    if status:
        query = query.where(Project.status == status)
    if project_type:
        query = query.where(Project.project_type == project_type)
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            (Project.name.ilike(search_filter)) |
            (Project.code.ilike(search_filter))
        )
    
    # Count
    count_query = select(func.count()).select_from(query.subquery())
    total = (await session.execute(count_query)).scalar() or 0
    
    # Paginate
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await session.execute(query)
    projects = result.scalars().all()
    
    return PaginatedProjects(
        items=[ProjectResponse.model_validate(p) for p in projects],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get project by ID."""
    result = await session.execute(
        select(Project).where(
            Project.id == project_id,
            Project.is_deleted == False,
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    return ProjectResponse.model_validate(project)


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    request: ProjectUpdate,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Update project."""
    result = await session.execute(
        select(Project).where(
            Project.id == project_id,
            Project.is_deleted == False,
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    return ProjectResponse.model_validate(project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Soft delete project."""
    result = await session.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    project.is_deleted = True


@router.post("/{project_id}/permits")
async def add_permit(
    project_id: UUID,
    permit_number: str,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Add permit number to project."""
    result = await session.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    if permit_number not in project.permit_numbers:
        project.permit_numbers = [*project.permit_numbers, permit_number]
    
    return {"permit_numbers": project.permit_numbers}


__all__ = ["router"]
