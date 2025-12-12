/**
 * ROADY Unified - Notification System
 * ═══════════════════════════════════════════════════════════════════════════════
 * Système de notifications temps réel avec WebSocket.
 * 
 * @author ROADY Team
 * @version 8.0 Unified
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  source?: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoClose?: boolean;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
      autoClose: notif.autoClose ?? true,
      duration: notif.duration ?? 5000,
    };

    setNotifications(prev => [newNotif, ...prev].slice(0, 50)); // Keep max 50

    // Auto-close
    if (newNotif.autoClose) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
      }, newNotif.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // WebSocket connection for real-time notifications
  useEffect(() => {
    const connectWebSocket = () => {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/notifications';
      
      try {
        wsRef.current = new WebSocket(wsUrl);
        
        wsRef.current.onopen = () => {
          console.log('🔔 Notifications WebSocket connected');
        };
        
        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            addNotification({
              type: data.type || 'info',
              title: data.title,
              message: data.message,
              source: data.source,
            });
          } catch (e) {
            console.error('Failed to parse notification:', e);
          }
        };
        
        wsRef.current.onclose = () => {
          console.log('🔔 Notifications WebSocket disconnected');
          // Reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };
        
        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    // connectWebSocket(); // Uncomment in production

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [addNotification]);

  // Simulate some notifications for demo
  useEffect(() => {
    const demoNotifications = [
      { type: 'success' as const, title: 'Sync terminée', message: 'Shopify synchronisé avec succès', source: 'Shopify' },
      { type: 'warning' as const, title: 'Stock faible', message: '5 produits en rupture imminente', source: 'Inventory' },
      { type: 'info' as const, title: 'Nouveau deal', message: 'Projet Tour Montréal ajouté au pipeline', source: 'HubSpot' },
    ];

    // Add demo notifications after delay
    demoNotifications.forEach((notif, i) => {
      setTimeout(() => {
        addNotification({ ...notif, autoClose: false });
      }, 1000 + i * 2000);
    });
  }, [addNotification]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TOAST COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ToastIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  const icons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };
  return <span className="text-lg">{icons[type]}</span>;
};

export const Toast: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  const borderColors = {
    info: 'border-l-[#7da8b8]',
    success: 'border-l-[#7db87d]',
    warning: 'border-l-[#d4a84b]',
    error: 'border-l-[#c47d6d]',
  };

  return (
    <div 
      className={`bg-[#2f352f] border border-[#3a403a] border-l-4 ${borderColors[notification.type]} 
                  rounded-lg p-3 shadow-lg max-w-sm animate-fade-in-natural flex gap-3`}
    >
      <ToastIcon type={notification.type} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#e8e4df]">{notification.title}</p>
        {notification.message && (
          <p className="text-xs text-[#b5ada3] mt-0.5 truncate">{notification.message}</p>
        )}
        {notification.source && (
          <p className="text-[10px] text-[#8a8378] mt-1">via {notification.source}</p>
        )}
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className="text-xs text-[#9caf88] hover:text-[#b5c9a3] mt-2"
          >
            {notification.action.label} →
          </button>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-[#8a8378] hover:text-[#e8e4df] text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TOAST CONTAINER
// ═══════════════════════════════════════════════════════════════════════════════

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();
  
  // Only show unread, auto-close notifications as toasts
  const toasts = notifications.filter(n => !n.read && n.autoClose !== false).slice(0, 3);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(notif => (
        <Toast
          key={notif.id}
          notification={notif}
          onClose={() => removeNotification(notif.id)}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION CENTER (Dropdown)
// ═══════════════════════════════════════════════════════════════════════════════

export const NotificationCenter: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  if (!isOpen) return null;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    
    return date.toLocaleDateString('fr-CA');
  };

  const typeColors = {
    info: 'bg-[#7da8b8]/20 text-[#7da8b8]',
    success: 'bg-[#7db87d]/20 text-[#7db87d]',
    warning: 'bg-[#d4a84b]/20 text-[#d4a84b]',
    error: 'bg-[#c47d6d]/20 text-[#c47d6d]',
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Panel */}
      <div className="absolute right-0 top-full mt-2 w-80 bg-[#252a25] border border-[#3a403a] 
                      rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-natural">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#3a403a] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#e8e4df]">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-[#8a8378]">{unreadCount} non lues</p>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#9caf88] hover:text-[#b5c9a3]"
              >
                Tout marquer lu
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-[#8a8378]">
              <span className="text-3xl block mb-2">🔔</span>
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`px-4 py-3 border-b border-[#3a403a]/50 hover:bg-[#2d332d] 
                           cursor-pointer transition-colors ${!notif.read ? 'bg-[#2d332d]/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`px-2 py-1 rounded-md text-xs ${typeColors[notif.type]}`}>
                    {notif.type === 'info' && '💡'}
                    {notif.type === 'success' && '✅'}
                    {notif.type === 'warning' && '⚠️'}
                    {notif.type === 'error' && '❌'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.read ? 'text-[#e8e4df] font-medium' : 'text-[#b5ada3]'}`}>
                      {notif.title}
                    </p>
                    {notif.message && (
                      <p className="text-xs text-[#8a8378] mt-0.5 truncate">{notif.message}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[#8a8378]">{formatTime(notif.timestamp)}</span>
                      {notif.source && (
                        <>
                          <span className="text-[10px] text-[#5a625a]">•</span>
                          <span className="text-[10px] text-[#8a8378]">{notif.source}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#9caf88] flex-shrink-0 mt-1.5" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-[#3a403a] bg-[#232823]">
            <button
              onClick={clearAll}
              className="text-xs text-[#c47d6d] hover:text-[#d49080] w-full text-center"
            >
              Tout effacer
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION BELL (Trigger)
// ═══════════════════════════════════════════════════════════════════════════════

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-[#2d332d] transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#c47d6d] rounded-full 
                         text-[10px] font-bold flex items-center justify-center text-white
                         animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationCenter isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  NotificationProvider,
  useNotifications,
  Toast,
  ToastContainer,
  NotificationCenter,
  NotificationBell,
};
