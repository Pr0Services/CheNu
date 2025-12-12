# CHE·NU — KNOWLEDGE THREADS (3 TIERS)
**VERSION:** KNT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Connect information **INSIDE a single sphere** (Business, Scholar, Creative, etc.), creating continuity and visibility without inference.

### RULE
> **A thread = A LINE OF TRACEABLE FACTS. No assumptions. No conclusions.**

### Thread Types ⚡
| Type | Chain |
|------|-------|
| `TASK THREAD` | task → notes → decisions → artifacts → replays ⚡ |
| `LEARNING THREAD` | course → progress → insights → created materials ⚡ |
| `CREATIVE THREAD` | idea → drafts → revisions → final assets ⚡ |
| `INSTITUTIONAL THREAD` | rule → discussion → application → audit ⚡ |

### Intra Thread Model JSON ⚡

```json
{
  "intra_thread": {
    "sphere": "business|scholar|creative|...",
    "id": "uuid",
    "nodes": [
      { "type": "task|note|decision|artifact|replay", "ref": "uuid" }
    ],
    "visibility": "user|team|private",
    "hash": "sha256"
  }
}
```

### Intra Fields ⚡
| Field | Description |
|-------|-------------|
| `nodes[].type` | **task/note/decision/artifact/replay** ⚡ |
| `visibility` | **user/team/private** ⚡ |

### Thread Properties ⚡
| Property | Status |
|----------|--------|
| **chronological by default** | ✅ ⚡ |
| **reversible** | ✅ ⚡ |
| **exportable** | ✅ ⚡ |
| **tied to sphere memory** | ✅ ⚡ |
| **immutable after validation** | ✅ ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **suggestion** | ❌ ⚡ |
| **prioritization** | ❌ ⚡ |
| **sentiment** | ❌ ⚡ |

---

## 2) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Link content **ACROSS spheres** when a topic spans multiple domains (Ex: Business ↔ Scholar, Creative ↔ Social, etc.)

### RULE
> **Cross-sphere = CONNECTION, NOT SYNTHESIS. The system NEVER merges concepts, only links them.**

### When Inter-Sphere Threads Form ⚡
| Trigger | Description |
|---------|-------------|
| **shared topic (exact match)** | ⚡ |
| **shared artifact** | ⚡ |
| **shared user intention** | ⚡ |
| **shared agent involvement** | ⚡ |
| **cross-sphere meetings** | ⚡ |

### Inter Thread JSON ⚡

```json
{
  "inter_thread": {
    "id": "uuid",
    "anchors": [
      { "sphere": "business", "ref": "uuid" },
      { "sphere": "creative", "ref": "uuid" },
      { "sphere": "scholar", "ref": "uuid" }
    ],
    "link_reason": "shared_topic|artifact|meeting",
    "explanation": "auto-generated human sentence",
    "hash": "sha256"
  }
}
```

### Inter Fields ⚡
| Field | Description |
|-------|-------------|
| `anchors[]` | **Array of sphere+ref pairs** ⚡ |
| `link_reason` | **shared_topic/artifact/meeting** ⚡ |
| `explanation` | **auto-generated human sentence** ⚡ |

### Inter-Sphere Visualization ⚡

**Universe View:**
- threads as soft lines
- **color-coded by sphere pairs** ⚡
- **no force layout (no persuasion)** ⚡

**Filtering:**
- by sphere, by topic, by user

---

## 3) CROSS-USER COLLECTIVE KNOWLEDGE THREADS ⚡

### Purpose
Build higher-level threads that represent **shared activity** between multiple users **WITHOUT exposing private data or intentions.**

### RULE
> **Collective Threads = Anonymous shared patterns of work.**

### Trigger Conditions ⚡
| Trigger | Description |
|---------|-------------|
| **same topic appearing in multiple users' spheres** | ⚡ |
| **identical artifact lineage** | ⚡ |
| **parallel decision sequences** | ⚡ |
| **repeated meeting themes** | ⚡ |
| **replay motif alignment** | ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| **individual attribution** | ❌ ⚡ |
| **inference of consensus** | ❌ ⚡ |
| **behavioral prediction** | ❌ ⚡ |

### Collective Thread JSON ⚡

```json
{
  "collective_thread": {
    "id": "uuid",
    "pattern": "topic|workflow|timeline|artifact",
    "participants": "anonymized",
    "shared_nodes": ["uuid", "uuid", "uuid"],
    "strength": "0.0-1.0",
    "explanation": "general pattern observed",
    "safety": {
      "depersonalized": true,
      "non-predictive": true
    }
  }
}
```

### Collective Fields ⚡
| Field | Description |
|-------|-------------|
| `pattern` | **topic/workflow/timeline/artifact** ⚡ |
| `participants` | **"anonymized"** ⚡ |
| `strength` | **0.0-1.0 float** ⚡ |
| `safety.depersonalized` | **true** ⚡ |
| `safety.non-predictive` | **true** ⚡ |

### Collective Thread Uses ⚡
| Use | Description |
|-----|-------------|
| **show global patterns** | ⚡ |
| **reveal stable workflows** | ⚡ |
| **help navigate large ecosystems** | ⚡ |
| **increase clarity, not influence** | ⚡ |

### Visualization ⚡
| Mode | Description |
|------|-------------|
| **fog-of-war mode** | **(preserves privacy)** ⚡ |
| **aggregated node clusters** | ⚡ |
| **pattern ribbons** | ⚡ |
| **decode-on-click** | **(only structural info)** ⚡ |

---

## THREAD GOVERNANCE ⚡

### ALL THREADS ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **cryptographically hashed** | ✅ ⚡ |
| **versioned** | ✅ ⚡ |
| **explainable** | ✅ ⚡ |
| **reversible view** | ✅ ⚡ |
| **never interpret intent** | ✅ ⚡ |

### AGENTS ⚡
| Agent | Role |
|-------|------|
| `THREAD_MONITOR` | **validates structure** ⚡ |
| `THREAD_GUARD` | **enforces ethics (no inference)** ⚡ |
| `THREAD_EXPLAINER` | **generates human-readable reasons** ⚡ |

---

## WHY 3 TIERS MATTER ⚡

| Tier | Purpose |
|------|---------|
| **INTRA** | Clarity INSIDE a sphere ⚡ |
| **INTER** | Clarity BETWEEN spheres ⚡ |
| **COLLECTIVE** | Clarity ACROSS the ecosystem **WITHOUT compromising identity** ⚡ |

### Together ⚡
> **Che-Nu Knowledge Without Manipulation.**

---

**END — FREEZE READY**
