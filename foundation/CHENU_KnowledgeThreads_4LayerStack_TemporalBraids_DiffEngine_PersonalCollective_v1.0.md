# CHE·NU — KNOWLEDGE THREAD SYSTEM (4-LAYER STACK)
**VERSION:** KNOWLEDGE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD READY

---

## OVERVIEW

> **Knowledge Threads = STRUCTURED LINKS** between facts, events, artifacts, meetings, decisions, and spheres.

### RULE
> **A Knowledge Thread NEVER infers intent. It ONLY links verified elements.**
> 
> **A Thread = LINEAR or BRANCHED chain of truths.**

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Create factual chains **INSIDE a single sphere** (business, scholar, creative, etc.) to track progress, evolution, or dependencies.

### Examples ⚡
| Sphere | Flow |
|--------|------|
| **Business** | lead_created → meeting → proposal → invoice ⚡ |
| **Scholar** | lesson → exercise → exam → mastery node ⚡ |

> **ALWAYS factual. NEVER predictive. NEVER emotional.**

### Node Types ⚡
| Type | Description |
|------|-------------|
| `factual_event` | ⚡ |
| `artifact` | ⚡ |
| `decision_log` | ⚡ |
| `replay_segment` | ⚡ |
| `task_update` | ⚡ |
| `agent_action_trace` | ⚡ |

### Edges ⚡
| Type | Description |
|------|-------------|
| `follows` | ⚡ |
| `references` | ⚡ |
| `depends_on` | ⚡ |
| `expands` | ⚡ |

### Intra-Sphere JSON ⚡

```json
{
  "thread_intra": {
    "sphere": "business|scholar|creative|...",
    "nodes": [{ "id": "uuid", "type": "event|artifact|decision", "ts": 12345 }],
    "edges": [{ "from": "uuid", "to": "uuid", "type": "follows" }],
    "version": 1
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **Append-only** | ✅ ⚡ |
| **Immutable once validated** | ✅ ⚡ |
| **No subjective tags** | ✅ ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Connect truths **ACROSS different spheres**, but ONLY when there is a validated, factual relationship.

### Examples ⚡
| Flow | Description |
|------|-------------|
| Scholar research → Creative Studio design → Business pitch | ⚡ |
| Institution rule → Methodology update → XR meeting procedure | ⚡ |

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `cross_reference` | ⚡ |
| `knowledge_transfer` | ⚡ |
| `requirement_chain` | ⚡ |
| `compliance_link` | ⚡ |
| `multi-domain evolution` | ⚡ |

### Inter-Sphere JSON ⚡

```json
{
  "thread_inter": {
    "spheres": ["scholar", "creative", "business"],
    "links": [
      { "from": "artifact_id", "to": "event_id", "reason": "cross_reference" }
    ],
    "integrity_hash": "sha256"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **MUST be explicit (no hidden inference)** | ✅ ⚡ |
| **Sphere identities must remain visible** | ✅ ⚡ |
| **Timeline must be preserved** | ✅ ⚡ |

---

## 3) TEMPORAL KNOWLEDGE THREADS (ACROSS TIME) ⚡

### Purpose
Represent the **EVOLUTION** of a topic, project, or decision across multiple points in time.

> **NOT causes. NOT predictions. ONLY: "Here is how it changed."**

### Temporal Nodes ⚡
| Type | Description |
|------|-------------|
| `past event` | ⚡ |
| `intermediate update` | ⚡ |
| `future scheduled checkpoint` | ⚡ |
| `replay summary` | ⚡ |
| `decision comparison marker` | ⚡ |

### Timeline Braid Format ⚡
> **Time segments may run parallel for multi-path histories.**

### Temporal Thread JSON ⚡

```json
{
  "thread_temporal": {
    "topic": "string",
    "timeline": [
      { "t": 0, "node": "event_id_1" },
      { "t": 1, "node": "decision_id_3" },
      { "t": 2, "node": "replay_id_9" }
    ],
    "braids": [
      { "paths": ["history_a", "history_b"] }
    ]
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **No causality claims** | ✅ ⚡ |
| **No success/failure tags** | ✅ ⚡ |
| **No emotional color** | ✅ ⚡ |

---

## 4) COLLECTIVE vs PERSONAL KNOWLEDGE THREAD DIFF ENGINE ⚡ (NOUVEAU!)

### Purpose
Allow a user to understand how their **OWN knowledge thread differs from the COLLECTIVE thread** — without manipulation, persuasion, or correction.

### The DIFF ENGINE Shows ⚡
| Diff Type | Description |
|-----------|-------------|
| `missing_nodes` | nodes in collective but not personal ⚡ |
| `extra_nodes` | **nodes only in personal** ⚡ |
| `order_mismatch` | different sequencing ⚡ |
| `different_emphasis` | **what user revisits often** ⚡ |
| `silence_zones` | incomplete or skipped segments ⚡ |

> **NO evaluation. NO recommendation. ONLY structural diff.**

### Diff Engine JSON ⚡

```json
{
  "thread_diff": {
    "personal_thread": "thread_id_user",
    "collective_thread": "thread_id_global",
    "diff": {
      "missing_nodes": ["n3", "n7"],
      "extra_nodes": ["nX_user_only"],
      "order_mismatch": [{ "collective": [1, 2, 3], "personal": [1, 3, 2] }],
      "silence_zones": [{ "range": "t5-t9" }]
    }
  }
}
```

### Visualization Modes ⚡
| Mode | Description |
|------|-------------|
| **braided timelines** | ⚡ |
| **ghost nodes (collective)** | ⚡ |
| **highlight deltas** | ⚡ |
| **silence overlays** | ⚡ |

---

## KNOWLEDGE THREAD ENGINE — GLOBAL RULES ⚡

| # | Rule | Description |
|---|------|-------------|
| **1** | **TRUTH-ONLY** | Every node must reference a verified artifact or replay ⚡ |
| **2** | **NO PREDICTION** | Threads NEVER guess future states ⚡ |
| **3** | **NO INTERPRETATION** | The engine never explains WHY — only WHAT happened ⚡ |
| **4** | **IMMUTABILITY** | Once validated, nodes cannot be edited — only appended ⚡ |
| **5** | **USER AUTONOMY** | Users control: visibility, filters, merging, exporting ⚡ |
| **6** | **AUDITABILITY** | Every link has: source, timestamp, hash ⚡ |

---

## AGENT ROLES ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **constructs threads from validated inputs, no interpretation** ⚡ |
| `AGENT_THREAD_AUDITOR` | **verifies integrity, sequence, hashes** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **describes structure, NEVER gives advice** ⚡ |
| `AGENT_THREAD_MERGER` | **merges threads for inter-sphere coherence, maintains provenance tag per node** ⚡ |
| `AGENT_THREAD_VIEWER` | **handles user visualization: 2D + XR + temporal braids** ⚡ |

---

## EXPORT FORMATS ⚡

| Format | Description |
|--------|-------------|
| `.thread` | **Che-Nu canonical format** ⚡ |
| `.json` | open, inspectable ⚡ |
| `.pdf` | visual braids ⚡ |
| `.xrpack` | **immersive thread view** ⚡ |

---

**END — KNOWLEDGE THREAD STACK READY**
