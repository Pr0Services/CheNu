# CHE·NU — XR COLLECTIVE MEMORY + PERSONAL NAVIGATION PROFILES
**VERSION:** XR.v1.5  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## C) XR REPLAY → COLLECTIVE MEMORY ⚡

### Purpose
> **Build a SHARED, VERIFIABLE memory layer across meetings, users, agents, and spheres, WITHOUT rewriting history or shaping narratives.**

### RULE
> **Collective Memory = Aggregated FACTS. NOT conclusions, NOT interpretations.**

### Collective Memory Sources ⚡
| Source | Description |
|--------|-------------|
| XR replays (validated) | ⚡ |
| meeting artifacts | notes, boards, files ⚡ |
| decisions logs | **time-stamped** ⚡ |
| agent actions | **trace only** ⚡ |
| **silence intervals** | **non-action** ⚡ |

### 4 Memory Object Types ⚡
| Type | Description |
|------|-------------|
| `MEMORY_EVENT` | who / when / where, action or non-action ⚡ |
| `MEMORY_ARTIFACT` | document / visual / data ⚡ |
| `MEMORY_DECISION` | declared outcome, **no judgment metadata** ⚡ |
| `MEMORY_CONTEXT` | meeting type, sphere, participants ⚡ |

### Collective Memory Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **immutable after validation** | ✅ ⚡ |
| **versioned** | ✅ ⚡ |
| **cryptographically hashed** | ✅ ⚡ |
| **traceable to source replay** | ✅ ⚡ |

### Forbidden ⚡
| NO | Status |
|----|--------|
| **sentiment tags** | ❌ ⚡ |
| **success/failure labels** | ❌ ⚡ |
| **inferred intent** | ❌ ⚡ |

### Collective Memory Graph ⚡
| Nodes | Edges |
|-------|-------|
| meetings | happened_in |
| decisions | referenced_by |
| artifacts | followed_by |
| agents | **shared_with** |
| users (anonymizable) | |

### Collective Memory JSON ⚡
```json
{
  "collective_memory": {
    "entries": [
      {
        "id": "uuid",
        "type": "event|artifact|decision|context",
        "source_replay": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr|...",
        "participants": ["user_id", "agent_id"],
        "hash": "sha256"
      }
    ],
    "integrity": "verified"
  }
}
```

### Access Control ⚡
| Rule | Status |
|------|--------|
| **per-user visibility** | ✅ ⚡ |
| **per-sphere visibility** | ✅ ⚡ |
| **explicit sharing required** | ✅ ⚡ |
| **private memories never surfaced globally** | ✅ ⚡ |

---

## D) UNIVERSE VIEW — PERSONAL NAVIGATION PROFILES ⚡

### Purpose
> **Allow each user to see the SAME universe through a PERSONAL, CONFIGURABLE navigation lens.**

### RULE
> **Profile affects VISUALIZATION ONLY. NEVER changes data or availability.**

### Profile Dimensions ⚡
| Dimension | Description |
|-----------|-------------|
| `density_preference` | minimal → detailed ⚡ |
| `default_orbit` | sphere focus ⚡ |
| `routing_confidence_threshold` | ⚡ |
| `replay_visibility` | ⚡ |
| `agent_presence_level` | ⚡ |
| `visual_complexity` | 2D ↔ 3D ⚡ |

### 4 Profile Modes ⚡
| Mode | Description |
|------|-------------|
| `EXPLORER` | wide view, many links visible, **low filtering** ⚡ |
| `FOCUS` | hide unrelated clusters, **emphasize active threads** ⚡ |
| `REVIEW` | **replay-first**, timelines emphasized ⚡ |
| `ARCHIVE` | **history & memory dominant** ⚡ |

### Personal Profile JSON ⚡
```json
{
  "navigation_profile": {
    "user_id": "uuid",
    "mode": "explorer|focus|review|archive",
    "preferences": {
      "density": 0.4,
      "orbit": "business",
      "routing_threshold": 0.7,
      "visual_mode": "2d|3d",
      "agent_visibility": "low|medium|high"
    },
    "overrides": {
      "session_only": true
    }
  }
}
```

### Profile Application Logic ⚡
| Rule | Status |
|------|--------|
| **applied at render time** | ✅ ⚡ |
| **switchable instantly** | ✅ ⚡ |
| **reversible with no side effects** | ✅ ⚡ |
| **session-scoped or persistent** | ✅ ⚡ |

### Safety & Transparency ⚡
| Rule | Status |
|------|--------|
| **profile effects previewable** | ✅ ⚡ |
| **always show "filtered view" indicator** | ✅ ⚡ |
| **one-click reset to neutral view** | ✅ ⚡ |

---

## WHY C + D TOGETHER ⚡

| Component | = |
|-----------|---|
| **C — Collective Memory** | ensures SHARED TRUTH |
| **D — Personal Navigation** | ensures PERSONAL CLARITY |

### Together ⚡
> **One reality. Many perspectives. Zero manipulation.**

---

**END — FOUNDATION FREEZE**
