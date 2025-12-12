# CHE·NU — KNOWLEDGE THREADS SYSTEM (3 CORE TYPES)
**VERSION:** FOUNDATION v1.0  
**MODE:** TRUTH-PRESERVING / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> **Knowledge Thread = A TRACEABLE LINK** between facts, artifacts, decisions, and replays **ACROSS spheres and time.**

### RULE
> **Threads connect INFORMATION, never infer meaning or intent.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Link objective facts across meetings, spheres, and time.

### Sources
- XR replays, documents, timestamps, agent actions, declared decisions

### Properties ⚡
| Property | Status |
|----------|--------|
| immutable | ✅ |
| append-only | ✅ |
| **cryptographically linked** | ✅ ⚡ |

### Use Cases ⚡
| Use Case | Description |
|----------|-------------|
| **trace when a fact emerged** | ⚡ |
| **trace fact evolution** | ⚡ |
| **verify consistency** | ⚡ |

### Factual Thread JSON (with sphere_path) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": ["memory_id_1","memory_id_2"],
    "sphere_path": ["scholar","business"],
    "created_at": 1712345678,
    "hash": "sha256"
  }
}
```

### Factual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes` | **Array of memory_ids** ⚡ |
| `sphere_path` | **["scholar","business"] - ordered path** ⚡ |

---

## THREAD TYPE 2 — DECISION THREAD

### Purpose
Trace decision paths **WITHOUT evaluating outcomes.**

### Sources ⚡
| Source | Description |
|--------|-------------|
| meeting decisions | ✅ |
| **alternatives considered** | ⚡ |
| **voting or validation logs** | ⚡ |
| **agent recommendation traces** | ⚡ |

### Properties ⚡
| Property | Status |
|----------|--------|
| chronological | ✅ |
| **branched** | ✅ ⚡ |
| **replay-linked** | ✅ ⚡ |

### Use Cases ⚡
| Use Case | Description |
|----------|-------------|
| **understand why a decision existed** | ⚡ |
| **compare decision sequences** | ⚡ |
| **audit responsibility without blame** | ⚡ |

### Decision Thread JSON (with root_decision + branches + linked_replays) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "decision",
    "root_decision": "decision_id",
    "branches": [
      { "path": ["decision_a","decision_b"], "timestamp": 1712345678 }
    ],
    "linked_replays": ["replay_id_1"]
  }
}
```

### Decision Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `root_decision` | **decision_id - root of tree** ⚡ |
| `branches` | **Array of {path, timestamp}** ⚡ |
| `branches[].path` | **["decision_a","decision_b"]** ⚡ |
| `linked_replays` | **Array of replay_ids** ⚡ |

---

## THREAD TYPE 3 — CONTEXT THREAD

### Purpose
Preserve context surrounding facts & decisions **WITHOUT summarizing or simplifying.**

### Sources ⚡
| Source | Description |
|--------|-------------|
| meeting metadata | ✅ |
| participants | ✅ |
| sphere | ✅ |
| artifacts present | ✅ |
| **silence intervals** | ⚡ |

### Properties ⚡
| Property | Status |
|----------|--------|
| descriptive only | ✅ |
| non-interpretive | ✅ |
| **visibility controlled** | ✅ ⚡ |

### Use Cases ⚡
| Use Case | Description |
|----------|-------------|
| **avoid decontextualization** | ⚡ |
| **understand environment of actions** | ⚡ |
| **protect against narrative drift** | ⚡ |

### Context Thread JSON (with artifacts_present + silence_windows) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "context",
    "meeting": "meeting_id",
    "sphere": "sphere_id",
    "participants": ["user","agent"],
    "artifacts_present": ["doc","board"],
    "silence_windows": ["t1-t2"]
  }
}
```

### Context Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `meeting` | **meeting_id** ⚡ |
| `sphere` | **sphere_id** ⚡ |
| `artifacts_present` | **["doc","board"]** ⚡ |
| `silence_windows` | **["t1-t2"] - silence intervals** ⚡ |

---

## THREAD INTERACTIONS ⚡

| Rule | Status |
|------|--------|
| threads may reference each other | ✅ |
| **no automatic merging** | ✅ ⚡ |
| **user approval required to link threads** | ✅ ⚡ |
| **every link is reversible** | ✅ ⚡ |

---

## UNIVERSE VIEW VISUALIZATION

### Visual Styles ⚡
| Thread Type | Style |
|-------------|-------|
| **FACTUAL** | straight lines (neutral color) |
| **DECISION** | **branched lines** ⚡ |
| **CONTEXT** | **soft halo background** ⚡ |

### Toggle ⚡
> **Toggle per-thread type always available.**

---

## SAFETY & ETHICS

| Guarantee | Status |
|-----------|--------|
| no sentiment | ✅ |
| no ranking | ✅ |
| no success metrics | ✅ |
| **no hidden synthesis** | ✅ ⚡ |

> **Threads SHOW history, they do not rewrite it.**

---

## WHY 3 THREADS

| Thread | Purpose |
|--------|---------|
| **Factual** | WHAT is true |
| **Decision** | WHAT was chosen |
| **Context** | WHERE & WHEN it happened |

### Together:
- **integrity**
- **clarity**
- **accountability**

---

**END — FREEZE-READY**
