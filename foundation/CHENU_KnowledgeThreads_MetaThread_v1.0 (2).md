# CHE·NU — KNOWLEDGE THREAD ENGINE (META-THREAD)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## INTRO — WHAT IS A KNOWLEDGE THREAD?

> A Knowledge Thread = a **NEUTRAL, TRACEABLE chain of information** linking facts, artifacts, events, decisions, and replays across Che-Nu.

### RULE
> **A Thread organizes truth, it never interprets it.**

### Three Levels
1. **Intra-Sphere Thread** → inside one sphere
2. **Inter-Sphere Thread** → spans multiple spheres
3. **Universal Meta-Thread** → spans the whole user tree

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS

### Scope
- Business, Scholar, Creative, Social, Institution, Methodology, XR threads

### Purpose
Reveal continuity inside one sphere **WITHOUT redefining meaning.**

### Sources
- documents, tasks, meetings, replays, artifacts, agent outputs, user notes

### Structure
- linear OR branched
- time-anchored
- artifact-attached
- replay-traceable

### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "sphere": "business|scholar|creative|...",
    "nodes": [
      { "type": "artifact|event|decision|note", "ref": "uuid", "timestamp": 12345 }
    ],
    "links": [ { "from": "id", "to": "id", "reason": "continuity|reference" } ],
    "hash": "sha256"
  }
}
```

### Safety
- no narrative inference
- no priority assignment
- no hidden ordering
- no sentiment

---

## 2) INTER-SPHERE KNOWLEDGE THREADS (with Link Reasons) ⚡

### Scope
Cross-domain connections between two or more spheres.

### Examples
- A creative asset used in a business pitch
- A scholar research influencing an institution report
- A methodology pattern reused in a social project

### Purpose
Reveal **CONNECTIVITY BETWEEN DOMAINS** without merging their meaning or suggesting insight.

### Linking Rules
- MUST originate from factual adjacency (shared artifact, shared topic)
- MUST be visible to user
- MUST store reason for cross-sphere link

### Link Reasons ⚡
| Reason | Description |
|--------|-------------|
| `shared_document` | Same document |
| `shared_topic` | Same topic |
| `chronological_dependency` | Time dependency |
| `workflow_handover` | Process handoff |
| `replay_reference` | Replay connection |

### JSON Model

```json
{
  "inter_thread": {
    "id": "uuid",
    "spheres": ["business","creative"],
    "origin": "artifact|event",
    "nodes": [...],
    "cross_links": [
      { "from": "idA", "to": "idB", "reason": "shared_topic" }
    ],
    "integrity": "verified"
  }
}
```

### Ethical Locks
- cannot suggest causality
- cannot rank spheres
- cannot propose decisions
- only show verified factual relationships

---

## 3) UNIVERSAL META-THREADS ⚡ UNIQUE

### What It Is
A top-level, system-wide thread representing **the USER'S ENTIRE KNOWLEDGE TREE** across all spheres, without judgment or influence.

### Purpose
- reveal evolution
- reveal structural growth
- reveal knowledge accumulation
- show branching complexity
- unify timeline across spheres

### Meta-Thread 5 Layers ⚡
| Layer | Content |
|-------|---------|
| **LAYER 1** | Sphere timeline summary |
| **LAYER 2** | Cross-sphere touchpoints |
| **LAYER 3** | Decision evolution |
| **LAYER 4** | Replay anchors |
| **LAYER 5** | Memory cluster nodes |

### JSON Model (with clusters + density + user_defined_tags) ⚡

```json
{
  "meta_thread": {
    "id": "uuid",
    "spheres": ["all"],
    "global_timeline": [...],
    "clusters": [
      { "topic": "string", "threads": ["id1","id2"], "density": 0.42 }
    ],
    "user_defined_tags": ["phase_1","project_alpha"],
    "hash": "sha256"
  }
}
```

### Meta-Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `spheres` | ["all"] for meta-thread |
| `global_timeline` | Unified timeline |
| `clusters` | Topic clusters with density |
| `density` | 0.0-1.0 cluster density |
| `user_defined_tags` | Custom user tags |

### Safety
- no predictive modeling
- no behavioral inference
- no "insight" generation
- no psychology
- **neutral representation only**

---

## THREAD VISUALIZATION (2D/3D/XR) ⚡

### Elements
| Element | Represents |
|---------|------------|
| **Nodes** | facts |
| **Edges** | relationships |
| **Clusters** | topic densities |

### Modes ⚡
| Mode | Description |
|------|-------------|
| **2D** | decluttered map |
| **3D** | **orbit map** ⚡ |
| **XR** | **spatial thread view (read-only)** ⚡ |

### Interactions ⚡
| Action | Description |
|--------|-------------|
| `expand thread` | Show more nodes |
| `fold thread` | Collapse branch |
| `isolate branch` | Focus on one branch |
| `show artifacts` | Display linked artifacts |
| `open replay from node` | Jump to replay |

---

## AGENTS INVOLVED

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles factual chains, **no narrative creation** |
| `AGENT_THREAD_GUARD` | Checks ethical safety, **ensures no bias** |
| `AGENT_THREAD_EXPLAINER` | Explains why nodes connected, **never suggests conclusion** |

---

## UNIFIED THREAD MODEL (FOR BUILDERS)

```json
{
  "knowledge_thread_bundle": {
    "intra_threads": [...],
    "inter_threads": [...],
    "meta_threads": [...],
    "version": "1.0",
    "hash": "sha256"
  }
}
```

---

## WHY THIS MATTERS

| Thread Level | Provides |
|--------------|----------|
| **Intra-Sphere** | clarity inside domains |
| **Inter-Sphere** | clarity between domains |
| **Meta-Threads** | clarity across entire existence |

> **No manipulation. No storytelling. Only STRUCTURED TRUTH.**

---

**END — FOUNDATION FREEZE READY**
