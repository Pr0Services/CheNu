/* =====================================================
   CHE·NU — SPHERE MODULE
   Status: FOUNDATIONAL
   Purpose: Sphere schema, generator, and definitions
   
   Every sphere in CHE·NU must conform to this schema.
   The schema enforces inheritance of global laws,
   privacy guarantees, and human sovereignty.
   
   No sphere may override foundational protections.
   
   ❤️ With love, for humanity.
   ===================================================== */

// Schema types
export {
  // Identity
  type SphereIdentity,

  // Inheritance
  type SphereInheritance,

  // Context
  type BridgeType,
  type SphereContext,

  // Time
  type SphereState,
  type SphereTime,

  // Agents
  type ForbiddenCapability,
  type SphereAgents,

  // Data
  type SphereData,

  // Silence
  type SilenceMode,
  type SilenceBehavior,
  type SphereSilenceModes,

  // UX
  type SphereUX,

  // Reversibility
  type ReversibleAction,
  type SphereReversibility,

  // Interactions
  type SphereInteractions,

  // Validation
  type SphereValidation,
  type SphereValidationError,

  // Complete schema
  type SphereSchema,

  // Defaults
  SPHERE_INHERITANCE_DEFAULTS,
  SPHERE_CONTEXT_DEFAULTS,
  SPHERE_TIME_DEFAULTS,
  SPHERE_AGENTS_DEFAULTS,
  SPHERE_DATA_DEFAULTS,
  SPHERE_SILENCE_DEFAULTS,
  SPHERE_UX_DEFAULTS,
  SPHERE_REVERSIBILITY_DEFAULTS,
  SPHERE_INTERACTIONS_DEFAULTS,
  SPHERE_VALIDATION_DEFAULTS,

  // Factory & Validation (legacy)
  createSphere,
  validateSphere as validateSchemaCompliance,
  isSphereValid,
} from './sphereSchema.types';

// Generator (preferred method)
export {
  // Types
  type SphereInput,
  type GeneratedSphere,

  // Constants
  INHERITED_LAWS,
  NEVER_INTERPRETS,
  FORBIDDEN_CAPABILITIES,

  // Generator function
  generateSphere,

  // Validation
  validateSphere,
  getValidationErrors,

  // File generation
  type SphereFiles,
  generateSphereFiles,
} from './sphereGenerator';

// Default spheres
export {
  // Individual spheres
  personalSphere,
  businessSphere,
  creativeSphere,
  scholarSphere,
  constructionSphere,
  financeSphere,
  wellnessSphere,
  familySphere,
  sandboxSphere,
  archiveSphere,

  // Collections
  defaultSpheres,
  sphereInputs,

  // Utilities
  getSphereById,
  getAllSphereIds,
  getActiveAgentSpheres,
  getInteractableSpheres,
  getSphereSummary,
} from './defaultSpheres';

// UI Component
export {
  type SphereUIInput,
  type ValidationResult,
  validateSphereInput,
  SphereGeneratorUI,
  type SphereGeneratorUIProps,
} from './SphereGeneratorUI';

// Re-export default
export { default } from './defaultSpheres';
