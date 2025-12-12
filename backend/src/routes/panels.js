/**
 * CHE·NU OS 10.5 — Interaction Panels Routes
 * API endpoints for intelligent UI panels
 * Version: 10.5
 */

import { InteractionPanels } from '../services/InteractionPanels.js';

export default async function panelsRoutes(fastify, options) {
  const panels = new InteractionPanels();

  // GET /panels - Get all panels
  fastify.get('/', async (request, reply) => {
    return {
      panels: panels.getAllPanels(),
      count: panels.panels.size,
      ip_version: '10.5'
    };
  });

  // GET /panels/types - Get available panel types
  fastify.get('/types', async (request, reply) => {
    return {
      types: panels.getAvailableTypes(),
      ip_version: '10.5'
    };
  });

  // GET /panels/primitives - Get interaction primitives
  fastify.get('/primitives', async (request, reply) => {
    return {
      primitives: panels.getAvailablePrimitives(),
      ip_version: '10.5'
    };
  });

  // GET /panels/:id - Get specific panel
  fastify.get('/:id', async (request, reply) => {
    const panel = panels.getPanel(request.params.id);
    if (!panel) {
      return reply.status(404).send({ error: 'Panel not found' });
    }
    return { panel, ip_version: '10.5' };
  });

  // POST /panels/create - Create generic panel
  fastify.post('/create', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'array' },
          layout: { type: 'string' },
          mode: { type: 'string' }
        },
        required: ['type']
      }
    }
  }, async (request, reply) => {
    try {
      const panel = panels.createPanel(request.body.type, request.body);
      return { panel, ip_version: '10.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /panels/info - Create info panel
  fastify.post('/info', {
    schema: {
      body: {
        type: 'object',
        properties: {
          target: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          properties: { type: 'array' },
          links: { type: 'array' },
          fabric_refs: { type: 'array' }
        },
        required: ['target']
      }
    }
  }, async (request, reply) => {
    const { target, ...details } = request.body;
    const panel = panels.createInfoPanel(target, details);
    return { panel, ip_version: '10.5' };
  });

  // POST /panels/actions - Create actions panel
  fastify.post('/actions', {
    schema: {
      body: {
        type: 'object',
        properties: {
          context: { type: 'string' },
          actions: { type: 'array' }
        },
        required: ['context']
      }
    }
  }, async (request, reply) => {
    const { context, actions } = request.body;
    const panel = panels.createActionsPanel(context, actions || []);
    return { panel, ip_version: '10.5' };
  });

  // POST /panels/timeline - Create timeline panel
  fastify.post('/timeline', {
    schema: {
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          segments: { type: 'array' },
          holothread_id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const panel = panels.createTimelinePanel(request.body);
    return { panel, ip_version: '10.5' };
  });

  // POST /panels/cluster - Create cluster panel
  fastify.post('/cluster', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          groups: { type: 'array' },
          layout: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const panel = panels.createClusterPanel(request.body);
    return { panel, ip_version: '10.5' };
  });

  // POST /panels/agent - Create agent panel
  fastify.post('/agent', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          role: { type: 'string' },
          anchor_zone: { type: 'string' },
          morphology: { type: 'object' },
          suggestions: { type: 'array' },
          actions: { type: 'array' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    const panel = panels.createAgentPanel(request.body);
    return { panel, ip_version: '10.5' };
  });

  // POST /panels/portal - Create portal panel
  fastify.post('/portal', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          from: { type: 'string' },
          to: { type: 'string' },
          transition: { type: 'string' },
          preview: { type: 'object' },
          destination_type: { type: 'string' },
          destination_description: { type: 'string' }
        },
        required: ['from', 'to']
      }
    }
  }, async (request, reply) => {
    const panel = panels.createPortalPanel(request.body);
    return { panel, ip_version: '10.5' };
  });

  // POST /panels/workspace - Create workspace panel
  fastify.post('/workspace', {
    schema: {
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          panels: { type: 'array' },
          arrangement: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const panel = panels.createWorkspacePanel(request.body);
    return { panel, ip_version: '10.5' };
  });

  // PUT /panels/:id/state - Update panel state
  fastify.put('/:id/state', {
    schema: {
      body: {
        type: 'object',
        properties: {
          state: { type: 'string' }
        },
        required: ['state']
      }
    }
  }, async (request, reply) => {
    try {
      const result = panels.updatePanelState(request.params.id, request.body.state);
      return { ...result, ip_version: '10.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /panels/:id/primitive - Execute interaction primitive
  fastify.post('/:id/primitive', {
    schema: {
      body: {
        type: 'object',
        properties: {
          primitive: { type: 'string' }
        },
        required: ['primitive']
      }
    }
  }, async (request, reply) => {
    try {
      const result = panels.executePrimitive(request.params.id, request.body.primitive);
      return { ...result, ip_version: '10.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // DELETE /panels/:id - Close panel
  fastify.delete('/:id', async (request, reply) => {
    const result = panels.closePanel(request.params.id);
    if (!result.closed) {
      return reply.status(404).send(result);
    }
    return { ...result, ip_version: '10.5' };
  });

  // GET /panels/:id/export - Export panel to UDM format
  fastify.get('/:id/export', async (request, reply) => {
    try {
      const exported = panels.exportPanel(request.params.id);
      return exported;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // GET /panels/export/all - Export all panels
  fastify.get('/export/all', async (request, reply) => {
    return panels.exportAllPanels();
  });

  // GET /panels/by-type/:type - Get panels by type
  fastify.get('/by-type/:type', async (request, reply) => {
    const filtered = panels.getPanelsByType(request.params.type);
    return {
      panels: filtered,
      count: filtered.length,
      type: request.params.type,
      ip_version: '10.5'
    };
  });

  // GET /panels/by-state/:state - Get panels by state
  fastify.get('/by-state/:state', async (request, reply) => {
    const filtered = panels.getPanelsByState(request.params.state);
    return {
      panels: filtered,
      count: filtered.length,
      state: request.params.state,
      ip_version: '10.5'
    };
  });

  // POST /panels/:id/validate - Validate panel safety
  fastify.post('/:id/validate', async (request, reply) => {
    const panel = panels.getPanel(request.params.id);
    if (!panel) {
      return reply.status(404).send({ error: 'Panel not found' });
    }
    const validation = panels.validateSafety(panel);
    return { validation, ip_version: '10.5' };
  });

  // DELETE /panels/clear - Clear all panels
  fastify.delete('/clear', async (request, reply) => {
    const result = panels.clearAllPanels();
    return { ...result, ip_version: '10.5' };
  });
}
