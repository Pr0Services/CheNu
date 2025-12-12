# CHE·NU — KNOWLEDGE THREADS + THREAD RENDERING ENGINE + MEMORY INTEGRATION
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## SECTION 1 — KNOWLEDGE THREADS (3 LEVELS) ⚡

### Purpose
Reveal **STRUCTURAL relations** between information across spheres, meetings, replays, decisions, artifacts, agents. **Never infer meaning. Only show verifiable linkage.**

### RULE
> **A thread = a connection between FACTS, NOT interpretations, NOT suggestions.**

---

### LEVEL 1 — FACT THREADS (EVENT-BASED) ⚡

#### Definition
Thread created whenever two memory events share: same artifact, same topic, same sphere, same timestamp cluster, same user/agent participation.

#### Node Types ⚡
| Type | Description |
|------|-------------|
| `event` | ⚡ |
| `artifact` | ⚡ |
| `replay segment` | ⚡ |
| `participant reference` | ⚡ |

#### Edges ⚡
| Type | Description |
|------|-------------|
| `references` | ⚡ |
| `originates_from` | ⚡ |
| `co-occurs` | ⚡ |

#### Fact Thread JSON ⚡

```json
{
  "fact_thread": {
    "id": "uuid",
    "nodes": ["..."],
    "edges": ["..."],
    "source": ["memory_id", "memory_id"],
    "integrity": "verified"
  }
}
```

---

### LEVEL 2 — CONTEXT THREADS (MULTI-MEETING) ⚡

#### Definition
Aggregates **FACT THREADS across multiple meetings.**

#### Triggers ⚡
| Trigger | Description |
|---------|-------------|
| **recurring topic** | ⚡ |
| **repeated artifact use** | ⚡ |
| **long-term project** | ⚡ |
| **cross-sphere involvement** | ⚡ |

#### Properties ⚡
| Property | Description |
|----------|-------------|
| `temporal flow` | ⚡ |
| `sphere distribution` | ⚡ |
| `agent involvement index` | ⚡ |

#### Context Thread JSON ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "fact_threads": ["id1", "id2"],
    "timeline": ["..."],
    "spheres": ["business", "scholar", "..."],
    "visibility": "user|team|sphere"
  }
}
```

---

### LEVEL 3 — KNOWLEDGE THREADS (MACRO-SCALE) ⚡

#### Definition
High-level structural abstract that shows how ideas, decisions, and collaborations evolve over time.

> **No meaning added. No predictions. No optimization.**

#### Representation ⚡
| Feature | Description |
|---------|-------------|
| `multi-layer graph` | ⚡ |
| `periodicity detection` | ⚡ |
| `cross-thread linkage` | ⚡ |
| `memory anchor points` | ⚡ |

#### Knowledge Thread JSON ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "context_threads": ["..."],
    "structure": "graph",
    "anchors": [{ "t": "...", "ref": "memory_id" }],
    "hash": "sha256"
  }
}
```

---

## SECTION 2 — THREAD RENDERING ENGINE ⚡

### Purpose
Render threads in **2D, 3D, and XR universe view.**

### RULE
> **Rendering = VISUALIZATION ONLY.**

### Render Modes ⚡
| Mode | Description |
|------|-------------|
| `MODE 2D` | collapsible tree, inline timeline, **artifact preview popouts** ⚡ |
| `MODE 3D` | orbit clusters by sphere, thread lines = **subtle light ribbons**, anchor nodes = stable points ⚡ |
| `MODE XR` | spatial ribbon threads, **freeze-on-focus detail panels**, thread-walking navigation ⚡ |

### Render Engine API ⚡

```javascript
renderThread(thread_id, mode, options)

options: {
  "highlight_nodes": [...],
  "fade_unrelated": true/false,
  "show_timeline": true/false,
  "sphere_color_map": {...},
  "accessibility": "low_motion|high_contrast"
}
```

### Thread Visual Design Rules ⚡
| Rule | Status |
|------|--------|
| **no flashing** | ✅ ⚡ |
| **no emotional cues** | ✅ ⚡ |
| **no thick lines (avoid dominance)** | ✅ ⚡ |
| **colors = sphere-coded only** | ✅ ⚡ |
| **use motion minimalism (glide < 0.2 m/s)** | ✅ ⚡ |

### Thread Ribbon Spec ⚡ (NOUVEAU!)

| Property | Value |
|----------|-------|
| **thickness** | constant (0.03) ⚡ |
| **curvature** | proportional to temporal distance (0.2) ⚡ |
| **glow** | **disabled by default** ⚡ |
| **animation** | glide ⚡ |

```json
{
  "thread_ribbon": {
    "thickness": 0.03,
    "curvature": 0.2,
    "color": "sphere_primary",
    "animation": "glide"
  }
}
```

---

## SECTION 3 — MEMORY INTEGRATION ⚡

### Purpose
Bind threads to the memory layer so they remain **factual, versioned, auditable, and immutable.**

### Memory → Thread Pipeline ⚡ (NOUVEAU!)
| Step | Description |
|------|-------------|
| **1** | Extract memory events ⚡ |
| **2** | Detect shared attributes ⚡ |
| **3** | Construct fact threads ⚡ |
| **4** | Group into context threads ⚡ |
| **5** | Elevate into knowledge threads ⚡ |
| **6** | **Hash + store (append-only)** ⚡ |

### Memory Safety Rules ⚡
| Rule | Status |
|------|--------|
| **No merging unless hash match** | ✅ ⚡ |
| **No thread regeneration without verification** | ✅ ⚡ |
| **No deletion, only superseded versions** | ✅ ⚡ |
| **Per-user visibility respected** | ✅ ⚡ |

### Memory Integration JSON ⚡

```json
{
  "knowledge_memory_binding": {
    "memory_source": "collective",
    "thread_index": ["..."],
    "integrity": "verified",
    "visibility": "scoped"
  }
}
```

---

## SECTION 4 — UNIVERSE VIEW INTEGRATION ⚡

### Universe View Shows Threads As ⚡
| Element | Description |
|---------|-------------|
| orbit lines | ⚡ |
| inter-sphere bridges | ⚡ |
| temporal gradients | ⚡ |
| replay anchors | ⚡ |
| **decision chains** | ⚡ |

### User Interactions ⚡
| Function | Description |
|----------|-------------|
| `highlight_thread(id)` | ⚡ |
| `walk_thread_forward()` | ⚡ |
| `walk_thread_backward()` | ⚡ |
| `expand_context_cluster()` | ⚡ |
| `filter_by_sphere()` | ⚡ |
| `filter_by_participant()` | ⚡ |
| `open_replay_at_anchor()` | ⚡ |

### Agent Coordination ⚡
| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **constructs threads, does not interpret meaning** ⚡ |
| `AGENT_THREAD_GUARD` | **ensures compliance with safety rules** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **translates thread logic into neutral language** ⚡ |

---

## SECTION 5 — EXPORT + IMPORT ⚡

### Export ⚡
| Format | Description |
|--------|-------------|
| **PDF knowledge-thread summary** | ⚡ |
| **XR bundle (.xrpack-thread)** | ⚡ |
| **2D/3D graph export (.svg / .gltf)** | ⚡ |
| **hashed memory snapshot** | ⚡ |

### Import ⚡
| Feature | Description |
|---------|-------------|
| **thread recomposition from hash** | ⚡ |
| **replay reconstruction** | ⚡ |
| **artifact attachment** | ⚡ |

---

**END — KNOWLEDGE THREADS FOUNDATION**
