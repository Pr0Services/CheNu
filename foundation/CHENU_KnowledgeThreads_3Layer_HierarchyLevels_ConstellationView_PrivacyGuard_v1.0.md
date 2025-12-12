# CHE·NU — KNOWLEDGE THREADS (3-LAYER SYSTEM)
**VERSION:** MEMORY.v1.0  
**MODE:** FOUNDATION / TRACEABILITY / NON-MANIPULATIVE

---

## OVERVIEW

> **Knowledge Threads = coherent, traceable pathways** that link: data, meetings, decisions, artifacts, agents, spheres, users (optional, privacy-first)

### RULE
> **Threads REVEAL structure. Threads NEVER infer meaning, intent, or correctness.**

### 3 TYPES ⚡
1. **Intra-Sphere Threads** (local coherence)
2. **Inter-Sphere Threads** (cross-domain linkage)
3. **Collective Knowledge Threads** (shared high-level map)

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Show how knowledge evolves **WITHIN a sphere** (Business, Scholar, Creative, etc).

### Thread Sources ⚡
- meetings inside that sphere
- documents & artifacts
- tasks, decisions, replays
- **agent actions inside sphere boundaries** ⚡

### Node Types ⚡
| Type | Description |
|------|-------------|
| `Event` | ⚡ |
| `Decision` | ⚡ |
| `Artifact` | ⚡ |
| `Replay` | ⚡ |
| `Concept` | ⚡ |

### Edge Types ⚡
| Edge | Description |
|------|-------------|
| `derives_from` | ⚡ |
| `builds_on` | ⚡ |
| `contradicts` | **(flag only, no judgment)** ⚡ |
| `references` | ⚡ |
| `precedes` | ⚡ |

### Intra JSON Model ⚡

```json
{
  "intra_thread": {
    "sphere": "business|scholar|...",
    "nodes": [...],
    "edges": [...],
    "origin": "uuid",
    "hash": "sha256"
  }
}
```

### Visualization ⚡
| Mode | Description |
|------|-------------|
| **linear timeline mode** | ⚡ |
| **radial concept map** | ⚡ |
| **thread-thickness = density of supporting events** | ⚡ |

### Constraints ⚡
- no inference
- **no summarization beyond listing entries** ⚡
- **privacy filters auto-applied** ⚡

---

## 2) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Represent how knowledge moves **BETWEEN spheres.**

### Example Paths ⚡
| From | To |
|------|-----|
| Scholar | → Business ⚡ |
| Creative | → Social ⚡ |
| Institution | → XR ⚡ |
| **Methodology** | → **All** ⚡ |

### Triggers ⚡
| Trigger | Description |
|---------|-------------|
| **shared artifact used in two spheres** | ⚡ |
| **meeting referencing another domain** | ⚡ |
| **decision depending on external knowledge** | ⚡ |
| **cross-sphere agent participation** | ⚡ |

### Node Types ⚡
| Type | Description |
|------|-------------|
| `sphere_anchor` | ⚡ |
| `cross_reference` | ⚡ |
| `artifact_bridge` | ⚡ |
| `replay_reference` | ⚡ |

### Edge Types ⚡
| Edge | Description |
|------|-------------|
| `imported_from` | ⚡ |
| `exported_to` | ⚡ |
| `co_evolved_with` | ⚡ |

### Inter JSON Model ⚡

```json
{
  "inter_thread": {
    "spheres": ["scholar", "business"],
    "bridges": [...],
    "nodes": [...],
    "edges": [...],
    "confidence": 1.0
  }
}
```

### Inter Fields ⚡
| Field | Description |
|-------|-------------|
| `bridges` | **Array of bridge nodes** ⚡ |
| `confidence` | **1.0 (always factual)** ⚡ |

### Visualization (Universe View Orbit Lines) ⚡
- color-coded by sphere
- **"bridge nodes" glow softly** ⚡
- **never highlights importance (non-manipulative)** ⚡

### Rules ⚡
- no ranking spheres
- no weighting impact
- no predictive modeling

---

## 3) COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
Provide a **shared, immutable map** of what has happened across the entire Che-Nu ecosystem.

### Thread Sources ⚡
- validated XR replays
- **global collective memory entries** ⚡
- cross-sphere dependencies
- decision logs
- artifact histories

### Hierarchy Levels ⚡ (NOUVEAU!)
| Level | Description |
|-------|-------------|
| **GLOBAL THREAD** | (root) ⚡ |
| **SPHERE THREADS** | ⚡ |
| **TOPIC THREADS** | ⚡ |
| **MEETING THREADS** | ⚡ |
| **EVENT THREADS** | ⚡ |

### Collective JSON Model ⚡

```json
{
  "collective_thread": {
    "root_topic": "string",
    "threads": [...],
    "events": [...],
    "artifacts": [...],
    "lineage": [
      { "source": "uuid", "verified": true }
    ],
    "hash": "sha256"
  }
}
```

### Collective Fields ⚡
| Field | Description |
|-------|-------------|
| `root_topic` | **String** ⚡ |
| `lineage[].verified` | **boolean** ⚡ |

### Visualization Modes ⚡

**1) CONSTELLATION VIEW ⚡**
| Element | = |
|---------|---|
| stars | = topics |
| orbits | = spheres |
| lines | = validated links |

**2) THREAD WEAVING VIEW ⚡**
- braided timelines
- **reversible zoom** ⚡

**3) SILENT MODE ⚡**
- no annotations
- **only pure structure** ⚡

### Rules ⚡
- never interpret meaning
- no sentiment extraction
- no pattern prediction

---

## THREAD OPERATIONS (SAFE ONLY) ⚡

### ALLOWED ⚡
| Operation | Description |
|-----------|-------------|
| `trace_path(nodeA → nodeB)` | ⚡ |
| `list_all_dependencies(item)` | ⚡ |
| `show_all_references(item)` | ⚡ |
| `highlight_connections(sphere)` | ⚡ |
| `timeline_alignment` | ⚡ |

### BLOCKED ⚡
| Forbidden | Status |
|-----------|--------|
| **"suggest next action"** | ❌ ⚡ |
| **"evaluate correctness"** | ❌ ⚡ |
| **"rate importance"** | ❌ ⚡ |
| **"predict outcome"** | ❌ ⚡ |
| **"recommend decisions"** | ❌ ⚡ |

---

## AGENTS INVOLVED ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **constructs threads from structured data, no interpretation** ⚡ |
| `AGENT_THREAD_VALIDATOR` | **ensures immutability & cryptographic lineage** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **produces human-readable REFERENCE ONLY, never prescriptive** ⚡ |
| `AGENT_PRIVACY_GUARD` | **removes user identifiers, enforces access boundaries** ⚡ |

---

## ETHICAL GUARANTEES ⚡

| Guarantee | Status |
|-----------|--------|
| **No manipulation** | ✅ ⚡ |
| **No prioritization** | ✅ ⚡ |
| **No steering** | ✅ ⚡ |
| **No sentiment inference** | ✅ ⚡ |
| **Immutable truth, reversible view** | ✅ ⚡ |
| **Threads = structure, not narrative** | ✅ ⚡ |

---

**END — KNOWLEDGE THREADS v1.0**
