# CHE·NU — KNOWLEDGE THREADS SYSTEM (PKT/IST/CKT)
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / APPEND-ONLY

---

## GLOBAL PRINCIPLES

> **Knowledge Thread = CONTINUOUS, TRACEABLE LINK** between facts, artifacts, decisions, and time.

### RULES
- Observation > Interpretation
- Append-only
- Source-linked
- Versioned & hashed
- No sentiment, no judgment

### Threads NEVER
- rank people
- optimize outcomes
- infer intent
- rewrite history

---

## THREAD TYPES (3)

| ID | Name | Scope |
|----|------|-------|
| **T1** | Personal Knowledge Thread (PKT) | Individual |
| **T2** | Inter-Sphere Knowledge Thread (IST) | Cross-sphere |
| **T3** | Collective Knowledge Thread (CKT) | Multi-user |

---

## T1) PERSONAL KNOWLEDGE THREAD (PKT) ⚡

### Purpose
Help a single user see **THEIR learning, decisions, and context over time.**

### Sources
- personal meetings, personal notes, accepted artifacts, explicit bookmarks, private replays

### Visibility
| Option | Description |
|--------|-------------|
| `private` | owner only (default) |
| `shared` | sharable by selection |

### Capabilities ⚡
| Feature | Description |
|---------|-------------|
| timeline view | Linear timeline |
| decision echo view | Decision history |
| **gap & silence highlighting** | **Shows inactivity** ⚡ |
| replay linking | Jump to replays |

### JSON Model (with privacy) ⚡

```json
{
  "personal_thread": {
    "id": "uuid",
    "owner": "user_id",
    "entries": [
      {
        "type": "event|artifact|decision",
        "ref_id": "uuid",
        "timestamp": 1712345678,
        "source": "meeting|replay|note",
        "hash": "sha256"
      }
    ],
    "privacy": "private|shared"
  }
}
```

---

## T2) INTER-SPHERE KNOWLEDGE THREAD (IST) (with direction) ⚡

### Purpose
Reveal how knowledge **MOVES between spheres** WITHOUT merging or contaminating them.

### Sources
- cross-sphere meetings, shared artifacts, referenced decisions, agent handoffs

### Rules
| Rule | Status |
|------|--------|
| **spheres remain sovereign** | ✅ ⚡ |
| references, not copies | ✅ |
| explicit linkage only | ✅ |

### Capabilities ⚡
| Feature | Description |
|---------|-------------|
| sphere-to-sphere trace | Track movement |
| dependency visualization | Show dependencies |
| **cross-domain replay jump** | **Jump to other sphere replays** ⚡ |

### JSON Model (with direction + source/target) ⚡

```json
{
  "inter_sphere_thread": {
    "id": "uuid",
    "source_sphere": "business",
    "target_sphere": "scholar",
    "links": [
      {
        "ref_type": "artifact|decision|meeting",
        "ref_id": "uuid",
        "direction": "import|export",
        "timestamp": 1712345678
      }
    ],
    "hash": "sha256"
  }
}
```

### Direction Types ⚡
| Direction | Description |
|-----------|-------------|
| `import` | Incoming from source |
| `export` | Outgoing to target |

---

## T3) COLLECTIVE KNOWLEDGE THREAD (CKT) (with verification + hashed participants) ⚡

### Purpose
Expose **SHARED FACTUAL HISTORY** across users WITHOUT narrative control or aggregation bias.

### Sources
- validated XR replays, public decisions, shared artifacts, institutional records

### Rules
| Rule | Status |
|------|--------|
| **anonymization supported** | ✅ ⚡ |
| immutable after validation | ✅ |
| **globally verifiable** | ✅ ⚡ |
| replay-backed only | ✅ |

### Capabilities ⚡
| Feature | Description |
|---------|-------------|
| historical continuity | Full history |
| **divergence visibility** | **Show forks** ⚡ |
| **fork & merge visualization** | **Factual branching** ⚡ |

### JSON Model (with verification + hashed participants) ⚡

```json
{
  "collective_thread": {
    "id": "uuid",
    "scope": "team|org|public",
    "entries": [
      {
        "type": "event|decision|artifact",
        "ref_id": "uuid",
        "timestamp": 1712345678,
        "participants": "hashed",
        "hash": "sha256"
      }
    ],
    "verification": "passed"
  }
}
```

### CKT Fields ⚡
| Field | Description |
|-------|-------------|
| `participants` | **"hashed"** - anonymized |
| `verification` | passed / pending / failed |

---

## THREAD VISUALIZATION MODES ⚡

| Mode | Description |
|------|-------------|
| Linear timeline | Standard view |
| **Braided timelines** | **Compare multiple threads** ⚡ |
| Node-link constellation | Network view |
| **Silence & gap overlay** | **Show inactivity** ⚡ |
| Replay jump points | Quick navigation |

### FORBIDDEN
- scoring
- heat ranking
- sentiment coloring

---

## AGENTS (PASSIVE-ONLY)

| Agent | Role |
|-------|------|
| `AGENT_THREAD_BUILDER` | Builds links from validated sources, **no inference** |
| `AGENT_THREAD_GUARD` | Enforces rules, **blocks overreach** |
| `AGENT_THREAD_EXPLAINER` | Human-readable context only, **no conclusions** |

---

## EXPORTS ⚡

| Format | Description |
|--------|-------------|
| **PDF** | chronological, factual |
| **JSON** | signed |
| **XR thread navigation** | Immersive view |
| **Read-only share links** | **Safe sharing** ⚡ |

---

## WHY THE 3 THREADS

| Thread | Provides |
|--------|----------|
| **PKT** | personal clarity |
| **IST** | structural coherence |
| **CKT** | shared truth |

> **Same facts. Different lenses. Zero manipulation.**

---

**END — FREEZE READY**
