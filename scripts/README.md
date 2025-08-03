# 🚀 Banking App - Deploy Simplificado

## 📋 Scripts Essenciais

### 1. Build e Push (Na máquina de desenvolvimento)
```bash
./scripts/build-and-push.sh <seu_usuario_docker_hub>
```
- Faz build das 3 imagens
- Envia para Docker Hub
- **Execute na sua máquina local**

### 2. Deploy Produção (Na máquina de produção)
```bash
./scripts/deploy-prod.sh <seu_usuario_docker_hub>
```
- Baixa imagens do Docker Hub
- Usa docker-compose.prod.yml
- Inicia a aplicação
- **Execute no servidor de produção**

### 3. Parar Aplicação
```bash
./scripts/stop.sh
```
- Para todos os containers

## ⚙️ Configuração de Produção

### Deploy padrão (tudo no mesmo servidor):
```bash
./scripts/deploy-prod.sh seu_usuario_docker
```

### Para API em servidor externo:
Edite o arquivo `docker-compose.prod.yml` e altere as variáveis de ambiente:
```yaml
environment:
  - API_URL=http://seu-servidor-externo.com:3001
  - JSON_SERVER_URL=http://seu-servidor-externo.com:3001/transactions
```

## 🎯 Fluxo Completo

### Na sua máquina (desenvolvimento):
```bash
# 1. Build e enviar para Docker Hub
./scripts/build-and-push.sh meu_usuario_docker
```

### Na máquina de produção:
```bash
# 2. Baixar e executar
./scripts/deploy-prod.sh meu_usuario_docker
```

## 🌐 URLs da Aplicação

Após o deploy:
- **App Principal**: http://localhost
- **Dashboard**: http://localhost/dashboard  
- **API**: http://localhost/api

## 🔍 Comandos Úteis

```bash
# Ver logs
docker compose -f docker-compose.prod.yml logs -f

# Status dos containers
docker compose -f docker-compose.prod.yml ps

# Parar tudo
docker compose -f docker-compose.prod.yml down

# Reiniciar
docker compose -f docker-compose.prod.yml restart
```

## 📦 Imagens Criadas

Para usuário `meuusuario`:
- `meuusuario/banking-app-json-server:latest`
- `meuusuario/banking-app-banking:latest`
- `meuusuario/banking-app-dashboard:latest`

## 🏗️ Arquivos de Configuração

- `docker-compose.prod.yml` - Configuração de produção com variáveis
- `nginx/nginx.conf` - Configuração do reverse proxy
- `scripts/` - Scripts essenciais de deploy

---

💡 **Simples assim!** Build local → Push → Deploy produção
