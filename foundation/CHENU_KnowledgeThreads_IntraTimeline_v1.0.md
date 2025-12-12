# CHE·NU — KNOWLEDGE THREAD SYSTEM (INTRA + INTER + TIMELINE)
**VERSION:** CORE.KT.v1.0  
**MODE:** FOUNDATION / NON-PERSUASIVE / BUILD-READY

---

## PURPOSE

> **Knowledge Threads = LINKS between verified nodes**  
> (events, artifacts, replays, decisions, agents)  
> forming NEUTRAL, TRACEABLE paths across Che·Nu.

### RULES
- threads DO NOT infer meaning
- threads DO NOT guide decisions
- threads only CONNECT existing facts
- threads preserve chronology, provenance, truth

---

## 1) INTRA-SPHERE KNOWLEDGE THREAD

### Purpose
Connect knowledge **inside ONE sphere** (business → business, scholar → scholar, etc.)

### Triggers
- shared topic keyword
- shared artifact lineage
- repeated participants
- related decisions
- proximity in timeline

### Representation
| Property | Value |
|----------|-------|
| Style | thin line |
| Color | sphere-colored |
| Markers | optional timestamp |

### JSON Model

```json
{
  "kt_intra": {
    "sphere": "business|scholar|creative|...",
    "nodes": ["id1","id2","id3"],
    "relation": "topic|artifact|decision|sequence",
    "strength": 0.0,
    "immutable": true
  }
}
```

### Rules
| Rule | Status |
|------|--------|
| Created post-validation ONLY | ✅ |
| Cannot cross into another sphere | ✅ |
| Low visual priority by default | ✅ |
| No ranking allowed | ✅ |

---

## 2) INTER-SPHERE KNOWLEDGE THREAD

### Purpose
Create factual bridges between spheres when a concept, decision, or artifact appears in multiple contexts.

### Examples
| From | To | Use Case |
|------|----|----------|
| Scholar | Business | research → application |
| Creative | Social | media creation → diffusion |
| Methodology | ANY | process → execution |
| XR | Everything | visual context |

### Triggers
- identical artifact hash in different spheres
- same decision referenced across spheres
- cross-sphere meetings
- multi-sphere agent participation

### Representation
| Property | Value |
|----------|-------|
| Style | dual-color braided line |
| Hover | reveals provenance |
| Arrows | ❌ NO (no causality implied) |

### JSON Model

```json
{
  "kt_inter": {
    "from_sphere": "scholar",
    "to_sphere": "business",
    "nodes": ["idA","idB"],
    "reason": "shared_artifact",
    "provenance": ["replay_id"],
    "hash": "sha256",
    "audited": true
  }
}
```

### Rules
| Rule | Status |
|------|--------|
| Never auto-activated without source validation | ✅ |
| Must include explicit provenance | ✅ |
| Cannot imply cause → only co-occurrence | ✅ |
| Reversible and reviewable | ✅ |

---

## 3) CROSS-TIMELINE (HISTORIC) KNOWLEDGE THREAD ⚡ NEW

### Purpose
Connect events separated by **long time spans**, revealing structural continuity WITHOUT shaping narrative.

### Use Cases
- long-term strategy tracking
- repeated problem emergence
- evolution of artifacts
- multi-year research threads
- decisions made across generations of meetings

### Triggers
- artifact evolution chain detected
- recurring topic appears after > 30 days
- repeated role-glyph patterns
- decision revisited or reversed in future

### Representation
| Property | Value |
|----------|-------|
| Style | long arc line |
| Segments | dotted (older → newer) |
| Markers | subtle glow at join points |

### JSON Model

```json
{
  "kt_timeline": {
    "thread_id": "uuid",
    "segments": [
      { "node": "id1", "t": 1700000000 },
      { "node": "id2", "t": 1710000000 }
    ],
    "topic": "string",
    "artifact_lineage": "hash_list",
    "duration_days": 365,
    "verified": true
  }
}
```

### Rules
| Rule | Status |
|------|--------|
| Must be time-anchored | ✅ |
| Must show explicit timestamps | ✅ |
| No narrative description permitted | ✅ |
| User must activate visibility manually | ✅ |

---

## RENDERING & SAFETY LAYER

### Visual Constraints
| Constraint | Status |
|------------|--------|
| No flashing | ✅ |
| No dominant lines | ✅ |
| No forced focus | ✅ |
| No "recommended thread" highlighting | ✅ |

### User Controls
- show / hide all threads
- show only intra / inter / timeline
- filter by sphere
- filter by time range
- inspect provenance node-by-node

### Agent Permissions

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Builds raw thread |
| `AGENT_THREAD_AUDITOR` | Verifies source integrity |
| `AGENT_THREAD_EXPLAINER` | Shows reason, **never meaning** |

### All Agents
- read-only
- no interpretation
- no synthesis
- no prioritization

---

## THREAD BUNDLE EXPORT

### Export Formats
| Format | Type |
|--------|------|
| `.ktpack` | internal |
| `JSON` | standard |
| `PDF summary` | human-readable |

### Bundle Includes
- list of threads
- provenance map
- integrity hashes
- sphere coloring
- timeline arcs
- cryptographic signature

---

## WHY THIS SYSTEM MATTERS

In Che·Nu, Knowledge Threads:
- preserve structural truth
- reveal continuity without interpretation
- allow multi-sphere reasoning without bias
- build an **"Atlas of Connections"** users can explore freely
- prevent emergence of invisible influence channels

---

**END — KNOWLEDGE THREAD SYSTEM v1.0**
