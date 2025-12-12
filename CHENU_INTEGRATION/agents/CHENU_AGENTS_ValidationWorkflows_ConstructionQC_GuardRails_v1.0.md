# CHE·NU — VALIDATION WORKFLOWS & CONSTRUCTION QC GUARD RAILS
**VERSION:** WORKFLOWS.v1.0  
**MODE:** FOUNDATION / QUEBEC-SPECIFIC / PRODUCTION

---

## 1) WORKFLOWS DE VALIDATION COMPLETS ⚡

### Concept
> **WORKFLOW = Séquence ordonnée de checkpoints avec logique de branchement**

```
┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
│  CP-1  │───▶│  CP-2  │───▶│  CP-3  │───▶│  CP-4  │
└────────┘    └────┬───┘    └────────┘    └────────┘
                   │
                   │ ON_FAIL
                   ▼
              ┌────────┐
              │ BRANCH │
              └────────┘
```

---

## 2) WORKFLOW: NOUVELLE SOUMISSION CONSTRUCTION ⚡

```yaml
workflow:
  id: "WF_BID_CONSTRUCTION"
  name: "Workflow Soumission Construction Complète"
  version: "1.0"
  
  # === PHASE 1: RÉCEPTION & VALIDATION INITIALE ===
  phase_1_intake:
    name: "Réception Documents"
    checkpoints:
      
      - id: "CP_BID_001"
        name: "Validation Appel d'Offres"
        checks:
          - "documents_complets":
              required: [plans, devis, addendas, formulaire_soumission]
              on_missing: "list_missing_and_request"
          - "date_limite_valide":
              check: "deadline > now + 48h"
              on_fail: "alert_urgent_timeline"
          - "projet_dans_expertise":
              check: "project_type IN company_expertise"
              on_fail: "flag_for_L1_review"
        decisions:
          - condition: "all_docs_present AND deadline_ok"
            action: "proceed_to_analysis"
          - condition: "missing_critical_docs"
            action: "request_docs_from_client"
            
      - id: "CP_BID_002"
        name: "Validation Capacité"
        checks:
          - "capacite_financiere":
              check: "project_value <= bonding_capacity * 0.8"
              on_fail: "check_joint_venture_option"
          - "disponibilite_equipe":
              check: "required_resources_available(project_dates)"
              on_fail: "check_subcontractor_options"
          - "expertise_requise":
              check: "all_trades_covered"
              on_fail: "identify_missing_trades"
        decisions:
          - condition: "capacity_ok AND team_available"
            action: "proceed_to_estimation"
          - condition: "capacity_issue"
            action: "escalate_L1_for_go_nogo"
            
  # === PHASE 2: ESTIMATION ===
  phase_2_estimation:
    name: "Processus Estimation"
    checkpoints:
    
      - id: "CP_BID_003"
        name: "Validation Takeoff"
        checks:
          - "plans_lisibles":
              check: "plan_quality_score >= 0.8"
              on_fail: "request_clearer_plans"
          - "echelle_correcte":
              check: "scale_verified"
              on_fail: "halt_and_verify_scale"
          - "quantites_coherentes":
              check: "quantities_within_expected_range(project_type, sqft)"
              on_fail: "flag_for_manual_review"
          - "rien_oublie":
              check: "all_spec_sections_covered"
              on_fail: "list_uncovered_sections"
        filters:
          - "outliers":
              condition: "quantity > historical_avg * 2"
              action: "flag_and_verify"
        decisions:
          - condition: "takeoff_complete AND verified"
            action: "proceed_to_pricing"
            
      - id: "CP_BID_004"
        name: "Validation Pricing"
        checks:
          - "prix_a_jour":
              check: "price_data_age < 30_days"
              on_fail: "refresh_supplier_quotes"
          - "marges_respectees":
              check: "markup >= minimum_markup"
              on_fail: "alert_low_margin"
          - "contingence_adequate":
              check: "contingency >= risk_based_minimum"
              on_fail: "adjust_contingency"
          - "sous_traitants_valides":
              check: "all_sub_quotes_valid_and_rbq_verified"
              on_fail: "flag_invalid_subs"
        decisions:
          - condition: "pricing_complete AND margins_ok"
            action: "proceed_to_schedule"
            
  # === PHASE 3: PLANIFICATION ===
  phase_3_schedule:
    name: "Planification"
    checkpoints:
    
      - id: "CP_BID_005"
        name: "Validation Échéancier"
        checks:
          - "duree_realiste":
              check: "duration >= minimum_realistic(scope)"
              on_fail: "flag_aggressive_schedule"
          - "meteo_consideree":
              check: "outdoor_work_in_good_months"
              on_fail: "add_weather_contingency"
          - "permis_inclus":
              check: "permit_lead_time_included"
              on_fail: "add_permit_buffer"
          - "chemin_critique_viable":
              check: "critical_path_has_float OR float_approved"
              on_fail: "add_buffer_to_milestones"
        decisions:
          - condition: "schedule_realistic"
            action: "proceed_to_legal"
            
  # === PHASE 4: RÉVISION LÉGALE ===
  phase_4_legal:
    name: "Révision Légale"
    checkpoints:
    
      - id: "CP_BID_006"
        name: "Validation Contrat"
        checks:
          - "clauses_standard":
              check: "all_protective_clauses_present"
              on_fail: "add_missing_clauses"
          - "risques_identifies":
              check: "risk_clauses_adequate"
              on_fail: "strengthen_risk_protection"
          - "conditions_paiement":
              check: "payment_terms_acceptable"
              on_fail: "flag_for_negotiation"
          - "hypotheque_legale":
              check: "legal_hypothec_clause_present"
              on_fail: "add_hypothec_clause"
        decisions:
          - condition: "legal_ok"
            action: "proceed_to_final_review"
            
  # === PHASE 5: RÉVISION FINALE ===
  phase_5_final:
    name: "Révision Finale"
    checkpoints:
    
      - id: "CP_BID_007"
        name: "Checkpoint Final Multi-Agent"
        type: "consensus"
        voters:
          - agent: "L2_ESTIMATOR"
            domain: "technical"
          - agent: "L2_SCHEDULER"
            domain: "timeline"
          - agent: "L2_CONTRACT_DRAFTER"
            domain: "legal"
          - agent: "L2_BUDGETING"
            domain: "financial"
        checks:
          - "estimation_validee":
              voter: "L2_ESTIMATOR"
              check: "technical_accuracy >= 0.95"
          - "echeancier_valide":
              voter: "L2_SCHEDULER"
              check: "schedule_achievable"
          - "contrat_valide":
              voter: "L2_CONTRACT_DRAFTER"
              check: "legal_protection_adequate"
          - "rentabilite_validee":
              voter: "L2_BUDGETING"
              check: "profit_margin >= target"
        consensus_rule: "all_approve OR 3/4_with_L1_override"
        decisions:
          - condition: "consensus_reached"
            action: "proceed_to_approval"
          - condition: "no_consensus"
            action: "escalate_L1_mediation"
            
      - id: "CP_BID_008"
        name: "Approbation Hiérarchique"
        type: "hierarchical"
        levels:
          - level: "L1"
            agent: "L1_CHIEF_CONSTRUCTION"
            condition: "always"
            timeout: "4h"
          - level: "L0"
            agent: "L0_TREE_GUARDIAN"
            condition: "bid_value > 250000 OR risk_score > 60"
            timeout: "2h"
          - level: "HUMAN"
            condition: "bid_value > 500000 OR risk_score > 80"
            timeout: "24h"
        decisions:
          - condition: "all_approvals_received"
            action: "finalize_and_submit"
          - condition: "rejection"
            action: "revise_per_feedback"
            
  # === PHASE 6: SOUMISSION & MÉMOIRE ===
  phase_6_submit:
    name: "Soumission & Archivage"
    checkpoints:
    
      - id: "CP_BID_009"
        name: "Validation Document Final"
        checks:
          - "format_correct":
              check: "output_format_matches_requirements"
          - "signatures_presentes":
              check: "all_required_signatures"
          - "annexes_completes":
              check: "all_annexes_attached"
        decisions:
          - condition: "document_ready"
            action: "submit_and_archive"
            
      - id: "CP_BID_010"
        name: "Archivage Mémoire"
        type: "memory"
        actions:
          - "store_bid_in_collective_memory"
          - "create_knowledge_thread"
          - "update_historical_data"
          - "log_lessons_learned"
        retention: "permanent"
```

---

## 3) GUARD RAILS CONSTRUCTION QUÉBEC ⚡

### GR-RBQ: Régie du Bâtiment du Québec ⚡

```yaml
guard_rail:
  id: "GR_RBQ"
  name: "Guard Rail RBQ"
  domain: "construction_qc"
  
  # === VÉRIFICATIONS LICENCE ===
  license_checks:
    
    - id: "GR_RBQ_001"
      name: "Licence Entrepreneur Général"
      check: "verify_rbq_license(contractor_id, 'general')"
      api: "https://www.rbq.gouv.qc.ca/services-en-ligne"
      frequency: "on_project_start AND monthly"
      on_fail:
        severity: "CRITICAL"
        action: "BLOCK_ALL_OPERATIONS"
        notify: ["L0", "L1", "HUMAN"]
        message: "Licence RBQ invalide ou expirée"
        
    - id: "GR_RBQ_002"
      name: "Licence Sous-Catégorie"
      check: "verify_rbq_subcategory(contractor_id, required_categories)"
      categories:
        - "1.1.1": "Bâtiments résidentiels neufs"
        - "1.1.2": "Bâtiments résidentiels - rénovation"
        - "1.2": "Bâtiments commerciaux"
        - "1.3": "Bâtiments industriels"
        - "2": "Génie civil et voirie"
        - "3": "Mécanique"
        - "4": "Électricité"
      on_fail:
        severity: "CRITICAL"
        action: "BLOCK_WORK_IN_CATEGORY"
        
    - id: "GR_RBQ_003"
      name: "Vérification Sous-Traitants"
      check: "FOR EACH subcontractor: verify_rbq_license(sub_id, sub_category)"
      on_fail:
        severity: "CRITICAL"
        action: "BLOCK_SUBCONTRACT"
        message: "Sous-traitant sans licence RBQ valide"
        
    - id: "GR_RBQ_004"
      name: "Restriction Travaux"
      check: "work_value <= license_restriction_limit"
      on_fail:
        severity: "WARNING"
        action: "FLAG_FOR_REVIEW"
        message: "Valeur travaux près de la limite de restriction"
        
  # === VÉRIFICATIONS CAUTIONNEMENT ===
  bonding_checks:
    
    - id: "GR_RBQ_005"
      name: "Cautionnement Licence"
      check: "license_bond_active AND bond_amount >= required_minimum"
      on_fail:
        severity: "CRITICAL"
        action: "BLOCK_NEW_CONTRACTS"
        
    - id: "GR_RBQ_006"
      name: "Cautionnement Projet"
      check: "project_bond_in_place IF project_value > bond_threshold"
      thresholds:
        public_contracts: 25000
        private_contracts: "per_contract_terms"
      on_fail:
        severity: "ERROR"
        action: "HALT_PROJECT_START"
```

### GR-CNESST: Santé-Sécurité ⚡

```yaml
guard_rail:
  id: "GR_CNESST"
  name: "Guard Rail CNESST"
  domain: "construction_qc"
  
  # === VÉRIFICATIONS INSCRIPTION ===
  registration_checks:
    
    - id: "GR_CNESST_001"
      name: "Inscription Employeur"
      check: "verify_cnesst_registration(employer_id)"
      api: "cnesst_api"
      frequency: "on_project_start AND quarterly"
      on_fail:
        severity: "CRITICAL"
        action: "BLOCK_ALL_WORK"
        legal_reference: "LSST Art. 2"
        
    - id: "GR_CNESST_002"
      name: "Cotisations À Jour"
      check: "cnesst_contributions_current(employer_id)"
      on_fail:
        severity: "CRITICAL"
        action: "BLOCK_NEW_CONTRACTS"
        message: "Cotisations CNESST en retard"
        
    - id: "GR_CNESST_003"
      name: "Attestation de Conformité"
      check: "attestation_valid(employer_id)"
      validity: "30_days"
      on_fail:
        severity: "ERROR"
        action: "REQUEST_NEW_ATTESTATION"
        
  # === VÉRIFICATIONS CHANTIER ===
  site_checks:
    
    - id: "GR_CNESST_004"
      name: "Avis d'Ouverture Chantier"
      check: "avis_ouverture_filed IF workers >= 10 OR duration > 30_days"
      deadline: "before_work_starts"
      on_fail:
        severity: "ERROR"
        action: "FILE_IMMEDIATELY"
        penalty_risk: true
        
    - id: "GR_CNESST_005"
      name: "Programme de Prévention"
      check: "prevention_program_active IF workers >= 20"
      components:
        - identification_risques
        - mesures_prevention
        - formation_requise
        - equipements_protection
      on_fail:
        severity: "ERROR"
        action: "CREATE_PROGRAM"
        
    - id: "GR_CNESST_006"
      name: "Coordonnateur Sécurité"
      check: "safety_coordinator_assigned IF multi_employer_site"
      on_fail:
        severity: "ERROR"
        action: "ASSIGN_COORDINATOR"
        
    - id: "GR_CNESST_007"
      name: "Formation ASP Construction"
      check: "FOR EACH worker: asp_card_valid(worker_id)"
      on_fail:
        severity: "CRITICAL"
        action: "REMOVE_WORKER_FROM_SITE"
        message: "Travailleur sans carte ASP valide"
        
    - id: "GR_CNESST_008"
      name: "Équipements Protection"
      check: "ppe_provided_and_worn"
      required:
        - casque_securite
        - bottes_securite
        - lunettes_protection
        - gants_si_requis
        - harnais_si_hauteur
      on_fail:
        severity: "ERROR"
        action: "HALT_WORK_IN_ZONE"
        
  # === DÉCLARATIONS ACCIDENTS ===
  accident_checks:
    
    - id: "GR_CNESST_009"
      name: "Déclaration Accident"
      trigger: "on_accident_report"
      checks:
        - "declaration_filed_within_24h"
        - "investigation_initiated"
        - "corrective_measures_identified"
      on_fail:
        severity: "CRITICAL"
        action: "ESCALATE_L0_IMMEDIATELY"
```

### GR-CCQ: Commission de la Construction ⚡

```yaml
guard_rail:
  id: "GR_CCQ"
  name: "Guard Rail CCQ"
  domain: "construction_qc"
  
  # === VÉRIFICATIONS MAIN-D'OEUVRE ===
  workforce_checks:
    
    - id: "GR_CCQ_001"
      name: "Certificat Compétence"
      check: "FOR EACH worker: ccq_certificate_valid(worker_id, trade)"
      on_fail:
        severity: "CRITICAL"
        action: "REMOVE_WORKER"
        message: "Travailleur sans certificat CCQ valide"
        
    - id: "GR_CCQ_002"
      name: "Ratio Apprentis"
      check: "apprentice_ratio <= max_ratio_per_trade"
      ratios:
        electricien: "1 apprenti : 1 compagnon"
        plombier: "1 apprenti : 1 compagnon"
        charpentier: "2 apprentis : 1 compagnon"
      on_fail:
        severity: "ERROR"
        action: "ADJUST_CREW_COMPOSITION"
        
    - id: "GR_CCQ_003"
      name: "Heures Rapportées"
      check: "hours_reported_to_ccq_monthly"
      deadline: "15th_of_following_month"
      on_fail:
        severity: "ERROR"
        action: "FILE_REPORT_IMMEDIATELY"
        penalty_risk: true
        
    - id: "GR_CCQ_004"
      name: "Taux Horaire Respecté"
      check: "hourly_rate >= ccq_minimum_rate(trade, region)"
      on_fail:
        severity: "CRITICAL"
        action: "ADJUST_PAYROLL"
        legal_risk: true
        
    - id: "GR_CCQ_005"
      name: "Avantages Sociaux"
      check: "benefits_contributions_current"
      components:
        - vacances
        - conges_feries
        - assurance
        - retraite
      on_fail:
        severity: "CRITICAL"
        action: "RECTIFY_CONTRIBUTIONS"
        
  # === MOBILITÉ MAIN-D'OEUVRE ===
  mobility_checks:
    
    - id: "GR_CCQ_006"
      name: "Priorité Régionale"
      check: "regional_priority_respected(project_region, worker_region)"
      on_fail:
        severity: "WARNING"
        action: "VERIFY_AVAILABILITY_LOCAL"
        
    - id: "GR_CCQ_007"
      name: "Carnet Référence"
      check: "placement_via_carnet IF union_required"
      on_fail:
        severity: "WARNING"
        action: "USE_OFFICIAL_PLACEMENT"
```

---

## 4) GUARD RAILS FINANCIERS ⚡

```yaml
guard_rail:
  id: "GR_FINANCE"
  name: "Guard Rail Financier"
  
  # === SEUILS AUTOMATIQUES ===
  thresholds:
    
    - id: "GR_FIN_001"
      name: "Approbation Dépense"
      tiers:
        - max: 500
          approval: "auto"
          notify: []
        - max: 2500
          approval: "L3_BOOKKEEPER"
          notify: ["L2_BUDGETING"]
        - max: 10000
          approval: "L2_BUDGETING"
          notify: ["L1_CHIEF_FINANCE"]
        - max: 50000
          approval: "L1_CHIEF_FINANCE"
          notify: ["L0", "HUMAN"]
        - max: null
          approval: "HUMAN"
          notify: ["L0", "L1", "ALL_CHIEFS"]
          
    - id: "GR_FIN_002"
      name: "Marge Bénéficiaire Minimum"
      check: "profit_margin >= minimum_margin"
      minimums:
        small_project: 0.15  # 15%
        medium_project: 0.12
        large_project: 0.10
        strategic_project: 0.08  # Avec approbation
      on_below_minimum:
        severity: "WARNING"
        action: "REQUIRE_L1_APPROVAL"
        
    - id: "GR_FIN_003"
      name: "Cash Flow Protection"
      check: "projected_cash_balance > minimum_reserve"
      minimum_reserve: "60_days_operating_expenses"
      on_fail:
        severity: "ERROR"
        action: "HALT_NON_ESSENTIAL_SPENDING"
        notify: ["L1_CHIEF_FINANCE", "HUMAN"]
        
    - id: "GR_FIN_004"
      name: "Dépassement Budget"
      check: "actual_cost <= budget * overrun_threshold"
      thresholds:
        warning: 1.05  # 5% over
        error: 1.10    # 10% over
        critical: 1.20 # 20% over
      actions:
        warning: "flag_and_monitor"
        error: "require_L1_approval_to_continue"
        critical: "halt_and_escalate_L0"
```

---

## 5) GUARD RAILS ÉTHIQUES ⚡

```yaml
guard_rail:
  id: "GR_ETHICS"
  name: "Guard Rail Éthique"
  level: "L0"
  
  # === MANIPULATION INTERDITE ===
  anti_manipulation:
    
    - id: "GR_ETH_001"
      name: "Détection Manipulation"
      check: "content_manipulation_score < 0.1"
      patterns_blocked:
        - "urgency_pressure"
        - "false_scarcity"
        - "emotional_exploitation"
        - "hidden_influence"
        - "dark_patterns"
      on_detect:
        severity: "CRITICAL"
        action: "BLOCK_AND_REWRITE"
        log: "manipulation_attempt"
        
    - id: "GR_ETH_002"
      name: "Transparence Décisions"
      check: "decision_has_visible_reasoning"
      on_fail:
        severity: "ERROR"
        action: "ADD_REASONING_TRACE"
        
    - id: "GR_ETH_003"
      name: "Pas de Décision Cachée"
      check: "no_hidden_automated_decisions"
      on_fail:
        severity: "CRITICAL"
        action: "EXPOSE_AND_REQUIRE_CONSENT"
        
  # === VIE PRIVÉE ===
  privacy:
    
    - id: "GR_ETH_004"
      name: "Protection Données Personnelles"
      check: "pii_properly_handled"
      rules:
        - "encrypt_at_rest"
        - "encrypt_in_transit"
        - "minimize_collection"
        - "purpose_limitation"
      on_fail:
        severity: "CRITICAL"
        action: "HALT_AND_REMEDIATE"
        
    - id: "GR_ETH_005"
      name: "Consentement Explicite"
      check: "user_consent_for_data_use"
      on_fail:
        severity: "ERROR"
        action: "REQUEST_CONSENT"
        
  # === BIAIS ===
  anti_bias:
    
    - id: "GR_ETH_006"
      name: "Détection Biais"
      check: "output_bias_score < 0.2"
      bias_types:
        - "demographic"
        - "confirmation"
        - "recency"
        - "authority"
      on_detect:
        severity: "WARNING"
        action: "FLAG_FOR_REVIEW"
```

---

## 6) MICRO-CHECKS RAPIDES ⚡

### Checks Instantanés (< 100ms) ⚡

```yaml
micro_checks:

  # === FORMAT ===
  format:
    - id: "MC_EMAIL"
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
      on_fail: "invalid_email_format"
      
    - id: "MC_PHONE_QC"
      pattern: "^\\+?1?[- ]?\\(?[2-9]\\d{2}\\)?[- ]?\\d{3}[- ]?\\d{4}$"
      on_fail: "invalid_phone_format"
      
    - id: "MC_POSTAL_CA"
      pattern: "^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$"
      on_fail: "invalid_postal_code"
      
    - id: "MC_RBQ"
      pattern: "^\\d{4}-\\d{4}-\\d{2}$"
      on_fail: "invalid_rbq_format"
      
    - id: "MC_NEQ"
      pattern: "^\\d{10}$"
      on_fail: "invalid_neq_format"
      
  # === RANGE ===
  range:
    - id: "MC_PERCENTAGE"
      check: "value >= 0 AND value <= 100"
      on_fail: "percentage_out_of_range"
      
    - id: "MC_POSITIVE"
      check: "value > 0"
      on_fail: "must_be_positive"
      
    - id: "MC_FUTURE_DATE"
      check: "date > now"
      on_fail: "date_must_be_future"
      
  # === EXISTENCE ===
  existence:
    - id: "MC_NOT_EMPTY"
      check: "value != null AND value != ''"
      on_fail: "field_required"
      
    - id: "MC_FILE_EXISTS"
      check: "file_exists(path)"
      on_fail: "file_not_found"
      
  # === COHÉRENCE ===
  coherence:
    - id: "MC_DATE_ORDER"
      check: "start_date < end_date"
      on_fail: "dates_out_of_order"
      
    - id: "MC_TOTAL_MATCH"
      check: "sum(line_items) == total"
      on_fail: "total_mismatch"
```

---

## 7) ANTI-PATTERNS & ERREURS COURANTES ⚡

```yaml
anti_patterns:

  # === ESTIMATION ===
  estimation:
    - id: "AP_EST_001"
      name: "Oubli Frais Généraux"
      detect: "no_overhead_in_estimate"
      action: "add_overhead_percentage"
      default: 0.15
      
    - id: "AP_EST_002"
      name: "Contingence Insuffisante"
      detect: "contingency < 0.05"
      action: "flag_low_contingency"
      
    - id: "AP_EST_003"
      name: "Prix Périmés"
      detect: "price_age > 60_days"
      action: "refresh_prices"
      
  # === PLANIFICATION ===
  scheduling:
    - id: "AP_SCH_001"
      name: "Pas de Buffer"
      detect: "no_float_on_critical_path"
      action: "add_10%_buffer"
      
    - id: "AP_SCH_002"
      name: "Travaux Extérieurs en Hiver"
      detect: "outdoor_concrete_work IN [dec, jan, feb]"
      action: "flag_weather_risk"
      
    - id: "AP_SCH_003"
      name: "Délai Permis Ignoré"
      detect: "no_permit_lead_time"
      action: "add_permit_buffer"
      default_buffer: "45_days"
      
  # === CONTRATS ===
  contracts:
    - id: "AP_CON_001"
      name: "Clause Paiement Manquante"
      detect: "no_payment_terms_clause"
      action: "add_standard_payment_clause"
      
    - id: "AP_CON_002"
      name: "Pas de Clause Changement"
      detect: "no_change_order_clause"
      action: "add_change_order_clause"
      
    - id: "AP_CON_003"
      name: "Hypothèque Légale Absente"
      detect: "no_legal_hypothec_mention"
      action: "add_hypothec_clause"
      
  # === FACTURATION ===
  invoicing:
    - id: "AP_INV_001"
      name: "TPS/TVQ Manquante"
      detect: "taxable_item AND no_taxes"
      action: "calculate_and_add_taxes"
      
    - id: "AP_INV_002"
      name: "Retenue Non-Calculée"
      detect: "holdback_applicable AND no_holdback"
      action: "calculate_holdback"
      rate: 0.10  # 10% standard
```

---

## 8) TABLEAUX DE DÉCISION RAPIDE ⚡

### Décision: Accepter Projet? ⚡

```yaml
decision_table:
  id: "DT_ACCEPT_PROJECT"
  name: "Accepter Projet?"
  
  inputs:
    - name: "profit_margin"
      type: "percentage"
    - name: "risk_score"
      type: "number"
    - name: "capacity_available"
      type: "boolean"
    - name: "expertise_match"
      type: "percentage"
    - name: "client_history"
      type: "enum"  # new, good, problematic
      
  rules:
    - conditions:
        profit_margin: ">= 15%"
        risk_score: "< 40"
        capacity_available: true
        expertise_match: ">= 80%"
        client_history: "any"
      decision: "AUTO_ACCEPT"
      
    - conditions:
        profit_margin: ">= 10%"
        risk_score: "< 60"
        capacity_available: true
        expertise_match: ">= 60%"
        client_history: ["new", "good"]
      decision: "L1_REVIEW"
      
    - conditions:
        profit_margin: ">= 8%"
        risk_score: "< 80"
        capacity_available: true
        expertise_match: ">= 50%"
      decision: "L1_L0_REVIEW"
      
    - conditions:
        profit_margin: "< 8%"
      decision: "LIKELY_DECLINE"
      
    - conditions:
        risk_score: ">= 80"
      decision: "DECLINE_OR_HUMAN"
      
    - conditions:
        capacity_available: false
      decision: "DECLINE_CAPACITY"
      
    - conditions:
        client_history: "problematic"
      decision: "HUMAN_DECISION"
```

### Décision: Niveau Approbation ⚡

```yaml
decision_table:
  id: "DT_APPROVAL_LEVEL"
  name: "Niveau Approbation Requis"
  
  inputs:
    - name: "amount"
      type: "currency"
    - name: "risk_score"
      type: "number"
    - name: "is_new_vendor"
      type: "boolean"
    - name: "is_budget_overrun"
      type: "boolean"
      
  rules:
    - conditions:
        amount: "< 1000"
        risk_score: "< 30"
        is_new_vendor: false
        is_budget_overrun: false
      approval: "AUTO"
      
    - conditions:
        amount: "< 10000"
        risk_score: "< 50"
        is_budget_overrun: false
      approval: "L2"
      
    - conditions:
        amount: "< 50000"
        risk_score: "< 70"
      approval: "L1"
      
    - conditions:
        amount: ">= 50000"
      approval: "L1_L0"
      
    - conditions:
        risk_score: ">= 70"
      approval: "L0_HUMAN"
      
    - conditions:
        is_budget_overrun: true
      approval: "L1_minimum"
      
    - conditions:
        is_new_vendor: true
        amount: ">= 5000"
      approval: "L1_minimum"
```

---

**END — VALIDATION WORKFLOWS & GUARD RAILS v1.0**
