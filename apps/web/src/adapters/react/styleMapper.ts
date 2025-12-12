/* =====================================================
   CHE·NU — Style Mapper
   
   PHASE 2: DIMENSION → CSS
   
   Converts ResolvedDimension into renderer-specific styles.
   This is the ONLY place where CSS values are generated.
   
   Rules still come from JSON themes — this just maps
   dimension values to CSS properties.
   ===================================================== */

import { ResolvedDimension, MotionType, DensityLevel } from '../../core-reference/resolver/types';

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export interface MappedStyles {
  container: React.CSSProperties;
  animation: string;
  transition: string;
  className: string;
}

export interface ThemeTokens {
  colors: {
    background: string;
    surface: string;
    border: string;
    text: string;
    primary: string;
    secondary: string;
  };
  spacing: {
    unit: number;
    scale: Record<string, number>;
  };
  radius: Record<string, string>;
  shadows: Record<string, string>;
  animations: {
    durations: Record<string, number>;
    easings: Record<string, string>;
  };
}

// ─────────────────────────────────────────────────────
// DEFAULT THEME TOKENS (loaded from JSON in production)
// ─────────────────────────────────────────────────────

const DEFAULT_TOKENS: ThemeTokens = {
  colors: {
    background: '#0A0E0A',
    surface: '#121812',
    border: '#2A3A2A',
    text: '#E8F0E8',
    primary: '#4A7C4A',
    secondary: '#D8B26A',
  },
  spacing: {
    unit: 4,
    scale: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  },
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
  },
  animations: {
    durations: { fast: 150, normal: 300, slow: 500 },
    easings: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};

// ─────────────────────────────────────────────────────
// MAIN MAPPER FUNCTION
// ─────────────────────────────────────────────────────

/**
 * Maps a ResolvedDimension to CSS styles.
 * 
 * @param dimension - Output from dimensionResolver
 * @param tokens - Theme tokens (optional, uses defaults)
 * @returns MappedStyles ready for React components
 */
export function mapDimensionToStyles(
  dimension: ResolvedDimension,
  tokens: ThemeTokens = DEFAULT_TOKENS
): MappedStyles {
  const container = mapContainerStyles(dimension, tokens);
  const animation = mapAnimation(dimension.motion.type, dimension.motion.intensity);
  const transition = mapTransition(tokens);
  const className = buildClassName(dimension);
  
  return {
    container,
    animation,
    transition,
    className,
  };
}

// ─────────────────────────────────────────────────────
// CONTAINER STYLES
// ─────────────────────────────────────────────────────

function mapContainerStyles(
  dimension: ResolvedDimension,
  tokens: ThemeTokens
): React.CSSProperties {
  const spacing = mapDensityToSpacing(dimension.density.level, tokens);
  
  return {
    // Transform
    transform: `scale(${dimension.scale})`,
    opacity: dimension.visibility,
    
    // Visibility
    display: dimension.visible ? 'flex' : 'none',
    pointerEvents: dimension.interactable ? 'auto' : 'none',
    
    // Spacing (from density)
    padding: spacing,
    gap: spacing,
    
    // Layout
    flexDirection: 'column',
    position: 'relative',
    
    // Interaction hint
    cursor: dimension.interactable ? 'pointer' : 'default',
    
    // Prevent layout shift during scale
    transformOrigin: 'center center',
    willChange: dimension.motion.type !== 'none' ? 'transform, opacity' : 'auto',
  };
}

// ─────────────────────────────────────────────────────
// DENSITY → SPACING
// ─────────────────────────────────────────────────────

function mapDensityToSpacing(level: DensityLevel, tokens: ThemeTokens): string {
  const spacingMap: Record<DensityLevel, keyof typeof tokens.spacing.scale> = {
    minimal: 'xs',
    compact: 'sm',
    standard: 'md',
    expanded: 'lg',
    full: 'xl',
  };
  
  const key = spacingMap[level] || 'md';
  const value = tokens.spacing.scale[key] || 16;
  
  return `${value}px`;
}

// ─────────────────────────────────────────────────────
// ANIMATION MAPPING
// ─────────────────────────────────────────────────────

/**
 * Maps motion type to CSS animation string.
 * Animations are defined in global CSS (injected separately).
 */
function mapAnimation(type: MotionType, intensity: number): string {
  if (type === 'none' || intensity === 0) {
    return 'none';
  }
  
  const animationMap: Record<MotionType, string> = {
    none: 'none',
    subtle: 'chenu-breathe',
    moderate: 'chenu-pulse',
    urgent: 'chenu-alert',
  };
  
  const animationName = animationMap[type] || 'none';
  
  if (animationName === 'none') return 'none';
  
  // Duration inversely proportional to intensity (faster = more urgent)
  const baseDuration = type === 'urgent' ? 500 : type === 'moderate' ? 2000 : 4000;
  const duration = baseDuration / Math.max(0.5, intensity);
  
  return `${animationName} ${duration}ms ease-in-out infinite`;
}

// ─────────────────────────────────────────────────────
// TRANSITION MAPPING
// ─────────────────────────────────────────────────────

function mapTransition(tokens: ThemeTokens): string {
  const duration = tokens.animations.durations.normal || 300;
  const easing = tokens.animations.easings.default || 'ease';
  
  return `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
}

// ─────────────────────────────────────────────────────
// CLASS NAME BUILDER
// ─────────────────────────────────────────────────────

/**
 * Builds semantic class names for styling hooks.
 * These can be used with CSS modules or utility frameworks.
 */
function buildClassName(dimension: ResolvedDimension): string {
  const classes: string[] = ['chenu-dimension'];
  
  // Activity state
  classes.push(`chenu-activity-${dimension.activityState}`);
  
  // Content level
  classes.push(`chenu-content-${dimension.contentLevel}`);
  
  // Density
  classes.push(`chenu-density-${dimension.density.level}`);
  
  // Interactivity
  if (dimension.interactable) {
    classes.push('chenu-interactable');
  }
  
  // Motion
  if (dimension.motion.type !== 'none') {
    classes.push(`chenu-motion-${dimension.motion.type}`);
  }
  
  return classes.join(' ');
}

// ─────────────────────────────────────────────────────
// CSS KEYFRAMES INJECTION
// ─────────────────────────────────────────────────────

let keyframesInjected = false;

/**
 * Injects animation keyframes into the document.
 * Call once at app initialization.
 */
export function injectKeyframes(): void {
  if (typeof document === 'undefined' || keyframesInjected) return;
  
  const style = document.createElement('style');
  style.id = 'chenu-keyframes';
  style.textContent = `
    @keyframes chenu-breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    
    @keyframes chenu-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.9; }
    }
    
    @keyframes chenu-alert {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(239, 83, 80, 0); }
      50% { transform: scale(1.03); box-shadow: 0 0 20px rgba(239, 83, 80, 0.5); }
    }
    
    @keyframes chenu-glow {
      0%, 100% { box-shadow: 0 0 10px currentColor; }
      50% { box-shadow: 0 0 25px currentColor; }
    }
  `;
  
  document.head.appendChild(style);
  keyframesInjected = true;
}

// ─────────────────────────────────────────────────────
// DETAIL LEVEL HELPERS
// ─────────────────────────────────────────────────────

/**
 * Determines which UI elements to show based on detail level.
 */
export function shouldShowDetail(
  detailLevel: number,
  requiredLevel: number
): boolean {
  return detailLevel >= requiredLevel;
}

/**
 * Maps density to detail configuration.
 */
export function getDetailConfig(density: DensityLevel): {
  showIcon: boolean;
  showTitle: boolean;
  showDescription: boolean;
  showMetrics: boolean;
  showAgents: boolean;
  showActions: boolean;
} {
  const level = {
    minimal: 1,
    compact: 2,
    standard: 3,
    expanded: 4,
    full: 5,
  }[density] || 3;
  
  return {
    showIcon: level >= 1,
    showTitle: level >= 1,
    showDescription: level >= 2,
    showMetrics: level >= 3,
    showAgents: level >= 4,
    showActions: level >= 4,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
  mapDimensionToStyles,
  injectKeyframes,
  shouldShowDetail,
  getDetailConfig,
};
