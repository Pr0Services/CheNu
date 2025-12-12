/**
 * CHE·NU XR PACK PRO — SCENE EXPORT & IMPORT LAYER Routes
 * API endpoints for XR scene export/import
 * Version: XR-PRO-1.0
 */

import { XRPackPro } from '../services/XRPackPro.js';

export default async function xrPackProRoutes(fastify, options) {
  // Initialize service
  const xrPro = new XRPackPro();

  // =====================================================
  // OVERVIEW
  // =====================================================

  // GET /xr-pro - System overview
  fastify.get('/', async (request, reply) => {
    return {
      system: 'CHE·NU XR PACK PRO',
      version: 'XR-PRO-1.0',
      purpose: 'XR Scene Export & Import Layer',
      engine_hints: xrPro.engineHints,
      room_shapes: xrPro.roomShapes,
      material_profiles: xrPro.materialProfiles,
      room_roles: xrPro.roomRoles,
      portal_shapes: xrPro.portalShapes,
      anchor_types: xrPro.anchorTypes,
      symbol_roles: xrPro.symbolRoles,
      light_types: xrPro.lightTypes,
      mesh_hints: xrPro.meshHints,
      scenes: xrPro.listScenes(),
      morphotypes: xrPro.listMorphotypes(),
      safety: {
        code_execution: false,
        game_engine_runtime: false,
        physics_simulation: false,
        autonomous_entities: false,
        json_definition_only: true
      }
    };
  });

  // =====================================================
  // SCENE CREATION
  // =====================================================

  // POST /xr-pro/scene - Create XR scene
  fastify.post('/scene', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          engine_hint: { type: 'string' },
          nodes: { type: 'array' },
          rooms: { type: 'array' },
          portals: { type: 'array' },
          anchors: { type: 'array' },
          symbols: { type: 'array' },
          props: { type: 'array' },
          lighting: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = xrPro.createScene({
        name: request.body.name,
        engineHint: request.body.engine_hint,
        nodes: request.body.nodes,
        rooms: request.body.rooms,
        portals: request.body.portals,
        anchors: request.body.anchors,
        symbols: request.body.symbols,
        props: request.body.props,
        lighting: request.body.lighting
      });
      return { ...result, xr_pro_version: 'XR-PRO-1.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /xr-pro/scene/:id - Get scene
  fastify.get('/scene/:id', async (request, reply) => {
    const scene = xrPro.getScene(request.params.id);
    if (!scene) {
      return reply.status(404).send({ error: 'Scene not found' });
    }
    return { XR_SCENE: scene };
  });

  // GET /xr-pro/scenes - List scenes
  fastify.get('/scenes', async (request, reply) => {
    return { scenes: xrPro.listScenes() };
  });

  // GET /xr-pro/scene/:id/export - Export scene as JSON
  fastify.get('/scene/:id/export', async (request, reply) => {
    try {
      const result = xrPro.exportSceneJSON(request.params.id);
      return result;
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // =====================================================
  // ELEMENT CREATION
  // =====================================================

  // POST /xr-pro/room - Create XR room
  fastify.post('/room', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          center: { type: 'object' },
          size: { type: 'object' },
          shape: { type: 'string' },
          material_profile: { type: 'string' },
          role: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const room = xrPro.createRoom({
        name: request.body.name,
        center: request.body.center,
        size: request.body.size,
        shape: request.body.shape,
        materialProfile: request.body.material_profile,
        role: request.body.role
      });
      return { XR_ROOM: room };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /xr-pro/portal - Create XR portal
  fastify.post('/portal', {
    schema: {
      body: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          from_room: { type: 'string' },
          to_room: { type: 'string' },
          position: { type: 'object' },
          shape: { type: 'string' },
          navigation_hint: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const portal = xrPro.createPortal({
        label: request.body.label,
        fromRoom: request.body.from_room,
        toRoom: request.body.to_room,
        position: request.body.position,
        shape: request.body.shape,
        navigationHint: request.body.navigation_hint
      });
      return { XR_PORTAL: portal };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /xr-pro/anchor - Create XR anchor
  fastify.post('/anchor', {
    schema: {
      body: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          position: { type: 'object' },
          anchor_type: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const anchor = xrPro.createAnchor({
        label: request.body.label,
        position: request.body.position,
        anchorType: request.body.anchor_type
      });
      return { XR_ANCHOR: anchor };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /xr-pro/symbol - Create XR symbol
  fastify.post('/symbol', {
    schema: {
      body: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          morphotype_id: { type: 'string' },
          position: { type: 'object' },
          scale: { type: 'object' },
          role: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const symbol = xrPro.createSymbol({
        label: request.body.label,
        morphotypeId: request.body.morphotype_id,
        position: request.body.position,
        scale: request.body.scale,
        role: request.body.role
      });
      return { XR_SYMBOL: symbol };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /xr-pro/prop - Create XR prop
  fastify.post('/prop', {
    schema: {
      body: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          mesh_hint: { type: 'string' },
          position: { type: 'object' },
          scale: { type: 'object' },
          material_profile: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const prop = xrPro.createProp({
        label: request.body.label,
        meshHint: request.body.mesh_hint,
        position: request.body.position,
        scale: request.body.scale,
        materialProfile: request.body.material_profile
      });
      return { XR_PROP: prop };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /xr-pro/light - Create XR light
  fastify.post('/light', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          color: { type: 'object' },
          intensity: { type: 'number' },
          position: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const light = xrPro.createLight({
        type: request.body.type,
        color: request.body.color,
        intensity: request.body.intensity,
        position: request.body.position
      });
      return { XR_LIGHT: light };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // =====================================================
  // MORPHOTYPES
  // =====================================================

  // POST /xr-pro/morphotype - Create morphotype
  fastify.post('/morphotype', {
    schema: {
      body: {
        type: 'object',
        properties: {
          base_form: { type: 'string' },
          proportions: { type: 'array' },
          surface_style: { type: 'string' },
          material_logic: { type: 'string' },
          animation_style: { type: 'string' },
          color_profile: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const morphotype = xrPro.createMorphotype({
        baseForm: request.body.base_form,
        proportions: request.body.proportions,
        surfaceStyle: request.body.surface_style,
        materialLogic: request.body.material_logic,
        animationStyle: request.body.animation_style,
        colorProfile: request.body.color_profile
      });
      return { MORPHOTYPE: morphotype };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /xr-pro/morphotypes - List morphotypes
  fastify.get('/morphotypes', async (request, reply) => {
    return { morphotypes: xrPro.listMorphotypes() };
  });

  // GET /xr-pro/morphotype/:id - Get morphotype
  fastify.get('/morphotype/:id', async (request, reply) => {
    const morphotype = xrPro.getMorphotype(request.params.id);
    if (!morphotype) {
      return reply.status(404).send({ error: 'Morphotype not found' });
    }
    return { MORPHOTYPE: morphotype };
  });

  // =====================================================
  // EXPORT FROM SOURCES
  // =====================================================

  // POST /xr-pro/export/universeos - Export from UniverseOS room
  fastify.post('/export/universeos', {
    schema: {
      body: {
        type: 'object',
        properties: {
          room: { type: 'object' },
          engine_hint: { type: 'string' }
        },
        required: ['room']
      }
    }
  }, async (request, reply) => {
    try {
      const result = xrPro.exportFromUniverseOS(
        request.body.room,
        request.body.engine_hint
      );
      return { ...result, source: 'UniverseOS' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /xr-pro/export/hyperfabric - Export from HyperFabric topology
  fastify.post('/export/hyperfabric', {
    schema: {
      body: {
        type: 'object',
        properties: {
          topology: { type: 'object' },
          engine_hint: { type: 'string' }
        },
        required: ['topology']
      }
    }
  }, async (request, reply) => {
    try {
      const result = xrPro.exportFromHyperFabric(
        request.body.topology,
        request.body.engine_hint
      );
      return { ...result, source: 'HyperFabric' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /xr-pro/export/workspace - Export from Workspace
  fastify.post('/export/workspace', {
    schema: {
      body: {
        type: 'object',
        properties: {
          workspace: { type: 'object' },
          engine_hint: { type: 'string' }
        },
        required: ['workspace']
      }
    }
  }, async (request, reply) => {
    try {
      const result = xrPro.exportFromWorkspace(
        request.body.workspace,
        request.body.engine_hint
      );
      return { ...result, source: 'Workspace' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // =====================================================
  // IMPORT HINTS
  // =====================================================

  // GET /xr-pro/import-hints/:engine - Get import hints for engine
  fastify.get('/import-hints/:engine', async (request, reply) => {
    const hints = xrPro.getImportHints(request.params.engine);
    return {
      engine: request.params.engine,
      import_hints: hints
    };
  });

  // =====================================================
  // SAFETY
  // =====================================================

  // POST /xr-pro/safety-check - Validate safety
  fastify.post('/safety-check', async (request, reply) => {
    return xrPro.validateSafety();
  });
}
