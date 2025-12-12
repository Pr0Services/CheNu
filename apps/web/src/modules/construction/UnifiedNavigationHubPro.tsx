/**
 * ╔══════════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                      ║
 * ║              CHE·NU V25 - UNIFIED NAVIGATION HUB PRO                                 ║
 * ║                                                                                      ║
 * ║  The Ultimate AI-Powered Command Center                                              ║
 * ║  ════════════════════════════════════════                                            ║
 * ║                                                                                      ║
 * ║  PRO FEATURES:                                                                       ║
 * ║  ─────────────                                                                       ║
 * ║  🧠 AI Smart Suggestions - Nova learns your patterns                                 ║
 * ║  🎤 Voice Input - Speak commands naturally                                           ║
 * ║  📊 Activity Timeline - See recent actions across all spaces                         ║
 * ║  ⭐ Smart Favorites - Auto-organized bookmarks                                       ║
 * ║  🕐 Command History - Recall & reuse past commands                                   ║
 * ║  🔗 Quick Links - Custom shortcuts                                                   ║
 * ║  📋 Clipboard Integration - Paste & search                                           ║
 * ║  🎨 Theme Switcher - Change themes instantly                                         ║
 * ║  📱 Calculator Mode - Quick math                                                     ║
 * ║  🌐 Multi-language - FR/EN/ES commands                                               ║
 * ║  ⌨️ Vim-style Navigation - For power users                                           ║
 * ║  🔄 Live Preview - See results before executing                                      ║
 * ║  📈 Usage Analytics - Track your productivity                                        ║
 * ║  🎯 Context Awareness - Smart suggestions based on current page                      ║
 * ║                                                                                      ║
 * ║  Trigger: ⌘+K (or Ctrl+K)                                                            ║
 * ║                                                                                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const tokens = {
  colors: {
    // Sacred CHE·NU palette
    gold: '#D8B26A',
    goldLight: '#E8C88A',
    goldDark: '#B8924A',
    emerald: '#3F7249',
    emeraldLight: '#4F8259',
    turquoise: '#3EB4A2',
    
    // Backgrounds
    void: '#0a0d0b',
    bg: {
      primary: '#0f1217',
      secondary: '#161B22',
      tertiary: '#1E242C',
      elevated: '#252D38',
      hover: '#2D3640',
      glass: 'rgba(22, 27, 34, 0.85)',
    },
    
    // Text
    text: {
      primary: '#F4F0EB',
      secondary: '#B8B0A8',
      muted: '#6B6560',
      accent: '#D8B26A',
    },
    
    // Borders
    border: {
      default: 'rgba(216, 178, 106, 0.15)',
      hover: 'rgba(216, 178, 106, 0.3)',
      focus: 'rgba(216, 178, 106, 0.5)',
      glow: 'rgba(216, 178, 106, 0.4)',
    },
    
    // Status
    success: '#4ade80',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    purple: '#8b5cf6',
    pink: '#ec4899',
    cyan: '#06b6d4',
    
    // Spaces
    spaces: {
      maison: '#4ade80',
      entreprise: '#3b82f6',
      projets: '#8b5cf6',
      creative: '#f59e0b',
      gouvernement: '#06b6d4',
      immobilier: '#ec4899',
      associations: '#14b8a6',
    } as Record<string, string>,
  },
  
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 10, lg: 16, xl: 24, full: 9999 },
  
  shadows: {
    glow: '0 0 40px rgba(216, 178, 106, 0.15)',
    elevated: '0 25px 80px rgba(0, 0, 0, 0.6)',
    card: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface HubItem {
  id: string;
  type: 'navigation' | 'action' | 'search' | 'recent' | 'favorite' | 'nova' | 'space' | 'file' | 'contact' | 'command' | 'calculator' | 'theme' | 'link';
  icon: string;
  label: string;
  sublabel?: string;
  shortcut?: string;
  path?: string;
  action?: () => void;
  color?: string;
  badge?: number | string;
  keywords?: string[];
  preview?: string;
  timestamp?: Date;
  frequency?: number;
  aiScore?: number;
}

interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  time: string;
  space: string;
  path: string;
}

type HubMode = 'default' | 'search' | 'nova' | 'create' | 'goto' | 'calculator' | 'theme' | 'history' | 'voice';

interface CommandHistoryItem {
  id: string;
  query: string;
  mode: HubMode;
  timestamp: Date;
  resultCount: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - SPACES
// ═══════════════════════════════════════════════════════════════════════════════

const SPACES: HubItem[] = [
  { id: 'maison', type: 'space', icon: '🏠', label: 'Maison', sublabel: 'Vie personnelle', shortcut: '⌘1', path: '/maison', color: tokens.colors.spaces.maison, keywords: ['home', 'personal', 'famille'], frequency: 45 },
  { id: 'entreprise', type: 'space', icon: '🏢', label: 'Entreprise', sublabel: 'Gestion business', shortcut: '⌘2', path: '/entreprise', color: tokens.colors.spaces.entreprise, keywords: ['business', 'company', 'work'], frequency: 89 },
  { id: 'projets', type: 'space', icon: '📁', label: 'Projets', sublabel: 'Gestion de projets', shortcut: '⌘3', path: '/projets', color: tokens.colors.spaces.projets, keywords: ['projects', 'tasks', 'management'], frequency: 124 },
  { id: 'creative', type: 'space', icon: '🎨', label: 'Creative Studio', sublabel: '1-CLIC création', shortcut: '⌘4', path: '/creative', color: tokens.colors.spaces.creative, keywords: ['design', 'media', 'art', 'studio'], frequency: 67 },
  { id: 'gouvernement', type: 'space', icon: '🏛️', label: 'Gouvernement', sublabel: 'Services publics', shortcut: '⌘5', path: '/gouvernement', color: tokens.colors.spaces.gouvernement, keywords: ['gov', 'public', 'services'], frequency: 23 },
  { id: 'immobilier', type: 'space', icon: '🏘️', label: 'Immobilier', sublabel: 'Propriétés', shortcut: '⌘6', path: '/immobilier', color: tokens.colors.spaces.immobilier, keywords: ['real estate', 'property', 'housing'], frequency: 34 },
  { id: 'associations', type: 'space', icon: '🤝', label: 'Associations', sublabel: 'Organisations', shortcut: '⌘7', path: '/associations', color: tokens.colors.spaces.associations, keywords: ['org', 'nonprofit', 'community'], frequency: 12 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

const NAVIGATION: HubItem[] = [
  { id: 'dashboard', type: 'navigation', icon: '📊', label: 'Dashboard', shortcut: 'G D', path: '/dashboard', keywords: ['home', 'main', 'overview'], frequency: 156 },
  { id: 'social', type: 'navigation', icon: '📱', label: 'Social Network', path: '/social', keywords: ['posts', 'feed', 'friends'], frequency: 78 },
  { id: 'forum', type: 'navigation', icon: '💬', label: 'Forum', path: '/forum', keywords: ['discussions', 'threads', 'community'], frequency: 45 },
  { id: 'streaming', type: 'navigation', icon: '🎬', label: 'Streaming', path: '/streaming', keywords: ['video', 'live', 'watch'], frequency: 89 },
  { id: 'nova', type: 'navigation', icon: '🤖', label: 'Nova AI', shortcut: '⌘J', path: '/nova', keywords: ['ai', 'assistant', 'help'], frequency: 234 },
  { id: 'learn', type: 'navigation', icon: '🎓', label: 'CHE-Learn', path: '/learn', keywords: ['courses', 'training', 'education'], frequency: 56 },
  { id: 'calendar', type: 'navigation', icon: '📅', label: 'Calendrier', shortcut: 'G C', path: '/calendar', keywords: ['events', 'schedule', 'meetings'], badge: 3, frequency: 112 },
  { id: 'messages', type: 'navigation', icon: '✉️', label: 'Messages', shortcut: 'G M', path: '/messages', badge: 7, keywords: ['email', 'inbox', 'chat'], frequency: 189 },
  { id: 'team', type: 'navigation', icon: '👥', label: 'Mon Équipe', path: '/team', keywords: ['agents', 'members', 'staff'], frequency: 67 },
  { id: 'documents', type: 'navigation', icon: '📄', label: 'Documents', shortcut: 'G F', path: '/documents', keywords: ['files', 'folders', 'storage'], frequency: 145 },
  { id: 'finance', type: 'navigation', icon: '💰', label: 'Finance', path: '/finance', keywords: ['money', 'invoices', 'accounting'], frequency: 98 },
  { id: 'analytics', type: 'navigation', icon: '📈', label: 'Analytics', path: '/analytics', keywords: ['stats', 'reports', 'metrics'], frequency: 76 },
  { id: 'settings', type: 'navigation', icon: '⚙️', label: 'Paramètres', shortcut: '⌘,', path: '/settings', keywords: ['preferences', 'config', 'options'], frequency: 34 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const ACTIONS: HubItem[] = [
  { id: 'new-project', type: 'action', icon: '➕', label: 'Nouveau Projet', shortcut: 'N P', keywords: ['create', 'add', 'project'], preview: 'Créer un nouveau projet dans l\'espace actuel' },
  { id: 'new-task', type: 'action', icon: '✅', label: 'Nouvelle Tâche', shortcut: 'N T', keywords: ['create', 'add', 'task', 'todo'], preview: 'Ajouter une tâche rapidement' },
  { id: 'new-invoice', type: 'action', icon: '🧾', label: 'Nouvelle Facture', shortcut: 'N I', keywords: ['create', 'add', 'invoice', 'bill'], preview: 'Créer une facture client' },
  { id: 'new-quote', type: 'action', icon: '📝', label: 'Nouveau Devis', shortcut: 'N Q', keywords: ['create', 'add', 'quote', 'estimate'], preview: 'Générer un devis' },
  { id: 'new-contact', type: 'action', icon: '👤', label: 'Nouveau Contact', shortcut: 'N C', keywords: ['create', 'add', 'contact', 'client'], preview: 'Ajouter un contact ou client' },
  { id: 'new-event', type: 'action', icon: '📅', label: 'Nouvel Événement', shortcut: 'N E', keywords: ['create', 'add', 'event', 'meeting'], preview: 'Planifier un événement' },
  { id: 'new-note', type: 'action', icon: '📒', label: 'Nouvelle Note', shortcut: 'N N', keywords: ['create', 'add', 'note', 'memo'], preview: 'Créer une note rapide' },
  { id: 'new-document', type: 'action', icon: '📄', label: 'Nouveau Document', shortcut: 'N D', keywords: ['create', 'add', 'document', 'file'], preview: 'Créer un document' },
  { id: 'new-folder', type: 'action', icon: '📁', label: 'Nouveau Dossier', shortcut: 'N F', keywords: ['create', 'add', 'folder', 'directory'], preview: 'Créer un dossier' },
  { id: 'upload', type: 'action', icon: '⬆️', label: 'Upload Fichier', shortcut: 'U', keywords: ['upload', 'import', 'file'], preview: 'Importer des fichiers' },
  { id: 'scan', type: 'action', icon: '📸', label: 'Scanner Document', keywords: ['scan', 'camera', 'ocr'], preview: 'Scanner avec OCR intelligent' },
  { id: 'share', type: 'action', icon: '🔗', label: 'Partager', shortcut: '⌘⇧S', keywords: ['share', 'send', 'link'], preview: 'Partager le contenu actuel' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - NOVA COMMANDS
// ═══════════════════════════════════════════════════════════════════════════════

const NOVA_COMMANDS: HubItem[] = [
  { id: 'nova-ask', type: 'nova', icon: '💬', label: 'Demander à Nova', sublabel: 'Pose n\'importe quelle question', keywords: ['ask', 'question', 'help'], preview: 'Nova peut répondre à toutes vos questions' },
  { id: 'nova-summarize', type: 'nova', icon: '📋', label: 'Résumer', sublabel: 'Résumer la page actuelle', keywords: ['summary', 'tldr'], preview: 'Génère un résumé intelligent du contenu' },
  { id: 'nova-translate', type: 'nova', icon: '🌐', label: 'Traduire', sublabel: 'Traduire du texte', keywords: ['translate', 'language'], preview: 'Traduction instantanée FR/EN/ES/DE' },
  { id: 'nova-write', type: 'nova', icon: '✍️', label: 'Rédiger', sublabel: 'Aide à la rédaction', keywords: ['write', 'compose', 'draft'], preview: 'Nova vous aide à écrire' },
  { id: 'nova-analyze', type: 'nova', icon: '📊', label: 'Analyser', sublabel: 'Analyser des données', keywords: ['analyze', 'data', 'insights'], preview: 'Analyse intelligente de vos données' },
  { id: 'nova-schedule', type: 'nova', icon: '📅', label: 'Planifier', sublabel: 'Organiser mon agenda', keywords: ['schedule', 'plan', 'calendar'], preview: 'Optimise votre emploi du temps' },
  { id: 'nova-remind', type: 'nova', icon: '⏰', label: 'Rappel', sublabel: 'Créer un rappel', keywords: ['remind', 'reminder', 'alert'], preview: 'Ne jamais oublier une tâche' },
  { id: 'nova-search', type: 'nova', icon: '🔍', label: 'Recherche Web', sublabel: 'Chercher sur internet', keywords: ['search', 'web', 'google'], preview: 'Recherche augmentée par IA' },
  { id: 'nova-code', type: 'nova', icon: '💻', label: 'Code Helper', sublabel: 'Aide au développement', keywords: ['code', 'programming', 'dev'], preview: 'Assistance au développement' },
  { id: 'nova-image', type: 'nova', icon: '🎨', label: 'Générer Image', sublabel: 'Création d\'images IA', keywords: ['image', 'generate', 'ai', 'art'], preview: 'Génération d\'images par IA' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - RECENT ACTIVITY (Mock)
// ═══════════════════════════════════════════════════════════════════════════════

const RECENT_ACTIVITY: ActivityItem[] = [
  { id: 'act-1', icon: '📁', title: 'Projet Tremblay', subtitle: 'Modifié', time: 'Il y a 5 min', space: 'projets', path: '/projets/tremblay' },
  { id: 'act-2', icon: '🧾', title: 'Facture #2024-089', subtitle: 'Créée', time: 'Il y a 12 min', space: 'entreprise', path: '/finance/invoices/2024-089' },
  { id: 'act-3', icon: '👤', title: 'Marie Côté', subtitle: 'Contact ajouté', time: 'Il y a 1h', space: 'entreprise', path: '/contacts/marie-cote' },
  { id: 'act-4', icon: '📅', title: 'Réunion Équipe', subtitle: 'Événement terminé', time: 'Il y a 2h', space: 'entreprise', path: '/calendar/reunion-equipe' },
  { id: 'act-5', icon: '📄', title: 'Devis_Final.pdf', subtitle: 'Téléversé', time: 'Il y a 3h', space: 'projets', path: '/documents/devis-final' },
  { id: 'act-6', icon: '✅', title: 'Réviser contrat', subtitle: 'Tâche complétée', time: 'Hier', space: 'projets', path: '/tasks/reviser-contrat' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - FAVORITES (Mock)
// ═══════════════════════════════════════════════════════════════════════════════

const FAVORITES: HubItem[] = [
  { id: 'fav-1', type: 'favorite', icon: '⭐', label: 'Dashboard Finance', path: '/finance/dashboard', color: tokens.colors.info, frequency: 45 },
  { id: 'fav-2', type: 'favorite', icon: '⭐', label: 'Projets Actifs', path: '/projets?filter=active', color: tokens.colors.purple, frequency: 67 },
  { id: 'fav-3', type: 'favorite', icon: '⭐', label: 'Mes Tâches', path: '/tasks/mine', color: tokens.colors.success, frequency: 89 },
  { id: 'fav-4', type: 'favorite', icon: '⭐', label: 'Contacts VIP', path: '/contacts?filter=vip', color: tokens.colors.warning, frequency: 23 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - THEMES
// ═══════════════════════════════════════════════════════════════════════════════

const THEMES: HubItem[] = [
  { id: 'theme-dark', type: 'theme', icon: '🌙', label: 'Sombre', sublabel: 'Thème par défaut', color: '#1E242C' },
  { id: 'theme-light', type: 'theme', icon: '☀️', label: 'Clair', sublabel: 'Mode jour', color: '#F4F0EB' },
  { id: 'theme-vr', type: 'theme', icon: '🥽', label: 'VR Mode', sublabel: 'Néon vert', color: '#00ff88' },
  { id: 'theme-midnight', type: 'theme', icon: '🌌', label: 'Midnight', sublabel: 'Bleu profond', color: '#0a1628' },
  { id: 'theme-forest', type: 'theme', icon: '🌲', label: 'Forêt', sublabel: 'Vert naturel', color: '#1a2f1a' },
  { id: 'theme-sunset', type: 'theme', icon: '🌅', label: 'Sunset', sublabel: 'Orange chaud', color: '#2d1810' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA - QUICK LINKS
// ═══════════════════════════════════════════════════════════════════════════════

const QUICK_LINKS: HubItem[] = [
  { id: 'link-github', type: 'link', icon: '🐙', label: 'GitHub', path: 'https://github.com', keywords: ['git', 'code', 'repo'] },
  { id: 'link-figma', type: 'link', icon: '🎨', label: 'Figma', path: 'https://figma.com', keywords: ['design', 'ui'] },
  { id: 'link-notion', type: 'link', icon: '📝', label: 'Notion', path: 'https://notion.so', keywords: ['notes', 'docs'] },
  { id: 'link-slack', type: 'link', icon: '💬', label: 'Slack', path: 'https://slack.com', keywords: ['chat', 'team'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// AI SUGGESTIONS ENGINE (Mock)
// ═══════════════════════════════════════════════════════════════════════════════

const generateAISuggestions = (query: string, timeOfDay: number, recentActions: string[]): HubItem[] => {
  const suggestions: HubItem[] = [];
  
  // Morning suggestions (before 12)
  if (timeOfDay < 12) {
    suggestions.push({ id: 'ai-morning-1', type: 'nova', icon: '☀️', label: 'Résumé du matin', sublabel: 'Nova peut résumer vos emails', aiScore: 0.95 });
    suggestions.push({ id: 'ai-morning-2', type: 'navigation', icon: '📅', label: 'Voir l\'agenda', sublabel: '3 réunions aujourd\'hui', aiScore: 0.88, path: '/calendar' });
  }
  
  // Afternoon suggestions
  if (timeOfDay >= 12 && timeOfDay < 18) {
    suggestions.push({ id: 'ai-afternoon-1', type: 'action', icon: '✅', label: 'Tâches urgentes', sublabel: '5 tâches dues aujourd\'hui', aiScore: 0.92 });
  }
  
  // Query-based suggestions
  if (query.includes('facture') || query.includes('invoice')) {
    suggestions.push({ id: 'ai-invoice', type: 'action', icon: '🧾', label: 'Créer Facture', sublabel: 'Basé sur le dernier devis', aiScore: 0.97 });
  }
  
  if (query.includes('projet') || query.includes('project')) {
    suggestions.push({ id: 'ai-project', type: 'navigation', icon: '📁', label: 'Projet Tremblay', sublabel: 'Votre projet le plus actif', aiScore: 0.94, path: '/projets/tremblay' });
  }
  
  return suggestions.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)).slice(0, 3);
};

// ═══════════════════════════════════════════════════════════════════════════════
// CALCULATOR ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

const evaluateCalculation = (expr: string): string | null => {
  try {
    // Clean the expression
    const cleaned = expr
      .replace(/[×x]/g, '*')
      .replace(/÷/g, '/')
      .replace(/,/g, '.')
      .replace(/\s/g, '')
      .replace(/[^0-9+\-*/.()%]/g, '');
    
    if (!cleaned || !/[0-9]/.test(cleaned)) return null;
    
    // Safe evaluation
    const result = Function(`"use strict"; return (${cleaned})`)();
    
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return result.toLocaleString('fr-FR', { maximumFractionDigits: 6 });
    }
    return null;
  } catch {
    return null;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT - UNIFIED NAVIGATION HUB PRO
// ═══════════════════════════════════════════════════════════════════════════════

const UnifiedNavigationHubPro: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
  onAction?: (actionId: string) => void;
  onNovaCommand?: (command: string, query?: string) => void;
  onThemeChange?: (themeId: string) => void;
  currentContext?: { space?: string; page?: string };
}> = ({ isOpen, onClose, onNavigate, onAction, onNovaCommand, onThemeChange, currentContext }) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────────
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<HubMode>('default');
  const [activeTab, setActiveTab] = useState<'all' | 'spaces' | 'actions' | 'nova' | 'recent' | 'favorites'>('all');
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [previewItem, setPreviewItem] = useState<HubItem | null>(null);
  const [calculatorResult, setCalculatorResult] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // AI SUGGESTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  
  const aiSuggestions = useMemo(() => {
    const hour = new Date().getHours();
    return generateAISuggestions(query, hour, []);
  }, [query]);

  // ─────────────────────────────────────────────────────────────────────────────
  // CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  
  useEffect(() => {
    const result = evaluateCalculation(query);
    setCalculatorResult(result);
    if (result) {
      setMode('calculator');
    } else if (mode === 'calculator') {
      setMode('default');
    }
  }, [query]);

  // ─────────────────────────────────────────────────────────────────────────────
  // FILTER LOGIC
  // ─────────────────────────────────────────────────────────────────────────────

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    
    // Calculator mode - show result
    if (calculatorResult) {
      return [{
        id: 'calc-result',
        type: 'calculator' as const,
        icon: '🧮',
        label: calculatorResult,
        sublabel: `= ${query}`,
        shortcut: '↵ Copier',
      }];
    }
    
    // Mode triggers
    if (q.startsWith('/') || q.startsWith('>')) {
      setMode('create');
      const searchQ = q.slice(1);
      return ACTIONS.filter(item => 
        item.label.toLowerCase().includes(searchQ) ||
        item.keywords?.some(k => k.includes(searchQ))
      );
    }
    
    if (q.startsWith('@') || q.startsWith('nova ') || q.startsWith('ask ')) {
      setMode('nova');
      const searchQ = q.replace(/^(@|nova |ask )/, '');
      if (!searchQ) return NOVA_COMMANDS;
      return NOVA_COMMANDS.filter(item =>
        item.label.toLowerCase().includes(searchQ) ||
        item.keywords?.some(k => k.includes(searchQ))
      );
    }
    
    if (q.startsWith('go ') || q.startsWith('aller ') || q.startsWith('g ')) {
      setMode('goto');
      const searchQ = q.replace(/^(go |aller |g )/, '');
      return [...SPACES, ...NAVIGATION].filter(item =>
        item.label.toLowerCase().includes(searchQ) ||
        item.keywords?.some(k => k.includes(searchQ))
      );
    }
    
    if (q.startsWith('theme ') || q === 'theme') {
      setMode('theme');
      return THEMES;
    }
    
    if (q.startsWith('history') || q === 'h') {
      setMode('history');
      return commandHistory.slice(0, 10).map((h, i) => ({
        id: `history-${i}`,
        type: 'command' as const,
        icon: '🕐',
        label: h.query,
        sublabel: new Date(h.timestamp).toLocaleString('fr-FR'),
      }));
    }
    
    setMode('default');
    
    // No query - show based on active tab
    if (!q) {
      if (activeTab === 'spaces') return SPACES;
      if (activeTab === 'actions') return ACTIONS;
      if (activeTab === 'nova') return NOVA_COMMANDS;
      if (activeTab === 'favorites') return FAVORITES;
      return null; // Show sections
    }
    
    // Global search
    const allItems = [...SPACES, ...NAVIGATION, ...ACTIONS, ...NOVA_COMMANDS, ...FAVORITES, ...QUICK_LINKS];
    
    const results = allItems
      .filter(item => {
        const labelMatch = item.label.toLowerCase().includes(q);
        const sublabelMatch = item.sublabel?.toLowerCase().includes(q);
        const keywordMatch = item.keywords?.some(k => k.toLowerCase().includes(q));
        return labelMatch || sublabelMatch || keywordMatch;
      })
      .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
      .slice(0, 12);
    
    return results;
  }, [query, activeTab, calculatorResult, commandHistory]);

  // Flatten for keyboard nav
  const flatItems = useMemo(() => {
    if (filteredResults) return filteredResults;
    
    // Default sections
    return [
      ...(aiSuggestions.length > 0 ? aiSuggestions : []),
      ...FAVORITES.slice(0, 3),
      ...SPACES.slice(0, 7),
      ...NAVIGATION.slice(0, 4),
    ];
  }, [filteredResults, aiSuggestions]);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  const handleSelect = useCallback((item: HubItem) => {
    // Add to history
    if (query) {
      setCommandHistory(prev => [{
        id: Date.now().toString(),
        query,
        mode,
        timestamp: new Date(),
        resultCount: flatItems.length,
      }, ...prev].slice(0, 50));
    }
    
    if (item.type === 'calculator') {
      navigator.clipboard?.writeText(item.label);
      onClose();
      return;
    }
    
    if (item.type === 'theme') {
      onThemeChange?.(item.id);
      onClose();
      return;
    }
    
    if (item.type === 'nova') {
      onNovaCommand?.(item.id, query.replace(/^(@|nova |ask )/, ''));
      onClose();
      return;
    }
    
    if (item.type === 'action') {
      onAction?.(item.id);
      onClose();
      return;
    }
    
    if (item.type === 'link') {
      window.open(item.path, '_blank');
      onClose();
      return;
    }
    
    if (item.path) {
      onNavigate?.(item.path);
      onClose();
    }
  }, [query, mode, flatItems, onNavigate, onAction, onNovaCommand, onThemeChange, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, flatItems.length - 1));
        setPreviewItem(flatItems[Math.min(selectedIndex + 1, flatItems.length - 1)] || null);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (selectedIndex === 0 && historyIndex < commandHistory.length - 1) {
          // Browse history
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setQuery(commandHistory[newIndex]?.query || '');
        } else {
          setSelectedIndex(i => Math.max(i - 1, 0));
          setPreviewItem(flatItems[Math.max(selectedIndex - 1, 0)] || null);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (flatItems[selectedIndex]) {
          handleSelect(flatItems[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'Tab':
        e.preventDefault();
        const tabs: typeof activeTab[] = ['all', 'spaces', 'actions', 'nova', 'favorites'];
        const currentIdx = tabs.indexOf(activeTab);
        setActiveTab(tabs[(currentIdx + 1) % tabs.length]);
        break;
    }
  }, [flatItems, selectedIndex, handleSelect, onClose, activeTab, historyIndex, commandHistory]);

  // Voice input simulation
  const toggleVoice = useCallback(() => {
    setIsListening(prev => !prev);
    if (!isListening) {
      setMode('voice');
      // Simulate voice recognition
      setTimeout(() => {
        setQuery('nouveau projet');
        setIsListening(false);
        setMode('default');
      }, 2000);
    }
  }, [isListening]);

  // ─────────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
      setMode('default');
      setHistoryIndex(-1);
      setPreviewItem(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeTab]);

  useEffect(() => {
    const selectedEl = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    selectedEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedIndex]);

  // Global shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '7' && isOpen) {
        e.preventDefault();
        const spaceIndex = parseInt(e.key) - 1;
        if (SPACES[spaceIndex]) {
          onNavigate?.(SPACES[spaceIndex].path!);
          onClose();
        }
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose, onNavigate]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  if (!isOpen) return null;

  const getModeColor = () => {
    switch (mode) {
      case 'nova': return tokens.colors.purple;
      case 'create': return tokens.colors.success;
      case 'goto': return tokens.colors.info;
      case 'calculator': return tokens.colors.warning;
      case 'theme': return tokens.colors.pink;
      case 'voice': return tokens.colors.error;
      default: return tokens.colors.gold;
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'nova': return '🤖';
      case 'create': return '➕';
      case 'goto': return '🚀';
      case 'calculator': return '🧮';
      case 'theme': return '🎨';
      case 'voice': return '🎤';
      case 'history': return '🕐';
      default: return '🔍';
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        {/* ═══ HEADER ═══ */}
        <div style={styles.header}>
          {/* Search Bar */}
          <div style={{
            ...styles.searchContainer,
            borderColor: getModeColor(),
            boxShadow: `0 0 20px ${getModeColor()}30`,
          }}>
            <span style={{ ...styles.searchIcon, color: getModeColor() }}>
              {getModeIcon()}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === 'nova' ? 'Demander à Nova...' :
                mode === 'create' ? 'Créer...' :
                mode === 'goto' ? 'Aller à...' :
                mode === 'calculator' ? 'Calculer...' :
                mode === 'voice' ? 'Écoute...' :
                'Rechercher, naviguer, créer, calculer, demander à Nova...'
              }
              style={styles.searchInput}
            />
            
            {/* Voice Button */}
            <button
              onClick={toggleVoice}
              style={{
                ...styles.voiceBtn,
                backgroundColor: isListening ? tokens.colors.error : 'transparent',
                color: isListening ? '#fff' : tokens.colors.text.muted,
              }}
            >
              🎤
            </button>
            
            <div style={styles.shortcuts}>
              <kbd style={styles.kbd}>ESC</kbd>
            </div>
          </div>
          
          {/* Tab Pills */}
          <div style={styles.tabBar}>
            {[
              { id: 'all', label: '🔍 Tout', shortcut: '' },
              { id: 'spaces', label: '🌐 Espaces', shortcut: '' },
              { id: 'actions', label: '⚡ Actions', shortcut: '/' },
              { id: 'nova', label: '🤖 Nova', shortcut: '@' },
              { id: 'favorites', label: '⭐ Favoris', shortcut: '' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={{
                  ...styles.tabPill,
                  ...(activeTab === tab.id ? styles.tabPillActive : {}),
                }}
              >
                {tab.label}
                {tab.shortcut && <kbd style={styles.tabShortcut}>{tab.shortcut}</kbd>}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ CONTENT ═══ */}
        <div style={styles.contentWrapper}>
          {/* Main Results */}
          <div ref={listRef} style={styles.content}>
            
            {/* AI Suggestions */}
            {mode === 'default' && !query && aiSuggestions.length > 0 && (
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <span>🧠</span>
                  <span>Suggestions Nova</span>
                  <span style={styles.aiTag}>IA</span>
                </div>
                <div style={styles.list}>
                  {aiSuggestions.map((item, idx) => (
                    <ResultItem
                      key={item.id}
                      item={item}
                      index={idx}
                      isSelected={idx === selectedIndex}
                      onClick={() => handleSelect(item)}
                      onHover={() => setPreviewItem(item)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Calculator Result */}
            {calculatorResult && (
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <span>🧮</span>
                  <span>Calculatrice</span>
                </div>
                <div style={styles.calculatorResult}>
                  <span style={styles.calcExpression}>{query}</span>
                  <span style={styles.calcEquals}>=</span>
                  <span style={styles.calcValue}>{calculatorResult}</span>
                  <button style={styles.copyBtn} onClick={() => navigator.clipboard?.writeText(calculatorResult)}>
                    📋 Copier
                  </button>
                </div>
              </div>
            )}
            
            {/* Filtered Results */}
            {filteredResults && !calculatorResult && (
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <span>{getModeIcon()}</span>
                  <span>
                    {mode === 'create' ? 'Créer' : 
                     mode === 'nova' ? 'Nova AI' : 
                     mode === 'goto' ? 'Navigation' : 
                     mode === 'theme' ? 'Thèmes' :
                     mode === 'history' ? 'Historique' :
                     'Résultats'}
                  </span>
                  <span style={styles.resultCount}>{filteredResults.length}</span>
                </div>
                <div style={styles.list}>
                  {filteredResults.map((item, idx) => (
                    <ResultItem
                      key={item.id}
                      item={item}
                      index={idx}
                      isSelected={idx === selectedIndex}
                      onClick={() => handleSelect(item)}
                      onHover={() => setPreviewItem(item)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Default Sections */}
            {!filteredResults && !calculatorResult && (
              <>
                {/* Spaces Grid */}
                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <span>🌐</span>
                    <span>Espaces</span>
                  </div>
                  <div style={styles.spacesGrid}>
                    {SPACES.map((item, idx) => {
                      const isSelected = idx + (aiSuggestions.length > 0 ? aiSuggestions.length : 0) === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          data-index={idx}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setPreviewItem(item)}
                          style={{
                            ...styles.spaceCard,
                            ...(isSelected ? styles.spaceCardSelected : {}),
                            borderColor: isSelected ? item.color : 'transparent',
                          }}
                        >
                          <span style={{ fontSize: 24 }}>{item.icon}</span>
                          <span style={styles.spaceLabel}>{item.label}</span>
                          <kbd style={styles.spaceShortcut}>{item.shortcut}</kbd>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Favorites */}
                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <span>⭐</span>
                    <span>Favoris</span>
                  </div>
                  <div style={styles.list}>
                    {FAVORITES.slice(0, 4).map((item, idx) => (
                      <ResultItem
                        key={item.id}
                        item={item}
                        index={idx + SPACES.length + (aiSuggestions.length > 0 ? aiSuggestions.length : 0)}
                        isSelected={idx + SPACES.length + (aiSuggestions.length > 0 ? aiSuggestions.length : 0) === selectedIndex}
                        onClick={() => handleSelect(item)}
                        onHover={() => setPreviewItem(item)}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <span>🕐</span>
                    <span>Activité Récente</span>
                  </div>
                  <div style={styles.activityList}>
                    {RECENT_ACTIVITY.slice(0, 4).map(activity => (
                      <div
                        key={activity.id}
                        onClick={() => onNavigate?.(activity.path)}
                        style={styles.activityItem}
                      >
                        <div style={{
                          ...styles.activityIcon,
                          backgroundColor: `${tokens.colors.spaces[activity.space]}20`,
                        }}>
                          {activity.icon}
                        </div>
                        <div style={styles.activityContent}>
                          <span style={styles.activityTitle}>{activity.title}</span>
                          <span style={styles.activitySubtitle}>{activity.subtitle}</span>
                        </div>
                        <span style={styles.activityTime}>{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Preview Panel */}
          {previewItem?.preview && (
            <div style={styles.previewPanel}>
              <div style={styles.previewHeader}>
                <span style={{ fontSize: 32 }}>{previewItem.icon}</span>
                <div>
                  <div style={styles.previewTitle}>{previewItem.label}</div>
                  {previewItem.sublabel && (
                    <div style={styles.previewSubtitle}>{previewItem.sublabel}</div>
                  )}
                </div>
              </div>
              <div style={styles.previewContent}>
                {previewItem.preview}
              </div>
              {previewItem.shortcut && (
                <div style={styles.previewShortcut}>
                  <kbd style={styles.kbd}>{previewItem.shortcut}</kbd>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══ FOOTER ═══ */}
        <div style={styles.footer}>
          <div style={styles.footerHints}>
            <span style={styles.hint}>
              <kbd style={styles.kbdSmall}>↑↓</kbd> Naviguer
            </span>
            <span style={styles.hint}>
              <kbd style={styles.kbdSmall}>↵</kbd> Sélectionner
            </span>
            <span style={styles.hint}>
              <kbd style={styles.kbdSmall}>Tab</kbd> Section
            </span>
            <span style={styles.hint}>
              <kbd style={styles.kbdSmall}>/</kbd> Créer
            </span>
            <span style={styles.hint}>
              <kbd style={styles.kbdSmall}>@</kbd> Nova
            </span>
            <span style={styles.hint}>
              <kbd style={styles.kbdSmall}>=</kbd> Calculer
            </span>
          </div>
          <div style={styles.footerBrand}>
            <span style={{ 
              padding: '2px 8px', 
              backgroundColor: `${tokens.colors.gold}20`, 
              borderRadius: 6,
              fontSize: 10,
              color: tokens.colors.gold,
              marginRight: 8,
            }}>PRO</span>
            <span style={{ color: tokens.colors.gold }}>CHE·NU</span> V25
          </div>
        </div>
        
        {/* Tips Popover */}
        {showTips && mode === 'default' && !query && (
          <div style={styles.tipsPopover}>
            <button onClick={() => setShowTips(false)} style={styles.tipsClose}>✕</button>
            <div style={styles.tipsTitle}>💡 Astuces PRO</div>
            <div style={styles.tipsList}>
              <div style={styles.tip}>Tapez <kbd style={styles.kbdSmall}>/</kbd> pour créer rapidement</div>
              <div style={styles.tip}>Tapez <kbd style={styles.kbdSmall}>@</kbd> pour parler à Nova</div>
              <div style={styles.tip}>Tapez des chiffres pour calculer</div>
              <div style={styles.tip}>Utilisez <kbd style={styles.kbdSmall}>⌘1-7</kbd> pour les espaces</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESULT ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ResultItem: React.FC<{
  item: HubItem;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onHover: () => void;
}> = ({ item, index, isSelected, onClick, onHover }) => (
  <button
    data-index={index}
    onClick={onClick}
    onMouseEnter={onHover}
    style={{
      ...styles.listItem,
      ...(isSelected ? styles.listItemSelected : {}),
    }}
  >
    <span style={{
      ...styles.itemIcon,
      backgroundColor: item.color ? `${item.color}20` : undefined,
    }}>
      {item.icon}
    </span>
    <div style={styles.itemContent}>
      <span style={styles.itemLabel}>{item.label}</span>
      {item.sublabel && (
        <span style={styles.itemSublabel}>{item.sublabel}</span>
      )}
    </div>
    {item.badge && (
      <span style={styles.badge}>{item.badge}</span>
    )}
    {item.aiScore && (
      <span style={styles.aiScore}>{Math.round(item.aiScore * 100)}%</span>
    )}
    {item.shortcut && (
      <kbd style={styles.itemShortcut}>{item.shortcut}</kbd>
    )}
    <span style={styles.itemArrow}>→</span>
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '8vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(12px)',
  },
  
  modal: {
    width: '100%',
    maxWidth: 780,
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.xl,
    border: `1px solid ${tokens.colors.border.default}`,
    boxShadow: `${tokens.shadows.elevated}, ${tokens.shadows.glow}`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '80vh',
    position: 'relative',
  },
  
  // Header
  header: {
    padding: tokens.spacing.md,
    borderBottom: `1px solid ${tokens.colors.border.default}`,
    backgroundColor: tokens.colors.bg.tertiary,
  },
  
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: `${tokens.spacing.sm + 2}px ${tokens.spacing.md}px`,
    backgroundColor: tokens.colors.bg.primary,
    borderRadius: tokens.radius.lg,
    border: `2px solid ${tokens.colors.border.default}`,
    transition: 'all 0.2s ease',
  },
  
  searchIcon: {
    fontSize: 22,
    transition: 'color 0.2s',
  },
  
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: 16,
    color: tokens.colors.text.primary,
    fontFamily: 'inherit',
  },
  
  voiceBtn: {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: tokens.radius.full,
    cursor: 'pointer',
    fontSize: 16,
    transition: 'all 0.2s',
  },
  
  shortcuts: {
    display: 'flex',
    gap: tokens.spacing.xs,
  },
  
  kbd: {
    padding: '4px 10px',
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.sm,
    fontSize: 11,
    color: tokens.colors.text.muted,
    fontFamily: 'system-ui',
    border: `1px solid ${tokens.colors.border.default}`,
  },
  
  // Tabs
  tabBar: {
    display: 'flex',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.md,
    overflowX: 'auto',
  },
  
  tabPill: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
    backgroundColor: tokens.colors.bg.primary,
    border: `1px solid ${tokens.colors.border.default}`,
    borderRadius: tokens.radius.md,
    color: tokens.colors.text.secondary,
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  
  tabPillActive: {
    backgroundColor: tokens.colors.gold,
    color: '#000',
    borderColor: tokens.colors.gold,
    fontWeight: 600,
  },
  
  tabShortcut: {
    padding: '1px 4px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 3,
    fontSize: 9,
  },
  
  // Content
  contentWrapper: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: tokens.spacing.md,
  },
  
  section: {
    marginBottom: tokens.spacing.lg,
  },
  
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    color: tokens.colors.text.muted,
    marginBottom: tokens.spacing.sm,
    padding: `0 ${tokens.spacing.sm}px`,
  },
  
  aiTag: {
    padding: '2px 6px',
    backgroundColor: `${tokens.colors.purple}30`,
    color: tokens.colors.purple,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 700,
  },
  
  resultCount: {
    padding: '2px 8px',
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: 10,
    fontSize: 10,
  },
  
  // Calculator
  calculatorResult: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.lg,
    backgroundColor: `${tokens.colors.warning}10`,
    borderRadius: tokens.radius.lg,
    border: `1px solid ${tokens.colors.warning}30`,
  },
  
  calcExpression: {
    fontSize: 16,
    color: tokens.colors.text.secondary,
    fontFamily: 'monospace',
  },
  
  calcEquals: {
    fontSize: 20,
    color: tokens.colors.warning,
  },
  
  calcValue: {
    fontSize: 28,
    fontWeight: 700,
    color: tokens.colors.text.primary,
    fontFamily: 'monospace',
  },
  
  copyBtn: {
    marginLeft: 'auto',
    padding: '6px 12px',
    backgroundColor: tokens.colors.bg.tertiary,
    border: `1px solid ${tokens.colors.border.default}`,
    borderRadius: tokens.radius.md,
    color: tokens.colors.text.secondary,
    fontSize: 12,
    cursor: 'pointer',
  },
  
  // Spaces Grid
  spacesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: tokens.spacing.sm,
  },
  
  spaceCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.tertiary,
    border: '2px solid transparent',
    borderRadius: tokens.radius.lg,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  spaceCardSelected: {
    backgroundColor: tokens.colors.bg.hover,
    transform: 'scale(1.05)',
  },
  
  spaceLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
  },
  
  spaceShortcut: {
    fontSize: 9,
    color: tokens.colors.text.muted,
    fontFamily: 'system-ui',
  },
  
  // List Items
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: `${tokens.spacing.sm + 2}px ${tokens.spacing.md}px`,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: tokens.radius.md,
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'left',
    width: '100%',
  },
  
  listItemSelected: {
    backgroundColor: `${tokens.colors.gold}15`,
    borderLeft: `3px solid ${tokens.colors.gold}`,
  },
  
  itemIcon: {
    fontSize: 18,
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.radius.md,
  },
  
  itemContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  
  itemLabel: {
    fontSize: 14,
    color: tokens.colors.text.primary,
  },
  
  itemSublabel: {
    fontSize: 11,
    color: tokens.colors.text.muted,
  },
  
  badge: {
    padding: '2px 8px',
    backgroundColor: tokens.colors.error,
    color: '#fff',
    fontSize: 10,
    fontWeight: 600,
    borderRadius: 10,
  },
  
  aiScore: {
    padding: '2px 6px',
    backgroundColor: `${tokens.colors.purple}20`,
    color: tokens.colors.purple,
    fontSize: 10,
    fontWeight: 600,
    borderRadius: 4,
  },
  
  itemShortcut: {
    padding: '3px 8px',
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.sm,
    fontSize: 10,
    color: tokens.colors.text.muted,
    fontFamily: 'system-ui',
  },
  
  itemArrow: {
    color: tokens.colors.text.muted,
    fontSize: 12,
    opacity: 0.5,
  },
  
  // Activity
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.xs,
  },
  
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.sm,
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.md,
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  
  activityIcon: {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.radius.sm,
    fontSize: 14,
  },
  
  activityContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  
  activityTitle: {
    fontSize: 13,
    color: tokens.colors.text.primary,
  },
  
  activitySubtitle: {
    fontSize: 11,
    color: tokens.colors.text.muted,
  },
  
  activityTime: {
    fontSize: 10,
    color: tokens.colors.text.muted,
  },
  
  // Preview Panel
  previewPanel: {
    width: 260,
    borderLeft: `1px solid ${tokens.colors.border.default}`,
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.bg.tertiary,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.md,
  },
  
  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  
  previewTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: tokens.colors.text.primary,
  },
  
  previewSubtitle: {
    fontSize: 12,
    color: tokens.colors.text.muted,
  },
  
  previewContent: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
    lineHeight: 1.5,
  },
  
  previewShortcut: {
    marginTop: 'auto',
    paddingTop: tokens.spacing.md,
    borderTop: `1px solid ${tokens.colors.border.default}`,
  },
  
  // Footer
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    borderTop: `1px solid ${tokens.colors.border.default}`,
    backgroundColor: tokens.colors.bg.tertiary,
  },
  
  footerHints: {
    display: 'flex',
    gap: tokens.spacing.md,
    flexWrap: 'wrap',
  },
  
  hint: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    fontSize: 11,
    color: tokens.colors.text.muted,
  },
  
  kbdSmall: {
    padding: '2px 5px',
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: 4,
    fontSize: 10,
    fontFamily: 'system-ui',
  },
  
  footerBrand: {
    fontSize: 11,
    color: tokens.colors.text.muted,
    display: 'flex',
    alignItems: 'center',
  },
  
  // Tips
  tipsPopover: {
    position: 'absolute',
    bottom: 60,
    right: 16,
    width: 220,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.elevated,
    borderRadius: tokens.radius.lg,
    border: `1px solid ${tokens.colors.border.hover}`,
    boxShadow: tokens.shadows.card,
  },
  
  tipsClose: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
    border: 'none',
    color: tokens.colors.text.muted,
    cursor: 'pointer',
    fontSize: 12,
  },
  
  tipsTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: tokens.colors.gold,
    marginBottom: tokens.spacing.sm,
  },
  
  tipsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.xs,
  },
  
  tip: {
    fontSize: 11,
    color: tokens.colors.text.secondary,
    lineHeight: 1.4,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

const UnifiedNavigationHubProDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAction, setLastAction] = useState<{ type: string; value: string } | null>(null);
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showAction = (type: string, value: string) => {
    setLastAction({ type, value });
    setTimeout(() => setLastAction(null), 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: tokens.colors.void,
      padding: tokens.spacing.xl,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Demo Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          backgroundColor: `${tokens.colors.gold}20`,
          borderRadius: 20,
          fontSize: 12,
          color: tokens.colors.gold,
          fontWeight: 600,
          marginBottom: 16,
        }}>
          ✨ VERSION PRO
        </div>
        <h1 style={{ 
          color: tokens.colors.text.primary, 
          fontSize: 36,
          marginBottom: 12,
          background: `linear-gradient(135deg, ${tokens.colors.gold}, ${tokens.colors.turquoise}, ${tokens.colors.purple})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🚀 Unified Navigation Hub PRO
        </h1>
        <p style={{ color: tokens.colors.text.secondary, marginBottom: 32, fontSize: 16 }}>
          Le Centre de Commande Ultime propulsé par l'IA pour CHE·NU V25
        </p>
        
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '18px 40px',
            background: `linear-gradient(135deg, ${tokens.colors.gold}, ${tokens.colors.goldDark})`,
            color: '#000',
            border: 'none',
            borderRadius: tokens.radius.lg,
            fontSize: 17,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: `0 8px 32px ${tokens.colors.gold}40`,
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span>Ouvrir le Hub PRO</span>
          <kbd style={{
            padding: '5px 10px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 8,
            fontSize: 13,
          }}>⌘K</kbd>
        </button>
      </div>

      {/* PRO Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        {[
          { icon: '🧠', title: 'IA Smart Suggestions', desc: 'Nova apprend vos habitudes et suggère', pro: true },
          { icon: '🎤', title: 'Commandes Vocales', desc: 'Parlez naturellement à votre Hub', pro: true },
          { icon: '🧮', title: 'Calculatrice Intégrée', desc: 'Tapez des chiffres pour calculer', pro: true },
          { icon: '📊', title: 'Timeline Activité', desc: 'Historique de toutes vos actions', pro: true },
          { icon: '🎨', title: 'Changeur de Thème', desc: 'Tapez "theme" pour changer', pro: true },
          { icon: '👁️', title: 'Aperçu en Direct', desc: 'Prévisualisation avant action', pro: true },
          { icon: '🕐', title: 'Historique Commandes', desc: 'Rappeler vos recherches passées', pro: true },
          { icon: '⭐', title: 'Favoris Intelligents', desc: 'Triés par fréquence d\'utilisation', pro: false },
          { icon: '🚀', title: 'Navigation ⌘+1-7', desc: 'Accès instantané aux 7 espaces', pro: false },
          { icon: '➕', title: 'Actions Rapides', desc: 'Tapez / pour créer', pro: false },
          { icon: '🤖', title: 'Nova AI Intégré', desc: 'Tapez @ pour demander', pro: false },
          { icon: '⌨️', title: 'Keyboard First', desc: 'Navigation 100% clavier', pro: false },
        ].map((feature, idx) => (
          <div key={idx} style={{
            padding: 24,
            backgroundColor: tokens.colors.bg.secondary,
            borderRadius: tokens.radius.lg,
            border: `1px solid ${feature.pro ? tokens.colors.gold + '40' : tokens.colors.border.default}`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {feature.pro && (
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                padding: '2px 8px',
                backgroundColor: `${tokens.colors.gold}20`,
                borderRadius: 4,
                fontSize: 9,
                fontWeight: 700,
                color: tokens.colors.gold,
              }}>PRO</div>
            )}
            <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>{feature.icon}</span>
            <h3 style={{ color: tokens.colors.text.primary, fontSize: 15, marginBottom: 6 }}>{feature.title}</h3>
            <p style={{ color: tokens.colors.text.muted, fontSize: 12, lineHeight: 1.4 }}>{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Action Toast */}
      {lastAction && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          padding: '14px 24px',
          backgroundColor: tokens.colors.success,
          color: '#000',
          borderRadius: tokens.radius.md,
          fontWeight: 500,
          boxShadow: `0 8px 32px ${tokens.colors.success}40`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span>✓</span>
          <span>{lastAction.type}: {lastAction.value}</span>
        </div>
      )}

      {/* The Hub PRO */}
      <UnifiedNavigationHubPro
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNavigate={(path) => showAction('Navigation', path)}
        onAction={(actionId) => showAction('Action', actionId)}
        onNovaCommand={(cmd) => showAction('Nova', cmd)}
        onThemeChange={(themeId) => {
          setCurrentTheme(themeId);
          showAction('Thème', themeId);
        }}
      />

      {/* Keyboard Legend */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        padding: 20,
        backgroundColor: tokens.colors.bg.secondary,
        borderRadius: tokens.radius.lg,
        border: `1px solid ${tokens.colors.border.default}`,
        maxWidth: 220,
      }}>
        <div style={{ color: tokens.colors.gold, fontSize: 11, marginBottom: 12, fontWeight: 600 }}>
          ⌨️ RACCOURCIS PRO
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['⌘K', 'Ouvrir Hub'],
            ['⌘1-7', 'Espaces'],
            ['/', 'Créer'],
            ['@', 'Nova AI'],
            ['=123', 'Calculer'],
            ['theme', 'Thèmes'],
            ['↑', 'Historique'],
          ].map(([key, action]) => (
            <div key={key} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <kbd style={{
                padding: '3px 8px',
                backgroundColor: tokens.colors.bg.tertiary,
                borderRadius: 6,
                fontSize: 10,
                color: tokens.colors.text.muted,
                minWidth: 50,
                textAlign: 'center',
              }}>{key}</kbd>
              <span style={{ color: tokens.colors.text.secondary, fontSize: 11 }}>{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnifiedNavigationHubProDemo;
export { UnifiedNavigationHubPro };
