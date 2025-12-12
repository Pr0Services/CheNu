/**
 * CHE·NU PXR-3 — Morphology Routes
 * API endpoints for avatar morphology and neutral expressions
 * Version: 3.0
 */

import { MorphologyEngine } from '../services/MorphologyEngine.js';

export default async function morphologyRoutes(fastify, options) {
  const engine = new MorphologyEngine();

  // GET /morphology/avatar/:agentId - Get avatar morphology
  fastify.get('/avatar/:agentId', {
    schema: {
      description: 'Get morphology profile for an agent',
      params: {
        type: 'object',
        properties: {
          agentId: { type: 'string' }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          context: { type: 'string', default: 'default' }
        }
      }
    }
  }, async (request, reply) => {
    const { agentId } = request.params;
    const { context } = request.query;
    
    const morphology = engine.generateMorphology(agentId, context);
    const validation = engine.validateSafety(morphology);
    
    return {
      morphology,
      validation,
      pxr_version: '3.0'
    };
  });

  // POST /morphology/avatar/:agentId/expression - Apply neutral expression
  fastify.post('/avatar/:agentId/expression', {
    schema: {
      description: 'Apply neutral expression to avatar',
      body: {
        type: 'object',
        properties: {
          expression: { type: 'string' },
          context: { type: 'string', default: 'default' }
        },
        required: ['expression']
      }
    }
  }, async (request, reply) => {
    const { agentId } = request.params;
    const { expression, context } = request.body;
    
    let morphology = engine.generateMorphology(agentId, context);
    morphology = engine.applyNeutralExpression(morphology, expression);
    const validation = engine.validateSafety(morphology);
    
    if (!validation.valid) {
      return reply.status(400).send({
        error: 'Safety violation',
        violations: validation.violations
      });
    }
    
    return {
      morphology,
      expression_applied: expression,
      validation,
      pxr_version: '3.0'
    };
  });

  // GET /morphology/group - Generate group morphology
  fastify.get('/group', {
    schema: {
      description: 'Generate group morphology for multiple agents',
      querystring: {
        type: 'object',
        properties: {
          agents: { type: 'string', description: 'Comma-separated agent IDs' },
          context: { type: 'string', default: 'planning' }
        },
        required: ['agents']
      }
    }
  }, async (request, reply) => {
    const { agents, context } = request.query;
    const agentIds = agents.split(',').map(a => a.trim());
    
    const group = engine.generateGroupMorphology(agentIds, context);
    
    return {
      group,
      pxr_version: '3.0'
    };
  });

  // GET /morphology/export/:agentId - Export for Holo-Compiler 8.0
  fastify.get('/export/:agentId', {
    schema: {
      description: 'Export avatar morphology for Holo-Compiler 8.0',
      querystring: {
        type: 'object',
        properties: {
          context: { type: 'string', default: 'default' },
          expression: { type: 'string', default: 'neutral' }
        }
      }
    }
  }, async (request, reply) => {
    const { agentId } = request.params;
    const { context, expression } = request.query;
    
    const exported = engine.exportForHoloCompiler(agentId, context, expression);
    
    return {
      ...exported,
      export_format: 'HCE_8.0',
      pxr_version: '3.0'
    };
  });

  // GET /morphology/export-group - Export group for Holo-Compiler 8.0
  fastify.get('/export-group', {
    schema: {
      description: 'Export group morphology for Holo-Compiler 8.0',
      querystring: {
        type: 'object',
        properties: {
          agents: { type: 'string', description: 'Comma-separated agent IDs' },
          context: { type: 'string', default: 'planning' }
        },
        required: ['agents']
      }
    }
  }, async (request, reply) => {
    const { agents, context } = request.query;
    const agentIds = agents.split(',').map(a => a.trim());
    
    const exported = engine.exportGroupForHoloCompiler(agentIds, context);
    
    return {
      ...exported,
      export_format: 'HCE_8.0',
      pxr_version: '3.0'
    };
  });

  // GET /morphology/expressions - List available expressions
  fastify.get('/expressions', {
    schema: {
      description: 'List all available neutral expressions'
    }
  }, async (request, reply) => {
    const expressions = engine.getAvailableExpressions();
    
    return {
      expressions,
      note: 'All expressions are symbolic and non-emotional',
      safety: {
        emotional_expressions: false,
        autonomous_behavior: false,
        human_mimicry: false
      },
      pxr_version: '3.0'
    };
  });

  // GET /morphology/contexts - List available context modes
  fastify.get('/contexts', {
    schema: {
      description: 'List all available context morphing modes'
    }
  }, async (request, reply) => {
    const contexts = engine.getContextModes();
    
    return {
      contexts,
      pxr_version: '3.0'
    };
  });

  // POST /morphology/validate - Validate morphology safety
  fastify.post('/validate', {
    schema: {
      description: 'Validate morphology against PXR-3 safety rules',
      body: {
        type: 'object'
      }
    }
  }, async (request, reply) => {
    const morphology = request.body;
    const validation = engine.validateSafety(morphology);
    
    return {
      validation,
      lawbook_compliant: validation.lawbook_compliant,
      pxr_version: '3.0'
    };
  });

  // GET /morphology/core-agents - Get all core agent morphologies
  fastify.get('/core-agents', {
    schema: {
      description: 'Get morphologies for all core CHE·NU agents'
    }
  }, async (request, reply) => {
    const coreAgents = [
      'nova_prime',
      'architect_omega',
      'weaver_infinity',
      'echo_mind',
      'reality_synthesizer',
      'csf_simulator',
      'pxr_engine'
    ];

    const morphologies = coreAgents.map(id => ({
      agent_id: id,
      morphology: engine.generateMorphology(id)
    }));

    return {
      core_agents: morphologies,
      total: morphologies.length,
      pxr_version: '3.0'
    };
  });

  // GET /morphology/scene/:sceneType - Generate complete scene
  fastify.get('/scene/:sceneType', {
    schema: {
      description: 'Generate complete XR scene with placed avatars'
    }
  }, async (request, reply) => {
    const { sceneType } = request.params;
    
    // Default scenes
    const sceneConfigs = {
      meeting: {
        agents: ['nova_prime', 'architect_omega', 'weaver_infinity'],
        context: 'planning'
      },
      brainstorm: {
        agents: ['nova_prime', 'echo_mind', 'reality_synthesizer'],
        context: 'brainstorm'
      },
      decision: {
        agents: ['nova_prime', 'architect_omega', 'csf_simulator'],
        context: 'decision'
      },
      simulation: {
        agents: ['csf_simulator', 'reality_synthesizer', 'weaver_infinity'],
        context: 'simulation'
      },
      full_team: {
        agents: ['nova_prime', 'architect_omega', 'weaver_infinity', 'echo_mind', 'reality_synthesizer', 'csf_simulator', 'pxr_engine'],
        context: 'planning'
      }
    };

    const config = sceneConfigs[sceneType] || sceneConfigs.meeting;
    const group = engine.generateGroupMorphology(config.agents, config.context);
    const exported = engine.exportGroupForHoloCompiler(config.agents, config.context);

    return {
      scene_type: sceneType,
      ...group,
      hce_export: exported,
      pxr_version: '3.0'
    };
  });
}
