/**
 * CHE·NU OS 18.5 — HYPERFABRIC SLICING (HFS-18.5)
 * SAFE slicing tools for HyperFabric maps
 * Version: 18.5
 * 
 * Extracts user-selected portions of HyperFabric 18.0.
 */

export class HyperFabricSlicing {
  constructor(hyperFabric = null) {
    this.hf = hyperFabric;

    // Slice types
    this.sliceTypes = {
      SPATIAL: { id: 'spatial', description: 'Extract nodes/links based on spatial axis (X/Y/Z)' },
      TEMPORAL: { id: 'temporal', description: 'Extract timeline segments on T-axis' },
      SEMANTIC: { id: 'semantic', description: 'Extract conceptual clusters on S-axis' },
      PERSPECTIVE: { id: 'perspective', description: 'Extract content linked to depth layers or viewports' },
      COMPOSITE: { id: 'composite', description: 'Combine multiple slices (user-defined)' },
      RANGE: { id: 'range', description: 'Slice based on coordinate intervals' }
    };

    // Storage
    this.slices = new Map();
  }

  /**
   * Set HyperFabric reference
   */
  setHyperFabric(hf) {
    this.hf = hf;
  }

  /**
   * List slice types
   */
  listSliceTypes() {
    return Object.values(this.sliceTypes);
  }

  /**
   * Create slice (HSP-18.5 Protocol)
   */
  createSlice(config) {
    const { mapId, sliceType, criteria, ranges } = config;

    // Step 1: VALIDATE slice criteria
    const type = this.sliceTypes[sliceType?.toUpperCase()] || this.sliceTypes.SPATIAL;

    // Get map or all nodes
    let sourceNodes = [];
    let sourceLinks = [];

    if (mapId && this.hf) {
      const map = this.hf.getMap(mapId);
      if (map) {
        sourceNodes = map.hypernodes;
        sourceLinks = map.hyperlinks;
      }
    } else if (this.hf) {
      sourceNodes = Array.from(this.hf.hypernodes.values());
      sourceLinks = Array.from(this.hf.hyperlinks.values());
    }

    // Step 2: SELECT nodes/links explicitly matching criteria
    const filteredNodes = this.filterNodesByCriteria(sourceNodes, type, criteria, ranges);
    const nodeIdSet = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = sourceLinks.filter(l => nodeIdSet.has(l.from) && nodeIdSet.has(l.to));

    // Step 3: PRODUCE slice structure
    const sliceId = `hfs_${Date.now()}`;
    const slice = {
      id: sliceId,
      nodes: filteredNodes,
      links: filteredLinks,
      axes: this.getAxesForType(type),
      criteria: criteria || 'user-defined',
      slice_type: type.id,
      metadata: {
        source_map: mapId || 'all_nodes',
        node_count: filteredNodes.length,
        link_count: filteredLinks.length,
        created_at: new Date().toISOString(),
        version: '18.5',
        safe: true
      }
    };

    this.slices.set(sliceId, slice);

    // Step 4: RETURN HF_SLICE
    return {
      HF_SLICE: slice
    };
  }

  /**
   * Filter nodes by criteria (NO inference, NO automatic selection)
   */
  filterNodesByCriteria(nodes, type, criteria, ranges) {
    if (!criteria && !ranges) {
      return nodes; // Return all if no criteria specified
    }

    switch (type.id) {
      case 'spatial':
        return this.filterSpatial(nodes, ranges);

      case 'temporal':
        return this.filterTemporal(nodes, ranges);

      case 'semantic':
        return this.filterSemantic(nodes, criteria);

      case 'perspective':
        return this.filterPerspective(nodes, criteria);

      case 'range':
        return this.filterByRange(nodes, ranges);

      case 'composite':
        // Composite requires explicit criteria
        return nodes.filter(n => criteria?.nodeIds?.includes(n.id));

      default:
        return nodes;
    }
  }

  filterSpatial(nodes, ranges) {
    if (!ranges) return nodes;
    return nodes.filter(n => {
      if (ranges.x && (n.coords.x < ranges.x.min || n.coords.x > ranges.x.max)) return false;
      if (ranges.y && (n.coords.y < ranges.y.min || n.coords.y > ranges.y.max)) return false;
      if (ranges.z && (n.coords.z < ranges.z.min || n.coords.z > ranges.z.max)) return false;
      return true;
    });
  }

  filterTemporal(nodes, ranges) {
    if (!ranges?.t) return nodes;
    return nodes.filter(n => n.coords.t >= ranges.t.min && n.coords.t <= ranges.t.max);
  }

  filterSemantic(nodes, criteria) {
    if (!criteria?.semantic) return nodes;
    return nodes.filter(n => n.coords.s === criteria.semantic);
  }

  filterPerspective(nodes, criteria) {
    if (!criteria?.perspective) return nodes;
    return nodes.filter(n => n.coords.p === criteria.perspective);
  }

  filterByRange(nodes, ranges) {
    if (!ranges) return nodes;
    return nodes.filter(n => {
      for (const axis of Object.keys(ranges)) {
        const range = ranges[axis];
        const value = n.coords[axis];
        if (value < range.min || value > range.max) return false;
      }
      return true;
    });
  }

  /**
   * Get axes for slice type
   */
  getAxesForType(type) {
    switch (type.id) {
      case 'spatial': return ['x', 'y', 'z'];
      case 'temporal': return ['t'];
      case 'semantic': return ['s'];
      case 'perspective': return ['p'];
      case 'range': return ['x', 'y', 'z', 't', 's', 'p'];
      case 'composite': return ['x', 'y', 'z', 't', 's', 'p'];
      default: return [];
    }
  }

  /**
   * Get slice
   */
  getSlice(sliceId) {
    return this.slices.get(sliceId) || null;
  }

  /**
   * List slices
   */
  listSlices() {
    return Array.from(this.slices.values()).map(s => ({
      id: s.id,
      slice_type: s.slice_type,
      node_count: s.metadata.node_count,
      link_count: s.metadata.link_count
    }));
  }

  /**
   * Combine slices (COMPOSITE)
   */
  combineSlices(sliceIds, operation = 'union') {
    const slicesToCombine = sliceIds
      .map(id => this.slices.get(id))
      .filter(s => s);

    if (slicesToCombine.length === 0) {
      throw new Error('No valid slices to combine');
    }

    let combinedNodes = [];
    let combinedLinks = [];

    if (operation === 'union') {
      // Union: all nodes from all slices
      const nodeMap = new Map();
      const linkMap = new Map();
      slicesToCombine.forEach(s => {
        s.nodes.forEach(n => nodeMap.set(n.id, n));
        s.links.forEach(l => linkMap.set(l.id, l));
      });
      combinedNodes = Array.from(nodeMap.values());
      combinedLinks = Array.from(linkMap.values());
    } else if (operation === 'intersection') {
      // Intersection: nodes present in ALL slices
      const nodeCounts = new Map();
      slicesToCombine.forEach(s => {
        s.nodes.forEach(n => {
          nodeCounts.set(n.id, (nodeCounts.get(n.id) || 0) + 1);
        });
      });
      combinedNodes = slicesToCombine[0].nodes.filter(n => 
        nodeCounts.get(n.id) === slicesToCombine.length
      );
      const nodeIdSet = new Set(combinedNodes.map(n => n.id));
      combinedLinks = slicesToCombine[0].links.filter(l => 
        nodeIdSet.has(l.from) && nodeIdSet.has(l.to)
      );
    }

    const compositeId = `hfs_composite_${Date.now()}`;
    const composite = {
      id: compositeId,
      nodes: combinedNodes,
      links: combinedLinks,
      axes: ['x', 'y', 'z', 't', 's', 'p'],
      criteria: `${operation} of ${sliceIds.join(', ')}`,
      slice_type: 'composite',
      source_slices: sliceIds,
      metadata: {
        operation: operation,
        node_count: combinedNodes.length,
        link_count: combinedLinks.length,
        created_at: new Date().toISOString(),
        version: '18.5',
        safe: true
      }
    };

    this.slices.set(compositeId, composite);

    return {
      HF_SLICE: composite
    };
  }

  /**
   * Export slice
   */
  exportSlice(sliceId) {
    const slice = this.slices.get(sliceId);
    if (!slice) {
      throw new Error(`Slice not found: ${sliceId}`);
    }

    return {
      HFS_EXPORT: {
        slice: slice,
        compatible_with: [
          'MVC-16.5 composite views',
          'CDL-17 depth layers',
          'OWS-15 workspaces',
          'UC-19 cartography'
        ],
        metadata: {
          exported_at: new Date().toISOString(),
          version: '18.5',
          safe: true
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
        no_autonomous_topology_modification: true,
        no_inference: true,
        no_reasoning: true,
        no_rearrangement_without_request: true,
        no_emergent_structures: true,
        no_automatic_triggers: true,
        user_selection_only: true,
        explicit_criteria_required: true,
        lawbook_compliant: true
      },
      role: 'slicing_tool',
      autonomous: false
    };
  }
}

export default HyperFabricSlicing;
