/**
 * CHE·NU OS 13.0 — UX ASSISTANT Routes
 * API endpoints for UX guidance and suggestions
 * Version: 13.0
 * 
 * UXA-13 is ADVISORY ONLY - it never modifies the system.
 */

import { UXAssistant } from '../services/UXAssistant.js';

export default async function uxaRoutes(fastify, options) {
  const uxa = new UXAssistant();

  // GET /uxa - Get UXA overview
  fastify.get('/', async (request, reply) => {
    return {
      system: 'UXA-13',
      modes: uxa.getModes(),
      guidelines: uxa.getGuidelines(),
      advisory_only: true,
      uxa_version: '13.0'
    };
  });

  // GET /uxa/modes - Get available modes
  fastify.get('/modes', async (request, reply) => {
    return {
      modes: uxa.getModes(),
      descriptions: {
        layout: 'Generate panel layout suggestion',
        flow: 'Generate navigation flow suggestion',
        dashboard: 'Generate dashboard structure',
        minimal: 'Suggest minimal UI version',
        structure: 'Identify hierarchies',
        wireframe: 'Generate ASCII wireframe'
      },
      uxa_version: '13.0'
    };
  });

  // GET /uxa/guidelines - Get UX guidelines
  fastify.get('/guidelines', async (request, reply) => {
    return {
      guidelines: uxa.getGuidelines(),
      uxa_version: '13.0'
    };
  });

  // POST /uxa/layout - MODE_LAYOUT
  fastify.post('/layout', {
    schema: {
      body: {
        type: 'object',
        properties: {
          layout: { type: 'string' },
          sections: { type: 'array' },
          actions: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const blueprint = uxa.generateLayout(request.body);
    return { ...blueprint, mode: 'MODE_LAYOUT', uxa_version: '13.0' };
  });

  // POST /uxa/flow - MODE_FLOW
  fastify.post('/flow', {
    schema: {
      body: {
        type: 'object',
        properties: {
          steps: { type: 'array' },
          final_goal: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const flow = uxa.generateFlow(request.body);
    return { ...flow, mode: 'MODE_FLOW', uxa_version: '13.0' };
  });

  // POST /uxa/dashboard - MODE_DASHBOARD
  fastify.post('/dashboard', {
    schema: {
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          data: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const dashboard = uxa.generateDashboard(request.body);
    return { ...dashboard, mode: 'MODE_DASHBOARD', uxa_version: '13.0' };
  });

  // POST /uxa/minimal - MODE_MINIMAL
  fastify.post('/minimal', {
    schema: {
      body: {
        type: 'object',
        properties: {
          sections: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const minimal = uxa.suggestMinimal(request.body);
    return { ...minimal, mode: 'MODE_MINIMAL', uxa_version: '13.0' };
  });

  // POST /uxa/structure - MODE_STRUCTURE
  fastify.post('/structure', {
    schema: {
      body: {
        type: 'object',
        properties: {
          content: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    const structure = uxa.analyzeStructure(request.body.content || {});
    return { ...structure, mode: 'MODE_STRUCTURE', uxa_version: '13.0' };
  });

  // POST /uxa/wireframe - MODE_WIREFRAME
  fastify.post('/wireframe', {
    schema: {
      body: {
        type: 'object',
        properties: {
          layout: { type: 'string' },
          sections: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    const wireframe = uxa.generateWireframe(request.body);
    return { ...wireframe, mode: 'MODE_WIREFRAME', uxa_version: '13.0' };
  });

  // GET /uxa/export - Export current suggestions
  fastify.get('/export', async (request, reply) => {
    return uxa.exportUXA();
  });

  // POST /uxa/safety-check - Validate safety
  fastify.post('/safety-check', async (request, reply) => {
    return {
      safety: uxa.validateSafety(),
      uxa_version: '13.0'
    };
  });

  // DELETE /uxa/clear - Clear current suggestions
  fastify.delete('/clear', async (request, reply) => {
    const result = uxa.clear();
    return { ...result, uxa_version: '13.0' };
  });
}
