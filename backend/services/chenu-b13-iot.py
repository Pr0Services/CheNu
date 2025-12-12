"""
═══════════════════════════════════════════════════════════════════════════════
CHE·NU™ — BATCH 13: IOT SENSOR INTEGRATION
═══════════════════════════════════════════════════════════════════════════════

Features:
- IOT-01: Sensor device management
- IOT-02: Real-time data streaming
- IOT-03: Environmental monitoring (temp, humidity, dust)
- IOT-04: Equipment tracking & utilization
- IOT-05: Safety alerts (gas, vibration, noise)
- IOT-06: Geofencing & zone monitoring
- IOT-07: Energy consumption tracking
- IOT-08: Predictive maintenance
- IOT-09: Data aggregation & analytics
- IOT-10: Mobile sensor dashboard

═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Callable
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, field
import uuid
import json
import random
import asyncio
import logging

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field

logger = logging.getLogger("CHENU.IoT")
router = APIRouter(prefix="/api/v1/iot", tags=["IoT Sensors"])

# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class SensorType(str, Enum):
    TEMPERATURE = "temperature"
    HUMIDITY = "humidity"
    DUST_PM25 = "dust_pm25"
    NOISE = "noise"
    VIBRATION = "vibration"
    GAS_CO = "gas_co"
    GAS_CO2 = "gas_co2"
    LIGHT = "light"
    MOTION = "motion"
    GPS = "gps"
    POWER = "power"
    WATER_FLOW = "water_flow"

class DeviceStatus(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    WARNING = "warning"
    ERROR = "error"
    MAINTENANCE = "maintenance"

class AlertSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"
    EMERGENCY = "emergency"

class ZoneType(str, Enum):
    WORK_AREA = "work_area"
    RESTRICTED = "restricted"
    SAFETY = "safety"
    STORAGE = "storage"
    EQUIPMENT = "equipment"

# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class GeoPoint:
    latitude: float
    longitude: float
    altitude: Optional[float] = None

@dataclass
class SensorDevice:
    id: str
    name: str
    type: SensorType
    project_id: str
    location: GeoPoint
    zone_id: Optional[str]
    status: DeviceStatus
    battery_level: float
    firmware_version: str
    last_reading: Optional['SensorReading']
    last_seen: datetime
    config: Dict[str, Any]
    tags: List[str]

@dataclass
class SensorReading:
    id: str
    device_id: str
    sensor_type: SensorType
    value: float
    unit: str
    timestamp: datetime
    quality: float  # 0-1 data quality score
    metadata: Dict[str, Any]

@dataclass
class Alert:
    id: str
    device_id: str
    project_id: str
    severity: AlertSeverity
    type: str
    message: str
    value: float
    threshold: float
    triggered_at: datetime
    acknowledged: bool
    acknowledged_by: Optional[str]
    resolved_at: Optional[datetime]

@dataclass
class Zone:
    id: str
    project_id: str
    name: str
    type: ZoneType
    polygon: List[GeoPoint]
    max_occupancy: Optional[int]
    current_occupancy: int
    devices: List[str]
    rules: List[Dict[str, Any]]

@dataclass
class Equipment:
    id: str
    name: str
    type: str
    project_id: str
    tracker_device_id: Optional[str]
    location: Optional[GeoPoint]
    status: str
    hours_used: float
    fuel_level: Optional[float]
    next_maintenance: Optional[datetime]
    utilization_percent: float

# ═══════════════════════════════════════════════════════════════════════════════
# SENSOR THRESHOLDS
# ═══════════════════════════════════════════════════════════════════════════════

THRESHOLDS = {
    SensorType.TEMPERATURE: {"min": -20, "max": 45, "warning": 35, "critical": 40},
    SensorType.HUMIDITY: {"min": 0, "max": 100, "warning": 80, "critical": 95},
    SensorType.DUST_PM25: {"min": 0, "max": 500, "warning": 35, "critical": 150},
    SensorType.NOISE: {"min": 0, "max": 140, "warning": 85, "critical": 105},
    SensorType.VIBRATION: {"min": 0, "max": 100, "warning": 50, "critical": 80},
    SensorType.GAS_CO: {"min": 0, "max": 500, "warning": 35, "critical": 200},
    SensorType.GAS_CO2: {"min": 0, "max": 5000, "warning": 1000, "critical": 2000},
}

UNITS = {
    SensorType.TEMPERATURE: "°C",
    SensorType.HUMIDITY: "%",
    SensorType.DUST_PM25: "µg/m³",
    SensorType.NOISE: "dB",
    SensorType.VIBRATION: "mm/s",
    SensorType.GAS_CO: "ppm",
    SensorType.GAS_CO2: "ppm",
    SensorType.LIGHT: "lux",
    SensorType.POWER: "kW",
    SensorType.WATER_FLOW: "L/min",
}

# ═══════════════════════════════════════════════════════════════════════════════
# DEVICE MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class DeviceManager:
    _devices: Dict[str, SensorDevice] = {}
    
    @classmethod
    def _init_sample(cls):
        if cls._devices:
            return
        
        project_id = "proj_dupont"
        devices = [
            ("Temp Extérieur", SensorType.TEMPERATURE, 45.5234, -73.5678),
            ("Humidité Sous-sol", SensorType.HUMIDITY, 45.5235, -73.5679),
            ("Qualité Air Zone A", SensorType.DUST_PM25, 45.5236, -73.5680),
            ("Niveau Bruit Chantier", SensorType.NOISE, 45.5237, -73.5681),
            ("Détecteur CO Garage", SensorType.GAS_CO, 45.5238, -73.5682),
            ("GPS Excavatrice", SensorType.GPS, 45.5240, -73.5685),
        ]
        
        for name, sensor_type, lat, lng in devices:
            device = SensorDevice(
                id=f"dev_{uuid.uuid4().hex[:8]}",
                name=name,
                type=sensor_type,
                project_id=project_id,
                location=GeoPoint(lat, lng),
                zone_id=None,
                status=DeviceStatus.ONLINE,
                battery_level=random.uniform(0.5, 1.0),
                firmware_version="2.1.0",
                last_reading=None,
                last_seen=datetime.utcnow() - timedelta(minutes=random.randint(1, 30)),
                config={},
                tags=[],
            )
            cls._devices[device.id] = device
    
    @classmethod
    async def get_devices(cls, project_id: str) -> List[SensorDevice]:
        cls._init_sample()
        return [d for d in cls._devices.values() if d.project_id == project_id]
    
    @classmethod
    async def get_device(cls, device_id: str) -> Optional[SensorDevice]:
        cls._init_sample()
        return cls._devices.get(device_id)
    
    @classmethod
    async def register_device(cls, name: str, sensor_type: SensorType, project_id: str, lat: float, lng: float) -> SensorDevice:
        device = SensorDevice(
            id=f"dev_{uuid.uuid4().hex[:8]}",
            name=name, type=sensor_type, project_id=project_id,
            location=GeoPoint(lat, lng), zone_id=None,
            status=DeviceStatus.ONLINE, battery_level=1.0,
            firmware_version="2.1.0", last_reading=None,
            last_seen=datetime.utcnow(), config={}, tags=[],
        )
        cls._devices[device.id] = device
        return device

# ═══════════════════════════════════════════════════════════════════════════════
# READING PROCESSOR
# ═══════════════════════════════════════════════════════════════════════════════

class ReadingProcessor:
    _readings: List[SensorReading] = []
    _alerts: List[Alert] = []
    _subscribers: Dict[str, List[WebSocket]] = {}
    
    @classmethod
    async def process_reading(cls, device_id: str, value: float, metadata: Dict = None) -> SensorReading:
        device = await DeviceManager.get_device(device_id)
        if not device:
            raise HTTPException(404, "Device not found")
        
        reading = SensorReading(
            id=f"read_{uuid.uuid4().hex[:8]}",
            device_id=device_id,
            sensor_type=device.type,
            value=value,
            unit=UNITS.get(device.type, ""),
            timestamp=datetime.utcnow(),
            quality=0.95,
            metadata=metadata or {},
        )
        
        cls._readings.append(reading)
        device.last_reading = reading
        device.last_seen = datetime.utcnow()
        
        # Check thresholds
        await cls._check_thresholds(device, reading)
        
        # Broadcast to subscribers
        await cls._broadcast(device.project_id, reading)
        
        # Keep only last 1000 readings
        if len(cls._readings) > 1000:
            cls._readings = cls._readings[-1000:]
        
        return reading
    
    @classmethod
    async def _check_thresholds(cls, device: SensorDevice, reading: SensorReading):
        thresholds = THRESHOLDS.get(device.type)
        if not thresholds:
            return
        
        severity = None
        if reading.value >= thresholds.get("critical", float("inf")):
            severity = AlertSeverity.CRITICAL
        elif reading.value >= thresholds.get("warning", float("inf")):
            severity = AlertSeverity.WARNING
        
        if severity:
            alert = Alert(
                id=f"alert_{uuid.uuid4().hex[:8]}",
                device_id=device.id,
                project_id=device.project_id,
                severity=severity,
                type=f"{device.type.value}_exceeded",
                message=f"{device.name}: {reading.value}{reading.unit} dépasse le seuil",
                value=reading.value,
                threshold=thresholds.get("warning", 0),
                triggered_at=datetime.utcnow(),
                acknowledged=False,
                acknowledged_by=None,
                resolved_at=None,
            )
            cls._alerts.append(alert)
            logger.warning(f"Alert triggered: {alert.message}")
    
    @classmethod
    async def _broadcast(cls, project_id: str, reading: SensorReading):
        for ws in cls._subscribers.get(project_id, []):
            try:
                await ws.send_json({
                    "type": "reading",
                    "device_id": reading.device_id,
                    "value": reading.value,
                    "unit": reading.unit,
                    "timestamp": reading.timestamp.isoformat(),
                })
            except Exception:
                pass
    
    @classmethod
    async def get_readings(cls, device_id: str, hours: int = 24) -> List[SensorReading]:
        cutoff = datetime.utcnow() - timedelta(hours=hours)
        return [r for r in cls._readings if r.device_id == device_id and r.timestamp >= cutoff]
    
    @classmethod
    async def get_alerts(cls, project_id: str, unacknowledged_only: bool = False) -> List[Alert]:
        alerts = [a for a in cls._alerts if a.project_id == project_id]
        if unacknowledged_only:
            alerts = [a for a in alerts if not a.acknowledged]
        return sorted(alerts, key=lambda a: a.triggered_at, reverse=True)
    
    @classmethod
    async def acknowledge_alert(cls, alert_id: str, user_id: str) -> Alert:
        for alert in cls._alerts:
            if alert.id == alert_id:
                alert.acknowledged = True
                alert.acknowledged_by = user_id
                return alert
        raise HTTPException(404, "Alert not found")

# ═══════════════════════════════════════════════════════════════════════════════
# ZONE MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class ZoneManager:
    _zones: Dict[str, Zone] = {}
    
    @classmethod
    async def create_zone(cls, name: str, zone_type: ZoneType, project_id: str, polygon: List[Dict]) -> Zone:
        zone = Zone(
            id=f"zone_{uuid.uuid4().hex[:8]}",
            project_id=project_id,
            name=name,
            type=zone_type,
            polygon=[GeoPoint(**p) for p in polygon],
            max_occupancy=50 if zone_type == ZoneType.WORK_AREA else 10,
            current_occupancy=0,
            devices=[],
            rules=[],
        )
        cls._zones[zone.id] = zone
        return zone
    
    @classmethod
    async def check_geofence(cls, device_id: str, lat: float, lng: float) -> List[str]:
        """Check which zones a device is in."""
        zones_in = []
        for zone in cls._zones.values():
            if cls._point_in_polygon(lat, lng, zone.polygon):
                zones_in.append(zone.id)
        return zones_in
    
    @staticmethod
    def _point_in_polygon(lat: float, lng: float, polygon: List[GeoPoint]) -> bool:
        # Simple ray casting algorithm
        n = len(polygon)
        inside = False
        j = n - 1
        for i in range(n):
            if ((polygon[i].latitude > lat) != (polygon[j].latitude > lat) and
                lng < (polygon[j].longitude - polygon[i].longitude) * (lat - polygon[i].latitude) / 
                (polygon[j].latitude - polygon[i].latitude) + polygon[i].longitude):
                inside = not inside
            j = i
        return inside

# ═══════════════════════════════════════════════════════════════════════════════
# EQUIPMENT TRACKER
# ═══════════════════════════════════════════════════════════════════════════════

class EquipmentTracker:
    _equipment: Dict[str, Equipment] = {}
    
    @classmethod
    def _init_sample(cls):
        if cls._equipment:
            return
        
        items = [
            ("Excavatrice CAT 320", "excavator", 1250.5, 0.75),
            ("Chargeuse Komatsu", "loader", 890.2, 0.82),
            ("Grue Tour Liebherr", "crane", 2100.0, 0.65),
            ("Bétonnière 8m³", "mixer", 450.8, 0.90),
        ]
        
        for name, eq_type, hours, util in items:
            eq = Equipment(
                id=f"eq_{uuid.uuid4().hex[:8]}",
                name=name, type=eq_type, project_id="proj_dupont",
                tracker_device_id=None, location=GeoPoint(45.5234, -73.5678),
                status="active", hours_used=hours, fuel_level=random.uniform(0.3, 0.9),
                next_maintenance=datetime.utcnow() + timedelta(days=random.randint(5, 30)),
                utilization_percent=util * 100,
            )
            cls._equipment[eq.id] = eq
    
    @classmethod
    async def get_equipment(cls, project_id: str) -> List[Equipment]:
        cls._init_sample()
        return [e for e in cls._equipment.values() if e.project_id == project_id]
    
    @classmethod
    async def update_location(cls, equipment_id: str, lat: float, lng: float):
        eq = cls._equipment.get(equipment_id)
        if eq:
            eq.location = GeoPoint(lat, lng)
    
    @classmethod
    async def get_utilization_report(cls, project_id: str) -> Dict[str, Any]:
        cls._init_sample()
        equipment = await cls.get_equipment(project_id)
        
        if not equipment:
            return {"average_utilization": 0, "equipment": []}
        
        avg_util = sum(e.utilization_percent for e in equipment) / len(equipment)
        
        return {
            "average_utilization": round(avg_util, 1),
            "total_equipment": len(equipment),
            "equipment": [
                {
                    "id": e.id,
                    "name": e.name,
                    "utilization": e.utilization_percent,
                    "hours": e.hours_used,
                    "fuel": e.fuel_level,
                    "next_maintenance": e.next_maintenance.isoformat() if e.next_maintenance else None,
                }
                for e in equipment
            ],
        }

# ═══════════════════════════════════════════════════════════════════════════════
# ENERGY TRACKER
# ═══════════════════════════════════════════════════════════════════════════════

class EnergyTracker:
    @staticmethod
    async def get_consumption(project_id: str, days: int = 30) -> Dict[str, Any]:
        # Generate mock energy data
        daily_data = []
        for i in range(days):
            date = datetime.utcnow() - timedelta(days=days - i - 1)
            daily_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "electricity_kwh": random.uniform(800, 1500),
                "gas_m3": random.uniform(50, 150),
                "water_l": random.uniform(2000, 5000),
            })
        
        totals = {
            "electricity_kwh": sum(d["electricity_kwh"] for d in daily_data),
            "gas_m3": sum(d["gas_m3"] for d in daily_data),
            "water_l": sum(d["water_l"] for d in daily_data),
        }
        
        return {
            "project_id": project_id,
            "period_days": days,
            "totals": totals,
            "cost_estimate_cad": totals["electricity_kwh"] * 0.08 + totals["gas_m3"] * 0.50 + totals["water_l"] * 0.002,
            "daily": daily_data,
        }

# ═══════════════════════════════════════════════════════════════════════════════
# PREDICTIVE MAINTENANCE
# ═══════════════════════════════════════════════════════════════════════════════

class PredictiveMaintenance:
    @staticmethod
    async def analyze(equipment_id: str) -> Dict[str, Any]:
        # Mock predictive maintenance analysis
        return {
            "equipment_id": equipment_id,
            "health_score": random.uniform(0.7, 0.95),
            "predicted_failure_date": (datetime.utcnow() + timedelta(days=random.randint(30, 180))).isoformat(),
            "recommendations": [
                {"priority": "high", "action": "Remplacer filtre hydraulique", "due_in_days": 15},
                {"priority": "medium", "action": "Vérifier courroies", "due_in_days": 30},
                {"priority": "low", "action": "Lubrification générale", "due_in_days": 7},
            ],
            "anomalies_detected": random.randint(0, 3),
            "last_analysis": datetime.utcnow().isoformat(),
        }

# ═══════════════════════════════════════════════════════════════════════════════
# REQUEST MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class RegisterDeviceRequest(BaseModel):
    name: str
    type: SensorType
    project_id: str
    latitude: float
    longitude: float

class SubmitReadingRequest(BaseModel):
    device_id: str
    value: float
    metadata: Dict[str, Any] = {}

class CreateZoneRequest(BaseModel):
    name: str
    type: ZoneType
    project_id: str
    polygon: List[Dict[str, float]]

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/devices/{project_id}")
async def list_devices(project_id: str):
    devices = await DeviceManager.get_devices(project_id)
    return {
        "devices": [
            {
                "id": d.id, "name": d.name, "type": d.type.value,
                "status": d.status.value, "battery": d.battery_level,
                "last_seen": d.last_seen.isoformat(),
            }
            for d in devices
        ]
    }

@router.post("/devices")
async def register_device(req: RegisterDeviceRequest):
    device = await DeviceManager.register_device(req.name, req.type, req.project_id, req.latitude, req.longitude)
    return {"id": device.id, "name": device.name}

@router.post("/readings")
async def submit_reading(req: SubmitReadingRequest):
    reading = await ReadingProcessor.process_reading(req.device_id, req.value, req.metadata)
    return {"id": reading.id, "value": reading.value, "unit": reading.unit}

@router.get("/readings/{device_id}")
async def get_readings(device_id: str, hours: int = 24):
    readings = await ReadingProcessor.get_readings(device_id, hours)
    return {"readings": [{"value": r.value, "unit": r.unit, "time": r.timestamp.isoformat()} for r in readings]}

@router.get("/alerts/{project_id}")
async def get_alerts(project_id: str, unacknowledged: bool = False):
    alerts = await ReadingProcessor.get_alerts(project_id, unacknowledged)
    return {"alerts": [{"id": a.id, "severity": a.severity.value, "message": a.message} for a in alerts]}

@router.post("/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    alert = await ReadingProcessor.acknowledge_alert(alert_id, "current_user")
    return {"id": alert.id, "acknowledged": alert.acknowledged}

@router.get("/equipment/{project_id}")
async def get_equipment(project_id: str):
    return await EquipmentTracker.get_utilization_report(project_id)

@router.get("/equipment/{equipment_id}/maintenance")
async def get_maintenance_prediction(equipment_id: str):
    return await PredictiveMaintenance.analyze(equipment_id)

@router.get("/energy/{project_id}")
async def get_energy_consumption(project_id: str, days: int = 30):
    return await EnergyTracker.get_consumption(project_id, days)

@router.post("/zones")
async def create_zone(req: CreateZoneRequest):
    zone = await ZoneManager.create_zone(req.name, req.type, req.project_id, req.polygon)
    return {"id": zone.id, "name": zone.name}

@router.websocket("/stream/{project_id}")
async def websocket_stream(websocket: WebSocket, project_id: str):
    await websocket.accept()
    ReadingProcessor._subscribers.setdefault(project_id, []).append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ReadingProcessor._subscribers[project_id].remove(websocket)
