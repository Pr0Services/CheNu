/* =====================================================
   CHE·NU — Realistic Theme
   PHASE 7: Professional/Minimal aesthetic
   
   Clean, modern, professional. Inspired by premium
   business applications. Subtle colors, clear hierarchy,
   maximum usability.
   ===================================================== */

import { Theme } from './theme.types';
import { createTheme } from './baseTheme';

export const realisticTheme: Theme = createTheme({
  metadata: {
    id: 'realistic',
    name: 'Realistic Pro',
    description: 'Clean, professional aesthetic for maximum productivity',
    version: '1.0.0',
    mood: 'dark',
    style: 'minimal',
    era: 'modern',
  },
  
  colors: {
    // Core - professional blues
    primary: '#3B82F6',      // Blue 500
    secondary: '#6366F1',    // Indigo 500
    accent: '#10B981',       // Emerald 500
    
    // Backgrounds - neutral grays
    background: '#111827',   // Gray 900
    surface: '#1F2937',      // Gray 800
    surfaceHover: '#374151', // Gray 700
    overlay: 'rgba(17, 24, 39, 0.9)',
    
    // Text
    textPrimary: '#F9FAFB',  // Gray 50
    textSecondary: '#D1D5DB', // Gray 300
    textMuted: '#9CA3AF',    // Gray 400
    textInverse: '#111827',
    
    // Semantic - standard colors
    success: '#10B981',      // Emerald
    warning: '#F59E0B',      // Amber
    error: '#EF4444',        // Red
    info: '#3B82F6',         // Blue
    
    // Spheres - muted, professional
    sphereColors: {
      business: '#3B82F6',   // Blue
      creative: '#8B5CF6',   // Violet
      personal: '#10B981',   // Emerald
      scholar: '#F59E0B',    // Amber
    },
    
    // Agents
    agentColors: {
      orchestrator: '#8B5CF6',
      analyst: '#3B82F6',
      evaluator: '#F59E0B',
      advisor: '#10B981',
    },
    
    // Decisions
    decisionColors: {
      approve: '#10B981',
      reject: '#EF4444',
      pivot: '#3B82F6',
      defer: '#6B7280',
      escalate: '#8B5CF6',
    },
  },
  
  typography: {
    fontFamily: {
      heading: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      body: '"Inter", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"JetBrains Mono", "SF Mono", "Fira Code", monospace',
      display: '"Inter", "SF Pro Display", sans-serif',
    },
    
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
    },
    
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
    },
  },
  
  spacing: {
    unit: 4,
    
    scale: {
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
    },
    
    containerPadding: '1.5rem',
    cardPadding: '1rem',
    sectionGap: '1.5rem',
    elementGap: '0.5rem',
  },
  
  borders: {
    width: {
      thin: '1px',
      normal: '1px',
      thick: '2px',
    },
    
    radius: {
      none: '0',
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    
    style: {
      subtle: '1px solid rgba(255, 255, 255, 0.06)',
      normal: '1px solid rgba(255, 255, 255, 0.1)',
      accent: '1px solid #3B82F6',
    },
  },
  
  effects: {
    shadow: {
      none: 'none',
      sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.25)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
      glow: '0 0 15px rgba(59, 130, 246, 0.3)',
      inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.15)',
    },
    
    blur: {
      none: 'blur(0)',
      sm: 'blur(4px)',
      md: 'blur(8px)',
      lg: 'blur(12px)',
    },
    
    transition: {
      fast: '0.1s ease',
      normal: '0.15s ease',
      slow: '0.2s ease',
      spring: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    opacity: {
      muted: 0.4,
      subtle: 0.6,
      normal: 0.9,
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
      minRadius: 100,
      maxRadius: 360,
      layerGap: 55,
      rotationSpeed: 0.5,
    },
    
    nodeSize: {
      small: 32,
      medium: 44,
      large: 60,
      trunk: 110,
    },
    
    animation: {
      orbitDuration: '70s',
      pulseDuration: '2s',
      hoverScale: 1.05,
      activeScale: 1.1,
    },
  },
  
  custom: {
    // Realistic-specific settings
    prefersReducedMotion: true,
    highContrast: false,
    focusRing: {
      color: '#3B82F6',
      width: '2px',
      offset: '2px',
    },
    scrollbar: {
      width: '8px',
      thumbColor: 'rgba(255, 255, 255, 0.2)',
      trackColor: 'transparent',
    },
  },
});

export default realisticTheme;
