// =============================================================================
// CHE·NU — useMinimap Hook
// Foundation Freeze V1
// =============================================================================
// Gère la Minimap - composant OBLIGATOIRE visible dans TOUS les modes
// Règles:
// - MiniMap est TOUJOURS visible
// - MiniMap est TOUJOURS lisible
// - MiniMap ne submerge JAMAIS
// =============================================================================

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  MinimapNode,
  MinimapConfig,
  MinimapMode,
  ViewMode,
  SphereId
} from '../types';
import {
  DEFAULT_MINIMAP_CONFIG,
  MOBILE_MINIMAP_CONFIG,
  XR_MINIMAP_CONFIG
} from '../config';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface MinimapState {
  // Configuration
  config: MinimapConfig;
  
  // Nodes à afficher
  nodes: MinimapNode[];
  visibleNodes: MinimapNode[];
  
  // Position actuelle
  currentNodeId: string | null;
  hoveredNodeId: string | null;
  
  // États
  isVisible: boolean;
  isExpanded: boolean;
  isPinned: boolean;
  
  // Dimensions calculées
  dimensions: {
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    maxRadius: number;
  };
}

export interface MinimapActions {
  // Configuration
  setMode: (mode: MinimapMode) => void;
  setPosition: (position: MinimapConfig['position']) => void;
  setSize: (size: MinimapConfig['size']) => void;
  setOpacity: (opacity: number) => void;
  
  // Visibility
  show: () => void;
  hide: () => void;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
  pin: () => void;
  unpin: () => void;
  
  // Interaction
  hoverNode: (nodeId: string | null) => void;
  selectNode: (nodeId: string) => void;
  
  // Node updates
  setNodes: (nodes: MinimapNode[]) => void;
  updateNodeActivity: (nodeId: string, activity: number) => void;
  
  // Presets
  applyDesktopPreset: () => void;
  applyMobilePreset: () => void;
  applyXRPreset: () => void;
}

export interface UseMinimapProps {
  nodes?: MinimapNode[];
  initialConfig?: Partial<MinimapConfig>;
  viewMode?: ViewMode;
  currentSphereId?: SphereId | null;
  onNodeSelect?: (nodeId: string) => void;
}

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

const SIZE_DIMENSIONS = {
  small: { width: 120, height: 120 },
  medium: { width: 180, height: 180 },
  large: { width: 250, height: 250 }
};

// -----------------------------------------------------------------------------
// MAIN HOOK
// -----------------------------------------------------------------------------

export function useMinimap(
  props: UseMinimapProps = {}
): [MinimapState, MinimapActions] {
  const {
    nodes: initialNodes = [],
    initialConfig,
    viewMode = '3d',
    currentSphereId = null,
    onNodeSelect
  } = props;

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [config, setConfig] = useState<MinimapConfig>({
    ...DEFAULT_MINIMAP_CONFIG,
    ...initialConfig
  });

  const [nodes, setNodes] = useState<MinimapNode[]>(initialNodes);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);

  // Auto-hide timer
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------

  // Update nodes when initialNodes change
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
  }, [initialNodes]);

  // Auto-apply preset based on view mode
  useEffect(() => {
    if (viewMode === 'xr') {
      setConfig(prev => ({ ...prev, ...XR_MINIMAP_CONFIG }));
    } else if (viewMode === '2d') {
      // Mobile detection would go here
      // For now, use desktop preset
    }
  }, [viewMode]);

  // Auto-hide logic
  useEffect(() => {
    if (config.autoHide && !isPinned && isVisible) {
      // Clear existing timer
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
      
      // Set new timer
      const timer = setTimeout(() => {
        if (!isPinned && !isExpanded) {
          setIsVisible(false);
        }
      }, config.autoHideDelay);
      
      setHideTimer(timer);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [config.autoHide, config.autoHideDelay, isPinned, isExpanded]);

  // ---------------------------------------------------------------------------
  // COMPUTED
  // ---------------------------------------------------------------------------

  const currentNodeId = useMemo(() => {
    if (currentSphereId) {
      return currentSphereId;
    }
    return 'core';
  }, [currentSphereId]);

  const visibleNodes = useMemo(() => {
    // In ring mode, only show spheres (no agents)
    if (config.mode === 'ring') {
      return nodes.filter(n => n.type === 'core' || n.type === 'sphere');
    }
    
    // In compact mode, show spheres and active agents only
    if (config.mode === 'compact') {
      return nodes.filter(n => 
        n.type === 'core' || 
        n.type === 'sphere' || 
        (n.type === 'agent' && n.activity > 0.5)
      );
    }
    
    // Full mode shows everything
    return nodes;
  }, [nodes, config.mode]);

  const dimensions = useMemo(() => {
    const size = SIZE_DIMENSIONS[config.size];
    const padding = 10;
    
    return {
      width: size.width,
      height: size.height,
      centerX: size.width / 2,
      centerY: size.height / 2,
      maxRadius: (Math.min(size.width, size.height) / 2) - padding
    };
  }, [config.size]);

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  const setMode = useCallback((mode: MinimapMode) => {
    setConfig(prev => ({ ...prev, mode }));
  }, []);

  const setPosition = useCallback((position: MinimapConfig['position']) => {
    setConfig(prev => ({ ...prev, position }));
  }, []);

  const setSize = useCallback((size: MinimapConfig['size']) => {
    setConfig(prev => ({ ...prev, size }));
  }, []);

  const setOpacity = useCallback((opacity: number) => {
    setConfig(prev => ({ ...prev, opacity: Math.max(0, Math.min(1, opacity)) }));
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    if (!isPinned) {
      setIsVisible(false);
    }
  }, [isPinned]);

  const toggle = useCallback(() => {
    if (isPinned) return;
    setIsVisible(prev => !prev);
  }, [isPinned]);

  const expand = useCallback(() => {
    setIsExpanded(true);
    setIsVisible(true);
  }, []);

  const collapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const pin = useCallback(() => {
    setIsPinned(true);
    setIsVisible(true);
  }, []);

  const unpin = useCallback(() => {
    setIsPinned(false);
  }, []);

  const hoverNode = useCallback((nodeId: string | null) => {
    setHoveredNodeId(nodeId);
    // Show minimap on hover if auto-hidden
    if (nodeId && config.autoHide) {
      setIsVisible(true);
    }
  }, [config.autoHide]);

  const selectNode = useCallback((nodeId: string) => {
    if (onNodeSelect) {
      onNodeSelect(nodeId);
    }
  }, [onNodeSelect]);

  const updateNodeActivity = useCallback((nodeId: string, activity: number) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, activity: Math.max(0, Math.min(1, activity)) }
        : node
    ));
  }, []);

  const applyDesktopPreset = useCallback(() => {
    setConfig(DEFAULT_MINIMAP_CONFIG);
  }, []);

  const applyMobilePreset = useCallback(() => {
    setConfig(MOBILE_MINIMAP_CONFIG);
  }, []);

  const applyXRPreset = useCallback(() => {
    setConfig(XR_MINIMAP_CONFIG);
  }, []);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  const state: MinimapState = {
    config,
    nodes,
    visibleNodes,
    currentNodeId,
    hoveredNodeId,
    isVisible,
    isExpanded,
    isPinned,
    dimensions
  };

  const actions: MinimapActions = {
    setMode,
    setPosition,
    setSize,
    setOpacity,
    show,
    hide,
    toggle,
    expand,
    collapse,
    pin,
    unpin,
    hoverNode,
    selectNode,
    setNodes,
    updateNodeActivity,
    applyDesktopPreset,
    applyMobilePreset,
    applyXRPreset
  };

  return [state, actions];
}

// -----------------------------------------------------------------------------
// EXPORT
// -----------------------------------------------------------------------------

export default useMinimap;
