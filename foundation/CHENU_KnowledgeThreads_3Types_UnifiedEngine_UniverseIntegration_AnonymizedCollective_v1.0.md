# CHE·NU — KNOWLEDGE THREAD SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## PURPOSE

> Link information, meetings, artifacts, spheres and insights **WITHOUT interpretation, persuasion, or automatic conclusions.**

### RULE
> **Threads = NEUTRAL RELATIONAL STRUCTURE. NO reasoning, NO inference, NO "smart insights".**

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Description
Connect items **INSIDE a single sphere** (Business → Business).

### Examples ⚡
- Meetings connected by same topic
- Artifacts linked through shared tags
- Decisions connected by chain of dependency
- **Tasks connected by data lineage** ⚡

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `topic_link` | ⚡ |
| `temporal_chain` | ⚡ |
| `dependency_chain` | ⚡ |
| `artifact_reference` | ⚡ |
| `participant_sequence` | ⚡ |

### Intra JSON Model ⚡

```json
{
  "knowledge_thread": {
    "type": "intra_sphere",
    "sphere": "business|scholar|creative|...",
    "nodes": ["id1", "id2", "id3"],
    "relation": "topic|time|dependency|artifact",
    "metadata": {
      "strength": "0.0-1.0 (non-emotional)",
      "source": "meeting|artifact|decision",
      "hash": "sha256"
    }
  }
}
```

### Intra Fields ⚡
| Field | Description |
|-------|-------------|
| `relation` | **topic/time/dependency/artifact** ⚡ |
| `metadata.strength` | **0.0-1.0 (non-emotional)** ⚡ |
| `metadata.source` | **meeting/artifact/decision** ⚡ |

### Presentation (UI) ⚡
- thin links inside same orbit cluster
- **no emphasis unless user hovers** ⚡
- **no automatic filtering** ⚡

### Rules ⚡
| Rule | Status |
|------|--------|
| **cannot cross spheres** | ✅ ⚡ |
| **cannot imply meaning** | ✅ ⚡ |
| **cannot visualize priority** | ✅ ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Description
Connect items **ACROSS spheres** (Business ↔ Scholar ↔ Creative).

### Purpose
> **Show structural relationships, NOT conclusions.**

### Examples ⚡
- A Scholar research document referenced in Business planning
- A Creative design influencing a Social campaign
- **An Institutional rule impacting Business workflows** ⚡

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `cross_reference` | ⚡ |
| `concept_bridge` | ⚡ |
| `regulatory_link` | ⚡ |
| `shared_artifact` | ⚡ |
| `timeline_alignment` | ⚡ |

### Inter JSON Model ⚡

```json
{
  "knowledge_thread": {
    "type": "inter_sphere",
    "from_sphere": "business",
    "to_sphere": "scholar",
    "nodes": ["artifact_id", "meeting_id", "decision_id"],
    "relation": "bridge|alignment|reference",
    "metadata": {
      "visibility": "public|team|private",
      "integrity_hash": "sha256"
    }
  }
}
```

### Inter Fields ⚡
| Field | Description |
|-------|-------------|
| `relation` | **bridge/alignment/reference** ⚡ |
| `metadata.visibility` | **public/team/private** ⚡ |

### Presentation (UI) ⚡
- curved arcs between sphere orbits
- **subdued glow, no motion** ⚡
- optional collapse/expand toggle

### Rules ⚡
| Rule | Status |
|------|--------|
| **user must enable cross-sphere view** | ✅ ⚡ |
| **cannot reorder universe layout** | ✅ ⚡ |
| **cannot re-cluster spheres automatically** | ✅ ⚡ |

---

## 3) CROSS-USER / COLLECTIVE KNOWLEDGE THREADS ⚡

### Description
Safe, non-personalized mapping of **SHARED structures** across users, derived **ONLY from validated, approved, non-private data.**

### Purpose
> **Show what is COMMON — not who contributed it.**

### Examples ⚡
- Collective decision sequences
- **Recurring patterns in artifacts (non-interpretative)** ⚡
- Shared workflows across teams
- Collective timeline of events

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `collective_event_chain` | ⚡ |
| `shared_context_path` | ⚡ |
| `cross_user_artifact_link` | ⚡ |
| `group_sequence` | ⚡ |

### Collective JSON Model ⚡

```json
{
  "knowledge_thread": {
    "type": "collective",
    "anonymized": true,
    "nodes": ["event_id_1", "event_id_2"],
    "relation": "collective_chain|shared_pattern",
    "metadata": {
      "population_size": "int",
      "visibility": "public|team",
      "safety_lock": true
    }
  }
}
```

### Collective Fields ⚡
| Field | Description |
|-------|-------------|
| `anonymized` | **true always** ⚡ |
| `relation` | **collective_chain/shared_pattern** ⚡ |
| `metadata.population_size` | **Integer count** ⚡ |
| `metadata.safety_lock` | **true always** ⚡ |

### Presentation (UI) ⚡
- **appears ONLY in Collective Memory Mode** ⚡
- **dotted lines to signal anonymity** ⚡
- **no user-specific influence** ⚡

### Rules ⚡
| Rule | Status |
|------|--------|
| **no personalization** | ✅ ⚡ |
| **no prediction** | ✅ ⚡ |
| **no weighting based on success/failure** | ✅ ⚡ |
| **no attribution to individuals** | ✅ ⚡ |

---

## UNIFIED KNOWLEDGE THREAD ENGINE ⚡

### ENGINE RESPONSIBILITIES ⚡
| Responsibility | Status |
|----------------|--------|
| **store threads append-only** | ✅ ⚡ |
| **compute simple adjacency (not meaning)** | ✅ ⚡ |
| **ensure anonymity for collective threads** | ✅ ⚡ |
| **validate integrity hashes** | ✅ ⚡ |
| **versioning** | ✅ ⚡ |
| **export bundles for replay/analysis** | ✅ ⚡ |

### ENGINE NEVER ⚡
| Forbidden | Status |
|-----------|--------|
| **merges threads automatically** | ❌ ⚡ |
| **generates insights** | ❌ ⚡ |
| **deduces patterns** | ❌ ⚡ |
| **ranks relevance** | ❌ ⚡ |

---

## UNIVERSE VIEW INTEGRATION ⚡

| Thread Type | Display |
|-------------|---------|
| **Intra-sphere threads** | shown inside orbits ⚡ |
| **Inter-sphere threads** | shown as arcs between orbits ⚡ |
| **Collective threads** | shown **ONLY in Collective Mode** ⚡ |

### All Threads ⚡
- selectable but **NEVER highlighted by AI** ⚡

---

**END — KNOWLEDGE THREAD SYSTEM (3-LAYER FREEZE)**
