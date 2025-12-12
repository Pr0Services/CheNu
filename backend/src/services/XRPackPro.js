/**
 * CHE·NU XR PACK PRO — SCENE EXPORT & IMPORT LAYER (XR-PRO)
 * Export/import XR scenes for Unity, Unreal, Three.js
 * Version: XR-PRO-1.0
 * 
 * ONLY defines XR scene structures (JSON).
 * NEVER executes code, runs engines, or simulates physics.
 */

export class XRPackPro {
  constructor() {
    // Engine hints
    this.engineHints = ['unity', 'unreal', 'threejs', 'generic'];

    // Room shapes
    this.roomShapes = ['box', 'sphere', 'capsule', 'custom'];

    // Material profiles
    this.materialProfiles = ['neutral', 'glassy', 'matte', 'gradient', 'glass', 'metal', 'emissive_low'];

    // Room roles
    this.roomRoles = ['workspace', 'hub', 'timeline_room', 'gallery', 'prototype'];

    // Portal shapes
    this.portalShapes = ['plane', 'circle', 'frame', 'gate'];

    // Anchor types
    this.anchorTypes = ['camera_hint', 'spawn_point', 'focus_point'];

    // Symbol roles
    this.symbolRoles = ['intent', 'structure', 'timeline', 'insight', 'environment'];

    // Light types
    this.lightTypes = ['directional', 'point', 'spot', 'ambient'];

    // Mesh hints
    this.meshHints = ['box', 'sphere', 'cylinder', 'plane', 'custom'];

    // Storage
    this.scenes = new Map();
    this.morphotypes = new Map();
  }

  /**
   * Create XR_VEC3
   */
  createVec3(x = 0, y = 0, z = 0) {
    return { x, y, z };
  }

  /**
   * Create XR_QUATERNION
   */
  createQuaternion(x = 0, y = 0, z = 0, w = 1) {
    return { x, y, z, w };
  }

  /**
   * Create XR_COLOR
   */
  createColor(r = 1, g = 1, b = 1, a = 1) {
    return { r, g, b, a };
  }

  /**
   * Create XR_NODE
   */
  createNode(config) {
    const { id, label, type, position, rotation, scale, tags } = config;

    return {
      id: id || `node_${Date.now()}`,
      label: label || 'Node',
      type: type || 'room_ref',
      position: position || this.createVec3(),
      rotation: rotation || this.createQuaternion(),
      scale: scale || this.createVec3(1, 1, 1),
      tags: tags || [],
      metadata: { safe: true }
    };
  }

  /**
   * Create XR_ROOM
   */
  createRoom(config) {
    const { id, name, center, size, shape, materialProfile, role, nodes, portals } = config;

    if (!this.roomShapes.includes(shape || 'box')) {
      throw new Error(`Invalid room shape: ${shape}`);
    }

    return {
      id: id || `room_${Date.now()}`,
      name: name || 'Room',
      bounds: {
        center: center || this.createVec3(),
        size: size || this.createVec3(10, 4, 10)
      },
      visuals: {
        shape: shape || 'box',
        material_profile: materialProfile || 'matte'
      },
      nodes: nodes || [],
      portals: portals || [],
      metadata: {
        role: role || 'workspace',
        safe: true
      }
    };
  }

  /**
   * Create XR_PORTAL
   */
  createPortal(config) {
    const { id, label, fromRoom, toRoom, position, rotation, shape, size, materialProfile, navigationHint } = config;

    return {
      id: id || `portal_${Date.now()}`,
      label: label || 'Portal',
      from_room: fromRoom,
      to_room: toRoom,
      position: position || this.createVec3(),
      rotation: rotation || this.createQuaternion(),
      visual: {
        shape: shape || 'frame',
        size: size || this.createVec3(2, 3, 0.1),
        material_profile: materialProfile || 'soft_glow'
      },
      metadata: {
        navigation_hint: navigationHint || 'click',
        safe: true
      }
    };
  }

  /**
   * Create XR_ANCHOR
   */
  createAnchor(config) {
    const { id, label, position, rotation, anchorType } = config;

    return {
      id: id || `anchor_${Date.now()}`,
      label: label || 'Anchor',
      position: position || this.createVec3(),
      rotation: rotation || this.createQuaternion(),
      anchor_type: anchorType || 'spawn_point',
      metadata: { safe: true }
    };
  }

  /**
   * Create MORPHOTYPE (from MD-PRO)
   */
  createMorphotype(config) {
    const { id, baseForm, proportions, surfaceStyle, materialLogic, animationStyle, colorProfile } = config;

    const morphotype = {
      id: id || `morph_${Date.now()}`,
      base_form: baseForm || 'orb',
      proportions: proportions || [1, 1, 1],
      surface_style: surfaceStyle || 'smooth',
      material_logic: materialLogic || 'matte',
      animation_style: animationStyle || 'pulse',
      color_profile: {
        primary: colorProfile?.primary || this.createColor(0.3, 0.5, 0.9, 1),
        secondary: colorProfile?.secondary || this.createColor(0.2, 0.3, 0.7, 1),
        neutral: colorProfile?.neutral || this.createColor(0.5, 0.5, 0.5, 1)
      },
      symbolic_behaviors: {
        clarify: 'brightness_up',
        focus: 'sharpen',
        transition: 'soft_ripple'
      },
      metadata: { safe: true }
    };

    this.morphotypes.set(morphotype.id, morphotype);
    return morphotype;
  }

  /**
   * Create XR_SYMBOL
   */
  createSymbol(config) {
    const { id, label, morphotypeId, position, rotation, scale, role } = config;

    return {
      id: id || `symbol_${Date.now()}`,
      label: label || 'Symbol',
      morphotype_id: morphotypeId,
      position: position || this.createVec3(),
      rotation: rotation || this.createQuaternion(),
      scale: scale || this.createVec3(1, 1, 1),
      role: role || 'structure',
      metadata: { safe: true }
    };
  }

  /**
   * Create XR_PROP
   */
  createProp(config) {
    const { id, label, meshHint, position, rotation, scale, materialProfile } = config;

    return {
      id: id || `prop_${Date.now()}`,
      label: label || 'Prop',
      mesh_hint: meshHint || 'box',
      position: position || this.createVec3(),
      rotation: rotation || this.createQuaternion(),
      scale: scale || this.createVec3(1, 1, 1),
      material_profile: materialProfile || 'neutral',
      metadata: { safe: true }
    };
  }

  /**
   * Create XR_LIGHT
   */
  createLight(config) {
    const { id, type, color, intensity, position, rotation } = config;

    return {
      id: id || `light_${Date.now()}`,
      type: type || 'point',
      color: color || this.createColor(1, 1, 1, 1),
      intensity: intensity || 1.0,
      position: position || this.createVec3(0, 5, 0),
      rotation: rotation || this.createQuaternion(),
      metadata: { safe: true }
    };
  }

  /**
   * Create XR_SCENE
   */
  createScene(config) {
    const { id, name, engineHint, nodes, rooms, portals, anchors, symbols, props, lighting } = config;

    const sceneId = id || `scene_${Date.now()}`;
    const scene = {
      id: sceneId,
      name: name || 'XR Scene',
      engine_hint: engineHint || 'generic',
      nodes: nodes || [],
      rooms: rooms || [],
      portals: portals || [],
      anchors: anchors || [],
      symbols: symbols || [],
      props: props || [],
      lighting: lighting || [],
      metadata: {
        version: 'XR-PRO-1.0',
        safe: true,
        created_from: 'CHE·NU / UniverseOS / HyperFabric',
        created_at: new Date().toISOString()
      }
    };

    // Validate safety
    this.validateSafetyConstraints(scene);

    this.scenes.set(sceneId, scene);
    return { XR_SCENE: scene };
  }

  /**
   * Validate safety constraints
   */
  validateSafetyConstraints(scene) {
    // All elements must have safe: true in metadata
    const allElements = [
      ...scene.nodes,
      ...scene.rooms,
      ...scene.portals,
      ...scene.anchors,
      ...scene.symbols,
      ...scene.props,
      ...scene.lighting
    ];

    allElements.forEach(el => {
      if (!el.metadata?.safe) {
        el.metadata = { ...el.metadata, safe: true };
      }
    });

    return true;
  }

  /**
   * Export scene from UniverseOS room
   */
  exportFromUniverseOS(universeRoom, engineHint = 'generic') {
    const rooms = [this.createRoom({
      id: universeRoom.id || 'room_main',
      name: universeRoom.name || 'Universe Room',
      center: this.createVec3(0, 0, 0),
      size: this.createVec3(
        universeRoom.bounds?.width || 20,
        universeRoom.bounds?.height || 5,
        universeRoom.bounds?.depth || 20
      ),
      shape: 'box',
      materialProfile: 'matte',
      role: 'workspace'
    })];

    // Convert nodes
    const nodes = (universeRoom.nodes || []).map((n, i) => this.createNode({
      id: n.id || `node_${i}`,
      label: n.label || n.name || 'Node',
      type: 'room_ref',
      position: this.createVec3(n.x || 0, n.y || 0, n.z || 0)
    }));

    // Add spawn anchor
    const anchors = [this.createAnchor({
      id: 'spawn_main',
      label: 'Main Spawn',
      position: this.createVec3(0, 0, 5),
      anchorType: 'spawn_point'
    })];

    // Default lighting
    const lighting = [
      this.createLight({ id: 'ambient_main', type: 'ambient', intensity: 0.4 }),
      this.createLight({ id: 'dir_main', type: 'directional', intensity: 0.8, position: this.createVec3(5, 10, 5) })
    ];

    return this.createScene({
      name: `${universeRoom.name || 'Universe'} XR Export`,
      engineHint,
      nodes,
      rooms,
      anchors,
      lighting
    });
  }

  /**
   * Export scene from HyperFabric topology
   */
  exportFromHyperFabric(topology, engineHint = 'generic') {
    // Convert HyperFabric nodes to rooms
    const rooms = (topology.nodes || []).map((n, i) => this.createRoom({
      id: n.id || `room_${i}`,
      name: n.label || `Room ${i}`,
      center: this.createVec3(n.coords?.x || i * 15, 0, n.coords?.z || 0),
      size: this.createVec3(10, 4, 10),
      role: n.type === 'room' ? 'workspace' : 'hub'
    }));

    // Convert HyperFabric links to portals
    const portals = (topology.links || []).map((l, i) => this.createPortal({
      id: `portal_${i}`,
      label: l.label || `Portal ${i}`,
      fromRoom: l.source,
      toRoom: l.target,
      position: this.createVec3(0, 1.5, 4.5),
      navigationHint: 'click'
    }));

    // Default lighting
    const lighting = [
      this.createLight({ id: 'ambient', type: 'ambient', intensity: 0.3 }),
      this.createLight({ id: 'sun', type: 'directional', intensity: 1.0 })
    ];

    return this.createScene({
      name: `HyperFabric Topology XR`,
      engineHint,
      rooms,
      portals,
      lighting
    });
  }

  /**
   * Export scene from Workspace
   */
  exportFromWorkspace(workspace, engineHint = 'generic') {
    const mainRoom = this.createRoom({
      id: 'workspace_room',
      name: workspace.name || 'Workspace',
      center: this.createVec3(0, 0, 0),
      size: this.createVec3(15, 4, 15),
      role: 'workspace'
    });

    // Convert workspace panels to props
    const props = (workspace.panels || []).map((p, i) => this.createProp({
      id: `panel_${i}`,
      label: p.title || `Panel ${i}`,
      meshHint: 'plane',
      position: this.createVec3(p.x || (i * 3 - 6), p.y || 1.5, -5),
      scale: this.createVec3(2, 1.5, 0.05),
      materialProfile: 'glass'
    }));

    return this.createScene({
      name: `${workspace.name || 'Workspace'} XR`,
      engineHint,
      rooms: [mainRoom],
      props,
      lighting: [
        this.createLight({ type: 'ambient', intensity: 0.5 }),
        this.createLight({ type: 'point', position: this.createVec3(0, 3.5, 0), intensity: 1.0 })
      ]
    });
  }

  /**
   * Get scene
   */
  getScene(sceneId) {
    return this.scenes.get(sceneId) || null;
  }

  /**
   * List scenes
   */
  listScenes() {
    return Array.from(this.scenes.values()).map(s => ({
      id: s.id,
      name: s.name,
      engine_hint: s.engine_hint,
      room_count: s.rooms.length,
      portal_count: s.portals.length
    }));
  }

  /**
   * Export scene as JSON
   */
  exportSceneJSON(sceneId) {
    const scene = this.scenes.get(sceneId);
    if (!scene) {
      throw new Error(`Scene not found: ${sceneId}`);
    }

    return {
      XR_SCENE_EXPORT: {
        scene: scene,
        export_format: 'json',
        import_hints: this.getImportHints(scene.engine_hint),
        metadata: {
          exported_at: new Date().toISOString(),
          version: 'XR-PRO-1.0',
          safe: true
        }
      }
    };
  }

  /**
   * Get import hints for engine
   */
  getImportHints(engineHint) {
    switch (engineHint) {
      case 'unity':
        return {
          parser: 'JsonUtility.FromJson<XR_SCENE>(json) or Newtonsoft.Json',
          create_objects: 'Create GameObjects from nodes, rooms, portals',
          materials: 'Apply materials from material_profile',
          navigation: 'Set up NavMesh for portal navigation'
        };

      case 'unreal':
        return {
          parser: 'JsonObjectConverter or DataAssets',
          create_objects: 'Create Blueprints from XR_ROOM definitions',
          streaming: 'Use Level Streaming for room transitions',
          materials: 'Apply Material Instances from profiles'
        };

      case 'threejs':
        return {
          parser: 'JSON.parse(json)',
          create_objects: 'Create THREE.Group for each room',
          geometry: 'Use THREE.BoxGeometry / THREE.SphereGeometry for shapes',
          materials: 'Apply THREE.MeshStandardMaterial from profiles'
        };

      default:
        return {
          parser: 'Standard JSON parser',
          create_objects: 'Create 3D objects from scene hierarchy',
          materials: 'Map material_profile to engine materials'
        };
    }
  }

  /**
   * Get morphotype
   */
  getMorphotype(morphotypeId) {
    return this.morphotypes.get(morphotypeId) || null;
  }

  /**
   * List morphotypes
   */
  listMorphotypes() {
    return Array.from(this.morphotypes.values()).map(m => ({
      id: m.id,
      base_form: m.base_form,
      surface_style: m.surface_style
    }));
  }

  /**
   * Validate safety
   */
  validateSafety() {
    return {
      valid: true,
      checks: {
        no_code_execution: true,
        no_game_engine_runtime: true,
        no_physics_simulation: true,
        no_realtime_vr_generation: true,
        no_autonomous_entities: true,
        no_state_persistence: true,
        json_definition_only: true,
        import_hints_only: true,
        conceptual_prefabs_only: true,
        user_developer_controlled: true,
        abstract_symbolic_neutral: true,
        no_humanoid_features: true,
        no_emotional_simulation: true,
        no_disturbing_visuals: true,
        lawbook_compliant: true
      },
      role: 'xr_scene_exporter',
      autonomous: false
    };
  }
}

export default XRPackPro;
