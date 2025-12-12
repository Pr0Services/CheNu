/**
 * CHE·NU OS 11.0 — HOLO-NET Routes
 * API endpoints for multi-user collaboration
 * Version: 11.0
 */

import { HoloNet } from '../services/HoloNet.js';

export default async function holonetRoutes(fastify, options) {
  const holonet = new HoloNet();

  // GET /holonet - Get HOLO-NET state
  fastify.get('/', async (request, reply) => {
    return {
      ...holonet.exportHoloNet(),
      holonet_version: '11.0'
    };
  });

  // GET /holonet/modes - Get collaboration modes
  fastify.get('/modes', async (request, reply) => {
    return {
      modes: holonet.getAvailableModes(),
      holonet_version: '11.0'
    };
  });

  // GET /holonet/fsl-actions - Get FSL actions
  fastify.get('/fsl-actions', async (request, reply) => {
    return {
      actions: holonet.getFSLActions(),
      holonet_version: '11.0'
    };
  });

  // POST /holonet/sessions - Create session
  fastify.post('/sessions', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          mode: { type: 'string' },
          fabric_refs: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const session = holonet.createSession(request.body);
    return { session, holonet_version: '11.0' };
  });

  // GET /holonet/sessions/:id - Get session state
  fastify.get('/sessions/:id', async (request, reply) => {
    const state = holonet.getSessionState(request.params.id);
    if (!state) {
      return reply.status(404).send({ error: 'Session not found' });
    }
    return state;
  });

  // POST /holonet/sessions/:id/join - Join session
  fastify.post('/sessions/:id/join', {
    schema: {
      body: {
        type: 'object',
        properties: {
          user_id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const result = holonet.joinSession(request.params.id, request.body.user_id);
    if (!result) {
      return reply.status(404).send({ error: 'Session not found' });
    }
    return { ...result, holonet_version: '11.0' };
  });

  // POST /holonet/sessions/:id/leave - Leave session
  fastify.post('/sessions/:id/leave', {
    schema: {
      body: {
        type: 'object',
        properties: {
          user_id: { type: 'string' }
        },
        required: ['user_id']
      }
    }
  }, async (request, reply) => {
    const session = holonet.leaveSession(request.params.id, request.body.user_id);
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' });
    }
    return { session, holonet_version: '11.0' };
  });

  // PUT /holonet/sessions/:id/mode - Change mode
  fastify.put('/sessions/:id/mode', {
    schema: {
      body: {
        type: 'object',
        properties: {
          mode: { type: 'string' }
        },
        required: ['mode']
      }
    }
  }, async (request, reply) => {
    try {
      const session = holonet.changeMode(request.params.id, request.body.mode);
      if (!session) {
        return reply.status(404).send({ error: 'Session not found' });
      }
      return { session, holonet_version: '11.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /holonet/upm - Create UPM
  fastify.post('/upm', {
    schema: {
      body: {
        type: 'object',
        properties: {
          user_id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const upm = holonet.createUPM(request.body.user_id);
    return { upm, holonet_version: '11.0' };
  });

  // PUT /holonet/upm/:id/focus - Update UPM focus
  fastify.put('/upm/:id/focus', {
    schema: {
      body: {
        type: 'object',
        properties: {
          target: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const upm = holonet.updateUPMFocus(request.params.id, request.body.target);
    if (!upm) {
      return reply.status(404).send({ error: 'UPM not found' });
    }
    return { upm, holonet_version: '11.0' };
  });

  // PUT /holonet/upm/:id/selection - Update UPM selection
  fastify.put('/upm/:id/selection', {
    schema: {
      body: {
        type: 'object',
        properties: {
          items: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const upm = holonet.updateUPMSelection(request.params.id, request.body.items || []);
    if (!upm) {
      return reply.status(404).send({ error: 'UPM not found' });
    }
    return { upm, holonet_version: '11.0' };
  });

  // POST /holonet/shared-panels - Create shared panel
  fastify.post('/shared-panels', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          permissions: { type: 'string' },
          contributors: { type: 'array' },
          sync_mode: { type: 'string' },
          content: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const panel = holonet.createSharedPanel(request.body);
    return { panel, holonet_version: '11.0' };
  });

  // POST /holonet/shared-panels/:id/contributors - Add contributor
  fastify.post('/shared-panels/:id/contributors', {
    schema: {
      body: {
        type: 'object',
        properties: {
          user_id: { type: 'string' },
          permission: { type: 'string' }
        },
        required: ['user_id']
      }
    }
  }, async (request, reply) => {
    const panel = holonet.addContributor(
      request.params.id,
      request.body.user_id,
      request.body.permission
    );
    if (!panel) {
      return reply.status(404).send({ error: 'Panel not found' });
    }
    return { panel, holonet_version: '11.0' };
  });

  // PUT /holonet/shared-panels/:id - Sync panel update
  fastify.put('/shared-panels/:id', {
    schema: {
      body: {
        type: 'object',
        properties: {
          user_id: { type: 'string' },
          content: { type: 'array' }
        },
        required: ['user_id']
      }
    }
  }, async (request, reply) => {
    try {
      const { user_id, ...update } = request.body;
      const panel = holonet.syncPanelUpdate(request.params.id, update, user_id);
      if (!panel) {
        return reply.status(404).send({ error: 'Panel not found' });
      }
      return { panel, holonet_version: '11.0' };
    } catch (error) {
      return reply.status(403).send({ error: error.message });
    }
  });

  // POST /holonet/fsl - Execute FSL action
  fastify.post('/fsl', {
    schema: {
      body: {
        type: 'object',
        properties: {
          action: { type: 'string' },
          payload: { type: 'object' },
          user_id: { type: 'string' }
        },
        required: ['action', 'user_id']
      }
    }
  }, async (request, reply) => {
    try {
      const event = holonet.executeFSLAction(
        request.body.action,
        request.body.payload || {},
        request.body.user_id
      );
      return { event, holonet_version: '11.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /holonet/sync-log - Get sync log
  fastify.get('/sync-log', async (request, reply) => {
    const limit = parseInt(request.query.limit) || 100;
    return {
      sync_log: holonet.getSyncLog(limit),
      holonet_version: '11.0'
    };
  });

  // POST /holonet/validate - Validate safety
  fastify.post('/validate', async (request, reply) => {
    const validation = holonet.validateSafety();
    return { validation, holonet_version: '11.0' };
  });

  // DELETE /holonet/clear - Clear all
  fastify.delete('/clear', async (request, reply) => {
    const result = holonet.clearAll();
    return { ...result, holonet_version: '11.0' };
  });
}
