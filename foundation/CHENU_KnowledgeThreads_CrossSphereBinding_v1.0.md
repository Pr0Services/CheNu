# CHE·NU — KNOWLEDGE THREADS + CROSS-SPHERE THREADS + COLLECTIVE BINDING
**VERSION:** CORE.KNOWLEDGE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## 1) KNOWLEDGE THREADS — CORE SYSTEM

### Purpose
Represent connections between ideas, decisions, artifacts, meetings, and agents — **WITHOUT interpretation or persuasion.**

### RULE
> **Thread = Traceable Connection**  
> **NOT meaning, NOT explanation, NOT ranking.**

---

### THREAD TYPES

| Type | Purpose |
|------|---------|
| `THREAD_EVENT` | Connects events/actions across time, reveals temporal sequences |
| `THREAD_ARTIFACT` | Links documents, boards, media, outputs |
| `THREAD_DECISION` | Connects cause → decision → consequence (observed only) |
| `THREAD_CONTEXT` | Links sphere, domain, theme, meeting type |
| `THREAD_PARTICIPANT` | Connects users/agents who co-occur across nodes |

---

### THREAD PROPERTIES

| Property | Type |
|----------|------|
| `id` | uuid |
| `nodes` | [node_id] |
| `type` | event\|artifact\|decision\|context\|participant |
| `timestamp_range` | {start, end} |
| `sphere_origin` | business\|scholar\|creative\|social\|institution\|xr |
| `integrity_hash` | sha256 |
| `read_only` | true |

---

### THREAD JSON MODEL

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "event|artifact|decision|context|participant",
    "nodes": ["uuid","uuid"],
    "timestamp_range": { "start": 1712, "end": 1712 },
    "spheres": ["business","creative"],
    "hash": "sha256",
    "read_only": true
  }
}
```

---

### THREAD FORMATION RULES

| Mode | Triggers |
|------|----------|
| **AUTO** | repeated co-occurrence, shared timestamps, shared artifacts, repeated decisions, proximity in universe view |
| **MANUAL** | user-created links, agent-proposed (requires confirmation) |

### NEVER
- ❌ imply causality
- ❌ rewrite history
- ❌ infer intentions

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS

### Purpose
Connect information across spheres **WITHOUT merging them** or allowing one domain to influence another's logic.

### RULE
> **Cross-sphere = STRUCTURAL, not interpretative.**

---

### CROSS-SPHERE TYPES

| Type | Description |
|------|-------------|
| `THREAD_SPHERE_EVENT` | Event in one sphere causes reference in another |
| `THREAD_SPHERE_ARTIFACT` | Same file/note used across multiple spheres |
| `THREAD_SPHERE_DECISION` | Two parallel decisions referencing same anchors |
| `THREAD_SPHERE_CONTEXT` | XR meetings referencing scholar data, etc. |

---

### CROSS-SPHERE SAFETY

- ❌ no automatic decision assistance
- ❌ no "recommended" outcomes
- ❌ no domain override
- ✅ explicit user visibility of cross-links

---

### CROSS-SPHERE CLUSTERING (Universe View)

| Element | Display |
|---------|---------|
| Spheres | orbit clusters per sphere |
| Threads | soft arcs between orbits |
| Strength | number of nodes linked |
| Colors | ❌ NO color implying correctness or priority |

---

### CROSS-SPHERE JSON MODEL

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

## 3) COLLECTIVE BINDING — MEMORY ↔ KNOWLEDGE THREAD MERGE

### Purpose
Bind Collective Memory entries into Knowledge Threads, so users can navigate facts fluidly across replays, artifacts, meetings, and spheres.

### RULE
> **Binding = ORGANIZATION**  
> **NOT interpretation.**

---

### BINDING MODEL

```
COLLECTIVE MEMORY ENTRY → becomes a NODE
KNOWLEDGE THREAD        → becomes an EDGE
UNIVERSE VIEW           → visualization of living memory graph
```

---

### BINDING RULES

- ✅ all memory entries bind automatically to threads
- ✅ all threads reference memory hashes
- ✅ replays produce new binding nodes
- ✅ users may create manual threads
- ✅ all bindings are reversible and inspectable
- ❌ agents cannot delete bindings

---

### COLLECTIVE BINDING JSON

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

---

### BINDING VISUALIZATION

| Mode | Elements |
|------|----------|
| **XR** | glowing lines linking replay nodes, timeline braids for cross-replay, cluster pulses for high connectivity |
| **2D** | graph view, collapsible clusters, hover-to-expand metadata |

---

## AGENT ROLES

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Assembles threads from factual data, **no interpretation** |
| `AGENT_MEMORY_BINDER` | Connects memory entries, verifies hash chains |
| `AGENT_THREAD_EXPLAINER` | Simple human-readable labels only: "these events shared an artifact" |

---

## ETHICAL GUARANTEES

| Guarantee | Status |
|-----------|--------|
| No narrative shaping | ✅ |
| No predictive modelling | ✅ |
| No ranking of threads | ✅ |
| No emotional inference | ✅ |
| No causality suggestion | ✅ |
| No hidden filtering | ✅ |

---

## WHY KNOWLEDGE THREADS + BINDING MATTER

| Component | Purpose |
|-----------|---------|
| **THREADS** | connections |
| **MEMORY** | truths |
| **BINDING** | clarity |
| **UNIVERSE VIEW** | navigation |

### Together
> **A structured, navigable reality**  
> **WITHOUT manipulation, bias, or interpretation.**

---

**END — FREEZE READY**
