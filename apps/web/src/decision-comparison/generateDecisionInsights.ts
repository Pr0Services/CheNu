/* =====================================================
   CHE·NU — Generate Decision Insights
   
   Generates actionable insights from decision analysis.
   Identifies patterns, warnings, and recommendations.
   ===================================================== */

import {
  DecisionNode,
  DecisionCluster,
  DecisionInsight,
  DecisionPattern,
  DecisionType,
  ComparisonConfig,
  DEFAULT_COMPARISON_CONFIG,
} from './decisionComparison.types';

// ─────────────────────────────────────────────────────
// MAIN INSIGHTS GENERATION
// ─────────────────────────────────────────────────────

/**
 * Generate insights from decision nodes and clusters.
 */
export function generateDecisionInsights(
  nodes: DecisionNode[],
  clusters: DecisionCluster[],
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG
): DecisionInsight[] {
  const insights: DecisionInsight[] = [];
  let insightId = 0;

  const createInsight = (
    type: DecisionInsight['type'],
    severity: DecisionInsight['severity'],
    title: string,
    description: string,
    relatedDecisions: string[] = [],
    actionable: boolean = false,
    suggestedAction?: string
  ): DecisionInsight => ({
    id: `insight_${++insightId}`,
    type,
    severity,
    title,
    description,
    relatedDecisions,
    actionable,
    suggestedAction,
  });

  // === CLUSTER-BASED INSIGHTS ===

  if (clusters.length > 1) {
    insights.push(createInsight(
      'observation',
      'info',
      'Patterns de décision multiples',
      `${clusters.length} groupes de décisions distincts ont été identifiés, suggérant différentes approches selon le contexte.`,
      clusters.flatMap(c => c.decisionIds.slice(0, 2))
    ));
  }

  // Low cohesion clusters
  const lowCohesionClusters = clusters.filter(c => c.cohesionScore < 0.5);
  if (lowCohesionClusters.length > 0) {
    lowCohesionClusters.forEach(cluster => {
      insights.push(createInsight(
        'warning',
        'medium',
        `Cluster hétérogène: ${cluster.name}`,
        `Ce groupe contient des décisions variées (cohésion: ${Math.round(cluster.cohesionScore * 100)}%). Considérer une segmentation plus fine.`,
        cluster.decisionIds.slice(0, 3),
        true,
        'Examiner les décisions de ce groupe pour identifier les sous-catégories'
      ));
    });
  }

  // === IMPACT-BASED INSIGHTS ===

  const highImpact = nodes.filter(d => d.impact === 'high');
  if (highImpact.length > 0) {
    insights.push(createInsight(
      'observation',
      'info',
      'Décisions à fort impact',
      `${highImpact.length} décision(s) ont généré un nombre élevé de conséquences. Ces décisions méritent une attention particulière.`,
      highImpact.map(d => d.decisionId),
      true,
      'Documenter les facteurs de succès de ces décisions'
    ));
  }

  // Low impact warnings
  const lowImpact = nodes.filter(d => d.impact === 'low' && d.consequenceCount === 0);
  if (lowImpact.length > nodes.length * 0.3) {
    insights.push(createInsight(
      'warning',
      'medium',
      'Décisions sans suivi',
      `${lowImpact.length} décision(s) n'ont généré aucune conséquence enregistrée. Vérifier si les actions ont été mises en œuvre.`,
      lowImpact.map(d => d.decisionId),
      true,
      'Revoir le processus de suivi des décisions'
    ));
  }

  // === COMPLEXITY INSIGHTS ===

  const complexDecisions = nodes.filter(d => d.complexity === 'complex');
  if (complexDecisions.length > nodes.length * 0.4) {
    insights.push(createInsight(
      'warning',
      'high',
      'Proportion élevée de décisions complexes',
      `${Math.round(complexDecisions.length / nodes.length * 100)}% des décisions sont complexes. Cela peut ralentir le processus décisionnel.`,
      complexDecisions.slice(0, 5).map(d => d.decisionId),
      true,
      'Envisager de déléguer ou découper les décisions complexes'
    ));
  }

  // Simple decisions with high consequences
  const simpleHighImpact = nodes.filter(
    d => d.complexity === 'simple' && d.consequenceCount > 5
  );
  if (simpleHighImpact.length > 0) {
    insights.push(createInsight(
      'pattern',
      'info',
      'Décisions simples à fort effet de levier',
      `${simpleHighImpact.length} décision(s) simple(s) ont généré beaucoup de conséquences. Ce sont des leviers d'action efficaces.`,
      simpleHighImpact.map(d => d.decisionId),
      true,
      'Identifier et reproduire ces patterns de décision efficaces'
    ));
  }

  // === AGENT INSIGHTS ===

  const agentCounts = new Map<string, number>();
  nodes.forEach(d => {
    d.agentsInvolved.forEach(a => {
      agentCounts.set(a, (agentCounts.get(a) || 0) + 1);
    });
  });

  // Dominant agent
  let maxAgent = '';
  let maxCount = 0;
  agentCounts.forEach((count, agent) => {
    if (count > maxCount) {
      maxCount = count;
      maxAgent = agent;
    }
  });

  if (maxAgent && maxCount > nodes.length * 0.5) {
    insights.push(createInsight(
      'observation',
      'info',
      'Agent dominant',
      `L'agent "${maxAgent}" est impliqué dans ${Math.round(maxCount / nodes.length * 100)}% des décisions. Vérifier l'équilibre des contributions.`,
      nodes.filter(d => d.agentsInvolved.includes(maxAgent)).map(d => d.decisionId).slice(0, 3)
    ));
  }

  // Isolated agents
  const isolatedAgents = Array.from(agentCounts.entries())
    .filter(([_, count]) => count === 1)
    .map(([agent]) => agent);

  if (isolatedAgents.length > 0 && isolatedAgents.length > agentCounts.size * 0.5) {
    insights.push(createInsight(
      'warning',
      'low',
      'Agents peu impliqués',
      `${isolatedAgents.length} agent(s) n'ont participé qu'à une seule décision. Considérer une meilleure répartition.`,
      [],
      true,
      'Revoir les rôles et responsabilités des agents'
    ));
  }

  // === TYPE-BASED INSIGHTS ===

  const typeCounts = new Map<DecisionType, number>();
  nodes.forEach(d => {
    typeCounts.set(d.decisionType, (typeCounts.get(d.decisionType) || 0) + 1);
  });

  // Too many corrective decisions
  const correctiveCount = typeCounts.get('corrective') || 0;
  if (correctiveCount > nodes.length * 0.3) {
    insights.push(createInsight(
      'warning',
      'high',
      'Proportion élevée de décisions correctives',
      `${Math.round(correctiveCount / nodes.length * 100)}% des décisions sont correctives, suggérant des problèmes récurrents.`,
      nodes.filter(d => d.decisionType === 'corrective').map(d => d.decisionId).slice(0, 3),
      true,
      'Analyser les causes profondes des problèmes nécessitant des corrections'
    ));
  }

  // Few strategic decisions
  const strategicCount = typeCounts.get('strategic') || 0;
  if (strategicCount === 0 && nodes.length > 5) {
    insights.push(createInsight(
      'observation',
      'low',
      'Absence de décisions stratégiques',
      'Aucune décision stratégique n\'a été identifiée. Vérifier si la vision à long terme est suffisamment adressée.',
      [],
      true,
      'Planifier des sessions de réflexion stratégique'
    ));
  }

  // === TIMING INSIGHTS ===

  if (nodes.length > 1) {
    const timestamps = nodes.map(d => d.timestamp).sort((a, b) => a - b);
    const gaps: number[] = [];
    for (let i = 1; i < timestamps.length; i++) {
      gaps.push(timestamps[i] - timestamps[i - 1]);
    }

    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const maxGap = Math.max(...gaps);

    if (maxGap > avgGap * 3) {
      insights.push(createInsight(
        'observation',
        'low',
        'Période d\'inactivité détectée',
        `Une période de ${Math.round(maxGap / 60000)} minutes sans décision a été détectée.`,
        []
      ));
    }

    // Burst of decisions
    const shortGaps = gaps.filter(g => g < avgGap * 0.2);
    if (shortGaps.length > gaps.length * 0.3) {
      insights.push(createInsight(
        'warning',
        'medium',
        'Rafale de décisions',
        'Plusieurs décisions ont été prises en succession rapide. Vérifier qu\'elles ont reçu l\'attention nécessaire.',
        [],
        true,
        'Espacer les décisions importantes pour permettre une analyse approfondie'
      ));
    }
  }

  // Limit insights
  return insights.slice(0, config.maxInsights);
}

// ─────────────────────────────────────────────────────
// PATTERN DETECTION
// ─────────────────────────────────────────────────────

/**
 * Detect patterns in decision sequences.
 */
export function detectDecisionPatterns(
  nodes: DecisionNode[]
): DecisionPattern[] {
  const patterns: DecisionPattern[] = [];
  let patternId = 0;

  // Pattern 1: Type sequences
  const typeSequences = detectTypeSequences(nodes);
  typeSequences.forEach(seq => {
    patterns.push({
      id: `pattern_${++patternId}`,
      name: `Séquence: ${seq.types.join(' → ')}`,
      description: `Les décisions de type ${seq.types[0]} sont souvent suivies de ${seq.types[1]}`,
      frequency: seq.count,
      decisionIds: seq.decisionIds,
      confidence: seq.count / Math.max(nodes.length - 1, 1),
    });
  });

  // Pattern 2: Agent collaboration
  const collabPatterns = detectAgentCollaboration(nodes);
  collabPatterns.forEach(collab => {
    patterns.push({
      id: `pattern_${++patternId}`,
      name: `Collaboration: ${collab.agents.join(' + ')}`,
      description: `Ces agents travaillent fréquemment ensemble`,
      frequency: collab.count,
      decisionIds: collab.decisionIds,
      confidence: collab.count / nodes.length,
    });
  });

  // Pattern 3: Context-to-impact correlation
  const impactPatterns = detectImpactPatterns(nodes);
  impactPatterns.forEach(imp => {
    patterns.push({
      id: `pattern_${++patternId}`,
      name: imp.name,
      description: imp.description,
      frequency: imp.count,
      decisionIds: imp.decisionIds,
      confidence: imp.confidence,
    });
  });

  return patterns;
}

function detectTypeSequences(nodes: DecisionNode[]): Array<{
  types: [DecisionType, DecisionType];
  count: number;
  decisionIds: string[];
}> {
  const sequences = new Map<string, { count: number; decisionIds: string[] }>();

  const sorted = [...nodes].sort((a, b) => a.timestamp - b.timestamp);

  for (let i = 0; i < sorted.length - 1; i++) {
    const key = `${sorted[i].decisionType}→${sorted[i + 1].decisionType}`;
    const existing = sequences.get(key) || { count: 0, decisionIds: [] };
    existing.count++;
    existing.decisionIds.push(sorted[i].decisionId, sorted[i + 1].decisionId);
    sequences.set(key, existing);
  }

  return Array.from(sequences.entries())
    .filter(([_, v]) => v.count >= 2)
    .map(([key, v]) => ({
      types: key.split('→') as [DecisionType, DecisionType],
      count: v.count,
      decisionIds: [...new Set(v.decisionIds)],
    }));
}

function detectAgentCollaboration(nodes: DecisionNode[]): Array<{
  agents: string[];
  count: number;
  decisionIds: string[];
}> {
  const collabs = new Map<string, { count: number; decisionIds: string[] }>();

  nodes.forEach(node => {
    if (node.agentsInvolved.length >= 2) {
      const sorted = [...node.agentsInvolved].sort();
      for (let i = 0; i < sorted.length - 1; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const key = `${sorted[i]}+${sorted[j]}`;
          const existing = collabs.get(key) || { count: 0, decisionIds: [] };
          existing.count++;
          existing.decisionIds.push(node.decisionId);
          collabs.set(key, existing);
        }
      }
    }
  });

  return Array.from(collabs.entries())
    .filter(([_, v]) => v.count >= 2)
    .map(([key, v]) => ({
      agents: key.split('+'),
      count: v.count,
      decisionIds: v.decisionIds,
    }));
}

function detectImpactPatterns(nodes: DecisionNode[]): Array<{
  name: string;
  description: string;
  count: number;
  decisionIds: string[];
  confidence: number;
}> {
  const patterns: Array<{
    name: string;
    description: string;
    count: number;
    decisionIds: string[];
    confidence: number;
  }> = [];

  // High context → high impact
  const highContextHighImpact = nodes.filter(
    n => n.contextSize > 5 && n.impact === 'high'
  );
  if (highContextHighImpact.length >= 2) {
    patterns.push({
      name: 'Contexte riche → Fort impact',
      description: 'Les décisions avec beaucoup de contexte génèrent un fort impact',
      count: highContextHighImpact.length,
      decisionIds: highContextHighImpact.map(n => n.decisionId),
      confidence: highContextHighImpact.length / nodes.filter(n => n.contextSize > 5).length || 0,
    });
  }

  // Complex → many agents
  const complexMultiAgent = nodes.filter(
    n => n.complexity === 'complex' && n.agentsInvolved.length >= 3
  );
  if (complexMultiAgent.length >= 2) {
    patterns.push({
      name: 'Complexité → Multi-agents',
      description: 'Les décisions complexes impliquent plusieurs agents',
      count: complexMultiAgent.length,
      decisionIds: complexMultiAgent.map(n => n.decisionId),
      confidence: complexMultiAgent.length / nodes.filter(n => n.complexity === 'complex').length || 0,
    });
  }

  return patterns;
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default generateDecisionInsights;
