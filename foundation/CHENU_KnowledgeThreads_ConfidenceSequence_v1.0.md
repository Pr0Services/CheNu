# CHE·NU — KNOWLEDGE THREADS SYSTEM (CONFIDENCE + SEQUENCE)
**VERSION:** FOUNDATION v1.0  
**TYPE:** KNOWLEDGE LINKING / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> **Knowledge Thread = A TRACEABLE LINK** between pieces of knowledge across time, spheres, meetings, agents, and users.

### RULE
> **Threads CONNECT knowledge.**  
> **They NEVER interpret, rank, or conclude.**

---

## THREAD TYPE 1 — FACTUAL THREAD (with confidence)

### Purpose
Link VERIFIED facts, artifacts, and decisions.

### Examples
- Decision → referenced document
- Meeting → produced artifact
- Replay → timeline segment

### Characteristics
| Property | Value |
|----------|-------|
| Immutable | ✅ |
| Source-verifiable | ✅ |
| Cryptographically linked | ✅ |

### JSON Model (with confidence)

```json
{
  "thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": ["artifact_id","decision_id","replay_id"],
    "created_from": "xr_replay",
    "confidence": 1.0,
    "hash": "sha256"
  }
}
```

### Confidence Score ⚡
| Value | Meaning |
|-------|---------|
| `1.0` | Fully verified, immutable |
| `0.8` | High confidence |
| `0.6` | Medium confidence |
| `< 0.5` | Low confidence, needs review |

---

## THREAD TYPE 2 — CONTEXTUAL THREAD (with time_range)

### Purpose
Preserve CONTEXT of why / when knowledge appeared, **WITHOUT interpretation or judgment.**

### Examples
- Topic continuity across meetings
- Same problem appearing in different spheres
- Agent involvement over time

### Characteristics
| Property | Value |
|----------|-------|
| Descriptive only | ✅ |
| Time-bound | ✅ |
| Non-conclusive | ✅ |

### JSON Model (with time_range + confidence)

```json
{
  "thread": {
    "id": "uuid",
    "type": "contextual",
    "context": {
      "topic": "string",
      "sphere": "business|scholar|xr|...",
      "time_range": [1712340000, 1712350000]
    },
    "linked_nodes": ["meeting_id","agent_id"],
    "confidence": 0.6
  }
}
```

### Time Range ⚡
| Field | Description |
|-------|-------------|
| `time_range[0]` | Start timestamp |
| `time_range[1]` | End timestamp |

---

## THREAD TYPE 3 — EVOLUTION THREAD (with sequence) ⚡

### Purpose
Show HOW a knowledge item evolved **without judging correctness or success.**

### Examples
- Version history of an idea
- Changes to a plan
- Iterative refinements

### Characteristics
| Property | Value |
|----------|-------|
| Ordered | ✅ |
| Transparent | ✅ |
| User-readable | ✅ |

### JSON Model (with sequence)

```json
{
  "thread": {
    "id": "uuid",
    "type": "evolution",
    "sequence": [
      { "version": 1, "source": "meeting_a" },
      { "version": 2, "source": "meeting_b" }
    ],
    "visibility": "public|private|shared"
  }
}
```

### Sequence Fields ⚡
| Field | Description |
|-------|-------------|
| `version` | Integer version number |
| `source` | Origin meeting/artifact ID |

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

| Property | Value |
|----------|-------|
| Rendering | Subtle lines |
| Color | Coded by type |
| **Thickness** | **= reference count** ⚡ |
| Toggle | Per user |

### ❌ NOT Allowed
- flashing
- ranking
- attention hijacking

---

## THREAD ACCESS RULES

| Rule | Status |
|------|--------|
| Threads inherit node permissions | ✅ |
| Private nodes stay private | ✅ |
| Cross-sphere threads require explicit consent | ✅ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_LINKER` | Detects eligible links, **never auto-confirms** |
| `AGENT_THREAD_VALIDATOR` | Checks rule compliance, verifies source integrity |
| `AGENT_THREAD_RENDERER` | Visual-only representation, **no semantic interpretation** |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **continuity**
- **traceability**
- **institutional memory**

> **WITHOUT narrative control or bias.**

---

**END — FOUNDATION FREEZE**
