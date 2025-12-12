/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU V25 - CUSTOM HOOKS                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// useSpace - Gestion des espaces CHE·NU
// ═══════════════════════════════════════════════════════════════════════════════

export interface Space {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'maison' | 'entreprise' | 'projet' | 'creative' | 'gouvernement' | 'immobilier' | 'association';
}

export function useSpace() {
  const [currentSpace, setCurrentSpace] = useState<string>('maison');
  const [spaces, setSpaces] = useState<Space[]>([
    { id: 'maison', name: 'Maison', icon: '🏠', color: '#4ade80', type: 'maison' },
    { id: 'bureau', name: 'Mon Bureau', icon: '🏢', color: '#3b82f6', type: 'entreprise' },
    { id: 'creative', name: 'Creative Studio', icon: '🎨', color: '#f59e0b', type: 'creative' },
  ]);

  const switchSpace = useCallback((spaceId: string) => {
    setCurrentSpace(spaceId);
    localStorage.setItem('chenu_current_space', spaceId);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('chenu_current_space');
    if (saved) setCurrentSpace(saved);
  }, []);

  return { currentSpace, spaces, switchSpace };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useTheme - Gestion des thèmes
// ═══════════════════════════════════════════════════════════════════════════════

export type ThemeMode = 'dark' | 'light' | 'system';
export type ThemeStyle = 'moderne' | 'pierre' | 'jungle' | 'medieval';

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [style, setStyle] = useState<ThemeStyle>('moderne');

  const toggleTheme = useCallback(() => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  return { theme: mode, style, toggleTheme, setThemeStyle: setStyle };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useAuth - Authentification
// ═══════════════════════════════════════════════════════════════════════════════

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      localStorage.setItem('chenu_token', data.access_token);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('chenu_token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return { user, isLoading, isAuthenticated, login, logout };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useKeyboardShortcuts
// ═══════════════════════════════════════════════════════════════════════════════

type ShortcutMap = Record<string, () => void>;

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = [
        e.metaKey || e.ctrlKey ? 'cmd' : '',
        e.shiftKey ? 'shift' : '',
        e.key.toLowerCase(),
      ].filter(Boolean).join('+');

      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// useDebounce
// ═══════════════════════════════════════════════════════════════════════════════

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// ═══════════════════════════════════════════════════════════════════════════════
// useWebSocket
// ═══════════════════════════════════════════════════════════════════════════════

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('chenu_token');
    wsRef.current = new WebSocket(`${url}?token=${token}`);
    wsRef.current.onopen = () => setIsConnected(true);
    wsRef.current.onclose = () => setIsConnected(false);
    wsRef.current.onmessage = (e) => setLastMessage(JSON.parse(e.data));
    return () => wsRef.current?.close();
  }, [url]);

  const send = useCallback((data: any) => {
    wsRef.current?.send(JSON.stringify(data));
  }, []);

  return { isConnected, lastMessage, send };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useNova
// ═══════════════════════════════════════════════════════════════════════════════

export function useNova() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsLoading(true);
    try {
      const res = await fetch('/api/nova/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, sendMessage, clearHistory: () => setMessages([]) };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useMediaQuery
// ═══════════════════════════════════════════════════════════════════════════════

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export const useIsMobile = () => useMediaQuery('(max-width: 768px)');

// ═══════════════════════════════════════════════════════════════════════════════
// useSettings - User Settings Management
// ═══════════════════════════════════════════════════════════════════════════════

export * from './useSettings';
export { default as useSettings } from './useSettings';
