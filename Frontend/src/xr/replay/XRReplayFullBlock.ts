/* =====================================================
   CHE·NU — XR MEETING REPLAY SYSTEM (FULL BLOCK)
   
   Includes:
   1) Standard Replay
   2) Multi-Decision Comparison Replay
   3) Visual Insights Replay
   
   Scope: XR / Timeline / Decision Analysis (READ-ONLY)
   
   📜 GLOBAL GUARANTEES:
   - Replay is READ-ONLY
   - No agent execution
   - No orchestration
   - No memory write
   - No timeline mutation
   
   📜 ABSOLUTE RULES:
   - Replay never affects live state
   - Replay never alters memory
   - Replay is isolated from orchestration
   ===================================================== */

import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

/* =========================================================
   CORE TYPES
   ========================================================= */

export type ReplaySpeed = 'pause' | 'x0.25' | 'x0.5' | 'x1' | 'x2' | 'x4';

export type ReplayEventType =
  | 'meeting_start'
  | 'meeting_end'
  | 'agent_statement'
  | 'agent_analysis'
  | 'human_input'
  | 'human_question'
  | 'guard_trigger'
  | 'guard_violation'
  | 'decision_proposed'
  | 'decision_validated'
  | 'decision_rejected'
  | 'decision_blocked'
  | 'rollback'
  | 'stage_change';

export type EventAuthor = 'human' | 'agent' | 'system' | 'orchestrator';

export interface MeetingReplayEvent {
  /** Unique event ID */
  id: string;
  /** Timestamp in ms from meeting start */
  timestamp: number;
  /** Event type */
  type: ReplayEventType;
  /** Who generated the event */
  author: EventAuthor;
  /** Agent ID if applicable */
  agentId?: string;
  /** Agent display name */
  agentName?: string;
  /** Event payload */
  payload: Record<string, unknown>;
  /** Associated decision ID */
  decisionId?: string;
  /** Display message */
  message?: string;
  /** Event duration in ms */
  duration?: number;
}

/* =========================================================
   REPLAY STATE
   ========================================================= */

export interface XRReplayState {
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  speed: ReplaySpeed;
  currentEventIndex: number;
  isAtEnd: boolean;
  isAtStart: boolean;
}

/* =========================================================
   VISUAL FLAGS
   ========================================================= */

export interface XRReplayVisualHook {
  /** Agent to highlight */
  highlightAgent?: string;
  /** Show guard indicator */
  showGuard?: boolean;
  /** Show decision indicator */
  showDecision?: boolean;
  /** Show comparison mode */
  showComparison?: boolean;
  /** Show insight overlay */
  showInsight?: boolean;
  /** Dim other elements */
  dimOthers?: boolean;
  /** Show timeline write effect */
  showTimelineWrite?: boolean;
  /** Show violation effect */
  showViolation?: boolean;
  /** Highlight color */
  highlightColor?: string;
  /** Animation type */
  animation?: 'pulse' | 'glow' | 'shake' | 'none';
}

/* =========================================================
   SPEED MULTIPLIERS
   ========================================================= */

const SPEED_MULTIPLIERS: Record<ReplaySpeed, number> = {
  pause: 0,
  'x0.25': 0.25,
  'x0.5': 0.5,
  x1: 1,
  x2: 2,
  x4: 4,
};

/* =========================================================
   1️⃣ STANDARD XR MEETING REPLAY ENGINE
   ========================================================= */

export class XRMeetingReplayEngine {
  protected events: MeetingReplayEvent[];
  protected state: XRReplayState;
  protected listeners: Set<(state: XRReplayState) => void> = new Set();
  protected animationFrameId: number | null = null;
  protected lastFrameTime: number = 0;

  constructor(events: MeetingReplayEvent[]) {
    this.events = [...events].sort((a, b) => a.timestamp - b.timestamp);

    const lastEvent = this.events[this.events.length - 1];
    const totalDuration = lastEvent
      ? lastEvent.timestamp + (lastEvent.duration || 1000)
      : 0;

    this.state = {
      currentTime: 0,
      totalDuration,
      isPlaying: false,
      speed: 'pause',
      currentEventIndex: 0,
      isAtEnd: false,
      isAtStart: true,
    };
  }

  /* --- Playback Controls --- */

  play(speed: ReplaySpeed = 'x1'): void {
    if (speed === 'pause') {
      this.pause();
      return;
    }
    this.state.isPlaying = true;
    this.state.speed = speed;
    this.lastFrameTime = performance.now();
    this.startAnimationLoop();
    this.notifyListeners();
  }

  pause(): void {
    this.state.isPlaying = false;
    this.state.speed = 'pause';
    this.stopAnimationLoop();
    this.notifyListeners();
  }

  toggle(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play(this.state.speed === 'pause' ? 'x1' : this.state.speed);
    }
  }

  seek(timestamp: number): void {
    this.state.currentTime = Math.max(
      0,
      Math.min(timestamp, this.state.totalDuration)
    );
    this.updateCurrentEventIndex();
    this.updatePositionFlags();
    this.notifyListeners();
  }

  seekToEvent(eventIndex: number): void {
    const event = this.events[eventIndex];
    if (event) {
      this.seek(event.timestamp);
    }
  }

  nextEvent(): void {
    const nextIndex = this.state.currentEventIndex + 1;
    if (nextIndex < this.events.length) {
      this.seekToEvent(nextIndex);
    }
  }

  previousEvent(): void {
    const prevIndex = this.state.currentEventIndex - 1;
    if (prevIndex >= 0) {
      this.seekToEvent(prevIndex);
    }
  }

  reset(): void {
    this.pause();
    this.seek(0);
  }

  skipForward(ms: number = 5000): void {
    this.seek(this.state.currentTime + ms);
  }

  skipBackward(ms: number = 5000): void {
    this.seek(this.state.currentTime - ms);
  }

  /* --- State Access --- */

  getState(): XRReplayState {
    return { ...this.state };
  }

  getEvents(): MeetingReplayEvent[] {
    return [...this.events];
  }

  getActiveEvents(): MeetingReplayEvent[] {
    return this.events.filter((e) => e.timestamp <= this.state.currentTime);
  }

  getCurrentEvent(): MeetingReplayEvent | null {
    return this.events[this.state.currentEventIndex] || null;
  }

  getEventsInRange(start: number, end: number): MeetingReplayEvent[] {
    return this.events.filter(
      (e) => e.timestamp >= start && e.timestamp <= end
    );
  }

  /* --- Subscription --- */

  subscribe(listener: (state: XRReplayState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /* --- Private Methods --- */

  protected startAnimationLoop(): void {
    if (this.animationFrameId !== null) return;

    const tick = (now: number) => {
      if (!this.state.isPlaying) return;

      const deltaMs = now - this.lastFrameTime;
      this.lastFrameTime = now;

      const multiplier = SPEED_MULTIPLIERS[this.state.speed];
      this.state.currentTime += deltaMs * multiplier;

      if (this.state.currentTime >= this.state.totalDuration) {
        this.state.currentTime = this.state.totalDuration;
        this.pause();
      }

      this.updateCurrentEventIndex();
      this.updatePositionFlags();
      this.notifyListeners();

      if (this.state.isPlaying) {
        this.animationFrameId = requestAnimationFrame(tick);
      }
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  protected stopAnimationLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  protected updateCurrentEventIndex(): void {
    let index = 0;
    for (let i = 0; i < this.events.length; i++) {
      if (this.events[i].timestamp <= this.state.currentTime) {
        index = i;
      } else {
        break;
      }
    }
    this.state.currentEventIndex = index;
  }

  protected updatePositionFlags(): void {
    this.state.isAtStart = this.state.currentTime === 0;
    this.state.isAtEnd = this.state.currentTime >= this.state.totalDuration;
  }

  protected notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  destroy(): void {
    this.stopAnimationLoop();
    this.listeners.clear();
  }
}

/* =========================================================
   2️⃣ MULTI-DECISION COMPARISON REPLAY
   ========================================================= */

export interface DecisionTrack {
  decisionId: string;
  events: MeetingReplayEvent[];
  proposedAt: number;
  resolvedAt: number | null;
  outcome: 'validated' | 'blocked' | 'rejected' | 'pending';
  duration: number;
}

export class XRDecisionComparisonReplay extends XRMeetingReplayEngine {
  private decisionMap: Map<string, MeetingReplayEvent[]> = new Map();
  private decisionTracks: DecisionTrack[] = [];

  constructor(events: MeetingReplayEvent[]) {
    super(events);
    this.buildDecisionMap();
    this.buildDecisionTracks();
  }

  private buildDecisionMap(): void {
    this.events.forEach((event) => {
      if (!event.decisionId) return;

      if (!this.decisionMap.has(event.decisionId)) {
        this.decisionMap.set(event.decisionId, []);
      }
      this.decisionMap.get(event.decisionId)!.push(event);
    });
  }

  private buildDecisionTracks(): void {
    this.decisionMap.forEach((events, decisionId) => {
      const proposed = events.find((e) => e.type === 'decision_proposed');
      const resolution = events.find(
        (e) =>
          e.type === 'decision_validated' ||
          e.type === 'decision_blocked' ||
          e.type === 'decision_rejected'
      );

      const proposedAt = proposed?.timestamp || 0;
      const resolvedAt = resolution?.timestamp || null;

      let outcome: DecisionTrack['outcome'] = 'pending';
      if (resolution) {
        if (resolution.type === 'decision_validated') outcome = 'validated';
        else if (resolution.type === 'decision_blocked') outcome = 'blocked';
        else if (resolution.type === 'decision_rejected') outcome = 'rejected';
      }

      this.decisionTracks.push({
        decisionId,
        events,
        proposedAt,
        resolvedAt,
        outcome,
        duration: resolvedAt ? resolvedAt - proposedAt : 0,
      });
    });

    // Sort by proposal time
    this.decisionTracks.sort((a, b) => a.proposedAt - b.proposedAt);
  }

  /**
   * Get all events for a specific decision.
   */
  getDecisionEvents(decisionId: string): MeetingReplayEvent[] {
    return this.decisionMap.get(decisionId) || [];
  }

  /**
   * Get all decision tracks.
   */
  getDecisionTracks(): DecisionTrack[] {
    return [...this.decisionTracks];
  }

  /**
   * Get decisions active at current time.
   */
  getActiveDecisions(): DecisionTrack[] {
    return this.decisionTracks.filter(
      (track) =>
        track.proposedAt <= this.state.currentTime &&
        (track.resolvedAt === null ||
          track.resolvedAt >= this.state.currentTime)
    );
  }

  /**
   * Compare two decisions side by side.
   */
  compareDecisions(
    decisionIdA: string,
    decisionIdB: string
  ): {
    trackA: DecisionTrack | null;
    trackB: DecisionTrack | null;
    commonAgents: string[];
    durationDiff: number;
    outcomeSame: boolean;
  } {
    const trackA =
      this.decisionTracks.find((t) => t.decisionId === decisionIdA) || null;
    const trackB =
      this.decisionTracks.find((t) => t.decisionId === decisionIdB) || null;

    const agentsA = new Set(
      trackA?.events.filter((e) => e.agentId).map((e) => e.agentId!) || []
    );
    const agentsB = new Set(
      trackB?.events.filter((e) => e.agentId).map((e) => e.agentId!) || []
    );
    const commonAgents = [...agentsA].filter((a) => agentsB.has(a));

    return {
      trackA,
      trackB,
      commonAgents,
      durationDiff: Math.abs((trackA?.duration || 0) - (trackB?.duration || 0)),
      outcomeSame: trackA?.outcome === trackB?.outcome,
    };
  }

  /**
   * Get decision statistics.
   */
  getDecisionStats(): {
    total: number;
    validated: number;
    blocked: number;
    rejected: number;
    pending: number;
    avgDuration: number;
  } {
    const validated = this.decisionTracks.filter(
      (t) => t.outcome === 'validated'
    ).length;
    const blocked = this.decisionTracks.filter(
      (t) => t.outcome === 'blocked'
    ).length;
    const rejected = this.decisionTracks.filter(
      (t) => t.outcome === 'rejected'
    ).length;
    const pending = this.decisionTracks.filter(
      (t) => t.outcome === 'pending'
    ).length;

    const resolvedTracks = this.decisionTracks.filter((t) => t.duration > 0);
    const avgDuration =
      resolvedTracks.length > 0
        ? resolvedTracks.reduce((sum, t) => sum + t.duration, 0) /
          resolvedTracks.length
        : 0;

    return {
      total: this.decisionTracks.length,
      validated,
      blocked,
      rejected,
      pending,
      avgDuration,
    };
  }
}

/* =========================================================
   3️⃣ VISUAL INSIGHTS / ANALYTICS REPLAY
   ========================================================= */

export type InsightType =
  | 'delay'
  | 'conflict'
  | 'guard_density'
  | 'human_override'
  | 'rapid_sequence'
  | 'agent_dominance'
  | 'blocked_streak'
  | 'validation_speed';

export type InsightSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface ReplayInsight {
  /** Unique insight ID */
  id: string;
  /** Associated decision ID */
  decisionId?: string;
  /** Insight type */
  type: InsightType;
  /** Severity level */
  severity: InsightSeverity;
  /** Human-readable description */
  description: string;
  /** Timestamp when insight occurs */
  timestamp: number;
  /** Related event IDs */
  relatedEventIds: string[];
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

export interface InsightAnalysisConfig {
  /** Threshold for guard density (default: 3) */
  guardDensityThreshold?: number;
  /** Threshold for decision delay in ms (default: 5000) */
  decisionDelayThreshold?: number;
  /** Threshold for rapid sequence in ms (default: 1000) */
  rapidSequenceThreshold?: number;
  /** Threshold for agent dominance percentage (default: 0.5) */
  agentDominanceThreshold?: number;
  /** Threshold for blocked streak count (default: 2) */
  blockedStreakThreshold?: number;
}

const DEFAULT_CONFIG: Required<InsightAnalysisConfig> = {
  guardDensityThreshold: 3,
  decisionDelayThreshold: 5000,
  rapidSequenceThreshold: 1000,
  agentDominanceThreshold: 0.5,
  blockedStreakThreshold: 2,
};

export class XRReplayInsightEngine {
  private events: MeetingReplayEvent[];
  private config: Required<InsightAnalysisConfig>;
  private insights: ReplayInsight[] = [];
  private insightIdCounter = 0;

  constructor(
    events: MeetingReplayEvent[],
    config?: InsightAnalysisConfig
  ) {
    this.events = [...events].sort((a, b) => a.timestamp - b.timestamp);
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Run all analyses and return insights.
   */
  analyze(): ReplayInsight[] {
    this.insights = [];

    this.analyzeGuardDensity();
    this.analyzeDecisionDelays();
    this.analyzeRapidSequences();
    this.analyzeAgentDominance();
    this.analyzeBlockedStreak();
    this.analyzeHumanOverrides();
    this.analyzeValidationSpeed();

    // Sort by severity then timestamp
    this.insights.sort((a, b) => {
      const severityOrder: InsightSeverity[] = [
        'critical',
        'high',
        'medium',
        'low',
        'info',
      ];
      const severityDiff =
        severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
      if (severityDiff !== 0) return severityDiff;
      return a.timestamp - b.timestamp;
    });

    return this.insights;
  }

  /**
   * Get insights filtered by type.
   */
  getInsightsByType(type: InsightType): ReplayInsight[] {
    return this.insights.filter((i) => i.type === type);
  }

  /**
   * Get insights filtered by severity.
   */
  getInsightsBySeverity(severity: InsightSeverity): ReplayInsight[] {
    return this.insights.filter((i) => i.severity === severity);
  }

  /**
   * Get insights for a specific decision.
   */
  getInsightsForDecision(decisionId: string): ReplayInsight[] {
    return this.insights.filter((i) => i.decisionId === decisionId);
  }

  /* --- Analysis Methods --- */

  private analyzeGuardDensity(): void {
    const guards = this.events.filter((e) => e.type === 'guard_trigger');

    if (guards.length > this.config.guardDensityThreshold) {
      this.addInsight({
        type: 'guard_density',
        severity: guards.length > 5 ? 'high' : 'medium',
        description: `High guard activity: ${guards.length} triggers detected`,
        timestamp: guards[0]?.timestamp || 0,
        relatedEventIds: guards.map((e) => e.id),
        metadata: { count: guards.length },
      });
    }
  }

  private analyzeDecisionDelays(): void {
    const decisions = this.events.filter((e) => e.type === 'decision_proposed');

    decisions.forEach((decision) => {
      const validation = this.events.find(
        (e) =>
          e.decisionId === decision.decisionId &&
          (e.type === 'decision_validated' ||
            e.type === 'decision_blocked' ||
            e.type === 'decision_rejected')
      );

      if (validation) {
        const delay = validation.timestamp - decision.timestamp;
        if (delay > this.config.decisionDelayThreshold) {
          this.addInsight({
            decisionId: decision.decisionId,
            type: 'delay',
            severity: delay > 10000 ? 'high' : 'medium',
            description: `Decision took ${Math.round(delay / 1000)}s to resolve`,
            timestamp: decision.timestamp,
            relatedEventIds: [decision.id, validation.id],
            metadata: { delayMs: delay },
          });
        }
      }
    });
  }

  private analyzeRapidSequences(): void {
    for (let i = 1; i < this.events.length; i++) {
      const gap = this.events[i].timestamp - this.events[i - 1].timestamp;
      if (
        gap < this.config.rapidSequenceThreshold &&
        this.events[i].type === 'agent_statement' &&
        this.events[i - 1].type === 'agent_statement'
      ) {
        this.addInsight({
          type: 'rapid_sequence',
          severity: 'low',
          description: 'Rapid agent statement sequence detected',
          timestamp: this.events[i - 1].timestamp,
          relatedEventIds: [this.events[i - 1].id, this.events[i].id],
          metadata: { gapMs: gap },
        });
      }
    }
  }

  private analyzeAgentDominance(): void {
    const agentStatements = this.events.filter(
      (e) => e.type === 'agent_statement' && e.agentId
    );
    const agentCounts: Record<string, number> = {};

    agentStatements.forEach((e) => {
      const agentId = e.agentId!;
      agentCounts[agentId] = (agentCounts[agentId] || 0) + 1;
    });

    const total = agentStatements.length;
    Object.entries(agentCounts).forEach(([agentId, count]) => {
      const ratio = count / total;
      if (ratio > this.config.agentDominanceThreshold) {
        this.addInsight({
          type: 'agent_dominance',
          severity: 'info',
          description: `Agent ${agentId} dominated with ${Math.round(ratio * 100)}% of statements`,
          timestamp: agentStatements[0]?.timestamp || 0,
          relatedEventIds: agentStatements
            .filter((e) => e.agentId === agentId)
            .map((e) => e.id),
          metadata: { agentId, ratio, count },
        });
      }
    });
  }

  private analyzeBlockedStreak(): void {
    let streak = 0;
    let streakStart: MeetingReplayEvent | null = null;
    const streakEvents: MeetingReplayEvent[] = [];

    this.events.forEach((e) => {
      if (e.type === 'decision_blocked') {
        if (streak === 0) streakStart = e;
        streak++;
        streakEvents.push(e);
      } else if (e.type === 'decision_validated') {
        if (streak >= this.config.blockedStreakThreshold) {
          this.addInsight({
            type: 'blocked_streak',
            severity: streak >= 3 ? 'high' : 'medium',
            description: `${streak} consecutive decisions were blocked`,
            timestamp: streakStart?.timestamp || 0,
            relatedEventIds: streakEvents.map((se) => se.id),
            metadata: { count: streak },
          });
        }
        streak = 0;
        streakStart = null;
        streakEvents.length = 0;
      }
    });
  }

  private analyzeHumanOverrides(): void {
    const humanInputs = this.events.filter(
      (e) => e.type === 'human_input' && e.author === 'human'
    );

    humanInputs.forEach((input) => {
      // Check if human input was followed by decision change
      const nextDecision = this.events.find(
        (e) =>
          e.timestamp > input.timestamp &&
          (e.type === 'decision_validated' || e.type === 'decision_rejected')
      );

      if (nextDecision && nextDecision.timestamp - input.timestamp < 2000) {
        this.addInsight({
          decisionId: nextDecision.decisionId,
          type: 'human_override',
          severity: 'info',
          description: 'Human input influenced decision outcome',
          timestamp: input.timestamp,
          relatedEventIds: [input.id, nextDecision.id],
        });
      }
    });
  }

  private analyzeValidationSpeed(): void {
    const decisions = this.events.filter((e) => e.type === 'decision_proposed');
    const fastValidations: MeetingReplayEvent[] = [];

    decisions.forEach((decision) => {
      const validation = this.events.find(
        (e) =>
          e.decisionId === decision.decisionId &&
          e.type === 'decision_validated'
      );

      if (validation && validation.timestamp - decision.timestamp < 1000) {
        fastValidations.push(decision);
      }
    });

    if (fastValidations.length > 0) {
      this.addInsight({
        type: 'validation_speed',
        severity: 'info',
        description: `${fastValidations.length} decisions were validated quickly (<1s)`,
        timestamp: fastValidations[0].timestamp,
        relatedEventIds: fastValidations.map((e) => e.id),
        metadata: { count: fastValidations.length },
      });
    }
  }

  private addInsight(
    partial: Omit<ReplayInsight, 'id'>
  ): void {
    this.insights.push({
      id: `insight-${++this.insightIdCounter}`,
      ...partial,
    });
  }
}

/* =========================================================
   XR VISUAL MAPPING (COMMON)
   ========================================================= */

/**
 * Map replay event to XR visual hooks.
 */
export function mapReplayEventToXRVisual(
  event: MeetingReplayEvent
): XRReplayVisualHook {
  switch (event.type) {
    case 'agent_statement':
    case 'agent_analysis':
      return {
        highlightAgent: event.agentId,
        dimOthers: true,
        animation: 'pulse',
      };

    case 'human_input':
    case 'human_question':
      return {
        dimOthers: false,
        animation: 'glow',
      };

    case 'guard_trigger':
      return {
        showGuard: true,
        dimOthers: true,
        animation: 'pulse',
        highlightColor: '#ffd93d',
      };

    case 'guard_violation':
      return {
        showGuard: true,
        showViolation: true,
        dimOthers: true,
        animation: 'shake',
        highlightColor: '#ff6b6b',
      };

    case 'decision_proposed':
      return {
        showDecision: true,
        dimOthers: true,
        animation: 'pulse',
        highlightColor: '#4dabf7',
      };

    case 'decision_validated':
      return {
        showDecision: true,
        showTimelineWrite: true,
        dimOthers: true,
        animation: 'glow',
        highlightColor: '#51cf66',
      };

    case 'decision_rejected':
    case 'decision_blocked':
      return {
        showDecision: true,
        showViolation: true,
        dimOthers: true,
        animation: 'shake',
        highlightColor: '#ff6b6b',
      };

    default:
      return {};
  }
}

/**
 * Map insight to XR visual hooks.
 */
export function mapInsightToXRVisual(
  insight: ReplayInsight
): XRReplayVisualHook {
  const baseHook: XRReplayVisualHook = {
    showInsight: true,
    dimOthers: false,
  };

  switch (insight.type) {
    case 'conflict':
      return { ...baseHook, showComparison: true, animation: 'pulse' };

    case 'guard_density':
      return {
        ...baseHook,
        showGuard: true,
        highlightColor: '#ffd93d',
        animation: 'pulse',
      };

    case 'delay':
      return { ...baseHook, highlightColor: '#ff922b', animation: 'glow' };

    case 'blocked_streak':
      return {
        ...baseHook,
        showViolation: true,
        highlightColor: '#ff6b6b',
        animation: 'shake',
      };

    case 'human_override':
      return { ...baseHook, highlightColor: '#845ef7', animation: 'glow' };

    default:
      return baseHook;
  }
}

/* =========================================================
   REACT HOOKS
   ========================================================= */

export interface UseReplayInsightsReturn {
  insights: ReplayInsight[];
  byType: (type: InsightType) => ReplayInsight[];
  bySeverity: (severity: InsightSeverity) => ReplayInsight[];
  forDecision: (decisionId: string) => ReplayInsight[];
  criticalCount: number;
  highCount: number;
}

/**
 * Hook for accessing replay insights.
 */
export function useReplayInsights(
  events: MeetingReplayEvent[],
  config?: InsightAnalysisConfig
): UseReplayInsightsReturn {
  const engine = useMemo(
    () => new XRReplayInsightEngine(events, config),
    [events, config]
  );

  const insights = useMemo(() => engine.analyze(), [engine]);

  return {
    insights,
    byType: useCallback(
      (type: InsightType) => insights.filter((i) => i.type === type),
      [insights]
    ),
    bySeverity: useCallback(
      (severity: InsightSeverity) =>
        insights.filter((i) => i.severity === severity),
      [insights]
    ),
    forDecision: useCallback(
      (decisionId: string) =>
        insights.filter((i) => i.decisionId === decisionId),
      [insights]
    ),
    criticalCount: insights.filter((i) => i.severity === 'critical').length,
    highCount: insights.filter((i) => i.severity === 'high').length,
  };
}

export interface UseDecisionComparisonReturn {
  tracks: DecisionTrack[];
  stats: ReturnType<XRDecisionComparisonReplay['getDecisionStats']>;
  compare: (
    a: string,
    b: string
  ) => ReturnType<XRDecisionComparisonReplay['compareDecisions']>;
  getActiveDecisions: () => DecisionTrack[];
}

/**
 * Hook for decision comparison.
 */
export function useDecisionComparison(
  events: MeetingReplayEvent[]
): UseDecisionComparisonReturn {
  const engine = useMemo(
    () => new XRDecisionComparisonReplay(events),
    [events]
  );

  return {
    tracks: engine.getDecisionTracks(),
    stats: engine.getDecisionStats(),
    compare: useCallback(
      (a: string, b: string) => engine.compareDecisions(a, b),
      [engine]
    ),
    getActiveDecisions: useCallback(
      () => engine.getActiveDecisions(),
      [engine]
    ),
  };
}

/* =========================================================
   EXPORTS
   ========================================================= */

export const REPLAY_SPEEDS: ReplaySpeed[] = [
  'pause',
  'x0.25',
  'x0.5',
  'x1',
  'x2',
  'x4',
];

export { SPEED_MULTIPLIERS };
