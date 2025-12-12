/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — QUICK ACTIONS BAR (Command Palette)
 * ═══════════════════════════════════════════════════════════════════════════════
 * Barre de commandes rapides style Spotlight/⌘+K
 * - Recherche universelle
 * - Actions rapides
 * - Navigation clavier
 * - Raccourcis
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';

const tokens = {
  colors: {
    sacredGold: '#D8B26A', cenoteTurquoise: '#3EB4A2', jungleEmerald: '#3F7249',
    bg: { primary: '#0f1217', secondary: '#161B22', tertiary: '#1E242C' },
    text: { primary: '#E9E4D6', secondary: '#A0998A', muted: '#6B6560' },
    border: 'rgba(216, 178, 106, 0.15)',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24 },
  radius: { md: 8, lg: 12, xl: 16 },
};

const ACTIONS = [
  // Navigation
  { id: 'dashboard', icon: '🏠', label: 'Aller au Dashboard', category: 'Navigation', shortcut: 'G D' },
  { id: 'projects', icon: '📁', label: 'Voir les projets', category: 'Navigation', shortcut: 'G P' },
  { id: 'tasks', icon: '✅', label: 'Mes tâches', category: 'Navigation', shortcut: 'G T' },
  { id: 'messages', icon: '💬', label: 'Messages', category: 'Navigation', shortcut: 'G M' },
  { id: 'calendar', icon: '📅', label: 'Calendrier', category: 'Navigation', shortcut: 'G C' },
  // Actions rapides
  { id: 'new-project', icon: '➕', label: 'Nouveau projet', category: 'Créer', shortcut: 'N P' },
  { id: 'new-task', icon: '📝', label: 'Nouvelle tâche', category: 'Créer', shortcut: 'N T' },
  { id: 'new-invoice', icon: '💰', label: 'Nouvelle facture', category: 'Créer', shortcut: 'N I' },
  { id: 'new-client', icon: '👤', label: 'Nouveau client', category: 'Créer', shortcut: 'N C' },
  // Outils
  { id: 'search', icon: '🔍', label: 'Recherche avancée', category: 'Outils', shortcut: '/' },
  { id: 'ai-assistant', icon: '🤖', label: 'Assistant IA', category: 'Outils', shortcut: 'A I' },
  { id: 'reports', icon: '📊', label: 'Générer rapport', category: 'Outils', shortcut: 'R' },
  { id: 'settings', icon: '⚙️', label: 'Paramètres', category: 'Outils', shortcut: ',' },
  // Récents
  { id: 'recent-1', icon: '📁', label: 'Projet Tremblay', category: 'Récent', subtitle: 'Ouvert il y a 2h' },
  { id: 'recent-2', icon: '📄', label: 'Devis_Final.pdf', category: 'Récent', subtitle: 'Modifié hier' },
];

const QuickActionsBar = ({ isOpen, onClose, onAction }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query) return ACTIONS;
    const q = query.toLowerCase();
    return ACTIONS.filter(a => 
      a.label.toLowerCase().includes(q) || 
      a.category.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(action => {
      if (!groups[action.category]) groups[action.category] = [];
      groups[action.category].push(action);
    });
    return groups;
  }, [filtered]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          onClose?.(); // Toggle
        }
        return;
      }
      
      if (e.key === 'Escape') onClose?.();
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        onAction?.(filtered[selectedIndex]);
        onClose?.();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onAction, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
      
      {/* Modal */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 560, backgroundColor: tokens.colors.bg.secondary, borderRadius: tokens.radius.xl, border: `1px solid ${tokens.colors.border}`, boxShadow: '0 25px 50px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md, padding: tokens.spacing.md, borderBottom: `1px solid ${tokens.colors.border}` }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Tapez une commande ou recherchez..."
            style={{ flex: 1, padding: tokens.spacing.sm, backgroundColor: 'transparent', border: 'none', color: tokens.colors.text.primary, fontSize: 16, outline: 'none' }}
          />
          <kbd style={{ padding: '4px 8px', backgroundColor: tokens.colors.bg.tertiary, borderRadius: tokens.radius.md, fontSize: 11, color: tokens.colors.text.muted }}>ESC</kbd>
        </div>
        
        {/* Results */}
        <div style={{ maxHeight: 400, overflowY: 'auto', padding: tokens.spacing.sm }}>
          {filtered.length === 0 ? (
            <div style={{ padding: tokens.spacing.lg, textAlign: 'center', color: tokens.colors.text.muted }}>
              Aucun résultat pour "{query}"
            </div>
          ) : (
            Object.entries(grouped).map(([category, actions]) => (
              <div key={category} style={{ marginBottom: tokens.spacing.sm }}>
                <div style={{ padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`, fontSize: 11, fontWeight: 600, color: tokens.colors.text.muted, textTransform: 'uppercase' }}>{category}</div>
                {actions.map((action, i) => {
                  const globalIndex = filtered.indexOf(action);
                  const isSelected = globalIndex === selectedIndex;
                  return (
                    <div
                      key={action.id}
                      onClick={() => { onAction?.(action); onClose?.(); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: tokens.spacing.md, padding: tokens.spacing.md,
                        backgroundColor: isSelected ? tokens.colors.sacredGold + '20' : 'transparent',
                        borderRadius: tokens.radius.md, cursor: 'pointer', borderLeft: isSelected ? `3px solid ${tokens.colors.sacredGold}` : '3px solid transparent',
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{action.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: tokens.colors.text.primary, fontSize: 14 }}>{action.label}</div>
                        {action.subtitle && <div style={{ color: tokens.colors.text.muted, fontSize: 11 }}>{action.subtitle}</div>}
                      </div>
                      {action.shortcut && <kbd style={{ padding: '3px 6px', backgroundColor: tokens.colors.bg.tertiary, borderRadius: tokens.radius.md, fontSize: 10, color: tokens.colors.text.muted }}>{action.shortcut}</kbd>}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: tokens.spacing.lg, padding: tokens.spacing.sm, borderTop: `1px solid ${tokens.colors.border}`, backgroundColor: tokens.colors.bg.tertiary }}>
          {[['↑↓', 'Naviguer'], ['↵', 'Sélectionner'], ['esc', 'Fermer']].map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs, fontSize: 11, color: tokens.colors.text.muted }}>
              <kbd style={{ padding: '2px 6px', backgroundColor: tokens.colors.bg.secondary, borderRadius: 4 }}>{key}</kbd>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsBar;
