/* =====================================================
   CHE·NU — Futurist Theme
   PHASE 7: Sci-fi/Tech aesthetic
   
   Inspired by cyberpunk, holographic interfaces,
   and advanced technology. Neon accents, sharp edges,
   high contrast.
   ===================================================== */

import { Theme } from './theme.types';
import { createTheme } from './baseTheme';

export const futuristTheme: Theme = createTheme({
  metadata: {
    id: 'futurist',
    name: 'Futurist Interface',
    description: 'High-tech aesthetic with neon accents and holographic elements',
    version: '1.0.0',
    mood: 'tech',
    style: 'futuristic',
    era: 'futuristic',
  },
  
  colors: {
    // Core - electric neon
    primary: '#00FFE5',      // Cyan
    secondary: '#FF00FF',    // Magenta
    accent: '#FFFF00',       // Yellow
    
    // Backgrounds - deep black with blue tint
    background: '#000510',   // Near black blue
    surface: '#0A1628',      // Dark blue
    surfaceHover: '#122640', // Medium dark blue
    overlay: 'rgba(0, 5, 16, 0.9)',
    
    // Text - bright whites
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    textInverse: '#000510',
    
    // Semantic
    success: '#00FF88',      // Green neon
    warning: '#FFB800',      // Amber
    error: '#FF0055',        // Red neon
    info: '#00AAFF',         // Blue
    
    // Spheres
    sphereColors: {
      business: '#00AAFF',   // Blue
      creative: '#FF00FF',   // Magenta
      personal: '#00FF88',   // Green
      scholar: '#FFB800',    // Amber
    },
    
    // Agents
    agentColors: {
      orchestrator: '#FF00FF',
      analyst: '#00AAFF',
      evaluator: '#FFB800',
      advisor: '#00FF88',
    },
    
    // Decisions
    decisionColors: {
      approve: '#00FF88',
      reject: '#FF0055',
      pivot: '#00AAFF',
      defer: '#888888',
      escalate: '#FF00FF',
    },
  },
  
  typography: {
    fontFamily: {
      heading: '"Orbitron", "Eurostile", "Rajdhani", sans-serif',
      body: '"Rajdhani", "Exo 2", "Roboto", sans-serif',
      mono: '"JetBrains Mono", "Fira Code", "Source Code Pro", monospace',
      display: '"Orbitron", "Audiowide", sans-serif',
    },
    
    fontSize: {
      xs: '0.7rem',
      sm: '0.825rem',
      base: '0.95rem',
      lg: '1.1rem',
      xl: '1.3rem',
      '2xl': '1.6rem',
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
      tight: '0',
      normal: '0.05em',
      wide: '0.1em',
      wider: '0.2em',
    },
  },
  
  spacing: {
    containerPadding: '1.25rem',
    cardPadding: '0.875rem',
    sectionGap: '1.5rem',
    elementGap: '0.375rem',
  },
  
  borders: {
    width: {
      thin: '1px',
      normal: '2px',
      thick: '3px',
    },
    
    radius: {
      none: '0',
      sm: '2px',
      md: '4px',
      lg: '4px',
      xl: '4px',
      full: '0',  // Square even for "full"
    },
    
    style: {
      subtle: '1px solid rgba(0, 255, 229, 0.15)',
      normal: '1px solid rgba(0, 255, 229, 0.4)',
      accent: '2px solid #00FFE5',
    },
  },
  
  effects: {
    shadow: {
      none: 'none',
      sm: '0 0 5px rgba(0, 255, 229, 0.2)',
      md: '0 0 15px rgba(0, 255, 229, 0.3)',
      lg: '0 0 30px rgba(0, 255, 229, 0.4)',
      xl: '0 0 50px rgba(0, 255, 229, 0.5)',
      glow: '0 0 40px rgba(0, 255, 229, 0.6), 0 0 80px rgba(0, 255, 229, 0.3)',
      inner: 'inset 0 0 15px rgba(0, 255, 229, 0.2)',
    },
    
    blur: {
      none: 'blur(0)',
      sm: 'blur(2px)',
      md: 'blur(4px)',
      lg: 'blur(8px)',
    },
    
    transition: {
      fast: '0.08s linear',
      normal: '0.15s linear',
      slow: '0.25s linear',
      spring: '0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    
    opacity: {
      muted: 0.2,
      subtle: 0.4,
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
      minRadius: 90,
      maxRadius: 350,
      layerGap: 50,
      rotationSpeed: 0.8, // Faster
    },
    
    nodeSize: {
      small: 28,
      medium: 42,
      large: 56,
      trunk: 100,
    },
    
    animation: {
      orbitDuration: '40s',   // Fast orbits
      pulseDuration: '1.5s',
      hoverScale: 1.15,
      activeScale: 1.25,
    },
  },
  
  custom: {
    // Futurist-specific effects
    scanlines: true,
    glitch: {
      enabled: true,
      intensity: 0.02,
    },
    hologram: {
      color: '#00FFE5',
      opacity: 0.1,
    },
    grid: {
      enabled: true,
      color: 'rgba(0, 255, 229, 0.05)',
      size: 20,
    },
    hud: {
      cornerBrackets: true,
      statusBar: true,
    },
  },
});

export default futuristTheme;
