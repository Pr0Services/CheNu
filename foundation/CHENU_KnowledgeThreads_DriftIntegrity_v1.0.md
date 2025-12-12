# CHE·NU — KNOWLEDGE THREADS + DRIFT DETECTION & INTEGRITY
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / TRUTH-PRESERVING / NON-MANIPULATIVE

---

## GLOBAL PRINCIPLE

> **Knowledge Threads connect INFORMATION,**  
> **NOT opinions, NOT intent, NOT conclusions.**

Truth is preserved by:
- traceability
- immutability
- signatures
- explicit drift detection

---

## THE 3 KNOWLEDGE THREAD TYPES

### THREAD TYPE 1 — FACT THREAD

| Property | Value |
|----------|-------|
| Purpose | Track factual information across time |
| Sources | documents, decisions, verified artifacts, XR replays |
| Characteristics | time-stamped, source-linked, append-only |

**Example:** "Budget approved" → referenced in 3 meetings → cited in report

---

### THREAD TYPE 2 — CONTEXT THREAD

| Property | Value |
|----------|-------|
| Purpose | Track WHY something appeared in context, without interpreting intent |
| Sources | meeting context, sphere, participating agents, artifacts present |
| Characteristics | descriptive only, no inference, no sentiment |

**Example:** Decision happened during "Review phase" in "Business sphere"

---

### THREAD TYPE 3 — EVOLUTION THREAD

| Property | Value |
|----------|-------|
| Purpose | Track HOW information evolved structurally |
| Sources | fact thread deltas, version changes, artifact updates, replay comparisons |
| Characteristics | change-only, diff-based, chronological |

**Example:** Draft → revision → approval → archival

---

## CANONICAL KNOWLEDGE THREAD MODEL

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "fact|context|evolution",
    "nodes": [
      {
        "node_id": "uuid",
        "source": "meeting|document|agent|replay",
        "timestamp": 1712345678,
        "hash": "sha256",
        "reference": "source_id"
      }
    ],
    "visibility": "private|shared|sphere|global",
    "integrity": "verified"
  }
}
```

---

## DRIFT DETECTION — CORE CONCEPT

### Definition

> **Drift = divergence between original factual state and later representation**

### Key Distinction

| Drift is... | Drift is NOT... |
|-------------|-----------------|
| A SIGNAL | An error |
| Detectable | Automatically wrong |
| Informative | Blame assignment |

---

## DRIFT TYPES

### 1) STRUCTURAL DRIFT
- missing nodes
- reordered sequence
- altered version chain

### 2) CONTEXT DRIFT
- same fact shown in incompatible contexts
- sphere mismatch
- time displacement

### 3) REFERENCE DRIFT
- fact referenced without source
- source replaced or omitted

---

## DRIFT DETECTION RULES

### Drift Detection IS
- ✅ passive only
- ✅ no correction
- ✅ no alert fatigue
- ✅ visible on demand

### Drift Detection NEVER
- ❌ auto-fixes
- ❌ assigns blame
- ❌ hides content

---

## DRIFT SIGNATURE MODEL

```json
{
  "drift_event": {
    "thread_id": "uuid",
    "drift_type": "structural|context|reference",
    "detected_at": 1712349999,
    "original_hash": "sha256",
    "current_hash": "sha256",
    "delta_summary": "text",
    "severity": "low|medium|high"
  }
}
```

---

## SIGNATURES & INTEGRITY PROOF

### Each Thread Node Includes
- content hash
- source reference
- parent hash (if applicable)

### Integrity is Proven By
- chain verification
- replay anchoring
- immutable timestamps

---

## INTEGRITY VERIFICATION FLOW

```
1. verify hash chain
         ↓
2. match source replay
         ↓
3. confirm timestamp order
         ↓
4. validate visibility scope
         ↓
5. confirm no silent deletion
         ↓
   ┌─────┴─────┐
   │           │
 PASS        FAIL
   │           │
   ↓           ↓
verified   integrity_status = "broken"
           content remains visible (marked only)
```

---

## INTEGRITY PROOF JSON

```json
{
  "integrity_proof": {
    "thread_id": "uuid",
    "verified": true,
    "last_checked": 1712351111,
    "proof_level": "full",
    "notes": []
  }
}
```

---

## VISUALIZATION (NON-MANIPULATIVE)

| Element | Style |
|---------|-------|
| Thread lines | neutral color |
| Drift markers | small glyphs |
| Judgment colors | ❌ NO red/green |
| Layers | toggleable |

---

## WHY THIS MATTERS

### Knowledge Threads
- prevent silent rewriting
- expose divergence without accusation
- preserve memory across time
- scale across spheres

### Drift Detection
- protects truth
- protects users
- protects the system

---

**END — FOUNDATION FREEZE**
