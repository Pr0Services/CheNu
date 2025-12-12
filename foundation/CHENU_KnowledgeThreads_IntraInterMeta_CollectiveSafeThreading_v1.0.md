# CHE·NU — KNOWLEDGE THREAD SYSTEM
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-PERSUASIVE / FREEZE-READY

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS

### Purpose
Link related information **WITHIN a single sphere** (Business, Scholar, Creative, Institution, etc.) to help organization — **NOT interpretation.**

### RULE
> **Thread = neutral connection. NOT conclusion, NOT summary.**

### Thread Sources ⚡
- meeting notes
- decisions logs
- artifacts (files, boards, charts)
- **XR replay events** ⚡
- **agent commentary (executable, not persuasive)** ⚡
- timeline markers

### Thread Properties JSON ⚡

```json
{
  "THREAD_INTRA": {
    "id": "uuid",
    "sphere": "business|scholar|creative|...",
    "node_source": "artifact|event|decision|task",
    "nodes": [...],
    "relations": [
      {"from": "...", "to": "...", "type": "sequence|reference|dependency|variant"}
    ],
    "timestamp": "unix",
    "hash": "sha256"
  }
}
```

### Intra Fields ⚡
| Field | Description |
|-------|-------------|
| `node_source` | **artifact/event/decision/task** ⚡ |
| `relations[].type` | **sequence/reference/dependency/variant** ⚡ |

### Visualization ⚡
| Property | Value |
|----------|-------|
| single-sphere color palette | ✅ |
| **linear, circular, or cluster layout** | ⚡ |
| **structural glyphs ONLY (no emojis, no emotional cues)** | ⚡ |
| **"neutral fade" for low-relevance nodes** | ⚡ |

### Safety ⚡
| Forbidden | Status |
|-----------|--------|
| **no automated prioritization** | ❌ ⚡ |
| **no "importance score"** | ❌ ⚡ |
| **no behavioral inference** | ❌ ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Link information **ACROSS spheres** (e.g., Business ↔ Scholar, Creative ↔ XR), **ONLY when explicitly connected** by user or agent signal.

### RULE
> **Cross-sphere ≠ stronger. Cross-sphere = wider context, not higher importance.**

### Cross-Sphere Link Types ⚡
| Type | Description |
|------|-------------|
| shared topic | ✅ |
| shared participants | ✅ |
| shared artifacts | ✅ |
| **shared objectives** | ⚡ |
| **sequential dependency** | ⚡ |
| **complementary work** | ⚡ |

### Thread Inter JSON (with anchors + reasons) ⚡

```json
{
  "THREAD_INTER": {
    "id": "uuid",
    "spheres": ["business","social","creative"],
    "anchors": [
      {"sphere":"business", "item":"meeting_id"},
      {"sphere":"creative", "item":"artifact_id"},
      {"sphere":"xr", "item":"replay_id"}
    ],
    "relations": [
      {"from":"business:itemA", "to":"creative:itemX", "reason":"topic"},
      {"from":"creative:itemX", "to":"xr:itemR", "reason":"timeline"}
    ],
    "hash": "sha256"
  }
}
```

### Inter Fields ⚡
| Field | Description |
|-------|-------------|
| `anchors` | **Array of {sphere, item}** ⚡ |
| `relations[].reason` | **topic/timeline/etc.** ⚡ |

### Visualization (Universe View) ⚡
| Property | Value |
|----------|-------|
| **thread spans orbit clusters** | ⚡ |
| **thin lines (neutral)** | ⚡ |
| hover to reveal nodes | ✅ |
| **no auto-highlighting** | ⚡ |
| **no routing influence** | ⚡ |

### Safety ⚡
| Rule | Status |
|------|--------|
| **cross-sphere linking requires EXPLICIT trigger** | ✅ ⚡ |
| **no accidental semantic inference** | ✅ ⚡ |
| **neutral color (grey/orange blend)** | ⚡ |
| **clear SOURCES ALWAYS visible** | ✅ ⚡ |

---

## 3) META-THREADS (COLLECTIVE SAFE THREADING) ⚡

### Purpose
Create a higher-order, **NON-INTERPRETIVE structure** that spans: multiple users, multiple teams, multiple time periods, multiple spheres

### RULE
> **Meta-Thread = STRUCTURE ONLY. ABSOLUTELY NO NARRATIVE SUGGESTION.**

### Meta-Thread Sources ⚡

**ONLY:**
- validated replays
- validated artifacts
- validated decisions
- **immutable memory entries** ⚡

**NO:**
| Forbidden | Status |
|-----------|--------|
| user emotion | ❌ |
| user preference | ❌ |
| **agent speculation** | ❌ ⚡ |

### Meta-Thread JSON (with scope + structure) ⚡

```json
{
  "META_THREAD": {
    "id": "uuid",
    "scope": "multi-user|multi-team|multi-era",
    "anchors": [...],
    "structure": {
      "clusters": [...],
      "transitions": [...],
      "recurrence": [...]
    },
    "metadata": {
      "version": 1,
      "integrity_hash": "sha256",
      "origin_proofs": [...]
    }
  }
}
```

### Meta-Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `scope` | **multi-user/multi-team/multi-era** ⚡ |
| `structure.recurrence` | **Array of recurring patterns** ⚡ |
| `metadata.origin_proofs` | **Array of proof references** ⚡ |

### Meta-Thread Functions ⚡
| Function | Description |
|----------|-------------|
| **recurrence detection** | events repeating ⚡ |
| **structural symmetry** | patterns, not meanings ⚡ |
| **long-term task lineage** | ⚡ |
| **persistent knowledge retention** | ⚡ |

### Visualization (Meta-Layer in Universe View) ⚡
| Property | Value |
|----------|-------|
| **rendered ABOVE spheres** | ⚡ |
| **braided timeline arcs** | ⚡ |
| **"structural resonance" glyphs (non-emotive)** | ⚡ |
| **zoom required to reveal details** | ⚡ |

### Safety / Ethics ⚡
| Constraint | Status |
|------------|--------|
| **no predictive analytics** | ❌ ⚡ |
| **no behavioral modelling** | ❌ ⚡ |
| **no normative labeling** | ❌ ⚡ |
| no suggestions | ❌ |
| **meta-layer is READ-ONLY** | ✅ ⚡ |

---

## KNOWLEDGE THREAD EXPORT FORMATS ⚡

### Thread Bundle JSON ⚡

```json
{
  "thread_bundle": {
    "intra": [...],
    "inter": [...],
    "meta": [...],
    "version": "1.0",
    "hash": "sha256"
  }
}
```

### Export Options ⚡
| Format | Description |
|--------|-------------|
| PDF summary | ⚡ |
| JSON structural graph | ⚡ |
| **XR-thread-visualization bundle** | ⚡ |

---

**END — KNOWLEDGE THREAD SYSTEM v1.0**
