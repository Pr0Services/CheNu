# CHE·NU — KNOWLEDGE THREADS SYSTEM (GRAPH STRUCTURE)
**VERSION:** FOUNDATION v1.0  
**MODE:** OBSERVATION / LINKING / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> **A Knowledge Thread is a TRACEABLE CONNECTION**  
> between facts, events, artifacts, meetings, and agents across time and spheres.

### RULE
> **Threads CONNECT information.**  
> **They NEVER interpret, rank, or conclude.**

---

## THREAD TYPES (THE 3)

1. **FACTUAL THREAD**
2. **DECISION THREAD**
3. **CONTEXT THREAD**

### Common Properties
- append-only
- verifiable
- source-linked
- reversible in visualization
- immutable in content

---

## 1) FACTUAL THREAD

### Purpose
Link concrete information units.

### Sources
- documents, notes, visuals, datasets, statements

### Allowed Links
- references
- citations
- derivations

### Never Includes
- ❌ opinions
- ❌ intent
- ❌ evaluation

### Factual Thread Node Model

```json
{
  "thread_node": {
    "id": "uuid",
    "type": "artifact|note|data",
    "sphere": "business|scholar|xr|...",
    "source": "meeting|upload|agent",
    "timestamp": 1712345678,
    "hash": "sha256"
  }
}
```

---

## 2) DECISION THREAD

### Purpose
Trace HOW a decision emerged **without claiming WHY it is correct.**

### Sources
- meeting outcomes
- decision logs
- voting artifacts
- approvals

### Links Show
- alternatives considered
- sequence
- timing

### Never Includes
- ❌ success judgment
- ❌ optimization score
- ❌ recommendation

### Decision Thread Model (with action states)

```json
{
  "decision_thread": {
    "decision_id": "uuid",
    "steps": [
      {
        "source": "meeting_id",
        "timestamp": 1712345678,
        "action": "proposed|modified|approved|deferred"
      }
    ],
    "participants": ["user","agent"],
    "hash": "sha256"
  }
}
```

### Decision Action States

| Action | Description |
|--------|-------------|
| `proposed` | Initial proposal |
| `modified` | Changed/amended |
| `approved` | Finalized |
| `deferred` | Postponed |

---

## 3) CONTEXT THREAD

### Purpose
Preserve surrounding context so facts & decisions are not isolated.

### Sources
- meeting environment
- sphere
- active constraints
- silence intervals
- agent presence state

### Shows
- conditions present
- constraints active
- missing information

### Never Infers
- ❌ intent
- ❌ emotion
- ❌ blame

### Context Thread Model (with silence_windows)

```json
{
  "context_thread": {
    "context_id": "uuid",
    "sphere": "xr|business|scholar|...",
    "environment": "meeting|review|replay",
    "constraints": ["time","policy","privacy"],
    "silence_windows": [
      { "start": 12.3, "end": 18.9 }
    ],
    "hash": "sha256"
  }
}
```

---

## THREAD GRAPH STRUCTURE

### Nodes
- facts
- decisions
- contexts

### Edges (4 types)

| Edge Type | Description |
|-----------|-------------|
| `referenced_by` | Direct citation |
| `followed_by` | Temporal sequence |
| `occurred_under` | Context relationship |
| `shared_with` | Cross-entity sharing |

### Graph Properties
- ✅ navigable
- ✅ filterable
- ✅ view-only by default

---

## VISUALIZATION RULES

| Element | Representation |
|---------|----------------|
| Colors | coded by thread type |
| Thickness | = density, **NOT importance** |
| Dashed edges | = indirect reference |
| Muted edges | when filtered |

### Forbidden
- ❌ ranking
- ❌ highlighting "best" paths
- ❌ attention capture tricks

---

## INTEGRATION POINTS

| System | Integration |
|--------|-------------|
| **Universe View** | threads as overlays |
| **XR Replay** | timeline-linked threads |
| **Collective Memory** | threads attach to entries |
| **Navigation Profiles** | thread visibility per user |

---

## ACCESS & SAFETY

| Rule | Status |
|------|--------|
| per-sphere visibility | ✅ |
| per-thread permission | ✅ |
| private threads stay private | ✅ |
| shared threads require consent | ✅ |

---

## WHY THREADS MATTER

They allow:
- **understanding without rewriting**
- **clarity without judgment**
- **continuity without control**

> **One reality. Many threads. No manipulation.**

---

**END — FOUNDATION FREEZE**
