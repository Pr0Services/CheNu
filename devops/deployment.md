# CHE·NU Deployment Guide

## Quick Start

```bash
# 1. Copy environment file
cp devops/environment.example .env

# 2. Edit .env with your API keys
nano .env

# 3. Start services
cd devops
docker-compose up -d

# 4. Check health
curl http://localhost:8080/health
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| API | 8080 | Fastify REST API |
| Frontend | 3000 | React UI |
| XR Gateway | 8081 | WebSocket XR |
| PostgreSQL | 5432 | Database |

## Production

For production, ensure:
- Strong DB_PASSWORD
- Valid API keys
- CORS_ORIGIN set correctly
- SSL/TLS enabled

## CHE·NU System

- **Kernel**: CORE+ / OS-5.5 / OS-6.0
- **LAWBOOK**: Enforced
- **Multiplex**: Enabled
- **Self-Healing**: Enabled
