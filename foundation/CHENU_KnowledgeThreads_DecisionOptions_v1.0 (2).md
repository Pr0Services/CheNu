# CHE·NU — KNOWLEDGE THREADS SYSTEM (DECISION OPTIONS)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / TRUTH-PRESERVING / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> **Knowledge Thread = A TRACEABLE LINE OF CONTINUITY** linking information, context, decisions, and memory **ACROSS time, meetings, spheres, and users.**

### RULE
> **Thread = FACTUAL CONNECTION**  
> **NOT interpretation, NOT narrative steering**

---

## THREAD TYPES (THE 3 PILLARS)

| Type | Purpose |
|------|---------|
| **FACT THREAD** | Information continuity |
| **DECISION THREAD** | Choice tracking |
| **CONTEXT THREAD** | Environmental snapshot |

> **Each type is SEPARATE but LINKABLE.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Preserve the continuity of INFORMATION itself.

### Links
- documents, data points, artifacts, references, external sources

### Allowed Content
- what was stated
- what was shown
- what was referenced

### Forbidden
- conclusions, opinions, inferred meaning

### Node Types
| Type | Description |
|------|-------------|
| `document` | Document |
| `chart` | Chart/graph |
| `dataset` | Data set |
| `visual artifact` | Visual |

### Edge Types
| Edge | Description |
|------|-------------|
| `references` | Cites |
| `updates` | Updates |
| `supersedes` | Replaces |
| `derives_from` | Created from |

### JSON Model

```json
{
  "fact_thread": {
    "thread_id": "uuid",
    "topic": "string",
    "nodes": [
      { "id": "artifact_id", "type": "document|data|visual", "timestamp": 1712345678 }
    ],
    "edges": [
      { "from": "id", "to": "id", "relation": "references|updates" }
    ],
    "integrity": "verified"
  }
}
```

---

## THREAD TYPE 2 — DECISION THREAD (with options) ⚡

### Purpose
Track HOW decisions emerged over time, **WITHOUT judging correctness.**

### Tracks
- alternatives presented
- choice made
- timing
- participants

### Does NOT Track
- success, failure, outcome quality

### Node Types ⚡
| Type | Description |
|------|-------------|
| `option` | Alternative considered |
| `decision` | Final choice |
| `revision` | Changed decision |
| `rollback` | Reverted decision |

### Edge Types (Decision) ⚡
| Edge | Description |
|------|-------------|
| `considered` | Was considered |
| `selected` | Was chosen |
| `revised_from` | Revised from previous |
| `reverted_to` | Rolled back to |

### JSON Model (with options + chosen + revisions) ⚡

```json
{
  "decision_thread": {
    "thread_id": "uuid",
    "context": "meeting|async|review",
    "options": ["A","B","C"],
    "chosen": "B",
    "timestamp": 1712345678,
    "participants": ["user_id","agent_id"],
    "revisions": []
  }
}
```

### Unique Fields ⚡
| Field | Description |
|-------|-------------|
| `options` | All alternatives considered |
| `chosen` | The selected option |
| `revisions` | History of changes |
| `context` | meeting / async / review |

---

## THREAD TYPE 3 — CONTEXT THREAD (with constraints + assumptions) ⚡

### Purpose
Preserve WHY information & decisions made sense **AT THAT MOMENT.**

### Captures
- sphere, constraints, assumptions, environment, available info snapshot

### Node Types
| Type | Description |
|------|-------------|
| `meeting context` | Meeting environment |
| `domain constraints` | Limitations |
| `environmental state` | Current state |
| `info availability window` | What was known |

### Edge Types (Context) ⚡
| Edge | Description |
|------|-------------|
| `contextualizes` | Provides context for |
| `bounded_by` | Limited by |
| `influenced_by` | Affected by |

### JSON Model (with constraints + assumptions + snapshot_hash)

```json
{
  "context_thread": {
    "thread_id": "uuid",
    "sphere": "business|scholar|xr|...",
    "constraints": ["time","budget","data_gap"],
    "assumptions": ["assumption_1"],
    "snapshot_hash": "sha256",
    "timestamp": 1712345678
  }
}
```

### Unique Fields ⚡
| Field | Description |
|-------|-------------|
| `constraints` | Active limitations |
| `assumptions` | Working assumptions |
| `snapshot_hash` | State hash |

---

## THREAD LINKING RULES ⚡

| Rule | Status |
|------|--------|
| Fact Threads MAY link to Context Threads | ✅ |
| **Decision Threads MUST link to Context Threads** | ✅ ⚡ |
| Context Threads NEVER altered post-validation | ✅ |

### Link Properties
- explicit
- visible
- traceable

---

## VISUALIZATION IN UNIVERSE VIEW

### Thread Colors ⚡
| Type | Color |
|------|-------|
| **Fact** | white |
| **Decision** | gold ⚡ |
| **Context** | blue |

### Properties
- Threads displayed as light filaments
- Toggleable per user
- Zoom reveals depth

---

## ACCESS & SAFETY

| Rule | Status |
|------|--------|
| Thread visibility inherits sphere permissions | ✅ |
| Private threads remain private | ✅ |
| No auto-promotion | ✅ |
| No ranking or importance scores | ✅ |

---

## WHY THE THREE TOGETHER

| Thread | Shows |
|--------|-------|
| **Fact Thread** | WHAT existed |
| **Decision Thread** | WHAT was chosen |
| **Context Thread** | WHY it made sense then |

### Together
- **Truth without hindsight bias**
- **Memory without rewriting**
- **Intelligence without control**

---

**END — FOUNDATION FREEZE**
