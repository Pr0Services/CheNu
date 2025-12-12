/* =====================================================
   CHE·NU — XR MEETING ROOM THEME OVERRIDE
   Scope: XR / Spatial UI / Meeting Rooms
   
   📜 GUARANTEES:
   - XR override affects VISUALS only
   - No access to agents logic
   - No access to orchestration
   - No decision influence
   ===================================================== */

import { useMemo } from 'react';
import { useTheme, type ThemeID } from './theme.config';

/* -------------------------
   TYPES
------------------------- */

export type XRGeometry = 'flat' | 'rounded' | 'floating' | 'massive';
export type XRCameraMotion = 'static' | 'slow_drift' | 'orbit';
export type XRPanelStyle = 'flat' | 'layered' | 'holographic';
export type XRAvatarStyle = 'abstract' | 'stylized' | 'none';
export type XRAvatarScale = 'human' | 'symbolic';

export interface XRCameraConfig {
  motion: XRCameraMotion;
  horizon: 'stable';
  fov?: number;
  nearClip?: number;
  farClip?: number;
}

export interface XRPanelConfig {
  style: XRPanelStyle;
  opacity: number;
  blur?: boolean;
  borderRadius?: number;
  glowIntensity?: number;
}

export interface XRAvatarConfig {
  enabled: boolean;
  style?: XRAvatarStyle;
  scale?: XRAvatarScale;
  distance: 'personal_safe';
  expressionsEnabled?: boolean;
  gazeTracking?: boolean;
}

export interface XRMeetingTheme {
  /** Environment preset name */
  environment: string;
  /** Lighting preset */
  lighting: string;
  /** Ambient sound/feel */
  ambience: string;
  /** Overall geometry style */
  geometry: XRGeometry;
  /** Camera configuration */
  camera: XRCameraConfig;
  /** Panel/UI configuration */
  panels: XRPanelConfig;
  /** Avatar configuration */
  avatars: XRAvatarConfig;
  /** Optional particle effects */
  particles?: {
    enabled: boolean;
    density?: 'low' | 'medium' | 'high';
    type?: 'dust' | 'stars' | 'none';
  };
  /** Optional fog/atmosphere */
  atmosphere?: {
    enabled: boolean;
    density?: number;
    color?: string;
  };
}

/* =========================================================
   XR THEME OVERRIDES
   
   Each theme has a specific XR meeting room configuration.
   These are VISUAL ONLY — no logic changes.
   ========================================================= */

export const XR_MEETING_OVERRIDES: Record<ThemeID, XRMeetingTheme> = {
  /* -----------------------------------------
     REALISTIC / PROFESSIONAL
     Clean, neutral, distraction-free
  ----------------------------------------- */
  realistic_professional: {
    environment: 'clean_control_room',
    lighting: 'neutral_diffuse',
    ambience: 'silent',
    geometry: 'flat',
    camera: {
      motion: 'static',
      horizon: 'stable',
      fov: 60,
    },
    panels: {
      style: 'flat',
      opacity: 1,
      borderRadius: 4,
    },
    avatars: {
      enabled: false,
      distance: 'personal_safe',
    },
    particles: {
      enabled: false,
    },
    atmosphere: {
      enabled: false,
    },
  },

  /* -----------------------------------------
     AVATAR / HUMAN CENTERED
     Warm, presence-focused, collaborative
  ----------------------------------------- */
  avatar_human_centered: {
    environment: 'circular_meeting_space',
    lighting: 'warm_diffuse',
    ambience: 'soft_presence',
    geometry: 'rounded',
    camera: {
      motion: 'slow_drift',
      horizon: 'stable',
      fov: 65,
    },
    panels: {
      style: 'layered',
      opacity: 0.95,
      blur: true,
      borderRadius: 12,
    },
    avatars: {
      enabled: true,
      style: 'stylized',
      scale: 'human',
      distance: 'personal_safe',
      expressionsEnabled: true,
      gazeTracking: true,
    },
    particles: {
      enabled: true,
      density: 'low',
      type: 'dust',
    },
    atmosphere: {
      enabled: true,
      density: 0.1,
      color: '#f5f1eb',
    },
  },

  /* -----------------------------------------
     ANCIENT / BUILDER
     Monumental, grounded, timeless
  ----------------------------------------- */
  ancient_builder: {
    environment: 'stone_temple_hall',
    lighting: 'natural_sunlight',
    ambience: 'grounded_silence',
    geometry: 'massive',
    camera: {
      motion: 'static',
      horizon: 'stable',
      fov: 55,
    },
    panels: {
      style: 'flat',
      opacity: 1,
      borderRadius: 0,
    },
    avatars: {
      enabled: false,
      distance: 'personal_safe',
    },
    particles: {
      enabled: true,
      density: 'low',
      type: 'dust',
    },
    atmosphere: {
      enabled: true,
      density: 0.05,
      color: '#c4b5a5',
    },
  },

  /* -----------------------------------------
     COSMIC / ABSTRACT
     Expansive, floating, contemplative
  ----------------------------------------- */
  cosmic_abstract: {
    environment: 'open_cosmic_space',
    lighting: 'soft_luminous',
    ambience: 'void_calm',
    geometry: 'floating',
    camera: {
      motion: 'slow_drift',
      horizon: 'stable',
      fov: 75,
    },
    panels: {
      style: 'holographic',
      opacity: 0.85,
      blur: true,
      glowIntensity: 0.3,
    },
    avatars: {
      enabled: false,
      distance: 'personal_safe',
    },
    particles: {
      enabled: true,
      density: 'medium',
      type: 'stars',
    },
    atmosphere: {
      enabled: true,
      density: 0.2,
      color: '#0b1020',
    },
  },

  /* -----------------------------------------
     FUTURIST / SYSTEMIC
     Precise, modular, information-dense
  ----------------------------------------- */
  futurist_systemic: {
    environment: 'system_command_center',
    lighting: 'cool_precision',
    ambience: 'low_hum',
    geometry: 'flat',
    camera: {
      motion: 'static',
      horizon: 'stable',
      fov: 60,
    },
    panels: {
      style: 'layered',
      opacity: 1,
      borderRadius: 2,
      glowIntensity: 0.1,
    },
    avatars: {
      enabled: false,
      distance: 'personal_safe',
    },
    particles: {
      enabled: false,
    },
    atmosphere: {
      enabled: true,
      density: 0.05,
      color: '#020617',
    },
  },
};

/* =========================================================
   HOOKS
   ========================================================= */

/**
 * Get XR meeting theme based on current theme.
 */
export function useXRMeetingTheme(): XRMeetingTheme {
  const { themeId } = useTheme();

  return useMemo(
    () =>
      XR_MEETING_OVERRIDES[themeId] ||
      XR_MEETING_OVERRIDES.realistic_professional,
    [themeId]
  );
}

/**
 * Get specific XR meeting theme by ID.
 */
export function getXRMeetingTheme(themeId: ThemeID): XRMeetingTheme {
  return (
    XR_MEETING_OVERRIDES[themeId] ||
    XR_MEETING_OVERRIDES.realistic_professional
  );
}

/**
 * Get camera configuration for current theme.
 */
export function useXRCamera(): XRCameraConfig {
  const theme = useXRMeetingTheme();
  return theme.camera;
}

/**
 * Get panel configuration for current theme.
 */
export function useXRPanels(): XRPanelConfig {
  const theme = useXRMeetingTheme();
  return theme.panels;
}

/**
 * Get avatar configuration for current theme.
 */
export function useXRAvatars(): XRAvatarConfig {
  const theme = useXRMeetingTheme();
  return theme.avatars;
}

/* =========================================================
   XR ENGINE ADAPTER
   ========================================================= */

/**
 * Apply XR meeting theme to an XR engine.
 * This is a generic adapter — implement per engine.
 */
export interface XREngineAdapter {
  setEnvironment(name: string): void;
  setLighting(preset: string): void;
  setCamera(config: XRCameraConfig): void;
  setPanels(config: XRPanelConfig): void;
  setAvatars(config: XRAvatarConfig): void;
  setParticles?(config: XRMeetingTheme['particles']): void;
  setAtmosphere?(config: XRMeetingTheme['atmosphere']): void;
}

/**
 * Apply full XR meeting theme to engine.
 */
export function applyXRMeetingTheme(
  engine: XREngineAdapter,
  theme: XRMeetingTheme
): void {
  engine.setEnvironment(theme.environment);
  engine.setLighting(theme.lighting);
  engine.setCamera(theme.camera);
  engine.setPanels(theme.panels);
  engine.setAvatars(theme.avatars);

  if (engine.setParticles && theme.particles) {
    engine.setParticles(theme.particles);
  }

  if (engine.setAtmosphere && theme.atmosphere) {
    engine.setAtmosphere(theme.atmosphere);
  }
}

/* =========================================================
   THREE.JS / R3F HELPERS
   ========================================================= */

/**
 * Get Three.js-compatible lighting config.
 */
export function getThreeLightingConfig(theme: XRMeetingTheme): {
  ambient: { intensity: number; color: string };
  directional: { intensity: number; position: [number, number, number] };
} {
  const lightingPresets: Record<string, any> = {
    neutral_diffuse: {
      ambient: { intensity: 0.6, color: '#ffffff' },
      directional: { intensity: 0.4, position: [2, 4, 2] },
    },
    warm_diffuse: {
      ambient: { intensity: 0.5, color: '#fff5eb' },
      directional: { intensity: 0.5, position: [1, 3, 2] },
    },
    natural_sunlight: {
      ambient: { intensity: 0.3, color: '#ffe4c4' },
      directional: { intensity: 0.8, position: [5, 10, 3] },
    },
    soft_luminous: {
      ambient: { intensity: 0.4, color: '#e0e7ff' },
      directional: { intensity: 0.2, position: [0, 5, 0] },
    },
    cool_precision: {
      ambient: { intensity: 0.5, color: '#e0f2fe' },
      directional: { intensity: 0.5, position: [2, 4, 2] },
    },
  };

  return (
    lightingPresets[theme.lighting] || lightingPresets.neutral_diffuse
  );
}

/**
 * Get fog configuration for Three.js.
 */
export function getThreeFogConfig(
  theme: XRMeetingTheme
): { color: string; near: number; far: number } | null {
  if (!theme.atmosphere?.enabled) return null;

  const density = theme.atmosphere.density ?? 0.1;
  const color = theme.atmosphere.color ?? '#000000';

  return {
    color,
    near: 10 / density,
    far: 50 / density,
  };
}

/* =========================================================
   EXPORTS
   ========================================================= */

export const DEFAULT_XR_MEETING_THEME =
  XR_MEETING_OVERRIDES.realistic_professional;
