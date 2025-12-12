# CHE·NU — KNOWLEDGE THREADS + WEAVING + DIFF + GEO-ASSIST
**VERSION:** INTEL.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## 1) KNOWLEDGE THREADS — CORE FOUNDATION ⚡

### Purpose
> **Create CONTINUOUS knowledge connections between spheres, meetings, agents, documents, without interpretation or persuasion.**

> **A Knowledge Thread = A VERIFIED LINE OF RELATION between facts.**

### RULE
> **Threads = STRUCTURE ONLY. Never opinion. Never inference. Never prediction.**

### 5 Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | Link between factual occurrences across time ⚡ |
| `THREAD_ARTIFACT` | Link between documents, notes, replays ⚡ |
| `THREAD_AGENT` | **Shows where an agent participates or influences structure** ⚡ |
| `THREAD_DECISION` | Connects decisions that share inputs or outputs ⚡ |
| `THREAD_TOPIC` | **Cluster of facts with identical subject labels** ⚡ |

### Thread JSON ⚡
```json
{
  "thread": {
    "id": "uuid",
    "type": "event|artifact|agent|decision|topic",
    "nodes": ["fact_id_1", "fact_id_2", "..."],
    "sphere_origin": "business|scholar|creative|...|mixed",
    "confidence": 1.0,
    "immutable": true
  }
}
```

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **No emotional weight** | ✅ ⚡ |
| **No "importance" ranking** | ✅ ⚡ |
| **No "priority" bias** | ✅ ⚡ |
| **Immutable once validated** | ✅ ⚡ |
| **Thread expansion requires factual match only** | ✅ ⚡ |

---

## 2) KNOWLEDGE WEAVING (MULTI-SPHERE INTELLIGENCE) ⚡ (NOUVEAU!)

### Purpose
> **Show how multiple knowledge threads cross, NOT to suggest meaning, but to visualize structure & patterns.**

### RULE
> **Weaving = VISUAL AGGREGATION. NOT higher reasoning.**

### 3 Weaving Structures ⚡
| Structure | Description |
|-----------|-------------|
| `WEAVE_GRID` | Each sphere anchors a node. **Threads crossing spheres create neutral intersections.** ⚡ |
| `WEAVE_LAYER` | Layers by category: timeline, artifact, participant, sphere ⚡ |
| `WEAVE_FLOW` | **Visual flow of thread density through time** ⚡ |

### Weaving JSON ⚡
```json
{
  "knowledge_weave": {
    "threads": ["uuid1", "uuid2", "..."],
    "crossings": [
      { "t1": "uuid1", "t2": "uuid3", "type": "topic_overlap" }
    ],
    "layers": ["timeline", "sphere", "artifact"],
    "render_mode": "2d|3d|xr"
  }
}
```

### Key Field: `crossings` ⚡ (NOUVEAU!)
> **Neutral intersections between threads**

### Weaving Safety ⚡
| Rule | Status |
|------|--------|
| **No "highlight best path"** | ✅ ⚡ |
| **No removal of alternatives** | ✅ ⚡ |
| **No storytelling** | ✅ ⚡ |
| **No causality assumptions** | ✅ ⚡ |

---

## 3) KNOWLEDGE DIFF (COLLECTIVE vs PERSONAL MEMORY) ⚡ (NOUVEAU!)

### Purpose
> **Show differences between: A) Collective memory, B) User personal memory, C) Agent operational memory**

### RULE
> **Diff = FACTUAL DELTA**

### 4 Diff Types ⚡
| Type | Description |
|------|-------------|
| `DIFF_ADDITION` | Collective contains facts user hasn't seen ⚡ |
| `DIFF_OMISSION` | **User memory contains local data not yet shared** ⚡ |
| `DIFF_DIVERGENCE` | **Same event recorded differently (timestamps, artifacts)** ⚡ |
| `DIFF_CONTEXT` | Same event appears in different spheres ⚡ |

### Diff JSON ⚡
```json
{
  "knowledge_diff": {
    "personal": "memory_id",
    "collective": "memory_id",
    "added": ["..."],
    "removed": ["..."],
    "changed": ["..."],
    "context_shift": ["..."]
  }
}
```

### Diff Visualization Colors ⚡ (NOUVEAU!)
| Color | Meaning |
|-------|---------|
| **green** | added ⚡ |
| **yellow** | changed context ⚡ |
| **grey** | redundant ⚡ |
| **blue** | **collective-only** ⚡ |
| **transparent** | **silence** ⚡ |

### Diff Ethics ⚡
| Diff NEVER | Status |
|------------|--------|
| **judges** | ❌ ⚡ |
| **scores consistency** | ❌ ⚡ |
| **labels contradictions** | ❌ ⚡ |
| **attributes responsibility** | ❌ ⚡ |

---

## 4) GEOLOCALISATION ASSISTANCE & GUIDANCE (CHE·NU) ⚡ (NOUVEAU!)

### Purpose
> **Spatial assistance for: navigation inside Che-Nu (spheres / universe), task location, physical world optional guidance.**

### RULE
> **Geolocation = POSITION INFORMATION. Not direction of choice, not optimized persuasion.**

### CHE-NU Internal Geolocation ⚡
| Element | Description |
|---------|-------------|
| `SPHERE_POSITIONING` | Each sphere has coordinates in Universe View ⚡ |
| `TASK_POSITIONING` | Each task has a virtual anchor ⚡ |
| `AGENT_POSITIONING` | **Agents appear as orbit nodes** ⚡ |

### Real-World Geo (Optional) ⚡
| Rule | Description |
|------|-------------|
| **ACTIVATION** | **Manual only, NEVER activated automatically** ⚡ |
| **Used for** | meeting point, route overview, project site location ⚡ |

### 4 Geo Assist Modes ⚡
| Mode | Description |
|------|-------------|
| `MAP` | 2D flat map + markers ⚡ |
| `AR OVERLAY` | **augmented pointers (non-pushy)** ⚡ |
| `XR GUIDE` | **spatial anchor lines inside XR** ⚡ |
| `DISTANCE ONLY` | **textual distances (neutral)** ⚡ |

### Geo Assist JSON ⚡
```json
{
  "geo_assist": {
    "context": "internal|external",
    "coordinates": { "lat": 0, "lon": 0, "z": 0 },
    "destination": { "lat": 0, "lon": 0, "z": 0 },
    "mode": "map|ar|xr|distance",
    "safety": true
  }
}
```

### Geo Safety Rules ⚡
| Rule | Status |
|------|--------|
| **No optimized routes for persuasion** | ✅ ⚡ |
| **No emotional reinforcement** | ✅ ⚡ |
| **No hidden suggestion** | ✅ ⚡ |
| **No background tracking** | ✅ ⚡ |
| **No automatic route correction** | ✅ ⚡ |
| **No multi-user cross-tracking** | ✅ ⚡ |

### 3 Geo Agents ⚡ (NOUVEAU!)
| Agent | Role |
|-------|------|
| `AGENT_GEO_ANALYZER` | **computes distances only, no recommendations** ⚡ |
| `AGENT_GEO_EXPLAINER` | shows reasoning in plain language ⚡ |
| `AGENT_GEO_GUARD` | **ensures privacy, no tracking retention** ⚡ |

---

## WHY THESE SYSTEMS WORK TOGETHER ⚡

| System | Purpose |
|--------|---------|
| **Knowledge Threads** | show relations ⚡ |
| **Knowledge Weaving** | **show structure** ⚡ |
| **Knowledge Diff** | **align shared reality** ⚡ |
| **Geo-Assist** | **position everything in space** ⚡ |

> **All without influencing decisions.**

---

**END — FREEZE READY**
