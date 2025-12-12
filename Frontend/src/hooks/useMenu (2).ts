// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — MENU HOOK
// Foundation Freeze V1
// 
// Data-driven menu state management
// ═══════════════════════════════════════════════════════════════════════════════

import { useReducer, useMemo, useCallback } from "react";
import type { MenuNode, ViewMode, SphereId } from "../types";
import {
  ALL_MENU_NODES,
  buildMenuTree,
  filterByViewMode,
  filterByDataWeight,
  getBreadcrumb,
  findNodeById,
  getSphereMenuNodes,
  getSphereFromRoute,
  menuReducer,
  initialMenuState,
  type MenuState,
  type MenuAction
} from "../config/menu.config";

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface UseMenuProps {
  initialMode?: ViewMode;
  dataWeights?: Record<string, number>;
}

export interface MenuHookState extends MenuState {
  // Computed tree
  menuTree: MenuNode[];
  
  // Filtered nodes
  visibleNodes: MenuNode[];
  
  // Current context
  currentBreadcrumb: MenuNode[];
  currentSphere: SphereId | null;
  
  // Sphere-specific menu
  currentSphereMenu: MenuNode[];
}

export interface MenuHookActions {
  // Navigation
  navigate: (nodeId: string) => void;
  navigateToRoute: (route: string) => void;
  goBack: () => void;
  goToRoot: () => void;
  
  // Expansion
  toggleNode: (nodeId: string) => void;
  expandNode: (nodeId: string) => void;
  collapseNode: (nodeId: string) => void;
  expandToNode: (nodeId: string) => void;
  
  // Search
  setSearch: (query: string) => void;
  clearSearch: () => void;
  
  // Mode
  setViewMode: (mode: ViewMode) => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────────────────────────────────

export function useMenu(props: UseMenuProps = {}): [MenuHookState, MenuHookActions] {
  const {
    initialMode = "3d",
    dataWeights = {}
  } = props;

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────────

  const [state, dispatch] = useReducer(menuReducer, {
    ...initialMenuState,
    viewMode: initialMode
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPUTED: Filtered and structured menu
  // ─────────────────────────────────────────────────────────────────────────────

  const visibleNodes = useMemo(() => {
    let nodes = filterByViewMode(ALL_MENU_NODES, state.viewMode);
    nodes = filterByDataWeight(nodes, dataWeights);
    
    // Apply search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      nodes = nodes.filter(node => 
        node.label.toLowerCase().includes(query) ||
        node.labelFr.toLowerCase().includes(query) ||
        node.emoji.includes(query)
      );
    }
    
    return nodes;
  }, [state.viewMode, state.searchQuery, dataWeights]);

  const menuTree = useMemo(() => {
    return buildMenuTree(visibleNodes);
  }, [visibleNodes]);

  const currentBreadcrumb = useMemo(() => {
    if (!state.activeNodeId) return [];
    return getBreadcrumb(ALL_MENU_NODES, state.activeNodeId);
  }, [state.activeNodeId]);

  const currentSphere = useMemo((): SphereId | null => {
    const activeNode = findNodeById(ALL_MENU_NODES, state.activeNodeId ?? "");
    if (!activeNode) return null;
    
    // Check if it's a sphere node
    if (activeNode.type === "sphere") {
      return activeNode.id.replace("sphere-", "") as SphereId;
    }
    
    // Check if it's inside a sphere
    const route = activeNode.route ?? "";
    return getSphereFromRoute(route);
  }, [state.activeNodeId]);

  const currentSphereMenu = useMemo(() => {
    if (!currentSphere) return [];
    return getSphereMenuNodes(currentSphere).filter(node =>
      visibleNodes.some(v => v.id === node.id)
    );
  }, [currentSphere, visibleNodes]);

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  const navigate = useCallback((nodeId: string) => {
    dispatch({ type: "SET_ACTIVE", nodeId });
    dispatch({ type: "EXPAND_TO_NODE", nodeId });
  }, []);

  const navigateToRoute = useCallback((route: string) => {
    const node = ALL_MENU_NODES.find(n => n.route === route);
    if (node) {
      navigate(node.id);
    }
  }, [navigate]);

  const goBack = useCallback(() => {
    if (currentBreadcrumb.length > 1) {
      const parentNode = currentBreadcrumb[currentBreadcrumb.length - 2];
      dispatch({ type: "SET_ACTIVE", nodeId: parentNode.id });
    }
  }, [currentBreadcrumb]);

  const goToRoot = useCallback(() => {
    dispatch({ type: "SET_ACTIVE", nodeId: "root" });
    dispatch({ type: "COLLAPSE_NODE", nodeId: "spheres-index" });
  }, []);

  const toggleNode = useCallback((nodeId: string) => {
    dispatch({ type: "TOGGLE_NODE", nodeId });
  }, []);

  const expandNode = useCallback((nodeId: string) => {
    dispatch({ type: "EXPAND_NODE", nodeId });
  }, []);

  const collapseNode = useCallback((nodeId: string) => {
    dispatch({ type: "COLLAPSE_NODE", nodeId });
  }, []);

  const expandToNode = useCallback((nodeId: string) => {
    dispatch({ type: "EXPAND_TO_NODE", nodeId });
  }, []);

  const setSearch = useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH", query });
  }, []);

  const clearSearch = useCallback(() => {
    dispatch({ type: "SET_SEARCH", query: "" });
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    dispatch({ type: "SET_VIEW_MODE", mode });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────────────────────────────────────

  const hookState: MenuHookState = {
    ...state,
    menuTree,
    visibleNodes,
    currentBreadcrumb,
    currentSphere,
    currentSphereMenu
  };

  const actions: MenuHookActions = {
    navigate,
    navigateToRoute,
    goBack,
    goToRoot,
    toggleNode,
    expandNode,
    collapseNode,
    expandToNode,
    setSearch,
    clearSearch,
    setViewMode
  };

  return [hookState, actions];
}

export default useMenu;
