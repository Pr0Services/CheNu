/* =====================================================
   CHE·NU — useNotifications Hook
   
   React hook for managing XR notifications.
   ===================================================== */

import { useState, useCallback, useEffect, useRef } from 'react';

import {
  XRNotification,
  NotificationType,
  NotificationPriority,
  NotificationPosition,
  NotificationAction,
  NotificationConfig,
  NotificationQueue,
  DEFAULT_NOTIFICATION_CONFIG,
  DEFAULT_QUEUE,
  createNotification,
} from './notification.types';

// ─────────────────────────────────────────────────────
// HOOK OPTIONS
// ─────────────────────────────────────────────────────

export interface UseNotificationsOptions {
  config?: Partial<NotificationConfig>;
  onNotificationShow?: (notification: XRNotification) => void;
  onNotificationDismiss?: (notification: XRNotification) => void;
  onNotificationAction?: (notification: XRNotification, actionId: string) => void;
}

// ─────────────────────────────────────────────────────
// HOOK RETURN
// ─────────────────────────────────────────────────────

export interface UseNotificationsReturn {
  // State
  notifications: XRNotification[];
  history: XRNotification[];
  unreadCount: number;
  
  // Actions
  show: (params: ShowNotificationParams) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearHistory: () => void;
  
  // Convenience methods
  info: (title: string, message?: string) => string;
  success: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  agent: (title: string, message?: string, agentId?: string) => string;
  decision: (title: string, message?: string, actions?: NotificationAction[]) => string;
  meeting: (title: string, message?: string) => string;
  
  // Config
  setConfig: (config: Partial<NotificationConfig>) => void;
  toggleDND: () => void;
  isDND: boolean;
}

export interface ShowNotificationParams {
  type?: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message?: string;
  icon?: string;
  duration?: number;
  position?: NotificationPosition;
  spatialPosition?: [number, number, number];
  dismissible?: boolean;
  actions?: NotificationAction[];
  sound?: boolean;
  haptic?: boolean;
  source?: string;
  data?: unknown;
}

// ─────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────

export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const {
    config: configOverride,
    onNotificationShow,
    onNotificationDismiss,
    onNotificationAction,
  } = options;

  // Config
  const [config, setConfigState] = useState<NotificationConfig>({
    ...DEFAULT_NOTIFICATION_CONFIG,
    ...configOverride,
  });

  // Queue
  const [queue, setQueue] = useState<NotificationQueue>(DEFAULT_QUEUE);

  // Timers
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Auto-dismiss effect
  useEffect(() => {
    queue.notifications.forEach(notification => {
      if (notification.duration > 0 && !timersRef.current.has(notification.id)) {
        const timer = setTimeout(() => {
          dismiss(notification.id);
        }, notification.duration);
        
        timersRef.current.set(notification.id, timer);
      }
    });

    // Cleanup old timers
    return () => {
      timersRef.current.forEach((timer, id) => {
        if (!queue.notifications.find(n => n.id === id)) {
          clearTimeout(timer);
          timersRef.current.delete(id);
        }
      });
    };
  }, [queue.notifications]);

  // Show notification
  const show = useCallback((params: ShowNotificationParams): string => {
    // Check DND
    if (config.dndEnabled) {
      const priority = params.priority || config.defaultPriority;
      if (priority !== 'urgent' || !config.dndAllowUrgent) {
        return '';
      }
    }

    // Create notification
    const notification = createNotification({
      type: params.type || 'info',
      priority: params.priority || config.defaultPriority,
      title: params.title,
      message: params.message,
      icon: params.icon,
      duration: params.duration ?? config.defaultDuration,
      position: params.position || config.defaultPosition,
      spatialPosition: params.spatialPosition,
      dismissible: params.dismissible ?? true,
      actions: params.actions,
      sound: params.sound !== false ? 'default' : 'none',
      haptic: params.haptic !== false ? {
        enabled: config.hapticEnabled,
        intensity: config.hapticIntensity,
        duration: 100,
      } : undefined,
      source: params.source,
      data: params.data,
    });

    // Add to queue
    setQueue(prev => {
      let notifications = [...prev.notifications, notification];
      
      // Limit visible
      if (notifications.length > config.maxVisible) {
        // Move oldest to history
        const overflow = notifications.slice(0, notifications.length - config.maxVisible);
        notifications = notifications.slice(-config.maxVisible);
        
        return {
          ...prev,
          notifications,
          history: [...prev.history, ...overflow].slice(-config.maxHistory),
        };
      }
      
      return { ...prev, notifications };
    });

    // Callback
    onNotificationShow?.(notification);

    // Play sound
    if (config.soundEnabled && params.sound !== false) {
      playNotificationSound(notification.type);
    }

    // Trigger haptic
    if (config.hapticEnabled && params.haptic !== false) {
      triggerHaptic(config.hapticIntensity);
    }

    return notification.id;
  }, [config, onNotificationShow]);

  // Dismiss notification
  const dismiss = useCallback((id: string) => {
    setQueue(prev => {
      const notification = prev.notifications.find(n => n.id === id);
      if (!notification) return prev;

      // Clear timer
      const timer = timersRef.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }

      // Move to history
      const dismissed = { ...notification, isDismissed: true };
      
      onNotificationDismiss?.(dismissed);

      return {
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== id),
        history: [...prev.history, dismissed].slice(-prev.maxHistory),
      };
    });
  }, [onNotificationDismiss]);

  // Dismiss all
  const dismissAll = useCallback(() => {
    setQueue(prev => {
      // Clear all timers
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();

      // Move all to history
      const dismissed = prev.notifications.map(n => ({ ...n, isDismissed: true }));

      return {
        ...prev,
        notifications: [],
        history: [...prev.history, ...dismissed].slice(-prev.maxHistory),
      };
    });
  }, []);

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    setQueue(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setQueue(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, isRead: true })),
    }));
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setQueue(prev => ({ ...prev, history: [] }));
  }, []);

  // Convenience methods
  const info = useCallback((title: string, message?: string) => 
    show({ type: 'info', title, message }), [show]);

  const success = useCallback((title: string, message?: string) => 
    show({ type: 'success', title, message }), [show]);

  const warning = useCallback((title: string, message?: string) => 
    show({ type: 'warning', title, message }), [show]);

  const error = useCallback((title: string, message?: string) => 
    show({ type: 'error', title, message, priority: 'high' }), [show]);

  const agent = useCallback((title: string, message?: string, agentId?: string) => 
    show({ type: 'agent', title, message, source: agentId }), [show]);

  const decision = useCallback((title: string, message?: string, actions?: NotificationAction[]) => 
    show({ type: 'decision', title, message, actions, duration: 0, priority: 'high' }), [show]);

  const meeting = useCallback((title: string, message?: string) => 
    show({ type: 'meeting', title, message }), [show]);

  // Config
  const setConfig = useCallback((newConfig: Partial<NotificationConfig>) => {
    setConfigState(prev => ({ ...prev, ...newConfig }));
  }, []);

  const toggleDND = useCallback(() => {
    setConfigState(prev => ({ ...prev, dndEnabled: !prev.dndEnabled }));
  }, []);

  // Computed
  const unreadCount = queue.notifications.filter(n => !n.isRead).length;

  return {
    notifications: queue.notifications,
    history: queue.history,
    unreadCount,
    show,
    dismiss,
    dismissAll,
    markAsRead,
    markAllAsRead,
    clearHistory,
    info,
    success,
    warning,
    error,
    agent,
    decision,
    meeting,
    setConfig,
    toggleDND,
    isDND: config.dndEnabled,
  };
}

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

function playNotificationSound(type: NotificationType) {
  // Would play actual sound
  console.log('[Notification] Sound:', type);
}

function triggerHaptic(intensity: number) {
  // Would trigger haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(Math.round(intensity * 100));
  }
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default useNotifications;
