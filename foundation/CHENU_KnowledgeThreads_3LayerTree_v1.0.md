# CHE·NU — KNOWLEDGE THREADS (3-LAYER TREE)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE  
**SCOPE:** Knowledge Linking Engine for Che·Nu (all spheres, all agents)

---

## I) INTRA-SPHERE KNOWLEDGE THREADS (LOCAL THREADS)

### Purpose
Connect information **INSIDE a single sphere** (Business, Scholar, XR), without leaving the boundary of that domain.

### RULE
> **Local threads ≠ conclusions.**  
> Only contextual links between facts, artifacts, actions, events.

### Thread Types (Local) ⚡

| Type | Description | Example |
|------|-------------|---------|
| `FACT_THREAD` | Connects related data points | invoice ↔ client record ↔ milestone |
| `EVENT_THREAD` | Links events chronologically | meeting_start → decision → update |
| `ARTIFACT_THREAD` | Connects files, notes, docs | design ↔ spec ↔ final |
| `CONTEXT_THREAD` | Aligns sphere metadata | "marketing" ↔ "campaign" ↔ "assets" |

### JSON Model

```json
{
  "local_thread": {
    "id": "uuid",
    "sphere": "business|scholar|creative|...",
    "nodes": ["artifact","event","fact"],
    "links": [
      { "from": "nodeA", "to": "nodeB", "type": "contextual" }
    ],
    "hash": "sha256"
  }
}
```

### Local Rules
| Rule | Status |
|------|--------|
| no inference | ✅ |
| no prediction | ✅ |
| no priority ranking | ✅ |
| all relationships must be explicit in data | ✅ |

---

## II) INTER-SPHERE KNOWLEDGE THREADS (CROSS-SILO)

### Purpose
Create safe, transparent bridges between spheres **ONLY when data overlaps factually, never conceptually.**

### RULE: DOUBLE-CONSENT ⚡
> Cross-sphere threads require:
> 1. **User consent**
> 2. **Sphere guard validation**

### Cross-Sphere Thread Types ⚡

| Type | Description | Example |
|------|-------------|---------|
| `USER_THREAD` | Connects user's data across spheres | Research ↔ Assets ↔ Pitch deck |
| `AGENT_THREAD` | Connects agent outputs across domains | Methodology → Business → Creative |
| `GOAL_THREAD` | Aligns shared objectives | "Develop Product A" across all spheres |
| `REPLAY_THREAD` | Cross-links XR replays to decisions | XR meeting ↔ Business decision |

### JSON Model (with permissions)

```json
{
  "inter_thread": {
    "id": "uuid",
    "spheres": ["business","scholar","xr"],
    "nodes": [
       { "id": "n1", "type": "artifact", "sphere": "scholar" },
       { "id": "n2", "type": "decision", "sphere": "business" }
    ],
    "link_reason": "shared_topic|shared_user|shared_goal",
    "permissions": { "user_approved": true, "sphere_guard": true }
  }
}
```

### Link Reasons ⚡
| Reason | Description |
|--------|-------------|
| `shared_topic` | Same topic |
| `shared_user` | Same user involved |
| `shared_goal` | Same objective |

### Cross-Sphere Rules
| Rule | Status |
|------|--------|
| must not combine unrelated contexts | ✅ |
| no synthesis or "insight generation" | ✅ |
| only reveal explicit, verifiable connections | ✅ |
| no emotional or persuasive metadata | ✅ |

---

## III) UNIVERSAL KNOWLEDGE THREADS (META-TRUNK)

### Purpose
Represent the entire Che·Nu ecosystem as a **LIVING TREE** where all spheres attach to the TRUNK (laws + memory), and universal threads maintain global coherence.

### RULE
> **Universal threads DO NOT add intelligence.**  
> **They maintain structure & integrity.**

### Universal Thread Types ⚡

| Type | Description | Example |
|------|-------------|---------|
| `LAW_THREAD` | Links all data to foundational rules | privacy law → access logs → exports |
| `MEMORY_THREAD` | Aggregates validated replays + decisions | Shared factual memory |
| `METHODOLOGY_THREAD` | Aligns workflows across spheres | task analysis → workflow → execution |
| `EVOLUTION_THREAD` | Tracks state evolution globally | avatar → meeting patterns → usage |

### JSON Model

```json
{
  "universal_thread": {
    "id": "uuid",
    "type": "law|memory|methodology|evolution",
    "nodes": ["event","artifact","replay","decision"],
    "span": "global",
    "integrity": "cryptographically_verified",
    "timestamp": 1712345678
  }
}
```

### Universal Rules: 3 GUARDS ⚡

| Guard | Role |
|-------|------|
| **Ethical Guard** | Ensures ethical compliance |
| **Privacy Guard** | Protects user privacy |
| **Memory Integrity Guard** | Verifies factual accuracy |

### Universal Constraints
| Rule | Status |
|------|--------|
| cannot be altered retroactively | ✅ |
| only append verified nodes | ✅ |
| must pass all 3 guards | ✅ |

---

## WHY ALL 3 LAYERS MATTER

| Layer | Purpose |
|-------|---------|
| **LOCAL THREADS** | Sphere clarity |
| **INTER-SPHERE THREADS** | Cross-domain coherence |
| **UNIVERSAL THREADS** | Global integrity, ecosystem truth |

### THE KNOWLEDGE TREE OF CHE·NU ⚡

> **A structured, ethical, unbreakable representation of ALL user activity**  
> **WITHOUT interpretation or persuasion.**

```
         🌳 TRUNK (Universal: Laws + Memory)
              │
    ┌─────────┼─────────┐
    │         │         │
 Business  Scholar  Creative  ... (Spheres)
    │         │         │
 [Local]   [Local]   [Local]   (Local Threads)
    │         │         │
    └────┬────┴────┬────┘
         │ Inter-Sphere │
         └─────────────┘
```

---

**END — FREEZE READY**
