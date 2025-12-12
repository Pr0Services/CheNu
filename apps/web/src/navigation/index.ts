/* =====================================================
   CHE·NU — Navigation Module Index
   
   PHASE 4: NAVIGATION SYSTEM EXPORTS
   
   Central export point for all navigation functionality.
   ===================================================== */

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export type {
  RouteType,
  ViewType,
  RouteConfig,
  RouteParams,
  ParsedRoute,
  EasingType,
  TransitionEffect,
  TransitionConfig,
  ResolvedTransition,
  NavigationState,
  NavigationHistoryEntry,
  BreadcrumbItem,
  BreadcrumbConfig,
  PermissionLevel,
  GuardConfig,
  GuardResult,
  GestureDirection,
  GestureAction,
  GestureConfig,
  KeyboardAction,
  NavigationConfig,
  NavigationContextData,
  NavigateOptions,
} from './types';

// ─────────────────────────────────────────────────────
// RESOLVER (Pure Functions)
// ─────────────────────────────────────────────────────

export {
  parsePath,
  matchRoute,
  resolveRoute,
  buildPath,
  findTransition,
  resolveTransition,
  buildBreadcrumbs,
  checkPermission,
  checkGuard,
  normalizeKeyboardEvent,
  resolveKeyboardAction,
  addToHistory,
  canGoBack,
  canGoForward,
} from './navigationResolver';

// ─────────────────────────────────────────────────────
// REACT HOOKS
// ─────────────────────────────────────────────────────

export {
  NavigationProvider,
  useNavigation,
  useRoute,
  useParams,
  useBreadcrumbs,
  useModal,
  useView,
  useTransition,
} from './useNavigation';

// ─────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────

export {
  TransitionLayer,
  ModalContainer,
  transitionStyles,
} from './TransitionComponents';

export {
  Breadcrumbs,
  breadcrumbsStyles,
} from './Breadcrumbs';

// ─────────────────────────────────────────────────────
// CONFIG LOADER
// ─────────────────────────────────────────────────────

let cachedConfig: import('./types').NavigationConfig | null = null;

/**
 * Load navigation config from JSON.
 * Singleton pattern - loads once, returns cached.
 */
export async function loadNavigationConfig(): Promise<import('./types').NavigationConfig> {
  if (cachedConfig) return cachedConfig;
  
  try {
    const config = await import('../../core-reference/navigation.config.json');
    cachedConfig = config.default || config;
    return cachedConfig;
  } catch (error) {
    console.error('[Navigation] Failed to load config:', error);
    throw error;
  }
}

/**
 * Get cached config (sync).
 * Returns null if not loaded yet.
 */
export function getNavigationConfig(): import('./types').NavigationConfig | null {
  return cachedConfig;
}
