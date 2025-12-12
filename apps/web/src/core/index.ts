/* =========================================
   CHE·NU — CORE MODULE EXPORTS
   
   Point d'entrée unique pour le module core.
   Importer depuis '@core' ou './core'
   ========================================= */

// === CONSTITUTION (Fundamental - Load First) ===
export * from './constitution';

// === FOUNDATION (Core Reference - Immutable) ===
export * from './foundation';

// === LAWS (Constitutional - Foundation Freeze) ===
export * from './laws';

// === MANIFESTO COMPLIANCE ===
export * from './manifesto';

// === RUNTIME GUARDS (Enforcement) ===
export * from './guards';

// === PATHS (Système Directionnel) ===
export * from './paths';

// === PRESET SYSTEM ===
export * from './preset';

// === DIMENSION ===
export * from './dimension';

// === LAYOUT ===
export * from './layout';

// === CONTEXT RECOVERY ===
export * from './recovery';

// === THEME ===
export * from './theme';

// === AGENTS ===
export * from './agents';

// === MEETINGS ===
export * from './meetings';

// === DECISION ECHO ===
export * from './decision-echo';

// === PRIVATE ARCHIVE & EXPORT ===
export * from './archive';

// === LEGACY / INHERITANCE MODE ===
export * from './legacy';

// === ETHICS (Attack Surface Review) ===
export * from './ethics';

// === FOUNDATION FREEZE (Cryptographic Seal) ===
export * from './freeze';

// === UNIVERSAL BOOTSTRAP (Constitutional Protocol) ===
export * from './bootstrap';

// === PRIVACY GUARANTEES (Structural Constraint) ===
export * from './privacy';

// === IMPLEMENTATION CHECKLIST (Dev & AI Execution) ===
export * from './checklist';

// === FOUNDATION LOCK (Cryptographic Verification) ===
export * from './lock';

// === SPHERE SCHEMA (Structural Definition) ===
export * from './sphere';

// === SPHERE PRESETS ===
export {
  SPHERE_PRESETS,
  getSpherePreset,
  getSpheresByCategory,
  type SpherePresetConfig,
} from './sphere-presets';

// === CONFIG (re-export as needed) ===
export { default as chenuConfig } from './config/chenu.config.json';
