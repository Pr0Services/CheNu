/* =========================================================
   CHE·NU — XR PRESETS MODULE
   
   Visualisation des presets en environnement XR.
   ========================================================= */

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────

export type {
  XRPresetVisual,
  XRPresetAnimation,
} from './xrPresetVisuals';

export type {
  XRPresetAuraProps,
} from './XRPresetAura';

// ─────────────────────────────────────────────────────────
// VISUALS
// ─────────────────────────────────────────────────────────

export {
  // Core presets visuals
  XR_PRESET_VISUALS,
  
  // Extended presets visuals
  XR_PRESET_VISUALS_EXTENDED,
  
  // Combined map
  ALL_XR_PRESET_VISUALS,
  
  // Sphere visuals
  SPHERE_VISUALS,
  
  // Utility functions
  getPresetVisual,
  getPresetVisualOrDefault,
  calculateAuraOpacity,
  calculateEmissiveIntensity,
  getAnimationParams,
  combineWithSphere,
} from './xrPresetVisuals';

// ─────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────

export {
  // Main aura component
  XRPresetAura,
  
  // Particles component
  XRPresetAuraParticles,
  
  // Complete aura with particles
  XRPresetAuraComplete,
} from './XRPresetAura';

export { default } from './XRPresetAura';
