# CHE·NU — KNOWLEDGE THREADS SYSTEM (ENTITY TYPE)
**VERSION:** FOUNDATION v1.0  
**MODE:** TRUTH-PRESERVING / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> **Knowledge Threads are STRUCTURAL LINKS** between information units across time, spheres, meetings, agents, and users.

### RULE
> **Threads CONNECT facts.**  
> **They DO NOT infer meaning.**

---

## THE 3 KNOWLEDGE THREAD TYPES

---

## THREAD TYPE 1 — FACT THREAD (with entity_type) ⚡

### Purpose
Link objective information units that describe the **SAME factual entity or event.**

### Examples
- same decision referenced in multiple meetings
- same document reused over time
- same policy applied in different contexts

### Characteristics
| Property | Value |
|----------|-------|
| immutable | ✅ |
| append-only | ✅ |
| time-aware | ✅ |
| replay-verifiable | ✅ |

### JSON Model (with entity_type) ⚡

```json
{
  "fact_thread": {
    "id": "uuid",
    "entity_type": "decision|artifact|policy|event",
    "nodes": ["memory_id_1","memory_id_2"],
    "created_at": "timestamp",
    "integrity": "verified"
  }
}
```

### Entity Types ⚡
| Type | Description |
|------|-------------|
| `decision` | Decision entity |
| `artifact` | Artifact entity |
| `policy` | Policy entity |
| `event` | Event entity |

---

## THREAD TYPE 2 — CONTEXT THREAD (with context_tag + time_span) ⚡

### Purpose
Link information by **SHARED CONTEXT**, not by identical facts.

### Examples
- discussions around same topic
- meetings in same sphere
- parallel explorations
- evolving understanding

### Characteristics
| Property | Value |
|----------|-------|
| **non-directional** | ✅ ⚡ |
| **multi-branching** | ✅ ⚡ |
| contextual clustering only | ✅ |
| **non-hierarchical** | ✅ ⚡ |

### JSON Model (with context_tag + time_span) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "context_tag": "string",
    "linked_memories": ["memory_id_x"],
    "sphere": "business|scholar|xr|...",
    "time_span": {
      "start": "timestamp",
      "end": "timestamp"
    }
  }
}
```

### Context Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `context_tag` | Human-readable context label |
| `time_span.start` | Start timestamp |
| `time_span.end` | End timestamp |

---

## THREAD TYPE 3 — EVOLUTION THREAD (with versions + current) ⚡

### Purpose
Track **CHANGE OVER TIME** of a concept, structure, decision, or approach **WITHOUT judging quality or success.**

### Examples
- version changes
- methodology evolution
- architectural plan revisions
- agent prompt updates

### Characteristics
| Property | Value |
|----------|-------|
| ordered timeline | ✅ |
| versioned | ✅ |
| reversible | ✅ |
| **fully replayable** | ✅ ⚡ |

### JSON Model (with versions + current) ⚡

```json
{
  "evolution_thread": {
    "id": "uuid",
    "subject_id": "uuid",
    "versions": [
      { "version": 1, "timestamp": "t1" },
      { "version": 2, "timestamp": "t2" }
    ],
    "current": 2
  }
}
```

### Evolution Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `subject_id` | ID of entity being tracked |
| `versions` | Array of version objects |
| `version` | Version number (1, 2, 3...) |
| `current` | Current active version |

---

## THREAD CREATION RULES ⚡

| Rule | Status |
|------|--------|
| automatic generation allowed | ✅ |
| manual creation allowed | ✅ |
| **deletion forbidden** | ❌ ⚡ |
| hiding allowed per user permission | ✅ |
| **merging forbidden (only linking)** | ❌ ⚡ |

### Deletion Forbidden ⚡
> **Threads can NEVER be deleted, only hidden**

### Merging Forbidden ⚡
> **Threads can NEVER be merged, only linked**

---

## THREAD VISUALIZATION ⚡

### Universe View
| Thread | Style |
|--------|-------|
| **FACT** | straight solid lines |
| **CONTEXT** | **soft curved links** ⚡ |
| **EVOLUTION** | **segmented timeline lines** ⚡ |

### XR
| Property | Value |
|----------|-------|
| Display | threads appear only on request |
| Opacity | adjusted by density |
| Style | always non-intrusive |

---

## THREAD ACCESS & PRIVACY

| Rule | Status |
|------|--------|
| threads inherit memory permissions | ✅ |
| private memories never leak | ✅ |
| thread existence may be hidden | ✅ |
| full audit trail available | ✅ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Links eligible memories, **no inference** |
| `AGENT_THREAD_VALIDATOR` | Integrity checks, rule enforcement |
| `AGENT_THREAD_EXPLAINER` | Human-readable descriptions, **no conclusions** |

---

## WHY THIS SYSTEM MATTERS

| Thread | Preserves |
|--------|-----------|
| **Fact Threads** | truth |
| **Context Threads** | understanding |
| **Evolution Threads** | history |

### Together
- **no rewriting**
- **no manipulation**
- **no loss of meaning**

---

**END — FOUNDATION LOCKED**
