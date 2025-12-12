/**
 * CHE·NU — AMBIENT DECOR SYSTEM
 * ==============================
 * Foundation Extension (Non-Functional Layer)
 * Mode: Visual Comfort / Cognitive Safety
 * Status: CANONICAL
 * 
 * This file defines all types, configurations, and constants
 * for the Ambient Decor System.
 */

// ============================================================
// DECOR TYPES
// ============================================================

export type DecorType = 
  | 'neutral'    // Neutral Sanctuary (DEFAULT)
  | 'organic'    // Living Structure
  | 'cosmic'     // Cognitive Universe
  | 'focus'      // Silent Room
  | 'xr';        // Spatial Meeting Sanctuary

export type DecorState = 
  | 'active'     // Decor is rendering
  | 'disabled'   // User disabled decor
  | 'fallback'   // Using fallback due to performance/conflict
  | 'transitioning'; // Between decor types

export type DeviceCapability = 
  | 'high'       // Full effects
  | 'standard'   // Reduced animation
  | 'low'        // Static only
  | 'mobile'     // Simplified
  | 'xr';        // XR optimized

// ============================================================
// CONFIGURATION INTERFACES
// ============================================================

export interface DecorColorHints {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
}

export interface DecorAnimation {
  enabled: boolean;
  speed: 'ultra-slow' | 'slow' | 'medium'; // Never fast
  type: 'breathe' | 'drift' | 'pulse' | 'none';
}

export interface DecorConfig {
  type: DecorType;
  colorHints: DecorColorHints;
  animation: DecorAnimation;
  opacity: number; // 0-1, affects visibility
  saturation: number; // 0-1, reduced on conflict
  blur: number; // Background blur in px
}

export interface DecorTypeDefinition {
  id: DecorType;
  name: string;
  intent: string;
  usage: string[];
  characteristics: string[];
  defaultConfig: DecorConfig;
}

// ============================================================
// CANONICAL DECOR DEFINITIONS
// ============================================================

export const DECOR_DEFINITIONS: Record<DecorType, DecorTypeDefinition> = {
  neutral: {
    id: 'neutral',
    name: 'Neutral Sanctuary',
    intent: 'Safe place to think',
    usage: [
      'Global dashboard',
      'Universe overview',
      'Idle / reflection states',
    ],
    characteristics: [
      'Abstract architectural volumes',
      'Soft diffuse light',
      'Neutral palette',
      'No motion except slow light shifts',
    ],
    defaultConfig: {
      type: 'neutral',
      colorHints: {
        primary: '#E5E7EB',
        secondary: '#D1D5DB',
        accent: '#9CA3AF',
        glow: '#F3F4F6',
      },
      animation: {
        enabled: true,
        speed: 'ultra-slow',
        type: 'drift',
      },
      opacity: 0.6,
      saturation: 0.3,
      blur: 0,
    },
  },

  organic: {
    id: 'organic',
    name: 'Living Structure',
    intent: 'Growth without chaos',
    usage: [
      'Personal sphere',
      'Methodology',
      'Learning / Scholar',
      'Internal growth contexts',
    ],
    characteristics: [
      'Organic curves',
      'Subtle living geometry',
      'Very slow breathing motion',
      'Natural but abstract textures',
    ],
    defaultConfig: {
      type: 'organic',
      colorHints: {
        primary: '#D1FAE5',
        secondary: '#A7F3D0',
        accent: '#6EE7B7',
        glow: '#ECFDF5',
      },
      animation: {
        enabled: true,
        speed: 'ultra-slow',
        type: 'breathe',
      },
      opacity: 0.5,
      saturation: 0.4,
      blur: 0,
    },
  },

  cosmic: {
    id: 'cosmic',
    name: 'Cognitive Universe',
    intent: 'Perspective, not spectacle',
    usage: [
      'Inter-sphere navigation',
      'Strategic overview',
      'Long-term planning',
    ],
    characteristics: [
      'Depth & horizon',
      'Subtle nebula-like gradients',
      'Almost static',
      'No stars, no sci-fi clichés',
    ],
    defaultConfig: {
      type: 'cosmic',
      colorHints: {
        primary: '#1E1B4B',
        secondary: '#312E81',
        accent: '#6366F1',
        glow: '#4338CA',
      },
      animation: {
        enabled: true,
        speed: 'ultra-slow',
        type: 'drift',
      },
      opacity: 0.7,
      saturation: 0.5,
      blur: 0,
    },
  },

  focus: {
    id: 'focus',
    name: 'Silent Room',
    intent: 'Nothing distracts you now',
    usage: [
      'Sensitive tasks',
      'Decision reviews',
      'Ethics checks',
      'Replays',
    ],
    characteristics: [
      'Dark neutral tones',
      'Focused soft lighting',
      'Reduced contrast',
      'No visual noise',
    ],
    defaultConfig: {
      type: 'focus',
      colorHints: {
        primary: '#1F2937',
        secondary: '#374151',
        accent: '#4B5563',
        glow: '#111827',
      },
      animation: {
        enabled: false,
        speed: 'ultra-slow',
        type: 'none',
      },
      opacity: 0.8,
      saturation: 0.1,
      blur: 0,
    },
  },

  xr: {
    id: 'xr',
    name: 'Spatial Meeting Sanctuary',
    intent: 'Respectful conversation space',
    usage: [
      'XR meetings',
      'Decision comparison',
      'Multi-agent discussions',
    ],
    characteristics: [
      'Symbolic architecture',
      'Wide spatial spacing',
      'Minimal floating elements',
      'Slow presence indicators',
    ],
    defaultConfig: {
      type: 'xr',
      colorHints: {
        primary: '#1E3A5F',
        secondary: '#2563EB',
        accent: '#3B82F6',
        glow: '#1D4ED8',
      },
      animation: {
        enabled: true,
        speed: 'slow',
        type: 'pulse',
      },
      opacity: 0.6,
      saturation: 0.4,
      blur: 0,
    },
  },
};

// ============================================================
// SPHERE TO DECOR MAPPING
// ============================================================

export const SPHERE_DECOR_MAP: Record<string, DecorType> = {
  // Personal contexts
  'personal': 'organic',
  'health': 'organic',
  'goals': 'organic',
  'journal': 'focus',
  
  // Professional contexts
  'business': 'neutral',
  'projects': 'neutral',
  'clients': 'neutral',
  
  // Knowledge contexts
  'scholar': 'organic',
  'research': 'focus',
  'learning': 'organic',
  
  // Creative contexts
  'creative': 'organic',
  'design': 'neutral',
  'writing': 'focus',
  
  // Social contexts
  'social': 'neutral',
  'communications': 'neutral',
  
  // Institutional contexts
  'institutions': 'neutral',
  'compliance': 'focus',
  
  // Meta contexts
  'methodology': 'organic',
  'ailab': 'cosmic',
  'team': 'neutral',
  
  // Navigation contexts
  'universe': 'cosmic',
  'navigation': 'cosmic',
  'overview': 'cosmic',
  
  // XR contexts
  'xr-meeting': 'xr',
  'xr-decision': 'xr',
  'xr-collaboration': 'xr',
  
  // Special contexts
  'ethics-review': 'focus',
  'decision-review': 'focus',
  'replay': 'focus',
  
  // Default
  'default': 'neutral',
};

// ============================================================
// BEHAVIOR RULES (ENFORCED)
// ============================================================

export const DECOR_RULES = {
  // Animation constraints
  MAX_ANIMATION_SPEED_MS: 10000, // Minimum 10 seconds per cycle
  MIN_ANIMATION_SPEED_MS: 30000, // Default 30 seconds per cycle
  
  // Agent aura constraints
  MAX_AGENT_AURA_TINT: 0.05, // 5% maximum
  AGENT_AURA_FADE_MS: 500, // Fade out when inactive
  
  // Transition constraints
  SPHERE_TRANSITION_MS: 1500, // Smooth fade between spheres
  MODE_TRANSITION_MS: 2000, // 2D → 3D → XR
  
  // Conflict resolution
  CONFLICT_SATURATION_STEP_1: 0.5, // Reduce to 50%
  CONFLICT_SATURATION_STEP_2: 0.25, // Reduce to 25%
  CONFLICT_FALLBACK: 'neutral' as DecorType, // Final fallback
  
  // Performance thresholds
  FPS_THRESHOLD_REDUCE: 30, // Reduce effects below this
  FPS_THRESHOLD_DISABLE: 15, // Disable animation below this
  
  // User control
  INSTANT_DISABLE: true, // User can disable instantly
  REMEMBER_PREFERENCE: true, // Remember per-sphere choices
} as const;

// ============================================================
// DEVICE CAPABILITY DETECTION
// ============================================================

export function detectDeviceCapability(): DeviceCapability {
  // Check for XR
  if ('xr' in navigator) {
    return 'xr';
  }
  
  // Check for mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  if (isMobile) {
    return 'mobile';
  }
  
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  
  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;
  
  if (cores >= 8 && memory >= 8) {
    return 'high';
  } else if (cores >= 4 && memory >= 4) {
    return 'standard';
  } else {
    return 'low';
  }
}

// ============================================================
// CONFIG SCALING BY DEVICE
// ============================================================

export function scaleConfigForDevice(
  config: DecorConfig,
  capability: DeviceCapability
): DecorConfig {
  switch (capability) {
    case 'high':
      return config; // Full config
      
    case 'standard':
      return {
        ...config,
        animation: {
          ...config.animation,
          speed: 'slow', // Slower animation
        },
      };
      
    case 'low':
      return {
        ...config,
        animation: {
          enabled: false,
          speed: 'ultra-slow',
          type: 'none',
        },
        blur: 0,
      };
      
    case 'mobile':
      return {
        ...config,
        animation: {
          enabled: false,
          speed: 'ultra-slow',
          type: 'none',
        },
        opacity: config.opacity * 0.7,
        blur: 0,
      };
      
    case 'xr':
      return {
        ...config,
        animation: {
          ...config.animation,
          speed: 'slow',
        },
        opacity: config.opacity * 0.8,
      };
      
    default:
      return config;
  }
}

// ============================================================
// CONFLICT RESOLUTION
// ============================================================

export function resolveThemeConflict(
  config: DecorConfig,
  themeContrast: number // 0-1, accessibility contrast requirement
): DecorConfig {
  // Step 1: Reduce saturation
  if (themeContrast > 0.7) {
    return {
      ...config,
      saturation: config.saturation * DECOR_RULES.CONFLICT_SATURATION_STEP_1,
    };
  }
  
  // Step 2: Reduce further
  if (themeContrast > 0.85) {
    return {
      ...config,
      saturation: config.saturation * DECOR_RULES.CONFLICT_SATURATION_STEP_2,
    };
  }
  
  // Step 3: Fallback to neutral
  if (themeContrast > 0.95) {
    return DECOR_DEFINITIONS.neutral.defaultConfig;
  }
  
  return config;
}

// ============================================================
// EXPORTS
// ============================================================

export default {
  DECOR_DEFINITIONS,
  SPHERE_DECOR_MAP,
  DECOR_RULES,
  detectDeviceCapability,
  scaleConfigForDevice,
  resolveThemeConflict,
};
