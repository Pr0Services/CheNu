/* =====================================================
   CHE·NU — Navigation Types
   
   PHASE 4: NAVIGATION SYSTEM
   
   Type definitions for the navigation system.
   Framework-agnostic, consumed by resolver and adapters.
   ===================================================== */

// ─────────────────────────────────────────────────────
// ROUTE TYPES
// ─────────────────────────────────────────────────────

export type RouteType = 'root' | 'container' | 'detail' | 'utility';

export type ViewType = string;

export interface RouteConfig {
  path: string;
  type: RouteType;
  title: string;
  defaultView: ViewType;
  allowedViews: ViewType[];
  parent?: string;
  children?: string[];
  modal?: boolean;
}

export interface RouteParams {
  sphereId?: string;
  branchId?: string;
  agentId?: string;
  itemId?: string;
  [key: string]: string | undefined;
}

export interface ParsedRoute {
  routeId: string;
  config: RouteConfig;
  params: RouteParams;
  view: ViewType;
  query: Record<string, string>;
  hash: string;
}

// ─────────────────────────────────────────────────────
// TRANSITION TYPES
// ─────────────────────────────────────────────────────

export type EasingType = 
  | 'linear' 
  | 'ease' 
  | 'ease-in' 
  | 'ease-out' 
  | 'ease-in-out'
  | string;

export interface TransitionEffect {
  scale?: { from: number; to: number };
  opacity?: { from: number; to: number };
  translateX?: { from: number; to: number; unit?: string };
  translateY?: { from: number; to: number; unit?: string };
  rotate?: { from: number; to: number };
  blur?: { from: number; to: number };
  background?: string;
}

export interface TransitionConfig {
  from: string;
  to: string;
  animation: string;
  duration: number;
  easing: EasingType;
  effects: {
    outgoing?: TransitionEffect;
    incoming?: TransitionEffect;
    overlay?: TransitionEffect;
  };
}

export interface ResolvedTransition {
  config: TransitionConfig;
  outgoingStyles: {
    initial: React.CSSProperties;
    final: React.CSSProperties;
  };
  incomingStyles: {
    initial: React.CSSProperties;
    final: React.CSSProperties;
  };
  overlayStyles?: {
    initial: React.CSSProperties;
    final: React.CSSProperties;
  };
  duration: number;
  easing: string;
}

// ─────────────────────────────────────────────────────
// NAVIGATION STATE
// ─────────────────────────────────────────────────────

export interface NavigationState {
  current: ParsedRoute;
  previous: ParsedRoute | null;
  history: NavigationHistoryEntry[];
  historyIndex: number;
  isTransitioning: boolean;
  transitionDirection: 'forward' | 'back' | 'replace' | null;
  modal: ParsedRoute | null;
}

export interface NavigationHistoryEntry {
  route: ParsedRoute;
  timestamp: number;
  scrollPosition?: { x: number; y: number };
}

// ─────────────────────────────────────────────────────
// BREADCRUMB TYPES
// ─────────────────────────────────────────────────────

export interface BreadcrumbItem {
  routeId: string;
  label: string;
  path: string;
  icon?: string;
  isActive: boolean;
}

export interface BreadcrumbConfig {
  enabled: boolean;
  maxDepth: number;
  separator: string;
  homeIcon: string;
  truncateAt: number;
  templates: Record<string, string>;
}

// ─────────────────────────────────────────────────────
// GUARD TYPES
// ─────────────────────────────────────────────────────

export type PermissionLevel = 'none' | 'glimpse' | 'view' | 'read' | 'write' | 'admin';

export interface GuardConfig {
  requirePermission: PermissionLevel;
  redirectOnFail: string;
  showMessage: boolean;
}

export interface GuardResult {
  allowed: boolean;
  redirectTo?: string;
  message?: string;
}

// ─────────────────────────────────────────────────────
// GESTURE & KEYBOARD TYPES
// ─────────────────────────────────────────────────────

export type GestureDirection = 'left' | 'right' | 'up' | 'down';
export type GestureAction = 'back' | 'forward' | 'zoom-view' | 'close';

export interface GestureConfig {
  enabled: boolean;
  threshold: number;
  direction?: GestureDirection;
  minScale?: number;
  maxScale?: number;
  action: GestureAction;
}

export type KeyboardAction = 
  | 'back'
  | 'back-or-close'
  | 'forward'
  | 'home'
  | 'settings'
  | 'command-palette'
  | `sphere:${string}`;

// ─────────────────────────────────────────────────────
// FULL CONFIG TYPE
// ─────────────────────────────────────────────────────

export interface NavigationConfig {
  version: string;
  description: string;
  routes: Record<string, RouteConfig>;
  transitions: Record<string, TransitionConfig>;
  breadcrumbs: BreadcrumbConfig;
  history: {
    maxEntries: number;
    persistKey: string;
    trackParams: boolean;
    trackScroll: boolean;
  };
  deepLinking: {
    enabled: boolean;
    baseUrl: string;
    queryParams: Record<string, string>;
  };
  guards: Record<string, GuardConfig>;
  gestures: Record<string, GestureConfig>;
  keyboard: {
    shortcuts: Record<string, KeyboardAction>;
  };
}

// ─────────────────────────────────────────────────────
// CONTEXT DATA (for template interpolation)
// ─────────────────────────────────────────────────────

export interface NavigationContextData {
  spheres: Record<string, { name: string; icon: string }>;
  branches: Record<string, { name: string }>;
  agents: Record<string, { name: string; icon: string }>;
  items: Record<string, { name: string }>;
}

// ─────────────────────────────────────────────────────
// NAVIGATION OPTIONS
// ─────────────────────────────────────────────────────

export interface NavigateOptions {
  replace?: boolean;
  preserveScroll?: boolean;
  skipTransition?: boolean;
  state?: Record<string, unknown>;
}
