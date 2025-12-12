# CHE·NU — KNOWLEDGE THREAD SYSTEM
**VERSION:** KT.v1.0  
**MODE:** CROSS-SPHERE / NON-MANIPULATIVE / BUILD-READY

---

## A) KNOWLEDGE THREADS — CORE (LEVEL 1) ⚡

### Purpose
Connect related information across spheres, meetings, artifacts, agents, and user actions **WITHOUT altering meaning.**

### RULE
> **Threads = NEUTRAL CONNECTORS. NO inference. NO prediction. NO narrative shaping.**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_TOPIC` | shared subject matter, documents, meetings, notes ⚡ |
| `THREAD_CONTEXT` | sphere alignment, project identifiability ⚡ |
| `THREAD_EVENT` | shared decision, action, or timestamp ⚡ |
| `THREAD_USER` | same user **(optional privacy lock)** ⚡ |
| `THREAD_AGENT` | same agent participated or observed ⚡ |
| `THREAD_ARTIFACT` | reusable assets crossing multiple contexts ⚡ |

### Thread JSON ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "topic|context|event|user|agent|artifact",
    "from": "memory_id",
    "to": "memory_id",
    "attrs": {
      "strength": "0.0-1.0",
      "reason": "shared_topic|shared_agent|...",
      "timestamp": 1712345678
    }
  }
}
```

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **reversible visibility** | ✅ ⚡ |
| **no merging of content** | ✅ ⚡ |
| **no hidden links** | ✅ ⚡ |
| **explicit user control** | ✅ ⚡ |
| **private threads remain private** | ✅ ⚡ |

---

## B) KNOWLEDGE FIBERS — MICRO LINKS (LEVEL 2) ⚡ (NOUVEAU!)

### Purpose
Represent **fine-grain continuity** across meetings, documents, and agent actions. **FIBERS = micro-connectors with HIGH precision, but LOW influence.**

### RULE
> **Fibers highlight RELATIONSHIPS, not meaning.**

### Fiber Types ⚡
| Type | Description |
|------|-------------|
| `FIBER_TERM` | same keyword or concept appears ⚡ |
| `FIBER_PATTERN` | identical structure (timeline step, sequence) ⚡ |
| `FIBER_ACTION` | agent performed same type of task ⚡ |
| `FIBER_DECISION` | similar decision pattern ⚡ |
| `FIBER_REFERENCE` | artifact reused or quoted ⚡ |

### Fiber JSON ⚡

```json
{
  "fiber": {
    "id": "uuid",
    "origin": "memory_id",
    "target": "memory_id",
    "micro_cue": "keyword|pattern|action",
    "confidence": "0.1-0.4",
    "visible": false
  }
}
```

### Fiber Key Fields ⚡
| Field | Description |
|-------|-------------|
| `micro_cue` | **keyword/pattern/action** ⚡ |
| `confidence` | **0.1-0.4 (low by design)** ⚡ |
| `visible` | **false (off by default)** ⚡ |

### Fiber Rules ⚡
| Rule | Status |
|------|--------|
| **never enable automatically** | ✅ ⚡ |
| **must be toggled manually** | ✅ ⚡ |
| **no highlighting unless user requests it** | ✅ ⚡ |
| **always explain reason when revealed** | ✅ ⚡ |

---

## C) KNOWLEDGE LATTICES — MACRO STRUCTURES (LEVEL 3) ⚡ (NOUVEAU!)

### Purpose
Build a **large-scale, stable structural map** of information across the whole Che-Nu ecosystem.

### RULE
> **Lattices = architecture of knowledge, NOT conclusions.**

### Lattice Nodes ⚡
| Node Type | Description |
|-----------|-------------|
| Spheres | ⚡ |
| Projects | ⚡ |
| Long-running threads | ⚡ |
| Decision clusters | ⚡ |
| Agent hubs | ⚡ |
| **Memory pillars (high-density)** | ⚡ |

### Lattice Edges ⚡
| Edge Type | Description |
|-----------|-------------|
| stable cross-sphere relations | ⚡ |
| recurring decision paths | ⚡ |
| long-term user milestones | ⚡ |
| **validated recurring workflows** | ⚡ |

### Lattice JSON ⚡

```json
{
  "lattice": {
    "nodes": ["..."],
    "edges": ["..."],
    "metrics": {
      "density": "0.0-1.0",
      "cluster_count": "n",
      "stability_index": "0.0-1.0"
    },
    "version": "x.y",
    "integrity_hash": "sha256"
  }
}
```

### Lattice Metrics ⚡
| Metric | Description |
|--------|-------------|
| `density` | **0.0-1.0** ⚡ |
| `cluster_count` | **integer** ⚡ |
| `stability_index` | **0.0-1.0** ⚡ |

### Lattice Rules ⚡
| Rule | Status |
|------|--------|
| **slow update cycle (daily/weekly)** | ✅ ⚡ |
| **no emotional signals** | ✅ ⚡ |
| **no ranking nodes or decisions** | ✅ ⚡ |
| **no predictive modeling** | ✅ ⚡ |
| **must remain readable & calm** | ✅ ⚡ |

---

## CROSS-MODEL SAFETY & ETHICS ⚡

### ALL Knowledge Structures (Threads, Fibers, Lattices) MUST ⚡
| Rule | Status |
|------|--------|
| **never predict outcomes** | ✅ ⚡ |
| **never push recommendations** | ✅ ⚡ |
| **never reshape narratives** | ✅ ⚡ |
| **never infer intent or emotion** | ✅ ⚡ |
| **never group users psychologically** | ✅ ⚡ |
| **respect privacy locks** | ✅ ⚡ |
| **be reversible and fully transparent** | ✅ ⚡ |

---

## VISUALIZATION (UNIVERSE VIEW) ⚡

| Level | Visual | Description |
|-------|--------|-------------|
| **THREADS** | thin lines, soft color | hover to reveal reason ⚡ |
| **FIBERS** | micro dotted lines | **invisible by default, appear only when toggled** ⚡ |
| **LATTICES** | constellation-like clusters | **no animation spikes, stable glowing nodes** ⚡ |

---

## AGENTS INVOLVED ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **creates threads only from objective facts** ⚡ |
| `AGENT_FIBER_ANALYZER` | **identifies micro-cues, always low-confidence locked** ⚡ |
| `AGENT_LATTICE_ENGINE` | **constructs macro structure, slow cadence, no influence** ⚡ |
| `AGENT_EXPLAINER` | **explains connections on request, no interpretation, pure description** ⚡ |

---

## WHY THIS MATTERS ⚡

| Level | = |
|-------|---|
| **THREADS** | relationships ⚡ |
| **FIBERS** | subtle signals ⚡ |
| **LATTICES** | structure ⚡ |

> **Together they create knowledge clarity WITHOUT altering meaning, WITHOUT psychological shaping, WITHOUT bias.**

---

**END — FREEZE READY**
