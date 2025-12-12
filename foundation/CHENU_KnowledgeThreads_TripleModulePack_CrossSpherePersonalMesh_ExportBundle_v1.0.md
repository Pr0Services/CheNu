# CHE·NU — KNOWLEDGE THREADS (TRIPLE-MODULE PACK)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## OVERVIEW ⚡

> **Knowledge Threads = Neutral connective tissue between:** meetings, spheres, decisions, artifacts, users (optionally), agents (trace only).

### PURPOSE ⚡
> **Reveal STRUCTURE of information, NOT interpretation. NOT persuasion. NOT ranking.**

---

## 1) CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Link FACTUAL elements across different spheres** (Business ↔ Scholar ↔ Creative ↔ Institutional ↔ XR, etc).

### 4 Thread Types ⚡
| Type | Description |
|------|-------------|
| `topic thread` | shared subject ⚡ |
| `artifact thread` | **document reused** ⚡ |
| `timeline thread` | sequenced events ⚡ |
| `decision-impact thread` | **(non-judgmental)** ⚡ |

### Creation Rules ⚡
| Rule | Status |
|------|--------|
| **auto-generated only when FACTS match** | ✅ ⚡ |
| **threads NEVER infer causality** | ✅ ⚡ |
| **no importance sorting** | ✅ ⚡ |
| **no emotional tagging** | ✅ ⚡ |

### Cross-Sphere Thread Node JSON ⚡
```json
{
  "id": "uuid",
  "type": "cross_sphere",
  "spheres": ["business", "scholar"],
  "origin": "meeting|artifact|decision",
  "timestamp": 1712345678,
  "hash": "sha256"
}
```

### View Modes ⚡
| Mode | Description |
|------|-------------|
| **sphere braid view** | ⚡ |
| **timeline-unified mode** | ⚡ |
| **artifact lineage view** | ⚡ |

---

## 2) PERSONAL KNOWLEDGE THREADS ⚡

### Purpose
> **Let EACH USER see their OWN path of ideas, work, meetings, artifacts WITHOUT shaping their identity or predicting behavior.**

### Characteristics ⚡
| Property | Status |
|----------|--------|
| **private view** | ✅ ⚡ |
| **non-ranked** | ✅ ⚡ |
| **strictly chronological or explicit grouping** | ✅ ⚡ |
| **editable by user** | ✅ ⚡ |
| **exportable (pdf/json)** | ✅ ⚡ |

### Personal Thread JSON ⚡
```json
{
  "personal_thread": {
    "owner": "user_id",
    "entries": [
      {
        "id": "uuid",
        "type": "meeting|note|artifact|task",
        "timestamp": "...",
        "sphere": "creative|business|...",
        "metadata": {}
      }
    ],
    "visibility": "private_only"
  }
}
```

### Allowed vs Forbidden ⚡
| Allowed | Forbidden |
|---------|-----------|
| tag entry (neutral label) | **automated clustering if meaning-based** |
| reorder manually | **automated predictions** |
| collapse/expand branches | **behavioral inference** |
| merge threads | |

### Display Modes ⚡
| Mode | Description |
|------|-------------|
| **strand view** | linear ⚡ |
| **branch view** | manual ⚡ |
| **orb view** | **nodes grouped by sphere** ⚡ |

---

## 3) COLLECTIVE KNOWLEDGE THREAD MESH ⚡

### Purpose
> **A global mesh showing how ALL factual knowledge from ALL public/shared sources interconnects. Not personal. Not predictive. Pure structure.**

### Mesh Elements ⚡
| Element | Description |
|---------|-------------|
| `THREAD_NODE` | event, artifact, decision, replay fragment ⚡ |
| `THREAD_EDGE` | shared attributes or references ⚡ |
| `THREAD_CLUSTER` | **sphere grouping** ⚡ |

### Mesh JSON ⚡
```json
{
  "thread_mesh": {
    "nodes": ["..."],
    "edges": ["..."],
    "clusters": [
      { "sphere": "business", "node_ids": ["..."] }
    ],
    "integrity_hash": "sha256"
  }
}
```

### Mesh Generation Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **hash-verified** | ✅ ⚡ |
| **cluster by sphere origin only** | ✅ ⚡ |
| **NO semantic clustering** | ✅ ⚡ |
| **NO weight scoring** | ✅ ⚡ |
| **NO salience inference** | ✅ ⚡ |

### XR Integration ⚡
| Feature | Description |
|---------|-------------|
| threads visualized as floating strands | ⚡ |
| **mesh condensed in orbit view** | ⚡ |
| **pinch to expand cluster** | ⚡ |
| highlight on selection only | ⚡ |

---

## UNIFIED SAFETY RULESET ⚡

| Rule | Status |
|------|--------|
| **stay factual** | ✅ ⚡ |
| **avoid emotional overlays** | ✅ ⚡ |
| **avoid influence pathways** | ✅ ⚡ |
| **remain transparent in origin** | ✅ ⚡ |
| **permit user deletion of personal threads** | ✅ ⚡ |
| **prevent leaking personal content into collective mesh** | ✅ ⚡ |
| **maintain audit trail for all connections** | ✅ ⚡ |

---

## EXPORT FORMATS ⚡ (NOUVEAU!)

### `knowledge_bundle.ktb` ⚡
| File | Description |
|------|-------------|
| `cross-sphere.json` | ⚡ |
| `personal.json` | **(encrypted)** ⚡ |
| `mesh.json` | ⚡ |
| `integrity_map.json` | ⚡ |
| `hashes.txt` | ⚡ |

---

**END — KNOWLEDGE THREADS PACK (FREEZE-READY)**
