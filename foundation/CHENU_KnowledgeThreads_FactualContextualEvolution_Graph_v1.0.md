# CHE·NU — KNOWLEDGE THREADS SYSTEM (FACTUAL/CONTEXTUAL/EVOLUTION + GRAPH)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-INFERENTIAL / TRACEABLE

---

## GLOBAL DEFINITION

> **Knowledge Threads = Explicit links between information** across time, meetings, spheres, agents, and artifacts.

### RULE
> **A Knowledge Thread CONNECTS. It NEVER concludes, judges, or optimizes.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Trace objective facts and references across the system.

### Source Types
- documents, notes, decisions (declared only), artifacts, timestamps

### Characteristics ⚡
| Characteristic | Status |
|----------------|--------|
| explicit | ✅ |
| verifiable | ✅ |
| **replay-backed** | ✅ ⚡ |
| immutable once validated | ✅ |

### NO:
- opinion, interpretation, intent inference

### Factual Thread JSON (with origin + sphere) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": [
      { "ref": "artifact_id", "timestamp": 1712345678 },
      { "ref": "decision_id", "timestamp": 1712348901 }
    ],
    "origin": "xr_replay_id",
    "sphere": "business|scholar|xr",
    "hash": "sha256"
  }
}
```

### Factual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes[].ref` | **artifact_id / decision_id** ⚡ |
| `origin` | **xr_replay_id** ⚡ |
| `sphere` | Per-thread sphere |

---

## THREAD TYPE 2 — CONTEXTUAL THREAD

### Purpose
Preserve situational context **without asserting meaning.**

### Context Signals ⚡
- meeting type, participant set, domain, **artifacts present** ⚡, **silence intervals** ⚡

### Characteristics ⚡
| Characteristic | Status |
|----------------|--------|
| descriptive only | ✅ |
| optional visibility | ✅ |
| **per-user filtering allowed** | ✅ ⚡ |

### NO:
- cause/effect claims, emotional labels, priority ranking

### Contextual Thread JSON (with linked_factual_threads + artifacts) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "contextual",
    "context": {
      "meeting_type": "analysis|creative|decision",
      "participants": ["user_id","agent_id"],
      "sphere": "xr",
      "artifacts": ["doc_id","board_id"]
    },
    "linked_factual_threads": ["thread_id"],
    "visibility": "private|shared",
    "hash": "sha256"
  }
}
```

### Contextual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `context.artifacts` | **["doc_id","board_id"]** ⚡ |
| `linked_factual_threads` | **Array of thread_ids** ⚡ |

---

## THREAD TYPE 3 — EVOLUTION THREAD

### Purpose
Track changes over time **without declaring improvement, success, or regression.**

### Tracked Elements ⚡
| Element | Description |
|---------|-------------|
| **avatar evolution state** | ⚡ |
| **space / plan versions** | ⚡ |
| **theme changes** | ⚡ |
| **navigation profile shifts** | ⚡ |

### Characteristics ⚡
| Characteristic | Status |
|----------------|--------|
| temporal | ✅ |
| **comparative** | ✅ ⚡ |
| read-only | ✅ |
| replay-linked | ✅ |

### NO: ⚡
- scoring, **performance judgments** ⚡, **behavioral pressure** ⚡

### Evolution Thread JSON (with target + states + trigger) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "evolution",
    "target": "avatar|space|profile|theme",
    "states": [
      { "version": 1, "timestamp": 1712300000 },
      { "version": 2, "timestamp": 1712400000 }
    ],
    "trigger": "manual|session_end|scheduled",
    "hash": "sha256"
  }
}
```

### Evolution Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `target` | **avatar/space/profile/theme** ⚡ |
| `states` | **Array of {version, timestamp}** ⚡ |
| `trigger` | **manual/session_end/scheduled** ⚡ |

---

## THREAD GRAPH & INTERACTIONS ⚡

### Thread Graph Nodes ⚡
| Node Type | Description |
|-----------|-------------|
| factual_thread | ✅ |
| contextual_thread | ✅ |
| evolution_thread | ✅ |

### Thread Graph Edges ⚡
| Edge Type | Description |
|-----------|-------------|
| `references` | Reference link ⚡ |
| `occurred_with` | Temporal co-occurrence ⚡ |
| `followed_by` | Sequence ⚡ |
| `evolved_into` | Evolution link ⚡ |

### Threads CAN: ⚡
- **intersect**
- **branch**
- **merge**

### Threads CANNOT: ⚡
- **auto-generate conclusions**
- **rank importance**
- **suggest actions**

---

## ACCESS & CONTROL

| Rule | Status |
|------|--------|
| visibility per user | ✅ |
| visibility per sphere | ✅ |
| **explicit share required** | ✅ ⚡ |
| **read-only by default** | ✅ ⚡ |

### Thread Deletion ⚡
| Rule | Description |
|------|-------------|
| **never global** | ⚡ |
| **only hidden per scope** | ⚡ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_COLLECTOR` | observes events, **creates thread candidates** ⚡ |
| `AGENT_THREAD_VALIDATOR` | verifies source integrity, **hashes & signs threads** ⚡ |
| `AGENT_THREAD_RENDERER` | visualizes threads, **never interprets meaning** ⚡ |

---

## WHY KNOWLEDGE THREADS MATTER

They ensure:
- **continuity without narrative**
- **memory without bias**
- **learning without influence**
- **clarity without control**

---

**END — FOUNDATION FREEZE**
