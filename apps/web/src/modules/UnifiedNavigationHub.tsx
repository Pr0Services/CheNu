/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                   CHE·NU V25 - UNIFIED NAVIGATION HUB                        ║
 * ║                                                                              ║
 * ║  The Ultimate Command Center - Everything in One Place                       ║
 * ║  ─────────────────────────────────────────────────────                       ║
 * ║                                                                              ║
 * ║  Features:                                                                   ║
 * ║  • Universal Search (files, contacts, projects, messages)                    ║
 * ║  • Quick Navigation (⌘+1-7 for spaces)                                       ║
 * ║  • Actions (create anything)                                                 ║
 * ║  • Nova AI Integration (ask anything)                                        ║
 * ║  • Recent Items                                                              ║
 * ║  • Favorites / Bookmarks                                                     ║
 * ║  • Keyboard-first design                                                     ║
 * ║                                                                              ║
 * ║  Trigger: ⌘+K (or Ctrl+K)                                                    ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const tokens = {
  colors: {
    // Sacred CHE·NU palette
    gold: '#D8B26A',
    goldLight: '#E8C88A',
    goldDark: '#B8924A',
    emerald: '#3F7249',
    emeraldLight: '#4F8259',
    turquoise: '#3EB4A2',
    
    // Backgrounds
    void: '#0a0d0b',
    bg: {
      primary: '#0f1217',
      secondary: '#161B22',
      tertiary: '#1E242C',
      elevated: '#252D38',
      hover: '#2D3640',
    },
    
    // Text
    text: {
      primary: '#F4F0EB',
      secondary: '#B8B0A8',
      muted: '#6B6560',
      accent: '#D8B26A',
    },
    
    // Borders
    border: {
      default: 'rgba(216, 178, 106, 0.15)',
      hover: 'rgba(216, 178, 106, 0.3)',
      focus: 'rgba(216, 178, 106, 0.5)',
    },
    
    // Status
    success: '#4ade80',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    purple: '#8b5cf6',
  },
  
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 10, lg: 16, xl: 24 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface HubItem {
  id: string;
  type: 'navigation' | 'action' | 'search' | 'recent' | 'favorite' | 'nova' | 'space';
  icon: string;
  label: string;
  sublabel?: string;
  shortcut?: string;
  path?: string;
  action?: () => void;
  color?: string;
  badge?: number;
  keywords?: string[];
}

interface HubSection {
  id: string;
  title: string;
  icon: string;
  items: HubItem[];
  collapsed?: boolean;
}

type HubMode = 'default' | 'search' | 'nova' | 'create' | 'goto';

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - SPACES
// ═══════════════════════════════════════════════════════════════════════════════

const SPACES: HubItem[] = [
  { id: 'maison', type: 'space', icon: '🏠', label: 'Maison', sublabel: 'Vie personnelle', shortcut: '⌘1', path: '/maison', color: '#4ade80', keywords: ['home', 'personal', 'famille'] },
  { id: 'entreprise', type: 'space', icon: '🏢', label: 'Entreprise', sublabel: 'Gestion business', shortcut: '⌘2', path: '/entreprise', color: '#3b82f6', keywords: ['business', 'company', 'work'] },
  { id: 'projets', type: 'space', icon: '📁', label: 'Projets', sublabel: 'Gestion de projets', shortcut: '⌘3', path: '/projets', color: '#8b5cf6', keywords: ['projects', 'tasks', 'management'] },
  { id: 'creative', type: 'space', icon: '🎨', label: 'Creative Studio', sublabel: '1-CLIC création', shortcut: '⌘4', path: '/creative', color: '#f59e0b', keywords: ['design', 'media', 'art', 'studio'] },
  { id: 'gouvernement', type: 'space', icon: '🏛️', label: 'Gouvernement', sublabel: 'Services publics', shortcut: '⌘5', path: '/gouvernement', color: '#06b6d4', keywords: ['gov', 'public', 'services'] },
  { id: 'immobilier', type: 'space', icon: '🏘️', label: 'Immobilier', sublabel: 'Propriétés', shortcut: '⌘6', path: '/immobilier', color: '#ec4899', keywords: ['real estate', 'property', 'housing'] },
  { id: 'associations', type: 'space', icon: '🤝', label: 'Associations', sublabel: 'Organisations', shortcut: '⌘7', path: '/associations', color: '#14b8a6', keywords: ['org', 'nonprofit', 'community'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

const NAVIGATION: HubItem[] = [
  { id: 'dashboard', type: 'navigation', icon: '📊', label: 'Dashboard', shortcut: 'G D', path: '/dashboard', keywords: ['home', 'main', 'overview'] },
  { id: 'social', type: 'navigation', icon: '📱', label: 'Social Network', path: '/social', keywords: ['posts', 'feed', 'friends'] },
  { id: 'forum', type: 'navigation', icon: '💬', label: 'Forum', path: '/forum', keywords: ['discussions', 'threads', 'community'] },
  { id: 'streaming', type: 'navigation', icon: '🎬', label: 'Streaming', path: '/streaming', keywords: ['video', 'live', 'watch'] },
  { id: 'nova', type: 'navigation', icon: '🤖', label: 'Nova AI', shortcut: '⌘J', path: '/nova', keywords: ['ai', 'assistant', 'help'] },
  { id: 'learn', type: 'navigation', icon: '🎓', label: 'CHE-Learn', path: '/learn', keywords: ['courses', 'training', 'education'] },
  { id: 'calendar', type: 'navigation', icon: '📅', label: 'Calendrier', shortcut: 'G C', path: '/calendar', keywords: ['events', 'schedule', 'meetings'] },
  { id: 'messages', type: 'navigation', icon: '✉️', label: 'Messages', shortcut: 'G M', path: '/messages', badge: 3, keywords: ['email', 'inbox', 'chat'] },
  { id: 'team', type: 'navigation', icon: '👥', label: 'Mon Équipe', path: '/team', keywords: ['agents', 'members', 'staff'] },
  { id: 'documents', type: 'navigation', icon: '📄', label: 'Documents', shortcut: 'G F', path: '/documents', keywords: ['files', 'folders', 'storage'] },
  { id: 'finance', type: 'navigation', icon: '💰', label: 'Finance', path: '/finance', keywords: ['money', 'invoices', 'accounting'] },
  { id: 'settings', type: 'navigation', icon: '⚙️', label: 'Paramètres', shortcut: '⌘,', path: '/settings', keywords: ['preferences', 'config', 'options'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const ACTIONS: HubItem[] = [
  { id: 'new-project', type: 'action', icon: '➕', label: 'Nouveau Projet', shortcut: 'N P', keywords: ['create', 'add', 'project'] },
  { id: 'new-task', type: 'action', icon: '✅', label: 'Nouvelle Tâche', shortcut: 'N T', keywords: ['create', 'add', 'task', 'todo'] },
  { id: 'new-invoice', type: 'action', icon: '🧾', label: 'Nouvelle Facture', shortcut: 'N I', keywords: ['create', 'add', 'invoice', 'bill'] },
  { id: 'new-quote', type: 'action', icon: '📝', label: 'Nouveau Devis', shortcut: 'N Q', keywords: ['create', 'add', 'quote', 'estimate'] },
  { id: 'new-contact', type: 'action', icon: '👤', label: 'Nouveau Contact', shortcut: 'N C', keywords: ['create', 'add', 'contact', 'client'] },
  { id: 'new-event', type: 'action', icon: '📅', label: 'Nouvel Événement', shortcut: 'N E', keywords: ['create', 'add', 'event', 'meeting'] },
  { id: 'new-note', type: 'action', icon: '📒', label: 'Nouvelle Note', shortcut: 'N N', keywords: ['create', 'add', 'note', 'memo'] },
  { id: 'new-document', type: 'action', icon: '📄', label: 'Nouveau Document', shortcut: 'N D', keywords: ['create', 'add', 'document', 'file'] },
  { id: 'upload', type: 'action', icon: '⬆️', label: 'Upload Fichier', shortcut: 'U', keywords: ['upload', 'import', 'file'] },
  { id: 'scan', type: 'action', icon: '📸', label: 'Scanner Document', keywords: ['scan', 'camera', 'ocr'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - NOVA COMMANDS
// ═══════════════════════════════════════════════════════════════════════════════

const NOVA_COMMANDS: HubItem[] = [
  { id: 'nova-ask', type: 'nova', icon: '💬', label: 'Demander à Nova', sublabel: 'Pose n\'importe quelle question', keywords: ['ask', 'question', 'help'] },
  { id: 'nova-summarize', type: 'nova', icon: '📋', label: 'Résumer', sublabel: 'Résumer la page actuelle', keywords: ['summary', 'tldr'] },
  { id: 'nova-translate', type: 'nova', icon: '🌐', label: 'Traduire', sublabel: 'Traduire du texte', keywords: ['translate', 'language'] },
  { id: 'nova-write', type: 'nova', icon: '✍️', label: 'Rédiger', sublabel: 'Aide à la rédaction', keywords: ['write', 'compose', 'draft'] },
  { id: 'nova-analyze', type: 'nova', icon: '📊', label: 'Analyser', sublabel: 'Analyser des données', keywords: ['analyze', 'data', 'insights'] },
  { id: 'nova-schedule', type: 'nova', icon: '📅', label: 'Planifier', sublabel: 'Organiser mon agenda', keywords: ['schedule', 'plan', 'calendar'] },
  { id: 'nova-remind', type: 'nova', icon: '⏰', label: 'Rappel', sublabel: 'Créer un rappel', keywords: ['remind', 'reminder', 'alert'] },
  { id: 'nova-search', type: 'nova', icon: '🔍', label: 'Recherche Web', sublabel: 'Chercher sur internet', keywords: ['search', 'web', 'google'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - RECENT ITEMS (Mock)
// ═══════════════════════════════════════════════════════════════════════════════

const RECENT_ITEMS: HubItem[] = [
  { id: 'recent-1', type: 'recent', icon: '📁', label: 'Projet Tremblay', sublabel: 'Ouvert il y a 2h', path: '/projets/tremblay' },
  { id: 'recent-2', type: 'recent', icon: '📄', label: 'Devis_Final.pdf', sublabel: 'Modifié hier', path: '/documents/devis-final' },
  { id: 'recent-3', type: 'recent', icon: '👤', label: 'Marie Côté', sublabel: 'Contact vu il y a 3h', path: '/contacts/marie-cote' },
  { id: 'recent-4', type: 'recent', icon: '🧾', label: 'Facture #2024-089', sublabel: 'Créée aujourd\'hui', path: '/finance/invoices/2024-089' },
  { id: 'recent-5', type: 'recent', icon: '📅', label: 'Réunion Équipe', sublabel: 'Event de ce matin', path: '/calendar/reunion-equipe' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - FAVORITES (Mock)
// ═══════════════════════════════════════════════════════════════════════════════

const FAVORITES: HubItem[] = [
  { id: 'fav-1', type: 'favorite', icon: '⭐', label: 'Dashboard Finance', path: '/finance/dashboard' },
  { id: 'fav-2', type: 'favorite', icon: '⭐', label: 'Projets Actifs', path: '/projets?filter=active' },
  { id: 'fav-3', type: 'favorite', icon: '⭐', label: 'Mes Tâches', path: '/tasks/mine' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT - UNIFIED NAVIGATION HUB
// ═══════════════════════════════════════════════════════════════════════════════

const UnifiedNavigationHub: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
  onAction?: (actionId: string) => void;
  onNovaCommand?: (command: string, query?: string) => void;
}> = ({ isOpen, onClose, onNavigate, onAction, onNovaCommand }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<HubMode>('default');
  const [novaQuery, setNovaQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // FILTER LOGIC
  // ─────────────────────────────────────────────────────────────────────────────

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    
    // Special mode triggers
    if (q.startsWith('/') || q.startsWith('>')) {
      setMode('create');
      const searchQ = q.slice(1);
      return ACTIONS.filter(item => 
        item.label.toLowerCase().includes(searchQ) ||
        item.keywords?.some(k => k.includes(searchQ))
      );
    }
    
    if (q.startsWith('@') || q.startsWith('nova ') || q.startsWith('ask ')) {
      setMode('nova');
      return NOVA_COMMANDS;
    }
    
    if (q.startsWith('go ') || q.startsWith('aller ')) {
      setMode('goto');
      const searchQ = q.replace(/^(go |aller )/, '');
      return [...SPACES, ...NAVIGATION].filter(item =>
        item.label.toLowerCase().includes(searchQ) ||
        item.keywords?.some(k => k.includes(searchQ))
      );
    }
    
    setMode('default');
    
    // No query - show sections
    if (!q) {
      return null;
    }
    
    // Search all items
    const allItems = [...SPACES, ...NAVIGATION, ...ACTIONS, ...NOVA_COMMANDS, ...RECENT_ITEMS, ...FAVORITES];
    
    return allItems.filter(item => {
      const labelMatch = item.label.toLowerCase().includes(q);
      const sublabelMatch = item.sublabel?.toLowerCase().includes(q);
      const keywordMatch = item.keywords?.some(k => k.toLowerCase().includes(q));
      return labelMatch || sublabelMatch || keywordMatch;
    }).slice(0, 12);
  }, [query]);

  // ─────────────────────────────────────────────────────────────────────────────
  // BUILD SECTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  const sections = useMemo((): HubSection[] => {
    if (filteredResults) {
      return [{
        id: 'results',
        title: mode === 'create' ? 'Créer' : mode === 'nova' ? 'Nova AI' : mode === 'goto' ? 'Aller à' : 'Résultats',
        icon: mode === 'create' ? '➕' : mode === 'nova' ? '🤖' : mode === 'goto' ? '🚀' : '🔍',
        items: filteredResults,
      }];
    }
    
    return [
      { id: 'spaces', title: 'Espaces', icon: '🌐', items: SPACES },
      { id: 'recent', title: 'Récents', icon: '🕐', items: RECENT_ITEMS },
      { id: 'favorites', title: 'Favoris', icon: '⭐', items: FAVORITES },
      { id: 'navigation', title: 'Navigation', icon: '🧭', items: NAVIGATION.slice(0, 6) },
      { id: 'actions', title: 'Actions Rapides', icon: '⚡', items: ACTIONS.slice(0, 4) },
      { id: 'nova', title: 'Nova AI', icon: '🤖', items: NOVA_COMMANDS.slice(0, 3) },
    ];
  }, [filteredResults, mode]);

  // Flatten items for keyboard navigation
  const flatItems = useMemo(() => {
    return sections.flatMap(s => s.items);
  }, [sections]);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  const handleSelect = useCallback((item: HubItem) => {
    if (item.type === 'nova') {
      setMode('nova');
      setNovaQuery('');
      // Could open Nova panel with this command
      onNovaCommand?.(item.id, novaQuery);
    } else if (item.type === 'action') {
      onAction?.(item.id);
    } else if (item.path) {
      onNavigate?.(item.path);
    }
    onClose();
  }, [onNavigate, onAction, onNovaCommand, onClose, novaQuery]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, flatItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatItems[selectedIndex]) {
          handleSelect(flatItems[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'Tab':
        e.preventDefault();
        // Cycle through modes
        const modes: HubMode[] = ['default', 'goto', 'create', 'nova'];
        const currentIdx = modes.indexOf(mode);
        setMode(modes[(currentIdx + 1) % modes.length]);
        break;
    }
  }, [flatItems, selectedIndex, handleSelect, onClose, mode]);

  // ─────────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
      setMode('default');
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedEl = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    selectedEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedIndex]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // ⌘+K or Ctrl+K to toggle
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      
      // ⌘+1-7 for spaces
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '7') {
        e.preventDefault();
        const spaceIndex = parseInt(e.key) - 1;
        if (SPACES[spaceIndex]) {
          onNavigate?.(SPACES[spaceIndex].path!);
        }
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose, onNavigate]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  if (!isOpen) return null;

  let globalIndex = 0;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header / Search */}
        <div style={styles.header}>
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>
              {mode === 'nova' ? '🤖' : mode === 'create' ? '➕' : mode === 'goto' ? '🚀' : '🔍'}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === 'nova' ? 'Demander à Nova...' :
                mode === 'create' ? 'Créer...' :
                mode === 'goto' ? 'Aller à...' :
                'Rechercher, naviguer, créer, demander à Nova...'
              }
              style={styles.searchInput}
            />
            <div style={styles.shortcuts}>
              <kbd style={styles.kbd}>ESC</kbd>
            </div>
          </div>
          
          {/* Mode Pills */}
          <div style={styles.modePills}>
            {(['default', 'goto', 'create', 'nova'] as HubMode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setQuery(''); }}
                style={{
                  ...styles.modePill,
                  ...(mode === m ? styles.modePillActive : {}),
                }}
              >
                {m === 'default' && '🔍 Tout'}
                {m === 'goto' && '🚀 Aller'}
                {m === 'create' && '➕ Créer'}
                {m === 'nova' && '🤖 Nova'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div ref={listRef} style={styles.content}>
          {sections.map(section => (
            <div key={section.id} style={styles.section}>
              <div style={styles.sectionHeader}>
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </div>
              
              {section.id === 'spaces' ? (
                // Spaces Grid
                <div style={styles.spacesGrid}>
                  {section.items.map((item, idx) => {
                    const itemIndex = globalIndex++;
                    const isSelected = itemIndex === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        data-index={itemIndex}
                        onClick={() => handleSelect(item)}
                        style={{
                          ...styles.spaceCard,
                          ...(isSelected ? styles.spaceCardSelected : {}),
                          borderColor: isSelected ? item.color : 'transparent',
                        }}
                      >
                        <span style={{ fontSize: 24 }}>{item.icon}</span>
                        <span style={styles.spaceLabel}>{item.label}</span>
                        <kbd style={styles.spaceShortcut}>{item.shortcut}</kbd>
                      </button>
                    );
                  })}
                </div>
              ) : (
                // Regular List
                <div style={styles.list}>
                  {section.items.map((item, idx) => {
                    const itemIndex = globalIndex++;
                    const isSelected = itemIndex === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        data-index={itemIndex}
                        onClick={() => handleSelect(item)}
                        style={{
                          ...styles.listItem,
                          ...(isSelected ? styles.listItemSelected : {}),
                        }}
                      >
                        <span style={styles.itemIcon}>{item.icon}</span>
                        <div style={styles.itemContent}>
                          <span style={styles.itemLabel}>{item.label}</span>
                          {item.sublabel && (
                            <span style={styles.itemSublabel}>{item.sublabel}</span>
                          )}
                        </div>
                        {item.badge && (
                          <span style={styles.badge}>{item.badge}</span>
                        )}
                        {item.shortcut && (
                          <kbd style={styles.itemShortcut}>{item.shortcut}</kbd>
                        )}
                        <span style={styles.itemArrow}>→</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerHints}>
            <span style={styles.hint}>
              <kbd style={styles.kbdSmall}>↑↓</kbd> Naviguer
            </span>
            <span style={styles.hint}>
              <kbd style={styles.kbdSmall}>↵</kbd> Sélectionner
            </span>
            <span style={styles.hint}>
              <kbd style={styles.kbdSmall}>Tab</kbd> Mode
            </span>
            <span style={styles.hint}>
              <kbd style={styles.kbdSmall}>/</kbd> Créer
            </span>
            <span style={styles.hint}>
              <kbd style={styles.kbdSmall}>@</kbd> Nova
            </span>
          </div>
          <div style={styles.footerBrand}>
            <span style={{ color: tokens.colors.gold }}>CHE·NU</span> V25
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '10vh',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
  },
  
  modal: {
    width: '100%',
    maxWidth: 680,
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.xl,
    border: `1px solid ${tokens.colors.border.default}`,
    boxShadow: `0 25px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(216, 178, 106, 0.1)`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '75vh',
  },
  
  header: {
    padding: tokens.spacing.md,
    borderBottom: `1px solid ${tokens.colors.border.default}`,
    backgroundColor: tokens.colors.bg.tertiary,
  },
  
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    backgroundColor: tokens.colors.bg.primary,
    borderRadius: tokens.radius.lg,
    border: `1px solid ${tokens.colors.border.default}`,
  },
  
  searchIcon: {
    fontSize: 20,
  },
  
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: 16,
    color: tokens.colors.text.primary,
  },
  
  shortcuts: {
    display: 'flex',
    gap: tokens.spacing.xs,
  },
  
  kbd: {
    padding: '4px 8px',
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.sm,
    fontSize: 11,
    color: tokens.colors.text.muted,
    fontFamily: 'system-ui',
    border: `1px solid ${tokens.colors.border.default}`,
  },
  
  modePills: {
    display: 'flex',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.md,
  },
  
  modePill: {
    padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
    backgroundColor: tokens.colors.bg.primary,
    border: `1px solid ${tokens.colors.border.default}`,
    borderRadius: tokens.radius.md,
    color: tokens.colors.text.secondary,
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  modePillActive: {
    backgroundColor: tokens.colors.gold,
    color: '#000',
    borderColor: tokens.colors.gold,
    fontWeight: 600,
  },
  
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: tokens.spacing.md,
  },
  
  section: {
    marginBottom: tokens.spacing.lg,
  },
  
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    color: tokens.colors.text.muted,
    marginBottom: tokens.spacing.sm,
    padding: `0 ${tokens.spacing.sm}px`,
  },
  
  // Spaces Grid
  spacesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: tokens.spacing.sm,
  },
  
  spaceCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.tertiary,
    border: '2px solid transparent',
    borderRadius: tokens.radius.lg,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  spaceCardSelected: {
    backgroundColor: tokens.colors.bg.hover,
    transform: 'scale(1.05)',
  },
  
  spaceLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
  },
  
  spaceShortcut: {
    fontSize: 9,
    color: tokens.colors.text.muted,
    fontFamily: 'system-ui',
  },
  
  // List Items
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: tokens.radius.md,
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'left',
    width: '100%',
  },
  
  listItemSelected: {
    backgroundColor: `${tokens.colors.gold}20`,
    borderLeft: `3px solid ${tokens.colors.gold}`,
  },
  
  itemIcon: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  
  itemContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  
  itemLabel: {
    fontSize: 14,
    color: tokens.colors.text.primary,
  },
  
  itemSublabel: {
    fontSize: 11,
    color: tokens.colors.text.muted,
  },
  
  badge: {
    padding: '2px 8px',
    backgroundColor: tokens.colors.error,
    color: '#fff',
    fontSize: 10,
    fontWeight: 600,
    borderRadius: 10,
  },
  
  itemShortcut: {
    padding: '3px 6px',
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.sm,
    fontSize: 10,
    color: tokens.colors.text.muted,
    fontFamily: 'system-ui',
  },
  
  itemArrow: {
    color: tokens.colors.text.muted,
    fontSize: 12,
    opacity: 0.5,
  },
  
  // Footer
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    borderTop: `1px solid ${tokens.colors.border.default}`,
    backgroundColor: tokens.colors.bg.tertiary,
  },
  
  footerHints: {
    display: 'flex',
    gap: tokens.spacing.md,
  },
  
  hint: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    fontSize: 11,
    color: tokens.colors.text.muted,
  },
  
  kbdSmall: {
    padding: '2px 5px',
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: 4,
    fontSize: 10,
    fontFamily: 'system-ui',
  },
  
  footerBrand: {
    fontSize: 11,
    color: tokens.colors.text.muted,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

const UnifiedNavigationHubDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: tokens.colors.void,
      padding: tokens.spacing.xl,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Demo Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ 
          color: tokens.colors.text.primary, 
          fontSize: 32,
          marginBottom: 8,
          background: `linear-gradient(135deg, ${tokens.colors.gold}, ${tokens.colors.turquoise})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🧭 Unified Navigation Hub
        </h1>
        <p style={{ color: tokens.colors.text.secondary, marginBottom: 24 }}>
          The Ultimate Command Center for CHE·NU V25
        </p>
        
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '16px 32px',
            backgroundColor: tokens.colors.gold,
            color: '#000',
            border: 'none',
            borderRadius: tokens.radius.lg,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: `0 4px 20px ${tokens.colors.gold}40`,
          }}
        >
          <span>Ouvrir le Hub</span>
          <kbd style={{
            padding: '4px 8px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 6,
            fontSize: 12,
          }}>⌘K</kbd>
        </button>
      </div>

      {/* Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        {[
          { icon: '🔍', title: 'Recherche Universelle', desc: 'Fichiers, contacts, projets, tout en un' },
          { icon: '🚀', title: 'Navigation Rapide', desc: '⌘+1-7 pour changer d\'espace' },
          { icon: '➕', title: 'Actions Rapides', desc: 'Tapez / pour créer n\'importe quoi' },
          { icon: '🤖', title: 'Nova AI Intégré', desc: 'Tapez @ pour demander à Nova' },
          { icon: '🕐', title: 'Récents', desc: 'Accès instantané aux éléments récents' },
          { icon: '⭐', title: 'Favoris', desc: 'Vos pages préférées toujours à portée' },
          { icon: '⌨️', title: 'Keyboard First', desc: 'Navigation 100% clavier possible' },
          { icon: '🎨', title: 'Design CHE·NU', desc: 'Palette sacrée or & émeraude' },
        ].map((feature, idx) => (
          <div key={idx} style={{
            padding: 24,
            backgroundColor: tokens.colors.bg.secondary,
            borderRadius: tokens.radius.lg,
            border: `1px solid ${tokens.colors.border.default}`,
          }}>
            <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>{feature.icon}</span>
            <h3 style={{ color: tokens.colors.text.primary, fontSize: 16, marginBottom: 4 }}>{feature.title}</h3>
            <p style={{ color: tokens.colors.text.muted, fontSize: 13 }}>{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Last Action */}
      {lastAction && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          padding: '12px 20px',
          backgroundColor: tokens.colors.success,
          color: '#000',
          borderRadius: tokens.radius.md,
          fontWeight: 500,
        }}>
          ✓ {lastAction}
        </div>
      )}

      {/* The Hub */}
      <UnifiedNavigationHub
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNavigate={(path) => {
          setLastAction(`Navigation vers ${path}`);
          setTimeout(() => setLastAction(''), 3000);
        }}
        onAction={(actionId) => {
          setLastAction(`Action: ${actionId}`);
          setTimeout(() => setLastAction(''), 3000);
        }}
        onNovaCommand={(cmd, query) => {
          setLastAction(`Nova: ${cmd}${query ? ` - "${query}"` : ''}`);
          setTimeout(() => setLastAction(''), 3000);
        }}
      />

      {/* Keyboard Shortcuts Legend */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        padding: 16,
        backgroundColor: tokens.colors.bg.secondary,
        borderRadius: tokens.radius.lg,
        border: `1px solid ${tokens.colors.border.default}`,
      }}>
        <div style={{ color: tokens.colors.text.muted, fontSize: 11, marginBottom: 8, fontWeight: 600 }}>
          RACCOURCIS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            ['⌘K', 'Ouvrir Hub'],
            ['⌘1-7', 'Changer Espace'],
            ['/', 'Mode Créer'],
            ['@', 'Mode Nova'],
          ].map(([key, action]) => (
            <div key={key} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <kbd style={{
                padding: '2px 6px',
                backgroundColor: tokens.colors.bg.tertiary,
                borderRadius: 4,
                fontSize: 10,
                color: tokens.colors.text.muted,
                minWidth: 40,
                textAlign: 'center',
              }}>{key}</kbd>
              <span style={{ color: tokens.colors.text.secondary, fontSize: 11 }}>{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnifiedNavigationHubDemo;
export { UnifiedNavigationHub };
