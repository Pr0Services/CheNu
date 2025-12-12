/* =========================================================
   CHE·NU — COSMIC / ABSTRACT THEME (Theme 4)
   
   📜 INTENT:
   Provide perspective, distance, and calm exploration 
   without disorientation. This theme is about seeing 
   complexity without pressure.
   
   USE CASES:
   - Exploration
   - Research
   - Vision work
   - Universe view
   - Multi-sphere navigation
   
   GOAL FEELING:
   "I can explore without getting lost."
   
   ⚠️ CONSTRAINT:
   Themes modify perception only.
   No logic, authority, agents, or rules may be altered.
   ========================================================= */

import type { CheNuTheme, ThemeColors, ThemeSpacing, ThemeAnimation } from './theme.types';

/* -------------------------
   COLORS
------------------------- */

const cosmicColors: ThemeColors = {
  // Backgrounds
  background: {
    primary: '#0a0a1a',      // Deep space black-blue
    secondary: '#0f0f2a',    // Slightly lighter
    tertiary: '#14143a',     // Panel backgrounds
    overlay: 'rgba(10, 10, 26, 0.85)',
  },
  
  // Text
  text: {
    primary: '#e0e6ff',      // Soft white-blue
    secondary: '#a0a8c0',    // Muted
    tertiary: '#606880',     // Very muted
    inverse: '#0a0a1a',
  },
  
  // Accents - Soft luminous
  accent: {
    primary: '#60a0ff',      // Soft blue
    secondary: '#a080ff',    // Soft purple
    tertiary: '#40e0d0',     // Soft cyan/turquoise
    success: '#60c080',      // Muted green
    warning: '#c0a060',      // Muted amber
    error: '#c06080',        // Muted pink-red (not aggressive)
  },
  
  // Spheres
  spheres: {
    personal: '#6080c0',     // Blue
    business: '#608080',     // Teal-gray
    creative: '#a060a0',     // Purple
    scholar: '#6060a0',      // Indigo
    social: '#80a080',       // Sage
  },
  
  // Agents - Soft lights
  agents: {
    active: '#80c0ff',       // Soft bright blue
    inactive: '#404060',     // Dim
    orbiting: '#60a0c0',     // Cyan-blue
    highlight: '#a0e0ff',    // Bright cyan
  },
  
  // Timeline - Constellation style
  timeline: {
    past: '#404060',         // Dim
    present: '#80c0ff',      // Bright
    future: '#303050',       // Very dim
    event: '#c0e0ff',        // Light point
  },
  
  // Guards
  guards: {
    safe: '#60a080',         // Soft green
    warning: '#a0a060',      // Soft amber
    violation: '#a06080',    // Soft red-pink
    shield: 'rgba(96, 160, 255, 0.2)',
  },
};

/* -------------------------
   SPACING
------------------------- */

const cosmicSpacing: ThemeSpacing = {
  // Open environments - generous spacing
  xs: 8,
  sm: 16,
  md: 32,
  lg: 64,
  xl: 128,
  
  // XR specific - depth and distance
  xr: {
    near: 0.8,
    mid: 2.0,
    far: 5.0,
    orbit: 1.8,
    pillarDistance: 2.5,
  },
};

/* -------------------------
   ANIMATIONS
------------------------- */

const cosmicAnimations: ThemeAnimation = {
  // Slow motion only
  duration: {
    instant: 0,
    fast: 400,
    normal: 800,
    slow: 1500,
    verySlow: 3000,
  },
  
  // Gentle easings
  easing: {
    default: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    enter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0.0, 1, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  
  // XR animations
  xr: {
    orbitSpeed: 0.05,        // Very slow orbit
    floatAmplitude: 0.03,    // Subtle float
    floatSpeed: 0.3,         // Slow bob
    pulseSpeed: 1.5,         // Gentle pulse
    driftSpeed: 0.02,        // Camera drift
  },
};

/* -------------------------
   VISUAL RULES
------------------------- */

const cosmicVisualRules = {
  // Dark or deep background
  backgroundStyle: 'deep-gradient',
  
  // Soft luminous accents
  accentStyle: 'glow',
  glowIntensity: 0.3,
  
  // Floating geometry
  geometry: {
    style: 'abstract',
    shapes: ['sphere', 'arc', 'orbit', 'ring', 'particle'],
    edges: 'soft',
    opacity: 0.7,
  },
  
  // No sharp contrasts
  contrast: 'low',
  
  // Slow motion only
  motionStyle: 'slow',
  
  // Colors - no aggressive tones
  colorRestrictions: {
    noSaturatedReds: true,
    noAggressiveTones: true,
    maxSaturation: 0.6,
  },
};

/* -------------------------
   SPACE RULES
------------------------- */

const cosmicSpaceRules = {
  // Open environments
  environment: 'open',
  
  // No hard walls
  boundaries: 'none',
  
  // Depth and distance visible
  depth: {
    enabled: true,
    fogNear: 5,
    fogFar: 30,
    fogColor: '#0a0a1a',
  },
  
  // Stars/particles in background
  particles: {
    enabled: true,
    count: 500,
    size: 0.02,
    color: '#ffffff',
    opacity: 0.3,
  },
};

/* -------------------------
   TIMELINE RULES
------------------------- */

const cosmicTimelineRules = {
  // Represented as arcs, paths, or constellations
  representation: 'constellation',
  shape: 'arc',
  
  // Events appear as light points
  eventStyle: 'light-point',
  eventSize: 0.05,
  
  // No linear pressure
  linearPressure: false,
  showUrgency: false,
};

/* -------------------------
   AGENT RULES
------------------------- */

const cosmicAgentRules = {
  // Represented as orbiting nodes or lights
  representation: 'light-node',
  
  // Size reflects activity, not importance
  sizeReflects: 'activity',
  
  // No faces, no bodies
  humanoid: false,
  
  // Orbit behavior
  orbit: {
    enabled: true,
    speed: 0.05,
    radius: 1.5,
  },
};

/* -------------------------
   XR RULES
------------------------- */

const cosmicXRRules = {
  // Zero-gravity feeling
  gravity: false,
  
  // Slow camera drift
  cameraDrift: {
    enabled: true,
    speed: 0.02,
    amplitude: 0.1,
  },
  
  // No forced orientation
  forcedOrientation: false,
  
  // User always has a stable reference point
  stableReference: {
    enabled: true,
    type: 'center-ring',
    visible: true,
  },
};

/* -------------------------
   INTERACTION RULES
------------------------- */

const cosmicInteractionRules = {
  // Point, hover, observe
  primaryActions: ['point', 'hover', 'observe'],
  
  // No snap actions
  snapActions: false,
  
  // No urgency cues
  urgencyCues: false,
  
  // Hover feedback
  hover: {
    delay: 200,
    feedbackStyle: 'soft-glow',
  },
};

/* =========================================================
   THEME EXPORT
   ========================================================= */

export const COSMIC_THEME: CheNuTheme = {
  id: 'cosmic',
  name: 'Cosmic',
  category: 'abstract',
  
  // Intent
  intent: 'Provide perspective, distance, and calm exploration without disorientation.',
  goalFeeling: 'I can explore without getting lost.',
  
  // Use cases
  useCases: [
    'exploration',
    'research',
    'vision_work',
    'universe_view',
    'multi_sphere_navigation',
  ],
  
  // Core theme values
  colors: cosmicColors,
  spacing: cosmicSpacing,
  animation: cosmicAnimations,
  
  // Extended rules
  rules: {
    visual: cosmicVisualRules,
    space: cosmicSpaceRules,
    timeline: cosmicTimelineRules,
    agents: cosmicAgentRules,
    xr: cosmicXRRules,
    interaction: cosmicInteractionRules,
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

export default COSMIC_THEME;
