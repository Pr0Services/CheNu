# CHE·NU — KNOWLEDGE THREADS SYSTEM (INTRA/INTER/COLLECTIVE + RENDERING)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## PURPOSE

> Knowledge Threads connect: events, artifacts, decisions, agents, spheres — to form **auditable lines of reasoning**, without rewriting history or influencing users.

### RULE
> **Knowledge Thread = structured factual linkage. NOT explanation. NOT suggestion. NOT inference.**

---

## THREAD TYPE 1 — INTRA-SPHERE THREADS (Sphere → Same Sphere)

### Description
Links knowledge nodes **within one sphere only:** Business → Business, Scholar → Scholar, Creative → Creative, etc.

### Use Cases ⚡
- see evolution of a project within the same domain
- highlight relevant past artifacts
- **identify repeated patterns (without interpreting)** ⚡

### Node Types Connected ⚡
- Meeting nodes, Decision logs, Documents / Artifacts, Agent actions, Replays

### Link Logic ⚡
| Logic Type | Description |
|------------|-------------|
| `topic_match` | ⚡ |
| `artifact_reference` | ⚡ |
| `decision_followup` | ⚡ |
| `timeline_continuity` | ⚡ |

### Intra Thread JSON ⚡

```json
{
  "intra_thread": {
    "sphere": "business",
    "nodes": ["id1","id2","id3"],
    "links": [
      {"from":"id1","to":"id2","reason":"topic_match"},
      {"from":"id2","to":"id3","reason":"timeline_continuity"}
    ],
    "hash": "sha256"
  }
}
```

### Constraints ⚡
| Constraint | Status |
|------------|--------|
| no cross-domain interpretation | ✅ |
| **only factual, traceable connections** | ✅ ⚡ |
| **user can hide/show threads** | ✅ ⚡ |

---

## THREAD TYPE 2 — INTER-SPHERE THREADS (Sphere → Different Sphere)

### Description
Links nodes that cross domains: Scholar research → Business decision, Creative mockup → Social post, Institution rule → XR meeting

### Purpose ⚡
> Show how knowledge travels between spheres **WITHOUT implying influence or causality.**

### Node Match Criteria ⚡
| Criteria | Description |
|----------|-------------|
| shared artifacts | ✅ |
| shared participants | ✅ |
| **compatible topics** | ⚡ |
| **referenced documents** | ⚡ |

### Inter Thread JSON (with safety array) ⚡

```json
{
  "inter_thread": {
    "from_sphere": "scholar",
    "to_sphere": "business",
    "nodes": ["idA","idB"],
    "links": [
      {"from":"idA","to":"idB","reason":"artifact_shared"}
    ],
    "safety": ["no_inference","no_priority_bias"]
  }
}
```

### Inter Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `from_sphere` / `to_sphere` | **Source and target spheres** ⚡ |
| `safety` | **["no_inference","no_priority_bias"]** ⚡ |

### Safety Guards ⚡
| Guard | Status |
|-------|--------|
| **never imply "because of"** | ✅ ⚡ |
| never rate importance | ✅ |
| no hidden ranking | ✅ |
| **explicit trace required for each link** | ✅ ⚡ |

---

## THREAD TYPE 3 — CROSS-USER / COLLECTIVE THREADS

### Description
Aggregates *shared factual references* across users, **BUT protects privacy and avoids influence.**

### Rules ⚡
| Rule | Status |
|------|--------|
| **anonymous by default** | ✅ ⚡ |
| **explicit opt-in required** | ✅ ⚡ |
| **aggregation = statistical, not personal** | ✅ ⚡ |
| no behavioral clustering | ✅ |
| **no psychological patterning** | ✅ ⚡ |

### Thread Use Cases ⚡
- identify frequently referenced artifacts
- **find convergent decisions (non-evaluative)** ⚡
- **detect collective interest areas** ⚡

### Collective Thread JSON (with frequency + anonymous_nodes) ⚡

```json
{
  "collective_thread": {
    "topic": "XR-design",
    "anonymous_nodes": ["idX","idY","idZ"],
    "frequency": 3,
    "links": [
      {"from":"idX","to":"idY","reason":"multi-user-reference"}
    ],
    "privacy": "opt-in-only",
    "hash": "sha256"
  }
}
```

### Collective Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `anonymous_nodes` | **Array of anonymous IDs** ⚡ |
| `frequency` | **Integer count** ⚡ |
| `links[].reason` | **"multi-user-reference"** ⚡ |
| `privacy` | **"opt-in-only"** ⚡ |

### Visualization ⚡
| Property | Value |
|----------|-------|
| **soft clusters** | ⚡ |
| **no user identifiers** | ⚡ |
| **no emotional/psychological reading** | ⚡ |

---

## THREAD RENDERING MODES (ALL TYPES) ⚡

| Mode | Description |
|------|-------------|
| **MODE: LINEAR** | Simple chronological chain ⚡ |
| **MODE: RADIAL** | Sphere-centric burst of connections ⚡ |
| **MODE: WEAVE** | Timeline crossing without hierarchy ⚡ |
| **MODE: OVERLAY** | Ghost threads on XR replay ⚡ |

---

## MASTER THREAD ENGINE — UNIFIED MODEL ⚡

```json
{
  "thread_engine": {
    "types": ["intra","inter","collective"],
    "validation": "hash+source_replay_required",
    "activation": "manual",
    "visibility": {
      "default": false,
      "user_override": true
    }
  }
}
```

### Engine Fields ⚡
| Field | Description |
|-------|-------------|
| `validation` | **"hash+source_replay_required"** ⚡ |
| `activation` | **"manual"** ⚡ |
| `visibility.default` | **false** ⚡ |
| `visibility.user_override` | **true** ⚡ |

---

## ETHICAL LOCKS ⚡

| Lock | Status |
|------|--------|
| No causal inference | ✅ |
| No behavioral prediction | ✅ |
| No recommendation | ✅ |
| No ranking | ✅ |
| No prioritization | ✅ |
| **Full audit trail** | ✅ ⚡ |
| **Freeze compatible** | ✅ ⚡ |

---

**END — KNOWLEDGE THREAD SYSTEM READY**
