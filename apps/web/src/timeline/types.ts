/* =====================================================
   CHE·NU — Timeline Types
   
   PHASE 5: TIMELINE, REPLAY & AUDIT
   
   Every action in CHE·NU is an immutable event.
   The timeline is the SINGLE SOURCE OF TRUTH.
   ===================================================== */

export type EventId = string;
export type EventSource = 'human' | 'agent' | 'system' | 'replay';

export type EventType = 
  | 'navigation.enter' | 'navigation.exit' | 'navigation.focus' | 'navigation.depth'
  | 'interaction.click' | 'interaction.select' | 'interaction.input'
  | 'decision.created' | 'decision.updated' | 'decision.resolved' | 'decision.deferred' | 'decision.cancelled'
  | 'agent.activated' | 'agent.completed' | 'agent.signal' | 'agent.recommendation' | 'agent.proposal'
  | 'proposal.accepted' | 'proposal.rejected' | 'proposal.modified' | 'proposal.deferred'
  | 'state.dimension' | 'state.permission' | 'state.rule' | 'state.config'
  | 'session.start' | 'session.end' | 'session.pause' | 'session.resume'
  | 'milestone.reached' | 'milestone.task' | 'milestone.checkpoint'
  | 'error.agent' | 'error.system' | 'error.validation'
  | 'audit.snapshot' | 'audit.query' | 'audit.export';

export function generateEventId(source: EventSource): EventId {
  return `${Date.now()}-${source}-${Math.random().toString(36).substr(2, 8)}`;
}

export function getTimestampFromId(eventId: EventId): number {
  return parseInt(eventId.split('-')[0], 10) || 0;
}

export interface TimelineEvent<P = unknown> {
  readonly id: EventId;
  readonly timestamp: number;
  readonly source: EventSource;
  readonly sourceId: string | null;
  readonly type: EventType;
  readonly target: EventTarget;
  readonly payload: P;
  readonly causedBy: EventId | null;
  readonly correlationId: string | null;
  readonly context: ContextSnapshot;
  readonly confidence: number | null;
  readonly description: string;
  readonly meta: EventMeta;
}

export interface EventTarget {
  type: 'universe' | 'sphere' | 'node' | 'agent' | 'decision' | 'session' | 'system';
  id: string | null;
  sphereId: string | null;
}

export interface ContextSnapshot {
  sphereId: string | null;
  nodeId: string | null;
  depth: number;
  viewMode: 'universe' | 'sphere' | 'detail';
  sessionId: string;
  sequenceInSession: number;
  actionsPerMinute: number;
  pendingDecisions: number;
  activeAgents: number;
  errorCount: number;
}

export interface EventMeta {
  schemaVersion: '1.0';
  replayable: boolean;
  isReplay: boolean;
  originalEventId?: EventId;
  tags: string[];
}

// Payloads
export interface NavigationPayload {
  from: { sphereId: string | null; nodeId: string | null; depth: number };
  to: { sphereId: string | null; nodeId: string | null; depth: number };
  method: 'click' | 'keyboard' | 'breadcrumb' | 'agent' | 'direct';
}

export interface InteractionPayload {
  action: string;
  targetType: string;
  targetId: string;
  value?: unknown;
}

export interface DecisionPayload {
  decisionId: string;
  title: string;
  status: 'created' | 'updated' | 'resolved' | 'deferred' | 'cancelled';
  selectedOption?: string;
  reason?: string;
}

export interface AgentPayload {
  agentId: string;
  agentName: string;
  action: string;
  outputId?: string;
  outputSummary?: string;
  reasoning?: string;
}

export interface ProposalResponsePayload {
  proposalId: string;
  agentId: string;
  response: 'accepted' | 'rejected' | 'modified' | 'deferred';
  humanReason?: string;
}

export interface StateChangePayload {
  changeType: string;
  path: string;
  previousValue: unknown;
  newValue: unknown;
  reason: string;
}

export interface ErrorPayload {
  errorType: 'agent' | 'system' | 'validation';
  code: string;
  message: string;
  recoverable: boolean;
}

// Query & Results
export interface TimelineQuery {
  from?: number;
  to?: number;
  sources?: EventSource[];
  types?: EventType[];
  sphereIds?: string[];
  agentIds?: string[];
  sessionId?: string;
  correlationId?: string;
  causedBy?: EventId;
  causing?: EventId;
  tags?: string[];
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
}

export interface TimelineQueryResult {
  events: TimelineEvent[];
  total: number;
  hasMore: boolean;
  query: TimelineQuery;
  executedAt: number;
}

// State Reconstruction
export interface ReconstructedState {
  timestamp: number;
  eventId: EventId;
  sessionId: string;
  sessionStartedAt: number;
  currentSphere: string | null;
  currentNode: string | null;
  currentDepth: number;
  viewMode: 'universe' | 'sphere' | 'detail';
  pendingDecisions: DecisionState[];
  resolvedDecisions: DecisionState[];
  agentProposals: ProposalState[];
  metrics: {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySource: Record<string, number>;
    actionsPerMinute: number;
    errorsInSession: number;
  };
}

export interface DecisionState {
  id: string;
  title: string;
  status: string;
  createdAt: number;
  resolvedAt?: number;
  sphereId: string | null;
}

export interface ProposalState {
  id: string;
  agentId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'modified' | 'deferred' | 'expired';
  createdAt: number;
  respondedAt?: number;
  summary: string;
}

// Replay
export interface ReplayConfig {
  fromEventId?: EventId;
  toEventId?: EventId;
  fromTimestamp?: number;
  toTimestamp?: number;
  includeTypes?: EventType[];
  excludeTypes?: EventType[];
  includeSources?: EventSource[];
  speed: number;
  mode: 'sequential' | 'instant';
  onEvent?: (event: TimelineEvent, index: number, total: number) => void;
  onStateChange?: (state: ReconstructedState) => void;
  onComplete?: (summary: ReplaySummary) => void;
}

export interface ReplaySummary {
  eventsReplayed: number;
  duration: number;
  startTimestamp: number;
  endTimestamp: number;
  finalState: ReconstructedState;
}

// Audit
export interface AuditReport {
  reportId: string;
  generatedAt: number;
  timeRange: { from: number; to: number };
  sessionIds: string[];
  summary: {
    totalEvents: number;
    eventsBySource: Record<EventSource, number>;
    eventsByType: Record<string, number>;
    decisionsCreated: number;
    decisionsResolved: number;
    agentProposals: number;
    proposalsAccepted: number;
    proposalsRejected: number;
    errors: number;
  };
  agentActivity: {
    agentId: string;
    agentName: string;
    activations: number;
    proposals: number;
    acceptanceRate: number;
    averageConfidence: number;
  }[];
  decisionFlow: {
    created: number;
    resolved: number;
    deferred: number;
    cancelled: number;
    averageResolutionTimeMs: number;
  };
  humanOversight: {
    proposalResponses: number;
    acceptanceRate: number;
    modificationRate: number;
    rejectionRate: number;
    averageResponseTimeMs: number;
  };
  anomalies: {
    type: string;
    description: string;
    eventIds: EventId[];
    severity: 'low' | 'medium' | 'high';
  }[];
}

// Factory
export function createEvent<P>(
  source: EventSource,
  sourceId: string | null,
  type: EventType,
  target: EventTarget,
  payload: P,
  context: ContextSnapshot,
  options: {
    causedBy?: EventId;
    correlationId?: string;
    confidence?: number;
    description?: string;
    tags?: string[];
  } = {}
): TimelineEvent<P> {
  return {
    id: generateEventId(source),
    timestamp: Date.now(),
    source,
    sourceId,
    type,
    target,
    payload,
    causedBy: options.causedBy || null,
    correlationId: options.correlationId || null,
    context,
    confidence: options.confidence ?? null,
    description: options.description || `${type}`,
    meta: {
      schemaVersion: '1.0',
      replayable: true,
      isReplay: false,
      tags: options.tags || [],
    },
  };
}

export function createContextSnapshot(
  partial: Partial<ContextSnapshot> & { sessionId: string; sequenceInSession: number }
): ContextSnapshot {
  return {
    sphereId: partial.sphereId ?? null,
    nodeId: partial.nodeId ?? null,
    depth: partial.depth ?? 0,
    viewMode: partial.viewMode ?? 'universe',
    sessionId: partial.sessionId,
    sequenceInSession: partial.sequenceInSession,
    actionsPerMinute: partial.actionsPerMinute ?? 0,
    pendingDecisions: partial.pendingDecisions ?? 0,
    activeAgents: partial.activeAgents ?? 0,
    errorCount: partial.errorCount ?? 0,
  };
}
