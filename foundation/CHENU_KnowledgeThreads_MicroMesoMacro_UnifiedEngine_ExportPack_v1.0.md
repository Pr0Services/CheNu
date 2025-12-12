# CHE·NU — KNOWLEDGE THREADS (MICRO/MESO/MACRO)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## KNOWLEDGE THREADS — GLOBAL PRINCIPLE

### Definition
> A Knowledge Thread = A **VERIFIED LINK** between facts, memories, artifacts, and meetings, **WITHOUT inference, persuasion, or interpretation.**

### NEVER ⚡
- guess
- predict
- assume causal relations
- generate meaning

### ONLY ⚡
- connect what **EXISTS** and is **VERIFIED**

---

## LEVEL 1 — MICRO KNOWLEDGE THREADS ⚡

### Purpose
Connect fine-grain elements inside a **SINGLE meeting** or a **SINGLE replay.**

### Units ⚡
| Unit | Description |
|------|-------------|
| `decision → artifact` | ⚡ |
| `event → timestamp` | ⚡ |
| `participant → note` | ⚡ |
| `silence → context marker` | ⚡ |

### Examples ⚡
- *"This chart was referenced at t=154s"*
- *"This note was pinned by Agent X"*

### Micro Data Model JSON ⚡

```json
{
  "kt_micro": {
    "source": "event|artifact|timeline",
    "target": "event|artifact|timeline",
    "meeting_id": "uuid",
    "verified": true,
    "hash": "sha256"
  }
}
```

### Micro Fields ⚡
| Field | Description |
|-------|-------------|
| `source` | **event/artifact/timeline** ⚡ |
| `target` | **event/artifact/timeline** ⚡ |
| `verified` | **boolean true** ⚡ |

### Micro Rules ⚡
| Rule | Status |
|------|--------|
| **must originate from validated XR replay data** | ✅ ⚡ |
| **immutable** | ✅ ⚡ |
| **local to a meeting or artifact group** | ✅ ⚡ |
| **no emotional tagging, no subjective annotation** | ✅ ⚡ |

### Displayed As ⚡
- **small thread lines in XR** ⚡
- **dotted links in Universe View 2D** ⚡

---

## LEVEL 2 — MESO KNOWLEDGE THREADS ⚡

### Purpose
Connect **RELATED MEETINGS**, decisions, or artifacts across **TIME or SPHERES**, but **WITHOUT interpretation.**

### Valid Relations ⚡
| Relation | Description |
|----------|-------------|
| `same topic` | ⚡ |
| `same artifact updated across meetings` | ⚡ |
| `same participants` | ⚡ |
| `sequential decision chains` | ⚡ |
| `sphere-adjacent dependencies` | ⚡ |

### Examples ⚡
- *"Meeting A and Meeting C referenced File #44"*
- *"A decision in Sphere Business was later reviewed in Sphere Scholar"*

### Meso Data Model JSON ⚡

```json
{
  "kt_meso": {
    "relation": "shared_artifact|continued_topic|team_overlap",
    "nodes": ["uuid_1", "uuid_2"],
    "verified_links": ["micro_hash_1", "micro_hash_2"],
    "sphere_context": ["business", "scholar"],
    "hash": "sha256"
  }
}
```

### Meso Fields ⚡
| Field | Description |
|-------|-------------|
| `relation` | **shared_artifact/continued_topic/team_overlap** ⚡ |
| `verified_links` | **Array of micro hashes** ⚡ |
| `sphere_context` | **Array of sphere names** ⚡ |

### Meso Rules ⚡
| Rule | Status |
|------|--------|
| **must be traceable to ≥2 micro threads** | ✅ ⚡ |
| **no causal claim** | ✅ ⚡ |
| **no improvement recommendation** | ✅ ⚡ |
| **NEVER surface personal information without consent** | ✅ ⚡ |

### Displayed As ⚡
- **orbit-to-orbit curved lines** ⚡
- **thicker threads when multiple micro-links stacked** ⚡

---

## LEVEL 3 — MACRO KNOWLEDGE THREADS ⚡

### Purpose
Reveal **SYSTEM-LEVEL, LONG-TERM** structures of knowledge: evolution of a project, life cycle of decisions, cross-sphere knowledge flows, organizational memory over time

### Never ⚡
- rank users
- evaluate decisions
- summarize motivations

### Allowed ⚡
- *"This topic evolved through 7 meetings"*
- *"These 3 spheres exchanged artifacts over 4 months"*

### Macro Data Model JSON ⚡

```json
{
  "kt_macro": {
    "clusters": ["topic_id", "project_id"],
    "spanning_threads": ["meso_hash_1", "meso_hash_2", "..."],
    "timeline": {
      "start": "...",
      "end": "...",
      "density": "0.0-1.0"
    },
    "graph_signature": "sha256",
    "hash": "sha256"
  }
}
```

### Macro Fields ⚡
| Field | Description |
|-------|-------------|
| `clusters` | **Array of topic/project IDs** ⚡ |
| `spanning_threads` | **Array of meso hashes** ⚡ |
| `timeline.density` | **0.0-1.0 float** ⚡ |
| `graph_signature` | **sha256** ⚡ |

### Macro Rules ⚡
| Rule | Status |
|------|--------|
| **built ONLY from meso-level verified links** | ✅ ⚡ |
| **no prediction, no interpretation** | ✅ ⚡ |
| **macro threads NEVER influence routing** | ✅ ⚡ |
| **user can disable completely** | ✅ ⚡ |

### Displayed As ⚡
- **soft glows linking sphere orbits** ⚡
- **optional "knowledge constellation map"** ⚡

---

## UNIFIED KNOWLEDGE THREAD ENGINE ⚡

### Thread Creation Pipeline ⚡
| Step | Description |
|------|-------------|
| 1 | Extract micro threads (event-level) |
| 2 | Verify via replay integrity hash |
| 3 | Aggregate into meso clusters |
| 4 | Build macro constellations |
| 5 | **Present safely via Universe View** ⚡ |

### Access Permissions ⚡
| Level | Scope |
|-------|-------|
| **micro** | user's own meetings + allowed agents ⚡ |
| **meso** | team or sphere controlled visibility ⚡ |
| **macro** | **optional, anonymized, privacy-first** ⚡ |

---

## JSON EXPORT — KNOWLEDGE THREADS PACK ⚡

```json
{
  "knowledge_threads": {
    "micro": [...],
    "meso": [...],
    "macro": [...],
    "version": "1.0",
    "integrity": "verified",
    "hash": "sha256"
  }
}
```

---

**END — FREEZE READY**
