/* =====================================================
   CHE·NU — Adaptive Page Types
   
   PHASE 3: PAGE COMPOSITION TYPES
   
   These types define the structure of adaptive pages.
   Pages don't know WHAT they display — they know HOW
   to display based on resolved dimensions.
   ===================================================== */

import { ResolvedDimension } from '../../core-reference/resolver/types';

// ─────────────────────────────────────────────────────
// PAGE CONTEXT (Input to pages)
// ─────────────────────────────────────────────────────

/**
 * Everything a page needs to render.
 * Pages receive this — they don't build it.
 */
export interface PageContext {
  // Who is viewing
  user: UserContext;
  
  // Where in the hierarchy
  navigation: NavigationContext;
  
  // Resolved dimensions for this view
  dimension: ResolvedDimension;
  
  // What to display (generic)
  content: ContentNode;
  
  // Display preferences
  preferences: DisplayPreferences;
}

export interface UserContext {
  id: string;
  role: string;
  permissions: string[];
}

export interface NavigationContext {
  // Current position in hierarchy
  path: string[];           // e.g., ['universe', 'business', 'projects']
  depth: number;            // 0 = universe, 1 = sphere, 2+ = node
  
  // Navigation state
  canGoBack: boolean;
  canGoDeeper: boolean;     // Based on depthAllowed
  
  // Focus state
  focusedId: string | null;
  selectedIds: string[];
}

export interface DisplayPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  compactMode: boolean;
  showDebug: boolean;
}

// ─────────────────────────────────────────────────────
// CONTENT NODE (Generic content structure)
// ─────────────────────────────────────────────────────

/**
 * Generic node that can represent anything:
 * - Universe (contains spheres)
 * - Sphere (contains nodes)
 * - Node (contains sub-nodes or leaves)
 * 
 * Pages don't care what type — they render based on properties.
 */
export interface ContentNode {
  // Identity
  id: string;
  type: string;             // 'universe' | 'sphere' | 'node' | 'leaf'
  
  // Display
  label: string;
  icon?: string;
  description?: string;
  
  // Visual hints (from config, not hardcoded)
  visual: NodeVisual;
  
  // Children (recursive)
  children?: ContentNode[];
  childCount?: number;      // For lazy loading
  
  // Metrics (optional, affects dimension)
  metrics?: NodeMetrics;
  
  // Actions available
  actions?: NodeAction[];
  
  // State
  state: NodeState;
  
  // Priority for display order
  priority: number;
}

export interface NodeVisual {
  shape: 'structure' | 'organic' | 'hybrid';
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  growthAxis: 'vertical' | 'horizontal' | 'radial' | 'depth';
  glowEnabled: boolean;
  glowIntensity: number;
}

export interface NodeMetrics {
  itemCount: number;
  agentCount: number;
  activeCount: number;
  pendingCount: number;
}

export interface NodeAction {
  id: string;
  label: string;
  icon?: string;
  type: 'primary' | 'secondary' | 'danger';
  requiredPermission?: string;
}

export interface NodeState {
  isActive: boolean;
  isLocked: boolean;
  isFocused: boolean;
  isExpanded: boolean;
  activityLevel: 'dormant' | 'idle' | 'active' | 'busy' | 'critical';
}

// ─────────────────────────────────────────────────────
// PAGE COMPOSITION (Output from engine)
// ─────────────────────────────────────────────────────

/**
 * What the page engine produces.
 * This is what the UI renders.
 */
export interface PageComposition {
  // Layout structure
  layout: LayoutComposition;
  
  // Sections to render
  sections: SectionComposition[];
  
  // Global page state
  state: PageState;
  
  // Navigation options
  navigation: NavigationComposition;
}

export interface LayoutComposition {
  // Main layout type
  type: 'centered' | 'split' | 'full' | 'sidebar';
  
  // Direction
  direction: 'horizontal' | 'vertical';
  
  // Spacing (derived from density)
  spacing: 'minimal' | 'compact' | 'standard' | 'expanded';
  
  // Maximum content width
  maxWidth: string | null;
  
  // Background treatment
  background: 'none' | 'subtle' | 'prominent';
}

export interface SectionComposition {
  // Identity
  id: string;
  
  // Display
  label?: string;
  showLabel: boolean;
  
  // Content
  items: ItemComposition[];
  
  // Layout within section
  layout: 'grid' | 'list' | 'orbital' | 'stack';
  columns: number;
  
  // Visibility
  priority: number;
  visible: boolean;
  collapsed: boolean;
  
  // Interaction
  expandable: boolean;
  sortable: boolean;
}

export interface ItemComposition {
  // Source node
  node: ContentNode;
  
  // Resolved dimension for this item
  dimension: ResolvedDimension;
  
  // Display properties
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showDetails: boolean;
  showMetrics: boolean;
  showActions: boolean;
  
  // Position (for orbital layouts)
  position?: {
    x: number;
    y: number;
    z: number;
    angle?: number;
    radius?: number;
  };
}

export interface PageState {
  // Loading states
  isLoading: boolean;
  isTransitioning: boolean;
  
  // Error state
  error: string | null;
  
  // Animation state
  animationPhase: 'enter' | 'idle' | 'exit';
  
  // Interaction mode
  interactionMode: 'browse' | 'select' | 'edit' | 'search';
}

export interface NavigationComposition {
  // Breadcrumb
  breadcrumb: BreadcrumbItem[];
  
  // Available navigation targets
  targets: NavigationTarget[];
  
  // Back action
  backAction: NavigationTarget | null;
  
  // Quick actions
  quickActions: NavigationTarget[];
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: string;
  path: string[];
}

export interface NavigationTarget {
  id: string;
  label: string;
  icon?: string;
  path: string[];
  type: 'enter' | 'back' | 'sibling' | 'action';
}

// ─────────────────────────────────────────────────────
// PAGE RULES (From JSON config)
// ─────────────────────────────────────────────────────

/**
 * Rules that govern page composition.
 * Loaded from JSON, not hardcoded.
 */
export interface PageRules {
  // Layout rules based on depth
  depthLayouts: Record<number, LayoutComposition>;
  
  // Section visibility based on density
  densitySections: Record<string, string[]>;
  
  // Item size based on content level
  contentSizes: Record<string, string>;
  
  // Grid columns based on item count
  gridColumns: { min: number; max: number; columns: number }[];
  
  // Priority thresholds
  priorityThresholds: {
    alwaysShow: number;
    showIfSpace: number;
    hideByDefault: number;
  };
}
