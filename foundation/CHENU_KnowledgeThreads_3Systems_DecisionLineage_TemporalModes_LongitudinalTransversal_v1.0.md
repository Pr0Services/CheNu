# CHE·NU — KNOWLEDGE THREADS (3 SYSTEMS)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## SYSTEM 1 — INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Reveal how information flows across spheres **WITHOUT shaping conclusions or recommending actions.**

### RULE
> **Thread = FACTUAL LINK, NOT interpretation.**

### Trigger Events ⚡
| Event | Description |
|-------|-------------|
| **artifact reused in another sphere** | ⚡ |
| **replay referenced across domain** | ⚡ |
| **decision influences another sphere's workflow** | ⚡ |
| **agent participation across multiple spheres** | ⚡ |
| **shared vocabulary emergence (non-semantic)** | ⚡ |

### Thread Structure ⚡

**THREAD_NODE:**
| Field | Description |
|-------|-------------|
| `sphere` | ⚡ |
| `artifact_id` | ⚡ |
| `event_id` | ⚡ |
| `timestamp` | ⚡ |

**THREAD_EDGE:**
| Field | Description |
|-------|-------------|
| `type` | **"referenced", "followed_by", "shared_agent", "parallel_event"** ⚡ |
| **no weighting** | ⚡ |
| **no importance ranking** | ⚡ |

### Inter-Sphere Thread JSON ⚡

```json
{
  "inter_sphere_thread": {
    "id": "uuid",
    "nodes": [
      { "sphere": "business", "artifact": "a1", "timestamp": "..." },
      { "sphere": "scholar", "artifact": "a1", "timestamp": "..." }
    ],
    "edges": [
      { "from": "business", "to": "scholar", "type": "referenced" }
    ]
  }
}
```

### Visualization (Universe View) ⚡
- soft lines between spheres
- **thickness not meaningful** ⚡
- color = sphere origin
- **tap to expand → shows nodes only** ⚡

---

## SYSTEM 2 — DECISION-LINEAGE KNOWLEDGE THREADS ⚡ (NOUVEAU!)

### Purpose
Expose the **ancestry of decisions** across time **without implying improvement, causality, or "better paths".**

### RULE
> **We trace ORIGINS, not justifications.**

### Decision Node Types ⚡
| Type | Description |
|------|-------------|
| `initial decision` | ⚡ |
| `revision` | ⚡ |
| `derivative decision` | ⚡ |
| `parallel decision` | ⚡ |

### Lineage Logic ⚡
| Rule | Status |
|------|--------|
| **ordered by timestamp** | ✅ ⚡ |
| **multi-parent permitted** | ✅ ⚡ |
| **forks permitted** | ✅ ⚡ |
| **no judgement metadata** | ✅ ⚡ |

### Decision Thread JSON ⚡

```json
{
  "decision_thread": {
    "decision_id": "uuid",
    "lineage": [
      { "id": "d0", "type": "origin", "timestamp": "..." },
      { "id": "d1", "type": "revision", "timestamp": "..." },
      { "id": "d2", "type": "parallel", "timestamp": "..." }
    ],
    "links": [
      { "from": "d0", "to": "d1", "type": "revision" },
      { "from": "d0", "to": "d2", "type": "parallel" }
    ]
  }
}
```

### Visualization ⚡
| Feature | Description |
|---------|-------------|
| **vertical braid** | ⚡ |
| **left → origins** | ⚡ |
| **right → derivatives** | ⚡ |
| **timeline scrubber** | ⚡ |
| **no "best path"** | ⚡ |
| **no color meaning** | ⚡ |

---

## SYSTEM 3 — COLLECTIVE MEMORY KNOWLEDGE THREADS ⚡

### Purpose
Connect historical events, replays, decisions to reveal **long-term patterns WITHOUT interpretation.**

### RULE
> **Thread = historical continuity, not analysis.**

### Cross-Temporal Nodes ⚡
| Type | Description |
|------|-------------|
| `meeting_event` | ⚡ |
| `replay_frame` | ⚡ |
| `artifact update` | ⚡ |
| `agent action` | ⚡ |
| `sphere shift` | ⚡ |
| `timeline silence` | ⚡ |

### Temporal Thread Modes ⚡ (NOUVEAU!)

| Mode | Description |
|------|-------------|
| **LONGITUDINAL** | same sphere, many years; same artifact evolving; same procedure refined ⚡ |
| **TRANSVERSAL** | different spheres, same timestamp; **synchrony view** ⚡ |
| **MEMORY-RECONSTRUCTION** | **replay excerpts chained across years** ⚡ |

### Cross-Temporal Thread JSON ⚡

```json
{
  "collective_memory_thread": {
    "id": "uuid",
    "type": "longitudinal|transversal|reconstruction",
    "nodes": [
      { "event": "meeting", "timestamp": "..." },
      { "event": "artifact_update", "timestamp": "..." },
      { "event": "replay_frame", "timestamp": "..." }
    ],
    "links": [
      { "from": 0, "to": 1, "type": "temporal_adjacent" },
      { "from": 1, "to": 2, "type": "artifact_continuity" }
    ]
  }
}
```

### Link Types ⚡
| Type | Description |
|------|-------------|
| `temporal_adjacent` | ⚡ |
| `artifact_continuity` | ⚡ |

### Visualization Style ⚡
| Feature | Status |
|---------|--------|
| **gentle lines** | ⚡ |
| **no arrowheads (no causality)** | ⚡ |
| **time represented subtly** | ⚡ |
| **sphere colors muted** | ⚡ |
| **silence blocks shaded lightly** | ⚡ |

---

## UNIVERSAL ETHICAL LIMITS (ALL THREADS) ⚡

| Limit | Status |
|-------|--------|
| **NO inferencing** | ✅ ⚡ |
| **NO ranking** | ✅ ⚡ |
| **NO "importance weighting"** | ✅ ⚡ |
| **NO behavioral predictions** | ✅ ⚡ |
| **NO highlighting optimal paths** | ✅ ⚡ |
| **NO narrative framing** | ✅ ⚡ |

---

## AGENTS INVOLVED ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **constructs thread → no interpretation** ⚡ |
| `AGENT_THREAD_GUARD` | **enforces ethical locks** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **human-readable explanations only** ⚡ |

---

## WHY THE 3 THREAD SYSTEM MATTERS ⚡

| System | Question |
|--------|----------|
| **Inter-Sphere Thread** | → WHERE knowledge travels ⚡ |
| **Decision-Lineage Thread** | → HOW decisions evolve ⚡ |
| **Collective Memory Thread** | → WHEN patterns appear ⚡ |

### Together ⚡
- clarity without influence
- transparency without pressure
- **structure without control** ⚡

---

**END — KNOWLEDGE THREADS SYSTEM (FREEZE APPROVED)**
