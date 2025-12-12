# CHE·NU — KNOWLEDGE THREADS SYSTEM (EVOLUTION STATES)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## GLOBAL PRINCIPLE

> A Knowledge Thread is a **CONTINUOUS LINE OF FACTS**, connections, and references across time, spheres, agents, and meetings.

### RULE
> **Threads CONNECT information.**  
> **They NEVER conclude, judge, or prioritize truth.**

---

## THREAD TYPE 1 — FACT THREAD (cryptographically signed) ⚡

### Purpose
Track objective, verifiable facts across the system.

### Sources
- documents, notes, artifacts, decisions (declared only), timestamps, references

### Characteristics
| Property | Value |
|----------|-------|
| append-only | ✅ |
| source-linked | ✅ |
| immutable after validation | ✅ |
| **cryptographically signed** | ✅ ⚡ |

### FACT THREAD NEVER includes
- opinions, interpretations, success/failure labels

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "topic": "string",
    "entries": [
      {
        "source": "document|meeting|artifact",
        "reference_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr|...",
        "hash": "sha256"
      }
    ],
    "visibility": "private|shared|public"
  }
}
```

---

## THREAD TYPE 2 — CONTEXT THREAD (with time_range) ⚡

### Purpose
Preserve **WHY and WHERE information appeared**, without inferring intent.

### Sources
- meeting context, sphere context, participant list, temporal proximity, surrounding artifacts

### Characteristics
| Property | Value |
|----------|-------|
| descriptive only | ✅ |
| no inference | ✅ |
| optional attachment to fact threads | ✅ |

### CONTEXT THREAD NEVER
- guesses motivation
- assigns causality
- ranks importance

### JSON Model (with time_range) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "linked_fact_threads": ["uuid"],
    "context": {
      "sphere": "string",
      "meeting_type": "analysis|decision|creative",
      "participants": ["user_id","agent_id"],
      "time_range": [1712345600, 1712349200]
    }
  }
}
```

### Time Range ⚡
> **Array format: [start_timestamp, end_timestamp]**

---

## THREAD TYPE 3 — EVOLUTION THREAD (with states + subject) ⚡

### Purpose
Track **HOW things changed over time**, without assessing value or correctness.

### Sources
- revisions, alternative decisions, replay comparisons, structural changes, avatar/space evolution (visual only)

### Characteristics
| Property | Value |
|----------|-------|
| chronological | ✅ |
| comparative | ✅ |
| neutral | ✅ |
| reversible view | ✅ |

### EVOLUTION THREAD NEVER
- labels regression/progress
- ranks outcomes
- predicts success

### JSON Model (with states + subject) ⚡

```json
{
  "evolution_thread": {
    "id": "uuid",
    "subject": "decision|plan|concept|space",
    "states": [
      {
        "state_id": "uuid",
        "timestamp": 1712345678,
        "source_replay": "uuid",
        "description": "neutral change description"
      }
    ]
  }
}
```

### Subject Types ⚡
| Subject | Description |
|---------|-------------|
| `decision` | Decision evolution |
| `plan` | Plan evolution |
| `concept` | Concept evolution |
| `space` | Space/environment evolution |

### State Fields ⚡
| Field | Description |
|-------|-------------|
| `state_id` | Unique state identifier |
| `source_replay` | Linked replay ID |
| `description` | **Neutral change description** |

---

## THREAD RELATIONSHIP MODEL ⚡

| Thread | Role |
|--------|------|
| **Fact Threads** | backbone |
| **Context Threads** | environment |
| **Evolution Threads** | temporal view |

### Critical Rule ⚡
> **Threads may LINK but NEVER MERGE.**

---

## THREAD VISUALIZATION (UNIVERSE VIEW) ⚡

| Thread | Style |
|--------|-------|
| **Fact Thread** | solid line |
| **Context Thread** | **dotted halo** ⚡ |
| **Evolution Thread** | braided line |

### User Can
- toggle each type
- isolate threads
- compare evolutions
- export thread bundle (PDF / JSON)

---

## ETHICAL & SAFETY LOCKS

| Lock | Status |
|------|--------|
| no narrative synthesis | ✅ |
| no automatic conclusions | ✅ |
| no hidden aggregation | ✅ |
| full traceability | ✅ |
| user-controlled visibility | ✅ |

---

## WHY THIS MATTERS

Knowledge Threads allow:
- **shared reality**
- **multiple perspectives**
- **historical clarity**
- **zero manipulation**

### Core Philosophy ⚡
> **They make Che-Nu: A memory system, not a storyteller.**

---

**END — THREAD SYSTEM FREEZE**
