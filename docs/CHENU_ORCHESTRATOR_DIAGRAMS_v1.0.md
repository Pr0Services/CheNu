# CHE·NU — Diagrammes Orchestrateur
> Version: 1.0 | Architecture & Flux

---

## 1. Vue Système Globale

```mermaid
flowchart LR
    U[User] --> UI[CHE-NU Frontend<br/>CHE·NU UI]
    UI --> API[Backend API Service]
    API --> ORCH[Orchestrator / LLM Router<br/>CHE·NU CORE+]
    ORCH --> LLM[(LLM Provider)]
    ORCH --> AGENTS[CHE·NU Agents Layer]
    API --> DB[(PostgreSQL DB)]
    API --> XR_GATE[XR Gateway]
    XR_GATE --> XR_CLIENT[XR Client<br/>Unity / Unreal]

    subgraph Agents
      NOVA[Nova Prime<br/>Intent & Plan]
      ARCH[Architect Ω<br/>Structure]
      WEAVE[Thread Weaver ∞<br/>Timeline]
      ECHO[EchoMind<br/>Tone]
      XR[Reality Synthesizer<br/>XR & PXR]
      CSF[CSF Simulator<br/>Scenarios]
      SPEC[Specialized Agents<br/>Marketing/Data/Legal/...]
    end

    AGENTS --> NOVA
    AGENTS --> ARCH
    AGENTS --> WEAVE
    AGENTS --> ECHO
    AGENTS --> XR
    AGENTS --> CSF
    AGENTS --> SPEC
```

---

## 2. Flow d'une Requête Typique

```mermaid
sequenceDiagram
    participant U as User
    participant UI as CHE-NU UI
    participant API as API Backend
    participant ORCH as CHE·NU Orchestrator
    participant LLM as LLM Core
    participant DB as DB

    U->>UI: Action (ex: créer tâche, lancer workflow)
    UI->>API: HTTP POST /orchestrator/dispatch (task payload)
    API->>ORCH: call dispatch(task)

    ORCH->>ORCH: Determine task.type + route
    ORCH->>LLM: system_prompt(CHE·NU ULTRA) + task JSON
    LLM-->>ORCH: structured response (plan + steps)

    ORCH->>API: result + agent suggestions
    API->>DB: save task / decisions / threads
    API-->>UI: réponse structurée / plan / interface updates
```

---

## 3. Flux avec XR & PXR

```mermaid
sequenceDiagram
    participant U as User
    participant UI as CHE·NU UI
    participant API as Backend
    participant ORCH as Orchestrator
    participant XR_GATE as XR Gateway
    participant XR_CLIENT as XR App

    U->>UI: "Ouvrir en XR"
    UI->>API: POST /xr/render (context: task/thread)
    API->>ORCH: request XR scene description

    ORCH->>LLM: prompt XR (CHE·NU ULTRA + XR mode)
    LLM-->>ORCH: XR room spec + personas + layout

    ORCH->>API: XR JSON spec
    API->>XR_GATE: send XR spec
    XR_GATE->>XR_CLIENT: render XR room (Unity/Unreal)
```

---

## 4. Architecture Complète

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER LAYER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   Web UI    │  │  Mobile App │  │  XR Client  │                 │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                 │
└─────────┼────────────────┼────────────────┼─────────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  /api/orchestrator  │  /api/agents  │  /api/xr  │  /api/...  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ORCHESTRATION LAYER                            │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │            CHE·NU CORE+ / ULTRA PACK                       │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │    │
│  │  │ Task     │  │ LLM      │  │ Agent    │  │ Output   │   │    │
│  │  │ Router   │  │ Router   │  │ Manager  │  │ Protocol │   │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         AGENTS LAYER                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │  Nova   │ │Architect│ │ Thread  │ │  Echo   │ │ Reality │      │
│  │  Prime  │ │  Omega  │ │ Weaver  │ │  Mind   │ │Synthesiz│      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│  ┌─────────┐ ┌─────────┐ ┌─────────────────────────────────┐      │
│  │   CSF   │ │   PXR   │ │      Specialized Agents         │      │
│  │Simulator│ │ Engine  │ │ Marketing│Data│Legal│Finance... │      │
│  └─────────┘ └─────────┘ └─────────────────────────────────┘      │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  PostgreSQL  │  │    Redis     │  │  Vector DB   │              │
│  │   (Core DB)  │  │   (Cache)    │  │ (Embeddings) │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

---

**CHE·NU ORCHESTRATOR — SYSTEM ARCHITECTURE** 🚀
