# CHE·NU — KNOWLEDGE THREADS (UNIVERSAL MODEL)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-PERSUASIVE / BUILD-READY

---

## PURPOSE

> Knowledge Threads unify facts, artifacts, decisions, and links  
> ACROSS meetings, spheres, users, and time,  
> WITHOUT generating narratives or influencing thought.

### Definition
> **THREAD = STRUCTURED CONNECTION**  
> NOT explanation, NOT interpretation, NOT recommendation

---

## THREAD TYPES (3)

| Type | Scope |
|------|-------|
| **INTRA-SPHERE** | Links INSIDE a single sphere |
| **INTER-SPHERE** | Links BETWEEN spheres |
| **TEMPORAL** | Links ACROSS TIME |

---

## THREAD STRUCTURE (UNIVERSAL MODEL)

### THREAD_NODE

```json
{
  "id": "uuid",
  "type": "event|artifact|decision|memory",
  "sphere": "business|scholar|...",
  "timestamp": 1712345678,
  "source_replay": "uuid",
  "metadata": {},
  "hash": "sha256"
}
```

### THREAD_EDGE

```json
{
  "from": "node_id",
  "to": "node_id",
  "relation_type": "sequential|reference|dependency|parallel",
  "strength": 0.85,
  "source_type": "replay|artifact|manual"
}
```

> **Note:** `strength` is 0–1, **non-evaluative** (density, not quality)

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS

### Rule
> Intra-sphere threads map how knowledge flows **WITHIN a single domain.**

### Examples
| Sphere | Flow |
|--------|------|
| Scholar | course → article → research note |
| Creative | design → prototype → revision |
| Business | lead → meeting → contract |
| XR | session → artifact → replay |

### Allowed Relations

| Relation | Description |
|----------|-------------|
| `references` | Cites another node |
| `continues` | Extends from |
| `contains` | Includes within |
| `expands_on` | Elaborates |
| `resolves` | Addresses/closes |

### Prohibited
- ❌ "best", "good", "correct", "superior"

### JSON Structure

```json
{
  "thread_intra": {
    "sphere": "business|scholar|creative|...",
    "nodes": [],
    "edges": [],
    "integrity": "sha256"
  }
}
```

---

## 2) INTER-SPHERE KNOWLEDGE THREADS

### Rule
> Only bridges FACTS that legitimately connect two or more spheres.

### Examples
| From → To | Meaning |
|-----------|---------|
| Scholar → Business | research applied to strategy |
| Creative → Social | media asset reused |
| Institution → Business | compliance rule |

### Allowed Relations

| Relation | Description |
|----------|-------------|
| `reused_by` | Asset reused in another sphere |
| `derived_from` | Built upon |
| `contextualizes` | Provides context |
| `required_for` | Dependency |

### Prohibited
- ❌ cross-sphere "influence scoring"
- ❌ cross-sphere prioritization

### JSON Structure

```json
{
  "thread_inter": {
    "spheres": ["scholar","business"],
    "bridge_nodes": [],
    "bridge_edges": [],
    "context_hash": "sha256"
  }
}
```

### Behavior
- ✅ fully transparent links
- ✅ user can disable sphere bridging
- ✅ agent must state justification for each bridge

---

## 3) TEMPORAL KNOWLEDGE THREADS

### Rule
> Temporal threads show WHAT changed over time, **without explaining WHY.**

### Examples
- project timeline
- decision evolution
- repeated meeting topics
- version history of an artifact
- avatar evolution (non-emotive)

### Allowed Relations

| Relation | Description |
|----------|-------------|
| `earlier_than` | Before in time |
| `later_than` | After in time |
| `supersedes` | Replaces |
| `reappears` | Returns |
| `cycles` | Repeats |

### Prohibited
- ❌ "trend detection"
- ❌ prediction
- ❌ interpretation of meaning

### JSON Structure

```json
{
  "thread_temporal": {
    "timeline": [],
    "sequencing": [
      { "from": "id", "to": "id", "relation": "earlier_than" }
    ],
    "version_graph": [],
    "time_span": { "start": "...", "end": "..." }
  }
}
```

---

## THREAD SAFETY RULES (9)

| # | Rule |
|---|------|
| 1 | No sentiment or emotional classification |
| 2 | No ranking or scoring |
| 3 | No intent extraction |
| 4 | No predictive modeling |
| 5 | No persuasive pathing |
| 6 | All threads must be explainable node-by-node |
| 7 | User must always see "visibility mask" indicator |
| 8 | Private nodes NEVER propagate outside allowed spheres |
| 9 | Cross-sphere edges require explicit opt-in |

---

## RENDERING MODES

### 2D Mode
- linear list
- graph view
- braided timeline

### 3D Mode
- sphere-orbit mapping
- cluster density view
- temporal spiral

### XR Mode
- walkable thread lines
- pin-only interaction
- read-only replay entries

---

## AGENTS RESPONSIBLE

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Creates raw threads, ensures validity |
| `AGENT_THREAD_AUDITOR` | Checks forbidden patterns, **verifies no interpretation** |
| `AGENT_THREAD_EXPLAINER` | Provides node-by-node transparency |

### NO AGENT ever:
- ❌ reorganizes threads to influence perception
- ❌ generates conclusions
- ❌ collapses complexity into opinions

---

## EXPORT FORMATS

| Format | Description |
|--------|-------------|
| `.thread.json` | Full fidelity |
| `.thread.map` | Visual layer |
| `.thread.xrpack` | XR spatial mapping |
| `.thread.pdf` | Non-interactive |

---

**END — KNOWLEDGE THREAD SYSTEM READY**
