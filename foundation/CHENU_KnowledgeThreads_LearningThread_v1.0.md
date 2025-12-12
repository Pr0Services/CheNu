# CHE·NU — KNOWLEDGE THREADS SYSTEM (LEARNING THREAD)
**VERSION:** FOUNDATION v1.6  
**MODE:** NON-MANIPULATIVE / CROSS-SPHERE / FREEZE-READY

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **CONTINUOUS TRACE** of related knowledge across:
> meetings, decisions, artifacts, agents, users, time, spheres

### RULE
> **Threads LINK facts.**  
> **They NEVER conclude, rank, or persuade.**

---

## THE 3 KNOWLEDGE THREAD TYPES

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Track objective continuity of facts, decisions, and artifacts.

### Used For
- audits, verification, historical clarity, institutional memory

### Content
- decisions, documents, data artifacts, timestamps, source meetings

### PROHIBITED
- opinion, success metrics, inferred intent

### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "type": "fact",
    "title": "string",
    "nodes": [
      {
        "source": "meeting|replay|artifact|decision",
        "ref_id": "uuid",
        "timestamp": 1712345678
      }
    ],
    "visibility": "private|shared|public",
    "immutable": true
  }
}
```

---

## THREAD TYPE 2 — CONTEXT THREAD (with contextual_links)

### Purpose
Provide situational understanding across time and domains **WITHOUT rewriting facts.**

### Used For
- onboarding, cross-sphere understanding, review & recall, replay navigation

### Content
- meeting summaries (verbatim), sphere transitions, participant sets, environment changes

### RULE
> Context Threads may summarize, but **MUST reference underlying facts.**

### JSON Model (with contextual_links) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "context",
    "references": ["fact_thread_id"],
    "contextual_links": [
      {
        "reason": "sphere_transition|time_gap|team_change",
        "ref_id": "uuid"
      }
    ],
    "visibility": "private|shared"
  }
}
```

### Contextual Link Reasons ⚡
| Reason | Description |
|--------|-------------|
| `sphere_transition` | Moving between spheres |
| `time_gap` | Significant time gap |
| `team_change` | Team composition changed |

---

## THREAD TYPE 3 — LEARNING THREAD ⚡ UNIQUE

### Purpose
Capture evolution of understanding, hypotheses, and methodology **WITHOUT asserting truth.**

### Used For
- R&D, education, methodology refinement, agent learning boundaries

### RULE
> **Learning Threads are EXPLICITLY NON-AUTHORITATIVE.**

### Content
- hypotheses, experiments, discarded paths, unanswered questions

### JSON Model (with status + confidence)

```json
{
  "thread": {
    "id": "uuid",
    "type": "learning",
    "linked_facts": ["fact_thread_id"],
    "entries": [
      {
        "note": "string",
        "status": "active|discarded|paused",
        "timestamp": 1712345678
      }
    ],
    "visibility": "private|shared",
    "confidence": "user_defined_only"
  }
}
```

### Entry Status ⚡
| Status | Description |
|--------|-------------|
| `active` | Currently being explored |
| `discarded` | Abandoned hypothesis |
| `paused` | On hold |

### Confidence ⚡
> **`user_defined_only`** — System never assigns confidence, only user can

---

## THREAD INTERACTIONS

| Rule | Status |
|------|--------|
| Fact Threads anchor everything | ✅ |
| Context Threads reference Fact Threads | ✅ |
| Learning Threads link but NEVER overwrite Fact Threads | ✅ |

### THREAD COLLISION RULE ⚡

> **If learning contradicts fact → learning marked "conflict"**  
> **Fact remains untouched.**

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles threads from validated sources, **no synthesis** |
| `AGENT_THREAD_LINKER` | Suggests links between threads, **requires user approval** |
| `AGENT_THREAD_GUARD` | Enforces immutability rules, **blocks narrative drift** |
| `AGENT_THREAD_EXPLAINER` | Explains thread structure in plain language, **no interpretation** |

---

## UNIVERSE VIEW INTEGRATION

### Thread Rendering
| Property | Value |
|----------|-------|
| Thickness | = reference count |
| Rendering | soft lines |

### Color by Type ⚡
| Type | Color |
|------|-------|
| **Fact** | white |
| **Context** | blue |
| **Learning** | amber ⚡ |

### User Actions
- follow thread
- zoom through time
- jump to source meeting
- isolate thread

---

## XR VISUALIZATION ⚡

### XR Thread Mode
| Feature | Description |
|---------|-------------|
| threads float between nodes | 3D visualization |
| selectable without entering meetings | Quick access |
| timeline braiding supported | Multi-timeline |
| **no animated persuasion** | Non-manipulative |

---

## SAFETY & ETHICS

| Rule | Status |
|------|--------|
| No auto-merging | ✅ |
| No ranking | ✅ |
| No authority delegation | ✅ |
| Full traceability | ✅ |
| One-click source access | ✅ |

---

## WHY KNOWLEDGE THREADS MATTER

### They Prevent
- manipulation
- revisionism
- narrative takeover

### They Enable
- clarity
- continuity
- responsibility
- **shared truth without control**

---

**END — KNOWLEDGE THREADS**
