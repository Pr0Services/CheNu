# CHE·NU — KNOWLEDGE THREAD SYSTEM (THREAD LINK MODEL)
**VERSION:** KT.v1.0  
**MODE:** STRUCTURAL MEMORY / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **CONTINUOUS LINK** between facts, actions, decisions, artifacts, and time.

### RULE
> **Threads CONNECT information.**  
> **They NEVER interpret, rank, or judge.**

---

## THE 3 KNOWLEDGE THREAD TYPES

---

## 1) FACT THREAD

### Purpose
Link objective information across time.

### Sources
- documents, notes, files, references, replay artifacts

### Properties
| Property | Value |
|----------|-------|
| append-only | ✅ |
| immutable once validated | ✅ |
| no sentiment | ✅ |

### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "type": "fact",
    "nodes": ["artifact_id","artifact_id"],
    "created_at": 1712345678,
    "sphere": "business|scholar|xr|...",
    "visibility": "private|shared|public",
    "hash": "sha256"
  }
}
```

---

## 2) DECISION THREAD (with state types) ⚡

### Purpose
Track **HOW decisions evolved over time**, without evaluating correctness.

### Sources
- meeting decisions, option changes, reversals, pauses (non-decisions)

### Properties
| Property | Value |
|----------|-------|
| chronological | ✅ |
| **includes silence intervals** | ✅ ⚡ |
| reversible view | ✅ |

### JSON Model (with state) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "decision",
    "steps": [
      {
        "timestamp": 1712345000,
        "state": "option_selected|deferred|reversed",
        "source": "meeting_id"
      }
    ],
    "sphere": "business|institution|...",
    "hash": "sha256"
  }
}
```

### Decision State Types ⚡
| State | Description |
|-------|-------------|
| `option_selected` | Option was chosen |
| `deferred` | Decision postponed |
| `reversed` | Decision reversed |

---

## 3) CONTEXT THREAD (with xr_preset) ⚡

### Purpose
Preserve surrounding conditions that influenced understanding **(not intent).**

### Sources
- participants, sphere, environment preset, tools in use

### Properties
| Property | Value |
|----------|-------|
| descriptive only | ✅ |
| no causal claim | ✅ |
| supports later review | ✅ |

### JSON Model (with xr_preset) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "context",
    "environment": {
      "sphere": "scholar",
      "xr_preset": "xr_classic",
      "participants": 6,
      "tools": ["board","timeline"]
    },
    "timestamp": 1712345678,
    "hash": "sha256"
  }
}
```

### XR Preset ⚡
> **References the XR environment preset used during the context**

---

## LINKING THREADS (THREAD OF THREADS) ⚡ UNIQUE

### Purpose
Allow multiple threads to be **CONNECTED** without merging or rewriting them.

### CRITICAL RULE ⚡
> **Linking ≠ blending.**  
> **Original threads remain intact.**

### Thread Link JSON Model ⚡

```json
{
  "thread_link": {
    "id": "uuid",
    "from_thread": "thread_id_A",
    "to_thread": "thread_id_B",
    "relation": "references|follows|branches|merges",
    "created_at": 1712345700
  }
}
```

### Supported Relations ⚡
| Relation | Description |
|----------|-------------|
| `references` | fact → decision |
| `follows` | decision → decision |
| `branches` | decision → alternatives |
| `merges` | multiple → outcome |
| `contextualized_by` | any → context |

---

## THREAD GRAPH VIEW

### Nodes
- fact threads, decision threads, context threads

### Edges
- thread_link relations

### Visual Rules
| Rule | Status |
|------|--------|
| no ranking | ✅ |
| no color implying value | ✅ |
| **thickness = frequency only** | ✅ ⚡ |
| user-toggleable visibility | ✅ |

---

## AGENTS INTERACTING WITH THREADS ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_COLLECTOR` | **Detects eligible items, proposes new thread nodes** ⚡ |
| `AGENT_THREAD_LINKER` | **Suggests possible links, never auto-links** ⚡ |
| `AGENT_THREAD_GUARD` | Verifies immutability, ensures no edits post-validation |
| `AGENT_THREAD_EXPLAINER` | Explains thread structure in plain language |

### AGENT_THREAD_COLLECTOR ⚡ NEW
> **"Detects eligible items, proposes new thread nodes"**

### AGENT_THREAD_LINKER ⚡ NEW
> **"Suggests possible links, never auto-links"**

---

## USER CONTROLS ⚡

| Action | Description |
|--------|-------------|
| `create thread` | manual creation |
| `accept/reject link suggestions` | user approval |
| `hide/show threads` | visibility control |
| `export thread` | PDF / JSON |
| `reset view to neutral` | clear filters |

---

## ETHICAL & SAFETY GUARANTEES

| Guarantee | Status |
|-----------|--------|
| no narrative reconstruction | ✅ |
| no intent inference | ✅ |
| no behavioral scoring | ✅ |
| full traceability to source | ✅ |
| user retains ownership | ✅ |

---

## WHY THIS MATTERS

Knowledge Threads allow:
- **memory without distortion**
- **transparency without pressure**
- **learning without rewriting history**

### Core Philosophy ⚡
> **They make Che-Nu: STRUCTURED, not persuasive.**

---

**END — FREEZE READY**
