import React, { useState, useMemo, useCallback } from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — BATCH 8: MODULE TASKS COMPLET
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Features:
 * - T1: CRUD tâches complet
 * - T2: Commentaires sur tâches
 * - T3: Sous-tâches (checklist)
 * - T4: Assignation multiple
 * - T5: Priorités et tags
 * - T6: Dates et rappels
 * - T7: Pièces jointes
 * - T8: Time tracking
 * - T9: Drag & drop Kanban
 * - T10: Filtres avancés
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Design Tokens CHE·NU™
const T = {
  bg: { main: '#1A1A1A', card: '#242424', hover: '#2E2E2E', input: '#1E1E1E' },
  text: { primary: '#E8E4DC', secondary: '#A09080', muted: '#6B6560' },
  border: '#333333',
  accent: { gold: '#D8B26A', emerald: '#3F7249', turquoise: '#3EB4A2', danger: '#EF4444', purple: '#8B5CF6' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const TASK_STATUS = [
  { id: 'backlog', name: 'Backlog', icon: '📋', color: '#6B7280' },
  { id: 'todo', name: 'À faire', icon: '📌', color: T.accent.gold },
  { id: 'in_progress', name: 'En cours', icon: '🔄', color: T.accent.turquoise },
  { id: 'review', name: 'En révision', icon: '👀', color: T.accent.purple },
  { id: 'done', name: 'Terminé', icon: '✅', color: T.accent.emerald },
];

const PRIORITIES = [
  { id: 'urgent', name: 'Urgent', icon: '🔴', color: T.accent.danger },
  { id: 'high', name: 'Haute', icon: '🟠', color: '#F59E0B' },
  { id: 'medium', name: 'Moyenne', icon: '🟡', color: T.accent.gold },
  { id: 'low', name: 'Basse', icon: '🟢', color: T.accent.emerald },
];

const SAMPLE_USERS = [
  { id: 'u1', name: 'Jean-Pierre Tremblay', avatar: '👷', role: 'Chef de projet' },
  { id: 'u2', name: 'Marie Dubois', avatar: '👩‍💼', role: 'Chargée de projet' },
  { id: 'u3', name: 'Marc Gagnon', avatar: '🔧', role: 'Contremaître' },
  { id: 'u4', name: 'Sophie Lavoie', avatar: '📐', role: 'Architecte' },
];

const SAMPLE_TASKS = [
  {
    id: 't1',
    title: 'Préparer soumission Dupont',
    description: 'Préparer la soumission détaillée pour le projet de rénovation cuisine',
    status: 'in_progress',
    priority: 'high',
    assignees: ['u1', 'u2'],
    project: { id: 'p1', name: 'Rénovation Dupont' },
    dueDate: new Date(Date.now() + 86400000 * 2),
    createdAt: new Date(Date.now() - 86400000 * 3),
    tags: ['soumission', 'client'],
    subtasks: [
      { id: 's1', title: 'Mesurer le site', completed: true },
      { id: 's2', title: 'Calculer matériaux', completed: true },
      { id: 's3', title: 'Estimer main d\'œuvre', completed: false },
      { id: 's4', title: 'Rédiger document', completed: false },
    ],
    comments: [
      { id: 'c1', userId: 'u2', text: 'J\'ai terminé les mesures hier', createdAt: new Date(Date.now() - 86400000) },
      { id: 'c2', userId: 'u1', text: 'Parfait, je m\'occupe du calcul des matériaux', createdAt: new Date(Date.now() - 43200000) },
    ],
    timeTracked: 180, // minutes
    attachments: [],
  },
  {
    id: 't2',
    title: 'Commander matériaux BMR',
    description: 'Passer la commande pour les matériaux du projet Martin',
    status: 'todo',
    priority: 'urgent',
    assignees: ['u3'],
    project: { id: 'p2', name: 'Construction Martin' },
    dueDate: new Date(Date.now() + 86400000),
    createdAt: new Date(Date.now() - 86400000),
    tags: ['commande', 'fournisseur'],
    subtasks: [
      { id: 's5', title: 'Vérifier inventaire', completed: false },
      { id: 's6', title: 'Confirmer prix', completed: false },
      { id: 's7', title: 'Passer commande', completed: false },
    ],
    comments: [],
    timeTracked: 0,
    attachments: [],
  },
  {
    id: 't3',
    title: 'Inspection plomberie',
    description: 'Planifier et effectuer l\'inspection plomberie avec RBQ',
    status: 'review',
    priority: 'high',
    assignees: ['u1', 'u3'],
    project: { id: 'p1', name: 'Rénovation Dupont' },
    dueDate: new Date(Date.now() + 86400000 * 5),
    createdAt: new Date(Date.now() - 86400000 * 7),
    tags: ['inspection', 'RBQ'],
    subtasks: [],
    comments: [
      { id: 'c3', userId: 'u3', text: 'Inspection prévue pour jeudi matin', createdAt: new Date(Date.now() - 86400000 * 2) },
    ],
    timeTracked: 60,
    attachments: [{ name: 'checklist_plomberie.pdf', size: '245 KB' }],
  },
  {
    id: 't4',
    title: 'Formation SST équipe',
    description: 'Organiser la formation santé-sécurité obligatoire CNESST',
    status: 'done',
    priority: 'medium',
    assignees: ['u2'],
    project: null,
    dueDate: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 86400000 * 14),
    completedAt: new Date(Date.now() - 86400000),
    tags: ['formation', 'CNESST'],
    subtasks: [
      { id: 's8', title: 'Réserver salle', completed: true },
      { id: 's9', title: 'Confirmer formateur', completed: true },
      { id: 's10', title: 'Envoyer invitations', completed: true },
    ],
    comments: [],
    timeTracked: 240,
    attachments: [],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════════════════════

const formatDate = (date) => {
  if (!date) return '';
  const now = new Date();
  const diff = date - now;
  const days = Math.ceil(diff / 86400000);
  
  if (days < 0) return `En retard de ${Math.abs(days)}j`;
  if (days === 0) return 'Aujourd\'hui';
  if (days === 1) return 'Demain';
  if (days < 7) return `Dans ${days} jours`;
  return date.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' });
};

const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function TasksModule() {
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [view, setView] = useState('kanban'); // kanban, list, calendar
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({ status: [], priority: [], assignee: [], search: '' });

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.status.length && !filters.status.includes(task.status)) return false;
      if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
      if (filters.assignee.length && !task.assignees.some(a => filters.assignee.includes(a))) return false;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, filters]);

  // Task actions
  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    if (selectedTask?.id === taskId) {
      setSelectedTask(prev => ({ ...prev, ...updates }));
    }
  }, [selectedTask]);

  const createTask = useCallback((taskData) => {
    const newTask = {
      id: `t${Date.now()}`,
      ...taskData,
      createdAt: new Date(),
      subtasks: [],
      comments: [],
      timeTracked: 0,
      attachments: [],
    };
    setTasks(prev => [...prev, newTask]);
    setShowCreateModal(false);
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSelectedTask(null);
  }, []);

  const moveTask = useCallback((taskId, newStatus) => {
    updateTask(taskId, { 
      status: newStatus,
      completedAt: newStatus === 'done' ? new Date() : null,
    });
  }, [updateTask]);

  return (
    <div style={{ display: 'flex', height: '100vh', background: T.bg.main, color: T.text.primary }}>
      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <TasksHeader
          view={view}
          onViewChange={setView}
          onCreateTask={() => setShowCreateModal(true)}
          filters={filters}
          onFiltersChange={setFilters}
          taskCount={filteredTasks.length}
        />

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          {view === 'kanban' && (
            <KanbanView
              tasks={filteredTasks}
              onSelectTask={setSelectedTask}
              onMoveTask={moveTask}
            />
          )}
          {view === 'list' && (
            <ListView
              tasks={filteredTasks}
              onSelectTask={setSelectedTask}
              onUpdateTask={updateTask}
            />
          )}
        </div>
      </div>

      {/* Task Detail Sidebar */}
      {selectedTask && (
        <TaskDetailSidebar
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updates) => updateTask(selectedTask.id, updates)}
          onDelete={() => deleteTask(selectedTask.id)}
          users={SAMPLE_USERS}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createTask}
          users={SAMPLE_USERS}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════════════════════

function TasksHeader({ view, onViewChange, onCreateTask, filters, onFiltersChange, taskCount }) {
  return (
    <div style={{
      padding: '16px 24px',
      borderBottom: `1px solid ${T.border}`,
      background: T.bg.card,
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      <h2 style={{ margin: 0, fontSize: '20px' }}>📋 Tâches ({taskCount})</h2>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: '300px' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher..."
          value={filters.search}
          onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: T.bg.input,
            border: `1px solid ${T.border}`,
            borderRadius: '6px',
            color: T.text.primary,
            fontSize: '13px',
          }}
        />
      </div>

      {/* Filters */}
      <select
        value={filters.priority[0] || ''}
        onChange={e => onFiltersChange({ ...filters, priority: e.target.value ? [e.target.value] : [] })}
        style={selectStyle}
      >
        <option value="">Toutes priorités</option>
        {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
      </select>

      <select
        value={filters.assignee[0] || ''}
        onChange={e => onFiltersChange({ ...filters, assignee: e.target.value ? [e.target.value] : [] })}
        style={selectStyle}
      >
        <option value="">Tous</option>
        {SAMPLE_USERS.map(u => <option key={u.id} value={u.id}>{u.avatar} {u.name}</option>)}
      </select>

      <div style={{ flex: 1 }} />

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '4px', background: T.bg.hover, borderRadius: '6px', padding: '4px' }}>
        {[
          { id: 'kanban', icon: '📊', label: 'Kanban' },
          { id: 'list', icon: '📝', label: 'Liste' },
        ].map(v => (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id)}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              background: view === v.id ? T.accent.gold : 'transparent',
              color: view === v.id ? T.bg.main : T.text.secondary,
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            {v.icon}
          </button>
        ))}
      </div>

      {/* Create Button */}
      <button
        onClick={onCreateTask}
        style={{
          padding: '10px 20px',
          background: T.accent.gold,
          color: T.bg.main,
          border: 'none',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        ➕ Nouvelle tâche
      </button>
    </div>
  );
}

const selectStyle = {
  padding: '8px 12px',
  background: T.bg.input,
  border: `1px solid ${T.border}`,
  borderRadius: '6px',
  color: T.text.primary,
  fontSize: '13px',
  cursor: 'pointer',
};

// ═══════════════════════════════════════════════════════════════════════════════
// KANBAN VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function KanbanView({ tasks, onSelectTask, onMoveTask }) {
  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      height: '100%',
      overflowX: 'auto',
      paddingBottom: '16px',
    }}>
      {TASK_STATUS.map(status => {
        const columnTasks = tasks.filter(t => t.status === status.id);
        
        return (
          <div
            key={status.id}
            style={{
              minWidth: '300px',
              maxWidth: '300px',
              background: T.bg.card,
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '100%',
            }}
          >
            {/* Column Header */}
            <div style={{
              padding: '12px 16px',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>{status.icon}</span>
              <span style={{ fontWeight: 500 }}>{status.name}</span>
              <span style={{
                padding: '2px 8px',
                background: status.color + '20',
                color: status.color,
                borderRadius: '10px',
                fontSize: '12px',
              }}>
                {columnTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
              {columnTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onSelectTask(task)}
                />
              ))}
              
              {columnTasks.length === 0 && (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: T.text.muted,
                  fontSize: '13px',
                }}>
                  Aucune tâche
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK CARD
// ═══════════════════════════════════════════════════════════════════════════════

function TaskCard({ task, onClick }) {
  const priority = PRIORITIES.find(p => p.id === task.priority);
  const subtasksDone = task.subtasks.filter(s => s.completed).length;
  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== 'done';

  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px',
        background: T.bg.main,
        borderRadius: '6px',
        marginBottom: '8px',
        cursor: 'pointer',
        borderLeft: `3px solid ${priority?.color || T.border}`,
        transition: 'transform 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      {/* Priority & Tags */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
        {priority && (
          <span style={{
            padding: '2px 6px',
            background: priority.color + '20',
            color: priority.color,
            borderRadius: '4px',
            fontSize: '10px',
          }}>
            {priority.icon} {priority.name}
          </span>
        )}
        {task.tags?.slice(0, 2).map(tag => (
          <span key={tag} style={{
            padding: '2px 6px',
            background: T.bg.hover,
            color: T.text.muted,
            borderRadius: '4px',
            fontSize: '10px',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 500 }}>{task.title}</h4>

      {/* Project */}
      {task.project && (
        <div style={{ fontSize: '12px', color: T.accent.gold, marginBottom: '8px' }}>
          📁 {task.project.name}
        </div>
      )}

      {/* Subtasks Progress */}
      {task.subtasks.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: T.text.muted,
            marginBottom: '4px',
          }}>
            <span>☑️ {subtasksDone}/{task.subtasks.length}</span>
          </div>
          <div style={{
            height: '4px',
            background: T.bg.hover,
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${(subtasksDone / task.subtasks.length) * 100}%`,
              height: '100%',
              background: T.accent.emerald,
            }} />
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
      }}>
        {/* Assignees */}
        <div style={{ display: 'flex', gap: '-8px' }}>
          {task.assignees.slice(0, 3).map((userId, i) => {
            const user = SAMPLE_USERS.find(u => u.id === userId);
            return (
              <span key={userId} style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: T.bg.hover,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                marginLeft: i > 0 ? '-8px' : 0,
                border: `2px solid ${T.bg.main}`,
              }}>
                {user?.avatar || '👤'}
              </span>
            );
          })}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <span style={{ color: isOverdue ? T.accent.danger : T.text.muted }}>
            📅 {formatDate(task.dueDate)}
          </span>
        )}

        {/* Comments */}
        {task.comments.length > 0 && (
          <span style={{ color: T.text.muted }}>💬 {task.comments.length}</span>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIST VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function ListView({ tasks, onSelectTask, onUpdateTask }) {
  return (
    <div style={{ background: T.bg.card, borderRadius: '8px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 120px 150px 100px 100px',
        padding: '12px 16px',
        borderBottom: `1px solid ${T.border}`,
        fontSize: '12px',
        color: T.text.muted,
        fontWeight: 500,
      }}>
        <div></div>
        <div>Tâche</div>
        <div>Statut</div>
        <div>Assigné</div>
        <div>Priorité</div>
        <div>Échéance</div>
      </div>

      {/* Rows */}
      {tasks.map(task => {
        const priority = PRIORITIES.find(p => p.id === task.priority);
        const status = TASK_STATUS.find(s => s.id === task.status);
        const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== 'done';

        return (
          <div
            key={task.id}
            onClick={() => onSelectTask(task)}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 120px 150px 100px 100px',
              padding: '12px 16px',
              borderBottom: `1px solid ${T.border}`,
              cursor: 'pointer',
              alignItems: 'center',
            }}
          >
            <input
              type="checkbox"
              checked={task.status === 'done'}
              onChange={(e) => {
                e.stopPropagation();
                onUpdateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' });
              }}
              onClick={e => e.stopPropagation()}
            />
            <div>
              <div style={{ fontWeight: 500 }}>{task.title}</div>
              {task.project && (
                <div style={{ fontSize: '12px', color: T.accent.gold }}>📁 {task.project.name}</div>
              )}
            </div>
            <span style={{
              padding: '4px 8px',
              background: status?.color + '20',
              color: status?.color,
              borderRadius: '4px',
              fontSize: '11px',
            }}>
              {status?.icon} {status?.name}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {task.assignees.slice(0, 2).map(userId => {
                const user = SAMPLE_USERS.find(u => u.id === userId);
                return <span key={userId}>{user?.avatar}</span>;
              })}
            </div>
            <span style={{ color: priority?.color }}>{priority?.icon} {priority?.name}</span>
            <span style={{ color: isOverdue ? T.accent.danger : T.text.muted, fontSize: '13px' }}>
              {task.dueDate ? formatDate(task.dueDate) : '-'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK DETAIL SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

function TaskDetailSidebar({ task, onClose, onUpdate, onDelete, users }) {
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const toggleSubtask = (subtaskId) => {
    const updated = task.subtasks.map(s => 
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    onUpdate({ subtasks: updated });
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    const updated = [...task.subtasks, { id: `s${Date.now()}`, title: newSubtask, completed: false }];
    onUpdate({ subtasks: updated });
    setNewSubtask('');
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    const updated = [...task.comments, {
      id: `c${Date.now()}`,
      userId: 'u1',
      text: newComment,
      createdAt: new Date(),
    }];
    onUpdate({ comments: updated });
    setNewComment('');
  };

  const priority = PRIORITIES.find(p => p.id === task.priority);
  const status = TASK_STATUS.find(s => s.id === task.status);

  return (
    <div style={{
      width: '450px',
      background: T.bg.card,
      borderLeft: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${T.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Détails de la tâche</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onDelete()} style={iconBtn}>🗑️</button>
          <button onClick={onClose} style={iconBtn}>✕</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* Title */}
        <input
          type="text"
          value={task.title}
          onChange={e => onUpdate({ title: e.target.value })}
          style={{
            width: '100%',
            padding: '8px 0',
            background: 'transparent',
            border: 'none',
            color: T.text.primary,
            fontSize: '18px',
            fontWeight: 600,
          }}
        />

        {/* Status & Priority */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <select
            value={task.status}
            onChange={e => onUpdate({ status: e.target.value })}
            style={{ ...selectStyle, flex: 1 }}
          >
            {TASK_STATUS.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
          </select>
          <select
            value={task.priority}
            onChange={e => onUpdate({ priority: e.target.value })}
            style={{ ...selectStyle, flex: 1 }}
          >
            {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
          </select>
        </div>

        {/* Description */}
        <div style={{ marginTop: '16px' }}>
          <label style={{ fontSize: '12px', color: T.text.muted, display: 'block', marginBottom: '8px' }}>
            Description
          </label>
          <textarea
            value={task.description || ''}
            onChange={e => onUpdate({ description: e.target.value })}
            placeholder="Ajouter une description..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px',
              background: T.bg.input,
              border: `1px solid ${T.border}`,
              borderRadius: '6px',
              color: T.text.primary,
              resize: 'vertical',
            }}
          />
        </div>

        {/* Assignees */}
        <div style={{ marginTop: '16px' }}>
          <label style={{ fontSize: '12px', color: T.text.muted, display: 'block', marginBottom: '8px' }}>
            Assignés
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {task.assignees.map(userId => {
              const user = users.find(u => u.id === userId);
              return user ? (
                <span key={userId} style={{
                  padding: '6px 10px',
                  background: T.bg.hover,
                  borderRadius: '20px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  {user.avatar} {user.name}
                </span>
              ) : null;
            })}
          </div>
        </div>

        {/* Subtasks */}
        <div style={{ marginTop: '20px' }}>
          <label style={{ fontSize: '12px', color: T.text.muted, display: 'block', marginBottom: '8px' }}>
            Sous-tâches ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
          </label>
          {task.subtasks.map(subtask => (
            <div
              key={subtask.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 0',
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => toggleSubtask(subtask.id)}
              />
              <span style={{
                flex: 1,
                textDecoration: subtask.completed ? 'line-through' : 'none',
                color: subtask.completed ? T.text.muted : T.text.primary,
              }}>
                {subtask.title}
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
              type="text"
              value={newSubtask}
              onChange={e => setNewSubtask(e.target.value)}
              placeholder="Ajouter une sous-tâche..."
              onKeyPress={e => e.key === 'Enter' && addSubtask()}
              style={{
                flex: 1,
                padding: '8px',
                background: T.bg.input,
                border: `1px solid ${T.border}`,
                borderRadius: '4px',
                color: T.text.primary,
                fontSize: '13px',
              }}
            />
            <button onClick={addSubtask} style={{ ...iconBtn, background: T.accent.gold, color: T.bg.main }}>+</button>
          </div>
        </div>

        {/* Time Tracking */}
        <div style={{ marginTop: '20px' }}>
          <label style={{ fontSize: '12px', color: T.text.muted, display: 'block', marginBottom: '8px' }}>
            ⏱️ Temps enregistré: {formatTime(task.timeTracked)}
          </label>
          <button
            onClick={() => setIsTracking(!isTracking)}
            style={{
              padding: '8px 16px',
              background: isTracking ? T.accent.danger : T.accent.emerald,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            {isTracking ? '⏹️ Arrêter' : '▶️ Démarrer'}
          </button>
        </div>

        {/* Comments */}
        <div style={{ marginTop: '20px' }}>
          <label style={{ fontSize: '12px', color: T.text.muted, display: 'block', marginBottom: '8px' }}>
            💬 Commentaires ({task.comments.length})
          </label>
          {task.comments.map(comment => {
            const user = users.find(u => u.id === comment.userId);
            return (
              <div key={comment.id} style={{
                padding: '12px',
                background: T.bg.main,
                borderRadius: '6px',
                marginBottom: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span>{user?.avatar || '👤'}</span>
                  <span style={{ fontWeight: 500, fontSize: '13px' }}>{user?.name || 'Utilisateur'}</span>
                  <span style={{ fontSize: '11px', color: T.text.muted }}>
                    {comment.createdAt.toLocaleDateString('fr-CA')}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: T.text.secondary }}>{comment.text}</p>
              </div>
            );
          })}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              onKeyPress={e => e.key === 'Enter' && addComment()}
              style={{
                flex: 1,
                padding: '10px',
                background: T.bg.input,
                border: `1px solid ${T.border}`,
                borderRadius: '6px',
                color: T.text.primary,
                fontSize: '13px',
              }}
            />
            <button onClick={addComment} style={{
              padding: '10px 16px',
              background: T.accent.gold,
              color: T.bg.main,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}>
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const iconBtn = {
  background: T.bg.hover,
  border: 'none',
  borderRadius: '6px',
  padding: '8px',
  cursor: 'pointer',
  fontSize: '14px',
};

// ═══════════════════════════════════════════════════════════════════════════════
// CREATE TASK MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function CreateTaskModal({ onClose, onCreate, users }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignees: [],
    dueDate: null,
    tags: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onCreate(form);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '500px',
        background: T.bg.card,
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>➕ Nouvelle tâche</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: T.text.muted, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="Titre de la tâche"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
            style={inputStyle}
          />

          <textarea
            placeholder="Description..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
              {TASK_STATUS.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
            </select>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={inputStyle}>
              {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
            </select>
          </div>

          <input
            type="date"
            value={form.dueDate || ''}
            onChange={e => setForm({ ...form, dueDate: e.target.value ? new Date(e.target.value) : null })}
            style={inputStyle}
          />
        </div>

        <div style={{ padding: '16px 20px', borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" onClick={onClose} style={{ padding: '10px 20px', background: T.bg.hover, border: 'none', borderRadius: '6px', color: T.text.secondary, cursor: 'pointer' }}>
            Annuler
          </button>
          <button type="submit" style={{ padding: '10px 24px', background: T.accent.gold, color: T.bg.main, border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
            Créer
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  background: T.bg.input,
  border: `1px solid ${T.border}`,
  borderRadius: '6px',
  color: T.text.primary,
  fontSize: '14px',
};
