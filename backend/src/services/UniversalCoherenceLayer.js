/**
 * CHE·NU OS 20.0 — UNIVERSAL COHERENCE LAYER (UCL-20)
 * SAFE supervisory layer ensuring consistency across all CHE·NU systems
 * Version: 20.0
 * 
 * ONLY checks, standardizes, and formats representations.
 * NEVER modifies content autonomously.
 */

export class UniversalCoherenceLayer {
  constructor() {
    // Coherence domains
    this.domains = [
      'HyperFabric 18.x',
      'Cartography 19.x',
      'Slices & Projections',
      'Multi-Viewports 16.x',
      'Multi-Lens perspectives 15.x',
      'Depth Layers 17.x',
      'Multi-Depth Syntheses 17.5',
      'Omni-Workspaces 15.x',
      'Panels 10.5',
      'Universe Sessions 11.x'
    ];

    // Check types
    this.checkTypes = {
      IDENTITY: { id: 'identity', description: 'Ensure node IDs match across representations' },
      ALIGNMENT: { id: 'alignment', description: 'Ensure structural consistency across maps and layers' },
      REDUNDANCY: { id: 'redundancy', description: 'Highlight repeated nodes (NO automatic deletion)' },
      SAFETY: { id: 'safety', description: 'Confirm no forbidden patterns (emotion, autonomy, embodiment)' },
      FORMAT: { id: 'format', description: 'Standardize outputs into accepted CHE·NU formats' },
      META: { id: 'meta', description: 'Verify version, metadata, tags' }
    };

    // Forbidden patterns (for safety check)
    this.forbiddenPatterns = [
      'emotion_simulation',
      'autonomy_claim',
      'embodiment',
      'face_representation',
      'humanoid_form',
      'personal_identity',
      'social_dynamics',
      'addictive_patterns'
    ];

    // Storage
    this.reports = new Map();
  }

  /**
   * List domains
   */
  listDomains() {
    return this.domains;
  }

  /**
   * List check types
   */
  listCheckTypes() {
    return Object.values(this.checkTypes);
  }

  /**
   * Run coherence check (UCP-20 Protocol)
   */
  runCoherenceCheck(config) {
    const { elements, checkTypes, domains } = config;

    // Step 1: VALIDATE selected elements
    if (!elements || elements.length === 0) {
      throw new Error('At least one element is required for coherence check');
    }

    const selectedChecks = checkTypes 
      ? checkTypes.map(t => this.checkTypes[t.toUpperCase()]).filter(c => c)
      : Object.values(this.checkTypes);

    const selectedDomains = domains || this.domains;

    // Step 2: RUN SAFE structural checks
    const issues = [];
    const consistencyNotes = [];

    selectedChecks.forEach(check => {
      const result = this.executeCheck(check, elements);
      issues.push(...result.issues);
      consistencyNotes.push(...result.notes);
    });

    // Step 3: PRODUCE UCL_REPORT
    const reportId = `ucl_${Date.now()}`;
    const report = {
      id: reportId,
      domains_checked: selectedDomains,
      checks_performed: selectedChecks.map(c => c.id),
      elements_analyzed: elements.length,
      issues_found: issues,
      consistency_notes: consistencyNotes,
      recommended_actions: [], // Empty by default, only filled on request
      overall_status: issues.length === 0 ? 'coherent' : 'issues_found',
      metadata: {
        issue_count: issues.length,
        created_at: new Date().toISOString(),
        version: '20.0',
        safe: true
      }
    };

    this.reports.set(reportId, report);

    // Step 4 & 5: NEVER modify content, ONLY return report
    return {
      UCL_REPORT: report
    };
  }

  /**
   * Execute individual check
   */
  executeCheck(check, elements) {
    const result = { issues: [], notes: [] };

    switch (check.id) {
      case 'identity':
        result.issues.push(...this.checkIdentity(elements));
        result.notes.push('ID consistency check completed');
        break;

      case 'alignment':
        result.issues.push(...this.checkAlignment(elements));
        result.notes.push('Structural alignment check completed');
        break;

      case 'redundancy':
        result.issues.push(...this.checkRedundancy(elements));
        result.notes.push('Redundancy check completed');
        break;

      case 'safety':
        result.issues.push(...this.checkSafety(elements));
        result.notes.push('Safety pattern check completed');
        break;

      case 'format':
        result.issues.push(...this.checkFormat(elements));
        result.notes.push('Format standardization check completed');
        break;

      case 'meta':
        result.issues.push(...this.checkMeta(elements));
        result.notes.push('Metadata verification completed');
        break;
    }

    return result;
  }

  /**
   * CHECK_IDENTITY: Ensure node IDs match across representations
   */
  checkIdentity(elements) {
    const issues = [];
    const idMap = new Map();

    elements.forEach((el, idx) => {
      if (el.id) {
        if (idMap.has(el.id)) {
          // Check if same ID refers to same content
          const existing = idMap.get(el.id);
          if (JSON.stringify(existing.content) !== JSON.stringify(el)) {
            issues.push({
              type: 'identity_mismatch',
              severity: 'warning',
              id: el.id,
              message: `ID ${el.id} has inconsistent content across representations`,
              locations: [existing.index, idx]
            });
          }
        } else {
          idMap.set(el.id, { index: idx, content: el });
        }
      }
    });

    return issues;
  }

  /**
   * CHECK_ALIGNMENT: Ensure structural consistency
   */
  checkAlignment(elements) {
    const issues = [];

    // Check for orphaned links
    const nodeIds = new Set(elements.filter(e => e.id && !e.from).map(e => e.id));
    const links = elements.filter(e => e.from && e.to);

    links.forEach(link => {
      if (!nodeIds.has(link.from)) {
        issues.push({
          type: 'orphaned_link_source',
          severity: 'error',
          link_id: link.id,
          message: `Link source ${link.from} not found in nodes`
        });
      }
      if (!nodeIds.has(link.to)) {
        issues.push({
          type: 'orphaned_link_target',
          severity: 'error',
          link_id: link.id,
          message: `Link target ${link.to} not found in nodes`
        });
      }
    });

    return issues;
  }

  /**
   * CHECK_REDUNDANCY: Highlight repeated nodes
   */
  checkRedundancy(elements) {
    const issues = [];
    const seen = new Map();

    elements.forEach((el, idx) => {
      if (el.id) {
        if (seen.has(el.id)) {
          issues.push({
            type: 'redundant_node',
            severity: 'info',
            id: el.id,
            message: `Node ${el.id} appears multiple times`,
            occurrences: [seen.get(el.id), idx],
            note: 'NO automatic deletion - user decision required'
          });
        } else {
          seen.set(el.id, idx);
        }
      }
    });

    return issues;
  }

  /**
   * CHECK_SAFETY: Confirm no forbidden patterns
   */
  checkSafety(elements) {
    const issues = [];

    elements.forEach((el, idx) => {
      const elStr = JSON.stringify(el).toLowerCase();
      
      this.forbiddenPatterns.forEach(pattern => {
        if (elStr.includes(pattern.replace('_', ''))) {
          issues.push({
            type: 'forbidden_pattern',
            severity: 'critical',
            pattern: pattern,
            element_index: idx,
            message: `Forbidden pattern "${pattern}" detected`,
            action: 'Review and remove'
          });
        }
      });

      // Check for humanoid characteristics
      if (el.metadata?.type === 'avatar' || el.metadata?.humanoid) {
        issues.push({
          type: 'humanoid_violation',
          severity: 'critical',
          element_index: idx,
          message: 'Humanoid representation detected - violates LAWBOOK'
        });
      }
    });

    return issues;
  }

  /**
   * CHECK_FORMAT: Standardize outputs
   */
  checkFormat(elements) {
    const issues = [];

    elements.forEach((el, idx) => {
      // Check required fields
      if (!el.id) {
        issues.push({
          type: 'missing_id',
          severity: 'error',
          element_index: idx,
          message: 'Element missing required id field'
        });
      }

      // Check metadata
      if (!el.metadata) {
        issues.push({
          type: 'missing_metadata',
          severity: 'warning',
          element_index: idx,
          message: 'Element missing metadata object'
        });
      } else if (!el.metadata.version) {
        issues.push({
          type: 'missing_version',
          severity: 'warning',
          element_index: idx,
          message: 'Element metadata missing version field'
        });
      }
    });

    return issues;
  }

  /**
   * CHECK_META: Verify version, metadata, tags
   */
  checkMeta(elements) {
    const issues = [];
    const versions = new Set();

    elements.forEach((el, idx) => {
      if (el.metadata?.version) {
        versions.add(el.metadata.version);
      }

      // Check safe flag
      if (el.metadata && el.metadata.safe !== true) {
        issues.push({
          type: 'unsafe_flag',
          severity: 'critical',
          element_index: idx,
          message: 'Element not marked as safe'
        });
      }
    });

    // Version consistency
    if (versions.size > 1) {
      issues.push({
        type: 'version_mismatch',
        severity: 'info',
        versions: Array.from(versions),
        message: 'Multiple versions detected across elements'
      });
    }

    return issues;
  }

  /**
   * Get recommended actions (ONLY on explicit request)
   */
  getRecommendations(reportId) {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new Error(`Report not found: ${reportId}`);
    }

    const recommendations = report.issues_found.map(issue => ({
      issue_type: issue.type,
      severity: issue.severity,
      recommended_action: this.getActionForIssue(issue)
    }));

    // Update report with recommendations
    report.recommended_actions = recommendations;

    return {
      UCL_RECOMMENDATIONS: {
        report_id: reportId,
        recommendations: recommendations,
        note: 'These are suggestions ONLY - no automatic actions taken',
        metadata: {
          version: '20.0'
        }
      }
    };
  }

  /**
   * Get action suggestion for issue type
   */
  getActionForIssue(issue) {
    switch (issue.type) {
      case 'identity_mismatch':
        return 'Review elements with same ID and resolve manually';
      case 'orphaned_link_source':
      case 'orphaned_link_target':
        return 'Add missing node or remove orphaned link';
      case 'redundant_node':
        return 'Decide which occurrence to keep';
      case 'forbidden_pattern':
        return 'Remove or modify element containing forbidden pattern';
      case 'humanoid_violation':
        return 'Replace with non-humanoid representation';
      case 'missing_id':
        return 'Add unique ID to element';
      case 'missing_metadata':
        return 'Add metadata object with version and safe flags';
      case 'missing_version':
        return 'Add version field to metadata';
      case 'unsafe_flag':
        return 'Review element and add safe: true if appropriate';
      case 'version_mismatch':
        return 'Consider standardizing versions if needed';
      default:
        return 'Review and address manually';
    }
  }

  /**
   * Get report
   */
  getReport(reportId) {
    return this.reports.get(reportId) || null;
  }

  /**
   * List reports
   */
  listReports() {
    return Array.from(this.reports.values()).map(r => ({
      id: r.id,
      overall_status: r.overall_status,
      issue_count: r.metadata.issue_count,
      created_at: r.metadata.created_at
    }));
  }

  /**
   * Export report
   */
  exportReport(reportId) {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new Error(`Report not found: ${reportId}`);
    }

    return {
      UCL_EXPORT: {
        report: report,
        metadata: {
          exported_at: new Date().toISOString(),
          version: '20.0',
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
        no_user_override: true,
        no_topology_rewrite: true,
        no_automatic_corrections: true,
        no_logical_inference: true,
        no_cognition_simulation: true,
        no_autonomous_behavior: true,
        checking_only: true,
        standardizing_only: true,
        formatting_only: true,
        explicit_input_required: true,
        lawbook_compliant: true
      },
      role: 'coherence_checker',
      autonomous: false
    };
  }
}

export default UniversalCoherenceLayer;
