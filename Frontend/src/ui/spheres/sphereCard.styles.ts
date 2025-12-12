/* =====================================================
   CHE·NU — Sphere Card Styles
   ui/spheres/sphereCard.styles.ts
   ===================================================== */

import { CSSProperties } from 'react';
import { DimensionClass, DIMENSION_CONFIGS } from './sphereCard.types';
import { getTheme } from '@/core/theme/themeEngine';

// ─────────────────────────────────────────────────────
// Card Base Styles
// ─────────────────────────────────────────────────────

export function getCardStyle(
  dimensionClass: DimensionClass,
  normalizedDimension: number,
  color?: string
): CSSProperties {
  const theme = getTheme();
  const config = DIMENSION_CONFIGS[dimensionClass];
  const size = config.minSize + (config.maxSize - config.minSize) * normalizedDimension;
  
  return {
    width: size,
    height: size,
    padding: config.cardPadding,
    borderRadius: theme.radius.lg,
    background: `linear-gradient(135deg, ${color || theme.colors.surface} 0%, ${adjustColor(color || theme.colors.surface, -15)} 100%)`,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.lg,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: `all ${theme.animation.durationNormal} ${theme.animation.easingDefault}`,
    position: 'relative',
    overflow: 'hidden',
  };
}

// ─────────────────────────────────────────────────────
// Card State Styles
// ─────────────────────────────────────────────────────

export function getCardHoverStyle(): CSSProperties {
  const theme = getTheme();
  return {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows.xl,
    borderColor: theme.colors.primary,
  };
}

export function getCardFocusedStyle(color?: string): CSSProperties {
  const theme = getTheme();
  return {
    transform: 'scale(1.1)',
    boxShadow: `0 0 30px ${color || theme.colors.primary}40`,
    borderColor: color || theme.colors.primary,
    zIndex: 10,
  };
}

export function getCardLockedStyle(): CSSProperties {
  return {
    opacity: 0.5,
    filter: 'grayscale(50%)',
    cursor: 'not-allowed',
  };
}

// ─────────────────────────────────────────────────────
// Card Content Styles
// ─────────────────────────────────────────────────────

export function getCardHeaderStyle(): CSSProperties {
  const theme = getTheme();
  return {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };
}

export function getCardIconStyle(color?: string): CSSProperties {
  const theme = getTheme();
  return {
    fontSize: theme.fontSize2xl,
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    background: `${color || theme.colors.primary}20`,
  };
}

export function getCardTitleStyle(): CSSProperties {
  const theme = getTheme();
  return {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSizeMd,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.text,
    margin: 0,
    lineHeight: theme.typography.lineHeightTight,
  };
}

export function getCardSubtitleStyle(): CSSProperties {
  const theme = getTheme();
  return {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSizeXs,
    color: theme.colors.textMuted,
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };
}

// ─────────────────────────────────────────────────────
// Card Indicator Styles
// ─────────────────────────────────────────────────────

export function getIndicatorContainerStyle(): CSSProperties {
  const theme = getTheme();
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
  };
}

export function getIndicatorStyle(): CSSProperties {
  const theme = getTheme();
  return {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: theme.typography.fontSizeXs,
    color: theme.colors.textSecondary,
  };
}

export function getIndicatorValueStyle(trend?: 'up' | 'down' | 'stable'): CSSProperties {
  const theme = getTheme();
  let color = theme.colors.text;
  
  if (trend === 'up') color = theme.colors.success;
  if (trend === 'down') color = theme.colors.error;
  
  return {
    fontWeight: theme.typography.fontWeightMedium,
    color,
  };
}

// ─────────────────────────────────────────────────────
// Card Glow Effect
// ─────────────────────────────────────────────────────

export function getCardGlowStyle(color: string, intensity: number = 0.3): CSSProperties {
  return {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle, ${color}${Math.round(intensity * 255).toString(16)} 0%, transparent 70%)`,
    pointerEvents: 'none',
    opacity: 0.5,
  };
}

// ─────────────────────────────────────────────────────
// Dimension-Specific Styles
// ─────────────────────────────────────────────────────

export function getStylesForDimension(dim: DimensionClass) {
  const config = DIMENSION_CONFIGS[dim];
  const theme = getTheme();
  
  return {
    showTitle: true,
    showSubtitle: dim !== 'XS',
    showIcon: dim !== 'XS',
    showIndicators: config.showIndicators,
    showAgents: config.showAgents,
    titleSize: dim === 'XS' ? theme.typography.fontSizeXs : 
               dim === 'S' ? theme.typography.fontSizeSm : 
               theme.typography.fontSizeMd,
    iconSize: dim === 'XS' ? 20 : dim === 'S' ? 28 : 36,
    maxIndicators: dim === 'L' ? 3 : dim === 'XL' ? 5 : 2,
  };
}

// ─────────────────────────────────────────────────────
// Utility: Adjust Color Brightness
// ─────────────────────────────────────────────────────

function adjustColor(color: string, percent: number): string {
  // Simple hex color adjustment
  if (!color.startsWith('#')) return color;
  
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

// ─────────────────────────────────────────────────────
// Export All Styles Object (for easy access)
// ─────────────────────────────────────────────────────

export const sphereCardStyles = {
  getCardStyle,
  getCardHoverStyle,
  getCardFocusedStyle,
  getCardLockedStyle,
  getCardHeaderStyle,
  getCardIconStyle,
  getCardTitleStyle,
  getCardSubtitleStyle,
  getIndicatorContainerStyle,
  getIndicatorStyle,
  getIndicatorValueStyle,
  getCardGlowStyle,
  getStylesForDimension,
};