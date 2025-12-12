import React, { useState } from 'react';
import { colors, radius, shadows, transitions, space, typography } from '../design-system/tokens';
import { Button } from '../ui/Button';
import { Card, CardHeader, StatCard } from '../ui/Card';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — QUICK ACTIONS & DASHBOARD WIDGETS
 * ═══════════════════════════════════════════════════════════════════════════════
 * P3-02: Quick Actions et widgets intelligents pour le Dashboard
 * 
 * Components:
 * - QuickActionsBar: Barre d'actions rapides
 * - QuickActionButton: Bouton action individuel
 * - DashboardGrid: Grille de widgets
 * - ActivityWidget: Activité récente
 * - TasksWidget: Tâches en cours
 * - CalendarWidget: Mini calendrier
 * - ProjectsWidget: Projets actifs
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// QUICK ACTIONS BAR
// ─────────────────────────────────────────────────────────────────────────────

export function QuickActionsBar({
  actions = defaultQuickActions,
  onAction,
  variant = 'horizontal', // horizontal, grid
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: variant === 'grid' ? 'row' : 'row',
      flexWrap: variant === 'grid' ? 'wrap' : 'nowrap',
      gap: space.sm,
      padding: space.md,
      background: colors.background.secondary,
      borderRadius: radius.lg,
      border: `1px solid ${colors.border.default}`,
      overflowX: variant === 'horizontal' ? 'auto' : 'visible',
    }}>
      {actions.map(action => (
        <QuickActionButton
          key={action.id}
          {...action}
          onClick={() => onAction?.(action.id)}
          compact={variant === 'horizontal'}
        />
      ))}
    </div>
  );
}

const defaultQuickActions = [
  { id: 'new-project', icon: '📁', label: 'Nouveau projet', color: colors.sacredGold },
  { id: 'new-quote', icon: '📋', label: 'Nouveau devis', color: colors.cenoteTurquoise },
  { id: 'new-invoice', icon: '🧾', label: 'Nouvelle facture', color: colors.jungleEmerald },
  { id: 'new-event', icon: '📅', label: 'Nouveau RDV', color: '#a78bfa' },
  { id: 'new-task', icon: '☑️', label: 'Nouvelle tâche', color: '#f472b6' },
  { id: 'upload', icon: '📤', label: 'Téléverser', color: '#60a5fa' },
];

// ─────────────────────────────────────────────────────────────────────────────
// QUICK ACTION BUTTON
// ─────────────────────────────────────────────────────────────────────────────

export function QuickActionButton({
  icon,
  label,
  shortcut,
  color = colors.sacredGold,
  onClick,
  compact = false,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: compact ? 'row' : 'column',
        alignItems: 'center',
        gap: compact ? space.sm : space.xs,
        padding: compact ? `${space.sm} ${space.md}` : space.md,
        minWidth: compact ? 'auto' : '100px',
        background: isHovered ? `${color}15` : 'transparent',
        border: `1px solid ${isHovered ? color : colors.border.default}`,
        borderRadius: radius.md,
        cursor: 'pointer',
        transition: transitions.fast,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        width: compact ? '24px' : '40px',
        height: compact ? '24px' : '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${color}20`,
        borderRadius: radius.md,
        fontSize: compact ? '16px' : '22px',
      }}>
        {icon}
      </span>
      
      <span style={{
        fontSize: typography.fontSize.sm,
        color: isHovered ? color : colors.text.secondary,
        fontWeight: isHovered ? 500 : 400,
      }}>
        {label}
      </span>
      
      {shortcut && !compact && (
        <kbd style={{
          padding: '2px 6px',
          background: colors.background.tertiary,
          borderRadius: radius.sm,
          fontSize: '10px',
          color: colors.text.muted,
          fontFamily: typography.fontFamily.mono,
        }}>
          {shortcut}
        </kbd>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD GRID
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardGrid({ children, columns = 4 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: space.lg,
    }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS ROW
// ─────────────────────────────────────────────────────────────────────────────

export function StatsRow({ stats = defaultStats }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
      gap: space.md,
    }}>
      {stats.map(stat => (
        <StatCard
          key={stat.id}
          {...stat}
          variant="default"
        />
      ))}
    </div>
  );
}

const defaultStats = [
  { id: 'revenue', icon: '💰', label: 'Revenus du mois', value: '247,850 $', change: '+12%', changeType: 'positive' },
  { id: 'projects', icon: '📁', label: 'Projets actifs', value: '12', change: '+3', changeType: 'positive' },
  { id: 'team', icon: '👥', label: 'Équipe', value: '24', change: '+2', changeType: 'positive' },
  { id: 'tasks', icon: '☑️', label: 'Tâches complétées', value: '89%', change: '+5%', changeType: 'positive' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY WIDGET
// ─────────────────────────────────────────────────────────────────────────────

export function ActivityWidget({ 
  activities = defaultActivities,
  title = 'Activité récente',
  maxItems = 5,
  onViewAll,
}) {
  return (
    <Card padding="none" style={{ height: '100%' }}>
      <CardHeader 
        title={title} 
        icon="📊"
        action={
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            Voir tout
          </Button>
        }
        style={{ padding: space.md, borderBottom: `1px solid ${colors.border.subtle}` }}
      />
      
      <div style={{ padding: `0 ${space.md} ${space.md}` }}>
        {activities.slice(0, maxItems).map((activity, i) => (
          <ActivityItem key={activity.id || i} {...activity} />
        ))}
      </div>
    </Card>
  );
}

function ActivityItem({ icon, title, description, time, type }) {
  const typeColors = {
    project: colors.sacredGold,
    task: colors.jungleEmerald,
    payment: colors.cenoteTurquoise,
    message: '#a78bfa',
    alert: colors.status.error,
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: space.sm,
      padding: `${space.sm} 0`,
      borderBottom: `1px solid ${colors.border.subtle}`,
    }}>
      <span style={{
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${typeColors[type] || colors.background.tertiary}15`,
        borderRadius: radius.md,
        fontSize: '16px',
        flexShrink: 0,
      }}>
        {icon}
      </span>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.primary,
          fontWeight: 500,
          marginBottom: '2px',
        }}>
          {title}
        </div>
        {description && (
          <div style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {description}
          </div>
        )}
      </div>
      
      <span style={{
        fontSize: typography.fontSize.xs,
        color: colors.text.muted,
        whiteSpace: 'nowrap',
      }}>
        {time}
      </span>
    </div>
  );
}

const defaultActivities = [
  { icon: '📁', title: 'Nouveau projet créé', description: 'Rénovation Tremblay', time: 'Il y a 5 min', type: 'project' },
  { icon: '✅', title: 'Tâche complétée', description: 'Inspection électrique', time: 'Il y a 15 min', type: 'task' },
  { icon: '💳', title: 'Paiement reçu', description: '12,500 $ - Facture #1234', time: 'Il y a 1h', type: 'payment' },
  { icon: '💬', title: 'Nouveau message', description: 'Marie Tremblay', time: 'Il y a 2h', type: 'message' },
  { icon: '⚠️', title: 'Rappel', description: 'Renouvellement licence CCQ', time: 'Il y a 3h', type: 'alert' },
];

// ─────────────────────────────────────────────────────────────────────────────
// TASKS WIDGET
// ─────────────────────────────────────────────────────────────────────────────

export function TasksWidget({
  tasks = defaultTasks,
  title = 'Tâches prioritaires',
  onToggleTask,
  onAddTask,
}) {
  return (
    <Card padding="none" style={{ height: '100%' }}>
      <CardHeader 
        title={title} 
        icon="☑️"
        action={
          <Button variant="ghost" size="sm" onClick={onAddTask} leftIcon="➕">
            Ajouter
          </Button>
        }
        style={{ padding: space.md, borderBottom: `1px solid ${colors.border.subtle}` }}
      />
      
      <div style={{ padding: `0 ${space.md} ${space.md}` }}>
        {tasks.map((task, i) => (
          <TaskItem 
            key={task.id || i} 
            {...task} 
            onToggle={() => onToggleTask?.(task.id)}
          />
        ))}
      </div>
    </Card>
  );
}

function TaskItem({ title, dueDate, priority, completed, project, onToggle }) {
  const priorityColors = {
    high: colors.status.error,
    medium: colors.sacredGold,
    low: colors.jungleEmerald,
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: space.sm,
      padding: `${space.sm} 0`,
      borderBottom: `1px solid ${colors.border.subtle}`,
      opacity: completed ? 0.5 : 1,
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: completed ? colors.jungleEmerald : 'transparent',
          border: `2px solid ${completed ? colors.jungleEmerald : colors.border.strong}`,
          borderRadius: radius.sm,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {completed && (
          <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>
        )}
      </button>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.primary,
          textDecoration: completed ? 'line-through' : 'none',
        }}>
          {title}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: space.xs,
          marginTop: '2px',
        }}>
          {project && (
            <span style={{
              fontSize: typography.fontSize.xs,
              color: colors.text.muted,
            }}>
              📁 {project}
            </span>
          )}
          {dueDate && (
            <span style={{
              fontSize: typography.fontSize.xs,
              color: colors.text.muted,
            }}>
              • {dueDate}
            </span>
          )}
        </div>
      </div>
      
      {priority && (
        <span style={{
          width: '8px',
          height: '8px',
          background: priorityColors[priority],
          borderRadius: '50%',
          flexShrink: 0,
        }} />
      )}
    </div>
  );
}

const defaultTasks = [
  { id: '1', title: 'Finaliser devis cuisine', dueDate: 'Aujourd\'hui', priority: 'high', project: 'Rénovation Tremblay' },
  { id: '2', title: 'Commander matériaux', dueDate: 'Demain', priority: 'medium', project: 'Agrandissement Bergeron' },
  { id: '3', title: 'Appeler inspecteur', dueDate: 'Mercredi', priority: 'medium' },
  { id: '4', title: 'Réviser contrat sous-traitant', dueDate: 'Cette semaine', priority: 'low' },
  { id: '5', title: 'Mise à jour planning', dueDate: 'Cette semaine', priority: 'low', completed: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR WIDGET (Mini)
// ─────────────────────────────────────────────────────────────────────────────

export function CalendarWidget({
  events = defaultEvents,
  title = 'Aujourd\'hui',
  onViewCalendar,
}) {
  const today = new Date();
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  return (
    <Card padding="none" style={{ height: '100%' }}>
      <CardHeader 
        title={`${dayNames[today.getDay()]} ${today.getDate()} ${monthNames[today.getMonth()]}`}
        icon="📅"
        action={
          <Button variant="ghost" size="sm" onClick={onViewCalendar}>
            Calendrier
          </Button>
        }
        style={{ padding: space.md, borderBottom: `1px solid ${colors.border.subtle}` }}
      />
      
      <div style={{ padding: `0 ${space.md} ${space.md}` }}>
        {events.length === 0 ? (
          <div style={{
            padding: space.lg,
            textAlign: 'center',
            color: colors.text.muted,
          }}>
            Aucun événement aujourd'hui
          </div>
        ) : (
          events.map((event, i) => (
            <EventItem key={event.id || i} {...event} />
          ))
        )}
      </div>
    </Card>
  );
}

function EventItem({ title, time, type, location }) {
  const typeColors = {
    meeting: colors.cenoteTurquoise,
    task: colors.jungleEmerald,
    reminder: colors.sacredGold,
    deadline: colors.status.error,
  };

  return (
    <div style={{
      display: 'flex',
      gap: space.sm,
      padding: `${space.sm} 0`,
      borderBottom: `1px solid ${colors.border.subtle}`,
    }}>
      <div style={{
        width: '4px',
        background: typeColors[type] || colors.background.tertiary,
        borderRadius: radius.full,
        flexShrink: 0,
      }} />
      
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.primary,
          fontWeight: 500,
        }}>
          {title}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: space.xs,
          marginTop: '2px',
        }}>
          <span style={{
            fontSize: typography.fontSize.xs,
            color: colors.text.muted,
          }}>
            🕐 {time}
          </span>
          {location && (
            <span style={{
              fontSize: typography.fontSize.xs,
              color: colors.text.muted,
            }}>
              • 📍 {location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const defaultEvents = [
  { id: '1', title: 'Réunion équipe', time: '09:00', type: 'meeting', location: 'Bureau' },
  { id: '2', title: 'Visite chantier Tremblay', time: '11:00', type: 'task', location: 'Site' },
  { id: '3', title: 'Call client Bergeron', time: '14:30', type: 'meeting' },
  { id: '4', title: 'Deadline devis', time: '17:00', type: 'deadline' },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS WIDGET
// ─────────────────────────────────────────────────────────────────────────────

export function ProjectsWidget({
  projects = defaultProjects,
  title = 'Projets actifs',
  onViewProject,
  onViewAll,
}) {
  return (
    <Card padding="none" style={{ height: '100%' }}>
      <CardHeader 
        title={title} 
        icon="📁"
        action={
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            Voir tout
          </Button>
        }
        style={{ padding: space.md, borderBottom: `1px solid ${colors.border.subtle}` }}
      />
      
      <div style={{ padding: `0 ${space.md} ${space.md}` }}>
        {projects.map((project, i) => (
          <ProjectItem 
            key={project.id || i} 
            {...project}
            onClick={() => onViewProject?.(project.id)}
          />
        ))}
      </div>
    </Card>
  );
}

function ProjectItem({ name, client, progress, status, onClick }) {
  const statusColors = {
    active: colors.jungleEmerald,
    pending: colors.sacredGold,
    delayed: colors.status.error,
    completed: colors.text.muted,
  };

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: space.xs,
        padding: `${space.sm} 0`,
        borderBottom: `1px solid ${colors.border.subtle}`,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.primary,
          fontWeight: 500,
        }}>
          {name}
        </span>
        <span style={{
          padding: '2px 8px',
          background: `${statusColors[status]}15`,
          color: statusColors[status],
          borderRadius: radius.sm,
          fontSize: typography.fontSize.xs,
          fontWeight: 500,
          textTransform: 'capitalize',
        }}>
          {status}
        </span>
      </div>
      
      <div style={{
        fontSize: typography.fontSize.xs,
        color: colors.text.muted,
      }}>
        {client}
      </div>
      
      {/* Progress bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: space.sm,
      }}>
        <div style={{
          flex: 1,
          height: '4px',
          background: colors.background.tertiary,
          borderRadius: radius.full,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: statusColors[status],
            borderRadius: radius.full,
          }} />
        </div>
        <span style={{
          fontSize: typography.fontSize.xs,
          color: colors.text.muted,
          minWidth: '32px',
        }}>
          {progress}%
        </span>
      </div>
    </button>
  );
}

const defaultProjects = [
  { id: '1', name: 'Rénovation Tremblay', client: 'Marie Tremblay', progress: 75, status: 'active' },
  { id: '2', name: 'Agrandissement Bergeron', client: 'Pierre Bergeron', progress: 45, status: 'active' },
  { id: '3', name: 'Construction Laval', client: 'Entreprise ABC', progress: 20, status: 'pending' },
  { id: '4', name: 'Maintenance Gagnon', client: 'Jean Gagnon', progress: 100, status: 'completed' },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default QuickActionsBar;
