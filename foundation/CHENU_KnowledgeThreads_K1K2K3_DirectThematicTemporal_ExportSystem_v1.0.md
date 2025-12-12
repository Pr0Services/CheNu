# CHE·NU — KNOWLEDGE THREADS (K1–K3) + EXPORT SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## OVERVIEW

> Knowledge Threads = chaînes d'information vérifiable, tissées entre sphères, meetings, replays, agents, artifacts.

### RULE
> **A Knowledge Thread NEVER infers intention. It only connects validated facts.**

> **KT is append-only, cryptographically linked, and auditable.**

---

## K1 — DIRECT THREADS (FACT → FACT)

### Purpose
Connect explicit facts across meetings, documents, or spheres. e.g. "This artifact was reused", "This decision referenced X".

### Triggers ⚡
| Trigger | Description |
|---------|-------------|
| **re-use of an artifact** | ⚡ |
| **explicit mention in meeting** | ⚡ |
| **direct replay linkage (same timestamp event)** | ⚡ |

### Thread Structure ⚡
> `fact —related_to→ fact`

### K1 Direct Thread JSON (with cause types) ⚡

```json
{
  "thread": {
    "type": "direct",
    "origin": "event_id",
    "target": "event_id",
    "cause": "reuse|reference|continuation",
    "hash": "sha256"
  }
}
```

### K1 Fields ⚡
| Field | Description |
|-------|-------------|
| `cause` | **reuse/reference/continuation** ⚡ |

### Constraints ⚡
| Constraint | Status |
|------------|--------|
| **must be explicit (no guessing)** | ✅ ⚡ |
| no summarization of meaning | ✅ |
| **no importance ranking** | ✅ ⚡ |

### Use Cases ⚡
- traceability
- audit logs
- **research continuity** ⚡

---

## K2 — THEMATIC THREADS (TOPIC → TOPIC)

### Purpose
Link facts and artifacts into shared themes across spheres, **WITHOUT emotional, political, or interpretative influence.**

### Theme Examples ⚡
- "Budget Planning"
- "Research Continuity"
- **"Creative Development Flow"** ⚡

### Thread Structure ⚡
```
fact —classified_as→ theme
theme —extends_to→ other theme
```

### Generation Rules ⚡
| Rule | Status |
|------|--------|
| **strictly user-defined themes OR explicit tags** | ✅ ⚡ |
| **NO auto-discovery of sentiment or latent meaning** | ✅ ⚡ |
| **multi-sphere compatible** | ✅ ⚡ |

### K2 Thematic Thread JSON (with scope array) ⚡

```json
{
  "thread": {
    "type": "thematic",
    "theme": "string",
    "elements": ["event_id", "artifact_id", ...],
    "scope": ["business","scholar","creative"],
    "version": 1
  }
}
```

### K2 Fields ⚡
| Field | Description |
|-------|-------------|
| `theme` | **String theme name** ⚡ |
| `scope` | **Array of sphere names** ⚡ |

### Constraints ⚡
| Constraint | Status |
|------------|--------|
| **cannot override user's chosen theme** | ✅ ⚡ |
| **cannot merge themes without user command** | ✅ ⚡ |
| **must remain descriptive, neutral** | ✅ ⚡ |

### Use Cases ⚡
- large-scale knowledge organization
- **cross-sphere research** ⚡
- **project long-term memory** ⚡

---

## K3 — TEMPORAL THREADS (TIME → TIME)

### Purpose
Link events by chronological continuity, showing how knowledge evolves over time **WITHOUT implying progress or regress.**

### Thread Structure ⚡
> `event(t1) —precedes→ event(t2)`

### Temporal Types ⚡
| Type | Description |
|------|-------------|
| `linear` | strict chronology |
| `segmented` | **per sphere or project** ⚡ |
| `braided` | **multi-thread across meetings** ⚡ |

### K3 Temporal Thread JSON (with mode) ⚡

```json
{
  "thread": {
    "type": "temporal",
    "chain": [
      { "event": "uuid", "timestamp": 1712345 },
      { "event": "uuid", "timestamp": 1712389 }
    ],
    "mode": "linear|segmented|braided"
  }
}
```

### K3 Fields ⚡
| Field | Description |
|-------|-------------|
| `chain` | **Array of {event, timestamp}** ⚡ |
| `mode` | **linear/segmented/braided** ⚡ |

### Constraints ⚡
| Constraint | Status |
|------------|--------|
| no "better/worse" | ✅ |
| **no causality inference** | ✅ ⚡ |
| **only temporal adjacency** | ✅ ⚡ |

### Use Cases ⚡
- history navigation
- **replay storyline visualization** ⚡
- **consistency checking** ⚡

---

## THREAD INTEGRITY ENGINE ⚡

### Thread Storage ⚡
Each thread stored with:
- sha256 integrity hash
- replay source reference
- timestamp
- sphere mapping
- **user permission level** ⚡

### THREAD_BLOCK FORMAT ⚡

```json
{
  "id": "uuid",
  "thread_type": "direct|thematic|temporal",
  "hash_prev": "sha256_or_null",
  "hash_current": "sha256",
  "payload": {...}
}
```

> **This forms a CHAIN OF TRUST.** ⚡

---

## KNOWLEDGE THREAD EXPORT SYSTEM ⚡

### Purpose
Allow safe sharing of threads across users or organizations, **WITHOUT leaking private content or intent.**

### Export Types ⚡
| Level | Content |
|-------|---------|
| **1) Minimal Export** | structure only ⚡ |
| **2) Medium Export** | structure + IDs ⚡ |
| **3) Full Export** | structure + content excerpts ⚡ |

### RULE
> **Export MUST respect visibility permissions.**

### Export Formats ⚡

| Format | Contents |
|--------|----------|
| **KT-PACK (.ktpack)** | thread blocks, integrity chain, replay references, **permission manifest** ⚡ |
| **PDF SUMMARY** | visual diagram, nodes + connections, timeline, **cryptographic integrity footer** ⚡ |
| **THREAD-TO-SPHERE MAP** | sphere involvement, **filtered for user privacy** ⚡ |

### Export JSON Spec ⚡

```json
{
  "kt_export": {
    "format": "ktpack|pdf|sphere_map",
    "thread_ids": ["uuid","uuid"],
    "visibility": "minimal|medium|full",
    "export_hash": "sha256",
    "generated_at": "...",
    "creator_id": "user_uuid"
  }
}
```

### Export Fields ⚡
| Field | Description |
|-------|-------------|
| `format` | **ktpack/pdf/sphere_map** ⚡ |
| `visibility` | **minimal/medium/full** ⚡ |
| `export_hash` | **SHA256 integrity** ⚡ |

### Safety & Privacy Guarantees ⚡
| Guarantee | Status |
|-----------|--------|
| **never exports private messages unless explicitly allowed** | ✅ ⚡ |
| **anonymizes participants if required** | ✅ ⚡ |
| preserves chronological truth | ✅ |
| **zero interpretation, zero bias** | ✅ ⚡ |
| **user must confirm export scope** | ✅ ⚡ |

---

## WHY K1 + K2 + K3 + EXPORT MATTER ⚡

| Component | Function |
|-----------|----------|
| **K1** | Shows factual continuity |
| **K2** | Shows conceptual organization |
| **K3** | Shows chronological evolution |
| **EXPORT** | Makes knowledge portable, safe, verifiable |

### Philosophy ⚡
> A knowledge system that **remembers without controlling**, **structures without shaping**, **connects without interpreting.**

---

**END — FREEZE COMPATIBLE**
