/* =====================================================
   CHE·NU — Layout System Types
   core/layout/layout.types.ts
   ===================================================== */

// ─────────────────────────────────────────────────────
// Global Configuration
// ─────────────────────────────────────────────────────

export interface LayoutConfig {
  global: GlobalLayoutConfig;
  rules: LayoutRules;
  dimensions: DimensionConfig;
  breakpoints: BreakpointConfig;
  transitions: TransitionConfig;
  zIndex: ZIndexConfig;
}

export interface GlobalLayoutConfig {
  layoutMode: LayoutMode;
  theme: string;
  animations: boolean;
  depthMax: number;
}

export type LayoutMode = 'adaptive' | 'fixed' | 'fluid' | 'responsive';

// ─────────────────────────────────────────────────────
// Layout Rules
// ─────────────────────────────────────────────────────

export interface LayoutRules {
  sizeByContent: boolean;
  motionByActivity: boolean;
  visibilityByPermission: boolean;
  progressiveDisclosure: boolean;
}

// ─────────────────────────────────────────────────────
// Dimension Configuration
// ─────────────────────────────────────────────────────

export interface DimensionConfig {
  contentVolume: ContentVolumeConfig;
  activity: ActivityConfig;
  complexity: ComplexityConfig;
}

export interface ContentVolumeConfig {
  low: { scale: number };
  medium: { scale: number };
  high: { scale: number };
}

export type ContentVolumeLevel = 'low' | 'medium' | 'high';

export interface ActivityConfig {
  idle: { animation: AnimationType };
  active: { animation: AnimationType };
  intense: { animation: AnimationType };
}

export type ActivityLevel = 'idle' | 'active' | 'intense';
export type AnimationType = 'none' | 'pulse' | 'orbit' | 'glow' | 'breathe' | 'spin';

export interface ComplexityConfig {
  simple: { ui: UIMode };
  advanced: { ui: UIMode };
}

export type ComplexityLevel = 'simple' | 'advanced';
export type UIMode = 'minimal' | 'compact' | 'standard' | 'expanded' | 'full';

// ─────────────────────────────────────────────────────
// Breakpoints
// ─────────────────────────────────────────────────────

export interface BreakpointConfig {
  mobile: BreakpointSettings;
  tablet: BreakpointSettings;
  desktop: BreakpointSettings;
  wide: BreakpointSettings;
}

export interface BreakpointSettings {
  maxWidth: number;
  columns: number;
  sphereScale: number;
}

export type BreakpointName = 'mobile' | 'tablet' | 'desktop' | 'wide';

// ─────────────────────────────────────────────────────
// Transitions
// ─────────────────────────────────────────────────────

export interface TransitionConfig {
  default: TransitionSettings;
  slow: TransitionSettings;
  bounce: TransitionSettings;
}

export interface TransitionSettings {
  duration: number;  // ms
  easing: string;
}

export type TransitionType = 'default' | 'slow' | 'bounce';

// ─────────────────────────────────────────────────────
// Z-Index Layers
// ─────────────────────────────────────────────────────

export interface ZIndexConfig {
  background: number;
  spheres: number;
  focusedSphere: number;
  agents: number;
  overlay: number;
  modal: number;
  tooltip: number;
}

export type ZIndexLayer = keyof ZIndexConfig;

// ─────────────────────────────────────────────────────
// Computed Layout State
// ─────────────────────────────────────────────────────

export interface ComputedLayoutState {
  currentBreakpoint: BreakpointName;
  viewportWidth: number;
  viewportHeight: number;
  columns: number;
  sphereScale: number;
  animationsEnabled: boolean;
}

// ─────────────────────────────────────────────────────
// Element Layout Props
// ─────────────────────────────────────────────────────

export interface ElementLayoutProps {
  contentVolume: ContentVolumeLevel;
  activity: ActivityLevel;
  complexity: ComplexityLevel;
  depth: number;
  isVisible: boolean;
  isFocused: boolean;
}

export interface ComputedElementStyle {
  scale: number;
  animation: AnimationType;
  uiMode: UIMode;
  opacity: number;
  zIndex: number;
  transition: string;
}
