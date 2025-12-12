# CHE·NU — KNOWLEDGE THREAD SYSTEM + NEXT-VIEW ENGINE
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Reveal logical continuity INSIDE a sphere without interpretation.**

### RULE
> **Threads = factual link lines. NOT conclusions, NOT suggestions.**

### 4 Thread Types (INTRA) ⚡
| Type | Description |
|------|-------------|
| `INTRA_EVENT_CHAIN` | ordered sequence of related events, **no causality implied** ⚡ |
| `INTRA_ARTIFACT_LINE` | documents, boards, media sharing same topic tag ⚡ |
| `INTRA_DECISION_LINE` | decision progressions within one sphere, **no "correctness" score** ⚡ |
| `INTRA_AGENT_TRACE` | **agent actions chronologically aligned** ⚡ |

### Intra-Thread JSON ⚡
```json
{
  "kt_intra": {
    "sphere": "business|scholar|...",
    "thread_id": "uuid",
    "nodes": [
      { "id": "uuid", "type": "event|artifact|decision", "timestamp": 17123 }
    ],
    "links": [
      { "from": "uuid", "to": "uuid", "relation": "topic|sequence|reference" }
    ]
  }
}
```

### Visualization ⚡
| Property | Status |
|----------|--------|
| linear or radial chain | ⚡ |
| **subtle linking line** | ⚡ |
| **highlight only on focus** | ✅ ⚡ |
| **no auto-emphasis** | ✅ ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Show how KNOWLEDGE travels BETWEEN spheres without merging their roles.**

### RULE
> **Inter-sphere ≠ inter-authority. No cross-sphere control allowed.**

### 4 Thread Types (INTER) ⚡
| Type | Description |
|------|-------------|
| `TOPIC_BRIDGE` | same topic across two spheres (e.g. Scholar research → Business project) ⚡ |
| `ARTIFACT_MIGRATION` | **file or doc reused across domains** ⚡ |
| `CONTEXT_MIRROR` | **similar problem appears in multiple spheres** ⚡ |
| `DECISION_ECHO` | decision influences task in another sphere — **"linked event" NOT "cause"** ⚡ |

### Inter-Thread JSON ⚡
```json
{
  "kt_inter": {
    "thread_id": "uuid",
    "spheres": ["business", "creative", "institution"],
    "nodes": ["..."],
    "links": [
      { "from": "idA", "to": "idB", "relation": "topic_bridge" }
    ]
  }
}
```

### Visualization ⚡
| Property | Status |
|----------|--------|
| **orbit lines between sphere nodes** | ⚡ |
| **color-coded by sphere pair** | ⚡ |
| **always manually expandable** | ✅ ⚡ |
| **no auto-expansion** | ✅ ⚡ |

---

## 3) COLLECTIVE KNOWLEDGE THREADS (CROSS-USER) ⚡

### Purpose
> **Surface convergences in the collective memory WITHOUT exposing identities, WITHOUT psychological inference.**

### RULE
> **Collective Thread = shared factual structure. NOT consensus, NOT preference, NOT trend analysis.**

### 4 Thread Types (COLLECTIVE) ⚡
| Type | Description |
|------|-------------|
| `COLLECTIVE_PATTERN` | multiple users, same sequence of actions **(anonymized)** ⚡ |
| `COLLECTIVE_REFERENCE` | **recurring artifact used across many contexts** ⚡ |
| `COLLECTIVE_TIMELINE_OVERLAY` | **moments where many events cluster together** ⚡ |
| `COLLECTIVE_SILENCE_FIELD` | **long gaps where no events occurred (useful context)** ⚡ |

### Collective Thread JSON ⚡
```json
{
  "kt_collective": {
    "thread_id": "uuid",
    "anonymized_groups": ["groupA", "groupB"],
    "shared_nodes": ["..."],
    "shared_links": ["..."],
    "privacy": "strict"
  }
}
```

### Safety Rules ⚡
| Rule | Status |
|------|--------|
| **no user identity** | ✅ ⚡ |
| **no behavioral inference** | ✅ ⚡ |
| **no trend prediction** | ✅ ⚡ |
| **no influence scoring** | ✅ ⚡ |
| **only structure, never sentiment** | ✅ ⚡ |

---

## NEXT-VIEW ENGINE (KNOWLEDGE-DRIVEN VIEW) ⚡ (NOUVEAU!)

### Purpose
> **Compute the NEXT BEST VIEW of the universe graph based on KNOWLEDGE STRUCTURE ONLY — not preferences, not psychology, not nudging.**

> **"Next View" = Where knowledge CONTINUES, not where attention SHOULD go.**

### Input ⚡
| Input | Description |
|-------|-------------|
| active node | meeting, replay, artifact ⚡ |
| associated knowledge threads | intra, inter, collective ⚡ |
| user navigation profile | ⚡ |
| **sphere priority (optional)** | ⚡ |

### 5-Step Logic (NEVER PRESCRIPTIVE) ⚡
| Step | Action |
|------|--------|
| **STEP 1** | identify adjacent knowledge nodes ⚡ |
| **STEP 2** | cluster by sphere ⚡ |
| **STEP 3** | filter by user profile density ⚡ |
| **STEP 4** | generate a "possible next viewset" ⚡ |
| **STEP 5** | **user chooses the view manually** ⚡ |

> **No forced navigation.**

### Next View JSON ⚡
```json
{
  "next_view": {
    "origin_node": "uuid",
    "candidate_views": [
      { "target": "uuid", "thread_type": "intra" },
      { "target": "uuid", "thread_type": "inter" },
      { "target": "uuid", "thread_type": "collective" }
    ],
    "explanation": "factual_links_only",
    "user_confirmation_required": true
  }
}
```

### Key Field: `user_confirmation_required` ⚡
> **Always TRUE — no automatic navigation**

### Visual Rendering ⚡
| Property | Status |
|----------|--------|
| **gentle halo around candidate nodes** | ⚡ |
| **dotted thread-lines visible on hover** | ⚡ |
| **explanation panel displayed on click** | ⚡ |
| **no automatic focus shift** | ✅ ⚡ |
| **no attention grab effects** | ✅ ⚡ |

---

**END — KNOWLEDGE THREAD SYSTEM + NEXT VIEW ENGINE**
