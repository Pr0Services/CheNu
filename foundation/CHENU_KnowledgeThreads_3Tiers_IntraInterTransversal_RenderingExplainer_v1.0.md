# CHE·NU — KNOWLEDGE THREADS (3 TIERS)
**VERSION:** CORE.KNOWLEDGE.v1.0  
**MODE:** FOUNDATION / TRACEABLE / NON-MANIPULATIVE

---

## PURPOSE OF KNOWLEDGE THREADS

Connect facts, artifacts, replays, decisions, and contexts **WITHOUT interpretation or bias.**

> **Threads = LINKS BETWEEN TRUTHS. Not stories. Not conclusions.**

---

## THREAD SECURITY RULES ⚡

| Rule | Status |
|------|--------|
| **Append-only** | ✅ ⚡ |
| **Immutable once verified** | ✅ ⚡ |
| **Cryptographically hashed** | ✅ ⚡ |
| **Explainable links only** | ✅ ⚡ |
| **NO inference, NO sentiment, NO prediction** | ✅ ⚡ |
| **User can delete private threads** | ✅ ⚡ |

---

## TIER 1 — INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Scope
Within the same sphere (Business, Scholar, Creative, etc.)

### Use Cases ⚡
- connect meetings on same topic
- link documents produced in sequence
- unify artifacts belonging to same project
- **follow event → decision → outcome progression** ⚡

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `topic_thread` | ⚡ |
| `timeline_thread` | ⚡ |
| `artifact_evolution_thread` | ⚡ |
| `decision_chain_thread` | ⚡ |

### Intra Data Model JSON ⚡

```json
{
  "thread": {
    "id": "uuid",
    "tier": "intra",
    "sphere": "business|scholar|creative|...",
    "nodes": ["event_id", "artifact_id", "decision_id"],
    "links": [{"from": "id", "to": "id", "type": "sequence|reference"}],
    "hash": "sha256"
  }
}
```

### Intra Fields ⚡
| Field | Description |
|-------|-------------|
| `tier` | **"intra"** ⚡ |
| `links[].type` | **sequence/reference** ⚡ |

### Intra Rules ⚡
- all nodes must share same sphere tag
- **no interpretation of quality or success** ⚡
- purely structural linking

---

## TIER 2 — INTER-SPHERE KNOWLEDGE THREADS ⚡

### Scope
Across different spheres.

### Purpose
Show structural relationships between domains **WITHOUT blending domain meaning, WITHOUT cross-sphere influence.**

### Examples ⚡
- Scholar research used in Business planning
- Creative assets linked to Social media deployment
- **Institutional compliance affecting Business decisions** ⚡

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `cross_reference_thread` | ⚡ |
| `dependency_thread` | ⚡ |
| `shared_artifact_thread` | ⚡ |
| `multi-sphere_timeline_thread` | ⚡ |

### Inter Data Model JSON ⚡

```json
{
  "thread": {
    "id": "uuid",
    "tier": "inter",
    "spheres": ["business", "scholar"],
    "nodes": [...],
    "links": [
      {"from": "id", "to": "id", "type": "cross_sphere"}
    ],
    "explanations": [
      {"link_id": "uuid", "reason": "shared_artifact"}
    ],
    "hash": "sha256"
  }
}
```

### Inter Fields ⚡
| Field | Description |
|-------|-------------|
| `tier` | **"inter"** ⚡ |
| `explanations[]` | **REQUIRED for each link** ⚡ |
| `explanations[].reason` | **"shared_artifact" etc.** ⚡ |

### Inter Rules ⚡
| Rule | Status |
|------|--------|
| **explanation REQUIRED for each link** | ✅ ⚡ |
| **no "why", only "how they are connected"** | ✅ ⚡ |
| **inter-sphere threads NEVER imply causation** | ✅ ⚡ |

---

## TIER 3 — TRANSVERSAL META KNOWLEDGE THREADS ⚡

### Scope
Across time, spheres, agents, and contexts. **These are the highest-order structural threads.**

### Purpose
Reveal recurring structures **WITHOUT interpreting them.** Support comprehension of system-wide patterns.

### Examples ⚡
- recurring sequences of events (not conclusions)
- structural similarities between projects
- **multi-agent collaboration patterns** ⚡
- **repeated bottlenecks (without suggesting "fixes")** ⚡

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `structural_pattern_thread` | ⚡ |
| `recurrence_thread` | ⚡ |
| `meta_timeline_thread` | ⚡ |
| `system_shape_thread` | ⚡ |

### Transversal Data Model JSON ⚡

```json
{
  "thread": {
    "id": "uuid",
    "tier": "transversal",
    "pattern_type": "recurrence|shape|sequence",
    "instances": [
      { "thread_ref": "uuid", "context": "..." }
    ],
    "abstraction_level": "1|2|3",
    "hash": "sha256"
  }
}
```

### Transversal Fields ⚡
| Field | Description |
|-------|-------------|
| `tier` | **"transversal"** ⚡ |
| `pattern_type` | **recurrence/shape/sequence** ⚡ |
| `instances[].thread_ref` | **UUID reference** ⚡ |
| `abstraction_level` | **1/2/3** ⚡ |

### Transversal Rules ⚡
| Rule | Status |
|------|--------|
| **no predictive modeling** | ✅ ⚡ |
| **no normative patterns** | ✅ ⚡ |
| **no optimization suggestions** | ✅ ⚡ |
| **ONLY pattern recognition based on structural repetition** | ✅ ⚡ |

---

## THREAD RENDERING (UNIVERSE VIEW) ⚡

### 2D Mode ⚡
| Tier | Style |
|------|-------|
| **intra** | dotted lines ⚡ |
| **inter** | dashed lines ⚡ |
| **transversal** | double-dashed lines ⚡ |

### 3D Mode ⚡
- orbital bands
- **pulsating arcs** ⚡
- **lattice structures for transversal** ⚡

### XR Mode ⚡
- **interactive "light threads"** ⚡
- **pinch to reveal source nodes** ⚡
- **timeline braid overlay (read-only)** ⚡

---

## THREAD CREATION LOGIC ⚡

### Triggered By ⚡
- user request
- validated replay export
- artifact publication
- **decision log finalization** ⚡
- **cross-sphere reference creation** ⚡

### Never Triggered By ⚡
| Forbidden | Status |
|-----------|--------|
| **agent intuition** | ❌ ⚡ |
| **statistical guess** | ❌ ⚡ |
| **inferred relationships** | ❌ ⚡ |

---

## THREAD EXPLANATION AGENT ⚡

### AGENT_THREAD_EXPLAINER ⚡
- explains each link neutrally
- **no speculation** ⚡
- **no prioritization** ⚡
- **no narrative construction** ⚡

### Example Explanation Output ⚡
```
"Node A and Node B are connected because:
  - They reference the same artifact
  - Artifact is dated within 24 hours
  - Both belong to sphere: Business"
```

---

## THREAD EXPORT ⚡

| Format | Description |
|--------|-------------|
| `.json` | structural ⚡ |
| `.pdf` | diagram ⚡ |
| `.threadpack` | **bundle for XR** ⚡ |
| `.svg` | 2D map ⚡ |

---

**END — KNOWLEDGE THREAD SUITE**
