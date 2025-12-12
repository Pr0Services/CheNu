# CHE·NU — KNOWLEDGE THREADS SYSTEM (TIER 1–3)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-PERSUASIVE / BUILD-READY

---

## TIER 1 — INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Link concepts, meetings, artifacts and decisions **ACROSS spheres** (Business ↔ Scholar ↔ XR…) **WITHOUT merging them or altering meaning.**

### RULE
> **Thread = CONNECTION, not INTERPRETATION.**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_CONCEPT` | shared topics, recurring themes, **terminology alignment** ⚡ |
| `THREAD_ARTIFACT` | documents referenced by multiple spheres, visual assets reused, **data cross-application** ⚡ |
| `THREAD_DECISION` | decisions touching multiple spheres, **ripple-effect awareness (neutral)** ⚡ |
| `THREAD_AGENT` | **same agent involved across domains** ⚡ |

### Thread Properties ⚡
| Property | Description |
|----------|-------------|
| `sphere_from` | ⚡ |
| `sphere_to` | ⚡ |
| `weight` | **(0–1, neutral)** ⚡ |
| `direction` | **uni / bi** ⚡ |
| `immutable origin` | ⚡ |
| `hash_verified` | ⚡ |

### Inter-Sphere Thread JSON ⚡

```json
{
  "knowledge_thread": {
    "type": "concept|artifact|decision|agent",
    "from_sphere": "business",
    "to_sphere": "scholar",
    "origin": "artifact_id|replay_id",
    "weight": 0.42,
    "timestamp": 1712345678,
    "hash": "sha256",
    "note": "neutral descriptor only"
  }
}
```

### Inter Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **concept/artifact/decision/agent** ⚡ |
| `origin` | **artifact_id or replay_id** ⚡ |
| `note` | **"neutral descriptor only"** ⚡ |

### Display (Universe View) ⚡
- soft lines between sphere orbits
- **zero motion** ⚡
- **never highlight "importance"** ⚡
- **user must expand manually** ⚡

---

## TIER 2 — TEMPORAL KNOWLEDGE THREADS ⚡

### Purpose
Link knowledge **THROUGH TIME** (past → present → possible futures) **WITHOUT prediction or persuasion.**

### RULE
> **Timeline = reference, not forecast.**

### Temporal Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_RETROSPECTIVE` | traces evolution of one topic across months/years, **links past meetings & artifacts** ⚡ |
| `THREAD_CONTINUITY` | shows long-running projects across spheres, **neutral progression graph** ⚡ |
| `THREAD_REVIVAL` | **identifies dormant knowledge that is relevant again** ⚡ |
| `THREAD_FUTURE_SAFE` | lists questions or tasks with no answers yet, **zero predictive phrasing** ⚡ |

### Temporal Thread JSON ⚡

```json
{
  "temporal_thread": {
    "topic": "string",
    "timeline": [
      { "t": 1680000000, "ref": "artifact_id" },
      { "t": 1690000000, "ref": "meeting_id" },
      { "t": 1710000000, "ref": "decision_id" }
    ],
    "status": "alive|dormant",
    "projection_free": true
  }
}
```

### Temporal Fields ⚡
| Field | Description |
|-------|-------------|
| `timeline[].t` | **Unix timestamp** ⚡ |
| `timeline[].ref` | **artifact/meeting/decision ID** ⚡ |
| `status` | **alive/dormant** ⚡ |
| `projection_free` | **true always** ⚡ |

### Temporal Thread Rules ⚡
| Rule | Status |
|------|--------|
| **no trends** | ✅ ⚡ |
| **no inference** | ✅ ⚡ |
| **no suggestion of future behavior** | ✅ ⚡ |
| **only concrete historical links** | ✅ ⚡ |

---

## TIER 3 — COLLECTIVE ↔ PERSONAL KNOWLEDGE THREADS ⚡

### Purpose
Allow users to relate **THEIR OWN knowledge graph** to the **COLLECTIVE MEMORY** **WITHOUT blending identities or perspectives.**

### RULE
> **Two graphs remain SEPARATE; thread = bridge, not merge.**

### Thread Categories ⚡
| Category | Description |
|----------|-------------|
| `PERSONAL_TO_COLLECTIVE` | **user bookmarks linked to validated collective artifacts** ⚡ |
| `COLLECTIVE_TO_PERSONAL` | **user view highlights connections to personal tasks** ⚡ |
| `PARALLEL_VIEWS` | **side-by-side comparison of personal vs collective history** ⚡ |
| `SAFETY_THREAD` | **ensures no leak of private memories, shows only explicitly shared elements** ⚡ |

### Personal-Collective Thread JSON ⚡

```json
{
  "pc_thread": {
    "personal_ref": "user_artifact|user_note",
    "collective_ref": "collective_memory_id",
    "user_id": "uuid",
    "visibility": "private|shared",
    "purpose": "reference_only",
    "hash": "sha256"
  }
}
```

### PC Fields ⚡
| Field | Description |
|-------|-------------|
| `personal_ref` | **user_artifact/user_note** ⚡ |
| `collective_ref` | **collective_memory_id** ⚡ |
| `purpose` | **"reference_only"** ⚡ |

### Display Logic ⚡
| Feature | Status |
|---------|--------|
| **thin dotted line = soft conceptual link** | ⚡ |
| **fade in only on hover** | ⚡ |
| **user can disable layer easily** | ⚡ |
| **no blending of personal data into shared views** | ⚡ |

---

## UNIFIED KNOWLEDGE THREAD ENGINE ⚡

### MANAGES ⚡
| Function | Description |
|----------|-------------|
| creation | ✅ |
| validation | ✅ |
| hashing | ✅ |
| **orphan thread detection** | ⚡ |
| **sphere drift detection (misalignment)** | ⚡ |
| **privacy filtering** | ⚡ |
| **UX rendering (2D/3D/XR)** | ⚡ |

### NEVER DOES ⚡
| Forbidden | Status |
|-----------|--------|
| **prioritization** | ❌ ⚡ |
| **inference** | ❌ ⚡ |
| **causality** | ❌ ⚡ |
| **persuasion** | ❌ ⚡ |
| **recommendation** | ❌ ⚡ |

### Knowledge Thread Engine JSON ⚡

```json
{
  "kt_engine": {
    "tiers_enabled": ["inter_sphere", "temporal", "pc_bridge"],
    "privacy_filter": true,
    "hashing": "sha256",
    "validation_agent": "agent_kt_guard",
    "render_mode": "2d|3d|xr"
  }
}
```

### Engine Fields ⚡
| Field | Description |
|-------|-------------|
| `tiers_enabled` | **Array of tier names** ⚡ |
| `validation_agent` | **"agent_kt_guard"** ⚡ |
| `render_mode` | **2d/3d/xr** ⚡ |

---

## AGENTS INVOLVED ⚡

| Agent | Role |
|-------|------|
| `AGENT_KT_BUILDER` | **constructs threads from validated sources** ⚡ |
| `AGENT_KT_GUARD` | **ensures no bias, no predictive reasoning, privacy enforcement** ⚡ |
| `AGENT_KT_RENDERER` | **visualizes threads safely, no highlighting of importance** ⚡ |

---

**END — KNOWLEDGE THREAD PACK (TIER 1–3)**
