# CHE·NU — KNOWLEDGE THREADS SYSTEM (KT-1 / KT-2 / KT-3)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## GLOBAL PRINCIPLE

> **Knowledge Threads connect INFORMATION across time,**  
> **spheres, meetings, agents, and artifacts**  
> **WITHOUT interpretation or narrative shaping.**

### RULE
> **Threads LINK facts.**  
> **Humans interpret meaning.**

---

## THREAD TYPES

| Code | Name | Purpose |
|------|------|---------|
| **KT-1** | FACT THREAD | Track concrete information |
| **KT-2** | DECISION THREAD | Track decisions without judging |
| **KT-3** | CONTEXT THREAD | Preserve WHY without intent reconstruction |

### Common Properties
- append-only
- verifiable
- single source of truth
- never infers intent

---

## KT-1 — FACT THREAD

### Purpose
Track concrete information across the system.

### Examples
- documents, files, notes
- diagrams, metrics, code
- statements made

### Characteristics
- timestamped
- source-bound
- immutable after validation

### KT-1 Links

| Link | Target |
|------|--------|
| `created_in` | meeting |
| `referenced_in` | other meetings |
| `reused_in` | artifacts |
| `shared_with` | sphere/user |

### KT-1 JSON Model

```json
{
  "fact_thread": {
    "id": "uuid",
    "facts": [
      {
        "fact_id": "uuid",
        "source": "meeting|artifact|agent",
        "timestamp": 1712345678,
        "location": "sphere_id",
        "hash": "sha256"
      }
    ]
  }
}
```

---

## KT-2 — DECISION THREAD

### Purpose
Track decisions **WITHOUT judging quality.**

### Examples
- choices made
- directions taken
- constraints accepted
- paths rejected (if explicitly stated)

### Characteristics
- linked to decision moments
- references facts, not opinions
- no success/failure tags

### KT-2 Links

| Link | Target |
|------|--------|
| `based_on` | fact_thread |
| `declared_in` | meeting |
| `followed_by` | other decisions |

### KT-2 JSON Model

```json
{
  "decision_thread": {
    "id": "uuid",
    "decisions": [
      {
        "decision_id": "uuid",
        "timestamp": 1712345678,
        "declared_by": "user|agent",
        "context": "meeting_id",
        "references": ["fact_thread_id"],
        "constraints": ["explicit_only"]
      }
    ]
  }
}
```

---

## KT-3 — CONTEXT THREAD

### Purpose
Preserve WHY something mattered at a given time, **WITHOUT reconstructing intent.**

### Examples
- meeting purpose
- constraints in force
- domain conditions
- environment state

### Characteristics
- non-psychological
- descriptive only
- time-scoped

### KT-3 Links

| Link | Target |
|------|--------|
| `active_during` | meeting, decision |
| `influenced_scope` | sphere |

### KT-3 JSON Model

```json
{
  "context_thread": {
    "id": "uuid",
    "contexts": [
      {
        "context_id": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr|...",
        "conditions": ["budget_limit","time_pressure"],
        "validity_window": "start_end"
      }
    ]
  }
}
```

---

## THREAD INTERCONNECTION RULES

```
┌─────────────────────────────────────────────────┐
│                   KT-3 CONTEXT                  │
│            (annotates KT-1 and KT-2)            │
│                  ↓         ↓                    │
│   ┌──────────────┴─────────┴──────────────┐    │
│   │                                        │    │
│   │  KT-2 DECISION ───references───> KT-1  │    │
│   │                                  FACT  │    │
│   │                                        │    │
│   └────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

### Rules

| Rule | Description |
|------|-------------|
| ✅ KT-2 MAY reference KT-1 | Decisions can cite facts |
| ✅ KT-3 MAY annotate KT-1 or KT-2 | Context can describe both |
| ❌ NO thread can rewrite another | Immutability |
| ❌ NO thread infers causality | No interpretation |
| ✅ All links are explicit | Traceability |

---

## UNIVERSE VIEW INTEGRATION

### Visual Representation

| Thread | Visual |
|--------|--------|
| KT-1 (Fact) | solid lines |
| KT-2 (Decision) | directional lines |
| KT-3 (Context) | soft temporal halos |

### Filters
- by sphere
- by timeframe
- by participant
- by artifact

---

## XR INTEGRATION

| Element | Representation |
|---------|----------------|
| Threads | floating lines |
| Decision nodes | anchors |
| Context nodes | background fields |
| Control | user toggles visibility |

---

## AGENT INVOLVEMENT

| Agent | Role |
|-------|------|
| `AGENT_THREAD_EXTRACTOR` | Extracts facts/decisions/context, **no interpretation** |
| `AGENT_THREAD_VALIDATOR` | Verifies structure + integrity, **no content alteration** |
| `AGENT_THREAD_VISUALIZER` | Prepares data for UI/XR, **render-only** |

---

## ETHICS & SAFETY

| Rule | Status |
|------|--------|
| No emotional labeling | ✅ |
| No ranking | ✅ |
| No scoring | ✅ |
| No persuasion | ✅ |
| Complete traceability | ✅ |

---

## WHY THIS MATTERS

| Thread | Ensures |
|--------|---------|
| **KT-1** | ACCURACY |
| **KT-2** | RESPONSIBILITY |
| **KT-3** | UNDERSTANDING |

### Together
> **Memory without bias**  
> **Clarity without control**  
> **Truth without narrative dominance**

---

**END — KNOWLEDGE THREADS FREEZE**
