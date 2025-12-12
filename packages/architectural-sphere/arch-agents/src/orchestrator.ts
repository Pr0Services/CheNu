/**
 * CHE·NU — ARCHITECT AGENT ORCHESTRATOR
 * Foundation v1.0
 * 
 * Coordinate Architectural Agents.
 * NEVER designs itself.
 * NEVER decides final outcomes.
 * ONLY orchestrates proposals.
 */

import {
  ArchitecturalAgentId,
  AgentState,
  ArchitecturalOutput,
  ArchitecturalBundle,
  DesignRequest,
  RequestType,
  ValidationResult,
  ActivationEvent,
  ActivationTrigger,
  PlanOutput,
  DecorOutput,
  AvatarOutput,
  NavigationOutput,
  AGENT_FORBIDDEN_ACTIONS,
} from './types';

import {
  ArchitectPlannerAgent,
  DecorDesignerAgent,
  AvatarArchitectAgent,
  NavigationDesignerAgent,
  DomainAdapterAgent,
  ValidationGuardAgent,
  PlannerInput,
  DecorInput,
  AvatarInput,
  NavigationInput,
} from './agents';

// ============================================================
// ORCHESTRATOR CLASS
// ============================================================

export class ArchitectAgentOrchestrator {
  private state: AgentState = 'off';
  private activatedAt: string | null = null;
  private processLog: string[] = [];
  
  // Agent instances
  private planner: ArchitectPlannerAgent;
  private decorDesigner: DecorDesignerAgent;
  private avatarArchitect: AvatarArchitectAgent;
  private navigationDesigner: NavigationDesignerAgent;
  private domainAdapter: DomainAdapterAgent;
  private validationGuard: ValidationGuardAgent;
  
  // Current request
  private currentRequest: DesignRequest | null = null;
  
  constructor() {
    this.planner = new ArchitectPlannerAgent();
    this.decorDesigner = new DecorDesignerAgent();
    this.avatarArchitect = new AvatarArchitectAgent();
    this.navigationDesigner = new NavigationDesignerAgent();
    this.domainAdapter = new DomainAdapterAgent();
    this.validationGuard = new ValidationGuardAgent();
  }
  
  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  
  getState(): AgentState {
    return this.state;
  }
  
  isActive(): boolean {
    return this.state === 'active' || this.state === 'processing';
  }
  
  private log(message: string): void {
    const timestamp = new Date().toISOString();
    this.processLog.push(`[${timestamp}] ORCHESTRATOR: ${message}`);
    console.log(`[ORCHESTRATOR] ${message}`);
  }
  
  getLogs(): string[] {
    return [...this.processLog];
  }
  
  getAgentLogs(): Record<ArchitecturalAgentId, string[]> {
    return {
      AGENT_ARCHITECT_PLANNER: this.planner.getLogs(),
      AGENT_DECOR_DESIGNER: this.decorDesigner.getLogs(),
      AGENT_AVATAR_ARCHITECT: this.avatarArchitect.getLogs(),
      AGENT_NAVIGATION_DESIGNER: this.navigationDesigner.getLogs(),
      AGENT_DOMAIN_ADAPTER: this.domainAdapter.getLogs(),
      AGENT_VALIDATION_GUARD: this.validationGuard.getLogs(),
      AGENT_ORCHESTRATOR: this.processLog,
    };
  }
  
  // ============================================================
  // ACTIVATION
  // ============================================================
  
  activate(trigger: ActivationTrigger, request?: DesignRequest): ActivationEvent {
    if (this.state !== 'off') {
      throw new Error('Orchestrator is already active');
    }
    
    this.state = 'activating';
    this.activatedAt = new Date().toISOString();
    this.currentRequest = request || null;
    
    this.log(`Activating via ${trigger}`);
    
    // Determine which agents to activate based on request type
    const targetAgents = this.determineAgents(request?.type || 'full');
    
    // Activate selected agents
    for (const agentId of targetAgents) {
      this.activateAgent(agentId);
    }
    
    // Always activate validation guard
    if (!targetAgents.includes('AGENT_VALIDATION_GUARD')) {
      this.activateAgent('AGENT_VALIDATION_GUARD');
      targetAgents.push('AGENT_VALIDATION_GUARD');
    }
    
    this.state = 'active';
    
    return {
      trigger,
      target_agents: targetAgents,
      request,
      timestamp: this.activatedAt,
    };
  }
  
  private activateAgent(agentId: ArchitecturalAgentId): void {
    switch (agentId) {
      case 'AGENT_ARCHITECT_PLANNER':
        this.planner.activate();
        break;
      case 'AGENT_DECOR_DESIGNER':
        this.decorDesigner.activate();
        break;
      case 'AGENT_AVATAR_ARCHITECT':
        this.avatarArchitect.activate();
        break;
      case 'AGENT_NAVIGATION_DESIGNER':
        this.navigationDesigner.activate();
        break;
      case 'AGENT_DOMAIN_ADAPTER':
        this.domainAdapter.activate();
        break;
      case 'AGENT_VALIDATION_GUARD':
        this.validationGuard.activate();
        break;
    }
    this.log(`Activated ${agentId}`);
  }
  
  deactivate(): void {
    if (this.state === 'off') return;
    
    this.state = 'deactivating';
    this.log('Deactivating orchestrator and all agents');
    
    // Deactivate all agents
    if (this.planner.isActive()) this.planner.deactivate();
    if (this.decorDesigner.isActive()) this.decorDesigner.deactivate();
    if (this.avatarArchitect.isActive()) this.avatarArchitect.deactivate();
    if (this.navigationDesigner.isActive()) this.navigationDesigner.deactivate();
    if (this.domainAdapter.isActive()) this.domainAdapter.deactivate();
    if (this.validationGuard.isActive()) this.validationGuard.deactivate();
    
    this.state = 'off';
    this.activatedAt = null;
    this.currentRequest = null;
    
    this.log('Orchestrator deactivated');
  }
  
  // ============================================================
  // ORCHESTRATION LOGIC
  // ============================================================
  
  private determineAgents(requestType: RequestType): ArchitecturalAgentId[] {
    switch (requestType) {
      case 'space':
        return ['AGENT_ARCHITECT_PLANNER', 'AGENT_NAVIGATION_DESIGNER'];
      case 'visual':
        return ['AGENT_DECOR_DESIGNER', 'AGENT_AVATAR_ARCHITECT'];
      case 'avatar':
        return ['AGENT_AVATAR_ARCHITECT'];
      case 'navigation':
        return ['AGENT_NAVIGATION_DESIGNER'];
      case 'domain-specific':
        return ['AGENT_DOMAIN_ADAPTER'];
      case 'full':
      default:
        return [
          'AGENT_ARCHITECT_PLANNER',
          'AGENT_DECOR_DESIGNER',
          'AGENT_AVATAR_ARCHITECT',
          'AGENT_NAVIGATION_DESIGNER',
        ];
    }
  }
  
  // ============================================================
  // MAIN PROCESSING
  // ============================================================
  
  async process(request: DesignRequest): Promise<ArchitecturalBundle> {
    if (this.state !== 'active') {
      throw new Error('Orchestrator is not active');
    }
    
    this.state = 'processing';
    this.currentRequest = request;
    this.log(`Processing request: ${request.request_id} (${request.type})`);
    
    // Check forbidden actions
    this.checkForbidden(request);
    
    const bundle: ArchitecturalBundle = {
      bundle_id: `bundle-${Date.now()}`,
      plans: [],
      decors: [],
      avatars: [],
      navigation: [],
      version: '1.0',
      hash: '',
      status: 'proposal_only', // CRITICAL: Always proposal only
      validation: {
        passed: false,
        validators: [],
      },
      created_at: new Date().toISOString(),
      created_by: request.requested_by,
    };
    
    try {
      // Run agents based on request type
      if (request.type === 'space' || request.type === 'full') {
        const plan = await this.runPlanner(request);
        bundle.plans.push(plan);
        
        if (this.navigationDesigner.isActive()) {
          const nav = await this.runNavigationDesigner(plan.payload, request);
          bundle.navigation.push(nav);
        }
      }
      
      if (request.type === 'visual' || request.type === 'full') {
        const decor = await this.runDecorDesigner(request);
        bundle.decors.push(decor);
      }
      
      if (request.type === 'avatar' || request.type === 'visual' || request.type === 'full') {
        const avatar = await this.runAvatarArchitect(request);
        bundle.avatars.push(avatar);
      }
      
      // Always validate
      bundle.validation = await this.validate(bundle);
      
      // Generate bundle hash
      bundle.hash = this.generateHash(bundle);
      
      this.log(`Bundle created: ${bundle.bundle_id}`);
      
      // Auto-deactivate after export
      this.state = 'exporting';
      this.log('Export complete, auto-deactivating');
      
      // Schedule deactivation
      setTimeout(() => this.deactivate(), 100);
      
      return bundle;
      
    } catch (error) {
      this.log(`Error during processing: ${error}`);
      this.state = 'active';
      throw error;
    }
  }
  
  // ============================================================
  // AGENT RUNNERS
  // ============================================================
  
  private async runPlanner(request: DesignRequest): Promise<ArchitecturalOutput<PlanOutput>> {
    if (!this.planner.isActive()) {
      throw new Error('Planner agent not active');
    }
    
    const input: PlannerInput = {
      domain: request.domain,
      capacity: request.constraints.capacity || 10,
      purpose: request.purpose,
      layout: 'room',
      dimension: request.constraints.dimension || '3d',
    };
    
    const output = await this.planner.process(input);
    output.domain = request.domain;
    return output;
  }
  
  private async runDecorDesigner(request: DesignRequest): Promise<ArchitecturalOutput<DecorOutput>> {
    if (!this.decorDesigner.isActive()) {
      throw new Error('Decor designer agent not active');
    }
    
    const input: DecorInput = {
      theme: request.constraints.theme || 'neutral',
      domain: request.domain,
      comfort_level: request.constraints.comfort_level || 'balanced',
      dimension: request.constraints.dimension || '3d',
    };
    
    const output = await this.decorDesigner.process(input);
    output.domain = request.domain;
    return output;
  }
  
  private async runAvatarArchitect(request: DesignRequest): Promise<ArchitecturalOutput<AvatarOutput>> {
    if (!this.avatarArchitect.isActive()) {
      throw new Error('Avatar architect agent not active');
    }
    
    const input: AvatarInput = {
      agent_role: request.purpose,
      theme: request.constraints.theme || 'neutral',
      visibility_level: 'standard',
    };
    
    const output = await this.avatarArchitect.process(input);
    output.domain = request.domain;
    return output;
  }
  
  private async runNavigationDesigner(
    plan: PlanOutput,
    request: DesignRequest
  ): Promise<ArchitecturalOutput<NavigationOutput>> {
    if (!this.navigationDesigner.isActive()) {
      throw new Error('Navigation designer agent not active');
    }
    
    const input: NavigationInput = {
      plan,
      user_type: 'member',
    };
    
    const output = await this.navigationDesigner.process(input);
    output.domain = request.domain;
    return output;
  }
  
  // ============================================================
  // VALIDATION
  // ============================================================
  
  private async validate(bundle: ArchitecturalBundle): Promise<ArchitecturalBundle['validation']> {
    const validators: string[] = [];
    const errors: string[] = [];
    
    // Validate each output
    const allOutputs = [
      ...bundle.plans,
      ...bundle.decors,
      ...bundle.avatars,
      ...bundle.navigation,
    ];
    
    for (const output of allOutputs) {
      const result = await this.validationGuard.process(output);
      
      if (result.payload.valid) {
        validators.push(...result.payload.checks.filter(c => c.passed).map(c => c.name));
      } else {
        errors.push(...result.payload.checks.filter(c => !c.passed).map(c => c.message || c.name));
      }
    }
    
    return {
      passed: errors.length === 0,
      validators: [...new Set(validators)],
      errors: errors.length > 0 ? errors : undefined,
    };
  }
  
  // ============================================================
  // FORBIDDEN ACTION CHECK
  // ============================================================
  
  private checkForbidden(request: DesignRequest): void {
    const forbidden = AGENT_FORBIDDEN_ACTIONS.AGENT_ORCHESTRATOR;
    
    // Check for approval attempts
    if ((request as any).approve || (request as any).approval) {
      throw new Error('Orchestrator cannot approve outputs');
    }
    
    // Check for activation attempts
    if ((request as any).activate || (request as any).deploy) {
      throw new Error('Orchestrator cannot activate exports');
    }
    
    // Check for domain override
    if ((request as any).override_domain || (request as any).bypass) {
      throw new Error('Orchestrator cannot override domains');
    }
    
    this.log('Forbidden action check passed');
  }
  
  // ============================================================
  // UTILITIES
  // ============================================================
  
  private generateHash(data: unknown): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `bundle-${Math.abs(hash).toString(16).padStart(16, '0')}`;
  }
  
  // ============================================================
  // STATIC FACTORY
  // ============================================================
  
  static createRequest(
    type: RequestType,
    domain: string,
    purpose: string,
    options: Partial<DesignRequest['constraints']> = {}
  ): DesignRequest {
    return {
      request_id: `req-${Date.now()}`,
      type,
      domain,
      purpose,
      constraints: {
        capacity: 10,
        dimension: '3d',
        theme: 'neutral',
        comfort_level: 'balanced',
        ...options,
      },
      requested_by: 'user',
      requested_at: new Date().toISOString(),
    };
  }
}

// ============================================================
// EXPORTS
// ============================================================

export { ArchitectAgentOrchestrator };
export default ArchitectAgentOrchestrator;
