# CHE·NU — KNOWLEDGE THREADS + INTER-SPHERE AGENTS + OPERATIONAL AGENTS
**VERSION:** CORE.v2.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / BUILD-READY

---

## SECTION 1 — KNOWLEDGE THREADS (3 TYPES) ⚡

> **Knowledge Threads = "lignes de continuité intellectuelle"** Reliant sphères, données, décisions, artefacts, et mémoire collective.

### RULE
> **Thread = map de relations FACTUELLES. AUCUNE interprétation, AUCUNE influence.**

---

### THREAD TYPE 1 — CONTEXT THREAD ⚡
> *(Pourquoi tel contenu existe, d'où il vient)*

### Purpose
Montrer l'origine des informations, leur évolution, et la logique de chaîne d'événements entre sphères.

### Nodes ⚡
| Node | Description |
|------|-------------|
| `meeting` | ⚡ |
| `artifact` | ⚡ |
| `decision` | ⚡ |
| `replay segment` | ⚡ |
| `sphere context` | ⚡ |

### Edges ⚡
| Edge | Description |
|------|-------------|
| `originates_from` | ⚡ |
| `referenced_in` | ⚡ |
| `updated_by` | ⚡ |

### Context Thread JSON ⚡
```json
{
  "context_thread": {
    "root": "artifact|decision",
    "trace": ["node_id_1", "node_id_n"],
    "version_chain": ["..."],
    "hash_chain": "sha256"
  }
}
```

---

### THREAD TYPE 2 — OPERATIONAL THREAD ⚡
> *(Comment un travail progresse dans les mains des agents)*

### Purpose
Tracer les responsabilités, transferts, états, et garantir qu'aucune étape n'a été modifiée ou manquante.

### Nodes ⚡
| Node | Description |
|------|-------------|
| `agent task` | ⚡ |
| `subtask` | ⚡ |
| `validation checkpoints` | ⚡ |
| `execution logs` | ⚡ |

### Edges ⚡
| Edge | Description |
|------|-------------|
| `delegated_to` | ⚡ |
| `validated_by` | ⚡ |
| `blocked_by` | ⚡ |
| `completed_by` | ⚡ |

### Operational Thread JSON ⚡
```json
{
  "operational_thread": {
    "task_id": "uuid",
    "sequence": ["..."],
    "agent_roles": ["..."],
    "validation": {}
  }
}
```

---

### THREAD TYPE 3 — KNOWLEDGE CONSOLIDATION THREAD ⚡
> *(Regroupe savoir + mémoire collective + replays)*

### Purpose
Assembler le savoir trans-sphère en un "scaffold" neutre: **→ pas de synthèse, → juste de la consolidation relationnelle.**

### Nodes ⚡
| Node | Description |
|------|-------------|
| `memory events` | ⚡ |
| `decisions` | ⚡ |
| `replays` | ⚡ |
| `artifacts` | ⚡ |
| `interpretations (user-generated only)` | ⚡ |

### Edges ⚡
| Edge | Description |
|------|-------------|
| `cluster_with` | ⚡ |
| `overlaps_with` | ⚡ |
| `contrasts_with` | ⚡ |

### Consolidation Thread JSON ⚡
```json
{
  "consolidation_thread": {
    "topic": "string",
    "entries": ["..."],
    "clusters": ["..."],
    "graph_metrics": {}
  }
}
```

---

## SECTION 2 — INTER-SPHERE AGENTS ⚡

> **Inter-sphere Agents = agents transversaux** servant uniquement à relier les sphères entre elles dans le respect de l'éthique Che-Nu.

### RULES ⚡
| Rule | Status |
|------|--------|
| **NE JAMAIS interpréter le sens** | ✅ ⚡ |
| **NE JAMAIS influencer le contenu** | ✅ ⚡ |

### 4 INTER-SPHERE AGENTS ⚡

| Agent | Purpose | Abilities |
|-------|---------|-----------|
| `AGENT_INTER_SPHERE_ROUTER` | Localiser points communs, générer Knowledge Threads, **jamais recommander d'action** | topic matching, artifact correlation, timeline alignment ⚡ |
| `AGENT_INTER_SPHERE_EXPLAINER` | Traduire relations en langage simple, **jamais conseiller, juste expliquer** | relation graphs → sentences, factual summarization, heritage tracking ⚡ |
| `AGENT_INTER_SPHERE_VALIDATOR` | Vérifier cohérence, confirmer intégrité crypto, **prévenir cycles impossibles** | hashing, schema validation, consistency scanning ⚡ |
| `AGENT_INTER_SPHERE_ARCHIVIST` | Stocker threads validés, maintenir mémoire trans-sphère neutre | indexing, cold storage, **non-destructive versioning** ⚡ |

---

## SECTION 3 — OPERATIONAL AGENTS (À DÉBLOQUER) ⚡ (NOUVEAU!)

> **Ces agents s'activent SEULEMENT quand l'utilisateur ou un flux de travail les demande. Ils ne tournent pas en background sauf instruction directe.**

### 6 OPERATIONAL AGENTS + UNLOCK CONDITIONS ⚡

| Agent | Purpose | Unlock Condition |
|-------|---------|------------------|
| `AGENT_OPERATIONAL_RESEARCH` | Chercher info précise dans n'importe quelle sphère, créer Context Threads automatiquement | **User triggers a research request** ⚡ |
| `AGENT_OPERATIONAL_SUMMARY` | Résumer un ensemble de threads, produire vue lisible humaine | **User selects "summarize thread"** ⚡ |
| `AGENT_OPERATIONAL_SYNC` | Synchroniser données multi-sphères, mettre à jour Knowledge Threads sans duplication | **Scheduled maintenance OR User "sync now"** ⚡ |
| `AGENT_OPERATIONAL_SPATIALIZER` | Convertir thread → visualisation XR, créer "Knowledge Constellation" dans Universe View | **User enters XR mode OR "visualize this thread"** ⚡ |
| `AGENT_OPERATIONAL_INTEGRITY` | Vérifier état complet de la base de connaissance, identifier fragments manquants, détecter contradictions factuelles | **Automatic weekly run OR Manual user request** ⚡ |
| `AGENT_OPERATIONAL_MEMORY_CURATOR` | Ranger mémoire collective par thèmes, créer Consolidation Threads, éviter accumulation chaotique | **Threshold of accumulated data OR "organize memory"** ⚡ |

---

## WHY THIS MATTERS ⚡

| Component | = |
|-----------|---|
| **Knowledge Threads** | Nervous System ⚡ |
| **Inter-sphere Agents** | **Neural Pathways** ⚡ |
| **Operational Agents** | **Muscles du système** ⚡ |

### Ensemble ⚡
- organisation
- continuité
- transparence
- **expansion contrôlée**
- **zéro manipulation**

---

**END — FREEZEABLE**
