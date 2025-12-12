# CHE·NU — KNOWLEDGE THREADS (3-PACK)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## 1) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Link factual elements across multiple spheres (Business ↔ Scholar ↔ Creative ↔ XR ↔ Social) **WITHOUT merging them or creating interpretations.**

### RULE
> **Thread = SEQUENCE OF FACTS. NOT meaning, NOT advice, NOT inference.**

### Thread Elements ⚡
| Element | Description |
|---------|-------------|
| `event_reference` | **(meeting_id, replay_frame)** ⚡ |
| `artifact_link` | **(doc_id, board_id)** ⚡ |
| `sphere_origin` | ⚡ |
| `participants` | **(anonymized option)** ⚡ |
| `timestamp` | ⚡ |
| `context tags` | **(NOT sentiment)** ⚡ |

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **no predictive linking** | ✅ ⚡ |
| **no "importance" scoring** | ✅ ⚡ |
| **no topic inference** | ✅ ⚡ |
| **no reordering of events** | ✅ ⚡ |
| **sphere boundaries respected** | ✅ ⚡ |

### Inter-Sphere Thread JSON ⚡

```json
{
  "inter_sphere_thread": {
    "id": "uuid",
    "nodes": [
      {
        "fact_id": "uuid",
        "origin_sphere": "business|creative|...",
        "reference": "replay:event:timestamp",
        "artifact": "optional",
        "timestamp": 1712345678
      }
    ],
    "hash": "sha256",
    "read_only": true
  }
}
```

### Inter Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes[].reference` | **"replay:event:timestamp" format** ⚡ |
| `read_only` | **true always** ⚡ |

### Visualization ⚡
- **braided lines between spheres** ⚡
- no highlighting of "stronger" links
- **manual expansion only** ⚡

---

## 2) PERSONAL KNOWLEDGE THREADS

### Purpose
Allow a user to create their **OWN** factual threads across meetings, documents, moments, or spheres.

### RULE
> **User-crafted, never auto-generated.**

### Personal Thread Types ⚡
| Type | Domain |
|------|--------|
| **learning thread** | scholar ⚡ |
| **project thread** | business ⚡ |
| **memory thread** | xr ⚡ |
| **creative reference thread** | creative ⚡ |

### Thread Operations ⚡
| Operation | Description |
|-----------|-------------|
| `add fact` | ✅ |
| `reorder manually` | ⚡ |
| `annotate` | **(neutral text only)** ⚡ |
| `export PDF` | ✅ |
| `share explicitly` | ⚡ |

### Personal Thread JSON ⚡

```json
{
  "personal_thread": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "string",
    "nodes": [
      {
        "ref": "meeting|artifact|note|replay",
        "timestamp": 1712345678,
        "user_annotation": "plain_text"
      }
    ],
    "visibility": "private|shared",
    "version": 2
  }
}
```

### Personal Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes[].ref` | **meeting/artifact/note/replay** ⚡ |
| `nodes[].user_annotation` | **plain_text only** ⚡ |
| `visibility` | **private/shared** ⚡ |
| `version` | **Integer** ⚡ |

### SAFETY ⚡
| Rule | Status |
|------|--------|
| **system NEVER adds nodes automatically** | ✅ ⚡ |
| **no suggestions** | ✅ ⚡ |
| **no "you may want to include"** | ✅ ⚡ |
| **user is 100% author** | ✅ ⚡ |

---

## 3) COLLECTIVE KNOWLEDGE THREADS

### Purpose
Produce a neutral, shared, verifiable chain of facts **without narrative or collective interpretation.**

### RULE
> **Collective Thread = MULTI-SOURCE FACT CHAIN. NEVER consensus, NEVER summary, NEVER synthesis.**

### Collective Sources ⚡
| Source | Description |
|--------|-------------|
| **validated XR replays** | ⚡ |
| **decision logs** | ⚡ |
| **approved artifacts** | ⚡ |
| **timestamped events** | ⚡ |
| **sphere context markers** | ⚡ |

### Thread Construction Rules ⚡
| Rule | Status |
|------|--------|
| **chronological lock** | ✅ ⚡ |
| **no removal (only deprecate flag)** | ✅ ⚡ |
| **cross-sphere references allowed** | ✅ ⚡ |
| **no semantic compression** | ✅ ⚡ |
| **hash integrity required** | ✅ ⚡ |

### Collective Thread JSON ⚡

```json
{
  "collective_thread": {
    "id": "uuid",
    "scope": "team|project|organization",
    "nodes": [
      {
        "fact_id": "uuid",
        "source_type": "replay|artifact|decision|event",
        "origin": "sphere",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ],
    "governance": "append_only"
  }
}
```

### Collective Fields ⚡
| Field | Description |
|-------|-------------|
| `scope` | **team/project/organization** ⚡ |
| `nodes[].source_type` | **replay/artifact/decision/event** ⚡ |
| `governance` | **"append_only"** ⚡ |

### Visualization (Universe View) ⚡
| Feature | Status |
|---------|--------|
| **glowing braided path across nodes** | ⚡ |
| **optional timeline mode** | ⚡ |
| **expandable clusters** | ⚡ |
| no emphasis or weighting | ✅ |
| **context-only, not recommendation** | ⚡ |

---

## WHY 3 THREADS? ⚡

| Thread | Purpose |
|--------|---------|
| **INTER-SPHERE** | = factual bridges ⚡ |
| **PERSONAL** | = self-created narrative path ⚡ |
| **COLLECTIVE** | = shared factual memory ⚡ |

### Together ⚡
- clarity without manipulation
- structure without interpretation
- **truth without force** ⚡

---

**END — KNOWLEDGE THREAD PACK**
