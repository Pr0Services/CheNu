/**
 * CHE·NU OS 12.0 — META-KERNEL MANAGER Routes
 * API endpoints for module coordination
 * Version: 12.0
 * 
 * MKM-12 is a SUPERVISOR - it routes, validates, and ensures consistency.
 * It NEVER processes content or makes autonomous decisions.
 */

import { MetaKernelManager } from '../services/MetaKernelManager.js';

export default async function mkmRoutes(fastify, options) {
  const mkm = new MetaKernelManager();

  // GET /mkm - Get MKM superstructure
  fastify.get('/', async (request, reply) => {
    return mkm.getSuperstructure();
  });

  // GET /mkm/modules - Get module registry
  fastify.get('/modules', async (request, reply) => {
    return {
      modules: mkm.getModuleRegistry(),
      mkm_version: '12.0'
    };
  });

  // GET /mkm/routing - Get routing table
  fastify.get('/routing', async (request, reply) => {
    return {
      routing_table: mkm.getRoutingTable(),
      mkm_version: '12.0'
    };
  });

  // GET /mkm/state - Get current state
  fastify.get('/state', async (request, reply) => {
    return {
      ...mkm.getCurrentState(),
      mkm_version: '12.0'
    };
  });

  // POST /mkm/process - Process a request through MKM
  fastify.post('/process', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          action: { type: 'string' },
          content: { type: 'object' },
          target: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = mkm.processRequest(request.body);
      return result;
    } catch (error) {
      return reply.status(400).send({
        error: error.message,
        mkm_version: '12.0'
      });
    }
  });

  // POST /mkm/route - Route a request to appropriate module
  fastify.post('/route', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          action: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const result = mkm.processRequest(request.body);
    return {
      routing: result.routing,
      validation: result.validation,
      mkm_version: '12.0'
    };
  });

  // POST /mkm/validate - Validate a request against LAWBOOK
  fastify.post('/validate', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          content: { type: 'object' },
          embodiment: { type: 'boolean' },
          autonomous: { type: 'boolean' },
          emotion: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    const result = mkm.processRequest(request.body);
    return {
      validation: result.validation,
      safe: result.metadata.safe,
      notes: result.notes,
      mkm_version: '12.0'
    };
  });

  // POST /mkm/consistency - Check state consistency
  fastify.post('/consistency', {
    schema: {
      body: {
        type: 'object',
        properties: {
          rooms: { type: 'array' },
          portals: { type: 'array' },
          panels: { type: 'array' },
          threads: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const result = mkm.checkConsistency(request.body);
    return {
      ...result,
      mkm_version: '12.0'
    };
  });

  // GET /mkm/validation-log - Get validation log
  fastify.get('/validation-log', async (request, reply) => {
    const limit = parseInt(request.query.limit) || 100;
    return {
      log: mkm.getValidationLog(limit),
      mkm_version: '12.0'
    };
  });

  // GET /mkm/export - Export MKM state
  fastify.get('/export', async (request, reply) => {
    return mkm.exportMKM();
  });

  // POST /mkm/safety-check - Check MKM safety compliance
  fastify.post('/safety-check', async (request, reply) => {
    return {
      safety: mkm.validateSafety(),
      mkm_version: '12.0'
    };
  });

  // GET /mkm/pipeline - Get execution pipeline
  fastify.get('/pipeline', async (request, reply) => {
    return {
      pipeline: ['INTENT', 'ROUTE', 'MODULE', 'PANEL', 'OUTPUT'],
      description: {
        INTENT: 'Parse and validate user intent',
        ROUTE: 'Identify correct module for handling',
        MODULE: 'Execute within target module',
        PANEL: 'Render through Interaction Panels',
        OUTPUT: 'Return formatted, safe response'
      },
      mkm_version: '12.0'
    };
  });

  // GET /mkm/decision-map - Get decision map
  fastify.get('/decision-map', async (request, reply) => {
    return {
      decision_map: {
        'spatial': 'UniverseOS (9.0)',
        'timeline': 'Holothreads / UniverseOS',
        'panel': 'UIP-10.5',
        'session': 'USX-11.5',
        'multiuser': 'HOLO-NET (11.0)',
        'compile': 'Holo-Compiler (8.0)',
        'fabric': 'Holo-Fabric (8.5)',
        'interaction': 'Interaction Layer (9.5)',
        'desktop': 'Desktop Mode (10.0)',
        'morphology': 'PXR-3',
        'agent': 'Standard Agent Tools (NOT MKM-12)'
      },
      note: 'MKM-12 NEVER processes content. It only routes logically.',
      mkm_version: '12.0'
    };
  });
}
