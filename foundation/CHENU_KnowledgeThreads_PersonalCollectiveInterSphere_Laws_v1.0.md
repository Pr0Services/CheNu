# CHE·NU — KNOWLEDGE THREADS SYSTEM (PERSONAL/COLLECTIVE/INTER-SPHERE + LAWS)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / APPEND-ONLY

---

## GLOBAL DEFINITION

> A Knowledge Thread is a **TRACEABLE chain** of facts, artifacts, meetings, decisions, and replays linked over time **WITHOUT interpretation.**

### RULE
> **Thread = CONNECTIVITY, not conclusion.**

---

## THREAD TYPES

| # | Type | Scope |
|---|------|-------|
| 1 | PERSONAL KNOWLEDGE THREAD | Single user |
| 2 | COLLECTIVE KNOWLEDGE THREAD | Team/org |
| 3 | INTER-SPHERE KNOWLEDGE THREAD | Cross-sphere |

> **All share same laws, different scopes.**

---

## COMMON LAWS (ALL THREADS) ⚡

| Law | Status |
|-----|--------|
| append-only | ✅ |
| immutable after validation | ✅ |
| time-ordered | ✅ |
| **cryptographically hashed** | ✅ ⚡ |
| **replay-source anchored** | ✅ ⚡ |
| no sentiment | ✅ |
| no scoring | ✅ |
| **no "success/failure"** | ✅ ⚡ |

---

## 1) PERSONAL KNOWLEDGE THREAD

### Scope
Single user, **private by default.**

### Purpose
Help a user reconnect context across time **without losing clarity or privacy.**

### Sources
- user meetings, user notes, selected replays, user decisions, personal artifacts

### Visibility ⚡
| Rule | Status |
|------|--------|
| **owner only** | ✅ ⚡ |
| **explicit sharing required** | ✅ ⚡ |

### Personal Thread JSON (with sealed flag) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "personal",
    "owner": "user_id",
    "entries": [
      {
        "ref": "meeting|replay|artifact|decision",
        "id": "uuid",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ],
    "sealed": false
  }
}
```

### Personal Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `owner` | **user_id** ⚡ |
| `entries[].ref` | **meeting/replay/artifact/decision** ⚡ |
| `sealed` | **Boolean - can be sealed** ⚡ |

---

## 2) COLLECTIVE KNOWLEDGE THREAD

### Scope
Team, organization, or shared group.

### Purpose
Preserve factual continuity of shared work **without narrative drift.**

### Sources ⚡
- validated XR replays, shared decisions, official artifacts, **agent trace actions** ⚡

### Visibility ⚡
| Type | Description |
|------|-------------|
| **role-based** | ⚡ |
| **sphere-based** | ⚡ |

### Constraints ⚡
| Constraint | Status |
|------------|--------|
| **anonymization available** | ✅ ⚡ |
| **no private spillover** | ✅ ⚡ |

### Collective Thread JSON (with participants + sealed) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "collective",
    "sphere": "business|scholar|xr|...",
    "entries": [
      {
        "ref": "decision|artifact|replay",
        "id": "uuid",
        "timestamp": 1712345678,
        "participants": ["user|agent"],
        "hash": "sha256"
      }
    ],
    "sealed": true
  }
}
```

### Collective Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `entries[].participants` | **["user\|agent"]** ⚡ |
| `sealed` | **true - immutable** ⚡ |

---

## 3) INTER-SPHERE KNOWLEDGE THREAD

### Scope
Multiple spheres, same topic or objective.

### Purpose
Connect knowledge **WITHOUT merging domains.**

### Rules ⚡
| Rule | Status |
|------|--------|
| **no data fusion** | ✅ ⚡ |
| **references only** | ✅ ⚡ |
| **pointers across spheres** | ✅ ⚡ |

### Sources
- cross-sphere decisions, shared artifacts, sequential meetings

### Inter-Sphere Thread JSON (with linked_spheres + per-entry sphere) ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "inter_sphere",
    "linked_spheres": ["business","scholar","xr"],
    "entries": [
      {
        "sphere": "business",
        "ref_id": "uuid",
        "timestamp": 1712345678,
        "hash": "sha256"
      }
    ]
  }
}
```

### Inter-Sphere Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `type` | **"inter_sphere"** ⚡ |
| `linked_spheres` | **Array of spheres** ⚡ |
| `entries[].sphere` | **Per-entry sphere** ⚡ |
| `entries[].ref_id` | **UUID reference** ⚡ |

---

## THREAD OPERATIONS ⚡

### Allowed ⚡
| Operation | Description |
|-----------|-------------|
| `create_thread` | Create new |
| `append_entry` | Add entry |
| `seal_thread` | **Optional seal** ⚡ |
| `fork_thread` | **Reference-only** ⚡ |
| `export_thread` | **pdf / graph / json** ⚡ |
| `audit_thread` | **Integrity only** ⚡ |

### NO: ⚡
- **edit past entries**
- **reorder timeline**
- **merge threads silently**

---

## UNIVERSE VIEW INTEGRATION

| Property | Value |
|----------|-------|
| Appearance | **threads appear as LIGHT LINES** ⚡ |
| Thickness | = entry count |
| Color | = thread type |
| Selection | **selectable without auto-focus** ⚡ |
| AI | **never prioritized by AI** ⚡ |

---

## AGENTS (PASSIVE)

| Agent | Role |
|-------|------|
| `AGENT_THREAD_INDEXER` | indexes entries, no interpretation |
| `AGENT_THREAD_GUARD` | verifies immutability, **reports violations** ⚡ |
| `AGENT_THREAD_EXPORTER` | prepares exports, **no content alteration** ⚡ |

---

## WHY 3 THREADS

| Thread | Provides |
|--------|----------|
| **Personal** | continuity of self |
| **Collective** | continuity of work |
| **Inter-Sphere** | continuity of knowledge |

> **Same truth. Different scopes. No distortion.**

---

**END — FOUNDATION FREEZE**
