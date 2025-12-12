# CHE·NU — KNOWLEDGE THREADS SYSTEM (STATE + OPERATIONS)
**VERSION:** FOUNDATION v1.0  
**MODE:** NON-MANIPULATIVE / TRACEABLE / FREEZE-READY

---

## WHAT IS A KNOWLEDGE THREAD

> A Knowledge Thread is a **VERIFIED LINK** between information across time, meetings, spheres, agents, and users.

### THREADS DO NOT
- ❌ infer meaning
- ❌ rank truth
- ❌ optimize outcomes

### THREADS ONLY
- ✅ connect facts
- ✅ show continuity
- ✅ preserve traceability

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Link concrete information that references the SAME FACT.

### Examples
- same document cited in 3 meetings
- same metric reused over time
- same decision referenced later

### Rules
| Rule | Status |
|------|--------|
| factual reference only | ✅ |
| must point to concrete artifact | ✅ |
| immutable after validation | ✅ |
| **version-aware** | ✅ ⚡ |

### JSON Model

```json
{
  "knowledge_thread": {
    "type": "fact",
    "thread_id": "uuid",
    "fact_source": "artifact|metric|document",
    "linked_entries": [
      { "entry_id": "uuid", "timestamp": 1712345678 }
    ],
    "hash": "sha256",
    "status": "verified"
  }
}
```

---

## THREAD TYPE 2 — DECISION THREAD (with state) ⚡

### Purpose
Track how a DECISION evolves across time and context **WITHOUT evaluating its quality.**

### Examples
- decision revisited
- decision adapted
- decision deferred

### Rules
| Rule | Status |
|------|--------|
| chronological only | ✅ |
| no success/failure labels | ✅ |
| no recommendations | ✅ |
| **shows forks & pauses** | ✅ ⚡ |

### JSON Model (with state)

```json
{
  "knowledge_thread": {
    "type": "decision",
    "thread_id": "uuid",
    "origin_decision": "decision_id",
    "timeline": [
      {
        "meeting_id": "uuid",
        "state": "proposed|confirmed|modified|paused",
        "timestamp": 1712345678
      }
    ],
    "hash": "sha256"
  }
}
```

### Decision States ⚡

| State | Description |
|-------|-------------|
| `proposed` | Initial proposal |
| `confirmed` | Approved/accepted |
| `modified` | Changed from original |
| `paused` | Temporarily deferred |

---

## THREAD TYPE 3 — CONTEXT THREAD (with signals) ⚡

### Purpose
Link related CONTEXTS that shape understanding **WITHOUT implying intent or causality.**

### Examples
- same topic across different spheres
- recurring agent presence
- repeating constraints

### Rules
| Rule | Status |
|------|--------|
| contextual association only | ✅ |
| visibility depends on permissions | ✅ |
| no emotional or psychological tagging | ✅ |

### JSON Model (with context_signals + label)

```json
{
  "knowledge_thread": {
    "type": "context",
    "thread_id": "uuid",
    "context_signals": [
      {
        "source": "meeting|agent|sphere",
        "label": "string",
        "timestamp": 1712345678
      }
    ],
    "scope": "personal|team|organization",
    "hash": "sha256"
  }
}
```

### Context Signal Fields ⚡
| Field | Description |
|-------|-------------|
| `source` | meeting / agent / sphere |
| `label` | Human-readable label |
| `timestamp` | When detected |

---

## THREAD OPERATIONS (READ-ONLY BY DEFAULT) ⚡

### ✅ Allowed
| Operation | Description |
|-----------|-------------|
| `view` | Read thread |
| `follow` | Track over time |
| `filter` | Narrow by criteria |
| `export` | PDF / JSON |
| `overlay` | Show in universe view |

### ❌ Disallowed
| Operation | Description |
|-----------|-------------|
| `auto-merge` | No automatic combining |
| `auto-prioritize` | No automatic ranking |
| `auto-hide` | No hiding alternatives |

---

## THREAD VISUALIZATION RULES

| Rule | Description |
|------|-------------|
| Shape | Soft lines |
| Arrows | **No arrow dominance** |
| Thickness | = frequency, **NOT importance** |
| Color | = thread type only |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_DETECTOR` | Detects candidate links, **never auto-confirms** |
| `AGENT_THREAD_VALIDATOR` | Checks integrity, enforces rules |
| `AGENT_THREAD_RENDERER` | Visual only, **no interpretation** |

---

## WHY THREADS MATTER

### They allow
- memory continuity
- shared understanding
- long-term clarity

### WITHOUT
- narrative control
- hidden influence
- rewritten history

---

## THREAD SYSTEM GUARANTEES ⚡

| Guarantee | Description |
|-----------|-------------|
| **One reality** | Single source of truth |
| **Multiple views** | Different perspectives allowed |
| **Total traceability** | Full audit trail |
| **Zero manipulation** | No hidden influence |

---

**END — KNOWLEDGE THREADS COMPLETE**
