"""CHE·NU — Agents Routes - Agents assist, never decide"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional

router = APIRouter()

AGENTS = {
    "personal": [{"id": "personal-assistant", "name": "Personal Assistant", "role": "Assistance sans jugement", "forbidden": ["Juger", "Profiler", "Partager"]}],
    "methodology": [
        {"id": "methodology-analyst", "name": "Methodology Analyst", "role": "Analyse et structure", "forbidden": ["Choisir pour l'utilisateur"]},
        {"id": "process-orchestrator", "name": "Process Orchestrator", "role": "Orchestre les processus", "forbidden": ["Forcer une méthode"]},
    ],
    "business": [
        {"id": "project-agent", "name": "Project Agent", "role": "Gestion de projet", "forbidden": ["Profiler les membres"]},
        {"id": "workflow-agent", "name": "Workflow Agent", "role": "Automatisation", "forbidden": ["Scoring caché"]},
        {"id": "resource-agent", "name": "Resource Agent", "role": "Allocation", "forbidden": ["Optimiser les humains"]},
    ],
    "scholar": [
        {"id": "research-agent", "name": "Research Agent", "role": "Recherche", "forbidden": ["Noter l'utilisateur"]},
        {"id": "synthesis-agent", "name": "Synthesis Agent", "role": "Synthèse", "forbidden": ["Simplifier à l'excès"]},
    ],
    "creative_studio": [
        {"id": "ideation-agent", "name": "Ideation Agent", "role": "Génération d'idées", "forbidden": ["Classer les idées"]},
        {"id": "writing-agent", "name": "Writing Agent", "role": "Rédaction", "forbidden": ["Imposer un style"]},
        {"id": "visual-agent", "name": "Visual Agent", "role": "Création visuelle", "forbidden": ["Juger l'esthétique"]},
    ],
    "xr_meeting": [
        {"id": "meeting-facilitator", "name": "Meeting Facilitator", "role": "Facilitation", "forbidden": ["Diriger la discussion"]},
        {"id": "replay-agent", "name": "Replay Agent", "role": "Replays", "forbidden": ["Analyser comportements"]},
    ],
    "social_media": [
        {"id": "content-organization", "name": "Content Organization", "role": "Organisation", "forbidden": ["Nudging"]},
        {"id": "feed-curator", "name": "Feed Curator", "role": "Curation", "forbidden": ["Maximiser engagement"]},
    ],
    "institutions": [
        {"id": "compliance-agent", "name": "Compliance Agent", "role": "Conformité", "forbidden": ["Profiler citoyens"]},
        {"id": "audit-agent", "name": "Audit Agent", "role": "Audit", "forbidden": ["Prédire comportements"]},
    ]
}

class AgentMessage(BaseModel):
    message: str
    context: Optional[Dict] = None

@router.get("/")
async def list_all_agents():
    """Get all agents by sphere"""
    total = sum(len(a) for a in AGENTS.values())
    return {"total_agents": total, "agents_by_sphere": AGENTS}

@router.get("/sphere/{sphere_id}")
async def list_sphere_agents(sphere_id: str):
    """Get agents for a sphere"""
    if sphere_id not in AGENTS:
        raise HTTPException(status_code=404, detail=f"Sphere '{sphere_id}' not found")
    return AGENTS[sphere_id]

@router.post("/{agent_id}/invoke")
async def invoke_agent(agent_id: str, request: AgentMessage):
    """Invoke an agent — Law 2 & 3: No evaluation, no manipulation"""
    for sid, agents in AGENTS.items():
        for a in agents:
            if a["id"] == agent_id:
                return {
                    "agent": agent_id, "sphere": sid,
                    "response": f"[{a['name']}] Assisting with: {a['role']}. YOU decide.",
                    "forbidden": a.get("forbidden", []),
                    "note": "L'IA assiste. L'humain décide. Toujours."
                }
    raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")
