/**
 * CHE·NU — AMBIENT DECOR SYSTEM
 * Main exports
 */

// Types
export {
  type DecorType,
  type DecorState,
  type DecorConfig,
  type DecorColorHints,
  type DecorAnimation,
  type DeviceCapability,
  type DecorTypeDefinition,
  DECOR_DEFINITIONS,
  SPHERE_DECOR_MAP,
  DECOR_RULES,
  detectDeviceCapability,
  scaleConfigForDevice,
  resolveThemeConflict,
} from './types';

// Context
export {
  DecorProvider,
  DecorContext,
  useDecor,
  type DecorContextState,
  type DecorContextValue,
} from './DecorContext';

// Components
export {
  DecorLayer,
  DecorControls,
  SphereDecorSelector,
  AgentAura,
} from './DecorLayer';

// Renderers
export {
  DecorRenderer,
  NeutralDecor,
  OrganicDecor,
  CosmicDecor,
  FocusDecor,
  XRDecor,
} from './DecorRenderers';

// Default export
export { DecorLayer as default } from './DecorLayer';
