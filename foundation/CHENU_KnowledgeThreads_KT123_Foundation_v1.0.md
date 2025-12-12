# CHE·NU — KNOWLEDGE THREADS (KT) FOUNDATION
**VERSION:** FOUNDATION v1.0  
**TYPE:** CROSS-SPHERE / NON-MANIPULATIVE / TRACEABLE

---

## GLOBAL PRINCIPLE

> A Knowledge Thread is a **CONTINUOUS TRACE of information** across time, spheres, agents, and contexts.

### RULE
> **Threads CONNECT facts. They NEVER infer meaning.**

---

## THE 3 KNOWLEDGE THREAD TYPES

| ID | Type | Purpose |
|----|------|---------|
| **KT-1** | FACT THREAD | Link factual information |
| **KT-2** | DECISION THREAD | Track how decisions emerged |
| **KT-3** | CONTEXT THREAD | Preserve why something was discussed |

---

## KT-1 — FACT THREAD

### Purpose
Link factual information across spheres and time **WITHOUT interpretation.**

### Sources
- documents, notes, artifacts, recordings, static data

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| immutable | ✅ |
| source-verified | ✅ |
| no sentiment | ✅ |

### Fact Thread Node Types ⚡
| Node Type | Description |
|-----------|-------------|
| `file` | File node ⚡ |
| `note` | Note node |
| `artifact` | Artifact node |
| `snapshot` | Snapshot node ⚡ |
| `reference` | Reference node |

### Fact Thread JSON (with integrity field) ⚡

```json
{
  "fact_thread": {
    "id": "uuid",
    "nodes": [
      { "type": "artifact", "source": "meeting_id", "hash": "sha256" }
    ],
    "visibility": "private|shared|public",
    "integrity": "verified"
  }
}
```

### New Field ⚡
| Field | Description |
|-------|-------------|
| `integrity` | **"verified"** - Integrity status |

---

## KT-2 — DECISION THREAD

### Purpose
Track **HOW decisions emerged** without judging if they were good or bad.

### Sources
- meetings, decision logs, agent participation, silence intervals

### Rules
| Rule | Status |
|------|--------|
| no success labels | ✅ |
| no outcome weighting | ✅ |
| no optimization | ✅ |

### Decision Thread Node Types ⚡
| Node Type | Description |
|-----------|-------------|
| `proposal` | Proposal made ⚡ |
| `alternative` | Alternative considered ⚡ |
| `decision` | Decision made |
| `defer` | Decision deferred ⚡ |
| `override` | Decision overridden ⚡ |

### Decision Thread JSON (with steps + read_only) ⚡

```json
{
  "decision_thread": {
    "id": "uuid",
    "steps": [
      { "step": "proposal", "timestamp": 1712345678 },
      { "step": "decision", "participants": ["user","agent"] }
    ],
    "sphere": "business|scholar|xr",
    "read_only": true
  }
}
```

### Step Types ⚡
| Step | Description |
|------|-------------|
| `proposal` | Proposal step |
| `decision` | Decision step |

### New Field ⚡
| Field | Description |
|-------|-------------|
| `read_only` | **true** - Always read-only |

---

## KT-3 — CONTEXT THREAD

### Purpose
Preserve **WHY something was discussed** without rewriting it later.

### Sources
- meeting context, sphere, participants, temporal state, environmental factors

### Rules
| Rule | Status |
|------|--------|
| contextual only | ✅ |
| no inference | ✅ |
| **no retrospection edits** | ✅ ⚡ |

### Context Thread Node Types ⚡
| Node Type | Description |
|-----------|-------------|
| `meeting_context` | Meeting context |
| `user_state` | **(non-emotional)** ⚡ |
| `sphere_state` | Sphere state ⚡ |
| `system_state` | System state ⚡ |

### Context Thread JSON (with meeting_type + participants count + time_window) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "context": {
      "sphere": "xr",
      "meeting_type": "analysis",
      "participants": 5,
      "time_window": "2024-05-02T10:00Z"
    },
    "immutable": true
  }
}
```

### Context Fields ⚡
| Field | Description |
|-------|-------------|
| `meeting_type` | **"analysis"** - Type of meeting ⚡ |
| `participants` | **Number (5)** not array ⚡ |
| `time_window` | **ISO 8601 format** ⚡ |

---

## THREAD INTERLINKING RULES

| Rule | Description |
|------|-------------|
| Fact threads → Decision threads | MAY link |
| Decision threads → Context threads | MAY link |
| **Context threads → backward** | **NEVER link** ⚡ |

### Graph Structure ⚡
> **Graph is DAG-only (no cycles).**

---

## THREAD VISUALIZATION (UNIVERSE VIEW) ⚡

### Visual Properties
| Property | Based On |
|----------|----------|
| Style | light paths |
| **Thickness** | **density (not importance)** ⚡ |

### Color Coding ⚡
| Thread Type | Color |
|-------------|-------|
| **Fact** | **neutral white** ⚡ |
| **Decision** | **pale blue** ⚡ |
| **Context** | **muted amber** ⚡ |

### User Actions ⚡
| Action | Available |
|--------|-----------|
| expand | ✅ |
| collapse | ✅ |
| filter | ✅ |
| **mute** | ✅ ⚡ |

---

## ACCESS & SAFETY

| Property | Status |
|----------|--------|
| visibility scoped per thread | ✅ |
| explicit user approval required | ✅ |
| **private threads never surfaced globally** | ✅ ⚡ |
| **all exports signed and hashed** | ✅ ⚡ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | assembles threads, **no interpretation** |
| `AGENT_THREAD_GUARD` | ensures immutability, **verifies links** ⚡ |
| `AGENT_THREAD_EXPLAINER` | describes structure, **no conclusions** |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **shared truth**
- **historical clarity**
- **auditability**
- **learning without rewriting reality**

---

**END — KNOWLEDGE THREAD FOUNDATION**
