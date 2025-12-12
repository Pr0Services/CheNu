# CHE·NU — KNOWLEDGE THREAD SYSTEM (BRANCH COMPARISON)
**VERSION:** FOUNDATION v1.0  
**MODE:** STRUCTURAL / NON-MANIPULATIVE / TRACEABLE

---

## GLOBAL DEFINITION

> **Knowledge Thread = A persistent, traceable link** between information, actions, decisions, and context across time, WITHOUT interpretation or narrative shaping.

> **Thread = CONNECTION, not conclusion.**

---

## THREAD TYPE A — FACTUAL THREADS

### Purpose
Track objective facts across spheres, meetings, and artifacts.

### Examples
- A concept discussed in multiple meetings
- A document reused across time
- A decision referenced later

### Rules
| Rule | Status |
|------|--------|
| Based ONLY on verifiable sources | ✅ |
| Time-stamped | ✅ |
| Source-linked | ✅ |
| Immutable once validated | ✅ |

### ❌ NOT Allowed
- opinions
- sentiment
- inferred intent

### Factual Objects
- meetings, documents, artifacts, decisions, replays

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "label": "string",
    "sources": ["meeting_id","artifact_id"],
    "timeline": [
      { "t": 1712345678, "ref": "replay_id" }
    ],
    "sphere_scope": ["business","xr"],
    "hash": "sha256",
    "status": "verified"
  }
}
```

---

## THREAD TYPE B — CONTEXTUAL THREADS

### Purpose
Preserve WHY something happened **WITHOUT interpreting emotion or motivation.**

### Examples
- Constraints present at a decision
- Environmental or domain context
- Available information at that time

### Rules
| Rule | Status |
|------|--------|
| Descriptive only | ✅ |
| No judgment | ✅ |
| No rewriting history | ✅ |
| Linked to factual threads | ✅ |

### Contextual Objects
- domain constraints
- information availability
- meeting mode (analysis, review)
- participation scope

### JSON Model (with available_data)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "contextual",
    "linked_factual_thread": "uuid",
    "context": {
      "domain": "sphere",
      "constraints": ["string"],
      "available_data": ["artifact_id"]
    },
    "timestamp": 1712345678,
    "status": "descriptive_only"
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `linked_factual_thread` | Parent factual thread |
| `available_data` | What data was available at time |
| `status: "descriptive_only"` | Explicit non-interpretive marker |

---

## THREAD TYPE C — EVOLUTION THREADS (with branches) ⚡

### Purpose
Track HOW information, structures, or decisions evolved over time.

### Examples
- Progressive refinement of an idea
- Change in structure or plan
- Knowledge branching

### Rules
| Rule | Status |
|------|--------|
| Chronological only | ✅ |
| No optimization scoring | ✅ |
| No success/failure | ✅ |
| **Read-only comparison** | ✅ ⚡ |

### Evolution Objects
- versions
- structural changes
- branching points
- merges

### JSON Model (with root + branches + comparison_ready) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "evolution",
    "root": "factual_thread_id",
    "branches": [
      {
        "version": "v1.2",
        "change": "added constraint",
        "timestamp": 1712345678
      }
    ],
    "comparison_ready": true
  }
}
```

### Branch Fields ⚡
| Field | Description |
|-------|-------------|
| `root` | Origin factual thread ID |
| `version` | Version identifier |
| `change` | What changed (text description) |
| `comparison_ready` | Can be compared with other branches |

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

| Property | Value |
|----------|-------|
| Rendering | Soft lines |
| Color | By type (neutral palette) |
| Thickness | = persistence |
| Animation | **No flashing / no emphasis bias** |

---

## ACCESS & PRIVACY

| Rule | Status |
|------|--------|
| Threads inherit visibility of source objects | ✅ |
| Private threads stay private | ✅ |
| Shared threads explicitly approved | ✅ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_DISCOVERER` | **Detects potential threads, suggestion only** ⚡ |
| `AGENT_THREAD_VALIDATOR` | Ensures factual grounding |
| `AGENT_THREAD_RENDERER` | Visual-only |

### AGENT_THREAD_DISCOVERER ⚡ NEW
> **"Detects potential threads, suggestion only"**
- Passive discovery
- No auto-creation
- Human approval required

---

## WHY THESE 3 THREADS

| Thread | Shows |
|--------|-------|
| **FACTUAL** | What happened |
| **CONTEXTUAL** | Under what conditions |
| **EVOLUTION** | How it changed |

### Together
- **Truth without distortion**
- **Memory without manipulation**
- **Clarity over time**

---

**END — KNOWLEDGE THREAD SYSTEM**
