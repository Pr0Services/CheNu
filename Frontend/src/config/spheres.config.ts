// =============================================================================
// CHE·NU — CANONICAL SPHERE CONFIGURATION
// Foundation Freeze V1
// =============================================================================
// Cette configuration est la SOURCE DE VÉRITÉ pour toutes les sphères.
// NE PAS MODIFIER sans procédure d'unfreeze.
// =============================================================================

import { SphereConfig, SphereId } from '../types';

// -----------------------------------------------------------------------------
// 1️⃣ SPHERE — PERSONAL (Personnel)
// -----------------------------------------------------------------------------

export const SPHERE_PERSONAL: SphereConfig = {
  id: 'personal',
  label: 'Personal',
  labelFr: 'Personnel',
  emoji: '👤',
  color: '#6366F1',           // Indigo
  colorSecondary: '#818CF8',
  description: 'Private life, health, family, personal identity',
  descriptionFr: 'Vie privée, santé, famille, identité personnelle',
  
  orbitLevel: 1,              // Plus proche du centre
  defaultAngle: 0,
  baseSize: 1,
  importance: 0.9,
  
  isolationLevel: 'maximum',
  privacyLevel: 'highest',
  
  categories: [
    {
      id: 'health',
      label: 'Health & Wellness',
      labelFr: 'Santé & Bien-être',
      emoji: '❤️',
      dataTypes: ['medical_records', 'fitness', 'wellness', 'sleep']
    },
    {
      id: 'family',
      label: 'Family & Relationships',
      labelFr: 'Famille & Relations',
      emoji: '👨‍👩‍👧‍👦',
      dataTypes: ['family_members', 'events', 'communications']
    },
    {
      id: 'finance-personal',
      label: 'Personal Finance',
      labelFr: 'Finances Personnelles',
      emoji: '💰',
      dataTypes: ['accounts', 'budget', 'investments', 'taxes']
    },
    {
      id: 'identity',
      label: 'Identity & Documents',
      labelFr: 'Identité & Documents',
      emoji: '🪪',
      dataTypes: ['legal_docs', 'credentials', 'emergency_contacts']
    },
    {
      id: 'journal',
      label: 'Journal & Notes',
      labelFr: 'Journal & Notes',
      emoji: '📔',
      dataTypes: ['entries', 'reflections', 'goals']
    }
  ],
  
  directorAgentId: 'dir-personal',
  managerAgentIds: ['mgr-personal-health', 'mgr-personal-finance', 'mgr-personal-docs', 'mgr-personal-journal']
};

// -----------------------------------------------------------------------------
// 2️⃣ SPHERE — BUSINESS (Affaires)
// -----------------------------------------------------------------------------

export const SPHERE_BUSINESS: SphereConfig = {
  id: 'business',
  label: 'Business',
  labelFr: 'Affaires',
  emoji: '💼',
  color: '#10B981',           // Emerald
  colorSecondary: '#34D399',
  description: 'Professional work, projects, clients, operations',
  descriptionFr: 'Travail professionnel, projets, clients, opérations',
  
  orbitLevel: 2,
  defaultAngle: Math.PI * 0.2,
  baseSize: 1.2,
  importance: 0.95,
  
  isolationLevel: 'standard',
  privacyLevel: 'high',
  
  categories: [
    {
      id: 'projects',
      label: 'Projects',
      labelFr: 'Projets',
      emoji: '📋',
      dataTypes: ['project_data', 'milestones', 'deliverables']
    },
    {
      id: 'clients',
      label: 'Clients & CRM',
      labelFr: 'Clients & CRM',
      emoji: '🤝',
      dataTypes: ['client_profiles', 'contacts', 'communications']
    },
    {
      id: 'contracts',
      label: 'Contracts',
      labelFr: 'Contrats',
      emoji: '📝',
      dataTypes: ['contracts', 'agreements', 'terms']
    },
    {
      id: 'finance-business',
      label: 'Finance & Billing',
      labelFr: 'Finances & Facturation',
      emoji: '💵',
      dataTypes: ['invoices', 'expenses', 'budgets', 'reports']
    },
    {
      id: 'compliance',
      label: 'Compliance',
      labelFr: 'Conformité',
      emoji: '✅',
      dataTypes: ['rbq', 'cnesst', 'ccq', 'permits']
    },
    {
      id: 'operations',
      label: 'Operations',
      labelFr: 'Opérations',
      emoji: '⚙️',
      dataTypes: ['schedule', 'resources', 'inventory', 'equipment']
    }
  ],
  
  directorAgentId: 'dir-business',
  managerAgentIds: ['mgr-business-project', 'mgr-business-client', 'mgr-business-finance', 'mgr-business-compliance', 'mgr-business-ops']
};

// -----------------------------------------------------------------------------
// 3️⃣ SPHERE — SCHOLAR (Savoir)
// -----------------------------------------------------------------------------

export const SPHERE_SCHOLAR: SphereConfig = {
  id: 'scholar',
  label: 'Scholar',
  labelFr: 'Savoir',
  emoji: '📚',
  color: '#F59E0B',           // Amber
  colorSecondary: '#FBBF24',
  description: 'Learning, research, knowledge management',
  descriptionFr: 'Apprentissage, recherche, gestion des connaissances',
  
  orbitLevel: 2,
  defaultAngle: Math.PI * 0.4,
  baseSize: 1,
  importance: 0.8,
  
  isolationLevel: 'standard',
  privacyLevel: 'medium',
  
  categories: [
    {
      id: 'research',
      label: 'Research',
      labelFr: 'Recherche',
      emoji: '🔍',
      dataTypes: ['projects', 'data', 'analysis', 'results']
    },
    {
      id: 'learning',
      label: 'Learning',
      labelFr: 'Apprentissage',
      emoji: '🎓',
      dataTypes: ['courses', 'certifications', 'progress']
    },
    {
      id: 'library',
      label: 'Knowledge Base',
      labelFr: 'Base de Connaissances',
      emoji: '📖',
      dataTypes: ['references', 'bookmarks', 'notes', 'citations']
    },
    {
      id: 'publications',
      label: 'Publications',
      labelFr: 'Publications',
      emoji: '📰',
      dataTypes: ['drafts', 'published', 'presentations']
    }
  ],
  
  directorAgentId: 'dir-scholar',
  managerAgentIds: ['mgr-scholar-research', 'mgr-scholar-learning', 'mgr-scholar-library', 'mgr-scholar-publish']
};

// -----------------------------------------------------------------------------
// 4️⃣ SPHERE — CREATIVE STUDIO (Studio Créatif)
// -----------------------------------------------------------------------------

export const SPHERE_CREATIVE_STUDIO: SphereConfig = {
  id: 'creative-studio',
  label: 'Creative Studio',
  labelFr: 'Studio Créatif',
  emoji: '🎨',
  color: '#EC4899',           // Pink
  colorSecondary: '#F472B6',
  description: 'Art, design, content creation, multimedia',
  descriptionFr: 'Art, design, création de contenu, multimédia',
  
  orbitLevel: 3,
  defaultAngle: Math.PI * 0.6,
  baseSize: 1.1,
  importance: 0.75,
  
  isolationLevel: 'standard',
  privacyLevel: 'medium',
  
  categories: [
    {
      id: 'visual',
      label: 'Visual',
      labelFr: 'Visuel',
      emoji: '🖼️',
      dataTypes: ['graphics', 'photos', 'videos', 'animations']
    },
    {
      id: 'writing',
      label: 'Writing',
      labelFr: 'Écriture',
      emoji: '✍️',
      dataTypes: ['creative', 'copy', 'scripts']
    },
    {
      id: 'audio',
      label: 'Audio',
      labelFr: 'Audio',
      emoji: '🎵',
      dataTypes: ['music', 'podcasts', 'sound_design']
    },
    {
      id: 'assets',
      label: 'Asset Library',
      labelFr: 'Bibliothèque d\'Assets',
      emoji: '📁',
      dataTypes: ['templates', 'stock', 'brand']
    }
  ],
  
  directorAgentId: 'dir-creative',
  managerAgentIds: ['mgr-creative-visual', 'mgr-creative-content', 'mgr-creative-audio', 'mgr-creative-asset']
};

// -----------------------------------------------------------------------------
// 5️⃣ SPHERE — SOCIAL MEDIA (Médias Sociaux)
// -----------------------------------------------------------------------------

export const SPHERE_SOCIAL_MEDIA: SphereConfig = {
  id: 'social-media',
  label: 'Social Media',
  labelFr: 'Médias Sociaux',
  emoji: '🌐',
  color: '#3B82F6',           // Blue
  colorSecondary: '#60A5FA',
  description: 'Public presence, networking, content distribution',
  descriptionFr: 'Présence publique, réseautage, distribution de contenu',
  
  orbitLevel: 3,
  defaultAngle: Math.PI * 0.8,
  baseSize: 0.9,
  importance: 0.65,
  
  isolationLevel: 'low',
  privacyLevel: 'low',
  
  categories: [
    {
      id: 'platforms',
      label: 'Platforms',
      labelFr: 'Plateformes',
      emoji: '📱',
      dataTypes: ['connections', 'accounts', 'settings']
    },
    {
      id: 'content-queue',
      label: 'Content Queue',
      labelFr: 'File de Contenu',
      emoji: '📤',
      dataTypes: ['scheduled', 'drafts', 'calendar']
    },
    {
      id: 'engagement',
      label: 'Engagement',
      labelFr: 'Engagement',
      emoji: '💬',
      dataTypes: ['comments', 'messages', 'mentions']
    },
    {
      id: 'analytics',
      label: 'Analytics',
      labelFr: 'Analytiques',
      emoji: '📊',
      dataTypes: ['metrics', 'insights', 'reports']
    }
  ],
  
  directorAgentId: 'dir-social',
  managerAgentIds: ['mgr-social-content', 'mgr-social-engage', 'mgr-social-analytics', 'mgr-social-network']
};

// -----------------------------------------------------------------------------
// 6️⃣ SPHERE — METHODOLOGY (Méthodologie)
// -----------------------------------------------------------------------------

export const SPHERE_METHODOLOGY: SphereConfig = {
  id: 'methodology',
  label: 'Methodology',
  labelFr: 'Méthodologie',
  emoji: '🔬',
  color: '#8B5CF6',           // Violet
  colorSecondary: '#A78BFA',
  description: 'Systems, processes, optimization',
  descriptionFr: 'Systèmes, processus, optimisation',
  
  orbitLevel: 3,
  defaultAngle: Math.PI * 1.0,
  baseSize: 0.85,
  importance: 0.7,
  
  isolationLevel: 'standard',
  privacyLevel: 'medium',
  
  categories: [
    {
      id: 'processes',
      label: 'Processes',
      labelFr: 'Processus',
      emoji: '🔄',
      dataTypes: ['workflows', 'procedures', 'bestpractices']
    },
    {
      id: 'optimization',
      label: 'Optimization',
      labelFr: 'Optimisation',
      emoji: '📈',
      dataTypes: ['analysis', 'recommendations', 'metrics']
    },
    {
      id: 'templates',
      label: 'Templates',
      labelFr: 'Modèles',
      emoji: '📋',
      dataTypes: ['documents', 'projects', 'communications']
    },
    {
      id: 'automation',
      label: 'Automation',
      labelFr: 'Automatisation',
      emoji: '🤖',
      dataTypes: ['rules', 'triggers', 'integrations']
    }
  ],
  
  directorAgentId: 'dir-methodology',
  managerAgentIds: ['mgr-method-process', 'mgr-method-auto', 'mgr-method-template', 'mgr-method-analytics']
};

// -----------------------------------------------------------------------------
// 7️⃣ SPHERE — IA LAB (Laboratoire IA)
// -----------------------------------------------------------------------------

export const SPHERE_IA_LAB: SphereConfig = {
  id: 'ia-lab',
  label: 'IA Lab',
  labelFr: 'Laboratoire IA',
  emoji: '🧪',
  color: '#06B6D4',           // Cyan
  colorSecondary: '#22D3EE',
  description: 'AI experiments, agent training, evaluation',
  descriptionFr: 'Expériences IA, entraînement d\'agents, évaluation',
  
  orbitLevel: 4,
  defaultAngle: Math.PI * 1.2,
  baseSize: 0.9,
  importance: 0.6,
  
  isolationLevel: 'high',
  privacyLevel: 'high',
  
  categories: [
    {
      id: 'experiments',
      label: 'Experiments',
      labelFr: 'Expériences',
      emoji: '🔬',
      dataTypes: ['active', 'completed', 'results']
    },
    {
      id: 'agents-dev',
      label: 'Agent Development',
      labelFr: 'Développement d\'Agents',
      emoji: '🛠️',
      dataTypes: ['development', 'training', 'deployed']
    },
    {
      id: 'models',
      label: 'Models',
      labelFr: 'Modèles',
      emoji: '🧠',
      dataTypes: ['configurations', 'prompts', 'benchmarks']
    },
    {
      id: 'sandbox',
      label: 'Sandbox',
      labelFr: 'Bac à Sable',
      emoji: '🏖️',
      dataTypes: ['environments', 'mockdata', 'tests']
    }
  ],
  
  directorAgentId: 'dir-ialab',
  managerAgentIds: ['mgr-lab-experiment', 'mgr-lab-agent', 'mgr-lab-model', 'mgr-lab-sandbox']
};

// -----------------------------------------------------------------------------
// 8️⃣ SPHERE — XR IMMERSIVE (XR Immersif)
// -----------------------------------------------------------------------------

export const SPHERE_XR_IMMERSIVE: SphereConfig = {
  id: 'xr-immersive',
  label: 'XR Immersive',
  labelFr: 'XR Immersif',
  emoji: '🥽',
  color: '#14B8A6',           // Teal
  colorSecondary: '#2DD4BF',
  description: 'Virtual/augmented reality, immersive experiences',
  descriptionFr: 'Réalité virtuelle/augmentée, expériences immersives',
  
  orbitLevel: 4,
  defaultAngle: Math.PI * 1.4,
  baseSize: 0.95,
  importance: 0.55,
  
  isolationLevel: 'standard',
  privacyLevel: 'medium',
  
  categories: [
    {
      id: 'meetings-xr',
      label: 'Meeting Rooms',
      labelFr: 'Salles de Réunion',
      emoji: '🏢',
      dataTypes: ['rooms', 'scheduled', 'recordings']
    },
    {
      id: 'workspaces',
      label: 'Workspaces',
      labelFr: 'Espaces de Travail',
      emoji: '🖥️',
      dataTypes: ['offices', 'studios']
    },
    {
      id: 'experiences',
      label: 'Experiences',
      labelFr: 'Expériences',
      emoji: '🎮',
      dataTypes: ['tours', 'simulations', 'training']
    },
    {
      id: 'assets-xr',
      label: '3D Assets',
      labelFr: 'Assets 3D',
      emoji: '🎭',
      dataTypes: ['models', 'environments', 'avatars']
    }
  ],
  
  directorAgentId: 'dir-xr',
  managerAgentIds: ['mgr-xr-meeting', 'mgr-xr-workspace', 'mgr-xr-experience', 'mgr-xr-asset']
};

// -----------------------------------------------------------------------------
// 9️⃣ SPHERE — INSTITUTIONS (Institutions)
// -----------------------------------------------------------------------------

export const SPHERE_INSTITUTIONS: SphereConfig = {
  id: 'institutions',
  label: 'Institutions',
  labelFr: 'Institutions',
  emoji: '🏛️',
  color: '#EF4444',           // Red
  colorSecondary: '#F87171',
  description: 'Government, compliance, legal, regulations',
  descriptionFr: 'Gouvernement, conformité, légal, réglementations',
  
  orbitLevel: 5,
  defaultAngle: Math.PI * 1.6,
  baseSize: 1,
  importance: 0.85,
  
  isolationLevel: 'high',
  privacyLevel: 'high',
  
  categories: [
    {
      id: 'government',
      label: 'Government',
      labelFr: 'Gouvernement',
      emoji: '🏛️',
      dataTypes: ['federal', 'provincial', 'municipal']
    },
    {
      id: 'regulatory',
      label: 'Regulatory',
      labelFr: 'Réglementaire',
      emoji: '📜',
      dataTypes: ['rbq', 'cnesst', 'ccq', 'environmental']
    },
    {
      id: 'legal',
      label: 'Legal',
      labelFr: 'Légal',
      emoji: '⚖️',
      dataTypes: ['contracts', 'correspondence', 'litigation']
    },
    {
      id: 'permits',
      label: 'Permits & Licenses',
      labelFr: 'Permis & Licences',
      emoji: '📄',
      dataTypes: ['active', 'pending', 'expired']
    }
  ],
  
  directorAgentId: 'dir-institutions',
  managerAgentIds: ['mgr-inst-govt', 'mgr-inst-reg', 'mgr-inst-legal', 'mgr-inst-permit']
};

// -----------------------------------------------------------------------------
// 🔟 SPHERE — MY TEAM (Mon Équipe)
// -----------------------------------------------------------------------------

export const SPHERE_MY_TEAM: SphereConfig = {
  id: 'my-team',
  label: 'My Team',
  labelFr: 'Mon Équipe',
  emoji: '👥',
  color: '#F97316',           // Orange
  colorSecondary: '#FB923C',
  description: 'Collaboration, delegation, team management',
  descriptionFr: 'Collaboration, délégation, gestion d\'équipe',
  
  orbitLevel: 2,              // Variable en réalité
  defaultAngle: Math.PI * 1.8,
  baseSize: 1.05,
  importance: 0.8,
  
  isolationLevel: 'collaborative',
  privacyLevel: 'medium',
  
  categories: [
    {
      id: 'members',
      label: 'Team Members',
      labelFr: 'Membres de l\'Équipe',
      emoji: '👤',
      dataTypes: ['employees', 'contractors', 'partners']
    },
    {
      id: 'communication',
      label: 'Communication',
      labelFr: 'Communication',
      emoji: '💬',
      dataTypes: ['messages', 'announcements', 'discussions']
    },
    {
      id: 'tasks',
      label: 'Tasks',
      labelFr: 'Tâches',
      emoji: '✅',
      dataTypes: ['active', 'completed', 'delegated']
    },
    {
      id: 'shared',
      label: 'Shared Resources',
      labelFr: 'Ressources Partagées',
      emoji: '📂',
      dataTypes: ['documents', 'projects', 'resources']
    },
    {
      id: 'access',
      label: 'Access Control',
      labelFr: 'Contrôle d\'Accès',
      emoji: '🔐',
      dataTypes: ['permissions', 'invitations', 'logs']
    }
  ],
  
  directorAgentId: 'dir-team',
  managerAgentIds: ['mgr-team-member', 'mgr-team-comm', 'mgr-team-task', 'mgr-team-access']
};

// -----------------------------------------------------------------------------
// EXPORT — ALL SPHERES
// -----------------------------------------------------------------------------

/**
 * Toutes les configurations de sphères indexées par ID
 */
export const SPHERE_CONFIGS: Record<SphereId, SphereConfig> = {
  'personal': SPHERE_PERSONAL,
  'business': SPHERE_BUSINESS,
  'scholar': SPHERE_SCHOLAR,
  'creative-studio': SPHERE_CREATIVE_STUDIO,
  'social-media': SPHERE_SOCIAL_MEDIA,
  'methodology': SPHERE_METHODOLOGY,
  'ia-lab': SPHERE_IA_LAB,
  'xr-immersive': SPHERE_XR_IMMERSIVE,
  'institutions': SPHERE_INSTITUTIONS,
  'my-team': SPHERE_MY_TEAM
};

/**
 * Liste ordonnée des sphères (pour itération)
 */
export const ALL_SPHERES: SphereConfig[] = [
  SPHERE_PERSONAL,
  SPHERE_BUSINESS,
  SPHERE_SCHOLAR,
  SPHERE_CREATIVE_STUDIO,
  SPHERE_SOCIAL_MEDIA,
  SPHERE_METHODOLOGY,
  SPHERE_IA_LAB,
  SPHERE_XR_IMMERSIVE,
  SPHERE_INSTITUTIONS,
  SPHERE_MY_TEAM
];

/**
 * Obtenir une sphère par son ID
 */
export function getSphereConfig(id: SphereId): SphereConfig {
  return SPHERE_CONFIGS[id];
}

/**
 * Obtenir toutes les catégories d'une sphère
 */
export function getSphereCategories(id: SphereId) {
  return SPHERE_CONFIGS[id].categories;
}
