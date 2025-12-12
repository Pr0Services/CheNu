/* =====================================================
   CHE·NU — Sacred Gold Theme
   core/theme/themes/sacred_gold.ts
   ===================================================== */

import { Theme } from '../theme.types';

export const sacredGoldTheme: Theme = {
  id: 'sacred_gold',
  name: 'Sacred Gold',
  description: 'Premium theme with gold accents on warm stone background',
  isDark: false,
  
  colors: {
    // Core
    background: '#F5F0E8',    // Warm Stone
    surface: '#FFFFFF',
    surfaceHover: '#FAF8F4',
    
    // Text
    text: '#1A1A1A',          // Dark Slate
    textSecondary: '#4A4A4A',
    textMuted: '#8A8A8A',
    
    // Brand
    primary: '#D8B26A',       // Sacred Gold
    primaryHover: '#C9A35B',
    secondary: '#1E3A5F',     // Royal Blue
    accent: '#8B2942',        // Deep Crimson
    
    // Semantic
    success: '#2D5A3D',
    warning: '#D4752A',
    error: '#8B2942',
    info: '#1E3A5F',
    
    // Sphere Colors
    spherePersonal: '#2D5A3D',
    sphereBusiness: '#1E3A5F',
    sphereCreative: '#8B2942',
    sphereScholar: '#5D3A6E',
    sphereSocial: '#D4752A',
    sphereInstitutions: '#2A7B7B',
    sphereMethodology: '#4A7C4A',
    sphereXR: '#3A5A8C',
    
    // Agent Levels
    agentL0: '#D8B26A',
    agentL1: '#8B2942',
    agentL2: '#1E3A5F',
    agentL3: '#2D5A3D',
    agentL4: '#5D3A6E',
    agentL5: '#2A7B7B',
    
    // UI Elements
    border: '#E0DCD4',
    borderLight: '#EAE6DE',
    shadow: 'rgba(26, 26, 26, 0.1)',
    overlay: 'rgba(245, 240, 232, 0.95)',
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    
    fontSizeXs: '0.75rem',
    fontSizeSm: '0.875rem',
    fontSizeMd: '1rem',
    fontSizeLg: '1.125rem',
    fontSizeXl: '1.25rem',
    fontSize2xl: '1.5rem',
    fontSize3xl: '2rem',
    
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    
    lineHeightTight: 1.25,
    lineHeightNormal: 1.5,
    lineHeightRelaxed: 1.75,
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(26, 26, 26, 0.05)',
    md: '0 4px 6px rgba(26, 26, 26, 0.08)',
    lg: '0 10px 15px rgba(26, 26, 26, 0.1)',
    xl: '0 20px 25px rgba(26, 26, 26, 0.15)',
    glow: '0 0 20px rgba(216, 178, 106, 0.3)',
    sphereGlow: '0 0 30px rgba(216, 178, 106, 0.2)',
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