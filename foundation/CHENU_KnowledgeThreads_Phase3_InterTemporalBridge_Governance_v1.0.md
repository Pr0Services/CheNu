# CHE·NU — KNOWLEDGE THREADS (PHASE 3)
**VERSION:** CORE.v1.0  
**MODE:** BUILD-READY / NON-MANIPULATIVE

---

## OVERVIEW

Knowledge Threads = structured, verifiable links between: concepts, meetings, artifacts, spheres, decisions, timelines

### RULE
> **Threads CONNECT information. They DO NOT interpret, rank, or persuade.**

---

## 1) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Link knowledge across spheres (Business → Scholar → Creative → XR, etc.) **without merging authority or hierarchy.**

### Use Cases ⚡
- a business process referencing a scholar source
- a creative artifact linked to a social context
- **institutional guideline connected to business compliance** ⚡

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `reference_thread` | A refers to B |
| `support_thread` | **B provides foundational info to A** ⚡ |
| `parallel_thread` | **A and B evolve in similar domains** ⚡ |
| `derivative_thread` | **A generated from B (non-narrative)** ⚡ |

### Inter-Sphere Thread JSON ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "reference|support|parallel|derivative",
    "from": "entity_id",
    "to": "entity_id",
    "spheres": ["business","scholar"],
    "timestamp": 1712345678,
    "metadata": { "reason":"string" },
    "hash": "sha256"
  }
}
```

### Inter-Sphere Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **reference/support/parallel/derivative** ⚡ |
| `metadata.reason` | **String explanation** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| Threads NEVER infer meaning | ✅ |
| **Only exist when explicitly created or validated** | ✅ ⚡ |
| **Displayed as neutral lines, no color-weight bias** | ✅ ⚡ |

---

## 2) TEMPORAL KNOWLEDGE THREADS

### Purpose
Track the **EVOLUTION** of a concept, project, workflow, or decision across time.

### Use Cases ⚡
- A concept that evolves over 6 meetings
- A design that changes after new data
- **A regulation updated after organizational changes** ⚡

### Temporal Thread Types ⚡
| Type | Description |
|------|-------------|
| `continuation_thread` | **A → A2** ⚡ |
| `revision_thread` | **A → B** ⚡ |
| `branching_thread` | **A → C and A → D** ⚡ |
| `consolidation_thread` | **A, B → C** ⚡ |

### Temporal Thread JSON ⚡

```json
{
  "temporal_thread": {
    "id": "uuid",
    "origin": "entity_id",
    "next": "entity_id",
    "type": "continuation|revision|branch|consolidation",
    "timeline_index": 0,
    "timestamp": 1712345678,
    "context": "meeting|artifact|decision",
    "hash": "sha256"
  }
}
```

### Temporal Fields ⚡
| Field | Description |
|-------|-------------|
| `timeline_index` | **Integer position** ⚡ |
| `context` | **meeting/artifact/decision** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **Strict chronological order** | ✅ ⚡ |
| No speculation about causality | ✅ |
| **Timeline braiding allowed visually but always reversible** | ✅ ⚡ |

---

## 3) COLLECTIVE ↔ PERSONAL KNOWLEDGE BRIDGE ⚡

### Purpose
Synchronize what emerges in collective knowledge with a user's personal space **WITHOUT overriding personal autonomy or pushing prioritization.**

### Use Cases ⚡
- A user personally flags something relevant from a collective thread
- A collective thread references a user artifact
- **A personal note becomes globally referenced (opt-in only)** ⚡

### Bridge Thread Types ⚡
| Type | Description |
|------|-------------|
| `personal_adapter_thread` | ⚡ |
| `collective_reference_thread` | ⚡ |
| `opt_in_exposure_thread` | ⚡ |
| `silent_mirror_thread` | **(private mapping only)** ⚡ |

### Bridge Thread JSON ⚡

```json
{
  "bridge_thread": {
    "id": "uuid",
    "direction": "personal_to_collective|collective_to_personal",
    "source": "entity_id",
    "target": "entity_id",
    "visibility": "private|team|public_opt_in",
    "timestamp": 1712345678,
    "hash": "sha256"
  }
}
```

### Bridge Fields ⚡
| Field | Description |
|-------|-------------|
| `direction` | **personal_to_collective / collective_to_personal** ⚡ |
| `visibility` | **private/team/public_opt_in** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **User decides exposure level** | ✅ ⚡ |
| **No automatic conversion between personal ↔ collective** | ✅ ⚡ |
| **Bridge creation always logged** | ✅ ⚡ |

---

## THREAD GOVERNANCE & SAFETY ⚡

### Thread Creation Rules ⚡
| Rule | Description |
|------|-------------|
| **explicit user creation** | ⚡ |
| **agent suggestion → user approval required** | ⚡ |
| **system auto-thread ONLY for temporal continuity** | ⚡ |

### Thread Deletion Rules ⚡
| Rule | Scope |
|------|-------|
| **allowed only for personal threads** | ⚡ |
| **collective threads = immutable (append-only corrections)** | ⚡ |

### Thread Visualization Rules ⚡
| Rule | Status |
|------|--------|
| **never emphasized as "important"** | ✅ ⚡ |
| no ranking | ✅ |
| accessible filters | ✅ |

### Thread Ethics ⚡
| Forbidden | Status |
|-----------|--------|
| behavioral inference | ❌ |
| emotional tagging | ❌ |
| **nudging** | ❌ ⚡ |

---

## UNIFIED KNOWLEDGE THREAD GRAPH ⚡

### Nodes ⚡
- meetings, replays, artifacts, spheres, personal notes, decisions, agents

### Edges ⚡
| Edge Type | Description |
|-----------|-------------|
| `inter_sphere` | ✅ |
| `temporal` | ✅ |
| `collective_bridge` | ⚡ |
| `validation_link` | ⚡ |
| `silent_thread` | **(private)** ⚡ |

### Graph Rendering Behavior ⚡
| Property | Value |
|----------|-------|
| **cluster by sphere or timeline** | ⚡ |
| **fade non-selected zones** | ⚡ |
| **absolute bidirectional clarity** | ⚡ |
| **manipulable only in view, not in data** | ⚡ |

---

## AGENT ROLES ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_ORCHESTRATOR` | consistency, immutability, writes hashes, **NO interpretation** ⚡ |
| `AGENT_THREAD_EXPLAINER` | explains why, **uses ONLY metadata, no guessing** ⚡ |
| `AGENT_PERSONAL_BRIDGE_GUARD` | **prevents unintentional exposure, enforces opt-in** ⚡ |
| `AGENT_THREAD_INDEXER` | **maintains graph indexes, improves retrieval speed** ⚡ |

---

## KNOWLEDGE THREADS EXPORT FORMAT ⚡

| Export | Format |
|--------|--------|
| `.kthread.json` | **raw threads** ⚡ |
| `.kgraph.json` | **graph view** ⚡ |
| `.timeline.json` | **temporal map** ⚡ |
| `.bridge.json` | **personal/collective sync** ⚡ |

---

**END — PHASE 3 FREEZE READY**
