# CHE·NU — KNOWLEDGE THREAD ENGINE + COMMUNITY SPHERE
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / ETHICAL

---

## I) KNOWLEDGE THREADS — CORE DEFINITION ⚡

> **A Knowledge Thread is a NEUTRAL connective structure linking:** information, tasks, artifacts, meetings, spheres, participants.

### RULE
> **A Knowledge Thread NEVER restructures or interprets data. It only REVEALS CONNECTIONS.**

### 3 Thread Types ⚡
| Type | Scope |
|------|-------|
| **1) Personal Knowledge Thread** | user-only ⚡ |
| **2) Inter-Sphere Knowledge Thread** | cross-domain ⚡ |
| **3) Collective Knowledge Thread** | multi-user ⚡ |

---

## 1) PERSONAL KNOWLEDGE THREAD ⚡

### Purpose
> **Help a user see how THEIR OWN work, meetings, notes, and data evolve.**

### DOES ⚡
| Action | Description |
|--------|-------------|
| connect their tasks | ⚡ |
| **display continuity of thought** | ⚡ |
| link their artifacts | ⚡ |
| show project progression | ⚡ |
| **timeline auto-weave** | ⚡ |

### NEVER DOES ⚡
| Forbidden | Status |
|-----------|--------|
| **compare user vs others** | ❌ ⚡ |
| **judge productivity** | ❌ ⚡ |
| **infer meaning** | ❌ ⚡ |

### Personal Thread JSON ⚡
```json
{
  "thread_personal": {
    "user_id": "uuid",
    "nodes": ["tasks", "notes", "meetings", "artifacts"],
    "links": [
      { "from": "id", "to": "id", "reason": "topic|time|artifact" }
    ],
    "visibility": "private"
  }
}
```

### Visual ⚡
- soft line, warm color, **no ranking**

---

## 2) INTER-SPHERE KNOWLEDGE THREAD ⚡

### Purpose
> **Reveal connections BETWEEN spheres:** Business ↔ Scholar ↔ Creative ↔ Social ↔ XR ↔ Methodology ↔ Community...

### Examples ⚡
| From | To | Link |
|------|----|------|
| Scholar research note | Business task | **influences** ⚡ |
| Creative Studio concept | Social Media campaign | **informs** ⚡ |
| Community Event | Business opportunities | **leads to** ⚡ |

### NEVER ⚡
| Forbidden | Status |
|-----------|--------|
| **create hierarchy between spheres** | ❌ ⚡ |
| **claim cause/effect** | ❌ ⚡ |
| **influence user priorities** | ❌ ⚡ |

### Inter-Sphere Thread JSON ⚡
```json
{
  "thread_intersphere": {
    "spheres": ["business", "creative", "community"],
    "links": [
      { "from": "id", "to": "id", "type": "concept_bridge" }
    ],
    "visibility": "user_or_team"
  }
}
```

### Visual ⚡
- orbit-style linking, **color-coded per sphere**

---

## 3) COLLECTIVE KNOWLEDGE THREAD ⚡

### Purpose
> **Build a shared, cross-user, cross-meeting map of verified information.**

### ONLY uses immutable sources ⚡
- validated artifacts
- collective memory entries
- **confirmed decisions**

### NEVER ⚡
| Forbidden | Status |
|-----------|--------|
| **merge private data** | ❌ ⚡ |
| **include user emotions** | ❌ ⚡ |
| **infer intent** | ❌ ⚡ |
| **show personal notes without consent** | ❌ ⚡ |

### Collective Thread JSON ⚡
```json
{
  "thread_collective": {
    "entries": ["events", "decisions", "artifacts"],
    "links": [
      { "from": "id", "to": "id", "context": "topic|sequence|reference" }
    ],
    "verification_hash": "sha256",
    "visibility": "team|org"
  }
}
```

### Visual ⚡
- structural graph, cooler colors, **verified stamp**

---

## KNOWLEDGE THREAD ENGINE — RULES ⚡

### Thread Creation Rules ⚡
| Rule | Status |
|------|--------|
| **anchor on validated data** | ✅ ⚡ |
| **no interpretation** | ✅ ⚡ |
| **no subjective criteria** | ✅ ⚡ |
| **consistency first** | ✅ ⚡ |

### Thread Expansion Rules ⚡
| Rule | Status |
|------|--------|
| **only grows from objective links** | ✅ ⚡ |
| **user or agent must approve new branches** | ✅ ⚡ |
| **no auto-expansion into private spheres** | ✅ ⚡ |

### Thread Safety Rules ⚡
| Rule | Status |
|------|--------|
| **highlight filtered sections** | ✅ ⚡ |
| **zero emotional amplification** | ✅ ⚡ |
| **reversible** | ✅ ⚡ |
| **exportable as .kthread bundle** | ✅ ⚡ |

---

## KNOWLEDGE THREAD UI (XR + 2D) ⚡

| Feature | Description |
|---------|-------------|
| zoom | ⚡ |
| collapse/expand branches | ⚡ |
| **follow-thread mode** | ⚡ |
| timeline overlay | ⚡ |
| **cross-sphere color coding** | ⚡ |
| **XR orbit navigation** | ⚡ |

---

## II) COMMUNITY SPHERE — FULL FOUNDATION ⚡ (NOUVEAU!)

### Purpose
> **A sphere where users interact with PEOPLE, SERVICES, TALENTS, EVENTS, and COMMUNITY-DRIVEN INITIATIVES in a structured, safe ecosystem.**

### RULE
> **Community Sphere is SOCIAL UTILITY, NOT influence, NOT ranking.**

### 7 Sphere Sections ⚡ (NOUVEAU!)
| # | Section |
|---|---------|
| 1 | **Marketplace** ⚡ |
| 2 | **Services** ⚡ |
| 3 | **Talents** ⚡ |
| 4 | **Events** ⚡ |
| 5 | **Promotion** ⚡ |
| 6 | **Rencontre / Connections** ⚡ |
| 7 | **Activités locales & globales** ⚡ |

---

### 1) COMMUNITY MARKETPLACE ⚡
| Use | Description |
|-----|-------------|
| buy / sell / exchange | ⚡ |
| local offers | ⚡ |
| digital goods | ⚡ |
| **skills exchange** | ⚡ |

**Rules:** no bidding wars, no manipulative scarcity, clear transparency

---

### 2) COMMUNITY SERVICES ⚡
| Example | Description |
|---------|-------------|
| tutoring | ⚡ |
| design | ⚡ |
| coaching | ⚡ |
| repair | ⚡ |
| **consulting** | ⚡ |

**Features:** clear scope, availability, **fixed transparent pricing**

---

### 3) TALENTS DIRECTORY ⚡
| Profile | Description |
|---------|-------------|
| skills | ⚡ |
| portfolio | ⚡ |
| availability | ⚡ |
| **user ratings (non-emotional, factual)** | ⚡ |

**RULE:** Only factual tags allowed (ex: "delivered_on_time"). **NEVER emotional or subjective.**

---

### 4) EVENTS ⚡
| Type | Description |
|------|-------------|
| workshops | ⚡ |
| community meetups | ⚡ |
| **XR gatherings** | ⚡ |
| learning circles | ⚡ |
| hackathons | ⚡ |
| social activities | ⚡ |

---

### 5) PROMOTION ZONE ⚡
| Promote | Description |
|---------|-------------|
| community projects | ⚡ |
| local businesses | ⚡ |
| initiatives | ⚡ |
| **accomplishments** | ⚡ |

**RULE:** Promotion ≠ advertising manipulation. **Only factual presentation allowed.**

---

### 6) RENCONTRE / CONNECTIONS ⚡
| For | Description |
|-----|-------------|
| finding collaborators | ⚡ |
| **matching skills** | ⚡ |
| **group creation** | ⚡ |

**Match model:** `"confidence": 0.4 (purely structural), "requires_acceptance": true`

---

### 7) ACTIVITÉS ⚡
| Activity | Description |
|----------|-------------|
| digital challenges | ⚡ |
| **XR scavenger hunts** | ⚡ |
| team-building | ⚡ |
| creative missions | ⚡ |
| **community story threads** | ⚡ |

> **All activities export to Knowledge Threads (but ONLY factual info).**

---

## 4 COMMUNITY SPHERE AGENTS ⚡ (NOUVEAU!)

| Agent | Role |
|-------|------|
| `AGENT_COMMUNITY_MATCHER` | **structural matching only, no preference inference** ⚡ |
| `AGENT_EVENT_COORDINATOR` | schedules, archives, **syncs with collective memory** ⚡ |
| `AGENT_REPUTATION_GUARD` | **ensures no emotional/subjective ratings** ⚡ |
| `AGENT_MARKETPLACE_VALIDATOR` | item safety, **rule conformity** ⚡ |

---

**END — FREEZE COMPATIBLE**
