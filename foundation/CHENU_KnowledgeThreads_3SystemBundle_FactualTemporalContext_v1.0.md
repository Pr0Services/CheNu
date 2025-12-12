# CHE·NU — KNOWLEDGE THREADS (3-SYSTEM BUNDLE)
**TYPE:** CROSS-SPHERE INTELLIGENCE LAYER  
**PURPOSE:** LINK INFORMATION WITHOUT INTERPRETING IT

---

## RULE
> **NO PREDICTION • NO OPINION • NO INFERENCE**  
> **ONLY TRACEABLE CONNECTIONS BETWEEN FACTUAL DATA**

---

## KT SYSTEM #1 — FACTUAL THREADS

### Purpose
Connect objective pieces of knowledge across spheres.

### Examples
- A document in Business sphere connects to a meeting note
- A diagram in Scholar connects to a Creative plan
- A decision log connects to an Institution compliance rule

### Thread Logic ⚡
**IF two items share:**
- topic terms, metadata tags, referenced artifacts, replay IDs, participants

**→ Link them with a FACTUAL THREAD.**

### Factual Thread JSON (with reason array + confidence) ⚡

```json
{
  "thread_fact": {
    "id": "uuid",
    "source_a": "object_id",
    "source_b": "object_id",
    "reason": ["shared_topic","shared_artifact","shared_participant"],
    "confidence": 0.0-1.0,
    "timestamp": "...",
    "immutable": true
  }
}
```

### Factual Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `source_a` / `source_b` | **Object IDs** ⚡ |
| `reason` | **Array of reasons** ⚡ |
| `confidence` | **0.0-1.0 score** ⚡ |
| `immutable` | **true** ⚡ |

### Visual Representation ⚡
| Property | Value |
|----------|-------|
| Line | **thin neutral line** |
| Color | **no color coding** ⚡ |
| Weight | **no weight differentiation** ⚡ |
| Halo | **optional for "verified source"** ⚡ |

### Ethical Locks ⚡
| Lock | Status |
|------|--------|
| **No importance ranking** | ✅ ⚡ |
| **No suggestion of relevance** | ✅ ⚡ |
| **No predictive linking** | ✅ ⚡ |

---

## KT SYSTEM #2 — TEMPORAL THREADS

### Purpose
Connect events, artifacts, and decisions across **TIME.**

### Temporal Thread Types ⚡
| Type | Description |
|------|-------------|
| **SEQUENCE** | A happened before B in same sphere ⚡ |
| **CROSS-SPHERE SEQUENCE** | A (Scholar) before B (Business) ⚡ |
| **CAUSAL CLAIM BLOCK** | System NEVER infers causation ⚡ |

### Critical Rule ⚡
> **Only "temporal adjacency" — NEVER causation**

### Temporal Thread JSON (with ordering array) ⚡

```json
{
  "thread_temporal": {
    "id": "uuid",
    "objects": ["obj1","obj2","obj3"],
    "ordering": ["obj1","obj2","obj3"],
    "context": "meeting|project|sphere",
    "timestamp_created": "...",
    "notes": "adjacent events only"
  }
}
```

### Temporal Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `objects` | **Array of object IDs** ⚡ |
| `ordering` | **Ordered array** ⚡ |
| `context` | **meeting/project/sphere** ⚡ |
| `notes` | **"adjacent events only"** ⚡ |

### Visualization ⚡
| Property | Value |
|----------|-------|
| Style | **horizontal braid** ⚡ |
| Spacing | **uniform spacing** |
| Markers | **timestamp markers only** |
| Weight | **no weighting / no "impact score"** ⚡ |

### Ethical Guard ⚡
**System REFUSES to output:**
- "X happened because of Y"
- "X influenced Y"

**Only:**
- **"X occurred before Y"**

---

## KT SYSTEM #3 — INTERPRETATION-SAFE CONTEXT THREADS

### Purpose
Provide contextual adjacency **WITHOUT interpretation or meaning.**

> **This protects the system from accidental narrative creation.**

### Contextual Adjacency Rules ⚡
**A and B have a THREAD if:**
- They occur in the same sphere within close time
- They share participants
- They use the same artifact
- They appear in the same replay window

### NOT Allowed ⚡
| Forbidden | Status |
|-----------|--------|
| **inferred meaning** | ❌ |
| **sentiment** | ❌ |
| **motive** | ❌ |
| **conclusion** | ❌ |
| **recommendation** | ❌ |

### Context Thread JSON (with exclusions array) ⚡

```json
{
  "thread_context": {
    "id": "uuid",
    "cluster_id": "uuid",
    "items": ["object_id", "..."],
    "shared_properties": ["same_sphere","shared_user","shared_agent"],
    "exclusions": ["motive","prediction","evaluation"],
    "visibility": "user|team|public"
  }
}
```

### Context Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `cluster_id` | **UUID cluster** ⚡ |
| `shared_properties` | **Array of shared attributes** ⚡ |
| `exclusions` | **["motive","prediction","evaluation"]** ⚡ |

### Visualization ⚡
| Property | Value |
|----------|-------|
| Style | **soft clusters** ⚡ |
| Pull | **no gravitational pull** ⚡ |
| Grouping | **nodes gently grouped** |
| Center | **no "importance center"** ⚡ |

---

## THREAD ENGINE — UNIFIED MODEL ⚡

### Thread Engine MUST: ⚡
| Requirement | Status |
|-------------|--------|
| **run offline / async** | ✅ ⚡ |
| **log every decision** | ✅ ⚡ |
| **produce reversible threads** | ✅ ⚡ |
| **allow user override** | ✅ ⚡ |
| **never hide unlinked data** | ✅ ⚡ |
| **provide EXPORT and DELETE tools** | ✅ ⚡ |

### Thread Engine JSON ⚡

```json
{
  "thread_engine": {
    "fact_threads": [...],
    "temporal_threads": [...],
    "context_threads": [...],
    "hash": "sha256",
    "version": "1.0",
    "audit_log": [...]
  }
}
```

---

## SAFETY RULES ⚡

| # | Rule |
|---|------|
| 1 | **NO influence scoring** |
| 2 | **NO recommendations** |
| 3 | **NO predictive linking** |
| 4 | **NO semantic interpretation** |
| 5 | **ONLY explicit metadata + timestamps** |
| 6 | **User can disable all thread types** |
| 7 | **Export bundle is fully transparent** |

---

## WHY THE 3 THREADS EXIST

| Thread | Question |
|--------|----------|
| **FACTUAL** | What connects |
| **TEMPORAL** | When it connects |
| **CONTEXT** | Where it sits |

### Together: ⚡
- **they NEVER form meaning**
- **they NEVER guide decisions**
- **they ONLY provide structure**

---

**END — KNOWLEDGE THREADS PACK (FREEZE READY)**
