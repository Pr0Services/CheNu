# CHE·NU — KNOWLEDGE THREADS SYSTEM (INQUIRY THREAD)
**VERSION:** FOUNDATION v1.0  
**TYPE:** CROSS-SPHERE / NON-MANIPULATIVE / TRACEABLE

---

## CORE DEFINITION

> A Knowledge Thread is a **TRACEABLE LINK** between information, actions, decisions, and outcomes across time, meetings, agents, and spheres.

### RULE
> **Threads CONNECT facts.**  
> **They do NOT interpret, judge, or prioritize truth.**

---

## THE 3 KNOWLEDGE THREAD TYPES

---

## 1) FACT THREAD

### Purpose
Link concrete, verifiable elements.

### Sources
- documents, data artifacts, decisions, meeting timestamps, replay frames

### Characteristics
| Property | Value |
|----------|-------|
| immutable | ✅ |
| append-only | ✅ |
| cryptographically verifiable | ✅ |
| source-bound | ✅ |

### Use Cases
- audit, accountability, replay navigation, institutional memory

### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "type": "fact",
    "nodes": ["artifact_id","decision_id","meeting_id"],
    "created_from": "xr_replay_id",
    "visibility": "private|shared|institutional",
    "hash": "sha256"
  }
}
```

---

## 2) CONTEXT THREAD (with signals + user_confirmed) ⚡

### Purpose
Link situations **WITHOUT asserting causality.**

### Sources
- same participants, same topic, temporal proximity, shared sphere, same agent group

### Characteristics
| Property | Value |
|----------|-------|
| soft links | ✅ |
| optional visibility | ✅ |
| user-filterable | ✅ |
| **never auto-promoted to fact** | ✅ ⚡ |

### Use Cases
- orientation, exploration, navigation hints, universe clustering

### JSON Model (with signals + user_confirmed) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "context",
    "signals": ["topic","time","sphere","participants"],
    "confidence": 0.75,
    "user_confirmed": false,
    "visibility": "personal|shared"
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `signals` | What created this context link |
| `confidence` | 0.0-1.0 confidence score |
| `user_confirmed` | User explicitly confirmed (true/false) |

### Signal Types ⚡
| Signal | Description |
|--------|-------------|
| `topic` | Same topic |
| `time` | Temporal proximity |
| `sphere` | Shared sphere |
| `participants` | Same participants |

---

## 3) INQUIRY THREAD ⚡ UNIQUE

### Purpose
Track questions, investigations, and unresolved paths.

### Sources
- explicit user questions, open decisions, flagged unknowns, paused discussions

### Characteristics
| Property | Value |
|----------|-------|
| **mutable** | ✅ ⚡ |
| closable or splittable | ✅ |
| no assumed outcome | ✅ |
| **highlights gaps** | ✅ ⚡ |

### Use Cases
- research, learning, long-term projects, ethical review

### JSON Model (with question + opened_by + status) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "inquiry",
    "question": "string",
    "opened_by": "user|agent",
    "status": "open|paused|closed",
    "linked_facts": [],
    "notes": []
  }
}
```

### Inquiry Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `question` | The question being investigated |
| `opened_by` | user or agent |
| `status` | open / paused / closed |
| `linked_facts` | References to fact threads |
| `notes` | Investigation notes |

### Status States ⚡
| Status | Description |
|--------|-------------|
| `open` | Active investigation |
| `paused` | Temporarily stopped |
| `closed` | Investigation complete |

---

## THREAD INTERACTION RULES

| Rule | Status |
|------|--------|
| Fact Threads can be referenced by any thread | ✅ |
| Context Threads can suggest Inquiry Threads | ✅ |
| **Inquiry Threads NEVER auto-generate Facts** | ✅ ⚡ |
| No thread upgrades without explicit confirmation | ✅ |

---

## THREAD VISUALIZATION (UNIVERSE VIEW) ⚡

| Type | Style |
|------|-------|
| **FACT THREAD** | solid line, fixed color, unbroken |
| **CONTEXT THREAD** | dotted line, soft glow, toggleable |
| **INQUIRY THREAD** | **open arc, question glyph, expandable nodes** ⚡ |

---

## AGENTS INVOLVED (PASSIVE)

| Agent | Role |
|-------|------|
| `AGENT_THREAD_COLLECTOR` | **Detects eligible links, no creation authority** ⚡ |
| `AGENT_THREAD_VALIDATOR` | Validates Fact Threads only |
| `AGENT_THREAD_NAVIGATOR` | Renders thread overlays, **no prioritization** |

### AGENT_THREAD_COLLECTOR ⚡ NEW
> **"Detects eligible links, no creation authority"**
- Passive detection only
- Cannot create threads
- Suggestions only

---

## ETHICAL CONSTRAINTS

| Constraint | Status |
|------------|--------|
| no narrative shaping | ✅ |
| no persuasion | ✅ |
| no suppression | ✅ |
| no ranking truth | ✅ |

> **Threads reveal connections.**  
> **Humans derive meaning.**

---

## WHY KNOWLEDGE THREADS MATTER

They create:
- **continuity without control**
- **memory without bias**
- **intelligence without dominance**

---

**END — FOUNDATION FREEZE**
