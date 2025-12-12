# CHE·NU — CHECKPOINTS & VALIDATION GATES SYSTEM
**VERSION:** CHECKPOINTS.v1.0  
**MODE:** FOUNDATION / PROACTIVE / KNOWLEDGE-FILTER

---

## 1) CONCEPT: CHECKPOINTS ⚡

### Définition
> **CHECKPOINT = Point de vérification automatique qui valide, filtre et décide AVANT de continuer**

### Principes ⚡
```
┌─────────────────────────────────────────────────────────────┐
│                      WORKFLOW                                │
│                                                              │
│  INPUT ──▶ [CP1] ──▶ PROCESS ──▶ [CP2] ──▶ OUTPUT ──▶ [CP3] │
│              │                      │                   │    │
│              ▼                      ▼                   ▼    │
│           VALIDATE              VALIDATE            VALIDATE │
│           FILTER                FILTER              FILTER   │
│           DECIDE                DECIDE              DECIDE   │
└─────────────────────────────────────────────────────────────┘
```

### Types de Checkpoints ⚡
| Type | Moment | Fonction |
|------|--------|----------|
| **CP-INPUT** | Avant traitement | Valider entrée |
| **CP-PROCESS** | Pendant traitement | Vérifier qualité |
| **CP-OUTPUT** | Après traitement | Valider sortie |
| **CP-HANDOFF** | Entre agents | Vérifier transfert |
| **CP-MEMORY** | Avant stockage | Filtrer pour mémoire |
| **CP-DECISION** | Points de décision | Décider proactivement |

---

## 2) CHECKPOINT STRUCTURE ⚡

### Template Checkpoint ⚡

```yaml
checkpoint:
  id: "CP_{TYPE}_{DOMAIN}_{NUMBER}"
  name: "Nom lisible"
  type: "input|process|output|handoff|memory|decision"
  
  # === DÉCLENCHEUR ===
  trigger:
    when: "before_action|after_action|on_condition"
    condition: "expression_booléenne"
    
  # === VALIDATIONS ===
  validations:
    - id: "VAL_001"
      name: "Nom de la validation"
      check: "condition_à_vérifier"
      severity: "info|warning|error|critical"
      on_fail: "continue|warn|block|escalate"
      
  # === FILTRES ===
  filters:
    - id: "FLT_001"
      name: "Nom du filtre"
      condition: "critère_de_filtre"
      action: "keep|discard|transform|flag"
      
  # === DÉCISIONS PROACTIVES ===
  decisions:
    - id: "DEC_001"
      name: "Nom de la décision"
      condition: "si_cette_condition"
      action: "alors_cette_action"
      auto_execute: true|false
      requires_approval: true|false
      
  # === OUTPUTS ===
  outputs:
    pass: "action_si_succès"
    fail: "action_si_échec"
    partial: "action_si_partiel"
```

---

## 3) CHECKPOINTS D'ENTRÉE (CP-INPUT) ⚡

### CP-INPUT-001: Validation Requête Utilisateur ⚡

```yaml
checkpoint:
  id: "CP_INPUT_REQUEST_001"
  name: "Validation Requête Utilisateur"
  type: "input"
  
  trigger:
    when: "on_user_message"
    
  validations:
    - id: "VAL_LANG"
      name: "Langue détectée"
      check: "detect_language(input)"
      severity: "info"
      on_fail: "continue"
      
    - id: "VAL_INTENT"
      name: "Intention claire"
      check: "intent_confidence >= 0.7"
      severity: "warning"
      on_fail: "ask_clarification"
      
    - id: "VAL_CONTEXT"
      name: "Contexte suffisant"
      check: "has_required_context(input)"
      severity: "warning"
      on_fail: "request_more_info"
      
    - id: "VAL_SAFE"
      name: "Contenu sécuritaire"
      check: "content_safety_score >= 0.95"
      severity: "critical"
      on_fail: "block_and_alert_L0"
      
  filters:
    - id: "FLT_PII"
      name: "Données personnelles"
      condition: "contains_pii(input)"
      action: "flag_for_redaction"
      
    - id: "FLT_SENSITIVE"
      name: "Info sensible business"
      condition: "contains_sensitive_business_data(input)"
      action: "flag_for_encryption"
      
  decisions:
    - id: "DEC_ROUTE"
      name: "Routing automatique"
      condition: "intent_confidence >= 0.9 AND single_domain"
      action: "route_to_specialist_directly"
      auto_execute: true
      
    - id: "DEC_ESCALATE"
      name: "Escalade complexité"
      condition: "complexity_score > 24"
      action: "invoke_L1_coordinator"
      auto_execute: true
```

### CP-INPUT-002: Validation Document Uploadé ⚡

```yaml
checkpoint:
  id: "CP_INPUT_DOCUMENT_002"
  name: "Validation Document Uploadé"
  type: "input"
  
  trigger:
    when: "on_file_upload"
    
  validations:
    - id: "VAL_FORMAT"
      name: "Format supporté"
      check: "file_extension IN supported_formats"
      severity: "error"
      on_fail: "reject_with_message"
      
    - id: "VAL_SIZE"
      name: "Taille acceptable"
      check: "file_size <= max_file_size"
      severity: "error"
      on_fail: "reject_with_message"
      
    - id: "VAL_VIRUS"
      name: "Scan antivirus"
      check: "virus_scan_passed"
      severity: "critical"
      on_fail: "quarantine_and_alert"
      
    - id: "VAL_READABLE"
      name: "Fichier lisible"
      check: "can_parse_file"
      severity: "error"
      on_fail: "reject_corrupted"
      
  filters:
    - id: "FLT_DUPLICATE"
      name: "Détection doublon"
      condition: "hash_exists_in_memory"
      action: "flag_as_duplicate"
      
    - id: "FLT_VERSION"
      name: "Version existante"
      condition: "similar_document_exists"
      action: "propose_version_update"
      
  decisions:
    - id: "DEC_CATEGORIZE"
      name: "Catégorisation auto"
      condition: "document_type_confidence >= 0.85"
      action: "auto_categorize_and_tag"
      auto_execute: true
      
    - id: "DEC_EXTRACT"
      name: "Extraction données"
      condition: "is_structured_document"
      action: "trigger_data_extraction_agent"
      auto_execute: true
```

### CP-INPUT-003: Validation Données Projet ⚡

```yaml
checkpoint:
  id: "CP_INPUT_PROJECT_003"
  name: "Validation Données Projet Construction"
  type: "input"
  
  trigger:
    when: "on_project_data_entry"
    
  validations:
    - id: "VAL_RBQ"
      name: "Licence RBQ valide"
      check: "verify_rbq_license(contractor_rbq)"
      severity: "critical"
      on_fail: "block_project_creation"
      
    - id: "VAL_CNESST"
      name: "CNESST à jour"
      check: "verify_cnesst_status(contractor_id)"
      severity: "critical"
      on_fail: "warn_and_flag"
      
    - id: "VAL_BUDGET"
      name: "Budget cohérent"
      check: "budget >= estimated_minimum"
      severity: "warning"
      on_fail: "alert_budget_risk"
      
    - id: "VAL_TIMELINE"
      name: "Échéancier réaliste"
      check: "duration >= minimum_realistic_duration"
      severity: "warning"
      on_fail: "alert_timeline_risk"
      
  decisions:
    - id: "DEC_RISK_LEVEL"
      name: "Niveau de risque"
      condition: "calculated_risk_score"
      action: |
        IF risk < 30: assign_standard_monitoring
        IF risk 30-60: assign_enhanced_monitoring
        IF risk > 60: require_L1_review
      auto_execute: true
```

---

## 4) CHECKPOINTS DE PROCESSUS (CP-PROCESS) ⚡

### CP-PROCESS-001: Validation Estimation ⚡

```yaml
checkpoint:
  id: "CP_PROCESS_ESTIMATION_001"
  name: "Validation en cours d'estimation"
  type: "process"
  
  trigger:
    when: "after_each_takeoff_complete"
    
  validations:
    - id: "VAL_QUANTITIES"
      name: "Quantités réalistes"
      check: "quantities_within_expected_range"
      severity: "warning"
      on_fail: "flag_for_review"
      
    - id: "VAL_UNITS"
      name: "Unités cohérentes"
      check: "all_units_consistent"
      severity: "error"
      on_fail: "halt_and_correct"
      
    - id: "VAL_PRICES"
      name: "Prix à jour"
      check: "price_data_age < 30_days"
      severity: "warning"
      on_fail: "refresh_prices"
      
  filters:
    - id: "FLT_OUTLIERS"
      name: "Valeurs aberrantes"
      condition: "value > mean + 3*std_dev"
      action: "flag_for_manual_review"
      
    - id: "FLT_ZERO"
      name: "Valeurs nulles suspectes"
      condition: "expected_value > 0 AND actual_value == 0"
      action: "flag_potential_error"
      
  decisions:
    - id: "DEC_CONTINGENCY"
      name: "Ajustement contingence"
      condition: "uncertainty_score > 0.3"
      action: "increase_contingency_rate(+5%)"
      auto_execute: true
      requires_approval: false
      
    - id: "DEC_SPECIALIST"
      name: "Appel spécialiste"
      condition: "specialty_outside_expertise"
      action: "invoke_specialist_agent"
      auto_execute: true
```

### CP-PROCESS-002: Validation Planification ⚡

```yaml
checkpoint:
  id: "CP_PROCESS_SCHEDULE_002"
  name: "Validation Planification"
  type: "process"
  
  trigger:
    when: "on_schedule_generation"
    
  validations:
    - id: "VAL_DEPENDENCIES"
      name: "Dépendances logiques"
      check: "no_circular_dependencies"
      severity: "critical"
      on_fail: "halt_and_fix"
      
    - id: "VAL_RESOURCES"
      name: "Ressources disponibles"
      check: "resources_not_overallocated"
      severity: "warning"
      on_fail: "flag_resource_conflict"
      
    - id: "VAL_WEATHER"
      name: "Fenêtres météo"
      check: "outdoor_tasks_in_good_weather_months"
      severity: "info"
      on_fail: "add_weather_contingency"
      
    - id: "VAL_PERMITS"
      name: "Délais permis inclus"
      check: "permit_lead_time_included"
      severity: "warning"
      on_fail: "add_permit_buffer"
      
  decisions:
    - id: "DEC_CRITICAL_PATH"
      name: "Chemin critique"
      condition: "critical_path_calculated"
      action: "flag_critical_tasks_for_monitoring"
      auto_execute: true
      
    - id: "DEC_BUFFER"
      name: "Ajout buffer"
      condition: "no_float_on_critical_path"
      action: "add_10%_buffer_to_milestones"
      auto_execute: true
      requires_approval: false
```

---

## 5) CHECKPOINTS DE SORTIE (CP-OUTPUT) ⚡

### CP-OUTPUT-001: Validation Soumission Finale ⚡

```yaml
checkpoint:
  id: "CP_OUTPUT_BID_001"
  name: "Validation Soumission Finale"
  type: "output"
  
  trigger:
    when: "before_bid_submission"
    
  validations:
    - id: "VAL_COMPLETE"
      name: "Document complet"
      check: "all_required_sections_present"
      severity: "critical"
      on_fail: "block_submission"
      sections_required:
        - sommaire_executif
        - portee_travaux
        - estimation_detaillee
        - echeancier
        - conditions_generales
        - annexes
        
    - id: "VAL_MATH"
      name: "Calculs vérifiés"
      check: "all_totals_correct"
      severity: "critical"
      on_fail: "recalculate_and_flag"
      
    - id: "VAL_MARGINS"
      name: "Marges acceptables"
      check: "profit_margin >= minimum_margin"
      severity: "warning"
      on_fail: "alert_low_margin"
      
    - id: "VAL_LEGAL"
      name: "Clauses légales"
      check: "all_legal_clauses_present"
      severity: "critical"
      on_fail: "add_missing_clauses"
      
    - id: "VAL_SPELLING"
      name: "Orthographe"
      check: "spell_check_passed"
      severity: "info"
      on_fail: "correct_spelling"
      
  filters:
    - id: "FLT_CONFIDENTIAL"
      name: "Info confidentielle"
      condition: "contains_internal_only_data"
      action: "remove_before_submission"
      
  decisions:
    - id: "DEC_COMPETITIVE"
      name: "Analyse compétitivité"
      condition: "always"
      action: |
        compare_to_market_rates()
        IF price > market_average * 1.2: flag_high_risk
        IF price < market_average * 0.8: flag_margin_risk
      auto_execute: true
      
    - id: "DEC_APPROVAL"
      name: "Niveau approbation requis"
      condition: "bid_value"
      action: |
        IF bid < 50000: auto_approve
        IF bid 50000-250000: require_L1_approval
        IF bid > 250000: require_L0_and_human
      auto_execute: true
```

### CP-OUTPUT-002: Validation Facture ⚡

```yaml
checkpoint:
  id: "CP_OUTPUT_INVOICE_002"
  name: "Validation Facture"
  type: "output"
  
  trigger:
    when: "before_invoice_send"
    
  validations:
    - id: "VAL_CLIENT"
      name: "Info client correcte"
      check: "client_info_matches_contract"
      severity: "error"
      on_fail: "halt_and_verify"
      
    - id: "VAL_AMOUNTS"
      name: "Montants corrects"
      check: "line_items_sum_to_total"
      severity: "critical"
      on_fail: "recalculate"
      
    - id: "VAL_TAXES"
      name: "Taxes calculées"
      check: "gst_qst_correctly_calculated"
      severity: "critical"
      on_fail: "recalculate_taxes"
      
    - id: "VAL_TERMS"
      name: "Conditions paiement"
      check: "payment_terms_per_contract"
      severity: "warning"
      on_fail: "adjust_terms"
      
    - id: "VAL_DUPLICATE"
      name: "Pas de doublon"
      check: "invoice_number_unique"
      severity: "critical"
      on_fail: "generate_new_number"
      
  decisions:
    - id: "DEC_EARLY_PAYMENT"
      name: "Offre escompte"
      condition: "client.payment_history == 'excellent' AND invoice_value > 10000"
      action: "add_early_payment_discount_offer"
      auto_execute: true
      requires_approval: false
```

---

## 6) CHECKPOINTS DE HANDOFF (CP-HANDOFF) ⚡

### CP-HANDOFF-001: Transfert Entre Agents ⚡

```yaml
checkpoint:
  id: "CP_HANDOFF_AGENT_001"
  name: "Validation Transfert Inter-Agent"
  type: "handoff"
  
  trigger:
    when: "on_task_transfer"
    
  validations:
    - id: "VAL_RECEIVING"
      name: "Agent destinataire actif"
      check: "receiving_agent.status == 'active'"
      severity: "critical"
      on_fail: "find_backup_agent"
      
    - id: "VAL_CAPABILITY"
      name: "Agent capable"
      check: "task_type IN receiving_agent.capabilities"
      severity: "critical"
      on_fail: "reroute_to_capable_agent"
      
    - id: "VAL_CONTEXT"
      name: "Contexte complet"
      check: "all_required_context_transferred"
      severity: "error"
      on_fail: "gather_missing_context"
      
    - id: "VAL_AUTHORIZATION"
      name: "Autorisation transfert"
      check: "transfer_authorized_by_hierarchy"
      severity: "warning"
      on_fail: "request_authorization"
      
  filters:
    - id: "FLT_RELEVANT"
      name: "Info pertinente seulement"
      condition: "for each data_item"
      action: "keep_only_if relevance_score >= 0.5"
      
  decisions:
    - id: "DEC_PRIORITY"
      name: "Priorité héritée"
      condition: "source_task.priority == 'high'"
      action: "maintain_high_priority"
      auto_execute: true
      
    - id: "DEC_DEADLINE"
      name: "Deadline ajustée"
      condition: "handoff_delay > expected"
      action: "recalculate_deadline_and_alert_if_risk"
      auto_execute: true
```

### CP-HANDOFF-002: Transfert Cross-Department ⚡

```yaml
checkpoint:
  id: "CP_HANDOFF_DEPT_002"
  name: "Validation Transfert Cross-Département"
  type: "handoff"
  
  trigger:
    when: "on_cross_department_transfer"
    
  validations:
    - id: "VAL_DEPT_AUTH"
      name: "Autorisation département"
      check: "cross_dept_authorization_granted"
      severity: "critical"
      on_fail: "request_L1_authorization"
      
    - id: "VAL_DATA_SCOPE"
      name: "Scope données approprié"
      check: "data_scope_appropriate_for_receiving_dept"
      severity: "warning"
      on_fail: "filter_data_scope"
      
    - id: "VAL_COMPLIANCE"
      name: "Conformité inter-dept"
      check: "meets_cross_dept_compliance_rules"
      severity: "error"
      on_fail: "adjust_for_compliance"
      
  filters:
    - id: "FLT_DEPT_SPECIFIC"
      name: "Données dept-specific"
      condition: "data.department_scope != receiving_dept"
      action: "redact_or_transform"
      
  decisions:
    - id: "DEC_NOTIFY_CHIEFS"
      name: "Notifier les Chiefs"
      condition: "always"
      action: "notify_both_L1_chiefs"
      auto_execute: true
```

---

## 7) CHECKPOINTS MÉMOIRE (CP-MEMORY) ⚡

### CP-MEMORY-001: Filtre Collective Memory ⚡

```yaml
checkpoint:
  id: "CP_MEMORY_COLLECTIVE_001"
  name: "Filtre pour Collective Memory"
  type: "memory"
  
  trigger:
    when: "before_memory_storage"
    
  validations:
    - id: "VAL_FACTUAL"
      name: "Information factuelle"
      check: "is_factual_not_opinion"
      severity: "error"
      on_fail: "reject_from_memory"
      
    - id: "VAL_VERIFIED"
      name: "Info vérifiée"
      check: "has_verification_source"
      severity: "warning"
      on_fail: "flag_as_unverified"
      
    - id: "VAL_CURRENT"
      name: "Info à jour"
      check: "data_age < max_age_for_type"
      severity: "warning"
      on_fail: "flag_as_potentially_outdated"
      
    - id: "VAL_UNIQUE"
      name: "Non redondante"
      check: "similarity_to_existing < 0.9"
      severity: "info"
      on_fail: "merge_or_update_existing"
      
  filters:
    - id: "FLT_NOISE"
      name: "Filtrer bruit"
      condition: "information_value_score < 0.3"
      action: "discard"
      
    - id: "FLT_TEMPORARY"
      name: "Info temporaire"
      condition: "is_temporary_context"
      action: "store_in_short_term_only"
      
    - id: "FLT_PRIVATE"
      name: "Info privée"
      condition: "marked_as_private OR contains_pii"
      action: "store_in_personal_memory_only"
      
    - id: "FLT_SENSITIVE"
      name: "Info sensible business"
      condition: "sensitivity_level >= 'confidential'"
      action: "encrypt_before_storage"
      
  decisions:
    - id: "DEC_MEMORY_TYPE"
      name: "Type de mémoire"
      condition: "analyze_content_type"
      action: |
        IF personal_only: store_PKT
        IF team_relevant: store_CKT
        IF cross_sphere: store_ISKT
      auto_execute: true
      
    - id: "DEC_RETENTION"
      name: "Durée rétention"
      condition: "content_importance_score"
      action: |
        IF score >= 0.8: retain_permanent
        IF score 0.5-0.8: retain_1_year
        IF score < 0.5: retain_90_days
      auto_execute: true
      
    - id: "DEC_INDEX"
      name: "Indexation"
      condition: "always"
      action: "extract_keywords_and_index"
      auto_execute: true
```

### CP-MEMORY-002: Filtre Knowledge Thread ⚡

```yaml
checkpoint:
  id: "CP_MEMORY_THREAD_002"
  name: "Filtre pour Knowledge Thread"
  type: "memory"
  
  trigger:
    when: "before_thread_node_addition"
    
  validations:
    - id: "VAL_RELEVANCE"
      name: "Pertinence au thread"
      check: "relevance_to_thread >= 0.6"
      severity: "warning"
      on_fail: "suggest_different_thread"
      
    - id: "VAL_CONNECTION"
      name: "Connexion factuelle"
      check: "has_factual_connection_to_existing_nodes"
      severity: "error"
      on_fail: "reject_node"
      
    - id: "VAL_NO_INFERENCE"
      name: "Pas d'inférence"
      check: "connection_is_explicit_not_inferred"
      severity: "critical"
      on_fail: "reject_inferred_connection"
      
  filters:
    - id: "FLT_DUPLICATE_NODE"
      name: "Nœud doublon"
      condition: "node_hash_exists_in_thread"
      action: "skip_addition"
      
  decisions:
    - id: "DEC_THREAD_SPLIT"
      name: "Split thread"
      condition: "thread_size > max_thread_size"
      action: "propose_thread_split"
      auto_execute: false
      requires_approval: true
      
    - id: "DEC_CROSS_THREAD"
      name: "Lien cross-thread"
      condition: "relevance_to_other_thread >= 0.7"
      action: "create_cross_thread_reference"
      auto_execute: true
```

---

## 8) CHECKPOINTS DE DÉCISION (CP-DECISION) ⚡

### CP-DECISION-001: Décision Financière ⚡

```yaml
checkpoint:
  id: "CP_DECISION_FINANCIAL_001"
  name: "Point de Décision Financière"
  type: "decision"
  
  trigger:
    when: "on_financial_threshold"
    
  thresholds:
    - name: "Petite dépense"
      condition: "amount < 1000"
      auto_approve: true
      notify: ["L3_BOOKKEEPER"]
      
    - name: "Dépense moyenne"
      condition: "amount >= 1000 AND amount < 10000"
      auto_approve: false
      require_approval: ["L2_BUDGETING"]
      notify: ["L1_CHIEF_FINANCE"]
      
    - name: "Dépense importante"
      condition: "amount >= 10000 AND amount < 50000"
      auto_approve: false
      require_approval: ["L1_CHIEF_FINANCE"]
      notify: ["L0_TREE_GUARDIAN"]
      
    - name: "Dépense majeure"
      condition: "amount >= 50000"
      auto_approve: false
      require_approval: ["L1_CHIEF_FINANCE", "L0_TREE_GUARDIAN", "HUMAN"]
      notify: ["ALL_CHIEFS"]
      
  validations:
    - id: "VAL_BUDGET"
      name: "Dans budget"
      check: "amount <= remaining_budget"
      severity: "warning"
      on_fail: "flag_budget_overrun"
      
    - id: "VAL_APPROVED_VENDOR"
      name: "Fournisseur approuvé"
      check: "vendor IN approved_vendors OR amount < 500"
      severity: "info"
      on_fail: "suggest_vendor_approval_process"
      
  decisions:
    - id: "DEC_PAYMENT_METHOD"
      name: "Méthode paiement"
      condition: "amount"
      action: |
        IF amount < 500: petty_cash_ok
        IF amount 500-5000: company_card
        IF amount > 5000: bank_transfer
      auto_execute: true
      
    - id: "DEC_CASH_FLOW"
      name: "Impact trésorerie"
      condition: "always"
      action: "calculate_cash_flow_impact_and_alert_if_critical"
      auto_execute: true
```

### CP-DECISION-002: Décision Projet ⚡

```yaml
checkpoint:
  id: "CP_DECISION_PROJECT_002"
  name: "Point de Décision Projet"
  type: "decision"
  
  trigger:
    when: "on_project_milestone"
    
  milestones:
    - name: "GO/NO-GO Initial"
      stage: "pre_bid"
      criteria:
        - "risk_assessment_complete"
        - "capacity_available"
        - "profit_margin >= 15%"
        - "client_credit_verified"
      require_all: true
      
    - name: "Démarrage Chantier"
      stage: "pre_construction"
      criteria:
        - "permits_obtained"
        - "contracts_signed"
        - "insurance_confirmed"
        - "bonds_in_place"
        - "site_access_confirmed"
      require_all: true
      
    - name: "Approbation Avancement"
      stage: "during_construction"
      criteria:
        - "work_quality_approved"
        - "schedule_on_track OR deviation_approved"
        - "budget_on_track OR overrun_approved"
      require_all: true
      
    - name: "Clôture Projet"
      stage: "post_construction"
      criteria:
        - "all_work_complete"
        - "inspections_passed"
        - "documentation_complete"
        - "final_invoice_sent"
        - "warranty_registered"
      require_all: true
      
  decisions:
    - id: "DEC_STAGE_ADVANCE"
      name: "Avancer au prochain stage"
      condition: "all_criteria_met"
      action: "advance_project_stage"
      auto_execute: false
      requires_approval: true
      approvers: ["L1_CHIEF_CONSTRUCTION"]
      
    - id: "DEC_HOLD"
      name: "Mettre en attente"
      condition: "critical_criteria_not_met"
      action: "hold_project_and_notify"
      auto_execute: true
      notify: ["L1_CHIEF_CONSTRUCTION", "HUMAN"]
```

### CP-DECISION-003: Décision Risque ⚡

```yaml
checkpoint:
  id: "CP_DECISION_RISK_003"
  name: "Point de Décision Risque"
  type: "decision"
  
  trigger:
    when: "on_risk_detected"
    
  risk_levels:
    - level: "LOW"
      score_range: [0, 30]
      actions:
        - "log_risk"
        - "continue_normal_operations"
      notify: ["L3_assigned_agent"]
      
    - level: "MEDIUM"
      score_range: [31, 60]
      actions:
        - "log_risk"
        - "create_mitigation_task"
        - "increase_monitoring"
      notify: ["L2_supervisor", "L3_assigned_agent"]
      
    - level: "HIGH"
      score_range: [61, 85]
      actions:
        - "log_risk"
        - "pause_related_tasks"
        - "create_urgent_mitigation"
        - "prepare_contingency"
      notify: ["L1_CHIEF", "L2_supervisor"]
      require_approval: ["L1_CHIEF"]
      
    - level: "CRITICAL"
      score_range: [86, 100]
      actions:
        - "log_risk"
        - "halt_all_related_operations"
        - "invoke_emergency_protocol"
        - "prepare_communication"
      notify: ["L0_TREE_GUARDIAN", "L1_CHIEF", "HUMAN"]
      require_approval: ["L0_TREE_GUARDIAN", "HUMAN"]
      
  validations:
    - id: "VAL_RISK_CALC"
      name: "Calcul risque valide"
      check: "risk_calculation_methodology_correct"
      severity: "critical"
      on_fail: "recalculate_risk"
      
  decisions:
    - id: "DEC_MITIGATION"
      name: "Stratégie mitigation"
      condition: "risk_level >= MEDIUM"
      action: "generate_mitigation_plan"
      auto_execute: true
      
    - id: "DEC_INSURANCE"
      name: "Révision assurance"
      condition: "risk_type == 'financial' AND amount > 100000"
      action: "flag_for_insurance_review"
      auto_execute: true
```

---

## 9) CHECKPOINT CHAINS (Séquences) ⚡

### Chaîne: Nouveau Projet Construction ⚡

```yaml
checkpoint_chain:
  id: "CHAIN_NEW_PROJECT"
  name: "Chaîne Nouveau Projet Construction"
  
  sequence:
    1:
      checkpoint: "CP_INPUT_REQUEST_001"
      on_pass: "continue"
      on_fail: "abort_with_message"
      
    2:
      checkpoint: "CP_INPUT_PROJECT_003"
      on_pass: "continue"
      on_fail: "request_missing_info"
      
    3:
      checkpoint: "CP_DECISION_PROJECT_002"
      milestone: "GO/NO-GO Initial"
      on_pass: "continue"
      on_fail: "abort_with_reason"
      
    4:
      checkpoint: "CP_PROCESS_ESTIMATION_001"
      on_pass: "continue"
      on_fail: "review_and_retry"
      
    5:
      checkpoint: "CP_PROCESS_SCHEDULE_002"
      on_pass: "continue"
      on_fail: "adjust_and_retry"
      
    6:
      checkpoint: "CP_OUTPUT_BID_001"
      on_pass: "continue"
      on_fail: "revise_bid"
      
    7:
      checkpoint: "CP_DECISION_FINANCIAL_001"
      on_pass: "continue"
      on_fail: "escalate_for_approval"
      
    8:
      checkpoint: "CP_MEMORY_COLLECTIVE_001"
      on_pass: "store_and_complete"
      on_fail: "complete_without_storage"
      
  rollback:
    enabled: true
    strategy: "step_by_step"
```

### Chaîne: Traitement Facture ⚡

```yaml
checkpoint_chain:
  id: "CHAIN_INVOICE"
  name: "Chaîne Traitement Facture"
  
  sequence:
    1:
      checkpoint: "CP_INPUT_DOCUMENT_002"
      on_pass: "continue"
      on_fail: "reject_document"
      
    2:
      checkpoint: "CP_PROCESS_DATA_EXTRACTION"
      on_pass: "continue"
      on_fail: "manual_entry_required"
      
    3:
      checkpoint: "CP_OUTPUT_INVOICE_002"
      on_pass: "continue"
      on_fail: "revise_invoice"
      
    4:
      checkpoint: "CP_DECISION_FINANCIAL_001"
      on_pass: "send_invoice"
      on_fail: "hold_for_approval"
      
    5:
      checkpoint: "CP_MEMORY_COLLECTIVE_001"
      on_pass: "archive_and_complete"
      on_fail: "complete_without_archive"
```

---

## 10) DASHBOARD CHECKPOINTS ⚡

### Métriques Temps Réel ⚡

```yaml
checkpoint_metrics:
  
  real_time:
    - metric: "checkpoints_passed"
      refresh: "5s"
      
    - metric: "checkpoints_failed"
      refresh: "5s"
      alert_threshold: "> 5% of total"
      
    - metric: "avg_checkpoint_duration"
      refresh: "10s"
      alert_threshold: "> 2x baseline"
      
    - metric: "decisions_pending_approval"
      refresh: "5s"
      alert_threshold: "> 10"
      
  hourly:
    - metric: "checkpoint_pass_rate_by_type"
    - metric: "most_common_failures"
    - metric: "auto_decisions_made"
    - metric: "escalations_triggered"
    
  daily:
    - metric: "knowledge_filtered_ratio"
    - metric: "proactive_decisions_accuracy"
    - metric: "checkpoint_optimization_suggestions"
```

### Rapport Checkpoint ⚡

```yaml
checkpoint_report:
  id: "REPORT_CHECKPOINT_DAILY"
  
  sections:
    - name: "Résumé"
      content:
        - total_checkpoints_executed
        - pass_rate
        - fail_rate
        - avg_processing_time
        
    - name: "Échecs Notables"
      content:
        - top_5_failure_reasons
        - impacted_workflows
        - resolution_status
        
    - name: "Décisions Proactives"
      content:
        - auto_decisions_count
        - decisions_requiring_approval
        - approval_wait_time_avg
        
    - name: "Filtrage Mémoire"
      content:
        - items_evaluated
        - items_stored
        - items_filtered_out
        - filter_reasons_breakdown
        
    - name: "Recommandations"
      content:
        - checkpoint_tuning_suggestions
        - threshold_adjustments
        - new_checkpoint_proposals
```

---

## 11) RÈGLES CHECKPOINT GLOBALES ⚡

### Règles Non-Négociables ⚡

```yaml
global_rules:

  safety:
    - "Tout checkpoint L0 est BLOQUANT"
    - "Aucun bypass de checkpoint de sécurité"
    - "Échec critique = arrêt immédiat"
    
  transparency:
    - "Tous les checkpoints sont loggés"
    - "Toutes les décisions sont traçables"
    - "Aucune décision cachée"
    
  human_control:
    - "L'humain peut override tout checkpoint"
    - "L'humain peut désactiver un checkpoint"
    - "L'humain reçoit notification des décisions critiques"
    
  ethics:
    - "Aucun checkpoint ne peut manipuler"
    - "Filtrage basé sur FAITS pas OPINIONS"
    - "Décisions proactives = suggestions, pas impositions"
```

---

**END — CHECKPOINTS & VALIDATION GATES v1.0**
