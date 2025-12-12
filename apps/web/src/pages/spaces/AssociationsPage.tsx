import React from 'react';
export default function AssociationsPage() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e8e4dc' }}>🤝 Associations</h1>
      <p style={{ color: '#6b6560' }}>Gérez vos organisations et collaborations</p>
      <div style={{ background: '#121614', border: '1px solid #2a2a2a', borderRadius: 16, padding: 32, marginTop: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>🤝</div>
        <div style={{ fontSize: 16, color: '#e8e4dc', marginTop: 12 }}>Aucune association</div>
        <button style={{ marginTop: 16, padding: '10px 20px', background: '#4ade80', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          + Rejoindre ou créer
        </button>
      </div>
    </div>
  );
}
