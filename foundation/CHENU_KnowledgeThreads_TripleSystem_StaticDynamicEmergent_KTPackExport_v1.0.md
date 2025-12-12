# CHE·NU — KNOWLEDGE THREADS (TRIPLE SYSTEM)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / UNIVERSAL

---

## OVERVIEW

> **Knowledge Threads = structural links between information units** across spheres, meetings, replays, agents, and memory.

### RULE
> **Thread = CONNECTION OF FACTS. Not interpretation. Not recommendation.**

### 3 SYSTEMS ⚡
| System | Name |
|--------|------|
| **1** | STATIC KNOWLEDGE THREADS (STRUCTURAL) ⚡ |
| **2** | DYNAMIC KNOWLEDGE THREADS (TEMPORAL) ⚡ |
| **3** | EMERGENT KNOWLEDGE THREADS (CROSS-SPHERE CONTEXT) ⚡ |

---

## 1) STATIC KNOWLEDGE THREADS ⚡

### Purpose
Define **permanent relationships** between concepts, documents, domains, and artifacts.

### Examples ⚡
| Example | Description |
|---------|-------------|
| "This decision relates to this policy" | ⚡ |
| "This note links to this project" | ⚡ |
| "This replay references this artifact" | ⚡ |

### RULE
> **Static Threads = HARD LINKS (immutable)**

### Static Thread Types ⚡
| Type | Description |
|------|-------------|
| `STATIC_CONCEPT_LINK` | ⚡ |
| `STATIC_DOCUMENT_LINK` | ⚡ |
| `STATIC_DOMAIN_LINK` | ⚡ |
| `STATIC_DEPENDENCY_LINK` | ⚡ |

### Static Thread JSON ⚡

```json
{
  "static_thread": {
    "id": "uuid",
    "from": "entity_id",
    "to": "entity_id",
    "type": "concept|document|domain|dependency",
    "created_at": "...",
    "hash": "sha256"
  }
}
```

### Properties ⚡
| Property | Status |
|----------|--------|
| **append-only** | ✅ ⚡ |
| **validated** | ✅ ⚡ |
| **cryptographically hashable** | ✅ ⚡ |
| **sphere-agnostic** | ✅ ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **causal inference** | ❌ ⚡ |
| **sentiment tagging** | ❌ ⚡ |
| **prioritization** | ❌ ⚡ |

---

## 2) DYNAMIC KNOWLEDGE THREADS (TEMPORAL) ⚡

### Purpose
Capture **evolving relationships across time.**

### Examples ⚡
| Example | Description |
|---------|-------------|
| **Topic recurring across multiple meetings** | ⚡ |
| **Agent returning to same thread over days** | ⚡ |
| **Gradual refinement of a document** | ⚡ |
| **Timeline continuity (before/after)** | ⚡ |

### RULE
> **Dynamic Threads = TIME-LAYERED, NOT OPINIONATED**

### Dynamic Thread Types ⚡
| Type | Description |
|------|-------------|
| `TEMPORAL_REOCCURRENCE` | ⚡ |
| `TEMPORAL_DEPENDENCY` | ⚡ |
| `TEMPORAL_CONTRAST` | ⚡ |
| `TEMPORAL_ACCUMULATION` | ⚡ |

### Dynamic Thread JSON ⚡

```json
{
  "dynamic_thread": {
    "id": "uuid",
    "source_sequence": ["replay_id_1", "replay_id_2"],
    "topic": "string",
    "timeline": [
      { "t": 17123456, "ref": "entity_id" }
    ],
    "pattern": "reoccur|contrast|accumulate",
    "confidence": "0.0-1.0",
    "read_only": true
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **no predictive modeling** | ✅ ⚡ |
| **no trend claims** | ✅ ⚡ |
| **purely descriptive** | ✅ ⚡ |
| **user controls visibility** | ✅ ⚡ |

### Visualization ⚡
| Feature | Description |
|---------|-------------|
| **braided timelines** | ⚡ |
| **pulse markers** | ⚡ |
| **temporal heatmaps** | ⚡ |

---

## 3) EMERGENT KNOWLEDGE THREADS (CROSS-SPHERE CONTEXT) ⚡

### Purpose
Reveal **non-obvious but factual connections** between spheres (Business ↔ Scholar ↔ XR ↔ Creative).

### NOT ALLOWED ⚡
| Forbidden | Status |
|-----------|--------|
| **inference** | ❌ ⚡ |
| **assumption** | ❌ ⚡ |
| **emotional logic** | ❌ ⚡ |
| **"you should do X"** | ❌ ⚡ |

### Allowed ⚡
| Allowed | Status |
|---------|--------|
| **factual relational mapping** | ✅ ⚡ |
| **cross-sphere artifact connection** | ✅ ⚡ |
| **meeting → document → sphere** | ✅ ⚡ |
| **collective memory → replay → topic linkage** | ✅ ⚡ |

### Emergent Thread Types ⚡
| Type | Description |
|------|-------------|
| `EMERGENT_TOPIC_THREAD` | ⚡ |
| `EMERGENT_ARTIFACT_THREAD` | ⚡ |
| `EMERGENT_DECISION_THREAD` | ⚡ |
| `EMERGENT_SPHERE_THREAD` | ⚡ |

### Emergent Thread JSON ⚡

```json
{
  "emergent_thread": {
    "id": "uuid",
    "anchors": ["entity_a", "entity_b"],
    "spheres": ["business", "scholar", "creative"],
    "evidence": [
      { "type": "artifact", "ref": "doc123" },
      { "type": "replay", "ref": "rp456" }
    ],
    "computed_at": "...",
    "transparency_note": "system only identifies factual overlaps"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **transparency required for every connection** | ✅ ⚡ |
| **no hidden logic** | ✅ ⚡ |
| **no influence on user's decisions** | ✅ ⚡ |

---

## KNOWLEDGE THREAD ENGINE (UNIFIED) ⚡

### Thread Engine Functions ⚡
| Function | Description |
|----------|-------------|
| `create_static_thread(from,to,type)` | ⚡ |
| `detect_dynamic_patterns(replays,artifacts)` | ⚡ |
| `compute_emergent_links(across spheres)` | ⚡ |
| `render_thread_map` | ⚡ |
| `export_thread_bundle` | ⚡ |

### NEVER ⚡
| Forbidden | Status |
|-----------|--------|
| **generate advice** | ❌ ⚡ |
| **propose actions** | ❌ ⚡ |
| **rank priorities** | ❌ ⚡ |
| **assume causality** | ❌ ⚡ |

---

## KNOWLEDGE THREAD BUNDLE EXPORT ⚡ (NOUVEAU!)

### Format: `.ktpack` ⚡

```json
{
  "version": "1.0",
  "threads": {
    "static": ["..."],
    "dynamic": ["..."],
    "emergent": ["..."]
  },
  "integrity": "sha256"
}
```

---

## VISUALIZATION RULES ⚡

| Type | Visual | Description |
|------|--------|-------------|
| **STATIC** | solid lines | thin, steady, permanent ⚡ |
| **DYNAMIC** | braided lines | time markers, soft pulsing ⚡ |
| **EMERGENT** | dotted/fractal lines | cross-sphere color codes, **hover-activated evidence panel** ⚡ |

---

## AGENT INTEGRATION ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_COLLECTOR` | **gathers links, never interprets** ⚡ |
| `AGENT_THREAD_RENDERER` | **visual maps only** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **explains evidence upon request, deterministic, no inference** ⚡ |
| `AGENT_THREAD_GUARD` | **ensures no manipulation or prioritization** ⚡ |

---

**END — FREEZE READY**
