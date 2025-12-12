/* =====================================================
   CHE·NU — Replay Engine
   PHASE 5: Replay recorded sessions step by step
   ===================================================== */

import { TimelineEvent, EventId, EventCategory, ReplaySession } from './types';
import { TimelineStore } from './TimelineStore';

export interface ReplayOptions {
  speed: number;
  startFrom?: EventId;
  endAt?: EventId;
  filterCategories?: EventCategory[];
  skipErrors?: boolean;
  onEvent?: (event: TimelineEvent, index: number) => void;
  onComplete?: () => void;
  onPause?: () => void;
}

export class ReplayEngine {
  private session: ReplaySession | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private options: ReplayOptions = { speed: 1 };
  private eventCallbacks: Set<(event: TimelineEvent) => void> = new Set();
  
  // ─────────────────────────────────────────────────────
  // SESSION MANAGEMENT
  // ─────────────────────────────────────────────────────
  
  loadFromStore(store: TimelineStore, options: Partial<ReplayOptions> = {}): ReplaySession {
    let events = store.getAllEvents();
    
    this.options = { speed: 1, ...options };
    
    // Filter categories if specified
    if (this.options.filterCategories?.length) {
      events = events.filter(e => this.options.filterCategories!.includes(e.category));
    }
    
    // Skip errors if specified
    if (this.options.skipErrors) {
      events = events.filter(e => e.category !== 'error');
    }
    
    // Find start index
    let startIndex = 0;
    if (this.options.startFrom) {
      const idx = events.findIndex(e => e.id === this.options.startFrom);
      if (idx >= 0) startIndex = idx;
    }
    
    // Find end index
    let endIndex = events.length;
    if (this.options.endAt) {
      const idx = events.findIndex(e => e.id === this.options.endAt);
      if (idx >= 0) endIndex = idx + 1;
    }
    
    events = events.slice(startIndex, endIndex);
    
    this.session = {
      id: `replay-${Date.now()}`,
      originalSessionId: store.getSessionId(),
      events,
      currentIndex: 0,
      playbackSpeed: this.options.speed,
      status: 'paused',
    };
    
    return this.session;
  }
  
  loadFromEvents(events: TimelineEvent[], sessionId: string, options: Partial<ReplayOptions> = {}): ReplaySession {
    this.options = { speed: 1, ...options };
    
    this.session = {
      id: `replay-${Date.now()}`,
      originalSessionId: sessionId,
      events: [...events],
      currentIndex: 0,
      playbackSpeed: this.options.speed,
      status: 'paused',
    };
    
    return this.session;
  }
  
  // ─────────────────────────────────────────────────────
  // PLAYBACK CONTROL
  // ─────────────────────────────────────────────────────
  
  play(): void {
    if (!this.session || this.session.status === 'completed') return;
    
    this.session.status = 'playing';
    this.scheduleNextEvent();
  }
  
  pause(): void {
    if (!this.session) return;
    
    this.session.status = 'paused';
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.options.onPause?.();
  }
  
  stop(): void {
    this.pause();
    if (this.session) {
      this.session.currentIndex = 0;
    }
  }
  
  step(): TimelineEvent | null {
    if (!this.session || this.session.currentIndex >= this.session.events.length) {
      return null;
    }
    
    const event = this.session.events[this.session.currentIndex];
    this.emitEvent(event);
    this.session.currentIndex++;
    
    if (this.session.currentIndex >= this.session.events.length) {
      this.session.status = 'completed';
      this.options.onComplete?.();
    }
    
    return event;
  }
  
  stepBack(): TimelineEvent | null {
    if (!this.session || this.session.currentIndex <= 0) {
      return null;
    }
    
    this.session.currentIndex--;
    return this.session.events[this.session.currentIndex];
  }
  
  seekTo(index: number): void {
    if (!this.session) return;
    this.session.currentIndex = Math.max(0, Math.min(index, this.session.events.length));
  }
  
  seekToEvent(eventId: EventId): boolean {
    if (!this.session) return false;
    
    const idx = this.session.events.findIndex(e => e.id === eventId);
    if (idx >= 0) {
      this.session.currentIndex = idx;
      return true;
    }
    return false;
  }
  
  setSpeed(speed: number): void {
    if (!this.session) return;
    this.session.playbackSpeed = speed;
    this.options.speed = speed;
  }
  
  // ─────────────────────────────────────────────────────
  // INTERNAL SCHEDULING
  // ─────────────────────────────────────────────────────
  
  private scheduleNextEvent(): void {
    if (!this.session || this.session.status !== 'playing') return;
    
    if (this.session.currentIndex >= this.session.events.length) {
      this.session.status = 'completed';
      this.options.onComplete?.();
      return;
    }
    
    const currentEvent = this.session.events[this.session.currentIndex];
    const nextEvent = this.session.events[this.session.currentIndex + 1];
    
    // Calculate delay
    let delay = 100; // Default minimum delay
    if (nextEvent) {
      const realDelay = nextEvent.timestamp - currentEvent.timestamp;
      delay = realDelay / this.session.playbackSpeed;
      delay = Math.max(10, Math.min(delay, 5000)); // Clamp between 10ms and 5s
    }
    
    // Emit current event
    this.emitEvent(currentEvent);
    this.session.currentIndex++;
    
    // Schedule next
    this.timer = setTimeout(() => this.scheduleNextEvent(), delay);
  }
  
  private emitEvent(event: TimelineEvent): void {
    this.options.onEvent?.(event, this.session?.currentIndex || 0);
    this.eventCallbacks.forEach(cb => { try { cb(event); } catch {} });
  }
  
  // ─────────────────────────────────────────────────────
  // EVENT SUBSCRIPTION
  // ─────────────────────────────────────────────────────
  
  onEvent(callback: (event: TimelineEvent) => void): () => void {
    this.eventCallbacks.add(callback);
    return () => this.eventCallbacks.delete(callback);
  }
  
  // ─────────────────────────────────────────────────────
  // STATE ACCESS
  // ─────────────────────────────────────────────────────
  
  getSession(): ReplaySession | null {
    return this.session;
  }
  
  getCurrentEvent(): TimelineEvent | null {
    if (!this.session || this.session.currentIndex >= this.session.events.length) {
      return null;
    }
    return this.session.events[this.session.currentIndex];
  }
  
  getProgress(): { current: number; total: number; percentage: number } {
    if (!this.session) return { current: 0, total: 0, percentage: 0 };
    
    return {
      current: this.session.currentIndex,
      total: this.session.events.length,
      percentage: this.session.events.length > 0 
        ? (this.session.currentIndex / this.session.events.length) * 100 
        : 0,
    };
  }
  
  isPlaying(): boolean {
    return this.session?.status === 'playing';
  }
  
  isCompleted(): boolean {
    return this.session?.status === 'completed';
  }
  
  // ─────────────────────────────────────────────────────
  // ANALYSIS HELPERS
  // ─────────────────────────────────────────────────────
  
  getEventsBetween(startId: EventId, endId: EventId): TimelineEvent[] {
    if (!this.session) return [];
    
    const startIdx = this.session.events.findIndex(e => e.id === startId);
    const endIdx = this.session.events.findIndex(e => e.id === endId);
    
    if (startIdx < 0 || endIdx < 0) return [];
    
    return this.session.events.slice(startIdx, endIdx + 1);
  }
  
  findSimilarSequences(length: number = 3): EventId[][] {
    if (!this.session || this.session.events.length < length) return [];
    
    const sequences: Map<string, EventId[][]> = new Map();
    
    for (let i = 0; i <= this.session.events.length - length; i++) {
      const sequence = this.session.events.slice(i, i + length);
      const key = sequence.map(e => e.type).join('|');
      
      if (!sequences.has(key)) {
        sequences.set(key, []);
      }
      sequences.get(key)!.push(sequence.map(e => e.id));
    }
    
    // Return only repeated sequences
    return Array.from(sequences.values()).filter(s => s.length > 1).flat();
  }
}

// Singleton
let defaultReplayEngine: ReplayEngine | null = null;
export function getReplayEngine(): ReplayEngine {
  if (!defaultReplayEngine) defaultReplayEngine = new ReplayEngine();
  return defaultReplayEngine;
}
