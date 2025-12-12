# CHE·NU — KNOWLEDGE THREADS + DOCUMENT UI + .CHENU PORTABLE BUNDLE
**VERSION:** K.v1.0  
**MODE:** FOUNDATION / BUILD-READY / NON-MANIPULATIVE

---

## 1) KNOWLEDGE THREAD — CORE CONCEPT

### Definition
A Knowledge Thread is a **STRUCTURED, TRACEABLE chain** of related knowledge events, artifacts, meetings, and decisions across spheres and time.

### RULE
> **Thread = STRUCTURE of relations**  
> **NOT narrative, NOT opinion.**

### Thread Carries
- ✅ links
- ✅ context
- ✅ provenance
- ✅ integrity

### Thread Does NOT Carry
- ❌ judgment
- ❌ success/failure labels
- ❌ emotional reading

---

## 2) THREE KNOWLEDGE THREAD TYPES

### 2.1 PERSONAL KNOWLEDGE THREAD

| Property | Value |
|----------|-------|
| ID | `personal_thread` |
| Scope | one user, cross-sphere |
| Sources | personal notes, saved replays, bookmarks, tasks |
| Usage | "My understanding of X over time" |

```json
{
  "knowledge_thread": {
    "type": "personal",
    "owner": "user_id",
    "topic": "string",
    "nodes": ["memory_entry_ids"],
    "timeline": true
  }
}
```

---

### 2.2 PROJECT / DOMAIN KNOWLEDGE THREAD

| Property | Value |
|----------|-------|
| ID | `project_thread` |
| Scope | one project/domain, multi-user, multi-sphere |
| Sources | project meetings, artifacts, decisions, design docs |
| Usage | "Everything related to Project Y" |

```json
{
  "knowledge_thread": {
    "type": "project",
    "project_id": "string",
    "sphere_anchor": "business|scholar|creative|...",
    "nodes": ["memory_entry_ids"],
    "status": "active|frozen|archived"
  }
}
```

---

### 2.3 COLLECTIVE KNOWLEDGE THREAD

| Property | Value |
|----------|-------|
| ID | `collective_thread` |
| Scope | multi-user, multi-agent, multi-sphere, cross-project |
| Sources | collective memory graph, shared replays, published artifacts |
| Usage | "What do WE know about topic Z?" |

```json
{
  "knowledge_thread": {
    "type": "collective",
    "topic": "string",
    "contributors": ["user_ids","agent_ids"],
    "nodes": ["memory_entry_ids"],
    "visibility": "team|org|public",
    "hash": "sha256"
  }
}
```

---

## 3) KNOWLEDGE THREAD — COMMON MODEL

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "personal|project|collective",
    "label": "string",
    "description": "string",
    "nodes": [
      {
        "id": "memory_id",
        "kind": "event|artifact|decision|replay|note|document",
        "timestamp": 1712345678,
        "sphere": "business|scholar|...",
        "link": "optional_url_or_ref"
      }
    ],
    "created_by": "user_or_agent_id",
    "created_at": "...",
    "updated_at": "...",
    "integrity_hash": "sha256"
  }
}
```

---

## 4) DOCUMENT UI — THREAD-CENTRIC VIEW

### Purpose
Provide a **DOCUMENT UI that is THREAD-FIRST**: documents are seen as NODES in a thread, NOT isolated files.

### RULE
> **Document UI = navigation of relations**  
> **NOT content manipulation.**

---

### 4.1 DOCUMENT UI LAYOUT

```
┌─────────────────────────────────────────────────────────────┐
│  REGION A — THREAD TIMELINE                                 │
│  ○───○───●───○───○───○                                      │
│  │   │   │   │   │   │                                      │
│  M   N   D   R   D   M  (Meeting/Note/Decision/Replay/Doc)  │
├─────────────────────────────────┬───────────────────────────┤
│  REGION B — DOCUMENT PANEL      │  REGION C — THREAD MAP    │
│                                 │                           │
│  [Preview] [Metadata] [Links]   │     ○───○                 │
│  [Replay]                       │      \   \                │
│                                 │       ○───●───○           │
│  Content of selected node...    │      /                    │
│                                 │     ○                     │
├─────────────────────────────────┴───────────────────────────┤
│  REGION D — ACTIONS                                         │
│  [+ New Node] [Attach Memory] [Fork Thread] [Freeze Thread] │
└─────────────────────────────────────────────────────────────┘
```

| Region | Purpose |
|--------|---------|
| A - Timeline | Vertical/horizontal, each node = dot + label + time + type icon |
| B - Document Panel | Selected node content, tabs: Preview, Metadata, Links, Replay |
| C - Thread Map | Mini-graph view, branches = subthreads, arrows = relations |
| D - Actions | Create node, attach memory, fork sub-thread, freeze thread |

---

### 4.2 DOCUMENT UI DATA CONTRACT

```json
{
  "thread_view": {
    "thread_id": "uuid",
    "nodes": ["..."],
    "selected_node_id": "uuid|null",
    "filters": {
      "type": ["event","decision","document"],
      "sphere": ["business","scholar"]
    },
    "layout": "timeline|grid|graph"
  }
}
```

---

## 5) PORTABLE KNOWLEDGE BUNDLE — .CHENU

### Purpose
Allow **EXPORT & IMPORT** of knowledge subsets (threads + docs + metadata) as a **PORTABLE, SIGNED PACKAGE**: `.chenu`

### RULE
> **Bundle = PORTABLE SNAPSHOT**  
> **NOT live sync, NOT full brain dump.**

---

### 5.1 BUNDLE CONTENTS

A `.chenu` file may contain:
- one or multiple knowledge threads
- embedded documents (or refs)
- minimal metadata per node
- integrity + source info
- optional replay references (not full replay data unless requested)

---

### 5.2 BUNDLE STRUCTURE

```
.chenu (container)
├── manifest.json
├── threads/
│   ├── thread_<id>.json
├── docs/
│   ├── doc_<id>.(md|pdf|json)
└── signatures/
    └── integrity.json
```

---

### 5.3 MANIFEST.JSON

```json
{
  "chenu_bundle": {
    "version": "1.0",
    "bundle_id": "uuid",
    "label": "string",
    "created_by": "user_or_agent",
    "created_at": "...",
    "threads": ["thread_ids"],
    "docs": ["doc_ids"],
    "source_system": "Che-Nu",
    "integrity_hash": "sha256"
  }
}
```

---

### 5.4 INTEGRITY & ETHICS

#### INTEGRITY
- hash over all thread + doc content
- optional per-thread hash
- optional per-doc hash

#### ETHICS
- ❌ no hidden metadata
- ✅ PII stripping option
- ✅ private nodes excluded by default
- ✅ explicit consent required for export

---

### 5.5 IMPORT BEHAVIOR

When a `.chenu` bundle is imported:
1. threads are mapped to local spheres
2. docs are attached to local storage
3. original integrity hashes preserved
4. **NO automatic merging**

**User decides:**
- import as read-only
- merge into existing thread
- create new sphere-local thread

---

## 6) AGENT ROLES AROUND KNOWLEDGE THREADS

| Agent | Role |
|-------|------|
| `AGENT_THREAD_WEAVER` | Helps build/extend threads, suggests nodes to link, **never alters content** |
| `AGENT_THREAD_EXPLAINER` | Summarizes thread structure, describes relations in neutral language |
| `AGENT_BUNDLE_EXPORTER` | Builds `.chenu` bundles, enforces integrity & ethics |
| `AGENT_BUNDLE_IMPORTER` | Safely ingests `.chenu`, highlights what will be created/linked |

---

## WHY THIS MATTERS

| Component | Purpose |
|-----------|---------|
| **Knowledge Threads** | Give SHAPE to what we know |
| **Document UI** | Make the shape NAVIGABLE |
| **.chenu Bundles** | Make the shape PORTABLE without losing provenance or ethics |

---

**END — KNOWLEDGE THREADS FOUNDATION**
