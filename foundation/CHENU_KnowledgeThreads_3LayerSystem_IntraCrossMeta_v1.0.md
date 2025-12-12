# CHE·NU — KNOWLEDGE THREADS (3-LAYER SYSTEM)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / INTELLIGENT-PASSIVE / NON-PERSUASIVE

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS

### Purpose
Represent ALL information inside **ONE sphere** as a woven, queryable, visual thread — showing relationships, not judgments.

### RULE
> **Thread shows structure, NOT importance.**

### Node Types ⚡
| Type | Description |
|------|-------------|
| concept | ✅ |
| task | ✅ |
| document | ✅ |
| meeting | ✅ |
| **agent-insight** | ⚡ |
| **replay-snapshot** | ⚡ |
| **data artifact** | ⚡ |

### Edge Types ⚡
| Type | Description |
|------|-------------|
| `references` | ✅ |
| `derived_from` | ✅ |
| `prerequisite` | **⚡** |
| `updated_by` | **⚡** |
| `supports` | **⚡** |
| `contradicted_by` | **(purely factual)** ⚡ |

### Behavior ⚡
| Rule | Status |
|------|--------|
| **auto-expands ONLY on user request** | ✅ ⚡ |
| **collapses intelligently for clarity** | ✅ ⚡ |
| no ranking | ✅ |
| no suggestion of "should" | ✅ |

### Intra Thread JSON (with version) ⚡

```json
{
  "intra_thread": {
    "sphere": "business|scholar|creative|...",
    "nodes": [
      { "id":"uuid", "type":"concept|task|...", "label":"string" }
    ],
    "edges": [
      { "from":"id", "to":"id", "type":"reference" }
    ],
    "version": 3
  }
}
```

### Visualization Modes ⚡
| Mode | Description |
|------|-------------|
| **line weave** | ⚡ |
| **radial hub** | ⚡ |
| **layered timeline** | ⚡ |
| **cluster mode** | ⚡ |

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS

### Purpose
Represent how different spheres **INFORM each other** without merging them or violating boundaries.

### RULE
> **Cross-thread = CONNECTION, not BLENDING.**

### Cross-Sphere Relation Types ⚡

| Relation | Description |
|----------|-------------|
| **KNOWLEDGE TRANSFER** | Scholar → Business, XR → Creative, Creative → Social ⚡ |
| **ARTIFACT MIGRATION** | Document created in one sphere referenced in another ⚡ |
| **AGENT CONTEXT SHARING** | Agent works on tasks in two spheres with shared metadata ⚡ |
| **DECISION ECHO** | Decision in one sphere influences planning in another ⚡ |

### Cross-Thread JSON (with strength metric) ⚡

```json
{
  "cross_thread": {
    "links": [
      {
        "from_sphere":"scholar",
        "to_sphere":"creative",
        "reason":"concept_reference",
        "artifact":"uuid",
        "strength": 0.42
      }
    ]
  }
}
```

### Cross-Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `reason` | **concept_reference** ⚡ |
| `strength` | **0.0-1.0 neutral similarity metric** ⚡ |

### Visualization Rules ⚡
| Rule | Status |
|------|--------|
| threads never cross into private data | ✅ |
| **threads NEVER infer cause → only structural similarity** | ✅ ⚡ |
| **strength < 0.5 → thin line** | ✅ ⚡ |
| **strength > 0.5 → braided line** | ✅ ⚡ |

### Orbit Rendering (Universe View) ⚡
| Property | Value |
|----------|-------|
| **soft arc between spheres** | ⚡ |
| **fades unless user inspects** | ⚡ |
| **reversible (no auto-expansion)** | ⚡ |

---

## 3) META-KNOWLEDGE THREADS

### Purpose
Link **ideas**, **patterns**, **behaviors**, **timelines**, and **memory** into a high-level cognitive map **WITHOUT producing interpretation.**

### RULE
> **Meta-thread identifies PATTERNS, not MEANING.**

### Meta Component Layers ⚡

| Layer | Description |
|-------|-------------|
| **LAYER 1 — TIME** | Patterns of activity, bursts, silences ⚡ |
| **LAYER 2 — STRUCTURE** | Recurring shapes in intra-threads ⚡ |
| **LAYER 3 — PARTICIPATION** | Which agents or users appear across spheres ⚡ |
| **LAYER 4 — THEMATIC BRIDGES** | Keywords that reappear across contexts ⚡ |

### Meta-Thread JSON (with pattern_type + confidence) ⚡

```json
{
  "meta_thread": {
    "patterns": [
      {
        "id":"uuid",
        "signature":"sha256",
        "spheres":["business","scholar"],
        "pattern_type":"temporal|structural|participation|theme",
        "description":"neutral summary",
        "confidence":0.37
      }
    ]
  }
}
```

### Meta-Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `signature` | **sha256 hash** ⚡ |
| `pattern_type` | **temporal/structural/participation/theme** ⚡ |
| `confidence` | **0.0-1.0 mathematical, NOT interpretive** ⚡ |

### Meta-Thread Safety Guarantees ⚡
| Guarantee | Status |
|-----------|--------|
| No predictions | ✅ |
| No psychological inference | ✅ |
| **No emotional or behavioral modeling** | ✅ ⚡ |
| **No "insight" suggestions** | ✅ ⚡ |
| **Patterns displayed as PURE geometry or timelines** | ✅ ⚡ |

### Visual Forms ⚡
| Form | Description |
|------|-------------|
| **geometric lace diagrams** | ⚡ |
| **pulsating lines for time clusters** | ⚡ |
| **node repetition maps** | ⚡ |
| **cross-sphere lattice overlays** | ⚡ |

---

## WHY THE 3 THREADS WORK TOGETHER

| Thread | Provides |
|--------|----------|
| **INTRA** | Understand context inside a sphere |
| **CROSS** | Understand relationships across spheres |
| **META** | Understand *structural patterns* without narrative |

### Together: ⚡
- **clarity without bias**
- **intelligence without dominance**
- **structure without influence**

---

## UNIFIED KNOWLEDGE THREAD BUNDLE EXPORT ⚡

```json
{
  "knowledge_bundle": {
    "intra_thread": {...},
    "cross_thread": {...},
    "meta_thread": {...},
    "version":"1.0",
    "hash":"sha256"
  }
}
```

---

**END — READY FOR BUILD / XR / 2D**
