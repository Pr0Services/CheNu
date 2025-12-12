# CHE·NU — KNOWLEDGE THREAD SYSTEM (DECISION BRANCHES)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / CROSS-SPHERE / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **CONTINUOUS TRACE** of information across time, meetings, agents, artifacts, and decisions.

### RULE
> **Threads describe CONNECTIONS.**  
> **They do NOT create conclusions.**

---

## THREAD TYPE 1 — FACTUAL THREAD

**ID:** `THREAD_FACTUAL`

### Purpose
Trace objective facts across meetings and spheres.

### Examples
- A regulation discussed in 3 meetings
- A technical constraint referenced over time
- A document reused across contexts

### Sources
- XR replays, documents, notes, artifacts, decisions (fact only)

### Properties
| Property | Value |
|----------|-------|
| immutable once validated | ✅ |
| append-only | ✅ |
| no sentiment | ✅ |
| no interpretation | ✅ |
| exact timestamp lineage | ✅ |

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "topic": "string",
    "nodes": [
      {
        "source": "replay|document|decision",
        "source_id": "uuid",
        "timestamp": 1712345678
      }
    ],
    "visibility": "private|shared|public",
    "hash": "sha256"
  }
}
```

### Use Cases
- Compliance, Audits, Institutional memory, Scholar research

---

## THREAD TYPE 2 — DECISION THREAD (with branches + status) ⚡

**ID:** `THREAD_DECISION`

### Purpose
Track how decisions emerged over time, **WITHOUT judging correctness.**

### Sources
- meetings, option lists, decision logs, agent proposals, silence intervals

### Properties
| Property | Value |
|----------|-------|
| **branching allowed** | ✅ ⚡ |
| **dead-end branches preserved** | ✅ ⚡ |
| no success/failure flag | ✅ |
| divergence visualized | ✅ |

### JSON Model (with branches + status) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "decision",
    "objective": "string",
    "branches": [
      {
        "branch_id": "uuid",
        "origin_replay": "uuid",
        "events": ["event_id"],
        "status": "continued|paused|abandoned"
      }
    ],
    "visibility": "private|shared"
  }
}
```

### Branch Status ⚡
| Status | Description |
|--------|-------------|
| `continued` | Still active |
| `paused` | Temporarily stopped |
| `abandoned` | Dead-end preserved |

### Use Cases
- Strategy review, Post-mortems, Learning without blame, XR comparison mode

---

## THREAD TYPE 3 — CONTEXT THREAD (with scope + context_notes) ⚡

**ID:** `THREAD_CONTEXT`

### Purpose
Preserve WHY things mattered, **WITHOUT rewriting history.**

### Sources
- agenda, meeting intent, constraints, environment state, user-authored context notes

### Properties
| Property | Value |
|----------|-------|
| context-only | ✅ |
| may include annotations | ✅ |
| **annotations are signed** | ✅ ⚡ |
| **annotations NEVER modify facts** | ✅ ⚡ |

### JSON Model (with scope + context_notes + signature) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "context",
    "scope": "meeting|project|sphere",
    "context_notes": [
      {
        "author": "user|agent",
        "note": "string",
        "timestamp": 1712345678,
        "signature": "sha256"
      }
    ],
    "linked_threads": ["thread_id"]
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `scope` | meeting / project / sphere |
| `context_notes` | Array of signed notes |
| `author` | user or agent |
| `signature` | Cryptographic signature |

### Use Cases
- Meaning recall, Avoiding misinterpretation, Collective understanding, Long-term clarity

---

## THREAD INTERACTION & VISUALIZATION ⚡

### Universe View
| Property | Value |
|----------|-------|
| Style | light filaments |
| Color | by type |
| **Thickness** | **= activity density** ⚡ |
| **Opacity** | **= visibility level** ⚡ |

### XR View
| Property | Value |
|----------|-------|
| Style | threads float as paths |
| Interaction | selectable, never intrusive |
| Collapse | always collapsible |

---

## THREAD SAFETY RULES

| Rule | Status |
|------|--------|
| no auto-merge | ✅ |
| no auto-prioritization | ✅ |
| no ranking | ✅ |
| no recommendation engine | ✅ |

### All Joins Are
- **manual**
- **explainable**
- **reversible**

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | **Indexes new eligible nodes** ⚡ |
| `AGENT_THREAD_LINKER` | **Proposes connections (suggest-only)** ⚡ |
| `AGENT_THREAD_GUARD` | Validates ethics, scope, and visibility |

### AGENT_THREAD_INDEXER ⚡ NEW
> **"Indexes new eligible nodes"**
- Passive indexing
- No interpretation
- Prepares data for linking

### AGENT_THREAD_LINKER ⚡ NEW
> **"Proposes connections (suggest-only)"**
- Suggestions only
- User must approve
- Never auto-links

---

## WHY 3 THREADS

| Thread | Shows |
|--------|-------|
| **Factual** | WHAT happened |
| **Decision** | HOW it unfolded |
| **Context** | WHY it mattered |

### Together
- **truth without bias**
- **memory without power**
- **intelligence without control**

---

**END — KNOWLEDGE THREAD FOUNDATION**
