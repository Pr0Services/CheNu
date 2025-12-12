# CHE·NU — KNOWLEDGE THREADS PACK (3-MODULE EDITION)
**VERSION:** CORE.KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## MODULE 1 — INTRA-SPHERE KNOWLEDGE THREADS

### Purpose
Trace continuity of information, artifacts, decisions **INSIDE a single sphere** (business, scholar, creative, etc.) without reshaping meaning.

### RULE
> **Thread = LINKAGE, not INTERPRETATION.**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `CONTENT_THREAD` | **connects documents, notes, artifacts** ⚡ |
| `DECISION_THREAD` | **links decisions made across meetings** ⚡ |
| `ACTOR_THREAD` | **traces user/agent activity within a sphere** ⚡ |
| `CONTEXT_THREAD` | **follows evolution of a topic or project** ⚡ |

### Intra-Sphere Thread JSON (with direction) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "sphere": "business|social|scholar|creative|...",
    "type": "content|decision|actor|context",
    "nodes": [
      { "ref": "artifact|event|decision_id", "timestamp": 1712345678 }
    ],
    "direction": "forward|bidirectional",
    "hash": "sha256"
  }
}
```

### Intra Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **content/decision/actor/context** ⚡ |
| `direction` | **forward/bidirectional** ⚡ |

### Visualization (2D/3D) ⚡
| Mode | Description |
|------|-------------|
| **2D** | linear chain or branching tree, **contextual halos** ⚡ |
| **3D** | floating thread nodes, **curved links = time distance** ⚡, **thickness = density of content** ⚡ |

### Safety Limits ⚡
| NO | YES |
|----|-----|
| inferred meanings | factual continuity |
| risk labels | **reversible mapping** ⚡ |
| emotional modeling | |

---

## MODULE 2 — CROSS-SPHERE KNOWLEDGE WEAVING ⚡

### Purpose
Reveal how knowledge flows **ACROSS spheres** WITHOUT merging roles or domains.

### Example
> A scholar document influences a creative brief → creates a **cross-sphere thread** NOT a merged interpretation.

### Cross-Sphere Link Types ⚡
| Type | Description |
|------|-------------|
| `REFERENCE_LINK` | **one sphere cites material from another** ⚡ |
| `IMPACT_LINK` | **decision in sphere A triggers activity in sphere B** ⚡ |
| `SEQUENCE_LINK` | **chronological dependency** ⚡ |
| `COLLAB_LINK` | **multi-sphere participants working on same artifact** ⚡ |

### Knowledge Weave JSON (with weight + metadata) ⚡

```json
{
  "knowledge_weave": {
    "id": "uuid",
    "spheres": ["scholar","creative"],
    "links": [
      {
        "from": "node_id_A",
        "to": "node_id_B",
        "reason": "reference|impact|sequence|collab",
        "weight": 0.42,
        "timestamp": 1712345678
      }
    ],
    "metadata": { "integrity_check": true }
  }
}
```

### Weave Fields ⚡
| Field | Description |
|-------|-------------|
| `links[].reason` | **reference/impact/sequence/collab** ⚡ |
| `links[].weight` | **0.0-1.0** ⚡ |
| `metadata.integrity_check` | **true** ⚡ |

### Weave Visualization (Universe View) ⚡
| Property | Value |
|----------|-------|
| **color-coded sphere links** | ⚡ |
| **thickness = link strength** | ⚡ |
| **fade = low frequency** | ⚡ |
| **no directional arrows (avoids causal inference)** | ⚡ |

### Routing Behavior (Safe) ⚡
**If a weave exists:**
- **soft highlight only** ⚡
- **optional "expand weave" button** ⚡
- **user decides whether to navigate** ⚡

---

## MODULE 3 — TEMPORAL KNOWLEDGE THREADS

### Purpose
Display **EVOLUTION** of ideas, artifacts, and projects over time without forcing conclusions.

### RULE
> **Timeline ≠ Story. Timeline = ordered facts.**

### Temporal Thread Types ⚡
| Type | Description |
|------|-------------|
| `GROWTH_THREAD` | **project scaling over time** ⚡ |
| `REVISION_THREAD` | **document versions and changes** ⚡ |
| `DISCUSSION_THREAD` | **sequence of meetings around same topic** ⚡ |
| `MOMENTUM_THREAD` | **density of activity over intervals** ⚡ |

### Temporal Thread JSON (with timeline_span) ⚡

```json
{
  "temporal_thread": {
    "id": "uuid",
    "topic": "string",
    "events": [
      { "ref": "uuid", "timestamp": 1712345678, "kind": "meeting|artifact|decision" }
    ],
    "timeline_span": { "start": "...", "end": "..." }
  }
}
```

### Temporal Fields ⚡
| Field | Description |
|-------|-------------|
| `events[].kind` | **meeting/artifact/decision** ⚡ |
| `timeline_span` | **{start, end}** ⚡ |

### Temporal Visualization ⚡

| Mode | Description |
|------|-------------|
| **Timeline (2D)** | horizontal bar, **nodes sized by relevance** ⚡, **translucent intervals for silence** ⚡ |
| **XR Timeline (3D)** | **curved temporal arc** ⚡, **nodes float with mild depth offset** ⚡, **scrubbing controlled by user only** ⚡ |

### Temporal Safety Limits ⚡
| Limit | Status |
|-------|--------|
| **NO predictive modeling** | ✅ ⚡ |
| **NO inferred trends** | ✅ ⚡ |
| **NO "expected outcomes"** | ✅ ⚡ |
| **Past only, not future** | ✅ ⚡ |

---

## INTEGRATION OF ALL 3 MODULES ⚡

### Unified Threads Engine ⚡
| Property | Value |
|----------|-------|
| **merges none** | ⚡ |
| **preserves integrity** | ⚡ |
| **indexes by sphere, user, topic, and time** | ⚡ |
| **100% reversible links** | ⚡ |
| **no deletion, only appending** | ⚡ |

### Exports ⚡
| Export | Format |
|--------|--------|
| **PDF Thread Atlas** | ⚡ |
| **JSON bundle** | `kt_bundle` ⚡ |
| **XR Thread Weave** | ⚡ |

---

**END — THREAD PACK FREEZE**
