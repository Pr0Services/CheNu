/* CHE·NU — Meeting Room Tests (Phase 6) */

import { MeetingRoom } from './MeetingRoom';
import { MeetingObjective, ParticipantRegistry } from './types';

function describe(name: string, fn: () => void): void { console.log(`\n📦 ${name}`); fn(); }
function it(name: string, fn: () => void): void { try { fn(); console.log(`  ✅ ${name}`); } catch (e) { console.error(`  ❌ ${name}\n     ${e}`); } }
function expect<T>(actual: T) { return { toBe(expected: T) { if (actual !== expected) throw new Error(`Expected ${expected}, got ${actual}`); }, toBeTruthy() { if (!actual) throw new Error(`Expected truthy`); }, toBeGreaterThan(n: number) { if (typeof actual !== 'number' || actual <= n) throw new Error(`Expected ${actual} > ${n}`); } }; }

const testObjective = (): MeetingObjective => ({ title: 'Q4 Budget', sphereId: 'business', criticality: 'high' });
const testParticipants = (): ParticipantRegistry => ({ humans: [{ id: 'u1', displayName: 'Jo', role: 'owner' }, { id: 'u2', displayName: 'Alex', role: 'collaborator' }], agents: [] });

describe('MeetingRoom Creation', () => {
  it('should create with initial state', () => { const r = new MeetingRoom('m1', testObjective(), testParticipants()); expect(r.getId()).toBe('m1'); expect(r.getStatus()).toBe('scheduled'); expect(r.getPhase()).toBe('analysis'); });
  it('should identify decision maker', () => { const r = new MeetingRoom('m2', testObjective(), testParticipants()); expect(r.getOwner()?.id).toBe('u1'); expect(r.getState().context.hasDecisionMaker).toBe(true); });
});

describe('MeetingRoom Lifecycle', () => {
  it('should start', () => { const r = new MeetingRoom('m3', testObjective(), testParticipants()); r.start(); expect(r.getStatus()).toBe('active'); expect(r.getState().startedAt).toBeTruthy(); });
  it('should pause and resume', () => { const r = new MeetingRoom('m4', testObjective(), testParticipants()); r.start(); r.pause(); expect(r.getStatus()).toBe('paused'); r.resume(); expect(r.getStatus()).toBe('active'); });
  it('should close', () => { const r = new MeetingRoom('m5', testObjective(), testParticipants()); r.start(); r.close(); expect(r.getStatus()).toBe('completed'); });
});

describe('MeetingRoom Phases', () => {
  it('should start in analysis', () => { expect(new MeetingRoom('m6', testObjective(), testParticipants()).getPhase()).toBe('analysis'); });
  it('should advance with contributions', () => { const r = new MeetingRoom('m7', testObjective(), testParticipants()); r.start(); r.addAgentContribution({ agentId: 'a1', type: 'analysis', content: 'Done', confidence: 0.9 }); expect(r.advancePhase()).toBe('decision'); });
  it('should require decision before validation', () => { const r = new MeetingRoom('m8', testObjective(), testParticipants()); r.start(); r.addAgentContribution({ agentId: 'a1', type: 'analysis', content: 'Done', confidence: 1 }); r.advancePhase(); expect(r.canAdvancePhase().canAdvance).toBe(false); });
});

describe('MeetingRoom Contributions', () => {
  it('should add agent contributions', () => { const r = new MeetingRoom('m9', testObjective(), testParticipants()); r.start(); const c = r.addAgentContribution({ agentId: 'a1', type: 'recommendation', content: 'Approve', confidence: 0.85 }); expect(c.id).toBeTruthy(); expect(r.getRecommendations().length).toBe(1); });
  it('should add human contributions', () => { const r = new MeetingRoom('m10', testObjective(), testParticipants()); r.start(); const c = r.addHumanContribution({ participantId: 'u1', type: 'comment', content: 'Agreed' }); expect(c.id).toBeTruthy(); });
});

describe('MeetingRoom Decisions', () => {
  it('should record decisions', () => { const r = new MeetingRoom('m11', testObjective(), testParticipants()); r.start(); r.addAgentContribution({ agentId: 'a1', type: 'analysis', content: 'Done', confidence: 1 }); r.advancePhase(); const d = r.recordDecision({ decidedBy: 'u1', decisionType: 'approve', summary: 'Budget approved' }); expect(d.id).toBeTruthy(); expect(d.decisionType).toBe('approve'); });
  it('should reject observer decisions', () => { const p: ParticipantRegistry = { humans: [{ id: 'u1', displayName: 'Obs', role: 'observer' }], agents: [] }; const r = new MeetingRoom('m12', testObjective(), p); r.start(); r.addAgentContribution({ agentId: 'a1', type: 'analysis', content: 'Done', confidence: 1 }); r.advancePhase(); let threw = false; try { r.recordDecision({ decidedBy: 'u1', decisionType: 'approve', summary: 'Fail' }); } catch { threw = true; } expect(threw).toBe(true); });
});

describe('MeetingRoom Summary', () => {
  it('should generate summary', () => { const r = new MeetingRoom('m13', testObjective(), testParticipants()); r.start(); r.addAgentContribution({ agentId: 'a1', type: 'recommendation', content: 'Approve', confidence: 0.9 }); r.advancePhase(); r.recordDecision({ decidedBy: 'u1', decisionType: 'approve', summary: 'Approved' }); r.advancePhase(); r.close(); const s = r.generateSummary(); expect(s.decisionsSummary.approved).toBe(1); expect(s.outcome).toBe('successful'); });
});

describe('MeetingRoom Serialization', () => {
  it('should serialize/deserialize', () => { const r = new MeetingRoom('m14', testObjective(), testParticipants()); r.start(); const json = r.toJSON(); const r2 = MeetingRoom.fromJSON(json); expect(r2.getId()).toBe('m14'); expect(r2.getStatus()).toBe('active'); });
});

describe('MeetingRoom Events', () => {
  it('should emit events', () => { const r = new MeetingRoom('m15', testObjective(), testParticipants()); const events: string[] = []; r.subscribe(e => events.push(e.eventType)); r.start(); r.addAgentContribution({ agentId: 'a1', type: 'analysis', content: 'Done', confidence: 1 }); r.advancePhase(); expect(events.length).toBeGreaterThan(2); });
});

console.log('\n🧪 CHE·NU Meeting Room Tests\n' + '═'.repeat(50));
