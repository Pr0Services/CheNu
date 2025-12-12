/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — NOTIFICATIONS CENTER MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 * Centre de notifications complet avec:
 * - Notifications temps réel avec WebSocket simulation
 * - Filtres par type, projet, priorité
 * - Actions rapides inline
 * - Groupement intelligent
 * - Mode Ne pas déranger
 * - Historique et archivage
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS CHE·NU™
// ─────────────────────────────────────────────────────────────────────────────

const tokens = {
  colors: {
    sacredGold: '#D8B26A',
    cenoteTurquoise: '#3EB4A2',
    jungleEmerald: '#3F7249',
    ancientStone: '#8D8371',
    earthEmber: '#7A593A',
    darkSlate: '#1A1A1A',
    error: '#C45C4A',
    bg: {
      primary: '#0f1217',
      secondary: '#161B22',
      tertiary: '#1E242C',
      card: 'rgba(22, 27, 34, 0.95)',
      hover: 'rgba(216, 178, 106, 0.08)',
    },
    text: {
      primary: '#E9E4D6',
      secondary: '#A0998A',
      muted: '#6B6560',
    },
    border: 'rgba(216, 178, 106, 0.15)',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  fonts: { heading: "'Lora', serif", body: "'Inter', sans-serif" },
  transitions: { fast: 'all 0.15s ease', normal: 'all 0.3s ease' },
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION TYPES & ICONS
// ─────────────────────────────────────────────────────────────────────────────

const NOTIFICATION_TYPES = {
  task: { icon: '✅', label: 'Tâche', color: tokens.colors.cenoteTurquoise },
  project: { icon: '📁', label: 'Projet', color: tokens.colors.sacredGold },
  message: { icon: '💬', label: 'Message', color: '#4A90D9' },
  mention: { icon: '@', label: 'Mention', color: '#9B59B6' },
  comment: { icon: '💭', label: 'Commentaire', color: tokens.colors.ancientStone },
  deadline: { icon: '⏰', label: 'Échéance', color: tokens.colors.error },
  invoice: { icon: '💰', label: 'Facture', color: tokens.colors.jungleEmerald },
  system: { icon: '⚙️', label: 'Système', color: tokens.colors.ancientStone },
  approval: { icon: '👍', label: 'Approbation', color: tokens.colors.sacredGold },
  alert: { icon: '🚨', label: 'Alerte', color: tokens.colors.error },
};

const PRIORITY_LEVELS = {
  critical: { label: 'Critique', color: tokens.colors.error, weight: 4 },
  high: { label: 'Haute', color: '#FF6B35', weight: 3 },
  medium: { label: 'Moyenne', color: tokens.colors.sacredGold, weight: 2 },
  low: { label: 'Basse', color: tokens.colors.ancientStone, weight: 1 },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

const generateMockNotifications = () => {
  const notifications = [
    {
      id: 'n1',
      type: 'mention',
      title: 'Marie Côté vous a mentionné',
      message: 'dans le projet "Rénovation Tremblay": "@Jo peux-tu valider les plans?"',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      read: false,
      priority: 'high',
      project: { id: 'p1', name: 'Rénovation Tremblay' },
      actor: { name: 'Marie Côté', avatar: 'MC', color: '#D94A6A' },
      actions: [
        { id: 'reply', label: 'Répondre', primary: true },
        { id: 'view', label: 'Voir' },
      ],
    },
    {
      id: 'n2',
      type: 'deadline',
      title: 'Échéance dans 2 heures',
      message: 'Tâche "Soumettre devis final" - Projet Lavoie',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      read: false,
      priority: 'critical',
      project: { id: 'p2', name: 'Projet Lavoie' },
      actions: [
        { id: 'complete', label: 'Marquer terminé', primary: true },
        { id: 'extend', label: 'Demander extension' },
      ],
    },
    {
      id: 'n3',
      type: 'approval',
      title: 'Approbation requise',
      message: 'Pierre Lavoie demande votre approbation pour une dépense de 4,500$',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      read: false,
      priority: 'high',
      project: { id: 'p2', name: 'Projet Lavoie' },
      actor: { name: 'Pierre Lavoie', avatar: 'PL', color: '#6AD94A' },
      actions: [
        { id: 'approve', label: 'Approuver', primary: true },
        { id: 'reject', label: 'Refuser' },
        { id: 'details', label: 'Détails' },
      ],
    },
    {
      id: 'n4',
      type: 'invoice',
      title: 'Facture payée',
      message: 'Client "Construction ABC" a payé la facture #INV-2024-089 (12,450$)',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      read: true,
      priority: 'medium',
      actions: [{ id: 'view', label: 'Voir facture' }],
    },
    {
      id: 'n5',
      type: 'task',
      title: 'Tâche assignée',
      message: 'Nouvelle tâche: "Inspecter fondations" assignée par Marie Côté',
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      read: true,
      priority: 'medium',
      project: { id: 'p1', name: 'Rénovation Tremblay' },
      actor: { name: 'Marie Côté', avatar: 'MC', color: '#D94A6A' },
      actions: [
        { id: 'accept', label: 'Accepter', primary: true },
        { id: 'delegate', label: 'Déléguer' },
      ],
    },
    {
      id: 'n6',
      type: 'project',
      title: 'Projet terminé!',
      message: 'Le projet "Extension Bouchard" a été marqué comme terminé',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      read: true,
      priority: 'low',
      project: { id: 'p3', name: 'Extension Bouchard' },
      actions: [{ id: 'view', label: 'Voir le rapport' }],
    },
    {
      id: 'n7',
      type: 'message',
      title: 'Nouveau message',
      message: 'Anne Bouchard: "Merci pour le travail exceptionnel sur le projet!"',
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      read: true,
      priority: 'low',
      actor: { name: 'Anne Bouchard', avatar: 'AB', color: '#D9A04A' },
      actions: [{ id: 'reply', label: 'Répondre' }],
    },
    {
      id: 'n8',
      type: 'system',
      title: 'Mise à jour système',
      message: 'CHE·NU v24 est maintenant disponible avec de nouvelles fonctionnalités',
      timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
      read: true,
      priority: 'low',
      actions: [{ id: 'changelog', label: 'Voir les nouveautés' }],
    },
    {
      id: 'n9',
      type: 'alert',
      title: 'Alerte météo',
      message: 'Prévision de pluie forte demain - Vérifiez la protection des chantiers',
      timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
      read: false,
      priority: 'medium',
      actions: [{ id: 'dismiss', label: 'Compris' }],
    },
    {
      id: 'n10',
      type: 'comment',
      title: 'Nouveau commentaire',
      message: 'Sur le document "Plans_v3.pdf": "Les dimensions de la cuisine semblent incorrectes"',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      read: false,
      priority: 'medium',
      project: { id: 'p1', name: 'Rénovation Tremblay' },
      actor: { name: 'Jean Tremblay', avatar: 'JT', color: '#4A90D9' },
      actions: [
        { id: 'reply', label: 'Répondre', primary: true },
        { id: 'resolve', label: 'Résoudre' },
      ],
    },
  ];
  
  return notifications;
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

const formatTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  
  if (seconds < 60) return 'À l\'instant';
  if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
  if (seconds < 172800) return 'Hier';
  return `Il y a ${Math.floor(seconds / 86400)} jours`;
};

const groupNotificationsByDate = (notifications) => {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);
  
  notifications.forEach(n => {
    const date = new Date(n.timestamp);
    if (date >= today) groups.today.push(n);
    else if (date >= yesterday) groups.yesterday.push(n);
    else if (date >= weekAgo) groups.thisWeek.push(n);
    else groups.older.push(n);
  });
  
  return groups;
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const NotificationBadge = ({ count }) => {
  if (!count) return null;
  return (
    <span style={{
      position: 'absolute',
      top: -4,
      right: -4,
      minWidth: 18,
      height: 18,
      padding: '0 5px',
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.error,
      color: '#fff',
      fontSize: 11,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

const NotificationItem = ({ notification, onAction, onMarkRead, onDismiss }) => {
  const [isHovered, setIsHovered] = useState(false);
  const type = NOTIFICATION_TYPES[notification.type];
  const priority = PRIORITY_LEVELS[notification.priority];
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        gap: tokens.spacing.md,
        padding: tokens.spacing.md,
        backgroundColor: notification.read ? 'transparent' : tokens.colors.bg.hover,
        borderLeft: `3px solid ${notification.read ? 'transparent' : type.color}`,
        borderBottom: `1px solid ${tokens.colors.border}`,
        transition: tokens.transitions.fast,
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Icon / Avatar */}
      <div style={{
        width: 44,
        height: 44,
        borderRadius: tokens.radius.lg,
        backgroundColor: notification.actor ? notification.actor.color : `${type.color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: notification.actor ? 14 : 18,
        fontWeight: 600,
        color: notification.actor ? '#fff' : type.color,
        flexShrink: 0,
      }}>
        {notification.actor ? notification.actor.avatar : type.icon}
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: tokens.spacing.sm, marginBottom: tokens.spacing.xs }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, flexWrap: 'wrap' }}>
            <span style={{ 
              fontWeight: notification.read ? 500 : 600, 
              color: tokens.colors.text.primary, 
              fontSize: 14,
            }}>
              {notification.title}
            </span>
            {notification.priority === 'critical' && (
              <span style={{
                padding: '2px 6px',
                borderRadius: tokens.radius.sm,
                backgroundColor: `${priority.color}20`,
                color: priority.color,
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
              }}>
                {priority.label}
              </span>
            )}
          </div>
          <span style={{ 
            fontSize: 11, 
            color: tokens.colors.text.muted,
            whiteSpace: 'nowrap',
          }}>
            {formatTimeAgo(notification.timestamp)}
          </span>
        </div>
        
        {/* Message */}
        <p style={{ 
          margin: 0, 
          marginBottom: tokens.spacing.sm,
          fontSize: 13, 
          color: tokens.colors.text.secondary,
          lineHeight: 1.5,
        }}>
          {notification.message}
        </p>
        
        {/* Project Tag */}
        {notification.project && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: tokens.spacing.xs,
            padding: '3px 8px',
            backgroundColor: tokens.colors.bg.tertiary,
            borderRadius: tokens.radius.sm,
            fontSize: 11,
            color: tokens.colors.text.secondary,
            marginBottom: tokens.spacing.sm,
          }}>
            📁 {notification.project.name}
          </div>
        )}
        
        {/* Actions */}
        {notification.actions && notification.actions.length > 0 && (
          <div style={{ display: 'flex', gap: tokens.spacing.sm, marginTop: tokens.spacing.sm }}>
            {notification.actions.map(action => (
              <button
                key={action.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(notification.id, action.id);
                }}
                style={{
                  padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
                  backgroundColor: action.primary ? tokens.colors.sacredGold : tokens.colors.bg.tertiary,
                  color: action.primary ? tokens.colors.darkSlate : tokens.colors.text.secondary,
                  border: action.primary ? 'none' : `1px solid ${tokens.colors.border}`,
                  borderRadius: tokens.radius.md,
                  fontSize: 12,
                  fontWeight: action.primary ? 600 : 400,
                  cursor: 'pointer',
                  transition: tokens.transitions.fast,
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Quick Actions (on hover) */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: tokens.spacing.sm,
          right: tokens.spacing.sm,
          display: 'flex',
          gap: tokens.spacing.xs,
        }}>
          {!notification.read && (
            <button
              onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id); }}
              title="Marquer comme lu"
              style={{
                width: 28,
                height: 28,
                borderRadius: tokens.radius.md,
                backgroundColor: tokens.colors.bg.tertiary,
                border: 'none',
                color: tokens.colors.text.muted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}
            >
              ✓
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(notification.id); }}
            title="Supprimer"
            style={{
              width: 28,
              height: 28,
              borderRadius: tokens.radius.md,
              backgroundColor: tokens.colors.bg.tertiary,
              border: 'none',
              color: tokens.colors.text.muted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
            }}
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Unread Indicator */}
      {!notification.read && (
        <div style={{
          position: 'absolute',
          left: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 8,
          height: 8,
          borderRadius: tokens.radius.full,
          backgroundColor: type.color,
        }} />
      )}
    </div>
  );
};

const NotificationGroup = ({ title, notifications, ...props }) => {
  if (notifications.length === 0) return null;
  
  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <div style={{
        padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
        backgroundColor: tokens.colors.bg.tertiary,
        fontSize: 12,
        fontWeight: 600,
        color: tokens.colors.text.muted,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {title}
      </div>
      {notifications.map(n => (
        <NotificationItem key={n.id} notification={n} {...props} />
      ))}
    </div>
  );
};

const FilterChip = ({ label, active, count, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
      backgroundColor: active ? tokens.colors.sacredGold : tokens.colors.bg.tertiary,
      color: active ? tokens.colors.darkSlate : tokens.colors.text.secondary,
      border: `1px solid ${active ? tokens.colors.sacredGold : tokens.colors.border}`,
      borderRadius: tokens.radius.full,
      fontSize: 12,
      fontWeight: active ? 600 : 400,
      cursor: 'pointer',
      transition: tokens.transitions.fast,
      whiteSpace: 'nowrap',
    }}
  >
    {label}
    {count > 0 && (
      <span style={{
        minWidth: 18,
        height: 18,
        padding: '0 5px',
        borderRadius: tokens.radius.full,
        backgroundColor: active ? 'rgba(0,0,0,0.2)' : tokens.colors.bg.secondary,
        fontSize: 10,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {count}
      </span>
    )}
  </button>
);

const EmptyState = ({ filter }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xl * 2,
    color: tokens.colors.text.muted,
  }}>
    <div style={{ fontSize: 48, marginBottom: tokens.spacing.md, opacity: 0.5 }}>🔔</div>
    <div style={{ fontSize: 16, fontWeight: 500, color: tokens.colors.text.secondary, marginBottom: tokens.spacing.xs }}>
      {filter === 'all' ? 'Aucune notification' : 'Aucune notification dans cette catégorie'}
    </div>
    <div style={{ fontSize: 13 }}>
      Vous êtes à jour! 🎉
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const NotificationsCenter = ({ isOpen = true, onClose }) => {
  const [notifications, setNotifications] = useState(generateMockNotifications);
  const [filter, setFilter] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [dndEnabled, setDndEnabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Counts
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  );
  
  const countsByType = useMemo(() => {
    const counts = {};
    Object.keys(NOTIFICATION_TYPES).forEach(type => {
      counts[type] = notifications.filter(n => n.type === type && !n.read).length;
    });
    return counts;
  }, [notifications]);
  
  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];
    
    if (filter !== 'all') {
      filtered = filtered.filter(n => n.type === filter);
    }
    
    if (showUnreadOnly) {
      filtered = filtered.filter(n => !n.read);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(term) ||
        n.message.toLowerCase().includes(term) ||
        n.project?.name.toLowerCase().includes(term)
      );
    }
    
    // Sort by priority weight then timestamp
    filtered.sort((a, b) => {
      if (!a.read && b.read) return -1;
      if (a.read && !b.read) return 1;
      const priorityDiff = PRIORITY_LEVELS[b.priority].weight - PRIORITY_LEVELS[a.priority].weight;
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    return filtered;
  }, [notifications, filter, showUnreadOnly, searchTerm]);
  
  const groupedNotifications = useMemo(() => 
    groupNotificationsByDate(filteredNotifications),
    [filteredNotifications]
  );
  
  // Handlers
  const handleMarkRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);
  
  const handleMarkAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);
  
  const handleDismiss = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  const handleAction = useCallback((notificationId, actionId) => {
    console.log('Action:', actionId, 'on notification:', notificationId);
    // Would trigger actual action here
    handleMarkRead(notificationId);
  }, [handleMarkRead]);
  
  // Simulate real-time notification
  useEffect(() => {
    if (dndEnabled) return;
    
    const interval = setInterval(() => {
      // 10% chance of new notification every 30 seconds
      if (Math.random() < 0.1) {
        const newNotification = {
          id: `n-${Date.now()}`,
          type: ['task', 'message', 'mention', 'comment'][Math.floor(Math.random() * 4)],
          title: 'Nouvelle activité',
          message: 'Quelque chose vient de se passer sur votre projet',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium',
          actions: [{ id: 'view', label: 'Voir' }],
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dndEnabled]);
  
  if (!isOpen) return null;
  
  return (
    <div style={{
      width: 420,
      height: '100vh',
      backgroundColor: tokens.colors.bg.secondary,
      borderLeft: `1px solid ${tokens.colors.border}`,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: tokens.fonts.body,
    }}>
      {/* Header */}
      <div style={{
        padding: tokens.spacing.md,
        borderBottom: `1px solid ${tokens.colors.border}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: tokens.spacing.md,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: tokens.colors.text.primary }}>
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span style={{
                padding: '2px 8px',
                borderRadius: tokens.radius.full,
                backgroundColor: tokens.colors.sacredGold,
                color: tokens.colors.darkSlate,
                fontSize: 12,
                fontWeight: 600,
              }}>
                {unreadCount} nouvelles
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: tokens.spacing.xs }}>
            <button
              onClick={() => setDndEnabled(!dndEnabled)}
              title={dndEnabled ? 'Désactiver Ne pas déranger' : 'Activer Ne pas déranger'}
              style={{
                width: 36,
                height: 36,
                borderRadius: tokens.radius.md,
                backgroundColor: dndEnabled ? tokens.colors.error : tokens.colors.bg.tertiary,
                border: 'none',
                color: dndEnabled ? '#fff' : tokens.colors.text.muted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              {dndEnabled ? '🔕' : '🔔'}
            </button>
            <button
              onClick={handleMarkAllRead}
              title="Tout marquer comme lu"
              style={{
                width: 36,
                height: 36,
                borderRadius: tokens.radius.md,
                backgroundColor: tokens.colors.bg.tertiary,
                border: 'none',
                color: tokens.colors.text.muted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              ✓✓
            </button>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: tokens.radius.md,
                  backgroundColor: tokens.colors.bg.tertiary,
                  border: 'none',
                  color: tokens.colors.text.muted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: tokens.spacing.md }}>
          <span style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: tokens.colors.text.muted,
            fontSize: 14,
          }}>
            🔍
          </span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher..."
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              backgroundColor: tokens.colors.bg.tertiary,
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radius.lg,
              color: tokens.colors.text.primary,
              fontSize: 13,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        
        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: tokens.spacing.xs,
          overflowX: 'auto',
          paddingBottom: tokens.spacing.xs,
        }}>
          <FilterChip
            label="Toutes"
            active={filter === 'all'}
            count={unreadCount}
            onClick={() => setFilter('all')}
          />
          {Object.entries(NOTIFICATION_TYPES).slice(0, 5).map(([key, type]) => (
            <FilterChip
              key={key}
              label={`${type.icon} ${type.label}`}
              active={filter === key}
              count={countsByType[key]}
              onClick={() => setFilter(key)}
            />
          ))}
        </div>
        
        {/* Unread Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.sm,
          marginTop: tokens.spacing.md,
        }}>
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            style={{
              width: 40,
              height: 22,
              borderRadius: tokens.radius.full,
              backgroundColor: showUnreadOnly ? tokens.colors.sacredGold : tokens.colors.bg.tertiary,
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: tokens.transitions.fast,
            }}
          >
            <div style={{
              width: 18,
              height: 18,
              borderRadius: tokens.radius.full,
              backgroundColor: '#fff',
              position: 'absolute',
              top: 2,
              left: showUnreadOnly ? 20 : 2,
              transition: tokens.transitions.fast,
            }} />
          </button>
          <span style={{ fontSize: 12, color: tokens.colors.text.secondary }}>
            Non lues uniquement
          </span>
        </div>
      </div>
      
      {/* DND Banner */}
      {dndEnabled && (
        <div style={{
          padding: tokens.spacing.sm,
          backgroundColor: `${tokens.colors.error}20`,
          borderBottom: `1px solid ${tokens.colors.error}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: tokens.spacing.sm,
          fontSize: 12,
          color: tokens.colors.error,
        }}>
          🔕 Mode Ne pas déranger activé
          <button
            onClick={() => setDndEnabled(false)}
            style={{
              padding: '2px 8px',
              backgroundColor: tokens.colors.error,
              color: '#fff',
              border: 'none',
              borderRadius: tokens.radius.sm,
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            Désactiver
          </button>
        </div>
      )}
      
      {/* Notifications List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredNotifications.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <>
            <NotificationGroup
              title="Aujourd'hui"
              notifications={groupedNotifications.today}
              onAction={handleAction}
              onMarkRead={handleMarkRead}
              onDismiss={handleDismiss}
            />
            <NotificationGroup
              title="Hier"
              notifications={groupedNotifications.yesterday}
              onAction={handleAction}
              onMarkRead={handleMarkRead}
              onDismiss={handleDismiss}
            />
            <NotificationGroup
              title="Cette semaine"
              notifications={groupedNotifications.thisWeek}
              onAction={handleAction}
              onMarkRead={handleMarkRead}
              onDismiss={handleDismiss}
            />
            <NotificationGroup
              title="Plus ancien"
              notifications={groupedNotifications.older}
              onAction={handleAction}
              onMarkRead={handleMarkRead}
              onDismiss={handleDismiss}
            />
          </>
        )}
      </div>
      
      {/* Footer */}
      <div style={{
        padding: tokens.spacing.md,
        borderTop: `1px solid ${tokens.colors.border}`,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <button style={{
          padding: `${tokens.spacing.sm}px ${tokens.spacing.lg}px`,
          backgroundColor: 'transparent',
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.md,
          color: tokens.colors.text.secondary,
          fontSize: 13,
          cursor: 'pointer',
        }}>
          ⚙️ Paramètres de notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationsCenter;
