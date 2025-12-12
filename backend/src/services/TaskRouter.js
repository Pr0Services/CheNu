/**
 * CHE·NU Task Router
 * Routes tasks to appropriate agents (core + specialized)
 */

import { SpecializedRouter } from './SpecializedRouter.js';

export class TaskRouter {
  constructor() {
    this.specializedRouter = new SpecializedRouter();
    
    // Core agent routes
    this.coreRoutes = [
      { condition: (task) => task.type === 'workflow', agent: 'architect_omega' },
      { condition: (task) => task.type === 'schema', agent: 'architect_omega' },
      { condition: (task) => task.type === 'db_design', agent: 'architect_omega' },
      { condition: (task) => task.type === 'timeline', agent: 'thread_weaver' },
      { condition: (task) => task.type === 'history', agent: 'thread_weaver' },
      { condition: (task) => task.type === 'roadmap', agent: 'thread_weaver' },
      { condition: (task) => task.type === 'simulation', agent: 'csf_simulator' },
      { condition: (task) => task.type === 'scenario', agent: 'csf_simulator' },
      { condition: (task) => task.type === 'decision_tree', agent: 'csf_simulator' },
      { condition: (task) => task.type === 'xr', agent: 'reality_synthesizer' },
      { condition: (task) => task.type === 'xr_scene', agent: 'reality_synthesizer' },
      { condition: (task) => task.type === 'universe_view', agent: 'reality_synthesizer' },
      { condition: (task) => task.type === 'tone', agent: 'echo_mind' },
      { condition: (task) => task.type === 'rewrite', agent: 'echo_mind' },
      { condition: (task) => task.type === 'ux_copy', agent: 'echo_mind' },
      { condition: (task) => task.type === 'persona', agent: 'pxr_engine' },
      { condition: (task) => task.type === 'avatars', agent: 'pxr_engine' },
      { condition: (task) => task.type === 'group_xr', agent: 'pxr_engine' }
    ];
  }

  /**
   * Route a task to the appropriate agent
   * Priority: specialized agents > core agents > nova_prime
   */
  route(task) {
    if (!task) return 'nova_prime';

    // 1. Check specialized agents first (by domain)
    const specializedAgent = this.specializedRouter.route(task);
    if (specializedAgent) {
      return specializedAgent;
    }

    // 2. Check core agents (by type)
    if (task.type) {
      for (const route of this.coreRoutes) {
        if (route.condition(task)) {
          return route.agent;
        }
      }
    }

    // 3. Default to Nova Prime
    return 'nova_prime';
  }

  /**
   * Get all available agents (core + specialized)
   */
  getAllAgents() {
    const coreAgents = [
      { id: 'nova_prime', name: 'Nova Prime', role: 'Global Orchestrator', sphere: 'meta' },
      { id: 'architect_omega', name: 'Architect Ω', role: 'Structure & Workflows', sphere: 'meta' },
      { id: 'thread_weaver', name: 'Thread Weaver ∞', role: 'Timeline & Threads', sphere: 'meta' },
      { id: 'echo_mind', name: 'EchoMind', role: 'Tone & Neutrality', sphere: 'meta' },
      { id: 'reality_synthesizer', name: 'Reality Synthesizer', role: 'XR / Spatial', sphere: 'xr' },
      { id: 'csf_simulator', name: 'CSF Simulator', role: 'Scenario Simulation', sphere: 'meta' },
      { id: 'pxr_engine', name: 'PXR Engine', role: 'Personas & Avatars', sphere: 'xr' }
    ];
    
    const specializedAgents = this.specializedRouter.listAgents();
    
    return {
      core: coreAgents,
      specialized: specializedAgents
    };
  }

  /**
   * Get routing rules summary
   */
  getRoutingRules() {
    return {
      priority: [
        '1. Specialized agents (by domain)',
        '2. Core agents (by type)',
        '3. Nova Prime (default)'
      ],
      domains: ['marketing', 'sales', 'data', 'legal', 'finance', 'construction', 'creative'],
      types: ['workflow', 'timeline', 'simulation', 'xr', 'tone', 'persona', 'schema']
    };
  }
}

// Standalone function
export function routeTask(task) {
  const router = new TaskRouter();
  return router.route(task);
}

export default TaskRouter;
