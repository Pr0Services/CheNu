# CHE·NU — KNOWLEDGE THREADS + OFFICIAL PDF BUILD
**VERSION:** CORE.v1.0  
**STATUS:** FOUNDATION / TRUTH-LAYER / FREEZE-READY

---

## KNOWLEDGE THREADS — GLOBAL PRINCIPLE

> **A Knowledge Thread is a CONTINUOUS TRACE of information**  
> across time, spheres, agents, and meetings.

### RULE
> **Threads CONNECT facts.**  
> **They NEVER conclude, judge, or persuade.**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Track objective information as it appears, moves, is reused, or referenced across Che-Nu.

### Sources
- documents
- notes
- decisions
- artifacts
- data snapshots

### Properties
- immutable references
- versioned links
- timestamped
- sphere-aware

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "factual",
    "origin": "artifact|meeting|decision",
    "nodes": [
      { "ref": "artifact_id", "time": 171234, "sphere": "business" }
    ],
    "hash": "sha256"
  }
}
```

---

## THREAD TYPE 2 — DECISION THREAD

### Purpose
Track HOW decisions unfolded over time **WITHOUT labeling outcomes as good or bad.**

### Sources
- meeting decisions
- alternatives considered
- deferred choices
- silent non-decisions

### Properties
- sequence-based
- branch-aware
- replay-linkable

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "decision",
    "decision_points": [
      {
        "decision_id": "uuid",
        "context": "meeting_id",
        "timestamp": 171235,
        "status": "made|deferred|reversed"
      }
    ],
    "hash": "sha256"
  }
}
```

---

## THREAD TYPE 3 — CONTEXT THREAD

### Purpose
Preserve WHY things happened **without rewriting or narrativizing.**

### Sources
- meeting context
- sphere state
- participants present
- constraints at the time

### Properties
- non-interpretive
- descriptive only
- replay-aligned

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "context",
    "context_nodes": [
      {
        "meeting_id": "uuid",
        "sphere": "xr",
        "participants": 6,
        "constraints": ["time","privacy"],
        "timestamp": 171236
      }
    ],
    "hash": "sha256"
  }
}
```

---

## THREAD LINKING RULES

| Rule | Description |
|------|-------------|
| Reference | Threads can reference each other |
| No overwrite | Threads cannot overwrite each other |
| Append-only | Threads remain append-only |
| Traceable | Threads must be traceable to source |

---

## THREAD VISUALIZATION (UNIVERSE VIEW)

| Thread Type | Visual |
|-------------|--------|
| Factual | solid line |
| Decision | branched line |
| Context | dotted line |

### Filters
- by sphere
- by time
- by agent
- by meeting

---

## ACCESS & SAFETY

| Rule | Status |
|------|--------|
| Per-user visibility | ✅ |
| Per-sphere constraints | ✅ |
| No inference layer | ✅ |
| No ranking | ✅ |
| No optimization signals | ✅ |

---

## OFFICIAL PDF — CONSTRUCTION PLAN

### PDF Purpose
Explain Che-Nu **WITHOUT exposing secrets** while proving rigor, ethics, and structure.

---

### PDF SECTIONS (8)

| # | Section |
|---|---------|
| 1 | Vision & Principles |
| 2 | Core Architecture (Trunk) |
| 3 | Spheres Overview |
| 4 | Agents & Orchestration |
| 5 | XR & Universe View |
| 6 | Knowledge Threads |
| 7 | Ethics & Safeguards |
| 8 | What Che-Nu Enables (without HOW) |

---

### PDF RULES

| Rule | Status |
|------|--------|
| Diagrams > text | ✅ |
| Descriptive, not instructional | ✅ |
| No proprietary algorithms | ✅ |
| No implementation details | ✅ |

---

### PDF INPUT SOURCES

- Core reference specs
- Knowledge thread definitions
- Universe View diagrams
- Agent hierarchy overview
- Ethical charters

---

## FREEZE STRATEGY

### FROZEN Components

| Component | Status |
|-----------|--------|
| Knowledge Threads | ❄️ FROZEN |
| Collective Memory | ❄️ FROZEN |
| Universe Routing | ❄️ FROZEN |
| XR Replay | ❄️ FROZEN |

### Next Work Resumes At

- Sphere-level features
- Domain-specific tooling
- UI polish

---

**END — OFFICIAL FOUNDATION FREEZE**
