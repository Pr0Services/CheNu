/* =========================================
   CHE·NU — HIGH CONTRAST THEME
   
   Thème accessible avec contraste élevé.
   Conforme WCAG AAA.
   ========================================= */

import { ThemeConfig } from '../theme.types';

export const highContrastTheme: ThemeConfig = {
  id: 'high_contrast',
  name: 'High Contrast',
  description: 'Thème accessible avec contraste élevé (WCAG AAA)',
  
  colors: {
    // Base - Maximum contrast
    primary: '#ffff00',     // Yellow on black
    secondary: '#00ffff',   // Cyan
    accent: '#ff00ff',      // Magenta
    
    // Background - Pure black
    background: '#000000',
    surface: '#1a1a1a',
    surfaceAlt: '#2d2d2d',
    
    // Text - Pure white
    text: '#ffffff',
    textSecondary: '#e0e0e0',
    textMuted: '#b0b0b0',
    
    // Status - Bright, distinguishable
    error: '#ff4444',
    warning: '#ffaa00',
    success: '#44ff44',
    info: '#4444ff',
    
    // Borders - Visible
    border: '#ffffff',
    borderLight: '#cccccc',
  },
  
  spheres: {
    personal: '#ff6600',    // Orange
    business: '#0066ff',    // Blue
    creative: '#ff00ff',    // Magenta
    social: '#00ff00',      // Green
    scholar: '#ffff00',     // Yellow
    methodology: '#00ffff', // Cyan
    institutions: '#ff0000', // Red
    xr: '#ff00ff',          // Magenta
    governance: '#ffffff',  // White
  },
  
  agents: {
    l0: '#ffff00',  // Nova - Yellow (highest visibility)
    l1: '#00ffff',  // Directeurs - Cyan
    l2: '#ff00ff',  // Managers - Magenta
    l3: '#ffffff',  // Spécialistes - White
  },
  
  effects: {
    glow: '#ffffff',
    shadow: 'rgba(255, 255, 255, 0.3)',
    blur: '0px', // No blur for clarity
  },
  
  animation: {
    duration: '0.2s', // Faster for accessibility
    easing: 'linear', // No easing for predictability
  },
  
  // Accessibility extras
  accessibility: {
    focusRing: '#ffff00',
    focusRingWidth: '3px',
    minTouchTarget: '44px',
    reducedMotion: true,
  },
};

export default highContrastTheme;
