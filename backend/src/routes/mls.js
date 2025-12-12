/**
 * CHE·NU OS 15.5 — MULTI-LENS SYSTEM Routes
 * API endpoints for perspective organizer
 * Version: 15.5
 */

import { MultiLensSystem } from '../services/MultiLensSystem.js';

export default async function mlsRoutes(fastify, options) {
  const mls = new MultiLensSystem();

  // GET /mls - Overview
  fastify.get('/', async (request, reply) => {
    return {
      system: 'MLS-15.5',
      lens_types: mls.listLensTypes(),
      workspace_modes: mls.getWorkspaceModes(),
      outputs: mls.listOutputs(),
      mls_version: '15.5'
    };
  });

  // GET /mls/lens-types - List available lens types
  fastify.get('/lens-types', async (request, reply) => {
    return {
      lens_types: mls.listLensTypes(),
      mls_version: '15.5'
    };
  });

  // GET /mls/workspace-modes - List workspace modes
  fastify.get('/workspace-modes', async (request, reply) => {
    return {
      workspace_modes: mls.getWorkspaceModes(),
      mls_version: '15.5'
    };
  });

  // POST /mls/generate - Generate lenses (LGP)
  fastify.post('/generate', {
    schema: {
      body: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          lenses: { type: 'array', items: { type: 'string' } },
          workspace_mode: { type: 'string' }
        },
        required: ['content', 'lenses']
      }
    }
  }, async (request, reply) => {
    try {
      const result = mls.generateLenses({
        content: request.body.content,
        requestedLenses: request.body.lenses,
        workspaceMode: request.body.workspace_mode
      });
      return { ...result, mls_version: '15.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /mls/output/:id - Get specific output
  fastify.get('/output/:id', async (request, reply) => {
    const output = mls.getOutput(request.params.id);
    if (!output) {
      return reply.status(404).send({ error: 'Output not found' });
    }
    return { ...output, mls_version: '15.5' };
  });

  // GET /mls/outputs - List all outputs
  fastify.get('/outputs', async (request, reply) => {
    return {
      outputs: mls.listOutputs(),
      mls_version: '15.5'
    };
  });

  // GET /mls/export/:id - Export output
  fastify.get('/export/:id', async (request, reply) => {
    try {
      const result = mls.exportOutput(request.params.id);
      return { ...result, mls_version: '15.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /mls/workspace - Create workspace layout
  fastify.post('/workspace', {
    schema: {
      body: {
        type: 'object',
        properties: {
          output_id: { type: 'string' },
          mode: { type: 'string' }
        },
        required: ['output_id', 'mode']
      }
    }
  }, async (request, reply) => {
    try {
      const result = mls.createWorkspaceLayout(
        request.body.output_id,
        request.body.mode
      );
      return { ...result, mls_version: '15.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /mls/safety-check - Validate safety
  fastify.post('/safety-check', async (request, reply) => {
    return {
      safety: mls.validateSafety(),
      mls_version: '15.5'
    };
  });
}
