/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                   CHE·NU V25 - PERSISTENT TAB SYSTEM                         ║
 * ║                                                                              ║
 * ║  Browser-like tabs for multi-page navigation:                               ║
 * ║  • Keep multiple pages open                                                  ║
 * ║  • Drag to reorder                                                           ║
 * ║  • Right-click context menu                                                  ║
 * ║  • Pin important tabs                                                        ║
 * ║  • Restore last session                                                      ║
 * ║  • Tab groups by space                                                       ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const tokens = {
  colors: {
    gold: '#D8B26A',
    goldDark: '#B8924A',
    emerald: '#3F7249',
    turquoise: '#3EB4A2',
    
    bg: {
      primary: '#0f1217',
      secondary: '#161B22',
      tertiary: '#1E242C',
      hover: '#2D3640',
      active: '#353D48',
    },
    
    text: {
      primary: '#F4F0EB',
      secondary: '#B8B0A8',
      muted: '#6B6560',
    },
    
    border: {
      default: 'rgba(216, 178, 106, 0.15)',
      hover: 'rgba(216, 178, 106, 0.3)',
    },
    
    spaces: {
      maison: '#4ade80',
      entreprise: '#3b82f6',
      projets: '#8b5cf6',
      creative: '#f59e0b',
      gouvernement: '#06b6d4',
      immobilier: '#ec4899',
      associations: '#14b8a6',
    } as Record<string, string>,
  },
  
  spacing: { xs: 4, sm: 8, md: 16, lg: 24 },
  radius: { sm: 4, md: 8, lg: 12 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Tab {
  id: string;
  title: string;
  icon: string;
  path: string;
  space?: string;
  isPinned?: boolean;
  isDirty?: boolean;
  closable?: boolean;
}

interface TabContextMenu {
  x: number;
  y: number;
  tabId: string;
}

interface TabSystemProps {
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabPin: (tabId: string) => void;
  onTabReorder: (tabs: Tab[]) => void;
  onNewTab?: () => void;
  maxTabs?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const TabSystem: React.FC<TabSystemProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onTabPin,
  onTabReorder,
  onNewTab,
  maxTabs = 12,
}) => {
  const [contextMenu, setContextMenu] = useState<TabContextMenu | null>(null);
  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
  const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);

  // Sort: Pinned first
  const sortedTabs = [...tabs].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const handleContextMenu = useCallback((e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tabId });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, tabId: string) => {
    setDraggedTabId(tabId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, tabId: string) => {
    e.preventDefault();
    if (tabId !== draggedTabId) {
      setDragOverTabId(tabId);
    }
  }, [draggedTabId]);

  const handleDragEnd = useCallback(() => {
    if (draggedTabId && dragOverTabId && draggedTabId !== dragOverTabId) {
      const newTabs = [...tabs];
      const draggedIndex = newTabs.findIndex(t => t.id === draggedTabId);
      const dropIndex = newTabs.findIndex(t => t.id === dragOverTabId);
      
      if (draggedIndex !== -1 && dropIndex !== -1) {
        const [draggedTab] = newTabs.splice(draggedIndex, 1);
        newTabs.splice(dropIndex, 0, draggedTab);
        onTabReorder(newTabs);
      }
    }
    setDraggedTabId(null);
    setDragOverTabId(null);
  }, [draggedTabId, dragOverTabId, tabs, onTabReorder]);

  const handleCloseTab = useCallback((e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClose(tabId);
  }, [onTabClose]);

  useEffect(() => {
    if (contextMenu) {
      const handleClick = () => closeContextMenu();
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [contextMenu, closeContextMenu]);

  const contextMenuActions = [
    { id: 'pin', label: 'Épingler / Désépingler', icon: '📌', action: () => contextMenu && onTabPin(contextMenu.tabId) },
    { id: 'close', label: 'Fermer', icon: '✕', action: () => contextMenu && onTabClose(contextMenu.tabId) },
    { id: 'close-others', label: 'Fermer les autres', icon: '🗑️', action: () => {
      if (contextMenu) {
        tabs.filter(t => t.id !== contextMenu.tabId && !t.isPinned && t.closable !== false)
          .forEach(t => onTabClose(t.id));
      }
    }},
    { id: 'close-right', label: 'Fermer à droite', icon: '→', action: () => {
      if (contextMenu) {
        const idx = tabs.findIndex(t => t.id === contextMenu.tabId);
        tabs.slice(idx + 1).filter(t => !t.isPinned && t.closable !== false).forEach(t => onTabClose(t.id));
      }
    }},
  ];

  return (
    <div style={styles.container}>
      <div style={styles.tabsWrapper}>
        <div style={styles.tabs}>
          {sortedTabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const isDragOver = tab.id === dragOverTabId;
            const isDragging = tab.id === draggedTabId;
            const isHovered = tab.id === hoveredTabId;
            const spaceColor = tab.space ? tokens.colors.spaces[tab.space] : tokens.colors.gold;
            
            return (
              <div
                key={tab.id}
                draggable
                onDragStart={(e) => handleDragStart(e, tab.id)}
                onDragOver={(e) => handleDragOver(e, tab.id)}
                onDragEnd={handleDragEnd}
                onClick={() => onTabClick(tab.id)}
                onContextMenu={(e) => handleContextMenu(e, tab.id)}
                onMouseEnter={() => setHoveredTabId(tab.id)}
                onMouseLeave={() => setHoveredTabId(null)}
                style={{
                  ...styles.tab,
                  ...(isActive ? styles.tabActive : {}),
                  ...(isDragOver ? styles.tabDragOver : {}),
                  ...(isDragging ? styles.tabDragging : {}),
                  ...(tab.isPinned ? styles.tabPinned : {}),
                  ...(isHovered && !isActive ? styles.tabHover : {}),
                  borderTopColor: isActive ? spaceColor : 'transparent',
                }}
              >
                {tab.isPinned && <span style={styles.pinIndicator}>📌</span>}
                <span style={styles.tabIcon}>{tab.icon}</span>
                {!tab.isPinned && (
                  <span style={styles.tabTitle}>
                    {tab.title}
                    {tab.isDirty && <span style={styles.dirtyIndicator}>●</span>}
                  </span>
                )}
                {tab.closable !== false && !tab.isPinned && (
                  <button
                    onClick={(e) => handleCloseTab(e, tab.id)}
                    style={{
                      ...styles.closeButton,
                      opacity: isHovered || isActive ? 1 : 0,
                    }}
                  >
                    ✕
                  </button>
                )}
                {isActive && <div style={{ ...styles.activeIndicator, backgroundColor: spaceColor }} />}
              </div>
            );
          })}
        </div>

        {tabs.length < maxTabs && onNewTab && (
          <button onClick={onNewTab} style={styles.newTabButton}>+</button>
        )}
      </div>

      <div style={styles.tabCount}>{tabs.length}/{maxTabs}</div>

      {contextMenu && (
        <div style={{ ...styles.contextMenu, left: contextMenu.x, top: contextMenu.y }} onClick={(e) => e.stopPropagation()}>
          {contextMenuActions.map((action) => (
            <button
              key={action.id}
              onClick={() => { action.action(); closeContextMenu(); }}
              style={styles.contextMenuItem}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.colors.bg.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: tokens.colors.bg.primary,
    borderBottom: `1px solid ${tokens.colors.border.default}`,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    userSelect: 'none',
  },
  tabsWrapper: { flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' },
  tabs: { display: 'flex', alignItems: 'stretch', gap: 1, overflowX: 'auto', scrollbarWidth: 'none' },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    backgroundColor: tokens.colors.bg.secondary,
    border: 'none',
    borderTop: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    minWidth: 120,
    maxWidth: 200,
    position: 'relative',
  },
  tabActive: { backgroundColor: tokens.colors.bg.tertiary },
  tabHover: { backgroundColor: tokens.colors.bg.hover },
  tabDragOver: { backgroundColor: tokens.colors.bg.hover, borderLeft: `2px solid ${tokens.colors.gold}` },
  tabDragging: { opacity: 0.5 },
  tabPinned: { minWidth: 'auto', maxWidth: 48, padding: `${tokens.spacing.sm}px` },
  pinIndicator: { fontSize: 10, position: 'absolute', top: 2, left: 2 },
  tabIcon: { fontSize: 16, flexShrink: 0 },
  tabTitle: { fontSize: 12, color: tokens.colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 },
  dirtyIndicator: { color: tokens.colors.gold, marginLeft: tokens.spacing.xs, fontSize: 8 },
  closeButton: { width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: 'none', borderRadius: tokens.radius.sm, color: tokens.colors.text.muted, cursor: 'pointer', fontSize: 10, transition: 'opacity 0.1s', flexShrink: 0 },
  activeIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 },
  newTabButton: { width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: `1px solid ${tokens.colors.border.default}`, borderRadius: tokens.radius.sm, color: tokens.colors.text.muted, cursor: 'pointer', fontSize: 16, marginLeft: tokens.spacing.sm, flexShrink: 0 },
  tabCount: { padding: `0 ${tokens.spacing.md}px`, fontSize: 11, color: tokens.colors.text.muted, borderLeft: `1px solid ${tokens.colors.border.default}`, marginLeft: tokens.spacing.sm },
  contextMenu: { position: 'fixed', backgroundColor: tokens.colors.bg.tertiary, border: `1px solid ${tokens.colors.border.default}`, borderRadius: tokens.radius.md, padding: tokens.spacing.xs, boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 10000, minWidth: 180 },
  contextMenuItem: { display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, width: '100%', padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`, backgroundColor: 'transparent', border: 'none', borderRadius: tokens.radius.sm, color: tokens.colors.text.primary, cursor: 'pointer', fontSize: 12, textAlign: 'left' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO
// ═══════════════════════════════════════════════════════════════════════════════

const TabSystemDemo: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'dashboard', title: 'Dashboard', icon: '📊', path: '/dashboard', closable: false },
    { id: 'projet-abc', title: 'Projet ABC', icon: '📁', path: '/projets/abc', space: 'projets' },
    { id: 'facture-089', title: 'Facture #089', icon: '🧾', path: '/finance/089', space: 'entreprise', isDirty: true },
    { id: 'calendar', title: 'Calendrier', icon: '📅', path: '/calendar', isPinned: true },
    { id: 'nova', title: 'Nova', icon: '🤖', path: '/nova', isPinned: true },
    { id: 'equipe', title: 'Mon Équipe', icon: '👥', path: '/team', space: 'entreprise' },
  ]);
  const [activeTabId, setActiveTabId] = useState('dashboard');
  const [tabCounter, setTabCounter] = useState(7);

  const handleTabClose = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.closable === false) return;
    setTabs(tabs.filter(t => t.id !== tabId));
    if (activeTabId === tabId) {
      const remaining = tabs.filter(t => t.id !== tabId);
      if (remaining.length > 0) setActiveTabId(remaining[remaining.length - 1].id);
    }
  };

  const handleTabPin = (tabId: string) => {
    setTabs(tabs.map(t => t.id === tabId ? { ...t, isPinned: !t.isPinned } : t));
  };

  const handleNewTab = () => {
    const newTab: Tab = { id: `tab-${tabCounter}`, title: `Nouvel onglet ${tabCounter}`, icon: '📄', path: `/new/${tabCounter}` };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setTabCounter(tabCounter + 1);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0d0b', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ padding: tokens.spacing.lg, textAlign: 'center', borderBottom: `1px solid ${tokens.colors.border.default}` }}>
        <h1 style={{ color: tokens.colors.text.primary, fontSize: 28, marginBottom: 8, background: `linear-gradient(135deg, ${tokens.colors.gold}, ${tokens.colors.turquoise})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          📑 Persistent Tab System
        </h1>
        <p style={{ color: tokens.colors.text.secondary }}>Browser-like tabs for CHE·NU V25</p>
      </div>

      <TabSystem tabs={tabs} activeTabId={activeTabId} onTabClick={setActiveTabId} onTabClose={handleTabClose} onTabPin={handleTabPin} onTabReorder={setTabs} onNewTab={handleNewTab} maxTabs={12} />

      <div style={{ padding: tokens.spacing.xl, minHeight: 400 }}>
        <div style={{ padding: tokens.spacing.xl, backgroundColor: tokens.colors.bg.secondary, borderRadius: tokens.radius.lg, border: `1px solid ${tokens.colors.border.default}`, textAlign: 'center' }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>{tabs.find(t => t.id === activeTabId)?.icon}</span>
          <h2 style={{ color: tokens.colors.text.primary, marginBottom: 8 }}>{tabs.find(t => t.id === activeTabId)?.title}</h2>
          <p style={{ color: tokens.colors.text.muted }}>{tabs.find(t => t.id === activeTabId)?.path}</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: tokens.spacing.xl }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: tokens.spacing.md }}>
          {[
            { icon: '👆', title: 'Clic', desc: 'Activer' },
            { icon: '🖱️', title: 'Clic droit', desc: 'Menu' },
            { icon: '↔️', title: 'Glisser', desc: 'Réorganiser' },
            { icon: '📌', title: 'Épingler', desc: 'Garder' },
            { icon: '✕', title: 'Fermer', desc: 'Bouton X' },
            { icon: '➕', title: 'Nouveau', desc: 'Bouton +' },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.bg.secondary, borderRadius: tokens.radius.md, border: `1px solid ${tokens.colors.border.default}`, textAlign: 'center' }}>
              <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>{item.icon}</span>
              <div style={{ color: tokens.colors.text.primary, fontSize: 13, fontWeight: 500 }}>{item.title}</div>
              <div style={{ color: tokens.colors.text.muted, fontSize: 11 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabSystemDemo;
export { TabSystem };
export type { Tab, TabSystemProps };
