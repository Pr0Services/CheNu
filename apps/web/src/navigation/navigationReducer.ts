/* =====================================================
   CHE·NU — Navigation Reducer
   
   PHASE 4: PURE STATE MACHINE
   
   Handles all navigation state transitions.
   PURE FUNCTION - no side effects, deterministic.
   ===================================================== */

import {
  NavigationState,
  NavigationAction,
  NavigationPathSegment,
  ViewType,
  ViewDepth,
} from './types';

// ─────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────

export const initialNavigationState: NavigationState = {
  currentView: 'universe',
  currentDepth: 0,
  path: [
    {
      type: 'universe',
      id: 'root',
      label: 'Universe',
      depth: 0,
    },
  ],
  activeSphereId: null,
  activeBranchId: null,
  activeLeafId: null,
  activeAgentId: null,
  canGoBack: false,
  canGoForward: false,
  historyIndex: 0,
  isTransitioning: false,
  transitionType: null,
  transitionProgress: 0,
};

// ─────────────────────────────────────────────────────
// NAVIGATION HISTORY
// ─────────────────────────────────────────────────────

let navigationHistory: NavigationState[] = [initialNavigationState];
let historyPointer = 0;

// ─────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────

export function navigationReducer(
  state: NavigationState,
  action: NavigationAction
): NavigationState {
  switch (action.type) {
    case 'ENTER_SPHERE': {
      const { sphereId } = action;
      if (state.activeSphereId && state.activeSphereId !== sphereId) {
        return state;
      }
      
      const newPath: NavigationPathSegment[] = [
        ...state.path.slice(0, 1),
        { type: 'sphere', id: sphereId, label: formatLabel(sphereId), depth: 1 },
      ];
      
      const newState: NavigationState = {
        ...state,
        currentView: 'sphere',
        currentDepth: 1,
        path: newPath,
        activeSphereId: sphereId,
        activeBranchId: null,
        activeLeafId: null,
        isTransitioning: true,
        transitionType: 'zoom-in',
        transitionProgress: 0,
      };
      
      pushToHistory(newState);
      return updateHistoryFlags(newState);
    }
    
    case 'EXIT_SPHERE': {
      if (!state.activeSphereId) return state;
      
      const newState: NavigationState = {
        ...state,
        currentView: 'universe',
        currentDepth: 0,
        path: state.path.slice(0, 1),
        activeSphereId: null,
        activeBranchId: null,
        activeLeafId: null,
        activeAgentId: null,
        isTransitioning: true,
        transitionType: 'zoom-out',
        transitionProgress: 0,
      };
      
      pushToHistory(newState);
      return updateHistoryFlags(newState);
    }
    
    case 'ENTER_BRANCH': {
      const { branchId } = action;
      if (!state.activeSphereId) return state;
      
      const newPath: NavigationPathSegment[] = [
        ...state.path.slice(0, 2),
        { type: 'branch', id: branchId, label: formatLabel(branchId), depth: 2 },
      ];
      
      const newState: NavigationState = {
        ...state,
        currentView: 'branch',
        currentDepth: 2,
        path: newPath,
        activeBranchId: branchId,
        activeLeafId: null,
        isTransitioning: true,
        transitionType: 'slide-left',
        transitionProgress: 0,
      };
      
      pushToHistory(newState);
      return updateHistoryFlags(newState);
    }
    
    case 'EXIT_BRANCH': {
      if (!state.activeBranchId) return state;
      
      const newState: NavigationState = {
        ...state,
        currentView: 'sphere',
        currentDepth: 1,
        path: state.path.slice(0, 2),
        activeBranchId: null,
        activeLeafId: null,
        isTransitioning: true,
        transitionType: 'slide-right',
        transitionProgress: 0,
      };
      
      pushToHistory(newState);
      return updateHistoryFlags(newState);
    }
    
    case 'SELECT_LEAF': {
      const { leafId } = action;
      if (!state.activeBranchId) return state;
      
      const newPath: NavigationPathSegment[] = [
        ...state.path.slice(0, 3),
        { type: 'leaf', id: leafId, label: formatLabel(leafId), depth: 3 },
      ];
      
      const newState: NavigationState = {
        ...state,
        currentView: 'leaf',
        currentDepth: 3,
        path: newPath,
        activeLeafId: leafId,
        isTransitioning: true,
        transitionType: 'morph',
        transitionProgress: 0,
      };
      
      pushToHistory(newState);
      return updateHistoryFlags(newState);
    }
    
    case 'DESELECT_LEAF': {
      if (!state.activeLeafId) return state;
      
      const newState: NavigationState = {
        ...state,
        currentView: 'branch',
        currentDepth: 2,
        path: state.path.slice(0, 3),
        activeLeafId: null,
        isTransitioning: true,
        transitionType: 'fade',
        transitionProgress: 0,
      };
      
      pushToHistory(newState);
      return updateHistoryFlags(newState);
    }
    
    case 'OPEN_AGENT_CHAT': {
      const { agentId } = action;
      if (!state.activeSphereId) return state;
      
      const newPath: NavigationPathSegment[] = [
        ...state.path,
        { type: 'agent-chat', id: agentId, label: formatLabel(agentId), depth: state.currentDepth as ViewDepth },
      ];
      
      const newState: NavigationState = {
        ...state,
        currentView: 'agent-chat',
        path: newPath,
        activeAgentId: agentId,
        isTransitioning: true,
        transitionType: 'slide-left',
        transitionProgress: 0,
      };
      
      pushToHistory(newState);
      return updateHistoryFlags(newState);
    }
    
    case 'CLOSE_AGENT_CHAT': {
      if (!state.activeAgentId) return state;
      
      const pathWithoutAgent = state.path.filter(s => s.type !== 'agent-chat');
      const previousView = pathWithoutAgent[pathWithoutAgent.length - 1];
      
      const newState: NavigationState = {
        ...state,
        currentView: previousView?.type || 'universe',
        path: pathWithoutAgent,
        activeAgentId: null,
        isTransitioning: true,
        transitionType: 'slide-right',
        transitionProgress: 0,
      };
      
      pushToHistory(newState);
      return updateHistoryFlags(newState);
    }
    
    case 'GO_BACK': {
      if (!state.canGoBack || historyPointer <= 0) return state;
      
      historyPointer--;
      const previousState = navigationHistory[historyPointer];
      
      return {
        ...previousState,
        isTransitioning: true,
        transitionType: 'slide-right',
        transitionProgress: 0,
        ...updateHistoryFlags(previousState),
      };
    }
    
    case 'GO_FORWARD': {
      if (!state.canGoForward || historyPointer >= navigationHistory.length - 1) return state;
      
      historyPointer++;
      const nextState = navigationHistory[historyPointer];
      
      return {
        ...nextState,
        isTransitioning: true,
        transitionType: 'slide-left',
        transitionProgress: 0,
        ...updateHistoryFlags(nextState),
      };
    }
    
    case 'GO_TO_ROOT': {
      if (state.currentView === 'universe') return state;
      
      const newState: NavigationState = {
        ...initialNavigationState,
        isTransitioning: true,
        transitionType: 'zoom-out',
        transitionProgress: 0,
      };
      
      pushToHistory(newState);
      return updateHistoryFlags(newState);
    }
    
    case 'NAVIGATE_TO': {
      const { path } = action;
      if (path.length === 0) return state;
      
      const lastSegment = path[path.length - 1];
      
      const newState: NavigationState = {
        ...state,
        currentView: lastSegment.type,
        currentDepth: lastSegment.depth,
        path,
        activeSphereId: path.find(s => s.type === 'sphere')?.id || null,
        activeBranchId: path.find(s => s.type === 'branch')?.id || null,
        activeLeafId: path.find(s => s.type === 'leaf')?.id || null,
        activeAgentId: path.find(s => s.type === 'agent-chat')?.id || null,
        isTransitioning: true,
        transitionType: 'fade',
        transitionProgress: 0,
      };
      
      pushToHistory(newState);
      return updateHistoryFlags(newState);
    }
    
    case 'SET_TRANSITIONING': {
      return {
        ...state,
        isTransitioning: action.isTransitioning,
        transitionProgress: action.progress ?? state.transitionProgress,
        transitionType: action.isTransitioning ? state.transitionType : null,
      };
    }
    
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

function formatLabel(id: string): string {
  return id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function pushToHistory(state: NavigationState): void {
  if (historyPointer < navigationHistory.length - 1) {
    navigationHistory = navigationHistory.slice(0, historyPointer + 1);
  }
  navigationHistory.push(state);
  historyPointer = navigationHistory.length - 1;
  
  if (navigationHistory.length > 50) {
    navigationHistory = navigationHistory.slice(-50);
    historyPointer = navigationHistory.length - 1;
  }
}

function updateHistoryFlags(state: NavigationState): NavigationState {
  return {
    ...state,
    canGoBack: historyPointer > 0,
    canGoForward: historyPointer < navigationHistory.length - 1,
    historyIndex: historyPointer,
  };
}

// ─────────────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────────────

export const selectCurrentView = (state: NavigationState) => state.currentView;
export const selectCurrentDepth = (state: NavigationState) => state.currentDepth;
export const selectActiveSphere = (state: NavigationState) => state.activeSphereId;
export const selectActiveBranch = (state: NavigationState) => state.activeBranchId;
export const selectActiveLeaf = (state: NavigationState) => state.activeLeafId;
export const selectActiveAgent = (state: NavigationState) => state.activeAgentId;
export const selectPath = (state: NavigationState) => state.path;
export const selectIsTransitioning = (state: NavigationState) => state.isTransitioning;
export const selectCanNavigate = (state: NavigationState) => ({ back: state.canGoBack, forward: state.canGoForward });
export const selectBreadcrumbs = (state: NavigationState) => state.path.filter(s => s.type !== 'agent-chat');

export function resetNavigationHistory(): void {
  navigationHistory = [initialNavigationState];
  historyPointer = 0;
}

export function getNavigationHistoryLength(): number {
  return navigationHistory.length;
}
