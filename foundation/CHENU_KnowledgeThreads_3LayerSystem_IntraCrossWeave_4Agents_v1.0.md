# CHE·NU — KNOWLEDGE THREADS SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FACTUAL LINKING ONLY — NO INTERPRETATION

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Connect related concepts, artifacts, replays, tasks, and decisions within the same sphere.**

### RULE
> **Thread = FACTUAL LINK. NOT inference, NOT prioritization.**

### 4 Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | connects sequential or related events ⚡ |
| `THREAD_ARTIFACT` | documents, outputs, creations ⚡ |
| `THREAD_DECISION` | decisions and their factual context ⚡ |
| `THREAD_AGENT` | **agent contributions** ⚡ |

### Intra-Thread JSON ⚡
```json
{
  "thread": {
    "id": "uuid",
    "sphere": "business|scholar|creative|...",
    "items": [
      { "type": "event|artifact|decision|agent", "ref_id": "uuid" }
    ],
    "links": [
      { "from": "uuid", "to": "uuid", "relation": "follows|uses|references" }
    ],
    "hash": "sha256"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **no ranking** | ✅ ⚡ |
| **no inferred meaning** | ✅ ⚡ |
| **no predictive linking** | ✅ ⚡ |

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Reveal factual relationships between spheres WITHOUT collapsing them into one domain.**

### 5 Cross-Sphere Triggers ⚡
| Trigger | Description |
|---------|-------------|
| shared artifacts | ⚡ |
| shared participants | ⚡ |
| shared goals | ⚡ |
| **shared replay references** | ⚡ |
| **chronological proximity** | ⚡ |

### Cross-Thread JSON ⚡
```json
{
  "cross_thread": {
    "id": "uuid",
    "spheres": ["business", "scholar", "xr"],
    "anchors": [
      { "sphere": "business", "item_id": "uuid" },
      { "sphere": "scholar", "item_id": "uuid" }
    ],
    "links": [
      { "from": "uuid", "to": "uuid", "type": "cross_reference" }
    ],
    "visibility": "opt_in_only"
  }
}
```

### Key Field: `visibility: "opt_in_only"` ⚡
> **User must explicitly activate**

### Universe View Visualization ⚡
| Rule | Description |
|------|-------------|
| **cross threads appear as soft inter-orbit lines** | ⚡ |
| **user must activate cross-thread mode** | ⚡ |
| **no automatic highlighting** | ✅ ⚡ |

---

## 3) COLLECTIVE KNOWLEDGE WEAVE ⚡

### Purpose
> **A unified mesh of all knowledge threads, representing collective memory without narrative.**

### RULE
> **Weave = STRUCTURE. NOT story, NOT interpretation.**

### 4 Weave Components ⚡
| Component | Description |
|-----------|-------------|
| `WEAVE_NODE` | any artifact/event/decision across spheres ⚡ |
| `WEAVE_EDGE` | thread link (intra or cross) ⚡ |
| `WEAVE_CLUSTER` | **passive grouping (no meaning assignment)** ⚡ |
| `WEAVE_TIMELINE` | **factual chronological order only** ⚡ |

### Weave JSON ⚡
```json
{
  "knowledge_weave": {
    "nodes": ["..."],
    "edges": ["..."],
    "clusters": [
      { "sphere": "scholar", "node_ids": ["..."] }
    ],
    "timeline": [
      { "t": 1712345678, "node_id": "uuid" }
    ],
    "integrity": "verified"
  }
}
```

### Weave Safety & Ethics ⚡
| NO | YES |
|----|-----|
| clustering by importance | **factual adjacency** |
| ranking nodes/threads | **user-defined filters** |
| sentiment | **transparent origin** |
| influence scoring | **cryptographic integrity** |
| predictive meaning | |

---

## 4 AGENTS INVOLVED ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | builds thread links, **never interprets** ⚡ |
| `AGENT_WEAVE_INDEXER` | builds global structure, **append-only** ⚡ |
| `AGENT_WEAVE_EXPLAINER` | explains WHY nodes are linked, **no suggestion of meaning** ⚡ |
| `AGENT_VISUAL_LAYER` | renders lines/clusters/orbits, **no UI emphasis on "importance"** ⚡ |

---

## WHY THE THREE-LAYER SYSTEM WORKS ⚡

| Layer | = |
|-------|---|
| **LAYER 1** | Intra-sphere clarity |
| **LAYER 2** | Cross-sphere bridges |
| **LAYER 3** | **Collective weave** |

### Résultat ⚡
> **Unifie sans manipuler. Connecte sans influencer. Montre sans interpréter.**

---

**END — FREEZE READY**
