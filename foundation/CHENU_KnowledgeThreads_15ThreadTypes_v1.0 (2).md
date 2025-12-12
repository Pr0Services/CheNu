# CHE·NU — KNOWLEDGE THREADS SYSTEM (15 THREAD TYPES)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACE-ONLY

---

## OVERVIEW

> **Knowledge Threads = relational pathways between information nodes,** WITHOUT inference, judgment, or automated conclusion.

> **A Thread = FACTUAL CONNECTION ONLY.**

### 3 Types
1. Intra-Sphere Threads
2. Cross-Sphere Threads
3. Temporal Evolution Threads

> All threads = reversible, cryptographically anchored, fully transparent, and explainable.

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS (5 types) ⚡

### Purpose
Connect concepts, artifacts, decisions, tasks, and meetings **INSIDE the same sphere** (Business, Scholar, Creative, etc.).

### RULE
> **Thread shows RELATIONSHIP, not PRIORITY.**

### Thread Types (Intra) ⚡
| Type | Description |
|------|-------------|
| `THREAD_TOPIC` | Connects nodes sharing the same subject |
| `THREAD_DEPENDENCY` | One item requires another |
| `THREAD_CLARIFICATION` | One note clarifies another |
| `THREAD_VERSION` | Versions of the same idea |
| `THREAD_AGENT_ACTION` | Links agent actions within context |

### JSON Model

```json
{
  "intra_thread": {
    "id": "uuid",
    "sphere": "business|scholar|creative|...",
    "from": "node_id",
    "to": "node_id",
    "type": "topic|dependency|clarification|version|agent_action",
    "timestamp": 1712345678,
    "hash": "sha256"
  }
}
```

### Visualization Rules
| Rule | Value |
|------|-------|
| Style | short lines |
| Color | same palette of sphere |
| Animation | **no animation pulses** |
| Hover | show explanation only |

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS (5 types) ⚡

### Purpose
Show when an idea, decision, or artifact in one sphere **AFFECTS or RELATES TO** something in another sphere.

### RULE
> **Cross-sphere ≠ influence**  
> **Cross-sphere = relevance indicator only.**

### Thread Types (Cross) ⚡
| Type | Description |
|------|-------------|
| `THREAD_ANALOGY` | Concept in sphere A is structurally similar to B |
| `THREAD_RESOURCE_LINK` | Resource created in one sphere used in another |
| `THREAD_DECISION_IMPACT` | Decision in one sphere affects workflows in another |
| `THREAD_AGENT_BRIDGE` | Same agent/role participates across spheres |
| `THREAD_MEMORY_REFERENCE` | Replay/artifact referenced cross-domain |

### JSON Model (with manual_verified) ⚡

```json
{
  "cross_thread": {
    "id": "uuid",
    "from_sphere": "business",
    "to_sphere": "scholar",
    "from_node": "node_id",
    "to_node": "node_id",
    "link_type": "analogy|resource|impact|bridge|reference",
    "confidence": 0.75,
    "manual_verified": true,
    "hash": "sha256"
  }
}
```

### Cross-Sphere Fields ⚡
| Field | Description |
|-------|-------------|
| `link_type` | Type of cross-sphere connection |
| `manual_verified` | User verified the link |

### Visualization Rules ⚡
| Rule | Value |
|------|-------|
| Style | curved lines (avoid visual clutter) |
| Color | **cross-sphere color shift** ⚡ |
| Opacity | represents frequency |
| Highlight | **never auto-highlight** |

---

## 3) TEMPORAL EVOLUTION THREADS (5 types) ⚡

### Purpose
Track how an idea **evolves over TIME** across: meetings, decisions, artifacts, versions, spheres, replays.

### RULE
> **Timeline = FACT SEQUENCE**  
> **NOT explanation, NOT storytelling.**

### Thread Types (Temporal) ⚡
| Type | Description |
|------|-------------|
| `THREAD_PROGRESS` | Draft → refinement → completion |
| `THREAD_DIVERGENCE` | Two versions evolve differently |
| `THREAD_CONSOLIDATION` | Multiple sources merge |
| `THREAD_REVIEW` | Replay corrects or validates memory |
| `THREAD_REAPPEARANCE` | Old concept revived in new context |

### JSON Model (with events + action + root_node) ⚡

```json
{
  "temporal_thread": {
    "id": "uuid",
    "root_node": "node_id",
    "events": [
      { "timestamp": 1712340000, "node": "id1", "action": "created" },
      { "timestamp": 1712350000, "node": "id2", "action": "updated" },
      { "timestamp": 1712360000, "node": "id3", "action": "referenced" }
    ],
    "hash": "sha256"
  }
}
```

### Action Types ⚡
| Action | Description |
|--------|-------------|
| `created` | Node created |
| `updated` | Node updated |
| `referenced` | Node referenced |

### Visualization Rules ⚡
| Rule | Value |
|------|-------|
| Style | braided timeline lines |
| Nodes | represent timestamps |
| Slope | **no slope implying "improvement"** ⚡ |
| Hover | factual explanation only |

---

## THREAD SAFETY LIMITS (GLOBAL)

| Limit | Status |
|-------|--------|
| No predictions | ✅ |
| No sentiment | ✅ |
| No prioritization | ✅ |
| No causal inference | ✅ |
| No "most important thread" ranking | ✅ |
| No emotional color codes | ✅ |
| User can hide all threads on demand | ✅ |

---

## AGENT ROLES

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Constructs factual links only, **no interpretation** |
| `AGENT_THREAD_VALIDATOR` | Checks link correctness, **cryptographic timestamping** ⚡ |
| `AGENT_THREAD_EXPLAINER` | Converts to readable statements, **no conclusions** |

### AGENT_THREAD_VALIDATOR ⚡
> **"Checks for link correctness + cryptographic timestamping"**

---

## WHY THE 3-LAYER SYSTEM WORKS

| Layer | Provides |
|-------|----------|
| **Intra-Sphere Threads** | local clarity |
| **Cross-Sphere Threads** | ecosystem clarity |
| **Temporal Threads** | timeline clarity |

### Together
- A full picture of knowledge
- **Without bias**
- **Without interpretation**
- **Without narrative pressure**

---

**END — KNOWLEDGE THREADS FOUNDATION FREEZE**
