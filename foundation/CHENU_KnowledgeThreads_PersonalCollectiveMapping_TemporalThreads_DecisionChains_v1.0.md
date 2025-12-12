# CHE·NU — KNOWLEDGE THREADS (SECTIONS 2-3-4)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## 2) PERSONAL → COLLECTIVE KNOWLEDGE THREAD MAPPING ⚡

### Purpose
> **Allow a user to see how their OWN data, actions, and artifacts connect into the COLLECTIVE MEMORY without revealing anything private.**

### RULE
> **User remains sovereign over what becomes shared.**

### Personal View ⚡
| User sees | Description |
|-----------|-------------|
| how their meeting replays connect to collective ones | ⚡ |
| how their decisions feed into cross-sphere threads | ⚡ |
| **which of their notes became artifacts** | ⚡ |
| **where they influenced timelines** | ⚡ |

### 3 Mapping Types ⚡
| Type | Description |
|------|-------------|
| `SELF_TO_COLLECTIVE_THREAD` | **private → public map (opt-in)** ⚡ |
| `SELF_TO_SPHERE_THREAD` | personal actions influencing a sphere ⚡ |
| `SELF_TO_REPLAY_THREAD` | **personal replay linked to others' replays** ⚡ |

### Personal Sovereignty Rules ⚡
| Rule | Status |
|------|--------|
| **user decides what is shared** | ✅ ⚡ |
| **user can "unlink" their own threads** | ✅ ⚡ |
| **collective memory keeps anonymized fragments** | ✅ ⚡ |

### Mapping JSON ⚡
```json
{
  "personal_collective_map": {
    "user_id": "uuid",
    "links": [
      {
        "personal_node": "uuid",
        "collective_thread": "uuid",
        "visibility": "private|shared|anonymized"
      }
    ]
  }
}
```

### Safety Guarantees ⚡
| Guarantee | Status |
|-----------|--------|
| **no exposure of private memories** | ✅ ⚡ |
| **no shared threads without consent** | ✅ ⚡ |
| **no analysis of personal behavior** | ✅ ⚡ |

---

## 3) TEMPORAL KNOWLEDGE THREADS (ACROSS TIME) ⚡

### Purpose
> **Observe how knowledge evolves across time WITHOUT suggesting progress, regression, or judgment.**

### RULE
> **Time is a NEUTRAL AXIS.**

### Temporal Thread Sources ⚡
| Source | Description |
|--------|-------------|
| historical meetings | ⚡ |
| **replays over weeks/months/years** | ⚡ |
| policy evolutions | ⚡ |
| project steps | ⚡ |
| **educational progression** | ⚡ |

### 4 Temporal Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_LINEAR` | meeting sequence on same topic ⚡ |
| `THREAD_BRANCH` | **parallel developments** (ex: 3 solutions explored) ⚡ |
| `THREAD_RECONVERGE` | **separate branches that unify into a shared artifact** ⚡ |
| `THREAD_ARCHIVE` | **long-term memory cluster** ⚡ |

### Temporal Thread JSON ⚡
```json
{
  "temporal_thread": {
    "id": "uuid",
    "timeline": [
      { "t": 1, "event": "uuid" },
      { "t": 2, "event": "uuid" }
    ],
    "branch_points": ["uuid"],
    "merge_points": ["uuid"]
  }
}
```

### Key Fields ⚡
| Field | Description |
|-------|-------------|
| `branch_points` | **where paths diverge** ⚡ |
| `merge_points` | **where paths reconverge** ⚡ |

### Visual Rules ⚡
| Rule | Status |
|------|--------|
| **no arrows implying success/failure** | ✅ ⚡ |
| **simple timelines, braids, or clusters** | ✅ ⚡ |
| **user controls thickness/density** | ✅ ⚡ |

---

## 4) DECISION KNOWLEDGE THREADS (CAUSAL CHAINS) ⚡

### Purpose
> **Show chains of decisions WITHOUT assigning causality, responsibility, or evaluation.**

### RULE
> **We show STRUCTURE, not blame or success.**

### 4 Chain Types ⚡
| Type | Description |
|------|-------------|
| `CHAIN_ACTION` | **decision → event → artifact** ⚡ |
| `CHAIN_CONSULTATION` | **meeting → agent suggestion → user decision** ⚡ |
| `CHAIN_MULTIPATH` | **two or more decision paths explored in parallel** ⚡ |
| `CHAIN_REVIEW` | **original decision revisited via replay** ⚡ |

### Decision Thread JSON ⚡
```json
{
  "decision_thread": {
    "decision_id": "uuid",
    "steps": [
      { "type": "meeting", "ref": "uuid" },
      { "type": "artifact", "ref": "uuid" },
      { "type": "event", "ref": "uuid" }
    ],
    "parallel_paths": [["uuid"], ["uuid"]],
    "review_links": ["uuid"],
    "integrity": "verified"
  }
}
```

### Key Fields ⚡
| Field | Description |
|-------|-------------|
| `parallel_paths` | **multiple decision branches** ⚡ |
| `review_links` | **replay revisitations** ⚡ |

### Constraints ⚡
| Constraint | Status |
|------------|--------|
| **NO success indicators** | ✅ ⚡ |
| **NO failure indicators** | ✅ ⚡ |
| **NO scoring** | ✅ ⚡ |
| **NO recommendations** | ✅ ⚡ |
| **NO inference of motivation** | ✅ ⚡ |

---

**END — KNOWLEDGE THREADS (SECTIONS 2-3-4)**
