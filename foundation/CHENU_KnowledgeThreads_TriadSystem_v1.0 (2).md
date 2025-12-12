# CHE·NU — KNOWLEDGE THREADS SYSTEM (TRIAD SYSTEM)
**VERSION:** FOUNDATION v1.0  
**MODE:** TRUNK-LEVEL / NON-MANIPULATIVE / APPEND-ONLY

---

## GLOBAL DEFINITION

> **Knowledge Thread = A persistent, traceable chain of knowledge** linking facts, decisions, artifacts, and contexts ACROSS time, meetings, agents, and spheres.

### RULE
> **Threads CONNECT information.**  
> **They DO NOT interpret, conclude, or persuade.**

---

## THREAD TYPE 1 — FACTUAL THREAD (with scope) ⚡

**ID:** `KNOWLEDGE_THREAD_FACT`

### Purpose
Track objective, verifiable elements over time.

### Contents
- events, documents, data points, meeting occurrences, timestamps

### Characteristics
| Property | Value |
|----------|-------|
| append-only | ✅ |
| immutable after validation | ✅ |
| cryptographically hashed | ✅ |
| no sentiment | ✅ |
| no priority score | ✅ |

### Use Cases
- audit trails, historical reference, compliance, research lineage

### JSON Model (with scope) ⚡

```json
{
  "fact_thread": {
    "id": "uuid",
    "title": "string",
    "scope": "single|multi-sphere",
    "entries": [
      {
        "type": "event|artifact|meeting",
        "source": "replay|document",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ],
    "visibility": "private|shared|public"
  }
}
```

### Scope Types ⚡
| Scope | Description |
|-------|-------------|
| `single` | Single sphere |
| `multi-sphere` | Across multiple spheres |

---

## THREAD TYPE 2 — DECISION THREAD (with linked_facts + immutability) ⚡

**ID:** `KNOWLEDGE_THREAD_DECISION`

### Purpose
Link decisions **WITHOUT judging quality or outcome.**

### Contents
- decision statements, context snapshot, participants (masked if needed), references to factual threads

### Characteristics
| Property | Value |
|----------|-------|
| chronological | ✅ |
| no success/failure labels | ✅ |
| no recommendation engine | ✅ |
| reversible understanding | ✅ |

### Use Cases
- reasoning transparency, post-review, learning from paths taken, XR replay comparison anchor

### JSON Model (with linked_facts + immutability) ⚡

```json
{
  "decision_thread": {
    "id": "uuid",
    "topic": "string",
    "linked_facts": ["fact_thread_id"],
    "decisions": [
      {
        "statement": "string",
        "timestamp": 1712345678,
        "context_replay": "uuid",
        "participants": ["user|agent_id"]
      }
    ],
    "immutability": "after_close"
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `linked_facts` | Array of fact_thread_id references |
| `immutability` | **"after_close"** - becomes immutable after closing |

---

## THREAD TYPE 3 — CONTEXT THREAD (with constraints + profile_snapshot) ⚡

**ID:** `KNOWLEDGE_THREAD_CONTEXT`

### Purpose
Provide situational framing **WITHOUT interpretation.**

### Contents
- sphere environment, meeting type, constraints active at the time, tools available, user navigation profile snapshot

### Characteristics
| Property | Value |
|----------|-------|
| descriptive only | ✅ |
| no inference | ✅ |
| no optimization | ✅ |
| linked to fact + decision threads | ✅ |

### Use Cases
- avoid hindsight bias, explain WHY options existed, restore historical conditions

### JSON Model (with constraints + profile_snapshot + environment) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "sphere": "business|scholar|xr|...",
    "environment": "xr_meeting|2d_review|async",
    "constraints": ["time","budget","policy"],
    "profile_snapshot": "navigation_profile_id",
    "timestamp": 1712345678
  }
}
```

### Environment Types ⚡
| Environment | Description |
|-------------|-------------|
| `xr_meeting` | XR meeting environment |
| `2d_review` | Traditional 2D review |
| `async` | Asynchronous context |

### Constraints Array ⚡
| Constraint | Description |
|------------|-------------|
| `time` | Time constraint |
| `budget` | Budget constraint |
| `policy` | Policy constraint |

### Profile Snapshot ⚡
> **`profile_snapshot`: Links to navigation_profile_id for historical context**

---

## THREAD LINKING LOGIC ⚡ TRIADS

| Layer | Thread Type |
|-------|-------------|
| **Base** | Fact Threads |
| **Reference** | Decision Threads (reference Fact Threads) |
| **Wrapper** | Context Threads (wrap both) |

### Critical Rule ⚡
> **NO thread exists alone.**  
> **Threads form TRIADS.**

---

## UNIVERSE VIEW INTEGRATION

### 2D View
| Property | Value |
|----------|-------|
| Visualization | soft lines |
| Color | by type (fact/decision/context) |
| Expansion | on demand |
| Auto-expand | **never auto-expanded** |

### XR View ⚡
| Property | Value |
|----------|-------|
| Style | **threads as spatial ribbons** ⚡ |
| Opacity | based on relevance |
| Audio | **silent by default** |

---

## AGENT PARTICIPATION (READ-ONLY)

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles threads, **no modification rights** |
| `AGENT_THREAD_VALIDATOR` | Verifies integrity, hashes entries |
| `AGENT_THREAD_NAVIGATOR` | **Highlights related threads, suggestion-only** ⚡ |

### AGENT_THREAD_NAVIGATOR ⚡ NEW
> **"Highlights related threads, suggestion-only"**

---

## ETHICAL GUARANTEES

| Guarantee | Status |
|-----------|--------|
| no narrative shaping | ✅ |
| no ranking | ✅ |
| no persuasion | ✅ |
| no hidden linkage | ✅ |
| full traceability | ✅ |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **truth without authority** ⚡
- **memory without control**
- **learning without rewriting the past**

---

**END — KNOWLEDGE THREADS FOUNDATION**
