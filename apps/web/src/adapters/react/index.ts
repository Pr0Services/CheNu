/* =====================================================
   CHE·NU — React Adapter Module
   
   PHASE 2: BRIDGE LAYER
   
   Connects the pure DimensionResolver to React.
   
   Usage:
   
   import { 
     EngineProvider, 
     DimensionContainer,
     useDimension,
     useSphere,
   } from '@/adapters/react';
   
   // Wrap app with provider
   <EngineProvider>
     <App />
   </EngineProvider>
   
   // Use in components
   const { dimension } = useDimension({ sphereId: 'business' });
   
   // Or use container component
   <DimensionContainer sphereId="business" permission="write">
     <Content />
   </DimensionContainer>
   
   ===================================================== */

// ─────────────────────────────────────────────────────
// HOOKS & CONTEXT
// ─────────────────────────────────────────────────────

export {
  EngineProvider,
  useEngine,
  useDimension,
  useSphere,
  useActivityTracker,
  useContentMetrics,
  loadEngineConfig,
  loadSphereConfig,
  preloadAllSpheres,
} from './useResolvedDimension';

// ─────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────

export {
  DimensionContainer,
  SphereContainer,
} from './DimensionContainer';

// ─────────────────────────────────────────────────────
// STYLE MAPPING
// ─────────────────────────────────────────────────────

export {
  mapDimensionToStyles,
  injectKeyframes,
  shouldShowDetail,
  getDetailConfig,
} from './styleMapper';

export type { MappedStyles, ThemeTokens } from './styleMapper';

// ─────────────────────────────────────────────────────
// SPHERE LOADING
// ─────────────────────────────────────────────────────

export {
  loadRegistry,
  getAvailableSpheres,
  getSpheresByCategory,
  loadSphere,
  loadSpheres,
  preloadSpheres,
  validateSphereConfig,
  clearCache,
  getCacheStats,
  getSphereProperty,
  isSphereLoaded,
  getAllLoadedSpheres,
} from './sphereLoader';

export type { SphereRegistry, LoadedSphere, SphereLoaderOptions } from './sphereLoader';

// ─────────────────────────────────────────────────────
// RE-EXPORT TYPES FROM RESOLVER
// ─────────────────────────────────────────────────────

export type {
  DimensionContext,
  ResolvedDimension,
  ContentContext,
  ActivityContext,
  ComplexityLevel,
  PermissionLevel,
  MotionType,
  DensityLevel,
  ActivityState,
  ContentLevel,
  SphereConfig,
  EngineConfig,
} from '../../core-reference/resolver/types';
