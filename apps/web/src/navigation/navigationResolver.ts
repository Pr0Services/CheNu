/* =====================================================
   CHE·NU — Navigation Resolver
   
   PHASE 4: PURE NAVIGATION LOGIC
   
   All navigation logic is pure functions.
   - Route parsing
   - Transition resolution
   - Breadcrumb building
   - Guard checking
   
   NO SIDE EFFECTS. NO FRAMEWORK DEPENDENCIES.
   ===================================================== */

import {
  NavigationConfig,
  RouteConfig,
  RouteParams,
  ParsedRoute,
  TransitionConfig,
  ResolvedTransition,
  TransitionEffect,
  BreadcrumbItem,
  GuardResult,
  PermissionLevel,
  NavigationContextData,
} from './types';

// ─────────────────────────────────────────────────────
// ROUTE PARSING
// ─────────────────────────────────────────────────────

/**
 * Parse a path string into route components.
 * Pure function - same input always produces same output.
 */
export function parsePath(path: string): {
  pathname: string;
  query: Record<string, string>;
  hash: string;
} {
  const [pathWithHash, hash = ''] = path.split('#');
  const [pathname, queryString = ''] = pathWithHash.split('?');
  
  const query: Record<string, string> = {};
  if (queryString) {
    queryString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) {
        query[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    });
  }
  
  return {
    pathname: pathname || '/',
    query,
    hash: hash ? `#${hash}` : '',
  };
}

/**
 * Match a pathname against a route pattern.
 * Returns params if matched, null otherwise.
 */
export function matchRoute(
  pathname: string,
  pattern: string
): RouteParams | null {
  // Normalize paths
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const normalizedPattern = pattern.replace(/\/+$/, '') || '/';
  
  // Split into segments
  const pathSegments = normalizedPath.split('/').filter(Boolean);
  const patternSegments = normalizedPattern.split('/').filter(Boolean);
  
  // Root route special case
  if (patternSegments.length === 0 && pathSegments.length === 0) {
    return {};
  }
  
  // Different segment counts = no match
  if (pathSegments.length !== patternSegments.length) {
    return null;
  }
  
  const params: RouteParams = {};
  
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSeg = patternSegments[i];
    const pathSeg = pathSegments[i];
    
    if (patternSeg.startsWith(':')) {
      // Parameter segment
      const paramName = patternSeg.slice(1);
      params[paramName] = pathSeg;
    } else if (patternSeg !== pathSeg) {
      // Static segment mismatch
      return null;
    }
  }
  
  return params;
}

/**
 * Find the matching route for a given path.
 */
export function resolveRoute(
  path: string,
  config: NavigationConfig
): ParsedRoute | null {
  const { pathname, query, hash } = parsePath(path);
  
  // Try each route
  for (const [routeId, routeConfig] of Object.entries(config.routes)) {
    const params = matchRoute(pathname, routeConfig.path);
    
    if (params !== null) {
      // Extract view from query if present
      const viewParam = config.deepLinking.queryParams.view;
      const view = query[viewParam] || routeConfig.defaultView;
      
      // Remove view param from query
      const { [viewParam]: _, ...restQuery } = query;
      
      return {
        routeId,
        config: routeConfig,
        params,
        view,
        query: restQuery,
        hash,
      };
    }
  }
  
  return null;
}

/**
 * Build a path string from route ID and params.
 */
export function buildPath(
  routeId: string,
  params: RouteParams,
  config: NavigationConfig,
  options?: {
    view?: string;
    query?: Record<string, string>;
    hash?: string;
  }
): string {
  const routeConfig = config.routes[routeId];
  if (!routeConfig) {
    console.warn(`[Navigation] Unknown route: ${routeId}`);
    return '/';
  }
  
  // Replace params in pattern
  let path = routeConfig.path;
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      path = path.replace(`:${key}`, value);
    }
  }
  
  // Build query string
  const queryParts: string[] = [];
  
  if (options?.view && options.view !== routeConfig.defaultView) {
    const viewParam = config.deepLinking.queryParams.view;
    queryParts.push(`${viewParam}=${encodeURIComponent(options.view)}`);
  }
  
  if (options?.query) {
    for (const [key, value] of Object.entries(options.query)) {
      queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  
  if (queryParts.length > 0) {
    path += '?' + queryParts.join('&');
  }
  
  if (options?.hash) {
    path += options.hash.startsWith('#') ? options.hash : `#${options.hash}`;
  }
  
  return path;
}

// ─────────────────────────────────────────────────────
// TRANSITION RESOLUTION
// ─────────────────────────────────────────────────────

/**
 * Find the appropriate transition config for a route change.
 */
export function findTransition(
  fromRoute: ParsedRoute | null,
  toRoute: ParsedRoute,
  config: NavigationConfig,
  isModal: boolean = false
): TransitionConfig | null {
  const from = fromRoute?.routeId || 'universe';
  const to = toRoute.routeId;
  
  // Modal transitions
  if (isModal) {
    return config.transitions['open-modal'] || null;
  }
  
  // Try exact match first
  const exactKey = `${from}-to-${to}`;
  if (config.transitions[exactKey]) {
    return config.transitions[exactKey];
  }
  
  // Try type-based match
  const fromType = fromRoute?.config.type || 'root';
  const toType = toRoute.config.type;
  const typeKey = `${fromType}-to-${toType}`;
  
  // Map to available transitions
  const typeMapping: Record<string, string> = {
    'root-to-container': 'universe-to-sphere',
    'container-to-root': 'sphere-to-universe',
    'container-to-container': 'sphere-to-sphere',
    'container-to-detail': 'sphere-to-branch',
  };
  
  const mappedKey = typeMapping[typeKey];
  if (mappedKey && config.transitions[mappedKey]) {
    return config.transitions[mappedKey];
  }
  
  // Default fallback
  return config.transitions['sphere-to-sphere'] || null;
}

/**
 * Convert transition effect to CSS properties.
 */
function effectToCSS(
  effect: TransitionEffect,
  phase: 'initial' | 'final'
): React.CSSProperties {
  const styles: React.CSSProperties = {};
  const transforms: string[] = [];
  
  if (effect.scale) {
    const value = phase === 'initial' ? effect.scale.from : effect.scale.to;
    transforms.push(`scale(${value})`);
  }
  
  if (effect.translateX) {
    const value = phase === 'initial' ? effect.translateX.from : effect.translateX.to;
    const unit = effect.translateX.unit || 'px';
    transforms.push(`translateX(${value}${unit})`);
  }
  
  if (effect.translateY) {
    const value = phase === 'initial' ? effect.translateY.from : effect.translateY.to;
    const unit = effect.translateY.unit || 'px';
    transforms.push(`translateY(${value}${unit})`);
  }
  
  if (effect.rotate) {
    const value = phase === 'initial' ? effect.rotate.from : effect.rotate.to;
    transforms.push(`rotate(${value}deg)`);
  }
  
  if (transforms.length > 0) {
    styles.transform = transforms.join(' ');
  }
  
  if (effect.opacity) {
    styles.opacity = phase === 'initial' ? effect.opacity.from : effect.opacity.to;
  }
  
  if (effect.blur) {
    const value = phase === 'initial' ? effect.blur.from : effect.blur.to;
    styles.filter = `blur(${value}px)`;
  }
  
  if (effect.background) {
    styles.background = effect.background;
  }
  
  return styles;
}

/**
 * Resolve transition config into usable CSS styles.
 */
export function resolveTransition(
  transitionConfig: TransitionConfig
): ResolvedTransition {
  const result: ResolvedTransition = {
    config: transitionConfig,
    outgoingStyles: {
      initial: {},
      final: {},
    },
    incomingStyles: {
      initial: {},
      final: {},
    },
    duration: transitionConfig.duration,
    easing: transitionConfig.easing,
  };
  
  if (transitionConfig.effects.outgoing) {
    result.outgoingStyles.initial = effectToCSS(transitionConfig.effects.outgoing, 'initial');
    result.outgoingStyles.final = effectToCSS(transitionConfig.effects.outgoing, 'final');
  }
  
  if (transitionConfig.effects.incoming) {
    result.incomingStyles.initial = effectToCSS(transitionConfig.effects.incoming, 'initial');
    result.incomingStyles.final = effectToCSS(transitionConfig.effects.incoming, 'final');
  }
  
  if (transitionConfig.effects.overlay) {
    result.overlayStyles = {
      initial: effectToCSS(transitionConfig.effects.overlay, 'initial'),
      final: effectToCSS(transitionConfig.effects.overlay, 'final'),
    };
  }
  
  return result;
}

// ─────────────────────────────────────────────────────
// BREADCRUMB BUILDING
// ─────────────────────────────────────────────────────

/**
 * Interpolate template string with context data.
 */
function interpolateTemplate(
  template: string,
  params: RouteParams,
  contextData: NavigationContextData
): string {
  return template.replace(/\{(\w+)\.(\w+)\}/g, (match, type, prop) => {
    const id = params[`${type}Id`];
    if (!id) return match;
    
    const data = contextData[`${type}s` as keyof NavigationContextData];
    if (!data) return match;
    
    const item = data[id];
    if (!item) return id; // Fallback to ID
    
    return (item as Record<string, string>)[prop] || id;
  });
}

/**
 * Build breadcrumb trail for current route.
 */
export function buildBreadcrumbs(
  currentRoute: ParsedRoute,
  config: NavigationConfig,
  contextData: NavigationContextData
): BreadcrumbItem[] {
  if (!config.breadcrumbs.enabled) {
    return [];
  }
  
  const items: BreadcrumbItem[] = [];
  const maxDepth = config.breadcrumbs.maxDepth;
  
  // Always start with home
  items.push({
    routeId: 'universe',
    label: config.breadcrumbs.homeIcon,
    path: '/',
    isActive: currentRoute.routeId === 'universe',
  });
  
  // Build path up the hierarchy
  let route: ParsedRoute | null = currentRoute;
  const trail: BreadcrumbItem[] = [];
  
  while (route && route.routeId !== 'universe' && trail.length < maxDepth - 1) {
    const template = config.breadcrumbs.templates[route.routeId] || route.config.title;
    let label = interpolateTemplate(template, route.params, contextData);
    
    // Truncate if needed
    if (label.length > config.breadcrumbs.truncateAt) {
      label = label.slice(0, config.breadcrumbs.truncateAt - 3) + '...';
    }
    
    trail.unshift({
      routeId: route.routeId,
      label,
      path: buildPath(route.routeId, route.params, config),
      isActive: route === currentRoute,
    });
    
    // Get parent
    const parentId = route.config.parent;
    if (parentId && parentId !== 'dynamic' && config.routes[parentId]) {
      // Build parent route (keeping relevant params)
      route = {
        routeId: parentId,
        config: config.routes[parentId],
        params: route.params,
        view: config.routes[parentId].defaultView,
        query: {},
        hash: '',
      };
    } else {
      route = null;
    }
  }
  
  items.push(...trail);
  
  return items;
}

// ─────────────────────────────────────────────────────
// GUARD CHECKING
// ─────────────────────────────────────────────────────

/**
 * Permission level hierarchy for comparison.
 */
const PERMISSION_LEVELS: Record<PermissionLevel, number> = {
  none: 0,
  glimpse: 1,
  view: 2,
  read: 3,
  write: 4,
  admin: 5,
};

/**
 * Check if user has required permission.
 */
export function checkPermission(
  userPermission: PermissionLevel,
  requiredPermission: PermissionLevel
): boolean {
  return PERMISSION_LEVELS[userPermission] >= PERMISSION_LEVELS[requiredPermission];
}

/**
 * Check route guard and return result.
 */
export function checkGuard(
  route: ParsedRoute,
  userPermission: PermissionLevel,
  config: NavigationConfig
): GuardResult {
  const guardConfig = config.guards[route.routeId];
  
  // No guard = allowed
  if (!guardConfig) {
    return { allowed: true };
  }
  
  const allowed = checkPermission(userPermission, guardConfig.requirePermission);
  
  if (allowed) {
    return { allowed: true };
  }
  
  // Determine redirect
  let redirectTo = guardConfig.redirectOnFail;
  if (redirectTo === 'parent' && route.config.parent) {
    const parentConfig = config.routes[route.config.parent];
    if (parentConfig) {
      redirectTo = buildPath(route.config.parent, route.params, config);
    } else {
      redirectTo = '/';
    }
  }
  
  return {
    allowed: false,
    redirectTo,
    message: guardConfig.showMessage 
      ? `Permission "${guardConfig.requirePermission}" required to access this page.`
      : undefined,
  };
}

// ─────────────────────────────────────────────────────
// KEYBOARD SHORTCUT RESOLUTION
// ─────────────────────────────────────────────────────

/**
 * Normalize keyboard event to shortcut string.
 */
export function normalizeKeyboardEvent(event: KeyboardEvent): string {
  const parts: string[] = [];
  
  if (event.ctrlKey || event.metaKey) parts.push('ctrl');
  if (event.altKey) parts.push('alt');
  if (event.shiftKey) parts.push('shift');
  
  const key = event.key.toLowerCase();
  if (!['control', 'alt', 'shift', 'meta'].includes(key)) {
    parts.push(key);
  }
  
  return parts.join('+');
}

/**
 * Resolve keyboard shortcut to navigation action.
 */
export function resolveKeyboardAction(
  shortcut: string,
  config: NavigationConfig
): string | null {
  return config.keyboard.shortcuts[shortcut] || null;
}

// ─────────────────────────────────────────────────────
// HISTORY MANAGEMENT (Pure)
// ─────────────────────────────────────────────────────

/**
 * Add entry to history, maintaining max size.
 */
export function addToHistory<T>(
  history: T[],
  entry: T,
  maxEntries: number
): T[] {
  const newHistory = [...history, entry];
  
  if (newHistory.length > maxEntries) {
    return newHistory.slice(-maxEntries);
  }
  
  return newHistory;
}

/**
 * Check if can go back in history.
 */
export function canGoBack(historyIndex: number): boolean {
  return historyIndex > 0;
}

/**
 * Check if can go forward in history.
 */
export function canGoForward(historyIndex: number, historyLength: number): boolean {
  return historyIndex < historyLength - 1;
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default {
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
};
