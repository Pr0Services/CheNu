/* =========================================
   CHE·NU — DEEP OCEAN THEME
   
   Thème aquatique profond avec tons bleus.
   ========================================= */

import { ThemeConfig } from '../theme.types';

export const deepOceanTheme: ThemeConfig = {
  id: 'deep_ocean',
  name: 'Deep Ocean',
  description: 'Thème aquatique profond aux tons bleus apaisants',
  
  colors: {
    // Base
    primary: '#0077be',
    secondary: '#00a8e8',
    accent: '#00ffcc',
    
    // Background
    background: '#001f3f',
    surface: '#003366',
    surfaceAlt: '#004080',
    
    // Text
    text: '#e0f7ff',
    textSecondary: '#80d4ff',
    textMuted: '#4da6cc',
    
    // Status
    error: '#ff6b6b',
    warning: '#ffd93d',
    success: '#00e676',
    info: '#29b6f6',
    
    // Borders
    border: '#005580',
    borderLight: '#0077aa',
  },
  
  spheres: {
    personal: '#00bcd4',
    business: '#0288d1',
    creative: '#26c6da',
    social: '#4dd0e1',
    scholar: '#00acc1',
    methodology: '#0097a7',
    institutions: '#00838f',
    xr: '#006064',
    governance: '#004d40',
  },
  
  agents: {
    l0: '#00ffcc',  // Nova - Turquoise brillant
    l1: '#00bcd4',  // Directeurs - Cyan
    l2: '#0097a7',  // Managers - Teal
    l3: '#006064',  // Spécialistes - Bleu profond
  },
  
  effects: {
    glow: '#00a8e8',
    shadow: 'rgba(0, 31, 63, 0.8)',
    blur: '8px',
  },
  
  animation: {
    duration: '0.3s',
    easing: 'ease-in-out',
  },
};

export default deepOceanTheme;
