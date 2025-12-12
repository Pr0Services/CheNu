# CHE·NU — KNOWLEDGE THREAD SYSTEM (FACTUAL/CONTEXTUAL/DECISIONAL)
**VERSION:** FOUNDATION v1.0  
**MODE:** STRUCTURAL / NON-MANIPULATIVE / TRACEABLE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **CONTINUOUS TRACE** linking information across time, spheres, agents, and contexts **WITHOUT interpretation.**

### RULE
> **Threads show CONNECTIONS, not conclusions.**

---

## THREAD TYPES

| # | Type | Purpose |
|---|------|---------|
| 1 | FACTUAL THREAD | Track hard information |
| 2 | CONTEXTUAL THREAD | Preserve context |
| 3 | DECISIONAL THREAD | Trace decision emergence |

> **All three coexist. None dominates the others.**

---

## TYPE 1 — FACTUAL KNOWLEDGE THREAD

### Purpose
Track **HARD INFORMATION** across the system.

### Includes ⚡
- documents, data artifacts, files, metrics, **visual outputs** ⚡, **schemas** ⚡

### Sources
- meetings, uploads, agent outputs, XR artifacts, **external imports** ⚡

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| immutable after validation | ✅ |
| no inferred meaning | ✅ |
| **no emotional tags** | ✅ ⚡ |

### Factual Thread JSON (with type field + sphere per entry) ⚡

```json
{
  "factual_thread": {
    "id": "uuid",
    "entries": [
      {
        "artifact_id": "uuid",
        "type": "document|data|visual|schema",
        "source": "meeting|upload|agent",
        "timestamp": 1712345678,
        "sphere": "business|scholar|...",
        "hash": "sha256"
      }
    ],
    "integrity": "verified"
  }
}
```

### Factual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `entries[].type` | **document/data/visual/schema** ⚡ |
| `entries[].source` | **meeting/upload/agent** ⚡ |
| `entries[].sphere` | Per-entry sphere |

---

## TYPE 2 — CONTEXTUAL KNOWLEDGE THREAD

### Purpose
Preserve the **CONTEXT surrounding information.**

### Includes ⚡
- why a meeting happened
- which sphere was active
- **which constraints applied** ⚡
- **what was visible / hidden** ⚡
- silence intervals
- **user-selected emphasis** ⚡

### Rules
| Rule | Status |
|------|--------|
| descriptive only | ✅ |
| no judgment | ✅ |
| **no optimization** | ✅ ⚡ |

### Contextual Thread JSON (with context_frames + constraints) ⚡

```json
{
  "contextual_thread": {
    "id": "uuid",
    "context_frames": [
      {
        "frame_id": "uuid",
        "context_type": "meeting|review|analysis",
        "sphere": "xr|business|scholar",
        "participants": ["user|agent"],
        "constraints": ["privacy","read_only"],
        "visibility": "personal|shared",
        "timestamp": 1712345678
      }
    ]
  }
}
```

### Contextual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `context_frames` | **Array of frames** ⚡ |
| `context_frames[].frame_id` | **UUID per frame** ⚡ |
| `context_frames[].context_type` | **meeting/review/analysis** ⚡ |
| `context_frames[].constraints` | **["privacy","read_only"]** ⚡ |
| `context_frames[].visibility` | **personal/shared** ⚡ |

---

## TYPE 3 — DECISIONAL KNOWLEDGE THREAD ⚡

### Purpose
Trace **HOW decisions emerged over time** WITHOUT scoring or labeling quality.

### Includes ⚡
| Element | Description |
|---------|-------------|
| options presented | ✅ |
| discussions | ✅ |
| **pauses** | ⚡ |
| decision declarations | ✅ |
| **deferred decisions** | ⚡ |
| **reversals** | ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **no success/failure** | ✅ ⚡ |
| **no optimization hints** | ✅ ⚡ |
| **no agent ranking** | ✅ ⚡ |

### Decisional Thread JSON (with steps array + final_state) ⚡

```json
{
  "decisional_thread": {
    "id": "uuid",
    "steps": [
      {
        "step_id": "uuid",
        "type": "option|discussion|pause|decision|deferral",
        "related_artifacts": ["uuid"],
        "participants": ["user|agent"],
        "timestamp": 1712345678
      }
    ],
    "final_state": "decided|deferred|reopened"
  }
}
```

### Decisional Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `steps` | **Array of steps** ⚡ |
| `steps[].step_id` | **UUID per step** ⚡ |
| `steps[].type` | **option/discussion/pause/decision/deferral** ⚡ |
| `steps[].related_artifacts` | **Array of UUIDs** ⚡ |
| `final_state` | **decided/deferred/reopened** ⚡ |

---

## THREAD INTERCONNECTION LOGIC

| Rule | Description |
|------|-------------|
| Threads MAY reference each other | ✅ |
| **Threads NEVER merge automatically** | ⚡ |
| User explicitly links threads | ✅ |
| **Links are directional & traceable** | ⚡ |

### Thread Link JSON ⚡

```json
{
  "thread_link": {
    "from_thread": "uuid",
    "to_thread": "uuid",
    "type": "supports|contextualizes|follows",
    "created_by": "user",
    "timestamp": 1712345678
  }
}
```

### Thread Link Fields ⚡
| Field | Description |
|-------|-------------|
| `from_thread` | **Source UUID** ⚡ |
| `to_thread` | **Target UUID** ⚡ |
| `type` | **supports/contextualizes/follows** ⚡ |
| `created_by` | **"user"** ⚡ |

---

## UNIVERSE VIEW INTEGRATION

### Visual Styles ⚡
| Thread Type | Style |
|-------------|-------|
| **FACTUAL** | solid line |
| **CONTEXTUAL** | dotted line |
| **DECISIONAL** | **stepped line** ⚡ |

### Filters ⚡
| Filter | Description |
|--------|-------------|
| show one type | ✅ |
| **show combined (layered)** | ⚡ |
| **show divergence points** | ⚡ |

---

## XR VISUALIZATION ⚡

| Property | Value |
|----------|-------|
| Appearance | **Threads appear as light paths** ⚡ |
| Color | = thread type |
| Thickness | = density (not importance) |
| Motion | **No motion unless user scrubs timeline** ⚡ |

---

## AGENT ROLES (PASSIVE)

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | assembles threads, no interpretation |
| `AGENT_THREAD_GUARD` | verifies integrity, **blocks invalid links** ⚡ |
| `AGENT_THREAD_EXPLAINER` | neutral language, no conclusions |

---

## ETHICAL GUARANTEES

| Guarantee | Status |
|-----------|--------|
| No narrative steering | ✅ |
| **No "truth ranking"** | ✅ ⚡ |
| **No hidden correlations** | ✅ ⚡ |
| Explicit user control | ✅ |

---

## WHY THIS MATTERS

Threads allow:
- **deep understanding**
- **accountability**
- **memory without distortion**

WITHOUT:
- manipulation
- ideology
- loss of nuance

---

**END — THREAD SYSTEM FREEZE**
