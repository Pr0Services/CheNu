# CHE·NU — TASK DECOMPOSITION & MULTI-AGENT ORCHESTRATION
**VERSION:** ORCHESTRATION.v1.0  
**MODE:** FOUNDATION / PRODUCTION-READY / FREEZE

---

## 1) PRINCIPES DE SÉPARATION DES TÂCHES ⚡

### Règle Fondamentale
> **1 AGENT = 1 RESPONSABILITÉ CLAIRE**
> **Aucun agent ne fait tout. Chaque agent fait UNE chose excellemment.**

### Single Responsibility Principle (SRP) Pour Agents ⚡

```
┌─────────────────────────────────────────────────────────────┐
│                    TÂCHE COMPLEXE                           │
│         "Préparer une soumission de construction"           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   ┌─────────┐        ┌─────────┐        ┌─────────┐
   │ESTIMATOR│        │SCHEDULER│        │CONTRACT │
   │ Calcul  │        │Échéancier│       │ DRAFTER │
   │quantités│        │  délais  │        │ Contrat │
   └─────────┘        └─────────┘        └─────────┘
        │                   │                   │
        ▼                   ▼                   ▼
   ┌─────────┐        ┌─────────┐        ┌─────────┐
   │L3 TAKEOFF│       │L3 GANTT │        │L3 CLAUSE│
   │ CONCRETE │       │ BUILDER │        │ WRITER  │
   └─────────┘        └─────────┘        └─────────┘
```

---

## 2) CRITÈRES DE DÉCOMPOSITION ⚡

### 2.1 Critères Techniques ⚡

| Critère | Seuil Décomposition | Exemple |
|---------|---------------------|---------|
| **Nb étapes** | > 3 étapes | Estimation → Décomposer en takeoff + pricing + markup |
| **Domaines différents** | > 1 domaine | Finance + Legal → 2 agents |
| **Sources de données** | > 2 sources | BD + API + Fichier → Agent par source |
| **Temps estimé** | > 5 min traitement | Split en sous-tâches parallèles |
| **Risque d'erreur** | Élevé | Validation par agent séparé |

### 2.2 Critères Fonctionnels ⚡

| Critère | Question | Action |
|---------|----------|--------|
| **Expertise** | Faut-il une expertise spécialisée? | Agent spécialiste |
| **Vérification** | Faut-il valider le résultat? | Agent validateur |
| **Approbation** | Faut-il une approbation humaine? | Escalade L1/L0 |
| **Conformité** | Y a-t-il des règles légales? | Agent compliance |
| **Sensibilité** | Données sensibles? | Agent sécurisé |

---

## 3) SCORING DE COMPLEXITÉ ⚡

### 3.1 Matrice de Complexité ⚡

```yaml
complexity_score:
  formula: "C = (E × 2) + (D × 3) + (R × 4) + (T × 1) + (I × 2)"
  
  factors:
    E: # Étapes
      1: "1-2 étapes"
      2: "3-5 étapes"
      3: "6-10 étapes"
      4: "> 10 étapes"
      
    D: # Domaines impliqués
      1: "1 domaine"
      2: "2 domaines"
      3: "3-4 domaines"
      4: "> 4 domaines"
      
    R: # Risque
      1: "Faible - erreur sans conséquence"
      2: "Moyen - erreur corrigeable"
      3: "Élevé - erreur coûteuse"
      4: "Critique - erreur irréversible"
      
    T: # Temps
      1: "< 1 min"
      2: "1-5 min"
      3: "5-30 min"
      4: "> 30 min"
      
    I: # Intégrations externes
      1: "0-1 API"
      2: "2-3 APIs"
      3: "4-5 APIs"
      4: "> 5 APIs"
```

### 3.2 Niveaux de Complexité ⚡

| Score | Niveau | Agents Requis | Routing |
|-------|--------|---------------|---------|
| **1-8** | SIMPLE | 1 agent L3 | Direct |
| **9-15** | MODÉRÉ | 1-2 agents L2/L3 | L2 supervise |
| **16-24** | COMPLEXE | 3-5 agents multi-niveau | L1 coordonne |
| **25-36** | CRITIQUE | 5+ agents + L0 oversight | L0 approuve |
| **37+** | STRATÉGIQUE | Équipe complète + humain | Approbation CEO |

### 3.3 Exemple de Scoring ⚡

```yaml
task: "Préparer soumission pour projet 5M$"

scoring:
  E: 4  # > 10 étapes (plans, takeoff, pricing, schedule, contract, review)
  D: 3  # 3 domaines (construction, finance, legal)
  R: 3  # Élevé (erreur = perte du contrat ou pertes financières)
  T: 4  # > 30 min de traitement
  I: 3  # 4-5 APIs (RBQ, pricing, schedule, document)
  
  total: (4×2) + (3×3) + (3×4) + (4×1) + (3×2)
       = 8 + 9 + 12 + 4 + 6
       = 39 → STRATÉGIQUE
       
routing:
  coordinator: "L1_CHIEF_CONSTRUCTION"
  oversight: "L0_TREE_GUARDIAN"
  approval: "HUMAN_REQUIRED"
```

---

## 4) TRIGGERS MULTI-AGENT ⚡

### 4.1 Conditions de Déclenchement ⚡

```yaml
multi_agent_triggers:

  # === TRIGGER PAR COMPLEXITÉ ===
  complexity_trigger:
    condition: "complexity_score > 8"
    action: "invoke_coordinator"
    
  # === TRIGGER PAR DOMAINE ===
  cross_domain_trigger:
    condition: "domains.count > 1"
    action: "invoke_domain_agents"
    example: "Finance + Legal → L2_BOOKKEEPER + L2_CONTRACT_DRAFTER"
    
  # === TRIGGER PAR RISQUE ===
  risk_trigger:
    condition: "risk_level >= 'high'"
    action: "invoke_validator + require_approval"
    
  # === TRIGGER PAR MONTANT ===
  financial_trigger:
    thresholds:
      - amount: 10000
        action: "L2_FINANCE_REVIEW"
      - amount: 50000
        action: "L1_CHIEF_FINANCE + L2_LEGAL"
      - amount: 100000
        action: "L1 + L0_APPROVAL"
      - amount: 500000
        action: "FULL_TEAM + HUMAN_CEO"
        
  # === TRIGGER PAR TYPE DE DÉCISION ===
  decision_trigger:
    types:
      - type: "contractual"
        action: "invoke_legal_agent"
      - type: "financial"
        action: "invoke_finance_agent"
      - type: "safety"
        action: "invoke_safety_agent + L0_oversight"
      - type: "irreversible"
        action: "require_human_approval"
        
  # === TRIGGER PAR DEADLINE ===
  urgency_trigger:
    conditions:
      - deadline: "< 24h"
        action: "parallel_execution + priority_high"
      - deadline: "< 4h"
        action: "emergency_team + L1_direct"
      - deadline: "< 1h"
        action: "L0_intervention + human_alert"
```

### 4.2 Matrice de Triggers ⚡

| Condition | Agents L3 | Agents L2 | Agents L1 | L0 | Humain |
|-----------|-----------|-----------|-----------|-----|--------|
| Simple query | 1 | - | - | - | - |
| Multi-step task | 2-3 | 1 supervise | - | - | - |
| Cross-domain | 2-4 | 2 | 1 coord | - | - |
| High risk | 2-3 | 2 + validator | 1 | Monitor | - |
| Critical | 3-5 | 3 | 2 | Approve | Notify |
| Strategic | 5+ | 4+ | 2+ | Lead | **Required** |

---

## 5) PATTERNS DE COLLABORATION ⚡

### 5.1 Pattern: PIPELINE (Séquentiel) ⚡

```
QUAND: Tâches dépendantes, ordre strict requis

┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Agent A │───▶│ Agent B │───▶│ Agent C │───▶│ Agent D │
│(input)  │    │(process)│    │(validate)│   │(output) │
└─────────┘    └─────────┘    └─────────┘    └─────────┘

EXEMPLE: Estimation
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ TAKEOFF  │──▶│ PRICING  │──▶│ MARKUP   │──▶│ REVIEWER │
│(quantités)│  │(prix unit)│  │(marges)  │   │(validation)│
└──────────┘   └──────────┘   └──────────┘   └──────────┘
```

```yaml
pipeline_config:
  type: "sequential"
  stages:
    - agent: "L3_TAKEOFF"
      input: "plans"
      output: "quantities"
      timeout: 300s
      
    - agent: "L3_PRICING"
      input: "quantities"
      output: "unit_costs"
      timeout: 120s
      depends_on: "L3_TAKEOFF"
      
    - agent: "L3_MARKUP"
      input: "unit_costs"
      output: "final_estimate"
      timeout: 60s
      depends_on: "L3_PRICING"
      
    - agent: "L2_ESTIMATOR"
      input: "final_estimate"
      output: "validated_estimate"
      role: "validator"
      depends_on: "L3_MARKUP"
      
  error_handling:
    on_failure: "rollback_to_last_success"
    notify: "L1_CHIEF_CONSTRUCTION"
```

### 5.2 Pattern: PARALLEL (Simultané) ⚡

```
QUAND: Tâches indépendantes, optimisation temps

          ┌─────────┐
          │ Agent A │──────┐
          └─────────┘      │
                           │
┌─────────┐               ┌▼────────┐
│DISPATCHER│──────────────│AGGREGATOR│
└─────────┘               └▲────────┘
                           │
          ┌─────────┐      │
          │ Agent B │──────┘
          └─────────┘

EXEMPLE: Recherche multi-source
          ┌──────────┐
          │ SEARCH   │──────┐
          │ WEB      │      │
          └──────────┘      │
                            │
┌──────────┐              ┌─▼─────────┐
│ RESEARCH │              │ SYNTHESIZER│
│ CHIEF    │              │ (agrégation)│
└──────────┘              └─▲─────────┘
                            │
          ┌──────────┐      │
          │ SEARCH   │──────┘
          │ INTERNAL │
          └──────────┘
```

```yaml
parallel_config:
  type: "parallel"
  dispatcher: "L1_CHIEF_RESEARCH"
  
  branches:
    - agent: "L3_WEB_SEARCHER"
      input: "query"
      timeout: 30s
      
    - agent: "L3_INTERNAL_SEARCHER"
      input: "query"
      timeout: 20s
      
    - agent: "L3_ACADEMIC_SEARCHER"
      input: "query"
      timeout: 45s
      
  aggregator:
    agent: "L2_RESEARCH_SYNTHESIZER"
    merge_strategy: "union_deduplicate"
    ranking: "relevance_score"
    
  completion:
    mode: "wait_all"  # ou "first_success" ou "majority"
    timeout: 60s
```

### 5.3 Pattern: HIERARCHICAL (Cascade) ⚡

```
QUAND: Supervision requise, approbations en cascade

              ┌─────────┐
              │   L0    │ ← Veto final
              │GUARDIAN │
              └────┬────┘
                   │
              ┌────▼────┐
              │   L1    │ ← Coordination
              │ CHIEF   │
              └────┬────┘
                   │
         ┌────────┼────────┐
         │        │        │
    ┌────▼───┐┌───▼───┐┌───▼───┐
    │  L2    ││  L2   ││  L2   │ ← Supervision
    │TACTICAL││TACTICAL││TACTICAL│
    └────┬───┘└───┬───┘└───┬───┘
         │        │        │
    ┌────▼───┐┌───▼───┐┌───▼───┐
    │  L3    ││  L3   ││  L3   │ ← Exécution
    │EXECUTOR││EXECUTOR││EXECUTOR│
    └────────┘└───────┘└────────┘
```

```yaml
hierarchical_config:
  type: "hierarchical"
  
  levels:
    L0:
      role: "oversight"
      agents: ["TREE_GUARDIAN"]
      triggers: ["high_risk", "ethical_concern", "strategic"]
      actions: ["veto", "approve", "escalate_human"]
      
    L1:
      role: "coordination"
      agents: ["CHIEF_CONSTRUCTION"]
      triggers: ["cross_team", "budget_exceeded", "deadline_risk"]
      actions: ["reassign", "prioritize", "request_resources"]
      
    L2:
      role: "supervision"
      agents: ["ESTIMATOR", "SCHEDULER", "QUALITY"]
      triggers: ["quality_issue", "progress_delay"]
      actions: ["review", "correct", "escalate_L1"]
      
    L3:
      role: "execution"
      agents: ["TAKEOFF_*", "REPORT_*", "DATA_*"]
      triggers: ["task_assigned"]
      actions: ["execute", "report", "flag_issue"]
      
  escalation_rules:
    - from: "L3"
      to: "L2"
      conditions: ["error", "blocked", "uncertain"]
      
    - from: "L2"
      to: "L1"
      conditions: ["budget_impact", "schedule_impact", "quality_fail"]
      
    - from: "L1"
      to: "L0"
      conditions: ["ethical_concern", "legal_risk", "strategic_decision"]
```

### 5.4 Pattern: CONSENSUS (Vote) ⚡

```
QUAND: Décision importante, multiple perspectives requises

    ┌─────────┐  ┌─────────┐  ┌─────────┐
    │ Agent A │  │ Agent B │  │ Agent C │
    │ (vote)  │  │ (vote)  │  │ (vote)  │
    └────┬────┘  └────┬────┘  └────┬────┘
         │            │            │
         └──────┬─────┴────────────┘
                │
         ┌──────▼──────┐
         │  CONSENSUS  │
         │   ENGINE    │
         └──────┬──────┘
                │
         ┌──────▼──────┐
         │  DECISION   │
         │  (majority) │
         └─────────────┘

EXEMPLE: Validation de soumission
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ESTIMATOR │  │ LEGAL    │  │ FINANCE  │
    │(technique)│ │(contrat) │  │(rentabilité)│
    └────┬─────┘  └────┬─────┘  └────┬─────┘
         │             │             │
         ▼             ▼             ▼
      ✅ GO        ⚠️ REVISE      ✅ GO
         │             │             │
         └──────┬──────┴─────────────┘
                │
         ┌──────▼──────┐
         │  MAJORITY   │
         │  = REVISE   │
         └─────────────┘
```

```yaml
consensus_config:
  type: "consensus"
  
  voters:
    - agent: "L2_ESTIMATOR"
      weight: 1.0
      domain: "technical"
      
    - agent: "L2_CONTRACT_DRAFTER"
      weight: 1.0
      domain: "legal"
      
    - agent: "L2_BUDGETING"
      weight: 1.0
      domain: "financial"
      
  decision_rules:
    unanimous: "all_approve → auto_proceed"
    majority: "2/3 approve → proceed_with_notes"
    split: "no_majority → escalate_L1"
    veto: "any_critical_concern → escalate_L0"
    
  veto_conditions:
    - "legal_violation"
    - "safety_concern"
    - "ethical_issue"
    - "budget_exceeded_20%"
```

### 5.5 Pattern: SPECIALIST + GENERALIST ⚡

```
QUAND: Tâche nécessite expertise + contexte large

┌─────────────────────────────────────────────┐
│              GENERALIST (L1)                │
│         (contexte global, coordination)     │
└──────────────────┬──────────────────────────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
┌────▼────┐  ┌─────▼────┐  ┌────▼────┐
│SPECIALIST│  │SPECIALIST│  │SPECIALIST│
│ (expert) │  │ (expert) │  │ (expert) │
└─────────┘  └──────────┘  └─────────┘

EXEMPLE: Projet complexe
┌─────────────────────────────────────────────┐
│          PROJECT_MANAGER (L1)               │
│    (vision globale, deadlines, budget)      │
└──────────────────┬──────────────────────────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
┌────▼────┐  ┌─────▼────┐  ┌────▼────┐
│   BIM   │  │  SAFETY  │  │PERMITS  │
│SPECIALIST│ │ OFFICER  │  │SPECIALIST│
│(modèles)│  │(sécurité)│  │(permis) │
└─────────┘  └──────────┘  └─────────┘
```

---

## 6) OBJECTIFS & CRITÈRES DE SUCCÈS ⚡

### 6.1 Critères Par Niveau ⚡

```yaml
success_criteria:

  L3_OPERATIONAL:
    accuracy: ">= 95%"
    completion_rate: ">= 98%"
    response_time: "< 30s simple, < 5min complex"
    escalation_rate: "< 15%"  # Si trop haut = mauvais routing
    
  L2_TACTICAL:
    supervision_quality: ">= 90% catch errors"
    coordination_efficiency: ">= 85%"
    decision_accuracy: ">= 92%"
    escalation_appropriateness: ">= 95%"
    
  L1_STRATEGIC:
    cross_team_coordination: ">= 90%"
    resource_optimization: ">= 85%"
    deadline_adherence: ">= 95%"
    stakeholder_satisfaction: ">= 4.0/5"
    
  L0_CONSTITUTIONAL:
    ethical_compliance: "100%"
    veto_accuracy: "100%"
    false_positive_rate: "< 2%"
    audit_completeness: "100%"
```

### 6.2 Métriques de Collaboration ⚡

```yaml
collaboration_metrics:

  # Efficacité du handoff entre agents
  handoff_success_rate:
    target: ">= 98%"
    measure: "tasks_successfully_transferred / total_transfers"
    
  # Temps perdu en coordination
  coordination_overhead:
    target: "< 15% of total task time"
    measure: "time_coordinating / total_time"
    
  # Qualité des outputs multi-agent
  multi_agent_quality:
    target: ">= single_agent_quality"
    measure: "quality_score_multi / quality_score_single"
    
  # Évitement des conflits
  conflict_rate:
    target: "< 5%"
    measure: "conflicting_decisions / total_decisions"
    
  # Utilisation appropriée des ressources
  agent_utilization:
    target: "60-80%"  # Pas surchargé, pas sous-utilisé
    measure: "active_time / available_time"
```

### 6.3 Seuils d'Alerte ⚡

```yaml
alert_thresholds:

  performance:
    - metric: "response_time"
      warning: "> 2x normal"
      critical: "> 5x normal"
      action: "scale_up_agents"
      
    - metric: "error_rate"
      warning: "> 5%"
      critical: "> 10%"
      action: "pause_and_review"
      
    - metric: "escalation_rate"
      warning: "> 20%"
      critical: "> 35%"
      action: "retrain_routing"
      
  collaboration:
    - metric: "handoff_failures"
      warning: "> 3 per hour"
      critical: "> 10 per hour"
      action: "review_interfaces"
      
    - metric: "consensus_deadlocks"
      warning: "> 2 per day"
      critical: "> 5 per day"
      action: "adjust_decision_rules"
```

---

## 7) ROUTING INTELLIGENT ⚡

### 7.1 Decision Tree ⚡

```
                    ┌─────────────────┐
                    │  NOUVELLE TÂCHE │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ ANALYZE REQUEST │
                    │ (complexity,    │
                    │  domain, risk)  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
      ┌───────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
      │ SCORE < 9    │ │ SCORE 9-24│ │ SCORE > 24  │
      │   SIMPLE     │ │  COMPLEX  │ │  CRITICAL   │
      └───────┬──────┘ └─────┬─────┘ └──────┬──────┘
              │              │              │
      ┌───────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
      │ ROUTE TO     │ │ INVOKE    │ │ INVOKE L1   │
      │ SINGLE L3    │ │ L2 + L3s  │ │ TEAM + L0   │
      └──────────────┘ └───────────┘ └─────────────┘
```

### 7.2 Router Agent Configuration ⚡

```yaml
router_agent:
  id: "AGENT_ROUTER"
  level: 1
  
  routing_rules:
    # Règles par mots-clés
    keyword_rules:
      - keywords: ["facture", "paiement", "comptabilité"]
        route_to: "L1_CHIEF_FINANCE"
        
      - keywords: ["contrat", "avocat", "légal", "poursuite"]
        route_to: "L1_CHIEF_LEGAL"
        
      - keywords: ["chantier", "construction", "soumission", "RBQ"]
        route_to: "L1_CHIEF_CONSTRUCTION"
        
      - keywords: ["design", "logo", "marketing", "pub"]
        route_to: "L1_CHIEF_CREATIVE"
        
    # Règles par complexité
    complexity_rules:
      - score_range: [1, 8]
        route_to: "direct_L3"
        
      - score_range: [9, 15]
        route_to: "L2_supervisor"
        
      - score_range: [16, 24]
        route_to: "L1_coordinator"
        
      - score_range: [25, 100]
        route_to: "L1_team_with_L0"
        
    # Règles par urgence
    urgency_rules:
      - urgency: "low"
        mode: "queue"
        
      - urgency: "normal"
        mode: "next_available"
        
      - urgency: "high"
        mode: "priority"
        
      - urgency: "critical"
        mode: "interrupt_all"
```

---

## 8) EXEMPLES CONCRETS ⚡

### 8.1 Exemple: Soumission Construction 500K$ ⚡

```yaml
task: "Préparer soumission pour projet commercial 500K$"

# ÉTAPE 1: SCORING
complexity_analysis:
  E: 4  # > 10 étapes
  D: 4  # 4 domaines (construction, finance, legal, operations)
  R: 4  # Critique (perte potentielle importante)
  T: 4  # > 30 min
  I: 4  # > 5 APIs
  
  total: 48 → STRATÉGIQUE

# ÉTAPE 2: ROUTING
routing_decision:
  coordinator: "L1_CHIEF_CONSTRUCTION"
  oversight: "L0_TREE_GUARDIAN"
  human_approval: "REQUIRED"
  
# ÉTAPE 3: TEAM ASSEMBLY
team:
  L1:
    - CHIEF_CONSTRUCTION (lead)
    - CHIEF_FINANCE (support)
    - CHIEF_LEGAL (review)
    
  L2:
    - ESTIMATOR
    - SCHEDULER
    - CONTRACT_DRAFTER
    - BUDGETING
    - PERMITS_SPECIALIST
    
  L3:
    - TAKEOFF_CONCRETE
    - TAKEOFF_STEEL
    - TAKEOFF_ELECTRICAL
    - TAKEOFF_MECHANICAL
    - PRICING_MATERIALS
    - PRICING_LABOR
    - GANTT_BUILDER
    - CLAUSE_WRITER
    
# ÉTAPE 4: WORKFLOW
workflow:
  phase_1_parallel:  # Exécution simultanée
    - task: "Takeoff béton"
      agent: "L3_TAKEOFF_CONCRETE"
    - task: "Takeoff acier"
      agent: "L3_TAKEOFF_STEEL"
    - task: "Takeoff électricité"
      agent: "L3_TAKEOFF_ELECTRICAL"
    - task: "Takeoff mécanique"
      agent: "L3_TAKEOFF_MECHANICAL"
      
  phase_2_sequential:  # Après phase 1
    - task: "Pricing matériaux"
      agent: "L3_PRICING_MATERIALS"
      input: "phase_1_outputs"
    - task: "Pricing main-d'œuvre"
      agent: "L3_PRICING_LABOR"
      
  phase_3_parallel:
    - task: "Échéancier"
      agent: "L2_SCHEDULER"
    - task: "Analyse rentabilité"
      agent: "L2_BUDGETING"
    - task: "Vérification permis"
      agent: "L2_PERMITS_SPECIALIST"
      
  phase_4_sequential:
    - task: "Rédaction contrat"
      agent: "L2_CONTRACT_DRAFTER"
    - task: "Revue légale"
      agent: "L1_CHIEF_LEGAL"
      
  phase_5_consensus:
    voters:
      - L1_CHIEF_CONSTRUCTION
      - L1_CHIEF_FINANCE
      - L1_CHIEF_LEGAL
    decision: "GO / REVISE / NO-GO"
    
  phase_6_approval:
    - agent: "L0_TREE_GUARDIAN"
      action: "ethical_review"
    - agent: "HUMAN"
      action: "final_approval"
```

### 8.2 Exemple: Question Simple ⚡

```yaml
task: "Quel est le taux horaire CCQ pour un électricien?"

# SCORING
complexity_analysis:
  E: 1  # 1 étape (lookup)
  D: 1  # 1 domaine
  R: 1  # Faible risque
  T: 1  # < 1 min
  I: 1  # 1 API
  
  total: 6 → SIMPLE

# ROUTING
routing_decision:
  direct_to: "L3_LABOR_RATES"
  supervisor: null
  approval: null
  
# EXECUTION
execution:
  agent: "L3_LABOR_RATES"
  action: "lookup_ccq_rate"
  params:
    trade: "electrician"
    region: "{{user.ccq_region}}"
    date: "current"
  response_time: "< 5s"
```

### 8.3 Exemple: Complexité Moyenne ⚡

```yaml
task: "Crée une facture pour le projet ABC avec les heures travaillées"

# SCORING
complexity_analysis:
  E: 2  # 3-5 étapes
  D: 2  # 2 domaines (finance, projet)
  R: 2  # Moyen (erreur corrigeable)
  T: 2  # 1-5 min
  I: 2  # 2-3 APIs
  
  total: 14 → MODÉRÉ

# ROUTING
routing_decision:
  supervisor: "L2_INVOICING"
  executors:
    - "L3_TIMESHEET_READER"
    - "L3_INVOICE_GENERATOR"
    
# WORKFLOW
workflow:
  step_1:
    agent: "L3_TIMESHEET_READER"
    action: "extract_hours"
    input: "project_ABC"
    
  step_2:
    agent: "L3_INVOICE_GENERATOR"
    action: "create_invoice"
    input: "step_1.output"
    
  step_3:
    agent: "L2_INVOICING"
    action: "review_and_validate"
    input: "step_2.output"
```

---

## 9) GESTION DES CONFLITS ⚡

### 9.1 Types de Conflits ⚡

| Type | Description | Résolution |
|------|-------------|------------|
| **Resource** | 2+ agents veulent même ressource | Queue prioritaire |
| **Decision** | Agents en désaccord | Consensus ou escalade |
| **Data** | Données contradictoires | Source of truth définie |
| **Timeline** | Deadlines incompatibles | L1 re-prioritise |
| **Authority** | Qui décide? | Hiérarchie L0>L1>L2>L3 |

### 9.2 Protocole de Résolution ⚡

```yaml
conflict_resolution:

  level_1_auto:
    # Résolution automatique
    - type: "resource_conflict"
      rule: "priority_queue"
      tiebreaker: "first_come_first_served"
      
    - type: "data_conflict"
      rule: "most_recent_wins"
      fallback: "source_of_truth_db"
      
  level_2_escalate_L2:
    # Escalade au superviseur L2
    - type: "quality_disagreement"
      action: "L2_makes_final_call"
      timeout: "5min"
      
  level_3_escalate_L1:
    # Escalade au coordinateur L1
    - type: "cross_department_conflict"
      action: "L1_mediates"
      timeout: "30min"
      
  level_4_escalate_L0:
    # Escalade à L0
    - type: "ethical_conflict"
      action: "L0_decides"
      timeout: "immediate"
      
  level_5_human:
    # Intervention humaine
    - type: "strategic_conflict"
      action: "human_decision"
      notification: "urgent"
```

---

## 10) MONITORING & OBSERVABILITÉ ⚡

### 10.1 Dashboard Métriques ⚡

```yaml
monitoring_dashboard:

  real_time:
    - metric: "active_agents"
      refresh: "1s"
      
    - metric: "tasks_in_progress"
      refresh: "1s"
      
    - metric: "error_rate"
      refresh: "5s"
      alert_threshold: "> 5%"
      
    - metric: "avg_response_time"
      refresh: "5s"
      
  hourly:
    - metric: "tasks_completed"
    - metric: "escalation_count"
    - metric: "multi_agent_collaborations"
    - metric: "human_interventions"
    
  daily:
    - metric: "complexity_distribution"
    - metric: "agent_utilization"
    - metric: "success_rate_by_level"
    - metric: "top_error_types"
```

### 10.2 Tracing Distribué ⚡

```yaml
trace_config:
  enabled: true
  
  trace_fields:
    - task_id
    - agents_involved
    - start_time
    - end_time
    - complexity_score
    - routing_decision
    - handoffs
    - escalations
    - final_result
    
  storage:
    type: "append_only"
    retention: "90 days"
    hash: "sha256"
```

---

**END — TASK DECOMPOSITION & MULTI-AGENT ORCHESTRATION v1.0**
