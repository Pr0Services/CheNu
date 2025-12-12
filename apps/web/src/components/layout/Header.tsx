/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU V25 - HEADER                                    ║
 * ║                                                                              ║
 * ║  Components: Space Switcher | Search | Notifications | User Menu             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { useSpace } from '../../hooks/useSpace';
import { useTheme } from '../../hooks/useTheme';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface HeaderProps {
  onOpenSpotlight: () => void;
  onToggleNova: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPACE SWITCHER
// ═══════════════════════════════════════════════════════════════════════════════

const SpaceSwitcher: React.FC = () => {
  const { currentSpace, switchSpace } = useSpace();
  const [isOpen, setIsOpen] = useState(false);

  const spaces = [
    { id: 'maison', label: 'Maison', icon: '🏠', color: '#4ade80' },
    { id: 'bureau', label: 'Bureau', icon: '🏢', color: '#3b82f6' },
    { id: 'exterieur', label: 'Extérieur', icon: '🌍', color: '#f59e0b' },
  ];

  return (
    <div className="space-switcher">
      <button 
        className="space-current" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="space-icon">{spaces.find(s => s.id === currentSpace)?.icon || '🏠'}</span>
        <span className="space-label">{spaces.find(s => s.id === currentSpace)?.label || 'Maison'}</span>
        <span className="space-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="space-dropdown">
          {spaces.map((space) => (
            <button
              key={space.id}
              className={`space-option ${currentSpace === space.id ? 'active' : ''}`}
              onClick={() => {
                switchSpace(space.id);
                setIsOpen(false);
              }}
            >
              <span className="space-icon">{space.icon}</span>
              <span className="space-label">{space.label}</span>
            </button>
          ))}
        </div>
      )}

      <style>{`
        .space-switcher {
          position: relative;
        }

        .space-current {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: var(--color-bg-card, #1a1a1a);
          border: 1px solid var(--color-border, #2a2a2a);
          border-radius: 10px;
          color: var(--color-text-primary, #e8e4dc);
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .space-current:hover {
          border-color: var(--color-accent, #4ade80);
        }

        .space-icon {
          font-size: 18px;
        }

        .space-arrow {
          font-size: 10px;
          color: var(--color-text-muted, #6b6560);
        }

        .space-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 8px;
          background: var(--color-bg-card, #1a1a1a);
          border: 1px solid var(--color-border, #2a2a2a);
          border-radius: 12px;
          padding: 8px;
          min-width: 180px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          z-index: 1000;
        }

        .space-option {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--color-text-secondary, #a8a29e);
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .space-option:hover {
          background: var(--color-bg-hover, #2a2a2a);
          color: var(--color-text-primary, #e8e4dc);
        }

        .space-option.active {
          background: var(--color-accent, #4ade80);
          color: #000;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH BAR
// ═══════════════════════════════════════════════════════════════════════════════

const SearchBar: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button className="search-bar" onClick={onClick}>
      <span className="search-icon">🔍</span>
      <span className="search-placeholder">Rechercher...</span>
      <kbd className="search-shortcut">⌘K</kbd>

      <style>{`
        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: var(--color-bg-card, #1a1a1a);
          border: 1px solid var(--color-border, #2a2a2a);
          border-radius: 10px;
          cursor: pointer;
          min-width: 280px;
          transition: all 0.2s;
        }

        .search-bar:hover {
          border-color: var(--color-accent, #4ade80);
        }

        .search-icon {
          font-size: 14px;
        }

        .search-placeholder {
          flex: 1;
          text-align: left;
          color: var(--color-text-muted, #6b6560);
          font-size: 14px;
        }

        .search-shortcut {
          padding: 3px 8px;
          background: var(--color-bg-hover, #2a2a2a);
          border-radius: 6px;
          font-size: 11px;
          color: var(--color-text-muted, #6b6560);
          font-family: system-ui;
        }
      `}</style>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const Header: React.FC<HeaderProps> = ({ onOpenSpotlight, onToggleNova }) => {
  const { theme, toggleTheme } = useTheme();
  const [notifCount, setNotifCount] = useState(3);

  return (
    <header className="app-header">
      {/* Left: Space Switcher */}
      <div className="header-left">
        <SpaceSwitcher />
      </div>

      {/* Center: Search */}
      <div className="header-center">
        <SearchBar onClick={onOpenSpotlight} />
      </div>

      {/* Right: Actions */}
      <div className="header-right">
        {/* Theme Toggle */}
        <button 
          className="header-btn"
          onClick={toggleTheme}
          title="Changer le thème"
        >
          {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🥽'}
        </button>

        {/* Nova AI */}
        <button 
          className="header-btn nova-btn"
          onClick={onToggleNova}
          title="Nova AI"
        >
          🤖
        </button>

        {/* Notifications */}
        <button className="header-btn" title="Notifications">
          🔔
          {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
        </button>

        {/* User Menu */}
        <button className="header-btn user-btn" title="Mon compte">
          👤
        </button>
      </div>

      <style>{`
        .app-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: var(--color-bg-main, #0a0d0b);
          border-bottom: 1px solid var(--color-border, #2a2a2a);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-left,
        .header-center,
        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid var(--color-border, #2a2a2a);
          background: var(--color-bg-card, #1a1a1a);
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.2s;
        }

        .header-btn:hover {
          border-color: var(--color-accent, #4ade80);
          transform: scale(1.05);
        }

        .nova-btn {
          background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
          border: none;
        }

        .notif-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--color-danger, #ef4444);
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
        }

        @media (max-width: 768px) {
          .header-center {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
