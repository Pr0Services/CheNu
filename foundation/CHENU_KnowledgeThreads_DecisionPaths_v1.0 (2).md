# CHE·NU — KNOWLEDGE THREADS SYSTEM (DECISION PATHS)
**VERSION:** CORE.v1.0  
**STATUS:** FOUNDATION / FREEZE-READY

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **CONTINUOUS TRACE** of information across time, meetings, agents, and spheres.

### RULE
> **Knowledge Threads CONNECT facts.**  
> **They NEVER interpret, rank, or conclude.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Track **WHAT is known and WHEN it appeared.**

### Sources
- meetings, artifacts, notes, agent outputs, decisions logs

### Properties
| Property | Value |
|----------|-------|
| append-only | ✅ |
| immutable after validation | ✅ |
| time-ordered | ✅ |

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "topic": "string",
    "events": [
      {
        "source": "meeting|artifact|agent",
        "ref_id": "uuid",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ]
  }
}
```

### Usage
- factual reconstruction, audit trails, replay alignment

---

## THREAD TYPE 2 — DECISION THREAD (with paths + step + objective) ⚡

### Purpose
Track **HOW decisions evolved over time** without judging quality.

### Sources
- decision declarations, meeting outcomes, agent recommendations (as artifacts)

### Properties
| Property | Value |
|----------|-------|
| **branching allowed** | ✅ ⚡ |
| no success/failure tags | ✅ |
| no optimization scores | ✅ |

### JSON Model (with paths + step) ⚡

```json
{
  "decision_thread": {
    "id": "uuid",
    "objective": "string",
    "paths": [
      {
        "step": 1,
        "decision": "string",
        "timestamp": 1712345678,
        "context": "meeting_id"
      }
    ]
  }
}
```

### Decision Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `objective` | Goal of the decision chain |
| `paths` | Array of decision steps |
| `step` | Sequential step number |
| `decision` | Decision made |
| `context` | Meeting ID for context |

### Usage
- decision comparison, learning by observation, replay alignment

---

## THREAD TYPE 3 — CONTEXT THREAD (with conditions) ⚡

### Purpose
Track **WHY things were discussed** and under which conditions.

### Sources
- sphere context, participants, constraints, silence periods

### Properties
| Property | Value |
|----------|-------|
| descriptive only | ✅ |
| non-inferential | ✅ |
| **anonymizable** | ✅ ⚡ |

### JSON Model (with conditions) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "environment": "sphere|xr|domain",
    "participants": ["user|agent"],
    "conditions": {
      "time_pressure": false,
      "information_density": "low|medium|high"
    }
  }
}
```

### Conditions Fields ⚡
| Field | Values |
|-------|--------|
| `time_pressure` | true / false |
| `information_density` | low / medium / high |

### Usage
- contextual understanding, replay interpretation, personal navigation cues

---

## THREAD LINKING RULES ⚡

### Allowed Links (Bidirectional)
| Thread | Can Link To |
|--------|-------------|
| **Fact Threads** | Decision Threads, Context Threads |
| **Decision Threads** | Fact Threads, Context Threads |
| **Context Threads** | Fact Threads, Decision Threads |

### Authority Rules ⚡
| Rule | Status |
|------|--------|
| **NO circular authority** | ✅ ⚡ |
| **NO hierarchy of truth** | ✅ ⚡ |

---

## VISUAL REPRESENTATION ⚡

| Property | Value |
|----------|-------|
| Display | Lines in Universe View |
| Color | by type |
| **Thickness** | **= information density** ⚡ |
| **Breaks** | **= silence intervals** ⚡ |

### Breaks = Silence Intervals ⚡
> **Visual breaks in thread lines indicate periods of silence or inactivity**

---

## SAFETY & ETHICS

| Rule | Status |
|------|--------|
| No sentiment analysis | ✅ |
| No persuasion layers | ✅ |
| No "best path" detection | ✅ |
| Full transparency | ✅ |
| User-controlled visibility | ✅ |

---

## WHY 3 THREADS

| Thread | Shows |
|--------|-------|
| **FACT** | what exists |
| **DECISION** | what changed |
| **CONTEXT** | under what conditions |

### Together
- **complete understanding**
- **without manipulation**
- **without bias**

---

**END — FOUNDATION LOCKED**
