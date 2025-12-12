/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU V25 - ZUSTAND STORES                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH STORE
// ═══════════════════════════════════════════════════════════════════════════════

interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
        setLoading: (isLoading) => set({ isLoading }),
        logout: () => {
          localStorage.removeItem('chenu_token');
          localStorage.removeItem('chenu_refresh_token');
          set({ user: null, isAuthenticated: false });
        },
      }),
      { name: 'chenu-auth' }
    )
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// SPACE STORE
// ═══════════════════════════════════════════════════════════════════════════════

interface Space {
  id: string;
  name: string;
  type: string;
  icon: string;
  color: string;
}

interface SpaceState {
  currentSpace: string;
  spaces: Space[];
  setCurrentSpace: (spaceId: string) => void;
  setSpaces: (spaces: Space[]) => void;
}

export const useSpaceStore = create<SpaceState>()(
  devtools(
    persist(
      (set) => ({
        currentSpace: 'maison',
        spaces: [
          { id: 'maison', name: 'Maison', type: 'maison', icon: '🏠', color: '#4ade80' },
          { id: 'entreprise', name: 'Entreprise', type: 'entreprise', icon: '🏢', color: '#3b82f6' },
          { id: 'creative', name: 'Creative Studio', type: 'creative_studio', icon: '🎨', color: '#f59e0b' },
          { id: 'gouvernement', name: 'Gouvernement', type: 'gouvernement', icon: '🏛️', color: '#8b5cf6' },
          { id: 'immobilier', name: 'Immobilier', type: 'immobilier', icon: '🏘️', color: '#ec4899' },
          { id: 'associations', name: 'Associations', type: 'association', icon: '🤝', color: '#06b6d4' },
        ],
        setCurrentSpace: (currentSpace) => set({ currentSpace }),
        setSpaces: (spaces) => set({ spaces }),
      }),
      { name: 'chenu-space' }
    )
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// UI STORE
// ═══════════════════════════════════════════════════════════════════════════════

type Theme = 'dark' | 'light' | 'pierre' | 'jungle' | 'medieval';

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  novaPanelOpen: boolean;
  spotlightOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  toggleNovaPanel: () => void;
  setSpotlightOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'dark',
        sidebarCollapsed: false,
        novaPanelOpen: false,
        spotlightOpen: false,
        setTheme: (theme) => set({ theme }),
        toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        toggleNovaPanel: () => set((state) => ({ novaPanelOpen: !state.novaPanelOpen })),
        setSpotlightOpen: (spotlightOpen) => set({ spotlightOpen }),
      }),
      { name: 'chenu-ui' }
    )
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS STORE
// ═══════════════════════════════════════════════════════════════════════════════

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools((set) => ({
    notifications: [],
    unreadCount: 0,
    addNotification: (notification) =>
      set((state) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif_${Date.now()}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        return {
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        };
      }),
    markAsRead: (id) =>
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
    markAllAsRead: () =>
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      })),
    removeNotification: (id) =>
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: state.notifications.find((n) => n.id === id && !n.isRead)
          ? state.unreadCount - 1
          : state.unreadCount,
      })),
    clearAll: () => set({ notifications: [], unreadCount: 0 }),
  }))
);

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA STORE
// ═══════════════════════════════════════════════════════════════════════════════

interface NovaMessage {
  id: string;
  role: 'user' | 'nova';
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
}

interface NovaState {
  messages: NovaMessage[];
  isLoading: boolean;
  isConnected: boolean;
  addMessage: (message: Omit<NovaMessage, 'id' | 'timestamp'>) => void;
  updateMessageStatus: (id: string, status: NovaMessage['status']) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setConnected: (connected: boolean) => void;
}

export const useNovaStore = create<NovaState>()(
  devtools((set) => ({
    messages: [],
    isLoading: false,
    isConnected: false,
    addMessage: (message) =>
      set((state) => ({
        messages: [
          ...state.messages,
          {
            ...message,
            id: `msg_${Date.now()}`,
            timestamp: new Date().toISOString(),
          },
        ],
      })),
    updateMessageStatus: (id, status) =>
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === id ? { ...m, status } : m
        ),
      })),
    clearMessages: () => set({ messages: [] }),
    setLoading: (isLoading) => set({ isLoading }),
    setConnected: (isConnected) => set({ isConnected }),
  }))
);

// ═══════════════════════════════════════════════════════════════════════════════
// PROJETS STORE
// ═══════════════════════════════════════════════════════════════════════════════

interface Projet {
  id: string;
  name: string;
  code?: string;
  status: string;
  progress: number;
  budget?: number;
  spent?: number;
}

interface ProjetsState {
  projets: Projet[];
  currentProjet: Projet | null;
  isLoading: boolean;
  setProjets: (projets: Projet[]) => void;
  setCurrentProjet: (projet: Projet | null) => void;
  updateProjet: (id: string, updates: Partial<Projet>) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjetsStore = create<ProjetsState>()(
  devtools((set) => ({
    projets: [],
    currentProjet: null,
    isLoading: false,
    setProjets: (projets) => set({ projets }),
    setCurrentProjet: (currentProjet) => set({ currentProjet }),
    updateProjet: (id, updates) =>
      set((state) => ({
        projets: state.projets.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
        currentProjet:
          state.currentProjet?.id === id
            ? { ...state.currentProjet, ...updates }
            : state.currentProjet,
      })),
    setLoading: (isLoading) => set({ isLoading }),
  }))
);
