/*
 * =====================================================
 * CHE·NU — SPHERE GENERATOR DEMO
 * Purpose: Demonstrate sphere creation UI
 * =====================================================
 */

import React from 'react';
import SphereGeneratorUI from './SphereGeneratorUI';
import { GeneratedSphere } from './sphereGenerator';

/**
 * Demo page for Sphere Generator UI.
 */
export default function SphereGeneratorDemo() {
  const handleGenerate = (sphere: GeneratedSphere) => {
    console.log('🌱 Sphere generated:', sphere);
    
    // In production, you would:
    // 1. Save to database
    // 2. Create sphere files
    // 3. Navigate to the new sphere
    
    alert(`✅ Sphere "${sphere.sphere.name}" created successfully!`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <SphereGeneratorUI onGenerate={handleGenerate} />
      
      {/* Footer */}
      <div style={{
        padding: 32,
        textAlign: 'center',
        color: '#6c757d',
        fontSize: 14,
      }}>
        <p>CHE·NU — Governed Intelligence Operating System</p>
        <p>❤️ With love, for humanity.</p>
      </div>
    </div>
  );
}

export { SphereGeneratorDemo };
