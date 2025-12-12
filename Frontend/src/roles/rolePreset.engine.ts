/* =====================================================
   CHE·NU — Role Preset Engine
   
   Pure functions for role management, preset suggestions
   based on roles, and the PresetAdvisor logic.
   ===================================================== */

import {
  UserRole,
  PresetAdvisorContext,
  PresetRecommendation,
  AdvisorLogEntry,
  RoleState,
  RoleEvent,
  RoleSwitchEntry,
} from './rolePreset.types';

import { CheNuPreset } from '../presets/preset.types';
import { DEFAULT_ROLE_STATE, getRoleById } from './rolePreset.defaults';

// ─────────────────────────────────────────────────────
// ROLE → PRESET MAPPING
// ─────────────────────────────────────────────────────

/**
 * Get the suggested preset for a role.
 */
export function getSuggestedPresetForRole(
  role: UserRole,
  presets: CheNuPreset[]
): CheNuPreset | undefined {
  if (!role.defaultPresetId) return undefined;
  return presets.find(p => p.id === role.defaultPresetId);
}

/**
 * Get all allowed presets for a role.
 */
export function getAllowedPresetsForRole(
  role: UserRole,
  allPresets: CheNuPreset[]
): CheNuPreset[] {
  // If allowedPresets is specified, filter to only those
  if (role.allowedPresets && role.allowedPresets.length > 0) {
    return allPresets.filter(p => role.allowedPresets!.includes(p.id));
  }
  
  // If restrictedPresets is specified, exclude those
  if (role.restrictedPresets && role.restrictedPresets.length > 0) {
    return allPresets.filter(p => !role.restrictedPresets!.includes(p.id));
  }
  
  // Otherwise, all presets are allowed
  return allPresets;
}

/**
 * Check if a preset is allowed for a role.
 */
export function isPresetAllowedForRole(
  role: UserRole,
  presetId: string
): boolean {
  // If allowedPresets is specified, check if preset is in the list
  if (role.allowedPresets && role.allowedPresets.length > 0) {
    return role.allowedPresets.includes(presetId);
  }
  
  // If restrictedPresets is specified, check if preset is NOT in the list
  if (role.restrictedPresets && role.restrictedPresets.length > 0) {
    return !role.restrictedPresets.includes(presetId);
  }
  
  // Otherwise, all presets are allowed
  return true;
}

// ─────────────────────────────────────────────────────
// PRESET ADVISOR
// ─────────────────────────────────────────────────────

/**
 * Get time of day from current hour.
 */
export function getTimeOfDay(hour: number): PresetAdvisorContext['timeOfDay'] {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

/**
 * Recommend presets based on context.
 * Returns up to maxRecommendations preset IDs.
 */
export function recommendPresets(
  context: PresetAdvisorContext,
  options: { maxRecommendations?: number } = {}
): PresetRecommendation[] {
  const { maxRecommendations = 2 } = options;
  const recommendations: PresetRecommendation[] = [];

  // ─── Cognitive overload detection ───
  if (context.sessionDurationMin > 60) {
    recommendations.push({
      presetId: 'focus',
      score: 80,
      reason: 'Long session detected - reduce cognitive load',
      reasonI18n: {
        'fr-CA': 'Longue session détectée - réduire la charge cognitive',
      },
      source: 'advisor',
    });
  }

  // ─── Role-based recommendation ───
  if (context.activeRole === 'analyst') {
    recommendations.push({
      presetId: 'audit',
      score: 85,
      reason: 'Analyst role - audit mode recommended',
      reasonI18n: {
        'fr-CA': 'Rôle analyste - mode audit recommandé',
      },
      source: 'role',
    });
  }

  if (context.activeRole === 'creative') {
    recommendations.push({
      presetId: 'exploration',
      score: 85,
      reason: 'Creative role - exploration mode recommended',
      reasonI18n: {
        'fr-CA': 'Rôle créatif - mode exploration recommandé',
      },
      source: 'role',
    });
  }

  // ─── Meeting sphere detection ───
  if (context.activeSphere === 'Meeting' || context.pendingMeetings && context.pendingMeetings > 0) {
    recommendations.push({
      presetId: 'meeting',
      score: 90,
      reason: 'Meeting context detected',
      reasonI18n: {
        'fr-CA': 'Contexte de réunion détecté',
      },
      source: 'context',
    });
  }

  // ─── XR availability ───
  if (context.xrAvailable && !context.isMobile) {
    recommendations.push({
      presetId: 'exploration',
      score: 70,
      reason: 'XR available - immersive experience possible',
      reasonI18n: {
        'fr-CA': 'XR disponible - expérience immersive possible',
      },
      source: 'context',
    });
  }

  // ─── Mobile detection ───
  if (context.isMobile) {
    recommendations.push({
      presetId: 'mobile',
      score: 85,
      reason: 'Mobile device detected',
      reasonI18n: {
        'fr-CA': 'Appareil mobile détecté',
      },
      source: 'context',
    });
  }

  // ─── Time of day ───
  if (context.timeOfDay === 'night') {
    recommendations.push({
      presetId: 'night',
      score: 75,
      reason: 'Night mode for evening work',
      reasonI18n: {
        'fr-CA': 'Mode nuit pour travail en soirée',
      },
      source: 'context',
    });
  }

  // ─── High cognitive load ───
  if (context.cognitiveLoad !== undefined && context.cognitiveLoad > 70) {
    recommendations.push({
      presetId: 'focus',
      score: 85,
      reason: 'High cognitive load - simplify interface',
      reasonI18n: {
        'fr-CA': 'Charge cognitive élevée - simplifier l\'interface',
      },
      source: 'advisor',
    });
  }

  // ─── Many active decisions ───
  if (context.activeDecisions !== undefined && context.activeDecisions > 5) {
    recommendations.push({
      presetId: 'audit',
      score: 75,
      reason: 'Multiple active decisions - audit mode helps track',
      reasonI18n: {
        'fr-CA': 'Plusieurs décisions actives - mode audit aide au suivi',
      },
      source: 'advisor',
    });
  }

  // Deduplicate by presetId, keeping highest score
  const uniqueMap = new Map<string, PresetRecommendation>();
  for (const rec of recommendations) {
    const existing = uniqueMap.get(rec.presetId);
    if (!existing || rec.score > existing.score) {
      uniqueMap.set(rec.presetId, rec);
    }
  }

  // Sort by score descending and limit
  return Array.from(uniqueMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRecommendations);
}

/**
 * Quick recommendation - returns preset IDs only.
 */
export function recommendPresetsQuick(
  context: PresetAdvisorContext
): string[] {
  return recommendPresets(context).map(r => r.presetId);
}

// ─────────────────────────────────────────────────────
// ADVISOR LOG
// ─────────────────────────────────────────────────────

/**
 * Create an advisor log entry.
 */
export function createAdvisorLogEntry(
  suggested: string[],
  context?: Partial<PresetAdvisorContext>
): AdvisorLogEntry {
  return {
    timestamp: Date.now(),
    agent: 'PresetAdvisor',
    suggested,
    accepted: false,
    context,
  };
}

/**
 * Mark a log entry as accepted.
 */
export function acceptAdvisorSuggestion(
  entry: AdvisorLogEntry,
  selectedPresetId: string
): AdvisorLogEntry {
  return {
    ...entry,
    accepted: true,
    selectedPresetId,
  };
}

/**
 * Add feedback to a log entry.
 */
export function addFeedbackToEntry(
  entry: AdvisorLogEntry,
  feedback: AdvisorLogEntry['feedback']
): AdvisorLogEntry {
  return {
    ...entry,
    feedback,
  };
}

/**
 * Calculate advisor acceptance rate.
 */
export function calculateAcceptanceRate(log: AdvisorLogEntry[]): number {
  if (log.length === 0) return 0;
  const accepted = log.filter(e => e.accepted).length;
  return (accepted / log.length) * 100;
}

/**
 * Get most frequently accepted presets from log.
 */
export function getMostAcceptedPresets(
  log: AdvisorLogEntry[],
  limit: number = 5
): { presetId: string; count: number }[] {
  const counts = new Map<string, number>();
  
  for (const entry of log) {
    if (entry.accepted && entry.selectedPresetId) {
      counts.set(
        entry.selectedPresetId,
        (counts.get(entry.selectedPresetId) || 0) + 1
      );
    }
  }
  
  return Array.from(counts.entries())
    .map(([presetId, count]) => ({ presetId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// ─────────────────────────────────────────────────────
// STATE REDUCER
// ─────────────────────────────────────────────────────

/**
 * Reduce role state based on events.
 */
export function reduceRoleState(
  state: RoleState,
  event: RoleEvent
): RoleState {
  switch (event.type) {
    case 'ROLE_SELECTED': {
      const switchEntry: RoleSwitchEntry = {
        roleId: event.roleId,
        timestamp: Date.now(),
      };
      
      // Calculate previous duration if there was an active role
      if (state.activeRoleId && state.roleHistory.length > 0) {
        const lastSwitch = state.roleHistory[0];
        switchEntry.previousDurationMs = Date.now() - lastSwitch.timestamp;
      }
      
      return {
        ...state,
        activeRoleId: event.roleId,
        roleHistory: [switchEntry, ...state.roleHistory].slice(0, 50),
      };
    }
    
    case 'ROLE_CLEARED':
      return {
        ...state,
        activeRoleId: null,
      };
    
    case 'ROLE_CREATED':
      return {
        ...state,
        roles: [...state.roles, event.role],
      };
    
    case 'ROLE_UPDATED':
      return {
        ...state,
        roles: state.roles.map(r =>
          r.id === event.role.id ? event.role : r
        ),
      };
    
    case 'ROLE_DELETED':
      return {
        ...state,
        roles: state.roles.filter(r => r.id !== event.roleId),
        activeRoleId: state.activeRoleId === event.roleId 
          ? null 
          : state.activeRoleId,
      };
    
    case 'ADVISOR_SUGGESTION':
      return {
        ...state,
        advisorLog: [event.entry, ...state.advisorLog].slice(0, state.maxLogSize),
      };
    
    case 'ADVISOR_TOGGLED':
      return {
        ...state,
        advisorEnabled: event.enabled,
      };
    
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────
// ROLE ANALYTICS
// ─────────────────────────────────────────────────────

/**
 * Get role usage statistics.
 */
export function getRoleUsageStats(
  roleHistory: RoleSwitchEntry[]
): Map<string, { count: number; totalDurationMs: number }> {
  const stats = new Map<string, { count: number; totalDurationMs: number }>();
  
  for (let i = 0; i < roleHistory.length; i++) {
    const entry = roleHistory[i];
    const existing = stats.get(entry.roleId) || { count: 0, totalDurationMs: 0 };
    
    stats.set(entry.roleId, {
      count: existing.count + 1,
      totalDurationMs: existing.totalDurationMs + (entry.previousDurationMs || 0),
    });
  }
  
  return stats;
}

/**
 * Get most used role.
 */
export function getMostUsedRole(
  roleHistory: RoleSwitchEntry[]
): string | null {
  const stats = getRoleUsageStats(roleHistory);
  
  let maxCount = 0;
  let mostUsed: string | null = null;
  
  for (const [roleId, { count }] of stats.entries()) {
    if (count > maxCount) {
      maxCount = count;
      mostUsed = roleId;
    }
  }
  
  return mostUsed;
}

/**
 * Get average session duration for a role.
 */
export function getAverageRoleDuration(
  roleHistory: RoleSwitchEntry[],
  roleId: string
): number {
  const stats = getRoleUsageStats(roleHistory);
  const roleStat = stats.get(roleId);
  
  if (!roleStat || roleStat.count === 0) return 0;
  return roleStat.totalDurationMs / roleStat.count;
}

// ─────────────────────────────────────────────────────
// CONTEXT BUILDER
// ─────────────────────────────────────────────────────

/**
 * Create default advisor context.
 */
export function createDefaultAdvisorContext(
  overrides?: Partial<PresetAdvisorContext>
): PresetAdvisorContext {
  const hour = new Date().getHours();
  
  return {
    sessionDurationMin: 0,
    xrAvailable: false,
    timeOfDay: getTimeOfDay(hour),
    isMobile: typeof window !== 'undefined' && window.innerWidth < 768,
    ...overrides,
  };
}
