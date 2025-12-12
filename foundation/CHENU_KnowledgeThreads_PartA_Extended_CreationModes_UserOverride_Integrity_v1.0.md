# CHE·NU — KNOWLEDGE THREADS (PART A — FOUNDATION EXTENDED)
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

---

## THREAD GENERATION RULES ⚡

| Rule | Description |
|------|-------------|
| **RULE 1 — FACT-ONLY** | Only validated replay elements or validated artifacts ⚡ |
| **RULE 2 — NO INTERPRETATION** | No causal language. No predictive logic. **No emotional pattern detection** ⚡ |
| **RULE 3 — APPEND-ONLY** | Threads grow; they **never rewrite past entries** ⚡ |
| **RULE 4 — FREEZE ON EXPORT** | Once a thread is exported → **immutable** ⚡ |
| **RULE 5 — USER OVERRIDE** | User controls thread modifications ⚡ |

### RULE 5 — USER OVERRIDE ⚡ (NOUVEAU!)

User may:
| Action | Status |
|--------|--------|
| **rename thread** | ✅ ⚡ |
| **hide nodes** | ✅ ⚡ |
| **hide edges** | ✅ ⚡ |
| **split thread** | ✅ ⚡ |
| **merge threads (manual only)** | ✅ ⚡ |

---

## THREAD CREATION MODES ⚡ (NOUVEAU!)

| Mode | Description |
|------|-------------|
| **MODE A — AUTOMATIC STRUCTURAL** | System detects connections across: time adjacency, shared documents, sequential decisions. Creates **"suggested threads" (inactive until user validation)** ⚡ |
| **MODE B — USER CURATION** | **User manually selects nodes** to weave a thread ⚡ |
| **MODE C — SPHERE-BOUND THREAD** | Each sphere may auto-generate its own internal thread **(ledger-like chain of factual context)** ⚡ |
| **MODE D — CROSS-SPHERE BRIDGE** | When two spheres share artifacts, **a bridge-thread is created** ⚡ |

---

## THREAD VISUALIZATION (2D / XR) ⚡

### 2D ⚡
| Feature | Description |
|---------|-------------|
| **horizontal timeline braid** | ⚡ |
| **clickable nodes** | ⚡ |
| **edge lines with labels** | ⚡ |

### XR ⚡
| Feature | Description |
|---------|-------------|
| **spatial constellation** | ⚡ |
| **threads appear as softly-lit lines** | ⚡ |
| **selectable nodes** | ⚡ |
| **replay preview windows** | ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **motion cues suggesting importance** | ❌ ⚡ |
| **brightness differences as ranking** | ❌ ⚡ |
| **narrative paths** | ❌ ⚡ |

---

## THREAD INTEGRITY ⚡

### Each Node Contains ⚡
| Field | Description |
|-------|-------------|
| **timestamp** | ⚡ |
| **originating replay hash** | ⚡ |
| **validation signature** | ⚡ |

### Each Thread Contains ⚡
| Field | Description |
|-------|-------------|
| **global hash** | ⚡ |
| **integrity tree** | ⚡ |
| **version number** | ⚡ |

### Integrity Agent Verifies ⚡
| Check | Status |
|-------|--------|
| **no missing nodes** | ✅ ⚡ |
| **no illegal edits** | ✅ ⚡ |
| **no back-dating** | ✅ ⚡ |

---

## AGENT ROLES ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_WEAVER` | **builds structural threads only, no interpretation, no prioritization** ⚡ |
| `AGENT_THREAD_GUARD` | **verifies thread integrity, confirms no tampering** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **explains structure, never interprets meaning** ⚡ |

---

## WHY KNOWLEDGE THREADS MATTER ⚡

### They Reveal ⚡
- **NOT** opinions
- **NOT** narratives
- **NOT** biases

### But ⚡
| Reveals | Status |
|---------|--------|
| **structural truth** | ✅ ⚡ |
| **factual continuity** | ✅ ⚡ |
| **traceable histories** | ✅ ⚡ |
| **cross-sphere coherence** | ✅ ⚡ |

---

**END — KNOWLEDGE THREADS PART A**
