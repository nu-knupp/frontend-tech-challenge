#!/bin/bash

echo "🚀 Iniciando arquitetura Nginx Reverse Proxy + Single-SPA..."
echo ""

# Stop any existing containers
echo "🛑 Parando containers existentes..."
docker compose -f docker-compose.hybrid.yml down

# Clean build cache if needed
echo "🧹 Limpando cache Docker..."
docker system prune -f > /dev/null 2>&1

# Build and start all services
echo "🏗️  Construindo e iniciando todos os serviços..."
echo "   📦 1 aplicação Next.js (build único)"
echo "   🌐 3 servidores Nginx (reverse proxy)"
echo "   🎭 1 Single-SPA shell (orquestrador)"
echo "   🗄️  1 JSON Server (API compartilhada)"
echo ""

docker compose -f docker-compose.hybrid.yml up --build

echo ""
echo "✅ Arquitetura Nginx + Single-SPA iniciada!"
echo ""
echo "🎯 Nova arquitetura implementada:"
echo "   Next.js App (interno) → 3 Nginx Proxies → Single-SPA Shell"
echo ""
echo "📍 Endpoints disponíveis:"
echo "   🌐 Single-SPA Shell:      http://localhost:9000"
echo "   🏠 Home (Nginx Proxy):    http://localhost:9001"
echo "   📊 Analytics (Nginx):     http://localhost:9002"
echo "   💳 Transactions (Nginx):  http://localhost:9003"
echo "   🗄️  JSON Server API:       http://localhost:3001"
echo ""
echo "🔍 Para debug: ./debug-nginx.sh"
echo ""
