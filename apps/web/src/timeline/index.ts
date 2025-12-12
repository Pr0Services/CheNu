/* =====================================================
   CHE·NU — Timeline Module
   PHASE 5: TIMELINE, REPLAY & AUDIT
   
   Complete event tracking system providing:
   - Immutable event recording
   - Session replay capability
   - Audit trail and reporting
   - Causality tracking
   - Insights generation
   ===================================================== */

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

export type {
  EventId,
  EventSource,
  EventCategory,
  EventType,
  TimelineEvent,
  EventContext,
  EventMetadata,
  EventPayload,
  NavigationPayload,
  DecisionPayload,
  AgentPayload,
  StatePayload,
  ErrorPayload,
  MilestonePayload,
  AuditPayload,
  SystemSnapshot,
  ReplaySession,
  AuditQuery,
  AuditReport,
  AuditSummary,
  AuditInsight,
} from './types';

export { generateEventId, SCHEMA_VERSION } from './types';

// ─────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────

export { TimelineStore, getTimelineStore, resetTimelineStore } from './TimelineStore';
export type { TimelineListener, TimelineStats } from './TimelineStore';

// ─────────────────────────────────────────────────────
// RECORDER
// ─────────────────────────────────────────────────────

export { TimelineRecorder, getTimelineRecorder } from './TimelineRecorder';
export type { RecordOptions } from './TimelineRecorder';

// ─────────────────────────────────────────────────────
// REPLAY
// ─────────────────────────────────────────────────────

export { ReplayEngine, getReplayEngine } from './ReplayEngine';
export type { ReplayOptions } from './ReplayEngine';

// ─────────────────────────────────────────────────────
// AUDIT
// ─────────────────────────────────────────────────────

export { AuditEngine } from './AuditEngine';
export type { AgentPerformance, DecisionMetrics } from './AuditEngine';

// ─────────────────────────────────────────────────────
// CONVENIENCE FUNCTIONS
// ─────────────────────────────────────────────────────

import { TimelineStore, getTimelineStore } from './TimelineStore';
import { TimelineRecorder, getTimelineRecorder } from './TimelineRecorder';
import { AuditEngine } from './AuditEngine';
import { AuditReport, AuditQuery } from './types';

/**
 * Quick setup for a recording session.
 */
export function startRecordingSession(sessionId?: string): {
  store: TimelineStore;
  recorder: TimelineRecorder;
} {
  const store = new TimelineStore({ sessionId });
  const recorder = new TimelineRecorder(store);
  recorder.recordSessionStart();
  return { store, recorder };
}

/**
 * Generate a quick audit report for current session.
 */
export function generateQuickAudit(query?: Partial<AuditQuery>): AuditReport {
  const store = getTimelineStore();
  const engine = new AuditEngine(store);
  return engine.generateReport({
    limit: 1000,
    ...query,
  });
}

/**
 * Export current timeline as JSON.
 */
export function exportTimeline(): string {
  return getTimelineStore().export();
}

/**
 * Import timeline from JSON.
 */
export function importTimeline(json: string): TimelineStore {
  return TimelineStore.import(json);
}
