# CHE·NU — KNOWLEDGE THREADS SYSTEM
**VERSION:** KT.v1.0  
**MODE:** FOUNDATION / NON-MANIPULATIVE / COMMUNITY-ENHANCING

---

## CORE PRINCIPLE ⚡

> **A "Knowledge Thread" is a NON-SOCIAL, NON-ALGORITHMIC, NON-MANIPULATIVE chain of information that:** aligns needs, surfaces offers, creates opportunities, promotes circular economy **WITHOUT feeds, likes, ranking, or emotional triggers.**

> **A thread = a logical link between people and knowledge, NOT a social network mechanic.**

---

## KNOWLEDGE THREAD TYPE 1: PERSONAL NEED THREAD ⚡

> *"Je cherche un vélo", "mon ordi est brisé"*

### Purpose
> **Allow each user to express a NEED that activates a thread linking:** local opportunities, skills in the community, circular goods, relevant agents.

### Rules ⚡
| Rule | Status |
|------|--------|
| **no ranking** | ✅ ⚡ |
| **no bidding** | ✅ ⚡ |
| **no ads** | ✅ ⚡ |
| **no recommendation bias** | ✅ ⚡ |

### Trigger Examples ⚡
- j'ai besoin d'un vélo
- je cherche un ordinateur usagé
- j'ai besoin d'aide pour un meuble
- **mon téléphone est brisé**

### Thread Behavior ⚡
- Creates a **NEED NODE**
- Automatically links to: nearby offers, relevant skills, institutions, tutorials
- **Stays calm, non-intrusive**

### Need Thread JSON ⚡
```json
{
  "need_thread": {
    "id": "uuid",
    "user": "uuid",
    "need_type": "object|service|repair",
    "description": "string",
    "links": ["offer_ids", "skill_ids", "guide_ids"],
    "status": "open|matched|closed"
  }
}
```

---

## KNOWLEDGE THREAD TYPE 2: COMMUNITY SKILL / OFFER THREAD ⚡

> *"Je peux donner des cours", "je peux réparer ton ordi"*

### Purpose
> **Let users declare SKILLS or OFFERS, WITHOUT marketplace dynamics.**

### Examples ⚡
- cours de math
- réparation de vélo
- photographe local
- traduction
- peinture
- **coaching**

### Thread Behavior ⚡
- Creates a **SKILL NODE**
- The system **never rates, ranks, or pushes**
- It only LINKS when a NEED aligns

### Skill Thread JSON ⚡
```json
{
  "skill_thread": {
    "id": "uuid",
    "user": "uuid",
    "skills": ["repair", "teaching", "craft"],
    "availability": "calendar",
    "links": ["need_ids"],
    "status": "active|inactive"
  }
}
```

---

## KNOWLEDGE THREAD TYPE 3: CIRCULAR MARKETPLACE THREAD ⚡

> *"je vends mes vêtements", "je recycle mon vieux laptop"*

### Purpose
> **Enable circular reuse by linking goods → needs → skills.**

### Examples ⚡
- vieux vêtements
- meubles
- laptop brisé
- outils
- **vélo d'enfant à donner**

### Behavior ⚡
- circular goods are listed as **RESOURCES, not products**
- **no price bidding, no auction**
- the system proposes **REPAIR instead of replacement** when possible
- connects to skill threads (repairers)
- connects to need threads

### Circular Thread JSON ⚡
```json
{
  "circular_thread": {
    "id": "uuid",
    "owner": "uuid",
    "resource_type": "clothing|electronics|tools|vehicle|etc",
    "condition": "like_new|used|repair_needed",
    "location": "geo",
    "links": ["need_ids", "skill_ids"],
    "status": "available|claimed|recycled"
  }
}
```

---

## CHE·NU SPECIAL MODULE: CIRCULAR INTELLIGENCE ENGINE ⚡ (NOUVEAU!)

### Purpose
> **Promote community-scale regeneration & reduce waste.**

### Example Inputs ⚡
| Input | Type |
|-------|------|
| "Je cherche un vélo" | NEED ⚡ |
| "Je vends mes vieux vêtements" | CIRCULAR ⚡ |
| "Mon ordi est brisé" | NEED ⚡ |
| "Je peux donner des cours" | SKILL ⚡ |
| "J'ai un outil inutilisé" | CIRCULAR ⚡ |
| "Je cherche un photographe" | NEED ⚡ |

### System Actions ⚡
- Creates a unified **THREAD-HUB** around the user
- Connects **NEEDS → SKILLS → RESOURCES**
- Encourages **reuse before purchase**
- Encourages **human collaboration before automation**

> **No manipulation. No behavioral nudging. Only showing AVAILABLE PATHS.**

### Thread-Hub JSON ⚡
```json
{
  "thread_hub": {
    "user": "uuid",
    "merged_threads": [
      "need_thread_ids",
      "skill_thread_ids",
      "circular_thread_ids"
    ],
    "graph": {
      "nodes": ["..."],
      "links": ["..."]
    }
  }
}
```

---

## AUTOMATIC LINKING RULES ⚡

### IF user posts a NEED ⚡
→ link to circular offers within radius  
→ link to skill threads (repair, help, knowledge)  
→ link to institutional help when relevant  
→ link to learning threads (scholar sphere)

### IF user posts an OFFER ⚡
→ link to open needs  
→ link to spheres requiring that type of skill  
→ link to community threads

### IF user posts a RESOURCE ⚡
→ link to potential reuse  
→ link to repair skills  
→ link to needs of same category

---

## SAFETY & ETHICS ⚡

| Rule | Status |
|------|--------|
| **No algorithmic persuasion** | ✅ ⚡ |
| **No FOMO** | ✅ ⚡ |
| **No commercial feeds** | ✅ ⚡ |
| **No social pressure signals** | ✅ ⚡ |
| **No public visibility unless explicitly chosen** | ✅ ⚡ |
| **All interactions opt-in** | ✅ ⚡ |
| **No monetization model built-in** | ✅ ⚡ |

---

**END — KNOWLEDGE THREAD FRAMEWORK (3-en-1)**
