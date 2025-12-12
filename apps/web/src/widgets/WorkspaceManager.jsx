import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { colors, radius, shadows, transitions, space, typography, zIndex } from '../../design-system/tokens';
import { Button } from '../ui/Button';
import { Modal, ModalBody, ModalFooter } from '../ui/Modal';
import { Input } from '../ui/Input';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — WORKSPACES MANAGER
 * ═══════════════════════════════════════════════════════════════════════════════
 * P3-04: Layouts personnalisés sauvegardables
 * 
 * Features:
 * - Créer/sauvegarder des workspaces
 * - Restaurer disposition des widgets
 * - Presets par défaut (Dev, Manager, Finance, etc.)
 * - Partager workspaces (export/import)
 * - Persistence localStorage + cloud ready
 * 
 * Usage:
 *   <WorkspacesProvider>
 *     <App />
 *   </WorkspacesProvider>
 * 
 *   const { currentWorkspace, switchWorkspace, saveWorkspace } = useWorkspaces();
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT WORKSPACES PRESETS
// ─────────────────────────────────────────────────────────────────────────────

const defaultWorkspaces = [
  {
    id: 'default',
    name: 'Par défaut',
    icon: '🏠',
    description: 'Configuration standard',
    isPreset: true,
    layout: {
      sidebarCollapsed: false,
      theme: 'dark',
      language: 'fr',
      dashboardWidgets: ['stats', 'activity', 'tasks', 'calendar', 'projects'],
      widgetSizes: { stats: 'full', activity: 'half', tasks: 'half', calendar: 'half', projects: 'half' },
      favoritePages: ['dashboard', 'projects', 'calendar'],
      quickActions: ['new-project', 'new-task', 'new-event'],
    },
  },
  {
    id: 'manager',
    name: 'Gestionnaire',
    icon: '👔',
    description: 'Vue d\'ensemble pour les gestionnaires',
    isPreset: true,
    layout: {
      sidebarCollapsed: false,
      theme: 'dark',
      language: 'fr',
      dashboardWidgets: ['stats', 'projects', 'team', 'finance'],
      widgetSizes: { stats: 'full', projects: 'half', team: 'half', finance: 'full' },
      favoritePages: ['dashboard', 'projects', 'team', 'finance'],
      quickActions: ['new-project', 'new-quote', 'team-schedule'],
    },
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    description: 'Focus sur les données financières',
    isPreset: true,
    layout: {
      sidebarCollapsed: false,
      theme: 'dark',
      language: 'fr',
      dashboardWidgets: ['finance-stats', 'invoices', 'payments', 'reports'],
      widgetSizes: { 'finance-stats': 'full', invoices: 'half', payments: 'half', reports: 'full' },
      favoritePages: ['finance', 'documents', 'suppliers'],
      quickActions: ['new-invoice', 'new-quote', 'export-report'],
    },
  },
  {
    id: 'field',
    name: 'Terrain',
    icon: '🏗️',
    description: 'Pour les équipes sur le terrain',
    isPreset: true,
    layout: {
      sidebarCollapsed: true,
      theme: 'light',
      language: 'fr',
      dashboardWidgets: ['tasks', 'calendar', 'team'],
      widgetSizes: { tasks: 'full', calendar: 'half', team: 'half' },
      favoritePages: ['projects', 'calendar', 'documents'],
      quickActions: ['new-task', 'upload', 'new-event'],
    },
  },
  {
    id: 'compact',
    name: 'Compact',
    icon: '📱',
    description: 'Interface minimale',
    isPreset: true,
    layout: {
      sidebarCollapsed: true,
      theme: 'dark',
      language: 'fr',
      dashboardWidgets: ['stats', 'tasks'],
      widgetSizes: { stats: 'full', tasks: 'full' },
      favoritePages: ['dashboard', 'projects'],
      quickActions: ['new-task'],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// WORKSPACES CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const WorkspacesContext = createContext(null);

export function useWorkspaces() {
  const context = useContext(WorkspacesContext);
  if (!context) {
    throw new Error('useWorkspaces must be used within WorkspacesProvider');
  }
  return context;
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKSPACES PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export function WorkspacesProvider({ children, onLayoutChange }) {
  const [workspaces, setWorkspaces] = useState(() => {
    try {
      const saved = localStorage.getItem('chenu-workspaces');
      const custom = saved ? JSON.parse(saved) : [];
      return [...defaultWorkspaces, ...custom];
    } catch {
      return defaultWorkspaces;
    }
  });

  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(() => {
    return localStorage.getItem('chenu-current-workspace') || 'default';
  });

  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId) || workspaces[0];

  // Sauvegarder les workspaces custom
  useEffect(() => {
    const customWorkspaces = workspaces.filter(w => !w.isPreset);
    localStorage.setItem('chenu-workspaces', JSON.stringify(customWorkspaces));
  }, [workspaces]);

  // Sauvegarder le workspace actuel
  useEffect(() => {
    localStorage.setItem('chenu-current-workspace', currentWorkspaceId);
  }, [currentWorkspaceId]);

  // Appliquer le layout quand le workspace change
  useEffect(() => {
    if (currentWorkspace?.layout) {
      onLayoutChange?.(currentWorkspace.layout);
    }
  }, [currentWorkspace, onLayoutChange]);

  // Changer de workspace
  const switchWorkspace = useCallback((workspaceId) => {
    setCurrentWorkspaceId(workspaceId);
  }, []);

  // Créer un nouveau workspace
  const createWorkspace = useCallback((workspace) => {
    const newWorkspace = {
      ...workspace,
      id: `custom-${Date.now()}`,
      isPreset: false,
      createdAt: new Date().toISOString(),
    };
    setWorkspaces(prev => [...prev, newWorkspace]);
    return newWorkspace.id;
  }, []);

  // Mettre à jour un workspace
  const updateWorkspace = useCallback((workspaceId, updates) => {
    setWorkspaces(prev => prev.map(w => 
      w.id === workspaceId && !w.isPreset
        ? { ...w, ...updates, updatedAt: new Date().toISOString() }
        : w
    ));
  }, []);

  // Supprimer un workspace
  const deleteWorkspace = useCallback((workspaceId) => {
    setWorkspaces(prev => prev.filter(w => w.id !== workspaceId || w.isPreset));
    if (currentWorkspaceId === workspaceId) {
      setCurrentWorkspaceId('default');
    }
  }, [currentWorkspaceId]);

  // Dupliquer un workspace
  const duplicateWorkspace = useCallback((workspaceId) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      return createWorkspace({
        ...workspace,
        name: `${workspace.name} (copie)`,
        isPreset: false,
      });
    }
  }, [workspaces, createWorkspace]);

  // Exporter un workspace
  const exportWorkspace = useCallback((workspaceId) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      const exportData = {
        ...workspace,
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };
      return JSON.stringify(exportData, null, 2);
    }
  }, [workspaces]);

  // Importer un workspace
  const importWorkspace = useCallback((jsonString) => {
    try {
      const workspace = JSON.parse(jsonString);
      if (workspace.name && workspace.layout) {
        return createWorkspace({
          ...workspace,
          name: `${workspace.name} (importé)`,
          isPreset: false,
        });
      }
    } catch (e) {
      console.error('Import failed:', e);
    }
    return null;
  }, [createWorkspace]);

  // Sauvegarder le layout actuel dans le workspace
  const saveCurrentLayout = useCallback((layout) => {
    if (currentWorkspace && !currentWorkspace.isPreset) {
      updateWorkspace(currentWorkspaceId, { layout });
    }
  }, [currentWorkspace, currentWorkspaceId, updateWorkspace]);

  const value = {
    workspaces,
    currentWorkspace,
    currentWorkspaceId,
    presets: workspaces.filter(w => w.isPreset),
    customWorkspaces: workspaces.filter(w => !w.isPreset),
    switchWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    duplicateWorkspace,
    exportWorkspace,
    importWorkspace,
    saveCurrentLayout,
  };

  return (
    <WorkspacesContext.Provider value={value}>
      {children}
    </WorkspacesContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKSPACE SELECTOR
// ─────────────────────────────────────────────────────────────────────────────

export function WorkspaceSelector({ compact = false }) {
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspaces();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Changer de workspace"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: space.sm,
          padding: compact ? space.sm : `${space.sm} ${space.md}`,
          background: colors.background.tertiary,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.md,
          cursor: 'pointer',
          transition: transitions.fast,
        }}
      >
        <span style={{ fontSize: '18px' }}>{currentWorkspace?.icon || '🏠'}</span>
        {!compact && (
          <>
            <span style={{
              color: colors.text.primary,
              fontSize: typography.fontSize.sm,
              fontWeight: 500,
            }}>
              {currentWorkspace?.name || 'Par défaut'}
            </span>
            <span style={{ color: colors.text.muted, fontSize: '12px' }}>▾</span>
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: zIndex.dropdown - 1,
            }}
          />
          
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: space.xs,
            minWidth: '240px',
            background: colors.background.secondary,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.lg,
            boxShadow: shadows.dropdown,
            overflow: 'hidden',
            zIndex: zIndex.dropdown,
          }}>
            {/* Presets */}
            <div style={{ padding: space.xs }}>
              <div style={{
                padding: `${space.xs} ${space.sm}`,
                fontSize: typography.fontSize.xs,
                color: colors.text.muted,
                fontWeight: 600,
                textTransform: 'uppercase',
              }}>
                Presets
              </div>
              {workspaces.filter(w => w.isPreset).map(w => (
                <WorkspaceItem
                  key={w.id}
                  workspace={w}
                  isActive={w.id === currentWorkspace?.id}
                  onClick={() => {
                    switchWorkspace(w.id);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>

            {/* Custom */}
            {workspaces.filter(w => !w.isPreset).length > 0 && (
              <div style={{
                padding: space.xs,
                borderTop: `1px solid ${colors.border.default}`,
              }}>
                <div style={{
                  padding: `${space.xs} ${space.sm}`,
                  fontSize: typography.fontSize.xs,
                  color: colors.text.muted,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}>
                  Mes workspaces
                </div>
                {workspaces.filter(w => !w.isPreset).map(w => (
                  <WorkspaceItem
                    key={w.id}
                    workspace={w}
                    isActive={w.id === currentWorkspace?.id}
                    onClick={() => {
                      switchWorkspace(w.id);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function WorkspaceItem({ workspace, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: space.sm,
        padding: `${space.sm} ${space.md}`,
        background: isActive ? `${colors.sacredGold}15` : 'transparent',
        border: 'none',
        borderRadius: radius.sm,
        cursor: 'pointer',
        textAlign: 'left',
        transition: transitions.fast,
      }}
    >
      <span style={{ fontSize: '18px' }}>{workspace.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: typography.fontSize.sm,
          color: isActive ? colors.sacredGold : colors.text.primary,
          fontWeight: isActive ? 500 : 400,
        }}>
          {workspace.name}
        </div>
        {workspace.description && (
          <div style={{
            fontSize: typography.fontSize.xs,
            color: colors.text.muted,
          }}>
            {workspace.description}
          </div>
        )}
      </div>
      {isActive && <span style={{ color: colors.sacredGold }}>✓</span>}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKSPACE MANAGER MODAL
// ─────────────────────────────────────────────────────────────────────────────

export function WorkspaceManagerModal({ isOpen, onClose }) {
  const {
    workspaces,
    currentWorkspace,
    switchWorkspace,
    createWorkspace,
    deleteWorkspace,
    duplicateWorkspace,
    exportWorkspace,
  } = useWorkspaces();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', icon: '📁', description: '' });

  const handleCreate = () => {
    if (newWorkspace.name.trim()) {
      const id = createWorkspace({
        ...newWorkspace,
        layout: currentWorkspace?.layout || {},
      });
      switchWorkspace(id);
      setShowCreateModal(false);
      setNewWorkspace({ name: '', icon: '📁', description: '' });
    }
  };

  const handleExport = (workspaceId) => {
    const json = exportWorkspace(workspaceId);
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workspace-${workspaceId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!isOpen) return null;

  const icons = ['📁', '🏠', '💼', '🎯', '⚡', '🔧', '📊', '🎨', '🚀', '💡'];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Gérer les workspaces"
        icon="🗂️"
        size="lg"
      >
        <ModalBody>
          {/* Presets */}
          <div style={{ marginBottom: space.lg }}>
            <h3 style={{
              margin: `0 0 ${space.md}`,
              fontSize: typography.fontSize.sm,
              fontWeight: 600,
              color: colors.text.muted,
              textTransform: 'uppercase',
            }}>
              Presets
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: space.sm,
            }}>
              {workspaces.filter(w => w.isPreset).map(w => (
                <WorkspaceCard
                  key={w.id}
                  workspace={w}
                  isActive={w.id === currentWorkspace?.id}
                  onSelect={() => switchWorkspace(w.id)}
                  onDuplicate={() => duplicateWorkspace(w.id)}
                />
              ))}
            </div>
          </div>

          {/* Custom Workspaces */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: space.md,
            }}>
              <h3 style={{
                margin: 0,
                fontSize: typography.fontSize.sm,
                fontWeight: 600,
                color: colors.text.muted,
                textTransform: 'uppercase',
              }}>
                Mes workspaces
              </h3>
              
              <Button
                variant="secondary"
                size="sm"
                leftIcon="➕"
                onClick={() => setShowCreateModal(true)}
              >
                Créer
              </Button>
            </div>

            {workspaces.filter(w => !w.isPreset).length === 0 ? (
              <div style={{
                padding: space.xl,
                textAlign: 'center',
                background: colors.background.tertiary,
                borderRadius: radius.lg,
                color: colors.text.muted,
              }}>
                <span style={{ fontSize: '32px', opacity: 0.5 }}>📁</span>
                <p style={{ margin: `${space.sm} 0 0` }}>
                  Aucun workspace personnalisé
                </p>
                <p style={{ fontSize: typography.fontSize.sm }}>
                  Créez un workspace pour sauvegarder votre configuration
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: space.sm,
              }}>
                {workspaces.filter(w => !w.isPreset).map(w => (
                  <WorkspaceCard
                    key={w.id}
                    workspace={w}
                    isActive={w.id === currentWorkspace?.id}
                    onSelect={() => switchWorkspace(w.id)}
                    onDelete={() => deleteWorkspace(w.id)}
                    onDuplicate={() => duplicateWorkspace(w.id)}
                    onExport={() => handleExport(w.id)}
                    editable
                  />
                ))}
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
        </ModalFooter>
      </Modal>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nouveau workspace"
        size="sm"
      >
        <ModalBody>
          <div style={{ marginBottom: space.md }}>
            <label style={{
              display: 'block',
              marginBottom: space.xs,
              fontSize: typography.fontSize.sm,
              fontWeight: 500,
              color: colors.text.primary,
            }}>
              Icône
            </label>
            <div style={{ display: 'flex', gap: space.xs, flexWrap: 'wrap' }}>
              {icons.map(icon => (
                <button
                  key={icon}
                  onClick={() => setNewWorkspace(prev => ({ ...prev, icon }))}
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: newWorkspace.icon === icon ? `${colors.sacredGold}20` : colors.background.tertiary,
                    border: newWorkspace.icon === icon ? `2px solid ${colors.sacredGold}` : '2px solid transparent',
                    borderRadius: radius.md,
                    cursor: 'pointer',
                    fontSize: '20px',
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Nom"
            value={newWorkspace.name}
            onChange={(e) => setNewWorkspace(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Mon workspace"
            style={{ marginBottom: space.md }}
          />

          <Input
            label="Description (optionnel)"
            value={newWorkspace.description}
            onChange={(e) => setNewWorkspace(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Configuration pour..."
          />

          <p style={{
            marginTop: space.md,
            fontSize: typography.fontSize.sm,
            color: colors.text.muted,
          }}>
            Le workspace sera créé avec votre configuration actuelle.
          </p>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={!newWorkspace.name.trim()}>
            Créer
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKSPACE CARD
// ─────────────────────────────────────────────────────────────────────────────

function WorkspaceCard({
  workspace,
  isActive,
  onSelect,
  onDelete,
  onDuplicate,
  onExport,
  editable = false,
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div style={{
      position: 'relative',
      padding: space.md,
      background: isActive ? `${colors.sacredGold}10` : colors.background.tertiary,
      border: `1px solid ${isActive ? colors.sacredGold : colors.border.default}`,
      borderRadius: radius.lg,
      cursor: 'pointer',
      transition: transitions.fast,
    }}
      onClick={onSelect}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: space.sm }}>
        <span style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: colors.background.secondary,
          borderRadius: radius.md,
          fontSize: '20px',
        }}>
          {workspace.icon}
        </span>

        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: space.xs,
          }}>
            <span style={{
              fontSize: typography.fontSize.md,
              fontWeight: 500,
              color: isActive ? colors.sacredGold : colors.text.primary,
            }}>
              {workspace.name}
            </span>
            {isActive && (
              <span style={{
                padding: '2px 6px',
                background: colors.sacredGold,
                color: colors.darkSlate,
                borderRadius: radius.sm,
                fontSize: '10px',
                fontWeight: 600,
              }}>
                ACTIF
              </span>
            )}
          </div>
          
          {workspace.description && (
            <p style={{
              margin: `${space.xs} 0 0`,
              fontSize: typography.fontSize.sm,
              color: colors.text.muted,
            }}>
              {workspace.description}
            </p>
          )}
        </div>

        {/* Actions menu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            borderRadius: radius.sm,
            cursor: 'pointer',
            color: colors.text.muted,
          }}
        >
          ⋮
        </button>
      </div>

      {/* Dropdown menu */}
      {showMenu && (
        <>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1,
            }}
          />
          <div style={{
            position: 'absolute',
            top: '48px',
            right: space.sm,
            padding: space.xs,
            background: colors.background.secondary,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.md,
            boxShadow: shadows.dropdown,
            zIndex: 2,
            minWidth: '140px',
          }}>
            <MenuButton icon="📋" label="Dupliquer" onClick={onDuplicate} />
            {onExport && <MenuButton icon="📤" label="Exporter" onClick={onExport} />}
            {editable && onDelete && (
              <>
                <div style={{ height: '1px', background: colors.border.default, margin: `${space.xs} 0` }} />
                <MenuButton icon="🗑️" label="Supprimer" onClick={onDelete} danger />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MenuButton({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: space.sm,
        padding: `${space.sm} ${space.md}`,
        background: 'none',
        border: 'none',
        borderRadius: radius.sm,
        cursor: 'pointer',
        color: danger ? colors.status.error : colors.text.primary,
        fontSize: typography.fontSize.sm,
        textAlign: 'left',
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { defaultWorkspaces };
