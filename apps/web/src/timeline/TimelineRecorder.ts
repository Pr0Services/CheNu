/* =====================================================
   CHE·NU — Timeline Recorder
   PHASE 5: Records system events to timeline
   ===================================================== */

import {
  TimelineEvent, EventId, EventSource, EventCategory, EventType,
  EventContext, EventMetadata, EventPayload,
  NavigationPayload, DecisionPayload, AgentPayload, StatePayload, ErrorPayload, MilestonePayload,
  generateEventId, SCHEMA_VERSION,
} from './types';
import { TimelineStore, getTimelineStore } from './TimelineStore';

export class TimelineRecorder {
  private store: TimelineStore;
  private currentContext: Partial<EventContext> = {};
  private correlationStack: string[] = [];
  
  constructor(store?: TimelineStore) {
    this.store = store || getTimelineStore();
  }
  
  // ─────────────────────────────────────────────────────
  // CONTEXT MANAGEMENT
  // ─────────────────────────────────────────────────────
  
  setContext(context: Partial<EventContext>): void {
    this.currentContext = { ...this.currentContext, ...context };
  }
  
  pushCorrelation(correlationId: string): void {
    this.correlationStack.push(correlationId);
  }
  
  popCorrelation(): string | undefined {
    return this.correlationStack.pop();
  }
  
  // ─────────────────────────────────────────────────────
  // GENERIC RECORDING
  // ─────────────────────────────────────────────────────
  
  record<T extends EventPayload>(
    source: EventSource,
    category: EventCategory,
    type: EventType,
    payload: T,
    description: string,
    options: RecordOptions = {}
  ): EventId {
    const id = generateEventId(source, type);
    
    const event: TimelineEvent<T> = {
      id,
      timestamp: Date.now(),
      source,
      category,
      type,
      context: this.buildContext(options.context),
      payload,
      description,
      causedBy: options.causedBy,
      correlationId: options.correlationId || this.correlationStack[this.correlationStack.length - 1],
      metadata: {
        schemaVersion: SCHEMA_VERSION,
        replayable: options.replayable ?? true,
        containsPII: options.containsPII ?? false,
      },
    };
    
    this.store.append(event);
    return id;
  }
  
  private buildContext(override?: Partial<EventContext>): EventContext {
    return {
      sphereId: null,
      nodeId: null,
      depth: 0,
      viewMode: 'universe',
      sessionId: this.store.getSessionId(),
      sequenceNumber: 0, // Will be set by store
      ...this.currentContext,
      ...override,
    };
  }
  
  // ─────────────────────────────────────────────────────
  // NAVIGATION EVENTS
  // ─────────────────────────────────────────────────────
  
  recordNavigation(
    from: { sphereId: string | null },
    to: { sphereId: string | null },
    options: RecordOptions = {}
  ): EventId {
    const type: EventType = to.sphereId ? 'nav:sphere-enter' : 'nav:sphere-exit';
    const payload: NavigationPayload = { kind: 'navigation', from, to };
    
    const id = this.record('user', 'navigation', type, payload,
      to.sphereId ? `Entered sphere: ${to.sphereId}` : `Exited to universe view`,
      options
    );
    
    this.setContext({ sphereId: to.sphereId });
    return id;
  }
  
  recordDepthChange(newDepth: number, options: RecordOptions = {}): EventId {
    return this.record('user', 'navigation', 'nav:depth-change',
      { kind: 'navigation', from: { sphereId: this.currentContext.sphereId || null }, to: { sphereId: this.currentContext.sphereId || null } },
      `Depth changed to ${newDepth}`,
      { ...options, context: { depth: newDepth } }
    );
  }
  
  // ─────────────────────────────────────────────────────
  // INTERACTION EVENTS
  // ─────────────────────────────────────────────────────
  
  recordClick(targetId: string, targetType: string, options: RecordOptions = {}): EventId {
    return this.record('user', 'interaction', 'interact:click',
      { kind: 'interaction', targetType, targetId, action: 'click' } as any,
      `Clicked on ${targetType}: ${targetId}`,
      options
    );
  }
  
  recordSelect(targetId: string, value: unknown, options: RecordOptions = {}): EventId {
    return this.record('user', 'interaction', 'interact:select',
      { kind: 'interaction', targetType: 'control', targetId, action: 'select', value } as any,
      `Selected ${targetId}`,
      options
    );
  }
  
  // ─────────────────────────────────────────────────────
  // DECISION EVENTS
  // ─────────────────────────────────────────────────────
  
  recordDecisionCreated(decisionId: string, title: string, options: RecordOptions = {}): EventId {
    const payload: DecisionPayload = { kind: 'decision', decisionId, status: 'created', title };
    return this.record('system', 'decision', 'decision:created', payload,
      `Decision created: ${title}`,
      options
    );
  }
  
  recordDecisionResolved(decisionId: string, title: string, outcome: string, options: RecordOptions = {}): EventId {
    const payload: DecisionPayload = { kind: 'decision', decisionId, status: 'resolved', title, outcome };
    return this.record('user', 'decision', 'decision:resolved', payload,
      `Decision resolved: ${title} → ${outcome}`,
      options
    );
  }
  
  recordDecisionDeferred(decisionId: string, title: string, options: RecordOptions = {}): EventId {
    const payload: DecisionPayload = { kind: 'decision', decisionId, status: 'deferred', title };
    return this.record('user', 'decision', 'decision:deferred', payload,
      `Decision deferred: ${title}`,
      options
    );
  }
  
  // ─────────────────────────────────────────────────────
  // AGENT EVENTS
  // ─────────────────────────────────────────────────────
  
  recordAgentActivated(agentId: string, options: RecordOptions = {}): EventId {
    const payload: AgentPayload = { kind: 'agent', agentId, action: 'activated' };
    return this.record('system', 'agent', 'agent:activated', payload,
      `Agent activated: ${agentId}`,
      { ...options, context: { agentId } }
    );
  }
  
  recordAgentCompleted(agentId: string, outputCount: number, options: RecordOptions = {}): EventId {
    const payload: AgentPayload = { kind: 'agent', agentId, action: 'completed' };
    return this.record('system', 'agent', 'agent:completed', payload,
      `Agent completed: ${agentId} (${outputCount} outputs)`,
      { ...options, context: { agentId } }
    );
  }
  
  recordAgentSignal(agentId: string, outputId: string, message: string, options: RecordOptions = {}): EventId {
    const payload: AgentPayload = { kind: 'agent', agentId, action: 'signal', outputId };
    return this.record('agent', 'agent', 'agent:signal', payload,
      `Agent signal: ${message}`,
      { ...options, context: { agentId } }
    );
  }
  
  recordAgentRecommendation(agentId: string, outputId: string, description: string, confidence: number, options: RecordOptions = {}): EventId {
    const payload: AgentPayload = { kind: 'agent', agentId, action: 'recommendation', outputId, confidence };
    return this.record('agent', 'agent', 'agent:recommendation', payload,
      `Agent recommendation: ${description}`,
      { ...options, context: { agentId } }
    );
  }
  
  recordProposalAccepted(agentId: string, outputId: string, options: RecordOptions = {}): EventId {
    const payload: AgentPayload = { kind: 'agent', agentId, action: 'accepted', outputId, accepted: true };
    return this.record('user', 'agent', 'agent:proposal-accepted', payload,
      `Proposal accepted from ${agentId}`,
      options
    );
  }
  
  recordProposalRejected(agentId: string, outputId: string, reason?: string, options: RecordOptions = {}): EventId {
    const payload: AgentPayload = { kind: 'agent', agentId, action: 'rejected', outputId, accepted: false };
    return this.record('user', 'agent', 'agent:proposal-rejected', payload,
      `Proposal rejected from ${agentId}${reason ? `: ${reason}` : ''}`,
      options
    );
  }
  
  // ─────────────────────────────────────────────────────
  // STATE CHANGE EVENTS
  // ─────────────────────────────────────────────────────
  
  recordStateChange(target: string, before: unknown, after: unknown, options: RecordOptions = {}): EventId {
    const payload: StatePayload = { kind: 'state-change', target, before, after };
    return this.record('system', 'state', 'state:dimension-change', payload,
      `State changed: ${target}`,
      options
    );
  }
  
  // ─────────────────────────────────────────────────────
  // ERROR EVENTS
  // ─────────────────────────────────────────────────────
  
  recordError(code: string, message: string, recoverable: boolean, source: 'agent' | 'system', options: RecordOptions = {}): EventId {
    const payload: ErrorPayload = { kind: 'error', code, message, recoverable };
    const type: EventType = source === 'agent' ? 'error:agent' : 'error:system';
    return this.record('system', 'error', type, payload,
      `Error [${code}]: ${message}`,
      options
    );
  }
  
  // ─────────────────────────────────────────────────────
  // MILESTONE EVENTS
  // ─────────────────────────────────────────────────────
  
  recordSessionStart(options: RecordOptions = {}): EventId {
    const payload: MilestonePayload = { kind: 'milestone', title: 'Session started' };
    return this.record('system', 'milestone', 'milestone:session-start', payload,
      'Session started',
      options
    );
  }
  
  recordSessionEnd(metrics?: Record<string, number>, options: RecordOptions = {}): EventId {
    const payload: MilestonePayload = { kind: 'milestone', title: 'Session ended', metrics };
    return this.record('system', 'milestone', 'milestone:session-end', payload,
      'Session ended',
      options
    );
  }
  
  recordTaskComplete(title: string, metrics?: Record<string, number>, options: RecordOptions = {}): EventId {
    const payload: MilestonePayload = { kind: 'milestone', title, metrics };
    return this.record('user', 'milestone', 'milestone:task-complete', payload,
      `Task completed: ${title}`,
      options
    );
  }
  
  // ─────────────────────────────────────────────────────
  // AUDIT EVENTS
  // ─────────────────────────────────────────────────────
  
  recordSnapshot(options: RecordOptions = {}): EventId {
    const snapshot = this.store.createSnapshot();
    return this.record('system', 'audit', 'audit:snapshot',
      { kind: 'audit', auditType: 'snapshot', snapshotData: snapshot },
      'System snapshot created',
      options
    );
  }
  
  recordCheckpoint(checkpointId: string, options: RecordOptions = {}): EventId {
    return this.record('system', 'audit', 'audit:checkpoint',
      { kind: 'audit', auditType: 'checkpoint' },
      `Checkpoint: ${checkpointId}`,
      options
    );
  }
}

export interface RecordOptions {
  causedBy?: EventId;
  correlationId?: string;
  context?: Partial<EventContext>;
  replayable?: boolean;
  containsPII?: boolean;
}

// Singleton
let defaultRecorder: TimelineRecorder | null = null;
export function getTimelineRecorder(): TimelineRecorder {
  if (!defaultRecorder) defaultRecorder = new TimelineRecorder();
  return defaultRecorder;
}
