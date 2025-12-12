# CHE·NU — KNOWLEDGE THREAD SYSTEM (TOPIC THREAD)
**VERSION:** FOUNDATION v1.0  
**TYPE:** CROSS-SPHERE KNOWLEDGE / NON-MANIPULATIVE

---

## GLOBAL PURPOSE

> Connect information across time, spheres, meetings, and agents WITHOUT creating narratives, bias, or authority.

### RULE
> **Knowledge Threads reveal CONNECTIONS, NOT conclusions.**

---

## DEFINITION

> A Knowledge Thread is a **TRACEABLE LINK** between:
> - topics, decisions, artifacts, meetings, agents, time

**It never interprets meaning. It only preserves context continuity.**

---

## THE 3 KNOWLEDGE THREAD TYPES

---

## THREAD TYPE 1 — TOPIC THREAD ⚡ NEW

### Purpose
Track how a **topic evolves** across contexts.

### Examples
- Same concept discussed in multiple meetings
- Topic resurfacing after long silence
- Cross-sphere conceptual reuse

### Source Inputs
- meeting metadata
- artifact tags
- user-declared topics

### Rules
| Rule | Status |
|------|--------|
| No sentiment | ✅ |
| No priority ranking | ✅ |
| No success/failure | ✅ |

### JSON Model (with first_seen/last_seen)

```json
{
  "topic_thread": {
    "thread_id": "uuid",
    "topic": "string",
    "linked_nodes": [
      { "type": "meeting|artifact|decision", "id": "uuid", "timestamp": 1712345678 }
    ],
    "first_seen": 1710000000,
    "last_seen": 1712345678
  }
}
```

### Unique Fields ⚡
| Field | Description |
|-------|-------------|
| `first_seen` | First appearance timestamp |
| `last_seen` | Most recent appearance |
| `topic` | The tracked topic string |

---

## THREAD TYPE 2 — DECISION THREAD

### Purpose
Trace how decisions emerge, change, or split over time.

### Focus
- Decision points
- Alternatives considered
- Follow-up consequences

> **IMPORTANT: NO evaluation of correctness.**

### Source Inputs
- decision logs, meeting outcomes, agent traces

### Rules
| Rule | Status |
|------|--------|
| Append-only | ✅ |
| Timestamped | ✅ |
| Immutable after validation | ✅ |

### JSON Model (with context_ref)

```json
{
  "decision_thread": {
    "thread_id": "uuid",
    "decision_topic": "string",
    "decision_points": [
      {
        "decision_id": "uuid",
        "meeting_id": "uuid",
        "timestamp": 1712000000,
        "context_ref": "replay_id"
      }
    ],
    "branching": true
  }
}
```

### New Field ⚡
| Field | Description |
|-------|-------------|
| `context_ref` | Reference to replay for full context |

---

## THREAD TYPE 3 — CONTEXT THREAD (Enhanced)

### Purpose
Preserve continuity of **CONTEXT**, not content.

### Tracks
- participants
- environment (sphere, XR preset)
- timing relationships
- **silence periods**

### Used for
- replay alignment
- understanding why information appeared
- contextual integrity

### Source Inputs
- XR replays, universe view metadata, session logs

### JSON Model (with timeline events) ⚡

```json
{
  "context_thread": {
    "thread_id": "uuid",
    "environment": {
      "sphere": "business|scholar|xr|...",
      "preset": "string",
      "participants": ["user","agent"]
    },
    "timeline": [
      { "event": "enter_meeting", "timestamp": 1712100000 },
      { "event": "silence_interval", "duration": 180 },
      { "event": "decision_logged", "timestamp": 1712100300 }
    ]
  }
}
```

### Timeline Event Types ⚡

| Event | Description |
|-------|-------------|
| `enter_meeting` | User/agent joined |
| `silence_interval` | Gap with duration (seconds) |
| `decision_logged` | Decision recorded |
| `artifact_created` | New artifact |
| `exit_meeting` | User/agent left |

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

### Topic Thread
- soft linking lines
- color-neutral
- expandable on demand

### Decision Thread
- branching lines
- **no "optimal" path highlighted**

### Context Thread
- background layers
- **time density gradients** ⚡

### User Controls
- show / hide per thread type
- filter by sphere
- lock to timeline

---

## ACCESS & PRIVACY

| Rule | Status |
|------|--------|
| Threads inherit source visibility rules | ✅ |
| Private threads never leak | ✅ |
| Sharing = explicit only | ✅ |
| Anonymization supported | ✅ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | Identifies eligible links, **no display logic** |
| `AGENT_THREAD_RENDERER` | Visualizes connections only |
| `AGENT_THREAD_GUARD` | Enforces: no interpretation, no priority, no manipulation |

---

## WHY THE 3 THREADS

| Thread | Shows |
|--------|-------|
| **Topic Thread** | WHAT persists |
| **Decision Thread** | WHEN choices diverge |
| **Context Thread** | WHY it happened there |

### Together
- **Shared understanding**
- **No imposed narrative**
- **No loss of history**

---

**END — FOUNDATION LOCK**
