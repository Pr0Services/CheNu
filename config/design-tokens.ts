/**
 * CHE·NU Design System — TypeScript Tokens
 * Version: 1.0-canonical
 * 
 * Import: import { COLORS, SPHERES, TYPOGRAPHY } from '@chenu/config/tokens';
 */

// ============================================================
// COLOR PALETTE
// ============================================================

export const COLORS = {
  // Base
  background: '#0A0B0D',
  backgroundDark: '#050507',
  surface: '#1A1C20',
  elevated: '#22252B',
  stroke: '#2C2F33',
  strokeLight: 'rgba(255, 255, 255, 0.05)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#C8C8C8',
  textMuted: '#888888',
  textDisabled: '#555555',

  // Semantic
  info: '#5BA9FF',
  success: '#6FE8A3',
  warning: '#FFBE55',
  error: '#FF5A5A',

  // White shades
  white: '#FFFFFF',
  white80: 'rgba(255, 255, 255, 0.8)',
  white60: 'rgba(255, 255, 255, 0.6)',
  white40: 'rgba(255, 255, 255, 0.4)',
  white20: 'rgba(255, 255, 255, 0.2)',
  white10: 'rgba(255, 255, 255, 0.1)',
  white05: 'rgba(255, 255, 255, 0.05)',
} as const;

// ============================================================
// SPHERES
// ============================================================

export const SPHERES = {
  personal: {
    id: 'personal',
    name: 'Personal',
    nameFr: 'Personnel',
    color: '#76E6C7',
    icon: 'heart',
  },
  business: {
    id: 'business',
    name: 'Business',
    nameFr: 'Affaires',
    color: '#5BA9FF',
    icon: 'briefcase',
  },
  scholar: {
    id: 'scholar',
    name: 'Scholar',
    nameFr: 'Académique',
    color: '#E0C46B',
    icon: 'book',
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    nameFr: 'Créatif',
    color: '#FF8BAA',
    icon: 'palette',
  },
  social: {
    id: 'social',
    name: 'Social',
    nameFr: 'Social',
    color: '#66D06F',
    icon: 'users',
  },
  institutions: {
    id: 'institutions',
    name: 'Institutions',
    nameFr: 'Institutions',
    color: '#D08FFF',
    icon: 'building',
  },
  methodology: {
    id: 'methodology',
    name: 'Methodology',
    nameFr: 'Méthodologie',
    color: '#59D0C6',
    icon: 'compass',
  },
  xr: {
    id: 'xr',
    name: 'XR',
    nameFr: 'XR',
    color: '#8EC8FF',
    icon: 'cube',
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    nameFr: 'Divertissement',
    color: '#FFB04D',
    icon: 'star',
  },
  aiLab: {
    id: 'ai-lab',
    name: 'AI Lab',
    nameFr: 'Labo IA',
    color: '#FF5FFF',
    icon: 'cpu',
  },
  myTeam: {
    id: 'my-team',
    name: 'My Team',
    nameFr: 'Mon Équipe',
    color: '#5ED8FF',
    icon: 'users-group',
  },
} as const;

export type SphereId = keyof typeof SPHERES;

export const SPHERE_COLORS: Record<SphereId, string> = {
  personal: '#76E6C7',
  business: '#5BA9FF',
  scholar: '#E0C46B',
  creative: '#FF8BAA',
  social: '#66D06F',
  institutions: '#D08FFF',
  methodology: '#59D0C6',
  xr: '#8EC8FF',
  entertainment: '#FFB04D',
  aiLab: '#FF5FFF',
  myTeam: '#5ED8FF',
};

// ============================================================
// AGENTS
// ============================================================

export const AGENTS = {
  nova: {
    id: 'nova',
    name: 'NOVA',
    role: 'Universal Assistant',
    color: '#FFFFFF',
    level: 'L0',
  },
  architectSigma: {
    id: 'architect-sigma',
    name: 'Architect Σ',
    role: 'Information Architect',
    color: '#5BA9FF',
    level: 'L0',
  },
  threadWeaver: {
    id: 'thread-weaver',
    name: 'Thread Weaver',
    role: 'Knowledge Linker',
    color: '#FF5FFF',
    level: 'L0',
  },
  memoryManager: {
    id: 'memory-manager',
    name: 'Memory Manager',
    role: 'Memory Operations',
    color: '#E0C46B',
    level: 'L0',
  },
  ethicsGuard: {
    id: 'ethics-guard',
    name: 'Ethics Guard',
    role: 'Ethical Oversight',
    color: '#FF4444',
    level: 'L0',
  },
  driftDetector: {
    id: 'drift-detector',
    name: 'Drift Detector',
    role: 'Coherence Monitor',
    color: '#FFAA33',
    level: 'L0',
  },
} as const;

export type AgentId = keyof typeof AGENTS;

// ============================================================
// TYPOGRAPHY
// ============================================================

export const TYPOGRAPHY = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  
  sizes: {
    h1: 32,
    h2: 24,
    h3: 18,
    body: 15,
    small: 13,
    xs: 11,
  },
  
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ============================================================
// SPACING
// ============================================================

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export type SpacingKey = keyof typeof SPACING;

// ============================================================
// BORDER RADIUS
// ============================================================

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// ============================================================
// SHADOWS
// ============================================================

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 4px rgba(0, 0, 0, 0.25)',
  md: '0 4px 12px rgba(0, 0, 0, 0.35)',
  lg: '0 8px 22px rgba(0, 0, 0, 0.45)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.55)',
  
  glowBlue: '0 0 20px rgba(91, 169, 255, 0.4)',
  glowWhite: '0 0 20px rgba(255, 255, 255, 0.3)',
  
  // Sphere glow generator
  sphereGlow: (color: string, intensity = 0.4) => 
    `0 0 20px ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`,
} as const;

// ============================================================
// TRANSITIONS
// ============================================================

export const TRANSITIONS = {
  easing: {
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  duration: {
    instant: 0,
    fast: 120,
    medium: 240,
    slow: 450,
  },
  
  // Helper function
  create: (duration: keyof typeof TRANSITIONS.duration = 'medium', easing: keyof typeof TRANSITIONS.easing = 'easeOut') =>
    `all ${TRANSITIONS.duration[duration]}ms ${TRANSITIONS.easing[easing]}`,
} as const;

// ============================================================
// Z-INDEX LAYERS
// ============================================================

export const Z_INDEX = {
  background: 0,
  content: 10,
  navigation: 100,
  panel: 200,
  modal: 300,
  overlay: 400,
  tooltip: 500,
  nova: 600,
} as const;

// ============================================================
// GRID
// ============================================================

export const GRID = {
  desktop: {
    columns: 12,
    margin: 24,
    gutter: 16,
    maxWidth: 1440,
  },
  tablet: {
    columns: 8,
    margin: 20,
    gutter: 14,
    maxWidth: 1024,
  },
  mobile: {
    columns: 4,
    margin: 16,
    gutter: 12,
    maxWidth: 480,
  },
} as const;

// ============================================================
// COMPONENT SIZES
// ============================================================

export const COMPONENT_SIZES = {
  topbarHeight: 64,
  sidebarWidth: 280,
  sidebarCollapsed: 64,
  panelWidth: 380,
  novaPanelWidth: 420,
  architectPanelWidth: 480,
  
  button: {
    sm: { height: 32, padding: '6px 12px', fontSize: 13 },
    md: { height: 40, padding: '8px 16px', fontSize: 15 },
    lg: { height: 48, padding: '12px 24px', fontSize: 16 },
  },
  
  input: {
    sm: { height: 32, padding: '6px 10px' },
    md: { height: 40, padding: '8px 12px' },
    lg: { height: 48, padding: '12px 16px' },
  },
  
  avatar: {
    sm: 24,
    md: 36,
    lg: 48,
    xl: 64,
    xxl: 96,
  },
  
  orb: {
    agent: 36,
    sphere: 64,
    user: 72,
  },
} as const;

// ============================================================
// BREAKPOINTS
// ============================================================

export const BREAKPOINTS = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1440,
} as const;

export const MEDIA_QUERIES = {
  mobile: `@media (max-width: ${BREAKPOINTS.sm - 1}px)`,
  tablet: `@media (min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktop: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  largeDesktop: `@media (min-width: ${BREAKPOINTS.xl}px)`,
} as const;

// ============================================================
// XR SPECIFIC
// ============================================================

export const XR = {
  materials: {
    hologram: {
      baseColor: '#8EC8FF',
      transmission: 0.75,
      fresnel: 0.4,
      scanlineIntensity: 0.1,
    },
    portal: {
      entry: { color: '#8EC8FF', shape: 'circle' },
      replay: { color: '#FF5FFF', shape: 'ellipse' },
      branch: { color: '#FFB04D', shape: 'diamond' },
    },
  },
  
  avatarStates: {
    idle: { glowIntensity: 0.3, pulseSpeed: 'slow' },
    active: { glowIntensity: 0.5, pulseSpeed: 'medium' },
    speaking: { glowIntensity: 0.8, pulseSpeed: 'fast' },
  },
  
  roomTypes: [
    'decision',
    'collaboration',
    'presentation',
    'brainstorm',
    'review',
    'negotiation',
  ],
} as const;

// ============================================================
// SHORTCUTS
// ============================================================

export const SHORTCUTS = {
  global: {
    commandPalette: ['Ctrl+K', '⌘+K'],
    search: ['Ctrl+F', '⌘+F'],
    home: ['H'],
    toggleTheme: ['T'],
    summonNova: ['Space'],
  },
  workspace: {
    newItem: ['N'],
    newMemory: ['M'],
    archiveItem: ['E'],
  },
  navigation: {
    moveUp: ['ArrowUp'],
    moveDown: ['ArrowDown'],
    moveLeft: ['ArrowLeft'],
    moveRight: ['ArrowRight'],
    enter: ['Enter'],
    back: ['Escape', 'Backspace'],
  },
  timeline: {
    replay: ['R'],
    nextEvent: [']'],
    prevEvent: ['['],
    playPause: ['Space'],
  },
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get sphere color by ID
 */
export function getSphereColor(sphereId: SphereId): string {
  return SPHERES[sphereId]?.color ?? COLORS.info;
}

/**
 * Get agent color by ID
 */
export function getAgentColor(agentId: AgentId): string {
  return AGENTS[agentId]?.color ?? COLORS.white;
}

/**
 * Create sphere-themed styles
 */
export function createSphereTheme(sphereId: SphereId) {
  const color = getSphereColor(sphereId);
  return {
    primary: color,
    headerBg: `${color}26`, // 15% opacity
    accentLine: `${color}66`, // 40% opacity
    cardBorder: `${color}26`, // 15% opacity
    glow: `0 0 20px ${color}4D`, // 30% opacity
  };
}

/**
 * Create transition string
 */
export function createTransition(
  properties: string | string[] = 'all',
  duration: keyof typeof TRANSITIONS.duration = 'medium',
  easing: keyof typeof TRANSITIONS.easing = 'easeOut'
): string {
  const props = Array.isArray(properties) ? properties : [properties];
  const dur = TRANSITIONS.duration[duration];
  const ease = TRANSITIONS.easing[easing];
  return props.map(p => `${p} ${dur}ms ${ease}`).join(', ');
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  COLORS,
  SPHERES,
  SPHERE_COLORS,
  AGENTS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  SHADOWS,
  TRANSITIONS,
  Z_INDEX,
  GRID,
  COMPONENT_SIZES,
  BREAKPOINTS,
  MEDIA_QUERIES,
  XR,
  SHORTCUTS,
  getSphereColor,
  getAgentColor,
  createSphereTheme,
  createTransition,
};
