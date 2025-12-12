# CHE·NU — KNOWLEDGE THREAD ENGINE (EXTENDED)
**VERSION:** CORE.v2.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## 1) COLLECTIVE VS PERSONAL KNOWLEDGE THREADS

### Purpose
Mirror how knowledge flows between: the **INDIVIDUAL** (personal context) and the **COLLECTIVE** (shared context)

### RULE
> **Threads NEVER impose meaning; they only reveal connections.**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `PERSONAL_THREAD` | **user-only, private thinking patterns, task links, sphere activity history** ⚡ |
| `COLLECTIVE_THREAD` | **shared across team/sphere, validated artifacts, replay memory nodes** ⚡ |
| `BRIDGE_THREAD` | **appears when personal and collective threads overlap, must be explicitly approved** ⚡ |

### Thread Model JSON (with visibility) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "personal|collective|bridge",
    "sphere": "business|scholar|creative|...",
    "nodes": ["artifact|decision|event|note"],
    "links": [
      { "from": "nodeX", "to": "nodeY", "reason": "topic|time|agent" }
    ],
    "visibility": {
      "user_only": true,
      "team_shared": false
    },
    "hash": "sha256"
  }
}
```

### Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **personal/collective/bridge** ⚡ |
| `links[].reason` | **topic/time/agent** ⚡ |
| `visibility.user_only` | **true/false** ⚡ |
| `visibility.team_shared` | **true/false** ⚡ |

### Movement Rules ⚡
| Direction | Rule |
|-----------|------|
| **PERSONAL → COLLECTIVE** | explicit approval, integrity check, **no private data leaks** ⚡ |
| **COLLECTIVE → PERSONAL** | always allowed, **remains non-binding** ⚡ |

---

## 2) INTERSPHERE THREAD WEAVING ENGINE ⚡

### Purpose
Reveal how knowledge travels **between spheres.**

### RULE
> **Weaving = structural relation, NOT dependency.**

### Weave Types ⚡
| Type | Description |
|------|-------------|
| `LINEAR WEAVE` | **event in sphere A → related artifact in sphere B** ⚡ |
| `RADIAL WEAVE` | **single thread touches multiple spheres** ⚡ |
| `CONVERGENT WEAVE` | **multiple independent threads converge to one decision** ⚡ |
| `DIVERGENT WEAVE` | **single insight spreads into multiple spheres** ⚡ |

### Intersphere Weave JSON (with pattern) ⚡

```json
{
  "weave": {
    "id": "uuid",
    "pattern": "linear|radial|convergent|divergent",
    "spheres": ["business","creative","scholar"],
    "threads": ["threadA","threadB"],
    "metadata": { "created_at": "...", "author": "system" }
  }
}
```

### Weave Fields ⚡
| Field | Description |
|-------|-------------|
| `pattern` | **linear/radial/convergent/divergent** ⚡ |
| `metadata.author` | **"system"** ⚡ |

### Weave Rules ⚡
| Rule | Status |
|------|--------|
| **No cross-sphere authority** | ✅ ⚡ |
| Only factual linkage | ✅ |
| **Spheres retain independence** | ✅ ⚡ |
| **User can collapse/expand sphere clusters** | ✅ ⚡ |

---

## 3) THREAD SUPERPOSITION VIEW (2D + XR) ⚡

### Purpose
Allow users to visualize **multiple possible knowledge paths** without forcing interpretation.

### RULE
> **Superposition View = optional, neutral visualization.**

### View Modes ⚡
| Mode | Description |
|------|-------------|
| `MODE_2D_SUPERPOSITION` | overlapping thread lines, **color-coded sphere indexing**, highlight divergence points ⚡ |
| `MODE_XR_SUPERPOSITION` | floating thread arcs, **ghost nodes show potential alternative paths**, no motion overwhelm ⚡ |
| `MODE_TIMELINE_SUPERPOSITION` | time-based layering, **alignment on shared timestamps** ⚡ |

### Superposition JSON Model (with safety) ⚡

```json
{
  "superposition": {
    "threads": ["id1","id2","id3"],
    "align_on": "time|topic|sphere",
    "mode": "2d|xr|timeline",
    "safety": { "motion": "low", "opacity": 0.5 }
  }
}
```

### Superposition Fields ⚡
| Field | Description |
|-------|-------------|
| `align_on` | **time/topic/sphere** ⚡ |
| `mode` | **2d/xr/timeline** ⚡ |
| `safety.motion` | **"low"** ⚡ |
| `safety.opacity` | **0.5** ⚡ |

### Interactions ⚡
| Action | Description |
|--------|-------------|
| `isolate_thread(id)` | ⚡ |
| `fade_thread(id)` | ⚡ |
| `reveal_intersections` | ⚡ |
| `convert_to_weave` | **(manual only)** ⚡ |
| `export_superposition_pdf` | ⚡ |
| `xr_teleport_to_intersection` | ⚡ |

---

## ETHICAL CONSTRAINTS ⚡

| Constraint | Status |
|------------|--------|
| **No suggestion of "better" threads** | ✅ ⚡ |
| **No predictive ranking** | ✅ ⚡ |
| **No intent inference** | ✅ ⚡ |
| **Only factual overlays** | ✅ ⚡ |

---

**END — EXTENDED KNOWLEDGE THREAD ENGINE**
