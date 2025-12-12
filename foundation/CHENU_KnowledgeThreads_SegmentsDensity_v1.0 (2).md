# CHE·NU — KNOWLEDGE THREADS SYSTEM (SEGMENTS + DENSITY)
**VERSION:** FOUNDATION v1.0  
**MODE:** CROSS-SPHERE / NON-MANIPULATIVE / APPEND-ONLY

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE CHAIN** of information connecting facts, decisions, artifacts, and contexts across time, meetings, spheres, and users.

### RULE
> **Threads CONNECT knowledge. They NEVER reinterpret it.**

---

## THE 3 KNOWLEDGE THREAD TYPES

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Track WHAT is known and where it originates.

### Content
- statements, documents, data points, references, verified outputs

### Characteristics
| Property | Value |
|----------|-------|
| factual | ✅ |
| timestamped | ✅ |
| source-bound | ✅ |
| immutable after validation | ✅ |

### Example
> "Requirement X discussed → Document Y created → Used in Project Z"

### JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "entries": [
      {
        "type": "document|note|data",
        "source": "meeting|artifact|import",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ],
    "sphere": "business|scholar|xr|...",
    "visibility": "private|team|shared"
  }
}
```

---

## THREAD TYPE 2 — DECISION THREAD (with alternatives)

### Purpose
Track WHY a decision was taken, **WITHOUT judging it.**

### Content
- decision statements
- context references
- **alternatives considered** ⚡
- decision timestamp
- participants

### Characteristics
| Property | Status |
|----------|--------|
| no scoring | ✅ |
| no success/failure labels | ✅ |
| no intent inference | ✅ |

### Example
> "Decision A taken after meetings 1,2,3 using inputs B,C"

### JSON Model (with alternatives) ⚡

```json
{
  "decision_thread": {
    "id": "uuid",
    "decision": "string",
    "context_sources": ["meeting_id","fact_thread_id"],
    "alternatives": ["string"],
    "timestamp": 1712345678,
    "participants": ["user","agent"],
    "sphere": "business|institution"
  }
}
```

### New Field ⚡
| Field | Description |
|-------|-------------|
| `alternatives` | Array of alternatives that were considered |

---

## THREAD TYPE 3 — CONTEXT THREAD (with segments + density) ⚡

### Purpose
Explain HOW information environments evolved over time.

### Content
- meeting contexts
- sphere shifts
- **information density changes** ⚡
- agent participation changes
- silence periods

### Characteristics
| Property | Value |
|----------|-------|
| descriptive | ✅ |
| time-based | ✅ |
| no conclusions | ✅ |

### Example
> "User moved from exploratory → focused → review mode"

### JSON Model (with segments + density + mode) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "segments": [
      {
        "start": 1712340000,
        "end": 1712343600,
        "mode": "explore|focus|review",
        "sphere": "scholar|business",
        "active_agents": ["agent_id"],
        "density": 0.6
      }
    ]
  }
}
```

### Segment Fields ⚡
| Field | Description |
|-------|-------------|
| `mode` | explore / focus / review |
| `density` | 0.0–1.0 information density |
| `active_agents` | Which agents were active |

### Mode Types ⚡
| Mode | Description |
|------|-------------|
| `explore` | Exploratory, open-ended |
| `focus` | Concentrated on specific topic |
| `review` | Reviewing/validating |

---

## THREAD INTERACTIONS

| Interaction | Description |
|-------------|-------------|
| Fact Threads support Decision Threads | Facts feed decisions |
| Context Threads surround both | Context wraps everything |
| Threads may link but never overwrite | Append-only |

### Example Links
```
fact_thread → referenced_by → decision_thread
context_thread → surrounds → decision_thread
```

### New Relationship ⚡
| Relation | Description |
|----------|-------------|
| `surrounds` | Context wraps other threads |

---

## THREAD GRAPH STRUCTURE

### Nodes
- fact_thread, decision_thread, context_thread
- meeting, artifact, agent

### Edges
| Edge | Description |
|------|-------------|
| `references` | Citation |
| `followed_by` | Sequence |
| `occurred_within` | Inside context ⚡ |
| `shared_context` | Same context ⚡ |

---

## THREAD CREATION RULES

| Rule | Status |
|------|--------|
| Created automatically on events | ✅ |
| May be created manually by user | ✅ |
| Agents may SUGGEST threads | ✅ |
| User approval required for shared threads | ✅ |

---

## THREAD VISUALIZATION

### 2D
- timelines
- layered lanes

### 3D / XR
- braided strands
- color-coded by type
- **thickness = information density** ⚡

---

## ACCESS & PRIVACY

| Rule | Status |
|------|--------|
| Private by default | ✅ |
| Explicit share required | ✅ |
| Redaction allowed | ✅ |
| Threads can be hidden but not altered | ✅ |

---

## ETHICAL LOCKS ⚡

### ❌ NO
- narrative shaping
- optimization bias
- emotional framing
- ranking threads

### ✅ YES
- transparency
- auditability
- reversibility

---

## WHY KNOWLEDGE THREADS MATTER

They allow:
- **memory without distortion**
- **understanding without authority**
- **continuity without control**

---

**END — FOUNDATION FREEZE**
