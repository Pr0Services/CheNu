# CHE·NU — KNOWLEDGE THREADS & SPHERE THEMES XR WORLD
**VERSION:** XR-WORLD.v2.0  
**MODE:** FOUNDATION / IMMERSIVE / UNIFIED

---

## 1) KNOWLEDGE THREADS — 3 TYPES ⚡

### 1.1 Vue d'Ensemble ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE THREADS SYSTEM                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Knowledge Threads = liens persistants entre:                    │
│  • Informations  • Meetings  • Documents  • Décisions           │
│  • Personnes     • Agents    • Projets    • Sessions            │
│                                                                  │
│  Ce sont des "FIBRES" de compréhension.                         │
│  Aucune persuasion — uniquement STRUCTURATION.                  │
│                                                                  │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │   FACTUAL     │  │  CONTEXTUAL   │  │  INTENT-SAFE  │       │
│  │   THREAD      │  │    THREAD     │  │    THREAD     │       │
│  │               │  │               │  │               │       │
│  │  Pure Info    │  │   Relations   │  │  Pourquoi     │       │
│  │  Immuable     │  │   Patterns    │  │  Technique    │       │
│  │  Vérifiable   │  │   Neutres     │  │  Fonctionnel  │       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 FACTUAL THREAD ⚡

```yaml
factual_thread:
  id: "THREAD_FACTUAL"
  name: "Factual Thread"
  description: "Pure information, aucune interprétation"
  
  content:
    - events: "Événements datés"
    - documents: "Fichiers et artefacts"
    - decisions: "Décisions enregistrées"
    - dates: "Timestamps précis"
    - sources: "Origine vérifiable"
    
  rules:
    immuable: true
    verifiable: true
    non_narratif: true
    interpretation: "FORBIDDEN"
    opinion: "FORBIDDEN"
    
  usage:
    - audit: "Traçabilité complète"
    - replay: "Reconstitution exacte"
    - analyse_objective: "Données brutes"
    
  schema:
    thread_id: "uuid"
    type: "factual"
    facts: [
      {
        fact_id: "uuid"
        timestamp: "iso8601"
        content: "string"
        source: {
          type: "user|agent|system|document|meeting"
          id: "string"
          verified: "boolean"
        }
        immutable_hash: "sha256"
        linked_entities: ["entity_id"]
      }
    ]
    
  examples:
    - "Soumission #1234 envoyée le 2025-06-15 à 14:32"
    - "Document contrat_ABC.pdf ajouté par Jean"
    - "Réunion projet X terminée à 15:00"
    - "RBQ licence vérifiée: statut ACTIVE"
```

### 1.3 CONTEXTUAL THREAD ⚡

```yaml
contextual_thread:
  id: "THREAD_CONTEXTUAL"
  name: "Contextual Thread"
  description: "Relations entre éléments, sans jugement"
  
  content:
    - sphere_links: "Liens entre sphères"
    - theme_links: "Liens entre thèmes"
    - person_agent_links: "Liens personnes/agents"
    - project_session_links: "Liens projets/sessions"
    
  rules:
    contextualise: true
    explique: false  # Contextualise, n'explique pas
    patterns_neutres: true
    jugement: "FORBIDDEN"
    meilleur_choix: "NEVER SUGGEST"
    
  usage:
    - navigation: "Trouver son chemin"
    - classification: "Organiser"
    - dependencies: "Comprendre les dépendances"
    
  schema:
    thread_id: "uuid"
    type: "contextual"
    links: [
      {
        link_id: "uuid"
        from: {
          type: "sphere|theme|person|agent|project|session"
          id: "string"
        }
        to: {
          type: "sphere|theme|person|agent|project|session"
          id: "string"
        }
        relationship: "related_to|part_of|follows|precedes|concurrent"
        strength: "float"  # 0-1, frequency-based
        bidirectional: "boolean"
        created_at: "iso8601"
      }
    ]
    patterns: [
      {
        pattern_id: "uuid"
        description: "string"  # Neutral description
        entities: ["entity_id"]
        frequency: "integer"
        neutral: true  # Must always be true
      }
    ]
    
  examples:
    - "Projet A est lié à Sphère Business"
    - "Agent Estimator intervient dans Scholar et Business"
    - "Session de ce matin suit réunion d'hier"
```

### 1.4 INTENT-SAFE THREAD ⚡

```yaml
intent_safe_thread:
  id: "THREAD_INTENT_SAFE"
  name: "Intent-Safe Thread"
  description: "'Pourquoi technique', jamais émotionnel"
  
  content:
    - raison_fonctionnelle: "Pourquoi technique"
    - objectif_declare: "But explicite"
    - etat_attendu: "Résultat visé"
    - contraintes_techniques: "Limitations"
    
  rules:
    attribution_psychologique: "FORBIDDEN"
    inference_personnelle: "FORBIDDEN"
    jugement_valeur: "FORBIDDEN"
    emotion: "NEVER REFERENCED"
    
  usage:
    - planification: "Définir les étapes"
    - architecture: "Design technique"
    - xr_navigation: "Guidage neutre en XR"
    
  schema:
    thread_id: "uuid"
    type: "intent_safe"
    intents: [
      {
        intent_id: "uuid"
        functional_reason: "string"  # Technical why
        declared_objective: "string"
        expected_state: "string"
        technical_constraints: ["string"]
        
        # FORBIDDEN FIELDS (never populate)
        emotional_reason: null  # ALWAYS NULL
        personal_motivation: null  # ALWAYS NULL
        value_judgment: null  # ALWAYS NULL
      }
    ]
    
  examples:
    - "Objectif: Générer soumission avant deadline 17h"
    - "Contrainte: Budget max 500K$"
    - "État attendu: Document PDF conforme RBQ"
    
  anti_patterns:
    forbidden_phrases:
      - "L'utilisateur veut probablement..."
      - "Il semble préférer..."
      - "C'est mieux de..."
      - "Le meilleur choix serait..."
```

---

## 2) WORLD THEMES — 4 UNIVERS VISUELS ⚡

### 2.1 Les 4 Thèmes Universels ⚡

```yaml
world_themes:
  
  ancient:
    id: "THEME_ANCIENT"
    name: "Ancient"
    essence: "Civilisations, pierre, mystique sobre"
    
    visual_elements:
      - stone: "Pierre taillée, temples"
      - tablets: "Tablettes gravées"
      - torches: "Éclairage chaleureux"
      - symbols: "Glyphes, runes neutres"
      - architecture: "Colonnes, arches"
      
    ambiance:
      lighting: "warm_golden"
      sound: "ambient_wind_stone"
      movement: "slow_deliberate"
      
    ui_adaptation:
      buttons: "carved_stone"
      text: "serif_ancient"
      icons: "glyph_style"
      
  giant_tree:
    id: "THEME_GIANT_TREE"
    name: "Giant Tree"
    essence: "Forêt, racines, croissance, organique"
    
    visual_elements:
      - trunk: "Tronc massif central"
      - branches: "Plateformes naturelles"
      - roots: "Fondations profondes"
      - leaves: "Données vivantes"
      - vines: "Connexions organiques"
      - sap: "Flux d'information"
      
    ambiance:
      lighting: "dappled_green"
      sound: "forest_ambient"
      movement: "organic_flow"
      
    ui_adaptation:
      buttons: "wooden_natural"
      text: "organic_serif"
      icons: "leaf_branch_style"
      
  futuristic:
    id: "THEME_FUTURISTIC"
    name: "Futuristic"
    essence: "Hologrammes, lumière, verre"
    
    visual_elements:
      - glass: "Surfaces translucides"
      - holograms: "Projections 3D"
      - light: "Néons, lasers"
      - modules: "Composants détachables"
      - interfaces: "Touch holographique"
      
    ambiance:
      lighting: "cool_blue_white"
      sound: "subtle_electronic"
      movement: "precise_smooth"
      
    ui_adaptation:
      buttons: "glass_glow"
      text: "sans_serif_clean"
      icons: "minimalist_neon"
      
  cosmic:
    id: "THEME_COSMIC"
    name: "Cosmic"
    essence: "Astral, silencieux, spatial"
    
    visual_elements:
      - stars: "Champs stellaires"
      - orbits: "Trajectoires circulaires"
      - nebulae: "Couleurs diffuses"
      - stations: "Structures orbitales"
      - silence: "Vide spatial"
      - light_spheres: "Orbes lumineux"
      
    ambiance:
      lighting: "deep_space_accent"
      sound: "near_silence_subtle"
      movement: "floating_zero_g"
      
    ui_adaptation:
      buttons: "orb_floating"
      text: "thin_futuristic"
      icons: "constellation_style"
```

---

## 3) SPHERES — 11 DOMAINES ⚡

### 3.1 Architecture des Sphères ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    11 SPHERES OF CHE·NU                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│   │PERSONNEL│  │ SOCIAL  │  │ SCHOLAR │  │BUSINESS │           │
│   │    1    │  │ & MEDIA │  │    3    │  │    4    │           │
│   └─────────┘  │    2    │  └─────────┘  └─────────┘           │
│                └─────────┘                                       │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│   │CREATIVE │  │ INSTITU-│  │METHODOL-│  │   XR    │           │
│   │ STUDIO  │  │  TIONS  │  │   OGY   │  │IMMERSIVE│           │
│   │    5    │  │    6    │  │    7    │  │    8    │           │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘           │
│                                                                  │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐                        │
│   │ENTERTAIN│  │   IA    │  │ MY TEAM │                        │
│   │  MENT   │  │  LAB    │  │ (Agents)│                        │
│   │    9    │  │   10    │  │   11    │                        │
│   └─────────┘  └─────────┘  └─────────┘                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Sphère 1: PERSONNEL ⚡

```yaml
sphere_personnel:
  id: "SPHERE_PERSONNEL"
  number: 1
  name: "Personnel"
  description: "Espace personnel de l'utilisateur"
  
  themed_locations:
    
    ancient:
      name: "Petit sanctuaire en pierre"
      elements:
        - talisman_mural: "Base de données personnelle"
        - altar: "Point de méditation/focus"
      agents_present: ["L3_PERSONAL_ASSISTANT"]
      
    giant_tree:
      name: "Cabane lumineuse dans le tronc"
      elements:
        - mini_sphere: "Notes & rappels (toujours portée)"
        - tree_house: "Maison complète au centre"
        - nest: "Zone de repos/réflexion"
      agents_present: ["L3_PERSONAL_ASSISTANT", "L3_REMINDER"]
      
    futuristic:
      name: "Pod translucide personnel"
      elements:
        - holo_interface: "Interface holographique"
        - data_stream: "Flux personnel"
      agents_present: ["L3_PERSONAL_ASSISTANT"]
      
    cosmic:
      name: "Petite station orbitale"
      elements:
        - memory_sphere: "Sphère mémoire flottante"
        - observation_deck: "Vue sur l'univers personnel"
      agents_present: ["L3_PERSONAL_ASSISTANT"]
      
  features:
    - personal_database
    - notes_reminders
    - private_documents
    - preferences_settings
```

### 3.3 Sphère 2: SOCIAL & MEDIA ⚡

```yaml
sphere_social_media:
  id: "SPHERE_SOCIAL_MEDIA"
  number: 2
  name: "Social & Media"
  description: "Interactions sociales et médias"
  
  themed_locations:
    
    ancient:
      name: "Agora en pierre"
      elements:
        - public_square: "Place publique de discussion"
        - speaker_platform: "Tribune"
      agents_present: ["L3_SOCIAL_CURATOR"]
      
    giant_tree:
      name: "Terrasse de branches"
      elements:
        - vine_screens: "Lianes-écrans"
        - branch_seating: "Places naturelles"
      agents_present: ["L3_SOCIAL_CURATOR"]
      
    futuristic:
      name: "Hub de connexion"
      elements:
        - floating_feeds: "Flux media en suspension"
        - connection_nodes: "Points de contact"
      agents_present: ["L3_SOCIAL_CURATOR", "L3_MEDIA_FILTER"]
      
    cosmic:
      name: "Anneaux orbitaux de communication"
      elements:
        - comm_rings: "Anneaux de messages"
        - signal_streams: "Flux de signaux"
      agents_present: ["L3_SOCIAL_CURATOR"]
```

### 3.4 Sphère 3: SCHOLAR (Éducation) ⚡

```yaml
sphere_scholar:
  id: "SPHERE_SCHOLAR"
  number: 3
  name: "Scholar"
  description: "Éducation et apprentissage"
  
  themed_locations:
    
    ancient:
      name: "Grande bibliothèque templière"
      elements:
        - scroll_archives: "Archives de rouleaux"
        - reading_alcoves: "Alcôves de lecture"
        - stone_tablets: "Tablettes de savoir"
      agents_present: ["L2_RESEARCHER", "L3_KNOWLEDGE_BASE"]
      
    giant_tree:
      name: "Serre-bibliothèque vivante"
      elements:
        - book_leaves: "Livres-feuilles qui s'ouvrent"
        - knowledge_vines: "Lianes de connaissances"
        - study_branches: "Branches d'étude"
      agents_present: ["L2_RESEARCHER", "L3_LEARNING_PATH"]
      
    futuristic:
      name: "Data-center éducatif translucide"
      elements:
        - holo_lessons: "Leçons holographiques"
        - data_streams: "Flux de données éducatives"
      agents_present: ["L2_RESEARCHER", "L3_AI_TUTOR"]
      
    cosmic:
      name: "Bibliothèque lunaire"
      elements:
        - moon_library: "Bibliothèque sur la lune"
        - lunar_dome: "Salles de cours en dôme"
        - star_charts: "Cartes stellaires du savoir"
      agents_present: ["L2_RESEARCHER"]
```

### 3.5 Sphère 4: BUSINESS / ENTERPRISE ⚡

```yaml
sphere_business:
  id: "SPHERE_BUSINESS"
  number: 4
  name: "Business / Enterprise"
  description: "Activités commerciales et gestion"
  
  themed_locations:
    
    ancient:
      name: "Hall marchant"
      elements:
        - stone_counters: "Comptoirs en pierre"
        - trade_registers: "Registres de commerce"
        - merchant_hall: "Grande salle marchande"
      agents_present: ["L1_CHIEF_BUSINESS", "L2_ESTIMATOR"]
      
    giant_tree:
      name: "Plateformes commerciales"
      elements:
        - branch_markets: "Marchés dans les branches"
        - trading_platforms: "Plateformes d'échange"
        - sap_ledgers: "Registres de sève (flux)"
      agents_present: ["L1_CHIEF_BUSINESS", "L2_PROJECT_MANAGER"]
      
    futuristic:
      name: "Tour de verre"
      elements:
        - glass_tower: "Tour transparente"
        - modular_rooms: "Salles de gestion modulaires"
        - holo_dashboards: "Tableaux de bord holographiques"
      agents_present: ["L1_CHIEF_BUSINESS", "L2_ANALYTICS"]
      
    cosmic:
      name: "Station orbitale de négociation"
      elements:
        - orbital_boardroom: "Salle du conseil orbital"
        - trade_satellites: "Satellites de commerce"
      agents_present: ["L1_CHIEF_BUSINESS"]
      
  # CONSTRUCTION SPECIFIC (CHE·NU)
  construction_extension:
    agents_present:
      - "L1_CHIEF_CONSTRUCTION"
      - "L2_ESTIMATOR"
      - "L2_PROJECT_MANAGER"
      - "L2_SITE_SUPERVISOR"
      - "L3_TAKEOFF_*"
      - "L3_PRICING_*"
```

### 3.6 Sphère 5: CREATIVE STUDIO ⚡

```yaml
sphere_creative:
  id: "SPHERE_CREATIVE"
  number: 5
  name: "Creative Studio"
  description: "Création artistique et design"
  
  themed_locations:
    
    ancient:
      name: "Atelier de sculpture"
      elements:
        - stone_workshop: "Atelier de pierre"
        - carving_tools: "Outils de gravure"
      agents_present: ["L2_CREATIVE_DIRECTOR"]
      
    giant_tree:
      name: "Atelier suspendu"
      elements:
        - vine_brushes: "Lianes-brush"
        - living_palettes: "Palettes vivantes"
        - organic_canvas: "Toiles organiques"
      agents_present: ["L2_CREATIVE_DIRECTOR", "L3_DESIGN_ASSISTANT"]
      
    futuristic:
      name: "Studio holographique"
      elements:
        - holo_canvas: "Toile holographique"
        - light_tools: "Outils de lumière"
        - 3d_sculpting: "Sculpture 3D"
      agents_present: ["L2_CREATIVE_DIRECTOR", "L3_3D_MODELER"]
      
    cosmic:
      name: "Salle de peinture en gravité réduite"
      elements:
        - zero_g_studio: "Studio zéro gravité"
        - floating_paints: "Peintures flottantes"
      agents_present: ["L2_CREATIVE_DIRECTOR"]
```

### 3.7 Sphère 6: INSTITUTIONS / GOVERNANCE ⚡

```yaml
sphere_institutions:
  id: "SPHERE_INSTITUTIONS"
  number: 6
  name: "Institutions / Governance"
  description: "Cadre légal et gouvernance"
  
  themed_locations:
    
    ancient:
      name: "Tribunal en pierre neutre"
      elements:
        - neutral_court: "Cour neutre"
        - no_power_scale: "PAS d'échelle de pouvoir visuelle"
        - equal_seating: "Sièges égaux"
      agents_present: ["L1_CHIEF_LEGAL", "L2_COMPLIANCE"]
      
    giant_tree:
      name: "Racines de la loi"
      elements:
        - thick_roots: "Racines épaisses = loi fondamentale"
        - root_chambers: "Chambres racinaires"
      agents_present: ["L1_CHIEF_LEGAL"]
      
    futuristic:
      name: "Salle de règles auto-holographiques"
      elements:
        - auto_rules: "Règles qui s'affichent automatiquement"
        - compliance_scanner: "Vérificateur de conformité"
      agents_present: ["L1_CHIEF_LEGAL", "L2_COMPLIANCE", "L3_RBQ_VERIFIER"]
      
    cosmic:
      name: "Salle d'arbitrage silencieuse"
      elements:
        - silent_chamber: "Chambre silencieuse"
        - integrity_sphere: "Sphère lumineuse d'intégrité"
      agents_present: ["L0_ETHICAL_GUARDIAN"]
      
  # L0 CONSTITUTIONAL PRESENCE
  l0_presence: true
  constitutional_agents:
    - "L0_ETHICAL_GUARDIAN"
    - "L0_SAFETY_MONITOR"
```

### 3.8 Sphère 7: METHODOLOGY ⚡

```yaml
sphere_methodology:
  id: "SPHERE_METHODOLOGY"
  number: 7
  name: "Methodology"
  description: "Processus et méthodologies"
  
  themed_locations:
    
    ancient:
      name: "Salle d'études géométriques"
      elements:
        - geometric_floor: "Sol avec motifs géométriques"
        - pattern_walls: "Murs de patterns"
      agents_present: ["L2_PROCESS_DESIGNER"]
      
    giant_tree:
      name: "Lignes de sève"
      elements:
        - sap_lines: "Lignes de sève = workflows"
        - flow_branches: "Branches de flux"
      agents_present: ["L2_PROCESS_DESIGNER", "L3_WORKFLOW_EXECUTOR"]
      
    futuristic:
      name: "Poste logique fractal"
      elements:
        - fractal_station: "Station fractale"
        - logic_grids: "Grilles logiques"
      agents_present: ["L2_PROCESS_DESIGNER"]
      
    cosmic:
      name: "Salle nodale multi-dimensionnelle"
      elements:
        - node_room: "Salle de nœuds"
        - dimensional_links: "Liens multi-dimensionnels"
      agents_present: ["L2_PROCESS_DESIGNER"]
```

### 3.9 Sphère 8: XR / IMMERSIVE ⚡

```yaml
sphere_xr:
  id: "SPHERE_XR"
  number: 8
  name: "XR / Immersive"
  description: "Réalité étendue et expériences immersives"
  
  themed_locations:
    
    ancient:
      name: "Amphithéâtre circulaire"
      elements:
        - circular_theater: "Théâtre à 360°"
        - projection_walls: "Murs de projection"
      agents_present: ["L2_XR_DIRECTOR"]
      
    giant_tree:
      name: "Canopée immersive ouverte"
      elements:
        - open_canopy: "Canopée ouverte"
        - immersive_leaves: "Feuilles immersives"
      agents_present: ["L2_XR_DIRECTOR"]
      
    futuristic:
      name: "Salle XR modulable"
      elements:
        - modular_xr: "Espace reconfiguable"
        - holo_projectors: "Projecteurs holographiques"
      agents_present: ["L2_XR_DIRECTOR", "L3_VR_BUILDER"]
      
    cosmic:
      name: "Dôme stellaire"
      elements:
        - stellar_dome: "Dôme de projection stellaire"
        - 360_cosmos: "Vue cosmique 360°"
      agents_present: ["L2_XR_DIRECTOR"]
```

### 3.10 Sphère 9: ENTERTAINMENT ⚡

```yaml
sphere_entertainment:
  id: "SPHERE_ENTERTAINMENT"
  number: 9
  name: "Entertainment / Divertissement"
  description: "Loisirs et divertissement"
  
  themed_locations:
    
    ancient:
      name: "Arène de jeux simples"
      elements:
        - simple_arena: "Arène basique"
        - game_stones: "Pierres de jeu"
      agents_present: ["L3_ENTERTAINMENT_HOST"]
      
    giant_tree:
      name: "Plateau ludique suspendu"
      elements:
        - hanging_platform: "Plateforme suspendue"
        - game_branches: "Branches de jeu"
      agents_present: ["L3_ENTERTAINMENT_HOST"]
      
    futuristic:
      name: "Salle de simulation"
      elements:
        - sim_room: "Salle de simulation"
        - experience_pods: "Pods d'expérience"
      agents_present: ["L3_ENTERTAINMENT_HOST", "L3_GAME_MASTER"]
      
    cosmic:
      name: "Plateformes flottantes d'activités"
      elements:
        - floating_platforms: "Plateformes en apesanteur"
        - cosmic_games: "Jeux cosmiques"
      agents_present: ["L3_ENTERTAINMENT_HOST"]
```

### 3.11 Sphère 10: IA LABORATORY ⚡

```yaml
sphere_ia_lab:
  id: "SPHERE_IA_LAB"
  number: 10
  name: "IA Laboratory"
  description: "Recherche et développement IA"
  
  themed_locations:
    
    ancient:
      name: "Atelier de chercheurs"
      elements:
        - stone_tablets: "Tablettes de pierre"
        - research_scrolls: "Rouleaux de recherche"
      agents_present: ["L1_CHIEF_IA", "L2_RESEARCHER"]
      
    giant_tree:
      name: "Laboratoire racinaire"
      elements:
        - organic_lab: "Laboratoire organique"
        - root_networks: "Réseaux racinaires"
      agents_present: ["L1_CHIEF_IA", "L2_ML_ENGINEER"]
      
    futuristic:
      name: "Chambre IA blanche"
      elements:
        - white_chamber: "Chambre blanche"
        - graphic_interfaces: "Interfaces graphiques"
        - neural_displays: "Affichages neuronaux"
      agents_present: ["L1_CHIEF_IA", "L2_ML_ENGINEER", "L3_MODEL_TRAINER"]
      
    cosmic:
      name: "Module de recherche orbitale"
      elements:
        - orbital_module: "Module orbital"
        - strict_ethics_separation: "Séparations éthiques TRÈS STRICTES"
      agents_present: ["L0_ETHICAL_GUARDIAN", "L1_CHIEF_IA"]
      
  # ETHICAL OVERSIGHT
  l0_oversight: true
  ethical_constraints:
    - "Séparations éthiques strictes"
    - "Audit permanent L0"
    - "Pas d'auto-modification sans approbation humaine"
```

### 3.12 Sphère 11: MY TEAM (Agents) ⚡

```yaml
sphere_my_team:
  id: "SPHERE_MY_TEAM"
  number: 11
  name: "My Team"
  description: "Équipe d'agents personnels"
  
  themed_locations:
    
    ancient:
      name: "Salle du conseil"
      elements:
        - council_room: "Salle du conseil"
        - animated_statues: "Chaque agent = statue animée légère"
        - round_table: "Table ronde (égalité)"
      agents_present: ["ALL_USER_AGENTS"]
      
    giant_tree:
      name: "Niches dans l'arbre"
      elements:
        - role_niches: "Niches représentant chaque rôle"
        - branch_stations: "Stations dans les branches"
      agents_present: ["ALL_USER_AGENTS"]
      
    futuristic:
      name: "Pods d'agents alignés"
      elements:
        - aligned_pods: "Pods minimalistes"
        - status_displays: "Affichages de statut"
        - connection_lines: "Lignes de connexion"
      agents_present: ["ALL_USER_AGENTS"]
      
    cosmic:
      name: "Constellation d'icônes"
      elements:
        - floating_icons: "Icônes flottantes silencieuses"
        - constellation_map: "Carte constellation"
        - orbital_positions: "Positions orbitales"
      agents_present: ["ALL_USER_AGENTS"]
      
  # AGENT VISUALIZATION
  agent_display:
    L0: "Étoile centrale (rare/protectrice)"
    L1: "Grandes icônes stables"
    L2: "Icônes moyennes actives"
    L3: "Petites icônes nombreuses"
```

---

## 4) SIZE LOGIC — GROSSEUR ADAPTATIVE ⚡

### 4.1 Règle Fondamentale ⚡

```yaml
size_logic:
  
  rule: "Grosseur = densité d'information + activité"
  principle: "JAMAIS dominance psychologique"
  
  sizes:
    
    small:
      criteria: "Faible activité"
      indicators:
        - activity_level: "< 10% temps actif"
        - thread_count: "< 5"
        - artifact_count: "< 10"
      visual_scale: 0.5
      
    medium:
      criteria: "Usage régulier, interactions stables"
      indicators:
        - activity_level: "10-50% temps actif"
        - thread_count: "5-20"
        - artifact_count: "10-50"
      visual_scale: 1.0
      
    large:
      criteria: "Plusieurs sous-sphères actives, threads multiples"
      indicators:
        - activity_level: "50-80% temps actif"
        - thread_count: "20-100"
        - artifact_count: "50-200"
        - sub_spheres_active: "> 3"
      visual_scale: 1.5
      
    giant:
      criteria: "Domaine central de l'utilisateur"
      indicators:
        - activity_level: "> 80% temps actif"
        - thread_count: "> 100"
        - artifact_count: "> 200"
        - user_authorization: "REQUIRED"
      visual_scale: 2.0
      examples:
        - "Scholar pour un étudiant"
        - "Business pour un entrepreneur"
        
  dynamic_adjustment:
    frequency: "continuous"
    smoothing: true
    transition_duration: "2s"
    
  forbidden:
    - "Size based on importance judgment"
    - "Size based on user preference alone"
    - "Size manipulation for persuasion"
```

---

## 5) MINI-SPHERES PERSONNELLES ⚡

### 5.1 Concept ⚡

```yaml
mini_spheres:
  
  concept: "Mini-sphère personnelle TOUJOURS accessible partout"
  
  types:
    
    micro_sphere:
      name: "Micro-sphere"
      content: "Notes & rappels rapides"
      size: "Small, portable"
      always_visible: true
      placement_by_theme:
        ancient: "Amulette au cou"
        giant_tree: "Rameau lumineux porté"
        futuristic: "Module bracelet"
        cosmic: "Petite orbite personnelle"
        
    home_sphere:
      name: "Home-sphere"
      content: "Tous les data personnels"
      size: "Medium, expandable"
      access: "On demand"
      placement_by_theme:
        ancient: "Sanctuaire miniature invoqué"
        giant_tree: "Cabane qui apparaît"
        futuristic: "Pod qui se matérialise"
        cosmic: "Station qui arrive en orbite"
        
  features:
    
    quick_deposit:
      description: "Dépôt rapide d'idées"
      gesture: "Double-tap or voice"
      
    instant_access:
      description: "Consultation instantanée"
      gesture: "Hold gesture"
      
    instant_save:
      description: "Sauvegarde instantanée"
      auto: true
      sync: "real-time"
      
  placement:
    - theme: "ancient"
      location: "Accrochée comme talisman"
    - theme: "giant_tree"
      location: "Logée dans un rameau"
    - theme: "futuristic"
      location: "Intégrée dans un module portable"
    - theme: "cosmic"
      location: "En orbite personnelle proche"
```

---

## 6) MAPPING AGENTS → SPHERES ⚡

### 6.1 Distribution des 168 Agents ⚡

```yaml
agent_sphere_mapping:

  sphere_personnel:
    L3_agents:
      - "L3_PERSONAL_ASSISTANT"
      - "L3_REMINDER"
      - "L3_NOTE_TAKER"
      
  sphere_social_media:
    L3_agents:
      - "L3_SOCIAL_CURATOR"
      - "L3_MEDIA_FILTER"
      - "L3_COMM_HANDLER"
      
  sphere_scholar:
    L2_agents:
      - "L2_RESEARCHER"
    L3_agents:
      - "L3_KNOWLEDGE_BASE"
      - "L3_LEARNING_PATH"
      - "L3_AI_TUTOR"
      
  sphere_business:
    L1_agents:
      - "L1_CHIEF_CONSTRUCTION"
      - "L1_CHIEF_FINANCE"
      - "L1_CHIEF_OPERATIONS"
    L2_agents:
      - "L2_ESTIMATOR"
      - "L2_PROJECT_MANAGER"
      - "L2_SCHEDULER"
      - "L2_BOOKKEEPER"
      - "L2_INVOICING"
    L3_agents:
      - "L3_TAKEOFF_*" # 8 agents
      - "L3_PRICING_*" # 4 agents
      - "L3_INVOICE_GENERATOR"
      - "L3_PAYMENT_PROCESSOR"
      
  sphere_creative:
    L2_agents:
      - "L2_CREATIVE_DIRECTOR"
    L3_agents:
      - "L3_DESIGN_ASSISTANT"
      - "L3_3D_MODELER"
      - "L3_RENDER_ENGINE"
      
  sphere_institutions:
    L0_agents:
      - "L0_ETHICAL_GUARDIAN"
      - "L0_SAFETY_MONITOR"
    L1_agents:
      - "L1_CHIEF_LEGAL"
    L2_agents:
      - "L2_COMPLIANCE"
      - "L2_CONTRACT_MANAGER"
    L3_agents:
      - "L3_RBQ_VERIFIER"
      - "L3_CNESST_CHECKER"
      - "L3_CCQ_VALIDATOR"
      
  sphere_methodology:
    L2_agents:
      - "L2_PROCESS_DESIGNER"
    L3_agents:
      - "L3_WORKFLOW_EXECUTOR"
      - "L3_CHECKLIST_RUNNER"
      
  sphere_xr:
    L2_agents:
      - "L2_XR_DIRECTOR"
    L3_agents:
      - "L3_VR_BUILDER"
      - "L3_AR_OVERLAY"
      - "L3_SPATIAL_MAPPER"
      
  sphere_entertainment:
    L3_agents:
      - "L3_ENTERTAINMENT_HOST"
      - "L3_GAME_MASTER"
      
  sphere_ia_lab:
    L0_agents:
      - "L0_CONSTITUTIONAL_AUDITOR"  # Oversight
    L1_agents:
      - "L1_CHIEF_IA"
    L2_agents:
      - "L2_ML_ENGINEER"
    L3_agents:
      - "L3_MODEL_TRAINER"
      - "L3_DATA_PROCESSOR"
      
  sphere_my_team:
    content: "ALL agents assigned to user"
    visualization: "Constellation view"
```

---

## 7) THREAD ↔ SPHERE INTEGRATION ⚡

```yaml
thread_sphere_integration:

  factual_threads:
    stored_in: "Origin sphere of fact"
    cross_sphere_visible: true
    example: |
      Factual thread about invoice:
      - Origin: Business sphere
      - Visible in: Institutions (compliance)
      
  contextual_threads:
    stored_in: "Methodology sphere (central)"
    links_visible: "All related spheres"
    example: |
      Contextual thread linking project:
      - Links: Business ↔ Scholar ↔ Creative
      - Navigation: Shows path between spheres
      
  intent_safe_threads:
    stored_in: "Origin sphere of intent"
    xr_navigation: true
    example: |
      Intent-safe thread for soumission:
      - Origin: Business sphere
      - XR guide: Neutral navigation to completion
```

---

## 8) XR NAVIGATION ⚡

```yaml
xr_navigation:

  between_spheres:
    visual: "Threads as visible connections"
    interaction: "Follow thread to navigate"
    animation: "Smooth transition between themes"
    
  within_sphere:
    visual: "Sub-locations as areas"
    interaction: "Walk/fly to location"
    agents: "Visible in their stations"
    
  mini_sphere_access:
    gesture: "Quick access gesture"
    always_available: true
    overlay: "Non-intrusive"
    
  theme_consistency:
    rule: "Each sphere maintains chosen theme"
    transition: "Smooth blend at boundaries"
    user_choice: "Can set per-sphere or global"
```

---

**END — KNOWLEDGE THREADS & SPHERE THEMES XR WORLD v2.0**
