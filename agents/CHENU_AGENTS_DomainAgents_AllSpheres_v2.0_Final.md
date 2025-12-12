# CHE·NU — DOMAIN AGENTS BY SPHERE (v2.0 Final)
**VERSION:** DOMAIN.v2.0-canonical-final  
**MODE:** FOUNDATION / ALL-SPHERES / PRODUCTION

---

## 1) UNIVERSAL RULES ⚡

```yaml
universal_rules:
  respect_foundation_laws: true
  explicit_responsibility: true
  reversible_actions: true
  logged_operations: true
  nova_orchestrates: true
  architect_structures: true
  memory_manager_persists: true
  thread_weaver_links: true
```

---

## 2) SPHERE: PERSONAL ⚡

```yaml
PERSONAL:
  code: "PERSONAL"
  agents:
    
    personal.organizer:
      role: "Structural maintenance of Personal Sphere"
      outputs:
        - category_structure
        - cleanliness_report
      responsibilities:
        - classify_items_health_finance_goals_journal
        - suggest_reorganization
        - detect_missing_information
        
    personal.wellness:
      role: "Health & habit observation"
      outputs:
        - trend_analysis
        - alerts
      responsibilities:
        - track_health_metrics
        - surface_patterns_sleep_mood_habits
        - propose_gentle_reminders
      constraints:
        - never_judge_or_pressure
        - respect_privacy
        
    personal.goals:
      role: "Goal structuring & milestone engineering"
      outputs:
        - okr_structures
        - progress_maps
      responsibilities:
        - structure_goals_into_milestones
        - align_goals_with_daily_actions
        - prepare_review_suggestions
```

---

## 3) SPHERE: BUSINESS ⚡

```yaml
BUSINESS:
  code: "BUSINESS"
  agents:
    
    business.organizer:
      role: "Maintains Business Sphere coherence"
      outputs:
        - project_index
        - client_index
      responsibilities:
        - keep_clients_projects_finance_legal_structured
        - ensure_documents_and_tasks_linked_to_entities
        - detect_unassigned_orphan_items
        
    business.strategy:
      role: "Strategic planning & scenario modeling"
      outputs:
        - decision_branches
        - impact_previews
      responsibilities:
        - synthesize_okrs_roadmaps_competitive_insights
        - generate_scenario_comparisons
        - collaborate_with_Architect_Σ_for_decision_trees
        
    business.crm:
      role: "Client relationship intelligence"
      outputs:
        - contact_health
        - followup_suggestions
      responsibilities:
        - maintain_client_profiles_and_history
        - suggest_followups_based_on_inactivity_and_events
        - surface_risks_and_opportunities_per_client
        
    business.operations:
      role: "Process efficiency & bottleneck detection"
      outputs:
        - workflow_health
        - bottleneck_reports
      responsibilities:
        - track_workflow_throughput
        - detect_bottlenecks_and_dropped_tasks
        - suggest_process_improvements
        
    business.finance:
      role: "Financial analysis & anomaly detection"
      outputs:
        - forecast_curves
        - variance_alerts
      responsibilities:
        - analyze_revenue_costs_cashflow
        - generate_simple_forecasts_and_anomaly_alerts
        - prepare_decision_inputs_for_strategic_choices
```

---

## 4) SPHERE: SCHOLAR ⚡

```yaml
SCHOLAR:
  code: "SCHOLAR"
  agents:
    
    scholar.organizer:
      role: "Academic structuring & knowledge taxonomy"
      outputs:
        - knowledge_map
        - gap_analysis
      responsibilities:
        - organize_notes_readings_projects
        - detect_gaps_in_knowledge_maps
        - coordinate_with_Thread_Weaver_for_learning_paths
        
    scholar.research:
      role: "Source comparison & research synthesis"
      outputs:
        - literature_overview
        - conflict_consensus_map
      responsibilities:
        - prepare_literature_overviews
        - highlight_conflicts_and_consensus_between_sources
        - propose_research_questions
        
    scholar.study:
      role: "Retention optimization & study scheduling"
      outputs:
        - study_schedule
        - retention_metrics
      responsibilities:
        - build_study_schedules
        - integrate_spaced_repetition
        - track_learning_progress
        
    scholar.synthesizer:
      role: "Concept map generation & insight linking"
      outputs:
        - concept_maps
        - insight_summaries
      responsibilities:
        - merge_fragments_into_summaries
        - create_concept_maps
        - link_to_previous_sessions_via_Thread_Weaver
```

---

## 5) SPHERE: CREATIVE ⚡

```yaml
CREATIVE:
  code: "CREATIVE"
  agents:
    
    creative.organizer:
      role: "Creative asset categorization & version control"
      outputs:
        - asset_index
        - version_history
      responsibilities:
        - categorize_assets_by_medium_and_project
        - maintain_version_history_links
        - archive_finished_work_into_portfolio
        
    creative.muse:
      role: "Idea generation & cross-style blending"
      outputs:
        - concept_variants
        - inspiration_mixes
      responsibilities:
        - propose_variants_and_concepts
        - mix_inspiration_from_previous_projects
        - respect_creator_constraints_and_style
      constraints:
        - never_impose_style
        - respect_creative_intent
        
    creative.critic:
      role: "Feedback and quality evaluation"
      outputs:
        - quality_assessment
        - improvement_suggestions
      responsibilities:
        - evaluate_coherence_with_brief
        - highlight_strengths_and_risks
        - propose_improvement_paths
      constraints:
        - constructive_only
        - respect_creator_vision
        
    creative.curator:
      role: "Portfolio building & showcase engineering"
      outputs:
        - portfolio_selection
        - showcase_layouts
      responsibilities:
        - score_outputs_by_quality_signals
        - propose_portfolio_selections
        - prepare_showcase_layouts_for_web_or_pdf
```

---

## 6) SPHERE: SOCIAL ⚡

```yaml
SOCIAL:
  code: "SOCIAL"
  agents:
    
    social.organizer:
      role: "Contacts & communication structuring"
      outputs:
        - contact_index
        - interaction_log
      responsibilities:
        - deduplicate_contacts
        - connect_interactions_to_people_and_groups
        - maintain_relationship_tags
        
    social.relationships:
      role: "Relationship health & reconnection logic"
      outputs:
        - relationship_health_scores
        - reconnection_suggestions
      responsibilities:
        - detect_long_inactivity_with_important_contacts
        - suggest_reconnect_moments
        - surface_important_dates_and_promises
        
    social.content:
      role: "Social content planning (non-addictive)"
      outputs:
        - content_calendar
        - posting_suggestions
      responsibilities:
        - maintain_content_calendar
        - suggest_posting_times_and_tones
        - prevent_over_engagement_and_addictive_patterns
      constraints:
        - anti_addiction_by_design
        - wellbeing_first
```

---

## 7) SPHERE: INSTITUTIONS ⚡

```yaml
INSTITUTIONS:
  code: "INSTITUTIONS"
  agents:
    
    institutions.organizer:
      role: "Legal, government & compliance structuring"
      outputs:
        - compliance_index
        - document_registry
      responsibilities:
        - structure_legal_government_compliance_documents
        - track_obligations_and_relationships
        - maintain_regulatory_timeline
        
    institutions.compliance:
      role: "Deadline & requirement monitoring"
      outputs:
        - deadline_alerts
        - requirement_checklist
      responsibilities:
        - monitor_filing_deadlines
        - track_compliance_requirements
        - alert_before_due_dates
        
    institutions.filing:
      role: "Form preparation (no silent submission)"
      outputs:
        - prepared_forms
        - submission_checklist
      responsibilities:
        - prepare_government_forms
        - validate_completeness
        - NEVER_submit_without_explicit_approval
      constraints:
        - no_silent_submission
        - user_approval_required
```

---

## 8) SPHERE: METHODOLOGY ⚡

```yaml
METHODOLOGY:
  code: "METHODOLOGY"
  agents:
    
    methodology.core:
      role: "Applies working systems (GTD, Agile, Zettelkasten)"
      outputs:
        - system_application
        - workflow_structure
      responsibilities:
        - implement_productivity_systems
        - adapt_systems_to_user_context
        - integrate_with_other_spheres
        
    methodology.optimizer:
      role: "Workflow friction analysis & improvement"
      outputs:
        - friction_report
        - improvement_suggestions
      responsibilities:
        - analyze_workflow_friction_points
        - identify_optimization_opportunities
        - propose_improvements
        
    methodology.templates:
      role: "Template suggestion & standardization"
      outputs:
        - template_library
        - standard_patterns
      responsibilities:
        - suggest_relevant_templates
        - standardize_recurring_patterns
        - maintain_template_library
```

---

## 9) SPHERE: XR ⚡

```yaml
XR:
  code: "XR"
  agents:
    
    xr.guide:
      role: "Spatial navigation guidance"
      outputs:
        - navigation_paths
        - waypoints
      responsibilities:
        - guide_user_through_xr_spaces
        - suggest_navigation_paths
        - explain_spatial_relationships
        
    xr.architect:
      role: "Room layout & environment engineering"
      outputs:
        - room_layouts
        - environment_configs
      responsibilities:
        - design_xr_room_layouts
        - engineer_environments
        - adapt_to_theme_and_context
        
    xr.recorder:
      role: "Replayable session capture"
      outputs:
        - session_recordings
        - replay_timelines
      responsibilities:
        - capture_xr_sessions
        - create_replayable_recordings
        - link_to_Thread_Weaver
        
    xr.presence:
      role: "Avatar logic & state representation"
      outputs:
        - avatar_states
        - presence_indicators
      responsibilities:
        - manage_avatar_representation
        - track_presence_state
        - coordinate_multi_user_presence
```

---

## 10) SPHERE: ENTERTAINMENT ⚡

```yaml
ENTERTAINMENT:
  code: "ENTERTAINMENT"
  agents:
    
    entertainment.curator:
      role: "Non-addictive leisure recommendations"
      outputs:
        - recommendations
        - discovery_suggestions
      responsibilities:
        - suggest_entertainment_options
        - balance_variety_and_preference
        - prevent_addictive_patterns
      constraints:
        - anti_addiction_by_design
        - wellbeing_first
        
    entertainment.tracker:
      role: "Completion tracking"
      outputs:
        - completion_status
        - progress_logs
      responsibilities:
        - track_consumption_progress
        - maintain_watch_read_play_lists
        - suggest_continuations
        
    entertainment.documenter:
      role: "Experience memorization"
      outputs:
        - experience_logs
        - review_summaries
      responsibilities:
        - document_entertainment_experiences
        - capture_user_reviews_and_notes
        - link_to_Memory_Manager
```

---

## 11) SPHERE: AI_LAB ⚡

```yaml
AI_LAB:
  code: "AI_LAB"
  agents:
    
    ailab.organizer:
      role: "Prompt & experiment indexing"
      outputs:
        - prompt_library
        - experiment_index
      responsibilities:
        - organize_prompts_and_experiments
        - maintain_version_history
        - categorize_by_use_case
        
    ailab.optimizer:
      role: "Prompt improvement & cleanup"
      outputs:
        - optimized_prompts
        - improvement_suggestions
      responsibilities:
        - analyze_prompt_effectiveness
        - suggest_improvements
        - clean_redundant_prompts
        
    ailab.debugger:
      role: "Agent behavior troubleshooting"
      outputs:
        - debug_reports
        - behavior_analysis
      responsibilities:
        - troubleshoot_agent_behavior
        - identify_failure_patterns
        - suggest_fixes
```

---

## 12) SPHERE: MY_TEAM ⚡

```yaml
MY_TEAM:
  code: "MY_TEAM"
  agents:
    
    team.organizer:
      role: "Team resource structuring"
      outputs:
        - resource_index
        - team_structure
      responsibilities:
        - structure_team_resources
        - maintain_skill_matrix
        - track_availability
        
    team.delegation:
      role: "Task owner suggestion & handoff clarity"
      outputs:
        - delegation_suggestions
        - handoff_protocols
      responsibilities:
        - suggest_task_owners
        - clarify_handoff_requirements
        - track_delegation_chain
        
    team.collab:
      role: "Meeting prep, follow-ups, checkpoints"
      outputs:
        - meeting_agendas
        - action_items
        - checkpoint_reports
      responsibilities:
        - prepare_meeting_materials
        - track_follow_ups
        - coordinate_checkpoints
        
    team.permissions:
      role: "Access control recommendations"
      outputs:
        - permission_suggestions
        - access_audit
      responsibilities:
        - recommend_access_levels
        - audit_permissions
        - flag_security_concerns
```

---

## 13) SUMMARY: ALL DOMAIN AGENTS ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│           CHE·NU DOMAIN AGENTS BY SPHERE (37 TOTAL)             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PERSONAL (3)        │  BUSINESS (5)       │  SCHOLAR (4)       │
│  • organizer         │  • organizer        │  • organizer       │
│  • wellness          │  • strategy         │  • research        │
│  • goals             │  • crm              │  • study           │
│                      │  • operations       │  • synthesizer     │
│                      │  • finance          │                    │
├──────────────────────┼─────────────────────┼────────────────────┤
│  CREATIVE (4)        │  SOCIAL (3)         │  INSTITUTIONS (3)  │
│  • organizer         │  • organizer        │  • organizer       │
│  • muse              │  • relationships    │  • compliance      │
│  • critic            │  • content          │  • filing          │
│  • curator           │                     │                    │
├──────────────────────┼─────────────────────┼────────────────────┤
│  METHODOLOGY (3)     │  XR (4)             │  ENTERTAINMENT (3) │
│  • core              │  • guide            │  • curator         │
│  • optimizer         │  • architect        │  • tracker         │
│  • templates         │  • recorder         │  • documenter      │
│                      │  • presence         │                    │
├──────────────────────┼─────────────────────┼────────────────────┤
│  AI_LAB (3)          │  MY_TEAM (4)        │                    │
│  • organizer         │  • organizer        │  TOTAL: 37 AGENTS  │
│  • optimizer         │  • delegation       │                    │
│  • debugger          │  • collab           │                    │
│                      │  • permissions      │                    │
└──────────────────────┴─────────────────────┴────────────────────┘
```

---

## 14) AGENT ↔ CORE INTEGRATION ⚡

```yaml
domain_agent_core_integration:

  all_domain_agents_must:
    - receive_tasks_from: "Nova_2.0"
    - report_structures_to: "Architect_Σ"
    - persist_memories_via: "Memory_Manager"
    - link_threads_via: "Thread_Weaver"
    - respect_validation_by: "Ethics_Guard"
    - be_monitored_by: "Drift_Detector"
    
  output_routing:
    - domain_agent_output → Nova_2.0 → User
    
  escalation_path:
    - domain_agent → L2_Supervisor → L1_Chief → L0 → CORE → HUMAN
```

---

**END — DOMAIN AGENTS BY SPHERE v2.0 Final**
