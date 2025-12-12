# CHE·NU — KNOWLEDGE THREADS SYSTEM (3-LAYER MODEL)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## 1) INTER-SPHERE KNOWLEDGE THREADS

### Purpose
Create factual, traceable links between information that lives in different spheres (Business, Scholar, Social, Creative, Institution, Methodology, XR, etc.) **WITHOUT merging contexts or creating bias.**

### RULE
> **Thread = LINK, NOT MEANING.**

### Thread Triggers ⚡
A thread is created **ONLY when:**
| Trigger | Description |
|---------|-------------|
| **two artifacts reference the same factual element** | ⚡ |
| **two meetings share validated decision context** | ⚡ |
| **an agent produces a cross-sphere report** | ⚡ |
| **a user explicitly requests cross-linking** | ⚡ |

> **Never automatically inferred from sentiment or narrative.**

### Inter-Sphere Thread JSON ⚡

```json
{
  "knowledge_thread_inter": {
    "id": "uuid",
    "from_sphere": "business",
    "to_sphere": "scholar",
    "anchors": [
      { "artifact_id": "A1", "type": "document" },
      { "artifact_id": "B3", "type": "note" }
    ],
    "reason": "shared_fact",
    "timestamp": 1712345678,
    "hash": "sha256"
  }
}
```

### Inter Fields ⚡
| Field | Description |
|-------|-------------|
| `anchors[].type` | **document/note/etc.** ⚡ |
| `reason` | **"shared_fact"** ⚡ |

### Visualization (Universe View) ⚡
| Property | Value |
|----------|-------|
| **soft line (neutral color)** | ⚡ |
| **thickness = number of anchors** | ⚡ |
| **label: factual, not descriptive** | ⚡ |
| **expand/collapse on demand** | ⚡ |

> **No emphasised importance, no ranking.**

---

## 2) PERSONAL KNOWLEDGE THREADS

### Purpose
Allow each user to build their **OWN mental map** of connections between concepts, documents, meetings, and spheres — **without altering shared/global data.**

### RULE
> **Personal threads = PRIVATE. They NEVER influence AI routing or collective memory.**

### User Actions That Create Personal Threads ⚡
| Action | Description |
|--------|-------------|
| **bookmark two items as "related"** | ⚡ |
| **annotate link manually** | ⚡ |
| **revisit same concept across spheres** | ⚡ |
| **create personal study path** | ⚡ |

### Personal Thread JSON ⚡

```json
{
  "knowledge_thread_personal": {
    "id": "uuid",
    "user_id": "uuid",
    "items": ["artifact_id","meeting_id","concept_id"],
    "note": "User's personal relation",
    "visibility": "private",
    "updated_at": "timestamp"
  }
}
```

### Personal Fields ⚡
| Field | Description |
|-------|-------------|
| `items` | **Array of mixed IDs** ⚡ |
| `note` | **User's personal relation** ⚡ |
| `visibility` | **"private"** ⚡ |

### UI Mode (Personal Map Layer) ⚡
| Feature | Description |
|---------|-------------|
| **client-side only rendering** | ⚡ |
| **collapsible category clusters** | ⚡ |
| **time-based navigation (thread history)** | ⚡ |
| **export PDF optional** | ⚡ |

---

## 3) COLLECTIVE KNOWLEDGE THREAD FABRIC ⚡

### Purpose
Aggregate **INTER-SPHERE** threads (never personal) to reveal the structural layout of the project, organization, or ecosystem.

### RULE
> **Fabric = STRUCTURE, not meaning. Shows WHAT IS CONNECTED, not WHY or HOW.**

### Fabric Components ⚡

**THREAD_NODES:**
- spheres
- validated artifacts
- stable decisions
- **replay anchors** ⚡

**THREAD_EDGES:**
- cross-sphere factual links
- validated timestamps
- **replay-backed anchors** ⚡

**FABRIC_PROPERTIES:**
| Property | Description |
|----------|-------------|
| `density` | ⚡ |
| `stability` | ⚡ |
| `recency` | ⚡ |
| `integrity_hash` | ⚡ |

### Fabric JSON Model ⚡

```json
{
  "knowledge_fabric": {
    "threads": ["thread_id_1","thread_id_2", "..."],
    "metadata": {
      "density": 0.72,
      "stability": 0.91,
      "integrity_hash": "sha256"
    },
    "updated_at": "timestamp"
  }
}
```

### Fabric Fields ⚡
| Field | Description |
|-------|-------------|
| `metadata.density` | **0.0-1.0 float** ⚡ |
| `metadata.stability` | **0.0-1.0 float** ⚡ |

### Fabric Evolution Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **versioned** | ✅ ⚡ |
| **threads expire only with explicit revocation** | ✅ ⚡ |
| **no inferred nodes or edges** | ✅ ⚡ |
| **collective memory reference required** | ✅ ⚡ |

---

## ETHICAL LOCKS (ALL THREAD SYSTEMS) ⚡

| Lock | Status |
|------|--------|
| **No prediction** | ✅ ⚡ |
| **No narrative shaping** | ✅ ⚡ |
| **No semantic inference** | ✅ ⚡ |
| **No psychological modeling** | ✅ ⚡ |
| **No "importance ranking"** | ✅ ⚡ |
| **No hidden edges** | ✅ ⚡ |

> **Threads expose STRUCTURE, not interpretation.**

---

## WHY THESE 3 THREAD SYSTEMS FIT CHE·NU ⚡

| System | Purpose |
|--------|---------|
| **Inter-sphere threads** | → shared truth ⚡ |
| **Personal threads** | → personal understanding ⚡ |
| **Collective fabric** | → global structure ⚡ |

### ALL Three Comply With ⚡
- immutability rules
- non-manipulative design
- clarity-first architecture
- **XR + 2D compatibility** ⚡
- **freeze-compliant schema** ⚡

---

**END — KNOWLEDGE THREAD BLOCK (READY TO BUILD)**
