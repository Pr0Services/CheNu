# CHE·NU — KNOWLEDGE THREAD SYSTEM (STEPS + SNAPSHOT)
**VERSION:** FOUNDATION v1.0  
**MODE:** CROSS-SPHERE / NON-MANIPULATIVE / TRACEABLE

---

## GLOBAL PRINCIPLE

> A Knowledge Thread = **A TRACEABLE LINK** between facts, decisions, artifacts, and time.

### Threads DO NOT
- infer meaning
- judge outcomes
- recommend actions

> **They CONNECT — they do not conclude.**

---

## THREAD TYPES OVERVIEW

| Type | Purpose |
|------|---------|
| **THREAD TYPE A** | FACTUAL THREAD |
| **THREAD TYPE B** | DECISION THREAD |
| **THREAD TYPE C** | CONTEXTUAL THREAD |

### All threads
- immutable
- versioned
- cryptographically linked
- visible only per access rules

---

## A) FACTUAL THREAD

### Purpose
Link objective information across time & spheres.

### Used For
- documents, datasets, notes, visual artifacts, recorded events

### Rules
| Rule | Status |
|------|--------|
| connects only verified sources | ✅ |
| no interpretation layer | ✅ |
| append-only | ✅ |
| survives meeting deletion | ✅ |
| independent of users' opinions | ✅ |

### JSON Model

```json
{
  "knowledge_thread": {
    "type": "factual",
    "id": "uuid",
    "nodes": [
      { "type": "artifact", "id": "uuid", "sphere": "scholar" },
      { "type": "meeting", "id": "uuid", "sphere": "business" },
      { "type": "note", "id": "uuid", "sphere": "personal" }
    ],
    "created_at": 1712345678,
    "hash": "sha256"
  }
}
```

---

## B) DECISION THREAD (with steps) ⚡

### Purpose
Trace HOW a decision emerged across meetings, agents, alternatives, time.  
**NOT to evaluate if it was "good" or "bad".**

### Rules
| Rule | Status |
|------|--------|
| captures sequence, not judgment | ✅ |
| includes rejected paths | ✅ |
| records silence (non-decisions) | ✅ |
| links to factual threads when applicable | ✅ |

### Decision Sequence ⚡
```
context → proposals → discussions → agent inputs → final declaration
```

### JSON Model (with steps array)

```json
{
  "knowledge_thread": {
    "type": "decision",
    "id": "uuid",
    "context": "string",
    "steps": [
      { "step": "proposal", "source": "user|agent", "ref": "uuid" },
      { "step": "discussion", "meeting": "uuid" },
      { "step": "agent_input", "agent_id": "uuid" },
      { "step": "declared", "outcome": "string" }
    ],
    "timestamp": 1712345678,
    "hash": "sha256"
  }
}
```

### Step Types ⚡
| Step | Description |
|------|-------------|
| `proposal` | Initial proposal |
| `discussion` | Discussion in meeting |
| `agent_input` | Agent contribution |
| `declared` | Final declaration |

---

## C) CONTEXTUAL THREAD (with snapshot) ⚡

### Purpose
Preserve WHY things were happening at that time.

### Captures
- priorities, constraints, environment, sphere state, external factors (declared)

### Rules
| Rule | Status |
|------|--------|
| no future inference | ✅ |
| no hidden context | ✅ |
| user-declared or system-declared only | ✅ |
| expires or evolves explicitly | ✅ |

### JSON Model (with context_snapshot + validity)

```json
{
  "knowledge_thread": {
    "type": "contextual",
    "id": "uuid",
    "context_snapshot": {
      "sphere": "institution",
      "constraints": ["budget","deadline"],
      "active_agents": ["agent_x","agent_y"],
      "external_factors": ["regulation_v3"]
    },
    "valid_from": 1712345678,
    "valid_to": null,
    "hash": "sha256"
  }
}
```

### Context Snapshot Fields ⚡
| Field | Description |
|-------|-------------|
| `sphere` | Sphere context |
| `constraints` | Active constraints array |
| `active_agents` | Agents involved |
| `external_factors` | External influences |

### Validity Window ⚡
| Field | Description |
|-------|-------------|
| `valid_from` | Start of validity |
| `valid_to` | End of validity (null = ongoing) |

---

## THREAD LINKING RULES

| Rule | Status |
|------|--------|
| Threads may reference each other | ✅ |
| Reference is always explicit | ✅ |
| No automatic merging | ✅ |
| Cross-thread view is READ-ONLY | ✅ |

### Thread Link JSON ⚡

```json
{
  "thread_link": {
    "from_thread": "uuid",
    "to_thread": "uuid",
    "relation": "supports|precedes|coexists"
  }
}
```

### Link Relations ⚡
| Relation | Description |
|----------|-------------|
| `supports` | One thread supports another |
| `precedes` | Temporal ordering |
| `coexists` | Same time period |

---

## VISUALIZATION (UNIVERSE VIEW)

| Property | Meaning |
|----------|---------|
| thickness | = number of references |
| color | = thread type |
| click | opens timeline viewer |
| toggle | per thread type |

---

## SAFETY & ETHICS

| Rule | Status |
|------|--------|
| No scoring | ✅ |
| No ranking | ✅ |
| No truth labeling | ✅ |
| No consensus forcing | ✅ |
| Transparency mandatory | ✅ |

---

## WHY THIS MATTERS

> **Facts stay facts.**  
> **Decisions stay traceable.**  
> **Context stays remembered.**

> **No memory rewriting. No narrative control.**

---

**END — KNOWLEDGE THREAD SYSTEM**
