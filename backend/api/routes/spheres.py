"""CHE·NU Spheres Routes - The 8 Canonical Spheres"""
from fastapi import APIRouter, HTTPException
from core.foundation import CANONICAL_SPHERES, SPHERE_INTERACTIONS, can_spheres_interact, get_sphere_by_id

router = APIRouter()

SPHERE_AGENTS = {
    "personnel": [{"id": "assistant", "name": "Personal Assistant", "optional": True}],
    "methodology": [{"id": "analyst", "name": "Methodology Analyst"}, {"id": "orchestrator", "name": "Process Orchestrator"}],
    "business": [{"id": "project", "name": "Project Agent"}, {"id": "workflow", "name": "Workflow Agent"}],
    "scholar": [{"id": "research", "name": "Research Agent"}, {"id": "synthesis", "name": "Synthesis Agent"}],
    "creative_studio": [{"id": "ideation", "name": "Ideation Agent"}, {"id": "writing", "name": "Writing Agent"}],
    "xr_meeting": [{"id": "facilitator", "name": "Meeting Facilitator"}, {"id": "replay", "name": "Replay Agent"}],
    "social_media": [{"id": "content", "name": "Content Organization"}, {"id": "moderation", "name": "Moderation Support"}],
    "institutions": [{"id": "compliance", "name": "Compliance Agent"}, {"id": "audit", "name": "Audit Agent"}],
}

@router.get("/")
async def list_spheres():
    return [{"id": s.id, "name": s.name, "emoji": s.emoji, "role_fr": s.role_fr, "status": s.status.value} for s in CANONICAL_SPHERES]

@router.get("/{sphere_id}")
async def get_sphere(sphere_id: str):
    try:
        s = get_sphere_by_id(sphere_id)
        return {"id": s.id, "name": s.name, "emoji": s.emoji, "role_fr": s.role_fr, "status": s.status.value}
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Sphere '{sphere_id}' not found")

@router.get("/{sphere_id}/interactions")
async def get_interactions(sphere_id: str):
    if sphere_id not in SPHERE_INTERACTIONS:
        raise HTTPException(status_code=404, detail=f"Sphere '{sphere_id}' not found")
    return {"sphere": sphere_id, "interactions": [{"target": t, "allowed": a} for t, a in SPHERE_INTERACTIONS[sphere_id].items()]}

@router.get("/{sphere_id}/agents")
async def get_agents(sphere_id: str):
    if sphere_id not in SPHERE_AGENTS:
        raise HTTPException(status_code=404, detail=f"Sphere '{sphere_id}' not found")
    return {"sphere": sphere_id, "agents": SPHERE_AGENTS[sphere_id]}
