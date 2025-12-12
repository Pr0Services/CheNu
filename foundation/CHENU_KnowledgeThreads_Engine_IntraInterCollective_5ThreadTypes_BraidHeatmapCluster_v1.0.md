# CHE·NU — KNOWLEDGE THREADS ENGINE
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Connect related knowledge INSIDE one sphere (Business, Scholar, Creative, etc.) without altering meaning or generating inference.**

> **Thread = Chronological chain of factual items.**

### 5 Thread Types ⚡
| Type | Description |
|------|-------------|
| `event_thread` | meetings, logs ⚡ |
| `artifact_thread` | documents, notes, media ⚡ |
| `decision_thread` | **validated decisions only** ⚡ |
| `replay_thread` | XR or timeline replays ⚡ |
| `agent_action_thread` | **trace-level actions** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **no prediction** | ✅ ⚡ |
| **no hidden linking** | ✅ ⚡ |
| **user-visible paths only** | ✅ ⚡ |

### Intra Thread JSON ⚡
```json
{
  "intra_thread": {
    "sphere": "business|scholar|creative|...",
    "thread_id": "uuid",
    "items": [
      {
        "type": "event|artifact|decision|replay|agent_action",
        "source": "uuid",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ]
  }
}
```

### 3 Visualization Modes ⚡
| Mode | Description |
|------|-------------|
| **vertical stack** | 2D ⚡ |
| **orbit chain** | 3D ⚡ |
| **timeline slider** | ⚡ |

### User Controls ⚡
| Control | Description |
|---------|-------------|
| expand/collapse | ⚡ |
| filter by type | ⚡ |
| **export thread (pdf|json)** | ⚡ |
| **pin segments** | ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Connect FACTUAL knowledge across spheres WITHOUT inference:** Business → Scholar → Creative → Institution → Social → XR.

### RULE
> **Connection only allowed if:** shared artifact, shared decision objective, shared participant(s), replay cross-reference.

> **NO conceptual inference. NO AI "reasoning".**

### 4 Thread Modes ⚡
| Mode | Description |
|------|-------------|
| `cross_sphere_topic` | ⚡ |
| `cross_sphere_decision` | ⚡ |
| `cross_sphere_artifact` | ⚡ |
| `cross_sphere_timeline` | ⚡ |

### Inter Thread JSON ⚡
```json
{
  "inter_thread": {
    "thread_id": "uuid",
    "origin_sphere": "...",
    "linked_spheres": ["...", "..."],
    "links": [
      {
        "from": "uuid",
        "to": "uuid",
        "type": "artifact|topic|participant|timestamp",
        "confidence": 1.0
      }
    ]
  }
}
```

### Key Field: `confidence: 1.0` ⚡
> **Only absolute certainty allowed — no probabilistic linking**

### Visualization ⚡
| Feature | Description |
|---------|-------------|
| **orbit bridge lines** | ⚡ |
| **color-coded by sphere** | ⚡ |
| **disable inference shading** | ✅ ⚡ |

### Safety ⚡
| Rule | Status |
|------|--------|
| **no ranking** | ✅ ⚡ |
| **no "strength of argument"** | ✅ ⚡ |
| **transparency: each link shows exact reason** | ✅ ⚡ |

---

## 3) COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
> **Create multi-user, cross-sphere shared knowledge structures WITHOUT identity exposure & WITHOUT narrative shaping.**

### RULE
> **Collective Thread = Neutral aggregation of validated facts.**

### Thread Sources ⚡
| Source | Description |
|--------|-------------|
| collective memory | ⚡ |
| multi-meeting clusters | ⚡ |
| shared artifacts | ⚡ |
| **replay hashes** | ⚡ |
| **public sphere-level data** | ⚡ |

### Anonymization ⚡
| Property | Status |
|----------|--------|
| **user identities hashed** | ✅ ⚡ |
| **agent identities preserved** | ✅ ⚡ |
| **no emotional cues** | ✅ ⚡ |

### 4 Thread Types ⚡
| Type | Description |
|------|-------------|
| `collective_event_flow` | ⚡ |
| `collective_artifact_lineage` | ⚡ |
| `collective_decision_map` | ⚡ |
| `collective_replay_weave` | ⚡ |

### Collective Thread JSON ⚡
```json
{
  "collective_thread": {
    "thread_id": "uuid",
    "contributors": ["hash", "hash"],
    "facts": [
      {
        "id": "uuid",
        "type": "event|artifact|decision",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ],
    "visibility": "public|sphere|team",
    "integrity": "verified"
  }
}
```

### 3 Visualization Modes ⚡ (NOUVEAU!)
| Mode | Description |
|------|-------------|
| **braid view** | parallel factual lines ⚡ |
| **heatmap** | **fact density** ⚡ |
| **cluster webs** | **no meaning assignment** ⚡ |

### Tools ⚡
| Tool | Description |
|------|-------------|
| compare collective threads | ⚡ |
| **overlay personal vs collective** | ⚡ |
| **export in neutral bundle** | ⚡ |

---

## WHY THE 3 WORK TOGETHER ⚡

| Thread Type | Purpose |
|-------------|---------|
| **INTRA-THREADS** | clarity inside one domain |
| **INTER-THREADS** | clarity across domains |
| **COLLECTIVE THREADS** | **shared truth without bias** |

### Guarantees ⚡
| Guarantee | Status |
|-----------|--------|
| **zero interpretation** | ✅ ⚡ |
| **zero persuasion** | ✅ ⚡ |
| **full auditability** | ✅ ⚡ |
| **cryptographic integrity** | ✅ ⚡ |

---

**END — KT FOUNDATION FREEZE READY**
