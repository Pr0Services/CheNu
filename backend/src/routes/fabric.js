/**
 * CHE·NU OS 8.5 — Holo-Fabric Routes
 * API endpoints for spatial continuity and universe fabric
 * Version: 8.5
 */

import { HoloFabricEngine } from '../services/HoloFabricEngine.js';

export default async function fabricRoutes(fastify, options) {
  const engine = new HoloFabricEngine();

  // GET /fabric - Get current fabric state
  fastify.get('/', async (request, reply) => {
    return {
      fabric: engine.currentFabric,
      hfe_version: '8.5'
    };
  });

  // POST /fabric/reset - Reset fabric
  fastify.post('/reset', async (request, reply) => {
    const fabric = engine.resetFabric();
    return { fabric, message: 'Fabric reset' };
  });

  // POST /fabric/project - Create project fabric
  fastify.post('/project', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
      }
    }
  }, async (request, reply) => {
    const { name } = request.body;
    const fabric = engine.createProjectFabric(name);
    return { fabric, hfe_version: '8.5' };
  });

  // POST /fabric/room - Add room to fabric
  fastify.post('/room', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          pos: { type: 'array', items: { type: 'number' } },
          geometry: { type: 'string' },
          aura: { type: 'string' },
          type: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const room = engine.addRoom(request.body);
    return { room, hfe_version: '8.5' };
  });

  // POST /fabric/portal - Create portal between rooms
  fastify.post('/portal', {
    schema: {
      body: {
        type: 'object',
        properties: {
          from: { type: 'string' },
          to: { type: 'string' },
          transition: { type: 'string' }
        },
        required: ['from', 'to']
      }
    }
  }, async (request, reply) => {
    const { from, to, transition } = request.body;
    const portal = engine.createPortal(from, to, transition || 'warp');
    return { portal, hfe_version: '8.5' };
  });

  // POST /fabric/agent - Add agent anchor
  fastify.post('/agent', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          pos: { type: 'array', items: { type: 'number' } },
          zones: { type: 'array', items: { type: 'string' } },
          room: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const anchor = engine.addAgentAnchor(request.body);
    return { anchor, hfe_version: '8.5' };
  });

  // POST /fabric/holothread - Add holothread
  fastify.post('/holothread', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          path: { type: 'array' },
          type: { type: 'string' },
          color: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const thread = engine.addHolothread(request.body);
    return { thread, hfe_version: '8.5' };
  });

  // GET /fabric/map - Get fabric map
  fastify.get('/map', async (request, reply) => {
    const map = engine.generateFabricMap();
    return { map, hfe_version: '8.5' };
  });

  // GET /fabric/export - Export fabric for HCE
  fastify.get('/export', async (request, reply) => {
    const exported = engine.exportFabric();
    return { ...exported, hfe_version: '8.5' };
  });

  // PUT /fabric/mode/:mode - Set continuity mode
  fastify.put('/mode/:mode', async (request, reply) => {
    const { mode } = request.params;
    const success = engine.setContinuityMode(mode);
    
    if (!success) {
      return reply.status(400).send({
        error: 'Invalid continuity mode',
        valid_modes: Object.keys(engine.continuityModes)
      });
    }
    
    return { 
      mode, 
      set: true,
      hfe_version: '8.5'
    };
  });

  // GET /fabric/modes - Get available continuity modes
  fastify.get('/modes', async (request, reply) => {
    const modes = engine.getContinuityModes();
    return { modes, hfe_version: '8.5' };
  });

  // GET /fabric/transitions - Get available transitions
  fastify.get('/transitions', async (request, reply) => {
    const transitions = engine.getAvailableTransitions();
    return { transitions, hfe_version: '8.5' };
  });

  // POST /fabric/validate - Validate fabric safety
  fastify.post('/validate', async (request, reply) => {
    const validation = engine.validateFabricSafety();
    return { validation, hfe_version: '8.5' };
  });
}
