# CHE·NU — KNOWLEDGE THREAD SYSTEM (3 LEVELS)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-SAFE

---

## LEVEL 1 — INTRA-SPHERE KNOWLEDGE THREADS

### Purpose
Link related knowledge **within the same sphere** (Business, Scholar, Creative, etc.) without mixing contexts or leaking information.

### RULE
> **Intra-sphere = local clarity, no cross-domain assumptions.**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_TASK` | tasks linked by theme or dependency |
| `THREAD_DECISION` | decisions linked by timestamp, topic, or shared artifact |
| `THREAD_ARTIFACT` | documents, notes, files forming a continuity line |
| `THREAD_LEARNING` | **Scholar sphere → lessons, references, transcripts** ⚡ |

### Visualization (2D & XR) ⚡
| Style | Description |
|-------|-------------|
| **linear thread** | timeline |
| **braided thread** | parallel sequences ⚡ |
| **cluster thread** | topic nodes ⚡ |
| **silent thread** | artifact-only sequences ⚡ |

### Intra-Sphere Thread JSON ⚡

```json
{
  "intra_thread": {
    "sphere": "business|scholar|creative|...",
    "thread_id": "uuid",
    "type": "task|decision|artifact|learning",
    "nodes": [
      {
        "id": "uuid",
        "timestamp": 1712,
        "ref": "task_id|decision_id|doc_id",
        "metadata": {}
      }
    ],
    "integrity_hash": "sha256"
  }
}
```

### Intra-Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `sphere` | business/scholar/creative/... |
| `type` | **task/decision/artifact/learning** ⚡ |
| `nodes[].ref` | **task_id/decision_id/doc_id** ⚡ |

---

## LEVEL 2 — INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Create **safe, explicit bridges** between spheres WITHOUT merging identities or contexts.

### RULE
> **Inter-sphere = CONNECTIONS, not conclusions. No inference. No prioritization.**

### When Inter-Sphere Threads Are Allowed ⚡
| Condition | Description |
|-----------|-------------|
| Shared artifact | document referenced by two spheres |
| Shared objective | project touches Business + Creative |
| Educational relationships | **Scholar ↔ any sphere** ⚡ |
| Personal sphere | interacts intentionally |

### Critical Rules ⚡
> **Never automatic. Always user-approved or agent-orchestrator request.**

### Inter-Sphere Thread Types ⚡
| Type | Description |
|------|-------------|
| `BRIDGE_TOPIC` | unites similar topics across spheres |
| `BRIDGE_DECISION` | decisions from one sphere influence another |
| `BRIDGE_CONTEXT` | **shared participants (anonymized if needed)** ⚡ |

### Inter-Sphere Visualization ⚡
| Feature | Description |
|---------|-------------|
| orbital lines | between sphere orbits ⚡ |
| color-coded bridges | ✅ |
| togglable layers | user chooses what to reveal |
| **neutral zone rendering** | **avoid emotional cues** ⚡ |

### Inter-Sphere JSON Model ⚡

```json
{
  "inter_thread": {
    "id": "uuid",
    "spheres": ["business","creative"],
    "reason": "shared_artifact|shared_topic|user_request",
    "links": [
      { "from": "node_id", "to": "node_id", "type": "topic_bridge" }
    ],
    "user_approved": true,
    "visibility": "private|team|public",
    "hash": "sha256"
  }
}
```

### Inter-Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `spheres` | **Array of spheres** ⚡ |
| `reason` | **shared_artifact/shared_topic/user_request** ⚡ |
| `links[].type` | **"topic_bridge"** ⚡ |
| `user_approved` | **Boolean required** ⚡ |
| `visibility` | **private/team/public** ⚡ |

---

## LEVEL 3 — CROSS-USER KNOWLEDGE TAPESTRY

### Purpose
Allow users to **optionally** weave their knowledge threads to collaborate, compare insights, or build shared understanding.

### RULE
> **Cross-user = CONSENT ONLY. No automatic merging. No behavior analysis. No influence.**

### Tapestry Elements ⚡
| Element | Description |
|---------|-------------|
| `THREAD_WEAVE` | controlled merge of threads, explicit visibility |
| `PERSPECTIVE_OVERLAY` | user A + user B displayed together, **differences shown calmly (no scoring)** ⚡ |
| `COLLABORATIVE_CLUSTER` | multiple users contribute to one thematic cluster |

### Cross-User Modes ⚡
| Mode | Description |
|------|-------------|
| `PAIR VIEW` | two users compare threads side-by-side |
| `TEAM TAPESTRY` | group thread cluster, **each user's thread indicated by subtle color** ⚡ |
| `ANONYMOUS TAPESTRY` | **threads merged without identity markers** ⚡ |

### Tapestry Safety ⚡
| Guarantee | Status |
|-----------|--------|
| no emotional descriptors | ✅ |
| no behavioral predictions | ✅ |
| neutral color palette | ✅ |
| **user can "detach" anytime** | ✅ ⚡ |
| **no permanence unless explicitly saved** | ✅ ⚡ |

### Cross-User Tapestry JSON ⚡

```json
{
  "tapestry": {
    "id": "uuid",
    "participants": ["userA","userB"],
    "threads": ["thread_id_1","thread_id_2"],
    "visibility": "shared|anon",
    "overlays": ["timeline","topic","artifact"],
    "hash": "sha256"
  }
}
```

### Tapestry Fields ⚡
| Field | Description |
|-------|-------------|
| `participants` | **Array of users** ⚡ |
| `threads` | **Array of thread_ids** ⚡ |
| `visibility` | **shared/anon** ⚡ |
| `overlays` | **["timeline","topic","artifact"]** ⚡ |

---

## AGENT COORDINATION

| Agent | Role |
|-------|------|
| `AGENT_THREAD_WEAVER` | builds connections, **no interpretation, no influence** ⚡ |
| `AGENT_THREAD_GUARD` | validates safety, **ensures no cross-sphere leakage without approval** ⚡ |
| `AGENT_TAPESTRY_EXPLAINER` | translates structures in **calm, factual language** ⚡ |

---

## WHY KNOWLEDGE THREADS MATTER

| Level | Provides |
|-------|----------|
| **LEVEL 1** | personal clarity |
| **LEVEL 2** | domain clarity |
| **LEVEL 3** | collaborative clarity |

> **NONE influence users.**

Knowledge becomes:
- **transparent**
- **traceable**
- **respectful**
- **structured**

---

**END — FREEZE-READY**
