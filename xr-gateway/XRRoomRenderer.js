/**
 * XR Room Renderer
 * Generates XR room configurations for Unity/Unreal/WebXR
 */

export class XRRoomRenderer {
  constructor() {
    this.rooms = {
      decision_chamber: {
        name: 'Decision Chamber',
        capacity: 6,
        layout: 'circular',
        ambient: '#1a1a2e'
      },
      collaboration_sphere: {
        name: 'Collaboration Sphere',
        capacity: 12,
        layout: 'spherical',
        ambient: '#0d1b2a'
      },
      brainstorm_arena: {
        name: 'Brainstorm Arena',
        capacity: 8,
        layout: 'open',
        ambient: '#1b263b'
      },
      review_theater: {
        name: 'Review Theater',
        capacity: 20,
        layout: 'theater',
        ambient: '#0f0f23'
      },
      negotiation_bridge: {
        name: 'Negotiation Bridge',
        capacity: 4,
        layout: 'linear',
        ambient: '#1a1a2e'
      },
      simulation_hall: {
        name: 'Simulation Hall',
        capacity: 10,
        layout: 'grid',
        ambient: '#0d1117'
      }
    };
  }

  render(roomType, participants = [], options = {}) {
    const roomConfig = this.rooms[roomType] || this.rooms.collaboration_sphere;
    
    return {
      id: `xr_${Date.now()}`,
      room: roomConfig,
      participants: participants.map((p, i) => ({
        ...p,
        position: this.calculatePosition(i, participants.length, roomConfig.layout),
        avatar: this.createAvatar(p)
      })),
      environment: {
        ambient_color: roomConfig.ambient,
        lighting: options.lighting || 'soft_ambient',
        particles: options.particles !== false,
        fog: options.fog || false
      },
      metadata: {
        created_at: new Date().toISOString(),
        reversible: true,
        safe: true,
        canonical: true
      }
    };
  }

  calculatePosition(index, total, layout) {
    const angle = (2 * Math.PI * index) / total;
    const radius = layout === 'spherical' ? 5 : 3;
    return {
      x: Math.cos(angle) * radius,
      y: 0,
      z: Math.sin(angle) * radius
    };
  }

  createAvatar(participant) {
    return {
      geometry: participant.geometry || 'sphere',
      color: participant.color || `hsl(${Math.random() * 360}, 70%, 60%)`,
      aura: { enabled: true, intensity: 0.5 }
    };
  }
}

export default XRRoomRenderer;
