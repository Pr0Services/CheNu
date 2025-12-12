# CHE·NU — KNOWLEDGE THREADS (x3: COLLECTIVE VALIDATION)
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## KNOWLEDGE THREADS — PURPOSE

> Create structured links between concepts, meetings, decisions, artifacts, and spheres **WITHOUT interpretation.**

### Rule
> **Thread = CONNECTION, not conclusion.**

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS

### Scope
Knowledge links inside **ONE sphere:**
- business → business
- scholar → scholar
- creative → creative

### Triggered By
- repeated topics
- recurring artifacts
- timeline proximity
- intra-sphere decisions
- shared participants

### Thread Types (5) ⚡
| Type | Description |
|------|-------------|
| `Topic Thread` | Same topic |
| `Task Thread` | Related tasks |
| `Artifact Thread` | Same artifact |
| `Decision Line` | Decision chain |
| `Timeline Thread` | Time sequence |

### JSON Model

```json
{
  "thread": {
    "id": "uuid",
    "type": "topic|task|artifact|decision|timeline",
    "sphere": "business|scholar|creative|...",
    "nodes": ["id1","id2","id3"],
    "created_at": "...",
    "hash": "sha256"
  }
}
```

### Rules
- No automatic summaries
- No inferred meaning
- **Pure graph of confirmed links**

---

## 2) CROSS-SPHERE KNOWLEDGE THREADS (with signal + confidence max) ⚡

### Scope
Links concepts **ACROSS spheres:**
- business ↔ scholar
- creative ↔ social
- institution ↔ xr

### Triggered By
- shared artifacts
- same participants across spheres
- continuity of decisions
- common objectives

### Thread Types (4) ⚡
| Type | Description |
|------|-------------|
| `Sphere Bridge` | Direct sphere link |
| `Multi-Domain Topic Thread` | Topic across domains |
| `Cross-Decision Line` | Decision spanning spheres |
| `Continuity Thread` | Continuous narrative |

### JSON Model (with signal + confidence) ⚡

```json
{
  "cross_thread": {
    "id": "uuid",
    "from_sphere": "business",
    "to_sphere": "scholar",
    "signal": "shared_artifact|shared_topic|shared_agent",
    "nodes": ["idA","idB"],
    "confidence": 0.75,
    "hash": "sha256"
  }
}
```

### Signal Types ⚡
| Signal | Description |
|--------|-------------|
| `shared_artifact` | Same artifact |
| `shared_topic` | Same topic |
| `shared_agent` | Same agent |

### Rules ⚡
| Rule | Value |
|------|-------|
| **Confidence <= 0.9 max** | Prevents illusion of certainty ⚡ |
| No auto-routing | User chooses |
| Visible rationale | For each link |

---

## 3) COLLECTIVE KNOWLEDGE THREADS (INTER-USERS) ⚡ UNIQUE

### Scope
Shared, validated links across users or teams. Forms a **collective brain layer** WITHOUT personal data leakage.

### Triggered When
- multiple users validate the same artifact
- repeated discussion patterns
- identical decisions across teams
- multi-user meeting clusters

### Thread Types (4) ⚡
| Type | Description |
|------|-------------|
| `Collective Artifact Thread` | Shared artifact |
| `Multi-Team Decision Line` | Team decisions |
| `Shared Topic Constellation` | Topic cluster |
| `Cross-Replay Alignment Thread` | Replay alignment |

### JSON Model (with validated_by + alignment_score + scope) ⚡

```json
{
  "collective_thread": {
    "id": "uuid",
    "validated_by": ["user1","user2"],
    "nodes": ["meetingX","meetingY","artifactZ"],
    "alignment_score": 0.85,
    "scope": "team|organization|global",
    "hash": "sha256"
  }
}
```

### Collective Thread Fields ⚡
| Field | Description |
|-------|-------------|
| `validated_by` | Users who validated |
| `alignment_score` | 0.0-1.0 alignment |
| `scope` | team / organization / global |

### Rules ⚡
| Rule | Status |
|------|--------|
| **opt-in required** | ✅ ⚡ |
| no private content exposure | ✅ |
| anonymization allowed | ✅ |
| threads can be downgraded or hidden | ✅ |

---

## KNOWLEDGE THREAD RENDERING RULES ⚡

### 2D Mode
| Property | Value |
|----------|-------|
| Style | curved soft lines |
| Direction | non-directional |
| Density | adjustable |

### 3D XR Mode ⚡
| Property | Value |
|----------|-------|
| Style | **floating filaments** ⚡ |
| Thickness | = confidence |
| **Glow** | **= validated link** ⚡ |
| Distance | = conceptual closeness |

### NEVER
- color-coded persuasion
- dominance or urgency cues

---

## THREAD SAFETY & ETHICS

| Rule | Status |
|------|--------|
| reversible by user | ✅ |
| transparent reasoning (why this thread exists) | ✅ |
| no emotional inference | ✅ |
| freeze after validation | ✅ |
| hash verification for integrity | ✅ |

---

## KNOWLEDGE THREAD ENGINE

### Inputs
- replays, artifacts, meetings, sphere data, decision logs

### Outputs
- thread graph
- thread metadata
- universe overlays
- XR filaments

### Agents Involved
| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Constructs threads only |
| `AGENT_THREAD_EXPLAINER` | Explains the link rationale |
| `AGENT_THREAD_GUARD` | Checks ethical compliance |

---

**END — FOUNDATION FREEZE**
