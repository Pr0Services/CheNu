# CHE·NU Backend

Fastify-based REST API for CHE·NU.

## Setup

```bash
npm install
npx prisma generate
npm run dev
```

## Endpoints

- `POST /api/orchestrator/dispatch` - Main entry
- `POST /api/agents/:id/execute` - Agent execution
- `POST /api/simulation/run` - CSF simulation
- `POST /api/xr/render` - XR rendering
- `GET /health` - Health check
