/* =====================================================
   CHE·NU — Mobile Universe View
   
   Mobile-optimized 3D universe visualization.
   ===================================================== */

import React, { useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

import { useResponsive } from './useResponsive';
import { useTouchGestures } from './useTouchGestures';
import { TouchGesture } from './mobile.types';

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────

export interface MobileUniverseViewProps {
  children?: React.ReactNode;
  onSphereSelect?: (sphereId: string) => void;
  onNavigate?: (direction: 'back' | 'home') => void;
}

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function MobileUniverseView({
  children,
  onSphereSelect,
  onNavigate,
}: MobileUniverseViewProps) {
  const { isMobile, isTablet, config, breakpoint, width, height } = useResponsive();
  const [cameraZoom, setCameraZoom] = useState(5);

  // Touch gesture handling
  const { handlers, scale, delta } = useTouchGestures({
    onGesture: (event) => {
      switch (event.gesture) {
        case 'swipe_right':
          onNavigate?.('back');
          break;
        case 'pinch_in':
          setCameraZoom(prev => Math.min(prev + 1, 10));
          break;
        case 'pinch_out':
          setCameraZoom(prev => Math.max(prev - 1, 2));
          break;
        case 'double_tap':
          // Reset zoom
          setCameraZoom(5);
          break;
      }
    },
  });

  // Optimized rendering settings
  const renderSettings = useMemo(() => {
    if (isMobile) {
      return {
        antialias: false,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        shadows: false,
        dpr: [1, 1.5] as [number, number],
      };
    }
    return {
      antialias: true,
      pixelRatio: window.devicePixelRatio,
      shadows: true,
      dpr: [1, 2] as [number, number],
    };
  }, [isMobile]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        touchAction: 'none',
      }}
      {...handlers}
    >
      <Canvas
        gl={{
          antialias: renderSettings.antialias,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
        dpr={renderSettings.dpr}
        shadows={renderSettings.shadows}
        style={{ background: '#0a0a1a' }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 2, cameraZoom]}
          fov={isMobile ? 75 : 60}
        />

        <OrbitControls
          enablePan={!isMobile}
          enableZoom={!isMobile} // Use pinch instead
          enableRotate={true}
          rotateSpeed={isMobile ? 0.5 : 1}
          minDistance={2}
          maxDistance={10}
          maxPolarAngle={Math.PI * 0.85}
        />

        {/* Lighting - simplified for mobile */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.8}
          castShadow={!isMobile}
        />

        {/* Content */}
        {children}
      </Canvas>

      {/* Mobile Controls Overlay */}
      {isMobile && (
        <MobileControlsOverlay
          onBack={() => onNavigate?.('back')}
          onHome={() => onNavigate?.('home')}
          onZoomIn={() => setCameraZoom(prev => Math.min(prev + 1, 10))}
          onZoomOut={() => setCameraZoom(prev => Math.max(prev - 1, 2))}
        />
      )}

      {/* Bottom Sheet (mobile only) */}
      {isMobile && (
        <MobileBottomSheet />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// MOBILE CONTROLS OVERLAY
// ─────────────────────────────────────────────────────

interface MobileControlsOverlayProps {
  onBack: () => void;
  onHome: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

function MobileControlsOverlay({
  onBack,
  onHome,
  onZoomIn,
  onZoomOut,
}: MobileControlsOverlayProps) {
  return (
    <>
      {/* Top bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
        pointerEvents: 'none',
      }}>
        <button
          onClick={onBack}
          style={{
            ...buttonStyle,
            pointerEvents: 'auto',
          }}
        >
          ⬅️ Retour
        </button>

        <button
          onClick={onHome}
          style={{
            ...buttonStyle,
            pointerEvents: 'auto',
          }}
        >
          🏠
        </button>
      </div>

      {/* Zoom controls */}
      <div style={{
        position: 'absolute',
        right: 16,
        bottom: 120,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <button onClick={onZoomIn} style={buttonStyle}>➕</button>
        <button onClick={onZoomOut} style={buttonStyle}>➖</button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────
// MOBILE BOTTOM SHEET
// ─────────────────────────────────────────────────────

function MobileBottomSheet() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(20, 20, 30, 0.95)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        transform: `translateY(${isExpanded ? 0 : 60}%)`,
        transition: 'transform 0.3s ease-out',
        minHeight: 200,
        maxHeight: '70vh',
      }}
    >
      {/* Handle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '12px 0',
          display: 'flex',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: 40,
          height: 4,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.3)',
        }} />
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px 20px' }}>
        <h3 style={{
          color: '#fff',
          fontSize: 16,
          margin: '0 0 12px 0',
        }}>
          Actions rapides
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}>
          {[
            { icon: '🏠', label: 'Accueil' },
            { icon: '🔍', label: 'Recherche' },
            { icon: '👥', label: 'Réunion' },
            { icon: '⚙️', label: 'Paramètres' },
          ].map(item => (
            <button
              key={item.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: 12,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <span style={{ fontSize: 11, opacity: 0.8 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────

const buttonStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 20,
  background: 'rgba(0,0,0,0.5)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: 14,
  cursor: 'pointer',
  minWidth: 44,
  minHeight: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default MobileUniverseView;
