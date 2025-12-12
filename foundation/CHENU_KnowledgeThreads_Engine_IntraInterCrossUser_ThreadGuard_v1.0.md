# CHE·NU — KNOWLEDGE THREAD ENGINE
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / READ-ONLY LINK ENGINE

---

## GLOBAL PRINCIPLE

> Knowledge Threads connect *facts → artifacts → events → decisions* **WITHOUT interpretation, persuasion, ranking, or emotional metadata.**

### RULE
> **Threads = structural links only. No meaning. No scoring. No prioritization.**

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS

### Purpose
Link information **INSIDE a single sphere** (Business, Scholar, Creative, etc.) to reveal structure, not judgement.

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `topic_chain` | **documents + meetings on same subject** ⚡ |
| `artifact_chain` | **visual boards, notes, files** ⚡ |
| `decision_chain` | **sequential outcomes** ⚡ |
| `timeline_chain` | **chronology** ⚡ |

### Intra-Sphere Data Model ⚡

```json
{
  "intra_thread": {
    "sphere": "business|scholar|creative|...",
    "nodes": ["uuid_document","uuid_meeting","uuid_decision"],
    "edges": ["topic_chain","timeline_chain"],
    "hash": "sha256"
  }
}
```

### Intra Fields ⚡
| Field | Description |
|-------|-------------|
| `edges` | **Array of chain types** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **In-sphere only** | ✅ ⚡ |
| Immutable once validated | ✅ |
| Read-only | ✅ |
| **Thread cannot infer consequences** | ✅ ⚡ |

### UI Representation ⚡
| Property | Value |
|----------|-------|
| **soft line** | ⚡ |
| **no animation bias** | ⚡ |
| **collapsible cluster** | ⚡ |
| **accessible in 2D + XR** | ⚡ |

### Safety ⚡
| Forbidden | Status |
|-----------|--------|
| summarization | ❌ |
| interpretation | ❌ |
| **merging unrelated data** | ❌ ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Reveal connections **BETWEEN spheres** without implying meaning. This is the backbone of the Che-Nu **"Unified Knowledge Map"**.

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `cross_sphere_topic` | **concept appears in multiple spheres** ⚡ |
| `cross_sphere_artifact` | **same file used in multiple contexts** ⚡ |
| `cross_sphere_decision_flow` | **decision in sphere A referenced in B** ⚡ |
| `cross_sphere_agent_activity` | **agent involved in multiple spheres** ⚡ |

### Inter-Sphere Data Model ⚡

```json
{
  "inter_thread": {
    "spheres": ["business","scholar"],
    "link_reason": "artifact|topic|decision",
    "nodes": ["uuid1","uuid2"],
    "bidirectional": true,
    "hash": "sha256"
  }
}
```

### Inter Fields ⚡
| Field | Description |
|-------|-------------|
| `link_reason` | **artifact/topic/decision** ⚡ |
| `bidirectional` | **true** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **Requires explicit validation (no auto-linking)** | ✅ ⚡ |
| **Cross-sphere links ALWAYS appear thinner/more neutral** | ✅ ⚡ |
| **User can disable namespace linking** | ✅ ⚡ |

### UI Representation ⚡
| Property | Value |
|----------|-------|
| **dotted line (never solid)** | ⚡ |
| **fade animation only on hover** | ⚡ |
| **link explanation required on selection** | ⚡ |

### Safety ⚡
| Forbidden | Status |
|-----------|--------|
| **cannot propose cross-sphere meaning** | ❌ ⚡ |
| **cannot cluster spheres automatically** | ❌ ⚡ |
| **user retains full control** | ✅ ⚡ |

---

## 3) CROSS-USER / CROSS-MEETING KNOWLEDGE THREADS ⚡

### Purpose
Allow comparison and linking across different users AND meetings **WITHOUT making any social inference or "similarity scoring".**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `meeting_reference_thread` | **meeting A references artifact from meeting B** ⚡ |
| `replay_evidence_thread` | **replays sharing factual nodes** ⚡ |
| `collective_memory_thread` | **shared validated facts** ⚡ |
| `topic_alignment_thread` | **same topic keyword, no interpretation** ⚡ |

### Cross-User Data Model ⚡

```json
{
  "cross_user_thread": {
    "thread_id": "uuid",
    "source_meetings": ["uuidA","uuidB"],
    "shared_elements": ["artifact","decision","topic"],
    "visible_to": ["userA","userB"],
    "hash": "sha256"
  }
}
```

### Cross-User Fields ⚡
| Field | Description |
|-------|-------------|
| `source_meetings` | **Array of meeting UUIDs** ⚡ |
| `shared_elements` | **["artifact","decision","topic"]** ⚡ |
| `visible_to` | **Array of user IDs** ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **All threads must originate from validated replays or artifacts** | ✅ ⚡ |
| **NEVER links users directly. Only links data points.** | ✅ ⚡ |
| **No behavioral inference allowed** | ✅ ⚡ |

### UI Representation ⚡
| Property | Value |
|----------|-------|
| **ghost lines between meeting nodes in Universe View** | ⚡ |
| **accessible from Replay Comparison Mode** | ⚡ |
| **optional anonymization layer** | ⚡ |

### Safety ⚡
| Forbidden | Status |
|-----------|--------|
| **no suggestion that users "converge" or "diverge"** | ❌ ⚡ |
| **no emotional or behavioral metadata** | ❌ ⚡ |
| **no automatic grouping of people** | ❌ ⚡ |

---

## THREAD ENGINE — CORE LOGIC ⚡

### Thread Creation ⚡
| Trigger | Process |
|---------|---------|
| **triggered by event** | (replay validated, artifact updated) ⚡ |
| **validated by ThreadGuard Agent** | ⚡ |

### THREAD_GUARD AGENT ⚡
| Responsibility | Status |
|----------------|--------|
| **ensures non-manipulation rules** | ✅ ⚡ |
| **ensures no psychological inference** | ✅ ⚡ |
| **ensures only structural links** | ✅ ⚡ |

### THREAD_VIEWER ⚡
| Responsibility | Status |
|----------------|--------|
| renders thread clusters | ✅ |
| **maintains neutral display** | ⚡ |
| **allows filtering by sphere/time/topic** | ⚡ |

---

## THREAD EXPORT ⚡

| Format | Description |
|--------|-------------|
| `.thread.json` | **full structural map** ⚡ |
| `.pdf-summary` | read-only |
| `.ktpack` | **XR bundle with thread paths rendered** ⚡ |

---

**END — FREEZE-READY**
