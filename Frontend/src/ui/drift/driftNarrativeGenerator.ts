/* =====================================================
   CHE·NU — DRIFT NARRATIVE GENERATOR
   Status: OBSERVATIONAL MEMORY
   Authority: NONE
   
   📜 PURPOSE:
   Generate pure descriptive narratives from drift reports.
   NO interpretation. NO evaluation. NO recommendation.
   
   📜 PRINCIPLE OF NARRATIVE NEUTRALITY:
   - Describe sequences
   - Respect chronology
   - Preserve uncertainty
   - Avoid causality
   ===================================================== */

import {
  type DriftNarrative,
  type NarrativeObservation,
  type NarrativeScope,
  type NarrativeGenerationRequest,
  type VariationSummary,
  type UncertaintyStatement,
  validateNarrativeLanguage,
  DEFAULT_UNCERTAINTY_DISCLAIMER,
  DEFAULT_CANNOT_CONCLUDE,
  DRIFT_NARRATIVE_DECLARATION,
} from './driftNarrative.types';

import {
  driftDetector,
  type PreferenceDriftReport,
} from '../../core/agents/preferenceDriftDetector';

/* =========================================================
   NARRATIVE TEMPLATES (Neutral language)
   ========================================================= */

const OBSERVATION_TEMPLATES = {
  /** Frequency change observed */
  frequencyChange: (
    what: string,
    direction: 'more' | 'less',
    period: string
  ) => `${what} was selected ${direction} frequently during ${period}.`,

  /** Context appeared/disappeared */
  contextChange: (
    context: string,
    appeared: boolean,
    period: string
  ) => `${context} contexts ${appeared ? 'appeared' : 'appeared less often'} during ${period}.`,

  /** Pattern shift observed */
  patternShift: (
    from: string,
    to: string,
    period: string
  ) => `A shift from ${from} to ${to} was observed during ${period}.`,

  /** Stable observation */
  stablePattern: (
    what: string,
    period: string
  ) => `${what} remained stable throughout ${period}.`,

  /** Variation recorded */
  variationRecorded: (
    what: string,
    count: number,
    period: string
  ) => `${what} showed ${count} variation${count !== 1 ? 's' : ''} during ${period}.`,
};

/* =========================================================
   HELPER: Format Date Range
   ========================================================= */

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
  };

  const startFormatted = startDate.toLocaleDateString('en-US', formatOptions);
  const endFormatted = endDate.toLocaleDateString('en-US', formatOptions);

  return `between ${startFormatted} and ${endFormatted}`;
}

/* =========================================================
   HELPER: Convert Drift Report to Observation
   ========================================================= */

function reportToObservation(
  report: PreferenceDriftReport,
  index: number
): NarrativeObservation {
  // Parse direction for neutral description
  const directionParts = report.direction.split(' → ');
  const from = directionParts[0] || 'previous pattern';
  const to = directionParts[1] || 'current pattern';

  // Build neutral description
  let description: string;

  if (report.direction === 'stable') {
    description = `${report.preferenceKey} remained stable during this period.`;
  } else {
    description = `A shift in ${report.preferenceKey} was recorded: ${from} to ${to}.`;
  }

  return {
    id: `obs-${index}-${Date.now()}`,
    timestamp: report.reportedAt,
    description,
    sourceReportId: report.preferenceId,
    scope: report.scope as NarrativeScope,
  };
}

/* =========================================================
   HELPER: Build Variation Summary
   ========================================================= */

function buildVariationSummary(
  reports: PreferenceDriftReport[],
  timeRange: { start: string; end: string }
): VariationSummary {
  const whatChanged: string[] = [];
  const contexts = new Set<string>();

  for (const report of reports) {
    if (report.driftDetected) {
      whatChanged.push(report.preferenceKey);
      contexts.add(report.scope);
    }
  }

  // Calculate period in days
  const startMs = new Date(timeRange.start).getTime();
  const endMs = new Date(timeRange.end).getTime();
  const days = Math.ceil((endMs - startMs) / (24 * 60 * 60 * 1000));

  return {
    whatChanged: [...new Set(whatChanged)], // Unique items
    frequency: {
      count: reports.filter((r) => r.driftDetected).length,
      period: `${days} day${days !== 1 ? 's' : ''}`,
    },
    contexts: Array.from(contexts),
  };
}

/* =========================================================
   HELPER: Build Uncertainty Statement
   ========================================================= */

function buildUncertaintyStatement(): UncertaintyStatement {
  return {
    cannotConclude: [...DEFAULT_CANNOT_CONCLUDE],
    disclaimer: DEFAULT_UNCERTAINTY_DISCLAIMER,
  };
}

/* =========================================================
   MAIN: Generate Drift Narrative
   ========================================================= */

/**
 * Generate a drift narrative from drift reports.
 * Pure description only. No interpretation.
 */
export function generateDriftNarrative(
  request: NarrativeGenerationRequest
): DriftNarrative {
  // Get drift analysis
  const analysis = driftDetector.analyze({
    scope: request.scope === 'session' ? undefined : request.scope,
  });

  // Filter reports by scope and time
  const startMs = new Date(request.timeRange.start).getTime();
  const endMs = new Date(request.timeRange.end).getTime();

  let relevantReports = analysis.reports.filter((report) => {
    const reportMs = new Date(report.reportedAt).getTime();
    const inTimeRange = reportMs >= startMs && reportMs <= endMs;
    const matchesScope = request.scopeId
      ? report.scope === request.scope
      : true;
    return inTimeRange && matchesScope && report.driftDetected;
  });

  // Limit observations
  if (request.maxObservations) {
    relevantReports = relevantReports.slice(0, request.maxObservations);
  }

  // Sort chronologically
  relevantReports.sort(
    (a, b) => new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime()
  );

  // Convert to observations
  const observations = relevantReports.map((report, index) =>
    reportToObservation(report, index)
  );

  // Build narrative
  const periodDescription = formatDateRange(
    request.timeRange.start,
    request.timeRange.end
  );

  const title = observations.length > 0
    ? `Preference evolution ${periodDescription}`
    : `No significant changes ${periodDescription}`;

  const narrative: DriftNarrative = {
    id: `narrative-${Date.now()}`,
    title,
    timeframe: {
      start: request.timeRange.start,
      end: request.timeRange.end,
    },
    scope: request.scope,
    scopeId: request.scopeId,
    observations,
    variationSummary: buildVariationSummary(relevantReports, request.timeRange),
    uncertainty: buildUncertaintyStatement(),
    generatedAt: new Date().toISOString(),
    savedByUser: false,
  };

  // Validate narrative language
  const fullText = [
    narrative.title,
    ...observations.map((o) => o.description),
  ].join(' ');

  const validation = validateNarrativeLanguage(fullText);
  if (!validation.valid) {
    console.warn(
      'Narrative contains forbidden language:',
      validation.forbiddenFound
    );
  }

  return narrative;
}

/* =========================================================
   FORMAT: Short Summary
   ========================================================= */

export function formatNarrativeShortSummary(narrative: DriftNarrative): string {
  const { timeframe, observations, variationSummary, uncertainty } = narrative;
  const period = formatDateRange(timeframe.start, timeframe.end);

  if (observations.length === 0) {
    return `${period}, no significant preference changes were observed.\n\n${uncertainty.disclaimer}`;
  }

  const lines: string[] = [];

  // Opening
  lines.push(`${period}:`);
  lines.push('');

  // Key observations (max 3)
  const keyObs = observations.slice(0, 3);
  for (const obs of keyObs) {
    lines.push(`• ${obs.description}`);
  }

  if (observations.length > 3) {
    lines.push(`• ...and ${observations.length - 3} more observation(s).`);
  }

  lines.push('');

  // Variation summary
  if (variationSummary.whatChanged.length > 0) {
    lines.push(
      `Total: ${variationSummary.frequency.count} change(s) recorded over ${variationSummary.frequency.period}.`
    );
  }

  lines.push('');

  // Uncertainty
  lines.push(uncertainty.disclaimer);

  return lines.join('\n');
}

/* =========================================================
   FORMAT: Expandable Log
   ========================================================= */

export function formatNarrativeExpandableLog(
  narrative: DriftNarrative
): { summary: string; details: string[] } {
  const period = formatDateRange(narrative.timeframe.start, narrative.timeframe.end);

  const summary = narrative.observations.length > 0
    ? `${narrative.observations.length} change(s) observed ${period}`
    : `No changes observed ${period}`;

  const details = narrative.observations.map((obs) => {
    const time = new Date(obs.timestamp).toLocaleString();
    return `[${time}] ${obs.description}`;
  });

  // Add uncertainty at end
  details.push('');
  details.push(`— ${narrative.uncertainty.disclaimer}`);

  return { summary, details };
}

/* =========================================================
   FORMAT: Timeline Annotation
   ========================================================= */

export interface TimelineAnnotation {
  timestamp: string;
  text: string;
  scope: NarrativeScope;
}

export function formatNarrativeTimelineAnnotations(
  narrative: DriftNarrative
): TimelineAnnotation[] {
  return narrative.observations.map((obs) => ({
    timestamp: obs.timestamp,
    text: obs.description,
    scope: obs.scope,
  }));
}

/* =========================================================
   FORMAT: Full Report (Read-only)
   ========================================================= */

export function formatNarrativeFullReport(narrative: DriftNarrative): string {
  const lines: string[] = [];

  // Header
  lines.push('═'.repeat(60));
  lines.push('CHE·NU — DRIFT NARRATIVE REPORT');
  lines.push('Status: OBSERVATIONAL MEMORY');
  lines.push('═'.repeat(60));
  lines.push('');

  // Title
  lines.push(`TITLE: ${narrative.title}`);
  lines.push('');

  // Timeframe
  lines.push('TIMEFRAME');
  lines.push('─'.repeat(40));
  lines.push(`Start: ${new Date(narrative.timeframe.start).toLocaleDateString()}`);
  lines.push(`End: ${new Date(narrative.timeframe.end).toLocaleDateString()}`);
  lines.push('');

  // Scope
  lines.push('SCOPE');
  lines.push('─'.repeat(40));
  lines.push(`Level: ${narrative.scope}`);
  if (narrative.scopeId) {
    lines.push(`ID: ${narrative.scopeId}`);
  }
  lines.push('');

  // Observations
  lines.push('OBSERVATIONS (Chronological)');
  lines.push('─'.repeat(40));

  if (narrative.observations.length === 0) {
    lines.push('No significant changes were observed during this period.');
  } else {
    for (const obs of narrative.observations) {
      const time = new Date(obs.timestamp).toLocaleString();
      lines.push(`[${time}]`);
      lines.push(`  ${obs.description}`);
      lines.push('');
    }
  }

  // Variation Summary
  lines.push('VARIATION SUMMARY');
  lines.push('─'.repeat(40));
  lines.push(`Changes recorded: ${narrative.variationSummary.frequency.count}`);
  lines.push(`Period: ${narrative.variationSummary.frequency.period}`);
  lines.push(`Contexts: ${narrative.variationSummary.contexts.join(', ') || 'N/A'}`);
  lines.push('');

  if (narrative.variationSummary.whatChanged.length > 0) {
    lines.push('What changed:');
    for (const item of narrative.variationSummary.whatChanged) {
      lines.push(`  • ${item}`);
    }
    lines.push('');
  }

  // Uncertainty Statement
  lines.push('UNCERTAINTY STATEMENT');
  lines.push('─'.repeat(40));
  lines.push('Cannot be concluded:');
  for (const item of narrative.uncertainty.cannotConclude) {
    lines.push(`  • ${item}`);
  }
  lines.push('');
  lines.push(narrative.uncertainty.disclaimer);
  lines.push('');

  // Declaration
  lines.push('═'.repeat(60));
  lines.push('SYSTEM DECLARATION');
  lines.push('═'.repeat(60));
  lines.push('');
  lines.push(DRIFT_NARRATIVE_DECLARATION);
  lines.push('');

  // Footer
  lines.push('─'.repeat(60));
  lines.push(`Generated: ${new Date(narrative.generatedAt).toLocaleString()}`);
  lines.push(`Saved by user: ${narrative.savedByUser ? 'Yes' : 'No'}`);
  lines.push('─'.repeat(60));

  return lines.join('\n');
}

/* =========================================================
   EXPORTS
   ========================================================= */

export {
  OBSERVATION_TEMPLATES,
  formatDateRange,
};

export default generateDriftNarrative;
