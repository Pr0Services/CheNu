/* =====================================================
   CHE·NU — Page Composition Engine
   
   PHASE 3: PURE PAGE COMPOSER
   
   This engine takes PageContext and produces PageComposition.
   It does NOT know what spheres exist or what they contain.
   It composes based on:
   - Resolved dimensions
   - Content structure
   - Display rules (from JSON)
   
   PURE FUNCTION: Same input = same output.
   ===================================================== */

import {
  PageContext,
  PageComposition,
  ContentNode,
  SectionComposition,
  ItemComposition,
  LayoutComposition,
  NavigationComposition,
  PageState,
  PageRules,
  BreadcrumbItem,
  NavigationTarget,
} from './page.types';

import { ResolvedDimension, DensityLevel, ContentLevel } from '../../core-reference/resolver/types';

// ─────────────────────────────────────────────────────
// DEFAULT RULES (would come from JSON in production)
// ─────────────────────────────────────────────────────

const DEFAULT_RULES: PageRules = {
  depthLayouts: {
    0: { type: 'centered', direction: 'horizontal', spacing: 'expanded', maxWidth: null, background: 'subtle' },
    1: { type: 'sidebar', direction: 'horizontal', spacing: 'standard', maxWidth: '1400px', background: 'subtle' },
    2: { type: 'full', direction: 'vertical', spacing: 'compact', maxWidth: '1200px', background: 'none' },
    3: { type: 'full', direction: 'vertical', spacing: 'minimal', maxWidth: '1000px', background: 'none' },
  },
  densitySections: {
    minimal: ['primary'],
    compact: ['primary', 'secondary'],
    standard: ['primary', 'secondary', 'metrics'],
    expanded: ['primary', 'secondary', 'metrics', 'agents'],
    full: ['primary', 'secondary', 'metrics', 'agents', 'history'],
  },
  contentSizes: {
    minimal: 'sm',
    low: 'md',
    medium: 'lg',
    high: 'lg',
    extreme: 'xl',
  },
  gridColumns: [
    { min: 1, max: 2, columns: 1 },
    { min: 3, max: 4, columns: 2 },
    { min: 5, max: 8, columns: 3 },
    { min: 9, max: 12, columns: 4 },
    { min: 13, max: 999, columns: 5 },
  ],
  priorityThresholds: {
    alwaysShow: 0,
    showIfSpace: 50,
    hideByDefault: 100,
  },
};

// ─────────────────────────────────────────────────────
// MAIN COMPOSITION FUNCTION
// ─────────────────────────────────────────────────────

/**
 * Composes a page from context.
 * 
 * @param context - Everything the page needs
 * @param rules - Composition rules (optional, uses defaults)
 * @returns PageComposition ready for rendering
 * 
 * PURE FUNCTION: Deterministic output.
 */
export function composePage(
  context: PageContext,
  rules: PageRules = DEFAULT_RULES
): PageComposition {
  const { navigation, dimension, content, preferences } = context;
  
  // 1. Determine layout based on depth and dimension
  const layout = composeLayout(navigation.depth, dimension, rules, preferences);
  
  // 2. Compose sections from content
  const sections = composeSections(content, dimension, rules, preferences);
  
  // 3. Compose navigation
  const nav = composeNavigation(context);
  
  // 4. Determine page state
  const state = composePageState(context);
  
  return {
    layout,
    sections,
    navigation: nav,
    state,
  };
}

// ─────────────────────────────────────────────────────
// LAYOUT COMPOSITION
// ─────────────────────────────────────────────────────

function composeLayout(
  depth: number,
  dimension: ResolvedDimension,
  rules: PageRules,
  preferences: PageContext['preferences']
): LayoutComposition {
  // Get base layout for depth
  const baseLayout = rules.depthLayouts[depth] || rules.depthLayouts[0];
  
  // Adjust spacing based on density
  const spacing = mapDensityToSpacing(dimension.density.level, preferences.compactMode);
  
  return {
    ...baseLayout,
    spacing,
  };
}

function mapDensityToSpacing(
  density: DensityLevel,
  compactMode: boolean
): LayoutComposition['spacing'] {
  if (compactMode) {
    return density === 'full' ? 'standard' : 'minimal';
  }
  
  const map: Record<DensityLevel, LayoutComposition['spacing']> = {
    minimal: 'minimal',
    compact: 'compact',
    standard: 'standard',
    expanded: 'expanded',
    full: 'expanded',
  };
  
  return map[density] || 'standard';
}

// ─────────────────────────────────────────────────────
// SECTION COMPOSITION
// ─────────────────────────────────────────────────────

function composeSections(
  content: ContentNode,
  dimension: ResolvedDimension,
  rules: PageRules,
  preferences: PageContext['preferences']
): SectionComposition[] {
  const sections: SectionComposition[] = [];
  
  // Get visible sections based on density
  const visibleSectionIds = rules.densitySections[dimension.density.level] || ['primary'];
  
  // Primary section: main children
  if (visibleSectionIds.includes('primary') && content.children) {
    sections.push(composePrimarySection(content, dimension, rules));
  }
  
  // Metrics section
  if (visibleSectionIds.includes('metrics') && content.metrics) {
    sections.push(composeMetricsSection(content, dimension));
  }
  
  // Actions section
  if (visibleSectionIds.includes('agents') && content.actions) {
    sections.push(composeActionsSection(content, dimension));
  }
  
  return sections.filter(s => s.visible);
}

function composePrimarySection(
  content: ContentNode,
  dimension: ResolvedDimension,
  rules: PageRules
): SectionComposition {
  const children = content.children || [];
  const itemCount = children.length;
  
  // Determine layout type based on visual.growthAxis
  const layoutType = mapGrowthAxisToLayout(content.visual.growthAxis, itemCount);
  
  // Determine columns based on item count
  const columns = determineColumns(itemCount, rules);
  
  // Compose items
  const items = children
    .sort((a, b) => a.priority - b.priority)
    .map(child => composeItem(child, dimension, rules));
  
  return {
    id: 'primary',
    label: content.label,
    showLabel: false, // Primary section doesn't show its own label
    items,
    layout: layoutType,
    columns,
    priority: 0,
    visible: items.length > 0,
    collapsed: false,
    expandable: items.length > 8,
    sortable: dimension.density.level !== 'minimal',
  };
}

function composeMetricsSection(
  content: ContentNode,
  dimension: ResolvedDimension
): SectionComposition {
  // Metrics are displayed as simple items
  const metrics = content.metrics!;
  const metricItems: ContentNode[] = [
    { id: 'metric-items', type: 'metric', label: 'Items', description: String(metrics.itemCount), visual: content.visual, state: content.state, priority: 0 },
    { id: 'metric-agents', type: 'metric', label: 'Agents', description: String(metrics.agentCount), visual: content.visual, state: content.state, priority: 1 },
    { id: 'metric-active', type: 'metric', label: 'Active', description: String(metrics.activeCount), visual: content.visual, state: content.state, priority: 2 },
    { id: 'metric-pending', type: 'metric', label: 'Pending', description: String(metrics.pendingCount), visual: content.visual, state: content.state, priority: 3 },
  ];
  
  return {
    id: 'metrics',
    label: 'Metrics',
    showLabel: true,
    items: metricItems.map(m => composeItem(m, dimension, DEFAULT_RULES)),
    layout: 'grid',
    columns: 4,
    priority: 50,
    visible: true,
    collapsed: dimension.density.level === 'compact',
    expandable: false,
    sortable: false,
  };
}

function composeActionsSection(
  content: ContentNode,
  dimension: ResolvedDimension
): SectionComposition {
  const actions = content.actions || [];
  const actionItems: ContentNode[] = actions.map((a, i) => ({
    id: `action-${a.id}`,
    type: 'action',
    label: a.label,
    icon: a.icon,
    visual: content.visual,
    state: content.state,
    priority: i,
  }));
  
  return {
    id: 'actions',
    label: 'Actions',
    showLabel: dimension.density.details >= 3,
    items: actionItems.map(a => composeItem(a, dimension, DEFAULT_RULES)),
    layout: 'list',
    columns: 1,
    priority: 80,
    visible: actions.length > 0,
    collapsed: false,
    expandable: false,
    sortable: false,
  };
}

// ─────────────────────────────────────────────────────
// ITEM COMPOSITION
// ─────────────────────────────────────────────────────

function composeItem(
  node: ContentNode,
  parentDimension: ResolvedDimension,
  rules: PageRules
): ItemComposition {
  // Calculate item-specific dimension adjustments
  const itemDimension = adjustDimensionForItem(node, parentDimension);
  
  // Determine size based on content level
  const size = mapContentLevelToSize(parentDimension.contentLevel, rules);
  
  // Determine what to show based on density
  const showDetails = parentDimension.density.details >= 2;
  const showMetrics = parentDimension.density.details >= 3 && !!node.metrics;
  const showActions = parentDimension.density.details >= 4 && !!node.actions?.length;
  
  // Calculate position for orbital layouts
  const position = node.visual.growthAxis === 'radial' 
    ? calculateOrbitalPosition(node.priority, 8) 
    : undefined;
  
  return {
    node,
    dimension: itemDimension,
    size: size as ItemComposition['size'],
    showDetails,
    showMetrics,
    showActions,
    position,
  };
}

function adjustDimensionForItem(
  node: ContentNode,
  parentDimension: ResolvedDimension
): ResolvedDimension {
  // Items inherit parent dimension but can be adjusted by their state
  const stateMultiplier = node.state.isActive ? 1.1 : node.state.isLocked ? 0.8 : 1.0;
  const focusMultiplier = node.state.isFocused ? 1.15 : 1.0;
  
  return {
    ...parentDimension,
    scale: parentDimension.scale * stateMultiplier * focusMultiplier,
    visibility: node.state.isLocked ? parentDimension.visibility * 0.6 : parentDimension.visibility,
    interactable: parentDimension.interactable && !node.state.isLocked,
  };
}

function mapContentLevelToSize(
  level: ContentLevel,
  rules: PageRules
): string {
  return rules.contentSizes[level] || 'md';
}

function calculateOrbitalPosition(
  priority: number,
  totalItems: number
): ItemComposition['position'] {
  const angle = (priority / totalItems) * 2 * Math.PI;
  const radius = 180 + (priority % 3) * 40; // Varying radius for depth
  
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    z: 0,
    angle: angle * (180 / Math.PI),
    radius,
  };
}

// ─────────────────────────────────────────────────────
// NAVIGATION COMPOSITION
// ─────────────────────────────────────────────────────

function composeNavigation(context: PageContext): NavigationComposition {
  const { navigation, content, dimension } = context;
  
  // Build breadcrumb
  const breadcrumb = buildBreadcrumb(navigation.path);
  
  // Build navigation targets
  const targets = buildNavigationTargets(content, dimension);
  
  // Back action
  const backAction = navigation.canGoBack 
    ? { id: 'back', label: 'Back', path: navigation.path.slice(0, -1), type: 'back' as const }
    : null;
  
  // Quick actions based on children
  const quickActions = (content.children || [])
    .slice(0, 5)
    .map(child => ({
      id: child.id,
      label: child.label,
      icon: child.icon,
      path: [...navigation.path, child.id],
      type: 'enter' as const,
    }));
  
  return {
    breadcrumb,
    targets,
    backAction,
    quickActions,
  };
}

function buildBreadcrumb(path: string[]): BreadcrumbItem[] {
  return path.map((segment, index) => ({
    id: segment,
    label: formatLabel(segment),
    path: path.slice(0, index + 1),
  }));
}

function buildNavigationTargets(
  content: ContentNode,
  dimension: ResolvedDimension
): NavigationTarget[] {
  if (!dimension.visible || dimension.currentDepth >= dimension.depthAllowed) {
    return [];
  }
  
  return (content.children || []).map(child => ({
    id: child.id,
    label: child.label,
    icon: child.icon,
    path: [content.id, child.id],
    type: 'enter' as const,
  }));
}

function formatLabel(segment: string): string {
  // Convert kebab-case or camelCase to Title Case
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ─────────────────────────────────────────────────────
// PAGE STATE COMPOSITION
// ─────────────────────────────────────────────────────

function composePageState(context: PageContext): PageState {
  return {
    isLoading: false,
    isTransitioning: false,
    error: null,
    animationPhase: 'idle',
    interactionMode: 'browse',
  };
}

// ─────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────

function mapGrowthAxisToLayout(
  axis: ContentNode['visual']['growthAxis'],
  itemCount: number
): SectionComposition['layout'] {
  if (axis === 'radial') return 'orbital';
  if (axis === 'vertical') return itemCount > 4 ? 'grid' : 'list';
  if (axis === 'horizontal') return 'grid';
  return 'stack';
}

function determineColumns(itemCount: number, rules: PageRules): number {
  for (const rule of rules.gridColumns) {
    if (itemCount >= rule.min && itemCount <= rule.max) {
      return rule.columns;
    }
  }
  return 4;
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export {
  composeLayout,
  composeSections,
  composeNavigation,
  composePageState,
  composeItem,
  DEFAULT_RULES,
};

export default composePage;
