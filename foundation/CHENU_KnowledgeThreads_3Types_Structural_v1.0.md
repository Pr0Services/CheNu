# CHE·NU — KNOWLEDGE THREAD SYSTEM (3 TYPES STRUCTURAL)
**VERSION:** FOUNDATION v1.0  
**TYPE:** STRUCTURAL KNOWLEDGE / NON-MANIPULATIVE

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE LINE** of related facts, events, artifacts, and decisions across time and spheres.

### CORE PRINCIPLES
> **THREADS CONNECT INFORMATION.**  
> **THEY DO NOT CONCLUDE.**  
> **THEY DO NOT JUDGE.**

---

## THREAD TYPE 1 — FACT THREAD

### Purpose
Link objective facts and verifiable events across meetings, documents, and time.

### Sources
- XR replay events, meeting logs, artifacts, decisions (timestamped)

### Characteristics ⚡
| Characteristic | Status |
|----------------|--------|
| append-only | ✅ |
| immutable once validated | ✅ |
| fully traceable to source | ✅ |
| **cryptographically signed** | ✅ ⚡ |

### Visual Representation ⚡
| Property | Value |
|----------|-------|
| Style | **solid line** ⚡ |
| Color | **neutral color** |
| Animation | **no animation** ⚡ |

### Fact Thread JSON (with scope + integrity) ⚡

```json
{
  "fact_thread": {
    "id": "uuid",
    "nodes": ["event_id","artifact_id","decision_id"],
    "scope": "private|team|public",
    "created_at": 1712345678,
    "integrity": "verified",
    "hash": "sha256"
  }
}
```

### Fact Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes` | **["event_id","artifact_id","decision_id"]** ⚡ |
| `scope` | **private/team/public** ⚡ |
| `integrity` | **"verified"** |

### Restrictions ⚡
| Restriction | Status |
|-------------|--------|
| no opinions | ✅ |
| **no inferred intent** | ✅ ⚡ |
| no weighting | ✅ |

---

## THREAD TYPE 2 — CONTEXT THREAD

### Purpose
Provide situational understanding around facts **WITHOUT altering the facts themselves.**

### Sources
- meeting type, sphere, participants, environmental state, **silence intervals** ⚡

### Characteristics ⚡
| Characteristic | Status |
|----------------|--------|
| layered on top of fact threads | ✅ |
| hideable | ✅ |
| optional | ✅ |
| **cannot modify fact thread** | ✅ ⚡ |

### Visual Representation ⚡
| Property | Value |
|----------|-------|
| Style | **dotted line** ⚡ |
| Opacity | **low-opacity aura** ⚡ |
| Layer | **toggleable layer** |

### Context Thread JSON (with linked_fact_thread + override_allowed) ⚡

```json
{
  "context_thread": {
    "id": "uuid",
    "linked_fact_thread": "uuid",
    "context_nodes": ["meeting_context","sphere","agents"],
    "visibility": "user-controlled",
    "override_allowed": false
  }
}
```

### Context Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `linked_fact_thread` | **UUID reference** ⚡ |
| `context_nodes` | **["meeting_context","sphere","agents"]** ⚡ |
| `visibility` | **"user-controlled"** ⚡ |
| `override_allowed` | **false** ⚡ |

### Restrictions ⚡
| Restriction | Status |
|-------------|--------|
| **no semantic transformation** | ✅ ⚡ |
| **no narrative framing** | ✅ ⚡ |

---

## THREAD TYPE 3 — KNOWLEDGE DERIVATION THREAD

### Purpose
Track how knowledge was **BUILT over time** from facts → interpretations → hypotheses.

### IMPORTANT ⚡
> **This thread represents THINKING PROCESS, not truth.**

### Sources
- user annotations, agent analysis outputs, methodology applications

### Characteristics ⚡
| Characteristic | Status |
|----------------|--------|
| **clearly marked as derivative** | ✅ ⚡ |
| **never merges back into facts** | ✅ ⚡ |
| **versioned and reversible** | ✅ ⚡ |

### Visual Representation ⚡
| Property | Value |
|----------|-------|
| Style | **dashed line** ⚡ |
| Color | **color-coded per author** ⚡ |
| Structure | **branching allowed** ⚡ |

### Derivation Thread JSON (with derivations array + confidence) ⚡

```json
{
  "derivation_thread": {
    "id": "uuid",
    "source_fact_threads": ["uuid"],
    "derivations": [
      {
        "author": "user|agent_id",
        "type": "hypothesis|analysis|summary",
        "timestamp": 1712345678
      }
    ],
    "confidence": "declared_only"
  }
}
```

### Derivation Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `source_fact_threads` | **Array of UUIDs** ⚡ |
| `derivations[].author` | **"user\|agent_id"** ⚡ |
| `derivations[].type` | **"hypothesis\|analysis\|summary"** ⚡ |
| `confidence` | **"declared_only"** ⚡ |

### Restrictions ⚡
| Restriction | Status |
|-------------|--------|
| **must always link to facts** | ✅ ⚡ |
| **cannot propagate automatically** | ✅ ⚡ |
| **cannot be ranked as truth** | ✅ ⚡ |

---

## THREAD INTERACTIONS & SAFETY

| Rule | Status |
|------|--------|
| Fact Threads are immutable | ✅ |
| Context Threads are optional overlays | ✅ |
| **Derivation Threads never overwrite facts** | ✅ ⚡ |
| Threads can be viewed together or isolated | ✅ |
| **All crossings are explicitly marked** | ✅ ⚡ |

---

## UNIVERSE VIEW INTEGRATION

### Features ⚡
| Feature | Description |
|---------|-------------|
| Threads | render as **spatial links** ⚡ |
| Cross-sphere | show **orbit bridges** ⚡ |

### User Filters ⚡
| Filter | Available |
|--------|-----------|
| by thread type | ✅ |
| **by author** | ✅ ⚡ |
| by sphere | ✅ |

### Critical Rule ⚡
> **No auto-collapse of alternatives**

---

## WHY THIS MATTERS

This system:
- **separates truth from interpretation**
- **prevents narrative hijacking**
- **preserves intellectual honesty**
- **allows disagreement without distortion**

---

**END — KNOWLEDGE THREAD FOUNDATION**
