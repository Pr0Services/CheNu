# CHE·NU — KNOWLEDGE THREADS (x3)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## PURPOSE OF KNOWLEDGE THREADS

> Connect information, meetings, artifacts, decisions, and spheres **WITHOUT rewriting truth, inferring intent, or generating narratives.**

> **Threads = STRUCTURED LINKING. NOT storytelling, NOT interpretation.**

### Three Systems
1) THREADS OF FACT
2) THREADS OF CONTEXT
3) THREADS OF EVOLUTION **(non-psychological)** ⚡

---

## 1) KNOWLEDGE THREAD — FACT THREADS

### Definition
A chain of verifiable, timestamped elements linking events, artifacts, and decisions.

> **FACT THREAD = "This happened → then this → connected to this"**

### Allowed ⚡
- chronological linking
- shared artifacts
- shared participants
- **replay citations** ⚡
- **immutable versioning** ⚡

### Forbidden ⚡
- inferred intent
- emotional weight
- predictive labels

### Fact Thread JSON (with source_replay + integrity) ⚡

```json
{
  "fact_thread": {
    "id": "uuid",
    "origin": "replay|artifact|decision",
    "nodes": [
      {
        "id":"uuid",
        "type":"event|artifact|decision",
        "timestamp":1712345678,
        "source_replay":"uuid",
        "hash":"sha256"
      }
    ],
    "integrity":"verified"
  }
}
```

### Fact Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `origin` | **replay/artifact/decision** ⚡ |
| `nodes[].source_replay` | **UUID reference** ⚡ |
| `integrity` | **"verified"** ⚡ |

### Thread Operators ⚡
| Operator | Description |
|----------|-------------|
| `append_fact(node)` | Add node |
| `fork_thread()` | **Create fork** ⚡ |
| `merge_if_identical_source()` | **Conditional merge** ⚡ |
| `export_pdf()` | Export |

---

## 2) KNOWLEDGE THREAD — CONTEXT THREADS

### Definition
Non-narrative mapping of how topics, spheres, agents, and meetings relate across **TIME and DOMAINS.**

> **CONTEXT THREAD = "Where does this topic live in the universe?"**

### Allowed Links ⚡
- shared topic
- shared sphere
- shared data type
- **shared objective** ⚡
- **temporal adjacency** ⚡

### Context Thread JSON (with timeline_points) ⚡

```json
{
  "context_thread": {
    "topic": "string",
    "sphere_links": ["business","scholar","creative",...],
    "meetings": ["uuid"],
    "agents": ["agent_id"],
    "artifacts": ["artifact_id"],
    "timeline_points": [...],
    "version": 1
  }
}
```

### Context Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `topic` | **String topic name** ⚡ |
| `sphere_links` | **Array of spheres** ⚡ |
| `timeline_points` | **Array of temporal points** ⚡ |

### Visualization ⚡
| Element | Description |
|---------|-------------|
| **orbit clusters** | ⚡ |
| **topic rays** | ⚡ |
| **adjacency glows** | (no semantic weighting) ⚡ |

### Functions ⚡
| Function | Description |
|----------|-------------|
| `generate_context_map(topic)` | ⚡ |
| `update_with_new_meeting()` | ⚡ |
| `XR reveal mode` | **(faded, non-dominant)** ⚡ |

---

## 3) KNOWLEDGE THREAD — EVOLUTION THREADS

### Definition
Track the **EVOLUTION of information structures** (not people, not psychology) across time and usage.

> **Evolution Thread = "How has THIS piece of knowledge changed?"**

### Tracked ⚡
| Element | Status |
|---------|--------|
| edits | ✅ |
| merges | ✅ |
| **forks** | ⚡ |
| **sphere migrations** | ⚡ |
| **artifact upgrades** | ⚡ |
| **decision reinterpretation** | **BLOCKED (not allowed)** ⚡ |

### Evolution Thread JSON (with immutability_check) ⚡

```json
{
  "evolution_thread": {
    "object_id":"uuid",
    "versions":[
      {
        "version":1,
        "timestamp":...,
        "changes":[...],
        "hash":"sha256"
      }
    ],
    "immutability_check":true
  }
}
```

### Evolution Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `versions[].changes` | **Array of changes** ⚡ |
| `immutability_check` | **true** ⚡ |

### Allowed ⚡
- structural diffs
- dependency updates
- **content correction WITH replay citation** ⚡

### Not Allowed ⚡
- speculative evolution
- emotional tagging

---

## CROSS-THREAD RULES ⚡

### Rule 1 — Immutable Anchoring ⚡
> Every thread node MUST reference: **replay_id OR artifact_id OR timestamp**

### Rule 2 — No Narrative Generation ⚡
> Threads never say "why." They show **"what, where, when."**

### Rule 3 — Multi-Layer Rendering ⚡
| Thread Type | Layer |
|-------------|-------|
| FACT THREADS | **spine** ⚡ |
| CONTEXT THREADS | **orbits** ⚡ |
| EVOLUTION THREADS | **timeline** ⚡ |

### Rule 4 — XR Fusion Mode ⚡
| Display | Element |
|---------|---------|
| **fact spine** | central beam ⚡ |
| **context** | surrounding arcs ⚡ |
| **evolution** | vertical cuts ⚡ |

### Rule 5 — Security ⚡
**Threads NEVER expose:**
- personal emotional content
- private decisions
- unauthorized meetings

---

## THREAD ENGINE (COMPACT LOGIC) ⚡

```javascript
THREAD_ENGINE = {
  create_fact_thread(replay) → fact_thread,
  extend_fact_thread(thread, event) → updated,
  create_context_thread(topic) → ctx_thread,
  evolve_object(object) → evo_thread,
  sync_universe_view(threads[]) → orbit_clusters,
  export(thread_id, format="pdf|xr_bundle") → file
}
```

### Engine Functions ⚡
| Function | Return |
|----------|--------|
| `create_fact_thread(replay)` | fact_thread |
| `extend_fact_thread(thread, event)` | updated |
| `create_context_thread(topic)` | ctx_thread |
| `evolve_object(object)` | evo_thread |
| `sync_universe_view(threads[])` | **orbit_clusters** ⚡ |
| `export(thread_id, format)` | **pdf\|xr_bundle** ⚡ |

---

## WHY KNOWLEDGE THREADS MATTER

- No hallucination
- No narrative drift
- Pure structural linkage
- **Traceable to source**

---

**END — KNOWLEDGE THREADS x3**
