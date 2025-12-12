import React from 'react';
export default function ProjetPage() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e8e4dc' }}>📁 Projets</h1>
      <p style={{ color: '#6b6560' }}>Gérez vos projets professionnels et personnels</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 }}>
        {['Projet Alpha', 'Résidence Laval', 'Rénovation Bureau'].map((p, i) => (
          <div key={i} style={{ background: '#121614', border: '1px solid #2a2a2a', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#e8e4dc' }}>{p}</div>
            <div style={{ fontSize: 13, color: '#6b6560', marginTop: 4 }}>En cours • 65%</div>
            <div style={{ height: 4, background: '#2a2a2a', borderRadius: 2, marginTop: 12 }}>
              <div style={{ width: '65%', height: '100%', background: '#4ade80', borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
