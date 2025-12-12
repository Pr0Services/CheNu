# CHE·NU — KNOWLEDGE THREADS SYSTEM (HASH CHAIN)
**VERSION:** FOUNDATION v1.0  
**TYPE:** CROSS-SPHERE KNOWLEDGE / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> **Knowledge Thread =**  
> A **TRACEABLE, CONTINUOUS LINE OF INFORMATION** connecting events, decisions, artifacts, meetings, and agents **ACROSS time and spheres.**

### RULE
> **Threads CONNECT facts.**  
> **They NEVER interpret, optimize, or judge.**

---

## THREAD TYPE 1 — FACT THREAD (with hash_chain) ⚡

### Purpose
Link objective facts across spheres and time.

### Sources
- meeting events, decisions logs, documents, XR replays, agent actions

### Characteristics
| Property | Value |
|----------|-------|
| immutable | ✅ |
| append-only | ✅ |
| **cryptographically linked** | ✅ ⚡ |
| exact source reference | ✅ |

### JSON Model (with hash_chain) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "fact",
    "entries": [
      {
        "source_type": "meeting|replay|artifact|decision",
        "source_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr|..."
      }
    ],
    "hash_chain": ["sha256","sha256"],
    "visibility": "private|shared|public"
  }
}
```

### Hash Chain ⚡
> **`hash_chain`** — Array of cryptographic hashes linking entries  
> Creates immutable, verifiable chain of facts

---

## THREAD TYPE 2 — CONTEXT THREAD (with objective + environment) ⚡

### Purpose
Preserve WHY something happened **WITHOUT adding interpretation.**

### Sources
- meeting metadata, agenda objectives, declared constraints, environment state

### Characteristics
| Property | Value |
|----------|-------|
| descriptive only | ✅ |
| no success/failure | ✅ |
| no inferred intention | ✅ |

### JSON Model (with objective + environment)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "context",
    "context_nodes": [
      {
        "meeting_id": "uuid",
        "objective": "string",
        "constraints": ["time","budget","scope"],
        "participants": ["user","agent"],
        "environment": "xr|2d|hybrid"
      }
    ],
    "visibility": "private|shared"
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `objective` | Declared meeting objective |
| `environment` | xr / 2d / hybrid |

---

## THREAD TYPE 3 — EVOLUTION THREAD (with before/after) ⚡

### Purpose
Track HOW structures changed over time (decisions, navigation paths, avatar states).

### Sources
- decision sequences, avatar evolution states, navigation profile changes, architectural plan versions

### Characteristics
| Property | Value |
|----------|-------|
| state transitions only | ✅ |
| no evaluation labels | ✅ |
| reversible inspection | ✅ |

### JSON Model (with before/after hashes)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "evolution",
    "states": [
      {
        "state_id": "uuid",
        "changed_object": "decision|avatar|plan|profile",
        "before": "hash",
        "after": "hash",
        "timestamp": 1712345678
      }
    ],
    "visibility": "private|shared"
  }
}
```

### Evolution Fields ⚡
| Field | Description |
|-------|-------------|
| `changed_object` | decision / avatar / plan / profile |
| `before` | Hash before change |
| `after` | Hash after change |

---

## THREAD GRAPH STRUCTURE

### Nodes
| Type | Description |
|------|-------------|
| `fact` | Facts |
| `context` | Context |
| `evolution` | Evolution |

### Edges ⚡
| Edge | Description |
|------|-------------|
| `supports` | Supports another thread ⚡ |
| `follows` | Follows temporally |
| `explains` | Explains context ⚡ |
| `derived_from` | Created from |

### NO Edge Implies
- quality
- correctness
- priority

---

## XR & UNIVERSE VIEW INTEGRATION ⚡

### Thread Appearance
| View | Style |
|------|-------|
| **XR** | **luminous strands** ⚡ |
| **2D** | dotted links |
| Expansion | on demand |

### User Actions
| Action | Description |
|--------|-------------|
| isolate thread | Focus view |
| traverse forward/backward | Navigate |
| **overlay thread on replay** | XR sync ⚡ |
| export thread summary | Save |

---

## AGENTS INVOLVED (READ-ONLY)

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles threads from validated sources |
| `AGENT_THREAD_GUARD` | Enforces immutability & ethics |
| `AGENT_THREAD_EXPLAINER` | Renders human-readable summary, **NO interpretation** |

---

## ETHICAL CONSTRAINTS

| Constraint | Status |
|------------|--------|
| No narrative shaping | ✅ |
| No ranking or scoring | ✅ |
| No emotional framing | ✅ |
| Full source transparency | ✅ |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **continuity without bias**
- **memory without rewriting**
- **understanding without persuasion**

---

**END — FOUNDATION FREEZE**
