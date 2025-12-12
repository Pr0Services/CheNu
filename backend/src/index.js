/**
 * CHE·NU CHE-NU Backend - Main Entry Point
 * Framework: Fastify
 * Version: ULTRA_PACK-1.0
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

// Routes
import orchestratorRoutes from './routes/orchestrator.js';
import agentsRoutes from './routes/agents.js';
import simulationRoutes from './routes/simulation.js';
import xrRoutes from './routes/xr.js';
import specializedRoutes from './routes/specialized.js';
import morphologyRoutes from './routes/morphology.js';
import fabricRoutes from './routes/fabric.js';
import universeRoutes from './routes/universe.js';
import interactionRoutes from './routes/interaction.js';
import desktopRoutes from './routes/desktop.js';
import panelsRoutes from './routes/panels.js';
import holonetRoutes from './routes/holonet.js';
import sessionsRoutes from './routes/sessions.js';
import mkmRoutes from './routes/mkm.js';
import rmRoutes from './routes/rm.js';
import uxaRoutes from './routes/uxa.js';
import wbRoutes from './routes/wb.js';
import wblRoutes from './routes/wbl.js';
import owsRoutes from './routes/ows.js';
import mlsRoutes from './routes/mls.js';
import mmvRoutes from './routes/mmv.js';
import depthRoutes from './routes/depth.js';
import fabricCartoRoutes from './routes/fabricCarto.js';
import atlasProjectionRoutes from './routes/atlasProjection.js';
import xrPackProRoutes from './routes/xrPackPro.js';
import xrSuiteRoutes from './routes/xrSuite.js';

const fastify = Fastify({
  logger: true
});

// CORS
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || '*'
});

// Swagger Documentation
await fastify.register(swagger, {
  openapi: {
    info: {
      title: 'CHE·NU CHE-NU API',
      description: 'Unified Cognitive OS API for CHE-NU',
      version: '1.0.0'
    },
    servers: [
      { url: 'http://localhost:8080', description: 'Development' }
    ]
  }
});

await fastify.register(swaggerUi, {
  routePrefix: '/docs'
});

// Register Routes
fastify.register(orchestratorRoutes, { prefix: '/api/orchestrator' });
fastify.register(agentsRoutes, { prefix: '/api/agents' });
fastify.register(simulationRoutes, { prefix: '/api/simulation' });
fastify.register(xrRoutes, { prefix: '/api/xr' });
fastify.register(specializedRoutes, { prefix: '/api/specialized' });
fastify.register(morphologyRoutes, { prefix: '/api/morphology' });
fastify.register(fabricRoutes, { prefix: '/api/fabric' });
fastify.register(universeRoutes, { prefix: '/api/universe' });
fastify.register(interactionRoutes, { prefix: '/api/interaction' });
fastify.register(desktopRoutes, { prefix: '/api/desktop' });
fastify.register(panelsRoutes, { prefix: '/api/panels' });
fastify.register(holonetRoutes, { prefix: '/api/holonet' });
fastify.register(sessionsRoutes, { prefix: '/api/sessions' });
fastify.register(mkmRoutes, { prefix: '/api/mkm' });
fastify.register(rmRoutes, { prefix: '/api/rm' });
fastify.register(uxaRoutes, { prefix: '/api/uxa' });
fastify.register(wbRoutes, { prefix: '/api/wb' });
fastify.register(wblRoutes, { prefix: '/api/wbl' });
fastify.register(owsRoutes, { prefix: '/api/ows' });
fastify.register(mlsRoutes, { prefix: '/api/mls' });
fastify.register(mmvRoutes, { prefix: '/api/mmv' });
fastify.register(depthRoutes, { prefix: '/api/depth' });
fastify.register(fabricCartoRoutes, { prefix: '/api/fabric-carto' });
fastify.register(atlasProjectionRoutes, { prefix: '/api/atlas-projection' });
fastify.register(xrPackProRoutes, { prefix: '/api/xr-pro' });
fastify.register(xrSuiteRoutes, { prefix: '/api/xr-suite' });

// Health Check
fastify.get('/health', async () => {
  return { 
    status: 'ok', 
    system: 'CHE·NU ULTRA PACK',
    kernel: 'CORE+ / OS 5.5 → OS 22.0 / PXR-3 / XR-SUITE',
    version: '22.0.0',
    modules: ['HSE', 'HCE', 'HFE', 'UniverseOS', 'InteractionLayer', 'DesktopMode', 'InteractionPanels', 'HoloNet', 'UniverseSessions', 'MetaKernelManager', 'ResourceManager', 'UXAssistant', 'Workbench', 'WorkspaceLibrary', 'XRPack', 'OmniWorkspace', 'MultiLensSystem', 'MultimodalViewports', 'MorphologyDesignerPro', 'MultiViewportCompositor', 'CognitiveDepthLayers', 'MultiDepthSynthesis', 'HyperFabric', 'HyperFabricSlicing', 'UniverseOSCartography', 'CartographySynthesizer', 'UniversalCoherenceLayer', 'HyperCoherence', 'MetaAtlas', 'AtlasComposer', 'ProjectionEngine', 'XRPackPro', 'XRSuite', 'PXR-3', 'CSF', 'RDK', 'LAWBOOK'],
    agents: {
      core: 7,
      specialized: 28,
      xr_agents: ['XR_ORCHESTRATOR', 'XR_SCENE_BUILDER']
    },
    xr_suite: {
      version: 'XR-SUITE-1.0',
      components: {
        orchestrator: 'CHE-NU_XR_ORCHESTRATOR',
        scene_builder: 'CHE-NU_XR_SCENE_BUILDER'
      },
      request_types: ['scene', 'modification', 'pipeline', 'multiroom'],
      pipelines: ['unity', 'unreal', 'threejs', 'generic'],
      autonomous: false,
      code_execution: false,
      output_only: ['text', 'json', 'pseudo-code']
    },
    xr_pack_pro: {
      version: 'XR-PRO-1.0',
      engines: ['unity', 'unreal', 'threejs', 'generic'],
      room_shapes: ['box', 'sphere', 'capsule', 'custom'],
      portal_shapes: ['plane', 'circle', 'frame', 'gate'],
      symbol_roles: ['intent', 'structure', 'timeline', 'insight', 'environment'],
      json_export_only: true,
      no_code_execution: true,
      no_physics_simulation: true
    },
    atlas_projection_system: {
      hc_20_5: true,
      ma_21: true,
      ac_21_5: true,
      pe_22: true,
      alignment_types: ['spatial', 'temporal', 'semantic', 'perspective', 'slice_overlay'],
      atlas_sections: ['spatial_maps', 'timeline_maps', 'semantic_maps', 'composite_maps', 'hyperfabric_slices', 'depthlayer_mappings'],
      projection_types: ['2d_flat', 'axonometric', 'multilayer', 'timeline_overlay', 'slice_overlay', 'fabric_carto', 'composite'],
      no_autonomy: true
    },
    hyperfabric_system: {
      hf_18: true,
      hfs_18_5: true,
      uc_19: true,
      cs_19_5: true,
      ucl_20: true,
      topology_language: true,
      no_autonomy: true
    },
    timestamp: new Date().toISOString()
  };
});

// System Info
fastify.get('/info', async () => {
  return {
    system: 'CHE·NU',
    version: 'ULTRA_PACK-22.0',
    kernel: 'CORE+ / OS 5.5 → OS 22.0 / PXR-3',
    kernel_stack: [
      'CORE+', 'OS-5.5', 'OS-6.0', 'OS-7.0 HSE', 'OS-8.0 HCE', 'OS-8.5 HFE',
      'OS-9.0 UniverseOS', 'OS-9.5 IL', 'OS-10.0 UDM', 'OS-10.5 IP',
      'OS-11.0 HN', 'OS-11.5 USX', 'OS-12.0 MKM', 'OS-12.5 RM',
      'OS-13.0 UXA', 'OS-14.0 WB', 'OS-14.5 WBL+XRP', 'OS-15.0 OWS',
      'OS-15.5 MLS', 'OS-16.0 MMV+MD-PRO', 'OS-16.5 MVC',
      'OS-17.0 CDL', 'OS-17.5 MDS', 'OS-18.0 HF', 'OS-18.5 HFS',
      'OS-19.0 UC', 'OS-19.5 CS', 'OS-20.0 UCL', 'OS-20.5 HC',
      'OS-21.0 MA', 'OS-21.5 AC', 'OS-22.0 PE', 'PXR-3'
    ],
    features: [
      'Multi-agent orchestration',
      'XR Gateway + Holo-Rooms',
      'CSF Simulation',
      'PXR-3 Morphology Engine',
      'Spatial Cognition Graph (SCG)',
      'Holo-Compiler Engine (HCE)',
      'Holo-Fabric Engine (HFE)',
      'UniverseOS Spatial Environment',
      'Interaction Layer (IL-9.5)',
      'Desktop Mode (UDM-10.0)',
      'Interaction Panels (IP-10.5)',
      'HOLO-NET Multi-user Collaboration (HN-11.0)',
      'Universe Sessions (USX-11.5)',
      'Meta-Kernel Manager (MKM-12.0)',
      'Resource Manager (RM-12.5)',
      'AI-UX Assistant Layer (UXA-13.0)',
      'Workbench Builder (WB-14.0)',
      'Workspace Library (WBL-14.5)',
      'XR Pack Unity/Unreal/Three.js (XRP-14.5)',
      'Omni-Workspace Multi-Dimensional (OWS-15.0)',
      'Multi-Lens System Perspective Organizer (MLS-15.5)',
      'Multimodal Viewports System (MMV-16.0)',
      'Morphology Designer Pro (MD-PRO-16.0)',
      'Multi-Viewport Compositor (MVC-16.5)',
      'Cognitive Depth Layers (CDL-17.0)',
      'Multi-Depth Synthesis (MDS-17.5)',
      'HyperFabric Topology Language (HF-18.0)',
      'HyperFabric Slicing (HFS-18.5)',
      'UniverseOS Cartography (UC-19.0)',
      'Cartography Synthesizer (CS-19.5)',
      'Universal Coherence Layer (UCL-20.0)',
      'HyperCoherence Cross-Map Alignment (HC-20.5)',
      'Meta-Atlas Catalog (MA-21.0)',
      'Atlas Composer (AC-21.5)',
      'Projection Engine (PE-22.0)',
      '28 Specialized domain agents'
    ],
    spheres: ['meta', 'business', 'personal', 'creative', 'institutional', 'entertainment', 'health', 'scholar'],
    atlas_projection: {
      hypercoherence: {
        alignment_types: ['spatial', 'temporal', 'semantic', 'perspective', 'slice_overlay'],
        reporting_only: true
      },
      meta_atlas: {
        sections: ['spatial_maps', 'timeline_maps', 'semantic_maps', 'composite_maps', 'hyperfabric_slices', 'depthlayer_mappings'],
        organizing_only: true
      },
      atlas_composer: {
        operations: ['select', 'group', 'filter', 'compose', 'export'],
        user_curation_only: true
      },
      projection_engine: {
        types: ['2d_flat', 'axonometric', 'multilayer', 'timeline_overlay', 'slice_overlay', 'fabric_carto', 'composite'],
        user_triggered_only: true
      }
    },
    safety: {
      non_emotional: true,
      non_autonomous: true,
      non_embodied: true,
      no_faces: true,
      no_addictive_patterns: true,
      no_personal_identity: true,
      no_social_dynamics: true,
      user_sovereignty: true,
      reversible: true,
      low_motion: true,
      accessible: true,
      symbolic_only: true,
      lawbook_enforced: true,
      supervisor_only: true,
      advisory_ux: true,
      user_controlled_workspaces: true,
      template_confirmation_required: true,
      static_xr_export_only: true,
      multi_dimensional_user_controlled: true,
      lenses_symbolic_only: true,
      viewports_user_request_only: true,
      morphology_non_humanoid: true,
      depth_formatting_only: true,
      no_cognition_simulation: true,
      no_inference: true,
      topology_language_only: true,
      no_auto_correction: true,
      coherence_reporting_only: true,
      hypercoherence_reporting_only: true,
      atlas_organizing_only: true,
      projection_user_triggered: true
    }
  };
});

// Start Server
const start = async () => {
  try {
    const port = process.env.PORT || 8080;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 CHE·NU CHE-NU API running on port ${port}`);
    console.log(`📚 Docs available at http://localhost:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export default fastify;
