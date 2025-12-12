# CHE·NU — KNOWLEDGE THREADS (PART II)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / SYNTHESIS-READY

---

## 4) CROSS-SPHERE SYNTHESIS ENGINE ⚡

### Purpose
Unify knowledge threads coming from different spheres **without blending identities or contexts.**

### RULE
> **Synthesis = CONTEXT-PRESERVING. Never merges meaning. Never generates conclusions. Only reveals STRUCTURES.**

### Synthesis Inputs ⚡
| Input | Description |
|-------|-------------|
| `sphere_nodes` | business, scholar, creative, etc. |
| `memory_events` | ⚡ |
| `artifacts` | ⚡ |
| `XR replay fragments` | ⚡ |
| `decision pointers` | ⚡ |
| `thread metadata` | ⚡ |

### Synthesis Operations ⚡

**OP 1 — ALIGNMENT**
Aligns threads by: topic, time, participants, **artifact lineage** ⚡

**OP 2 — OVERLAY**
Builds a super-thread showing:
| Element | Description |
|---------|-------------|
| **shared anchors** | ⚡ |
| **divergent branches** | ⚡ |
| **silence zones** | ⚡ |

**OP 3 — CROSS-REFERENCE**
| Link | Description |
|------|-------------|
| scholar research ↔ business decisions | ⚡ |
| creative sketches ↔ social reactions | ⚡ |
| institution rules ↔ workflows | ⚡ |
| **XR insights ↔ collective memory nodes** | ⚡ |

### Synthesis JSON Model ⚡

```json
{
  "synthesis": {
    "threads": ["thread_id"],
    "alignment_key": "topic|time|artifact",
    "overlays": [
      { "thread": "id", "anchor": "uuid", "type": "shared|divergent|unknown" }
    ],
    "readonly": true,
    "hash": "sha256"
  }
}
```

### Synthesis Fields ⚡
| Field | Description |
|-------|-------------|
| `alignment_key` | **topic/time/artifact** ⚡ |
| `overlays[].type` | **shared/divergent/unknown** ⚡ |
| `readonly` | **true always** ⚡ |

### Constraints ⚡
| Constraint | Status |
|------------|--------|
| **no blending of meaning** | ✅ ⚡ |
| **no predictive modeling** | ✅ ⚡ |
| **no weighting** | ✅ ⚡ |
| **no implied hierarchy** | ✅ ⚡ |

---

## 5) TIMELINE KNOWLEDGE MAPPING ⚡

### Purpose
Reveal **HOW knowledge evolved over time** without implying whether changes were good or bad.

### RULE
> **Timeline = SEQUENCE, not judgement.**

### Timeline Layers ⚡

| Layer | Description |
|-------|-------------|
| **LAYER 1 — KNOWLEDGE ACCUMULATION** | Each artifact/thread creates a new point ⚡ |
| **LAYER 2 — KNOWLEDGE MUTATION** | When content changes → **mutation nodes appear** ⚡ |
| **LAYER 3 — KNOWLEDGE SILENCE** | Periods of no activity → **clarity bars** ⚡ |
| **LAYER 4 — KNOWLEDGE DRIFT** | Context drift indicated by: topic shift, sphere migration, participant changes ⚡ |

### Timeline Modes ⚡

| Mode | Description |
|------|-------------|
| **LINEAR** | Chronological straight view ⚡ |
| **BRAIDED** | **Interwoven threads across spheres** ⚡ |
| **CONSTELLATION** | **Star-map pattern for synthesis mode** ⚡ |

### Timeline JSON Model ⚡

```json
{
  "knowledge_timeline": {
    "events": [
      {
        "id": "uuid",
        "type": "add|modify|refer|drift|silence",
        "timestamp": 1712345678,
        "sphere": "business",
        "thread": "thread_id",
        "metadata": {}
      }
    ]
  }
}
```

### Timeline Fields ⚡
| Field | Description |
|-------|-------------|
| `events[].type` | **add/modify/refer/drift/silence** ⚡ |

### Export ⚡
| Format | Description |
|--------|-------------|
| **PDF braided timeline** | ⚡ |
| **XR star-map timeline** | ⚡ |
| **SVG knowledge matrix** | ⚡ |

---

## 6) AGENT-ASSISTED KNOWLEDGE HARVESTING ⚡

### Purpose
Allow agents to extract *knowledge primitives* from content **WITHOUT interpretation, opinion, or inference.**

### RULE
> **Harvest = STRUCTURE ONLY.**

### Harvestable Elements ⚡
| Element | Description |
|---------|-------------|
| `entities` | names of concepts ⚡ |
| `references` | citations, links ⚡ |
| `transformations` | when something changed ⚡ |
| `associations` | X mentions Y ⚡ |
| `anchors` | **timestamps + sphere context** ⚡ |

### Agent Knowledge Roles ⚡

| Agent | Role |
|-------|------|
| `AGENT_HARVESTER` | **Extracts raw elements. No summarization.** ⚡ |
| `AGENT_THREAD_BUILDER` | **Organizes harvested elements into threads** ⚡ |
| `AGENT_INTEGRITY_GUARD` | **Ensures: no implied meaning, no "reasoning", no predictions, no persuasion** ⚡ |
| `AGENT_XR_HARVESTER` | **Extracts: spatial anchors, gesture artifacts, co-presence markers** ⚡ |

### Harvest JSON Model ⚡

```json
{
  "knowledge_harvest": {
    "source": "artifact|meeting|replay",
    "elements": [
      { "type": "entity", "value": "string" },
      { "type": "reference", "value": "url" },
      { "type": "association", "a": "entity", "b": "entity" }
    ],
    "thread_links": ["thread_id"],
    "hash": "sha256"
  }
}
```

### Harvest Fields ⚡
| Field | Description |
|-------|-------------|
| `source` | **artifact/meeting/replay** ⚡ |
| `elements[].type` | **entity/reference/association** ⚡ |

### Harvest Workflow ⚡

| Step | Description |
|------|-------------|
| 1 | User selects content |
| 2 | **Harvester extracts primitives** ⚡ |
| 3 | **Thread Builder connects nodes** ⚡ |
| 4 | **Integrity Guard validates** ⚡ |
| 5 | **Timeline Mapper positions them** ⚡ |
| 6 | **Universe View renders them as threads** ⚡ |

---

## WHY THESE THREE MODULES ⚡

| Module | Purpose |
|--------|---------|
| **SYNTHESIS** | → reveals structure ⚡ |
| **TIMELINE** | → reveals evolution ⚡ |
| **HARVESTING** | → reveals raw building blocks ⚡ |

### Together ⚡
> **Knowledge transparency WITHOUT interpretation, bias, or persuasive direction.**

---

**END — KNOWLEDGE THREADS (PART II)**
