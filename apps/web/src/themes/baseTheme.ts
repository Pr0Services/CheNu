/* =====================================================
   CHE·NU — Base Theme
   PHASE 7: Common tokens and base theme
   
   The base theme provides defaults that other themes
   extend. It also defines helper functions for theme
   creation and manipulation.
   ===================================================== */

import {
  Theme, ThemeMetadata, ColorPalette, Typography,
  Spacing, Borders, Effects, Spatial, PartialTheme,
} from './theme.types';

// ─────────────────────────────────────────────────────
// BASE METADATA
// ─────────────────────────────────────────────────────

const baseMetadata: ThemeMetadata = {
  id: 'base',
  name: 'CHE·NU Base',
  description: 'Default theme with balanced colors and modern aesthetics',
  version: '1.0.0',
  mood: 'dark',
  style: 'minimal',
  era: 'modern',
};

// ─────────────────────────────────────────────────────
// BASE COLORS
// ─────────────────────────────────────────────────────

const baseColors: ColorPalette = {
  // Core
  primary: '#6366f1',      // Indigo
  secondary: '#8b5cf6',    // Violet
  accent: '#ffd54f',       // Amber
  
  // Backgrounds
  background: '#0a0a0e',
  surface: '#1a1a1e',
  surfaceHover: '#252529',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Text
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  textInverse: '#000000',
  
  // Semantic
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // Spheres
  sphereColors: {
    business: '#2196f3',
    creative: '#9c27b0',
    personal: '#4caf50',
    scholar: '#ff9800',
  },
  
  // Agents
  agentColors: {
    orchestrator: '#9c27b0',
    analyst: '#2196f3',
    evaluator: '#ff9800',
    advisor: '#4caf50',
  },
  
  // Decisions
  decisionColors: {
    approve: '#4caf50',
    reject: '#f44336',
    pivot: '#2196f3',
    defer: '#9e9e9e',
    escalate: '#9c27b0',
  },
};

// ─────────────────────────────────────────────────────
// BASE TYPOGRAPHY
// ─────────────────────────────────────────────────────

const baseTypography: Typography = {
  fontFamily: {
    heading: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    body: '"Inter", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Monaco", monospace',
    display: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
};

// ─────────────────────────────────────────────────────
// BASE SPACING
// ─────────────────────────────────────────────────────

const baseSpacing: Spacing = {
  unit: 4,
  
  scale: {
    '0': '0',
    '1': '0.25rem',   // 4px
    '2': '0.5rem',    // 8px
    '3': '0.75rem',   // 12px
    '4': '1rem',      // 16px
    '5': '1.25rem',   // 20px
    '6': '1.5rem',    // 24px
    '8': '2rem',      // 32px
    '10': '2.5rem',   // 40px
    '12': '3rem',     // 48px
    '16': '4rem',     // 64px
    '20': '5rem',     // 80px
    '24': '6rem',     // 96px
  },
  
  containerPadding: '1.5rem',
  cardPadding: '1rem',
  sectionGap: '2rem',
  elementGap: '0.5rem',
};

// ─────────────────────────────────────────────────────
// BASE BORDERS
// ─────────────────────────────────────────────────────

const baseBorders: Borders = {
  width: {
    thin: '1px',
    normal: '2px',
    thick: '3px',
  },
  
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    full: '9999px',
  },
  
  style: {
    subtle: '1px solid rgba(255, 255, 255, 0.07)',
    normal: '1px solid rgba(255, 255, 255, 0.15)',
    accent: '2px solid #6366f1',
  },
};

// ─────────────────────────────────────────────────────
// BASE EFFECTS
// ─────────────────────────────────────────────────────

const baseEffects: Effects = {
  shadow: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.6)',
    glow: '0 0 20px rgba(99, 102, 241, 0.4)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  
  blur: {
    none: 'blur(0)',
    sm: 'blur(4px)',
    md: 'blur(8px)',
    lg: 'blur(16px)',
  },
  
  transition: {
    fast: '0.1s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
    spring: '0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  
  opacity: {
    muted: 0.3,
    subtle: 0.5,
    normal: 0.8,
    full: 1,
  },
};

// ─────────────────────────────────────────────────────
// BASE SPATIAL
// ─────────────────────────────────────────────────────

const baseSpatial: Spatial = {
  depth: {
    background: 0,
    surface: 10,
    overlay: 20,
    modal: 30,
    tooltip: 40,
  },
  
  orbit: {
    minRadius: 100,
    maxRadius: 400,
    layerGap: 60,
    rotationSpeed: 0.5,
  },
  
  nodeSize: {
    small: 32,
    medium: 48,
    large: 64,
    trunk: 120,
  },
  
  animation: {
    orbitDuration: '60s',
    pulseDuration: '2s',
    hoverScale: 1.1,
    activeScale: 1.2,
  },
};

// ─────────────────────────────────────────────────────
// COMPLETE BASE THEME
// ─────────────────────────────────────────────────────

export const baseTheme: Theme = {
  metadata: baseMetadata,
  colors: baseColors,
  typography: baseTypography,
  spacing: baseSpacing,
  borders: baseBorders,
  effects: baseEffects,
  spatial: baseSpatial,
};

// ─────────────────────────────────────────────────────
// THEME UTILITIES
// ─────────────────────────────────────────────────────

/**
 * Deep merge two objects.
 */
function deepMerge<T extends object>(base: T, override: Partial<T>): T {
  const result = { ...base };
  
  for (const key in override) {
    if (override.hasOwnProperty(key)) {
      const baseValue = result[key as keyof T];
      const overrideValue = override[key as keyof typeof override];
      
      if (
        typeof baseValue === 'object' &&
        baseValue !== null &&
        typeof overrideValue === 'object' &&
        overrideValue !== null &&
        !Array.isArray(baseValue)
      ) {
        (result as any)[key] = deepMerge(baseValue as object, overrideValue as object);
      } else if (overrideValue !== undefined) {
        (result as any)[key] = overrideValue;
      }
    }
  }
  
  return result;
}

/**
 * Create a theme by extending the base theme.
 */
export function createTheme(overrides: PartialTheme): Theme {
  return deepMerge(baseTheme, overrides as Partial<Theme>) as Theme;
}

/**
 * Apply alpha to a hex color.
 */
export function withAlpha(color: string, alpha: number): string {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

/**
 * Generate CSS variables from theme.
 */
export function themeToCSS(theme: Theme): string {
  const vars: string[] = [];
  
  // Colors
  vars.push(`--color-primary: ${theme.colors.primary};`);
  vars.push(`--color-secondary: ${theme.colors.secondary};`);
  vars.push(`--color-accent: ${theme.colors.accent};`);
  vars.push(`--color-background: ${theme.colors.background};`);
  vars.push(`--color-surface: ${theme.colors.surface};`);
  vars.push(`--color-text-primary: ${theme.colors.textPrimary};`);
  vars.push(`--color-text-secondary: ${theme.colors.textSecondary};`);
  vars.push(`--color-text-muted: ${theme.colors.textMuted};`);
  
  // Typography
  vars.push(`--font-heading: ${theme.typography.fontFamily.heading};`);
  vars.push(`--font-body: ${theme.typography.fontFamily.body};`);
  vars.push(`--font-mono: ${theme.typography.fontFamily.mono};`);
  
  // Spacing
  vars.push(`--spacing-unit: ${theme.spacing.unit}px;`);
  vars.push(`--spacing-container: ${theme.spacing.containerPadding};`);
  vars.push(`--spacing-card: ${theme.spacing.cardPadding};`);
  
  // Borders
  vars.push(`--radius-sm: ${theme.borders.radius.sm};`);
  vars.push(`--radius-md: ${theme.borders.radius.md};`);
  vars.push(`--radius-lg: ${theme.borders.radius.lg};`);
  
  // Effects
  vars.push(`--shadow-sm: ${theme.effects.shadow.sm};`);
  vars.push(`--shadow-md: ${theme.effects.shadow.md};`);
  vars.push(`--shadow-glow: ${theme.effects.shadow.glow};`);
  vars.push(`--transition-normal: ${theme.effects.transition.normal};`);
  
  return `:root {\n  ${vars.join('\n  ')}\n}`;
}

export default baseTheme;
