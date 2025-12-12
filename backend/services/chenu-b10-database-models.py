"""
═══════════════════════════════════════════════════════════════════════════════
CHE·NU™ — BATCH 10: DATABASE MODELS & MIGRATIONS
═══════════════════════════════════════════════════════════════════════════════

Database layer with SQLAlchemy ORM:
- DB-01: User & Auth models
- DB-02: Organization & Team models
- DB-03: Project models
- DB-04: Task models
- DB-05: Calendar & Event models
- DB-06: Document models
- DB-07: Notification models
- DB-08: Audit & Activity logs
- DB-09: Settings & Preferences
- DB-10: Alembic migrations

═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from datetime import datetime, date, time
from decimal import Decimal
from enum import Enum as PyEnum
import uuid

from sqlalchemy import (
    create_engine, Column, String, Text, Integer, BigInteger, 
    Float, Numeric, Boolean, DateTime, Date, Time, JSON, 
    ForeignKey, Table, Index, UniqueConstraint, CheckConstraint,
    Enum, event
)
from sqlalchemy.orm import (
    declarative_base, relationship, Session, sessionmaker,
    validates, backref
)
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY, INET
from sqlalchemy.sql import func
from sqlalchemy.ext.hybrid import hybrid_property

# ═══════════════════════════════════════════════════════════════════════════════
# DATABASE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

DATABASE_URL = "postgresql://chenu:chenu_secret@localhost:5432/chenu_db"

engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class UserRole(str, PyEnum):
    OWNER = "owner"
    ADMIN = "admin"
    MANAGER = "manager"
    MEMBER = "member"
    VIEWER = "viewer"

class ProjectStatus(str, PyEnum):
    DRAFT = "draft"
    PLANNING = "planning"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class ProjectType(str, PyEnum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    INDUSTRIAL = "industrial"
    INFRASTRUCTURE = "infrastructure"
    RENOVATION = "renovation"
    NEW_CONSTRUCTION = "new_construction"

class TaskStatus(str, PyEnum):
    BACKLOG = "backlog"
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    DONE = "done"

class TaskPriority(str, PyEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class DocumentStatus(str, PyEnum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    PENDING_SIGNATURE = "pending_signature"
    SIGNED = "signed"
    FINAL = "final"
    ARCHIVED = "archived"

class NotificationType(str, PyEnum):
    TASK_ASSIGNED = "task.assigned"
    TASK_COMPLETED = "task.completed"
    PROJECT_UPDATE = "project.update"
    DOCUMENT_SHARED = "document.shared"
    SIGNATURE_REQUESTED = "signature.requested"
    PAYMENT_RECEIVED = "payment.received"
    SYSTEM = "system"

# ═══════════════════════════════════════════════════════════════════════════════
# MIXINS
# ═══════════════════════════════════════════════════════════════════════════════

class TimestampMixin:
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

class SoftDeleteMixin:
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    deleted_by_id = Column(UUID(as_uuid=True), nullable=True)

# ═══════════════════════════════════════════════════════════════════════════════
# ASSOCIATION TABLES
# ═══════════════════════════════════════════════════════════════════════════════

project_members = Table(
    'project_members',
    Base.metadata,
    Column('project_id', UUID(as_uuid=True), ForeignKey('projects.id', ondelete='CASCADE'), primary_key=True),
    Column('user_id', UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('role', String(50), default='member'),
    Column('joined_at', DateTime(timezone=True), server_default=func.now()),
)

task_assignees = Table(
    'task_assignees',
    Base.metadata,
    Column('task_id', UUID(as_uuid=True), ForeignKey('tasks.id', ondelete='CASCADE'), primary_key=True),
    Column('user_id', UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('assigned_at', DateTime(timezone=True), server_default=func.now()),
)

document_viewers = Table(
    'document_viewers',
    Base.metadata,
    Column('document_id', UUID(as_uuid=True), ForeignKey('documents.id', ondelete='CASCADE'), primary_key=True),
    Column('user_id', UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('can_edit', Boolean, default=False),
    Column('shared_at', DateTime(timezone=True), server_default=func.now()),
)

# ═══════════════════════════════════════════════════════════════════════════════
# USER & ORGANIZATION MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class Organization(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'organizations'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    logo_url = Column(String(500))
    
    # Business info
    business_number = Column(String(50))  # NEQ Quebec
    rbq_license = Column(String(50))
    ccq_number = Column(String(50))
    
    # Contact
    email = Column(String(255))
    phone = Column(String(50))
    website = Column(String(255))
    
    # Address
    address_line1 = Column(String(255))
    address_line2 = Column(String(255))
    city = Column(String(100))
    province = Column(String(50), default='QC')
    postal_code = Column(String(20))
    country = Column(String(50), default='CA')
    
    # Settings
    settings = Column(JSONB, default={})
    subscription_tier = Column(String(50), default='free')
    subscription_expires_at = Column(DateTime(timezone=True))
    
    # Relationships
    users = relationship('User', back_populates='organization')
    projects = relationship('Project', back_populates='organization')
    
    __table_args__ = (
        Index('ix_organizations_slug', 'slug'),
    )


class User(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey('organizations.id'), nullable=True)
    
    # Auth
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    
    # Profile
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    display_name = Column(String(200))
    avatar_url = Column(String(500))
    phone = Column(String(50))
    job_title = Column(String(100))
    
    # Role & Permissions
    role = Column(Enum(UserRole), default=UserRole.MEMBER, nullable=False)
    permissions = Column(ARRAY(String), default=[])
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    verified_at = Column(DateTime(timezone=True))
    
    # MFA
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(100))
    
    # Login tracking
    last_login_at = Column(DateTime(timezone=True))
    last_login_ip = Column(INET)
    login_count = Column(Integer, default=0)
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime(timezone=True))
    
    # Preferences
    language = Column(String(10), default='fr')
    timezone = Column(String(50), default='America/Toronto')
    theme = Column(String(20), default='dark')
    preferences = Column(JSONB, default={})
    
    # Relationships
    organization = relationship('Organization', back_populates='users')
    owned_projects = relationship('Project', back_populates='owner', foreign_keys='Project.owner_id')
    assigned_tasks = relationship('Task', secondary=task_assignees, back_populates='assignees')
    created_tasks = relationship('Task', back_populates='created_by', foreign_keys='Task.created_by_id')
    documents = relationship('Document', back_populates='created_by')
    notifications = relationship('Notification', back_populates='user')
    sessions = relationship('UserSession', back_populates='user')
    api_keys = relationship('APIKey', back_populates='user')
    
    @hybrid_property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    __table_args__ = (
        Index('ix_users_organization', 'organization_id'),
        Index('ix_users_email_active', 'email', 'is_active'),
    )


class UserSession(Base, TimestampMixin):
    __tablename__ = 'user_sessions'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    token_hash = Column(String(255), nullable=False, index=True)
    refresh_token_hash = Column(String(255), nullable=False)
    
    device_info = Column(String(500))
    ip_address = Column(INET)
    user_agent = Column(String(500))
    
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_active = Column(Boolean, default=True)
    revoked_at = Column(DateTime(timezone=True))
    
    user = relationship('User', back_populates='sessions')


class APIKey(Base, TimestampMixin):
    __tablename__ = 'api_keys'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    name = Column(String(100), nullable=False)
    key_hash = Column(String(255), nullable=False, unique=True)
    key_prefix = Column(String(20), nullable=False)
    
    scopes = Column(ARRAY(String), default=[])
    rate_limit = Column(Integer, default=1000)
    
    last_used_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    
    user = relationship('User', back_populates='api_keys')

# ═══════════════════════════════════════════════════════════════════════════════
# PROJECT MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class Project(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'projects'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey('organizations.id'), nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    
    # Basic info
    name = Column(String(255), nullable=False)
    code = Column(String(50), index=True)
    description = Column(Text)
    
    # Type & Status
    project_type = Column(Enum(ProjectType), default=ProjectType.RESIDENTIAL)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.DRAFT, nullable=False)
    
    # Client
    client_name = Column(String(255))
    client_email = Column(String(255))
    client_phone = Column(String(50))
    client_address = Column(Text)
    
    # Location
    site_address = Column(String(255))
    site_city = Column(String(100))
    site_postal_code = Column(String(20))
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Timeline
    start_date = Column(Date)
    target_end_date = Column(Date)
    actual_end_date = Column(Date)
    
    # Budget
    budget_total = Column(Numeric(12, 2), default=0)
    budget_spent = Column(Numeric(12, 2), default=0)
    budget_categories = Column(JSONB, default={})
    
    # Progress
    progress_percent = Column(Integer, default=0)
    
    # Compliance
    permit_number = Column(String(100))
    rbq_required = Column(Boolean, default=True)
    ccq_required = Column(Boolean, default=True)
    
    # Metadata
    tags = Column(ARRAY(String), default=[])
    metadata = Column(JSONB, default={})
    
    # Relationships
    organization = relationship('Organization', back_populates='projects')
    owner = relationship('User', back_populates='owned_projects', foreign_keys=[owner_id])
    members = relationship('User', secondary=project_members, backref='projects')
    phases = relationship('ProjectPhase', back_populates='project', cascade='all, delete-orphan')
    tasks = relationship('Task', back_populates='project', cascade='all, delete-orphan')
    documents = relationship('Document', back_populates='project')
    
    __table_args__ = (
        Index('ix_projects_org_status', 'organization_id', 'status'),
        Index('ix_projects_owner', 'owner_id'),
    )


class ProjectPhase(Base, TimestampMixin):
    __tablename__ = 'project_phases'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    
    name = Column(String(255), nullable=False)
    description = Column(Text)
    order = Column(Integer, default=0)
    
    status = Column(String(50), default='pending')
    progress_percent = Column(Integer, default=0)
    
    start_date = Column(Date)
    end_date = Column(Date)
    actual_start_date = Column(Date)
    actual_end_date = Column(Date)
    
    budget = Column(Numeric(12, 2), default=0)
    spent = Column(Numeric(12, 2), default=0)
    
    project = relationship('Project', back_populates='phases')
    milestones = relationship('ProjectMilestone', back_populates='phase', cascade='all, delete-orphan')


class ProjectMilestone(Base, TimestampMixin):
    __tablename__ = 'project_milestones'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phase_id = Column(UUID(as_uuid=True), ForeignKey('project_phases.id', ondelete='CASCADE'), nullable=False)
    
    name = Column(String(255), nullable=False)
    description = Column(Text)
    
    due_date = Column(Date)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True))
    completed_by_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    
    phase = relationship('ProjectPhase', back_populates='milestones')

# ═══════════════════════════════════════════════════════════════════════════════
# TASK MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class Task(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'tasks'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    parent_id = Column(UUID(as_uuid=True), ForeignKey('tasks.id', ondelete='CASCADE'), nullable=True)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    
    # Content
    title = Column(String(500), nullable=False)
    description = Column(Text)
    
    # Status & Priority
    status = Column(Enum(TaskStatus), default=TaskStatus.TODO, nullable=False)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False)
    
    # Timeline
    due_date = Column(DateTime(timezone=True))
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    
    # Time tracking
    estimated_hours = Column(Float, default=0)
    logged_minutes = Column(Integer, default=0)
    
    # Position (for Kanban)
    position = Column(Integer, default=0)
    
    # Metadata
    tags = Column(ARRAY(String), default=[])
    metadata = Column(JSONB, default={})
    
    # Relationships
    project = relationship('Project', back_populates='tasks')
    created_by = relationship('User', back_populates='created_tasks', foreign_keys=[created_by_id])
    assignees = relationship('User', secondary=task_assignees, back_populates='assigned_tasks')
    subtasks = relationship('Task', backref=backref('parent', remote_side=[id]))
    comments = relationship('TaskComment', back_populates='task', cascade='all, delete-orphan')
    time_entries = relationship('TaskTimeEntry', back_populates='task', cascade='all, delete-orphan')
    
    __table_args__ = (
        Index('ix_tasks_project_status', 'project_id', 'status'),
        Index('ix_tasks_due_date', 'due_date'),
    )


class TaskComment(Base, TimestampMixin):
    __tablename__ = 'task_comments'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = Column(UUID(as_uuid=True), ForeignKey('tasks.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    
    content = Column(Text, nullable=False)
    attachments = Column(JSONB, default=[])
    
    task = relationship('Task', back_populates='comments')
    user = relationship('User')


class TaskTimeEntry(Base, TimestampMixin):
    __tablename__ = 'task_time_entries'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = Column(UUID(as_uuid=True), ForeignKey('tasks.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    
    started_at = Column(DateTime(timezone=True), nullable=False)
    ended_at = Column(DateTime(timezone=True))
    duration_minutes = Column(Integer)
    
    description = Column(Text)
    billable = Column(Boolean, default=True)
    
    task = relationship('Task', back_populates='time_entries')
    user = relationship('User')

# ═══════════════════════════════════════════════════════════════════════════════
# CALENDAR & EVENT MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class Calendar(Base, TimestampMixin):
    __tablename__ = 'calendars'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    name = Column(String(255), nullable=False)
    color = Column(String(20), default='#D8B26A')
    is_default = Column(Boolean, default=False)
    is_visible = Column(Boolean, default=True)
    
    # External sync
    external_id = Column(String(255))
    external_provider = Column(String(50))  # google, outlook
    sync_token = Column(Text)
    last_synced_at = Column(DateTime(timezone=True))
    
    user = relationship('User')
    events = relationship('CalendarEvent', back_populates='calendar', cascade='all, delete-orphan')


class CalendarEvent(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'calendar_events'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    calendar_id = Column(UUID(as_uuid=True), ForeignKey('calendars.id', ondelete='CASCADE'), nullable=False)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id'), nullable=True)
    
    # Content
    title = Column(String(500), nullable=False)
    description = Column(Text)
    location = Column(String(500))
    
    # Timing
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    all_day = Column(Boolean, default=False)
    timezone = Column(String(50), default='America/Toronto')
    
    # Recurrence
    is_recurring = Column(Boolean, default=False)
    recurrence_rule = Column(String(255))  # RRULE format
    recurrence_end = Column(Date)
    
    # Type & Status
    event_type = Column(String(50), default='meeting')
    status = Column(String(50), default='confirmed')
    
    # Reminders
    reminders = Column(JSONB, default=[])
    
    # External sync
    external_id = Column(String(255))
    external_link = Column(String(500))
    
    # Metadata
    color = Column(String(20))
    metadata = Column(JSONB, default={})
    
    calendar = relationship('Calendar', back_populates='events')
    created_by = relationship('User')
    project = relationship('Project')
    attendees = relationship('EventAttendee', back_populates='event', cascade='all, delete-orphan')
    
    __table_args__ = (
        Index('ix_events_calendar_time', 'calendar_id', 'start_time', 'end_time'),
    )


class EventAttendee(Base, TimestampMixin):
    __tablename__ = 'event_attendees'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey('calendar_events.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True)
    
    email = Column(String(255), nullable=False)
    name = Column(String(255))
    
    status = Column(String(50), default='pending')  # pending, accepted, declined, tentative
    responded_at = Column(DateTime(timezone=True))
    
    is_organizer = Column(Boolean, default=False)
    is_optional = Column(Boolean, default=False)
    
    event = relationship('CalendarEvent', back_populates='attendees')
    user = relationship('User')

# ═══════════════════════════════════════════════════════════════════════════════
# DOCUMENT MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class Document(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'documents'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey('organizations.id'), nullable=False)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id'), nullable=True)
    folder_id = Column(UUID(as_uuid=True), ForeignKey('document_folders.id'), nullable=True)
    
    # File info
    name = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)
    mime_type = Column(String(100))
    file_size = Column(BigInteger, default=0)
    file_path = Column(String(1000))
    file_url = Column(String(1000))
    
    # Version
    version = Column(Integer, default=1)
    parent_version_id = Column(UUID(as_uuid=True), ForeignKey('documents.id'))
    
    # Status
    status = Column(Enum(DocumentStatus), default=DocumentStatus.DRAFT)
    
    # Template
    template_id = Column(String(100))
    template_data = Column(JSONB, default={})
    
    # Metadata
    tags = Column(ARRAY(String), default=[])
    metadata = Column(JSONB, default={})
    
    # Relationships
    created_by = relationship('User', back_populates='documents')
    project = relationship('Project', back_populates='documents')
    folder = relationship('DocumentFolder', back_populates='documents')
    signatures = relationship('DocumentSignature', back_populates='document', cascade='all, delete-orphan')
    viewers = relationship('User', secondary=document_viewers, backref='shared_documents')
    
    __table_args__ = (
        Index('ix_documents_org_folder', 'organization_id', 'folder_id'),
    )


class DocumentFolder(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'document_folders'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey('organizations.id'), nullable=False)
    parent_id = Column(UUID(as_uuid=True), ForeignKey('document_folders.id'), nullable=True)
    
    name = Column(String(255), nullable=False)
    color = Column(String(20))
    
    documents = relationship('Document', back_populates='folder')
    subfolders = relationship('DocumentFolder', backref=backref('parent', remote_side=[id]))


class DocumentSignature(Base, TimestampMixin):
    __tablename__ = 'document_signatures'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey('documents.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True)
    
    signer_name = Column(String(255), nullable=False)
    signer_email = Column(String(255), nullable=False)
    signer_role = Column(String(100))
    
    status = Column(String(50), default='pending')
    signed_at = Column(DateTime(timezone=True))
    signature_data = Column(Text)  # Base64 signature image
    ip_address = Column(INET)
    
    document = relationship('Document', back_populates='signatures')
    user = relationship('User')

# ═══════════════════════════════════════════════════════════════════════════════
# NOTIFICATION & ACTIVITY MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class Notification(Base, TimestampMixin):
    __tablename__ = 'notifications'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    type = Column(Enum(NotificationType), nullable=False)
    title = Column(String(500), nullable=False)
    body = Column(Text)
    
    icon = Column(String(50))
    action_url = Column(String(500))
    
    priority = Column(String(20), default='normal')
    channels = Column(ARRAY(String), default=['in_app'])
    
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True))
    
    data = Column(JSONB, default={})
    
    user = relationship('User', back_populates='notifications')
    
    __table_args__ = (
        Index('ix_notifications_user_read', 'user_id', 'is_read'),
        Index('ix_notifications_created', 'created_at'),
    )


class ActivityLog(Base):
    __tablename__ = 'activity_logs'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey('organizations.id'), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True)
    
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(UUID(as_uuid=True))
    resource_name = Column(String(500))
    
    changes = Column(JSONB, default={})
    
    ip_address = Column(INET)
    user_agent = Column(String(500))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    __table_args__ = (
        Index('ix_activity_org_created', 'organization_id', 'created_at'),
        Index('ix_activity_resource', 'resource_type', 'resource_id'),
    )

# ═══════════════════════════════════════════════════════════════════════════════
# CREATE ALL TABLES
# ═══════════════════════════════════════════════════════════════════════════════

def create_tables():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully!")

def drop_tables():
    """Drop all database tables."""
    Base.metadata.drop_all(bind=engine)
    print("⚠️ All tables dropped!")

if __name__ == "__main__":
    create_tables()
