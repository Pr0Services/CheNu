/**
 * CHE·NU Agents Routes
 * Direct agent execution endpoints
 */

import { ChenuEngine } from '../services/ChenuEngine.js';

export default async function agentsRoutes(fastify, options) {
  const engine = new ChenuEngine();

  // POST /agents/:id/execute
  fastify.post('/:id/execute', {
    schema: {
      description: 'Execute a specific agent',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          input: { type: 'object' },
          context: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const { input, context } = request.body;
    
    const result = await engine.executeAgent(id, input, context);
    
    return {
      success: true,
      agent: id,
      result,
      timestamp: new Date().toISOString()
    };
  });

  // GET /agents
  fastify.get('/', async (request, reply) => {
    return {
      agents: [
        {
          id: 'nova_prime',
          role: 'Global Orchestrator',
          status: 'active'
        },
        {
          id: 'architect_omega',
          role: 'Structure & Workflows',
          status: 'active'
        },
        {
          id: 'thread_weaver',
          role: 'Timeline & Threads',
          status: 'active'
        },
        {
          id: 'echo_mind',
          role: 'Tone & emotional neutrality',
          status: 'active'
        },
        {
          id: 'reality_synthesizer',
          role: 'XR / spatial logic',
          status: 'active'
        },
        {
          id: 'csf_simulator',
          role: 'Scenario & outcome simulation',
          status: 'active'
        },
        {
          id: 'pxr_engine',
          role: 'Personas & avatars',
          status: 'active'
        }
      ]
    };
  });
}
