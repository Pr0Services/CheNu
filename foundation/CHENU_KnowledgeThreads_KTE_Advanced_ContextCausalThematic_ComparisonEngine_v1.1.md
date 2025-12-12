# CHE·NU — KNOWLEDGE THREAD ENGINE (ADVANCED LAYER)
**VERSION:** KTE.v1.1  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD READY

---

## PURPOSE

The Knowledge Thread Engine (KTE) transforms: Collective Memory (facts), Personal Memory (private), Meeting artifacts, Sphere data, Decision pathways

…into **knowledge threads** that preserve: **context, chronology, neutrality, traceability**

> **NO prediction. NO persuasion. NO agenda shaping.**

---

## THREAD TYPES (3-Core Architecture) ⚡

### THREAD_TYPE 1 — CONTEXT THREAD ⚡
> *"What was happening around this event?"*

**Links:** sphere, participants, topic, related memories

### THREAD_TYPE 2 — CAUSAL TRACE THREAD ⚡
> *"What sequence led here?"*

**Links:** timeline steps, decision paths, referenced artifacts

### THREAD_TYPE 3 — THEMATIC THREAD ⚡
> *"What broad theme connects multiple events?"*

**Links:** topic clusters, recurring structures, **cross-sphere patterns** ⚡

### Each Thread Is ⚡
- deterministic
- reversible
- **source-anchored** ⚡
- **hash-verified** ⚡

---

## THREAD GENERATION LOGIC ⚡

### Thread JSON Model ⚡

```json
{
  "THREAD": {
    "id": "uuid",
    "type": "context|causal|thematic",
    "anchor": "memory_event_id",
    "nodes": ["memory_entry_ids"],
    "links": [
      {"from": "id", "to": "id", "type": "sequence|reference|theme|context"}
    ],
    "metadata": {
      "sphere_distribution": {...},
      "density": "number",
      "cross_sphere": "bool",
      "agent_involvement": "summary",
      "created_at": "timestamp"
    },
    "hash": "sha256"
  }
}
```

### Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **context/causal/thematic** ⚡ |
| `anchor` | **memory_event_id** ⚡ |
| `links[].type` | **sequence/reference/theme/context** ⚡ |
| `metadata.sphere_distribution` | **Object** ⚡ |
| `metadata.cross_sphere` | **boolean** ⚡ |

---

## ALLOWED OPERATIONS ⚡

| Operation | Description |
|-----------|-------------|
| `GENERATE_THREAD(anchor)` | ⚡ |
| `EXPAND_THREAD(depth)` | ⚡ |
| `COMPARE_THREADS(a, b)` | ⚡ |
| `EXPORT_THREAD(thread)` | ⚡ |
| `VISUALIZE_THREAD(thread, mode)` | ⚡ |
| `ATTACH_THREAD_TO_REPORT(thread_id)` | ⚡ |

## DISALLOWED OPERATIONS ⚡

| Forbidden | Status |
|-----------|--------|
| **inferring intent** | ❌ ⚡ |
| **summarizing motivation** | ❌ ⚡ |
| **predicting outcomes** | ❌ ⚡ |
| **ranking decisions** | ❌ ⚡ |
| **emotional weighting** | ❌ ⚡ |

---

## VISUALIZATION MODES ⚡

| Mode | Description |
|------|-------------|
| **MODE 1 — LINEAR FLOW** | timeline layout, arrows show causality, **optional time gaps** ⚡ |
| **MODE 2 — SPHERE ORBIT** | each sphere = orbit ring, **cross-sphere jumps highlighted** ⚡ |
| **MODE 3 — WEAVE VIEW** | colored strands, overlapping = recurring theme, **silence gaps as negative space** ⚡ |
| **MODE 4 — XR IMMERSIVE** | spatial anchors, light filaments, **no motion or psychological FX** ⚡ |

---

## THREAD COMPARISON ENGINE ⚡

### Comparison Is Purely Structural ⚡
| Metric | Description |
|--------|-------------|
| length | ✅ |
| density | ✅ |
| **sphere diversity** | ⚡ |
| replay anchors | ✅ |
| **document reuse** | ⚡ |
| **agent presence** | ⚡ |
| **branching factor** | ⚡ |

### Comparison Output JSON ⚡

```json
{
  "comparison": {
    "threads": ["idA","idB"],
    "similarity_index": "0.0-1.0",
    "shared_nodes": [...],
    "unique_nodes_A": [...],
    "unique_nodes_B": [...],
    "pattern_breaks": [...]
  }
}
```

### Comparison Fields ⚡
| Field | Description |
|-------|-------------|
| `similarity_index` | **0.0-1.0** ⚡ |
| `pattern_breaks` | **Array of breaks** ⚡ |

> **No ranking. No recommendation. No notion of "better thread".**

---

## INTEGRATION WITH UNIVERSE VIEW ⚡

### Display ⚡
| Property | Value |
|----------|-------|
| **soft orbit filaments** | ⚡ |
| **filterable by type** | ⚡ |
| **expandable on click** | ⚡ |
| **never auto-expanded** | ⚡ |

### Thread Anchors ⚡
- highlighted nodes
- **explanation on hover** ⚡

---

## INTEGRATION WITH SPHERES ⚡

### Each Sphere Gets ⚡
| Feature | Description |
|---------|-------------|
| **its own internal thread index** | ⚡ |
| **local thread browser** | ⚡ |
| **cross-sphere merge viewer** | ⚡ |

### Agents Allowed ⚡
| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **constructs threads** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **makes them readable** ⚡ |
| `AGENT_THREAD_GUARD` | **checks ethics** ⚡ |

### Agents Disallowed ⚡
| Forbidden | Status |
|-----------|--------|
| **prescribing thread usage** | ❌ ⚡ |
| **altering node order** | ❌ ⚡ |
| **abandoning traceability** | ❌ ⚡ |

---

## EXPORT OPTIONS ⚡

### PDF_EXPORT(thread_id) ⚡
Contains: diagram, chronology, metadata, hashes, **zero interpretation**

### XR_EXPORT(thread_id) ⚡
Contains: spatial layout, anchor nodes, link filaments, **safety-locked camera path** ⚡

---

## WHY THIS MATTERS ⚡

### Knowledge Threads Allow ⚡
- multi-perspective understanding
- cross-domain synthesis
- **navigable memory** ⚡
- **total traceability** ⚡

### WITHOUT ⚡
- narrative shaping
- bias injection
- **suggestion of "correct" interpretation** ⚡

---

**END — FREEZE READY**
