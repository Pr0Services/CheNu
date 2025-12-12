# CHE·NU — KNOWLEDGE THREADS SYSTEM (THREAD EDGES)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / IMMUTABLE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE LINE OF FACT** connecting information across time, spheres, meetings, agents, and users.

### RULE
> **Threads RECORD knowledge.**  
> **They DO NOT interpret, rank, or conclude.**

---

## THE 3 KNOWLEDGE THREAD TYPES

1. FACT THREAD
2. DECISION THREAD
3. CONTEXT THREAD

---

## 1) FACT THREAD (with EDGES) ⚡

### Purpose
Track **VERIFIED INFORMATION** as it appears, reappears, evolves, or is referenced.

### Used For
- data reuse, cross-meeting continuity, long-term reference

### Sources
- documents, notes, artifacts, recordings (XR or not)

### Rules
- append-only, source-anchored, no semantic enrichment, no inferred meaning

### Node Fields
- fact_id, timestamp, source (meeting/doc/agent), sphere, hash

### Fact Thread EDGES ⚡
| Edge | Description |
|------|-------------|
| `referenced_by` | Referenced by another fact |
| `repeated_in` | Repeated in another context |
| `updated_by` | Updated by newer version |

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "nodes": [
      {
        "fact_id": "uuid",
        "source": "artifact|meeting|doc",
        "timestamp": 1712345678,
        "sphere": "business|scholar|...",
        "hash": "sha256"
      }
    ]
  }
}
```

---

## 2) DECISION THREAD (with EDGES) ⚡

### Purpose
Track **WHEN decisions were made, WHAT they were based on, and HOW they evolved.**

### Used For
- accountability, audit, replay comparison

### Rules
- decisions are declarative
- no outcome labeling
- no success/failure flag
- reason = referenced facts only

### Decision Thread EDGES ⚡
| Edge | Description |
|------|-------------|
| `informed_by` | Informed by fact |
| `followed_by` | Followed by decision |
| `reconsidered_in` | Reconsidered later |

### JSON Model

```json
{
  "decision_thread": {
    "id": "uuid",
    "decisions": [
      {
        "decision_id": "uuid",
        "timestamp": 1712345678,
        "based_on": ["fact_id"],
        "meeting_id": "uuid",
        "sphere": "institution|business|..."
      }
    ]
  }
}
```

---

## 3) CONTEXT THREAD (with environment + artifacts_visible + silence) ⚡

### Purpose
Preserve **UNDERSTANDING CONTEXT** without rewriting facts or decisions.

> **Context ≠ opinion**  
> **Context = conditions present at the time.**

### Used For
- XR replays, silent review, historical clarity

### Context Elements
- participants, environment (physical/XR), artifacts available, constraints, silence periods

### JSON Model (with environment + artifacts_visible + silence) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "contexts": [
      {
        "timestamp": 1712345678,
        "participants": ["user","agent"],
        "environment": "xr|2d|hybrid",
        "artifacts_visible": ["id"],
        "constraints": ["time","scope"],
        "silence": true
      }
    ]
  }
}
```

### Context Fields ⚡
| Field | Values |
|-------|--------|
| `environment` | xr / 2d / hybrid |
| `artifacts_visible` | Array of artifact IDs |
| `silence` | true / false |

---

## THREAD INTERCONNECTION RULES ⚡

### Thread Links (Semantic) ⚡
| From | To | Link Type |
|------|----|-----------|
| **fact** | decision | `informed_by` |
| **decision** | context | `occurred_in` |
| **context** | fact | `available_at_time` |

### Rules
- Fact Threads may feed Decision Threads
- Context Threads FRAME both
- Threads NEVER rewrite each other
- All links are explicit

---

## UNIVERSE VIEW INTEGRATION ⚡

| Property | Value |
|----------|-------|
| Display | subtle lines |
| Layers | toggleable |
| Time | filtered overlays |
| **Default state** | **OFF** ⚡ |
| Activation | **User must enable visibility** ⚡ |

---

## SECURITY & ETHICS

| Rule | Status |
|------|--------|
| No opinion scoring | ✅ |
| No "best path" | ✅ |
| No predictive labeling | ✅ |
| Full traceability | ✅ |
| User retains control | ✅ |

---

## WHY KNOWLEDGE THREADS MATTER

They ensure:
- **continuity without bias**
- **memory without manipulation**
- **history without rewriting**
- **intelligence without authority**

---

**END — FOUNDATION FREEZE**
