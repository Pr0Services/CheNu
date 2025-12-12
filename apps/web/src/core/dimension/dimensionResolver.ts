/* =====================================================
   CHE·NU — Dimension Resolver Engine
   core/dimension/dimensionResolver.ts
   
   CONSTITUTIONAL EXECUTOR
   This engine INTERPRETS rules from JSON configs.
   It does NOT make decisions - it executes the law.
   ===================================================== */

import {
  ResolutionContext,
  ResolvedDimension,
  DimensionEngineConfig,
  SphereConfig,
  ActivityState,
  UIMode,
  DimensionClass,
  ContentMetrics,
  ActivityMetrics,
  UserContext,
  PermissionLevel,
} from './dimension.types';

import dimensionEngineConfig from '../config/dimension.engine.json';

// ─────────────────────────────────────────────────────
// Engine Configuration (Immutable)
// ─────────────────────────────────────────────────────

const ENGINE = dimensionEngineConfig as DimensionEngineConfig;

// ─────────────────────────────────────────────────────
// Main Resolver Function
// ─────────────────────────────────────────────────────

export function resolveDimension(context: ResolutionContext): ResolvedDimension {
  const { contentVolume, activityLevel, sphereConfig, userContext, depth = 0 } = context;
  
  // 1. Resolve each factor according to constitutional order
  const contentResolution = resolveContentVolume(contentVolume);
  const activityResolution = resolveActivityLevel(activityLevel);
  const permissionResolution = resolvePermissions(userContext, sphereConfig);
  const depthResolution = resolveDepth(depth);
  
  // 2. Resolve visual properties from sphere config
  const shapeResolution = resolveShape(sphereConfig.visual.baseShape);
  const colorResolution = resolveColor(sphereConfig.visual.color, sphereConfig.visual.glow);
  const growthResolution = resolveGrowthAxis(sphereConfig.visual.growthAxis);
  
  // 3. Resolve animation based on activity and sphere behavior
  const animationResolution = resolveAnimation(
    activityResolution.state,
    sphereConfig.behavior
  );
  
  // 4. Compute final scale (multiplicative as per constitution)
  const finalScale = computeFinalScale(
    contentResolution.scale,
    depthResolution.scale,
    sphereConfig.rules.sizeByContent
  );
  
  // 5. Compute final opacity
  const finalOpacity = computeFinalOpacity(
    activityResolution.opacity,
    permissionResolution.opacity,
    depthResolution.opacity
  );
  
  // 6. Determine dimension class
  const dimensionClass = determineDimensionClass(
    contentResolution.scale,
    sphereConfig.layout
  );
  
  return {
    // Visual
    scale: finalScale,
    opacity: finalOpacity,
    shape: shapeResolution,
    color: colorResolution,
    glow: {
      enabled: sphereConfig.visual.glow.enabled && permissionResolution.visible,
      intensity: sphereConfig.visual.glow.intensity * finalOpacity,
      color: sphereConfig.visual.glow.color,
      blur: 20 * sphereConfig.visual.glow.intensity,
    },
    
    // Layout
    dimension: dimensionClass,
    growthAxis: growthResolution,
    arrangement: sphereConfig.agents.arrangement,
    
    // Animation
    animation: animationResolution,
    transition: {
      property: 'all',
      duration: ENGINE.transitions.fade.duration,
      easing: ENGINE.transitions.fade.easing,
      delay: 0,
    },
    
    // State
    activityState: activityResolution.state,
    uiMode: contentResolution.uiMode,
    
    // Permissions
    visible: permissionResolution.visible,
    interactable: permissionResolution.interactable,
    allowedActions: permissionResolution.actions,
    
    // Depth
    zIndex: 10 - depth,
    depthScale: depthResolution.scale,
    depthOpacity: depthResolution.opacity,
  };
}

// ─────────────────────────────────────────────────────
// Content Volume Resolution
// ─────────────────────────────────────────────────────

interface ContentResolution {
  scale: number;
  uiMode: UIMode;
  level: string;
}

function resolveContentVolume(metrics: ContentMetrics): ContentResolution {
  const total = metrics.itemCount + metrics.agentCount + 
                metrics.activeProcesses + metrics.pendingDecisions;
  
  const thresholds = ENGINE.contentVolume.thresholds;
  
  // Find matching threshold (constitutional lookup)
  if (total >= (thresholds.extreme?.min || 50)) {
    return { scale: thresholds.extreme.scale, uiMode: thresholds.extreme.ui as UIMode, level: 'extreme' };
  }
  if (total >= (thresholds.high?.min || 20)) {
    return { scale: thresholds.high.scale, uiMode: thresholds.high.ui as UIMode, level: 'high' };
  }
  if (total >= (thresholds.medium?.min || 5)) {
    return { scale: thresholds.medium.scale, uiMode: thresholds.medium.ui as UIMode, level: 'medium' };
  }
  return { scale: thresholds.low.scale, uiMode: thresholds.low.ui as UIMode, level: 'low' };
}

// ─────────────────────────────────────────────────────
// Activity Level Resolution
// ─────────────────────────────────────────────────────

interface ActivityResolution {
  state: ActivityState;
  animation: string;
  opacity: number;
}

function resolveActivityLevel(metrics: ActivityMetrics): ActivityResolution {
  const now = Date.now();
  const timeSinceInteraction = now - metrics.lastInteraction;
  const rules = ENGINE.activityLevel.transitionRules;
  const states = ENGINE.activityLevel.states;
  
  // Determine state based on constitutional rules
  let state: ActivityState;
  
  // Critical conditions take precedence
  const hasCritical = metrics.conditions.some(c => 
    rules.criticalConditions.includes(c)
  );
  
  if (hasCritical) {
    state = 'critical';
  } else if (metrics.actionsPerMinute >= rules.busyThreshold) {
    state = 'busy';
  } else if (timeSinceInteraction < rules.idleAfter) {
    state = 'active';
  } else if (timeSinceInteraction < rules.dormantAfter) {
    state = 'idle';
  } else {
    state = 'dormant';
  }
  
  const stateConfig = states[state];
  
  return {
    state,
    animation: stateConfig.animation,
    opacity: stateConfig.opacity,
  };
}

// ─────────────────────────────────────────────────────
// Permission Resolution
// ─────────────────────────────────────────────────────

interface PermissionResolution {
  visible: boolean;
  interactable: boolean;
  opacity: number;
  actions: string[];
}

function resolvePermissions(
  userContext: UserContext, 
  sphereConfig: SphereConfig
): PermissionResolution {
  const levels = ENGINE.userPermission.levels;
  
  // Determine user's permission level for this sphere
  const userPerms = userContext.permissions;
  const spherePerms = sphereConfig.permissions;
  
  // Find highest matching permission level
  let level: PermissionLevel = 'none';
  
  if (userPerms.includes('admin') || userContext.role === 'owner') {
    level = 'admin';
  } else if (userPerms.some(p => spherePerms.owner?.includes(p))) {
    level = 'admin';
  } else if (userPerms.some(p => spherePerms.contributor?.includes(p))) {
    level = 'write';
  } else if (userPerms.some(p => spherePerms.member?.includes(p))) {
    level = 'read';
  } else if (userPerms.some(p => spherePerms.default?.includes(p))) {
    level = 'view';
  }
  
  const levelConfig = levels[level];
  
  return {
    visible: levelConfig.visible,
    interactable: levelConfig.interactable,
    opacity: levelConfig.opacity ?? 1.0,
    actions: levelConfig.actions || [],
  };
}

// ─────────────────────────────────────────────────────
// Depth Resolution
// ─────────────────────────────────────────────────────

interface DepthResolution {
  scale: number;
  opacity: number;
  blur: number;
}

function resolveDepth(depth: number): DepthResolution {
  const config = ENGINE.depth;
  const clampedDepth = Math.min(depth, config.maxLevels);
  
  return {
    scale: Math.pow(config.scaleFactor, clampedDepth),
    opacity: Math.pow(config.opacityFactor, clampedDepth),
    blur: clampedDepth * config.blurFactor,
  };
}

// ─────────────────────────────────────────────────────
// Shape Resolution
// ─────────────────────────────────────────────────────

function resolveShape(shapeType: string) {
  const shape = ENGINE.shapes[shapeType as keyof typeof ENGINE.shapes];
  if (!shape) {
    console.warn(`[DimensionResolver] Unknown shape type: ${shapeType}, falling back to 'structure'`);
    return ENGINE.shapes.structure;
  }
  return shape;
}

// ─────────────────────────────────────────────────────
// Color Resolution
// ─────────────────────────────────────────────────────

function resolveColor(colorConfig: SphereConfig['visual']['color'], glowConfig: SphereConfig['visual']['glow']) {
  return {
    primary: colorConfig.primary,
    secondary: colorConfig.secondary,
    accent: colorConfig.accent,
    gradient: `linear-gradient(135deg, ${colorConfig.gradient.join(', ')})`,
    glow: glowConfig.color,
  };
}

// ─────────────────────────────────────────────────────
// Growth Axis Resolution
// ─────────────────────────────────────────────────────

function resolveGrowthAxis(axis: string) {
  const growthAxis = ENGINE.growthAxes[axis as keyof typeof ENGINE.growthAxes];
  if (!growthAxis) {
    console.warn(`[DimensionResolver] Unknown growth axis: ${axis}, falling back to 'vertical'`);
    return ENGINE.growthAxes.vertical;
  }
  return growthAxis;
}

// ─────────────────────────────────────────────────────
// Animation Resolution
// ─────────────────────────────────────────────────────

function resolveAnimation(
  activityState: ActivityState, 
  behavior: SphereConfig['behavior']
) {
  // Get animation name from behavior config based on state
  let animationName: string;
  
  switch (activityState) {
    case 'active':
    case 'busy':
      animationName = behavior.onActive.animation || 'pulse';
      break;
    case 'idle':
      animationName = behavior.onIdle.animation || 'none';
      break;
    case 'critical':
      animationName = 'alert';
      break;
    default:
      animationName = 'none';
  }
  
  const animConfig = ENGINE.animations[animationName];
  
  if (!animConfig || animConfig.keyframes === null) {
    return {
      name: null,
      duration: 0,
      easing: 'linear',
      iterations: 0,
      css: 'none',
    };
  }
  
  return {
    name: animConfig.keyframes,
    duration: animConfig.duration,
    easing: animConfig.easing || 'ease-in-out',
    iterations: animConfig.iterations || 'infinite',
    css: `${animConfig.keyframes} ${animConfig.duration}ms ${animConfig.easing || 'ease-in-out'} ${animConfig.iterations || 'infinite'}`,
  };
}

// ─────────────────────────────────────────────────────
// Computation Helpers
// ─────────────────────────────────────────────────────

function computeFinalScale(
  contentScale: number, 
  depthScale: number, 
  sizeByContent: boolean
): number {
  if (!sizeByContent) return depthScale;
  return contentScale * depthScale;
}

function computeFinalOpacity(
  activityOpacity: number,
  permissionOpacity: number,
  depthOpacity: number
): number {
  return activityOpacity * permissionOpacity * depthOpacity;
}

function determineDimensionClass(
  contentScale: number,
  layoutConfig: SphereConfig['layout']
): DimensionClass {
  const dimensionOrder: DimensionClass[] = ['XS', 'S', 'M', 'L', 'XL'];
  const minIndex = dimensionOrder.indexOf(layoutConfig.minDimension);
  const maxIndex = dimensionOrder.indexOf(layoutConfig.maxDimension);
  const defaultIndex = dimensionOrder.indexOf(layoutConfig.defaultDimension);
  
  // Scale maps to dimension: 0.6 → smaller, 1.0 → default, 1.4+ → larger
  let targetIndex: number;
  
  if (contentScale < 0.8) {
    targetIndex = defaultIndex - 1;
  } else if (contentScale < 1.2) {
    targetIndex = defaultIndex;
  } else if (contentScale < 1.5) {
    targetIndex = defaultIndex + 1;
  } else {
    targetIndex = defaultIndex + 2;
  }
  
  // Clamp to allowed range
  targetIndex = Math.max(minIndex, Math.min(maxIndex, targetIndex));
  
  return dimensionOrder[targetIndex];
}

// ─────────────────────────────────────────────────────
// Utility: Load Sphere Config
// ─────────────────────────────────────────────────────

const sphereConfigCache = new Map<string, SphereConfig>();

export async function loadSphereConfig(sphereId: string): Promise<SphereConfig> {
  if (sphereConfigCache.has(sphereId)) {
    return sphereConfigCache.get(sphereId)!;
  }
  
  try {
    // Dynamic import from spheres directory
    const config = await import(`../config/spheres/${sphereId}.json`);
    sphereConfigCache.set(sphereId, config.default || config);
    return config.default || config;
  } catch (e) {
    console.error(`[DimensionResolver] Failed to load sphere config: ${sphereId}`, e);
    throw new Error(`Sphere config not found: ${sphereId}`);
  }
}

// ─────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────

export default {
  resolveDimension,
  loadSphereConfig,
};
