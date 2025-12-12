/**
 * CHE·NU — XR REPLAY COMPARISON + AI ROUTING
 * Presets & Configurations
 */

import {
  ComparisonMode,
  ComparisonLayers,
  ComparisonControlState,
  RoutingOutputMode,
  RoutingOutputConfig,
  RoutingAgentType,
  RoutingAgent,
  RoutingSignal,
  RoutingSuggestion,
  UniverseRouting,
  RoutingUserControls,
  XRComparison,
  ComparisonSource,
} from './types';

// ============================================================
// COMPARISON MODE CONFIGS
// ============================================================

export const COMPARISON_MODES: Record<ComparisonMode, { name: string; icon: string; description: string }> = {
  replay_vs_replay: {
    name: 'Replay vs Replay',
    icon: '🔄',
    description: 'Same topic, different meetings/dates',
  },
  decision_path: {
    name: 'Decision Path',
    icon: '🔀',
    description: 'Same objective, different sequences',
  },
  agent: {
    name: 'Agent Comparison',
    icon: '🤖',
    description: 'Agent influence, silence, timing',
  },
  context: {
    name: 'User vs Team',
    icon: '👤',
    description: 'Personal vs collective context',
  },
};

// ============================================================
// DEFAULT LAYERS
// ============================================================

export const DEFAULT_LAYERS: ComparisonLayers = {
  spatial: true,
  timeline: true,
  events: true,
  artifacts: true,
};

// ============================================================
// DEFAULT CONTROL STATE
// ============================================================

export const DEFAULT_CONTROL_STATE: ComparisonControlState = {
  timeline_locked: true,
  faded_source: null,
  isolated_event: null,
  ghosts_visible: true,
  silence_overlay: false,
  playback_position: 0,
};

// ============================================================
// COMPARISON CONTROLS CONFIG
// ============================================================

export const COMPARISON_CONTROLS = [
  { id: 'lock_timeline', name: 'Lock Timeline', icon: '🔒', description: 'Synchronize playback' },
  { id: 'fade_other_replay', name: 'Fade Other', icon: '👻', description: 'Dim non-focused replay' },
  { id: 'isolate_event', name: 'Isolate Event', icon: '🎯', description: 'Focus single event' },
  { id: 'toggle_ghosts', name: 'Toggle Ghosts', icon: '👤', description: 'Show/hide ghost avatars' },
  { id: 'visual_silence_overlay', name: 'Silence Overlay', icon: '🔇', description: 'Highlight silence' },
  { id: 'export_pdf_comparison', name: 'Export PDF', icon: '📄', description: 'Export as PDF' },
  { id: 'export_xr_comparison_bundle', name: 'Export XR', icon: '📦', description: 'Export XR bundle' },
];

// ============================================================
// ROUTING OUTPUT MODES
// ============================================================

export const ROUTING_OUTPUT_MODES: RoutingOutputConfig[] = [
  {
    mode: 'soft_highlight',
    name: 'Soft Highlight',
    description: 'Subtle halo, no motion, no sound',
    visual: 'Gentle glow around suggested nodes',
  },
  {
    mode: 'context_map',
    name: 'Context Map',
    description: 'Visual links drawn, expandable on demand',
    visual: 'Lines connecting related nodes',
  },
  {
    mode: 'suggested_orbit',
    name: 'Suggested Orbit',
    description: 'Re-cluster universe nodes, user must confirm',
    visual: 'Nodes reorganize around suggestion',
  },
];

// ============================================================
// ROUTING AGENTS
// ============================================================

export const ROUTING_ANALYZER: RoutingAgent = {
  type: 'routing_analyzer',
  name: 'Routing Analyzer',
  icon: '📊',
  responsibility: 'Computes graph proximity',
  constraint: 'No UI control',
  active: true,
};

export const CONTEXT_EXPLAINER: RoutingAgent = {
  type: 'context_explainer',
  name: 'Context Explainer',
  icon: '💬',
  responsibility: 'Translates routing reason',
  constraint: 'Human-readable only',
  active: true,
};

export const ROUTING_GUARD: RoutingAgent = {
  type: 'routing_guard',
  name: 'Routing Guard',
  icon: '🛡️',
  responsibility: 'Ensures ethical compliance',
  constraint: 'No dark patterns, full transparency',
  active: true,
};

export const ROUTING_AGENTS: RoutingAgent[] = [
  ROUTING_ANALYZER,
  CONTEXT_EXPLAINER,
  ROUTING_GUARD,
];

// ============================================================
// DEFAULT ROUTING CONFIG
// ============================================================

export const DEFAULT_ROUTING: UniverseRouting = {
  enabled: true,
  context: 'user',
  signals: ['topic', 'artifact', 'sphere'],
  suggestions: [],
  output_mode: 'soft_highlight',
  confidence_threshold: 0.5,
  activation: 'manual_only',
};

// ============================================================
// DEFAULT USER CONTROLS
// ============================================================

export const DEFAULT_USER_CONTROLS: RoutingUserControls = {
  routing_enabled: true,
  confidence_threshold: 0.5,
  muted_this_session: false,
  audit_trail_visible: true,
  explanations_visible: true,
};

// ============================================================
// FACTORY FUNCTIONS
// ============================================================

export function createComparison(
  mode: ComparisonMode,
  source1: ComparisonSource,
  source2: ComparisonSource,
  createdBy: string
): XRComparison {
  return {
    id: `comp_${Date.now()}`,
    mode,
    sources: [source1, source2],
    sync_anchor: 'start',
    layers: { ...DEFAULT_LAYERS },
    events: [],
    artifact_diffs: [],
    read_only: true,
    created_at: new Date().toISOString(),
    created_by: createdBy,
  };
}

export function createComparisonSource(
  replayId: string,
  title: string,
  participants: string[],
  sphere: string
): ComparisonSource {
  return {
    id: `src_${Date.now()}`,
    replay_id: replayId,
    title,
    timestamp: Date.now(),
    duration_ms: 0,
    participants,
    sphere,
  };
}

export function createRoutingSuggestion(
  targetNode: string,
  targetTitle: string,
  targetType: RoutingSuggestion['target_type'],
  reason: RoutingSuggestion['reason'],
  confidence: number,
  signals: RoutingSignal[]
): RoutingSuggestion {
  const explanations: Record<string, string> = {
    shared_topic: 'These items share the same topic',
    shared_artifact: 'Common artifacts referenced',
    temporal_proximity: 'Close in time',
    sphere_adjacency: 'Related domains',
    user_activity: 'Based on your recent activity',
    explicit_bookmark: 'You bookmarked this',
  };
  
  return {
    id: `sug_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    target_node: targetNode,
    target_title: targetTitle,
    target_type: targetType,
    reason,
    reason_explanation: explanations[reason] || reason,
    confidence,
    signals_used: signals,
  };
}

export function getRoutingOutputMode(mode: RoutingOutputMode): RoutingOutputConfig {
  return ROUTING_OUTPUT_MODES.find(m => m.mode === mode) || ROUTING_OUTPUT_MODES[0];
}

export function filterSuggestionsByConfidence(
  suggestions: RoutingSuggestion[],
  threshold: number
): RoutingSuggestion[] {
  return suggestions.filter(s => s.confidence >= threshold);
}
