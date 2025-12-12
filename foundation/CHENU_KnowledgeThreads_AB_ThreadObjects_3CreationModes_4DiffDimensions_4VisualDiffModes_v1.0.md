# CHE·NU — KNOWLEDGE THREAD SYSTEM (A + B)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## A) KNOWLEDGE THREADS — CORE SYSTEM ⚡

### Purpose
Link facts, artifacts, meetings, sphere content, and user learning paths into a **SINGLE, traceable knowledge fabric.**

### RULE
> **Knowledge Thread = neutral linkage of facts. NEVER inference. NEVER recommendation. NEVER emotional framing.**

### Thread Objects ⚡ (NOUVEAU!)

**THREAD_NODE (base unit):**
| Field | Description |
|-------|-------------|
| `type` | **event/artifact/decision/concept/meeting** ⚡ |
| `sphere` | personnel/business/scholar/creative/... ⚡ |
| `timestamp` | ⚡ |
| `source` | **replay_id/artifact_id/user_input** ⚡ |
| `hash` | sha256 ⚡ |

**THREAD_EDGE (connection):**
| Type | Description |
|------|-------------|
| cause → effect | **(temporal, never causal claim)** ⚡ |
| reference → target | ⚡ |
| topic-similarity | ⚡ |
| shared-participants | ⚡ |
| shared-artifact | ⚡ |

**THREAD (container):**
| Field | Description |
|-------|-------------|
| `id` | uuid ⚡ |
| `title` | optional ⚡ |
| `nodes` | THREAD_NODE[] ⚡ |
| `edges` | THREAD_EDGE[] ⚡ |
| `visibility` | **personal/team/public** ⚡ |
| `owner` | user_id ⚡ |

### 3 Thread Creation Modes ⚡ (NOUVEAU!)

| Mode | Description |
|------|-------------|
| **MODE 1 — Manual** | User selects 2+ nodes → "Create Thread", add optional name & tags ⚡ |
| **MODE 2 — Semi-Automatic** | **System highlights possible links, user approves** ⚡ |
| **MODE 3 — Sphere-Agent Assist** | Agent proposes links based on: topic matches, explicit references, shared artifacts, sequential time order. **NO semantic guessing.** ⚡ |

### Thread JSON Model ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "nodes": ["..."],
    "edges": ["..."],
    "metadata": {
      "title": "string",
      "tags": ["string"],
      "visibility": "personal|team|public"
    },
    "integrity_hash": "sha256"
  }
}
```

### Thread Visualization (2D / 3D / XR) ⚡

| Mode | Description |
|------|-------------|
| **2D** | map of nodes + straight edges, **zoom clusters per sphere** ⚡ |
| **3D** | nodes as floating anchors, edges as soft lines, **sphere-orbits for grouping** ⚡ |
| **XR** | immersive constellation, **grab-to-open-node**, timeline scrub overlay ⚡ |

### Ethical Locks ⚡
| Rule | Status |
|------|--------|
| **No inferred causality** | ✅ ⚡ |
| **No predicted outcomes** | ✅ ⚡ |
| **No emotional heatmaps** | ✅ ⚡ |
| **No "important / unimportant" ranking** | ✅ ⚡ |
| **User controls ALL visibility** | ✅ ⚡ |

---

## B) KNOWLEDGE THREAD DIFF — COLLECTIVE vs PERSONAL VIEW ⚡

### Purpose
Compare: 1) What **exists globally** (collective memory) vs. 2) What **the user has assembled** into threads.

### RULE
> **DIFF = STRUCTURAL DIFFERENCE ONLY. Not evaluation. Not correctness. Not guidance.**

### 4 Diff Dimensions ⚡ (NOUVEAU!)

| Dimension | Description |
|-----------|-------------|
| **DIM 1 — Node Presence** | collective contains nodes user didn't map, user thread contains private nodes ⚡ |
| **DIM 2 — Edges (links)** | **missing links, extra links, alternate paths** ⚡ |
| **DIM 3 — Thread Density** | how many spheres connected, how many replay references used ⚡ |
| **DIM 4 — Temporal Coverage** | **gaps in personal timeline, divergence windows** ⚡ |

### Diff Output (Neutral) ⚡

```
DIFF_REPORT:
- missing_nodes: []
- extra_nodes: []
- missing_edges: []
- extra_edges: []
- timeline_gaps: []
- sphere_coverage_diff: []
```

### Diff JSON Model ⚡

```json
{
  "thread_diff": {
    "thread_id": "uuid",
    "collective_reference": "uuid",
    "differences": {
      "missing_nodes": ["..."],
      "extra_nodes": ["..."],
      "missing_edges": ["..."],
      "extra_edges": ["..."],
      "timeline_gaps": ["..."],
      "coverage_delta": { "business": 0.2, "scholar": -0.3 }
    }
  }
}
```

### Key Field: `coverage_delta` ⚡ (NOUVEAU!)
> **Per-sphere difference score (positive = user has more, negative = collective has more)**

### 4 Visual Diff Modes ⚡ (NOUVEAU!)

| Mode | Description |
|------|-------------|
| **OVERLAY** | personal = bright, collective = dim ghost, **differences flash subtly** ⚡ |
| **SIDE-BY-SIDE** | two graphs, **matching nodes linked by dotted lines** ⚡ |
| **TIMELINE SPLIT** | collective timeline above, **personal timeline below** ⚡ |
| **XR CONSTELLATION SPLIT** | **left hemisphere = personal, right hemisphere = collective** ⚡ |

### User Control ⚡
| Action | Description |
|--------|-------------|
| hide personal nodes | ⚡ |
| hide collective nodes | ⚡ |
| export diff PDF | ⚡ |
| **add missing nodes manually** | ⚡ |
| ignore differences | ⚡ |

### Agent Roles ⚡
| Agent | Role |
|-------|------|
| `AGENT_THREAD_ANALYZER` | **produce diffs only, NO suggestions** ⚡ |
| `AGENT_MEMORY_LINKER` | can propose thread expansions, **user must confirm ALL additions** ⚡ |
| `AGENT_INTEGRITY_GUARD` | **checks no manipulative framing** ⚡ |

---

**END — A + B COMPLETE**
