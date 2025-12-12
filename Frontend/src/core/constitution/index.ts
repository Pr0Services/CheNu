/* =========================================
   CHE·NU — CONSTITUTION MODULE EXPORTS
   
   Point d'entrée pour le module constitution.
   
   ⚖️ "L'humain décide, le système trace"
   ========================================= */

// Types
export * from './constitution.types';

// Validator & Guards
export {
  CONSTITUTION,
  validateAction,
  validateTimelineWrite,
  validateAgentAction,
  validateRollback,
  validatePresetCount,
  validatePrompt,
  guardTimelineWrite,
  guardAgentAction,
  guardRollback,
  assertConstitution,
  assertHumanInLoop,
  assertTimelineImmutable,
  generateComplianceReport,
  getViolationLog,
  clearViolationLog,
  displayLaws,
  getPath,
  isOptionAllowed,
  isRestricted,
  CONSTITUTION_LAWS,
  FORBIDDEN_ACTIONS,
} from './constitution.validator';

// React Hook
export {
  useConstitution,
  ConstitutionProvider,
  useConstitutionContext,
} from './useConstitution';

// JSON Config
export { default as foundationConfig } from './foundation.json';
