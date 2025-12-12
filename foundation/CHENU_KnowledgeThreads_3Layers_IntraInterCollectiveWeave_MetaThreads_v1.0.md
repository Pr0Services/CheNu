# CHE·NU — KNOWLEDGE THREAD SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE

---

## OVERVIEW

> **A Knowledge Thread = A verified, lineage-preserving connection** between information pieces across spheres, meetings, artifacts, and memory.

### 3 LAYERS ⚡
| Layer | Name |
|-------|------|
| **1** | Intra-Sphere Threads (inside one domain) ⚡ |
| **2** | Inter-Sphere Threads (bridging domains) ⚡ |
| **3** | Collective Weave Threads (macro-insight linkages) ⚡ |

### RULE
> **Threads = STRUCTURAL RELATIONSHIPS, NOT INTERPRETATIONS.**
> 
> No inference. No bias. No rewriting. **Only verifiable linkages.**

---

## 1) INTRA-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Connect knowledge **inside a single sphere** (Business, Scholar, Creative, etc.)

### Examples ⚡
| Sphere | Flow |
|--------|------|
| **Business** | lead → proposal → decision → replay ⚡ |
| **Scholar** | course → notes → quiz → insight ⚡ |
| **Creative** | concept → sketch → asset → version ⚡ |

### Intra-Sphere Thread Types ⚡
| Type | Description |
|------|-------------|
| `sequence_thread` | **A precedes B** ⚡ |
| `refinement_thread` | **B is an improved form of A** ⚡ |
| `dependency_thread` | **B requires A** ⚡ |
| `artifact_thread` | **B references A** ⚡ |

### Intra-Sphere JSON ⚡

```json
{
  "intra_thread": {
    "sphere": "business|scholar|creative|...",
    "origin": "item_id",
    "target": "item_id",
    "type": "sequence|refinement|dependency|artifact",
    "timestamp": 1712345678,
    "hash": "sha256"
  }
}
```

### Intra-Sphere Rules ⚡
| Rule | Status |
|------|--------|
| **Always stays inside one sphere** | ✅ ⚡ |
| **Immutable** | ✅ ⚡ |
| **Must reference validated items** | ✅ ⚡ |
| **No semantic jumps** | ✅ ⚡ |
| **No inferred reasoning** | ✅ ⚡ |

### Agent Responsible ⚡
> **AGENT_INTRA_THREADER** — builds links based on factual relationships only

---

## 2) INTER-SPHERE KNOWLEDGE THREADS ⚡

### Purpose
Connect related knowledge **ACROSS domains** without forcing interpretation or hierarchy.

### Examples ⚡
| From | To | Description |
|------|-----|-------------|
| Scholar | → Business | course → real application ⚡ |
| Creative | → Social | media asset → published post ⚡ |
| XR | → Institution | meeting decision → compliance ⚡ |

### Inter-Sphere Thread Types ⚡
| Type | Description |
|------|-------------|
| `cross_reference` | **A directly cites B** ⚡ |
| `context_mirror` | **A and B share foundational context** ⚡ |
| `content_migration` | **artifact reused in another sphere** ⚡ |
| `action_projection` | **decision in A impacts B** ⚡ |

### Inter-Sphere JSON ⚡

```json
{
  "inter_thread": {
    "from_sphere": "scholar",
    "to_sphere": "business",
    "origin": "item_id",
    "target": "item_id",
    "relation": "cross_reference|context_mirror|migration|projection",
    "hash": "sha256"
  }
}
```

### Inter-Sphere Rules ⚡
| Rule | Status |
|------|--------|
| **Must originate from explicit action or shared artifact** | ✅ ⚡ |
| **Directionality preserved (A→B)** | ✅ ⚡ |
| **Cannot imply causation** | ✅ ⚡ |
| **Cannot cluster spheres without user confirmation** | ✅ ⚡ |

### Agent Responsible ⚡
> **AGENT_INTER_THREADER** — ensures cross-sphere links stay factual & minimal

---

## 3) COLLECTIVE KNOWLEDGE WEAVE (META-THREADS) ⚡ (NOUVEAU!)

### Purpose
Provide a structural **OVERVIEW** of how knowledge grows, branches, converges, and stabilizes across time.

> **NOT a knowledge graph of interpretations. A *weave* of verifiable relationships.**

### Meta-Thread Types ⚡
| Type | Description |
|------|-------------|
| `convergence_thread` | **multiple items → same outcome** ⚡ |
| `divergence_thread` | **one item → multiple branches** ⚡ |
| `lineage_thread` | **historical chain of related events** ⚡ |
| `synthesis_thread` | **explicit human-made synthesis** ⚡ |

### Collective Weave JSON ⚡

```json
{
  "collective_weave": {
    "id": "uuid",
    "threads": ["thread_id_1", "thread_id_2", "thread_id_3"],
    "type": "convergence|divergence|lineage|synthesis",
    "timestamp": 1712345678,
    "hash": "sha256"
  }
}
```

### Collective Weave Rules ⚡
| Rule | Status |
|------|--------|
| **Must include at least 2 threads** | ✅ ⚡ |
| **Must be user-validated** | ✅ ⚡ |
| **Agents NEVER generate meta-threads alone** | ✅ ⚡ |
| **No predictive reasoning** | ✅ ⚡ |
| **No narrative shaping** | ✅ ⚡ |

### Agent Responsible ⚡
> **AGENT_WEAVE_CURATOR** — assembles candidate thread groups, **requires explicit user approval**

---

## GLOBAL SAFETY RULES ⚡

| Rule | Status |
|------|--------|
| **No hidden inference** | ✅ ⚡ |
| **No sentiment classification** | ✅ ⚡ |
| **No ranking of ideas** | ✅ ⚡ |
| **No bias reinforcement** | ✅ ⚡ |
| **Only factual, timestamped, hashed linkages** | ✅ ⚡ |

---

## THREAD VISUALIZATION SPECS ⚡

| Mode | Description |
|------|-------------|
| `MODE 1 — LINEAR THREAD` | chronological, minimalistic ⚡ |
| `MODE 2 — BRANCHED THREAD` | divergence & convergence points ⚡ |
| `MODE 3 — WEAVE VIEW` | **overlay of multiple threads (read-only)** ⚡ |
| `MODE 4 — TIMELINE INTERLEAVE` | **merge view of several spheres** ⚡ |

---

## EXPORT FORMAT ⚡

### Knowledge Thread Bundle (`.ktpack`) ⚡
| Content | Description |
|---------|-------------|
| all threads involved | ⚡ |
| metadata + hashes | ⚡ |
| replay references | ⚡ |
| sphere map | ⚡ |
| **printable PDF summary** | ⚡ |

---

**END — KNOWLEDGE THREAD SYSTEM**
