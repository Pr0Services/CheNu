/* =========================================================
   CHE·NU — useDebugDashboard Hook
   
   State management for the debug dashboard.
   ========================================================= */

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  FlowStage,
  AgentStatus,
  GuardEvent,
  ProcessObservation,
  ConfidenceLevel,
} from './CheNuDebugDashboard';

/* -------------------------
   TYPES
------------------------- */

export interface DebugState {
  currentStage: FlowStage;
  agents: AgentStatus[];
  guardEvents: GuardEvent[];
  observations: ProcessObservation[];
  sessionStart: number;
}

export interface DebugActions {
  setStage: (stage: FlowStage) => void;
  advanceStage: () => void;
  
  addAgent: (agent: Omit<AgentStatus, 'id' | 'lastUpdate'>) => void;
  updateAgent: (id: string, updates: Partial<AgentStatus>) => void;
  removeAgent: (id: string) => void;
  
  addGuardEvent: (event: Omit<GuardEvent, 'id' | 'timestamp'>) => void;
  clearGuardEvents: () => void;
  
  addObservation: (note: string, source?: string) => void;
  clearObservations: () => void;
  
  reset: () => void;
}

/* -------------------------
   CONSTANTS
------------------------- */

const STAGE_ORDER: FlowStage[] = [
  'user_intention',
  'parallel_analysis',
  'orchestration',
  'decision_clarification',
  'human_validation',
  'timeline_write',
  'return_to_neutral',
];

/* -------------------------
   INITIAL STATE
------------------------- */

const createInitialState = (): DebugState => ({
  currentStage: 'user_intention',
  agents: [],
  guardEvents: [],
  observations: [],
  sessionStart: Date.now(),
});

/* -------------------------
   HOOK
------------------------- */

export function useDebugDashboard(): [DebugState, DebugActions] {
  const [state, setState] = useState<DebugState>(createInitialState);
  const idCounter = useRef(0);

  const generateId = useCallback((prefix: string) => {
    idCounter.current += 1;
    return `${prefix}_${Date.now()}_${idCounter.current}`;
  }, []);

  // Stage actions
  const setStage = useCallback((stage: FlowStage) => {
    setState(prev => ({
      ...prev,
      currentStage: stage,
    }));
  }, []);

  const advanceStage = useCallback(() => {
    setState(prev => {
      const currentIndex = STAGE_ORDER.indexOf(prev.currentStage);
      const nextIndex = Math.min(currentIndex + 1, STAGE_ORDER.length - 1);
      return {
        ...prev,
        currentStage: STAGE_ORDER[nextIndex],
      };
    });
  }, []);

  // Agent actions
  const addAgent = useCallback((agent: Omit<AgentStatus, 'id' | 'lastUpdate'>) => {
    setState(prev => ({
      ...prev,
      agents: [
        ...prev.agents,
        {
          ...agent,
          id: generateId('agent'),
          lastUpdate: Date.now(),
        },
      ],
    }));
  }, [generateId]);

  const updateAgent = useCallback((id: string, updates: Partial<AgentStatus>) => {
    setState(prev => ({
      ...prev,
      agents: prev.agents.map(agent =>
        agent.id === id
          ? { ...agent, ...updates, lastUpdate: Date.now() }
          : agent
      ),
    }));
  }, []);

  const removeAgent = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      agents: prev.agents.filter(agent => agent.id !== id),
    }));
  }, []);

  // Guard event actions
  const addGuardEvent = useCallback((event: Omit<GuardEvent, 'id' | 'timestamp'>) => {
    setState(prev => ({
      ...prev,
      guardEvents: [
        {
          ...event,
          id: generateId('guard'),
          timestamp: Date.now(),
        },
        ...prev.guardEvents,
      ],
    }));
  }, [generateId]);

  const clearGuardEvents = useCallback(() => {
    setState(prev => ({
      ...prev,
      guardEvents: [],
    }));
  }, []);

  // Observation actions
  const addObservation = useCallback((note: string, source = 'system') => {
    setState(prev => ({
      ...prev,
      observations: [
        ...prev.observations,
        {
          id: generateId('obs'),
          timestamp: Date.now(),
          note,
          source,
        },
      ],
    }));
  }, [generateId]);

  const clearObservations = useCallback(() => {
    setState(prev => ({
      ...prev,
      observations: [],
    }));
  }, []);

  // Reset
  const reset = useCallback(() => {
    idCounter.current = 0;
    setState(createInitialState());
  }, []);

  const actions: DebugActions = {
    setStage,
    advanceStage,
    addAgent,
    updateAgent,
    removeAgent,
    addGuardEvent,
    clearGuardEvents,
    addObservation,
    clearObservations,
    reset,
  };

  return [state, actions];
}

/* -------------------------
   MOCK DATA GENERATOR
------------------------- */

export function createMockAgents(): AgentStatus[] {
  const now = Date.now();
  
  return [
    {
      id: 'agent_1',
      name: 'Context Analyzer',
      type: 'L1',
      confidence: 'high',
      summary: 'Active sphere: Business. Preset: Focus Mode. Timeline at HEAD.',
      lastUpdate: now - 1000,
      active: true,
    },
    {
      id: 'agent_2',
      name: 'Memory Agent',
      type: 'L1',
      confidence: 'medium',
      summary: 'Found 3 related past decisions. Most recent: 2 days ago.',
      lastUpdate: now - 2000,
      active: true,
    },
    {
      id: 'agent_3',
      name: 'Preset Advisor',
      type: 'L1',
      confidence: 'high',
      summary: 'You may consider switching to Deep Work preset.',
      lastUpdate: now - 500,
      active: true,
    },
    {
      id: 'agent_4',
      name: 'UX Observer',
      type: 'L1',
      confidence: 'low',
      summary: 'You have been navigating back and forth between spheres.',
      lastUpdate: now - 3000,
      active: false,
    },
  ];
}

export function createMockGuardEvents(): GuardEvent[] {
  const now = Date.now();
  
  return [
    {
      id: 'guard_1',
      timestamp: now - 5000,
      rule: 'NO_AGENT_DECISION',
      reason: 'Blocked attempt to finalize choice without human validation',
      severity: 'blocked',
    },
    {
      id: 'guard_2',
      timestamp: now - 10000,
      rule: 'CONDITIONAL_LANGUAGE',
      reason: 'Agent used imperative "you should" instead of conditional phrasing',
      severity: 'warning',
    },
  ];
}

export function createMockObservations(): ProcessObservation[] {
  const now = Date.now();
  
  return [
    {
      id: 'obs_1',
      timestamp: now - 1000,
      note: 'Parallel analysis completed in 234ms',
      source: 'Orchestrator',
    },
    {
      id: 'obs_2',
      timestamp: now - 2000,
      note: 'User intention classified as exploratory',
      source: 'Decision Analyst',
    },
    {
      id: 'obs_3',
      timestamp: now - 3000,
      note: 'Session started in Business sphere',
      source: 'Context Analyzer',
    },
  ];
}

/* -------------------------
   EXPORTS
------------------------- */

export default useDebugDashboard;
