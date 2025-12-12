# CHE·NU — KNOWLEDGE THREADS + LEARNING-SAFE THREAD AGENT + THREAD-BASED UNIVERSE NAVIGATION
**VERSION:** KTHREAD.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## 0) CORE CONCEPT — KNOWLEDGE THREAD

### Definition
A Knowledge Thread is a **SEQUENCE OF LINKED ELEMENTS** (meetings, replays, notes, decisions, artifacts) that tells "how something evolved over time".

### RULE
> **Thread = STRUCTURED CONTEXT**  
> **NOT story, NOT narrative spin.**

Thread links: facts, events, artifacts, decisions, references  
**No emotions, no "success/failure" tags.**

---

## 1) THREAD TYPES (3 KNOWLEDGE THREADS)

### 1.1 PERSONAL THREAD

| Property | Value |
|----------|-------|
| Scope | one user, can span multiple spheres |
| Visibility | private by default |
| Use | personal learning, long-running projects, inner reasoning trace |

```json
{
  "thread_type": "personal",
  "owner": "user_id",
  "visibility": "private|shared",
  "nodes": ["memory_id", "meeting_id", "artifact_id"]
}
```

**RULE:** Only owner can expand or share. No collective metrics. Purely reflective.

### 1.2 COLLECTIVE THREAD

| Property | Value |
|----------|-------|
| Scope | team / group / org, across meetings, spheres |
| Visibility | group, org, or public |
| Use | shared initiatives, project arcs, institutional memory |

```json
{
  "thread_type": "collective",
  "group_id": "team_or_org_id",
  "visibility": "group|org|public",
  "nodes": ["meeting_id", "decision_id", "artifact_id"]
}
```

**RULE:** Append-only. Based on validated events. No emotional/value labels. Can be forked, not rewritten.

### 1.3 CROSS-SPHERE THREAD

| Property | Value |
|----------|-------|
| Scope | connects multiple spheres (Business, Scholar, XR, etc.) |
| Use | long-term themes, tracking how an idea moves through life |

```json
{
  "thread_type": "cross_sphere",
  "topic": "string",
  "spheres": ["business","scholar","creative","xr"],
  "nodes": ["memory_id","meeting_id","artifact_id","agent_action_id"]
}
```

**RULE:** No ownership bias. Always shows all participating spheres. Never hides contradictory info.

---

## 2) THREAD CORE DATA MODEL

```json
{
  "thread_id": "uuid",
  "thread_type": "personal|collective|cross_sphere",
  "label": "string",
  "description": "string",
  "owner": "user_id|null",
  "group_id": "group_id|null",
  "topic": "string|null",
  "nodes": [
    {
      "id": "uuid",
      "kind": "memory|meeting|replay|decision|artifact|agent_action",
      "sphere": "business|scholar|xr|...",
      "timestamp": 1712345678
    }
  ],
  "created_at": "...",
  "updated_at": "...",
  "integrity_hash": "sha256"
}
```

---

## 3) LEARNING-SAFE THREAD AGENT

### Name: AGENT_THREAD_GUIDE

**Role:** Help user explore Knowledge Threads WITHOUT:
- ❌ optimizing engagement
- ❌ altering data
- ❌ hiding alternatives
- ❌ prescribing decisions

### 3.1 RESPONSIBILITIES

- ✅ Suggest existing threads relevant to current context
- ✅ Propose new thread creation when pattern emerges
- ✅ Help user attach new events/artifacts to threads
- ✅ Explain thread structure in plain language

**PROHIBITED:**
- "You should do X"
- ranking by "success"
- emotional language

### 3.2 INPUTS

- current sphere
- current meeting / replay / artifact
- user query (optional)
- Collective Memory index
- existing threads (personal + collective)

### 3.3 OUTPUTS

```json
{
  "thread_suggestions": [
    {
      "thread_id": "uuid",
      "reason": "shared_topic|shared_participants|shared_artifact",
      "confidence": 0.58
    }
  ],
  "new_thread_proposal": {
    "topic": "detected_topic",
    "initial_nodes": ["id1","id2"],
    "suggested_type": "personal|collective|cross_sphere"
  }
}
```

**User ALWAYS approves:** thread creation, node attachment, visibility

### 3.4 LEARNING-SAFE RULES

- Learns ONLY which structures users find useful
- Does NOT adapt to maximize time-in-system
- Does NOT prioritise emotionally charged content
- All learning is structural: "this pattern of linking is helpful"

---

## 4) THREAD-BASED UNIVERSE NAVIGATION

### Purpose
Use Knowledge Threads as "paths" inside Universe View to help users navigate complexity, without steering decisions.

### RULE
> **Threads = PATH OPTIONS, not recommended choices.**

### 4.1 VISUAL REPRESENTATION

| Thread Type | Visual |
|-------------|--------|
| Personal | thin, subtle lines |
| Collective | thicker, semi-highlighted |
| Cross-sphere | multi-colored braided lines |

**User can:** show/hide thread types, follow step by step, jump between nodes, view summary

### 4.2 NAVIGATION ACTIONS

- `follow_thread(thread_id)`
- `next_node(thread_id, current_node)`
- `previous_node(...)`
- `fork_thread(new_thread_id, from_node)`
- `view_thread_summary(thread_id)`

**No auto-path forcing. No auto-zoom jump without confirmation.**

### 4.3 ROUTING + THREADS (LEARNING-SAFE)

Universe Routing may use threads ONLY to suggest:
- "There is a related thread you might want to see."
- "This replay belongs to 2 ongoing threads."
- "This decision is part of a long-running cross-sphere thread."

**PROHIBITED:**
- path scoring
- "best thread" label
- priority based on engagement

---

## 5) THREAD SAFETY & ETHICS

- ✅ Threads must be auditable (who added what, when)
- ✅ Personal threads remain under full user control
- ✅ Collective threads require explicit governance rules
- ✅ Cross-sphere threads must show all included contexts

**No rewriting history. Only adding and branching.**

---

## 6) WHY THREADS MATTER IN CHE·NU

- Give temporal continuity to decisions and learning
- Connect spheres without flattening them
- Allow users to see "how we got here" calmly
- Enable navigation by meaning, not by noise

> **Threads are: the "story of facts", with no storyteller added.**

---

**END — KNOWLEDGE THREAD SYSTEM**
