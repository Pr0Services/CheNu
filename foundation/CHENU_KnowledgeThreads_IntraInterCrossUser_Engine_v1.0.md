# CHE·NU — KNOWLEDGE THREADS SYSTEM (INTRA/INTER/CROSS-USER + ENGINE)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## PURPOSE

> **Knowledge Threads = neutral connective tissue** linking information across: time, spheres, meetings, agents, users (opt-in)

### RULE
> **Threads reveal STRUCTURE, never INTERPRETATION. No emotional metadata. No persuasive weighting.**

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS

### Scope
Links knowledge **INSIDE a single sphere** (Business, Scholar, Creative, etc.)

### Thread Types ⚡
| Type | Description |
|------|-------------|
| **Concept Thread** | ideas linked over time ⚡ |
| **Artifact Thread** | documents, notes, media |
| **Decision Thread** | decisions + context |
| **Workflow Thread** | **steps + dependencies** ⚡ |

### Creation Events ⚡
- user creates or modifies a resource
- agent produces output in this sphere
- meeting attaches artifacts
- **timeline replay validated** ⚡

### Intra-Sphere Thread JSON (with links + reason) ⚡

```json
{
  "intra_thread": {
    "id": "uuid",
    "sphere": "business|scholar|creative|...",
    "nodes": [
      { "id": "resource_id", "type": "artifact|event|decision" }
    ],
    "links": [
      { "from": "id", "to": "id", "reason": "update|reference|followup" }
    ],
    "hash": "sha256"
  }
}
```

### Intra-Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes[].type` | **artifact/event/decision** ⚡ |
| `links[].reason` | **update/reference/followup** ⚡ |

### Visualization ⚡
| Style | Use Case |
|-------|----------|
| linear | timeline |
| **cluster** | topics ⚡ |
| **waterfall** | workflows ⚡ |

### Limitations ⚡
- no assumptions
- **no predictive structure** ⚡
- no emotional or performance labels

---

## 2) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Link concepts across spheres **WITHOUT blending identities or purposes.**

### Examples ⚡
- Scholar research ↔ Business planning
- Creative prototype ↔ Social media content
- Institution policy ↔ Business compliance
- **XR meeting replay ↔ Methodology update** ⚡

### Inter-Sphere Thread Types ⚡
| Type | Description |
|------|-------------|
| `semantic_link` | **shared concept** ⚡ |
| `procedural_link` | **output from sphere A used in B** ⚡ |
| `reference_link` | **user requests cross-sphere help** ⚡ |
| `replay_link` | **XR replay contributes to another sphere** ⚡ |

### Inter-Sphere JSON (with explain field) ⚡

```json
{
  "inter_thread": {
    "id": "uuid",
    "spheres": ["scholar","business"],
    "nodes": [
      { "id": "resource_id", "sphere": "scholar" },
      { "id": "resource_id", "sphere": "business" }
    ],
    "links": [
      { "from": "id", "to": "id", "type": "cross_reference" }
    ],
    "explain": "human-readable reason",
    "hash": "sha256"
  }
}
```

### Inter-Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes[].sphere` | **Per-node sphere** ⚡ |
| `links[].type` | **"cross_reference"** ⚡ |
| `explain` | **Human-readable reason** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **each link must be EXPLAINABLE** | ✅ ⚡ |
| **never auto-creates dependencies** | ✅ ⚡ |
| never influences decisions | ✅ |

### Visualization ⚡
- **orbit bridges between spheres**
- **thickness = number of references (NOT importance)** ⚡

---

## 3) CROSS-USER COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
Enable users **(opt-in only)** to build shared understanding through **neutral aggregation of knowledge—not opinions.**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| **shared-topic thread** | ⚡ |
| **shared-project thread** | ⚡ |
| **shared-resource thread** | ⚡ |
| **shared-replay thread** | ⚡ |
| **consensus log** | **factual alignment, NOT agreement** ⚡ |

### Cross-User JSON (with participants + from_user + visibility) ⚡

```json
{
  "collective_thread": {
    "id": "uuid",
    "participants": ["user_a","user_b", "..."],
    "nodes": [
      { "id": "event_id", "from_user": "user_a" },
      { "id": "artifact_id", "from_user": "user_b" }
    ],
    "links": [
      { "from": "id", "to": "id", "reason": "shared_context" }
    ],
    "visibility": "opt-in",
    "hash": "sha256"
  }
}
```

### Cross-User Fields ⚡
| Field | Description |
|-------|-------------|
| `participants` | **Array of users** ⚡ |
| `nodes[].from_user` | **User attribution** ⚡ |
| `visibility` | **"opt-in"** ⚡ |

### Rules of Safety ⚡
| Rule | Status |
|------|--------|
| **requires explicit consent for each user** | ✅ ⚡ |
| **anonymizes sensitive data** | ✅ ⚡ |
| NO evaluative language | ✅ |
| **threads NEVER imply consensus or correctness** | ✅ ⚡ |

---

## THREAD ENGINE — GLOBAL RULES ⚡

### Thread Creation ⚡
Triggered ONLY by:
- explicit user action
- agent output (trace-only)
- replay validation
- cross-sphere reference
- **artifact mutation** ⚡

### Thread Modification ⚡
| Rule | Status |
|------|--------|
| append-only | ✅ |
| versioned | ✅ |
| **must include reason** | ✅ ⚡ |

### Thread Deletion ⚡
**Prohibited unless:**
- user deletes their own data
- **legal compliance (log required)** ⚡

---

## KNOWLEDGE THREAD REACT RENDERER ⚡

### Functions ⚡
| Function | Description |
|----------|-------------|
| display nodes + links | ✅ |
| **show hover explanations** | ⚡ |
| **expand/collapse clusters** | ⚡ |
| **cross-sphere bridge highlighting** | ⚡ |

### Modes ⚡
| Mode | Description |
|------|-------------|
| timeline | ✅ |
| **constellation** | ⚡ |
| **radial map** | ⚡ |
| **XR immersive threads** | (optional) ⚡ |

---

## AGENT ROLES (3 AGENTS)

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | creates nodes + links, ensures transparency |
| `AGENT_THREAD_EXPLAINER` | generates readable explanations, **never interprets intent** ⚡ |
| `AGENT_THREAD_GUARD` | prevents manipulative linking, **enforces opt-in policies** ⚡ |

---

## WHY KNOWLEDGE THREADS MATTER

They unify:
- replays, artifacts, decisions, spheres, users

> **Without ever rewriting meaning or shaping thought.**

> **Truth stays atomic. Understanding becomes navigable.**

---

**END — FREEZE READY**
