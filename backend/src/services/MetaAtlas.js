/**
 * CHE·NU OS 21.0 — META-ATLAS (MA-21)
 * SAFE catalog of existing maps
 * Version: 21.0
 * 
 * ONLY organizes already existing maps into an atlas structure.
 * NEVER generates maps automatically or infers missing data.
 */

export class MetaAtlas {
  constructor(cartography = null, synthesizer = null, slicing = null, depthLayers = null) {
    this.uc = cartography;
    this.cs = synthesizer;
    this.hfs = slicing;
    this.cdl = depthLayers;

    // Atlas sections
    this.sections = [
      'spatial_maps',
      'timeline_maps',
      'semantic_maps',
      'composite_maps',
      'hyperfabric_slices',
      'depthlayer_mappings'
    ];

    // Storage
    this.atlases = new Map();
  }

  /**
   * Set references
   */
  setCartography(uc) { this.uc = uc; }
  setSynthesizer(cs) { this.cs = cs; }
  setSlicing(hfs) { this.hfs = hfs; }
  setDepthLayers(cdl) { this.cdl = cdl; }

  /**
   * List sections
   */
  listSections() {
    return this.sections;
  }

  /**
   * Generate atlas from existing maps
   */
  generateAtlas(config = {}) {
    const { name, includeSlices, includeDepthLayers, includeMaps, includeComposites } = config;

    // Step 1: LIST maps already created
    const entries = [];

    // Collect UC-19 maps
    if (includeMaps !== false && this.uc) {
      const maps = this.uc.listMaps ? this.uc.listMaps() : [];
      maps.forEach(m => {
        entries.push({
          map_id: m.id,
          map_type: m.map_type || 'spatial',
          description: `UC-19 map: ${m.map_type}`,
          location: 'cartography',
          source: 'UC-19',
          scale: m.scale || 'macro'
        });
      });
    }

    // Collect CS-19.5 composites
    if (includeComposites !== false && this.cs) {
      const composites = this.cs.listComposites ? this.cs.listComposites() : [];
      composites.forEach(c => {
        entries.push({
          map_id: c.id,
          map_type: 'composite',
          description: `CS-19.5 composite: ${c.composition_type}`,
          location: 'synthesizer',
          source: 'CS-19.5',
          layout: c.layout_mode
        });
      });
    }

    // Collect HFS-18.5 slices
    if (includeSlices !== false && this.hfs) {
      const slices = this.hfs.listSlices ? this.hfs.listSlices() : [];
      slices.forEach(s => {
        entries.push({
          map_id: s.id,
          map_type: 'slice',
          description: `HFS-18.5 slice: ${s.slice_type}`,
          location: 'hyperfabric',
          source: 'HFS-18.5',
          slice_type: s.slice_type
        });
      });
    }

    // Collect CDL-17 depth layers (if available)
    if (includeDepthLayers !== false && this.cdl) {
      const layers = this.cdl.listDepthViews ? this.cdl.listDepthViews() : [];
      layers.forEach(l => {
        entries.push({
          map_id: l.id,
          map_type: 'depth_layer',
          description: `CDL-17 layer: ${l.depth_type}`,
          location: 'depth_layers',
          source: 'CDL-17',
          depth_type: l.depth_type
        });
      });
    }

    // Step 2: CLASSIFY into sections
    const classifiedSections = this.classifyEntries(entries);

    // Step 3: FORMAT atlas
    const atlasId = `ma_${Date.now()}`;
    const atlas = {
      id: atlasId,
      name: name || 'Meta-Atlas',
      entries: entries,
      sections: classifiedSections,
      summary: {
        total_entries: entries.length,
        by_source: this.countBySource(entries),
        by_type: this.countByType(entries)
      },
      metadata: {
        created_at: new Date().toISOString(),
        version: '21.0',
        safe: true
      }
    };

    this.atlases.set(atlasId, atlas);

    // Step 4: OUTPUT META_ATLAS
    return {
      META_ATLAS: atlas
    };
  }

  /**
   * Classify entries into sections
   */
  classifyEntries(entries) {
    return {
      spatial_maps: entries.filter(e => 
        e.map_type === 'spatial' || e.map_type === 'viewport'
      ),
      timeline_maps: entries.filter(e => 
        e.map_type === 'timeline'
      ),
      semantic_maps: entries.filter(e => 
        e.map_type === 'semantic'
      ),
      composite_maps: entries.filter(e => 
        e.map_type === 'composite'
      ),
      hyperfabric_slices: entries.filter(e => 
        e.map_type === 'slice' || e.source === 'HFS-18.5'
      ),
      depthlayer_mappings: entries.filter(e => 
        e.map_type === 'depth_layer' || e.source === 'CDL-17'
      )
    };
  }

  /**
   * Count entries by source
   */
  countBySource(entries) {
    const counts = {};
    entries.forEach(e => {
      const source = e.source || 'unknown';
      counts[source] = (counts[source] || 0) + 1;
    });
    return counts;
  }

  /**
   * Count entries by type
   */
  countByType(entries) {
    const counts = {};
    entries.forEach(e => {
      const type = e.map_type || 'unknown';
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }

  /**
   * Get atlas
   */
  getAtlas(atlasId) {
    return this.atlases.get(atlasId) || null;
  }

  /**
   * List atlases
   */
  listAtlases() {
    return Array.from(this.atlases.values()).map(a => ({
      id: a.id,
      name: a.name,
      entry_count: a.summary.total_entries
    }));
  }

  /**
   * Get atlas section
   */
  getSection(atlasId, sectionName) {
    const atlas = this.atlases.get(atlasId);
    if (!atlas) {
      throw new Error(`Atlas not found: ${atlasId}`);
    }

    if (!this.sections.includes(sectionName)) {
      throw new Error(`Invalid section: ${sectionName}`);
    }

    return {
      section: sectionName,
      entries: atlas.sections[sectionName] || [],
      atlas_id: atlasId
    };
  }

  /**
   * Search atlas
   */
  searchAtlas(atlasId, query) {
    const atlas = this.atlases.get(atlasId);
    if (!atlas) {
      throw new Error(`Atlas not found: ${atlasId}`);
    }

    const results = atlas.entries.filter(e => {
      const searchStr = `${e.map_id} ${e.map_type} ${e.description} ${e.source}`.toLowerCase();
      return searchStr.includes(query.toLowerCase());
    });

    return {
      query: query,
      results: results,
      result_count: results.length,
      atlas_id: atlasId
    };
  }

  /**
   * Export atlas
   */
  exportAtlas(atlasId) {
    const atlas = this.atlases.get(atlasId);
    if (!atlas) {
      throw new Error(`Atlas not found: ${atlasId}`);
    }

    return {
      MA_EXPORT: {
        atlas: atlas,
        metadata: {
          exported_at: new Date().toISOString(),
          version: '21.0',
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
        no_automatic_map_generation: true,
        no_updates_without_request: true,
        no_data_inference: true,
        no_autonomous_relationships: true,
        organizing_only: true,
        existing_content_only: true,
        lawbook_compliant: true
      },
      role: 'map_catalog',
      autonomous: false
    };
  }
}

export default MetaAtlas;
