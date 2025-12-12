# CHE·NU — KNOWLEDGE THREADS SYSTEM (CORE CROSS-SPHERE)
**VERSION:** CORE v1.0  
**MODE:** FOUNDATION / CROSS-SPHERE / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE CONTINUITY of knowledge** across time, spheres, meetings, artifacts, and decisions.

### RULE
> **Threads CONNECT facts. They do NOT explain, judge, or persuade.**

---

## THE 3 KNOWLEDGE THREAD TYPES

| # | Type | Purpose |
|---|------|---------|
| 1 | FACT THREAD | Track objective information |
| 2 | DECISION THREAD | Track how decisions emerged |
| 3 | EVOLUTION THREAD | Track change of structure |

> **Each thread type serves a DIFFERENT PURPOSE and MUST NOT be merged or confused.**

---

## 1) FACT THREAD

### Purpose
Track **OBJECTIVE INFORMATION** across the system.

### What it links
- documents, notes, data artifacts, visual boards, references

### Characteristics
| Property | Status |
|----------|--------|
| append-only | ✅ |
| immutable after validation | ✅ |
| time-stamped | ✅ |
| source-linked | ✅ |

### Forbidden
| Forbidden | Status |
|-----------|--------|
| interpretation | ❌ |
| sentiment | ❌ |
| recommendation | ❌ |

### Examples
- "This spec appeared here, reused there"
- "This concept was referenced across 4 meetings"

### Fact Thread JSON (with sources array) ⚡

```json
{
  "fact_thread": {
    "id": "uuid",
    "sources": [
      { "type": "document", "id": "doc_id" },
      { "type": "meeting", "id": "meeting_id" }
    ],
    "created_at": 1712345678,
    "sphere": "business|scholar|xr|...",
    "visibility": "private|shared|public",
    "hash": "sha256"
  }
}
```

### Sources Array ⚡
| Field | Description |
|-------|-------------|
| `type` | document / meeting / etc. |
| `id` | Source ID |

---

## 2) DECISION THREAD

### Purpose
Track **HOW decisions emerged** over time.

### What it links
- meeting moments, decision points, alternatives considered, final declared outcome

### Characteristics
| Property | Status |
|----------|--------|
| chronological | ✅ |
| replay-linked | ✅ |
| immutable | ✅ |
| neutral | ✅ |

### Forbidden
| Forbidden | Status |
|-----------|--------|
| success/failure rating | ❌ |
| optimization hints | ❌ |
| hindsight bias | ❌ |

### Examples
- "Decision A chosen after B was discarded"
- "This option resurfaced later in another context"

### Decision Thread JSON (with options + selected + declared_outcome) ⚡

```json
{
  "decision_thread": {
    "id": "uuid",
    "decision_points": [
      {
        "meeting_id": "uuid",
        "timestamp": 23.4,
        "options": ["A","B","C"],
        "selected": "B"
      }
    ],
    "declared_outcome": "string",
    "hash": "sha256"
  }
}
```

### Decision Points Fields ⚡
| Field | Description |
|-------|-------------|
| `meeting_id` | Meeting UUID |
| `timestamp` | Timestamp (seconds) |
| `options` | Array of options considered |
| `selected` | Which option was selected |

### Declared Outcome ⚡
> **`declared_outcome`: Final declared outcome string**

---

## 3) EVOLUTION THREAD

### Purpose
Track **CHANGE OF STRUCTURE** over time.

### What it links
- plans, agents, workflows, architectures, sphere structures

### Characteristics
| Property | Status |
|----------|--------|
| versioned | ✅ |
| diff-based | ✅ |
| reversible | ✅ |
| transparent | ✅ |

### Forbidden
| Forbidden | Status |
|-----------|--------|
| direction forcing | ❌ |
| recommendation bias | ❌ |
| silent upgrades | ❌ |

### Examples
- "This architecture evolved from v1 → v4"
- "This agent role expanded scope gradually"

### Evolution Thread JSON (with entity_type + changes + current_version) ⚡

```json
{
  "evolution_thread": {
    "id": "uuid",
    "entity_type": "agent|workflow|plan|sphere",
    "versions": [
      {
        "version": "1.0",
        "timestamp": 1712340000,
        "changes": ["added","modified","removed"]
      }
    ],
    "current_version": "x.y",
    "hash": "sha256"
  }
}
```

### Entity Types ⚡
| Entity | Description |
|--------|-------------|
| `agent` | Agent evolution |
| `workflow` | Workflow evolution |
| `plan` | Plan evolution |
| `sphere` | Sphere evolution |

### Changes Array ⚡
| Change | Description |
|--------|-------------|
| `added` | Something added |
| `modified` | Something modified |
| `removed` | Something removed |

### Current Version ⚡
> **`current_version`: Current version string (e.g., "x.y")**

---

## THREAD INTERACTIONS (STRICT RULES) ⚡

### Allowed
| From | To | Allowed |
|------|-----|---------|
| Fact Threads | Decision Threads | MAY feed |
| Decision Threads | Evolution Threads | MAY reference |
| Evolution Threads | Fact Threads | MAY reference |

### Forbidden
| Action | Status |
|--------|--------|
| infer intent | ❌ |
| merge automatically | ❌ |
| rank outcomes | ❌ |

---

## UNIVERSE VIEW REPRESENTATION ⚡

### Visual Styles
| Thread Type | Style |
|-------------|-------|
| **FACT THREAD** | dotted line |
| **DECISION THREAD** | solid line |
| **EVOLUTION THREAD** | segmented line |

### Visual Properties ⚡
| Property | Based On |
|----------|----------|
| Color | by sphere |
| Thickness | number of references |
| **Opacity** | **recency (not importance)** ⚡ |

> **CRITICAL: Opacity = RECENCY, never importance**

---

## ACCESS & SAFETY

| Property | Status |
|----------|--------|
| user-level visibility | ✅ |
| sphere-level permissions | ✅ |
| explicit sharing required | ✅ |
| full audit trail visible | ✅ |

---

## WHY THIS MATTERS

### Knowledge Threads prevent:
- knowledge loss
- manipulation
- revisionism

### Knowledge Threads enable:
- long-term clarity

### They make CHE·NU:
- accountable
- transparent
- trustworthy
- scalable

---

**END — THREAD SYSTEM FREEZE**
