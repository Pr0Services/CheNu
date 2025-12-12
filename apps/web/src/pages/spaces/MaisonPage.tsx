/**
 * CHE·NU V25 - ESPACE MAISON (Personnel)
 */

import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

const sections = [
  { id: 'profil', label: 'Mon Profil', icon: '👤', path: '/maison/profil' },
  { id: 'sante', label: 'Santé', icon: '❤️', path: '/maison/sante' },
  { id: 'finances', label: 'Finances', icon: '💰', path: '/maison/finances' },
  { id: 'famille', label: 'Famille', icon: '👨‍👩‍👧', path: '/maison/famille' },
  { id: 'calendrier', label: 'Calendrier', icon: '📅', path: '/maison/calendrier' },
  { id: 'notes', label: 'Notes', icon: '📝', path: '/maison/notes' },
  { id: 'projets', label: 'Projets Perso', icon: '📁', path: '/maison/projets' },
  { id: 'documents', label: 'Documents', icon: '📄', path: '/maison/documents' },
];

const SectionCard = ({ icon, label, description, onClick }: any) => (
  <button onClick={onClick} style={{
    background: '#121614',
    border: '1px solid #2a2a2a',
    borderRadius: 16,
    padding: 24,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
  }}>
    <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontSize: 16, fontWeight: 600, color: '#e8e4dc', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 13, color: '#6b6560' }}>{description}</div>
  </button>
);

export default function MaisonPage() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e8e4dc', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          🏠 Ma Maison
        </h1>
        <p style={{ fontSize: 14, color: '#6b6560', margin: '8px 0 0' }}>
          Votre espace personnel - gérez votre vie privée, famille et projets personnels
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
      }}>
        {sections.map((section) => (
          <NavLink key={section.id} to={section.path} style={{ textDecoration: 'none' }}>
            <SectionCard
              icon={section.icon}
              label={section.label}
              description={`Gérer ${section.label.toLowerCase()}`}
            />
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route path="/profil" element={<div style={{ marginTop: 32, color: '#e8e4dc' }}>Section Profil</div>} />
        <Route path="/sante" element={<div style={{ marginTop: 32, color: '#e8e4dc' }}>Section Santé</div>} />
        <Route path="/finances" element={<div style={{ marginTop: 32, color: '#e8e4dc' }}>Section Finances</div>} />
        <Route path="/famille" element={<div style={{ marginTop: 32, color: '#e8e4dc' }}>Section Famille</div>} />
        <Route path="/calendrier" element={<div style={{ marginTop: 32, color: '#e8e4dc' }}>Section Calendrier</div>} />
        <Route path="/notes" element={<div style={{ marginTop: 32, color: '#e8e4dc' }}>Section Notes</div>} />
        <Route path="/projets" element={<div style={{ marginTop: 32, color: '#e8e4dc' }}>Section Projets Perso</div>} />
        <Route path="/documents" element={<div style={{ marginTop: 32, color: '#e8e4dc' }}>Section Documents</div>} />
      </Routes>
    </div>
  );
}
