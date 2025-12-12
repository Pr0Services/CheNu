# CHE·NU — XR COLLECTIVE MEMORY + PERSONAL NAVIGATION PROFILES
**VERSION:** XR.v1.5  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## C) XR REPLAY → COLLECTIVE MEMORY

### Purpose
Build a **SHARED, VERIFIABLE memory layer** across meetings, users, agents, and spheres, **WITHOUT rewriting history or shaping narratives.**

### RULE
> **Collective Memory = Aggregated FACTS**  
> NOT conclusions, NOT interpretations.

---

### COLLECTIVE MEMORY SOURCES

- XR replays (validated)
- meeting artifacts (notes, boards, files)
- decisions logs (time-stamped)
- agent actions (trace only)
- silence intervals (non-action)

---

### MEMORY OBJECT TYPES

| Type | Content |
|------|---------|
| `MEMORY_EVENT` | who / when / where, action or non-action |
| `MEMORY_ARTIFACT` | document / visual / data |
| `MEMORY_DECISION` | declared outcome, no judgment metadata |
| `MEMORY_CONTEXT` | meeting type, sphere, participants |

---

### COLLECTIVE MEMORY RULES

| Rule | Status |
|------|--------|
| append-only | ✅ |
| immutable after validation | ✅ |
| versioned | ✅ |
| cryptographically hashed | ✅ |
| traceable to source replay | ✅ |

### Forbidden
- ❌ sentiment tags
- ❌ success/failure labels
- ❌ inferred intent

---

### COLLECTIVE MEMORY GRAPH

#### Nodes
- meetings
- decisions
- artifacts
- agents
- users (anonymizable)

#### Edges

| Edge | Description |
|------|-------------|
| `happened_in` | Location/context |
| `referenced_by` | Citations |
| `followed_by` | Sequence |
| `shared_with` | Distribution |

---

### COLLECTIVE MEMORY JSON MODEL

```json
{
  "collective_memory": {
    "entries": [
      {
        "id": "uuid",
        "type": "event|artifact|decision|context",
        "source_replay": "uuid",
        "timestamp": 1712345678,
        "sphere": "business|scholar|xr|...",
        "participants": ["user_id","agent_id"],
        "hash": "sha256"
      }
    ],
    "integrity": "verified"
  }
}
```

---

### ACCESS CONTROL

| Rule | Status |
|------|--------|
| per-user visibility | ✅ |
| per-sphere visibility | ✅ |
| explicit sharing required | ✅ |
| private memories never surfaced globally | ✅ |

---

## D) UNIVERSE VIEW — PERSONAL NAVIGATION PROFILES

### Purpose
Allow each user to see the SAME universe through a **PERSONAL, CONFIGURABLE navigation lens.**

### RULE
> **Profile affects VISUALIZATION ONLY**  
> NEVER changes data or availability.

---

### PROFILE DIMENSIONS

| Dimension | Range |
|-----------|-------|
| `density_preference` | minimal → detailed |
| `default_orbit` | sphere focus |
| `routing_confidence_threshold` | 0.0 - 1.0 |
| `replay_visibility` | on/off |
| `agent_presence_level` | low/medium/high |
| `visual_complexity` | 2D ↔ 3D |

---

### PROFILE MODES (4)

| Mode | Description |
|------|-------------|
| **EXPLORER** | Wide view, many links visible, low filtering |
| **FOCUS** | Hide unrelated clusters, emphasize active threads |
| **REVIEW** | Replay-first, timelines emphasized |
| **ARCHIVE** | History & memory dominant |

---

### PERSONAL PROFILE JSON

```json
{
  "navigation_profile": {
    "user_id": "uuid",
    "mode": "explorer|focus|review|archive",
    "preferences": {
      "density": 0.4,
      "orbit": "business",
      "routing_threshold": 0.7,
      "visual_mode": "2d|3d",
      "agent_visibility": "low|medium|high"
    },
    "overrides": {
      "session_only": true
    }
  }
}
```

---

### PROFILE APPLICATION LOGIC

| Property | Value |
|----------|-------|
| Applied at | render time |
| Switchable | instantly |
| Reversible | no side effects |
| Scope | session-scoped or persistent |

---

### SAFETY & TRANSPARENCY

| Feature | Status |
|---------|--------|
| Profile effects previewable | ✅ |
| Always show "filtered view" indicator | ✅ |
| One-click reset to neutral view | ✅ |

---

## WHY C + D TOGETHER

| Component | Ensures |
|-----------|---------|
| **C — Collective Memory** | SHARED TRUTH |
| **D — Personal Navigation** | PERSONAL CLARITY |

### Together
> **One reality. Many perspectives. Zero manipulation.**

---

**END — FOUNDATION FREEZE**
