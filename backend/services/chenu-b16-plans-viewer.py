"""
CHE·NU™ — B16-1: PLANS & BLUEPRINTS VIEWER
- PDF/DWG/DXF viewer
- Annotations & markups
- Version control
- Measure tools
- Layer toggle
- Share & compare
"""

from typing import Any, Dict, List, Optional
from datetime import datetime
from enum import Enum
from dataclasses import dataclass
import uuid

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/plans", tags=["Plans & Blueprints"])

class PlanType(str, Enum):
    ARCHITECTURAL = "architectural"
    STRUCTURAL = "structural"
    ELECTRICAL = "electrical"
    PLUMBING = "plumbing"
    HVAC = "hvac"
    SITE = "site"
    DETAIL = "detail"

class AnnotationType(str, Enum):
    TEXT = "text"
    ARROW = "arrow"
    RECTANGLE = "rectangle"
    CIRCLE = "circle"
    CLOUD = "cloud"
    MEASUREMENT = "measurement"
    STAMP = "stamp"

class PlanStatus(str, Enum):
    DRAFT = "draft"
    FOR_REVIEW = "for_review"
    APPROVED = "approved"
    SUPERSEDED = "superseded"
    REJECTED = "rejected"

@dataclass
class PlanSheet:
    id: str
    project_id: str
    name: str
    number: str  # A-101, S-201, etc.
    type: PlanType
    version: int
    status: PlanStatus
    file_url: str
    thumbnail_url: str
    file_format: str  # pdf, dwg, dxf
    scale: str  # 1:50, 1:100
    size: str  # A1, A2, Letter
    layers: List[str]
    uploaded_by: str
    uploaded_at: datetime
    approved_by: Optional[str]
    approved_at: Optional[datetime]

@dataclass
class PlanAnnotation:
    id: str
    sheet_id: str
    type: AnnotationType
    page: int
    x: float
    y: float
    width: Optional[float]
    height: Optional[float]
    content: str
    color: str
    author: str
    created_at: datetime
    resolved: bool

@dataclass
class PlanComparison:
    id: str
    sheet_id: str
    version_a: int
    version_b: int
    differences: List[Dict]
    created_at: datetime

class PlanManager:
    _sheets: Dict[str, PlanSheet] = {}
    _annotations: List[PlanAnnotation] = []
    _versions: Dict[str, List[PlanSheet]] = {}  # sheet_number -> versions
    
    # Sample plans
    _samples = [
        ("A-101", "Plan d'étage - RDC", PlanType.ARCHITECTURAL, "1:50"),
        ("A-102", "Plan d'étage - Étage", PlanType.ARCHITECTURAL, "1:50"),
        ("A-201", "Élévations", PlanType.ARCHITECTURAL, "1:100"),
        ("S-101", "Fondations", PlanType.STRUCTURAL, "1:50"),
        ("S-201", "Charpente", PlanType.STRUCTURAL, "1:50"),
        ("E-101", "Plan électrique", PlanType.ELECTRICAL, "1:50"),
        ("P-101", "Plan plomberie", PlanType.PLUMBING, "1:50"),
        ("M-101", "Plan HVAC", PlanType.HVAC, "1:50"),
    ]
    
    for num, name, ptype, scale in _samples:
        sheet = PlanSheet(
            f"plan_{uuid.uuid4().hex[:8]}", "proj_1", name, num, ptype, 1,
            PlanStatus.APPROVED, f"/plans/{num}.pdf", f"/plans/thumb_{num}.jpg",
            "pdf", scale, "A1", ["walls", "dimensions", "annotations", "grid"],
            "architect", datetime.utcnow(), "pm", datetime.utcnow()
        )
        _sheets[sheet.id] = sheet
    
    @classmethod
    async def upload(cls, project_id: str, file: UploadFile, sheet_number: str, 
                    name: str, plan_type: PlanType, scale: str) -> PlanSheet:
        # Check for existing versions
        existing = [s for s in cls._sheets.values() if s.number == sheet_number]
        version = len(existing) + 1
        
        # Mark old version as superseded
        for old in existing:
            old.status = PlanStatus.SUPERSEDED
        
        sheet = PlanSheet(
            f"plan_{uuid.uuid4().hex[:8]}", project_id, name, sheet_number,
            plan_type, version, PlanStatus.FOR_REVIEW,
            f"/plans/{sheet_number}_v{version}.pdf",
            f"/plans/thumb_{sheet_number}_v{version}.jpg",
            file.filename.split(".")[-1], scale, "A1",
            ["walls", "dimensions", "grid"], "user", datetime.utcnow(), None, None
        )
        cls._sheets[sheet.id] = sheet
        return sheet
    
    @classmethod
    async def get_sheets(cls, project_id: str, plan_type: Optional[PlanType] = None) -> List[Dict]:
        sheets = [s for s in cls._sheets.values() if s.project_id == project_id]
        if plan_type:
            sheets = [s for s in sheets if s.type == plan_type]
        return [{"id": s.id, "number": s.number, "name": s.name, "type": s.type.value,
                 "version": s.version, "status": s.status.value, "url": s.file_url} for s in sheets]
    
    @classmethod
    async def add_annotation(cls, sheet_id: str, ann_type: AnnotationType, page: int,
                            x: float, y: float, content: str, color: str, author: str) -> PlanAnnotation:
        ann = PlanAnnotation(
            f"ann_{uuid.uuid4().hex[:8]}", sheet_id, ann_type, page, x, y,
            None, None, content, color, author, datetime.utcnow(), False
        )
        cls._annotations.append(ann)
        return ann
    
    @classmethod
    async def get_annotations(cls, sheet_id: str) -> List[Dict]:
        anns = [a for a in cls._annotations if a.sheet_id == sheet_id]
        return [{"id": a.id, "type": a.type.value, "page": a.page, "x": a.x, "y": a.y,
                 "content": a.content, "author": a.author, "resolved": a.resolved} for a in anns]
    
    @classmethod
    async def compare_versions(cls, sheet_number: str, v1: int, v2: int) -> Dict:
        sheets = [s for s in cls._sheets.values() if s.number == sheet_number]
        sheet_v1 = next((s for s in sheets if s.version == v1), None)
        sheet_v2 = next((s for s in sheets if s.version == v2), None)
        
        if not sheet_v1 or not sheet_v2:
            raise HTTPException(404, "Version not found")
        
        # Mock differences
        return {
            "sheet": sheet_number,
            "version_a": v1,
            "version_b": v2,
            "differences": [
                {"type": "added", "description": "Nouvelle fenêtre ajoutée", "location": "Page 1, Zone A3"},
                {"type": "modified", "description": "Dimension modifiée", "location": "Page 1, Zone B2"},
                {"type": "removed", "description": "Porte supprimée", "location": "Page 1, Zone C4"},
            ],
            "summary": {"added": 5, "modified": 12, "removed": 2}
        }
    
    @classmethod
    async def approve(cls, sheet_id: str, approver: str) -> PlanSheet:
        sheet = cls._sheets.get(sheet_id)
        if not sheet:
            raise HTTPException(404, "Sheet not found")
        sheet.status = PlanStatus.APPROVED
        sheet.approved_by = approver
        sheet.approved_at = datetime.utcnow()
        return sheet

class MeasureTool:
    @classmethod
    async def calculate(cls, scale: str, pixels: float) -> Dict:
        # Parse scale (1:50 means 1cm = 50cm real)
        parts = scale.split(":")
        scale_factor = int(parts[1]) / int(parts[0])
        
        # Assume 96 DPI, 1 inch = 2.54 cm
        cm_on_screen = pixels / 96 * 2.54
        real_cm = cm_on_screen * scale_factor
        
        return {
            "pixels": pixels,
            "scale": scale,
            "on_paper_cm": round(cm_on_screen, 2),
            "real_cm": round(real_cm, 2),
            "real_m": round(real_cm / 100, 3),
            "real_ft": round(real_cm / 30.48, 2),
        }

# API Endpoints
@router.get("/{project_id}")
async def list_plans(project_id: str, type: Optional[PlanType] = None):
    return {"sheets": await PlanManager.get_sheets(project_id, type)}

@router.post("/upload")
async def upload_plan(project_id: str, sheet_number: str, name: str, 
                     plan_type: PlanType, scale: str, file: UploadFile = File(...)):
    sheet = await PlanManager.upload(project_id, file, sheet_number, name, plan_type, scale)
    return {"id": sheet.id, "number": sheet.number, "version": sheet.version}

@router.get("/{sheet_id}/annotations")
async def get_annotations(sheet_id: str):
    return {"annotations": await PlanManager.get_annotations(sheet_id)}

@router.post("/{sheet_id}/annotations")
async def add_annotation(sheet_id: str, type: AnnotationType, page: int,
                        x: float, y: float, content: str, color: str = "#FF0000"):
    ann = await PlanManager.add_annotation(sheet_id, type, page, x, y, content, color, "user")
    return {"id": ann.id}

@router.get("/compare/{sheet_number}")
async def compare_versions(sheet_number: str, v1: int, v2: int):
    return await PlanManager.compare_versions(sheet_number, v1, v2)

@router.post("/{sheet_id}/approve")
async def approve_plan(sheet_id: str):
    sheet = await PlanManager.approve(sheet_id, "pm")
    return {"id": sheet.id, "status": sheet.status.value}

@router.post("/measure")
async def measure(scale: str, pixels: float):
    return await MeasureTool.calculate(scale, pixels)
