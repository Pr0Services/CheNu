/* =====================================================
   CHE·NU — Adaptive Container Component
   ui/containers/AdaptiveContainer.tsx
   
   PURE RENDERER
   This component applies resolved dimensions to children.
   It does NOT make decisions - it renders the law.
   ===================================================== */

import React, { useMemo, ReactNode } from 'react';
import { ResolvedDimension, UIMode } from '@/core/dimension/dimension.types';
import { getTheme } from '@/core/theme/themeEngine';

// ─────────────────────────────────────────────────────
// Props Interface
// ─────────────────────────────────────────────────────

interface AdaptiveContainerProps {
  dimension: ResolvedDimension;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  as?: keyof JSX.IntrinsicElements;
  testId?: string;
}

// ─────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────

export const AdaptiveContainer: React.FC<AdaptiveContainerProps> = ({
  dimension,
  children,
  className,
  onClick,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
  as: Component = 'div',
  testId,
}) => {
  const theme = getTheme();
  
  // Don't render if not visible (constitutional rule)
  if (!dimension.visible) {
    return null;
  }
  
  // Compute styles from resolved dimension
  const containerStyle = useMemo((): React.CSSProperties => {
    const { shape, color, glow, scale, opacity, animation, transition, growthAxis } = dimension;
    
    // Base styles from shape resolution
    const baseStyle: React.CSSProperties = {
      // Shape
      borderRadius: mapBorderRadius(shape.borderRadius, theme),
      aspectRatio: shape.aspectRatio.replace(':', '/'),
      boxShadow: mapShadow(shape.shadow, theme, glow),
      
      // Color
      background: color.gradient,
      
      // Transform
      transform: `scale(${scale})`,
      opacity,
      
      // Transition
      transition: `${transition.property} ${transition.duration}ms ${transition.easing} ${transition.delay}ms`,
      
      // Animation (if applicable)
      animation: animation.css,
      
      // Layout based on growth axis
      display: 'flex',
      flexDirection: mapFlexDirection(growthAxis.childFlow),
      overflow: mapOverflow(growthAxis.overflow),
      
      // Interactivity
      cursor: dimension.interactable ? 'pointer' : 'default',
      pointerEvents: dimension.interactable ? 'auto' : 'none',
      
      // Z-index
      zIndex: dimension.zIndex,
      
      // Position for absolute children
      position: 'relative',
    };
    
    return baseStyle;
  }, [dimension, theme]);
  
  // Glow overlay (rendered separately for better control)
  const glowStyle = useMemo((): React.CSSProperties | null => {
    if (!dimension.glow.enabled) return null;
    
    return {
      position: 'absolute',
      inset: -dimension.glow.blur / 2,
      borderRadius: 'inherit',
      background: `radial-gradient(circle, ${dimension.glow.color}${Math.round(dimension.glow.intensity * 100).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
      pointerEvents: 'none',
      zIndex: -1,
    };
  }, [dimension.glow]);
  
  // Content wrapper style based on UI mode
  const contentStyle = useMemo((): React.CSSProperties => {
    return mapUIModeToPadding(dimension.uiMode, theme);
  }, [dimension.uiMode, theme]);
  
  return (
    <Component
      style={containerStyle}
      className={className}
      onClick={dimension.interactable ? onClick : undefined}
      onDoubleClick={dimension.interactable ? onDoubleClick : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid={testId}
      data-dimension={dimension.dimension}
      data-activity={dimension.activityState}
      data-ui-mode={dimension.uiMode}
    >
      {/* Glow effect */}
      {glowStyle && <div style={glowStyle} aria-hidden="true" />}
      
      {/* Content */}
      <div style={contentStyle}>
        {children}
      </div>
    </Component>
  );
};

// ─────────────────────────────────────────────────────
// Mapping Functions (Constitutional interpreters)
// ─────────────────────────────────────────────────────

function mapBorderRadius(
  radius: string, 
  theme: ReturnType<typeof getTheme>
): string {
  const map: Record<string, string> = {
    none: theme.radius.none,
    sm: theme.radius.sm,
    md: theme.radius.md,
    lg: theme.radius.lg,
    xl: theme.radius.xl,
    full: theme.radius.full,
  };
  return map[radius] || theme.radius.md;
}

function mapShadow(
  shadow: string, 
  theme: ReturnType<typeof getTheme>,
  glow: ResolvedDimension['glow']
): string {
  const baseShadow: Record<string, string> = {
    none: theme.shadows.none,
    hard: theme.shadows.md,
    medium: theme.shadows.lg,
    diffuse: theme.shadows.xl,
  };
  
  const base = baseShadow[shadow] || theme.shadows.md;
  
  if (glow.enabled) {
    return `${base}, 0 0 ${glow.blur}px ${glow.color}`;
  }
  
  return base;
}

function mapFlexDirection(childFlow: string): React.CSSProperties['flexDirection'] {
  const map: Record<string, React.CSSProperties['flexDirection']> = {
    column: 'column',
    row: 'row',
    orbital: 'column', // Orbital uses absolute positioning
    layers: 'column',
  };
  return map[childFlow] || 'column';
}

function mapOverflow(overflow: string): React.CSSProperties['overflow'] {
  const map: Record<string, React.CSSProperties['overflow']> = {
    'scroll-x': 'auto',
    'scroll-y': 'auto',
    scale: 'visible',
    fade: 'hidden',
  };
  return map[overflow] || 'auto';
}

function mapUIModeToPadding(
  uiMode: UIMode, 
  theme: ReturnType<typeof getTheme>
): React.CSSProperties {
  const modes: Record<UIMode, React.CSSProperties> = {
    minimal: { 
      padding: theme.spacing.xs,
      gap: theme.spacing.xs,
    },
    compact: { 
      padding: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    standard: { 
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },
    expanded: { 
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
    },
    full: { 
      padding: theme.spacing.xl,
      gap: theme.spacing.xl,
    },
  };
  
  return {
    ...modes[uiMode],
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };
}

// ─────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────

export default AdaptiveContainer;
