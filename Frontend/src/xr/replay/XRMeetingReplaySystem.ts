/* =====================================================
   CHE·NU — XR MEETING ROOM REPLAY SYSTEM
   Scope: XR / Timeline / Visual Replay (READ-ONLY)
   
   📜 CORE PRINCIPLES:
   - Replay is observational ONLY
   - No agent can act
   - No decision is re-executed
   - Timeline is IMMUTABLE
   
   📜 HARD GUARANTEES:
   - Replay mode disables:
     - agent execution
     - orchestration
     - writes to memory
     - timeline mutation
   - Replay is READ-ONLY
   - Replay never influences future decisions
   ===================================================== */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/* =========================================================
   TYPES
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
  | 'stage_change'
  | 'rollback'
  | 'timeline_write';

export type EventAuthor = 'human' | 'agent' | 'system' | 'orchestrator';

export interface MeetingReplayEvent {
  /** Event ID */
  id: string;
  /** Timestamp in milliseconds from meeting start */
  timestamp: number;
  /** Event type */
  type: ReplayEventType;
  /** Who generated the event */
  author: EventAuthor;
  /** Agent ID if author is agent */
  agentId?: string;
  /** Agent name for display */
  agentName?: string;
  /** Event payload data */
  payload: Record<string, unknown>;
  /** Optional display message */
  message?: string;
  /** Duration of the event (for statements) */
  duration?: number;
}

export interface XRReplayState {
  /** Current playback time in ms */
  currentTime: number;
  /** Total duration in ms */
  totalDuration: number;
  /** Is currently playing */
  isPlaying: boolean;
  /** Playback speed */
  speed: ReplaySpeed;
  /** Current event index */
  currentEventIndex: number;
  /** Is at end of replay */
  isAtEnd: boolean;
  /** Is at beginning of replay */
  isAtStart: boolean;
}

export interface XRReplayVisualHook {
  /** Agent to highlight */
  highlightAgent?: string;
  /** Show guard shield effect */
  showGuard?: boolean;
  /** Show decision indicator */
  showDecision?: boolean;
  /** Dim other elements */
  dimOthers?: boolean;
  /** Show timeline write effect */
  showTimelineWrite?: boolean;
  /** Show violation effect */
  showViolation?: boolean;
  /** Highlight color override */
  highlightColor?: string;
  /** Animation type */
  animation?: 'pulse' | 'glow' | 'shake' | 'none';
}

export interface ReplayMarker {
  timestamp: number;
  label: string;
  type: 'decision' | 'guard' | 'milestone' | 'error';
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
   REPLAY ENGINE
   ========================================================= */

export class XRMeetingReplayEngine {
  private events: MeetingReplayEvent[] = [];
  private state: XRReplayState;
  private listeners: Set<(state: XRReplayState) => void> = new Set();
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;

  constructor(events: MeetingReplayEvent[]) {
    // Sort events by timestamp
    this.events = [...events].sort((a, b) => a.timestamp - b.timestamp);

    // Calculate total duration
    const lastEvent = this.events[this.events.length - 1];
    const totalDuration = lastEvent
      ? lastEvent.timestamp + (lastEvent.duration || 0)
      : 0;

    // Initialize state
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

  /* -----------------------------------------
     PLAYBACK CONTROLS
  ----------------------------------------- */

  /**
   * Start or change playback speed.
   */
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

  /**
   * Pause playback.
   */
  pause(): void {
    this.state.isPlaying = false;
    this.state.speed = 'pause';
    this.stopAnimationLoop();
    this.notifyListeners();
  }

  /**
   * Toggle play/pause.
   */
  toggle(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play(this.state.speed === 'pause' ? 'x1' : this.state.speed);
    }
  }

  /**
   * Seek to specific timestamp.
   */
  seek(timestamp: number): void {
    this.state.currentTime = Math.max(
      0,
      Math.min(timestamp, this.state.totalDuration)
    );
    this.updateCurrentEventIndex();
    this.updatePositionFlags();
    this.notifyListeners();
  }

  /**
   * Seek to specific event.
   */
  seekToEvent(eventIndex: number): void {
    const event = this.events[eventIndex];
    if (event) {
      this.seek(event.timestamp);
    }
  }

  /**
   * Go to next event.
   */
  nextEvent(): void {
    const nextIndex = this.state.currentEventIndex + 1;
    if (nextIndex < this.events.length) {
      this.seekToEvent(nextIndex);
    }
  }

  /**
   * Go to previous event.
   */
  previousEvent(): void {
    const prevIndex = this.state.currentEventIndex - 1;
    if (prevIndex >= 0) {
      this.seekToEvent(prevIndex);
    }
  }

  /**
   * Reset to beginning.
   */
  reset(): void {
    this.pause();
    this.seek(0);
  }

  /**
   * Skip forward by duration.
   */
  skipForward(ms: number = 5000): void {
    this.seek(this.state.currentTime + ms);
  }

  /**
   * Skip backward by duration.
   */
  skipBackward(ms: number = 5000): void {
    this.seek(this.state.currentTime - ms);
  }

  /* -----------------------------------------
     STATE ACCESS
  ----------------------------------------- */

  /**
   * Get current state (immutable copy).
   */
  getState(): XRReplayState {
    return { ...this.state };
  }

  /**
   * Get all events.
   */
  getEvents(): MeetingReplayEvent[] {
    return [...this.events];
  }

  /**
   * Get events up to current time.
   */
  getActiveEvents(): MeetingReplayEvent[] {
    return this.events.filter((e) => e.timestamp <= this.state.currentTime);
  }

  /**
   * Get current event.
   */
  getCurrentEvent(): MeetingReplayEvent | null {
    return this.events[this.state.currentEventIndex] || null;
  }

  /**
   * Get events in time range.
   */
  getEventsInRange(start: number, end: number): MeetingReplayEvent[] {
    return this.events.filter(
      (e) => e.timestamp >= start && e.timestamp <= end
    );
  }

  /**
   * Get replay markers for timeline visualization.
   */
  getMarkers(): ReplayMarker[] {
    return this.events
      .filter((e) =>
        [
          'decision_validated',
          'decision_blocked',
          'guard_violation',
          'meeting_start',
          'meeting_end',
        ].includes(e.type)
      )
      .map((e) => ({
        timestamp: e.timestamp,
        label: e.message || e.type,
        type: this.getMarkerType(e.type),
      }));
  }

  /* -----------------------------------------
     SUBSCRIPTION
  ----------------------------------------- */

  /**
   * Subscribe to state changes.
   */
  subscribe(listener: (state: XRReplayState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /* -----------------------------------------
     PRIVATE METHODS
  ----------------------------------------- */

  private startAnimationLoop(): void {
    if (this.animationFrameId !== null) return;

    const tick = (now: number) => {
      if (!this.state.isPlaying) return;

      const deltaMs = now - this.lastFrameTime;
      this.lastFrameTime = now;

      const multiplier = SPEED_MULTIPLIERS[this.state.speed];
      this.state.currentTime += deltaMs * multiplier;

      // Clamp to duration
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

  private stopAnimationLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private updateCurrentEventIndex(): void {
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

  private updatePositionFlags(): void {
    this.state.isAtStart = this.state.currentTime === 0;
    this.state.isAtEnd = this.state.currentTime >= this.state.totalDuration;
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  private getMarkerType(
    eventType: ReplayEventType
  ): 'decision' | 'guard' | 'milestone' | 'error' {
    switch (eventType) {
      case 'decision_validated':
        return 'decision';
      case 'decision_blocked':
      case 'guard_violation':
        return 'error';
      case 'guard_trigger':
        return 'guard';
      default:
        return 'milestone';
    }
  }

  /**
   * Cleanup resources.
   */
  destroy(): void {
    this.stopAnimationLoop();
    this.listeners.clear();
  }
}

/* =========================================================
   VISUAL MAPPING
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
        highlightAgent: undefined, // Highlight human position
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

    case 'timeline_write':
      return {
        showTimelineWrite: true,
        animation: 'glow',
        highlightColor: '#51cf66',
      };

    case 'stage_change':
      return {
        dimOthers: false,
        animation: 'pulse',
      };

    case 'meeting_start':
    case 'meeting_end':
      return {
        dimOthers: false,
        animation: 'none',
      };

    default:
      return {};
  }
}

/**
 * Get visual state for multiple active events.
 */
export function getCompositeVisualState(
  events: MeetingReplayEvent[]
): XRReplayVisualHook {
  // Get the most recent significant event
  const significantTypes: ReplayEventType[] = [
    'guard_violation',
    'decision_validated',
    'decision_blocked',
    'guard_trigger',
    'agent_statement',
    'human_input',
  ];

  const mostRecent = [...events]
    .reverse()
    .find((e) => significantTypes.includes(e.type));

  if (mostRecent) {
    return mapReplayEventToXRVisual(mostRecent);
  }

  return {};
}

/* =========================================================
   REACT HOOK
   ========================================================= */

export interface UseXRReplayReturn {
  /** Current replay state */
  state: XRReplayState;
  /** Current event */
  currentEvent: MeetingReplayEvent | null;
  /** Active events up to current time */
  activeEvents: MeetingReplayEvent[];
  /** Visual hooks for current state */
  visualHooks: XRReplayVisualHook;
  /** Timeline markers */
  markers: ReplayMarker[];
  /** Playback controls */
  controls: {
    play: (speed?: ReplaySpeed) => void;
    pause: () => void;
    toggle: () => void;
    seek: (timestamp: number) => void;
    seekToEvent: (index: number) => void;
    nextEvent: () => void;
    previousEvent: () => void;
    reset: () => void;
    skipForward: (ms?: number) => void;
    skipBackward: (ms?: number) => void;
    setSpeed: (speed: ReplaySpeed) => void;
  };
  /** Progress as percentage (0-100) */
  progress: number;
  /** Formatted current time */
  formattedTime: string;
  /** Formatted total duration */
  formattedDuration: string;
}

/**
 * React hook for XR meeting replay.
 */
export function useXRMeetingReplay(
  events: MeetingReplayEvent[]
): UseXRReplayReturn {
  const engineRef = useRef<XRMeetingReplayEngine | null>(null);
  const [state, setState] = useState<XRReplayState>({
    currentTime: 0,
    totalDuration: 0,
    isPlaying: false,
    speed: 'pause',
    currentEventIndex: 0,
    isAtEnd: false,
    isAtStart: true,
  });

  // Initialize engine
  useEffect(() => {
    engineRef.current = new XRMeetingReplayEngine(events);
    setState(engineRef.current.getState());

    const unsubscribe = engineRef.current.subscribe(setState);

    return () => {
      unsubscribe();
      engineRef.current?.destroy();
    };
  }, [events]);

  // Controls
  const controls = useMemo(
    () => ({
      play: (speed?: ReplaySpeed) => engineRef.current?.play(speed),
      pause: () => engineRef.current?.pause(),
      toggle: () => engineRef.current?.toggle(),
      seek: (timestamp: number) => engineRef.current?.seek(timestamp),
      seekToEvent: (index: number) => engineRef.current?.seekToEvent(index),
      nextEvent: () => engineRef.current?.nextEvent(),
      previousEvent: () => engineRef.current?.previousEvent(),
      reset: () => engineRef.current?.reset(),
      skipForward: (ms?: number) => engineRef.current?.skipForward(ms),
      skipBackward: (ms?: number) => engineRef.current?.skipBackward(ms),
      setSpeed: (speed: ReplaySpeed) => engineRef.current?.play(speed),
    }),
    []
  );

  // Derived values
  const currentEvent = engineRef.current?.getCurrentEvent() || null;
  const activeEvents = engineRef.current?.getActiveEvents() || [];
  const markers = engineRef.current?.getMarkers() || [];
  const visualHooks = useMemo(
    () => getCompositeVisualState(activeEvents),
    [activeEvents]
  );

  const progress =
    state.totalDuration > 0
      ? (state.currentTime / state.totalDuration) * 100
      : 0;

  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    state,
    currentEvent,
    activeEvents,
    visualHooks,
    markers,
    controls,
    progress,
    formattedTime: formatTime(state.currentTime),
    formattedDuration: formatTime(state.totalDuration),
  };
}

/* =========================================================
   REPLAY MODE GUARD
   ========================================================= */

/**
 * Ensure replay mode is read-only.
 * Call this before any mutation attempt during replay.
 */
export function guardReplayMode(isReplayMode: boolean): void {
  if (isReplayMode) {
    throw new Error(
      '[CHE·NU VIOLATION] Cannot mutate during replay mode. Replay is READ-ONLY.'
    );
  }
}

/**
 * Create a replay-safe context that blocks mutations.
 */
export interface ReplayModeContext {
  isReplayMode: boolean;
  assertNotReplay: () => void;
}

export function createReplayModeContext(
  isReplayMode: boolean
): ReplayModeContext {
  return {
    isReplayMode,
    assertNotReplay: () => guardReplayMode(isReplayMode),
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
