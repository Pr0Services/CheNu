# CHE·NU — KNOWLEDGE THREADS SYSTEM (CONFIDENCE + RELATIONS)
**VERSION:** FOUNDATION v1.0  
**MODE:** NON-MANIPULATIVE / TRACEABLE / FREEZE-READY

---

## CORE PRINCIPLE

> **Knowledge Threads = CONTINUOUS CONTEXT LINES**  
> Linking facts, decisions, artifacts over time  
> WITHOUT interpretation, ranking, or persuasion.

### Rule
> **Threads SHOW RELATIONS.**  
> **They do NOT decide meaning.**

---

## THREAD TYPES (THE 3)

1. **PERSONAL THREAD**
2. **COLLECTIVE THREAD**
3. **INTER-SPHERE THREAD**

---

## SHARED RULES (ALL THREADS)

| Rule | Status |
|------|--------|
| append-only | ✅ |
| time-ordered | ✅ |
| source-backed | ✅ |
| hash-verified | ✅ |
| read-only by default | ✅ |
| no sentiment | ✅ |
| no scoring | ✅ |
| no inference | ✅ |

---

## 1) PERSONAL KNOWLEDGE THREAD

### Purpose
Track a **SINGLE user's continuous context** across sessions, meetings, notes, replays.

### Sources
- personal meetings
- personal notes
- viewed replays
- explicit bookmarks
- user-authored decisions

### Visibility
- **private by default**
- sharable explicitly

### Use Cases
- personal continuity
- recall
- review
- learning trace

### JSON Model

```json
{
  "personal_thread": {
    "user_id": "uuid",
    "entries": [
      {
        "id": "uuid",
        "type": "event|decision|artifact|replay",
        "source_id": "uuid",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ]
  }
}
```

---

## 2) COLLECTIVE KNOWLEDGE THREAD

### Purpose
Represent **SHARED factual continuity** across teams or groups.

### Sources
- validated meetings
- shared decisions
- approved artifacts
- collective replays

### Visibility
- **group-scoped**
- role-filtered

### Use Cases
- team memory
- accountability
- historical trace
- coordination

### Rules
- no individual interpretation
- no personal annotations embedded
- references only

### JSON Model

```json
{
  "collective_thread": {
    "group_id": "uuid",
    "entries": [
      {
        "id": "uuid",
        "type": "decision|artifact|context",
        "meeting_id": "uuid",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ]
  }
}
```

---

## 3) INTER-SPHERE KNOWLEDGE THREAD (with CONFIDENCE)

### Purpose
Link **RELATED knowledge across spheres** WITHOUT merging domains.

### Sources
- shared artifacts
- shared topics
- sequential decisions
- cross-sphere meetings

### Visibility
- abstracted
- **metadata-only**
- privacy-preserving

### Use Cases
- discovery
- impact mapping
- systemic overview

### Rules
- no raw content propagation
- only references + hashes
- no forced linkage

### JSON Model (with confidence + relation)

```json
{
  "inter_sphere_thread": {
    "spheres": ["business","scholar","xr"],
    "links": [
      {
        "from": "entry_id",
        "to": "entry_id",
        "relation": "references|follows|influenced_by",
        "confidence": 0.85
      }
    ]
  }
}
```

### Relation Types

| Relation | Meaning |
|----------|---------|
| `references` | Direct citation/link |
| `follows` | Temporal sequence |
| `influenced_by` | Structural connection (NOT causal) |

### Confidence Score
- Range: `0.0 - 1.0`
- Based on: hash matches, temporal proximity, shared participants
- **NOT a quality judgment**

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

| Element | Behavior |
|---------|----------|
| Threads | soft lines |
| Thickness | = number of references |
| Color | = thread type |
| Toggle | user can toggle each layer |
| Hover | reveals source list only |

### Forbidden Visuals
| Element | Status |
|---------|--------|
| Arrows implying causation | ❌ |
| Success/failure color codes | ❌ |
| Emotional gradients | ❌ |

---

## THREAD GOVERNANCE

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles threads, **no interpretation** |
| `AGENT_THREAD_GUARD` | Enforces rules, **blocks unsafe linkage** |
| `AGENT_THREAD_EXPLAINER` | Explains why link exists, **human-readable only** |

---

## WHY THIS MATTERS

| Thread | Provides |
|--------|----------|
| **Personal Thread** | continuity |
| **Collective Thread** | shared truth |
| **Inter-Sphere Thread** | systemic clarity |

### Together
- **memory without bias**
- **structure without control**
- **intelligence without power**

---

**END — FOUNDATION FREEZE**
