/**
 * CHE·NU OS 16.0 — MULTIMODAL VIEWPORTS + MORPHOLOGY DESIGNER PRO Routes
 * API endpoints for viewport system and morphology design
 * Version: 16.0
 */

import { MultimodalViewports } from '../services/MultimodalViewports.js';
import { MorphologyDesignerPro } from '../services/MorphologyDesignerPro.js';

export default async function mmvRoutes(fastify, options) {
  const mmv = new MultimodalViewports();
  const mdPro = new MorphologyDesignerPro();

  // =====================================================
  // MULTIMODAL VIEWPORTS ROUTES (MMV)
  // =====================================================

  // GET /mmv - Overview
  fastify.get('/', async (request, reply) => {
    return {
      system: 'MMV-16 + MD-PRO',
      viewports: {
        types: mmv.listViewportTypes(),
        active: mmv.listViewports(),
        layouts: mmv.listLayoutModes()
      },
      morphology: {
        options: mdPro.listOptions(),
        morphotypes: mdPro.listMorphotypes()
      },
      mmv_version: '16.0'
    };
  });

  // GET /mmv/viewport-types - List viewport types
  fastify.get('/viewport-types', async (request, reply) => {
    return {
      viewport_types: mmv.listViewportTypes(),
      mmv_version: '16.0'
    };
  });

  // GET /mmv/layout-modes - List layout modes
  fastify.get('/layout-modes', async (request, reply) => {
    return {
      layout_modes: mmv.listLayoutModes(),
      mmv_version: '16.0'
    };
  });

  // POST /mmv/viewport - Create viewport (user request only)
  fastify.post('/viewport', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          name: { type: 'string' },
          content: { type: 'array' },
          links: { type: 'array' },
          focus: { type: 'string' }
        },
        required: ['type']
      }
    }
  }, async (request, reply) => {
    try {
      const result = mmv.createViewport(request.body);
      return { ...result, mmv_version: '16.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /mmv/viewport/:id - Get viewport
  fastify.get('/viewport/:id', async (request, reply) => {
    const viewport = mmv.getViewport(request.params.id);
    if (!viewport) {
      return reply.status(404).send({ error: 'Viewport not found' });
    }
    return { viewport: viewport, mmv_version: '16.0' };
  });

  // GET /mmv/viewports - List active viewports
  fastify.get('/viewports', async (request, reply) => {
    return {
      viewports: mmv.listViewports(),
      mmv_version: '16.0'
    };
  });

  // PUT /mmv/viewport/:id - Update viewport
  fastify.put('/viewport/:id', {
    schema: {
      body: {
        type: 'object',
        properties: {
          content: { type: 'array' },
          links: { type: 'array' },
          focus: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = mmv.updateViewport(request.params.id, request.body);
      return { ...result, mmv_version: '16.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // DELETE /mmv/viewport/:id - Close viewport
  fastify.delete('/viewport/:id', async (request, reply) => {
    try {
      const result = mmv.closeViewport(request.params.id);
      return { ...result, mmv_version: '16.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /mmv/workspace - Create multi-viewport workspace
  fastify.post('/workspace', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          viewports: { type: 'array' },
          layout: { type: 'string' }
        },
        required: ['viewports']
      }
    }
  }, async (request, reply) => {
    try {
      const result = mmv.createMultiViewWorkspace(request.body);
      return { ...result, mmv_version: '16.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /mmv/workspace/:id - Get multi-view workspace
  fastify.get('/workspace/:id', async (request, reply) => {
    const workspace = mmv.getMultiViewWorkspace(request.params.id);
    if (!workspace) {
      return reply.status(404).send({ error: 'Workspace not found' });
    }
    return { workspace: workspace, mmv_version: '16.0' };
  });

  // POST /mmv/workspace/:id/switch-layer - Switch layer (for layer-stack mode)
  fastify.post('/workspace/:id/switch-layer', {
    schema: {
      body: {
        type: 'object',
        properties: {
          viewport_id: { type: 'string' }
        },
        required: ['viewport_id']
      }
    }
  }, async (request, reply) => {
    try {
      const result = mmv.switchLayer(request.params.id, request.body.viewport_id);
      return { ...result, mmv_version: '16.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /mmv/export/viewport/:id - Export viewport
  fastify.get('/export/viewport/:id', async (request, reply) => {
    try {
      const result = mmv.exportViewport(request.params.id);
      return { ...result, mmv_version: '16.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // GET /mmv/export/workspace/:id - Export workspace
  fastify.get('/export/workspace/:id', async (request, reply) => {
    try {
      const result = mmv.exportWorkspace(request.params.id);
      return { ...result, mmv_version: '16.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // MORPHOLOGY DESIGNER PRO ROUTES (MD-PRO)
  // =====================================================

  // GET /mmv/morphology - MD-PRO overview
  fastify.get('/morphology', async (request, reply) => {
    return {
      system: 'MD-PRO',
      options: mdPro.listOptions(),
      morphotypes: mdPro.listMorphotypes(),
      role_presets: mdPro.getRolePresets(),
      creation_modes: mdPro.getCreationModes(),
      md_version: '16.0'
    };
  });

  // GET /mmv/morphology/options - List design options
  fastify.get('/morphology/options', async (request, reply) => {
    return {
      options: mdPro.listOptions(),
      md_version: '16.0'
    };
  });

  // GET /mmv/morphology/presets - Get role presets
  fastify.get('/morphology/presets', async (request, reply) => {
    return {
      role_presets: mdPro.getRolePresets(),
      md_version: '16.0'
    };
  });

  // GET /mmv/morphology/modes - Get creation modes
  fastify.get('/morphology/modes', async (request, reply) => {
    return {
      creation_modes: mdPro.getCreationModes(),
      md_version: '16.0'
    };
  });

  // POST /mmv/morphology/create - Create morphotype
  fastify.post('/morphology/create', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          base_form: { type: 'string' },
          proportions: { type: 'array' },
          surface_style: { type: 'string' },
          material_logic: { type: 'string' },
          animation_style: { type: 'string' },
          color_primary: { type: 'string' },
          color_secondary: { type: 'string' },
          mode: { type: 'string' },
          role: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = mdPro.createMorphotype(request.body);
      return { ...result, md_version: '16.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /mmv/morphology/from-role - Create from role preset
  fastify.post('/morphology/from-role', {
    schema: {
      body: {
        type: 'object',
        properties: {
          role: { type: 'string' },
          overrides: { type: 'object' }
        },
        required: ['role']
      }
    }
  }, async (request, reply) => {
    try {
      const result = mdPro.createFromRole(request.body.role, request.body.overrides);
      return { ...result, md_version: '16.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /mmv/morphology/from-mode - Create from mode
  fastify.post('/morphology/from-mode', {
    schema: {
      body: {
        type: 'object',
        properties: {
          mode: { type: 'string' },
          config: { type: 'object' }
        },
        required: ['mode']
      }
    }
  }, async (request, reply) => {
    try {
      const result = mdPro.createFromMode(request.body.mode, request.body.config);
      return { ...result, md_version: '16.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /mmv/morphology/pxr - Generate PXR morphotype
  fastify.post('/morphology/pxr', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          base_form: { type: 'string' },
          color: { type: 'string' },
          role: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = mdPro.generatePXRMorphotype(request.body);
      return { ...result, md_version: '16.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /mmv/morphology/:id - Get morphotype
  fastify.get('/morphology/:id', async (request, reply) => {
    const morphotype = mdPro.getMorphotype(request.params.id);
    if (!morphotype) {
      return reply.status(404).send({ error: 'Morphotype not found' });
    }
    return { morphotype: morphotype, md_version: '16.0' };
  });

  // GET /mmv/morphology/list - List morphotypes
  fastify.get('/morphology/list', async (request, reply) => {
    return {
      morphotypes: mdPro.listMorphotypes(),
      md_version: '16.0'
    };
  });

  // PUT /mmv/morphology/:id - Update morphotype
  fastify.put('/morphology/:id', {
    schema: {
      body: {
        type: 'object',
        properties: {
          proportions: { type: 'array' },
          surface_style: { type: 'string' },
          material_logic: { type: 'string' },
          animation_style: { type: 'string' },
          color_profile: { type: 'object' },
          symbolic_behaviors: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = mdPro.updateMorphotype(request.params.id, request.body);
      return { ...result, md_version: '16.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // DELETE /mmv/morphology/:id - Delete morphotype
  fastify.delete('/morphology/:id', async (request, reply) => {
    try {
      const result = mdPro.deleteMorphotype(request.params.id);
      return { ...result, md_version: '16.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // GET /mmv/morphology/export/:id - Export morphotype
  fastify.get('/morphology/export/:id', async (request, reply) => {
    try {
      const result = mdPro.exportMorphotype(request.params.id);
      return { ...result, md_version: '16.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // SAFETY ROUTES
  // =====================================================

  // POST /mmv/safety-check - Validate safety (both systems)
  fastify.post('/safety-check', async (request, reply) => {
    return {
      multimodal_viewports: mmv.validateSafety(),
      morphology_designer: mdPro.validateSafety(),
      mmv_version: '16.0'
    };
  });
}
