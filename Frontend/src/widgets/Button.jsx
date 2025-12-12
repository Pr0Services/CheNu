import React from 'react';
import { colors, radius, shadows, transitions, space, typography } from '../design-system/tokens';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — UI KIT: BUTTONS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Variants: primary, secondary, ghost, danger, success, info
 * Sizes: sm, md, lg
 * States: default, hover, active, disabled, loading
 * 
 * Usage:
 *   <Button variant="primary" size="md" onClick={...}>Label</Button>
 *   <Button variant="secondary" loading>Loading...</Button>
 *   <Button variant="ghost" leftIcon="➕">Add Item</Button>
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON STYLES
// ─────────────────────────────────────────────────────────────────────────────

const variants = {
  primary: {
    background: `linear-gradient(135deg, ${colors.sacredGold} 0%, #C9A35A 100%)`,
    color: colors.darkSlate,
    border: 'none',
    hoverBackground: `linear-gradient(135deg, #E5C27A 0%, ${colors.sacredGold} 100%)`,
    activeBackground: `linear-gradient(135deg, #C9A35A 0%, #B8924A 100%)`,
    shadow: shadows.gold,
  },
  secondary: {
    background: 'transparent',
    color: colors.sacredGold,
    border: `2px solid ${colors.sacredGold}`,
    hoverBackground: `rgba(216, 178, 106, 0.1)`,
    activeBackground: `rgba(216, 178, 106, 0.2)`,
    shadow: 'none',
  },
  ghost: {
    background: 'transparent',
    color: colors.text.secondary,
    border: 'none',
    hoverBackground: colors.background.tertiary,
    activeBackground: colors.background.elevated,
    shadow: 'none',
  },
  danger: {
    background: colors.status.error,
    color: '#FFFFFF',
    border: 'none',
    hoverBackground: '#E06A6A',
    activeBackground: '#C84A4A',
    shadow: 'none',
  },
  success: {
    background: colors.jungleEmerald,
    color: '#FFFFFF',
    border: 'none',
    hoverBackground: '#4A8554',
    activeBackground: '#356840',
    shadow: shadows.emerald,
  },
  info: {
    background: colors.cenoteTurquoise,
    color: colors.darkSlate,
    border: 'none',
    hoverBackground: '#4FC4B2',
    activeBackground: '#35A492',
    shadow: 'none',
  },
};

const sizes = {
  sm: {
    padding: '8px 16px',
    fontSize: typography.fontSize.sm,
    height: '32px',
    iconSize: '14px',
    gap: '6px',
  },
  md: {
    padding: '12px 24px',
    fontSize: typography.fontSize.base,
    height: '44px',
    iconSize: '18px',
    gap: '8px',
  },
  lg: {
    padding: '16px 32px',
    fontSize: typography.fontSize.md,
    height: '52px',
    iconSize: '20px',
    gap: '10px',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  onClick,
  className,
  style,
  ...props
}) {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;
  
  const isDisabled = disabled || loading;

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    padding: s.padding,
    height: s.height,
    width: fullWidth ? '100%' : 'auto',
    
    background: v.background,
    color: v.color,
    border: v.border,
    borderRadius: radius.md,
    boxShadow: v.shadow,
    
    fontFamily: typography.fontFamily.body,
    fontSize: s.fontSize,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    transition: transitions.all,
    
    ...style,
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const dynamicStyle = {
    ...baseStyle,
    background: isActive && !isDisabled ? v.activeBackground : 
                isHovered && !isDisabled ? v.hoverBackground : 
                v.background,
    transform: isActive && !isDisabled ? 'scale(0.98)' : 
               isHovered && !isDisabled ? 'translateY(-1px)' : 
               'none',
    boxShadow: isHovered && !isDisabled && v.shadow !== 'none' 
      ? v.shadow.replace(')', ', 0 6px 20px rgba(0,0,0,0.2)')
      : v.shadow,
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={className}
      style={dynamicStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      {...props}
    >
      {loading && <Spinner size={s.iconSize} />}
      {!loading && leftIcon && <span style={{ fontSize: s.iconSize }}>{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span style={{ fontSize: s.iconSize }}>{rightIcon}</span>}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ICON BUTTON
// ─────────────────────────────────────────────────────────────────────────────

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  loading = false,
  tooltip,
  onClick,
  style,
  ...props
}) {
  const v = variants[variant] || variants.ghost;
  const iconSizes = { sm: '28px', md: '36px', lg: '44px' };
  const iconFontSizes = { sm: '14px', md: '18px', lg: '22px' };
  
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: iconSizes[size],
    height: iconSizes[size],
    padding: 0,
    
    background: isHovered && !disabled ? v.hoverBackground : v.background,
    color: isHovered && !disabled ? colors.text.primary : v.color,
    border: v.border === 'none' ? 'none' : `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    
    fontSize: iconFontSizes[size],
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: transitions.all,
    
    ...style,
  };

  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      title={tooltip}
      aria-label={tooltip}
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {loading ? <Spinner size={iconFontSizes[size]} /> : icon}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON GROUP
// ─────────────────────────────────────────────────────────────────────────────

export function ButtonGroup({ children, attached = false, style }) {
  return (
    <div style={{
      display: 'inline-flex',
      gap: attached ? 0 : space.sm,
      ...style,
    }}>
      {React.Children.map(children, (child, index) => {
        if (!attached || !React.isValidElement(child)) return child;
        
        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;
        
        return React.cloneElement(child, {
          style: {
            ...child.props.style,
            borderRadius: isFirst ? `${radius.md} 0 0 ${radius.md}` :
                          isLast ? `0 ${radius.md} ${radius.md} 0` : 0,
            marginLeft: isFirst ? 0 : '-1px',
          }
        });
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPINNER
// ─────────────────────────────────────────────────────────────────────────────

function Spinner({ size = '18px' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{
        animation: 'chenu-spin 1s linear infinite',
      }}
    >
      <style>
        {`@keyframes chenu-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeDasharray="31.4 31.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default Button;
