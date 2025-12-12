# CHE·NU — KNOWLEDGE THREAD OPERATIONS ENGINE
**VERSION:** KT.v1.1  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## 1) KNOWLEDGE THREAD OPERATIONS ENGINE

### Purpose
Handle creation, linking, merging, splitting, and rendering of Knowledge Threads across all spheres and agents **WITHOUT reinterpreting data.**

### RULE
> **Threads = STRUCTURAL LINKS. NOT meaning, NOT conclusions, NOT insights.**

### Engine Functions ⚡
| Function | Description |
|----------|-------------|
| `createThread(source_ids[])` | **create from replay/memory nodes** ⚡ |
| `linkThreads(threadA, threadB, reason)` | **reversible link with justification** ⚡ |
| `splitThread(threadID, criteria)` | **duplicates structure, isolates segments** ⚡ |
| `mergeThreads(threadA, threadB)` | **merges ONLY shared factual segments** ⚡ |
| `archiveThread(threadID)` | **freezes as immutable history** ⚡ |
| `rebuildThread(threadID)` | **regenerate graph based on collective memory** ⚡ |

### Thread Object Model JSON ⚡

```json
{
  "thread": {
    "id": "uuid",
    "title": "string",
    "nodes": ["memory_id_1","memory_id_2","..."],
    "links": [
      { "from":"id", "to":"id", "type":"temporal|topic|artifact|decision" }
    ],
    "origin": "user|agent|system",
    "created_at": "...",
    "updated_at": "...",
    "hash": "sha256"
  }
}
```

### Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `origin` | **user/agent/system** ⚡ |
| `links[].type` | **temporal/topic/artifact/decision** ⚡ |

---

## 2) THREAD LINKING RULES ⚡

### Link Types ⚡
| Type | Description | Requirement |
|------|-------------|-------------|
| `TEMPORAL` | A happened before B | **MUST come from verified timestamps** ⚡ |
| `TOPIC` | A and B share explicit topic metadata | ⚡ |
| `ARTIFACT` | A and B both reference same artifact/document | ⚡ |
| `DECISION` | A influenced or referenced a decision node | **NO interpretation — only explicit referencing** ⚡ |

### RULE
> **No emotional, sentiment, psychological, or inferred link allowed.**

### Link Safety Checklist ⚡
| Check | Status |
|-------|--------|
| ✔ timestamp verified | ✅ |
| ✔ sphere validated | ✅ |
| ✔ participants match or overlap | ✅ |
| ✔ artifact id exact | ✅ |
| ✔ **no inferred causality** | ✅ ⚡ |

---

## 3) THREAD INTEGRITY & HASH SYSTEM ⚡

### Hash Formula ⚡
```
thread_hash = SHA256(
  sorted(nodes) +
  sorted(links) +
  metadata
)
```

### Used For ⚡
- integrity check
- replay reconstruction
- **external export** ⚡
- **audit trail** ⚡

### Thread History Model JSON ⚡

```json
{
  "history": [
    { "version":1, "hash":"...", "editor":"user|agent", "timestamp":"..." },
    { "version":2, "hash":"...", "..." }
  ]
}
```

### History Fields ⚡
| Field | Description |
|-------|-------------|
| `editor` | **user/agent** ⚡ |
| `version` | **Integer incrementing** ⚡ |

---

## 4) THREAD RENDERING (2D / 3D / XR) ⚡

### 2D Render ⚡
| Property | Value |
|----------|-------|
| layered graph | ✅ |
| **threads as soft-colored strands** | ⚡ |
| nodes as glyphs | ✅ |
| links as straight segments | ✅ |

### 3D Render ⚡
| Property | Value |
|----------|-------|
| orbit clusters | ⚡ |
| **thread as spatial ribbon** | ⚡ |
| zoom & rotate | ✅ |
| **anchor nodes glow** | ⚡ |

### XR Render ⚡
| Property | Value |
|----------|-------|
| **immersive ribbon** | ⚡ |
| **rooms linked by floating strands** | ⚡ |
| **ghost nodes for replay preview** | ⚡ |
| **silent mode available** | ⚡ |

### Rendering Styles ⚡
| Style | Description |
|-------|-------------|
| `MINIMAL` | **monochrome, focus on structure only** ⚡ |
| `SPHERE-CODED` | **strands colored by sphere, nodes labelled by type** ⚡ |
| `TEMPORAL` | **gradient based on timeline** ⚡ |

---

## 5) THREAD INTERACTION TOOLS ⚡

### Tools Available ⚡
| Tool | Description |
|------|-------------|
| `selectNode` | ✅ |
| `highlightThread` | ✅ |
| `focusOnSegment` | ⚡ |
| `compareThreads(threadA, threadB)` | ⚡ |
| `addNote` | **(readonly annotation)** ⚡ |
| `exportThread` | **(pdf\|json\|xr_bundle)** ⚡ |

### NO TOOLS FOR ⚡
| Forbidden | Status |
|-----------|--------|
| **ranking threads** | ❌ ⚡ |
| **predicting outcomes** | ❌ ⚡ |
| **sentiment analysis** | ❌ ⚡ |
| **behavioral suggestions** | ❌ ⚡ |

---

## 6) THREAD ↔ COLLECTIVE MEMORY SYNC ⚡

### RULE
> **THREAD is ALWAYS subordinate to Collective Memory.**

### Sync Rules ⚡
| Rule | Description |
|------|-------------|
| if memory updates, **thread must rebuild** | ⚡ |
| **delete invalid links automatically** | ⚡ |
| **mark deprecated nodes** | ⚡ |
| **hash mismatch triggers alert** | ⚡ |

### Auto-Sync JSON ⚡

```json
{
  "thread_sync": {
    "thread_id": "uuid",
    "memory_update": true,
    "rebuild_required": true,
    "integrity_ok": false
  }
}
```

### Sync Fields ⚡
| Field | Description |
|-------|-------------|
| `memory_update` | **true/false** ⚡ |
| `rebuild_required` | **true/false** ⚡ |
| `integrity_ok` | **true/false** ⚡ |

---

**END — FOUNDATION FREEZE (KT.v1.1)**
