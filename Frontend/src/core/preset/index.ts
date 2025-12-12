/* =========================================
   CHE·NU — PRESET MODULE EXPORTS
   
   Point d'entrée unique pour le système de presets.
   Importer depuis '@core/preset' ou './preset'
   ========================================= */

// === TYPES (Single Source of Truth) ===
export * from './types';

// === TIMELINE & CORE ===
export {
  // Timeline
  PresetTimeline,
  addPresetChange,
  recordPreset,
  currentPreset,
  clearTimeline,
  getTimelineSize,
  
  // Auras
  PresetAura,
  getPresetAura,
  setPresetAura,
  
  // Replay
  presetAt,
  transitions,
  transitionAt,
  
  // Metrics
  presetMetrics,
  topPresets,
  sourceCount,
  
  // Explain
  explainPreset,
  explainCurrent,
  sessionSummary,
} from './timeline';
