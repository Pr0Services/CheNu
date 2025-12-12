# CHE·NU — KNOWLEDGE THREADS SYSTEM (EVOLUTION VERSIONS)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## GLOBAL PURPOSE

> **Knowledge Threads create CONTINUITY OF KNOWLEDGE**  
> across time, spheres, meetings, users, and agents.

### RULE
> **A Knowledge Thread = LINKED FACTUAL CONTEXT**  
> NOT opinion, NOT decision, NOT recommendation.

---

## THREAD TYPES (THE 3 THREADS)

| Type | Default |
|------|---------|
| FACT THREAD | READ-ONLY |
| CONTEXT THREAD | READ-ONLY |
| EVOLUTION THREAD | READ-ONLY |

> **All threads are READ-ONLY by default.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Connect factual elements across the system.

### Sources
- collective_memory entries
- artifacts
- decisions logs
- validated agent actions

### What it links
- "same fact referenced multiple times"
- "same artifact used in different meetings"
- "same decision appearing across contexts"

### Characteristics
| Property | Value |
|----------|-------|
| immutable | ✅ |
| timestamped | ✅ |
| source-backed | ✅ |
| hash-verified | ✅ |

### JSON Model (with created_from)

```json
{
  "fact_thread": {
    "id": "uuid",
    "nodes": ["memory_id_1","memory_id_2"],
    "sphere_scope": ["business","scholar"],
    "created_from": "collective_memory",
    "integrity": "verified",
    "visibility": "per-scope"
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `created_from` | Source type (collective_memory, artifact, etc.) |
| `integrity` | verified / pending |

---

## THREAD TYPE 2 — CONTEXT THREAD

### Purpose
Preserve WHY and WHERE information appeared, without interpreting it.

### Sources
- meetings, XR replays, participants lists, timelines, environment state

### What it links
- same topic discussed in different contexts
- same participants across spheres
- same artifact under different constraints

### Characteristics
| Property | Value |
|----------|-------|
| descriptive only | ✅ |
| environment-aware | ✅ |
| no inference | ✅ |
| optional anonymization | ✅ |

### JSON Model

```json
{
  "context_thread": {
    "id": "uuid",
    "topic": "string",
    "contexts": [
      { "meeting_id": "uuid", "sphere": "xr", "timestamp": 1712345678 }
    ],
    "participants": ["user|agent"],
    "visibility": "private|shared"
  }
}
```

---

## THREAD TYPE 3 — EVOLUTION THREAD (Enhanced)

### Purpose
Show HOW something changed over time **WITHOUT judging the change.**

### Sources
- successive decisions
- document revisions
- meeting sequences
- avatar evolution states
- system configuration changes

### What it links
- version → version
- before → after
- **divergence & convergence**

### Characteristics
| Property | Value |
|----------|-------|
| temporal ordering only | ✅ |
| no "improvement" labels | ❌ |
| supports comparison & replay | ✅ |

### JSON Model (with versions + branching) ⚡

```json
{
  "evolution_thread": {
    "id": "uuid",
    "subject": "decision|document|config|avatar",
    "versions": [
      { "ref": "id_v1", "timestamp": 1700000000 },
      { "ref": "id_v2", "timestamp": 1800000000 }
    ],
    "branching": true
  }
}
```

### Subject Types ⚡

| Subject | Description |
|---------|-------------|
| `decision` | Decision evolution |
| `document` | Document revisions |
| `config` | System configuration |
| `avatar` | Avatar state changes |

### Branching
> When `branching: true`, divergence & convergence paths are allowed.

---

## THREAD GRAPH INTEGRATION

Threads form a **GRAPH** over:
- universe view nodes
- collective memory nodes
- XR meetings
- artifacts

> **Threads NEVER replace data. They only CONNECT it.**

---

## THREAD VISUALIZATION MODES (5) ⚡

| Mode | Description |
|------|-------------|
| **inline highlights** | subtle |
| **expandable thread panel** | detailed view |
| **XR floating thread lines** | spatial |
| **timeline ribbon** | temporal |
| **comparative overlay** | read-only comparison |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Detects linkable facts, suggests thread creation, **no auto-creation** |
| `AGENT_THREAD_GUARD` | Ensures non-manipulation, validates sources, enforces scope limits |
| `AGENT_THREAD_EXPLAINER` | Human-readable summaries, **no conclusions** |

---

## SAFETY & ETHICS

| Rule | Status |
|------|--------|
| no hidden linking | ✅ |
| no weighting or ranking | ✅ |
| no narrative shaping | ✅ |
| always show sources | ✅ |
| **full opt-out per user** | ✅ |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **continuity without control**
- **memory without bias**
- **learning without indoctrination**
- **collaboration without distortion**

---

**END — KNOWLEDGE THREADS FREEZE**
