# CHE·NU — KNOWLEDGE THREADS SYSTEM (IMMUTABLE CORE)
**VERSION:** CORE v1.0  
**MODE:** FOUNDATION / IMMUTABLE / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE LINE of knowledge** connecting facts, events, decisions, artifacts, and contexts across time, meetings, spheres, users, and agents.

### RULE
> **Threads NEVER infer meaning.**  
> **Threads ONLY connect what EXISTS.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Link concrete, verifiable information.

### CONNECTS
- documents, data artifacts, timestamps, meeting references, decisions (as recorded)

### DOES NOT
- interpret, summarize, conclude, rate importance

### Factual Thread JSON (with edges) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": ["artifact_id","decision_id","meeting_id"],
    "edges": ["produced_in","referenced_by","followed_by"],
    "scope": "single|multi_sphere",
    "visibility": "private|shared|public",
    "hash": "sha256"
  }
}
```

### Edge Types ⚡
| Edge | Description |
|------|-------------|
| `produced_in` | Produced in context ⚡ |
| `referenced_by` | Referenced by |
| `followed_by` | Followed by |

### Use Cases
- audit trail, compliance, research traceability, decision justification

---

## THREAD TYPE 2 — CONTEXTUAL THREAD

### Purpose
Preserve the **CONTEXT** in which knowledge was produced.

### CONNECTS
- meetings, participants, sphere, temporal proximity, environment state

### DOES NOT
- infer intent, infer emotion, rewrite memory

### Contextual Thread JSON (with context block + environment + time_window) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "contextual",
    "context": {
      "sphere": "business|scholar|xr|...",
      "participants": ["user","agent"],
      "environment": "xr_meeting_classic",
      "time_window": "start_end"
    },
    "related_nodes": ["factual_thread_id"],
    "visibility": "private|shared",
    "hash": "sha256"
  }
}
```

### Context Block Fields ⚡
| Field | Description |
|-------|-------------|
| `sphere` | Which sphere |
| `participants` | Array of user/agent |
| `environment` | **"xr_meeting_classic"** ⚡ |
| `time_window` | **"start_end"** time range ⚡ |

### Related Nodes ⚡
> **`related_nodes`: Links to factual_thread_id**

### Use Cases
- understanding why something happened WHEN it did
- historical review
- replay enrichment
- institutional memory

---

## THREAD TYPE 3 — EVOLUTION THREAD

### Purpose
Track **CHANGE OVER TIME** without judgement.

### CONNECTS
- versions, revisions, alternative paths, abandoned branches, reactivated ideas

### DOES NOT
- label better/worse, suggest optimization, rank outcomes

### Evolution Thread JSON (with timeline states + linked_threads) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "evolution",
    "timeline": [
      { "state": "v1", "timestamp": 1710000000 },
      { "state": "v2", "timestamp": 1710500000 },
      { "state": "paused", "timestamp": 1710800000 }
    ],
    "linked_threads": ["factual","contextual"],
    "visibility": "private|shared",
    "hash": "sha256"
  }
}
```

### Timeline States ⚡
| State | Description |
|-------|-------------|
| `v1` | Version 1 |
| `v2` | Version 2 |
| `paused` | **Paused state** ⚡ |

### Linked Threads ⚡
```json
{
  "linked_threads": ["factual","contextual"]
}
```

### Use Cases
- learning systems, R&D, long-term projects, personal growth tracking

---

## THREAD COMPOSITION RULES

| Rule | Description |
|------|-------------|
| Threads can link to other threads | ✅ |
| Threads are append-only | ✅ |
| **No deletion (only supersession)** | ✅ ⚡ |
| Hash recalculated per update | ✅ |
| Ownership preserved | ✅ |

---

## VISUALIZATION RULES ⚡

### Visual Styles
| Thread Type | Style |
|-------------|-------|
| **Factual** | solid line |
| **Contextual** | **dotted halo** ⚡ |
| **Evolution** | **layered ribbon** ⚡ |

### Forbidden Visuals
| Forbidden | Status |
|-----------|--------|
| color coding for emotions | ❌ |
| emphasis hierarchy | ❌ |

---

## AGENTS INVOLVED (READ-ONLY) ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles threads from validated data |
| `AGENT_THREAD_VALIDATOR` | Verifies integrity + legality |
| `AGENT_THREAD_EXPLORER` | **Visual navigation only** ⚡ |

### Critical Rule ⚡
> **No agent may edit historical nodes.**

---

## ETHICAL GUARANTEES

| Guarantee | Status |
|-----------|--------|
| No narrative forcing | ✅ |
| No simplification bias | ✅ |
| No collective rewriting | ✅ |
| **Personal and collective truths coexist** | ✅ ⚡ |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **Truth without authority**
- **Memory without control**
- **Learning without distortion**

---

**END — KNOWLEDGE THREAD SYSTEM**
