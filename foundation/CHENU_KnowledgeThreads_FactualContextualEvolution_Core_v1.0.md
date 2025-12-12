# CHE·NU — KNOWLEDGE THREAD SYSTEM (FACTUAL/CONTEXTUAL/EVOLUTION)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## GLOBAL PRINCIPLE

> A Knowledge Thread connects **INFORMATION ACROSS TIME** WITHOUT interpretation, ranking, or narrative forcing.

### RULE
> **Thread = TRACE, not conclusion.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Link concrete facts, artifacts, and decisions across meetings, spheres, and time.

### Sources
- meeting artifacts, documents, decisions logs, validated XR replays, agent actions (trace only)

### Properties ⚡
| Property | Status |
|----------|--------|
| append-only | ✅ |
| immutable once validated | ✅ |
| cryptographically hashed | ✅ |
| **reference-based (never duplicated)** | ✅ ⚡ |

### Examples ⚡
- a policy discussed across 4 meetings
- a design decision reused in multiple domains
- a document revised over time

### Factual Thread JSON (with references + timeline) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "references": ["artifact_id","decision_id","replay_id"],
    "timeline": [ { "timestamp": 1712345678, "source": "meeting_id" } ],
    "hash": "sha256"
  }
}
```

### Factual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `references` | **["artifact_id","decision_id","replay_id"]** ⚡ |
| `timeline` | **Array of {timestamp, source}** ⚡ |
| `timeline[].source` | **meeting_id** ⚡ |

---

## THREAD TYPE 2 — CONTEXTUAL THREAD

### Purpose
Preserve **WHY something existed** WITHOUT asserting intent or value.

### Sources ⚡
- meeting metadata, agenda notes, **declared goals** ⚡, environment context (sphere, mode)

### Properties ⚡
| Property | Status |
|----------|--------|
| descriptive only | ✅ |
| **no inferred sentiment** | ✅ ⚡ |
| no success/failure labels | ✅ |
| **optional visibility** | ✅ ⚡ |

### Examples ⚡
- context of decision under constraint
- **environment conditions influencing timing** ⚡
- **resource availability at that moment** ⚡

### Contextual Thread JSON (with declared_goal + constraints) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "contextual",
    "context": {
      "sphere": "business|scholar|xr|...",
      "constraints": ["time","resources"],
      "declared_goal": "string"
    },
    "timeline": [ { "timestamp": 1712345678 } ]
  }
}
```

### Contextual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `context.constraints` | **["time","resources"]** ⚡ |
| `context.declared_goal` | **String - explicit goal** ⚡ |

---

## THREAD TYPE 3 — EVOLUTION THREAD ⚡

### Purpose
Track **CHANGE over time** WITHOUT judging direction or correctness.

### Sources ⚡
| Source | Description |
|--------|-------------|
| **successive factual threads** | ⚡ |
| **meeting sequences** | ⚡ |
| **versioned artifacts** | ⚡ |
| **structural modifications** | ⚡ |

### Properties ⚡
| Property | Status |
|----------|--------|
| **visual-first (graphs, braids)** | ✅ ⚡ |
| **no narrative override** | ✅ ⚡ |
| **diff-based representation** | ✅ ⚡ |

### Examples ⚡
- policy evolution
- strategy adjustments
- **architectural changes** ⚡
- **methodology refinement** ⚡

### Evolution Thread JSON (with from/to + diff) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "evolution",
    "from": "thread_id",
    "to": "thread_id",
    "diff": ["added","removed","modified"],
    "timestamps": [1712345678,1712445678]
  }
}
```

### Evolution Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `from` | **Source thread_id** ⚡ |
| `to` | **Target thread_id** ⚡ |
| `diff` | **["added","removed","modified"]** ⚡ |
| `timestamps` | **Array of 2 timestamps** ⚡ |

---

## THREAD INTERACTIONS

| Rule | Status |
|------|--------|
| threads can intersect | ✅ |
| **threads never merge automatically** | ⚡ |
| user or agent may VIEW intersections | ✅ |
| **creation is explicit, never implicit** | ⚡ |

---

## VISUALIZATION (XR / UNIVERSE VIEW)

### Display ⚡
> **threads displayed as braided lines**

### Visual Styles ⚡
| Thread Type | Style |
|-------------|-------|
| **factual** | solid line |
| **contextual** | dashed line |
| **evolution** | **gradient line** ⚡ |

### Interactions ⚡
| Feature | Description |
|---------|-------------|
| **intersections shown as nodes** | ⚡ |
| **hover = source preview only** | ⚡ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_EXTRACTOR` | identifies possible threads, **never creates automatically** ⚡ |
| `AGENT_THREAD_VALIDATOR` | **checks integrity & scope** ⚡ |
| `AGENT_THREAD_NAVIGATOR` | helps user explore, **no prioritization** ⚡ |

---

## ETHICAL LOCKS

| Lock | Status |
|------|--------|
| **no "story mode"** | ✅ ⚡ |
| no persuasion | ✅ |
| **no hidden weighting** | ✅ ⚡ |
| full traceability | ✅ |

---

## WHY THIS MATTERS

Knowledge Threads:
- **replace narrative control**
- **preserve truth through structure**
- **allow clarity without manipulation**

---

**END — CORE FREEZE**
