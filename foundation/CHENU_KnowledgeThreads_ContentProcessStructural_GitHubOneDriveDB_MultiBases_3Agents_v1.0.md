# CHE·NU — KNOWLEDGE THREAD SYSTEM
**VERSION:** KT.v1.0  
**TYPE:** INFORMATION ARCHITECTURE / NON-INTERPRETATIVE

---

## PURPOSE ⚡

> **Provide a stable, traceable, multi-layer knowledge system that connects:** user documents, sphere-specific data, enterprise data, external platforms (GitHub, OneDrive, DBs) **WITHOUT rewriting meaning or generating assumptions.**

### RULE
> **A Knowledge Thread = LINKED FACTS, not interpretations.**

---

## KNOWLEDGE THREAD — CORE DEFINITION ⚡

> **A Knowledge Thread is a multi-source, multi-node chain of related information that spans:**

| # | Type |
|---|------|
| 1 | **Content Threads** |
| 2 | **Process Threads** |
| 3 | **Structural Threads** |

### Thread Properties ⚡
| Property | Description |
|----------|-------------|
| **immutable references** | ⚡ |
| **timestamped nodes** | ⚡ |
| **cryptographic chain** | ⚡ |
| **origin mapping** | ⚡ |
| **context tags (sphere / enterprise / document type)** | ⚡ |
| **merge-safe** | ⚡ |

---

## THREAD TYPE 1 — CONTENT THREAD ⚡

### Purpose
> **Connect factual information across sources.**

### Example ⚡
```
Proposal.docx → Meeting Notes → Repository Readme → XR Replay decision log
```

### Content Thread Nodes ⚡
| Node | Description |
|------|-------------|
| documents (any provider) | ⚡ |
| messages | ⚡ |
| meeting artifacts | ⚡ |
| code references | ⚡ |
| **AI outputs (versioned + hashed)** | ⚡ |
| attachments | ⚡ |

### Content Thread JSON ⚡
```json
{
  "content_thread": {
    "id": "uuid",
    "nodes": [
      { "type": "file", "source": "onedrive|github|db", "path": "..." },
      { "type": "note", "source": "che-nu", "id": "..." },
      { "type": "decision", "replay": "...", "timestamp": "..." }
    ],
    "sphere": "business|scholar|...",
    "hash": "sha256",
    "version": 1
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **no rewriting content** | ✅ ⚡ |
| **no emotional metadata** | ✅ ⚡ |
| **no inferred meaning** | ✅ ⚡ |

---

## THREAD TYPE 2 — PROCESS THREAD ⚡

### Purpose
> **Track the procedural flow of actions, without judgment.**

### Example ⚡
```
User uploads → agent organizes → meeting occurs → decision logged → replay exported
```

### Process Thread Nodes ⚡
| Node | Description |
|------|-------------|
| actions | ⚡ |
| agents involved | ⚡ |
| **workflow steps** | ⚡ |
| session events | ⚡ |
| task statuses | ⚡ |

### Process Thread JSON ⚡
```json
{
  "process_thread": {
    "id": "uuid",
    "steps": [
      { "action": "upload", "by": "user", "timestamp": "..." },
      { "action": "organize", "by": "agent", "timestamp": "..." },
      { "action": "review", "by": "team", "timestamp": "..." }
    ],
    "related_content_thread": "uuid",
    "hash": "sha256"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **no prioritization** | ✅ ⚡ |
| **purely descriptive** | ✅ ⚡ |

---

## THREAD TYPE 3 — STRUCTURAL THREAD ⚡

### Purpose
> **Organize how data is grouped, categorized, inherited across spheres or enterprises.**

### Example ⚡
```
Business Sphere → Company → Project → Task → File
```

### Structural Thread Nodes ⚡
| Node | Description |
|------|-------------|
| hierarchy layers | ⚡ |
| **mapping rules** | ⚡ |
| inheritance points | ⚡ |
| **cluster assignments** | ⚡ |

### Structural Thread JSON ⚡
```json
{
  "structural_thread": {
    "id": "uuid",
    "structure": [
      { "layer": "sphere", "value": "business" },
      { "layer": "enterprise", "value": "Company A" },
      { "layer": "project", "value": "Build System" }
    ],
    "constraints": [],
    "hash": "sha256"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **no auto-restructuring** | ✅ ⚡ |
| **structural changes require explicit confirmation** | ✅ ⚡ |

---

## EXTERNAL CONNECTORS ⚡ (NOUVEAU!)

### Supported Integrations ⚡
| Platform | Status |
|----------|--------|
| **GitHub Repositories** | ✅ ⚡ |
| **OneDrive Drives / Shared Folders** | ✅ ⚡ |
| **Local SQL / NoSQL DBs** | ✅ ⚡ |
| **S3-like storage** | ✅ ⚡ |
| **Custom APIs** | ✅ ⚡ |

### All Connectors Share ⚡
| Property | Description |
|----------|-------------|
| **unified metadata schema** | ⚡ |
| **hashed file states** | ⚡ |
| **version snapshots** | ⚡ |
| **read-only by default (write optional)** | ⚡ |

---

### GITHUB CONNECTOR ⚡

| Feature | Description |
|---------|-------------|
| branch monitoring | ⚡ |
| **commit linking to content threads** | ⚡ |
| **pull request → process thread steps** | ⚡ |
| code mapping → structural thread anchors | ⚡ |

```json
{
  "github_connector": {
    "repo": "user/repo",
    "branch": "main",
    "watch_paths": ["/docs", "/src"],
    "link_to_thread": "content|process"
  }
}
```

---

### ONEDRIVE CONNECTOR ⚡

| Feature | Description |
|---------|-------------|
| document ingestion | ⚡ |
| **folder → structural mapping** | ⚡ |
| sync-only mode | ⚡ |
| **file change logs → process thread updates** | ⚡ |

```json
{
  "onedrive_connector": {
    "drive_id": "...",
    "paths": ["/che-nu", "/projects"],
    "link_to": "content_thread"
  }
}
```

---

### DATABASE CONNECTOR ⚡

| Feature | Description |
|---------|-------------|
| **table → structural nodes** | ⚡ |
| row-level timestamps | ⚡ |
| **schema changes tracked as process events** | ⚡ |

```json
{
  "database_connector": {
    "type": "postgres|mongo|sqlite",
    "tables": ["users", "tasks", "notes"],
    "thread_link": "structural_thread"
  }
}
```

---

## MULTI-BASE KNOWLEDGE ARCHITECTURE ⚡ (NOUVEAU!)

### Users can define ⚡
| Base | Description |
|------|-------------|
| **personal knowledge base** | ⚡ |
| **enterprise knowledge base** | ⚡ |
| **sphere-specific base** | ⚡ |
| **"incoming documents" base** | ⚡ |
| **"organized" base** | ⚡ |
| **"compressed" base** | ⚡ |

> **Each base = isolated knowledge root with its own threads.**

### Knowledge Bases JSON ⚡
```json
{
  "knowledge_bases": [
    { "id": "personal", "root": "~/.che-nu/personal" },
    { "id": "business_A", "root": "/enterprises/A/base" },
    { "id": "scholar", "root": "/spheres/scholar" },
    { "id": "incoming", "root": "/inbox" },
    { "id": "condensed", "root": "/compressed_view" }
  ]
}
```

---

## KNOWLEDGE ROUTING BETWEEN BASES ⚡

### Allowed ⚡
| Action | Status |
|--------|--------|
| linking nodes | ✅ ⚡ |
| cross-references | ✅ ⚡ |
| **content sharing (explicit)** | ✅ ⚡ |
| **inheritance of structural rules** | ✅ ⚡ |

### Forbidden ⚡
| Action | Status |
|--------|--------|
| **automatic merging** | ❌ ⚡ |
| **content rewriting** | ❌ ⚡ |
| **cross-base inference** | ❌ ⚡ |

---

## USER CONFIGURATION ⚡

```json
{
  "knowledge_config": {
    "default_base": "personal",
    "per_sphere": {
      "business": "business_A",
      "scholar": "scholar",
      "creative": "personal",
      "institution": "condensed"
    },
    "auto_threading": true,
    "auto_snapshot": true
  }
}
```

---

## 3 AGENT ROLES ⚡

| Agent | Role |
|-------|------|
| `AGENT_KNOWLEDGE_ROUTER` | connects content across bases, **never infers meaning** ⚡ |
| `AGENT_KNOWLEDGE_ORGANIZER` | sorts into correct base, **maintains structural rules** ⚡ |
| `AGENT_KNOWLEDGE_AUDITOR` | ensures no accidental mixing, **checks hash integrity** ⚡ |

---

## WHY THIS SYSTEM WORKS ⚡

| Reason | Description |
|--------|-------------|
| **Clear separation** | content, process, structure ⚡ |
| **Safe multi-source routing** | ⚡ |
| **GitHub / OneDrive fully harmonized** | ⚡ |
| **Zero manipulation** | ⚡ |
| **Perfect foundation for XR memory + universe view** | ⚡ |

---

**END — FREEZE READY**
