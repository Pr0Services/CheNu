# CHE·NU — KNOWLEDGE THREAD SYSTEM (GOVERNANCE + STYLES)
**VERSION:** CORE.v1.0  
**TYPE:** STRUCTURAL / INTER-SPHERE / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE LINK** between information pieces across time, spheres, meetings, decisions, and agents.

### RULE
> **Knowledge Threads CONNECT FACTS.**  
> **They do NOT infer meaning or intent.**

---

## THE 3 KNOWLEDGE THREAD TYPES

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Connect objective facts across the system.

### Sources
- documents, meeting notes, artifacts, data entries, decisions (as declared)

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| immutable after validation | ✅ |
| no interpretation layer | ✅ |

### Fact Thread Links
```
document → meeting → decision → artifact → replay
```

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "fact",
    "nodes": [
      { "id": "uuid", "entity": "document" },
      { "id": "uuid", "entity": "meeting" },
      { "id": "uuid", "entity": "decision" }
    ],
    "created_at": 1712345678,
    "hash": "sha256"
  }
}
```

---

## THREAD TYPE 2 — CONTEXT THREAD (with time_window) ⚡

### Purpose
Explain WHY items are connected **WITHOUT asserting correctness or value.**

### Sources
- meeting purpose, agenda, declared scope, participant roles, timestamps

### Rules
| Rule | Status |
|------|--------|
| descriptive only | ✅ |
| no scoring | ✅ |
| no ranking | ✅ |
| no sentiment | ✅ |

### Context Thread Links
- why meeting happened
- what scope was declared
- which roles were involved

### JSON Model (with time_window)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "context",
    "scope": "string",
    "participants": ["user|agent_id"],
    "related_fact_threads": ["uuid"],
    "time_window": { "start": 1712340000, "end": 1712350000 }
  }
}
```

### Time Window ⚡
| Field | Description |
|-------|-------------|
| `start` | Window start timestamp |
| `end` | Window end timestamp |

---

## THREAD TYPE 3 — EVOLUTION THREAD (with entity types) ⚡

### Purpose
Track how understanding, structure, or system representation **CHANGED OVER TIME, WITHOUT judging improvement or success.**

### Sources
- versioned documents
- architectural changes
- avatar evolution states
- navigation profile changes
- sphere structure updates

### Rules
| Rule | Status |
|------|--------|
| version-based | ✅ |
| time-ordered | ✅ |
| reversible | ✅ |
| no optimization labels | ✅ |

### Evolution Thread Links
```
state_before → state_after
configuration v1 → v2
structure snapshot changes
```

### JSON Model (with entity types)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "evolution",
    "entity": "document|plan|avatar|profile|sphere",
    "versions": [
      { "version": 1, "hash": "sha256", "timestamp": 1712340000 },
      { "version": 2, "hash": "sha256", "timestamp": 1712350000 }
    ]
  }
}
```

### Entity Types ⚡
| Entity | Description |
|--------|-------------|
| `document` | Document versions |
| `plan` | Plan/strategy evolution |
| `avatar` | Avatar state changes |
| `profile` | Navigation profile changes |
| `sphere` | Sphere structure updates |

---

## THREAD VISUALIZATION (XR / 2D) ⚡

| Thread Type | Line Style | Color |
|-------------|------------|-------|
| **FACT** | solid line | neutral |
| **CONTEXT** | dashed line | soft tone |
| **EVOLUTION** | layered line | time markers |

### Thread Controls
| Control | Description |
|---------|-------------|
| toggled on/off | Show/hide |
| filtered by type | Select type |
| followed step-by-step | Navigate |
| exported as static diagrams | PDF/image |

---

## THREAD GOVERNANCE ⚡

| Rule | Status |
|------|--------|
| Threads are created automatically | ✅ |
| Threads **cannot be edited manually** | ✅ |
| Threads can be hidden per user | ✅ |
| Threads can be shared explicitly | ✅ |

### ❌ NOT Allowed
- auto-interpretation
- auto-summary injection
- hidden grouping

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Constructs threads from validated data |
| `AGENT_THREAD_VALIDATOR` | Ensures structural correctness |
| `AGENT_THREAD_RENDERER` | Visualizes threads (**no reasoning**) |
| `AGENT_THREAD_GUARD` | **Prevents semantic drift** ⚡ |

### AGENT_THREAD_GUARD Enhanced ⚡
> **"Prevents semantic drift"**
- Ensures threads stay factual
- Blocks meaning creep
- Maintains structural purity

---

## WHY KNOWLEDGE THREADS MATTER

They give Che-Nu:
- **memory without bias**
- **clarity without opinion**
- **traceability without control**

> **One reality. Many views. Zero manipulation.**

---

**END — FOUNDATION FREEZE**
