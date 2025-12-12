/**
 * CHE·NU Simulation Routes
 * CSF (Conceptual Simulation Fabric) endpoints
 */

export default async function simulationRoutes(fastify, options) {
  
  // POST /simulation/run
  fastify.post('/run', {
    schema: {
      description: 'Run a conceptual simulation',
      body: {
        type: 'object',
        required: ['scenario'],
        properties: {
          scenario: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              variables: { type: 'object' },
              branches: { type: 'integer', default: 3 }
            }
          },
          options: {
            type: 'object',
            properties: {
              depth: { type: 'integer', default: 3 },
              include_probabilities: { type: 'boolean', default: false }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { scenario, options } = request.body;
    
    // CSF Simulation (conceptual, not factual predictions)
    const simulation = {
      id: `sim_${Date.now()}`,
      scenario: scenario.name,
      branches: [],
      metadata: {
        created_at: new Date().toISOString(),
        type: 'conceptual',
        disclaimer: 'This is a conceptual simulation, not a factual prediction'
      }
    };
    
    // Generate conceptual branches
    for (let i = 0; i < (scenario.branches || 3); i++) {
      simulation.branches.push({
        branch_id: i + 1,
        label: `Branch ${i + 1}`,
        outcome: `Conceptual outcome ${i + 1}`,
        factors: [],
        confidence: 'conceptual'
      });
    }
    
    return {
      success: true,
      simulation,
      lawbook_notice: 'CSF produces conceptual simulations only, no real-world predictions'
    };
  });

  // POST /timeline/branch
  fastify.post('/timeline/branch', {
    schema: {
      description: 'Create a timeline branch for decision analysis'
    }
  }, async (request, reply) => {
    const { decision, options } = request.body || {};
    
    return {
      success: true,
      branch_id: `branch_${Date.now()}`,
      timeline: {
        past: [],
        present: decision || 'Current state',
        futures: [
          { id: 1, label: 'Option A', description: 'Conceptual future A' },
          { id: 2, label: 'Option B', description: 'Conceptual future B' }
        ]
      }
    };
  });
}
