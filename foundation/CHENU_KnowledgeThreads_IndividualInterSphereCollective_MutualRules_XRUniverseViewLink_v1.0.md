# CHE·NU — KNOWLEDGE THREADS (INDIVIDUAL • INTER-SPHERE • COLLECTIVE)
**VERSION:** KNT.v1.0  
**MODE:** FOUNDATION / IMMUTABLE / NON-MANIPULATIVE

---

## 0) PURPOSE ⚡

> **Knowledge Threads = LIGNES DE CONNAISSANCE qui relient:** données, rencontres, replays, décisions, artifacts, contextes.

### BUT ⚡
> **Organiser la connaissance. Jamais influencer. Jamais synthétiser la pensée humaine. Toujours traçable, vérifiable.**

---

## 1) KNOWLEDGE THREAD — INDIVIDUAL ⚡

### Définition
> **Fil personnel reliant ce qu'un UTILISATEUR a vu, généré, décidé, sans aucune inférence, sans suggestion.**

### Contenu ⚡
| Type | Description |
|------|-------------|
| documents ouverts | ⚡ |
| meetings joints | ⚡ |
| replays visionnés | ⚡ |
| **avatars utilisés** | ⚡ |
| **timelines consultées** | ⚡ |
| artefacts créés ou modifiés | ⚡ |

### Règles ⚡
| Règle | Status |
|-------|--------|
| **visible uniquement par l'utilisateur** | ✅ ⚡ |
| **aucun tri automatisé émotionnel ou cognitif** | ✅ ⚡ |
| **ordre strict = ordre temporel** | ✅ ⚡ |
| **annotations permises mais jamais interprétées** | ✅ ⚡ |

### Individual Thread JSON ⚡
```json
{
  "thread_individual": {
    "user_id": "uuid",
    "entries": [
      { "type": "meeting", "id": "uuid", "timestamp": 171234 },
      { "type": "artifact", "id": "uuid", "timestamp": 171235 },
      { "type": "replay", "id": "uuid", "timestamp": 171237 }
    ]
  }
}
```

### Actions Permises ⚡
| Action | Status |
|--------|--------|
| visualiser | ✅ ⚡ |
| filtrer par sphère | ✅ ⚡ |
| **exporter PDF** | ✅ ⚡ |
| **relier à XR avatar notes** | ✅ ⚡ |

### Actions Interdites ⚡
| Action | Status |
|--------|--------|
| **recommandations personnelles** | ❌ ⚡ |
| **priorisation automatique** | ❌ ⚡ |
| **scoring ou jugement** | ❌ ⚡ |

---

## 2) KNOWLEDGE THREAD — INTER-SPHERE ⚡

### Définition
> **Relie des objets provenant de différentes sphères lorsqu'ils traitent du même sujet ou partagent une continuité.**

### Exemples ⚡
| From | To | Link |
|------|----|------|
| Business | Creative | **pitch + visuels** ⚡ |
| Scholar | XR | **leçon + visite immersive** ⚡ |
| Social | Institution | **annonce + conformité** ⚡ |

### Règles ⚡
| Règle | Status |
|-------|--------|
| **liaison créée UNIQUEMENT sur base factuelle** | ✅ ⚡ |
| (titre commun, artefact commun, participants identiques, sujet identique) | ✅ ⚡ |
| **jamais basée sur inférence ou estimation** | ✅ ⚡ |
| **affichage dans Universe View en "bretelles de fil"** | ✅ ⚡ |

### Inter-Sphere Thread JSON ⚡
```json
{
  "thread_intersphere": {
    "root_topic": "string",
    "links": [
      { "sphere": "business", "source_id": "uuid" },
      { "sphere": "creative", "source_id": "uuid" }
    ],
    "origin": "system_detected|user_declared"
  }
}
```

### Visualisation XR ⚡
| Property | Description |
|----------|-------------|
| **fil lumineux simple** | ⚡ |
| **intensité = nombre de liens** | ⚡ |
| **aucune animation persuasive** | ✅ ⚡ |

### Fonctions ⚡
| Function | Description |
|----------|-------------|
| ouvrir les objets liés | ⚡ |
| **synchroniser les timelines** | ⚡ |
| **afficher la segmentation par sphère** | ⚡ |

---

## 3) KNOWLEDGE THREAD — COLLECTIVE ⚡

### Définition
> **Fil de connaissance construit à partir de données VALIDÉES, partagées volontairement entre plusieurs utilisateurs.**

### NE PEUT PAS ⚡
| Interdit | Status |
|----------|--------|
| **déduire ce que les gens pensent** | ❌ ⚡ |
| **synthétiser des opinions** | ❌ ⚡ |
| **influencer orientations** | ❌ ⚡ |

### Contenu Permis ⚡
| Permis | Status |
|--------|--------|
| décisions validées | ✅ ⚡ |
| replays finalisés | ✅ ⚡ |
| documents publiés | ✅ ⚡ |
| **routes de projets (progression)** | ✅ ⚡ |

### Contenu Interdit ⚡
| Interdit | Status |
|----------|--------|
| **brouillons privés** | ❌ ⚡ |
| **données personnelles non déclarées** | ❌ ⚡ |
| **signaux implicites** | ❌ ⚡ |

### Collective Thread JSON ⚡
```json
{
  "thread_collective": {
    "topic": "string",
    "entries": [
      { "type": "decision", "id": "uuid", "timestamp": 171234 },
      { "type": "artifact", "id": "uuid" },
      { "type": "meeting_summary", "id": "uuid" }
    ],
    "access": "shared",
    "integrity_hash": "sha256"
  }
}
```

### Visualisation ⚡
| Property | Description |
|----------|-------------|
| **timeline horizontale multi-source** | ⚡ |
| **bandes de sphères (color coding)** | ⚡ |
| **versioning visible** | ⚡ |

---

## 4) MUTUAL RULES FOR ALL THREADS ⚡

### APPEND-ONLY ⚡
> **Aucune réécriture. Chaque modification = nouvelle version.**

### TRACEABILITY ⚡
> **Chaque entrée doit pointer vers son replay, meeting, artefact.**

### NO AUTOMATED INTERPRETATION ⚡
> **Aucune lecture "intelligente". Strictement contextuel.**

### USER CONTROL ⚡
| Control | Description |
|---------|-------------|
| activer/désactiver threads visibles | ⚡ |
| supprimer ses propres threads individuels | ⚡ |
| **créer des topics manuels** | ⚡ |

### EXPORT ⚡
| Format | Status |
|--------|--------|
| PDF | ✅ ⚡ |
| timeline | ✅ ⚡ |
| **XR thread view** | ✅ ⚡ |
| **integrity bundle** | ✅ ⚡ |

---

## 5) THREADED TO XR UNIVERSE VIEW LINK ⚡ (NOUVEAU!)

### Universe View Color Coding ⚡
| Thread Type | Color |
|-------------|-------|
| `thread_individual` | 🔵 **BLEU** |
| `thread_intersphere` | 🟣 **VIOLET** |
| `thread_collective` | 🟡 **OR** |

### Règles Visuelles ⚡
| Règle | Status |
|-------|--------|
| **aucun mouvement agressif** | ✅ ⚡ |
| **transparence 40%** | ✅ ⚡ |
| **pas de "highlight" émotionnel** | ✅ ⚡ |
| **XR pathways = géométrie simple (lignes ou arcs)** | ✅ ⚡ |

---

**END — KNOWLEDGE THREADS FOUNDATION**
