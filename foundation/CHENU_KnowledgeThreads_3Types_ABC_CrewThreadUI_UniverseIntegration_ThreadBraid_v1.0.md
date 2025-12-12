# CHE·NU — KNOWLEDGE THREADS (3 TYPES) + CREW THREAD UI + UNIVERSE INTEGRATION
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD READY

---

## OVERVIEW — WHAT IS A KNOWLEDGE THREAD? ⚡

> **A Knowledge Thread = A NEUTRAL, TRACEABLE, MULTI-SPHERE LINK** connecting: facts, artifacts, meetings, replays, agents, decisions, documents.

### RULE
> **A thread NEVER implies causality, influence, or recommendation. It ONLY connects elements that share STRUCTURAL RELATIONSHIPS.**

---

## THE 3 TYPES OF KNOWLEDGE THREADS ⚡

### 1) THREAD TYPE A — FACTUAL THREAD ⚡

> **Links of objective, verifiable elements.**

**Examples:**
- same dataset used in multiple meetings
- identical document version appearing across spheres
- repeated factual statements

**Structure:**
| Component | Values |
|-----------|--------|
| node types | event / artifact / fact / replay / decision ⚡ |
| edge type | **"shares_fact_with"** ⚡ |

**Thread A JSON:**
```json
{
  "thread_A": {
    "id": "uuid",
    "nodes": ["..."],
    "shared_facts": ["hash1", "hash2"],
    "integrity": "verified"
  }
}
```

**Rules:**
| Rule | Status |
|------|--------|
| **no interpretation** | ✅ ⚡ |
| **no prediction** | ✅ ⚡ |
| **no ranking of importance** | ✅ ⚡ |

---

### 2) THREAD TYPE B — CONTEXTUAL THREAD ⚡

> **Links items that belong to a shared CONTEXT but not necessarily the same content.**

**Context Examples:**
- same sphere
- same topic keyword
- same group of participants
- **same recurring problem**

**Structure:**
| Component | Values |
|-----------|--------|
| node types | meeting / replay / artifact / sphere ⚡ |
| edge type | **"shares_context_with"** ⚡ |

**Thread B JSON:**
```json
{
  "thread_B": {
    "id": "uuid",
    "context": "topic|sphere|participants",
    "nodes": ["..."],
    "metadata": {}
  }
}
```

**Rules:**
| Rule | Status |
|------|--------|
| **context is neutral and declared** | ✅ ⚡ |
| **never inferred or "guessed"** | ✅ ⚡ |
| **must be user-readable** | ✅ ⚡ |

---

### 3) THREAD TYPE C — PROCESS THREAD ⚡

> **Shows the PROCESS or WORKFLOW that led to decisions.**

**Examples:**
- step-by-step reasoning chain
- sequence of meetings
- chain of documents
- **action timelines**

**Structure:**
| Component | Values |
|-----------|--------|
| node types | decision / event / agent_action ⚡ |
| edge type | **"follows_from"** ⚡ |

**Thread C JSON:**
```json
{
  "thread_C": {
    "id": "uuid",
    "steps": [
      { "node": "A", "t": "..." },
      { "node": "B", "t": "..." }
    ],
    "decision_links": ["..."],
    "hash": "sha256"
  }
}
```

**Rules:**
| Rule | Status |
|------|--------|
| **chronological only** | ✅ ⚡ |
| **no evaluation or success labeling** | ✅ ⚡ |
| **faithful to recorded data** | ✅ ⚡ |

---

## CREW KNOWLEDGE THREAD UI ⚡ (NOUVEAU!)

### Purpose
> **Visualize and navigate thread networks in a calm, structured, human-legible interface.**

### 4 UI SECTIONS ⚡

**SECTION 1 — THREAD SELECTOR:**
| Filter | Description |
|--------|-------------|
| by type (A/B/C) | ⚡ |
| by sphere | ⚡ |
| by participants | ⚡ |
| **search by artifact/document** | ⚡ |

**SECTION 2 — THREAD VISUALIZER:**
| Mode | Description |
|------|-------------|
| `linear mode` | timeline ⚡ |
| `radial mode` | context orbit ⚡ |
| `layered mode` | **facts / context / process** ⚡ |
| `thread braid` | **A+B+C overlay** ⚡ |

**Interactions:**
| Action | Description |
|--------|-------------|
| hover highlight | ⚡ |
| click to open artifact/meeting | ⚡ |
| **lock/unlock comparison** | ⚡ |

**SECTION 3 — THREAD AUDIT PANEL:**
| Displays | Description |
|----------|-------------|
| thread type | ⚡ |
| source counts | ⚡ |
| **integrity checks** | ⚡ |
| explanation of links | ⚡ |
| **no interpretations** | ⚡ |

**SECTION 4 — THREAD EXPORT:**
| Action | Description |
|--------|-------------|
| `export_pdf` | ⚡ |
| `export_json` | ⚡ |
| `attach_to_meeting` | ⚡ |

### Knowledge Thread JSON ⚡
```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "A|B|C",
    "nodes": ["..."],
    "edges": ["..."],
    "context": {},
    "hash": "sha256"
  }
}
```

---

## INTEGRATION INTO UNIVERSE VIEW ⚡

### Purpose
> **Knowledge Threads become a NEW LAYER that overlays the spatial graph of meetings / replays / spheres.**

### RULE
> **Universe never changes its topology based on thread importance.**

### THREADS IN 2D UNIVERSE VIEW ⚡

| Thread | Line Style | Color |
|--------|------------|-------|
| **A (factual)** | dotted lines | **blue** ⚡ |
| **B (context)** | dashed lines | **green** ⚡ |
| **C (process)** | solid lines | **amber** ⚡ |

**Node badges:**
| Badge | Description |
|-------|-------------|
| T icon | = thread membership ⚡ |
| number | = how many threads touch this node ⚡ |

### THREADS IN 3D UNIVERSE VIEW ⚡

**3D rendering:**
| Feature | Description |
|---------|-------------|
| thread tubes with minimal glow | ⚡ |
| **thickness indicates number of shared items** | ⚡ |
| depth offset prevents visual clutter | ⚡ |

**Navigation:**
| Function | Description |
|----------|-------------|
| `focus_thread(id)` | ⚡ |
| `collapse_other_threads` | ⚡ |
| `orbit_center_on_thread` | ⚡ |

**XR interaction:**
| Action | Description |
|--------|-------------|
| **grab thread → highlight path** | ⚡ |
| **pinch → zoom thread structure** | ⚡ |
| **anchor thread in space** | ⚡ |

---

## AGENT INTEGRATION ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | scans new data for factual/context/process links, **never infers meaning**, logs all link events ⚡ |
| `AGENT_THREAD_EXPLAINER` | human readable description, **no interpretation** ⚡ |
| `AGENT_THREAD_GUARD` | **prevents: influence signals, weighted suggestions, emergent bias structures** ⚡ |

---

## THREAD EXPORT & IMPORT ⚡

### EXPORT ⚡
| Format | Description |
|--------|-------------|
| `.thread.json` | full data ⚡ |
| `.thread.pdf` | summary ⚡ |
| `.thread.bundle` | **for XR view** ⚡ |

### IMPORT ⚡
| Rule | Description |
|------|-------------|
| **must match hash signature** | ⚡ |
| **validated by thread guard** | ⚡ |
| **duplicates merged safely** | ⚡ |

---

**END — FOUNDATION FREEZE READY**
