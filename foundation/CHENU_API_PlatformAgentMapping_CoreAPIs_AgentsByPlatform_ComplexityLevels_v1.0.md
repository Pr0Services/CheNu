# CHE·NU — API / PLATFORM AGENT MAPPING
**VERSION:** CORE.v1.0  
**MODE:** FOUNDATION / BUILD-READY / NON-AUTHORITATIVE

---

## I — CORE API SURFACE ⚡

### DATA_APIS ⚡
| API | Description |
|-----|-------------|
| `SQL Engine` | ⚡ |
| `Vector Search (FAISS / Pinecone)` | ⚡ |
| `FileStore API` | ⚡ |
| `Memory API` | ⚡ |

### COMMUNICATION_APIS ⚡
| API | Description |
|-----|-------------|
| `Chat / Messaging` | ⚡ |
| `Voice-to-Text / Text-to-Voice` | ⚡ |
| `Realtime Stream API` | ⚡ |

### ORCHESTRATION_APIS ⚡
| API | Description |
|-----|-------------|
| `Task Scheduler` | ⚡ |
| `Workflow Engine` | ⚡ |
| `Event Bus` | ⚡ |

### MEDIA_APIS ⚡
| API | Description |
|-----|-------------|
| `Image Gen API` | ⚡ |
| `Video Gen API` | ⚡ |
| `Audio Gen / Clean API` | ⚡ |
| `XR Scene API` | ⚡ |

### INTEGRATIONS_APIS ⚡
| API | Description |
|-----|-------------|
| `Google Workspace` | ⚡ |
| `ClickUp` | ⚡ |
| `Notion` | ⚡ |
| `GitHub` | ⚡ |
| `Drive / Dropbox` | ⚡ |
| `Email API` | ⚡ |

---

## II — AGENTS PAR API (Usage Direct) ⚡

### SQL_ENGINE ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_Data_Manager` | créer tables, migrations | **HAUTE** ⚡ |
| `Agent_Schema_Migrator` | migrations | **HAUTE** ⚡ |
| `Agent_Query_Optimizer` | **consolidation** | **HAUTE** ⚡ |

### VECTOR_SEARCH ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_Context_Retriever` | **recherche intelligente** | MOYENNE/HAUTE ⚡ |
| `Agent_Memory_Indexer` | classification | MOYENNE/HAUTE ⚡ |

### FILESTORE ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_Document_Manager` | upload / version / archive | MOYENNE ⚡ |

### VOICE_API ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_Meeting_Transcriber` | **transcription** | MOYENNE ⚡ |
| `Agent_Voice_Assistant` | synthèse voix | MOYENNE ⚡ |

### STREAM_API ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_Realtime_Monitor` | **synchro meeting** | **HAUTE** ⚡ |
| `Agent_XR_StateTracker` | XR events | **HAUTE** ⚡ |

### IMAGE/VIDEO/AUDIO GEN ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_Creative_Studio` | **design** | MOYENNE ⚡ |
| `Agent_Media_Enhancer` | nettoyage, montage | MOYENNE ⚡ |

### XR_SCENE_API ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_XR_Architect` | **créer room** | **TRÈS HAUTE** ⚡ |
| `Agent_XR_RoomOrchestrator` | **gérer transitions** | **TRÈS HAUTE** ⚡ |
| `Agent_XR_ReplayEngine` | replay | **TRÈS HAUTE** ⚡ |

---

## III — AGENTS PAR PLATEFORME ⚡

### GOOGLE WORKSPACE ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_Google_Files` | importer docs | MOYENNE ⚡ |
| `Agent_Google_Mail` | email | MOYENNE ⚡ |
| `Agent_Google_Calendar` | **synchroniser calendrier** | MOYENNE ⚡ |
| `Agent_Google_Sheets` | exporter données | MOYENNE ⚡ |

### CLICKUP ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_ClickUp_Manager` | **CRUD tâches** | MOYENNE ⚡ |
| `Agent_ClickUp_Reporter` | reporting productivité | MOYENNE ⚡ |

### NOTION ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_Notion_Structurer` | création bases | **HAUTE** ⚡ |
| `Agent_Notion_Sync` | **synchronisation knowledgebase** | **HAUTE** ⚡ |

### GITHUB ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_DevOps` | push/pull, analyse code | **HAUTE** ⚡ |
| `Agent_Repo_Monitor` | **suivi PR** | **HAUTE** ⚡ |

### DROPBOX / DRIVE ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_FileSync` | backup, versioning | BASSE/MOYENNE ⚡ |

### XR PLATFORM ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_XR_Architect` | scènes XR | **TRÈS HAUTE** ⚡ |
| `Agent_XR_Navigation` | navigation | **TRÈS HAUTE** ⚡ |
| `Agent_XR_AvatarEvolution` | **avatar morphology** | **TRÈS HAUTE** ⚡ |
| `Agent_XR_UniverseView` | **multi-meeting** | **TRÈS HAUTE** ⚡ |

### CREATIVE STUDIO PLATFORM ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_Designer` | **branding** | MOYENNE ⚡ |
| `Agent_AudioTech` | audio | MOYENNE ⚡ |
| `Agent_VideoEditor` | **montage** | MOYENNE ⚡ |
| `Agent_ImageModeler` | optimisation médias | MOYENNE ⚡ |

### METHODOLOGY PLATFORM ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_Methodology_Orchestrator` | **choisir methodes** | **HAUTE** ⚡ |
| `Agent_Methodology_Analyzer` | analyser résultats | **HAUTE** ⚡ |
| `Agent_Methodology_Reviewer` | **recommander flux** | **HAUTE** ⚡ |

### IA LAB ⚡
| Agent | Tâches | Complexité |
|-------|--------|------------|
| `Agent_Lab_Trainer` | **apprentissage local** | **TRÈS HAUTE** ⚡ |
| `Agent_Lab_Experimenter` | tests contrôlés | **TRÈS HAUTE** ⚡ |
| `Agent_Lab_Validator` | validation | **TRÈS HAUTE** ⚡ |

---

## IV — COMPARAISON DES COMPLEXITÉS ⚡

| Niveau | Exemples |
|--------|----------|
| **BASSE** | File moving, imports simples ⚡ |
| **MOYENNE** | sync ClickUp, sync Notion, media optimisation ⚡ |
| **HAUTE** | SQL automation, meeting intelligence, **morphology engine** ⚡ |
| **TRÈS HAUTE** | **XR rooms, multi-meeting universe, cross-agent orchestration, collective memory** ⚡ |

---

## V — PRINCIPES DE SÉCURITÉ ⚡

| Principe | Status |
|----------|--------|
| **aucun agent ne doit avoir accès total aux APIs** | ✅ ⚡ |
| **séparation claire: lecture vs écriture** | ✅ ⚡ |
| **logs → audités par Agent_Audit** | ✅ ⚡ |
| **aucun agent n'a autorité → rôle purement opérationnel** | ✅ ⚡ |
| **cohérence avec Constitution Che-Nu** | ✅ ⚡ |

---

**END — MASTER API/AGENT MAP**
