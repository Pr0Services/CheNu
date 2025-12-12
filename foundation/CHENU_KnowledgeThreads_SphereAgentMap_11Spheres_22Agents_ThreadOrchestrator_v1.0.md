# CHE·NU — KNOWLEDGE THREADS + SPHERE AGENT MAP
**VERSION:** KNOWLEDGE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## A) KNOWLEDGE THREADS — CORE CONCEPT ⚡

### Definition
> **A KNOWLEDGE THREAD is a traceable chain of:** questions, information, decisions, artifacts, replays across time, spheres, users, and agents.

### RULE
> **Thread = STRUCTURED CONTEXT, not opinion.**

### 3 Canonical Thread Types ⚡
| Type | Scope | Use Cases |
|------|-------|-----------|
| **1) PERSONAL THREAD** | ONE user, spans multiple spheres | long-term learning, personal projects, self-reflection ⚡ |
| **2) COLLECTIVE THREAD** | **TEAM / GROUP**, shared ownership | team projects, institutional decisions, cross-sphere initiatives ⚡ |
| **3) CROSS-SPHERE THREAD** | **spans multiple spheres explicitly** | multi-domain research, strategic planning, cross-institutional collaboration ⚡ |

---

## B) KNOWLEDGE THREAD DATA MODEL ⚡

```json
{
  "knowledge_thread": {
    "id": "uuid",
    "type": "personal|collective|cross_sphere",
    "owner": "user_id|null",
    "participants": ["user_id", "agent_id"],
    "spheres": ["personal", "business", "scholar", "creative", "xr", "institution", "methodology", "social", "ai_lab", "my_team"],
    "entries": [
      {
        "entry_id": "uuid",
        "timestamp": 1712345678,
        "source": "meeting|replay|note|artifact|agent",
        "sphere": "business|scholar|...",
        "payload_ref": "object_id_or_hash",
        "kind": "question|info|decision|reflection|link"
      }
    ],
    "created_at": "...",
    "updated_at": "...",
    "hash": "sha256"
  }
}
```

### Key Field: `kind` ⚡ (NOUVEAU!)
| Kind | Description |
|------|-------------|
| `question` | ⚡ |
| `info` | ⚡ |
| `decision` | ⚡ |
| `reflection` | ⚡ |
| `link` | ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **append-only** | ✅ ⚡ |
| **entries signed & time-stamped** | ✅ ⚡ |
| **no retro-active rewriting** | ✅ ⚡ |

---

## C) THREAD BEHAVIOR & SAFETY ⚡

| Forbidden | Status |
|-----------|--------|
| **No auto-merge of incompatible threads** | ✅ ⚡ |
| **No automated "best answer" marking** | ✅ ⚡ |
| **No sentiment or belief tagging** | ✅ ⚡ |
| **No hidden reordering** | ✅ ⚡ |

### User Can ⚡
- pin entries
- link threads
- branch a new thread
- **anonymize when allowed**

---

## D) THREAD VISUALIZATION (UNIVERSE VIEW) ⚡

| Thread Type | Visualization |
|-------------|---------------|
| **Personal** | subtle, user-colored lines ⚡ |
| **Collective** | **thicker lines around shared nodes** ⚡ |
| **Cross-sphere** | **braided multi-color lines** ⚡ |

### Controls ⚡
- show / hide threads
- isolate one thread
- **compare two threads**
- export as PDF or graph

---

## E) SPHERE AGENT MAP — KNOWLEDGE ROLES ⚡

### RULE
> **Agents help STRUCTURE, not influence opinions.**

### 👤 SPHERE: PERSONAL ⚡
| Agent | Role |
|-------|------|
| `AGENT_PERSONAL_CURATOR` | organizes personal notes & memories, **never shares without explicit consent** ⚡ |
| `AGENT_PERSONAL_REFLECTION` | suggests summaries & checkpoints **(on request only)** ⚡ |

### 🏢 SPHERE: BUSINESS ⚡
| Agent | Role |
|-------|------|
| `AGENT_BUSINESS_KNOWLEDGE` | indexes decisions, docs, metrics, **links meetings → artifacts → decisions** ⚡ |
| `AGENT_PIPELINE_HISTORIAN` | **maintains timeline of business changes** ⚡ |

### 🎓 SPHERE: SCHOLAR ⚡
| Agent | Role |
|-------|------|
| `AGENT_SCHOLAR_LIBRARIAN` | maps sources, references, research steps ⚡ |
| `AGENT_SCHOLAR_SYNTHESIS` | produces neutral syntheses, **never states "truth", only structure** ⚡ |

### 🎨 SPHERE: CREATIVE STUDIO ⚡
| Agent | Role |
|-------|------|
| `AGENT_CREATIVE_ARCHIVER` | **tracks creative iterations** ⚡ |
| `AGENT_CREATIVE_EXPLORER` | surfaces older relevant threads, **helps avoid duplication** ⚡ |

### 🎉 SPHERE: SOCIAL & MEDIA ⚡
| Agent | Role |
|-------|------|
| `AGENT_SOCIAL_CONTEXT` | separates noise vs long-term relevant content ⚡ |
| `AGENT_SIGNAL_FILTER` | **NEVER ranks by engagement, only by relevancy to thread context** ⚡ |

### 🏛️ SPHERE: INSTITUTIONS / GOVERNMENT ⚡
| Agent | Role |
|-------|------|
| `AGENT_INSTITUTION_RECORDER` | **creates audit-grade collective threads** ⚡ |
| `AGENT_POLICY_LINKER` | connects old decisions to new proposals, **enforces traceability** ⚡ |

### 🧠 SPHERE: METHODOLOGY ⚡
| Agent | Role |
|-------|------|
| `AGENT_METHODOLOGIST` | annotates threads with methodology info ⚡ |
| `AGENT_METHOD_EVALUATOR` | **suggests process improvements (on request)** ⚡ |

### 🕶️ SPHERE: XR / IMMERSIVE ⚡
| Agent | Role |
|-------|------|
| `AGENT_XR_MEMORY_BINDER` | **binds XR replays to threads** ⚡ |
| `AGENT_XR_CONTEXT_RENDERER` | visualizes threads in XR as **paths, constellations, layers** ⚡ |

### 🎭 SPHERE: ENTERTAINMENT / DIVERTISSEMENT ⚡
| Agent | Role |
|-------|------|
| `AGENT_ENTERTAINMENT_TRACKER` | **keeps play separated from critical knowledge** ⚡ |
| `AGENT_FUN_SANDBOX` | marks low-stakes exploratory threads clearly ⚡ |

### 🤖 SPHERE: AI LAB ⚡
| Agent | Role |
|-------|------|
| `AGENT_AI_LAB_NOTEKEEPER` | logs experiments, prompts, models tested ⚡ |
| `AGENT_ALIGNMENT_OBSERVER` | **tracks changes in AI behavior, no enforcement, only observation** ⚡ |

### 🤝 SPHERE: MY TEAM ⚡
| Agent | Role |
|-------|------|
| `AGENT_TEAM_COORDINATOR` | **maps who contributed what, when** ⚡ |
| `AGENT_HANDOVER_ASSISTANT` | uses threads to onboard new members, **never omits history** ⚡ |

---

## F) THREAD AGENT COORDINATION ⚡

### GLOBAL AGENT: THREAD_ORCHESTRATOR ⚡
| Responsibility | Description |
|----------------|-------------|
| **ensures no duplication of thread IDs** | ⚡ |
| **resolves cross-sphere references** | ⚡ |
| **validates hash integrity** | ⚡ |
| **never edits content, only links** | ⚡ |

---

## WHY THIS FITS CHE·NU ⚡

### Knowledge Threads ⚡
- give **continuity to your story**
- keep track of decisions and context
- **prevent "AI memory loss"**

### Sphere Agents ⚡
- ensure each domain treats knowledge with respect
- **organize without manipulation**
- allow humans to navigate complexity with clarity

---

**END — KNOWLEDGE THREADS & AGENT MAP FREEZE**
