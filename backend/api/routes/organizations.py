"""
CHE·NU Backend - Organizations Routes
=====================================

Organization/company management endpoints.
"""

from typing import List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import re

from core.database.connection import get_session
from core.security import (
    get_current_user,
    require_role,
    TokenData,
    Role,
)
from models import Organization, User, user_organization


router = APIRouter()


# ─────────────────────────────────────────────────────
# SCHEMAS
# ─────────────────────────────────────────────────────

class OrganizationCreate(BaseModel):
    """Organization create request."""
    name: str = Field(..., min_length=1, max_length=255)
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    province: str = "QC"
    postal_code: Optional[str] = None
    neq: Optional[str] = None
    rbq_license: Optional[str] = None
    cnesst_number: Optional[str] = None


class OrganizationUpdate(BaseModel):
    """Organization update request."""
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    settings: Optional[dict] = None


class OrganizationResponse(BaseModel):
    """Organization response."""
    id: UUID
    name: str
    slug: str
    email: Optional[str]
    phone: Optional[str]
    website: Optional[str]
    address: Optional[str]
    city: Optional[str]
    province: str
    postal_code: Optional[str]
    neq: Optional[str]
    rbq_license: Optional[str]
    cnesst_number: Optional[str]
    subscription_tier: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class MemberAdd(BaseModel):
    """Add member request."""
    user_id: UUID
    role: str = "member"


class MemberResponse(BaseModel):
    """Member response."""
    id: UUID
    email: str
    first_name: str
    last_name: str
    role: str
    
    class Config:
        from_attributes = True


# ─────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────

def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from name."""
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    return slug.strip('-')


# ─────────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────────

@router.post("", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    request: OrganizationCreate,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Create a new organization."""
    # Generate unique slug
    base_slug = generate_slug(request.name)
    slug = base_slug
    counter = 1
    
    while True:
        result = await session.execute(
            select(Organization).where(Organization.slug == slug)
        )
        if not result.scalar_one_or_none():
            break
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    # Create organization
    org = Organization(
        name=request.name,
        slug=slug,
        email=request.email,
        phone=request.phone,
        website=request.website,
        address=request.address,
        city=request.city,
        province=request.province,
        postal_code=request.postal_code,
        neq=request.neq,
        rbq_license=request.rbq_license,
        cnesst_number=request.cnesst_number,
    )
    
    session.add(org)
    await session.flush()
    
    # Add creator as admin
    await session.execute(
        user_organization.insert().values(
            user_id=current_user.user_id,
            organization_id=org.id,
            role="admin",
        )
    )
    
    return OrganizationResponse.model_validate(org)


@router.get("", response_model=List[OrganizationResponse])
async def list_organizations(
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """List organizations for current user."""
    result = await session.execute(
        select(Organization)
        .join(user_organization)
        .where(
            user_organization.c.user_id == current_user.user_id,
            Organization.is_deleted == False,
        )
    )
    orgs = result.scalars().all()
    
    return [OrganizationResponse.model_validate(o) for o in orgs]


@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: UUID,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get organization by ID."""
    result = await session.execute(
        select(Organization).where(
            Organization.id == org_id,
            Organization.is_deleted == False,
        )
    )
    org = result.scalar_one_or_none()
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    return OrganizationResponse.model_validate(org)


@router.patch("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: UUID,
    request: OrganizationUpdate,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Update organization."""
    result = await session.execute(
        select(Organization).where(
            Organization.id == org_id,
            Organization.is_deleted == False,
        )
    )
    org = result.scalar_one_or_none()
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    # Update fields
    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(org, field, value)
    
    return OrganizationResponse.model_validate(org)


@router.get("/{org_id}/members", response_model=List[MemberResponse])
async def list_members(
    org_id: UUID,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """List organization members."""
    result = await session.execute(
        select(User, user_organization.c.role)
        .join(user_organization)
        .where(
            user_organization.c.organization_id == org_id,
            User.is_deleted == False,
        )
    )
    members = result.all()
    
    return [
        MemberResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            role=role,
        )
        for user, role in members
    ]


@router.post("/{org_id}/members", status_code=status.HTTP_201_CREATED)
async def add_member(
    org_id: UUID,
    request: MemberAdd,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Add member to organization."""
    # Verify user exists
    result = await session.execute(
        select(User).where(User.id == request.user_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Add member
    await session.execute(
        user_organization.insert().values(
            user_id=request.user_id,
            organization_id=org_id,
            role=request.role,
        )
    )
    
    return {"message": "Member added successfully"}


@router.delete("/{org_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_member(
    org_id: UUID,
    user_id: UUID,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Remove member from organization."""
    await session.execute(
        user_organization.delete().where(
            user_organization.c.organization_id == org_id,
            user_organization.c.user_id == user_id,
        )
    )


# ─────────────────────────────────────────────────────
# EXPORTS
# ─────────────────────────────────────────────────────

__all__ = ["router"]
