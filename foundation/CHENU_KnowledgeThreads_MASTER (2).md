# CHE·NU — KNOWLEDGE THREADS: MASTER REFERENCE
**VERSION:** MASTER.v1.0  
**CONSOLIDATES:** KTHREAD.v1.0 + CORE.v1.0 + K.v1.0

---

## THREAD TYPE MATRIX

### Three Classification Systems

| Source | Classification | Types |
|--------|---------------|-------|
| **KTHREAD.v1.0** | By Scope | Personal, Collective, Cross-Sphere |
| **CORE.v1.0** | By Content | Fact, Context, Evolution |
| **K.v1.0** | By Ownership | Personal, Project, Collective |

### Unified Thread Classification

```
THREAD = SCOPE × CONTENT × STATUS

SCOPE:      personal | project | collective | cross-sphere
CONTENT:    fact | context | evolution
STATUS:     active | frozen | archived
```

---

## CANONICAL THREAD MODEL (MASTER)

```json
{
  "knowledge_thread": {
    "id": "uuid",
    
    // CLASSIFICATION
    "scope": "personal|project|collective|cross_sphere",
    "content_type": "fact|context|evolution|mixed",
    "status": "active|frozen|archived",
    
    // OWNERSHIP
    "owner": "user_id|null",
    "project_id": "project_id|null",
    "group_id": "group_id|null",
    "contributors": ["user_ids", "agent_ids"],
    
    // SPHERES
    "sphere_anchor": "business|scholar|creative|xr",
    "spheres": ["business", "scholar"],
    
    // VISIBILITY
    "visibility": "private|team|org|public",
    
    // CONTENT
    "label": "string",
    "description": "string",
    "topic": "string|null",
    
    // NODES
    "nodes": [
      {
        "id": "uuid",
        "kind": "memory|meeting|replay|decision|artifact|document|note|event|agent_action",
        "sphere": "business|scholar|xr",
        "timestamp": 1712345678,
        "version": 1,
        "link": "optional_url_or_ref",
        "hash": "sha256"
      }
    ],
    
    // METADATA
    "created_by": "user_or_agent_id",
    "created_at": "ISO8601",
    "updated_at": "ISO8601",
    "integrity_hash": "sha256",
    "timeline": true
  }
}
```

---

## NODE KINDS (COMPLETE LIST)

| Kind | Description | Source |
|------|-------------|--------|
| `memory` | Memory entry from Collective Memory | KTHREAD |
| `meeting` | Meeting record | ALL |
| `replay` | Meeting replay | ALL |
| `decision` | Recorded decision | ALL |
| `artifact` | Created artifact | ALL |
| `document` | Document (md, pdf, etc.) | K.v1.0 |
| `note` | Personal note | K.v1.0 |
| `event` | Generic event | K.v1.0 |
| `agent_action` | Agent action record | KTHREAD |
| `export` | Export action | CORE |

---

## THREAD GRAPH

### Nodes
documents, meetings, decisions, agents, users, exports, notes, events

### Edges
| Edge | Meaning |
|------|---------|
| `references` | Node A references Node B |
| `transforms_to` | Document version transformation |
| `derived_from` | Origin relationship |
| `replayed_in` | Replay link |
| `followed_by` | Temporal sequence |
| `caused` | Causal relationship |

---

## DOCUMENT UI (from K.v1.0)

### Layout Regions

```
┌─────────────────────────────────────────────────┐
│  A: THREAD TIMELINE (horizontal/vertical)       │
│  ○───○───●───○───○───○                          │
├─────────────────────────┬───────────────────────┤
│  B: DOCUMENT PANEL      │  C: THREAD MAP        │
│  [Preview][Meta][Links] │     ○───○             │
│                         │      \   \            │
│  Content display...     │       ○───●───○       │
├─────────────────────────┴───────────────────────┤
│  D: ACTIONS [+Node][Attach][Fork][Freeze]       │
└─────────────────────────────────────────────────┘
```

### View Data Contract

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

## .CHENU PORTABLE BUNDLE

### Structure

```
.chenu (container)
├── manifest.json
├── threads/
│   └── thread_<id>.json
├── docs/
│   └── doc_<id>.(md|pdf|json)
└── signatures/
    └── integrity.json
```

### Manifest

```json
{
  "chenu_bundle": {
    "version": "1.0",
    "bundle_id": "uuid",
    "label": "string",
    "created_by": "user_or_agent",
    "created_at": "ISO8601",
    "threads": ["thread_ids"],
    "docs": ["doc_ids"],
    "source_system": "Che-Nu",
    "integrity_hash": "sha256"
  }
}
```

### Import Rules
- NO automatic merging
- User chooses: read-only | merge | new thread
- Original hashes preserved
- PII stripping option available

---

## DOCUMENT TRANSFORMATION

### Pipeline

```
Raw Text ──structure──> Markdown ──publish──> PDF
    │                       │                  │
    └── Evolution Thread ───┴──────────────────┘
```

### Actions
| Action | From | To |
|--------|------|-----|
| `structure` | raw | md |
| `summarize` | any | condensed (reversible) |
| `compress` | multiple | bundle |
| `expand` | bundle | full |
| `publish` | md | pdf/html/docx |
| `archive` | any | cold storage |

### Compact/Decompact
- **COMPACT**: nodes → pointers, preserves threads
- **DECOMPACT**: restore full tree, thread history intact

---

## ALL THREAD AGENTS

| Agent | Role | Source |
|-------|------|--------|
| `AGENT_THREAD_GUIDE` | Navigate & suggest threads | KTHREAD |
| `AGENT_THREAD_GUARD` | Ensure integrity & traceability | CORE |
| `AGENT_THREAD_WEAVER` | Build/extend threads, suggest links | K.v1.0 |
| `AGENT_THREAD_EXPLAINER` | Summarize structure neutrally | K.v1.0 |
| `AGENT_THREAD_LEARNER` | Learn structural patterns only | KTHREAD |
| `AGENT_DOCUMENT_ORGANIZER` | Suggest formats & compaction | CORE |
| `AGENT_FORMAT_CONVERTER` | Handle transformations | CORE |
| `AGENT_BUNDLE_EXPORTER` | Build .chenu bundles | K.v1.0 |
| `AGENT_BUNDLE_IMPORTER` | Safely ingest .chenu | K.v1.0 |

---

## UNIVERSAL RULES (ALL SOURCES)

### THREADS MUST
- ✅ Be auditable (who, what, when)
- ✅ Preserve integrity hashes
- ✅ Require user approval for changes
- ✅ Support forking (not rewriting)
- ✅ Show all contexts (no hiding)

### THREADS MUST NOT
- ❌ Judge or evaluate
- ❌ Use emotional language
- ❌ Rank by "success"
- ❌ Optimize for engagement
- ❌ Hide contradictory info
- ❌ Auto-execute changes

---

## NAVIGATION INTEGRATION

### Universe View Thread Paths

| Thread Type | Visual |
|-------------|--------|
| Personal | thin subtle lines |
| Project | medium highlighted |
| Collective | thicker semi-highlighted |
| Cross-Sphere | multi-colored braids |

### Navigation Actions
- `follow_thread(thread_id)`
- `next_node(thread_id, current_node)`
- `previous_node(...)`
- `fork_thread(new_thread_id, from_node)`
- `view_thread_summary(thread_id)`

**No auto-path forcing. No auto-zoom without confirmation.**

---

## FILE REFERENCE

| File | Version | Focus |
|------|---------|-------|
| `Foundation_v1.6.md` | v1.6 | Base conceptuelle |
| `Navigation_v1.0.md` | KTHREAD.v1.0 | Scope threads + Universe Nav |
| `DocTransform_v1.0.md` | CORE.v1.0 | Content threads + Transformation |
| `DocUI_Bundle_v1.0.md` | K.v1.0 | Document UI + .chenu Bundle |
| **`MASTER.md`** | MASTER.v1.0 | **This file - Complete reference** |

---

**END — KNOWLEDGE THREADS MASTER REFERENCE**

---

## LEARNING AGENT (from LearningAgent v1.6)

### AGENT_LEARNING_OBSERVER

| Property | Value |
|----------|-------|
| TYPE | PASSIVE / STRUCTURAL / NON-STRATEGIC |
| Purpose | Learn how INFORMATION is organized |

### CAN Observe
- frequency of thread creation
- thread branching patterns
- thread reuse across spheres
- navigation patterns (anonymous)
- structural redundancies

### CANNOT Do
- make recommendations
- modify threads
- rank information
- infer intent
- influence users

### Learning Output Model

```json
{
  "learning_report": {
    "scope": "personal|team|sphere|system",
    "metrics": {
      "thread_count": 120,
      "avg_depth": 3.2,
      "branch_ratio": 0.41,
      "reuse_rate": 0.67
    },
    "observations": [
      "High duplication in scholar threads",
      "Low reuse across business/xr spheres"
    ]
  }
}
```

### Ethical Locks
- No predictive behavior
- No optimization pressure
- No success labeling
- No future inference

---

## DRIFT DETECTION (from DriftIntegrity v1.0)

### Definition
> **Drift = divergence between original factual state and later representation**

### Three Drift Types

| Type | Description |
|------|-------------|
| **Structural** | missing nodes, reordered sequence, altered chain |
| **Context** | sphere mismatch, time displacement |
| **Reference** | source replaced, omitted, or unlinked |

### Drift Event Model

```json
{
  "drift_event": {
    "thread_id": "uuid",
    "drift_type": "structural|context|reference",
    "detected_at": 1712349999,
    "original_hash": "sha256",
    "current_hash": "sha256",
    "delta_summary": "text",
    "severity": "low|medium|high"
  }
}
```

### Drift Detection Rules
- ✅ Passive only, visible on demand
- ❌ Never auto-fixes, assigns blame, or hides content

---

## INTEGRITY VERIFICATION

### Flow
1. verify hash chain
2. match source replay  
3. confirm timestamp order
4. validate visibility scope
5. confirm no silent deletion

### Integrity Proof Model

```json
{
  "integrity_proof": {
    "thread_id": "uuid",
    "verified": true,
    "last_checked": 1712351111,
    "proof_level": "full",
    "notes": []
  }
}
```

### If Verification Fails
- `integrity_status = "broken"`
- Content remains visible (marked only)
- NO hiding, NO deletion

---

## CROSS-SPHERE THREADS (from CrossSphereBinding v1.0)

### Cross-Sphere Types

| Type | Description |
|------|-------------|
| `THREAD_SPHERE_EVENT` | Event in one sphere → reference in another |
| `THREAD_SPHERE_ARTIFACT` | Same file across spheres |
| `THREAD_SPHERE_DECISION` | Parallel decisions, same anchors |
| `THREAD_SPHERE_CONTEXT` | XR ↔ Scholar, etc. |

### Cross-Sphere JSON

```json
{
  "cross_sphere_thread": {
    "id": "uuid",
    "from_sphere": "business",
    "to_sphere": "creative",
    "nodes": ["uuid","uuid","uuid"],
    "link_strength": 0.56,
    "verified": true,
    "hash": "sha256"
  }
}
```

---

## COLLECTIVE BINDING (Memory ↔ Thread)

### Architecture

```
COLLECTIVE MEMORY ENTRY → NODE
KNOWLEDGE THREAD        → EDGE
UNIVERSE VIEW           → GRAPH VISUALIZATION
```

### Binding JSON

```json
{
  "collective_binding": {
    "memory_entries": ["uuid","uuid"],
    "threads": ["thread_id_1","thread_id_2"],
    "spheres_involved": ["business","scholar","xr"],
    "hash_tree": "merkle_root_hash",
    "version": 4
  }
}
```

### Binding Agents

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assemble from facts |
| `AGENT_MEMORY_BINDER` | Connect + verify hashes |
| `AGENT_THREAD_EXPLAINER` | Simple labels only |

---

## 3-TIER ARCHITECTURE (from 3Tiers_Engine v1.0)

### Tier Hierarchy

| Tier | Name | Content |
|------|------|---------|
| **1** | FACT THREAD | Raw events, timestamps, "what happened" |
| **2** | CONTEXT THREAD | Grouped by topic/sphere/participants |
| **3** | KNOWLEDGE THREAD | Cross-sphere map, density score |

### Thread Engine Pipeline

```
INDEX → FACTS → CONTEXT → KNOWLEDGE → DENSITY
```

### Engine Config

```json
{
  "thread_engine": {
    "auto_generate": true,
    "min_context_links": 2,
    "max_cross_sphere": 6,
    "density_engine": "enabled"
  }
}
```

---

## KNOWLEDGE DENSITY ENGINE

### Purpose
Measure thread RICHNESS without judging value.

### Density Formula

```
density = normalize(
    facts_weight * fact_count +
    ctx_weight * context_links +
    sphere_weight * spheres +
    time_weight * temporal_span +
    artifact_weight * artifacts
)
```

### Density Output

```json
{
  "density_result": {
    "thread_id": "uuid",
    "density": 0.72,
    "components": {
      "facts": 0.85,
      "context": 0.68,
      "spheres": 0.50,
      "temporal": 0.90,
      "artifacts": 0.67
    }
  }
}
```

### Additional Agents

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | Build fact/context threads |
| `AGENT_THREAD_VIEWER` | Render UI |
| `AGENT_DENSITY_ENGINE` | Compute density |

---

## ADDITIONAL THREAD TYPES (from ExportEngine v1.0)

### Decision Thread
Track how a decision emerged over time.

```json
{
  "decision_thread": {
    "id": "uuid",
    "topic": "string",
    "sphere": "business|scholar|xr",
    "nodes": [
      { "type": "meeting|artifact|decision|silence", "ref_id": "uuid", "timestamp": 1712345678 }
    ],
    "status": "open|paused|closed",
    "hash": "sha256"
  }
}
```

### Knowledge Build Thread
Track evolution of understanding on a subject.

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "subject": "string",
    "sphere": "scholar|creative|institution",
    "nodes": [
      { "type": "document|session|agent_input|revision", "ref_id": "uuid", "timestamp": 1712345678 }
    ],
    "versioning": true,
    "hash": "sha256"
  }
}
```

---

## THREAD EXPORT ENGINE

### Export Formats
- PDF (human-readable)
- JSON (machine-readable)
- XR Thread Replay (spatial)

### Export Model

```json
{
  "thread_export": {
    "threads": ["thread_id_1","thread_id_2"],
    "format": "pdf|json|xr",
    "anonymized": true,
    "scope": "personal|team|public",
    "generated_at": 1712345678,
    "hash": "sha256"
  }
}
```

### Export Agents

| Agent | Role |
|-------|------|
| `AGENT_THREAD_VALIDATOR` | Verify integrity |
| `AGENT_THREAD_EXPORTER` | Generate bundles |

### Key Principle
> **"Silence preserved as data"**

---

## THREAD ENGINE MODES (from FullSystem v1.0)

| Mode | Action |
|------|--------|
| `BUILD` | Create new thread from replay/memory |
| `EXTEND` | Add nodes to existing threads |
| `RECONCILE` | Detect duplicates & merge safely |
| `INSPECT` | Show structure (chronological/sphere) |
| `EXPORT` | PDF, graph bundle, XR visualization |

### Node Validation (5 rules)
1. Has timestamp
2. Has concrete source
3. Has explicit sphere
4. No causal meaning implied
5. Respects user visibility

---

## NAVIGATION MODES (from FullSystem v1.0)

| Mode | Description |
|------|-------------|
| `FOLLOW_THREAD` | Sequential traversal |
| `THREAD_CLUSTER_VIEW` | Group by topic/sphere |
| `THREAD_DIFF` | Compare 2 threads (no judgment) |
| `THREAD_TIMELINE` | Visual progression |
| `XR_THREAD_PATH` | Immersive path (comfort guaranteed) |

### Navigation JSON

```json
{
  "thread_nav": {
    "thread_id": "uuid",
    "mode": "follow|cluster|diff|timeline|xr",
    "filters": { "sphere": null, "type": null, "date_range": null },
    "user_overrides": true
  }
}
```

---

## FREEZE STATE

### FROZEN
- definitions, JSON models, safety rules
- non-manipulative constraints, audit guarantees

### NOT FROZEN
- UI variations, speed optimizations, visual effects

---

## PENDING UPGRADES (8)

1. Thread Summaries (no interpretation creep)
2. Thread ↔ Universe View fusion
3. Thread conflict visualizer
4. Thread Privacy Classifications
5. Thread Import/Export Standard
6. Thread Editor UI
7. XR Multi-Thread Walkthrough
8. Agent Thread Participation Index

---

## THREAD VISUALIZATION STYLES (from OfficialPDF v1.0)

| Thread Type | Visual Style |
|-------------|--------------|
| Factual | solid line |
| Decision | branched line |
| Context | dotted line |

---

## OFFICIAL PDF BUILD PLAN

### 8 Sections
1. Vision & Principles
2. Core Architecture (Trunk)
3. Spheres Overview
4. Agents & Orchestration
5. XR & Universe View
6. Knowledge Threads
7. Ethics & Safeguards
8. What Che-Nu Enables (without HOW)

### Rules
- Diagrams > text
- Descriptive, not instructional
- No proprietary algorithms
- No implementation details

---

## COMPLETE FREEZE STATUS

| Component | Status |
|-----------|--------|
| Knowledge Threads | ❄️ FROZEN |
| Collective Memory | ❄️ FROZEN |
| Universe Routing | ❄️ FROZEN |
| XR Replay | ❄️ FROZEN |

---

## FORMAL NOMENCLATURE: KT-1 / KT-2 / KT-3

### Thread Codes

| Code | Name | Ensures |
|------|------|---------|
| **KT-1** | FACT THREAD | ACCURACY |
| **KT-2** | DECISION THREAD | RESPONSIBILITY |
| **KT-3** | CONTEXT THREAD | UNDERSTANDING |

### Interconnection Rules

```
KT-3 (Context) annotates → KT-1 and KT-2
KT-2 (Decision) references → KT-1 (Facts)
```

- ✅ KT-2 MAY reference KT-1
- ✅ KT-3 MAY annotate KT-1 or KT-2
- ❌ NO thread rewrites another
- ❌ NO thread infers causality

### Visual Styles

| Thread | Visual |
|--------|--------|
| KT-1 | solid lines |
| KT-2 | directional lines |
| KT-3 | soft temporal halos |

### Additional Agents

| Agent | Role |
|-------|------|
| `AGENT_THREAD_EXTRACTOR` | Extract facts/decisions/context |
| `AGENT_THREAD_VISUALIZER` | Render for UI/XR |

---

## SPHERE INTERIOR INTERFACE (from SphereInterface v1.0)

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  TOP BAR: [Sphere] [Thread Toggle] [Focus Mode]         │
├────────────┬─────────────────────┬──────────────────────┤
│  LEFT      │  CENTER             │  RIGHT               │
│  Content   │  Active Space       │  Context & Threads   │
│  docs/     │  meeting/editor     │  related threads     │
│  boards    │  workspace          │  cross-sphere links  │
└────────────┴─────────────────────┴──────────────────────┘
```

### Thread Overlay Layer
- Threads visible as soft lines
- Color by thread type
- Opacity by relevance

### Interaction Modes

| Action | Result |
|--------|--------|
| hover | preview connection |
| click | open node |
| long-press | isolate thread |
| pin | keep visible |

### Rules
- ❌ NO AUTO-OPEN
- ❌ NO DISTRACTION

### Additional Agents

| Agent | Role |
|-------|------|
| `AGENT_THREAD_DETECTOR` | Detect connections |
| `AGENT_THREAD_MAPPER` | Build graph links |

> **"Knowledge stays navigable, not weaponized."**

---

## SILENCE THREAD (from SilenceThread v1.6) ⚡ UNIQUE

### Definition
> **Silence is data, not absence of data.**

### Purpose
Represent **absence of action or discussion** as an explicit, visible element.

### Connects
- gaps
- pauses
- skipped decisions
- unresolved items

### Properties
- generated automatically
- non-judgmental
- **visible only on demand** (opt-in)

### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "type": "silence",
    "start": 1712300000,
    "end": 1712340000,
    "linked_to": "decision_id",
    "visibility": "opt-in"
  }
}
```

### Use Cases
- Risk awareness
- Missed reviews
- Deferred decisions

---

## THREAD VISUALIZATION STYLES (3)

| Style | Dimension | Use |
|-------|-----------|-----|
| LINEAR | 2D | PDF exports, audits |
| GRAPH | 2.5D | Universe View |
| SPATIAL | XR | Meetings, replays |

### XR Safety Rules
- No flashing
- No motion forcing
- Zoom-only interaction
- Instant hide option

---

## TRIPLE SYSTEM CLASSIFICATION (from TripleSystem v1.0)

### 3 Thread Layers

| Layer | Connects | Visibility | Editable |
|-------|----------|------------|----------|
| **INTER-SPHERE** | System knowledge across spheres | Universe graph | ❌ Immutable |
| **PERSONAL** | Personal understanding | Private | ✅ Editable |
| **COLLECTIVE** | Shared truth from Memory | Public | ❌ Verified only |

### Inter-Sphere Thread

```json
{
  "inter_sphere_thread": {
    "id": "uuid",
    "origin_sphere": "scholar",
    "target_sphere": "business",
    "links": [
      { "source_artifact": "uuid", "destination_artifact": "uuid", "reason": "identical_topic" }
    ],
    "integrity_hash": "sha256"
  }
}
```

### Personal Thread

```json
{
  "personal_thread": {
    "id": "uuid",
    "owner": "user_id",
    "nodes": [{ "type": "note|replay|decision", "ref": "uuid" }],
    "tags": ["custom-tag"],
    "visibility": "private|shared"
  }
}
```

### Collective Thread

```json
{
  "collective_thread": {
    "id": "uuid",
    "source_memory_id": "uuid",
    "target_memory_id": "uuid",
    "relationship": "followed_by|referenced_by|expanded_by|supported_by",
    "verified": true
  }
}
```

### Visual Styles

| Type | Visual |
|------|--------|
| Inter-Sphere | wide arc lines |
| Personal | dotted path |
| Collective | stable thin line |

---

## RENDERING SPECIFICATIONS (from RenderingRules v1.0)

### Thread Rendering Styles

| Thread Type | Layout | Color | Special |
|-------------|--------|-------|---------|
| Fact | linear timeline | neutral | no emphasis gradients |
| Decision | vertical markers | neutral | no success/failure labels |
| Context | background layer | low dominance | toggleable overlay |

### Default Visibility

| Thread Type | Default |
|-------------|---------|
| Fact | shared (if permitted) |
| Decision | permission-scoped |
| Context | private |

### Context Thread JSON (with silence_intervals)

```json
{
  "context_thread": {
    "context": {
      "sphere": "string",
      "meeting_type": "live|review|replay",
      "constraints": ["time","policy","access"],
      "silence_intervals": ["t1-t2"]
    }
  }
}
```

### Additional Agent

| Agent | Role |
|-------|------|
| `AGENT_THREAD_NAVIGATOR` | Locate threads, no prioritization |

---

## INTRA-SPHERE + TIMELINE THREADS (from IntraTimeline v1.0)

### Thread Spatial Classification

| Type | Scope | Visual |
|------|-------|--------|
| **INTRA-SPHERE** | Within one sphere | thin, sphere-colored |
| **INTER-SPHERE** | Between spheres | dual-color braided |
| **CROSS-TIMELINE** | Long time spans | dotted arc, glow points |

### Intra-Sphere JSON

```json
{
  "kt_intra": {
    "sphere": "business",
    "nodes": ["id1","id2","id3"],
    "relation": "topic|artifact|decision|sequence",
    "strength": 0.0-1.0,
    "immutable": true
  }
}
```

### Cross-Timeline (Historic) JSON

```json
{
  "kt_timeline": {
    "thread_id": "uuid",
    "segments": [
      { "node": "id1", "t": 1700000000 },
      { "node": "id2", "t": 1710000000 }
    ],
    "duration_days": 365,
    "verified": true
  }
}
```

### Export Formats

| Format | Use |
|--------|-----|
| `.ktpack` | Internal bundle |
| `JSON` | Machine-readable |
| `PDF` | Human summary |

### Additional Agent

| Agent | Role |
|-------|------|
| `AGENT_THREAD_AUDITOR` | Verify source integrity |

> **"Atlas of Connections"** - users explore freely

---

## CONFIDENCE + RELATION TYPES (from ConfidenceRelations v1.0)

### Inter-Sphere with Confidence

```json
{
  "inter_sphere_thread": {
    "spheres": ["business","scholar","xr"],
    "links": [
      {
        "from": "entry_id",
        "to": "entry_id",
        "relation": "references|follows|influenced_by",
        "confidence": 0.85
      }
    ]
  }
}
```

### Relation Types

| Relation | Meaning |
|----------|---------|
| `references` | Direct citation/link |
| `follows` | Temporal sequence |
| `influenced_by` | Structural connection (NOT causal) |

### Confidence Score
- Range: 0.0 - 1.0
- Based on: hash matches, temporal proximity, shared participants
- **NOT a quality judgment**

### Key Principle
> **"Intelligence without power"**

---

## INTER-THREAD LINKING RULES (from InterThreadLinking v1.6)

### Allowed Links

```
     CONTEXT_THREAD
        ↕      ↕
    FACT ←→ DECISION
```

| Link | Status |
|------|--------|
| fact ↔ decision | ✅ |
| context ↔ fact | ✅ |
| context ↔ decision | ✅ |

### Forbidden
- ❌ Thread ranking
- ❌ Merging without approval
- ❌ Hidden links

### Luminous Paths Visualization

| Thread Type | Visual |
|-------------|--------|
| Fact | solid luminous |
| Decision | bold luminous |
| Context | soft glow |

### Example Flows

**Fact:** `Document A → Chart B → Replay Frame C → Note D`

**Decision:** `Meeting A → Debate → Decision X → Review Meeting B`

**Context:** `Business Sphere → XR Analysis Room → 5 Participants → Q3 Phase`

---

## EXPLORATION THREADS (from ExplorationThread v1.0) ⚡ UNIQUE

### Purpose
Allow humans to explore links **WITHOUT asserting correctness.**

### Sources
- user-created links
- bookmarks
- questions
- hypotheses
- notes

### Key Rules
- ✅ personal by default
- ✅ optional sharing
- ✅ **NEVER merged into FACT threads**
- ✅ visibly marked as subjective

### JSON Model

```json
{
  "knowledge_thread": {
    "type": "exploration",
    "owner": "user_id",
    "visibility": "private|shared",
    "links": [
      {
        "from": "entity_id",
        "to": "entity_id",
        "note": "user_annotation"
      }
    ]
  }
}
```

### Triple-Layer Visual

| Thread | Visual | Provides |
|--------|--------|----------|
| Fact | solid line | Truth |
| Context | dashed line | Perspective |
| **Exploration** | **dotted line** | **Freedom** |

### Key Principle
> **"Knowledge without collapse"**
> Separation of fact and meaning enforced.

---

## CANONICAL CORE MODEL (from CanonicalModel v1.0)

### Unified JSON Structure

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "personal|collective|intersphere",
    "origin": {
      "source": "meeting|replay|artifact|decision",
      "id": "uuid",
      "timestamp": 1712345678
    },
    "nodes": [
      {
        "node_id": "uuid",
        "node_type": "event|artifact|decision|context",
        "sphere": "business|scholar|xr",
        "hash": "sha256"
      }
    ],
    "links": [
      {
        "from": "node_id",
        "to": "node_id",
        "relation": "refers_to|extends|follows|duplicates",
        "confidence": 0.85
      }
    ],
    "visibility": "private|shared|public",
    "immutability": true,
    "validated": true
  }
}
```

### Link Relations

| Relation | Meaning |
|----------|---------|
| `refers_to` | Direct reference |
| `extends` | Builds upon |
| `follows` | Temporal sequence |
| `duplicates` | Same content, different context |

---

## THREAD OPERATIONS

### Allowed
`create_thread` | `append_node` | `link_node` | `branch_thread` | `export_thread` | `visualize_thread`

### Forbidden
`auto-summarize` | `auto-rank` | `emotional_labeling` | `recommendation_injection`

---

## 4 VISUALIZATION MODES

| Mode | Description |
|------|-------------|
| LINEAR | chronological chain |
| GRAPH | node + relations |
| ORBITAL | thread around sphere centers |
| XR THREAD WALK | spatial traversal |

---

## TEMPORAL THREAD (from TemporalThread v1.0) ⚡ UNIQUE

### Purpose
Track **SEQUENCES and BRANCHES** over time.

### What it connects
- events in order
- **pauses** (gaps/silence)
- **divergences** (split points)
- **parallel paths** (concurrent timelines)

### JSON Model

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "temporal",
    "timeline": [
      { "t": 0, "event": "uuid" },
      { "t": 120, "event": "uuid" }
    ],
    "branches": [
      { "from": "event_id", "to": "event_id" }
    ],
    "verified": true
  }
}
```

### Rules
- ❌ no "better/worse"
- ❌ no scoring
- ❌ no summary

### Key Insight
> **"context ≠ explanation"**  
> **"context ≠ motive"**

### XR Visualization
- soft filaments
- depth = time
- thickness = reference count (NOT importance)

---

## THREAD INTERACTION HIERARCHY (from InteractionHierarchy v1.0)

### Hierarchy Diagram

```
EXPLORATION (personal) ─── NEVER alters ───→ 
    CONTEXT (descriptive) ─── MUST reference ───→ 
        FACT (immutable) = BASE TRUTH
```

### Interaction Rules

| Rule | Status |
|------|--------|
| Fact CAN be referenced by others | ✅ |
| Context MUST reference Fact | ✅ |
| Exploration NEVER alters Fact/Context | ✅ |
| No automatic promotion | ✅ |

### New JSON Properties

**Fact Thread:**
```json
{ "created_from": "xr_replay" }
```

**Exploration Thread:**
```json
{ "exportable": true }
```

### Universe View Default
> **"Never default-visible"** - User must toggle

### Key Principle
| Thread | Protects |
|--------|----------|
| Fact | TRUTH |
| Context | MEANING |
| Exploration | FREEDOM |

---

## COMPLETE THREAD SUB-TYPES (from CompleteSafety v1.0)

### INTRA-SPHERE Types
| Type | Description |
|------|-------------|
| `INTRA_REFERENCE` | Artifacts citing each other |
| `INTRA_SEQUENCE` | Workflow steps |
| `INTRA_DEPENDENCY` | Required-before/after |
| `INTRA_CLUSTER` | Logical grouping |

### INTER-SPHERE Types
| Type | Description |
|------|-------------|
| `CROSS_REFERENCE` | Explicit cross-sphere |
| `CROSS_TOPIC` | Shared labels |
| `CROSS_AGENT` | Same agent, multiple spheres |
| `CROSS_SILENCE` | Simultaneous inactivity |

### TEMPORAL Types
| Type | Description |
|------|-------------|
| `TEMPORAL_CHAIN` | Chronological |
| `TEMPORAL_BRANCH` | Divergence points |
| `TEMPORAL_BRAID` | Parallel events |
| `TEMPORAL_RECONVERGENCE` | Paths realign |

---

## 5 SAFETY RULES

| # | Rule |
|---|------|
| 01 | NO INTERPRETATION |
| 02 | COMPLETE TRANSPARENCY |
| 03 | USER CONTROL |
| 04 | IMMUTABILITY |
| 05 | REPLAY-ANCHORED TRUTH |

---

## 4 RENDERING MODES

| Mode | Description |
|------|-------------|
| MAP | Nodes in clusters |
| THREADLINE | Linear timeline |
| BRAIDVIEW | Parallel visualization |
| XR THREADROOM | Walkable in XR |

---

## STORAGE BUNDLE

```json
{
  "knowledge_threads_bundle": {
    "intra": [],
    "inter": [],
    "temporal": [],
    "version": 1,
    "hash": "sha256"
  }
}
```

---

## THREAD GRAPH STRUCTURE (from GraphStructure v1.0)

### Edge Types

| Edge | Description |
|------|-------------|
| `referenced_by` | Direct citation |
| `followed_by` | Temporal sequence |
| `occurred_under` | Context relationship |
| `shared_with` | Cross-entity sharing |

### Decision Action States

| Action | Description |
|--------|-------------|
| `proposed` | Initial |
| `modified` | Changed |
| `approved` | Finalized |
| `deferred` | Postponed |

### Silence Windows (Context Thread)

```json
{
  "silence_windows": [
    { "start": 12.3, "end": 18.9 }
  ]
}
```

### Integration Points

| System | Integration |
|--------|-------------|
| Universe View | overlays |
| XR Replay | timeline-linked |
| Collective Memory | attach entries |
| Navigation Profiles | visibility per user |

### Key Principle
> **"One reality. Many threads. No manipulation."**

---

## DECISION PATH THREAD (from DecisionPath v1.0) ⚡

### Purpose
Track **SEQUENCES of decisions** with branching support.

### JSON Model (with predecessor)

```json
{
  "decision_thread": {
    "id": "uuid",
    "path": [
      {
        "decision_id": "uuid",
        "previous": "uuid|null",
        "timestamp": 1712345678
      }
    ],
    "branching": true
  }
}
```

### Decision Path Visualization

```
Decision A (root)
    ├──→ Decision B → Decision D
    └──→ Decision C → Decision E (branch)
```

### Interconnection Rules

| From | To | Rule |
|------|----|------|
| Fact | Context | MAY link |
| Decision | Fact | MUST reference |
| Context | Facts | NEVER alter |

> **"No circular authority allowed"**

---

## COLLECTIVE MEMORY INTEGRATION (from CollectiveMemoryNav v1.5)

### Memory Object Types

| Type | Content |
|------|---------|
| `MEMORY_EVENT` | who/when/where, action |
| `MEMORY_ARTIFACT` | document/visual/data |
| `MEMORY_DECISION` | declared outcome |
| `MEMORY_CONTEXT` | meeting type, sphere |

### Collective Memory JSON

```json
{
  "collective_memory": {
    "entries": [
      {
        "id": "uuid",
        "type": "event|artifact|decision|context",
        "source_replay": "uuid",
        "participants": ["user_id","agent_id"],
        "hash": "sha256"
      }
    ],
    "integrity": "verified"
  }
}
```

---

## PERSONAL NAVIGATION PROFILES

### 4 Profile Modes

| Mode | Focus |
|------|-------|
| EXPLORER | Wide view, many links |
| FOCUS | Active threads only |
| REVIEW | Replay-first |
| ARCHIVE | History dominant |

### Profile JSON

```json
{
  "navigation_profile": {
    "mode": "explorer|focus|review|archive",
    "preferences": {
      "density": 0.4,
      "visual_mode": "2d|3d",
      "agent_visibility": "low|medium|high"
    }
  }
}
```

### Key Principle
> **"Profile affects VISUALIZATION ONLY, NEVER changes data"**

---

## VISUALIZATION STYLES BY THREAD TYPE (from VisualizationStyles v1.0)

| Thread | Line | Color | Special |
|--------|------|-------|---------|
| Factual | straight | neutral | time-scaled |
| Context | dashed | soft halo | collapsible |
| Exploration | curved | user-selected | interactive |

### Feed-Back Prohibition

```
EXPLORATION ──X──→ FACTUAL (never)
EXPLORATION ──X──→ CONTEXT (never)
```

### AGENT_THREAD_INDEXER ⚡
> **"Detects possible continuities, does NOT create threads"**
- Passive detection only
- Suggestions require human approval

### Key Principle
> **"Factual thread always primary"**

---

## COLOR CODING SCHEME (from ColorCoding v1.0)

| Thread | Color | Style |
|--------|-------|-------|
| Factual | white | solid |
| Decision | blue | solid |
| Context | grey | dotted |

### sphere_scope (Multi-Sphere)

```json
{ "sphere_scope": ["business","scholar"] }
```

### Tombstone Deletion ⚡

```json
{
  "deleted": true,
  "tombstone": "2024-04-06T12:00:00Z"
}
```

> Threads are NEVER truly deleted - only marked with tombstone.

### Decision Action States (Complete)

| Action | Description |
|--------|-------------|
| proposed | Initial |
| reviewed | Under review |
| declared | Final |
| modified | Changed |
| approved | Confirmed |
| deferred | Postponed |

---

## DOCUMENT SUMMARY

| Metric | Value |
|--------|-------|
| **Total Source Documents** | 31 |
| **Thread Types Documented** | 15+ |
| **Safety Rules** | 5 |
| **Rendering Modes** | 4 |
| **Navigation Profiles** | 4 |
| **Specialized Agents** | 7 |
| **Version** | MASTER v1.0 |
| **Status** | FREEZE-READY |

---

## CORE PRINCIPLES (SUMMARY)

1. **Threads CONNECT information** - They NEVER interpret, judge, or conclude
2. **Append-only, hash-verified, immutable** - No rewriting history
3. **Human interprets meaning** - AI provides structure, not conclusions
4. **No epistemic pressure** - No forced synthesis, no invisible abstraction
5. **Tombstone deletion only** - Nothing truly deleted

---

**END — CHE·NU KNOWLEDGE THREADS MASTER REFERENCE**
**VERSION:** MASTER v1.0
**STATUS:** FOUNDATION FREEZE COMPLETE

---

## EVOLUTION THREAD (from EvolutionThread v1.0) ⚡ UNIQUE

### Purpose
Track how knowledge **STRUCTURE evolves** over time.

### Evolution Event Types

| Event | Description |
|-------|-------------|
| `branch` | Path splits |
| `merge` | Paths combine |
| `pause` | Path suspended |
| `resume` | Path reactivated |

### JSON Model

```json
{
  "evolution_thread": {
    "id": "uuid",
    "timeline": [
      {
        "event": "branch|merge|pause|resume",
        "source": "fact_thread_id",
        "timestamp": 1712345678
      }
    ]
  }
}
```

### Key Rule
> **Evolution = CHANGE IN STRUCTURE**  
> NOT correctness, NOT success.

### Inter-Thread Relationship

| Thread | Answers |
|--------|---------|
| FACT | WHAT happened |
| CONTEXT | UNDER WHAT CONDITIONS |
| EVOLUTION | HOW STRUCTURE changed |

---

## UNIVERSAL NODE/EDGE MODEL (from UniversalModel v1.0)

### THREAD_NODE

```json
{
  "id": "uuid",
  "type": "event|artifact|decision|memory",
  "sphere": "string",
  "timestamp": 1712345678,
  "source_replay": "uuid",
  "hash": "sha256"
}
```

### THREAD_EDGE

```json
{
  "from": "node_id",
  "to": "node_id",
  "relation_type": "sequential|reference|dependency|parallel",
  "strength": 0.85,
  "source_type": "replay|artifact|manual"
}
```

---

## RELATIONS BY THREAD TYPE

### INTRA-SPHERE
`references` | `continues` | `contains` | `expands_on` | `resolves`

### INTER-SPHERE
`reused_by` | `derived_from` | `contextualizes` | `required_for`

### TEMPORAL
`earlier_than` | `later_than` | `supersedes` | `reappears` | `cycles`

---

## 9 SAFETY RULES (COMPLETE)

1. No sentiment/emotional classification
2. No ranking/scoring
3. No intent extraction
4. No predictive modeling
5. No persuasive pathing
6. Explainable node-by-node
7. "Visibility mask" indicator required
8. Private nodes NEVER propagate
9. Cross-sphere requires opt-in

---

## EXPORT FORMATS

| Format | Description |
|--------|-------------|
| `.thread.json` | Full fidelity |
| `.thread.map` | Visual layer |
| `.thread.xrpack` | XR spatial |
| `.thread.pdf` | Static |

---

## AGENT_THREAD_AUDITOR ⚡

> Checks forbidden patterns, **verifies no interpretation**

---

## AGENT_THREAD_NAVIGATOR (from NavigatorAgent v1.0) ⚡ NEW

> **"Helps user explore threads, suggestion-only"**
- Passive navigation assistance
- No forced paths
- User controls exploration

---

## ADDITIONAL EDGE TYPES

| Edge | Description |
|------|-------------|
| `resulted_in` | Outcome link |
| `occurred_with` | Concurrent events |

### Edge Properties
- ✅ **bidirectional**
- ✅ timestamped
- ✅ visible on demand

---

## DECISION THREAD (with inputs)

```json
{
  "decision_thread": {
    "inputs": ["fact_thread_id"],
    "decision": "text"
  }
}
```

> Links decisions explicitly to their fact sources.

---

## ADDITIONAL SAFETY RULE

> **"No hidden clustering"** - All groupings must be transparent and user-visible.

---

**END — CHE·NU KNOWLEDGE THREADS MASTER REFERENCE**
**VERSION:** MASTER v1.0 | **FICHIERS:** 34 | **STATUS:** FOUNDATION FREEZE COMPLETE

---

## CONTRIBUTION THREAD (from ContributionThread v1.0) ⚡ UNIQUE

### Purpose
Show **WHO contributed WHAT and WHEN** without measuring influence.

### JSON Model

```json
{
  "thread": {
    "type": "contribution",
    "participants": ["user_id","agent_id"],
    "actions": [
      { "actor": "id", "action": "create|reference", "timestamp": t }
    ]
  }
}
```

### Action Types
| Action | Description |
|--------|-------------|
| `create` | Created new |
| `reference` | Referenced |
| `annotate` | Added note |
| `modify` | Changed |

### Visualization
- **Parallel lanes per participant**
- No ranking, no weight, neutral glyphs

---

## AGENT_THREAD_DETECTOR ⚡ NEW

> **"Detects factual links, no interpretation"**
- Auto-detects by reference & reuse
- Passive detection only

---

## THREAD TRIAD

| Thread | Shows |
|--------|-------|
| Temporal | WHEN |
| Contextual | WHERE |
| **Contribution** | **WHO** |

---

## VALIDATION OBJECT (from ValidationRenderer v1.0)

```json
{
  "validation": {
    "status": "verified|pending|rejected",
    "validator": "agent_id",
    "timestamp": 1712349999
  }
}
```

> Required for Collective Threads before immutability.

---

## REFERENCE_MAP (Inter-Sphere)

```json
{
  "reference_map": [
    {
      "from_entry": "entry_id",
      "to_entry": "entry_id",
      "relation": "influenced|referenced|continued"
    }
  ]
}
```

### Relations
| Relation | Description |
|----------|-------------|
| `influenced` | Affected outcome |
| `referenced` | Cited |
| `continued` | Extended |

---

## AGENT_THREAD_RENDERER ⚡ NEW

> **"Visualizes threads, no semantic influence"**
- Pure rendering, no filtering authority

---

## LINE VISUALIZATION

> **"Appears as a LINE, not a graph"**
- Time-ordered
- No branching unless explicit
- Silence periods visible

---

## EVOLUTION THREAD ENHANCED (from EvolutionVersions v1.0)

### JSON Model (with versions + branching)

```json
{
  "evolution_thread": {
    "subject": "decision|document|config|avatar",
    "versions": [
      { "ref": "id_v1", "timestamp": 1700000000 },
      { "ref": "id_v2", "timestamp": 1800000000 }
    ],
    "branching": true
  }
}
```

### Subject Types
| Subject | Description |
|---------|-------------|
| `decision` | Decision evolution |
| `document` | Document revisions |
| `config` | System configuration |
| `avatar` | Avatar state changes |

---

## FACT THREAD (with created_from)

```json
{
  "created_from": "collective_memory",
  "integrity": "verified"
}
```

---

## 5 VISUALIZATION MODES

| Mode | Description |
|------|-------------|
| inline highlights | subtle |
| expandable thread panel | detailed |
| XR floating thread lines | spatial |
| timeline ribbon | temporal |
| comparative overlay | read-only |

---

## ADDITIONAL SAFETY

> **"full opt-out per user"** - User can disable all thread tracking

---

## TOPIC THREAD (from TopicThread v1.0) ⚡ UNIQUE

### Purpose
Track how a **topic evolves** across contexts.

### JSON Model

```json
{
  "topic_thread": {
    "topic": "string",
    "linked_nodes": [
      { "type": "meeting|artifact|decision", "id": "uuid", "timestamp": t }
    ],
    "first_seen": 1710000000,
    "last_seen": 1712345678
  }
}
```

### Unique Fields
| Field | Description |
|-------|-------------|
| `first_seen` | First appearance |
| `last_seen` | Most recent |

---

## CONTEXT THREAD TIMELINE EVENTS ⚡

```json
{
  "timeline": [
    { "event": "enter_meeting", "timestamp": t },
    { "event": "silence_interval", "duration": 180 },
    { "event": "decision_logged", "timestamp": t }
  ]
}
```

| Event | Description |
|-------|-------------|
| `enter_meeting` | Joined |
| `silence_interval` | Gap (duration) |
| `decision_logged` | Decision |
| `artifact_created` | New artifact |
| `exit_meeting` | Left |

---

## VISUALIZATION: TIME DENSITY GRADIENTS ⚡

> Context Thread rendered as **background layers with time density gradients**

---

## THREAD TRIAD (COMPLETE)

| Thread | Shows |
|--------|-------|
| **Topic** | WHAT persists |
| **Decision** | WHEN choices diverge |
| **Context** | WHY it happened there |

---

## CAUSAL KNOWLEDGE THREAD (from CausalThread v1.0) ⚡ UNIQUE

### Critical Rule
> **Causality must be DECLARED, never inferred by the system.**

### JSON Model

```json
{
  "knowledge_thread": {
    "type": "causal",
    "cause": {
      "ref_id": "decision|event",
      "declared_by": "user|agent",
      "timestamp": t
    },
    "effect": {
      "ref_id": "decision|artifact",
      "timestamp": t
    },
    "confidence": "declared"
  }
}
```

### Key Fields
| Field | Description |
|-------|-------------|
| `declared_by` | WHO declared causality |
| `confidence` | ALWAYS "declared" |

### Visualization
- Arrow links
- NO probability
- NO optimization hints

---

## THREAD STATUS TYPES

| Status | Description |
|--------|-------------|
| `open` | Active |
| `paused` | Temporarily inactive |
| `closed` | Completed |

---

## VISIBILITY LEVELS

| Level | Description |
|-------|-------------|
| `user` | Private |
| `team` | Shared team |
| `collective` | Org-wide |

---

## ADDITIONAL BENEFITS

- **wisdom accumulation**
- **responsibility tracking**
- **reversible visualization**

---

## CONTEXT THREAD SEGMENTS (from SegmentsDensity v1.0) ⚡

### JSON Model

```json
{
  "segments": [
    {
      "start": 1712340000,
      "end": 1712343600,
      "mode": "explore|focus|review",
      "sphere": "string",
      "active_agents": ["agent_id"],
      "density": 0.6
    }
  ]
}
```

### Mode Types
| Mode | Description |
|------|-------------|
| `explore` | Open-ended |
| `focus` | Concentrated |
| `review` | Validating |

### Density
> 0.0–1.0 information density metric

---

## DECISION THREAD ALTERNATIVES ⚡

```json
{
  "alternatives": ["option_A", "option_B", "option_C"]
}
```

> Array of alternatives that were considered before decision.

---

## NEW EDGE TYPES

| Edge | Description |
|------|-------------|
| `occurred_within` | Inside context |
| `shared_context` | Same context |
| `surrounds` | Context wraps thread |

---

## ETHICAL LOCKS ⚡

### ❌ FORBIDDEN
- narrative shaping
- optimization bias
- emotional framing
- ranking threads

### ✅ REQUIRED
- transparency
- auditability
- reversibility

---

## DECISION STATES (from StateOperations v1.0) ⚡

| State | Description |
|-------|-------------|
| `proposed` | Initial proposal |
| `confirmed` | Approved |
| `modified` | Changed |
| `paused` | Deferred |

```json
{
  "timeline": [
    { "state": "proposed|confirmed|modified|paused", "timestamp": t }
  ]
}
```

---

## CONTEXT SIGNALS ⚡

```json
{
  "context_signals": [
    { "source": "meeting|agent|sphere", "label": "string", "timestamp": t }
  ]
}
```

> `label` provides human-readable context.

---

## THREAD OPERATIONS ⚡

### ✅ Allowed
| Operation | Description |
|-----------|-------------|
| view | Read |
| follow | Track |
| filter | Narrow |
| export | PDF/JSON |
| overlay | Universe view |

### ❌ Disallowed
- auto-merge
- auto-prioritize
- auto-hide

---

## SYSTEM GUARANTEES ⚡

| Guarantee | Description |
|-----------|-------------|
| One reality | Single source of truth |
| Multiple views | Different perspectives |
| Total traceability | Full audit |
| Zero manipulation | No hidden influence |

---

## DECISION THREAD ENHANCED (from ViewModes v1.0) ⚡

```json
{
  "objective": "string",
  "branch_points": ["uuid"]
}
```

| Field | Description |
|-------|-------------|
| `objective` | What decision aimed to achieve |
| `branch_points` | Where decisions diverged |

---

## CONTEXT STATE ⚡

```json
{
  "context_state": {
    "goal": "string",
    "constraints": ["string"],
    "participants": ["id"]
  }
}
```

> Preserves declared goals and constraints at decision time.

---

## 3 VIEW MODES ⚡

| Mode | Description |
|------|-------------|
| LINEAR | Chronological list |
| GRAPH | Nodes + branch splits |
| TIMELINE BRAID | Side-by-side alignment |

---

## THREAD INTERACTIONS ⚡

- jump to source meeting
- open replay at timestamp
- compare branches (read-only)

---

## FILTERS

| Filter | Options |
|--------|---------|
| sphere | business, scholar, xr |
| agent | specific |
| user | specific |
| time range | start/end |
| thread type | fact/decision/context |

---

## NEW AGENTS ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_EXTRACTOR` | Detects refs, tags origins |
| `AGENT_THREAD_LINKER` | Proposes links, needs approval |

---

## COLLECTIVE INTELLIGENCE THREADS (from CollectiveUI v1.0) ⚡ UNIQUE

### Purpose
Map how the collective approaches problems — **WITHOUT influence.**

### JSON Model

```json
{
  "collective_thread": {
    "cluster_id": "uuid",
    "events": [],
    "patterns": [],
    "visibility": "team|org|public"
  }
}
```

---

## 4 VIEW MODES ⚡

| Mode | Description |
|------|-------------|
| FLOW | Horizontal timeline |
| ORBIT | Sphere clusters |
| STACK | Vertical list |
| XR PATH | Floating nodes |

---

## THREADVIEWER COMPONENT ⚡

```tsx
<ThreadViewer
   type="inter|personal|collective"
   mode="flow|orbit|stack|xr"
   onNodeSelect={() => {}}
/>
```

---

## UI LAYERS (5)

1. TIMELINE STRIP
2. NODE MAP
3. EVENT DETAILS PANEL
4. SPHERE COLOR BANDS
5. PRIVACY BADGES

---

## VISUAL PROPERTIES ⚡

| Property | Meaning |
|----------|---------|
| Opacity | = confidence |
| Thickness | = density |
| Glow | = XR replay |

---

## SAFETY LOCKS ⚡

- "Filtered View" indicator
- Private nodes as ★
- No auto-expansion
- Permanent audit trail

---

## LINK REASONS (from EngineOverlay v1.0) ⚡

### Intra-Sphere
| Reason | Description |
|--------|-------------|
| `same_project` | Same project |
| `same_topic` | Related topic |
| `follow_up` | Continuation |

### Cross-Sphere
| Reason | Description |
|--------|-------------|
| `referenced_in` | Cited |
| `dependent_on` | Requires |
| `reused_in` | Asset reused |

---

## TEMPORAL THREAD ENHANCED ⚡

```json
{
  "change_type": "added|modified|superseded",
  "delta": {},
  "stability_index": 0.85
}
```

### Stability Index
> 0.0–1.0 measuring knowledge stability

---

## ANOMALY DETECTION ⚡

| Anomaly | Description |
|---------|-------------|
| `loop` | Circular reference |
| `orphan_node` | No connections |

---

## 4 OVERLAY MODES ⚡

| Mode | Description |
|------|-------------|
| LINEAR | Straight timeline |
| ORBITAL | Sphere circles |
| BRAIDED | Multi-timeline |
| CROSS-AXIS | Time × Sphere |

---

## NEW AGENTS ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_GATHERER` | Collects nodes |
| `AGENT_THREAD_WEAVER` | Constructs graph |

---

## EVOLUTION THREAD BRANCHES (from BranchComparison v1.0) ⚡

### JSON Model

```json
{
  "root": "factual_thread_id",
  "branches": [
    {
      "version": "v1.2",
      "change": "added constraint",
      "timestamp": t
    }
  ],
  "comparison_ready": true
}
```

### Fields
| Field | Description |
|-------|-------------|
| `root` | Origin factual thread |
| `version` | Version identifier |
| `change` | What changed |
| `comparison_ready` | Can compare branches |

---

## CONTEXTUAL THREAD ENHANCED ⚡

```json
{
  "linked_factual_thread": "uuid",
  "context": {
    "available_data": ["artifact_id"]
  },
  "status": "descriptive_only"
}
```

---

## AGENT_THREAD_DISCOVERER ⚡ NEW

> **"Detects potential threads, suggestion only"**
- Passive discovery
- No auto-creation

---

## CONFIDENCE SCORE (from ConfidenceSequence v1.0) ⚡

| Value | Meaning |
|-------|---------|
| `1.0` | Fully verified |
| `0.8` | High confidence |
| `0.6` | Medium confidence |
| `< 0.5` | Needs review |

```json
{
  "confidence": 0.85
}
```

---

## EVOLUTION SEQUENCE ⚡

```json
{
  "sequence": [
    { "version": 1, "source": "meeting_a" },
    { "version": 2, "source": "meeting_b" }
  ]
}
```

---

## CONTEXTUAL TIME_RANGE ⚡

```json
{
  "context": {
    "time_range": [1712340000, 1712350000]
  }
}
```

---

## THICKNESS = REFERENCE COUNT ⚡

> Visual thickness represents how many times a thread has been referenced, **NOT importance**.

---

## AGENT-COLLECTIVE THREAD (from AgentCollective v1.0) ⚡ UNIQUE

### Purpose
Expose how agents **CONTRIBUTED, NOT influenced.**

### JSON Model

```json
{
  "type": "agent_collective",
  "agents": [
    {
      "agent_id": "uuid",
      "role": "observer|provider|validator",
      "timestamps": [t1, t2]
    }
  ]
}
```

### Agent Roles ⚡
| Role | Description |
|------|-------------|
| `observer` | Watched only |
| `provider` | Provided data |
| `validator` | Validated content |

### Visualization
- Agent timeline lanes
- Silent intervals visible
- Role glyphs only

---

## THREAD CREATION MODES ⚡

| Mode | Description |
|------|-------------|
| manual | User creates |
| meeting-derived | From meeting |
| replay-derived | From XR |
| agent-suggested | Opt-in only |

---

## THREAD TRIGGERS (from TriggersEvidence v1.0) ⚡

| Trigger | Description |
|---------|-------------|
| Shared topic tags | Same tags |
| Shared artifacts | Same artifact |
| Shared decision points | Same decision |
| Shared agents | Same agent |
| Adjacent sphere categories | Related domains |

---

## PERSONAL NOTES ⚡

```json
{
  "notes": [
    { "t": 1712345678, "text": "my summary", "hash": "sha256" }
  ]
}
```

---

## 4 COLLECTIVE THREAD TYPES ⚡

| Type | Name |
|------|------|
| TYPE_A | Decision Evolution |
| TYPE_B | Multi-team Alignment |
| TYPE_C | Artifact Lineage |
| TYPE_D | Sphere Topic |

---

## EVIDENCE TYPES ⚡

| Evidence | Description |
|----------|-------------|
| `timestamp_match` | Same time |
| `reference_explicit` | Direct citation |
| `participant_overlap` | Same people |
| `artifact_shared` | Same artifact |

```json
{
  "verified_links": [
    { "from": "a", "to": "b", "evidence": "timestamp_match" }
  ]
}
```

---

## CONTEXT TIME_WINDOW (from GovernanceStyles v1.0) ⚡

```json
{
  "time_window": { "start": 1712340000, "end": 1712350000 }
}
```

---

## EVOLUTION ENTITY TYPES ⚡

| Entity | Description |
|--------|-------------|
| `document` | Document versions |
| `plan` | Plan/strategy |
| `avatar` | Avatar states |
| `profile` | Navigation profiles |
| `sphere` | Sphere structure |

---

## THREAD LINE STYLES ⚡

| Thread | Style |
|--------|-------|
| FACT | solid line |
| CONTEXT | dashed line |
| EVOLUTION | layered line |

---

## THREAD GOVERNANCE ⚡

| Rule | Status |
|------|--------|
| Created automatically | ✅ |
| Cannot be edited manually | ✅ |
| Can be hidden per user | ✅ |
| Can be shared explicitly | ✅ |

---

## SEMANTIC DRIFT PREVENTION ⚡

> **AGENT_THREAD_GUARD prevents semantic drift**
- Ensures threads stay factual
- Blocks meaning creep

---

## 3-LAYER ARCHITECTURE (from 3LayerTree v1.0) ⚡ CORE

### Layer 1: LOCAL THREADS (Intra-Sphere)
| Type | Description |
|------|-------------|
| `FACT_THREAD` | Data points |
| `EVENT_THREAD` | Chronological events |
| `ARTIFACT_THREAD` | Files/documents |
| `CONTEXT_THREAD` | Sphere metadata |

### Layer 2: INTER-SPHERE THREADS (Cross-Silo)
| Type | Description |
|------|-------------|
| `USER_THREAD` | User across spheres |
| `AGENT_THREAD` | Agent outputs |
| `GOAL_THREAD` | Shared objectives |
| `REPLAY_THREAD` | XR to decisions |

### Layer 3: UNIVERSAL THREADS (Meta-Trunk)
| Type | Description |
|------|-------------|
| `LAW_THREAD` | Foundational rules |
| `MEMORY_THREAD` | Validated memory |
| `METHODOLOGY_THREAD` | Workflows |
| `EVOLUTION_THREAD` | Global evolution |

---

## DOUBLE-CONSENT ⚡

```json
{
  "permissions": { 
    "user_approved": true, 
    "sphere_guard": true 
  }
}
```

---

## 3 GUARDS ⚡

| Guard | Role |
|-------|------|
| Ethical Guard | Ethics |
| Privacy Guard | Privacy |
| Memory Integrity Guard | Accuracy |

---

## KNOWLEDGE TREE ⚡

> **TRUNK** = Universal (Laws + Memory)  
> **BRANCHES** = Spheres  
> **LEAVES** = Local Threads  
> **BRIDGES** = Inter-Sphere Threads

---

## THREAD OPERATIONS (from Operations v1.0) ⚡

### ✅ Allowed
| Operation | Description |
|-----------|-------------|
| `add_entry` | Add entry |
| `pause_thread` | Pause |
| `resume_thread` | Resume |
| `split_thread` | Split ⚡ |
| `archive_thread` | Archive |
| `export_thread` | PDF/JSON |

### ❌ Forbidden
- auto-merge
- auto-prioritize
- hidden linking
- emotional tagging

---

## VISIBILITY TYPES ⚡

| Type | Scope |
|------|-------|
| `private` | User-only |
| `shared` | Team |
| `scoped_read_only` | Cross-sphere |

---

## CONTRIBUTORS ⚡

```json
{
  "contributors": ["user_id","agent_id"]
}
```

---

## VALIDATION FIELD ⚡

```json
{
  "validation": "approved|pending|rejected"
}
```

---

## DECISION STEPS (from StepsSnapshot v1.0) ⚡

```json
{
  "steps": [
    { "step": "proposal", "source": "user|agent", "ref": "uuid" },
    { "step": "discussion", "meeting": "uuid" },
    { "step": "agent_input", "agent_id": "uuid" },
    { "step": "declared", "outcome": "string" }
  ]
}
```

### Step Types
| Step | Description |
|------|-------------|
| `proposal` | Initial |
| `discussion` | Meeting |
| `agent_input` | Agent |
| `declared` | Final |

---

## CONTEXT SNAPSHOT ⚡

```json
{
  "context_snapshot": {
    "sphere": "institution",
    "constraints": ["budget","deadline"],
    "active_agents": ["agent_x"],
    "external_factors": ["regulation_v3"]
  },
  "valid_from": t,
  "valid_to": null
}
```

---

## THREAD LINK RELATIONS ⚡

| Relation | Description |
|----------|-------------|
| `supports` | Supports another |
| `precedes` | Temporal order |
| `coexists` | Same period |

---

## INTENT THREAD (from IntentThread v1.0) ⚡ UNIQUE

### Purpose
Record **EXPLICITLY DECLARED intentions only.**

### STRICT RULE
> NO inferred intent.  
> NO agent-generated intent.  
> ONLY declared intent.

### JSON Model

```json
{
  "intent_thread": {
    "id": "uuid",
    "declared_by": "user_id",
    "linked_fact_thread": "uuid",
    "statement": "string",
    "timestamp": "iso",
    "scope": "personal|team|project"
  }
}
```

### Intent Scope ⚡
| Scope | Description |
|-------|-------------|
| `personal` | Individual |
| `team` | Team-level |
| `project` | Project-wide |

---

## HASH CHAIN ⚡

```json
{
  "hash_chain": ["sha256_1", "sha256_2", "sha256_3"]
}
```

---

## ENVIRONMENT ⚡

```json
{
  "environment": {
    "sphere": "business",
    "xr_preset": "meeting_room_a",
    "mode": "live|review|replay"
  }
}
```

---

## LINE STYLES ⚡

| Thread | Style |
|--------|-------|
| FACT | solid |
| CONTEXT | dashed |
| INTENT | dotted |

---

## USER-AUTHORED THREAD (from UserAuthored v1.0) ⚡ UNIQUE

### Purpose
Allow users to **manually link information** to represent their OWN understanding.

### JSON Model

```json
{
  "type": "user_authored",
  "owner": "user_id",
  "editable": true,
  "visibility": "private|shared"
}
```

### Unique Properties ⚡
| Property | Value |
|----------|-------|
| `editable` | true (unlike factual) |
| `visibility` | private by default |
| Never merged into factual | ✅ |

---

## RELATION REASONS ⚡

| Reason | Description |
|--------|-------------|
| `shared_topic` | Same topic |
| `time` | Temporal proximity |
| `artifact` | Shared artifact |

---

## AGENT_CONTEXT_LINKER ⚡ NEW

> **"Proposes contextual threads, confidence disclosed"**
- Suggests relationships
- Shows confidence score
- User approval required

---

## METHODOLOGICAL THREAD (from Methodological v1.0) ⚡ UNIQUE

### Purpose
Track METHODS applied **WITHOUT evaluating success or failure.**

### RULE
> **method ≠ result**

### JSON Model

```json
{
  "type": "methodological",
  "methods": [
    {
      "name": "method_id",
      "applied_at": 1712345678,
      "scope": "sphere|meeting|project"
    }
  ],
  "linked_events": ["event_id"]
}
```

---

## EDGES ARRAY ⚡

```json
{
  "edges": [
    { "from": "id", "to": "id", "relation": "referenced_by" }
  ]
}
```

---

## CONTEXTS ARRAY ⚡

```json
{
  "contexts": [
    {
      "sphere": "business",
      "participants": ["user","agent"],
      "time_range": [start, end]
    }
  ]
}
```

---

## SURROUNDS RELATION ⚡

```json
{
  "links": [
    { "to": "factual_thread_id", "relation": "surrounds" }
  ]
}
```

---

## PUBLIC ANONYMIZATION ⚡

> Public threads are **anonymized** for privacy

---

## LEARNING THREAD (from LearningThread v1.0) ⚡ UNIQUE

### Purpose
Capture hypotheses, experiments, discarded paths **WITHOUT asserting truth.**

### RULE
> **Learning Threads are EXPLICITLY NON-AUTHORITATIVE.**

### JSON Model

```json
{
  "type": "learning",
  "entries": [
    {
      "note": "string",
      "status": "active|discarded|paused",
      "timestamp": t
    }
  ],
  "confidence": "user_defined_only"
}
```

### Entry Status ⚡
| Status | Description |
|--------|-------------|
| `active` | Being explored |
| `discarded` | Abandoned |
| `paused` | On hold |

---

## THREAD COLLISION RULE ⚡

> **If learning contradicts fact → learning marked "conflict"**  
> **Fact remains untouched.**

---

## THREAD COLORS ⚡

| Type | Color |
|------|-------|
| Fact | white |
| Context | blue |
| Learning | amber |

---

## CONTEXTUAL LINK REASONS ⚡

| Reason | Description |
|--------|-------------|
| `sphere_transition` | Between spheres |
| `time_gap` | Time gap |
| `team_change` | Team changed |

---

## XR THREAD MODE ⚡

- Threads float between nodes
- Timeline braiding supported
- No animated persuasion

---

## CANONICAL UNIFIED MODEL (from CanonicalModel v1.0) ⚡

### Anchors

```json
{
  "anchors": [
    {
      "source_type": "meeting|replay|artifact|decision",
      "source_id": "uuid",
      "timestamp": t,
      "sphere": "business|scholar|xr"
    }
  ]
}
```

### Link Relations ⚡

| Relation | Description |
|----------|-------------|
| `references` | Cites another |
| `follows` | Temporal sequence |
| `branches` | Fork |
| `merges` | Combine |

---

## 4 VISUAL MODES ⚡

| Mode | Description |
|------|-------------|
| linear timeline | Straight |
| braided timeline | Multi-path |
| constellation view | Spatial |
| minimal list | Compact |

---

## AGENT_THREAD_EXTRACTOR ⚡ NEW

> **"Detects candidate anchors, suggestion-only"**

---

## THREAD NEUTRALIZATION ⚡

> **One-click action to disable a thread's influence**

---

## MEMORY INDEPENDENCE ⚡

> **Memory does NOT rewrite threads**

---

## RELATION THREAD (from RelationThread v1.0) ⚡ UNIQUE

### Purpose
Show relations **WITHOUT defining causality or meaning.**

### RULE
> **No directionality implied**

### JSON Model

```json
{
  "relation_thread": {
    "thread_id": "uuid",
    "links": [
      {
        "from": "fact_entry_id",
        "to": "fact_entry_id",
        "type": "shared_artifact|shared_topic|shared_participant"
      }
    ]
  }
}
```

### Relation Types ⚡
| Type | Description |
|------|-------------|
| `shared_artifact` | Same artifact |
| `shared_topic` | Same topic |
| `shared_participant` | Same person |

---

## CONTEXT THREAD ENHANCED ⚡

```json
{
  "sphere_state": "business_focus",
  "profile_used": "focus_mode",
  "location": "xr_meeting_classic"
}
```

---

## CONTEXT VISUAL ⚡

> **Overlay rings** — Context shown as non-intrusive rings

---

## THREAD HIERARCHY ⚡

| Thread | Role |
|--------|------|
| Fact | PRIMARY |
| Context | OPTIONAL OVERLAY |
| Relation | OPTIONAL MAP |

---

## EXPLORATORY THREAD (from ExploratorySession v1.0) ⚡ UNIQUE

### Purpose
**Temporary exploration** without altering memory.

### JSON Model

```json
{
  "type": "exploratory",
  "owner": "user_id",
  "session_scoped": true,
  "save_required": true
}
```

### Rules
- Never auto-saved
- Never merged into factual memory
- Fades on session end

---

## NODE TYPES ⚡

### Factual
| Type | Description |
|------|-------------|
| `FACT_EVENT` | Event |
| `FACT_ARTIFACT` | Artifact |
| `FACT_DECISION` | Decision |
| `FACT_CONTEXT` | Context |

### Contextual
| Type | Description |
|------|-------------|
| `CONTEXT_MEETING` | Meeting |
| `CONTEXT_SPHERE` | Sphere |
| `CONTEXT_AGENT` | Agent |
| `CONTEXT_TIME_RANGE` | Time |

---

## SOFT VISIBILITY ⚡

```json
{
  "visibility": "soft",
  "user_toggle": true
}
```

---

## AGENT_EXPLORATION_ASSISTANT ⚡ NEW

> **"Assists user linking, never persists data"**

---

## EDGE TYPES COMPLET (from EdgeTypes v1.0) ⚡

### Factual Edges
| Edge | Description |
|------|-------------|
| `happened_after` | Temporal |
| `references` | Cites |
| `reused_in` | Reused |
| `derived_from` | Created from |

### Contextual Edges
| Edge | Description |
|------|-------------|
| `same_context` | Shared context |
| `adjacent_time` | Time proximity |
| `shared_participants` | Same people |
| `parallel_activity` | Concurrent |

### Evolution Edges
| Edge | Description |
|------|-------------|
| `replaces` | Replaces |
| `refines` | Improves |
| `supersedes` | Supersedes |
| `deprecated_by` | Made obsolete |

---

## OBJECT_TYPE (Evolution) ⚡

```json
{
  "object_type": "avatar|plan|decor|profile"
}
```

---

## ARCHIVE VS ERASE ⚡

> **Archive = OK** (hidden but preserved)  
> **Erase = FORBIDDEN** (integrity protection)

---

## USER-CONTROLLED VISIBILITY ⚡

```json
{
  "visibility": "user-controlled"
}
```

---

## DECISION OPTIONS (from DecisionOptions v1.0) ⚡

### JSON Model

```json
{
  "decision_thread": {
    "context": "meeting|async|review",
    "options": ["A","B","C"],
    "chosen": "B",
    "revisions": []
  }
}
```

### Decision Edges ⚡
| Edge | Description |
|------|-------------|
| `considered` | Was considered |
| `selected` | Was chosen |
| `revised_from` | Revised from |
| `reverted_to` | Rolled back |

---

## CONTEXT CONSTRAINTS ⚡

```json
{
  "constraints": ["time","budget","data_gap"],
  "assumptions": ["assumption_1"],
  "snapshot_hash": "sha256"
}
```

### Context Edges ⚡
| Edge | Description |
|------|-------------|
| `contextualizes` | Provides context |
| `bounded_by` | Limited by |
| `influenced_by` | Affected by |

---

## LINKING RULE ⚡

> **Decision Threads MUST link to Context Threads**

---

## THREAD COLORS ⚡

| Type | Color |
|------|-------|
| Fact | white |
| Decision | gold |
| Context | blue |

---

## CONTEXT_FIELDS (from ContextFields v1.0) ⚡

```json
{
  "context_fields": {
    "room_preset": "xr_meeting_analysis",
    "participants_count": 6,
    "duration": 4200,
    "silence_ratio": 0.18
  }
}
```

### Fields
| Field | Description |
|-------|-------------|
| `room_preset` | XR room config |
| `participants_count` | Number of participants |
| `duration` | Duration in seconds |
| `silence_ratio` | Silence ratio (0.0-1.0) |

---

## ANIMATED FLOW ⚡

> **Evolution Threads** = animated flow visualization

---

## ADAPTIVE DENSITY ⚡

> **Thread density adapts to user profile**
- Experienced = more threads
- Beginners = simplified

---

## CONTEXT CANNOT OVERRIDE FACT ⚡

> **Context Threads CANNOT override Fact Threads**

---

## TOPIC THREAD (from TopicArtifact v1.0) ⚡ UNIQUE

```json
{
  "topic_thread": {
    "label": "string",
    "linked_entries": ["memory_id"],
    "visibility": "private|shared|sphere"
  }
}
```

> **Never auto-generated silently**

---

## ARTIFACT THREAD (from TopicArtifact v1.0) ⚡ UNIQUE

```json
{
  "artifact_thread": {
    "artifact_type": "doc|image|model|plan|data",
    "versions": [
      { "hash": "sha256", "meeting_id": "uuid", "timestamp": t }
    ]
  }
}
```

### Artifact Types
| Type | Description |
|------|-------------|
| `doc` | Document |
| `image` | Image |
| `model` | Model |
| `plan` | Plan |
| `data` | Dataset |

> **No "best version" tagging**

---

## DECISION STATES ⚡

| Status | Description |
|--------|-------------|
| `considered` | Being evaluated |
| `postponed` | Delayed |
| `chosen` | Selected |
| `revisited` | Re-examined |

---

## AGENT_THREAD_OBSERVER ⚡ NEW

> **"Suggests possible thread links, requires manual approval"**

---

## ARTIFACT THREAD (from ArtifactThread v1.0) ⚡ UNIQUE

### Purpose
Trace the life of an artifact.

### JSON Model

```json
{
  "artifact_thread": {
    "artifact_type": "doc|image|model|plan|data",
    "versions": [
      {
        "hash": "sha256",
        "meeting_id": "uuid",
        "timestamp": t
      }
    ],
    "current_visibility": "restricted|shared"
  }
}
```

### Artifact Types ⚡
| Type | Description |
|------|-------------|
| `doc` | Document |
| `image` | Image |
| `model` | 3D/AI model |
| `plan` | Plan |
| `data` | Dataset |

### RULE
> **No "best version" tagging**

---

## DECISION STATUS STATES ⚡

| Status | Description |
|--------|-------------|
| `considered` | Under consideration |
| `postponed` | Delayed |
| `chosen` | Selected |
| `revisited` | Reconsidered |

---

## AGENT_THREAD_OBSERVER ⚡ NEW

> **"Suggests possible thread links, requires manual approval"**

---

## 3-TIER THREAD TYPES (from 3TierTypes v1.0) ⚡

### Inter-Sphere Types (6)
| Type | Description |
|------|-------------|
| `shared_artifact` | Same artifact |
| `shared_topic` | Same topic |
| `decision_dependency` | Depends on |
| `timeline_overlap` | Same time |
| `agent_involvement` | Same agent |
| `cross-sphere reference` | Direct ref |

### Personal Types (4)
| Type | Description |
|------|-------------|
| `bookmark thread` | Saved items |
| `personal reference` | User refs |
| `user-defined tag` | Custom tags |
| `memory linkage` | Memory links |

### Collective Types (4)
| Type | Description |
|------|-------------|
| `collective_decision_flow` | Decisions |
| `artifact lineage` | History |
| `replay reference chain` | Replays |
| `sphere-to-sphere` | Cross deps |

---

## CONTEXT_NOTE ⚡

```json
{
  "context_note": "optional user note"
}
```

---

## SPHERE_SPANNING ⚡

```json
{
  "sphere_spanning": ["business","institution","xr"]
}
```

---

## NEUTRAL LINES ⚡

> **No arrows, no direction cues, no emotional signals**
> **Thickness = type importance (not value)**

---

## DECISION EVENT_TYPE (from GraphEdges v1.0) ⚡

| Type | Description |
|------|-------------|
| `proposal` | New option |
| `pause` | Paused |
| `decision` | Choice made |
| `reversal` | Reversed |

---

## LINKED_THREADS ⚡

```json
{
  "linked_threads": ["fact_thread_id","decision_thread_id"]
}
```

---

## MEETING_TYPE ⚡

```json
{
  "environment": {
    "meeting_type": "analysis|review|planning|..."
  }
}
```

---

## GRAPH EDGES ⚡

| Edge | Description |
|------|-------------|
| `references` | Cites |
| `precedes` | Before |
| `coexists` | Same time |
| `diverges` | Branches |

---

## GRAPH PROPERTIES ⚡

> **Acyclic** — No circular references  
> **Append-only** — Never delete  
> **Verifiable** — Hash verified

---

## KNOWLEDGE_DIFF (from KnowledgeDiff v1.0) ⚡ UNIQUE

### Purpose
Compare personal vs collective memory.

### Categories
| Category | Description |
|----------|-------------|
| `OVERLAP` | Exists in both |
| `UNIQUE_PERSONAL` | Only in personal |
| `UNIQUE_COLLECTIVE` | Only in collective |
| `INCOMPLETE` | Partial vs full |

### JSON Model

```json
{
  "knowledge_diff": {
    "overlap": ["id"],
    "unique_personal": ["id"],
    "unique_collective": ["id"],
    "incomplete": [{"collective":"id","user_version":"id"}]
  }
}
```

### Color Zones ⚡
| Zone | Color |
|------|-------|
| overlap | soft green |
| personal-only | blue |
| collective-only | grey |

---

## TIME THREAD TYPES (4) ⚡

| Type | Description |
|------|-------------|
| `TIME_EVENT_CHAIN` | Events |
| `TIME_DECISION_CHAIN` | Decisions |
| `TIME_ARTIFACT_EVOLUTION` | Artifacts |
| `TIME_AGENT_CHAIN` | Agents |

---

## ARTIFACT_CHANGE ⚡

```json
{
  "artifact_change": "minor|major|none"
}
```

---

## SEQUENCE_LOCK ⚡

```json
{
  "sequence_lock": true
}
```

> **Locks the order of timeline entries**

---

## HASH_CHAIN (from HashChain v1.0) ⚡

```json
{
  "hash_chain": ["sha256","sha256","sha256"]
}
```

> **Cryptographic chain linking entries**

---

## CONTEXT OBJECTIVE + ENVIRONMENT ⚡

```json
{
  "context_nodes": [
    {
      "objective": "declared goal",
      "environment": "xr|2d|hybrid"
    }
  ]
}
```

---

## EVOLUTION BEFORE/AFTER ⚡

```json
{
  "states": [
    {
      "changed_object": "decision|avatar|plan|profile",
      "before": "hash",
      "after": "hash"
    }
  ]
}
```

---

## GRAPH EDGES (supports/explains) ⚡

| Edge | Description |
|------|-------------|
| `supports` | Supports another |
| `explains` | Explains context |

---

## XR LUMINOUS STRANDS ⚡

> **Threads appear as luminous strands in XR**
> **Overlay thread on replay**

---

## PERSONAL THREAD (from PersonalThread v1.0) ⚡ UNIQUE

### Purpose
User's **PERSONAL VIEW** of how information connects.

### JSON Model

```json
{
  "type": "personal",
  "owner": "user_id",
  "entries": [
    {
      "ref_thread": "factual|context",
      "ref_id": "uuid",
      "note": "user note"
    }
  ],
  "visibility": "private|shared"
}
```

### Rules
- Private by default
- Editable
- **NEVER alters factual or context threads**
- Deleting never affects others

---

## MEETING_MODE ⚡

```json
{
  "meeting_mode": "analysis|creative|decision"
}
```

---

## XR_PRESET ⚡

```json
{
  "xr_preset": "xr_classic|xr_focus|..."
}
```

---

## AGENT_PERSONAL_THREAD_ASSISTANT ⚡ NEW

> **"Suggests personal links (opt-in only)"**

---

## TRACKED_OBJECT (from TrackedObject v1.0) ⚡

```json
{
  "tracked_object": "decision|plan|avatar|config",
  "versions": [
    {"version": 1, "hash": "sha256"},
    {"version": 2, "hash": "sha256"}
  ]
}
```

---

## CONTEXT_TYPE ⚡

```json
{
  "context_type": "sphere|meeting|environment"
}
```

---

## STRICT RULE ⚡

> **Fact nodes NEVER depend on context nodes.**

---

## THREAD VISUAL STYLES ⚡

| Type | Style |
|------|-------|
| factual | lines |
| context | **halos** |
| evolution | **stacked layers** |

---

## AGENT_THREAD_NAVIGATOR ⚡ NEW

> **"Visual positioning only"**

---

## INQUIRY THREAD (from InquiryThread v1.0) ⚡ UNIQUE

### Purpose
Track questions, investigations, unresolved paths.

### JSON Model

```json
{
  "type": "inquiry",
  "question": "string",
  "opened_by": "user|agent",
  "status": "open|paused|closed",
  "linked_facts": [],
  "notes": []
}
```

### Status States ⚡
| Status | Description |
|--------|-------------|
| `open` | Active |
| `paused` | Stopped |
| `closed` | Complete |

### RULE
> **Inquiry Threads NEVER auto-generate Facts**

---

## CONTEXT SIGNALS ⚡

```json
{
  "signals": ["topic","time","sphere","participants"],
  "user_confirmed": false
}
```

---

## INQUIRY VISUAL ⚡

> **Open arc + question glyph + expandable nodes**

---

## AGENT_THREAD_COLLECTOR ⚡ NEW

> **"Detects eligible links, no creation authority"**

---

## COLLECTIVE THREAD (from CollectiveValidation v1.0) ⚡ UNIQUE

### JSON Model

```json
{
  "collective_thread": {
    "validated_by": ["user1","user2"],
    "alignment_score": 0.85,
    "scope": "team|organization|global"
  }
}
```

### Scope Types ⚡
| Scope | Description |
|-------|-------------|
| `team` | Team level |
| `organization` | Org level |
| `global` | System-wide |

---

## CONFIDENCE MAX RULE ⚡

> **Confidence <= 0.9 max** — Prevents illusion of certainty

---

## CROSS-SPHERE SIGNAL ⚡

```json
{
  "signal": "shared_artifact|shared_topic|shared_agent"
}
```

---

## XR GLOW = VALIDATED ⚡

> **Glow intensity = validated link**
> **Floating filaments in XR**

---

## INTRA-SPHERE TYPES (5) ⚡

Topic | Task | Artifact | Decision | Timeline

## CROSS-SPHERE TYPES (4) ⚡

Sphere Bridge | Multi-Domain Topic | Cross-Decision | Continuity

## COLLECTIVE TYPES (4) ⚡

Collective Artifact | Multi-Team Decision | Shared Topic | Cross-Replay

---

## UNIFIED BUNDLE MODEL (from UnifiedBundle v1.0) ⚡ UNIQUE

```json
{
  "knowledge_threads_bundle": {
    "facts": [...],
    "contexts": [...],
    "evolutions": [...],
    "version": "1.0",
    "hash": "sha256",
    "safety": {
      "no_interpretation": true,
      "no_sentiment": true,
      "user_visibility_control": true
    }
  }
}
```

---

## CO-OCCURRENCE LINK ⚡

```json
{
  "links": [
    { "from": "uuid", "to": "uuid", "type": "co-occurrence" }
  ]
}
```

---

## CONTEXT EXPLANATION ⚡

```json
{
  "explanation": "Shared topic: Procurement"
}
```

---

## EVOLUTION DELTA ⚡

```json
{
  "metadata": { "delta": "updated_section" },
  "timeline_order": ["uuid1","uuid2","uuid3"]
}
```

---

## UI VISUAL RULES ⚡

| Thread | Style |
|--------|-------|
| Fact | thin lines, neutral |
| Context | colored orbits, **glow = density** |
| Evolution | **braided arc**, drift markers |

---

## SAFETY BLOCK ⚡

> **no_interpretation + no_sentiment + user_visibility_control**

---

## CONTEXT PHASE (from ContextPhase v1.0) ⚡

```json
{
  "context": {
    "phase": "exploration|review|closure",
    "tools": ["board","timeline"],
    "participants_count": 5
  }
}
```

### Phase Types ⚡
| Phase | Description |
|-------|-------------|
| `exploration` | Discovery |
| `review` | Examining |
| `closure` | Finalizing |

---

## CHANGE_TYPE (Evolution) ⚡

```json
{
  "changes": [
    {
      "from": "version_id",
      "to": "version_id",
      "change_type": "added|removed|revised|paused"
    }
  ]
}
```

---

## ONE-CLICK SOURCE INSPECTION ⚡

> **Immediately jump to original source from any thread node**

---

## VISUAL RULE ⚡

> **No thickness implying importance** — Color = type only

---

## SILENCE THREAD (from SilenceThread v1.0) ⚡ UNIQUE

### Purpose
Capture what **DID NOT happen**, where action was possible.

### JSON Model

```json
{
  "silence_thread": {
    "intervals": [
      {
        "start": 1712345000,
        "end": 1712345600,
        "context": "decision_window",
        "linked_fact_thread": "uuid"
      }
    ]
  }
}
```

### SILENCE RULES ⚡

| Statement | Status |
|-----------|--------|
| **silence ≠ failure** | ✅ |
| **silence ≠ error** | ✅ |
| **silence ≠ intent** | ✅ |

> **Silence = INFORMATION ONLY**

---

## PARTICIPANTS_ROLES ⚡

```json
{
  "participants_roles": ["user","agent","observer"]
}
```

---

## SILENCE VISUAL ⚡

> **Dashed line, low opacity**

---

## DECISION BRANCHES (from DecisionBranches v1.0) ⚡

```json
{
  "branches": [
    {
      "branch_id": "uuid",
      "origin_replay": "uuid",
      "events": ["event_id"],
      "status": "continued|paused|abandoned"
    }
  ]
}
```

### Branch Status ⚡
| Status | Description |
|--------|-------------|
| `continued` | Active |
| `paused` | Stopped |
| `abandoned` | Dead-end |

---

## CONTEXT SCOPE + NOTES ⚡

```json
{
  "scope": "meeting|project|sphere",
  "context_notes": [
    {
      "author": "user|agent",
      "note": "string",
      "signature": "sha256"
    }
  ]
}
```

---

## VISUAL DENSITY ⚡

> **Thickness = activity density**
> **Opacity = visibility level**

---

## AGENT_THREAD_INDEXER ⚡ NEW

> **"Indexes new eligible nodes"**

## AGENT_THREAD_LINKER ⚡ NEW

> **"Proposes connections (suggest-only)"**

---

## PROCEDURAL THREAD (from ProceduralThread v1.0) ⚡ UNIQUE

### Purpose
Link **METHODS, PROCESSES, and ACTION SEQUENCES** across domains.

### JSON Model

```json
{
  "procedural_thread": {
    "steps": [
      { "step_id": 1, "action": "string" },
      { "step_id": 2, "action": "string" }
    ],
    "domains": ["business","xr"],
    "variants": []
  }
}
```

### Fields ⚡
| Field | Description |
|-------|-------------|
| `steps` | Sequential steps |
| `domains` | Applicable domains |
| `variants` | Alternative versions |

---

## MULTI-THREAD MEMBERSHIP ⚡

> **One node can belong to multiple threads simultaneously**

---

## TRANSLUCENT ARCS ⚡

> **Threads rendered as translucent arcs**
> **Thickness = density, not importance**

---

## 3-LAYER THREAD SYSTEM (from 3LayerSystem v1.0) ⚡

### Layer 1: Internal (4 types)
| Type | Description |
|------|-------------|
| `continuation` | A → B |
| `reference` | A ↔ B |
| `dependency` | A requires B |
| `chronology` | A before B |

### Layer 2: Inter-Sphere (4 types)
| Type | Description |
|------|-------------|
| `cross_reference` | Cross ref |
| `cross_dependency` | Cross dep |
| `cross_context` | Cross context |
| `cross_replay_link` | Replay link |

### Layer 3: Cross-User (4 types)
| Type | Description |
|------|-------------|
| `shared_artifact_link` | Artifact |
| `shared_decision_link` | Decision |
| `shared_timeline_link` | Timeline |
| `shared_context_link` | Context |

---

## USER_VISIBLE ⚡

```json
{
  "user_visible": true
}
```

---

## SHARED_SPACE_ONLY ⚡

```json
{
  "visibility": "shared_space_only"
}
```

---

## XR VISUALIZATION ⚡

| Property | Value |
|----------|-------|
| Fading | distance-based |
| Audio | voice-safe (no cues) |
| Transitions | 500–800ms calm |

---

## AGENT_PRIVACY_GUARD ⚡ NEW

> **"Blocks cross-user leakage"**

## AGENT_UNIVERSE_RENDERER ⚡ NEW

> **"Never animates emotionally"**

---

## PERSPECTIVE THREAD (from PerspectiveThread v1.0) ⚡ UNIQUE

### Purpose
Attach **PERSONAL VIEW** without contaminating shared truth.

### JSON Model

```json
{
  "perspective_thread": {
    "author": "user|agent_id",
    "linked_fact_thread": "uuid",
    "notes": [
      {
        "content": "string",
        "visibility": "private|shared"
      }
    ]
  }
}
```

### Rules
- Explicitly subjective
- Isolated from facts
- **Deleting perspective never affects fact or context**

---

## TOGGLEABLE LAYERS ⚡

| Layer | Shows |
|-------|-------|
| facts only | Just facts |
| + context | Facts + context |
| + perspectives | All three |

---

## AGENT_CONTEXT_BINDER ⚡ NEW

> **"Attaches context metadata"**

## AGENT_PERSPECTIVE_ASSISTANT ⚡ NEW

> **"Helps users write reflections, never edits content"**

---

## THREAD OPERATIONS (from ThreadOperations v1.0) ⚡ UNIQUE

### Allowed Operations
| Operation | Constraint |
|-----------|------------|
| `create_thread` | manual only |
| `add_reference` | user approved |
| `remove_reference` | soft remove |
| `freeze_thread` | lock |
| `export_thread` | pdf / json / xr_view |

### Forbidden
- auto-merging
- auto-prioritization
- hidden threading

---

## APPROVED_BY ⚡

```json
{
  "links": [
    {
      "from_sphere": "business",
      "to_sphere": "scholar",
      "approved_by": "user_id"
    }
  ],
  "trace": true
}
```

---

## CONSTELLATION VIEW ⚡

> **Inter-sphere: constellation view with sphere orbits**
> **Directional links, manual expansion only**

---

## SCOPE (Collective) ⚡

```json
{
  "scope": "team|org|sphere"
}
```

---

## USER-AUTHORED THREAD (from UserAuthoredThread v1.0) ⚡ UNIQUE

### Purpose
Human-declared intentional links **WITHOUT modifying factual records**.

### JSON Model

```json
{
  "knowledge_thread": {
    "type": "user_authored",
    "nodes": ["node_id_1","node_id_2"],
    "note": "user explanation",
    "visibility": "private|shared",
    "created_by": "user_id"
  }
}
```

### Rules
- explicitly marked as user-authored
- **never promoted as fact**
- supports multi-node chains
- hypothesis tracking

---

## RELATION TYPES (Factual) ⚡

| Relation | Description |
|----------|-------------|
| `occurred_after` | Temporal |
| `references` | References |
| `depends_on` | Dependency |

---

## CREATED_BY OPTIONS ⚡

| Creator | For |
|---------|-----|
| `system` | Factual |
| `routing_ai` | Contextual |
| `user_id` | User-authored |

---

## ENTER REPLAY DIRECTLY ⚡

> **Click thread node → enter source replay**

---

## UNIVERSAL META-THREAD (from MetaThread v1.0) ⚡ UNIQUE

### Purpose
User's **ENTIRE KNOWLEDGE TREE** across all spheres.

### 5 Layers ⚡
| Layer | Content |
|-------|---------|
| 1 | Sphere timeline summary |
| 2 | Cross-sphere touchpoints |
| 3 | Decision evolution |
| 4 | Replay anchors |
| 5 | Memory cluster nodes |

### JSON Model

```json
{
  "meta_thread": {
    "spheres": ["all"],
    "global_timeline": [...],
    "clusters": [
      { "topic": "string", "threads": ["id1","id2"], "density": 0.42 }
    ],
    "user_defined_tags": ["phase_1","project_alpha"]
  }
}
```

---

## LINK REASONS ⚡

| Reason | Description |
|--------|-------------|
| `shared_document` | Same doc |
| `shared_topic` | Same topic |
| `chronological_dependency` | Time |
| `workflow_handover` | Handoff |
| `replay_reference` | Replay |

---

## VISUALIZATION MODES ⚡

| Mode | Style |
|------|-------|
| 2D | decluttered map |
| 3D | **orbit map** |
| XR | **spatial thread (read-only)** |

---

## THREAD INTERACTIONS ⚡

expand | fold | isolate | show artifacts | open replay

---

## DECISION PATHS (from DecisionPaths v1.0) ⚡

```json
{
  "decision_thread": {
    "objective": "string",
    "paths": [
      {
        "step": 1,
        "decision": "string",
        "context": "meeting_id"
      }
    ]
  }
}
```

---

## CONDITIONS (Context) ⚡

```json
{
  "conditions": {
    "time_pressure": false,
    "information_density": "low|medium|high"
  }
}
```

---

## AUTHORITY RULES ⚡

| Rule | Status |
|------|--------|
| **NO circular authority** | ✅ |
| **NO hierarchy of truth** | ✅ |

---

## BREAKS = SILENCE INTERVALS ⚡

> **Visual breaks in thread lines indicate periods of silence**

---

## PKT/IST/CKT SYSTEM (from PKT_IST_CKT v1.0) ⚡

### T1: Personal Knowledge Thread (PKT)
```json
{
  "personal_thread": {
    "owner": "user_id",
    "privacy": "private|shared"
  }
}
```
Feature: **gap & silence highlighting**

### T2: Inter-Sphere Thread (IST)
```json
{
  "inter_sphere_thread": {
    "source_sphere": "business",
    "target_sphere": "scholar",
    "links": [
      { "direction": "import|export" }
    ]
  }
}
```
Feature: **cross-domain replay jump**

### T3: Collective Knowledge Thread (CKT)
```json
{
  "collective_thread": {
    "participants": "hashed",
    "verification": "passed"
  }
}
```
Feature: **fork & merge visualization**

---

## VISUALIZATION MODES ⚡

| Mode | Feature |
|------|---------|
| Braided timelines | Compare threads |
| Silence overlay | Show gaps |

---

## READ-ONLY SHARE LINKS ⚡

> **Safe sharing without edit permissions**

---

## DECISION STEPS (from DecisionSteps v1.0) ⚡

```json
{
  "decision_thread": {
    "steps": [
      { "event": "proposal", "source": "uuid", "time": 0.12 },
      { "event": "discussion", "source": "uuid", "time": 1.47 },
      { "event": "confirmation", "source": "uuid", "time": 2.04 }
    ],
    "linked_replays": ["uuid"],
    "final_state": "accepted|deferred|abandoned"
  }
}
```

### Event Types ⚡
| Event | Description |
|-------|-------------|
| `proposal` | Initial |
| `discussion` | Middle |
| `confirmation` | Final |

### Final State ⚡
| State | Description |
|-------|-------------|
| `accepted` | Approved |
| `deferred` | Postponed |
| `abandoned` | Dropped |

---

## CONTEXT FIELDS ⚡

```json
{
  "meeting_type": "explore|review|decision",
  "duration": 3600,
  "info_density": 0.7
}
```

---

## HOVER + CLICK ACTIONS ⚡

| Action | Result |
|--------|--------|
| **Hover** | source preview |
| **Click** | replay/artifact jump |

---

## ENTITY_TYPE (from EntityType v1.0) ⚡

```json
{
  "entity_type": "decision|artifact|policy|event"
}
```

---

## CONTEXT_TAG + TIME_SPAN ⚡

```json
{
  "context_tag": "string",
  "time_span": {
    "start": "timestamp",
    "end": "timestamp"
  }
}
```

---

## EVOLUTION VERSIONS ⚡

```json
{
  "versions": [
    { "version": 1, "timestamp": "t1" },
    { "version": 2, "timestamp": "t2" }
  ],
  "current": 2
}
```

---

## THREAD CREATION RULES ⚡

| Rule | Status |
|------|--------|
| **deletion forbidden** | ❌ |
| **merging forbidden** | ❌ |
| only linking allowed | ✅ |

---

## VISUAL STYLES ⚡

| Thread | Style |
|--------|-------|
| Fact | straight solid |
| Context | **soft curved** |
| Evolution | **segmented timeline** |

---

## === END OF KNOWLEDGE THREADS MASTER ===

---

## FACT THREAD EDGES (from ThreadEdges v1.0) ⚡

| Edge | Description |
|------|-------------|
| `referenced_by` | Referenced by another |
| `repeated_in` | Repeated in context |
| `updated_by` | Updated by newer |

## DECISION THREAD EDGES ⚡

| Edge | Description |
|------|-------------|
| `informed_by` | Informed by fact |
| `followed_by` | Followed by decision |
| `reconsidered_in` | Reconsidered later |

---

## THREAD LINKS (Semantic) ⚡

| From → To | Link |
|-----------|------|
| fact → decision | `informed_by` |
| decision → context | `occurred_in` |
| context → fact | `available_at_time` |

---

## CONTEXT ENVIRONMENT ⚡

```json
{
  "environment": "xr|2d|hybrid",
  "artifacts_visible": ["id"],
  "silence": true
}
```

---

## DEFAULT STATE: OFF ⚡

> **User must enable thread visibility**

---

## CONTRIBUTORS + VERIFICATION (from ContributorsRelation v1.0) ⚡

```json
{
  "contributors": ["user_id","agent_id"],
  "verification_state": "validated"
}
```

---

## INTER-SPHERE RELATION ⚡

| Relation | Description |
|----------|-------------|
| `references` | References |
| `follows` | Follows |
| `influences` | Influences |

---

## BRAIDED STRANDS ⚡

> **Collective: thickness = number of participants**

---

## TEMPORAL KNOWLEDGE THREAD (from TemporalThread v1.0) ⚡ UNIQUE

### Thread Types (14 total) ⚡

**Intra-Sphere (4):**
| Type | Description |
|------|-------------|
| `event_chain` | Chronology |
| `artifact_dependency` | Dependencies |
| `decision_continuity` | Continuity |
| `agent_participation_path` | Participation |

**Cross-Sphere (5):**
| Type | Description |
|------|-------------|
| `shared_concept` | Topic overlap |
| `artifact_reference` | Cross docs |
| `decision_impact` | Triggers |
| `meeting_intersection` | Shared participants |
| `learning_transfer` | Knowledge transfer |

**Temporal (5):**
| Type | Description |
|------|-------------|
| `topic_evolution` | Concept change |
| `decision_revision` | Updates |
| `artifact_version_chain` | Versions |
| `replay_timeline_chain` | Sequences |
| `collective_memory_growth` | Memory growth |

---

## TIMELINE_MODE ⚡

```json
{
  "timeline_mode": "linear|braided"
}
```

---

## INDEXES ⚡

```json
{
  "indexes": {
    "by_sphere": {},
    "by_topic": {},
    "by_time": {},
    "by_meeting": {}
  }
}
```

---

## XR GHOST LAYERS ⚡

> **Temporal: ghost layers of previous states**

---

## EXPLANATION BUBBLE REQUIRED ⚡

> **Cross-sphere: explanation bubble REQUIRED before display**

---

## INTERACTIONS ⚡

| Action | Result |
|--------|--------|
| tap | expand |
| hold | preview |
| pinch | compare |

---

## RENDERING ⚡

| Thread | Style |
|--------|-------|
| Intra | ring-cluster paths |
| Cross | faint arcs |
| Temporal | scrollable braid |

---

## EVOLUTION STATES (from EvolutionStates v1.0) ⚡

```json
{
  "evolution_thread": {
    "subject": "decision|plan|concept|space",
    "states": [
      {
        "state_id": "uuid",
        "source_replay": "uuid",
        "description": "neutral change description"
      }
    ]
  }
}
```

### Subject Types ⚡
| Subject | Description |
|---------|-------------|
| `decision` | Decision |
| `plan` | Plan |
| `concept` | Concept |
| `space` | Space/environment |

---

## TIME_RANGE ⚡

```json
{
  "time_range": [1712345600, 1712349200]
}
```
> **Array format: [start, end]**

---

## CRYPTOGRAPHICALLY SIGNED ⚡

> **Fact threads are cryptographically signed**

---

## LINK BUT NEVER MERGE ⚡

> **Threads may LINK but NEVER MERGE**

---

## DOTTED HALO ⚡

> **Context Thread: dotted halo visual**

---

## CORE PHILOSOPHY ⚡

> **"A memory system, not a storyteller."**

---

## THREAD LINK MODEL (from ThreadLinkModel v1.0) ⚡ UNIQUE

```json
{
  "thread_link": {
    "from_thread": "thread_id_A",
    "to_thread": "thread_id_B",
    "relation": "references|follows|branches|merges|contextualized_by"
  }
}
```

### Relation Types ⚡
| Relation | Description |
|----------|-------------|
| `references` | fact → decision |
| `follows` | decision → decision |
| `branches` | decision → alternatives |
| `merges` | multiple → outcome |
| `contextualized_by` | any → context |

---

## DECISION STATE ⚡

| State | Description |
|-------|-------------|
| `option_selected` | Chosen |
| `deferred` | Postponed |
| `reversed` | Reversed |

---

## XR_PRESET ⚡

```json
{
  "xr_preset": "xr_classic"
}
```

---

## LINKING ≠ BLENDING ⚡

> **Original threads remain intact**

---

## NEW AGENTS ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_COLLECTOR` | Detects, proposes nodes |
| `AGENT_THREAD_LINKER` | Suggests links, never auto |

---

## USER CONTROLS ⚡

create | accept/reject | hide/show | export | reset

---

## 15 THREAD TYPES (from 15ThreadTypes v1.0) ⚡ COMPREHENSIVE

### INTRA-SPHERE (5) ⚡
| Type | Description |
|------|-------------|
| `THREAD_TOPIC` | Same subject |
| `THREAD_DEPENDENCY` | Requires |
| `THREAD_CLARIFICATION` | Clarifies |
| `THREAD_VERSION` | Versions |
| `THREAD_AGENT_ACTION` | Agent actions |

### CROSS-SPHERE (5) ⚡
| Type | Description |
|------|-------------|
| `THREAD_ANALOGY` | Similar structure |
| `THREAD_RESOURCE_LINK` | Shared resource |
| `THREAD_DECISION_IMPACT` | Affects other |
| `THREAD_AGENT_BRIDGE` | Same agent |
| `THREAD_MEMORY_REFERENCE` | Cross reference |

### TEMPORAL (5) ⚡
| Type | Description |
|------|-------------|
| `THREAD_PROGRESS` | Evolution |
| `THREAD_DIVERGENCE` | Diverging |
| `THREAD_CONSOLIDATION` | Merging |
| `THREAD_REVIEW` | Validation |
| `THREAD_REAPPEARANCE` | Revival |

---

## MANUAL_VERIFIED ⚡

```json
{
  "manual_verified": true
}
```

---

## EVENT ACTIONS ⚡

| Action | Description |
|--------|-------------|
| `created` | Created |
| `updated` | Updated |
| `referenced` | Referenced |

---

## NO SLOPE IMPLYING IMPROVEMENT ⚡

> **Timeline visual has no slope suggesting progress**

---

## CROSS-SPHERE COLOR SHIFT ⚡

> **Visual: color shifts when crossing spheres**

---

## AGENT_THREAD_VALIDATOR ⚡

> **Cryptographic timestamping**

---

## THREAD ELEMENT TYPES (from SyncModes v1.0) ⚡

| Type | Description |
|------|-------------|
| `THREAD_EVENT` | Atomic fact |
| `THREAD_DECISION` | Decision log |
| `THREAD_ARTIFACT` | Document/visual |
| `THREAD_CONTEXT` | Sphere/mode |
| `THREAD_LINK` | Reference |

---

## CROSSING RULES ⚡

| Rule | Description |
|------|-------------|
| `CROSS-SHARE` | Fork into B, keep A origin |
| `CROSS-REF` | Link but NOT migrate |
| `CROSS-CLUSTER` | Multi-sphere label |

---

## SYNC MODES (3) ⚡ UNIQUE

| Mode | Description |
|------|-------------|
| `MIRROR` | Copy + layer notes |
| `SHADOW` | Structure only |
| `MERGE VIEW` | Overlap, read-only |

---

## SYNC JSON ⚡

```json
{
  "knowledge_thread_sync": {
    "mode": "mirror|shadow|merge",
    "personal_layer": [...],
    "collective_layer": [...],
    "privacy": "local_encrypted"
  }
}
```

---

## NEUTRAL GLYPH ⚡

> **Crossing nodes = neutral glyph, no directional arrows**

---

## LOCAL_ENCRYPTED ⚡

> **Personal elements encrypted locally**

---

## THREAD EXPLORER (from ThreadExplorer v1.0) ⚡ UNIQUE

### JSON Model

```json
{
  "thread_explorer": {
    "visible_threads": ["uuid"],
    "filters": {
      "type": ["fact","context","decision_trace"],
      "sphere": ["business","scholar"],
      "time_range": [t1, t2]
    },
    "view_mode": "graph|timeline|list",
    "read_only": true
  }
}
```

### View Modes ⚡
| Mode | Description |
|------|-------------|
| `graph` | Spatial network |
| `timeline` | Braided timeline |
| `list` | Simple list |

### Filters (6) ⚡
type | sphere | participant | time_range | artifact | meeting

---

## THREAD EDGES (by type) ⚡

**Fact:** `followed_by`, `referenced_by`
**Context:** `occurred_in`, `shared_context`  
**Decision:** `preceded_by`, `superseded_by`

---

## EXPLORER FEATURES ⚡

| Feature | Description |
|---------|-------------|
| intersection highlights | Show crossings |
| silence gap visualization | Show gaps |
| replay jump | Read-only |

---

## READ_ONLY DEFAULT ⚡

> **Thread Explorer is read-only by default**

---

## THREAD EXPLORER (from ThreadExplorer v1.0) ⚡ UNIQUE

```json
{
  "thread_explorer": {
    "visible_threads": ["uuid"],
    "filters": {...},
    "view_mode": "graph|timeline|list",
    "read_only": true
  }
}
```

### View Modes ⚡
| Mode | Description |
|------|-------------|
| `graph` | Spatial |
| `timeline` | Braid |
| `list` | List |

### Features ⚡
- silence gap visualization
- replay jump (read-only)

---

## EDGE TYPES (from ThreadExplorer + FullSpec) ⚡

### Fact Edges
| Edge | Description |
|------|-------------|
| `followed_by` | Sequence |
| `referenced_by` | Reference |
| `reference` | References |
| `continuation` | Continues |
| `revision` | Revises |
| `reuse` | Reuses |

### Context Edges
| Edge | Description |
|------|-------------|
| `occurred_in` | Location |
| `shared_context` | Shared |

### Decision Edges
| Edge | Description |
|------|-------------|
| `preceded_by` | Before |
| `superseded_by` | Replaced |

---

## ENVIRONMENT TYPES ⚡

| Type | Description |
|------|-------------|
| `xr` | Extended Reality |
| `2d` | Traditional |
| `hybrid` | Mixed |

---

## BRANCHES + CAUSE ⚡

```json
{
  "branches": [
    {
      "from": "decision_id",
      "to": "decision_id",
      "cause": "new_info|constraint|scope_change"
    }
  ]
}
```

---

## TRANSITIONS + TRIGGER ⚡

```json
{
  "transitions": [
    {
      "from": "state_id",
      "to": "state_id",
      "trigger": "new_meeting|new_agent|scope_shift"
    }
  ]
}
```

---

## INFO_DENSITY ⚡

> **0.0 to 1.0 - measures information density**

---

## THICKNESS = RECURRENCE COUNT ⚡

> **Visual thickness represents recurrence count**

---

## NEW AGENTS ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_EXTRACTOR` | Detects continuity |
| `AGENT_THREAD_RENDERER` | Visual only |

---

## TRIAD SYSTEM (from TriadSystem v1.0) ⚡ UNIQUE

### Thread Hierarchy
| Layer | Thread |
|-------|--------|
| **Base** | Fact Threads |
| **Reference** | Decision Threads |
| **Wrapper** | Context Threads |

> **Threads form TRIADS - NO thread exists alone**

---

## SCOPE ⚡

| Scope | Description |
|-------|-------------|
| `single` | Single sphere |
| `multi-sphere` | Multiple spheres |

---

## ENVIRONMENT ⚡

| Environment | Description |
|-------------|-------------|
| `xr_meeting` | XR meeting |
| `2d_review` | 2D review |
| `async` | Asynchronous |

---

## CONSTRAINTS ⚡

```json
{
  "constraints": ["time","budget","policy"]
}
```

---

## PROFILE_SNAPSHOT ⚡

> **Links to navigation_profile_id**

---

## IMMUTABILITY ⚡

```json
{
  "immutability": "after_close"
}
```

---

## LINKED_FACTS ⚡

```json
{
  "linked_facts": ["fact_thread_id"]
}
```

---

## SPATIAL RIBBONS ⚡

> **XR: threads as spatial ribbons**

---

## AGENT_THREAD_NAVIGATOR ⚡

> **Highlights related threads, suggestion-only**

---

## TRUTH WITHOUT AUTHORITY ⚡

> **"truth without authority, memory without control, learning without rewriting the past"**

---

## INSTALL-READY ADDITIONS (from InstallReady v1.0) ⚡

### Alternative Type Names ⚡
| Type | Alternative Name |
|------|------------------|
| Fact | THREAD_TYPE_INFORMATION |
| Decision | THREAD_TYPE_DECISION |
| Context/Evolution | THREAD_TYPE_EVOLUTION |

### Origin Block ⚡
```json
{
  "origin": {
    "sphere": "scholar|business|...",
    "source_id": "artifact_uuid",
    "timestamp": 1712345678
  }
}
```

### Node Fields ⚡
| Field | Values |
|-------|--------|
| `ref_type` | artifact / note / message |
| `used_in` | meeting / decision / research |

### Timeline Steps ⚡
```json
{
  "timeline": [
    {
      "step": 1,
      "source": "meeting_uuid",
      "action": "discussed",
      "timestamp": 1712350000
    }
  ]
}
```

### Action Types ⚡
| Action | Description |
|--------|-------------|
| `discussed` | Discussed |
| `declared` | Declared |

### Relation: overlaps ⚡
> **NEW: `overlaps` - Threads overlap in content**

### Versions with reason ⚡
```json
{
  "versions": [
    {
      "version": 2,
      "state": "updated",
      "reason": "context change",
      "timestamp": 1712400000
    }
  ]
}
```

### Universe View Defaults ⚡
| Default | Value |
|---------|-------|
| threads | OFF (manual activation) |
| color-coded | by type |
| access | read-only unless owner |

### Universe View Features ⚡
- highlight active threads
- dim unrelated nodes
- show thread path overlay
- toggle thread types
