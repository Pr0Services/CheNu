import React from 'react';
import { colors, radius, shadows, transitions, space } from '../design-system/tokens';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — UI KIT: CARDS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Variants: default, elevated, outlined, gold
 * 
 * Usage:
 *   <Card>Content</Card>
 *   <Card variant="elevated" padding="lg">Content</Card>
 *   <Card variant="gold" hoverable>Premium Content</Card>
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// CARD STYLES
// ─────────────────────────────────────────────────────────────────────────────

const variants = {
  default: {
    background: colors.background.secondary,
    border: `1px solid ${colors.border.default}`,
    shadow: 'none',
    hoverShadow: shadows.card,
  },
  elevated: {
    background: colors.background.secondary,
    border: 'none',
    shadow: shadows.card,
    hoverShadow: shadows.lg,
  },
  outlined: {
    background: 'transparent',
    border: `1px solid ${colors.border.strong}`,
    shadow: 'none',
    hoverShadow: shadows.sm,
  },
  gold: {
    background: `linear-gradient(135deg, ${colors.background.secondary} 0%, rgba(216, 178, 106, 0.05) 100%)`,
    border: `1px solid ${colors.border.gold}`,
    shadow: shadows.gold,
    hoverShadow: shadows.goldGlow,
  },
  glass: {
    background: 'rgba(26, 26, 26, 0.8)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${colors.border.subtle}`,
    shadow: 'none',
    hoverShadow: shadows.md,
  },
};

const paddings = {
  none: '0',
  sm: space.sm,
  md: space.md,
  lg: space.lg,
  xl: space.xl,
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  fullHeight = false,
  className,
  style,
  onClick,
  ...props
}) {
  const v = variants[variant] || variants.default;
  const [isHovered, setIsHovered] = React.useState(false);
  
  const isInteractive = hoverable || clickable || onClick;

  const baseStyle = {
    background: v.background,
    border: v.border,
    borderRadius: radius.lg,
    padding: paddings[padding],
    boxShadow: isHovered && isInteractive ? v.hoverShadow : v.shadow,
    backdropFilter: v.backdropFilter,
    
    height: fullHeight ? '100%' : 'auto',
    cursor: clickable || onClick ? 'pointer' : 'default',
    transition: transitions.all,
    transform: isHovered && isInteractive ? 'translateY(-2px)' : 'none',
    
    ...style,
  };

  return (
    <div
      className={className}
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD HEADER
// ─────────────────────────────────────────────────────────────────────────────

export function CardHeader({ 
  title, 
  subtitle, 
  icon, 
  action,
  style,
  ...props 
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: space.md,
        marginBottom: space.md,
        ...style,
      }}
      {...props}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
        {icon && (
          <span style={{ 
            fontSize: '24px',
            color: colors.sacredGold,
          }}>
            {icon}
          </span>
        )}
        <div>
          {title && (
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
              color: colors.text.primary,
            }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{
              margin: '4px 0 0',
              fontSize: '13px',
              color: colors.text.secondary,
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD BODY
// ─────────────────────────────────────────────────────────────────────────────

export function CardBody({ children, style, ...props }) {
  return (
    <div style={{ ...style }} {...props}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD FOOTER
// ─────────────────────────────────────────────────────────────────────────────

export function CardFooter({ children, align = 'right', style, ...props }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'right' ? 'flex-end' : 
                       align === 'center' ? 'center' : 
                       align === 'between' ? 'space-between' : 'flex-start',
        gap: space.sm,
        marginTop: space.md,
        paddingTop: space.md,
        borderTop: `1px solid ${colors.border.default}`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  change,
  changeType = 'neutral', // positive, negative, neutral
  icon,
  variant = 'default',
  style,
  ...props
}) {
  const changeColors = {
    positive: colors.jungleEmerald,
    negative: colors.status.error,
    neutral: colors.text.secondary,
  };

  return (
    <Card variant={variant} style={style} {...props}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {icon && (
          <span style={{
            fontSize: '28px',
            opacity: 0.8,
          }}>
            {icon}
          </span>
        )}
        {change && (
          <span style={{
            padding: '4px 10px',
            background: `${changeColors[changeType]}15`,
            color: changeColors[changeType],
            borderRadius: radius.sm,
            fontSize: '12px',
            fontWeight: 600,
          }}>
            {changeType === 'positive' && '+'}
            {change}
          </span>
        )}
      </div>
      
      <div style={{ marginTop: space.md }}>
        <div style={{
          fontSize: '32px',
          fontWeight: 700,
          color: colors.text.primary,
          lineHeight: 1.2,
        }}>
          {value}
        </div>
        <div style={{
          fontSize: '13px',
          color: colors.text.secondary,
          marginTop: space.xs,
        }}>
          {label}
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE CARD
// ─────────────────────────────────────────────────────────────────────────────

export function FeatureCard({
  icon,
  title,
  description,
  onClick,
  style,
  ...props
}) {
  return (
    <Card 
      variant="default" 
      hoverable 
      clickable={!!onClick}
      onClick={onClick}
      style={style}
      {...props}
    >
      <div style={{
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${colors.sacredGold}15`,
        borderRadius: radius.md,
        marginBottom: space.md,
      }}>
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
      
      <h4 style={{
        margin: '0 0 8px',
        fontSize: '16px',
        fontWeight: 600,
        color: colors.text.primary,
      }}>
        {title}
      </h4>
      
      <p style={{
        margin: 0,
        fontSize: '14px',
        color: colors.text.secondary,
        lineHeight: 1.5,
      }}>
        {description}
      </p>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default Card;
