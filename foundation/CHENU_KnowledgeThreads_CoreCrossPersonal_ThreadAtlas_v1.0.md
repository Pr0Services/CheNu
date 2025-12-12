# CHE·NU — KNOWLEDGE THREADS (CORE/CROSS/PERSONAL + ATLAS)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## 1) KNOWLEDGE THREAD — CORE

### Purpose
A KNOWLEDGE THREAD links related information across: meetings, spheres, agents, artifacts, decisions, timelines **WITHOUT interpretation, scoring, or guidance.**

### RULE
> **Thread = STRUCTURE, NOT MEANING.**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | connects events with similar context |
| `THREAD_ARTIFACT` | links documents, notes, boards, media |
| `THREAD_DECISION` | links decisions with common parameters |
| `THREAD_TEMPORAL` | links chronologically aligned patterns |
| `THREAD_SILENCE` | **links non-action periods across timelines** ⚡ |

### Thread Unit JSON ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "event|artifact|decision|temporal|silence",
    "nodes": ["memory_id_1","memory_id_2","..."],
    "origin": "sphere_id",
    "created_at": "...",
    "hash": "sha256"
  }
}
```

### Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **event/artifact/decision/temporal/silence** ⚡ |
| `origin` | **sphere_id** ⚡ |

### Thread Creation Rules ⚡
| Rule | Status |
|------|--------|
| **NEVER automatic full-chain inference** | ✅ ⚡ |
| **ONLY based on explicit matching criteria** | ✅ ⚡ |
| **User or Agent_Request required for persistent threads** | ✅ ⚡ |
| **Auto-threads = read-only suggestions** | ✅ ⚡ |

### Matching Criteria ⚡
- topic, timestamp, artifact tag, sphere, participants

### Visualization (2D / XR) ⚡
| Mode | Description |
|------|-------------|
| linear mode | ✅ |
| radial mode | ✅ |
| **braid mode** | (multiple threads interacting) ⚡ |
| **collapse/expand segments** | ⚡ |

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS

### Purpose
Reveal neutral structural relationships between spheres.

### RULE
> **Cross-sphere threads connect CONTENT, NEVER BEHAVIOR.**

### Cross-Sphere Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_CROSS_TOPIC` | **Same topic appears in different spheres** ⚡ |
| `THREAD_CROSS_ARTIFACT` | **Same artifact used across contexts** ⚡ |
| `THREAD_CROSS_DECISION` | **Multiple spheres affected by one outcome** ⚡ |
| `THREAD_CROSS_AGENT` | **One agent participates across spheres** ⚡ |
| `THREAD_CROSS_USER` | **A user interacts with the same idea in multiple spheres** ⚡ |

### Cross-Sphere JSON (with sphere_links + common_signal) ⚡

```json
{
  "cross_thread": {
    "id": "uuid",
    "sphere_links": [
      {"sphere":"business", "nodes":[...]},
      {"sphere":"scholar", "nodes":[...]},
      {"sphere":"creative", "nodes":[...]}
    ],
    "common_signal": "topic|artifact|decision",
    "integrity": "verified",
    "hash": "sha256"
  }
}
```

### Cross-Sphere Fields ⚡
| Field | Description |
|-------|-------------|
| `sphere_links` | **Array of {sphere, nodes}** ⚡ |
| `common_signal` | **topic/artifact/decision** ⚡ |
| `integrity` | **"verified"** ⚡ |

### Visualization ⚡

| Mode | Description |
|------|-------------|
| **XR ORBIT MAP** | spheres = orbits, threads = bridges, **no movement bias, no emphasis hierarchy** ⚡ |
| **2D LAYER** | layered circles, **thread lines with equal weight** ⚡ |

---

## 3) COLLECTIVE ↔ PERSONAL KNOWLEDGE THREADING ⚡

### Purpose
Allow a user to view threads through their **OWN perspective** WITHOUT altering the collective structure.

### RULE
> **PERSONAL VIEW = FILTER → NOT MODIFICATION.**

### Personal Lens Types ⚡
| Lens | Description |
|------|-------------|
| `LENS_MINIMAL` | **only user-related nodes** ⚡ |
| `LENS_EXPANDED` | **user nodes + immediate neighbors** ⚡ |
| `LENS_FULL` | entire thread with neutral weighting |
| `LENS_TIMELINE` | **chronology-first view** ⚡ |

### Personal Thread View JSON ⚡

```json
{
  "personal_thread_view": {
    "user_id": "uuid",
    "thread_id": "uuid",
    "lens": "minimal|expanded|full|timeline",
    "visibility": {
      "hide_private_nodes": true,
      "show_cross_sphere": true
    }
  }
}
```

### Personal View Fields ⚡
| Field | Description |
|-------|-------------|
| `lens` | **minimal/expanded/full/timeline** ⚡ |
| `visibility.hide_private_nodes` | **true** ⚡ |
| `visibility.show_cross_sphere` | **true** ⚡ |

### Safety Guarantees ⚡
| Guarantee | Status |
|-----------|--------|
| No inferred preference | ✅ |
| No predictive logic | ✅ |
| No importance ranking | ✅ |
| **No emotional cues** | ✅ ⚡ |

---

## 4) THREAD ATLAS (GLOBAL MAP) ⚡

### Purpose
A global, immutable map of **ALL validated threads** across spheres, users, agents, timelines, memory.

### RULE
> **Atlas = CARTOGRAPHY, NOT INTERPRETATION.**

### Atlas JSON ⚡

```json
{
  "thread_atlas": {
    "threads": [...],
    "cross_threads": [...],
    "sphere_maps": {
      "business": {...},
      "scholar": {...},
      "creative": {...},
      "social": {...},
      "institution": {...},
      "xr": {...}
    },
    "last_update": "...",
    "integrity_hash": "sha256"
  }
}
```

### Atlas Visual Layers ⚡
| Layer | Description |
|-------|-------------|
| **LAYER 1 — SPHERE CONSTELLATIONS** | threads = stars, cross-threads = light bridges ⚡ |
| **LAYER 2 — TEMPORAL GRID** | years → months → sessions ⚡ |
| **LAYER 3 — MEMORY BASELINES** | **collective memory anchors** ⚡ |
| **LAYER 4 — USER OVERLAY** | **personal lens = optional transparent overlay** ⚡ |
| **LAYER 5 — TRACEABILITY MODE** | **click thread → see origin replay** ⚡ |

### Agents Involved ⚡
| Agent | Role |
|-------|------|
| `ATLAS_BUILDER` | aggregates validated threads only |
| `ATLAS_GUARD` | ensures immutability + **truth constraint** ⚡ |
| `ATLAS_RENDERER` | builds 2D + XR views, **no narrative shaping** ⚡ |

---

**END — THREAD ENGINE FREEZE**
