# CHE·NU — KNOWLEDGE THREADS (PHASE 2)
**VERSION:** KT.v2.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / CROSS-SPHERE

---

## PURPOSE

Knowledge Threads Phase 2 extends basic linking into:
1. **Dynamic Thread Generation** ⚡
2. **Cross-Sphere Reasoning** ⚡
3. **Thread Integrity Engine** (truth-preserving) ⚡
4. **User/Agent-neutral navigation** of knowledge

### RULE
> **A Knowledge Thread NEVER interprets intent. It ONLY connects FACTS, ARTIFACTS, and CONTEXT.**

---

## 1) DYNAMIC KNOWLEDGE THREADS ⚡

### Thread Creation Triggers ⚡
Threads are created or extended automatically when:
- replay entries share artifacts
- decisions reference similar topics
- users revisit the same contexts
- agents produce related analyses
- **spheres overlap in information domains** ⚡

### Thread Creation Logic ⚡
```
if shared_topic_count > threshold
OR shared_artifact_similarity > threshold
OR sequential_decisions align
→ create/extend thread
```

### Thread Types ⚡
| Type | Description |
|------|-------------|
| `FACT THREAD` | data-only ⚡ |
| `CONTEXT THREAD` | meetings + spheres |
| `DECISION THREAD` | sequence of decisions |
| `ARTIFACT THREAD` | documents/media |
| `AGENT THREAD` | **agent contribution maps** ⚡ |

### Thread Nodes ⚡
| Node Type | Description |
|-----------|-------------|
| replay | ✅ |
| artifact | ✅ |
| decision point | ✅ |
| sphere context | ✅ |
| **agent action** | ⚡ |
| **user bookmark** | ⚡ |

### Dynamic Thread JSON ⚡

```json
{
  "thread": {
    "id": "uuid",
    "type": "fact|context|decision|artifact|agent",
    "nodes": [...],
    "links": [...],
    "integrity_hash": "sha256"
  }
}
```

---

## 2) CROSS-SPHERE REASONING (NON-INTERPRETATIVE) ⚡

### Goal
Allow navigation from one sphere's knowledge structure to another **WITHOUT creating conclusions or predictions.**

### RULE
> **Cross-sphere reasoning = structured adjacency, NOT logic.**

### Philosophy (Japanese) ⚡
| Term | Meaning | Status |
|------|---------|--------|
| **操作 (logic)** | **is forbidden** | ❌ ⚡ |
| **結合 (association)** | **is allowed** | ✅ ⚡ |

### Cross-Sphere Links ⚡
- same topic appearing in two spheres
- same artifact used in multiple workflows
- same decision impacting several domains
- **same user involvement across spheres** ⚡

### ALLOWED ⚡
> *"Sphere A references Topic X also used in Sphere B."*

### NOT ALLOWED ⚡
| Statement | Status |
|-----------|--------|
| "Sphere B should follow Sphere A" | ❌ |
| "Sphere A influences Sphere B" | ❌ |
| "Sphere B is better/worse" | ❌ |

### Cross-Sphere Graph ⚡

**Nodes:**
- spheres
- knowledge clusters
- threads

**Edges:**
- shared topic
- shared artifact
- **timeline adjacency** ⚡
- **repeat-usage** ⚡

### Cross-Sphere Map JSON ⚡

```json
{
  "cross_sphere_map": {
    "nodes":[...],
    "edges":[{"a":"sphereA","b":"sphereB","reason":"shared_topic"}]
  }
}
```

---

## 3) THREAD INTEGRITY ENGINE ⚡

### Purpose
Preserve the **TRUTHFUL structure** of threads by ensuring:
- no rewriting
- no hallucination
- no inferred causality
- **clear source traceability** ⚡

### Integrity Layers ⚡

| Layer | Name | Description |
|-------|------|-------------|
| **L1** | **SOURCE LOCK** | Every node references a verifiable replay/artifact ⚡ |
| **L2** | **HASH CHAIN** | `hash(n+1) = sha256(previous_hash + new_content)` ⚡ |
| **L3** | **INTERPRETATION BLOCKER** | Forbids implications, predictions, judgments, emotional labels ⚡ |
| **L4** | **VISIBILITY FILTER** | Users only see threads from spheres they have access to ⚡ |

### Integrity JSON ⚡

```json
{
  "integrity": {
    "source_lock": true,
    "hash_chain": true,
    "no_inference_mode": true,
    "visibility_filter": "user_scope"
  }
}
```

---

## 4) KNOWLEDGE THREAD NAVIGATION (USER + AGENT) ⚡

### Interactions ⚡
| Action | Description |
|--------|-------------|
| `expand_thread` | ✅ |
| `collapse_thread` | ✅ |
| `jump_to_source` | ⚡ |
| `compare_threads` | ⚡ |
| `filter_by_sphere` | ✅ |
| `filter_by_topic` | ✅ |
| `timeline_overlay` | ⚡ |

### NO ⚡
| Forbidden | Status |
|-----------|--------|
| suggestions | ❌ |
| prioritization | ❌ |
| ranking | ❌ |
| **emotional indicators** | ❌ ⚡ |

### Visuals ⚡
| Property | Value |
|----------|-------|
| **smooth branching** | ⚡ |
| **thread color = sphere** | ⚡ |
| **dotted lines for cross-sphere** | ⚡ |
| **hashed nodes = partial visibility** | ⚡ |

---

## 5) XR KNOWLEDGE THREAD VIEW ⚡

### XR Elements ⚡
| Element | Appearance |
|---------|------------|
| threads | **floating lines of light** ⚡ |
| nodes | **interactive orbs** ⚡ |
| cross-sphere links | **spectral bridges** ⚡ |
| replay jumps | **portals** ⚡ |
| decision points | **suspended glyphs** ⚡ |

### XR Safety ⚡
| Rule | Status |
|------|--------|
| **no parallax overload** | ✅ ⚡ |
| **no rapid motion** | ✅ ⚡ |
| **no emotional coloring** | ✅ ⚡ |

---

**END — FREEZE READY**
