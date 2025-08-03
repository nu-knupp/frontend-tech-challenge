#!/bin/bash

echo "🚀 Iniciando o ambiente de desenvolvimento com microfrontends..."

# Verificar se pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm não está instalado. Instale com: npm install -g pnpm"
    exit 1
fi

# Instalar dependências se não existirem
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    pnpm install
fi

# Preparar arquivo server.json
echo "🗄️  Preparando banco de dados mock..."
node scripts/initServerJson.js

echo "🎯 Iniciando todos os serviços:"
echo "  📊 json-server (porta 3001)"
echo "  🏦 Banking app (porta 3000) - Shell principal"
echo "  📈 Dashboard app (porta 3001) - Transações e Analytics"

# Iniciar todos os serviços em paralelo
pnpm run dev
