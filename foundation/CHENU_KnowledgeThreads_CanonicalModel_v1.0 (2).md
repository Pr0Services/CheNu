# CHE·NU — KNOWLEDGE THREADS (CANONICAL MODEL)
**VERSION:** KT.v1.0  
**MODE:** STRUCTURAL / NON-MANIPULATIVE / FREEZE-READY

---

## WHAT IS A KNOWLEDGE THREAD

> A Knowledge Thread is a **TRACEABLE LINE** of facts, artifacts, meetings, decisions, and context linking knowledge **ACROSS time and spheres.**

### RULE
> **Thread = linkage of reality**  
> **NOT narrative, NOT conclusion, NOT recommendation.**

---

## THE 3 KNOWLEDGE THREAD TYPES

---

## THREAD TYPE 1 — FACT THREAD (KT_FACT)

### Purpose
Link raw, verifiable knowledge elements.

### Sources
- meetings, replays, documents, notes, decisions (timestamped)

### Properties
| Property | Value |
|----------|-------|
| immutable | ✅ |
| append-only | ✅ |
| cryptographically hashed | ✅ |

### FACT THREAD MAY
- show sequence
- show references
- show origin

### FACT THREAD NEVER
- infer intent
- rank importance
- judge outcome

---

## THREAD TYPE 2 — CONTEXT THREAD (KT_CONTEXT)

### Purpose
Explain WHY a fact existed in a moment.

### Sources
- meeting type, sphere, participants, constraints, environmental conditions

### Properties
| Property | Value |
|----------|-------|
| optional | ✅ |
| descriptive only | ✅ |
| non-causal | ✅ |

### CONTEXT THREAD MAY
- explain surrounding conditions
- clarify relevance

### CONTEXT THREAD NEVER
- justify actions
- excuse outcomes
- recommend changes

---

## THREAD TYPE 3 — EVOLUTION THREAD (KT_EVOLUTION)

### Purpose
Track how an IDEA or TOPIC evolved over time, spheres, and meetings.

### Sources
- linked fact threads, recurring artifacts, repeated decisions, forks & merges

### Properties
| Property | Value |
|----------|-------|
| multi-branch | ✅ |
| non-linear | ✅ |
| reversible view | ✅ |

### EVOLUTION THREAD MAY
- show branches
- show convergence
- show pauses & silence

### EVOLUTION THREAD NEVER
- declare progress
- declare improvement
- assign success/failure

---

## UNIFIED THREAD MODEL (CANONICAL) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "fact|context|evolution",
    "anchors": [
      {
        "source_type": "meeting|replay|artifact|decision",
        "source_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr|..."
      }
    ],
    "links": [
      {
        "to_thread": "uuid",
        "relation": "references|follows|branches|merges"
      }
    ],
    "visibility": "private|shared|public",
    "hash": "sha256"
  }
}
```

### Anchor Fields ⚡
| Field | Description |
|-------|-------------|
| `source_type` | meeting / replay / artifact / decision |
| `source_id` | UUID reference |
| `timestamp` | When anchored |
| `sphere` | Which sphere |

### Link Relations ⚡
| Relation | Description |
|----------|-------------|
| `references` | One thread references another |
| `follows` | Temporal sequence |
| `branches` | Fork from parent |
| `merges` | Combine into one |

---

## THREAD GRAPH & VISUALIZATION

### Thread Graph
| Element | Represents |
|---------|------------|
| nodes | anchors |
| edges | temporal or conceptual links |
| clusters | sphere intersections |

### Visual Modes (4) ⚡
| Mode | Description |
|------|-------------|
| **linear timeline** | Straight sequence |
| **braided timeline** | Multi-path overlay |
| **constellation view** | Spatial cluster |
| **minimal list** | Compact text view |

---

## THREAD OPERATIONS (USER-DRIVEN)

### ✅ Allowed
| Operation | Description |
|-----------|-------------|
| open thread | View thread |
| filter anchors | Narrow scope |
| compare threads | Side-by-side |
| fork evolution view | Branch exploration |
| export (PDF / XR / graph) | Save formats |

### ❌ Forbidden
| Operation | Reason |
|-----------|--------|
| auto-thread creation without user consent | Manipulation |
| auto-merge without confirmation | Data integrity |
| hidden link generation | Transparency |

---

## THREAD ↔ MEMORY INTEGRATION

| Rule | Status |
|------|--------|
| threads reference collective memory | ✅ |
| **memory does NOT rewrite threads** | ✅ ⚡ |
| threads remain independent views | ✅ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_EXTRACTOR` | **Detects candidate anchors, suggestion-only** ⚡ |
| `AGENT_THREAD_VALIDATOR` | Checks integrity & duplicates |
| `AGENT_THREAD_VISUALIZER` | Renders views, **no interpretation** |

### AGENT_THREAD_EXTRACTOR ⚡ NEW
> **"Detects candidate anchors, suggestion-only"**
- Identifies potential thread points
- Never auto-creates
- User must approve

---

## ETHICS & SAFETY

| Rule | Status |
|------|--------|
| No narrative steering | ✅ |
| No ideological framing | ✅ |
| No scoring | ✅ |
| Full audit trail | ✅ |
| **One-click thread neutralization** | ✅ ⚡ |

### Thread Neutralization ⚡
> **One-click action to disable a thread's influence** without deleting it

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **truth persistence**
- **cross-sphere coherence**
- **shared understanding**

> **WITHOUT forcing meaning.**

---

**END — FOUNDATION FREEZE**
