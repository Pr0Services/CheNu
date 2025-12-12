# CHE·NU — KNOWLEDGE THREADS SYSTEM (PROCEDURAL THREAD)
**VERSION:** FOUNDATION v1.0  
**TYPE:** KNOWLEDGE STRUCTURE / NON-MANIPULATIVE / AUDITABLE

---

## GLOBAL PRINCIPLE

> **Knowledge Threads CONNECT information.**  
> **They DO NOT interpret, rank, or recommend truth.**

### RULE
> **Thread = LINK, not conclusion.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Link verifiable facts across time, meetings, spheres.

### Sources
- XR replays, meeting artifacts, decisions logs, documents

### Characteristics
| Property | Value |
|----------|-------|
| immutable once validated | ✅ |
| source-replay anchored | ✅ |
| append-only | ✅ |

### Use Cases
- trace how a fact appeared
- see factual continuity
- audit provenance

### JSON Model

```json
{
  "factual_thread": {
    "id": "uuid",
    "nodes": ["memory_id_1","memory_id_2"],
    "origin": "replay_id",
    "verified": true,
    "hash": "sha256"
  }
}
```

---

## THREAD TYPE 2 — CONTEXTUAL THREAD

### Purpose
Show how CONTEXT evolved around similar facts or topics **WITHOUT merging conclusions.**

### Sources
- meeting context, participants, sphere, time proximity

### Characteristics
| Property | Value |
|----------|-------|
| perspective-aware | ✅ |
| non-judgmental | ✅ |
| parallel-friendly | ✅ |

### Use Cases
- understand why discussions differed
- compare conditions
- identify missing context

### JSON Model

```json
{
  "contextual_thread": {
    "id": "uuid",
    "topic": "string",
    "contexts": [
      {
        "replay_id": "uuid",
        "sphere": "business|scholar|...",
        "participants": ["user","agent"],
        "timestamp": 1712345678
      }
    ]
  }
}
```

---

## THREAD TYPE 3 — PROCEDURAL THREAD ⚡ UNIQUE

### Purpose
Link **METHODS, PROCESSES, and ACTION SEQUENCES** across domains and time.

### Sources
- methodologies
- workflows used
- agent orchestration traces

### Characteristics
| Property | Value |
|----------|-------|
| **sequence-based** | ✅ ⚡ |
| decision-neutral | ✅ |
| **reusable patterns** | ✅ ⚡ |

### Use Cases
- see how an approach evolved
- reuse proven structures
- avoid repeating failures without labeling them

### JSON Model (with steps + variants + domains) ⚡

```json
{
  "procedural_thread": {
    "id": "uuid",
    "steps": [
      { "step_id": 1, "action": "string" },
      { "step_id": 2, "action": "string" }
    ],
    "domains": ["business","xr"],
    "variants": []
  }
}
```

### Procedural Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `steps` | Array of sequential steps |
| `step_id` | Step number (1, 2, 3...) |
| `action` | Description of action |
| `domains` | Which domains this applies to |
| `variants` | Alternative versions of this procedure |

---

## THREAD LINKING RULES ⚡

| Rule | Status |
|------|--------|
| Threads may intersect | ✅ |
| Threads never overwrite each other | ✅ |
| **One node can belong to multiple threads** | ✅ ⚡ |
| Threads can be hidden or surfaced per user | ✅ |

### Multi-Thread Membership ⚡
> **A single node can belong to multiple threads simultaneously**
> This enables rich cross-referencing without data duplication

---

## VISUALIZATION (UNIVERSE VIEW) ⚡

| Property | Value |
|----------|-------|
| Style | **translucent arcs** ⚡ |
| Color | by type (factual / contextual / procedural) |
| Thickness | = density, **not importance** |
| Toggle | per thread type |

---

## AGENT ROLES

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Creates candidate threads, **never auto-accepts** |
| `AGENT_THREAD_VALIDATOR` | Checks source integrity, **rejects inferred links** |
| `AGENT_THREAD_EXPLAINER` | Human-readable summaries, **no interpretation** |

---

## ETHICAL LOCKS

| Lock | Status |
|------|--------|
| no ranking | ✅ |
| no truth scoring | ✅ |
| no "best narrative" | ✅ |
| full source visibility | ✅ |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **clarity without bias**
- **memory without distortion**
- **learning without control**

---

**END — KNOWLEDGE THREADS FREEZE**
