/* =====================================================
   CHE·NU — Tree Nature Theme
   core/theme/themes/tree_nature.ts
   ===================================================== */

import { Theme } from '../theme.types';

export const treeNatureTheme: Theme = {
  id: 'tree_nature',
  name: 'Tree Nature',
  description: 'Organic theme inspired by the CHE·NU mega-tree metaphor',
  isDark: true,
  
  colors: {
    // Core
    background: '#0A0E0A',
    surface: '#141A14',
    surfaceHover: '#1A221A',
    
    // Text
    text: '#E8F0E8',
    textSecondary: '#A8B8A8',
    textMuted: '#6A7A6A',
    
    // Brand
    primary: '#4A7C4A',      // Forest Green
    primaryHover: '#5A8C5A',
    secondary: '#D8B26A',    // Sacred Gold
    accent: '#7CB87C',       // Light Green
    
    // Semantic
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Sphere Colors
    spherePersonal: '#4CAF50',     // Green
    sphereBusiness: '#1E3A5F',     // Royal Blue
    sphereCreative: '#8B2942',     // Deep Crimson
    sphereScholar: '#5D3A6E',      // Purple
    sphereSocial: '#D4752A',       // Orange
    sphereInstitutions: '#2A7B7B', // Teal
    sphereMethodology: '#2D5A3D',  // Forest Green
    sphereXR: '#3A5A8C',           // Sky Blue
    
    // Agent Levels
    agentL0: '#D8B26A',   // NOVA - Gold
    agentL1: '#8B2942',   // Directors - Crimson
    agentL2: '#1E3A5F',   // Managers - Blue
    agentL3: '#2D5A3D',   // Analysts - Green
    agentL4: '#5D3A6E',   // Executors - Purple
    agentL5: '#2A7B7B',   // Observers - Teal
    
    // UI Elements
    border: '#2A3A2A',
    borderLight: '#3A4A3A',
    shadow: 'rgba(0, 0, 0, 0.4)',
    overlay: 'rgba(10, 14, 10, 0.85)',
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    
    fontSizeXs: '0.75rem',   // 12px
    fontSizeSm: '0.875rem',  // 14px
    fontSizeMd: '1rem',      // 16px
    fontSizeLg: '1.125rem',  // 18px
    fontSizeXl: '1.25rem',   // 20px
    fontSize2xl: '1.5rem',   // 24px
    fontSize3xl: '2rem',     // 32px
    
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    
    lineHeightTight: 1.25,
    lineHeightNormal: 1.5,
    lineHeightRelaxed: 1.75,
  },
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.4)',
    glow: '0 0 20px rgba(74, 124, 74, 0.4)',
    sphereGlow: '0 0 30px rgba(216, 178, 106, 0.3)',
  },
  
  animation: {
    durationFast: '150ms',
    durationNormal: '300ms',
    durationSlow: '500ms',
    easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easingBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    easingSmooth: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};