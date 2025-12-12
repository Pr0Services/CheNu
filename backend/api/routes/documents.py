"""
CHE·NU Backend - Documents Routes
=================================
Document management endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Query, UploadFile, File
from pydantic import BaseModel
from datetime import datetime
from uuid import uuid4

router = APIRouter()


class DocumentResponse(BaseModel):
    id: str
    name: str
    type: str
    size: int
    url: str
    project_id: Optional[str] = None
    uploaded_by: Optional[str] = None
    created_at: datetime


_documents_db: dict = {}


@router.get("", response_model=List[DocumentResponse])
async def get_documents(
    project_id: Optional[str] = Query(None),
    type: Optional[str] = None,
    limit: int = 50,
):
    """Get all documents."""
    docs = list(_documents_db.values())
    if project_id:
        docs = [d for d in docs if d.get("project_id") == project_id]
    if type:
        docs = [d for d in docs if d.get("type") == type]
    return docs[:limit]


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(doc_id: str):
    """Get a specific document."""
    if doc_id not in _documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    return _documents_db[doc_id]


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    project_id: Optional[str] = None,
):
    """Upload a document."""
    doc_id = f"doc_{uuid4().hex[:8]}"
    
    doc_data = {
        "id": doc_id,
        "name": file.filename,
        "type": file.content_type or "application/octet-stream",
        "size": 0,  # Would be calculated from actual file
        "url": f"/files/{doc_id}/{file.filename}",
        "project_id": project_id,
        "created_at": datetime.utcnow(),
    }
    
    _documents_db[doc_id] = doc_data
    return doc_data


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(doc_id: str):
    """Delete a document."""
    if doc_id not in _documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    del _documents_db[doc_id]
