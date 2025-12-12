/* =====================================================
   CHE·NU — DRIFT NARRATIVE VIEW
   Status: OBSERVATIONAL MEMORY
   Authority: NONE
   
   📜 PURPOSE:
   Display drift narratives as pure description.
   User can: read, hide, export, annotate privately.
   
   📜 SYSTEM CONSTRAINTS:
   - Dismissible
   - Non-prioritized
   - Non-alerting
   ===================================================== */

import React, { useState, useMemo, useCallback } from 'react';
import {
  type DriftNarrative,
  type NarrativeScope,
  type NarrativePresentationMode,
  type NarrativeUserInteraction,
  DRIFT_NARRATIVE_DECLARATION,
  NARRATIVE_FAILSAFES,
} from './driftNarrative.types';
import {
  generateDriftNarrative,
  formatNarrativeShortSummary,
  formatNarrativeExpandableLog,
  formatNarrativeFullReport,
} from './driftNarrativeGenerator';

/* =========================================================
   STYLES
   ========================================================= */

const styles = {
  container: {
    fontFamily: 'Georgia, serif',
    backgroundColor: '#0f0f1a',
    color: '#c0c0c0',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '700px',
    lineHeight: 1.7,
  } as React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #2a2a3a',
  } as React.CSSProperties,

  title: {
    fontSize: '18px',
    fontWeight: 400,
    color: '#e0e0e0',
    margin: 0,
    fontStyle: 'italic',
  } as React.CSSProperties,

  badge: {
    fontSize: '10px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#1a1a2e',
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  } as React.CSSProperties,

  controls: {
    display: 'flex',
    gap: '8px',
  } as React.CSSProperties,

  controlButton: {
    backgroundColor: 'transparent',
    border: '1px solid #333',
    color: '#888',
    borderRadius: '4px',
    padding: '4px 10px',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  scope: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '16px',
    textTransform: 'capitalize' as const,
  } as React.CSSProperties,

  timeframe: {
    fontSize: '14px',
    color: '#999',
    marginBottom: '20px',
    fontStyle: 'italic',
  } as React.CSSProperties,

  observationsSection: {
    marginBottom: '24px',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '12px',
    color: '#555',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginBottom: '12px',
  } as React.CSSProperties,

  observation: {
    padding: '12px 16px',
    backgroundColor: '#1a1a25',
    borderRadius: '6px',
    marginBottom: '8px',
    borderLeft: '2px solid #333',
  } as React.CSSProperties,

  observationText: {
    fontSize: '14px',
    color: '#b0b0b0',
    margin: 0,
  } as React.CSSProperties,

  observationTime: {
    fontSize: '11px',
    color: '#555',
    marginTop: '6px',
  } as React.CSSProperties,

  summarySection: {
    backgroundColor: '#1a1a25',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
  } as React.CSSProperties,

  summaryText: {
    fontSize: '13px',
    color: '#888',
    margin: 0,
  } as React.CSSProperties,

  uncertaintySection: {
    backgroundColor: '#12121e',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    borderLeft: '3px solid #4a4a5a',
  } as React.CSSProperties,

  uncertaintyTitle: {
    fontSize: '11px',
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginBottom: '8px',
  } as React.CSSProperties,

  uncertaintyList: {
    margin: '0 0 12px 0',
    paddingLeft: '20px',
    color: '#777',
    fontSize: '13px',
  } as React.CSSProperties,

  disclaimer: {
    fontSize: '13px',
    color: '#888',
    fontStyle: 'italic',
    margin: 0,
  } as React.CSSProperties,

  declaration: {
    textAlign: 'center' as const,
    padding: '20px',
    borderTop: '1px solid #2a2a3a',
    marginTop: '20px',
  } as React.CSSProperties,

  declarationText: {
    fontSize: '12px',
    color: '#555',
    fontStyle: 'italic',
    whiteSpace: 'pre-line' as const,
    lineHeight: 1.8,
  } as React.CSSProperties,

  footer: {
    marginTop: '16px',
    fontSize: '10px',
    color: '#444',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#666',
    fontStyle: 'italic',
  } as React.CSSProperties,

  expandToggle: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '8px 0',
    width: '100%',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  privateAnnotation: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#1a1a1a',
    borderRadius: '6px',
    border: '1px dashed #333',
  } as React.CSSProperties,

  annotationInput: {
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#888',
    fontSize: '12px',
    resize: 'vertical' as const,
    minHeight: '60px',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  annotationLabel: {
    fontSize: '10px',
    color: '#555',
    marginBottom: '6px',
    display: 'block',
  } as React.CSSProperties,
};

/* =========================================================
   PROPS
   ========================================================= */

export interface DriftNarrativeViewProps {
  /** Scope to generate narrative for */
  scope?: NarrativeScope;

  /** Scope ID if applicable */
  scopeId?: string;

  /** Days to include */
  days?: number;

  /** Initial presentation mode */
  mode?: NarrativePresentationMode;

  /** Show private annotation area? */
  allowAnnotation?: boolean;

  /** On hide callback */
  onHide?: () => void;

  /** On export callback */
  onExport?: (narrative: DriftNarrative) => void;

  /** Custom class name */
  className?: string;
}

/* =========================================================
   HOOK: Use Drift Narrative
   ========================================================= */

export function useDriftNarrative(options: {
  scope?: NarrativeScope;
  scopeId?: string;
  days?: number;
}): {
  narrative: DriftNarrative | null;
  loading: boolean;
  regenerate: () => void;
} {
  const [narrative, setNarrative] = useState<DriftNarrative | null>(null);
  const [loading, setLoading] = useState(true);

  const regenerate = useCallback(() => {
    setLoading(true);

    try {
      const now = new Date();
      const daysAgo = new Date(now.getTime() - (options.days || 30) * 24 * 60 * 60 * 1000);

      const generated = generateDriftNarrative({
        scope: options.scope || 'global',
        scopeId: options.scopeId,
        timeRange: {
          start: daysAgo.toISOString(),
          end: now.toISOString(),
        },
        maxObservations: 20,
      });

      setNarrative(generated);
    } catch (error) {
      console.error('Failed to generate narrative:', error);
    } finally {
      setLoading(false);
    }
  }, [options.scope, options.scopeId, options.days]);

  React.useEffect(() => {
    regenerate();
  }, [regenerate]);

  return { narrative, loading, regenerate };
}

/* =========================================================
   COMPONENT
   ========================================================= */

export const DriftNarrativeView: React.FC<DriftNarrativeViewProps> = ({
  scope = 'global',
  scopeId,
  days = 30,
  mode = 'short_summary',
  allowAnnotation = false,
  onHide,
  onExport,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(mode !== 'short_summary');
  const [privateAnnotation, setPrivateAnnotation] = useState('');
  const [isHidden, setIsHidden] = useState(false);

  const { narrative, loading, regenerate } = useDriftNarrative({
    scope,
    scopeId,
    days,
  });

  const handleHide = useCallback(() => {
    setIsHidden(true);
    onHide?.();
  }, [onHide]);

  const handleExport = useCallback(() => {
    if (narrative) {
      onExport?.(narrative);

      // Also copy full report to clipboard
      const fullReport = formatNarrativeFullReport(narrative);
      navigator.clipboard?.writeText(fullReport);
    }
  }, [narrative, onExport]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Hidden state
  if (isHidden) {
    return (
      <div style={{ ...styles.container, ...styles.emptyState }} className={className}>
        <p>Narrative hidden for this session.</p>
        <button
          onClick={() => setIsHidden(false)}
          style={styles.controlButton}
        >
          Restore
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container} className={className}>
        <div style={styles.emptyState}>Generating narrative...</div>
      </div>
    );
  }

  if (!narrative) {
    return (
      <div style={styles.container} className={className}>
        <div style={styles.emptyState}>Unable to generate narrative.</div>
      </div>
    );
  }

  const periodStart = new Date(narrative.timeframe.start).toLocaleDateString(
    undefined,
    { month: 'long', day: 'numeric' }
  );
  const periodEnd = new Date(narrative.timeframe.end).toLocaleDateString(
    undefined,
    { month: 'long', day: 'numeric' }
  );

  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{narrative.title}</h2>
          <div style={styles.scope}>{narrative.scope} scope</div>
        </div>
        <div style={styles.controls}>
          <span style={styles.badge}>Observational</span>
          <button style={styles.controlButton} onClick={handleExport}>
            Export
          </button>
          <button style={styles.controlButton} onClick={handleHide}>
            Hide
          </button>
        </div>
      </div>

      {/* Timeframe */}
      <div style={styles.timeframe}>
        Between {periodStart} and {periodEnd}
      </div>

      {/* Observations */}
      {narrative.observations.length > 0 ? (
        <div style={styles.observationsSection}>
          <div style={styles.sectionTitle}>Observations</div>

          {(isExpanded ? narrative.observations : narrative.observations.slice(0, 3)).map(
            (obs) => (
              <div key={obs.id} style={styles.observation}>
                <p style={styles.observationText}>{obs.description}</p>
                <div style={styles.observationTime}>{formatTime(obs.timestamp)}</div>
              </div>
            )
          )}

          {narrative.observations.length > 3 && (
            <button
              style={styles.expandToggle}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded
                ? '▲ Show less'
                : `▼ Show ${narrative.observations.length - 3} more observation(s)`}
            </button>
          )}
        </div>
      ) : (
        <div style={styles.emptyState}>
          No significant changes were observed during this period.
        </div>
      )}

      {/* Variation Summary */}
      {narrative.observations.length > 0 && (
        <div style={styles.summarySection}>
          <div style={styles.sectionTitle}>Summary</div>
          <p style={styles.summaryText}>
            {narrative.variationSummary.frequency.count} change
            {narrative.variationSummary.frequency.count !== 1 ? 's' : ''} recorded
            over {narrative.variationSummary.frequency.period}.
            {narrative.variationSummary.contexts.length > 0 && (
              <> Contexts: {narrative.variationSummary.contexts.join(', ')}.</>
            )}
          </p>
        </div>
      )}

      {/* Uncertainty Statement */}
      <div style={styles.uncertaintySection}>
        <div style={styles.uncertaintyTitle}>Cannot be concluded</div>
        <ul style={styles.uncertaintyList}>
          {narrative.uncertainty.cannotConclude.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <p style={styles.disclaimer}>{narrative.uncertainty.disclaimer}</p>
      </div>

      {/* Private Annotation (user-only, not system-visible) */}
      {allowAnnotation && (
        <div style={styles.privateAnnotation}>
          <label style={styles.annotationLabel}>
            Private annotation (not visible to system)
          </label>
          <textarea
            style={styles.annotationInput}
            value={privateAnnotation}
            onChange={(e) => setPrivateAnnotation(e.target.value)}
            placeholder="Your private notes about this narrative..."
          />
        </div>
      )}

      {/* Declaration */}
      <div style={styles.declaration}>
        <p style={styles.declarationText}>{DRIFT_NARRATIVE_DECLARATION}</p>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        Generated: {new Date(narrative.generatedAt).toLocaleString()}
        <br />
        <button
          onClick={regenerate}
          style={{
            ...styles.controlButton,
            marginTop: '8px',
            fontSize: '10px',
          }}
        >
          Regenerate
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   COMPACT VARIANT
   ========================================================= */

export const DriftNarrativeCompact: React.FC<{
  scope?: NarrativeScope;
  days?: number;
  onExpand?: () => void;
}> = ({ scope = 'global', days = 30, onExpand }) => {
  const { narrative, loading } = useDriftNarrative({ scope, days });

  if (loading || !narrative) {
    return (
      <div
        style={{
          ...styles.container,
          padding: '12px 16px',
          fontSize: '13px',
        }}
      >
        <span style={{ color: '#666' }}>Loading narrative...</span>
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.container,
        padding: '12px 16px',
        cursor: onExpand ? 'pointer' : 'default',
      }}
      onClick={onExpand}
      role={onExpand ? 'button' : undefined}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#999', fontStyle: 'italic' }}>
          {narrative.observations.length > 0
            ? `${narrative.observations.length} change(s) observed`
            : 'No significant changes'}
        </span>
        <span style={styles.badge}>Narrative</span>
      </div>
    </div>
  );
};

/* =========================================================
   EXPORTS
   ========================================================= */

export default DriftNarrativeView;
