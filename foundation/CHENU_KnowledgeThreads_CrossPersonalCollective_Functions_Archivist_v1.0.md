# CHE·NU — KNOWLEDGE THREADS (3-LAYER SYSTEM)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## OVERVIEW

> **Knowledge Threads = structural connections** between information, experiences, decisions, artifacts, and spheres.

### RULE
> **Threads REVEAL relationships. They DO NOT infer meaning, intent, or hierarchy.**

### 3 TYPES ⚡
1. Cross-Sphere Threads
2. Personal Knowledge Threads
3. Collective Knowledge Threads

---

## 1) CROSS-SPHERE KNOWLEDGE THREADS

### Purpose
Connect related information across **SPHERES** (Business ↔ Scholar ↔ Creative ↔ XR ↔ Institutions).

### Examples ⚡
- A Business meeting referencing a Scholar document
- A Creative asset used in a Social publication
- **An XR Replay linked to an Institutional policy** ⚡

### RULE
> **Cross-Sphere Threads = informational bridges only.**

### Thread Model JSON ⚡

```json
{
  "cross_sphere_thread": {
    "id": "uuid",
    "from_sphere": "business|creative|social|scholar|xr|institution",
    "to_sphere": "business|creative|social|scholar|xr|institution",
    "source_item": "uuid",
    "target_item": "uuid",
    "reason": "shared_topic|shared_artifact|timeline|agent_reference",
    "confidence": "0.0-1.0",
    "hash": "sha256"
  }
}
```

### Cross Fields ⚡
| Field | Description |
|-------|-------------|
| `reason` | **shared_topic/shared_artifact/timeline/agent_reference** ⚡ |
| `confidence` | **0.0-1.0 float** ⚡ |

### Rendering in Universe View ⚡

**VISUAL:**
- thin neutral lines
- **color-coded by sphere** ⚡
- **no directional influence** ⚡

**INTERACTIONS:**
- expand/collapse
- isolate thread
- **show thread provenance** ⚡

**GUARDS:**
- no auto-follow
- **no suggestions without user request** ⚡

---

## 2) PERSONAL KNOWLEDGE THREADS ⚡

### Purpose
Provide each user with **THEIR OWN map of meaning**, derived from: what they viewed, what they created, what they linked, what they bookmarked

### RULE
> **Purely personal overlays. Never shared unless explicitly exported.**

### Thread Model JSON ⚡

```json
{
  "personal_knowledge_thread": {
    "user_id": "uuid",
    "id": "uuid",
    "items": ["uuid1", "uuid2", "uuid3"],
    "thread_type": "learning|creative|decision|archive",
    "visual_weight": "0.1-1.0",
    "notes": "optional",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

### Personal Fields ⚡
| Field | Description |
|-------|-------------|
| `thread_type` | **learning/creative/decision/archive** ⚡ |
| `visual_weight` | **0.1-1.0 float** ⚡ |
| `notes` | **optional user notes** ⚡ |

### Functions ⚡

**USER CAN:**
| Action | Status |
|--------|--------|
| create thread from XR replay scenes | ✅ ⚡ |
| link documents manually | ✅ |
| group tasks across spheres | ✅ ⚡ |
| reorder items | ✅ |
| **export as PDF / Storyline** | ⚡ |

**SYSTEM CAN:**
| Action | Status |
|--------|--------|
| update order (if user requests) | ✅ |
| **highlight thread consistency (only structural)** | ⚡ |

**SYSTEM CANNOT:**
| Forbidden | Status |
|-----------|--------|
| **infer emotional value** | ❌ ⚡ |
| **suggest "better" arrangement** | ❌ ⚡ |

---

## 3) COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
Show how the "ecosystem mind" of Che-Nu evolves: shared decisions, shared artifacts, multi-agent workflows, multi-sphere projects

> **These threads represent verified, non-interpreted links.**

### RULE
> **Collective Threads = SHARED STRUCTURE. NOT collective psychology.**

### Thread Model JSON ⚡

```json
{
  "collective_knowledge_thread": {
    "id": "uuid",
    "scope": "team|sphere|organization",
    "items": ["uuid1", "uuid2"],
    "reason": "co-creation|co-reference|co-timing",
    "timestamp": 1712345678,
    "integrity_hash": "sha256",
    "visibility": "public|restricted"
  }
}
```

### Collective Fields ⚡
| Field | Description |
|-------|-------------|
| `scope` | **team/sphere/organization** ⚡ |
| `reason` | **co-creation/co-reference/co-timing** ⚡ |
| `visibility` | **public/restricted** ⚡ |

### Use Cases ⚡
- multi-team projects
- recurring cross-sphere topics
- **institutional compliance pathways** ⚡
- **XR meeting clusters** ⚡

### Safety Features ⚡
| Feature | Status |
|---------|--------|
| **anonymization available** | ✅ ⚡ |
| **visible audit log** | ✅ ⚡ |
| **no trend interpretation** | ✅ ⚡ |
| **no "collective sentiment"** | ✅ ⚡ |

---

## THREADS IN XR & UNIVERSE VIEW ⚡

### XR ⚡
- visible as **floating "memory strings"** ⚡
- optional fade-in on demand
- **selectable nodes reveal provenance** ⚡

### Universe View ⚡
- threads appear as curved paths between nodes
- **color-coded by thread type** ⚡
- can be layered or filtered

### 2D Mode ⚡
- simple timeline or diagram view

---

## AGENTS RESPONSIBLE ⚡

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | **constructs threads on request, never auto-links meaning** ⚡ |
| `AGENT_THREAD_ARCHIVIST` | **maintains integrity, versioning, audit** ⚡ |
| `AGENT_THREAD_RENDERER` | **visual layer, no interpretation** ⚡ |
| `AGENT_THREAD_EXPLAINER` | **explains why a thread exists, text-only, factual** ⚡ |

---

## EXPORT & IMPORT ⚡

### EXPORT ⚡
| Format | Description |
|--------|-------------|
| **PDF** | thread summary ⚡ |
| **JSON bundle** | ⚡ |
| **XR scene** | **with selectable nodes** ⚡ |

### IMPORT ⚡
| Requirement | Status |
|-------------|--------|
| **structural validation** | ✅ ⚡ |
| **hash check** | ✅ ⚡ |
| **no merging without user consent** | ✅ ⚡ |

---

## WHY THE 3 THREADS MATTER ⚡

| Thread | Clarity For |
|--------|-------------|
| **Cross-Sphere** | → ORGANIZATIONAL clarity ⚡ |
| **Personal Threads** | → USER clarity ⚡ |
| **Collective Threads** | → TEAM clarity ⚡ |

> **All 3 together = a multi-layered knowledge fabric without prediction, persuasion, or interpretation.**

---

**END — FREEZE READY**
