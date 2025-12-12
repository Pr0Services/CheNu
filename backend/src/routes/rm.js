/**
 * CHE·NU OS 12.5 — RESOURCE MANAGER Routes
 * API endpoints for conceptual resource dashboard
 * Version: 12.5
 * 
 * RM-12.5 is a "Resource Dashboard," not a kernel.
 * All operations are USER-CONTROLLED only.
 */

import { ResourceManager } from '../services/ResourceManager.js';

export default async function rmRoutes(fastify, options) {
  const rm = new ResourceManager();

  // GET /rm - Get Resource Dashboard
  fastify.get('/', async (request, reply) => {
    return rm.getResourceDashboard();
  });

  // GET /rm/counts - Get resource counts
  fastify.get('/counts', async (request, reply) => {
    return {
      counts: rm.getCounts(),
      rm_version: '12.5'
    };
  });

  // GET /rm/operations - Get available operations
  fastify.get('/operations', async (request, reply) => {
    return {
      operations: rm.getAvailableOperations(),
      rm_version: '12.5'
    };
  });

  // GET /rm/types - Get resource types
  fastify.get('/types', async (request, reply) => {
    return {
      types: rm.resourceTypes,
      rm_version: '12.5'
    };
  });

  // POST /rm/resources - Create a resource
  fastify.post('/resources', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          label: { type: 'string' },
          linked_to: { type: 'array' }
        },
        required: ['type']
      }
    }
  }, async (request, reply) => {
    try {
      const resource = rm.createResource(request.body.type, request.body);
      return { resource, operation: 'SRO_CREATE', rm_version: '12.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /rm/list - SRO_LIST - List all resources
  fastify.get('/list', async (request, reply) => {
    const { type, status } = request.query;
    const resources = rm.listResources(type, status);
    return { resources, operation: 'SRO_LIST', rm_version: '12.5' };
  });

  // GET /rm/list/:type - SRO_LIST by type
  fastify.get('/list/:type', async (request, reply) => {
    const resources = rm.listResources(request.params.type, request.query.status);
    return { resources, operation: 'SRO_LIST', rm_version: '12.5' };
  });

  // GET /rm/resource/:type/:id - Get specific resource
  fastify.get('/resource/:type/:id', async (request, reply) => {
    const resource = rm.getResource(request.params.type, request.params.id);
    if (!resource) {
      return reply.status(404).send({ error: 'Resource not found' });
    }
    return { resource, rm_version: '12.5' };
  });

  // POST /rm/open/:type/:id - SRO_OPEN
  fastify.post('/open/:type/:id', async (request, reply) => {
    try {
      const resource = rm.openResource(request.params.type, request.params.id);
      return { resource, operation: 'SRO_OPEN', rm_version: '12.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /rm/close/:type/:id - SRO_CLOSE
  fastify.post('/close/:type/:id', async (request, reply) => {
    try {
      const resource = rm.closeResource(request.params.type, request.params.id);
      return { resource, operation: 'SRO_CLOSE', rm_version: '12.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /rm/suspend/:type/:id - SRO_SUSPEND
  fastify.post('/suspend/:type/:id', async (request, reply) => {
    try {
      const resource = rm.suspendResource(request.params.type, request.params.id);
      return { resource, operation: 'SRO_SUSPEND', rm_version: '12.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /rm/archive/:type/:id - SRO_ARCHIVE
  fastify.post('/archive/:type/:id', async (request, reply) => {
    try {
      const resource = rm.archiveResource(request.params.type, request.params.id);
      return { resource, operation: 'SRO_ARCHIVE', rm_version: '12.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /rm/clear/:type - SRO_CLEAR
  fastify.post('/clear/:type', async (request, reply) => {
    try {
      const result = rm.clearUnused(request.params.type);
      return { ...result, operation: 'SRO_CLEAR', rm_version: '12.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /rm/link - SRO_LINK
  fastify.post('/link', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type1: { type: 'string' },
          id1: { type: 'string' },
          type2: { type: 'string' },
          id2: { type: 'string' }
        },
        required: ['type1', 'id1', 'type2', 'id2']
      }
    }
  }, async (request, reply) => {
    try {
      const { type1, id1, type2, id2 } = request.body;
      const result = rm.linkResources(type1, id1, type2, id2);
      return { ...result, operation: 'SRO_LINK', rm_version: '12.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /rm/unlink - SRO_UNLINK
  fastify.post('/unlink', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type1: { type: 'string' },
          id1: { type: 'string' },
          type2: { type: 'string' },
          id2: { type: 'string' }
        },
        required: ['type1', 'id1', 'type2', 'id2']
      }
    }
  }, async (request, reply) => {
    try {
      const { type1, id1, type2, id2 } = request.body;
      const result = rm.unlinkResources(type1, id1, type2, id2);
      return { ...result, operation: 'SRO_UNLINK', rm_version: '12.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /rm/overload - Check for overload (SUGGESTIONS only)
  fastify.get('/overload', async (request, reply) => {
    return rm.checkOverload();
  });

  // GET /rm/log - Get operation log
  fastify.get('/log', async (request, reply) => {
    const limit = parseInt(request.query.limit) || 100;
    return {
      log: rm.getOperationLog(limit),
      rm_version: '12.5'
    };
  });

  // GET /rm/export - Export RM state
  fastify.get('/export', async (request, reply) => {
    return rm.exportRM();
  });

  // POST /rm/safety-check - Validate safety
  fastify.post('/safety-check', async (request, reply) => {
    return {
      safety: rm.validateSafety(),
      rm_version: '12.5'
    };
  });

  // DELETE /rm/clear-all - Clear all resources (user-initiated)
  fastify.delete('/clear-all', async (request, reply) => {
    const result = rm.clearAll();
    return { ...result, rm_version: '12.5' };
  });
}
