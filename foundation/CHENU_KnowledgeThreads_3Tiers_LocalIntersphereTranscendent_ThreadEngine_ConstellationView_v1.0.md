# CHE·NU — KNOWLEDGE THREADS (3 TIERS)
**VERSION:** KTH.v1.0  
**MODE:** FOUNDATION / NON-PERSUASIVE / BUILD-READY

---

## OVERVIEW ⚡

> **Knowledge Threads = STRUCTURED LINKS OF INFORMATION across spheres, replays, decisions, artifacts, and agents.**

### RULE
> **THREADS CONNECT — THEY DO NOT INTERPRET.**

### 3 Tiers ⚡
| Tier | Scope |
|------|-------|
| **1 — LOCAL** | within one sphere |
| **2 — INTERSPHERE** | cross-sphere links |
| **3 — TRANSCENDENT** | **cross-user, cross-time, cross-context** ⚡ |

---

## 1) LOCAL KNOWLEDGE THREADS ⚡

### Purpose
> **Connect related information INSIDE A SINGLE SPHERE without altering meaning or producing conclusions.**

### Examples ⚡
| Sphere | Chain |
|--------|-------|
| Business | Proposal → Contract → Invoice → Decision Log ⚡ |
| Scholar | Lesson → Assignment → Test → **Replay Annotation** ⚡ |
| Creative Studio | Asset → Revision → Approval → Export ⚡ |
| XR | Meeting → Replay → Memory Event → Task ⚡ |

### RULE
> **Local = one sphere only. No cross-context mixing.**

### Local Thread JSON ⚡
```json
{
  "local_thread": {
    "id": "uuid",
    "sphere": "business|scholar|creative|...",
    "nodes": [
      { "id": "uuid", "type": "artifact|decision|event|replay", "timestamp": 1712 }
    ],
    "links": [
      { "from": "id", "to": "id", "relation": "follows|references|derived" }
    ],
    "origin": "created_by_user_or_agent",
    "immutable": true
  }
}
```

### Local Thread Rules ⚡
| Rule | Status |
|------|--------|
| **no interpretation** | ✅ ⚡ |
| **chronological only** | ✅ ⚡ |
| **no inferred relations** | ✅ ⚡ |
| **user may hide/show nodes** | ✅ ⚡ |
| **agent cannot reorder without explicit request** | ✅ ⚡ |

---

## 2) INTERSPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Connect information ACROSS SPHERES when relevance is explicit and verifiable.**

### Examples ⚡
| From | To | Link |
|------|----|------|
| Scholar research | Business proposal | ⚡ |
| Creative mockup | Social campaign | ⚡ |
| Institution rule | Business compliance | ⚡ |
| Methodology result | **XR meeting preset** | ⚡ |

### RULE
> **Spheres intersect; they do not merge.**

### Intersphere Thread JSON ⚡
```json
{
  "intersphere_thread": {
    "id": "uuid",
    "origin_sphere": "scholar",
    "target_sphere": "business",
    "evidence": ["artifact_id", "replay_id"],
    "nodes": ["..."],
    "links": [
      { "from": "uuid", "to": "uuid", "relation": "influenced_by|supported_by" }
    ],
    "validation_required": true
  }
}
```

### Key Field: `validation_required: true` ⚡
> **Never auto-created without verification**

### Intersphere Rules ⚡
| Rule | Status |
|------|--------|
| **must contain explicit evidence** | ✅ ⚡ |
| **never auto-created without verification** | ✅ ⚡ |
| **must pass "sphere boundary guard"** | ✅ ⚡ |
| **user chooses visibility** | ✅ ⚡ |
| **no cross-sphere authority granted** | ✅ ⚡ |

---

## 3) TRANSCENDENT KNOWLEDGE THREADS ⚡ (NOUVEAU!)

### Purpose
> **Connect patterns across users, times, and replays WITHOUT pattern interpretation, prediction, or ranking.**

### They Reveal ⚡
| Pattern | Description |
|---------|-------------|
| **repeated structures** | ⚡ |
| **recurring workflows** | ⚡ |
| **parallel decisions** | ⚡ |
| **mirrored sequences** | ⚡ |

### NEVER ⚡
| Forbidden | Status |
|-----------|--------|
| **predict behavior** | ❌ ⚡ |
| **suggest strategies** | ❌ ⚡ |
| **optimize users** | ❌ ⚡ |
| **create psychological models** | ❌ ⚡ |

### Transcendent Thread JSON ⚡
```json
{
  "transcendent_thread": {
    "id": "uuid",
    "pattern": "structural|temporal|workflow",
    "instances": [
      {
        "thread_id": "local_or_intersphere_id",
        "match_strength": 0.0-1.0,
        "evidence_nodes": ["uuid", "uuid"]
      }
    ],
    "hash": "sha256",
    "interpretation": "none",
    "safety": "strict"
  }
}
```

### Key Fields ⚡
| Field | Value |
|-------|-------|
| `interpretation` | **"none"** |
| `safety` | **"strict"** |

### Transcendent Rules ⚡
| Rule | Status |
|------|--------|
| **pattern ≠ meaning** | ✅ ⚡ |
| **no behavioral mapping** | ✅ ⚡ |
| **no emotional inference** | ✅ ⚡ |
| **all matches are declared "non-causal"** | ✅ ⚡ |
| **only structural similarities allowed** | ✅ ⚡ |

---

## KNOWLEDGE THREADS ENGINE ⚡

### 4 Components ⚡
| Component | Role |
|-----------|------|
| `THREAD_BUILDER` | creates neutral links ⚡ |
| `THREAD_VALIDATOR` | **checks evidence** ⚡ |
| `THREAD_VISUALIZER` | renders graph ⚡ |
| `THREAD_GUARD` | **prevents interpretation drift** ⚡ |

---

## VISUALIZATION ⚡

| Thread Type | Visual |
|-------------|--------|
| **LOCAL** | linear or branching line ⚡ |
| **INTERSPHERE** | two-node orbit with bridge ⚡ |
| **TRANSCENDENT** | **constellation lines, low opacity** ⚡ |

---

## UNIVERSE VIEW INTEGRATION ⚡

### Displays ⚡
| Type | Visual |
|------|--------|
| threads | subtle lines ⚡ |
| intersphere links | **colored bridges** ⚡ |
| transcendents | **faint constellations** ⚡ |

### Toggle Controls ⚡
| Toggle | Description |
|--------|-------------|
| `show_local` | ⚡ |
| `show_intersphere` | ⚡ |
| `show_transcendent` | ⚡ |

---

## SECURITY & ETHICS ⚡

| Rule | Status |
|------|--------|
| **threads immutable after freeze** | ✅ ⚡ |
| **user control on visibility** | ✅ ⚡ |
| **redaction option for private nodes** | ✅ ⚡ |
| **no inference, no sentiment, no predictions** | ✅ ⚡ |
| **cross-user data anonymized unless explicitly shared** | ✅ ⚡ |

---

## WHY THE 3 TIERS MATTER ⚡

| Tier | = |
|------|---|
| **LOCAL** | clarity |
| **INTERSPHERE** | cohesion |
| **TRANSCENDENT** | **perspective** |

> **Together: A knowledge ecosystem without manipulation, aligned with the Tree of Che-Nu.**

---

**END — FOUNDATION FREEZE**
