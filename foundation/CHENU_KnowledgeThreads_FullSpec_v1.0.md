# CHE·NU — KNOWLEDGE THREAD SYSTEM (FULL SPEC)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE LINE OF KNOWLEDGE** connecting information across: time, meetings, spheres, agents, users.

### RULE
> **Thread = CONNECTION OF FACTS**  
> NOT conclusions, NOT opinions, NOT narratives.

---

## THREAD TYPE A — FACTUAL THREAD (with edges relation) ⚡

### Purpose
Track objective information continuity.

### Examples
- the same concept referenced over time
- a document evolving
- a recurring technical constraint

### Sources
- meeting artifacts, documents, notes, decisions (fact-only)

### Structure

#### FACT_NODE ⚡
| Field | Description |
|-------|-------------|
| `content_hash` | Content hash |
| `source_id` | Source identifier |
| `timestamp` | Time |
| `sphere` | Sphere |
| `visibility` | Access level |

#### THREAD EDGE ⚡
| Type | Description |
|------|-------------|
| `reference` | References |
| `continuation` | Continues |
| `revision` | Revises |
| `reuse` | Reuses |

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": [
      {
        "node_id": "uuid",
        "source": "meeting|doc|note",
        "timestamp": 1712345678,
        "sphere": "business|scholar|...",
        "hash": "sha256"
      }
    ],
    "edges": [
      {
        "from": "node_id",
        "to": "node_id",
        "relation": "reference|revision|reuse"
      }
    ]
  }
}
```

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| no inference | ✅ |
| no ranking | ✅ |
| immutable after validation | ✅ |

---

## THREAD TYPE B — DECISION THREAD (with branches + cause) ⚡

### Purpose
Track how decisions emerged, evolved, and branched.

### IMPORTANT
> **A decision thread shows the PATH, not whether the decision was "good" or "bad".**

### Sources
- decision logs, meeting timestamps, agent participation markers, silence intervals

### Structure

#### DECISION_POINT ⚡
| Field | Description |
|-------|-------------|
| `declared decision` | The decision |
| `timestamp` | Time |
| `context snapshot` | Context at time |

#### DECISION_BRANCH ⚡
| Field | Description |
|-------|-------------|
| `alternative explored` | Alternative path |
| `divergence moment` | When diverged |

### JSON Model (with branches + cause) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "decision",
    "points": [
      {
        "decision_id": "uuid",
        "context": "meeting_id",
        "timestamp": 1712345678,
        "participants": ["user","agent"],
        "hash": "sha256"
      }
    ],
    "branches": [
      {
        "from": "decision_id",
        "to": "decision_id",
        "cause": "new_info|constraint|scope_change"
      }
    ]
  }
}
```

### Branch Cause Types ⚡
| Cause | Description |
|-------|-------------|
| `new_info` | New information |
| `constraint` | New constraint |
| `scope_change` | Scope changed |

### Rules
| Rule | Status |
|------|--------|
| no outcome scoring | ✅ |
| no optimization labels | ✅ |
| no intent inference | ✅ |
| exact replay linkage required | ✅ |

---

## THREAD TYPE C — CONTEXTUAL THREAD (with transitions + info_density) ⚡

### Purpose
Track **HOW context shifts over time** without assigning meaning or emotion.

### Examples
- sphere changes
- role changes
- information density evolution
- agent presence changes

### Sources
- meeting metadata, universe view states, avatar evolution states, routing context

### Structure

#### CONTEXT_STATE ⚡
| Field | Description |
|-------|-------------|
| `sphere` | Sphere |
| `meeting_mode` | Mode |
| `info_density` | Information density |
| `participant set` | Participants |

#### CONTEXT_TRANSITION ⚡
| Field | Description |
|-------|-------------|
| `before` | Before state |
| `after` | After state |
| `timestamp` | When |

### JSON Model (with transitions + info_density + trigger) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "contextual",
    "states": [
      {
        "state_id": "uuid",
        "sphere": "xr|business|...",
        "mode": "analysis|creative|decision",
        "info_density": 0.0,
        "timestamp": 1712345678
      }
    ],
    "transitions": [
      {
        "from": "state_id",
        "to": "state_id",
        "trigger": "new_meeting|new_agent|scope_shift"
      }
    ]
  }
}
```

### Transition Trigger Types ⚡
| Trigger | Description |
|---------|-------------|
| `new_meeting` | New meeting started |
| `new_agent` | New agent joined |
| `scope_shift` | Scope changed |

### Info Density ⚡
> **`info_density`: 0.0 to 1.0 - measures information density**

### Rules
| Rule | Status |
|------|--------|
| context ≠ intention | ✅ |
| context ≠ emotion | ✅ |
| context is descriptive only | ✅ |

---

## THREAD VISUALIZATION (UNIVERSE VIEW) ⚡

| Property | Value |
|----------|-------|
| Render | subtle lines |
| Color | by type (fact/decision/context) |
| **Thickness** | **= recurrence count** ⚡ |
| Visibility | filtered by user profile |
| Highlighting | no dominant highlighting |

---

## ACCESS & PRIVACY

| Property | Status |
|----------|--------|
| threads inherit strictest node visibility | ✅ |
| private nodes stay private | ✅ |
| sharing requires explicit consent | ✅ |
| anonymization supported | ✅ |

---

## AGENTS INVOLVED ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_EXTRACTOR` | Detects thread continuity, **no inference** ⚡ |
| `AGENT_THREAD_VALIDATOR` | Ensures integrity, enforces rules |
| `AGENT_THREAD_RENDERER` | Visual only, **no interpretation** ⚡ |

---

## WHY ALL 3 THREADS MATTER

| Thread | Provides |
|--------|----------|
| **FACTUAL THREAD** | what we know |
| **DECISION THREAD** | how we chose |
| **CONTEXTUAL THREAD** | where and when it happened |

### Together
- total transparency
- zero manipulation
- long-term clarity

---

**END — FOUNDATION FREEZE**
