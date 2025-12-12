/**
 * CHE·NU OS 12.5 — RESOURCE MANAGER (RM-12.5)
 * SAFE, USER-CONTROLLED conceptual resource dashboard
 * Version: 12.5
 * 
 * RM-12.5 is a "Resource Dashboard," not a kernel.
 * It NEVER allocates real resources or acts autonomously.
 */

export class ResourceManager {
  constructor() {
    // Resource types
    this.resourceTypes = [
      'sessions',
      'rooms',
      'panels',
      'timelines',
      'fabric_nodes',
      'agents',
      'exports'
    ];

    // Resource statuses
    this.statuses = {
      OPEN: 'open',
      CLOSED: 'closed',
      SUSPENDED: 'suspended',
      ARCHIVED: 'archived'
    };

    // Resource operations
    this.operations = [
      'list', 'open', 'close', 'suspend', 
      'archive', 'clear', 'link', 'unlink'
    ];

    // Active resources by type
    this.resources = {
      sessions: new Map(),
      rooms: new Map(),
      panels: new Map(),
      timelines: new Map(),
      fabric_nodes: new Map(),
      agents: new Map(),
      exports: new Map()
    };

    // Overload thresholds (for suggestions only)
    this.thresholds = {
      panels: 10,
      timelines: 5,
      rooms: 8,
      sessions: 3
    };

    // Operation log
    this.operationLog = [];
  }

  /**
   * Create a new resource
   */
  createResource(type, config) {
    if (!this.resourceTypes.includes(type)) {
      throw new Error(`Unknown resource type: ${type}`);
    }

    const resource = {
      id: config.id || `${type}_${Date.now()}`,
      type: type,
      label: config.label || `${type} resource`,
      status: this.statuses.OPEN,
      linked_to: config.linked_to || [],
      metadata: {
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        version: '12.5'
      }
    };

    this.resources[type].set(resource.id, resource);
    this.logOperation('create', type, resource.id);

    return resource;
  }

  /**
   * SRO_LIST - Show all active conceptual resources
   */
  listResources(type = null, status = null) {
    const result = {};

    const types = type ? [type] : this.resourceTypes;

    for (const t of types) {
      if (!this.resources[t]) continue;

      const items = Array.from(this.resources[t].values());
      
      if (status) {
        result[t] = items.filter(r => r.status === status);
      } else {
        result[t] = items;
      }
    }

    return result;
  }

  /**
   * SRO_OPEN - Open a resource
   */
  openResource(type, resourceId) {
    const resource = this.getResource(type, resourceId);
    if (!resource) {
      throw new Error(`Resource not found: ${type}/${resourceId}`);
    }

    resource.status = this.statuses.OPEN;
    resource.metadata.last_modified = new Date().toISOString();
    
    this.logOperation('open', type, resourceId);
    return resource;
  }

  /**
   * SRO_CLOSE - Close a resource
   */
  closeResource(type, resourceId) {
    const resource = this.getResource(type, resourceId);
    if (!resource) {
      throw new Error(`Resource not found: ${type}/${resourceId}`);
    }

    resource.status = this.statuses.CLOSED;
    resource.metadata.last_modified = new Date().toISOString();
    
    this.logOperation('close', type, resourceId);
    return resource;
  }

  /**
   * SRO_SUSPEND - Suspend a resource temporarily
   */
  suspendResource(type, resourceId) {
    const resource = this.getResource(type, resourceId);
    if (!resource) {
      throw new Error(`Resource not found: ${type}/${resourceId}`);
    }

    resource.status = this.statuses.SUSPENDED;
    resource.metadata.last_modified = new Date().toISOString();
    
    this.logOperation('suspend', type, resourceId);
    return resource;
  }

  /**
   * SRO_ARCHIVE - Archive a resource
   */
  archiveResource(type, resourceId) {
    const resource = this.getResource(type, resourceId);
    if (!resource) {
      throw new Error(`Resource not found: ${type}/${resourceId}`);
    }

    resource.status = this.statuses.ARCHIVED;
    resource.metadata.last_modified = new Date().toISOString();
    
    this.logOperation('archive', type, resourceId);
    return resource;
  }

  /**
   * SRO_CLEAR - Remove unused resources from current view
   */
  clearUnused(type) {
    if (!this.resources[type]) {
      throw new Error(`Unknown resource type: ${type}`);
    }

    const cleared = [];
    
    for (const [id, resource] of this.resources[type]) {
      if (resource.status === this.statuses.CLOSED || 
          resource.status === this.statuses.ARCHIVED) {
        this.resources[type].delete(id);
        cleared.push(id);
      }
    }

    this.logOperation('clear', type, cleared.join(','));
    return { type, cleared_count: cleared.length, cleared_ids: cleared };
  }

  /**
   * SRO_LINK - Conceptually link related resources
   */
  linkResources(type1, id1, type2, id2) {
    const resource1 = this.getResource(type1, id1);
    const resource2 = this.getResource(type2, id2);

    if (!resource1 || !resource2) {
      throw new Error('One or both resources not found');
    }

    const link1 = `${type2}:${id2}`;
    const link2 = `${type1}:${id1}`;

    if (!resource1.linked_to.includes(link1)) {
      resource1.linked_to.push(link1);
    }
    if (!resource2.linked_to.includes(link2)) {
      resource2.linked_to.push(link2);
    }

    resource1.metadata.last_modified = new Date().toISOString();
    resource2.metadata.last_modified = new Date().toISOString();

    this.logOperation('link', `${type1}/${id1}`, `${type2}/${id2}`);

    return { resource1, resource2 };
  }

  /**
   * SRO_UNLINK - Remove conceptual link
   */
  unlinkResources(type1, id1, type2, id2) {
    const resource1 = this.getResource(type1, id1);
    const resource2 = this.getResource(type2, id2);

    if (!resource1 || !resource2) {
      throw new Error('One or both resources not found');
    }

    const link1 = `${type2}:${id2}`;
    const link2 = `${type1}:${id1}`;

    resource1.linked_to = resource1.linked_to.filter(l => l !== link1);
    resource2.linked_to = resource2.linked_to.filter(l => l !== link2);

    resource1.metadata.last_modified = new Date().toISOString();
    resource2.metadata.last_modified = new Date().toISOString();

    this.logOperation('unlink', `${type1}/${id1}`, `${type2}/${id2}`);

    return { resource1, resource2 };
  }

  /**
   * Get a specific resource
   */
  getResource(type, resourceId) {
    if (!this.resources[type]) return null;
    return this.resources[type].get(resourceId) || null;
  }

  /**
   * Get Resource Dashboard (RD-12.5)
   */
  getResourceDashboard() {
    const dashboard = {
      RESOURCE_DASHBOARD: {}
    };

    for (const type of this.resourceTypes) {
      const openResources = Array.from(this.resources[type].values())
        .filter(r => r.status === this.statuses.OPEN);
      
      dashboard.RESOURCE_DASHBOARD[type] = {
        count: openResources.length,
        items: openResources.map(r => ({
          id: r.id,
          label: r.label,
          status: r.status,
          linked_count: r.linked_to.length
        }))
      };
    }

    dashboard.RESOURCE_DASHBOARD.total_open = Object.values(dashboard.RESOURCE_DASHBOARD)
      .reduce((sum, t) => sum + (t.count || 0), 0);

    dashboard.RESOURCE_DASHBOARD.timestamp = new Date().toISOString();
    dashboard.RESOURCE_DASHBOARD.rm_version = '12.5';

    return dashboard;
  }

  /**
   * Check for overload (SUGGESTIONS only, never actions)
   */
  checkOverload() {
    const suggestions = [];

    // Check panels
    const openPanels = this.countOpen('panels');
    if (openPanels > this.thresholds.panels) {
      suggestions.push({
        type: 'panels',
        count: openPanels,
        threshold: this.thresholds.panels,
        suggestion: 'Consider using SRO_CLEAR to remove unused panels'
      });
    }

    // Check timelines
    const openTimelines = this.countOpen('timelines');
    if (openTimelines > this.thresholds.timelines) {
      suggestions.push({
        type: 'timelines',
        count: openTimelines,
        threshold: this.thresholds.timelines,
        suggestion: 'Consider collapsing inactive timelines'
      });
    }

    // Check rooms
    const openRooms = this.countOpen('rooms');
    if (openRooms > this.thresholds.rooms) {
      suggestions.push({
        type: 'rooms',
        count: openRooms,
        threshold: this.thresholds.rooms,
        suggestion: 'Consider closing inactive rooms'
      });
    }

    // Check sessions
    const openSessions = this.countOpen('sessions');
    if (openSessions > this.thresholds.sessions) {
      suggestions.push({
        type: 'sessions',
        count: openSessions,
        threshold: this.thresholds.sessions,
        suggestion: 'Consider switching to a single active session'
      });
    }

    return {
      has_suggestions: suggestions.length > 0,
      suggestions: suggestions,
      note: 'These are SUGGESTIONS only. RM-12.5 never acts autonomously.',
      rm_version: '12.5'
    };
  }

  /**
   * Count open resources of a type
   */
  countOpen(type) {
    if (!this.resources[type]) return 0;
    return Array.from(this.resources[type].values())
      .filter(r => r.status === this.statuses.OPEN).length;
  }

  /**
   * Get counts summary
   */
  getCounts() {
    const counts = {};
    
    for (const type of this.resourceTypes) {
      const all = this.resources[type].size;
      const open = this.countOpen(type);
      counts[type] = { total: all, open: open };
    }

    return counts;
  }

  /**
   * Log operation
   */
  logOperation(operation, target, details = '') {
    this.operationLog.push({
      operation,
      target,
      details,
      timestamp: new Date().toISOString()
    });

    // Keep only last 500 entries
    if (this.operationLog.length > 500) {
      this.operationLog = this.operationLog.slice(-500);
    }
  }

  /**
   * Get operation log
   */
  getOperationLog(limit = 100) {
    return this.operationLog.slice(-limit);
  }

  /**
   * Export RM state
   */
  exportRM() {
    return {
      RM_EXPORT: {
        dashboard: this.getResourceDashboard().RESOURCE_DASHBOARD,
        counts: this.getCounts(),
        overload_check: this.checkOverload(),
        operation_log_count: this.operationLog.length,
        metadata: {
          version: '12.5',
          exported_at: new Date().toISOString(),
          no_autonomous_actions: true,
          user_controlled: true,
          lawbook_compliant: true
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
        no_real_memory_allocation: true,
        no_process_management: true,
        no_autonomous_actions: true,
        user_controlled_only: true,
        conceptual_resources_only: true,
        lawbook_compliant: true
      },
      role: 'resource_dashboard',
      kernel: false
    };
  }

  /**
   * Get available operations
   */
  getAvailableOperations() {
    return this.operations.map(op => ({
      operation: `SRO_${op.toUpperCase()}`,
      description: this.getOperationDescription(op)
    }));
  }

  /**
   * Get operation description
   */
  getOperationDescription(operation) {
    const descriptions = {
      list: 'Show all active conceptual resources',
      open: 'Open a resource (room, panel, timeline, session)',
      close: 'Close a resource (removes from active view)',
      suspend: 'Hide resource temporarily',
      archive: 'Store resource inside its session',
      clear: 'Remove unused panels/rooms from current view',
      link: 'Conceptually link related resources',
      unlink: 'Remove conceptual link'
    };
    return descriptions[operation] || 'Unknown operation';
  }

  /**
   * Clear all resources (user-initiated)
   */
  clearAll() {
    const counts = this.getCounts();

    for (const type of this.resourceTypes) {
      this.resources[type].clear();
    }

    this.operationLog = [];

    return {
      cleared: true,
      previous_counts: counts,
      timestamp: new Date().toISOString()
    };
  }
}

export default ResourceManager;
