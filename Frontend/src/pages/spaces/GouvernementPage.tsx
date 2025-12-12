import React from 'react';
export default function GouvernementPage() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e8e4dc' }}>🏛️ Gouvernement</h1>
      <p style={{ color: '#6b6560' }}>Impôts, taxes, permis et démarches administratives</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 24 }}>
        {[
          { icon: '💵', label: 'Impôts', desc: 'Déclarations et paiements' },
          { icon: '📋', label: 'Taxes', desc: 'TPS/TVQ, taxes municipales' },
          { icon: '📜', label: 'Permis', desc: 'Demandes et renouvellements' },
          { icon: '📄', label: 'Documents', desc: 'Formulaires officiels' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#121614', border: '1px solid #2a2a2a', borderRadius: 16, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 32 }}>{item.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e8e4dc', marginTop: 8 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: '#6b6560' }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
