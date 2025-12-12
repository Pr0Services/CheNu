// =============================================================================
// CHE·NU — CANONICAL AGENT CONFIGURATION
// Foundation Freeze V1
// =============================================================================
// Hiérarchie des agents:
// - L0: NOVA (Central, transversal)
// - L1: Directors (un par sphère)
// - L2: Managers (plusieurs par sphère)
// - L3: Specialists (exécution)
// =============================================================================

import { AgentConfig, AgentLevel, SphereId } from '../types';

// -----------------------------------------------------------------------------
// L0 — NOVA (Central Orchestrator)
// -----------------------------------------------------------------------------

export const AGENT_NOVA: AgentConfig = {
  id: 'nova-central',
  label: 'NOVA',
  labelFr: 'NOVA',
  level: 'L0',
  role: 'Central Orchestrator',
  roleFr: 'Orchestrateur Central',
  
  primarySphere: 'transversal',
  
  emoji: '✨',
  color: '#A855F7',           // Purple
  
  // NOVA n'orbite pas, elle est au centre
  orbitRadius: 0,
  orbitSpeed: 0
};

// -----------------------------------------------------------------------------
// L1 — DIRECTORS (One per Sphere)
// -----------------------------------------------------------------------------

export const L1_DIRECTORS: AgentConfig[] = [
  {
    id: 'dir-personal',
    label: 'Personal Guardian',
    labelFr: 'Gardien Personnel',
    level: 'L1',
    role: 'Personal Sphere Director',
    roleFr: 'Directeur Sphère Personnel',
    primarySphere: 'personal',
    emoji: '🛡️',
    color: '#6366F1',
    orbitRadius: 1.2,
    orbitSpeed: 0.3
  },
  {
    id: 'dir-business',
    label: 'Business Director',
    labelFr: 'Directeur Affaires',
    level: 'L1',
    role: 'Business Sphere Director',
    roleFr: 'Directeur Sphère Affaires',
    primarySphere: 'business',
    emoji: '📊',
    color: '#10B981',
    orbitRadius: 1.3,
    orbitSpeed: 0.4
  },
  {
    id: 'dir-scholar',
    label: 'Knowledge Director',
    labelFr: 'Directeur Savoir',
    level: 'L1',
    role: 'Scholar Sphere Director',
    roleFr: 'Directeur Sphère Savoir',
    primarySphere: 'scholar',
    emoji: '🎓',
    color: '#F59E0B',
    orbitRadius: 1.2,
    orbitSpeed: 0.35
  },
  {
    id: 'dir-creative',
    label: 'Creative Director',
    labelFr: 'Directeur Créatif',
    level: 'L1',
    role: 'Creative Studio Director',
    roleFr: 'Directeur Studio Créatif',
    primarySphere: 'creative-studio',
    emoji: '🎭',
    color: '#EC4899',
    orbitRadius: 1.25,
    orbitSpeed: 0.45
  },
  {
    id: 'dir-social',
    label: 'Social Director',
    labelFr: 'Directeur Social',
    level: 'L1',
    role: 'Social Media Director',
    roleFr: 'Directeur Médias Sociaux',
    primarySphere: 'social-media',
    emoji: '📣',
    color: '#3B82F6',
    orbitRadius: 1.15,
    orbitSpeed: 0.5
  },
  {
    id: 'dir-methodology',
    label: 'Methodology Director',
    labelFr: 'Directeur Méthodologie',
    level: 'L1',
    role: 'Methodology Sphere Director',
    roleFr: 'Directeur Sphère Méthodologie',
    primarySphere: 'methodology',
    emoji: '⚙️',
    color: '#8B5CF6',
    orbitRadius: 1.2,
    orbitSpeed: 0.35
  },
  {
    id: 'dir-ialab',
    label: 'Lab Director',
    labelFr: 'Directeur Laboratoire',
    level: 'L1',
    role: 'IA Lab Director',
    roleFr: 'Directeur Laboratoire IA',
    primarySphere: 'ia-lab',
    emoji: '🔬',
    color: '#06B6D4',
    orbitRadius: 1.3,
    orbitSpeed: 0.4
  },
  {
    id: 'dir-xr',
    label: 'XR Director',
    labelFr: 'Directeur XR',
    level: 'L1',
    role: 'XR Immersive Director',
    roleFr: 'Directeur XR Immersif',
    primarySphere: 'xr-immersive',
    emoji: '🌐',
    color: '#14B8A6',
    orbitRadius: 1.25,
    orbitSpeed: 0.45
  },
  {
    id: 'dir-institutions',
    label: 'Compliance Director',
    labelFr: 'Directeur Conformité',
    level: 'L1',
    role: 'Institutions Director',
    roleFr: 'Directeur Institutions',
    primarySphere: 'institutions',
    emoji: '⚖️',
    color: '#EF4444',
    orbitRadius: 1.2,
    orbitSpeed: 0.3
  },
  {
    id: 'dir-team',
    label: 'Team Director',
    labelFr: 'Directeur Équipe',
    level: 'L1',
    role: 'My Team Director',
    roleFr: 'Directeur Mon Équipe',
    primarySphere: 'my-team',
    emoji: '👔',
    color: '#F97316',
    orbitRadius: 1.25,
    orbitSpeed: 0.4
  }
];

// -----------------------------------------------------------------------------
// L2 — MANAGERS (Multiple per Sphere)
// -----------------------------------------------------------------------------

export const L2_MANAGERS: AgentConfig[] = [
  // Personal Sphere Managers
  {
    id: 'mgr-personal-health',
    label: 'Health Manager',
    labelFr: 'Gestionnaire Santé',
    level: 'L2',
    role: 'Health & Wellness Manager',
    roleFr: 'Gestionnaire Santé & Bien-être',
    primarySphere: 'personal',
    emoji: '❤️',
    color: '#6366F1',
    orbitRadius: 0.8,
    orbitSpeed: 0.5
  },
  {
    id: 'mgr-personal-finance',
    label: 'Personal Finance Manager',
    labelFr: 'Gestionnaire Finances Perso',
    level: 'L2',
    role: 'Personal Finance Manager',
    roleFr: 'Gestionnaire Finances Personnelles',
    primarySphere: 'personal',
    emoji: '💰',
    color: '#6366F1',
    orbitRadius: 0.85,
    orbitSpeed: 0.45
  },
  {
    id: 'mgr-personal-docs',
    label: 'Document Manager',
    labelFr: 'Gestionnaire Documents',
    level: 'L2',
    role: 'Identity & Documents Manager',
    roleFr: 'Gestionnaire Identité & Documents',
    primarySphere: 'personal',
    emoji: '📄',
    color: '#6366F1',
    orbitRadius: 0.75,
    orbitSpeed: 0.4
  },
  {
    id: 'mgr-personal-journal',
    label: 'Journal Manager',
    labelFr: 'Gestionnaire Journal',
    level: 'L2',
    role: 'Journal & Notes Manager',
    roleFr: 'Gestionnaire Journal & Notes',
    primarySphere: 'personal',
    emoji: '📔',
    color: '#6366F1',
    orbitRadius: 0.9,
    orbitSpeed: 0.55
  },
  
  // Business Sphere Managers
  {
    id: 'mgr-business-project',
    label: 'Project Manager',
    labelFr: 'Gestionnaire Projets',
    level: 'L2',
    role: 'Project Lifecycle Manager',
    roleFr: 'Gestionnaire Cycle de Vie Projets',
    primarySphere: 'business',
    emoji: '📋',
    color: '#10B981',
    orbitRadius: 0.9,
    orbitSpeed: 0.5
  },
  {
    id: 'mgr-business-client',
    label: 'Client Manager',
    labelFr: 'Gestionnaire Clients',
    level: 'L2',
    role: 'Client Relations Manager',
    roleFr: 'Gestionnaire Relations Clients',
    primarySphere: 'business',
    emoji: '🤝',
    color: '#10B981',
    orbitRadius: 0.85,
    orbitSpeed: 0.55
  },
  {
    id: 'mgr-business-finance',
    label: 'Finance Manager',
    labelFr: 'Gestionnaire Finances',
    level: 'L2',
    role: 'Business Finance Manager',
    roleFr: 'Gestionnaire Finances Affaires',
    primarySphere: 'business',
    emoji: '💵',
    color: '#10B981',
    orbitRadius: 0.8,
    orbitSpeed: 0.45
  },
  {
    id: 'mgr-business-compliance',
    label: 'Compliance Manager',
    labelFr: 'Gestionnaire Conformité',
    level: 'L2',
    role: 'Regulatory Compliance Manager',
    roleFr: 'Gestionnaire Conformité Réglementaire',
    primarySphere: 'business',
    emoji: '✅',
    color: '#10B981',
    orbitRadius: 0.95,
    orbitSpeed: 0.4
  },
  {
    id: 'mgr-business-ops',
    label: 'Operations Manager',
    labelFr: 'Gestionnaire Opérations',
    level: 'L2',
    role: 'Daily Operations Manager',
    roleFr: 'Gestionnaire Opérations Quotidiennes',
    primarySphere: 'business',
    emoji: '⚙️',
    color: '#10B981',
    orbitRadius: 0.88,
    orbitSpeed: 0.5
  },
  
  // Scholar Sphere Managers
  {
    id: 'mgr-scholar-research',
    label: 'Research Manager',
    labelFr: 'Gestionnaire Recherche',
    level: 'L2',
    role: 'Research Projects Manager',
    roleFr: 'Gestionnaire Projets de Recherche',
    primarySphere: 'scholar',
    emoji: '🔍',
    color: '#F59E0B',
    orbitRadius: 0.85,
    orbitSpeed: 0.45
  },
  {
    id: 'mgr-scholar-learning',
    label: 'Learning Manager',
    labelFr: 'Gestionnaire Apprentissage',
    level: 'L2',
    role: 'Learning & Courses Manager',
    roleFr: 'Gestionnaire Apprentissage & Cours',
    primarySphere: 'scholar',
    emoji: '🎓',
    color: '#F59E0B',
    orbitRadius: 0.8,
    orbitSpeed: 0.5
  },
  {
    id: 'mgr-scholar-library',
    label: 'Library Manager',
    labelFr: 'Gestionnaire Bibliothèque',
    level: 'L2',
    role: 'Knowledge Base Manager',
    roleFr: 'Gestionnaire Base de Connaissances',
    primarySphere: 'scholar',
    emoji: '📖',
    color: '#F59E0B',
    orbitRadius: 0.9,
    orbitSpeed: 0.4
  },
  {
    id: 'mgr-scholar-publish',
    label: 'Publication Manager',
    labelFr: 'Gestionnaire Publications',
    level: 'L2',
    role: 'Publications Manager',
    roleFr: 'Gestionnaire Publications',
    primarySphere: 'scholar',
    emoji: '📰',
    color: '#F59E0B',
    orbitRadius: 0.75,
    orbitSpeed: 0.55
  },
  
  // Creative Studio Managers
  {
    id: 'mgr-creative-visual',
    label: 'Visual Manager',
    labelFr: 'Gestionnaire Visuel',
    level: 'L2',
    role: 'Visual Content Manager',
    roleFr: 'Gestionnaire Contenu Visuel',
    primarySphere: 'creative-studio',
    emoji: '🖼️',
    color: '#EC4899',
    orbitRadius: 0.85,
    orbitSpeed: 0.55
  },
  {
    id: 'mgr-creative-content',
    label: 'Content Manager',
    labelFr: 'Gestionnaire Contenu',
    level: 'L2',
    role: 'Written Content Manager',
    roleFr: 'Gestionnaire Contenu Écrit',
    primarySphere: 'creative-studio',
    emoji: '✍️',
    color: '#EC4899',
    orbitRadius: 0.8,
    orbitSpeed: 0.5
  },
  {
    id: 'mgr-creative-audio',
    label: 'Audio Manager',
    labelFr: 'Gestionnaire Audio',
    level: 'L2',
    role: 'Audio Content Manager',
    roleFr: 'Gestionnaire Contenu Audio',
    primarySphere: 'creative-studio',
    emoji: '🎵',
    color: '#EC4899',
    orbitRadius: 0.9,
    orbitSpeed: 0.45
  },
  {
    id: 'mgr-creative-asset',
    label: 'Asset Manager',
    labelFr: 'Gestionnaire Assets',
    level: 'L2',
    role: 'Asset Library Manager',
    roleFr: 'Gestionnaire Bibliothèque Assets',
    primarySphere: 'creative-studio',
    emoji: '📁',
    color: '#EC4899',
    orbitRadius: 0.75,
    orbitSpeed: 0.4
  },
  
  // Social Media Managers
  {
    id: 'mgr-social-content',
    label: 'Social Content Manager',
    labelFr: 'Gestionnaire Contenu Social',
    level: 'L2',
    role: 'Publishing Manager',
    roleFr: 'Gestionnaire Publication',
    primarySphere: 'social-media',
    emoji: '📤',
    color: '#3B82F6',
    orbitRadius: 0.85,
    orbitSpeed: 0.6
  },
  {
    id: 'mgr-social-engage',
    label: 'Engagement Manager',
    labelFr: 'Gestionnaire Engagement',
    level: 'L2',
    role: 'Community Engagement Manager',
    roleFr: 'Gestionnaire Engagement Communauté',
    primarySphere: 'social-media',
    emoji: '💬',
    color: '#3B82F6',
    orbitRadius: 0.8,
    orbitSpeed: 0.65
  },
  {
    id: 'mgr-social-analytics',
    label: 'Analytics Manager',
    labelFr: 'Gestionnaire Analytiques',
    level: 'L2',
    role: 'Social Analytics Manager',
    roleFr: 'Gestionnaire Analytiques Sociaux',
    primarySphere: 'social-media',
    emoji: '📊',
    color: '#3B82F6',
    orbitRadius: 0.9,
    orbitSpeed: 0.5
  },
  {
    id: 'mgr-social-network',
    label: 'Network Manager',
    labelFr: 'Gestionnaire Réseau',
    level: 'L2',
    role: 'Network Connections Manager',
    roleFr: 'Gestionnaire Connexions Réseau',
    primarySphere: 'social-media',
    emoji: '🔗',
    color: '#3B82F6',
    orbitRadius: 0.75,
    orbitSpeed: 0.55
  },
  
  // Methodology Managers
  {
    id: 'mgr-method-process',
    label: 'Process Manager',
    labelFr: 'Gestionnaire Processus',
    level: 'L2',
    role: 'Workflow Design Manager',
    roleFr: 'Gestionnaire Design Workflows',
    primarySphere: 'methodology',
    emoji: '🔄',
    color: '#8B5CF6',
    orbitRadius: 0.85,
    orbitSpeed: 0.45
  },
  {
    id: 'mgr-method-auto',
    label: 'Automation Manager',
    labelFr: 'Gestionnaire Automatisation',
    level: 'L2',
    role: 'Rule-Based Automation Manager',
    roleFr: 'Gestionnaire Automatisation Règles',
    primarySphere: 'methodology',
    emoji: '🤖',
    color: '#8B5CF6',
    orbitRadius: 0.8,
    orbitSpeed: 0.5
  },
  {
    id: 'mgr-method-template',
    label: 'Template Manager',
    labelFr: 'Gestionnaire Modèles',
    level: 'L2',
    role: 'Standard Templates Manager',
    roleFr: 'Gestionnaire Modèles Standards',
    primarySphere: 'methodology',
    emoji: '📋',
    color: '#8B5CF6',
    orbitRadius: 0.9,
    orbitSpeed: 0.4
  },
  {
    id: 'mgr-method-analytics',
    label: 'Performance Manager',
    labelFr: 'Gestionnaire Performance',
    level: 'L2',
    role: 'Performance Metrics Manager',
    roleFr: 'Gestionnaire Métriques Performance',
    primarySphere: 'methodology',
    emoji: '📈',
    color: '#8B5CF6',
    orbitRadius: 0.75,
    orbitSpeed: 0.55
  },
  
  // IA Lab Managers
  {
    id: 'mgr-lab-experiment',
    label: 'Experiment Manager',
    labelFr: 'Gestionnaire Expériences',
    level: 'L2',
    role: 'Research Experiments Manager',
    roleFr: 'Gestionnaire Expériences Recherche',
    primarySphere: 'ia-lab',
    emoji: '🧪',
    color: '#06B6D4',
    orbitRadius: 0.9,
    orbitSpeed: 0.5
  },
  {
    id: 'mgr-lab-agent',
    label: 'Agent Manager',
    labelFr: 'Gestionnaire Agents',
    level: 'L2',
    role: 'Agent Development Manager',
    roleFr: 'Gestionnaire Développement Agents',
    primarySphere: 'ia-lab',
    emoji: '🛠️',
    color: '#06B6D4',
    orbitRadius: 0.85,
    orbitSpeed: 0.55
  },
  {
    id: 'mgr-lab-model',
    label: 'Model Manager',
    labelFr: 'Gestionnaire Modèles',
    level: 'L2',
    role: 'LLM Operations Manager',
    roleFr: 'Gestionnaire Opérations LLM',
    primarySphere: 'ia-lab',
    emoji: '🧠',
    color: '#06B6D4',
    orbitRadius: 0.8,
    orbitSpeed: 0.45
  },
  {
    id: 'mgr-lab-sandbox',
    label: 'Sandbox Manager',
    labelFr: 'Gestionnaire Sandbox',
    level: 'L2',
    role: 'Test Environment Manager',
    roleFr: 'Gestionnaire Environnement Test',
    primarySphere: 'ia-lab',
    emoji: '🏖️',
    color: '#06B6D4',
    orbitRadius: 0.75,
    orbitSpeed: 0.4
  },
  
  // XR Immersive Managers
  {
    id: 'mgr-xr-meeting',
    label: 'Meeting Manager',
    labelFr: 'Gestionnaire Réunions',
    level: 'L2',
    role: 'Virtual Meetings Manager',
    roleFr: 'Gestionnaire Réunions Virtuelles',
    primarySphere: 'xr-immersive',
    emoji: '🏢',
    color: '#14B8A6',
    orbitRadius: 0.85,
    orbitSpeed: 0.5
  },
  {
    id: 'mgr-xr-workspace',
    label: 'Workspace Manager',
    labelFr: 'Gestionnaire Espaces',
    level: 'L2',
    role: 'Work Environments Manager',
    roleFr: 'Gestionnaire Environnements Travail',
    primarySphere: 'xr-immersive',
    emoji: '🖥️',
    color: '#14B8A6',
    orbitRadius: 0.8,
    orbitSpeed: 0.45
  },
  {
    id: 'mgr-xr-experience',
    label: 'Experience Manager',
    labelFr: 'Gestionnaire Expériences',
    level: 'L2',
    role: 'Immersive Experiences Manager',
    roleFr: 'Gestionnaire Expériences Immersives',
    primarySphere: 'xr-immersive',
    emoji: '🎮',
    color: '#14B8A6',
    orbitRadius: 0.9,
    orbitSpeed: 0.55
  },
  {
    id: 'mgr-xr-asset',
    label: '3D Asset Manager',
    labelFr: 'Gestionnaire Assets 3D',
    level: 'L2',
    role: '3D Resources Manager',
    roleFr: 'Gestionnaire Ressources 3D',
    primarySphere: 'xr-immersive',
    emoji: '🎭',
    color: '#14B8A6',
    orbitRadius: 0.75,
    orbitSpeed: 0.4
  },
  
  // Institutions Managers
  {
    id: 'mgr-inst-govt',
    label: 'Government Manager',
    labelFr: 'Gestionnaire Gouvernement',
    level: 'L2',
    role: 'Government Relations Manager',
    roleFr: 'Gestionnaire Relations Gouvernementales',
    primarySphere: 'institutions',
    emoji: '🏛️',
    color: '#EF4444',
    orbitRadius: 0.85,
    orbitSpeed: 0.4
  },
  {
    id: 'mgr-inst-reg',
    label: 'Regulatory Manager',
    labelFr: 'Gestionnaire Réglementaire',
    level: 'L2',
    role: 'Industry Compliance Manager',
    roleFr: 'Gestionnaire Conformité Industrie',
    primarySphere: 'institutions',
    emoji: '📜',
    color: '#EF4444',
    orbitRadius: 0.8,
    orbitSpeed: 0.45
  },
  {
    id: 'mgr-inst-legal',
    label: 'Legal Manager',
    labelFr: 'Gestionnaire Légal',
    level: 'L2',
    role: 'Legal Matters Manager',
    roleFr: 'Gestionnaire Affaires Légales',
    primarySphere: 'institutions',
    emoji: '⚖️',
    color: '#EF4444',
    orbitRadius: 0.9,
    orbitSpeed: 0.35
  },
  {
    id: 'mgr-inst-permit',
    label: 'Permit Manager',
    labelFr: 'Gestionnaire Permis',
    level: 'L2',
    role: 'Permits & Licenses Manager',
    roleFr: 'Gestionnaire Permis & Licences',
    primarySphere: 'institutions',
    emoji: '📄',
    color: '#EF4444',
    orbitRadius: 0.75,
    orbitSpeed: 0.5
  },
  
  // My Team Managers
  {
    id: 'mgr-team-member',
    label: 'Member Manager',
    labelFr: 'Gestionnaire Membres',
    level: 'L2',
    role: 'Team Roster Manager',
    roleFr: 'Gestionnaire Liste Équipe',
    primarySphere: 'my-team',
    emoji: '👤',
    color: '#F97316',
    orbitRadius: 0.85,
    orbitSpeed: 0.5
  },
  {
    id: 'mgr-team-comm',
    label: 'Communication Manager',
    labelFr: 'Gestionnaire Communication',
    level: 'L2',
    role: 'Team Communication Manager',
    roleFr: 'Gestionnaire Communication Équipe',
    primarySphere: 'my-team',
    emoji: '💬',
    color: '#F97316',
    orbitRadius: 0.8,
    orbitSpeed: 0.55
  },
  {
    id: 'mgr-team-task',
    label: 'Task Manager',
    labelFr: 'Gestionnaire Tâches',
    level: 'L2',
    role: 'Task Delegation Manager',
    roleFr: 'Gestionnaire Délégation Tâches',
    primarySphere: 'my-team',
    emoji: '✅',
    color: '#F97316',
    orbitRadius: 0.9,
    orbitSpeed: 0.45
  },
  {
    id: 'mgr-team-access',
    label: 'Access Manager',
    labelFr: 'Gestionnaire Accès',
    level: 'L2',
    role: 'Permissions Manager',
    roleFr: 'Gestionnaire Permissions',
    primarySphere: 'my-team',
    emoji: '🔐',
    color: '#F97316',
    orbitRadius: 0.75,
    orbitSpeed: 0.4
  }
];

// -----------------------------------------------------------------------------
// L3 — SPECIALISTS (Examples - extend as needed)
// -----------------------------------------------------------------------------

export const L3_SPECIALISTS: AgentConfig[] = [
  // Construction-specific specialists
  {
    id: 'spec-estimator',
    label: 'Estimator',
    labelFr: 'Estimateur',
    level: 'L3',
    role: 'Cost Estimation Specialist',
    roleFr: 'Spécialiste Estimation Coûts',
    primarySphere: 'business',
    emoji: '🧮',
    color: '#10B981',
    orbitRadius: 0.5,
    orbitSpeed: 0.6
  },
  {
    id: 'spec-scheduler',
    label: 'Scheduler',
    labelFr: 'Planificateur',
    level: 'L3',
    role: 'Project Scheduling Specialist',
    roleFr: 'Spécialiste Planification Projets',
    primarySphere: 'business',
    emoji: '📅',
    color: '#10B981',
    orbitRadius: 0.55,
    orbitSpeed: 0.55
  },
  {
    id: 'spec-safety',
    label: 'Safety Coordinator',
    labelFr: 'Coordinateur Sécurité',
    level: 'L3',
    role: 'CNESST Compliance Specialist',
    roleFr: 'Spécialiste Conformité CNESST',
    primarySphere: 'institutions',
    emoji: '⛑️',
    color: '#EF4444',
    orbitRadius: 0.5,
    orbitSpeed: 0.5
  },
  {
    id: 'spec-rbq',
    label: 'RBQ Specialist',
    labelFr: 'Spécialiste RBQ',
    level: 'L3',
    role: 'RBQ Compliance Specialist',
    roleFr: 'Spécialiste Conformité RBQ',
    primarySphere: 'institutions',
    emoji: '🏗️',
    color: '#EF4444',
    orbitRadius: 0.55,
    orbitSpeed: 0.45
  },
  {
    id: 'spec-ccq',
    label: 'CCQ Specialist',
    labelFr: 'Spécialiste CCQ',
    level: 'L3',
    role: 'CCQ Compliance Specialist',
    roleFr: 'Spécialiste Conformité CCQ',
    primarySphere: 'institutions',
    emoji: '👷',
    color: '#EF4444',
    orbitRadius: 0.6,
    orbitSpeed: 0.5
  },
  {
    id: 'spec-invoice',
    label: 'Invoice Processor',
    labelFr: 'Processeur Factures',
    level: 'L3',
    role: 'Billing Specialist',
    roleFr: 'Spécialiste Facturation',
    primarySphere: 'business',
    emoji: '🧾',
    color: '#10B981',
    orbitRadius: 0.5,
    orbitSpeed: 0.65
  },
  {
    id: 'spec-research',
    label: 'Research Assistant',
    labelFr: 'Assistant Recherche',
    level: 'L3',
    role: 'Research Support Specialist',
    roleFr: 'Spécialiste Support Recherche',
    primarySphere: 'scholar',
    emoji: '🔬',
    color: '#F59E0B',
    orbitRadius: 0.5,
    orbitSpeed: 0.55
  },
  {
    id: 'spec-designer',
    label: 'Design Assistant',
    labelFr: 'Assistant Design',
    level: 'L3',
    role: 'Visual Design Specialist',
    roleFr: 'Spécialiste Design Visuel',
    primarySphere: 'creative-studio',
    emoji: '🎨',
    color: '#EC4899',
    orbitRadius: 0.55,
    orbitSpeed: 0.6
  }
];

// -----------------------------------------------------------------------------
// EXPORTS — ALL AGENTS
// -----------------------------------------------------------------------------

/**
 * Tous les agents combinés
 */
export const ALL_AGENTS: AgentConfig[] = [
  AGENT_NOVA,
  ...L1_DIRECTORS,
  ...L2_MANAGERS,
  ...L3_SPECIALISTS
];

/**
 * Map des agents par ID
 */
export const AGENT_CONFIGS: Record<string, AgentConfig> = ALL_AGENTS.reduce(
  (acc, agent) => {
    acc[agent.id] = agent;
    return acc;
  },
  {} as Record<string, AgentConfig>
);

/**
 * Obtenir les agents par niveau
 */
export function getAgentsByLevel(level: AgentLevel): AgentConfig[] {
  return ALL_AGENTS.filter(a => a.level === level);
}

/**
 * Obtenir les agents par sphère
 */
export function getAgentsBySphere(sphereId: SphereId): AgentConfig[] {
  return ALL_AGENTS.filter(a => a.primarySphere === sphereId);
}

/**
 * Obtenir un agent par son ID
 */
export function getAgentConfig(id: string): AgentConfig | undefined {
  return AGENT_CONFIGS[id];
}
