// =============================================================================
// CHE·NU — useMenuEngine Hook
// Foundation Freeze V1
// =============================================================================
// Gère le Menu Engine - toute navigation générée depuis configuration JSON
// AUCUNE navigation hardcodée permise
// =============================================================================

import { useState, useCallback, useMemo } from 'react';
import {
  MenuNode,
  ViewMode,
  SphereId
} from '../types';
import {
  DEFAULT_MENU_CONFIG,
  MENU_NODE_MAP,
  filterNodesByViewMode,
  filterNodesByDataWeight,
  sortNodesByPriority,
  getChildNodes
} from '../config';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface MenuEngineState {
  // Nodes visibles
  visibleNodes: MenuNode[];
  rootNodes: MenuNode[];
  
  // Node actuellement étendu/sélectionné
  expandedNodeIds: Set<string>;
  selectedNodeId: string | null;
  
  // Filtres actifs
  currentMode: ViewMode;
  minDataWeight: number;
  
  // Recherche
  searchQuery: string;
  searchResults: MenuNode[];
  
  // Stats
  totalNodes: number;
  visibleCount: number;
}

export interface MenuEngineActions {
  // Expansion
  expandNode: (nodeId: string) => void;
  collapseNode: (nodeId: string) => void;
  toggleNode: (nodeId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  
  // Selection
  selectNode: (nodeId: string | null) => void;
  
  // Filtres
  setViewMode: (mode: ViewMode) => void;
  setMinDataWeight: (weight: number) => void;
  
  // Recherche
  search: (query: string) => void;
  clearSearch: () => void;
  
  // Utilities
  getNode: (nodeId: string) => MenuNode | undefined;
  getChildren: (nodeId: string) => MenuNode[];
  isExpanded: (nodeId: string) => boolean;
  isSelected: (nodeId: string) => boolean;
  isVisible: (nodeId: string) => boolean;
}

export interface UseMenuEngineProps {
  initialMode?: ViewMode;
  initialExpandedIds?: string[];
  initialSelectedId?: string | null;
  minDataWeight?: number;
}

// -----------------------------------------------------------------------------
// UTILITY FUNCTIONS
// -----------------------------------------------------------------------------

/**
 * Rechercher dans les nodes
 */
function searchNodes(nodes: MenuNode[], query: string): MenuNode[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return nodes.filter(node => {
    const labelMatch = node.label.toLowerCase().includes(lowerQuery);
    const labelFrMatch = node.labelFr.toLowerCase().includes(lowerQuery);
    const emojiMatch = node.emoji.includes(query);
    
    return labelMatch || labelFrMatch || emojiMatch;
  });
}

/**
 * Obtenir tous les IDs de nodes expansibles
 */
function getAllExpandableIds(nodes: MenuNode[]): string[] {
  return nodes
    .filter(node => node.children && node.children.length > 0)
    .map(node => node.id);
}

// -----------------------------------------------------------------------------
// MAIN HOOK
// -----------------------------------------------------------------------------

export function useMenuEngine(
  props: UseMenuEngineProps = {}
): [MenuEngineState, MenuEngineActions] {
  const {
    initialMode = '3d',
    initialExpandedIds = [],
    initialSelectedId = null,
    minDataWeight: initialMinWeight = 0
  } = props;

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [currentMode, setCurrentMode] = useState<ViewMode>(initialMode);
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    new Set(initialExpandedIds)
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialSelectedId);
  const [minDataWeight, setMinDataWeight] = useState<number>(initialMinWeight);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ---------------------------------------------------------------------------
  // COMPUTED: VISIBLE NODES
  // ---------------------------------------------------------------------------

  const visibleNodes = useMemo(() => {
    let nodes = DEFAULT_MENU_CONFIG.nodes;
    
    // Filter by view mode
    nodes = filterNodesByViewMode(nodes, currentMode);
    
    // Filter by data weight
    if (minDataWeight > 0) {
      nodes = filterNodesByDataWeight(nodes, minDataWeight);
    }
    
    // Sort by priority
    nodes = sortNodesByPriority(nodes);
    
    return nodes;
  }, [currentMode, minDataWeight]);

  const rootNodes = useMemo(() => {
    return visibleNodes.filter(node => !node.parentId);
  }, [visibleNodes]);

  const searchResults = useMemo(() => {
    return searchNodes(visibleNodes, searchQuery);
  }, [visibleNodes, searchQuery]);

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  const expandNode = useCallback((nodeId: string) => {
    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      next.add(nodeId);
      return next;
    });
  }, []);

  const collapseNode = useCallback((nodeId: string) => {
    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      next.delete(nodeId);
      return next;
    });
  }, []);

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const allExpandable = getAllExpandableIds(visibleNodes);
    setExpandedNodeIds(new Set(allExpandable));
  }, [visibleNodes]);

  const collapseAll = useCallback(() => {
    setExpandedNodeIds(new Set());
  }, []);

  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setCurrentMode(mode);
  }, []);

  const search = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const getNode = useCallback((nodeId: string): MenuNode | undefined => {
    return MENU_NODE_MAP[nodeId];
  }, []);

  const getChildren = useCallback((nodeId: string): MenuNode[] => {
    return getChildNodes(nodeId, MENU_NODE_MAP);
  }, []);

  const isExpanded = useCallback((nodeId: string): boolean => {
    return expandedNodeIds.has(nodeId);
  }, [expandedNodeIds]);

  const isSelected = useCallback((nodeId: string): boolean => {
    return selectedNodeId === nodeId;
  }, [selectedNodeId]);

  const isVisible = useCallback((nodeId: string): boolean => {
    return visibleNodes.some(n => n.id === nodeId);
  }, [visibleNodes]);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  const state: MenuEngineState = {
    visibleNodes,
    rootNodes,
    expandedNodeIds,
    selectedNodeId,
    currentMode,
    minDataWeight,
    searchQuery,
    searchResults,
    totalNodes: DEFAULT_MENU_CONFIG.nodes.length,
    visibleCount: visibleNodes.length
  };

  const actions: MenuEngineActions = {
    expandNode,
    collapseNode,
    toggleNode,
    expandAll,
    collapseAll,
    selectNode,
    setViewMode,
    setMinDataWeight,
    search,
    clearSearch,
    getNode,
    getChildren,
    isExpanded,
    isSelected,
    isVisible
  };

  return [state, actions];
}

// -----------------------------------------------------------------------------
// EXPORT
// -----------------------------------------------------------------------------

export default useMenuEngine;
