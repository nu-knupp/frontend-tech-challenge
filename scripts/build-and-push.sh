#!/bin/bash

set -e

echo "🏗️  Build e Push para Docker Hub"

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

IMAGE_BASE="$DOCKER_USER/banking-app"
TAG="latest"

echo "🐳 Fazendo login no Docker Hub..."
docker login

echo "🔨 Fazendo build das imagens..."

# Build das 3 imagens
docker build --target json-server --tag ${IMAGE_BASE}-json-server:${TAG} .
docker build --target banking-production --tag ${IMAGE_BASE}-banking:${TAG} .
docker build --target dashboard-production --tag ${IMAGE_BASE}-dashboard:${TAG} .

echo "📤 Enviando para Docker Hub..."

# Push das imagens
docker push ${IMAGE_BASE}-json-server:${TAG}
docker push ${IMAGE_BASE}-banking:${TAG}
docker push ${IMAGE_BASE}-dashboard:${TAG}

echo ""
echo "✅ Imagens enviadas com sucesso!"
echo ""
echo "📦 Imagens criadas:"
echo "   • ${IMAGE_BASE}-json-server:${TAG}"
echo "   • ${IMAGE_BASE}-banking:${TAG}"
echo "   • ${IMAGE_BASE}-dashboard:${TAG}"
echo ""
echo "🚀 Para fazer deploy na produção:"
echo "   ./scripts/deploy-prod.sh $DOCKER_USER"
echo ""
