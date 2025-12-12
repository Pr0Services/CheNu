# CHE·NU — KNOWLEDGE THREAD SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## 1) PERSONAL KNOWLEDGE THREADS ⚡

### Purpose
> **Track connections between a user's own data, actions, meetings, notes, and artifacts — WITHOUT inference.**

### RULE
> **Personal Threads = factual links only.**

### Personal Thread JSON ⚡
```json
{
  "personal_thread": {
    "id": "uuid",
    "owner": "user_id",
    "anchors": [
      { "type": "meeting", "id": "uuid" },
      { "type": "note", "id": "uuid" },
      { "type": "artifact", "id": "uuid" }
    ],
    "links": [
      { "from": "anchorA", "to": "anchorB", "reason": "explicit_reference" }
    ],
    "created_at": "...",
    "updated_at": "...",
    "visibility": "private"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **no auto-generation** | ✅ ⚡ |
| **no hidden inference** | ✅ ⚡ |
| **user-created or agent-documented only** | ✅ ⚡ |

---

## 2) COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
> **Reveal shared factual relationships across many users, teams, or agents — only when explicitly published.**

### RULE
> **Collective Threads = MERGED FACTS. Never aggregated meaning.**

### Collective Thread JSON ⚡
```json
{
  "collective_thread": {
    "id": "uuid",
    "contributors": ["user_id", "agent_id"],
    "anchors": [
      { "type": "decision", "id": "uuid" },
      { "type": "artifact", "id": "uuid" },
      { "type": "replay", "id": "uuid" }
    ],
    "links": [
      { "from": "uuid", "to": "uuid", "reason": "is_related_to" }
    ],
    "integrity_hash": "sha256",
    "visibility": "team|sphere|public"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **opt-in contribution only** | ✅ ⚡ |
| **all merges fully traceable** | ✅ ⚡ |
| **no suggested relationships** | ✅ ⚡ |
| **no predictive edges** | ✅ ⚡ |

---

## 3) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
> **Connect knowledge across spheres (Business ↔ Scholar ↔ Creative ↔ XR) without collapsing sphere boundaries.**

### RULE
> **Inter-sphere Threads = CROSS-DOMAIN CONNECTORS. Never domain fusion.**

### 5 Sphere Connector Types ⚡
| Type | Description |
|------|-------------|
| `topic_bridge` | ⚡ |
| `artifact_reference` | ⚡ |
| `decision_dependency` | ⚡ |
| `method_link` | **(via Methodology Sphere)** ⚡ |
| `replay_reference` | ⚡ |

### Inter-Sphere Thread JSON ⚡
```json
{
  "intersphere_thread": {
    "id": "uuid",
    "spheres": ["business", "scholar", "creative"],
    "anchors": [
      { "sphere": "business", "type": "meeting", "id": "uuid" },
      { "sphere": "scholar", "type": "document", "id": "uuid" }
    ],
    "links": [
      { "from": "uuid", "to": "uuid", "reason": "cross_sphere_reference" }
    ],
    "created_by": "agent_or_user_id",
    "audit_trail": ["..."],
    "visibility": "controlled"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **cross-sphere links always explicit** | ✅ ⚡ |
| **no universal meaning extraction** | ✅ ⚡ |
| **sphere integrity always preserved** | ✅ ⚡ |

---

## KNOWLEDGE THREAD ENGINE — CANONICAL FORMAT ⚡ (NOUVEAU!)

### ENGINE INPUT ⚡
| Input | Description |
|-------|-------------|
| `anchors[]` | ⚡ |
| `links[]` | ⚡ |
| `sphere_context[]` | ⚡ |
| `visibility_level` | ⚡ |
| `creation_mode(user|agent)` | ⚡ |

### ENGINE OUTPUT ⚡
| Output | Description |
|--------|-------------|
| `thread_bundle` | ⚡ |
| `integrity_hash` | ⚡ |
| `audit_log` | ⚡ |

### Export Format JSON ⚡
```json
{
  "thread_bundle": {
    "version": "1.0",
    "threads": [
      "personal_thread | collective_thread | intersphere_thread"
    ],
    "hash": "sha256"
  }
}
```

---

## TYPESCRIPT DEFINITIONS ⚡ (NOUVEAU!)

### ThreadAnchor ⚡
```typescript
export type ThreadAnchor = {
  id: string;
  type: "meeting" | "note" | "artifact" | "decision" | "document" | "replay";
  sphere?: string;
};
```

### ThreadLink ⚡
```typescript
export type ThreadLink = {
  from: string;
  to: string;
  reason:
    | "explicit_reference"
    | "is_related_to"
    | "cross_sphere_reference"
    | "decision_dependency";
};
```

### BaseThread ⚡
```typescript
export interface BaseThread {
  id: string;
  anchors: ThreadAnchor[];
  links: ThreadLink[];
  created_at: string;
  updated_at?: string;
}
```

### PersonalThread ⚡
```typescript
export interface PersonalThread extends BaseThread {
  owner: string;
  visibility: "private";
}
```

### CollectiveThread ⚡
```typescript
export interface CollectiveThread extends BaseThread {
  contributors: string[];
  visibility: "team" | "sphere" | "public";
  integrity_hash: string;
}
```

### IntersphereThread ⚡
```typescript
export interface IntersphereThread extends BaseThread {
  spheres: string[];
  created_by: string;
  audit_trail: any[];
}
```

---

## THREAD SAFETY & ETHICS ⚡

| Rule | Status |
|------|--------|
| **no inference** | ✅ ⚡ |
| **no prediction** | ✅ ⚡ |
| **no sentiment analysis** | ✅ ⚡ |
| **no persuasive clustering** | ✅ ⚡ |
| **no auto-linking without user confirmation** | ✅ ⚡ |

---

**END — FOUNDATION FREEZE READY**
