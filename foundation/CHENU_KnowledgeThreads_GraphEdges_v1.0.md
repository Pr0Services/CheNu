# CHE·NU — KNOWLEDGE THREADS SYSTEM (GRAPH EDGES)
**VERSION:** FOUNDATION v1.0  
**TYPE:** CROSS-SPHERE KNOWLEDGE STRUCTURE  
**MODE:** NON-MANIPULATIVE / APPEND-ONLY

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **CONTINUOUS TRACE** of related knowledge across time, spheres, meetings, decisions, and artifacts.

### RULE
> **Threads CONNECT information.**  
> **They NEVER summarize, judge, or conclude.**

---

## THREAD TYPES (THE 3 CORE)

| Type | Purpose |
|------|---------|
| **A) FACT THREAD** | Track verifiable information |
| **B) DECISION THREAD** | Track how decisions emerge |
| **C) CONTEXT THREAD** | Preserve environment |

---

## A) FACT THREAD

### Purpose
Track verifiable information as it appears, reappears, evolves, or is reused.

### Examples
- A concept introduced in Scholar sphere
- A metric reused in Business
- A document referenced across meetings

### Properties
| Property | Value |
|----------|-------|
| immutable facts | ✅ |
| source-linked | ✅ |
| time-stamped | ✅ |
| replay-verifiable | ✅ |

### FACT THREAD NEVER
- infers meaning
- evaluates correctness
- predicts outcome

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "label": "string",
    "sources": [
      {
        "type": "meeting|artifact|replay",
        "ref_id": "uuid",
        "timestamp": 1712345678
      }
    ],
    "spheres": ["business","scholar"],
    "hash": "sha256"
  }
}
```

---

## B) DECISION THREAD (with event_type) ⚡

### Purpose
Track HOW decisions emerge, change, pause, or revert across time and contexts.

### Focus
- decision points
- alternatives presented
- moments of silence
- reversals

### DECISION THREAD NEVER
- scores decisions
- labels success/failure
- recommends alternatives

### JSON Model (with event_type)

```json
{
  "decision_thread": {
    "id": "uuid",
    "topic": "string",
    "events": [
      {
        "event_type": "proposal|pause|decision|reversal",
        "source_replay": "uuid",
        "timestamp": 1712345678
      }
    ],
    "participants": ["user","agent"],
    "hash": "sha256"
  }
}
```

### Event Types ⚡
| Type | Description |
|------|-------------|
| `proposal` | New option proposed |
| `pause` | Decision paused |
| `decision` | Choice made |
| `reversal` | Decision reversed |

---

## C) CONTEXT THREAD (with linked_threads + meeting_type) ⚡

### Purpose
Preserve WHY something happened in its environment **WITHOUT rewriting history.**

### Tracks
- sphere context
- constraints
- available data at the time
- participants present

### CONTEXT THREAD NEVER
- adds hindsight bias
- modifies events
- inserts interpretation

### JSON Model (with linked_threads + meeting_type)

```json
{
  "context_thread": {
    "id": "uuid",
    "linked_threads": ["fact_thread_id","decision_thread_id"],
    "environment": {
      "sphere": "business",
      "meeting_type": "analysis",
      "constraints": ["time","data_limited"]
    },
    "timestamp": 1712345678,
    "hash": "sha256"
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `linked_threads` | References to fact/decision threads |
| `meeting_type` | Type of meeting (analysis, review, etc.) |

---

## THREAD GRAPH STRUCTURE ⚡

### Nodes
| Node Type | Description |
|-----------|-------------|
| `fact_thread` | Facts |
| `decision_thread` | Decisions |
| `context_thread` | Context |

### Edges ⚡
| Edge | Description |
|------|-------------|
| `references` | Cites another thread |
| `precedes` | Comes before |
| `coexists` | Same time period |
| `diverges` | Branches from ⚡ |

### Graph Properties ⚡
| Property | Value |
|----------|-------|
| **acyclic** | No circular references ⚡ |
| **append-only** | Never delete ⚡ |
| **verifiable** | Hash verified ⚡ |

---

## ACCESS & VISIBILITY

| Property | Value |
|----------|-------|
| user-owned by default | ✅ |
| sharable explicitly | ✅ |
| sphere-limited optionally | ✅ |
| anonymizable for collective memory | ✅ |

---

## SAFETY & ETHICS

| Rule | Status |
|------|--------|
| No sentiment metadata | ✅ |
| No ranking | ✅ |
| No optimization | ✅ |
| No inferred intent | ✅ |

> **Threads are TRACE, not STORY.**

---

## WHY THIS MATTERS

| Thread | Shows |
|--------|-------|
| **Fact Threads** | WHAT exists |
| **Decision Threads** | HOW choices formed |
| **Context Threads** | WHY it made sense then |

### Together
- **truth without distortion**
- **memory without narrative control**
- **understanding without manipulation**

---

**END — KNOWLEDGE THREADS**
