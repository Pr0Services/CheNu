/**
 * CHE·NU — XR REPLAY COMPARISON + AI ROUTING
 * Types & Interfaces
 * 
 * XR.v1.4
 * Comparison = OBSERVATION ONLY
 * Routing = WHERE to look, never WHAT to think
 */

// ============================================================
// COMPARISON TYPES
// ============================================================

export type ComparisonMode = 
  | 'replay_vs_replay'
  | 'decision_path'
  | 'agent'
  | 'context';

export type SyncAnchor = 'start' | 'decision' | 'timestamp';

export interface ComparisonLayers {
  spatial: boolean;
  timeline: boolean;
  events: boolean;
  artifacts: boolean;
}

// ============================================================
// COMPARISON SOURCE
// ============================================================

export interface ComparisonSource {
  id: string;
  replay_id: string;
  title: string;
  timestamp: number;
  duration_ms: number;
  participants: string[];
  sphere: string;
}

// ============================================================
// COMPARISON EVENTS
// ============================================================

export type ComparisonEventType = 
  | 'shared'
  | 'divergent'
  | 'silence'
  | 'decision'
  | 'artifact_change';

export interface ComparisonEvent {
  id: string;
  type: ComparisonEventType;
  source_index: number;  // which replay (0 or 1)
  timestamp_ms: number;
  description: string;
  linked_event_id?: string;  // matched event in other replay
}

// ============================================================
// COMPARISON ARTIFACTS
// ============================================================

export interface ArtifactDiff {
  id: string;
  artifact_type: 'document' | 'board' | 'note' | 'agent_action';
  source_index: number;
  content_hash: string;
  has_counterpart: boolean;
  diff_summary?: string;
}

// ============================================================
// XR COMPARISON CONFIG
// ============================================================

export interface XRComparison {
  id: string;
  mode: ComparisonMode;
  sources: [ComparisonSource, ComparisonSource];
  sync_anchor: SyncAnchor;
  layers: ComparisonLayers;
  
  events: ComparisonEvent[];
  artifact_diffs: ArtifactDiff[];
  
  read_only: true;  // Always read-only
  
  created_at: string;
  created_by: string;
}

// ============================================================
// COMPARISON CONTROLS
// ============================================================

export type ComparisonControl = 
  | 'lock_timeline'
  | 'fade_other_replay'
  | 'isolate_event'
  | 'toggle_ghosts'
  | 'visual_silence_overlay'
  | 'export_pdf_comparison'
  | 'export_xr_comparison_bundle';

export interface ComparisonControlState {
  timeline_locked: boolean;
  faded_source: number | null;  // 0, 1, or null
  isolated_event: string | null;
  ghosts_visible: boolean;
  silence_overlay: boolean;
  playback_position: number;  // 0.0-1.0
}

// ============================================================
// ETHICAL LOCKS
// ============================================================

export interface EthicalLock {
  id: string;
  name: string;
  description: string;
  enforced: boolean;
}

export const COMPARISON_ETHICAL_LOCKS: EthicalLock[] = [
  { id: 'no_scoring', name: 'No Scoring', description: 'Never generate scores or rankings', enforced: true },
  { id: 'no_labels', name: 'No Success/Failure Labels', description: 'Outcomes are factual only', enforced: true },
  { id: 'no_emotional', name: 'No Emotional Signals', description: 'No colors/sounds implying good/bad', enforced: true },
  { id: 'no_best_path', name: 'No Best Path', description: 'All paths shown equally', enforced: true },
];

// ============================================================
// AI ROUTING TYPES
// ============================================================

export type RoutingContext = 'user' | 'agent' | 'team';

export type RoutingSignal = 
  | 'topic'
  | 'time'
  | 'artifact'
  | 'sphere'
  | 'participant'
  | 'bookmark';

export type RoutingReason = 
  | 'shared_topic'
  | 'shared_artifact'
  | 'temporal_proximity'
  | 'sphere_adjacency'
  | 'user_activity'
  | 'explicit_bookmark';

// ============================================================
// ROUTING SUGGESTION
// ============================================================

export interface RoutingSuggestion {
  id: string;
  target_node: string;
  target_title: string;
  target_type: 'meeting' | 'replay' | 'sphere' | 'agent_hub' | 'thread';
  reason: RoutingReason;
  reason_explanation: string;
  confidence: number;  // 0.0-1.0
  signals_used: RoutingSignal[];
}

// ============================================================
// ROUTING OUTPUT MODES
// ============================================================

export type RoutingOutputMode = 
  | 'soft_highlight'
  | 'context_map'
  | 'suggested_orbit';

export interface RoutingOutputConfig {
  mode: RoutingOutputMode;
  name: string;
  description: string;
  visual: string;
}

// ============================================================
// UNIVERSE ROUTING CONFIG
// ============================================================

export interface UniverseRouting {
  enabled: boolean;
  context: RoutingContext;
  signals: RoutingSignal[];
  suggestions: RoutingSuggestion[];
  output_mode: RoutingOutputMode;
  confidence_threshold: number;  // 0.0-1.0
  activation: 'manual_only';  // Always manual
}

// ============================================================
// USER ROUTING CONTROLS
// ============================================================

export interface RoutingUserControls {
  routing_enabled: boolean;
  confidence_threshold: number;
  muted_this_session: boolean;
  audit_trail_visible: boolean;
  explanations_visible: boolean;
}

// ============================================================
// ROUTING AGENTS
// ============================================================

export type RoutingAgentType = 
  | 'routing_analyzer'
  | 'context_explainer'
  | 'routing_guard';

export interface RoutingAgent {
  type: RoutingAgentType;
  name: string;
  icon: string;
  responsibility: string;
  constraint: string;
  active: boolean;
}

// ============================================================
// ROUTING NEVER ALLOWED
// ============================================================

export const ROUTING_NEVER_ALLOWED: string[] = [
  'Prioritize emotionally',
  'Hide alternatives',
  'Enforce paths',
  'Auto-enter spaces',
  'Make decisions for users',
];

// ============================================================
// COMBINED STATE
// ============================================================

export interface XRComparisonRoutingState {
  // Comparison
  active_comparison: XRComparison | null;
  control_state: ComparisonControlState;
  
  // Routing
  routing: UniverseRouting;
  user_controls: RoutingUserControls;
  
  // Agents
  routing_agents: RoutingAgent[];
  
  // UI
  is_loading: boolean;
  error: string | null;
}
