# CHE·NU — KNOWLEDGE THREADS (3-LAYER SYSTEM)
**VERSION:** KN.v1.0  
**MODE:** FOUNDATION / NON-PERSUASIVE / BUILD-READY

---

## LAYER 1 — BASE KNOWLEDGE THREADS ⚡

### Purpose
Represent the path of **KNOWLEDGE inside a single sphere.** A Knowledge Thread = a chain of facts, artifacts, decisions, and context nodes tied together by meaning (NOT inference).

### RULE
> **A thread connects what IS, not what SHOULD BE.**

### Base Thread Structure ⚡
| Field | Description |
|-------|-------------|
| `id` | uuid ⚡ |
| `sphere` | business/scholar/creative/social/... ⚡ |
| `nodes` | fact_node, artifact_node, decision_node, event_node ⚡ |
| `timeline` | chronological list ⚡ |
| `visibility` | **user-scoped or shared** ⚡ |

### Node Types ⚡
| Type | Description |
|------|-------------|
| `fact_node` | **verified information** ⚡ |
| `artifact_node` | files, notes, boards, charts ⚡ |
| `decision_node` | outcome + timestamp ⚡ |
| `event_node` | **interactions inside meetings or XR** ⚡ |

### Base Thread JSON ⚡

```json
{
  "thread_base": {
    "id": "uuid",
    "sphere": "business",
    "nodes": [
      { "type": "fact", "ref": "id", "t": 17123 },
      { "type": "artifact", "ref": "id", "t": 17124 },
      { "type": "decision", "ref": "id", "t": 17125 }
    ],
    "timeline": true
  }
}
```

### Base Rules ⚡
| Rule | Status |
|------|--------|
| **immutable after validation** | ✅ ⚡ |
| **no interpretation layers** | ✅ ⚡ |
| **no scoring** | ✅ ⚡ |
| **can be extended but never rewritten** | ✅ ⚡ |

---

## LAYER 2 — CROSS-SPHERE KNOWLEDGE THREADS (BRIDGES) ⚡

### Purpose
Align knowledge across spheres **WITHOUT merging them, WITHOUT biasing interpretation.**

### A Cross-Sphere Thread Highlights ⚡
| Highlights | Status |
|------------|--------|
| **parallels** | ✅ ⚡ |
| **shared artifacts** | ✅ ⚡ |
| **matching decisions** | ✅ ⚡ |
| **temporal relationships** | ✅ ⚡ |
| **similar context patterns** | ✅ ⚡ |

### NOT ⚡
| Forbidden | Status |
|-----------|--------|
| **conclusions** | ❌ ⚡ |
| **recommendations** | ❌ ⚡ |
| **optimization paths** | ❌ ⚡ |

### Bridge Thread Structure ⚡
| Field | Description |
|-------|-------------|
| `id` | uuid ⚡ |
| `spheres_involved` | ["scholar", "creative", "business"] ⚡ |
| `anchor_nodes` | **points where spheres connect** ⚡ |
| `bridge_type` | shared_artifact/shared_decision/shared_context/temporal_parallel ⚡ |
| `weight` | **purely structural strength (not confidence)** ⚡ |

### Bridge Thread JSON ⚡

```json
{
  "thread_bridge": {
    "id": "uuid",
    "spheres": ["scholar", "creative"],
    "anchors": [
      { "node_id": "A", "sphere": "scholar" },
      { "node_id": "B", "sphere": "creative" }
    ],
    "type": "shared_artifact",
    "weight": 0.42
  }
}
```

### Bridge Rules ⚡
| Rule | Status |
|------|--------|
| **sphere autonomy preserved** | ✅ ⚡ |
| **no cross-sphere dominance** | ✅ ⚡ |
| **bridges are optional overlays** | ✅ ⚡ |
| **user controls visibility** | ✅ ⚡ |

---

## LAYER 3 — TEMPORAL KNOWLEDGE THREADS (EVOLUTION) ⚡

### Purpose
Show **HOW knowledge evolves with time:** expansions, contractions, mutations (artifact updates), forks (new directions), merges (converging decisions)

### RULE
> **Timeline ≠ narrative → The system shows WHAT changed, never WHY it changed.**

### Temporal Thread Structure ⚡
| Field | Description |
|-------|-------------|
| `id` | uuid ⚡ |
| `root_thread` | base or bridge ⚡ |
| `historic_versions` | v1, v2, v3… ⚡ |
| `evolution_events` | **see below** ⚡ |
| `visualization_mode` | braid_view/lineage_tree/XR temporal orbit ⚡ |

### Evolution Events ⚡ (NOUVEAU!)
| Event | Description |
|-------|-------------|
| `updated_artifact` | ⚡ |
| `appended_fact` | ⚡ |
| `retracted_event` | **(if invalid)** ⚡ |
| `fork_created` | ⚡ |
| `merge_detected` | ⚡ |

### Temporal Thread JSON ⚡

```json
{
  "thread_temporal": {
    "id": "uuid",
    "root": "thread_base_id",
    "versions": [
      { "v": 1, "nodes": [...] },
      { "v": 2, "nodes": [...] }
    ],
    "evolution": [
      { "t": 1712301, "type": "append_fact", "ref": "id" },
      { "t": 1712999, "type": "fork_created", "ref": "id" }
    ]
  }
}
```

### XR Temporal Visualization ⚡ (NOUVEAU!)
| Element | = |
|---------|---|
| **orbit rings** | → snapshots in time ⚡ |
| **inner core** | → earliest version ⚡ |
| **outer rings** | → newer versions ⚡ |
| **braid lines** | → forks and merges ⚡ |
| **silence gaps** | → periods without activity ⚡ |

### Safety Locks ⚡
| Lock | Status |
|------|--------|
| **no predictive modeling** | ✅ ⚡ |
| **no causal assumptions** | ✅ ⚡ |
| **no emotional overlays** | ✅ ⚡ |
| **immutable audit history** | ✅ ⚡ |

---

## HOW THE 3 LAYERS INTERLOCK ⚡

| Layer | Purpose |
|-------|---------|
| **BASE THREAD** | → describes knowledge inside a sphere ⚡ |
| **BRIDGE THREAD** | → links knowledge across spheres ⚡ |
| **TEMPORAL THREAD** | → tracks evolution over time ⚡ |

### Together ⚡
- structure without storytelling
- connections without manipulation
- **evolution without rewriting** ⚡

---

**END — KNOWLEDGE THREAD TRINITY**
