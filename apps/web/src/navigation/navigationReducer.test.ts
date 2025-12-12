/* =====================================================
   CHE·NU — Navigation Reducer Tests
   
   PHASE 4: DETERMINISTIC TESTS
   
   Tests for the pure navigation reducer.
   Same input → Same output guaranteed.
   ===================================================== */

import {
  navigationReducer,
  initialNavigationState,
  selectCurrentView,
  selectActiveSphere,
  selectActiveBranch,
  selectActiveLeaf,
  selectPath,
  selectBreadcrumbs,
  resetNavigationHistory,
} from './navigationReducer';

import { NavigationState, NavigationAction } from './types';

// ─────────────────────────────────────────────────────
// TEST SETUP
// ─────────────────────────────────────────────────────

describe('Navigation Reducer', () => {
  beforeEach(() => {
    resetNavigationHistory();
  });
  
  // ─────────────────────────────────────────────────
  // INITIAL STATE
  // ─────────────────────────────────────────────────
  
  describe('Initial State', () => {
    it('should have universe as current view', () => {
      expect(initialNavigationState.currentView).toBe('universe');
    });
    
    it('should have depth 0', () => {
      expect(initialNavigationState.currentDepth).toBe(0);
    });
    
    it('should have no active elements', () => {
      expect(initialNavigationState.activeSphereId).toBeNull();
      expect(initialNavigationState.activeBranchId).toBeNull();
      expect(initialNavigationState.activeLeafId).toBeNull();
      expect(initialNavigationState.activeAgentId).toBeNull();
    });
    
    it('should have root path', () => {
      expect(initialNavigationState.path).toHaveLength(1);
      expect(initialNavigationState.path[0].type).toBe('universe');
    });
  });
  
  // ─────────────────────────────────────────────────
  // SPHERE NAVIGATION
  // ─────────────────────────────────────────────────
  
  describe('Sphere Navigation', () => {
    it('should enter sphere from universe', () => {
      const action: NavigationAction = { type: 'ENTER_SPHERE', sphereId: 'business' };
      const state = navigationReducer(initialNavigationState, action);
      
      expect(state.currentView).toBe('sphere');
      expect(state.currentDepth).toBe(1);
      expect(state.activeSphereId).toBe('business');
      expect(state.path).toHaveLength(2);
      expect(state.isTransitioning).toBe(true);
      expect(state.transitionType).toBe('zoom-in');
    });
    
    it('should exit sphere to universe', () => {
      // First enter a sphere
      let state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'creative' }
      );
      
      // Then exit
      state = navigationReducer(state, { type: 'EXIT_SPHERE' });
      
      expect(state.currentView).toBe('universe');
      expect(state.currentDepth).toBe(0);
      expect(state.activeSphereId).toBeNull();
      expect(state.path).toHaveLength(1);
      expect(state.transitionType).toBe('zoom-out');
    });
    
    it('should not enter sphere if already in different sphere', () => {
      // Enter business sphere
      let state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      
      // Try to enter creative sphere (should be blocked)
      const originalState = { ...state };
      state = navigationReducer(state, { type: 'ENTER_SPHERE', sphereId: 'creative' });
      
      expect(state.activeSphereId).toBe('business');
    });
    
    it('should not exit sphere if not in one', () => {
      const state = navigationReducer(
        initialNavigationState, 
        { type: 'EXIT_SPHERE' }
      );
      
      expect(state).toEqual(initialNavigationState);
    });
  });
  
  // ─────────────────────────────────────────────────
  // BRANCH NAVIGATION
  // ─────────────────────────────────────────────────
  
  describe('Branch Navigation', () => {
    it('should enter branch from sphere', () => {
      // First enter a sphere
      let state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      
      // Then enter branch
      state = navigationReducer(state, { type: 'ENTER_BRANCH', branchId: 'projects' });
      
      expect(state.currentView).toBe('branch');
      expect(state.currentDepth).toBe(2);
      expect(state.activeBranchId).toBe('projects');
      expect(state.path).toHaveLength(3);
      expect(state.transitionType).toBe('slide-left');
    });
    
    it('should not enter branch without sphere', () => {
      const state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_BRANCH', branchId: 'projects' }
      );
      
      expect(state).toEqual(initialNavigationState);
    });
    
    it('should exit branch to sphere', () => {
      // Setup: enter sphere then branch
      let state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      state = navigationReducer(state, { type: 'ENTER_BRANCH', branchId: 'projects' });
      
      // Exit branch
      state = navigationReducer(state, { type: 'EXIT_BRANCH' });
      
      expect(state.currentView).toBe('sphere');
      expect(state.currentDepth).toBe(1);
      expect(state.activeBranchId).toBeNull();
      expect(state.transitionType).toBe('slide-right');
    });
  });
  
  // ─────────────────────────────────────────────────
  // LEAF NAVIGATION
  // ─────────────────────────────────────────────────
  
  describe('Leaf Navigation', () => {
    it('should select leaf from branch', () => {
      // Setup: enter sphere, branch
      let state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      state = navigationReducer(state, { type: 'ENTER_BRANCH', branchId: 'projects' });
      
      // Select leaf
      state = navigationReducer(state, { type: 'SELECT_LEAF', leafId: 'project-001' });
      
      expect(state.currentView).toBe('leaf');
      expect(state.currentDepth).toBe(3);
      expect(state.activeLeafId).toBe('project-001');
      expect(state.path).toHaveLength(4);
      expect(state.transitionType).toBe('morph');
    });
    
    it('should deselect leaf', () => {
      // Setup: full path to leaf
      let state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      state = navigationReducer(state, { type: 'ENTER_BRANCH', branchId: 'projects' });
      state = navigationReducer(state, { type: 'SELECT_LEAF', leafId: 'project-001' });
      
      // Deselect
      state = navigationReducer(state, { type: 'DESELECT_LEAF' });
      
      expect(state.currentView).toBe('branch');
      expect(state.activeLeafId).toBeNull();
    });
  });
  
  // ─────────────────────────────────────────────────
  // AGENT CHAT
  // ─────────────────────────────────────────────────
  
  describe('Agent Chat', () => {
    it('should open agent chat from sphere', () => {
      // Enter sphere first
      let state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      
      // Open agent chat
      state = navigationReducer(state, { type: 'OPEN_AGENT_CHAT', agentId: 'strategy-ai' });
      
      expect(state.currentView).toBe('agent-chat');
      expect(state.activeAgentId).toBe('strategy-ai');
      expect(state.transitionType).toBe('slide-left');
    });
    
    it('should close agent chat', () => {
      // Setup: sphere + agent chat
      let state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      state = navigationReducer(state, { type: 'OPEN_AGENT_CHAT', agentId: 'strategy-ai' });
      
      // Close
      state = navigationReducer(state, { type: 'CLOSE_AGENT_CHAT' });
      
      expect(state.currentView).toBe('sphere');
      expect(state.activeAgentId).toBeNull();
    });
    
    it('should not open agent chat without sphere', () => {
      const state = navigationReducer(
        initialNavigationState, 
        { type: 'OPEN_AGENT_CHAT', agentId: 'strategy-ai' }
      );
      
      expect(state).toEqual(initialNavigationState);
    });
  });
  
  // ─────────────────────────────────────────────────
  // HISTORY NAVIGATION
  // ─────────────────────────────────────────────────
  
  describe('History Navigation', () => {
    it('should enable back after navigation', () => {
      const state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      
      expect(state.canGoBack).toBe(true);
    });
    
    it('should go back in history', () => {
      // Navigate forward
      let state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      
      // Go back
      state = navigationReducer(state, { type: 'GO_BACK' });
      
      expect(state.currentView).toBe('universe');
    });
    
    it('should go to root from any depth', () => {
      // Navigate deep
      let state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      state = navigationReducer(state, { type: 'ENTER_BRANCH', branchId: 'projects' });
      state = navigationReducer(state, { type: 'SELECT_LEAF', leafId: 'p1' });
      
      // Go to root
      state = navigationReducer(state, { type: 'GO_TO_ROOT' });
      
      expect(state.currentView).toBe('universe');
      expect(state.currentDepth).toBe(0);
      expect(state.activeSphereId).toBeNull();
    });
  });
  
  // ─────────────────────────────────────────────────
  // SELECTORS
  // ─────────────────────────────────────────────────
  
  describe('Selectors', () => {
    it('selectCurrentView returns correct view', () => {
      const state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      
      expect(selectCurrentView(state)).toBe('sphere');
    });
    
    it('selectActiveSphere returns sphere id', () => {
      const state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'creative' }
      );
      
      expect(selectActiveSphere(state)).toBe('creative');
    });
    
    it('selectBreadcrumbs excludes agent-chat', () => {
      // Setup with agent chat
      let state = navigationReducer(
        initialNavigationState, 
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      state = navigationReducer(state, { type: 'OPEN_AGENT_CHAT', agentId: 'ai' });
      
      const breadcrumbs = selectBreadcrumbs(state);
      
      expect(breadcrumbs.every(b => b.type !== 'agent-chat')).toBe(true);
    });
  });
  
  // ─────────────────────────────────────────────────
  // DETERMINISM
  // ─────────────────────────────────────────────────
  
  describe('Determinism', () => {
    it('same actions produce same state', () => {
      resetNavigationHistory();
      
      const actions: NavigationAction[] = [
        { type: 'ENTER_SPHERE', sphereId: 'business' },
        { type: 'ENTER_BRANCH', branchId: 'projects' },
        { type: 'SELECT_LEAF', leafId: 'p1' },
      ];
      
      let state1 = initialNavigationState;
      actions.forEach(action => {
        state1 = navigationReducer(state1, action);
      });
      
      resetNavigationHistory();
      
      let state2 = initialNavigationState;
      actions.forEach(action => {
        state2 = navigationReducer(state2, action);
      });
      
      // Compare relevant properties (excluding transitioning flags)
      expect(state1.currentView).toBe(state2.currentView);
      expect(state1.currentDepth).toBe(state2.currentDepth);
      expect(state1.activeSphereId).toBe(state2.activeSphereId);
      expect(state1.activeBranchId).toBe(state2.activeBranchId);
      expect(state1.activeLeafId).toBe(state2.activeLeafId);
      expect(state1.path.length).toBe(state2.path.length);
    });
  });
});

// ─────────────────────────────────────────────────────
// TEST RUNNER (if not using Jest)
// ─────────────────────────────────────────────────────

if (typeof describe === 'undefined') {
  console.log('Running navigation reducer tests...');
  
  // Simple test runner
  const tests = [
    () => {
      resetNavigationHistory();
      console.assert(
        initialNavigationState.currentView === 'universe',
        'Initial view should be universe'
      );
    },
    () => {
      resetNavigationHistory();
      const state = navigationReducer(
        initialNavigationState,
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      console.assert(
        state.activeSphereId === 'business',
        'Should enter business sphere'
      );
    },
    () => {
      resetNavigationHistory();
      let state = navigationReducer(
        initialNavigationState,
        { type: 'ENTER_SPHERE', sphereId: 'business' }
      );
      state = navigationReducer(state, { type: 'EXIT_SPHERE' });
      console.assert(
        state.currentView === 'universe',
        'Should exit to universe'
      );
    },
  ];
  
  tests.forEach((test, i) => {
    try {
      test();
      console.log(`✓ Test ${i + 1} passed`);
    } catch (e) {
      console.error(`✗ Test ${i + 1} failed:`, e);
    }
  });
  
  console.log('Navigation reducer tests complete');
}
