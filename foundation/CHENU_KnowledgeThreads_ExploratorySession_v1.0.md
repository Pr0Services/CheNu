# CHE·NU — KNOWLEDGE THREADS SYSTEM (EXPLORATORY + SESSION)
**VERSION:** FOUNDATION v1.0  
**MODE:** NON-MANIPULATIVE / TRACEABLE / FREEZE-READY

---

## GLOBAL PRINCIPLES

> **Knowledge Threads connect INFORMATION,**  
> **NOT conclusions, NOT opinions.**

### Rules
- Threads reveal relationships
- Threads never recommend actions
- Threads never prioritize truth
- Threads never hide alternatives

> **One reality → many visible paths.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Link verifiable facts, artifacts, and events across time, meetings, spheres, and agents.

### Definition
> A FACTUAL THREAD is built **ONLY from validated, immutable sources.**

### Sources
- XR replays, signed artifacts, decision logs, timestamps, agent actions (trace only)

### Node Types ⚡
| Node Type | Description |
|-----------|-------------|
| `FACT_EVENT` | Verified event |
| `FACT_ARTIFACT` | Signed artifact |
| `FACT_DECISION` | Logged decision |
| `FACT_CONTEXT` | Factual context |

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| source-linked | ✅ |
| cryptographically hashed | ✅ |
| no inferred meaning | ✅ |
| no sentiment | ✅ |

### JSON Model

```json
{
  "knowledge_thread": {
    "type": "factual",
    "nodes": ["memory_entry_ids"],
    "created_from": ["replay_ids"],
    "scope": "personal|shared|public",
    "hash": "sha256"
  }
}
```

---

## THREAD TYPE 2 — CONTEXTUAL THREAD

### Purpose
Reveal HOW and WHERE information occurred, **without asserting WHY.**

### Definition
> A CONTEXTUAL THREAD shows relationships between events, users, agents, spheres, and timelines.

### Sources
- meeting metadata, sphere context, participant sets, temporal proximity, artifact co-presence

### Node Types ⚡
| Node Type | Description |
|-----------|-------------|
| `CONTEXT_MEETING` | Meeting context |
| `CONTEXT_SPHERE` | Sphere context |
| `CONTEXT_AGENT` | Agent context |
| `CONTEXT_TIME_RANGE` | Time range |

### Rules
| Rule | Status |
|------|--------|
| observational only | ✅ |
| reversible | ✅ |
| filterable | ✅ |
| user-toggleable | ✅ |
| **no dominance or weighting** | ✅ ⚡ |

### JSON Model (with user_toggle + visibility soft)

```json
{
  "knowledge_thread": {
    "type": "contextual",
    "links": [
      { "from": "node_id", "to": "node_id", "reason": "co-presence" }
    ],
    "visibility": "soft",
    "user_toggle": true
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `visibility: "soft"` | Subtle, non-intrusive |
| `user_toggle` | User can show/hide |

---

## THREAD TYPE 3 — EXPLORATORY THREAD ⚡ UNIQUE

### Purpose
Allow users to **EXPLORE information paths** without altering the system or memory.

### Definition
> An EXPLORATORY THREAD is **temporary, user-scoped, and non-persistent unless saved.**

### Sources
- user navigation, manual linking, temporary highlights, hypothesis tracking (labelled as such)

### Rules
| Rule | Status |
|------|--------|
| **never auto-saved** | ✅ ⚡ |
| clearly marked as exploratory | ✅ |
| **never merged into factual memory** | ✅ ⚡ |
| user-owned only | ✅ |

### JSON Model (with session_scoped + save_required)

```json
{
  "knowledge_thread": {
    "type": "exploratory",
    "owner": "user_id",
    "nodes": ["node_ids"],
    "session_scoped": true,
    "save_required": true
  }
}
```

### Unique Fields ⚡
| Field | Description |
|-------|-------------|
| `session_scoped` | Only exists during session |
| `save_required` | Must explicitly save to persist |

---

## THREAD VISUALIZATION RULES ⚡

| Thread Type | Line Style | Color | Behavior |
|-------------|------------|-------|----------|
| **FACTUAL** | solid | neutral | fixed position |
| **CONTEXTUAL** | dotted | soft | collapsible |
| **EXPLORATORY** | dashed | user color | **fades on session end** ⚡ |

---

## INTERACTION MODES

| Mode | Description |
|------|-------------|
| toggle thread visibility | Show/hide |
| isolate single thread | Focus view |
| compare threads | read-only |
| export | **factual only** |
| bookmark | user-owned |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles factual threads, **validation only** |
| `AGENT_CONTEXT_LINKER` | Creates contextual links, **explainable output** |
| `AGENT_EXPLORATION_ASSISTANT` | **Assists user linking, never persists data** ⚡ |
| `AGENT_THREAD_GUARD` | Prevents cross-contamination, **enforces thread rules** |

### AGENT_EXPLORATION_ASSISTANT ⚡ NEW
> **"Assists user linking, never persists data"**
- Helps with exploration
- Temporary suggestions only
- User must save to persist

---

## WHY 3 THREADS

| Thread | Purpose |
|--------|---------|
| **FACTUAL** | truth anchor |
| **CONTEXTUAL** | understanding |
| **EXPLORATORY** | freedom |

> **No collapse. No manipulation. No authority.**

---

**END — KNOWLEDGE THREADS FREEZE**
