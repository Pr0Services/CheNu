/**
 * CHE·NU — XR PRESETS PACK
 * Main Exports
 * 
 * XR.v1.0
 * 5 curated immersive environments for CHE·NU spatial experiences.
 */

// Types
export {
  type XRPresetId,
  type LightingType,
  type LightingConfig,
  type SkyType,
  type SkyConfig,
  type FloorType,
  type FloorConfig,
  type AmbienceSound,
  type AmbienceConfig,
  type UILayerType,
  type UILayerConfig,
  type AvatarStyleType,
  type AvatarStyleConfig,
  type DecorElement,
  type SpecialFeature,
  type PresetConstraints,
  type XRPreset,
  type TransitionConfig,
  type MenuConfig,
  type NavigationMode,
  type NavigationConfig,
  type SafetyConfig,
  type UniversalXRRules,
  type XRPresetBundle,
  type PresetSelectionCriteria,
  type XRRuntimeState,
} from './types';

// Preset definitions
export {
  XR_CLASSIC,
  XR_COSMIC,
  XR_BUILDER,
  XR_SANCTUM,
  XR_JUNGLE,
  UNIVERSAL_XR_RULES,
  ALL_PRESETS,
  PRESET_LIST,
  createPresetBundle,
} from './presets';

// Context
export {
  XRPresetsProvider,
  XRPresetsContext,
  useXRPresets,
  type XRPresetsState,
  type XRPresetsContextValue,
} from './XRPresetsContext';

// Components
export {
  PresetCard,
  PresetSelector,
  CurrentPresetDisplay,
  LoadingOverlay,
  NavigationControls,
  PresetRecommender,
  XRPresetsDashboard,
} from './components';

// Default export
export { XRPresetsProvider as default } from './XRPresetsContext';
