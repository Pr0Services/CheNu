/* =====================================================
   CHE·NU — useRadialMenu Hook
   
   React hook for managing radial menu state.
   ===================================================== */

import { useState, useCallback, useReducer, useEffect } from 'react';

import {
  RadialMenuItem,
  RadialMenuConfig,
  RadialMenuState,
  RadialMenuEvent,
  DEFAULT_RADIAL_CONFIG,
  DEFAULT_RADIAL_STATE,
  findItemAtAngle,
  positionToAngleDistance,
} from './radialMenu.types';

// ─────────────────────────────────────────────────────
// HOOK OPTIONS
// ─────────────────────────────────────────────────────

export interface UseRadialMenuOptions {
  items?: RadialMenuItem[];
  config?: Partial<RadialMenuConfig>;
  onSelect?: (item: RadialMenuItem, index: number) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

// ─────────────────────────────────────────────────────
// HOOK RETURN
// ─────────────────────────────────────────────────────

export interface UseRadialMenuReturn {
  state: RadialMenuState;
  config: RadialMenuConfig;
  
  // Controls
  open: (position?: [number, number, number], items?: RadialMenuItem[]) => void;
  close: () => void;
  toggle: () => void;
  
  // Navigation
  hover: (index: number | null) => void;
  select: (index: number) => void;
  enterSubmenu: (itemId: string) => void;
  exitSubmenu: () => void;
  
  // Input
  updateInput: (angle: number, distance: number) => void;
  updateFromPosition: (position: [number, number, number]) => void;
  
  // Items
  setItems: (items: RadialMenuItem[]) => void;
  updateItem: (id: string, updates: Partial<RadialMenuItem>) => void;
  
  // Config
  setConfig: (config: Partial<RadialMenuConfig>) => void;
  
  // Computed
  isOpen: boolean;
  hoveredItem: RadialMenuItem | null;
  selectedItem: RadialMenuItem | null;
  canGoBack: boolean;
}

// ─────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────

function radialMenuReducer(
  state: RadialMenuState,
  event: RadialMenuEvent
): RadialMenuState {
  switch (event.type) {
    case 'OPEN':
      return {
        ...state,
        isOpen: true,
        position: event.position || state.position,
        items: event.items || state.items,
        hoveredIndex: null,
        selectedIndex: null,
        menuStack: [],
      };

    case 'CLOSE':
      return {
        ...state,
        isOpen: false,
        hoveredIndex: null,
        selectedIndex: null,
        activeSubmenu: null,
        menuStack: [],
      };

    case 'TOGGLE':
      return state.isOpen
        ? radialMenuReducer(state, { type: 'CLOSE' })
        : radialMenuReducer(state, { type: 'OPEN' });

    case 'HOVER':
      return {
        ...state,
        hoveredIndex: event.index,
      };

    case 'SELECT':
      return {
        ...state,
        selectedIndex: event.index,
      };

    case 'ENTER_SUBMENU': {
      const item = state.items.find(i => i.id === event.itemId);
      if (!item?.children) return state;

      return {
        ...state,
        menuStack: [...state.menuStack, { items: state.items }],
        items: item.children,
        activeSubmenu: event.itemId,
        hoveredIndex: null,
      };
    }

    case 'EXIT_SUBMENU': {
      if (state.menuStack.length === 0) return state;

      const lastMenu = state.menuStack[state.menuStack.length - 1];
      return {
        ...state,
        menuStack: state.menuStack.slice(0, -1),
        items: lastMenu.items,
        activeSubmenu: null,
        hoveredIndex: null,
      };
    }

    case 'UPDATE_INPUT':
      return {
        ...state,
        inputAngle: event.angle,
        inputDistance: event.distance,
      };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────

export function useRadialMenu(
  options: UseRadialMenuOptions = {}
): UseRadialMenuReturn {
  const {
    items: initialItems = [],
    config: configOverride,
    onSelect,
    onOpen,
    onClose,
  } = options;

  // Config
  const [config, setConfigState] = useState<RadialMenuConfig>({
    ...DEFAULT_RADIAL_CONFIG,
    ...configOverride,
  });

  // State
  const [state, dispatch] = useReducer(radialMenuReducer, {
    ...DEFAULT_RADIAL_STATE,
    items: initialItems,
  });

  // Open
  const open = useCallback((
    position?: [number, number, number],
    items?: RadialMenuItem[]
  ) => {
    dispatch({ type: 'OPEN', position, items });
    onOpen?.();
  }, [onOpen]);

  // Close
  const close = useCallback(() => {
    dispatch({ type: 'CLOSE' });
    onClose?.();
  }, [onClose]);

  // Toggle
  const toggle = useCallback(() => {
    if (state.isOpen) {
      close();
    } else {
      open();
    }
  }, [state.isOpen, open, close]);

  // Hover
  const hover = useCallback((index: number | null) => {
    dispatch({ type: 'HOVER', index });

    // Haptic feedback
    if (index !== null && config.hapticOnHover && navigator.vibrate) {
      navigator.vibrate(Math.round(config.hapticIntensity * 30));
    }
  }, [config]);

  // Select
  const select = useCallback((index: number) => {
    const item = state.items[index];
    if (!item || item.disabled) return;

    dispatch({ type: 'SELECT', index });

    // Haptic feedback
    if (config.hapticOnSelect && navigator.vibrate) {
      navigator.vibrate(Math.round(config.hapticIntensity * 50));
    }

    // Handle submenu
    if (item.children && item.children.length > 0) {
      dispatch({ type: 'ENTER_SUBMENU', itemId: item.id });
      return;
    }

    // Execute action
    item.action?.();
    onSelect?.(item, index);

    // Close if configured
    if (config.closeOnSelect) {
      close();
    }
  }, [state.items, config, onSelect, close]);

  // Submenu navigation
  const enterSubmenu = useCallback((itemId: string) => {
    dispatch({ type: 'ENTER_SUBMENU', itemId });
  }, []);

  const exitSubmenu = useCallback(() => {
    dispatch({ type: 'EXIT_SUBMENU' });
  }, []);

  // Input handling
  const updateInput = useCallback((angle: number, distance: number) => {
    dispatch({ type: 'UPDATE_INPUT', angle, distance });

    // Auto-hover based on angle
    if (distance >= config.innerRadius && distance <= config.outerRadius) {
      const hoveredIndex = findItemAtAngle(angle, state.items.length, config);
      if (hoveredIndex !== state.hoveredIndex) {
        hover(hoveredIndex);
      }
    } else if (distance < config.innerRadius) {
      hover(null);
    }
  }, [config, state.items.length, state.hoveredIndex, hover]);

  const updateFromPosition = useCallback((position: [number, number, number]) => {
    const { angle, distance } = positionToAngleDistance(position, state.position);
    updateInput(angle, distance);
  }, [state.position, updateInput]);

  // Items management
  const setItems = useCallback((items: RadialMenuItem[]) => {
    dispatch({ type: 'OPEN', items });
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<RadialMenuItem>) => {
    const newItems = state.items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    dispatch({ type: 'OPEN', items: newItems });
  }, [state.items]);

  // Config
  const setConfig = useCallback((newConfig: Partial<RadialMenuConfig>) => {
    setConfigState(prev => ({ ...prev, ...newConfig }));
  }, []);

  // Computed
  const hoveredItem = state.hoveredIndex !== null 
    ? state.items[state.hoveredIndex] 
    : null;
  
  const selectedItem = state.selectedIndex !== null 
    ? state.items[state.selectedIndex] 
    : null;

  const canGoBack = state.menuStack.length > 0;

  return {
    state,
    config,
    open,
    close,
    toggle,
    hover,
    select,
    enterSubmenu,
    exitSubmenu,
    updateInput,
    updateFromPosition,
    setItems,
    updateItem,
    setConfig,
    isOpen: state.isOpen,
    hoveredItem,
    selectedItem,
    canGoBack,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default useRadialMenu;
