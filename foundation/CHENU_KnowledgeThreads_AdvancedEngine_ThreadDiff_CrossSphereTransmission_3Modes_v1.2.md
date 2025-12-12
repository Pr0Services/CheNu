# CHE·NU — KNOWLEDGE THREAD ENGINE (ADVANCED SUITE)
**VERSION:** KT.v1.2  
**MODE:** FOUNDATION / NON-MANIPULATIVE

---

## 1) ADVANCED KNOWLEDGE THREAD ENGINE ⚡

### Purpose
> **Bind information across spheres, meetings, artifacts, agents, and decisions WITHOUT narrative shaping.**

### RULE
> **A Thread = A TRACEABLE LINK. NOT a story, NOT an interpretation.**

### 5 Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | connects events across meetings ⚡ |
| `THREAD_ARTIFACT` | connects related documents, models, boards ⚡ |
| `THREAD_DECISION` | links decisions across time or spheres ⚡ |
| `THREAD_AGENT` | **tracks repeated agent involvement (neutral)** ⚡ |
| `THREAD_CONTEXT` | **structural overlap (topic, sphere, domain)** ⚡ |

### Thread JSON ⚡
```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "event|artifact|decision|agent|context",
    "nodes": ["uuid", "uuid", "uuid"],
    "strength": 0.0-1.0,
    "origin": "collective_memory_entry",
    "hash": "sha256"
  }
}
```

### 4 Thread Generation Rules ⚡
| Rule | Description |
|------|-------------|
| **RULE 1** | Linking requires ≥2 shared attributes ⚡ |
| **RULE 2** | Zero emotional or semantic inference ⚡ |
| **RULE 3** | Append-only, versioned ⚡ |
| **RULE 4** | **Must be user-visible + explainable** ⚡ |

### Thread Visualization ⚡
| Line Type | Meaning |
|-----------|---------|
| thin line | weak connection ⚡ |
| medium line | moderate shared signals ⚡ |
| **thick line** | **strong factual overlap** ⚡ |

### Forbidden ⚡
| NO | Status |
|----|--------|
| **highlighting "importance"** | ❌ ⚡ |
| **directional arrows** | ❌ ⚡ |
| **story-building** | ❌ ⚡ |

---

## 2) KNOWLEDGE THREAD DIFF ⚡ (NOUVEAU!)
### COLLECTIVE MEMORY vs PERSONAL MEMORY

### Purpose
> **Show differences between user's local perspective and global collective memory WITHOUT bias.**

### 4 Diff Types ⚡
| Type | Description |
|------|-------------|
| `DIFF_SCOPE` | **What collective has vs what user saw** ⚡ |
| `DIFF_ARTIFACT` | Missing or additional documents ⚡ |
| `DIFF_DECISION` | User sequences vs all sequences ⚡ |
| `DIFF_TIMING` | **User timeline vs global timeline** ⚡ |

### Diff JSON ⚡
```json
{
  "thread_diff": {
    "thread_id": "uuid",
    "collective_nodes": ["..."],
    "personal_nodes": ["..."],
    "missing": ["..."],
    "additional": ["..."],
    "explanation": "plain neutral text"
  }
}
```

### Key Fields ⚡
| Field | Description |
|-------|-------------|
| `missing` | **what user doesn't have** |
| `additional` | **what user has that collective doesn't** |

### Diff Rules ⚡
| Rule | Status |
|------|--------|
| **Never judges user perception** | ✅ ⚡ |
| **Never marks something as "wrong"** | ✅ ⚡ |
| **Only exposes structural gaps** | ✅ ⚡ |
| **Always reversible and exportable** | ✅ ⚡ |

---

## 3) CROSS-SPHERE KNOWLEDGE TRANSMISSION RULES ⚡

### Purpose
> **Ensure knowledge moves between spheres safely, consistently, and transparently.**

### Transmission ALLOWED When ⚡
| Condition | Status |
|-----------|--------|
| same topic category | ✅ ⚡ |
| compatible access rights | ✅ ⚡ |
| user explicitly opens the thread | ✅ ⚡ |
| **agent coordinator validates neutrality** | ✅ ⚡ |

### Transmission BLOCKED When ⚡
| Condition | Status |
|-----------|--------|
| **privacy boundaries in conflict** | ❌ ⚡ |
| **sphere isolation rule applies** | ❌ ⚡ |
| **artifacts contain sensitive metadata** | ❌ ⚡ |
| **transmission would imply interpretation** | ❌ ⚡ |

### Cross-Sphere Transfer JSON ⚡
```json
{
  "cross_sphere_transfer": {
    "from": "sphere_id",
    "to": "sphere_id",
    "thread_id": "uuid",
    "visibility": "allowed|blocked",
    "reason": "string",
    "hash": "sha256"
  }
}
```

### 3 Transmission Modes ⚡ (NOUVEAU!)
| Mode | Description |
|------|-------------|
| `DIRECT` | User imports a thread into another sphere ⚡ |
| `OVERLAY` | **Thread shows as "ghosted" until unlocked** ⚡ |
| `AGENT-MEDIATED` | **Agent explains compatibility and constraints** ⚡ |

---

## WHY THIS MATTERS ⚡

### Knowledge Threads Unify ⚡
| Component |
|-----------|
| XR replays |
| decisions |
| artifacts |
| spheres |
| agents |

### WITHOUT ⚡
| Forbidden |
|-----------|
| creating stories |
| shaping conclusions |
| hiding complexity |

> **Pure structure → Pure clarity.**

---

**END — FREEZE READY**
