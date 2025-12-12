# CHE·NU — KNOWLEDGE THREADS v1.0
**MODE:** FOUNDATION / NON-MANIPULATIVE / IMMUTABLE-READY

---

## 0) PRINCIPLE — WHAT IS A KNOWLEDGE THREAD?

> A Knowledge Thread = A **verifiable chain** of facts, artifacts, events, decisions, and references that connect concepts across time, spheres, meetings, and users.

### RULES ⚡
- No interpretation
- No sentiment
- No ranking
- No persuasion
- **Only FACTS + LINKS** ⚡

> **Thread = STRUCTURE, NOT STORY.**

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS

### Purpose
Connect all validated knowledge **INSIDE a single sphere:** Business, Scholar, Creative, Social, Institutions, XR, etc.

### Intra-sphere Threads Show ⚡
- concept evolution
- decision sequences
- artifact versions
- **agent contributions** ⚡
- **knowledge lineage** ⚡

### Thread Node Types ⚡
| Type | Description |
|------|-------------|
| `FACT` | validated info |
| `ARTIFACT` | doc, board, file |
| `EVENT` | timestamped meeting segment |
| `DECISION` | **declared, not judged** ⚡ |
| `ACTION` | agent or user |
| `CONTEXT` | sphere metadata |

### Edge Types ⚡
| Edge | Description |
|------|-------------|
| `derived_from` | ⚡ |
| `references` | ✅ |
| `depends_on` | ⚡ |
| `contradicted_by` | **(non-interpretative)** ⚡ |
| `superseded_by` | ⚡ |
| `parallel_to` | ⚡ |

### Intra-Thread JSON ⚡

```json
{
  "intra_thread": {
    "sphere": "business",
    "thread_id": "uuid",
    "nodes": [...],
    "edges": [...],
    "hash": "sha256"
  }
}
```

---

## 2) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Connect knowledge **BETWEEN spheres** when concepts overlap.

> **Inter-sphere threads DO NOT merge spheres. They create bridges.**

### When Inter-Sphere Threads Appear ⚡
| Flow | Description |
|------|-------------|
| Scholar → Business | **research → application** ⚡ |
| Creative → Social | **media → engagement** ⚡ |
| Institutions → Business | **regulation → compliance** ⚡ |
| XR → All | **spatial interpretation** ⚡ |

### Inter-Sphere Thread Rules ⚡
| # | Rule |
|---|------|
| 1 | **Must originate from validated content** ⚡ |
| 2 | **Must have at least ONE conceptual anchor (shared term)** ⚡ |
| 3 | **Must be cross-verified (traceability)** ⚡ |
| 4 | No inference allowed |
| 5 | **No transformation of meaning** ⚡ |

### Inter-Sphere Thread JSON (with concept + anchors) ⚡

```json
{
  "inter_thread": {
    "from_sphere": "scholar",
    "to_sphere": "business",
    "concept": "training_efficiency",
    "anchors": [
      { "id": "fact1", "source": "replayA" },
      { "id": "fact2", "source": "artifactB" }
    ],
    "links": [...],
    "hash": "sha256"
  }
}
```

### Inter Fields ⚡
| Field | Description |
|-------|-------------|
| `concept` | **Shared conceptual term** ⚡ |
| `anchors[].source` | **replay/artifact reference** ⚡ |

### Visualization (Universe View) ⚡
- **soft inter-sphere beams (neutral color)** ⚡
- no glow
- no pulsation
- **no directional implication** ⚡

---

## 3) UNIVERSAL KNOWLEDGE WEB ⚡

### Purpose
Unify all threads (intra + inter) into a **GLOBAL TRUTH MAP** across: spheres, users, agents, timelines, replays, artifacts

> **NOT a knowledge graph of interpretations, but a *web of raw truth connections*.**

### Universal Thread Properties ⚡
| Property | Status |
|----------|--------|
| **append-only** | ✅ ⚡ |
| **cryptographically sealed** | ✅ ⚡ |
| **multi-sphere alignment** | ✅ ⚡ |
| **cross-user with privacy layers** | ✅ ⚡ |
| **replay-integrated** | ✅ ⚡ |
| no semantic interpretation | ✅ |
| **no hierarchical scoring** | ✅ ⚡ |

### Universal Thread JSON ⚡

```json
{
  "universal_knowledge_web": {
    "threads": [
      { "type": "intra", "id": "uuid1" },
      { "type": "inter", "id": "uuid2" }
    ],
    "nodes_global": [...],
    "edges_global": [...],
    "privacy_rules": {
      "user_private": true,
      "sphere_masking": true
    },
    "version": "1.0",
    "hash": "sha256"
  }
}
```

### Privacy Layers ⚡
| Level | Scope |
|-------|-------|
| **LEVEL 0** | private user-only ⚡ |
| **LEVEL 1** | sphere-group only ⚡ |
| **LEVEL 2** | team-shared ⚡ |
| **LEVEL 3** | global (de-identified) ⚡ |

### NO ⚡
- personal data exposure
- emotional metrics
- **inferred intentions** ⚡

---

## 4) AGENTS ROLES IN KNOWLEDGE THREADS ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **constructs from validated data only, never interprets** ⚡ |
| `AGENT_THREAD_GUARD` | **ensures no forbidden inference, checks privacy boundaries** ⚡ |
| `AGENT_THREAD_RENDERER` | **displays visually, never highlights meaning** ⚡ |
| `AGENT_THREAD_AUDITOR` | **verifies cryptographic integrity, ensures immutability** ⚡ |

---

## 5) USER INTERACTIONS — SAFE UI ⚡

### Allowed ⚡
| Action | Status |
|--------|--------|
| expand thread | ✅ |
| collapse branches | ✅ |
| filter by sphere | ✅ |
| view timeline | ✅ |
| **view replay anchors** | ⚡ |
| export (pdf / json) | ✅ |

### Not Allowed ⚡
| Forbidden | Status |
|-----------|--------|
| **"optimize knowledge"** | ❌ ⚡ |
| **"show best path"** | ❌ ⚡ |
| **"rate decisions"** | ❌ ⚡ |
| **"predict outcomes"** | ❌ ⚡ |

---

## 6) WHY KNOWLEDGE THREADS MATTER ⚡

### They Create ⚡
- transparency
- continuity
- integrity
- **shared truth** ⚡
- **historical clarity** ⚡

### WITHOUT ⚡
- influence
- nudging
- narrative
- **bias** ⚡

---

**END — FREEZE READY**
