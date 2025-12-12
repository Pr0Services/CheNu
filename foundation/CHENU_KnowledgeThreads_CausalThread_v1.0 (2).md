# CHE·NU — KNOWLEDGE THREADS SYSTEM (CAUSAL THREAD)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / TRUTH-PRESERVING / FREEZE-READY

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE LINE OF FACTS** connecting information across time, spheres, meetings, agents, and users.

### RULE
> **Threads reveal connections. They NEVER infer meaning or conclusions.**

---

## THREAD TYPE 1 — TEMPORAL KNOWLEDGE THREAD

### Purpose
Link information across TIME.

### Use Cases
- Follow evolution of a topic
- Track decision lineage
- Observe repeated patterns
- Detect breaks or silence

### Source Signals
- meetings (XR / 2D), replays, decisions, artifacts, silence intervals, agent actions

### JSON Model (with status)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "temporal",
    "topic": "string",
    "entries": [
      {
        "ref_id": "meeting|artifact|decision",
        "timestamp": 1712345678,
        "sphere": "business|scholar|..."
      }
    ],
    "origin": "first_occurrence",
    "status": "open|paused|closed",
    "hash": "sha256"
  }
}
```

### Status Types ⚡
| Status | Description |
|--------|-------------|
| `open` | Active thread |
| `paused` | Temporarily inactive |
| `closed` | Completed/archived |

### Visualization
- timeline braid
- fade between gaps
- **silence shown as empty spans**
- no scoring, no priority

---

## THREAD TYPE 2 — CROSS-SPHERE KNOWLEDGE THREAD

### Purpose
Expose how the SAME knowledge appears in different spheres.

### Use Cases
- Business ↔ Scholar
- Creative ↔ Institution
- XR ↔ Methodology

### Source Signals
- shared topics, shared artifacts, shared agents, shared decisions

### JSON Model (with visibility levels)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "cross_sphere",
    "topic": "string",
    "links": [
      { "sphere": "business", "ref": "uuid" },
      { "sphere": "scholar", "ref": "uuid" }
    ],
    "visibility": "user|team|collective",
    "hash": "sha256"
  }
}
```

### Visibility Levels ⚡
| Level | Description |
|-------|-------------|
| `user` | Private to user |
| `team` | Shared with team |
| `collective` | Organization-wide |

### Visualization
- universe orbit bridges
- color = sphere
- **thickness = recurrence (NOT importance)**
- user can collapse / expand

---

## THREAD TYPE 3 — CAUSAL KNOWLEDGE THREAD (NON-INFERENTIAL) ⚡ UNIQUE

### Purpose
Show **declared cause–effect relationships WITHOUT inference.**

### CRITICAL RULE
> **Causality must be DECLARED, never inferred by the system.**

### Source Signals
- **explicit user declarations**
- documented decision rationale
- methodological logs
- agent explanation outputs

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "causal",
    "cause": {
      "ref_id": "decision|event",
      "declared_by": "user|agent",
      "timestamp": 1712345678
    },
    "effect": {
      "ref_id": "decision|artifact",
      "timestamp": 1712348901
    },
    "confidence": "declared",
    "hash": "sha256"
  }
}
```

### Key Fields ⚡
| Field | Description |
|-------|-------------|
| `cause.declared_by` | WHO declared the causality |
| `effect.ref_id` | What was affected |
| `confidence: "declared"` | ALWAYS "declared", never computed |

### Visualization
- **arrow links**
- explanation panel (verbatim)
- **NO probability**
- **NO optimization hints**

---

## UNIVERSAL THREAD RULES

| Rule | Status |
|------|--------|
| append-only | ✅ |
| cryptographically signed | ✅ |
| **reversible visualization** | ✅ |
| full provenance visible | ✅ |

### THREADS NEVER
- ❌ rank information
- ❌ judge correctness
- ❌ suggest actions
- ❌ hide alternatives

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | Indexes refs only |
| `AGENT_THREAD_VALIDATOR` | Verifies integrity + rules |
| `AGENT_THREAD_RENDERER` | Builds visual representation, **no interpretation** |
| `AGENT_THREAD_GUARD` | **Blocks inference attempts, audits misuse** |

---

## WHY KNOWLEDGE THREADS MATTER

### They provide
- **continuity without bias**
- **memory without distortion**
- **clarity without direction**

### They allow
- **wisdom accumulation**
- **responsibility tracking**
- **shared understanding**

> **WITHOUT control.**

---

**END — FOUNDATION FREEZE**
