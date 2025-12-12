/**
 * CHE·NU OS 9.5 — Interaction Layer Routes
 * API endpoints for spatial universe manipulation
 * Version: 9.5
 */

import { InteractionLayer } from '../services/InteractionLayer.js';

export default async function interactionRoutes(fastify, options) {
  const layer = new InteractionLayer();

  // GET /interaction/primitives - Get available primitives
  fastify.get('/primitives', async (request, reply) => {
    return layer.getAvailablePrimitives();
  });

  // GET /interaction/types - Get all interaction types
  fastify.get('/types', async (request, reply) => {
    return layer.getAllInteractionTypes();
  });

  // POST /interaction/select - Select node/room
  fastify.post('/select', {
    schema: {
      body: {
        type: 'object',
        properties: {
          target_id: { type: 'string' }
        },
        required: ['target_id']
      }
    }
  }, async (request, reply) => {
    const result = layer.select(request.body.target_id);
    return result;
  });

  // POST /interaction/focus - Focus on target
  fastify.post('/focus', {
    schema: {
      body: {
        type: 'object',
        properties: {
          target_id: { type: 'string' },
          zoom_level: { type: 'number', default: 1 }
        },
        required: ['target_id']
      }
    }
  }, async (request, reply) => {
    const { target_id, zoom_level } = request.body;
    const result = layer.focus(target_id, zoom_level);
    return result;
  });

  // POST /interaction/expand - Expand node/room
  fastify.post('/expand', {
    schema: {
      body: {
        type: 'object',
        properties: {
          target_id: { type: 'string' }
        },
        required: ['target_id']
      }
    }
  }, async (request, reply) => {
    const result = layer.expand(request.body.target_id);
    return result;
  });

  // POST /interaction/collapse - Collapse node/room
  fastify.post('/collapse', {
    schema: {
      body: {
        type: 'object',
        properties: {
          target_id: { type: 'string' }
        },
        required: ['target_id']
      }
    }
  }, async (request, reply) => {
    const result = layer.collapse(request.body.target_id);
    return result;
  });

  // POST /interaction/navigate - Navigate in universe
  fastify.post('/navigate', {
    schema: {
      body: {
        type: 'object',
        properties: {
          mode: { type: 'string' },
          destination: { type: 'string' }
        },
        required: ['mode']
      }
    }
  }, async (request, reply) => {
    try {
      const { mode, destination } = request.body;
      const result = layer.navigate(mode, destination);
      return result;
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /interaction/link - Link two nodes
  fastify.post('/link', {
    schema: {
      body: {
        type: 'object',
        properties: {
          source_id: { type: 'string' },
          target_id: { type: 'string' }
        },
        required: ['source_id', 'target_id']
      }
    }
  }, async (request, reply) => {
    const { source_id, target_id } = request.body;
    const result = layer.link(source_id, target_id);
    return result;
  });

  // POST /interaction/unlink - Unlink nodes
  fastify.post('/unlink', {
    schema: {
      body: {
        type: 'object',
        properties: {
          source_id: { type: 'string' },
          target_id: { type: 'string' }
        },
        required: ['source_id', 'target_id']
      }
    }
  }, async (request, reply) => {
    const { source_id, target_id } = request.body;
    const result = layer.unlink(source_id, target_id);
    return result;
  });

  // POST /interaction/summon-agent - Summon agent
  fastify.post('/summon-agent', {
    schema: {
      body: {
        type: 'object',
        properties: {
          agent_id: { type: 'string' },
          location: { type: 'string' }
        },
        required: ['agent_id']
      }
    }
  }, async (request, reply) => {
    const { agent_id, location } = request.body;
    const result = layer.summonAgent(agent_id, location || 'central_nexus');
    return result;
  });

  // POST /interaction/pin-panel - Pin UI panel
  fastify.post('/pin-panel', {
    schema: {
      body: {
        type: 'object',
        properties: {
          panel: { type: 'object' },
          room_id: { type: 'string' }
        },
        required: ['room_id']
      }
    }
  }, async (request, reply) => {
    const { panel, room_id } = request.body;
    const result = layer.pinPanel(panel || {}, room_id);
    return result;
  });

  // POST /interaction/portal/activate - Activate portal
  fastify.post('/portal/activate', {
    schema: {
      body: {
        type: 'object',
        properties: {
          portal_id: { type: 'string' },
          style: { type: 'string', default: 'warp' }
        },
        required: ['portal_id']
      }
    }
  }, async (request, reply) => {
    const { portal_id, style } = request.body;
    const result = layer.activatePortal(portal_id, style);
    return result;
  });

  // POST /interaction/portal/preview - Preview portal
  fastify.post('/portal/preview', {
    schema: {
      body: {
        type: 'object',
        properties: {
          portal_id: { type: 'string' }
        },
        required: ['portal_id']
      }
    }
  }, async (request, reply) => {
    const result = layer.previewPortal(request.body.portal_id);
    return result;
  });

  // POST /interaction/timeline/expand - Expand timeline node
  fastify.post('/timeline/expand', {
    schema: {
      body: {
        type: 'object',
        properties: {
          node_id: { type: 'string' }
        },
        required: ['node_id']
      }
    }
  }, async (request, reply) => {
    const result = layer.timelineExpandNode(request.body.node_id);
    return result;
  });

  // POST /interaction/timeline/branch-view - View timeline branches
  fastify.post('/timeline/branch-view', {
    schema: {
      body: {
        type: 'object',
        properties: {
          node_id: { type: 'string' }
        },
        required: ['node_id']
      }
    }
  }, async (request, reply) => {
    const result = layer.timelineBranchView(request.body.node_id);
    return result;
  });

  // POST /interaction/timeline/stitch - Stitch timeline points
  fastify.post('/timeline/stitch', {
    schema: {
      body: {
        type: 'object',
        properties: {
          point_a: { type: 'string' },
          point_b: { type: 'string' }
        },
        required: ['point_a', 'point_b']
      }
    }
  }, async (request, reply) => {
    const { point_a, point_b } = request.body;
    const result = layer.timelineStitch(point_a, point_b);
    return result;
  });

  // POST /interaction/cluster/gather - Gather cluster
  fastify.post('/cluster/gather', {
    schema: {
      body: {
        type: 'object',
        properties: {
          cluster_id: { type: 'string' }
        },
        required: ['cluster_id']
      }
    }
  }, async (request, reply) => {
    const result = layer.clusterGather(request.body.cluster_id);
    return result;
  });

  // POST /interaction/cluster/scatter - Scatter cluster
  fastify.post('/cluster/scatter', {
    schema: {
      body: {
        type: 'object',
        properties: {
          cluster_id: { type: 'string' }
        },
        required: ['cluster_id']
      }
    }
  }, async (request, reply) => {
    const result = layer.clusterScatter(request.body.cluster_id);
    return result;
  });

  // POST /interaction/cluster/sort - Sort cluster
  fastify.post('/cluster/sort', {
    schema: {
      body: {
        type: 'object',
        properties: {
          cluster_id: { type: 'string' },
          sort_by: { type: 'string' }
        },
        required: ['cluster_id', 'sort_by']
      }
    }
  }, async (request, reply) => {
    try {
      const { cluster_id, sort_by } = request.body;
      const result = layer.clusterSort(cluster_id, sort_by);
      return result;
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /interaction/room/:action - Room manipulation
  fastify.post('/room/:action', {
    schema: {
      params: {
        type: 'object',
        properties: {
          action: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          room_id: { type: 'string' }
        },
        required: ['room_id']
      }
    }
  }, async (request, reply) => {
    try {
      const { action } = request.params;
      const { room_id } = request.body;
      const result = layer.manipulateRoom(room_id, action);
      return result;
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // POST /interaction/undo - Undo last interaction
  fastify.post('/undo', async (request, reply) => {
    const result = layer.undo();
    return result;
  });

  // GET /interaction/history - Get interaction history
  fastify.get('/history', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', default: 10 }
        }
      }
    }
  }, async (request, reply) => {
    const limit = request.query.limit || 10;
    const result = layer.getHistory(limit);
    return result;
  });

  // DELETE /interaction/history - Clear history
  fastify.delete('/history', async (request, reply) => {
    const result = layer.clearHistory();
    return result;
  });

  // POST /interaction/validate - Validate interaction safety
  fastify.post('/validate', {
    schema: {
      body: {
        type: 'object'
      }
    }
  }, async (request, reply) => {
    const validation = layer.validateSafety(request.body);
    return { validation, il_version: '9.5' };
  });
}
