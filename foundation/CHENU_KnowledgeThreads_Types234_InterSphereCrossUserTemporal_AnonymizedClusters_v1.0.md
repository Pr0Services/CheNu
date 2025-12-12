# CHE·NU — KNOWLEDGE THREADS v1.0 (THREAD TYPE 2 + 3 + 4)
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## THREAD TYPE 2 — INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Link information, decisions, events, and artifacts ACROSS DIFFERENT SPHERES (Business, Scholar, Creative, XR, Social…) without merging them or forcing interpretation.**

### RULE
> **Thread = relational bridge. NOT meaning, NOT priority, NOT influence.**

### Thread Structure ⚡
| Component | Description |
|-----------|-------------|
| `anchor_event` | start point ⚡ |
| `linked_nodes` | cross-sphere items ⚡ |
| `relationship_type` | topic_overlap, artifact_reference, shared_participants, temporal_proximity, **conceptual_tag** ⚡ |
| optional visual connector | in Universe View ⚡ |

### Inter-Sphere Thread JSON ⚡
```json
{
  "knowledge_thread_inter": {
    "id": "uuid",
    "anchor": "event_id",
    "sphere_origin": "business|scholar|creative|...",
    "links": [
      { "node": "uuid", "sphere": "scholar", "relation": "topic_overlap" },
      { "node": "uuid", "sphere": "creative", "relation": "artifact_reference" }
    ],
    "visibility": "personal|team|global",
    "hash": "sha256"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **Read-only** | ✅ ⚡ |
| **Never auto-infer conclusions** | ✅ ⚡ |
| **No ranking of threads** | ✅ ⚡ |
| **No emotional tagging** | ✅ ⚡ |
| **Users choose visibility scope** | ✅ ⚡ |

### Universe View Visualization ⚡
| Property | Description |
|----------|-------------|
| **soft dotted orbit line** | ⚡ |
| **color = sphere origin** | ⚡ |
| **thickness = number of nodes** | ⚡ |
| **fade when inactive** | ⚡ |

---

## THREAD TYPE 3 — CROSS-USER / CROSS-AGENT KNOWLEDGE THREADS ⚡

### Purpose
> **Map situations where MULTIPLE USERS or MULTIPLE AGENTS have interacted with or referenced the SAME information.**

> **Not social features. Not persuasion. Pure informational overlap.**

### Use Cases ⚡
| Case | Description |
|------|-------------|
| same document used by 3 departments | ⚡ |
| 2 users studying the same Scholar content | ⚡ |
| **multiple agents referencing the same artifact** | ⚡ |
| **cross-team meeting chains** | ⚡ |

### Cross-User/Agent Thread JSON ⚡
```json
{
  "knowledge_thread_cross": {
    "id": "uuid",
    "shared_item": "artifact|topic|decision|event",
    "users": ["user_id_1", "user_id_2"],
    "agents": ["agent_id_1"],
    "occurrences": [
      { "timestamp": "...", "context": "meeting|task|sphere" }
    ],
    "safety": {
      "privacy": "strict",
      "anonymize_users": true
    }
  }
}
```

### Key Field: `anonymize_users: true` ⚡
> **Privacy-first by default**

### Constraints ⚡
| Constraint | Status |
|------------|--------|
| **Users anonymized by default** | ✅ ⚡ |
| **No behavioral inference** | ✅ ⚡ |
| **No social comparison** | ✅ ⚡ |
| **No performance metrics** | ✅ ⚡ |

### Visualization ⚡
| Property | Description |
|----------|-------------|
| **cluster cloud around shared artifact** | ⚡ |
| **anonymized nodes only** | ⚡ |
| **optional expansion if user opts-in** | ⚡ |

---

## THREAD TYPE 4 — TEMPORAL KNOWLEDGE THREADS ⚡

### Purpose
> **Link events, decisions, artifacts, and replays ACROSS TIME to reveal evolution, WITHOUT suggesting direction or correctness.**

### RULE
> **Time ≠ priority. Time ≠ meaning. Just chronology.**

### Temporal Thread Sequence ⚡
```
t0 → original event
t1 → follow-up meeting
t2 → updated artifact
t3 → replay comparison
t4 → collective memory entry
```

### Temporal Thread JSON ⚡
```json
{
  "knowledge_thread_temporal": {
    "id": "uuid",
    "timeline": [
      { "node": "uuid", "timestamp": 1712345, "type": "event" },
      { "node": "uuid", "timestamp": 1712380, "type": "artifact" },
      { "node": "uuid", "timestamp": 1712450, "type": "decision" }
    ],
    "integrity_hash": "sha256",
    "locked": true
  }
}
```

### Key Field: `locked: true` ⚡
> **Immutable once validated**

### Rules ⚡
| Rule | Status |
|------|--------|
| **immutable once validated** | ✅ ⚡ |
| **chronological only** | ✅ ⚡ |
| **no prediction** | ✅ ⚡ |
| **no trend inference** | ✅ ⚡ |
| **no progress judgement** | ✅ ⚡ |

### Visualization ⚡
| Property | Description |
|----------|-------------|
| **straight timeline string in Universe View** | ⚡ |
| **nodes sized by artifact density** | ⚡ |
| **optional time-zoom** | ⚡ |

---

## WHY THESE 3 THREAD TYPES MATTER ⚡

| Type | = |
|------|---|
| **TYPE 2** | Inter-sphere clarity |
| **TYPE 3** | Cross-user / cross-agent informational overlap |
| **TYPE 4** | **Temporal evolution without interpretation** |

### Together They Enable ⚡
| Capability | Status |
|------------|--------|
| **Transparent mapping of knowledge flow** | ✅ ⚡ |
| **Cross-sphere understanding** | ✅ ⚡ |
| **Time evolution tracking** | ✅ ⚡ |
| **Zero influence on decisions or emotions** | ✅ ⚡ |

---

**END — FOUNDATION FREEZE**
