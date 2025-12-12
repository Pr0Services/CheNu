# CHE·NU — KNOWLEDGE THREAD SYSTEM (3 TIERS COMPLETE)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## TIER 1 — INTRA-SPHERE KNOWLEDGE THREADS

### Purpose
Connect factual knowledge inside **ONE sphere** without injecting interpretations.

### RULE
> **Thread = sequence of related facts.**

### Thread Types ⚡

| Type | Description | Example |
|------|-------------|---------|
| `FACT_CHAIN` | chronological or logical sequence | Business → Deal flow → Contract updates |
| `RESOURCE_MAP` | links documents, artifacts, decisions | Docs → Artifacts → Decisions |
| `SESSION_CONTINUITY` | maps how one meeting leads to the next | Meeting A → Meeting B |

### Thread JSON (Tier 1)

```json
{
  "knowledge_thread": {
    "tier": 1,
    "sphere": "business|scholar|creative|xr|...",
    "nodes": [
      { "id":"uuid", "type":"fact|artifact|event|decision", "timestamp": 17123 }
    ],
    "links": [
      { "from":"uuid", "to":"uuid", "relation":"follows|references|derives" }
    ],
    "hash": "sha256"
  }
}
```

### Node Types ⚡
| Type | Description |
|------|-------------|
| `fact` | Factual node |
| `artifact` | Artifact node |
| `event` | Event node |
| `decision` | Decision node |

### Link Relations (Tier 1) ⚡
| Relation | Description |
|----------|-------------|
| `follows` | Sequence |
| `references` | Reference |
| `derives` | Derivation |

### Safe Operations
| Operation | Allowed |
|-----------|---------|
| create thread | ✅ |
| extend thread | ✅ |
| merge threads | ✅ |
| visualize thread | ✅ |

### Forbidden Operations ⚡
| Operation | Status |
|-----------|--------|
| predicting outcomes | ❌ |
| inferring intentions | ❌ |
| ranking importance | ❌ |

---

## TIER 2 — CROSS-SPHERE KNOWLEDGE THREADS

### Purpose
Reveal **neutral connections across multiple spheres** (Business ↔ Scholar ↔ Institution ↔ Social ↔ XR...)

### RULE
> **Cross-sphere = MATCHING FACTS ONLY.**

### Relation Types ⚡

| Type | Description |
|------|-------------|
| `SHARED_ARTIFACT` | same file used in two spheres |
| `TOPIC_OVERLAP` | same theme across contexts |
| `SEQUENTIAL_DEPENDENCY` | event in Sphere A triggers event in Sphere B |
| `INFORMATION_MIGRATION` | data referenced across spheres |

### Cross-Sphere Thread JSON (Tier 2) ⚡

```json
{
  "knowledge_thread": {
    "tier": 2,
    "spheres": ["business","scholar","institution"],
    "nodes": [...],
    "links": [
      { "from":"x", "to":"y", "relation":"topic_overlap" },
      { "from":"y", "to":"z", "relation":"information_migration" }
    ],
    "visual_cluster": "multi-sphere_orbit",
    "hash": "sha256"
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `spheres` | Array of multiple spheres |
| `visual_cluster` | `"multi-sphere_orbit"` |

### UI Rendering Rules
| Rule | Description |
|------|-------------|
| multi-color nodes | by sphere |
| inter-sphere links | soft braided lines |
| user isolation | can isolate 1 → N spheres |
| no auto-highlighting | "important" links never highlighted |

---

## TIER 3 — META-THREADS (SYSTEM INSIGHT) ⚡

### Purpose
Provide a **structurally accurate overview** across time, spheres, and meetings — **WITHOUT storytelling.**

### Definition
> **Meta-thread = HIGH-LEVEL KNOWLEDGE GRAPH.**

### Meta-Thread Dimensions ⚡

| Dimension | Description |
|-----------|-------------|
| **DIM 1 — TIME** | rising or decreasing activity, event frequency |
| **DIM 2 — SPHERE BALANCE** | proportion of events per sphere |
| **DIM 3 — PARTICIPANT FLOW** | how users/agents move across spheres |
| **DIM 4 — ARTIFACT LIFECYCLE** | creation → update → archive → reference |
| **DIM 5 — REPLAY DENSITY** | replay use frequency, timeline intersections |

### Meta-Thread JSON (Tier 3) ⚡

```json
{
  "knowledge_thread": {
    "tier": 3,
    "dimensions": {
      "time": {...},
      "sphere_balance": {...},
      "participant_flow": {...},
      "artifact_lifecycle": {...}
    },
    "global_links": [
      { "from":"uuid", "to":"uuid", "relation":"system_intersection" }
    ],
    "hash": "sha256"
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `tier: 3` | Meta-thread tier |
| `dimensions` | Object with 5 dimensions |
| `global_links` | System-level links |
| `relation: system_intersection` | New relation type |

### Meta Safety Rules ⚡
| Rule | Status |
|------|--------|
| no predictions | ✅ |
| no recommendations | ✅ |
| no behavioral modeling | ✅ |
| no "insight summaries" | ✅ |
| show only structure | ✅ |

---

## RENDERING MODES ⚡

| Mode | Description |
|------|-------------|
| **MODE 1 — SYSTEM CONSTELLATION VIEW** | meta-thread = galaxy of connections |
| **MODE 2 — TIMELINE BRAID** | multi-sphere events woven across time |
| **MODE 3 — NODE PRESSURE MAP** | frequency-based color intensity |

---

## AGENTS INVOLVED ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | builds raw graph, **never interprets** |
| `AGENT_THREAD_VALIDATOR` | ensures compliance with safety/law |
| `AGENT_THREAD_RENDERER` | outputs 2D/3D visualizations |

---

## TIER SUMMARY

| Tier | Scope | Purpose |
|------|-------|---------|
| **Tier 1** | INTRA-SPHERE | Facts within ONE sphere |
| **Tier 2** | CROSS-SPHERE | Facts across MULTIPLE spheres |
| **Tier 3** | META | System-level overview |

---

**END — KNOWLEDGE THREAD SYSTEM (3 TIERS)**
