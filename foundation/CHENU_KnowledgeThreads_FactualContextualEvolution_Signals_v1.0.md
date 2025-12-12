# CHE·NU — KNOWLEDGE THREAD SYSTEM (FACTUAL/CONTEXTUAL/EVOLUTION + SIGNALS)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / INTER-SPHERE / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE LINK** between facts, artifacts, decisions, meetings, and agents, across time and spheres.

### RULE
> **Knowledge Threads CONNECT information. They NEVER interpret, rank, or conclude.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Link objective elements that happened or exist.

### Used For ⚡
- decisions tracking, audit, **historical clarity** ⚡, verification

### Factual Thread Elements ⚡
| Element | Description |
|---------|-------------|
| meeting | ✅ |
| replay | ✅ |
| decision | ✅ |
| document | ✅ |
| artifact | ✅ |
| **agent action** | ⚡ |
| **silence interval** | ⚡ |

### Factual Thread Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| immutable once validated | ✅ |
| ordered by timestamp | ✅ |
| **must reference a source** | ✅ ⚡ |

### Factual Thread JSON (with node_type + sphere_scope) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "nodes": [
      {
        "node_id": "uuid",
        "node_type": "decision|document|replay",
        "timestamp": 1712345678
      }
    ],
    "sphere_scope": ["business","xr"],
    "hash": "sha256"
  }
}
```

### Factual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes[].node_type` | **decision/document/replay** ⚡ |
| `sphere_scope` | **Array of spheres** ⚡ |

---

## THREAD TYPE 2 — CONTEXTUAL THREAD

### Purpose
Link information through **CONTEXT, not outcome.**

### Used For ⚡
- understanding evolution, tracking environment change, **reviewing assumptions** ⚡

### Contextual Signals ⚡
| Signal | Description |
|--------|-------------|
| sphere | ✅ |
| **time window** | ⚡ |
| participants | ✅ |
| **agent presence** | ⚡ |
| **information density** | ⚡ |
| **meeting mode** | ⚡ |

### Contextual Thread Rules ⚡
| Rule | Status |
|------|--------|
| no conclusions | ✅ |
| **no optimization hints** | ✅ ⚡ |
| **no "success path"** | ✅ ⚡ |

### Contextual Thread JSON (with signals object + period + explanation) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "contextual",
    "signals": {
      "sphere": "scholar",
      "period": "Q1-2025",
      "participants": ["user_id"],
      "mode": "analysis"
    },
    "linked_nodes": ["uuid","uuid"],
    "explanation": "shared context only"
  }
}
```

### Contextual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `signals` | **Object with context data** ⚡ |
| `signals.period` | **"Q1-2025" time period** ⚡ |
| `signals.mode` | **"analysis" meeting mode** ⚡ |
| `linked_nodes` | **Array of UUIDs** ⚡ |
| `explanation` | **"shared context only"** ⚡ |

---

## THREAD TYPE 3 — EVOLUTION THREAD

### Purpose
Show **HOW understanding, structure, or usage evolved** over time WITHOUT judging quality.

### Used For ⚡
- learning review, system refinement, **self-observation** ⚡

### Evolution Sources ⚡
| Source | Description |
|--------|-------------|
| **avatar evolution states** | ⚡ |
| **navigation profile changes** | ⚡ |
| **methodology shifts** | ⚡ |
| **sphere usage patterns** | ⚡ |

### Evolution Thread Rules ⚡
| Rule | Status |
|------|--------|
| descriptive only | ✅ |
| **reversible view** | ✅ ⚡ |
| **never predictive** | ✅ ⚡ |
| user-controlled visibility | ✅ |

### Evolution Thread JSON (with timeline + change + scope) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "evolution",
    "timeline": [
      {
        "t": "2025-01-02",
        "change": "navigation_profile_update",
        "detail": "density reduced"
      }
    ],
    "scope": "personal|team|system",
    "visibility": "private|shared"
  }
}
```

### Evolution Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `timeline` | **Array of change events** ⚡ |
| `timeline[].t` | **Date string** ⚡ |
| `timeline[].change` | **Change type** ⚡ |
| `timeline[].detail` | **Change detail** ⚡ |
| `scope` | **personal/team/system** ⚡ |

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

### Display ⚡
> **threads drawn as LIGHT LINES**

### Color by Type ⚡
| Thread Type | Color |
|-------------|-------|
| **factual** | **white** ⚡ |
| **contextual** | **blue** ⚡ |
| **evolution** | **green** ⚡ |

### Thickness ⚡
> **= number of linked nodes**

### User Can ⚡
| Action | Available |
|--------|-----------|
| expand | ✅ |
| hide | ✅ |
| isolate | ✅ |
| **export (PDF/XR)** | ✅ ⚡ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | assembles from validated data, no inference |
| `AGENT_THREAD_EXPLAINER` | describes why linked, **plain language only** ⚡ |
| `AGENT_THREAD_GUARD` | enforces non-manipulation, **blocks unauthorized links** ⚡ |

---

## ETHICAL LOCKS

| Lock | Status |
|------|--------|
| no scoring | ✅ |
| no ranking | ✅ |
| **no "best path"** | ✅ ⚡ |
| **no emotional cues** | ✅ ⚡ |
| **full provenance visible** | ✅ ⚡ |

---

## WHY 3 THREAD TYPES

| Thread | Question |
|--------|----------|
| **FACTUAL** | What happened |
| **CONTEXTUAL** | In what situation |
| **EVOLUTION** | How things changed |

> **Together: clarity, truth, awareness WITHOUT narrative control**

---

**END — KNOWLEDGE THREADS**
