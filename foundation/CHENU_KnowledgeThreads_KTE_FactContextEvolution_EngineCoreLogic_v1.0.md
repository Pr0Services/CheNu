# CHE·NU — KNOWLEDGE THREAD ENGINE (KTE)
**TYPE:** INTERSPHERE INTELLIGENCE / NON-MANIPULATIVE  
**MODE:** BUILD-READY / CLAUDE-READY

---

## PURPOSE

> **Relier l'information dispersée dans l'écosystème Che·Nu, sans jamais forcer une interprétation ou conclusion.**

> **Le Knowledge Thread (KT) ne décide pas → il RELIE.**

### Chaque Thread = 1 chemin neutre entre ⚡
- faits
- décisions
- replays
- artefacts
- sphères
- agents
- utilisateurs (anonymisés optionnellement)

---

## THREAD TYPES (3 VARIANTES OFFICIELLES) ⚡

### THREAD TYPE 1 — FACT THREAD (FT) ⚡

> **Relie des faits bruts entre eux.**

**Contient uniquement ⚡:**
- timestamps
- sources (meeting, replay, artefact)
- liens "a référencé", "a précédé", "a coexistant"
- sphère associée
- **participants anonymisables** ⚡

**INTERDIT ⚡:**
| Forbidden | Status |
|-----------|--------|
| hypothèses | ❌ |
| analyses | ❌ |
| émotions | ❌ |
| **effets de persuasion** | ❌ ⚡ |

**Uses:** audit, vérification, **truth chains** ⚡

**Fact Thread JSON ⚡:**
```json
{
  "fact_thread": {
    "id": "uuid",
    "nodes": [...facts],
    "links": [...],
    "integrity": "sha256",
    "immutability": true
  }
}
```

---

### THREAD TYPE 2 — CONTEXT THREAD (CT) ⚡

> **Relie des éléments qui partagent un sens structurel:** thème, objectif, sujet, domaine, sphère.

**Permissions ⚡:**
- classification
- regroupement
- **contexte partagé** ⚡

**Interdictions ⚡:**
| Forbidden | Status |
|-----------|--------|
| **suggestion d'action** | ❌ ⚡ |
| **conclusion logique** | ❌ ⚡ |

**Uses:** naviguer dans Universe View, lier replays selon contexte, **filtrage intelligible** ⚡

**Context Thread JSON (with weight) ⚡:**
```json
{
  "context_thread": {
    "topic": "string",
    "sphere": "business|social|scholar|...",
    "connections": [...],
    "weight": 0.0-1.0
  }
}
```

---

### THREAD TYPE 3 — EVOLUTION THREAD (ET) ⚡

> **Montre comment une idée, un projet ou une structure a évolué dans le temps.**

> **C'est le fil temporel officiel.**

**Inclut ⚡:**
| Element | Description |
|---------|-------------|
| phases | ⚡ |
| transitions | ⚡ |
| points de décision | ⚡ |
| **forks** | ⚡ |
| **merges** | ⚡ |
| contributions agents & humains | ⚡ |

**Sans ⚡:**
- jugement
- optimisation
- interprétation

**Uses:** XR replay comparison, audit historique, **mémoire collective** ⚡

**Evolution Thread JSON (with forks/merges) ⚡:**
```json
{
  "evolution_thread": {
    "timeline": [...],
    "events": [...],
    "forks": [...],
    "merges": [...],
    "source_replays": [...],
    "verified": true
  }
}
```

---

## KNOWLEDGE THREAD ENGINE — CORE LOGIC ⚡

| Step | Function |
|------|----------|
| **1. DETECTION** | Identifie points connectables: timestamps alignés, thèmes communs, artefacts référencés ⚡ |
| **2. LINKING** | Crée des liens neutres "A → B" ⚡ |
| **3. NORMALIZATION** | Transforme les différents formats (replay, note, doc) ⚡ |
| **4. PROOF & INTEGRITY** | Ajoute un hash cryptographique sur chaque Thread ⚡ |
| **5. PUBLISHING** | Rend disponible dans Universe View, XR Meeting, Replay 2.0, Mémoire Collective ⚡ |

---

## KTE ENGINE — SAFETY RULES ⚡

| Rule | Description |
|------|-------------|
| **RULE 1 — ZERO INTERPRETATION** | Le moteur ne peut pas inventer d'explication ⚡ |
| **RULE 2 — NO SUGGESTION** | Les Threads n'indiquent jamais une direction ⚡ |
| **RULE 3 — NO EMOTIONAL WEIGHT** | Pas d'importance subjective ⚡ |
| **RULE 4 — USER PARALLEL VIEW** | Chaque utilisateur peut activer/désactiver des types de Threads ⚡ |
| **RULE 5 — TRANSPARENCY** | Chaque lien → raison affichée ⚡ |

---

## KTE ENGINE — JSON SPEC ⚡

```json
{
  "kte_engine": {
    "enabled": true,
    "thread_types": ["fact","context","evolution"],
    "hash_mode": "sha256",
    "privacy": {
      "anonymize_users": true,
      "respect_sphere_rules": true
    },
    "publish_to": {
      "universe_view": true,
      "xr_meeting": true,
      "collective_memory": true
    }
  }
}
```

---

## KTE ENGINE — REACT / XR INTEGRATION ⚡

### Universe View ⚡
| Element | Value |
|---------|-------|
| Thread lines | **soft arcs** ⚡ |
| **Colors** | FT → blue, CT → green, ET → gold ⚡ |
| Hover | show chain summary ⚡ |
| Click | open thread viewer ⚡ |

### XR Meeting Room ⚡
| Feature | Description |
|---------|-------------|
| **Thread halos** | ⚡ |
| **Timeline overlay mode** | ⚡ |
| **Ghost reconstructor** | ⚡ |

### Collective Memory ⚡
- **Append-only**
- **Immutable**

---

## KTE UI — MINIMAL VIEWER ⚡

| Feature | Description |
|---------|-------------|
| Toggle FT / CT / ET | ⚡ |
| Thread timeline | ⚡ |
| **Merge visualiser** | ⚡ |
| **Fork visualiser** | ⚡ |
| Hash verification | ⚡ |
| Export Thread (pdf/json) | ⚡ |

---

## WHY THREAD ENGINE EXISTS ⚡

### Sans Thread Engine ❌
- les replays restent isolés
- les sphères deviennent silo
- l'utilisateur perd sa vision globale

### Avec Thread Engine ✅
- **vérité liée** ⚡
- **mémoire claire** ⚡
- **navigation riche** ⚡
- **aucune manipulation** ⚡

---

**END — KNOWLEDGE THREAD ENGINE FREEZE**
