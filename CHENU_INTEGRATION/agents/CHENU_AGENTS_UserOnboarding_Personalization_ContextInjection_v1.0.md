# CHE·NU — USER ONBOARDING & CONTEXT INJECTION SYSTEM
**VERSION:** ONBOARDING.v1.0  
**MODE:** FOUNDATION / PERSONALIZATION / PRODUCTION

---

## 1) ARCHITECTURE ONBOARDING ⚡

### 1.1 Vue d'Ensemble ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER ONBOARDING FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  SIGNUP  │───▶│  PROFILE │───▶│ INDUSTRY │───▶│  AGENTS  │  │
│  │  Basic   │    │  Company │    │ Specific │    │  Config  │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │               │               │               │         │
│       ▼               ▼               ▼               ▼         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              USER CONTEXT OBJECT                          │  │
│  │  { user_id, company, industry, prefs, agents_config }    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              CONTEXT INJECTION ENGINE                     │  │
│  │     Injects user context into all agent prompts          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2) ÉTAPES D'ONBOARDING ⚡

### 2.1 Étape 1: Informations de Base ⚡

```yaml
onboarding_step_1:
  id: "STEP_BASIC"
  name: "Informations de Base"
  required: true
  
  fields:
    
    user_name:
      type: "text"
      label: "Votre nom complet"
      required: true
      validation: "min_length: 2"
      
    email:
      type: "email"
      label: "Courriel professionnel"
      required: true
      validation: "valid_email"
      
    phone:
      type: "phone"
      label: "Téléphone"
      required: false
      format: "canadian"
      
    preferred_language:
      type: "select"
      label: "Langue préférée"
      required: true
      options:
        - value: "fr"
          label: "Français"
        - value: "en"
          label: "English"
      default: "fr"
      
    timezone:
      type: "timezone"
      label: "Fuseau horaire"
      required: true
      default: "America/Montreal"
      auto_detect: true
```

### 2.2 Étape 2: Profil Entreprise ⚡

```yaml
onboarding_step_2:
  id: "STEP_COMPANY"
  name: "Profil Entreprise"
  required: true
  
  fields:
    
    company_name:
      type: "text"
      label: "Nom de l'entreprise"
      required: true
      
    company_legal_name:
      type: "text"
      label: "Raison sociale (si différente)"
      required: false
      
    neq:
      type: "text"
      label: "Numéro d'entreprise du Québec (NEQ)"
      required: false
      validation: "neq_format"
      help: "10 chiffres"
      
    company_industry:
      type: "select"
      label: "Secteur d'activité principal"
      required: true
      options:
        - value: "construction_general"
          label: "Construction générale"
          triggers: "construction_onboarding"
        - value: "construction_residential"
          label: "Construction résidentielle"
          triggers: "construction_onboarding"
        - value: "construction_commercial"
          label: "Construction commerciale"
          triggers: "construction_onboarding"
        - value: "construction_civil"
          label: "Génie civil et voirie"
          triggers: "construction_onboarding"
        - value: "professional_services"
          label: "Services professionnels"
        - value: "retail"
          label: "Commerce de détail"
        - value: "manufacturing"
          label: "Fabrication"
        - value: "technology"
          label: "Technologie"
        - value: "other"
          label: "Autre"
          
    company_size:
      type: "select"
      label: "Taille de l'entreprise"
      required: true
      options:
        - value: "solo"
          label: "Travailleur autonome"
        - value: "micro"
          label: "1-5 employés"
        - value: "small"
          label: "6-25 employés"
        - value: "medium"
          label: "26-100 employés"
        - value: "large"
          label: "101-500 employés"
        - value: "enterprise"
          label: "500+ employés"
          
    user_role:
      type: "text"
      label: "Votre titre/poste"
      required: true
      
    user_responsibilities:
      type: "multi_select"
      label: "Vos responsabilités principales"
      required: true
      options:
        - "Gestion de projets"
        - "Estimation et soumissions"
        - "Supervision de chantier"
        - "Comptabilité et finance"
        - "Ressources humaines"
        - "Ventes et développement"
        - "Direction générale"
        - "Administration"
        - "Autre"
```

### 2.3 Étape 3: Spécifique Construction (Conditionnel) ⚡

```yaml
onboarding_step_3_construction:
  id: "STEP_CONSTRUCTION"
  name: "Profil Construction"
  required: true
  condition: "company_industry STARTS_WITH 'construction'"
  
  fields:
    
    rbq_license:
      type: "text"
      label: "Numéro de licence RBQ"
      required: true
      validation: "rbq_format"
      format: "####-####-##"
      verify_api: true
      help: "Format: 1234-5678-90"
      
    rbq_categories:
      type: "multi_select"
      label: "Catégories de licence"
      required: true
      options:
        - value: "1.1.1"
          label: "1.1.1 - Bâtiments résidentiels neufs"
        - value: "1.1.2"
          label: "1.1.2 - Petits bâtiments résidentiels neufs"
        - value: "1.2"
          label: "1.2 - Bâtiments résidentiels (rénovation)"
        - value: "1.3"
          label: "1.3 - Bâtiments publics"
        - value: "1.4"
          label: "1.4 - Bâtiments industriels"
        - value: "1.5"
          label: "1.5 - Bâtiments commerciaux"
        - value: "2.1"
          label: "2.1 - Routes et canalisations"
        - value: "2.2"
          label: "2.2 - Ouvrages de génie civil"
        - value: "3"
          label: "3 - Mécanique"
        - value: "4"
          label: "4 - Électricité"
          
    cnesst_registration:
      type: "text"
      label: "Numéro d'inscription CNESST"
      required: true
      verify_api: true
      
    ccq_region:
      type: "select"
      label: "Région CCQ"
      required: true
      options:
        - "Abitibi-Témiscamingue"
        - "Bas-Saint-Laurent–Gaspésie"
        - "Côte-Nord"
        - "Estrie"
        - "Île-de-Montréal"
        - "Laurentides-Lanaudière"
        - "Mauricie–Bois-Francs"
        - "Montérégie"
        - "Outaouais"
        - "Québec"
        - "Saguenay–Lac-Saint-Jean"
        
    typical_project_size:
      type: "select"
      label: "Taille typique des projets"
      required: true
      options:
        - value: "small"
          label: "< 100 000 $"
        - value: "medium"
          label: "100 000 $ - 500 000 $"
        - value: "large"
          label: "500 000 $ - 2 000 000 $"
        - value: "major"
          label: "> 2 000 000 $"
          
    bonding_capacity:
      type: "currency"
      label: "Capacité de cautionnement"
      required: false
      
    certifications:
      type: "multi_select"
      label: "Certifications"
      required: false
      options:
        - "ASP Construction"
        - "SIMDUT 2015"
        - "Travail en hauteur"
        - "Espace clos"
        - "LEED"
        - "ISO 9001"
        - "ISO 14001"
        - "COR"
        - "Autre"
```

### 2.4 Étape 4: Préférences Agents ⚡

```yaml
onboarding_step_4:
  id: "STEP_AGENT_PREFS"
  name: "Préférences Agents"
  required: false
  
  fields:
    
    communication_style:
      type: "select"
      label: "Style de communication préféré"
      required: true
      options:
        - value: "formal"
          label: "Formel et professionnel"
        - value: "balanced"
          label: "Équilibré"
        - value: "casual"
          label: "Décontracté et direct"
      default: "balanced"
      
    detail_level:
      type: "select"
      label: "Niveau de détail souhaité"
      required: true
      options:
        - value: "minimal"
          label: "Résumé - Juste l'essentiel"
        - value: "standard"
          label: "Standard - Explications claires"
        - value: "detailed"
          label: "Détaillé - Toutes les informations"
      default: "standard"
      
    proactivity:
      type: "select"
      label: "Niveau de proactivité des agents"
      required: true
      options:
        - value: "reactive"
          label: "Réactif - Répond aux demandes seulement"
        - value: "moderate"
          label: "Modéré - Suggestions occasionnelles"
        - value: "proactive"
          label: "Proactif - Suggestions et rappels fréquents"
      default: "moderate"
      
    notification_preferences:
      type: "multi_select"
      label: "Notifications souhaitées"
      required: true
      options:
        - value: "critical"
          label: "Urgences et problèmes critiques"
          locked: true
        - value: "approvals"
          label: "Demandes d'approbation"
        - value: "updates"
          label: "Mises à jour de statut"
        - value: "suggestions"
          label: "Suggestions et recommandations"
        - value: "reminders"
          label: "Rappels et échéances"
      default: ["critical", "approvals"]
      
    work_hours:
      type: "time_range"
      label: "Heures de travail habituelles"
      required: false
      default:
        start: "08:00"
        end: "17:00"
        days: ["MO", "TU", "WE", "TH", "FR"]
```

---

## 3) STRUCTURE DU USER CONTEXT ⚡

### 3.1 User Context Object ⚡

```yaml
user_context:
  schema:
    version: "1.0"
    
    # === IDENTIFICATION ===
    identity:
      user_id: "string"
      user_name: "string"
      email: "string"
      phone: "string|null"
      preferred_language: "fr|en"
      timezone: "string"
      
    # === ENTREPRISE ===
    company:
      name: "string"
      legal_name: "string|null"
      neq: "string|null"
      industry: "string"
      industry_category: "string"
      size: "string"
      
    # === RÔLE ===
    role:
      title: "string"
      responsibilities: ["string"]
      decision_authority: "string"
      
    # === CONSTRUCTION SPÉCIFIQUE ===
    construction:  # null si non-construction
      rbq_license: "string"
      rbq_categories: ["string"]
      rbq_status: "active|suspended|expired"
      cnesst_registration: "string"
      cnesst_status: "active|suspended"
      ccq_region: "string"
      typical_project_size: "string"
      bonding_capacity: "number|null"
      certifications: ["string"]
      
    # === PRÉFÉRENCES ===
    preferences:
      communication_style: "formal|balanced|casual"
      detail_level: "minimal|standard|detailed"
      proactivity: "reactive|moderate|proactive"
      notifications: ["string"]
      work_hours:
        start: "string"
        end: "string"
        days: ["string"]
        
    # === MÉTADONNÉES ===
    metadata:
      created_at: "iso8601"
      updated_at: "iso8601"
      onboarding_complete: "boolean"
      last_active: "iso8601"
```

### 3.2 Exemple User Context ⚡

```json
{
  "identity": {
    "user_id": "usr_abc123",
    "user_name": "Jean-Pierre Tremblay",
    "email": "jp.tremblay@constructionxyz.com",
    "phone": "+1-514-555-0123",
    "preferred_language": "fr",
    "timezone": "America/Montreal"
  },
  "company": {
    "name": "Construction XYZ Inc.",
    "legal_name": "9876543 Québec Inc.",
    "neq": "1234567890",
    "industry": "construction_commercial",
    "industry_category": "construction",
    "size": "medium"
  },
  "role": {
    "title": "Président et Directeur Général",
    "responsibilities": [
      "Direction générale",
      "Gestion de projets",
      "Ventes et développement"
    ],
    "decision_authority": "full"
  },
  "construction": {
    "rbq_license": "1234-5678-90",
    "rbq_categories": ["1.3", "1.5"],
    "rbq_status": "active",
    "cnesst_registration": "1234567",
    "cnesst_status": "active",
    "ccq_region": "Montérégie",
    "typical_project_size": "large",
    "bonding_capacity": 2000000,
    "certifications": ["ASP Construction", "ISO 9001"]
  },
  "preferences": {
    "communication_style": "balanced",
    "detail_level": "standard",
    "proactivity": "moderate",
    "notifications": ["critical", "approvals", "reminders"],
    "work_hours": {
      "start": "07:00",
      "end": "17:00",
      "days": ["MO", "TU", "WE", "TH", "FR"]
    }
  },
  "metadata": {
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-06-10T14:22:00Z",
    "onboarding_complete": true,
    "last_active": "2025-12-11T08:45:00Z"
  }
}
```

---

## 4) CONTEXT INJECTION ENGINE ⚡

### 4.1 Mécanisme d'Injection ⚡

```yaml
context_injection:
  
  process:
    1_load: "Load user_context from database"
    2_filter: "Filter context based on agent needs"
    3_format: "Format context for prompt"
    4_inject: "Replace {{placeholders}} in system_prompt"
    5_validate: "Ensure no sensitive data leaked"
    
  injection_points:
    - "{{user_context}}"      # Context complet filtré
    - "{{user_name}}"         # Nom seulement
    - "{{company_name}}"      # Entreprise seulement
    - "{{industry_context}}"  # Contexte industrie
    - "{{construction_context}}" # Contexte construction
    - "{{preferences}}"       # Préférences
```

### 4.2 Templates d'Injection ⚡

```yaml
injection_templates:

  user_context_basic:
    template: |
      ## Contexte Utilisateur
      - Nom: {{user_name}}
      - Entreprise: {{company_name}}
      - Rôle: {{role_title}}
      - Langue: {{preferred_language}}
      
  user_context_full:
    template: |
      ## Contexte Utilisateur Complet
      
      ### Identification
      - Nom: {{user_name}}
      - Entreprise: {{company_name}} ({{company_legal_name}})
      - Industrie: {{industry}}
      - Taille: {{company_size}}
      - Rôle: {{role_title}}
      
      ### Responsabilités
      {{#each responsibilities}}
      - {{this}}
      {{/each}}
      
      ### Préférences
      - Style: {{communication_style}}
      - Détail: {{detail_level}}
      - Proactivité: {{proactivity}}
      
  construction_context:
    template: |
      ## Contexte Construction Québec
      
      ### Licences et Enregistrements
      - Licence RBQ: {{rbq_license}} ({{rbq_status}})
      - Catégories: {{#each rbq_categories}}{{this}}, {{/each}}
      - CNESST: {{cnesst_registration}} ({{cnesst_status}})
      - Région CCQ: {{ccq_region}}
      
      ### Profil Projets
      - Taille typique: {{typical_project_size}}
      - Cautionnement: {{bonding_capacity}}
      
      ### Certifications
      {{#each certifications}}
      - {{this}}
      {{/each}}
```

### 4.3 Filtrage par Agent ⚡

```yaml
context_filtering:

  by_level:
    L0:
      include: ["identity", "company", "role"]
      exclude: ["preferences.notifications"]
      
    L1:
      include: ["*"]  # Tout
      exclude: ["metadata.internal"]
      
    L2:
      include: ["identity", "company", "role", "construction", "preferences"]
      exclude: []
      
    L3:
      include: ["identity.user_name", "company.name", "preferences"]
      exclude: ["*sensitive*"]
      
  by_department:
    construction:
      include: ["*", "construction.*"]
      
    finance:
      include: ["identity", "company", "role"]
      add: ["financial_settings"]
      
    legal:
      include: ["identity", "company", "construction.rbq_*"]
      
  by_sensitivity:
    public:
      - "user_name"
      - "company_name"
      - "role_title"
      
    internal:
      - "email"
      - "phone"
      - "responsibilities"
      
    sensitive:
      - "rbq_license"
      - "cnesst_registration"
      - "bonding_capacity"
      
    confidential:
      - "neq"
      - "financial_data"
```

---

## 5) PERSONNALISATION DES AGENTS ⚡

### 5.1 Personnalisation Permise ⚡

```yaml
agent_customization:

  always_customizable:
    - preferred_language
    - communication_style
    - detail_level
    - proactivity_level
    - notification_preferences
    
  sometimes_customizable:
    - agent_name (L2, L3 only)
    - agent_avatar (L2, L3 only)
    - specialty_focus
    - default_values
    
  never_customizable:
    - core_capabilities
    - security_constraints
    - ethical_guidelines
    - compliance_rules
    - L0_agent_behavior
```

### 5.2 Style Adaptation ⚡

```yaml
style_adaptation:

  formal:
    tone: "professional, respectful, structured"
    vocabulary: "formal terms, complete sentences"
    formatting: "headers, bullet points, clear sections"
    examples:
      greeting: "Bonjour M./Mme {{user_name}},"
      closing: "Cordialement,"
      error: "Je vous prie de m'excuser, une erreur s'est produite..."
      
  balanced:
    tone: "professional but approachable"
    vocabulary: "clear, accessible, moderate formality"
    formatting: "clean, organized, not overly structured"
    examples:
      greeting: "Bonjour {{user_name}},"
      closing: "Bonne journée!"
      error: "Désolé, il y a eu un problème..."
      
  casual:
    tone: "friendly, direct, conversational"
    vocabulary: "simple, everyday language"
    formatting: "minimal, conversational flow"
    examples:
      greeting: "Salut {{user_name}}!"
      closing: "À plus!"
      error: "Oups, quelque chose a mal tourné..."
```

### 5.3 Detail Level Adaptation ⚡

```yaml
detail_adaptation:

  minimal:
    response_length: "concise, key points only"
    explanations: "none unless asked"
    examples: "rare"
    caveats: "only critical ones"
    template: |
      {{main_answer}}
      
      {{#if critical_caveat}}
      ⚠️ {{critical_caveat}}
      {{/if}}
      
  standard:
    response_length: "moderate, well-structured"
    explanations: "brief context when helpful"
    examples: "when clarifying"
    caveats: "relevant ones"
    template: |
      {{main_answer}}
      
      {{#if context}}
      ### Contexte
      {{context}}
      {{/if}}
      
      {{#if caveats}}
      ### À noter
      {{caveats}}
      {{/if}}
      
  detailed:
    response_length: "comprehensive, thorough"
    explanations: "full background and reasoning"
    examples: "multiple, diverse"
    caveats: "all relevant considerations"
    template: |
      ## Réponse
      {{main_answer}}
      
      ## Explication
      {{detailed_explanation}}
      
      ## Exemples
      {{examples}}
      
      ## Considérations
      {{all_caveats}}
      
      ## Prochaines étapes
      {{next_steps}}
```

---

## 6) ÉVOLUTION DU PROFIL ⚡

### 6.1 Apprentissage Implicite ⚡

```yaml
implicit_learning:

  signals:
    - "correction_of_agent_output"
    - "repeated_similar_requests"
    - "preference_patterns"
    - "time_of_activity"
    - "feature_usage_frequency"
    
  inferences:
    - pattern: "always_corrects_formal_to_casual"
      inference: "prefers_casual_style"
      confidence_threshold: 0.8
      
    - pattern: "always_asks_for_more_detail"
      inference: "prefers_detailed_responses"
      confidence_threshold: 0.7
      
    - pattern: "mostly_active_evening"
      inference: "evening_worker"
      action: "adjust_notification_timing"
      
  application:
    require_confirmation: true
    message: "J'ai remarqué que vous préférez {{inferred_preference}}. Voulez-vous que j'ajuste mes réponses en conséquence?"
```

### 6.2 Mises à Jour Explicites ⚡

```yaml
explicit_updates:

  triggers:
    - "user_edits_profile"
    - "user_requests_change"
    - "periodic_review_prompt"
    
  periodic_review:
    frequency: "quarterly"
    prompt: |
      Bonjour {{user_name}},
      
      Cela fait 3 mois depuis votre dernière mise à jour de profil.
      Voulez-vous vérifier que vos informations sont toujours à jour?
      
      - Licence RBQ: {{rbq_license}}
      - Préférences de communication: {{communication_style}}
      
      [Mettre à jour] [Tout est correct]
      
  change_propagation:
    immediate:
      - "preferred_language"
      - "communication_style"
    requires_verification:
      - "rbq_license"
      - "cnesst_registration"
    requires_approval:
      - "company_change"
      - "role_change"
```

---

## 7) MULTI-TENANT ISOLATION ⚡

```yaml
tenant_isolation:

  data_isolation:
    - "each_user_has_own_context"
    - "no_cross_user_data_access"
    - "agent_memory_per_user"
    
  security:
    - "encryption_at_rest"
    - "encryption_in_transit"
    - "access_logging"
    - "audit_trail"
    
  compliance:
    - "data_residency_quebec"
    - "gdpr_compatible"
    - "law_25_compatible"
    
  deletion:
    - "user_can_delete_all_data"
    - "30_day_soft_delete"
    - "permanent_after_confirmation"
```

---

## 8) API ONBOARDING ⚡

```yaml
onboarding_api:

  endpoints:
    
    POST /onboarding/start:
      description: "Démarrer l'onboarding"
      request: { user_id, email }
      response: { session_id, first_step }
      
    GET /onboarding/steps:
      description: "Liste des étapes"
      response: { steps: [...] }
      
    POST /onboarding/step/{step_id}:
      description: "Soumettre une étape"
      request: { fields: {...} }
      response: { valid, errors, next_step }
      
    GET /onboarding/status:
      description: "Statut onboarding"
      response: { complete, current_step, progress }
      
    POST /onboarding/complete:
      description: "Finaliser onboarding"
      response: { user_context, agents_ready }
      
    PUT /user/context:
      description: "Mettre à jour contexte"
      request: { updates: {...} }
      response: { updated_context }
      
    GET /user/context:
      description: "Obtenir contexte"
      response: { user_context }
```

---

**END — USER ONBOARDING & CONTEXT INJECTION v1.0**
