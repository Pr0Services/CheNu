# CHE·NU — KNOWLEDGE THREAD SYSTEM (ENGINE + OVERLAY)
**VERSION:** MEMORY.v2.0  
**MODE:** FOUNDATION / IMMUTABLE / NON-MANIPULATIVE

---

## OVERVIEW

> **Knowledge Threads = verified chains of factual information** woven across:
> meetings, artifacts, replays, spheres, timelines, agent outputs

### Core Principles
- ❌ NEVER interpretive
- ❌ NEVER predictive
- ❌ NEVER prescriptive

---

## THREAD TYPE 1 — INTRA-SPHERE KNOWLEDGE THREAD

### Purpose
Connect related information **INSIDE a single sphere** (Business, Scholar, Creative, Social, Government, XR, etc.)

### Allowed Links
- documents referencing same topic
- decisions tied to same project
- recurring tasks
- meeting sequences
- artifacts reused across steps

### JSON Model (with link reasons) ⚡

```json
{
  "thread_id": "uuid",
  "type": "intra_sphere",
  "sphere": "business|scholar|creative|...",
  "nodes": [
    { "id": "uuid", "type": "meeting|artifact|note|replay", "timestamp": 1712345678 }
  ],
  "links": [
    { "from": "id", "to": "id", "reason": "same_project|same_topic|follow_up" }
  ],
  "integrity_hash": "sha256"
}
```

### Link Reasons (Intra-Sphere) ⚡
| Reason | Description |
|--------|-------------|
| `same_project` | Part of same project |
| `same_topic` | Related topic |
| `follow_up` | Continuation |

### Rules
| Rule | Status |
|------|--------|
| same sphere only | ✅ |
| no inference | ✅ |
| no deduced relationships | ✅ |
| explicit references only | ✅ |

### Output Possibilities
- timeline threads
- dependency chains
- project narrative (non-emotional)
- backlink map

---

## THREAD TYPE 2 — CROSS-SPHERE KNOWLEDGE THREAD

### Purpose
Connect factual information **ACROSS spheres**, without hierarchy or influence.

### Examples
- Scholar research → Business project
- Creative design → Social campaign
- Methodology improvement → XR workflows

### JSON Model (with origin)

```json
{
  "thread_id": "uuid",
  "type": "cross_sphere",
  "spheres": ["scholar","business","creative"],
  "nodes": [],
  "links": [
    { "from": "id", "to": "id", "reason": "referenced_in|dependent_on|reused_in" }
  ],
  "origin": "manual|validated_agent"
}
```

### Link Reasons (Cross-Sphere) ⚡
| Reason | Description |
|--------|-------------|
| `referenced_in` | Cited in another sphere |
| `dependent_on` | Requires for function |
| `reused_in` | Asset reused |

### Rules
| Rule | Status |
|------|--------|
| links require explicit traceability | ✅ |
| no automatic sphere jumping | ✅ |
| user or agent must confirm validity | ✅ |

### Safety
- ❌ no semantic guesswork
- ❌ no conceptual blending beyond traceable sources
- ❌ no cross-sphere bias toward any domain

---

## THREAD TYPE 3 — TEMPORAL KNOWLEDGE THREAD (with delta) ⚡

### Purpose
Track how knowledge evolves over time: **NOT interpretation, NOT performance, NOT prediction.**

> **Pure factual evolution.**

### JSON Model (with stability_index + change_type + delta)

```json
{
  "thread_id": "uuid",
  "type": "temporal",
  "timeline": [
    {
      "timestamp": "2024-04-06T12:00:00Z",
      "reference_id": "uuid",
      "source_type": "artifact|replay|decision|memory",
      "change_type": "added|modified|superseded",
      "delta": {}
    }
  ],
  "stability_index": 0.85
}
```

### Change Types ⚡
| Type | Description |
|------|-------------|
| `added` | New entry |
| `modified` | Changed from previous |
| `superseded` | Replaced by newer |

### Stability Index ⚡
> **0.0–1.0** measuring how stable the knowledge has been over time
- 1.0 = very stable, no changes
- 0.0 = frequently changing

### Rules
| Rule | Status |
|------|--------|
| append-only | ✅ |
| cryptographically locked | ✅ |
| time-ordered | ✅ |
| no sentiment labels | ✅ |
| no improvement scoring | ✅ |

### Uses
- historical audits
- compliance checks
- reconstruction of project evolution
- XR replay evolution mapping

---

## UNIFIED KNOWLEDGE THREAD ENGINE ⚡

### Engine Input
- replay metadata
- meeting logs
- artifacts
- explicit user/agent linking

### Engine Output

```json
{
  "threads": [],
  "graph_bundle": {},
  "universe_view_overlay": true
}
```

### Features ⚡
| Feature | Description |
|---------|-------------|
| real-time updating | Live updates |
| versioned thread snapshots | History preserved |
| export (pdf,json,xr) | Multiple formats |
| **anomaly detection** | loop, orphan node ⚡ |

### Anomaly Detection ⚡
| Anomaly | Description |
|---------|-------------|
| `loop` | Circular reference detected |
| `orphan_node` | Node with no connections |

---

## AGENT ROLES

| Agent | Role |
|-------|------|
| `AGENT_THREAD_GATHERER` | **Collects candidate nodes, verifies referencing structure** ⚡ |
| `AGENT_THREAD_WEAVER` | **Constructs thread graph, enforces linking safety** ⚡ |
| `AGENT_THREAD_AUDITOR` | Checks invalid links, removes orphaned assumptions, validates temporal integrity |
| `AGENT_UNIVERSE_RENDERER` | Overlays threads into orbits, **NO interpretation, NO clustering bias** |

### AGENT_THREAD_GATHERER ⚡ NEW
> **"Collects candidate nodes, verifies referencing structure"**

### AGENT_THREAD_WEAVER ⚡ NEW
> **"Constructs thread graph, enforces linking safety"**

---

## UNIVERSE VIEW OVERLAY MODES (4) ⚡

| Mode | Description |
|------|-------------|
| **LINEAR THREAD** | Straight timeline |
| **ORBITAL THREAD** | Sphere-based circular layout |
| **BRAIDED THREAD** | Multi-timeline overlay (validated only) |
| **CROSS-AXIS VIEW** | Time (x) × Sphere (y) |

---

## ETHICAL GUARANTEES

| Guarantee | Status |
|-----------|--------|
| no narrative generation | ✅ |
| no causality inference | ✅ |
| no emotional framing | ✅ |
| no persuasion effects | ✅ |
| reversible visibility | ✅ |
| user must approve cross-sphere thread creation | ✅ |

---

**END — KNOWLEDGE THREAD PACK FREEZE READY**
