# CHE·NU — KNOWLEDGE THREAD SYSTEM (3 LAYERS)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / TRACE-ONLY / NON-MANIPULATIVE

---

## 1) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Represent *connections between spheres* when information, topics, artifacts, or decisions overlap — **without merging their identities or priorities.**

### RULE
> **Thread = RELATION, not interpretation.**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_TOPIC` | shared subject (ex: "budget", "design", "policy") ⚡ |
| `THREAD_ARTIFACT` | same file/board/document referenced in 2+ spheres ⚡ |
| `THREAD_DECISION` | decisions affecting multiple spheres ⚡ |
| `THREAD_AGENT` | **agent participating across spheres** ⚡ |

### Inter-Sphere Thread JSON ⚡

```json
{
  "thread_inter": {
    "id": "uuid",
    "type": "topic|artifact|decision|agent",
    "spheres": ["business", "scholar"],
    "anchors": [
      { "sphere": "business", "ref_id": "artifact123" },
      { "sphere": "scholar", "ref_id": "note789" }
    ],
    "created_at": "...",
    "hash": "sha256"
  }
}
```

### Visualization Rules ⚡
| Rule | Description |
|------|-------------|
| **subtle threads only (no dominance)** | ⚡ |
| **color = sphere pair** | ⚡ |
| **thickness = number of anchors** | ⚡ |
| **hover reveals anchors** | ⚡ |
| **click isolates thread in Universe View** | ⚡ |

### Ethical Locks ⚡
| Lock | Status |
|------|--------|
| **no causality inference** | ✅ ⚡ |
| **no recommendation** | ✅ ⚡ |
| **no prioritization** | ✅ ⚡ |

---

## 2) PERSONAL KNOWLEDGE THREADS ⚡

### Purpose
Represent links **unique to a user** formed from: their meetings, their replays, their artifacts, their navigation patterns

### RULE
> **Personal Thread = PRIVATE COGNITIVE MAP, never exposed without explicit consent.**

### Thread Sources ⚡
| Source | Description |
|--------|-------------|
| **personal tasks** | ⚡ |
| **personal meeting notes** | ⚡ |
| **saved artifacts** | ⚡ |
| **bookmarked nodes** | ⚡ |
| **personal replay comparisons** | ⚡ |

### Personal Thread JSON ⚡

```json
{
  "thread_personal": {
    "user_id": "uuid",
    "id": "uuid",
    "nodes": ["meeting1", "artifact5", "replay3"],
    "logic": "proximity|topic|sequence",
    "private": true,
    "version": 1
  }
}
```

### Personal Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes` | **Array of meeting/artifact/replay IDs** ⚡ |
| `logic` | **proximity/topic/sequence** ⚡ |
| `private` | **true always** ⚡ |

### Personal Thread UI ⚡
| Feature | Description |
|---------|-------------|
| **reveal/hide personal map** | ⚡ |
| **merge threads** | ⚡ |
| **split threads** | ⚡ |
| **annotate thread** | ⚡ |
| **export as PDF or private .thread file** | ⚡ |

### Safety ⚡
| Rule | Status |
|------|--------|
| **never auto-shared** | ✅ ⚡ |
| **no cross-user inference** | ✅ ⚡ |
| **user owns the map entirely** | ✅ ⚡ |

---

## 3) COLLECTIVE KNOWLEDGE THREAD NETWORK ⚡

### Purpose
Form a **global network of relationships** across: spheres, decisions, meetings, artifacts, agents

### RULE
> **Collective threads = STRUCTURAL MAP, not wisdom.**

### Collective Thread Construction ⚡

**Nodes:**
| Type | Description |
|------|-------------|
| meetings | ⚡ |
| replays | ⚡ |
| artifacts | ⚡ |
| decisions | ⚡ |
| agents | ⚡ |
| spheres | ⚡ |

**Edges:**
| Type | Description |
|------|-------------|
| `shared_topic` | ⚡ |
| `referenced_by` | ⚡ |
| `followed_by` | ⚡ |
| `temporal_link` | ⚡ |
| `agent_participation` | ⚡ |

### Collective Thread JSON ⚡

```json
{
  "thread_collective": {
    "id": "uuid",
    "links": [
      { "from": "id1", "to": "id2", "relation": "shared_topic" },
      { "from": "id2", "to": "id3", "relation": "followed_by" }
    ],
    "coverage": "multi-sphere",
    "integrity": "cryptographic",
    "version": "1.0"
  }
}
```

### Collective Fields ⚡
| Field | Description |
|-------|-------------|
| `links[].relation` | **shared_topic/referenced_by/followed_by/etc** ⚡ |
| `coverage` | **"multi-sphere"** ⚡ |
| `integrity` | **"cryptographic"** ⚡ |

### Universe View Integration ⚡
| Feature | Description |
|---------|-------------|
| **threads appear as faint connective tissue** | ⚡ |
| **zoom on a thread reveals anchor events** | ⚡ |
| **click = "isolate thread"** | ⚡ |
| **filter by sphere / meeting / topic** | ⚡ |
| **never highlight as "more important"** | ⚡ |

### Thread Safety & Transparency ⚡
| Rule | Status |
|------|--------|
| **no aggregation into "insight"** | ✅ ⚡ |
| **no predictive modeling** | ✅ ⚡ |
| **no emotional weighting** | ✅ ⚡ |
| **no authority over navigation** | ✅ ⚡ |

---

## WHY THE 3 TOGETHER? ⚡

| Layer | Purpose |
|-------|---------|
| **INTER-SPHERE** | → structure of shared knowledge ⚡ |
| **PERSONAL** | → private cognitive map ⚡ |
| **COLLECTIVE** | → full ecosystem visibility ⚡ |

### Together, They Form ⚡
- clarity
- traceability
- **zero manipulation** ⚡

---

**END — FREEZE READY**
