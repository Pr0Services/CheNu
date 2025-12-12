/**
 * CHE·NU — AMBIENT DECOR SYSTEM
 * ==============================
 * Type Definitions
 * 
 * The decor system exists ONLY to provide:
 * - Comfort
 * - Calm  
 * - Identity
 * - Emotional safety
 * 
 * It must NEVER convey information, carry logic, or influence decisions.
 */

// ============================================================
// CORE TYPES
// ============================================================

export type DecorType = 
  | 'neutral'    // CHE·NU Neutral Sanctuary (default)
  | 'organic'    // Living Structure
  | 'cosmic'     // Cognitive Universe
  | 'focus'      // Silent Room
  | 'xr';        // Spatial Meeting Sanctuary

export type DecorMode = '2d' | '3d' | 'xr';

export type PerformanceLevel = 'high' | 'medium' | 'low' | 'minimal';

export type SphereType = 
  | 'personal'
  | 'business'
  | 'scholar'
  | 'creative'
  | 'social'
  | 'institutions'
  | 'methodology'
  | 'xr'
  | 'entertainment'
  | 'ailab'
  | 'team';

// ============================================================
// DECOR CONFIGURATION
// ============================================================

export interface DecorConfig {
  /** Current active decor type */
  type: DecorType;
  
  /** Display mode based on device capability */
  mode: DecorMode;
  
  /** Whether decor is enabled */
  enabled: boolean;
  
  /** Performance level for rendering */
  performance: PerformanceLevel;
  
  /** User's preferred decor per sphere (optional overrides) */
  spherePreferences: Partial<Record<SphereType, DecorType>>;
  
  /** Whether to inherit color hints from theme */
  inheritThemeColors: boolean;
  
  /** Transition duration in ms (slow, cognitive-safe) */
  transitionDuration: number;
  
  /** Agent aura tint intensity (0-0.05, max 5%) */
  agentAuraTint: number;
}

export const DEFAULT_DECOR_CONFIG: DecorConfig = {
  type: 'neutral',
  mode: '2d',
  enabled: true,
  performance: 'high',
  spherePreferences: {},
  inheritThemeColors: true,
  transitionDuration: 2000, // 2 seconds - slow, comfortable
  agentAuraTint: 0.03, // 3%
};

// ============================================================
// DECOR METADATA
// ============================================================

export interface DecorMetadata {
  id: DecorType;
  name: string;
  description: string;
  intent: string;
  usage: string[];
  characteristics: string[];
  defaultSpheres: SphereType[];
}

export const DECOR_METADATA: Record<DecorType, DecorMetadata> = {
  neutral: {
    id: 'neutral',
    name: 'CHE·NU Neutral Sanctuary',
    description: 'Abstract architectural volumes with soft diffuse light',
    intent: 'Safe place to think',
    usage: ['Global dashboard', 'Universe overview', 'Idle / reflection states'],
    characteristics: [
      'Abstract architectural volumes',
      'Soft diffuse light',
      'Neutral palette',
      'No motion except slow light shifts'
    ],
    defaultSpheres: ['business', 'institutions'],
  },
  organic: {
    id: 'organic',
    name: 'Living Structure',
    description: 'Organic curves with subtle living geometry',
    intent: 'Growth without chaos',
    usage: ['Personal sphere', 'Methodology', 'Learning / Scholar', 'Internal growth'],
    characteristics: [
      'Organic curves',
      'Subtle living geometry',
      'Very slow breathing motion',
      'Natural but abstract textures'
    ],
    defaultSpheres: ['personal', 'scholar', 'methodology'],
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cognitive Universe',
    description: 'Depth and horizon with subtle nebula-like gradients',
    intent: 'Perspective, not spectacle',
    usage: ['Inter-sphere navigation', 'Strategic overview', 'Long-term planning'],
    characteristics: [
      'Depth & horizon',
      'Subtle nebula-like gradients',
      'Almost static',
      'No stars, no sci-fi clichés'
    ],
    defaultSpheres: ['creative', 'entertainment'],
  },
  focus: {
    id: 'focus',
    name: 'Silent Room',
    description: 'Dark neutral tones with focused soft lighting',
    intent: 'Nothing distracts you now',
    usage: ['Sensitive tasks', 'Decision reviews', 'Ethics checks', 'Replays'],
    characteristics: [
      'Dark neutral tones',
      'Focused soft lighting',
      'Reduced contrast',
      'No visual noise'
    ],
    defaultSpheres: ['ailab'],
  },
  xr: {
    id: 'xr',
    name: 'Spatial Meeting Sanctuary',
    description: 'Symbolic architecture with wide spatial spacing',
    intent: 'Respectful conversation space',
    usage: ['XR meetings', 'Decision comparison', 'Multi-agent discussions'],
    characteristics: [
      'Symbolic architecture',
      'Wide spatial spacing',
      'Minimal floating elements',
      'Slow presence indicators'
    ],
    defaultSpheres: ['xr', 'team', 'social'],
  },
};

// ============================================================
// BEHAVIOR RULES (Enforced programmatically)
// ============================================================

export interface DecorBehaviorRules {
  /** Decor NEVER reacts to notifications */
  reactToNotifications: false;
  
  /** Decor NEVER flashes */
  allowFlashing: false;
  
  /** Maximum animation speed (Hz) - cognitive comfort threshold */
  maxAnimationSpeed: number;
  
  /** Decor NEVER changes during active input */
  changeDuringInput: false;
  
  /** Allowed triggers for decor change */
  allowedChangeTriggers: ('userAction' | 'sphereTransition' | 'modeChange')[];
}

export const DECOR_BEHAVIOR_RULES: DecorBehaviorRules = {
  reactToNotifications: false,
  allowFlashing: false,
  maxAnimationSpeed: 0.1, // Max 0.1 Hz = 10 second cycle minimum
  changeDuringInput: false,
  allowedChangeTriggers: ['userAction', 'sphereTransition', 'modeChange'],
};

// ============================================================
// PERFORMANCE FALLBACKS
// ============================================================

export interface PerformanceFallback {
  level: PerformanceLevel;
  description: string;
  features: {
    animations: boolean;
    gradients: boolean;
    blur: boolean;
    geometry3d: boolean;
  };
}

export const PERFORMANCE_FALLBACKS: Record<PerformanceLevel, PerformanceFallback> = {
  high: {
    level: 'high',
    description: 'Full decor with all effects',
    features: { animations: true, gradients: true, blur: true, geometry3d: true },
  },
  medium: {
    level: 'medium',
    description: 'Reduced animations and blur',
    features: { animations: true, gradients: true, blur: false, geometry3d: false },
  },
  low: {
    level: 'low',
    description: 'Static gradients only',
    features: { animations: false, gradients: true, blur: false, geometry3d: false },
  },
  minimal: {
    level: 'minimal',
    description: 'Flat color background',
    features: { animations: false, gradients: false, blur: false, geometry3d: false },
  },
};

// ============================================================
// THEME INTEGRATION
// ============================================================

export interface ThemeColorHints {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface DecorThemeIntegration {
  /** Apply theme color hints to decor */
  applyColorHints: (hints: ThemeColorHints) => void;
  
  /** Reduce saturation on conflict */
  reduceSaturation: () => void;
  
  /** Fallback to neutral sanctuary */
  fallbackToNeutral: () => void;
}

// ============================================================
// CONTEXT STATE
// ============================================================

export interface DecorState {
  config: DecorConfig;
  currentSphere: SphereType | null;
  isTransitioning: boolean;
  isInputActive: boolean;
  themeConflict: boolean;
}

export interface DecorActions {
  setDecorType: (type: DecorType) => void;
  setEnabled: (enabled: boolean) => void;
  setPerformance: (level: PerformanceLevel) => void;
  setSpherePreference: (sphere: SphereType, decor: DecorType) => void;
  resetToDefaults: () => void;
  notifySphereChange: (sphere: SphereType) => void;
  notifyInputStart: () => void;
  notifyInputEnd: () => void;
}

export type DecorContextType = DecorState & DecorActions;
