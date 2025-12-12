# CHE·NU — KNOWLEDGE THREADS SYSTEM (FACTUAL/CONTEXTUAL/EXPLORATORY)
**VERSION:** FOUNDATION v1.0  
**MODE:** STRUCTURAL / NON-MANIPULATIVE / FREEZE-READY

---

## GLOBAL PURPOSE

> Knowledge Threads link information across time, meetings, spheres, agents, and users **WITHOUT interpretation, ranking, or narrative control.**

### RULE
> **Threads connect FACTS, not opinions.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Link concrete, verifiable information across the system.

### Examples
- Same document referenced in multiple meetings
- Same decision appearing in different contexts
- Same data artifact reused across spheres

### Factual Thread Properties ⚡
| Property | Status |
|----------|--------|
| **Deterministic** | ✅ ⚡ |
| Immutable | ✅ |
| Source-verified | ✅ |
| **Replay-traceable** | ✅ ⚡ |

### Factual Thread JSON (with origin + nodes array) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "origin": "meeting|document|decision",
    "nodes": [
      { "type": "artifact", "id": "uuid" },
      { "type": "meeting", "id": "uuid" }
    ],
    "created_at": 1712345678,
    "hash": "sha256"
  }
}
```

### Factual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **"factual"** ⚡ |
| `origin` | **meeting/document/decision** ⚡ |
| `nodes[].type` | **artifact/meeting** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **Auto-created only from validated sources** | ✅ ⚡ |
| Cannot be edited | ✅ |
| **Can only grow by reference** | ✅ ⚡ |

---

## THREAD TYPE 2 — CONTEXTUAL THREAD

### Purpose
Link information by **shared context, not identity.**

### Examples
- Same topic discussed in different meetings
- Same objective across different spheres
- Same method used at different times

### Contextual Thread Properties ⚡
| Property | Status |
|----------|--------|
| **Soft linkage** | ✅ ⚡ |
| **Visibility depends on user profile** | ✅ ⚡ |
| Explicitly labeled as contextual | ✅ |

### Contextual Thread JSON (with context object + confidence) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "contextual",
    "context": {
      "topic": "string",
      "sphere": "optional",
      "time_window": "optional"
    },
    "nodes": [
      { "type": "meeting", "id": "uuid" },
      { "type": "replay", "id": "uuid" }
    ],
    "confidence": 0.0-1.0
  }
}
```

### Contextual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **"contextual"** ⚡ |
| `context.topic` | **String** ⚡ |
| `context.sphere` | **Optional** |
| `context.time_window` | **Optional** ⚡ |
| `confidence` | **0.0-1.0** ⚡ |
| `nodes[].type` | **meeting/replay** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **Never auto-merged with factual threads** | ✅ ⚡ |
| Always marked as contextual | ✅ |
| **User can mute or hide** | ✅ ⚡ |

---

## THREAD TYPE 3 — EXPLORATORY THREAD

### Purpose
Allow **SAFE exploration** of emerging relationships WITHOUT validating them as truth.

### Examples
- Hypotheses
- Early research links
- Cross-domain idea exploration

### Exploratory Thread Properties ⚡
| Property | Status |
|----------|--------|
| **Manual or agent-assisted** | ✅ ⚡ |
| Explicitly marked as speculative | ✅ |
| **No effect on routing priority** | ✅ ⚡ |

### Exploratory Thread JSON (with hypothesis + status) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "exploratory",
    "created_by": "user|agent",
    "hypothesis": "string",
    "nodes": [
      { "type": "any", "id": "uuid" }
    ],
    "status": "draft|paused|validated|archived"
  }
}
```

### Exploratory Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **"exploratory"** ⚡ |
| `created_by` | **user/agent** ⚡ |
| `hypothesis` | **String** ⚡ |
| `nodes[].type` | **"any"** ⚡ |
| `status` | **draft/paused/validated/archived** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **Cannot influence decisions** | ✅ ⚡ |
| **Cannot escalate visibility** | ✅ ⚡ |
| **Cannot auto-upgrade to factual** | ✅ ⚡ |

---

## THREAD VISUALIZATION RULES

### Visual Styles ⚡
| Thread Type | Style | Color |
|-------------|-------|-------|
| **FACTUAL** | **solid line** | neutral color |
| **CONTEXTUAL** | **dashed line** ⚡ | muted color |
| **EXPLORATORY** | **dotted line** ⚡ | **low opacity** ⚡ |

### Thread Visibility Respects ⚡
| Factor | Status |
|--------|--------|
| user profile | ✅ |
| sphere permissions | ✅ |
| **session mode** | ✅ ⚡ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | detects eligible links, **proposes thread creation** ⚡ |
| `AGENT_THREAD_GUARD` | enforces type separation, **blocks invalid upgrades** ⚡ |
| `AGENT_THREAD_EXPLAINER` | describes why nodes linked, **human-readable only** ⚡ |

---

## WHY THREE THREAD TYPES

| Type | Purpose |
|------|---------|
| **FACTUAL** | truth |
| **CONTEXTUAL** | understanding |
| **EXPLORATORY** | discovery |

### Separated to Avoid ⚡
- **misinformation**
- **narrative manipulation**
- **false certainty**

---

**END — KNOWLEDGE THREADS**
