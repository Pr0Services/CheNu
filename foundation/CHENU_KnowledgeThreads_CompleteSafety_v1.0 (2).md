# CHE·NU — KNOWLEDGE THREADS SYSTEM (COMPLETE SAFETY)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## OVERVIEW

> **Knowledge Threads = structured, traceable connections**  
> between pieces of information across spheres, timelines, meetings, replays, artifacts, and agents.

### RULE
> **Threads reveal RELATIONS.**  
> **They NEVER infer meaning, intention, or interpretation.**

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS

### Purpose
Connect related knowledge **INSIDE a single sphere.**

### Examples by Sphere
| Sphere | Connects |
|--------|----------|
| Business | tasks, CRM items, decisions, documents |
| Scholar | lessons, sources, notes, exam logs |
| Creative | drafts, media, tools, presets |
| XR | scenes, presets, interactions |

### Thread Types (INTRA)

| Type | Description |
|------|-------------|
| `INTRA_REFERENCE` | Links artifacts that cite one another |
| `INTRA_SEQUENCE` | Ordered steps inside a workflow |
| `INTRA_DEPENDENCY` | Required-before/required-after relationships |
| `INTRA_CLUSTER` | Logical grouping (topic, project, chapter) |

### JSON Model

```json
{
  "type": "intra",
  "sphere": "business|scholar|creative|...",
  "nodes": ["artifact_id", "decision_id"],
  "links": [
    { "from": "id", "to": "id", "reason": "reference|sequence|dependency" }
  ],
  "integrity_hash": "sha256"
}
```

### Rules
- ✅ append-only
- ✅ no weighting
- ✅ no ranking
- ✅ transparent source references

---

## 2) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Connect knowledge **ACROSS different spheres** (Business ↔ Scholar ↔ XR ↔ Creative ↔ Social) **WITHOUT merging meaning or enforcing hierarchy.**

### Examples
- scholar concept linked to business process
- creative asset used in social sphere content
- XR meeting referencing institutional documents

### Thread Types (INTER)

| Type | Description |
|------|-------------|
| `CROSS_REFERENCE` | Explicit reference across spheres |
| `CROSS_TOPIC` | Shared topic labels (objective-term only) |
| `CROSS_AGENT` | Same agent participating across spheres |
| `CROSS_SILENCE` | Simultaneous inactivity signalling structural gaps |

### JSON Model

```json
{
  "type": "inter",
  "spheres": ["business","creative"],
  "nodes": ["artifact_id", "meeting_id", "replay_id"],
  "links": [
    { "from": "id", "to": "id", "reason": "topic|reference|agent|silence" }
  ],
  "safety": {
    "no_inference": true,
    "no_recommendation": true
  }
}
```

### Rules
- ✅ Cross-links must be transparent
- ❌ No semantic summarization
- ❌ No synthesized meaning
- ✅ Users choose thread visibility

---

## 3) TEMPORAL KNOWLEDGE THREADS

### Purpose
Link knowledge **ACROSS TIME** — replays, decisions, memory entries — to show evolution WITHOUT judgement.

### Thread Types (TEMPORAL)

| Type | Description |
|------|-------------|
| `TEMPORAL_CHAIN` | Chronological link of related events |
| `TEMPORAL_BRANCH` | Points where decisions diverged |
| `TEMPORAL_BRAID` | Parallel events across different meetings |
| `TEMPORAL_RECONVERGENCE` | Points where paths later align again |

### JSON Model

```json
{
  "type": "temporal",
  "time_mode": "chain|branch|braid|reconverge",
  "timeline": [
    { "t": 1712345, "node": "meeting_id" },
    { "t": 1712360, "node": "decision_id" }
  ],
  "origin_replays": ["replay_1","replay_2"],
  "read_only": true
}
```

### Rules
- ✅ only timestamped facts allowed
- ❌ no counterfactuals
- ❌ no predictions
- ❌ no "optimal path" tagging

---

## KNOWLEDGE THREAD SAFETY RULESET (5 RULES)

| # | Rule | Description |
|---|------|-------------|
| **SAFETY 01** | NO INTERPRETATION | Threads connect facts only. No meaning generation. |
| **SAFETY 02** | COMPLETE TRANSPARENCY | Every link displays its reason. |
| **SAFETY 03** | USER CONTROL | User can: disable threads, disable cross-sphere links, collapse braids, hide agent nodes |
| **SAFETY 04** | IMMUTABILITY | Threads referencing validated replays cannot be modified. |
| **SAFETY 05** | REPLAY-ANCHORED TRUTH | All thread-based facts MUST originate from: stored replay frames, validated artifacts, timestamped decisions. **NO synthetic knowledge.** |

---

## RENDERING MODES (4)

| Mode | Description |
|------|-------------|
| **MAP** | Nodes in clusters, visible link types |
| **THREADLINE** | Linear timeline with branches |
| **BRAIDVIEW** | Parallel thread visualization |
| **XR THREADROOM** | Walkable thread-lines in XR, fading/un-fading nodes on demand |

---

## AGENT ROLES

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Constructs threads, **never infers new knowledge** |
| `AGENT_THREAD_GUARD` | Prevents unauthorized links, **enforces "no meaning-making"** |
| `AGENT_THREAD_EXPLAINER` | Explains why nodes connected, **human-readable, purely factual** |

---

## STORAGE MODEL (BUNDLE)

```json
{
  "knowledge_threads_bundle": {
    "intra": [],
    "inter": [],
    "temporal": [],
    "version": 1,
    "hash": "sha256",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

**END — FREEZE COMPATIBLE**
