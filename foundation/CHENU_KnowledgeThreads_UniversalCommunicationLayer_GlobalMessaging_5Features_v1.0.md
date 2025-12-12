# CHE·NU — KNOWLEDGE THREADS x UNIVERSAL COMMUNICATION LAYER
**VERSION:** CORE.v2.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / CLAUDE-READY

---

## 1) KNOWLEDGE THREADS — FOUNDATION ⚡

### Purpose
> **Represent the flow of knowledge across time, spheres, agents, documents, meetings, and users as CONTINUOUS THREADS.**

### RULE
> **A Thread = A VERIFIED chain of context. Not narrative. Not opinion. Not interpretation.**

### 5 Thread Element Types ⚡
| Type | Description |
|------|-------------|
| `THREAD_EVENT` | an action or update ⚡ |
| `THREAD_ARTIFACT` | a document, file, board, contract, message ⚡ |
| `THREAD_DECISION` | **timestamped outcome (no emotion / no judgment)** ⚡ |
| `THREAD_CONTEXT` | sphere, participants, XR room, meeting id ⚡ |
| `THREAD_REFERENCE` | **link to related threads** ⚡ |

### Thread Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **cross-sphere linking allowed** | ✅ ⚡ |
| **thread never reinterprets content** | ✅ ⚡ |
| **no emotional metadata** | ✅ ⚡ |
| **no predicted future states** | ✅ ⚡ |

---

## 2) KNOWLEDGE THREADS — INTER-SPHERE ENGINE ⚡

### Purpose
> **Allow a single topic to naturally extend across multiple spheres** (Ex: Business ↔ Scholar ↔ Institution ↔ XR)

### Engine Role ⚡
Map relationships using FACTUAL adjacency: shared participants, shared documents, shared decisions, shared artifacts, chronological proximity.

### 4 Inter-Sphere Link Types ⚡
| Type | Description |
|------|-------------|
| `LINK_SHARED_TOPIC` | threads referring to same subject ⚡ |
| `LINK_DEPENDENCY` | **one thread requires outputs from another** ⚡ |
| `LINK_CONSEQUENCE` | **decision in Sphere A triggers update in Sphere B** ⚡ |
| `LINK_ARCHIVAL` | **long-term storage of multi-sphere continuity** ⚡ |

### Safety Guarantees ⚡
| Rule | Status |
|------|--------|
| **no influence on decisions** | ✅ ⚡ |
| **no ranking of thread importance** | ✅ ⚡ |
| **no predictions** | ✅ ⚡ |
| **no authority weighting** | ✅ ⚡ |

---

## 3) PERSONAL ↔ COLLECTIVE KNOWLEDGE THREADING ⚡

### Personal Thread View ⚡
| Shows | Hides |
|-------|-------|
| user-relevant events | irrelevant spheres |
| user-participated meetings | **private threads of others** |
| personal artifacts | |
| bookmarked nodes | |

### Personalization JSON ⚡
```json
{
  "thread_view_profile": {
    "user_id": "uuid",
    "filters": {
      "spheres": ["business", "scholar"],
      "density": 0.7,
      "timeline_window": "90d"
    },
    "mode": "personal|collective"
  }
}
```

---

## 4) UNIVERSAL COMMUNICATION LAYER FOR EACH SPHERE ⚡ (NOUVEAU!)

### Purpose
> **Every sphere needs integrated, organized communication tools that automatically structure themselves inside Knowledge Threads.**

### 5 Communication Features Per Sphere ⚡
| Feature | Description |
|---------|-------------|
| **EMAIL** | internal + external, auto-thread integration, contract attachments ⚡ |
| **CALLS** | audio logs, meeting summaries, **timestamps only** ⚡ |
| **MESSAGES** | private, group, **sphere-specific public channels** ⚡ |
| **CONTRACTS & AGREEMENTS** | signed PDFs, decision logs, **versioned** ⚡ |
| **REMINDERS & FOLLOW-UPS** | per-user, per-thread, **per-sphere** ⚡ |

### Communication Item JSON ⚡
```json
{
  "communication_item": {
    "id": "uuid",
    "type": "email|message|call|contract|reminder",
    "sphere": "string",
    "timestamp": "...",
    "participants": ["..."],
    "content": {},
    "thread_id": "uuid"
  }
}
```

### Key Rule ⚡
> **Every communication item automatically becomes a THREAD_EVENT or THREAD_ARTIFACT.**

---

## 5) GLOBAL CHE·NU MESSAGING SYSTEM (INTER-USER) ⚡ (NOUVEAU!)

### Purpose
> **Cross-sphere, cross-user messaging that maintains clarity without social feed manipulation.**

### 5 Features ⚡
| Feature | Description |
|---------|-------------|
| **THREADED CHAT** | by sphere, by project, by topic, **by agent** ⚡ |
| **PRIVATE MESSAGES** | **encrypted end-to-end** ⚡ |
| **GEO-MESSAGES** | optional, **attach location to a thread** ⚡ |
| **VOICE NOTES** | timestamped, **transcript-cleaned (no tone interpretation)** ⚡ |
| **DOCUMENT DROPBOX** | automatic versioning, **integrated into artifact threads** ⚡ |

### Global Chat JSON ⚡
```json
{
  "global_chat": {
    "channels": [
      {
        "id": "uuid",
        "sphere": "business|creative|...",
        "members": ["..."],
        "messages": ["..."]
      }
    ],
    "private_messages": ["..."],
    "thread_links": ["..."]
  }
}
```

### Safety & Ethics ⚡
| Rule | Status |
|------|--------|
| **No feed algorithms** | ✅ ⚡ |
| **No priority weighting** | ✅ ⚡ |
| **No nudging** | ✅ ⚡ |
| **No emotional scoring** | ✅ ⚡ |
| **Transparent filters** | ✅ ⚡ |

---

## WHY THIS WORKS ⚡

| Component | = |
|-----------|---|
| **Knowledge Threads** | structured truth continuity |
| **Universal Communication** | clean, predictable information flow |

### Together ⚡
> **Clarity × Context × Continuity WITHOUT persuasion or noise.**

---

**END — FROZEN & READY FOR BUILD MODE**
