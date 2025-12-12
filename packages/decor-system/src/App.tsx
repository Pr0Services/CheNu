/**
 * CHE·NU — AMBIENT DECOR SYSTEM
 * Usage Example
 * 
 * This file demonstrates how to integrate the Ambient Decor System
 * into a CHE·NU application.
 */

import React, { useState } from 'react';
import {
  DecorProvider,
  DecorLayer,
  DecorControls,
  SphereDecorSelector,
  useDecor,
  DECOR_DEFINITIONS,
} from './decor';

// ============================================================
// EXAMPLE 1: Basic Integration
// ============================================================

/**
 * Basic integration - wrap your app with DecorProvider
 * and add DecorLayer as a background element.
 */
export function BasicExample() {
  return (
    <DecorProvider>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Decor layer - renders behind everything */}
        <DecorLayer />
        
        {/* Your app content */}
        <main style={{ position: 'relative', zIndex: 1, padding: 20 }}>
          <h1>Welcome to CHE·NU</h1>
          <p>The ambient decor system is active behind this content.</p>
          
          {/* Optional: Add controls for users */}
          <DecorControls />
        </main>
      </div>
    </DecorProvider>
  );
}

// ============================================================
// EXAMPLE 2: Sphere-Aware Decor
// ============================================================

/**
 * Decor changes automatically based on the current sphere.
 */
export function SphereAwareExample() {
  const [currentSphere, setCurrentSphere] = useState('personal');
  
  const spheres = [
    'personal',
    'business',
    'scholar',
    'creative',
    'methodology',
    'universe',
  ];
  
  return (
    <DecorProvider>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Decor automatically adapts to sphere */}
        <DecorLayer sphere={currentSphere} />
        
        <main style={{ position: 'relative', zIndex: 1, padding: 20 }}>
          <h1>Sphere: {currentSphere}</h1>
          
          {/* Sphere selector */}
          <div style={{ marginBottom: 20 }}>
            {spheres.map((sphere) => (
              <button
                key={sphere}
                onClick={() => setCurrentSphere(sphere)}
                style={{
                  padding: '8px 16px',
                  margin: '0 8px 8px 0',
                  background: currentSphere === sphere ? '#E8B86D' : '#fff',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                {sphere}
              </button>
            ))}
          </div>
          
          <DecorControls />
        </main>
      </div>
    </DecorProvider>
  );
}

// ============================================================
// EXAMPLE 3: User Preferences
// ============================================================

/**
 * Allow users to customize decor per sphere.
 */
export function UserPreferencesExample() {
  return (
    <DecorProvider>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <DecorLayer />
        
        <main style={{ position: 'relative', zIndex: 1, padding: 20 }}>
          <h1>Decor Preferences</h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 20 }}>
            <SphereDecorSelector sphere="personal" />
            <SphereDecorSelector sphere="business" />
            <SphereDecorSelector sphere="scholar" />
            <SphereDecorSelector sphere="creative" />
            <SphereDecorSelector sphere="methodology" />
            <SphereDecorSelector sphere="universe" />
          </div>
          
          <div style={{ marginTop: 30 }}>
            <DecorControls />
          </div>
        </main>
      </div>
    </DecorProvider>
  );
}

// ============================================================
// EXAMPLE 4: With Agent Auras
// ============================================================

/**
 * Display subtle agent presence indicators.
 */
export function AgentAurasExample() {
  const [agents, setAgents] = useState([
    { agentId: 'nova', color: '#5DA9FF', isActive: true, position: { x: 100, y: 200 } },
    { agentId: 'organizer', color: '#4CAF88', isActive: false, position: { x: 300, y: 300 } },
  ]);
  
  const toggleAgent = (id: string) => {
    setAgents(agents.map(a => 
      a.agentId === id ? { ...a, isActive: !a.isActive } : a
    ));
  };
  
  return (
    <DecorProvider>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <DecorLayer agentAuras={agents} />
        
        <main style={{ position: 'relative', zIndex: 1, padding: 20 }}>
          <h1>Agent Auras</h1>
          <p>Agent auras show subtle presence indicators (max 5% tint).</p>
          
          {agents.map((agent) => (
            <button
              key={agent.agentId}
              onClick={() => toggleAgent(agent.agentId)}
              style={{
                padding: '8px 16px',
                margin: '0 8px 8px 0',
                background: agent.isActive ? agent.color : '#fff',
                color: agent.isActive ? '#fff' : '#333',
                border: '1px solid #ddd',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {agent.agentId}: {agent.isActive ? 'Active' : 'Inactive'}
            </button>
          ))}
        </main>
      </div>
    </DecorProvider>
  );
}

// ============================================================
// EXAMPLE 5: Decor Type Gallery
// ============================================================

/**
 * Display all decor types for preview.
 */
export function DecorGallery() {
  const decorTypes = Object.values(DECOR_DEFINITIONS);
  
  return (
    <div style={{ padding: 20 }}>
      <h1>CHE·NU Decor Gallery</h1>
      <p>All canonical decor types:</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: 20,
        marginTop: 20,
      }}>
        {decorTypes.map((decor) => (
          <DecorProvider key={decor.id} initialDecor={decor.id}>
            <div style={{
              position: 'relative',
              height: 200,
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid #ddd',
            }}>
              <DecorLayer />
              <div style={{
                position: 'relative',
                zIndex: 1,
                padding: 15,
                color: decor.id === 'cosmic' || decor.id === 'focus' ? '#fff' : '#333',
              }}>
                <h3 style={{ margin: 0 }}>{decor.name}</h3>
                <p style={{ margin: '5px 0', fontSize: 12, opacity: 0.8 }}>
                  {decor.intent}
                </p>
                <p style={{ margin: 0, fontSize: 11, opacity: 0.6 }}>
                  {decor.usage[0]}
                </p>
              </div>
            </div>
          </DecorProvider>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// EXAMPLE 6: Custom Hook Usage
// ============================================================

/**
 * Using the useDecor hook for programmatic control.
 */
function DecorStatus() {
  const { state, setDecor, enable, disable } = useDecor();
  
  return (
    <div style={{ 
      padding: 15, 
      background: '#f5f5f5', 
      borderRadius: 8,
      marginTop: 20,
    }}>
      <h3>Decor Status</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li>Type: <strong>{state.currentDecor}</strong></li>
        <li>State: <strong>{state.state}</strong></li>
        <li>Enabled: <strong>{state.enabled ? 'Yes' : 'No'}</strong></li>
        <li>Locked: <strong>{state.lockedToDefault ? 'Yes' : 'No'}</strong></li>
        <li>Device: <strong>{state.deviceCapability}</strong></li>
        <li>Performance: <strong>{state.performanceMode}</strong></li>
      </ul>
      
      <div style={{ marginTop: 15 }}>
        <button onClick={() => setDecor('organic')} style={{ marginRight: 8 }}>
          Set Organic
        </button>
        <button onClick={() => setDecor('cosmic')} style={{ marginRight: 8 }}>
          Set Cosmic
        </button>
        <button onClick={() => setDecor('focus')} style={{ marginRight: 8 }}>
          Set Focus
        </button>
      </div>
    </div>
  );
}

export function HookUsageExample() {
  return (
    <DecorProvider>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <DecorLayer />
        
        <main style={{ position: 'relative', zIndex: 1, padding: 20 }}>
          <h1>Programmatic Control</h1>
          <DecorStatus />
        </main>
      </div>
    </DecorProvider>
  );
}

// ============================================================
// FULL APP EXAMPLE
// ============================================================

/**
 * Complete example showing typical CHE·NU app structure.
 */
export default function App() {
  const [view, setView] = useState<'basic' | 'spheres' | 'prefs' | 'auras' | 'gallery' | 'hook'>('basic');
  
  const views = {
    basic: BasicExample,
    spheres: SphereAwareExample,
    prefs: UserPreferencesExample,
    auras: AgentAurasExample,
    gallery: DecorGallery,
    hook: HookUsageExample,
  };
  
  const ViewComponent = views[view];
  
  return (
    <div>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#fff',
        borderBottom: '1px solid #ddd',
        padding: '10px 20px',
        display: 'flex',
        gap: 10,
      }}>
        <strong>Decor Examples:</strong>
        {Object.keys(views).map((key) => (
          <button
            key={key}
            onClick={() => setView(key as any)}
            style={{
              padding: '4px 12px',
              background: view === key ? '#E8B86D' : '#fff',
              border: '1px solid #ddd',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {key}
          </button>
        ))}
      </nav>
      
      {/* Content */}
      <div style={{ paddingTop: 50 }}>
        <ViewComponent />
      </div>
    </div>
  );
}
