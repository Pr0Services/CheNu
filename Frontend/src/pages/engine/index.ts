/* =====================================================
   CHE·NU — Pages Module
   
   PHASE 3: ADAPTIVE PAGES ENGINE
   
   This module provides:
   - Page composition engine
   - Generic UI components
   - Adaptive page orchestrators
   - Content builders
   
   Usage:
   
   import { 
     composePage,
     AdaptivePageRouter,
     buildUniverseContent,
   } from '@/pages/engine';
   
   const content = buildUniverseContent({ spheres });
   
   <AdaptivePageRouter
     path={currentPath}
     content={content}
     user={currentUser}
     onNavigate={handleNavigate}
   />
   
   ===================================================== */

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export type {
  // Page context
  PageContext,
  UserContext,
  NavigationContext,
  DisplayPreferences,
  
  // Content nodes
  ContentNode,
  NodeVisual,
  NodeMetrics,
  NodeAction,
  NodeState,
  
  // Composition output
  PageComposition,
  LayoutComposition,
  SectionComposition,
  ItemComposition,
  PageState,
  NavigationComposition,
  BreadcrumbItem,
  NavigationTarget,
  
  // Rules
  PageRules,
} from './page.types';

// ─────────────────────────────────────────────────────
// COMPOSITION ENGINE
// ─────────────────────────────────────────────────────

export {
  default as composePage,
  composeLayout,
  composeSections,
  composeNavigation,
  composePageState,
  composeItem,
  DEFAULT_RULES,
} from './pageComposer';

// ─────────────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────────────

export {
  PageContainer,
  PageSection,
  PageItem,
  AdaptivePage,
} from './PageComponents';

// ─────────────────────────────────────────────────────
// PAGE ORCHESTRATORS
// ─────────────────────────────────────────────────────

export {
  useAdaptivePage,
  UniversePage,
  SpherePage,
  NodePage,
  AdaptivePageRouter,
} from './AdaptivePages';

// ─────────────────────────────────────────────────────
// CONTENT BUILDERS
// ─────────────────────────────────────────────────────

export {
  buildUniverseContent,
  buildSphereNode,
  buildNode,
  transformContent,
  findNode,
  getNodeAtPath,
  updateNodeAtPath,
  setFocused,
  setExpanded,
  setActivityLevel,
} from './contentBuilder';
