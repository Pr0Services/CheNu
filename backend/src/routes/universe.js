/**
 * CHE·NU OS 9.0 — UniverseOS Routes
 * API endpoints for the full spatial operating environment
 * Version: 9.0
 */

import { UniverseOS } from '../services/UniverseOS.js';

export default async function universeRoutes(fastify, options) {
  const universe = new UniverseOS();

  // GET /universe - Get universe state
  fastify.get('/', async (request, reply) => {
    return {
      universe: universe.universe,
      shell: universe.shell,
      universe_version: '9.0'
    };
  });

  // POST /universe/reset - Reset universe
  fastify.post('/reset', async (request, reply) => {
    const newUniverse = universe.resetUniverse();
    return { universe: newUniverse, message: 'Universe reset' };
  });

  // GET /universe/map - Get universe map
  fastify.get('/map', async (request, reply) => {
    const map = universe.getUniverseMap();
    return { map, universe_version: '9.0' };
  });

  // GET /universe/export - Export universe
  fastify.get('/export', async (request, reply) => {
    const exported = universe.exportUniverse();
    return { ...exported, universe_version: '9.0' };
  });

  // GET /universe/nexus - Get central nexus
  fastify.get('/nexus', async (request, reply) => {
    return {
      nexus: universe.universe.nexus,
      universe_version: '9.0'
    };
  });

  // POST /universe/workspace - Create workspace
  fastify.post('/workspace', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          name: { type: 'string' },
          pos: { type: 'array', items: { type: 'number' } }
        },
        required: ['type']
      }
    }
  }, async (request, reply) => {
    try {
      const workspace = universe.createWorkspace(request.body.type, request.body);
      return { workspace, universe_version: '9.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /universe/workspace-types - Get workspace types
  fastify.get('/workspace-types', async (request, reply) => {
    const types = universe.getWorkspaceTypes();
    return { workspace_types: types, universe_version: '9.0' };
  });

  // POST /universe/portal - Create portal
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
    const portal = universe.createPortal(from, to, transition || 'warp');
    return { portal, universe_version: '9.0' };
  });

  // POST /universe/sphere - Add sphere
  fastify.post('/sphere', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          pos: { type: 'array', items: { type: 'number' } },
          color: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const sphere = universe.addSphere(request.body);
    return { sphere, universe_version: '9.0' };
  });

  // GET /universe/spheres - Get all spheres
  fastify.get('/spheres', async (request, reply) => {
    return {
      spheres: universe.spheres,
      universe_version: '9.0'
    };
  });

  // POST /universe/agent - Add agent to universe
  fastify.post('/agent', {
    schema: {
      body: {
        type: 'object',
        properties: {
          agent_id: { type: 'string' },
          anchor_zone: { type: 'string' }
        },
        required: ['agent_id']
      }
    }
  }, async (request, reply) => {
    const { agent_id, anchor_zone } = request.body;
    const agent = universe.addAgent(agent_id, anchor_zone || 'central_nexus');
    return { agent, universe_version: '9.0' };
  });

  // GET /universe/agents - Get all agents in universe
  fastify.get('/agents', async (request, reply) => {
    return {
      agents: universe.universe.agents,
      universe_version: '9.0'
    };
  });

  // POST /universe/timeline - Create timeline path
  fastify.post('/timeline', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          holothread_id: { type: 'string' },
          path: { type: 'array' },
          nodes: { type: 'array' },
          color: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const timeline = universe.createTimelinePath(request.body);
    return { timeline, universe_version: '9.0' };
  });

  // GET /universe/timelines - Get all timeline paths
  fastify.get('/timelines', async (request, reply) => {
    return {
      timeline_paths: universe.universe.timeline_paths,
      universe_version: '9.0'
    };
  });

  // POST /universe/ui-surface - Add UI surface
  fastify.post('/ui-surface', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          pos: { type: 'array', items: { type: 'number' } },
          size: { type: 'array', items: { type: 'number' } },
          content: { type: 'string' },
          room: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const surface = universe.addUISurface(request.body);
    return { surface, universe_version: '9.0' };
  });

  // POST /universe/navigate - Navigate in universe
  fastify.post('/navigate', {
    schema: {
      body: {
        type: 'object',
        properties: {
          mode: { type: 'string' },
          target: { type: 'string' }
        },
        required: ['mode']
      }
    }
  }, async (request, reply) => {
    try {
      const { mode, target } = request.body;
      const navigation = universe.navigate(mode, target);
      return { navigation, universe_version: '9.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /universe/nav-modes - Get navigation modes
  fastify.get('/nav-modes', async (request, reply) => {
    const modes = universe.getNavModes();
    return { nav_modes: modes, universe_version: '9.0' };
  });

  // POST /universe/validate - Validate universe safety
  fastify.post('/validate', async (request, reply) => {
    const validation = universe.validateSafety();
    return { validation, universe_version: '9.0' };
  });

  // GET /universe/rooms - Get all rooms
  fastify.get('/rooms', async (request, reply) => {
    return {
      rooms: universe.universe.rooms,
      universe_version: '9.0'
    };
  });

  // GET /universe/portals - Get all portals
  fastify.get('/portals', async (request, reply) => {
    return {
      portals: universe.universe.portals,
      universe_version: '9.0'
    };
  });
}
