/**
 * CHE·NU OS 15.0 — OMNI-WORKSPACE Routes
 * API endpoints for multi-dimensional workspace
 * Version: 15.0
 */

import { OmniWorkspace } from '../services/OmniWorkspace.js';

export default async function owsRoutes(fastify, options) {
  const ows = new OmniWorkspace();

  // GET /ows - Overview
  fastify.get('/', async (request, reply) => {
    return {
      system: 'OWS-15',
      omni_workspaces: ows.list(),
      available_dimensions: ows.getAvailableDimensions(),
      layout_modes: ows.getLayoutModes(),
      ows_version: '15.0'
    };
  });

  // GET /ows/dimensions - List available dimensions
  fastify.get('/dimensions', async (request, reply) => {
    return {
      dimensions: ows.getAvailableDimensions(),
      ows_version: '15.0'
    };
  });

  // GET /ows/layout-modes - List layout modes
  fastify.get('/layout-modes', async (request, reply) => {
    return {
      layout_modes: ows.getLayoutModes(),
      ows_version: '15.0'
    };
  });

  // GET /ows/list - List all omni-workspaces
  fastify.get('/list', async (request, reply) => {
    return {
      omni_workspaces: ows.list(),
      ows_version: '15.0'
    };
  });

  // GET /ows/:id - Get specific omni-workspace
  fastify.get('/:id', async (request, reply) => {
    const workspace = ows.get(request.params.id);
    if (!workspace) {
      return reply.status(404).send({ error: 'Omni-workspace not found' });
    }
    return { omni_workspace: workspace, ows_version: '15.0' };
  });

  // POST /ows/build - OWB_BUILD
  fastify.post('/build', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          dimensions: { type: 'array', items: { type: 'string' } },
          layout_mode: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const result = ows.build(request.body);
    return { ...result, ows_version: '15.0' };
  });

  // POST /ows/:id/dimension - OWB_ADD_DIMENSION
  fastify.post('/:id/dimension', {
    schema: {
      body: {
        type: 'object',
        properties: {
          dimension: { type: 'string' }
        },
        required: ['dimension']
      }
    }
  }, async (request, reply) => {
    try {
      const result = ows.addDimension(request.params.id, request.body.dimension);
      return { ...result, ows_version: '15.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // DELETE /ows/:id/dimension/:dim - OWB_REMOVE_DIMENSION
  fastify.delete('/:id/dimension/:dim', async (request, reply) => {
    try {
      const result = ows.removeDimension(request.params.id, request.params.dim);
      return { ...result, ows_version: '15.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // PUT /ows/:id/layout - OWB_LAYOUT
  fastify.put('/:id/layout', {
    schema: {
      body: {
        type: 'object',
        properties: {
          layout_mode: { type: 'string' }
        },
        required: ['layout_mode']
      }
    }
  }, async (request, reply) => {
    try {
      const result = ows.setLayout(request.params.id, request.body.layout_mode);
      return { ...result, ows_version: '15.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /ows/:id/switch - Switch active dimension
  fastify.post('/:id/switch', {
    schema: {
      body: {
        type: 'object',
        properties: {
          dimension: { type: 'string' }
        },
        required: ['dimension']
      }
    }
  }, async (request, reply) => {
    try {
      const result = ows.switchDimension(request.params.id, request.body.dimension);
      return { ...result, ows_version: '15.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /ows/:id/content - Add content to dimension
  fastify.post('/:id/content', {
    schema: {
      body: {
        type: 'object',
        properties: {
          dimension: { type: 'string' },
          content: { type: 'object' }
        },
        required: ['dimension', 'content']
      }
    }
  }, async (request, reply) => {
    try {
      const result = ows.addToDimension(
        request.params.id, 
        request.body.dimension, 
        request.body.content
      );
      return { ...result, ows_version: '15.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /ows/:id/export - OWB_EXPORT
  fastify.get('/:id/export', async (request, reply) => {
    try {
      const result = ows.export(request.params.id);
      return { ...result, ows_version: '15.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /ows/:id/merge - Merge workspaces into omni-workspace
  fastify.post('/:id/merge', {
    schema: {
      body: {
        type: 'object',
        properties: {
          workspaces: { type: 'array' }
        },
        required: ['workspaces']
      }
    }
  }, async (request, reply) => {
    try {
      const result = ows.mergeWorkspaces(request.params.id, request.body.workspaces);
      return { ...result, ows_version: '15.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // DELETE /ows/:id - Delete omni-workspace
  fastify.delete('/:id', async (request, reply) => {
    try {
      const result = ows.delete(request.params.id);
      return { ...result, ows_version: '15.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // GET /ows/export-all - Export all omni-workspaces
  fastify.get('/export-all', async (request, reply) => {
    return ows.exportAll();
  });

  // POST /ows/safety-check - Validate safety
  fastify.post('/safety-check', async (request, reply) => {
    return {
      safety: ows.validateSafety(),
      ows_version: '15.0'
    };
  });
}
