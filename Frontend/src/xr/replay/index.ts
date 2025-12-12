/* =====================================================
   CHE·NU — XR Replay Module Index
   
   📜 CORE PRINCIPLES:
   - Replay is observational ONLY
   - No agent can act
   - No decision is re-executed
   - Timeline is IMMUTABLE
   - Replay is READ-ONLY
   ===================================================== */

// === STANDARD REPLAY SYSTEM ===
export {
  // Engine
  XRMeetingReplayEngine,
  
  // Visual mapping
  mapReplayEventToXRVisual,
  getCompositeVisualState,
  
  // React hook
  useXRMeetingReplay,
  
  // Guards
  guardReplayMode,
  createReplayModeContext,
  
  // Constants
  REPLAY_SPEEDS,
  SPEED_MULTIPLIERS,
  
  // Types
  type ReplaySpeed,
  type ReplayEventType,
  type EventAuthor,
  type MeetingReplayEvent,
  type XRReplayState,
  type XRReplayVisualHook,
  type ReplayMarker,
  type UseXRReplayReturn,
  type ReplayModeContext,
} from './XRMeetingReplaySystem';

// === FULL REPLAY BLOCK ===
export {
  // Decision Comparison
  XRDecisionComparisonReplay,
  useDecisionComparison,
  
  // Insight Engine
  XRReplayInsightEngine,
  useReplayInsights,
  mapInsightToXRVisual,
  
  // Types
  type DecisionTrack,
  type ReplayInsight,
  type InsightType,
  type InsightSeverity,
  type InsightAnalysisConfig,
  type UseReplayInsightsReturn,
  type UseDecisionComparisonReturn,
} from './XRReplayFullBlock';

// === REPLAY EXTENSIONS (PDF Export + Universe Projection) ===
export {
  // Insight Engine (extended)
  XRReplayInsightEngine as XRReplayInsightEngineV2,
  
  // PDF Exporter
  XRReplayPDFExporter,
  
  // Universe Projector
  XRReplayUniverseProjector,
  
  // Visual mapping
  mapUniverseReplayToVisual,
  getProjectionColor,
  
  // React hooks
  useReplayInsights as useReplayInsightsV2,
  useReplayExport,
  useUniverseProjection,
  
  // Default options
  DEFAULT_EXPORT_OPTIONS,
  SUMMARY_EXPORT_OPTIONS,
  
  // Types
  type ReplayInsight as ReplayInsightV2,
  type ReplayPDFSection,
  type ReplayExportOptions,
  type UniverseNodeType,
  type ProjectionIntensity,
  type UniverseNodeReplayProjection,
  type UniverseReplayVisual,
} from './XRReplayExtensions';
