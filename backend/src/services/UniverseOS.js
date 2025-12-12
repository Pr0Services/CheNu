/**
 * CHE·NU OS 9.0 — UNIVERSEOS
 * Full Spatial Operating Environment
 * Version: 9.0
 */

import { HoloFabricEngine } from './HoloFabricEngine.js';
import { MorphologyEngine } from './MorphologyEngine.js';

export class UniverseOS {
  constructor() {
    this.fabricEngine = new HoloFabricEngine();
    this.morphologyEngine = new MorphologyEngine();
    
    // U-SHELL Configuration
    this.shell = {
      origin: [0, 0, 0],
      root_room: 'central_nexus',
      spatial_units: 'meters (conceptual)',
      gravity: 'none',
      transitions: 'smooth',
      rendering: 'abstract metaphors',
      safety: 'CHE·NU Lawbook enforced'
    };

    // Navigation modes
    this.navModes = {
      orbit: { description: 'Around a center', speed: 1 },
      zoom: { description: 'In/out of clusters', speed: 2 },
      portal_travel: { description: 'Instant transitions', speed: 0 },
      glide: { description: 'Linear movement', speed: 1 },
      pivot: { description: 'Focus change', speed: 0.5 },
      expand: { description: 'Room blooming', speed: 1 },
      collapse: { description: 'Return to Nexus', speed: 0 }
    };

    // Workspace types
    this.workspaceTypes = {
      task_chamber: { geometry: 'chamber', aura: 'focused amber' },
      planning_corridor: { geometry: 'corridor', aura: 'structured blue' },
      brainstorm_arena: { geometry: 'arena', aura: 'creative pink' },
      decision_chamber: { geometry: 'chamber', aura: 'crystal white' },
      simulation_hall: { geometry: 'hall', aura: 'analytic violet' },
      archive_vault: { geometry: 'vault', aura: 'deep indigo' },
      timeline_gallery: { geometry: 'gallery', aura: 'temporal gold' },
      collaboration_sphere: { geometry: 'sphere', aura: 'harmonic teal' }
    };

    // Default spheres
    this.spheres = [
      { id: 'business', color: '#4A90D9', pos: [15, 0, 0] },
      { id: 'personal', color: '#10B981', pos: [-15, 0, 0] },
      { id: 'creative', color: '#E91E63', pos: [0, 0, 15] },
      { id: 'scholar', color: '#9C27B0', pos: [0, 0, -15] },
      { id: 'institutional', color: '#FF9800', pos: [10, 10, 0] },
      { id: 'entertainment', color: '#FF4081', pos: [-10, 10, 0] },
      { id: 'health', color: '#00BCD4', pos: [0, 10, 10] }
    ];

    // Initialize universe
    this.universe = this.initializeUniverse();
  }

  /**
   * Initialize universe structure
   */
  initializeUniverse() {
    return {
      id: `universe_${Date.now()}`,
      shell: this.shell,
      nexus: this.createCentralNexus(),
      spheres: this.spheres,
      rooms: [],
      portals: [],
      agents: [],
      timeline_paths: [],
      ui_surfaces: [],
      metadata: {
        version: '9.0',
        created_at: new Date().toISOString(),
        compliant_with: 'CHE·NU LAWBOOK'
      }
    };
  }

  /**
   * Create Central Nexus (universe desktop)
   */
  createCentralNexus() {
    return {
      id: 'central_nexus',
      type: 'nexus',
      pos: [0, 0, 0],
      geometry: 'sphere',
      aura: 'white clarity',
      features: {
        user_identity_node: { pos: [0, 2, 0], type: 'orb' },
        sphere_orbits: this.spheres.map(s => ({
          sphere_id: s.id,
          orbit_radius: 15,
          color: s.color
        })),
        portal_lines: [],
        timeline_ribbon: { visible: true, pos: [0, 5, 0] },
        avatar_anchors: [],
        interface_panels: []
      }
    };
  }

  /**
   * Create workspace
   */
  createWorkspace(type, config = {}) {
    const workspaceConfig = this.workspaceTypes[type];
    if (!workspaceConfig) {
      throw new Error(`Unknown workspace type: ${type}`);
    }

    const workspace = {
      id: config.id || `workspace_${type}_${Date.now()}`,
      type: type,
      name: config.name || type.replace(/_/g, ' '),
      pos: config.pos || this.calculateNextPosition(),
      geometry: workspaceConfig.geometry,
      aura: workspaceConfig.aura,
      nodes: [],
      portals: [],
      fabric_anchors: [],
      avatar_positions: [],
      ui_surfaces: []
    };

    this.universe.rooms.push(workspace);

    // Auto-connect to nexus
    this.createPortal('central_nexus', workspace.id);

    return workspace;
  }

  /**
   * Calculate next position for new room
   */
  calculateNextPosition() {
    const roomCount = this.universe.rooms.length;
    const angle = (roomCount / 8) * Math.PI * 2;
    const radius = 20 + Math.floor(roomCount / 8) * 10;
    return [
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ];
  }

  /**
   * Create portal between rooms
   */
  createPortal(fromId, toId, transition = 'warp') {
    const portal = {
      id: `portal_${fromId}_${toId}`,
      from: fromId,
      to: toId,
      transition: transition,
      bidirectional: true
    };

    this.universe.portals.push(portal);

    // Update nexus portal lines if connected to nexus
    if (fromId === 'central_nexus') {
      this.universe.nexus.features.portal_lines.push({
        target: toId,
        visible: true
      });
    }

    return portal;
  }

  /**
   * Add sphere to universe
   */
  addSphere(sphereConfig) {
    const sphere = {
      id: sphereConfig.id || `sphere_${Date.now()}`,
      pos: sphereConfig.pos || this.calculateSpherePosition(),
      color: sphereConfig.color || '#888888',
      child_nodes: []
    };

    this.spheres.push(sphere);
    this.universe.spheres = this.spheres;

    return sphere;
  }

  /**
   * Calculate sphere position
   */
  calculateSpherePosition() {
    const count = this.spheres.length;
    const angle = (count / 7) * Math.PI * 2;
    return [
      Math.cos(angle) * 15,
      Math.sin(angle * 0.5) * 5,
      Math.sin(angle) * 15
    ];
  }

  /**
   * Add agent to universe
   */
  addAgent(agentId, anchorZone = 'central_nexus') {
    const morphology = this.morphologyEngine.generateMorphology(agentId);
    
    const agent = {
      id: agentId,
      morphology: morphology.morphology,
      anchor_zone: anchorZone,
      pos: this.getZonePosition(anchorZone),
      behavior: {
        idle: 'symbolic movement',
        focus: 'orientation shift',
        guide: 'subtle beam or highlight'
      },
      autonomous: false // NEVER autonomous
    };

    this.universe.agents.push(agent);
    return agent;
  }

  /**
   * Get position for anchor zone
   */
  getZonePosition(zone) {
    const zonePositions = {
      'central_nexus': [0, 1.6, 2],
      'structure_cluster': [5, 1.6, 0],
      'intent_core': [0, 1.6, 0],
      'timeline_ribbon': [0, 5, 0],
      'simulation_wing': [-5, 1.6, 0],
      'decision_core': [0, 1.6, 5]
    };

    return zonePositions[zone] || [0, 1.6, 0];
  }

  /**
   * Create timeline path
   */
  createTimelinePath(config = {}) {
    const timeline = {
      id: config.id || `timeline_${Date.now()}`,
      holothread_id: config.holothread_id || null,
      path_points: config.path || [[0, 5, -10], [0, 5, 0], [0, 5, 10]],
      nodes: config.nodes || [],
      color: config.color || '#FFC107',
      walkable: true
    };

    this.universe.timeline_paths.push(timeline);
    return timeline;
  }

  /**
   * Add UI surface
   */
  addUISurface(surfaceConfig) {
    const surface = {
      id: surfaceConfig.id || `surface_${Date.now()}`,
      type: surfaceConfig.type || 'panel',
      pos: surfaceConfig.pos || [0, 2, 3],
      size: surfaceConfig.size || [2, 1.5],
      content_type: surfaceConfig.content || 'text',
      room_id: surfaceConfig.room || 'central_nexus',
      safe: true,
      readable: true,
      abstract: true,
      reversible: true
    };

    this.universe.ui_surfaces.push(surface);
    return surface;
  }

  /**
   * Navigate in universe
   */
  navigate(mode, target = null) {
    if (!this.navModes[mode]) {
      throw new Error(`Unknown navigation mode: ${mode}`);
    }

    return {
      mode: mode,
      description: this.navModes[mode].description,
      target: target,
      reversible: true,
      safe: true,
      executed_at: new Date().toISOString()
    };
  }

  /**
   * Export universe for rendering
   */
  exportUniverse() {
    return {
      UNIVERSE_EXPORT: {
        id: this.universe.id,
        shell: this.universe.shell,
        nexus: this.universe.nexus,
        nodes: this.universe.rooms.map(r => ({
          id: r.id,
          type: r.type,
          pos: r.pos
        })),
        rooms: this.universe.rooms,
        portals: this.universe.portals,
        agents: this.universe.agents,
        spheres: this.universe.spheres,
        timeline_paths: this.universe.timeline_paths,
        ui_surfaces: this.universe.ui_surfaces,
        metadata: {
          version: '9.0',
          hfe_compatible: true,
          hce_compatible: true,
          pxr3_compatible: true,
          lawbook_compliant: true
        }
      }
    };
  }

  /**
   * Get universe map
   */
  getUniverseMap() {
    return {
      id: this.universe.id,
      nexus: {
        id: 'central_nexus',
        pos: [0, 0, 0],
        type: 'nexus'
      },
      spheres: this.spheres.map(s => ({
        id: s.id,
        pos: s.pos,
        color: s.color
      })),
      rooms: this.universe.rooms.map(r => ({
        id: r.id,
        type: r.type,
        pos: r.pos,
        connections: this.universe.portals
          .filter(p => p.from === r.id || p.to === r.id)
          .length
      })),
      portal_count: this.universe.portals.length,
      agent_count: this.universe.agents.length,
      timeline_count: this.universe.timeline_paths.length
    };
  }

  /**
   * Validate universe safety
   */
  validateSafety() {
    const violations = [];

    // Check for emotional content
    const universeStr = JSON.stringify(this.universe).toLowerCase();
    const emotionalTerms = ['happy', 'sad', 'angry', 'fear', 'joy', 'pain', 'distress', 'love', 'hate'];
    
    emotionalTerms.forEach(term => {
      if (universeStr.includes(term)) {
        violations.push(`Emotional term detected: ${term}`);
      }
    });

    // Check for autonomous agents
    this.universe.agents.forEach(agent => {
      if (agent.autonomous === true) {
        violations.push(`Autonomous agent detected: ${agent.id}`);
      }
    });

    // Check for dangerous content
    const dangerousTerms = ['violence', 'harm', 'danger', 'weapon', 'kill'];
    dangerousTerms.forEach(term => {
      if (universeStr.includes(term)) {
        violations.push(`Dangerous content detected: ${term}`);
      }
    });

    return {
      valid: violations.length === 0,
      violations: violations,
      lawbook_compliant: violations.length === 0
    };
  }

  /**
   * Get navigation modes
   */
  getNavModes() {
    return Object.entries(this.navModes).map(([key, value]) => ({
      mode: key,
      ...value
    }));
  }

  /**
   * Get workspace types
   */
  getWorkspaceTypes() {
    return Object.entries(this.workspaceTypes).map(([key, value]) => ({
      type: key,
      ...value
    }));
  }

  /**
   * Reset universe
   */
  resetUniverse() {
    this.universe = this.initializeUniverse();
    return this.universe;
  }
}

export default UniverseOS;
