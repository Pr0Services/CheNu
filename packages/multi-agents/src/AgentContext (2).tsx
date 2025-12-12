/**
 * CHE·NU — MULTI-AGENT ORCHESTRATION
 * React Context & Provider
 */

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import {
  Agent, AgentMessage, TaskExecution, AgentOrchestrationState,
  AgentLevel, AgentType, Department, MessageType, MessagePriority, TaskState,
} from './types';
import { LEVEL_CONFIGS, createAgent, createMessage, createTask, addReasoningStep } from './presets';

type Action =
  | { type: 'ADD_AGENT'; payload: Agent }
  | { type: 'TOGGLE_AGENT'; payload: string }
  | { type: 'SELECT_AGENT'; payload: string | null }
  | { type: 'SEND_MESSAGE'; payload: AgentMessage }
  | { type: 'ACK_MESSAGE'; payload: string }
  | { type: 'CREATE_TASK'; payload: TaskExecution }
  | { type: 'UPDATE_TASK_STATE'; payload: { taskId: string; state: TaskState } }
  | { type: 'ADD_REASONING_STEP'; payload: { taskId: string; action: string; detail: string } }
  | { type: 'COMPLETE_TASK'; payload: { taskId: string; output: Record<string, any> } }
  | { type: 'VETO_TASK'; payload: string }
  | { type: 'SET_LEVEL_FILTER'; payload: AgentLevel | null }
  | { type: 'SET_DEPARTMENT_FILTER'; payload: Department | null }
  | { type: 'SET_TYPE_FILTER'; payload: AgentType | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: AgentOrchestrationState = {
  agents: [],
  messages: [],
  tasks: [],
  level_filter: null,
  department_filter: null,
  type_filter: null,
  selected_agent: null,
  active_tasks: [],
  total_agents: 0,
  agents_by_level: { 0: 0, 1: 0, 2: 0, 3: 0 },
  is_loading: false,
  error: null,
};

function updateAgentCounts(agents: Agent[]): { total: number; byLevel: Record<AgentLevel, number> } {
  const byLevel: Record<AgentLevel, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  agents.filter(a => a.active).forEach(a => byLevel[a.level]++);
  return { total: agents.filter(a => a.active).length, byLevel };
}

function reducer(state: AgentOrchestrationState, action: Action): AgentOrchestrationState {
  switch (action.type) {
    case 'ADD_AGENT': {
      const agents = [...state.agents, action.payload];
      const counts = updateAgentCounts(agents);
      return { ...state, agents, total_agents: counts.total, agents_by_level: counts.byLevel };
    }
    
    case 'TOGGLE_AGENT': {
      const agents = state.agents.map(a => a.id === action.payload ? { ...a, active: !a.active } : a);
      const counts = updateAgentCounts(agents);
      return { ...state, agents, total_agents: counts.total, agents_by_level: counts.byLevel };
    }
    
    case 'SELECT_AGENT':
      return { ...state, selected_agent: action.payload };
    
    case 'SEND_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    
    case 'ACK_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(m => m.id === action.payload ? { ...m, acknowledged: true, acknowledged_at: new Date().toISOString() } : m),
      };
    
    case 'CREATE_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        active_tasks: [...state.active_tasks, action.payload.task_id],
      };
    
    case 'UPDATE_TASK_STATE':
      return {
        ...state,
        tasks: state.tasks.map(t => t.task_id === action.payload.taskId ? { ...t, state: action.payload.state } : t),
      };
    
    case 'ADD_REASONING_STEP':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.task_id === action.payload.taskId
            ? addReasoningStep(t, action.payload.action, action.payload.detail)
            : t
        ),
      };
    
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.task_id === action.payload.taskId
            ? { ...t, state: 'completed' as TaskState, output: action.payload.output, ended_at: new Date().toISOString() }
            : t
        ),
        active_tasks: state.active_tasks.filter(id => id !== action.payload.taskId),
      };
    
    case 'VETO_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.task_id === action.payload
            ? { ...t, state: 'vetoed' as TaskState, violations: [...t.violations, 'L0 VETO'], ended_at: new Date().toISOString() }
            : t
        ),
        active_tasks: state.active_tasks.filter(id => id !== action.payload),
      };
    
    case 'SET_LEVEL_FILTER':
      return { ...state, level_filter: action.payload };
    
    case 'SET_DEPARTMENT_FILTER':
      return { ...state, department_filter: action.payload };
    
    case 'SET_TYPE_FILTER':
      return { ...state, type_filter: action.payload };
    
    case 'SET_LOADING':
      return { ...state, is_loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

interface ContextValue {
  state: AgentOrchestrationState;
  addAgent: (name: string, type: AgentType, level: AgentLevel, department: Department, reportsTo: string | null, capabilities: string[]) => void;
  toggleAgent: (agentId: string) => void;
  selectAgent: (agentId: string | null) => void;
  sendMessage: (type: MessageType, fromAgent: string, toAgent: string, payload: Record<string, any>, priority?: MessagePriority) => void;
  ackMessage: (messageId: string) => void;
  createTask: (agentId: string, input: Record<string, any>, humanApprovalRequired?: boolean) => string;
  addReasoningStep: (taskId: string, action: string, detail: string) => void;
  completeTask: (taskId: string, output: Record<string, any>) => void;
  vetoTask: (taskId: string) => void;
  setLevelFilter: (level: AgentLevel | null) => void;
  setDepartmentFilter: (dept: Department | null) => void;
  getFilteredAgents: () => Agent[];
  getAgentById: (id: string) => Agent | undefined;
  reset: () => void;
}

const Context = createContext<ContextValue | null>(null);

export function AgentOrchestrationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const addAgentFn = useCallback((name: string, type: AgentType, level: AgentLevel, department: Department, reportsTo: string | null, capabilities: string[]) => {
    const agent = createAgent(name, type, level, department, reportsTo, capabilities);
    dispatch({ type: 'ADD_AGENT', payload: agent });
  }, []);
  
  const toggleAgentFn = useCallback((agentId: string) => dispatch({ type: 'TOGGLE_AGENT', payload: agentId }), []);
  const selectAgentFn = useCallback((agentId: string | null) => dispatch({ type: 'SELECT_AGENT', payload: agentId }), []);
  
  const sendMessageFn = useCallback((type: MessageType, fromAgent: string, toAgent: string, payload: Record<string, any>, priority: MessagePriority = 'normal') => {
    const msg = createMessage(type, fromAgent, toAgent, payload, priority);
    dispatch({ type: 'SEND_MESSAGE', payload: msg });
  }, []);
  
  const ackMessageFn = useCallback((messageId: string) => dispatch({ type: 'ACK_MESSAGE', payload: messageId }), []);
  
  const createTaskFn = useCallback((agentId: string, input: Record<string, any>, humanApprovalRequired: boolean = false): string => {
    const task = createTask(agentId, input, humanApprovalRequired);
    dispatch({ type: 'CREATE_TASK', payload: task });
    return task.task_id;
  }, []);
  
  const addReasoningStepFn = useCallback((taskId: string, action: string, detail: string) => {
    dispatch({ type: 'ADD_REASONING_STEP', payload: { taskId, action, detail } });
  }, []);
  
  const completeTaskFn = useCallback((taskId: string, output: Record<string, any>) => {
    dispatch({ type: 'COMPLETE_TASK', payload: { taskId, output } });
  }, []);
  
  const vetoTaskFn = useCallback((taskId: string) => dispatch({ type: 'VETO_TASK', payload: taskId }), []);
  
  const setLevelFilterFn = useCallback((level: AgentLevel | null) => dispatch({ type: 'SET_LEVEL_FILTER', payload: level }), []);
  const setDepartmentFilterFn = useCallback((dept: Department | null) => dispatch({ type: 'SET_DEPARTMENT_FILTER', payload: dept }), []);
  
  const getFilteredAgentsFn = useCallback(() => {
    let agents = state.agents.filter(a => a.active);
    if (state.level_filter !== null) agents = agents.filter(a => a.level === state.level_filter);
    if (state.department_filter) agents = agents.filter(a => a.department === state.department_filter);
    if (state.type_filter) agents = agents.filter(a => a.type === state.type_filter);
    return agents;
  }, [state.agents, state.level_filter, state.department_filter, state.type_filter]);
  
  const getAgentByIdFn = useCallback((id: string) => state.agents.find(a => a.id === id), [state.agents]);
  const resetFn = useCallback(() => dispatch({ type: 'RESET' }), []);
  
  return (
    <Context.Provider value={{
      state,
      addAgent: addAgentFn, toggleAgent: toggleAgentFn, selectAgent: selectAgentFn,
      sendMessage: sendMessageFn, ackMessage: ackMessageFn,
      createTask: createTaskFn, addReasoningStep: addReasoningStepFn,
      completeTask: completeTaskFn, vetoTask: vetoTaskFn,
      setLevelFilter: setLevelFilterFn, setDepartmentFilter: setDepartmentFilterFn,
      getFilteredAgents: getFilteredAgentsFn, getAgentById: getAgentByIdFn, reset: resetFn,
    }}>
      {children}
    </Context.Provider>
  );
}

export function useAgentOrchestration() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useAgentOrchestration must be used within AgentOrchestrationProvider');
  return ctx;
}

export { Context as AgentOrchestrationContext };
