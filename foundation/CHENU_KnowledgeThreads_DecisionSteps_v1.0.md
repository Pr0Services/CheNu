# CHE·NU — KNOWLEDGE THREADS SYSTEM (DECISION STEPS)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / CROSS-SPHERE / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> **Knowledge Thread = A TRACEABLE LINE OF KNOWLEDGE** linking facts, artifacts, decisions, and context across time, meetings, agents, and spheres.

### RULE
> **Threads CONNECT information.**  
> **They NEVER infer meaning, intent, or conclusions.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Track objective information across the system.

### Sources
- documents, notes, data artifacts, confirmed statements, XR replay snapshots

### Characteristics
| Property | Value |
|----------|-------|
| immutable | ✅ |
| timestamped | ✅ |
| source-locked | ✅ |
| replay-verifiable | ✅ |

### Use Cases
- "Where did this come from?"
- "When was this stated?"
- "Which meetings referenced this?"

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "origin": "document|meeting|replay",
    "references": [
      { "source_id": "uuid", "timestamp": 1712345678 }
    ],
    "hash": "sha256",
    "visibility": "private|shared|public"
  }
}
```

---

## THREAD TYPE 2 — DECISION THREAD (with steps + events + final_state) ⚡

### Purpose
Track **HOW decisions emerged, not WHETHER they were right.**

### Sources
- meetings, decision logs, approvals, veto points, silence moments

### Characteristics
| Property | Value |
|----------|-------|
| chronological | ✅ |
| **non-evaluative** | ✅ ⚡ |
| context-preserving | ✅ |
| replay-linked | ✅ |

### Use Cases
- "How did we reach this outcome?"
- "What alternatives existed?"
- "Where did discussion stop?"

### JSON Model (with steps + event types + time + final_state) ⚡

```json
{
  "decision_thread": {
    "id": "uuid",
    "decision_id": "uuid",
    "steps": [
      { "event": "proposal", "source": "uuid", "time": 0.12 },
      { "event": "discussion", "source": "uuid", "time": 1.47 },
      { "event": "confirmation", "source": "uuid", "time": 2.04 }
    ],
    "linked_replays": ["uuid"],
    "final_state": "accepted|deferred|abandoned"
  }
}
```

### Event Types ⚡
| Event | Description |
|-------|-------------|
| `proposal` | Initial proposal |
| `discussion` | Discussion phase |
| `confirmation` | Final confirmation |

### Time Field ⚡
> **Float value representing position in replay timeline** (e.g., 1.47 = 1m47s)

### Final State ⚡
| State | Description |
|-------|-------------|
| `accepted` | Decision approved |
| `deferred` | Decision postponed |
| `abandoned` | Decision dropped |

---

## THREAD TYPE 3 — CONTEXT THREAD (with duration + info_density) ⚡

### Purpose
Preserve situational context surrounding information **WITHOUT encoding emotions or narratives.**

### Sources
- meeting type, sphere, participants, time pressure, data density

### Characteristics
| Property | Value |
|----------|-------|
| descriptive only | ✅ |
| no interpretation | ✅ |
| used for orientation & comparison | ✅ |

### Use Cases
- "Under what conditions was this created?"
- "Was this exploratory or operational?"
- "Which sphere context applied?"

### JSON Model (with duration + info_density) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "sphere": "business|scholar|xr|...",
    "meeting_type": "explore|review|decision",
    "participants_count": 6,
    "duration": 3600,
    "info_density": 0.7
  }
}
```

### Context Fields ⚡
| Field | Description |
|-------|-------------|
| `meeting_type` | explore / review / decision |
| `duration` | Seconds (e.g., 3600 = 1 hour) |
| `info_density` | 0.0-1.0 density score |

---

## THREAD LINKING LOGIC

| Rule | Status |
|------|--------|
| Threads may intersect | ✅ |
| Intersection = reference only | ✅ |
| No automatic fusion | ✅ |
| User must opt-in to view combined | ✅ |

### Example
> Fact Thread ↔ Decision Thread ↔ Context Thread

---

## VISUALIZATION (UNIVERSE VIEW / XR) ⚡

| Property | Value |
|----------|-------|
| Display | Threads as lines |
| Thickness | = reference count |
| Color | = thread type |
| **Hover** | **= source preview** ⚡ |
| **Click** | **= replay / artifact jump** ⚡ |

### Hover = Source Preview ⚡
> **Mouse over any node to see preview of source content**

### Click = Replay/Artifact Jump ⚡
> **Click any node to jump directly to replay or artifact**

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Creates threads from validated sources |
| `AGENT_THREAD_GUARD` | Verifies integrity & scope |
| `AGENT_THREAD_EXPLAINER` | Explains thread content **WITHOUT inference** |

---

## ETHICAL LOCKS

| Lock | Status |
|------|--------|
| No narrative synthesis | ✅ |
| No implicit conclusions | ✅ |
| No hidden relevance scoring | ✅ |
| Full transparency | ✅ |

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **clarity without bias**
- **memory without distortion**
- **learning without manipulation**

> **CHE·NU remembers.**  
> **It does not rewrite.**

---

**END — CORE FREEZE**
