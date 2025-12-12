# CHE·NU — KNOWLEDGE THREADS (KT5 / KT6 / KT7)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## OVERVIEW ⚡

> **Knowledge Threads = structured pathways linking:** information, decisions, artifacts, spheres, agents, replays, memory entries.

### RULE
> **Threads connect FACTS, not interpretations. Each KT operates as a neutral map of how reality flows.**

### 3 Knowledge Thread Types ⚡
| KT | Name |
|----|------|
| **KT5** | Sphere-Interlocking Thread |
| **KT6** | Decision-Flow Thread |
| **KT7** | **Collective Insight Thread** |

---

## KT5 — SPHERE-INTERLOCKING KNOWLEDGE THREAD ⚡

### Purpose
> **Show how knowledge moves ACROSS spheres without bias or inferred causality.**

### Examples ⚡
```
Scholar → Business → Institution
Creative → Social → XR
Methodology → ANY sphere
```

### KT5 NEVER ⚡
| Forbidden | Status |
|-----------|--------|
| **determines influence** | ❌ ⚡ |
| **ranks spheres** | ❌ ⚡ |
| **interprets impact** | ❌ ⚡ |

### KT5 Structure ⚡
| Nodes | Edges |
|-------|-------|
| memory entries | referenced_in |
| documents | used_by |
| replays | follows_from |
| agents (neutral glyphs) | **informs** |
| user anchors (optional) | |

### KT5 JSON ⚡
```json
{
  "kt5_sphere_interlock": {
    "id": "uuid",
    "origin_sphere": "scholar",
    "linked_spheres": ["business", "institution"],
    "entries": ["memory_id_1", "memory_id_2"],
    "edges": [
      { "from": "memory_id_1", "to": "memory_id_2", "type": "informs" }
    ],
    "hash": "sha256"
  }
}
```

### KT5 UI Representation ⚡
| Feature | Description |
|---------|-------------|
| **orbit lines between spheres** | ⚡ |
| **minimal glyphs** | ⚡ |
| **hover-only expansions** | ⚡ |
| **no animations suggesting importance** | ✅ ⚡ |

### KT5 Agents ⚡
| Agent | Role |
|-------|------|
| `AGENT_THREAD_SYNTHESIZER` | gathers entries + edges ⚡ |
| `AGENT_THREAD_EXPLAINER` | **plain-language trace** ⚡ |

---

## KT6 — DECISION-FLOW KNOWLEDGE THREAD ⚡

### Purpose
> **Trace how decisions evolve, branch, merge, and return across time, WITHOUT judging outcome.**

### KT6 IS NOT ⚡
| Forbidden | Status |
|-----------|--------|
| **strategy advisor** | ❌ ⚡ |
| **ranking mechanism** | ❌ ⚡ |
| **predictive system** | ❌ ⚡ |

### KT6 IS ⚡
| Allowed | Status |
|---------|--------|
| **decision lineage** | ✅ ⚡ |
| **timestamped trail** | ✅ ⚡ |
| **cause-neutral mapping** | ✅ ⚡ |

### KT6 Structure ⚡
| Decision Nodes | Edges |
|----------------|-------|
| declared decisions | precedes |
| conditional branches | branches_to |
| deferrals | **merges_with** |
| **re-evaluations** | **revisits** |

### KT6 JSON ⚡
```json
{
  "kt6_decision_flow": {
    "id": "uuid",
    "decision_nodes": [
      { "id": "d1", "timestamp": "...", "type": "declare", "source_replay": "uuid" },
      { "id": "d2", "timestamp": "...", "type": "branch" }
    ],
    "edges": [
      { "from": "d1", "to": "d2", "type": "branches_to" }
    ],
    "timeline": true,
    "hash": "sha256"
  }
}
```

### KT6 UI Representation ⚡
| Feature | Description |
|---------|-------------|
| **simple timeline braid** | ⚡ |
| **soft colored threads** | ⚡ |
| **no arrows suggesting "correct path"** | ✅ ⚡ |
| **replay-link on click** | ⚡ |

### KT6 Agents ⚡
| Agent | Role |
|-------|------|
| `AGENT_DECISION_ARCHIVIST` | logs decisions from meetings ⚡ |
| `AGENT_THREAD_BRAIDER` | **constructs timeline braid** ⚡ |

---

## KT7 — COLLECTIVE INSIGHT KNOWLEDGE THREAD ⚡

### Purpose
> **Surface shared understanding trends across users/spheres, BUT NEVER produce interpretations or conclusions.**

### KT7 = ⚡
| Is | Is NOT |
|----|--------|
| Reflection Map | **Opinion Engine** |
| | **Agreement Detector** |
| | **Sentiment Analyzer** |

### KT7 Structure ⚡
| Insight Nodes | Edges |
|---------------|-------|
| repeated themes across memory entries | co_occurs_with |
| recurring artifacts | references_similar |
| repeated decision patterns | **time_clustered** |
| **cross-sphere coherence indicators** | |

### KT7 JSON ⚡
```json
{
  "kt7_collective_insight": {
    "id": "uuid",
    "insight_nodes": [
      { "id": "i1", "theme": "resource_planning", "count": 14 },
      { "id": "i2", "theme": "timeline_confusion", "count": 7 }
    ],
    "edges": [
      { "from": "i1", "to": "i2", "type": "co_occurs_with" }
    ],
    "visibility": "anonymized_only",
    "hash": "sha256"
  }
}
```

### Key Field: `visibility: "anonymized_only"` ⚡
> **Privacy enforced by default**

### KT7 UI Representation ⚡
| Feature | Description |
|---------|-------------|
| **insight bubbles** | ⚡ |
| **anonymized counts only** | ⚡ |
| **no recommendation** | ✅ ⚡ |
| **option to hide entire KT7 layer** | ✅ ⚡ |

### KT7 Agents ⚡
| Agent | Role |
|-------|------|
| `AGENT_INSIGHT_SCANNER` | **detects repeat patterns** ⚡ |
| `AGENT_PRIVACY_GUARD` | **enforces anonymization + suppression rules** ⚡ |

---

## CROSS-THREAD RULES (ALL KT5/KT6/KT7) ⚡

| Rule | Status |
|------|--------|
| **immutable history** | ✅ ⚡ |
| **cryptographic trace** | ✅ ⚡ |
| **no sentiment** | ✅ ⚡ |
| **no weighting** | ✅ ⚡ |
| **no prediction** | ✅ ⚡ |
| **user-controlled visibility** | ✅ ⚡ |
| **XR + 2D synchronized** | ✅ ⚡ |

---

## INTERACTION RULES ⚡

| Allowed | Forbidden |
|---------|-----------|
| inspect | **auto-pathing** |
| filter | **attention steering** |
| compare | **persuasive shaping** |
| export | |

---

## EXPORT CAPABILITIES ⚡

| Format | Description |
|--------|-------------|
| PDF | thread summary ⚡ |
| JSON bundle | ⚡ |
| **XR thread-view replay** | ⚡ |
| **Cross-sphere stitched print** | ⚡ |

---

**END — FREEZE READY — CAN BE FED TO CLAUDE**
