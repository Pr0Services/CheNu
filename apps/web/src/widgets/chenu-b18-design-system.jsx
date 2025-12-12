/**
 * CHE·NU™ B18 - Design System V2 + Navigation Multi-Espaces
 * 
 * Features:
 * - Design Tokens V2 (couleurs, spacing, shadows, typography)
 * - UI Kit Extended (20+ composants)
 * - Space Navigator (7 espaces)
 * - Breadcrumbs dynamiques
 * - States System (Loading, Empty, Error, Success)
 * 
 * Author: CHE·NU Dev Team
 * Date: December 2024
 */

import React, { useState, useContext, createContext, useMemo, useCallback, useRef, useEffect } from 'react';

// =============================================================================
// DESIGN TOKENS V2
// =============================================================================

export const tokens = {
  // Colors - CHE·NU™ Brand
  colors: {
    // Primary palette
    darkSlate: '#1A1A1A',
    darkCard: '#242424',
    darkHover: '#2E2E2E',
    darkInput: '#1E1E1E',
    
    // Sacred Gold - Primary accent
    sacredGold: '#D8B26A',
    sacredGoldLight: '#E8C88A',
    sacredGoldDark: '#B8924A',
    sacredGoldMuted: 'rgba(216, 178, 106, 0.2)',
    
    // Jungle Emerald - Success
    jungleEmerald: '#3F7249',
    jungleEmeraldLight: '#5F9269',
    jungleEmeraldMuted: 'rgba(63, 114, 73, 0.2)',
    
    // Cenote Turquoise - Info
    cenoteTurquoise: '#3EB4A2',
    cenoteTurquoiseLight: '#5EC4B2',
    cenoteTurquoiseMuted: 'rgba(62, 180, 162, 0.2)',
    
    // Amber - Warning
    amber: '#F59E0B',
    amberLight: '#FBBF24',
    amberMuted: 'rgba(245, 158, 11, 0.2)',
    
    // Danger
    danger: '#EF4444',
    dangerLight: '#F87171',
    dangerMuted: 'rgba(239, 68, 68, 0.2)',
    
    // Purple - Secondary accent
    purple: '#8B5CF6',
    purpleLight: '#A78BFA',
    purpleMuted: 'rgba(139, 92, 246, 0.2)',
    
    // Text
    textPrimary: '#E8E4DC',
    textSecondary: '#A09080',
    textMuted: '#6B6560',
    textDisabled: '#4A4540',
    
    // Borders
    border: '#333333',
    borderLight: '#444444',
    borderFocus: '#D8B26A',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.6)',
    overlayLight: 'rgba(0, 0, 0, 0.3)'
  },
  
  // Spacing scale (4px base)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
    huge: 64
  },
  
  // Border radius
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999
  },
  
  // Typography
  typography: {
    // Font families
    fontFamily: {
      display: "'Lora', 'Josefin Sans', serif",
      body: "'Inter', 'Nunito', system-ui, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace"
    },
    
    // Font sizes
    fontSize: {
      xs: 11,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      h4: 24,
      h3: 28,
      h2: 32,
      h1: 40,
      display: 48
    },
    
    // Font weights
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  
  // Shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(216, 178, 106, 0.3)',
    glowStrong: '0 0 30px rgba(216, 178, 106, 0.5)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
  },
  
  // Transitions
  transitions: {
    fast: '100ms ease',
    normal: '150ms ease',
    slow: '300ms ease',
    spring: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  
  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modal: 400,
    popover: 500,
    tooltip: 600,
    toast: 700
  },
  
  // Breakpoints
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536
  }
};

// CSS-in-JS helper
export const css = (styles) => styles;

// =============================================================================
// THEME CONTEXT
// =============================================================================

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children, defaultTheme = 'dark' }) => {
  const [theme, setTheme] = useState(defaultTheme);
  
  const value = useMemo(() => ({
    theme,
    setTheme,
    tokens,
    isDark: theme === 'dark' || theme === 'vr'
  }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// =============================================================================
// SPACE CONTEXT & NAVIGATION
// =============================================================================

const SPACES = {
  maison: {
    id: 'maison',
    name: 'Maison',
    icon: '🏠',
    description: 'Vie personnelle, documents privés, finances perso',
    color: tokens.colors.sacredGold,
    modules: ['dashboard', 'documents', 'finances', 'projets']
  },
  entreprise: {
    id: 'entreprise',
    name: 'Entreprise',
    icon: '🏢',
    description: 'Gestion professionnelle, projets, équipes',
    color: tokens.colors.cenoteTurquoise,
    modules: ['dashboard', 'projets', 'equipe', 'finances', 'documents', 'crm']
  },
  projets: {
    id: 'projets',
    name: 'Projets',
    icon: '📋',
    description: 'Sous-espaces par projet',
    color: tokens.colors.purple,
    modules: ['taches', 'documents', 'calendrier', 'equipe', 'budget']
  },
  creative: {
    id: 'creative',
    name: 'Creative Studio',
    icon: '🎨',
    description: 'Hub central de création multimédia',
    color: tokens.colors.amber,
    modules: ['images', 'videos', 'audio', 'templates', 'brand']
  },
  gouvernement: {
    id: 'gouvernement',
    name: 'Gouvernement',
    icon: '🏛️',
    description: 'Impôts, taxes, permis, documents officiels',
    color: tokens.colors.jungleEmerald,
    modules: ['impots', 'permis', 'documents', 'formulaires']
  },
  immobilier: {
    id: 'immobilier',
    name: 'Immobilier',
    icon: '🏗️',
    description: 'Propriétés, baux, évaluations',
    color: tokens.colors.danger,
    modules: ['proprietes', 'baux', 'evaluations', 'documents']
  },
  associations: {
    id: 'associations',
    name: 'Associations',
    icon: '🤝',
    description: 'Organisations, réseaux, groupes',
    color: tokens.colors.cenoteTurquoiseLight,
    modules: ['membres', 'projets', 'communications', 'documents']
  }
};

const SpaceContext = createContext(null);

export const SpaceProvider = ({ children }) => {
  const [currentSpace, setCurrentSpace] = useState('maison');
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [history, setHistory] = useState([]);
  
  const navigateTo = useCallback((space, module = 'dashboard', params = {}) => {
    // Update history
    setHistory(prev => [...prev.slice(-9), { space: currentSpace, module: currentModule }]);
    
    // Navigate
    setCurrentSpace(space);
    setCurrentModule(module);
    
    // Update breadcrumbs
    const newBreadcrumbs = [
      { label: SPACES[space].name, space, module: 'dashboard' }
    ];
    if (module !== 'dashboard') {
      newBreadcrumbs.push({ label: module, space, module });
    }
    if (params.subpath) {
      newBreadcrumbs.push({ label: params.subpath, space, module, subpath: params.subpath });
    }
    setBreadcrumbs(newBreadcrumbs);
  }, [currentSpace, currentModule]);
  
  const goBack = useCallback(() => {
    if (history.length > 0) {
      const last = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentSpace(last.space);
      setCurrentModule(last.module);
    }
  }, [history]);
  
  const value = useMemo(() => ({
    currentSpace,
    currentModule,
    breadcrumbs,
    history,
    spaces: SPACES,
    spaceConfig: SPACES[currentSpace],
    navigateTo,
    goBack,
    canGoBack: history.length > 0
  }), [currentSpace, currentModule, breadcrumbs, history, navigateTo, goBack]);
  
  return (
    <SpaceContext.Provider value={value}>
      {children}
    </SpaceContext.Provider>
  );
};

export const useSpace = () => {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error('useSpace must be used within SpaceProvider');
  }
  return context;
};

// =============================================================================
// UI KIT - BASE COMPONENTS
// =============================================================================

// Button
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  ...props
}) => {
  const variants = {
    primary: {
      bg: tokens.colors.sacredGold,
      color: tokens.colors.darkSlate,
      hoverBg: tokens.colors.sacredGoldLight
    },
    secondary: {
      bg: 'transparent',
      color: tokens.colors.textPrimary,
      border: `1px solid ${tokens.colors.border}`,
      hoverBg: tokens.colors.darkHover
    },
    ghost: {
      bg: 'transparent',
      color: tokens.colors.textSecondary,
      hoverBg: tokens.colors.darkHover,
      hoverColor: tokens.colors.textPrimary
    },
    danger: {
      bg: tokens.colors.danger,
      color: '#fff',
      hoverBg: tokens.colors.dangerLight
    },
    success: {
      bg: tokens.colors.jungleEmerald,
      color: '#fff',
      hoverBg: tokens.colors.jungleEmeraldLight
    }
  };
  
  const sizes = {
    sm: { padding: '6px 12px', fontSize: 12, height: 28 },
    md: { padding: '8px 16px', fontSize: 14, height: 36 },
    lg: { padding: '12px 24px', fontSize: 16, height: 44 }
  };
  
  const v = variants[variant];
  const s = sizes[size];
  
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: s.padding,
        height: s.height,
        fontSize: s.fontSize,
        fontWeight: 600,
        fontFamily: tokens.typography.fontFamily.body,
        borderRadius: tokens.radius.md,
        border: v.border || 'none',
        background: isHovered && !disabled ? (v.hoverBg || v.bg) : v.bg,
        color: isHovered && v.hoverColor ? v.hoverColor : v.color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: tokens.transitions.fast,
        width: fullWidth ? '100%' : 'auto',
        ...props.style
      }}
      {...props}
    >
      {loading && <Spinner size={s.fontSize} />}
      {icon && iconPosition === 'left' && !loading && <span>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </button>
  );
};

// Input
export const Input = ({
  label,
  error,
  hint,
  icon,
  required,
  disabled,
  fullWidth = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: 6,
          fontSize: 13,
          fontWeight: 500,
          color: tokens.colors.textSecondary
        }}>
          {label}
          {required && <span style={{ color: tokens.colors.danger, marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: tokens.colors.textMuted
          }}>
            {icon}
          </span>
        )}
        <input
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '100%',
            padding: '10px 14px',
            paddingLeft: icon ? 40 : 14,
            fontSize: 14,
            fontFamily: tokens.typography.fontFamily.body,
            background: tokens.colors.darkInput,
            border: `1px solid ${error ? tokens.colors.danger : isFocused ? tokens.colors.borderFocus : tokens.colors.border}`,
            borderRadius: tokens.radius.md,
            color: tokens.colors.textPrimary,
            outline: 'none',
            transition: tokens.transitions.fast,
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'text'
          }}
          {...props}
        />
      </div>
      {(error || hint) && (
        <p style={{
          marginTop: 4,
          fontSize: 12,
          color: error ? tokens.colors.danger : tokens.colors.textMuted
        }}>
          {error || hint}
        </p>
      )}
    </div>
  );
};

// Card
export const Card = ({
  children,
  padding = 'lg',
  hover = false,
  selected = false,
  onClick,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const paddingValues = {
    none: 0,
    sm: tokens.spacing.sm,
    md: tokens.spacing.md,
    lg: tokens.spacing.lg,
    xl: tokens.spacing.xl
  };
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: tokens.colors.darkCard,
        border: `1px solid ${selected ? tokens.colors.sacredGold : tokens.colors.border}`,
        borderRadius: tokens.radius.lg,
        padding: paddingValues[padding],
        cursor: onClick ? 'pointer' : 'default',
        transform: hover && isHovered ? 'translateY(-2px)' : 'none',
        boxShadow: hover && isHovered ? tokens.shadows.lg : tokens.shadows.sm,
        transition: tokens.transitions.normal,
        ...props.style
      }}
    >
      {children}
    </div>
  );
};

// Badge
export const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: { bg: tokens.colors.darkHover, color: tokens.colors.textSecondary },
    primary: { bg: tokens.colors.sacredGoldMuted, color: tokens.colors.sacredGold },
    success: { bg: tokens.colors.jungleEmeraldMuted, color: tokens.colors.jungleEmerald },
    warning: { bg: tokens.colors.amberMuted, color: tokens.colors.amber },
    danger: { bg: tokens.colors.dangerMuted, color: tokens.colors.danger },
    info: { bg: tokens.colors.cenoteTurquoiseMuted, color: tokens.colors.cenoteTurquoise }
  };
  
  const sizes = {
    sm: { padding: '2px 6px', fontSize: 10 },
    md: { padding: '3px 8px', fontSize: 11 },
    lg: { padding: '4px 10px', fontSize: 12 }
  };
  
  const v = variants[variant];
  const s = sizes[size];
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: s.padding,
      fontSize: s.fontSize,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      background: v.bg,
      color: v.color,
      borderRadius: tokens.radius.sm
    }}>
      {children}
    </span>
  );
};

// Avatar
export const Avatar = ({ src, name, size = 'md', status }) => {
  const sizes = { sm: 24, md: 32, lg: 40, xl: 56 };
  const s = sizes[size];
  
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';
  
  const statusColors = {
    online: tokens.colors.jungleEmerald,
    offline: tokens.colors.textMuted,
    busy: tokens.colors.danger,
    away: tokens.colors.amber
  };
  
  return (
    <div style={{ position: 'relative', width: s, height: s }}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            width: s,
            height: s,
            borderRadius: tokens.radius.full,
            objectFit: 'cover'
          }}
        />
      ) : (
        <div style={{
          width: s,
          height: s,
          borderRadius: tokens.radius.full,
          background: tokens.colors.sacredGoldMuted,
          color: tokens.colors.sacredGold,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s * 0.4,
          fontWeight: 600
        }}>
          {initials}
        </div>
      )}
      {status && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: s * 0.3,
          height: s * 0.3,
          borderRadius: tokens.radius.full,
          background: statusColors[status],
          border: `2px solid ${tokens.colors.darkCard}`
        }} />
      )}
    </div>
  );
};

// Spinner
export const Spinner = ({ size = 16, color = tokens.colors.sacredGold }) => (
  <div style={{
    width: size,
    height: size,
    border: `2px solid ${color}40`,
    borderTopColor: color,
    borderRadius: tokens.radius.full,
    animation: 'spin 0.8s linear infinite'
  }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// =============================================================================
// UI KIT - LAYOUT COMPONENTS
// =============================================================================

// Stack
export const Stack = ({ 
  children, 
  direction = 'column', 
  gap = 'md', 
  align = 'stretch',
  justify = 'flex-start',
  wrap = false,
  ...props 
}) => (
  <div style={{
    display: 'flex',
    flexDirection: direction,
    gap: tokens.spacing[gap],
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    ...props.style
  }}>
    {children}
  </div>
);

// Grid
export const Grid = ({ 
  children, 
  columns = 3, 
  gap = 'lg',
  minChildWidth,
  ...props 
}) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: minChildWidth 
      ? `repeat(auto-fit, minmax(${minChildWidth}px, 1fr))`
      : `repeat(${columns}, 1fr)`,
    gap: tokens.spacing[gap],
    ...props.style
  }}>
    {children}
  </div>
);

// Divider
export const Divider = ({ vertical = false, spacing = 'md' }) => (
  <div style={{
    width: vertical ? 1 : '100%',
    height: vertical ? '100%' : 1,
    background: tokens.colors.border,
    margin: vertical 
      ? `0 ${tokens.spacing[spacing]}px` 
      : `${tokens.spacing[spacing]}px 0`
  }} />
);

// =============================================================================
// UI KIT - NAVIGATION COMPONENTS
// =============================================================================

// Space Navigator
export const SpaceNavigator = () => {
  const { currentSpace, spaces, navigateTo } = useSpace();
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Current Space Button */}
      <Button
        variant="secondary"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          borderColor: spaces[currentSpace].color,
          borderWidth: 2
        }}
      >
        <span>{spaces[currentSpace].icon}</span>
        <span>{spaces[currentSpace].name}</span>
        <span style={{ marginLeft: 4 }}>{isExpanded ? '▲' : '▼'}</span>
      </Button>
      
      {/* Dropdown */}
      {isExpanded && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 8,
          background: tokens.colors.darkCard,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.sm,
          minWidth: 280,
          boxShadow: tokens.shadows.xl,
          zIndex: tokens.zIndex.dropdown
        }}>
          {Object.values(spaces).map(space => (
            <div
              key={space.id}
              onClick={() => {
                navigateTo(space.id);
                setIsExpanded(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: tokens.radius.md,
                cursor: 'pointer',
                background: currentSpace === space.id 
                  ? `${space.color}20` 
                  : 'transparent',
                borderLeft: `3px solid ${currentSpace === space.id ? space.color : 'transparent'}`,
                transition: tokens.transitions.fast
              }}
            >
              <span style={{ fontSize: 20 }}>{space.icon}</span>
              <div>
                <div style={{ 
                  color: currentSpace === space.id ? space.color : tokens.colors.textPrimary,
                  fontWeight: 600
                }}>
                  {space.name}
                </div>
                <div style={{ fontSize: 11, color: tokens.colors.textMuted }}>
                  {space.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Breadcrumbs
export const Breadcrumbs = () => {
  const { breadcrumbs, navigateTo } = useSpace();
  
  if (breadcrumbs.length === 0) return null;
  
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span style={{ color: tokens.colors.textMuted }}>/</span>
          )}
          <button
            onClick={() => navigateTo(crumb.space, crumb.module)}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px 8px',
              fontSize: 13,
              color: index === breadcrumbs.length - 1 
                ? tokens.colors.textPrimary 
                : tokens.colors.textMuted,
              cursor: index === breadcrumbs.length - 1 ? 'default' : 'pointer',
              borderRadius: tokens.radius.sm,
              transition: tokens.transitions.fast
            }}
          >
            {crumb.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

// Sidebar
export const Sidebar = ({ collapsed = false, onToggle }) => {
  const { currentSpace, currentModule, spaceConfig, navigateTo } = useSpace();
  
  const mainModules = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'social', icon: '👥', label: 'Social' },
    { id: 'forum', icon: '💬', label: 'Forum' },
    { id: 'streaming', icon: '🎬', label: 'Streaming' },
    { id: 'creative', icon: '🎨', label: 'Creative Studio', isQuickAccess: true },
    { id: 'outils', icon: '🛠️', label: 'Outils & Agents' },
    { id: 'chelearn', icon: '🧠', label: 'CHE-Learn' },
    { id: 'settings', icon: '⚙️', label: 'Paramètres' }
  ];
  
  return (
    <aside style={{
      width: collapsed ? 64 : 240,
      height: '100vh',
      background: tokens.colors.darkCard,
      borderRight: `1px solid ${tokens.colors.border}`,
      display: 'flex',
      flexDirection: 'column',
      transition: tokens.transitions.normal
    }}>
      {/* Logo */}
      <div style={{
        padding: tokens.spacing.lg,
        borderBottom: `1px solid ${tokens.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <div style={{
          width: 36,
          height: 36,
          background: `linear-gradient(135deg, ${tokens.colors.sacredGold}, ${tokens.colors.sacredGoldDark})`,
          borderRadius: tokens.radius.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          color: tokens.colors.darkSlate
        }}>
          C
        </div>
        {!collapsed && (
          <span style={{
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: 18,
            fontWeight: 700,
            color: tokens.colors.textPrimary
          }}>
            CHE·NU™
          </span>
        )}
      </div>
      
      {/* Space Navigator */}
      <div style={{ padding: tokens.spacing.md }}>
        {!collapsed && <SpaceNavigator />}
      </div>
      
      {/* Navigation */}
      <nav style={{ flex: 1, padding: tokens.spacing.md, overflowY: 'auto' }}>
        {mainModules.map(module => (
          <SidebarItem
            key={module.id}
            icon={module.icon}
            label={module.label}
            active={currentModule === module.id}
            collapsed={collapsed}
            isQuickAccess={module.isQuickAccess}
            onClick={() => navigateTo(currentSpace, module.id)}
          />
        ))}
      </nav>
      
      {/* Collapse Toggle */}
      <div style={{ padding: tokens.spacing.md, borderTop: `1px solid ${tokens.colors.border}` }}>
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          onClick={onToggle}
        >
          {collapsed ? '→' : '←'}
        </Button>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, active, collapsed, isQuickAccess, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: collapsed ? '10px' : '10px 12px',
      marginBottom: 4,
      background: active ? tokens.colors.sacredGoldMuted : 'transparent',
      border: isQuickAccess ? `1px dashed ${tokens.colors.sacredGold}40` : 'none',
      borderRadius: tokens.radius.md,
      color: active ? tokens.colors.sacredGold : tokens.colors.textSecondary,
      cursor: 'pointer',
      textAlign: 'left',
      transition: tokens.transitions.fast,
      justifyContent: collapsed ? 'center' : 'flex-start'
    }}
  >
    <span style={{ fontSize: 18 }}>{icon}</span>
    {!collapsed && (
      <span style={{ fontSize: 14, fontWeight: active ? 600 : 400 }}>{label}</span>
    )}
  </button>
);

// Topbar
export const Topbar = ({ onMenuClick }) => {
  const { spaceConfig } = useSpace();
  const [searchOpen, setSearchOpen] = useState(false);
  
  return (
    <header style={{
      height: 56,
      background: tokens.colors.darkCard,
      borderBottom: `1px solid ${tokens.colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `0 ${tokens.spacing.lg}px`
    }}>
      {/* Left: Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onMenuClick}
          style={{
            background: 'none',
            border: 'none',
            padding: 8,
            cursor: 'pointer',
            color: tokens.colors.textSecondary
          }}
        >
          ☰
        </button>
        <Breadcrumbs />
      </div>
      
      {/* Center: Search */}
      <div style={{
        flex: 1,
        maxWidth: 480,
        margin: '0 24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: tokens.colors.darkInput,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.md,
          padding: '8px 12px',
          gap: 8
        }}>
          <span style={{ color: tokens.colors.textMuted }}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher... (⌘K)"
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: tokens.colors.textPrimary,
              fontSize: 14
            }}
          />
          <Badge variant="default" size="sm">⌘K</Badge>
        </div>
      </div>
      
      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="ghost" size="sm">🔔</Button>
        <Button variant="ghost" size="sm">🧠</Button>
        <Avatar name="Jo User" status="online" />
      </div>
    </header>
  );
};

// =============================================================================
// STATES SYSTEM
// =============================================================================

// Loading State
export const LoadingState = ({ message = 'Chargement...' }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xxxl,
    gap: tokens.spacing.lg
  }}>
    <Spinner size={32} />
    <p style={{ color: tokens.colors.textSecondary }}>{message}</p>
  </div>
);

// Empty State
export const EmptyState = ({ 
  icon = '📭', 
  title = 'Aucun élément',
  description = 'Commencez par créer votre premier élément.',
  action,
  actionLabel = 'Créer'
}) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xxxl,
    textAlign: 'center'
  }}>
    <div style={{ fontSize: 48, marginBottom: tokens.spacing.lg }}>{icon}</div>
    <h3 style={{ 
      color: tokens.colors.textPrimary, 
      fontSize: 18, 
      fontWeight: 600,
      marginBottom: tokens.spacing.sm 
    }}>
      {title}
    </h3>
    <p style={{ 
      color: tokens.colors.textMuted, 
      fontSize: 14,
      maxWidth: 300,
      marginBottom: tokens.spacing.xl
    }}>
      {description}
    </p>
    {action && (
      <Button onClick={action}>{actionLabel}</Button>
    )}
  </div>
);

// Error State
export const ErrorState = ({
  title = 'Une erreur est survenue',
  description = 'Impossible de charger les données. Veuillez réessayer.',
  onRetry
}) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xxxl,
    textAlign: 'center'
  }}>
    <div style={{
      width: 64,
      height: 64,
      borderRadius: tokens.radius.full,
      background: tokens.colors.dangerMuted,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 28,
      marginBottom: tokens.spacing.lg
    }}>
      ⚠️
    </div>
    <h3 style={{ 
      color: tokens.colors.danger, 
      fontSize: 18, 
      fontWeight: 600,
      marginBottom: tokens.spacing.sm 
    }}>
      {title}
    </h3>
    <p style={{ 
      color: tokens.colors.textMuted, 
      fontSize: 14,
      maxWidth: 300,
      marginBottom: tokens.spacing.xl
    }}>
      {description}
    </p>
    {onRetry && (
      <Button variant="danger" onClick={onRetry}>Réessayer</Button>
    )}
  </div>
);

// Success State
export const SuccessState = ({
  title = 'Succès!',
  description = 'L\'opération a été effectuée avec succès.',
  action,
  actionLabel = 'Continuer'
}) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xxxl,
    textAlign: 'center'
  }}>
    <div style={{
      width: 64,
      height: 64,
      borderRadius: tokens.radius.full,
      background: tokens.colors.jungleEmeraldMuted,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 28,
      marginBottom: tokens.spacing.lg
    }}>
      ✅
    </div>
    <h3 style={{ 
      color: tokens.colors.jungleEmerald, 
      fontSize: 18, 
      fontWeight: 600,
      marginBottom: tokens.spacing.sm 
    }}>
      {title}
    </h3>
    <p style={{ 
      color: tokens.colors.textMuted, 
      fontSize: 14,
      maxWidth: 300,
      marginBottom: tokens.spacing.xl
    }}>
      {description}
    </p>
    {action && (
      <Button variant="success" onClick={action}>{actionLabel}</Button>
    )}
  </div>
);

// StateWrapper - Utility component
export const StateWrapper = ({
  loading,
  error,
  empty,
  children,
  loadingMessage,
  emptyConfig,
  errorConfig,
  onRetry
}) => {
  if (loading) return <LoadingState message={loadingMessage} />;
  if (error) return <ErrorState {...errorConfig} onRetry={onRetry} />;
  if (empty) return <EmptyState {...emptyConfig} />;
  return children;
};

// =============================================================================
// UI KIT - FEEDBACK COMPONENTS
// =============================================================================

// Toast
export const Toast = ({ 
  message, 
  variant = 'default', 
  onClose,
  duration = 5000 
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const variants = {
    default: { bg: tokens.colors.darkCard, icon: 'ℹ️' },
    success: { bg: tokens.colors.jungleEmeraldMuted, icon: '✅', color: tokens.colors.jungleEmerald },
    warning: { bg: tokens.colors.amberMuted, icon: '⚠️', color: tokens.colors.amber },
    error: { bg: tokens.colors.dangerMuted, icon: '❌', color: tokens.colors.danger }
  };
  
  const v = variants[variant];
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      background: v.bg,
      border: `1px solid ${v.color || tokens.colors.border}`,
      borderRadius: tokens.radius.lg,
      boxShadow: tokens.shadows.xl,
      minWidth: 280
    }}>
      <span style={{ fontSize: 18 }}>{v.icon}</span>
      <p style={{ 
        flex: 1, 
        color: v.color || tokens.colors.textPrimary,
        fontSize: 14 
      }}>
        {message}
      </p>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            padding: 4,
            cursor: 'pointer',
            color: tokens.colors.textMuted
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Modal
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  showClose = true 
}) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 400,
    md: 560,
    lg: 720,
    xl: 900
  };
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: tokens.colors.overlay,
      zIndex: tokens.zIndex.modal
    }}>
      <div style={{
        width: '90%',
        maxWidth: sizes[size],
        maxHeight: '85vh',
        background: tokens.colors.darkCard,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.xl,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: tokens.spacing.lg,
          borderBottom: `1px solid ${tokens.colors.border}`
        }}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 600,
            color: tokens.colors.textPrimary
          }}>
            {title}
          </h2>
          {showClose && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                padding: 8,
                cursor: 'pointer',
                color: tokens.colors.textMuted,
                fontSize: 18
              }}
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: tokens.spacing.lg
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Tooltip
export const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  const positions = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 }
  };
  
  return (
    <div
      ref={ref}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div style={{
          position: 'absolute',
          ...positions[position],
          padding: '6px 10px',
          background: tokens.colors.darkSlate,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.sm,
          fontSize: 12,
          color: tokens.colors.textPrimary,
          whiteSpace: 'nowrap',
          zIndex: tokens.zIndex.tooltip,
          boxShadow: tokens.shadows.lg
        }}>
          {content}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MAIN APP DEMO
// =============================================================================

export default function DesignSystemDemo() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentState, setCurrentState] = useState('content'); // content, loading, empty, error
  
  return (
    <ThemeProvider>
      <SpaceProvider>
        <div style={{
          display: 'flex',
          minHeight: '100vh',
          background: tokens.colors.darkSlate,
          color: tokens.colors.textPrimary,
          fontFamily: tokens.typography.fontFamily.body
        }}>
          {/* Sidebar */}
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          
          {/* Main Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Topbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
            
            <main style={{ flex: 1, padding: tokens.spacing.xl, overflow: 'auto' }}>
              {/* Header */}
              <div style={{ marginBottom: tokens.spacing.xl }}>
                <h1 style={{
                  fontSize: tokens.typography.fontSize.h2,
                  fontWeight: 700,
                  fontFamily: tokens.typography.fontFamily.display,
                  color: tokens.colors.sacredGold,
                  marginBottom: tokens.spacing.sm
                }}>
                  CHE·NU™ Design System V2
                </h1>
                <p style={{ color: tokens.colors.textSecondary }}>
                  B18 - Design Tokens, UI Kit Extended, Space Navigator, States System
                </p>
              </div>
              
              {/* State Demo Controls */}
              <Card padding="lg" style={{ marginBottom: tokens.spacing.xl }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: tokens.spacing.md }}>
                  States System Demo
                </h3>
                <Stack direction="row" gap="sm">
                  <Button 
                    variant={currentState === 'content' ? 'primary' : 'secondary'} 
                    size="sm"
                    onClick={() => setCurrentState('content')}
                  >
                    Content
                  </Button>
                  <Button 
                    variant={currentState === 'loading' ? 'primary' : 'secondary'} 
                    size="sm"
                    onClick={() => setCurrentState('loading')}
                  >
                    Loading
                  </Button>
                  <Button 
                    variant={currentState === 'empty' ? 'primary' : 'secondary'} 
                    size="sm"
                    onClick={() => setCurrentState('empty')}
                  >
                    Empty
                  </Button>
                  <Button 
                    variant={currentState === 'error' ? 'primary' : 'secondary'} 
                    size="sm"
                    onClick={() => setCurrentState('error')}
                  >
                    Error
                  </Button>
                </Stack>
              </Card>
              
              {/* State Content */}
              <Card padding="xl" style={{ marginBottom: tokens.spacing.xl }}>
                <StateWrapper
                  loading={currentState === 'loading'}
                  error={currentState === 'error'}
                  empty={currentState === 'empty'}
                  onRetry={() => setCurrentState('content')}
                  emptyConfig={{
                    icon: '📋',
                    title: 'Aucun projet',
                    description: 'Créez votre premier projet pour commencer.',
                    action: () => setModalOpen(true),
                    actionLabel: 'Créer un projet'
                  }}
                  errorConfig={{
                    title: 'Erreur de chargement',
                    description: 'Impossible de récupérer les données. Vérifiez votre connexion.'
                  }}
                >
                  {/* Normal Content */}
                  <Grid columns={3} gap="lg">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <Card key={i} hover padding="lg">
                        <Stack gap="md">
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Badge variant={i % 2 === 0 ? 'success' : 'primary'}>
                              {i % 2 === 0 ? 'Actif' : 'En cours'}
                            </Badge>
                            <span style={{ color: tokens.colors.textMuted }}>#{i}</span>
                          </div>
                          <h4 style={{ fontSize: 16, fontWeight: 600 }}>Projet {i}</h4>
                          <p style={{ fontSize: 13, color: tokens.colors.textMuted }}>
                            Description du projet numéro {i}
                          </p>
                          <Divider />
                          <Stack direction="row" justify="space-between" align="center">
                            <div style={{ display: 'flex', gap: -8 }}>
                              <Avatar name="A" size="sm" />
                              <Avatar name="B" size="sm" />
                              <Avatar name="C" size="sm" />
                            </div>
                            <Button variant="ghost" size="sm">Voir →</Button>
                          </Stack>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </StateWrapper>
              </Card>
              
              {/* Components Showcase */}
              <Card padding="lg">
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: tokens.spacing.lg }}>
                  UI Kit Components
                </h3>
                
                <Grid columns={2} gap="xl">
                  {/* Buttons */}
                  <Stack gap="md">
                    <h4 style={{ fontSize: 14, color: tokens.colors.textSecondary }}>Buttons</h4>
                    <Stack direction="row" gap="sm" wrap>
                      <Button>Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="danger">Danger</Button>
                      <Button variant="success">Success</Button>
                    </Stack>
                    <Stack direction="row" gap="sm" wrap>
                      <Button size="sm">Small</Button>
                      <Button size="md">Medium</Button>
                      <Button size="lg">Large</Button>
                    </Stack>
                    <Stack direction="row" gap="sm">
                      <Button loading>Loading</Button>
                      <Button disabled>Disabled</Button>
                      <Button icon="🚀">With Icon</Button>
                    </Stack>
                  </Stack>
                  
                  {/* Inputs */}
                  <Stack gap="md">
                    <h4 style={{ fontSize: 14, color: tokens.colors.textSecondary }}>Inputs</h4>
                    <Input 
                      label="Email" 
                      placeholder="votre@email.com"
                      icon="📧"
                      required
                    />
                    <Input 
                      label="Mot de passe" 
                      type="password"
                      hint="Minimum 8 caractères"
                    />
                    <Input 
                      label="Erreur example" 
                      error="Ce champ est requis"
                      value="Valeur invalide"
                    />
                  </Stack>
                  
                  {/* Badges */}
                  <Stack gap="md">
                    <h4 style={{ fontSize: 14, color: tokens.colors.textSecondary }}>Badges</h4>
                    <Stack direction="row" gap="sm" wrap>
                      <Badge>Default</Badge>
                      <Badge variant="primary">Primary</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="danger">Danger</Badge>
                      <Badge variant="info">Info</Badge>
                    </Stack>
                  </Stack>
                  
                  {/* Avatars */}
                  <Stack gap="md">
                    <h4 style={{ fontSize: 14, color: tokens.colors.textSecondary }}>Avatars</h4>
                    <Stack direction="row" gap="md" align="center">
                      <Avatar name="Jo User" size="sm" />
                      <Avatar name="Jo User" size="md" status="online" />
                      <Avatar name="Jo User" size="lg" status="busy" />
                      <Avatar name="Jo User" size="xl" status="away" />
                    </Stack>
                  </Stack>
                </Grid>
                
                <Divider spacing="xl" />
                
                {/* Modal Demo */}
                <Button onClick={() => setModalOpen(true)}>
                  Ouvrir Modal Demo
                </Button>
              </Card>
            </main>
          </div>
          
          {/* Modal */}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Créer un nouveau projet"
            size="md"
          >
            <Stack gap="lg">
              <Input label="Nom du projet" placeholder="Mon projet" required />
              <Input label="Description" placeholder="Description..." />
              <Stack direction="row" gap="md" justify="flex-end">
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setModalOpen(false)}>
                  Créer
                </Button>
              </Stack>
            </Stack>
          </Modal>
        </div>
      </SpaceProvider>
    </ThemeProvider>
  );
}
