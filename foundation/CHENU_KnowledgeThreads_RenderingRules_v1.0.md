# CHE·NU — KNOWLEDGE THREAD SYSTEM (RENDERING & VISIBILITY)
**VERSION:** FOUNDATION v1.0  
**MODE:** NON-MANIPULATIVE / TRACEABLE / FREEZE-READY

---

## DEFINITION

> **A Knowledge Thread is a CONTINUOUS LINE OF FACTS, ARTIFACTS, DECISIONS, AND CONTEXTS**  
> linked across time, meetings, spheres, users, and agents.

### RULE
> **Threads CONNECT information.**  
> **They DO NOT interpret or conclude.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Track **WHAT is known** and **WHEN it appeared.**

### Content
- verified statements
- documented facts
- referenced data
- approved artifacts

### Characteristics
- append-only
- time-ordered
- source-linked
- replay-verifiable

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "topic": "string",
    "entries": [
      {
        "timestamp": 1712345678,
        "source": "replay|document|agent|user",
        "content_ref": "artifact_id",
        "sphere": "business|scholar|xr|...",
        "hash": "sha256"
      }
    ]
  }
}
```

### Rendering
| Property | Value |
|----------|-------|
| Layout | linear timeline |
| Color | neutral |
| Gradients | ❌ no emphasis gradients |

---

## THREAD TYPE 2 — DECISION THREAD

### Purpose
Track **HOW and WHEN** decisions occurred, **without judging quality or outcome.**

### Content
- decision statements
- decision timestamps
- participants present
- prerequisite facts
- following consequences (facts only)

### Characteristics
- explicit declaration required
- linked to fact threads
- immutable after validation

### JSON Model

```json
{
  "decision_thread": {
    "id": "uuid",
    "topic": "string",
    "decisions": [
      {
        "decision_id": "uuid",
        "timestamp": 1712345900,
        "based_on_facts": ["fact_thread_id"],
        "participants": ["user_id","agent_id"],
        "recorded_in": "replay_id"
      }
    ]
  }
}
```

### Rendering
| Property | Value |
|----------|-------|
| Layout | vertical markers |
| Elements | decision nodes |
| Labels | ❌ no success/failure label |

---

## THREAD TYPE 3 — CONTEXT THREAD

### Purpose
Preserve **WHY and IN WHAT CONDITIONS** facts and decisions existed.

### Content
- meeting type
- sphere
- constraints
- **silence intervals**
- agent presence
- environment (XR/2D)

### Characteristics
- contextual only
- never evaluative
- always optional to view

### JSON Model

```json
{
  "context_thread": {
    "id": "uuid",
    "related_threads": ["fact_thread_id","decision_thread_id"],
    "context": {
      "sphere": "string",
      "meeting_type": "live|review|replay",
      "participants": ["ids"],
      "constraints": ["time","policy","access"],
      "silence_intervals": ["t1-t2"]
    }
  }
}
```

### Rendering
| Property | Value |
|----------|-------|
| Layout | background layer |
| Visibility | toggleable overlay |
| Dominance | low visual dominance |

---

## THREAD LINKING RULES

| Rule | Description |
|------|-------------|
| Cross-sphere | Threads may link across spheres |
| No auto-merge | No automatic merging |
| Confirmation | User confirmation required |
| Reversible | All links reversible |
| Logged | All links logged |

---

## ACCESS & VISIBILITY

| Thread Type | Default Visibility |
|-------------|-------------------|
| **Fact Threads** | shared by default (if permitted) |
| **Decision Threads** | permission-scoped |
| **Context Threads** | private by default |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles raw threads, **no interpretation** |
| `AGENT_THREAD_VALIDATOR` | Checks integrity & sources |
| `AGENT_THREAD_NAVIGATOR` | Helps locate threads, **no prioritization** |

---

## WHY 3 THREADS

| Thread | Answers |
|--------|---------|
| **FACT THREAD** | WHAT is true |
| **DECISION THREAD** | WHAT was chosen |
| **CONTEXT THREAD** | WHY it existed then |

### Together
- traceability
- accountability
- clarity
- no manipulation

---

**END — KNOWLEDGE THREAD SYSTEM**
