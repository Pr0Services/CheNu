/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU V25 - NOTES                                              ║
 * ║              Personal Notes with Folders, Tags & Rich Editor                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';

const colors = {
  gold: '#D8B26A', stone: '#8D8371', emerald: '#3F7249',
  turquoise: '#3EB4A2', moss: '#2F4C39', slate: '#1E1F22', card: '#242424',
  sand: '#E9E4D6', border: '#2A2A2A'
};

const FOLDERS = [
  { id: 'all', name: 'Toutes les notes', icon: '📝', count: 24 },
  { id: 'projects', name: 'Projets', icon: '🏗️', count: 8 },
  { id: 'meetings', name: 'Réunions', icon: '👥', count: 6 },
  { id: 'ideas', name: 'Idées', icon: '💡', count: 5 },
  { id: 'personal', name: 'Personnel', icon: '🔒', count: 3 },
  { id: 'archive', name: 'Archives', icon: '📦', count: 2 }
];

const NOTES = [
  { id: '1', title: 'Notes de réunion - Projet Laval', folder: 'meetings', content: 'Discussion sur les délais et le budget...', tags: ['projet', 'laval'], pinned: true, created: 'Aujourd\'hui 14:30', color: colors.gold },
  { id: '2', title: 'Idées pour le nouveau dashboard', folder: 'ideas', content: 'Intégrer les analytics en temps réel...', tags: ['dashboard', 'ui'], pinned: true, created: 'Hier', color: colors.turquoise },
  { id: '3', title: 'Checklist inspection chantier', folder: 'projects', content: '1. Vérifier les fondations\n2. Contrôle électrique...', tags: ['inspection', 'checklist'], pinned: false, created: 'il y a 2j', color: colors.emerald },
  { id: '4', title: 'Contacts fournisseurs', folder: 'projects', content: 'Liste des fournisseurs approuvés...', tags: ['contacts', 'fournisseurs'], pinned: false, created: 'il y a 3j', color: null }
];

const NoteCard = ({ note, isSelected, onClick }: { note: any; isSelected: boolean; onClick: () => void }) => (
  <div onClick={onClick} style={{ background: isSelected ? colors.moss : colors.slate, border: `1px solid ${isSelected ? colors.gold : colors.border}`, borderRadius: 12, padding: 16, cursor: 'pointer', borderLeft: note.color ? `4px solid ${note.color}` : undefined }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <h4 style={{ color: colors.sand, margin: 0, fontSize: 14, fontWeight: 600 }}>{note.title}</h4>
      {note.pinned && <span style={{ color: colors.gold }}>📌</span>}
    </div>
    <p style={{ color: colors.stone, fontSize: 12, margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.content}</p>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {note.tags.slice(0, 2).map((tag: string) => <span key={tag} style={{ background: colors.card, color: colors.turquoise, padding: '2px 8px', borderRadius: 6, fontSize: 10 }}>#{tag}</span>)}
      </div>
      <span style={{ color: colors.stone, fontSize: 10 }}>{note.created}</span>
    </div>
  </div>
);

export default function Notes() {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedNote, setSelectedNote] = useState(NOTES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteContent, setNoteContent] = useState(selectedNote.content);

  const filteredNotes = NOTES.filter(n => 
    (selectedFolder === 'all' || n.folder === selectedFolder) &&
    (!searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: colors.sand, fontSize: 26, fontWeight: 700, margin: 0 }}>📝 Notes</h1>
          <p style={{ color: colors.stone, margin: '4px 0 0', fontSize: 14 }}>Vos notes personnelles et professionnelles</p>
        </div>
        <button style={{ padding: '12px 24px', background: colors.gold, border: 'none', borderRadius: 10, color: colors.slate, fontWeight: 600, cursor: 'pointer' }}>+ Nouvelle note</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 300px 1fr', gap: 24, height: 'calc(100vh - 200px)' }}>
        {/* Folders */}
        <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 12 }}>
          {FOLDERS.map(folder => (
            <button key={folder.id} onClick={() => setSelectedFolder(folder.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: 12, background: selectedFolder === folder.id ? colors.moss : 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 4 }}>
              <span>{folder.icon}</span>
              <span style={{ color: selectedFolder === folder.id ? colors.gold : colors.sand, fontSize: 13, flex: 1, textAlign: 'left' }}>{folder.name}</span>
              <span style={{ color: colors.stone, fontSize: 11 }}>{folder.count}</span>
            </button>
          ))}
          <div style={{ borderTop: `1px solid ${colors.border}`, marginTop: 12, paddingTop: 12 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: 12, background: 'transparent', border: `1px dashed ${colors.stone}`, borderRadius: 8, cursor: 'pointer', color: colors.stone, fontSize: 13 }}>
              + Nouveau dossier
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="🔍 Rechercher..." style={{ padding: 12, background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 10, color: colors.sand, fontSize: 13 }} />
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredNotes.map(note => <NoteCard key={note.id} note={note} isSelected={selectedNote?.id === note.id} onClick={() => { setSelectedNote(note); setNoteContent(note.content); }} />)}
          </div>
        </div>

        {/* Editor */}
        {selectedNote && (
          <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 16, borderBottom: `1px solid ${colors.border}` }}>
              <input value={selectedNote.title} style={{ width: '100%', background: 'transparent', border: 'none', color: colors.sand, fontSize: 20, fontWeight: 600, outline: 'none' }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {selectedNote.tags.map((tag: string) => <span key={tag} style={{ background: colors.card, color: colors.turquoise, padding: '4px 10px', borderRadius: 8, fontSize: 11 }}>#{tag}</span>)}
                <button style={{ background: 'none', border: `1px dashed ${colors.stone}`, borderRadius: 8, padding: '4px 10px', color: colors.stone, cursor: 'pointer', fontSize: 11 }}>+ Tag</button>
              </div>
            </div>
            <div style={{ padding: 12, borderBottom: `1px solid ${colors.border}`, display: 'flex', gap: 8 }}>
              {['B', 'I', 'U', 'S', '📋', '🔗', '📷', '📝', '✅'].map((tool, i) => (
                <button key={i} style={{ width: 32, height: 32, background: colors.card, border: 'none', borderRadius: 6, color: colors.sand, cursor: 'pointer', fontSize: 14, fontWeight: i < 4 ? 700 : 400 }}>{tool}</button>
              ))}
            </div>
            <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} style={{ flex: 1, padding: 16, background: 'transparent', border: 'none', color: colors.sand, fontSize: 14, lineHeight: 1.8, resize: 'none', outline: 'none', fontFamily: 'inherit' }} />
            <div style={{ padding: 12, borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: colors.stone, fontSize: 11 }}>Modifié {selectedNote.created}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: colors.card, border: 'none', borderRadius: 6, padding: '8px 16px', color: colors.stone, cursor: 'pointer', fontSize: 12 }}>🗑️ Supprimer</button>
                <button style={{ background: colors.gold, border: 'none', borderRadius: 6, padding: '8px 16px', color: colors.slate, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>💾 Sauvegarder</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
