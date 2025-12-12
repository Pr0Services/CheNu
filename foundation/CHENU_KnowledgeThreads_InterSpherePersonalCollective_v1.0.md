# CHE·NU — KNOWLEDGE THREADS SYSTEM (INTER-SPHERE/PERSONAL/COLLECTIVE)
**MODE:** FOUNDATION + MULTI-LAYER MEMORY + NON-MANIPULATIVE

---

## PURPOSE

Knowledge Threads connect:
1. ideas
2. artifacts
3. decisions
4. events

> **across time, across spheres, and across meetings WITHOUT generating bias, persuasion, or artificial conclusions.**

### RULE
> **Threads = CONNECTIVITY, not interpretation.**

---

## THREAD TYPE 1 — INTER-SPHERE KNOWLEDGE THREADS

### Description
Links knowledge across **Business → Scholar → Creative → Institutions → XR → Social.**

### Use Cases ⚡
- show when a concept travels across domains
- detect where a decision originated
- trace how information impacts multiple spheres

### Node Types ⚡
| Type | Description |
|------|-------------|
| meeting | Meeting node |
| replay | Replay node |
| artifact | Artifact node |
| decision | Decision node |
| **agent contribution** | ⚡ |
| **sphere context** | ⚡ |

### Edge Types ⚡
| Type | Description |
|------|-------------|
| `informs` | Information flow ⚡ |
| `derived_from` | Derivation ⚡ |
| `referenced_in` | Reference ⚡ |
| `connected_by_topic` | Topic connection ⚡ |
| `sequential_dependency` | Sequential dependency ⚡ |

### Inter-Sphere Thread JSON ⚡

```json
{
  "thread_inter_sphere": {
    "id": "uuid",
    "topic": "string",
    "spheres": ["business","scholar","creative"],
    "nodes": ["node_id_1","node_id_2","..."],
    "edges": [
      { "from":"node1", "to":"node2", "type":"informs" }
    ],
    "hash": "sha256"
  }
}
```

### Inter-Sphere Fields ⚡
| Field | Description |
|-------|-------------|
| `topic` | **String topic** ⚡ |
| `spheres` | **Array of spheres** ⚡ |
| `edges[].type` | **informs/derived_from/referenced_in/...** ⚡ |

### Restrictions ⚡
| Restriction | Status |
|-------------|--------|
| no inference of causality | ✅ |
| no prediction | ✅ |
| no value judgment | ✅ |

---

## THREAD TYPE 2 — PERSONAL KNOWLEDGE THREADS ⚡

### Description
**User-specific memory structure** revealing how THEIR OWN ideas evolve.

### Use Cases ⚡
- personal learning trace
- personal project memory
- link between personal decisions across time
- **show where the user left off** ⚡

### Node Types ⚡
| Type | Description |
|------|-------------|
| **personal notes** | ⚡ |
| **personal tasks** | ⚡ |
| meetings user participated in | ✅ |
| replays involving user | ✅ |
| **saved artifacts** | ⚡ |

### Personal Thread JSON ⚡

```json
{
  "thread_personal": {
    "id": "uuid",
    "user_id": "uuid",
    "entries": [
      { "type":"note", "ref":"note_id" },
      { "type":"meeting", "ref":"meeting_id" }
    ],
    "temporal_order": true,
    "hash": "sha256"
  }
}
```

### Personal Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `user_id` | **UUID owner** ⚡ |
| `entries` | **Array of {type, ref}** ⚡ |
| `temporal_order` | **Boolean - true** ⚡ |

### Rules CRITIQUES ⚡
| Rule | Status |
|------|--------|
| **visible ONLY to the user** | ✅ ⚡ |
| **can be anonymized for export** | ✅ ⚡ |
| **NEVER influences other users** | ✅ ⚡ |

---

## THREAD TYPE 3 — COLLECTIVE KNOWLEDGE THREADS ⚡

### Description
A **neutral, verifiable chain of knowledge** built from validated replays.

### Use Cases ⚡
- detect topic evolution across the whole organization
- trace origin of shared decisions
- **observe divergence between teams** ⚡

### Node Types ⚡
| Type | Description |
|------|-------------|
| **validated replay events** | ⚡ |
| **validated artifacts** | ⚡ |
| **sphere-level outcomes** | ⚡ |
| **cross-team meetings** | ⚡ |

### Collective Thread JSON ⚡

```json
{
  "thread_collective": {
    "id": "uuid",
    "topic": "string",
    "contributors": ["user","team","agent"],
    "nodes": ["replay_event","artifact","decision"],
    "lineage": [
      { "origin": "nodeA", "derived": "nodeB" }
    ],
    "integrity": "verified",
    "hash": "sha256"
  }
}
```

### Collective Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `contributors` | **["user","team","agent"]** ⚡ |
| `lineage` | **Array of {origin, derived}** ⚡ |
| `integrity` | **"verified"** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| append-only | ✅ |
| **cryptographically locked** | ✅ ⚡ |
| no value scoring | ✅ |
| **purely structural** | ✅ ⚡ |

---

## VISUALIZATION RULESET (ALL THREADS)

### Thread View Modes ⚡
| Mode | Description |
|------|-------------|
| linear | timeline |
| **radial** | topic wheel ⚡ |
| **dendritic** | branch tree ⚡ |
| **orbit** | universe mode integration ⚡ |

### Color Rules ⚡
| Thread Type | Color |
|-------------|-------|
| **personal threads** | **user accent color** ⚡ |
| inter-sphere | sphere-coded |
| **collective** | **neutral blue/white** ⚡ |

### Interaction ⚡
| Action | Available |
|--------|-----------|
| zoom | ✅ |
| expand node | ✅ |
| trace path | ✅ |
| **export graph JSON** | ✅ ⚡ |
| **compare threads** | ✅ ⚡ |

---

## THREAD COMPARISON MODE ⚡

### Allowed ⚡
| Comparison | Status |
|------------|--------|
| compare lineage | ✅ |
| compare sphere coverage | ✅ |
| **compare density of nodes** | ✅ ⚡ |
| **compare temporal evolution** | ✅ ⚡ |

### Forbidden ⚡
| Action | Status |
|--------|--------|
| **ranking threads** | ❌ |
| **labeling as strong/weak** | ❌ |
| **inferring success** | ❌ |

---

## UNIFIED KNOWLEDGE THREAD JSON BUNDLE ⚡

```json
{
  "knowledge_threads": {
    "inter_sphere": [...],
    "personal": [...],
    "collective": [...]
  },
  "version": "1.0",
  "hash": "sha256",
  "timestamp": 1712345678
}
```

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | assembles threads, **no interpretation** |
| `AGENT_THREAD_VALIDATOR` | checks structure, **ensures no emotional metadata** ⚡ |
| `AGENT_THREAD_EXPLAINER` | translates to human-readable |
| `AGENT_THREAD_GUARD` | enforces ethical constraints, **prevents inference or nudging** ⚡ |

---

**END — THREAD SYSTEM FREEZE**
