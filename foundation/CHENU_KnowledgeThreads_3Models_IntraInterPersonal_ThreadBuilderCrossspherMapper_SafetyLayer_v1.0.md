# CHE·NU — KNOWLEDGE THREAD SYSTEM (3-MODELS)
**VERSION:** KNT.v1.0  
**MODE:** FOUNDATION / NON-INTERPRETATIVE / FREEZE-READY

---

## PURPOSE ⚡

> **Provide structured, traceable chains of knowledge WITHOUT rewriting, summarizing with bias, or generating "meaning".**

> **Knowledge Threads = relational scaffolds built from validated data + replay memory, NOT conclusions.**

---

## GLOBAL RULES ⚡

| Rule | Status |
|------|--------|
| **Threads are ALWAYS reversible** | ✅ ⚡ |
| **No inferential leaps** | ✅ ⚡ |
| **No predictive judgments** | ✅ ⚡ |
| **No emotional labeling** | ✅ ⚡ |
| **No hidden prioritization** | ✅ ⚡ |
| **All links are explicitly sourced** | ✅ ⚡ |
| **Every node in a thread corresponds to a FACT** | ✅ ⚡ |

---

## 1) INTRA-SPHERE KNOWLEDGE THREAD ⚡

### Definition
> **Knowledge chain built STRICTLY within a single sphere** (Business, Scholar, Creative, Institution, Social, XR…).

### Use-case ⚡
- follow development of a topic over time
- trace evolution of documents
- **map decisions and artifacts inside one sphere**

### Allowed vs Forbidden Links ⚡
| Allowed | Forbidden |
|---------|-----------|
| event → event | **cross-sphere inference** |
| artifact → decision | **emotional or strategic tags** |
| replay → memory_entry | |
| timeline → updated timeline | |

### Intra-Sphere Thread JSON ⚡
```json
{
  "thread_intra": {
    "sphere": "business|scholar|creative|institution|social|xr",
    "nodes": [
      {
        "id": "uuid",
        "type": "event|artifact|decision|memory",
        "timestamp": "...",
        "source": "replay|document|note"
      }
    ],
    "edges": [
      { "from": "node_id", "to": "node_id", "reason": "continued_by|updated_from|referenced_by" }
    ],
    "integrity": "verified"
  }
}
```

### UI Rendering (2D & XR) ⚡
| Feature | Description |
|---------|-------------|
| vertical timeline | ⚡ |
| **node grouping by decision cluster** | ⚡ |
| filter: events / documents / replays | ⚡ |
| **"Show Only Verified Nodes" toggle** | ⚡ |

### Agent: `AGENT_THREAD_BUILDER` ⚡
| Role | Description |
|------|-------------|
| assembles threads using only validated data | ⚡ |
| **never interprets** | ✅ ⚡ |
| **no ranking or weighting** | ✅ ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREAD ⚡

### Definition
> **Connects related knowledge across different spheres WITHOUT merging logic or implying causality.**

### Use-case ⚡
| From | To | Link |
|------|----|------|
| Scholar research | Business decisions | ⚡ |
| Social data | Institution policies | ⚡ |
| Creative outputs | **XR meetings** | ⚡ |

### RULE
> **Cross-sphere = correlation, not interpretation.**

### Allowed vs Forbidden ⚡
| Allowed | Forbidden |
|---------|-----------|
| artifact A references artifact B | **implicit causality** |
| event sourced from replay | **importance scoring** |
| shared participants or agents | **predictive linking** |
| temporal adjacency | |

### Inter-Sphere Thread JSON ⚡
```json
{
  "thread_inter": {
    "spheres": ["business", "scholar", "creative", "institution"],
    "nodes": ["..."],
    "edges": [
      {
        "from": "node_id",
        "to": "node_id",
        "reason": "shared_topic|shared_artifact|participant_overlap|time_adjacent"
      }
    ],
    "integrity": "verified",
    "visibility": "per-user|per-sphere"
  }
}
```

### UI Rendering ⚡
| Feature | Description |
|---------|-------------|
| **orbit-based map (spheres as planets)** | ⚡ |
| **threads crossing orbits** | ⚡ |
| filter by sphere / topic / person | ⚡ |
| **XR mode: 3D arc links between spheres** | ⚡ |

### Agent: `AGENT_CROSSSPHERE_MAPPER` ⚡
| Role | Description |
|------|-------------|
| builds correlation maps | ⚡ |
| **ensures "no inference" compliance** | ✅ ⚡ |
| **requests permission before showing cross-domain threads** | ✅ ⚡ |

---

## 3) PERSONAL KNOWLEDGE THREAD ⚡

### Definition
> **User-specific chain reflecting the user's sessions, decisions, replays, documents, and experiences.**

### Purpose
> **Self-reflection + structural memory, not analytics.**

### Rules ⚡
| Rule | Status |
|------|--------|
| **Only the user sees it** | ✅ ⚡ |
| **No emotional inference** | ✅ ⚡ |
| **No habit prediction** | ✅ ⚡ |
| **No prioritization** | ✅ ⚡ |

### Allowed vs Forbidden ⚡
| Allowed | Forbidden |
|---------|-----------|
| meetings the user attended | **behavioral modeling** |
| documents the user created | **performance curves** |
| replays the user viewed | **influence scoring** |
| decisions the user participated in | |
| timeline merges across sessions | |

### Personal Thread JSON ⚡
```json
{
  "thread_personal": {
    "user_id": "uuid",
    "nodes": [
      { "id": "...", "type": "meeting|artifact|decision|memory|replay_view" }
    ],
    "edges": [
      { "from": "id", "to": "id", "reason": "chronology|reference|reviewed|followed_up" }
    ],
    "privacy": "sealed",
    "export": ["pdf", "json"]
  }
}
```

### Key Field: `privacy: "sealed"` ⚡
> **Maximum protection — user-only access**

### UI Rendering ⚡
| Mode | Description |
|------|-------------|
| **"Session Thread"** | today ⚡ |
| **"Long Thread"** | all-time ⚡ |
| **"Context Thread"** | specific topic ⚡ |

### XR Mode ⚡
| Feature | Description |
|---------|-------------|
| **personal orbit (only visible to user)** | ⚡ |
| **silent timeline review mode** | ⚡ |

### Agent: `AGENT_PERSONAL_THREAD_HELPER` ⚡
| Role | Description |
|------|-------------|
| maintains chronology only | ⚡ |
| **zero interpretation** | ✅ ⚡ |
| **zero suggestions** | ✅ ⚡ |
| **zero routing** | ✅ ⚡ |

---

## SHARED SAFETY LAYER (ALL THREADS) ⚡

| Rule | Status |
|------|--------|
| **Each node references EXACT source (hash)** | ✅ ⚡ |
| **Each edge contains EXPLICIT reason** | ✅ ⚡ |
| **All thread generation is logged** | ✅ ⚡ |
| **Users can hide or collapse segments** | ✅ ⚡ |
| **Threads never modify data, only map it** | ✅ ⚡ |
| **Export requires explicit permission** | ✅ ⚡ |

---

**END — KNOWLEDGE THREAD SYSTEM**
