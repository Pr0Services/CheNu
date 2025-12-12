# CHE·NU — KNOWLEDGE THREADS + TECHNICAL TASK MATRIX
**VERSION:** KNOWLEDGE.v1.0  
**MODE:** FOUNDATION / CROSS-SPHERE / BUILD-READY

---

## 1) KNOWLEDGE THREADS — LAYER 1: INTRA-SPHERE THREADS ⚡

### Purpose
> **Connect knowledge INSIDE a sphere (Business, Scholar, Creative, etc.) without crossing domains.**

### RULE
> **Thread = informational continuity, not interpretation.**

### 4 Thread Types ⚡
| Type | Description |
|------|-------------|
| `process_thread` | workflow evolution ⚡ |
| `artifact_thread` | documents + versions ⚡ |
| `meeting_thread` | sessions linked ⚡ |
| `agent_thread` | **same agent across tasks** ⚡ |

### Intra-Sphere Thread JSON ⚡
```json
{
  "thread_id": "uuid",
  "scope": "intra",
  "sphere": "business",
  "nodes": ["item_id", "meeting_id", "file_id"],
  "links": ["derived_from", "continued_by", "referenced_in"],
  "hash": "sha256"
}
```

### Intra-Sphere Visual ⚡
| Property | Value |
|----------|-------|
| **thin lines** | ⚡ |
| **color = sphere color** | ⚡ |
| **optional timeline overlay** | ⚡ |

---

## 2) KNOWLEDGE THREADS — LAYER 2: INTER-SPHERE THREADS ⚡

### Purpose
> **Show when knowledge travels from one sphere to another:** Business → Scholar → XR → Creative → Institution

### RULE
> **No causal assumptions. Simply reveals cross-pollination.**

### 4 Thread Types ⚡
| Type | Description |
|------|-------------|
| `cross_domain_artifact` | ⚡ |
| `cross_domain_decision` | ⚡ |
| `cross_domain_meeting` | ⚡ |
| `cross_domain_agent_mobility` | **agent moved between spheres** ⚡ |

### Inter-Sphere Thread JSON ⚡
```json
{
  "thread_id": "uuid",
  "scope": "inter",
  "from": "business",
  "to": "creative",
  "entities": ["file", "decision", "agent_action"],
  "confidence": 1.0,
  "hash": "sha256"
}
```

### Inter-Sphere Visual ⚡
| Property | Value |
|----------|-------|
| **thicker glowing line** | ⚡ |
| **"jump points" animated** | ⚡ |
| **user can toggle inter-sphere visibility** | ⚡ |

---

## 3) KNOWLEDGE THREADS — LAYER 3: COLLECTIVE INTELLIGENCE THREADS ⚡

### Purpose
> **Highlight emergent patterns across many users, many spheres, many meetings.**

### RULE
> **Patterns MUST be statistically neutral. No predictive or persuasive modeling.**

### 4 Pattern Types ⚡
| Type | Description |
|------|-------------|
| `repeated decision paths` | ⚡ |
| `recurring artifact patterns` | ⚡ |
| `multi-sphere topic clusters` | ⚡ |
| `timeline convergence patterns` | **multiple timelines converge** ⚡ |

### Collective Thread JSON ⚡
```json
{
  "thread_id": "uuid",
  "scope": "collective",
  "pattern_type": "topic|timeline|artifact|decision",
  "sample_size": 42,
  "thread_nodes": ["..."],
  "strength": 0.47,
  "hash": "sha256"
}
```

### Key Field: `strength: 0.47` ⚡
> **Statistical strength, NOT importance or priority**

### Collective Visual ⚡
| Property | Value |
|----------|-------|
| **shimmering mesh** | ⚡ |
| **dotted links** | ⚡ |
| **hover = shows anonymized clusters** | ⚡ |

---

## 4) TECHNICAL TASK MATRIX — COMPLETE TREE ⚡

### 5 Top-Level Tasks ⚡
| # | Task |
|---|------|
| 1 | THREAD EXTRACTION ENGINE |
| 2 | THREAD STORAGE LAYER |
| 3 | THREAD VISUALIZATION RENDERER |
| 4 | THREAD-TO-SPHERE SYNC |
| 5 | **THREAD SAFETY & ETHICS GUARD** |

---

### TASK 1 — EXTRACTION ENGINE ⚡

| Sub-Task | Description |
|----------|-------------|
| 1.1 | Detect artifacts across meetings |
| 1.2 | Find references (citations, reuse, continuation) |
| 1.3 | Normalize timestamps |
| 1.4 | Generate directional links |
| 1.5 | Compute integrity hash |
| 1.6 | **Validate with Ethics Guard (no inference, no persuasion)** |

---

### TASK 2 — STORAGE LAYER ⚡

| Sub-Task | Description |
|----------|-------------|
| 2.1 | Create "threads" table |
| 2.2 | Link to existing replay DB |
| 2.3 | Version control (append-only) |
| 2.4 | Auto-clean orphan links |
| 2.5 | Replication across spheres |
| 2.6 | **Build index for fast XR retrieval** |

---

### TASK 3 — VISUALIZATION ⚡

| Sub-Task | Description |
|----------|-------------|
| 3.1 | 2D renderer (React Canvas) |
| 3.2 | 3D XR renderer (Three.js / WebXR) |
| 3.3 | Line clustering + curve smoothing |
| 3.4 | Color logic per sphere |
| 3.5 | Toggle by scope (intra/inter/collective) |
| 3.6 | **Mobile mini-map fallback** |

---

### TASK 4 — SPHERE SYNC ⚡

| Sub-Task | Description |
|----------|-------------|
| 4.1 | Register knowledge events per sphere |
| 4.2 | Emit cross-sphere signals |
| 4.3 | Update Universe View |
| 4.4 | Rebuild clusters dynamically |
| 4.5 | Maintain user-specific filter profiles |
| 4.6 | **Conflict resolution rules (no duplicates)** |

---

### TASK 5 — ETHICS + SAFETY GUARD ⚡

| Sub-Task | Description |
|----------|-------------|
| 5.1 | Detect biased threads (remove) |
| 5.2 | Prevent causal inference |
| 5.3 | Prevent narrative shaping |
| 5.4 | **No "performance scores"** |
| 5.5 | Ensure anonymity when cross-user |
| 5.6 | **Human-readable audit report** |

---

## 5) AUTOMATED PROMPT CHAIN (FOR AGENTS) ⚡

### 6-Step Chain ⚡
| Step | Prompt | Description |
|------|--------|-------------|
| **A** | NORMALIZE | "Normalize this artifact. No interpretation." |
| **B** | LINK | "Identify connections. Only factual links." |
| **C** | CLASSIFY | "Intra, Inter, or Collective Thread classification." |
| **D** | VALIDATE | "Run Ethics Guard. Remove any inferred meaning." |
| **E** | STORE | "Append-only write. Apply hash." |
| **F** | VISUAL PREP | **"Prepare render nodes for Universe View and XR."** |

### Chain Flow ⚡
```
NEW KNOWLEDGE → A (Normalize) → B (Link) → C (Classify) → D (Validate) → E (Store) → F (Visual)
```

---

## 6) DOCUMENT TRANSFER AUTOMATION ⚡

### RULE
> **Documents travel with metadata only. No rewriting, no summarization unless requested.**

### 5-Step Workflow ⚡
| Step | Action |
|------|--------|
| 1 | User drops doc → Sphere Organizing Agent tags it |
| 2 | Metadata extraction → thread engine notified |
| 3 | Knowledge thread updated → replay referencing |
| 4 | Universe View gets new node |
| 5 | **XR space gets artifact anchor** |

### Allowed Metadata ⚡
| Allowed | Status |
|---------|--------|
| timestamp | ✅ ⚡ |
| sphere | ✅ ⚡ |
| author (optional) | ✅ ⚡ |
| topic keywords | ✅ ⚡ |
| related meetings | ✅ ⚡ |

### Forbidden Metadata ⚡
| Forbidden | Status |
|-----------|--------|
| **sentiment** | ❌ ⚡ |
| **evaluation** | ❌ ⚡ |
| **inferred meaning** | ❌ ⚡ |

---

## 7) SEPARATION OF TECHNICAL LAYERS ⚡

### 4-Layer Architecture ⚡
| Layer | Components |
|-------|------------|
| **LOGIC LAYER** | agents: extract, classify, validate |
| **STORAGE LAYER** | append-only DB, hashed |
| **VISUAL LAYER** | 2D React, 3D XR |
| **USER LAYER** | filters, navigation profiles |

### Layer Diagram ⚡
```
┌─────────────────────────────────────┐
│         USER LAYER                  │
│    (filters, navigation profiles)   │
├─────────────────────────────────────┤
│         VISUAL LAYER                │
│       (2D React, 3D XR)             │
├─────────────────────────────────────┤
│         STORAGE LAYER               │
│    (append-only DB, hashed)         │
├─────────────────────────────────────┤
│         LOGIC LAYER                 │
│  (agents: extract, classify, validate)│
└─────────────────────────────────────┘
```

---

**END — FREEZE READY — SAFE FOR CLAUDE / COPILOT**
