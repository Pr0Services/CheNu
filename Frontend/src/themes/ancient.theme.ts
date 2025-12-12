/* =====================================================
   CHE·NU — Ancient Theme
   PHASE 7: Classical/Antique aesthetic
   
   Inspired by ancient civilizations, manuscripts,
   and timeless wisdom. Earth tones, serif fonts,
   ornate but dignified.
   ===================================================== */

import { Theme } from './theme.types';
import { createTheme } from './baseTheme';

export const ancientTheme: Theme = createTheme({
  metadata: {
    id: 'ancient',
    name: 'Ancient Wisdom',
    description: 'Classical aesthetics inspired by ancient manuscripts and temples',
    version: '1.0.0',
    mood: 'natural',
    style: 'ornate',
    era: 'ancient',
  },
  
  colors: {
    // Core - warm, earthy tones
    primary: '#8B4513',      // Saddle brown
    secondary: '#DAA520',    // Goldenrod
    accent: '#CD853F',       // Peru
    
    // Backgrounds - parchment-like
    background: '#1C1410',   // Dark sepia
    surface: '#2D261F',      // Warm dark brown
    surfaceHover: '#3D352E', // Lighter brown
    overlay: 'rgba(28, 20, 16, 0.85)',
    
    // Text - ink-like
    textPrimary: '#F5E6D3',  // Cream
    textSecondary: 'rgba(245, 230, 211, 0.8)',
    textMuted: 'rgba(245, 230, 211, 0.5)',
    textInverse: '#1C1410',
    
    // Semantic
    success: '#6B8E23',      // Olive drab
    warning: '#DAA520',      // Goldenrod
    error: '#8B0000',        // Dark red
    info: '#4682B4',         // Steel blue
    
    // Spheres
    sphereColors: {
      business: '#8B4513',   // Brown
      creative: '#800080',   // Purple
      personal: '#6B8E23',   // Olive
      scholar: '#DAA520',    // Gold
    },
    
    // Agents
    agentColors: {
      orchestrator: '#800080',
      analyst: '#4682B4',
      evaluator: '#DAA520',
      advisor: '#6B8E23',
    },
    
    // Decisions
    decisionColors: {
      approve: '#6B8E23',
      reject: '#8B0000',
      pivot: '#4682B4',
      defer: '#A0522D',
      escalate: '#800080',
    },
  },
  
  typography: {
    fontFamily: {
      heading: '"Cinzel", "Trajan Pro", "Times New Roman", serif',
      body: '"Crimson Text", "Palatino", "Georgia", serif',
      mono: '"IM Fell DW Pica", "Courier New", monospace',
      display: '"Cinzel Decorative", "Trajan Pro", serif',
    },
    
    fontSize: {
      xs: '0.8rem',
      sm: '0.95rem',
      base: '1.1rem',
      lg: '1.25rem',
      xl: '1.45rem',
      '2xl': '1.75rem',
      '3xl': '2.1rem',
      '4xl': '2.5rem',
    },
    
    letterSpacing: {
      tight: '0',
      normal: '0.03em',
      wide: '0.08em',
      wider: '0.15em',
    },
  },
  
  spacing: {
    containerPadding: '2rem',
    cardPadding: '1.5rem',
    sectionGap: '2.5rem',
    elementGap: '0.75rem',
  },
  
  borders: {
    radius: {
      none: '0',
      sm: '2px',
      md: '4px',
      lg: '6px',
      xl: '8px',
      full: '9999px',
    },
    
    style: {
      subtle: '1px solid rgba(218, 165, 32, 0.15)',
      normal: '2px solid rgba(218, 165, 32, 0.3)',
      accent: '2px solid #DAA520',
    },
  },
  
  effects: {
    shadow: {
      none: 'none',
      sm: '0 2px 4px rgba(28, 20, 16, 0.4)',
      md: '0 4px 8px rgba(28, 20, 16, 0.5)',
      lg: '0 8px 16px rgba(28, 20, 16, 0.6)',
      xl: '0 16px 32px rgba(28, 20, 16, 0.7)',
      glow: '0 0 30px rgba(218, 165, 32, 0.3)',
      inner: 'inset 0 2px 4px rgba(28, 20, 16, 0.4)',
    },
    
    transition: {
      fast: '0.15s ease-out',
      normal: '0.3s ease-out',
      slow: '0.5s ease-out',
      spring: '0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    },
  },
  
  spatial: {
    orbit: {
      minRadius: 120,
      maxRadius: 380,
      layerGap: 65,
      rotationSpeed: 0.3, // Slower, more stately
    },
    
    nodeSize: {
      small: 36,
      medium: 52,
      large: 68,
      trunk: 130,
    },
    
    animation: {
      orbitDuration: '90s',   // Very slow orbits
      pulseDuration: '3s',
      hoverScale: 1.08,
      activeScale: 1.15,
    },
  },
  
  custom: {
    // Ancient-specific decorations
    ornaments: {
      cornerPattern: '╔═══╗',
      divider: '═══════✧═══════',
      bullet: '❧',
    },
    textures: {
      parchment: 'url(/textures/parchment.png)',
      stone: 'url(/textures/stone.png)',
    },
  },
});

export default ancientTheme;
