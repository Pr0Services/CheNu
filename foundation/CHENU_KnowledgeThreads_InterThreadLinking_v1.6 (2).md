# CHE·NU — KNOWLEDGE THREAD SYSTEM (INTER-THREAD LINKING)
**VERSION:** FOUNDATION v1.6  
**MODE:** CROSS-SPHERE INTELLIGENCE / NON-MANIPULATIVE

---

## CORE DEFINITION

> **Knowledge Thread = A CONTINUOUS, TRACEABLE LINE**  
> of information across time, spheres, meetings, agents.

### RULE
> **Threads CONNECT facts.**  
> **They NEVER conclude.**  
> **They NEVER rank truth.**

---

## THE 3 KNOWLEDGE THREAD TYPES

1. **FACT THREAD**
2. **DECISION THREAD**
3. **CONTEXT THREAD**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Track factual elements across meetings & artifacts.

### Connects
- documents
- data points
- visual artifacts
- notes
- references

### Rules
- append-only
- immutable once validated
- source-referenced only
- no inference allowed

### Example Flow
```
Document A → Chart B → Replay Frame C → Note D
```

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "topic": "string",
    "nodes": [
      { "type": "document", "id": "doc_id" },
      { "type": "artifact", "id": "artifact_id" },
      { "type": "replay_frame", "id": "frame_id" }
    ],
    "created_at": "...",
    "hash": "sha256"
  }
}
```

---

## THREAD TYPE 2 — DECISION THREAD

### Purpose
Track HOW and WHEN a decision emerged, **without evaluating if it was good or bad.**

### Connects
- meetings
- discussion phases
- decision declarations
- follow-up meetings

### Rules
- decision = timestamped statement
- alternatives remain visible
- no outcome validation

### Example Flow
```
Meeting A → Debate → Decision X → Review Meeting B
```

### JSON Model

```json
{
  "decision_thread": {
    "id": "uuid",
    "subject": "string",
    "path": [
      { "type": "meeting", "id": "uuid" },
      { "type": "decision", "id": "uuid", "timestamp": "..." },
      { "type": "review", "id": "uuid" }
    ],
    "hash": "sha256"
  }
}
```

---

## THREAD TYPE 3 — CONTEXT THREAD

### Purpose
Preserve WHY information existed in a given moment.

### Connects
- sphere
- participants
- environment (XR preset)
- timeline state

### Rules
- descriptive only
- no interpretation
- allows future rereading of context

### Example Flow
```
Business Sphere → XR Analysis Room → 5 Participants → Q3 Phase
```

### JSON Model

```json
{
  "context_thread": {
    "id": "uuid",
    "sphere": "business|scholar|xr|...",
    "participants": ["user","agent"],
    "environment": "xr_preset_id",
    "time_window": { "start": "...", "end": "..." },
    "hash": "sha256"
  }
}
```

---

## THREAD LINKING (INTER-THREAD)

### Allowed Links

```
┌─────────────────┐
│ CONTEXT_THREAD  │
│                 │
│    ↕      ↕     │
│                 │
│ FACT ↔ DECISION │
│                 │
└─────────────────┘
```

| Link | Status |
|------|--------|
| fact_thread ↔ decision_thread | ✅ Allowed |
| context_thread ↔ fact_thread | ✅ Allowed |
| context_thread ↔ decision_thread | ✅ Allowed |

### Forbidden

| Action | Status |
|--------|--------|
| Thread ranking | ❌ |
| Thread merging without approval | ❌ |
| Hidden links | ❌ |

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

### Visual Properties

| Element | Representation |
|---------|----------------|
| Threads | **luminous paths** |
| Colors | coded by thread type |
| Thickness | = node count (NOT importance) |
| Hover | reveals source list |
| Toggle | per thread type |

### Visual Style
```
───○───○───○───  (Fact Thread - solid luminous)
━━━●━━━●━━━●━━━  (Decision Thread - bold luminous)
···◦···◦···◦···  (Context Thread - soft glow)
```

---

## THREAD GOVERNANCE AGENTS

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Proposes thread creation, **no auto-publish** |
| `AGENT_THREAD_VALIDATOR` | Checks sources & integrity |
| `AGENT_THREAD_GUARD` | Ensures no inference or bias |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **continuity without dogma**
- **memory without distortion**
- **intelligence without control**

---

**END — FREEZE READY**
