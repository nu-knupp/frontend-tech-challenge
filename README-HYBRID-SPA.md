# 🏗️ Arquitetura Híbrida Single-SPA com Nginx Reverse Proxy

Esta implementação cria uma verdadeira arquitetura de micro-frontends usando **1 aplicação Next.js** servida por **3 servidores Nginx** como reverse proxy para páginas específicas, orquestrados por um shell Single-SPA.

## 🎯 Nova Arquitetura: Next.js → 3 Nginx → Single-SPA

```
┌─────────────────────────────────────────────────────────────┐
│                    Single-SPA Shell                         │
│                   (localhost:9000)                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Orchestration UI                           ││
│  │  ┌─────────────┬─────────────┬─────────────────────────┐││
│  │  │    Home     │  Analytics  │     Transactions        │││
│  │  │   (9001)    │   (9002)    │       (9003)            │││
│  │  └─────────────┴─────────────┴─────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │ Nginx Proxy │ │ Nginx Proxy │ │ Nginx Proxy │
        │    Home     │ │  Analytics  │ │Transactions │
        │ Port: 9001  │ │ Port: 9002  │ │ Port: 9003  │
        └─────────────┘ └─────────────┘ └─────────────┘
                │           │           │
                └───────────┼───────────┘
                            ▼
                    ┌─────────────────┐
                    │   Next.js App   │
                    │  (Single Build) │
                    │ Internal Only   │
                    └─────────────────┘
                            │
                            ▼
                    ┌─────────────────┐
                    │   JSON Server   │
                    │   Shared API    │
                    │   Port: 3001    │
                    └─────────────────┘
```

## 🔧 Como funciona

### **1. Uma única aplicação Next.js**
- Build único com todas as páginas (`/`, `/analytics`, `/transactions`)
- Roda internamente sem exposição de porta externa
- Serve as três rotas principais da aplicação

### **2. Três servidores Nginx como Reverse Proxy**
- **Nginx Home (9001)**: Proxy para `nextjs-app:3000/`
- **Nginx Analytics (9002)**: Proxy para `nextjs-app:3000/analytics`
- **Nginx Transactions (9003)**: Proxy para `nextjs-app:3000/transactions`

### **3. Single-SPA Shell Orchestrator**
- Interface unificada que carrega cada "micro-frontend" via iframe
- Monitoramento de status em tempo real
- Navegação entre os diferentes proxies Nginx

## 🚀 Como iniciar

### Opção 1: Script automatizado
```bash
./start-hybrid-spa.sh
```

### Opção 2: Docker Compose manual
```bash
docker-compose -f docker-compose.hybrid.yml up --build
```

## 📍 Endpoints

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Single-SPA Shell** | http://localhost:9000 | Interface principal de orquestração |
| **Home MF** | http://localhost:9001 | Micro-frontend Home & Overview |
| **Analytics MF** | http://localhost:9002 | Micro-frontend Analytics & Reports |
| **Transactions MF** | http://localhost:9003 | Micro-frontend Transaction Management |
| **JSON Server** | http://localhost:3001 | API compartilhada para dados |

## 🎨 Funcionalidades

### Single-SPA Shell (Port 9000)
- **Interface moderna** com gradientes e glass morphism
- **Navegação por cards** para cada micro-frontend
- **Monitoramento de status** em tempo real
- **Loading states** durante transições
- **Responsive design** para mobile e desktop

### Micro-frontends (Ports 9001-9003)
- **Containers isolados** com Next.js standalone
- **Builds otimizados** para produção
- **API compartilhada** via network Docker
- **Reutilização total** do código existente

## 🔧 Tecnologias

- **Single-SPA**: Orquestração de micro-frontends
- **Next.js 15**: Framework React com SSR
- **Docker**: Containerização dos serviços
- **Express.js**: Servidor do shell Single-SPA
- **JSON Server**: API mock para desenvolvimento

## 📂 Estrutura de arquivos

```
frontend-tech-challenge/
├── single-spa-shell/           # Shell orquestrador
│   ├── public/index.html       # Interface Single-SPA
│   ├── server.js              # Servidor Express
│   ├── package.json           # Dependências do shell
│   └── Dockerfile             # Container do shell
├── docker-compose.hybrid.yml  # Orquestração dos containers
├── Dockerfile.nextjs-mf       # Template para MFs Next.js
├── start-hybrid-spa.sh        # Script de inicialização
└── src/                       # Código Next.js original
```

## 🎯 Benefícios da arquitetura

1. **Isolamento**: Cada MF roda em container independente
2. **Escalabilidade**: Possível escalar MFs individualmente
3. **Reutilização**: 100% do código Next.js existente
4. **Flexibilidade**: Fácil adição de novos micro-frontends
5. **Monitoramento**: Status em tempo real de cada serviço

## 🛠️ Desenvolvimento

Para fazer alterações:

1. **Frontend**: Edite arquivos em `src/`
2. **Shell**: Modifique `single-spa-shell/public/index.html`
3. **Containers**: Ajuste `docker-compose.hybrid.yml`
4. **Rebuild**: Execute `./start-hybrid-spa.sh`

## 🐛 Troubleshooting

### Container não inicia
```bash
docker-compose -f docker-compose.hybrid.yml logs [service-name]
```

### Limpar cache Docker
```bash
docker system prune -a -f
```

### Verificar portas em uso
```bash
netstat -tulpn | grep :900
```
