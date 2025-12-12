# CHE·NU — KNOWLEDGE THREADS SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## A) KNOWLEDGE THREAD — BASE LAYER ⚡

### Purpose
> **Represent connections between information, meetings, decisions, artifacts, and spheres WITHOUT interpretation.**

### RULE
> **Threads = CONNECTIONS, NOT conclusions.**

### Thread Elements ⚡
| Element | Properties |
|---------|------------|
| `THREAD_NODE` | type: event\|artifact\|decision\|memory\|agent_action, origin, timestamp, sphere ⚡ |
| `THREAD_EDGE` | type: referenced\|preceded\|supports\|contradicts\|parallel ⚡ |
| `THREAD_CONTEXT` | participants, sphere, replay source ⚡ |

### Base Thread JSON ⚡
```json
{
  "thread": {
    "id": "uuid",
    "nodes": ["..."],
    "edges": ["..."],
    "context": {},
    "hash": "sha256"
  }
}
```

### Thread Visualization ⚡
| Mode | Options |
|------|---------|
| **2D** | linear, radial, clustered nodes ⚡ |
| **3D** | orbit-thread lines, cluster by sphere ⚡ |
| **XR** | **floating lines, context halos, silent review mode** ⚡ |

### Base Restrictions ⚡
| Rule | Status |
|------|--------|
| **no scoring** | ✅ ⚡ |
| **no importance ranking** | ✅ ⚡ |
| **no predictive inference** | ✅ ⚡ |
| **no missing-node guessing** | ✅ ⚡ |

---

## B) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Link related content across different spheres without merging or altering the spheres themselves.**

### RULE
> **Inter-sphere thread = pure bridge, not blending.**

### 5 InterSphere Triggers ⚡
| Trigger | Description |
|---------|-------------|
| shared topic | ⚡ |
| shared artifact | ⚡ |
| shared participants | ⚡ |
| **sequential events spanning spheres** | ⚡ |
| **cross-sphere decision dependencies** | ⚡ |

### 4 InterSphere Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_BRIDGE` | connects two spheres with clear rationale ⚡ |
| `THREAD_OVERLAY` | shows parallel developments across spheres ⚡ |
| `THREAD_CLUSTER` | grouped threads forming a cross-sphere theme ⚡ |
| `THREAD_GATE` | **indicates information that passes from one sphere to another intentionally** ⚡ |

### InterSphere Thread JSON ⚡
```json
{
  "intersphere_thread": {
    "spheres": ["business", "scholar", "creative"],
    "nodes": ["..."],
    "edges": ["..."],
    "bridge_reason": "shared_artifact|topic|decision_flow",
    "safety_lock": true
  }
}
```

### Key Field: `safety_lock: true` ⚡
> **Protects sphere boundaries**

### Safety Rules ⚡
| Rule | Status |
|------|--------|
| **no merging spheres** | ✅ ⚡ |
| **no cross-sphere dominance** | ✅ ⚡ |
| **no inferred conclusions** | ✅ ⚡ |
| **user controls visibility** | ✅ ⚡ |

---

## C) TEMPORAL KNOWLEDGE THREADS (TIMELINE LAYER) ⚡

### Purpose
> **Reveal evolution of ideas, decisions, and discussions over time across meetings & replays.**

### RULE
> **Thread follows TIME, not importance.**

### 5 Temporal Thread Types ⚡
| Type | Description |
|------|-------------|
| `SEQUENTIAL THREAD` | direct chronological order ⚡ |
| `EVOLUTION THREAD` | **track an idea or artifact across time** ⚡ |
| `DIVERGENCE THREAD` | **shows where two paths separated** ⚡ |
| `MERGE THREAD` | shows convergence from different origins ⚡ |
| `REPLAY-AWARE THREAD` | **links replay states to original meetings** ⚡ |

### Temporal Thread JSON ⚡
```json
{
  "temporal_thread": {
    "origin": "node_id",
    "timeline": [
      { "t": "timestamp", "node": "uuid" }
    ],
    "branches": [
      { "at": "timestamp", "forks": ["uuid1", "uuid2"] }
    ]
  }
}
```

### Key Field: `branches` ⚡
> **Tracks forks in the timeline**

### Timeline Rendering ⚡
| Mode | Features |
|------|----------|
| **2D** | braided timeline, forks & merges marked ⚡ |
| **3D / XR** | **time spiral, floating markers, event halos, multi-thread comparison mode** ⚡ |

### Restrictions ⚡
| Rule | Status |
|------|--------|
| **no prediction** | ✅ ⚡ |
| **no missing-step interpolation** | ✅ ⚡ |
| **no emotional coloring** | ✅ ⚡ |
| **freeze ensures integrity** | ✅ ⚡ |

---

## D) COLLECTIVE vs PERSONAL THREADING (DUAL LAYER) ⚡

### Purpose
> **Allow users to see threads at two levels:** 1) Collective Truth Layer, 2) Personal Navigation Layer.

### RULE
> **Collective = immutable facts. Personal = visualization preferences only.**

### Collective Thread Layer ⚡
| Property | Status |
|----------|--------|
| **sourced from verified replays** | ✅ ⚡ |
| **immutable** | ✅ ⚡ |
| **hash-signed** | ✅ ⚡ |
| **shared across system** | ✅ ⚡ |
| **includes only factual nodes & edges** | ✅ ⚡ |

### Personal Thread Layer ⚡
| Adds | Never Modifies |
|------|----------------|
| filters | data |
| density preferences | connections |
| sphere focus | **meaning** |
| visual clustering | |

### Dual-Layer JSON ⚡
```json
{
  "thread_view": {
    "collective": { "nodes": ["..."], "edges": ["..."] },
    "personal": {
      "filters": {},
      "visibility": {},
      "cluster_mode": "minimal|normal|dense"
    }
  }
}
```

### Key Field: `cluster_mode` ⚡
> **User controls visual density**

### Dual-Layer Rendering ⚡
| Property | Description |
|----------|-------------|
| **collective base always shown** | ⚡ |
| **personal layer overlays with transparency** | ⚡ |
| **user can toggle personal layer off** | ⚡ |

### Safety ⚡
| Rule | Status |
|------|--------|
| **personal layer NEVER hides collective truth** | ✅ ⚡ |
| **clear indicator when filters apply** | ✅ ⚡ |
| **no psychological biases** | ✅ ⚡ |

---

**END — KNOWLEDGE THREADS v1.0 FREEZE READY**
