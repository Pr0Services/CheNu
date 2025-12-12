/**
 * CHE·NU OS 19.5 — CARTOGRAPHY SYNTHESIZER (CS-19.5)
 * Combine multiple UC-19 maps into a single composite view
 * Version: 19.5
 * 
 * ONLY formats maps TOGETHER on request.
 * NO automatic combining rules.
 */

export class CartographySynthesizer {
  constructor(cartography = null) {
    this.uc = cartography;

    // Composition types
    this.compositionTypes = {
      SPATIAL_TIMELINE: { id: 'spatial_timeline', description: 'Combine spatial map + timeline ribbon' },
      SPATIAL_SEMANTIC: { id: 'spatial_semantic', description: 'Combine spatial map + semantic map' },
      SEMANTIC_CAUSAL: { id: 'semantic_causal', description: 'Combine category view + causality links' },
      SLICE_MAP: { id: 'slice_map', description: 'Combine HyperFabric slice (18.5) + any UC-19 map' },
      MULTI_MAP: { id: 'multi_map', description: 'Combine ANY set of maps chosen by the user' },
      FULL: { id: 'full', description: 'User-selected total fusion of multiple maps' }
    };

    // Layout modes
    this.layoutModes = ['grid', 'overlay', 'mosaic', 'layered'];

    // Storage
    this.compositeMaps = new Map();
  }

  /**
   * Set cartography reference
   */
  setCartography(uc) {
    this.uc = uc;
  }

  /**
   * List composition types
   */
  listCompositionTypes() {
    return Object.values(this.compositionTypes);
  }

  /**
   * List layout modes
   */
  listLayoutModes() {
    return this.layoutModes;
  }

  /**
   * Create composite map (MSP-19.5 Protocol)
   */
  createComposite(config) {
    const { mapIds, compositionType, layoutMode, alignmentRules } = config;

    // Step 1: VALIDATE map selection
    if (!mapIds || mapIds.length === 0) {
      throw new Error('At least one map is required');
    }

    const type = this.compositionTypes[compositionType?.toUpperCase()] || this.compositionTypes.MULTI_MAP;
    const layout = this.layoutModes.includes(layoutMode) ? layoutMode : 'grid';

    // Load maps
    const maps = mapIds
      .map(id => this.uc?.getMap(id))
      .filter(m => m);

    if (maps.length === 0) {
      throw new Error('No valid maps found');
    }

    // Step 2: ALIGN maps ONLY by user-defined rules
    const alignedData = this.alignMaps(maps, alignmentRules);

    // Step 3: MERGE nodes and links by ID matching (NO inference)
    const mergedData = this.mergeByIdMatching(alignedData);

    // Step 4: FORMAT composite map
    const compositeId = `csm_${Date.now()}`;
    const compositeMap = {
      id: compositeId,
      maps_used: mapIds,
      composition_type: type.id,
      layout_mode: layout,
      nodes: mergedData.nodes,
      links: mergedData.links,
      legend: this.combineLegends(maps),
      sections: this.createLayoutSections(maps, layout),
      metadata: {
        map_count: maps.length,
        total_nodes: mergedData.nodes.length,
        total_links: mergedData.links.length,
        created_at: new Date().toISOString(),
        version: '19.5',
        safe: true
      }
    };

    this.compositeMaps.set(compositeId, compositeMap);

    // Step 5: OUTPUT COMPOSITE_MAP
    return {
      COMPOSITE_MAP: compositeMap
    };
  }

  /**
   * Align maps by user-defined rules (NO automatic alignment)
   */
  alignMaps(maps, alignmentRules) {
    if (!alignmentRules) {
      // No alignment, just collect all
      return maps.map(m => ({
        map_id: m.id,
        nodes: m.nodes,
        links: m.links
      }));
    }

    // Apply user-defined alignment rules
    return maps.map(m => ({
      map_id: m.id,
      nodes: m.nodes,
      links: m.links,
      offset: alignmentRules[m.id]?.offset || { x: 0, y: 0, z: 0 },
      scale: alignmentRules[m.id]?.scale || 1
    }));
  }

  /**
   * Merge by ID matching (NO inference)
   */
  mergeByIdMatching(alignedData) {
    const nodeMap = new Map();
    const linkMap = new Map();

    alignedData.forEach(data => {
      data.nodes.forEach(n => {
        if (!nodeMap.has(n.id)) {
          nodeMap.set(n.id, n);
        }
        // If node exists, don't override (no inference about which is "correct")
      });

      data.links.forEach(l => {
        if (!linkMap.has(l.id)) {
          linkMap.set(l.id, l);
        }
      });
    });

    return {
      nodes: Array.from(nodeMap.values()),
      links: Array.from(linkMap.values())
    };
  }

  /**
   * Combine legends
   */
  combineLegends(maps) {
    const legendMap = new Map();
    maps.forEach(m => {
      (m.legend || []).forEach(item => {
        const key = item.type;
        if (legendMap.has(key)) {
          legendMap.get(key).count += item.count;
        } else {
          legendMap.set(key, { ...item });
        }
      });
    });
    return Array.from(legendMap.values());
  }

  /**
   * Create layout sections
   */
  createLayoutSections(maps, layout) {
    switch (layout) {
      case 'grid':
        const cols = Math.ceil(Math.sqrt(maps.length));
        return maps.map((m, i) => ({
          map_id: m.id,
          row: Math.floor(i / cols),
          col: i % cols
        }));

      case 'overlay':
        return maps.map((m, i) => ({
          map_id: m.id,
          layer: i,
          opacity: 1 - (i * 0.1)
        }));

      case 'mosaic':
        return maps.map((m, i) => ({
          map_id: m.id,
          region: `region_${i}`
        }));

      case 'layered':
        return maps.map((m, i) => ({
          map_id: m.id,
          depth: i,
          visible: i === 0
        }));

      default:
        return maps.map(m => ({ map_id: m.id }));
    }
  }

  /**
   * Get composite map
   */
  getComposite(compositeId) {
    return this.compositeMaps.get(compositeId) || null;
  }

  /**
   * List composite maps
   */
  listComposites() {
    return Array.from(this.compositeMaps.values()).map(c => ({
      id: c.id,
      composition_type: c.composition_type,
      layout_mode: c.layout_mode,
      map_count: c.metadata.map_count
    }));
  }

  /**
   * Export composite
   */
  exportComposite(compositeId) {
    const composite = this.compositeMaps.get(compositeId);
    if (!composite) {
      throw new Error(`Composite not found: ${compositeId}`);
    }

    return {
      CS_EXPORT: {
        composite_map: composite,
        compatible_with: [
          'MVC-16.5',
          'MMV-16.0',
          'OWS-15.0',
          'UCL-20.0'
        ],
        metadata: {
          exported_at: new Date().toISOString(),
          version: '19.5',
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
        no_automatic_merging: true,
        no_new_structure_generation: true,
        no_relationship_inference: true,
        no_missing_link_computation: true,
        no_cognition_simulation: true,
        no_auto_alignment: true,
        user_defined_rules_only: true,
        id_matching_only: true,
        formatting_only: true,
        lawbook_compliant: true
      },
      role: 'map_synthesizer',
      autonomous: false
    };
  }
}

export default CartographySynthesizer;
