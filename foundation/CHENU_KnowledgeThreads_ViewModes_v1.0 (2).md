# CHE·NU — KNOWLEDGE THREAD SYSTEM (VIEW MODES)
**VERSION:** CORE.v1.0  
**MODE:** NON-MANIPULATIVE / TRACEABLE / FREEZE-READY

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **CONTINUOUS TRACE** of information across time, meetings, agents, spheres, and decisions.

### RULE
> **Knowledge Threads CONNECT facts.**  
> **They NEVER summarize, optimize, judge, or conclude.**

---

## THE 3 KNOWLEDGE THREAD TYPES

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Track factual information evolution.

### Sources
- meeting statements, documents, artifacts, data references

### Properties
| Property | Value |
|----------|-------|
| immutable origin | ✅ |
| append-only | ✅ |
| timestamped | ✅ |

### Use Cases
- see when a fact appeared
- see where it was reused
- see which meeting referenced it

### JSON Model (with label)

```json
{
  "thread": {
    "id": "uuid",
    "type": "fact",
    "label": "string",
    "origin": "meeting|document|data",
    "nodes": [
      {
        "source": "uuid",
        "timestamp": 1712345678,
        "reference": "artifact_id"
      }
    ],
    "hash": "sha256"
  }
}
```

---

## THREAD TYPE 2 — DECISION THREAD (with objective + branch_points) ⚡

### Purpose
Track decision lineage **WITHOUT judging quality.**

### Sources
- declared decisions, agent actions, approvals

### Properties
| Property | Value |
|----------|-------|
| causal links | ✅ |
| sequence only | ✅ |
| no scoring | ✅ |

### Use Cases
- see what decision followed which
- see where decisions **diverged**
- compare sequences (**not outcomes**)

### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "type": "decision",
    "objective": "string",
    "nodes": [
      {
        "decision_id": "uuid",
        "timestamp": 1712345678,
        "context": "meeting_id"
      }
    ],
    "branch_points": ["uuid"],
    "hash": "sha256"
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `objective` | What the decision aimed to achieve |
| `branch_points` | UUIDs where decisions diverged |

---

## THREAD TYPE 3 — CONTEXT THREAD (with context_state) ⚡

### Purpose
Preserve WHY something happened **WITHOUT interpreting intention.**

### Sources
- meeting context, constraints, declared goals, environment state

### Properties
| Property | Value |
|----------|-------|
| descriptive only | ✅ |
| parallel to facts & decisions | ✅ |
| optional visibility | ✅ |

### Use Cases
- replay context later
- understand constraints at the time
- **avoid hindsight bias**

### JSON Model (with context_state)

```json
{
  "thread": {
    "id": "uuid",
    "type": "context",
    "context_state": {
      "goal": "string",
      "constraints": ["string"],
      "participants": ["id"]
    },
    "linked_threads": ["fact_id","decision_id"],
    "timestamp": 1712345678,
    "hash": "sha256"
  }
}
```

### Context State Fields ⚡
| Field | Description |
|-------|-------------|
| `goal` | Declared objective at the time |
| `constraints` | Active limitations |
| `participants` | Who was present |

---

## THREAD INTEGRITY & RULES

| Rule | Status |
|------|--------|
| append-only | ✅ |
| versioned | ✅ |
| cryptographically signed | ✅ |
| traceable to source | ✅ |
| **deletions forbidden** | ✅ |
| corrections via new node | ✅ |

---

## THREAD LINKING RULES

| Rule | Status |
|------|--------|
| Fact threads can link to decision threads | ✅ |
| Decision threads can reference fact threads | ✅ |
| Context threads may link to BOTH | ✅ |
| **Cycles forbidden** | ✅ |
| **Forks allowed (branch points)** | ✅ |

---

## KNOWLEDGE THREAD INTERFACE (UI)

### VIEW MODES (3) ⚡

| Mode | Description |
|------|-------------|
| **LINEAR VIEW** | Chronological list, expandable nodes |
| **GRAPH VIEW** | Thread nodes, branch splits, cross-thread links |
| **TIMELINE BRAID** | Multiple threads side-by-side, visual alignment on time anchors |

### THREAD INTERACTIONS ⚡

| Interaction | Description |
|-------------|-------------|
| select thread | Focus on one |
| highlight linked threads | Show connections |
| **jump to source meeting** | Navigate to origin |
| **open replay at timestamp** | View at moment |
| **compare branches** | Read-only comparison |
| export thread | PDF / JSON |

### FILTERS ⚡

| Filter | Options |
|--------|---------|
| by sphere | business, scholar, xr, etc. |
| by agent | specific agents |
| by user | specific users |
| by time range | start/end |
| by thread type | fact/decision/context |

### VISUAL RULES

| Rule | Status |
|------|--------|
| neutral colors | ✅ |
| no heatmaps | ✅ |
| no "importance" scaling | ✅ |
| no success indicators | ✅ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_EXTRACTOR` | **Detects factual references, tags origins** ⚡ |
| `AGENT_THREAD_LINKER` | **Proposes thread links, human approval required** ⚡ |
| `AGENT_THREAD_GUARD` | Verifies integrity, enforces immutability |

### AGENT_THREAD_EXTRACTOR ⚡ NEW
> **"Detects factual references, tags origins"**

### AGENT_THREAD_LINKER ⚡ NEW
> **"Proposes thread links, human approval required"**

---

## WHY THIS SYSTEM EXISTS

> To allow:
> - **truth without narrative control**
> - **memory without rewriting**
> - **knowledge without manipulation**

> **Che-Nu shows WHAT CONNECTS, not WHAT TO THINK.**

---

**END — KNOWLEDGE THREAD SYSTEM**
