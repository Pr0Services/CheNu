/**
 * CHE·NU — ARCHITECTURAL SPHERE
 * Main Exports
 * 
 * Foundation v1.1
 * SPACE ONLY — NO behavior, NO decisions, NO data authority
 */

// Types
export {
  type ArchDomain,
  type LayoutType,
  type Dimension,
  type ZonePurpose,
  type Visibility,
  type NavigationMode,
  type AvatarType,
  type AvatarStyle,
  type AvatarAnimation,
  type AssetType,
  type Zone,
  type NavigationConfig,
  type Plan,
  type AvatarVisual,
  type AvatarPresence,
  type AvatarRoleIndicator,
  type Avatar,
  type DecorPreset,
  type ThemeConfig,
  type ExportPackage,
  type ValidationResult,
  type ActivationRequest,
  type ActivationResponse,
  type ForbiddenAction,
  FORBIDDEN_ACTIONS,
  DOMAIN_RESTRICTIONS,
  DEFAULT_ZONE,
  DEFAULT_NAVIGATION,
  DEFAULT_AVATAR_VISUAL,
  DEFAULT_AVATAR_PRESENCE,
  DEFAULT_ROLE_INDICATOR,
} from './types';

// Validators
export {
  validateZone,
  validatePlan,
  validateAvatar,
  validateDecorPreset,
  validateExportPackage,
  checkForbiddenAction,
  checkCompatibility,
  generateHash,
  type ActionCheck,
} from './validators';

// Context
export {
  ArchitecturalProvider,
  ArchitecturalContext,
  useArchitectural,
} from './ArchitecturalContext';

// Components
export {
  PlanEditor,
  AvatarEditor,
  PlanList,
  AvatarList,
  DomainEnablement,
} from './components';

// Default export
export { ArchitecturalProvider as default } from './ArchitecturalContext';
