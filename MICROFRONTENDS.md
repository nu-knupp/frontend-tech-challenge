# 🏦 Banking Microfrontends - Multi-Zone Setup

Este projeto foi configurado como microfrontends usando **Next.js Multi-Zones** com **pnpm workspaces**, seguindo as melhores práticas do guia da Vercel.

## 🏗️ Arquitetura

```
├── apps/
│   ├── banking/        # Shell Principal (porta 3000)
│   │   ├── / (home)
│   │   ├── /login
│   │   └── /register
│   └── dashboard/      # Microfrontend (porta 3001)
│       ├── /transactions
│       └── /analytics
├── packages/           # Pacotes compartilhados
│   ├── shared-types/
│   ├── shared-config/
│   └── eslint-config/
└── db/                # Mock database (json-server)
```

### 🔀 Roteamento Multi-Zone

- **Banking App (Shell)**: Porta 3000
  - Gerencia autenticação e páginas principais
  - Faz proxy para o Dashboard app nas rotas `/transactions` e `/analytics`

- **Dashboard App**: Porta 3001  
  - Serve as páginas de transações e analytics
  - Compartilha o mesmo estado e APIs

## 🚀 Como executar

### Pré-requisitos
```bash
# Instalar pnpm globalmente se não tiver
npm install -g pnpm
```

### Desenvolvimento
```bash
# Instalar todas as dependências
pnpm install

# Iniciar todos os microfrontends
pnpm run dev

# Ou usar o script helper
pnpm run dev:script
```

### Iniciar aplicações individualmente
```bash
# Apenas o Banking app (shell)
pnpm run dev:banking

# Apenas o Dashboard app  
pnpm run dev:dashboard

# Apenas o json-server
pnpm run dev:json
```

## 🌐 URLs de acesso

- **Banking App (Shell)**: http://localhost:3000
- **Dashboard App**: http://localhost:3001  
- **JSON Server API**: http://localhost:3001 (banco mock)

## 📋 Recursos por App

### Banking App (Shell)
- ✅ Página inicial com resumo financeiro
- ✅ Sistema de login/logout
- ✅ Registro de usuários
- ✅ Proxy para transações e analytics

### Dashboard App  
- ✅ Página de transações completa
- ✅ Analytics e gráficos financeiros
- ✅ Gerenciamento de estado compartilhado
- ✅ APIs de transações e balanço

## 🔧 Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm run dev` | Inicia todos os microfrontends |
| `pnpm run build` | Build de produção de todos os apps |
| `pnpm run lint` | Linting de todos os projetos |
| `pnpm run typecheck` | Verificação de tipos TypeScript |
| `pnpm run clean` | Limpa node_modules e builds |

## 🏗️ Workspaces pnpm

O projeto usa **pnpm workspaces** para:
- Compartilhar dependências entre apps
- Gerenciar pacotes internos (`@banking/*`)
- Builds otimizados com Turbo

### Dependências compartilhadas
- `@banking/shared-types`: Tipos TypeScript compartilhados
- `@banking/shared-config`: Configurações do TypeScript
- `@banking/eslint-config`: Regras de linting

## 📝 Configuração Multi-Zone

### Banking App (`next.config.js`)
```javascript
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

### Dashboard App (`next.config.js`)
```javascript
{
  basePath: '/dashboard',
  async rewrites() {
    return [
      {
        source: '/dashboard/transactions/:path*',
        destination: '/transactions/:path*',
      },
      {
        source: '/dashboard/analytics/:path*',
        destination: '/analytics/:path*',
      },
    ];
  }
}
```

## 🔀 Estado compartilhado

- **Zustand**: Gerenciamento de estado global
- **Cookies**: Autenticação compartilhada
- **APIs**: Backend comum via json-server

## 🚀 Deploy

Para produção, cada app pode ser deployed independentemente:

```bash
# Build individual
pnpm run build:banking
pnpm run build:dashboard

# Deploy no Vercel (exemplo)
vercel --cwd apps/banking
vercel --cwd apps/dashboard
```

## 📚 Documentação de referência

- [Next.js Multi-Zones](https://nextjs.org/docs/advanced-features/multi-zones)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Vercel Microfrontends Guide](https://github.com/vercel-labs/microfrontends-nextjs-app-multi-zone)
