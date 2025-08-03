#!/bin/bash

set -e

echo "🛑 Stopping Banking App Services"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Verificar se docker compose está disponível
if command -v docker compose >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "❌ Docker Compose não encontrado!"
    exit 1
fi

MODE=${1:-dev}

if [ "$MODE" = "prod" ]; then
    log "Parando ambiente de PRODUÇÃO..."
    $DOCKER_COMPOSE -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
    success "Ambiente de produção parado"
else
    log "Parando ambiente de DESENVOLVIMENTO..."
    $DOCKER_COMPOSE down --remove-orphans 2>/dev/null || true
    success "Ambiente de desenvolvimento parado"
fi

# Limpar containers órfãos de qualquer configuração
log "Limpando containers órfãos..."
docker container prune -f 2>/dev/null || true

# Opção para limpar volumes (dados)
if [ "$2" = "--clean" ]; then
    log "Limpando volumes de dados..."
    docker volume prune -f 2>/dev/null || true
    success "Volumes limpos"
fi

# Opção para limpar imagens
if [ "$2" = "--full-clean" ]; then
    log "Limpeza completa (containers, volumes, imagens)..."
    docker container prune -f 2>/dev/null || true
    docker volume prune -f 2>/dev/null || true
    docker image prune -f 2>/dev/null || true
    success "Limpeza completa realizada"
fi

success "🎉 Serviços parados com sucesso!"
echo ""
echo "📋 Opções de limpeza:"
echo "🧹 Limpar volumes: ./scripts/stop.sh dev --clean"
echo "🧹 Limpeza completa: ./scripts/stop.sh dev --full-clean"
echo "🧹 Parar produção: ./scripts/stop.sh prod"
