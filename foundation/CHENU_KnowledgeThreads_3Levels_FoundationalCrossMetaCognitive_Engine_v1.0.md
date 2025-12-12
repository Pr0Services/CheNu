# CHE·NU — KNOWLEDGE THREAD SYSTEM
**VERSION:** Core.v1.0  
**TYPE:** TRUTH-PRESERVING / NON-MANIPULATIVE / IMMUTABLE LINKS

---

## KNOWLEDGE THREADS — PURPOSE

> **Create a TRACEABLE WEB OF FACTS** across: spheres, meetings, artifacts, decisions, users (optional), agents

**NOT interpretations. NOT summaries. ONLY verifiable trace chains.**

---

## LEVEL 1 — FOUNDATIONAL THREADS

### Definition
Links factual elements **directly from Collective Memory.**

### Examples ⚡
- Meeting A produced Artifact X
- Artifact X referenced Document Y
- Document Y triggered Meeting B
- **Decision D reused Data Z** ⚡

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **Immutable** | ✅ ⚡ |
| **Time-ordered** | ✅ ⚡ |
| **Fact-to-fact only** | ✅ ⚡ |
| **No inferred relationships** | ✅ ⚡ |

### Foundational Thread JSON ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "foundational",
    "chain": [
      { "ref": "memory_id", "timestamp": "...", "kind": "event|artifact|decision" }
    ],
    "hash": "sha256"
  }
}
```

### Foundational Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **"foundational"** ⚡ |
| `chain[].kind` | **event/artifact/decision** ⚡ |

---

## LEVEL 2 — CROSS-SPHERE THREADS

### Definition
Links events across multiple spheres **WITHOUT interpretation.**

### Purpose
> **Show how knowledge flows across domains.**

### Examples ⚡
| Flow | Description |
|------|-------------|
| Scholar lesson → Business decision | ⚡ |
| XR replay → Methodology refinement | ⚡ |
| Creative prototype → Social media brief | ⚡ |
| **Institution guideline → Business compliance update** | ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| Only factual cross-references | ✅ |
| **Must show origin sphere** | ✅ ⚡ |
| **Must show target sphere** | ✅ ⚡ |
| **No causal language (only sequence)** | ✅ ⚡ |

### Cross-Sphere Thread JSON ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "cross_sphere",
    "links": [
      { "from": "sphere_A", "memory": "id1" },
      { "to":   "sphere_B", "memory": "id2" }
    ]
  }
}
```

### Cross-Sphere Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **"cross_sphere"** ⚡ |
| `links[].from` / `links[].to` | **Sphere names** ⚡ |

---

## LEVEL 3 — META-COGNITIVE THREADS ⚡

### Definition
Threads that reflect **HOW knowledge evolved** over time.

### Includes ⚡
| Element | Description |
|---------|-------------|
| **changes of understanding** | ⚡ |
| **updated artifacts** | ⚡ |
| **re-opened decisions** | ⚡ |
| **methodological refinements** | ⚡ |
| **reductions of uncertainty** | ⚡ |

### Purpose
> **Show INTELLECTUAL progress, NOT emotional progress or persuasion.**

### Rules ⚡
| Rule | Status |
|------|--------|
| **must be purely descriptive** | ✅ ⚡ |
| **must link to replayed evidence** | ✅ ⚡ |
| **must track versioning of artifacts** | ✅ ⚡ |

### Meta-Cognitive Thread JSON (with evolution + confidence) ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "meta_cognitive",
    "evolution": [
      { "version": 1, "artifact": "idA", "timestamp": "..." },
      { "version": 2, "artifact": "idB", "timestamp": "..." }
    ],
    "confidence": "0.0–1.0 (mechanical, not emotional)"
  }
}
```

### Meta-Cognitive Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **"meta_cognitive"** ⚡ |
| `evolution` | **Array of {version, artifact, timestamp}** ⚡ |
| `confidence` | **0.0–1.0 (mechanical, not emotional)** ⚡ |

---

## UNIFIED THREAD ENGINE SPEC ⚡

### Thread Engine Produces ⚡
| Output | Description |
|--------|-------------|
| **foundational chains** | ⚡ |
| **cross-sphere maps** | ⚡ |
| **meta-evolution graphs** | ⚡ |

### Thread Engine NEVER ⚡
| Forbidden | Status |
|-----------|--------|
| **infers causality** | ❌ ⚡ |
| **ranks importance** | ❌ ⚡ |
| **suggests next steps** | ❌ ⚡ |
| **filters information** | ❌ ⚡ |

### Thread Engine ALWAYS ⚡
| Required | Status |
|----------|--------|
| **preserves chronology** | ✅ ⚡ |
| **shows sources explicitly** | ✅ ⚡ |
| **uses immutable hashes** | ✅ ⚡ |

---

## THREAD EXPORT FORMATS ⚡

| Format | Description |
|--------|-------------|
| `.thread.json` | **raw data** ⚡ |
| `.trace.pdf` | **human readable** ⚡ |
| `.xr-weave` | **XR visualization bundle** ⚡ |

---

**END — KNOWLEDGE THREADS v1.0**
