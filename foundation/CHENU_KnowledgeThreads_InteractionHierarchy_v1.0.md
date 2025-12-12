# CHE·NU — KNOWLEDGE THREADS SYSTEM (INTERACTION HIERARCHY)
**VERSION:** FOUNDATION v1.0  
**TYPE:** INFORMATION STRUCTURE / NON-MANIPULATIVE

---

## CORE PRINCIPLE

> **A Knowledge Thread = a TRACEABLE LINE of information**  
> connecting facts, actions, decisions, and artifacts  
> ACROSS time, meetings, spheres, and agents.

### RULE
> **Threads CONNECT information.**  
> **They NEVER interpret, judge, or conclude.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Link objective elements that occurred.

### Connects
- meetings
- timestamps
- artifacts
- agents actions
- declared decisions

### Characteristics
| Property | Status |
|----------|--------|
| immutable | ✅ |
| append-only | ✅ |
| replay-verifiable | ✅ |
| exact chronology | ✅ |

### Usage
- audits
- reviews
- compliance
- accountability

### JSON Model (with `created_from`)

```json
{
  "fact_thread": {
    "id": "uuid",
    "nodes": [
      { "type": "meeting", "id": "uuid" },
      { "type": "artifact", "id": "uuid" },
      { "type": "decision", "id": "uuid" }
    ],
    "created_from": "xr_replay",
    "hash": "sha256",
    "visibility": "restricted|shared|public"
  }
}
```

---

## THREAD TYPE 2 — CONTEXT THREAD

### Purpose
Preserve WHY information existed at that moment **WITHOUT inferring intent or emotion.**

### Connects
- sphere
- meeting purpose
- constraints
- environment
- participants list (not roles)

### Characteristics
| Property | Status |
|----------|--------|
| descriptive only | ✅ |
| no analysis | ✅ |
| optional visibility | ✅ |
| time-scoped | ✅ |

### Usage
- understanding past states
- avoiding misinterpretation
- long-term memory clarity

### JSON Model (with `linked_fact_thread`)

```json
{
  "context_thread": {
    "id": "uuid",
    "scope": "meeting|project|sphere",
    "context": {
      "sphere": "business|scholar|xr|...",
      "constraints": ["time","policy"],
      "environment": "xr_meeting_classic"
    },
    "linked_fact_thread": "uuid",
    "visibility": "private|shared"
  }
}
```

---

## THREAD TYPE 3 — EXPLORATION THREAD

### Purpose
Allow users to LINK information they explore **WITHOUT affecting truth, memory, or decisions.**

### Connects
- notes
- bookmarks
- replays
- hypotheses
- personal observations

### Characteristics
| Property | Status |
|----------|--------|
| personal by default | ✅ |
| editable | ✅ |
| detachable from facts | ✅ |
| never merged automatically | ✅ |

### Usage
- learning
- reflection
- hypothesis tracking
- preparation

### JSON Model (with `exportable`)

```json
{
  "exploration_thread": {
    "id": "uuid",
    "owner": "user_id",
    "links": [
      { "type": "replay", "id": "uuid" },
      { "type": "note", "content": "string" }
    ],
    "visibility": "private",
    "exportable": true
  }
}
```

---

## THREAD INTERACTION RULES (HIERARCHY)

```
┌─────────────────────────────────────────────────────┐
│                 EXPLORATION THREAD                   │
│            (personal, editable, detached)            │
│                        │                             │
│                   NEVER alters                       │
│                        ↓                             │
├─────────────────────────────────────────────────────┤
│                  CONTEXT THREAD                      │
│            (descriptive, time-scoped)                │
│                        │                             │
│                 MUST reference                       │
│                        ↓                             │
├─────────────────────────────────────────────────────┤
│                   FACT THREAD                        │
│            (immutable, append-only)                  │
│                   BASE TRUTH                         │
└─────────────────────────────────────────────────────┘
```

### Rules

| Rule | Description |
|------|-------------|
| ✅ Fact Threads CAN be referenced by others | Base reference |
| ✅ Context Threads MUST reference a Fact Thread | Mandatory link |
| ❌ Exploration Threads NEVER alter Fact or Context | Isolation |
| ❌ No automatic promotion between thread types | Manual only |

---

## UNIVERSE VIEW INTEGRATION

| Property | Value |
|----------|-------|
| Rendering | subtle filaments |
| Colors | coded by thread type |
| Toggle | visibility per user |
| Default | **NEVER default-visible** |

---

## WHY THIS MATTERS

| Thread | Protects |
|--------|----------|
| **Fact Threads** | TRUTH |
| **Context Threads** | MEANING |
| **Exploration Threads** | FREEDOM |

### Together
- **clarity without control**
- **memory without distortion**
- **learning without manipulation**

---

**END — THREAD SYSTEM FREEZE**
