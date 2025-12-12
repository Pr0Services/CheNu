/**
 * CHE·NU — Main Application Entry Point
 * Connects all modules together
 */

import React, { Suspense } from 'react';

// Views
import { UniverseView } from './views';

// State
import { useSphereStore } from './state/sphereStore';
import { useSessionStore } from './state/sessionStore';

// Hooks
import { useSessionTracker } from './hooks/useSessionTracker';

// Components
import { MenuEngine } from './components/menu/MenuEngine';
import { MiniMap } from './components/minimap/MiniMap';

// Config
import { UNIVERSE_CONFIG } from './config/universe.config';

// ============================================================
// APP COMPONENT
// ============================================================

export const App: React.FC = () => {
  // Initialize session tracking
  useSessionTracker();
  
  // Global state
  const { currentSphere } = useSphereStore();
  const { sessionId } = useSessionStore();
  
  return (
    <div className="chenu-app" data-session={sessionId}>
      {/* Navigation */}
      <header className="chenu-header">
        <MenuEngine />
      </header>
      
      {/* Main Content */}
      <main className="chenu-main">
        <Suspense fallback={<LoadingSpinner />}>
          <UniverseView />
        </Suspense>
      </main>
      
      {/* Minimap */}
      <aside className="chenu-minimap">
        <MiniMap />
      </aside>
      
      {/* Footer */}
      <footer className="chenu-footer">
        <span>CHE·NU — Chez Nous</span>
        <span>{currentSphere || 'Universe'}</span>
      </footer>
    </div>
  );
};

// ============================================================
// LOADING COMPONENT
// ============================================================

const LoadingSpinner: React.FC = () => (
  <div className="chenu-loading">
    <div className="spinner" />
    <p>Chargement de l'univers...</p>
  </div>
);

export default App;
