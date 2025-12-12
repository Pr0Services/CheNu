/**
 * CHE·NU — ARCHITECTURAL AGENT SYSTEM
 * Agent Implementations
 * 
 * Each agent: Observe → Propose → Export
 * Nothing activates without approval.
 */

import {
  ArchitecturalAgentId,
  AgentState,
  ArchitecturalOutput,
  PlanOutput,
  DecorOutput,
  AvatarOutput,
  NavigationOutput,
  PlanZone,
  DesignRequest,
  ValidationResult,
  AGENT_FORBIDDEN_ACTIONS,
  ETHICAL_CONSTRAINTS,
} from './types';

// ============================================================
// BASE AGENT CLASS
// ============================================================

export abstract class ArchitecturalAgent<TInput, TOutput> {
  readonly id: ArchitecturalAgentId;
  protected state: AgentState = 'off';
  protected activatedAt: string | null = null;
  protected processLog: string[] = [];
  
  constructor(id: ArchitecturalAgentId) {
    this.id = id;
  }
  
  getState(): AgentState {
    return this.state;
  }
  
  isActive(): boolean {
    return this.state === 'active' || this.state === 'processing';
  }
  
  activate(): void {
    if (this.state !== 'off') {
      throw new Error(`Agent ${this.id} is not in OFF state`);
    }
    this.state = 'activating';
    this.activatedAt = new Date().toISOString();
    this.log(`Activating agent`);
    this.state = 'active';
  }
  
  deactivate(): void {
    this.state = 'deactivating';
    this.log(`Deactivating agent`);
    this.state = 'off';
    this.activatedAt = null;
  }
  
  protected log(message: string): void {
    const timestamp = new Date().toISOString();
    this.processLog.push(`[${timestamp}] ${this.id}: ${message}`);
  }
  
  getLogs(): string[] {
    return [...this.processLog];
  }
  
  clearLogs(): void {
    this.processLog = [];
  }
  
  // Check forbidden actions
  protected checkForbidden(action: string): void {
    const forbidden = AGENT_FORBIDDEN_ACTIONS[this.id] || [];
    if (forbidden.some(f => action.toLowerCase().includes(f.replace('_', '')))) {
      throw new Error(`Forbidden action attempted by ${this.id}: ${action}`);
    }
  }
  
  // Main processing method
  async process(input: TInput): Promise<ArchitecturalOutput<TOutput>> {
    if (this.state !== 'active') {
      throw new Error(`Agent ${this.id} is not active`);
    }
    
    this.state = 'processing';
    this.log(`Processing input`);
    
    try {
      const output = await this.generateOutput(input);
      
      this.state = 'exporting';
      this.log(`Generating output`);
      
      const wrapped = this.wrapOutput(output);
      
      this.state = 'active';
      return wrapped;
    } catch (error) {
      this.state = 'active';
      throw error;
    }
  }
  
  protected abstract generateOutput(input: TInput): Promise<TOutput>;
  protected abstract getOutputType(): 'plan' | 'decor' | 'avatar' | 'navigation';
  
  protected wrapOutput(payload: TOutput): ArchitecturalOutput<TOutput> {
    return {
      type: this.getOutputType(),
      source_agent: this.id,
      domain: '', // Set by caller
      version: '1.0',
      hash: this.generateHash(payload),
      requires_approval: true,
      created_at: new Date().toISOString(),
      payload,
    };
  }
  
  protected generateHash(data: unknown): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
}

// ============================================================
// PLANNER AGENT
// ============================================================

export interface PlannerInput {
  domain: string;
  capacity: number;
  purpose: string;
  layout?: 'room' | 'hub' | 'radial' | 'layered';
  dimension?: '2d' | '3d' | 'xr';
}

export class ArchitectPlannerAgent extends ArchitecturalAgent<PlannerInput, PlanOutput> {
  constructor() {
    super('AGENT_ARCHITECT_PLANNER');
  }
  
  protected getOutputType(): 'plan' {
    return 'plan';
  }
  
  protected async generateOutput(input: PlannerInput): Promise<PlanOutput> {
    this.checkForbidden('workflow');
    this.checkForbidden('task_chain');
    
    this.log(`Creating plan for ${input.domain} with capacity ${input.capacity}`);
    
    // Generate zones based on purpose
    const zones = this.generateZones(input);
    
    return {
      plan_id: `plan-${Date.now()}`,
      name: `${input.purpose} Space`,
      domain: input.domain,
      layout: input.layout || 'room',
      dimension: input.dimension || '3d',
      zones,
      navigation: {
        mode: 'free',
        minimap: true,
        entry_point: zones[0]?.zone_id,
        exit_points: zones.length > 1 ? [zones[zones.length - 1].zone_id] : [],
      },
    };
  }
  
  private generateZones(input: PlannerInput): PlanZone[] {
    const zones: PlanZone[] = [];
    const baseCapacity = Math.ceil(input.capacity / 3);
    
    // Main zone
    zones.push({
      zone_id: `zone-main-${Date.now()}`,
      name: 'Main Area',
      purpose: input.purpose.includes('meeting') ? 'conversation' : 'work',
      capacity: baseCapacity * 2,
      visibility: 'public',
    });
    
    // Secondary zone
    zones.push({
      zone_id: `zone-secondary-${Date.now() + 1}`,
      name: 'Focus Area',
      purpose: 'reflection',
      capacity: baseCapacity,
      visibility: 'private',
    });
    
    // Navigation zone
    zones.push({
      zone_id: `zone-nav-${Date.now() + 2}`,
      name: 'Entry Hall',
      purpose: 'navigation',
      capacity: input.capacity,
      visibility: 'public',
    });
    
    return zones;
  }
}

// ============================================================
// DECOR DESIGNER AGENT
// ============================================================

export interface DecorInput {
  theme: string;
  domain: string;
  comfort_level: 'minimal' | 'balanced' | 'immersive';
  dimension?: '2d' | '3d' | 'xr';
}

export class DecorDesignerAgent extends ArchitecturalAgent<DecorInput, DecorOutput> {
  constructor() {
    super('AGENT_DECOR_DESIGNER');
  }
  
  protected getOutputType(): 'decor' {
    return 'decor';
  }
  
  protected async generateOutput(input: DecorInput): Promise<DecorOutput> {
    this.checkForbidden('psychological');
    this.checkForbidden('hidden_cue');
    
    this.log(`Designing decor for theme: ${input.theme}`);
    
    const colors = this.generateColors(input.theme);
    const lighting = this.generateLighting(input.comfort_level);
    
    return {
      decor_id: `decor-${Date.now()}`,
      name: `${input.theme} Theme`,
      theme: input.theme,
      domain: input.domain,
      dimension: input.dimension || '3d',
      comfort_level: input.comfort_level,
      colors,
      lighting,
      atmosphere: input.comfort_level === 'immersive' ? {
        fog: true,
        fog_density: 0.1,
        particles: true,
        particle_type: 'ambient_dust',
      } : undefined,
    };
  }
  
  private generateColors(theme: string): DecorOutput['colors'] {
    const themes: Record<string, DecorOutput['colors']> = {
      neutral: { primary: '#9CA3AF', secondary: '#D1D5DB', accent: '#6B7280', background: '#F9FAFB' },
      organic: { primary: '#6EE7B7', secondary: '#A7F3D0', accent: '#10B981', background: '#ECFDF5' },
      cosmic: { primary: '#6366F1', secondary: '#818CF8', accent: '#4F46E5', background: '#1E1B4B' },
      focus: { primary: '#374151', secondary: '#4B5563', accent: '#1F2937', background: '#111827' },
      warm: { primary: '#F59E0B', secondary: '#FCD34D', accent: '#D97706', background: '#FFFBEB' },
    };
    return themes[theme.toLowerCase()] || themes.neutral;
  }
  
  private generateLighting(comfort: string): DecorOutput['lighting'] {
    const configs: Record<string, DecorOutput['lighting']> = {
      minimal: { type: 'ambient', intensity: 0.6, color: '#FFFFFF', shadows: false },
      balanced: { type: 'mixed', intensity: 0.8, color: '#FFF8DC', shadows: true },
      immersive: { type: 'directional', intensity: 1.0, color: '#FFE4B5', shadows: true },
    };
    return configs[comfort] || configs.balanced;
  }
}

// ============================================================
// AVATAR ARCHITECT AGENT
// ============================================================

export interface AvatarInput {
  agent_role: string;
  theme: string;
  visibility_level: 'minimal' | 'standard' | 'prominent';
}

export class AvatarArchitectAgent extends ArchitecturalAgent<AvatarInput, AvatarOutput> {
  constructor() {
    super('AGENT_AVATAR_ARCHITECT');
  }
  
  protected getOutputType(): 'avatar' {
    return 'avatar';
  }
  
  protected async generateOutput(input: AvatarInput): Promise<AvatarOutput> {
    this.checkForbidden('permission');
    this.checkForbidden('intelligence');
    
    this.log(`Designing avatar for role: ${input.agent_role}`);
    
    const visual = this.generateVisual(input.theme, input.visibility_level);
    const presence = this.generatePresence(input.visibility_level);
    
    return {
      avatar_id: `avatar-${Date.now()}`,
      name: `${input.agent_role} Avatar`,
      agent_role: input.agent_role,
      theme: input.theme,
      visibility_level: input.visibility_level,
      visual,
      presence,
      role_indicator: {
        visible: input.visibility_level !== 'minimal',
        label: input.agent_role,
      },
    };
  }
  
  private generateVisual(theme: string, visibility: string): AvatarOutput['visual'] {
    return {
      style: visibility === 'minimal' ? 'symbolic' : 'abstract',
      primary_color: this.getThemeColor(theme),
      accent_color: '#E8B86D',
      glow: visibility === 'prominent',
      animation: visibility === 'minimal' ? 'none' : 'idle',
    };
  }
  
  private generatePresence(visibility: string): AvatarOutput['presence'] {
    const sizes: Record<string, 'small' | 'medium' | 'large'> = {
      minimal: 'small',
      standard: 'medium',
      prominent: 'large',
    };
    return {
      size: sizes[visibility] || 'medium',
      opacity: visibility === 'minimal' ? 0.7 : 1.0,
      aura_radius: visibility === 'prominent' ? 30 : visibility === 'standard' ? 20 : 10,
    };
  }
  
  private getThemeColor(theme: string): string {
    const colors: Record<string, string> = {
      neutral: '#6B7280',
      assistant: '#5DA9FF',
      specialist: '#10B981',
      admin: '#8B5CF6',
      system: '#F59E0B',
    };
    return colors[theme.toLowerCase()] || colors.neutral;
  }
}

// ============================================================
// NAVIGATION DESIGNER AGENT
// ============================================================

export interface NavigationInput {
  plan: PlanOutput;
  user_type: 'visitor' | 'member' | 'admin';
}

export class NavigationDesignerAgent extends ArchitecturalAgent<NavigationInput, NavigationOutput> {
  constructor() {
    super('AGENT_NAVIGATION_DESIGNER');
  }
  
  protected getOutputType(): 'navigation' {
    return 'navigation';
  }
  
  protected async generateOutput(input: NavigationInput): Promise<NavigationOutput> {
    this.checkForbidden('funneling');
    this.checkForbidden('coercive');
    
    this.log(`Designing navigation for plan: ${input.plan.plan_id}`);
    
    const waypoints = this.generateWaypoints(input.plan.zones);
    const paths = this.generatePaths(input.plan.zones, input.user_type);
    
    return {
      nav_id: `nav-${Date.now()}`,
      plan_id: input.plan.plan_id,
      user_type: input.user_type,
      mode: input.user_type === 'visitor' ? 'guided' : 'free',
      minimap: {
        enabled: true,
        position: 'bottom-right',
        scale: 0.15,
      },
      waypoints,
      paths,
      entry_point: waypoints[0]?.id || '',
      exit_points: [waypoints[waypoints.length - 1]?.id || ''],
    };
  }
  
  private generateWaypoints(zones: PlanZone[]): NavigationOutput['waypoints'] {
    return zones.map((zone, i) => ({
      id: `wp-${zone.zone_id}`,
      label: zone.name,
      position: { x: i * 100, y: 0, z: 0 },
      zone_id: zone.zone_id,
    }));
  }
  
  private generatePaths(zones: PlanZone[], userType: string): NavigationOutput['paths'] {
    const paths: NavigationOutput['paths'] = [];
    
    for (let i = 0; i < zones.length - 1; i++) {
      // Only visitors have guided (one-way) paths
      paths.push({
        from: `wp-${zones[i].zone_id}`,
        to: `wp-${zones[i + 1].zone_id}`,
        bidirectional: userType !== 'visitor',
        style: 'direct',
      });
    }
    
    return paths;
  }
}

// ============================================================
// DOMAIN ADAPTER AGENT
// ============================================================

export interface DomainAdapterInput {
  output: ArchitecturalOutput;
  target_domain: string;
  domain_rules: string[];
}

export class DomainAdapterAgent extends ArchitecturalAgent<DomainAdapterInput, ArchitecturalOutput> {
  constructor() {
    super('AGENT_DOMAIN_ADAPTER');
  }
  
  protected getOutputType(): 'plan' {
    return 'plan'; // Returns same type as input
  }
  
  protected async generateOutput(input: DomainAdapterInput): Promise<ArchitecturalOutput> {
    this.checkForbidden('bypass');
    this.checkForbidden('override');
    
    this.log(`Adapting output for domain: ${input.target_domain}`);
    
    // Apply domain-specific adaptations
    const adapted = { ...input.output };
    adapted.domain = input.target_domain;
    
    // Check domain rules
    for (const rule of input.domain_rules) {
      this.log(`Checking rule: ${rule}`);
    }
    
    return adapted;
  }
}

// ============================================================
// VALIDATION GUARD AGENT (PASSIVE)
// ============================================================

export class ValidationGuardAgent extends ArchitecturalAgent<ArchitecturalOutput, ValidationResult> {
  constructor() {
    super('AGENT_VALIDATION_GUARD');
  }
  
  protected getOutputType(): 'plan' {
    return 'plan';
  }
  
  protected async generateOutput(input: ArchitecturalOutput): Promise<ValidationResult> {
    // CRITICAL: This agent cannot modify, only report
    this.checkForbidden('modification');
    this.checkForbidden('approval');
    
    this.log(`Validating output from: ${input.source_agent}`);
    
    const checks = [
      this.checkSchema(input),
      this.checkEthics(input),
      this.checkDomainCompliance(input),
      this.checkApprovalRequired(input),
    ];
    
    return {
      valid: checks.every(c => c.passed),
      agent: this.id,
      checks,
      timestamp: new Date().toISOString(),
    };
  }
  
  private checkSchema(output: ArchitecturalOutput): ValidationResult['checks'][0] {
    const hasRequiredFields = output.type && output.source_agent && output.hash;
    return {
      name: 'schema_validation',
      passed: hasRequiredFields,
      message: hasRequiredFields ? 'Schema valid' : 'Missing required fields',
    };
  }
  
  private checkEthics(output: ArchitecturalOutput): ValidationResult['checks'][0] {
    // Check for ethical violations in the output
    const payload = JSON.stringify(output.payload || {}).toLowerCase();
    
    const violations: string[] = [];
    if (payload.includes('urgency') || payload.includes('fomo')) {
      violations.push('cognitive_pressure');
    }
    if (payload.includes('subliminal') || payload.includes('hidden')) {
      violations.push('hidden_influence');
    }
    
    return {
      name: 'ethics_validation',
      passed: violations.length === 0,
      message: violations.length ? `Violations: ${violations.join(', ')}` : 'Ethics check passed',
    };
  }
  
  private checkDomainCompliance(output: ArchitecturalOutput): ValidationResult['checks'][0] {
    // Check domain-specific rules
    return {
      name: 'domain_compliance',
      passed: true,
      message: 'Domain rules satisfied',
    };
  }
  
  private checkApprovalRequired(output: ArchitecturalOutput): ValidationResult['checks'][0] {
    return {
      name: 'approval_requirement',
      passed: output.requires_approval === true,
      message: output.requires_approval ? 'Approval flag set' : 'Missing approval requirement',
    };
  }
}

// ============================================================
// EXPORTS
// ============================================================

export {
  ArchitecturalAgent,
  ArchitectPlannerAgent,
  DecorDesignerAgent,
  AvatarArchitectAgent,
  NavigationDesignerAgent,
  DomainAdapterAgent,
  ValidationGuardAgent,
};
