/* CHE·NU — Meeting Orchestrator (Phase 6) */

import { MeetingRoom } from './MeetingRoom';
import { MeetingPhase, AgentParticipant, AgentContribution, AgentRole } from './types';

export class MeetingOrchestrator {
  private room: MeetingRoom;
  private agentEngine: any;
  private config: OrchestratorConfig;
  
  constructor(room: MeetingRoom, agentEngine: any, config: Partial<OrchestratorConfig> = {}) {
    this.room = room;
    this.agentEngine = agentEngine;
    this.config = {
      autoActivateAgents: true,
      maxContributionsPerAgent: 5,
      minConfidenceThreshold: 0.5,
      agentRolesPerPhase: { analysis: ['analyst', 'orchestrator'], decision: ['evaluator', 'advisor'], validation: ['orchestrator'] },
      ...config,
    };
  }
  
  getActiveRolesForPhase(phase: MeetingPhase): AgentRole[] {
    return this.config.agentRolesPerPhase[phase] || [];
  }
  
  activateAgentsForPhase(): AgentParticipant[] {
    const phase = this.room.getPhase();
    const roles = this.getActiveRolesForPhase(phase);
    const activated: AgentParticipant[] = [];
    
    for (const role of roles) {
      const agent: AgentParticipant = {
        id: `agent-${role}-${Date.now()}`,
        name: this.getAgentName(role),
        role,
        capabilities: this.getAgentCapabilities(role),
        outputCount: 0,
      };
      this.room.addAgentParticipant(agent);
      activated.push(agent);
    }
    return activated;
  }
  
  private getAgentName(role: AgentRole): string {
    const names: Record<AgentRole, string> = { orchestrator: 'Orchestrator', analyst: 'Analyst', evaluator: 'Evaluator', advisor: 'Advisor' };
    return names[role] || role;
  }
  
  private getAgentCapabilities(role: AgentRole): string[] {
    const caps: Record<AgentRole, string[]> = {
      orchestrator: ['coordination', 'prioritization'],
      analyst: ['analysis', 'pattern-recognition'],
      evaluator: ['decision-support', 'risk-assessment'],
      advisor: ['recommendations', 'best-practices'],
    };
    return caps[role] || [];
  }
  
  async runAgents(): Promise<AgentContribution[]> {
    const state = this.room.getState();
    if (state.status !== 'active') throw new Error('Inactive meeting');
    
    const contributions: AgentContribution[] = [];
    
    // If we have an agent engine, use it
    if (this.agentEngine?.executeParallel) {
      try {
        const outputs = await this.agentEngine.executeParallel(this.agentEngine.buildInput({
          timestamp: Date.now(),
          session: { id: state.id, startedAt: state.startedAt || Date.now() },
          focus: { sphereId: state.context.objective.sphereId, nodeId: null, depth: 1 },
          activity: { level: 'active', actionsPerMinute: 5 },
          health: { score: 1, issues: [] },
        }, new Map(), new Map(), []));
        
        for (const output of outputs) {
          if (output.confidence >= this.config.minConfidenceThreshold) {
            const contrib = this.room.addAgentContribution({
              agentId: output.agentId,
              type: output.type === 'recommendation' ? 'recommendation' : output.type === 'signal' ? 'signal' : 'analysis',
              content: output.reasoning || 'Agent analysis',
              confidence: output.confidence,
              reasoning: output.reasoning,
            });
            contributions.push(contrib);
          }
        }
      } catch (e) {
        console.warn('Agent engine error:', e);
      }
    }
    
    return contributions;
  }
  
  onPhaseChange(from: MeetingPhase, to: MeetingPhase): void {
    if (this.config.autoActivateAgents) {
      this.activateAgentsForPhase();
    }
  }
  
  getRecommendationsSummary(): RecommendationsSummary {
    const recommendations = this.room.getRecommendations();
    const byAgent: Record<string, AgentContribution[]> = {};
    for (const r of recommendations) {
      if (!byAgent[r.agentId]) byAgent[r.agentId] = [];
      byAgent[r.agentId].push(r);
    }
    const sorted = [...recommendations].sort((a, b) => b.confidence - a.confidence);
    return {
      total: recommendations.length,
      byAgent,
      topRecommendations: sorted.slice(0, 5),
      averageConfidence: recommendations.length > 0 ? recommendations.reduce((s, r) => s + r.confidence, 0) / recommendations.length : 0,
    };
  }
}

export interface OrchestratorConfig {
  autoActivateAgents: boolean;
  maxContributionsPerAgent: number;
  minConfidenceThreshold: number;
  agentRolesPerPhase: Record<MeetingPhase, AgentRole[]>;
}

export interface RecommendationsSummary {
  total: number;
  byAgent: Record<string, AgentContribution[]>;
  topRecommendations: AgentContribution[];
  averageConfidence: number;
}
