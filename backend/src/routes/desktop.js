/**
 * CHE·NU OS 10.0 — UniverseOS Desktop Mode Routes
 * API endpoints for 2D/2.5D desktop interface
 * Version: 10.0
 */

import { DesktopMode } from '../services/DesktopMode.js';

export default async function desktopRoutes(fastify, options) {
  const desktop = new DesktopMode();

  // GET /desktop - Get current desktop state
  fastify.get('/', async (request, reply) => {
    return {
      state: desktop.getCurrentState(),
      udm_version: '10.0'
    };
  });

  // POST /desktop/reset - Reset desktop state
  fastify.post('/reset', async (request, reply) => {
    const state = desktop.reset();
    return { state, message: 'Desktop reset', udm_version: '10.0' };
  });

  // GET /desktop/views - Get available view types
  fastify.get('/views', async (request, reply) => {
    const views = desktop.getAvailableViews();
    return { views, udm_version: '10.0' };
  });

  // GET /desktop/export - Export desktop state
  fastify.get('/export', async (request, reply) => {
    const exported = desktop.exportDesktop();
    return exported;
  });

  // POST /desktop/import - Import from UniverseOS
  fastify.post('/import', {
    schema: {
      body: {
        type: 'object'
      }
    }
  }, async (request, reply) => {
    const state = desktop.importFromUniverse(request.body);
    return { 
      imported: true, 
      state: desktop.getCurrentState(),
      udm_version: '10.0' 
    };
  });

  // POST /desktop/navigate - Navigate to view
  fastify.post('/navigate', {
    schema: {
      body: {
        type: 'object',
        properties: {
          view_type: { type: 'string' },
          target_id: { type: 'string' }
        },
        required: ['view_type']
      }
    }
  }, async (request, reply) => {
    try {
      const { view_type, target_id } = request.body;
      const result = desktop.navigateTo(view_type, target_id);
      return { navigation: result, udm_version: '10.0' };
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /desktop/back - Navigate back
  fastify.post('/back', async (request, reply) => {
    const result = desktop.navigateBack();
    return { navigation: result, udm_version: '10.0' };
  });

  // POST /desktop/compile/room - Compile room to panel
  fastify.post('/compile/room', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          type: { type: 'string' },
          description: { type: 'string' },
          nodes: { type: 'array' },
          portals: { type: 'array' },
          agents: { type: 'array' },
          pos: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const panel = desktop.compileRoomToPanel(request.body);
    return { panel, udm_version: '10.0' };
  });

  // POST /desktop/compile/portal - Compile portal to link
  fastify.post('/compile/portal', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          from: { type: 'string' },
          to: { type: 'string' },
          transition: { type: 'string' }
        },
        required: ['from', 'to']
      }
    }
  }, async (request, reply) => {
    const link = desktop.compilePortalToLink(request.body);
    return { link, udm_version: '10.0' };
  });

  // POST /desktop/compile/avatar - Compile avatar to icon
  fastify.post('/compile/avatar', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          agent_id: { type: 'string' },
          morphology: { type: 'object' },
          anchor_zone: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const icon = desktop.compileAvatarToIcon(request.body);
    return { icon, udm_version: '10.0' };
  });

  // POST /desktop/compile/timeline - Compile timeline to ribbon
  fastify.post('/compile/timeline', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          holothread_id: { type: 'string' },
          nodes: { type: 'array' },
          path_points: { type: 'array' },
          color: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const ribbon = desktop.compileTimelineToRibbon(request.body);
    return { ribbon, udm_version: '10.0' };
  });

  // POST /desktop/compile/cluster - Compile cluster to UI
  fastify.post('/compile/cluster', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          groups: { type: 'array' },
          nodes: { type: 'array' },
          layout: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { layout, ...cluster } = request.body;
    const ui = desktop.compileClusterToUI(cluster, layout);
    return { cluster_ui: ui, udm_version: '10.0' };
  });

  // GET /desktop/nexus - Get nexus panel
  fastify.get('/nexus', async (request, reply) => {
    const nexus = desktop.desktopState.nexus || desktop.createNexusPanel({
      spheres: desktop.desktopState.spheres,
      portals: desktop.desktopState.portals
    });
    return { nexus, udm_version: '10.0' };
  });

  // POST /desktop/nexus - Create nexus panel from data
  fastify.post('/nexus', {
    schema: {
      body: {
        type: 'object',
        properties: {
          spheres: { type: 'array' },
          portals: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const nexus = desktop.createNexusPanel(request.body);
    desktop.desktopState.nexus = nexus;
    return { nexus, udm_version: '10.0' };
  });

  // POST /desktop/fabric-map - Create fabric map view
  fastify.post('/fabric-map', {
    schema: {
      body: {
        type: 'object',
        properties: {
          rooms: { type: 'array' },
          portals: { type: 'array' },
          holothreads: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const map = desktop.createFabricMapView(request.body);
    return { fabric_map: map, udm_version: '10.0' };
  });

  // POST /desktop/workspace - Create workspace view
  fastify.post('/workspace', {
    schema: {
      body: {
        type: 'object',
        properties: {
          room_id: { type: 'string' },
          agent_insights: { type: 'array' }
        },
        required: ['room_id']
      }
    }
  }, async (request, reply) => {
    const { room_id, agent_insights } = request.body;
    const workspace = desktop.createWorkspaceView(room_id, agent_insights || []);
    return { workspace, udm_version: '10.0' };
  });

  // GET /desktop/navigation - Get navigation panel
  fastify.get('/navigation', async (request, reply) => {
    const nav = desktop.createNavigationPanel(desktop.desktopState.breadcrumbs);
    return { navigation: nav, udm_version: '10.0' };
  });

  // POST /desktop/validate - Validate desktop safety
  fastify.post('/validate', async (request, reply) => {
    const validation = desktop.validateSafety();
    return { validation, udm_version: '10.0' };
  });

  // GET /desktop/breadcrumbs - Get current breadcrumbs
  fastify.get('/breadcrumbs', async (request, reply) => {
    return {
      breadcrumbs: desktop.desktopState.breadcrumbs,
      udm_version: '10.0'
    };
  });
}
