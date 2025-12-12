# CHE·NU — AGENTS MASTER LIST (168+ AGENTS)
**VERSION:** AGENTS.v1.0  
**MODE:** FOUNDATION / CONFIGURABLE / ONBOARDING-READY

---

## AGENT CONFIGURATION TEMPLATE ⚡

### Structure Universelle Pour Chaque Agent

```json
{
  "agent": {
    "id": "AGENT_XXX",
    "name": "Agent Name",
    "department": "sphere|system|utility",
    "level": "L0|L1|L2|L3",
    
    "system_prompt": {
      "base": "Prompt système fixe...",
      "dynamic_prefix": "{{user_context}}",
      "rules": ["non-manipulative", "factual", "neutral"]
    },
    
    "llm_config": {
      "recommended": "claude-sonnet-4-20250514|gpt-4o|llama-3.1-70b|gemini-pro",
      "fallback": "claude-haiku|gpt-4o-mini|llama-3.1-8b",
      "local_option": "ollama/mistral|ollama/llama3"
    },
    
    "parameters": {
      "temperature": { "default": 0.7, "range": [0.0, 1.0], "user_editable": true },
      "max_tokens": { "default": 2048, "range": [256, 8192], "user_editable": true },
      "top_p": { "default": 0.9, "range": [0.0, 1.0], "user_editable": true },
      "frequency_penalty": { "default": 0.0, "range": [0.0, 2.0], "user_editable": true }
    },
    
    "apis": {
      "required": ["api_1", "api_2"],
      "optional": ["api_3"],
      "internal": ["che_nu_memory", "che_nu_threads"]
    },
    
    "onboarding": {
      "required_fields": ["field_1", "field_2"],
      "optional_fields": ["field_3"],
      "context_injection": true
    },
    
    "user_customizable": {
      "name": true,
      "avatar": true,
      "tone": true,
      "language": true,
      "specialty_focus": true
    }
  }
}
```

---

## ONBOARDING FIELDS — USER INPUT ⚡

### Champs Universels (Tous Agents) ⚡

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_name` | string | ✅ | Nom de l'utilisateur |
| `company_name` | string | ✅ | Nom de l'entreprise |
| `company_industry` | string | ✅ | Secteur d'activité |
| `company_size` | enum | ✅ | startup/pme/grande/enterprise |
| `user_role` | string | ✅ | Rôle/titre de l'utilisateur |
| `user_responsibilities` | array | ✅ | Liste des responsabilités |
| `current_projects` | array | ⚪ | Projets en cours |
| `team_members` | array | ⚪ | Membres de l'équipe |
| `company_vision` | text | ⚪ | Vision de l'entreprise |
| `company_values` | array | ⚪ | Valeurs de l'entreprise |
| `preferred_language` | enum | ✅ | fr/en/es/... |
| `timezone` | string | ✅ | Fuseau horaire |

### Champs Par Sphère ⚡

#### Business Sphere ⚡
| Field | Type | Description |
|-------|------|-------------|
| `revenue_target` | number | Objectif de revenus |
| `fiscal_year_end` | date | Fin d'année fiscale |
| `key_competitors` | array | Concurrents principaux |
| `market_position` | string | Position sur le marché |
| `business_model` | string | Modèle d'affaires |

#### Scholar Sphere ⚡
| Field | Type | Description |
|-------|------|-------------|
| `research_domains` | array | Domaines de recherche |
| `certifications` | array | Certifications visées |
| `learning_goals` | array | Objectifs d'apprentissage |
| `expertise_level` | enum | beginner/intermediate/expert |

#### Creative Sphere ⚡
| Field | Type | Description |
|-------|------|-------------|
| `brand_guidelines` | object | Guide de marque |
| `design_preferences` | array | Préférences design |
| `content_types` | array | Types de contenu produits |
| `target_audience` | string | Audience cible |

#### Institution Sphere (Construction QC) ⚡
| Field | Type | Description |
|-------|------|-------------|
| `rbq_license` | string | Numéro RBQ |
| `cnesst_registration` | string | Inscription CNESST |
| `ccq_region` | string | Région CCQ |
| `specialty_codes` | array | Codes de spécialité |

---

## DYNAMIC PRE-PROMPT INJECTION ⚡

### Template Pre-Prompt ⚡

```
=== CONTEXTE UTILISATEUR ===
Utilisateur: {{user_name}}
Rôle: {{user_role}}
Entreprise: {{company_name}} ({{company_industry}}, {{company_size}})
Responsabilités: {{user_responsibilities | join(", ")}}
Projets actifs: {{current_projects | join(", ")}}
Vision: {{company_vision}}
Langue: {{preferred_language}}
Timezone: {{timezone}}

=== CONTEXTE SPHÈRE ===
{{sphere_specific_context}}

=== INSTRUCTIONS AGENT ===
{{agent_system_prompt}}

=== RÈGLES NON-NÉGOCIABLES ===
- Tu ne manipules JAMAIS l'utilisateur
- Tu ne prends JAMAIS de décisions pour lui
- Tu fournis des FAITS, pas des opinions
- Tu respectes la CONFIDENTIALITÉ
```

---

## LLM RECOMMENDATIONS PAR TYPE D'AGENT ⚡

| Agent Type | Recommended LLM | Fallback | Local Option |
|------------|-----------------|----------|--------------|
| **Strategic/Complex** | Claude Sonnet 4 | GPT-4o | Llama-3.1-70B |
| **Creative/Writing** | Claude Sonnet 4 | GPT-4o | Mistral-Large |
| **Code/Technical** | Claude Sonnet 4 | GPT-4o | CodeLlama-34B |
| **Data/Analysis** | GPT-4o | Claude Sonnet | Llama-3.1-70B |
| **Quick/Simple** | Claude Haiku | GPT-4o-mini | Llama-3.1-8B |
| **Multilingual** | Claude Sonnet 4 | GPT-4o | Mixtral-8x7B |
| **Safety/Compliance** | Claude Sonnet 4 | GPT-4o | Local only |

---

## PARAMETER PRESETS ⚡

### Preset: PRECISE ⚡
```json
{
  "temperature": 0.2,
  "top_p": 0.8,
  "frequency_penalty": 0.0,
  "use_case": "compliance, legal, data extraction"
}
```

### Preset: BALANCED ⚡
```json
{
  "temperature": 0.7,
  "top_p": 0.9,
  "frequency_penalty": 0.3,
  "use_case": "general assistance, analysis"
}
```

### Preset: CREATIVE ⚡
```json
{
  "temperature": 0.9,
  "top_p": 0.95,
  "frequency_penalty": 0.5,
  "use_case": "brainstorming, content creation"
}
```

### Preset: CONVERSATIONAL ⚡
```json
{
  "temperature": 0.8,
  "top_p": 0.9,
  "frequency_penalty": 0.2,
  "use_case": "coaching, support, dialogue"
}
```

---

**VOIR FICHIERS SUIVANTS POUR LISTE COMPLÈTE DES 168 AGENTS**
