/* =====================================================
   CHE·NU — Cosmic Theme
   PHASE 7: Space/Celestial aesthetic
   
   Inspired by the cosmos, nebulae, and celestial bodies.
   Deep space colors, ethereal glows, star field effects.
   ===================================================== */

import { Theme } from './theme.types';
import { createTheme } from './baseTheme';

export const cosmicTheme: Theme = createTheme({
  metadata: {
    id: 'cosmic',
    name: 'Cosmic Expanse',
    description: 'Deep space aesthetic with nebula colors and celestial elements',
    version: '1.0.0',
    mood: 'cosmic',
    style: 'organic',
    era: 'timeless',
  },
  
  colors: {
    // Core - nebula inspired
    primary: '#7B68EE',      // Medium slate blue
    secondary: '#9370DB',    // Medium purple
    accent: '#FFD700',       // Gold (stars)
    
    // Backgrounds - deep space
    background: '#050510',   // Near black purple
    surface: '#0D0D20',      // Dark purple
    surfaceHover: '#151530', // Lighter purple
    overlay: 'rgba(5, 5, 16, 0.92)',
    
    // Text
    textPrimary: '#E8E8FF',  // Light lavender
    textSecondary: 'rgba(232, 232, 255, 0.8)',
    textMuted: 'rgba(232, 232, 255, 0.5)',
    textInverse: '#050510',
    
    // Semantic
    success: '#50C878',      // Emerald
    warning: '#FFD700',      // Gold
    error: '#FF6B6B',        // Coral
    info: '#87CEEB',         // Sky blue
    
    // Spheres - celestial bodies
    sphereColors: {
      business: '#4169E1',   // Royal blue (Neptune)
      creative: '#DA70D6',   // Orchid (nebula)
      personal: '#50C878',   // Emerald (Earth)
      scholar: '#FFD700',    // Gold (Sun)
    },
    
    // Agents - constellation inspired
    agentColors: {
      orchestrator: '#9370DB',  // Purple
      analyst: '#4169E1',       // Blue
      evaluator: '#FFD700',     // Gold
      advisor: '#50C878',       // Green
    },
    
    // Decisions
    decisionColors: {
      approve: '#50C878',
      reject: '#FF6B6B',
      pivot: '#87CEEB',
      defer: '#778899',
      escalate: '#DA70D6',
    },
  },
  
  typography: {
    fontFamily: {
      heading: '"Quicksand", "Nunito", "Poppins", sans-serif',
      body: '"Nunito", "Open Sans", "Segoe UI", sans-serif',
      mono: '"Space Mono", "JetBrains Mono", monospace',
      display: '"Poiret One", "Quicksand", sans-serif',
    },
    
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.15rem',
      xl: '1.35rem',
      '2xl': '1.65rem',
      '3xl': '2rem',
      '4xl': '2.5rem',
    },
    
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    letterSpacing: {
      tight: '-0.01em',
      normal: '0.02em',
      wide: '0.05em',
      wider: '0.1em',
    },
  },
  
  spacing: {
    containerPadding: '1.75rem',
    cardPadding: '1.25rem',
    sectionGap: '2.25rem',
    elementGap: '0.625rem',
  },
  
  borders: {
    radius: {
      none: '0',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      full: '9999px',
    },
    
    style: {
      subtle: '1px solid rgba(123, 104, 238, 0.15)',
      normal: '1px solid rgba(123, 104, 238, 0.3)',
      accent: '2px solid #7B68EE',
    },
  },
  
  effects: {
    shadow: {
      none: 'none',
      sm: '0 2px 8px rgba(123, 104, 238, 0.15)',
      md: '0 4px 16px rgba(123, 104, 238, 0.2)',
      lg: '0 8px 32px rgba(123, 104, 238, 0.25)',
      xl: '0 16px 48px rgba(123, 104, 238, 0.3)',
      glow: '0 0 40px rgba(123, 104, 238, 0.4), 0 0 80px rgba(147, 112, 219, 0.2)',
      inner: 'inset 0 0 20px rgba(123, 104, 238, 0.15)',
    },
    
    blur: {
      none: 'blur(0)',
      sm: 'blur(4px)',
      md: 'blur(12px)',
      lg: 'blur(24px)',
    },
    
    transition: {
      fast: '0.15s ease-out',
      normal: '0.25s ease-out',
      slow: '0.4s ease-out',
      spring: '0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    
    opacity: {
      muted: 0.25,
      subtle: 0.5,
      normal: 0.8,
      full: 1,
    },
  },
  
  spatial: {
    depth: {
      background: 0,
      surface: 10,
      overlay: 20,
      modal: 30,
      tooltip: 40,
    },
    
    orbit: {
      minRadius: 110,
      maxRadius: 420,
      layerGap: 70,
      rotationSpeed: 0.4, // Graceful
    },
    
    nodeSize: {
      small: 34,
      medium: 50,
      large: 66,
      trunk: 140,
    },
    
    animation: {
      orbitDuration: '80s',
      pulseDuration: '2.5s',
      hoverScale: 1.12,
      activeScale: 1.2,
    },
  },
  
  custom: {
    // Cosmic-specific effects
    stars: {
      enabled: true,
      density: 200,
      twinkle: true,
    },
    nebula: {
      enabled: true,
      colors: ['#7B68EE', '#9370DB', '#DA70D6'],
      opacity: 0.08,
    },
    aurora: {
      enabled: false,
      colors: ['#50C878', '#87CEEB', '#7B68EE'],
    },
    constellation: {
      enabled: true,
      color: 'rgba(255, 255, 255, 0.1)',
      lineWidth: 1,
    },
    comet: {
      enabled: true,
      frequency: 30000, // ms
      trail: '#FFD700',
    },
  },
});

export default cosmicTheme;
