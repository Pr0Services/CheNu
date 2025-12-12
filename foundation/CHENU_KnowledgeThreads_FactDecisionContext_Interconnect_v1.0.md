# CHE·NU — KNOWLEDGE THREADS SYSTEM (FACT/DECISION/CONTEXT + INTERCONNECT)
**VERSION:** CORE.v1.0  
**TYPE:** FOUNDATIONAL / CROSS-SPHERE / TRACEABLE

---

## GLOBAL DEFINITION

> **Knowledge Thread = A CONTINUOUS TRACE OF KNOWLEDGE** across time, spheres, users, agents, and decisions.

> **Threads CONNECT information. They NEVER interpret, judge, or optimize meaning.**

### RULE
> **Threads show RELATIONSHIP — not conclusion.**

---

## THE 3 KNOWLEDGE THREAD TYPES

| # | Type | Purpose |
|---|------|---------|
| 1 | FACT THREAD | Track WHAT EXISTS |
| 2 | DECISION THREAD | Track WHAT WAS DECIDED |
| 3 | CONTEXT THREAD | Explain WHY things were connected |

> **All three coexist. None dominates the others.**

---

## 1) FACT THREAD

### Purpose
Track **WHAT EXISTS.** Pure information lineage.

### Sources
- Documents, Notes, Files, Data artifacts, **Visual boards** ⚡, **External references** ⚡

### Properties
| Property | Status |
|----------|--------|
| Immutable | ✅ |
| Versioned | ✅ |
| Timestamped | ✅ |
| Source-referenced | ✅ |

### NO:
- Opinion, Sentiment, Importance weighting

### Fact Thread JSON (with versions array + source types) ⚡

```json
{
  "fact_thread": {
    "id": "uuid",
    "origin": "artifact_id",
    "sphere": "business|scholar|creative|...",
    "versions": [
      {
        "version": 1,
        "timestamp": 1712345678,
        "source": "meeting|upload|external",
        "hash": "sha256"
      }
    ],
    "linked_threads": []
  }
}
```

### Fact Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `versions` | **Array of version objects** ⚡ |
| `versions[].version` | **Version number (integer)** ⚡ |
| `versions[].source` | **meeting/upload/external** ⚡ |
| `linked_threads` | **Array of thread_ids** ⚡ |

---

## 2) DECISION THREAD

### Purpose
Track **WHAT WAS DECIDED.** No evaluation — only sequence.

### Sources
- Meetings, Votes, **Confirmations** ⚡, **Agent executions** ⚡, Explicit approvals

### Properties ⚡
| Property | Status |
|----------|--------|
| **Linear or branching** | ✅ ⚡ |
| Explicit actors | ✅ |
| Explicit timestamps | ✅ |

### Includes ⚡
- Decision moment, Preconditions, **Consequences declared** ⚡

### Excludes
- Success / failure labels, Outcome judgment

### Decision Thread JSON (with decision_events + depends_on + branching) ⚡

```json
{
  "decision_thread": {
    "id": "uuid",
    "decision_events": [
      {
        "timestamp": 1712345678,
        "decision": "string",
        "actors": ["user_id","agent_id"],
        "context": "meeting_id",
        "depends_on": ["decision_id"]
      }
    ],
    "branching": true
  }
}
```

### Decision Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `decision_events` | **Array of events** ⚡ |
| `decision_events[].decision` | **String - decision text** ⚡ |
| `decision_events[].context` | **meeting_id reference** ⚡ |
| `decision_events[].depends_on` | **["decision_id"] dependencies** ⚡ |
| `branching` | **Boolean - allows branching** ⚡ |

---

## 3) CONTEXT THREAD

### Purpose
Explain **WHY things were connected in time.** Context = situation, not opinion.

### Sources
- Meeting metadata, Sphere state, Active constraints, Participating agents, **Temporal proximity** ⚡

### CRITICAL ⚡
> **Context Threads DO NOT explain intent. They explain conditions.**

### Context Thread JSON (with time_range array + constraints) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "time_range": [start_ts, end_ts],
    "sphere_state": "string",
    "participants": ["user","agent"],
    "constraints": ["rule_id","resource_limit"],
    "related_threads": ["fact_id","decision_id"]
  }
}
```

### Context Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `time_range` | **[start_ts, end_ts] array** ⚡ |
| `sphere_state` | **String state** ⚡ |
| `constraints` | **["rule_id","resource_limit"]** ⚡ |
| `related_threads` | **Array of fact/decision ids** ⚡ |

---

## THREAD INTERCONNECTION RULES ⚡

| Rule | Status |
|------|--------|
| Fact Threads CAN exist alone | ✅ |
| **Decision Threads MUST reference at least one Fact** | ⚡ |
| Context Threads CAN reference many Fact & Decision Threads | ✅ |
| **No circular authority** | ⚡ |

### Graph Model ⚡
| Property | Description |
|----------|-------------|
| Nodes | threads |
| Edges | **references only** ⚡ |
| Direction | **No direction implies priority** ⚡ |

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

### Visual Styles ⚡
| Thread Type | Style |
|-------------|-------|
| **Fact Thread** | **Thin stable line** ⚡ |
| **Decision Thread** | **Thick segmented line (branches visible)** ⚡ |
| **Context Thread** | **Soft envelope / shaded layer** ⚡ |

### User Can ⚡
| Action | Available |
|--------|-----------|
| Toggle per-thread type | ✅ |
| Isolate a single thread | ✅ |
| Overlay threads | ✅ |
| **Compare two threads** | ✅ ⚡ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_EXTRACTOR` | extracts candidates, no authority |
| `AGENT_THREAD_LINKER` | proposes links, **requires validation** ⚡ |
| `AGENT_THREAD_GUARD` | ensures: no interpretation, **no bias injection** ⚡, rule compliance |

---

## ETHICAL & SAFETY GUARANTEES

| Guarantee | Status |
|-----------|--------|
| No narrative rewriting | ✅ |
| **No importance scoring** | ✅ ⚡ |
| **No recommendation engine** | ✅ ⚡ |
| Full traceability | ✅ |
| **User can always see sources** | ✅ ⚡ |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **clarity without control**
- **memory without distortion**
- **understanding without coercion**

> **They are the BACKBONE of shared truth in Che-Nu.**

---

**END — FOUNDATION FREEZE**
