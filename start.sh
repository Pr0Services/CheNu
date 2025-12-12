#!/bin/bash
# ============================================================
# CHE·NU ULTRA PACK — Startup Script
# ============================================================

set -e

echo "🚀 Starting CHE·NU ULTRA PACK..."
echo "================================"

# Check environment
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env with your configuration"
    exit 1
fi

# Load environment
source .env

# Check required vars
required_vars=("DB_PASSWORD" "JWT_SECRET" "OPENAI_API_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required variable: $var"
        exit 1
    fi
done

echo "✅ Environment validated"

# Start services
echo ""
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for services
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Health checks
echo ""
echo "🔍 Running health checks..."

services=("api_service:3000" "orchestrator_llm:3001" "xr_gateway:8080")
for service in "${services[@]}"; do
    name=${service%:*}
    port=${service#*:}
    if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
        echo "  ✅ $name is healthy"
    else
        echo "  ⚠️  $name may still be starting..."
    fi
done

echo ""
echo "================================"
echo "🎉 CHE·NU ULTRA PACK is running!"
echo ""
echo "📡 Services:"
echo "   • API:         http://localhost:3000"
echo "   • Orchestrator: http://localhost:3001"
echo "   • Frontend:    http://localhost:80"
echo "   • XR Gateway:  ws://localhost:8080"
echo "   • PostgreSQL:  localhost:5432"
echo "   • Redis:       localhost:6379"
echo ""
echo "🔧 Commands:"
echo "   • Stop:   docker-compose down"
echo "   • Logs:   docker-compose logs -f"
echo "   • Status: docker-compose ps"
echo "================================"
