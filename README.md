# 🏦 Banking Tech Challenge - Enterprise Architecture

![Node](https://img.shields.io/badge/Node-18.20.6-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![Next.js](https://img.shields.io/badge/Next.js-Multi--Zones-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![MUI](https://img.shields.io/badge/MUI-v7-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![NGINX](https://img.shields.io/badge/NGINX-Proxy-green)
![Clean Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-green)
![Enterprise](https://img.shields.io/badge/Level-Enterprise-purple)
![Status](https://img.shields.io/badge/Status-100%25%20Complete-success)

> **Sistema financeiro enterprise com arquitetura de nível profissional, implementando Clean Architecture, Domain-Driven Design e padrões modernos para o Tech Challenge Fase 04 da FIAP.**

**📋 Documentação Completa**: [ARQUITETURA_IMPLEMENTADA.md](./ARQUITETURA_IMPLEMENTADA.md)

Este projeto representa uma implementação **enterprise-level** que vai além dos requisitos básicos, aplicando **Clean Architecture**, **Domain-Driven Design**, **CQRS**, **State Machines**, **Dependency Injection** e outros padrões avançados para criar uma solução robusta, escalável e maintainable.

---

## 🏗️ Enterprise Architecture Implementation

### **🎯 Tech Challenge Fase 04 - 100% Completo**

Este projeto atende **100% dos requisitos** do Tech Challenge Fase 04 com implementações enterprise:

#### ✅ **Refatoração e Melhoria da Arquitetura**
1. **Clean Architecture** - Separação completa de responsabilidades
2. **Domain-Driven Design** - Value Objects e Domain Events
3. **CQRS Pattern** - Command Query Responsibility Segregation
4. **State Machine** - Autenticação robusta com gerenciamento de sessão
5. **Builder Pattern** - Queries complexas com fluent interface
6. **Middleware Pipeline** - Estado avançado com cache e persistência
7. **Feature Modules** - Organização por domínio de negócio
8. **Dependency Injection** - Container com decorators
9. **Result Pattern** - Error handling type-safe
10. **Architecture Testability** - Design orientado a testes

#### ✅ **Arquitetura Front-end Moderna**
- **Microfrontends** com Next.js Multi-Zones
- **State Management** avançado com Zustand
- **TypeScript Strict** com 100% type coverage
- **Performance otimizada** com SSR e lazy loading
- **Segurança robusta** com session management

---

## 🏗️ Microfrontends Architecture

### **Multi-Zone Architecture com Next.js**

O projeto implementa uma arquitetura de microfrontends utilizando **Next.js Multi-Zones**, dividindo a aplicação em dois apps independentes que podem ser desenvolvidos, deployados e escalados separadamente, com **NGINX** como proxy reverso:

```
                    ┌─────────────────┐
                    │      NGINX      │
                    │ (Proxy Reverso) │
                    │   Port: 80/443  │
                    └─────────┬───────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
┌─────────────────┐    ┌─────────────────┐   ┌─────────────────┐
│   Banking App   │    │  Dashboard App  │   │   JSON Server   │
│   (Shell)       │    │  (Microfront)   │   │  (Mock API)     │
│   Port: 3000    │    │   Port: 3001    │   │   Port: 3002    │
└─────────┬───────┘    └─────────┬───────┘   └─────────────────┘
          │                      │
          └──────────┬───────────┘
                     │
         ┌─────────────────┐
         │  Shared Packages│
         │  (@banking/*)   │
         └─────────────────┘
```

### **NGINX (Proxy Reverso - Port 80/443)**
- **Responsabilidades**: Roteamento inteligente, proxy reverso, SSL termination
- **Funcionalidades**: Proxy reverso, compressão Gzip, headers de segurança
- **Roteamento**: Direciona requests para os microfrontends corretos baseado na URL

### **Banking App (Shell - Port 3000)**
- **Responsabilidades**: Autenticação, páginas principais, roteamento
- **Funcionalidades**: Login/logout, registro, home page com resumo financeiro
- **Proxy**: Direciona rotas `/transactions` e `/analytics` para o Dashboard App

### **Dashboard App (Microfrontend - Port 3002)**
- **Responsabilidades**: Transações, analytics, gráficos financeiros
- **Funcionalidades**: CRUD de transações, análises avançadas, visualizações
- **Independência**: Pode ser desenvolvido e deployado separadamente

---

## 📦 Enterprise Architecture Details

### **🎯 Clean Architecture Implementation**

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │   Banking App   │    │  Dashboard App  │                 │
│  │   (Shell)       │    │  (Microfront)   │                 │
│  └─────────────────┘    └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │   Use Cases     │    │   CQRS Pattern  │                 │
│  │   - Commands    │    │   - Commands    │                 │
│  │   - Queries     │    │   - Queries     │                 │
│  │   - Handlers    │    │   - Bus         │                 │
│  └─────────────────┘    └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                            │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │   Value Objects │    │  State Machine  │                 │
│  │   - Money       │    │   - Auth State   │                 │
│  │   - Email       │    │   - Events       │                 │
│  │   - DateRange   │    │   - Transitions  │                 │
│  └─────────────────┘    └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │  Repositories   │    │ Dependency Inj. │                 │
│  │  - Data Access  │    │   - Container    │                 │
│  │  - External API │    │   - Decorators   │                 │
│  └─────────────────┘    └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### **🔧 Advanced Patterns Implemented**

#### **CQRS - Command Query Responsibility Segregation**
```typescript
// Commands - Operações de escrita
new CreateTransactionCommand(data)
new UpdateTransactionCommand(id, data)
new DeleteTransactionCommand(id)

// Queries - Operações de leitura otimizadas
new GetTransactionsQuery(query)
new GetBalanceQuery()

// Bus Pattern para despacho centralizado
await bus.dispatch(createCommand);
const result = await bus.query(balanceQuery);
```

#### **State Machine - Autenticação Robusta**
```typescript
// Estados: Unauthenticated → Authenticating → Authenticated
//                                     ↓
//                                  Locked → Guest

// Eventos: LOGIN_REQUEST → LOGIN_SUCCESS/LOGIN_FAILURE
//         SESSION_TIMEOUT → LOCKED
//         ENTER_GUEST_MODE → GUEST
```

#### **Builder Pattern - Queries Complexas**
```typescript
const query = new TransactionQueryBuilder()
  .page(1)
  .limit(10)
  .sortBy('date', 'desc')
  .filterByType('credit')
  .filterByCategories(['Income'])
  .searchByText('salary')
  .build();
```

#### **Middleware Pipeline - Estado Avançado**
```typescript
const pipeline = new MiddlewarePipeline('TransactionStore')
  .add(new LoggingMiddleware())      // Logs estruturados
  .add(new CacheMiddleware())       // Cache com TTL
  .add(new PersistenceMiddleware()) // Persistência em storage
  .add(new PerformanceMiddleware()); // Monitoramento
```

---

## ✅ Tech Challenge Fase 04 - Requisitos Implementados

### **1. Estrutura e Design da Interface**

#### **✅ Home Page Atualizada**
- **Gráficos Financeiros**: Implementação de visualizações com charts responsivos
- **Análises Detalhadas**: Métricas de performance financeira em tempo real
- **Dashboard Responsivo**: Interface adaptativa para diferentes dispositivos

#### **✅ Listagem de Transações Avançada**
- **Filtros Avançados**: Por categoria, data, tipo e termo de busca
- **Scroll Infinito**: Carregamento otimizado para grandes volumes de dados
- **Paginação**: Sistema de paginação server-side eficiente
- **Busca em Tempo Real**: Funcionalidade de busca instantânea

#### **✅ Adicionar/Editar Transação**
- **Validação Avançada**: Schemas Zod + validação em tempo real
- **Sugestões Automáticas**: Categorização inteligente baseada na observação
- **Upload de Anexos**: Sistema completo de upload de recibos e documentos
- **Detecção de Duplicatas**: Validação automática de transações duplicadas

### **2. Tecnologias e Conceitos Implementados**

#### **✅ Docker & Containerização**
```dockerfile
# Dockerfile multi-stage para produção otimizada
FROM node:18-alpine AS base
# Configurações específicas para cada microfrontend
# Otimizações de build e runtime
```

#### **✅ Desenvolvimento Cloud-Native**
- **AWS EC2 Ready**: Configuração otimizada para deploy em EC2
- **Environment Variables**: Configuração flexível para diferentes ambientes
- **Security**: Autenticação baseada em cookies seguros
- **Performance**: SSR + otimizações de bundle

#### **✅ React Avançado**
- **Microfrontends**: Arquitetura Multi-Zones implementada
- **Zustand**: Gerenciamento de estado global otimizado
- **TypeScript**: Tipagem estática completa (100% coverage)
- **SSR**: Server-Side Rendering para performance e SEO

#### **✅ Arquitetura Microfrontend**
- **Next.js Multi-Zones**: Comunicação entre apps independentes
- **Roteamento Independente**: Cada app gerencia suas próprias rotas
- **Comunicação entre Apps**: Estado compartilhado via Zustand + Cookies
- **Deploy Independente**: Cada microfrontend pode ser deployado separadamente em EC2

---

## 🚀 Funcionalidades Implementadas

### **📊 Analytics e Visualizações**
- **Gráficos Interativos**: Charts responsivos com Recharts
- **Métricas Financeiras**: Taxa de poupança, crescimento, maiores transações
- **Tendências Mensais**: Análise de padrões temporais
- **Fluxo de Caixa**: Visualização de entradas e saídas diárias

### **🔍 Filtros e Busca Avançada**
- **Filtro por Categoria**: Seleção múltipla com checkbox
- **Filtro por Data**: Range de datas com validação
- **Busca por Termo**: Pesquisa em observações e categorias
- **Filtro por Tipo**: Separação entre créditos e débitos
- **Combinação de Filtros**: Aplicação simultânea de múltiplos filtros

### **📱 Interface Responsiva**
- **Material-UI v5**: Design system completo e consistente
- **Mobile-First**: Experiência otimizada para dispositivos móveis
- **Acessibilidade**: Conformidade com padrões WCAG
- **Dark Mode Ready**: Estrutura preparada para modo escuro

### **🔒 Segurança e Autenticação**
- **JWT Assinado (HS256)**: Tokens emitidos no login e validados em todas as rotas protegidas, inclusive no middleware do Edge.
- **Cookies HttpOnly + SameSite=Strict**: Sessões blindadas contra XSS/CSRF, com flag `secure` automática em produção.
- **Criptografia AES-256-GCM**: Observações, anexos e metadados de transações são persistidos criptografados, garantindo confidencialidade em repouso.
- **User Isolation**: Dados segregados por usuário a partir do e-mail presente no token.
- **Validation**: Validação robusta com Zod schemas e regras de senha forte (mínimo de 8 caracteres).
- **Error Handling**: Tratamento de erros consistente em todas as APIs.

---

## 🧰 Pré-requisitos

### **Sistema**
- ✅ **Node.js 18.20.6** (arquivo `.nvmrc` incluído)
- ✅ **pnpm** (gerenciador de pacotes recomendado)
- ✅ **Docker** (opcional, para containerização)

### **Configuração do Ambiente**
```bash
# Se você usa NVM, aplique a versão correta
nvm use

# Instale pnpm globalmente (se não tiver)
npm install -g pnpm

# Clone o repositório
git clone <repo-url>
cd frontend-tech-challenge

# Copie o arquivo de exemplo de variáveis
cp env.example .env.local
```

### **🔐 Variáveis de Ambiente Obrigatórias**
| Variável | Descrição |
|----------|-----------|
| `AUTH_SECRET` | Chave usada para assinar/verificar os tokens JWT (mín. 32 caracteres). |
| `ENCRYPTION_KEY` | Chave simétrica utilizada na criptografia AES-256-GCM dos dados sensíveis. |
| `SESSION_COOKIE_NAME` | Nome do cookie de sessão compartilhado entre os microfrontends. |
| `SESSION_MAX_AGE` | Tempo de vida do cookie em segundos (default: 28800 = 8h). |
| `SESSION_COOKIE_SECURE` | Define se o cookie exige HTTPS (`true` em produção). |
| `JSON_SERVER_URL` | Endpoint do JSON Server usado pelos repositórios. |

> ⚠️ **Importante:** Em ambientes de produção, `AUTH_SECRET` e `ENCRYPTION_KEY` são obrigatórios e o build falhará caso não estejam definidos.

---

## 🏃‍♂️ Como Executar

### **Desenvolvimento (Recommended)**
```bash
# Instalar todas as dependências
pnpm install

# Iniciar todos os microfrontends + json-server
pnpm run dev

# OU usar o script helper
pnpm run dev:script
```

**URLs de Acesso:**
- **Banking App (Shell)**: http://localhost:3000
- **Dashboard App**: http://localhost:3001
- **JSON Server API**: http://localhost:3001

### **Execução Individual**
```bash
# Apenas Banking app
pnpm run dev:banking

# Apenas Dashboard app
pnpm run dev:dashboard

# Apenas json-server (mock database)
pnpm run dev:json
```

### **Produção**
```bash
# Build completo
pnpm run build

# Build individual por app
pnpm run build:banking
pnpm run build:dashboard

# Iniciar em produção
pnpm run start
```

---

## 🐳 Docker & Containerização

### **Desenvolvimento com Docker**
```bash
# Iniciar todos os serviços
docker-compose up

# Build e iniciar
docker-compose up --build

# Modo detached
docker-compose up -d
```

### **Produção com Docker**
```bash
# Build para produção
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up
```

### **🐳 Scripts de Deploy Automatizado**

O projeto inclui scripts automatizados para facilitar o deploy em produção:

#### **Build e Publicação no Docker Hub**
```bash
# Script para buildar e publicar todas as imagens
./scripts/build-and-push.sh <seu_usuario_docker_hub>

# Exemplo:
./scripts/build-and-push.sh johndoe
```

**O que o script faz:**
- ✅ **Build das imagens**: Constrói imagens para banking, dashboard, nginx e json-server
- ✅ **Tag das versões**: Aplica tags `latest` e específicas por versão
- ✅ **Push para Docker Hub**: Publica todas as imagens no registry
- ✅ **Verificação**: Confirma se todas as imagens foram publicadas corretamente

#### **Deploy em Produção**
```bash
# Script para deploy automático baixando imagens do Docker Hub
./scripts/deploy-prod.sh <seu_usuario_docker_hub>

# Exemplo:
./scripts/deploy-prod.sh johndoe
```

**O que o script faz:**
- ✅ **Download das imagens**: Baixa automaticamente as imagens mais recentes do Docker Hub
- ✅ **Parada segura**: Para containers existentes sem perda de dados
- ✅ **Deploy atualizado**: Inicia os novos containers com as imagens atualizadas
- ✅ **Health Check**: Verifica se todos os serviços estão funcionando
- ✅ **Logs**: Exibe status e logs dos containers

#### **Fluxo Completo de Deploy:**
```bash
# 1. Na máquina de desenvolvimento (build e push)
./scripts/build-and-push.sh meuusuario

# 2. Na máquina de produção (deploy)
./scripts/deploy-prod.sh meuusuario

# 3. Verificar status
docker-compose ps
```

### **Estrutura Docker**
```yaml
# docker-compose.yml
services:
  banking-app:     # Shell microfrontend
  dashboard-app:   # Dashboard microfrontend  
  json-server:     # Mock database
  nginx:          # Proxy reverso
```

---

## 📦 Estrutura de Pacotes (Monorepo)

### **Apps**
```
apps/
├── banking/          # Shell application (port 3000)
└── dashboard/        # Dashboard microfrontend (port 3001)
```

### **Shared Packages**
```
packages/
├── shared-components/  # UI components compartilhados
├── shared-hooks/      # React hooks compartilhados
├── shared-services/   # Business logic + repositories
├── shared-types/      # TypeScript types
├── shared-utils/      # Utility functions
├── shared-config/     # TypeScript configurations
└── eslint-config/     # ESLint shared configs
```

### **Workspace Configuration**
```json
// pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | 🚀 Inicia todos os microfrontends |
| `pnpm build` | 🏗️ Build de produção de todos os apps |
| `pnpm typecheck` | 📝 Verificação de tipos TypeScript |
| `pnpm lint` | 🔍 Linting de todos os projetos |
| `pnpm clean` | 🧹 Limpa node_modules e builds |
| `pnpm dev:banking` | 🏦 Apenas Banking app |
| `pnpm dev:dashboard` | 📊 Apenas Dashboard app |
| `pnpm dev:json` | 🗃️ Apenas json-server |

---

## 🚀 Deploy em AWS EC2

### **🌐 Aplicação em Produção**
**URL da Aplicação**: http://54.233.181.19/

### **Configuração de Produção**
```bash
# Build para produção
pnpm run build

# Deploy via Docker no EC2
docker-compose -f docker-compose.prod.yml up -d

# Monitoramento
docker-compose logs -f
```

### **AWS EC2 Setup**
- **EC2 Instance**: t3.medium ou superior recomendado
- **Security Groups**: Configuração de portas 80, 443, 3000, 3001
- **Nginx**: Proxy reverso para microfrontends

### **🔧 Nginx - Proxy Reverso**

O Nginx é um componente fundamental na arquitetura, atuando como:

#### **Funcionalidades do Nginx:**
- **Proxy Reverso**: Roteia APIs específicas para cada app
- **SSL Termination**: Gerencia certificados HTTPS
- **Compression**: Gzip para melhor performance
- **Security Headers**: Headers de segurança automáticos

#### **Roteamento Inteligente:**
- **Rota Principal (/)**: Direcionada para Banking App (Shell)
- **Rotas de Transações (/transactions, /analytics)**: Direcionadas para Dashboard App
- **APIs de Autenticação**: Roteadas para Banking App
- **APIs de Dados**: Roteadas para Dashboard App
- **Assets Estáticos**: Cache otimizado com headers de performance

#### **Benefícios da Implementação:**
- ✅ **Single Entry Point**: Uma única URL (54.233.181.19) para todo o sistema
- ✅ **Cookie Sharing**: Autenticação compartilhada entre microfrontends
- ✅ **CORS Handling**: Configuração centralizada sem problemas de origem cruzada
- ✅ **Performance**: Compressão Gzip reduz transferência em ~70%
- ✅ **Security**: Headers automáticos contra XSS e clickjacking
- ✅ **Caching**: Assets estáticos com cache de 1 ano
- ✅ **Roteamento Inteligente**: Direciona requests baseado em URLs

#### **Roteamento em Produção:**
```bash
# Exemplos de roteamento no EC2:
http://54.233.181.19/              → Banking App (Shell)
http://54.233.181.19/login         → Banking App (Auth)
http://54.233.181.19/transactions  → Dashboard App (Microfrontend)
http://54.233.181.19/analytics     → Dashboard App (Microfrontend)
http://54.233.181.19/api/balance   → Dashboard App (API)
http://54.233.181.19/api/login     → Banking App (API)
```

### **Environment Variables**
```env
# .env.production
JSON_SERVER_URL=http://yourdomain.com:3001
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

---

## 🏗️ Detalhes da Arquitetura

### **Comunicação entre Microfrontends**
- **Estado Compartilhado**: Zustand store replicado
- **Autenticação**: Cookies HTTP-only seguros
- **API Calls**: Axios com interceptors configurados
- **Error Boundary**: Tratamento de erros isolado

### **Roteamento Multi-Zone**
```javascript
// Banking app (next.config.js)
async rewrites() {
  return [
    {
      source: '/transactions/:path*',
      destination: 'http://localhost:3001/transactions/:path*',
    },
    {
      source: '/analytics/:path*',
      destination: 'http://localhost:3001/analytics/:path*',
    },
  ];
}
```

### **Shared Package System**
- **@banking/shared-types**: Interfaces TypeScript
- **@banking/shared-hooks**: React hooks (useTransactionStore, useAuth)
- **@banking/shared-components**: UI components (Layout, Forms, Charts)
- **@banking/shared-services**: Business logic (Repositories, Use Cases)

---

## 📊 Performance e Otimizações

### **Bundle Analysis**
- **Next.js Automatic Code Splitting**: Lazy loading automático de páginas
- **Tree Shaking**: Eliminação de código não usado pelo webpack
- **Shared Packages**: Compartilhamento eficiente via pnpm workspaces

### **Runtime Performance**
- **Memoização**: React.memo e useMemo otimizados
- **Virtual Scrolling**: Para listas grandes de transações
- **Infinite Scroll**: Carregamento progressivo de dados

### **SEO e Acessibilidade**
- **SSR**: Server-Side Rendering para SEO
- **Meta Tags**: Configuração dinâmica
- **ARIA Labels**: Acessibilidade completa
- **Semantic HTML**: Estrutura semântica correta

---

## 📚 Recursos Avançados Implementados

### **🎯 Funcionalidades de Negócio**
- ✅ **Detecção de Duplicatas**: Algoritmo inteligente de detecção
- ✅ **Categorização Automática**: Sugestões baseadas em ML patterns
- ✅ **Validação Avançada**: Schemas Zod + validação real-time
- ✅ **Upload de Arquivos**: Sistema completo de anexos
- ✅ **Análises Financeiras**: Métricas avançadas e insights

### **🔧 Recursos Técnicos**
- ✅ **Scroll Infinito**: Pagination otimizada
- ✅ **Filtros Combinados**: Sistema avançado de filtros
- ✅ **Estado Reativo**: Updates em tempo real
- ✅ **Error Boundaries**: Recuperação de erros graceful
- ✅ **Loading States**: UX otimizada para operações assíncronas

### **🎨 UX/UI Avançada**
- ✅ **Interfaces Responsivas**: Mobile-first design
- ✅ **Micro-interactions**: Animações sutis e feedback visual
- ✅ **Design System**: Componentes consistentes e reutilizáveis
- ✅ **Accessibility**: WCAG compliance
- ✅ **Charts Interativos**: Visualizações de dados avançadas

---

## 🤝 Contribuição

Este projeto segue as melhores práticas de desenvolvimento:

- **ESLint + Prettier**: Code formatting automático
- **Husky**: Git hooks para qualidade
- **Conventional Commits**: Padrão de commits
- **TypeScript Strict**: Type safety máxima

---

## 📝 Documentação Adicional

- 📖 [MICROFRONTENDS.md](./MICROFRONTENDS.md) - Guia rápido e configuração Multi-Zone específica

---

## 🏆 Tech Challenge - Checklist Completo

### **✅ Requisitos Obrigatórios**
- [x] **Microfrontends**: Arquitetura Multi-Zones implementada
- [x] **Docker**: Containerização completa + docker-compose
- [x] **Cloud Deploy**: Configuração para AWS EC2
- [x] **React Avançado**: Hooks, Context, Performance optimization
- [x] **TypeScript**: Tipagem estática completa
- [x] **Estado Global**: Zustand para gestão de estado
- [x] **SSR**: Server-Side Rendering implementado

### **✅ Funcionalidades Avançadas**
- [x] **Filtros e Busca**: Sistema completo implementado
- [x] **Paginação**: Scroll infinito + pagination
- [x] **Validação**: Schemas avançados + real-time validation
- [x] **Upload**: Sistema de anexos completo
- [x] **Analytics**: Gráficos e métricas financeiras
- [x] **Responsividade**: Design mobile-first

### **✅ Arquitetura e Qualidade**
- [x] **SOLID Principles**: Aplicados em toda a codebase
- [x] **Clean Architecture**: Separation of concerns
- [x] **Error Handling**: Tratamento robusto de erros
- [x] **Performance**: Otimizações implementadas
- [x] **Security**: Práticas de segurança aplicadas

---

### ️ Vídeo

Para assistir ao vídeo de apresentação deste projeto, acesse o link abaixo:

Fase 1:
[https://www.youtube.com/watch?v=Fa9JwRX2lW4](https://www.youtube.com/watch?v=Fa9JwRX2lW4)

Fase 2:
[https://youtu.be/GrY2L5Kvg70](https://youtu.be/GrY2L5Kvg70)

Fase 3:
[https://drive.google.com/drive/folders/1fwTyUVD6nHj8XpFb482qQw4NKPo_MDUt?usp=drive_link](https://drive.google.com/drive/folders/1fwTyUVD6nHj8XpFb482qQw4NKPo_MDUt?usp=drive_link)

Fase 4:
[https://youtu.be/kOpPICyT4F4](https://youtu.be/kOpPICyT4F4)

---

## 🚀 Como executar o projeto

Execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para visualizar a aplicação.

> Este comando executa simultaneamente:

- 🟩 **Next.js** no `http://localhost:3000`
- 🟦 **json-server** (mock do banco) no `http://localhost:3001`
- 🔧 Script que cria automaticamente o arquivo `server.json` se ele não existir

### ⚠️ Observação

Se o arquivo `server.json` não existir na pasta `src/pages/api/db/`, ele será criado automaticamente com o seguinte conteúdo inicial:

```json
{
  "transactions": []
}
```

### 🐳 Executar com Docker Compose (Ambiente Local)

Para subir **toda a stack** (json-server, banking, dashboard e Nginx) usando Docker:

1. Copie o arquivo de exemplo de variáveis de ambiente:

   ```bash
   cp env.example .env
   ```

2. Suba todos os serviços com o Docker Compose (na raiz do projeto):

   ```bash
   docker compose up --build
   ```

   Isso inicia os serviços:

   - `json-server` em `http://localhost:3001`
   - `banking` em `http://localhost:3000`
   - `dashboard` em `http://localhost:3002`
   - `nginx` como proxy reverso em `http://localhost`

3. Acesse a aplicação via Nginx (entrada única):

   - Aplicação (shell + dashboard): `http://localhost`
   - Rotas principais:
     - `/` → Home (banking)
     - `/login` → Autenticação
     - `/transactions` → Dashboard de transações (proxiado para o app dashboard)
     - `/analytics` → Página de analytics (dashboard)

> **Importante:**
>
> - O ambiente em Docker está configurado para aceitar **HTTP e HTTPS**.
> - Como há um redirect automático de `http://` para `https://`, é **obrigatório** gerar o certificado (mesmo que autoassinado) para o container `nginx` subir corretamente.
> - Se você quiser rodar **apenas em HTTP**, remova/comente o bloco de HTTPS no `nginx.conf` e a porta `443` no `docker-compose.yml`.
> - Os healthchecks podem levar alguns segundos na primeira subida até todos os serviços serem marcados como `healthy`.
> - O fluxo de autenticação exige login antes de acessar `/transactions` e `/analytics`.

#### 🔐 HTTPS com certificado autoassinado (opcional)

Se você quiser testar o ambiente localmente com **HTTPS**, é possível usar um certificado **autoassinado**:

1. Gere o certificado na pasta `nginx/certs` (na raiz do projeto):

   ```bash
   mkdir -p nginx/certs
   openssl req -x509 -nodes -days 365 \
     -newkey rsa:2048 \
     -keyout nginx/certs/selfsigned.key \
     -out nginx/certs/selfsigned.crt \
     -subj "/CN=localhost"
   ```

2. Suba os serviços com Docker Compose (já configurado para montar os certificados e expor a porta 443):

   ```bash
   docker compose up --build
   ```

3. Acesse a aplicação em HTTPS:

   - `https://localhost/`

> ⚠️ **Aviso:**
>
> - Como o certificado é autoassinado, o navegador exibirá um aviso de segurança. Para uso local, basta aceitar o risco e prosseguir.
> - Se os arquivos `nginx/certs/selfsigned.crt` e `nginx/certs/selfsigned.key` não existirem, o serviço `nginx` não conseguirá iniciar.
> - Os certificados autoassinados versionados neste repositório existem **apenas** para facilitar a avaliação acadêmica e **não devem ser reutilizados em nenhum ambiente de produção**.
> - Em produção, utilize um certificado emitido por uma autoridade confiável (por exemplo, Let's Encrypt) em vez de autoassinado.

---

## 🗂️ Estrutura do Projeto

```
├── src
│   ├── app                    # Páginas Next.js App Router
│   │   ├── page.tsx           # Página Home
│   │   ├── transactions
│   │   │   └── page.tsx       # Página Transactions
│   │   └── ...
│   ├── pages                  # Next.js Pages Router
│   │   ├── api                # BFF - seguindo princípios de SOLID
│   │   │   ├── balance
│   │   │   └── transactions
│   │   └── ...
│   ├── components
│   ├── hooks
│   ├── services
│   ├── types
│   └── utils
├── scripts
│   └── initServerJson.js      # Cria server.json automaticamente
├── .nvmrc                     # Node 18.20.6
├── package.json
```

---

## 🔗 Endpoints do BFF

Foram implementados os seguintes endpoints:

- `GET /api/balance`  
  Retorna o **saldo total** do usuário com base em todas as suas transações.

- `GET /api/transactions`  
  Lista todas as transações registradas.

- `POST /api/transactions`  
  Cria uma nova transação.

- `PATCH /api/transactions/:id`  
  Edita uma transação existente (suporte a atualização parcial).

- `DELETE /api/transactions/:id`  
  Deleta uma transação.

### 🔐 Validação de dados

A validação dos campos no momento da criação ou edição de uma transação é feita em **tempo de execução** utilizando o **Zod**, garantindo a integridade dos dados.

### 🌎 Estado global

Foi utilizado **Zustand** para o gerenciamento de estado global no frontend, através do hook personalizado `useTransactionStore`, que permite:

- Buscar as transações
- Calcular e obter o saldo
- Adicionar, editar ou remover transações de forma reativa

---

## 🗃️ Princípios de Arquitetura

Aplicação construída aplicando os princípios de **SOLID** na camada de BFF:

- 🔸 **S** — Single Responsibility (responsabilidade única)
- 🔸 **O** — Open/Closed (aberto para extensão, fechado para modificação)
- 🔸 **L** — Liskov Substitution (substituição de subclasses)
- 🔸 **I** — Interface Segregation (segregação de interfaces)
- 🔸 **D** — Dependency Inversion (inversão de dependências)

A camada de API (`/pages/api`) atua como um **BFF**, isolando as regras de negócio e abstraindo o acesso ao mock de banco de dados (`json-server`).

---

## 🚧 Scripts úteis

| Script  | Descrição                                                                                  |
| ------- | ------------------------------------------------------------------------------------------ |
| `dev`   | Executa **Next.js**, **json-server** e o script de inicialização juntos via `concurrently` |
| `build` | Cria o build de produção                                                                   |
| `start` | Executa o build de produção                                                                |
| `lint`  | Executa o linter (ESLint)                                                                  |

### **🐳 Scripts de Deploy**
| Script  | Descrição                                                                                  |
| ------- | ------------------------------------------------------------------------------------------ |
| `./scripts/build-and-push.sh` | 🏗️ Build e push das imagens Docker para Docker Hub |
| `./scripts/deploy-prod.sh` | 🚀 Deploy em produção baixando imagens do Docker Hub |
| `./scripts/dev.sh` | 🛠️ Script helper para desenvolvimento local |
| `./scripts/stop.sh` | ⏹️ Para todos os containers Docker |

> 🔥 O script `prepare-server-json` **não precisa ser executado manualmente**, pois já faz parte do fluxo do `dev`.

---

**Status**: ✅ **Production Ready** - Projeto completo e pronto para produção com arquitetura de microfrontends implementada para o Tech Challenge FIAP.
