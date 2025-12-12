# CHE·NU — KNOWLEDGE THREADS (3 TYPES) + THREAD UI
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## 1) KNOWLEDGE THREADS — CORE SYSTEM ⚡

### Purpose
Connect information across spheres, meetings, replays, artifacts, agents, and user activity **WITHOUT interpretation.**

### RULE
> **Knowledge Thread = link between FACTS, not meaning.**

### Thread Object JSON ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "event|concept|workflow",
    "nodes": ["memory_id", "artifact_id", "meeting_id"],
    "links": [{ "from": "id", "to": "id", "reason": "string" }],
    "origin": "auto|manual",
    "visibility": "private|team|sphere",
    "hash": "sha256"
  }
}
```

### Thread Properties ⚡
| Property | Status |
|----------|--------|
| **immutable once published** | ✅ ⚡ |
| **auditable** | ✅ ⚡ |
| **no inference** | ✅ ⚡ |
| **context-neutral** | ✅ ⚡ |
| **cross-sphere capable** | ✅ ⚡ |

### Constraints ⚡
| Forbidden | Status |
|-----------|--------|
| **no narrative composition** | ❌ ⚡ |
| **no ranking of threads** | ❌ ⚡ |
| **no persuasion** | ❌ ⚡ |
| **no weight scoring** | ❌ ⚡ |
| **no intent guessing** | ❌ ⚡ |

---

## 2) KNOWLEDGE THREAD TYPES (3 TYPES) ⚡

---

### TYPE 1 — EVENT THREAD ⚡

#### Purpose
Links **FACTUAL EVENTS** across time and spheres.

#### Examples ⚡
| Example | Description |
|---------|-------------|
| repeated decisions | ⚡ |
| recurring blockers | ⚡ |
| multi-meeting sequences | ⚡ |
| cross-sphere actions | ⚡ |

#### Event Thread Rule ⚡
> Events connect ONLY if: **same participants** OR **same artifacts** OR **same timestamp window** OR **same sphere topic**

#### Event Thread JSON ⚡

```json
{
  "thread_type": "event",
  "events": ["event_id_1", "event_id_2", "..."],
  "criteria": ["shared_topic", "similar_timestamp"],
  "timeline_view": true
}
```

---

### TYPE 2 — CONCEPT THREAD ⚡

#### Purpose
Link artifacts, notes, documents, and replays around the **SAME CONCEPT or object.**

#### Allowed Sources ⚡
| Source | Status |
|--------|--------|
| documents | ✅ ⚡ |
| visual ideas | ✅ ⚡ |
| sketches | ✅ ⚡ |
| summary boards | ✅ ⚡ |
| knowledge anchors | ✅ ⚡ |

#### NOT Allowed ⚡
| Forbidden | Status |
|-----------|--------|
| **inferred meaning** | ❌ ⚡ |
| **emotional tags** | ❌ ⚡ |

#### Concept Thread JSON ⚡

```json
{
  "thread_type": "concept",
  "concept": "string",
  "artifacts": ["artifact_1", "artifact_2"],
  "replays": ["replay_id"],
  "cluster_strength": "0.0-1.0"
}
```

---

### TYPE 3 — WORKFLOW THREAD ⚡

#### Purpose
Map **multi-step processes across spheres.**

#### Examples ⚡
| Flow | Description |
|------|-------------|
| Business → Creative → XR → Institution | ⚡ |
| Scholar research → Business pitch | ⚡ |
| Methodology → Meeting → Decision | ⚡ |

#### RULE
> **NOT a recommendation. NOT an optimization. Just a map of what actually happened.**

#### Workflow Thread JSON ⚡

```json
{
  "thread_type": "workflow",
  "steps": [
    { "sphere": "business", "event": "uuid" },
    { "sphere": "creative", "event": "uuid" },
    { "sphere": "xr", "event": "uuid" }
  ],
  "sequence_verified": true
}
```

---

## KNOWLEDGE THREAD ENGINE ⚡

### Inputs ⚡
| Input | Description |
|-------|-------------|
| `memory_graph` | ⚡ |
| `artifacts` | ⚡ |
| `threads` | ⚡ |
| `cross-sphere index` | ⚡ |

### Outputs ⚡
| Output | Description |
|--------|-------------|
| `verified thread` | ⚡ |
| `rejection reason` | ⚡ |
| `hash` | ⚡ |

### Engine Rules ⚡
| Rule | Status |
|------|--------|
| **strict matching** | ✅ ⚡ |
| **no guessing** | ✅ ⚡ |
| **no semantic invention** | ✅ ⚡ |
| **explicit linking only** | ✅ ⚡ |

### Agents ⚡
| Agent | Role |
|-------|------|
| `THREAD_ANALYZER` | **verifies** ⚡ |
| `THREAD_BUILDER` | **assembles** ⚡ |
| `THREAD_GUARD` | **prevents overreach** ⚡ |

---

## 3) KNOWLEDGE THREAD UI ⚡

### Purpose
Let users **SEE and NAVIGATE threads** WITHOUT interpretation or overload.

### RULE
> **UI shows structure, not meaning.**

### UI Modes ⚡
| Mode | Description |
|------|-------------|
| `THREAD_LIST` | chronological or by sphere, compact node preview, **hash + metadata visible** ⚡ |
| `THREAD_GRAPH` | nodes = events/artifacts/meetings, edges = thread links, **color-coded by thread type** ⚡ |
| `THREAD_TIMELINE` | event threads only, **cross-sphere timeline ribbon** ⚡ |
| `THREAD_COMPARISON` | compare two threads, **diff nodes highlighted** ⚡ |

### Interactions ⚡
| Function | Description |
|----------|-------------|
| `expand_node` | ⚡ |
| `collapse_chain` | ⚡ |
| `follow_link` | ⚡ |
| `open_artifact` | ⚡ |
| `open_replay` | ⚡ |
| `export_pdf` | ⚡ |
| `export_thread_bundle` | ⚡ |

### Thread UI Data Model ⚡

```json
{
  "ui_thread_view": {
    "thread_id": "uuid",
    "mode": "list|graph|timeline|compare",
    "filters": {
      "sphere": ["business", "scholar", "..."],
      "type": ["event", "concept", "workflow"],
      "participants": ["user|agent"]
    }
  }
}
```

### Thread UI Safety ⚡
| Rule | Status |
|------|--------|
| **no highlight implying importance** | ✅ ⚡ |
| **no narrative synthesis** | ✅ ⚡ |
| **no "top thread"** | ✅ ⚡ |
| **no clustering by sentiment** | ✅ ⚡ |
| **no attention direction algorithms** | ✅ ⚡ |

---

## REACT COMPONENT STRUCTURE ⚡ (NOUVEAU!)

```
/components/threads/ThreadView.tsx
/components/threads/ThreadNode.tsx
/components/threads/ThreadLink.tsx
/components/threads/ThreadTimeline.tsx
/components/threads/ThreadGraph.tsx
/components/threads/ThreadCompare.tsx
```

### React Props ⚡

```tsx
<ThreadView
  thread={ThreadObject}
  mode="list|graph|timeline|compare"
  onSelectNode={(id) => {}}
  onOpenReplay={(id) => {}}
  onOpenArtifact={(id) => {}}
/>
```

---

**END — KNOWLEDGE THREAD SYSTEM (3 TYPES + UI)**
