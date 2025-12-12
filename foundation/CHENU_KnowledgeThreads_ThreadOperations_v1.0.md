# CHE·NU — KNOWLEDGE THREADS SYSTEM (THREAD OPERATIONS)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / TRACEABLE / NON-MANIPULATIVE

---

## GLOBAL PRINCIPLE

> **Knowledge Threads CONNECT FACTS across time and space.**  
> **They NEVER infer intent, NEVER rank truth, NEVER persuade.**

> **Thread = TRACE, not narrative.**

---

## THREAD TYPE 1 — PERSONAL KNOWLEDGE THREAD

### Purpose
Help a single user follow continuity of understanding across meetings, notes, decisions, and artifacts.

### Rules
| Rule | Status |
|------|--------|
| Private by default | ✅ |
| User-controlled visibility | ✅ |
| Append-only | ✅ |
| **No auto-sharing** | ✅ ⚡ |

### Sources
- user meetings, personal notes, decisions authored by user, selected replays

### JSON Model

```json
{
  "personal_thread": {
    "id": "uuid",
    "owner": "user_id",
    "links": [
      { "type": "meeting|decision|artifact", "ref": "uuid" }
    ],
    "created_at": 1712345678,
    "visibility": "private|shared"
  }
}
```

### UI
| Feature | Value |
|---------|-------|
| Timeline | linear |
| Zoom | zoomable segments |
| Silence | **intervals visible** ⚡ |
| Annotations | manual only |

---

## THREAD TYPE 2 — COLLECTIVE KNOWLEDGE THREAD (with scope) ⚡

### Purpose
Expose shared factual continuity across a team **WITHOUT interpretation or evaluation.**

### Rules
| Rule | Status |
|------|--------|
| Built from Collective Memory only | ✅ |
| Immutable after validation | ✅ |
| Read-only by default | ✅ |

### Sources
- validated replays, shared artifacts, decisions (declared only), agent trace logs

### JSON Model (with scope) ⚡

```json
{
  "collective_thread": {
    "id": "uuid",
    "scope": "team|org|sphere",
    "entries": [
      { "ref": "uuid", "type": "event|artifact|decision" }
    ],
    "integrity": "verified",
    "hash": "sha256"
  }
}
```

### Scope Types ⚡
| Scope | Description |
|-------|-------------|
| `team` | Team level |
| `org` | Organization level |
| `sphere` | Sphere level |

### UI
| Feature | Value |
|---------|-------|
| Timeline | graph |
| Branches | parallel visible |
| Path | **no "best path"** ⚡ |
| Markers | **no sentiment markers** ⚡ |

---

## THREAD TYPE 3 — INTER-SPHERE KNOWLEDGE THREAD (with approved_by + trace) ⚡

### Purpose
Show how information flows across spheres (Business ↔ Scholar ↔ XR ↔ Institution, etc.)

### Rules
| Rule | Status |
|------|--------|
| Cross-sphere links must be explicit | ✅ |
| No automatic propagation | ✅ |
| **Each hop recorded** | ✅ ⚡ |

### Sources
- shared artifacts between spheres, referenced decisions, replay excerpts, approved exports

### JSON Model (with approved_by + trace) ⚡

```json
{
  "inter_sphere_thread": {
    "id": "uuid",
    "spheres": ["business","scholar","xr"],
    "links": [
      {
        "from_sphere": "business",
        "to_sphere": "scholar",
        "ref": "artifact_id",
        "approved_by": "user_id"
      }
    ],
    "trace": true
  }
}
```

### Inter-Sphere Fields ⚡
| Field | Description |
|-------|-------------|
| `from_sphere` | Source sphere |
| `to_sphere` | Destination sphere |
| `approved_by` | User who approved link |
| `trace` | Enable tracing |

### UI ⚡
| Feature | Value |
|---------|-------|
| View | **constellation view** ⚡ |
| Style | **sphere orbits** ⚡ |
| Links | **directional links** ⚡ |
| Expansion | **manual expansion only** ⚡ |

---

## THREAD OPERATIONS (COMMON) ⚡ UNIQUE

### Allowed Operations ⚡
| Operation | Description |
|-----------|-------------|
| `create_thread` | **manual only** |
| `add_reference` | **user approved** |
| `remove_reference` | **soft remove** |
| `freeze_thread` | **lock** |
| `export_thread` | **pdf \| json \| xr_view** |

### Forbidden Operations
| Operation | Status |
|-----------|--------|
| auto-merging | ❌ |
| auto-prioritization | ❌ |
| hidden threading | ❌ |

---

## AGENTS (OBSERVE ONLY)

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | Builds indexes, **no visibility change** |
| `AGENT_THREAD_VALIDATOR` | Checks integrity, **no edits** |
| `AGENT_THREAD_EXPLAINER` | Explains links, **no conclusions** |

---

## WHY THREE THREADS

| Thread | Purpose |
|--------|---------|
| **Personal** | sense-making |
| **Collective** | shared truth |
| **Inter-Sphere** | system clarity |

### Together
- **continuity without control**
- **clarity without narrative**
- **memory without manipulation**

---

**END — THREAD SYSTEM FREEZE**
