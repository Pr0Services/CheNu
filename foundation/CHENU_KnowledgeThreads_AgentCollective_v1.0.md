# CHE·NU — KNOWLEDGE THREADS SYSTEM (AGENT-COLLECTIVE)
**VERSION:** FOUNDATION v1.0  
**MODE:** NON-MANIPULATIVE / TRACEABLE / CROSS-SPHERE

---

## GLOBAL DEFINITION

> **Knowledge Thread = A TRACEABLE CONTINUITY OF INFORMATION** across time, spheres, agents, and meetings.

### RULE
> **Threads connect FACTS & ARTIFACTS,**  
> **NOT conclusions, NOT opinions.**

---

## THREAD TYPE 1 — TEMPORAL KNOWLEDGE THREAD

### Purpose
Track how a topic evolves OVER TIME.

### Examples
- A project discussion across months
- A recurring decision topic
- An unresolved question reappearing

### Characteristics
| Property | Value |
|----------|-------|
| linear or branched timeline | ✅ |
| anchors to meetings & replays | ✅ |
| shows pauses & silence gaps | ✅ |
| immutable history | ✅ |

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "temporal",
    "topic": "string",
    "nodes": [
      {
        "source": "meeting|replay|artifact",
        "id": "uuid",
        "timestamp": 1712345678
      }
    ],
    "status": "open|paused|closed"
  }
}
```

### Visualization
- timeline ribbon
- gap markers
- branch points
- jump-to-source

---

## THREAD TYPE 2 — CROSS-SPHERE KNOWLEDGE THREAD

### Purpose
Connect the SAME concept appearing in DIFFERENT spheres.

### Examples
- Business ↔ Scholar
- Personal ↔ Methodology
- XR ↔ Institutions

### Rules
| Rule | Status |
|------|--------|
| no data duplication | ✅ |
| references only | ✅ |
| visibility controlled per sphere | ✅ |
| no forced merge | ✅ |

### JSON Model (with concept)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "cross_sphere",
    "concept": "string",
    "spheres": ["business","scholar","xr"],
    "links": [
      {
        "sphere": "business",
        "source_id": "uuid"
      }
    ]
  }
}
```

### Visualization
- orbit bridges
- colored sphere anchors
- toggle per sphere
- **transparency by relevance** ⚡

---

## THREAD TYPE 3 — AGENT-COLLECTIVE KNOWLEDGE THREAD ⚡ UNIQUE

### Purpose
Expose how agents **CONTRIBUTED, NOT how they influenced.**

### Examples
- Which agent provided data
- Which agent remained silent
- Timing of interventions

### Rules
| Rule | Status |
|------|--------|
| no intent inference | ✅ |
| no performance scoring | ✅ |
| no dominance indicators | ✅ |

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "agent_collective",
    "topic": "string",
    "agents": [
      {
        "agent_id": "uuid",
        "role": "observer|provider|validator",
        "timestamps": [1712345678]
      }
    ]
  }
}
```

### Agent Roles ⚡
| Role | Description |
|------|-------------|
| `observer` | Watched but didn't contribute |
| `provider` | Provided data/information |
| `validator` | Validated/checked content |

### Visualization ⚡
| Feature | Description |
|---------|-------------|
| agent timeline lanes | Parallel tracks per agent |
| silent intervals visible | Gaps shown explicitly |
| role glyphs only | Visual role indicators |

---

## THREAD SAFETY & ETHICS

| Rule | Status |
|------|--------|
| read-only threads | ✅ |
| explicit creation required | ✅ |
| user can detach anytime | ✅ |
| no auto-summarization bias | ✅ |
| no hidden aggregation | ✅ |

---

## THREAD CREATION MODES ⚡

| Mode | Description |
|------|-------------|
| `manual` | User creates |
| `meeting-derived` | From meeting data |
| `replay-derived` | From XR replay |
| `agent-suggested` | **Opt-in only** |

---

## WHY KNOWLEDGE THREADS MATTER

They provide:
- **continuity without coercion**
- **memory without distortion**
- **intelligence without direction**
- **truth without narrative control**

---

**END — KNOWLEDGE THREADS**
