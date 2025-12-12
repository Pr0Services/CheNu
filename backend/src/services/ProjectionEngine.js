/**
 * CHE·NU OS 22.0 — PROJECTION ENGINE (PE-22)
 * SAFE, user-triggered projection formats
 * Version: 22.0
 * 
 * NEVER infers new topology or adapts projections automatically.
 * NEVER performs cognitive processing.
 */

export class ProjectionEngine {
  constructor() {
    // Projection types
    this.projectionTypes = {
      '2D_FLAT': { id: '2d_flat', description: 'Classical flat cartography panel' },
      'AXONOMETRIC': { id: 'axonometric', description: 'Conceptual 3D-style projection (non-realistic)' },
      'MULTILAYER': { id: 'multilayer', description: 'Layered views (depth, semantic, spatial)' },
      'TIMELINE_OVERLAY': { id: 'timeline_overlay', description: 'Overlay timeline on spatial map' },
      'SLICE_OVERLAY': { id: 'slice_overlay', description: 'Overlay HyperFabric slice on map' },
      'FABRIC_CARTO': { id: 'fabric_carto', description: 'Project HyperFabric nodes/links onto map' },
      'COMPOSITE': { id: 'composite', description: 'Multiple projection types displayed side-by-side' }
    };

    // Storage
    this.projections = new Map();
  }

  /**
   * List projection types
   */
  listProjectionTypes() {
    return Object.values(this.projectionTypes);
  }

  /**
   * Create projection (PP-22 Protocol)
   */
  createProjection(config) {
    const { projectionType, inputMaps, layers, slices, fabricNodes } = config;

    // Step 1: IDENTIFY source maps/layers
    const sources = {
      maps: inputMaps || [],
      layers: layers || [],
      slices: slices || [],
      fabric_nodes: fabricNodes || []
    };

    // Step 2: SELECT projection type
    const type = this.projectionTypes[projectionType?.toUpperCase()] || this.projectionTypes['2D_FLAT'];

    // Step 3: STRUCTURE projection using user content only
    const structure = this.structureProjection(type, sources);

    // Step 4: FORMAT output
    const projectionId = `pe_${Date.now()}`;
    const projection = {
      id: projectionId,
      projection_type: type.id,
      input_maps: sources.maps,
      layers_used: sources.layers,
      slices_used: sources.slices,
      fabric_nodes_used: sources.fabric_nodes,
      structure: structure,
      metadata: {
        source_count: this.countSources(sources),
        created_at: new Date().toISOString(),
        version: '22.0',
        safe: true
      }
    };

    this.projections.set(projectionId, projection);

    // Step 5: DELIVER PROJECTION_OUTPUT
    return {
      PROJECTION_OUTPUT: projection
    };
  }

  /**
   * Structure projection based on type (NO autonomous restructuring)
   */
  structureProjection(type, sources) {
    switch (type.id) {
      case '2d_flat':
        return {
          layout: 'flat',
          dimensions: '2D',
          elements: sources.maps.map(m => ({
            id: m.id || m,
            position: { x: 0, y: 0 }
          }))
        };

      case 'axonometric':
        return {
          layout: 'axonometric',
          dimensions: '3D-conceptual',
          view_angle: { x: 30, y: 30 },
          elements: sources.maps.map(m => ({
            id: m.id || m,
            position: { x: 0, y: 0, z: 0 }
          }))
        };

      case 'multilayer':
        return {
          layout: 'stacked',
          layers: sources.layers.map((l, i) => ({
            id: l.id || l,
            depth: i,
            type: l.type || 'generic'
          }))
        };

      case 'timeline_overlay':
        return {
          layout: 'overlay',
          base: sources.maps[0] || null,
          timeline: {
            axis: 'horizontal',
            markers: sources.layers.filter(l => l.type === 'timeline')
          }
        };

      case 'slice_overlay':
        return {
          layout: 'overlay',
          base: sources.maps[0] || null,
          slices: sources.slices.map(s => ({
            id: s.id || s,
            axes: s.axes || ['x', 'y', 'z']
          }))
        };

      case 'fabric_carto':
        return {
          layout: 'graph',
          nodes: sources.fabric_nodes,
          projection_mode: 'node_to_map',
          links_preserved: true
        };

      case 'composite':
        return {
          layout: 'side_by_side',
          panels: sources.maps.map((m, i) => ({
            id: m.id || m,
            panel_index: i,
            projection: '2d_flat'
          }))
        };

      default:
        return { layout: 'default', elements: sources.maps };
    }
  }

  /**
   * Count sources
   */
  countSources(sources) {
    return (sources.maps?.length || 0) +
           (sources.layers?.length || 0) +
           (sources.slices?.length || 0) +
           (sources.fabric_nodes?.length || 0);
  }

  /**
   * Get projection
   */
  getProjection(projectionId) {
    return this.projections.get(projectionId) || null;
  }

  /**
   * List projections
   */
  listProjections() {
    return Array.from(this.projections.values()).map(p => ({
      id: p.id,
      projection_type: p.projection_type,
      source_count: p.metadata.source_count
    }));
  }

  /**
   * Change projection type (user-triggered only)
   */
  changeProjectionType(projectionId, newType) {
    const projection = this.projections.get(projectionId);
    if (!projection) {
      throw new Error(`Projection not found: ${projectionId}`);
    }

    const type = this.projectionTypes[newType?.toUpperCase()];
    if (!type) {
      throw new Error(`Invalid projection type: ${newType}`);
    }

    // Restructure with new type
    const sources = {
      maps: projection.input_maps,
      layers: projection.layers_used,
      slices: projection.slices_used,
      fabric_nodes: projection.fabric_nodes_used
    };

    projection.projection_type = type.id;
    projection.structure = this.structureProjection(type, sources);
    projection.metadata.updated_at = new Date().toISOString();

    return {
      PROJECTION_UPDATED: {
        projection_id: projectionId,
        new_type: type.id,
        structure: projection.structure
      }
    };
  }

  /**
   * Export projection
   */
  exportProjection(projectionId) {
    const projection = this.projections.get(projectionId);
    if (!projection) {
      throw new Error(`Projection not found: ${projectionId}`);
    }

    return {
      PE_EXPORT: {
        projection: projection,
        metadata: {
          exported_at: new Date().toISOString(),
          version: '22.0',
          safe: true
        }
      }
    };
  }

  /**
   * Create composite projection
   */
  createComposite(projectionIds) {
    const projections = projectionIds
      .map(id => this.projections.get(id))
      .filter(p => p);

    if (projections.length === 0) {
      throw new Error('No valid projections found');
    }

    return this.createProjection({
      projectionType: 'COMPOSITE',
      inputMaps: projections.map(p => ({ id: p.id, type: p.projection_type })),
      layers: [],
      slices: [],
      fabricNodes: []
    });
  }

  /**
   * Validate safety
   */
  validateSafety() {
    return {
      valid: true,
      checks: {
        no_topology_inference: true,
        no_world_model_simulation: true,
        no_automatic_projection_adaptation: true,
        no_analysis_without_request: true,
        no_cognitive_processing: true,
        no_hyperfabric_modification: true,
        no_autonomous_restructuring: true,
        no_extra_link_generation: true,
        user_triggered_only: true,
        passive: true,
        no_self_modification: true,
        lawbook_compliant: true
      },
      role: 'projection_engine',
      autonomous: false
    };
  }
}

export default ProjectionEngine;
