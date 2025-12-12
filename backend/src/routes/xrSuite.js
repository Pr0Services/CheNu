/**
 * CHE·NU XR SUITE — MASTER BLOCK Routes
 * API endpoints for XR Orchestrator and Scene Builder
 * Version: XR-SUITE-1.0
 */

import { XRSuite, XROrchestrator, XRSceneBuilderAgent } from '../services/XRSuite.js';

export default async function xrSuiteRoutes(fastify, options) {
  // Initialize XR Suite
  const xrSuite = new XRSuite();

  // =====================================================
  // OVERVIEW
  // =====================================================

  // GET /xr-suite - System overview
  fastify.get('/', async (request, reply) => {
    return {
      system: 'CHE·NU XR SUITE — MASTER BLOCK',
      version: 'XR-SUITE-1.0',
      components: {
        orchestrator: {
          role: 'CHE-NU_XR_ORCHESTRATOR',
          purpose: 'Routes XR requests to appropriate handlers',
          request_types: ['scene', 'modification', 'pipeline', 'multiroom']
        },
        sceneBuilder: {
          role: 'CHE-NU_XR_SCENE_BUILDER',
          purpose: 'Generates XR_SCENE JSON from descriptions',
          output: 'XR_SCENE JSON conforming to XR PACK PRO schema'
        }
      },
      pipelines: ['unity', 'unreal', 'threejs', 'generic'],
      safety: {
        autonomous: false,
        code_execution: false,
        vr_rendering: false,
        output_only: ['text', 'json', 'pseudo-code']
      }
    };
  });

  // =====================================================
  // ORCHESTRATOR
  // =====================================================

  // POST /xr-suite/orchestrate - Process XR request through orchestrator
  fastify.post('/orchestrate', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['scene', 'modification', 'pipeline', 'multiroom'] },
          description: { type: 'string' },
          options: { type: 'object' }
        },
        required: ['type', 'description']
      }
    }
  }, async (request, reply) => {
    try {
      const result = xrSuite.process(request.body);
      return { ...result, orchestrator_version: 'XR-SUITE-1.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // =====================================================
  // SCENE BUILDER
  // =====================================================

  // POST /xr-suite/build-scene - Build scene from description
  fastify.post('/build-scene', {
    schema: {
      body: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          engine_hint: { type: 'string' },
          rooms: { type: 'array' },
          portals: { type: 'array' },
          anchors: { type: 'array' },
          props: { type: 'array' },
          lights: { type: 'array' }
        },
        required: ['description']
      }
    }
  }, async (request, reply) => {
    try {
      const result = xrSuite.createScene(request.body.description, {
        engineHint: request.body.engine_hint,
        rooms: request.body.rooms,
        portals: request.body.portals,
        anchors: request.body.anchors,
        props: request.body.props,
        lights: request.body.lights
      });
      return { ...result, builder: 'CHE-NU_XR_SCENE_BUILDER' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /xr-suite/build-multiroom - Build multi-room scene
  fastify.post('/build-multiroom', {
    schema: {
      body: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          room_count: { type: 'integer', minimum: 2, maximum: 10 },
          hub_name: { type: 'string' },
          room_names: { type: 'array', items: { type: 'string' } },
          engine_hint: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = xrSuite.createMultiRoomScene(request.body.description, {
        roomCount: request.body.room_count,
        hubName: request.body.hub_name,
        roomNames: request.body.room_names,
        engineHint: request.body.engine_hint
      });
      return { ...result, builder: 'CHE-NU_XR_SCENE_BUILDER', multiroom: true };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /xr-suite/modify-scene - Modify existing scene
  fastify.post('/modify-scene', {
    schema: {
      body: {
        type: 'object',
        properties: {
          scene_id: { type: 'string' },
          modification: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['add_room', 'add_portal', 'add_prop', 'remove', 'update'] },
              target: { type: 'object' },
              data: { type: 'object' }
            },
            required: ['action']
          }
        },
        required: ['scene_id', 'modification']
      }
    }
  }, async (request, reply) => {
    try {
      const result = xrSuite.sceneBuilder.modifyScene(
        request.body.scene_id,
        request.body.modification
      );
      return result;
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // GET /xr-suite/scenes - List all scenes
  fastify.get('/scenes', async (request, reply) => {
    return { scenes: xrSuite.sceneBuilder.listScenes() };
  });

  // GET /xr-suite/scene/:id - Get specific scene
  fastify.get('/scene/:id', async (request, reply) => {
    const scene = xrSuite.sceneBuilder.getScene(request.params.id);
    if (!scene) {
      return reply.status(404).send({ error: 'Scene not found' });
    }
    return { XR_SCENE: scene };
  });

  // =====================================================
  // PIPELINES
  // =====================================================

  // GET /xr-suite/pipeline/:engine - Get pipeline notes for engine
  fastify.get('/pipeline/:engine', async (request, reply) => {
    const result = xrSuite.getPipelineNotes(request.params.engine);
    return result;
  });

  // GET /xr-suite/pipelines - List all available pipelines
  fastify.get('/pipelines', async (request, reply) => {
    return {
      available: ['unity', 'unreal', 'threejs', 'generic'],
      pipelines: {
        unity: xrSuite.getPipelineNotes('unity'),
        unreal: xrSuite.getPipelineNotes('unreal'),
        threejs: xrSuite.getPipelineNotes('threejs'),
        generic: xrSuite.getPipelineNotes('generic')
      }
    };
  });

  // =====================================================
  // EXAMPLE SCENE
  // =====================================================

  // GET /xr-suite/example - Get example CHE·NU multi-room workspace
  fastify.get('/example', async (request, reply) => {
    const exampleScene = {
      "id": "chenu_scene_01",
      "name": "CHE-NU Concept Workspace v1",
      "engine_hint": "unity",
      "nodes": [],
      "rooms": [
        {
          "id": "room_hub",
          "name": "CHE-NU Hub",
          "bounds": {
            "center": {"x": 0, "y": 0, "z": 0},
            "size": {"x": 12, "y": 4, "z": 12}
          },
          "visuals": {
            "shape": "box",
            "material_profile": "matte"
          },
          "nodes": [],
          "portals": ["portal_hub_to_timeline", "portal_hub_to_archive"],
          "metadata": {
            "role": "workspace",
            "safe": true
          }
        },
        {
          "id": "room_timeline",
          "name": "Timeline Room",
          "bounds": {
            "center": {"x": 18, "y": 0, "z": 0},
            "size": {"x": 14, "y": 4, "z": 8}
          },
          "visuals": {
            "shape": "box",
            "material_profile": "matte"
          },
          "nodes": [],
          "portals": ["portal_timeline_to_hub"],
          "metadata": {
            "role": "timeline_room",
            "safe": true
          }
        },
        {
          "id": "room_archive",
          "name": "Archive Room",
          "bounds": {
            "center": {"x": 0, "y": 0, "z": 18},
            "size": {"x": 10, "y": 4, "z": 10}
          },
          "visuals": {
            "shape": "box",
            "material_profile": "matte"
          },
          "nodes": [],
          "portals": ["portal_archive_to_hub"],
          "metadata": {
            "role": "archive",
            "safe": true
          }
        }
      ],
      "portals": [
        {
          "id": "portal_hub_to_timeline",
          "label": "To Timeline Room",
          "from_room": "room_hub",
          "to_room": "room_timeline",
          "position": {"x": 5.0, "y": 0.0, "z": -5.5},
          "rotation": {"x": 0, "y": 0, "z": 0, "w": 1},
          "visual": {
            "shape": "frame",
            "size": {"x": 2.0, "y": 3.0, "z": 0.1},
            "material_profile": "soft_glow"
          },
          "metadata": {
            "navigation_hint": "click",
            "safe": true
          }
        },
        {
          "id": "portal_timeline_to_hub",
          "label": "Back to Hub",
          "from_room": "room_timeline",
          "to_room": "room_hub",
          "position": {"x": -6.0, "y": 0.0, "z": 0.0},
          "rotation": {"x": 0, "y": 3.14159, "z": 0, "w": 1},
          "visual": {
            "shape": "frame",
            "size": {"x": 2.0, "y": 3.0, "z": 0.1},
            "material_profile": "soft_glow"
          },
          "metadata": {
            "navigation_hint": "click",
            "safe": true
          }
        },
        {
          "id": "portal_hub_to_archive",
          "label": "To Archive Room",
          "from_room": "room_hub",
          "to_room": "room_archive",
          "position": {"x": -5.0, "y": 0.0, "z": 5.5},
          "rotation": {"x": 0, "y": 1.5708, "z": 0, "w": 1},
          "visual": {
            "shape": "frame",
            "size": {"x": 2.0, "y": 3.0, "z": 0.1},
            "material_profile": "soft_glow"
          },
          "metadata": {
            "navigation_hint": "click",
            "safe": true
          }
        },
        {
          "id": "portal_archive_to_hub",
          "label": "Back to Hub",
          "from_room": "room_archive",
          "to_room": "room_hub",
          "position": {"x": 0.0, "y": 0.0, "z": -5.0},
          "rotation": {"x": 0, "y": 3.14159, "z": 0, "w": 1},
          "visual": {
            "shape": "frame",
            "size": {"x": 2.0, "y": 3.0, "z": 0.1},
            "material_profile": "soft_glow"
          },
          "metadata": {
            "navigation_hint": "click",
            "safe": true
          }
        }
      ],
      "anchors": [
        {
          "id": "anchor_start",
          "label": "Start Camera - Hub",
          "position": {"x": 0.0, "y": 1.6, "z": -6.0},
          "rotation": {"x": 0, "y": 0, "z": 0, "w": 1},
          "anchor_type": "camera_hint",
          "metadata": {"safe": true}
        },
        {
          "id": "anchor_timeline_focus",
          "label": "Timeline View",
          "position": {"x": 18.0, "y": 1.6, "z": -4.0},
          "rotation": {"x": 0, "y": 0.5, "z": 0, "w": 1},
          "anchor_type": "focus_point",
          "metadata": {"safe": true}
        }
      ],
      "symbols": [],
      "props": [
        {
          "id": "prop_timeline_strip",
          "label": "Timeline Strip",
          "mesh_hint": "box",
          "position": {"x": 18.0, "y": 1.0, "z": 0.0},
          "rotation": {"x": 0, "y": 0, "z": 0, "w": 1},
          "scale": {"x": 10.0, "y": 0.1, "z": 1.0},
          "material_profile": "neutral",
          "metadata": {"safe": true}
        }
      ],
      "lighting": [
        {
          "id": "light_global",
          "type": "ambient",
          "color": {"r": 1, "g": 1, "b": 1, "a": 1},
          "intensity": 0.4,
          "position": {"x": 0, "y": 0, "z": 0},
          "rotation": {"x": 0, "y": 0, "z": 0, "w": 1},
          "metadata": {"safe": true}
        },
        {
          "id": "light_hub_key",
          "type": "directional",
          "color": {"r": 1, "g": 1, "b": 1, "a": 1},
          "intensity": 1.0,
          "position": {"x": 4, "y": 5, "z": -3},
          "rotation": {"x": 0.2, "y": -0.5, "z": 0, "w": 1},
          "metadata": {"safe": true}
        }
      ],
      "metadata": {
        "version": "XR-PRO-1.0",
        "safe": true,
        "created_from": "CHE-NU XR_SUITE"
      }
    };

    return {
      XR_SCENE_EXAMPLE: exampleScene,
      description: 'CHE·NU Multi-Room Workspace with Hub, Timeline Room, and Archive Room'
    };
  });

  // =====================================================
  // SAFETY
  // =====================================================

  // POST /xr-suite/safety-check - Validate safety
  fastify.post('/safety-check', async (request, reply) => {
    return xrSuite.validateSafety();
  });
}
