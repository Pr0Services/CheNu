# CHE·NU — SCORING, METRICS & PERFORMANCE TRACKING
**VERSION:** METRICS.v1.0  
**MODE:** FOUNDATION / ANALYTICS / OPTIMIZATION

---

## 1) SYSTÈME DE SCORING UNIVERSEL ⚡

### 1.1 Agent Performance Score (APS) ⚡

```yaml
agent_performance_score:
  id: "APS"
  name: "Agent Performance Score"
  range: [0, 100]
  
  formula: |
    APS = (Q × 0.30) + (E × 0.25) + (R × 0.20) + (A × 0.15) + (C × 0.10)
    
  components:
    
    Q_quality:
      weight: 0.30
      metrics:
        - task_success_rate:
            formula: "successful_tasks / total_tasks"
            target: ">= 0.95"
        - error_rate:
            formula: "1 - (errors / total_outputs)"
            target: ">= 0.98"
        - rework_rate:
            formula: "1 - (reworks / total_tasks)"
            target: ">= 0.90"
      score: "average(metrics) × 100"
      
    E_efficiency:
      weight: 0.25
      metrics:
        - response_time_score:
            formula: "target_time / actual_time"
            cap: 1.0
        - throughput_score:
            formula: "actual_throughput / target_throughput"
            cap: 1.0
        - resource_efficiency:
            formula: "work_done / resources_used"
      score: "average(metrics) × 100"
      
    R_reliability:
      weight: 0.20
      metrics:
        - uptime:
            formula: "available_time / total_time"
            target: ">= 0.99"
        - consistency:
            formula: "1 - (variance / mean)"
            target: ">= 0.90"
        - failure_recovery_speed:
            formula: "target_recovery / actual_recovery"
      score: "average(metrics) × 100"
      
    A_adaptability:
      weight: 0.15
      metrics:
        - new_task_handling:
            formula: "successful_new_tasks / total_new_tasks"
        - learning_rate:
            formula: "improvement_over_time"
        - escalation_appropriateness:
            formula: "appropriate_escalations / total_escalations"
      score: "average(metrics) × 100"
      
    C_collaboration:
      weight: 0.10
      metrics:
        - handoff_success:
            formula: "successful_handoffs / total_handoffs"
        - communication_clarity:
            formula: "understood_messages / total_messages"
        - team_contribution:
            formula: "value_added_to_team_tasks"
      score: "average(metrics) × 100"
      
  interpretation:
    excellent: [90, 100]
    good: [75, 89]
    acceptable: [60, 74]
    needs_improvement: [40, 59]
    critical: [0, 39]
```

### 1.2 Task Complexity Score (TCS) ⚡

```yaml
task_complexity_score:
  id: "TCS"
  name: "Task Complexity Score"
  range: [1, 100]
  
  formula: |
    TCS = (S × 2) + (D × 3) + (R × 4) + (T × 1.5) + (I × 2) + (U × 1.5)
    
  factors:
    
    S_steps:
      weight: 2
      scoring:
        1: "1-2 steps"
        2: "3-5 steps"
        3: "6-10 steps"
        4: "11-20 steps"
        5: "> 20 steps"
        
    D_domains:
      weight: 3
      scoring:
        1: "Single domain"
        2: "2 domains"
        3: "3-4 domains"
        4: "5-6 domains"
        5: "> 6 domains"
        
    R_risk:
      weight: 4
      scoring:
        1: "No risk - easily reversible"
        2: "Low risk - minor impact"
        3: "Medium risk - correctable impact"
        4: "High risk - significant impact"
        5: "Critical - irreversible impact"
        
    T_time:
      weight: 1.5
      scoring:
        1: "< 1 minute"
        2: "1-10 minutes"
        3: "10-60 minutes"
        4: "1-8 hours"
        5: "> 8 hours"
        
    I_integrations:
      weight: 2
      scoring:
        1: "0-1 external systems"
        2: "2-3 external systems"
        3: "4-6 external systems"
        4: "7-10 external systems"
        5: "> 10 external systems"
        
    U_uncertainty:
      weight: 1.5
      scoring:
        1: "Clear requirements, known solution"
        2: "Clear requirements, some unknowns"
        3: "Some ambiguity, exploratory"
        4: "High ambiguity, research needed"
        5: "Novel problem, no precedent"
        
  routing:
    simple: [1, 15]      # L3 direct
    moderate: [16, 30]    # L2 supervised
    complex: [31, 50]     # L1 coordinated
    critical: [51, 75]    # L1 + L0
    strategic: [76, 100]  # Full team + Human
```

### 1.3 Trust Score (Agent) ⚡

```yaml
trust_score:
  id: "TS"
  name: "Agent Trust Score"
  range: [0, 100]
  
  formula: |
    TS = (H × 0.35) + (A × 0.25) + (P × 0.20) + (T × 0.20)
    
  components:
    
    H_history:
      weight: 0.35
      metrics:
        - historical_accuracy
        - past_performance_trend
        - time_as_active_agent
      decay: "exponential, half-life 90 days"
      
    A_accountability:
      weight: 0.25
      metrics:
        - escalation_appropriateness
        - error_acknowledgment
        - correction_speed
        
    P_predictability:
      weight: 0.20
      metrics:
        - consistency_of_outputs
        - adherence_to_protocols
        - behavior_variance
        
    T_transparency:
      weight: 0.20
      metrics:
        - reasoning_clarity
        - decision_documentation
        - communication_openness
        
  permissions_by_trust:
    high: [80, 100]
      - autonomous_decisions_allowed
      - reduced_oversight
      - priority_task_assignment
    medium: [50, 79]
      - standard_permissions
      - normal_oversight
    low: [20, 49]
      - increased_oversight
      - approval_required_more_often
    probation: [0, 19]
      - constant_oversight
      - all_actions_require_approval
```

---

## 2) KPIs PAR NIVEAU ⚡

### 2.1 KPIs L0 (Constitutional) ⚡

```yaml
l0_kpis:

  core_metrics:
    
    - id: "L0_VETO_RATE"
      name: "Taux de Veto"
      formula: "vetos_issued / total_decisions_reviewed"
      target: "< 1%"  # Bas = bons L1/L2/L3
      alert_threshold: "> 5%"
      
    - id: "L0_FALSE_POSITIVE"
      name: "Faux Positifs Éthiques"
      formula: "false_positives / total_flags"
      target: "< 2%"
      
    - id: "L0_COVERAGE"
      name: "Couverture Audit"
      formula: "audited_actions / total_actions"
      target: "100%"
      
    - id: "L0_RESPONSE_TIME"
      name: "Temps Réponse Critique"
      formula: "avg(critical_response_times)"
      target: "< 30s"
      
  secondary_metrics:
    - ethical_flags_per_day
    - audit_completeness
    - tree_law_violations_caught
```

### 2.2 KPIs L1 (Strategic) ⚡

```yaml
l1_kpis:

  core_metrics:
    
    - id: "L1_DEPT_PERFORMANCE"
      name: "Performance Département"
      formula: "avg(department_agents.APS)"
      target: ">= 80"
      
    - id: "L1_COORDINATION_EFFICIENCY"
      name: "Efficacité Coordination"
      formula: "successful_cross_team / total_cross_team"
      target: ">= 90%"
      
    - id: "L1_ESCALATION_RESOLUTION"
      name: "Résolution Escalades"
      formula: "resolved_in_sla / total_escalations"
      target: ">= 95%"
      
    - id: "L1_RESOURCE_UTILIZATION"
      name: "Utilisation Ressources"
      formula: "productive_time / available_time"
      target: "70-85%"
      
    - id: "L1_STRATEGIC_ALIGNMENT"
      name: "Alignement Stratégique"
      formula: "aligned_decisions / total_decisions"
      target: ">= 95%"
      
  department_specific:
    
    construction:
      - project_on_time_rate
      - budget_accuracy
      - safety_incident_rate
      - client_satisfaction
      
    finance:
      - invoice_accuracy
      - collection_rate
      - cash_flow_accuracy
      - compliance_rate
      
    legal:
      - contract_approval_time
      - dispute_resolution_rate
      - compliance_audit_score
```

### 2.3 KPIs L2 (Tactical) ⚡

```yaml
l2_kpis:

  core_metrics:
    
    - id: "L2_TASK_QUALITY"
      name: "Qualité Tâches Supervisées"
      formula: "avg(supervised_tasks.quality_score)"
      target: ">= 90"
      
    - id: "L2_ERROR_CATCH_RATE"
      name: "Taux Détection Erreurs"
      formula: "errors_caught / (errors_caught + errors_missed)"
      target: ">= 95%"
      
    - id: "L2_THROUGHPUT"
      name: "Débit"
      formula: "tasks_completed / time_period"
      target: "per_agent_type"
      
    - id: "L2_L3_DEVELOPMENT"
      name: "Développement L3"
      formula: "l3_improvement_rate"
      target: "> 0"
      
  specialist_metrics:
    
    estimator:
      - estimate_accuracy: "actual / estimated"
      - margin_achievement: "actual_margin / target_margin"
      
    scheduler:
      - schedule_accuracy: "actual_dates vs planned"
      - critical_path_adherence
      
    quality_inspector:
      - defect_detection_rate
      - false_positive_rate
```

### 2.4 KPIs L3 (Operational) ⚡

```yaml
l3_kpis:

  core_metrics:
    
    - id: "L3_TASK_COMPLETION"
      name: "Taux Complétion"
      formula: "completed_tasks / assigned_tasks"
      target: ">= 98%"
      
    - id: "L3_ACCURACY"
      name: "Précision"
      formula: "correct_outputs / total_outputs"
      target: ">= 95%"
      
    - id: "L3_SPEED"
      name: "Vitesse"
      formula: "target_time / actual_time"
      target: ">= 0.9"
      
    - id: "L3_ESCALATION_RATE"
      name: "Taux Escalade"
      formula: "escalated_tasks / total_tasks"
      target: "< 15%"  # Trop haut = mauvais routing
      
    - id: "L3_SELF_CORRECTION"
      name: "Auto-Correction"
      formula: "self_corrected_errors / total_errors"
      target: ">= 50%"
```

---

## 3) DASHBOARDS ⚡

### 3.1 Dashboard Exécutif ⚡

```yaml
executive_dashboard:
  refresh_rate: "5min"
  
  top_row:
    - widget: "system_health_indicator"
      type: "traffic_light"
      source: "system_health_aggregate"
      
    - widget: "active_agents"
      type: "number"
      source: "count(agents.status == 'active')"
      
    - widget: "tasks_in_progress"
      type: "number"
      source: "count(tasks.status == 'running')"
      
    - widget: "human_decisions_pending"
      type: "number"
      source: "count(escalations.target == 'HUMAN')"
      alert_if: "> 5"
      
  middle_row:
    - widget: "agent_performance_distribution"
      type: "histogram"
      source: "all_agents.APS"
      
    - widget: "task_complexity_trend"
      type: "line_chart"
      source: "avg(tasks.TCS) by hour"
      period: "24h"
      
    - widget: "escalation_funnel"
      type: "funnel"
      source: "escalations by level"
      
  bottom_row:
    - widget: "department_performance"
      type: "bar_chart"
      source: "avg(APS) by department"
      
    - widget: "checkpoint_pass_rate"
      type: "gauge"
      source: "passed_checkpoints / total_checkpoints"
      
    - widget: "error_rate_trend"
      type: "sparkline"
      source: "error_rate by hour"
      period: "24h"
```

### 3.2 Dashboard Opérationnel ⚡

```yaml
operational_dashboard:
  refresh_rate: "30s"
  
  real_time_section:
    - widget: "live_task_feed"
      type: "feed"
      source: "recent_tasks"
      limit: 20
      
    - widget: "agent_status_grid"
      type: "grid"
      source: "all_agents"
      columns: ["id", "status", "current_task", "queue_depth"]
      
    - widget: "alert_stream"
      type: "feed"
      source: "active_alerts"
      priority_order: true
      
  performance_section:
    - widget: "response_time_heatmap"
      type: "heatmap"
      source: "response_times by agent by hour"
      
    - widget: "throughput_gauge"
      type: "gauge"
      source: "current_throughput vs target"
      
    - widget: "queue_depths"
      type: "stacked_bar"
      source: "queue_depth by priority"
```

### 3.3 Dashboard Agent Individuel ⚡

```yaml
agent_dashboard:
  
  header:
    - agent_id
    - agent_type
    - level
    - department
    - current_status
    
  metrics_row:
    - widget: "aps_gauge"
      type: "gauge"
      source: "agent.APS"
      history: "30d trend"
      
    - widget: "trust_score"
      type: "gauge"
      source: "agent.trust_score"
      
    - widget: "tasks_today"
      type: "number"
      source: "count(agent.tasks.today)"
      
  detail_section:
    - widget: "performance_breakdown"
      type: "radar"
      source: "agent.APS_components"
      
    - widget: "task_history"
      type: "table"
      source: "agent.recent_tasks"
      limit: 50
      
    - widget: "error_log"
      type: "table"
      source: "agent.errors"
      limit: 20
```

---

## 4) ALERTES & NOTIFICATIONS ⚡

### 4.1 Règles d'Alerte ⚡

```yaml
alert_rules:

  system_critical:
    - name: "System Down"
      condition: "system_health == 'RED'"
      severity: "critical"
      notify: ["HUMAN", "L0", "ALL_L1"]
      action: "page_on_call"
      
    - name: "L0 Veto Storm"
      condition: "l0_vetos_last_hour > 5"
      severity: "critical"
      notify: ["HUMAN", "L0"]
      
    - name: "Security Alert"
      condition: "security_flag_raised"
      severity: "critical"
      notify: ["HUMAN", "L0", "SECURITY"]
      
  performance:
    - name: "High Error Rate"
      condition: "error_rate > 5%"
      duration: "5m"
      severity: "high"
      notify: ["L1_affected"]
      
    - name: "Slow Response"
      condition: "avg_response_time > 3x baseline"
      duration: "10m"
      severity: "medium"
      notify: ["L2_supervisor"]
      
    - name: "Queue Buildup"
      condition: "queue_depth > 500"
      duration: "5m"
      severity: "medium"
      notify: ["L1_CHIEF"]
      
  business:
    - name: "Budget Overrun"
      condition: "project_cost > budget * 1.1"
      severity: "high"
      notify: ["L1_CHIEF_FINANCE", "HUMAN"]
      
    - name: "Deadline Risk"
      condition: "projected_completion > deadline"
      severity: "high"
      notify: ["L1_CHIEF_CONSTRUCTION"]
      
    - name: "Compliance Issue"
      condition: "compliance_check_failed"
      severity: "high"
      notify: ["L1_CHIEF_LEGAL", "L0"]
```

### 4.2 Notification Channels ⚡

```yaml
notification_channels:

  email:
    for: ["daily_reports", "non_urgent_alerts"]
    template: "email_template"
    
  slack:
    for: ["medium_alerts", "status_updates"]
    channels:
      general: "#chenu-alerts"
      construction: "#construction"
      finance: "#finance"
      
  sms:
    for: ["critical_alerts", "human_required"]
    on_call_rotation: true
    
  in_app:
    for: ["all_alerts"]
    persistence: "until_acknowledged"
    
  webhook:
    for: ["integration_events"]
    endpoints: ["configured_webhooks"]
```

---

## 5) REPORTING ⚡

### 5.1 Rapports Automatiques ⚡

```yaml
automated_reports:

  daily_summary:
    schedule: "08:00 local"
    recipients: ["HUMAN", "ALL_L1"]
    content:
      - system_health_summary
      - tasks_completed_yesterday
      - errors_and_resolutions
      - escalations_summary
      - top_performers
      - areas_needing_attention
      
  weekly_performance:
    schedule: "Monday 09:00"
    recipients: ["HUMAN", "L0", "ALL_L1"]
    content:
      - kpi_dashboard
      - trend_analysis
      - agent_rankings
      - improvement_recommendations
      - upcoming_capacity_needs
      
  monthly_executive:
    schedule: "1st of month 09:00"
    recipients: ["HUMAN", "EXECUTIVES"]
    content:
      - executive_summary
      - roi_analysis
      - strategic_alignment
      - risk_assessment
      - future_projections
```

### 5.2 Rapports On-Demand ⚡

```yaml
on_demand_reports:

  agent_deep_dive:
    parameters: ["agent_id", "date_range"]
    content:
      - complete_performance_history
      - task_breakdown
      - error_analysis
      - improvement_trajectory
      
  project_analysis:
    parameters: ["project_id"]
    content:
      - all_agents_involved
      - timeline_analysis
      - cost_analysis
      - quality_metrics
      - lessons_learned
      
  comparative_analysis:
    parameters: ["agents[]", "date_range"]
    content:
      - side_by_side_metrics
      - performance_gaps
      - best_practices_identification
```

---

## 6) AMÉLIORATION CONTINUE ⚡

### 6.1 Learning Loop ⚡

```yaml
learning_loop:

  data_collection:
    - all_task_outcomes
    - all_errors_with_context
    - all_escalations_with_resolution
    - user_feedback
    - checkpoint_results
    
  analysis:
    frequency: "daily"
    methods:
      - pattern_recognition
      - root_cause_analysis
      - trend_detection
      - anomaly_detection
      
  recommendations:
    types:
      - checkpoint_threshold_adjustments
      - routing_rule_improvements
      - agent_retraining_needs
      - process_optimizations
      
  implementation:
    approval_required: true
    rollback_ready: true
    a_b_testing: "when_appropriate"
```

### 6.2 Feedback Integration ⚡

```yaml
feedback_integration:

  sources:
    - user_ratings
    - explicit_feedback
    - implicit_signals
    - escalation_outcomes
    - error_corrections
    
  processing:
    - sentiment_analysis
    - categorization
    - priority_scoring
    - actionability_assessment
    
  actions:
    immediate:
      - "critical_feedback → escalate_L0"
    short_term:
      - "pattern_detected → adjust_rules"
    long_term:
      - "trend_identified → strategic_review"
```

---

## 7) BENCHMARKING ⚡

### 7.1 Internal Benchmarks ⚡

```yaml
internal_benchmarks:

  by_agent_type:
    compare: "agents of same type"
    metrics: ["APS", "throughput", "accuracy"]
    identify: "top_quartile as target"
    
  by_department:
    compare: "departments"
    metrics: ["avg_APS", "escalation_rate", "user_satisfaction"]
    
  by_time:
    compare: "current vs historical"
    periods: ["week", "month", "quarter"]
    trend: "improvement_expected"
```

### 7.2 Performance Targets ⚡

```yaml
performance_targets:

  by_level:
    L3:
      min_APS: 75
      target_APS: 85
      stretch_APS: 95
      
    L2:
      min_APS: 80
      target_APS: 88
      stretch_APS: 95
      
    L1:
      min_APS: 85
      target_APS: 90
      stretch_APS: 97
      
    L0:
      min_accuracy: 99.5%
      target_accuracy: 99.9%
      response_time: "< 30s"
      
  system_wide:
    overall_health: ">= GREEN 99% of time"
    user_satisfaction: ">= 4.5/5"
    task_success_rate: ">= 95%"
```

---

**END — SCORING, METRICS & PERFORMANCE TRACKING v1.0**
