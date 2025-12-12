/* =====================================================
   CHE·NU — Theme Types
   PHASE 7: Visual Theme System
   
   Defines the structure for all visual themes.
   Themes control colors, typography, effects, and
   spatial characteristics.
   ===================================================== */

// ─────────────────────────────────────────────────────
// COLOR TOKENS
// ─────────────────────────────────────────────────────

export interface ColorPalette {
  // Core
  primary: string;
  secondary: string;
  accent: string;
  
  // Backgrounds
  background: string;
  surface: string;
  surfaceHover: string;
  overlay: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  
  // Semantic
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Sphere-specific (can be overridden per sphere)
  sphereColors: {
    business: string;
    creative: string;
    personal: string;
    scholar: string;
  };
  
  // Agent roles
  agentColors: {
    orchestrator: string;
    analyst: string;
    evaluator: string;
    advisor: string;
  };
  
  // Decision types
  decisionColors: {
    approve: string;
    reject: string;
    pivot: string;
    defer: string;
    escalate: string;
  };
}

// ─────────────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────────────

export interface Typography {
  // Font families
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
    display: string;
  };
  
  // Font sizes
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  
  // Font weights
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  
  // Line heights
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  
  // Letter spacing
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
    wider: string;
  };
}

// ─────────────────────────────────────────────────────
// SPACING & LAYOUT
// ─────────────────────────────────────────────────────

export interface Spacing {
  // Base unit (px)
  unit: number;
  
  // Scale
  scale: {
    '0': string;
    '1': string;
    '2': string;
    '3': string;
    '4': string;
    '5': string;
    '6': string;
    '8': string;
    '10': string;
    '12': string;
    '16': string;
    '20': string;
    '24': string;
  };
  
  // Semantic
  containerPadding: string;
  cardPadding: string;
  sectionGap: string;
  elementGap: string;
}

// ─────────────────────────────────────────────────────
// BORDERS & RADII
// ─────────────────────────────────────────────────────

export interface Borders {
  // Border widths
  width: {
    thin: string;
    normal: string;
    thick: string;
  };
  
  // Border radii
  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  
  // Border styles
  style: {
    subtle: string;
    normal: string;
    accent: string;
  };
}

// ─────────────────────────────────────────────────────
// SHADOWS & EFFECTS
// ─────────────────────────────────────────────────────

export interface Effects {
  // Shadows
  shadow: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    glow: string;
    inner: string;
  };
  
  // Blur
  blur: {
    none: string;
    sm: string;
    md: string;
    lg: string;
  };
  
  // Transitions
  transition: {
    fast: string;
    normal: string;
    slow: string;
    spring: string;
  };
  
  // Opacity levels
  opacity: {
    muted: number;
    subtle: number;
    normal: number;
    full: number;
  };
}

// ─────────────────────────────────────────────────────
// SPATIAL (3D / Orbit)
// ─────────────────────────────────────────────────────

export interface Spatial {
  // Depth layers
  depth: {
    background: number;
    surface: number;
    overlay: number;
    modal: number;
    tooltip: number;
  };
  
  // Orbital characteristics
  orbit: {
    minRadius: number;
    maxRadius: number;
    layerGap: number;
    rotationSpeed: number;
  };
  
  // Node sizing
  nodeSize: {
    small: number;
    medium: number;
    large: number;
    trunk: number;
  };
  
  // Animation
  animation: {
    orbitDuration: string;
    pulseDuration: string;
    hoverScale: number;
    activeScale: number;
  };
}

// ─────────────────────────────────────────────────────
// THEME METADATA
// ─────────────────────────────────────────────────────

export interface ThemeMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  
  // Mood/atmosphere
  mood: 'dark' | 'light' | 'cosmic' | 'natural' | 'tech';
  
  // Visual style
  style: 'minimal' | 'ornate' | 'futuristic' | 'organic' | 'classic';
  
  // Era/time period (for visual coherence)
  era: 'ancient' | 'modern' | 'futuristic' | 'timeless';
}

// ─────────────────────────────────────────────────────
// COMPLETE THEME
// ─────────────────────────────────────────────────────

export interface Theme {
  metadata: ThemeMetadata;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borders: Borders;
  effects: Effects;
  spatial: Spatial;
  
  // Custom properties per theme
  custom?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────
// THEME CONTEXT
// ─────────────────────────────────────────────────────

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: string[];
}

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

export type ThemeId = 'base' | 'ancient' | 'futurist' | 'cosmic' | 'realistic';

export type PartialTheme = Partial<{
  [K in keyof Theme]: Partial<Theme[K]>;
}>;
