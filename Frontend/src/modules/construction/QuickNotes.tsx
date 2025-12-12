/**
 * CHE·NU V5.0 - QUICK NOTES (Notes rapides markdown)
 */

import React, { useState, useMemo } from 'react';

const colors = {
  gold: '#D8B26A', stone: '#8D8371', emerald: '#3F7249', turquoise: '#3EB4A2',
  moss: '#2F4C39', slate: '#1E1F22', sand: '#E9E4D6', dark: '#0f1217',
  card: 'rgba(22, 27, 34, 0.95)', border: 'rgba(216, 178, 106, 0.15)',
  red: '#E54D4D', blue: '#4D8BE5', purple: '#8B5CF6', pink: '#EC4899',
};

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folder: string;
  pinned: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

const tagColors: Record<string, string> = {
  'travail': colors.blue, 'personnel': colors.purple, 'urgent': colors.red,
  'idées': colors.gold, 'projets': colors.emerald, 'réunion': colors.turquoise,
};

const mockNotes: Note[] = [
  { id: 'n1', title: 'Liste des tâches projet Tremblay', content: '## Priorité haute\n- [ ] Finaliser plans électriques\n- [x] Commander matériaux\n- [ ] Planifier inspection\n\n## Cette semaine\n- Réunion avec client mardi\n- Vérifier livraison fenêtres', tags: ['travail', 'projets'], folder: 'Projets', pinned: true, archived: false, createdAt: '2024-12-01', updatedAt: '2024-12-05' },
  { id: 'n2', title: 'Notes réunion équipe', content: '### Points discutés\n1. Avancement chantier Plaza\n2. Nouvelle embauche janvier\n3. Formation sécurité obligatoire\n\n**Action:** Envoyer calendrier formations', tags: ['travail', 'réunion'], folder: 'Réunions', pinned: false, archived: false, createdAt: '2024-12-03', updatedAt: '2024-12-03' },
  { id: 'n3', title: 'Idées amélioration processus', content: '- Automatiser les rapports journaliers\n- Application mobile pour photos chantier\n- Tableau Kanban pour suivi tâches\n\n> "Simplifier pour être plus efficace"', tags: ['idées'], folder: 'Général', pinned: false, archived: false, createdAt: '2024-11-28', updatedAt: '2024-12-02' },
  { id: 'n4', title: 'Contact fournisseur béton', content: '**Béton Laval Inc.**\n- Tel: 450-555-1234\n- Email: commandes@betonlaval.ca\n- Contact: Martin Gagnon\n\nPrix négocié: 145$/m³', tags: ['travail'], folder: 'Contacts', pinned: true, archived: false, createdAt: '2024-11-15', updatedAt: '2024-11-20' },
];

const mockFolders = ['Tous', 'Projets', 'Réunions', 'Contacts', 'Général'];

const NoteCard = ({ note, isSelected, onClick }: { note: Note; isSelected: boolean; onClick: () => void }) => (
  <div onClick={onClick} style={{
    padding: 16, background: isSelected ? `${colors.gold}10` : colors.card,
    border: `1px solid ${isSelected ? colors.gold : colors.border}`,
    borderRadius: 12, marginBottom: 10, cursor: 'pointer', position: 'relative',
  }}>
    {note.pinned && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 14 }}>📌</span>}
    <h4 style={{ margin: '0 0 8px', color: colors.sand, fontSize: 15, fontWeight: 600, paddingRight: note.pinned ? 24 : 0 }}>{note.title}</h4>
    <p style={{ margin: '0 0 10px', color: colors.stone, fontSize: 13, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
      {note.content.replace(/[#*\-\[\]>]/g, '').slice(0, 100)}...
    </p>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {note.tags.slice(0, 3).map(tag => (
          <span key={tag} style={{ padding: '2px 8px', background: `${tagColors[tag] || colors.stone}20`, color: tagColors[tag] || colors.stone, borderRadius: 10, fontSize: 10 }}>{tag}</span>
        ))}
      </div>
      <span style={{ color: colors.stone, fontSize: 11 }}>{note.updatedAt}</span>
    </div>
  </div>
);

const QuickNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [selectedFolder, setSelectedFolder] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      if (note.archived) return false;
      if (selectedFolder !== 'Tous' && note.folder !== selectedFolder) return false;
      if (searchQuery && !note.title.toLowerCase().includes(searchQuery.toLowerCase()) && !note.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, selectedFolder, searchQuery]);

  const handleNewNote = () => {
    const newNote: Note = {
      id: `n-${Date.now()}`, title: 'Nouvelle note', content: '', tags: [],
      folder: selectedFolder === 'Tous' ? 'Général' : selectedFolder,
      pinned: false, archived: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setEditMode(true);
    setEditContent('');
  };

  const handleSave = () => {
    if (!selectedNote) return;
    setNotes(notes.map(n => n.id === selectedNote.id ? { ...selectedNote, content: editContent, updatedAt: new Date().toISOString().split('T')[0] } : n));
    setSelectedNote({ ...selectedNote, content: editContent });
    setEditMode(false);
  };

  const handleTogglePin = () => {
    if (!selectedNote) return;
    const updated = { ...selectedNote, pinned: !selectedNote.pinned };
    setNotes(notes.map(n => n.id === selectedNote.id ? updated : n));
    setSelectedNote(updated);
  };

  const handleDelete = () => {
    if (!selectedNote) return;
    setNotes(notes.filter(n => n.id !== selectedNote.id));
    setSelectedNote(filteredNotes[0] || null);
  };

  const renderMarkdown = (content: string) => {
    return content
      .replace(/^### (.*$)/gm, '<h3 style="color: #E9E4D6; margin: 16px 0 8px;">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 style="color: #D8B26A; margin: 20px 0 10px;">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 style="color: #D8B26A; margin: 24px 0 12px;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- \[x\] (.*$)/gm, '<div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;"><input type="checkbox" checked disabled /><span style="text-decoration: line-through; color: #8D8371;">$1</span></div>')
      .replace(/^- \[ \] (.*$)/gm, '<div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;"><input type="checkbox" disabled /><span>$1</span></div>')
      .replace(/^- (.*$)/gm, '<li style="margin: 4px 0 4px 20px;">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li style="margin: 4px 0 4px 20px;">$1</li>')
      .replace(/^> (.*$)/gm, '<blockquote style="border-left: 3px solid #D8B26A; padding-left: 16px; color: #8D8371; font-style: italic; margin: 12px 0;">$1</blockquote>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.dark, color: colors.sand, fontFamily: 'Inter', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: 220, borderRight: `1px solid ${colors.border}`, padding: 20 }}>
        <button onClick={handleNewNote} style={{ width: '100%', padding: '12px 16px', background: colors.gold, border: 'none', borderRadius: 10, color: colors.dark, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 20 }}>+ Nouvelle note</button>
        
        <div style={{ marginBottom: 20 }}>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="🔍 Rechercher..." style={{ width: '100%', padding: '10px 14px', background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, fontSize: 13 }} />
        </div>

        <h4 style={{ color: colors.stone, fontSize: 11, textTransform: 'uppercase', margin: '0 0 12px' }}>Dossiers</h4>
        {mockFolders.map(folder => (
          <button key={folder} onClick={() => setSelectedFolder(folder)} style={{
            width: '100%', padding: '10px 14px', background: selectedFolder === folder ? `${colors.gold}20` : 'transparent',
            border: 'none', borderRadius: 8, color: selectedFolder === folder ? colors.gold : colors.sand,
            fontSize: 14, textAlign: 'left', cursor: 'pointer', marginBottom: 4,
          }}>📁 {folder}</button>
        ))}

        <h4 style={{ color: colors.stone, fontSize: 11, textTransform: 'uppercase', margin: '20px 0 12px' }}>Tags</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Object.entries(tagColors).map(([tag, color]) => (
            <span key={tag} style={{ padding: '4px 10px', background: `${color}20`, color, borderRadius: 12, fontSize: 11, cursor: 'pointer' }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Notes List */}
      <div style={{ width: 320, borderRight: `1px solid ${colors.border}`, padding: 20, overflow: 'auto' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>📝 {selectedFolder} ({filteredNotes.length})</h3>
        {filteredNotes.map(note => (
          <NoteCard key={note.id} note={note} isSelected={selectedNote?.id === note.id} onClick={() => { setSelectedNote(note); setEditMode(false); }} />
        ))}
      </div>

      {/* Note Detail */}
      <div style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        {selectedNote ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div style={{ flex: 1 }}>
                <input type="text" value={selectedNote.title} onChange={e => setSelectedNote({ ...selectedNote, title: e.target.value })}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: colors.sand, fontSize: 24, fontWeight: 700, outline: 'none' }} />
                <div style={{ display: 'flex', gap: 12, marginTop: 8, color: colors.stone, fontSize: 13 }}>
                  <span>📁 {selectedNote.folder}</span>
                  <span>📅 {selectedNote.updatedAt}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleTogglePin} style={{ padding: '8px 12px', background: selectedNote.pinned ? colors.gold : colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: selectedNote.pinned ? colors.dark : colors.sand, cursor: 'pointer' }}>📌</button>
                {editMode ? (
                  <button onClick={handleSave} style={{ padding: '8px 16px', background: colors.emerald, border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>💾 Sauvegarder</button>
                ) : (
                  <button onClick={() => { setEditMode(true); setEditContent(selectedNote.content); }} style={{ padding: '8px 16px', background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, cursor: 'pointer' }}>✏️ Modifier</button>
                )}
                <button onClick={handleDelete} style={{ padding: '8px 12px', background: `${colors.red}20`, border: `1px solid ${colors.red}`, borderRadius: 8, color: colors.red, cursor: 'pointer' }}>🗑️</button>
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {selectedNote.tags.map(tag => (
                <span key={tag} style={{ padding: '4px 12px', background: `${tagColors[tag] || colors.stone}20`, color: tagColors[tag] || colors.stone, borderRadius: 12, fontSize: 12 }}>{tag}</span>
              ))}
              <button style={{ padding: '4px 12px', background: colors.slate, border: `1px dashed ${colors.border}`, borderRadius: 12, color: colors.stone, fontSize: 12, cursor: 'pointer' }}>+ Tag</button>
            </div>

            {/* Content */}
            {editMode ? (
              <textarea value={editContent} onChange={e => setEditContent(e.target.value)} placeholder="Écrivez en Markdown..." style={{
                width: '100%', minHeight: 400, padding: 20, background: colors.card, border: `1px solid ${colors.border}`,
                borderRadius: 12, color: colors.sand, fontSize: 15, lineHeight: 1.8, fontFamily: 'monospace', resize: 'vertical',
              }} />
            ) : (
              <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 24, lineHeight: 1.8, fontSize: 15 }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedNote.content) }} />
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: colors.stone }}>
            <span style={{ fontSize: 48, marginBottom: 16 }}>📝</span>
            <span>Sélectionnez une note</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickNotes;
