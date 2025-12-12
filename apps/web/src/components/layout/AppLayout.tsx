/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU V25 - APP LAYOUT                                ║
 * ║                                                                              ║
 * ║  Structure: Sidebar + Header + Content + Nova Panel                          ║
 * ║  Règle: Tout accessible en ≤3 clics                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NovaPanel } from './NovaPanel';
import { SpotlightSearch } from '../search/SpotlightSearch';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface AppLayoutProps {
  children: React.ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [novaPanelOpen, setNovaPanelOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'cmd+k': () => setSpotlightOpen(true),
    'cmd+b': () => setSidebarCollapsed(!sidebarCollapsed),
    'cmd+j': () => setNovaPanelOpen(!novaPanelOpen),
  });

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* Main Content Area */}
      <div className={`main-area ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <Header 
          onOpenSpotlight={() => setSpotlightOpen(true)}
          onToggleNova={() => setNovaPanelOpen(!novaPanelOpen)}
        />

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>

      {/* Nova Panel (toujours accessible) */}
      <NovaPanel 
        isOpen={novaPanelOpen} 
        onClose={() => setNovaPanelOpen(false)} 
      />

      {/* Spotlight Search (⌘K) */}
      <SpotlightSearch 
        isOpen={spotlightOpen} 
        onClose={() => setSpotlightOpen(false)} 
      />

      {/* Styles */}
      <style>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg-main);
        }

        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 260px;
          transition: margin-left 0.3s ease;
        }

        .main-area.sidebar-collapsed {
          margin-left: 70px;
        }

        .page-content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .main-area {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};
