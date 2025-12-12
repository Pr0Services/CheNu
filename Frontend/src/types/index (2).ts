// =============================================================================
// CHE·NU — MASTER TYPE DEFINITIONS
// Foundation Freeze V1
// =============================================================================

// -----------------------------------------------------------------------------
// VIEW MODES
// -----------------------------------------------------------------------------

/**
 * Les trois modes de visualisation supportés
 * La même logique s'applique partout, seule la projection change
 */
export type ViewMode = '2d' | '3d' | 'xr';

/**
 * États visuels d'une sphère
 * Chaque état doit être distinguable SANS texte
 */
export type SphereVisualState = 'idle' | 'active' | 'saturated' | 'attention-needed';

/**
 * États d'un agent
 */
export type AgentState = 'idle' | 'active' | 'analyzing' | 'warning' | 'suspended';

/**
 * Niveaux d'agent dans la hiérarchie
 */
export type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3';

// -----------------------------------------------------------------------------
// SPHERE TYPES
// -----------------------------------------------------------------------------

/**
 * Identifiants canoniques des 10 sphères
 * FROZEN - Ne pas modifier
 */
export type SphereId =
  | 'personal'
  | 'business'
  | 'scholar'
  | 'creative-studio'
  | 'social-media'
  | 'methodology'
  | 'ia-lab'
  | 'xr-immersive'
  | 'institutions'
  | 'my-team';

/**
 * Configuration statique d'une sphère
 */
export interface SphereConfig {
  id: SphereId;
  label: string;
  labelFr: string;
  emoji: string;
  color: string;
  colorSecondary: string;
  description: string;
  descriptionFr: string;
  
  // Positionnement dans l'univers
  orbitLevel: 1 | 2 | 3 | 4 | 5;  // Distance du centre
  defaultAngle: number;           // Position angulaire initiale (radians)
  
  // Propriétés visuelles de base
  baseSize: number;               // Taille de base (1 = standard)
  importance: number;             // 0-1, influence la taille
  
  // Isolation et visibilité
  isolationLevel: 'maximum' | 'high' | 'standard' | 'collaborative' | 'low';
  privacyLevel: 'highest' | 'high' | 'medium' | 'low';
  
  // Catégories internes
  categories: SphereCategoryConfig[];
  
  // Agents responsables
  directorAgentId: string;
  managerAgentIds: string[];
}

/**
 * Configuration d'une catégorie interne à une sphère
 */
export interface SphereCategoryConfig {
  id: string;
  label: string;
  labelFr: string;
  emoji: string;
  description?: string;
  dataTypes: string[];
}

/**
 * État runtime d'une sphère (change dynamiquement)
 */
export interface SphereRuntimeState {
  sphereId: SphereId;
  activity: number;           // 0-1, niveau d'activité actuel
  contentVolume: number;      // Volume de données (affecte la taille)
  hasNotifications: boolean;
  notificationCount: number;
  lastAccessedAt: string;     // ISO timestamp
  visualState: SphereVisualState;
}

// -----------------------------------------------------------------------------
// AGENT TYPES
// -----------------------------------------------------------------------------

/**
 * Configuration statique d'un agent
 */
export interface AgentConfig {
  id: string;
  label: string;
  labelFr: string;
  level: AgentLevel;
  role: string;
  roleFr: string;
  
  // Rattachement
  primarySphere: SphereId | 'transversal';
  secondarySpheres?: SphereId[];
  
  // Visuel
  emoji: string;
  color: string;
  
  // Orbite (pour les agents non-transversaux)
  orbitRadius?: number;
  orbitSpeed?: number;
}

/**
 * État runtime d'un agent
 */
export interface AgentRuntimeState {
  agentId: string;
  state: AgentState;
  currentTask?: string;
  confidence: number;         // 0-1, stabilité de l'orbite
  urgency: number;            // 0-1, vitesse de l'orbite
  lastActiveAt: string;
}

// -----------------------------------------------------------------------------
// MENU & NAVIGATION TYPES
// -----------------------------------------------------------------------------

/**
 * Type de nœud dans la navigation
 */
export type MenuNodeType = 'trunk' | 'sphere' | 'category' | 'tool' | 'page' | 'action';

/**
 * Nœud de menu (généré depuis JSON, jamais hardcodé)
 */
export interface MenuNode {
  id: string;
  label: string;
  labelFr: string;
  emoji: string;
  type: MenuNodeType;
  
  // Hiérarchie
  parentId?: string;
  children?: string[];
  
  // Priorité et visibilité
  priority: number;           // Plus haut = plus visible
  dataWeight: number;         // Volume de données, affecte la prominence
  
  // Conditions de visibilité
  visibility: {
    modes: ViewMode[];
    minDataWeight?: number;
    requiresAuth?: boolean;
    requiresSphere?: SphereId;
  };
  
  // Navigation
  path?: string;              // Route si c'est une page
  action?: string;            // Action si c'est un bouton
  
  // État
  isActive?: boolean;
  isExpanded?: boolean;
  isCollapsed?: boolean;
}

/**
 * État de navigation global
 */
export interface NavigationState {
  currentPath: string;
  currentSphereId: SphereId | null;
  currentCategoryId: string | null;
  breadcrumbs: BreadcrumbItem[];
  history: string[];
  canGoBack: boolean;
}

/**
 * Élément de fil d'Ariane
 */
export interface BreadcrumbItem {
  id: string;
  label: string;
  emoji: string;
  path: string;
  type: MenuNodeType;
}

// -----------------------------------------------------------------------------
// UNIVERSE VIEW TYPES
// -----------------------------------------------------------------------------

/**
 * Configuration de l'univers
 */
export interface UniverseConfig {
  core: CoreConfig;
  spheres: SphereConfig[];
  agents: AgentConfig[];
}

/**
 * Configuration du Core (Trunk)
 */
export interface CoreConfig {
  label: string;
  emoji: string;
  color: string;
  glowColor: string;
  size: number;
}

/**
 * État visuel calculé d'une sphère (pour le rendu)
 */
export interface SphereVisualData {
  sphere: SphereConfig;
  runtime: SphereRuntimeState;
  
  // Valeurs calculées pour le rendu
  computedSize: number;
  computedGlow: number;
  computedDistance: number;
  computedAngle: number;
  
  // États d'interaction
  isFocused: boolean;
  isHighlighted: boolean;
  isHovered: boolean;
}

/**
 * État visuel calculé d'un agent
 */
export interface AgentVisualData {
  agent: AgentConfig;
  runtime: AgentRuntimeState;
  parentSphere: SphereConfig | null;
  
  // Valeurs calculées
  computedOrbitSpeed: number;
  computedOrbitRadius: number;
  stateColor: string;
  
  isFocused: boolean;
}

// -----------------------------------------------------------------------------
// MINIMAP TYPES
// -----------------------------------------------------------------------------

/**
 * Type de nœud dans la minimap
 */
export type MinimapNodeType = 'core' | 'sphere' | 'agent' | 'category';

/**
 * Nœud de la minimap (représentation simplifiée)
 */
export interface MinimapNode {
  id: string;
  label: string;
  emoji: string;
  type: MinimapNodeType;
  
  // Position polaire
  radius: number;             // Distance du centre (0-1)
  angle: number;              // Position angulaire (radians)
  
  // Taille et activité
  size: number;               // Taille relative (0-1)
  activity: number;           // Niveau d'activité (0-1)
  
  // Hiérarchie
  parentId?: string;
  
  // État
  isCurrent: boolean;
  isPulsing: boolean;
}

/**
 * Mode d'affichage de la minimap
 */
export type MinimapMode = 'full' | 'compact' | 'ring' | 'hidden';

/**
 * Configuration de la minimap
 */
export interface MinimapConfig {
  mode: MinimapMode;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size: 'small' | 'medium' | 'large';
  opacity: number;
  autoHide: boolean;
  autoHideDelay: number;
}

// -----------------------------------------------------------------------------
// MEETING ROOM TYPES
// -----------------------------------------------------------------------------

/**
 * Configuration d'une salle de réunion
 */
export interface MeetingRoomConfig {
  id: string;
  name: string;
  type: 'conference' | 'presentation' | 'workshop' | 'one-on-one';
  capacity: number;
  layout: 'round' | 'theater' | 'classroom' | 'flexible';
}

/**
 * Participant à une réunion
 */
export interface MeetingParticipant {
  id: string;
  name: string;
  type: 'human' | 'agent';
  role: 'host' | 'co-host' | 'presenter' | 'participant' | 'observer';
  agentId?: string;
  avatarUrl?: string;
  isPresent: boolean;
  isMuted: boolean;
  isHandRaised: boolean;
}

/**
 * État d'une session de réunion
 */
export interface MeetingSession {
  id: string;
  roomId: string;
  title: string;
  startedAt: string;
  participants: MeetingParticipant[];
  isRecording: boolean;
  invitedAgents: string[];
  sourceSphereId?: SphereId;
}

// -----------------------------------------------------------------------------
// CONTEXT BRIDGE TYPES
// -----------------------------------------------------------------------------

/**
 * Niveau de consentement pour le Context Bridge
 */
export type ConsentLevel = 'implicit' | 'notify' | 'confirm' | 'explicit' | 'forbidden';

/**
 * Demande de transfert via Context Bridge
 */
export interface BridgeTransferRequest {
  id: string;
  sourceSphere: SphereId;
  targetSphere: SphereId;
  dataType: string;
  transferType: 'reference' | 'summary' | 'copy' | 'move' | 'sync';
  purpose: string;
  requiredConsent: ConsentLevel;
  status: 'pending' | 'approved' | 'denied' | 'completed' | 'failed';
}

// -----------------------------------------------------------------------------
// USER PREFERENCES
// -----------------------------------------------------------------------------

/**
 * Préférences utilisateur pour l'interface
 */
export interface UserPreferences {
  // Mode de vue préféré
  preferredViewMode: ViewMode;
  
  // Minimap
  minimap: MinimapConfig;
  
  // Densité d'information
  informationDensity: 'minimal' | 'standard' | 'dense';
  
  // Animations
  reduceMotion: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  
  // Langue
  language: 'fr' | 'en';
  
  // Notifications
  notificationLevel: 'all' | 'important' | 'critical' | 'none';
  
  // Thème
  theme: 'light' | 'dark' | 'system';
  
  // Accessibilité
  highContrast: boolean;
  largeText: boolean;
}

// -----------------------------------------------------------------------------
// ERROR & STATE TYPES
// -----------------------------------------------------------------------------

/**
 * État d'erreur (doit rester calme visuellement)
 */
export interface ErrorState {
  hasError: boolean;
  errorType?: 'network' | 'auth' | 'data' | 'unknown';
  errorMessage?: string;
  canRetry: boolean;
  isRecoverable: boolean;
}

/**
 * État de chargement
 */
export interface LoadingState {
  isLoading: boolean;
  loadingType?: 'initial' | 'refresh' | 'action';
  progress?: number;
}

/**
 * État global de l'application
 */
export interface AppState {
  // Mode de vue
  viewMode: ViewMode;
  
  // Navigation
  navigation: NavigationState;
  
  // Sphères
  sphereStates: Record<SphereId, SphereRuntimeState>;
  
  // Agents
  agentStates: Record<string, AgentRuntimeState>;
  
  // Focus
  focusedSphereId: SphereId | null;
  focusedAgentId: string | null;
  highlightedSphereId: SphereId | null;
  
  // États globaux
  error: ErrorState;
  loading: LoadingState;
  
  // Préférences
  preferences: UserPreferences;
}

// -----------------------------------------------------------------------------
// EXPORTS UTILITAIRES
// -----------------------------------------------------------------------------

/**
 * Liste des IDs de sphères (pour itération)
 */
export const SPHERE_IDS: SphereId[] = [
  'personal',
  'business',
  'scholar',
  'creative-studio',
  'social-media',
  'methodology',
  'ia-lab',
  'xr-immersive',
  'institutions',
  'my-team'
];

/**
 * Mapping des couleurs par état d'agent
 */
export const AGENT_STATE_COLORS: Record<AgentState, string> = {
  idle: '#38BDF8',
  active: '#22C55E',
  analyzing: '#EAB308',
  warning: '#F97316',
  suspended: '#6B7280'
};

/**
 * Mapping des couleurs par niveau d'agent
 */
export const AGENT_LEVEL_COLORS: Record<AgentLevel, string> = {
  L0: '#A855F7',  // NOVA - Purple
  L1: '#3B82F6',  // Directors - Blue
  L2: '#10B981',  // Managers - Green
  L3: '#6B7280'   // Specialists - Gray
};
