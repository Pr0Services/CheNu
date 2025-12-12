# CHE·NU — KNOWLEDGE THREADS (A + B)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## A) CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Link related information, artifacts, meetings, and decisions **ACROSS SPHERES** without merging contexts.

### RULE
> **Knowledge Thread = TRACEABLE LINKAGE, NOT synthesis, NOT interpretation.**

### 5 Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | **Shared events across multiple spheres** (e.g., Business decision affecting Scholar) ⚡ |
| `THREAD_ARTIFACT` | Documents, notes, boards referenced across spheres ⚡ |
| `THREAD_TOPIC` | **Semantic alignment → same topic in different domains** ⚡ |
| `THREAD_TIMELINE` | Time-based relation (parallel or sequential events) ⚡ |
| `THREAD_PARTICIPATION` | **Same users or agents active across spheres** ⚡ |

### Cross-Sphere Thread Structure ⚡

> **A Knowledge Thread is a CHAIN of nodes:**

```
NODE := meeting | replay | artifact | decision | sphere-context

CHAIN EXAMPLE:
Scholar → Business → Creative → XR Replay
```

> **NO inference. NO "meaning extraction". JUST factual connection.**

### Thread JSON Model ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "event|artifact|topic|timeline|participation",
    "nodes": [
      { "id": "uuid", "type": "meeting", "sphere": "business" },
      { "id": "uuid", "type": "artifact", "sphere": "creative" },
      { "id": "uuid", "type": "replay", "sphere": "xr" }
    ],
    "hash": "sha256",
    "origin": "system|user",
    "created_at": "timestamp"
  }
}
```

### Thread Creation Rules ⚡

| Mode | Description |
|------|-------------|
| **AUTOMATIC** | shared timestamp windows, shared participants, shared artifacts, cross-referenced documents ⚡ |
| **MANUAL** | **user selects nodes & links, agents propose but cannot apply** ⚡ |

### Ethical & Safety Locks ⚡
| Rule | Status |
|------|--------|
| **no topic inference** | ✅ ⚡ |
| **no emotional clustering** | ✅ ⚡ |
| **no importance ranking** | ✅ ⚡ |
| **links must be reversible and visible** | ✅ ⚡ |

---

## B) PERSONAL KNOWLEDGE THREADS (INDIVIDUAL) ⚡

### Purpose
Provide each user with their **OWN conceptual pathways** through the system, independent from global organization.

### RULE
> **Personal threads = PRIVATE, non-shared unless explicit.**

### Personal Thread Uses ⚡
| Use | Description |
|-----|-------------|
| follow their own reasoning path | ⚡ |
| bookmark important cross-sphere items | ⚡ |
| create review journeys | ⚡ |
| **support memory recall safely** | ⚡ |

### 3 Personal Thread Types ⚡ (NOUVEAU!)
| Type | Description |
|------|-------------|
| `THREAD_PRIVATE` | **Only visible to owner**, can contain any nodes, **stored encrypted** ⚡ |
| `THREAD_REVIEW` | Built during session review or replay, **user's own memory structure** ⚡ |
| `THREAD_PLANNING` | **Connects ideas across spheres** (Creative → Business → Scholar) ⚡ |

### Personal Thread JSON ⚡

```json
{
  "personal_thread": {
    "id": "uuid",
    "owner": "user_id",
    "visibility": "private",
    "nodes": [
      { "id": "uuid", "type": "artifact", "sphere": "creative" },
      { "id": "uuid", "type": "meeting", "sphere": "business" }
    ],
    "notes": "optional user comments",
    "encrypted": true,
    "created_at": "timestamp"
  }
}
```

### Key Fields ⚡ (NOUVEAU!)
| Field | Description |
|-------|-------------|
| `notes` | **optional user comments** ⚡ |
| `encrypted` | **true by default** ⚡ |

### Thread Interactions ⚡ (NOUVEAU!)
| Function | Description |
|----------|-------------|
| `add_node` | ⚡ |
| `remove_node` | ⚡ |
| `reorder_nodes` | ⚡ |
| `merge threads` | ⚡ |
| `split thread in two` | ⚡ |
| `export (pdf summary)` | ⚡ |
| `attach reflective notes (optional)` | ⚡ |

### UI Representation ⚡
| Mode | Description |
|------|-------------|
| linear chain view | ⚡ |
| branching tree view | ⚡ |
| **radial orbit view (XR-enabled)** | ⚡ |
| minimal 2D fallback | ⚡ |

### Safety & Privacy ⚡
| Rule | Status |
|------|--------|
| **personal threads NEVER inform routing** | ✅ ⚡ |
| **NEVER modify collective memory** | ✅ ⚡ |
| **NEVER appear in universe view unless shared manually** | ✅ ⚡ |
| **encrypted by default** | ✅ ⚡ |

---

## A + B RELATION ⚡

| Type | = |
|------|---|
| **Cross-Sphere Threads** | shared factual connections ⚡ |
| **Personal Threads** | **individual conceptual pathways** ⚡ |

> **NO overlap unless *explicit share* by the user.**

---

**END — KNOWLEDGE THREADS FOUNDATION COMPLETE**
