/* =====================================================
   CHE·NU — Dimension Module Index
   core/dimension/index.ts
   ===================================================== */

// Types (Constitutional schema)
export * from './dimension.types';

// Resolver (Constitutional executor)
export { 
  resolveDimension, 
  loadSphereConfig 
} from './dimensionResolver';

// React Hooks (Connectors)
export {
  useDimension,
  useActivityTracker,
  useContentMetrics,
  useUserContext,
} from './useDimension';
