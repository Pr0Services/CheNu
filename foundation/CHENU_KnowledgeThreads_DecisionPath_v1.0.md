# CHE·NU — KNOWLEDGE THREAD SYSTEM (DECISION PATH)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## GLOBAL DEFINITION

> **Knowledge Thread = A TRACEABLE LINE OF KNOWLEDGE**  
> connecting facts, actions, decisions, and artifacts across time, meetings, agents, users, and spheres.

### RULE
> **Threads DESCRIBE reality.**  
> **They NEVER interpret, rank, or optimize meaning.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Track VERIFIED information across the system.

### Sources
- validated XR replays
- confirmed documents
- logged agent actions
- declared decisions

### Properties
| Property | Status |
|----------|--------|
| immutable | ✅ |
| append-only | ✅ |
| timestamped | ✅ |
| source-linked | ✅ |

### Fact Thread Content
- who
- when
- where
- what (action or artifact)

### Never Includes
- ❌ opinions
- ❌ conclusions
- ❌ inferred intent

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "nodes": [
      {
        "type": "event|artifact|decision",
        "ref_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr|..."
      }
    ],
    "hash": "sha256",
    "verified": true
  }
}
```

---

## THREAD TYPE 2 — CONTEXT THREAD

### Purpose
Preserve SITUATIONAL CONTEXT without interpretation.

### Sources
- meeting metadata
- participant sets
- temporal proximity
- sphere environment
- architectural presets

### Properties
| Property | Status |
|----------|--------|
| descriptive only | ✅ |
| non-evaluative | ✅ |
| reversible visibility | ✅ |

### Context Thread Content
- meeting type
- environment
- toolset active
- participant roles
- silence intervals

### JSON Model

```json
{
  "context_thread": {
    "id": "uuid",
    "context_nodes": [
      {
        "meeting_id": "uuid",
        "environment": "xr_classic",
        "participants": ["user","agent"],
        "sphere": "scholar"
      }
    ],
    "visibility": "private|shared|public"
  }
}
```

---

## THREAD TYPE 3 — DECISION PATH THREAD ⚡ UNIQUE

### Purpose
Track **SEQUENCES of decisions over time** WITHOUT judging quality or outcome.

### Sources
- declared decision points
- agenda transitions
- approval logs
- rejection logs

### Properties
| Property | Status |
|----------|--------|
| linear or branching | ✅ |
| no ranking | ✅ |
| no success/failure tags | ✅ |

### Decision Path Content
| Field | Description |
|-------|-------------|
| `decision_id` | Unique identifier |
| `predecessor` | Previous decision (or null) |
| `branching_point` | Where paths diverged |
| `timestamp` | When decided |

### JSON Model (with branching + predecessor)

```json
{
  "decision_thread": {
    "id": "uuid",
    "path": [
      {
        "decision_id": "uuid",
        "previous": "uuid|null",
        "timestamp": 1712345678
      }
    ],
    "branching": true
  }
}
```

### Decision Path Visualization

```
Decision A (root)
    │
    ├──→ Decision B (approved)
    │         │
    │         └──→ Decision D
    │
    └──→ Decision C (deferred)
              │
              └──→ Decision E (branch)
```

---

## THREAD INTERCONNECTION RULES

### Allowed Links

| From | To | Rule |
|------|----|------|
| Fact Threads | Context Threads | ✅ MAY link |
| Decision Threads | Fact Threads | ✅ MUST reference |
| Context Threads | Facts | ❌ NEVER alter |

### Forbidden
- ❌ No circular authority allowed

### Hierarchy

```
DECISION ──references──→ FACT ←──links── CONTEXT
                         │
                    (immutable)
```

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

| Element | Representation |
|---------|----------------|
| Threads | rendered as lines |
| Thickness | = density only (**NOT importance**) |
| Color | by type (fact/context/decision) |
| Toggle | per thread type |
| Safety | zoom-safe & clutter-aware |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles threads, **no modification** |
| `AGENT_THREAD_VALIDATOR` | Checks integrity |

---

**END — FOUNDATION FREEZE**
