// =============================================================================
// CHE·NU — useVisualEngine Hook
// Foundation Freeze V1
// =============================================================================
// Hook principal qui calcule tous les états visuels pour l'Universe View.
// Ce hook est la source de vérité pour le rendu 2D / 3D / XR.
// =============================================================================

import { useMemo, useState, useCallback } from 'react';
import {
  ViewMode,
  SphereConfig,
  SphereRuntimeState,
  AgentConfig,
  AgentRuntimeState,
  SphereVisualData,
  AgentVisualData,
  MinimapNode,
  SphereId,
  AgentState,
  SPHERE_IDS,
  AGENT_STATE_COLORS
} from '../types';
import {
  DEFAULT_UNIVERSE_CONFIG,
  VIEW_MODE_CONFIG,
  SPHERE_CONFIGS,
  AGENT_CONFIGS,
  createDefaultSphereStates,
  createDefaultAgentRuntimeState
} from '../config';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

/**
 * État du moteur visuel
 */
export interface VisualEngineState {
  // Mode de vue actuel
  mode: ViewMode;
  
  // Core toujours actif
  coreActive: boolean;
  
  // Données visuelles calculées
  spheres: SphereVisualData[];
  agents: AgentVisualData[];
  minimapNodes: MinimapNode[];
  
  // États de focus
  focusedSphereId: SphereId | null;
  focusedAgentId: string | null;
  highlightedSphereId: SphereId | null;
  hoveredSphereId: SphereId | null;
  
  // Métriques
  totalActivity: number;
  activeAgentCount: number;
}

/**
 * Actions du moteur visuel
 */
export interface VisualEngineActions {
  // Mode de vue
  setMode: (mode: ViewMode) => void;
  
  // Focus et highlight
  focusSphere: (sphereId: SphereId | null) => void;
  focusAgent: (agentId: string | null) => void;
  highlightSphere: (sphereId: SphereId | null) => void;
  hoverSphere: (sphereId: SphereId | null) => void;
  
  // Mise à jour des états runtime
  updateSphereActivity: (sphereId: SphereId, activity: number) => void;
  updateSphereState: (sphereId: SphereId, state: Partial<SphereRuntimeState>) => void;
  updateAgentState: (agentId: string, state: Partial<AgentRuntimeState>) => void;
  
  // Bulk updates
  setSphereStates: (states: Record<SphereId, SphereRuntimeState>) => void;
  setAgentStates: (states: Record<string, AgentRuntimeState>) => void;
  
  // Reset
  reset: () => void;
}

/**
 * Props du hook
 */
export interface UseVisualEngineProps {
  initialMode?: ViewMode;
  initialFocusedSphereId?: SphereId | null;
  initialSphereStates?: Record<SphereId, SphereRuntimeState>;
  initialAgentStates?: Record<string, AgentRuntimeState>;
}

// -----------------------------------------------------------------------------
// UTILITY FUNCTIONS
// -----------------------------------------------------------------------------

/**
 * Clamp une valeur entre 0 et 1
 */
function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

/**
 * Obtenir la couleur d'état d'un agent
 */
function getAgentStateColor(state: AgentState): string {
  return AGENT_STATE_COLORS[state] || '#6B7280';
}

/**
 * Calculer le niveau d'activité combiné (importance + activité)
 */
function calculateActivityLevel(importance: number, activity: number): number {
  return clamp01(0.5 * importance + 0.5 * activity);
}

// -----------------------------------------------------------------------------
// MAIN HOOK
// -----------------------------------------------------------------------------

export function useVisualEngine(
  props: UseVisualEngineProps = {}
): [VisualEngineState, VisualEngineActions] {
  const {
    initialMode = '3d',
    initialFocusedSphereId = null,
    initialSphereStates,
    initialAgentStates
  } = props;

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [mode, setMode] = useState<ViewMode>(initialMode);
  const [focusedSphereId, setFocusedSphereId] = useState<SphereId | null>(initialFocusedSphereId);
  const [focusedAgentId, setFocusedAgentId] = useState<string | null>(null);
  const [highlightedSphereId, setHighlightedSphereId] = useState<SphereId | null>(null);
  const [hoveredSphereId, setHoveredSphereId] = useState<SphereId | null>(null);

  // Runtime states
  const [sphereStates, setSphereStates] = useState<Record<SphereId, SphereRuntimeState>>(
    initialSphereStates || createDefaultSphereStates()
  );
  
  const [agentStates, setAgentStates] = useState<Record<string, AgentRuntimeState>>(
    initialAgentStates || {}
  );

  // Core is always active
  const coreActive = true;

  // ---------------------------------------------------------------------------
  // COMPUTED: SPHERE VISUAL DATA
  // ---------------------------------------------------------------------------

  const sphereVisualData: SphereVisualData[] = useMemo(() => {
    const modeConfig = VIEW_MODE_CONFIG[mode];
    const maxOrbitLevel = 5;

    return SPHERE_IDS.map((sphereId) => {
      const config = SPHERE_CONFIGS[sphereId];
      const runtime = sphereStates[sphereId] || {
        sphereId,
        activity: 0,
        contentVolume: 0,
        hasNotifications: false,
        notificationCount: 0,
        lastAccessedAt: new Date().toISOString(),
        visualState: 'idle' as const
      };

      // Calculate activity level
      const activityLevel = calculateActivityLevel(config.importance, runtime.activity);

      // Calculate size based on mode, importance, and activity
      const baseSize = config.baseSize || 1;
      const sizeFactor = modeConfig.spheres.sizeFactor;
      const computedSize = baseSize * (0.7 + activityLevel * 0.6) * sizeFactor;

      // Calculate glow intensity
      const isFocused = focusedSphereId === sphereId;
      const isHighlighted = highlightedSphereId === sphereId;
      const isHovered = hoveredSphereId === sphereId;
      
      let computedGlow = clamp01(activityLevel * 0.5);
      if (isFocused) computedGlow = clamp01(computedGlow + 0.3);
      if (isHighlighted) computedGlow = clamp01(computedGlow + 0.15);
      if (isHovered) computedGlow = clamp01(computedGlow + 0.1);

      // Calculate distance from core (normalized)
      const computedDistance = config.orbitLevel / maxOrbitLevel;

      // Calculate angle (can be modified by activity)
      const computedAngle = config.defaultAngle;

      return {
        sphere: config,
        runtime,
        computedSize,
        computedGlow,
        computedDistance,
        computedAngle,
        isFocused,
        isHighlighted,
        isHovered
      };
    });
  }, [mode, sphereStates, focusedSphereId, highlightedSphereId, hoveredSphereId]);

  // ---------------------------------------------------------------------------
  // COMPUTED: AGENT VISUAL DATA
  // ---------------------------------------------------------------------------

  const agentVisualData: AgentVisualData[] = useMemo(() => {
    const modeConfig = VIEW_MODE_CONFIG[mode];
    const agents = Object.values(AGENT_CONFIGS);

    return agents.map((agent) => {
      const runtime = agentStates[agent.id] || createDefaultAgentRuntimeState(agent.id);
      
      // Find parent sphere
      const parentSphere = agent.primarySphere !== 'transversal' 
        ? SPHERE_CONFIGS[agent.primarySphere] 
        : null;

      // Calculate orbit speed based on urgency and mode
      const baseSpeed = agent.orbitSpeed || 0.5;
      const speedFactor = modeConfig.agents.speedFactor;
      const computedOrbitSpeed = baseSpeed * (0.5 + runtime.urgency * 0.5) * speedFactor;

      // Calculate orbit radius based on confidence
      const baseOrbit = agent.orbitRadius || 1;
      const computedOrbitRadius = baseOrbit * runtime.confidence;

      // Get state color
      const stateColor = getAgentStateColor(runtime.state);

      // Is this agent's sphere focused?
      const isFocused = focusedAgentId === agent.id || 
        (parentSphere && focusedSphereId === parentSphere.id);

      return {
        agent,
        runtime,
        parentSphere,
        computedOrbitSpeed,
        computedOrbitRadius,
        stateColor,
        isFocused
      };
    });
  }, [mode, agentStates, focusedSphereId, focusedAgentId]);

  // ---------------------------------------------------------------------------
  // COMPUTED: MINIMAP NODES
  // ---------------------------------------------------------------------------

  const minimapNodes: MinimapNode[] = useMemo(() => {
    const nodes: MinimapNode[] = [];

    // Core node (always first)
    nodes.push({
      id: 'core',
      label: 'CORE',
      emoji: '🌳',
      type: 'core',
      radius: 0,
      angle: 0,
      size: 1,
      activity: 1,
      isCurrent: focusedSphereId === null,
      isPulsing: false
    });

    // Sphere nodes
    const sphereCount = sphereVisualData.length || 1;
    sphereVisualData.forEach((sv, index) => {
      const angle = (index / sphereCount) * Math.PI * 2;
      const activityLevel = calculateActivityLevel(sv.sphere.importance, sv.runtime.activity);

      nodes.push({
        id: sv.sphere.id,
        label: sv.sphere.label,
        emoji: sv.sphere.emoji,
        type: 'sphere',
        radius: 0.3 + sv.computedDistance * 0.5,
        angle,
        size: 0.3 + activityLevel * 0.4,
        activity: activityLevel,
        parentId: 'core',
        isCurrent: focusedSphereId === sv.sphere.id,
        isPulsing: sv.runtime.hasNotifications
      });

      // Agent nodes for this sphere
      const sphereAgents = agentVisualData.filter(
        av => av.parentSphere?.id === sv.sphere.id
      );
      
      sphereAgents.forEach((av, agentIndex) => {
        const agentAngle = angle + ((agentIndex + 1) * (Math.PI / 18)) * (agentIndex % 2 === 0 ? 1 : -1);

        nodes.push({
          id: av.agent.id,
          label: av.agent.label,
          emoji: av.agent.emoji || '🛰️',
          type: 'agent',
          radius: (0.3 + sv.computedDistance * 0.5) + 0.1,
          angle: agentAngle,
          size: 0.15,
          activity: av.runtime.state === 'active' ? 0.8 : 0.3,
          parentId: sv.sphere.id,
          isCurrent: focusedAgentId === av.agent.id,
          isPulsing: av.runtime.state === 'warning'
        });
      });
    });

    return nodes;
  }, [sphereVisualData, agentVisualData, focusedSphereId, focusedAgentId]);

  // ---------------------------------------------------------------------------
  // COMPUTED: METRICS
  // ---------------------------------------------------------------------------

  const totalActivity = useMemo(() => {
    return sphereVisualData.reduce((sum, sv) => sum + sv.runtime.activity, 0) / sphereVisualData.length;
  }, [sphereVisualData]);

  const activeAgentCount = useMemo(() => {
    return agentVisualData.filter(av => av.runtime.state === 'active').length;
  }, [agentVisualData]);

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  const focusSphere = useCallback((sphereId: SphereId | null) => {
    setFocusedSphereId(sphereId);
    if (sphereId) {
      setFocusedAgentId(null);
    }
  }, []);

  const focusAgent = useCallback((agentId: string | null) => {
    setFocusedAgentId(agentId);
    if (agentId) {
      const agent = AGENT_CONFIGS[agentId];
      if (agent && agent.primarySphere !== 'transversal') {
        setFocusedSphereId(agent.primarySphere);
      }
    }
  }, []);

  const highlightSphere = useCallback((sphereId: SphereId | null) => {
    setHighlightedSphereId(sphereId);
  }, []);

  const hoverSphere = useCallback((sphereId: SphereId | null) => {
    setHoveredSphereId(sphereId);
  }, []);

  const updateSphereActivity = useCallback((sphereId: SphereId, activity: number) => {
    setSphereStates(prev => ({
      ...prev,
      [sphereId]: {
        ...prev[sphereId],
        activity: clamp01(activity)
      }
    }));
  }, []);

  const updateSphereState = useCallback((sphereId: SphereId, state: Partial<SphereRuntimeState>) => {
    setSphereStates(prev => ({
      ...prev,
      [sphereId]: {
        ...prev[sphereId],
        ...state
      }
    }));
  }, []);

  const updateAgentState = useCallback((agentId: string, state: Partial<AgentRuntimeState>) => {
    setAgentStates(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        ...state
      }
    }));
  }, []);

  const reset = useCallback(() => {
    setMode('3d');
    setFocusedSphereId(null);
    setFocusedAgentId(null);
    setHighlightedSphereId(null);
    setHoveredSphereId(null);
    setSphereStates(createDefaultSphereStates());
    setAgentStates({});
  }, []);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  const state: VisualEngineState = {
    mode,
    coreActive,
    spheres: sphereVisualData,
    agents: agentVisualData,
    minimapNodes,
    focusedSphereId,
    focusedAgentId,
    highlightedSphereId,
    hoveredSphereId,
    totalActivity,
    activeAgentCount
  };

  const actions: VisualEngineActions = {
    setMode,
    focusSphere,
    focusAgent,
    highlightSphere,
    hoverSphere,
    updateSphereActivity,
    updateSphereState,
    updateAgentState,
    setSphereStates,
    setAgentStates,
    reset
  };

  return [state, actions];
}

// -----------------------------------------------------------------------------
// EXPORT DEFAULT
// -----------------------------------------------------------------------------

export default useVisualEngine;
