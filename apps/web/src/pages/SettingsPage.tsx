/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU - PAGE PARAMÈTRES COMPLÈTE                      ║
 * ║                                                                              ║
 * ║  Toutes les options de personnalisation et contrôle utilisateur             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface UserSettings {
  // Profile
  profile: {
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
  };
  
  // Appearance
  appearance: {
    theme: 'cosmic' | 'ancient' | 'futurist' | 'realistic' | 'auto';
    density: 'compact' | 'balanced' | 'comfortable';
    fontSize: 'small' | 'medium' | 'large';
    colorMode: 'dark' | 'light' | 'system';
    animations: boolean;
    reducedMotion: boolean;
  };
  
  // Notifications
  notifications: {
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
  };
  
  // Privacy & Security
  security: {
    twoFactorEnabled: boolean;
    twoFactorMethod: 'app' | 'sms' | 'email';
    sessionTimeout: number; // minutes
    loginNotifications: boolean;
    activityLogging: boolean;
    dataSharing: boolean;
    analyticsEnabled: boolean;
  };
  
  // Nova AI
  nova: {
    enabled: boolean;
    voiceEnabled: boolean;
    autoSuggestions: boolean;
    contextAwareness: boolean;
    learningEnabled: boolean;
    personalityStyle: 'professional' | 'friendly' | 'concise';
    language: 'fr' | 'en' | 'auto';
    responseSpeed: 'fast' | 'balanced' | 'detailed';
  };
  
  // Workspace
  workspace: {
    defaultSphere: string;
    sidebarCollapsed: boolean;
    showQuickActions: boolean;
    dashboardLayout: 'grid' | 'list' | 'kanban';
    calendarFirstDay: 0 | 1; // 0=Sunday, 1=Monday
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    timeFormat: '12h' | '24h';
    timezone: string;
    currency: 'CAD' | 'USD' | 'EUR';
  };
  
  // Integrations
  integrations: {
    googleCalendar: boolean;
    microsoftOutlook: boolean;
    slack: boolean;
    quickbooks: boolean;
    dropbox: boolean;
    googleDrive: boolean;
  };
  
  // Accessibility
  accessibility: {
    highContrast: boolean;
    screenReaderOptimized: boolean;
    keyboardNavigation: boolean;
    focusIndicators: boolean;
    textToSpeech: boolean;
    autoPlayMedia: boolean;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

const defaultSettings: UserSettings = {
  profile: {
    firstName: 'Jo',
    lastName: '',
    email: 'jo@proservice.ca',
    phone: '',
    avatar: '',
    company: 'Pro-Service Construction',
    role: 'Fondateur',
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
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Toggle Switch
const Toggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ checked, onChange, disabled }) => (
  <button
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    style={{
      width: 44,
      height: 24,
      borderRadius: 12,
      background: checked ? '#3F7249' : 'rgba(255,255,255,0.1)',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      position: 'relative',
      transition: 'all 0.2s ease',
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: checked ? '#D8B26A' : '#6B7B6B',
        position: 'absolute',
        top: 3,
        left: checked ? 23 : 3,
        transition: 'all 0.2s ease',
      }}
    />
  </button>
);

// Select Dropdown
const Select: React.FC<{
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}> = ({ value, options, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      padding: '8px 12px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(216,178,106,0.2)',
      borderRadius: 8,
      color: '#E8F0E8',
      fontSize: 11,
      cursor: 'pointer',
      outline: 'none',
      minWidth: 150,
    }}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value} style={{ background: '#1A1A1A' }}>
        {opt.label}
      </option>
    ))}
  </select>
);

// Input Field
const Input: React.FC<{
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}> = ({ value, onChange, type = 'text', placeholder }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      padding: '8px 12px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(216,178,106,0.2)',
      borderRadius: 8,
      color: '#E8F0E8',
      fontSize: 11,
      outline: 'none',
      width: '100%',
      maxWidth: 300,
    }}
  />
);

// Setting Row
const SettingRow: React.FC<{
  label: string;
  description?: string;
  children: React.ReactNode;
}> = ({ label, description, children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}
  >
    <div style={{ flex: 1, marginRight: 16 }}>
      <div style={{ fontSize: 12, color: '#E8F0E8', marginBottom: 2 }}>{label}</div>
      {description && (
        <div style={{ fontSize: 10, color: '#6B7B6B' }}>{description}</div>
      )}
    </div>
    <div>{children}</div>
  </div>
);

// Section Header
const SectionHeader: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
  <h3
    style={{
      fontSize: 14,
      fontWeight: 600,
      color: '#D8B26A',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}
  >
    <span>{icon}</span>
    {title}
  </h3>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

type SettingsSection = 'profile' | 'appearance' | 'notifications' | 'security' | 'nova' | 'workspace' | 'integrations' | 'accessibility' | 'data';

const SECTIONS: { id: SettingsSection; label: string; icon: string }[] = [
  { id: 'profile', label: 'Profil', icon: '👤' },
  { id: 'appearance', label: 'Apparence', icon: '🎨' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'security', label: 'Sécurité', icon: '🔒' },
  { id: 'nova', label: 'Nova IA', icon: '✨' },
  { id: 'workspace', label: 'Espace de travail', icon: '📐' },
  { id: 'integrations', label: 'Intégrations', icon: '🔗' },
  { id: 'accessibility', label: 'Accessibilité', icon: '♿' },
  { id: 'data', label: 'Données', icon: '💾' },
];

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chenu_settings');
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch {
        // Use defaults
      }
    }
  }, []);

  // Update nested setting
  const updateSetting = <K extends keyof UserSettings>(
    category: K,
    key: keyof UserSettings[K],
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  // Save settings
  const saveSettings = async () => {
    setSaving(true);
    try {
      localStorage.setItem('chenu_settings', JSON.stringify(settings));
      // API call would go here
      await new Promise((r) => setTimeout(r, 500));
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  // Render section content
  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div>
            <SectionHeader icon="👤" title="Informations personnelles" />
            <SettingRow label="Prénom">
              <Input
                value={settings.profile.firstName}
                onChange={(v) => updateSetting('profile', 'firstName', v)}
              />
            </SettingRow>
            <SettingRow label="Nom">
              <Input
                value={settings.profile.lastName}
                onChange={(v) => updateSetting('profile', 'lastName', v)}
              />
            </SettingRow>
            <SettingRow label="Email">
              <Input
                type="email"
                value={settings.profile.email}
                onChange={(v) => updateSetting('profile', 'email', v)}
              />
            </SettingRow>
            <SettingRow label="Téléphone">
              <Input
                type="tel"
                value={settings.profile.phone}
                onChange={(v) => updateSetting('profile', 'phone', v)}
                placeholder="+1 (514) 000-0000"
              />
            </SettingRow>
            <SettingRow label="Entreprise">
              <Input
                value={settings.profile.company}
                onChange={(v) => updateSetting('profile', 'company', v)}
              />
            </SettingRow>
            
            <SectionHeader icon="🏛️" title="Informations professionnelles" />
            <SettingRow label="Licence RBQ" description="Numéro de licence Régie du bâtiment">
              <Input
                value={settings.profile.rbqLicense}
                onChange={(v) => updateSetting('profile', 'rbqLicense', v)}
                placeholder="0000-0000-00"
              />
            </SettingRow>
            <SettingRow label="Carte CCQ" description="Carte de compétence CCQ">
              <Input
                value={settings.profile.ccqCard}
                onChange={(v) => updateSetting('profile', 'ccqCard', v)}
              />
            </SettingRow>
            <SettingRow label="Numéro CNESST">
              <Input
                value={settings.profile.cnesstNumber}
                onChange={(v) => updateSetting('profile', 'cnesstNumber', v)}
              />
            </SettingRow>
          </div>
        );

      case 'appearance':
        return (
          <div>
            <SectionHeader icon="🎨" title="Thème et apparence" />
            <SettingRow label="Thème" description="Style visuel de l'interface">
              <Select
                value={settings.appearance.theme}
                onChange={(v) => updateSetting('appearance', 'theme', v)}
                options={[
                  { value: 'cosmic', label: '🌌 Cosmic' },
                  { value: 'ancient', label: '🏛️ Ancient' },
                  { value: 'futurist', label: '🚀 Futurist' },
                  { value: 'realistic', label: '🏗️ Realistic' },
                  { value: 'auto', label: '🔄 Automatique' },
                ]}
              />
            </SettingRow>
            <SettingRow label="Mode couleur">
              <Select
                value={settings.appearance.colorMode}
                onChange={(v) => updateSetting('appearance', 'colorMode', v)}
                options={[
                  { value: 'dark', label: '🌙 Sombre' },
                  { value: 'light', label: '☀️ Clair' },
                  { value: 'system', label: '💻 Système' },
                ]}
              />
            </SettingRow>
            <SettingRow label="Densité" description="Espacement des éléments">
              <Select
                value={settings.appearance.density}
                onChange={(v) => updateSetting('appearance', 'density', v)}
                options={[
                  { value: 'compact', label: 'Compact' },
                  { value: 'balanced', label: 'Équilibré' },
                  { value: 'comfortable', label: 'Confortable' },
                ]}
              />
            </SettingRow>
            <SettingRow label="Taille de police">
              <Select
                value={settings.appearance.fontSize}
                onChange={(v) => updateSetting('appearance', 'fontSize', v)}
                options={[
                  { value: 'small', label: 'Petite' },
                  { value: 'medium', label: 'Moyenne' },
                  { value: 'large', label: 'Grande' },
                ]}
              />
            </SettingRow>
            <SettingRow label="Animations" description="Effets de transition">
              <Toggle
                checked={settings.appearance.animations}
                onChange={(v) => updateSetting('appearance', 'animations', v)}
              />
            </SettingRow>
            <SettingRow label="Mouvement réduit" description="Pour sensibilité au mouvement">
              <Toggle
                checked={settings.appearance.reducedMotion}
                onChange={(v) => updateSetting('appearance', 'reducedMotion', v)}
              />
            </SettingRow>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <SectionHeader icon="📱" title="Canaux de notification" />
            <SettingRow label="Notifications par email">
              <Toggle
                checked={settings.notifications.email}
                onChange={(v) => updateSetting('notifications', 'email', v)}
              />
            </SettingRow>
            <SettingRow label="Notifications push">
              <Toggle
                checked={settings.notifications.push}
                onChange={(v) => updateSetting('notifications', 'push', v)}
              />
            </SettingRow>
            <SettingRow label="Notifications SMS">
              <Toggle
                checked={settings.notifications.sms}
                onChange={(v) => updateSetting('notifications', 'sms', v)}
              />
            </SettingRow>
            <SettingRow label="Notifications desktop">
              <Toggle
                checked={settings.notifications.desktop}
                onChange={(v) => updateSetting('notifications', 'desktop', v)}
              />
            </SettingRow>
            
            <SectionHeader icon="📋" title="Types de notifications" />
            <SettingRow label="Mises à jour de projets">
              <Toggle
                checked={settings.notifications.projectUpdates}
                onChange={(v) => updateSetting('notifications', 'projectUpdates', v)}
              />
            </SettingRow>
            <SettingRow label="Rappels de tâches">
              <Toggle
                checked={settings.notifications.taskReminders}
                onChange={(v) => updateSetting('notifications', 'taskReminders', v)}
              />
            </SettingRow>
            <SettingRow label="Messages d'équipe">
              <Toggle
                checked={settings.notifications.teamMessages}
                onChange={(v) => updateSetting('notifications', 'teamMessages', v)}
              />
            </SettingRow>
            <SettingRow label="Alertes système">
              <Toggle
                checked={settings.notifications.systemAlerts}
                onChange={(v) => updateSetting('notifications', 'systemAlerts', v)}
              />
            </SettingRow>
            <SettingRow label="Résumé hebdomadaire">
              <Toggle
                checked={settings.notifications.weeklyDigest}
                onChange={(v) => updateSetting('notifications', 'weeklyDigest', v)}
              />
            </SettingRow>
            
            <SectionHeader icon="🌙" title="Heures silencieuses" />
            <SettingRow label="Activer les heures silencieuses">
              <Toggle
                checked={settings.notifications.quietHoursEnabled}
                onChange={(v) => updateSetting('notifications', 'quietHoursEnabled', v)}
              />
            </SettingRow>
            {settings.notifications.quietHoursEnabled && (
              <>
                <SettingRow label="Début">
                  <Input
                    type="time"
                    value={settings.notifications.quietHoursStart}
                    onChange={(v) => updateSetting('notifications', 'quietHoursStart', v)}
                  />
                </SettingRow>
                <SettingRow label="Fin">
                  <Input
                    type="time"
                    value={settings.notifications.quietHoursEnd}
                    onChange={(v) => updateSetting('notifications', 'quietHoursEnd', v)}
                  />
                </SettingRow>
              </>
            )}
          </div>
        );

      case 'security':
        return (
          <div>
            <SectionHeader icon="🔐" title="Authentification" />
            <SettingRow label="Authentification à deux facteurs" description="Sécurise votre compte">
              <Toggle
                checked={settings.security.twoFactorEnabled}
                onChange={(v) => updateSetting('security', 'twoFactorEnabled', v)}
              />
            </SettingRow>
            {settings.security.twoFactorEnabled && (
              <SettingRow label="Méthode 2FA">
                <Select
                  value={settings.security.twoFactorMethod}
                  onChange={(v) => updateSetting('security', 'twoFactorMethod', v)}
                  options={[
                    { value: 'app', label: '📱 Application' },
                    { value: 'sms', label: '💬 SMS' },
                    { value: 'email', label: '📧 Email' },
                  ]}
                />
              </SettingRow>
            )}
            <SettingRow label="Délai d'expiration de session" description="Minutes d'inactivité">
              <Select
                value={settings.security.sessionTimeout.toString()}
                onChange={(v) => updateSetting('security', 'sessionTimeout', parseInt(v))}
                options={[
                  { value: '15', label: '15 minutes' },
                  { value: '30', label: '30 minutes' },
                  { value: '60', label: '1 heure' },
                  { value: '120', label: '2 heures' },
                  { value: '480', label: '8 heures' },
                ]}
              />
            </SettingRow>
            <SettingRow label="Notifications de connexion" description="Alerte lors de nouvelles connexions">
              <Toggle
                checked={settings.security.loginNotifications}
                onChange={(v) => updateSetting('security', 'loginNotifications', v)}
              />
            </SettingRow>
            
            <SectionHeader icon="📊" title="Confidentialité" />
            <SettingRow label="Journal d'activité" description="Historique de vos actions">
              <Toggle
                checked={settings.security.activityLogging}
                onChange={(v) => updateSetting('security', 'activityLogging', v)}
              />
            </SettingRow>
            <SettingRow label="Analytiques anonymes" description="Aide à améliorer CHE·NU">
              <Toggle
                checked={settings.security.analyticsEnabled}
                onChange={(v) => updateSetting('security', 'analyticsEnabled', v)}
              />
            </SettingRow>
          </div>
        );

      case 'nova':
        return (
          <div>
            <SectionHeader icon="✨" title="Nova Intelligence Artificielle" />
            <SettingRow label="Activer Nova" description="Assistant IA CHE·NU">
              <Toggle
                checked={settings.nova.enabled}
                onChange={(v) => updateSetting('nova', 'enabled', v)}
              />
            </SettingRow>
            <SettingRow label="Commandes vocales" description="Parlez à Nova">
              <Toggle
                checked={settings.nova.voiceEnabled}
                onChange={(v) => updateSetting('nova', 'voiceEnabled', v)}
                disabled={!settings.nova.enabled}
              />
            </SettingRow>
            <SettingRow label="Suggestions automatiques" description="Nova propose des actions">
              <Toggle
                checked={settings.nova.autoSuggestions}
                onChange={(v) => updateSetting('nova', 'autoSuggestions', v)}
                disabled={!settings.nova.enabled}
              />
            </SettingRow>
            <SettingRow label="Conscience contextuelle" description="Nova comprend le contexte">
              <Toggle
                checked={settings.nova.contextAwareness}
                onChange={(v) => updateSetting('nova', 'contextAwareness', v)}
                disabled={!settings.nova.enabled}
              />
            </SettingRow>
            <SettingRow label="Apprentissage" description="Nova apprend de vos préférences">
              <Toggle
                checked={settings.nova.learningEnabled}
                onChange={(v) => updateSetting('nova', 'learningEnabled', v)}
                disabled={!settings.nova.enabled}
              />
            </SettingRow>
            
            <SectionHeader icon="💬" title="Style de communication" />
            <SettingRow label="Personnalité">
              <Select
                value={settings.nova.personalityStyle}
                onChange={(v) => updateSetting('nova', 'personalityStyle', v)}
                options={[
                  { value: 'professional', label: '👔 Professionnel' },
                  { value: 'friendly', label: '😊 Amical' },
                  { value: 'concise', label: '⚡ Concis' },
                ]}
              />
            </SettingRow>
            <SettingRow label="Langue">
              <Select
                value={settings.nova.language}
                onChange={(v) => updateSetting('nova', 'language', v)}
                options={[
                  { value: 'fr', label: '🇫🇷 Français' },
                  { value: 'en', label: '🇬🇧 English' },
                  { value: 'auto', label: '🔄 Automatique' },
                ]}
              />
            </SettingRow>
            <SettingRow label="Vitesse de réponse">
              <Select
                value={settings.nova.responseSpeed}
                onChange={(v) => updateSetting('nova', 'responseSpeed', v)}
                options={[
                  { value: 'fast', label: '⚡ Rapide' },
                  { value: 'balanced', label: '⚖️ Équilibré' },
                  { value: 'detailed', label: '📝 Détaillé' },
                ]}
              />
            </SettingRow>
          </div>
        );

      case 'workspace':
        return (
          <div>
            <SectionHeader icon="🏠" title="Préférences d'espace de travail" />
            <SettingRow label="Sphère par défaut" description="Sphère ouverte au démarrage">
              <Select
                value={settings.workspace.defaultSphere}
                onChange={(v) => updateSetting('workspace', 'defaultSphere', v)}
                options={[
                  { value: 'maison', label: '🏠 Maison' },
                  { value: 'entreprise', label: '🏢 Entreprise' },
                  { value: 'projets', label: '🏗️ Projets' },
                  { value: 'gouvernement', label: '🏛️ Gouvernement' },
                  { value: 'immobilier', label: '🏘️ Immobilier' },
                ]}
              />
            </SettingRow>
            <SettingRow label="Vue du tableau de bord">
              <Select
                value={settings.workspace.dashboardLayout}
                onChange={(v) => updateSetting('workspace', 'dashboardLayout', v)}
                options={[
                  { value: 'grid', label: '📊 Grille' },
                  { value: 'list', label: '📋 Liste' },
                  { value: 'kanban', label: '📌 Kanban' },
                ]}
              />
            </SettingRow>
            <SettingRow label="Actions rapides" description="Afficher dans le header">
              <Toggle
                checked={settings.workspace.showQuickActions}
                onChange={(v) => updateSetting('workspace', 'showQuickActions', v)}
              />
            </SettingRow>
            
            <SectionHeader icon="📅" title="Format et localisation" />
            <SettingRow label="Premier jour de la semaine">
              <Select
                value={settings.workspace.calendarFirstDay.toString()}
                onChange={(v) => updateSetting('workspace', 'calendarFirstDay', parseInt(v))}
                options={[
                  { value: '0', label: 'Dimanche' },
                  { value: '1', label: 'Lundi' },
                ]}
              />
            </SettingRow>
            <SettingRow label="Format de date">
              <Select
                value={settings.workspace.dateFormat}
                onChange={(v) => updateSetting('workspace', 'dateFormat', v)}
                options={[
                  { value: 'DD/MM/YYYY', label: '31/12/2024' },
                  { value: 'MM/DD/YYYY', label: '12/31/2024' },
                  { value: 'YYYY-MM-DD', label: '2024-12-31' },
                ]}
              />
            </SettingRow>
            <SettingRow label="Format d'heure">
              <Select
                value={settings.workspace.timeFormat}
                onChange={(v) => updateSetting('workspace', 'timeFormat', v)}
                options={[
                  { value: '24h', label: '14:30' },
                  { value: '12h', label: '2:30 PM' },
                ]}
              />
            </SettingRow>
            <SettingRow label="Devise">
              <Select
                value={settings.workspace.currency}
                onChange={(v) => updateSetting('workspace', 'currency', v)}
                options={[
                  { value: 'CAD', label: '🇨🇦 CAD ($)' },
                  { value: 'USD', label: '🇺🇸 USD ($)' },
                  { value: 'EUR', label: '🇪🇺 EUR (€)' },
                ]}
              />
            </SettingRow>
          </div>
        );

      case 'integrations':
        return (
          <div>
            <SectionHeader icon="📅" title="Calendrier et productivité" />
            <SettingRow label="Google Calendar" description="Synchroniser vos événements">
              <Toggle
                checked={settings.integrations.googleCalendar}
                onChange={(v) => updateSetting('integrations', 'googleCalendar', v)}
              />
            </SettingRow>
            <SettingRow label="Microsoft Outlook" description="Email et calendrier">
              <Toggle
                checked={settings.integrations.microsoftOutlook}
                onChange={(v) => updateSetting('integrations', 'microsoftOutlook', v)}
              />
            </SettingRow>
            <SettingRow label="Slack" description="Notifications et collaboration">
              <Toggle
                checked={settings.integrations.slack}
                onChange={(v) => updateSetting('integrations', 'slack', v)}
              />
            </SettingRow>
            
            <SectionHeader icon="💰" title="Finance et comptabilité" />
            <SettingRow label="QuickBooks" description="Comptabilité et facturation">
              <Toggle
                checked={settings.integrations.quickbooks}
                onChange={(v) => updateSetting('integrations', 'quickbooks', v)}
              />
            </SettingRow>
            
            <SectionHeader icon="📁" title="Stockage cloud" />
            <SettingRow label="Google Drive" description="Documents et fichiers">
              <Toggle
                checked={settings.integrations.googleDrive}
                onChange={(v) => updateSetting('integrations', 'googleDrive', v)}
              />
            </SettingRow>
            <SettingRow label="Dropbox" description="Stockage de fichiers">
              <Toggle
                checked={settings.integrations.dropbox}
                onChange={(v) => updateSetting('integrations', 'dropbox', v)}
              />
            </SettingRow>
          </div>
        );

      case 'accessibility':
        return (
          <div>
            <SectionHeader icon="👁️" title="Vision" />
            <SettingRow label="Contraste élevé" description="Améliore la lisibilité">
              <Toggle
                checked={settings.accessibility.highContrast}
                onChange={(v) => updateSetting('accessibility', 'highContrast', v)}
              />
            </SettingRow>
            <SettingRow label="Indicateurs de focus" description="Mise en évidence claire">
              <Toggle
                checked={settings.accessibility.focusIndicators}
                onChange={(v) => updateSetting('accessibility', 'focusIndicators', v)}
              />
            </SettingRow>
            
            <SectionHeader icon="⌨️" title="Navigation" />
            <SettingRow label="Navigation clavier" description="Naviguer sans souris">
              <Toggle
                checked={settings.accessibility.keyboardNavigation}
                onChange={(v) => updateSetting('accessibility', 'keyboardNavigation', v)}
              />
            </SettingRow>
            <SettingRow label="Optimisé lecteur d'écran" description="Compatible NVDA/JAWS">
              <Toggle
                checked={settings.accessibility.screenReaderOptimized}
                onChange={(v) => updateSetting('accessibility', 'screenReaderOptimized', v)}
              />
            </SettingRow>
            
            <SectionHeader icon="🔊" title="Audio" />
            <SettingRow label="Synthèse vocale" description="Lire le contenu à haute voix">
              <Toggle
                checked={settings.accessibility.textToSpeech}
                onChange={(v) => updateSetting('accessibility', 'textToSpeech', v)}
              />
            </SettingRow>
            <SettingRow label="Lecture automatique des médias">
              <Toggle
                checked={settings.accessibility.autoPlayMedia}
                onChange={(v) => updateSetting('accessibility', 'autoPlayMedia', v)}
              />
            </SettingRow>
          </div>
        );

      case 'data':
        return (
          <div>
            <SectionHeader icon="📤" title="Exportation de données" />
            <SettingRow label="Exporter toutes les données" description="Format JSON complet">
              <button
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #3F7249 0%, #2F5A39 100%)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#E8F0E8',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                📥 Exporter
              </button>
            </SettingRow>
            <SettingRow label="Exporter les projets" description="Historique des projets">
              <button
                style={{
                  padding: '8px 16px',
                  background: 'rgba(216,178,106,0.2)',
                  border: '1px solid rgba(216,178,106,0.3)',
                  borderRadius: 8,
                  color: '#D8B26A',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                📊 Projets
              </button>
            </SettingRow>
            
            <SectionHeader icon="⚠️" title="Zone de danger" />
            <SettingRow label="Réinitialiser les préférences" description="Revenir aux paramètres par défaut">
              <button
                onClick={() => {
                  if (confirm('Réinitialiser tous les paramètres?')) {
                    setSettings(defaultSettings);
                    setHasChanges(true);
                  }
                }}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(229,77,77,0.2)',
                  border: '1px solid rgba(229,77,77,0.3)',
                  borderRadius: 8,
                  color: '#E54D4D',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                🔄 Réinitialiser
              </button>
            </SettingRow>
            <SettingRow label="Supprimer le compte" description="Action irréversible">
              <button
                style={{
                  padding: '8px 16px',
                  background: '#E54D4D',
                  border: 'none',
                  borderRadius: 8,
                  color: '#FFF',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                🗑️ Supprimer
              </button>
            </SettingRow>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)',
        color: '#E8F0E8',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
      }}
    >
      {/* Sidebar */}
      <nav
        style={{
          width: 220,
          borderRight: '1px solid rgba(216,178,106,0.1)',
          padding: 20,
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 24,
            color: '#D8B26A',
          }}
        >
          ⚙️ Paramètres
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                padding: '10px 12px',
                background: activeSection === section.id ? 'rgba(216,178,106,0.15)' : 'transparent',
                border: 'none',
                borderRadius: 8,
                color: activeSection === section.id ? '#D8B26A' : '#8B9B8B',
                fontSize: 11,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: 14 }}>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
            {SECTIONS.find((s) => s.id === activeSection)?.icon}{' '}
            {SECTIONS.find((s) => s.id === activeSection)?.label}
          </h2>
          
          {hasChanges && (
            <button
              onClick={saveSettings}
              disabled={saving}
              style={{
                padding: '10px 20px',
                background: saving ? 'rgba(216,178,106,0.3)' : 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)',
                border: 'none',
                borderRadius: 8,
                color: '#1A1A1A',
                fontSize: 11,
                fontWeight: 600,
                cursor: saving ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
            </button>
          )}
        </div>

        {/* Content */}
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 12,
            padding: 20,
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
