/* =========================================
   CHE·NU — MANIFESTO COMPLIANCE CHECKER
   
   Vérifie que tous les modules respectent
   les principes du manifeste fondateur.
   
   📜 "Do not add features. Do not optimize behavior.
       Do not introduce domain assumptions.
       Your task is to reinforce clarity, direction, and continuity."
   ========================================= */

import { CONSTITUTION, CONSTITUTION_LAWS } from '../constitution';
import { PATHS, PATH_LAWS, PathType } from '../paths';

// ============================================
// MANIFESTO PRINCIPLES
// ============================================

export const MANIFESTO_PRINCIPLES = {
  HUMAN_IN_LOOP: 'No agent, automation, or algorithm may finalize decisions',
  TIMELINE_TRUTH: 'Timeline is append-only, no event deleted or rewritten',
  INTENTION_OVER_ACTION: 'Users move through intentional states, not screens',
  ROLLBACK_INTERPRETATION: 'Rewinding means changing the active reading point',
} as const;

export const MANIFESTO_CONSTRAINTS = {
  MAX_PRIMARY_PATHS: 4,
  DESTRUCTIVE_UNDO: false,
  AUTONOMOUS_AGENTS: false,
  DOMAIN_SPECIFIC_CORE: false,
  DEEP_NAVIGATION: false,
} as const;

export const SUCCESS_CRITERIA = {
  USER_KNOWS_POSITION: 'User always knows where they are',
  SAFE_EXPLORATION: 'Exploration feels safe',
  ACCOUNTABLE_DECISIONS: 'Decisions feel accountable',
  COMPLETE_CLOSE: 'Closing the app feels complete',
  EFFORTLESS_RESUME: 'Resuming feels effortless',
} as const;

// ============================================
// COMPLIANCE CHECKS
// ============================================

export interface ComplianceCheck {
  name: string;
  principle: string;
  passed: boolean;
  details: string;
}

export interface ManifestoCompliance {
  compliant: boolean;
  score: number;
  checks: ComplianceCheck[];
  summary: string;
}

/**
 * Vérifier la conformité au manifeste
 */
export function checkManifestoCompliance(): ManifestoCompliance {
  const checks: ComplianceCheck[] = [];
  
  // === PRINCIPLE 1: Human-in-the-loop ===
  checks.push({
    name: 'Constitution Human Loop',
    principle: MANIFESTO_PRINCIPLES.HUMAN_IN_LOOP,
    passed: CONSTITUTION.principles.humanInTheLoop === true,
    details: 'Constitution enforces humanInTheLoop: true',
  });
  
  checks.push({
    name: 'Agents Advise Only',
    principle: MANIFESTO_PRINCIPLES.HUMAN_IN_LOOP,
    passed: CONSTITUTION.principles.agentsAdviseOnly === true,
    details: 'Constitution enforces agentsAdviseOnly: true',
  });
  
  checks.push({
    name: 'No Agent Decision',
    principle: MANIFESTO_PRINCIPLES.HUMAN_IN_LOOP,
    passed: CONSTITUTION.limitations.allowAgentDecision === false,
    details: 'Constitution blocks agent decisions',
  });
  
  // === PRINCIPLE 2: Timeline as truth ===
  checks.push({
    name: 'Timeline Append-Only',
    principle: MANIFESTO_PRINCIPLES.TIMELINE_TRUTH,
    passed: CONSTITUTION.timeline.mode === 'append-only',
    details: 'Timeline mode is append-only',
  });
  
  checks.push({
    name: 'Timeline Not Modifiable',
    principle: MANIFESTO_PRINCIPLES.TIMELINE_TRUTH,
    passed: CONSTITUTION.timeline.modifiable === false,
    details: 'Timeline cannot be modified',
  });
  
  checks.push({
    name: 'Timeline Source of Truth',
    principle: MANIFESTO_PRINCIPLES.TIMELINE_TRUTH,
    passed: CONSTITUTION.timeline.sourceOfTruth === true,
    details: 'Timeline is the single source of truth',
  });
  
  // === PRINCIPLE 3: Intention over action ===
  checks.push({
    name: 'Paths Define Intentions',
    principle: MANIFESTO_PRINCIPLES.INTENTION_OVER_ACTION,
    passed: Object.values(PATHS).every(p => p.intention.length > 0),
    details: 'All paths have defined intentions',
  });
  
  // === PRINCIPLE 4: Rollback is interpretation ===
  checks.push({
    name: 'Rollback Does Not Write',
    principle: MANIFESTO_PRINCIPLES.ROLLBACK_INTERPRETATION,
    passed: CONSTITUTION.rollback.writesTimeline === false,
    details: 'Rollback never writes to timeline',
  });
  
  checks.push({
    name: 'Rollback Strategy',
    principle: MANIFESTO_PRINCIPLES.ROLLBACK_INTERPRETATION,
    passed: CONSTITUTION.rollback.strategy === 'reinterpret_state',
    details: 'Rollback reinterprets, never erases',
  });
  
  // === CONSTRAINTS ===
  checks.push({
    name: 'Max 4 Paths',
    principle: 'Design by constraint',
    passed: Object.keys(PATHS).length <= MANIFESTO_CONSTRAINTS.MAX_PRIMARY_PATHS,
    details: `${Object.keys(PATHS).length} paths defined (max ${MANIFESTO_CONSTRAINTS.MAX_PRIMARY_PATHS})`,
  });
  
  checks.push({
    name: 'No Destructive Undo',
    principle: 'Design by constraint',
    passed: CONSTITUTION.limitations.allowUndoDestructive === false,
    details: 'Destructive undo is blocked',
  });
  
  checks.push({
    name: 'Max 1 Preset',
    principle: 'Design by constraint',
    passed: CONSTITUTION.limitations.maxSimultaneousPresets === 1,
    details: 'Only one preset active at a time',
  });
  
  checks.push({
    name: 'No Intrusive Prompts',
    principle: 'Design by constraint',
    passed: CONSTITUTION.limitations.maxIntrusivePrompts === 0,
    details: 'Zero intrusive prompts allowed',
  });
  
  // === CALCULATE SCORE ===
  const passed = checks.filter(c => c.passed).length;
  const total = checks.length;
  const score = Math.round((passed / total) * 100);
  const compliant = passed === total;
  
  return {
    compliant,
    score,
    checks,
    summary: compliant
      ? `✅ MANIFESTO COMPLIANT (${score}%)`
      : `⚠️ ${total - passed} violations detected (${score}%)`,
  };
}

/**
 * Vérifier les critères de succès UX
 */
export function checkSuccessCriteria(): Record<string, boolean> {
  return {
    userKnowsPosition: CONSTITUTION.successCriteria.userUnderstandsPosition,
    safeExploration: CONSTITUTION.successCriteria.safeExploration,
    stressFreeExit: CONSTITUTION.successCriteria.stressFreeExit,
    easyResumption: CONSTITUTION.successCriteria.easyResumption,
  };
}

/**
 * Afficher le rapport de conformité
 */
export function printComplianceReport(): void {
  const compliance = checkManifestoCompliance();
  
  console.log('\n========================================');
  console.log('   CHE·NU MANIFESTO COMPLIANCE REPORT');
  console.log('========================================\n');
  
  console.log(`Status: ${compliance.summary}`);
  console.log(`Score: ${compliance.score}%\n`);
  
  console.log('Checks:');
  compliance.checks.forEach(check => {
    const icon = check.passed ? '✅' : '❌';
    console.log(`  ${icon} ${check.name}`);
    if (!check.passed) {
      console.log(`     → ${check.details}`);
    }
  });
  
  console.log('\n--- Success Criteria ---');
  const criteria = checkSuccessCriteria();
  Object.entries(criteria).forEach(([key, value]) => {
    console.log(`  ${value ? '✅' : '❌'} ${key}`);
  });
  
  console.log('\n========================================\n');
}

/**
 * Vérifier qu'un path respecte le manifeste
 */
export function validatePath(path: PathType): ComplianceCheck[] {
  const config = PATHS[path];
  const checks: ComplianceCheck[] = [];
  
  checks.push({
    name: `${path}: Has intention`,
    principle: MANIFESTO_PRINCIPLES.INTENTION_OVER_ACTION,
    passed: config.intention.length > 0,
    details: `Intention: "${config.intention}"`,
  });
  
  checks.push({
    name: `${path}: Options defined`,
    principle: 'Every option answers one clear question',
    passed: config.allowedOptions.length > 0,
    details: `${config.allowedOptions.length} options defined`,
  });
  
  checks.push({
    name: `${path}: Forbidden list defined`,
    principle: 'Design by constraint',
    passed: config.forbidden.length > 0,
    details: `${config.forbidden.length} forbidden actions`,
  });
  
  if (path === 'decision') {
    checks.push({
      name: `${path}: Can write timeline`,
      principle: 'Decisions always written',
      passed: config.canWriteTimeline === true,
      details: 'Decision path can write to timeline',
    });
    
    checks.push({
      name: `${path}: Requires validation`,
      principle: MANIFESTO_PRINCIPLES.HUMAN_IN_LOOP,
      passed: config.requiresValidation === true,
      details: 'Decision requires human validation',
    });
  }
  
  if (path === 'exploration') {
    checks.push({
      name: `${path}: No auto-write`,
      principle: 'No silent persistence',
      passed: config.canWriteTimeline === false,
      details: 'Exploration does not auto-write',
    });
  }
  
  return checks;
}

/**
 * Export pour tests
 */
export {
  MANIFESTO_PRINCIPLES as PRINCIPLES,
  MANIFESTO_CONSTRAINTS as CONSTRAINTS,
  SUCCESS_CRITERIA as CRITERIA,
};
