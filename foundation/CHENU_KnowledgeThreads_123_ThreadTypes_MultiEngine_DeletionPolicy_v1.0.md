# CHE·NU — KNOWLEDGE THREADS (1–3)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / GRAPH-BASED

---

## OVERVIEW

> **Knowledge Threads = neutral connections** between facts, artifacts, decisions, meetings, and content.

### RULE
> **Threads show RELATIONSHIPS, not interpretations, not weights, not recommendations.**

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Connect all knowledge nodes **INSIDE a given sphere** (Business, Scholar, Creative, etc.) to show structure and evolution.

### Node Types (within one sphere) ⚡
| Type | Description |
|------|-------------|
| `content_item` | doc, file, note, **replay snapshot** ⚡ |
| `decision` | meeting output ⚡ |
| `task` | agent or user ⚡ |
| `artifact` | visual, board, schema ⚡ |
| `replay_segment` | **timestamped fact** ⚡ |

### Allowed Thread Types ⚡
| Thread | Description |
|--------|-------------|
| `references` | ⚡ |
| `derived_from` | ⚡ |
| `updates` | ⚡ |
| `supersedes` | ⚡ |
| `contradicts` | **(FACT ↔ FACT only)** ⚡ |
| `belongs_to` | ⚡ |
| `co-occurs_with` | ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **inferred causality** | ❌ ⚡ |
| **emotional links** | ❌ ⚡ |
| **impact scoring** | ❌ ⚡ |

### Intra-Sphere JSON Model ⚡

```json
{
  "intra_threads": [
    {
      "id": "uuid",
      "sphere": "business|scholar|creative|...",
      "from": "nodeA",
      "to": "nodeB",
      "type": "references|derived_from|updates|...",
      "timestamp": 1712345678,
      "hash": "sha256"
    }
  ]
}
```

### Rendering Rules ⚡
| Rule | Description |
|------|-------------|
| grouped by topic cluster | ✅ |
| **distance = structural (not importance)** | ⚡ |
| color = node type | ✅ |
| **thickness = thread count (not confidence)** | ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Highlight connections between *different* spheres **WITHOUT enforcing hierarchy or cross-domain bias.**

### Example ⚡
> A Creative mockup linked to a Business proposal, or a Scholar note linked to a Social analysis.

### Valid Inter-Sphere Thread Types ⚡
| Thread | Description |
|--------|-------------|
| `informs` | ⚡ |
| `reused_in` | ⚡ |
| `shared_artifact` | ⚡ |
| `parallel_development` | ⚡ |
| `historical_link` | ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **implies_best_practice** | ❌ ⚡ |
| **directional authority** | ❌ ⚡ |
| **cross-sphere dominance** | ❌ ⚡ |

### Inter-Sphere JSON Model ⚡

```json
{
  "inter_threads": [
    {
      "id": "uuid",
      "from_sphere": "business",
      "to_sphere": "creative",
      "from_node": "uuid",
      "to_node": "uuid",
      "type": "informs|shared_artifact|parallel_development",
      "timestamp": "...",
      "hash": "..."
    }
  ]
}
```

### Visualization Rules ⚡
| Rule | Status |
|------|--------|
| **orbit linking in Universe View** | ⚡ |
| **thread appears only on demand** | ⚡ |
| **user-controlled visibility** | ⚡ |
| **no automatic surfacing of emotional or subjective content** | ⚡ |

---

## 3) TEMPORAL KNOWLEDGE THREADS ⚡

### Purpose
Connect information **ACROSS TIME**, revealing evolution **WITHOUT narrative shaping.**

### Temporal Thread Types ⚡
| Thread | Description |
|--------|-------------|
| `earlier_version` | ⚡ |
| `future_reference` | **(declared, not predicted)** ⚡ |
| `timeline_alignment` | ⚡ |
| `historical_context` | ⚡ |
| `problem_resolution_path` | ⚡ |

### Temporal JSON Model ⚡

```json
{
  "temporal_threads": [
    {
      "id": "uuid",
      "from": "nodeA",
      "to": "nodeB",
      "time_relation": "earlier|later|context",
      "t_from": 1712345600,
      "t_to": 1712351000,
      "hash": "sha256"
    }
  ]
}
```

### Temporal Fields ⚡
| Field | Description |
|-------|-------------|
| `time_relation` | **earlier/later/context** ⚡ |
| `t_from` / `t_to` | **Unix timestamps** ⚡ |

### Temporal Display Logic ⚡
| Rule | Status |
|------|--------|
| **chronological braid lines** | ⚡ |
| **no forecasting** | ✅ ⚡ |
| **no predictions** | ✅ ⚡ |
| **no weighting of importance** | ✅ ⚡ |

---

## MULTI-THREAD ENGINE RULES (for all 3) ⚡

### THREAD_CREATION ⚡
| Method | Description |
|--------|-------------|
| **explicit user action** | OR ⚡ |
| **system trace from replay (fact-level only)** | ⚡ |

### THREAD_VALIDATION ⚡
| Rule | Status |
|------|--------|
| **hash lock** | ✅ ⚡ |
| **immutable after 24h freeze** | ✅ ⚡ |
| **visible audit log** | ✅ ⚡ |

### THREAD_DELETION ⚡ (NOUVEAU!)
| Rule | Status |
|------|--------|
| **allowed only by original creator** | ✅ ⚡ |
| **deletion is versioned, not destructive** | ✅ ⚡ |

---

## AGENT INTEGRATION ⚡

| Agent | Role |
|-------|------|
| `AGENT_KT_BUILDER` | **constructs threads based on valid rules, never infers meaning** ⚡ |
| `AGENT_KT_EXPLAINER` | **provides user-readable explanations, shows *why* a thread exists** ⚡ |
| `AGENT_KT_GUARD` | **prevents non-permitted thread types, blocks emotional or persuasive links** ⚡ |

---

## WHY THIS MATTERS ⚡

### Knowledge Threads = ⚡
- factual
- verifiable
- transparent
- cross-domain
- **time-aware** ⚡

> **BUT NEVER manipulative.**

> **This forms the backbone of Che-Nu collective intelligence WITHOUT bias.**

---

**END — FREEZE READY**
