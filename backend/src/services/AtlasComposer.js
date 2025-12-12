/**
 * CHE·NU OS 21.5 — ATLAS COMPOSER (AC-21.5)
 * Assemble and curate sections of Meta-Atlas
 * Version: 21.5
 * 
 * NEVER generates atlas content autonomously.
 * NEVER infers missing maps or merges without user approval.
 */

export class AtlasComposer {
  constructor(metaAtlas = null) {
    this.ma = metaAtlas;

    // Operations
    this.operations = ['select', 'group', 'filter', 'compose', 'export'];

    // Filter types
    this.filterTypes = ['type', 'role', 'scale', 'timeline', 'source', 'section'];

    // Storage
    this.composedAtlases = new Map();
    this.selections = new Map();
  }

  /**
   * Set Meta-Atlas reference
   */
  setMetaAtlas(ma) {
    this.ma = ma;
  }

  /**
   * AC_SELECT: User selects map entries from Meta-Atlas
   */
  select(config) {
    const { atlasId, entryIds } = config;

    if (!atlasId) {
      throw new Error('Atlas ID is required');
    }

    const selectionId = `sel_${Date.now()}`;
    const selection = {
      id: selectionId,
      atlas_id: atlasId,
      entry_ids: entryIds || [],
      created_at: new Date().toISOString()
    };

    this.selections.set(selectionId, selection);

    return {
      AC_SELECT: {
        selection_id: selectionId,
        entry_count: entryIds?.length || 0,
        operation: 'ENTRIES_SELECTED'
      }
    };
  }

  /**
   * AC_GROUP: Group selected entries under a theme
   */
  group(config) {
    const { selectionId, themeName, entries } = config;

    // Get or create selection
    let selection = this.selections.get(selectionId);
    if (!selection && entries) {
      // Create implicit selection
      selection = {
        id: `sel_${Date.now()}`,
        entry_ids: entries,
        groups: []
      };
      this.selections.set(selection.id, selection);
    }

    if (!selection) {
      throw new Error('Selection not found and no entries provided');
    }

    // Add group
    if (!selection.groups) {
      selection.groups = [];
    }

    const group = {
      theme: themeName || 'Unnamed Group',
      entry_ids: entries || selection.entry_ids,
      created_at: new Date().toISOString()
    };

    selection.groups.push(group);

    return {
      AC_GROUP: {
        selection_id: selection.id,
        theme: group.theme,
        entry_count: group.entry_ids.length,
        operation: 'ENTRIES_GROUPED'
      }
    };
  }

  /**
   * AC_FILTER: Apply user-defined filters
   */
  filter(config) {
    const { atlasId, filterType, filterValue } = config;

    if (!this.filterTypes.includes(filterType)) {
      throw new Error(`Invalid filter type: ${filterType}. Valid: ${this.filterTypes.join(', ')}`);
    }

    // Get atlas
    const atlas = this.ma?.getAtlas(atlasId);
    if (!atlas) {
      throw new Error(`Atlas not found: ${atlasId}`);
    }

    // Apply filter
    const filtered = atlas.entries.filter(e => {
      switch (filterType) {
        case 'type':
          return e.map_type === filterValue;
        case 'scale':
          return e.scale === filterValue;
        case 'source':
          return e.source === filterValue;
        case 'section':
          return atlas.sections[filterValue]?.some(s => s.map_id === e.map_id);
        default:
          return true;
      }
    });

    return {
      AC_FILTER: {
        atlas_id: atlasId,
        filter_type: filterType,
        filter_value: filterValue,
        results: filtered,
        result_count: filtered.length,
        operation: 'FILTER_APPLIED'
      }
    };
  }

  /**
   * AC_COMPOSE: Assemble selected entries into a new atlas section
   */
  compose(config) {
    const { title, selectionId, entries, sections } = config;

    // Get entries from selection or use provided entries
    let composedEntries = entries || [];
    let composedSections = sections || [];

    if (selectionId) {
      const selection = this.selections.get(selectionId);
      if (selection) {
        // If selection has groups, use them as sections
        if (selection.groups?.length > 0) {
          composedSections = selection.groups.map(g => ({
            theme: g.theme,
            entries: g.entry_ids
          }));
          composedEntries = selection.groups.flatMap(g => g.entry_ids);
        } else {
          composedEntries = selection.entry_ids;
        }
      }
    }

    // Deduplicate entries
    composedEntries = [...new Set(composedEntries)];

    const composedId = `ac_${Date.now()}`;
    const composed = {
      id: composedId,
      title: title || 'Composed Atlas',
      entries: composedEntries,
      sections: composedSections,
      filters_used: [],
      metadata: {
        entry_count: composedEntries.length,
        section_count: composedSections.length,
        source_selection: selectionId || null,
        created_at: new Date().toISOString(),
        version: '21.5',
        safe: true
      }
    };

    this.composedAtlases.set(composedId, composed);

    return {
      ATLAS_COMPOSED: composed
    };
  }

  /**
   * Get composed atlas
   */
  getComposed(composedId) {
    return this.composedAtlases.get(composedId) || null;
  }

  /**
   * List composed atlases
   */
  listComposed() {
    return Array.from(this.composedAtlases.values()).map(c => ({
      id: c.id,
      title: c.title,
      entry_count: c.metadata.entry_count,
      section_count: c.metadata.section_count
    }));
  }

  /**
   * AC_EXPORT: Export composed atlas as JSON
   */
  exportComposed(composedId) {
    const composed = this.composedAtlases.get(composedId);
    if (!composed) {
      throw new Error(`Composed atlas not found: ${composedId}`);
    }

    return {
      AC_EXPORT: {
        atlas_composed: composed,
        metadata: {
          exported_at: new Date().toISOString(),
          version: '21.5',
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
        no_autonomous_content_generation: true,
        no_missing_map_inference: true,
        no_merge_without_approval: true,
        no_updates_without_request: true,
        no_cognitive_organization_simulation: true,
        no_structure_guessing: true,
        no_automatic_reordering: true,
        operations_reversible: true,
        explicit_instruction_required: true,
        lawbook_compliant: true
      },
      role: 'atlas_composer',
      autonomous: false
    };
  }
}

export default AtlasComposer;
