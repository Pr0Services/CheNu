# CHE·NU — KNOWLEDGE THREADS (3-LAYER SYSTEM)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## PURPOSE

Create a non-manipulative, structured way to **CONNECT information** across meetings, spheres, replays, and agents. Threads reveal *relationships* — never interpretations.

### RULE
> **Threads DO NOT create meaning. Threads SHOW structure.**

---

## LAYER 1 — INTER-SPHERE KNOWLEDGE THREADS ⚡

### Definition
Threads connecting information between **DIFFERENT spheres** (Business ↔ Scholar ↔ Creative ↔ Institution ↔ XR …).

### Use-Cases ⚡
- cross-domain research
- linking decisions across spheres
- **structural mapping of multi-domain tasks** ⚡

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `topic_link` | ⚡ |
| `artifact_link` | ⚡ |
| `decision_dependency` | ⚡ |
| `temporal_chain` | ⚡ |
| `agent_participation_link` | ⚡ |

### Example ⚡
> Business decision ↔ Scholar research ↔ Creative prototype ↔ XR meeting replay

### Inter JSON Model ⚡

```json
{
  "thread_inter": {
    "id": "uuid",
    "spheres": ["business", "scholar"],
    "origin": "replay_id",
    "nodes": ["memory_id_1", "memory_id_2", "..."],
    "type": "topic|artifact|dependency|agent",
    "hash": "sha256"
  }
}
```

### Inter Rules ⚡
- immutable
- no ranking of threads
- no meaning assignment
- **must reference verifiable memory entries** ⚡

---

## LAYER 2 — PERSONAL KNOWLEDGE THREADS ⚡

### Definition
Threads created automatically or manually for **ONE USER ONLY**, representing their OWN navigation through the universe.

### Purpose ⚡
- recall path
- **follow reasoning steps** ⚡
- **support continuity of work** ⚡

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `replay_path` | ⚡ |
| `project_path` | ⚡ |
| `sphere_focus_path` | ⚡ |
| `learning_thread` | ⚡ |
| `bookmark_thread` | ⚡ |

### Personal JSON Model ⚡

```json
{
  "thread_personal": {
    "user_id": "uuid",
    "nodes": ["meeting_id", "artifact_id", "replay_id"],
    "mode": "manual|auto",
    "visibility": "private",
    "created_at": "...",
    "hash": "sha256"
  }
}
```

### Personal Fields ⚡
| Field | Description |
|-------|-------------|
| `mode` | **manual/auto** ⚡ |
| `visibility` | **"private"** ⚡ |

### Personal Rules ⚡
| Rule | Status |
|------|--------|
| **private unless explicitly shared** | ✅ ⚡ |
| **editable by user only** | ✅ ⚡ |
| **NEVER ranked or evaluated** | ✅ ⚡ |
| **cannot be used for personalization beyond navigation** | ✅ ⚡ |

---

## LAYER 3 — COLLECTIVE KNOWLEDGE THREADS ⚡

### Definition
Threads connecting facts shared by **MANY USERS**, grounded ONLY in the Collective Memory layer.

### Purpose ⚡
- reveal structural patterns across the ecosystem
- allow safe, transparent collaboration
- **visualize collective understanding** ⚡

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `multi-replay convergence` | ⚡ |
| `cross-team dependency` | ⚡ |
| `shared-citation thread` | ⚡ |
| `decision-echo threads` | **(non-evaluative)** ⚡ |
| `artifact lineage threads` | ⚡ |

### Collective JSON Model ⚡

```json
{
  "thread_collective": {
    "id": "uuid",
    "nodes": ["memory_entry_1", "memory_entry_2"],
    "participants": ["user_1", "user_2", "agent_x"],
    "sphere_map": ["business", "xr", "social"],
    "integrity": "verified",
    "hash": "sha256"
  }
}
```

### Collective Fields ⚡
| Field | Description |
|-------|-------------|
| `participants` | **Array of user/agent IDs** ⚡ |
| `sphere_map` | **Array of sphere names** ⚡ |
| `integrity` | **"verified"** ⚡ |

### Collective Rules ⚡
| Rule | Status |
|------|--------|
| **must be derived from immutable memory entries** | ✅ ⚡ |
| **visible to authorized teams only** | ✅ ⚡ |
| **NEVER aggregated into meaning-based suggestions** | ✅ ⚡ |
| **no emotional/psychological metadata** | ✅ ⚡ |
| **no weighting or ranking** | ✅ ⚡ |

---

## UNIVERSAL THREAD RENDERING RULES ⚡

### 2D VIEW ⚡
| Property | Value |
|----------|-------|
| straight or curved lines | ✅ |
| **no color meaning (color ≠ emotion)** | ⚡ |
| **thickness = node count only** | ⚡ |
| **highlight on hover only** | ⚡ |

### 3D/XR VIEW ⚡
| Property | Value |
|----------|-------|
| **threads = soft beams** | ⚡ |
| **opacity proportional to certainty of link (binary)** | ⚡ |
| **no animation implying importance** | ⚡ |
| **fixed movement (no attraction forces)** | ⚡ |

---

## THREAD INTERACTION MODES ⚡

### Allowed ⚡
| Function | Description |
|----------|-------------|
| `expand_thread()` | ⚡ |
| `collapse_branch()` | ⚡ |
| `filter_by_sphere()` | ⚡ |
| `filter_by_time()` | ⚡ |
| `show_source_memory()` | ⚡ |
| `export_thread_pdf()` | ⚡ |
| `export_thread_bundle()` | ⚡ |

### Forbidden ⚡
| Forbidden | Status |
|-----------|--------|
| **"recommended next step"** | ❌ ⚡ |
| **"importance level"** | ❌ ⚡ |
| **"most influential node"** | ❌ ⚡ |
| **sentiment cues** | ❌ ⚡ |

---

## THREAD GENERATION AGENTS ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **constructs thread based on references, never interprets meaning** ⚡ |
| `AGENT_THREAD_VALIDATOR` | **checks integrity / immutability, enforces ethical rules** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **explains WHY thread exists, uses factual, non-inferential language** ⚡ |
| `AGENT_THREAD_EXPORTER` | **creates PDF / XR bundles, applies cryptographic hash** ⚡ |

---

## THREAD EXPORT FORMATS ⚡

### PDF ⚡
| Content | Status |
|---------|--------|
| nodes list | ✅ |
| edges list | ✅ |
| sphere map | ⚡ |
| timeline strip | ⚡ |
| **verification hash** | ⚡ |

### THREAD_BUNDLE (.ktpack) ⚡ (NOUVEAU!)
| Content | Status |
|---------|--------|
| thread json | ✅ |
| memory references | ✅ |
| **integrity proof** | ⚡ |
| **optional XR layout** | ⚡ |

---

## WHY 3 LAYERS? ⚡

| Layer | Purpose |
|-------|---------|
| **INTER-SPHERE** | → structural clarity of system ⚡ |
| **PERSONAL** | → continuity for user ⚡ |
| **COLLECTIVE** | → communal understanding ⚡ |

### Together ⚡
> **One world, many paths, zero manipulation.**

---

**END — FREEZE-READY**
