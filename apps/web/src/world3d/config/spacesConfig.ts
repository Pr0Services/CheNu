/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ 3D WORLD - SPACES CONFIGURATION
 * Configuration complète des 7 espaces
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { SpaceId } from '../stores/world3DStore';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface SpaceFeature {
  icon: string;
  text: string;
}

export interface SpaceConfig {
  id: SpaceId;
  name: string;
  icon: string;
  subtitle: string;
  color: number;
  colorHex: string;
  emissiveIntensity: number;
  position: [number, number, number];
  description: string;
  features: SpaceFeature[];
  stats: Record<string, string | number>;
  route: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SPACES CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export const SPACES_CONFIG: Record<SpaceId, SpaceConfig> = {
  maison: {
    id: 'maison',
    name: 'Maison',
    icon: '🏠',
    subtitle: 'Espace Personnel',
    color: 0x60A5FA,
    colorHex: '#60A5FA',
    emissiveIntensity: 0.2,
    position: [0, 0, 0],
    description: 'Gérez votre vie personnelle : budget familial, tâches quotidiennes, documents importants et calendrier personnel.',
    features: [
      { icon: '💰', text: 'Budget & Finances personnelles' },
      { icon: '📋', text: 'Tâches & Rappels' },
      { icon: '📁', text: 'Documents importants' },
      { icon: '📅', text: 'Calendrier familial' }
    ],
    stats: { projets: 12, documents: 48, taches: 23 },
    route: '/maison'
  },
  
  entreprise: {
    id: 'entreprise',
    name: 'Entreprise',
    icon: '🏢',
    subtitle: "Gestion d'entreprise",
    color: 0x6B7280,
    colorHex: '#6B7280',
    emissiveIntensity: 0.15,
    position: [0, 0, -10],
    description: 'Centre de commandement pour votre entreprise : RH, finances, opérations et tableaux de bord analytiques.',
    features: [
      { icon: '👥', text: 'Gestion des employés' },
      { icon: '📊', text: 'Analytics & Rapports' },
      { icon: '💳', text: 'Facturation & Comptabilité' },
      { icon: '📈', text: 'KPIs & Performances' }
    ],
    stats: { employes: 24, projets: 8, revenus: '2.4M$' },
    route: '/entreprise'
  },
  
  projets: {
    id: 'projets',
    name: 'Projets',
    icon: '📊',
    subtitle: 'Gestion de projets',
    color: 0xF59E0B,
    colorHex: '#F59E0B',
    emissiveIntensity: 0.3,
    position: [8, 0, -6],
    description: 'Table holographique pour piloter tous vos projets avec suivi en temps réel et collaboration d\'équipe.',
    features: [
      { icon: '📋', text: 'Kanban & Sprints' },
      { icon: '⏱️', text: 'Time tracking' },
      { icon: '🤝', text: 'Collaboration équipe' },
      { icon: '🎯', text: 'Objectifs & Milestones' }
    ],
    stats: { actifs: 15, termines: 47, equipes: 6 },
    route: '/projets'
  },
  
  gouvernement: {
    id: 'gouvernement',
    name: 'Gouvernement',
    icon: '🏛️',
    subtitle: 'Services administratifs',
    color: 0xE5E7EB,
    colorHex: '#E5E7EB',
    emissiveIntensity: 0.1,
    position: [0, 0, 10],
    description: 'Dôme institutionnel pour vos démarches administratives, taxes, permis et conformité réglementaire.',
    features: [
      { icon: '📝', text: 'Déclarations fiscales' },
      { icon: '🪪', text: 'Permis & Licences' },
      { icon: '⚖️', text: 'Conformité légale' },
      { icon: '📬', text: 'Courrier officiel' }
    ],
    stats: { dossiers: 8, enCours: 3, conformite: '100%' },
    route: '/gouvernement'
  },
  
  immobilier: {
    id: 'immobilier',
    name: 'Immobilier',
    icon: '🏗️',
    subtitle: 'Gestion immobilière',
    color: 0x10B981,
    colorHex: '#10B981',
    emissiveIntensity: 0.2,
    position: [8, 0, 6],
    description: 'Gérez vos propriétés, chantiers de construction, baux et maintenance avec visualisation 3D des projets.',
    features: [
      { icon: '🏠', text: 'Portfolio propriétés' },
      { icon: '👷', text: 'Suivi chantiers' },
      { icon: '📄', text: 'Gestion des baux' },
      { icon: '🔧', text: 'Maintenance & Travaux' }
    ],
    stats: { proprietes: 5, chantiers: 2, valeur: '8.5M$' },
    route: '/immobilier'
  },
  
  associations: {
    id: 'associations',
    name: 'Associations',
    icon: '🤝',
    subtitle: 'Collaboration & Communauté',
    color: 0x8B5CF6,
    colorHex: '#8B5CF6',
    emissiveIntensity: 0.25,
    position: [-8, 0, -6],
    description: 'Pavillon communautaire pour gérer vos associations, memberships, événements et actions collectives.',
    features: [
      { icon: '👥', text: 'Gestion des membres' },
      { icon: '📅', text: 'Événements & Réunions' },
      { icon: '💬', text: 'Communication interne' },
      { icon: '📊', text: "Rapports d'activité" }
    ],
    stats: { membres: 156, evenements: 12, actifs: 4 },
    route: '/associations'
  },
  
  creative: {
    id: 'creative',
    name: 'Creative Studio',
    icon: '🎨',
    subtitle: 'Création & Multimédia',
    color: 0xD8B26A,
    colorHex: '#D8B26A',
    emissiveIntensity: 0.35,
    position: [-8, 0, 6],
    description: 'Cube doré créatif pour vos projets multimédias : design, vidéo, musique et contenus marketing.',
    features: [
      { icon: '🎬', text: 'Production vidéo' },
      { icon: '🖼️', text: 'Design graphique' },
      { icon: '🎵', text: 'Audio & Musique' },
      { icon: '📱', text: 'Contenu réseaux sociaux' }
    ],
    stats: { projets: 34, assets: 520, clients: 18 },
    route: '/creative-studio'
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CAMERA CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const CAMERA_CONFIG = {
  fov: 45,
  near: 0.1,
  far: 1000,
  initialPosition: [0, 20, 30] as [number, number, number],
  minDistance: 15,
  maxDistance: 60,
  minPolarAngle: Math.PI / 6,
  maxPolarAngle: Math.PI / 2.2
};

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS (CHE·NU™ Brandbook)
// ─────────────────────────────────────────────────────────────────────────────

export const TOKENS = {
  colors: {
    darkSlate: '#1A1A1A',
    sacredGold: '#D8B26A',
    sacredGoldLight: '#E5C27A',
    jungleEmerald: '#3F7249',
    cenoteTurquoise: '#3EB4A2',
    ancientStone: '#8D8371',
    softSand: '#E9E4D6'
  },
  fonts: {
    heading: "'Lora', serif",
    body: "'Inter', sans-serif"
  }
};
