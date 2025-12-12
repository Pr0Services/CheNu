/* =====================================================
   CHE·NU — Preset Engine
   
   Pure functions for applying presets, evaluating
   conditions, and suggesting presets based on context.
   ===================================================== */

import {
  CheNuPreset,
  CheNuPersonalization,
  PresetCondition,
  PresetContext,
  PresetSuggestion,
  PresetPriority,
  TimeCondition,
  ActivityCondition,
  SphereCondition,
  DeviceCondition,
  DurationCondition,
  PersonalizationPatch,
  PresetState,
  PresetActivation,
  PresetEvent,
} from './preset.types';

import { DEFAULT_PRESET_STATE } from './preset.defaults';

// ─────────────────────────────────────────────────────
// APPLY PRESET
// ─────────────────────────────────────────────────────

/**
 * Apply a preset to current personalization.
 * Returns a new personalization with preset changes merged.
 */
export function applyPreset(
  current: CheNuPersonalization,
  preset: CheNuPreset
): CheNuPersonalization {
  const patch = preset.personalizationPatch;
  
  return {
    ...current,
    
    // Apply simple overrides
    ...(patch.themeGlobal && { themeGlobal: patch.themeGlobal }),
    ...(patch.density && { density: patch.density }),
    ...(patch.language && { language: patch.language }),
    
    // Deep merge XR settings
    xr: patch.xr
      ? { ...current.xr, ...patch.xr }
      : current.xr,
    
    // Deep merge UI settings
    ui: patch.ui
      ? { ...current.ui, ...patch.ui }
      : current.ui,
    
    // Deep merge notification settings
    notifications: patch.notifications
      ? { ...current.notifications, ...patch.notifications }
      : current.notifications,
    
    // Update metadata
    updatedAt: Date.now(),
  };
}

/**
 * Apply multiple presets in sequence.
 * Later presets override earlier ones.
 */
export function applyPresets(
  current: CheNuPersonalization,
  presets: CheNuPreset[]
): CheNuPersonalization {
  return presets.reduce(
    (acc, preset) => applyPreset(acc, preset),
    current
  );
}

/**
 * Get the diff between two personalizations.
 */
export function getPersonalizationDiff(
  before: CheNuPersonalization,
  after: CheNuPersonalization
): PersonalizationPatch {
  const diff: PersonalizationPatch = {};
  
  if (before.themeGlobal !== after.themeGlobal) {
    diff.themeGlobal = after.themeGlobal;
  }
  
  if (before.density !== after.density) {
    diff.density = after.density;
  }
  
  if (before.language !== after.language) {
    diff.language = after.language;
  }
  
  // XR diff
  const xrDiff: Record<string, any> = {};
  for (const key of Object.keys(after.xr) as (keyof typeof after.xr)[]) {
    if (before.xr[key] !== after.xr[key]) {
      xrDiff[key] = after.xr[key];
    }
  }
  if (Object.keys(xrDiff).length > 0) {
    diff.xr = xrDiff;
  }
  
  // UI diff
  const uiDiff: Record<string, any> = {};
  for (const key of Object.keys(after.ui) as (keyof typeof after.ui)[]) {
    if (before.ui[key] !== after.ui[key]) {
      uiDiff[key] = after.ui[key];
    }
  }
  if (Object.keys(uiDiff).length > 0) {
    diff.ui = uiDiff;
  }
  
  // Notifications diff
  const notifDiff: Record<string, any> = {};
  for (const key of Object.keys(after.notifications) as (keyof typeof after.notifications)[]) {
    if (before.notifications[key] !== after.notifications[key]) {
      notifDiff[key] = after.notifications[key];
    }
  }
  if (Object.keys(notifDiff).length > 0) {
    diff.notifications = notifDiff;
  }
  
  return diff;
}

// ─────────────────────────────────────────────────────
// CONDITION EVALUATION
// ─────────────────────────────────────────────────────

/**
 * Parse time string "HH:MM" to minutes since midnight.
 */
function parseTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Get current minutes since midnight.
 */
function getCurrentMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Check if current time is in range (handles overnight ranges).
 */
function isTimeInRange(
  current: number,
  start: number,
  end: number
): boolean {
  if (start <= end) {
    // Normal range: 09:00 - 17:00
    return current >= start && current < end;
  } else {
    // Overnight range: 21:00 - 06:00
    return current >= start || current < end;
  }
}

/**
 * Evaluate a time condition.
 */
export function evaluateTimeCondition(
  condition: TimeCondition,
  context: PresetContext
): boolean {
  const currentMinutes = getCurrentMinutes(context.currentTime);
  const startMinutes = parseTime(condition.startTime);
  const endMinutes = parseTime(condition.endTime);
  
  // Check time range
  if (!isTimeInRange(currentMinutes, startMinutes, endMinutes)) {
    return false;
  }
  
  // Check day of week if specified
  if (condition.daysOfWeek && condition.daysOfWeek.length > 0) {
    if (!condition.daysOfWeek.includes(context.dayOfWeek)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Evaluate an activity condition.
 */
export function evaluateActivityCondition(
  condition: ActivityCondition,
  context: PresetContext
): boolean {
  return context.currentActivity === condition.activity;
}

/**
 * Evaluate a sphere condition.
 */
export function evaluateSphereCondition(
  condition: SphereCondition,
  context: PresetContext
): boolean {
  if (!context.activeSphere) return false;
  
  const sphereMatches = context.activeSphere === condition.sphereId;
  
  // If onFocus is specified, we'd need additional focus state
  // For now, just check sphere ID match
  return sphereMatches;
}

/**
 * Evaluate a device condition.
 */
export function evaluateDeviceCondition(
  condition: DeviceCondition,
  context: PresetContext
): boolean {
  const hasCapability = context.capabilities[condition.capability];
  return condition.required ? hasCapability : !hasCapability;
}

/**
 * Evaluate a duration condition.
 */
export function evaluateDurationCondition(
  condition: DurationCondition,
  context: PresetContext
): boolean {
  const duration = context.sessionDurationMinutes;
  
  if (condition.minMinutes !== undefined && duration < condition.minMinutes) {
    return false;
  }
  
  if (condition.maxMinutes !== undefined && duration > condition.maxMinutes) {
    return false;
  }
  
  return true;
}

/**
 * Evaluate a single condition.
 */
export function evaluateCondition(
  condition: PresetCondition,
  context: PresetContext
): boolean {
  switch (condition.type) {
    case 'time':
      return evaluateTimeCondition(condition, context);
    case 'activity':
      return evaluateActivityCondition(condition, context);
    case 'sphere':
      return evaluateSphereCondition(condition, context);
    case 'device':
      return evaluateDeviceCondition(condition, context);
    case 'duration':
      return evaluateDurationCondition(condition, context);
    case 'manual':
      return false; // Manual presets never auto-match
    default:
      return false;
  }
}

/**
 * Evaluate all conditions for a preset.
 */
export function evaluatePresetConditions(
  preset: CheNuPreset,
  context: PresetContext
): { matches: boolean; matchedConditions: PresetCondition[] } {
  if (!preset.conditions || preset.conditions.length === 0) {
    return { matches: false, matchedConditions: [] };
  }
  
  const matchedConditions: PresetCondition[] = [];
  
  for (const condition of preset.conditions) {
    if (evaluateCondition(condition, context)) {
      matchedConditions.push(condition);
    }
  }
  
  const mode = preset.conditionMode || 'all';
  const matches = mode === 'all'
    ? matchedConditions.length === preset.conditions.length
    : matchedConditions.length > 0;
  
  return { matches, matchedConditions };
}

// ─────────────────────────────────────────────────────
// PRESET SUGGESTION
// ─────────────────────────────────────────────────────

/**
 * Priority to numeric score.
 */
const PRIORITY_SCORES: Record<PresetPriority, number> = {
  low: 25,
  medium: 50,
  high: 75,
  critical: 100,
};

/**
 * Generate reason text for a suggestion.
 */
function generateReason(
  preset: CheNuPreset,
  matchedConditions: PresetCondition[]
): string {
  if (matchedConditions.length === 0) {
    return 'Manual preset';
  }
  
  const reasons: string[] = [];
  
  for (const condition of matchedConditions) {
    switch (condition.type) {
      case 'time':
        reasons.push(`Time is ${condition.startTime}-${condition.endTime}`);
        break;
      case 'activity':
        reasons.push(`Activity: ${condition.activity}`);
        break;
      case 'sphere':
        reasons.push(`In sphere: ${condition.sphereId}`);
        break;
      case 'device':
        reasons.push(`Device: ${condition.capability}`);
        break;
      case 'duration':
        if (condition.minMinutes) {
          reasons.push(`Session > ${condition.minMinutes} min`);
        }
        break;
    }
  }
  
  return reasons.join(', ');
}

/**
 * Generate French reason text.
 */
function generateReasonFr(
  preset: CheNuPreset,
  matchedConditions: PresetCondition[]
): string {
  if (matchedConditions.length === 0) {
    return 'Preset manuel';
  }
  
  const reasons: string[] = [];
  
  for (const condition of matchedConditions) {
    switch (condition.type) {
      case 'time':
        reasons.push(`Heure: ${condition.startTime}-${condition.endTime}`);
        break;
      case 'activity':
        const activityFr: Record<string, string> = {
          meeting_start: 'début de réunion',
          meeting_end: 'fin de réunion',
          deep_work: 'travail profond',
          break: 'pause',
          presentation: 'présentation',
          review: 'révision',
          brainstorm: 'remue-méninges',
        };
        reasons.push(`Activité: ${activityFr[condition.activity] || condition.activity}`);
        break;
      case 'sphere':
        reasons.push(`Sphère: ${condition.sphereId}`);
        break;
      case 'device':
        reasons.push(`Appareil: ${condition.capability}`);
        break;
      case 'duration':
        if (condition.minMinutes) {
          reasons.push(`Session > ${condition.minMinutes} min`);
        }
        break;
    }
  }
  
  return reasons.join(', ');
}

/**
 * Suggest presets based on current context.
 */
export function suggestPresets(
  presets: CheNuPreset[],
  context: PresetContext,
  options: { maxSuggestions?: number; includeManual?: boolean } = {}
): PresetSuggestion[] {
  const { maxSuggestions = 5, includeManual = false } = options;
  
  const suggestions: PresetSuggestion[] = [];
  
  for (const preset of presets) {
    // Skip if not auto-activatable (unless includeManual)
    if (!preset.autoActivate && !includeManual) {
      continue;
    }
    
    const { matches, matchedConditions } = evaluatePresetConditions(preset, context);
    
    if (matches) {
      // Calculate score based on priority and condition match quality
      const priorityScore = PRIORITY_SCORES[preset.priority || 'medium'];
      const conditionScore = (matchedConditions.length / (preset.conditions?.length || 1)) * 50;
      const score = Math.min(100, priorityScore + conditionScore);
      
      suggestions.push({
        preset,
        score,
        matchedConditions,
        reason: generateReason(preset, matchedConditions),
        reasonI18n: {
          'fr-CA': generateReasonFr(preset, matchedConditions),
        },
      });
    }
  }
  
  // Sort by score descending
  suggestions.sort((a, b) => b.score - a.score);
  
  // Limit results
  return suggestions.slice(0, maxSuggestions);
}

/**
 * Quick suggestion for common contexts.
 */
export function suggestPresetsQuick(context: {
  activeSphere?: string;
  durationMinutes: number;
  xrCapable: boolean;
  inMeeting?: boolean;
}): string[] {
  const suggestions: string[] = [];
  
  // Long session -> focus
  if (context.durationMinutes > 45) {
    suggestions.push('focus');
  }
  
  // Business sphere -> audit
  if (context.activeSphere === 'business') {
    suggestions.push('audit');
  }
  
  // XR capable -> meeting or exploration
  if (context.xrCapable) {
    if (context.inMeeting) {
      suggestions.push('meeting');
    } else {
      suggestions.push('exploration');
    }
  }
  
  // In meeting -> meeting preset
  if (context.inMeeting) {
    suggestions.push('meeting');
  }
  
  // Remove duplicates
  return [...new Set(suggestions)];
}

// ─────────────────────────────────────────────────────
// STATE REDUCER
// ─────────────────────────────────────────────────────

/**
 * Reduce preset state based on events.
 */
export function reducePresetState(
  state: PresetState,
  event: PresetEvent
): PresetState {
  switch (event.type) {
    case 'PRESET_ACTIVATED': {
      const activation: PresetActivation = {
        presetId: event.presetId,
        activatedAt: Date.now(),
        trigger: event.trigger,
      };
      
      const history = [activation, ...state.history].slice(0, state.maxHistorySize);
      
      return {
        ...state,
        activePresetId: event.presetId,
        history,
      };
    }
    
    case 'PRESET_DEACTIVATED':
      return {
        ...state,
        activePresetId: null,
        previousPersonalization: null,
      };
    
    case 'PRESET_CREATED':
      return {
        ...state,
        presets: [...state.presets, event.preset],
      };
    
    case 'PRESET_UPDATED':
      return {
        ...state,
        presets: state.presets.map(p =>
          p.id === event.preset.id ? event.preset : p
        ),
      };
    
    case 'PRESET_DELETED':
      return {
        ...state,
        presets: state.presets.filter(p => p.id !== event.presetId),
        favorites: state.favorites.filter(id => id !== event.presetId),
        activePresetId: state.activePresetId === event.presetId 
          ? null 
          : state.activePresetId,
      };
    
    case 'PRESET_FAVORITED':
      if (state.favorites.includes(event.presetId)) {
        return state;
      }
      return {
        ...state,
        favorites: [...state.favorites, event.presetId],
      };
    
    case 'PRESET_UNFAVORITED':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== event.presetId),
      };
    
    case 'AUTO_SUGGEST_TOGGLED':
      return {
        ...state,
        autoSuggestEnabled: event.enabled,
      };
    
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────
// PRESET VALIDATION
// ─────────────────────────────────────────────────────

/**
 * Validation result.
 */
export interface PresetValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a preset definition.
 */
export function validatePreset(preset: Partial<CheNuPreset>): PresetValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!preset.id) {
    errors.push('Preset ID is required');
  } else if (!/^[a-z0-9-]+$/.test(preset.id)) {
    errors.push('Preset ID must be lowercase alphanumeric with dashes');
  }
  
  if (!preset.label) {
    errors.push('Preset label is required');
  }
  
  if (!preset.personalizationPatch) {
    errors.push('Preset must have a personalizationPatch');
  } else if (Object.keys(preset.personalizationPatch).length === 0) {
    warnings.push('Preset personalizationPatch is empty');
  }
  
  // Condition validation
  if (preset.conditions) {
    for (const condition of preset.conditions) {
      if (condition.type === 'time') {
        if (!condition.startTime || !condition.endTime) {
          errors.push('Time condition requires startTime and endTime');
        } else {
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
          if (!timeRegex.test(condition.startTime)) {
            errors.push(`Invalid startTime format: ${condition.startTime}`);
          }
          if (!timeRegex.test(condition.endTime)) {
            errors.push(`Invalid endTime format: ${condition.endTime}`);
          }
        }
      }
    }
  }
  
  // Warnings
  if (!preset.description) {
    warnings.push('Preset has no description');
  }
  
  if (!preset.conditions || preset.conditions.length === 0) {
    warnings.push('Preset has no conditions (manual only)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ─────────────────────────────────────────────────────
// CONTEXT HELPERS
// ─────────────────────────────────────────────────────

/**
 * Create a default context from current state.
 */
export function createDefaultContext(overrides?: Partial<PresetContext>): PresetContext {
  const now = new Date();
  
  return {
    currentTime: now,
    dayOfWeek: now.getDay(),
    activeSphere: undefined,
    currentActivity: undefined,
    sessionDurationMinutes: 0,
    capabilities: {
      xr: false,
      mobile: typeof window !== 'undefined' && window.innerWidth < 768,
      desktop: typeof window !== 'undefined' && window.innerWidth >= 1024,
      touch: typeof window !== 'undefined' && 'ontouchstart' in window,
    },
    inMeeting: false,
    activeAgentCount: 0,
    ...overrides,
  };
}

/**
 * Detect XR capability.
 */
export async function detectXRCapability(): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;
  if (!('xr' in navigator)) return false;
  
  try {
    const xr = (navigator as any).xr;
    return await xr.isSessionSupported('immersive-vr');
  } catch {
    return false;
  }
}
