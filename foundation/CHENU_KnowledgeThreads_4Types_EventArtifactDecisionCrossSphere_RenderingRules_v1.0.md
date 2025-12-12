# CHE·NU — KNOWLEDGE THREADS (1–4)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / MULTI-SPHERE / NON-MANIPULATIVE

---

## OVERVIEW ⚡

> **Knowledge Threads = neutral connectors linking facts, events, artifacts, decisions, and spheres.**

### THREADS ARE ⚡
| Property | Status |
|----------|--------|
| **factual** | ✅ ⚡ |
| **traceable** | ✅ ⚡ |
| **reversible** | ✅ ⚡ |
| **cross-sphere** | ✅ ⚡ |
| **non-interpretative** | ✅ ⚡ |

### THREADS ARE NOT ⚡
| Forbidden | Status |
|-----------|--------|
| **conclusions** | ❌ ⚡ |
| **inferences** | ❌ ⚡ |
| **recommendations** | ❌ ⚡ |
| **sentiment-based** | ❌ ⚡ |

---

## 1) EVENT-BASED THREADS ⚡

### Purpose
> **Link events across meetings, spheres, agents, and timelines — WITHOUT interpreting meaning.**

### 5 Event Types ⚡
| Type | Description |
|------|-------------|
| `action_event` | "X said Y" ⚡ |
| `non_action_event` | **"silence period"** ⚡ |
| `artifact_event` | "document referenced" ⚡ |
| `decision_event` | "decision declared" ⚡ |
| `alignment_event` | **"similar temporal context"** ⚡ |

### Thread Creation Rules ⚡
```
IF two events:
- share timestamp proximity OR
- share participants OR
- reference same artifact
→ create EVENT_THREAD
```

### Event Thread JSON ⚡
```json
{
  "event_thread": {
    "id": "uuid",
    "from": "event_id",
    "to": "event_id",
    "reason": "artifact|participant|time|context",
    "weight": 0.0-1.0,
    "hash": "sha256"
  }
}
```

---

## 2) ARTIFACT THREADS ⚡

### Purpose
> **Bind documents, images, boards, notes, and replay artifacts across spheres.**

### RULE
> **Artifacts link ONLY through explicit reference, never through inferred semantics.**

### 5 Artifact Link Triggers ⚡
| Trigger | Description |
|---------|-------------|
| referenced by multiple meetings | ⚡ |
| used in multiple decisions | ⚡ |
| updated across time | ⚡ |
| **attached to multiple spheres** | ⚡ |
| **pinned in XR replay** | ⚡ |

### Artifact Thread JSON ⚡
```json
{
  "artifact_thread": {
    "id": "uuid",
    "artifact_id": "uuid",
    "linked_entities": ["meeting_id", "decision_id"],
    "cross_sphere": true,
    "version_path": ["v1", "v2", "v3"],
    "hash": "sha256"
  }
}
```

### Key Field: `version_path` ⚡
> **Tracks artifact evolution across versions**

### Behavior ⚡
| Behavior | Status |
|----------|--------|
| **artifacts cluster in Universe View** | ✅ ⚡ |
| **version lineage visible** | ✅ ⚡ |
| **no ranking or improvement suggestions** | ✅ ⚡ |
| **no interpretation of changes** | ✅ ⚡ |

---

## 3) DECISION THREADS ⚡

### Purpose
> **Show how decisions evolve, relate, cluster, or diverge without implying correctness.**

### RULE
> **Decision threads NEVER evaluate quality.**

### 5 Decision Link Types ⚡
| Type | Description |
|------|-------------|
| `follow_up` | decision referenced another ⚡ |
| `parallel_goal` | same objective, different path ⚡ |
| `contradictory` | **inverse states declared** ⚡ |
| `dependent` | one decision requires another ⚡ |
| `deferred` | **postponed decision chain** ⚡ |

### Decision Thread JSON ⚡
```json
{
  "decision_thread": {
    "id": "uuid",
    "from": "decision_id",
    "to": "decision_id",
    "type": "follow_up|parallel|contradictory|dependent|deferred",
    "timestamp": "...",
    "context_sphere": "business|scholar|...",
    "hash": "sha256"
  }
}
```

### Decision Rendering (Universe View) ⚡
| Type | Visual |
|------|--------|
| `follow_up` | solid line ⚡ |
| `parallel` | dotted line ⚡ |
| `contradictory` | **red dashed line** ⚡ |
| `dependent` | arrow ⚡ |
| `deferred` | **fade-out node** ⚡ |

---

## 4) CROSS-SPHERE THREADS ⚡

### Purpose
> **Reveal structural connections across spheres WITHOUT establishing hierarchy, preference, or influence.**

### Examples ⚡
| Example |
|---------|
| Business decision referencing Scholar data |
| XR replay linked to Creative artifacts |
| **Methodology notes affecting Social processes** |
| **Institutional rules touching all spheres** |

### Cross-Sphere Link Rules ⚡
```
IF two entities:
- share metadata OR
- share artifact OR
- share participants OR
- share decisions OR
- originate from same user chain
→ create CROSS_SPHERE_THREAD
```

### Cross-Sphere Thread JSON ⚡
```json
{
  "cross_sphere_thread": {
    "id": "uuid",
    "nodes": ["entity_1", "entity_2", "entity_3"],
    "spheres": ["scholar", "business", "creative"],
    "reason": "shared_artifact|shared_user|decision_path|timeline",
    "stability": 0.0-1.0,
    "hash": "sha256"
  }
}
```

### Safety & Ethics ⚡
| Rule | Status |
|------|--------|
| **NO merging sphere identities** | ✅ ⚡ |
| **NO inferring cross-domain intent** | ✅ ⚡ |
| **NO predicting future behavior** | ✅ ⚡ |
| **NO emotional or motivational signals** | ✅ ⚡ |

---

## UNIVERSE VIEW RENDERING RULES ⚡

| Thread Type | Visual |
|-------------|--------|
| **EVENT THREAD** | thin grey line ⚡ |
| **ARTIFACT THREAD** | **blue glow** ⚡ |
| **DECISION THREAD** | structured arrows ⚡ |
| **CROSS-SPHERE THREAD** | **multi-color braid** ⚡ |

### Hover Reveals ⚡
| Property | Status |
|----------|--------|
| **exact factual link** | ✅ ⚡ |
| **zero interpretation** | ✅ ⚡ |
| **link origin + replay reference** | ✅ ⚡ |

---

## 3 AGENT ROLES ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | generates threads from raw data, **zero interpretation** ⚡ |
| `AGENT_THREAD_GUARD` | **ensures ethics + non-inference** ⚡ |
| `AGENT_THREAD_RENDERER` | displays visually, **never influences navigation** ⚡ |

---

**END — KNOWLEDGE THREADS v1.0**
