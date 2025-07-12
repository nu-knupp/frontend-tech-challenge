#!/bin/bash

echo "🧪 Testando implementação Single-SPA..."
echo ""

# Verificar se o shell está respondendo
echo "📋 Testando Single-SPA Shell:"
if curl -s http://localhost:9000/health | grep -q "OK"; then
    echo "   ✅ Shell health check: OK"
else
    echo "   ❌ Shell health check: FALHOU"
fi

if curl -s http://localhost:9000 | grep -q "single-spa"; then
    echo "   ✅ Single-SPA library carregada"
else
    echo "   ❌ Single-SPA library não encontrada"
fi

if curl -s http://localhost:9000/src/root-config.js | grep -q "registerApplication"; then
    echo "   ✅ Root config acessível"
else
    echo "   ❌ Root config não acessível"
fi

echo ""
echo "🌐 Testando Nginx proxies:"

test_nginx() {
    local port=$1
    local name=$2
    local expected_content=$3
    
    if curl -s "http://localhost:$port" | grep -q "$expected_content"; then
        echo "   ✅ $name (port $port): Servindo conteúdo correto"
    else
        echo "   ❌ $name (port $port): Conteúdo incorreto ou não disponível"
    fi
}

test_nginx 9001 "Home" "Frontend Tech Challenge"
test_nginx 9002 "Analytics" "Frontend Tech Challenge"  
test_nginx 9003 "Transactions" "Frontend Tech Challenge"

echo ""
echo "🔗 URLs para teste manual:"
echo "   Single-SPA Shell: http://localhost:9000"
echo "   Home (direto):    http://localhost:9001"
echo "   Analytics:        http://localhost:9002"
echo "   Transactions:     http://localhost:9003"

echo ""
echo "🎯 Para verificar Single-SPA funcionando:"
echo "   1. Acesse http://localhost:9000"
echo "   2. Clique nos botões Home, Analytics, Transactions"
echo "   3. Verifique se o hash da URL muda (#/home, #/analytics, #/transactions)"
echo "   4. Confirme que o conteúdo é carregado via iframe"
