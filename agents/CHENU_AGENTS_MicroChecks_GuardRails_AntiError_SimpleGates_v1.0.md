# CHE·NU — MICRO-CHECKS & GUARD RAILS
**VERSION:** GUARDS.v1.0  
**MODE:** SIMPLE / BINARY / ANTI-ERROR

---

## CONCEPT: MICRO-CHECKS ⚡

### Principe
> **Question simple → Réponse OUI/NON → Action immédiate**
> **Comme une douane: check rapide, décision instantanée**

### Format Universel
```
┌─────────────────────────────────────┐
│  MICRO-CHECK: [Question simple?]    │
│                                     │
│  ✅ OUI → Continue                  │
│  ❌ NON → [Action corrective]       │
└─────────────────────────────────────┘
```

---

## 1) GUARDS DE BASE — TOUTE REQUÊTE ⚡

### G-001: Besoin Réel de Contenu? ⚡
```yaml
guard: "G_CONTENT_NEEDED"
question: "Cette demande nécessite-t-elle de GÉNÉRER du contenu?"
check: |
  - Reformulation de l'existant? → NON
  - Question simple? → NON
  - Recherche d'info existante? → NON
  - Création nouvelle? → OUI

✅ OUI: proceed_to_generation
❌ NON: retrieve_or_respond_directly
```

### G-002: Info Déjà Disponible? ⚡
```yaml
guard: "G_ALREADY_EXISTS"
question: "Cette information existe-t-elle déjà dans la mémoire?"
check: |
  - Chercher dans PKT
  - Chercher dans CKT
  - Chercher dans documents

✅ OUI: return_existing + ask_if_update_needed
❌ NON: proceed_to_create
```

### G-003: Contexte Suffisant? ⚡
```yaml
guard: "G_CONTEXT_COMPLETE"
question: "Ai-je assez d'information pour répondre correctement?"
check: |
  - Qui? Quoi? Quand? Où? Pourquoi?
  - Au moins 3/5 clairs?

✅ OUI: proceed
❌ NON: ask_clarification_first
```

### G-004: Bonne Personne/Agent? ⚡
```yaml
guard: "G_RIGHT_AGENT"
question: "Suis-je le bon agent pour cette tâche?"
check: |
  - Tâche dans mes capabilities?
  - Mon niveau approprié?

✅ OUI: proceed
❌ NON: route_to_correct_agent
```

### G-005: Urgent ou Peut Attendre? ⚡
```yaml
guard: "G_URGENCY"
question: "Est-ce urgent (< 24h)?"
check: |
  - Deadline mentionnée?
  - Mot-clé urgent/asap/maintenant?

✅ OUI: priority_queue
❌ NON: normal_queue
```

---

## 2) GUARDS ANTI-ERREUR — DOCUMENTS ⚡

### G-010: Document Complet? ⚡
```yaml
guard: "G_DOC_COMPLETE"
question: "Le document a-t-il toutes les sections requises?"
check: |
  Soumission: [sommaire, portée, prix, échéancier, conditions]
  Facture: [client, items, montants, taxes, total]
  Contrat: [parties, objet, prix, durée, signatures]

✅ OUI: proceed
❌ NON: list_missing_sections
```

### G-011: Calculs Vérifiés? ⚡
```yaml
guard: "G_MATH_CHECK"
question: "Les calculs sont-ils corrects?"
check: |
  - Somme des lignes = total?
  - Taxes calculées correctement?
  - Pas de montant négatif inattendu?

✅ OUI: proceed
❌ NON: recalculate_and_show_error
```

### G-012: Nom Client Correct? ⚡
```yaml
guard: "G_CLIENT_NAME"
question: "Le nom du client est-il correctement orthographié?"
check: |
  - Correspond au nom dans le contrat/CRM?
  - Pas de faute de frappe évidente?

✅ OUI: proceed
❌ NON: show_correct_name + ask_confirmation
```

### G-013: Dates Cohérentes? ⚡
```yaml
guard: "G_DATES_LOGIC"
question: "Les dates sont-elles logiques?"
check: |
  - Date début < Date fin?
  - Pas de date dans le passé (si création)?
  - Délai réaliste?

✅ OUI: proceed
❌ NON: flag_date_issue
```

### G-014: Numéro Unique? ⚡
```yaml
guard: "G_UNIQUE_NUMBER"
question: "Le numéro (facture/soumission/projet) est-il unique?"
check: |
  - Pas de doublon dans la BD?

✅ OUI: proceed
❌ NON: generate_new_number
```

---

## 3) GUARDS ANTI-ERREUR — CONSTRUCTION ⚡

### G-020: Licence RBQ Valide? ⚡
```yaml
guard: "G_RBQ_VALID"
question: "La licence RBQ est-elle valide et active?"
check: |
  - Vérifier API RBQ
  - Status = ACTIVE?
  - Pas expirée?

✅ OUI: proceed
❌ NON: STOP + alert_critical
```

### G-021: CNESST À Jour? ⚡
```yaml
guard: "G_CNESST_VALID"
question: "L'inscription CNESST est-elle à jour?"
check: |
  - Pas de cotisations en retard?
  - Attestation valide?

✅ OUI: proceed
❌ NON: warn + suggest_regularization
```

### G-022: Sous-Traitant Licencié? ⚡
```yaml
guard: "G_SUB_LICENSED"
question: "Le sous-traitant a-t-il sa licence RBQ pour ces travaux?"
check: |
  - Licence active?
  - Catégorie couvre les travaux?

✅ OUI: proceed
❌ NON: STOP + cannot_hire_unlicensed
```

### G-023: Assurances Valides? ⚡
```yaml
guard: "G_INSURANCE_VALID"
question: "Les assurances sont-elles valides?"
check: |
  - Responsabilité civile active?
  - Montant suffisant pour le projet?
  - Date expiration > fin projet?

✅ OUI: proceed
❌ NON: request_updated_certificate
```

### G-024: Permis Requis? ⚡
```yaml
guard: "G_PERMIT_NEEDED"
question: "Un permis municipal est-il requis?"
check: |
  - Type de travaux vs règlements municipaux
  - Valeur > seuil permis?

✅ OUI: check_permit_obtained
❌ NON: proceed_no_permit
```

### G-025: Permis Obtenu? ⚡
```yaml
guard: "G_PERMIT_OBTAINED"
question: "Le permis a-t-il été obtenu?"
check: |
  - Numéro permis dans dossier?
  - Status = approuvé?

✅ OUI: proceed
❌ NON: STOP + cannot_start_without_permit
```

---

## 4) GUARDS ANTI-ERREUR — FINANCE ⚡

### G-030: Budget Disponible? ⚡
```yaml
guard: "G_BUDGET_AVAILABLE"
question: "Y a-t-il assez de budget pour cette dépense?"
check: |
  - Montant demandé <= budget restant?

✅ OUI: proceed
❌ NON: alert_budget_exceeded + request_approval
```

### G-031: Fournisseur Approuvé? ⚡
```yaml
guard: "G_VENDOR_APPROVED"
question: "Le fournisseur est-il dans la liste approuvée?"
check: |
  - Fournisseur in approved_vendors?
  - OU montant < 500$?

✅ OUI: proceed
❌ NON: request_vendor_approval_first
```

### G-032: Double Paiement? ⚡
```yaml
guard: "G_DUPLICATE_PAYMENT"
question: "Cette facture a-t-elle déjà été payée?"
check: |
  - Numéro facture + fournisseur + montant
  - Existe dans historique paiements?

✅ NON (pas de doublon): proceed
❌ OUI (doublon): STOP + show_previous_payment
```

### G-033: Taxes Correctes? ⚡
```yaml
guard: "G_TAX_CORRECT"
question: "Les taxes sont-elles calculées correctement?"
check: |
  - TPS = sous-total × 5%?
  - TVQ = sous-total × 9.975%?
  - Total = sous-total + TPS + TVQ?

✅ OUI: proceed
❌ NON: recalculate_taxes
```

### G-034: Conditions Paiement Respectées? ⚡
```yaml
guard: "G_PAYMENT_TERMS"
question: "Les conditions de paiement correspondent au contrat?"
check: |
  - Net 30 si contrat dit Net 30?
  - Retenue conforme?

✅ OUI: proceed
❌ NON: adjust_to_contract_terms
```

---

## 5) GUARDS ANTI-ERREUR — GÉNÉRATION CONTENU ⚡

### G-040: Script Vérifié? ⚡
```yaml
guard: "G_SCRIPT_VERIFIED"
question: "Le script a-t-il été vérifié et approuvé?"
trigger: "before_video_generation"
check: |
  - Script exists?
  - Script reviewed = true?
  - Script approved = true?

✅ OUI: proceed_to_video_generation
❌ NON: STOP + "Script doit être approuvé avant génération vidéo"
```

### G-041: Storyboard Approuvé? ⚡
```yaml
guard: "G_STORYBOARD_APPROVED"
question: "Le storyboard a-t-il été approuvé?"
trigger: "before_video_generation"
check: |
  - Storyboard exists?
  - Storyboard approved?

✅ OUI: proceed
❌ NON: request_storyboard_approval
```

### G-042: Assets Disponibles? ⚡
```yaml
guard: "G_ASSETS_READY"
question: "Tous les assets (images, audio, logos) sont-ils prêts?"
trigger: "before_media_generation"
check: |
  - Liste assets requise vs assets disponibles
  - Tous présents?

✅ OUI: proceed
❌ NON: list_missing_assets
```

### G-043: Droits d'Utilisation? ⚡
```yaml
guard: "G_USAGE_RIGHTS"
question: "Avons-nous les droits d'utiliser ces assets?"
trigger: "before_publication"
check: |
  - Assets = propriétaires OU licenciés?
  - Pas de contenu protégé non autorisé?

✅ OUI: proceed
❌ NON: flag_rights_issue
```

### G-044: Brand Guidelines Respectés? ⚡
```yaml
guard: "G_BRAND_COMPLIANT"
question: "Le contenu respecte-t-il les guidelines de marque?"
check: |
  - Couleurs correctes?
  - Logo bien placé?
  - Ton de voix approprié?

✅ OUI: proceed
❌ NON: show_brand_violations
```

### G-045: Orthographe Vérifiée? ⚡
```yaml
guard: "G_SPELLING_CHECK"
question: "L'orthographe a-t-elle été vérifiée?"
trigger: "before_publication"
check: |
  - Spell check passed?
  - Noms propres corrects?

✅ OUI: proceed
❌ NON: run_spell_check + show_errors
```

---

## 6) GUARDS ANTI-ERREUR — COMMUNICATION ⚡

### G-050: Destinataire Correct? ⚡
```yaml
guard: "G_RECIPIENT_CHECK"
question: "Le destinataire est-il le bon?"
trigger: "before_email_send"
check: |
  - Email valide?
  - Correspond au contexte?
  - Pas de confusion de nom?

✅ OUI: proceed
❌ NON: confirm_recipient
```

### G-051: Pièces Jointes Présentes? ⚡
```yaml
guard: "G_ATTACHMENTS_CHECK"
question: "Les pièces jointes mentionnées sont-elles attachées?"
trigger: "before_email_send"
check: |
  - Texte mentionne "ci-joint" ou "attaché"?
  - Pièces jointes présentes?

✅ OUI (ou pas de mention): proceed
❌ NON (mention sans pièce): STOP + "Pièce jointe manquante!"
```

### G-052: Répondre à Tous Nécessaire? ⚡
```yaml
guard: "G_REPLY_ALL_CHECK"
question: "Reply-all est-il vraiment nécessaire?"
trigger: "on_reply_all"
check: |
  - Plus de 5 destinataires?
  - Contenu pertinent pour tous?

✅ OUI: proceed
❌ NON: suggest_reply_to_sender_only
```

### G-053: Info Confidentielle? ⚡
```yaml
guard: "G_CONFIDENTIAL_CHECK"
question: "Y a-t-il de l'information confidentielle?"
trigger: "before_external_send"
check: |
  - Mots-clés confidentiels détectés?
  - Données financières sensibles?
  - Destinataire externe?

✅ NON (pas confidentiel): proceed
❌ OUI (confidentiel + externe): warn + request_confirmation
```

---

## 7) GUARDS ANTI-ERREUR — DONNÉES ⚡

### G-060: Format Valide? ⚡
```yaml
guard: "G_FORMAT_VALID"
question: "Les données sont-elles dans le bon format?"
check: |
  - Email: contient @ et .?
  - Téléphone: 10 chiffres?
  - Code postal: A1A 1A1?
  - Date: YYYY-MM-DD?

✅ OUI: proceed
❌ NON: show_format_error + suggest_correction
```

### G-061: Données Obligatoires? ⚡
```yaml
guard: "G_REQUIRED_FIELDS"
question: "Tous les champs obligatoires sont-ils remplis?"
check: |
  - Pour chaque champ required
  - Valeur non vide?

✅ OUI: proceed
❌ NON: list_missing_fields
```

### G-062: Valeur Dans Plage? ⚡
```yaml
guard: "G_VALUE_RANGE"
question: "La valeur est-elle dans une plage réaliste?"
check: |
  - Prix: > 0 et < max_reasonable?
  - Quantité: > 0 et < max_reasonable?
  - Pourcentage: 0-100?

✅ OUI: proceed
❌ NON: flag_suspicious_value
```

### G-063: Pas de Doublon? ⚡
```yaml
guard: "G_NO_DUPLICATE"
question: "Cette entrée existe-t-elle déjà?"
check: |
  - Même clé unique?
  - Même combinaison de champs?

✅ NON (pas de doublon): proceed
❌ OUI (doublon): show_existing + ask_update_or_cancel
```

---

## 8) GUARDS SÉQUENTIELS — WORKFLOWS ⚡

### Workflow: Génération Vidéo ⚡
```yaml
video_generation_guards:
  sequence:
    1: G_CONTENT_NEEDED      # Vraiment besoin de générer?
    2: G_SCRIPT_VERIFIED     # Script vérifié?
    3: G_STORYBOARD_APPROVED # Storyboard approuvé?
    4: G_ASSETS_READY        # Assets prêts?
    5: G_USAGE_RIGHTS        # Droits OK?
    6: G_BRAND_COMPLIANT     # Brand respecté?
    
  all_pass: generate_video
  any_fail: stop_at_first_failure
```

### Workflow: Envoi Soumission ⚡
```yaml
bid_submission_guards:
  sequence:
    1: G_DOC_COMPLETE        # Document complet?
    2: G_MATH_CHECK          # Calculs corrects?
    3: G_CLIENT_NAME         # Nom client correct?
    4: G_DATES_LOGIC         # Dates logiques?
    5: G_UNIQUE_NUMBER       # Numéro unique?
    6: G_RBQ_VALID           # Licence RBQ valide?
    7: G_SPELLING_CHECK      # Orthographe OK?
    8: G_ATTACHMENTS_CHECK   # Pièces jointes?
    
  all_pass: send_bid
  any_fail: stop_and_fix
```

### Workflow: Nouveau Sous-Traitant ⚡
```yaml
new_subcontractor_guards:
  sequence:
    1: G_SUB_LICENSED        # Licence RBQ?
    2: G_CNESST_VALID        # CNESST à jour?
    3: G_INSURANCE_VALID     # Assurances valides?
    4: G_NO_DUPLICATE        # Pas déjà dans système?
    5: G_REQUIRED_FIELDS     # Info complète?
    
  all_pass: add_subcontractor
  any_fail: cannot_add
```

### Workflow: Paiement Fournisseur ⚡
```yaml
vendor_payment_guards:
  sequence:
    1: G_DUPLICATE_PAYMENT   # Déjà payé?
    2: G_VENDOR_APPROVED     # Fournisseur approuvé?
    3: G_BUDGET_AVAILABLE    # Budget dispo?
    4: G_TAX_CORRECT         # Taxes OK?
    5: G_PAYMENT_TERMS       # Conditions respectées?
    6: G_MATH_CHECK          # Montants corrects?
    
  all_pass: process_payment
  any_fail: hold_payment
```

---

## 9) QUICK REFERENCE — TOUS LES GUARDS ⚡

### Guards de Base (G-001 à G-005) ⚡
| Code | Question Rapide |
|------|-----------------|
| G-001 | Besoin de générer du contenu? |
| G-002 | Info déjà disponible? |
| G-003 | Contexte suffisant? |
| G-004 | Bon agent? |
| G-005 | Urgent? |

### Guards Documents (G-010 à G-014) ⚡
| Code | Question Rapide |
|------|-----------------|
| G-010 | Document complet? |
| G-011 | Calculs corrects? |
| G-012 | Nom client correct? |
| G-013 | Dates logiques? |
| G-014 | Numéro unique? |

### Guards Construction (G-020 à G-025) ⚡
| Code | Question Rapide |
|------|-----------------|
| G-020 | RBQ valide? |
| G-021 | CNESST à jour? |
| G-022 | Sous-traitant licencié? |
| G-023 | Assurances valides? |
| G-024 | Permis requis? |
| G-025 | Permis obtenu? |

### Guards Finance (G-030 à G-034) ⚡
| Code | Question Rapide |
|------|-----------------|
| G-030 | Budget disponible? |
| G-031 | Fournisseur approuvé? |
| G-032 | Double paiement? |
| G-033 | Taxes correctes? |
| G-034 | Conditions paiement OK? |

### Guards Génération (G-040 à G-045) ⚡
| Code | Question Rapide |
|------|-----------------|
| G-040 | **Script vérifié?** |
| G-041 | Storyboard approuvé? |
| G-042 | Assets disponibles? |
| G-043 | Droits d'utilisation? |
| G-044 | Brand guidelines OK? |
| G-045 | Orthographe vérifiée? |

### Guards Communication (G-050 à G-053) ⚡
| Code | Question Rapide |
|------|-----------------|
| G-050 | Destinataire correct? |
| G-051 | Pièces jointes présentes? |
| G-052 | Reply-all nécessaire? |
| G-053 | Info confidentielle? |

### Guards Données (G-060 à G-063) ⚡
| Code | Question Rapide |
|------|-----------------|
| G-060 | Format valide? |
| G-061 | Champs obligatoires? |
| G-062 | Valeur réaliste? |
| G-063 | Pas de doublon? |

---

## 10) IMPLÉMENTATION SIMPLE ⚡

### Code Pattern ⚡
```typescript
interface Guard {
  id: string;
  question: string;
  check: () => boolean;
  onPass: () => void;
  onFail: () => void;
}

function runGuard(guard: Guard): boolean {
  console.log(`🛂 ${guard.id}: ${guard.question}`);
  
  if (guard.check()) {
    console.log(`✅ PASS`);
    guard.onPass();
    return true;
  } else {
    console.log(`❌ FAIL`);
    guard.onFail();
    return false;
  }
}

function runGuardSequence(guards: Guard[]): boolean {
  for (const guard of guards) {
    if (!runGuard(guard)) {
      return false; // Stop at first failure
    }
  }
  return true;
}
```

### Exemple Usage ⚡
```typescript
const videoGenerationGuards = [
  {
    id: 'G-040',
    question: 'Le script a-t-il été vérifié et approuvé?',
    check: () => script.verified && script.approved,
    onPass: () => console.log('Script OK'),
    onFail: () => alert('Script doit être approuvé avant génération vidéo')
  },
  {
    id: 'G-042',
    question: 'Tous les assets sont-ils prêts?',
    check: () => assets.every(a => a.ready),
    onPass: () => console.log('Assets OK'),
    onFail: () => showMissingAssets(assets.filter(a => !a.ready))
  }
];

if (runGuardSequence(videoGenerationGuards)) {
  generateVideo();
}
```

---

## 11) RÈGLES GUARDS ⚡

### Principes ⚡
```
1. SIMPLE: Une question = Une réponse OUI/NON
2. RAPIDE: Vérification instantanée (< 1 seconde)
3. CLAIR: Message d'erreur explicite si échec
4. BLOQUANT: Échec critique = STOP immédiat
5. TRAÇABLE: Chaque guard logué
```

### Hiérarchie Sévérité ⚡
| Niveau | Action sur Échec |
|--------|------------------|
| INFO | Log + continue |
| WARNING | Avertir + continue possible |
| ERROR | Bloquer + correction requise |
| CRITICAL | **STOP TOTAL + alerte immédiate** |

### Guards Critiques (Jamais Bypass) ⚡
```yaml
critical_guards:
  - G-020: RBQ_VALID      # Licence obligatoire
  - G-022: SUB_LICENSED   # Sous-traitant licencié
  - G-025: PERMIT_OBTAINED # Permis avant travaux
  - G-032: DUPLICATE_PAYMENT # Jamais payer 2 fois
  - G-040: SCRIPT_VERIFIED # Script avant vidéo
```

---

## 12) AJOUT DE NOUVEAUX GUARDS ⚡

### Template ⚡
```yaml
guard:
  id: "G_XXX"
  category: "base|document|construction|finance|generation|communication|data"
  question: "Question simple et claire?"
  trigger: "when_to_run"
  
  check: |
    - Condition 1
    - Condition 2
    
  ✅ OUI: action_if_pass
  ❌ NON: action_if_fail
  
  severity: "info|warning|error|critical"
```

---

**TOTAL: 35+ MICRO-GUARDS ANTI-ERREUR**

**END — MICRO-CHECKS & GUARD RAILS v1.0**
