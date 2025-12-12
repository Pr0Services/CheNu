/**
 * CHE·NU — COLLECTIVE MEMORY + NAVIGATION
 * Presets & Configurations
 */

import {
  NavigationMode,
  NavigationModeConfig,
  NavigationProfile,
  NavigationPreferences,
  CollectiveMemory,
  CollectiveMemoryEntry,
  MemoryEntryType,
  MemoryGraph,
  MemoryAccessControl,
  NavigationSafety,
} from './types';

// Navigation Modes
export const NAVIGATION_MODES: NavigationModeConfig[] = [
  { mode: 'explorer', name: 'Explorer', icon: '🔭', color: '#10B981', description: 'Wide view, many links visible', view_style: 'Expansive', emphasis: 'Discovery' },
  { mode: 'focus', name: 'Focus', icon: '🎯', color: '#3B82F6', description: 'Hide unrelated clusters', view_style: 'Filtered', emphasis: 'Active threads' },
  { mode: 'review', name: 'Review', icon: '🔄', color: '#F59E0B', description: 'Replay-first display', view_style: 'Timeline', emphasis: 'Analysis' },
  { mode: 'archive', name: 'Archive', icon: '📚', color: '#8B5CF6', description: 'History & memory dominant', view_style: 'Historical', emphasis: 'Context' },
];

// Default preferences
export const DEFAULT_PREFERENCES: NavigationPreferences = {
  density: 0.5,
  orbit: 'business',
  routing_threshold: 0.5,
  visual_mode: '3d',
  agent_visibility: 'medium',
  replay_visibility: true,
};

// Default access control
export const DEFAULT_ACCESS_CONTROL: MemoryAccessControl = {
  user_visibility: true,
  sphere_visibility: true,
  explicit_sharing_required: true,
  private_never_global: true,
};

// Default safety
export const DEFAULT_SAFETY: NavigationSafety = {
  profile_preview_enabled: true,
  filtered_view_indicator: true,
  one_click_reset: true,
};

// Factory functions
export function createProfile(userId: string, mode: NavigationMode = 'explorer'): NavigationProfile {
  return {
    id: `profile_${Date.now()}`,
    user_id: userId,
    mode,
    preferences: { ...DEFAULT_PREFERENCES },
    overrides: { session_only: false },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function createMemoryEntry(
  type: MemoryEntryType,
  sourceReplay: string,
  sphere: string,
  participants: string[],
  content: any
): CollectiveMemoryEntry {
  const timestamp = Date.now();
  const hash = `sha256_${timestamp}_${Math.random().toString(36).slice(2)}`;
  
  return {
    id: `mem_${timestamp}`,
    type,
    source_replay: sourceReplay,
    timestamp,
    sphere,
    participants,
    hash,
    content,
    visibility: 'private',
    created_at: new Date().toISOString(),
    validated: false,
  };
}

export function getNavigationMode(mode: NavigationMode): NavigationModeConfig {
  return NAVIGATION_MODES.find(m => m.mode === mode) || NAVIGATION_MODES[0];
}
