/**
 * CHE·NU V25 - DASHBOARD PAGE
 */

import React from 'react';

const StatsCard = ({ title, value, icon, trend }: { title: string; value: string | number; icon: string; trend?: number }) => (
  <div style={{
    background: '#121614',
    border: '1px solid #2a2a2a',
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    gap: 16,
    alignItems: 'center',
  }}>
    <div style={{
      width: 48, height: 48,
      background: '#1e2420',
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#e8e4dc' }}>{value}</div>
      <div style={{ fontSize: 13, color: '#6b6560' }}>{title}</div>
      {trend !== undefined && (
        <div style={{ fontSize: 12, color: trend >= 0 ? '#4ade80' : '#ef4444' }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  </div>
);

export default function DashboardPage() {
  const stats = [
    { title: 'Projets actifs', value: 12, icon: '📁', trend: 8 },
    { title: 'Tâches à faire', value: 47, icon: '✅', trend: -12 },
    { title: 'Documents', value: 234, icon: '📄', trend: 5 },
    { title: 'Revenus du mois', value: '45,280$', icon: '💰', trend: 15 },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e8e4dc', margin: 0 }}>Bonjour! 👋</h1>
        <p style={{ fontSize: 14, color: '#6b6560', margin: '4px 0 0' }}>Voici un aperçu de votre journée</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
        marginBottom: 32,
      }}>
        {stats.map((stat, i) => <StatsCard key={i} {...stat} />)}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: 24,
      }}>
        <div style={{ background: '#121614', border: '1px solid #2a2a2a', borderRadius: 16, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e8e4dc', margin: '0 0 16px' }}>Activité récente</h2>
          {['Tâche complétée', 'Document ajouté', 'Nouveau commentaire'].map((item, i) => (
            <div key={i} style={{ padding: 12, background: '#1e2420', borderRadius: 10, marginBottom: 8, color: '#a8a29e', fontSize: 14 }}>
              {item}
            </div>
          ))}
        </div>
        <div style={{ background: '#121614', border: '1px solid #2a2a2a', borderRadius: 16, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e8e4dc', margin: '0 0 16px' }}>À venir</h2>
          {['Réunion client - 15 DÉC', 'Échéance RBQ - 17 DÉC'].map((item, i) => (
            <div key={i} style={{ padding: 12, background: '#1e2420', borderRadius: 10, marginBottom: 8, color: '#a8a29e', fontSize: 14 }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
