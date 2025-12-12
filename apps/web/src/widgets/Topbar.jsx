import React, { useState } from 'react';
import { colors, radius, shadows, transitions, space, typography, zIndex } from '../design-system/tokens';
import { NotificationCenter, NotificationBadge } from '../ui/Toast';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — TOPBAR PROFESSIONNELLE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Header avec:
 * - Breadcrumbs
 * - Search bar avec ⌘K
 * - Notifications
 * - Theme toggle
 * - Language selector
 * - User menu
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Topbar({
  // Navigation
  currentPage,
  breadcrumbs = [],
  onNavigate,
  
  // Search
  onOpenSearch,
  searchPlaceholder = 'Rechercher...',
  
  // Theme
  theme = 'dark',
  themes = ['dark', 'light', 'nature'],
  themeIcons = { dark: '🌙', light: '☀️', nature: '🌿' },
  onChangeTheme,
  
  // Language
  language = 'fr',
  languages = [
    { code: 'fr', flag: '🇫🇷', label: 'Français' },
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'es', flag: '🇪🇸', label: 'Español' },
  ],
  onChangeLanguage,
  
  // Notifications
  notifications = [],
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onClearNotifications,
  
  // User
  user = { name: 'Utilisateur', avatar: null, initials: 'U' },
  onOpenUserMenu,
  onLogout,
  
  // Layout
  sidebarWidth = '260px',
  compactMode = false,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: sidebarWidth,
        right: 0,
        height: compactMode ? '56px' : '64px',
        background: colors.background.secondary,
        borderBottom: `1px solid ${colors.border.default}`,
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${space.lg}`,
        gap: space.md,
        zIndex: zIndex.header,
        transition: `left ${transitions.default}`,
      }}
    >
      {/* Breadcrumbs */}
      <nav
        aria-label="Fil d'Ariane"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: space.xs,
        }}
      >
        <button
          onClick={() => onNavigate?.('dashboard')}
          aria-label="Accueil"
          style={{
            padding: `${space.xs} ${space.sm}`,
            background: 'none',
            border: 'none',
            borderRadius: radius.sm,
            color: colors.text.muted,
            cursor: 'pointer',
            fontSize: '16px',
            transition: transitions.fast,
          }}
        >
          🏠
        </button>
        
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.id || i}>
            <span style={{ color: colors.text.muted, fontSize: '12px' }}>/</span>
            <button
              onClick={() => crumb.id && onNavigate?.(crumb.id)}
              disabled={i === breadcrumbs.length - 1}
              style={{
                padding: `${space.xs} ${space.sm}`,
                background: i === breadcrumbs.length - 1 ? `${colors.sacredGold}15` : 'none',
                border: 'none',
                borderRadius: radius.sm,
                color: i === breadcrumbs.length - 1 ? colors.sacredGold : colors.text.secondary,
                cursor: i === breadcrumbs.length - 1 ? 'default' : 'pointer',
                fontSize: typography.fontSize.sm,
                fontWeight: i === breadcrumbs.length - 1 ? 500 : 400,
                transition: transitions.fast,
                display: 'flex',
                alignItems: 'center',
                gap: space.xs,
              }}
            >
              {crumb.icon && <span>{crumb.icon}</span>}
              {crumb.label}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Search */}
      <button
        data-tour="search"
        onClick={onOpenSearch}
        aria-label="Recherche rapide (⌘K)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: space.sm,
          padding: `${space.sm} ${space.md}`,
          width: compactMode ? '200px' : '280px',
          background: colors.background.input,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.md,
          cursor: 'pointer',
          transition: transitions.fast,
        }}
      >
        <span style={{ color: colors.text.muted, fontSize: '16px' }}>🔍</span>
        <span style={{
          flex: 1,
          textAlign: 'left',
          color: colors.text.muted,
          fontSize: typography.fontSize.sm,
        }}>
          {searchPlaceholder}
        </span>
        <kbd style={{
          padding: '2px 6px',
          background: colors.background.tertiary,
          borderRadius: radius.sm,
          fontSize: typography.fontSize.xs,
          color: colors.text.muted,
          fontFamily: typography.fontFamily.mono,
        }}>
          ⌘K
        </kbd>
      </button>

      {/* Keyboard Shortcuts */}
      <IconButton
        icon="⌨️"
        tooltip="Raccourcis clavier (⌘?)"
        onClick={() => {/* Open shortcuts panel */}}
      />

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <IconButton
          icon="🔔"
          tooltip="Notifications"
          onClick={() => setShowNotifications(!showNotifications)}
          badge={unreadCount}
        />
        
        {showNotifications && (
          <NotificationCenter
            notifications={notifications}
            onMarkRead={onMarkNotificationRead}
            onMarkAllRead={onMarkAllNotificationsRead}
            onClear={onClearNotifications}
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </div>

      {/* Divider */}
      <div style={{
        width: '1px',
        height: '24px',
        background: colors.border.default,
      }} />

      {/* Theme Toggle */}
      <div
        data-tour="theme"
        role="radiogroup"
        aria-label="Thème"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '4px',
          background: colors.background.input,
          borderRadius: radius.md,
        }}
      >
        {themes.map(t => (
          <button
            key={t}
            role="radio"
            aria-checked={theme === t}
            aria-label={t}
            onClick={() => onChangeTheme?.(t)}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme === t ? colors.background.tertiary : 'transparent',
              border: 'none',
              borderRadius: radius.sm,
              cursor: 'pointer',
              fontSize: '16px',
              transition: transitions.fast,
            }}
          >
            {themeIcons[t]}
          </button>
        ))}
      </div>

      {/* Language Selector */}
      <div style={{ position: 'relative' }}>
        <button
          aria-label="Langue"
          aria-haspopup="menu"
          aria-expanded={showLangMenu}
          onClick={() => setShowLangMenu(!showLangMenu)}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: colors.background.input,
            border: 'none',
            borderRadius: radius.md,
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          {languages.find(l => l.code === language)?.flag || '🌐'}
        </button>
        
        {showLangMenu && (
          <>
            <div
              onClick={() => setShowLangMenu(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: zIndex.dropdown - 1,
              }}
            />
            <div
              role="menu"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: space.xs,
                padding: space.xs,
                background: colors.background.secondary,
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.md,
                boxShadow: shadows.dropdown,
                zIndex: zIndex.dropdown,
                minWidth: '140px',
              }}
            >
              {languages.map(lang => (
                <button
                  key={lang.code}
                  role="menuitem"
                  onClick={() => {
                    onChangeLanguage?.(lang.code);
                    setShowLangMenu(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: space.sm,
                    padding: `${space.sm} ${space.md}`,
                    background: language === lang.code ? colors.background.tertiary : 'transparent',
                    border: 'none',
                    borderRadius: radius.sm,
                    cursor: 'pointer',
                    color: colors.text.primary,
                    fontSize: typography.fontSize.sm,
                    textAlign: 'left',
                    transition: transitions.fast,
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{lang.flag}</span>
                  <span>{lang.label}</span>
                  {language === lang.code && (
                    <span style={{ marginLeft: 'auto', color: colors.sacredGold }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* User Menu */}
      <div style={{ position: 'relative' }}>
        <button
          aria-label="Menu utilisateur"
          aria-haspopup="menu"
          aria-expanded={showUserMenu}
          onClick={() => setShowUserMenu(!showUserMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: space.sm,
            padding: `${space.xs} ${space.sm}`,
            background: 'none',
            border: 'none',
            borderRadius: radius.md,
            cursor: 'pointer',
            transition: transitions.fast,
          }}
        >
          {/* Avatar */}
          <div style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${colors.sacredGold} 0%, ${colors.cenoteTurquoise} 100%)`,
            borderRadius: radius.md,
            color: colors.darkSlate,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
          }}>
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="" 
                style={{ width: '100%', height: '100%', borderRadius: radius.md, objectFit: 'cover' }}
              />
            ) : (
              user.initials
            )}
          </div>
          
          {!compactMode && (
            <span style={{
              color: colors.text.primary,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
            }}>
              {user.name}
            </span>
          )}
          
          <span style={{ color: colors.text.muted, fontSize: '12px' }}>▾</span>
        </button>
        
        {showUserMenu && (
          <>
            <div
              onClick={() => setShowUserMenu(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: zIndex.dropdown - 1,
              }}
            />
            <div
              role="menu"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: space.xs,
                padding: space.xs,
                background: colors.background.secondary,
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.md,
                boxShadow: shadows.dropdown,
                zIndex: zIndex.dropdown,
                minWidth: '180px',
              }}
            >
              <UserMenuItem icon="👤" label="Mon profil" onClick={() => onNavigate?.('profile')} />
              <UserMenuItem icon="⚙️" label="Paramètres" onClick={() => onNavigate?.('settings')} />
              <UserMenuItem icon="❓" label="Aide" onClick={() => onNavigate?.('help')} />
              
              <div style={{
                height: '1px',
                background: colors.border.default,
                margin: `${space.xs} 0`,
              }} />
              
              <UserMenuItem 
                icon="🚪" 
                label="Déconnexion" 
                onClick={onLogout}
                danger 
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ICON BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function IconButton({ icon, tooltip, onClick, badge }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      aria-label={tooltip}
      title={tooltip}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isHovered ? colors.background.tertiary : colors.background.input,
        border: 'none',
        borderRadius: radius.md,
        cursor: 'pointer',
        fontSize: '18px',
        transition: transitions.fast,
      }}
    >
      {icon}
      {badge > 0 && <NotificationBadge count={badge} />}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USER MENU ITEM
// ─────────────────────────────────────────────────────────────────────────────

function UserMenuItem({ icon, label, onClick, danger }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: space.sm,
        padding: `${space.sm} ${space.md}`,
        background: isHovered ? colors.background.tertiary : 'transparent',
        border: 'none',
        borderRadius: radius.sm,
        cursor: 'pointer',
        color: danger ? colors.status.error : colors.text.primary,
        fontSize: typography.fontSize.sm,
        textAlign: 'left',
        transition: transitions.fast,
      }}
    >
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { IconButton, UserMenuItem };
