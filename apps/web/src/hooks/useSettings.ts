/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU - useSettings Hook                              ║
 * ║                                                                              ║
 * ║  Complete settings management with API sync and local storage backup        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  company: string;
  role: string;
  rbqLicense: string;
  ccqCard: string;
  cnesstNumber: string;
}

export interface AppearanceSettings {
  theme: 'cosmic' | 'ancient' | 'futurist' | 'realistic' | 'auto';
  density: 'compact' | 'balanced' | 'comfortable';
  fontSize: 'small' | 'medium' | 'large';
  colorMode: 'dark' | 'light' | 'system';
  animations: boolean;
  reducedMotion: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  desktop: boolean;
  projectUpdates: boolean;
  taskReminders: boolean;
  teamMessages: boolean;
  systemAlerts: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'app' | 'sms' | 'email';
  sessionTimeout: number;
  loginNotifications: boolean;
  activityLogging: boolean;
  dataSharing: boolean;
  analyticsEnabled: boolean;
}

export interface NovaSettings {
  enabled: boolean;
  voiceEnabled: boolean;
  autoSuggestions: boolean;
  contextAwareness: boolean;
  learningEnabled: boolean;
  personalityStyle: 'professional' | 'friendly' | 'concise';
  language: 'fr' | 'en' | 'auto';
  responseSpeed: 'fast' | 'balanced' | 'detailed';
}

export interface WorkspaceSettings {
  defaultSphere: string;
  sidebarCollapsed: boolean;
  showQuickActions: boolean;
  dashboardLayout: 'grid' | 'list' | 'kanban';
  calendarFirstDay: 0 | 1;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  timezone: string;
  currency: string;
}

export interface IntegrationSettings {
  googleCalendar: boolean;
  microsoftOutlook: boolean;
  slack: boolean;
  quickbooks: boolean;
  dropbox: boolean;
  googleDrive: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  textToSpeech: boolean;
  autoPlayMedia: boolean;
}

export interface UserSettings {
  profile: ProfileSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  nova: NovaSettings;
  workspace: WorkspaceSettings;
  integrations: IntegrationSettings;
  accessibility: AccessibilitySettings;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════════

export const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    company: '',
    role: '',
    rbqLicense: '',
    ccqCard: '',
    cnesstNumber: '',
  },
  appearance: {
    theme: 'cosmic',
    density: 'balanced',
    fontSize: 'medium',
    colorMode: 'dark',
    animations: true,
    reducedMotion: false,
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    desktop: true,
    projectUpdates: true,
    taskReminders: true,
    teamMessages: true,
    systemAlerts: true,
    marketingEmails: false,
    weeklyDigest: true,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  },
  security: {
    twoFactorEnabled: false,
    twoFactorMethod: 'app',
    sessionTimeout: 60,
    loginNotifications: true,
    activityLogging: true,
    dataSharing: false,
    analyticsEnabled: true,
  },
  nova: {
    enabled: true,
    voiceEnabled: false,
    autoSuggestions: true,
    contextAwareness: true,
    learningEnabled: true,
    personalityStyle: 'professional',
    language: 'fr',
    responseSpeed: 'balanced',
  },
  workspace: {
    defaultSphere: 'entreprise',
    sidebarCollapsed: false,
    showQuickActions: true,
    dashboardLayout: 'grid',
    calendarFirstDay: 1,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    timezone: 'America/Montreal',
    currency: 'CAD',
  },
  integrations: {
    googleCalendar: false,
    microsoftOutlook: false,
    slack: false,
    quickbooks: false,
    dropbox: false,
    googleDrive: false,
  },
  accessibility: {
    highContrast: false,
    screenReaderOptimized: false,
    keyboardNavigation: true,
    focusIndicators: true,
    textToSpeech: false,
    autoPlayMedia: true,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'chenu_user_settings';
const API_BASE = '/api/preferences';

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

interface UseSettingsReturn {
  settings: UserSettings;
  isLoading: boolean;
  error: string | null;
  hasChanges: boolean;
  
  // Update functions
  updateProfile: (updates: Partial<ProfileSettings>) => void;
  updateAppearance: (updates: Partial<AppearanceSettings>) => void;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
  updateSecurity: (updates: Partial<SecuritySettings>) => void;
  updateNova: (updates: Partial<NovaSettings>) => void;
  updateWorkspace: (updates: Partial<WorkspaceSettings>) => void;
  updateIntegrations: (updates: Partial<IntegrationSettings>) => void;
  updateAccessibility: (updates: Partial<AccessibilitySettings>) => void;
  
  // Actions
  saveSettings: () => Promise<boolean>;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (json: string) => boolean;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Try API first
        const response = await fetch(API_BASE);
        if (response.ok) {
          const data = await response.json();
          setSettings({ ...DEFAULT_SETTINGS, ...data });
        } else {
          // Fallback to localStorage
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
          }
        }
      } catch {
        // Fallback to localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
          } catch {
            // Use defaults
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  // Generic update function
  const updateCategory = useCallback(<K extends keyof UserSettings>(
    category: K,
    updates: Partial<UserSettings[K]>
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...updates,
      },
    }));
    setHasChanges(true);
  }, []);

  // Category-specific update functions
  const updateProfile = useCallback((updates: Partial<ProfileSettings>) => {
    updateCategory('profile', updates);
  }, [updateCategory]);

  const updateAppearance = useCallback((updates: Partial<AppearanceSettings>) => {
    updateCategory('appearance', updates);
    // Apply theme changes immediately
    if (updates.theme) {
      document.documentElement.setAttribute('data-theme', updates.theme);
    }
    if (updates.colorMode) {
      document.documentElement.setAttribute('data-color-mode', updates.colorMode);
    }
  }, [updateCategory]);

  const updateNotifications = useCallback((updates: Partial<NotificationSettings>) => {
    updateCategory('notifications', updates);
  }, [updateCategory]);

  const updateSecurity = useCallback((updates: Partial<SecuritySettings>) => {
    updateCategory('security', updates);
  }, [updateCategory]);

  const updateNova = useCallback((updates: Partial<NovaSettings>) => {
    updateCategory('nova', updates);
  }, [updateCategory]);

  const updateWorkspace = useCallback((updates: Partial<WorkspaceSettings>) => {
    updateCategory('workspace', updates);
  }, [updateCategory]);

  const updateIntegrations = useCallback((updates: Partial<IntegrationSettings>) => {
    updateCategory('integrations', updates);
  }, [updateCategory]);

  const updateAccessibility = useCallback((updates: Partial<AccessibilitySettings>) => {
    updateCategory('accessibility', updates);
    // Apply accessibility changes immediately
    if (updates.highContrast !== undefined) {
      document.documentElement.classList.toggle('high-contrast', updates.highContrast);
    }
    if (updates.reducedMotion !== undefined) {
      document.documentElement.classList.toggle('reduced-motion', updates.reducedMotion);
    }
  }, [updateCategory]);

  // Save to API and localStorage
  const saveSettings = useCallback(async (): Promise<boolean> => {
    setError(null);
    
    try {
      // Save to localStorage first (backup)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      
      // Try API save
      const response = await fetch(API_BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error('API save failed');
      }
      
      setHasChanges(false);
      return true;
    } catch (e) {
      // localStorage save still succeeded
      setHasChanges(false);
      return true;
    }
  }, [settings]);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
  }, []);

  // Export settings as JSON
  const exportSettings = useCallback((): string => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  // Import settings from JSON
  const importSettings = useCallback((json: string): boolean => {
    try {
      const imported = JSON.parse(json);
      setSettings({ ...DEFAULT_SETTINGS, ...imported });
      setHasChanges(true);
      return true;
    } catch {
      setError('Invalid settings format');
      return false;
    }
  }, []);

  return {
    settings,
    isLoading,
    error,
    hasChanges,
    updateProfile,
    updateAppearance,
    updateNotifications,
    updateSecurity,
    updateNova,
    updateWorkspace,
    updateIntegrations,
    updateAccessibility,
    saveSettings,
    resetSettings,
    exportSettings,
    importSettings,
  };
}

export default useSettings;
