/* =====================================================
   CHE·NU — ETHICS MODULE
   Status: DEFENSIVE ETHICAL AUDIT
   Authority: SYSTEM LAW (NON-BYPASSABLE)
   Intent: PREVENT MISUSE, NOT POLICE HUMANS
   
   🛡️ The system protects unity by refusing leverage.
   ===================================================== */

export {
  // Definition
  ETHICAL_ATTACK_SURFACE_DEFINITION,

  // Attack vectors
  PRIMARY_ATTACK_VECTORS,
  type AttackVectorId,
  type AttackVectorType,

  // Individual defenses
  DEFENSE_BEHAVIORAL_OPTIMIZATION,
  DEFENSE_NARRATIVE_MANIPULATION,
  DEFENSE_PSYCHOLOGICAL_PROFILING,
  DEFENSE_PREDICTIVE_STEERING,
  DEFENSE_AUTHORITY_ACCUMULATION,
  DEFENSE_COLLECTIVE_LEVERAGE,
  DEFENSE_SILENT_COERCION,
  ALL_DEFENSES,

  // Meta-defense
  META_DEFENSE_SILENCE,

  // Agent constraints
  AGENT_CONSTRAINTS,
  type AgentConstraintCheck,

  // Review cycle
  REVIEW_CYCLE,

  // Visibility
  USER_VISIBILITY,

  // Failure mode
  FAILURE_MODE,

  // Audit types
  type AttackSurfaceAudit,
  type AttackSurfaceReview,

  // Declaration
  ETHICAL_DECLARATION,

  // Helpers
  isDefenseActive,
  getVectorDefenses,
  verifyAgentConstraints,
  createVectorAudit,
  createAttackSurfaceReview,
  applyFailureMode,
} from './attackSurface.types';

// Future components
// export { EthicalAuditRunner } from './EthicalAuditRunner';
// export { AttackSurfaceMonitor } from './AttackSurfaceMonitor';
// export { DefenseVerifier } from './DefenseVerifier';
