# CHE·NU — KNOWLEDGE THREAD SYSTEM + SPHERE INTERIOR & INTERFACE INTEGRATION
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## DEFINITION — KNOWLEDGE THREAD

> **A Knowledge Thread is a CONTINUOUS TRACE of information**  
> across time, spheres, meetings, artifacts, and decisions.

### RULE
> **Thread = CONNECTION**  
> NOT opinion, NOT conclusion, NOT narrative forcing

---

## THE 3 KNOWLEDGE THREAD TYPES

### THREAD TYPE 1 — FACTUAL THREAD

| Property | Value |
|----------|-------|
| Purpose | Track objective information across the system |
| Sources | documents, notes, data points, decision logs, validated replays |
| Properties | timestamped, immutable once validated, source-linked |

**Example:** "Requirement X discussed → refined → validated → reused"

---

### THREAD TYPE 2 — DECISION THREAD

| Property | Value |
|----------|-------|
| Purpose | Trace how decisions evolved over time |
| Sources | meetings, replays, decision declarations, alternatives, deferred choices |
| Properties | shows sequence (not quality), includes silence & no-decision states |

**Example:** "Option A considered → delayed → Option B chosen"

---

### THREAD TYPE 3 — KNOWLEDGE CONTEXT THREAD

| Property | Value |
|----------|-------|
| Purpose | Link meaning without imposing interpretation |
| Sources | related topics, shared agents, shared artifacts, cross-sphere references |
| Properties | soft links, expandable on demand, non-hierarchical |

**Example:** "This concept appears in Scholar + Business + XR"

---

## THREAD CORE JSON MODEL

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual|decision|context",
    "nodes": [
      {
        "node_id": "uuid",
        "source_type": "document|meeting|replay|artifact",
        "sphere": "business|scholar|xr|...",
        "timestamp": 1712345678
      }
    ],
    "visibility": "private|shared|public",
    "hash": "sha256",
    "append_only": true
  }
}
```

---

## THREAD RULES (NON-NEGOTIABLE)

| Rule | Status |
|------|--------|
| No ranking | ✅ |
| No sentiment | ✅ |
| No scoring | ✅ |
| No inferred intent | ✅ |
| No "best path" | ✅ |

> **Threads SHOW.**  
> **Users THINK.**

---

## INTEGRATION INSIDE EACH SPHERE

### Each Sphere has an INTERNAL VIEW composed of:

#### 1) CONTENT ZONES
- primary content
- secondary references
- inactive/history

#### 2) THREAD OVERLAY LAYER
- threads visible as soft lines
- color by thread type
- opacity by relevance

#### 3) THREAD PANEL (OPTIONAL)
- list of active threads
- filter by type
- jump to node

---

## SPHERE INTERIOR INTERFACE STRUCTURE

```
┌─────────────────────────────────────────────────────────────────┐
│  TOP BAR                                                        │
│  [Sphere Selector] [Thread Toggle] [Focus Mode]                 │
├─────────────────┬───────────────────────┬───────────────────────┤
│  LEFT PANE      │  CENTER               │  RIGHT PANE           │
│  CONTENT        │  ACTIVE SPACE         │  CONTEXT & THREADS    │
│                 │                       │                       │
│  • documents    │  current context      │  • related threads    │
│  • boards       │  meeting / editor     │  • decision traces    │
│  • tools        │  workspace            │  • cross-sphere links │
│  • tasks        │                       │                       │
│                 │                       │                       │
└─────────────────┴───────────────────────┴───────────────────────┘
```

---

## THREAD INTERACTION MODES

| Action | Result |
|--------|--------|
| `hover` | preview connection |
| `click` | open node |
| `long-press` | isolate thread |
| `pin` | keep visible across views |

### Constraints
- ❌ NO AUTO-OPEN
- ❌ NO DISTRACTION

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_DETECTOR` | Detects eligible connections, **never creates meaning** |
| `AGENT_THREAD_MAPPER` | Builds graph links, **append-only** |
| `AGENT_THREAD_GUARD` | Ensures rules respected, **blocks forbidden metadata** |

---

## THREADS + UNIVERSE VIEW

| Element | Behavior |
|---------|----------|
| Threads | appear as faint arcs |
| Thickness | = number of nodes |
| Direction arrows | ❌ NO |
| Filter | optional per thread type |

---

## WHY THIS SYSTEM WORKS

| Principle | Result |
|-----------|--------|
| One truth | Single source |
| Many paths | Multiple navigation |
| No manipulation | User autonomy |
| No collapse into narrative | Preserved complexity |

> **Knowledge stays navigable, not weaponized.**

---

**END — KNOWLEDGE THREAD FOUNDATION**
