/**
 * CHE·NU OS 20.5-22.0 — HYPERCOHERENCE + META-ATLAS + ATLAS COMPOSER + PROJECTION ENGINE Routes
 * API endpoints for advanced coherence, atlas management, and projection
 * Version: 22.0
 */

import { HyperCoherence } from '../services/HyperCoherence.js';
import { MetaAtlas } from '../services/MetaAtlas.js';
import { AtlasComposer } from '../services/AtlasComposer.js';
import { ProjectionEngine } from '../services/ProjectionEngine.js';

export default async function atlasProjectionRoutes(fastify, options) {
  // Initialize services
  const hc = new HyperCoherence();
  const ma = new MetaAtlas();
  const ac = new AtlasComposer(ma);
  const pe = new ProjectionEngine();

  // =====================================================
  // OVERVIEW
  // =====================================================

  // GET /atlas-projection - System overview
  fastify.get('/', async (request, reply) => {
    return {
      system: 'CHE·NU ATLAS & PROJECTION SYSTEM',
      modules: {
        hc_20_5: {
          name: 'HyperCoherence',
          version: '20.5',
          alignment_types: hc.listAlignmentTypes()
        },
        ma_21: {
          name: 'Meta-Atlas',
          version: '21.0',
          sections: ma.listSections()
        },
        ac_21_5: {
          name: 'Atlas Composer',
          version: '21.5',
          operations: ac.operations,
          filter_types: ac.filterTypes
        },
        pe_22: {
          name: 'Projection Engine',
          version: '22.0',
          projection_types: pe.listProjectionTypes()
        }
      }
    };
  });

  // =====================================================
  // HYPERCOHERENCE (HC-20.5)
  // =====================================================

  // GET /atlas-projection/hc - HC overview
  fastify.get('/hc', async (request, reply) => {
    return {
      system: 'HC-20.5',
      alignment_types: hc.listAlignmentTypes(),
      reports: hc.listReports()
    };
  });

  // POST /atlas-projection/hc/check - Run hypercoherence check
  fastify.post('/hc/check', {
    schema: {
      body: {
        type: 'object',
        properties: {
          elements: { type: 'array' },
          alignment_types: { type: 'array' }
        },
        required: ['elements']
      }
    }
  }, async (request, reply) => {
    try {
      const result = hc.runHyperCoherence({
        elements: request.body.elements,
        alignmentTypes: request.body.alignment_types
      });
      return { ...result, hc_version: '20.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /atlas-projection/hc/recommendations/:id - Get recommendations
  fastify.get('/hc/recommendations/:id', async (request, reply) => {
    try {
      const result = hc.getRecommendations(request.params.id);
      return result;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // GET /atlas-projection/hc/export/:id - Export report
  fastify.get('/hc/export/:id', async (request, reply) => {
    try {
      const result = hc.exportReport(request.params.id);
      return result;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // META-ATLAS (MA-21.0)
  // =====================================================

  // GET /atlas-projection/ma - MA overview
  fastify.get('/ma', async (request, reply) => {
    return {
      system: 'MA-21.0',
      sections: ma.listSections(),
      atlases: ma.listAtlases()
    };
  });

  // POST /atlas-projection/ma/generate - Generate atlas
  fastify.post('/ma/generate', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          include_slices: { type: 'boolean' },
          include_depth_layers: { type: 'boolean' },
          include_maps: { type: 'boolean' },
          include_composites: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = ma.generateAtlas({
        name: request.body.name,
        includeSlices: request.body.include_slices,
        includeDepthLayers: request.body.include_depth_layers,
        includeMaps: request.body.include_maps,
        includeComposites: request.body.include_composites
      });
      return { ...result, ma_version: '21.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /atlas-projection/ma/:id - Get atlas
  fastify.get('/ma/:id', async (request, reply) => {
    const atlas = ma.getAtlas(request.params.id);
    if (!atlas) {
      return reply.status(404).send({ error: 'Atlas not found' });
    }
    return { META_ATLAS: atlas };
  });

  // GET /atlas-projection/ma/:id/section/:section - Get section
  fastify.get('/ma/:id/section/:section', async (request, reply) => {
    try {
      const result = ma.getSection(request.params.id, request.params.section);
      return result;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // POST /atlas-projection/ma/:id/search - Search atlas
  fastify.post('/ma/:id/search', {
    schema: {
      body: {
        type: 'object',
        properties: {
          query: { type: 'string' }
        },
        required: ['query']
      }
    }
  }, async (request, reply) => {
    try {
      const result = ma.searchAtlas(request.params.id, request.body.query);
      return result;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // GET /atlas-projection/ma/export/:id - Export atlas
  fastify.get('/ma/export/:id', async (request, reply) => {
    try {
      const result = ma.exportAtlas(request.params.id);
      return result;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // ATLAS COMPOSER (AC-21.5)
  // =====================================================

  // GET /atlas-projection/ac - AC overview
  fastify.get('/ac', async (request, reply) => {
    return {
      system: 'AC-21.5',
      operations: ac.operations,
      filter_types: ac.filterTypes,
      composed_atlases: ac.listComposed()
    };
  });

  // POST /atlas-projection/ac/select - Select entries
  fastify.post('/ac/select', {
    schema: {
      body: {
        type: 'object',
        properties: {
          atlas_id: { type: 'string' },
          entry_ids: { type: 'array' }
        },
        required: ['atlas_id']
      }
    }
  }, async (request, reply) => {
    try {
      const result = ac.select({
        atlasId: request.body.atlas_id,
        entryIds: request.body.entry_ids
      });
      return { ...result, ac_version: '21.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /atlas-projection/ac/group - Group entries
  fastify.post('/ac/group', {
    schema: {
      body: {
        type: 'object',
        properties: {
          selection_id: { type: 'string' },
          theme_name: { type: 'string' },
          entries: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = ac.group({
        selectionId: request.body.selection_id,
        themeName: request.body.theme_name,
        entries: request.body.entries
      });
      return { ...result, ac_version: '21.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /atlas-projection/ac/filter - Filter entries
  fastify.post('/ac/filter', {
    schema: {
      body: {
        type: 'object',
        properties: {
          atlas_id: { type: 'string' },
          filter_type: { type: 'string' },
          filter_value: { type: 'string' }
        },
        required: ['atlas_id', 'filter_type', 'filter_value']
      }
    }
  }, async (request, reply) => {
    try {
      const result = ac.filter({
        atlasId: request.body.atlas_id,
        filterType: request.body.filter_type,
        filterValue: request.body.filter_value
      });
      return { ...result, ac_version: '21.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /atlas-projection/ac/compose - Compose atlas
  fastify.post('/ac/compose', {
    schema: {
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          selection_id: { type: 'string' },
          entries: { type: 'array' },
          sections: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = ac.compose({
        title: request.body.title,
        selectionId: request.body.selection_id,
        entries: request.body.entries,
        sections: request.body.sections
      });
      return { ...result, ac_version: '21.5' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /atlas-projection/ac/export/:id - Export composed atlas
  fastify.get('/ac/export/:id', async (request, reply) => {
    try {
      const result = ac.exportComposed(request.params.id);
      return result;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // PROJECTION ENGINE (PE-22.0)
  // =====================================================

  // GET /atlas-projection/pe - PE overview
  fastify.get('/pe', async (request, reply) => {
    return {
      system: 'PE-22.0',
      projection_types: pe.listProjectionTypes(),
      projections: pe.listProjections()
    };
  });

  // POST /atlas-projection/pe/create - Create projection
  fastify.post('/pe/create', {
    schema: {
      body: {
        type: 'object',
        properties: {
          projection_type: { type: 'string' },
          input_maps: { type: 'array' },
          layers: { type: 'array' },
          slices: { type: 'array' },
          fabric_nodes: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = pe.createProjection({
        projectionType: request.body.projection_type,
        inputMaps: request.body.input_maps,
        layers: request.body.layers,
        slices: request.body.slices,
        fabricNodes: request.body.fabric_nodes
      });
      return { ...result, pe_version: '22.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /atlas-projection/pe/:id - Get projection
  fastify.get('/pe/:id', async (request, reply) => {
    const projection = pe.getProjection(request.params.id);
    if (!projection) {
      return reply.status(404).send({ error: 'Projection not found' });
    }
    return { PROJECTION_OUTPUT: projection };
  });

  // POST /atlas-projection/pe/:id/change-type - Change projection type
  fastify.post('/pe/:id/change-type', {
    schema: {
      body: {
        type: 'object',
        properties: {
          new_type: { type: 'string' }
        },
        required: ['new_type']
      }
    }
  }, async (request, reply) => {
    try {
      const result = pe.changeProjectionType(request.params.id, request.body.new_type);
      return { ...result, pe_version: '22.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /atlas-projection/pe/composite - Create composite projection
  fastify.post('/pe/composite', {
    schema: {
      body: {
        type: 'object',
        properties: {
          projection_ids: { type: 'array' }
        },
        required: ['projection_ids']
      }
    }
  }, async (request, reply) => {
    try {
      const result = pe.createComposite(request.body.projection_ids);
      return { ...result, pe_version: '22.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /atlas-projection/pe/export/:id - Export projection
  fastify.get('/pe/export/:id', async (request, reply) => {
    try {
      const result = pe.exportProjection(request.params.id);
      return result;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // SAFETY ROUTES
  // =====================================================

  // POST /atlas-projection/safety-check - Validate safety (all systems)
  fastify.post('/safety-check', async (request, reply) => {
    return {
      hc_20_5: hc.validateSafety(),
      ma_21: ma.validateSafety(),
      ac_21_5: ac.validateSafety(),
      pe_22: pe.validateSafety(),
      overall: {
        safe: true,
        autonomous: false,
        user_controlled: true,
        lawbook_compliant: true
      }
    };
  });
}
