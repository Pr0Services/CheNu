/* =====================================================
   CHE·NU — Timeline Tests
   PHASE 5: Tests for timeline, replay, and audit
   ===================================================== */

import {
  TimelineStore,
  TimelineRecorder,
  ReplayEngine,
  AuditEngine,
  generateEventId,
  startRecordingSession,
} from './index';

// ─────────────────────────────────────────────────────
// TEST UTILITIES
// ─────────────────────────────────────────────────────

function describe(name: string, fn: () => void): void {
  console.log(`\n📦 ${name}`);
  fn();
}

function it(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✅ ${name}`);
  } catch (error) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${error}`);
  }
}

function expect<T>(actual: T) {
  return {
    toBe(expected: T): void {
      if (actual !== expected) throw new Error(`Expected ${expected}, got ${actual}`);
    },
    toBeGreaterThan(expected: number): void {
      if (typeof actual !== 'number' || actual <= expected) throw new Error(`Expected ${actual} > ${expected}`);
    },
    toBeTruthy(): void {
      if (!actual) throw new Error(`Expected truthy, got ${actual}`);
    },
    toContain(item: unknown): void {
      if (!Array.isArray(actual) || !actual.includes(item)) throw new Error(`Expected array to contain ${item}`);
    },
  };
}

// ─────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────

describe('Event ID Generation', () => {
  it('should generate unique IDs', () => {
    const id1 = generateEventId('user', 'interact:click');
    const id2 = generateEventId('user', 'interact:click');
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1 !== id2).toBe(true);
  });
  
  it('should include source and type in ID', () => {
    const id = generateEventId('agent', 'agent:signal');
    expect(id.includes('agent')).toBe(true);
  });
});

describe('TimelineStore', () => {
  it('should create store with session ID', () => {
    const store = new TimelineStore({ sessionId: 'test-session' });
    expect(store.getSessionId()).toBe('test-session');
  });
  
  it('should append events', () => {
    const store = new TimelineStore();
    store.append({
      id: 'test-1',
      timestamp: Date.now(),
      source: 'user',
      category: 'interaction',
      type: 'interact:click',
      context: { sphereId: null, nodeId: null, depth: 0, viewMode: 'universe', sessionId: '', sequenceNumber: 0 },
      payload: { kind: 'test' },
      description: 'Test event',
      metadata: { schemaVersion: '1.0.0', replayable: true, containsPII: false },
    });
    expect(store.length).toBe(1);
  });
  
  it('should reject duplicate IDs', () => {
    const store = new TimelineStore();
    const event = {
      id: 'dupe-1',
      timestamp: Date.now(),
      source: 'user' as const,
      category: 'interaction' as const,
      type: 'interact:click' as const,
      context: { sphereId: null, nodeId: null, depth: 0, viewMode: 'universe' as const, sessionId: '', sequenceNumber: 0 },
      payload: { kind: 'test' },
      description: 'Test',
      metadata: { schemaVersion: '1.0.0', replayable: true, containsPII: false },
    };
    store.append(event);
    store.append(event); // Should be ignored
    expect(store.length).toBe(1);
  });
  
  it('should query events by category', () => {
    const store = new TimelineStore();
    store.append({
      id: 'nav-1', timestamp: Date.now(), source: 'user', category: 'navigation', type: 'nav:sphere-enter',
      context: { sphereId: 'test', nodeId: null, depth: 0, viewMode: 'sphere', sessionId: '', sequenceNumber: 0 },
      payload: { kind: 'navigation', from: { sphereId: null }, to: { sphereId: 'test' } },
      description: 'Nav', metadata: { schemaVersion: '1.0.0', replayable: true, containsPII: false },
    });
    store.append({
      id: 'click-1', timestamp: Date.now(), source: 'user', category: 'interaction', type: 'interact:click',
      context: { sphereId: 'test', nodeId: null, depth: 0, viewMode: 'sphere', sessionId: '', sequenceNumber: 0 },
      payload: { kind: 'test' },
      description: 'Click', metadata: { schemaVersion: '1.0.0', replayable: true, containsPII: false },
    });
    
    const navEvents = store.query({ categories: ['navigation'] });
    expect(navEvents.length).toBe(1);
  });
  
  it('should export and import', () => {
    const store = new TimelineStore({ sessionId: 'export-test' });
    store.append({
      id: 'exp-1', timestamp: Date.now(), source: 'user', category: 'interaction', type: 'interact:click',
      context: { sphereId: null, nodeId: null, depth: 0, viewMode: 'universe', sessionId: '', sequenceNumber: 0 },
      payload: { kind: 'test' },
      description: 'Test', metadata: { schemaVersion: '1.0.0', replayable: true, containsPII: false },
    });
    
    const json = store.export();
    const imported = TimelineStore.import(json);
    
    expect(imported.length).toBe(1);
    expect(imported.getSessionId()).toBe('export-test');
  });
});

describe('TimelineRecorder', () => {
  it('should record navigation events', () => {
    const store = new TimelineStore();
    const recorder = new TimelineRecorder(store);
    
    recorder.recordNavigation({ sphereId: null }, { sphereId: 'business' });
    
    expect(store.length).toBe(1);
    const event = store.getAllEvents()[0];
    expect(event.category).toBe('navigation');
  });
  
  it('should record decision events', () => {
    const store = new TimelineStore();
    const recorder = new TimelineRecorder(store);
    
    recorder.recordDecisionCreated('dec-1', 'Test Decision');
    recorder.recordDecisionResolved('dec-1', 'Test Decision', 'Approved');
    
    expect(store.length).toBe(2);
    expect(store.query({ categories: ['decision'] }).length).toBe(2);
  });
  
  it('should record agent events', () => {
    const store = new TimelineStore();
    const recorder = new TimelineRecorder(store);
    
    recorder.recordAgentActivated('orchestrator');
    recorder.recordAgentSignal('orchestrator', 'sig-1', 'Test signal');
    recorder.recordAgentCompleted('orchestrator', 2);
    
    expect(store.query({ categories: ['agent'] }).length).toBe(3);
  });
  
  it('should track causality', () => {
    const store = new TimelineStore();
    const recorder = new TimelineRecorder(store);
    
    const id1 = recorder.recordDecisionCreated('dec-1', 'Test');
    const id2 = recorder.recordDecisionResolved('dec-1', 'Test', 'Done', { causedBy: id1 });
    
    const chain = store.getCausalityChain(id2);
    expect(chain.length).toBe(2);
  });
});

describe('ReplayEngine', () => {
  it('should load events from store', () => {
    const store = new TimelineStore();
    const recorder = new TimelineRecorder(store);
    
    recorder.recordNavigation({ sphereId: null }, { sphereId: 'test' });
    recorder.recordClick('node-1', 'node');
    
    const replay = new ReplayEngine();
    const session = replay.loadFromStore(store);
    
    expect(session.events.length).toBe(2);
    expect(session.status).toBe('paused');
  });
  
  it('should step through events', () => {
    const store = new TimelineStore();
    const recorder = new TimelineRecorder(store);
    
    recorder.recordNavigation({ sphereId: null }, { sphereId: 'test' });
    recorder.recordClick('node-1', 'node');
    
    const replay = new ReplayEngine();
    replay.loadFromStore(store);
    
    const event1 = replay.step();
    expect(event1).toBeTruthy();
    expect(replay.getProgress().current).toBe(1);
    
    const event2 = replay.step();
    expect(event2).toBeTruthy();
    expect(replay.getProgress().current).toBe(2);
  });
  
  it('should filter by category', () => {
    const store = new TimelineStore();
    const recorder = new TimelineRecorder(store);
    
    recorder.recordNavigation({ sphereId: null }, { sphereId: 'test' });
    recorder.recordClick('node-1', 'node');
    recorder.recordDecisionCreated('dec-1', 'Test');
    
    const replay = new ReplayEngine();
    const session = replay.loadFromStore(store, { filterCategories: ['decision'] });
    
    expect(session.events.length).toBe(1);
  });
});

describe('AuditEngine', () => {
  it('should generate report', () => {
    const store = new TimelineStore();
    const recorder = new TimelineRecorder(store);
    
    recorder.recordSessionStart();
    recorder.recordNavigation({ sphereId: null }, { sphereId: 'business' });
    recorder.recordDecisionCreated('dec-1', 'Test');
    recorder.recordDecisionResolved('dec-1', 'Test', 'Done');
    
    const audit = new AuditEngine(store);
    const report = audit.generateReport({});
    
    expect(report.summary.totalEvents).toBe(4);
    expect(report.summary.decisionsFlow.created).toBe(1);
    expect(report.summary.decisionsFlow.resolved).toBe(1);
  });
  
  it('should detect decision bottleneck', () => {
    const store = new TimelineStore();
    const recorder = new TimelineRecorder(store);
    
    // Create many unresolved decisions
    for (let i = 0; i < 6; i++) {
      recorder.recordDecisionCreated(`dec-${i}`, `Decision ${i}`);
    }
    
    const audit = new AuditEngine(store);
    const report = audit.generateReport({});
    
    const bottleneckInsight = report.insights.find(i => i.title === 'Decision Bottleneck');
    expect(bottleneckInsight).toBeTruthy();
  });
  
  it('should get agent performance', () => {
    const store = new TimelineStore();
    const recorder = new TimelineRecorder(store);
    
    recorder.recordAgentActivated('orchestrator');
    recorder.recordAgentSignal('orchestrator', 'sig-1', 'Test');
    recorder.recordProposalAccepted('orchestrator', 'prop-1');
    recorder.recordProposalRejected('orchestrator', 'prop-2');
    
    const audit = new AuditEngine(store);
    const perf = audit.getAgentPerformance();
    
    expect(perf.length).toBeGreaterThan(0);
    const orchestratorPerf = perf.find(p => p.agentId === 'orchestrator');
    expect(orchestratorPerf?.activations).toBe(1);
    expect(orchestratorPerf?.proposalsAccepted).toBe(1);
    expect(orchestratorPerf?.proposalsRejected).toBe(1);
  });
  
  it('should export report as markdown', () => {
    const store = new TimelineStore();
    const recorder = new TimelineRecorder(store);
    
    recorder.recordSessionStart();
    recorder.recordDecisionCreated('dec-1', 'Test');
    
    const audit = new AuditEngine(store);
    const report = audit.generateReport({});
    const markdown = audit.exportReportAsMarkdown(report);
    
    expect(markdown.includes('# Audit Report')).toBe(true);
    expect(markdown.includes('Total Events')).toBe(true);
  });
});

describe('Quick Start', () => {
  it('should start recording session', () => {
    const { store, recorder } = startRecordingSession('quick-test');
    
    expect(store.getSessionId()).toBe('quick-test');
    expect(store.length).toBe(1); // Session start event
    
    recorder.recordClick('test', 'node');
    expect(store.length).toBe(2);
  });
});

// ─────────────────────────────────────────────────────
// RUN
// ─────────────────────────────────────────────────────

console.log('\n🧪 CHE·NU Timeline Tests\n');
console.log('═'.repeat(50));
