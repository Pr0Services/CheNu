/**
 * CHE·NU OS 11.5 — Universe Sessions Routes
 * API endpoints for universe/workspace management
 * Version: 11.5
 */

import { UniverseSessions } from '../services/UniverseSessions.js';

export default async function sessionsRoutes(fastify, options) {
  const usx = new UniverseSessions();

  // GET /sessions - Get all sessions
  fastify.get('/', async (request, reply) => {
    return {
      ...usx.getSessionListPanel(),
      usx_version: '11.5'
    };
  });

  // GET /sessions/current - Get current session
  fastify.get('/current', async (request, reply) => {
    const session = usx.getCurrentSession();
    if (!session) {
      return reply.status(404).send({ error: 'No active session' });
    }
    return { session, usx_version: '11.5' };
  });

  // GET /sessions/:id - Get specific session
  fastify.get('/:id', async (request, reply) => {
    const session = usx.getSession(request.params.id);
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' });
    }
    return { session, usx_version: '11.5' };
  });

  // POST /sessions - Create new session (SSO_NEW)
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          root_fabric: { type: 'object' },
          rooms: { type: 'array' },
          portals: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const session = usx.createSession(request.body);
    return { session, operation: 'SSO_NEW', usx_version: '11.5' };
  });

  // POST /sessions/:id/load - Load session (SSO_LOAD)
  fastify.post('/:id/load', async (request, reply) => {
    try {
      const session = usx.loadSession(request.params.id);
      return { session, operation: 'SSO_LOAD', usx_version: '11.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /sessions/:id/switch - Switch to session (SSO_SWITCH)
  fastify.post('/:id/switch', async (request, reply) => {
    try {
      const result = usx.switchSession(request.params.id);
      return { ...result, operation: 'SSO_SWITCH', usx_version: '11.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /sessions/:id/duplicate - Duplicate session (SSO_DUPLICATE)
  fastify.post('/:id/duplicate', {
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
      const session = usx.duplicateSession(request.params.id, request.body?.name);
      return { session, operation: 'SSO_DUPLICATE', usx_version: '11.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /sessions/:id/snapshot - Create snapshot (SSO_SNAPSHOT)
  fastify.post('/:id/snapshot', {
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
      const snapshot = usx.createSnapshot(request.params.id, request.body?.name);
      return { snapshot, operation: 'SSO_SNAPSHOT', usx_version: '11.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // GET /sessions/:id/snapshots - Get snapshots for session
  fastify.get('/:id/snapshots', async (request, reply) => {
    const snapshots = usx.getSessionSnapshots(request.params.id);
    return { snapshots, session_id: request.params.id, usx_version: '11.5' };
  });

  // POST /sessions/snapshots/:id/restore - Restore snapshot (SSO_RESTORE)
  fastify.post('/snapshots/:id/restore', async (request, reply) => {
    try {
      const result = usx.restoreSnapshot(request.params.id);
      return { ...result, operation: 'SSO_RESTORE', usx_version: '11.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /sessions/:id/freeze - Freeze session (SSO_FREEZE)
  fastify.post('/:id/freeze', async (request, reply) => {
    try {
      const session = usx.freezeSession(request.params.id);
      return { session, operation: 'SSO_FREEZE', usx_version: '11.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /sessions/:id/unfreeze - Unfreeze session
  fastify.post('/:id/unfreeze', async (request, reply) => {
    try {
      const session = usx.unfreezeSession(request.params.id);
      return { session, operation: 'SSO_UNFREEZE', usx_version: '11.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /sessions/merge - Merge sessions (SSO_MERGE)
  fastify.post('/merge', {
    schema: {
      body: {
        type: 'object',
        properties: {
          session_a: { type: 'string' },
          session_b: { type: 'string' },
          name: { type: 'string' }
        },
        required: ['session_a', 'session_b']
      }
    }
  }, async (request, reply) => {
    try {
      const { session_a, session_b, name } = request.body;
      const merged = usx.mergeSessions(session_a, session_b, name);
      return { session: merged, operation: 'SSO_MERGE', usx_version: '11.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /sessions/:id/archive - Archive session (SSO_ARCHIVE)
  fastify.post('/:id/archive', async (request, reply) => {
    try {
      const session = usx.archiveSession(request.params.id);
      return { session, operation: 'SSO_ARCHIVE', usx_version: '11.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /sessions/compare - Compare sessions
  fastify.post('/compare', {
    schema: {
      body: {
        type: 'object',
        properties: {
          session_a: { type: 'string' },
          session_b: { type: 'string' }
        },
        required: ['session_a', 'session_b']
      }
    }
  }, async (request, reply) => {
    try {
      const { session_a, session_b } = request.body;
      const comparison = usx.compareSessions(session_a, session_b);
      return comparison;
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /sessions/by-status/:status - Get sessions by status
  fastify.get('/by-status/:status', async (request, reply) => {
    const sessions = usx.getSessionsByStatus(request.params.status);
    return { sessions, status: request.params.status, usx_version: '11.5' };
  });

  // GET /sessions/export - Export USX state
  fastify.get('/export', async (request, reply) => {
    return usx.exportUSX();
  });

  // POST /sessions/import - Import USX state
  fastify.post('/import', {
    schema: {
      body: {
        type: 'object',
        properties: {
          USX_EXPORT: { type: 'object' }
        },
        required: ['USX_EXPORT']
      }
    }
  }, async (request, reply) => {
    try {
      const result = usx.importUSX(request.body);
      return { ...result, usx_version: '11.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /sessions/validate - Validate safety
  fastify.post('/validate', async (request, reply) => {
    const validation = usx.validateSafety();
    return { validation, usx_version: '11.5' };
  });

  // DELETE /sessions/:id - Delete session
  fastify.delete('/:id', async (request, reply) => {
    const result = usx.deleteSession(request.params.id);
    return { ...result, usx_version: '11.5' };
  });

  // DELETE /sessions/clear - Clear all
  fastify.delete('/clear', async (request, reply) => {
    const result = usx.clearAll();
    return { ...result, usx_version: '11.5' };
  });
}
