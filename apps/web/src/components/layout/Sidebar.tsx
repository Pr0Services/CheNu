/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU V25 - SIDEBAR                                   ║
 * ║                                                                              ║
 * ║  Menu Principal:                                                             ║
 * ║  • Dashboard                                                                 ║
 * ║  • Social                                                                    ║
 * ║  • Forum                                                                     ║
 * ║  • Streaming                                                                 ║
 * ║  • Creative Studio (1 clic)                                                  ║
 * ║  • Outils & Agents                                                           ║
 * ║  • CHE-Learn                                                                 ║
 * ║  • Paramètres                                                                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSpace } from '../../hooks/useSpace';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  isCreativeStudio?: boolean;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// MENU CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const MAIN_MENU: MenuSection[] = [
  {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    ]
  },
  {
    title: 'Espaces',
    items: [
      { id: 'maison', label: 'Maison', icon: '🏠', path: '/maison' },
      { id: 'entreprise', label: 'Entreprise', icon: '🏢', path: '/entreprise' },
      { id: 'projets', label: 'Projets', icon: '📁', path: '/projets' },
      { id: 'creative', label: 'Creative Studio', icon: '🎨', path: '/creative', isCreativeStudio: true },
      { id: 'gouvernement', label: 'Gouvernement', icon: '🏛️', path: '/gouvernement' },
      { id: 'immobilier', label: 'Immobilier', icon: '🏘️', path: '/immobilier' },
      { id: 'associations', label: 'Associations', icon: '🤝', path: '/associations' },
    ]
  },
  {
    title: 'Social',
    items: [
      { id: 'social', label: 'Social Network', icon: '📱', path: '/social' },
      { id: 'forum', label: 'Forum', icon: '💬', path: '/forum' },
      { id: 'streaming', label: 'Streaming', icon: '🎬', path: '/streaming' },
    ]
  },
  {
    title: 'Outils',
    items: [
      { id: 'nova', label: 'Nova AI', icon: '🤖', path: '/nova' },
      { id: 'learn', label: 'CHE-Learn', icon: '🎓', path: '/learn' },
    ]
  },
  {
    items: [
      { id: 'settings', label: 'Paramètres', icon: '⚙️', path: '/settings' },
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { currentSpace } = useSpace();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏠</span>
          {!collapsed && <span className="logo-text">CHE·NU</span>}
        </div>
        <button className="toggle-btn" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {MAIN_MENU.map((section, sectionIndex) => (
          <div key={sectionIndex} className="menu-section">
            {section.title && !collapsed && (
              <div className="section-title">{section.title}</div>
            )}
            
            {section.items.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `
                  menu-item 
                  ${isActive ? 'active' : ''} 
                  ${item.isCreativeStudio ? 'creative-studio' : ''}
                `}
                title={collapsed ? item.label : undefined}
              >
                <span className="menu-icon">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="menu-label">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="menu-badge">{item.badge}</span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          {!collapsed && (
            <div className="user-details">
              <div className="user-name">Utilisateur</div>
              <div className="user-plan">Pro</div>
            </div>
          )}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 260px;
          background: var(--color-bg-card, #121614);
          border-right: 1px solid var(--color-border, #2a2a2a);
          display: flex;
          flex-direction: column;
          z-index: 100;
          transition: width 0.3s ease;
        }

        .sidebar.collapsed {
          width: 70px;
        }

        .sidebar-header {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--color-border, #2a2a2a);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          font-size: 24px;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: var(--color-text-primary, #e8e4dc);
        }

        .toggle-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: none;
          background: var(--color-bg-hover, #2a2a2a);
          color: var(--color-text-muted, #6b6560);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.2s;
        }

        .toggle-btn:hover {
          background: var(--color-accent, #4ade80);
          color: #000;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 12px 8px;
        }

        .menu-section {
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-text-muted, #6b6560);
          padding: 8px 12px;
          letter-spacing: 0.5px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          color: var(--color-text-secondary, #a8a29e);
          text-decoration: none;
          transition: all 0.2s;
          margin-bottom: 2px;
        }

        .menu-item:hover {
          background: var(--color-bg-hover, #1e2420);
          color: var(--color-text-primary, #e8e4dc);
        }

        .menu-item.active {
          background: var(--color-accent, #4ade80);
          color: #000;
        }

        .menu-item.creative-studio {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #000;
          font-weight: 600;
        }

        .menu-item.creative-studio:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .menu-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .menu-label {
          flex: 1;
          font-size: 14px;
        }

        .menu-badge {
          background: var(--color-danger, #ef4444);
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--color-border, #2a2a2a);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-bg-hover, #2a2a2a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-primary, #e8e4dc);
        }

        .user-plan {
          font-size: 11px;
          color: var(--color-accent, #4ade80);
        }

        .sidebar.collapsed .menu-item {
          justify-content: center;
          padding: 12px;
        }

        .sidebar.collapsed .menu-icon {
          margin: 0;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
};
