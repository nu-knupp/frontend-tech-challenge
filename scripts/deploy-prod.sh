#!/bin/bash

set -e

echo "🚀 Deploy em Produção (Docker Hub)"

# Obter usuário Docker Hub
if [ -z "$1" ]; then
    read -p "Digite seu usuário do Docker Hub: " DOCKER_USER
else
    DOCKER_USER=$1
fi

if [ -z "$DOCKER_USER" ]; then
    echo "❌ Usuário é obrigatório!"
    echo "Uso: $0 <usuario_docker_hub>"
    exit 1
fi

# Detectar docker compose
if command -v docker compose >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Exportar variável para usar no docker-compose.prod.yml
export DOCKER_USER

echo "📥 Fazendo pull das imagens..."
docker pull ${DOCKER_USER}/banking-app-json-server:latest
docker pull ${DOCKER_USER}/banking-app-banking:latest
docker pull ${DOCKER_USER}/banking-app-dashboard:latest

echo "🛑 Parando containers antigos..."
$COMPOSE_CMD -f docker-compose.prod.yml down 2>/dev/null || true

echo "🚀 Iniciando aplicação..."
$COMPOSE_CMD -f docker-compose.prod.yml up -d

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🌐 URLs disponíveis:"
echo "   • App Principal: http://localhost"
echo "   • Dashboard: http://localhost/dashboard"
echo "   • API: http://localhost/api"
echo ""
echo "🔍 Comandos úteis:"
echo "   • Ver logs: $COMPOSE_CMD -f docker-compose.prod.yml logs -f"
echo "   • Status: $COMPOSE_CMD -f docker-compose.prod.yml ps"
echo "   • Parar: $COMPOSE_CMD -f docker-compose.prod.yml down"
echo ""
