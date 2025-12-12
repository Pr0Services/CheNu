/* =========================================================
   CHE·NU — XR PRESET VISUALS
   
   Configuration visuelle des presets pour l'environnement XR.
   Définit les couleurs, intensités, rayons et animations
   pour chaque preset.
   ========================================================= */

// ─────────────────────────────────────────────────────────
// 1. XR PRESET VISUAL TYPES
// ─────────────────────────────────────────────────────────

/**
 * Type d'animation pour l'aura du preset.
 */
export type XRPresetAnimation = 'pulse' | 'static' | 'wave' | 'breathe' | 'shimmer';

/**
 * Configuration visuelle d'un preset en XR.
 */
export interface XRPresetVisual {
  /** ID du preset associé */
  presetId: string;
  /** Couleur principale (hex) */
  color: string;
  /** Couleur secondaire pour les dégradés */
  secondaryColor?: string;
  /** Intensité lumineuse (0-1) */
  intensity: number;
  /** Rayon de l'aura */
  radius: number;
  /** Type d'animation */
  animation?: XRPresetAnimation;
  /** Vitesse d'animation (multiplicateur) */
  animationSpeed?: number;
  /** Particules activées */
  particles?: boolean;
  /** Nombre de particules */
  particleCount?: number;
}

// ─────────────────────────────────────────────────────────
// 2. XR PRESET VISUAL MAP - CORE PRESETS
// ─────────────────────────────────────────────────────────

/**
 * Configuration visuelle pour les presets de base.
 */
export const XR_PRESET_VISUALS: Record<string, XRPresetVisual> = {
  // ─── Focus ───
  focus: {
    presetId: 'focus',
    color: '#4A90E2',
    secondaryColor: '#2E5C8A',
    intensity: 0.8,
    radius: 1.2,
    animation: 'static',
    particles: false,
  },

  // ─── Exploration ───
  exploration: {
    presetId: 'exploration',
    color: '#8E44AD',
    secondaryColor: '#5B2C6F',
    intensity: 1.0,
    radius: 1.8,
    animation: 'pulse',
    animationSpeed: 1.2,
    particles: true,
    particleCount: 50,
  },

  // ─── Audit ───
  audit: {
    presetId: 'audit',
    color: '#27AE60',
    secondaryColor: '#1E8449',
    intensity: 0.6,
    radius: 1.5,
    animation: 'wave',
    animationSpeed: 0.8,
    particles: false,
  },

  // ─── Meeting ───
  meeting: {
    presetId: 'meeting',
    color: '#F39C12',
    secondaryColor: '#D68910',
    intensity: 0.9,
    radius: 2.2,
    animation: 'static',
    particles: true,
    particleCount: 20,
  },

  // ─── Minimal ───
  minimal: {
    presetId: 'minimal',
    color: '#7F8C8D',
    secondaryColor: '#566573',
    intensity: 0.2,
    radius: 0.8,
    animation: 'static',
    particles: false,
  },
};

// ─────────────────────────────────────────────────────────
// 3. XR PRESET VISUAL MAP - EXTENDED PRESETS
// ─────────────────────────────────────────────────────────

/**
 * Configuration visuelle pour les presets étendus.
 */
export const XR_PRESET_VISUALS_EXTENDED: Record<string, XRPresetVisual> = {
  // ─── Presentation ───
  presentation: {
    presetId: 'presentation',
    color: '#E74C3C',
    secondaryColor: '#C0392B',
    intensity: 0.85,
    radius: 2.0,
    animation: 'breathe',
    animationSpeed: 0.6,
    particles: true,
    particleCount: 30,
  },

  // ─── Night ───
  night: {
    presetId: 'night',
    color: '#2C3E50',
    secondaryColor: '#1A252F',
    intensity: 0.3,
    radius: 1.0,
    animation: 'shimmer',
    animationSpeed: 0.4,
    particles: true,
    particleCount: 15,
  },

  // ─── Mobile ───
  mobile: {
    presetId: 'mobile',
    color: '#3498DB',
    secondaryColor: '#2980B9',
    intensity: 0.5,
    radius: 0.9,
    animation: 'static',
    particles: false,
  },

  // ─── Construction Site ───
  'construction-site': {
    presetId: 'construction-site',
    color: '#F39C12',
    secondaryColor: '#E67E22',
    intensity: 0.75,
    radius: 1.4,
    animation: 'pulse',
    animationSpeed: 1.5,
    particles: false,
  },

  // ─── XR Immersive ───
  'xr-immersive': {
    presetId: 'xr-immersive',
    color: '#9B59B6',
    secondaryColor: '#8E44AD',
    intensity: 1.0,
    radius: 2.5,
    animation: 'pulse',
    animationSpeed: 1.0,
    particles: true,
    particleCount: 100,
  },

  // ─── XR Comfort ───
  'xr-comfort': {
    presetId: 'xr-comfort',
    color: '#1ABC9C',
    secondaryColor: '#16A085',
    intensity: 0.6,
    radius: 1.6,
    animation: 'breathe',
    animationSpeed: 0.5,
    particles: true,
    particleCount: 25,
  },

  // ─── Morning Standup ───
  'morning-standup': {
    presetId: 'morning-standup',
    color: '#F1C40F',
    secondaryColor: '#F39C12',
    intensity: 0.7,
    radius: 1.3,
    animation: 'wave',
    animationSpeed: 1.0,
    particles: false,
  },

  // ─── Client Presentation ───
  'client-presentation': {
    presetId: 'client-presentation',
    color: '#2ECC71',
    secondaryColor: '#27AE60',
    intensity: 0.8,
    radius: 1.8,
    animation: 'static',
    particles: true,
    particleCount: 20,
  },
};

// ─────────────────────────────────────────────────────────
// 4. COMBINED MAP
// ─────────────────────────────────────────────────────────

/**
 * Tous les visuels de presets combinés.
 */
export const ALL_XR_PRESET_VISUALS: Record<string, XRPresetVisual> = {
  ...XR_PRESET_VISUALS,
  ...XR_PRESET_VISUALS_EXTENDED,
};

// ─────────────────────────────────────────────────────────
// 5. UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────

/**
 * Obtient la configuration visuelle d'un preset.
 */
export function getPresetVisual(presetId: string): XRPresetVisual | undefined {
  return ALL_XR_PRESET_VISUALS[presetId];
}

/**
 * Obtient la configuration visuelle avec fallback.
 */
export function getPresetVisualOrDefault(presetId: string): XRPresetVisual {
  return ALL_XR_PRESET_VISUALS[presetId] || XR_PRESET_VISUALS.minimal;
}

/**
 * Calcule l'opacité de l'aura basée sur l'intensité.
 */
export function calculateAuraOpacity(visual: XRPresetVisual): number {
  return 0.15 * visual.intensity;
}

/**
 * Calcule l'intensité émissive.
 */
export function calculateEmissiveIntensity(visual: XRPresetVisual): number {
  return visual.intensity * 0.8;
}

/**
 * Obtient les paramètres d'animation.
 */
export function getAnimationParams(visual: XRPresetVisual): {
  type: XRPresetAnimation;
  speed: number;
  enabled: boolean;
} {
  return {
    type: visual.animation || 'static',
    speed: visual.animationSpeed || 1.0,
    enabled: visual.animation !== 'static',
  };
}

// ─────────────────────────────────────────────────────────
// 6. SPHERE-SPECIFIC VISUALS
// ─────────────────────────────────────────────────────────

/**
 * Visuels par sphère pour les presets de sphère.
 */
export const SPHERE_VISUALS: Record<string, Partial<XRPresetVisual>> = {
  personal: {
    color: '#3B82F6',
    intensity: 0.7,
    animation: 'breathe',
  },
  business: {
    color: '#22C55E',
    intensity: 0.8,
    animation: 'static',
  },
  creative: {
    color: '#EC4899',
    intensity: 0.9,
    animation: 'pulse',
  },
  social: {
    color: '#F97316',
    intensity: 0.75,
    animation: 'wave',
  },
  scholar: {
    color: '#8B5CF6',
    intensity: 0.7,
    animation: 'shimmer',
  },
  methodology: {
    color: '#06B6D4',
    intensity: 0.65,
    animation: 'static',
  },
  institutions: {
    color: '#78716C',
    intensity: 0.5,
    animation: 'static',
  },
  xr: {
    color: '#6366F1',
    intensity: 1.0,
    animation: 'pulse',
  },
  governance: {
    color: '#EAB308',
    intensity: 0.6,
    animation: 'wave',
  },
};

/**
 * Combine un preset visual avec une sphère.
 */
export function combineWithSphere(
  baseVisual: XRPresetVisual,
  sphereId: string
): XRPresetVisual {
  const sphereOverride = SPHERE_VISUALS[sphereId];
  if (!sphereOverride) return baseVisual;

  return {
    ...baseVisual,
    ...sphereOverride,
    // Blend colors si les deux existent
    secondaryColor: baseVisual.color,
  };
}
