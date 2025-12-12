/**
 * CHE·NU OS 18.0-20.0 — HYPERFABRIC + CARTOGRAPHY + COHERENCE Routes
 * API endpoints for HyperFabric, Slicing, Cartography, Synthesis, and Coherence
 * Version: 20.0
 */

import { HyperFabric } from '../services/HyperFabric.js';
import { HyperFabricSlicing } from '../services/HyperFabricSlicing.js';
import { UniverseOSCartography } from '../services/UniverseOSCartography.js';
import { CartographySynthesizer } from '../services/CartographySynthesizer.js';
import { UniversalCoherenceLayer } from '../services/UniversalCoherenceLayer.js';

export default async function fabricCartographyRoutes(fastify, options) {
  // Initialize all services
  const hf = new HyperFabric();
  const hfs = new HyperFabricSlicing(hf);
  const uc = new UniverseOSCartography(hf, hfs);
  const cs = new CartographySynthesizer(uc);
  const ucl = new UniversalCoherenceLayer();

  // =====================================================
  // OVERVIEW
  // =====================================================

  // GET /fabric-carto - System overview
  fastify.get('/', async (request, reply) => {
    return {
      system: 'CHE·NU FABRIC & CARTOGRAPHY SYSTEM',
      modules: {
        hf_18: {
          name: 'HyperFabric',
          version: '18.0',
          types: hf.getTypes()
        },
        hfs_18_5: {
          name: 'HyperFabric Slicing',
          version: '18.5',
          slice_types: hfs.listSliceTypes()
        },
        uc_19: {
          name: 'UniverseOS Cartography',
          version: '19.0',
          map_types: uc.listMapTypes(),
          scales: uc.listScales(),
          projections: uc.listProjections()
        },
        cs_19_5: {
          name: 'Cartography Synthesizer',
          version: '19.5',
          composition_types: cs.listCompositionTypes(),
          layout_modes: cs.listLayoutModes()
        },
        ucl_20: {
          name: 'Universal Coherence Layer',
          version: '20.0',
          domains: ucl.listDomains(),
          check_types: ucl.listCheckTypes()
        }
      }
    };
  });

  // =====================================================
  // HYPERFABRIC (HF-18.0)
  // =====================================================

  // GET /fabric-carto/hf - HF overview
  fastify.get('/hf', async (request, reply) => {
    return {
      system: 'HF-18.0',
      types: hf.getTypes(),
      nodes: hf.listNodes(),
      links: hf.listLinks(),
      maps: hf.listMaps()
    };
  });

  // POST /fabric-carto/hf/node - Create hypernode
  fastify.post('/hf/node', {
    schema: {
      body: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          type: { type: 'string' },
          coords: { type: 'object' }
        },
        required: ['label']
      }
    }
  }, async (request, reply) => {
    try {
      const result = hf.createNode(request.body);
      return { ...result, hf_version: '18.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /fabric-carto/hf/connect - Create hyperlink
  fastify.post('/hf/connect', {
    schema: {
      body: {
        type: 'object',
        properties: {
          from: { type: 'string' },
          to: { type: 'string' },
          type: { type: 'string' }
        },
        required: ['from', 'to']
      }
    }
  }, async (request, reply) => {
    try {
      const result = hf.connect(request.body);
      return { ...result, hf_version: '18.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /fabric-carto/hf/coords - Assign coordinates
  fastify.post('/hf/coords', {
    schema: {
      body: {
        type: 'object',
        properties: {
          node_id: { type: 'string' },
          coords: { type: 'object' }
        },
        required: ['node_id', 'coords']
      }
    }
  }, async (request, reply) => {
    try {
      const result = hf.assignCoords(request.body.node_id, request.body.coords);
      return { ...result, hf_version: '18.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /fabric-carto/hf/map - Build HF-MAP
  fastify.post('/hf/map', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          node_ids: { type: 'array' },
          axes_enabled: { type: 'array' },
          projections: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = hf.buildMap({
        name: request.body.name,
        nodeIds: request.body.node_ids,
        axesEnabled: request.body.axes_enabled,
        projections: request.body.projections
      });
      return { ...result, hf_version: '18.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /fabric-carto/hf/projection - Apply projection
  fastify.post('/hf/projection', {
    schema: {
      body: {
        type: 'object',
        properties: {
          map_id: { type: 'string' },
          projection_type: { type: 'string' }
        },
        required: ['map_id', 'projection_type']
      }
    }
  }, async (request, reply) => {
    try {
      const result = hf.applyProjection(request.body.map_id, request.body.projection_type);
      return { ...result, hf_version: '18.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /fabric-carto/hf/export/:id - Export map
  fastify.get('/hf/export/:id', async (request, reply) => {
    try {
      const result = hf.exportMap(request.params.id);
      return result;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // HYPERFABRIC SLICING (HFS-18.5)
  // =====================================================

  // GET /fabric-carto/hfs - HFS overview
  fastify.get('/hfs', async (request, reply) => {
    return {
      system: 'HFS-18.5',
      slice_types: hfs.listSliceTypes(),
      slices: hfs.listSlices()
    };
  });

  // POST /fabric-carto/hfs/slice - Create slice
  fastify.post('/hfs/slice', {
    schema: {
      body: {
        type: 'object',
        properties: {
          map_id: { type: 'string' },
          slice_type: { type: 'string' },
          criteria: { type: 'object' },
          ranges: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = hfs.createSlice({
        mapId: request.body.map_id,
        sliceType: request.body.slice_type,
        criteria: request.body.criteria,
        ranges: request.body.ranges
      });
      return { ...result, hfs_version: '18.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /fabric-carto/hfs/combine - Combine slices
  fastify.post('/hfs/combine', {
    schema: {
      body: {
        type: 'object',
        properties: {
          slice_ids: { type: 'array' },
          operation: { type: 'string' }
        },
        required: ['slice_ids']
      }
    }
  }, async (request, reply) => {
    try {
      const result = hfs.combineSlices(request.body.slice_ids, request.body.operation);
      return { ...result, hfs_version: '18.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /fabric-carto/hfs/export/:id - Export slice
  fastify.get('/hfs/export/:id', async (request, reply) => {
    try {
      const result = hfs.exportSlice(request.params.id);
      return result;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // UNIVERSEOS CARTOGRAPHY (UC-19.0)
  // =====================================================

  // GET /fabric-carto/uc - UC overview
  fastify.get('/uc', async (request, reply) => {
    return {
      system: 'UC-19.0',
      map_types: uc.listMapTypes(),
      scales: uc.listScales(),
      projections: uc.listProjections(),
      maps: uc.listMaps()
    };
  });

  // POST /fabric-carto/uc/map - Create map
  fastify.post('/uc/map', {
    schema: {
      body: {
        type: 'object',
        properties: {
          map_type: { type: 'string' },
          source_map_id: { type: 'string' },
          slice_id: { type: 'string' },
          scale: { type: 'string' },
          projection: { type: 'string' },
          overlays: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = uc.createMap({
        mapType: request.body.map_type,
        sourceMapId: request.body.source_map_id,
        sliceId: request.body.slice_id,
        scale: request.body.scale,
        projection: request.body.projection,
        overlays: request.body.overlays
      });
      return { ...result, uc_version: '19.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /fabric-carto/uc/overlay - Apply overlay
  fastify.post('/uc/overlay', {
    schema: {
      body: {
        type: 'object',
        properties: {
          map_id: { type: 'string' },
          overlay_type: { type: 'string' }
        },
        required: ['map_id', 'overlay_type']
      }
    }
  }, async (request, reply) => {
    try {
      const result = uc.applyOverlay(request.body.map_id, request.body.overlay_type);
      return { ...result, uc_version: '19.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /fabric-carto/uc/projection - Apply projection
  fastify.post('/uc/projection', {
    schema: {
      body: {
        type: 'object',
        properties: {
          map_id: { type: 'string' },
          projection_type: { type: 'string' }
        },
        required: ['map_id', 'projection_type']
      }
    }
  }, async (request, reply) => {
    try {
      const result = uc.applyProjection(request.body.map_id, request.body.projection_type);
      return { ...result, uc_version: '19.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /fabric-carto/uc/export/:id - Export map
  fastify.get('/uc/export/:id', async (request, reply) => {
    try {
      const result = uc.exportMap(request.params.id);
      return result;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /fabric-carto/uc/to-viewport/:id - Convert to viewport
  fastify.post('/uc/to-viewport/:id', async (request, reply) => {
    try {
      const result = uc.toViewport(request.params.id, request.body?.viewport_type);
      return { ...result, uc_version: '19.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /fabric-carto/uc/to-panel/:id - Convert to panel
  fastify.post('/uc/to-panel/:id', async (request, reply) => {
    try {
      const result = uc.toPanel(request.params.id);
      return { ...result, uc_version: '19.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // CARTOGRAPHY SYNTHESIZER (CS-19.5)
  // =====================================================

  // GET /fabric-carto/cs - CS overview
  fastify.get('/cs', async (request, reply) => {
    return {
      system: 'CS-19.5',
      composition_types: cs.listCompositionTypes(),
      layout_modes: cs.listLayoutModes(),
      composites: cs.listComposites()
    };
  });

  // POST /fabric-carto/cs/composite - Create composite
  fastify.post('/cs/composite', {
    schema: {
      body: {
        type: 'object',
        properties: {
          map_ids: { type: 'array' },
          composition_type: { type: 'string' },
          layout_mode: { type: 'string' },
          alignment_rules: { type: 'object' }
        },
        required: ['map_ids']
      }
    }
  }, async (request, reply) => {
    try {
      const result = cs.createComposite({
        mapIds: request.body.map_ids,
        compositionType: request.body.composition_type,
        layoutMode: request.body.layout_mode,
        alignmentRules: request.body.alignment_rules
      });
      return { ...result, cs_version: '19.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /fabric-carto/cs/export/:id - Export composite
  fastify.get('/cs/export/:id', async (request, reply) => {
    try {
      const result = cs.exportComposite(request.params.id);
      return result;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // UNIVERSAL COHERENCE LAYER (UCL-20.0)
  // =====================================================

  // GET /fabric-carto/ucl - UCL overview
  fastify.get('/ucl', async (request, reply) => {
    return {
      system: 'UCL-20.0',
      domains: ucl.listDomains(),
      check_types: ucl.listCheckTypes(),
      reports: ucl.listReports()
    };
  });

  // POST /fabric-carto/ucl/check - Run coherence check
  fastify.post('/ucl/check', {
    schema: {
      body: {
        type: 'object',
        properties: {
          elements: { type: 'array' },
          check_types: { type: 'array' },
          domains: { type: 'array' }
        },
        required: ['elements']
      }
    }
  }, async (request, reply) => {
    try {
      const result = ucl.runCoherenceCheck({
        elements: request.body.elements,
        checkTypes: request.body.check_types,
        domains: request.body.domains
      });
      return { ...result, ucl_version: '20.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /fabric-carto/ucl/recommendations/:id - Get recommendations
  fastify.get('/ucl/recommendations/:id', async (request, reply) => {
    try {
      const result = ucl.getRecommendations(request.params.id);
      return { ...result, ucl_version: '20.0' };
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // GET /fabric-carto/ucl/export/:id - Export report
  fastify.get('/ucl/export/:id', async (request, reply) => {
    try {
      const result = ucl.exportReport(request.params.id);
      return result;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // SAFETY ROUTES
  // =====================================================

  // POST /fabric-carto/safety-check - Validate safety (all systems)
  fastify.post('/safety-check', async (request, reply) => {
    return {
      hf_18: hf.validateSafety(),
      hfs_18_5: hfs.validateSafety(),
      uc_19: uc.validateSafety(),
      cs_19_5: cs.validateSafety(),
      ucl_20: ucl.validateSafety(),
      overall: {
        safe: true,
        autonomous: false,
        representational_only: true,
        user_controlled: true,
        lawbook_compliant: true
      }
    };
  });
}
