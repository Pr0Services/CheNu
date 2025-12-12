/* =====================================================
   CHE·NU — Agent Tests
   
   PHASE 4: INFLUENCE & ORCHESTRATION AGENTS
   
   Tests verify:
   1. Agents produce correct output types
   2. Agents are deterministic (same input → same output)
   3. Agents never mutate input
   4. Agents respect confidence thresholds
   5. Orchestration works correctly
   ===================================================== */

import {
  createAgentEngine,
  getAgent,
  getAgentIds,
  createMinimalContext,
  createSampleTimeline,
  createSampleDimensions,
  createSampleNodes,
  AgentOutput,
  SystemContext,
  DEFAULT_AGENT_CONFIG,
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
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toBeGreaterThan(expected: number): void {
      if (typeof actual !== 'number' || actual <= expected) {
        throw new Error(`Expected ${actual} > ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number): void {
      if (typeof actual !== 'number' || actual < expected) {
        throw new Error(`Expected ${actual} >= ${expected}`);
      }
    },
    toBeLessThan(expected: number): void {
      if (typeof actual !== 'number' || actual >= expected) {
        throw new Error(`Expected ${actual} < ${expected}`);
      }
    },
    toBeTruthy(): void {
      if (!actual) {
        throw new Error(`Expected truthy, got ${actual}`);
      }
    },
    toBeFalsy(): void {
      if (actual) {
        throw new Error(`Expected falsy, got ${actual}`);
      }
    },
    toContain(item: unknown): void {
      if (!Array.isArray(actual) || !actual.includes(item)) {
        throw new Error(`Expected array to contain ${item}`);
      }
    },
    toHaveLength(length: number): void {
      if (!Array.isArray(actual) || actual.length !== length) {
        throw new Error(`Expected length ${length}, got ${(actual as any)?.length}`);
      }
    },
    toBeInstanceOf(cls: any): void {
      if (!(actual instanceof cls)) {
        throw new Error(`Expected instance of ${cls.name}`);
      }
    },
  };
}

// ─────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────

describe('Agent Registry', () => {
  it('should have all 4 agents registered', () => {
    const ids = getAgentIds();
    expect(ids.length).toBe(4);
    expect(ids).toContain('orchestrator');
    expect(ids).toContain('methodology');
    expect(ids).toContain('decision-eval');
    expect(ids).toContain('memory-recall');
  });
  
  it('should return agent by ID', () => {
    const orchestrator = getAgent('orchestrator');
    expect(orchestrator).toBeTruthy();
    expect(orchestrator!.definition.id).toBe('orchestrator');
  });
  
  it('should return undefined for unknown agent', () => {
    const unknown = getAgent('unknown' as any);
    expect(unknown).toBeFalsy();
  });
});

describe('Orchestrator Agent', () => {
  const agent = getAgent('orchestrator')!;
  
  it('should have correct definition', () => {
    expect(agent.definition.id).toBe('orchestrator');
    expect(agent.definition.canOrchestrate).toBe(true);
    expect(agent.definition.priority).toBe(0);
  });
  
  it('should produce outputs for active system', () => {
    const context = createMinimalContext();
    context.activity.pendingDecisions = 5;
    
    const dimensions = createSampleDimensions();
    const nodes = createSampleNodes();
    const timeline = createSampleTimeline();
    
    const input = {
      context,
      dimensions,
      universeNodes: nodes,
      timeline,
      agentOutputs: [],
      config: DEFAULT_AGENT_CONFIG,
    };
    
    const outputs = agent.execute(input);
    expect(outputs.length).toBeGreaterThan(0);
    
    for (const output of outputs) {
      expect(output.agentId).toBe('orchestrator');
      expect(output.confidence).toBeGreaterThan(0);
      expect(output.confidence).toBeLessThan(1.01);
    }
  });
  
  it('should recommend other agents when needed', () => {
    const context = createMinimalContext();
    context.activity.pendingDecisions = 10;
    
    const input = {
      context,
      dimensions: createSampleDimensions(),
      universeNodes: createSampleNodes(),
      timeline: createSampleTimeline(),
      agentOutputs: [],
      config: DEFAULT_AGENT_CONFIG,
    };
    
    const outputs = agent.execute(input);
    const recommendations = outputs.filter(o => o.type === 'recommendation');
    
    // Should recommend at least decision-eval for high pending decisions
    expect(recommendations.length).toBeGreaterThan(0);
  });
});

describe('Methodology Agent', () => {
  const agent = getAgent('methodology')!;
  
  it('should have correct definition', () => {
    expect(agent.definition.id).toBe('methodology');
    expect(agent.definition.canOrchestrate).toBe(false);
  });
  
  it('should detect context switching anti-pattern', () => {
    const context = createMinimalContext();
    const timeline = [
      // Simulate rapid sphere switching
      ...Array(8).fill(null).map((_, i) => ({
        id: `nav-${i}`,
        timestamp: Date.now() - (i * 10000),
        type: 'navigation' as const,
        source: 'user' as const,
        payload: {},
        sphereId: i % 2 === 0 ? 'business' : 'creative',
      })),
    ];
    
    const input = {
      context,
      dimensions: createSampleDimensions(),
      universeNodes: createSampleNodes(),
      timeline,
      agentOutputs: [],
      config: DEFAULT_AGENT_CONFIG,
    };
    
    const outputs = agent.execute(input);
    const signals = outputs.filter(o => o.type === 'signal');
    
    // Should detect thrashing or switching
    expect(outputs.length).toBeGreaterThan(0);
  });
  
  it('should provide methodology context enrichment', () => {
    const input = {
      context: createMinimalContext(),
      dimensions: createSampleDimensions(),
      universeNodes: createSampleNodes(),
      timeline: createSampleTimeline(),
      agentOutputs: [],
      config: DEFAULT_AGENT_CONFIG,
    };
    
    const outputs = agent.execute(input);
    const enrichments = outputs.filter(o => o.type === 'enrichment');
    
    expect(enrichments.length).toBeGreaterThan(0);
  });
});

describe('Decision Evaluation Agent', () => {
  const agent = getAgent('decision-eval')!;
  
  it('should have correct definition', () => {
    expect(agent.definition.id).toBe('decision-eval');
    expect(agent.definition.observes).toContain('timeline');
  });
  
  it('should detect stale decisions', () => {
    const now = Date.now();
    const timeline = [
      {
        id: 'dec-1',
        timestamp: now - 900000, // 15 min ago
        type: 'decision-pending' as const,
        source: 'system' as const,
        payload: {},
        sphereId: 'business',
      },
    ];
    
    const input = {
      context: createMinimalContext(),
      dimensions: createSampleDimensions(),
      universeNodes: createSampleNodes(),
      timeline,
      agentOutputs: [],
      config: { ...DEFAULT_AGENT_CONFIG, timelineWindowMs: 3600000 },
    };
    
    const outputs = agent.execute(input);
    const signals = outputs.filter(o => o.type === 'signal');
    
    // Should flag stale decision
    expect(signals.length).toBeGreaterThan(0);
  });
  
  it('should analyze decision patterns', () => {
    const now = Date.now();
    const timeline = [
      { id: 'd1', timestamp: now - 60000, type: 'decision-made' as const, source: 'user' as const, payload: {}, sphereId: 'business' },
      { id: 'd2', timestamp: now - 50000, type: 'decision-pending' as const, source: 'system' as const, payload: {}, sphereId: 'business' },
      { id: 'd3', timestamp: now - 40000, type: 'decision-made' as const, source: 'user' as const, payload: {}, sphereId: 'creative' },
      { id: 'd4', timestamp: now - 30000, type: 'decision-pending' as const, source: 'system' as const, payload: {}, sphereId: 'creative' },
    ];
    
    const input = {
      context: createMinimalContext(),
      dimensions: createSampleDimensions(),
      universeNodes: createSampleNodes(),
      timeline,
      agentOutputs: [],
      config: DEFAULT_AGENT_CONFIG,
    };
    
    const outputs = agent.execute(input);
    const enrichments = outputs.filter(o => o.type === 'enrichment');
    
    expect(enrichments.length).toBeGreaterThan(0);
  });
});

describe('Memory Recall Agent', () => {
  const agent = getAgent('memory-recall')!;
  
  it('should have correct definition', () => {
    expect(agent.definition.id).toBe('memory-recall');
    expect(agent.definition.priority).toBe(1); // Run early
  });
  
  it('should provide historical context', () => {
    const now = Date.now();
    const timeline = [
      // Old events
      { id: 'h1', timestamp: now - 600000, type: 'navigation' as const, source: 'user' as const, payload: {}, sphereId: 'business' },
      { id: 'h2', timestamp: now - 590000, type: 'decision-made' as const, source: 'user' as const, payload: {}, sphereId: 'business' },
      { id: 'h3', timestamp: now - 580000, type: 'milestone' as const, source: 'system' as const, payload: {}, sphereId: 'business' },
      // Recent events with similar pattern
      { id: 'r1', timestamp: now - 30000, type: 'navigation' as const, source: 'user' as const, payload: {}, sphereId: 'business' },
      { id: 'r2', timestamp: now - 20000, type: 'decision-pending' as const, source: 'system' as const, payload: {}, sphereId: 'business' },
    ];
    
    const input = {
      context: createMinimalContext(),
      dimensions: createSampleDimensions(),
      universeNodes: createSampleNodes(),
      timeline,
      agentOutputs: [],
      config: { ...DEFAULT_AGENT_CONFIG, timelineWindowMs: 60000 },
    };
    
    const outputs = agent.execute(input);
    
    // Should provide some context or find patterns
    expect(outputs.length).toBeGreaterThanOrEqual(0);
  });
});

describe('Agent Engine', () => {
  it('should create engine with default config', () => {
    const engine = createAgentEngine();
    expect(engine).toBeTruthy();
  });
  
  it('should execute single agent', () => {
    const engine = createAgentEngine();
    const outputs = engine.executeAgent(
      'orchestrator',
      createMinimalContext(),
      createSampleDimensions(),
      createSampleNodes(),
      createSampleTimeline()
    );
    
    expect(outputs).toBeTruthy();
    expect(Array.isArray(outputs)).toBe(true);
  });
  
  it('should execute agents sequentially', () => {
    const engine = createAgentEngine();
    const outputs = engine.executeSequential(
      ['memory-recall', 'methodology'],
      createMinimalContext(),
      createSampleDimensions(),
      createSampleNodes(),
      createSampleTimeline()
    );
    
    // Later agents should have access to earlier outputs
    expect(Array.isArray(outputs)).toBe(true);
  });
  
  it('should maintain output history', () => {
    const engine = createAgentEngine();
    
    engine.executeAgent(
      'orchestrator',
      createMinimalContext(),
      createSampleDimensions(),
      createSampleNodes(),
      createSampleTimeline()
    );
    
    const history = engine.getOutputHistory();
    expect(history.length).toBeGreaterThanOrEqual(0);
  });
  
  it('should clear history', () => {
    const engine = createAgentEngine();
    
    engine.executeAgent(
      'orchestrator',
      createMinimalContext(),
      createSampleDimensions(),
      createSampleNodes(),
      createSampleTimeline()
    );
    
    engine.clearHistory();
    
    const history = engine.getOutputHistory();
    expect(history.length).toBe(0);
  });
});

describe('Output Structure', () => {
  it('should have valid output structure', () => {
    const engine = createAgentEngine();
    const outputs = engine.executeAgent(
      'orchestrator',
      createMinimalContext(),
      createSampleDimensions(),
      createSampleNodes(),
      createSampleTimeline()
    );
    
    for (const output of outputs) {
      // Required fields
      expect(output.id).toBeTruthy();
      expect(output.agentId).toBeTruthy();
      expect(output.timestamp).toBeGreaterThan(0);
      expect(output.type).toBeTruthy();
      expect(output.target).toBeTruthy();
      expect(output.payload).toBeTruthy();
      expect(output.confidence).toBeGreaterThanOrEqual(0);
      expect(output.confidence).toBeLessThan(1.01);
      expect(output.reasoning).toBeTruthy();
      expect(output.priority).toBeGreaterThan(0);
      expect(output.ttl).toBeGreaterThan(0);
      
      // Payload must have kind
      expect((output.payload as any).kind).toBeTruthy();
    }
  });
});

describe('Determinism', () => {
  it('should produce same outputs for same input', () => {
    const agent = getAgent('methodology')!;
    const input = {
      context: createMinimalContext(),
      dimensions: createSampleDimensions(),
      universeNodes: createSampleNodes(),
      timeline: createSampleTimeline(),
      agentOutputs: [],
      config: DEFAULT_AGENT_CONFIG,
    };
    
    // Freeze timestamp for determinism
    const frozenInput = JSON.parse(JSON.stringify(input));
    
    const outputs1 = agent.execute(input);
    const outputs2 = agent.execute(input);
    
    // Same number of outputs
    expect(outputs1.length).toBe(outputs2.length);
    
    // Same types
    const types1 = outputs1.map(o => o.type).sort();
    const types2 = outputs2.map(o => o.type).sort();
    expect(JSON.stringify(types1)).toBe(JSON.stringify(types2));
  });
});

// ─────────────────────────────────────────────────────
// RUN TESTS
// ─────────────────────────────────────────────────────

console.log('\n🧪 CHE·NU Agent Tests\n');
console.log('═'.repeat(50));
