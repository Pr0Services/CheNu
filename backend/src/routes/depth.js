/**
 * CHE·NU OS 16.5, 17.0, 17.5 — DEPTH SYSTEM Routes
 * API endpoints for Multi-Viewport Compositor, Cognitive Depth Layers, Multi-Depth Synthesis
 * Version: 17.5
 */

import { MultiViewportCompositor } from '../services/MultiViewportCompositor.js';
import { CognitiveDepthLayers } from '../services/CognitiveDepthLayers.js';
import { MultiDepthSynthesis } from '../services/MultiDepthSynthesis.js';

export default async function depthRoutes(fastify, options) {
  const mvc = new MultiViewportCompositor();
  const cdl = new CognitiveDepthLayers();
  const mds = new MultiDepthSynthesis(cdl);

  // =====================================================
  // OVERVIEW
  // =====================================================

  // GET /depth - Depth System overview
  fastify.get('/', async (request, reply) => {
    return {
      system: 'CHE·NU DEPTH SYSTEM',
      modules: {
        mvc_16_5: {
          name: 'Multi-Viewport Compositor',
          version: '16.5',
          layout_modes: mvc.listLayoutModes()
        },
        cdl_17: {
          name: 'Cognitive Depth Layers',
          version: '17.0',
          depth_types: cdl.listDepthTypes(),
          composition_modes: cdl.getCompositionModes()
        },
        mds_17_5: {
          name: 'Multi-Depth Synthesis',
          version: '17.5',
          synthesis_types: mds.listSynthesisTypes(),
          presentation_modes: mds.listPresentationModes()
        }
      }
    };
  });

  // =====================================================
  // MULTI-VIEWPORT COMPOSITOR (MVC-16.5)
  // =====================================================

  // GET /depth/mvc - MVC overview
  fastify.get('/mvc', async (request, reply) => {
    return {
      system: 'MVC-16.5',
      layout_modes: mvc.listLayoutModes(),
      composites: mvc.listComposites(),
      mvc_version: '16.5'
    };
  });

  // GET /depth/mvc/layouts - List layout modes
  fastify.get('/mvc/layouts', async (request, reply) => {
    return {
      layout_modes: mvc.listLayoutModes(),
      mvc_version: '16.5'
    };
  });

  // POST /depth/mvc/composite - Create composite
  fastify.post('/mvc/composite', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          viewports: { type: 'array' },
          layout_mode: { type: 'string' },
          structure: { type: 'array' }
        },
        required: ['viewports']
      }
    }
  }, async (request, reply) => {
    try {
      const result = mvc.createComposite({
        name: request.body.name,
        viewports: request.body.viewports,
        layoutMode: request.body.layout_mode,
        structure: request.body.structure
      });
      return { ...result, mvc_version: '16.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /depth/mvc/composite/:id - Get composite
  fastify.get('/mvc/composite/:id', async (request, reply) => {
    const composite = mvc.getComposite(request.params.id);
    if (!composite) {
      return reply.status(404).send({ error: 'Composite not found' });
    }
    return { composite: composite, mvc_version: '16.5' };
  });

  // POST /depth/mvc/composite/:id/switch-layer - Switch layer
  fastify.post('/mvc/composite/:id/switch-layer', {
    schema: {
      body: {
        type: 'object',
        properties: {
          layer_index: { type: 'integer' }
        },
        required: ['layer_index']
      }
    }
  }, async (request, reply) => {
    try {
      const result = mvc.switchLayer(request.params.id, request.body.layer_index);
      return { ...result, mvc_version: '16.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /depth/mvc/export/:id - Export composite
  fastify.get('/mvc/export/:id', async (request, reply) => {
    try {
      const result = mvc.exportComposite(request.params.id);
      return { ...result, mvc_version: '16.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /depth/mvc/panelize/:id - Panelize composite
  fastify.post('/mvc/panelize/:id', async (request, reply) => {
    try {
      const result = mvc.panelizeComposite(request.params.id);
      return { ...result, mvc_version: '16.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // COGNITIVE DEPTH LAYERS (CDL-17)
  // =====================================================

  // GET /depth/cdl - CDL overview
  fastify.get('/cdl', async (request, reply) => {
    return {
      system: 'CDL-17',
      depth_types: cdl.listDepthTypes(),
      composition_modes: cdl.getCompositionModes(),
      outputs: cdl.listOutputs(),
      cdl_version: '17.0'
    };
  });

  // GET /depth/cdl/types - List depth types
  fastify.get('/cdl/types', async (request, reply) => {
    return {
      depth_types: cdl.listDepthTypes(),
      cdl_version: '17.0'
    };
  });

  // POST /depth/cdl/generate - Generate layers (DGP-17)
  fastify.post('/cdl/generate', {
    schema: {
      body: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          depths: { type: 'array', items: { type: 'string' } }
        },
        required: ['content', 'depths']
      }
    }
  }, async (request, reply) => {
    try {
      const result = cdl.generateLayers({
        content: request.body.content,
        requestedDepths: request.body.depths
      });
      return { ...result, cdl_version: '17.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /depth/cdl/output/:id - Get output
  fastify.get('/cdl/output/:id', async (request, reply) => {
    const output = cdl.getOutput(request.params.id);
    if (!output) {
      return reply.status(404).send({ error: 'Output not found' });
    }
    return { ...output, cdl_version: '17.0' };
  });

  // POST /depth/cdl/composite - Create composite depth view
  fastify.post('/cdl/composite', {
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
      const result = cdl.createCompositeDepthView(
        request.body.output_id,
        request.body.mode
      );
      return { ...result, cdl_version: '17.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /depth/cdl/to-panel - Convert layer to panel
  fastify.post('/cdl/to-panel', {
    schema: {
      body: {
        type: 'object',
        properties: {
          output_id: { type: 'string' },
          depth_id: { type: 'string' }
        },
        required: ['output_id', 'depth_id']
      }
    }
  }, async (request, reply) => {
    try {
      const result = cdl.layerToPanel(request.body.output_id, request.body.depth_id);
      return { ...result, cdl_version: '17.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /depth/cdl/export/:id - Export output
  fastify.get('/cdl/export/:id', async (request, reply) => {
    try {
      const result = cdl.exportOutput(request.params.id);
      return { ...result, cdl_version: '17.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // MULTI-DEPTH SYNTHESIS (MDS-17.5)
  // =====================================================

  // GET /depth/mds - MDS overview
  fastify.get('/mds', async (request, reply) => {
    return {
      system: 'MDS-17.5',
      synthesis_types: mds.listSynthesisTypes(),
      presentation_modes: mds.listPresentationModes(),
      syntheses: mds.listSyntheses(),
      mds_version: '17.5'
    };
  });

  // GET /depth/mds/types - List synthesis types
  fastify.get('/mds/types', async (request, reply) => {
    return {
      synthesis_types: mds.listSynthesisTypes(),
      mds_version: '17.5'
    };
  });

  // GET /depth/mds/modes - List presentation modes
  fastify.get('/mds/modes', async (request, reply) => {
    return {
      presentation_modes: mds.listPresentationModes(),
      mds_version: '17.5'
    };
  });

  // POST /depth/mds/synthesize - Create synthesis (SP-17.5)
  fastify.post('/mds/synthesize', {
    schema: {
      body: {
        type: 'object',
        properties: {
          layers: { type: 'array' },
          synthesis_type: { type: 'string' },
          presentation_mode: { type: 'string' }
        },
        required: ['layers']
      }
    }
  }, async (request, reply) => {
    try {
      const result = mds.createSynthesis({
        layers: request.body.layers,
        synthesisType: request.body.synthesis_type,
        presentationMode: request.body.presentation_mode
      });
      return { ...result, mds_version: '17.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /depth/mds/synthesis/:id - Get synthesis
  fastify.get('/mds/synthesis/:id', async (request, reply) => {
    const synthesis = mds.getSynthesis(request.params.id);
    if (!synthesis) {
      return reply.status(404).send({ error: 'Synthesis not found' });
    }
    return { ...synthesis, mds_version: '17.5' };
  });

  // GET /depth/mds/export/:id - Export synthesis
  fastify.get('/mds/export/:id', async (request, reply) => {
    try {
      const result = mds.exportSynthesis(request.params.id);
      return { ...result, mds_version: '17.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /depth/mds/to-viewport/:id - Convert to composite viewport
  fastify.post('/mds/to-viewport/:id', async (request, reply) => {
    try {
      const result = mds.toCompositeViewport(request.params.id);
      return { ...result, mds_version: '17.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /depth/mds/to-panels/:id - Convert to panels
  fastify.post('/mds/to-panels/:id', async (request, reply) => {
    try {
      const result = mds.toPanels(request.params.id);
      return { ...result, mds_version: '17.5' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // SAFETY ROUTES
  // =====================================================

  // POST /depth/safety-check - Validate safety (all systems)
  fastify.post('/safety-check', async (request, reply) => {
    return {
      mvc_16_5: mvc.validateSafety(),
      cdl_17: cdl.validateSafety(),
      mds_17_5: mds.validateSafety(),
      overall: {
        safe: true,
        autonomous: false,
        formatting_only: true,
        user_controlled: true
      }
    };
  });
}
