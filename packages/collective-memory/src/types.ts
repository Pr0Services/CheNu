/**
 * CHE·NU — XR COLLECTIVE MEMORY + PERSONAL NAVIGATION PROFILES
 * Types & Interfaces - XR.v1.5
 * 
 * Collective Memory = Aggregated FACTS, not conclusions
 * Personal Navigation = Visualization only, never changes data
 */

// ============================================================
// MEMORY ENTRY TYPES
// ============================================================

export type MemoryEntryType = 'event' | 'artifact' | 'decision' | 'context';

export interface MemoryEvent {
  type: 'event';
  who: string[];
  when: string;
  where: string;
  action: string;
  is_non_action: boolean;
}

export interface MemoryArtifact {
  type: 'artifact';
  artifact_type: 'document' | 'visual' | 'data' | 'board' | 'note';
  reference_id: string;
  title: string;
}

export interface MemoryDecision {
  type: 'decision';
  outcome: string;
  declared_at: string;
  declared_by: string;
  // NO judgment metadata
}

export interface MemoryContext {
  type: 'context';
  meeting_type: string;
  sphere: string;
  participants: string[];
}

// ============================================================
// COLLECTIVE MEMORY ENTRY
// ============================================================

export interface CollectiveMemoryEntry {
  id: string;
  type: MemoryEntryType;
  source_replay: string;
  timestamp: number;
  sphere: string;
  participants: string[];
  hash: string;  // SHA-256
  
  content: MemoryEvent | MemoryArtifact | MemoryDecision | MemoryContext;
  
  visibility: 'private' | 'shared' | 'public';
  created_at: string;
  validated: boolean;
}

// ============================================================
// COLLECTIVE MEMORY
// ============================================================

export interface CollectiveMemory {
  entries: CollectiveMemoryEntry[];
  integrity: 'verified' | 'pending' | 'failed';
  last_validated: string;
  total_entries: number;
}

// ============================================================
// MEMORY GRAPH
// ============================================================

export type MemoryNodeType = 'meeting' | 'decision' | 'artifact' | 'agent' | 'user';
export type MemoryEdgeType = 'happened_in' | 'referenced_by' | 'followed_by' | 'shared_with';

export interface MemoryGraphNode {
  id: string;
  type: MemoryNodeType;
  label: string;
  sphere?: string;
  timestamp?: number;
  anonymized?: boolean;
}

export interface MemoryGraphEdge {
  id: string;
  from: string;
  to: string;
  type: MemoryEdgeType;
}

export interface MemoryGraph {
  nodes: MemoryGraphNode[];
  edges: MemoryGraphEdge[];
}

// ============================================================
// MEMORY RULES (ENFORCED)
// ============================================================

export interface MemoryRule {
  id: string;
  name: string;
  description: string;
  enforcement: string;
  enabled: boolean;
}

export const MEMORY_RULES: MemoryRule[] = [
  { id: 'append_only', name: 'Append-only', description: 'New entries only, no modifications', enforcement: 'Write-once storage', enabled: true },
  { id: 'immutable', name: 'Immutable', description: 'Cannot change after validation', enforcement: 'Hash verification', enabled: true },
  { id: 'versioned', name: 'Versioned', description: 'Track all states over time', enforcement: 'Version control', enabled: true },
  { id: 'hashed', name: 'Hashed', description: 'Cryptographically secured', enforcement: 'SHA-256 integrity', enabled: true },
  { id: 'traceable', name: 'Traceable', description: 'Link to source replay', enforcement: 'Source reference required', enabled: true },
];

// ============================================================
// NEVER ALLOWED IN MEMORY
// ============================================================

export const MEMORY_NEVER_ALLOWED: string[] = [
  'Sentiment tags',
  'Success/failure labels',
  'Inferred intent',
  'Subjective judgments',
  'Emotional markers',
];

// ============================================================
// NAVIGATION PROFILE
// ============================================================

export type NavigationMode = 'explorer' | 'focus' | 'review' | 'archive';
export type VisualMode = '2d' | '3d';
export type AgentVisibility = 'low' | 'medium' | 'high';
export type DensityLevel = number;  // 0.0-1.0

export interface NavigationPreferences {
  density: DensityLevel;
  orbit: string;  // default sphere
  routing_threshold: number;
  visual_mode: VisualMode;
  agent_visibility: AgentVisibility;
  replay_visibility: boolean;
}

export interface NavigationOverrides {
  session_only: boolean;
  temporary_mode?: NavigationMode;
  temporary_sphere?: string;
}

export interface NavigationProfile {
  id: string;
  user_id: string;
  mode: NavigationMode;
  preferences: NavigationPreferences;
  overrides: NavigationOverrides;
  created_at: string;
  updated_at: string;
}

// ============================================================
// NAVIGATION MODE CONFIGS
// ============================================================

export interface NavigationModeConfig {
  mode: NavigationMode;
  name: string;
  icon: string;
  color: string;
  description: string;
  view_style: string;
  emphasis: string;
}

// ============================================================
// ACCESS CONTROL
// ============================================================

export interface MemoryAccessControl {
  user_visibility: boolean;
  sphere_visibility: boolean;
  explicit_sharing_required: boolean;
  private_never_global: boolean;
}

// ============================================================
// SAFETY & TRANSPARENCY
// ============================================================

export interface NavigationSafety {
  profile_preview_enabled: boolean;
  filtered_view_indicator: boolean;
  one_click_reset: boolean;
}

// ============================================================
// COMBINED STATE
// ============================================================

export interface CollectiveMemoryNavigationState {
  // Memory
  memory: CollectiveMemory;
  graph: MemoryGraph;
  access_control: MemoryAccessControl;
  
  // Navigation
  current_profile: NavigationProfile | null;
  available_modes: NavigationModeConfig[];
  safety: NavigationSafety;
  
  // Filters
  sphere_filter: string | null;
  time_filter: { start?: number; end?: number } | null;
  participant_filter: string[] | null;
  
  // UI
  is_loading: boolean;
  error: string | null;
}
