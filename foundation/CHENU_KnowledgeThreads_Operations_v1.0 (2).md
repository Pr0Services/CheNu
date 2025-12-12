# CHE·NU — KNOWLEDGE THREAD SYSTEM (OPERATIONS)
**VERSION:** FOUNDATION v1.0  
**MODE:** TRUTH-PRESERVING / NON-MANIPULATIVE

---

## CORE PRINCIPLE

> **Knowledge Threads CONNECT information.**  
> **They DO NOT interpret, prioritize, or conclude.**

### RULE
> **Thread = TRACEABLE CONTINUITY**  
> **NOT narrative, NOT recommendation.**

---

## THREAD TYPES (THE 3 CANONICAL)

1. **PERSONAL KNOWLEDGE THREAD**
2. **COLLECTIVE KNOWLEDGE THREAD**
3. **INTER-SPHERE KNOWLEDGE THREAD**

> **All three share the SAME structure.**  
> **Only scope & visibility differ.**

---

## 1) PERSONAL KNOWLEDGE THREAD

### Purpose
Maintain continuity of a single user's understanding across time, sessions, meetings, and replays.

### Scope
| Property | Value |
|----------|-------|
| Default visibility | private |
| Ownership | user |
| Exportable | fully |

### Sources
- meetings attended, replays viewed, decisions made, notes created, artifacts referenced

### Rules
| Rule | Status |
|------|--------|
| user-controlled | ✅ |
| can be paused, resumed, archived | ✅ |
| never merged automatically | ✅ |

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "personal",
    "owner": "user_id",
    "entries": [
      {
        "source": "meeting|replay|note|artifact",
        "ref_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr",
        "hash": "sha256"
      }
    ],
    "visibility": "private"
  }
}
```

---

## 2) COLLECTIVE KNOWLEDGE THREAD (with contributors) ⚡

### Purpose
Represent a SHARED continuity of facts across a team or organization.

### Scope
| Property | Value |
|----------|-------|
| Participation | opt-in |
| Ownership | shared |
| Mutability | append-only |

### Sources
- validated meetings, shared decisions, approved artifacts, confirmed replays

### Rules
| Rule | Status |
|------|--------|
| no conclusions | ✅ |
| no opinions | ✅ |
| no inferred success | ✅ |
| immutable after validation | ✅ |

### JSON Model (with contributors + validation)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "collective",
    "contributors": ["user_id","agent_id"],
    "entries": [
      {
        "source": "decision|artifact|replay",
        "ref_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "institution|business",
        "validation": "approved",
        "hash": "sha256"
      }
    ],
    "visibility": "shared"
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `contributors` | Array of user/agent IDs who contributed |
| `validation` | Entry validation status |

---

## 3) INTER-SPHERE KNOWLEDGE THREAD

### Purpose
Connect related knowledge ACROSS spheres **WITHOUT blending domains or rules.**

### Example
A concept touching: Scholar → Business → Institution

### Scope
| Property | Value |
|----------|-------|
| Default visibility | read-only |
| Links | explicit cross-sphere |
| Governance | enforced |

### Rules
| Rule | Status |
|------|--------|
| threads reference spheres | ✅ |
| never merge data | ✅ |
| never bypass sphere laws | ✅ |

### JSON Model (with scoped visibility)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "inter_sphere",
    "linked_spheres": ["scholar","business","institution"],
    "entries": [
      {
        "sphere": "scholar",
        "ref_id": "uuid",
        "relation": "references",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ],
    "visibility": "scoped_read_only"
  }
}
```

---

## THREAD OPERATIONS (SAFE) ⚡

### ✅ Allowed Operations

| Operation | Description |
|-----------|-------------|
| `add_entry` | Add new entry to thread |
| `pause_thread` | Temporarily pause |
| `resume_thread` | Resume paused thread |
| `split_thread` | Split into sub-threads |
| `archive_thread` | Archive for storage |
| `export_thread` | Export as PDF / JSON |

### ❌ Forbidden Operations

| Operation | Reason |
|-----------|--------|
| `auto-merge` | Manipulation risk |
| `auto-prioritize` | Bias injection |
| `hidden linking` | Transparency violation |
| `emotional tagging` | Manipulation |

---

## VISIBILITY TYPES ⚡

| Type | Description |
|------|-------------|
| `private` | User-only access |
| `shared` | Team/group access |
| `scoped_read_only` | Cross-sphere read-only |

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

| Property | Meaning |
|----------|---------|
| thickness | = frequency, **NOT importance** |
| color | = sphere origin |
| opacity | = user visibility |

### Click Behavior
- reveals trace only
- **no summary injected**

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | Indexes references only |
| `AGENT_THREAD_GUARD` | Enforces rules, **prevents illegal merges** |
| `AGENT_THREAD_VISUALIZER` | Renders safely, **no interpretation** |

---

## WHY THE 3 THREADS

| Thread | Purpose |
|--------|---------|
| **Personal** | Personal clarity |
| **Collective** | Shared truth |
| **Inter-Sphere** | System coherence |

### Together
- **continuity without control**
- **insight without direction**
- **memory without manipulation**

---

**END — FREEZE READY**
