/* =========================================================
   CHE·NU — useXRDebug Hook
   
   Hook to connect XR Debug Experience to runtime state.
   ========================================================= */

import { useState, useEffect, useCallback } from 'react';
import type {
  FlowStage,
  AgentStatus,
  GuardEvent,
  ProcessObservation,
  Confidence,
} from './CheNuXRDebugExperience';

/* -------------------------
   TYPES
------------------------- */

export interface XRDebugState {
  currentStage: FlowStage;
  agents: AgentStatus[];
  guardEvents: GuardEvent[];
  observations: ProcessObservation[];
  isConnected: boolean;
}

export interface XRDebugActions {
  setStage: (stage: FlowStage) => void;
  addGuardEvent: (event: GuardEvent) => void;
  clearGuardEvents: () => void;
  addObservation: (observation: ProcessObservation) => void;
  clearObservations: () => void;
  updateAgent: (name: string, updates: Partial<AgentStatus>) => void;
  reset: () => void;
}

export type UseXRDebugReturn = XRDebugState & XRDebugActions;

/* -------------------------
   DEFAULT STATE
------------------------- */

const DEFAULT_AGENTS: AgentStatus[] = [
  { name: 'Context', confidence: 'medium', summary: '', active: false },
  { name: 'Memory', confidence: 'medium', summary: '', active: false },
  { name: 'Preset', confidence: 'medium', summary: '', active: false },
  { name: 'UX', confidence: 'medium', summary: '', active: false },
  { name: 'Sphere', confidence: 'medium', summary: '', active: false },
  { name: 'Method', confidence: 'medium', summary: '', active: false },
];

const DEFAULT_STATE: XRDebugState = {
  currentStage: 'user_intention',
  agents: DEFAULT_AGENTS,
  guardEvents: [],
  observations: [],
  isConnected: false,
};

/* =========================================================
   HOOK
   ========================================================= */

export function useXRDebug(
  externalState?: Partial<XRDebugState>
): UseXRDebugReturn {
  const [state, setState] = useState<XRDebugState>({
    ...DEFAULT_STATE,
    ...externalState,
  });

  // Sync with external state
  useEffect(() => {
    if (externalState) {
      setState((prev) => ({ ...prev, ...externalState }));
    }
  }, [externalState]);

  // Actions
  const setStage = useCallback((stage: FlowStage) => {
    setState((prev) => ({ ...prev, currentStage: stage }));
  }, []);

  const addGuardEvent = useCallback((event: GuardEvent) => {
    setState((prev) => ({
      ...prev,
      guardEvents: [
        { ...event, timestamp: event.timestamp ?? Date.now() },
        ...prev.guardEvents,
      ].slice(0, 20), // Keep last 20
    }));
  }, []);

  const clearGuardEvents = useCallback(() => {
    setState((prev) => ({ ...prev, guardEvents: [] }));
  }, []);

  const addObservation = useCallback((observation: ProcessObservation) => {
    setState((prev) => ({
      ...prev,
      observations: [
        { ...observation, timestamp: observation.timestamp ?? new Date().toISOString() },
        ...prev.observations,
      ].slice(0, 10), // Keep last 10
    }));
  }, []);

  const clearObservations = useCallback(() => {
    setState((prev) => ({ ...prev, observations: [] }));
  }, []);

  const updateAgent = useCallback(
    (name: string, updates: Partial<AgentStatus>) => {
      setState((prev) => ({
        ...prev,
        agents: prev.agents.map((agent) =>
          agent.name === name ? { ...agent, ...updates } : agent
        ),
      }));
    },
    []
  );

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    ...state,
    setStage,
    addGuardEvent,
    clearGuardEvents,
    addObservation,
    clearObservations,
    updateAgent,
    reset,
  };
}

/* =========================================================
   RUNTIME INTEGRATION
   ========================================================= */

/**
 * Connect XR Debug to runtime guards.
 * Call this to automatically capture guard events.
 */
export function createGuardEventHandler(
  addGuardEvent: (event: GuardEvent) => void
) {
  return {
    onViolation: (code: string, message: string) => {
      addGuardEvent({
        rule: code,
        reason: message,
        severity: 'violation',
      });
    },
    onWarning: (code: string, message: string) => {
      addGuardEvent({
        rule: code,
        reason: message,
        severity: 'warning',
      });
    },
    onInfo: (code: string, message: string) => {
      addGuardEvent({
        rule: code,
        reason: message,
        severity: 'info',
      });
    },
  };
}

/**
 * Map FlowStage to agent activation patterns.
 */
export function getActiveAgentsForStage(stage: FlowStage): string[] {
  const stageAgentMap: Record<FlowStage, string[]> = {
    user_intention: [],
    parallel_analysis: ['Context', 'Memory', 'Preset', 'UX', 'Sphere', 'Method'],
    orchestration: [],
    decision_clarification: [],
    human_validation: [],
    timeline_write: [],
  };

  return stageAgentMap[stage] || [];
}

/**
 * Auto-update agent active states based on flow stage.
 */
export function useAutoAgentActivation(
  currentStage: FlowStage,
  updateAgent: (name: string, updates: Partial<AgentStatus>) => void,
  agents: AgentStatus[]
) {
  useEffect(() => {
    const activeNames = getActiveAgentsForStage(currentStage);

    agents.forEach((agent) => {
      const shouldBeActive = activeNames.includes(agent.name);
      if (agent.active !== shouldBeActive) {
        updateAgent(agent.name, { active: shouldBeActive });
      }
    });
  }, [currentStage, updateAgent, agents]);
}

/* =========================================================
   EXPORTS
   ========================================================= */

export { DEFAULT_AGENTS, DEFAULT_STATE };
