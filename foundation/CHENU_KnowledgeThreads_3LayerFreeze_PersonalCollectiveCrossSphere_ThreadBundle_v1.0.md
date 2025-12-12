# CHE·NU — KNOWLEDGE THREAD SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## OVERVIEW ⚡

> **Knowledge Threads = the connective tissue between:** 1) Collective Memory, 2) Personal Navigation Profiles, 3) Sphere Knowledge Maps.

### Purpose
> **Reveal HOW knowledge elements relate, without imposing WHAT to think.**

### RULE
> **Threads = RELATIONS, not conclusions.**

### 3 Thread Layers ⚡
| Layer | Description |
|-------|-------------|
| **LAYER 1** | Personal Knowledge Threads |
| **LAYER 2** | Collective Knowledge Threads |
| **LAYER 3** | **Cross-Sphere Knowledge Threads** |

---

## LAYER 1 — PERSONAL KNOWLEDGE THREADS ⚡

### Purpose
> **Help a single user trace continuity between:** meetings, notes, artifacts, decisions, reflections, tasks, XR sessions.

### RULE
> **Threads are PRIVATE unless explicitly shared.**

### 4 Personal Thread Types ⚡
| Type | Description |
|------|-------------|
| `CONTEXT CONTINUITY` | links user's own actions across time ⚡ |
| `DECISION LINEAGE` | links decisions → reasoning artifacts → outcomes ⚡ |
| `MEMORY ANCHOR TRACE` | **connects XR pins, notes, bookmarks** ⚡ |
| `SPHERE JOURNEY` | **maps how user moved between spheres over time** ⚡ |

### Personal Thread JSON ⚡
```json
{
  "personal_thread": {
    "id": "uuid",
    "user_id": "uuid",
    "nodes": ["memory_id", "artifact_id", "meeting_id"],
    "edges": [
      { "from": "id", "to": "id", "type": "continuity|lineage|anchor|journey" }
    ],
    "visibility": "private",
    "hash": "sha256"
  }
}
```

### 2 Responsible Agents ⚡
| Agent | Role |
|-------|------|
| `AGENT_PERSONAL_THREADER` | builds threads passively from user history, **never assumes intention** ⚡ |
| `AGENT_THREAD_EXPLAINER` | describes thread relationships clearly, **no speculation** ⚡ |

---

## LAYER 2 — COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
> **Build shared, validated relational knowledge across:** teams, organizations, multi-user projects.

### RULE
> **Collective threads = OBJECTIVE relationships. No sentiment, no ranking, no priority inference.**

### 4 Collective Thread Types ⚡
| Type | Description |
|------|-------------|
| `SHARED ARTIFACT NETWORK` | documents used across multiple meetings/spheres ⚡ |
| `DECISION PROPAGATION` | shows how one decision influenced later discussions ⚡ |
| `AGENT CONTRIBUTION MAP` | **tracks which agent contributed which artifact** ⚡ |
| `TOPIC EVOLUTION TRACE` | **follows how a topic matured throughout collective meetings** ⚡ |

### Collective Thread JSON ⚡
```json
{
  "collective_thread": {
    "id": "uuid",
    "nodes": ["artifact_id", "decision_id", "meeting_id", "topic_tag"],
    "edges": [
      { "from": "id", "to": "id", "type": "shared|propagation|contribution|evolution" }
    ],
    "visibility": "team|org",
    "validation": "integrity-checked",
    "hash": "sha256"
  }
}
```

### Key Field: `validation: "integrity-checked"` ⚡

### 2 Responsible Agents ⚡
| Agent | Role |
|-------|------|
| `AGENT_COLLECTIVE_THREADER` | merges validated memories → threads, **no ambiguous links** ⚡ |
| `AGENT_THREAD_VALIDATOR` | checks integrity, **rejects subjective links** ⚡ |

---

## LAYER 3 — CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Reveal structural connections between spheres:** Business ↔ Scholar, Scholar ↔ Creative, Creative ↔ XR, XR ↔ Institutions, etc.

### RULE
> **Cross-sphere threads = STRUCTURAL, not interpretive.**

### 4 Cross-Sphere Thread Types ⚡
| Type | Description |
|------|-------------|
| `CONCEPT BRIDGE` | links same concept appearing in multiple spheres ⚡ |
| `PROCESS MIRROR` | links processes sharing structural similarity ⚡ |
| `RESOURCE THREAD` | **tracks resources used across multiple spheres** ⚡ |
| `MULTI-SPHERE LINEAGE` | **long-term evolution of a concept across domains** ⚡ |

### Cross-Sphere Thread JSON ⚡
```json
{
  "cross_sphere_thread": {
    "id": "uuid",
    "spheres": ["business", "scholar", "creative", "xr", "..."],
    "nodes": ["concept_id", "artifact_id", "process_id"],
    "edges": [
      { "from": "id", "to": "id", "type": "concept_bridge|process_mirror|resource|lineage" }
    ],
    "global_visibility": true,
    "hash": "sha256"
  }
}
```

### 2 Responsible Agents ⚡
| Agent | Role |
|-------|------|
| `AGENT_SPHERE_ANALYZER` | finds structural parallels across spheres, **no semantic interpretation** ⚡ |
| `AGENT_CROSS_SPHERE_WEAVER` | builds multi-sphere threads, **ensures clarity + neutrality** ⚡ |

---

## UNIFIED THREAD SAFETY RULES ⚡

| Rule | Status |
|------|--------|
| **No predictive inference** | ✅ ⚡ |
| **No emotional labeling** | ✅ ⚡ |
| **No persuasive shaping** | ✅ ⚡ |
| **No hidden prioritization** | ✅ ⚡ |
| **No removal — append-only** | ✅ ⚡ |
| **All threads cryptographically signed** | ✅ ⚡ |

---

## UNIFIED THREAD EXPORT ⚡

### `thread_bundle.xrkt` ⚡ (NOUVEAU!)
| File | Description |
|------|-------------|
| `personal_threads.json` | ⚡ |
| `collective_threads.json` | ⚡ |
| `cross_sphere_threads.json` | ⚡ |
| `graph_schema.json` | ⚡ |
| `integrity_proof.txt` | ⚡ |

---

## UNIVERSE VIEW INTEGRATION ⚡

### Threads Appear As ⚡
| Property | Description |
|----------|-------------|
| **soft lines between nodes** | ⚡ |
| **color-coded by layer** | ⚡ |
| **thickness = structural density (NOT importance)** | ✅ ⚡ |
| **toggleable by user** | ⚡ |

---

## XR INTEGRATION ⚡

### Users Can ⚡
| Action | Description |
|--------|-------------|
| walk along a knowledge thread | ⚡ |
| preview adjacent nodes | ⚡ |
| **follow lineage in 3D** | ⚡ |
| **open replay or artifacts in-place** | ⚡ |

### Forbidden ⚡
| NO | Status |
|----|--------|
| **automatic movement** | ❌ ⚡ |
| **forced storyline** | ❌ ⚡ |
| **highlight bias** | ❌ ⚡ |

---

**END — KNOWLEDGE THREAD SYSTEM (3-LAYER FREEZE)**
