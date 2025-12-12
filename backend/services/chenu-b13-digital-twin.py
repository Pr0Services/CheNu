"""
═══════════════════════════════════════════════════════════════════════════════
CHE·NU™ — BATCH 13: DIGITAL TWIN
═══════════════════════════════════════════════════════════════════════════════

Features:
- DT-01: Real-time 3D site representation
- DT-02: Live sensor data overlay
- DT-03: Construction simulation
- DT-04: "What-if" scenario modeling
- DT-05: Historical timeline playback
- DT-06: Anomaly visualization
- DT-07: Progress prediction
- DT-08: Resource flow visualization
- DT-09: Environmental impact simulation
- DT-10: Collaborative twin viewing

═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, field
import uuid
import json
import math
import random
import asyncio
import logging

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field

logger = logging.getLogger("CHENU.DigitalTwin")
router = APIRouter(prefix="/api/v1/twin", tags=["Digital Twin"])

# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class ElementType(str, Enum):
    BUILDING = "building"
    FOUNDATION = "foundation"
    STRUCTURE = "structure"
    WALL = "wall"
    FLOOR = "floor"
    ROOF = "roof"
    MEP = "mep"
    EQUIPMENT = "equipment"
    VEHICLE = "vehicle"
    WORKER = "worker"
    MATERIAL = "material"
    SENSOR = "sensor"
    ZONE = "zone"

class ElementStatus(str, Enum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DELAYED = "delayed"
    ISSUE = "issue"

class SimulationType(str, Enum):
    CONSTRUCTION_SEQUENCE = "construction_sequence"
    RESOURCE_FLOW = "resource_flow"
    WEATHER_IMPACT = "weather_impact"
    SCHEDULE_OPTIMIZATION = "schedule_optimization"
    SAFETY_ANALYSIS = "safety_analysis"

class ScenarioType(str, Enum):
    BASELINE = "baseline"
    OPTIMISTIC = "optimistic"
    PESSIMISTIC = "pessimistic"
    RESOURCE_ADDED = "resource_added"
    DELAY_RECOVERY = "delay_recovery"
    WEATHER_DELAY = "weather_delay"

# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class Vector3:
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0
    
    def to_dict(self) -> Dict[str, float]:
        return {"x": self.x, "y": self.y, "z": self.z}

@dataclass
class Transform:
    position: Vector3 = field(default_factory=Vector3)
    rotation: Vector3 = field(default_factory=Vector3)
    scale: Vector3 = field(default_factory=lambda: Vector3(1, 1, 1))

@dataclass
class TwinElement:
    id: str
    type: ElementType
    name: str
    transform: Transform
    status: ElementStatus
    progress: float  # 0-100
    model_url: Optional[str]
    parent_id: Optional[str]
    children: List[str]
    properties: Dict[str, Any]
    sensor_ids: List[str]
    metadata: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

@dataclass
class SensorOverlay:
    sensor_id: str
    element_id: str
    position: Vector3
    current_value: float
    unit: str
    status: str  # normal, warning, critical
    last_updated: datetime

@dataclass
class TimelineSnapshot:
    id: str
    project_id: str
    timestamp: datetime
    elements: List[Dict[str, Any]]
    metrics: Dict[str, Any]
    weather: Dict[str, Any]
    notes: str

@dataclass
class Simulation:
    id: str
    project_id: str
    type: SimulationType
    name: str
    parameters: Dict[str, Any]
    status: str  # pending, running, completed, failed
    started_at: datetime
    completed_at: Optional[datetime]
    results: Optional[Dict[str, Any]]
    frames: List[Dict[str, Any]]

@dataclass
class Scenario:
    id: str
    project_id: str
    type: ScenarioType
    name: str
    description: str
    assumptions: Dict[str, Any]
    timeline: List[Dict[str, Any]]
    kpis: Dict[str, Any]
    created_at: datetime

@dataclass
class DigitalTwin:
    id: str
    project_id: str
    name: str
    elements: Dict[str, TwinElement]
    sensors: List[SensorOverlay]
    current_snapshot: Optional[TimelineSnapshot]
    simulations: List[str]
    scenarios: List[str]
    created_at: datetime
    updated_at: datetime
    settings: Dict[str, Any]

# ═══════════════════════════════════════════════════════════════════════════════
# REQUEST MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class CreateTwinRequest(BaseModel):
    project_id: str
    name: str
    settings: Dict[str, Any] = {}

class AddElementRequest(BaseModel):
    type: ElementType
    name: str
    position: Dict[str, float]
    rotation: Dict[str, float] = {"x": 0, "y": 0, "z": 0}
    scale: Dict[str, float] = {"x": 1, "y": 1, "z": 1}
    model_url: Optional[str] = None
    parent_id: Optional[str] = None
    properties: Dict[str, Any] = {}

class UpdateElementRequest(BaseModel):
    status: Optional[ElementStatus] = None
    progress: Optional[float] = None
    position: Optional[Dict[str, float]] = None
    properties: Optional[Dict[str, Any]] = None

class RunSimulationRequest(BaseModel):
    type: SimulationType
    name: str
    parameters: Dict[str, Any] = {}
    duration_days: int = 30

class CreateScenarioRequest(BaseModel):
    type: ScenarioType
    name: str
    description: str = ""
    assumptions: Dict[str, Any] = {}

# ═══════════════════════════════════════════════════════════════════════════════
# TWIN MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class TwinManager:
    _twins: Dict[str, DigitalTwin] = {}
    _simulations: Dict[str, Simulation] = {}
    _scenarios: Dict[str, Scenario] = {}
    _snapshots: List[TimelineSnapshot] = []
    
    @classmethod
    def _init_sample(cls):
        if cls._twins:
            return
        
        project_id = "proj_dupont"
        twin_id = f"twin_{uuid.uuid4().hex[:8]}"
        
        # Create sample elements
        elements = {}
        element_data = [
            ("foundation", ElementType.FOUNDATION, Vector3(0, 0, 0), 100, ElementStatus.COMPLETED),
            ("structure_main", ElementType.STRUCTURE, Vector3(0, 3, 0), 85, ElementStatus.IN_PROGRESS),
            ("wall_north", ElementType.WALL, Vector3(0, 3, -10), 70, ElementStatus.IN_PROGRESS),
            ("wall_south", ElementType.WALL, Vector3(0, 3, 10), 65, ElementStatus.IN_PROGRESS),
            ("floor_1", ElementType.FLOOR, Vector3(0, 3, 0), 90, ElementStatus.COMPLETED),
            ("floor_2", ElementType.FLOOR, Vector3(0, 6, 0), 45, ElementStatus.IN_PROGRESS),
            ("roof", ElementType.ROOF, Vector3(0, 9, 0), 0, ElementStatus.PLANNED),
            ("mep_electrical", ElementType.MEP, Vector3(2, 4, 0), 30, ElementStatus.IN_PROGRESS),
            ("excavator_1", ElementType.EQUIPMENT, Vector3(-15, 0, 5), 100, ElementStatus.COMPLETED),
            ("crane_1", ElementType.EQUIPMENT, Vector3(10, 0, -5), 100, ElementStatus.COMPLETED),
        ]
        
        for elem_id, elem_type, pos, progress, status in element_data:
            element = TwinElement(
                id=elem_id,
                type=elem_type,
                name=elem_id.replace("_", " ").title(),
                transform=Transform(position=pos),
                status=status,
                progress=progress,
                model_url=f"/models/{elem_type.value}.glb",
                parent_id=None,
                children=[],
                properties={},
                sensor_ids=[],
                metadata={},
                created_at=datetime.utcnow() - timedelta(days=30),
                updated_at=datetime.utcnow(),
            )
            elements[elem_id] = element
        
        twin = DigitalTwin(
            id=twin_id,
            project_id=project_id,
            name="Maison Dupont - Digital Twin",
            elements=elements,
            sensors=[],
            current_snapshot=None,
            simulations=[],
            scenarios=[],
            created_at=datetime.utcnow() - timedelta(days=30),
            updated_at=datetime.utcnow(),
            settings={"auto_sync": True, "snapshot_interval_hours": 24},
        )
        
        cls._twins[twin_id] = twin
    
    @classmethod
    async def create_twin(cls, request: CreateTwinRequest) -> DigitalTwin:
        twin = DigitalTwin(
            id=f"twin_{uuid.uuid4().hex[:8]}",
            project_id=request.project_id,
            name=request.name,
            elements={},
            sensors=[],
            current_snapshot=None,
            simulations=[],
            scenarios=[],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            settings=request.settings,
        )
        cls._twins[twin.id] = twin
        return twin
    
    @classmethod
    async def get_twin(cls, twin_id: str) -> Optional[DigitalTwin]:
        cls._init_sample()
        return cls._twins.get(twin_id)
    
    @classmethod
    async def get_twin_by_project(cls, project_id: str) -> Optional[DigitalTwin]:
        cls._init_sample()
        for twin in cls._twins.values():
            if twin.project_id == project_id:
                return twin
        return None
    
    @classmethod
    async def add_element(cls, twin_id: str, request: AddElementRequest) -> TwinElement:
        twin = await cls.get_twin(twin_id)
        if not twin:
            raise HTTPException(404, "Twin not found")
        
        element = TwinElement(
            id=f"elem_{uuid.uuid4().hex[:8]}",
            type=request.type,
            name=request.name,
            transform=Transform(
                position=Vector3(**request.position),
                rotation=Vector3(**request.rotation),
                scale=Vector3(**request.scale),
            ),
            status=ElementStatus.PLANNED,
            progress=0,
            model_url=request.model_url,
            parent_id=request.parent_id,
            children=[],
            properties=request.properties,
            sensor_ids=[],
            metadata={},
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        
        twin.elements[element.id] = element
        twin.updated_at = datetime.utcnow()
        
        return element
    
    @classmethod
    async def update_element(cls, twin_id: str, element_id: str, request: UpdateElementRequest) -> TwinElement:
        twin = await cls.get_twin(twin_id)
        if not twin or element_id not in twin.elements:
            raise HTTPException(404, "Element not found")
        
        element = twin.elements[element_id]
        
        if request.status:
            element.status = request.status
        if request.progress is not None:
            element.progress = request.progress
        if request.position:
            element.transform.position = Vector3(**request.position)
        if request.properties:
            element.properties.update(request.properties)
        
        element.updated_at = datetime.utcnow()
        twin.updated_at = datetime.utcnow()
        
        return element
    
    @classmethod
    async def get_state(cls, twin_id: str) -> Dict[str, Any]:
        """Get full current state of the digital twin."""
        twin = await cls.get_twin(twin_id)
        if not twin:
            raise HTTPException(404, "Twin not found")
        
        elements_data = []
        for elem in twin.elements.values():
            elements_data.append({
                "id": elem.id,
                "type": elem.type.value,
                "name": elem.name,
                "transform": {
                    "position": elem.transform.position.to_dict(),
                    "rotation": elem.transform.rotation.to_dict(),
                    "scale": elem.transform.scale.to_dict(),
                },
                "status": elem.status.value,
                "progress": elem.progress,
                "model_url": elem.model_url,
            })
        
        # Calculate overall progress
        total_progress = sum(e.progress for e in twin.elements.values())
        avg_progress = total_progress / len(twin.elements) if twin.elements else 0
        
        return {
            "id": twin.id,
            "name": twin.name,
            "elements": elements_data,
            "sensors": twin.sensors,
            "metrics": {
                "total_elements": len(twin.elements),
                "overall_progress": round(avg_progress, 1),
                "completed": len([e for e in twin.elements.values() if e.status == ElementStatus.COMPLETED]),
                "in_progress": len([e for e in twin.elements.values() if e.status == ElementStatus.IN_PROGRESS]),
                "delayed": len([e for e in twin.elements.values() if e.status == ElementStatus.DELAYED]),
            },
            "updated_at": twin.updated_at.isoformat(),
        }

# ═══════════════════════════════════════════════════════════════════════════════
# SIMULATION ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

class SimulationEngine:
    @classmethod
    async def run_simulation(cls, twin_id: str, request: RunSimulationRequest) -> Simulation:
        twin = await TwinManager.get_twin(twin_id)
        if not twin:
            raise HTTPException(404, "Twin not found")
        
        simulation = Simulation(
            id=f"sim_{uuid.uuid4().hex[:8]}",
            project_id=twin.project_id,
            type=request.type,
            name=request.name,
            parameters=request.parameters,
            status="running",
            started_at=datetime.utcnow(),
            completed_at=None,
            results=None,
            frames=[],
        )
        
        TwinManager._simulations[simulation.id] = simulation
        twin.simulations.append(simulation.id)
        
        # Generate simulation frames
        frames = await cls._generate_frames(twin, request.type, request.duration_days)
        simulation.frames = frames
        
        # Calculate results
        simulation.results = await cls._calculate_results(frames, request.type)
        simulation.status = "completed"
        simulation.completed_at = datetime.utcnow()
        
        return simulation
    
    @classmethod
    async def _generate_frames(cls, twin: DigitalTwin, sim_type: SimulationType, days: int) -> List[Dict]:
        frames = []
        
        for day in range(days):
            frame_date = datetime.utcnow() + timedelta(days=day)
            
            elements_state = []
            for elem in twin.elements.values():
                # Simulate progress
                if elem.status == ElementStatus.IN_PROGRESS:
                    daily_progress = random.uniform(0.5, 2.0)
                    new_progress = min(100, elem.progress + daily_progress * day)
                else:
                    new_progress = elem.progress
                
                elements_state.append({
                    "id": elem.id,
                    "progress": round(new_progress, 1),
                    "status": "completed" if new_progress >= 100 else elem.status.value,
                })
            
            # Simulate weather impact
            weather = {
                "temperature": random.uniform(-5, 25),
                "precipitation": random.choice([0, 0, 0, 5, 10, 25]),
                "wind_speed": random.uniform(0, 30),
                "work_impact": 1.0 if random.random() > 0.2 else 0.5,
            }
            
            frames.append({
                "day": day,
                "date": frame_date.isoformat(),
                "elements": elements_state,
                "weather": weather,
                "resources": {
                    "workers": random.randint(8, 15),
                    "equipment_active": random.randint(2, 5),
                },
            })
        
        return frames
    
    @classmethod
    async def _calculate_results(cls, frames: List[Dict], sim_type: SimulationType) -> Dict[str, Any]:
        if not frames:
            return {}
        
        final_frame = frames[-1]
        
        # Calculate completion predictions
        completed_elements = sum(1 for e in final_frame["elements"] if e["status"] == "completed")
        total_elements = len(final_frame["elements"])
        
        # Weather impact days
        weather_impact_days = sum(1 for f in frames if f["weather"]["work_impact"] < 1.0)
        
        return {
            "predicted_completion": f"{len(frames)} days",
            "completion_rate": round(completed_elements / total_elements * 100, 1) if total_elements else 0,
            "weather_delay_days": weather_impact_days,
            "average_daily_workers": round(sum(f["resources"]["workers"] for f in frames) / len(frames), 1),
            "confidence": 0.85,
            "bottlenecks": [
                {"element": "roof", "reason": "Dépend de la structure", "delay_risk": "medium"},
                {"element": "mep_electrical", "reason": "Sous-traitant", "delay_risk": "low"},
            ],
        }
    
    @classmethod
    async def get_simulation(cls, simulation_id: str) -> Optional[Simulation]:
        return TwinManager._simulations.get(simulation_id)

# ═══════════════════════════════════════════════════════════════════════════════
# SCENARIO MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class ScenarioManager:
    @classmethod
    async def create_scenario(cls, twin_id: str, request: CreateScenarioRequest) -> Scenario:
        twin = await TwinManager.get_twin(twin_id)
        if not twin:
            raise HTTPException(404, "Twin not found")
        
        # Generate timeline based on scenario type
        timeline = await cls._generate_timeline(twin, request.type, request.assumptions)
        
        # Calculate KPIs
        kpis = await cls._calculate_kpis(timeline, request.type)
        
        scenario = Scenario(
            id=f"scen_{uuid.uuid4().hex[:8]}",
            project_id=twin.project_id,
            type=request.type,
            name=request.name,
            description=request.description,
            assumptions=request.assumptions,
            timeline=timeline,
            kpis=kpis,
            created_at=datetime.utcnow(),
        )
        
        TwinManager._scenarios[scenario.id] = scenario
        twin.scenarios.append(scenario.id)
        
        return scenario
    
    @classmethod
    async def _generate_timeline(cls, twin: DigitalTwin, scenario_type: ScenarioType, assumptions: Dict) -> List[Dict]:
        timeline = []
        
        # Base completion estimate
        base_days = 60
        
        # Adjust based on scenario
        multipliers = {
            ScenarioType.BASELINE: 1.0,
            ScenarioType.OPTIMISTIC: 0.85,
            ScenarioType.PESSIMISTIC: 1.25,
            ScenarioType.RESOURCE_ADDED: 0.80,
            ScenarioType.DELAY_RECOVERY: 1.10,
            ScenarioType.WEATHER_DELAY: 1.30,
        }
        
        days = int(base_days * multipliers.get(scenario_type, 1.0))
        
        for week in range(days // 7 + 1):
            week_start = datetime.utcnow() + timedelta(weeks=week)
            timeline.append({
                "week": week + 1,
                "date": week_start.isoformat(),
                "milestone": f"Semaine {week + 1}",
                "progress": min(100, (week + 1) / (days / 7) * 100),
                "activities": [
                    "Construction continue",
                    "Inspections régulières",
                ],
            })
        
        return timeline
    
    @classmethod
    async def _calculate_kpis(cls, timeline: List[Dict], scenario_type: ScenarioType) -> Dict[str, Any]:
        final_week = timeline[-1] if timeline else {"week": 0}
        
        base_cost = 500000
        cost_multipliers = {
            ScenarioType.BASELINE: 1.0,
            ScenarioType.OPTIMISTIC: 0.95,
            ScenarioType.PESSIMISTIC: 1.15,
            ScenarioType.RESOURCE_ADDED: 1.10,
            ScenarioType.DELAY_RECOVERY: 1.05,
            ScenarioType.WEATHER_DELAY: 1.08,
        }
        
        return {
            "estimated_duration_weeks": final_week["week"],
            "estimated_cost": round(base_cost * cost_multipliers.get(scenario_type, 1.0), 2),
            "risk_level": "low" if scenario_type == ScenarioType.OPTIMISTIC else "medium",
            "resource_utilization": 0.85,
            "confidence": 0.80,
        }
    
    @classmethod
    async def compare_scenarios(cls, scenario_ids: List[str]) -> Dict[str, Any]:
        scenarios = [TwinManager._scenarios.get(sid) for sid in scenario_ids if sid in TwinManager._scenarios]
        
        if len(scenarios) < 2:
            raise HTTPException(400, "Need at least 2 scenarios to compare")
        
        comparison = {
            "scenarios": [
                {
                    "id": s.id,
                    "name": s.name,
                    "type": s.type.value,
                    "duration_weeks": s.kpis.get("estimated_duration_weeks", 0),
                    "cost": s.kpis.get("estimated_cost", 0),
                    "risk": s.kpis.get("risk_level", "unknown"),
                }
                for s in scenarios
            ],
            "recommendation": scenarios[0].id,  # Simplified
            "analysis": "Basé sur les paramètres actuels, le scénario baseline est recommandé.",
        }
        
        return comparison

# ═══════════════════════════════════════════════════════════════════════════════
# TIMELINE MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class TimelineManager:
    @classmethod
    async def capture_snapshot(cls, twin_id: str, notes: str = "") -> TimelineSnapshot:
        twin = await TwinManager.get_twin(twin_id)
        if not twin:
            raise HTTPException(404, "Twin not found")
        
        elements_data = [
            {
                "id": e.id,
                "type": e.type.value,
                "status": e.status.value,
                "progress": e.progress,
                "position": e.transform.position.to_dict(),
            }
            for e in twin.elements.values()
        ]
        
        snapshot = TimelineSnapshot(
            id=f"snap_{uuid.uuid4().hex[:8]}",
            project_id=twin.project_id,
            timestamp=datetime.utcnow(),
            elements=elements_data,
            metrics={
                "overall_progress": sum(e.progress for e in twin.elements.values()) / len(twin.elements) if twin.elements else 0,
            },
            weather={"temperature": 18, "conditions": "sunny"},
            notes=notes,
        )
        
        TwinManager._snapshots.append(snapshot)
        twin.current_snapshot = snapshot
        
        return snapshot
    
    @classmethod
    async def get_timeline(cls, twin_id: str, start_date: datetime = None, end_date: datetime = None) -> List[TimelineSnapshot]:
        twin = await TwinManager.get_twin(twin_id)
        if not twin:
            raise HTTPException(404, "Twin not found")
        
        snapshots = [s for s in TwinManager._snapshots if s.project_id == twin.project_id]
        
        if start_date:
            snapshots = [s for s in snapshots if s.timestamp >= start_date]
        if end_date:
            snapshots = [s for s in snapshots if s.timestamp <= end_date]
        
        return sorted(snapshots, key=lambda s: s.timestamp)
    
    @classmethod
    async def playback(cls, twin_id: str, speed: float = 1.0) -> Dict[str, Any]:
        """Get data for timeline playback."""
        snapshots = await cls.get_timeline(twin_id)
        
        return {
            "total_snapshots": len(snapshots),
            "speed": speed,
            "frames": [
                {
                    "id": s.id,
                    "timestamp": s.timestamp.isoformat(),
                    "progress": s.metrics.get("overall_progress", 0),
                }
                for s in snapshots
            ],
        }

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/")
async def create_twin(request: CreateTwinRequest):
    twin = await TwinManager.create_twin(request)
    return {"id": twin.id, "name": twin.name}

@router.get("/{twin_id}")
async def get_twin(twin_id: str):
    return await TwinManager.get_state(twin_id)

@router.get("/project/{project_id}")
async def get_twin_by_project(project_id: str):
    twin = await TwinManager.get_twin_by_project(project_id)
    if not twin:
        raise HTTPException(404, "Twin not found for project")
    return await TwinManager.get_state(twin.id)

@router.post("/{twin_id}/elements")
async def add_element(twin_id: str, request: AddElementRequest):
    element = await TwinManager.add_element(twin_id, request)
    return {"id": element.id, "name": element.name}

@router.patch("/{twin_id}/elements/{element_id}")
async def update_element(twin_id: str, element_id: str, request: UpdateElementRequest):
    element = await TwinManager.update_element(twin_id, element_id, request)
    return {"id": element.id, "status": element.status.value, "progress": element.progress}

@router.post("/{twin_id}/simulations")
async def run_simulation(twin_id: str, request: RunSimulationRequest):
    simulation = await SimulationEngine.run_simulation(twin_id, request)
    return {
        "id": simulation.id,
        "status": simulation.status,
        "results": simulation.results,
        "frames_count": len(simulation.frames),
    }

@router.get("/simulations/{simulation_id}")
async def get_simulation(simulation_id: str):
    sim = await SimulationEngine.get_simulation(simulation_id)
    if not sim:
        raise HTTPException(404, "Simulation not found")
    return {
        "id": sim.id,
        "type": sim.type.value,
        "status": sim.status,
        "results": sim.results,
    }

@router.post("/{twin_id}/scenarios")
async def create_scenario(twin_id: str, request: CreateScenarioRequest):
    scenario = await ScenarioManager.create_scenario(twin_id, request)
    return {"id": scenario.id, "name": scenario.name, "kpis": scenario.kpis}

@router.post("/scenarios/compare")
async def compare_scenarios(scenario_ids: List[str]):
    return await ScenarioManager.compare_scenarios(scenario_ids)

@router.post("/{twin_id}/snapshots")
async def capture_snapshot(twin_id: str, notes: str = ""):
    snapshot = await TimelineManager.capture_snapshot(twin_id, notes)
    return {"id": snapshot.id, "timestamp": snapshot.timestamp.isoformat()}

@router.get("/{twin_id}/timeline")
async def get_timeline(twin_id: str):
    snapshots = await TimelineManager.get_timeline(twin_id)
    return {"snapshots": [{"id": s.id, "timestamp": s.timestamp.isoformat()} for s in snapshots]}

@router.get("/{twin_id}/playback")
async def get_playback(twin_id: str, speed: float = 1.0):
    return await TimelineManager.playback(twin_id, speed)
