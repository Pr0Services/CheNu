/**
 * CHE·NU V25 - CREATIVE STUDIO (1 CLIC!)
 */

import React, { useState } from 'react';

const tools = [
  { id: 'image', icon: '🖼️', label: 'Génération Image', desc: 'Créer des images avec l\'IA' },
  { id: 'video', icon: '🎬', label: 'Éditeur Vidéo', desc: 'Monter et éditer des vidéos' },
  { id: 'audio', icon: '🎵', label: 'Studio Audio', desc: 'Enregistrer et mixer' },
  { id: 'design', icon: '🎨', label: 'Design Graphique', desc: 'Logos, affiches, branding' },
  { id: 'document', icon: '📄', label: 'Documents', desc: 'PDF, présentations, rapports' },
  { id: 'website', icon: '🌐', label: 'Web Builder', desc: 'Créer des sites web' },
  { id: '3d', icon: '🎮', label: 'Studio 3D', desc: 'Modélisation et rendu 3D' },
  { id: 'avatar', icon: '👤', label: 'Avatar Builder', desc: 'Créer des avatars personnalisés' },
];

export default function CreativeStudioPage() {
  const [activeTab, setActiveTab] = useState<'tools' | 'projects' | 'templates'>('tools');

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        borderRadius: 20, padding: 32, marginBottom: 32, color: '#000',
      }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>🎨 Creative Studio</h1>
        <p style={{ fontSize: 16, margin: '8px 0 0', opacity: 0.8 }}>Créez, éditez et publiez vos contenus</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['tools', 'projects', 'templates'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '12px 24px',
            background: activeTab === tab ? '#f59e0b' : '#1e2420',
            color: activeTab === tab ? '#000' : '#a8a29e',
            border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600,
          }}>
            {tab === 'tools' ? '🛠️ Outils' : tab === 'projects' ? '📁 Projets' : '📋 Templates'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
        {tools.map((tool) => (
          <button key={tool.id} style={{
            background: '#121614', border: '1px solid #2a2a2a', borderRadius: 16,
            padding: 24, cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{tool.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#e8e4dc' }}>{tool.label}</div>
            <div style={{ fontSize: 13, color: '#6b6560' }}>{tool.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
