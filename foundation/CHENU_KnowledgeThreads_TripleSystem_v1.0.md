# CHE·NU — KNOWLEDGE THREADS (TRIPLE SYSTEM)
**VERSION:** CORE.KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / READ-ONLY INTELLIGENCE

---

## INTRO

> **Knowledge Thread (KT) = A structured, factual, cross-referencable connection between information units.**

### What Threads Are NOT
- ❌ NOT interpretation
- ❌ NOT advice
- ❌ NOT prediction
- ✅ JUST factual linkage

### 3 Types
1. **Inter-Sphere Threads**
2. **Personal Threads**
3. **Collective Threads**

### Common Properties
- immutability
- zero speculation
- transparency
- traceability

---

## 1) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Connect data, events, decisions, artifacts, across **MULTIPLE SPHERES** without mixing authorities.

### Examples
| From | To | Use Case |
|------|----|----------|
| Scholar | Business | research → product strategy |
| Creative | Social | content → market response |
| XR | Methodology | replays → optimization tests |

### RULE
> Thread links ONLY objective facts, identical identifiers, and time-stamped artifacts.  
> **Never merges meaning. Never merges intentions.**

### Inter-Sphere Thread Model

```json
{
  "inter_sphere_thread": {
    "id": "uuid",
    "origin_sphere": "scholar",
    "target_sphere": "business",
    "links": [
      {
        "source_artifact": "uuid",
        "destination_artifact": "uuid",
        "reason": "identical_topic|shared_reference|temporal_continuity",
        "timestamp": 1712345678
      }
    ],
    "integrity_hash": "sha256"
  }
}
```

### Inter-Sphere Rules
| Rule | Status |
|------|--------|
| Must have 2+ spheres | ✅ |
| Must point to validated artifacts | ✅ |
| Must include reason_code | ✅ |
| Must be visible on universe-graph | ✅ |
| Read-only, immutable | ✅ |

---

## 2) PERSONAL KNOWLEDGE THREADS

### Purpose
Allow the USER to build personal meaning structures **WITHOUT modifying objective knowledge.**

### Threads Link
- personal notes
- personal decisions
- personal conversations with agents
- favorites
- bookmarks
- private replays

### Properties
> **PRIVATE. LOCAL. NEVER shared unless explicit.**

### Personal Thread Model

```json
{
  "personal_thread": {
    "id": "uuid",
    "owner": "user_id",
    "nodes": [
      { "type": "note", "ref": "uuid" },
      { "type": "replay", "ref": "uuid" },
      { "type": "decision", "ref": "uuid" }
    ],
    "tags": ["custom-tag1", "tag2"],
    "visibility": "private|shared",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

### Personal Thread Rules
| Rule | Status |
|------|--------|
| Always reversible | ✅ |
| Always editable | ✅ |
| Never affects collective memory | ✅ |
| Never influences routing intelligence | ✅ |

---

## 3) COLLECTIVE KNOWLEDGE THREADS

### Purpose
Reflect relationships between shared artifacts based on the **Collective Memory** system.

> Forms the knowledge graph Che-Nu can navigate **FOR ANALYTICAL PURPOSES ONLY.**

### RULE
> **Collective thread = verified fact connection.**  
> No interpretation, no scoring.

### Collective Thread Model

```json
{
  "collective_thread": {
    "id": "uuid",
    "source_memory_id": "uuid",
    "target_memory_id": "uuid",
    "relationship": "followed_by|referenced_by|expanded_by|supported_by",
    "created_from": "collective_memory_hash",
    "verified": true
  }
}
```

### Collective Thread Rules
| Rule | Status |
|------|--------|
| Must derive from collective_memory only | ✅ |
| Must include integrity hash | ✅ |
| Must be explorable in universe view | ✅ |
| Cannot include personal data | ✅ |
| Cannot modify decisions or context | ✅ |

---

## THREAD VISUALIZATION (UNIFIED)

### 2D/3D Universe View Elements
- sphere clusters
- thread paths
- cross-sphere bridges
- private overlays (user only)

### Visual Styles

| Thread Type | Visual |
|-------------|--------|
| Inter-Sphere | wide arc lines |
| Personal | dotted path |
| Collective | stable thin line |

---

## THREAD SAFETY SYSTEM

| # | Rule |
|---|------|
| 1 | NO inference of user beliefs |
| 2 | NO merging of unrelated contexts |
| 3 | NO emotional color coding |
| 4 | NO ranking of threads (no "importance") |
| 5 | FULL transparency: hover to reveal "reason_code" |
| 6 | COMPLETE reversibility for personal threads |

---

## WHY THE 3 THREADS MATTER

| Thread Type | Connects |
|-------------|----------|
| **INTER-SPHERE** | System knowledge |
| **PERSONAL** | Personal understanding |
| **COLLECTIVE** | Shared truth |

### Result
> **A multi-layer knowledge ecosystem with ZERO psychological shaping**  
> **and MAXIMUM clarity, integrity, and navigabilité.**

---

**END — FREEZE-READY**
