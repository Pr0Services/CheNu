# CHE·NU — KNOWLEDGE THREAD SYSTEM (RELATION THREAD)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / APPEND-ONLY

---

## GLOBAL PRINCIPLE

> **Knowledge Threads = STRUCTURED CONTINUITY OF INFORMATION** across time, spheres, meetings, users, agents.

### THREADS DO NOT
- infer meaning
- rank truth
- optimize outcomes
- suggest conclusions

> **They CONNECT facts. Nothing more.**

---

## THREAD 1 — FACT THREAD

### Purpose
Link verifiable events, artifacts, and decisions into a continuous factual line.

### Use Cases
- audit, recall, replay, accountability

### Sources
- meetings (XR / 2D), replays, decisions logs, documents, agent actions (trace-only)

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| immutable after validation | ✅ |
| time-indexed | ✅ |
| source-referenced | ✅ |
| hash-verified | ✅ |

### JSON Model

```json
{
  "fact_thread": {
    "thread_id": "uuid",
    "entries": [
      {
        "entry_id": "uuid",
        "type": "event|decision|artifact",
        "source": "meeting|replay|document",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr|...",
        "hash": "sha256"
      }
    ],
    "integrity": "verified"
  }
}
```

### Visual
- linear timeline
- no branching
- exact order preserved

---

## THREAD 2 — CONTEXT THREAD (with profile_used + sphere_state) ⚡

### Purpose
Preserve SURROUNDING CONDITIONS of facts **without altering the facts themselves.**

### Context Answers
- where
- under which constraints
- with whom
- under which configuration

### Sources
- meeting configuration, avatar states (non-emotive), sphere state, navigation profile used, permissions at that time

### Rules
| Rule | Status |
|------|--------|
| **context never modifies fact** | ✅ ⚡ |
| detachable / attachable | ✅ |
| optional visibility | ✅ |
| private by default | ✅ |

### JSON Model (with profile_used + sphere_state)

```json
{
  "context_thread": {
    "thread_id": "uuid",
    "linked_fact_thread": "uuid",
    "context_entries": [
      {
        "timestamp": 1712345678,
        "location": "xr_meeting_classic",
        "participants": ["user","agent"],
        "sphere_state": "business_focus",
        "profile_used": "focus_mode"
      }
    ]
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `sphere_state` | State of sphere at that moment |
| `profile_used` | Navigation profile active |
| `location` | XR/2D location identifier |

### Visual ⚡
| Feature | Description |
|---------|-------------|
| **overlay rings** | Context shown as rings ⚡ |
| collapsible panels | Expandable detail |
| **never replaces main timeline** | Non-intrusive |

---

## THREAD 3 — RELATION THREAD ⚡ UNIQUE

### Purpose
Show how facts relate across spheres, meetings, projects, people **WITHOUT defining causality or meaning.**

### Sources
- shared topics, shared artifacts, temporal proximity, shared participants

### Rules
| Rule | Status |
|------|--------|
| **no directionality implied** | ✅ ⚡ |
| no strength scoring | ✅ |
| no success labels | ✅ |
| fully explorable | ✅ |

### JSON Model

```json
{
  "relation_thread": {
    "thread_id": "uuid",
    "links": [
      {
        "from": "fact_entry_id",
        "to": "fact_entry_id",
        "type": "shared_artifact|shared_topic|shared_participant"
      }
    ]
  }
}
```

### Relation Types ⚡
| Type | Description |
|------|-------------|
| `shared_artifact` | Same artifact used |
| `shared_topic` | Same topic discussed |
| `shared_participant` | Same person/agent involved |

### Visual ⚡
| Feature | Description |
|---------|-------------|
| graph links | Network visualization |
| **user-expandable only** | Not auto-expanded |
| filtered by sphere / time | User controls scope |

---

## THREAD INTERACTION RULES

| Thread | Role |
|--------|------|
| **Fact Thread** | PRIMARY |
| **Context Thread** | OPTIONAL OVERLAY |
| **Relation Thread** | OPTIONAL MAP |

### User Can
- toggle each independently
- combine safely
- **reset to neutral view anytime**

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Constructs threads, **no inference** |
| `AGENT_THREAD_VALIDATOR` | Checks integrity, **blocks modification** |
| `AGENT_THREAD_EXPLAINER` | Explains links in plain language, **no interpretation** |

---

## WHY 3 THREADS

| Thread | Ensures |
|--------|---------|
| **Fact** | TRUTH |
| **Context** | FAIRNESS |
| **Relation** | UNDERSTANDING |

### Together
- **no narrative abuse**
- **no manipulation**
- **no ambiguity drift**

---

**END — FOUNDATION FREEZE**
