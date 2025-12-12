# CHE·NU — KNOWLEDGE THREADS (3-PACK: DIFF + TEMPORAL)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## 1) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Reveal RELATIONSHIPS between information across spheres **WITHOUT interpretation, scoring, or emotional weighting.**

### RULE
> **Threads connect DATA → NOT meaning.**

### Thread Types
| Type | Description |
|------|-------------|
| `THREAD_TOPIC` | Connects items sharing subject, keyword, domain |
| `THREAD_ARTIFACT` | Connects docs, replays, notes with shared origin |
| `THREAD_DECISION` | Connects decisions across meetings/spheres |
| `THREAD_AGENT` | Links where same agent participated |

### JSON Model

```json
{
  "inter_sphere_thread": {
    "id": "uuid",
    "type": "topic|artifact|decision|agent",
    "nodes": ["memory_id_1", "memory_id_2"],
    "spheres": ["business","scholar","creative"],
    "metadata": {
      "shared_terms": ["string"],
      "cross_links": 4
    },
    "read_only": true
  }
}
```

### Visualization Rules
| Rule | Value |
|------|-------|
| Line style | thin soft lines (no brightness) |
| Color | by sphere |
| Highlight | **no automatic highlight** |
| Access | **user must explicitly open threads** |

---

## 2) PERSONAL ↔ COLLECTIVE KNOWLEDGE THREAD DIFF ⚡ UNIQUE

### Purpose
Show where a user's personal memory diverges or overlaps with collective memory — **WITHOUT emotional framing.**

### RULE
> **Diff = MAP, not evaluation.**

### Diff Categories ⚡
| Category | Description |
|----------|-------------|
| `OVERLAP` | User memory exists in collective |
| `UNIQUE_PERSONAL` | User has personal notes not in collective |
| `UNIQUE_COLLECTIVE` | Collective contains items not seen by user |
| `INCOMPLETE` | User memory partial vs full collective |

### JSON Model (knowledge_diff) ⚡

```json
{
  "knowledge_diff": {
    "user_id": "uuid",
    "overlap": ["memory_id"],
    "unique_personal": ["memory_id"],
    "unique_collective": ["memory_id"],
    "incomplete": [
      { "collective": "id", "user_version": "id" }
    ],
    "hash": "sha256"
  }
}
```

### Diff Visualization ⚡
| Zone | Color |
|------|-------|
| **overlap** | soft green |
| **personal-only** | blue |
| **collective-only** | grey |

### Visualization Rules
| Rule | Status |
|------|--------|
| no arrows | ✅ |
| no importance gradients | ✅ |
| **no "missing" or "should have known" indicators** | ✅ ⚡ |

### User Controls
| Action | Description |
|--------|-------------|
| toggle categories | Show/hide diff types |
| request context for missing links | Explain gaps |
| export diff snapshot | Save state |
| delete personal entries | User control |

---

## 3) TEMPORAL KNOWLEDGE THREADS ⚡

### Purpose
Display HOW knowledge evolves over time **without implying improvement or decline.**

### RULE
> **Time = SEQUENCE, not progress.**

### Time Thread Types (4) ⚡
| Type | Description |
|------|-------------|
| `TIME_EVENT_CHAIN` | Sequence of related events across replays |
| `TIME_DECISION_CHAIN` | Same decision evolving through meetings |
| `TIME_ARTIFACT_EVOLUTION` | Document versions across time |
| `TIME_AGENT_CHAIN` | Agent involvement across timeline |

### JSON Model (with artifact_change + sequence_lock) ⚡

```json
{
  "temporal_thread": {
    "id": "uuid",
    "origin": "memory_id",
    "timeline": [
      {
        "t": 1712345678,
        "memory_id": "uuid",
        "sphere": "scholar",
        "artifact_change": "minor|major|none"
      }
    ],
    "sequence_lock": true
  }
}
```

### New Fields ⚡
| Field | Description |
|-------|-------------|
| `artifact_change` | minor / major / none |
| `sequence_lock` | Lock order (true/false) |

### Visualization
| Property | Value |
|----------|-------|
| Layout | horizontal or radial timeline |
| Spacing | by time intervals |
| Trends | **no trend representations** ⚡ |
| Performance | **no performance indicators** ⚡ |
| Direction | **no positive/negative directionality** ⚡ |

### Temporal Controls ⚡
| Action | Description |
|--------|-------------|
| scrub timeline | Navigate time |
| collapse minor nodes | Simplify view |
| expand branches | Show detail |
| compare two time threads | Side-by-side |
| export time-thread snapshot | Save state |

---

## WHY THESE 3 THREAD SYSTEMS MATTER

| Thread System | Reveals |
|---------------|---------|
| **Inter-Sphere Threads** | relationships |
| **Personal ↔ Collective Diff** | visibility |
| **Temporal Threads** | evolution |

### Together
- **clarity without influence**
- **structure without judgment**
- **truth without narrative**
- **insight without steering**

---

**END — FREEZE READY**
