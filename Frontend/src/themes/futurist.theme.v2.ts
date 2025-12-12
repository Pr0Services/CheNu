/* =========================================================
   CHE·NU — FUTURIST / SYSTEMIC THEME (Theme 5)
   
   📜 INTENT:
   Precision, orchestration, and system awareness without 
   intimidation. This theme shows structure, not dominance.
   
   USE CASES:
   - Orchestration
   - Debug
   - Advanced users
   - XR control room
   - System-level oversight
   
   GOAL FEELING:
   "The system is complex, but fully understandable."
   
   ⚠️ CONSTRAINT:
   Themes modify perception only.
   No logic, authority, agents, or rules may be altered.
   ========================================================= */

import type { CheNuTheme, ThemeColors, ThemeSpacing, ThemeAnimation } from './theme.types';

/* -------------------------
   COLORS
------------------------- */

const futuristColors: ThemeColors = {
  // Backgrounds - Dark or neutral base
  background: {
    primary: '#0c0c14',      // Near black with blue tint
    secondary: '#12121c',    // Panel background
    tertiary: '#181824',     // Card background
    overlay: 'rgba(12, 12, 20, 0.9)',
  },
  
  // Text - Clear and readable
  text: {
    primary: '#e8ecf4',      // Bright white-blue
    secondary: '#a0a8b8',    // Muted
    tertiary: '#606878',     // Labels
    inverse: '#0c0c14',
  },
  
  // Accents - Cyan / Teal / Violet
  accent: {
    primary: '#00d4ff',      // Cyan
    secondary: '#8080ff',    // Violet
    tertiary: '#00c8a0',     // Teal
    success: '#00c896',      // Teal-green
    warning: '#ffb040',      // Amber
    error: '#ff6080',        // Soft red
  },
  
  // Spheres - Functional colors
  spheres: {
    personal: '#4080c0',     // Blue
    business: '#40a0a0',     // Teal
    creative: '#a040c0',     // Purple
    scholar: '#6060c0',      // Indigo
    social: '#60a060',       // Green
  },
  
  // Agents - Functional nodes
  agents: {
    active: '#00d4ff',       // Cyan
    inactive: '#404050',     // Gray
    orbiting: '#6080a0',     // Blue-gray
    highlight: '#40ffff',    // Bright cyan
  },
  
  // Timeline - System style
  timeline: {
    past: '#404050',         // Dim
    present: '#00d4ff',      // Bright cyan
    future: '#282830',       // Very dim
    event: '#80e0ff',        // Light cyan
  },
  
  // Guards - Clear indicators
  guards: {
    safe: '#00c896',         // Teal
    warning: '#ffb040',      // Amber
    violation: '#ff6080',    // Red
    shield: 'rgba(0, 212, 255, 0.15)',
  },
};

/* -------------------------
   SPACING
------------------------- */

const futuristSpacing: ThemeSpacing = {
  // Grid-based - precise
  xs: 4,
  sm: 8,
  md: 16,
  lg: 32,
  xl: 64,
  
  // XR specific - control room layout
  xr: {
    near: 0.6,
    mid: 1.5,
    far: 4.0,
    orbit: 1.2,
    pillarDistance: 2.0,
  },
};

/* -------------------------
   ANIMATIONS
------------------------- */

const futuristAnimations: ThemeAnimation = {
  // Immediate feedback, no excessive motion
  duration: {
    instant: 50,
    fast: 150,
    normal: 300,
    slow: 600,
    verySlow: 1000,
  },
  
  // Precise easings
  easing: {
    default: 'cubic-bezier(0.2, 0, 0.2, 1)',
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
    bounce: 'cubic-bezier(0.34, 1.2, 0.64, 1)',
  },
  
  // XR animations - calm and stable
  xr: {
    orbitSpeed: 0,           // No orbit rotation
    floatAmplitude: 0,       // No floating
    floatSpeed: 0,           // Static
    pulseSpeed: 2.0,         // Subtle pulse for activity
    driftSpeed: 0,           // No drift
  },
};

/* -------------------------
   VISUAL RULES
------------------------- */

const futuristVisualRules = {
  // Clean modular geometry
  backgroundStyle: 'solid',
  
  // Grid-based layouts
  layout: 'grid',
  gridSize: 16,
  
  // Thin lines, sharp but soft-edged
  lines: {
    thickness: 1,
    style: 'solid',
    edges: 'soft-rounded',
  },
  
  // Geometry
  geometry: {
    style: 'modular',
    shapes: ['box', 'panel', 'frame', 'line', 'node'],
    edges: 'rounded',
    opacity: 0.9,
  },
  
  // Clear layering
  layering: {
    enabled: true,
    levels: 4,
    separation: 'clear',
  },
  
  // Limited contrast palette
  contrast: 'medium',
};

/* -------------------------
   INFORMATION DISPLAY
------------------------- */

const futuristInfoRules = {
  // Data separated by layers
  dataSeparation: 'layers',
  
  // No overlap
  overlap: false,
  
  // No clutter
  maxItemsVisible: 8,
  
  // Everything readable at a glance
  readability: {
    minFontSize: 12,
    minContrast: 4.5,
    clearLabels: true,
  },
};

/* -------------------------
   AGENT RULES
------------------------- */

const futuristAgentRules = {
  // Represented as functional nodes
  representation: 'functional-node',
  
  // Clear labels
  labels: {
    visible: true,
    position: 'below',
    style: 'technical',
  },
  
  // Activity indicated by subtle pulses
  activityIndicator: 'pulse',
  pulseIntensity: 0.3,
  
  // Never animated aggressively
  aggressiveAnimation: false,
  
  // Static positioning
  orbit: {
    enabled: false,
    static: true,
  },
};

/* -------------------------
   GUARD RULES
------------------------- */

const futuristGuardRules = {
  // Visualized as shields, frames, or boundaries
  representation: ['shield', 'frame', 'boundary'],
  
  // Pulse softly when activated
  activationPulse: {
    enabled: true,
    intensity: 0.3,
    duration: 500,
  },
  
  // Always accompanied by textual explanation
  textExplanation: {
    required: true,
    position: 'adjacent',
    maxLength: 80,
  },
};

/* -------------------------
   XR RULES
------------------------- */

const futuristXRRules = {
  // Calm cockpit or systems room
  environment: 'control-room',
  
  // Floating panels aligned on axes
  panels: {
    alignment: 'axis-aligned',
    floating: true,
    snapToGrid: true,
  },
  
  // No excessive motion
  excessiveMotion: false,
  
  // Stable horizon at all times
  stableHorizon: {
    enabled: true,
    locked: true,
    reference: 'floor-grid',
  },
  
  // Grid floor
  floor: {
    type: 'grid',
    gridSize: 0.5,
    visible: true,
  },
};

/* -------------------------
   INTERACTION RULES
------------------------- */

const futuristInteractionRules = {
  // Direct selection
  selectionStyle: 'direct',
  
  // Predictable responses
  responsePredictability: 'high',
  
  // Immediate visual feedback
  feedback: {
    immediate: true,
    delay: 0,
    style: 'highlight',
  },
  
  // No hidden state
  hiddenState: false,
  stateVisibility: 'always',
  
  // Selection indicators
  selection: {
    indicator: 'frame',
    color: '#00d4ff',
    thickness: 2,
  },
};

/* =========================================================
   THEME EXPORT
   ========================================================= */

export const FUTURIST_THEME: CheNuTheme = {
  id: 'futurist',
  name: 'Futurist',
  category: 'systemic',
  
  // Intent
  intent: 'Precision, orchestration, and system awareness without intimidation.',
  goalFeeling: 'The system is complex, but fully understandable.',
  
  // Use cases
  useCases: [
    'orchestration',
    'debug',
    'advanced_users',
    'xr_control_room',
    'system_oversight',
  ],
  
  // Core theme values
  colors: futuristColors,
  spacing: futuristSpacing,
  animation: futuristAnimations,
  
  // Extended rules
  rules: {
    visual: futuristVisualRules,
    info: futuristInfoRules,
    agents: futuristAgentRules,
    guards: futuristGuardRules,
    xr: futuristXRRules,
    interaction: futuristInteractionRules,
  },
  
  // Global constraints
  constraints: {
    noGamification: true,
    noUrgency: true,
    noForcedFocus: true,
    noEmotionalManipulation: true,
    noDecisionSuggestions: true,
    noAgentRanking: true,
    noOptimizationPressure: true,
    noDecisionChainAlteration: true,
  },
};

export default FUTURIST_THEME;
