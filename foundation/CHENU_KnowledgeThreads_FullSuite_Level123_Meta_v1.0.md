# CHE·NU — FULL KNOWLEDGE THREAD SUITE
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## PURPOSE

> **Knowledge Threads = neutral connective tissue** linking: concepts, artifacts, meetings, agents, decisions — Across time, spheres, and users.

### RULE
> **Threads reveal structure, NOT meaning. Threads help navigation, NOT interpretation.**

---

## LEVEL 1 — INTRA-SPHERE KNOWLEDGE THREADS

### Scope
Inside **ONE sphere** (Business, Scholar, Creative, etc.)

### Use Cases ⚡
- link related tasks
- connect meetings on same topic
- associate documents and decisions
- **visualize progress inside a sphere** ⚡

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `topic_thread` | ⚡ |
| `artifact_thread` | ⚡ |
| `decision_thread` | ⚡ |
| `meeting_continuity_thread` | ⚡ |

### Level 1 JSON ⚡

```json
{
  "id": "uuid",
  "sphere": "business",
  "nodes": [
    { "type": "meeting", "id": "m1" },
    { "type": "artifact", "id": "doc31" },
    { "type": "decision", "id": "d12" }
  ],
  "reason": "shared_topic",
  "hash": "sha256"
}
```

### Visual Rules ⚡
| Property | Value |
|----------|-------|
| color | **sphere_primary_color** ⚡ |
| opacity | **confidence_level** ⚡ |
| glow | **active thread** ⚡ |

### Safety ⚡
- no inference about impact
- no prioritization
- **neutral directional arrows only** ⚡

---

## LEVEL 2 — INTER-SPHERE KNOWLEDGE THREADS

### Scope
Across **multiple spheres.**

### Purpose
Reveal cross-domain relevance **WITHOUT interpretation.**

### Examples ⚡
| From | To | Meaning |
|------|----|---------|
| Scholar | Business | research → opportunity |
| Creative | Social | media assets → reach |
| Institution | Methodology | rules → processes |
| **XR** | **Any sphere** | **visualization → clarity** ⚡ |

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `cross_topic_thread` | ⚡ |
| `cross_artifact_thread` | ⚡ |
| `cross_actor_thread` | ⚡ |
| `sphere_transition_thread` | ⚡ |

### Level 2 JSON (with overlaps array) ⚡

```json
{
  "id": "uuid",
  "spheres": ["scholar","business"],
  "nodes": [
    { "sphere":"scholar", "id":"r20", "type":"research" },
    { "sphere":"business", "id":"p5", "type":"project" }
  ],
  "reason": "conceptual_overlap",
  "overlaps": ["keywords","tags","timeline"],
  "integrity": "verified"
}
```

### Level 2 Fields ⚡
| Field | Description |
|-------|-------------|
| `overlaps` | **["keywords","tags","timeline"]** ⚡ |
| `integrity` | **"verified"** ⚡ |

### Routing Rules ⚡
| Rule | Status |
|------|--------|
| **inter-sphere threads appear ONLY on user request** | ✅ ⚡ |
| **never auto-highlighted** | ✅ ⚡ |
| **must show why link exists ("reason field")** | ✅ ⚡ |

### Visual Rules ⚡
| Property | Value |
|----------|-------|
| Style | **braided lines** ⚡ |
| Color | **dual-color gradient (sphereA → sphereB)** ⚡ |
| Effect | **soft pulse for active transitions** ⚡ |

---

## LEVEL 3 — META-KNOWLEDGE THREADS ⚡

### Scope
**Entire Che-Nu Universe.**

### Purpose
Trace structural patterns across time, spheres, users, and agents **WITHOUT prediction or recommendation.**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `temporal_meta_thread` | **patterns across months/years** ⚡ |
| `structural_meta_thread` | **shared architectures** ⚡ |
| `decision_meta_thread` | **timing, not meaning** ⚡ |
| `collective_memory_meta_thread` | **event clusters** ⚡ |

### Level 3 JSON (with patterns array) ⚡

```json
{
  "id": "uuid",
  "dimension": "meta",
  "patterns": [
    { "pattern": "recurring_event", "count": 8 },
    { "pattern": "sphere_chain", "sequence": ["creative","social","business"] }
  ],
  "source_threads": ["thread45","thread901"],
  "hash": "sha256"
}
```

### Level 3 Fields ⚡
| Field | Description |
|-------|-------------|
| `dimension` | **"meta"** ⚡ |
| `patterns` | **Array of {pattern, count/sequence}** ⚡ |
| `source_threads` | **Array of thread IDs** ⚡ |

### Meta Thread Rules ⚡
| Rule | Status |
|------|--------|
| no clustering based on psychology | ✅ |
| no prediction | ✅ |
| no optimization | ✅ |
| **no labeling patterns as success/failure** | ✅ ⚡ |
| **user MUST enable meta mode manually** | ✅ ⚡ |

### Visual Rules ⚡
| Property | Value |
|----------|-------|
| Lines | **golden lines (low opacity)** ⚡ |
| Layer | **galaxy layer "above" Universe View** ⚡ |
| Mode | **interactive but read-only** ⚡ |

---

## UNIVERSAL KNOWLEDGE THREAD ENGINE ⚡

### Activation ⚡
- manual, per sphere, per topic, per timeline, per replay

### Engine Logic (Neutral) ⚡
| Logic | Status |
|-------|--------|
| identify shared metadata | ✅ |
| **verify integrity hashes** | ✅ ⚡ |
| **link without weighting** | ✅ ⚡ |
| **expose structure, not interpretation** | ✅ ⚡ |

### Engine JSON ⚡

```json
{
  "knowledge_threads": {
    "level1": [...],
    "level2": [...],
    "level3": [...],
    "engine_version": "1.0",
    "integrity": "valid"
  }
}
```

---

## VISUALIZATION RULESET

### 2D ⚡
- straight lines, grouped clusters, collapsible tree

### 3D / XR ⚡
| Feature | Description |
|---------|-------------|
| **curved arcs** | ⚡ |
| **orbit paths** | ⚡ |
| **braided structures for inter-sphere** | ⚡ |
| **constellation mode for meta threads** | ⚡ |

---

## SAFETY & ETHICS

| Guarantee | Status |
|-----------|--------|
| No bias weighting | ✅ |
| No predictive analytics | ✅ |
| No psychological interpretation | ✅ |
| **No goal steering** | ✅ ⚡ |
| **No suggestion of "best path"** | ✅ ⚡ |

> **Threads = Cartography, NOT Coaching.**

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | builds from **metadata only** ⚡ |
| `AGENT_THREAD_GUARD` | prevents interpretive threads, **confirms compliance with law engine** ⚡ |
| `AGENT_THREAD_EXPLAINER` | displays "why this link exists", **never suggests intent or meaning** ⚡ |

---

## DELIVERABLES ⚡

| Deliverable | Status |
|-------------|--------|
| **JSON thread bundles** | ✅ |
| **XR thread overlays** | ✅ |
| **constellation mode** | ✅ |
| **thread diff viewer** | ✅ |
| **exportable PDF summaries** | ✅ |

---

**END — KNOWLEDGE THREAD SUITE (FREEZE-READY)**
