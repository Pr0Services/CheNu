# CHE·NU — KNOWLEDGE THREADS (A + B + C)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## A) KNOWLEDGE THREADS — CORE SYSTEM ⚡

### Purpose
Connect meetings, data, artifacts, agents, decisions, and user insights into **THREADS — linear or branched** — WITHOUT interpretation, weighting, or recommendation.

### RULE
> **A Knowledge Thread = STRUCTURED TRACE. NOT a narrative, NOT a summary, NOT a conclusion.**

### 5 Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | **chronologically ordered events** ⚡ |
| `THREAD_DECISION` | sequences where a decision was shaped ⚡ |
| `THREAD_ARTIFACT` | documents & notes linked across time ⚡ |
| `THREAD_AGENT` | **same agent across different contexts** ⚡ |
| `THREAD_TOPIC` | shared tags connecting multiple sessions ⚡ |

### Thread Node JSON ⚡

```json
{
  "id": "uuid",
  "type": "event|artifact|decision|meeting",
  "timestamp": 1712345678,
  "sphere": "business|scholar|method|xr|...",
  "source_id": "replay_or_meeting_id",
  "participants": ["user|agent"],
  "metadata": { "topic": "string" }
}
```

### Thread Model JSON ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "name": "string",
    "type": "event|decision|artifact|topic",
    "nodes": ["ThreadNode"],
    "links": [
      { "from": "node_id", "to": "node_id", "type": "temporal|topic|dependency" }
    ],
    "integrity_hash": "sha256"
  }
}
```

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **timeline-stable** | ✅ ⚡ |
| **no deletion of history** | ✅ ⚡ |
| **multi-source merging allowed if cryptographically valid** | ✅ ⚡ |
| **NO "importance ranking"** | ✅ ⚡ |

---

## B) CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Allow connections **BETWEEN spheres** WITHOUT merging their identities or objectives.

### RULE
> **Cross-sphere = CROSSING, not BLENDING.**

### 4 Cross-Sphere Entry Points ⚡ (NOUVEAU!)

| Entry | Description |
|-------|-------------|
| **ENTRY 1 — Shared Topic** | e.g., "budget", "learning", "creative assets" ⚡ |
| **ENTRY 2 — Shared Artifact** | **one file used across spheres** ⚡ |
| **ENTRY 3 — Shared Agent** | agent participates in multiple domains ⚡ |
| **ENTRY 4 — Shared Timeline** | **events in meaningful sequence** ⚡ |

### Cross-Sphere Thread Visualization ⚡

**Nodes grouped into ORBITS:**
| Orbit | Description |
|-------|-------------|
| Business Orbit | ⚡ |
| Scholar Orbit | ⚡ |
| Creative Orbit | ⚡ |
| Social Orbit | ⚡ |
| Institution Orbit | ⚡ |
| XR Orbit | ⚡ |
| Methodology Orbit | ⚡ |

**Edges:**
| Type | Description |
|------|-------------|
| **dashed lines** | = cross-sphere references ⚡ |
| **colored lines** | = intra-sphere continuity ⚡ |
| **thick lines** | = **replay-derived event clusters** ⚡ |

### Cross-Sphere Safety Rules ⚡
| Rule | Status |
|------|--------|
| **No inference across spheres** | ✅ ⚡ |
| **No causal assumptions** | ✅ ⚡ |
| **No meaning attribution** | ✅ ⚡ |
| **User must confirm every sphere-crossing** | ✅ ⚡ |

---

## C) PERSONAL ↔ COLLECTIVE KNOWLEDGE WEAVING ⚡

### Purpose
Let each user see **HOW their own threads connect to the collective memory** — WITHOUT overriding or being overridden.

### RULE
> **Personal perspective ≠ rewriting collective truth**

### 4 Weaving Layers ⚡ (NOUVEAU!)

| Layer | Description |
|-------|-------------|
| **LAYER 1 — Personal Thread** | Only user's meetings, notes, agents ⚡ |
| **LAYER 2 — Collective Baseline** | **Immutable shared backbone** ⚡ |
| **LAYER 3 — Overlay** | Alignment of personal & collective nodes ⚡ |
| **LAYER 4 — Divergence Map** | **Shows where understanding differs WITHOUT right/wrong** ⚡ |

### 4 Weaving Modes ⚡ (NOUVEAU!)

| Mode | Description |
|------|-------------|
| `REFLECTION` | personal thread only, calm view ⚡ |
| `ALIGNMENT` | personal + collective, **highlights matches** ⚡ |
| `DIVERGENCE` | highlights mismatched nodes, **accessible ONLY on request** ⚡ |
| `TEACHING` | **show context without interpretation** ⚡ |

### Weaving JSON Model ⚡

```json
{
  "knowledge_weave": {
    "personal_thread": "uuid",
    "collective_thread": "uuid",
    "overlay": ["node_id"],
    "divergence": ["node_id"],
    "mode": "reflection|alignment|divergence|teaching"
  }
}
```

### Weaving Ethical Constraints ⚡
| Rule | Status |
|------|--------|
| **never suggest corrections** | ✅ ⚡ |
| **never score divergence** | ✅ ⚡ |
| **never reduce complexity into labels** | ✅ ⚡ |
| **personal autonomy preserved** | ✅ ⚡ |
| **collective truth integrity preserved** | ✅ ⚡ |

---

## WHY A + B + C MATTERS ⚡

| Section | = |
|---------|---|
| **A** | → Connects **facts** ⚡ |
| **B** | → Connects **spheres** ⚡ |
| **C** | → Connects **perspectives** ⚡ |

### All WITHOUT ⚡
- manipulation
- pressure
- emotional framing
- hidden prioritization

---

**END — FREEZE READY**
