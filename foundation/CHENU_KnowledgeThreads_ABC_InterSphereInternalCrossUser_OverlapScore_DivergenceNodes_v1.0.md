# CHE·NU — KNOWLEDGE THREADS (A + B + C)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## A) KNOWLEDGE THREAD — INTERSPHERE THREAD ⚡

### Purpose
Create a **NEUTRAL connective layer** between spheres (Business, Scholar, Creative, Social, Institution, XR, Methodology, IA Lab, etc.) without merging them or altering their autonomy.

### RULE
> **A Knowledge Thread = A RELATION. NOT a transformation, NOT an interpretation.**

### Intersphere Thread Definition ⚡

**Each thread contains:**
| Field | Description |
|-------|-------------|
| `origin_sphere` | ⚡ |
| `target_sphere` | ⚡ |
| `shared_concepts (keywords)` | ⚡ |
| `shared_artifacts (optional)` | ⚡ |
| `context_links (optional)` | ⚡ |
| `access_level (per user)` | ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| sentiment | ❌ ⚡ |
| prioritization | ❌ ⚡ |
| conclusions | ❌ ⚡ |
| persuasion | ❌ ⚡ |

### Intersphere JSON ⚡

```json
{
  "knowledge_thread_intersphere": {
    "id": "uuid",
    "origin": "business",
    "target": "scholar",
    "shared_concepts": ["planning", "metrics"],
    "shared_artifacts": ["doc1", "timelineA"],
    "context_level": "low|medium|high",
    "visibility": "private|team|public"
  }
}
```

### What It Enables ⚡
- trace learning between spheres
- unify concepts without forcing structure
- show conceptual bridges
- **reinforce understanding without bias** ⚡

---

## B) KNOWLEDGE THREAD — INTERNAL SPHERE THREAD ⚡

### Purpose
Track conceptual evolution **inside a single sphere**, across time, meetings, replays, agents, decisions.

### RULE
> **Internal thread = evolution of understanding. NOT quality assessment. NOT recommendation. NOT narrative shaping.**

### Internal Thread Components ⚡
| Component | Description |
|-----------|-------------|
| `sphere_id` | ⚡ |
| `topic_root` | ⚡ |
| `chronological_nodes (ordered)` | ⚡ |
| `replay_references` | ⚡ |
| `decision_points` | ⚡ |
| `artifact_diffs` | ⚡ |
| `silence_intervals (optional)` | ⚡ |

### Internal Sphere JSON ⚡

```json
{
  "knowledge_thread_internal": {
    "id": "uuid",
    "sphere": "creative",
    "topic": "visual-identity",
    "nodes": [
      {
        "timestamp": 171234,
        "source": "meeting_id",
        "artifact": "sketch",
        "change_type": "refinement"
      }
    ],
    "timeline_density": 0.6,
    "integrity_hash": "sha256"
  }
}
```

### Key Field: `timeline_density` ⚡ (NOUVEAU!)
> **0.0-1.0 — measures how densely populated the timeline is with events**

### What It Enables ⚡
- replay evolution of a topic
- understand how an idea matured
- **see all versions without judgment** ⚡
- help agents stay consistent

---

## C) KNOWLEDGE THREAD — CROSS-USER THREAD ⚡

### Purpose
Reveal shared understanding between **PEOPLE or AGENTS** WITHOUT exposing private data, WITHOUT mixing identities, WITHOUT psychological influence.

### RULE
> **Cross-user thread = intersection of knowledge sets. NEVER inference of personalities or preferences.**

### Cross-User Components ⚡
| Component | Description |
|-----------|-------------|
| `user_group_id (team)` | ⚡ |
| `shared_topics` | ⚡ |
| `shared_replays` | ⚡ |
| `shared_artifacts` | ⚡ |
| `divergence_points (non-judgment)` | ⚡ |
| `overlap_score (neutral)` | ⚡ |

### Cross-User JSON ⚡

```json
{
  "knowledge_thread_cross_user": {
    "id": "uuid",
    "users": ["u1", "u2", "u3"],
    "shared_topics": ["XR-room", "workflow"],
    "shared_replays": ["rep1", "rep8"],
    "overlap_score": 0.42,
    "divergence_nodes": [
      { "topic": "XR-layout", "paths": 2 }
    ]
  }
}
```

### Key Fields ⚡ (NOUVEAU!)
| Field | Description |
|-------|-------------|
| `overlap_score` | **0.0-1.0 — neutral measure of shared knowledge** ⚡ |
| `divergence_nodes` | **points where understanding differs (non-judgmental)** ⚡ |

### What It Enables ⚡
- collaboration clarity
- shared memory mapping
- **team alignment metrics (neutral)** ⚡
- improved task delegation (non-authoritative)

---

## SAFETY & ETHICAL GUARANTEES (FOR ALL THREADS) ⚡

| Rule | Status |
|------|--------|
| **No emotional modeling** | ✅ ⚡ |
| **No predictive modelling of people** | ✅ ⚡ |
| **No autofill conclusions** | ✅ ⚡ |
| **No ranking of users or ideas** | ✅ ⚡ |
| **Immutable audit trail** | ✅ ⚡ |
| **Zero persuasive structures** | ✅ ⚡ |

---

## UNIFIED THREAD EXPORT FORMAT ⚡

```json
{
  "knowledge_threads": {
    "version": "1.0",
    "threads": [
      { "type": "intersphere", "..." },
      { "type": "internal", "..." },
      { "type": "cross_user", "..." }
    ],
    "hash": "sha256"
  }
}
```

---

**END — FREEZE READY**
