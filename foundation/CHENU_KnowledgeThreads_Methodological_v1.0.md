# CHE·NU — KNOWLEDGE THREADS SYSTEM (METHODOLOGICAL)
**VERSION:** FOUNDATION v1.0  
**MODE:** NON-MANIPULATIVE / APPEND-ONLY / TRACEABLE

---

## GLOBAL PRINCIPLES

> **Knowledge Threads connect INFORMATION.**

### They NEVER
- decide
- rank truth
- influence behavior
- rewrite history

> **Threads = LINKS, not conclusions.**

---

## THREAD TYPE #1 — FACTUAL THREAD (with edges)

### Purpose
Link verified facts, events, and artifacts across meetings, replays, and spheres.

### Sources
- XR replays (validated), meeting artifacts, decision logs (time-stamped)

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| immutable once validated | ✅ |
| source-linked | ✅ |
| hash-signed | ✅ |

### Use Cases
- trace how information appeared
- follow factual continuity
- audit decisions without interpretation

### JSON Model (with edges) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": [
      { "ref": "artifact_id", "timestamp": 1712345678 }
    ],
    "edges": [
      { "from": "id", "to": "id", "relation": "referenced_by" }
    ],
    "integrity": "verified",
    "hash": "sha256"
  }
}
```

### Edge Relations ⚡
| Relation | Description |
|----------|-------------|
| `referenced_by` | Referenced by another node |

---

## THREAD TYPE #2 — CONTEXTUAL THREAD (with contexts array)

### Purpose
Show HOW context evolved around facts **without judging outcomes or intent.**

### Sources
- meeting contexts, participant sets, sphere environment, timing & sequence

### Rules
| Rule | Status |
|------|--------|
| descriptive only | ✅ |
| no sentiment | ✅ |
| no success metrics | ✅ |
| reversible visibility | ✅ |

### Use Cases
- understand why a decision happened WHEN it did
- observe context shifts
- study coordination conditions

### JSON Model (with contexts array + surrounds) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "contextual",
    "contexts": [
      {
        "sphere": "business",
        "participants": ["user","agent"],
        "time_range": [1712300000, 1712399999]
      }
    ],
    "links": [
      { "to": "factual_thread_id", "relation": "surrounds" }
    ]
  }
}
```

### Context Fields ⚡
| Field | Description |
|-------|-------------|
| `sphere` | Active sphere |
| `participants` | Users/agents involved |
| `time_range` | Start/end timestamps |

### Link Relations ⚡
| Relation | Description |
|----------|-------------|
| `surrounds` | Context surrounds a fact |

---

## THREAD TYPE #3 — METHODOLOGICAL THREAD ⚡ UNIQUE

### Purpose
Track METHODS applied across time **WITHOUT evaluating success or failure.**

### Sources
- declared methodologies
- workflow schemas
- agent orchestration modes
- process changes

### Rules
| Rule | Status |
|------|--------|
| **method ≠ result** | ✅ ⚡ |
| no optimization scoring | ✅ |
| manual comparison only | ✅ |

### Use Cases
- compare different approaches
- replay process evolution
- teach methodology without bias

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "methodological",
    "methods": [
      {
        "name": "method_id",
        "applied_at": 1712345678,
        "scope": "sphere|meeting|project"
      }
    ],
    "linked_events": ["event_id"]
  }
}
```

### Method Fields ⚡
| Field | Description |
|-------|-------------|
| `name` | Method identifier |
| `applied_at` | When applied |
| `scope` | sphere / meeting / project |

---

## THREAD VISUALIZATION RULES

| Property | Value |
|----------|-------|
| Rendering | soft lines |
| Color | coded by type |
| Toggle | on/off per user |
| Emphasis | **no default emphasis** |
| Focus | **no auto-focus** |

---

## ACCESS & CONTROL

| Rule | Status |
|------|--------|
| private by default | ✅ |
| shareable by user | ✅ |
| cross-sphere allowed with permission | ✅ |
| deletable only by owner | ✅ |
| **public threads anonymized** | ✅ ⚡ |

---

## WHY THREE THREADS

| Thread | Shows |
|--------|-------|
| **FACTUAL** | What exists |
| **CONTEXTUAL** | Where & when it existed |
| **METHODOLOGICAL** | How it was handled ⚡ |

### Together
- **clarity without judgment**
- **learning without influence**
- **truth without control**

---

**END — FOUNDATION FREEZE**
