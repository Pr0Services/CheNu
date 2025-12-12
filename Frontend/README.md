# 🏠 CHE·NU — Sovereign Multi-Agent Operating Space

> **Version**: 2.0.0-complete  
> **Date**: 9 Décembre 2025  
> **Lignes de code**: ~301,520  
> **Fichiers**: 880+

---

## 🧭 Fondation Éthique

CHE·NU est construit sur une **fondation éthique gelée et immuable**.

```
SHA-256: d0fe40d1928c9a3ed64ab73746e8ef2a5418fa1b0aefe4d87ea8be5e6e7ded87
```

### Principes Fondamentaux (Les 3 Lois de l'Arbre)

1. ❌ **Aucun agent ne prend de décision pour l'utilisateur**
2. ❌ **Aucun jugement moral ou scoring**
3. ❌ **Aucun nudging comportemental**
4. ✅ **La responsabilité reste humaine**
5. ✅ **L'assistance est explicite et réversible**
6. ✅ **Mode silence désactive toute observation**

---

## 📁 Structure du Projet

```
chenu-perfect/
├── backend/                    # FastAPI Python Backend
│   ├── core/                   # Core modules + config + database
│   │   ├── config/            # Settings & configuration
│   │   ├── database/          # SQLAlchemy async connection
│   │   ├── automation_engine.py
│   │   ├── event_bus.py
│   │   └── ...
│   ├── services/              # 87 business services
│   ├── api/                   # REST & WebSocket routes
│   ├── models/                # ORM models & repositories
│   ├── integrations/          # Quebec, Social, etc.
│   └── tests/                 # Pytest suite
│
├── apps/web/src/              # React/TypeScript Frontend
│   ├── core/                  # 111 core modules
│   │   ├── agents/           # Multi-agent system
│   │   ├── constitution/     # Constitutional AI
│   │   ├── ethics/           # Ethical framework
│   │   └── ...
│   ├── modules/              # 25 feature modules
│   │   └── construction/     # 10 construction-specific
│   ├── xr/                   # 60 XR/VR components
│   ├── ui/                   # 70 UI components
│   ├── widgets/              # 63 widgets
│   └── ...
│
├── database/                  # SQL schemas & migrations
├── config/                    # YAML configurations
├── docs/                      # 55 documentation files
├── infrastructure/            # Docker, K8s, CI/CD
└── core/                      # Ethical foundation (read-only)
```

---

## 🚀 Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend

```bash
npm install
npm run dev
```

### Docker

```bash
docker-compose up -d
```

---

## 📊 Statistiques

| Composant | Fichiers | Lignes |
|-----------|----------|--------|
| Python Backend | 128 | 75,809 |
| TypeScript | 310 | 98,901 |
| React (TSX) | 159 | 65,543 |
| JSX Widgets | 46 | 34,348 |
| SQL | 5 | 1,840 |
| YAML Config | 2 | 3,759 |
| Documentation | 55 | 21,320 |
| **Total** | **880+** | **301,520** |

---

## 🤖 Architecture Multi-Agent

CHE·NU utilise une architecture hiérarchique de 168+ agents spécialisés:

- **L0 (Tronc)**: Orchestrateur central, Router LLM
- **L1 (Branches)**: Agents de coordination par département
- **L2 (Feuilles)**: Agents spécialisés par tâche
- **L3 (Sève)**: Agents de support et monitoring

---

## 🏗️ Conformité Québec

- ✅ **RBQ** - Régie du bâtiment du Québec
- ✅ **CNESST** - Santé et sécurité au travail
- ✅ **CCQ** - Commission de la construction du Québec

---

## 📖 Documentation

Voir le dossier `/docs` pour la documentation complète:

- `CHENU-MANIFESTE.md` - Vision et principes
- `CHENU-COMPLETE-DOCUMENTATION.md` - Documentation technique
- `CHENU-SYSTEM-PROMPT.md` - System prompt pour agents
- `architecture/ARCHITECTURE_HIERARCHIQUE.md` - Architecture détaillée

---

> **CHE·NU** - Governed Intelligence Operating System  
> *"Chez Nous, la responsabilité humaine reste active"*
