/* =====================================================
   CHE·NU — Theme System Types
   core/theme/theme.types.ts
   ===================================================== */

export interface ThemeColors {
  // Core
  background: string;
  surface: string;
  surfaceHover: string;
  
  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  
  // Brand
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  
  // Semantic
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Sphere Colors
  spherePersonal: string;
  sphereBusiness: string;
  sphereCreative: string;
  sphereScholar: string;
  sphereSocial: string;
  sphereInstitutions: string;
  sphereMethodology: string;
  sphereXR: string;
  
  // Agent Levels
  agentL0: string;  // NOVA
  agentL1: string;  // Directors
  agentL2: string;  // Managers
  agentL3: string;  // Analysts
  agentL4: string;  // Executors
  agentL5: string;  // Observers
  
  // UI Elements
  border: string;
  borderLight: string;
  shadow: string;
  overlay: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontFamilyMono: string;
  
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2xl: string;
  fontSize3xl: string;
  
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightBold: number;
  
  lineHeightTight: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface ThemeRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  glow: string;
  sphereGlow: string;
}

export interface ThemeAnimation {
  durationFast: string;
  durationNormal: string;
  durationSlow: string;
  easingDefault: string;
  easingBounce: string;
  easingSmooth: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  isDark: boolean;
  
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  shadows: ThemeShadows;
  animation: ThemeAnimation;
}

export type ThemeId = 
  | 'sacred_gold'
  | 'tree_nature'
  | 'deep_ocean'
  | 'midnight'
  | 'high_contrast';

export type SphereType = 
  | 'personal'
  | 'business'
  | 'creative'
  | 'scholar'
  | 'social'
  | 'institutions'
  | 'methodology'
  | 'xr';

export type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

// Utility function type for getting sphere color
export type GetSphereColor = (sphereType: SphereType, theme: Theme) => string;

// Utility function type for getting agent level color
export type GetAgentColor = (level: AgentLevel, theme: Theme) => string;