/* CHE·NU — Meeting Room Engine (Phase 6) */

import { MeetingRoomState, MeetingPhase, MeetingStatus, MeetingObjective, ParticipantRegistry, HumanParticipant, AgentParticipant, AgentContribution, HumanContribution, DecisionRecord, DecisionType, MeetingContext, MeetingSummary, PhaseRequirements, DEFAULT_PHASE_REQUIREMENTS, MeetingEventType, MeetingEventPayload } from './types';

export class MeetingRoom {
  private state: MeetingRoomState;
  private requirements: PhaseRequirements;
  private listeners: Set<MeetingListener> = new Set();
  
  constructor(id: string, objective: MeetingObjective, participants: ParticipantRegistry, options: MeetingOptions = {}) {
    this.requirements = options.requirements || DEFAULT_PHASE_REQUIREMENTS;
    this.state = {
      id, status: 'scheduled', phase: 'analysis',
      context: { phase: 'analysis', objective, participants, hasDecisionMaker: participants.humans.some(h => h.role === 'owner'), agentRecommendationsCount: 0, pendingDecisionsCount: 0 },
      createdAt: Date.now(), agentContributions: [], humanContributions: [], decisions: [], tags: options.tags || [], parentMeetingId: options.parentMeetingId,
    };
    this.emit('meeting:created', { objective, participants });
  }
  
  private updateContext(): void {
    this.state.context = { ...this.state.context, phase: this.state.phase, agentRecommendationsCount: this.state.agentContributions.filter(c => c.type === 'recommendation').length, pendingDecisionsCount: 0 };
  }
  
  start(): void { if (this.state.status !== 'scheduled') throw new Error(`Cannot start`); this.state.status = 'active'; this.state.startedAt = Date.now(); this.emit('meeting:started', {}); }
  pause(): void { if (this.state.status !== 'active') throw new Error(`Cannot pause`); this.state.status = 'paused'; this.state.pausedAt = Date.now(); this.emit('meeting:paused', {}); }
  resume(): void { if (this.state.status !== 'paused') throw new Error(`Cannot resume`); this.state.status = 'active'; this.state.pausedAt = undefined; this.emit('meeting:resumed', {}); }
  close(): void { if (this.state.status === 'completed' || this.state.status === 'cancelled') return; this.state.status = 'completed'; this.state.closedAt = Date.now(); this.emit('meeting:closed', { decisionsCount: this.state.decisions.length, duration: this.getDuration() }); }
  cancel(reason?: string): void { if (this.state.status === 'completed' || this.state.status === 'cancelled') return; this.state.status = 'cancelled'; this.state.closedAt = Date.now(); this.emit('meeting:cancelled', { reason }); }
  
  getPhase(): MeetingPhase { return this.state.phase; }
  
  canAdvancePhase(): { canAdvance: boolean; blockers: string[] } {
    const blockers: string[] = [];
    if (this.state.status !== 'active') { blockers.push(`Not active`); return { canAdvance: false, blockers }; }
    if (this.state.phase === 'analysis' && this.state.agentContributions.length < this.requirements.analysis.minAgentContributions) blockers.push('Need agent contributions');
    if (this.state.phase === 'decision' && this.state.decisions.length === 0) blockers.push('Need decision');
    if (this.state.phase === 'validation') blockers.push('Already at validation');
    return { canAdvance: blockers.length === 0, blockers };
  }
  
  advancePhase(): MeetingPhase {
    const { canAdvance, blockers } = this.canAdvancePhase();
    if (!canAdvance) throw new Error(`Cannot advance: ${blockers.join('; ')}`);
    const from = this.state.phase;
    const to: MeetingPhase = from === 'analysis' ? 'decision' : 'validation';
    this.state.phase = to; this.updateContext(); this.emit('meeting:phase-changed', { from, to });
    return to;
  }
  
  addHumanParticipant(p: HumanParticipant): void { if (this.state.context.participants.humans.find(h => h.id === p.id)) return; this.state.context.participants.humans.push({ ...p, joinedAt: Date.now() }); this.updateContext(); this.emit('participant:joined', { type: 'human', participant: p }); }
  removeHumanParticipant(id: string): void { const p = this.state.context.participants.humans.find(h => h.id === id); if (p) { p.leftAt = Date.now(); this.emit('participant:left', { type: 'human', participantId: id }); } }
  addAgentParticipant(a: AgentParticipant): void { if (this.state.context.participants.agents.find(x => x.id === a.id)) return; this.state.context.participants.agents.push({ ...a, activatedAt: Date.now(), outputCount: 0 }); this.emit('participant:joined', { type: 'agent', participant: a }); }
  getOwner(): HumanParticipant | undefined { return this.state.context.participants.humans.find(h => h.role === 'owner' && !h.leftAt); }
  getActiveAgents(): AgentParticipant[] { return this.state.context.participants.agents.filter(a => a.activatedAt); }
  
  addAgentContribution(c: Omit<AgentContribution, 'id' | 'timestamp'>): AgentContribution {
    if (this.state.status !== 'active') throw new Error('Inactive');
    const full: AgentContribution = { id: `ac-${Date.now()}-${Math.random().toString(36).substr(2,4)}`, timestamp: Date.now(), ...c };
    this.state.agentContributions.push(full);
    const agent = this.state.context.participants.agents.find(a => a.id === c.agentId);
    if (agent) agent.outputCount++;
    this.updateContext(); this.emit('agent:contributed', { contribution: full });
    return full;
  }
  
  addHumanContribution(c: Omit<HumanContribution, 'id' | 'timestamp'>): HumanContribution {
    if (this.state.status !== 'active') throw new Error('Inactive');
    const full: HumanContribution = { id: `hc-${Date.now()}-${Math.random().toString(36).substr(2,4)}`, timestamp: Date.now(), ...c };
    this.state.humanContributions.push(full); this.emit('human:contributed', { contribution: full });
    return full;
  }
  
  getRecommendations(): AgentContribution[] { return this.state.agentContributions.filter(c => c.type === 'recommendation'); }
  
  recordDecision(input: { decidedBy: string; decisionType: DecisionType; summary: string; rationale?: string; linkedContributions?: string[] }): DecisionRecord {
    if (this.state.status !== 'active') throw new Error('Inactive');
    if (this.state.phase !== 'decision' && this.state.phase !== 'validation') throw new Error('Wrong phase');
    const decider = this.state.context.participants.humans.find(h => h.id === input.decidedBy);
    if (!decider || (decider.role !== 'owner' && decider.role !== 'collaborator')) throw new Error('Not authorized');
    const decision: DecisionRecord = { id: `dec-${Date.now()}-${Math.random().toString(36).substr(2,4)}`, timestamp: Date.now(), decidedBy: input.decidedBy, decisionType: input.decisionType, summary: input.summary, rationale: input.rationale, linkedContributions: input.linkedContributions || [] };
    this.state.decisions.push(decision); this.emit('decision:recorded', { decision });
    return decision;
  }
  
  amendDecision(id: string, updates: Partial<Pick<DecisionRecord, 'summary' | 'rationale'>>): void {
    const d = this.state.decisions.find(x => x.id === id);
    if (!d) throw new Error('Not found');
    if (updates.summary) d.summary = updates.summary;
    if (updates.rationale) d.rationale = updates.rationale;
    this.emit('decision:amended', { decisionId: id, updates });
  }
  
  getState(): Readonly<MeetingRoomState> { return this.state; }
  getId(): string { return this.state.id; }
  getStatus(): MeetingStatus { return this.state.status; }
  isOpen(): boolean { return this.state.status === 'active' || this.state.status === 'paused'; }
  getDuration(): number { if (!this.state.startedAt) return 0; return (this.state.closedAt || Date.now()) - this.state.startedAt; }
  
  generateSummary(): MeetingSummary {
    const d = this.state.decisions;
    return {
      meetingId: this.state.id, objective: this.state.context.objective.title, sphereId: this.state.context.objective.sphereId, duration: this.getDuration(),
      participantCounts: { humans: this.state.context.participants.humans.length, agents: this.state.context.participants.agents.length },
      contributionCounts: { agentAnalyses: this.state.agentContributions.filter(c => c.type === 'analysis').length, agentRecommendations: this.state.agentContributions.filter(c => c.type === 'recommendation').length, humanComments: this.state.humanContributions.filter(c => c.type === 'comment').length },
      decisionsSummary: { total: d.length, approved: d.filter(x => x.decisionType === 'approve').length, rejected: d.filter(x => x.decisionType === 'reject').length, deferred: d.filter(x => x.decisionType === 'defer').length, pivoted: d.filter(x => x.decisionType === 'pivot').length },
      keyDecisions: d.map(x => x.summary),
      outcome: this.state.status === 'cancelled' ? 'cancelled' : d.length === 0 ? 'inconclusive' : d.filter(x => x.decisionType === 'approve').length === d.length ? 'successful' : d.filter(x => x.decisionType === 'approve').length > 0 ? 'partial' : 'inconclusive',
    };
  }
  
  private emit(eventType: MeetingEventType, data: Record<string, unknown>): void {
    const payload: MeetingEventPayload = { kind: 'meeting-event', eventType, meetingId: this.state.id, data };
    this.listeners.forEach(fn => { try { fn(payload); } catch {} });
  }
  
  subscribe(listener: MeetingListener): () => void { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  toJSON(): string { return JSON.stringify(this.state, null, 2); }
  
  static fromJSON(json: string, requirements?: PhaseRequirements): MeetingRoom {
    const state: MeetingRoomState = JSON.parse(json);
    const room = new MeetingRoom(state.id, state.context.objective, state.context.participants, { requirements, tags: state.tags, parentMeetingId: state.parentMeetingId });
    (room as any).state = state;
    return room;
  }
}

export type MeetingListener = (event: MeetingEventPayload) => void;
export interface MeetingOptions { requirements?: PhaseRequirements; tags?: string[]; parentMeetingId?: string; }
