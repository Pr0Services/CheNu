/* =====================================================
   CHE·NU — useDecisionComparison Hook
   
   React hook for decision comparison functionality.
   ===================================================== */

import { useState, useCallback, useMemo } from 'react';
import { TimelineXREvent } from '../xr/meeting/xrReplay.types';

import {
  DecisionSnapshot,
  DecisionComparisonResult,
  MultiDecisionComparisonResult,
  ComparisonReplayState,
  ReplayMode,
  ComparisonConfig,
  DEFAULT_COMPARISON_STATE,
  DEFAULT_COMPARISON_CONFIG,
} from './decisionComparison.types';

import {
  extractDecisionSnapshot,
  extractAllDecisionSnapshots,
  findDecisionEvents,
} from './extractDecisionSnapshot';

import { compareDecisionSnapshots } from './compareDecisionSnapshots';

import {
  compareMultipleDecisions,
  compareDecisionsByType,
  compareDecisionsInRange,
  compareDecisionsByAgents,
  generateComparisonSummary,
} from './compareMultipleDecisions';

// ─────────────────────────────────────────────────────
// HOOK OPTIONS
// ─────────────────────────────────────────────────────

export interface UseDecisionComparisonOptions {
  events: TimelineXREvent[];
  config?: Partial<ComparisonConfig>;
  initialMode?: ReplayMode;
}

// ─────────────────────────────────────────────────────
// HOOK RETURN
// ─────────────────────────────────────────────────────

export interface UseDecisionComparisonReturn {
  // State
  state: ComparisonReplayState;
  
  // Available decisions
  decisionEvents: TimelineXREvent[];
  
  // Single mode
  selectDecision: (eventId: string) => void;
  clearSelection: () => void;
  
  // Comparison mode
  setLeftDecision: (eventId: string) => void;
  setRightDecision: (eventId: string) => void;
  compareSelected: () => void;
  swapDecisions: () => void;
  
  // Multi mode
  analyzeAll: () => void;
  selectNode: (nodeId: string) => void;
  deselectNode: (nodeId: string) => void;
  clearNodes: () => void;
  
  // Mode control
  setMode: (mode: ReplayMode) => void;
  
  // UI toggles
  toggleDivergences: () => void;
  toggleMetrics: () => void;
  toggleHighlight: () => void;
  
  // Results
  activeSnapshot: DecisionSnapshot | undefined;
  comparisonResult: DecisionComparisonResult | undefined;
  multiResult: MultiDecisionComparisonResult | undefined;
  
  // Summary
  getSummary: () => string;
  
  // Playback (for replay integration)
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  stepForward: () => void;
  stepBack: () => void;
}

// ─────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────

export function useDecisionComparison(
  options: UseDecisionComparisonOptions
): UseDecisionComparisonReturn {
  const {
    events,
    config: configOverride,
    initialMode = 'single',
  } = options;

  // Config
  const config: ComparisonConfig = useMemo(() => ({
    ...DEFAULT_COMPARISON_CONFIG,
    ...configOverride,
  }), [configOverride]);

  // State
  const [state, setState] = useState<ComparisonReplayState>({
    ...DEFAULT_COMPARISON_STATE,
    mode: initialMode,
  });

  // Find decision events
  const decisionEvents = useMemo(
    () => findDecisionEvents(events),
    [events]
  );

  // === SINGLE MODE ===

  const selectDecision = useCallback((eventId: string) => {
    try {
      const snapshot = extractDecisionSnapshot(
        events,
        eventId,
        config.defaultContextWindow,
        config.defaultConsequenceWindow
      );

      setState(prev => ({
        ...prev,
        mode: 'single',
        activeSnapshot: snapshot,
      }));
    } catch (error) {
      console.error('[DecisionComparison] Failed to extract snapshot:', error);
    }
  }, [events, config]);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      activeSnapshot: undefined,
      leftSnapshot: undefined,
      rightSnapshot: undefined,
      comparisonResult: undefined,
    }));
  }, []);

  // === COMPARISON MODE ===

  const setLeftDecision = useCallback((eventId: string) => {
    try {
      const snapshot = extractDecisionSnapshot(
        events,
        eventId,
        config.defaultContextWindow,
        config.defaultConsequenceWindow
      );

      setState(prev => ({
        ...prev,
        mode: 'comparison',
        leftSnapshot: snapshot,
        comparisonResult: undefined,
      }));
    } catch (error) {
      console.error('[DecisionComparison] Failed to extract left snapshot:', error);
    }
  }, [events, config]);

  const setRightDecision = useCallback((eventId: string) => {
    try {
      const snapshot = extractDecisionSnapshot(
        events,
        eventId,
        config.defaultContextWindow,
        config.defaultConsequenceWindow
      );

      setState(prev => ({
        ...prev,
        mode: 'comparison',
        rightSnapshot: snapshot,
        comparisonResult: undefined,
      }));
    } catch (error) {
      console.error('[DecisionComparison] Failed to extract right snapshot:', error);
    }
  }, [events, config]);

  const compareSelected = useCallback(() => {
    if (!state.leftSnapshot || !state.rightSnapshot) {
      console.warn('[DecisionComparison] Both snapshots required for comparison');
      return;
    }

    const result = compareDecisionSnapshots(
      state.leftSnapshot,
      state.rightSnapshot,
      config
    );

    setState(prev => ({
      ...prev,
      comparisonResult: result,
    }));
  }, [state.leftSnapshot, state.rightSnapshot, config]);

  const swapDecisions = useCallback(() => {
    setState(prev => ({
      ...prev,
      leftSnapshot: prev.rightSnapshot,
      rightSnapshot: prev.leftSnapshot,
      comparisonResult: undefined,
    }));
  }, []);

  // === MULTI MODE ===

  const analyzeAll = useCallback(() => {
    const result = compareMultipleDecisions(events, config);

    setState(prev => ({
      ...prev,
      mode: 'multi',
      multiResult: result,
      selectedNodes: [],
    }));
  }, [events, config]);

  const selectNode = useCallback((nodeId: string) => {
    setState(prev => ({
      ...prev,
      selectedNodes: [...prev.selectedNodes, nodeId],
    }));
  }, []);

  const deselectNode = useCallback((nodeId: string) => {
    setState(prev => ({
      ...prev,
      selectedNodes: prev.selectedNodes.filter(id => id !== nodeId),
    }));
  }, []);

  const clearNodes = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedNodes: [],
    }));
  }, []);

  // === MODE CONTROL ===

  const setMode = useCallback((mode: ReplayMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  // === UI TOGGLES ===

  const toggleDivergences = useCallback(() => {
    setState(prev => ({ ...prev, showDivergences: !prev.showDivergences }));
  }, []);

  const toggleMetrics = useCallback(() => {
    setState(prev => ({ ...prev, showMetrics: !prev.showMetrics }));
  }, []);

  const toggleHighlight = useCallback(() => {
    setState(prev => ({ ...prev, highlightDifferences: !prev.highlightDifferences }));
  }, []);

  // === SUMMARY ===

  const getSummary = useCallback((): string => {
    if (state.multiResult) {
      return generateComparisonSummary(state.multiResult);
    }

    if (state.comparisonResult) {
      const { analysis, similarityScore } = state.comparisonResult;
      return `${analysis.summary}\n\nSimilarité: ${Math.round(similarityScore * 100)}%`;
    }

    if (state.activeSnapshot) {
      return `Décision: ${state.activeSnapshot.decisionEvent.summary}\n` +
             `Contexte: ${state.activeSnapshot.contextEvents.length} événements\n` +
             `Conséquences: ${state.activeSnapshot.consequenceEvents.length} événements`;
    }

    return 'Sélectionnez une décision pour commencer l\'analyse.';
  }, [state]);

  // === PLAYBACK ===

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  const stepForward = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: Math.min(
        prev.currentIndex + 1,
        (state.activeSnapshot?.contextEvents.length || 0) +
        (state.activeSnapshot?.consequenceEvents.length || 0)
      ),
    }));
  }, [state.activeSnapshot]);

  const stepBack = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - 1, 0),
    }));
  }, []);

  return {
    state,
    decisionEvents,
    selectDecision,
    clearSelection,
    setLeftDecision,
    setRightDecision,
    compareSelected,
    swapDecisions,
    analyzeAll,
    selectNode,
    deselectNode,
    clearNodes,
    setMode,
    toggleDivergences,
    toggleMetrics,
    toggleHighlight,
    activeSnapshot: state.activeSnapshot,
    comparisonResult: state.comparisonResult,
    multiResult: state.multiResult,
    getSummary,
    play,
    pause,
    setSpeed,
    stepForward,
    stepBack,
  };
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default useDecisionComparison;
