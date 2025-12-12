/* =========================================================
   CHE·NU — Visual Themes (Block 1)
   
   Themes are purely perceptual skins.
   They must NEVER modify logic, authority, agents, 
   timelines, or rules.
   
   Same system. Same laws. Same agents.
   Only visual language changes.
   ========================================================= */

/* -------------------------
   TYPES
------------------------- */

export type VisualThemeId = 
  | 'realistic' 
  | 'avatar' 
  | 'ancient';

export type ThemeCategory = 
  | 'professional' 
  | 'collaborative' 
  | 'ceremonial';

export interface ColorPalette {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  accent: string;
  accentAlt: string;
  success: string;
  warning: string;
  error: string;
}

export interface TypographyConfig {
  fontFamily: string;
  fontFamilyMono: string;
  fontSizeBase: string;
  fontSizeSmall: string;
  fontSizeLarge: string;
  fontSizeXL: string;
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightBold: number;
  lineHeight: number;
}

export interface GeometryConfig {
  borderRadius: string;
  borderRadiusLarge: string;
  spacing: string;
  spacingLarge: string;
  gridSize: number;
  cornerStyle: 'sharp' | 'soft' | 'rounded';
}

export interface AgentVisualConfig {
  shape: 'circle' | 'square' | 'tablet' | 'stele';
  showLabels: boolean;
  colorScheme: 'neutral' | 'warm' | 'earth';
  animationStyle: 'none' | 'minimal' | 'subtle';
  presenceIntensity: 'low' | 'medium' | 'high';
}

export interface GuardVisualConfig {
  iconStyle: 'lock' | 'shield' | 'natural';
  tone: 'neutral' | 'warm' | 'grounded';
  showAlarmColors: boolean;
  messageStyle: 'technical' | 'friendly' | 'solemn';
}

export interface XREnvironmentConfig {
  style: 'control-room' | 'circular-space' | 'temple';
  lighting: 'diffuse' | 'warm' | 'natural';
  particles: boolean;
  ambiance: 'clean' | 'soft' | 'grounded';
  panelStyle: 'flat' | 'floating' | 'engraved';
}

export interface TimelineVisualConfig {
  style: 'linear' | 'arc' | 'engraved';
  completedMarker: string;
  activeMarker: string;
  pendingMarker: string;
  animation: 'none' | 'pulse' | 'glow';
}

export interface VisualTheme {
  id: VisualThemeId;
  name: string;
  category: ThemeCategory;
  intent: string;
  goalFeeling: string;
  useCases: string[];
  
  colors: ColorPalette;
  typography: TypographyConfig;
  geometry: GeometryConfig;
  
  agents: AgentVisualConfig;
  guards: GuardVisualConfig;
  xr: XREnvironmentConfig;
  timeline: TimelineVisualConfig;
}

/* =========================================================
   THEME 1 — REALISTIC / PROFESSIONAL
   ========================================================= */

export const REALISTIC_THEME: VisualTheme = {
  id: 'realistic',
  name: 'Realistic / Professional',
  category: 'professional',
  intent: 'Neutral, reassuring, serious, predictable.',
  goalFeeling: 'Everything is clear and under control.',
  useCases: [
    'Daily use',
    'Institutions',
    'Investors',
    'Debug / control',
    'Long sessions',
  ],

  colors: {
    background: '#f8f9fa',
    surface: '#ffffff',
    surfaceAlt: '#e9ecef',
    text: '#212529',
    textMuted: '#6c757d',
    accent: '#4dabf7',
    accentAlt: '#339af0',
    success: '#51cf66',
    warning: '#ffd43b',
    error: '#ff6b6b',
  },

  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontFamilyMono: 'JetBrains Mono, Consolas, monospace',
    fontSizeBase: '14px',
    fontSizeSmall: '12px',
    fontSizeLarge: '16px',
    fontSizeXL: '20px',
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    lineHeight: 1.5,
  },

  geometry: {
    borderRadius: '4px',
    borderRadiusLarge: '8px',
    spacing: '8px',
    spacingLarge: '16px',
    gridSize: 8,
    cornerStyle: 'soft',
  },

  agents: {
    shape: 'circle',
    showLabels: true,
    colorScheme: 'neutral',
    animationStyle: 'minimal',
    presenceIntensity: 'low',
  },

  guards: {
    iconStyle: 'lock',
    tone: 'neutral',
    showAlarmColors: false,
    messageStyle: 'technical',
  },

  xr: {
    style: 'control-room',
    lighting: 'diffuse',
    particles: false,
    ambiance: 'clean',
    panelStyle: 'flat',
  },

  timeline: {
    style: 'linear',
    completedMarker: '✓',
    activeMarker: '→',
    pendingMarker: '○',
    animation: 'none',
  },
};

/* =========================================================
   THEME 2 — AVATAR / HUMAN-CENTERED
   ========================================================= */

export const AVATAR_THEME: VisualTheme = {
  id: 'avatar',
  name: 'Avatar / Human-Centered',
  category: 'collaborative',
  intent: 'Presence and collaboration without loss of human authority.',
  goalFeeling: "I'm accompanied, not controlled.",
  useCases: [
    'Meeting rooms',
    'Coaching',
    'Collaboration',
    'Guided sessions',
  ],

  colors: {
    background: '#fff9f5',
    surface: '#ffffff',
    surfaceAlt: '#fff0eb',
    text: '#495057',
    textMuted: '#868e96',
    accent: '#ff8787',
    accentAlt: '#fa5252',
    success: '#69db7c',
    warning: '#ffc078',
    error: '#ff8787',
  },

  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontFamilyMono: 'JetBrains Mono, Consolas, monospace',
    fontSizeBase: '14px',
    fontSizeSmall: '12px',
    fontSizeLarge: '16px',
    fontSizeXL: '20px',
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    lineHeight: 1.6,
  },

  geometry: {
    borderRadius: '12px',
    borderRadiusLarge: '20px',
    spacing: '12px',
    spacingLarge: '24px',
    gridSize: 8,
    cornerStyle: 'rounded',
  },

  agents: {
    shape: 'circle',
    showLabels: true,
    colorScheme: 'warm',
    animationStyle: 'subtle',
    presenceIntensity: 'medium',
  },

  guards: {
    iconStyle: 'shield',
    tone: 'warm',
    showAlarmColors: false,
    messageStyle: 'friendly',
  },

  xr: {
    style: 'circular-space',
    lighting: 'warm',
    particles: false,
    ambiance: 'soft',
    panelStyle: 'floating',
  },

  timeline: {
    style: 'arc',
    completedMarker: '●',
    activeMarker: '◉',
    pendingMarker: '○',
    animation: 'pulse',
  },
};

/* =========================================================
   THEME 3 — ANCIENT / BUILDER CIVILIZATION
   ========================================================= */

export const ANCIENT_THEME: VisualTheme = {
  id: 'ancient',
  name: 'Ancient / Builder Civilization',
  category: 'ceremonial',
  intent: 'Weight, continuity, responsibility through time.',
  goalFeeling: 'What happens here carries responsibility.',
  useCases: [
    'Methodology',
    'Governance',
    'Long-term vision',
    'Institutions',
  ],

  colors: {
    background: '#f4f1de',
    surface: '#fefcf3',
    surfaceAlt: '#e8e4d0',
    text: '#3d405b',
    textMuted: '#6b6d7c',
    accent: '#81b29a',
    accentAlt: '#e07a5f',
    success: '#81b29a',
    warning: '#f2cc8f',
    error: '#e07a5f',
  },

  typography: {
    fontFamily: 'Crimson Pro, Georgia, serif',
    fontFamilyMono: 'JetBrains Mono, Consolas, monospace',
    fontSizeBase: '16px',
    fontSizeSmall: '14px',
    fontSizeLarge: '18px',
    fontSizeXL: '24px',
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    lineHeight: 1.7,
  },

  geometry: {
    borderRadius: '2px',
    borderRadiusLarge: '4px',
    spacing: '16px',
    spacingLarge: '32px',
    gridSize: 16,
    cornerStyle: 'sharp',
  },

  agents: {
    shape: 'tablet',
    showLabels: true,
    colorScheme: 'earth',
    animationStyle: 'none',
    presenceIntensity: 'low',
  },

  guards: {
    iconStyle: 'natural',
    tone: 'grounded',
    showAlarmColors: false,
    messageStyle: 'solemn',
  },

  xr: {
    style: 'temple',
    lighting: 'natural',
    particles: false,
    ambiance: 'grounded',
    panelStyle: 'engraved',
  },

  timeline: {
    style: 'engraved',
    completedMarker: '▣',
    activeMarker: '▶',
    pendingMarker: '▢',
    animation: 'none',
  },
};

/* =========================================================
   THEME REGISTRY
   ========================================================= */

export const VISUAL_THEMES: Record<VisualThemeId, VisualTheme> = {
  realistic: REALISTIC_THEME,
  avatar: AVATAR_THEME,
  ancient: ANCIENT_THEME,
};

export const DEFAULT_THEME: VisualThemeId = 'realistic';

/* =========================================================
   THEME UTILITIES
   ========================================================= */

/**
 * Get a theme by ID
 */
export function getVisualTheme(id: VisualThemeId): VisualTheme {
  return VISUAL_THEMES[id] ?? REALISTIC_THEME;
}

/**
 * Get themes by category
 */
export function getThemesByCategory(category: ThemeCategory): VisualTheme[] {
  return Object.values(VISUAL_THEMES).filter(t => t.category === category);
}

/**
 * Get themes by use case
 */
export function getThemesForUseCase(useCase: string): VisualTheme[] {
  return Object.values(VISUAL_THEMES).filter(t => 
    t.useCases.some(uc => uc.toLowerCase().includes(useCase.toLowerCase()))
  );
}

/**
 * Generate CSS variables from theme
 */
export function generateCSSVariables(theme: VisualTheme): Record<string, string> {
  return {
    '--chenu-bg': theme.colors.background,
    '--chenu-surface': theme.colors.surface,
    '--chenu-surface-alt': theme.colors.surfaceAlt,
    '--chenu-text': theme.colors.text,
    '--chenu-text-muted': theme.colors.textMuted,
    '--chenu-accent': theme.colors.accent,
    '--chenu-accent-alt': theme.colors.accentAlt,
    '--chenu-success': theme.colors.success,
    '--chenu-warning': theme.colors.warning,
    '--chenu-error': theme.colors.error,
    '--chenu-font': theme.typography.fontFamily,
    '--chenu-font-mono': theme.typography.fontFamilyMono,
    '--chenu-font-size': theme.typography.fontSizeBase,
    '--chenu-radius': theme.geometry.borderRadius,
    '--chenu-radius-lg': theme.geometry.borderRadiusLarge,
    '--chenu-spacing': theme.geometry.spacing,
    '--chenu-spacing-lg': theme.geometry.spacingLarge,
  };
}

/**
 * Apply theme to document
 */
export function applyThemeToDocument(theme: VisualTheme): void {
  const vars = generateCSSVariables(theme);
  const root = document.documentElement;
  
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Set data attribute for CSS selectors
  root.setAttribute('data-chenu-theme', theme.id);
}

/* =========================================================
   THEME CONSTRAINTS (ENFORCED)
   ========================================================= */

/**
 * Themes NEVER modify these aspects
 */
export const THEME_CONSTRAINTS = {
  // What themes cannot change
  forbidden: [
    'logic',
    'authority',
    'agents',
    'timelines',
    'rules',
    'decision_speed',
    'guard_behavior',
  ],
  
  // Theme switching rules
  switching: {
    manualOnly: true,
    smoothTransition: true,
    noSessionReset: true,
    transitionDuration: 300, // ms
  },
} as const;

/**
 * Validate that a theme doesn't violate constraints
 */
export function validateThemeConstraints(theme: VisualTheme): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Check for alarm colors in guards (should be disabled)
  if (theme.guards.showAlarmColors) {
    warnings.push('Guards should not use alarm colors');
  }
  
  // Check for high presence intensity (could be dominant)
  if (theme.agents.presenceIntensity === 'high') {
    warnings.push('High agent presence may feel dominant');
  }
  
  return {
    valid: warnings.length === 0,
    warnings,
  };
}

/* =========================================================
   FLOW STAGE INDICATORS
   ========================================================= */

export interface FlowStageIndicator {
  completed: string;
  active: string;
  pending: string;
}

/**
 * Get flow stage indicators for a theme
 */
export function getFlowIndicators(themeId: VisualThemeId): FlowStageIndicator {
  const theme = getVisualTheme(themeId);
  return {
    completed: theme.timeline.completedMarker,
    active: theme.timeline.activeMarker,
    pending: theme.timeline.pendingMarker,
  };
}

/**
 * Format flow stage display
 */
export function formatFlowStage(
  stage: string,
  status: 'completed' | 'active' | 'pending',
  themeId: VisualThemeId = DEFAULT_THEME
): string {
  const indicators = getFlowIndicators(themeId);
  const marker = indicators[status];
  return `${marker} ${stage}`;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export {
  REALISTIC_THEME as realisticTheme,
  AVATAR_THEME as avatarTheme,
  ANCIENT_THEME as ancientTheme,
};
