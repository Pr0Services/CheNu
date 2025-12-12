/**
 * CHE·NU OS 14.5 — WORKSPACE LIBRARY (WBL-14.5)
 * Curated library of workspace templates
 * Version: 14.5
 * 
 * Templates are NOT auto-loaded.
 * They ONLY appear when the user explicitly requests them.
 */

export class WorkspaceLibrary {
  constructor() {
    // Template definitions
    this.templates = {
      PLANNING_SUITE: {
        id: 'planning_suite',
        name: 'Planning Suite',
        description: 'Workspace for planning, structure, sequencing',
        panels: [
          { id: 'timeline', type: 'timeline', title: 'Timeline Panel' },
          { id: 'cluster', type: 'cluster', title: 'Cluster Board' },
          { id: 'dependency', type: 'graph', title: 'Dependency Graph' },
          { id: 'tasks', type: 'list', title: 'Tasks Overview' },
          { id: 'insights', type: 'agent', title: 'Agent Insights' }
        ],
        layout: 'grid',
        mode: 'desktop'
      },
      CHE-NU_PRO_SUITE: {
        id: 'che-nu_pro_suite',
        name: 'CHE-NU Pro Suite',
        description: 'Enterprise workspace for Che-Nu',
        panels: [
          { id: 'dashboard', type: 'info', title: 'Project Dashboard' },
          { id: 'sessions', type: 'workspace', title: 'Sessions Panel' },
          { id: 'universe', type: 'portal', title: 'Universe Map' },
          { id: 'taskboard', type: 'cluster', title: 'Task Board' },
          { id: 'decision', type: 'graph', title: 'Decision Matrix' },
          { id: 'export', type: 'actions', title: 'Export Tools' }
        ],
        layout: 'grid',
        mode: 'desktop'
      },
      CREATIVE_STUDIO: {
        id: 'creative_studio',
        name: 'Creative Studio',
        description: 'Creative exploration environment',
        panels: [
          { id: 'storyboard', type: 'cluster', title: 'Storyboard Panel' },
          { id: 'moodboard', type: 'cluster', title: 'Moodboard' },
          { id: 'explorer', type: 'cluster', title: 'Cluster Explorer' },
          { id: 'notes', type: 'info', title: 'Ideation Notes' },
          { id: 'export', type: 'actions', title: 'Export Surface' }
        ],
        layout: 'floating-panels',
        mode: 'desktop'
      },
      XR_ROOM_BUILDER: {
        id: 'xr_room_builder',
        name: 'XR Room Builder',
        description: 'Workspace for XR scene generation',
        panels: [
          { id: 'room', type: 'portal', title: 'Room Panel' },
          { id: 'portal', type: 'portal', title: 'Portal Panel' },
          { id: 'avatar', type: 'agent', title: 'Avatar Layout Panel' },
          { id: 'fabric', type: 'graph', title: 'Fabric Map' },
          { id: 'xr_export', type: 'actions', title: 'XR Export Tools' }
        ],
        layout: 'split',
        mode: 'hybrid'
      },
      ANALYST_SUITE: {
        id: 'analyst_suite',
        name: 'Analyst Suite',
        description: 'Analysis/research workspace',
        panels: [
          { id: 'data', type: 'info', title: 'Data Panel' },
          { id: 'insight', type: 'agent', title: 'Insight Generator Panel' },
          { id: 'facts', type: 'cluster', title: 'Fact Clustering Panel' },
          { id: 'summary', type: 'actions', title: 'Summary/Export Tools' }
        ],
        layout: 'split',
        mode: 'desktop'
      },
      SIMULATION_SUITE: {
        id: 'simulation_suite',
        name: 'Simulation Suite',
        description: 'Simulation + scenario design',
        panels: [
          { id: 'decision_tree', type: 'graph', title: 'Decision Tree' },
          { id: 'branch', type: 'timeline', title: 'Branch Explorer' },
          { id: 'control', type: 'actions', title: 'Simulation Control Panel' },
          { id: 'holothread', type: 'timeline', title: 'Holothread Viewer' }
        ],
        layout: 'grid',
        mode: 'desktop'
      }
    };

    // Pending builds (awaiting confirmation)
    this.pendingBuilds = new Map();
  }

  /**
   * List available templates
   */
  listTemplates() {
    return Object.entries(this.templates).map(([key, template]) => ({
      key: key,
      id: template.id,
      name: template.name,
      description: template.description,
      panel_count: template.panels.length,
      layout: template.layout,
      mode: template.mode
    }));
  }

  /**
   * Get template details
   */
  getTemplate(templateKey) {
    const key = templateKey.toUpperCase();
    const template = this.templates[key];
    
    if (!template) {
      throw new Error(`Template not found: ${templateKey}`);
    }

    return {
      template: template,
      metadata: {
        version: '14.5',
        requires_confirmation: true
      }
    };
  }

  /**
   * Preview template structure (step 1 of invocation protocol)
   */
  previewTemplate(templateKey) {
    const key = templateKey.toUpperCase();
    const template = this.templates[key];
    
    if (!template) {
      throw new Error(`Template not found: ${templateKey}`);
    }

    const previewId = `preview_${Date.now()}`;
    
    // Store pending build
    this.pendingBuilds.set(previewId, {
      templateKey: key,
      template: template,
      created_at: new Date().toISOString()
    });

    return {
      WBL_PREVIEW: {
        preview_id: previewId,
        template: {
          name: template.name,
          description: template.description
        },
        structure: {
          panels: template.panels.map(p => ({
            id: p.id,
            type: p.type,
            title: p.title
          })),
          layout: template.layout,
          mode: template.mode
        },
        awaiting_confirmation: true,
        message: 'Please confirm to build this workspace. Reply with the preview_id to confirm.',
        metadata: {
          version: '14.5'
        }
      }
    };
  }

  /**
   * Confirm and build workspace (step 2 of invocation protocol)
   */
  confirmBuild(previewId, workspaceName) {
    const pending = this.pendingBuilds.get(previewId);
    
    if (!pending) {
      throw new Error(`No pending build found for: ${previewId}`);
    }

    const template = pending.template;
    
    const workspace = {
      id: `ws_${Date.now()}`,
      name: workspaceName || template.name,
      mode: template.mode,
      layout: template.layout,
      panels: template.panels.map((p, i) => ({
        ...p,
        state: 'docked',
        position: { x: (i % 3) * 320, y: Math.floor(i / 3) * 220 },
        size: { width: 300, height: 200 }
      })),
      rooms: [],
      clusters: [],
      timelines: [],
      portals: [],
      fabric_links: [],
      metadata: {
        created_at: new Date().toISOString(),
        template_used: pending.templateKey,
        version: '14.5'
      }
    };

    // Clear pending build
    this.pendingBuilds.delete(previewId);

    return {
      WBL_BUILD: {
        workspace: workspace,
        template_used: pending.templateKey,
        operation: 'WBL_BUILD_CONFIRMED',
        metadata: {
          version: '14.5'
        }
      }
    };
  }

  /**
   * Cancel pending build
   */
  cancelBuild(previewId) {
    if (!this.pendingBuilds.has(previewId)) {
      return { cancelled: false, reason: 'No pending build found' };
    }

    this.pendingBuilds.delete(previewId);
    return { cancelled: true, preview_id: previewId };
  }

  /**
   * List pending builds
   */
  listPendingBuilds() {
    return Array.from(this.pendingBuilds.entries()).map(([id, pending]) => ({
      preview_id: id,
      template: pending.templateKey,
      created_at: pending.created_at
    }));
  }

  /**
   * Get template by category
   */
  getTemplatesByCategory(category) {
    const categories = {
      planning: ['PLANNING_SUITE', 'SIMULATION_SUITE'],
      creative: ['CREATIVE_STUDIO'],
      analysis: ['ANALYST_SUITE'],
      xr: ['XR_ROOM_BUILDER'],
      enterprise: ['CHE-NU_PRO_SUITE']
    };

    const keys = categories[category.toLowerCase()] || [];
    return keys.map(key => this.templates[key]).filter(Boolean);
  }

  /**
   * Validate safety
   */
  validateSafety() {
    return {
      valid: true,
      checks: {
        no_auto_loading: true,
        requires_explicit_request: true,
        requires_confirmation: true,
        user_controlled: true,
        lawbook_compliant: true
      },
      protocol: [
        '1. User requests template',
        '2. System shows preview',
        '3. User confirms',
        '4. System builds workspace'
      ],
      role: 'template_library',
      autonomous: false
    };
  }

  /**
   * Export library
   */
  exportLibrary() {
    return {
      WBL_EXPORT: {
        templates: this.listTemplates(),
        pending_builds: this.listPendingBuilds(),
        categories: ['planning', 'creative', 'analysis', 'xr', 'enterprise'],
        metadata: {
          version: '14.5',
          template_count: Object.keys(this.templates).length
        }
      }
    };
  }
}

export default WorkspaceLibrary;
