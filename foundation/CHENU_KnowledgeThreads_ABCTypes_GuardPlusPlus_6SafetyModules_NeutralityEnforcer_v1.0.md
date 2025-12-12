# CHE·NU — KNOWLEDGE THREADS (A/B/C) + GUARD++ SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / FREEZE-READY

---

## 1) KNOWLEDGE THREADS — CORE PRINCIPLE ⚡

### Purpose
Unifier l'information provenant de plusieurs sphères, réunir événements, décisions, artefacts, agents, replays en un **"fil de connaissance" vérifiable, traçable et sans interprétation.**

### RULES ⚡
| Rule | Status |
|------|--------|
| **Thread = CONTEXT LINK, not opinion** | ✅ ⚡ |
| **Zero inference, zero emotional labeling** | ✅ ⚡ |
| **Append-only, source-referenced** | ✅ ⚡ |
| **Works in 2D, 3D, XR, and text mode** | ✅ ⚡ |

---

## THREAD TYPE A — INTER-SPHERE KNOWLEDGE THREAD ⚡

### Purpose
Créer un fil reliant des éléments provenant de différentes sphères (Business, Scholar, Creative, Institution, Social, XR…).

### What It Links ⚡
| Element | Description |
|---------|-------------|
| événements partagés | ⚡ |
| artefacts réutilisés | ⚡ |
| décisions dépendantes | ⚡ |
| participants communs | ⚡ |
| **timelines alignées** | ⚡ |

### Thread A JSON ⚡

```json
{
  "thread_inter_sphere": {
    "id": "uuid",
    "nodes": [
      { "source": "sphere_name", "entity_id": "uuid", "type": "event|artifact|decision|replay" }
    ],
    "links": [
      { "from": "uuid", "to": "uuid", "reason": "shared_artifact|shared_goal|chronology" }
    ],
    "hash": "sha256"
  }
}
```

### Properties ⚡
| Property | Status |
|----------|--------|
| **Non-directional** | ✅ ⚡ |
| **No weighting** | ✅ ⚡ |
| **User can expand/collapse spheres** | ✅ ⚡ |

---

## THREAD TYPE B — DECISION LINEAGE THREAD ⚡

### Purpose
Montrer comment une décision actuelle provient d'une série d'événements / analyses antérieures **sans suggérer si c'est "bon" ou "mauvais".**

### What It Tracks ⚡
| Element | Description |
|---------|-------------|
| antécédents | ⚡ |
| réunions source | ⚡ |
| replays | ⚡ |
| validations | ⚡ |
| **conditions contextuelles** | ⚡ |

### Thread B JSON ⚡

```json
{
  "decision_lineage": {
    "decision_id": "uuid",
    "ancestors": [
      { "type": "event|meeting|artifact", "timestamp": "...", "source_id": "uuid" }
    ],
    "paths": [
      { "from": "uuid", "to": "uuid", "nature": "dependency|requirement|reference" }
    ],
    "integrity": "verified"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **No counterfactuals** | ✅ ⚡ |
| **No predictions** | ✅ ⚡ |
| **Lineage only = factual chain** | ✅ ⚡ |

---

## THREAD TYPE C — COLLECTIVE MEMORY THREAD ⚡

### Purpose
Créer un fil mémoriel collectif unifié à partir d'événements validés, replays, artefacts, **sans jamais altérer leur contenu.**

### What It Represents ⚡
| Element | Description |
|---------|-------------|
| l'historique multi-session | ⚡ |
| la continuité entre utilisateurs | ⚡ |
| l'évolution des projets | ⚡ |
| **le réseau interne d'apprentissage** | ⚡ |

### Thread C JSON ⚡

```json
{
  "collective_thread": {
    "scope": "team|sphere|global",
    "entries": [
      { "memory_id": "uuid", "type": "event|artifact|decision", "timestamp": "..." }
    ],
    "chronology": true,
    "hash": "sha256"
  }
}
```

### Rules ⚡
| Rule | Status |
|------|--------|
| **Immutable once validated** | ✅ ⚡ |
| **Visible only if permissions allow** | ✅ ⚡ |
| **Not an interpretation: pure aggregation** | ✅ ⚡ |

---

## VISUALIZATION RULES (for A + B + C) ⚡

### Graph Rules ⚡
| Rule | Status |
|------|--------|
| **Nodes never resized by "importance"** | ✅ ⚡ |
| **Colors reflect type, not value** | ✅ ⚡ |
| **Links show reason, not judgment** | ✅ ⚡ |
| **Optional XR braiding for lineage threads** | ✅ ⚡ |

### UX Safety ⚡
| Rule | Status |
|------|--------|
| **no flashing links** | ✅ ⚡ |
| **no node jumping** | ✅ ⚡ |
| **transitions < 400 ms fade** | ✅ ⚡ |

---

## GUARD++ SYSTEM — KNOWLEDGE SAFETY ENGINE ⚡ (NOUVEAU!)

### Purpose
Empêcher tout glissement narratif, toute interprétation involontaire, et garantir une **neutralité parfaite** dans la création et l'affichage des Knowledge Threads.

### 6 GUARD++ MODULES ⚡

| # | Module | Function |
|---|--------|----------|
| **1** | `INTERPRETATION BLOCKER` | bloque "this suggests", "this implies", interdit inférence causale ⚡ |
| **2** | `TEMPORAL TRACE GUARD` | vérifie alignement chronologique, **impose timestamp strict** ⚡ |
| **3** | `CROSS-SPHERE BIAS FILTER` | empêche un domaine de prendre le dessus, **égalité visuelle** ⚡ |
| **4** | `NEUTRALITY ENFORCER` | pas de "optimal", "incorrect", "strong", "weak" ⚡ |
| **5** | `VISUAL DISTORTION GUARD` | contrôle intensité, couleurs, opacité ⚡ |
| **6** | `ACCESS CONTROL GUARD` | respecte privacy layers, **masque nodes si non autorisés** ⚡ |

### Guard++ JSON Config ⚡

```json
{
  "guard_pp": {
    "interpretation_blocker": true,
    "temporal_trace_guard": true,
    "bias_filter": "cross-sphere",
    "neutrality_enforcer": true,
    "visual_distortion_guard": true,
    "access_control_guard": true
  }
}
```

### When Guard++ Activates ⚡

**AUTO:**
| Trigger | Description |
|---------|-------------|
| creation de thread | ⚡ |
| révision de thread | ⚡ |
| export PDF | ⚡ |
| XR visualization | ⚡ |
| Universe View aggregation | ⚡ |

**MANUAL:**
| Trigger | Description |
|---------|-------------|
| user triggers "audit thread" | ⚡ |
| agent orchestrator requests validation | ⚡ |

### Audit Mode (READ-ONLY) ⚡

**Displays:**
| Item | Description |
|------|-------------|
| missing timestamps | ⚡ |
| incomplete links | ⚡ |
| permissions mismatch | ⚡ |
| unvalidated entries | ⚡ |
| **origin replay hashes** | ⚡ |

**Cannot:**
| Forbidden | Status |
|-----------|--------|
| fix | ❌ ⚡ |
| edit | ❌ ⚡ |
| hide | ❌ ⚡ |

---

**END — KNOWLEDGE THREAD SUITE + GUARD++ — FREEZE-READY**
