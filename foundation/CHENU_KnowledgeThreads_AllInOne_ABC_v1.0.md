# CHE·NU — KNOWLEDGE THREAD SYSTEM (ALL-IN-ONE A/B/C)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / IMMUTABLE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE INFORMATION LINE** linking facts, artifacts, decisions, contexts, **WITHOUT interpretation or narrative shaping.**

### RULE
> **Threads reveal CONNECTIONS. They NEVER explain meaning.**

---

## THE 3 KNOWLEDGE THREAD TYPES

| Type | Name | Purpose |
|------|------|---------|
| **A** | FACTUAL THREAD | Track factual information |
| **B** | DECISION THREAD | Track decisions and paths |
| **C** | CONTEXT THREAD | Track surrounding conditions |

> **All three coexist and may interlink, but never merge into conclusions.**

---

## A) FACTUAL THREAD

### Purpose
Track how factual information appears, reappears, evolves, or is reused across spheres.

### Tracks ⚡
- documents, data points, statements, references, artifacts

### DOES NOT TRACK ⚡
- opinions, interpretations, emotions

### Factual Thread Rules ⚡
| Rule | Status |
|------|--------|
| source-bound | ✅ |
| time-stamped | ✅ |
| append-only | ✅ |
| immutable once validated | ✅ |
| **cryptographically hashed** | ✅ ⚡ |

### Factual Thread JSON (with entries array + sphere per entry) ⚡

```json
{
  "factual_thread": {
    "id": "uuid",
    "origin": "meeting|document|agent",
    "entries": [
      {
        "artifact_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr",
        "source": "replay_id",
        "hash": "sha256"
      }
    ]
  }
}
```

### Factual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `origin` | **meeting/document/agent** ⚡ |
| `entries[].artifact_id` | **UUID** ⚡ |
| `entries[].sphere` | **Per-entry sphere** ⚡ |
| `entries[].source` | **replay_id** ⚡ |
| `entries[].hash` | **Per-entry hash** ⚡ |

---

## B) DECISION THREAD

### Purpose
Track decisions and decision paths **WITHOUT labeling them correct or incorrect.**

### Tracks ⚡
- declared decisions, alternatives presented, decision changes, temporal sequences

### DOES NOT TRACK ⚡
- success metrics, persuasion strength, emotional framing

### Decision Thread Rules ⚡
| Rule | Status |
|------|--------|
| **decision-only markers** | ✅ ⚡ |
| **neutral sequencing** | ✅ ⚡ |
| **explicit declaration required** | ✅ ⚡ |
| no inferred intent | ✅ |

### Decision Thread JSON (with path + final_state) ⚡

```json
{
  "decision_thread": {
    "id": "uuid",
    "topic": "string",
    "path": [
      {
        "decision": "string",
        "timestamp": 1712345678,
        "meeting_id": "uuid",
        "declared_by": "user|agent"
      }
    ],
    "final_state": "open|closed|revised"
  }
}
```

### Decision Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `topic` | **String topic** ⚡ |
| `path` | **Array of decisions** ⚡ |
| `path[].decision` | **String - decision text** ⚡ |
| `path[].declared_by` | **user/agent** ⚡ |
| `final_state` | **open/closed/revised** ⚡ |

---

## C) CONTEXT THREAD

### Purpose
Track surrounding conditions that influence how information was processed, **WITHOUT describing impact or outcome.**

### Tracks ⚡
- sphere, participants, time window, tools used, environment mode (XR / 2D)

### DOES NOT TRACK ⚡
- mood, psychological state, inferred pressure

### Context Thread Rules ⚡
| Rule | Status |
|------|--------|
| descriptive only | ✅ |
| **cannot trigger decisions** | ✅ ⚡ |
| **used only for navigation & understanding** | ✅ ⚡ |

### Context Thread JSON (with related_threads + time_range) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "related_threads": ["factual_id","decision_id"],
    "context": {
      "sphere": "string",
      "participants": ["user","agent"],
      "mode": "xr|2d",
      "time_range": { "start": 123, "end": 456 }
    }
  }
}
```

### Context Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `related_threads` | **["factual_id","decision_id"]** ⚡ |
| `context.mode` | **xr/2d** ⚡ |
| `context.time_range` | **{start, end} object** ⚡ |

---

## THREAD LINKING & GRAPH

### Thread Links ⚡
| From | To | Type |
|------|----|------|
| factual | → decision | reference |
| decision | → context | environment |
| context | → factual | origin |

### Graph Properties ⚡
| Property | Status |
|----------|--------|
| read-only | ✅ |
| explorable | ✅ |
| filterable | ✅ |
| **no auto-ranking** | ✅ ⚡ |

---

## THREAD VISUALIZATION RULES ⚡

| Rule | Description |
|------|-------------|
| Style | **threads appear as lines, not labels** ⚡ |
| Thickness | **= frequency, NOT importance** ⚡ |
| Color | = type (fact/decision/context) |
| User control | **can hide any layer** ⚡ |

---

## ACCESS & PRIVACY

| Rule | Status |
|------|--------|
| threads inherit source permissions | ✅ |
| **private threads never auto-link** | ✅ ⚡ |
| **cross-user links require consent** | ✅ ⚡ |

---

## WHY KNOWLEDGE THREADS EXIST

They allow Che·Nu to:
- **reveal structure without narrative**
- **preserve memory without bias**
- **expose patterns without persuasion**
- **scale truth without authority**

---

**END — KNOWLEDGE THREAD SYSTEM**
