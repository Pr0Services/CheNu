/* =====================================================
   CHE·NU — Drift Visualization Module
   Status: INFORMATIONAL ONLY — NO AUTHORITY
   
   📜 "Surface change without judgment.
      Show direction without prediction.
      Preserve user sovereignty."
   ===================================================== */

// === DRIFT AWARENESS (Basic) ===
export {
  // Components
  DriftAwarenessPanel,
  DriftAwarenessCompact,
  DriftDetailModal,
  
  // Hook
  useDriftAnalysis,
  
  // Types
  type DriftAwarenessProps,
  type DriftDetailProps,
} from './DriftAwarenessPanel';

// === DRIFT VISUALIZATION TYPES ===
export {
  // Timeline Types
  type DriftTimelinePoint,
  type DriftTimelineSegment,
  type DriftTimeline,
  
  // Heatmap Types
  type PreferenceCategory,
  type ScopeLevel,
  type HeatIntensity,
  type HeatmapCell,
  type DriftHeatmap,
  
  // Config Types
  type TimelineViewConfig,
  type HeatmapViewConfig,
  type DriftVisualizationConfig,
  
  // Interaction Types
  type UserInteraction,
  type InteractionEvent,
  
  // Language Types
  type AllowedTerm,
  type ForbiddenTerm,
  
  // XR Types
  type XRTimelineView,
  type XRHeatmapView,
  
  // Constants
  ALLOWED_TERMS,
  FORBIDDEN_TERMS,
  DEFAULT_TIMELINE_CONFIG,
  DEFAULT_HEATMAP_CONFIG,
  DEFAULT_VISUALIZATION_CONFIG,
  DRIFT_VISUALIZATION_CONFIRMATION,
  
  // Functions
  validateNeutralLanguage,
} from './driftVisualization.types';

// === DRIFT TIMELINE (Temporal View) ===
export {
  DriftTimelineView,
  useDriftTimeline,
  type DriftTimelineProps,
} from './DriftTimeline';

// === DRIFT HEATMAP (Spatial View) ===
export {
  DriftHeatmapView,
  useDriftHeatmap,
  type DriftHeatmapProps,
} from './DriftHeatmap';

// === DRIFT VISUALIZATION DASHBOARD ===
export {
  DriftVisualizationDashboard,
  type DriftVisualizationDashboardProps,
} from './DriftVisualizationDashboard';

// === DRIFT NARRATIVE TYPES ===
export {
  // Types
  type NarrativeScope,
  type NarrativeObservation,
  type VariationSummary,
  type UncertaintyStatement,
  type DriftNarrative,
  type NarrativePresentationMode,
  type NarrativePresentationConfig,
  type NarrativeUserInteraction,
  type NarrativeSystemCapability,
  type ForbiddenSystemAction,
  type XRNarrativePresentation,
  type NarrativeGenerationRequest,
  type AllowedNarrativeWord,
  type ForbiddenNarrativeWord,
  
  // Constants
  ALLOWED_NARRATIVE_LANGUAGE,
  FORBIDDEN_NARRATIVE_LANGUAGE,
  DEFAULT_PRESENTATION_CONFIG,
  DEFAULT_UNCERTAINTY_DISCLAIMER,
  DEFAULT_CANNOT_CONCLUDE,
  DRIFT_NARRATIVE_DECLARATION,
  NARRATIVE_FAILSAFES,
  
  // Functions
  validateNarrativeLanguage,
} from './driftNarrative.types';

// === DRIFT NARRATIVE GENERATOR ===
export {
  generateDriftNarrative,
  formatNarrativeShortSummary,
  formatNarrativeExpandableLog,
  formatNarrativeFullReport,
  formatNarrativeTimelineAnnotations,
  formatDateRange,
  OBSERVATION_TEMPLATES,
  type TimelineAnnotation,
} from './driftNarrativeGenerator';

// === DRIFT NARRATIVE VIEW ===
export {
  DriftNarrativeView,
  DriftNarrativeCompact,
  useDriftNarrative,
  type DriftNarrativeViewProps,
} from './DriftNarrativeView';

// === DRIFT + CONTEXT OVERLAY ===
export {
  DriftContextOverlay,
  useDriftContextOverlay,
  type DriftContextOverlayProps,
  type OverlayDataPoint,
  type OverlayHeatmapCell,
} from './DriftContextOverlay';

// === NARRATIVE CONSTELLATION VIEW ===
export {
  // Types
  type DriftType,
  type NarrativeVisibility,
  type ConstellationLayout,
  type NarrativeNode,
  type NarrativeRelationship,
  type RelationshipType,
  type ConstellationFilter,
  type ConstellationConfig,
  type NarrativeConstellation,
  type ConstellationInteraction,
  type ConstellationInteractionEvent,
  type SelectedNodeState,
  type XRConstellationConfig,
  type XRNarrativeNode,
  type AllowedConstellationLabel,
  type ForbiddenConstellationLabel,
  
  // Constants
  ALLOWED_CONSTELLATION_LABELS,
  FORBIDDEN_CONSTELLATION_LABELS,
  DEFAULT_CONSTELLATION_CONFIG,
  DEFAULT_XR_CONSTELLATION_CONFIG,
  SCOPE_COLORS,
  NARRATIVE_CONSTELLATION_DECLARATION,
  CONSTELLATION_FAILSAFES,
  
  // Functions
  isAllowedLabel,
} from './narrativeConstellation.types';

export {
  // Engine functions
  generateConstellation,
  findNearbyNodes,
  getConstellationSummary,
  toXRConstellation,
  checkTemporalOverlap,
} from './narrativeConstellationEngine';

export {
  // Components
  NarrativeConstellationView,
  NarrativeConstellationCompact,
  
  // Hook
  useConstellation,
  
  // Types
  type NarrativeConstellationViewProps,
  type NarrativeConstellationCompactProps,
} from './NarrativeConstellationView';

// === MULTI-COMPARATIVE NARRATIVES ===
export {
  MultiComparativeNarrativeView,
  useMultiSphereNarrative,
  useIndividualVsCollectiveNarrative,
  type MultiComparativeNarrativeViewProps,
} from './MultiComparativeNarrativeView';

// === COMPARATIVE NARRATIVE TYPES ===
export {
  // Language
  ALLOWED_COMPARATIVE_TERMS,
  FORBIDDEN_COMPARATIVE_TERMS,
  ALLOWED_MULTI_COMPARATIVE_TERMS,
  FORBIDDEN_MULTI_COMPARATIVE_TERMS,
  validateComparativeLanguage,
  
  // Multi-sphere types
  type ComparableSphere,
  type TemporalRelationship,
  type AggregationLevel,
  type ComparisonFamily,
  type MultiSphereScope,
  type MultiSpherePattern,
  type MultiSphereComparativeNarrative,
  
  // Individual vs Collective types
  type IndividualDriftScope,
  type CollectiveDriftScope,
  type NonConclusionStatements,
  type IndividualVsCollectiveNarrative,
  
  // Constants
  DEFAULT_INTERPRETATION_BOUNDARIES,
  DEFAULT_NON_CONCLUSIONS,
  COMPARATIVE_NARRATIVE_DECLARATION,
} from './comparativeNarrative.types';

// === COMPARATIVE NARRATIVE ENGINE ===
export {
  generateComparativeNarrative,
  generateMultiSphereNarrative,
  generateIndividualVsCollectiveNarrative,
  formatComparativeNarrative,
  formatMultiSphereNarrative,
  formatIndividualVsCollectiveNarrative,
  compareScopeDrift,
  compareTimePeriodDrift,
} from './comparativeNarrativeEngine';

// === COMPARATIVE NARRATIVE TYPES ===
export {
  // Comparison Axis
  type ComparisonAxis,
  type ComparisonAxisDefinition,
  
  // Narrative Source
  type DriftNarrativeSource,
  
  // Observations
  type SharedObservation,
  type DivergentObservation,
  type TemporalAlignment,
  type InterpretationBoundary,
  
  // Narrative
  type ComparativeDriftNarrative,
  
  // Presentation
  type PresentationMode,
  type PresentationConfig as ComparativePresentationConfig,
  
  // Language
  type AllowedComparativeTerm,
  type ForbiddenComparativeTerm,
  
  // XR
  type XRComparativeConfig,
  type ComparativeUserInteraction,
  
  // Constants
  ALLOWED_COMPARATIVE_TERMS,
  FORBIDDEN_COMPARATIVE_TERMS,
  DEFAULT_INTERPRETATION_BOUNDARIES,
  DEFAULT_PRESENTATION_CONFIG as DEFAULT_COMPARATIVE_PRESENTATION_CONFIG,
  DEFAULT_XR_COMPARATIVE_CONFIG,
  COMPARATIVE_NARRATIVE_DECLARATION,
  FORBIDDEN_SYSTEM_ACTIONS,
  
  // Functions
  validateComparativeLanguage,
} from './comparativeNarrative.types';

// === COMPARATIVE NARRATIVE ENGINE ===
export {
  generateComparativeNarrative,
  createNarrativeSourceFromDetector,
  compareScopeDrift,
  compareTimePeriodDrift,
  formatComparativeNarrative,
  validateSourcesComparable,
} from './comparativeNarrativeEngine';

// === COMPARATIVE NARRATIVE VIEW ===
export {
  ComparativeNarrativeView,
  ComparativeNarrativeCompact,
  type ComparativeNarrativeViewProps,
  type ComparativeNarrativeCompactProps,
} from './ComparativeNarrativeView';
