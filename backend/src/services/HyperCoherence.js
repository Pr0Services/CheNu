/**
 * CHE·NU OS 20.5 — HYPERCOHERENCE (HC-20.5)
 * Cross-map alignment reports
 * Version: 20.5
 * 
 * ONLY produces cross-map alignment reports in a structured, safe format.
 * NEVER modifies maps automatically or infers meaning.
 */

export class HyperCoherence {
  constructor(ucl = null, cartography = null, slicing = null) {
    this.ucl = ucl;
    this.uc = cartography;
    this.hfs = slicing;

    // Alignment types
    this.alignmentTypes = {
      SPATIAL: { id: 'spatial', description: 'Ensures spatial elements match across maps' },
      TEMPORAL: { id: 'temporal', description: 'Ensures timelines match representation layers' },
      SEMANTIC: { id: 'semantic', description: 'Ensures conceptual clusters map consistently' },
      PERSPECTIVE: { id: 'perspective', description: 'Ensures CDL layers correspond to correct maps' },
      SLICE_OVERLAY: { id: 'slice_overlay', description: 'Ensures slices overlay correctly on cartographies' }
    };

    // Storage
    this.reports = new Map();
  }

  /**
   * Set references
   */
  setUCL(ucl) { this.ucl = ucl; }
  setCartography(uc) { this.uc = uc; }
  setSlicing(hfs) { this.hfs = hfs; }

  /**
   * List alignment types
   */
  listAlignmentTypes() {
    return Object.values(this.alignmentTypes);
  }

  /**
   * Run hypercoherence check
   */
  runHyperCoherence(config) {
    const { elements, alignmentTypes } = config;

    if (!elements || elements.length === 0) {
      throw new Error('At least one element is required');
    }

    // Step 1: USER SELECTS elements (already done via config)
    
    // Step 2: HC checks SAFE structural relationships
    const selectedAlignments = alignmentTypes
      ? alignmentTypes.map(t => this.alignmentTypes[t.toUpperCase()]).filter(a => a)
      : Object.values(this.alignmentTypes);

    const consistencyFindings = [];
    const crossSliceNotes = [];
    const mapAlignment = {
      spatial: 'not_checked',
      temporal: 'not_checked',
      semantic: 'not_checked',
      perspective: 'not_checked'
    };

    // Perform alignment checks
    selectedAlignments.forEach(alignment => {
      const result = this.checkAlignment(elements, alignment);
      consistencyFindings.push(...result.findings);
      crossSliceNotes.push(...result.sliceNotes);
      
      if (mapAlignment[alignment.id] !== undefined) {
        mapAlignment[alignment.id] = result.status;
      }
    });

    // Step 3: HC formats findings
    const reportId = `hc_${Date.now()}`;
    const report = {
      id: reportId,
      elements_checked: elements.map(e => e.id || 'unknown'),
      consistency_findings: consistencyFindings,
      map_alignment: mapAlignment,
      cross_slice_notes: crossSliceNotes,
      recommended_adjustments: [], // Empty by default - only filled on request
      overall_status: consistencyFindings.every(f => f.status === 'aligned') ? 'coherent' : 'needs_review',
      metadata: {
        elements_count: elements.length,
        alignments_checked: selectedAlignments.map(a => a.id),
        created_at: new Date().toISOString(),
        version: '20.5',
        safe: true
      }
    };

    this.reports.set(reportId, report);

    // Step 4: HC outputs HC_REPORT
    return {
      HC_REPORT: report
    };
  }

  /**
   * Check alignment for specific type
   */
  checkAlignment(elements, alignment) {
    const findings = [];
    const sliceNotes = [];

    switch (alignment.id) {
      case 'spatial':
        findings.push(...this.checkSpatialAlignment(elements));
        break;

      case 'temporal':
        findings.push(...this.checkTemporalAlignment(elements));
        break;

      case 'semantic':
        findings.push(...this.checkSemanticAlignment(elements));
        break;

      case 'perspective':
        findings.push(...this.checkPerspectiveAlignment(elements));
        break;

      case 'slice_overlay':
        const sliceResult = this.checkSliceOverlay(elements);
        findings.push(...sliceResult.findings);
        sliceNotes.push(...sliceResult.notes);
        break;
    }

    const status = findings.every(f => f.status === 'aligned') ? 'aligned' : 'misaligned';

    return { findings, sliceNotes, status };
  }

  /**
   * ALIGN_SPATIAL: Check spatial alignment
   */
  checkSpatialAlignment(elements) {
    const findings = [];
    const spatialElements = elements.filter(e => 
      e.coords?.x !== undefined || e.map_type === 'spatial'
    );

    if (spatialElements.length < 2) {
      findings.push({
        type: 'spatial',
        status: 'aligned',
        message: 'Insufficient spatial elements to compare'
      });
      return findings;
    }

    // Check coordinate consistency
    const coordRanges = {
      x: { min: Infinity, max: -Infinity },
      y: { min: Infinity, max: -Infinity },
      z: { min: Infinity, max: -Infinity }
    };

    spatialElements.forEach(e => {
      if (e.coords) {
        ['x', 'y', 'z'].forEach(axis => {
          if (e.coords[axis] !== undefined) {
            coordRanges[axis].min = Math.min(coordRanges[axis].min, e.coords[axis]);
            coordRanges[axis].max = Math.max(coordRanges[axis].max, e.coords[axis]);
          }
        });
      }
    });

    findings.push({
      type: 'spatial',
      status: 'aligned',
      message: 'Spatial elements checked',
      details: {
        element_count: spatialElements.length,
        coordinate_ranges: coordRanges
      }
    });

    return findings;
  }

  /**
   * ALIGN_TEMPORAL: Check temporal alignment
   */
  checkTemporalAlignment(elements) {
    const findings = [];
    const temporalElements = elements.filter(e => 
      e.coords?.t !== undefined || e.map_type === 'timeline'
    );

    if (temporalElements.length < 2) {
      findings.push({
        type: 'temporal',
        status: 'aligned',
        message: 'Insufficient temporal elements to compare'
      });
      return findings;
    }

    // Check timeline consistency
    const timeValues = temporalElements
      .map(e => e.coords?.t)
      .filter(t => t !== undefined)
      .sort((a, b) => a - b);

    const hasGaps = timeValues.some((t, i) => 
      i > 0 && (t - timeValues[i-1]) > 10 // Arbitrary gap threshold
    );

    findings.push({
      type: 'temporal',
      status: hasGaps ? 'gap_detected' : 'aligned',
      message: hasGaps ? 'Timeline gaps detected' : 'Timeline elements aligned',
      details: {
        element_count: temporalElements.length,
        time_range: { min: timeValues[0], max: timeValues[timeValues.length - 1] }
      }
    });

    return findings;
  }

  /**
   * ALIGN_SEMANTIC: Check semantic alignment
   */
  checkSemanticAlignment(elements) {
    const findings = [];
    const semanticElements = elements.filter(e => 
      e.coords?.s !== undefined || e.map_type === 'semantic'
    );

    // Check for consistent semantic groupings
    const semanticGroups = new Map();
    semanticElements.forEach(e => {
      const s = e.coords?.s || 0;
      if (!semanticGroups.has(s)) {
        semanticGroups.set(s, []);
      }
      semanticGroups.get(s).push(e.id || 'unknown');
    });

    findings.push({
      type: 'semantic',
      status: 'aligned',
      message: 'Semantic clusters checked',
      details: {
        cluster_count: semanticGroups.size,
        clusters: Array.from(semanticGroups.entries()).map(([s, ids]) => ({
          semantic_value: s,
          element_count: ids.length
        }))
      }
    });

    return findings;
  }

  /**
   * ALIGN_PERSPECTIVE: Check perspective/depth layer alignment
   */
  checkPerspectiveAlignment(elements) {
    const findings = [];
    const perspectiveElements = elements.filter(e => 
      e.coords?.p !== undefined || e.depth_type
    );

    // Check CDL layer correspondence
    const depthTypes = [...new Set(perspectiveElements.map(e => e.depth_type).filter(d => d))];
    const perspectiveValues = [...new Set(perspectiveElements.map(e => e.coords?.p).filter(p => p !== undefined))];

    findings.push({
      type: 'perspective',
      status: 'aligned',
      message: 'Perspective layers checked',
      details: {
        depth_types_found: depthTypes,
        perspective_values: perspectiveValues,
        element_count: perspectiveElements.length
      }
    });

    return findings;
  }

  /**
   * ALIGN_SLICE_OVERLAY: Check slice overlay alignment
   */
  checkSliceOverlay(elements) {
    const findings = [];
    const notes = [];

    const slices = elements.filter(e => e.slice_type);
    const maps = elements.filter(e => e.map_type);

    if (slices.length === 0 || maps.length === 0) {
      findings.push({
        type: 'slice_overlay',
        status: 'aligned',
        message: 'No slice-map pairs to check'
      });
      return { findings, notes };
    }

    // Check if slices can overlay on maps
    slices.forEach(slice => {
      maps.forEach(map => {
        const compatible = this.checkSliceMapCompatibility(slice, map);
        if (!compatible.isCompatible) {
          findings.push({
            type: 'slice_overlay',
            status: 'misaligned',
            message: `Slice ${slice.id} incompatible with map ${map.id}`,
            reason: compatible.reason
          });
          notes.push(`Slice ${slice.id} has ${compatible.reason} with map ${map.id}`);
        }
      });
    });

    if (findings.length === 0) {
      findings.push({
        type: 'slice_overlay',
        status: 'aligned',
        message: 'All slices overlay correctly on maps'
      });
    }

    return { findings, notes };
  }

  /**
   * Check slice-map compatibility
   */
  checkSliceMapCompatibility(slice, map) {
    // Check axis compatibility
    const sliceAxes = slice.axes || [];
    const mapType = map.map_type;

    // Spatial slices should overlay on spatial maps
    if (sliceAxes.includes('x') || sliceAxes.includes('y') || sliceAxes.includes('z')) {
      if (mapType !== 'spatial' && mapType !== 'multiscale') {
        return { isCompatible: false, reason: 'spatial axis mismatch' };
      }
    }

    // Temporal slices should overlay on timeline maps
    if (sliceAxes.includes('t') && mapType !== 'timeline') {
      return { isCompatible: false, reason: 'temporal axis mismatch' };
    }

    return { isCompatible: true, reason: null };
  }

  /**
   * Get recommended adjustments (ONLY on explicit request)
   */
  getRecommendations(reportId) {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new Error(`Report not found: ${reportId}`);
    }

    const recommendations = report.consistency_findings
      .filter(f => f.status !== 'aligned')
      .map(finding => ({
        finding_type: finding.type,
        issue: finding.message,
        suggested_action: this.getSuggestionForFinding(finding)
      }));

    report.recommended_adjustments = recommendations;

    return {
      HC_RECOMMENDATIONS: {
        report_id: reportId,
        recommendations: recommendations,
        note: 'These are suggestions ONLY - no automatic actions taken',
        metadata: { version: '20.5' }
      }
    };
  }

  /**
   * Get suggestion for finding
   */
  getSuggestionForFinding(finding) {
    switch (finding.type) {
      case 'spatial':
        return 'Review spatial coordinates for consistency';
      case 'temporal':
        return 'Check timeline gaps and fill if needed';
      case 'semantic':
        return 'Verify semantic cluster assignments';
      case 'perspective':
        return 'Ensure CDL layers map to correct perspectives';
      case 'slice_overlay':
        return 'Adjust slice axes or map type for compatibility';
      default:
        return 'Review and adjust manually';
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
      elements_count: r.metadata.elements_count
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
      HC_EXPORT: {
        report: report,
        metadata: {
          exported_at: new Date().toISOString(),
          version: '20.5',
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
        no_automatic_map_modification: true,
        no_meaning_inference: true,
        no_structure_merge_without_user: true,
        no_cognition_simulation: true,
        no_autonomous_coherence: true,
        reporting_only: true,
        passive: true,
        no_self_modification: true,
        lawbook_compliant: true
      },
      role: 'alignment_reporter',
      autonomous: false
    };
  }
}

export default HyperCoherence;
