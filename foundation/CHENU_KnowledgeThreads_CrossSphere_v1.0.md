# CHE·NU — KNOWLEDGE THREAD SYSTEM (CROSS-SPHERE)
**VERSION:** FOUNDATION v1.0  
**TYPE:** CROSS-SPHERE KNOWLEDGE STRUCTURE  
**MODE:** NON-MANIPULATIVE / TRACEABLE / IMMUTABLE

---

## DEFINITION (GLOBAL)

> A Knowledge Thread is a **CONTINUOUS TRACE of information** across: time, meetings, decisions, artifacts, agents, spheres.

### RULE
> **Thread = WHAT is connected**  
> **NOT WHY it is important.**

---

## THREAD TYPE #1 — FACTUAL THREAD

### Purpose
Track objective facts and verified information **WITHOUT interpretation or narrative shaping.**

### Source Types
- documents, files, metrics, logs, transcripts, timestamps

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| immutable | ✅ |
| replay-linked | ✅ |
| hash-verified | ✅ |

### Examples
- Project dates, Regulatory facts, Budget numbers, Research findings, Historical records

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": [
      {
        "source": "artifact|replay|document",
        "ref_id": "uuid",
        "timestamp": 1712345678
      }
    ],
    "visibility": "private|team|public",
    "hash": "sha256"
  }
}
```

### Visibility Types ⚡
| Visibility | Description |
|------------|-------------|
| `private` | User only |
| `team` | Team members ⚡ NEW |
| `public` | Everyone |

---

## THREAD TYPE #2 — DECISION THREAD

### Purpose
Trace HOW decisions emerged over time, **WITHOUT evaluating correctness.**

### Source Types
- meetings, decision logs, voting artifacts, declared outcomes, silence intervals

### Rules
| Rule | Status |
|------|--------|
| no success labels | ✅ |
| no scoring | ✅ |
| no optimization tags | ✅ |
| exact replay references | ✅ |

### Examples
- Strategy changes, Project pivots, Governance decisions, Conflict resolutions

### JSON Model (with context block) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "decision",
    "nodes": [
      {
        "decision_id": "uuid",
        "from_meeting": "uuid",
        "timestamp": 1712345678
      }
    ],
    "context": {
      "sphere": "business|institution|scholar",
      "participants": ["user_id","agent_id"]
    },
    "hash": "sha256"
  }
}
```

### Context Block ⚡
| Field | Description |
|-------|-------------|
| `sphere` | business / institution / scholar |
| `participants` | Array of user_id / agent_id |

---

## THREAD TYPE #3 — CONTEXT THREAD

### Purpose
Preserve **ENVIRONMENTAL CONTEXT** without subjective interpretation.

### Source Types
- meeting modes, participation levels, agent presence, data density, sphere state

### Rules
| Rule | Status |
|------|--------|
| no emotion labels | ✅ |
| no intent inference | ✅ |
| metadata only | ✅ |

### Examples
- Meeting intensity changes, Agent involvement shifts, Sphere focus transitions, Knowledge density evolution

### JSON Model (with context_type) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "context",
    "nodes": [
      {
        "context_type": "meeting|sphere|agent",
        "state": "string",
        "timestamp": 1712345678
      }
    ],
    "hash": "sha256"
  }
}
```

### Context Type Values ⚡
| Type | Description |
|------|-------------|
| `meeting` | Meeting context |
| `sphere` | Sphere context |
| `agent` | Agent context |

---

## THREAD INTERCONNECTION RULES

| Rule | Description |
|------|-------------|
| Threads may LINK but never MERGE | Links only, no merge |
| Each thread maintains its own integrity | Independent hashes |
| Cross-links are references only | Reference, not copy |
| No derived conclusions allowed | No inference |

---

## THREAD VISUALIZATION (XR / 2D) ⚡

### Visual Styles
| Thread Type | Visual Style |
|-------------|-------------|
| **FACTUAL** | straight solid line |
| **DECISION** | segmented line |
| **CONTEXT** | translucent ribbon |

### Interactions ⚡
| Interaction | Description |
|-------------|-------------|
| `follow thread` | Navigate along thread |
| `jump to node` | Jump to specific node |
| `compare two threads` | Side-by-side comparison |
| `hide/show thread types` | Toggle visibility |
| `export thread (PDF / JSON)` | Export formats |

---

## THREAD SECURITY & SAFETY

| Property | Status |
|----------|--------|
| full audit trail | ✅ |
| cryptographic hash | ✅ |
| permission-locked | ✅ |
| replay-verifiable | ✅ |
| user-controlled visibility | ✅ |

---

## EXTENSION THREADS (OPTIONAL, SAFE) ⚡

### THREAD_EXT_1 — TASK THREAD ⚡
> Tracks task creation, handoff, completion **(no performance scoring)**

### THREAD_EXT_2 — ARTIFACT EVOLUTION ⚡
> Tracks document versions and transformations

### THREAD_EXT_3 — LEARNING TRACE ⚡
> Tracks **WHAT was learned, not WHO learned better**

---

## WHY THIS SYSTEM MATTERS

### Allows
- truth continuity
- accountability
- clarity over time
- multiple perspectives on SAME facts

### WITHOUT
- manipulation
- narrative control
- historical rewriting

---

**END — FOUNDATION FREEZE**
