# CHE·NU — KNOWLEDGE THREADS (3 LAYERS)
**VERSION:** KNT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Reveal the internal "logic flow" of a **SINGLE sphere** (Business, Scholar, Creative, Social, Institution, etc.) WITHOUT inference, judgment, or prioritization.

### RULE
> **A Knowledge Thread = a SEQUENCE OF FACTS linked by shared context or artifacts.**

### 4 Thread Types (Intra-Sphere) ⚡
| Type | Description |
|------|-------------|
| `THREAD_CONTEXT` | meetings linked by same context tag (e.g., "product development") ⚡ |
| `THREAD_ARTIFACT` | documents, notes, boards used across multiple sessions ⚡ |
| `THREAD_AGENT` | sequences where one agent participated repeatedly **(no ranking, no influence scoring)** ⚡ |
| `THREAD_DECISION` | **chain of decisions WITHOUT labeling outcomes as good/bad** ⚡ |

### Intra-Sphere JSON ⚡

```json
{
  "intra_thread": {
    "sphere": "business|scholar|creative|...",
    "origin_node": "uuid",
    "nodes": ["uuid", "uuid", "..."],
    "link_reason": "context|artifact|agent|decision",
    "hash": "sha256",
    "immutable": true
  }
}
```

### Visualization Rules ⚡
| Rule | Description |
|------|-------------|
| straight-line or braided line | ⚡ |
| **minimal color coding per thread type** | ⚡ |
| no emphasis beyond factual connection | ⚡ |
| **user may collapse or expand parts** | ⚡ |

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Show how information and decisions flow **BETWEEN spheres** without implying causality or strategic direction.

### RULE
> **Cross-sphere threads = FACTUAL INTERSECTIONS ONLY. NEVER suggestions or predictions.**

### 4 Thread Types (Cross-Sphere) ⚡
| Type | Description |
|------|-------------|
| `THREAD_SHARED_ARTIFACT` | documents reused between Business → Scholar → Institution ⚡ |
| `THREAD_SHARED_GOAL` | same high-level goal appears in multiple spheres ⚡ |
| `THREAD_SHARED_AGENT` | **agent contributes across spheres (display presence, not influence)** ⚡ |
| `THREAD_TOPIC_MIGRATION` | **topics appear in multiple spheres over time** ⚡ |

### Key Type: `TOPIC_MIGRATION` ⚡ (NOUVEAU!)
> **Tracks how topics move between spheres over time**

### Cross-Sphere JSON ⚡

```json
{
  "cross_thread": {
    "spheres": ["business", "scholar", "creative"],
    "nodes": [
      { "id": "uuid", "sphere": "business" },
      { "id": "uuid", "sphere": "creative" }
    ],
    "shared_reason": "artifact|goal|agent|topic",
    "hash": "sha256",
    "immutable": true
  }
}
```

### Visualization Rules ⚡
| Rule | Description |
|------|-------------|
| **arcs or bridges between sphere orbits** | ⚡ |
| **thickness = count of connections (NOT importance)** | ⚡ |
| color = thread type | ⚡ |
| **always user-expandable, never auto-expanded** | ⚡ |

---

## 3) TEMPORAL KNOWLEDGE THREADS (TIMELINE INTELLIGENCE) ⚡

### Purpose
Track how information evolves **OVER TIME** without generating insight or interpretation.

### RULE
> **Timeline Threads = TIME-ORDERED FACTS ONLY.**

### 4 Temporal Thread Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVOLUTION` | how a concept/artifact evolved between replays ⚡ |
| `THREAD_DECISION_HISTORY` | **chronological chain of decisions across meetings** ⚡ |
| `THREAD_ACTIVITY_RHYTHM` | **timing of user or agent participation (no productivity scoring)** ⚡ |
| `THREAD_SPATIAL_TEMPORAL` | **XR room states + avatar states over time** ⚡ |

### Key Type: `ACTIVITY_RHYTHM` ⚡ (NOUVEAU!)
> **Participation timing patterns — NO productivity scoring**

### Temporal Thread JSON ⚡

```json
{
  "temporal_thread": {
    "origin": "uuid",
    "sequence": [
      { "t": 1712345000, "node": "uuid1" },
      { "t": 1712347000, "node": "uuid2" }
    ],
    "type": "evolution|decision|activity|spatial",
    "hash": "sha256",
    "immutable": true
  }
}
```

### Visualization Rules ⚡
| Rule | Description |
|------|-------------|
| sliding timeline | ⚡ |
| **nodes placed with equal temporal spacing** | ⚡ |
| overlay option for comparing two threads | ⚡ |
| **no extrapolation of future events** | ⚡ |
| **optional XR "time corridor" rendering** | ⚡ |

---

## THREAD SAFETY & ETHICAL GUARANTEES ⚡

| Rule | Status |
|------|--------|
| **threads show CONNECTIONS, not conclusions** | ✅ ⚡ |
| **no ranking, no scoring, no hidden bias** | ✅ ⚡ |
| **no emotional cues, no predictive modeling** | ✅ ⚡ |
| **user must explicitly open cross-links** | ✅ ⚡ |
| **all thread structures are immutable + hashed** | ✅ ⚡ |
| **no thread can interpret intent or success** | ✅ ⚡ |

---

## SYSTEM INTEGRATIONS ⚡

| Component | Role |
|-----------|------|
| `AGENT_THREAD_BUILDER` | constructs threads from validated data, **append-only, no rewriting** ⚡ |
| `AGENT_THREAD_GUARD` | checks ethical compliance, **protects against inference or manipulation** ⚡ |
| `UNIVERSE VIEW` | displays threads as overlays, **respects user's navigation profile** ⚡ |
| `XR VIEW` | allows immersive "walk-through" of threads, **in ghost mode (read-only)** ⚡ |

---

## EXPORT FORMATS ⚡

| Format | Description |
|--------|-------------|
| `thread.json` | canonical ⚡ |
| `thread.pdf` | visual rendering ⚡ |
| `thread.xrpack` | **XR corridor** ⚡ |

---

**END — FOUNDATION FREEZE**
