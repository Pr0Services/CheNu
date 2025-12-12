# CHE·NU — Guide d'Intégration v2.0

**Mise à jour**: 2024-12-10
**Fichiers**: 197 fichiers
**Packages**: 10 modules

---

## 📦 CONTENU DU PACKAGE

### /docs (17 PDFs + 2 MD)
Documentation de référence complète

### /packages (10 modules npm)
```
packages/
├── architectural-sphere/    # Sphère architecturale + arch-agents
├── avatar-evolution/        # Système d'évolution avatar
├── collective-memory/       # Mémoire collective + navigation
├── decor-system/           # Système de décor ambiant
├── governance/             # Lois fondamentales + éthique
├── knowledge-threads/      # Threads + Audit + Continuité
├── multi-agents/           # Orchestration multi-agents
├── xr-comparison/          # Comparaison XR
├── xr-meeting/             # Salle de réunion XR
└── xr-presets/             # Presets XR (5 thèmes)
```

### /frontend/src (Structure React/Vite)
```
frontend/src/
├── agents/          # AgentRegistry, Guards
├── components/      # UI Components (XR, Ethics, Core, etc.)
├── config/          # Configuration modules
├── data/            # Données & registres
├── ethics/          # Logique éthique
├── hooks/           # React hooks personnalisés
├── services/        # Services (simpleAgent)
├── state/           # Stores Zustand
├── styles/          # CSS de base
├── types/           # TypeScript definitions
├── views/           # Pages/Views principales
├── App.tsx          # Point d'entrée
└── main.tsx         # Bootstrap
```

---

## 🚀 INSTALLATION RAPIDE

### Option A: Nouveau Projet
```bash
# 1. Créer projet Vite
npm create vite@latest chenu -- --template react-ts
cd chenu

# 2. Extraire et copier
unzip CHENU_INTEGRATION.zip
cp -r CHENU_INTEGRATION/frontend/src/* src/
cp -r CHENU_INTEGRATION/packages ./
cp -r CHENU_INTEGRATION/docs ./

# 3. Installer dépendances
npm install zustand lucide-react @react-three/fiber @react-three/drei three
npm install -D @types/three

# 4. Lancer
npm run dev
```

### Option B: Projet Existant
```bash
# MERGE (ne remplace pas les fichiers existants)
cp -rn CHENU_INTEGRATION/frontend/src/* /ton/projet/src/
cp -r CHENU_INTEGRATION/packages/* /ton/projet/packages/
```

---

## 📋 VÉRIFICATION POST-INSTALLATION

```bash
# Vérifier les imports
grep -r "from '@chenu" src/ | wc -l  # Devrait trouver des imports

# Vérifier les composants
ls src/components/xr/  # 12 composants XR

# Vérifier les stores
ls src/state/  # 7 stores Zustand
```

---

## 🔗 CONNEXIONS ENTRE MODULES

Voir `MODULE_CONNECTIONS.md` pour le diagramme complet.

Points clés:
- **Universe View** = Point d'entrée principal
- **Knowledge Threads** = Connecte tout via threads traçables
- **Governance** = Règles appliquées à TOUS les modules
- **XR Systems** = Meeting → Replay → Comparison

---

## 📊 MODULES COMPLÉTÉS (20/20)

| Module | Status | Package |
|--------|--------|---------|
| Core Laws & Ethics | ✅ | governance |
| Law Engine | ✅ | governance |
| Memory System | ✅ | collective-memory |
| XR Presets Pack | ✅ | xr-presets |
| XR Meeting Room | ✅ | xr-meeting |
| XR Replay | ✅ | frontend/components/xr |
| XR Replay Comparison | ✅ | xr-comparison |
| Universe View | ✅ | frontend/views |
| AI Routing | ✅ | frontend/agents |
| Avatar System | ✅ | avatar-evolution |
| Architectural Sphere | ✅ | architectural-sphere |
| Architect Orchestrator | ✅ | architectural-sphere/arch-agents |
| Knowledge Threads | ✅ | knowledge-threads |
| Collective Memory | ✅ | collective-memory |
| Personal Nav Profiles | ✅ | collective-memory |
| Methodology Agents | ✅ | multi-agents |
| Routing Agents | ✅ | multi-agents |
| Architectural Agents | ✅ | architectural-sphere/arch-agents |
| Menu Engine | ✅ | frontend/components/menu |
| Hooks/React | ✅ | frontend/hooks |

---

## 🛡️ PRINCIPES FONDAMENTAUX

> **Threads CONNECT facts. They DO NOT interpret, rank, or conclude.**
> 
> **Memory without manipulation**  
> **Truth without authority**  
> **Evolution without erasure**

---

**CHE·NU — Chez Nous — Your Digital Home** 🏠
