/* =====================================================
   CHE·NU — Phase Preset Engine
   
   Pure functions for phase management and transitions.
   ===================================================== */

import {
  PhaseDefinition,
  PhasePreset,
  PhaseState,
  PhaseEvent,
  PhaseTransition,
  AllPhaseId,
} from './phasePreset.types';

import {
  DEFAULT_PHASE_STATE,
  getPhaseById,
  getPresetForPhase,
  getNextPhase,
  getPreviousPhase,
} from './phasePreset.defaults';

// ─────────────────────────────────────────────────────
// STATE REDUCER
// ─────────────────────────────────────────────────────

/**
 * Reduce phase state based on events.
 */
export function reducePhaseState(
  state: PhaseState,
  event: PhaseEvent
): PhaseState {
  switch (event.type) {
    case 'PHASE_ENTERED': {
      const transition: PhaseTransition = {
        fromPhase: state.activePhase,
        toPhase: event.phase,
        timestamp: Date.now(),
        initiatedBy: event.initiatedBy,
      };
      
      return {
        ...state,
        activePhase: event.phase,
        transitions: [transition, ...state.transitions].slice(0, state.maxHistorySize),
      };
    }
    
    case 'PHASE_EXITED':
      return {
        ...state,
        activePhase: null,
      };
    
    case 'PHASE_PRESET_UPDATED': {
      const existing = state.phasePresets.findIndex(
        pp => pp.phase === event.mapping.phase && pp.priority === event.mapping.priority
      );
      
      if (existing >= 0) {
        const updated = [...state.phasePresets];
        updated[existing] = event.mapping;
        return { ...state, phasePresets: updated };
      }
      
      return {
        ...state,
        phasePresets: [...state.phasePresets, event.mapping],
      };
    }
    
    case 'AUTO_SWITCH_TOGGLED':
      return {
        ...state,
        autoSwitchEnabled: event.enabled,
      };
    
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────
// PHASE NAVIGATION
// ─────────────────────────────────────────────────────

/**
 * Enter a phase.
 */
export function enterPhase(
  state: PhaseState,
  phaseId: AllPhaseId,
  initiatedBy: 'user' | 'system' | 'agent' = 'user'
): PhaseState {
  // Validate phase exists
  const phase = getPhaseById(state.phases, phaseId);
  if (!phase) {
    console.warn(`Phase not found: ${phaseId}`);
    return state;
  }
  
  return reducePhaseState(state, {
    type: 'PHASE_ENTERED',
    phase: phaseId,
    initiatedBy,
  });
}

/**
 * Exit current phase.
 */
export function exitPhase(state: PhaseState): PhaseState {
  if (!state.activePhase) return state;
  
  return reducePhaseState(state, {
    type: 'PHASE_EXITED',
    phase: state.activePhase,
  });
}

/**
 * Move to next phase.
 */
export function advancePhase(
  state: PhaseState,
  initiatedBy: 'user' | 'system' | 'agent' = 'user'
): PhaseState {
  if (!state.activePhase) return state;
  
  const next = getNextPhase(state.phases, state.activePhase);
  if (!next) {
    console.warn('No next phase available');
    return state;
  }
  
  return enterPhase(state, next.id, initiatedBy);
}

/**
 * Move to previous phase.
 */
export function regressPhase(
  state: PhaseState,
  initiatedBy: 'user' | 'system' | 'agent' = 'user'
): PhaseState {
  if (!state.activePhase) return state;
  
  const prev = getPreviousPhase(state.phases, state.activePhase);
  if (!prev) {
    console.warn('No previous phase available');
    return state;
  }
  
  return enterPhase(state, prev.id, initiatedBy);
}

// ─────────────────────────────────────────────────────
// PRESET RESOLUTION
// ─────────────────────────────────────────────────────

/**
 * Get preset for current phase.
 */
export function getCurrentPhasePreset(
  state: PhaseState,
  context?: { roleId?: string; device?: string }
): string | undefined {
  if (!state.activePhase) return undefined;
  return getPresetForPhase(state.phasePresets, state.activePhase, context);
}

/**
 * Update phase preset mapping.
 */
export function updatePhasePreset(
  state: PhaseState,
  mapping: PhasePreset
): PhaseState {
  return reducePhaseState(state, {
    type: 'PHASE_PRESET_UPDATED',
    mapping,
  });
}

// ─────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────

/**
 * Get time spent in each phase.
 */
export function getPhaseTimeStats(
  transitions: PhaseTransition[]
): Map<AllPhaseId, { count: number; totalTimeMs: number; avgTimeMs: number }> {
  const stats = new Map<AllPhaseId, { count: number; totalTimeMs: number; avgTimeMs: number }>();
  
  for (let i = 0; i < transitions.length - 1; i++) {
    const current = transitions[i];
    const next = transitions[i + 1];
    
    const duration = current.timestamp - next.timestamp;
    const existing = stats.get(current.toPhase) || { count: 0, totalTimeMs: 0, avgTimeMs: 0 };
    
    const newCount = existing.count + 1;
    const newTotal = existing.totalTimeMs + duration;
    
    stats.set(current.toPhase, {
      count: newCount,
      totalTimeMs: newTotal,
      avgTimeMs: newTotal / newCount,
    });
  }
  
  return stats;
}

/**
 * Get phase transition frequency.
 */
export function getTransitionFrequency(
  transitions: PhaseTransition[]
): Map<string, number> {
  const frequency = new Map<string, number>();
  
  for (const t of transitions) {
    const key = `${t.fromPhase || 'start'} → ${t.toPhase}`;
    frequency.set(key, (frequency.get(key) || 0) + 1);
  }
  
  return frequency;
}

/**
 * Get current phase duration.
 */
export function getCurrentPhaseDuration(
  state: PhaseState
): number {
  if (!state.activePhase || state.transitions.length === 0) return 0;
  
  const lastTransition = state.transitions[0];
  if (lastTransition.toPhase !== state.activePhase) return 0;
  
  return Date.now() - lastTransition.timestamp;
}

/**
 * Get phase progress percentage.
 */
export function getPhaseProgress(
  state: PhaseState,
  category: 'standard' | 'construction' = 'standard'
): number {
  if (!state.activePhase) return 0;
  
  const categoryPhases = state.phases
    .filter(p => p.category === category)
    .sort((a, b) => a.order - b.order);
  
  const currentIndex = categoryPhases.findIndex(p => p.id === state.activePhase);
  if (currentIndex < 0) return 0;
  
  return ((currentIndex + 1) / categoryPhases.length) * 100;
}

// ─────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────

/**
 * Check if transition is valid.
 */
export function isValidTransition(
  state: PhaseState,
  fromPhase: AllPhaseId | null,
  toPhase: AllPhaseId
): boolean {
  const from = fromPhase ? getPhaseById(state.phases, fromPhase) : null;
  const to = getPhaseById(state.phases, toPhase);
  
  if (!to) return false;
  
  // If no from, any phase is valid
  if (!from) return true;
  
  // Must be same category
  if (from.category !== to.category) return false;
  
  // Can go forward or backward within category
  return true;
}

/**
 * Get valid next phases from current.
 */
export function getValidNextPhases(
  state: PhaseState
): PhaseDefinition[] {
  if (!state.activePhase) {
    // Can start with any first phase
    return state.phases.filter(p => p.order === 1);
  }
  
  const current = getPhaseById(state.phases, state.activePhase);
  if (!current) return [];
  
  // Return phases in same category
  return state.phases
    .filter(p => p.category === current.category && p.id !== current.id)
    .sort((a, b) => a.order - b.order);
}
