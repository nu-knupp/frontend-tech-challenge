# Guia de Execução com Docker

Este guia explica como executar o trabalho Frontend Tech Challenge usando Docker e Docker Compose para avaliação e correção.

## Pré-requisitos

- Docker (versão 20.10 ou superior)
- Docker Compose (versão 2.0 ou superior)

## Arquitetura da Aplicação

A aplicação consiste em dois serviços principais:

1. **json-server**: Uma API REST baseada em JSON que simula um backend
2. **frontend**: Uma aplicação Next.js que implementa a interface do usuário

## Como Executar o Projeto

### 1. Inicializar com Docker Compose

```bash
# Compilar e iniciar todos os serviços
docker-compose up --build

# Ou executar em modo background
docker-compose up --build -d
```

### 2. Acessar a Aplicação

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001

Endpoints da API disponíveis:
- `GET /transactions` - Listar todas as transações
- `POST /transactions` - Criar uma nova transação
- `GET /transactions/:id` - Obter uma transação específica
- `PUT /transactions/:id` - Atualizar uma transação
- `DELETE /transactions/:id` - Deletar uma transação

### 3. Parar a Aplicação

```bash
# Parar todos os serviços
docker-compose down

# Parar e limpar dados (reseta o banco para estado inicial)
docker-compose down -v
```

## Execução para Desenvolvimento vs Avaliação

### Modo de Desenvolvimento (Recomendado para Desenvolvimento)

Para desenvolvimento contínuo:

```bash
npm install
npm run dev
```

### Modo Docker (Recomendado para Avaliação)

O Docker fornece um ambiente isolado e consistente para avaliação:
- Build otimizado do Next.js
- Ambiente de produção simulado
- Configuração automática entre serviços
- Dados persistentes durante a sessão de avaliação

## Como Funcionam os Dados da Aplicação

### Persistência de Dados

A aplicação utiliza bind mounts para manter os dados do JSON Server persistentes durante a avaliação:

```yaml
# Configuração no docker-compose.yml
volumes:
  - ./db:/app/db                    # Dados das transações
  - ./scripts:/app/scripts          # Scripts de inicialização
```

**Dados Armazenados:**
- **Transações**: Salvas em `./db/server.json`
- **Estado da aplicação**: Mantido entre reinicializações dos containers

**Inicialização Automática:**
- Se o arquivo `server.json` não existir, será criado automaticamente
- Dados de exemplo podem ser adicionados para demonstração

### Reset dos Dados

Para começar com dados limpos durante a avaliação:

```bash
# Parar containers e limpar dados
docker-compose down
rm db/server.json

# Reiniciar (criará banco vazio)
docker-compose up --build
```

## Solução de Problemas Durante Avaliação

### Verificar Status dos Containers

```bash
# Ver se os containers estão rodando
docker-compose ps

# Verificar logs em caso de erro
docker-compose logs frontend
docker-compose logs json-server
```

### Problemas Comuns

**Container não inicia:**
```bash
# Verificar se as portas estão livres
docker-compose down
docker-compose up --build
```

**Dados não aparecem na aplicação:**
```bash
# Verificar se o JSON Server está acessível
curl http://localhost:3001/transactions

# Verificar arquivo de dados
cat db/server.json
```

**Aplicação não carrega:**
```bash
# Rebuild completo
docker-compose down
docker-compose up --build --force-recreate
```

### Comandos Úteis para Avaliação

```bash
# Ver logs em tempo real
docker-compose logs -f

# Executar comandos dentro do container
docker-compose exec frontend sh
docker-compose exec json-server sh

# Reiniciar apenas um serviço
docker-compose restart frontend
```
