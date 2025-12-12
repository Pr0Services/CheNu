/* =====================================================
   CHE·NU — IMPLEMENTATION CHECKLIST MODULE
   Scope: DEV & AI EXECUTION
   Authority: FOUNDATION-BOUND
   Purpose: ENSURE SAFE, CONSISTENT, NON-MANIPULATIVE IMPLEMENTATION
   
   If integrity conflicts with functionality → INTEGRITY WINS
   
   ❤️ With love, for humanity.
   ===================================================== */

export {
  // Types
  type ChecklistStatus,
  type ChecklistItem,
  type ForbiddenAction,
  type ChecklistSection,
  type ChecklistValidationResult,
  type SectionValidationResult,

  // Sections
  SECTION_0_PRECONDITIONS,
  SECTION_1_FOUNDATION,
  SECTION_2_AUTHORITY,
  SECTION_3_AGENTS,
  SECTION_4_SILENCE,
  SECTION_5_NARRATIVE,
  SECTION_6_DRIFT,
  SECTION_7_DATA,
  SECTION_8_LEGACY,
  SECTION_9_UI,
  SECTION_10_XR,
  SECTION_11_LOGGING,
  SECTION_12_ETHICS,
  SECTION_13_AI,
  SECTION_14_FINAL,

  // Protocols
  PRECONDITION_FAILURE_PROTOCOL,
  ETHICS_RULE,
  UNCERTAINTY_PROTOCOL,

  // Complete checklist
  IMPLEMENTATION_CHECKLIST,

  // Validation functions
  validateChecklist,
  validateSection,
  updateItemStatus,
  getPendingItems,
  getFailedItems,
  getAllForbiddenActions,
  canImplementationProceed,

  // Text generator
  generateChecklistText,
} from './implementationChecklist.types';

// Re-export default
export { default } from './implementationChecklist.types';
