# CHE·NU — KNOWLEDGE THREADS SYSTEM (EDGE TYPES)
**VERSION:** FOUNDATION v1.0  
**MODE:** CORE / NON-MANIPULATIVE / FREEZE-READY

---

## GLOBAL PRINCIPLE

> **Knowledge Threads connect INFORMATION.**  
> **They NEVER conclude, rank, persuade, or optimize decisions.**

> **Threads reveal RELATIONSHIPS, not meaning.**

---

## THREAD TYPE #1 — FACTUAL THREADS

### Purpose
Link concrete, verifiable elements across time and spheres.

### Sources
- collective_memory entries, XR replays, artifacts, decisions (declared only)

### Node Types ⚡
| Type | Description |
|------|-------------|
| `meeting` | Meeting node |
| `decision` | Decision node |
| `document` | Document node |
| `data snapshot` | Data snapshot |
| `agent action` | Agent action trace |

### Edge Types (Factual) ⚡
| Edge | Description |
|------|-------------|
| `happened_after` | Temporal sequence |
| `references` | Cites another |
| `reused_in` | Reused elsewhere |
| `derived_from` | Created from |

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| hash-verified | ✅ |
| no interpretation layer | ✅ |
| no sentiment metadata | ✅ |

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": ["id1","id2","id3"],
    "edges": [
      { "from": "id1", "to": "id2", "relation": "references" }
    ],
    "sphere_scope": ["business","scholar"],
    "visibility": "private|shared|public",
    "integrity": "verified"
  }
}
```

---

## THREAD TYPE #2 — CONTEXTUAL THREADS

### Purpose
Expose shared CONTEXT between events **without claiming causality.**

### Sources
- meeting metadata, participant overlap, time proximity, sphere adjacency, topic tags (explicit only)

### Node Types ⚡
| Type | Description |
|------|-------------|
| `session` | Session node |
| `sphere` | Sphere node |
| `user` | User node |
| `agent` | Agent node |
| `theme` | Theme node |

### Edge Types (Contextual) ⚡
| Edge | Description |
|------|-------------|
| `same_context` | Shared context |
| `adjacent_time` | Time proximity |
| `shared_participants` | Same people |
| `parallel_activity` | Concurrent |

### Rules
| Rule | Status |
|------|--------|
| no causal arrows | ✅ |
| no influence direction | ✅ |
| user-toggle visibility | ✅ |

### JSON Model (with user-controlled visibility)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "contextual",
    "nodes": ["ctx1","ctx2"],
    "edges": [
      { "from": "ctx1", "to": "ctx2", "relation": "shared_context" }
    ],
    "confidence": 0.75,
    "visibility": "user-controlled"
  }
}
```

---

## THREAD TYPE #3 — EVOLUTION THREADS (with object_type) ⚡

### Purpose
Track HOW structures change over time **without judgment.**

### Tracks
- avatar evolution states
- meeting format changes
- plan / decor revisions
- navigation profile shifts

### Never Tracks
- psychology, emotions, performance scores

### Node Types ⚡
| Type | Description |
|------|-------------|
| `version` | Version identifier |
| `timestamp` | Time marker |
| `config snapshot` | Configuration state |

### Edge Types (Evolution) ⚡
| Edge | Description |
|------|-------------|
| `replaces` | Replaces previous |
| `refines` | Improves upon |
| `supersedes` | Supersedes older |
| `deprecated_by` | Made obsolete by |

### JSON Model (with object_type)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "evolution",
    "timeline": [
      { "version": "v1", "timestamp": 1712340000 },
      { "version": "v2", "timestamp": 1712350000 }
    ],
    "object_type": "avatar|plan|decor|profile",
    "read_only": true
  }
}
```

### Object Types ⚡
| Type | Description |
|------|-------------|
| `avatar` | Avatar evolution |
| `plan` | Plan changes |
| `decor` | Decor/environment |
| `profile` | Navigation profile |

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

| Thread | Style | Opacity |
|--------|-------|---------|
| **FACTUAL** | solid lines | high contrast |
| **CONTEXTUAL** | dotted lines | low opacity |
| **EVOLUTION** | time-arrow layers | stacked nodes |

### All Threads
- toggleable
- filterable
- non-intrusive
- **no auto-focus**

---

## THREAD CREATION RULES ⚡

| Rule | Status |
|------|--------|
| created manually or by validated agents | ✅ |
| never auto-promoted | ✅ |
| never auto-ranked | ✅ |
| deletion requires explicit user action | ✅ |
| **archive allowed, erase forbidden** | ✅ ⚡ |

### Archive vs Erase ⚡
> **Archive = OK** (hidden but preserved)  
> **Erase = FORBIDDEN** (integrity protection)

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Constructs threads from approved data |
| `AGENT_THREAD_VALIDATOR` | Ensures rule compliance, **rejects causal claims** |
| `AGENT_THREAD_RENDERER` | Visual-only logic, **no interpretation** |

---

## WHY THE THREE TOGETHER

| Thread | Shows |
|--------|-------|
| **FACTUAL** | what happened |
| **CONTEXTUAL** | what coexisted |
| **EVOLUTION** | how it changed |

### Together
- **structure without story**
- **memory without distortion**
- **knowledge without control**

---

**END — FOUNDATION FREEZE**
