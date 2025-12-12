# CHE·NU — KNOWLEDGE THREADS SYSTEM (FACT/DECISION/CONTEXT CORE)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **CONTINUOUS, TRACEABLE line** of related information across time, meetings, agents, spheres, and users.

### THREADS DO NOT:
- conclude, summarize, optimize, judge

### THREADS ONLY:
- **connect, trace, contextualize**

---

## THE 3 KNOWLEDGE THREAD TYPES

| # | Type | Purpose |
|---|------|---------|
| 1 | FACT THREAD | Track information flow |
| 2 | DECISION THREAD | Track decision emergence |
| 3 | CONTEXT THREAD | Preserve why something happened |

> **Each thread is independent, but may interlink.**

---

## 1) FACT THREAD

### Purpose
Track how **INFORMATION appears, moves, and is reused.**

### Includes
- documents, notes, diagrams, datasets, referenced knowledge

### Fact Thread Answers ⚡
| Question | Thread Answers |
|----------|----------------|
| **"Where did this information come from?"** | ⚡ |
| **"Where was it reused?"** | ⚡ |
| **"When did it change?"** | ⚡ |

### Fact Thread Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| **source must be verifiable** | ✅ ⚡ |
| no interpretation layer | ✅ |
| no sentiment | ✅ |

### Fact Thread JSON (with origin object + nodes) ⚡

```json
{
  "fact_thread": {
    "id": "uuid",
    "origin": {
      "type": "meeting|document|agent",
      "source_id": "uuid",
      "timestamp": 1712345678
    },
    "nodes": [
      {
        "ref_id": "uuid",
        "ref_type": "note|file|visual",
        "used_in": "meeting|sphere",
        "timestamp": 1712348888
      }
    ],
    "visibility": "private|shared|public",
    "hash": "sha256"
  }
}
```

### Fact Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `origin` | **Object with type/source_id/timestamp** ⚡ |
| `origin.type` | **meeting/document/agent** ⚡ |
| `nodes[].ref_type` | **note/file/visual** ⚡ |
| `nodes[].used_in` | **meeting/sphere** ⚡ |

---

## 2) DECISION THREAD

### Purpose
Track how **DECISIONS emerge, evolve, split, or pause.**

### Includes ⚡
- proposals, accepted decisions, rejected options, **delayed outcomes** ⚡, **decision silence** ⚡

### Decision Thread Answers ⚡
| Question | Thread Answers |
|----------|----------------|
| **"What options were considered?"** | ⚡ |
| **"What was chosen?"** | ⚡ |
| **"What was explicitly NOT chosen?"** | ⚡ |

### Decision Thread Rules ⚡
| Rule | Status |
|------|--------|
| no success / failure scoring | ✅ |
| no prediction | ✅ |
| no optimization | ✅ |
| **silence is a valid state** | ✅ ⚡ |

### Decision Thread JSON (with events array + current_state + linked_fact_threads) ⚡

```json
{
  "decision_thread": {
    "id": "uuid",
    "topic": "string",
    "events": [
      {
        "event_type": "proposal|decision|rejection|pause",
        "ref_meeting": "uuid",
        "timestamp": 1712349999,
        "actors": ["user|agent"]
      }
    ],
    "current_state": "open|decided|paused",
    "linked_fact_threads": ["uuid"]
  }
}
```

### Decision Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `events` | **Array of events** ⚡ |
| `events[].event_type` | **proposal/decision/rejection/pause** ⚡ |
| `events[].ref_meeting` | **UUID reference** ⚡ |
| `events[].actors` | **["user\|agent"]** ⚡ |
| `current_state` | **open/decided/paused** ⚡ |
| `linked_fact_threads` | **Array of UUIDs** ⚡ |

---

## 3) CONTEXT THREAD

### Purpose
Preserve **WHY something happened** without rewriting history.

### Includes ⚡
- meeting conditions, constraints, **external factors** ⚡, **scope changes** ⚡, **resource limits** ⚡

### Context Thread Answers ⚡
> **"What was true at that moment?"**

### Context Thread Rules ⚡
| Rule | Status |
|------|--------|
| descriptive only | ✅ |
| **no hindsight bias** | ✅ ⚡ |
| **no reinterpretation** | ✅ ⚡ |
| **frozen per timestamp** | ✅ ⚡ |

### Context Thread JSON (with context_snapshots) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "context_snapshots": [
      {
        "timestamp": 1712341111,
        "sphere": "business|xr|scholar",
        "participants": 6,
        "constraints": ["time","budget","info_gap"],
        "notes": "string"
      }
    ]
  }
}
```

### Context Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `context_snapshots` | **Array of snapshots** ⚡ |
| `context_snapshots[].participants` | **Number (count)** ⚡ |
| `context_snapshots[].constraints` | **["time","budget","info_gap"]** ⚡ |
| `context_snapshots[].notes` | **String notes** ⚡ |

---

## THREAD INTERLINKING

| Link Direction | Description |
|----------------|-------------|
| Fact Threads → Decision Threads | Link to |
| Decision Threads → Context Threads | Reference |
| Context Threads → Fact Threads | Frame visibility |

### Critical Rules ⚡
> **NO THREAD can modify another. Links are directional & immutable.**

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

### Visual Styles ⚡
| Thread Type | Style |
|-------------|-------|
| **FACT THREAD** | solid line, neutral color |
| **DECISION THREAD** | **segmented line, fork points visible** ⚡ |
| **CONTEXT THREAD** | **translucent envelope, time-layered shading** ⚡ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_EXTRACTOR` | identifies candidates, **no auto-creation without validation** ⚡ |
| `AGENT_THREAD_LINKER` | proposes links, **read-only impact** ⚡ |
| `AGENT_THREAD_GUARD` | checks non-manipulation, enforces immutability |

---

## WHY KNOWLEDGE THREADS MATTER

### They PREVENT:
- **memory drift**
- **narrative rewriting**
- **false coherence**

### They ENABLE:
- **clarity**
- **accountability**
- **long-term truth**

---

**END — THREADS FOUNDATION FREEZE**
