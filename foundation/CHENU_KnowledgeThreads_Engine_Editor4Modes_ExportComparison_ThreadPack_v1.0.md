# CHE·NU — KNOWLEDGE THREAD ENGINE + EDITOR + EXPORT
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## KNOWLEDGE THREAD — CORE PRINCIPLE ⚡

> **A Knowledge Thread is a verifiable chain of facts, artifacts, and decisions linking multiple meetings, spheres, replays, or agents.**

### RULE
> **A Thread describes CONNECTIONS, not interpretations. Thread = STRUCTURE. NOT narrative, NOT influence, NOT inference.**

---

## 1) KNOWLEDGE THREAD ENGINE ⚡

### Purpose
> **Automatically detect, maintain, and visualize interlinked information across the user's Che-Nu ecosystem.**

### Thread Generation Triggers ⚡
| AUTO | MANUAL |
|------|--------|
| shared topics | **user pins nodes** |
| shared artifacts | **agent marks connections** |
| repeated participants | |
| temporal continuity | |
| sphere adjacency | |
| **referenced replays** | |

### Thread Element Types ⚡
| THREAD_NODE | THREAD_EDGE |
|-------------|-------------|
| meeting | `related_to` |
| artifact | `follows` |
| decision | `references` |
| replay moment | `derived_from` |
| user/agent contribution | **`needs_review`** |

### Thread Engine Logic ⚡
```
IF (shared_artifact) → add edge("related_to")
IF (timeline_gap < threshold) → edge("follows")
IF (decision references earlier doc) → edge("derived_from")
IF (multiple sphere crossing) → mark_thread "cross_sphere"
```

### Forbidden ⚡
| NO | Status |
|----|--------|
| **emotional weight** | ❌ ⚡ |
| **priority ranking** | ❌ ⚡ |
| **hidden inference** | ❌ ⚡ |

### Thread Engine JSON ⚡
```json
{
  "knowledge_thread": {
    "id": "uuid",
    "title": "string",
    "nodes": ["uuid", "uuid"],
    "edges": [
      { "from": "uuid", "to": "uuid", "type": "related_to" }
    ],
    "sphere_span": ["business", "scholar", "creative"],
    "integrity_hash": "sha256"
  }
}
```

### Thread Engine Safety ⚡
| Rule | Status |
|------|--------|
| **Immutable history** | ✅ ⚡ |
| **Hash validation per node** | ✅ ⚡ |
| **NO predictive fill** | ✅ ⚡ |
| **NO missing-step inference** | ✅ ⚡ |
| **Read-only for agents** | ✅ ⚡ |

---

## 2) KNOWLEDGE THREAD EDITOR (UI + XR + 2D) ⚡

### Purpose
> **Give users full control to build, adjust, annotate, and freeze their Knowledge Threads.**

### RULE
> **User is the only author of thread meaning.**

### 4 Editor Modes ⚡
| Mode | Features |
|------|----------|
| `GRAPH` | drag nodes, create/remove edges, cluster by sphere, zoom/focus ⚡ |
| `TIMELINE` | ordered view, attach replay segments, **label decision chains** ⚡ |
| `ARTIFACT VIEW` | preview documents, attach snapshots, **add context tags** ⚡ |
| `XR THREAD ROOM` | **nodes as floating orbs, edges as spatial beams, 3D "walkable" thread history** ⚡ |

### 2D Editor Components ⚡
| Component | Description |
|-----------|-------------|
| `ThreadCanvas` | ⚡ |
| `NodeInspector` | ⚡ |
| `EdgeMenu` | ⚡ |
| `TimelineRack` | ⚡ |
| `ArtifactSidebar` | ⚡ |
| `Save/Export Panel` | ⚡ |

### XR Editor Interactions ⚡
| Action | Description |
|--------|-------------|
| pinch | duplicate node reference ⚡ |
| grab | reorder ⚡ |
| tap | open context ⚡ |
| **thread braid mode** | **shows parallel chains** ⚡ |
| **silence gaps** | **visualized as dim corridors** ⚡ |

### Thread Editor State JSON ⚡
```json
{
  "thread_editor_state": {
    "selected_node": "uuid",
    "selected_edge": "uuid",
    "mode": "graph|timeline|artifact|xr",
    "filters": { "sphere": [], "participants": [] },
    "unsaved_changes": true
  }
}
```

### Validation Rules ⚡
| Rule | Status |
|------|--------|
| **Cannot connect nodes without factual linkage** | ✅ ⚡ |
| **Cannot create inferred event** | ✅ ⚡ |
| **Editor enforces type-safe edges only** | ✅ ⚡ |

---

## 3) KNOWLEDGE THREAD EXPORT + COMPARISON ⚡

### Purpose
> **Create shareable bundles of Threads, compare two Threads, and produce clean, immutable documentation.**

### 3 Export Formats ⚡

#### EXPORT 1 — PDF THREAD BOOK ⚡
| Page | Content |
|------|---------|
| 1 | Thread overview (title, span, purpose) |
| 2 | **Graph map (2D layout)** |
| 3 | **Timeline braid** |
| 4 | Node details + artifacts |
| 5 | Decision chains |
| 6 | **Integrity hash page** |

#### EXPORT 2 — THREADPACK (`.ktpack`) ⚡ (NOUVEAU!)
| Content | Description |
|---------|-------------|
| `nodes.json` | ⚡ |
| `edges.json` | ⚡ |
| `timeline.json` | ⚡ |
| artifact snapshots | ⚡ |
| replay references | ⚡ |
| thread metadata | ⚡ |
| **sha256 signature** | ⚡ |

#### EXPORT 3 — XR THREAD ROOM ⚡
| Feature | Description |
|---------|-------------|
| **teleportable XR space** | ⚡ |
| **spatial thread reconstruction** | ⚡ |
| **replay entrypoints embedded** | ⚡ |

### 4 Comparison Modes ⚡
| Mode | Description |
|------|-------------|
| **STRUCTURAL** | number of nodes, density, spheres involved, symmetry ⚡ |
| **TIMELINE** | where they diverge/converge, **missing nodes (highlight neutral)** ⚡ |
| **ARTIFACT OVERLAP** | shared documents, reused boards, repeated decisions ⚡ |
| **DECISION BRAIDING** | **show both chains side-by-side, no good/bad labeling** ⚡ |

### Comparison JSON ⚡
```json
{
  "thread_comparison": {
    "thread_a": "uuid",
    "thread_b": "uuid",
    "comparison": {
      "overlap_nodes": ["..."],
      "unique_a": ["..."],
      "unique_b": ["..."],
      "timeline_divergence": ["..."],
      "artifact_overlap": ["..."]
    },
    "read_only": true
  }
}
```

### Comparison Safety ⚡
| Rule | Status |
|------|--------|
| **NEVER show influence scores** | ✅ ⚡ |
| **NEVER propose "optimal" path** | ✅ ⚡ |
| **ONLY structural + factual differences** | ✅ ⚡ |

---

## WHY KNOWLEDGE THREADS MATTER ⚡

> **Threads = MEMORY + STRUCTURE. NOT influence, NOT storytelling.**

### This System Gives ⚡
| Capability | Status |
|------------|--------|
| **factual continuity** | ✅ ⚡ |
| **multi-meeting clarity** | ✅ ⚡ |
| **multi-sphere traceability** | ✅ ⚡ |
| **XR visualization of knowledge** | ✅ ⚡ |

> **WITHOUT distorting interpretation.**

---

**END — FOUNDATION FREEZE**
