import React, { useState } from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — BATCH 8: REPORTS & ANALYTICS V2
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const T = {
  bg: { main: '#1A1A1A', card: '#242424', hover: '#2E2E2E' },
  text: { primary: '#E8E4DC', secondary: '#A09080', muted: '#6B6560' },
  border: '#333333',
  accent: { gold: '#D8B26A', emerald: '#3F7249', turquoise: '#3EB4A2', danger: '#EF4444' }
};

const KPIs = [
  { label: 'Revenus', value: '$145,230', change: '+12.5%', up: true },
  { label: 'Projets', value: '8', change: '+2', up: true },
  { label: 'Marge', value: '32.4%', change: '-1.2%', up: false },
  { label: 'Heures', value: '1,240h', change: '+8.3%', up: true },
];

const REVENUE = [
  { m: 'Juil', v: 85 }, { m: 'Août', v: 92 }, { m: 'Sep', v: 88 },
  { m: 'Oct', v: 105 }, { m: 'Nov', v: 125 }, { m: 'Déc', v: 145 },
];

export default function ReportsModuleV2() {
  const [tab, setTab] = useState('dashboard');

  return (
    <div style={{ display: 'flex', height: '100vh', background: T.bg.main, color: T.text.primary }}>
      {/* Sidebar */}
      <div style={{ width: '220px', background: T.bg.card, borderRight: `1px solid ${T.border}`, padding: '16px' }}>
        <h3 style={{ margin: '0 0 16px' }}>📈 Rapports</h3>
        {['dashboard', 'create', 'history'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            width: '100%', padding: '10px', background: tab === t ? T.accent.gold+'20' : 'transparent',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            color: tab === t ? T.accent.gold : T.text.primary, textAlign: 'left', marginBottom: '4px'
          }}>
            {t === 'dashboard' ? '📊 Tableau de bord' : t === 'create' ? '➕ Créer' : '📁 Historique'}
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
        {tab === 'dashboard' && (
          <>
            <h2 style={{ margin: '0 0 20px' }}>Tableau de bord</h2>
            
            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {KPIs.map(k => (
                <div key={k.label} style={{ padding: '16px', background: T.bg.card, borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: T.text.muted }}>{k.label}</div>
                  <div style={{ fontSize: '24px', fontWeight: 600, margin: '4px 0' }}>{k.value}</div>
                  <div style={{ fontSize: '12px', color: k.up ? T.accent.emerald : T.accent.danger }}>
                    {k.up ? '↑' : '↓'} {k.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div style={{ padding: '20px', background: T.bg.card, borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 20px' }}>💰 Revenus (k$)</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '180px' }}>
                {REVENUE.map(d => (
                  <div key={d.m} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{
                      height: `${d.v * 1.2}px`, background: T.accent.gold,
                      borderRadius: '4px 4px 0 0', margin: '0 auto', width: '80%'
                    }} />
                    <div style={{ fontSize: '11px', color: T.text.muted, marginTop: '8px' }}>{d.m}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'create' && (
          <>
            <h2 style={{ margin: '0 0 20px' }}>Créer un rapport</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { icon: '📊', name: 'Sommaire projet' },
                { icon: '💰', name: 'Rapport financier' },
                { icon: '👥', name: 'Performance équipe' },
                { icon: '🧾', name: 'Facturation' },
                { icon: '📦', name: 'Matériaux' },
                { icon: '✅', name: 'Conformité' },
              ].map(r => (
                <div key={r.name} style={{
                  padding: '20px', background: T.bg.card, borderRadius: '8px', cursor: 'pointer', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{r.icon}</div>
                  <div style={{ fontWeight: 500 }}>{r.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'history' && (
          <>
            <h2 style={{ margin: '0 0 20px' }}>Historique</h2>
            {['Rapport Nov 2024', 'Performance Q4', 'Projet Dupont'].map(r => (
              <div key={r} style={{
                padding: '16px', background: T.bg.card, borderRadius: '8px', marginBottom: '12px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span>{r}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '6px 12px', background: T.bg.hover, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>📥</button>
                  <button style={{ padding: '6px 12px', background: T.bg.hover, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
