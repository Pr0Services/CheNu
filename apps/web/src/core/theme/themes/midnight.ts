/* =========================================
   CHE·NU — MIDNIGHT THEME
   
   Thème sombre nocturne avec accents violets.
   ========================================= */

import { ThemeConfig } from '../theme.types';

export const midnightTheme: ThemeConfig = {
  id: 'midnight',
  name: 'Midnight',
  description: 'Thème nocturne profond avec accents violets mystérieux',
  
  colors: {
    // Base
    primary: '#7c3aed',
    secondary: '#a78bfa',
    accent: '#c084fc',
    
    // Background
    background: '#0f0f1a',
    surface: '#1a1a2e',
    surfaceAlt: '#252542',
    
    // Text
    text: '#f0f0ff',
    textSecondary: '#b8b8d0',
    textMuted: '#6b6b8c',
    
    // Status
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#6366f1',
    
    // Borders
    border: '#3d3d5c',
    borderLight: '#4d4d6a',
  },
  
  spheres: {
    personal: '#8b5cf6',
    business: '#6366f1',
    creative: '#a855f7',
    social: '#d946ef',
    scholar: '#7c3aed',
    methodology: '#5b21b6',
    institutions: '#4c1d95',
    xr: '#6d28d9',
    governance: '#4338ca',
  },
  
  agents: {
    l0: '#c084fc',  // Nova - Lavande brillant
    l1: '#a78bfa',  // Directeurs - Violet clair
    l2: '#8b5cf6',  // Managers - Violet
    l3: '#6d28d9',  // Spécialistes - Violet profond
  },
  
  effects: {
    glow: '#a78bfa',
    shadow: 'rgba(15, 15, 26, 0.9)',
    blur: '12px',
  },
  
  animation: {
    duration: '0.4s',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export default midnightTheme;
