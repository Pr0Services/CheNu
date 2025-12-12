/* =====================================================
   CHE·NU — Navigation Hooks
   
   PHASE 4: REACT INTEGRATION
   ===================================================== */

import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import { NavigationState, NavigationAction, NavigationConfig, NavigationContextValue, TransitionConfig, NavigationPathSegment } from './types';
import { navigationReducer, initialNavigationState, selectBreadcrumbs, selectCanNavigate, resetNavigationHistory } from './navigationReducer';

let cachedConfig: NavigationConfig | null = null;

async function loadNavigationConfig(): Promise<NavigationConfig> {
  if (cachedConfig) return cachedConfig;
  try {
    const config = await import('../../core-reference/navigation.config.json');
    cachedConfig = config.default || config;
    return cachedConfig;
  } catch (error) {
    console.error('[CHE·NU Navigation] Failed to load config:', error);
    throw error;
  }
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export interface NavigationProviderProps {
  children: ReactNode;
  initialPath?: NavigationPathSegment[];
  onNavigate?: (state: NavigationState) => void;
  syncWithUrl?: boolean;
}

export function NavigationProvider({ children, initialPath, onNavigate, syncWithUrl = true }: NavigationProviderProps) {
  const [config, setConfig] = useState<NavigationConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useReducer(navigationReducer, initialNavigationState);
  
  useEffect(() => {
    loadNavigationConfig().then(setConfig).finally(() => setIsLoading(false));
  }, []);
  
  useEffect(() => {
    if (initialPath && initialPath.length > 0) {
      dispatch({ type: 'NAVIGATE_TO', path: initialPath });
    }
  }, [initialPath]);
  
  useEffect(() => { onNavigate?.(state); }, [state, onNavigate]);
  
  useEffect(() => {
    if (!state.isTransitioning || !config) return;
    const transitionConfig = state.transitionType ? config.transitions.byAction[state.transitionType] || config.transitions.default : config.transitions.default;
    const timer = setTimeout(() => { dispatch({ type: 'SET_TRANSITIONING', isTransitioning: false }); }, transitionConfig.duration);
    return () => clearTimeout(timer);
  }, [state.isTransitioning, state.transitionType, config]);
  
  const enterSphere = useCallback((sphereId: string) => { dispatch({ type: 'ENTER_SPHERE', sphereId }); }, []);
  const exitSphere = useCallback(() => { dispatch({ type: 'EXIT_SPHERE' }); }, []);
  const enterBranch = useCallback((branchId: string) => { dispatch({ type: 'ENTER_BRANCH', branchId }); }, []);
  const exitBranch = useCallback(() => { dispatch({ type: 'EXIT_BRANCH' }); }, []);
  const selectLeaf = useCallback((leafId: string) => { dispatch({ type: 'SELECT_LEAF', leafId }); }, []);
  const deselectLeaf = useCallback(() => { dispatch({ type: 'DESELECT_LEAF' }); }, []);
  const openAgentChat = useCallback((agentId: string) => { dispatch({ type: 'OPEN_AGENT_CHAT', agentId }); }, []);
  const closeAgentChat = useCallback(() => { dispatch({ type: 'CLOSE_AGENT_CHAT' }); }, []);
  const goBack = useCallback(() => { dispatch({ type: 'GO_BACK' }); }, []);
  const goForward = useCallback(() => { dispatch({ type: 'GO_FORWARD' }); }, []);
  const goToRoot = useCallback(() => { dispatch({ type: 'GO_TO_ROOT' }); }, []);
  const isAtRoot = useCallback(() => state.currentView === 'universe', [state.currentView]);
  const getCurrentPath = useCallback(() => state.path, [state.path]);
  const getTransitionForAction = useCallback((action: NavigationAction): TransitionConfig => {
    if (!config) return getDefaultTransition();
    return config.transitions.byAction[action.type] || config.transitions.default;
  }, [config]);
  
  const contextValue = useMemo<NavigationContextValue>(() => ({
    state, config: config || getDefaultConfig(), dispatch,
    enterSphere, exitSphere, enterBranch, exitBranch, selectLeaf, deselectLeaf,
    openAgentChat, closeAgentChat, goBack, goForward, goToRoot,
    isAtRoot, getCurrentPath, getTransitionForAction,
  }), [state, config, enterSphere, exitSphere, enterBranch, exitBranch, selectLeaf, deselectLeaf, openAgentChat, closeAgentChat, goBack, goForward, goToRoot, isAtRoot, getCurrentPath, getTransitionForAction]);
  
  if (isLoading) return null;
  
  return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>;
}

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
}

export function useNavigationState(): NavigationState {
  return useNavigation().state;
}

export function useCurrentView() {
  const { state } = useNavigation();
  return { view: state.currentView, depth: state.currentDepth, sphereId: state.activeSphereId, branchId: state.activeBranchId, leafId: state.activeLeafId, agentId: state.activeAgentId };
}

export function useBreadcrumbs() {
  const { state, dispatch } = useNavigation();
  const crumbs = selectBreadcrumbs(state);
  const navigateTo = useCallback((index: number) => {
    dispatch({ type: 'NAVIGATE_TO', path: crumbs.slice(0, index + 1) });
  }, [crumbs, dispatch]);
  return { items: crumbs.map((c, i) => ({ ...c, isActive: i === crumbs.length - 1, onClick: () => navigateTo(i) })), navigateTo };
}

export function useCanNavigate() {
  return selectCanNavigate(useNavigation().state);
}

export function useTransition() {
  const { state, config } = useNavigation();
  const currentTransition = useMemo(() => {
    if (!state.isTransitioning || !state.transitionType) return null;
    return config.transitions.byAction[state.transitionType] || config.transitions.default;
  }, [state.isTransitioning, state.transitionType, config]);
  return { isTransitioning: state.isTransitioning, type: state.transitionType, progress: state.transitionProgress, config: currentTransition };
}

export function useKeyboardNavigation() {
  const { config, dispatch, goBack, goForward, goToRoot } = useNavigation();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const shortcut = config.shortcuts[e.code];
      if (!shortcut) return;
      e.preventDefault();
      if (shortcut === 'GO_BACK') goBack();
      else if (shortcut === 'GO_FORWARD') goForward();
      else if (shortcut === 'GO_TO_ROOT') goToRoot();
      else dispatch({ type: shortcut } as NavigationAction);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config, dispatch, goBack, goForward, goToRoot]);
}

export function useGestureNavigation(elementRef: React.RefObject<HTMLElement>) {
  const { config, dispatch } = useNavigation();
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    let startX = 0, startY = 0;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 50) dispatch({ type: config.gestures.swipeRight } as NavigationAction);
        else if (dx < -50) dispatch({ type: config.gestures.swipeLeft } as NavigationAction);
      } else {
        if (dy > 50) dispatch({ type: config.gestures.swipeDown } as NavigationAction);
        else if (dy < -50) dispatch({ type: config.gestures.swipeUp } as NavigationAction);
      }
    };
    el.addEventListener('touchstart', onStart);
    el.addEventListener('touchend', onEnd);
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchend', onEnd); };
  }, [elementRef, config, dispatch]);
}

function getDefaultTransition(): TransitionConfig {
  return { type: 'fade', duration: 300, easing: 'ease', enter: { from: { opacity: 0 }, to: { opacity: 1 } }, exit: { from: { opacity: 1 }, to: { opacity: 0 } } };
}

function getDefaultConfig(): NavigationConfig {
  return {
    version: '1.0.0',
    transitions: { default: getDefaultTransition(), byAction: {} },
    views: {
      universe: { allowedTransitions: ['sphere'], defaultTransition: 'fade', zoomLevel: 1 },
      sphere: { allowedTransitions: ['universe', 'branch'], defaultTransition: 'fade', zoomLevel: 1 },
      branch: { allowedTransitions: ['sphere', 'leaf'], defaultTransition: 'fade', zoomLevel: 1 },
      leaf: { allowedTransitions: ['branch'], defaultTransition: 'fade', zoomLevel: 1 },
      'agent-chat': { allowedTransitions: ['sphere'], defaultTransition: 'fade', zoomLevel: 1 },
    },
    gestures: { swipeLeft: 'GO_BACK', swipeRight: 'GO_FORWARD', swipeUp: 'EXIT_SPHERE', swipeDown: 'ENTER_SPHERE', pinchIn: 'EXIT_SPHERE', pinchOut: 'ENTER_SPHERE', doubleTap: 'SELECT_LEAF' },
    shortcuts: {},
    breadcrumb: { maxVisible: 4, showIcons: true, separator: '›' },
  };
}

export { resetNavigationHistory };
