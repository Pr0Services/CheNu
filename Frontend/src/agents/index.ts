/* =====================================================
   CHE·NU — Agents Index
   
   PHASE 4: INFLUENCE & ORCHESTRATION AGENTS
   
   PUBLIC API
   ──────────
   This module exports:
   - Types for agent inputs/outputs
   - The AgentEngine for execution
   - Individual agents for direct use
   - Utility functions
   
   USAGE EXAMPLE
   ─────────────
   ```typescript
   import { 
     createAgentEngine, 
     runAllAgents,
     SystemContext 
   } from '@/agents';
   
   const engine = createAgentEngine();
   const outputs = await runAllAgents(
     engine, context, dimensions, nodes, timeline
   );
   
   // Process outputs (proposals, signals, etc.)
   for (const output of outputs) {
     console.log(`[${output.agentId}] ${output.type}:`, output.payload);
   }
   ```
   
   KEY PRINCIPLE
   ─────────────
   All agent outputs are PROPOSALS, not COMMANDS.
   The consuming code decides what to do with them.
   ===================================================== */

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export type {
  // Agent identity
  AgentId,
  AgentDefinition,
  Agent,
  ObservationType,
  OutputType,
  
  // Inputs
  AgentInput,
  AgentConfig,
  SystemContext,
  TimelineEvent,
  EventType,
  EventSource,
  ResolvedDimensionSnapshot,
  UniverseNodeSnapshot,
  
  // Outputs
  AgentOutput,
  AgentOutputType,
  OutputTarget,
  TargetType,
  TargetScope,
  OutputPayload,
  SignalPayload,
  SignalType,
  RecommendationPayload,
  RecommendedAction,
  ImpactAssessment,
  ProposalPayload,
  ProposalType,
  ProposedChange,
  EnrichmentPayload,
  EnrichmentType,
  ValidationResult,
  
  // Orchestration
  ExecutionPlan,
  ExecutionStage,
  ContinueCondition,
  ExecutionResult,
  ExecutionError,
} from './types';

// ─────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────

export {
  DEFAULT_AGENT_CONFIG,
  PRIORITY,
  TTL,
  generateOutputId,
} from './types';

// ─────────────────────────────────────────────────────
// BASE AGENT
// ─────────────────────────────────────────────────────

export { BaseAgent } from './BaseAgent';

// ─────────────────────────────────────────────────────
// AGENTS
// ─────────────────────────────────────────────────────

export { OrchestratorAgent } from './OrchestratorAgent';
export { MethodologyAgent } from './MethodologyAgent';
export { DecisionEvaluationAgent } from './DecisionEvaluationAgent';
export { MemoryRecallAgent } from './MemoryRecallAgent';

// ─────────────────────────────────────────────────────
// ENGINE
// ─────────────────────────────────────────────────────

export {
  AgentEngine,
  createAgentEngine,
  runAllAgents,
  getAgent,
  getAgentIds,
  getAgentDefinitions,
} from './AgentEngine';

// ─────────────────────────────────────────────────────
// QUICK START HELPERS
// ─────────────────────────────────────────────────────

import { SystemContext, TimelineEvent, ResolvedDimensionSnapshot, UniverseNodeSnapshot } from './types';

/**
 * Create a minimal system context for testing/demos.
 */
export function createMinimalContext(): SystemContext {
  const now = Date.now();
  return {
    timestamp: now,
    session: {
      id: `session-${now}`,
      startedAt: now - 300000, // 5 min ago
      interactionCount: 10,
      lastActivityMs: 1000,
    },
    focus: {
      sphereId: null,
      depth: 0,
      viewMode: 'universe',
    },
    activity: {
      totalActions: 10,
      actionsPerMinute: 2,
      pendingDecisions: 3,
      activeProcesses: 2,
    },
    health: {
      agentsActive: 4,
      agentsIdle: 0,
      errorCount: 0,
      lastErrorAt: null,
    },
  };
}

/**
 * Create sample timeline events for testing/demos.
 */
export function createSampleTimeline(): TimelineEvent[] {
  const now = Date.now();
  return [
    {
      id: 'evt-1',
      timestamp: now - 120000,
      type: 'navigation',
      source: 'user',
      payload: { to: 'business' },
      sphereId: 'business',
    },
    {
      id: 'evt-2',
      timestamp: now - 90000,
      type: 'interaction',
      source: 'user',
      payload: { action: 'click' },
      sphereId: 'business',
    },
    {
      id: 'evt-3',
      timestamp: now - 60000,
      type: 'decision-pending',
      source: 'system',
      payload: { type: 'approval' },
      sphereId: 'business',
    },
    {
      id: 'evt-4',
      timestamp: now - 30000,
      type: 'navigation',
      source: 'user',
      payload: { to: 'creative' },
      sphereId: 'creative',
    },
    {
      id: 'evt-5',
      timestamp: now - 10000,
      type: 'interaction',
      source: 'user',
      payload: { action: 'view' },
      sphereId: 'creative',
    },
  ];
}

/**
 * Create sample dimension snapshots for testing/demos.
 */
export function createSampleDimensions(): Map<string, ResolvedDimensionSnapshot> {
  const now = Date.now();
  return new Map([
    ['business-node', {
      nodeId: 'business-node',
      sphereId: 'business',
      scale: 1.2,
      visibility: 1.0,
      activityState: 'active',
      contentLevel: 'medium',
      density: 'standard',
      motion: 'subtle',
      interactable: true,
      depth: 0,
      capturedAt: now,
    }],
    ['creative-node', {
      nodeId: 'creative-node',
      sphereId: 'creative',
      scale: 1.0,
      visibility: 0.8,
      activityState: 'idle',
      contentLevel: 'low',
      density: 'compact',
      motion: 'none',
      interactable: true,
      depth: 0,
      capturedAt: now,
    }],
  ]);
}

/**
 * Create sample universe nodes for testing/demos.
 */
export function createSampleNodes(): UniverseNodeSnapshot[] {
  const now = Date.now();
  return [
    {
      id: 'business-node',
      type: 'sphere',
      sphereId: 'business',
      parentId: 'trunk',
      position: { layer: 'core', angle: 0 },
      metrics: {
        items: 15,
        agents: 5,
        activeProcesses: 2,
        pendingDecisions: 3,
      },
      capturedAt: now,
    },
    {
      id: 'creative-node',
      type: 'sphere',
      sphereId: 'creative',
      parentId: 'trunk',
      position: { layer: 'core', angle: 90 },
      metrics: {
        items: 8,
        agents: 3,
        activeProcesses: 0,
        pendingDecisions: 0,
      },
      capturedAt: now,
    },
  ];
}
