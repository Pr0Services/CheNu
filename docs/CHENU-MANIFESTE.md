# CHE·NU — MANIFESTE DIRECTIONNEL

> **Un utilisateur ne navigue pas dans des écrans.**
> **Il navigue dans des CHEMINS d'intention.**

---

## MISSION

Tu travailles sur CHE·NU, un système d'orchestration orienté utilisateur, fondé sur des règles directionnelles, des limitations volontaires et une timeline comme vérité unique.

## OBJECTIF GLOBAL

Instaurer un système d'usage personnel robuste où :
- l'utilisateur avance sans peur,
- peut toujours reculer sans casser,
- reprend son travail sans friction,
- ne perd jamais de décisions importantes.

**Le système doit guider sans jamais contraindre.**

---

## PART 1 — CONCEPTS FONDAMENTAUX

### 1) CHEMIN

Un chemin est une suite d'états intentionnels validés.

**Un chemin N'EST PAS :**
- une action technique
- une feature UI
- une navigation arbitraire

**Un chemin EST :**
- une progression logique
- validée par l'utilisateur
- inscrite dans la timeline seulement après validation humaine

### 2) INTENTION

Toute action utilisateur doit être précédée d'une intention claire exprimable en une phrase simple.

**Exemples :**
- "Je veux avancer sur X"
- "Je veux explorer Y"
- "Je dois prendre une décision sur Z"

### 3) VALIDATION HUMAINE

- Aucun état significatif n'est inscrit sans validation explicite.
- Aucune IA, agent ou automatisme ne peut écrire seul dans la timeline.

### 4) TIMELINE (VÉRITÉ ABSOLUE)

- La timeline est **append-only**
- Elle n'est **jamais modifiée**
- Elle représente l'historique réel des décisions validées
- Toute lecture, replay, rollback ou visualisation est dérivée

---

## PART 2 — CHEMINS PRIMAIRES

### CHEMIN A — REPRISE
**Intention : "Je reviens continuer"**

| Aspect | Détail |
|--------|--------|
| **Entrée** | Ouverture de l'application, récupération du dernier contexte valide |
| **Options** | Continuer tel quel, changer de preset, changer de sphère |
| **Recul** | Retour à l'état neutre initial |
| **Sauvegarde** | Automatique (dernier état validé) |
| **Interdictions** | Aucune nouvelle décision écrite, aucune suggestion intrusive |

### CHEMIN B — NOUVEL OBJECTIF
**Intention : "Je commence quelque chose"**

| Aspect | Détail |
|--------|--------|
| **Entrée** | Saisie d'un objectif en une phrase |
| **Options** | Choix de la sphère, choix du preset, estimation de durée |
| **Recul** | Annuler tant que la validation n'est pas faite, retour à l'état neutre |
| **Sauvegarde** | Uniquement après validation explicite |
| **Interdictions** | Pas de création implicite, pas d'écriture automatique |

### CHEMIN C — EXPLORATION
**Intention : "Je réfléchis / je découvre"**

| Aspect | Détail |
|--------|--------|
| **Entrée** | Preset exploration actif, navigation libre |
| **Options** | Prise de notes, bascule vers focus, marquage d'idées importantes |
| **Recul** | Retour au dernier état stable, possibilité d'ignorer toute l'exploration |
| **Sauvegarde** | Uniquement les éléments explicitement marqués |

### CHEMIN D — DÉCISION
**Intention : "Je tranche"**

| Aspect | Détail |
|--------|--------|
| **Entrée** | Décision explicite |
| **Options** | Voir le contexte, demander une analyse, comparer des options |
| **Recul** | Retour au contexte précédent, MAIS aucune suppression de la décision |
| **Sauvegarde** | Toujours écrite dans la timeline |

---

## PART 3 — OPTIONS (RÈGLES STRICTES)

### RÈGLE D'OR
> Toute option doit répondre à une question claire et unique.

**OPTIONS VALIDES :**
- "Changer de preset ?"
- "Sauvegarder cette idée ?"
- "Continuer ou revenir ?"

**OPTIONS INTERDITES :**
- Actions automatiques
- Optimisations silencieuses
- Décisions sans explication

---

## PART 4 — RECUL (ROLLBACK)

### Principe fondamental
> On ne supprime jamais le passé.
> On change seulement le point de lecture.

**Le recul :**
- Repositionne le contexte actif
- Ne supprime aucun événement
- N'écrit rien dans la timeline

**Interdictions :**
- Pas de suppression
- Pas de réécriture
- Pas de masquage historique

---

## PART 5 — SAUVEGARDE DE SESSION

**Éléments sauvegardés :**
- Dernier preset actif
- Sphère active
- Dernier objectif validé
- Pointeur de lecture timeline

**Éléments NON sauvegardés :**
- États visuels détaillés
- Hésitations non validées
- Explorations non marquées

**Types de sauvegarde :**
- Autosave silencieux après validation
- Sauvegarde explicite en fin de session

---

## PART 6 — LIMITATIONS VOLONTAIRES

Ces limitations **DOIVENT** être maintenues :

| Limitation | Raison |
|------------|--------|
| Pas plus de **4 chemins principaux** | Simplicité cognitive |
| Pas d'**undo destructif** | Préservation de l'historique |
| Pas d'**IA autonome décisionnelle** | Contrôle humain absolu |
| Pas de **menus profonds complexes** | Accessibilité |

> Ces limitations sont un **CHOIX DE DESIGN**, pas un manque.

---

## PART 7 — CRITÈRES DE RÉUSSITE

Le système est réussi si :

1. ✅ L'utilisateur comprend toujours où il est
2. ✅ Il ose explorer sans peur
3. ✅ Il peut fermer l'app sans stress
4. ✅ Il peut reprendre le lendemain sans réfléchir

---

## IMPORTANT

> Tu ne dois **PAS** ajouter de nouvelles features.
> Tu dois **implémenter, clarifier et renforcer** ce système directionnel.
> Toute proposition doit respecter ces lois.

---

## RÉSUMÉ DES LOIS

```
📜 LOI 1: Timeline = Vérité Absolue (append-only)
📜 LOI 2: Validation Humaine Obligatoire
📜 LOI 3: Recul = Repositionnement (jamais suppression)
📜 LOI 4: 4 Chemins Maximum (ABCD)
📜 LOI 5: Humain > Système, Toujours
```

---

*CHE·NU — "Chez Nous" — Là où l'utilisateur est chez lui.*
