/**
 * CHE·NU Orchestrator Routes
 * Main dispatch endpoint for task routing
 */

import { ChenuEngine } from '../services/ChenuEngine.js';
import { TaskRouter } from '../services/TaskRouter.js';

export default async function orchestratorRoutes(fastify, options) {
  const engine = new ChenuEngine();
  const router = new TaskRouter();

  // POST /orchestrator/dispatch
  fastify.post('/dispatch', {
    schema: {
      description: 'Dispatch a task to CHE·NU orchestrator',
      body: {
        type: 'object',
        required: ['task'],
        properties: {
          task: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              content: { type: 'string' },
              priority: { type: 'string', enum: ['low', 'medium', 'high'] },
              context: { type: 'object' }
            }
          },
          user_id: { type: 'string' },
          session_id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            agent: { type: 'string' },
            result: { type: 'object' },
            execution_id: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { task, user_id, session_id } = request.body;
    
    // Route task to appropriate agent
    const targetAgent = router.route(task);
    
    // Execute via CHE·NU engine
    const result = await engine.execute({
      task,
      agent: targetAgent,
      user_id,
      session_id
    });
    
    return {
      success: true,
      agent: targetAgent,
      result,
      execution_id: result.execution_id
    };
  });

  // GET /orchestrator/status
  fastify.get('/status', async (request, reply) => {
    return {
      status: 'online',
      system: 'CHE·NU ULTRA PACK',
      agents_available: [
        'nova_prime',
        'architect_omega',
        'thread_weaver',
        'echo_mind',
        'reality_synthesizer',
        'csf_simulator',
        'pxr_engine'
      ],
      lawbook_enforced: true
    };
  });
}
