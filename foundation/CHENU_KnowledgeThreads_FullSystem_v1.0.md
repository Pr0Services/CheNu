# CHE·NU — KNOWLEDGE THREADS FULL SYSTEM
**VERSION:** FOUNDATION v1.0  
**MODE:** STRUCTURAL / NON-MANIPULATIVE / FREEZE-READY

---

## PART 1 — KNOWLEDGE THREADS (FOUNDATION)

### Purpose
Link knowledge, events, replays, artifacts, agents, and spheres into **NEUTRAL, TRACEABLE continuity lines.**

### RULE
> **Knowledge Thread = STRUCTURE**  
> NOT interpretation, NOT conclusion, NOT narrative shaping.

---

### THREAD TYPES (5)

| Type | Purpose |
|------|---------|
| `THREAD_TYPE_FACT` | Links pure factual elements, immutable once verified |
| `THREAD_TYPE_CONTEXT` | Links related events & artifacts, expresses adjacency only |
| `THREAD_TYPE_EVOLUTION` | Shows history of topic over time, no prediction, no optimization |
| `THREAD_TYPE_DECISION` | Links decisions + source data, NO success/failure assessment |
| `THREAD_TYPE_CROSS-SPHERE` | Maps multi-sphere involvement, no hierarchy between spheres |

---

### THREAD OBJECT MODEL

```json
{
  "thread": {
    "id": "uuid",
    "type": "fact|context|evolution|decision|cross",
    "origin": "meeting|artifact|agent|user|memory",
    "nodes": [
      {
        "ref_id": "uuid",
        "ref_type": "replay|artifact|note|decision|event",
        "timestamp": 1712345678,
        "sphere": "business|scholar|creative|...",
        "metadata": {}
      }
    ],
    "integrity_hash": "sha256",
    "permissions": {
      "visibility": "private|shared|sphere_scope"
    }
  }
}
```

---

### THREAD RULES

| Rule | Description |
|------|-------------|
| Append-only | Cannot modify existing nodes |
| No auto-inference | No automatic conclusions |
| Source required | Every node must have a source |
| No sentiment | No emotional tagging |
| Reversible mapping | Can trace back any link |
| Full audit trail | Complete history preserved |

---

## PART 2 — KNOWLEDGE THREAD ENGINE

### Purpose
Maintain threads, validate structure, detect conflicts — **not interpret meaning.**

---

### ENGINE RESPONSIBILITIES

- ✅ link events consistently
- ✅ merge threads if identical in structure
- ✅ split threads if permissions differ
- ✅ generate lineage map
- ✅ ensure no interpretative metadata
- ✅ verify cryptographic continuity

---

### ENGINE MODES (5)

| Mode | Action |
|------|--------|
| **BUILD** | Create new thread from replay/memory |
| **EXTEND** | Add nodes to existing threads |
| **RECONCILE** | Detect duplicates & merge safely |
| **INSPECT** | Show chronological or sphere-based structure |
| **EXPORT** | PDF summary, graph bundle, XR visualization |

---

### VALIDATION RULES

A thread node is accepted **ONLY if:**

1. ✅ It has a timestamp
2. ✅ It has a concrete source
3. ✅ It has an explicit sphere
4. ✅ It does not imply causal meaning
5. ✅ It respects user visibility

---

### ENGINE JSON MODEL

```json
{
  "thread_engine": {
    "mode": "build|extend|reconcile|inspect|export",
    "input": {},
    "output": {
      "thread_id": "uuid",
      "status": "ok|error",
      "hash": "sha256"
    }
  }
}
```

---

## PART 3 — THREAD-BASED NAVIGATION

### Purpose
Navigate meetings, replays, spheres, memories via **THREADS** instead of chronological or spatial view.

### RULE
> **Navigation = surfacing structure,**  
> **NOT determining direction.**

---

### NAVIGATION MODES (5)

| Mode | Description |
|------|-------------|
| **FOLLOW_THREAD** | Step through nodes sequentially across spheres, users, meetings |
| **THREAD_CLUSTER_VIEW** | Group multiple threads by topic or sphere |
| **THREAD_DIFF** | Compare 2 threads, no ranking, no judgment |
| **THREAD_TIMELINE** | View thread progression visually |
| **XR_THREAD_PATH** | Immersive path connecting nodes, comfort guaranteed |

---

### THREAD NAVIGATION UI (2D)

```
┌─────────────────────────────────────┐
│  VERTICAL THREAD SPINE              │
│                                     │
│  ○ Node Card                        │
│  │ - type                           │
│  │ - timestamp                      │
│  │ - source                         │
│  │ - sphere icon                    │
│  │                                  │
│  ○ Node Card                        │
│  │ [expand → artifact/replay link]  │
│  │                                  │
│  ○ Node Card                        │
│  ...                                │
└─────────────────────────────────────┘
```

---

### XR THREAD PATH (IMMERSIVE)

#### Geometry
| Element | Representation |
|---------|----------------|
| Nodes | Floating glyph objects |
| Links | Light lines (not directional) |
| Layers | Replay preview bubbles |

#### Interactions
- `point & expand`
- `jump_to(node)`
- `collapse entire branch`
- `follow path slowly (glide mode)`

---

### NAVIGATION JSON MODEL

```json
{
  "thread_nav": {
    "thread_id": "uuid",
    "mode": "follow|cluster|diff|timeline|xr",
    "filters": {
      "sphere": null,
      "type": null,
      "date_range": null
    },
    "user_overrides": true
  }
}
```

---

## FREEZE STATE

### FROZEN (Immutable)
- ✅ definitions
- ✅ JSON models
- ✅ safety rules
- ✅ non-manipulative constraints
- ✅ audit guarantees
- ✅ engine responsibilities

### NOT FROZEN (Evolvable)
- UI variations
- speed optimizations
- visual effects
- multi-user replay styling

---

## UPGRADES NON TERMINÉS (TO REVIEW LATER)

| # | Upgrade | Status |
|---|---------|--------|
| 1 | **Thread Summaries auto-generated** | Must ensure no interpretation creep |
| 2 | **Thread ↔ Universe View fusion layer** | Visual layering rules TBD |
| 3 | **Thread conflict visualizer** | Show contradictory chains (no judgment) |
| 4 | **Thread Privacy Classifications** | Refined scopes: team, sphere, cross-org |
| 5 | **Thread Import/Export Standard** | For collaboration across Che-Nu installations |
| 6 | **Thread Editor UI** | Manual correction / merge tools |
| 7 | **XR Multi-Thread Walkthrough** | Simultaneous traversal of several threads |
| 8 | **Agent Thread Participation Index** | Must remain non-evaluative (pure tracing) |

---

**END — KNOWLEDGE THREAD SYSTEM (FREEZE-READY)**
