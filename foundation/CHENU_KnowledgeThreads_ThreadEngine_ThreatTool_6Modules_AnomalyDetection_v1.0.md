# CHE·NU — KNOWLEDGE THREADS + THREAD ENGINE + THREAT TOOL
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## 1) KNOWLEDGE THREADS — CORE PRINCIPLE ⚡

### Purpose
Represent the flow of **validated knowledge** across spheres, meetings, decisions, and artifacts.

### RULE
> **A Knowledge Thread = chain of VERIFIED facts only. Never interpretations. Never sentiment.**

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | sequence of events tied to a mission/topic ⚡ |
| `THREAD_DECISION` | chain of decisions + their context ⚡ |
| `THREAD_ARTIFACT` | evolution of documents/boards/data ⚡ |
| `THREAD_DISCUSSION` | **transcript segments linked across meetings** ⚡ |
| `THREAD_AGENT` | trace of agent contributions across tasks ⚡ |

### Thread Nodes ⚡
| Field | Description |
|-------|-------------|
| `timestamp` | ⚡ |
| `source (replay_id)` | ⚡ |
| `fact_type` | ⚡ |
| `sphere` | ⚡ |
| `reference_id` | artifact/event/decision ⚡ |
| `hash` | ⚡ |

### Thread Link Rules ⚡

**Facts MAY Link IF:**
| Condition | Status |
|-----------|--------|
| same topic | ✅ ⚡ |
| same goal | ✅ ⚡ |
| same artifact lineage | ✅ ⚡ |
| same agent involvement | ✅ ⚡ |
| same sphere relevance | ✅ ⚡ |

**Thread Links NEVER:**
| Forbidden | Status |
|-----------|--------|
| **infer causality** | ❌ ⚡ |
| **imply correctness** | ❌ ⚡ |
| **suggest ideal sequence** | ❌ ⚡ |

### Thread JSON ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "event|decision|artifact|discussion|agent",
    "nodes": ["..."],
    "links": [{ "from": "id", "to": "id", "type": "continuity|reference" }],
    "version": "n",
    "hash": "sha256"
  }
}
```

---

## 2) KNOWLEDGE THREAD ENGINE ⚡

### Purpose
Create, maintain, visualize, merge, fork, and export Knowledge Threads across the Che-Nu ecosystem.

### RULE
> **Engine does NOT evaluate quality of knowledge. Only structure + synchronization.**

### 6 Engine Modules ⚡ (NOUVEAU!)

| Module | Name | Function |
|--------|------|----------|
| **A** | `THREAD_BUILDER` | creates thread skeletons from replay metadata ⚡ |
| **B** | `THREAD_LINKER` | detects valid connections, applies safety rules ⚡ |
| **C** | `THREAD_FORKER` | **new branch when interpretations diverge, old branch preserved forever** ⚡ |
| **D** | `THREAD_MERGER` | merges identical fact chains, asks validation when conflicts ⚡ |
| **E** | `THREAD_RENDERER` | 2D view, 3D orbital, **XR thread walk mode** ⚡ |
| **F** | `THREAD_EXPORTER` | PDF summary, JSON bundle, **XR immersive replay thread** ⚡ |

### Thread Engine Config JSON ⚡

```json
{
  "thread_engine": {
    "auto_link": true,
    "validation_required": true,
    "allow_fork": true,
    "visual_modes": ["2d", "3d", "xr"],
    "max_depth": 5000,
    "safety": { "no_inference": true }
  }
}
```

### Thread Visualization Rules ⚡

| Mode | Description |
|------|-------------|
| **2D** | horizontal timeline, nodes sized by importance (neutral metric), links clearly labeled ⚡ |
| **3D** | threads as orbit chains around spheres, nodes glow on hover, **comparison mode** ⚡ |
| **XR** | **walkable threads**, spatial scaling enabled, all non-actionable ⚡ |

---

## 3) KNOWLEDGE THREAT TOOL ⚡ (NOUVEAU!)

### Purpose
Detect **anomalies, inconsistencies, temporal impossibilities, or potential misinformation** — WITHOUT judging intent.

### RULE
> **Threat ≠ accusation. Threat = structural inconsistency only.**

### 6 Threat Types ⚡

| Type | Description |
|------|-------------|
| `THREAT_INCONSISTENCY` | **facts contradict each other** ⚡ |
| `THREAT_MISSING_LINK` | event references non-existent thread section ⚡ |
| `THREAT_TEMPORAL_BREAK` | **impossible timestamp sequence** ⚡ |
| `THREAT_DUPLICATE_CONFLICT` | two sources claim mutually exclusive facts ⚡ |
| `THREAT_SOURCE_DEGRADATION` | **thread fragment missing validation hash** ⚡ |
| `THREAT_ALIGNMENT_DRIFT` | **collective memory vs thread content mismatch** ⚡ |

### Threat Analysis JSON ⚡

```json
{
  "knowledge_threat": {
    "id": "uuid",
    "type": "inconsistency|missing_link|temporal|duplicate|source|drift",
    "location": "node_id|thread_id",
    "severity": "0.1-1.0",
    "description": "string",
    "suggested_actions": ["revalidate", "fork", "flag"]
  }
}
```

### Threat Tool Actions ⚡

| Action | Description |
|--------|-------------|
| `revalidate` | re-check replay hash ⚡ |
| `fork_thread` | isolate conflict in new branch ⚡ |
| `request_context` | ask user or agent for missing metadata ⚡ |
| `silence_alert` | **hide benign inconsistencies** ⚡ |

### NO Actions Include ⚡
| Forbidden | Status |
|-----------|--------|
| **rewriting data** | ❌ ⚡ |
| **ranking truth** | ❌ ⚡ |
| **bias annotation** | ❌ ⚡ |

### Threat Dashboard ⚡

**Displays:**
| Feature | Description |
|---------|-------------|
| threat clusters | ⚡ |
| unresolved conflicts | ⚡ |
| temporal ruptures | ⚡ |
| **thread health scores (structural, not truth-based)** | ⚡ |

**User Controls:**
| Control | Description |
|---------|-------------|
| filter by sphere | ⚡ |
| filter by severity | ⚡ |
| open thread in XR | ⚡ |
| **export threat audit** | ⚡ |

---

## WHY THE 3 SYSTEMS TOGETHER? ⚡

| System | = |
|--------|---|
| **KNOWLEDGE THREADS** | → structure & memory ⚡ |
| **THREAD ENGINE** | → growth, visualization, export ⚡ |
| **THREAT TOOL** | → **integrity, safety, correction** ⚡ |

### Ensemble = ⚡
> A knowledge system that grows **WITHOUT manipulation, WITHOUT narrative forcing, WITHOUT rewriting the past** — but with perfect transparency, lineage, and ethics.

---

**END — FOUNDATION FREEZE READY**
