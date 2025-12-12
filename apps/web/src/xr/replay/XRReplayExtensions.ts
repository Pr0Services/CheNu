/* =====================================================
   CHE·NU — XR REPLAY EXTENSIONS (FULL BLOCK)
   
   Includes:
   - Replay Export to PDF
   - Replay Projection into Universe View
   
   Scope: XR / Timeline / Visualization / Export
   
   📜 GLOBAL IMMUTABILITY:
   - No write access
   - No agent execution
   - No orchestration
   - No memory mutation
   
   📜 ABSOLUTE RULES:
   - PDF export reflects history only
   - Universe projection reflects weight, not priority
   - Replay data never influences live orchestration
   ===================================================== */

import { useMemo, useCallback } from 'react';
import type { MeetingReplayEvent } from './XRMeetingReplaySystem';

/* =========================================================
   SHARED TYPES
   ========================================================= */

export interface ReplayInsight {
  id: string;
  type: 'observation' | 'warning' | 'recommendation' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp?: number;
  relatedEventIds?: string[];
  metadata?: Record<string, unknown>;
}

export interface ReplayPDFSection {
  title: string;
  content: string;
  type?: 'text' | 'table' | 'list' | 'timeline';
  metadata?: Record<string, unknown>;
}

export interface ReplayExportOptions {
  /** Include full timeline of events */
  includeTimeline: boolean;
  /** Include decision records */
  includeDecisions: boolean;
  /** Include generated insights */
  includeInsights: boolean;
  /** Include guard triggers/violations */
  includeGuards: boolean;
  /** Include agent statements */
  includeAgentStatements: boolean;
  /** Include human inputs */
  includeHumanInputs: boolean;
  /** Export format level */
  format: 'summary' | 'detailed' | 'full';
  /** Document title */
  title?: string;
  /** Document author */
  author?: string;
  /** Include metadata */
  includeMetadata?: boolean;
}

export type UniverseNodeType = 'sphere' | 'project' | 'meeting' | 'decision' | 'agent' | 'milestone';
export type ProjectionIntensity = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface UniverseNodeReplayProjection {
  /** Node ID in universe */
  nodeId: string;
  /** Type of node */
  nodeType: UniverseNodeType;
  /** Visual intensity based on activity */
  intensity: ProjectionIntensity;
  /** Time range of activity */
  timestampRange: [number, number];
  /** Number of events in this node */
  eventCount: number;
  /** Summary of activity */
  summary?: string;
  /** Related node IDs */
  connections?: string[];
}

export interface UniverseReplayVisual {
  /** Highlight intensity */
  highlight: ProjectionIntensity;
  /** Enable glow effect */
  glow: boolean;
  /** Enable pulse animation */
  pulse: boolean;
  /** Glow color override */
  glowColor?: string;
  /** Opacity level (0-1) */
  opacity?: number;
  /** Scale modifier */
  scale?: number;
}

/* =========================================================
   REPLAY INSIGHT ENGINE
   ========================================================= */

export class XRReplayInsightEngine {
  private events: MeetingReplayEvent[];

  constructor(events: MeetingReplayEvent[]) {
    this.events = [...events].sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Analyze events and generate insights.
   */
  analyze(): ReplayInsight[] {
    const insights: ReplayInsight[] = [];

    // Detect guard violations
    const violations = this.events.filter((e) => e.type === 'guard_violation');
    if (violations.length > 0) {
      insights.push({
        id: `insight-violations-${Date.now()}`,
        type: 'warning',
        severity: violations.length > 3 ? 'critical' : 'high',
        description: `${violations.length} guard violation(s) detected during meeting`,
        relatedEventIds: violations.map((v) => v.id),
      });
    }

    // Detect blocked decisions
    const blocked = this.events.filter((e) => e.type === 'decision_blocked');
    if (blocked.length > 0) {
      insights.push({
        id: `insight-blocked-${Date.now()}`,
        type: 'observation',
        severity: 'medium',
        description: `${blocked.length} decision(s) were blocked`,
        relatedEventIds: blocked.map((b) => b.id),
      });
    }

    // Detect agent activity imbalance
    const agentEvents = this.events.filter((e) => e.author === 'agent');
    const agentCounts: Record<string, number> = {};
    agentEvents.forEach((e) => {
      if (e.agentId) {
        agentCounts[e.agentId] = (agentCounts[e.agentId] || 0) + 1;
      }
    });

    const counts = Object.values(agentCounts);
    if (counts.length > 1) {
      const max = Math.max(...counts);
      const min = Math.min(...counts);
      if (max > min * 3) {
        insights.push({
          id: `insight-imbalance-${Date.now()}`,
          type: 'observation',
          severity: 'low',
          description: 'Significant imbalance in agent participation detected',
          metadata: { agentCounts },
        });
      }
    }

    // Detect long gaps
    for (let i = 1; i < this.events.length; i++) {
      const gap = this.events[i].timestamp - this.events[i - 1].timestamp;
      if (gap > 60000) {
        // More than 1 minute
        insights.push({
          id: `insight-gap-${i}-${Date.now()}`,
          type: 'observation',
          severity: 'low',
          description: `Long pause detected (${Math.round(gap / 1000)}s)`,
          timestamp: this.events[i - 1].timestamp,
        });
      }
    }

    // Detect rapid decisions
    const decisions = this.events.filter(
      (e) => e.type === 'decision_validated'
    );
    decisions.forEach((d, i) => {
      if (i > 0) {
        const timeSinceLast = d.timestamp - decisions[i - 1].timestamp;
        if (timeSinceLast < 5000) {
          // Less than 5 seconds
          insights.push({
            id: `insight-rapid-${i}-${Date.now()}`,
            type: 'recommendation',
            severity: 'medium',
            description: 'Rapid successive decisions detected - consider review',
            timestamp: d.timestamp,
            relatedEventIds: [d.id],
          });
        }
      }
    });

    return insights;
  }

  /**
   * Get insights by severity.
   */
  getInsightsBySeverity(severity: ReplayInsight['severity']): ReplayInsight[] {
    return this.analyze().filter((i) => i.severity === severity);
  }

  /**
   * Get critical insights only.
   */
  getCriticalInsights(): ReplayInsight[] {
    return this.analyze().filter(
      (i) => i.severity === 'critical' || i.severity === 'high'
    );
  }
}

/* =========================================================
   4️⃣ REPLAY → PDF EXPORT ENGINE
   ========================================================= */

export class XRReplayPDFExporter {
  private events: MeetingReplayEvent[];
  private insights: ReplayInsight[];

  constructor(events: MeetingReplayEvent[], insights: ReplayInsight[] = []) {
    this.events = [...events].sort((a, b) => a.timestamp - b.timestamp);
    this.insights = insights;
  }

  /**
   * Build PDF sections based on options.
   */
  buildSections(options: ReplayExportOptions): ReplayPDFSection[] {
    const sections: ReplayPDFSection[] = [];

    // Header section
    sections.push({
      title: options.title || 'Meeting Replay Report',
      content: this.buildHeaderContent(options),
      type: 'text',
    });

    // Timeline section
    if (options.includeTimeline) {
      sections.push({
        title: 'Meeting Timeline',
        content: this.buildTimelineContent(options.format),
        type: 'timeline',
      });
    }

    // Decisions section
    if (options.includeDecisions) {
      sections.push({
        title: 'Decisions',
        content: this.buildDecisionsContent(options.format),
        type: 'table',
      });
    }

    // Guard events section
    if (options.includeGuards) {
      sections.push({
        title: 'Guard Events',
        content: this.buildGuardsContent(options.format),
        type: 'list',
      });
    }

    // Agent statements section
    if (options.includeAgentStatements) {
      sections.push({
        title: 'Agent Statements',
        content: this.buildAgentStatementsContent(options.format),
        type: 'list',
      });
    }

    // Human inputs section
    if (options.includeHumanInputs) {
      sections.push({
        title: 'Human Inputs',
        content: this.buildHumanInputsContent(options.format),
        type: 'list',
      });
    }

    // Insights section
    if (options.includeInsights && this.insights.length > 0) {
      sections.push({
        title: 'Replay Insights',
        content: this.buildInsightsContent(options.format),
        type: 'list',
      });
    }

    // Metadata section
    if (options.includeMetadata) {
      sections.push({
        title: 'Metadata',
        content: this.buildMetadataContent(),
        type: 'text',
      });
    }

    return sections;
  }

  /**
   * Export to PDF (returns sections for now, integrate with PDF library).
   */
  exportToPDF(options: ReplayExportOptions): ReplayPDFSection[] {
    const sections = this.buildSections(options);

    // TODO: Integrate with actual PDF library (e.g., pdfmake, jspdf)
    // Example pseudo-code:
    // const pdf = new PDFDocument();
    // sections.forEach(section => {
    //   pdf.addTitle(section.title);
    //   pdf.addParagraph(section.content);
    // });
    // return pdf.save("meeting_replay.pdf");

    return sections;
  }

  /**
   * Export to Markdown format.
   */
  exportToMarkdown(options: ReplayExportOptions): string {
    const sections = this.buildSections(options);

    return sections
      .map((section) => {
        return `## ${section.title}\n\n${section.content}\n`;
      })
      .join('\n---\n\n');
  }

  /**
   * Export to JSON format.
   */
  exportToJSON(options: ReplayExportOptions): object {
    return {
      title: options.title || 'Meeting Replay Report',
      exportedAt: new Date().toISOString(),
      sections: this.buildSections(options),
      eventCount: this.events.length,
      insightCount: this.insights.length,
    };
  }

  /* -----------------------------------------
     PRIVATE BUILD METHODS
  ----------------------------------------- */

  private buildHeaderContent(options: ReplayExportOptions): string {
    const lines = [
      `Generated: ${new Date().toISOString()}`,
      `Format: ${options.format}`,
      `Total Events: ${this.events.length}`,
      `Total Insights: ${this.insights.length}`,
    ];

    if (options.author) {
      lines.push(`Author: ${options.author}`);
    }

    const firstEvent = this.events[0];
    const lastEvent = this.events[this.events.length - 1];
    if (firstEvent && lastEvent) {
      const duration = lastEvent.timestamp - firstEvent.timestamp;
      lines.push(`Duration: ${Math.round(duration / 1000)}s`);
    }

    return lines.join('\n');
  }

  private buildTimelineContent(format: ReplayExportOptions['format']): string {
    if (format === 'summary') {
      return this.events
        .filter((e) =>
          ['meeting_start', 'meeting_end', 'decision_validated'].includes(
            e.type
          )
        )
        .map((e) => `${this.formatTimestamp(e.timestamp)} — ${e.type}`)
        .join('\n');
    }

    return this.events
      .map((e) => {
        const base = `${this.formatTimestamp(e.timestamp)} — ${e.type}`;
        if (format === 'full' && e.message) {
          return `${base}\n  ${e.message}`;
        }
        return base;
      })
      .join('\n');
  }

  private buildDecisionsContent(
    format: ReplayExportOptions['format']
  ): string {
    const decisions = this.events.filter(
      (e) =>
        e.type === 'decision_proposed' ||
        e.type === 'decision_validated' ||
        e.type === 'decision_rejected' ||
        e.type === 'decision_blocked'
    );

    if (decisions.length === 0) {
      return 'No decisions recorded.';
    }

    return decisions
      .map((d) => {
        const decisionId =
          (d.payload?.decisionId as string) || d.id || 'unknown';
        const base = `${decisionId} — ${d.type}`;
        if (format !== 'summary' && d.message) {
          return `${base}\n  ${d.message}`;
        }
        return base;
      })
      .join('\n');
  }

  private buildGuardsContent(format: ReplayExportOptions['format']): string {
    const guards = this.events.filter(
      (e) => e.type === 'guard_trigger' || e.type === 'guard_violation'
    );

    if (guards.length === 0) {
      return 'No guard events recorded.';
    }

    return guards
      .map((g) => {
        const base = `${this.formatTimestamp(g.timestamp)} — ${g.type}`;
        if (format !== 'summary' && g.message) {
          return `${base}\n  ${g.message}`;
        }
        return base;
      })
      .join('\n');
  }

  private buildAgentStatementsContent(
    format: ReplayExportOptions['format']
  ): string {
    const statements = this.events.filter(
      (e) =>
        (e.type === 'agent_statement' || e.type === 'agent_analysis') &&
        e.author === 'agent'
    );

    if (statements.length === 0) {
      return 'No agent statements recorded.';
    }

    return statements
      .map((s) => {
        const agentName = s.agentName || s.agentId || 'Unknown Agent';
        const base = `[${agentName}] ${this.formatTimestamp(s.timestamp)}`;
        if (format !== 'summary' && s.message) {
          return `${base}\n  ${s.message}`;
        }
        return base;
      })
      .join('\n');
  }

  private buildHumanInputsContent(
    format: ReplayExportOptions['format']
  ): string {
    const inputs = this.events.filter(
      (e) =>
        (e.type === 'human_input' || e.type === 'human_question') &&
        e.author === 'human'
    );

    if (inputs.length === 0) {
      return 'No human inputs recorded.';
    }

    return inputs
      .map((i) => {
        const base = `${this.formatTimestamp(i.timestamp)} — ${i.type}`;
        if (format !== 'summary' && i.message) {
          return `${base}\n  ${i.message}`;
        }
        return base;
      })
      .join('\n');
  }

  private buildInsightsContent(format: ReplayExportOptions['format']): string {
    if (this.insights.length === 0) {
      return 'No insights generated.';
    }

    const sortedInsights = [...this.insights].sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

    return sortedInsights
      .map((i) => {
        const base = `[${i.severity.toUpperCase()}] ${i.description}`;
        if (format === 'full' && i.metadata) {
          return `${base}\n  Metadata: ${JSON.stringify(i.metadata)}`;
        }
        return base;
      })
      .join('\n');
  }

  private buildMetadataContent(): string {
    const firstEvent = this.events[0];
    const lastEvent = this.events[this.events.length - 1];

    const eventTypes: Record<string, number> = {};
    this.events.forEach((e) => {
      eventTypes[e.type] = (eventTypes[e.type] || 0) + 1;
    });

    const lines = [
      `Event Count: ${this.events.length}`,
      `Insight Count: ${this.insights.length}`,
      `Start Time: ${firstEvent ? this.formatTimestamp(firstEvent.timestamp) : 'N/A'}`,
      `End Time: ${lastEvent ? this.formatTimestamp(lastEvent.timestamp) : 'N/A'}`,
      '',
      'Event Types:',
      ...Object.entries(eventTypes).map(([type, count]) => `  ${type}: ${count}`),
    ];

    return lines.join('\n');
  }

  private formatTimestamp(ms: number): string {
    const date = new Date(ms);
    return date.toISOString().replace('T', ' ').slice(0, 19);
  }
}

/* =========================================================
   5️⃣ REPLAY → UNIVERSE VIEW PROJECTION
   ========================================================= */

export class XRReplayUniverseProjector {
  private events: MeetingReplayEvent[];

  constructor(events: MeetingReplayEvent[]) {
    this.events = [...events].sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Project replay events onto universe nodes.
   */
  project(): UniverseNodeReplayProjection[] {
    const projections: UniverseNodeReplayProjection[] = [];

    // Group by decision
    const decisionProjections = this.projectDecisions();
    projections.push(...decisionProjections);

    // Group by agent
    const agentProjections = this.projectAgents();
    projections.push(...agentProjections);

    // Project meeting as a whole
    const meetingProjection = this.projectMeeting();
    if (meetingProjection) {
      projections.push(meetingProjection);
    }

    return projections;
  }

  /**
   * Project decision nodes.
   */
  private projectDecisions(): UniverseNodeReplayProjection[] {
    const projections: UniverseNodeReplayProjection[] = [];
    const groupedByDecision: Record<string, MeetingReplayEvent[]> = {};

    this.events.forEach((event) => {
      const decisionId = event.payload?.decisionId as string | undefined;
      if (!decisionId) return;

      if (!groupedByDecision[decisionId]) {
        groupedByDecision[decisionId] = [];
      }
      groupedByDecision[decisionId].push(event);
    });

    Object.entries(groupedByDecision).forEach(([decisionId, events]) => {
      const intensity = this.calculateIntensity(events.length, 10);
      const hasViolation = events.some((e) => e.type === 'guard_violation');
      const wasValidated = events.some((e) => e.type === 'decision_validated');

      projections.push({
        nodeId: decisionId,
        nodeType: 'decision',
        intensity: hasViolation ? 'critical' : intensity,
        timestampRange: [
          events[0].timestamp,
          events[events.length - 1].timestamp,
        ],
        eventCount: events.length,
        summary: wasValidated
          ? 'Decision validated'
          : hasViolation
          ? 'Decision blocked due to violation'
          : 'Decision pending',
      });
    });

    return projections;
  }

  /**
   * Project agent nodes.
   */
  private projectAgents(): UniverseNodeReplayProjection[] {
    const projections: UniverseNodeReplayProjection[] = [];
    const groupedByAgent: Record<string, MeetingReplayEvent[]> = {};

    this.events.forEach((event) => {
      if (event.author !== 'agent' || !event.agentId) return;

      if (!groupedByAgent[event.agentId]) {
        groupedByAgent[event.agentId] = [];
      }
      groupedByAgent[event.agentId].push(event);
    });

    Object.entries(groupedByAgent).forEach(([agentId, events]) => {
      const intensity = this.calculateIntensity(events.length, 15);

      projections.push({
        nodeId: agentId,
        nodeType: 'agent',
        intensity,
        timestampRange: [
          events[0].timestamp,
          events[events.length - 1].timestamp,
        ],
        eventCount: events.length,
        summary: `${events.length} contributions`,
      });
    });

    return projections;
  }

  /**
   * Project meeting as a whole.
   */
  private projectMeeting(): UniverseNodeReplayProjection | null {
    if (this.events.length === 0) return null;

    const meetingStart = this.events.find((e) => e.type === 'meeting_start');
    const meetingEnd = this.events.find((e) => e.type === 'meeting_end');

    const meetingId =
      (meetingStart?.payload?.meetingId as string) ||
      `meeting-${this.events[0].timestamp}`;

    const decisionCount = this.events.filter(
      (e) => e.type === 'decision_validated'
    ).length;

    const violationCount = this.events.filter(
      (e) => e.type === 'guard_violation'
    ).length;

    return {
      nodeId: meetingId,
      nodeType: 'meeting',
      intensity: violationCount > 0 ? 'high' : decisionCount > 3 ? 'high' : 'medium',
      timestampRange: [
        this.events[0].timestamp,
        this.events[this.events.length - 1].timestamp,
      ],
      eventCount: this.events.length,
      summary: `${decisionCount} decisions, ${violationCount} violations`,
    };
  }

  /**
   * Calculate intensity based on event count and threshold.
   */
  private calculateIntensity(count: number, highThreshold: number): ProjectionIntensity {
    if (count === 0) return 'none';
    if (count <= 2) return 'low';
    if (count <= highThreshold / 2) return 'medium';
    return 'high';
  }
}

/* =========================================================
   VISUAL MAPPING
   ========================================================= */

/**
 * Map universe replay projection to visual properties.
 */
export function mapUniverseReplayToVisual(
  projection: UniverseNodeReplayProjection
): UniverseReplayVisual {
  const base: UniverseReplayVisual = {
    highlight: projection.intensity,
    glow: projection.intensity !== 'none' && projection.intensity !== 'low',
    pulse: projection.intensity === 'high' || projection.intensity === 'critical',
  };

  // Add intensity-specific properties
  switch (projection.intensity) {
    case 'critical':
      return {
        ...base,
        glowColor: '#ff6b6b',
        opacity: 1,
        scale: 1.2,
      };
    case 'high':
      return {
        ...base,
        glowColor: '#ffd93d',
        opacity: 0.95,
        scale: 1.1,
      };
    case 'medium':
      return {
        ...base,
        glowColor: '#4dabf7',
        opacity: 0.85,
        scale: 1.05,
      };
    case 'low':
      return {
        ...base,
        opacity: 0.7,
        scale: 1,
      };
    default:
      return {
        ...base,
        opacity: 0.5,
        scale: 1,
      };
  }
}

/**
 * Get color for projection intensity.
 */
export function getProjectionColor(intensity: ProjectionIntensity): string {
  switch (intensity) {
    case 'critical':
      return '#ff6b6b';
    case 'high':
      return '#ffd93d';
    case 'medium':
      return '#4dabf7';
    case 'low':
      return '#69db7c';
    default:
      return '#868e96';
  }
}

/* =========================================================
   REACT HOOKS
   ========================================================= */

/**
 * Hook for replay insight analysis.
 */
export function useReplayInsights(events: MeetingReplayEvent[]): {
  insights: ReplayInsight[];
  criticalInsights: ReplayInsight[];
  hasIssues: boolean;
} {
  const engine = useMemo(() => new XRReplayInsightEngine(events), [events]);

  const insights = useMemo(() => engine.analyze(), [engine]);
  const criticalInsights = useMemo(
    () => insights.filter((i) => i.severity === 'critical' || i.severity === 'high'),
    [insights]
  );

  return {
    insights,
    criticalInsights,
    hasIssues: criticalInsights.length > 0,
  };
}

/**
 * Hook for replay PDF export.
 */
export function useReplayExport(
  events: MeetingReplayEvent[],
  insights: ReplayInsight[]
): {
  exportToPDF: (options: ReplayExportOptions) => ReplayPDFSection[];
  exportToMarkdown: (options: ReplayExportOptions) => string;
  exportToJSON: (options: ReplayExportOptions) => object;
} {
  const exporter = useMemo(
    () => new XRReplayPDFExporter(events, insights),
    [events, insights]
  );

  const exportToPDF = useCallback(
    (options: ReplayExportOptions) => exporter.exportToPDF(options),
    [exporter]
  );

  const exportToMarkdown = useCallback(
    (options: ReplayExportOptions) => exporter.exportToMarkdown(options),
    [exporter]
  );

  const exportToJSON = useCallback(
    (options: ReplayExportOptions) => exporter.exportToJSON(options),
    [exporter]
  );

  return { exportToPDF, exportToMarkdown, exportToJSON };
}

/**
 * Hook for universe projection.
 */
export function useUniverseProjection(events: MeetingReplayEvent[]): {
  projections: UniverseNodeReplayProjection[];
  getVisual: (nodeId: string) => UniverseReplayVisual | null;
} {
  const projector = useMemo(
    () => new XRReplayUniverseProjector(events),
    [events]
  );

  const projections = useMemo(() => projector.project(), [projector]);

  const getVisual = useCallback(
    (nodeId: string): UniverseReplayVisual | null => {
      const projection = projections.find((p) => p.nodeId === nodeId);
      return projection ? mapUniverseReplayToVisual(projection) : null;
    },
    [projections]
  );

  return { projections, getVisual };
}

/* =========================================================
   DEFAULT EXPORT OPTIONS
   ========================================================= */

export const DEFAULT_EXPORT_OPTIONS: ReplayExportOptions = {
  includeTimeline: true,
  includeDecisions: true,
  includeInsights: true,
  includeGuards: true,
  includeAgentStatements: true,
  includeHumanInputs: true,
  format: 'detailed',
  includeMetadata: true,
};

export const SUMMARY_EXPORT_OPTIONS: ReplayExportOptions = {
  includeTimeline: true,
  includeDecisions: true,
  includeInsights: true,
  includeGuards: false,
  includeAgentStatements: false,
  includeHumanInputs: false,
  format: 'summary',
  includeMetadata: false,
};
