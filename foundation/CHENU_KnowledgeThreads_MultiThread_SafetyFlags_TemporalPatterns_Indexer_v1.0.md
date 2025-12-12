# CHE·NU — KNOWLEDGE THREAD SYSTEM (3-LAYER MULTI-THREAD MODEL)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-PERSUASIVE / BUILD-READY

---

## 1) KNOWLEDGE THREADS — BASE LAYER

### PURPOSE
Represent the evolution of a single idea, task, concept, or artifact across meetings, users, spheres, and time.

### RULE
> **A Knowledge Thread is *traceable memory*, not interpretation.**

### Thread Model JSON ⚡

```json
{
  "THREAD": {
    "id": "uuid",
    "topic": "string",
    "origin": {
      "created_in_meeting": "meeting_id",
      "created_by": "user|agent"
    },
    "events": [
      {
        "t": "timestamp",
        "type": "note|decision|task|artifact",
        "source": "meeting_id",
        "data_ref": "artifact_id|decision_id",
        "hash": "sha256"
      }
    ],
    "links": ["thread_id_2", "thread_id_3"],
    "status": "active|dormant|archived",
    "integrity": "verified"
  }
}
```

### Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `origin.created_by` | **user/agent** ⚡ |
| `events[].type` | **note/decision/task/artifact** ⚡ |
| `status` | **active/dormant/archived** ⚡ |
| `integrity` | **"verified"** ⚡ |

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **immutable once verified** | ✅ ⚡ |
| **no emotional tags** | ✅ ⚡ |
| **no inferred relationships** | ✅ ⚡ |
| **all links explicit** | ✅ ⚡ |

### Thread Visualization ⚡
| Element | Meaning |
|---------|---------|
| **line** | = evolution ⚡ |
| **nodes** | = event points ⚡ |
| **color** | = sphere ⚡ |
| **thickness** | = update density ⚡ |
| **glow** | = **active in current session** ⚡ |

### Thread Access Control ⚡
- user-level visibility
- sphere-level visibility
- **private threads require explicit unlocking** ⚡

---

## 2) INTER-SPHERE KNOWLEDGE THREADS — CROSS-DOMAIN ⚡

### PURPOSE
Show how information moves between spheres (Business ↔ Scholar ↔ XR ↔ Creative, etc.) **WITHOUT blending contexts or creating bias.**

### RULE
> **Cross-sphere linking is EXPLICIT ONLY.**

### Inter-Sphere Thread JSON ⚡

```json
{
  "INTER_SPHERE_THREAD": {
    "id": "uuid",
    "threads_involved": ["threadA", "threadB", "..."],
    "spheres": ["business", "scholar", "xr", "..."],
    "link_events": [
      {
        "t": "timestamp",
        "from_sphere": "business",
        "to_sphere": "creative",
        "reason": "artifact_reused|decision_followup",
        "source_meeting": "uuid",
        "hash": "sha256"
      }
    ],
    "safety_flags": {
      "cross_context_risk": "low|medium|high",
      "requires_validation": "true|false"
    }
  }
}
```

### Inter Fields ⚡
| Field | Description |
|-------|-------------|
| `threads_involved` | **Array of thread IDs** ⚡ |
| `link_events[].reason` | **artifact_reused/decision_followup** ⚡ |
| `safety_flags.cross_context_risk` | **low/medium/high** ⚡ |
| `safety_flags.requires_validation` | **boolean** ⚡ |

### Why Inter-Sphere Threads ⚡
- reveal *connections*, not meaning
- allow top-level navigation
- **preserve independence of each sphere's context** ⚡

### Cross-Sphere Safety Rules ⚡
| Rule | Status |
|------|--------|
| **no auto-linking** | ✅ ⚡ |
| **no contextual merging** | ✅ ⚡ |
| **must show sphere boundaries visually** | ✅ ⚡ |
| **validation required when linking >2 spheres** | ✅ ⚡ |

### Cross-Sphere Visualization ⚡
| Element | Description |
|---------|-------------|
| **orbit clusters per sphere** | ⚡ |
| **thread = arc between orbits** | ⚡ |
| **thickness = interaction count** | ⚡ |
| **nodes = shared events** | ⚡ |
| **optional: XR ribbon mode** | ⚡ |

---

## 3) TEMPORAL KNOWLEDGE THREADS — TIME-LAYER MODEL ⚡

### PURPOSE
Bind events not by topic or sphere, but by **temporal pattern**, creating a timeline-based structure.

### RULE
> **Temporal threads = chronological truth, not narrative.**

### Temporal Thread JSON ⚡

```json
{
  "TEMPORAL_THREAD": {
    "id": "uuid",
    "window": {
      "start": "timestamp",
      "end": "timestamp"
    },
    "included_events": [
      {
        "thread_id": "uuid",
        "event_id": "uuid",
        "t": "timestamp"
      }
    ],
    "density": "low|medium|high",
    "pattern_detection": {
      "recurrence": "true|false",
      "clusters": ["uuid", "uuid"]
    },
    "hash": "sha256"
  }
}
```

### Temporal Fields ⚡
| Field | Description |
|-------|-------------|
| `window.start/end` | **Timestamp range** ⚡ |
| `density` | **low/medium/high** ⚡ |
| `pattern_detection.recurrence` | **boolean** ⚡ |
| `pattern_detection.clusters` | **Array of cluster IDs** ⚡ |

### Temporal Thread Functions ⚡
| Function | Description |
|----------|-------------|
| **zoom time windows** | ⚡ |
| **compare periods (Period A vs Period B)** | ⚡ |
| **detect meeting clusters** | ⚡ |
| **show pattern of decision pacing** | ⚡ |
| **integrate with XR timeline replay** | ⚡ |

### Temporal Visualization ⚡

**MODE: LINEAR**
- horizontal timeline
- nodes per event
- **vertical lanes = spheres** ⚡

**MODE: XR ORBITAL TIME**
- **time = radial distance** ⚡
- **events = floating nodes** ⚡
- **threads = arcs** ⚡

### Temporal Safety Rules ⚡
| Rule | Status |
|------|--------|
| **no prediction** | ✅ ⚡ |
| **no interpretation** | ✅ ⚡ |
| **no causal implication** | ✅ ⚡ |
| **show only observable patterns** | ✅ ⚡ |

---

## UNIFIED KNOWLEDGE THREAD ENGINE ⚡

### Engine JSON ⚡

```json
{
  "engine": {
    "threads": "KnowledgeThread[]",
    "cross_sphere": "InterSphereThread[]",
    "temporal": "TemporalThread[]",
    "integrity_verification": "sha256",
    "read_only": true,
    "export": ["pdf", "json", "xr_bundle"]
  }
}
```

---

## AGENTS INVOLVED ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | **collects thread events, ensures hash validity** ⚡ |
| `AGENT_THREAD_LINKER` | **builds explicit links only, no inferred connections** ⚡ |
| `AGENT_THREAD_GUARD` | **enforces safety rules, blocks ambiguous linking** ⚡ |
| `AGENT_THREAD_RENDERER` | **generates 2D + XR visuals** ⚡ |

---

**END — FOUNDATION FREEZE**
