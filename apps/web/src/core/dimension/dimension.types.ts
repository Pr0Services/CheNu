/* =====================================================
   CHE·NU — Dimension Resolver Types
   core/dimension/dimension.types.ts
   
   CONSTITUTIONAL: These types mirror the JSON schema.
   Do NOT add properties here that aren't in JSON configs.
   ===================================================== */

// ─────────────────────────────────────────────────────
// Resolution Context (Input)
// ─────────────────────────────────────────────────────

export interface ResolutionContext {
  contentVolume: ContentMetrics;
  activityLevel: ActivityMetrics;
  sphereConfig: SphereConfig;
  userContext: UserContext;
  depth?: number;
}

export interface ContentMetrics {
  itemCount: number;
  agentCount: number;
  activeProcesses: number;
  pendingDecisions: number;
}

export interface ActivityMetrics {
  lastInteraction: number;  // timestamp
  actionsPerMinute: number;
  hasUrgent: boolean;
  conditions: string[];
}

export interface UserContext {
  userId: string;
  permissions: string[];
  role: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  reducedMotion?: boolean;
  highContrast?: boolean;
  compactMode?: boolean;
}

// ─────────────────────────────────────────────────────
// Sphere Configuration (from JSON)
// ─────────────────────────────────────────────────────

export interface SphereConfig {
  id: string;
  name: string;
  type: string;
  visual: SphereVisualConfig;
  layout: SphereLayoutConfig;
  priority: string[];
  permissions: Record<string, string[]>;
  content: SphereContentConfig;
  agents: SphereAgentsConfig;
  behavior: SphereBehaviorConfig;
  rules: SphereRulesConfig;
}

export interface SphereVisualConfig {
  baseShape: ShapeType;
  color: ColorConfig;
  growthAxis: GrowthAxis;
  icon: string;
  glow: GlowConfig;
}

export interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string[];
}

export interface GlowConfig {
  enabled: boolean;
  intensity: number;
  color: string;
}

export interface SphereLayoutConfig {
  defaultDimension: DimensionClass;
  minDimension: DimensionClass;
  maxDimension: DimensionClass;
  childArrangement: ArrangementType;
  expansionDirection: string;
}

export interface SphereContentConfig {
  sections: ContentSection[];
  defaultView: string;
}

export interface ContentSection {
  id: string;
  label: string;
  icon: string;
  order: number;
}

export interface SphereAgentsConfig {
  roles: string[];
  maxVisible: number;
  arrangement: ArrangementType;
}

export interface SphereBehaviorConfig {
  onFocus: BehaviorAction;
  onEnter: BehaviorAction;
  onIdle: BehaviorAction;
  onActive: BehaviorAction;
}

export interface BehaviorAction {
  scale?: number;
  showDetails?: boolean;
  bloom?: boolean;
  transition?: string;
  duration?: number;
  animation?: string;
  dimAfter?: number;
  highlight?: boolean;
  particles?: boolean;
}

export interface SphereRulesConfig {
  sizeByContent: boolean;
  motionByActivity: boolean;
  visibilityByPermission: boolean;
  allowExperimentation?: boolean;
}

// ─────────────────────────────────────────────────────
// Resolved Dimension (Output)
// ─────────────────────────────────────────────────────

export interface ResolvedDimension {
  // Visual
  scale: number;
  opacity: number;
  shape: ResolvedShape;
  color: ResolvedColor;
  glow: ResolvedGlow;
  
  // Layout
  dimension: DimensionClass;
  growthAxis: GrowthAxisConfig;
  arrangement: ArrangementType;
  
  // Animation
  animation: ResolvedAnimation;
  transition: ResolvedTransition;
  
  // State
  activityState: ActivityState;
  uiMode: UIMode;
  
  // Permissions
  visible: boolean;
  interactable: boolean;
  allowedActions: string[];
  
  // Depth
  zIndex: number;
  depthScale: number;
  depthOpacity: number;
}

export interface ResolvedShape {
  borderRadius: string;
  aspectRatio: string;
  corners: string;
  shadow: string;
}

export interface ResolvedColor {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  glow: string;
}

export interface ResolvedGlow {
  enabled: boolean;
  intensity: number;
  color: string;
  blur: number;
}

export interface GrowthAxisConfig {
  primary: string;
  expansion: string;
  childFlow: string;
  overflow: string;
}

export interface ResolvedAnimation {
  name: string | null;
  duration: number;
  easing: string;
  iterations: string | number;
  css: string;
}

export interface ResolvedTransition {
  property: string;
  duration: number;
  easing: string;
  delay: number;
}

// ─────────────────────────────────────────────────────
// Enums (from JSON schema)
// ─────────────────────────────────────────────────────

export type ShapeType = 'structure' | 'organic' | 'hybrid';
export type GrowthAxis = 'vertical' | 'horizontal' | 'radial' | 'depth';
export type ArrangementType = 'hierarchical' | 'organic' | 'orbital' | 'grid';
export type DimensionClass = 'XS' | 'S' | 'M' | 'L' | 'XL';
export type ActivityState = 'dormant' | 'idle' | 'active' | 'busy' | 'critical';
export type UIMode = 'minimal' | 'compact' | 'standard' | 'expanded' | 'full';
export type PermissionLevel = 'none' | 'view' | 'read' | 'write' | 'admin';

// ─────────────────────────────────────────────────────
// Engine Configuration (from JSON)
// ─────────────────────────────────────────────────────

export interface DimensionEngineConfig {
  $schema: string;
  version: string;
  resolution: ResolutionConfig;
  contentVolume: ContentVolumeConfig;
  activityLevel: ActivityLevelConfig;
  userPermission: UserPermissionConfig;
  shapes: Record<ShapeType, ResolvedShape>;
  growthAxes: Record<GrowthAxis, GrowthAxisConfig>;
  animations: Record<string, AnimationConfig>;
  transitions: Record<string, TransitionConfig>;
  depth: DepthConfig;
}

export interface ResolutionConfig {
  order: string[];
  mode: 'multiplicative' | 'additive' | 'max';
}

export interface ContentVolumeConfig {
  thresholds: Record<string, ContentThreshold>;
  metrics: string[];
}

export interface ContentThreshold {
  min?: number;
  max?: number;
  scale: number;
  ui: UIMode;
}

export interface ActivityLevelConfig {
  states: Record<ActivityState, ActivityStateConfig>;
  transitionRules: ActivityTransitionRules;
}

export interface ActivityStateConfig {
  animation: string;
  opacity: number;
  updateInterval: number;
}

export interface ActivityTransitionRules {
  idleAfter: number;
  dormantAfter: number;
  activeOnInteraction: boolean;
  busyThreshold: number;
  criticalConditions: string[];
}

export interface UserPermissionConfig {
  levels: Record<PermissionLevel, PermissionLevelConfig>;
  inheritance: string;
}

export interface PermissionLevelConfig {
  visible: boolean;
  interactable: boolean;
  opacity?: number;
  actions?: string[];
}

export interface AnimationConfig {
  keyframes: string | null;
  duration: number;
  easing?: string;
  iterations?: string | number;
}

export interface TransitionConfig {
  transform?: string;
  opacity?: number;
  duration: number;
  easing: string;
}

export interface DepthConfig {
  maxLevels: number;
  scaleFactor: number;
  opacityFactor: number;
  blurFactor: number;
}
