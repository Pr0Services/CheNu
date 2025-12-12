# CHE·NU — KNOWLEDGE THREADS (3 LAYERS) + EXTERNAL EXPORT ENGINE
**VERSION:** KN.v1.0  
**MODE:** FOUNDATION / IMMUTABLE / NON-MANIPULATIVE

---

## 1) KNOWLEDGE THREADS — CORE SYSTEM ⚡

### Purpose
> **Transform scattered information (meetings, notes, artifacts, decisions, replays, tasks) into CLEAR, TRACEABLE THREADS.**

### RULE
> **A Thread = FACTUAL LINKAGE. Not interpretation. Not prioritization. Not narrative shaping.**

### 5 Thread Element Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | time-stamped fact, **reference to source replay** ⚡ |
| `THREAD_ARTIFACT` | document / file / visual board ⚡ |
| `THREAD_DECISION` | **explicit decision, no outcome judgment** ⚡ |
| `THREAD_CONTEXT` | sphere, participants, topic ⚡ |
| `THREAD_GAP` | **missing data, unanswered question, pending task** ⚡ |

### Thread Structure JSON ⚡
```json
{
  "thread": {
    "id": "uuid",
    "title": "string",
    "nodes": [
      {
        "type": "event|artifact|decision|context|gap",
        "ref": "id",
        "timestamp": 1712345,
        "sphere": "business|social|scholar|...",
        "hash": "sha256"
      }
    ],
    "links": [
      { "from": "node_id", "to": "node_id", "reason": "time|topic|dependency|reference" }
    ],
    "integrity": "verified"
  }
}
```

### Key Type: `THREAD_GAP` ⚡ (NOUVEAU!)
> **Represents missing data, unanswered questions, or pending tasks**

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **Append-only** | ✅ ⚡ |
| **Immutable references** | ✅ ⚡ |
| **No inferred intent** | ✅ ⚡ |
| **No ranking of importance** | ✅ ⚡ |
| **No emotional metadata** | ✅ ⚡ |

---

## 2) KNOWLEDGE THREADS — INTER-SPHERE ENGINE ⚡

### Purpose
> **Link information across spheres WITHOUT blending domains.**

### RULE
> **Cross-sphere = CONNECTION, NOT MERGING.**

### 4 Cross-Sphere Link Types ⚡
| Type | Example |
|------|---------|
| **TYPE 1 — TOPIC ALIGNMENT** | Scholar research ↔ Business project ⚡ |
| **TYPE 2 — ARTIFACT REUSE** | Creative sprite reused in XR scene ⚡ |
| **TYPE 3 — DECISION IMPACT** | **Institution compliance → Business workflow** ⚡ |
| **TYPE 4 — MEMORY REFLECTION** | **Collective memory node referenced by another sphere** ⚡ |

### Engine Logic ⚡
> **IF two nodes share:** identical topic tag, OR artifact hash match, OR temporal sequence, **THEN propose a ThreadLink (requires user approval).**

### Intersphere Thread JSON ⚡
```json
{
  "intersphere_thread": {
    "id": "uuid",
    "root_sphere": "string",
    "linked_spheres": ["sphere_a", "sphere_b"],
    "nodes": ["..."],
    "links": ["..."],
    "user_approved": true
  }
}
```

### Safety ⚡
| Rule | Status |
|------|--------|
| **No automatic expansion** | ✅ ⚡ |
| **User permission required for each link** | ✅ ⚡ |
| **Thread complexity capped** | ✅ ⚡ |
| **Visibility follows sphere permissions** | ✅ ⚡ |

---

## 3) KNOWLEDGE THREADS — PERSONAL ↔ COLLECTIVE MAPPING ⚡

### Purpose
> **Align a user's PERSONAL knowledge with the system's COLLECTIVE memory without pressuring conformity.**

### RULE
> **Two memories coexist: Personal = subjective workspace, Collective = objective trace.**

### Personal Threads ⚡
| Content | Description |
|---------|-------------|
| bookmarks | ⚡ |
| highlights | ⚡ |
| custom titles | ⚡ |
| **private notes** | ⚡ |

> **NEVER auto-shared.**

### Collective Threads ⚡
| Content | Description |
|---------|-------------|
| **replay-verified events** | ⚡ |
| **official decisions** | ⚡ |
| **shared artifacts** | ⚡ |

### 3 Mapping Cases ⚡ (NOUVEAU!)
| Case | Condition | Badge |
|------|-----------|-------|
| **Case A** | Personal node matches collective hash | **"verified"** ⚡ |
| **Case B** | Personal node has no match | **"private insight"** ⚡ |
| **Case C** | Collective node exists but user didn't map | **"unreviewed"** ⚡ |

### Mapping JSON ⚡
```json
{
  "thread_mapping": {
    "user_id": "uuid",
    "personal_thread": "uuid",
    "collective_matches": ["node_a", "node_b"],
    "private_nodes": ["node_c"],
    "unreviewed_nodes": ["node_d"]
  }
}
```

---

## 4) EXPORTATION DE CONTENU CHE·NU ⚡ (NOUVEAU!)

### Purpose
> **Share Che-Nu data with external tools (Notion, Google Drive, ClickUp, Slack, Jira, XR platforms, etc.) WITHOUT exposing internal logic, agents, or private memory.**

### RULE
> **Export = TRANSFORMATION, NOT MIRRORING. Che-Nu NEVER sends raw system data.**

### 4 Export Modes ⚡
| Mode | Output | Details |
|------|--------|---------|
| **MODE 1 — DOCUMENT** | PDF, Markdown, JSON, **.xrpack** | ⚡ |
| **MODE 2 — TASK** | task summary → ClickUp/Jira | **no replay timeline, no private metadata** ⚡ |
| **MODE 3 — ARTIFACT** | files → Drive, images → Creative, summaries → Notion | ⚡ |
| **MODE 4 — THREAD** | **optional + anonymized**, only collective nodes, **hashed references** | ⚡ |

### 8-Step Export Pipeline ⚡ (NOUVEAU!)

| Step | Description |
|------|-------------|
| **1)** | Permission check ⚡ |
| **2)** | Extract allowed content ⚡ |
| **3)** | **Remove internal logic** ⚡ |
| **4)** | **Remove agent logs** ⚡ |
| **5)** | Replace internal IDs with export-safe IDs ⚡ |
| **6)** | Hash integrity ⚡ |
| **7)** | Format transform ⚡ |
| **8)** | Push via connector (API) ⚡ |

**OUTPUT:**
- export_file (.pdf/.md/.json/.xrpack)
- receipt hash
- **revocation link**

### Export Request JSON ⚡
```json
{
  "export_request": {
    "source_type": "meeting|thread|artifact",
    "source_id": "uuid",
    "format": "pdf|md|json|xrpack",
    "scope": "collective_only|include_personal",
    "target_service": "notion|gdrive|clickup|jira|local",
    "user_confirmed": true
  }
}
```

---

## SECURITY & PRIVACY WALL ⚡

| Rule | Status |
|------|--------|
| **No agent behavior exported** | ✅ ⚡ |
| **No personal memory exported by default** | ✅ ⚡ |
| **No sphere-internal logic exported** | ✅ ⚡ |
| **No replay video/audio exported without explicit consent** | ✅ ⚡ |
| **All exports include a neutral metadata header** | ✅ ⚡ |
| **Export watermark option for investor/outside partners** | ✅ ⚡ |

---

**END — FREEZE READY**
