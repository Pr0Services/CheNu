/**
 * CHE·NU — AMBIENT DECOR SYSTEM
 * ==============================
 * Decor Components
 * 
 * Each component renders a specific decor type.
 * All are PASSIVE - never block interaction, never contain data.
 */

import React, { memo, useMemo } from 'react';
import { useDecor, useDecorFeatures } from './DecorContext';
import { DecorType, ThemeColorHints } from './types';
import './styles/decor.css';

// ============================================================
// SHARED TYPES
// ============================================================

interface DecorComponentProps {
  themeHints?: ThemeColorHints;
  className?: string;
}

// ============================================================
// NEUTRAL SANCTUARY
// ============================================================

export const NeutralSanctuary = memo<DecorComponentProps>(({ themeHints, className }) => {
  const features = useDecorFeatures();
  
  const style = useMemo(() => ({
    '--decor-neutral-accent': themeHints?.accent || '#B8BCCA',
  } as React.CSSProperties), [themeHints]);
  
  return (
    <div className={`decor-neutral ${className || ''}`} style={style}>
      <div className="volume-accent" />
      {features.animations && <div className="light-source" />}
    </div>
  );
});

NeutralSanctuary.displayName = 'NeutralSanctuary';

// ============================================================
// LIVING STRUCTURE (ORGANIC)
// ============================================================

export const LivingStructure = memo<DecorComponentProps>(({ themeHints, className }) => {
  const features = useDecorFeatures();
  
  const style = useMemo(() => ({
    '--decor-organic-primary': themeHints?.primary || '#A8D5BA',
  } as React.CSSProperties), [themeHints]);
  
  return (
    <div className={`decor-organic ${className || ''}`} style={style}>
      <div className="curve-1" />
      <div className="curve-2" />
      {features.animations && <div className="curve-3" />}
    </div>
  );
});

LivingStructure.displayName = 'LivingStructure';

// ============================================================
// COGNITIVE UNIVERSE (COSMIC)
// ============================================================

export const CognitiveUniverse = memo<DecorComponentProps>(({ themeHints, className }) => {
  const features = useDecorFeatures();
  
  return (
    <div className={`decor-cosmic ${className || ''}`}>
      <div className="depth" />
      <div className="horizon" />
      {features.gradients && (
        <>
          <div className="nebula-1" />
          <div className="nebula-2" />
        </>
      )}
    </div>
  );
});

CognitiveUniverse.displayName = 'CognitiveUniverse';

// ============================================================
// SILENT ROOM (FOCUS)
// ============================================================

export const SilentRoom = memo<DecorComponentProps>(({ className }) => {
  const features = useDecorFeatures();
  
  return (
    <div className={`decor-focus ${className || ''}`}>
      <div className="ambient" />
      <div className="vignette" />
      {features.animations && <div className="spotlight" />}
    </div>
  );
});

SilentRoom.displayName = 'SilentRoom';

// ============================================================
// SPATIAL MEETING SANCTUARY (XR)
// ============================================================

export const SpatialMeeting = memo<DecorComponentProps>(({ className }) => {
  const features = useDecorFeatures();
  
  return (
    <div className={`decor-xr ${className || ''}`}>
      {features.geometry3d && <div className="floor" />}
      <div className="pillar-left" />
      <div className="pillar-right" />
      {features.animations && <div className="ambient-light" />}
    </div>
  );
});

SpatialMeeting.displayName = 'SpatialMeeting';

// ============================================================
// DECOR TYPE COMPONENT MAP
// ============================================================

const DECOR_COMPONENTS: Record<DecorType, React.ComponentType<DecorComponentProps>> = {
  neutral: NeutralSanctuary,
  organic: LivingStructure,
  cosmic: CognitiveUniverse,
  focus: SilentRoom,
  xr: SpatialMeeting,
};

// ============================================================
// AGENT AURA OVERLAY
// ============================================================

interface AgentAuraProps {
  color?: string;
  active?: boolean;
  intensity?: number; // 0 to 0.05 (max 5%)
}

export const AgentAuraOverlay = memo<AgentAuraProps>(({ 
  color = '#5DA9FF', 
  active = false,
  intensity = 0.03 
}) => {
  // Enforce max 5% tint
  const safeIntensity = Math.min(intensity, 0.05);
  
  const style: React.CSSProperties = {
    backgroundColor: color,
    opacity: active ? safeIntensity : 0,
  };
  
  return (
    <div 
      className="agent-aura-overlay" 
      data-active={active}
      style={style}
    />
  );
});

AgentAuraOverlay.displayName = 'AgentAuraOverlay';

// ============================================================
// MAIN DECOR LAYER COMPONENT
// ============================================================

interface DecorLayerProps {
  themeHints?: ThemeColorHints;
  agentAura?: AgentAuraProps;
}

export const DecorLayer = memo<DecorLayerProps>(({ themeHints, agentAura }) => {
  const { config, isTransitioning, themeConflict } = useDecor();
  const features = useDecorFeatures();
  
  // Don't render if disabled
  if (!config.enabled) {
    return null;
  }
  
  // Get the appropriate component
  const DecorComponent = DECOR_COMPONENTS[config.type];
  
  // Calculate effective theme hints (reduce saturation on conflict)
  const effectiveHints = useMemo(() => {
    if (!themeHints || !config.inheritThemeColors) return undefined;
    if (themeConflict) {
      // Reduce saturation by converting to grayscale mix
      return {
        ...themeHints,
        primary: desaturate(themeHints.primary, 0.5),
        secondary: desaturate(themeHints.secondary, 0.5),
        accent: desaturate(themeHints.accent, 0.5),
      };
    }
    return themeHints;
  }, [themeHints, config.inheritThemeColors, themeConflict]);
  
  return (
    <div 
      className="decor-layer"
      data-enabled={config.enabled}
      data-transitioning={isTransitioning}
      data-performance={config.performance}
      data-type={config.type}
    >
      <DecorComponent themeHints={effectiveHints} />
      
      {agentAura && (
        <AgentAuraOverlay 
          color={agentAura.color}
          active={agentAura.active}
          intensity={config.agentAuraTint}
        />
      )}
    </div>
  );
});

DecorLayer.displayName = 'DecorLayer';

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Desaturate a hex color
 */
function desaturate(hex: string, amount: number): string {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Calculate gray value
  const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  
  // Mix with gray
  const newR = Math.round(r + (gray - r) * amount);
  const newG = Math.round(g + (gray - g) * amount);
  const newB = Math.round(b + (gray - b) * amount);
  
  // Convert back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// ============================================================
// DECOR CONTROLS COMPONENT
// ============================================================

interface DecorControlsProps {
  showTypeSelector?: boolean;
  showPerformanceSelector?: boolean;
  showEnableToggle?: boolean;
}

export const DecorControls = memo<DecorControlsProps>(({
  showTypeSelector = true,
  showPerformanceSelector = false,
  showEnableToggle = true,
}) => {
  const { 
    config, 
    setDecorType, 
    setEnabled, 
    setPerformance,
    resetToDefaults,
  } = useDecor();
  
  return (
    <div className="decor-controls">
      {showEnableToggle && (
        <label className="decor-control-item">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          <span>Ambient Decor</span>
        </label>
      )}
      
      {showTypeSelector && config.enabled && (
        <div className="decor-control-item">
          <label>Style</label>
          <select 
            value={config.type}
            onChange={(e) => setDecorType(e.target.value as DecorType)}
          >
            <option value="neutral">Neutral Sanctuary</option>
            <option value="organic">Living Structure</option>
            <option value="cosmic">Cognitive Universe</option>
            <option value="focus">Silent Room</option>
            <option value="xr">Spatial Meeting</option>
          </select>
        </div>
      )}
      
      {showPerformanceSelector && (
        <div className="decor-control-item">
          <label>Performance</label>
          <select
            value={config.performance}
            onChange={(e) => setPerformance(e.target.value as any)}
          >
            <option value="high">High (Full effects)</option>
            <option value="medium">Medium (Reduced)</option>
            <option value="low">Low (Static)</option>
            <option value="minimal">Minimal (Flat color)</option>
          </select>
        </div>
      )}
      
      <button onClick={resetToDefaults}>Reset</button>
    </div>
  );
});

DecorControls.displayName = 'DecorControls';

// ============================================================
// EXPORTS
// ============================================================

export {
  NeutralSanctuary,
  LivingStructure,
  CognitiveUniverse,
  SilentRoom,
  SpatialMeeting,
  DECOR_COMPONENTS,
};
