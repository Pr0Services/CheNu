"""
CHE·NU Backend - Tasks Routes
=============================
Task management endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from datetime import datetime
from uuid import uuid4

router = APIRouter()


# ─────────────────────────────────────────────────────
# SCHEMAS
# ─────────────────────────────────────────────────────

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    project_id: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None


class TaskResponse(TaskBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────────────
# IN-MEMORY STORAGE (replace with DB in production)
# ─────────────────────────────────────────────────────

_tasks_db: dict = {}


# ─────────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────────

@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    project_id: Optional[str] = Query(None, alias="projet_id"),
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
):
    """Get all tasks with optional filtering."""
    tasks = list(_tasks_db.values())
    
    if project_id:
        tasks = [t for t in tasks if t.get("project_id") == project_id]
    if status:
        tasks = [t for t in tasks if t.get("status") == status]
    
    return tasks[offset:offset + limit]


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    """Get a specific task."""
    if task_id not in _tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    return _tasks_db[task_id]


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskCreate):
    """Create a new task."""
    task_id = f"task_{uuid4().hex[:8]}"
    now = datetime.utcnow()
    
    task_data = {
        **task.model_dump(),
        "id": task_id,
        "created_at": now,
        "updated_at": now,
    }
    
    _tasks_db[task_id] = task_data
    return task_data


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, task: TaskUpdate):
    """Update a task."""
    if task_id not in _tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_data = _tasks_db[task_id]
    update_data = task.model_dump(exclude_unset=True)
    task_data.update(update_data)
    task_data["updated_at"] = datetime.utcnow()
    
    return task_data


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: str):
    """Delete a task."""
    if task_id not in _tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    del _tasks_db[task_id]
