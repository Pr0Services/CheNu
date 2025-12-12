# CHE·NU — KNOWLEDGE THREADS SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / TRACEABLE

---

## OVERVIEW

> **Knowledge Threads = lignes d'information neutres**, tissées automatiquement entre: réunions, replays, artefacts, sphères, agents, décisions, timelines

### BUT ⚡
> **Révéler les connexions. JAMAIS influencer l'interprétation.**

### 3 Couches Officielles ⚡
1. **Local Knowledge Threads**
2. **Inter-Sphere Knowledge Threads**
3. **Collective Deep Threads**

---

## 1) LOCAL KNOWLEDGE THREADS

### Définition
Liens directs dans une même sphère, basés sur des données de surface.

### Sources ⚡
- documents reliés
- meetings qui se suivent
- artefacts réutilisés
- **agents impliqués dans plusieurs tâches** ⚡
- **replay fragments liés** ⚡

### Types de Threads ⚡
| Type | Description |
|------|-------------|
| `LOCAL_EVENT → LOCAL_EVENT` | ⚡ |
| `LOCAL_ARTIFACT → LOCAL_DECISION` | ⚡ |
| `MEETING → FOLLOW-UP` | ⚡ |

### Règles ⚡
- aucune inférence
- aucun classement de priorité
- **pure relation structurelle** ⚡

### Local Thread JSON ⚡

```json
{
  "local_thread": {
    "id": "uuid",
    "from": "node_id",
    "to": "node_id",
    "reason": "shared_artifact|time_proximity|same_agent",
    "sphere": "business|scholar|creative|...",
    "weight": "0.1-0.3"
  }
}
```

### Local Fields ⚡
| Field | Description |
|-------|-------------|
| `reason` | **shared_artifact/time_proximity/same_agent** ⚡ |
| `weight` | **0.1-0.3 (léger)** ⚡ |

### Affichage (Universe View) ⚡
- ligne fine
- couleur douce
- **non pulsante** ⚡

---

## 2) INTER-SPHERE KNOWLEDGE THREADS

### Définition
Connexions entre sphères différentes, mais liées par **CONTENU**, PAS par interprétation.

### Sources ⚡
- même artefact utilisé entre deux sphères
- même utilisateur impliqué
- **décision d'une sphère causant une tâche dans une autre** ⚡
- **meeting cross-sphere** ⚡

### Types ⚡
| Type | Description |
|------|-------------|
| `SPHERE_A → SPHERE_B` | **(neutral bridge)** ⚡ |
| `CROSS_DECISION_LINK` | ⚡ |
| `CROSS_ARTIFACT_USE` | ⚡ |

### Règles Strictes ⚡
| Règle | Status |
|-------|--------|
| **jamais suggérer de direction** | ✅ ⚡ |
| **jamais inférer causalité** | ✅ ⚡ |
| **NE PAS créer de flux "recommandation"** | ✅ ⚡ |

### Inter-Sphere Thread JSON ⚡

```json
{
  "intersphere_thread": {
    "id": "uuid",
    "spheres": ["business","creative"],
    "from": "node_id",
    "to": "node_id",
    "reason": "shared_artifact",
    "evidence_hash": "sha256",
    "weight": "0.3-0.6"
  }
}
```

### Inter Fields ⚡
| Field | Description |
|-------|-------------|
| `spheres` | **Array of 2 spheres** ⚡ |
| `evidence_hash` | **sha256 proof** ⚡ |
| `weight` | **0.3-0.6 (moyen)** ⚡ |

### Affichage ⚡
- arc courbé
- légèrement plus visible
- **icône sphere-bridge au survol** ⚡

---

## 3) COLLECTIVE DEEP THREADS ⚡

### Définition
Fils structurels profonds construits à partir de la Mémoire Collective (Collective Memory), mais **SANS interprétation, SANS biais, SANS inférence psychologique.**

### Ces Threads Révèlent ⚡
- motifs répétitifs
- structures récurrentes
- **trajectoires similaires entre sessions** ⚡
- **continuités historiques** ⚡

### Sources ⚡
- XR replays validés
- timelines fusionnées
- artefacts récurrents
- **décisions multipériodes** ⚡
- **chronologie cross-sphere** ⚡

### Types ⚡
| Type | Description |
|------|-------------|
| `DEEP_PATTERN` | ⚡ |
| `DEEP_CONTINUITY` | ⚡ |
| `DEEP_REPLAY_ALIGNMENT` | ⚡ |
| `DEEP_SILENCE_TRACE` | ⚡ |

### Règles Essentielles ⚡
| Règle | Status |
|-------|--------|
| **totalement "read-only"** | ✅ ⚡ |
| **jamais orienter l'utilisateur** | ✅ ⚡ |
| aucune suggestion | ✅ |
| aucune hypothèse | ✅ |
| **transparence absolue sur la source** | ✅ ⚡ |

### Deep Thread JSON ⚡

```json
{
  "deep_thread": {
    "id": "uuid",
    "pattern_type": "continuity|alignment|recurrence",
    "nodes": ["id1","id2","id3"],
    "evidence": ["event_hash_1","event_hash_2"],
    "depth_score": "0.6-1.0",
    "time_span": "period",
    "audit": "full"
  }
}
```

### Deep Fields ⚡
| Field | Description |
|-------|-------------|
| `pattern_type` | **continuity/alignment/recurrence** ⚡ |
| `depth_score` | **0.6-1.0 (profond)** ⚡ |
| `audit` | **"full"** ⚡ |

### Affichage ⚡
- ligne lumineuse très fine
- **activation manuelle uniquement** ⚡
- mode "schéma structurel"
- **aucune couleur émotionnelle (blanc / gris)** ⚡

---

## KNOWLEDGE THREAD ENGINE ⚡

### Rôle
> Générer les threads **uniquement** à partir de données objectives, sans extrapolation.

### Modules ⚡
| Module | Description |
|--------|-------------|
| `THREAD_EXTRACTOR` | ⚡ |
| `THREAD_VALIDATOR` | ⚡ |
| `THREAD_HASHER` | ⚡ |
| `THREAD_RENDERER` | ⚡ |

### Activation ⚡
- manuel ou automatique par collecte d'évènements
- **validé par un agent-guard** ⚡

### Sécurité ⚡
| Feature | Description |
|---------|-------------|
| **audit trail complet** | ⚡ |
| **preuve cryptographique de chaque lien** | ⚡ |
| **impossible à manipuler sans hash mismatch** | ⚡ |

---

## INTEGRATION WITH UNIVERSE VIEW ⚡

### Layers ⚡
| Layer | Type |
|-------|------|
| **Layer 1** | Local ⚡ |
| **Layer 2** | Inter-Sphere ⚡ |
| **Layer 3** | Deep Context ⚡ |

### Filtres Utilisateur ⚡
- par type de thread
- par période
- par sphère
- par décision
- **par agent** ⚡

---

## EXPORTS ⚡

| Format | Description |
|--------|-------------|
| **PDF** | Knowledge Thread Map ⚡ |
| **JSON** | Bundles de threads ⚡ |
| **XR Overlay** | **Threads spatialisés** ⚡ |
| **Replay Mode** | **Voir les threads à travers un replay existant** ⚡ |

---

**END — KNOWLEDGE THREADS COMPLETE**
