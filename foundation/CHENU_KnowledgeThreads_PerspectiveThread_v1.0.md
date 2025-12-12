# CHE·NU — KNOWLEDGE THREAD SYSTEM (PERSPECTIVE THREAD)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / APPEND-ONLY

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE LINE** of information connecting events, decisions, artifacts, and context across time, meetings, spheres, and users.

### RULE
> **Threads reveal STRUCTURE,**  
> **not conclusions.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Track objective facts as they appeared and evolved.

### Sources
- XR replay frames, documents, declared decisions, timestamps, agent actions (logged only)

### Characteristics
| Property | Value |
|----------|-------|
| append-only | ✅ |
| immutable after validation | ✅ |
| no sentiment | ✅ |
| no evaluation | ✅ |
| no inference | ✅ |

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "topic": "string",
    "entries": [
      {
        "type": "event|artifact|decision",
        "source": "meeting_id",
        "timestamp": 1712345678,
        "reference": "uuid",
        "hash": "sha256"
      }
    ],
    "status": "verified"
  }
}
```

### Uses
- audits, legal traceability, factual replay, institutional memory

---

## THREAD TYPE 2 — CONTEXT THREAD

### Purpose
Preserve WHY and UNDER WHICH CONDITIONS facts happened — **without interpretation.**

### Sources
- meeting metadata, sphere context, participant roles, system state, constraints present at time

### Characteristics
| Property | Value |
|----------|-------|
| descriptive only | ✅ |
| no intent attribution | ✅ |
| no outcome scoring | ✅ |

### JSON Model

```json
{
  "context_thread": {
    "id": "uuid",
    "linked_fact_thread": "uuid",
    "context": {
      "sphere": "business|scholar|xr|...",
      "meeting_type": "analysis|decision|review",
      "constraints": ["time","budget","policy"],
      "participants": ["user","agent"]
    },
    "timestamp": 1712345678
  }
}
```

### Uses
- understanding decisions later, avoiding hindsight bias, responsible review

---

## THREAD TYPE 3 — PERSPECTIVE THREAD ⚡ UNIQUE

### Purpose
Allow users or agents to **ATTACH THEIR VIEW** without contaminating shared truth.

### Sources
- user-authored notes, agent explanations, personal annotations, reflections

### Characteristics
| Property | Value |
|----------|-------|
| **explicitly subjective** | ✅ ⚡ |
| **isolated from facts** | ✅ ⚡ |
| reversible | ✅ |
| **private or shared by choice** | ✅ ⚡ |

### JSON Model (with author + notes with visibility) ⚡

```json
{
  "perspective_thread": {
    "id": "uuid",
    "author": "user|agent_id",
    "linked_fact_thread": "uuid",
    "notes": [
      {
        "content": "string",
        "timestamp": 1712345678,
        "visibility": "private|shared"
      }
    ]
  }
}
```

### Perspective Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `author` | user or agent_id |
| `notes` | Array of notes |
| `content` | Note content |
| `visibility` | private / shared (per note) |

### Uses
- learning, reflection, training, personal memory

---

## THREAD LINKING RULES ⚡

| Rule | Status |
|------|--------|
| Fact Threads may exist alone | ✅ |
| Context Threads MUST link to Fact Threads | ✅ |
| Perspective Threads MUST link to Fact Threads | ✅ |
| Threads NEVER overwrite each other | ✅ |
| **Deleting perspective never affects fact or context** | ✅ ⚡ |

---

## THREAD VISUALIZATION (UNIVERSE VIEW) ⚡

| Thread | Style |
|--------|-------|
| **FACT THREAD** | solid line, neutral color |
| **CONTEXT THREAD** | dotted line, grey hue |
| **PERSPECTIVE THREAD** | **dashed line, user color** ⚡ |

### Toggleable Layers ⚡
| Layer | Shows |
|-------|-------|
| facts only | Just facts |
| + context | Facts + context |
| + perspectives | All three |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles threads from sources, **no interpretation** |
| `AGENT_CONTEXT_BINDER` | **Attaches context metadata** ⚡ |
| `AGENT_PERSPECTIVE_ASSISTANT` | **Helps users write reflections, never edits content** ⚡ |
| `AGENT_THREAD_GUARD` | Enforces separation rules, prevents cross-contamination |

### AGENT_CONTEXT_BINDER ⚡ NEW
> **"Attaches context metadata"**
- Links context to facts
- Metadata only
- No interpretation

### AGENT_PERSPECTIVE_ASSISTANT ⚡ NEW
> **"Helps users write reflections, never edits content"**
- Assists with reflection
- User controls content
- Never modifies

---

## ETHICAL GUARANTEES

| Guarantee | Status |
|-----------|--------|
| no narrative steering | ✅ |
| no hidden merging | ✅ |
| no authority weighting | ✅ |
| full transparency | ✅ |

---

## WHY THIS MATTERS

> **Facts stay factual.**  
> **Context stays contextual.**  
> **Perspectives stay personal.**

> **Truth remains stable.**  
> **Understanding evolves.**

---

**END — KNOWLEDGE THREAD SYSTEM**
