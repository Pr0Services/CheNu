# CHE·NU — KNOWLEDGE THREADS SYSTEM (CONTEXT FIELDS)
**VERSION:** FOUNDATION v1.0  
**TYPE:** TRUTH LINKING / NON-MANIPULATIVE / CROSS-SPHERE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE LINK** between facts, events, artifacts, decisions, across time, meetings, agents, users, and spheres.

### RULE
> **Thread = CONNECTION, NOT CONCLUSION.**

> Threads expose relationships.  
> They **NEVER infer intent.**  
> They **NEVER judge.**

---

## THREAD TYPE #1 — FACT THREAD

### Purpose
Link OBJECTIVE FACTS across the system.

### Examples
- Same document used in multiple meetings
- Same data referenced across spheres
- Same decision reiterated over time

### Sources
- Documents, Visual boards, Data artifacts, Replays, Logs

### Rules
| Rule | Status |
|------|--------|
| Must originate from verifiable source | ✅ |
| Must include timestamp + hash | ✅ |
| Must be immutable | ✅ |
| Must remain neutral | ✅ |

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "fact",
    "source_nodes": ["artifact_id","replay_id"],
    "linked_nodes": ["decision_id","meeting_id"],
    "created_at": 1712345678,
    "hash": "sha256",
    "visibility": "private|shared|sphere"
  }
}
```

---

## THREAD TYPE #2 — CONTEXT THREAD (with context_fields) ⚡

### Purpose
Explain **UNDER WHAT CONDITIONS** facts or decisions occurred.

### Examples
- Same topic discussed in different moods or setups
- Same agent present but inactive
- Silence around an important artifact

### Sources
- Meeting metadata, XR room presets, Participant composition, Timeline gaps (silence intervals)

### Rules
| Rule | Status |
|------|--------|
| Descriptive only | ✅ |
| No emotional labels | ✅ |
| No success/failure tags | ✅ |
| **Cannot override Fact Threads** | ✅ ⚡ |

### JSON Model (with context_fields) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "context",
    "related_events": ["meeting_id_1","meeting_id_2"],
    "context_fields": {
      "room_preset": "xr_meeting_analysis",
      "participants_count": 6,
      "duration": 4200,
      "silence_ratio": 0.18
    },
    "created_at": 1712345678,
    "hash": "sha256"
  }
}
```

### Context Fields ⚡
| Field | Description |
|-------|-------------|
| `room_preset` | XR room configuration used |
| `participants_count` | Number of participants |
| `duration` | Duration in seconds |
| `silence_ratio` | Ratio of silence (0.0-1.0) |

---

## THREAD TYPE #3 — EVOLUTION THREAD

### Purpose
Show HOW understanding or structure evolved **without assigning correctness.**

### Examples
- Topic refined over multiple meetings
- Architecture plan iterations
- Avatar state evolution over long projects

### Sources
- Versioned artifacts, Updated plans, Replay comparisons, Change logs

### Rules
| Rule | Status |
|------|--------|
| Sequence only (no direction bias) | ✅ |
| All versions preserved | ✅ |
| Rollback possible | ✅ |
| Must link to original source | ✅ |

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "evolution",
    "sequence": [
      { "ref": "v1_artifact", "timestamp": 1710000000 },
      { "ref": "v2_artifact", "timestamp": 1710500000 }
    ],
    "scope": "personal|team|sphere",
    "hash": "sha256"
  }
}
```

---

## THREAD VISUALIZATION (UNIVERSE VIEW) ⚡

| Thread Type | Style |
|-------------|-------|
| **Fact Threads** | solid lines |
| **Context Threads** | dotted lines |
| **Evolution Threads** | **animated flow** ⚡ |

### Adaptive Density ⚡
> **Thread density adapts to user profile**
- More experienced users see more threads
- Beginners see simplified view
- User controls density level

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_EXTRACTOR` | Scans eligible data, **no interpretation** |
| `AGENT_THREAD_VALIDATOR` | Verifies integrity, **blocks speculation** |
| `AGENT_THREAD_RENDERER` | Visual mapping only, **no hierarchy injection** |

---

## ETHICAL GUARANTEES

| Guarantee | Status |
|-----------|--------|
| No narrative shaping | ✅ |
| No ranking of threads | ✅ |
| No ideology propagation | ✅ |
| Full transparency | ✅ |

---

## WHY THIS MATTERS

Threads allow:
- **clarity without pressure**
- **understanding without persuasion**
- **shared reality without conformity**

---

**END — KNOWLEDGE THREADS**
