# CHE·NU — Unified Cognitive OS

```
 ██████╗██╗  ██╗███████╗   ███╗   ██╗██╗   ██╗
██╔════╝██║  ██║██╔════╝   ████╗  ██║██║   ██║
██║     ███████║█████╗     ██╔██╗ ██║██║   ██║
██║     ██╔══██║██╔══╝     ██║╚██╗██║██║   ██║
╚██████╗██║  ██║███████╗██╗██║ ╚████║╚██████╔╝
 ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝
         ULTRA PACK — SYSTEM ONLINE
```

## Overview

CHE·NU is a **Unified Cognitive OS** built on:

| Component | Description |
|-----------|-------------|
| **ULTRA PACK** | Complete system kernel |
| **CORE+** | Unified canonical rules |
| **OS 5.5** | Self-healing engine |
| **OS 6.0** | Multiplex reasoning |
| **PXR** | Persona XR engine |
| **CSF** | Conceptual simulation fabric |
| **LAWBOOK** | 15 strict governance laws |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CHE·NU ULTRA PACK                      │
├─────────────────────────────────────────────────────────────┤
│  User → Frontend → API → Orchestrator → LLM (ULTRA PACK)   │
│                           ↓                                 │
│                    ┌──────┴──────┐                         │
│                    │   AGENTS    │                         │
│  ┌─────────┐ ┌─────┴─────┐ ┌─────┴─────┐ ┌─────────┐      │
│  │  Nova   │ │ Architect │ │  Thread   │ │  Echo   │      │
│  │  Prime  │ │   Omega   │ │  Weaver   │ │  Mind   │      │
│  └─────────┘ └───────────┘ └───────────┘ └─────────┘      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  Reality    │ │    CSF      │ │    PXR      │          │
│  │ Synthesizer │ │  Simulator  │ │   Engine    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL ← Prisma ORM ← API (Fastify) → XR Gateway      │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# 1. Clone & setup
cd che-nu
cp devops/environment.example .env
# Edit .env with your API keys

# 2. Start with Docker
cd devops
docker-compose up -d

# 3. Verify
curl http://localhost:8080/health
```

## Project Structure

```
che-nu/
├── backend/            # Fastify API
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── services/   # Business logic
│   │   └── prisma/     # Database schema
├── orchestrator/       # LLM Router
│   ├── agents/         # CHE·NU agents
│   ├── router/         # LLM routing
│   └── system_prompts/ # ULTRA PACK prompt
├── xr-gateway/         # XR WebSocket service
├── frontend/           # React UI
└── devops/             # Docker & deployment
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orchestrator/dispatch` | Main task dispatch |
| POST | `/api/agents/:id/execute` | Execute specific agent |
| POST | `/api/simulation/run` | Run CSF simulation |
| POST | `/api/xr/render` | Render XR scene |
| GET | `/api/threads/:id` | Get knowledge thread |

## Agents

| Agent | Role |
|-------|------|
| **Nova Prime** | Global orchestrator, intent parsing |
| **Architect Ω** | Structure, workflows, schemas |
| **Thread Weaver ∞** | Timeline, temporal coherence |
| **EchoMind** | Tone, emotional neutrality |
| **Reality Synthesizer** | XR scenes, spatial logic |
| **CSF Simulator** | Conceptual simulations |
| **PXR Engine** | Personas, avatars |

## LAWBOOK (Enforced)

1. User sovereignty
2. No factual distortion
3. No hallucination
4. Reversibility
5. Clarity above complexity
6. No autonomy
7. No emotional manipulation
8. Canonical identity preservation
9. Temporal consistency
10. Safety in XR & representation
11. Agent cooperation
12. Minimal intrusiveness
13. No memory unless requested
14. Audit trail
15. **LAWBOOK overrides all modules**

## License

Proprietary — Pro-Service Construction / CHE·NU

---

**CHE·NU ULTRA PACK — SYSTEM ONLINE.** 🚀
