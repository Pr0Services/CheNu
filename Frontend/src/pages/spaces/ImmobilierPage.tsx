import React from 'react';
export default function ImmobilierPage() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e8e4dc' }}>🏘️ Immobilier</h1>
      <p style={{ color: '#6b6560' }}>Gérez vos propriétés, baux et investissements</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 24 }}>
        <div style={{ background: '#121614', border: '1px solid #2a2a2a', borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontSize: 16, color: '#e8e4dc', margin: '0 0 16px' }}>🏠 Mes Propriétés</h2>
          <div style={{ color: '#6b6560' }}>Aucune propriété enregistrée</div>
        </div>
        <div style={{ background: '#121614', border: '1px solid #2a2a2a', borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontSize: 16, color: '#e8e4dc', margin: '0 0 16px' }}>📋 Baux actifs</h2>
          <div style={{ color: '#6b6560' }}>Aucun bail actif</div>
        </div>
      </div>
    </div>
  );
}
