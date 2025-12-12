# CHE·NU — KNOWLEDGE THREADS (1–4)
**VERSION:** CORE.v2.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## 1) KNOWLEDGE THREAD — CORE FOUNDATION ⚡

### Purpose
> **Connect related knowledge objects across meetings, documents, decisions, artifacts, and spheres.**

### RULE
> **Thread = LINKING OF FACTS. NOT interpretation, NOT recommendation, NOT narrative shaping.**

### 5 Knowledge Object Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | timestamped action/silence ⚡ |
| `THREAD_ARTIFACT` | file, board, visual ⚡ |
| `THREAD_DECISION` | declared outcome ⚡ |
| `THREAD_CONTEXT` | sphere, team, meeting type ⚡ |
| `THREAD_AGENT_ACT` | **agent trace only** ⚡ |

### Thread Structure ⚡
> **A Thread = ordered chain of FACTUAL objects.**

```json
{
  "thread": {
    "id": "uuid",
    "title": "string",
    "nodes": ["object_id_1", "object_id_2", "object_id_3"],
    "sphere": "business|scholar|creative|...",
    "created_from": "collective_memory",
    "hash": "sha256"
  }
}
```

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **immutable nodes** | ✅ ⚡ |
| **versioned** | ✅ ⚡ |
| **cryptographically hashed** | ✅ ⚡ |
| **no inference allowed** | ✅ ⚡ |

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Link facts across multiple spheres without merging ideologies, semantics, or private meaning.**

### RULE
> **Cross-sphere = structural similarity only.**

### 6 Cross-Sphere Link Types ⚡
| Type | Description |
|------|-------------|
| `shared_artifact` | ⚡ |
| `shared_topic` | ⚡ |
| `parallel_decision` | ⚡ |
| `resource_reference` | ⚡ |
| `temporal_proximity` | ⚡ |
| `agent_crossover` | ⚡ |

### Cross-Sphere Thread JSON ⚡
```json
{
  "cross_thread": {
    "id": "uuid",
    "spheres": ["business", "scholar", "creative"],
    "nodes": [
      { "object": "uuid", "sphere": "business" },
      { "object": "uuid", "sphere": "scholar" },
      { "object": "uuid", "sphere": "creative" }
    ],
    "link_types": ["parallel_decision"],
    "hash": "sha256"
  }
}
```

### Constraints ⚡
| Constraint | Status |
|------------|--------|
| **private data stays private** | ✅ ⚡ |
| **sphere boundaries respected** | ✅ ⚡ |
| **no domain dominance** | ✅ ⚡ |
| **no predictive logic** | ✅ ⚡ |

---

## 3) PERSONAL ↔ COLLECTIVE KNOWLEDGE THREAD DIFF ⚡

### Purpose
> **Show differences between a user's personal thread and the collective version WITHOUT bias.**

### RULE
> **Diff = reveal differences ONLY, not preference.**

### 5 Diff Categories ⚡
| Category | Description |
|----------|-------------|
| `MISSING_NODES` | collective has entries user lacks ⚡ |
| `EXTRA_NODES` | **user added private notes** ⚡ |
| `ORDER_DIFF` | timeline mismatch ⚡ |
| `SCOPE_DIFF` | **spheres differ** ⚡ |
| `DETAIL_DIFF` | **metadata differs** ⚡ |

### Thread Diff JSON ⚡
```json
{
  "thread_diff": {
    "thread_id": "uuid",
    "personal_view": ["..."],
    "collective_view": ["..."],
    "diff": {
      "missing": ["..."],
      "extra": ["..."],
      "order": ["..."],
      "scope": ["..."],
      "detail": ["..."]
    }
  }
}
```

### UI Rules ⚡
| Rule | Status |
|------|--------|
| **no scoring** | ✅ ⚡ |
| **no "correct thread"** | ✅ ⚡ |
| **show differences neutrally** | ✅ ⚡ |

---

## 4) KNOWLEDGE THREAD ORCHESTRATION ENGINE ⚡

### Purpose
> **Manage thread creation, updates, linking, visualization. Does NOT create meaning. Does NOT merge threads automatically.**

### 5 Engine Modules ⚡
| Module | Role |
|--------|------|
| `THREAD_BUILDER` | creates new threads from collective memory, **never interprets content** ⚡ |
| `THREAD_LINKER` | adds links based on explicit structural rules, **cross-sphere linking on permitted types only** ⚡ |
| `THREAD_VERSIONING` | stores previous versions, **protects immutability** ⚡ |
| `THREAD_VISUALIZER` | 2D view (graph), 3D XR thread (orbit chain), **no emotional visuals** ⚡ |
| `THREAD_GUARD` | ensures no inference, no sentiment, no persuasion, **no predictive labeling** ⚡ |

### Thread Engine JSON ⚡
```json
{
  "thread_engine": {
    "modules": [
      "builder",
      "linker",
      "versioning",
      "visualizer",
      "guard"
    ],
    "policies": {
      "immutability": true,
      "cross_sphere_protection": true,
      "no_inference": true,
      "private_scope_respect": true
    }
  }
}
```

---

## WHY 1–4 TOGETHER ⚡

| # | = |
|---|---|
| **1** | Create facts-chain |
| **2** | Bridge spheres safely |
| **3** | Highlight perspective differences without bias |
| **4** | **Manage the whole ecosystem ethically** |

### Together ⚡
> **A FREE, TRANSPARENT, NON-MANIPULATIVE KNOWLEDGE SYSTEM.**

---

**END — CANONICAL FREEZE**
