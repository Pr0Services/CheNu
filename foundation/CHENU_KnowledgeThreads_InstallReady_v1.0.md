# CHE·NU — KNOWLEDGE THREAD SYSTEM (INSTALL-READY)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / INSTALL-READY

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **CONTINUOUS TRACE of understanding**, linking: information, actions, decisions, artifacts, memory.

### RULE
> **Threads CONNECT facts. They NEVER conclude, judge, or persuade.**

---

## THE 3 KNOWLEDGE THREAD TYPES

| # | Type | ID |
|---|------|-----|
| 1 | Information Thread | `THREAD_TYPE_INFORMATION` |
| 2 | Decision Thread | `THREAD_TYPE_DECISION` |
| 3 | Evolution Thread | `THREAD_TYPE_EVOLUTION` |

> **All share the same core structure but differ in allowed content.**

---

## 1) INFORMATION THREAD ⚡

### Purpose
Track how knowledge is discovered, referenced, and reused across spheres.

### Sources
- documents, notes, messages, research, external references

### Shows
| Shows | Description |
|-------|-------------|
| WHERE info appeared | Location tracking |
| WHEN it was reused | Temporal tracking |
| HOW it propagated | Propagation tracking |

### Does NOT Show
| Does NOT Show | Reason |
|---------------|--------|
| correctness | No judgment |
| importance | No ranking |
| intention | No inference |

### JSON Model (with origin + nodes) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "information",
    "origin": {
      "sphere": "scholar|business|...",
      "source_id": "artifact_uuid",
      "timestamp": 1712345678
    },
    "nodes": [
      {
        "ref_type": "artifact|note|message",
        "ref_id": "uuid",
        "used_in": "meeting|decision|research",
        "timestamp": 1712349999
      }
    ],
    "visibility": "private|shared|public"
  }
}
```

### Origin Block ⚡
| Field | Description |
|-------|-------------|
| `sphere` | Source sphere |
| `source_id` | Artifact UUID |
| `timestamp` | Creation time |

### Node Fields ⚡
| Field | Description |
|-------|-------------|
| `ref_type` | artifact / note / message |
| `ref_id` | Reference UUID |
| `used_in` | meeting / decision / research |
| `timestamp` | When used |

---

## 2) DECISION THREAD (with timeline + steps) ⚡

### Purpose
Trace HOW decisions were formed over time, from facts to outcome.

### Sources
- meetings, replays, decision logs, votes (if any)

### Shows
| Shows | Description |
|-------|-------------|
| inputs considered | What was considered |
| discussions involved | Who discussed |
| sequence of decisions | Step by step |

### STRICT RULE
> **No outcome rating. No "better/worse" label.**

### JSON Model (with timeline + steps) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "decision",
    "objective": "string",
    "inputs": ["artifact_uuid","memory_event_uuid"],
    "timeline": [
      {
        "step": 1,
        "source": "meeting_uuid",
        "action": "discussed",
        "timestamp": 1712350000
      },
      {
        "step": 2,
        "source": "decision_uuid",
        "action": "declared",
        "timestamp": 1712351200
      }
    ],
    "visibility": "restricted"
  }
}
```

### Timeline Fields ⚡
| Field | Description |
|-------|-------------|
| `step` | Step number (1, 2, 3...) |
| `source` | meeting_uuid / decision_uuid |
| `action` | discussed / declared |
| `timestamp` | When |

### Action Types ⚡
| Action | Description |
|--------|-------------|
| `discussed` | Topic was discussed |
| `declared` | Decision was declared |

---

## 3) EVOLUTION THREAD (with versions + reason) ⚡

### Purpose
Show how understanding or structure evolved **WITHOUT implying improvement or failure.**

### Sources
- avatar evolution states, plan changes, architecture revisions, navigation profile changes

### Shows
| Shows | Description |
|-------|-------------|
| VERSION CHANGES over time | Version history |
| CONTEXT of change | Why changed |
| REVERSIBILITY | Can be reversed |

### JSON Model (with versions + reason) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "evolution",
    "subject": "avatar|plan|sphere|profile",
    "versions": [
      {
        "version": 1,
        "state": "initial",
        "timestamp": 1712300000
      },
      {
        "version": 2,
        "state": "updated",
        "reason": "context change",
        "timestamp": 1712400000
      }
    ],
    "visibility": "private"
  }
}
```

### Subject Types ⚡
| Subject | Description |
|---------|-------------|
| `avatar` | Avatar evolution |
| `plan` | Plan changes |
| `sphere` | Sphere evolution |
| `profile` | Profile changes |

### Version Fields ⚡
| Field | Description |
|-------|-------------|
| `version` | Version number |
| `state` | initial / updated / etc. |
| `reason` | Why changed (optional) |
| `timestamp` | When |

---

## THREAD LINKING & GRAPH

### Threads can LINK to
- other threads
- collective memory
- meetings
- spheres

### Graph Rules
| Rule | Status |
|------|--------|
| no cycles forced | ✅ |
| no ranking | ✅ |
| no compression | ✅ |

### Link Model (with overlaps) ⚡

```json
{
  "thread_link": {
    "from_thread": "uuid",
    "to_thread": "uuid",
    "relation": "references|follows|overlaps"
  }
}
```

### Relation Types ⚡
| Relation | Description |
|----------|-------------|
| `references` | One thread references another |
| `follows` | One thread follows another |
| `overlaps` | Threads overlap in content ⚡ |

---

## UNIVERSE VIEW INTEGRATION ⚡

### Capabilities
| Feature | Description |
|---------|-------------|
| highlight active threads | Show current threads |
| dim unrelated nodes | Reduce visual noise |
| show thread path overlay | Display paths |
| toggle thread types | Filter by type |

### Defaults
| Default | Value |
|---------|-------|
| threads | **OFF (manual activation)** |
| color-coded | by type |
| access | read-only unless owner |

---

## SAFETY & ETHICS

| Property | Status |
|----------|--------|
| Threads are factual | ✅ |
| No manipulation | ✅ |
| No narrative steering | ✅ |
| Full transparency | ✅ |
| User always controls visibility | ✅ |

---

## WHY THREADS MATTER

Threads provide:
- **continuity without pressure**
- **memory without distortion**
- **understanding without control**

This is how CHE·NU:
- stays truthful
- scales safely
- remains human-aligned

---

**END — READY FOR INSTALL**
