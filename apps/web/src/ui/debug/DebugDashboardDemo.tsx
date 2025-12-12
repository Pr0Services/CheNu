/* =========================================================
   CHE·NU — Debug Dashboard Demo
   
   Interactive demo showing the debug dashboard in action.
   ========================================================= */

import React, { useEffect } from 'react';
import {
  CheNuDebugDashboard,
  useDebugDashboard,
  createMockAgents,
  createMockGuardEvents,
  createMockObservations,
} from './index';

/* -------------------------
   DEMO COMPONENT
------------------------- */

export const DebugDashboardDemo: React.FC = () => {
  const [state, actions] = useDebugDashboard();

  // Initialize with mock data
  useEffect(() => {
    // Add mock agents
    const mockAgents = createMockAgents();
    mockAgents.forEach(agent => {
      actions.addAgent({
        name: agent.name,
        type: agent.type,
        confidence: agent.confidence,
        summary: agent.summary,
        active: agent.active,
      });
    });

    // Add mock guard events
    const mockEvents = createMockGuardEvents();
    mockEvents.forEach(event => {
      actions.addGuardEvent({
        rule: event.rule,
        reason: event.reason,
        severity: event.severity,
      });
    });

    // Add mock observations
    const mockObs = createMockObservations();
    mockObs.forEach(obs => {
      actions.addObservation(obs.note, obs.source);
    });

    // Set stage
    actions.setStage('parallel_analysis');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#020617',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      <h1 style={{ color: '#f1f5f9', margin: 0 }}>
        🔧 CHE·NU Debug Dashboard Demo
      </h1>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => actions.advanceStage()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0ea5e9',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          ▶ Advance Stage
        </button>
        
        <button
          onClick={() => actions.addObservation(
            `Random observation at ${new Date().toLocaleTimeString()}`,
            'Demo'
          )}
          style={{
            padding: '8px 16px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          + Add Observation
        </button>

        <button
          onClick={() => actions.addGuardEvent({
            rule: 'DEMO_RULE',
            reason: 'This is a demo guard event',
            severity: Math.random() > 0.5 ? 'warning' : 'violation',
          })}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          ⚠ Add Guard Event
        </button>

        <button
          onClick={() => actions.reset()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#64748b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          ↻ Reset
        </button>
      </div>

      {/* Dashboard */}
      <CheNuDebugDashboard
        currentStage={state.currentStage}
        agents={state.agents}
        guardEvents={state.guardEvents}
        observations={state.observations}
        sessionStart={state.sessionStart}
        onClearEvents={actions.clearGuardEvents}
        onRefresh={() => actions.addObservation('Manual refresh triggered', 'User')}
      />

      {/* State viewer */}
      <details style={{ color: '#64748b' }}>
        <summary style={{ cursor: 'pointer' }}>Raw State (JSON)</summary>
        <pre style={{
          backgroundColor: '#0f172a',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '12px',
        }}>
          {JSON.stringify(state, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default DebugDashboardDemo;
