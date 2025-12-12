# CHE·NU — KNOWLEDGE THREAD SYSTEM (A + B + C)
**VERSION:** CORE.KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## A) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Link related information, decisions, artifacts, and tasks **WITHIN the same sphere**, forming coherent internal pathways.

### RULE
> **Thread = NEUTRAL CONNECTION. NOT conclusion, NOT assumption, NOT prioritization.**

### 5 Thread Types (Intra) ⚡
| Type | Description |
|------|-------------|
| `fact_link` | ← same data source ⚡ |
| `decision_link` | ← **follows_from** ⚡ |
| `artifact_link` | ← used_in ⚡ |
| `timeline_link` | ← **before/after** ⚡ |
| `context_link` | ← same goal / same team ⚡ |

### Intra-Thread JSON ⚡
```json
{
  "knowledge_thread": {
    "id": "uuid",
    "sphere": "business|scholar|creative|...",
    "nodes": [
      { "id": "uuid", "type": "fact|decision|artifact|task" }
    ],
    "edges": [
      { "from": "id", "to": "id", "type": "fact_link|decision_link|artifact_link" }
    ],
    "scope": "intra",
    "hash": "sha256"
  }
}
```

### Intra-Thread Logic ⚡
| Rule | Status |
|------|--------|
| **nodes sorted by timestamp** | ✅ ⚡ |
| **no estimation or prediction** | ✅ ⚡ |
| **no sentiment** | ✅ ⚡ |
| **no success metrics** | ✅ ⚡ |
| **reversible, inspectable** | ✅ ⚡ |

---

## B) INTER-SPHERE KNOWLEDGE BRIDGES ⚡

### Purpose
Reveal **neutral structural relationships** between spheres WITHOUT blending intentions or thematic bias.

### RULE
> **Bridge = CROSS-SPHERE FACT. not influence, not persuasion.**

### 5 Bridge Types ⚡
| Type | Description |
|------|-------------|
| `shared_artifact` | same document used by 2 spheres ⚡ |
| `shared_decision` | **decision in sphere A affects B** ⚡ |
| `shared_agent_action` | agent involved in both spheres ⚡ |
| `shared_topic` | identical subject ⚡ |
| `chronological_bridge` | **events synchronised** ⚡ |

### Inter-Sphere Bridge JSON ⚡
```json
{
  "knowledge_bridge": {
    "id": "uuid",
    "from_sphere": "business",
    "to_sphere": "creative",
    "links": [
      {
        "type": "shared_artifact",
        "source": "artifact_id",
        "target": "artifact_id"
      }
    ],
    "scope": "inter",
    "explanation": "neutral factual mapping",
    "hash": "sha256"
  }
}
```

### Key Field: `explanation` ⚡ (NOUVEAU!)
> **"neutral factual mapping" — always declares neutrality**

### Routing Rules ⚡
| Rule | Status |
|------|--------|
| **no directional arrows (not "A leads to B")** | ✅ ⚡ |
| **only bi-directional fact links** | ✅ ⚡ |
| **no inference** | ✅ ⚡ |
| **no optimization suggestions** | ✅ ⚡ |

---

## C) META-KNOWLEDGE CONSTELLATIONS ⚡ (NOUVEAU!)

### Purpose
Create **high-level structural maps** of knowledge threads and bridges across ALL spheres, forming constellation-like maps.

### RULE
> **Constellation = STRUCTURE OF STRUCTURES. never meaning, never prediction.**

### 4 Constellation Nodes ⚡
| Node | Description |
|------|-------------|
| `Thread Clusters` | group of threads ⚡ |
| `Bridge Hubs` | **multiple bridges meet** ⚡ |
| `Temporal Arcs` | **time-grouped event clusters** ⚡ |
| `Decision Stars` | **neutral pivot points** ⚡ |

### Constellation JSON ⚡
```json
{
  "knowledge_constellation": {
    "id": "uuid",
    "thread_clusters": ["thread_id_1", "thread_id_7"],
    "bridge_hubs": ["bridge_id_3"],
    "temporal_arcs": [
      { "start": "ts", "end": "ts", "threads": ["id1", "id2"] }
    ],
    "visual_layout": "orbital|tree|graph",
    "scope": "meta",
    "hash": "sha256"
  }
}
```

### Key Field: `visual_layout` ⚡ (NOUVEAU!)
| Layout | Description |
|--------|-------------|
| `orbital` | sphere orbits ⚡ |
| `tree` | hierarchical ⚡ |
| `graph` | network view ⚡ |

### Constellation Visualization (XR & 2D) ⚡
| Element | Style |
|---------|-------|
| **Threads** | fine lines ⚡ |
| **Bridges** | **thicker neutral beams** ⚡ |
| **Clusters** | **soft halos** ⚡ |
| **Color-coding** | **NO emotion, only sphere identity markers** ⚡ |

### Constellation Rules ⚡
| Rule | Status |
|------|--------|
| **read-only** | ✅ ⚡ |
| **explore only, no filtering bias** | ✅ ⚡ |
| **no automated summary** | ✅ ⚡ |
| **no importance ranking** | ✅ ⚡ |
| **user-controlled inspection** | ✅ ⚡ |

---

## UNIFIED KNOWLEDGE THREAD ENGINE ⚡

```json
{
  "kt_engine": {
    "modes": ["intra", "inter", "meta"],
    "validation": "hash_verified",
    "constraints": {
      "no_sentiment": true,
      "no_prediction": true,
      "no_prioritization": true,
      "no_missing_links": true
    }
  }
}
```

---

## WHY A + B + C TOGETHER ⚡

| Section | = |
|---------|---|
| **A** | internal coherence ⚡ |
| **B** | **cross-sphere continuity** ⚡ |
| **C** | **global structural understanding** ⚡ |

### TRI-FORME ⚡
- clarity
- transparency
- **non-manipulative context**

### Aligned with Che-Nu ⚡
> **Knowledge ≠ Direction. Knowledge = Structure.**

---

**END — FREEZE READY**
