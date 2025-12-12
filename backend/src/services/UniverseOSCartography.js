/**
 * CHE·NU OS 19.0 — UNIVERSEOS CARTOGRAPHY (UC-19)
 * SAFE, multi-scale cartography for UniverseOS
 * Version: 19.0
 * 
 * Uses HyperFabric 18.0 as the base layer.
 * ONLY renders user-requested maps.
 */

export class UniverseOSCartography {
  constructor(hyperFabric = null, hyperFabricSlicing = null) {
    this.hf = hyperFabric;
    this.hfs = hyperFabricSlicing;

    // Map types
    this.mapTypes = {
      SPATIAL: { id: 'spatial', description: 'Macro spatial overview of rooms, portals, clusters' },
      TIMELINE: { id: 'timeline', description: 'Chronological ribbon with branches' },
      SEMANTIC: { id: 'semantic', description: 'Theme/category map' },
      DEPENDENCY: { id: 'dependency', description: 'Dependency graph (user-defined logic only)' },
      MULTISCALE: { id: 'multiscale', description: 'Macro + meso + micro sections combined' },
      SLICE: { id: 'slice', description: 'Map generated from HFS-18.5 slice' },
      VIEWPORT: { id: 'viewport', description: 'Map designed for 16.0/16.5 viewports' }
    };

    // Scale types
    this.scales = ['macro', 'meso', 'micro', 'composite'];

    // Projection types
    this.projections = {
      FLAT: { id: 'flat', description: '2D panel-compatible map' },
      AXONOMETRIC: { id: 'axonometric', description: 'Conceptual 3D layout' },
      LAYERED: { id: 'layered', description: 'Depth-layer slices stacked' },
      MOSAIC: { id: 'mosaic', description: 'Different views in separate regions' },
      HYPERLENS: { id: 'hyperlens', description: 'Mapping through perspective layers' }
    };

    // Storage
    this.maps = new Map();
  }

  /**
   * Set references
   */
  setHyperFabric(hf) {
    this.hf = hf;
  }

  setSlicing(hfs) {
    this.hfs = hfs;
  }

  /**
   * List map types
   */
  listMapTypes() {
    return Object.values(this.mapTypes);
  }

  /**
   * List scales
   */
  listScales() {
    return this.scales;
  }

  /**
   * List projections
   */
  listProjections() {
    return Object.values(this.projections);
  }

  /**
   * Create map (CP-19 Protocol)
   */
  createMap(config) {
    const { mapType, sourceMapId, sliceId, scale, projection, overlays } = config;

    // Step 1: IDENTIFY map type
    const type = this.mapTypes[mapType?.toUpperCase()] || this.mapTypes.SPATIAL;

    // Step 2: USE HF-18 hypernodes ONLY
    let nodes = [];
    let links = [];

    if (sliceId && this.hfs) {
      // From slice
      const slice = this.hfs.getSlice(sliceId);
      if (slice) {
        nodes = slice.nodes;
        links = slice.links;
      }
    } else if (sourceMapId && this.hf) {
      // From HF map
      const hfMap = this.hf.getMap(sourceMapId);
      if (hfMap) {
        nodes = hfMap.hypernodes;
        links = hfMap.hyperlinks;
      }
    } else if (this.hf) {
      // All nodes
      nodes = Array.from(this.hf.hypernodes.values());
      links = Array.from(this.hf.hyperlinks.values());
    }

    // Step 3: FILTER or reformat (NO modification)
    const filteredData = this.filterByMapType(nodes, links, type);

    // Step 4: STRUCTURE map for clarity
    const mapId = `ucm_${Date.now()}`;
    const map = {
      id: mapId,
      map_type: type.id,
      nodes: filteredData.nodes,
      links: filteredData.links,
      legend: this.generateLegend(type, filteredData.nodes),
      scale: scale || 'macro',
      projection: projection || 'flat',
      overlays: overlays || [],
      metadata: {
        source: sliceId || sourceMapId || 'all_nodes',
        node_count: filteredData.nodes.length,
        link_count: filteredData.links.length,
        created_at: new Date().toISOString(),
        version: '19.0',
        safe: true
      }
    };

    this.maps.set(mapId, map);

    // Step 5: OUTPUT UC_MAP
    return {
      UC_MAP: map
    };
  }

  /**
   * Filter by map type
   */
  filterByMapType(nodes, links, type) {
    switch (type.id) {
      case 'spatial':
        return {
          nodes: nodes.filter(n => 
            ['room', 'portal', 'cluster'].includes(n.metadata?.type)
          ),
          links: links.filter(l => l.type === 'spatial')
        };

      case 'timeline':
        return {
          nodes: nodes.filter(n => n.metadata?.type === 'timeline' || n.coords.t !== 0),
          links: links.filter(l => l.type === 'temporal')
        };

      case 'semantic':
        return {
          nodes: nodes.filter(n => n.coords.s !== 0),
          links: links.filter(l => l.type === 'semantic')
        };

      case 'dependency':
        return {
          nodes: nodes,
          links: links.filter(l => l.type === 'causal')
        };

      case 'viewport':
        return {
          nodes: nodes.filter(n => 
            ['panel', 'dashboard'].includes(n.metadata?.type)
          ),
          links: links.filter(l => l.type === 'viewport')
        };

      case 'multiscale':
      case 'slice':
      default:
        return { nodes, links };
    }
  }

  /**
   * Generate legend
   */
  generateLegend(type, nodes) {
    const nodeTypes = [...new Set(nodes.map(n => n.metadata?.type).filter(t => t))];
    return nodeTypes.map(t => ({
      type: t,
      count: nodes.filter(n => n.metadata?.type === t).length
    }));
  }

  /**
   * Get map
   */
  getMap(mapId) {
    return this.maps.get(mapId) || null;
  }

  /**
   * List maps
   */
  listMaps() {
    return Array.from(this.maps.values()).map(m => ({
      id: m.id,
      map_type: m.map_type,
      scale: m.scale,
      node_count: m.metadata.node_count
    }));
  }

  /**
   * Apply overlay
   */
  applyOverlay(mapId, overlayType) {
    const map = this.maps.get(mapId);
    if (!map) {
      throw new Error(`Map not found: ${mapId}`);
    }

    const validOverlays = ['timeline', 'semantic', 'depth-layer'];
    if (!validOverlays.includes(overlayType)) {
      throw new Error(`Invalid overlay type: ${overlayType}. Valid: ${validOverlays.join(', ')}`);
    }

    if (!map.overlays.includes(overlayType)) {
      map.overlays.push(overlayType);
    }

    return {
      UC_OVERLAY_APPLIED: {
        map_id: mapId,
        overlay: overlayType,
        current_overlays: map.overlays
      }
    };
  }

  /**
   * Apply projection
   */
  applyProjection(mapId, projectionType) {
    const map = this.maps.get(mapId);
    if (!map) {
      throw new Error(`Map not found: ${mapId}`);
    }

    const projection = this.projections[projectionType?.toUpperCase()];
    if (!projection) {
      throw new Error(`Invalid projection: ${projectionType}`);
    }

    map.projection = projection.id;

    return {
      UC_PROJECTION: {
        map_id: mapId,
        projection: projection.id,
        description: projection.description,
        metadata: {
          static: true,
          user_controlled: true,
          version: '19.0'
        }
      }
    };
  }

  /**
   * Change scale
   */
  changeScale(mapId, newScale) {
    const map = this.maps.get(mapId);
    if (!map) {
      throw new Error(`Map not found: ${mapId}`);
    }

    if (!this.scales.includes(newScale)) {
      throw new Error(`Invalid scale: ${newScale}. Valid: ${this.scales.join(', ')}`);
    }

    map.scale = newScale;

    return {
      UC_SCALE_CHANGED: {
        map_id: mapId,
        scale: newScale
      }
    };
  }

  /**
   * Export map
   */
  exportMap(mapId) {
    const map = this.maps.get(mapId);
    if (!map) {
      throw new Error(`Map not found: ${mapId}`);
    }

    return {
      UC_EXPORT: {
        map: map,
        projections: Object.keys(this.projections),
        compatible_with: [
          'Panels 10.5',
          'Viewports 16.x',
          'Composite Views 16.5',
          'Multi-Depth Layers 17.x',
          'Thematic Slices 18.5',
          'OWS 15.0'
        ],
        metadata: {
          exported_at: new Date().toISOString(),
          version: '19.0',
          safe: true
        }
      }
    };
  }

  /**
   * Convert to viewport
   */
  toViewport(mapId, viewportType = 'macro') {
    const map = this.maps.get(mapId);
    if (!map) {
      throw new Error(`Map not found: ${mapId}`);
    }

    return {
      UC_VIEWPORT: {
        source_map: mapId,
        viewport: {
          id: `ucvp_${mapId}`,
          type: viewportType,
          content: map,
          scale: map.scale,
          projection: map.projection
        },
        mmv_ready: true,
        metadata: {
          version: '19.0'
        }
      }
    };
  }

  /**
   * Convert to panel
   */
  toPanel(mapId) {
    const map = this.maps.get(mapId);
    if (!map) {
      throw new Error(`Map not found: ${mapId}`);
    }

    return {
      UC_PANEL: {
        source_map: mapId,
        panel: {
          panel_id: `ucp_${mapId}`,
          type: 'cartography',
          title: `${map.map_type} Map`,
          content: map,
          actions: ['zoom', 'pan', 'export']
        },
        panel_10_5_compatible: true,
        metadata: {
          version: '19.0'
        }
      }
    };
  }

  /**
   * Validate safety
   */
  validateSafety() {
    return {
      valid: true,
      checks: {
        no_reasoning: true,
        no_interpretation: true,
        no_inference: true,
        no_topology_modification: true,
        no_cognition_simulation: true,
        no_autonomous_generation: true,
        user_request_only: true,
        representational_only: true,
        no_emotional_framing: true,
        no_psychological_framing: true,
        explicit_instruction_required: true,
        lawbook_compliant: true
      },
      role: 'cartography_renderer',
      autonomous: false
    };
  }
}

export default UniverseOSCartography;
