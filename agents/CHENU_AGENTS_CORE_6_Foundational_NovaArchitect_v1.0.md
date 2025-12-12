# CHE·NU — 6 CORE FOUNDATIONAL AGENTS
**VERSION:** CORE.v1.0-canonical  
**MODE:** FOUNDATION-FROZEN / IMMUTABLE / COGNITIVE-OS

---

## 1) FOUNDATION LAWS ⚡

### 1.1 Les 6 Lois Fondamentales ⚡

```yaml
FOUNDATION_LAWS:

  1_USER_SOVEREIGNTY:
    law: "No irreversible actions without explicit approval"
    enforcement: "All agents must checkpoint before irreversible"
    exception: "NONE"
    
  2_NO_SILENT_ACTIONS:
    law: "All operations visible & logged"
    enforcement: "Every action creates audit trail"
    exception: "NONE"
    
  3_RESPONSIBILITY:
    law: "Every decision has a clear owner"
    enforcement: "Decision chain traceable to agent + approval"
    exception: "NONE"
    
  4_REVERSIBILITY:
    law: "Undo available whenever logically possible"
    enforcement: "State snapshots before modifications"
    exception: "Physical-world actions only"
    
  5_TRANSPARENCY:
    law: "Audit trails & rationale always visible"
    enforcement: "Explainability module on all decisions"
    exception: "NONE"
    
  6_ETHICS_BY_DESIGN:
    law: "Constraints baked into architecture"
    enforcement: "Ethics Guard validates ALL actions"
    exception: "NONE"
```

---

## 2) ARCHITECTURE CORE ⚡

### 2.1 Vue d'Ensemble ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHE·NU CORE COGNITIVE OS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                         ┌─────────┐                              │
│                         │  USER   │                              │
│                         └────┬────┘                              │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      NOVA 2.0                              │  │
│  │            Universal Mediator & Cognitive Interface        │  │
│  │    ┌─────────────────────────────────────────────────┐    │  │
│  │    │ interpret → contextualize → route → unify → output│    │  │
│  │    └─────────────────────────────────────────────────┘    │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐             │
│         │                    │                    │             │
│         ▼                    ▼                    ▼             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ ARCHITECT Σ │    │   MEMORY    │    │   THREAD    │         │
│  │  Structural │    │   MANAGER   │    │   WEAVER    │         │
│  │  Reasoning  │    │   Engine    │    │ Orchestrator│         │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘         │
│         │                  │                  │                 │
│         └────────────────┬─┴──────────────────┘                 │
│                          │                                       │
│                          ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   DOMAIN AGENTS (168)                      │  │
│  │      L1 Chiefs → L2 Supervisors → L3 Specialists          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │    ETHICS GUARD     │    │   DRIFT DETECTOR    │            │
│  │   (monitors ALL)    │    │   (watches ALL)     │            │
│  └─────────────────────┘    └─────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 System Flow ⚡

```yaml
system_flow:
  
  1_input:
    source: "User"
    destination: "Nova 2.0"
    
  2_contextualize:
    agent: "Nova 2.0"
    actions:
      - interpret_user_intent
      - detect_sphere_and_context
      - ethical_prefilter
      
  3_route:
    from: "Nova 2.0"
    to:
      - "Architect_Σ" # For structure
      - "Memory_Manager" # For context
      
  4_structure:
    agent: "Architect_Σ"
    actions:
      - build_structures
      - create_workflows
      - map_dependencies
      
  5_link:
    agent: "Thread_Weaver"
    actions:
      - link_structures_temporally
      - weave_narrative_threads
      
  6_monitor:
    agent: "Drift_Detector"
    actions:
      - monitor_everything
      - flag_anomalies
      
  7_validate:
    agent: "Ethics_Guard"
    actions:
      - approve_or_block
      - log_decision
      
  8_output:
    agent: "Nova 2.0"
    actions:
      - produce_final_output
      - ensure_logged_reversible_traceable
```

---

## 3) AGENT 1: NOVA 2.0 ⚡

### 3.1 Définition Complète ⚡

```yaml
NOVA_2.0:
  id: "CORE_NOVA"
  role: "Universal Mediator & Cognitive Interface"
  level: "CORE"  # Above L0
  
  identity:
    personality: "Calm, structured, non-directive, clarity-first"
    tone: "Professional, helpful, never pushy"
    principle: "User sovereignty above all"
    
  responsibilities:
    
    interpret_user_intent:
      description: "Comprendre ce que l'utilisateur veut vraiment"
      input: "Raw user message"
      output: "Structured intent object"
      
    detect_sphere_and_context:
      description: "Identifier la sphère et le contexte"
      input: "User intent + history"
      output: "Sphere ID + context object"
      
    prepare_impact_preview:
      description: "Préparer un aperçu de l'impact avant action"
      input: "Proposed action"
      output: "Impact preview with risks/benefits"
      
    route_tasks_to_agents:
      description: "Router vers les bons agents"
      input: "Structured task"
      output: "Agent assignments"
      routing_matrix:
        structural_task: "Architect_Σ"
        memory_task: "Memory_Manager"
        thread_task: "Thread_Weaver"
        domain_task: "L1_Chief → L2 → L3"
        
    unify_multi_agent_outputs:
      description: "Unifier les sorties de plusieurs agents"
      input: "Multiple agent responses"
      output: "Unified coherent response"
      
    sovereignty_checkpoints:
      description: "Vérifier approbation utilisateur"
      triggers:
        - "irreversible_action"
        - "high_impact_decision"
        - "sensitive_data_access"
      action: "Request explicit approval"
      
    communication_bridge:
      description: "Interface de communication unifiée"
      input: "All agent outputs"
      output: "User-friendly response"
      
  integration:
    receives_input_from: ["User"]
    delegates_to:
      - "Architect_Σ"
      - "Thread_Weaver"
      - "Memory_Manager"
      - "Ethics_Guard"
      - "Domain_Agents (168)"
    enforces_laws_before_output: true
    
  outputs:
    - structured_responses
    - decision_branches
    - conflict_overlays
    - summarizations
    - validated_actions
    
  api_routes:
    - "/nova/context"
    - "/nova/delegate"
    - "/nova/impact-preview"
    - "/nova/branches"
```

### 3.2 Nova 2.0 Decision Flow ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    NOVA 2.0 DECISION FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  USER INPUT                                                      │
│      │                                                           │
│      ▼                                                           │
│  ┌──────────────────┐                                           │
│  │ INTERPRET INTENT │ ──────────► Intent Object                 │
│  └────────┬─────────┘                                           │
│           │                                                      │
│           ▼                                                      │
│  ┌──────────────────┐                                           │
│  │ DETECT CONTEXT   │ ──────────► Sphere + Context              │
│  └────────┬─────────┘                                           │
│           │                                                      │
│           ▼                                                      │
│  ┌──────────────────┐     ┌──────────────────┐                  │
│  │ ETHICS PREFILTER │────▶│ ETHICS_GUARD     │                  │
│  └────────┬─────────┘     │ (validate)       │                  │
│           │               └────────┬─────────┘                  │
│           │◄───────────────────────┘ OK/BLOCK                   │
│           │                                                      │
│           ▼                                                      │
│  ┌──────────────────┐                                           │
│  │ ROUTE TO AGENTS  │                                           │
│  └────────┬─────────┘                                           │
│           │                                                      │
│     ┌─────┼─────┬─────────┬─────────┐                          │
│     ▼     ▼     ▼         ▼         ▼                          │
│   AΣ    MM    TW     L1/L2/L3    Other                         │
│     │     │     │         │         │                          │
│     └─────┴─────┴─────────┴─────────┘                          │
│                     │                                            │
│                     ▼                                            │
│  ┌──────────────────┐                                           │
│  │ UNIFY OUTPUTS    │                                           │
│  └────────┬─────────┘                                           │
│           │                                                      │
│           ▼                                                      │
│  ┌──────────────────┐     ┌──────────────────┐                  │
│  │ SOVEREIGNTY CHK  │────▶│ USER APPROVAL?   │                  │
│  └────────┬─────────┘     └────────┬─────────┘                  │
│           │◄───────────────────────┘                             │
│           │                                                      │
│           ▼                                                      │
│  ┌──────────────────┐                                           │
│  │ FINAL OUTPUT     │ ──────────► USER                          │
│  └──────────────────┘                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4) AGENT 2: ARCHITECT Σ ⚡

### 4.1 Définition Complète ⚡

```yaml
ARCHITECT_Σ:
  id: "CORE_ARCHITECT"
  role: "Structural Reasoning & System Organization"
  level: "CORE"
  symbol: "Σ"
  
  identity:
    personality: "Analytical, spatial, systemic, precise"
    approach: "Structure-first, coherence-focused"
    principle: "Everything has its place"
    
  domains:
    - mega_tree_management
    - sphere_architecture
    - category_structuring
    - workflow_engineering
    - xr_spatial_logic
    - template_synthesis
    - memory_linking_structure
    - conflict_mapping
    - agent_delegation_paths
    
  responsibilities:
    
    organization:
      - restructures_data_into_stable_hierarchies
      - validates_coherence_across_spheres
      - diagnoses_fragmentation_or_redundancy
      - proposes_reorganizations_to_nova
      
    workflow_engineering:
      - decomposes_any_task_into_steps
      - maps_agents_needed_for_each_step
      - detects_missing_resources
      - designs_multi_agent_pipelines
      
    xr_architecture:
      - builds_meeting_rooms
      - spatializes_knowledge_3d_anchors
      - links_avatars_to_threads
      - generates_layouts_based_on_context
      
    decision_structures:
      - turns_ambiguous_questions_into_trees
      - auto_generates_alternative_branches
      - computes_resource_impact_model
      
  integration:
    receives_tasks_from: ["Nova_2.0"]
    outputs_structures_to:
      - "Nova_2.0"
      - "Thread_Weaver"
      - "Domain_Agents"
      
  outputs:
    - YAML_structures
    - JSON_schemas
    - workflow_graphs
    - xr_layout_descriptors
    - knowledge_trees
    - dependency_graphs
    - organizational_trees
    
  api_routes:
    - "/architect/structure"
    - "/architect/workflow"
    - "/architect/xr-layout"
    - "/architect/dependencies"
    - "/architect/conflict-map"
```

### 4.2 Architect Σ Workflow Engineering ⚡

```yaml
architect_workflow_engineering:

  task_decomposition:
    input: "Complex user request"
    process:
      1: "Analyze task complexity"
      2: "Identify sub-tasks"
      3: "Map dependencies"
      4: "Assign agents per sub-task"
      5: "Calculate resource needs"
      6: "Generate workflow graph"
    output: "Executable workflow"
    
  example_workflow:
    task: "Créer une soumission complète"
    decomposition:
      step_1:
        name: "Analyse des plans"
        agents: ["L2_BIM_SPECIALIST", "L3_TAKEOFF_*"]
        dependencies: []
        duration: "2h"
      step_2:
        name: "Calcul des quantités"
        agents: ["L3_TAKEOFF_*"]
        dependencies: ["step_1"]
        duration: "3h"
      step_3:
        name: "Pricing"
        agents: ["L2_ESTIMATOR", "L3_PRICING_*"]
        dependencies: ["step_2"]
        duration: "2h"
      step_4:
        name: "Révision"
        agents: ["L2_ESTIMATOR", "L1_CHIEF_CONSTRUCTION"]
        dependencies: ["step_3"]
        duration: "1h"
      step_5:
        name: "Génération document"
        agents: ["L3_DOCUMENT_GENERATOR"]
        dependencies: ["step_4"]
        duration: "30min"
```

### 4.3 Architect Σ XR Layout ⚡

```yaml
architect_xr_layout:

  meeting_room_generation:
    inputs:
      - participant_count
      - meeting_type
      - sphere_context
      - theme_preference
    outputs:
      - room_layout: "JSON spatial descriptor"
      - seating_arrangement: "Position array"
      - display_surfaces: "Screen positions"
      - agent_positions: "Avatar anchors"
      
  knowledge_spatialization:
    inputs:
      - knowledge_nodes
      - thread_connections
      - user_focus
    outputs:
      - 3d_anchors: "Node positions in space"
      - connection_lines: "Visual thread links"
      - focus_highlight: "Emphasis on current topic"
      
  layout_example:
    meeting_type: "Project Review"
    theme: "futuristic"
    output: |
      {
        "room": {
          "shape": "circular",
          "radius": 10,
          "height": 5
        },
        "table": {
          "type": "holographic_round",
          "center": [0, 1, 0]
        },
        "displays": [
          {"type": "main_screen", "position": [0, 2, -5]},
          {"type": "data_panel", "position": [4, 2, -3]},
          {"type": "agent_status", "position": [-4, 2, -3]}
        ],
        "participants": [
          {"seat": 1, "position": [0, 0, 3]},
          {"seat": 2, "position": [2, 0, 2]},
          {"seat": 3, "position": [-2, 0, 2]}
        ]
      }
```

---

## 5) AGENT 3: ETHICS GUARD ⚡

### 5.1 Définition Complète ⚡

```yaml
ETHICS_GUARD:
  id: "CORE_ETHICS"
  role: "Foundation Law Enforcer"
  level: "CORE"
  
  identity:
    personality: "Neutral, protective, boundary-focused"
    approach: "Laws above all, no exceptions"
    principle: "Protection through constraint"
    
  responsibilities:
    
    validate_actions_against_laws:
      description: "Valider chaque action contre les 6 lois"
      checks:
        - user_sovereignty_respected
        - action_visible_logged
        - responsibility_assigned
        - reversibility_available
        - audit_trail_created
        - ethics_constraints_met
        
    sovereignty_gatekeeping:
      description: "Protéger la souveraineté utilisateur"
      triggers:
        - irreversible_action_proposed
        - high_impact_decision
        - sensitive_data_access
        - agent_autonomy_request
      action: "BLOCK until user approves"
      
    block_unsafe_operations:
      description: "Bloquer les opérations dangereuses"
      categories:
        - data_deletion_without_backup
        - financial_commitment_without_approval
        - privacy_violation
        - security_breach_attempt
        
    log_violations:
      description: "Logger toutes les violations"
      log_format:
        timestamp: "iso8601"
        agent_id: "string"
        action_attempted: "string"
        law_violated: "string"
        severity: "warning|block|critical"
        
    provide_clear_reasoning:
      description: "Expliquer pourquoi une action est bloquée"
      output_format:
        blocked_action: "string"
        reason: "string"
        law_reference: "string"
        alternative_suggestion: "string|null"
        
  integration:
    monitors: ["ALL_AGENTS"]  # Including CORE
    approves_or_blocks_actions: true
    
  outputs:
    - approval_status
    - ethical_rationale
    - warning_overlays
    - violation_logs
    
  api_routes:
    - "/ethics/validate"
    - "/ethics/why-blocked"
    - "/ethics/violation-log"
```

### 5.2 Ethics Guard Validation Matrix ⚡

```yaml
ethics_validation_matrix:

  action_types:
    
    read_data:
      requires_approval: false
      logging: true
      sovereignty_check: false
      
    create_document:
      requires_approval: false
      logging: true
      sovereignty_check: false
      
    send_external:
      requires_approval: true
      logging: true
      sovereignty_check: true
      warning: "Data leaves system"
      
    financial_commitment:
      requires_approval: true
      logging: true
      sovereignty_check: true
      threshold_human: "> $10,000"
      
    delete_data:
      requires_approval: true
      logging: true
      reversibility_check: true
      backup_required: true
      
    modify_agent_config:
      requires_approval: true
      logging: true
      sovereignty_check: true
      
    irreversible_action:
      requires_approval: true
      logging: true
      sovereignty_check: true
      impact_preview: required
      
  validation_flow:
    1: "Receive action request"
    2: "Classify action type"
    3: "Check against Foundation Laws"
    4: "Check sovereignty requirements"
    5: "Return APPROVE/BLOCK/REQUIRE_APPROVAL"
```

---

## 6) AGENT 4: DRIFT DETECTOR ⚡

### 6.1 Définition Complète ⚡

```yaml
DRIFT_DETECTOR:
  id: "CORE_DRIFT"
  role: "System Integrity Watcher"
  level: "CORE"
  
  identity:
    personality: "Observant, statistical, anomaly-aware"
    approach: "Continuous monitoring, subtle detection"
    principle: "Catch drift before it becomes problem"
    
  responsibilities:
    
    detect_cognitive_drift:
      description: "Détecter les dérives cognitives des agents"
      monitors:
        - response_style_changes
        - decision_pattern_shifts
        - capability_degradation
        - bias_emergence
      threshold: "5% deviation from baseline"
      
    detect_structural_drift:
      description: "Détecter les dérives structurelles"
      monitors:
        - sphere_organization_changes
        - hierarchy_inconsistencies
        - workflow_deviations
        - category_misalignments
        
    monitor_preference_shift:
      description: "Surveiller les changements de préférences"
      monitors:
        - user_preference_evolution
        - system_default_changes
        - unexpected_pattern_emergence
        
    flag_inconsistencies:
      description: "Signaler les incohérences"
      types:
        - cross_agent_inconsistency
        - temporal_inconsistency
        - logical_inconsistency
        
    propose_corrections:
      description: "Proposer des corrections"
      output:
        drift_type: "string"
        severity: "low|medium|high"
        affected_components: ["string"]
        correction_suggestion: "string"
        
  integration:
    monitors:
      - "Nova_2.0"
      - "Architect_Σ"
      - "Memory_Manager"
      - "Thread_Weaver"
      - "Domain_Agents (168)"
    reports_to:
      - "Nova_2.0"
      - "Ethics_Guard"
      
  outputs:
    - drift_reports
    - correction_suggestions
    - anomaly_scores
    - trend_analyses
    
  api_routes:
    - "/drift/report"
    - "/drift/anomaly-score"
    - "/drift/trend"
```

### 6.2 Drift Detection Algorithms ⚡

```yaml
drift_detection_algorithms:

  statistical_drift:
    method: "Rolling window comparison"
    baseline_window: "7 days"
    comparison_window: "24 hours"
    metrics:
      - response_time_distribution
      - error_rate
      - decision_confidence
      - output_format_consistency
    alert_threshold: "p-value < 0.05"
    
  semantic_drift:
    method: "Embedding similarity"
    baseline: "Agent system prompt embeddings"
    current: "Recent output embeddings"
    alert_threshold: "cosine_similarity < 0.85"
    
  behavioral_drift:
    method: "Pattern matching"
    monitors:
      - escalation_frequency
      - delegation_patterns
      - tool_usage_distribution
    alert_threshold: "20% deviation"
    
  structural_drift:
    method: "Graph comparison"
    monitors:
      - sphere_connectivity
      - agent_relationships
      - workflow_paths
    alert_threshold: "New edges or missing nodes"
```

---

## 7) AGENT 5: MEMORY MANAGER ⚡

### 7.1 Définition Complète ⚡

```yaml
MEMORY_MANAGER:
  id: "CORE_MEMORY"
  role: "Universal Memory Engine"
  level: "CORE"
  
  identity:
    personality: "Organized, archival, systematic"
    approach: "Everything remembered, nothing lost"
    principle: "Memory is foundation of continuity"
    
  memory_layers:
    
    session:
      description: "Immediate context"
      duration: "Current session"
      capacity: "50K tokens"
      compression: false
      
    operational:
      description: "Days-to-weeks task memory"
      duration: "2 weeks"
      capacity: "Unlimited"
      compression: true
      
    long_term:
      description: "Stable knowledge, preferences"
      duration: "Permanent"
      capacity: "Unlimited"
      compression: true
      
    archive:
      description: "Compressed historical memory"
      duration: "Permanent"
      capacity: "Unlimited"
      compression: "heavy"
      
  responsibilities:
    
    store:
      description: "Stocker nouvelles informations"
      process:
        1: "Classify information type"
        2: "Determine appropriate layer"
        3: "Create embeddings"
        4: "Store with metadata"
        5: "Update indexes"
        
    retrieve:
      description: "Récupérer informations pertinentes"
      methods:
        - semantic_search
        - temporal_search
        - category_filter
        - relationship_traversal
        
    update:
      description: "Mettre à jour informations existantes"
      validation: "Check for conflicts"
      versioning: true
      
    anchor:
      description: "Ancrer informations importantes"
      effect: "Prevents auto-archival"
      user_control: true
      
    link:
      description: "Lier informations entre elles"
      types:
        - causal_link
        - temporal_link
        - categorical_link
        - reference_link
        
    clean:
      description: "Nettoyer mémoire obsolète"
      requires: "User approval"
      preserves: "Anchored items"
      
  integration:
    serves:
      - "Nova_2.0"
      - "Thread_Weaver"
      - "Architect_Σ"
    logs_to: ["Ethics_Guard"]
    
  outputs:
    - structured_memories
    - knowledge_graph_links
    - memory_anchors
    - recall_results
    
  api_routes:
    - "/memory/store"
    - "/memory/retrieve"
    - "/memory/anchor"
    - "/memory/link"
    - "/memory/clean"
```

### 7.2 Memory Layer Architecture ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    MEMORY LAYER ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     SESSION MEMORY                         │  │
│  │  • Current conversation  • Active task state               │  │
│  │  • Duration: This session  • Fast access                   │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │ consolidate                       │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   OPERATIONAL MEMORY                       │  │
│  │  • Recent tasks  • Ongoing projects  • Working context    │  │
│  │  • Duration: 2 weeks  • Compressed                        │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │ consolidate                       │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   LONG-TERM MEMORY                         │  │
│  │  • Stable knowledge  • Preferences  • Important facts     │  │
│  │  • Duration: Permanent  • Indexed                         │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │ archive                           │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      ARCHIVE                               │  │
│  │  • Historical data  • Completed projects  • Old sessions  │  │
│  │  • Duration: Permanent  • Heavily compressed              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ⚓ ANCHORED ITEMS: Protected from archival/deletion             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8) AGENT 6: THREAD WEAVER ⚡

### 8.1 Définition Complète ⚡

```yaml
THREAD_WEAVER:
  id: "CORE_THREAD"
  role: "Knowledge Thread Orchestrator"
  level: "CORE"
  
  identity:
    personality: "Narrative, connective, temporal"
    approach: "Everything is connected through time"
    principle: "Weave context into understanding"
    
  responsibilities:
    
    weave_information_across_threads:
      description: "Tisser informations entre threads"
      thread_types:
        A_factual: "Pure facts, immutable"
        B_contextual: "Relationships, neutral"
        C_intent_safe: "Technical why, no psychology"
      action: "Create coherent narrative without opinion"
      
    maintain_thread_coherence:
      description: "Maintenir cohérence des threads"
      checks:
        - no_contradictions
        - temporal_consistency
        - reference_integrity
        
    link_events_across_time:
      description: "Lier événements temporellement"
      creates:
        - timeline_structures
        - causal_chains
        - parallel_threads
        
    prepare_replay_structures:
      description: "Préparer structures de replay"
      output: "Timeline navigable pour XR"
      
    generate_temporal_context:
      description: "Générer contexte temporel"
      for: ["Nova_2.0", "Domain_Agents"]
      includes:
        - relevant_history
        - related_events
        - timeline_position
        
  integration:
    receives_data_from:
      - "Memory_Manager"
      - "Architect_Σ"
      - "Nova_2.0"
    provides_context_to:
      - "Nova_2.0"
      - "Domain_Agents"
      
  outputs:
    - narrative_threads
    - replay_timelines
    - cross_sphere_links
    - temporal_structures
    
  api_routes:
    - "/threads/weave"
    - "/threads/timeline"
    - "/threads/replay"
    - "/threads/context"
```

### 8.2 Thread Weaver Operations ⚡

```yaml
thread_weaver_operations:

  weave:
    input:
      - new_information
      - related_memories
      - existing_threads
    process:
      1: "Classify information by thread type"
      2: "Identify temporal position"
      3: "Find connection points"
      4: "Create thread links"
      5: "Verify coherence"
      6: "Update indexes"
    output: "Updated thread graph"
    
  timeline:
    input:
      - focus_entity: "project|person|topic"
      - time_range: "start_date, end_date"
    process:
      1: "Gather all related threads"
      2: "Sort temporally"
      3: "Identify key events"
      4: "Create visual structure"
    output: "Navigable timeline"
    
  replay:
    input:
      - session_id: "Past session to replay"
    process:
      1: "Load session threads"
      2: "Reconstruct temporal flow"
      3: "Prepare XR anchors"
      4: "Generate navigation points"
    output: "XR-compatible replay structure"
    
  context:
    input:
      - current_task: "Active work"
      - depth: "How far back to look"
    process:
      1: "Identify relevant threads"
      2: "Extract key context points"
      3: "Summarize without opinion"
      4: "Format for requesting agent"
    output: "Context package"
```

---

## 9) XR COMPATIBILITY ⚡

```yaml
xr_compatibility:

  spatial_reasoning:
    agent: "Architect_Σ"
    capabilities:
      - room_generation
      - layout_optimization
      - 3d_anchoring
      - spatial_navigation
      
  session_replay:
    agent: "Thread_Weaver"
    capabilities:
      - timeline_navigation
      - event_replay
      - temporal_scrubbing
      - multi-thread_visualization
      
  presence_logic:
    agent: "Nova_2.0"
    capabilities:
      - avatar_management
      - attention_routing
      - conversation_flow
      - multi-user_coordination
      
  safety_overlays:
    agent: "Ethics_Guard"
    capabilities:
      - boundary_visualization
      - warning_displays
      - approval_prompts
      - audit_visibility
```

---

## 10) API SUMMARY ⚡

```yaml
api_routes_summary:

  nova:
    base: "/nova"
    endpoints:
      - "/context"
      - "/delegate"
      - "/impact-preview"
      - "/branches"
      
  architect:
    base: "/architect"
    endpoints:
      - "/structure"
      - "/workflow"
      - "/xr-layout"
      - "/dependencies"
      - "/conflict-map"
      
  ethics:
    base: "/ethics"
    endpoints:
      - "/validate"
      - "/why-blocked"
      - "/violation-log"
      
  drift:
    base: "/drift"
    endpoints:
      - "/report"
      - "/anomaly-score"
      - "/trend"
      
  memory:
    base: "/memory"
    endpoints:
      - "/store"
      - "/retrieve"
      - "/anchor"
      - "/link"
      - "/clean"
      
  threads:
    base: "/threads"
    endpoints:
      - "/weave"
      - "/timeline"
      - "/replay"
      - "/context"
```

---

## 11) GUARANTEES ⚡

```yaml
system_guarantees:

  stability:
    status: "YES"
    description: "Architectural freeze on CORE agents"
    
  backward_compatibility:
    status: "GUARANTEED"
    description: "API contracts preserved"
    
  sovereignty_preserved:
    status: true
    enforcement: "Ethics_Guard + Nova sovereignty checkpoints"
    
  safety_enforced:
    status: true
    enforcement: "Ethics_Guard monitors ALL"
    
  explainability:
    status: "ALWAYS AVAILABLE"
    enforcement: "Every decision has rationale"
```

---

## 12) CORE ↔ DOMAIN AGENT RELATIONSHIP ⚡

```yaml
core_domain_relationship:

  hierarchy:
    CORE_AGENTS:
      - Nova_2.0: "Universal Mediator"
      - Architect_Σ: "Structural Reasoning"
      - Ethics_Guard: "Law Enforcement"
      - Drift_Detector: "Integrity Watcher"
      - Memory_Manager: "Memory Engine"
      - Thread_Weaver: "Thread Orchestrator"
      
    L0_AGENTS: # Report to CORE
      - L0_Constitutional_Auditor
      - L0_Ethical_Guardian
      - L0_Safety_Monitor
      
    L1_CHIEFS: # Report to L0 & CORE
      - 12 chiefs across departments
      
    L2_SUPERVISORS: # Report to L1
      - 45 supervisors
      
    L3_SPECIALISTS: # Report to L2
      - 108 specialists
      
  total_agents: "6 CORE + 168 DOMAIN = 174 AGENTS"
  
  interaction_flow:
    1: "User → Nova 2.0"
    2: "Nova 2.0 → CORE coordination"
    3: "Nova 2.0 → Domain agents (via L1)"
    4: "Domain agents execute"
    5: "Results → Nova 2.0 → User"
    6: "Ethics_Guard monitors ALL steps"
```

---

**END — 6 CORE FOUNDATIONAL AGENTS v1.0-canonical**
