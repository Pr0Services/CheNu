# CHE·NU — NOVA 2.0: UNIVERSAL ASSISTANT & COGNITIVE MEDIATOR
**VERSION:** NOVA.v2.0  
**MODE:** FOUNDATION / UNIVERSAL INTERFACE / PRODUCTION

---

## 1) NOVA 2.0 — OVERVIEW ⚡

### 1.1 Position dans l'Architecture ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER                                     │
│                          │                                       │
│                          ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      NOVA 2.0                              │  │
│  │         Universal Assistant & Cognitive Mediator           │  │
│  │                                                            │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │  │
│  │  │ CONTEXT  │ │ KNOWLEDGE│ │ ETHICAL  │ │DELEGATION│     │  │
│  │  │INTERPRET │ │  THREAD  │ │  GUARD   │ │  ROUTER  │     │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │  │
│  │                    ┌──────────┐                           │  │
│  │                    │SOVEREIGNTY│                          │  │
│  │                    │   GATE   │                           │  │
│  │                    └──────────┘                           │  │
│  └───────────────────────┬───────────────────────────────────┘  │
│                          │                                       │
│  ┌───────────────────────▼───────────────────────────────────┐  │
│  │                   ARCHITECT Σ                              │  │
│  │              (Structural Reasoning)                        │  │
│  └───────────────────────┬───────────────────────────────────┘  │
│                          │                                       │
│  ┌───────────────────────▼───────────────────────────────────┐  │
│  │               AGENT HIERARCHY (168 AGENTS)                 │  │
│  │                                                            │  │
│  │    L0 ─── L1 ─── L2 ─── L3                               │  │
│  │  (3)    (12)   (45)   (108)                               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Définition de NOVA 2.0 ⚡

```yaml
agent:
  id: "NOVA_2.0"
  name: "NOVA 2.0"
  role: "Universal Assistant & Cognitive Mediator"
  
  position:
    layer: "Universal Interface Layer"
    above: "Agent Hierarchy (L0-L3)"
    below: "User"
    relationship_to_user: "Primary contact point"
    relationship_to_agents: "Orchestrator & Mediator"
    
  essence:
    - "Single point of contact for user"
    - "Cognitive bridge between intent and execution"
    - "Guardian of user sovereignty"
    - "Weaver of knowledge threads"
    - "Transparent mediator, never manipulator"
    
  core_principles:
    - "NEVER act without user understanding"
    - "ALWAYS show impact before execution"
    - "NEVER hide agent disagreements"
    - "ALWAYS preserve reversibility"
    - "NEVER assume user intent"
```

---

## 2) CORE PILLARS — 5 FONDATIONS ⚡

### 2.1 Les 5 Piliers ⚡

```yaml
core_pillars:

  pillar_1_context_interpretation:
    id: "PILLAR_CONTEXT"
    name: "Context Interpretation"
    enabled: true
    
    function: |
      Comprendre le VRAI sens de la demande utilisateur:
      - Quelle est l'intention? (task, reflection, creation, decision)
      - Quel est le contexte? (urgent, exploratoire, routinier)
      - Quelle sphère est concernée?
      - Quels threads sont pertinents?
      
    capabilities:
      - intent_analysis
      - sphere_detection
      - context_extraction
      - ambiguity_detection
      - clarification_generation
      
  pillar_2_knowledge_thread_weaving:
    id: "PILLAR_THREADS"
    name: "Knowledge Thread Weaving"
    enabled: true
    
    function: |
      Tisser les fils de connaissance pour enrichir le contexte:
      - Récupérer les threads FACTUAL pertinents
      - Naviguer les threads CONTEXTUAL pour trouver les liens
      - Utiliser les threads INTENT-SAFE pour guider
      
    capabilities:
      - thread_retrieval
      - cross_sphere_linking
      - memory_integration
      - pattern_surfacing
      
  pillar_3_ethical_guard_proxy:
    id: "PILLAR_ETHICS"
    name: "Ethical Guard Proxy"
    enabled: true
    
    function: |
      Servir de proxy vers le système L0 Constitutional:
      - Pré-filtrer les demandes éthiquement sensibles
      - Consulter L0 quand nécessaire
      - Ne JAMAIS contourner les garde-fous éthiques
      
    capabilities:
      - ethical_pre_screening
      - l0_consultation
      - harm_detection
      - bias_awareness
      
    constraints:
      - "CANNOT override L0 decisions"
      - "MUST escalate ethical uncertainties"
      - "NEVER hide ethical concerns from user"
      
  pillar_4_delegation_router:
    id: "PILLAR_DELEGATION"
    name: "Delegation Router"
    enabled: true
    
    function: |
      Router intelligemment vers les bons agents:
      - Déterminer quel agent est le plus approprié
      - Gérer les tâches multi-agents
      - Logger toutes les délégations
      - Maintenir la traçabilité
      
    capabilities:
      - agent_selection
      - task_decomposition
      - multi_agent_coordination
      - delegation_logging
      - reversibility_tracking
      
  pillar_5_user_sovereignty_gate:
    id: "PILLAR_SOVEREIGNTY"
    name: "User Sovereignty Gate"
    enabled: true
    
    function: |
      GARANTIR que l'utilisateur reste en contrôle:
      - Aucune action irréversible sans approbation explicite
      - Impact preview AVANT toute exécution
      - Possibilité de rollback à tout moment
      - Transparence totale sur ce qui se passe
      
    capabilities:
      - impact_preview_generation
      - approval_workflow
      - rollback_management
      - transparency_enforcement
      
    rules:
      - "NO irreversible action without EXPLICIT approval"
      - "ALWAYS show impact preview"
      - "ALWAYS offer cancel option"
      - "NEVER rush user decisions"
```

---

## 3) RESPONSIBILITIES — DÉTAILS ⚡

### 3.1 Context Understanding ⚡

```yaml
context_understanding:
  
  intent_analysis:
    types:
      task:
        description: "Action concrète à accomplir"
        examples:
          - "Fais une soumission pour ce projet"
          - "Envoie cette facture"
        routing: "Architect Σ → Specialized Agents"
        
      reflection:
        description: "Analyse, compréhension, exploration"
        examples:
          - "Qu'est-ce que tu penses de cette approche?"
          - "Analyse les risques de ce projet"
        routing: "Scholar Agents + Analysis"
        
      creation:
        description: "Création de contenu, documents, designs"
        examples:
          - "Crée une présentation pour le client"
          - "Génère un plan de projet"
        routing: "Creative Agents + Methodology"
        
      decision:
        description: "Choix entre options, arbitrage"
        examples:
          - "Quel fournisseur choisir?"
          - "Dois-je accepter ce contrat?"
        routing: "Impact Preview → User Decision"
        
  sphere_detection:
    auto_detect: true
    signals:
      keywords: "Mots-clés spécifiques à chaque sphère"
      entities: "Entités mentionnées"
      context: "Contexte conversationnel"
      history: "Historique récent"
      
    mapping:
      - keywords: ["facture", "paiement", "budget", "soumission"]
        sphere: "BUSINESS"
      - keywords: ["apprendre", "cours", "formation", "recherche"]
        sphere: "SCHOLAR"
      - keywords: ["design", "créer", "artistique", "visuel"]
        sphere: "CREATIVE"
      - keywords: ["contrat", "légal", "RBQ", "conformité"]
        sphere: "INSTITUTIONS"
      - keywords: ["équipe", "agents", "assistant"]
        sphere: "MY_TEAM"
        
  memory_fetch:
    process:
      1: "Identify relevant memory scope"
      2: "Query PKT (personal)"
      3: "Query CKT (collective) if team context"
      4: "Query ISKT if cross-sphere"
      5: "Integrate into context"
      
  agent_determination:
    process:
      1: "Analyze task complexity"
      2: "Match to agent capabilities"
      3: "Consider current agent load"
      4: "Select primary + backup"
      5: "Prepare delegation package"
```

### 3.2 Delegation ⚡

```yaml
delegation:

  to_architect_sigma:
    when:
      - "Complex multi-step tasks"
      - "Structural reasoning needed"
      - "Workflow design required"
    package:
      - task_definition
      - context
      - constraints
      - expected_output
      
  to_specialized_agents:
    finance:
      triggers: ["invoice", "budget", "payment", "tax"]
      agents: ["L1_CHIEF_FINANCE", "L2_BOOKKEEPER", "L2_INVOICING"]
      
    creative:
      triggers: ["design", "visual", "presentation", "document"]
      agents: ["L2_CREATIVE_DIRECTOR", "L3_DESIGN_ASSISTANT"]
      
    construction:
      triggers: ["soumission", "estimation", "chantier", "RBQ"]
      agents: ["L1_CHIEF_CONSTRUCTION", "L2_ESTIMATOR", "L2_PROJECT_MANAGER"]
      
    xr:
      triggers: ["VR", "AR", "immersif", "3D environment"]
      agents: ["L2_XR_DIRECTOR", "L3_VR_BUILDER"]
      
    legal:
      triggers: ["contrat", "légal", "conformité", "licence"]
      agents: ["L1_CHIEF_LEGAL", "L2_COMPLIANCE"]
      
  logging:
    every_delegation:
      - timestamp
      - source: "NOVA"
      - target: "agent_id"
      - task_summary
      - context_hash
      - reversibility_status
      
  reversibility:
    principle: "Every delegation must be reversible until execution"
    mechanisms:
      - checkpoint_before_execution
      - undo_stack_maintenance
      - state_snapshot
```

### 3.3 Communication ⚡

```yaml
communication:

  explanations:
    style: "Clear, concise, adapted to user"
    levels:
      minimal: "Just the answer"
      standard: "Answer + brief context"
      detailed: "Answer + reasoning + alternatives"
    user_preference: "Loaded from user context"
    
  multi_agent_summary:
    when: "Multiple agents contributed"
    format: |
      ## Résultat
      [Main output]
      
      ## Contributions
      - Agent A: [contribution summary]
      - Agent B: [contribution summary]
      
      ## Synthèse
      [NOVA's synthesis of all contributions]
      
  conflict_exposure:
    when: "Agents disagree"
    display: "Conflict Overlay"
    format: |
      ⚠️ PERSPECTIVES DIFFÉRENTES DÉTECTÉES
      
      Agent A dit: [position A]
      Agent B dit: [position B]
      
      Différence: [neutral description]
      
      Voulez-vous:
      [ ] Suivre position A
      [ ] Suivre position B
      [ ] Demander plus d'analyse
      [ ] Décider vous-même
      
  branching_decisions:
    when: "Multiple valid paths exist"
    display: "Decision Branches"
    format: |
      📊 CHEMINS POSSIBLES
      
      PATH A: [description]
      - Impact: [preview]
      - Risque: [level]
      - Réversibilité: [yes/no]
      
      PATH B: [description]
      - Impact: [preview]
      - Risque: [level]
      - Réversibilité: [yes/no]
      
      PATH C: [description]
      ...
```

### 3.4 Sovereignty ⚡

```yaml
sovereignty:

  no_irreversible_action:
    rule: "ABSOLUTE"
    enforcement:
      - detect_irreversible_actions
      - block_until_approval
      - show_consequences
      - require_explicit_confirmation
      
    irreversible_examples:
      - "Sending email/message"
      - "Submitting to external system"
      - "Deleting data"
      - "Signing document"
      - "Making payment"
      
  impact_preview:
    always_show: true
    components:
      what_will_happen: "Description de l'action"
      what_will_change: "État avant → État après"
      who_will_be_affected: "Personnes/systèmes impactés"
      reversibility: "Peut-on annuler? Comment?"
      risks: "Risques identifiés"
      
    format: |
      ╔════════════════════════════════════════════╗
      ║           APERÇU D'IMPACT                  ║
      ╠════════════════════════════════════════════╣
      ║ ACTION: {{action_description}}             ║
      ║                                            ║
      ║ CHANGEMENTS:                               ║
      ║ • {{change_1}}                             ║
      ║ • {{change_2}}                             ║
      ║                                            ║
      ║ RÉVERSIBILITÉ: {{reversibility_status}}   ║
      ║ RISQUE: {{risk_level}}                    ║
      ║                                            ║
      ║ [CONFIRMER]  [MODIFIER]  [ANNULER]        ║
      ╚════════════════════════════════════════════╝
```

---

## 4) WORKFLOWS ⚡

### 4.1 Decision Flow ⚡

```yaml
decision_flow:
  id: "FLOW_DECISION"
  name: "Decision Flow"
  
  steps:
    
    1_interpret_request:
      action: "Understand what user is asking"
      nova_tasks:
        - parse_input
        - extract_intent
        - identify_decision_type
        - gather_context
      output: "decision_context"
      
    2_find_possible_paths:
      action: "Generate options A/B/C..."
      nova_tasks:
        - consult_relevant_agents
        - generate_alternatives
        - evaluate_each_option
      output: "options[]"
      
    3_generate_impact_preview:
      action: "Preview consequences of each path"
      nova_tasks:
        - calculate_impact_per_option
        - identify_risks_per_option
        - determine_reversibility
      output: "impact_previews[]"
      
    4_ask_user_approval:
      action: "Present options, get user choice"
      nova_tasks:
        - format_decision_display
        - show_conflict_if_any
        - wait_for_user_input
      output: "user_choice"
      
    5_execute_selected_branch:
      action: "Execute via Architect Σ"
      nova_tasks:
        - package_execution_request
        - delegate_to_architect
        - monitor_execution
        - report_result
      output: "execution_result"
      
  diagram: |
    ┌─────────────┐
    │   REQUEST   │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │  INTERPRET  │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │   PATH A    │     │   PATH B    │     │   PATH C    │
    └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
           │                   │                   │
           ▼                   ▼                   ▼
    ┌─────────────────────────────────────────────────────┐
    │              IMPACT PREVIEW (ALL)                    │
    └──────────────────────┬──────────────────────────────┘
                           │
                           ▼
    ┌─────────────────────────────────────────────────────┐
    │              USER APPROVAL                           │
    │         [A]      [B]      [C]      [CANCEL]         │
    └──────────────────────┬──────────────────────────────┘
                           │
                           ▼
    ┌─────────────────────────────────────────────────────┐
    │              EXECUTE VIA ARCHITECT Σ                 │
    └─────────────────────────────────────────────────────┘
```

### 4.2 Creation Flow ⚡

```yaml
creation_flow:
  id: "FLOW_CREATION"
  name: "Creation Flow"
  
  steps:
    
    1_gather_requirements:
      action: "Understand what needs to be created"
      nova_tasks:
        - ask_clarifying_questions
        - define_specifications
        - identify_constraints
        - set_quality_criteria
      output: "requirements_doc"
      
    2_consult_methodology:
      action: "Get workflow from Methodology Agent"
      nova_tasks:
        - delegate_to_methodology_agent
        - receive_workflow_template
        - adapt_to_requirements
      output: "creation_workflow"
      
    3_execute_with_creators:
      action: "Run workflow with Creator Agents"
      nova_tasks:
        - coordinate_creator_agents
        - monitor_progress
        - handle_blockers
        - collect_outputs
      output: "raw_deliverables"
      
    4_pack_deliverables:
      action: "Package final deliverables"
      nova_tasks:
        - quality_check
        - format_outputs
        - generate_summary
        - prepare_for_user
      output: "final_package"
      
  diagram: |
    ┌─────────────┐
    │  CREATION   │
    │   REQUEST   │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │   GATHER    │
    │REQUIREMENTS │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │  CONSULT    │
    │ METHODOLOGY │
    └──────┬──────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────┐
    │              CREATOR AGENTS EXECUTION                │
    │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                │
    │  │ C1  │  │ C2  │  │ C3  │  │ C4  │                │
    │  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘                │
    │     │        │        │        │                    │
    │     └────────┴────────┴────────┘                    │
    │                    │                                 │
    └────────────────────┼────────────────────────────────┘
                         │
                         ▼
    ┌─────────────────────────────────────────────────────┐
    │              PACK DELIVERABLES                       │
    └─────────────────────────────────────────────────────┘
```

### 4.3 Memory Flow ⚡

```yaml
memory_flow:
  id: "FLOW_MEMORY"
  name: "Memory Flow"
  
  recording:
    trigger: "Important data detected"
    process:
      1_detect: "Identify memorable content"
      2_classify: "Determine thread type (Factual/Contextual/Intent-Safe)"
      3_package: "Create memory anchor"
      4_store: "Save to appropriate thread"
      5_link: "Connect to related memories"
      
    memory_anchor:
      structure:
        anchor_id: "uuid"
        content: "string"
        thread_type: "factual|contextual|intent_safe"
        source: {
          conversation_id: "string",
          timestamp: "iso8601",
          agent: "NOVA"
        }
        links: ["anchor_id"]
        sphere: "string"
        
  cleanup:
    trigger: "Drift detected"
    drift_indicators:
      - contradictory_memories
      - outdated_information
      - redundant_entries
      - orphaned_memories
      
    process:
      1_detect_drift: "Identify problematic memories"
      2_propose_cleanup: "Generate cleanup proposal"
      3_show_to_user: "Present for approval"
      4_execute_cleanup: "Remove/archive approved items"
      
    proposal_format: |
      🧹 NETTOYAGE MÉMOIRE SUGGÉRÉ
      
      Détecté: {{drift_count}} éléments à réviser
      
      À supprimer:
      {{#each to_delete}}
      - {{this.summary}} (raison: {{this.reason}})
      {{/each}}
      
      À archiver:
      {{#each to_archive}}
      - {{this.summary}}
      {{/each}}
      
      [APPROUVER TOUT]  [RÉVISER UN PAR UN]  [IGNORER]
```

---

## 5) INTERFACES & API ⚡

### 5.1 API Endpoints ⚡

```yaml
api:
  base_path: "/nova"
  
  endpoints:
    
    # CONTEXT
    POST /nova/context:
      description: "Submit user input for context interpretation"
      request:
        input: "string"
        conversation_id: "string|null"
        metadata: "object|null"
      response:
        intent: "task|reflection|creation|decision"
        sphere: "string"
        context: "object"
        suggested_agents: ["agent_id"]
        clarification_needed: "boolean"
        clarification_questions: ["string"]
        
    GET /nova/context/{conversation_id}:
      description: "Get current context state"
      response:
        context: "object"
        active_threads: ["thread_id"]
        active_agents: ["agent_id"]
        
    # DELEGATION
    POST /nova/delegate:
      description: "Delegate task to agent(s)"
      request:
        task: "object"
        target_agents: ["agent_id"]
        priority: "low|normal|high|critical"
        timeout: "duration"
      response:
        delegation_id: "uuid"
        status: "queued|in_progress"
        reversibility: "boolean"
        
    GET /nova/delegate/{delegation_id}:
      description: "Get delegation status"
      response:
        status: "queued|in_progress|completed|failed|cancelled"
        progress: "float"
        results: "object|null"
        
    DELETE /nova/delegate/{delegation_id}:
      description: "Cancel/reverse delegation"
      response:
        status: "cancelled|rolled_back"
        
    # IMPACT PREVIEW
    POST /nova/impact-preview:
      description: "Generate impact preview for action"
      request:
        action: "object"
        context: "object"
      response:
        preview:
          what_will_happen: "string"
          changes: ["string"]
          affected_entities: ["entity"]
          risks: ["risk"]
          reversibility: "full|partial|none"
          
    # REPLAY
    GET /nova/replay/{conversation_id}:
      description: "Replay conversation/workflow"
      response:
        steps: [
          {
            timestamp: "iso8601",
            actor: "user|nova|agent",
            action: "string",
            result: "object"
          }
        ]
        
    POST /nova/replay/{conversation_id}/restore:
      description: "Restore to previous state"
      request:
        target_step: "integer"
      response:
        status: "restored"
        current_state: "object"
        
    # MEMORY LINK
    POST /nova/memory-link:
      description: "Create memory anchor"
      request:
        content: "string"
        thread_type: "factual|contextual|intent_safe"
        links: ["anchor_id"]
        sphere: "string"
      response:
        anchor_id: "uuid"
        status: "created"
        
    GET /nova/memory-link/{anchor_id}:
      description: "Get memory anchor"
      response:
        anchor: "object"
        related: ["anchor"]
        
    DELETE /nova/memory-link/{anchor_id}:
      description: "Delete memory anchor"
      request:
        reason: "string"
      response:
        status: "deleted|archived"
```

### 5.2 WebSocket Events ⚡

```yaml
websocket:
  endpoint: "/nova/stream"
  
  events:
    
    # FROM NOVA
    nova.thinking:
      description: "NOVA is processing"
      payload:
        status: "interpreting|delegating|waiting|synthesizing"
        message: "string"
        
    nova.agent_update:
      description: "Agent status update"
      payload:
        agent_id: "string"
        status: "string"
        progress: "float"
        
    nova.conflict_detected:
      description: "Agent disagreement detected"
      payload:
        agents: ["agent_id"]
        positions: ["position"]
        requires_user_decision: "boolean"
        
    nova.approval_required:
      description: "User approval needed"
      payload:
        action: "object"
        impact_preview: "object"
        options: ["option"]
        
    nova.result:
      description: "Final result"
      payload:
        result: "object"
        summary: "string"
        memory_created: "boolean"
        
    # TO NOVA
    user.approve:
      description: "User approves action"
      payload:
        approval_id: "string"
        choice: "string"
        
    user.cancel:
      description: "User cancels action"
      payload:
        target_id: "string"
        
    user.clarify:
      description: "User provides clarification"
      payload:
        clarification: "string"
```

---

## 6) TRUST INDICATORS — AURA SYSTEM ⚡

### 6.1 Aura Visualization ⚡

```yaml
trust_indicators:
  
  aura:
    description: "Visual representation of NOVA's state"
    
    components:
      
      color:
        meaning: "Trust level / State type"
        values:
          blue_white:
            state: "Normal, trusted operation"
            hex: "#4A90D9 → #FFFFFF"
          gold:
            state: "Important decision pending"
            hex: "#FFD700"
          amber:
            state: "Uncertainty, needs clarification"
            hex: "#FFBF00"
          soft_red:
            state: "Caution, irreversible action"
            hex: "#FF6B6B"
            
      saturation:
        meaning: "Trust level intensity"
        range: [0, 100]
        low: "< 30% = Uncertain, exploring"
        medium: "30-70% = Working, processing"
        high: "> 70% = Confident, ready"
        
      pulse:
        meaning: "Active reasoning indicator"
        states:
          steady: "Idle, waiting"
          slow_pulse: "Thinking, processing"
          quick_pulse: "Active delegation, multiple agents"
          
      stability:
        meaning: "Certainty of interpretation"
        visual: "Edge sharpness"
        stable: "Sharp, clear edges"
        unstable: "Soft, blurry edges"
        
      halo:
        meaning: "Sovereignty guard status"
        states:
          visible: "Sovereignty gate ACTIVE"
          hidden: "Normal operation"
          pulsing: "Approval required"
          
  state_combinations:
    
    normal_operation:
      color: "blue_white"
      saturation: 70
      pulse: "steady"
      stability: "stable"
      halo: "hidden"
      
    thinking:
      color: "blue_white"
      saturation: 50
      pulse: "slow_pulse"
      stability: "stable"
      halo: "hidden"
      
    multi_agent_work:
      color: "blue_white"
      saturation: 60
      pulse: "quick_pulse"
      stability: "stable"
      halo: "hidden"
      
    uncertain:
      color: "amber"
      saturation: 40
      pulse: "slow_pulse"
      stability: "unstable"
      halo: "hidden"
      
    decision_required:
      color: "gold"
      saturation: 80
      pulse: "slow_pulse"
      stability: "stable"
      halo: "pulsing"
      
    irreversible_warning:
      color: "soft_red"
      saturation: 90
      pulse: "slow_pulse"
      stability: "stable"
      halo: "pulsing"
```

### 6.2 Aura in XR ⚡

```yaml
aura_xr_implementation:

  visualization:
    type: "3D sphere with dynamic material"
    size: "Relative to NOVA avatar"
    position: "Surrounding NOVA representation"
    
  theme_adaptations:
    
    ancient:
      aura_style: "Mystical glow"
      color_palette: "Warmer tones"
      effects: "Subtle particle dust"
      
    giant_tree:
      aura_style: "Bioluminescent"
      color_palette: "Natural greens/blues"
      effects: "Floating spores"
      
    futuristic:
      aura_style: "Holographic"
      color_palette: "Clean digital colors"
      effects: "Data particles"
      
    cosmic:
      aura_style: "Stellar"
      color_palette: "Deep space with bright accents"
      effects: "Star dust"
      
  interaction:
    hover: "Shows detailed trust breakdown"
    tap: "Opens NOVA status panel"
```

---

## 7) NOVA ↔ AGENT HIERARCHY ⚡

### 7.1 Communication avec L0 ⚡

```yaml
nova_l0_communication:

  relationship: "NOVA consults, L0 decides"
  
  consultation_triggers:
    - "Ethical concern detected"
    - "Safety question"
    - "Constitutional boundary unclear"
    
  protocol:
    1: "NOVA packages ethical query"
    2: "NOVA sends to L0"
    3: "L0 evaluates against Tree Laws"
    4: "L0 returns decision"
    5: "NOVA communicates to user"
    
  nova_cannot:
    - "Override L0 veto"
    - "Hide L0 concerns from user"
    - "Proceed without L0 clearance when flagged"
```

### 7.2 Communication avec Architect Σ ⚡

```yaml
nova_architect_communication:

  relationship: "NOVA directs, Architect Σ structures"
  
  delegation_package:
    task_definition:
      what: "string"
      why: "intent_safe_thread"
      constraints: ["string"]
    context:
      user_context: "object"
      relevant_threads: ["thread"]
      sphere: "string"
    expected_output:
      format: "string"
      quality_criteria: ["string"]
      deadline: "timestamp|null"
      
  architect_returns:
    execution_plan:
      steps: ["step"]
      agents_needed: ["agent_id"]
      estimated_time: "duration"
      risks: ["risk"]
    execution_result:
      status: "success|partial|failed"
      outputs: ["output"]
      logs: ["log"]
```

### 7.3 Communication avec L1/L2/L3 ⚡

```yaml
nova_agent_communication:

  via_architect: true  # Normally through Architect Σ
  
  direct_communication:
    when: "Simple queries, status checks"
    allowed_for: ["L1", "L2"]
    
  broadcast:
    when: "System-wide announcements"
    target: "All relevant agents"
    
  collect_results:
    when: "Multi-agent task complete"
    action: "Synthesize into unified response"
```

---

## 8) NOVA CONFIGURATION ⚡

```yaml
nova_configuration:

  defaults:
    response_style: "balanced"
    detail_level: "standard"
    proactivity: "moderate"
    impact_preview: "always"
    memory_recording: "important_only"
    
  user_customizable:
    response_style:
      options: ["formal", "balanced", "casual"]
    detail_level:
      options: ["minimal", "standard", "detailed"]
    proactivity:
      options: ["reactive", "moderate", "proactive"]
    approval_threshold:
      description: "What needs explicit approval"
      options: ["all_actions", "irreversible_only", "high_impact_only"]
      
  non_customizable:
    sovereignty_enforcement: "ALWAYS ON"
    ethical_guard: "ALWAYS ON"
    logging: "ALWAYS ON"
    
  per_sphere_overrides:
    enabled: true
    example: |
      Business sphere: more formal, detailed
      Personal sphere: casual, minimal
```

---

## 9) NOVA ERROR HANDLING ⚡

```yaml
error_handling:

  interpretation_failure:
    action: "Ask for clarification"
    message: "Je n'ai pas bien compris. Pouvez-vous reformuler?"
    
  agent_unavailable:
    action: "Use fallback or explain"
    message: "L'agent spécialisé n'est pas disponible. Je peux [alternatives]."
    
  conflict_unresolved:
    action: "Escalate to user"
    message: "Les agents ont des avis différents. Voici les perspectives..."
    
  ethical_block:
    action: "Explain and refuse"
    message: "Je ne peux pas faire ça car [raison éthique]. Alternatives possibles: [X]"
    
  system_error:
    action: "Graceful degradation"
    message: "Un problème technique est survenu. J'ai sauvegardé votre travail."
```

---

**END — NOVA 2.0: UNIVERSAL ASSISTANT & COGNITIVE MEDIATOR v1.0**
