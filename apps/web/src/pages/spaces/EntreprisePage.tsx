/**
 * CHE·NU V25 - ESPACE ENTREPRISE
 */

import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

const sections = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/entreprise/dashboard' },
  { id: 'projets', label: 'Projets', icon: '📁', path: '/entreprise/projets' },
  { id: 'taches', label: 'Tâches', icon: '✅', path: '/entreprise/taches' },
  { id: 'equipe', label: 'Équipe', icon: '👥', path: '/entreprise/equipe' },
  { id: 'clients', label: 'Clients', icon: '🤝', path: '/entreprise/clients' },
  { id: 'fournisseurs', label: 'Fournisseurs', icon: '🏭', path: '/entreprise/fournisseurs' },
  { id: 'comptabilite', label: 'Comptabilité', icon: '💰', path: '/entreprise/comptabilite' },
  { id: 'documents', label: 'Documents', icon: '📄', path: '/entreprise/documents' },
  { id: 'conformite', label: 'Conformité QC', icon: '🍁', path: '/entreprise/conformite' },
];

export default function EntreprisePage() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e8e4dc', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          🏢 Mon Entreprise
        </h1>
        <p style={{ fontSize: 14, color: '#6b6560', margin: '8px 0 0' }}>
          Gérez votre entreprise, équipe, projets et finances
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {sections.map((section) => (
          <NavLink
            key={section.id}
            to={section.path}
            style={({ isActive }) => ({
              padding: '10px 16px',
              background: isActive ? '#4ade80' : '#1e2420',
              color: isActive ? '#000' : '#a8a29e',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
            })}
          >
            <span>{section.icon}</span>
            <span>{section.label}</span>
          </NavLink>
        ))}
      </div>

      <div style={{ background: '#121614', border: '1px solid #2a2a2a', borderRadius: 16, padding: 24 }}>
        <Routes>
          <Route index element={<EntrepriseDashboard />} />
          <Route path="/dashboard" element={<EntrepriseDashboard />} />
          <Route path="/projets" element={<div style={{ color: '#e8e4dc' }}>Liste des projets</div>} />
          <Route path="/taches" element={<div style={{ color: '#e8e4dc' }}>Gestion des tâches</div>} />
          <Route path="/equipe" element={<div style={{ color: '#e8e4dc' }}>Gestion de l'équipe</div>} />
          <Route path="/clients" element={<div style={{ color: '#e8e4dc' }}>CRM Clients</div>} />
          <Route path="/fournisseurs" element={<div style={{ color: '#e8e4dc' }}>Gestion fournisseurs</div>} />
          <Route path="/comptabilite" element={<div style={{ color: '#e8e4dc' }}>Comptabilité & Finance</div>} />
          <Route path="/documents" element={<div style={{ color: '#e8e4dc' }}>Documents entreprise</div>} />
          <Route path="/conformite" element={<ConformiteQC />} />
        </Routes>
      </div>
    </div>
  );
}

function EntrepriseDashboard() {
  const kpis = [
    { label: 'Revenus MTD', value: '125,480$', trend: '+12%' },
    { label: 'Projets actifs', value: '8', trend: '+2' },
    { label: 'Factures en attente', value: '12,350$', trend: '-5%' },
    { label: 'Heures ce mois', value: '342h', trend: '+8%' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>Dashboard Entreprise</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ background: '#1e2420', padding: 16, borderRadius: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#e8e4dc' }}>{kpi.value}</div>
            <div style={{ fontSize: 13, color: '#6b6560' }}>{kpi.label}</div>
            <div style={{ fontSize: 12, color: kpi.trend.startsWith('+') ? '#4ade80' : '#ef4444', marginTop: 4 }}>{kpi.trend}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConformiteQC() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>🍁 Conformité Québec</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { name: 'CCQ', desc: 'Commission Construction Québec', status: 'Conforme' },
          { name: 'CNESST', desc: 'Santé et Sécurité', status: 'Conforme' },
          { name: 'RBQ', desc: 'Régie du Bâtiment', status: 'À renouveler' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#1e2420', padding: 16, borderRadius: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#e8e4dc' }}>{item.name}</div>
            <div style={{ fontSize: 12, color: '#6b6560', marginBottom: 8 }}>{item.desc}</div>
            <div style={{
              fontSize: 12,
              padding: '4px 8px',
              background: item.status === 'Conforme' ? '#4ade8020' : '#f59e0b20',
              color: item.status === 'Conforme' ? '#4ade80' : '#f59e0b',
              borderRadius: 4,
              display: 'inline-block',
            }}>{item.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
