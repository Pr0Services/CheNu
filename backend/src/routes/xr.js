/**
 * CHE·NU XR Routes
 * XR Gateway and PXR (Persona XR) endpoints
 */

export default async function xrRoutes(fastify, options) {
  
  // POST /xr/render
  fastify.post('/render', {
    schema: {
      description: 'Render an XR scene',
      body: {
        type: 'object',
        properties: {
          room_type: { 
            type: 'string',
            enum: ['decision_chamber', 'collaboration_sphere', 'brainstorm_arena', 
                   'review_theater', 'negotiation_bridge', 'simulation_hall']
          },
          participants: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                persona: { type: 'string' },
                position: { type: 'object' }
              }
            }
          },
          theme: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { room_type, participants, theme } = request.body;
    
    return {
      success: true,
      scene: {
        id: `xr_${Date.now()}`,
        room_type: room_type || 'collaboration_sphere',
        environment: {
          ambient_color: '#1a1a2e',
          lighting: 'soft_ambient',
          particles: true
        },
        participants: (participants || []).map((p, i) => ({
          ...p,
          avatar: {
            geometry: 'sphere',
            color: `hsl(${i * 60}, 70%, 60%)`,
            aura: true
          }
        })),
        metadata: {
          created_at: new Date().toISOString(),
          reversible: true,
          safety_checked: true
        }
      },
      lawbook_notice: 'XR scenes are metaphorical and reversible'
    };
  });

  // GET /xr/rooms
  fastify.get('/rooms', async (request, reply) => {
    return {
      rooms: [
        { id: 'decision_chamber', name: 'Decision Chamber', capacity: 6 },
        { id: 'collaboration_sphere', name: 'Collaboration Sphere', capacity: 12 },
        { id: 'brainstorm_arena', name: 'Brainstorm Arena', capacity: 8 },
        { id: 'review_theater', name: 'Review Theater', capacity: 20 },
        { id: 'negotiation_bridge', name: 'Negotiation Bridge', capacity: 4 },
        { id: 'simulation_hall', name: 'Simulation Hall', capacity: 10 }
      ]
    };
  });

  // POST /xr/persona
  fastify.post('/persona', {
    schema: {
      description: 'Create or update a persona avatar state'
    }
  }, async (request, reply) => {
    const { user_id, persona_config } = request.body || {};
    
    return {
      success: true,
      persona: {
        id: `persona_${user_id || Date.now()}`,
        geometry: persona_config?.geometry || 'sphere',
        color: persona_config?.color || '#667eea',
        aura: {
          enabled: true,
          color: '#a855f7',
          intensity: 0.5
        },
        canonical: true
      }
    };
  });
}
