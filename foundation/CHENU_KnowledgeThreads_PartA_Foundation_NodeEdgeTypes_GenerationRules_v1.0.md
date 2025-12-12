# CHE·NU — KNOWLEDGE THREADS (PART A — FOUNDATION)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / STRUCTURAL / NON-MANIPULATIVE

---

## PURPOSE

> Connect facts, artifacts, meetings, and decisions into **NEUTRAL KNOWLEDGE THREADS** that reveal relationships **WITHOUT interpretation, persuasion, or narrative shaping.**

### Definition ⚡
> **A "Knowledge Thread" = A sequence of verifiable facts** connected through: shared context, shared artifacts, chronological adjacency, shared sphere, shared participants (optional, anonymizable)

### RULE
> **Threads are purely STRUCTURAL. No meaning, no inference, no opinion added.**

---

## KNOWLEDGE THREAD OBJECT TYPES ⚡

### THREAD_NODE ⚡
| Type | Description |
|------|-------------|
| `replay event` | ⚡ |
| `artifact reference` | ⚡ |
| `decision log entry` | ⚡ |
| `task creation` | ⚡ |
| `sphere context anchor` | ⚡ |

### THREAD_EDGE ⚡
| Type | Description |
|------|-------------|
| `shared_artifact` | ⚡ |
| `time_proximity` | ⚡ |
| `same_sphere` | ⚡ |
| `derived_from` | **(artifact-to-artifact)** ⚡ |
| `referenced_in` | **(meeting referencing another)** ⚡ |

### THREAD_METADATA ⚡
| Field | Description |
|-------|-------------|
| `version` | ⚡ |
| `creation_time` | ⚡ |
| `freeze_hash` | ⚡ |
| `integrity_signature` | ⚡ |

---

## THREAD MODEL (JSON) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "title": "neutral_label",
    "nodes": [
      {
        "id": "node_uuid",
        "type": "event|artifact|decision|context",
        "timestamp": 1712345678,
        "source_replay": "uuid",
        "sphere": "business|scholar|creative|...",
        "hash": "sha256"
      }
    ],
    "edges": [
      {
        "from": "node_uuid",
        "to": "node_uuid",
        "relationship": "shared_artifact|time_proximity|contextual",
        "confidence": "0.0-1.0"
      }
    ],
    "origin": "collective_memory_id",
    "status": "frozen|draft|validated",
    "signature": "sha256"
  }
}
```

### Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `title` | **neutral_label (no emotional)** ⚡ |
| `nodes[].type` | **event/artifact/decision/context** ⚡ |
| `nodes[].source_replay` | **UUID reference** ⚡ |
| `edges[].relationship` | **shared_artifact/time_proximity/contextual** ⚡ |
| `edges[].confidence` | **0.0-1.0 float** ⚡ |
| `origin` | **collective_memory_id** ⚡ |
| `status` | **frozen/draft/validated** ⚡ |

---

## THREAD GENERATION RULES ⚡

| Rule | Description |
|------|-------------|
| **RULE 1 — FACT-ONLY** | Only validated replay elements or validated artifacts ⚡ |
| **RULE 2 — NO INTERPRETATION** | No causal language. No predictive logic. **No emotional pattern detection** ⚡ |
| **RULE 3 — APPEND-ONLY** | Threads grow; they **never rewrite past entries** ⚡ |
| **RULE 4 — FREEZE ON EXPORT** | Once a thread is exported → **immutable** ⚡ |

---

### RULE 1 — FACT-ONLY ⚡
> Only validated replay elements or validated artifacts.

### RULE 2 — NO INTERPRETATION ⚡
- No causal language
- No predictive logic
- **No emotional pattern detection** ⚡

### RULE 3 — APPEND-ONLY ⚡
> Threads grow; they **never rewrite past entries.**

### RULE 4 — FREEZE ON EXPORT ⚡
> Once a thread is exported → **immutable**

---

**END — PART A FOUNDATION**
