# CHE·NU — KNOWLEDGE THREAD SYSTEM (SILENCE THREAD)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / TRUTH-PRESERVING / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE, NON-INTERPRETATIVE** link between facts, events, artifacts, decisions, and silence, across time, spheres, users, and agents.

### RULE
> **Threads CONNECT information.**  
> **They NEVER conclude, rank, or persuade.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Link objective facts across meetings, spheres, and replays.

### Definition
> A sequence of verified events that occurred.

### Sources
- XR replays (validated), meeting timestamps, shared artifacts, agent actions (logged only), explicit decisions

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| chronological order | ✅ |
| immutable after validation | ✅ |
| hash anchored to source | ✅ |

### NO
- sentiment, analysis, success markers

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "entries": [
      {
        "type": "event|artifact|decision",
        "source_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr|...",
        "hash": "sha256"
      }
    ],
    "integrity": "verified"
  }
}
```

---

## THREAD TYPE 2 — CONTEXT THREAD (with participants_roles) ⚡

### Purpose
Preserve WHY something existed, **without interpreting intent or value.**

### Definition
> A contextual layer explaining environment, constraints, participants, and scope at the time.

### Elements
- meeting type, domain constraints, participants (roles only), system state, available alternatives at the time

### Rules
| Rule | Status |
|------|--------|
| descriptive only | ✅ |
| no outcome judgment | ✅ |
| no hindsight optimization | ✅ |

### JSON Model (with participants_roles) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "context": {
      "meeting_type": "analysis|decision|creative",
      "sphere": "business|scholar|...",
      "participants_roles": ["user","agent","observer"],
      "constraints": ["time","scope","resources"]
    },
    "linked_fact_thread": "uuid"
  }
}
```

### Participant Roles ⚡
| Role | Description |
|------|-------------|
| `user` | Human participant |
| `agent` | AI agent |
| `observer` | Non-active participant |

---

## THREAD TYPE 3 — SILENCE THREAD ⚡ UNIQUE

### Purpose
Capture what **DID NOT happen**, where action was possible.

### Definition
> Periods of non-action during availability windows.

### Sources
- unanswered prompts
- deferred decisions
- agent inactivity
- user pauses
- rejected or ignored options

### SILENCE INTERPRETATION RULES ⚡

| Statement | Status |
|-----------|--------|
| **silence ≠ failure** | ✅ ⚡ |
| **silence ≠ error** | ✅ ⚡ |
| **silence ≠ intent** | ✅ ⚡ |

> **Silence = INFORMATION ONLY.**

### JSON Model (with intervals + context) ⚡

```json
{
  "silence_thread": {
    "id": "uuid",
    "intervals": [
      {
        "start": 1712345000,
        "end": 1712345600,
        "context": "decision_window",
        "linked_fact_thread": "uuid"
      }
    ]
  }
}
```

### Silence Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `intervals` | Array of silence periods |
| `start` | Start timestamp |
| `end` | End timestamp |
| `context` | Context type (decision_window, etc.) |

---

## THREAD INTERCONNECTION

### Allowed Links
- Fact ↔ Context
- Fact ↔ Silence
- Context ↔ Silence

### BUT
- No merging into conclusions
- No auto-summarization
- No scoring

---

## THREAD VISUALIZATION (UNIVERSE VIEW) ⚡

| Thread | Style |
|--------|-------|
| **FACT THREAD** | solid line, neutral color |
| **CONTEXT THREAD** | dotted line, muted color |
| **SILENCE THREAD** | **dashed line, low opacity** ⚡ |

> **Toggleable per user.**

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_COLLECTOR` | Gathers eligible entries |
| `AGENT_THREAD_VALIDATOR` | Verifies integrity |
| `AGENT_THREAD_RENDERER` | Displays threads, **never interprets meaning** |
| `AGENT_THREAD_GUARD` | Ensures no semantic drift, **blocks inference injection** |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **truth without narrative**
- **memory without bias**
- **insight without control**
- **history without rewriting**

---

**END — FOUNDATION FREEZE**
