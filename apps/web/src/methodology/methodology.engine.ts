/* =====================================================
   CHE·NU — METHODOLOGY AGENT ENGINE
   Version: 1.0
   Scope: Methodology / Observation / Advisory
   
   📜 CORE PRINCIPLE:
   The Methodology Agent NEVER optimizes humans.
   It ONLY observes flows, compares them to existing methodologies,
   and suggests structured adjustments that a human may adopt or ignore.
   
   📜 THREE ROLES:
   1) Observer — Reads replays, describes patterns
   2) Advisor — Maps patterns to methodologies, explains tradeoffs
   3) Documenter — Creates reusable snippets
   ===================================================== */

import {
  type MethodologyAgentRole,
  type MethodologyAgentInput,
  type AnyMethodologyAgentOutput,
  type MethodologyObserverOutput,
  type MethodologyAdvisorOutput,
  type MethodologyDocumenterOutput,
  type MethodologyInsight,
  type MethodologyPattern,
  type MethodologyProposal,
  type MethodologySnippet,
  type MethodologyReplaySummary,
  type MethodologyContext,
  type SnippetUpdateSuggestion,
  INSIGHT_THRESHOLDS,
  METHODOLOGY_AGENT_VERSION,
} from './methodology.types';

/* =========================================================
   METHODOLOGY AGENT ENGINE
   ========================================================= */

export class MethodologyAgentEngine {
  private readonly version = METHODOLOGY_AGENT_VERSION;

  /**
   * Execute methodology agent with given input.
   */
  async execute(input: MethodologyAgentInput): Promise<AnyMethodologyAgentOutput> {
    const startTime = performance.now();

    let output: AnyMethodologyAgentOutput;

    switch (input.role) {
      case 'observer':
        output = await this.executeObserver(input);
        break;
      case 'advisor':
        output = await this.executeAdvisor(input);
        break;
      case 'documenter':
        output = await this.executeDocumenter(input);
        break;
      default:
        throw new Error(`Unknown methodology role: ${input.role}`);
    }

    output.processingTimeMs = Math.round(performance.now() - startTime);
    return output;
  }

  /* -----------------------------------------
     OBSERVER ROLE
  ----------------------------------------- */

  private async executeObserver(
    input: MethodologyAgentInput
  ): Promise<MethodologyObserverOutput> {
    const observations: MethodologyInsight[] = [];
    const suggestedPatterns: MethodologyPattern[] = [];
    const uncertaintyNotes: string[] = [];

    const summary = input.replaySummary;

    if (!summary) {
      uncertaintyNotes.push('No replay summary provided — observations limited');
      return this.createObserverOutput(observations, suggestedPatterns, uncertaintyNotes);
    }

    // Analyze for insights
    observations.push(...this.analyzeReplaySummary(summary));

    // Detect patterns from insights
    suggestedPatterns.push(...this.detectPatterns(observations));

    // Add uncertainty notes
    if (summary.eventsCount < 10) {
      uncertaintyNotes.push('Low event count — patterns may not be representative');
    }
    if (!summary.averageDecisionDelayMs) {
      uncertaintyNotes.push('Decision delay data unavailable');
    }

    return this.createObserverOutput(observations, suggestedPatterns, uncertaintyNotes);
  }

  private analyzeReplaySummary(summary: MethodologyReplaySummary): MethodologyInsight[] {
    const insights: MethodologyInsight[] = [];

    // High guard density
    if (summary.eventsCount > 0) {
      const guardRatio = summary.guardTriggerCount / summary.eventsCount;
      if (guardRatio > INSIGHT_THRESHOLDS.highGuardDensity / 10) {
        insights.push({
          id: `insight-guard-${Date.now()}`,
          type: 'high_guard_density',
          description: `High guard trigger rate: ${summary.guardTriggerCount} triggers in ${summary.eventsCount} events (${(guardRatio * 100).toFixed(1)}%)`,
          severity: guardRatio > 0.5 ? 'high' : 'medium',
          evidence: [
            `Guard triggers: ${summary.guardTriggerCount}`,
            `Total events: ${summary.eventsCount}`,
          ],
        });
      }
    }

    // Frequent rollbacks
    if (summary.rollbackCount && summary.rollbackCount >= INSIGHT_THRESHOLDS.frequentRollback) {
      insights.push({
        id: `insight-rollback-${Date.now()}`,
        type: 'frequent_rollback',
        description: `Frequent rollbacks detected: ${summary.rollbackCount} rollbacks in session`,
        severity: summary.rollbackCount > 10 ? 'high' : 'medium',
        evidence: [`Rollback count: ${summary.rollbackCount}`],
      });
    }

    // Long decision delay
    if (
      summary.averageDecisionDelayMs &&
      summary.averageDecisionDelayMs > INSIGHT_THRESHOLDS.longDecisionDelay
    ) {
      insights.push({
        id: `insight-delay-${Date.now()}`,
        type: 'long_decision_delay',
        description: `Average decision delay is ${Math.round(summary.averageDecisionDelayMs / 1000)}s — may indicate complexity or hesitation`,
        severity: summary.averageDecisionDelayMs > 60000 ? 'high' : 'medium',
        evidence: [`Average delay: ${summary.averageDecisionDelayMs}ms`],
      });
    }

    // Agent imbalance
    if (
      summary.uniqueAgentsCount &&
      summary.eventsCount > 0 &&
      summary.uniqueAgentsCount === 1 &&
      summary.eventsCount > 20
    ) {
      insights.push({
        id: `insight-agents-${Date.now()}`,
        type: 'unused_agents',
        description: 'Only one agent active despite significant event count — other agents may be underutilized',
        severity: 'low',
        evidence: [
          `Unique agents: ${summary.uniqueAgentsCount}`,
          `Event count: ${summary.eventsCount}`,
        ],
      });
    }

    // Low human engagement
    if (
      summary.humanInputCount !== undefined &&
      summary.eventsCount > 0 &&
      summary.humanInputCount / summary.eventsCount < 0.05
    ) {
      insights.push({
        id: `insight-human-${Date.now()}`,
        type: 'low_human_engagement',
        description: 'Low human input ratio — system may be running with minimal human oversight',
        severity: 'medium',
        evidence: [
          `Human inputs: ${summary.humanInputCount}`,
          `Total events: ${summary.eventsCount}`,
        ],
      });
    }

    return insights;
  }

  private detectPatterns(insights: MethodologyInsight[]): MethodologyPattern[] {
    const patterns: MethodologyPattern[] = [];

    // Pattern: Decision friction
    const hasDelays = insights.some((i) => i.type === 'long_decision_delay');
    const hasRollbacks = insights.some((i) => i.type === 'frequent_rollback');
    if (hasDelays || hasRollbacks) {
      patterns.push({
        name: 'Decision Friction',
        description: 'The decision-making process shows signs of friction — delays or reversals may indicate unclear criteria or missing information.',
        evidence: insights
          .filter((i) => i.type === 'long_decision_delay' || i.type === 'frequent_rollback')
          .map((i) => i.description),
        frequency: hasDelays && hasRollbacks ? 'frequent' : 'occasional',
        confidence: 'medium',
        relatedInsights: ['long_decision_delay', 'frequent_rollback'],
      });
    }

    // Pattern: Guard overload
    const hasHighGuards = insights.some((i) => i.type === 'high_guard_density');
    if (hasHighGuards) {
      patterns.push({
        name: 'Guard Overload',
        description: 'High frequency of guard triggers may indicate overly strict constraints or a mismatch between workflow and rules.',
        evidence: insights
          .filter((i) => i.type === 'high_guard_density')
          .map((i) => i.description),
        frequency: 'frequent',
        confidence: 'high',
        relatedInsights: ['high_guard_density'],
      });
    }

    // Pattern: Autonomous drift
    const hasLowHuman = insights.some((i) => i.type === 'low_human_engagement');
    if (hasLowHuman) {
      patterns.push({
        name: 'Autonomous Drift',
        description: 'The system operates with minimal human input — may be intentional or may indicate disengagement.',
        evidence: insights
          .filter((i) => i.type === 'low_human_engagement')
          .map((i) => i.description),
        frequency: 'constant',
        confidence: 'medium',
        relatedInsights: ['low_human_engagement'],
      });
    }

    return patterns;
  }

  private createObserverOutput(
    observations: MethodologyInsight[],
    suggestedPatterns: MethodologyPattern[],
    uncertaintyNotes: string[]
  ): MethodologyObserverOutput {
    return {
      role: 'observer',
      summary: `Observed ${observations.length} insights and ${suggestedPatterns.length} patterns`,
      uncertaintyNotes,
      requiresHumanValidation: true,
      timestamp: Date.now(),
      observations,
      suggestedPatterns,
    };
  }

  /* -----------------------------------------
     ADVISOR ROLE
  ----------------------------------------- */

  private async executeAdvisor(
    input: MethodologyAgentInput
  ): Promise<MethodologyAdvisorOutput> {
    const proposedMethodologies: MethodologyProposal[] = [];
    const comparisonNotes: string[] = [];
    const uncertaintyNotes: string[] = [];

    const patterns = input.existingPatterns || [];
    const insights = input.insights || [];

    if (patterns.length === 0 && insights.length === 0) {
      uncertaintyNotes.push('No patterns or insights provided — proposals are generic');
    }

    // Generate proposals based on patterns
    proposedMethodologies.push(...this.generateProposals(patterns, insights));

    // Add comparison notes
    if (proposedMethodologies.length > 1) {
      comparisonNotes.push(...this.compareProposals(proposedMethodologies));
    }

    // Add uncertainty
    uncertaintyNotes.push(
      'All proposals are suggestions — human judgment should determine applicability'
    );

    return this.createAdvisorOutput(proposedMethodologies, comparisonNotes, uncertaintyNotes);
  }

  private generateProposals(
    patterns: MethodologyPattern[],
    insights: MethodologyInsight[]
  ): MethodologyProposal[] {
    const proposals: MethodologyProposal[] = [];

    // Check for decision friction pattern
    const hasDecisionFriction = patterns.some((p) => p.name === 'Decision Friction');
    if (hasDecisionFriction) {
      proposals.push({
        id: `proposal-structured-${Date.now()}`,
        label: 'Structured Decision Framework',
        description: 'Add explicit decision criteria and checkpoints to reduce ambiguity.',
        steps: [
          'Define clear decision criteria before starting',
          'Use parallel analysis to gather perspectives first',
          'Create explicit validation checkpoints',
          'Document decision rationale for future reference',
        ],
        bestFor: [
          'Complex decisions with multiple stakeholders',
          'Recurring decision types',
          'Teams needing consistency',
        ],
        tradeoffs: {
          tokens: 'higher',
          time: 'shorter',
          cognitiveLoad: 'lower',
        },
        requiresHumanValidation: true,
        relatedPatterns: ['Decision Friction'],
        confidence: 'medium',
      });
    }

    // Check for guard overload pattern
    const hasGuardOverload = patterns.some((p) => p.name === 'Guard Overload');
    if (hasGuardOverload) {
      proposals.push({
        id: `proposal-relaxed-${Date.now()}`,
        label: 'Guard Calibration Review',
        description: 'Review guard thresholds to balance safety with workflow efficiency.',
        steps: [
          'Audit current guard triggers',
          'Identify false positives',
          'Adjust thresholds incrementally',
          'Monitor for one cycle before further changes',
        ],
        bestFor: [
          'Mature workflows with established patterns',
          'Teams comfortable with measured risk',
          'High-velocity projects',
        ],
        tradeoffs: {
          tokens: 'same',
          time: 'shorter',
          cognitiveLoad: 'lower',
        },
        requiresHumanValidation: true,
        relatedPatterns: ['Guard Overload'],
        confidence: 'medium',
      });
    }

    // Check for autonomous drift pattern
    const hasAutonomousDrift = patterns.some((p) => p.name === 'Autonomous Drift');
    if (hasAutonomousDrift) {
      proposals.push({
        id: `proposal-engagement-${Date.now()}`,
        label: 'Human Engagement Checkpoints',
        description: 'Add periodic human validation points to maintain oversight.',
        steps: [
          'Define milestone-based checkpoints',
          'Require human confirmation for key decisions',
          'Add summary notifications at intervals',
          'Create dashboard for quick status review',
        ],
        bestFor: [
          'Critical workflows requiring oversight',
          'Compliance-sensitive domains',
          'Learning/onboarding phases',
        ],
        tradeoffs: {
          tokens: 'higher',
          time: 'longer',
          cognitiveLoad: 'higher',
        },
        requiresHumanValidation: true,
        relatedPatterns: ['Autonomous Drift'],
        confidence: 'high',
      });
    }

    // Default proposal if no specific patterns
    if (proposals.length === 0) {
      proposals.push({
        id: `proposal-baseline-${Date.now()}`,
        label: 'Baseline Methodology Review',
        description: 'Conduct a comprehensive review of current workflow patterns.',
        steps: [
          'Run observation cycle for 1 week',
          'Collect insights from all agent roles',
          'Identify top 3 friction points',
          'Propose targeted adjustments',
        ],
        bestFor: [
          'New projects without established patterns',
          'Teams seeking optimization opportunities',
          'Periodic methodology audits',
        ],
        tradeoffs: {
          tokens: 'unknown',
          time: 'unknown',
          cognitiveLoad: 'lower',
        },
        requiresHumanValidation: true,
        confidence: 'low',
      });
    }

    return proposals;
  }

  private compareProposals(proposals: MethodologyProposal[]): string[] {
    const notes: string[] = [];

    // Compare token usage
    const tokenLevels = proposals.map((p) => p.tradeoffs.tokens);
    if (tokenLevels.includes('higher') && tokenLevels.includes('lower')) {
      notes.push('Proposals vary in token usage — consider budget constraints');
    }

    // Compare time impact
    const timeLevels = proposals.map((p) => p.tradeoffs.time);
    if (timeLevels.includes('longer') && timeLevels.includes('shorter')) {
      notes.push('Proposals vary in time impact — balance speed vs thoroughness');
    }

    // Compare cognitive load
    const loadLevels = proposals.map((p) => p.tradeoffs.cognitiveLoad);
    if (loadLevels.includes('higher') && loadLevels.includes('lower')) {
      notes.push('Proposals vary in cognitive load — consider team capacity');
    }

    return notes;
  }

  private createAdvisorOutput(
    proposedMethodologies: MethodologyProposal[],
    comparisonNotes: string[],
    uncertaintyNotes: string[]
  ): MethodologyAdvisorOutput {
    return {
      role: 'advisor',
      summary: `Generated ${proposedMethodologies.length} methodology proposals`,
      uncertaintyNotes,
      requiresHumanValidation: true,
      timestamp: Date.now(),
      proposedMethodologies,
      comparisonNotes,
    };
  }

  /* -----------------------------------------
     DOCUMENTER ROLE
  ----------------------------------------- */

  private async executeDocumenter(
    input: MethodologyAgentInput
  ): Promise<MethodologyDocumenterOutput> {
    const newSnippets: MethodologySnippet[] = [];
    const updateSuggestions: SnippetUpdateSuggestion[] = [];
    const uncertaintyNotes: string[] = [];

    const existingSnippets = input.existingSnippets || [];
    const patterns = input.existingPatterns || [];

    // Generate new snippets from patterns
    for (const pattern of patterns) {
      const existingSnippet = existingSnippets.find(
        (s) => s.title.toLowerCase().includes(pattern.name.toLowerCase())
      );

      if (existingSnippet) {
        // Suggest update to existing snippet
        updateSuggestions.push({
          snippetId: existingSnippet.id,
          reason: `Pattern "${pattern.name}" has new evidence`,
          suggestedChange: `Add evidence: ${pattern.evidence.join(', ')}`,
          section: 'narrative',
        });
      } else {
        // Create new snippet
        newSnippets.push(this.createSnippetFromPattern(pattern));
      }
    }

    uncertaintyNotes.push(
      'Snippets are drafts — human review and editing recommended before use'
    );

    return this.createDocumenterOutput(newSnippets, updateSuggestions, uncertaintyNotes);
  }

  private createSnippetFromPattern(pattern: MethodologyPattern): MethodologySnippet {
    return {
      id: `snippet-${pattern.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      title: pattern.name,
      narrative: pattern.description,
      whenToUse: this.inferWhenToUse(pattern),
      howToApply: this.inferHowToApply(pattern),
      limitations: this.inferLimitations(pattern),
      version: '1.0-draft',
      updatedAt: Date.now(),
      tags: pattern.relatedInsights || [],
    };
  }

  private inferWhenToUse(pattern: MethodologyPattern): string[] {
    switch (pattern.name) {
      case 'Decision Friction':
        return [
          'When decisions are taking longer than expected',
          'When frequent reversals occur',
          'When team members express uncertainty about criteria',
        ];
      case 'Guard Overload':
        return [
          'When guards trigger frequently without clear violations',
          'When workflow feels overly constrained',
          'When productivity is impacted by safety checks',
        ];
      case 'Autonomous Drift':
        return [
          'When human oversight needs reinforcement',
          'When compliance requirements increase',
          'When onboarding new team members',
        ];
      default:
        return ['When this pattern is observed', 'After validating applicability'];
    }
  }

  private inferHowToApply(pattern: MethodologyPattern): string[] {
    switch (pattern.name) {
      case 'Decision Friction':
        return [
          '1. Review decision criteria with stakeholders',
          '2. Identify unclear or missing criteria',
          '3. Create explicit decision framework',
          '4. Test with sample decisions',
          '5. Iterate based on feedback',
        ];
      case 'Guard Overload':
        return [
          '1. Audit guard trigger history',
          '2. Categorize triggers as true/false positives',
          '3. Propose threshold adjustments',
          '4. Get human approval for changes',
          '5. Monitor post-change behavior',
        ];
      case 'Autonomous Drift':
        return [
          '1. Define checkpoint intervals',
          '2. Create human validation requirements',
          '3. Implement notification system',
          '4. Train team on new checkpoints',
          '5. Review and adjust frequency',
        ];
      default:
        return [
          '1. Validate pattern applicability',
          '2. Design targeted intervention',
          '3. Test with small scope',
          '4. Expand based on results',
        ];
    }
  }

  private inferLimitations(pattern: MethodologyPattern): string[] {
    return [
      'This snippet is based on observed patterns and may not apply to all contexts',
      'Human judgment should override these suggestions when appropriate',
      'Effectiveness varies based on team composition and project type',
      `Confidence level: ${pattern.confidence || 'unknown'}`,
    ];
  }

  private createDocumenterOutput(
    newSnippets: MethodologySnippet[],
    updateSuggestions: SnippetUpdateSuggestion[],
    uncertaintyNotes: string[]
  ): MethodologyDocumenterOutput {
    return {
      role: 'documenter',
      summary: `Generated ${newSnippets.length} new snippets and ${updateSuggestions.length} update suggestions`,
      uncertaintyNotes,
      requiresHumanValidation: true,
      timestamp: Date.now(),
      newSnippets,
      updateSuggestions,
    };
  }
}

/* =========================================================
   SINGLETON INSTANCE
   ========================================================= */

let methodologyAgentInstance: MethodologyAgentEngine | null = null;

/**
 * Get singleton methodology agent engine.
 */
export function getMethodologyAgent(): MethodologyAgentEngine {
  if (!methodologyAgentInstance) {
    methodologyAgentInstance = new MethodologyAgentEngine();
  }
  return methodologyAgentInstance;
}

/* =========================================================
   CONVENIENCE FUNCTIONS
   ========================================================= */

/**
 * Run observer role.
 */
export async function runMethodologyObserver(
  context: MethodologyContext,
  replaySummary: MethodologyReplaySummary
): Promise<MethodologyObserverOutput> {
  const agent = getMethodologyAgent();
  const output = await agent.execute({
    role: 'observer',
    context,
    replaySummary,
  });
  return output as MethodologyObserverOutput;
}

/**
 * Run advisor role.
 */
export async function runMethodologyAdvisor(
  context: MethodologyContext,
  insights: MethodologyInsight[],
  patterns: MethodologyPattern[]
): Promise<MethodologyAdvisorOutput> {
  const agent = getMethodologyAgent();
  const output = await agent.execute({
    role: 'advisor',
    context,
    insights,
    existingPatterns: patterns,
  });
  return output as MethodologyAdvisorOutput;
}

/**
 * Run documenter role.
 */
export async function runMethodologyDocumenter(
  context: MethodologyContext,
  patterns: MethodologyPattern[],
  existingSnippets: MethodologySnippet[] = []
): Promise<MethodologyDocumenterOutput> {
  const agent = getMethodologyAgent();
  const output = await agent.execute({
    role: 'documenter',
    context,
    existingPatterns: patterns,
    existingSnippets,
  });
  return output as MethodologyDocumenterOutput;
}

/**
 * Run full methodology pipeline.
 */
export async function runFullMethodologyPipeline(
  context: MethodologyContext,
  replaySummary: MethodologyReplaySummary,
  existingSnippets: MethodologySnippet[] = []
): Promise<{
  observer: MethodologyObserverOutput;
  advisor: MethodologyAdvisorOutput;
  documenter: MethodologyDocumenterOutput;
}> {
  // Step 1: Observe
  const observer = await runMethodologyObserver(context, replaySummary);

  // Step 2: Advise based on observations
  const advisor = await runMethodologyAdvisor(
    context,
    observer.observations,
    observer.suggestedPatterns
  );

  // Step 3: Document
  const documenter = await runMethodologyDocumenter(
    context,
    observer.suggestedPatterns,
    existingSnippets
  );

  return { observer, advisor, documenter };
}
