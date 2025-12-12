# CHE·NU — KNOWLEDGE THREADS SYSTEM (TOPIC + ARTIFACT)
**VERSION:** FOUNDATION v1.0  
**TYPE:** CROSS-SPHERE KNOWLEDGE / NON-MANIPULATIVE

---

## GLOBAL PURPOSE

> Knowledge Threads link INFORMATION across time, spheres, meetings, agents, and users — **WITHOUT interpretation.**

### RULE
> **A Knowledge Thread connects FACTS, not opinions.**

---

## THREAD TYPES (THE 3 CORE)

| # | Type | Purpose |
|---|------|---------|
| 1 | TOPIC THREAD | Follow same subject |
| 2 | DECISION THREAD | Track decision evolution |
| 3 | ARTIFACT THREAD | Trace artifact life |

---

## 1) TOPIC THREAD ⚡ UNIQUE

### Purpose
Follow the **SAME SUBJECT** across meetings, spheres, replays, discussions.

### Examples
- "Market expansion"
- "Ethics policy"
- "XR architecture"
- "Token optimization"

### Rules
| Rule | Status |
|------|--------|
| Created manually or by explicit tagging | ✅ |
| **Never auto-generated silently** | ✅ ⚡ |
| Can span unlimited time | ✅ |
| Can be private or shared | ✅ |

### JSON Model

```json
{
  "topic_thread": {
    "id": "uuid",
    "label": "string",
    "created_by": "user_id",
    "linked_entries": ["memory_id"],
    "visibility": "private|shared|sphere",
    "created_at": 1712345678
  }
}
```

### Unique Fields ⚡
| Field | Description |
|-------|-------------|
| `label` | Topic label/name |
| `linked_entries` | Connected memory entries |

---

## 2) DECISION THREAD (with states) ⚡

### Purpose
Track HOW a decision evolved over time, including alternatives and pauses.

### Shows
- what options existed
- which meetings contributed
- when decisions changed
- **when nothing happened**

### Rules
| Rule | Status |
|------|--------|
| Append-only | ✅ |
| No evaluation labels | ✅ |
| Includes abandoned paths | ✅ |
| **Includes silence intervals** | ✅ ⚡ |

### JSON Model (with states + status)

```json
{
  "decision_thread": {
    "id": "uuid",
    "decision_label": "string",
    "states": [
      {
        "timestamp": 1712345678,
        "meeting_id": "uuid",
        "status": "considered|postponed|chosen|revisited",
        "notes_ref": "memory_id"
      }
    ],
    "visibility": "private|team|shared"
  }
}
```

### Decision States ⚡
| Status | Description |
|--------|-------------|
| `considered` | Being evaluated |
| `postponed` | Delayed |
| `chosen` | Selected |
| `revisited` | Re-examined |

---

## 3) ARTIFACT THREAD ⚡ UNIQUE

### Purpose
Trace the **life of an artifact** (document, model, plan, dataset, visual).

### Shows
- where it appeared
- who referenced it
- how it changed
- where it was reused

### Rules
| Rule | Status |
|------|--------|
| Version-aware | ✅ |
| Hash-verified | ✅ |
| **No "best version" tagging** | ✅ ⚡ |
| Immutable history | ✅ |

### JSON Model (with artifact_type + versions)

```json
{
  "artifact_thread": {
    "id": "uuid",
    "artifact_type": "doc|image|model|plan|data",
    "versions": [
      {
        "hash": "sha256",
        "meeting_id": "uuid",
        "timestamp": 1712345678
      }
    ],
    "current_visibility": "restricted|shared"
  }
}
```

### Artifact Types ⚡
| Type | Description |
|------|-------------|
| `doc` | Document |
| `image` | Image/visual |
| `model` | Model/schema |
| `plan` | Plan/strategy |
| `data` | Dataset |

---

## THREAD LINKING RULES

### Threads CAN Link To
- XR replays
- collective memory entries
- meetings
- agents (reference only)
- users (anonymizable)

### Threads CANNOT
- trigger actions
- influence routing priority
- rank importance

---

## UNIVERSE VIEW INTEGRATION

| Feature | Description |
|---------|-------------|
| Threads appear as | soft connecting lines |
| Toggle visibility | per thread type |
| Expand | to timeline |
| Collapse | to minimal marker |
| Default | **read-only** |

---

## AGENT INTERACTION

| Agent | Role |
|-------|------|
| `AGENT_THREAD_OBSERVER` | **Suggests possible thread links, requires manual approval** ⚡ |
| `AGENT_THREAD_GUARD` | Enforces rules, **blocks inferred meaning** |

### AGENT_THREAD_OBSERVER ⚡ NEW
> **"Suggests possible thread links, requires manual approval"**
- Passive observation
- Suggestions only
- User must confirm

---

## ETHICAL GUARANTEES

| Guarantee | Status |
|-----------|--------|
| No narrative shaping | ✅ |
| No "story optimization" | ✅ |
| No emotional framing | ✅ |
| Full traceability | ✅ |

---

## WHY KNOWLEDGE THREADS

### They Replace
- memory fragmentation
- narrative distortion
- lost context

### With
- **continuity**
- **accountability**
- **shared truth**

---

**END — FOUNDATION FREEZE**
