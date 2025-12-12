// =============================================================================
// CHE·NU — HOOKS INDEX
// Foundation Freeze V1
// =============================================================================
// Point d'entrée unique pour tous les hooks
// =============================================================================

// Visual Engine Hook (CORE)
export {
  useVisualEngine,
  type VisualEngineState,
  type VisualEngineActions,
  type UseVisualEngineProps
} from './useVisualEngine';

// Navigation Hook
export {
  useNavigation,
  type NavigationActions,
  type UseNavigationProps
} from './useNavigation';

// Menu Engine Hook
export {
  useMenuEngine,
  type MenuEngineState,
  type MenuEngineActions,
  type UseMenuEngineProps
} from './useMenuEngine';

// Minimap Hook
export {
  useMinimap,
  type MinimapState,
  type MinimapActions,
  type UseMinimapProps
} from './useMinimap';

// =============================================================================
// COMBINED HOOKS - For full app state management
// =============================================================================

import { useState, useCallback, useMemo } from 'react';
import { useVisualEngine, VisualEngineState, VisualEngineActions } from './useVisualEngine';
import { useNavigation, NavigationActions } from './useNavigation';
import { useMenuEngine, MenuEngineState, MenuEngineActions } from './useMenuEngine';
import { useMinimap, MinimapState, MinimapActions } from './useMinimap';
import { ViewMode, SphereId } from '../types';

/**
 * État combiné de l'application CHE·NU
 */
export interface ChenuAppState {
  visual: VisualEngineState;
  navigation: {
    currentPath: string;
    currentSphereId: SphereId | null;
    currentCategoryId: string | null;
    breadcrumbs: any[];
    canGoBack: boolean;
  };
  menu: MenuEngineState;
  minimap: MinimapState;
}

/**
 * Actions combinées de l'application CHE·NU
 */
export interface ChenuAppActions {
  visual: VisualEngineActions;
  navigation: NavigationActions;
  menu: MenuEngineActions;
  minimap: MinimapActions;
  
  // Convenience methods
  navigateToSphere: (sphereId: SphereId) => void;
  setViewMode: (mode: ViewMode) => void;
  returnToTrunk: () => void;
}

/**
 * Hook combiné pour l'application CHE·NU complète
 */
export function useChenuApp(): [ChenuAppState, ChenuAppActions] {
  // Individual hooks
  const [visualState, visualActions] = useVisualEngine();
  const [navState, navActions] = useNavigation();
  const [menuState, menuActions] = useMenuEngine({
    initialMode: visualState.mode
  });
  const [minimapState, minimapActions] = useMinimap({
    nodes: visualState.minimapNodes,
    viewMode: visualState.mode,
    currentSphereId: visualState.focusedSphereId
  });

  // Sync view mode across hooks
  const setViewMode = useCallback((mode: ViewMode) => {
    visualActions.setMode(mode);
    menuActions.setViewMode(mode);
  }, [visualActions, menuActions]);

  // Navigate to sphere (syncs visual + navigation)
  const navigateToSphere = useCallback((sphereId: SphereId) => {
    visualActions.focusSphere(sphereId);
    navActions.navigateToSphere(sphereId);
    minimapActions.selectNode(sphereId);
  }, [visualActions, navActions, minimapActions]);

  // Return to trunk
  const returnToTrunk = useCallback(() => {
    visualActions.focusSphere(null);
    navActions.navigateToTrunk();
    minimapActions.selectNode('core');
  }, [visualActions, navActions, minimapActions]);

  // Combined state
  const state: ChenuAppState = {
    visual: visualState,
    navigation: navState,
    menu: menuState,
    minimap: minimapState
  };

  // Combined actions
  const actions: ChenuAppActions = {
    visual: visualActions,
    navigation: navActions,
    menu: menuActions,
    minimap: minimapActions,
    navigateToSphere,
    setViewMode,
    returnToTrunk
  };

  return [state, actions];
}

// Default export
export default useChenuApp;
