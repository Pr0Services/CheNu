/* =========================================================
   CHE·NU — Extended Theme Types (Block 2)
   
   Extended type definitions for Cosmic and Futurist themes.
   These themes have additional rules and constraints.
   
   ⚠️ GLOBAL CONSTRAINTS:
   - No gamification
   - No urgency
   - No forced focus
   - No emotional manipulation
   - Themes never alter decision chain
   ========================================================= */

/* -------------------------
   COLOR TYPES (Extended)
------------------------- */

export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    overlay: string;
  };
  
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  
  accent: {
    primary: string;
    secondary: string;
    tertiary: string;
    success: string;
    warning: string;
    error: string;
  };
  
  spheres: {
    personal: string;
    business: string;
    creative: string;
    scholar: string;
    social: string;
  };
  
  agents: {
    active: string;
    inactive: string;
    orbiting: string;
    highlight: string;
  };
  
  timeline: {
    past: string;
    present: string;
    future: string;
    event: string;
  };
  
  guards: {
    safe: string;
    warning: string;
    violation: string;
    shield: string;
  };
}

/* -------------------------
   SPACING TYPES
------------------------- */

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  
  xr: {
    near: number;
    mid: number;
    far: number;
    orbit: number;
    pillarDistance: number;
  };
}

/* -------------------------
   ANIMATION TYPES
------------------------- */

export interface ThemeAnimation {
  duration: {
    instant: number;
    fast: number;
    normal: number;
    slow: number;
    verySlow: number;
  };
  
  easing: {
    default: string;
    enter: string;
    exit: string;
    bounce: string;
  };
  
  xr: {
    orbitSpeed: number;
    floatAmplitude: number;
    floatSpeed: number;
    pulseSpeed: number;
    driftSpeed: number;
  };
}

/* -------------------------
   VISUAL RULES
------------------------- */

export interface VisualRules {
  backgroundStyle: string;
  accentStyle?: string;
  glowIntensity?: number;
  layout?: string;
  gridSize?: number;
  contrast: 'low' | 'medium' | 'high';
  motionStyle?: string;
  
  geometry?: {
    style: string;
    shapes: string[];
    edges: string;
    opacity: number;
  };
  
  lines?: {
    thickness: number;
    style: string;
    edges: string;
  };
  
  layering?: {
    enabled: boolean;
    levels: number;
    separation: string;
  };
  
  colorRestrictions?: {
    noSaturatedReds: boolean;
    noAggressiveTones: boolean;
    maxSaturation: number;
  };
}

/* -------------------------
   SPACE RULES
------------------------- */

export interface SpaceRules {
  environment: string;
  boundaries: string;
  
  depth?: {
    enabled: boolean;
    fogNear: number;
    fogFar: number;
    fogColor: string;
  };
  
  particles?: {
    enabled: boolean;
    count: number;
    size: number;
    color: string;
    opacity: number;
  };
}

/* -------------------------
   TIMELINE RULES
------------------------- */

export interface TimelineRules {
  representation: string;
  shape?: string;
  eventStyle: string;
  eventSize?: number;
  linearPressure: boolean;
  showUrgency: boolean;
}

/* -------------------------
   AGENT RULES
------------------------- */

export interface AgentRules {
  representation: string;
  sizeReflects?: string;
  humanoid?: boolean;
  aggressiveAnimation?: boolean;
  
  labels?: {
    visible: boolean;
    position: string;
    style: string;
  };
  
  activityIndicator?: string;
  pulseIntensity?: number;
  
  orbit?: {
    enabled: boolean;
    speed?: number;
    radius?: number;
    static?: boolean;
  };
}

/* -------------------------
   GUARD RULES
------------------------- */

export interface GuardRules {
  representation: string | string[];
  
  activationPulse?: {
    enabled: boolean;
    intensity: number;
    duration: number;
  };
  
  textExplanation?: {
    required: boolean;
    position: string;
    maxLength: number;
  };
}

/* -------------------------
   XR RULES
------------------------- */

export interface XRRules {
  environment?: string;
  gravity?: boolean;
  excessiveMotion?: boolean;
  forcedOrientation?: boolean;
  
  cameraDrift?: {
    enabled: boolean;
    speed: number;
    amplitude: number;
  };
  
  stableReference?: {
    enabled: boolean;
    type: string;
    visible: boolean;
  };
  
  stableHorizon?: {
    enabled: boolean;
    locked: boolean;
    reference: string;
  };
  
  panels?: {
    alignment: string;
    floating: boolean;
    snapToGrid: boolean;
  };
  
  floor?: {
    type: string;
    gridSize: number;
    visible: boolean;
  };
}

/* -------------------------
   INTERACTION RULES
------------------------- */

export interface InteractionRules {
  primaryActions?: string[];
  selectionStyle?: string;
  snapActions?: boolean;
  urgencyCues?: boolean;
  responsePredictability?: string;
  hiddenState?: boolean;
  stateVisibility?: string;
  
  hover?: {
    delay: number;
    feedbackStyle: string;
  };
  
  feedback?: {
    immediate: boolean;
    delay: number;
    style: string;
  };
  
  selection?: {
    indicator: string;
    color: string;
    thickness: number;
  };
}

/* -------------------------
   INFO RULES (Futurist)
------------------------- */

export interface InfoRules {
  dataSeparation: string;
  overlap: boolean;
  maxItemsVisible: number;
  
  readability: {
    minFontSize: number;
    minContrast: number;
    clearLabels: boolean;
  };
}

/* -------------------------
   THEME CONSTRAINTS
------------------------- */

export interface ThemeConstraints {
  noGamification: boolean;
  noUrgency: boolean;
  noForcedFocus: boolean;
  noEmotionalManipulation: boolean;
  noDecisionSuggestions: boolean;
  noAgentRanking: boolean;
  noOptimizationPressure: boolean;
  noDecisionChainAlteration: boolean;
}

/* -------------------------
   COMPLETE THEME TYPE
------------------------- */

export interface CheNuTheme {
  id: string;
  name: string;
  category: string;
  
  // Intent & goal
  intent: string;
  goalFeeling: string;
  
  // Use cases
  useCases: string[];
  
  // Core values
  colors: ThemeColors;
  spacing: ThemeSpacing;
  animation: ThemeAnimation;
  
  // Extended rules
  rules: {
    visual?: VisualRules;
    space?: SpaceRules;
    timeline?: TimelineRules;
    agents?: AgentRules;
    guards?: GuardRules;
    xr?: XRRules;
    interaction?: InteractionRules;
    info?: InfoRules;
  };
  
  // Global constraints
  constraints: ThemeConstraints;
}

/* -------------------------
   THEME SWITCHING
------------------------- */

export interface ThemeSwitchOptions {
  // Manual only
  manual: true;
  
  // Smooth transition
  transition: {
    duration: number;
    easing: string;
  };
  
  // Preserves context and session
  preserveContext: true;
  preserveSession: true;
}

export const DEFAULT_THEME_SWITCH: ThemeSwitchOptions = {
  manual: true,
  transition: {
    duration: 500,
    easing: 'ease-in-out',
  },
  preserveContext: true,
  preserveSession: true,
};

/* -------------------------
   THEME REGISTRY
------------------------- */

export type ThemeId = 
  | 'base'
  | 'ancient'
  | 'cosmic'
  | 'futurist'
  | 'realistic'
  | 'tree_nature';

export interface ThemeRegistry {
  themes: Map<ThemeId, CheNuTheme>;
  activeTheme: ThemeId;
  switchOptions: ThemeSwitchOptions;
}
