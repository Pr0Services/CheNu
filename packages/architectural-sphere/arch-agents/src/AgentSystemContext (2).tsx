/**
 * CHE·NU — ARCHITECTURAL AGENT SYSTEM
 * React Context & Provider
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';

import {
  ArchitecturalAgentId,
  AgentState,
  ArchitecturalBundle,
  DesignRequest,
  RequestType,
  ActivationTrigger,
  ActivationEvent,
  AGENT_DEFINITIONS,
} from './types';

import { ArchitectAgentOrchestrator } from './orchestrator';

// ============================================================
// STATE
// ============================================================

interface AgentSystemState {
  // Orchestrator state
  orchestratorState: AgentState;
  
  // Agent states
  agentStates: Record<ArchitecturalAgentId, AgentState>;
  
  // Current request
  currentRequest: DesignRequest | null;
  
  // Bundles
  bundles: ArchitecturalBundle[];
  currentBundle: ArchitecturalBundle | null;
  
  // Activation history
  activationHistory: ActivationEvent[];
  
  // Logs
  logs: string[];
  
  // Processing
  isProcessing: boolean;
  error: string | null;
}

// ============================================================
// ACTIONS
// ============================================================

type AgentSystemAction =
  | { type: 'SET_ORCHESTRATOR_STATE'; payload: AgentState }
  | { type: 'SET_AGENT_STATE'; payload: { id: ArchitecturalAgentId; state: AgentState } }
  | { type: 'SET_REQUEST'; payload: DesignRequest | null }
  | { type: 'ADD_BUNDLE'; payload: ArchitecturalBundle }
  | { type: 'SET_CURRENT_BUNDLE'; payload: ArchitecturalBundle | null }
  | { type: 'ADD_ACTIVATION'; payload: ActivationEvent }
  | { type: 'ADD_LOG'; payload: string }
  | { type: 'CLEAR_LOGS' }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

// ============================================================
// INITIAL STATE
// ============================================================

const initialAgentStates: Record<ArchitecturalAgentId, AgentState> = {
  AGENT_ARCHITECT_PLANNER: 'off',
  AGENT_DECOR_DESIGNER: 'off',
  AGENT_AVATAR_ARCHITECT: 'off',
  AGENT_NAVIGATION_DESIGNER: 'off',
  AGENT_DOMAIN_ADAPTER: 'off',
  AGENT_VALIDATION_GUARD: 'off',
  AGENT_ORCHESTRATOR: 'off',
};

const initialState: AgentSystemState = {
  orchestratorState: 'off',
  agentStates: initialAgentStates,
  currentRequest: null,
  bundles: [],
  currentBundle: null,
  activationHistory: [],
  logs: [],
  isProcessing: false,
  error: null,
};

// ============================================================
// REDUCER
// ============================================================

function agentSystemReducer(
  state: AgentSystemState,
  action: AgentSystemAction
): AgentSystemState {
  switch (action.type) {
    case 'SET_ORCHESTRATOR_STATE':
      return {
        ...state,
        orchestratorState: action.payload,
        agentStates: {
          ...state.agentStates,
          AGENT_ORCHESTRATOR: action.payload,
        },
      };
    
    case 'SET_AGENT_STATE':
      return {
        ...state,
        agentStates: {
          ...state.agentStates,
          [action.payload.id]: action.payload.state,
        },
      };
    
    case 'SET_REQUEST':
      return { ...state, currentRequest: action.payload };
    
    case 'ADD_BUNDLE':
      return {
        ...state,
        bundles: [...state.bundles, action.payload],
        currentBundle: action.payload,
      };
    
    case 'SET_CURRENT_BUNDLE':
      return { ...state, currentBundle: action.payload };
    
    case 'ADD_ACTIVATION':
      return {
        ...state,
        activationHistory: [...state.activationHistory, action.payload],
      };
    
    case 'ADD_LOG':
      return {
        ...state,
        logs: [...state.logs, `[${new Date().toISOString()}] ${action.payload}`],
      };
    
    case 'CLEAR_LOGS':
      return { ...state, logs: [] };
    
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

// ============================================================
// CONTEXT
// ============================================================

interface AgentSystemContextValue {
  state: AgentSystemState;
  
  // Actions
  activate: (trigger: ActivationTrigger, request?: DesignRequest) => Promise<void>;
  deactivate: () => void;
  process: (request: DesignRequest) => Promise<ArchitecturalBundle>;
  createRequest: (
    type: RequestType,
    domain: string,
    purpose: string,
    options?: Partial<DesignRequest['constraints']>
  ) => DesignRequest;
  
  // Utilities
  getAgentDefinition: (id: ArchitecturalAgentId) => typeof AGENT_DEFINITIONS[ArchitecturalAgentId];
  isAgentActive: (id: ArchitecturalAgentId) => boolean;
  clearLogs: () => void;
  reset: () => void;
}

const AgentSystemContext = createContext<AgentSystemContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================

interface AgentSystemProviderProps {
  children: ReactNode;
}

export function AgentSystemProvider({ children }: AgentSystemProviderProps) {
  const [state, dispatch] = useReducer(agentSystemReducer, initialState);
  
  // Orchestrator instance (recreated as needed)
  const orchestratorRef = React.useRef<ArchitectAgentOrchestrator | null>(null);
  
  const getOrchestrator = useCallback(() => {
    if (!orchestratorRef.current) {
      orchestratorRef.current = new ArchitectAgentOrchestrator();
    }
    return orchestratorRef.current;
  }, []);
  
  // Activate
  const activate = useCallback(async (
    trigger: ActivationTrigger,
    request?: DesignRequest
  ) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const orchestrator = getOrchestrator();
      const event = orchestrator.activate(trigger, request);
      
      dispatch({ type: 'SET_ORCHESTRATOR_STATE', payload: 'active' });
      dispatch({ type: 'ADD_ACTIVATION', payload: event });
      dispatch({ type: 'ADD_LOG', payload: `Activated via ${trigger}` });
      
      // Update agent states
      for (const agentId of event.target_agents) {
        dispatch({ type: 'SET_AGENT_STATE', payload: { id: agentId, state: 'active' } });
      }
      
      if (request) {
        dispatch({ type: 'SET_REQUEST', payload: request });
      }
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: String(error) });
      throw error;
    }
  }, [getOrchestrator]);
  
  // Deactivate
  const deactivate = useCallback(() => {
    const orchestrator = getOrchestrator();
    orchestrator.deactivate();
    
    dispatch({ type: 'SET_ORCHESTRATOR_STATE', payload: 'off' });
    dispatch({ type: 'ADD_LOG', payload: 'Deactivated' });
    
    // Reset all agent states
    Object.keys(initialAgentStates).forEach(id => {
      dispatch({
        type: 'SET_AGENT_STATE',
        payload: { id: id as ArchitecturalAgentId, state: 'off' },
      });
    });
    
    dispatch({ type: 'SET_REQUEST', payload: null });
    
    // Create new orchestrator for next use
    orchestratorRef.current = null;
  }, [getOrchestrator]);
  
  // Process
  const process = useCallback(async (request: DesignRequest): Promise<ArchitecturalBundle> => {
    try {
      dispatch({ type: 'SET_PROCESSING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_REQUEST', payload: request });
      dispatch({ type: 'ADD_LOG', payload: `Processing request: ${request.request_id}` });
      
      const orchestrator = getOrchestrator();
      
      // Activate if not already active
      if (orchestrator.getState() === 'off') {
        orchestrator.activate('manual_request', request);
        dispatch({ type: 'SET_ORCHESTRATOR_STATE', payload: 'active' });
      }
      
      const bundle = await orchestrator.process(request);
      
      dispatch({ type: 'ADD_BUNDLE', payload: bundle });
      dispatch({ type: 'ADD_LOG', payload: `Bundle created: ${bundle.bundle_id}` });
      
      // Orchestrator auto-deactivates, update state
      setTimeout(() => {
        dispatch({ type: 'SET_ORCHESTRATOR_STATE', payload: 'off' });
        Object.keys(initialAgentStates).forEach(id => {
          dispatch({
            type: 'SET_AGENT_STATE',
            payload: { id: id as ArchitecturalAgentId, state: 'off' },
          });
        });
        orchestratorRef.current = null;
      }, 200);
      
      return bundle;
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: String(error) });
      dispatch({ type: 'ADD_LOG', payload: `Error: ${error}` });
      throw error;
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [getOrchestrator]);
  
  // Create request
  const createRequest = useCallback((
    type: RequestType,
    domain: string,
    purpose: string,
    options?: Partial<DesignRequest['constraints']>
  ): DesignRequest => {
    return ArchitectAgentOrchestrator.createRequest(type, domain, purpose, options);
  }, []);
  
  // Utilities
  const getAgentDefinition = useCallback((id: ArchitecturalAgentId) => {
    return AGENT_DEFINITIONS[id];
  }, []);
  
  const isAgentActive = useCallback((id: ArchitecturalAgentId) => {
    const agentState = state.agentStates[id];
    return agentState === 'active' || agentState === 'processing';
  }, [state.agentStates]);
  
  const clearLogs = useCallback(() => {
    dispatch({ type: 'CLEAR_LOGS' });
  }, []);
  
  const reset = useCallback(() => {
    deactivate();
    dispatch({ type: 'RESET' });
  }, [deactivate]);
  
  const value: AgentSystemContextValue = {
    state,
    activate,
    deactivate,
    process,
    createRequest,
    getAgentDefinition,
    isAgentActive,
    clearLogs,
    reset,
  };
  
  return (
    <AgentSystemContext.Provider value={value}>
      {children}
    </AgentSystemContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useAgentSystem(): AgentSystemContextValue {
  const context = useContext(AgentSystemContext);
  if (!context) {
    throw new Error('useAgentSystem must be used within AgentSystemProvider');
  }
  return context;
}

// ============================================================
// EXPORTS
// ============================================================

export { AgentSystemContext };
export type { AgentSystemState, AgentSystemContextValue };
