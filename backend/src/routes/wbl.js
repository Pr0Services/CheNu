/**
 * CHE·NU OS 14.5 — WORKSPACE LIBRARY + XR PACK Routes
 * API endpoints for workspace templates and XR export
 * Version: 14.5
 */

import { WorkspaceLibrary } from '../services/WorkspaceLibrary.js';
import { XRPack } from '../services/XRPack.js';

export default async function wblRoutes(fastify, options) {
  const wbl = new WorkspaceLibrary();
  const xrPack = new XRPack();

  // =====================================================
  // WORKSPACE LIBRARY ROUTES
  // =====================================================

  // GET /wbl - Overview
  fastify.get('/', async (request, reply) => {
    return {
      system: 'WBL-14.5 + XR-PACK',
      workspace_library: {
        templates: wbl.listTemplates(),
        categories: ['planning', 'creative', 'analysis', 'xr', 'enterprise']
      },
      xr_pack: {
        engines: xrPack.getSupportedEngines()
      },
      wbl_version: '14.5'
    };
  });

  // GET /wbl/templates - List all templates
  fastify.get('/templates', async (request, reply) => {
    return {
      templates: wbl.listTemplates(),
      wbl_version: '14.5'
    };
  });

  // GET /wbl/template/:key - Get template details
  fastify.get('/template/:key', async (request, reply) => {
    try {
      const template = wbl.getTemplate(request.params.key);
      return { ...template, wbl_version: '14.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /wbl/preview - Preview template (step 1)
  fastify.post('/preview', {
    schema: {
      body: {
        type: 'object',
        properties: {
          template: { type: 'string' }
        },
        required: ['template']
      }
    }
  }, async (request, reply) => {
    try {
      const preview = wbl.previewTemplate(request.body.template);
      return { ...preview, wbl_version: '14.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /wbl/confirm - Confirm and build (step 2)
  fastify.post('/confirm', {
    schema: {
      body: {
        type: 'object',
        properties: {
          preview_id: { type: 'string' },
          name: { type: 'string' }
        },
        required: ['preview_id']
      }
    }
  }, async (request, reply) => {
    try {
      const result = wbl.confirmBuild(request.body.preview_id, request.body.name);
      return { ...result, wbl_version: '14.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // DELETE /wbl/cancel/:previewId - Cancel pending build
  fastify.delete('/cancel/:previewId', async (request, reply) => {
    const result = wbl.cancelBuild(request.params.previewId);
    return { ...result, wbl_version: '14.5' };
  });

  // GET /wbl/pending - List pending builds
  fastify.get('/pending', async (request, reply) => {
    return {
      pending_builds: wbl.listPendingBuilds(),
      wbl_version: '14.5'
    };
  });

  // GET /wbl/category/:category - Get templates by category
  fastify.get('/category/:category', async (request, reply) => {
    const templates = wbl.getTemplatesByCategory(request.params.category);
    return {
      category: request.params.category,
      templates: templates,
      wbl_version: '14.5'
    };
  });

  // GET /wbl/export - Export library
  fastify.get('/export', async (request, reply) => {
    return wbl.exportLibrary();
  });

  // =====================================================
  // XR PACK ROUTES
  // =====================================================

  // GET /wbl/xr - XR Pack overview
  fastify.get('/xr', async (request, reply) => {
    return {
      system: 'XR-PACK-1.0',
      engines: xrPack.getSupportedEngines(),
      node_types: xrPack.nodeTypes,
      materials: xrPack.neutralMaterials,
      safe: true,
      xr_version: '14.5-XR'
    };
  });

  // GET /wbl/xr/engines - List supported engines
  fastify.get('/xr/engines', async (request, reply) => {
    return {
      engines: xrPack.getSupportedEngines(),
      xr_version: '14.5-XR'
    };
  });

  // POST /wbl/xr/export - Export XR scene
  fastify.post('/xr/export', {
    schema: {
      body: {
        type: 'object',
        properties: {
          scene_id: { type: 'string' },
          name: { type: 'string' },
          engine: { type: 'string' },
          nodes: { type: 'array' },
          rooms: { type: 'array' },
          portals: { type: 'array' },
          avatars: { type: 'array' },
          lights: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const scene = xrPack.exportScene(request.body);
    return { ...scene, xr_version: '14.5-XR' };
  });

  // POST /wbl/xr/export/:engine - Export for specific engine
  fastify.post('/xr/export/:engine', {
    schema: {
      body: {
        type: 'object',
        properties: {
          scene_id: { type: 'string' },
          name: { type: 'string' },
          nodes: { type: 'array' },
          rooms: { type: 'array' },
          portals: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const result = xrPack.exportForEngine(request.body, request.params.engine);
    return { ...result, xr_version: '14.5-XR' };
  });

  // POST /wbl/xr/unity - Export for Unity
  fastify.post('/xr/unity', async (request, reply) => {
    const result = xrPack.exportForEngine(request.body, 'unity');
    return { ...result, xr_version: '14.5-XR' };
  });

  // POST /wbl/xr/unreal - Export for Unreal
  fastify.post('/xr/unreal', async (request, reply) => {
    const result = xrPack.exportForEngine(request.body, 'unreal');
    return { ...result, xr_version: '14.5-XR' };
  });

  // POST /wbl/xr/threejs - Export for Three.js
  fastify.post('/xr/threejs', async (request, reply) => {
    const result = xrPack.exportForEngine(request.body, 'threejs');
    return { ...result, xr_version: '14.5-XR' };
  });

  // POST /wbl/xr/from-workspace - Convert workspace to XR
  fastify.post('/xr/from-workspace', {
    schema: {
      body: {
        type: 'object',
        properties: {
          workspace: { type: 'object' }
        },
        required: ['workspace']
      }
    }
  }, async (request, reply) => {
    const scene = xrPack.workspaceToXR(request.body.workspace);
    return { ...scene, xr_version: '14.5-XR' };
  });

  // =====================================================
  // SAFETY ROUTES
  // =====================================================

  // POST /wbl/safety-check - Validate safety (both systems)
  fastify.post('/safety-check', async (request, reply) => {
    return {
      workspace_library: wbl.validateSafety(),
      xr_pack: xrPack.validateSafety(),
      wbl_version: '14.5'
    };
  });
}
