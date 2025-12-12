# CHE·NU — KNOWLEDGE THREADS (3-LAYER SYSTEM)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## OVERVIEW

> **Knowledge Threads = structured connections between pieces of knowledge across:**
> 1. A single sphere
> 2. Multiple spheres
> 3. Multiple users (opt-in)

### RULE
> **Threads REVEAL structure.**  
> **They NEVER infer, predict, persuade, or judge.**

---

## 1) INTERNAL SPHERE KNOWLEDGE THREADS

### Purpose
Connect related knowledge inside one sphere (Business, Scholar, Creative, etc.) to avoid fragmentation.

### Examples
- **Business:** CRM note → invoice → meeting decision
- **Scholar:** lesson → exercise → replay discussion
- **Creative:** asset → revision → export

### Thread Types (4) ⚡
| Type | Description |
|------|-------------|
| `continuation` | A → B (sequence) |
| `reference` | A ↔ B (bidirectional) |
| `dependency` | A → requires B |
| `chronology` | A → happened before → B |

### JSON Model

```json
{
  "thread_internal": {
    "id": "uuid",
    "sphere": "business|scholar|creative|…",
    "nodes": ["knowledge_id_1","knowledge_id_2"],
    "type": "continuation|reference|dependency|chronology",
    "timestamp": 1712345678,
    "hash": "sha256"
  }
}
```

### Rules
- internal threads never leave the sphere
- no interpretation
- no abstraction
- **raw connections only**

---

## 2) INTER-SPHERE KNOWLEDGE THREADS (with user_visible) ⚡

### Purpose
Show how knowledge in one sphere relates to another, **WITHOUT merging them or assuming causality.**

### Examples
- Business decision referencing Scholar research
- Creative asset used in Social & Media content
- XR meeting referencing Institutional rule

### Thread Types (4) ⚡
| Type | Description |
|------|-------------|
| `cross_reference` | References across spheres |
| `cross_dependency` | Depends on other sphere |
| `cross_context` | Contextual relation |
| `cross_replay_link` | Replay connection |

### Visuals (Universe View)
- soft color-coded lines between sphere nodes
- **no directional arrows unless user requests mode=causal_view**
- toggleable per sphere

### JSON Model (with user_visible) ⚡

```json
{
  "thread_intersphere": {
    "id": "uuid",
    "from_sphere": "business",
    "to_sphere": "scholar",
    "nodes": ["knowledge_id_A","knowledge_id_B"],
    "type": "cross_reference|cross_dependency|cross_context",
    "user_visible": true,
    "hash": "sha256"
  }
}
```

### Rules
- cross-sphere visibility requires user activation
- no automatic suggestion of "should use X"
- no merging of knowledge domains

---

## 3) CROSS-USER KNOWLEDGE THREADS (OPT-IN ONLY) ⚡

### Purpose
Allow teams, collaborators, or groups to voluntarily link their knowledge **WITHOUT revealing personal data.**

### OPT-IN RULE ⚡
> **No thread is created without explicit user consent.**

### Use Cases
- collaborative project
- shared XR meeting analysis
- multi-user research chain

### Thread Types (4) ⚡
| Type | Description |
|------|-------------|
| `shared_artifact_link` | Shared artifact |
| `shared_decision_link` | Shared decision |
| `shared_timeline_link` | Shared timeline |
| `shared_context_link` | Shared context |

### JSON Model (with shared_space_only) ⚡

```json
{
  "thread_cross_user": {
    "id": "uuid",
    "participants": ["user_A","user_B"],
    "nodes": ["knowledge_id_A","knowledge_id_B"],
    "visibility": "shared_space_only",
    "type": "shared_artifact|shared_decision|shared_timeline",
    "hash": "sha256"
  }
}
```

### Privacy Rules ⚡
| Rule | Status |
|------|--------|
| no identity leakage | ✅ |
| no activity history reveal | ✅ |
| no inferred similarity between users | ✅ |
| only content the user has shared is visible | ✅ |

---

## THREAD ENGINE — RULES OF OPERATION ⚡

| Rule | Description |
|------|-------------|
| **NO INFERENCE** | Engine never generates new meaning, only connects |
| **STABILITY** | Threads are immutable after creation (versioned) |
| **TRACEABILITY** | origin replay, origin sphere, cryptographic hash |
| **VISUAL ETHICS** | no bright cues, no persuasive motion, calm color coding |
| **USER CONTROL** | per-thread visibility, mass-toggle, archive, export |

---

## THREAD ENGINE — JSON EXPORT

```json
{
  "knowledge_threads_bundle": {
    "version": "1.0",
    "threads": {
      "internal": [...],
      "intersphere": [...],
      "cross_user": [...]
    },
    "integrity": "verified",
    "generated_at": "timestamp"
  }
}
```

---

## XR + 2D VISUALIZATION ⚡

### 2D Mode
| Property | Value |
|----------|-------|
| Style | soft lines |
| Groups | collapsible |
| Hover | reveals links |

### XR Mode ⚡
| Property | Value |
|----------|-------|
| Style | floating thread lines |
| **Fading** | **distance-based fading** ⚡ |
| Nodes | selectable |
| **Audio** | **voice-safe (no audio cues)** ⚡ |
| **Transitions** | **calm transitions (500–800ms)** ⚡ |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Constructs threads after validation, **never interprets** |
| `AGENT_THREAD_EXPLAINER` | Translates thread structure to user-friendly text |
| `AGENT_PRIVACY_GUARD` | **Ensures only allowed nodes appear, blocks cross-user leakage** ⚡ |
| `AGENT_UNIVERSE_RENDERER` | **Draws threads in 2D/3D, never animates emotionally** ⚡ |

### AGENT_PRIVACY_GUARD ⚡ NEW
> **"Ensures only allowed nodes appear, blocks cross-user leakage"**

### AGENT_UNIVERSE_RENDERER ⚡ NEW
> **"Draws threads in 2D/3D, never animates emotionally"**

---

## WHY KNOWLEDGE THREADS ARE CRUCIAL

| Thread Layer | Provides |
|--------------|----------|
| **Internal Threads** | Clarity |
| **Inter-Sphere Threads** | Context |
| **Cross-User Threads** | Collaboration |

### All Without
- bias
- influence
- narrative shaping

---

**END — KNOWLEDGE THREAD SYSTEM FREEZE**
