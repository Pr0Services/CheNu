# CHE·NU — KNOWLEDGE THREADS (x3)
**VERSION:** MEMORY.v1.0  
**MODE:** FOUNDATION / CROSS-SPHERE / NON-MANIPULATIVE

---

## OVERVIEW

> **Knowledge Threads = STRUCTURED CONNECTIONS** between facts, artifacts, decisions, replays, agents, and spheres.

- **NOT** interpretation
- **NOT** storytelling
- **NOT** recommendation

> **Just relational truth.**

### 3 Thread Types ⚡
| Type | Name |
|------|------|
| **THREAD_TYPE_A** | FACTUAL THREAD ⚡ |
| **THREAD_TYPE_B** | CONTEXTUAL THREAD ⚡ |
| **THREAD_TYPE_C** | CROSS-SPHERE THREAD ⚡ |

### All Threads Are ⚡
| Property | Status |
|----------|--------|
| **append-only** | ✅ ⚡ |
| **cryptographically linked** | ✅ ⚡ |
| **auditable** | ✅ ⚡ |
| **reversible by user** | ✅ ⚡ |
| **never persuasive** | ✅ ⚡ |

---

## 1) THREAD_TYPE_A — FACTUAL THREAD ⚡

### Purpose
Link **PURE FACTS** across time, meetings, artifacts, and decisions.

### Examples of Facts ⚡
| Fact Type | Description |
|-----------|-------------|
| a date | ⚡ |
| a result | ⚡ |
| a metric | ⚡ |
| a statement made in a meeting (transcribed) | ⚡ |
| a decision timestamp | ⚡ |
| an artifact modification | ⚡ |

### RULE
> **No interpretation. No "importance" scoring. No meaning added.**

### Factual Thread JSON ⚡

```json
{
  "knowledge_thread_a": {
    "id": "uuid",
    "type": "factual",
    "facts": [
      { "event_id": "uuid", "timestamp": 12345, "source": "replay_id" }
    ],
    "integrity_hash": "sha256",
    "created_by": "system|user",
    "visibility": "private|shared"
  }
}
```

### Factual Thread Behavior ⚡
| Behavior | Status |
|----------|--------|
| **highlights identical facts across replays** | ✅ ⚡ |
| **shows evolution of a single piece of data** | ✅ ⚡ |
| **supports timeline braiding** | ✅ ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **recommendations** | ❌ ⚡ |
| **interpretations** | ❌ ⚡ |
| **predictive modeling** | ❌ ⚡ |

---

## 2) THREAD_TYPE_B — CONTEXTUAL THREAD ⚡

### Purpose
Link **FACTS + their CONTEXT:** sphere, participants, meeting type, artifacts used. This builds **situational understanding WITHOUT creating narratives.**

### Contextual Elements ⚡ (NOUVEAU!)
| Element | Description |
|---------|-------------|
| `sphere` | "business", "scholar", etc. ⚡ |
| `meeting_mode` | "analysis", "creative" ⚡ |
| `roles` | user, agent ⚡ |
| `environment_tags` | XR preset ⚡ |
| `artifact_lineage` | **versions, forks** ⚡ |

### Contextual Thread JSON ⚡

```json
{
  "knowledge_thread_b": {
    "id": "uuid",
    "type": "contextual",
    "segments": [
      {
        "fact_id": "uuid",
        "context": {
          "sphere": "business",
          "meeting_mode": "analysis",
          "participants": ["user1", "agent42"],
          "room_preset": "xr_classic"
        }
      }
    ],
    "integrity_hash": "sha256"
  }
}
```

### Context Object Fields ⚡
| Field | Description |
|-------|-------------|
| `sphere` | **business/scholar/creative/etc** ⚡ |
| `meeting_mode` | **analysis/creative** ⚡ |
| `participants` | **Array of user/agent IDs** ⚡ |
| `room_preset` | **xr_classic/cosmic/etc** ⚡ |

### Contextual Thread Behavior ⚡
| Behavior | Status |
|----------|--------|
| **re-clusters Universe View nodes** | ✅ ⚡ |
| **filters replays based on shared context** | ✅ ⚡ |
| **highlights "parallel situations"** | ✅ ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **similarity scoring** | ❌ ⚡ |
| **behavioral inference** | ❌ ⚡ |
| **predictive matching** | ❌ ⚡ |

---

## 3) THREAD_TYPE_C — CROSS-SPHERE THREAD ⚡

### Purpose
Connect related elements **ACROSS DIFFERENT SPHERES** while maintaining strict ethical boundaries.

> **This is what lets Che-Nu feel "alive" and deeply integrated without ever becoming manipulative or directive.**

### Allowed Cross-Sphere Relations ⚡
| Relation | Status |
|----------|--------|
| **same artifact used in business → scholar** | ✅ ⚡ |
| **decision in one sphere affecting scheduling in another** | ✅ ⚡ |
| **knowledge transfer via agents** | ✅ ⚡ |
| **cross-domain dependencies (e.g., data, roles)** | ✅ ⚡ |
| **user-defined links** | ✅ ⚡ |

### DISALLOWED ⚡
| Forbidden | Status |
|-----------|--------|
| **persuasion links** | ❌ ⚡ |
| **emotional similarity** | ❌ ⚡ |
| **correlation-based suggestions** | ❌ ⚡ |

### Cross-Sphere Thread JSON ⚡

```json
{
  "knowledge_thread_c": {
    "id": "uuid",
    "type": "cross_sphere",
    "links": [
      {
        "from_sphere": "business",
        "from_id": "artifact_123",
        "to_sphere": "scholar",
        "to_id": "note_456",
        "relation": "shared_artifact|dependency|agent_transfer"
      }
    ],
    "integrity_hash": "sha256",
    "visibility": "private|shared"
  }
}
```

### Cross-Sphere Link Types ⚡
| Type | Description |
|------|-------------|
| `shared_artifact` | same file in both spheres ⚡ |
| `dependency` | scheduling/data dependency ⚡ |
| `agent_transfer` | **knowledge via agents** ⚡ |
| `user_defined` | manual link ⚡ |

---

## SUMMARY: A/B/C THREAD COMPARISON ⚡

| Thread | Focus | Links |
|--------|-------|-------|
| **TYPE_A (Factual)** | PURE FACTS | across time ⚡ |
| **TYPE_B (Contextual)** | FACTS + CONTEXT | situational ⚡ |
| **TYPE_C (Cross-Sphere)** | MULTI-SPHERE | structural bridges ⚡ |

---

**END — KNOWLEDGE THREADS ABC (FREEZE READY)**
