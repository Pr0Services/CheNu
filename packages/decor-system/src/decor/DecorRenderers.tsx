/**
 * CHE·NU — AMBIENT DECOR SYSTEM
 * Decor Renderers - Visual components for each decor type
 * 
 * These components render ONLY visual decoration.
 * They contain NO logic, NO data, NO interaction.
 */

import React, { useMemo, CSSProperties } from 'react';
import { DecorConfig, DecorType } from './types';

// ============================================================
// SHARED STYLES
// ============================================================

const baseLayerStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none', // CRITICAL: Never block interaction
  overflow: 'hidden',
  zIndex: 0, // Below all content
};

// ============================================================
// ANIMATION KEYFRAMES (as CSS strings for injection)
// ============================================================

const KEYFRAMES = `
  @keyframes decor-breathe {
    0%, 100% { transform: scale(1); opacity: var(--decor-opacity); }
    50% { transform: scale(1.02); opacity: calc(var(--decor-opacity) * 1.1); }
  }
  
  @keyframes decor-drift {
    0% { transform: translate(0, 0); }
    25% { transform: translate(2%, 1%); }
    50% { transform: translate(0, 2%); }
    75% { transform: translate(-2%, 1%); }
    100% { transform: translate(0, 0); }
  }
  
  @keyframes decor-pulse {
    0%, 100% { opacity: var(--decor-opacity); }
    50% { opacity: calc(var(--decor-opacity) * 0.85); }
  }
  
  @keyframes decor-glow {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.05); }
  }
`;

// Inject keyframes once
if (typeof document !== 'undefined') {
  const styleId = 'chenu-decor-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = KEYFRAMES;
    document.head.appendChild(style);
  }
}

// ============================================================
// ANIMATION HELPERS
// ============================================================

function getAnimationDuration(speed: 'ultra-slow' | 'slow' | 'medium'): string {
  switch (speed) {
    case 'ultra-slow': return '30s';
    case 'slow': return '20s';
    case 'medium': return '15s';
    default: return '30s';
  }
}

function getAnimationName(type: 'breathe' | 'drift' | 'pulse' | 'none'): string {
  switch (type) {
    case 'breathe': return 'decor-breathe';
    case 'drift': return 'decor-drift';
    case 'pulse': return 'decor-pulse';
    default: return 'none';
  }
}

// ============================================================
// NEUTRAL SANCTUARY RENDERER
// ============================================================

interface NeutralDecorProps {
  config: DecorConfig;
}

export function NeutralDecor({ config }: NeutralDecorProps) {
  const { colorHints, animation, opacity, saturation } = config;
  
  const style = useMemo((): CSSProperties => ({
    ...baseLayerStyle,
    '--decor-opacity': opacity,
    background: `
      linear-gradient(
        135deg,
        ${colorHints.primary} 0%,
        ${colorHints.secondary} 50%,
        ${colorHints.accent} 100%
      )
    `,
    opacity,
    filter: `saturate(${saturation})`,
    animation: animation.enabled
      ? `${getAnimationName(animation.type)} ${getAnimationDuration(animation.speed)} ease-in-out infinite`
      : 'none',
  } as CSSProperties), [colorHints, animation, opacity, saturation]);
  
  return (
    <div className="decor-layer decor-neutral" style={style}>
      {/* Abstract architectural shapes */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '30%',
        height: '60%',
        background: `linear-gradient(180deg, ${colorHints.glow}40 0%, transparent 100%)`,
        borderRadius: '2px',
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '25%',
        height: '50%',
        background: `linear-gradient(180deg, ${colorHints.glow}30 0%, transparent 100%)`,
        borderRadius: '2px',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '40%',
        width: '35%',
        height: '40%',
        background: `linear-gradient(180deg, ${colorHints.glow}20 0%, transparent 100%)`,
        borderRadius: '2px',
      }} />
    </div>
  );
}

// ============================================================
// ORGANIC LIVING STRUCTURE RENDERER
// ============================================================

interface OrganicDecorProps {
  config: DecorConfig;
}

export function OrganicDecor({ config }: OrganicDecorProps) {
  const { colorHints, animation, opacity, saturation } = config;
  
  const style = useMemo((): CSSProperties => ({
    ...baseLayerStyle,
    '--decor-opacity': opacity,
    background: `
      radial-gradient(
        ellipse at 30% 20%,
        ${colorHints.primary}60 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 70% 80%,
        ${colorHints.secondary}50 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 50% 50%,
        ${colorHints.accent}30 0%,
        transparent 70%
      ),
      ${colorHints.glow}
    `,
    opacity,
    filter: `saturate(${saturation})`,
    animation: animation.enabled
      ? `${getAnimationName(animation.type)} ${getAnimationDuration(animation.speed)} ease-in-out infinite`
      : 'none',
  } as CSSProperties), [colorHints, animation, opacity, saturation]);
  
  return (
    <div className="decor-layer decor-organic" style={style}>
      {/* Organic blob shapes */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.3,
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <ellipse
          cx="25"
          cy="30"
          rx="20"
          ry="25"
          fill={colorHints.accent}
          opacity="0.4"
        />
        <ellipse
          cx="75"
          cy="70"
          rx="25"
          ry="20"
          fill={colorHints.secondary}
          opacity="0.3"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="30"
          ry="30"
          fill={colorHints.primary}
          opacity="0.2"
        />
      </svg>
    </div>
  );
}

// ============================================================
// COSMIC UNIVERSE RENDERER
// ============================================================

interface CosmicDecorProps {
  config: DecorConfig;
}

export function CosmicDecor({ config }: CosmicDecorProps) {
  const { colorHints, animation, opacity, saturation } = config;
  
  const style = useMemo((): CSSProperties => ({
    ...baseLayerStyle,
    '--decor-opacity': opacity,
    background: `
      radial-gradient(
        ellipse at 50% 100%,
        ${colorHints.glow}40 0%,
        ${colorHints.accent}20 30%,
        ${colorHints.secondary}10 60%,
        ${colorHints.primary} 100%
      )
    `,
    opacity,
    filter: `saturate(${saturation})`,
    animation: animation.enabled
      ? `${getAnimationName(animation.type)} ${getAnimationDuration(animation.speed)} ease-in-out infinite`
      : 'none',
  } as CSSProperties), [colorHints, animation, opacity, saturation]);
  
  return (
    <div className="decor-layer decor-cosmic" style={style}>
      {/* Subtle nebula gradients - NO stars, NO sci-fi clichés */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '40%',
        height: '40%',
        background: `radial-gradient(circle, ${colorHints.accent}15 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '30%',
        right: '15%',
        width: '35%',
        height: '35%',
        background: `radial-gradient(circle, ${colorHints.glow}10 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(50px)',
      }} />
      {/* Horizon line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: `linear-gradient(0deg, ${colorHints.glow}30 0%, transparent 100%)`,
      }} />
    </div>
  );
}

// ============================================================
// FOCUS / SILENT ROOM RENDERER
// ============================================================

interface FocusDecorProps {
  config: DecorConfig;
}

export function FocusDecor({ config }: FocusDecorProps) {
  const { colorHints, opacity, saturation } = config;
  
  // Focus mode has NO animation by design
  const style = useMemo((): CSSProperties => ({
    ...baseLayerStyle,
    background: `
      radial-gradient(
        ellipse at 50% 30%,
        ${colorHints.secondary} 0%,
        ${colorHints.primary} 50%,
        ${colorHints.glow} 100%
      )
    `,
    opacity,
    filter: `saturate(${saturation})`,
  }), [colorHints, opacity, saturation]);
  
  return (
    <div className="decor-layer decor-focus" style={style}>
      {/* Soft focused light from above */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '30%',
        width: '40%',
        height: '50%',
        background: `radial-gradient(ellipse, ${colorHints.accent}20 0%, transparent 70%)`,
        filter: 'blur(30px)',
      }} />
    </div>
  );
}

// ============================================================
// XR SPATIAL SANCTUARY RENDERER
// ============================================================

interface XRDecorProps {
  config: DecorConfig;
}

export function XRDecor({ config }: XRDecorProps) {
  const { colorHints, animation, opacity, saturation } = config;
  
  const style = useMemo((): CSSProperties => ({
    ...baseLayerStyle,
    '--decor-opacity': opacity,
    background: `
      linear-gradient(
        180deg,
        ${colorHints.primary} 0%,
        ${colorHints.secondary} 50%,
        ${colorHints.glow} 100%
      )
    `,
    opacity,
    filter: `saturate(${saturation})`,
    animation: animation.enabled
      ? `${getAnimationName(animation.type)} ${getAnimationDuration(animation.speed)} ease-in-out infinite`
      : 'none',
  } as CSSProperties), [colorHints, animation, opacity, saturation]);
  
  return (
    <div className="decor-layer decor-xr" style={style}>
      {/* Symbolic architectural elements */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '10%',
        width: '15%',
        height: '60%',
        background: `linear-gradient(180deg, transparent 0%, ${colorHints.accent}30 100%)`,
        borderRadius: '4px 4px 0 0',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: '10%',
        width: '15%',
        height: '60%',
        background: `linear-gradient(180deg, transparent 0%, ${colorHints.accent}30 100%)`,
        borderRadius: '4px 4px 0 0',
      }} />
      {/* Floor reflection */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '20%',
        background: `linear-gradient(0deg, ${colorHints.glow}40 0%, transparent 100%)`,
      }} />
    </div>
  );
}

// ============================================================
// DECOR RENDERER FACTORY
// ============================================================

interface DecorRendererProps {
  type: DecorType;
  config: DecorConfig;
}

export function DecorRenderer({ type, config }: DecorRendererProps) {
  switch (type) {
    case 'neutral':
      return <NeutralDecor config={config} />;
    case 'organic':
      return <OrganicDecor config={config} />;
    case 'cosmic':
      return <CosmicDecor config={config} />;
    case 'focus':
      return <FocusDecor config={config} />;
    case 'xr':
      return <XRDecor config={config} />;
    default:
      return <NeutralDecor config={config} />;
  }
}

// ============================================================
// EXPORTS
// ============================================================

export {
  NeutralDecor,
  OrganicDecor,
  CosmicDecor,
  FocusDecor,
  XRDecor,
};
