# CHE·NU — KNOWLEDGE THREADS SYSTEM (NAVIGATOR AGENT)
**VERSION:** FOUNDATION v1.0  
**MODE:** CORE KNOWLEDGE / NON-MANIPULATIVE / FREEZE-READY

---

## CORE CONCEPT

> **Knowledge Threads = STRUCTURED LINKS** between facts, events, decisions, artifacts, and time.

### They DO NOT
- ❌ infer intent
- ❌ rank truth
- ❌ impose conclusions

> **They CONNECT, they do not interpret.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Link OBJECTIVE INFORMATION across time and spheres.

### Sources
- documents, notes, artifacts, datasets, validated XR replays

### Rules
- append-only
- immutable once validated
- time-anchored

### Usage
- trace information origin
- track how facts propagate
- audit references

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "nodes": [
      { "type": "artifact", "ref": "id" },
      { "type": "document", "ref": "id" },
      { "type": "data", "ref": "id" }
    ],
    "created_at": 1712345678,
    "hash": "sha256"
  }
}
```

---

## THREAD TYPE 2 — DECISION THREAD

### Purpose
Link DECISIONS to the CONTEXT in which they occurred.

### Sources
- meeting outcomes, decision logs, approvals/refusals, XR decision markers

### Rules
- ❌ no "good/bad" judgment
- ❌ no success score
- ✅ includes silence & non-decisions

### Usage
- review why a decision existed
- compare decision paths
- enable replay comparison

### JSON Model (with inputs)

```json
{
  "decision_thread": {
    "id": "uuid",
    "decision": "text",
    "context": {
      "meeting_id": "uuid",
      "sphere": "business|scholar|xr|...",
      "participants": ["user","agent"]
    },
    "inputs": ["fact_thread_id"],
    "timestamp": 1712345678
  }
}
```

---

## THREAD TYPE 3 — CONTEXT THREAD

### Purpose
Preserve WHY a situation existed without rewriting it.

### Sources
- meeting metadata, agent presence, environmental state, domain constraints

### Rules
- ✅ descriptive only
- ❌ no inference
- ❌ no emotional labeling

### Usage
- understand surrounding conditions
- explain divergence between similar events
- **prevent hindsight bias**

### JSON Model

```json
{
  "context_thread": {
    "id": "uuid",
    "linked_items": ["fact_thread_id","decision_thread_id"],
    "environment": {
      "sphere": "string",
      "mode": "analysis|creative|review",
      "constraints": ["time","resources"]
    },
    "timestamp": 1712345678
  }
}
```

---

## THREAD GRAPH STRUCTURE

### Nodes
- facts
- decisions
- contexts

### Edges (with new types)

| Edge | Description |
|------|-------------|
| `referenced_by` | Citation |
| `resulted_in` | Outcome link |
| `occurred_with` | Concurrent |
| `followed_by` | Sequence |

### Edge Properties
- ✅ **bidirectional**
- ✅ timestamped
- ✅ visible on demand

---

## UNIVERSE VIEW INTEGRATION

| Property | Value |
|----------|-------|
| Visualization | soft lines |
| Colors | neutral |
| Thickness | = density, **NOT importance** |
| Toggle | per thread type |
| Compatibility | XR + 2D |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles threads from validated data, **no interpretation** |
| `AGENT_THREAD_GUARD` | Validates source integrity, **blocks inferred metadata** |
| `AGENT_THREAD_NAVIGATOR` | **Helps user explore threads, suggestion-only** ⚡ |

### AGENT_THREAD_NAVIGATOR ⚡ NEW
> **"Helps user explore threads, suggestion-only"**
- Passive navigation assistance
- No forced paths
- User controls exploration

---

## SAFETY & ETHICS

| Rule | Status |
|------|--------|
| No narrative synthesis | ✅ |
| No opinion injection | ✅ |
| No emotional scoring | ✅ |
| **No hidden clustering** | ✅ |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **truth without authority**
- **memory without distortion**
- **comparison without ranking**
- **clarity without control**

---

**END — FOUNDATION FREEZE**
