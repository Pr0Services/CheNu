# CHE·NU — KNOWLEDGE THREADS SYSTEM (PART 1 — FOUNDATIONAL)
**VERSION:** KT.v1.0  
**MODE:** CANONICAL / NON-MANIPULATIVE / FREEZE-READY

---

## PURPOSE

> **Knowledge Threads = liens neutres** entre informations, événements, sphères, décisions, replays, agents, et artefacts.

### RULES
- No inference
- No prediction
- No persuasion
- **Pure linkage of verified data**

---

## THREAD TYPE 1 — FACTUAL THREAD

### Purpose
Links **FACTS** across time, meetings, spheres.

### Node Types ⚡
| Type | Description |
|------|-------------|
| event | ✅ |
| artifact | ✅ |
| timestamp | ✅ |
| sphere | ✅ |
| **agent-action** | ⚡ |

### A Factual Thread Answers ONLY ⚡
> **"What is connected to what?"**

### Example
> Meeting A → Document X → Meeting B → Decision Y

### Factual Thread JSON (with edges) ⚡

```json
{
  "thread": {
    "type": "factual",
    "id": "uuid",
    "nodes": ["event","artifact","decision","replay"],
    "edges": ["followed_by","referenced_in","originated_from"],
    "hash": "sha256"
  }
}
```

### Factual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `edges` | **["followed_by","referenced_in","originated_from"]** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| append-only | ✅ |
| immutable after freeze | ✅ |
| **cryptographically signed** | ✅ ⚡ |
| **never recomputed automatically** | ✅ ⚡ |

---

## THREAD TYPE 2 — TEMPORAL THREAD

### Purpose
Shows sequences **ACROSS meetings & spheres.**

### Timeline Form ⚡
> time0 → time1 → time2 → ...

### Purpose ⚡
> Understand progression **WITHOUT interpretation.**

### Temporal Thread JSON (with ordering + timestamps) ⚡

```json
{
  "thread": {
    "type": "temporal",
    "ordering": "ASC",
    "timestamps": [ ... ],
    "context": ["sphere", "meeting"],
    "hash": "sha256"
  }
}
```

### Temporal Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `ordering` | **"ASC"** ⚡ |
| `timestamps` | **Array of timestamps** ⚡ |
| `context` | **["sphere", "meeting"]** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **no causality attribution** | ✅ ⚡ |
| **no "trend" detection** | ✅ ⚡ |
| no emotional signals | ✅ |

---

## THREAD TYPE 3 — SPHERE-TO-SPHERE THREAD

### Purpose
Maps how knowledge flows across Che-Nu spheres.

### Examples ⚡
- Scholar → Business → XR → Creative
- Institution → Methodology → Business

### Purpose ⚡
> **Visual linkage only, NOT recommendation.**

### Sphere-to-Sphere JSON (with path) ⚡

```json
{
  "thread": {
    "type": "cross_sphere",
    "path": ["scholar","business","xr"],
    "artifacts": ["doc_id"],
    "meetings": ["meeting_id"],
    "hash": "sha256"
  }
}
```

### Sphere-to-Sphere Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **"cross_sphere"** ⚡ |
| `path` | **["scholar","business","xr"]** ⚡ |
| `artifacts` | **Array of doc_ids** ⚡ |
| `meetings` | **Array of meeting_ids** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **cannot reorder spheres** | ✅ ⚡ |
| **cannot evaluate "importance"** | ✅ ⚡ |
| cannot infer meaning | ✅ |

---

## UNIVERSAL THREAD RULES

### THREADS ARE: ⚡
| Property | Status |
|----------|--------|
| neutral | ✅ |
| immutable after validation | ✅ |
| **independent of user profile** | ✅ ⚡ |
| visible only with permission | ✅ |
| **reversible to source replay** | ✅ ⚡ |

### THREADS ARE NOT: ⚡
- suggestions
- prioritizations
- "insights"
- **conceptual summaries**

---

## RENDERING IN UNIVERSE VIEW

### Mode ⚡
> **"Thread Overlay"**

### Visual Styles ⚡
| Thread Type | Style |
|-------------|-------|
| **Factual** | thin straight line |
| **Temporal** | **braided line** ⚡ |
| **Cross-sphere** | **curved orbit arc** ⚡ |

### Interactions ⚡
| Action | Available |
|--------|-----------|
| hover highlight | ✅ |
| **expand constellations** | ✅ ⚡ |
| isolate thread | ✅ |
| **export as PDF or JSON** | ✅ ⚡ |

### NO: ⚡
- auto-highlights
- **attention steering**
- color coding by sentiment

---

## STORAGE MODEL ⚡

```json
{
  "knowledge_threads": [
    {
      "id": "uuid",
      "type": "...",
      "nodes": [...],
      "edges": [...],
      "permissions": {
        "visibility": "owner|team|sphere|public"
      },
      "hash": "sha256"
    }
  ]
}
```

### Permissions Fields ⚡
| Field | Description |
|-------|-------------|
| `permissions.visibility` | **owner/team/sphere/public** ⚡ |

---

**END — PART 1**
