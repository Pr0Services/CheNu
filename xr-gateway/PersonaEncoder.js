/**
 * Persona Encoder
 * Encodes persona states for XR rendering (PXR-1 & PXR-2)
 */

export class PersonaEncoder {
  constructor() {
    this.canonicalGeometries = {
      nova_prime: { shape: 'orb', color: '#ffffff' },
      architect_omega: { shape: 'fractal', color: '#3b82f6' },
      thread_weaver: { shape: 'ribbon', color: '#ec4899' },
      echo_mind: { shape: 'cloud', color: 'gradient' },
      user: { shape: 'sphere', color: '#667eea' }
    };
  }

  encode(persona) {
    const canonical = this.canonicalGeometries[persona.type] || 
                      this.canonicalGeometries.user;
    
    return {
      id: persona.id || `persona_${Date.now()}`,
      geometry: {
        type: canonical.shape,
        scale: persona.scale || 1,
        color: persona.color || canonical.color
      },
      aura: {
        enabled: persona.aura !== false,
        color: persona.aura_color || '#a855f7',
        intensity: persona.aura_intensity || 0.5,
        pulse: persona.pulse || false
      },
      position: persona.position || { x: 0, y: 0, z: 0 },
      rotation: persona.rotation || { x: 0, y: 0, z: 0 },
      animation: persona.animation || 'idle',
      metadata: {
        canonical: true,
        no_autonomy: true,
        no_emotion: true,
        reversible: true
      }
    };
  }

  encodeGroup(personas) {
    return {
      group_id: `group_${Date.now()}`,
      members: personas.map(p => this.encode(p)),
      dynamics: {
        formation: 'circular',
        sync_enabled: true
      }
    };
  }
}

export default PersonaEncoder;
