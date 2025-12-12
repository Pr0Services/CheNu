// =============================================================================
// CHE·NU — UNIVERSE CONFIGURATION
// Foundation Freeze V1
// =============================================================================
// Configuration de la Vue Univers (2D / 3D / XR)
// Règles visuelles canoniques
// =============================================================================

import { CoreConfig, UniverseConfig, ViewMode, SphereVisualState } from '../types';
import { ALL_SPHERES } from './spheres.config';
import { ALL_AGENTS } from './agents.config';

// -----------------------------------------------------------------------------
// CORE (TRUNK) CONFIGURATION
// -----------------------------------------------------------------------------

export const CORE_CONFIG: CoreConfig = {
  label: 'CORE',
  emoji: '🌳',
  color: '#A855F7',           // Purple
  glowColor: '#C084FC',
  size: 1.5
};

// -----------------------------------------------------------------------------
// VISUAL RULES — CANONICAL (DO NOT MODIFY)
// -----------------------------------------------------------------------------

/**
 * Règles visuelles globales
 * "Les visuels reflètent l'ÉTAT de l'information, jamais la décoration."
 */
export const VISUAL_RULES = {
  // Principes fondamentaux
  principles: {
    sizeEqualsImportance: true,       // Taille = importance + densité
    motionEqualsActivity: true,       // Mouvement = activité
    proximityEqualsRelevance: true,   // Proximité = pertinence contextuelle
    silenceEqualsStability: true,     // Silence = stabilité (pas de mouvement = sain)
    readabilityUnder3Seconds: true    // Hiérarchie visuelle lisible en < 3 secondes
  },
  
  // Core (Trunk)
  core: {
    alwaysCentered: true,
    stableGlow: true,
    noRotation: true,                 // Représente l'invariance
    actsAsVisualAnchor: true
  },
  
  // Sphères
  spheres: {
    renderedAsNodes: true,
    radiusFromCoreEqualsDepth: true,
    sizeScalesWithVolume: true,
    sizeScalesWithActiveCategories: true,
    colorIsCanonical: true,           // Couleur fixée par sphère
    motionIncreasesWithActivity: true
  },
  
  // Agents
  agents: {
    renderedAsOrbitingEntities: true,
    orbitSpeedEqualsUrgency: true,
    orbitStabilityEqualsConfidence: true,
    deviationIndicatesWarning: true
  }
};

// -----------------------------------------------------------------------------
// SPHERE VISUAL STATES — Colors & Effects
// -----------------------------------------------------------------------------

/**
 * Configuration visuelle par état de sphère
 * Chaque état doit être distinguable SANS texte
 */
export const SPHERE_STATE_VISUALS: Record<SphereVisualState, {
  glowIntensity: number;
  pulseSpeed: number;
  saturation: number;
  opacity: number;
  borderStyle: string;
}> = {
  idle: {
    glowIntensity: 0.2,
    pulseSpeed: 0,
    saturation: 0.8,
    opacity: 0.9,
    borderStyle: 'solid'
  },
  active: {
    glowIntensity: 0.5,
    pulseSpeed: 1,
    saturation: 1,
    opacity: 1,
    borderStyle: 'solid'
  },
  saturated: {
    glowIntensity: 0.8,
    pulseSpeed: 2,
    saturation: 1.2,
    opacity: 1,
    borderStyle: 'double'
  },
  'attention-needed': {
    glowIntensity: 0.9,
    pulseSpeed: 3,
    saturation: 1.1,
    opacity: 1,
    borderStyle: 'dashed'
  }
};

// -----------------------------------------------------------------------------
// VIEW MODE CONFIGURATIONS
// -----------------------------------------------------------------------------

/**
 * Configuration spécifique par mode de vue
 */
export const VIEW_MODE_CONFIG: Record<ViewMode, {
  camera: {
    defaultAngle: number;
    zoomMin: number;
    zoomMax: number;
    zoomDefault: number;
  };
  transitions: {
    duration: number;
    easing: string;
  };
  spheres: {
    sizeFactor: number;
    detailLevel: 'low' | 'medium' | 'high';
  };
  agents: {
    speedFactor: number;
    visibility: 'all' | 'active' | 'focused';
  };
}> = {
  '2d': {
    camera: {
      defaultAngle: 0,
      zoomMin: 0.5,
      zoomMax: 3,
      zoomDefault: 1
    },
    transitions: {
      duration: 300,
      easing: 'ease-out'
    },
    spheres: {
      sizeFactor: 0.8,
      detailLevel: 'medium'
    },
    agents: {
      speedFactor: 1,
      visibility: 'active'
    }
  },
  '3d': {
    camera: {
      defaultAngle: Math.PI / 6,  // Vue inclinée par défaut
      zoomMin: 0.3,
      zoomMax: 5,
      zoomDefault: 1
    },
    transitions: {
      duration: 400,
      easing: 'ease-in-out'
    },
    spheres: {
      sizeFactor: 1,
      detailLevel: 'high'
    },
    agents: {
      speedFactor: 1.1,
      visibility: 'all'
    }
  },
  'xr': {
    camera: {
      defaultAngle: 0,
      zoomMin: 0.5,
      zoomMax: 2,
      zoomDefault: 1
    },
    transitions: {
      duration: 500,
      easing: 'ease-out'
    },
    spheres: {
      sizeFactor: 1.1,
      detailLevel: 'high'
    },
    agents: {
      speedFactor: 0.7,  // Plus lent pour lisibilité XR
      visibility: 'all'
    }
  }
};

// -----------------------------------------------------------------------------
// TRANSITION RULES
// -----------------------------------------------------------------------------

/**
 * Règles de transition entre les vues
 * Les transitions doivent être fluides, jamais abruptes
 */
export const TRANSITION_RULES = {
  // 2D ↔ 3D ↔ XR: Mêmes données, différente représentation
  sameData: true,
  sameHierarchy: true,
  differentRepresentationOnly: true,
  
  // Règles d'auto-switch
  autoSwitch: {
    lowPowerDevice: '2d',
    desktop: '3d',
    headset: 'xr'
  },
  
  // Interpolation
  interpolation: {
    type: 'smooth',
    noHardCuts: true,
    contextPreserved: true       // Autres sphères restent visibles pendant focus
  },
  
  // Durées
  durations: {
    modeSwitch: 600,             // ms pour changer de mode
    sphereFocus: 400,            // ms pour focus sur une sphère
    agentHighlight: 200          // ms pour highlight agent
  }
};

// -----------------------------------------------------------------------------
// ORBIT CONFIGURATION
// -----------------------------------------------------------------------------

/**
 * Configuration des niveaux d'orbite
 */
export const ORBIT_LEVELS = {
  1: { radius: 150, label: 'Inner' },
  2: { radius: 250, label: 'Near' },
  3: { radius: 350, label: 'Medium' },
  4: { radius: 450, label: 'Far' },
  5: { radius: 550, label: 'Outer' }
};

/**
 * Taille du canvas/viewport par défaut
 */
export const UNIVERSE_DIMENSIONS = {
  width: 1200,
  height: 800,
  centerX: 600,
  centerY: 400
};

// -----------------------------------------------------------------------------
// ERROR & STABILITY VISUALS
// -----------------------------------------------------------------------------

/**
 * Visuels d'erreur et de stabilité
 * "Les erreurs apparaissent comme perturbation localisée, pas de panique globale"
 */
export const ERROR_VISUALS = {
  // Pas de secousse globale
  noGlobalShake: true,
  
  // Perturbation localisée
  localizedDisturbance: {
    maxRadius: 50,
    color: '#EF4444',
    opacity: 0.5,
    duration: 2000
  },
  
  // Le système reste calme
  stabilityOverDrama: true,
  
  // Pas de visuels de panique
  noPanicVisuals: true
};

// -----------------------------------------------------------------------------
// DATA → GRAPHICS MAPPING
// -----------------------------------------------------------------------------

/**
 * Mapping des données vers les graphiques
 * Le moteur visuel consomme UNIQUEMENT ces données
 */
export const DATA_TO_GRAPHICS_MAPPING = {
  inputs: [
    'sphere_importance',      // Importance de la sphère (config)
    'activity_score',         // Score d'activité (runtime)
    'content_volume',         // Volume de contenu (runtime)
    'agent_state',            // État de l'agent (runtime)
    'user_focus_history'      // Historique de focus utilisateur
  ],
  
  // Pas d'état visuel caché
  noHiddenVisualState: true,
  
  // Calculs
  calculations: {
    sphereSize: 'baseSize * (0.7 + activityLevel * 0.6) * modeFactor',
    sphereGlow: 'activityLevel + (isFocused ? 0.3 : 0) + (isHighlighted ? 0.15 : 0)',
    agentSpeed: 'baseSpeed * urgency * modeFactor',
    agentOrbit: 'baseOrbit * confidence'
  }
};

// -----------------------------------------------------------------------------
// COMPLETE UNIVERSE CONFIG
// -----------------------------------------------------------------------------

/**
 * Configuration complète de l'univers
 */
export const DEFAULT_UNIVERSE_CONFIG: UniverseConfig = {
  core: CORE_CONFIG,
  spheres: ALL_SPHERES,
  agents: ALL_AGENTS
};

// -----------------------------------------------------------------------------
// ANIMATION TIMING
// -----------------------------------------------------------------------------

/**
 * Timing des animations
 */
export const ANIMATION_TIMING = {
  // Micro animations (hover)
  micro: {
    duration: 150,
    easing: 'ease-out'
  },
  
  // Standard (transitions)
  standard: {
    duration: 300,
    easing: 'ease-in-out'
  },
  
  // Complex (changement de page)
  complex: {
    duration: 400,
    easing: 'ease-out'
  },
  
  // Attention (alertes)
  attention: {
    duration: 600,
    easing: 'ease-in-out'
  },
  
  // Respects prefers-reduced-motion
  respectsReducedMotion: true
};

// -----------------------------------------------------------------------------
// COLOR PALETTE
// -----------------------------------------------------------------------------

/**
 * Palette de couleurs de l'univers
 */
export const UNIVERSE_COLORS = {
  // Background
  background: {
    dark: '#0F172A',
    light: '#F8FAFC'
  },
  
  // Core
  core: {
    primary: '#A855F7',
    glow: '#C084FC'
  },
  
  // Grid/Lines
  grid: {
    dark: 'rgba(148, 163, 184, 0.1)',
    light: 'rgba(15, 23, 42, 0.1)'
  },
  
  // Connections
  connections: {
    active: '#22C55E',
    pending: '#FBBF24',
    inactive: '#6B7280'
  },
  
  // Text
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    muted: '#64748B'
  }
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

export {
  CORE_CONFIG as coreConfig,
  VISUAL_RULES as visualRules,
  VIEW_MODE_CONFIG as viewModeConfig,
  TRANSITION_RULES as transitionRules,
  DEFAULT_UNIVERSE_CONFIG as universeConfig
};
