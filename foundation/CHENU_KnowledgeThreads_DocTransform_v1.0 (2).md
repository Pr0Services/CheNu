# CHE·NU — KNOWLEDGE THREADS + DOCUMENT TRANSFORMATION SYSTEM
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## I) KNOWLEDGE THREADS — CORE CONCEPT

### Definition
A Knowledge Thread is a **TRACEABLE LINE** of information connecting data, actions, decisions, and artifacts across time, meetings, agents, and spheres.

### RULE
> **Threads DESCRIBE knowledge.**  
> **They NEVER decide, judge, or optimize.**

---

## II) THREE KNOWLEDGE THREAD TYPES

### 1) FACT THREAD

**Purpose:** Track objective facts exactly as they occurred.

**Includes:**
- timestamps
- sources
- artifacts
- decisions (as declared, not evaluated)

**Properties:**
- immutable
- append-only
- cryptographically hashed
- replay-linkable

**Example:** "Document A referenced in Meeting X → Decision Y recorded → Exported as PDF Z"

```json
{
  "thread": {
    "id": "uuid",
    "type": "fact",
    "nodes": ["artifact","meeting","decision"],
    "timestamps": ["..."],
    "hash": "sha256"
  }
}
```

---

### 2) CONTEXT THREAD

**Purpose:** Preserve WHY something existed without interpreting intention.

**Includes:**
- meeting context
- sphere context
- participants
- constraints at the time

**Properties:**
- immutable after validation
- read-only in replay mode

**Example:** "Decision occurred during constraint period, with these participants, under this domain."

```json
{
  "thread": {
    "id": "uuid",
    "type": "context",
    "sphere": "business|scholar|xr|...",
    "participants": ["user","agent"],
    "constraints": ["time","resource"]
  }
}
```

---

### 3) EVOLUTION THREAD

**Purpose:** Show how information changed without saying if change was good or bad.

**Includes:**
- document versions
- format transformations
- structural changes
- compaction / expansion events

**Properties:**
- directional
- reversible
- versioned

**Example:** "Raw notes → Structured doc → PDF → Compacted archive"

```json
{
  "thread": {
    "id": "uuid",
    "type": "evolution",
    "versions": [
      { "v":1, "format":"raw", "action":"create" },
      { "v":2, "format":"md", "action":"structure" },
      { "v":3, "format":"pdf", "action":"export" }
    ]
  }
}
```

---

## III) KNOWLEDGE THREAD GRAPH

### Nodes
- documents
- meetings
- decisions
- agents
- users
- exports

### Edges
- `references`
- `transforms_to`
- `derived_from`
- `replayed_in`

### Graph Properties
- explorable
- filterable
- non-hierarchical
- readable in Universe View

---

## IV) DOCUMENT TYPE & TRANSFORMATION SYSTEM

### Purpose
Let users **COMPACT** knowledge when inactive and **DECOMPACT** it instantly when needed.

### RULE
> **Transformation NEVER deletes information.**  
> **Only changes representation.**

---

### SUPPORTED BASE TYPES

| Type | Description |
|------|-------------|
| `raw_text` | Plain text, unformatted |
| `markdown` | Structured text with formatting |
| `structured_data` | JSON/YAML data |
| `visual` | Images/diagrams |
| `audio_transcript` | Transcribed audio |
| `video_transcript` | Transcribed video |

---

### SUPPORTED OUTPUT TYPES

| Format | Use Case |
|--------|----------|
| `markdown` | Canonical internal format |
| `pdf` | Distribution, archiving |
| `html` | Web publishing |
| `docx` | External collaboration |
| `compact_bundle` | `.chenu` archive format |
| `xr_artifact` | XR/3D environments |

---

### TRANSFORMATION ACTIONS

| Action | Description |
|--------|-------------|
| `structure` | raw → md |
| `summarize` | loss-aware, reversible |
| `compress` | bundle multiple artifacts |
| `expand` | restore full detail |
| `publish` | export format |
| `archive` | cold storage |

---

### DOCUMENT TRANSFORMATION JSON

```json
{
  "document_transform": {
    "source_id": "uuid",
    "from": "markdown",
    "to": "pdf",
    "action": "export",
    "thread_id": "evolution_thread_uuid",
    "reversible": true
  }
}
```

---

## V) COMPACT / DECOMPACT LOGIC

### COMPACT
- replaces detailed nodes with reference pointers
- preserves hashes & threads
- reduces visual & cognitive load

### DECOMPACT
- restores full document tree
- restores timelines & context
- no recomputation needed

---

## VI) AGENTS INVOLVED (NON-AUTHORITATIVE)

### AGENT_DOCUMENT_ORGANIZER
- suggests formats
- suggests compaction moments
- **never auto-executes**

### AGENT_FORMAT_CONVERTER
- handles transformation pipelines
- deterministic only

### AGENT_THREAD_GUARD
- ensures thread integrity
- prevents loss of traceability

---

## VII) WHY THIS MATTERS

### This system allows:
- ✅ massive projects without clutter
- ✅ deep history without overload
- ✅ portable knowledge
- ✅ forensic-level traceability

### WITHOUT:
- ❌ hiding information
- ❌ rewriting history
- ❌ forcing conclusions

---

**END — FOUNDATION COMPLETE**
