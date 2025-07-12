#!/bin/bash

echo "🔍 Verificando arquitetura Nginx Reverse Proxy..."
echo ""

# Verificar se os arquivos de configuração existem
echo "📁 Verificando arquivos de configuração Nginx:"
if [ -f "nginx/home.conf" ]; then
    echo "   ✅ nginx/home.conf existe"
else
    echo "   ❌ nginx/home.conf não encontrado"
fi

if [ -f "nginx/analytics.conf" ]; then
    echo "   ✅ nginx/analytics.conf existe"
else
    echo "   ❌ nginx/analytics.conf não encontrado"
fi

if [ -f "nginx/transactions.conf" ]; then
    echo "   ✅ nginx/transactions.conf existe"
else
    echo "   ❌ nginx/transactions.conf não encontrado"
fi

echo ""
echo "🐳 Verificando containers:"
docker-compose -f docker-compose.hybrid.yml ps

echo ""
echo "🌐 Testando endpoints (se containers estiverem rodando):"

# Função para testar endpoints
test_endpoint() {
    local url=$1
    local name=$2
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|302"; then
        echo "   ✅ $name ($url) - Respondendo"
    else
        echo "   ❌ $name ($url) - Não disponível"
    fi
}

test_endpoint "http://localhost:9000" "Single-SPA Shell"
test_endpoint "http://localhost:9001" "Home Nginx Proxy"
test_endpoint "http://localhost:9002" "Analytics Nginx Proxy"
test_endpoint "http://localhost:9003" "Transactions Nginx Proxy"
test_endpoint "http://localhost:3001" "JSON Server API"

echo ""
echo "📊 Logs dos containers Nginx (últimas 10 linhas):"
echo "--- Home Nginx ---"
docker-compose -f docker-compose.hybrid.yml logs --tail=10 mf-home 2>/dev/null || echo "Container não está rodando"

echo ""
echo "--- Analytics Nginx ---"
docker-compose -f docker-compose.hybrid.yml logs --tail=10 mf-analytics 2>/dev/null || echo "Container não está rodando"

echo ""
echo "--- Transactions Nginx ---"
docker-compose -f docker-compose.hybrid.yml logs --tail=10 mf-transactions 2>/dev/null || echo "Container não está rodando"
