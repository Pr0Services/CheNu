# CHE·NU — KNOWLEDGE THREAD SYSTEM
**VERSION:** CORE.v2.0 ENHANCED  
**MODE:** FOUNDATION / FREEZE-COMPATIBLE / MULTI-AGENT

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Connect related information INSIDE a single sphere (Business, Scholar, Creative, XR…).**

### RULE
> **Thread links ONLY factual items.**

### 7 Thread Sources ⚡
| Source | Description |
|--------|-------------|
| documents | ⚡ |
| decisions | ⚡ |
| meeting replays | ⚡ |
| notes | ⚡ |
| artifacts | ⚡ |
| tasks | ⚡ |
| datasets | ⚡ |

### Thread Logic ⚡
> **THREAD = sequence of related knowledge nodes.**

### 4 Connection Types ⚡
| Connection | Description |
|------------|-------------|
| shared topic | ⚡ |
| shared dependency | ⚡ |
| shared timeline | ⚡ |
| shared participants | ⚡ |

### Intra-Sphere Thread JSON ⚡
```json
{
  "thread_intra": {
    "id": "uuid",
    "sphere": "business|scholar|creative|...",
    "created_at": "ISO8601",
    "version": 1,
    "nodes": [
      { "id": "uuid", "type": "decision|note|replay|file", "timestamp": "ISO8601" }
    ],
    "links": [
      { "from": "id", "to": "id", "reason": "topic|timeline|dependency" }
    ],
    "health": {
      "node_count": 5,
      "link_density": 0.8,
      "last_activity": "ISO8601"
    },
    "hash": "sha256"
  }
}
```

### 🆕 AMÉLIORATION: Thread Health Metrics ⚡
| Metric | Description |
|--------|-------------|
| `node_count` | Total nodes in thread |
| `link_density` | Ratio links/nodes (0.0-1.0) |
| `last_activity` | Last modification timestamp |
| `staleness_days` | Days since last activity |

---

## 2) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Connect information ACROSS spheres to reveal systemic relationships.**

### RULE
> **NEVER invent relationships — only explicit links.**

### Cross-Sphere Examples ⚡
| From | To | Example |
|------|----|---------|
| Business | Scholar | research informs strategy |
| Creative | Social | media influences campaign |
| XR | Methodology | workflow visualization |
| Institution | All | **compliance threads** |

### 5 Inter-Sphere Link Types ⚡
| Type | Description |
|------|-------------|
| `informational_dependency` | ⚡ |
| `shared_artifact` | ⚡ |
| `procedural_connection` | ⚡ |
| `cross_sphere_decision_impact` | ⚡ |
| `regulatory_influence` | **Institution → others** ⚡ |

### Inter-Sphere Thread JSON ⚡
```json
{
  "thread_inter": {
    "id": "uuid",
    "spheres": ["business", "scholar"],
    "direction": "bidirectional|unidirectional",
    "nodes": ["..."],
    "links": [
      { "from": "id", "to": "id", "type": "dependency|influence|reference", "strength": 0.85 }
    ],
    "explainability": { 
      "visible": true,
      "rationale": "Shared research artifact ABC-123"
    },
    "cross_sphere_approval": {
      "business_approved": true,
      "scholar_approved": true
    },
    "hash": "sha256"
  }
}
```

### 🆕 AMÉLIORATION: Cross-Sphere Approval ⚡
> **Each sphere must approve the link before it becomes active**

---

## 3) COLLECTIVE KNOWLEDGE THREADS (CROSS-USER) ⚡

### Purpose
> **Aggregate knowledge from multiple users WITHOUT breaking privacy boundaries.**

### RULE
> **Thread uses anonymized references and NEVER exposes private data.**

### 5 Collective Sources ⚡
| Source | Description |
|--------|-------------|
| approved shared content | ⚡ |
| cross-user meeting replays | ⚡ |
| published artifacts | ⚡ |
| public threads | ⚡ |
| collaborative projects | ⚡ |

### 4 Pattern Types ⚡
| Pattern | Description |
|---------|-------------|
| repeated topics across users | ⚡ |
| shared needs | ⚡ |
| similar decision paths | ⚡ |
| parallel workflows | ⚡ |

### Collective Thread JSON ⚡
```json
{
  "thread_collective": {
    "id": "uuid",
    "anonymized": true,
    "origin_count": 23,
    "min_contributors": 3,
    "nodes": ["..."],
    "links": ["..."],
    "discovery": "topic_cluster|timeline_alignment",
    "confidence": 0.78,
    "privacy_level": "fully_anonymized|aggregated_only",
    "opt_in_required": true,
    "hash": "sha256"
  }
}
```

### 🆕 AMÉLIORATION: Privacy Levels ⚡
| Level | Description |
|-------|-------------|
| `fully_anonymized` | No user identifiable, only patterns |
| `aggregated_only` | Statistical summaries only |
| `min_contributors: 3` | **Minimum users before pattern visible** |

---

## 4) WORKFLOWS — KNOWLEDGE THREAD GENERATION ⚡

### WORKFLOW 1 — THREAD CREATION ⚡
| Step | Action |
|------|--------|
| 1 | User / Agent triggers "Create Thread" |
| 2 | System collects nodes matching criteria |
| 3 | Link analysis (topic, timeline, dependency) |
| 4 | Thread preview generated |
| 5 | **User validates** |
| 6 | Thread saved + hashed |

### WORKFLOW 2 — THREAD EXPANSION ⚡
| Step | Action |
|------|--------|
| 1 | New node added in sphere |
| 2 | Agent_Thread_Analyzer evaluates relevance |
| 3 | If match → proposes extension |
| 4 | **User chooses to accept or reject** |
| 5 | Thread version ++ |

### WORKFLOW 3 — THREAD SURFACING ⚡
| Step | Action |
|------|--------|
| 1 | Universe View displays thread lines |
| 2 | Hover reveals node content |
| 3 | Click enters sphere-specific context |
| 4 | Optional XR visualization |

### WORKFLOW 4 — COLLECTIVE THREAD DISCOVERY ⚡
| Step | Action |
|------|--------|
| 1 | Users opt-in to knowledge federation |
| 2 | Agent_Collective_Synthesizer anonymizes inputs |
| 3 | Cluster detection via topic proximity |
| 4 | Collective thread generated |
| 5 | **Users notified** |

### 🆕 WORKFLOW 5 — THREAD ARCHIVAL ⚡
| Step | Action |
|------|--------|
| 1 | Thread inactive > 90 days |
| 2 | Agent_Thread_Analyzer flags for review |
| 3 | User decides: archive, delete, or keep |
| 4 | Archived threads remain searchable |
| 5 | **Full audit trail preserved** |

### 🆕 WORKFLOW 6 — THREAD MERGE ⚡
| Step | Action |
|------|--------|
| 1 | User identifies overlapping threads |
| 2 | Agent_Thread_Builder proposes merge plan |
| 3 | Preview shows combined thread |
| 4 | **User approves merge** |
| 5 | Original threads preserved as versions |

---

## 5) AGENTS REQUIRED ⚡

### 6 Core Agents ⚡
| Agent | Role |
|-------|------|
| `AGENT_THREAD_ANALYZER` | identifies related nodes, proposes links, **ensures no inference or invention** |
| `AGENT_THREAD_BUILDER` | assembles final thread object, creates versioned metadata, computes hashes |
| `AGENT_COLLECTIVE_SYNTHESIZER` | anonymizes data, creates cross-user patterns, **privacy locked** |
| `AGENT_THREAD_GUARD` | prevents: bias, incorrect causality, emotional interpretation, **private data leakage** |
| `AGENT_ROUTING_INTEGRATOR` | links threads to Universe View, ensures non-manipulative routing |
| `AGENT_THREAD_EXPLAINER` | human-readable explanations, **transparency reinforcement** |

### 🆕 2 Additional Agents ⚡
| Agent | Role |
|-------|------|
| `AGENT_THREAD_ARCHIVER` | manages thread lifecycle, archival, retention policies |
| `AGENT_THREAD_HEALTH_MONITOR` | tracks thread health metrics, alerts on staleness |

---

## 6) API / PLATFORM ACTIONS ⚡

### REST API Endpoints ⚡
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/threads/{sphere}` | List threads in sphere |
| POST | `/threads/create` | Create new thread |
| POST | `/threads/expand` | Expand existing thread |
| GET | `/threads/collective` | Get collective threads |
| POST | `/threads/analyze` | Analyze node relationships |
| GET | `/universe/thread-map` | Get Universe View thread map |
| POST | `/xr/thread-visualization` | Generate XR visualization |

### 🆕 Additional Endpoints ⚡
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/threads/{id}/history` | Get thread version history |
| POST | `/threads/merge` | Merge two threads |
| POST | `/threads/{id}/archive` | Archive thread |
| GET | `/threads/health` | Get health metrics for all threads |
| POST | `/threads/{id}/fork` | Fork thread into new branch |

### System Actions ⚡
| Action | Description |
|--------|-------------|
| auto-hash entries | ⚡ |
| version control | ⚡ |
| integrity auditing | ⚡ |
| privacy redaction | ⚡ |
| XR mapping | ⚡ |

---

## 7) THREAD VISUALIZATION (2D/3D/XR) ⚡

### 2D Views ⚡
| View | Description |
|------|-------------|
| linear chain | sequential display |
| branching tree | hierarchy display |
| force-directed graph | relationship display |

### 3D Views ⚡
| View | Description |
|------|-------------|
| orbital layers | spheres orbiting |
| vertical timeline pillars | time-based |
| cross-sphere beams | **inter-sphere connections** |

### XR Views ⚡
| View | Description |
|------|-------------|
| immersive story mode | **(non-narrative)** |
| anchored spatial nodes | fixed positions |
| walkable thread paths | **navigation in 3D space** |

### 🆕 View Configuration JSON ⚡
```json
{
  "thread_view_config": {
    "mode": "2d|3d|xr",
    "layout": "linear|tree|graph|orbital|timeline|spatial",
    "show_health_indicators": true,
    "show_version_history": false,
    "highlight_stale_threads": true,
    "color_by": "sphere|age|activity|type"
  }
}
```

---

## 8) THREAD SAFETY RULES ⚡

| Rule | Status |
|------|--------|
| **no predictive interpretation** | ✅ ⚡ |
| **no behavioral inference** | ✅ ⚡ |
| **no emotional metadata** | ✅ ⚡ |
| **no ranking threads** | ✅ ⚡ |
| **user approves all cross-sphere links** | ✅ ⚡ |

### 🆕 Additional Safety Rules ⚡
| Rule | Status |
|------|--------|
| **no auto-merge without user consent** | ✅ ⚡ |
| **no deletion without audit trail** | ✅ ⚡ |
| **minimum 3 contributors for collective patterns** | ✅ ⚡ |
| **explicit opt-in for cross-user federation** | ✅ ⚡ |

---

## 9) 🆕 THREAD LIFECYCLE STATES ⚡

| State | Description |
|-------|-------------|
| `draft` | Being created, not yet validated |
| `active` | Validated and in use |
| `expanding` | New nodes being proposed |
| `stale` | No activity > 30 days |
| `archived` | Preserved but hidden from default views |
| `merged` | Combined into another thread |

### State Transition Rules ⚡
```
draft → active (user validates)
active → expanding (new node proposed)
expanding → active (user accepts/rejects)
active → stale (30 days inactivity)
stale → active (new activity)
stale → archived (user decision)
active → merged (merge workflow)
```

---

## 10) 🆕 INTEGRATION HOOKS ⚡

### Hooks for Other CHE·NU Systems ⚡
| Hook | Target System | Trigger |
|------|---------------|---------|
| `on_thread_created` | Universe View | New thread appears |
| `on_thread_expanded` | Collective Memory | Update references |
| `on_cross_sphere_link` | Sphere Agents | Notify affected spheres |
| `on_collective_pattern` | All opted-in users | Pattern discovery |
| `on_thread_archived` | Search Index | Remove from active index |

---

**END — FREEZE READY — ENHANCED v2.0**
