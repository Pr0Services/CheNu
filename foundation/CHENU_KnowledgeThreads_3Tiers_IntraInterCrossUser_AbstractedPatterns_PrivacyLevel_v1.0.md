# CHE·NU — KNOWLEDGE THREAD SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## PURPOSE

> **Create "Knowledge Threads": neutral links** between facts, decisions, artifacts, or events across spheres, meetings, and user contexts.

### RULE
> **THREADS = RELATIONSHIPS BETWEEN FACTS. NOT assumptions, NOT predictions, NOT biases.**

---

## TIER 1 — INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Scope
Links facts, artifacts, tasks, or decisions **INSIDE a single sphere.**

### Examples ⚡
| Sphere | Flow |
|--------|------|
| **Business** | lead → proposal → invoice ⚡ |
| **Scholar** | lesson → quiz → project ⚡ |
| **Creative** | sketch → prototype → render ⚡ |
| **Institution** | rule → audit → compliance check ⚡ |

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `sequence` | A → B ⚡ |
| `reference` | A cites B ⚡ |
| `refinement` | **B is improved version of A** ⚡ |
| `dependency` | A requires B ⚡ |

### Tier 1 JSON ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "tier": "intra",
    "sphere": "business|scholar|creative|...",
    "nodes": ["fact_id", "artifact_id", "event_id"],
    "relations": ["sequence|reference|refinement|dependency"],
    "timestamp": "...",
    "hash": "sha256"
  }
}
```

### Tier 1 Rules ⚡
| Rule | Status |
|------|--------|
| **sphere-scoped only** | ✅ ⚡ |
| **no inference beyond recorded facts** | ✅ ⚡ |
| **immutable once validated** | ✅ ⚡ |
| **user-controlled visibility** | ✅ ⚡ |

---

## TIER 2 — INTER-SPHERE KNOWLEDGE THREADS ⚡

### Scope
Links related content **ACROSS different spheres**, without generating meaning or interpretation.

### Purpose
Show structural relationships in the user's universe.

### Examples ⚡
| From | To | Description |
|------|-----|-------------|
| Scholar research | → Business decisions | ⚡ |
| Creative assets | → Social media | ⚡ |
| Institutional rule | → XR meeting logs | ⚡ |

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `cross_reference` | ⚡ |
| `shared_artifact` | ⚡ |
| `shared_topic` | ⚡ |
| `cross_dependency` | ⚡ |

### Tier 2 JSON ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "tier": "inter",
    "spheres": ["scholar", "business"],
    "anchors": [
      { "from": "fact_A", "sphere": "scholar" },
      { "to": "artifact_B", "sphere": "business" }
    ],
    "relation": "shared_topic|cross_ref|dependency",
    "hash": "sha256"
  }
}
```

### Tier 2 Rules ⚡
| Rule | Status |
|------|--------|
| **must be fact-based** | ✅ ⚡ |
| **no causal language** | ✅ ⚡ |
| **no predictions** | ✅ ⚡ |
| **users explicitly enable cross-sphere visibility** | ✅ ⚡ |

### Universe View ⚡
> **Renders inter-sphere threads as soft orbit-lines. Never centers them. Never biases navigation.**

---

## TIER 3 — CROSS-USER / CROSS-AGENT KNOWLEDGE THREADS ⚡ (NOUVEAU!)

### Purpose
Enable structural linking across users or agents, **WITHOUT violating privacy or exposing personal data.**

### RULE
> **THREADS NEVER SHARE PERSONAL CONTENT. ONLY anonymized structures or schema-level patterns.**

### Examples ⚡
| Example | Description |
|---------|-------------|
| Multiple users creating similar workflow sequences | ⚡ |
| Agents reusing similar methodology structures | ⚡ |
| **XR meeting patterns (pure structure, no content)** | ⚡ |

### Tier 3 JSON ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "tier": "cross_user",
    "pattern_type": "workflow|timeline|artifact_structure",
    "abstracted_nodes": ["shape_A", "shape_B"],
    "source_count": 12,
    "privacy_level": "high",
    "hash": "sha256"
  }
}
```

### Key Fields ⚡ (NOUVEAU!)
| Field | Description |
|-------|-------------|
| `pattern_type` | **workflow/timeline/artifact_structure** ⚡ |
| `abstracted_nodes` | **shapes only, no content** ⚡ |
| `source_count` | **number of sources** ⚡ |
| `privacy_level` | **"high"** ⚡ |

### Abstraction Methods ⚡
| Method | Status |
|--------|--------|
| **remove all text** | ✅ ⚡ |
| **remove identity** | ✅ ⚡ |
| **remove timestamps** | ✅ ⚡ |
| **reduce to structure only** | ✅ ⚡ |

### ALLOWED ⚡
> **"Many users followed pattern X → Y → Z"**

### NOT ALLOWED ⚡
| Forbidden | Status |
|-----------|--------|
| **"User A is similar to user B"** | ❌ ⚡ |
| **"User A tends to…"** | ❌ ⚡ |

---

## THREAD SAFETY & ETHICS ⚡

### Threads MUST ⚡
| Rule | Status |
|------|--------|
| **be factual** | ✅ ⚡ |
| **be reversible (can delete)** | ✅ ⚡ |
| **be transparent in UI** | ✅ ⚡ |
| **show origin on demand (if user permission)** | ✅ ⚡ |
| **never be used to infer emotional or psychological data** | ✅ ⚡ |

### Threads MUST NOT ⚡
| Forbidden | Status |
|-----------|--------|
| **score users** | ❌ ⚡ |
| **recommend behavior** | ❌ ⚡ |
| **produce predictions** | ❌ ⚡ |
| **create bias** | ❌ ⚡ |

---

## THREAD ENGINE — ORCHESTRATION LOGIC ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **constructs threads from validated inputs, only structural mapping** ⚡ |
| `AGENT_THREAD_GUARD` | **prevents inference or bias, enforces privacy & ethical limits** ⚡ |
| `AGENT_THREAD_RENDERER` | displays threads in: universe view, sphere dashboards, XR overlays ⚡ |

---

## THREAD OVERLAY — XR / 2D ⚡

### XR ⚡
| Feature | Description |
|---------|-------------|
| floating lines | ⚡ |
| no animation spikes | ⚡ |
| **low opacity** | ⚡ |
| user toggles visibility | ⚡ |

### 2D ⚡
| Feature | Description |
|---------|-------------|
| nodes + edges graph | ⚡ |
| **color by tier** | ⚡ |
| click to expand | ⚡ |

---

## THREAD EXPORT ⚡

### Export Formats ⚡
| Format | Description |
|--------|-------------|
| `thread_json` | ⚡ |
| `structural_pdf` | ⚡ |
| `universe_map_snapshot` | ⚡ |

### Export Rules ⚡
| Rule | Status |
|------|--------|
| **anonymized by default** | ✅ ⚡ |
| **personal thread export requires explicit user action** | ✅ ⚡ |

---

## WHY THIS MATTERS ⚡

**Threads Give:**
- clarity
- structure
- truth-tracing
- cross-domain understanding

**WITHOUT:**
- persuasion
- bias
- emotional shaping
- interpretative overlays

---

**END — THREAD FOUNDATION FREEZE**
