# CHE·NU — KNOWLEDGE THREADS + PLATFORM IMPORT + WITNESS ASSISTANT
**VERSION:** KNOWLEDGE.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## 1) KNOWLEDGE THREADS — CORE CONCEPT ⚡

### Definition
> **A Knowledge Thread is a TRACEABLE LINE that connects:** data, meetings, decisions, replays, external platforms.

### RULE
> **Threads connect FACTS, not opinions.**

### Threads NEVER ⚡
| Forbidden | Status |
|-----------|--------|
| **rewrite history** | ❌ ⚡ |
| **hide sources** | ❌ ⚡ |
| **assign blame** | ❌ ⚡ |

---

## 2) THE 3 KNOWLEDGE THREAD TYPES ⚡

### THREAD TYPE 1 — TOPIC THREAD ⚡

**Focus:** A concept, sujet, thème (ex: "Projet X", "IA Lab", "XR meeting").

**Connects:**
| Content | Description |
|---------|-------------|
| docs | ⚡ |
| messages | ⚡ |
| meetings | ⚡ |
| replays | ⚡ |
| **artifacts (PDF, notes…)** | ⚡ |

**Usage:**
> *"Montre-moi tout ce qui touche à [Topic]."*

**Topic Thread JSON:**
```json
{
  "thread_type": "topic",
  "topic_id": "string",
  "labels": ["string"],
  "linked_items": ["item_id"]
}
```

---

### THREAD TYPE 2 — DECISION THREAD ⚡

**Focus:** Une décision, un choix, une bifurcation.

**Connects:**
| Content | Description |
|---------|-------------|
| contexte avant décision | ⚡ |
| **arguments (pour/contre)** | ⚡ |
| réunion liée | ⚡ |
| **replay décisionnel** | ⚡ |
| **résultat observable (plus tard)** | ⚡ |

**Usage:**
> *"Comment cette décision a été prise ?"*
> *"Quelles réunions ont contribué à ce choix ?"*

**Decision Thread JSON:**
```json
{
  "thread_type": "decision",
  "decision_id": "string",
  "status": "planned|taken|revised",
  "sources": ["replay_id", "doc_id"],
  "outcomes": ["effect_id"]
}
```

### Key Field: `status` ⚡ (NOUVEAU!)
| Status | Description |
|--------|-------------|
| `planned` | décision planifiée ⚡ |
| `taken` | **décision prise** ⚡ |
| `revised` | **décision révisée** ⚡ |

---

### THREAD TYPE 3 — SOURCE / PROVENANCE THREAD ⚡

**Focus:** D'où vient une information ? (plateforme, fichier, agent, humain)

**Connects:**
| Content | Description |
|---------|-------------|
| **plateforme d'origine (Drive, Gmail, ClickUp, GitHub…)** | ⚡ |
| import logs | ⚡ |
| **modifications successives** | ⚡ |
| **re-utilisation dans Che-Nu** | ⚡ |

**Usage:**
> *"Montre-moi toute la chaîne d'origine de cette info."*
> *"Qu'est-ce qui vient de l'extérieur et où ça a été réutilisé ?"*

**Provenance Thread JSON:**
```json
{
  "thread_type": "provenance",
  "source_id": "string",
  "platform": "drive|github|clickup|other",
  "original_location": "uri",
  "import_events": ["event_id"],
  "usage_links": ["doc_id", "replay_id", "thread_id"]
}
```

---

## 3) PLATFORM IMPORT — CONNECTED DATA PIPELINE ⚡ (NOUVEAU!)

### Goal
> **Importer des données de plateformes externes SANS les déformer, SANS les camoufler.**

### Sources Possibles ⚡
| Category | Platforms |
|----------|-----------|
| **Storage** | Drive, Dropbox… ⚡ |
| **Tools** | ClickUp, Notion, Jira… ⚡ |
| **Code** | GitHub… ⚡ |
| **Comms** | Mail, Slack-like… ⚡ |

### Rules ⚡
| Rule | Status |
|------|--------|
| **Import = miroir structuré, pas copie magique** | ✅ ⚡ |
| **Toujours garder la référence d'origine** | ✅ ⚡ |
| **Jamais supprimer ou réécrire la source** | ✅ ⚡ |

### Import Event JSON ⚡
```json
{
  "import_event": {
    "id": "uuid",
    "platform": "drive|github|clickup|...",
    "original_uri": "string",
    "imported_at": "timestamp",
    "import_type": "file|message|task|commit",
    "checksum": "sha256",
    "visibility": "private|team|org",
    "linked_threads": ["topic_id", "provenance_id"]
  }
}
```

### Key Field: `import_type` ⚡ (NOUVEAU!)
| Type | Description |
|------|-------------|
| `file` | fichier ⚡ |
| `message` | message ⚡ |
| `task` | **tâche** ⚡ |
| `commit` | **commit code** ⚡ |

---

## 5-STAGE IMPORT PIPELINE ⚡ (NOUVEAU!)

| Stage | Description |
|-------|-------------|
| **1) DISCOVERY** | scanner permissionné (jamais plus), liste les éléments disponibles ⚡ |
| **2) SELECTION** | **l'utilisateur choisit ce qui entre, pas d'import silencieux de masse** ⚡ |
| **3) NORMALISATION** | métadonnées standardisées (titre, auteur, date), **contenu encapsulé (mais pas modifié)** ⚡ |
| **4) THREAD LINKING** | création automatique d'un Provenance Thread, **option de lier à un Topic Thread** ⚡ |
| **5) LOGGING** | chaque import = import_event enregistré, **vérifiable par l'utilisateur** ⚡ |

---

## 4) NAVIGATION INTÉRIEURE SUR PLATEFORMES CONNECTÉES ⚡

### But
> **Naviguer dans les contenus externes COMME si tout était dans Che-Nu, sans perdre la vérité que ça reste externe.**

### Concept ⚡
| Element | = |
|---------|---|
| **Che-Nu** | navigateur cognitif ⚡ |
| **Plateformes externes** | **paysages visités** ⚡ |

---

## WHY THESE 3 THREAD TYPES ⚡

| Type | Purpose |
|------|---------|
| **TOPIC** | *"tout ce qui touche à [X]"* ⚡ |
| **DECISION** | *"comment cette décision a été prise"* ⚡ |
| **PROVENANCE** | *"d'où vient cette info"* ⚡ |

### Together ⚡
- full traceability
- **zero hidden sources**
- platform-agnostic navigation

---

**END — FREEZE READY**
