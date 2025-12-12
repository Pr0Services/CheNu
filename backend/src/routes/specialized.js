/**
 * CHE·NU Specialized Agents Routes
 * API endpoints for platform-specific agents
 * Version: ULTRA 8.0
 */

import { SpecializedRouter } from '../services/SpecializedRouter.js';

export default async function specializedRoutes(fastify, options) {
  const router = new SpecializedRouter();

  // GET /specialized/agents - List all specialized agents
  fastify.get('/agents', {
    schema: {
      description: 'List all specialized agents',
      response: {
        200: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            agents: { type: 'array' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const agents = router.getAllAgents();
    return {
      total: agents.length,
      agents: agents.map(a => ({
        id: a.id,
        name: a.name,
        platform: a.platform,
        sphere: a.sphere,
        role: a.role
      }))
    };
  });

  // GET /specialized/agents/:id - Get specific agent details
  fastify.get('/agents/:id', async (request, reply) => {
    const { id } = request.params;
    const agent = router.getAgent(id);
    
    if (!agent) {
      return reply.status(404).send({ error: 'Agent not found' });
    }
    
    return { agent };
  });

  // GET /specialized/sphere/:sphere - Get agents by sphere
  fastify.get('/sphere/:sphere', async (request, reply) => {
    const { sphere } = request.params;
    const agents = router.getAgentsBySphere(sphere);
    
    return {
      sphere,
      count: agents.length,
      agents: agents.map(a => ({
        id: a.id,
        name: a.name,
        platform: a.platform,
        role: a.role
      }))
    };
  });

  // GET /specialized/platform/:platform - Get agents by platform
  fastify.get('/platform/:platform', async (request, reply) => {
    const { platform } = request.params;
    const agents = router.getAgentsByPlatform(platform);
    
    return {
      platform,
      count: agents.length,
      agents: agents.map(a => ({
        id: a.id,
        name: a.name,
        sphere: a.sphere,
        role: a.role
      }))
    };
  });

  // POST /specialized/route - Route a task to appropriate agent
  fastify.post('/route', {
    schema: {
      description: 'Route task to appropriate specialized agent',
      body: {
        type: 'object',
        properties: {
          platform: { type: 'string' },
          type: { type: 'string' },
          sphere: { type: 'string' },
          content: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const task = request.body;
    const agent = router.route(task);
    
    return {
      routed_to: agent.id,
      agent_name: agent.name,
      platform: agent.platform,
      sphere: agent.sphere,
      role: agent.role,
      task_received: task
    };
  });

  // POST /specialized/execute/:id - Execute specific agent
  fastify.post('/execute/:id', {
    schema: {
      description: 'Execute a specific specialized agent',
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
    
    try {
      const result = await router.execute(id, input, context);
      return { success: true, result };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // GET /specialized/construction - Quebec construction agents
  fastify.get('/construction', async (request, reply) => {
    const constructionAgents = [
      router.getAgent('rbq_compliance_agent'),
      router.getAgent('cnesst_safety_agent'),
      router.getAgent('ccq_labor_agent')
    ].filter(Boolean);

    return {
      domain: 'Quebec Construction',
      regulations: ['RBQ', 'CNESST', 'CCQ'],
      agents: constructionAgents.map(a => ({
        id: a.id,
        name: a.name,
        role: a.role,
        platform: a.platform
      }))
    };
  });

  // GET /specialized/llm - LLM provider agents
  fastify.get('/llm', async (request, reply) => {
    const llmAgents = [
      router.getAgent('llm_claude_agent'),
      router.getAgent('llm_openai_agent'),
      router.getAgent('llm_gemini_agent'),
      router.getAgent('llm_ollama_agent')
    ].filter(Boolean);

    return {
      domain: 'LLM Providers',
      routing: {
        complex_reasoning: 'llm_claude_agent',
        fast_execution: 'llm_openai_agent',
        multimodal: 'llm_gemini_agent',
        private: 'llm_ollama_agent'
      },
      agents: llmAgents.map(a => ({
        id: a.id,
        name: a.name,
        role: a.role,
        platform: a.platform
      }))
    };
  });

  // GET /specialized/xr - XR platform agents
  fastify.get('/xr', async (request, reply) => {
    const xrAgents = [
      router.getAgent('unity_xr_agent'),
      router.getAgent('unreal_xr_agent'),
      router.getAgent('threejs_web_agent'),
      router.getAgent('xr_meeting_agent')
    ].filter(Boolean);

    return {
      domain: 'XR Platforms',
      platforms: ['Unity', 'Unreal Engine', 'Three.js', 'CHE·NU XR'],
      agents: xrAgents.map(a => ({
        id: a.id,
        name: a.name,
        role: a.role,
        platform: a.platform
      }))
    };
  });
}
