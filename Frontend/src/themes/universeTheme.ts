/* =====================================================
   CHE·NU — Universe Theme Resolver
   
   Resolves themes based on universe context:
   - Universe type determines base theme
   - Sphere can override with specific theme
   - Depth level can affect intensity
   
   Flow:
   User/Sphere/Universe → Theme Resolver → Theme Tokens → Components
   ===================================================== */

import { Theme, ThemeId } from './theme.types';
import { baseTheme } from './baseTheme';
import { ancientTheme } from './ancient.theme';
import { futuristTheme } from './futurist.theme';
import { cosmicTheme } from './cosmic.theme';
import { realisticTheme } from './realistic.theme';
import { createTheme, withAlpha } from './baseTheme';

// ─────────────────────────────────────────────────────
// UNIVERSE CONTEXT
// ─────────────────────────────────────────────────────

export type UniverseType = 'realistic' | 'ancient' | 'futurist' | 'cosmic';

export interface UniverseContext {
  universeId: string;
  universeType: UniverseType;
  activeSphereId?: string;
  depthLevel: number;  // 0 = overview, 1-5 = zoom levels
  
  // Optional overrides
  userThemePreference?: ThemeId;
  sphereThemeOverride?: ThemeId;
}

// ─────────────────────────────────────────────────────
// SPHERE → THEME MAPPINGS
// ─────────────────────────────────────────────────────

/**
 * Some spheres have explicit theme associations.
 * These override the universe theme when active.
 */
const SPHERE_THEME_MAP: Record<string, ThemeId> = {
  // Business spheres
  'institutions': 'ancient',
  'corporate': 'realistic',
  'finance': 'realistic',
  'legal': 'ancient',
  
  // Creative spheres
  'art': 'cosmic',
  'music': 'cosmic',
  'design': 'futurist',
  'media': 'futurist',
  
  // Personal spheres
  'wellness': 'cosmic',
  'home': 'realistic',
  'family': 'realistic',
  
  // Scholar spheres
  'research': 'ancient',
  'science': 'futurist',
  'history': 'ancient',
  'technology': 'futurist',
};

// ─────────────────────────────────────────────────────
// UNIVERSE → THEME MAPPINGS
// ─────────────────────────────────────────────────────

const UNIVERSE_THEME_MAP: Record<UniverseType, Theme> = {
  realistic: realisticTheme,
  ancient: ancientTheme,
  futurist: futuristTheme,
  cosmic: cosmicTheme,
};

// ─────────────────────────────────────────────────────
// THEME RESOLVER
// ─────────────────────────────────────────────────────

/**
 * Resolve theme for a given universe context.
 * 
 * Priority:
 * 1. User preference (if set)
 * 2. Sphere theme override (if set)
 * 3. Sphere implicit mapping (from SPHERE_THEME_MAP)
 * 4. Universe type theme
 * 5. Base theme (fallback)
 */
export function resolveThemeForUniverse(
  context: UniverseContext
): Theme {
  const { universeType, activeSphereId, userThemePreference, sphereThemeOverride } = context;
  
  // Priority 1: User preference
  if (userThemePreference && UNIVERSE_THEME_MAP[userThemePreference as UniverseType]) {
    return UNIVERSE_THEME_MAP[userThemePreference as UniverseType];
  }
  
  // Priority 2: Explicit sphere override
  if (sphereThemeOverride && UNIVERSE_THEME_MAP[sphereThemeOverride as UniverseType]) {
    return UNIVERSE_THEME_MAP[sphereThemeOverride as UniverseType];
  }
  
  // Priority 3: Implicit sphere mapping
  if (activeSphereId) {
    const sphereThemeId = SPHERE_THEME_MAP[activeSphereId];
    if (sphereThemeId && UNIVERSE_THEME_MAP[sphereThemeId as UniverseType]) {
      return UNIVERSE_THEME_MAP[sphereThemeId as UniverseType];
    }
  }
  
  // Priority 4: Universe type
  if (UNIVERSE_THEME_MAP[universeType]) {
    return UNIVERSE_THEME_MAP[universeType];
  }
  
  // Priority 5: Fallback
  return baseTheme;
}

/**
 * Simplified resolver for when you just have universe type and sphere.
 */
export function resolveTheme(
  universeType: UniverseType,
  sphereId?: string
): Theme {
  return resolveThemeForUniverse({
    universeId: 'default',
    universeType,
    activeSphereId: sphereId,
    depthLevel: 0,
  });
}

// ─────────────────────────────────────────────────────
// DEPTH-BASED ADJUSTMENTS
// ─────────────────────────────────────────────────────

/**
 * Adjust theme intensity based on depth level.
 * Deeper levels get more focused/intense colors.
 */
export function adjustThemeForDepth(theme: Theme, depthLevel: number): Theme {
  if (depthLevel <= 0) return theme;
  
  // Calculate intensity multiplier (1.0 at depth 0, up to 1.5 at depth 5)
  const intensity = 1 + (Math.min(depthLevel, 5) * 0.1);
  
  // Adjust opacity and glow effects
  const adjustedEffects = {
    ...theme.effects,
    opacity: {
      muted: Math.min(theme.effects.opacity.muted * intensity, 0.5),
      subtle: Math.min(theme.effects.opacity.subtle * intensity, 0.7),
      normal: Math.min(theme.effects.opacity.normal * intensity, 0.95),
      full: 1,
    },
  };
  
  // Adjust spatial characteristics for depth
  const adjustedSpatial = {
    ...theme.spatial,
    orbit: {
      ...theme.spatial.orbit,
      minRadius: theme.spatial.orbit.minRadius * (1 - depthLevel * 0.1),
      maxRadius: theme.spatial.orbit.maxRadius * (1 - depthLevel * 0.05),
    },
    nodeSize: {
      small: theme.spatial.nodeSize.small * (1 + depthLevel * 0.1),
      medium: theme.spatial.nodeSize.medium * (1 + depthLevel * 0.1),
      large: theme.spatial.nodeSize.large * (1 + depthLevel * 0.1),
      trunk: theme.spatial.nodeSize.trunk * (1 + depthLevel * 0.05),
    },
  };
  
  return {
    ...theme,
    effects: adjustedEffects,
    spatial: adjustedSpatial,
  };
}

// ─────────────────────────────────────────────────────
// SPHERE COLOR RESOLVER
// ─────────────────────────────────────────────────────

/**
 * Get the color for a specific sphere within the current theme.
 */
export function getSphereColor(theme: Theme, sphereId: string): string {
  // Check sphere colors in theme
  const sphereKey = sphereId as keyof typeof theme.colors.sphereColors;
  if (theme.colors.sphereColors[sphereKey]) {
    return theme.colors.sphereColors[sphereKey];
  }
  
  // Fallback to primary
  return theme.colors.primary;
}

/**
 * Get sphere color with optional alpha.
 */
export function getSphereColorWithAlpha(
  theme: Theme,
  sphereId: string,
  alpha: number
): string {
  const color = getSphereColor(theme, sphereId);
  return withAlpha(color, alpha);
}

// ─────────────────────────────────────────────────────
// TRANSITION HELPERS
// ─────────────────────────────────────────────────────

/**
 * Calculate transition properties when moving between universes.
 */
export interface ThemeTransition {
  from: Theme;
  to: Theme;
  duration: number;
  easing: string;
}

export function calculateThemeTransition(
  fromContext: UniverseContext,
  toContext: UniverseContext
): ThemeTransition {
  const fromTheme = resolveThemeForUniverse(fromContext);
  const toTheme = resolveThemeForUniverse(toContext);
  
  // Longer transitions for bigger changes
  const isSameType = fromContext.universeType === toContext.universeType;
  const isDepthChange = fromContext.depthLevel !== toContext.depthLevel;
  
  let duration = 300; // base
  if (!isSameType) duration = 600; // universe change
  if (isDepthChange) duration = Math.min(duration, 400);
  
  return {
    from: fromTheme,
    to: toTheme,
    duration,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export const universeThemes = {
  realistic: realisticTheme,
  ancient: ancientTheme,
  futurist: futuristTheme,
  cosmic: cosmicTheme,
};

export default {
  resolve: resolveThemeForUniverse,
  resolveSimple: resolveTheme,
  adjustForDepth: adjustThemeForDepth,
  getSphereColor,
  getSphereColorWithAlpha,
  calculateTransition: calculateThemeTransition,
  themes: universeThemes,
  sphereMap: SPHERE_THEME_MAP,
};
