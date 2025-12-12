# CHE·NU Health Checks

## Endpoints

### API Service
```bash
curl http://localhost:8080/health
```
Expected:
```json
{
  "status": "ok",
  "system": "CHE·NU ULTRA PACK",
  "kernel": "CORE+ / OS-5.5 / OS-6.0"
}
```

### Orchestrator Status
```bash
curl http://localhost:8080/api/orchestrator/status
```

### XR Gateway
```bash
curl http://localhost:8081/health
```

## Docker Health

```bash
docker-compose ps
docker-compose logs api_service
```

## Database

```bash
docker-compose exec db psql -U chenu -d chenu_db -c "SELECT 1"
```
