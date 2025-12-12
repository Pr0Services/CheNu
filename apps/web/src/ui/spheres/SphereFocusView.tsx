/* =====================================================
   CHE·NU — Sphere Focus View Component
   ui/spheres/SphereFocusView.tsx
   ===================================================== */

import React from 'react';
import { SphereFocusViewProps, SphereData } from './sphereCard.types';
import { getTheme, getSphereColor } from '@/core/theme/themeEngine';

export const SphereFocusView: React.FC<SphereFocusViewProps> = ({
  sphere,
  onExit,
  onNavigate,
}) => {
  const theme = getTheme();
  const sphereColor = sphere.color || getSphereColor(sphere.type);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: theme.colors.overlay,
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          <span style={{ fontSize: 40 }}>{sphere.icon}</span>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: theme.typography.fontSize2xl,
              color: theme.colors.text,
            }}>
              {sphere.name}
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: theme.typography.fontSizeSm,
              color: theme.colors.textMuted,
            }}>
              {sphere.description}
            </p>
          </div>
        </div>
        
        <button
          onClick={onExit}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.md,
            background: 'transparent',
            color: theme.colors.text,
            cursor: 'pointer',
            fontSize: theme.typography.fontSizeSm,
            transition: `all ${theme.animation.durationFast}`,
          }}
        >
          ← Back to Universe
        </button>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: theme.spacing.lg,
          padding: theme.spacing.lg,
          overflow: 'hidden',
        }}
      >
        {/* Workspace Area */}
        <section
          style={{
            background: theme.colors.surface,
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.border}`,
            padding: theme.spacing.lg,
            overflow: 'auto',
          }}
        >
          <h2 style={{ 
            fontSize: theme.typography.fontSizeLg,
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}>
            Workspace
          </h2>
          
          {/* Indicators Grid */}
          {sphere.indicators && sphere.indicators.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: theme.spacing.md,
                marginBottom: theme.spacing.xl,
              }}
            >
              {sphere.indicators.map((indicator) => (
                <div
                  key={indicator.id}
                  style={{
                    padding: theme.spacing.md,
                    background: `${sphereColor}10`,
                    borderRadius: theme.radius.md,
                    border: `1px solid ${sphereColor}30`,
                  }}
                >
                  <div style={{ 
                    fontSize: theme.typography.fontSizeXs,
                    color: theme.colors.textMuted,
                    marginBottom: theme.spacing.xs,
                  }}>
                    {indicator.label}
                  </div>
                  <div style={{ 
                    fontSize: theme.typography.fontSizeXl,
                    fontWeight: theme.typography.fontWeightBold,
                    color: theme.colors.text,
                  }}>
                    {indicator.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-spheres */}
          {sphere.subSpheres && sphere.subSpheres.length > 0 && (
            <>
              <h3 style={{ 
                fontSize: theme.typography.fontSizeMd,
                color: theme.colors.text,
                marginBottom: theme.spacing.sm,
              }}>
                Sub-spheres
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: theme.spacing.sm,
                }}
              >
                {sphere.subSpheres.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => onNavigate?.(sub.id)}
                    style={{
                      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                      background: theme.colors.surfaceHover,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.radius.md,
                      color: theme.colors.text,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.xs,
                    }}
                  >
                    <span>{sub.icon}</span>
                    <span>{sub.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Sidebar - Agents */}
        <aside
          style={{
            background: theme.colors.surface,
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.border}`,
            padding: theme.spacing.md,
            overflow: 'auto',
          }}
        >
          <h3 style={{ 
            fontSize: theme.typography.fontSizeMd,
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}>
            Agents ({sphere.agents.length})
          </h3>
          
          {sphere.agents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
              {sphere.agents.map((agent) => (
                <div
                  key={agent.id}
                  style={{
                    padding: theme.spacing.sm,
                    background: theme.colors.surfaceHover,
                    borderRadius: theme.radius.sm,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: agent.avatar.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                    }}
                  >
                    {agent.avatar.icon || '🤖'}
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: theme.typography.fontSizeSm,
                      fontWeight: theme.typography.fontWeightMedium,
                      color: theme.colors.text,
                    }}>
                      {agent.displayName}
                    </div>
                    <div style={{ 
                      fontSize: theme.typography.fontSizeXs,
                      color: theme.colors.textMuted,
                    }}>
                      {agent.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ 
              fontSize: theme.typography.fontSizeSm,
              color: theme.colors.textMuted,
            }}>
              No agents assigned to this sphere.
            </p>
          )}
        </aside>
      </main>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SphereFocusView;
