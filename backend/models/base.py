"""
CHE·NU Database Models - Base
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()


class TimestampMixin:
    """Mixin for created_at and updated_at timestamps."""
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class User(Base, TimestampMixin):
    """User model."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    role = Column(String(50), default="user")
    avatar_url = Column(String(500), nullable=True)
    preferences = Column(JSON, default=dict)
    
    # Relationships
    spheres = relationship("UserSphere", back_populates="user")
    projects = relationship("Project", back_populates="owner")
    
    def __repr__(self):
        return f"<User {self.email}>"


class Sphere(Base, TimestampMixin):
    """Sphere model - represents the 10 life spheres."""
    __tablename__ = "spheres"
    
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    name_fr = Column(String(100), nullable=False)
    icon = Column(String(50), nullable=False)
    color = Column(String(7), nullable=False)  # Hex color
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    config = Column(JSON, default=dict)
    
    # Relationships
    users = relationship("UserSphere", back_populates="sphere")
    agents = relationship("Agent", back_populates="sphere")
    
    def __repr__(self):
        return f"<Sphere {self.slug}>"


class UserSphere(Base, TimestampMixin):
    """User-Sphere association with preferences."""
    __tablename__ = "user_spheres"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sphere_id = Column(Integer, ForeignKey("spheres.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    is_favorite = Column(Boolean, default=False)
    custom_color = Column(String(7), nullable=True)
    custom_order = Column(Integer, nullable=True)
    settings = Column(JSON, default=dict)
    
    # Relationships
    user = relationship("User", back_populates="spheres")
    sphere = relationship("Sphere", back_populates="users")


class Agent(Base, TimestampMixin):
    """Agent model - AI agents in the system."""
    __tablename__ = "agents"
    
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    level = Column(String(2), nullable=False)  # L0, L1, L2, L3
    sphere_id = Column(Integer, ForeignKey("spheres.id"), nullable=True)
    description = Column(Text, nullable=True)
    capabilities = Column(JSON, default=list)
    constraints = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    config = Column(JSON, default=dict)
    
    # Relationships
    sphere = relationship("Sphere", back_populates="agents")
    
    def __repr__(self):
        return f"<Agent {self.slug} ({self.level})>"


class Project(Base, TimestampMixin):
    """Project model."""
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sphere_id = Column(Integer, ForeignKey("spheres.id"), nullable=True)
    status = Column(String(50), default="active")
    metadata = Column(JSON, default=dict)
    
    # Relationships
    owner = relationship("User", back_populates="projects")
    tasks = relationship("Task", back_populates="project")
    
    def __repr__(self):
        return f"<Project {self.name}>"


class Task(Base, TimestampMixin):
    """Task model."""
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(50), default="pending")
    priority = Column(Integer, default=0)
    due_date = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    metadata = Column(JSON, default=dict)
    
    # Relationships
    project = relationship("Project", back_populates="tasks")
    
    def __repr__(self):
        return f"<Task {self.title}>"


class Meeting(Base, TimestampMixin):
    """Meeting model for meeting rooms."""
    __tablename__ = "meetings"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sphere_id = Column(Integer, ForeignKey("spheres.id"), nullable=True)
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="scheduled")
    participants = Column(JSON, default=list)
    agents = Column(JSON, default=list)
    recording_url = Column(String(500), nullable=True)
    transcript = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    decisions = Column(JSON, default=list)
    
    def __repr__(self):
        return f"<Meeting {self.title}>"


class Timeline(Base, TimestampMixin):
    """Timeline event for audit trail."""
    __tablename__ = "timeline_events"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_type = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=True)
    entity_id = Column(Integer, nullable=True)
    sphere_id = Column(Integer, ForeignKey("spheres.id"), nullable=True)
    data = Column(JSON, default=dict)
    metadata = Column(JSON, default=dict)
    
    def __repr__(self):
        return f"<Timeline {self.event_type}>"
