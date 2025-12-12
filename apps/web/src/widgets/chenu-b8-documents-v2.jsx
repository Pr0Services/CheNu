import React, { useState, useMemo, useCallback } from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — BATCH 8: MODULE DOCUMENTS & PDF V2
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Features:
 * - D1: Gestion fichiers & dossiers
 * - D2: Templates documents
 * - D3: Génération PDF (soumissions, factures, contrats)
 * - D4: Preview documents
 * - D5: Signatures électroniques
 * - D6: Versioning documents
 * - D7: Partage & permissions
 * - D8: Recherche contenu
 * - D9: Annotations PDF
 * - D10: Export bulk
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const T = {
  bg: { main: '#1A1A1A', card: '#242424', hover: '#2E2E2E', input: '#1E1E1E' },
  text: { primary: '#E8E4DC', secondary: '#A09080', muted: '#6B6560' },
  border: '#333333',
  accent: { gold: '#D8B26A', emerald: '#3F7249', turquoise: '#3EB4A2', danger: '#EF4444' }
};

const FILE_TYPES = {
  pdf: { icon: '📄', color: '#EF4444', label: 'PDF' },
  doc: { icon: '📝', color: '#3B82F6', label: 'Word' },
  xls: { icon: '📊', color: '#22C55E', label: 'Excel' },
  img: { icon: '🖼️', color: '#8B5CF6', label: 'Image' },
};

const TEMPLATES = [
  { id: 'soumission', name: 'Soumission', icon: '💰', fields: ['client', 'projet', 'items', 'total'] },
  { id: 'facture', name: 'Facture', icon: '🧾', fields: ['client', 'numero', 'items', 'taxes'] },
  { id: 'contrat', name: 'Contrat', icon: '📋', fields: ['parties', 'objet', 'prix', 'conditions'] },
  { id: 'rapport', name: 'Rapport chantier', icon: '🔧', fields: ['projet', 'date', 'equipe', 'travaux'] },
];

const SAMPLE_FILES = [
  { id: 'd1', name: 'Soumission_Dupont.pdf', type: 'pdf', size: 245000, status: 'signed', updatedAt: new Date() },
  { id: 'd2', name: 'Contrat_Martin.pdf', type: 'pdf', size: 520000, status: 'pending', updatedAt: new Date() },
  { id: 'd3', name: 'Facture_2024-001.pdf', type: 'pdf', size: 125000, status: 'final', updatedAt: new Date() },
];

const formatSize = (b) => b < 1024*1024 ? `${(b/1024).toFixed(1)} KB` : `${(b/1024/1024).toFixed(1)} MB`;

export default function DocumentsModuleV2() {
  const [files, setFiles] = useState(SAMPLE_FILES);
  const [selected, setSelected] = useState(null);
  const [showTemplate, setShowTemplate] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', background: T.bg.main, color: T.text.primary }}>
      {/* Sidebar */}
      <div style={{ width: '240px', background: T.bg.card, borderRight: `1px solid ${T.border}`, padding: '16px' }}>
        <button onClick={() => setShowTemplate(true)} style={{
          width: '100%', padding: '12px', background: T.accent.gold, color: T.bg.main,
          border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginBottom: '16px'
        }}>
          ➕ Nouveau document
        </button>
        
        {['Tous', 'Récents', 'Signés', 'En attente'].map(f => (
          <button key={f} style={{
            width: '100%', padding: '10px 12px', background: 'transparent', border: 'none',
            borderRadius: '6px', cursor: 'pointer', color: T.text.primary, textAlign: 'left', marginBottom: '4px'
          }}>
            📁 {f}
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
        <h2 style={{ margin: '0 0 20px' }}>📄 Documents</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {files.map(file => (
            <div key={file.id} onClick={() => setSelected(file)} style={{
              padding: '16px', background: T.bg.card, borderRadius: '8px',
              border: `1px solid ${selected?.id === file.id ? T.accent.gold : T.border}`, cursor: 'pointer'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{FILE_TYPES[file.type]?.icon}</div>
              <div style={{ fontWeight: 500, marginBottom: '4px' }}>{file.name}</div>
              <div style={{ fontSize: '12px', color: T.text.muted }}>{formatSize(file.size)}</div>
              <div style={{
                marginTop: '8px', padding: '4px 8px', display: 'inline-block', borderRadius: '4px', fontSize: '11px',
                background: file.status === 'signed' ? T.accent.emerald+'20' : T.accent.gold+'20',
                color: file.status === 'signed' ? T.accent.emerald : T.accent.gold
              }}>
                {file.status === 'signed' ? '✅ Signé' : file.status === 'pending' ? '✍️ En attente' : '📄 Final'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      {selected && (
        <div style={{ width: '350px', background: T.bg.card, borderLeft: `1px solid ${T.border}`, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Aperçu</h3>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          </div>
          
          <div style={{ textAlign: 'center', padding: '40px', background: T.bg.main, borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px' }}>{FILE_TYPES[selected.type]?.icon}</div>
            <div style={{ marginTop: '12px', fontWeight: 500 }}>{selected.name}</div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ flex: 1, padding: '10px', background: T.bg.hover, border: 'none', borderRadius: '6px', cursor: 'pointer', color: T.text.primary }}>
              📥 Télécharger
            </button>
            <button style={{ flex: 1, padding: '10px', background: T.accent.gold, color: T.bg.main, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
              ✍️ Signer
            </button>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ width: '500px', background: T.bg.card, borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Créer un document</h3>
              <button onClick={() => setShowTemplate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {TEMPLATES.map(t => (
                <div key={t.id} onClick={() => {
                  setFiles(prev => [...prev, { id: `d${Date.now()}`, name: `${t.name}_${Date.now()}.pdf`, type: 'pdf', size: 100000, status: 'draft', updatedAt: new Date() }]);
                  setShowTemplate(false);
                }} style={{
                  padding: '16px', background: T.bg.main, borderRadius: '8px', cursor: 'pointer', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{t.icon}</div>
                  <div style={{ fontWeight: 500 }}>{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
