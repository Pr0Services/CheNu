/* =====================================================
   CHE·NU — Timeline Store
   PHASE 5: Append-only event storage
   ===================================================== */

import { TimelineEvent, EventId, EventSource, EventType, EventTarget, ContextSnapshot, TimelineQuery, TimelineQueryResult, createEvent } from './types';

export interface TimelineStoreConfig {
  maxInMemory: number;
  onEventAdded?: (event: TimelineEvent) => void;
}

export class TimelineStore {
  private events: TimelineEvent[] = [];
  private eventMap: Map<EventId, TimelineEvent> = new Map();
  private bySource: Map<EventSource, EventId[]> = new Map();
  private byType: Map<EventType, EventId[]> = new Map();
  private bySphere: Map<string, EventId[]> = new Map();
  private bySession: Map<string, EventId[]> = new Map();
  private byCorrelation: Map<string, EventId[]> = new Map();
  private byCause: Map<EventId, EventId[]> = new Map();
  private config: TimelineStoreConfig;
  private sequenceCounter = 0;
  private currentSessionId: string | null = null;
  private listeners: Set<(event: TimelineEvent) => void> = new Set();

  constructor(config: Partial<TimelineStoreConfig> = {}) {
    this.config = { maxInMemory: 10000, ...config };
  }

  append<P>(event: TimelineEvent<P>): TimelineEvent<P> {
    if (!event.id) throw new Error('Event must have an ID');
    if (this.eventMap.has(event.id)) throw new Error(`Event ${event.id} already exists`);
    
    this.events.push(event);
    this.eventMap.set(event.id, event);
    this.indexEvent(event);
    this.sequenceCounter++;
    this.listeners.forEach(l => l(event));
    this.config.onEventAdded?.(event);
    if (this.events.length > this.config.maxInMemory) {
      this.events.splice(0, this.events.length - this.config.maxInMemory);
    }
    return event;
  }

  record<P>(
    source: EventSource, sourceId: string | null, type: EventType, target: EventTarget,
    payload: P, context: Partial<ContextSnapshot>, options: { causedBy?: EventId; correlationId?: string; confidence?: number; description?: string; tags?: string[] } = {}
  ): TimelineEvent<P> {
    const fullContext: ContextSnapshot = {
      sphereId: context.sphereId ?? null, nodeId: context.nodeId ?? null, depth: context.depth ?? 0,
      viewMode: context.viewMode ?? 'universe', sessionId: context.sessionId ?? this.currentSessionId ?? 'unknown',
      sequenceInSession: this.getSessionSequence(context.sessionId ?? this.currentSessionId),
      actionsPerMinute: context.actionsPerMinute ?? 0, pendingDecisions: context.pendingDecisions ?? 0,
      activeAgents: context.activeAgents ?? 0, errorCount: context.errorCount ?? 0,
    };
    return this.append(createEvent(source, sourceId, type, target, payload, fullContext, options));
  }

  private indexEvent(event: TimelineEvent): void {
    const addToIndex = (map: Map<string, EventId[]>, key: string) => {
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event.id);
    };
    addToIndex(this.bySource, event.source);
    addToIndex(this.byType, event.type);
    if (event.target.sphereId) addToIndex(this.bySphere, event.target.sphereId);
    addToIndex(this.bySession, event.context.sessionId);
    if (event.correlationId) addToIndex(this.byCorrelation, event.correlationId);
    if (event.causedBy) addToIndex(this.byCause, event.causedBy);
  }

  get(eventId: EventId): TimelineEvent | undefined { return this.eventMap.get(eventId); }
  getAll(): readonly TimelineEvent[] { return this.events; }
  count(): number { return this.events.length; }

  query(params: TimelineQuery): TimelineQueryResult {
    let results = [...this.events];
    if (params.from) results = results.filter(e => e.timestamp >= params.from!);
    if (params.to) results = results.filter(e => e.timestamp <= params.to!);
    if (params.sources) results = results.filter(e => params.sources!.includes(e.source));
    if (params.types) results = results.filter(e => params.types!.includes(e.type));
    if (params.sphereIds) results = results.filter(e => params.sphereIds!.includes(e.target.sphereId || ''));
    if (params.agentIds && params.sources?.includes('agent')) results = results.filter(e => params.agentIds!.includes(e.sourceId || ''));
    if (params.sessionId) results = results.filter(e => e.context.sessionId === params.sessionId);
    if (params.correlationId) results = results.filter(e => e.correlationId === params.correlationId);
    if (params.causedBy) results = results.filter(e => e.causedBy === params.causedBy);
    if (params.tags?.length) results = results.filter(e => params.tags!.some(t => e.meta.tags.includes(t)));
    
    results.sort((a, b) => params.order === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
    const total = results.length;
    const offset = params.offset || 0;
    const limit = params.limit || 100;
    results = results.slice(offset, offset + limit);
    return { events: results, total, hasMore: offset + limit < total, query: params, executedAt: Date.now() };
  }

  getSession(sessionId: string): TimelineEvent[] {
    return this.query({ sessionId, order: 'asc' }).events;
  }

  getCausedBy(eventId: EventId): TimelineEvent[] {
    return (this.byCause.get(eventId) || []).map(id => this.eventMap.get(id)!).filter(Boolean);
  }

  startSession(sessionId: string): void {
    this.currentSessionId = sessionId;
    this.record('system', null, 'session.start', { type: 'session', id: sessionId, sphereId: null }, { sessionId }, { sessionId, sequenceInSession: 0 });
  }

  endSession(): void {
    if (this.currentSessionId) {
      this.record('system', null, 'session.end', { type: 'session', id: this.currentSessionId, sphereId: null }, {}, {});
      this.currentSessionId = null;
    }
  }

  getCurrentSessionId(): string | null { return this.currentSessionId; }
  private getSessionSequence(sessionId: string | null): number {
    return sessionId ? (this.bySession.get(sessionId)?.length || 0) : 0;
  }

  subscribe(listener: (event: TimelineEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getStats(): TimelineStoreStats {
    return {
      totalEvents: this.events.length, sessionsTracked: this.bySession.size,
      spheresTracked: this.bySphere.size, memoryUsage: this.events.length, maxMemory: this.config.maxInMemory,
    };
  }

  export(): TimelineEvent[] { return [...this.events]; }
  import(events: TimelineEvent[]): void {
    if (this.events.length > 0) throw new Error('Cannot import into non-empty store');
    events.sort((a, b) => a.timestamp - b.timestamp).forEach(e => {
      this.events.push(e);
      this.eventMap.set(e.id, e);
      this.indexEvent(e);
    });
    this.sequenceCounter = this.events.length;
  }
}

export interface TimelineStoreStats {
  totalEvents: number; sessionsTracked: number; spheresTracked: number; memoryUsage: number; maxMemory: number;
}

export function createTimelineStore(config?: Partial<TimelineStoreConfig>): TimelineStore {
  return new TimelineStore(config);
}

export function getTimelineStore(config?: Partial<TimelineStoreConfig>): TimelineStore {
  return createTimelineStore(config);
}
