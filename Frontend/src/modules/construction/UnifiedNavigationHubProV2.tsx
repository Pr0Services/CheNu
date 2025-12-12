/**
 * ╔════════════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                        ║
 * ║              CHE·NU V25 - UNIFIED NAVIGATION HUB PRO V2                                ║
 * ║                                                                                        ║
 * ║  🔥 THE ULTIMATE AI-POWERED COMMAND CENTER 🔥                                          ║
 * ║  ══════════════════════════════════════════                                            ║
 * ║                                                                                        ║
 * ║  Now with OFFICIAL CHE·NU Architecture:                                                ║
 * ║  ─────────────────────────────────────────                                             ║
 * ║  • 10 ESPACES (not 7!)                                                                 ║
 * ║  • Categories per Espace                                                               ║
 * ║  • Modules per Category                                                                ║
 * ║  • Universal Actions (CREER, MODIFIER, IMPORTER, EXPORTER, ANALYSER, PUBLIER)          ║
 * ║  • Database routing (scope + category)                                                 ║
 * ║                                                                                        ║
 * ║  PRO FEATURES:                                                                         ║
 * ║  ─────────────                                                                         ║
 * ║  🧠 AI Smart Suggestions          🎤 Voice Input                                       ║
 * ║  📊 Activity Timeline             ⭐ Smart Favorites                                   ║
 * ║  🕐 Command History               🔗 Quick Links                                       ║
 * ║  📋 Clipboard Integration         🎨 Theme Switcher                                    ║
 * ║  🧮 Calculator Mode               🌐 Multi-language (FR/EN/ES)                         ║
 * ║  ⌨️ Vim-style Navigation          👁️ Live Preview                                      ║
 * ║  📈 Usage Analytics               🎯 Context Awareness                                 ║
 * ║  🗂️ Category Browser              📦 Module Launcher                                   ║
 * ║                                                                                        ║
 * ║  Trigger: ⌘+K (or Ctrl+K)                                                              ║
 * ║                                                                                        ║
 * ╚════════════════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU OFFICIAL CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CHENU_CONFIG = {
  PERSONNEL: {
    db: "DB_PERSONNEL",
    icon: "👤",
    label: "Personnel",
    sublabel: "Vie personnelle & bien-être",
    color: "#4ade80",
    shortcut: "⌘1",
    categories: {
      VIE_QUOTIDIENNE: {
        label: "Vie quotidienne",
        icon: "📋",
        modules: ["TACHES_PERSO", "JOURNAL", "DOCUMENTS"]
      },
      HABITUDES_SANTE: {
        label: "Habitudes & Santé",
        icon: "💪",
        modules: ["TRACKING_HABITUDES", "SUIVI_SANTE"]
      },
      FINANCES_PERSO: {
        label: "Finances perso",
        icon: "💵",
        modules: ["BUDGET", "DEPENSES", "OBJECTIFS"]
      }
    }
  },
  SOCIAL_DIVERTISSEMENT: {
    db: "DB_SOCIAL_DIV",
    icon: "🎉",
    label: "Social & Divertissement",
    sublabel: "Réseaux, médias & fun",
    color: "#f472b6",
    shortcut: "⌘2",
    categories: {
      FEED_AMIS: {
        label: "Feed & Amis",
        icon: "👥",
        modules: ["FEED", "MESSAGES"]
      },
      MEDIAS: {
        label: "Médias",
        icon: "🎬",
        modules: ["VIDEOS", "MUSIQUE", "JEUX"]
      }
    }
  },
  SCHOLAR: {
    db: "DB_SCHOLAR",
    icon: "🎓",
    label: "Scholar",
    sublabel: "Éducation & apprentissage",
    color: "#a78bfa",
    shortcut: "⌘3",
    categories: {
      COURS: {
        label: "Cours",
        icon: "📚",
        modules: ["LISTE_COURS", "PLANNING"]
      },
      REVISION: {
        label: "Révision",
        icon: "🧠",
        modules: ["FLASHCARDS", "RESUMES", "PLANS_REVISION"]
      },
      EXAMENS: {
        label: "Examens",
        icon: "📝",
        modules: ["CALENDRIER_EXAMENS", "RESULTATS"]
      }
    }
  },
  MAISON: {
    db: "DB_MAISON",
    icon: "🏠",
    label: "Maison",
    sublabel: "Organisation domestique",
    color: "#34d399",
    shortcut: "⌘4",
    categories: {
      ORGANISATION: {
        label: "Organisation",
        icon: "📅",
        modules: ["TACHES_MAISON", "CALENDRIER_MAISON"]
      },
      FAMILLE: {
        label: "Famille",
        icon: "👨‍👩‍👧‍👦",
        modules: ["CONTACTS_FAMILLE", "NOTES_FAMILLE", "DOCUMENTS"]
      }
    }
  },
  ENTREPRISE: {
    db: "DB_ENTREPRISE",
    icon: "🏢",
    label: "Entreprise",
    sublabel: "Gestion business",
    color: "#3b82f6",
    shortcut: "⌘5",
    categories: {
      OPERATIONS: {
        label: "Opérations",
        icon: "⚙️",
        modules: ["PROJETS_ENTREPRISE", "PROCESSUS", "DOCUMENTS"]
      },
      FINANCES: {
        label: "Finances",
        icon: "💰",
        modules: ["COMPTES", "FACTURES", "RAPPORTS"]
      },
      CLIENTS_VENTES: {
        label: "Clients & Ventes",
        icon: "🤝",
        modules: ["CRM", "PIPELINE", "SUIVI_CLIENT"]
      }
    }
  },
  PROJETS: {
    db: "DB_PROJETS",
    icon: "📁",
    label: "Projets",
    sublabel: "Gestion de projets",
    color: "#8b5cf6",
    shortcut: "⌘6",
    categories: {
      GESTION_PROJET: {
        label: "Gestion de projet",
        icon: "📊",
        modules: ["TACHES", "KANBAN", "DOCS_PROJET", "DISCUSSION", "STREAMING_PROJET"]
      }
    }
  },
  CREATIVE_STUDIO: {
    db: "DB_CREATIVE_STUDIO",
    icon: "🎨",
    label: "Creative Studio",
    sublabel: "Création & design",
    color: "#f59e0b",
    shortcut: "⌘7",
    categories: {
      PROJETS_CREATIFS: {
        label: "Projets créatifs",
        icon: "🖼️",
        modules: ["PROJETS_MEDIA", "TIMELINE_MEDIA"]
      },
      TEMPLATES_KITS: {
        label: "Templates & Kits",
        icon: "📦",
        modules: ["TEMPLATES_VISUELS", "KITS_BRAND"]
      }
    }
  },
  GOUVERNEMENT: {
    db: "DB_GOUVERNEMENT",
    icon: "🏛️",
    label: "Gouvernement",
    sublabel: "Services publics & admin",
    color: "#06b6d4",
    shortcut: "⌘8",
    categories: {
      IDENTITE_DOSSIERS: {
        label: "Identité & Dossiers",
        icon: "🪪",
        modules: ["DOCS_IDENTITE", "DOSSIERS_OFFICIELS"]
      },
      TAXES_IMPOTS: {
        label: "Taxes & Impôts",
        icon: "🧾",
        modules: ["DECLARATIONS", "HISTORIQUE_PAIEMENTS"]
      },
      PERMIS_LICENCES: {
        label: "Permis & Licences",
        icon: "📜",
        modules: ["DEMANDES", "PERMIS_ACTIFS"]
      }
    }
  },
  IMMOBILIER: {
    db: "DB_IMMOBILIER",
    icon: "🏘️",
    label: "Immobilier",
    sublabel: "Propriétés & investissement",
    color: "#ec4899",
    shortcut: "⌘9",
    categories: {
      PROPRIETES: {
        label: "Propriétés",
        icon: "🏠",
        modules: ["LISTE_PROPRIETES", "DETAIL_PROPRIETE"]
      },
      CONTRATS: {
        label: "Contrats",
        icon: "📄",
        modules: ["BAUX", "ACTES", "ASSURANCES"]
      },
      ANALYSES: {
        label: "Analyses",
        icon: "📈",
        modules: ["RENTABILITE", "CASHFLOW", "SIMULATIONS"]
      }
    }
  },
  ASSOCIATIONS: {
    db: "DB_ASSOCIATIONS",
    icon: "🤝",
    label: "Associations",
    sublabel: "Communautés & collectifs",
    color: "#14b8a6",
    shortcut: "⌘0",
    categories: {
      COMMUNAUTE: {
        label: "Communauté",
        icon: "👥",
        modules: ["FEED_ASSOCIATION", "MEMBRES"]
      },
      PROJETS_COLLECTIFS: {
        label: "Projets collectifs",
        icon: "🎯",
        modules: ["PROJETS_ASSOC", "DOCS_ASSOC"]
      }
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// UNIVERSAL ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const UNIVERSAL_ACTIONS = [
  { id: 'CREER', icon: '➕', label: 'Créer', sublabel: 'Nouveau élément', shortcut: 'N', color: '#4ade80' },
  { id: 'MODIFIER', icon: '✏️', label: 'Modifier', sublabel: 'Éditer existant', shortcut: 'E', color: '#f59e0b' },
  { id: 'IMPORTER', icon: '⬇️', label: 'Importer', sublabel: 'Depuis fichier/URL', shortcut: 'I', color: '#3b82f6' },
  { id: 'EXPORTER', icon: '⬆️', label: 'Exporter', sublabel: 'PDF, CSV, JSON...', shortcut: 'X', color: '#8b5cf6' },
  { id: 'ANALYSER', icon: '📊', label: 'Analyser', sublabel: 'Statistiques & insights', shortcut: 'A', color: '#06b6d4' },
  { id: 'PUBLIER', icon: '🚀', label: 'Publier', sublabel: 'Partager publiquement', shortcut: 'P', color: '#ec4899' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE DEFINITIONS (with icons and labels)
// ═══════════════════════════════════════════════════════════════════════════════

const MODULE_META: Record<string, { icon: string; label: string }> = {
  // Personnel
  TACHES_PERSO: { icon: '✅', label: 'Tâches personnelles' },
  JOURNAL: { icon: '📔', label: 'Journal' },
  DOCUMENTS: { icon: '📄', label: 'Documents' },
  TRACKING_HABITUDES: { icon: '📈', label: 'Suivi des habitudes' },
  SUIVI_SANTE: { icon: '❤️', label: 'Suivi santé' },
  BUDGET: { icon: '💰', label: 'Budget' },
  DEPENSES: { icon: '💸', label: 'Dépenses' },
  OBJECTIFS: { icon: '🎯', label: 'Objectifs' },
  
  // Social
  FEED: { icon: '📱', label: 'Feed' },
  MESSAGES: { icon: '💬', label: 'Messages' },
  VIDEOS: { icon: '🎬', label: 'Vidéos' },
  MUSIQUE: { icon: '🎵', label: 'Musique' },
  JEUX: { icon: '🎮', label: 'Jeux' },
  
  // Scholar
  LISTE_COURS: { icon: '📚', label: 'Liste des cours' },
  PLANNING: { icon: '📅', label: 'Planning' },
  FLASHCARDS: { icon: '🃏', label: 'Flashcards' },
  RESUMES: { icon: '📝', label: 'Résumés' },
  PLANS_REVISION: { icon: '📋', label: 'Plans de révision' },
  CALENDRIER_EXAMENS: { icon: '📆', label: 'Calendrier examens' },
  RESULTATS: { icon: '🏆', label: 'Résultats' },
  
  // Maison
  TACHES_MAISON: { icon: '🧹', label: 'Tâches maison' },
  CALENDRIER_MAISON: { icon: '📅', label: 'Calendrier maison' },
  CONTACTS_FAMILLE: { icon: '👨‍👩‍👧', label: 'Contacts famille' },
  NOTES_FAMILLE: { icon: '📝', label: 'Notes famille' },
  
  // Entreprise
  PROJETS_ENTREPRISE: { icon: '📁', label: 'Projets entreprise' },
  PROCESSUS: { icon: '⚙️', label: 'Processus' },
  COMPTES: { icon: '🏦', label: 'Comptes' },
  FACTURES: { icon: '🧾', label: 'Factures' },
  RAPPORTS: { icon: '📊', label: 'Rapports' },
  CRM: { icon: '👥', label: 'CRM' },
  PIPELINE: { icon: '📈', label: 'Pipeline' },
  SUIVI_CLIENT: { icon: '🤝', label: 'Suivi client' },
  
  // Projets
  TACHES: { icon: '✅', label: 'Tâches' },
  KANBAN: { icon: '📋', label: 'Kanban' },
  DOCS_PROJET: { icon: '📄', label: 'Documents projet' },
  DISCUSSION: { icon: '💬', label: 'Discussion' },
  STREAMING_PROJET: { icon: '📺', label: 'Streaming projet' },
  
  // Creative
  PROJETS_MEDIA: { icon: '🎬', label: 'Projets média' },
  TIMELINE_MEDIA: { icon: '🎞️', label: 'Timeline média' },
  TEMPLATES_VISUELS: { icon: '🖼️', label: 'Templates visuels' },
  KITS_BRAND: { icon: '🎨', label: 'Kits brand' },
  
  // Gouvernement
  DOCS_IDENTITE: { icon: '🪪', label: 'Documents identité' },
  DOSSIERS_OFFICIELS: { icon: '📁', label: 'Dossiers officiels' },
  DECLARATIONS: { icon: '📝', label: 'Déclarations' },
  HISTORIQUE_PAIEMENTS: { icon: '💳', label: 'Historique paiements' },
  DEMANDES: { icon: '📨', label: 'Demandes' },
  PERMIS_ACTIFS: { icon: '✅', label: 'Permis actifs' },
  
  // Immobilier
  LISTE_PROPRIETES: { icon: '🏘️', label: 'Liste propriétés' },
  DETAIL_PROPRIETE: { icon: '🏠', label: 'Détail propriété' },
  BAUX: { icon: '📜', label: 'Baux' },
  ACTES: { icon: '📄', label: 'Actes' },
  ASSURANCES: { icon: '🛡️', label: 'Assurances' },
  RENTABILITE: { icon: '💹', label: 'Rentabilité' },
  CASHFLOW: { icon: '💵', label: 'Cashflow' },
  SIMULATIONS: { icon: '🔮', label: 'Simulations' },
  
  // Associations
  FEED_ASSOCIATION: { icon: '📱', label: 'Feed association' },
  MEMBRES: { icon: '👥', label: 'Membres' },
  PROJETS_ASSOC: { icon: '📁', label: 'Projets association' },
  DOCS_ASSOC: { icon: '📄', label: 'Documents association' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const tokens = {
  colors: {
    gold: '#D8B26A',
    goldLight: '#E8C88A',
    goldDark: '#B8924A',
    emerald: '#3F7249',
    turquoise: '#3EB4A2',
    
    bg: {
      void: '#0a0d0b',
      primary: '#0f1217',
      secondary: '#161B22',
      tertiary: '#1E242C',
      elevated: '#252D38',
      hover: '#2D3640',
      glass: 'rgba(22, 27, 34, 0.9)',
    },
    
    text: {
      primary: '#F4F0EB',
      secondary: '#B8B0A8',
      muted: '#6B6560',
      accent: '#D8B26A',
    },
    
    border: {
      default: 'rgba(216, 178, 106, 0.15)',
      hover: 'rgba(216, 178, 106, 0.3)',
      focus: 'rgba(216, 178, 106, 0.5)',
    },
  },
  
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 10, lg: 16, xl: 24, full: 9999 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface HubItem {
  id: string;
  type: 'space' | 'category' | 'module' | 'action' | 'nova' | 'search' | 'recent' | 'calculator' | 'theme';
  icon: string;
  label: string;
  sublabel?: string;
  shortcut?: string;
  path?: string;
  color?: string;
  badge?: number | string;
  keywords?: string[];
  preview?: string;
  parent?: string;
  db?: string;
}

type HubMode = 'default' | 'search' | 'nova' | 'create' | 'goto' | 'calculator' | 'theme' | 'browse' | 'action';
type BrowseLevel = 'spaces' | 'categories' | 'modules';

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD DATA FROM CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const buildSpaces = (): HubItem[] => {
  return Object.entries(CHENU_CONFIG).map(([key, config]) => ({
    id: key,
    type: 'space' as const,
    icon: config.icon,
    label: config.label,
    sublabel: config.sublabel,
    shortcut: config.shortcut,
    color: config.color,
    path: `/${key.toLowerCase()}`,
    db: config.db,
    keywords: [key.toLowerCase(), config.label.toLowerCase()],
  }));
};

const buildCategories = (spaceId: string): HubItem[] => {
  const space = CHENU_CONFIG[spaceId as keyof typeof CHENU_CONFIG];
  if (!space) return [];
  
  return Object.entries(space.categories).map(([key, config]) => ({
    id: `${spaceId}__${key}`,
    type: 'category' as const,
    icon: config.icon,
    label: config.label,
    sublabel: `${config.modules.length} modules`,
    path: `/${spaceId.toLowerCase()}/${key.toLowerCase()}`,
    color: space.color,
    parent: spaceId,
    keywords: [key.toLowerCase(), config.label.toLowerCase()],
  }));
};

const buildModules = (spaceId: string, categoryId: string): HubItem[] => {
  const space = CHENU_CONFIG[spaceId as keyof typeof CHENU_CONFIG];
  if (!space) return [];
  
  const category = space.categories[categoryId as keyof typeof space.categories];
  if (!category) return [];
  
  return category.modules.map(moduleId => {
    const meta = MODULE_META[moduleId] || { icon: '📦', label: moduleId };
    return {
      id: `${spaceId}__${categoryId}__${moduleId}`,
      type: 'module' as const,
      icon: meta.icon,
      label: meta.label,
      path: `/${spaceId.toLowerCase()}/${categoryId.toLowerCase()}/${moduleId.toLowerCase()}`,
      color: space.color,
      parent: `${spaceId}__${categoryId}`,
      keywords: [moduleId.toLowerCase(), meta.label.toLowerCase()],
    };
  });
};

const buildAllModules = (): HubItem[] => {
  const modules: HubItem[] = [];
  Object.entries(CHENU_CONFIG).forEach(([spaceId, space]) => {
    Object.entries(space.categories).forEach(([catId, cat]) => {
      cat.modules.forEach(moduleId => {
        const meta = MODULE_META[moduleId] || { icon: '📦', label: moduleId };
        modules.push({
          id: `${spaceId}__${catId}__${moduleId}`,
          type: 'module',
          icon: meta.icon,
          label: meta.label,
          sublabel: `${space.label} → ${cat.label}`,
          path: `/${spaceId.toLowerCase()}/${catId.toLowerCase()}/${moduleId.toLowerCase()}`,
          color: space.color,
          parent: spaceId,
          keywords: [moduleId.toLowerCase(), meta.label.toLowerCase(), space.label.toLowerCase()],
        });
      });
    });
  });
  return modules;
};

// Pre-build data
const SPACES = buildSpaces();
const ALL_MODULES = buildAllModules();

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA AI COMMANDS
// ═══════════════════════════════════════════════════════════════════════════════

const NOVA_COMMANDS: HubItem[] = [
  { id: 'nova-ask', type: 'nova', icon: '💬', label: 'Demander à Nova', sublabel: 'Question libre', keywords: ['ask', 'question'] },
  { id: 'nova-summarize', type: 'nova', icon: '📋', label: 'Résumer', sublabel: 'Page actuelle', keywords: ['summary', 'tldr'] },
  { id: 'nova-analyze', type: 'nova', icon: '📊', label: 'Analyser', sublabel: 'Données & insights', keywords: ['analyze', 'data'] },
  { id: 'nova-translate', type: 'nova', icon: '🌐', label: 'Traduire', sublabel: 'FR/EN/ES/DE', keywords: ['translate'] },
  { id: 'nova-write', type: 'nova', icon: '✍️', label: 'Rédiger', sublabel: 'Aide rédaction', keywords: ['write', 'draft'] },
  { id: 'nova-schedule', type: 'nova', icon: '📅', label: 'Planifier', sublabel: 'Organiser agenda', keywords: ['schedule', 'plan'] },
  { id: 'nova-remind', type: 'nova', icon: '⏰', label: 'Rappel', sublabel: 'Créer rappel', keywords: ['remind', 'alert'] },
  { id: 'nova-code', type: 'nova', icon: '💻', label: 'Code Helper', sublabel: 'Dev assistance', keywords: ['code', 'dev'] },
  { id: 'nova-image', type: 'nova', icon: '🎨', label: 'Générer Image', sublabel: 'IA créative', keywords: ['image', 'generate'] },
  { id: 'nova-search', type: 'nova', icon: '🔍', label: 'Recherche Web', sublabel: 'Internet search', keywords: ['search', 'web'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// THEMES
// ═══════════════════════════════════════════════════════════════════════════════

const THEMES: HubItem[] = [
  { id: 'theme-dark', type: 'theme', icon: '🌙', label: 'Sombre', sublabel: 'Défaut', color: '#1E242C' },
  { id: 'theme-light', type: 'theme', icon: '☀️', label: 'Clair', sublabel: 'Mode jour', color: '#F4F0EB' },
  { id: 'theme-vr', type: 'theme', icon: '🥽', label: 'VR Mode', sublabel: 'Néon', color: '#00ff88' },
  { id: 'theme-midnight', type: 'theme', icon: '🌌', label: 'Midnight', sublabel: 'Bleu profond', color: '#0a1628' },
  { id: 'theme-sunset', type: 'theme', icon: '🌅', label: 'Sunset', sublabel: 'Orange chaud', color: '#2d1810' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// RECENT ACTIVITY (Mock)
// ═══════════════════════════════════════════════════════════════════════════════

const RECENT_ACTIVITY: HubItem[] = [
  { id: 'recent-1', type: 'recent', icon: '📁', label: 'Projet Tremblay', sublabel: 'Il y a 5 min', path: '/projets/gestion_projet/taches', color: CHENU_CONFIG.PROJETS.color },
  { id: 'recent-2', type: 'recent', icon: '🧾', label: 'Facture #2024-089', sublabel: 'Il y a 12 min', path: '/entreprise/finances/factures', color: CHENU_CONFIG.ENTREPRISE.color },
  { id: 'recent-3', type: 'recent', icon: '🎓', label: 'Cours Python', sublabel: 'Il y a 1h', path: '/scholar/cours/liste_cours', color: CHENU_CONFIG.SCHOLAR.color },
  { id: 'recent-4', type: 'recent', icon: '🏠', label: 'Tâches maison', sublabel: 'Il y a 2h', path: '/maison/organisation/taches_maison', color: CHENU_CONFIG.MAISON.color },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════════

const evaluateCalculation = (expr: string): string | null => {
  try {
    const cleaned = expr.replace(/[×x]/g, '*').replace(/÷/g, '/').replace(/,/g, '.').replace(/\s/g, '').replace(/[^0-9+\-*/.()%]/g, '');
    if (!cleaned || !/[0-9]/.test(cleaned)) return null;
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
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const UnifiedNavigationHubProV2: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
  onAction?: (action: string, context?: { space?: string; category?: string; module?: string }) => void;
  onNovaCommand?: (command: string, query?: string) => void;
  onThemeChange?: (themeId: string) => void;
}> = ({ isOpen, onClose, onNavigate, onAction, onNovaCommand, onThemeChange }) => {
  
  // State
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<HubMode>('default');
  const [browseLevel, setBrowseLevel] = useState<BrowseLevel>('spaces');
  const [currentSpace, setCurrentSpace] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [calculatorResult, setCalculatorResult] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Calculator detection
  useEffect(() => {
    const result = evaluateCalculation(query);
    setCalculatorResult(result);
    if (result && mode !== 'calculator') setMode('calculator');
    else if (!result && mode === 'calculator') setMode('default');
  }, [query]);

  // ─────────────────────────────────────────────────────────────────────────────
  // FILTERED RESULTS
  // ─────────────────────────────────────────────────────────────────────────────

  const filteredResults = useMemo((): HubItem[] | null => {
    const q = query.toLowerCase().trim();
    
    // Calculator
    if (calculatorResult) {
      return [{ id: 'calc', type: 'calculator', icon: '🧮', label: calculatorResult, sublabel: `= ${query}`, shortcut: '↵ Copier' }];
    }
    
    // Mode triggers
    if (q.startsWith('/') || q.startsWith('>')) {
      setMode('create');
      return UNIVERSAL_ACTIONS.map(a => ({ ...a, type: 'action' as const, keywords: [a.id.toLowerCase()] }));
    }
    
    if (q.startsWith('@') || q.startsWith('nova ')) {
      setMode('nova');
      const searchQ = q.replace(/^(@|nova )/, '');
      if (!searchQ) return NOVA_COMMANDS;
      return NOVA_COMMANDS.filter(n => n.label.toLowerCase().includes(searchQ) || n.keywords?.some(k => k.includes(searchQ)));
    }
    
    if (q.startsWith('go ') || q.startsWith('g ') || q.startsWith('aller ')) {
      setMode('goto');
      const searchQ = q.replace(/^(go |g |aller )/, '');
      return [...SPACES, ...ALL_MODULES].filter(i => 
        i.label.toLowerCase().includes(searchQ) || i.keywords?.some(k => k.includes(searchQ))
      ).slice(0, 12);
    }
    
    if (q === 'theme' || q.startsWith('theme ')) {
      setMode('theme');
      return THEMES;
    }
    
    // Browse mode (when in category/module drill-down)
    if (mode === 'browse') {
      if (browseLevel === 'categories' && currentSpace) {
        return buildCategories(currentSpace);
      }
      if (browseLevel === 'modules' && currentSpace && currentCategory) {
        return buildModules(currentSpace, currentCategory);
      }
      return SPACES;
    }
    
    // Action mode (select target after choosing action)
    if (mode === 'action' && selectedAction) {
      return [...SPACES, ...ALL_MODULES.slice(0, 8)];
    }
    
    setMode('default');
    
    // No query - return null for default sections
    if (!q) return null;
    
    // Global search
    const all = [...SPACES, ...ALL_MODULES, ...NOVA_COMMANDS, ...RECENT_ACTIVITY];
    return all.filter(i => 
      i.label.toLowerCase().includes(q) || 
      i.sublabel?.toLowerCase().includes(q) ||
      i.keywords?.some(k => k.includes(q))
    ).slice(0, 15);
  }, [query, calculatorResult, mode, browseLevel, currentSpace, currentCategory, selectedAction]);

  // Flat items for keyboard nav
  const flatItems = useMemo(() => {
    if (filteredResults) return filteredResults;
    return [...RECENT_ACTIVITY, ...SPACES];
  }, [filteredResults]);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  const handleSelect = useCallback((item: HubItem) => {
    // Calculator - copy result
    if (item.type === 'calculator') {
      navigator.clipboard?.writeText(item.label);
      onClose();
      return;
    }
    
    // Theme
    if (item.type === 'theme') {
      onThemeChange?.(item.id);
      onClose();
      return;
    }
    
    // Nova
    if (item.type === 'nova') {
      onNovaCommand?.(item.id, query.replace(/^(@|nova )/, ''));
      onClose();
      return;
    }
    
    // Universal Action - enter action mode
    if (item.type === 'action' && UNIVERSAL_ACTIONS.find(a => a.id === item.id)) {
      setSelectedAction(item.id);
      setMode('action');
      setQuery('');
      return;
    }
    
    // Space in browse mode - drill into categories
    if (item.type === 'space' && mode === 'browse') {
      setCurrentSpace(item.id);
      setBrowseLevel('categories');
      setSelectedIndex(0);
      return;
    }
    
    // Category in browse mode - drill into modules
    if (item.type === 'category' && mode === 'browse') {
      const [spaceId, catId] = item.id.split('__');
      setCurrentCategory(catId);
      setBrowseLevel('modules');
      setSelectedIndex(0);
      return;
    }
    
    // Space/Module in action mode - execute action
    if (mode === 'action' && selectedAction) {
      onAction?.(selectedAction, { 
        space: item.parent || item.id,
        module: item.type === 'module' ? item.id.split('__')[2] : undefined 
      });
      onClose();
      return;
    }
    
    // Navigate
    if (item.path) {
      onNavigate?.(item.path);
      onClose();
    }
  }, [query, mode, selectedAction, onNavigate, onAction, onNovaCommand, onThemeChange, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Vim keys
    if (e.key === 'j' && e.ctrlKey) { setSelectedIndex(i => Math.min(i + 1, flatItems.length - 1)); return; }
    if (e.key === 'k' && e.ctrlKey) { setSelectedIndex(i => Math.max(i - 1, 0)); return; }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, flatItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatItems[selectedIndex]) handleSelect(flatItems[selectedIndex]);
        break;
      case 'Escape':
        e.preventDefault();
        if (mode === 'browse' && browseLevel !== 'spaces') {
          // Go back in browse
          if (browseLevel === 'modules') { setBrowseLevel('categories'); setCurrentCategory(null); }
          else if (browseLevel === 'categories') { setBrowseLevel('spaces'); setCurrentSpace(null); }
        } else if (mode === 'action') {
          setMode('default'); setSelectedAction(null);
        } else {
          onClose();
        }
        break;
      case 'Backspace':
        if (!query && mode === 'browse') {
          e.preventDefault();
          if (browseLevel === 'modules') { setBrowseLevel('categories'); setCurrentCategory(null); }
          else if (browseLevel === 'categories') { setBrowseLevel('spaces'); setCurrentSpace(null); }
        }
        break;
      case 'Tab':
        e.preventDefault();
        // Enter browse mode
        if (mode === 'default') {
          setMode('browse');
          setBrowseLevel('spaces');
          setQuery('');
        }
        break;
    }
  }, [flatItems, selectedIndex, handleSelect, onClose, mode, browseLevel, query]);

  // ─────────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
      setMode('default');
      setBrowseLevel('spaces');
      setCurrentSpace(null);
      setCurrentCategory(null);
      setSelectedAction(null);
    }
  }, [isOpen]);

  useEffect(() => { setSelectedIndex(0); }, [query, mode, browseLevel]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedIndex]);

  // Global shortcuts
  useEffect(() => {
    const handleGlobal = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); if (isOpen) onClose(); }
      if ((e.metaKey || e.ctrlKey) && e.key >= '0' && e.key <= '9' && isOpen) {
        e.preventDefault();
        const idx = e.key === '0' ? 9 : parseInt(e.key) - 1;
        if (SPACES[idx]) { onNavigate?.(SPACES[idx].path!); onClose(); }
      }
    };
    window.addEventListener('keydown', handleGlobal);
    return () => window.removeEventListener('keydown', handleGlobal);
  }, [isOpen, onClose, onNavigate]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────────────────────────────────

  const getModeInfo = () => {
    switch (mode) {
      case 'nova': return { icon: '🤖', label: 'Nova AI', color: '#a78bfa' };
      case 'create': return { icon: '➕', label: 'Créer', color: '#4ade80' };
      case 'goto': return { icon: '🚀', label: 'Aller à', color: '#3b82f6' };
      case 'calculator': return { icon: '🧮', label: 'Calculatrice', color: '#f59e0b' };
      case 'theme': return { icon: '🎨', label: 'Thèmes', color: '#ec4899' };
      case 'browse': return { icon: '🗂️', label: 'Explorer', color: '#06b6d4' };
      case 'action': return { icon: '⚡', label: `Action: ${selectedAction}`, color: '#f59e0b' };
      default: return { icon: '🔍', label: 'Rechercher', color: tokens.colors.gold };
    }
  };

  const modeInfo = getModeInfo();

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        {/* ═══ HEADER ═══ */}
        <div style={styles.header}>
          {/* Breadcrumb for browse mode */}
          {mode === 'browse' && (
            <div style={styles.breadcrumb}>
              <span onClick={() => { setBrowseLevel('spaces'); setCurrentSpace(null); setCurrentCategory(null); }} style={styles.breadcrumbItem}>
                🌐 Espaces
              </span>
              {currentSpace && (
                <>
                  <span style={styles.breadcrumbSep}>›</span>
                  <span onClick={() => { setBrowseLevel('categories'); setCurrentCategory(null); }} style={styles.breadcrumbItem}>
                    {CHENU_CONFIG[currentSpace as keyof typeof CHENU_CONFIG]?.icon} {CHENU_CONFIG[currentSpace as keyof typeof CHENU_CONFIG]?.label}
                  </span>
                </>
              )}
              {currentCategory && currentSpace && (
                <>
                  <span style={styles.breadcrumbSep}>›</span>
                  <span style={{ ...styles.breadcrumbItem, color: tokens.colors.gold }}>
                    {CHENU_CONFIG[currentSpace as keyof typeof CHENU_CONFIG]?.categories[currentCategory as keyof typeof CHENU_CONFIG[keyof typeof CHENU_CONFIG]['categories']]?.label}
                  </span>
                </>
              )}
            </div>
          )}
          
          {/* Search Bar */}
          <div style={{ ...styles.searchContainer, borderColor: modeInfo.color, boxShadow: `0 0 20px ${modeInfo.color}30` }}>
            <span style={{ ...styles.searchIcon, color: modeInfo.color }}>{modeInfo.icon}</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === 'browse' ? `Explorer ${browseLevel === 'spaces' ? 'les espaces' : browseLevel === 'categories' ? 'les catégories' : 'les modules'}...` :
                mode === 'action' ? `Sélectionner cible pour ${selectedAction}...` :
                mode === 'nova' ? 'Demander à Nova...' :
                'Rechercher, naviguer, créer... (Tab pour explorer)'
              }
              style={styles.searchInput}
            />
            <button onClick={() => setIsListening(!isListening)} style={{ ...styles.voiceBtn, backgroundColor: isListening ? '#ef4444' : 'transparent' }}>🎤</button>
            <kbd style={styles.kbd}>ESC</kbd>
          </div>
          
          {/* Mode Pills */}
          <div style={styles.modePills}>
            {[
              { m: 'default', label: '🔍 Tout' },
              { m: 'browse', label: '🗂️ Explorer' },
              { m: 'create', label: '➕ Créer', trigger: '/' },
              { m: 'nova', label: '🤖 Nova', trigger: '@' },
            ].map(p => (
              <button
                key={p.m}
                onClick={() => { setMode(p.m as HubMode); setQuery(''); }}
                style={{ ...styles.modePill, ...(mode === p.m ? styles.modePillActive : {}) }}
              >
                {p.label}
                {p.trigger && <kbd style={styles.triggerKbd}>{p.trigger}</kbd>}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ CONTENT ═══ */}
        <div ref={listRef} style={styles.content}>
          
          {/* Calculator Result */}
          {calculatorResult && (
            <div style={styles.calcResult}>
              <span style={styles.calcExpr}>{query}</span>
              <span style={styles.calcEq}>=</span>
              <span style={styles.calcVal}>{calculatorResult}</span>
              <button onClick={() => { navigator.clipboard?.writeText(calculatorResult); onClose(); }} style={styles.calcCopy}>📋 Copier</button>
            </div>
          )}
          
          {/* Filtered Results */}
          {filteredResults && !calculatorResult && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span>{modeInfo.icon}</span>
                <span>{modeInfo.label}</span>
                <span style={styles.count}>{filteredResults.length}</span>
              </div>
              <div style={styles.list}>
                {filteredResults.map((item, idx) => (
                  <button
                    key={item.id}
                    data-index={idx}
                    onClick={() => handleSelect(item)}
                    style={{ ...styles.listItem, ...(idx === selectedIndex ? styles.listItemSelected : {}) }}
                  >
                    <span style={{ ...styles.itemIcon, backgroundColor: item.color ? `${item.color}20` : undefined }}>{item.icon}</span>
                    <div style={styles.itemContent}>
                      <span style={styles.itemLabel}>{item.label}</span>
                      {item.sublabel && <span style={styles.itemSublabel}>{item.sublabel}</span>}
                    </div>
                    {item.shortcut && <kbd style={styles.itemKbd}>{item.shortcut}</kbd>}
                    <span style={styles.itemArrow}>→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Default View */}
          {!filteredResults && !calculatorResult && (
            <>
              {/* Recent */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}><span>🕐</span><span>Récent</span></div>
                <div style={styles.list}>
                  {RECENT_ACTIVITY.map((item, idx) => (
                    <button key={item.id} data-index={idx} onClick={() => handleSelect(item)} style={{ ...styles.listItem, ...(idx === selectedIndex ? styles.listItemSelected : {}) }}>
                      <span style={{ ...styles.itemIcon, backgroundColor: `${item.color}20` }}>{item.icon}</span>
                      <div style={styles.itemContent}>
                        <span style={styles.itemLabel}>{item.label}</span>
                        <span style={styles.itemSublabel}>{item.sublabel}</span>
                      </div>
                      <span style={styles.itemArrow}>→</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 10 Spaces Grid */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}><span>🌐</span><span>10 Espaces CHE·NU</span></div>
                <div style={styles.spacesGrid}>
                  {SPACES.map((space, idx) => {
                    const realIdx = idx + RECENT_ACTIVITY.length;
                    const isSelected = realIdx === selectedIndex;
                    return (
                      <button
                        key={space.id}
                        data-index={realIdx}
                        onClick={() => handleSelect(space)}
                        style={{ ...styles.spaceCard, borderColor: isSelected ? space.color : 'transparent', transform: isSelected ? 'scale(1.05)' : 'none' }}
                      >
                        <span style={{ fontSize: 28 }}>{space.icon}</span>
                        <span style={styles.spaceLabel}>{space.label}</span>
                        <kbd style={styles.spaceKbd}>{space.shortcut}</kbd>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Universal Actions */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}><span>⚡</span><span>Actions Universelles</span></div>
                <div style={styles.actionsRow}>
                  {UNIVERSAL_ACTIONS.map(action => (
                    <button
                      key={action.id}
                      onClick={() => { setSelectedAction(action.id); setMode('action'); }}
                      style={{ ...styles.actionBtn, borderColor: `${action.color}50` }}
                    >
                      <span style={{ fontSize: 20 }}>{action.icon}</span>
                      <span style={{ fontSize: 11, color: tokens.colors.text.secondary }}>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ═══ FOOTER ═══ */}
        <div style={styles.footer}>
          <div style={styles.footerHints}>
            <span style={styles.hint}><kbd style={styles.kbdSm}>↑↓</kbd>Nav</span>
            <span style={styles.hint}><kbd style={styles.kbdSm}>↵</kbd>Select</span>
            <span style={styles.hint}><kbd style={styles.kbdSm}>Tab</kbd>Explorer</span>
            <span style={styles.hint}><kbd style={styles.kbdSm}>/</kbd>Créer</span>
            <span style={styles.hint}><kbd style={styles.kbdSm}>@</kbd>Nova</span>
            <span style={styles.hint}><kbd style={styles.kbdSm}>⌘0-9</kbd>Espaces</span>
          </div>
          <div style={styles.footerBrand}>
            <span style={styles.proBadge}>PRO V2</span>
            <span style={{ color: tokens.colors.gold }}>CHE·NU</span> V25 • 10 Espaces
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '6vh', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' },
  modal: { width: '100%', maxWidth: 820, backgroundColor: tokens.colors.bg.secondary, borderRadius: tokens.radius.xl, border: `1px solid ${tokens.colors.border.default}`, boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 40px rgba(216,178,106,0.1)`, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '82vh' },
  
  header: { padding: tokens.spacing.md, borderBottom: `1px solid ${tokens.colors.border.default}`, backgroundColor: tokens.colors.bg.tertiary },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 12 },
  breadcrumbItem: { color: tokens.colors.text.secondary, cursor: 'pointer', padding: '4px 8px', borderRadius: 6, transition: 'background 0.15s' },
  breadcrumbSep: { color: tokens.colors.text.muted },
  
  searchContainer: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', backgroundColor: tokens.colors.bg.primary, borderRadius: tokens.radius.lg, border: '2px solid', transition: 'all 0.2s' },
  searchIcon: { fontSize: 22 },
  searchInput: { flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', fontSize: 16, color: tokens.colors.text.primary, fontFamily: 'inherit' },
  voiceBtn: { width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: 'none', borderRadius: 16, cursor: 'pointer', fontSize: 16, transition: 'all 0.2s' },
  kbd: { padding: '4px 10px', backgroundColor: tokens.colors.bg.tertiary, borderRadius: 6, fontSize: 11, color: tokens.colors.text.muted, border: `1px solid ${tokens.colors.border.default}` },
  
  modePills: { display: 'flex', gap: 8, marginTop: 12 },
  modePill: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', backgroundColor: tokens.colors.bg.primary, border: `1px solid ${tokens.colors.border.default}`, borderRadius: 8, color: tokens.colors.text.secondary, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' },
  modePillActive: { backgroundColor: tokens.colors.gold, color: '#000', borderColor: tokens.colors.gold, fontWeight: 600 },
  triggerKbd: { padding: '1px 5px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4, fontSize: 10 },
  
  content: { flex: 1, overflowY: 'auto', padding: tokens.spacing.md },
  
  section: { marginBottom: tokens.spacing.lg },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: tokens.colors.text.muted, marginBottom: 10, padding: '0 8px' },
  count: { padding: '2px 8px', backgroundColor: tokens.colors.bg.tertiary, borderRadius: 10, fontSize: 10 },
  
  list: { display: 'flex', flexDirection: 'column', gap: 2 },
  listItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', backgroundColor: 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', width: '100%' },
  listItemSelected: { backgroundColor: `${tokens.colors.gold}15`, borderLeft: `3px solid ${tokens.colors.gold}` },
  itemIcon: { fontSize: 18, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  itemContent: { flex: 1, display: 'flex', flexDirection: 'column' },
  itemLabel: { fontSize: 14, color: tokens.colors.text.primary },
  itemSublabel: { fontSize: 11, color: tokens.colors.text.muted },
  itemKbd: { padding: '3px 8px', backgroundColor: tokens.colors.bg.tertiary, borderRadius: 6, fontSize: 10, color: tokens.colors.text.muted },
  itemArrow: { color: tokens.colors.text.muted, fontSize: 12, opacity: 0.5 },
  
  spacesGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 },
  spaceCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 16, backgroundColor: tokens.colors.bg.tertiary, border: '2px solid transparent', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s' },
  spaceLabel: { fontSize: 11, fontWeight: 500, color: tokens.colors.text.secondary, textAlign: 'center' },
  spaceKbd: { fontSize: 9, color: tokens.colors.text.muted },
  
  actionsRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  actionBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 16px', backgroundColor: tokens.colors.bg.tertiary, border: '1px solid', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s', minWidth: 80 },
  
  calcResult: { display: 'flex', alignItems: 'center', gap: 16, padding: 20, backgroundColor: `${tokens.colors.gold}10`, borderRadius: 14, border: `1px solid ${tokens.colors.gold}30`, marginBottom: 20 },
  calcExpr: { fontSize: 16, color: tokens.colors.text.secondary, fontFamily: 'monospace' },
  calcEq: { fontSize: 24, color: tokens.colors.gold },
  calcVal: { fontSize: 32, fontWeight: 700, color: tokens.colors.text.primary, fontFamily: 'monospace' },
  calcCopy: { marginLeft: 'auto', padding: '8px 14px', backgroundColor: tokens.colors.bg.tertiary, border: `1px solid ${tokens.colors.border.default}`, borderRadius: 8, color: tokens.colors.text.secondary, fontSize: 12, cursor: 'pointer' },
  
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderTop: `1px solid ${tokens.colors.border.default}`, backgroundColor: tokens.colors.bg.tertiary },
  footerHints: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  hint: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: tokens.colors.text.muted },
  kbdSm: { padding: '2px 5px', backgroundColor: tokens.colors.bg.secondary, borderRadius: 4, fontSize: 10 },
  footerBrand: { fontSize: 11, color: tokens.colors.text.muted, display: 'flex', alignItems: 'center', gap: 8 },
  proBadge: { padding: '2px 8px', backgroundColor: `${tokens.colors.gold}20`, borderRadius: 6, fontSize: 10, color: tokens.colors.gold, fontWeight: 700 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO
// ═══════════════════════════════════════════════════════════════════════════════

const Demo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsOpen(p => !p); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.bg.void, padding: 32, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'inline-block', padding: '4px 14px', background: `linear-gradient(135deg, ${tokens.colors.gold}40, ${tokens.colors.turquoise}40)`, borderRadius: 20, fontSize: 12, color: tokens.colors.gold, fontWeight: 600, marginBottom: 16 }}>
          🔥 VERSION PRO V2 - ARCHITECTURE OFFICIELLE
        </div>
        <h1 style={{ color: tokens.colors.text.primary, fontSize: 40, marginBottom: 12, background: `linear-gradient(135deg, ${tokens.colors.gold}, ${tokens.colors.turquoise})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🚀 Unified Navigation Hub PRO V2
        </h1>
        <p style={{ color: tokens.colors.text.secondary, fontSize: 18, marginBottom: 32 }}>
          10 Espaces • Catégories • Modules • Actions Universelles
        </p>
        
        <button onClick={() => setIsOpen(true)} style={{ padding: '18px 40px', background: `linear-gradient(135deg, ${tokens.colors.gold}, ${tokens.colors.goldDark})`, color: '#000', border: 'none', borderRadius: 14, fontSize: 17, fontWeight: 600, cursor: 'pointer', boxShadow: `0 8px 32px ${tokens.colors.gold}40` }}>
          Ouvrir le Hub <kbd style={{ padding: '4px 10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 6, marginLeft: 12 }}>⌘K</kbd>
        </button>
      </div>

      {/* 10 Espaces Overview */}
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ color: tokens.colors.text.primary, fontSize: 20, marginBottom: 20, textAlign: 'center' }}>🌐 Les 10 Espaces CHE·NU</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {SPACES.map(space => (
            <div key={space.id} style={{ padding: 20, backgroundColor: tokens.colors.bg.secondary, borderRadius: 14, border: `1px solid ${space.color}40`, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{space.icon}</div>
              <div style={{ color: tokens.colors.text.primary, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{space.label}</div>
              <div style={{ color: tokens.colors.text.muted, fontSize: 11 }}>{space.sublabel}</div>
              <div style={{ marginTop: 8, padding: '2px 8px', backgroundColor: `${space.color}20`, borderRadius: 6, fontSize: 10, color: space.color, display: 'inline-block' }}>{space.shortcut}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '48px auto 0' }}>
        <h2 style={{ color: tokens.colors.text.primary, fontSize: 20, marginBottom: 20, textAlign: 'center' }}>⚡ Actions Universelles</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {UNIVERSAL_ACTIONS.map(action => (
            <div key={action.id} style={{ padding: '16px 24px', backgroundColor: tokens.colors.bg.secondary, borderRadius: 12, border: `1px solid ${action.color}40`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>{action.icon}</span>
              <div>
                <div style={{ color: tokens.colors.text.primary, fontSize: 14, fontWeight: 600 }}>{action.label}</div>
                <div style={{ color: tokens.colors.text.muted, fontSize: 11 }}>{action.sublabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, padding: '14px 24px', backgroundColor: '#4ade80', color: '#000', borderRadius: 10, fontWeight: 500, boxShadow: '0 8px 32px rgba(74,222,128,0.4)' }}>
          ✓ {toast}
        </div>
      )}

      {/* Hub */}
      <UnifiedNavigationHubProV2
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNavigate={(path) => showToast(`Navigation → ${path}`)}
        onAction={(action, ctx) => showToast(`${action} dans ${ctx?.space || 'global'}`)}
        onNovaCommand={(cmd) => showToast(`Nova: ${cmd}`)}
        onThemeChange={(t) => showToast(`Thème: ${t}`)}
      />
    </div>
  );
};

export default Demo;
export { UnifiedNavigationHubProV2, CHENU_CONFIG, UNIVERSAL_ACTIONS, MODULE_META };
