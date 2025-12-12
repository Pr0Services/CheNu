# CHE·NU — KNOWLEDGE THREADS (3 LAYERS)
**VERSION:** KNOWLEDGE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## LAYER 1 — BASE KNOWLEDGE THREADS

### Purpose
Create **NEUTRAL connections** between validated information (events, artifacts, decisions, notes) WITHOUT interpretation.

### RULE
> **Thread = LINK, NOT narrative.**

### Thread Object JSON (with confidence + direction) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "topic|artifact|participant|decision",
    "from": "memory_id",
    "to": "memory_id",
    "reason": "shared_topic|shared_file|shared_timing",
    "confidence": 1.0,
    "direction": "bidirectional",
    "immutable": true
  }
}
```

### Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **topic/artifact/participant/decision** ⚡ |
| `confidence` | **1.0** ⚡ |
| `direction` | **"bidirectional"** ⚡ |

### Valid Reasons for a Thread ⚡
| Reason | Description |
|--------|-------------|
| `shared_topic` | ✅ |
| `shared_artifact` | ✅ |
| `shared_participant` | ✅ |
| **same sphere** | ⚡ |
| **same timestamp window** | ⚡ |
| **follow-up event** | ⚡ |
| **referencing event** | ⚡ |

### NO: ⚡
- inference
- sentiment
- causal guessing
- predictive meaning

### Base Thread Rules ⚡
| Rule | Status |
|------|--------|
| append-only | ✅ |
| cryptographically hashed | ✅ |
| **explainable: reason MUST be explicit** | ✅ ⚡ |
| never ranks nodes | ✅ |
| **no emotional metadata** | ✅ ⚡ |

---

## LAYER 2 — CROSS-SPHERE KNOWLEDGE THREADS

### Purpose
Connect information across spheres (Business ↔ Scholar ↔ Creative ↔ Institution ↔ Social), while **preserving domain neutrality.**

### RULE
> **Cross-sphere ≠ cross-interpretation.**

### Cross-Sphere Thread Types ⚡

| Type | Example |
|------|---------|
| **PARALLEL STRUCTURE** | "Budget" (Business) ↔ "Resource Allocation" (Institution) ⚡ |
| **RELATED ARTIFACT** | "Research Document" (Scholar) ↔ "Creative Brief" (Studio) ⚡ |
| **PROCESS CONTINUITY** | scholar → creative → business → institution (knowledge chain) ⚡ |
| **MULTI-AGENT ALIGNMENT** | same agent in separate sphere meetings ⚡ |

### Cross-Sphere Thread JSON (with mapping_type) ⚡

```json
{
  "cross_sphere_thread": {
    "id": "uuid",
    "spheres": ["business","scholar"],
    "from": "memory_id",
    "to": "memory_id",
    "mapping_type": "parallel|artifact|process|agent",
    "explanation": "string",
    "immutable": true
  }
}
```

### Cross-Sphere Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `mapping_type` | **parallel/artifact/process/agent** ⚡ |
| `explanation` | **Required human-readable string** ⚡ |

### Cross-Sphere Safety Locks ⚡
| Lock | Status |
|------|--------|
| **no merging of domain logic** | ✅ ⚡ |
| **no cross-sphere assumptions** | ✅ ⚡ |
| must remain purely structural | ✅ |
| **explicit user-visible explanation required** | ✅ ⚡ |

---

## LAYER 3 — TEMPORAL KNOWLEDGE THREADS

### Purpose
Show how ideas, meetings, or artifacts **EVOLVE through time** WITHOUT suggesting improvement, failure, or directionality.

### RULE
> **Time Thread = chronology only.**

### Temporal Thread Types ⚡

| Type | Description |
|------|-------------|
| **Successive Events** | event A → event B (later time) ⚡ |
| **Artifact Evolution** | artifact v1 → v2 → v3 ⚡ |
| **Decision Continuity** | initial → follow-up → closure ⚡ |
| **Silence Threads** | **periods with no activity (neutral but informative)** ⚡ |

### Temporal Thread JSON (with gaps array) ⚡

```json
{
  "temporal_thread": {
    "id": "uuid",
    "sequence": ["memory_id_1","memory_id_2","..."],
    "timestamps": [t1,t2,...],
    "gaps": ["silence|normal|long"],
    "immutable": true
  }
}
```

### Temporal Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `sequence` | **Ordered array of memory_ids** ⚡ |
| `timestamps` | **Array of timestamps** ⚡ |
| `gaps` | **["silence\|normal\|long"]** ⚡ |

### Temporal Visualization Rules ⚡
| Rule | Status |
|------|--------|
| consistent spacing | ✅ |
| **no arrows implying improvement** | ✅ ⚡ |
| **grey-neutral palette** | ✅ ⚡ |
| **absence-of-event is allowed & marked as "silence"** | ✅ ⚡ |
| **multi-thread braiding allowed but non-directional** | ✅ ⚡ |

---

## UNIFICATION: KNOWLEDGE THREAD FABRIC ⚡

### Definition
> A unified structure combining: base threads, cross-sphere threads, temporal threads

> **Fabric = neutral information topology.**

### Fabric JSON (Root) ⚡

```json
{
  "knowledge_fabric": {
    "threads": [...],
    "cross_sphere_threads": [...],
    "temporal_threads": [...],
    "version": "1.0",
    "hash": "sha256"
  }
}
```

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | constructs threads, **no narrative generation** ⚡ |
| `AGENT_FABRIC_GUARD` | checks domain violations, **ensures no emotional or directional bias** ⚡ |
| `AGENT_FABRIC_RENDERER` | draws graph or timeline, **2D / 3D / XR compatible** ⚡ |

---

## WHY KNOWLEDGE THREADS MATTER

They let Che-Nu:
- **show continuity without interpretation**
- **reveal structure without influence**
- **unify multiple spheres neutrally**
- **support replay, memory, and navigation**

> **Knowledge = topology, not story.**

---

**END — FREEZE READY**
