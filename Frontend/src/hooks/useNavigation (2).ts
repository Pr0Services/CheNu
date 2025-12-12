// =============================================================================
// CHE·NU — useNavigation Hook
// Foundation Freeze V1
// =============================================================================
// Gère toute la navigation dans CHE·NU
// - Routing
// - Breadcrumbs
// - History
// - Return to trunk (always available)
// =============================================================================

import { useState, useCallback, useMemo } from 'react';
import {
  NavigationState,
  BreadcrumbItem,
  MenuNode,
  SphereId
} from '../types';
import {
  MENU_NODE_MAP,
  getNodePath
} from '../config';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface UseNavigationProps {
  initialPath?: string;
  onNavigate?: (path: string) => void;
}

export interface NavigationActions {
  // Navigation
  navigateTo: (path: string) => void;
  navigateToSphere: (sphereId: SphereId) => void;
  navigateToCategory: (sphereId: SphereId, categoryId: string) => void;
  navigateToTrunk: () => void;
  
  // History
  goBack: () => void;
  goForward: () => void;
  
  // State
  setCurrentPath: (path: string) => void;
}

// -----------------------------------------------------------------------------
// UTILITY FUNCTIONS
// -----------------------------------------------------------------------------

/**
 * Extraire le SphereId d'un path
 */
function extractSphereIdFromPath(path: string): SphereId | null {
  const match = path.match(/^\/sphere\/([a-z-]+)/);
  if (match) {
    return match[1] as SphereId;
  }
  return null;
}

/**
 * Extraire le CategoryId d'un path
 */
function extractCategoryIdFromPath(path: string): string | null {
  const match = path.match(/^\/sphere\/[a-z-]+\/([a-z-]+)/);
  if (match) {
    return match[1];
  }
  return null;
}

/**
 * Trouver le MenuNode correspondant à un path
 */
function findNodeByPath(path: string): MenuNode | null {
  for (const node of Object.values(MENU_NODE_MAP)) {
    if (node.path === path) {
      return node;
    }
  }
  return null;
}

/**
 * Construire les breadcrumbs depuis un path
 */
function buildBreadcrumbs(path: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Always start with trunk/home
  breadcrumbs.push({
    id: 'dashboard',
    label: 'Home',
    emoji: '🏠',
    path: '/',
    type: 'trunk'
  });
  
  // If we're at home, just return that
  if (path === '/' || path === '') {
    return breadcrumbs;
  }
  
  // Find the node for current path
  const currentNode = findNodeByPath(path);
  
  if (currentNode) {
    // Get full path to this node
    const nodePath = getNodePath(currentNode.id, MENU_NODE_MAP);
    
    // Add each node in path (skip first if it's dashboard)
    nodePath.forEach((node) => {
      if (node.id !== 'dashboard') {
        breadcrumbs.push({
          id: node.id,
          label: node.label,
          emoji: node.emoji,
          path: node.path || '/',
          type: node.type
        });
      }
    });
  } else {
    // Manual breadcrumb construction for non-menu paths
    const sphereId = extractSphereIdFromPath(path);
    const categoryId = extractCategoryIdFromPath(path);
    
    if (sphereId) {
      // Add spheres index
      breadcrumbs.push({
        id: 'spheres-index',
        label: 'Spheres',
        emoji: '🔮',
        path: '/spheres',
        type: 'trunk'
      });
      
      // Add sphere
      const sphereNode = MENU_NODE_MAP[`sphere-${sphereId}`];
      if (sphereNode) {
        breadcrumbs.push({
          id: sphereNode.id,
          label: sphereNode.label,
          emoji: sphereNode.emoji,
          path: sphereNode.path || `/sphere/${sphereId}`,
          type: 'sphere'
        });
      }
      
      // Add category if present
      if (categoryId) {
        const categoryNode = MENU_NODE_MAP[`sphere-${sphereId}-${categoryId}`];
        if (categoryNode) {
          breadcrumbs.push({
            id: categoryNode.id,
            label: categoryNode.label,
            emoji: categoryNode.emoji,
            path: categoryNode.path || `/sphere/${sphereId}/${categoryId}`,
            type: 'category'
          });
        }
      }
    }
  }
  
  return breadcrumbs;
}

// -----------------------------------------------------------------------------
// MAIN HOOK
// -----------------------------------------------------------------------------

export function useNavigation(
  props: UseNavigationProps = {}
): [NavigationState, NavigationActions] {
  const { initialPath = '/', onNavigate } = props;

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [currentPath, setCurrentPathInternal] = useState<string>(initialPath);
  const [history, setHistory] = useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // ---------------------------------------------------------------------------
  // COMPUTED
  // ---------------------------------------------------------------------------

  const currentSphereId = useMemo(() => {
    return extractSphereIdFromPath(currentPath);
  }, [currentPath]);

  const currentCategoryId = useMemo(() => {
    return extractCategoryIdFromPath(currentPath);
  }, [currentPath]);

  const breadcrumbs = useMemo(() => {
    return buildBreadcrumbs(currentPath);
  }, [currentPath]);

  const canGoBack = useMemo(() => {
    return historyIndex > 0;
  }, [historyIndex]);

  const canGoForward = useMemo(() => {
    return historyIndex < history.length - 1;
  }, [historyIndex, history.length]);

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  const navigateTo = useCallback((path: string) => {
    // Update history (trim forward history if we navigated back then forward)
    const newHistory = [...history.slice(0, historyIndex + 1), path];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Update current path
    setCurrentPathInternal(path);
    
    // Callback
    if (onNavigate) {
      onNavigate(path);
    }
  }, [history, historyIndex, onNavigate]);

  const navigateToSphere = useCallback((sphereId: SphereId) => {
    navigateTo(`/sphere/${sphereId}`);
  }, [navigateTo]);

  const navigateToCategory = useCallback((sphereId: SphereId, categoryId: string) => {
    navigateTo(`/sphere/${sphereId}/${categoryId}`);
  }, [navigateTo]);

  const navigateToTrunk = useCallback(() => {
    navigateTo('/');
  }, [navigateTo]);

  const goBack = useCallback(() => {
    if (canGoBack) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPathInternal(history[newIndex]);
      
      if (onNavigate) {
        onNavigate(history[newIndex]);
      }
    }
  }, [canGoBack, historyIndex, history, onNavigate]);

  const goForward = useCallback(() => {
    if (canGoForward) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPathInternal(history[newIndex]);
      
      if (onNavigate) {
        onNavigate(history[newIndex]);
      }
    }
  }, [canGoForward, historyIndex, history, onNavigate]);

  const setCurrentPath = useCallback((path: string) => {
    setCurrentPathInternal(path);
  }, []);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  const state: NavigationState = {
    currentPath,
    currentSphereId,
    currentCategoryId,
    breadcrumbs,
    history,
    canGoBack
  };

  const actions: NavigationActions = {
    navigateTo,
    navigateToSphere,
    navigateToCategory,
    navigateToTrunk,
    goBack,
    goForward,
    setCurrentPath
  };

  return [state, actions];
}

// -----------------------------------------------------------------------------
// EXPORT
// -----------------------------------------------------------------------------

export default useNavigation;
