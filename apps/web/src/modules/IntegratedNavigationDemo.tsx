/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║            CHE·NU V25 - INTEGRATED NAVIGATION SYSTEM DEMO                    ║
 * ║                                                                              ║
 * ║  All navigation components working together:                                 ║
 * ║  1. Tab System (top) - Browser-like multi-page                              ║
 * ║  2. Breadcrumbs (below tabs) - Context & path                               ║
 * ║  3. Navigation Hub (⌘+K) - Universal command center                         ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const tokens = {
  colors: {
    gold: '#D8B26A',
    turquoise: '#3EB4A2',
    bg: { primary: '#0f1217', secondary: '#161B22', tertiary: '#1E242C', hover: '#2D3640' },
    text: { primary: '#F4F0EB', secondary: '#B8B0A8', muted: '#6B6560' },
    border: { default: 'rgba(216, 178, 106, 0.15)' },
    spaces: {
      maison: '#4ade80', entreprise: '#3b82f6', projets: '#8b5cf6',
      creative: '#f59e0b', gouvernement: '#06b6d4', immobilier: '#ec4899', associations: '#14b8a6',
    } as Record<string, string>,
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 4, md: 8, lg: 12, xl: 20 },
};

const SPACES: Record<string, { icon: string; label: string }> = {
  maison: { icon: '🏠', label: 'Maison' },
  entreprise: { icon: '🏢', label: 'Entreprise' },
  projets: { icon: '📁', label: 'Projets' },
  creative: { icon: '🎨', label: 'Creative' },
  gouvernement: { icon: '🏛️', label: 'Gouvernement' },
  immobilier: { icon: '🏘️', label: 'Immobilier' },
  associations: { icon: '🤝', label: 'Associations' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MINI TAB SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

interface Tab { id: string; title: string; icon: string; path: string; space?: string; isPinned?: boolean; }

const MiniTabSystem: React.FC<{
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onNewTab: () => void;
}> = ({ tabs, activeTabId, onTabClick, onTabClose, onNewTab }) => {
  const sortedTabs = [...tabs].sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1));
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: tokens.colors.bg.primary, borderBottom: `1px solid ${tokens.colors.border.default}`, padding: '0 8px' }}>
      <div style={{ display: 'flex', gap: 1, flex: 1, overflowX: 'auto' }}>
        {sortedTabs.map(tab => {
          const isActive = tab.id === activeTabId;
          const spaceColor = tab.space ? tokens.colors.spaces[tab.space] : tokens.colors.gold;
          return (
            <div
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: tab.isPinned ? '8px' : '8px 12px',
                backgroundColor: isActive ? tokens.colors.bg.tertiary : tokens.colors.bg.secondary,
                borderTop: `2px solid ${isActive ? spaceColor : 'transparent'}`,
                cursor: 'pointer', minWidth: tab.isPinned ? 40 : 100, maxWidth: tab.isPinned ? 40 : 180,
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 14 }}>{tab.icon}</span>
              {!tab.isPinned && (
                <span style={{ fontSize: 12, color: tokens.colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {tab.title}
                </span>
              )}
              {!tab.isPinned && (
                <button
                  onClick={(e) => { e.stopPropagation(); onTabClose(tab.id); }}
                  style={{ width: 14, height: 14, backgroundColor: 'transparent', border: 'none', color: tokens.colors.text.muted, cursor: 'pointer', fontSize: 10, opacity: isActive ? 1 : 0.5 }}
                >✕</button>
              )}
              {isActive && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: spaceColor }} />}
            </div>
          );
        })}
      </div>
      <button onClick={onNewTab} style={{ width: 24, height: 24, backgroundColor: 'transparent', border: `1px solid ${tokens.colors.border.default}`, borderRadius: 4, color: tokens.colors.text.muted, cursor: 'pointer', marginLeft: 8 }}>+</button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MINI BREADCRUMBS
// ═══════════════════════════════════════════════════════════════════════════════

interface BreadcrumbItem { id: string; label: string; icon: string; }

const MiniBreadcrumbs: React.FC<{ items: BreadcrumbItem[]; space: string; }> = ({ items, space }) => {
  const spaceInfo = SPACES[space] || SPACES.entreprise;
  const spaceColor = tokens.colors.spaces[space] || tokens.colors.gold;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: tokens.colors.bg.secondary, borderBottom: `1px solid ${tokens.colors.border.default}` }}>
      <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${spaceColor}20`, border: `2px solid ${spaceColor}`, borderRadius: 8 }}>
        <span style={{ fontSize: 14 }}>{spaceInfo.icon}</span>
      </div>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L9 7L5 11" stroke={tokens.colors.text.muted} strokeWidth="1.5" strokeLinecap="round" /></svg>
      {items.map((item, idx) => (
        <React.Fragment key={item.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', backgroundColor: idx === items.length - 1 ? `${tokens.colors.gold}15` : 'transparent', borderRadius: 6, cursor: idx === items.length - 1 ? 'default' : 'pointer' }}>
            <span style={{ fontSize: 12 }}>{item.icon}</span>
            <span style={{ fontSize: 12, color: idx === items.length - 1 ? tokens.colors.gold : tokens.colors.text.secondary }}>{item.label}</span>
          </div>
          {idx < items.length - 1 && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2L8 6L4 10" stroke={tokens.colors.text.muted} strokeWidth="1.5" strokeLinecap="round" /></svg>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MINI NAVIGATION HUB
// ═══════════════════════════════════════════════════════════════════════════════

const SPACES_LIST = [
  { id: 'maison', icon: '🏠', label: 'Maison', shortcut: '⌘1' },
  { id: 'entreprise', icon: '🏢', label: 'Entreprise', shortcut: '⌘2' },
  { id: 'projets', icon: '📁', label: 'Projets', shortcut: '⌘3' },
  { id: 'creative', icon: '🎨', label: 'Creative', shortcut: '⌘4' },
  { id: 'gouvernement', icon: '🏛️', label: 'Gouv.', shortcut: '⌘5' },
  { id: 'immobilier', icon: '🏘️', label: 'Immo.', shortcut: '⌘6' },
  { id: 'associations', icon: '🤝', label: 'Assoc.', shortcut: '⌘7' },
];

const ACTIONS = [
  { id: 'project', icon: '➕', label: 'Nouveau Projet', shortcut: 'N P' },
  { id: 'task', icon: '✅', label: 'Nouvelle Tâche', shortcut: 'N T' },
  { id: 'invoice', icon: '🧾', label: 'Nouvelle Facture', shortcut: 'N I' },
  { id: 'contact', icon: '👤', label: 'Nouveau Contact', shortcut: 'N C' },
];

const NOVA = [
  { id: 'ask', icon: '💬', label: 'Demander à Nova' },
  { id: 'summarize', icon: '📋', label: 'Résumer la page' },
  { id: 'translate', icon: '🌐', label: 'Traduire' },
];

const MiniNavigationHub: React.FC<{ isOpen: boolean; onClose: () => void; onNavigate: (space: string) => void; }> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  
  useEffect(() => { if (isOpen) setQuery(''); }, [isOpen]);
  
  const allItems = [...SPACES_LIST, ...ACTIONS, ...NOVA];
  const filtered = query ? allItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : null;
  
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setSelectedIdx(i => Math.min(i + 1, (filtered || allItems).length - 1));
      if (e.key === 'ArrowUp') setSelectedIdx(i => Math.max(i - 1, 0));
      if (e.key === 'Enter') {
        const items = filtered || SPACES_LIST;
        if (items[selectedIdx]) {
          onNavigate(items[selectedIdx].id);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, onNavigate, selectedIdx, filtered]);
  
  if (!isOpen) return null;
  
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh', backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 600, backgroundColor: tokens.colors.bg.secondary, borderRadius: tokens.radius.xl, border: `1px solid ${tokens.colors.border.default}`, boxShadow: '0 25px 80px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
        {/* Search */}
        <div style={{ padding: 16, borderBottom: `1px solid ${tokens.colors.border.default}`, backgroundColor: tokens.colors.bg.tertiary }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', backgroundColor: tokens.colors.bg.primary, borderRadius: 12, border: `1px solid ${tokens.colors.border.default}` }}>
            <span>🔍</span>
            <input
              autoFocus
              value={query}
              onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
              placeholder="Rechercher, naviguer, créer, demander à Nova..."
              style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', fontSize: 15, color: tokens.colors.text.primary }}
            />
            <kbd style={{ padding: '4px 8px', backgroundColor: tokens.colors.bg.tertiary, borderRadius: 6, fontSize: 11, color: tokens.colors.text.muted }}>ESC</kbd>
          </div>
        </div>
        
        {/* Content */}
        <div style={{ padding: 16, maxHeight: 400, overflowY: 'auto' }}>
          {filtered ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => { onNavigate(item.id); onClose(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                    backgroundColor: idx === selectedIdx ? `${tokens.colors.gold}20` : 'transparent',
                    borderLeft: idx === selectedIdx ? `3px solid ${tokens.colors.gold}` : '3px solid transparent',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ flex: 1, fontSize: 14, color: tokens.colors.text.primary }}>{item.label}</span>
                  {'shortcut' in item && <kbd style={{ padding: '3px 6px', backgroundColor: tokens.colors.bg.tertiary, borderRadius: 4, fontSize: 10, color: tokens.colors.text.muted }}>{item.shortcut}</kbd>}
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Spaces Grid */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: tokens.colors.text.muted, marginBottom: 8 }}>🌐 Espaces</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                  {SPACES_LIST.map((s, idx) => (
                    <div
                      key={s.id}
                      onClick={() => { onNavigate(s.id); onClose(); }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        padding: 12, backgroundColor: tokens.colors.bg.tertiary, borderRadius: 12, cursor: 'pointer',
                        border: `2px solid ${idx === selectedIdx ? tokens.colors.spaces[s.id] : 'transparent'}`,
                        transform: idx === selectedIdx ? 'scale(1.05)' : 'none', transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{s.icon}</span>
                      <span style={{ fontSize: 9, color: tokens.colors.text.secondary }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: tokens.colors.text.muted, marginBottom: 8 }}>⚡ Actions</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {ACTIONS.map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', backgroundColor: tokens.colors.bg.tertiary, borderRadius: 8, cursor: 'pointer' }}>
                      <span>{a.icon}</span>
                      <span style={{ flex: 1, fontSize: 12, color: tokens.colors.text.secondary }}>{a.label}</span>
                      <kbd style={{ padding: '2px 5px', backgroundColor: tokens.colors.bg.secondary, borderRadius: 4, fontSize: 9, color: tokens.colors.text.muted }}>{a.shortcut}</kbd>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Nova */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: tokens.colors.text.muted, marginBottom: 8 }}>🤖 Nova AI</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {NOVA.map(n => (
                    <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', backgroundColor: tokens.colors.bg.tertiary, borderRadius: 8, cursor: 'pointer' }}>
                      <span>{n.icon}</span>
                      <span style={{ fontSize: 11, color: tokens.colors.text.secondary }}>{n.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderTop: `1px solid ${tokens.colors.border.default}`, backgroundColor: tokens.colors.bg.tertiary }}>
          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: tokens.colors.text.muted }}>
            <span><kbd style={{ padding: '2px 5px', backgroundColor: tokens.colors.bg.secondary, borderRadius: 4, marginRight: 4 }}>↑↓</kbd>Naviguer</span>
            <span><kbd style={{ padding: '2px 5px', backgroundColor: tokens.colors.bg.secondary, borderRadius: 4, marginRight: 4 }}>↵</kbd>Sélectionner</span>
          </div>
          <div style={{ fontSize: 11, color: tokens.colors.text.muted }}><span style={{ color: tokens.colors.gold }}>CHE·NU</span> V25</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN INTEGRATED DEMO
// ═══════════════════════════════════════════════════════════════════════════════

const IntegratedNavigationDemo: React.FC = () => {
  const [hubOpen, setHubOpen] = useState(false);
  const [currentSpace, setCurrentSpace] = useState('projets');
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'dashboard', title: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'projet-abc', title: 'Projet ABC', icon: '🏗️', path: '/projets/abc', space: 'projets' },
    { id: 'taches', title: 'Tâches', icon: '✅', path: '/projets/abc/taches', space: 'projets' },
    { id: 'nova', title: 'Nova', icon: '🤖', path: '/nova', isPinned: true },
  ]);
  const [activeTabId, setActiveTabId] = useState('taches');
  const [tabCounter, setTabCounter] = useState(5);
  
  const breadcrumbs = [
    { id: '1', label: 'Projet ABC', icon: '🏗️' },
    { id: '2', label: 'Tâches', icon: '✅' },
    { id: '3', label: 'T-2024-089', icon: '📋' },
  ];
  
  // Keyboard shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setHubOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
  
  const handleNavigate = (spaceId: string) => {
    if (SPACES[spaceId]) {
      setCurrentSpace(spaceId);
    }
  };
  
  const handleTabClose = (id: string) => {
    setTabs(tabs.filter(t => t.id !== id));
    if (activeTabId === id && tabs.length > 1) {
      setActiveTabId(tabs[tabs.length - 2].id);
    }
  };
  
  const handleNewTab = () => {
    const newTab = { id: `tab-${tabCounter}`, title: `Onglet ${tabCounter}`, icon: '📄', path: `/new/${tabCounter}` };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setTabCounter(c => c + 1);
  };
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0d0b', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: `1px solid ${tokens.colors.border.default}`, backgroundColor: tokens.colors.bg.secondary }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${tokens.colors.gold}, ${tokens.colors.turquoise})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#000' }}>CN</div>
          <span style={{ fontSize: 18, fontWeight: 600, color: tokens.colors.text.primary }}>CHE·NU V25</span>
        </div>
        
        <button
          onClick={() => setHubOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: tokens.colors.bg.tertiary, border: `1px solid ${tokens.colors.border.default}`, borderRadius: 10, cursor: 'pointer', color: tokens.colors.text.secondary, fontSize: 13 }}
        >
          <span>🔍</span>
          <span>Rechercher...</span>
          <kbd style={{ padding: '3px 6px', backgroundColor: tokens.colors.bg.secondary, borderRadius: 4, fontSize: 10, color: tokens.colors.text.muted }}>⌘K</kbd>
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 20, cursor: 'pointer' }}>🔔</span>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${tokens.colors.spaces[currentSpace]}, ${tokens.colors.gold})`, borderRadius: 8 }} />
        </div>
      </header>
      
      {/* Tab System */}
      <MiniTabSystem
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={setActiveTabId}
        onTabClose={handleTabClose}
        onNewTab={handleNewTab}
      />
      
      {/* Breadcrumbs */}
      <MiniBreadcrumbs items={breadcrumbs} space={currentSpace} />
      
      {/* Main Content */}
      <main style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{ width: 240, borderRight: `1px solid ${tokens.colors.border.default}`, padding: 16, backgroundColor: tokens.colors.bg.secondary }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: tokens.colors.text.muted, marginBottom: 12 }}>Espaces</div>
          {Object.entries(SPACES).map(([id, space]) => (
            <div
              key={id}
              onClick={() => setCurrentSpace(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 4,
                backgroundColor: currentSpace === id ? `${tokens.colors.spaces[id]}20` : 'transparent',
                borderLeft: currentSpace === id ? `3px solid ${tokens.colors.spaces[id]}` : '3px solid transparent',
              }}
            >
              <span style={{ fontSize: 16 }}>{space.icon}</span>
              <span style={{ fontSize: 13, color: currentSpace === id ? tokens.colors.text.primary : tokens.colors.text.secondary }}>{space.label}</span>
            </div>
          ))}
        </aside>
        
        {/* Content */}
        <div style={{ flex: 1, padding: 32 }}>
          <div style={{ backgroundColor: tokens.colors.bg.secondary, borderRadius: tokens.radius.lg, padding: 32, border: `1px solid ${tokens.colors.border.default}`, textAlign: 'center' }}>
            <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>
              {tabs.find(t => t.id === activeTabId)?.icon || '📄'}
            </span>
            <h1 style={{ color: tokens.colors.text.primary, fontSize: 24, marginBottom: 8 }}>
              {tabs.find(t => t.id === activeTabId)?.title || 'Contenu'}
            </h1>
            <p style={{ color: tokens.colors.text.muted }}>
              Espace: <span style={{ color: tokens.colors.spaces[currentSpace] }}>{SPACES[currentSpace].label}</span>
            </p>
            
            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button
                onClick={() => setHubOpen(true)}
                style={{ padding: '12px 24px', backgroundColor: tokens.colors.gold, color: '#000', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <span>🔍</span> Ouvrir le Hub <kbd style={{ padding: '2px 6px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4, fontSize: 11, marginLeft: 8 }}>⌘K</kbd>
              </button>
            </div>
          </div>
          
          {/* Features */}
          <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { icon: '📑', title: 'Tab System', desc: 'Onglets multiples avec drag & drop, pin, context menu' },
              { icon: '🧭', title: 'Breadcrumbs', desc: 'Chemin contextuel avec indicateur d\'espace' },
              { icon: '🚀', title: 'Navigation Hub', desc: 'Recherche universelle, actions, Nova AI intégré' },
            ].map((f, i) => (
              <div key={i} style={{ padding: 20, backgroundColor: tokens.colors.bg.secondary, borderRadius: 12, border: `1px solid ${tokens.colors.border.default}` }}>
                <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>{f.icon}</span>
                <div style={{ color: tokens.colors.text.primary, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{f.title}</div>
                <div style={{ color: tokens.colors.text.muted, fontSize: 12 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Navigation Hub Modal */}
      <MiniNavigationHub
        isOpen={hubOpen}
        onClose={() => setHubOpen(false)}
        onNavigate={handleNavigate}
      />
      
      {/* Floating Shortcut Reminder */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, padding: '12px 20px', backgroundColor: tokens.colors.bg.tertiary, borderRadius: 12, border: `1px solid ${tokens.colors.border.default}`, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: 11, color: tokens.colors.text.muted, marginBottom: 8 }}>RACCOURCIS</div>
        <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
          <span><kbd style={{ padding: '2px 6px', backgroundColor: tokens.colors.bg.secondary, borderRadius: 4, marginRight: 4 }}>⌘K</kbd><span style={{ color: tokens.colors.text.secondary }}>Hub</span></span>
          <span><kbd style={{ padding: '2px 6px', backgroundColor: tokens.colors.bg.secondary, borderRadius: 4, marginRight: 4 }}>⌘1-7</kbd><span style={{ color: tokens.colors.text.secondary }}>Espaces</span></span>
        </div>
      </div>
    </div>
  );
};

export default IntegratedNavigationDemo;
