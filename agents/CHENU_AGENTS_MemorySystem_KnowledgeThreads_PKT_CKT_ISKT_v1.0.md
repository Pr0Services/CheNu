# CHE·NU — MEMORY SYSTEM & KNOWLEDGE THREADS
**VERSION:** MEMORY.v1.0  
**MODE:** FOUNDATION / KNOWLEDGE-MANAGEMENT / PRODUCTION

---

## 1) ARCHITECTURE MÉMOIRE ⚡

### 1.1 Vue d'Ensemble ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHE·NU MEMORY ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  SHORT-TERM MEMORY                       │    │
│  │   • Conversation Context  • Active Task State            │    │
│  │   • TTL: Session / 24h                                   │    │
│  └─────────────────────┬───────────────────────────────────┘    │
│                        │ CONSOLIDATION                           │
│                        ▼                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  LONG-TERM MEMORY                        │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │    │
│  │  │   PKT   │  │   CKT   │  │  ISKT   │  │   UKT   │    │    │
│  │  │Personal │  │Collective│  │ Inter-  │  │Universal│    │    │
│  │  │Knowledge│  │Knowledge│  │ Sphere  │  │Knowledge│    │    │
│  │  │ Thread  │  │ Thread  │  │Knowledge│  │ Thread  │    │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  RETRIEVAL ENGINE                        │    │
│  │   • Semantic Search  • Relevance Ranking  • Context      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Types de Mémoire ⚡

| Type | Scope | Durée | Accès |
|------|-------|-------|-------|
| **STM** | Session | 24h max | Agent actuel |
| **PKT** | User personnel | Permanent | User + agents |
| **CKT** | Équipe/Projet | Permanent | Équipe |
| **ISKT** | Cross-Sphere | Permanent | Multi-sphère |
| **UKT** | Système global | Permanent | Tous agents |

---

## 2) SHORT-TERM MEMORY (STM) ⚡

### 2.1 Structure STM ⚡

```yaml
short_term_memory:

  conversation_context:
    schema:
      session_id: "uuid"
      user_id: "string"
      agent_id: "string"
      started_at: "iso8601"
      messages: [
        {
          role: "user|assistant|system",
          content: "string",
          timestamp: "iso8601",
          tokens: "integer"
        }
      ]
      active_task: "object|null"
      context_variables: "object"
      
    limits:
      max_messages: 100
      max_tokens: 50000
      max_duration: "24h"
      
    compression:
      enabled: true
      trigger: "tokens > 30000"
      strategy: "summarize_older_messages"
      keep_recent: 10
      
  active_task_state:
    schema:
      task_id: "string"
      status: "string"
      current_step: "integer"
      intermediate_results: "object"
      context: "object"
      
    persistence:
      on_pause: "save_to_redis"
      on_error: "save_checkpoint"
      ttl: "4h"
```

### 2.2 Context Window Management ⚡

```yaml
context_management:

  priority_order:
    1: "system_prompt"
    2: "user_context"
    3: "active_task_context"
    4: "relevant_memory"
    5: "recent_messages"
    6: "older_messages"
    
  token_allocation:
    system_prompt: 2000
    user_context: 1500
    task_context: 3000
    memory: 5000
    conversation: "remaining"
    
  overflow_handling:
    strategy: "compress_oldest_first"
    preserve: ["system_prompt", "user_context", "last_5_messages"]
    summarize: true
```

---

## 3) PERSONAL KNOWLEDGE THREAD (PKT) ⚡

### 3.1 Structure PKT ⚡

```yaml
personal_knowledge_thread:
  id: "PKT"
  name: "Personal Knowledge Thread"
  scope: "individual_user"
  
  schema:
    thread_id: "uuid"
    user_id: "string"
    created_at: "iso8601"
    updated_at: "iso8601"
    
    nodes: [
      {
        node_id: "uuid"
        type: "fact|preference|experience|skill|goal"
        content: "string"
        confidence: "float"  # 0-1
        source: "explicit|inferred|observed"
        created_at: "iso8601"
        last_accessed: "iso8601"
        access_count: "integer"
        connections: ["node_id"]
        metadata: {
          category: "string"
          tags: ["string"]
          expiry: "iso8601|null"
        }
      }
    ]
    
  node_types:
    
    fact:
      description: "Informations factuelles sur l'utilisateur"
      examples:
        - "Licence RBQ: 1234-5678-90"
        - "Spécialité: Construction commerciale"
        - "Région CCQ: Montérégie"
      retention: "permanent_unless_updated"
      
    preference:
      description: "Préférences de l'utilisateur"
      examples:
        - "Préfère communications formelles"
        - "Réponses détaillées souhaitées"
        - "Notifications par email seulement"
      retention: "permanent_unless_changed"
      
    experience:
      description: "Expériences et historique"
      examples:
        - "Projet ABC complété avec succès"
        - "Problème avec fournisseur XYZ"
      retention: "2_years"
      
    skill:
      description: "Compétences observées"
      examples:
        - "Expert en estimation résidentielle"
        - "Familier avec QuickBooks"
      retention: "permanent"
      confidence_decay: "0.95/year"
      
    goal:
      description: "Objectifs déclarés"
      examples:
        - "Augmenter chiffre d'affaires 20%"
        - "Obtenir certification LEED"
      retention: "until_achieved_or_cancelled"
```

### 3.2 PKT Operations ⚡

```yaml
pkt_operations:

  add_node:
    validation:
      - "content_not_empty"
      - "type_valid"
      - "no_duplicate"
    process:
      1: "validate_input"
      2: "check_existing_similar"
      3: "create_node"
      4: "find_connections"
      5: "update_index"
      
  update_node:
    validation:
      - "node_exists"
      - "update_valid"
    process:
      1: "load_existing"
      2: "merge_updates"
      3: "recalculate_confidence"
      4: "update_connections"
      5: "log_change"
      
  query_nodes:
    methods:
      semantic_search:
        input: "query_text"
        output: "ranked_nodes"
        algorithm: "embedding_similarity"
        
      type_filter:
        input: "node_type"
        output: "filtered_nodes"
        
      recency_sort:
        input: "time_range"
        output: "recent_nodes"
        
  prune_nodes:
    triggers:
      - "confidence < 0.2"
      - "access_count == 0 AND age > 1_year"
      - "expiry_passed"
    process:
      1: "identify_candidates"
      2: "check_connections"
      3: "archive_if_connected"
      4: "delete_if_isolated"
```

---

## 4) COLLECTIVE KNOWLEDGE THREAD (CKT) ⚡

### 4.1 Structure CKT ⚡

```yaml
collective_knowledge_thread:
  id: "CKT"
  name: "Collective Knowledge Thread"
  scope: "team_or_project"
  
  schema:
    thread_id: "uuid"
    scope_type: "team|project|department"
    scope_id: "string"
    created_at: "iso8601"
    updated_at: "iso8601"
    
    nodes: [
      {
        node_id: "uuid"
        type: "decision|lesson|process|contact|resource"
        content: "string"
        contributed_by: "user_id"
        validated_by: ["user_id"]
        validation_status: "pending|validated|disputed"
        visibility: "team|project|department|company"
        created_at: "iso8601"
        connections: ["node_id"]
        references: [
          {
            type: "document|conversation|external"
            ref_id: "string"
            url: "string|null"
          }
        ]
      }
    ]
    
  node_types:
    
    decision:
      description: "Décisions prises en équipe"
      examples:
        - "Utiliser fournisseur ABC pour acier"
        - "Standard: marge 15% minimum"
      requires_validation: true
      validators_required: 2
      
    lesson:
      description: "Leçons apprises"
      examples:
        - "Toujours vérifier disponibilité avant engagement"
        - "Client XYZ paie toujours en retard"
      requires_validation: true
      
    process:
      description: "Processus établis"
      examples:
        - "Checklist inspection qualité"
        - "Procédure de soumission"
      requires_validation: true
      version_controlled: true
      
    contact:
      description: "Contacts utiles"
      examples:
        - "Jean Dupont - Inspecteur RBQ - 514-555-1234"
      requires_validation: false
      
    resource:
      description: "Ressources partagées"
      examples:
        - "Template contrat standard v2.3"
        - "Liste fournisseurs approuvés"
      requires_validation: true
```

### 4.2 CKT Collaboration ⚡

```yaml
ckt_collaboration:

  contribution:
    process:
      1: "user_submits_knowledge"
      2: "auto_categorize"
      3: "check_duplicates"
      4: "request_validation"
      5: "notify_validators"
      6: "collect_votes"
      7: "publish_or_reject"
      
    validation_rules:
      decision: "2 validators + 1 senior"
      lesson: "2 validators"
      process: "department_head"
      contact: "auto_approve"
      resource: "1 validator"
      
  dispute_resolution:
    process:
      1: "flag_disputed"
      2: "collect_evidence"
      3: "escalate_to_L1"
      4: "L1_decision"
      5: "update_or_archive"
      
  versioning:
    enabled_for: ["process", "resource"]
    max_versions: 10
    diff_tracking: true
```

---

## 5) INTER-SPHERE KNOWLEDGE THREAD (ISKT) ⚡

### 5.1 Structure ISKT ⚡

```yaml
inter_sphere_knowledge_thread:
  id: "ISKT"
  name: "Inter-Sphere Knowledge Thread"
  scope: "cross_sphere"
  
  spheres:
    - business
    - scholar
    - creative
    - xr
    - social
    - institution
    
  schema:
    thread_id: "uuid"
    source_sphere: "string"
    target_spheres: ["string"]
    created_at: "iso8601"
    
    nodes: [
      {
        node_id: "uuid"
        type: "insight|pattern|correlation|bridge"
        content: "string"
        source_contexts: [
          {
            sphere: "string"
            context_id: "string"
            relevance: "float"
          }
        ]
        applicability: ["sphere"]
        confidence: "float"
        created_at: "iso8601"
      }
    ]
    
  node_types:
    
    insight:
      description: "Insight cross-sphère"
      example: "Patterns créatifs applicables aux présentations business"
      
    pattern:
      description: "Pattern récurrent multi-sphère"
      example: "Meilleure rétention avec formats visuels"
      
    correlation:
      description: "Corrélation entre sphères"
      example: "Projets avec documentation visuelle ont 30% moins de litiges"
      
    bridge:
      description: "Lien explicite entre concepts"
      example: "BIM (business) ↔ Digital Twin (XR)"
```

### 5.2 ISKT Discovery ⚡

```yaml
iskt_discovery:

  automatic:
    trigger: "on_new_knowledge_node"
    process:
      1: "analyze_content"
      2: "identify_cross_sphere_relevance"
      3: "calculate_confidence"
      4: "propose_iskt_node"
      5: "await_validation"
      
    algorithms:
      semantic_similarity:
        threshold: 0.75
        cross_sphere: true
        
      pattern_detection:
        min_occurrences: 3
        time_window: "30d"
        
  manual:
    process:
      1: "user_identifies_connection"
      2: "document_relationship"
      3: "validate_with_experts"
      4: "publish_to_iskt"
```

---

## 6) UNIVERSAL KNOWLEDGE THREAD (UKT) ⚡

### 6.1 Structure UKT ⚡

```yaml
universal_knowledge_thread:
  id: "UKT"
  name: "Universal Knowledge Thread"
  scope: "system_wide"
  
  schema:
    nodes: [
      {
        node_id: "uuid"
        type: "system_knowledge|best_practice|regulation|template"
        content: "string"
        category: "string"
        subcategory: "string"
        applicable_to: ["industry", "region", "agent_type"]
        authority: "system|verified|community"
        version: "string"
        effective_date: "iso8601"
        expiry_date: "iso8601|null"
      }
    ]
    
  categories:
    
    regulations:
      subcategories:
        - rbq_rules
        - cnesst_requirements
        - ccq_conventions
        - building_codes
        - environmental_laws
      update_frequency: "on_change"
      authority: "verified"
      
    best_practices:
      subcategories:
        - estimation
        - scheduling
        - safety
        - quality_control
        - documentation
      authority: "community"
      
    templates:
      subcategories:
        - contracts
        - reports
        - checklists
        - forms
      version_controlled: true
      
    system_knowledge:
      subcategories:
        - agent_capabilities
        - integration_specs
        - api_documentation
      authority: "system"
```

---

## 7) KNOWLEDGE THREAD OPERATIONS ⚡

### 7.1 Thread Connection ⚡

```yaml
thread_connections:

  connection_types:
    
    relates_to:
      strength: "weak"
      bidirectional: true
      description: "Relation générale"
      
    supports:
      strength: "medium"
      bidirectional: false
      description: "A supporte B"
      
    contradicts:
      strength: "medium"
      bidirectional: true
      description: "Contradiction"
      requires_resolution: true
      
    supersedes:
      strength: "strong"
      bidirectional: false
      description: "A remplace B"
      archives_target: true
      
    derives_from:
      strength: "strong"
      bidirectional: false
      description: "A dérive de B"
      
  connection_rules:
    max_connections_per_node: 20
    require_justification: true
    auto_detect: true
    manual_override: true
```

### 7.2 Thread Retrieval ⚡

```yaml
thread_retrieval:

  query_pipeline:
    
    1_parse_query:
      extract:
        - keywords
        - intent
        - context_hints
        - time_constraints
        
    2_expand_query:
      methods:
        - synonym_expansion
        - concept_expansion
        - spelling_correction
        
    3_search_threads:
      search_order:
        1: "PKT"  # Personal first
        2: "CKT"  # Then collective
        3: "ISKT" # Then inter-sphere
        4: "UKT"  # Then universal
      parallel: true
      
    4_rank_results:
      factors:
        relevance_score: 0.40
        recency: 0.20
        confidence: 0.15
        access_frequency: 0.10
        source_authority: 0.15
        
    5_filter_results:
      remove:
        - low_confidence: "< 0.3"
        - expired: true
        - access_denied: true
        
    6_assemble_context:
      max_nodes: 10
      max_tokens: 5000
      deduplication: true
      
  retrieval_modes:
    
    exact_match:
      use_case: "Looking up specific fact"
      
    semantic_search:
      use_case: "Finding related knowledge"
      embedding_model: "text-embedding-3-large"
      
    graph_traversal:
      use_case: "Exploring connections"
      max_depth: 3
      
    temporal_search:
      use_case: "Historical context"
      time_decay: true
```

### 7.3 Memory Consolidation ⚡

```yaml
memory_consolidation:

  stm_to_ltm:
    trigger: "end_of_session OR daily_batch"
    process:
      1: "identify_memorable_content"
      2: "extract_knowledge_nodes"
      3: "determine_thread_type"
      4: "check_duplicates"
      5: "validate_if_required"
      6: "store_in_thread"
      
    memorable_criteria:
      - "user_explicitly_stated"
      - "repeated_information"
      - "correction_of_previous"
      - "decision_made"
      - "lesson_learned"
      - "preference_expressed"
      
    extraction_rules:
      facts:
        trigger: "declarative_statement_about_self_or_company"
        confidence: 0.8
        
      preferences:
        trigger: "expressed_preference_or_correction"
        confidence: 0.9
        
      experiences:
        trigger: "narrative_about_past_event"
        confidence: 0.7
        
  periodic_consolidation:
    frequency: "weekly"
    tasks:
      - "merge_similar_nodes"
      - "strengthen_frequent_connections"
      - "decay_unused_nodes"
      - "archive_old_versions"
      - "update_confidence_scores"
```

---

## 8) MEMORY PRIVACY & CONTROL ⚡

### 8.1 User Control ⚡

```yaml
user_memory_control:

  view:
    access: "all_own_memory"
    format: "structured_list"
    filters:
      - by_type
      - by_date
      - by_confidence
      
  edit:
    allowed:
      - "correct_facts"
      - "update_preferences"
      - "add_explicit_knowledge"
    requires_confirmation: true
    logs_change: true
    
  delete:
    modes:
      single_node: "immediate"
      category: "with_confirmation"
      all_personal: "with_double_confirmation"
    soft_delete_period: "30d"
    permanent_after: "user_confirms OR 30d"
    
  export:
    format: ["json", "csv"]
    includes: ["PKT", "contributed_CKT"]
    
  forget_me:
    scope: "all_personal_data"
    process:
      1: "soft_delete_all"
      2: "anonymize_contributions"
      3: "remove_from_indexes"
      4: "permanent_delete_after_30d"
```

### 8.2 Privacy Levels ⚡

```yaml
privacy_levels:

  private:
    visibility: "user_only"
    sharing: "never"
    examples: ["personal_preferences", "private_notes"]
    
  team:
    visibility: "team_members"
    sharing: "with_consent"
    examples: ["project_decisions", "team_contacts"]
    
  department:
    visibility: "department"
    sharing: "department_head_approval"
    
  company:
    visibility: "all_company_users"
    sharing: "automatic_for_validated"
    
  public:
    visibility: "all_system_users"
    sharing: "automatic"
    examples: ["best_practices", "templates"]
```

---

## 9) MEMORY ANALYTICS ⚡

### 9.1 Usage Metrics ⚡

```yaml
memory_metrics:

  per_user:
    - total_nodes
    - nodes_by_type
    - retrieval_count
    - contribution_count
    - memory_size_bytes
    
  per_thread:
    - active_nodes
    - archived_nodes
    - avg_confidence
    - connection_density
    - retrieval_frequency
    
  system_wide:
    - total_knowledge_nodes
    - daily_retrievals
    - daily_additions
    - consolidation_rate
    - storage_usage
```

### 9.2 Quality Metrics ⚡

```yaml
memory_quality:

  relevance:
    measure: "retrieval_led_to_action / total_retrievals"
    target: "> 0.7"
    
  accuracy:
    measure: "corrections_needed / total_nodes"
    target: "< 0.05"
    
  freshness:
    measure: "nodes_updated_last_90d / total_nodes"
    target: "> 0.3"
    
  coverage:
    measure: "queries_with_results / total_queries"
    target: "> 0.8"
```

---

## 10) MEMORY API ⚡

```yaml
memory_api:

  endpoints:
    
    # QUERY
    POST /memory/query:
      description: "Query memory across threads"
      body:
        query: "string"
        threads: ["PKT", "CKT", "ISKT", "UKT"]
        filters: "object"
        max_results: 10
      response:
        results: [{ node, score, thread }]
        
    # ADD
    POST /memory/add:
      description: "Add knowledge node"
      body:
        content: "string"
        type: "string"
        thread: "PKT|CKT"
        metadata: "object"
      response:
        node_id: "string"
        status: "created|pending_validation"
        
    # UPDATE
    PUT /memory/node/{node_id}:
      description: "Update node"
      body:
        content: "string"
        metadata: "object"
      response:
        node_id: "string"
        version: "integer"
        
    # DELETE
    DELETE /memory/node/{node_id}:
      description: "Delete node"
      response:
        status: "deleted|soft_deleted"
        
    # EXPORT
    GET /memory/export:
      description: "Export user memory"
      params:
        format: "json|csv"
        threads: ["PKT", "CKT"]
      response:
        download_url: "string"
        
    # STATS
    GET /memory/stats:
      description: "Get memory statistics"
      response:
        total_nodes: "integer"
        by_thread: "object"
        by_type: "object"
```

---

**END — MEMORY SYSTEM & KNOWLEDGE THREADS v1.0**
