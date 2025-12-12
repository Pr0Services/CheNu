# 🏛️ CHE·NU Backend API

API FastAPI pour la plateforme de construction intelligente CHE·NU.

## 🚀 Démarrage Rapide

### Option 1: Docker (Recommandé)

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f api
```

L'API sera disponible sur `http://localhost:8000`

### Option 2: Local

```bash
# 1. Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou: venv\Scripts\activate  # Windows

# 2. Installer dépendances
pip install -r requirements.txt

# 3. Configurer environnement
cp .env.example .env
# Éditer .env avec vos clés

# 4. Démarrer le serveur
python main.py
# ou: uvicorn main:app --reload
```

## 📁 Structure

```
├── api/
│   └── routes/         # Endpoints API
│       ├── auth.py     # Authentification
│       ├── users.py    # Utilisateurs
│       ├── projects.py # Projets
│       ├── spheres.py  # Sphères
│       ├── agents.py   # Agents IA
│       ├── nova.py     # Nova AI
│       └── ...
├── core/
│   ├── config/         # Configuration
│   ├── database/       # Connexion DB
│   └── security/       # Auth & JWT
├── models/             # Modèles SQLAlchemy
├── schemas/            # Schémas Pydantic
├── services/           # Logique métier
│   ├── nova_service.py # Service Nova AI
│   └── ...
└── main.py             # Point d'entrée
```

## 🔌 Endpoints Principaux

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `POST /api/auth/login` | Connexion |
| `POST /api/auth/register` | Inscription |
| `GET /api/users/me` | Profil utilisateur |
| `GET /api/projects` | Liste projets |
| `POST /api/nova/chat` | Chat avec Nova |
| `GET /api/spheres` | Liste sphères |
| `GET /api/agents` | Liste agents |

## 📚 Documentation API

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **OpenAPI JSON**: http://localhost:8000/api/openapi.json

## 🔧 Configuration

| Variable | Description | Requis |
|----------|-------------|--------|
| `DATABASE_URL` | URL PostgreSQL | ✅ |
| `REDIS_URL` | URL Redis | ✅ |
| `SECRET_KEY` | Clé secrète app | ✅ |
| `JWT_SECRET_KEY` | Clé JWT | ✅ |
| `ANTHROPIC_API_KEY` | Clé API Claude | ✅ |
| `OPENAI_API_KEY` | Clé API OpenAI | ⚪ |

## 🧪 Tests

```bash
# Lancer tous les tests
pytest

# Avec couverture
pytest --cov=. --cov-report=html

# Tests spécifiques
pytest tests/test_auth.py -v
```

## 📦 Technologies

- FastAPI 0.109
- SQLAlchemy 2.0 (async)
- PostgreSQL 16
- Redis 7
- Anthropic Claude API
- Pydantic 2.5

## 🐳 Docker Commands

```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Shell dans container
docker-compose exec api bash
```

---

*CHE·NU - Chez Nous | Construction Intelligente* 🏗️✨
