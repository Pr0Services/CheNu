/**
 * CHE·NU OS 14.0 — WORKBENCH Routes
 * API endpoints for workspace building
 * Version: 14.0
 * 
 * WB-14 ONLY builds structures requested by the user.
 */

import { Workbench } from '../services/Workbench.js';

export default async function wbRoutes(fastify, options) {
  const wb = new Workbench();

  // GET /wb - Get Workbench overview
  fastify.get('/', async (request, reply) => {
    return {
      system: 'WB-14',
      operations: wb.getOperations(),
      presets: wb.getPresets(),
      workspaces: wb.listWorkspaces(),
      user_controlled: true,
      wb_version: '14.0'
    };
  });

  // GET /wb/operations - Get available operations
  fastify.get('/operations', async (request, reply) => {
    return {
      operations: wb.getOperations(),
      wb_version: '14.0'
    };
  });

  // GET /wb/presets - Get available presets
  fastify.get('/presets', async (request, reply) => {
    return {
      presets: wb.getPresets(),
      note: 'Presets are ONLY loaded on explicit user request',
      wb_version: '14.0'
    };
  });

  // GET /wb/workspaces - List all workspaces
  fastify.get('/workspaces', async (request, reply) => {
    return {
      workspaces: wb.listWorkspaces(),
      wb_version: '14.0'
    };
  });

  // GET /wb/workspace/:id - Get specific workspace
  fastify.get('/workspace/:id', async (request, reply) => {
    const workspace = wb.getWorkspace(request.params.id);
    if (!workspace) {
      return reply.status(404).send({ error: 'Workspace not found' });
    }
    return { workspace, wb_version: '14.0' };
  });

  // POST /wb/create - WBO_CREATE
  fastify.post('/create', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          mode: { type: 'string' },
          layout: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const result = wb.createWorkspace(request.body);
    return { ...result, wb_version: '14.0' };
  });

  // POST /wb/workspace/:id/panel - WBO_ADD_PANEL
  fastify.post('/workspace/:id/panel', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          title: { type: 'string' },
          state: { type: 'string' },
          position: { type: 'object' },
          size: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = wb.addPanel(request.params.id, request.body);
      return { ...result, wb_version: '14.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /wb/workspace/:id/room - WBO_ADD_ROOM
  fastify.post('/workspace/:id/room', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          position: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = wb.addRoom(request.params.id, request.body);
      return { ...result, wb_version: '14.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /wb/workspace/:id/timeline - WBO_ADD_TIMELINE
  fastify.post('/workspace/:id/timeline', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          segments: { type: 'array' },
          collapsed: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = wb.addTimeline(request.params.id, request.body);
      return { ...result, wb_version: '14.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /wb/workspace/:id/cluster - WBO_ADD_CLUSTER
  fastify.post('/workspace/:id/cluster', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          nodes: { type: 'array' },
          position: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = wb.addCluster(request.params.id, request.body);
      return { ...result, wb_version: '14.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // PUT /wb/workspace/:id/layout - WBO_LAYOUT
  fastify.put('/workspace/:id/layout', {
    schema: {
      body: {
        type: 'object',
        properties: {
          layout: { type: 'string' }
        },
        required: ['layout']
      }
    }
  }, async (request, reply) => {
    try {
      const result = wb.setLayout(request.params.id, request.body.layout);
      return { ...result, wb_version: '14.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /wb/workspace/:id/export - WBO_EXPORT
  fastify.get('/workspace/:id/export', async (request, reply) => {
    try {
      const result = wb.exportWorkspace(request.params.id);
      return { ...result, wb_version: '14.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // DELETE /wb/workspace/:id/clear - WBO_CLEAR
  fastify.delete('/workspace/:id/clear', async (request, reply) => {
    try {
      const result = wb.clearWorkspace(request.params.id);
      return { ...result, wb_version: '14.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /wb/workspace/:id/duplicate - WBO_DUPLICATE
  fastify.post('/workspace/:id/duplicate', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = wb.duplicateWorkspace(request.params.id, request.body.name);
      return { ...result, wb_version: '14.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /wb/preset/:preset - WBO_PRESET
  fastify.post('/preset/:preset', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = wb.loadPreset(request.params.preset, request.body.name);
      return { ...result, wb_version: '14.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // DELETE /wb/workspace/:id - Delete workspace
  fastify.delete('/workspace/:id', async (request, reply) => {
    try {
      const result = wb.deleteWorkspace(request.params.id);
      return { ...result, wb_version: '14.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // GET /wb/export - Export all workspaces
  fastify.get('/export', async (request, reply) => {
    return wb.exportAll();
  });

  // POST /wb/safety-check - Validate safety
  fastify.post('/safety-check', async (request, reply) => {
    return {
      safety: wb.validateSafety(),
      wb_version: '14.0'
    };
  });
}
