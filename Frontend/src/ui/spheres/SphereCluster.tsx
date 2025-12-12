/* =====================================================
   CHE·NU — Sphere Cluster Component
   ui/spheres/SphereCluster.tsx
   ===================================================== */

import React from 'react';
import { SphereCard } from './SphereCard';
import { SphereData, SphereClusterProps } from './sphereCard.types';
import { limitSpheres, computePositions } from './sphereCluster.utils';
import { getTheme } from '@/core/theme/themeEngine';

export const SphereCluster: React.FC<SphereClusterProps> = ({
  spheres,
  focusedSphereId,
  layout = 'radial',
  onFocus,
  onEnter,
}) => {
  const theme = getTheme();
  const visibleSpheres = limitSpheres(spheres);
  const positions = computePositions(visibleSpheres.length, layout === 'grid' ? 'grid' : 'radial');

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 600,
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
    >
      {/* Orbit rings (visual guide) */}
      {layout === 'radial' && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}>
          {[180, 220].map((radius) => (
            <div
              key={radius}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: radius * 2,
                height: radius * 2,
                borderRadius: '50%',
                border: `1px dashed ${theme.colors.border}`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* Spheres */}
      {visibleSpheres.map((sphere, index) => {
        const pos = positions[index];
        const isFocused = sphere.id === focusedSphereId;
        const depthOffset = sphere.normalizedDimension * 40;

        return (
          <div
            key={sphere.id}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `
                translate(-50%, -50%)
                translate(${pos.x}px, ${pos.y}px)
                translateZ(${depthOffset}px)
                scale(${isFocused ? 1.12 : 1})
              `,
              opacity: focusedSphereId && !isFocused ? 0.4 : 1,
              transition: `transform 0.4s ${theme.animation.easingDefault}, opacity 0.4s ease`,
              zIndex: isFocused ? 10 : Math.round((1 - sphere.normalizedDimension) * 5),
            }}
          >
            <SphereCard 
              sphere={sphere} 
              isFocused={isFocused}
              onFocus={onFocus} 
              onEnter={onEnter} 
            />
          </div>
        );
      })}

      {/* Center indicator */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: theme.colors.secondary,
          boxShadow: `0 0 20px ${theme.colors.secondary}60`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default SphereCluster;
