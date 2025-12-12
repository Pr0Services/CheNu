/**
 * CHE·NU — AMBIENT DECOR SYSTEM
 * DecorLayer - Main ambient layer component
 * 
 * This is the primary component to add to your app.
 * It renders below all content and never blocks interaction.
 */

import React, { useEffect, useRef, useState, CSSProperties } from 'react';
import { useDecor } from './DecorContext';
import { DecorRenderer } from './DecorRenderers';
import { DECOR_RULES } from './types';

// ============================================================
// TRANSITION COMPONENT
// ============================================================

interface DecorTransitionProps {
  children: React.ReactNode;
  isTransitioning: boolean;
  progress: number;
}

function DecorTransition({ children, isTransitioning, progress }: DecorTransitionProps) {
  const style: CSSProperties = {
    opacity: isTransitioning ? 1 - progress : 1,
    transition: `opacity ${DECOR_RULES.SPHERE_TRANSITION_MS}ms ease-in-out`,
  };
  
  return <div style={style}>{children}</div>;
}

// ============================================================
// FPS MONITOR (for performance auto-scaling)
// ============================================================

function useFpsMonitor(onFpsUpdate: (fps: number) => void) {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const rafId = useRef<number>();
  
  useEffect(() => {
    const measureFps = () => {
      frameCount.current++;
      const now = performance.now();
      const elapsed = now - lastTime.current;
      
      if (elapsed >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / elapsed);
        onFpsUpdate(fps);
        frameCount.current = 0;
        lastTime.current = now;
      }
      
      rafId.current = requestAnimationFrame(measureFps);
    };
    
    rafId.current = requestAnimationFrame(measureFps);
    
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [onFpsUpdate]);
}

// ============================================================
// AGENT AURA OVERLAY
// ============================================================

interface AgentAuraProps {
  agentId: string;
  color: string;
  isActive: boolean;
  position?: { x: number; y: number };
}

export function AgentAura({ agentId, color, isActive, position }: AgentAuraProps) {
  // Max 5% tint as per rules
  const opacity = isActive ? DECOR_RULES.MAX_AGENT_AURA_TINT : 0;
  
  const style: CSSProperties = {
    position: 'absolute',
    left: position?.x ?? '50%',
    top: position?.y ?? '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
    opacity: isActive ? 1 : 0,
    transition: `opacity ${DECOR_RULES.AGENT_AURA_FADE_MS}ms ease-out`,
    pointerEvents: 'none',
  };
  
  return <div className={`agent-aura agent-aura-${agentId}`} style={style} />;
}

// ============================================================
// MAIN DECOR LAYER COMPONENT
// ============================================================

interface DecorLayerProps {
  /**
   * Optional: Override the current sphere for testing
   */
  sphere?: string;
  
  /**
   * Optional: Disable FPS monitoring
   */
  disableFpsMonitor?: boolean;
  
  /**
   * Optional: Agent auras to display
   */
  agentAuras?: AgentAuraProps[];
  
  /**
   * Optional: Custom z-index (default: 0)
   */
  zIndex?: number;
  
  /**
   * Optional: Additional CSS class
   */
  className?: string;
}

export function DecorLayer({
  sphere,
  disableFpsMonitor = false,
  agentAuras = [],
  zIndex = 0,
  className = '',
}: DecorLayerProps) {
  const { state, setSphere, getConfig } = useDecor();
  const [mounted, setMounted] = useState(false);
  
  // Update sphere if provided
  useEffect(() => {
    if (sphere) {
      setSphere(sphere);
    }
  }, [sphere, setSphere]);
  
  // FPS monitoring for auto-scaling
  useFpsMonitor((fps) => {
    if (!disableFpsMonitor) {
      // Could dispatch FPS update here if needed
      // For now, just log in development
      if (process.env.NODE_ENV === 'development' && fps < 30) {
        console.warn(`[CHE·NU Decor] Low FPS detected: ${fps}`);
      }
    }
  });
  
  // Mount animation
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // If disabled, render nothing but maintain space
  if (!state.enabled) {
    return (
      <div
        className={`decor-layer decor-disabled ${className}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex,
          pointerEvents: 'none',
        }}
      />
    );
  }
  
  const config = getConfig();
  
  const containerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex,
    pointerEvents: 'none', // CRITICAL: Never block interaction
    overflow: 'hidden',
    opacity: mounted ? 1 : 0,
    transition: 'opacity 500ms ease-in-out',
  };
  
  return (
    <div
      className={`decor-layer decor-container ${className}`}
      style={containerStyle}
      aria-hidden="true" // Decorative only
      data-decor-type={state.currentDecor}
      data-decor-state={state.state}
    >
      {/* Main decor renderer */}
      <DecorTransition
        isTransitioning={state.isTransitioning}
        progress={state.transitionProgress}
      >
        <DecorRenderer type={state.currentDecor} config={config} />
      </DecorTransition>
      
      {/* Previous decor (during transition) */}
      {state.isTransitioning && state.previousDecor && (
        <div style={{ opacity: state.transitionProgress }}>
          <DecorRenderer
            type={state.previousDecor}
            config={getConfig()}
          />
        </div>
      )}
      
      {/* Agent auras */}
      {agentAuras.map((aura) => (
        <AgentAura key={aura.agentId} {...aura} />
      ))}
      
      {/* Performance mode indicator (dev only) */}
      {process.env.NODE_ENV === 'development' && state.performanceMode !== 'full' && (
        <div style={{
          position: 'absolute',
          bottom: 5,
          right: 5,
          fontSize: 10,
          color: '#666',
          opacity: 0.5,
        }}>
          Decor: {state.performanceMode}
        </div>
      )}
    </div>
  );
}

// ============================================================
// DECOR CONTROLS COMPONENT
// ============================================================

interface DecorControlsProps {
  showLabels?: boolean;
  compact?: boolean;
  className?: string;
}

export function DecorControls({
  showLabels = true,
  compact = false,
  className = '',
}: DecorControlsProps) {
  const {
    state,
    enable,
    disable,
    lockToDefault,
    unlock,
    resetPreferences,
  } = useDecor();
  
  const buttonStyle: CSSProperties = {
    padding: compact ? '4px 8px' : '8px 16px',
    fontSize: compact ? 12 : 14,
    border: '1px solid #ddd',
    borderRadius: 4,
    background: '#fff',
    cursor: 'pointer',
    marginRight: 8,
  };
  
  return (
    <div className={`decor-controls ${className}`} style={{ display: 'flex', alignItems: 'center' }}>
      {showLabels && (
        <span style={{ marginRight: 12, fontSize: compact ? 12 : 14, color: '#666' }}>
          Decor:
        </span>
      )}
      
      {state.enabled ? (
        <button onClick={disable} style={buttonStyle} title="Disable decor">
          {compact ? '🚫' : '🚫 Disable'}
        </button>
      ) : (
        <button onClick={enable} style={buttonStyle} title="Enable decor">
          {compact ? '✓' : '✓ Enable'}
        </button>
      )}
      
      {state.lockedToDefault ? (
        <button onClick={unlock} style={buttonStyle} title="Unlock decor">
          {compact ? '🔓' : '🔓 Unlock'}
        </button>
      ) : (
        <button onClick={lockToDefault} style={buttonStyle} title="Lock to default">
          {compact ? '🔒' : '🔒 Lock Default'}
        </button>
      )}
      
      <button onClick={resetPreferences} style={buttonStyle} title="Reset all preferences">
        {compact ? '↺' : '↺ Reset'}
      </button>
      
      {showLabels && (
        <span style={{ marginLeft: 12, fontSize: compact ? 10 : 12, color: '#999' }}>
          {state.currentDecor} | {state.performanceMode}
        </span>
      )}
    </div>
  );
}

// ============================================================
// SPHERE DECOR SELECTOR
// ============================================================

interface SphereDecorSelectorProps {
  sphere: string;
  className?: string;
}

export function SphereDecorSelector({ sphere, className = '' }: SphereDecorSelectorProps) {
  const { state, setSpherePreference, getDecorForSphere } = useDecor();
  
  const currentDecor = getDecorForSphere(sphere);
  const decorTypes = ['neutral', 'organic', 'cosmic', 'focus', 'xr'] as const;
  
  return (
    <div className={`sphere-decor-selector ${className}`}>
      <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
        Decor for {sphere}:
      </label>
      <select
        value={state.spherePreferences[sphere] || ''}
        onChange={(e) => {
          if (e.target.value) {
            setSpherePreference(sphere, e.target.value as any);
          }
        }}
        disabled={state.lockedToDefault}
        style={{
          padding: '8px 12px',
          fontSize: 14,
          borderRadius: 4,
          border: '1px solid #ddd',
          width: '100%',
        }}
      >
        <option value="">Default ({currentDecor})</option>
        {decorTypes.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export default DecorLayer;
