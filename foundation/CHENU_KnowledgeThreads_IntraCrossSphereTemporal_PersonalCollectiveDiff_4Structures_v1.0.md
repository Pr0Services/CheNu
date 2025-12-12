# CHE·NU — KNOWLEDGE THREADS v1.0
**TYPE:** FOUNDATION / NON-MANIPULATIVE / TRACE-ONLY

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Connect related insights, artifacts, decisions, events INSIDE a single sphere without altering meaning.**

### RULE
> **Thread = LINKED FACTS, NOT interpretation.**

### Thread Structure JSON ⚡
```json
{
  "THREAD_INTRA": {
    "id": "uuid",
    "sphere": "business|scholar|creative|...",
    "nodes": ["artifact|event|decision|replay_segment"],
    "links": [
      { "from": "id", "to": "id", "reason": "topic|actor|timestamp" }
    ],
    "hash": "sha256",
    "immutable": true
  }
}
```

### What Gets Threaded ⚡
| Content | Description |
|---------|-------------|
| repeated topics | ⚡ |
| **recurring patterns of artifacts** | ⚡ |
| sequences of related decisions | ⚡ |
| agent contributions | ⚡ |
| **user-created notes** | ⚡ |

### 3 Display Modes ⚡
| Mode | Description |
|------|-------------|
| `list_view` | compact ⚡ |
| `graph_view` | local cluster ⚡ |
| `XR strand_view` | **floating line segments** ⚡ |

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Reveal FACTUAL interdependencies between spheres without implying causality or priority.**

### RULE
> **Cross-sphere = horizontal mapping → NOT hierarchy.**

### Thread Structure JSON ⚡
```json
{
  "THREAD_CROSS": {
    "id": "uuid",
    "spheres": ["business", "creative", "scholar"],
    "nodes": ["..."],
    "cross_links": [
      { "from": "id", "to": "id", "link_type": "topic|artifact|stakeholder" }
    ],
    "visibility": "limited|expanded|private",
    "hash": "sha256"
  }
}
```

### Examples ⚡
| From | To | Link |
|------|----|------|
| Creative design artifact | Business pitch | **informs** ⚡ |
| Scholar research note | Institution policy | **informs** ⚡ |
| Social post | Creative/Business feedback threads | **triggers** ⚡ |

### Forbidden ⚡
| NO | Status |
|----|--------|
| **influence scoring** | ❌ ⚡ |
| **priority ranking** | ❌ ⚡ |
| **predictive linking** | ❌ ⚡ |

### Cross-Sphere Safety ⚡
| Rule | Status |
|------|--------|
| **explicit user consent** | ✅ ⚡ |
| **per-thread visibility** | ✅ ⚡ |
| **per-sphere permissions** | ✅ ⚡ |
| **no semantic inference** | ✅ ⚡ |

---

## 3) TEMPORAL KNOWLEDGE THREADS ⚡

### Purpose
> **Organize knowledge through TIME — not logic — to show progression, recurrence, or branching.**

### RULE
> **Temporal ≠ storytelling. Temporal = timestamped alignment only.**

### Thread Structure JSON ⚡
```json
{
  "THREAD_TIME": {
    "id": "uuid",
    "timeline": [
      { "t": 1712345001, "node": "id_1" },
      { "t": 1712345202, "node": "id_2" },
      { "t": 1712345301, "node": "id_3" }
    ],
    "branch_points": ["id_2", "id_9"],
    "merge_points": [],
    "hash": "sha256"
  }
}
```

### 4 Temporal Modes ⚡
| Mode | Description |
|------|-------------|
| `linear timeline` | ⚡ |
| `braided timeline` | **multiple threads visible** ⚡ |
| `branch-only view` | ⚡ |
| `origin view` | **node backtracking** ⚡ |

### Temporal Rules ⚡
| Rule | Status |
|------|--------|
| **no prediction** | ✅ ⚡ |
| **no compression or storytelling** | ✅ ⚡ |
| **no emotional markers** | ✅ ⚡ |
| **exact timestamp fidelity** | ✅ ⚡ |

---

## 4) COLLECTIVE vs PERSONAL KNOWLEDGE THREADS ⚡

### Purpose
> **Allow users to maintain PERSONAL threads while also accessing COLLECTIVE threads built from validated data.**

### RULE
> **Personal threads NEVER merge automatically into collective.**

### Personal Thread JSON ⚡
```json
{
  "THREAD_PERSONAL": {
    "id": "uuid",
    "nodes": [],
    "notes": [],
    "visibility": "private",
    "merge_request": false
  }
}
```

### User May ⚡
| Action | Description |
|--------|-------------|
| annotate nodes | ⚡ |
| **create private branches** | ⚡ |
| cluster insights | ⚡ |
| **export personal map** | ⚡ |

### Collective Thread JSON ⚡
```json
{
  "THREAD_COLLECTIVE": {
    "id": "uuid",
    "validated_nodes": [],
    "cross_sphere_nodes": [],
    "jurisdiction": "sphere-based",
    "immutable": true
  }
}
```

### DIFF MODEL (Personal vs Collective) ⚡ (NOUVEAU!)
```json
{
  "THREAD_DIFF": {
    "personal_only": ["..."],
    "collective_only": ["..."],
    "shared": ["..."],
    "conflicts": [
      { "node": "id", "reason": "divergence" }
    ]
  }
}
```

### Key Feature: `conflicts` ⚡
> **Shows where personal and collective views diverge**

---

**END — KNOWLEDGE THREADS v1.0**
