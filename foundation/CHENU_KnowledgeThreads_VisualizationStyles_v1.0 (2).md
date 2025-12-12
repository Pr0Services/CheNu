# CHE·NU — KNOWLEDGE THREAD SYSTEM (VISUALIZATION STYLES)
**VERSION:** FOUNDATION v1.0  
**MODE:** STRUCTURAL / NON-MANIPULATIVE / FREEZE-READY

---

## GLOBAL DEFINITION

> **Knowledge Thread = A CONTINUOUS LINE OF FACTS**  
> connecting: events, decisions, artifacts, meetings, agents, time

### RULE
> **A Knowledge Thread LINKS information.**  
> **It NEVER explains, judges, or concludes.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Track WHAT happened, WHEN, WHERE, and WHO was involved.

### Source Elements
- meeting events
- decisions logs
- artifacts
- timestamps
- validated replays

### Thread Rules
| Rule | Status |
|------|--------|
| immutable | ✅ |
| append-only | ✅ |
| replay-verifiable | ✅ |
| no annotations altering meaning | ✅ |

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": [
      { "ref": "event_id", "timestamp": 1712345678 },
      { "ref": "decision_id", "timestamp": 1712349999 }
    ],
    "sphere": "business|scholar|xr|...",
    "hash": "sha256"
  }
}
```

### Visualization Style
| Property | Value |
|----------|-------|
| **Line** | straight |
| **Color** | neutral |
| **Spacing** | time-scaled |

---

## THREAD TYPE 2 — CONTEXT THREAD

### Purpose
Provide surrounding CONTEXT without modifying the factual record.

### Source Elements
- meeting metadata
- sphere type
- participant roles
- environment presets
- silence intervals

### Thread Rules
| Rule | Status |
|------|--------|
| optional layer | ✅ |
| toggleable | ✅ |
| never replaces factual thread | ✅ |
| contextual only, no inference | ✅ |

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "context",
    "linked_to": "factual_thread_id",
    "context": {
      "sphere": "business",
      "meeting_type": "decision",
      "participants": ["user","agent"],
      "environment": "xr_meeting_analysis"
    }
  }
}
```

### Visualization Style
| Property | Value |
|----------|-------|
| **Line** | dashed |
| **Effect** | soft halo |
| **Behavior** | collapsible |

---

## THREAD TYPE 3 — EXPLORATION THREAD

### Purpose
Allow users to group, bookmark, and explore related information **WITHOUT altering collective memory.**

### Source Elements
- user-selected nodes
- agent-suggested links (explainable)
- cross-sphere references

### Thread Rules
| Rule | Status |
|------|--------|
| user-owned | ✅ |
| private by default | ✅ |
| shareable optionally | ✅ |
| detachable anytime | ✅ |

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "exploration",
    "owner": "user_id",
    "nodes": ["event_id","replay_id","artifact_id"],
    "visibility": "private|shared",
    "notes": "optional"
  }
}
```

### Visualization Style
| Property | Value |
|----------|-------|
| **Line** | curved path |
| **Color** | user-selected |
| **Nodes** | interactive |

---

## VISUALIZATION STYLES SUMMARY

| Thread Type | Line | Color | Special |
|-------------|------|-------|---------|
| **Factual** | straight | neutral | time-scaled spacing |
| **Context** | dashed | soft halo | collapsible |
| **Exploration** | curved | user-selected | interactive nodes |

---

## THREAD INTERACTION RULES

| Rule | Status |
|------|--------|
| Threads never merge automatically | ✅ |
| Factual thread always primary | ✅ |
| Context thread may overlay factual | ✅ |
| **Exploration thread NEVER feeds back into factual or context layers** | ✅ |

### Feed-Back Prohibition
```
EXPLORATION ──X──→ FACTUAL
EXPLORATION ──X──→ CONTEXT
```
> Exploration is isolated - it can read but never write to truth layers.

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | Detects possible continuities, **does NOT create threads** |
| `AGENT_THREAD_EXPLAINER` | Explains why nodes relate, **human-readable only** |
| `AGENT_THREAD_GUARD` | Enforces separation, **prevents narrative drift** |

### AGENT_THREAD_INDEXER ⚡ NEW
> **"Detects possible continuities, does NOT create threads"**
- Passive detection only
- Suggestions require human approval
- No automatic thread creation

---

## WHY THREE THREADS

| Thread | Provides |
|--------|----------|
| **Factual** | TRUTH |
| **Context** | UNDERSTANDING |
| **Exploration** | FREEDOM |

### Together
> **Knowledge without control**

---

**END — FOUNDATION FREEZE**
