/* =====================================================
   CHE·NU — Universe View
   views/UniverseView.tsx
   ===================================================== */

import React, { useState, useEffect } from 'react';
import { SphereCluster } from '@/ui/spheres/SphereCluster';
import { SphereFocusView } from '@/ui/spheres/SphereFocusView';
import { SphereData } from '@/ui/spheres/sphereCard.types';
import { buildRootSpheres } from '@/ui/spheres/sphereCluster.utils';
import { getTheme, applyThemeToDOM } from '@/core/theme/themeEngine';
import { useLayoutState, useBreakpoint } from '@/core/layout/useLayout';
import { initLayoutListener, injectAnimationKeyframes } from '@/core/layout/layoutEngine';
import chenuConfig from '@/core/config/chenu.config.json';

export const UniverseView: React.FC = () => {
  const theme = getTheme();
  const layoutState = useLayoutState();
  const breakpoint = useBreakpoint();
  const [spheres, setSpheres] = useState<SphereData[]>([]);
  const [focusedSphereId, setFocusedSphereId] = useState<string | null>(null);
  const [enteredSphereId, setEnteredSphereId] = useState<string | null>(null);

  useEffect(() => {
    // Apply theme on mount
    applyThemeToDOM(theme);
    
    // Initialize layout system
    const cleanup = initLayoutListener();
    injectAnimationKeyframes();
    
    // Build spheres from config
    const rootSpheres = buildRootSpheres(chenuConfig as any);
    setSpheres(rootSpheres);
    
    return cleanup;
  }, []);

  const handleFocus = (id: string) => {
    setFocusedSphereId(prev => prev === id ? null : id);
  };

  const handleEnter = (id: string) => {
    setEnteredSphereId(id);
  };

  const handleExitSphere = () => {
    setEnteredSphereId(null);
    setFocusedSphereId(null);
  };

  const enteredSphere = enteredSphereId 
    ? spheres.find(s => s.id === enteredSphereId) 
    : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.background,
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.text,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: theme.spacing.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
          background: `linear-gradient(to bottom, ${theme.colors.background}, transparent)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          <span style={{ fontSize: 28 }}>🌳</span>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: theme.typography.fontSizeXl,
              fontWeight: theme.typography.fontWeightBold,
            }}>
              CHE·NU
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: theme.typography.fontSizeXs,
              color: theme.colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Governed Intelligence OS
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <span style={{ 
            fontSize: theme.typography.fontSizeXs,
            color: theme.colors.textMuted,
          }}>
            168 Agents • 8 Spheres
          </span>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: theme.colors.success,
              boxShadow: `0 0 8px ${theme.colors.success}`,
            }}
          />
        </div>
      </header>

      {/* Main Sphere Cluster */}
      <SphereCluster
        spheres={spheres}
        focusedSphereId={focusedSphereId || undefined}
        layout="radial"
        onFocus={handleFocus}
        onEnter={handleEnter}
      />

      {/* Sphere Focus View (Overlay) */}
      {enteredSphere && (
        <SphereFocusView
          sphere={enteredSphere}
          onExit={handleExitSphere}
        />
      )}

      {/* Footer */}
      <footer
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: theme.spacing.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.lg,
          zIndex: 20,
          background: `linear-gradient(to top, ${theme.colors.background}, transparent)`,
        }}
      >
        <span style={{ 
          fontSize: theme.typography.fontSizeXs,
          color: theme.colors.textMuted,
        }}>
          Click to focus • Double-click to enter sphere
        </span>
      </footer>

      {/* Ambient Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${theme.colors.secondary}08 0%, transparent 50%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default UniverseView;
